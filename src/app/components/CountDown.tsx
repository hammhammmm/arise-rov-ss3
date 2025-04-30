"use client";
import React, { useEffect, useState } from "react";
import moment from "moment-timezone";

type Props = { targetDate: string };

export default function CountDown({ targetDate }: Props) {
  const calculateTimeLeft = () => {
    const now = moment().tz("Asia/Bangkok"); // Timezone +7
    const target = moment(targetDate).tz("Asia/Bangkok");
    const difference = target.diff(now);

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const addLeadingZeros = (value: string) => {
    value = String(value);
    while (value.length < 2) {
      value = '0' + value;
    }
    return value;
  }

  return (
    <div className="flex gap-2 justify-center items-center ">
      <div className="bold basis-1/8 flex items-center justify-center text-3xl text-white bg-black/50 border-cyan-400/50 border-3 w-[45px] h-[70px] rounded-lg shadow-2xl drop-shadow-lg">{addLeadingZeros(timeLeft.hours.toString())[0]}</div>
      <div className="bold basis-1/8 flex items-center justify-center text-3xl text-white bg-black/50 border-cyan-400/50 border-3 w-[45px] h-[70px] rounded-lg shadow-2xl drop-shadow-lg">{addLeadingZeros(timeLeft.hours.toString())[1]}</div>
      <div className="bold basis-1/8"><p className="text-white text-4xl">:</p></div>
      <div className="bold basis-1/8 flex items-center justify-center text-3xl text-white bg-black/50 border-cyan-400/50 border-3 w-[45px] h-[70px] rounded-lg shadow-2xl drop-shadow-lg">{addLeadingZeros(timeLeft.minutes.toString())[0]}</div>
      <div className="bold basis-1/8 flex items-center justify-center text-3xl text-white bg-black/50 border-cyan-400/50 border-3 w-[45px] h-[70px] rounded-lg shadow-2xl drop-shadow-lg">{addLeadingZeros(timeLeft.minutes.toString())[1]}</div>
      <div className="bold basis-1/8"><p className="text-white text-4xl">:</p></div>
      <div className="bold basis-1/8 flex items-center justify-center text-3xl text-white bg-black/50 border-cyan-400/50 border-3 w-[45px] h-[70px] rounded-lg shadow-2xl drop-shadow-lg">{addLeadingZeros(timeLeft.seconds.toString())[0]}</div>
      <div className="bold basis-1/8 flex items-center justify-center text-3xl text-white bg-black/50 border-cyan-400/50 border-3 w-[45px] h-[70px] rounded-lg shadow-2xl drop-shadow-lg">{addLeadingZeros(timeLeft.seconds.toString())[1]}</div>
    </div>
  );
}
