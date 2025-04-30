"use client";
import Navbar from "@components/Navbar";
import Social from "@components/Social";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
export interface SectionProps {
  children: React.ReactNode;
}
export default function Section({ children }: SectionProps) {
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(pathname === "/login");
  }, [pathname]);
  return (
    <>
      <div className={`relative flex flex-col ${isLogin ? "bg-layout-first":"bg-rov2"} min-h-[90vh]`}>
        <div className={`${isLogin ? "bg-layout-second":""}  p-4`}>
          <main className="relative flex-1 ">
            <div className="flex justify-center">
              <div className="w-[700px] p-2">
                <Navbar />
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="z-10 relative bg-[#0D0F11] text-[#50596A] p-4 flex flex-col gap-2 pt-8 border-t-1 border-t-[#50596A]">
        <Image
          src={"/images/aster.svg"}
          alt="aster"
          width={54}
          height={16}
        ></Image>
        <p className="text-xs">
          Powered by Aster Team © 2025 Arise by INFINITAS
        </p>
        <Social />
      </div>
    </>
  );
}
