"use server"
import { cookies } from "next/headers";

export default async function GetToken(name:string) {
  const cookie = await cookies().get(name);
  if (!cookie) {
    return;
  }
  return cookie.value;
}
