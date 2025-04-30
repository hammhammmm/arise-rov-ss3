import { Act, Coupon } from "@/types/index";
import { createClient } from "@supabase/supabase-js";
import { importJWK, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

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

  try {
    const { data: arise_epassport, error: arise_epassport_error } =
      await supabase
        .from(`${process.env.TB_ARISE_EPASSPORT}`)
        .select(`acts,is_completed,is_bonus`)
        .eq("uuid", uuid);

    if (arise_epassport_error) {
      return NextResponse.json(
        { message: "Failed fetching data .", code: 4004 },
        { status: 404 }
      );
    }

    console.log("arise_epassport: ", arise_epassport);

    const activities: Act[] = arise_epassport && arise_epassport[0].acts;

    activities.forEach((act) => {
      if (act.uuid == actId) {
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

    const countRedeemed = activities.filter((act) => act.isRedeemed).length;
    console.log(countRedeemed);

    const { data, error } = await supabase
      .from(`${process.env.TB_ARISE_EPASSPORT}`)
      .update({
        acts: activities,
        is_completed: countRedeemed >= Number(process.env.NEXT_PUBLIC_MIN_ACT),
        is_bonus: countRedeemed === Number(process.env.NEXT_PUBLIC_MAX_ACT),
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
