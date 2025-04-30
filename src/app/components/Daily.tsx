"use client";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

import { Act } from "@/types/index";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { haversineDistance } from "@libs/common";

type Props = {
  acts: Act[];
  uuid: string;
  refresh: () => void;
};

export default function Daily({ acts, uuid, refresh }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectAct, setSelectAct] = useState<Act>();

  // ask for / check geolocation permission
  const requestGeo = async () => {
    try {
      const status = await navigator.permissions.query({ name: "geolocation" });

      if (status.state === "granted" || status.state === "prompt") {
        const { coords } = (await getPosition()) as GeolocationPosition;
        console.log(await getPosition())
        // calculateDistance(
        //   coords.latitude,
        //   coords.longitude,
        //   13.7212551,
        //   100.5583281
        // );
        // return await getPosition();
      }

      if (status.state === "denied") {
        // Call once more—will reprompt only if denial wasn’t permanent
        try {
          return await getPosition();
        } catch (err) {
          showEnableLocationSteps();
          throw err;
        }
      }
    } catch (err) {
      console.error(err);

      // optional fallback logic here
    }
  };

  // grab the current position
  const getPosition = (
    options = { enableHighAccuracy: true, timeout: 10_000 }
  ) =>
    new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, options)
    );

  // guide the user to manually re-enable location
  const showEnableLocationSteps = () => {
    toast.error(
      "We can't access your location. Please check your browser settings."
    );
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const distance = haversineDistance(lat1, lon1, lat2, lon2);
    console.log("Distance: ", distance);

    if (distance > 0.5) {
      return toast.error(`You are too far from .`);
    }
  };

  return (
    <>
      {acts
        .filter((act) => act.status)
        .map((act, index) => (
          <div
            className="bg-black/40 rounded-3xl text-gray-300  p-8"
            key={index}
          >
            <div className="flex  justify-between items-center">
              <p className="font-bold">Day 1</p>
              <p className="text-sm">14 May 2025</p>
            </div>
            <Divider className="border-red-100 bg-white/15 my-4" />
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p>Check in</p>
                <Button
                  className="rounded-full button-primary text-lg"
                  onPress={requestGeo}
                >
                  Check in
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <p>Food & Beverage</p>
                <Button
                  className="rounded-full button-primary text-lg"
                  isDisabled={act.isRedeemed}
                  onPress={() => {
                    onOpen();
                    setSelectAct(act);
                  }}
                >
                  Redeem
                </Button>
              </div>
            </div>
          </div>
        ))}
      <Modal
        isOpen={isOpen}
        placement={"center"}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={false}
        hideCloseButton={true}
        onClose={refresh}
      >
        <ModalContent className="rounded-3xl modal-wrapper">
          {(onClose) => (
            <>
              <ModalBody>
                <div className="flex flex-col items-center justify-center gap-4">
                  {/* <p className="text-xl bold text-blue-900 uppercase text-center">
                {Number(selectAct?.id) + 1}.{selectAct?.title}
              </p> */}
                  <QRCode value={`[${uuid},${selectAct?.uuid}]`} />
                  <p className="text-2xl text-white font-bold">
                    Food & Beverage QR
                  </p>
                  <p className="text-center text-gray-400">
                    Show to staff to redeem your refreshments.
                  </p>
                </div>
                <div className="flex justify-center items-center mt-6 mb-6">
                  <Button
                    onPress={onClose}
                    className="rounded-full button-primary text-lg w-full"
                  >
                    Ok
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
