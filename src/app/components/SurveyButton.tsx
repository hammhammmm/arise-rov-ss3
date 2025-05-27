import { Button } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import moment from "moment-timezone";

type Props = {
  time: string;
};

export default function SurveyButton({ time }: Props) {
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
  return (
    <Button
      className="rounded-full button-primary text-lg"
      isDisabled={!eligible}
    >
      <a
        href={`${process.env.NEXT_PUBLIC_SURVEY_URL}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Go now
      </a>
    </Button>
  );
}
