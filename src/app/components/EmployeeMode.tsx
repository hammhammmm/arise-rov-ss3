import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

export default function EmployeeMode({}: Props) {
  const router = useRouter();
  return (
    <div className="flex flex-row justify-end w-full">
      <Button className="text-lg" color="warning" onPress={()=>{
        router.push("/")
      }}>Employee Mode</Button>
    </div>
  );
}
