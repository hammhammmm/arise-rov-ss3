"use server";

import { acts, coupons } from "@/config/config";
import { Eligible } from "@/types/index";
import { createClient } from "@supabase/supabase-js";
import { SignJWT, importJWK, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

interface Act {
  id: number;
  uuid: string;
  title: string;
  isRedeemed: boolean;
  updatedAt: number;
  updatedBy: string;
  status: boolean;
}

export const POST = async (req: Request, res: Response) => {
  const currentTime = new Date();
  const timeZoneOffset = 0 * 60;
  const now = currentTime.getTime() + timeZoneOffset * 60 * 1000;
  try {
    const cookieStore = cookies();
    const eligibleToken = cookieStore.get("eligible");

    if (!eligibleToken) {
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
    const { payload } = await jwtVerify(eligibleToken.value, secretKey);

    console.log("payload:", payload);
    if (!payload) {
      return NextResponse.json(
        { message: "Failed unauthorized.", code: 4002 },
        { status: 401 }
      );
    }

    const eligible = payload.eligible as Eligible;
    const email = eligible.email;
    const employeeId = eligible.employee_id;

    // Check registerd or not
    let { data: checkRegister, error: checkRegisterError } = await supabase
      .from(process.env.TB_ARISE_REGISTERED as string)
      .select("*")
      .eq("employee_id", String(employeeId));

    const is_registered =
      checkRegister && checkRegister.length > 0 ? true : false;

    const arise_checkin = await supabase
      .from(process.env.TB_ARISE_CONNEXT as string)
      .insert([
        {
          employee_id: eligible.employee_id,
          email: eligible.email,
          first_name: eligible.first_name,
          last_name: eligible.last_name,
          is_walkin: !is_registered,
          created_at: now,
          updated_at: now,
          source: "",
        },
      ]);

    const token = await new SignJWT({ email, employeeId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("8h")
      .sign(secretKey);

    cookies().set("token", token, {
      httpOnly: true,
      secure: true,
    });

    cookies().delete("eligible");

    // for e-passport
    const arise_epassport = await supabase
      .from(process.env.TB_ARISE_EPASSPORT as string)
      .insert([
        {
          employee_id: eligible.employee_id,
          email: eligible.email,
          acts: acts,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

    if (arise_epassport.error) {
      console.log("arise_epassport.error: ", arise_epassport.error);
      return NextResponse.json(
        { message: "You have already received an e-passport.", code: 4000 },
        { status: 400 }
      );
    }

    // for coupons
    const arise_coupons = await supabase
      .from(process.env.TB_ARISE_COUPONS_USAGE as string)
      .insert([
        {
          employee_id: eligible.employee_id,
          email: eligible.email,
          coupons: coupons,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

    if (arise_coupons.error) {
      console.log("arise_checkin.error: ", arise_coupons.error);
      return NextResponse.json(
        { message: "You have already received a coupons.", code: 4000 },
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
