"use client"
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type Props = {};

export default function PageNotFound({}: Props) {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center flex-col gap-6 mt-12">
      <p className="text-5xl text-white">Page No Found</p>
      <Button
        color="primary"
        size="lg"
        onPress={() => {
          router.replace("/");
        }}
      >
        back to home
      </Button>
    </div>
  );
}
