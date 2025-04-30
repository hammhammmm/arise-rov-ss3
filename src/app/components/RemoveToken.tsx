"use server"
import { cookies } from "next/headers";

export default async function RemoveToken(name:string) {
  return await cookies().delete(name)
}
