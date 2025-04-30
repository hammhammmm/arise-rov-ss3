"use client";

import { getWorkingHours } from "@libs/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import moment from "moment-timezone";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {};

export default function ClosePage({}: Props) {
  const router = useRouter();
  const workingHours = useMutation({
    mutationFn: async () => {
      return await getWorkingHours();
    },
    onSuccess: async (data: AxiosResponse) => {
      console.log(data);
      if (data.status == 200) {
        const timezone = "Asia/Bangkok";
        const open = moment.tz(
          data.data.data.open,
          "YYYY-MM-DD HH:mm",
          timezone
        );
        const close = moment.tz(
          data.data.data.close,
          "YYYY-MM-DD HH:mm",
          timezone
        );
        const now = moment().tz(timezone);
        if (now.isBetween(open, close)) {
          router.push("/");
        }
      }
    },
  });

  useEffect(() => {
    workingHours.mutate();
  }, []);

  return (
    <div className="text-center text-white mt-12">
      <p className="text-3xl italic">Arise Connext is closed. </p>
      <p className="text-lg">See you next time.</p>
    </div>
  );
}
