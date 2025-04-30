import { Act, Coupon } from "@/types/index";
import { createClient } from "@supabase/supabase-js";
import { importJWK, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Coupons } from "../sign-in/coupons.model";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const POST = async (req: Request, res: Response) => {
  const { id } = await req.json();

  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json(
      { message: "Failed data not found.", code: 4001 },
      { status: 401 }
    );
  }

  const secretJWK = {
    kty: "oct",
    k: process.env.JOSE_SECRET,
  };
  const secretKey = await importJWK(secretJWK, "HS256");
  const { payload } = await jwtVerify(token.value, secretKey);

  if (!payload) {
    return NextResponse.json(
      { message: "Failed unauthorized.", code: 4002 },
      { status: 401 }
    );
  }

  const email = payload.email;

  try {
    const query_arise_coupon = await supabase
      .from(`${process.env.TB_ARISE_COUPONS_USAGE}`)
      .select(`coupons`)
      .eq("email", email);

    if (query_arise_coupon.error) {
      return NextResponse.json(
        { message: "Failed fetching data .", code: 4004 },
        { status: 404 }
      );
    }

    console.log("arise_coupon: ", query_arise_coupon.data);

    const coupons: Coupons[] =
      query_arise_coupon.data && query_arise_coupon.data[0].coupons;

    coupons.forEach((c) => {
      if (c.id == id) {
        if (c.usage >= c.maxUsage) {
          return NextResponse.json(
            {
              message: "Your coupon usage has exceeded your allocated quota.",
              code: 4006,
            },
            { status: 404 }
          );
        }

        c.usage = c.usage + 1;
        c.status = c.usage >= c.maxUsage ? false : true;
      }
    });

    const update_arise_coupon = await supabase
      .from(`${process.env.TB_ARISE_COUPONS_USAGE}`)
      .update({
        coupons: coupons,
      })
      .eq("email", email);

    console.log("update data", update_arise_coupon.data);

    if (update_arise_coupon.error) {
      return NextResponse.json(
        { message: "Failed updating data .", code: 4004 },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `Update coupon successfully.`,
        data: update_arise_coupon.data && update_arise_coupon.data[0],
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Internal error please try again.", code: 5001 },
      { status: 500 }
    );
  }
};

export const dynamic = "force-dynamic";
