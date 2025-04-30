import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";

import React, { useEffect, useState } from "react";
import { Coupons } from "../api/sign-in/coupons.model";
import { useMutation } from "@tanstack/react-query";
import { coupon } from "@libs/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import moment from "moment-timezone";
import { UserInfoEPassport } from "@/types/index";
import CountDown from "./CountDown";

type Props = {
  time: string;
  coupons: Coupons[];
  isWalkIn: boolean;
  refresh: () => void;
};

export default function CouponsUsage({
  time,
  coupons,
  isWalkIn,
  refresh,
}: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedCoupon, setSelectedCoupon] = useState<string>("");

  const timezone = "Asia/Bangkok";
  const specificDate = moment.tz(time, "YYYY-MM-DD HH:mm", timezone);
  const [eligible, setEligible] = useState(false);
  const now = moment().tz(timezone);

  const submit = () => {
    if (selectedCoupon == "") return;
    useCoupon.mutate();
  };

  const useCoupon = useMutation({
    mutationKey: ["useCoupon"],
    mutationFn: async () => {
      return await coupon(selectedCoupon);
    },
    onMutate: () => {},
    onError: (error: AxiosError) => {
      console.log(error);
      toast.dismiss();
      // @ts-ignore
      toast.error(error.response?.data.message);
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Use coupon successfully.");
      refresh();
      onClose();
    },
    onSettled: () => {},
  });

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
    <>
      <div
        className={`flex justify-center items-center bg-black/80 rounded-lg py-12 flex-col px-4 ${
          isWalkIn ? "border-warning" : "border-primary"
        } border-2`}
      >
        <p className="text-white text-2xl italic bold text-center">
          My Coupons
        </p>
        <div className="container mx-auto">
          <div className="relative wrap overflow-hidden  h-full">
            <div className="flex justify-center items-center mb-8 flex-col">
              <p
                className={`text-2xl uppercase text-center italic ${
                  isWalkIn ? "text-warning" : "text-primary"
                } font-bold`}
              >
                {isWalkIn ? "Walk-In" : "Pre-Registered"}
              </p>
              {(isWalkIn && !eligible) &&
              <div className="my-4">
                <CountDown targetDate={time} />
              </div>
              }
              <p className="text-white/80 text-center">
                *You will be entitled to dine during the{" "}
                <span className="font-bold text-lg uppercase italic">
                  {isWalkIn ? "second" : "first"}
                </span>{" "}
                round.
              </p>
            </div>
            {(isWalkIn && eligible || (!isWalkIn)) && coupons.map((c, k) => {
              return (
                <div className="flex flex-col mb-4" key={k}>
                  <div className="flex flex-row justify-between items-center">
                    {c.maxUsage != 0 ? (
                      <p className="font-bold text-xl text-white">
                        {c.categoryName} ({c.usage}/{c.maxUsage})
                      </p>
                    ) : (
                      <p className="font-bold text-xl text-white">
                        {c.categoryName} (free)
                      </p>
                    )}
                    {c.maxUsage != 0 ? (
                      <Button
                        onPress={() => {
                          onOpen();
                          setSelectedCoupon(c.id);
                        }}
                        isDisabled={!c.status}
                        color={`${isWalkIn ? "warning" : "primary"}`}
                        variant="bordered"
                        className="rounded-full text-white text-md w-[120px] font-bold disabled:bg-gradient-to-r from-[#4E7D8A] to-[#6D8677] disabled:text-[#0B1534] disabled:border-none"
                      >
                        Use Coupon
                      </Button>
                    ) : (
                      <></>
                    )}
                  </div>
                  <ul className="py-0 px-2 mt-2">
                    {c.couponItems.map((i, j) => {
                      return <li className="text-white text-lg">- {i.name}</li>;
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        placement={"center"}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={false}
        hideCloseButton={true}
        onClose={refresh}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                <p
                  className={`text-2xl mt-4 uppercase font-bold ${
                    isWalkIn ? "text-warning" : "text-primary"
                  }`}
                >
                  Confirm to use this coupon
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="text-lg bold text-gray-600 uppercase text-center">
                    *Show this screen to the staff to redeem your coupon only.
                    {/* {Number(selectAct?.id) + 1}.{selectAct?.title} */}
                  </p>
                  {/* <QRCode value={`[${uuid},${selectAct?.uuid}]`} /> */}
                </div>
                <div className="flex flex-col justify-center items-center mt-6 mb-6 gap-8">
                  <Button
                    onPress={() => {
                      submit();
                    }}
                    isLoading={useCoupon.isPending}
                    color={`${isWalkIn ? "warning" : "primary"}`}
                    variant="solid"
                    className="rounded-full text-white text-lg w-[140px] disabled:bg-gradient-to-r from-[#4E7D8A] to-[#6D8677] disabled:text-[#0B1534] disabled:border-none"
                  >
                    Use 1 Coupon
                  </Button>
                  <Button color="danger" onPress={onClose} variant="light">
                    Close
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
