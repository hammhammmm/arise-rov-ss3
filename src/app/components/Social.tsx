"use client";
import { Button } from "@nextui-org/react";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Props = {};

export default function Social({}: Props) {
  return (
    <div className="flex justify-center p-4 relative">
      <div className="flex flex-col w-full items-center gap-4">
        <div className="">
          <Button
            isIconOnly
            className=" bg-transparent"
            onPress={() => {
              window.open(
                "https://www.facebook.com/ARISEBYINFINITAS/",
                "_blank"
              );
            }}
          >
            <Image
              src={"/images/socials/facebook.png"}
              alt={""}
              width={32}
              height={32}
            ></Image>
          </Button>

          <Button
            isIconOnly
            className=" bg-transparent"
            onPress={() => {
              window.open("https://www.tiktok.com/@arisebyinfinitas", "_blank");
            }}
          >
            <Image
              src={"/images/socials/tiktok.png"}
              alt={""}
              width={32}
              height={32}
            ></Image>
          </Button>

          <Button
            isIconOnly
            className=" bg-transparent"
            onPress={() => {
              window.open(
                "https://www.youtube.com/@arisebyinfinitas",
                "_blank"
              );
            }}
          >
            <Image
              src={"/images/socials/youtube.png"}
              alt={""}
              width={32}
              height={32}
            ></Image>
          </Button>
          <Button
            isIconOnly
            className=" bg-transparent"
            onPress={() => {
              window.open(
                "https://th.linkedin.com/company/arise-by-infinitas",
                "_blank"
              );
            }}
          >
            <Image
              src={"/images/socials/linkedin.png"}
              alt={""}
              width={32}
              height={32}
            ></Image>
          </Button>
          <Button
            isIconOnly
            className=" bg-transparent"
            onPress={() => {
              window.open(
                "https://www.instagram.com/arisebyinfinitas/",
                "_blank"
              );
            }}
          >
            <Image
              src={"/images/socials/instagram.png"}
              alt={""}
              width={32}
              height={32}
            ></Image>
          </Button>
        </div>
        <p className="font-light text-[#FEFEFE] text-xs">
          Powered by Aster Team © 2025 Arise by INFINITAS
        </p>
      </div>
    </div>
  );
}
