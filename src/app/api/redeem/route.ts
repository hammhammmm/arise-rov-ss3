import { Act, Coupon } from "@/types/index";
import { createClient } from "@supabase/supabase-js";
import { importJWK, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { RovActs } from "@components/Daily";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const POST = async (req: Request, res: Response) => {
  const { code } = await req.json();
  console.log(code);

  const uuid = code[0];
  const actId = code[1];

  console.log("uuid: ", uuid);
  console.log("actId: ", actId);

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
  const TB_ARISE_CONNEXT = process.env.TB_ARISE_CONNEXT as string;


  try {
    const userInfo =
      await supabase
        .from(TB_ARISE_CONNEXT)
        .select("*")
        .eq("uuid", uuid);

    if (userInfo.error) {
      return NextResponse.json(
        { message: "Failed fetching data .", code: 4004 },
        { status: 404 }
      );
    }

    console.log("arise_epassport: ", userInfo.error);

    const activities: RovActs[] = userInfo && userInfo.data[0].acts;

    console.log(  "activities: ", activities);

    activities.forEach((act) => {
      if (act.id == actId) {
        if (act.isRedeemed) {
          return NextResponse.json(
            { message: "Acitivity is already redeemed.", code: 4006 },
            { status: 404 }
          );
        }
        act.isRedeemed = true;
        act.updatedBy = String(email);
      }
    });

    console.log(  "activities: ", activities);


    const { data, error } = await supabase
      .from(TB_ARISE_CONNEXT)
      .update({
        acts: activities,
      })
      .eq("uuid", uuid);

    console.log("update data", data);

    return NextResponse.json(
      {
        message: `Update coupon successfully.`,
        data: data && data[0],
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
