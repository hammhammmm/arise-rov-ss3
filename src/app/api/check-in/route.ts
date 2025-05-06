"use server";

import { Eligible } from "@/types/index";
import { RovActs } from "@components/Daily";
import { createClient } from "@supabase/supabase-js";
import { importJWK, jwtVerify } from "jose";
import moment, { tz } from "moment-timezone";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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

    const TB_ARISE_CONNEXT = process.env.TB_ARISE_CONNEXT as string;
    const today = moment()
      .tz("Asia/Bangkok")
      .startOf("day")
      .format("YYYY-MM-DD");
    console.log("today: ", today);
    const rovActs: RovActs = {
      id: uuidv4(),
      dayChecked: today,
      isChecked: true,
      isRedeemed: false,
    };

    console.log("rovActs: ", rovActs);

    let query = await supabase
      .from(TB_ARISE_CONNEXT)
      .select(`*`)
      .eq("email", email);

    if (query.error) {
      console.log("arise_checkin.error: ", query.error);
      return NextResponse.json(
        { message: "Failed to retrieve data.", code: 4003 },
        { status: 400 }
      );
    }

    console.log("query.data: ", query.data);
    console.log("query.data[0]: ", query.data[0].acts);
    const acts:RovActs[] = query.data[0].acts;

    const { data, error } = await supabase
      .from(TB_ARISE_CONNEXT)
      .update({ acts: [...acts, rovActs], updated_at: moment().tz("Asia/Bangkok").valueOf() })
      .eq("employee_id", employeeId);

    if (error) {
      console.log("arise_checkin.error: ", error);
      return NextResponse.json(
        { message: "You have already check-in.", code: 4000 },
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
