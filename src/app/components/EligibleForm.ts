"use server";
import { Eligible } from "@/types/index";
import { importJWK, SignJWT } from "jose";
import { cookies } from "next/headers";

export default async function EligibleForm(eligible: Eligible) {
  console.log("eligible >>>>>>>>>>>", eligible);
  const secretJWK = {
    kty: "oct",
    k: process.env.JOSE_SECRET,
  };

  const secretKey = await importJWK(secretJWK, "HS256");

  const token = await new SignJWT({ eligible })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2m")
    .sign(secretKey);

  cookies().set("eligible", token, {
    httpOnly: true,
    secure: true,
  });
}
