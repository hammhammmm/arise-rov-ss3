import { Staff } from "@/types/index";
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
    let ariseStaff = await supabase
      .from(process.env.TB_ARISE_STAFF as string)
      .select(
        `*
        `
      )
      .eq("email", email);

    if (ariseStaff.error) {
      console.log(ariseStaff.error);
      return NextResponse.json(
        { message: "Internal error please try again.", code: 5002 },
        { status: 500 }
      );
    }

    if (
      ariseStaff == null ||
      ariseStaff.data.length == 0 ||
      ariseStaff.data == null
    ) {
      return NextResponse.json(
        { message: "You do not have role.", code: 4001 },
        { status: 401 }
      );
    }

    const staff: Staff = ariseStaff && ariseStaff.data[0];
    if (staff.role !== 1) {
      return NextResponse.json(
        { message: "You do not have permission.", code: 4002 },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: `Data retreive  successfully.`,
        data: staff,
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