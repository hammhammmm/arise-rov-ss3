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
    const employeeId = payload.employeeId as Eligible;


    console.log("email: >>>>", email);


    const TB_ARISE_CONNEXT = process.env.TB_ARISE_CONNEXT as string;
    const TB_ARISE_MASTER = process.env.TB_ARISE_MASTER as string;
    const TB_ARISE_REDEEMED = process.env.TB_ARISE_REDEEMED as string;

    const { data: masterData, error: masterError } = await supabase
      .from(TB_ARISE_MASTER)
      .select("employee_id")
      .not("size", "is", null)
      .neq("size", "");

    if (masterError) {
      return NextResponse.json(
        { message: "You are not eligible for redemption.", code: 4001 },
        { status: 403 }
      );
    }

    // Extract the emails into an array.
    const validEmployeeId = masterData.map((record) => record.employee_id);

    // Now update the checkin record if its email exists in the list of valid emails.
    const { data, error } = await supabase
      .from(TB_ARISE_CONNEXT)
      .update({ is_redeem: true })
      .eq("employee_id", employeeId)
      .in("employee_id", validEmployeeId);

    if (error) {
      console.log("arise_checkin.error: ", error);
      return NextResponse.json(
        { message: "You have already redeemed.", code: 4000 },
        { status: 400 }
      );
    }

    const { data: redeemItem, error: redeemError } = await supabase
      .from(TB_ARISE_REDEEMED)
      .insert([
        {
          email: email,
          ep: process.env.NEXT_PUBLIC_ARISE_CONNEXT_EP,
          item: "T-SHIRT",
        },
      ]);

      console.log(redeemError)

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
