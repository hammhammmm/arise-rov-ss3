"use client";
import { checkIn } from "@libs/api";
import { Button } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import moment from "moment-timezone";
import React, { useEffect, useState } from "react";

type Props = {
  time: string;
  refresh: () => void;
};

export default function CheckIn({ time, refresh }: Props) {
  const timezone = "Asia/Bangkok";
  const specificDate = moment.tz(time, "YYYY-MM-DD HH:mm", timezone);
  const [eligible, setEligible] = useState(false);
  const now = moment().tz(timezone);


  useEffect(() => {
    if (now.isBefore(specificDate)) {
      // Set up an interval to check the time every second
      const interval = setInterval(() => {
        const now = moment().tz(timezone);
        setEligible(!now.isBefore(specificDate));
        console.log("Time checked:", now.format());
      }, 1000);
      // Clean up the interval on component unmount
      return () => clearInterval(interval);
    } else {
      setEligible(true);
    }
  }, [specificDate, timezone]);

  const confirm = useMutation({
    mutationFn: async () => {
      return await checkIn();
    },
    onMutate: () => {},
    onError: (error: AxiosError) => {
      console.log(error);
      //@ts-ignore
      toast.error(error.response?.data.message);
    },
    onSuccess: (data) => {},
    onSettled: () => {
      refresh();
    },
  });

  return (
    <>
      <Button
        onPress={() => {
          confirm.mutate();
        }}
        isLoading={confirm.isPending}
        isDisabled={!eligible}
        className="relative  bg-gradient-to-br w-full
hover:bg-gradient-to-bl
    font-bold
    rounded-lg text-xl px-10 py-2 text-center min-w-[160px] h-[64px] disabled:opacity-30  bg-[#FCD11A]"
        type="submit"
      >
        Check-in
      </Button>
    </>
  );
}
