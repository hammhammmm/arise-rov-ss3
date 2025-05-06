"use server";

import { Staff, UserInfo } from "@/types/index";
import { createClient } from "@supabase/supabase-js";
import { importJWK, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const GET = async (req: Request, res: Response) => {
  try {
    let role = "employee";
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
    let { data, error } = await supabase
      .from(process.env.TB_ARISE_CONNEXT as string)
      .select(`*`)
      .eq("email", email);

    if (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Failed to retrieve data.", code: 4003 },
        { status: 400 }
      );
    }

    console.log("data;", data);
    if (data?.length == 0 || data == null) {
      return NextResponse.json(
        { message: "Failed data not found.", code: 4004 },
        { status: 404 }
      );
    }
    const userInfo = data && data[0];

    let { data: ariseStaff, error: ariseStaffError } = await supabase
      .from(process.env.TB_ARISE_STAFF as string)
      .select(`*`)
      .eq("email", email);

    if (ariseStaff == null || ariseStaff == null || ariseStaff.length == 0) {
      role = "employee";
    } else {
      if (ariseStaff[0].role == 1) {
        role = "staff";
      }
    }

    console.log("ariseStaffError:", ariseStaffError);

    return NextResponse.json(
      {
        message: `Data retreive  successfully.`,
        data: {
          // @ts-ignore
          ...userInfo,
          role: role,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Internal error please try again.", code: 5001 },
      { status: 500 }
    );
  }
};
