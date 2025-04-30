"use server";

import { Eligible } from "@/types/index";
import { createClient } from "@supabase/supabase-js";
import { SignJWT, importJWK } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const POST = async (req: Request, res: Response) => {
  const { email, employeeId } = await req.json();

  try {
    let { data, error } = await supabase
      .from(process.env.TB_ARISE_REGISTERED as string)
      .select("*")
      .eq("email", String(email).toLowerCase())
      .eq("employee_id", employeeId);

    if (error) {
      console.log("error:", error);
      return NextResponse.json(
        { message: "Failed to find employee please try again.", code: 4002 },
        { status: 400 }
      );
    }

    if (data && data.length == 0) {
      return NextResponse.json(
        { message: "Failed to find employee please try again.", code: 4004 },
        { status: 404 }
      );
    }

    const secretJWK = {
      kty: "oct",
      k: process.env.JOSE_SECRET,
    };

    const secretKey = await importJWK(secretJWK, "HS256");
    const eligible = data && data[0];
    const token = await new SignJWT({ eligible })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("2m")
      .sign(secretKey);

    cookies().set("eligible", token, {
      httpOnly: true,
      secure: true,
    });

    return NextResponse.json(
   {
        message: "Successfully.",
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



