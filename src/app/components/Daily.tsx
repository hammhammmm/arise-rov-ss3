import { Button, Divider } from "@nextui-org/react";
import React from "react";

type Props = {};

export default function Daily({}: Props) {
  return (
    <div className="bg-black/40 rounded-3xl text-gray-300  p-8">
      <div className="flex  justify-between items-center">
        <p className="font-bold">Day 1</p>
        <p className="text-sm">14 May 2025</p>
      </div>
      <Divider className="border-red-100 bg-white/15 my-4" />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p>Check in</p>
          <Button className="rounded-full button-primary text-lg" >
            Check in
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <p>Food & Beverage</p>
          <Button className="rounded-full button-primary text-lg" isDisabled>
            Redeem
          </Button>
        </div>
      </div>
    </div>
  );
}
