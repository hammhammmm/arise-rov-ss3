"use server";

import { Eligible } from "@/types/index";
import { createClient } from "@supabase/supabase-js";
import { importJWK, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const POST = async (req: Request, res: Response) => {
  const { voted } = await req.json();
  try {
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

    console.log("payload:", payload);
    if (!payload) {
      return NextResponse.json(
        { message: "Failed unauthorized.", code: 4002 },
        { status: 401 }
      );
    }

    const email = payload.email as Eligible;
    console.log("email: >>>>" ,email)
    const arise_checkin = await supabase
      .from(process.env.TB_ARISE_CONNEXT as string)
      .update({voted: voted})
      .eq("email", email)
      .eq("voted", 0);

      console.log("data updated >>>>>>>>>",arise_checkin)

    if (arise_checkin.error) {
      console.log("arise_checkin.error: ", arise_checkin.error);
      return NextResponse.json(
        { message: "You have already voted.", code: 4000 },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully.",
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
