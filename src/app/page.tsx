"use client";
import { UserInfoEPassport } from "@/types/index";
import CheckIn from "@components/CheckIn";
import CouponsUsage from "@components/Coupons";
import Estamp from "@components/Estamp";
import StaffMode from "@components/StaffMode";
import { useApp } from "@context/appContext";
import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getUserInfo } from "./libs/api";
import Loading from "./loading";
import Daily, { RovActs } from "@components/Daily";
import { v4 as uuidv4 } from "uuid";

type Props = {};

export default function Page({}: Props) {
  const app = useApp();
  const timeCheckIn = "2025-03-28T07:00:00+07:00";
  const walkInTime = "2025-03-28T11:30:00+07:00";
  const router = useRouter();

  const query = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        return await getUserInfo();
      } catch (err) {
        router.replace("/login");
      }
    },
    retry: false,
    refetchOnWindowFocus: true,
  });

  if (query.isLoading) {
    return <Loading />;
  }

  if (query.error || !query.data) {
    router.replace("/login");
    return;
  }

  const userInfo: UserInfoEPassport = query.data?.data.data;
  console.log(userInfo);
  const refresh = () => {
    query.refetch();
  };

  const days: string[] = String(process.env.NEXT_PUBLIC_TOURNAMENT_DATES).split(
    ","
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 items-center mt-8">
          {userInfo.role == "staff" && <StaffMode time={timeCheckIn} />}
          <Card
            isBlurred
            className="border-none w-full bg-black/40 text-gray-300 rounded-3xl"
            shadow="sm"
          >
            <CardBody>
              <div className="flex justify-between">
                <p className="max-w-[300px]">
                  <span>{userInfo.email}</span>
                </p>
                <p>{userInfo.employee_id}</p>
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Daily
            days={days}
            rovActs={userInfo.acts}
            uuid={userInfo.uuid}
            refresh={refresh}
          />
        </div>

        <div className="feedback-card p-8 flex flex-col gap-4 items-start">
          <div>
            <p className="text-xs">
              Submit your tournament experience on May 29, 2025...
            </p>
            <p className="text-xl title font-bold">Beyond Limits</p>
            <p className="text-sm">
              Your honest thoughts create better tournaments.
            </p>
          </div>
          <Button className="rounded-full button-primary text-lg" isDisabled>
            <a
              href={`${process.env.NEXT_PUBLIC_SURVEY_URL}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Go now
            </a>
          </Button>
        </div>
      </div>

      {/* For Redeem List */}
      {/* <div className="w-full mt-4">
        <RedeemList userInfo={userInfo} refresh={refresh} />
      </div> */}
      {/* <div className="w-full mt-4  bg-blue-800/80 rounded-lg py-8 px-4">
        <p className="text-3xl mb-4 text-center text-white uppercase glow bold">
          Arise Connext {process.env.NEXT_PUBLIC_ARISE_CONNEXT_EP}
        </p>

        <div className=" relative flex justify-center items-center flex-col">
          {!userInfo.checkin.is_checkin ? (
            <>
              <p className="text-white text-md italic bold text-center mb-4">
                Please check-in to redeem your food & drink coupon
              </p>
              <CheckIn time={timeCheckIn} refresh={refresh} />

              <p className="text-sm text-white italic mt-2 bg-black/40 text-center p-4 rounded-lg w-full">
                * This check-in will open on 28 Feb 2025 at 07:00.
              </p>
            </>
          ) : (
            <>
              <div className="w-full mt-4">
                {userInfo.usage && (
                  <CouponsUsage
                    time={walkInTime}
                    coupons={userInfo.usage.coupons}
                    isWalkIn={userInfo.checkin.is_walkin}
                    refresh={refresh}
                  />
                )}
              </div>

              <div className="w-full mt-4">
                <div className="flex justify-center items-center bg-black/80 rounded-lg py-12 flex-col">
                  <p className="text-white text-2xl italic bold text-center mb-4">
                    E-PASSPORT
                  </p>
                  <Estamp
                    acts={userInfo.acts}
                    uuid={userInfo.uuid}
                    refresh={refresh}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div> */}
    </>
  );
}
