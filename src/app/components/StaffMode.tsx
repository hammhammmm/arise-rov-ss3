import { Button } from "@nextui-org/react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  time: string;
};

export default function StaffMode({ time }: Props) {
  const router = useRouter();

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

  if (!eligible) {
    return <></>;
  }
  
  return (
    <div className="flex flex-row justify-end w-full">
      <Button
        className="text-lg"
        color="warning"
        onPress={() => {
          router.push("/redeem");
        }}
      >
        Staff Mode
      </Button>
    </div>
  );
}
