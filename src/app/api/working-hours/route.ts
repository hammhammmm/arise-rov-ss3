import { NextResponse } from "next/server";

export const GET = async (req: Request, res: Response) => {
  try {
    const operatingHours = JSON.parse(String(process.env.WORKING_HOURS));
    const open = operatingHours[0];
    const close = operatingHours[1];

    return NextResponse.json(
      {
        message: `Data retreive  successfully.`,
        data: { open, close },
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
