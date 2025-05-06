import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Image,
} from "@nextui-org/react";
import { Dispatch, SetStateAction, useState } from "react";

import { Act } from "@/types/index";

import { toast } from "sonner";
import { haversineDistance } from "@libs/common";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { number } from "yup";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { checkIn } from "@libs/api";
import { AxiosError, AxiosResponse } from "axios";
import QRCode from "qrcode";

type ROVStatus = "past" | "today" | "future" | "future_or_past";
export type RovActs = {
  id: string;
  dayChecked: string;
  isChecked: boolean;
  isRedeemed: boolean;
  status?: ROVStatus;
  updatedBy?: string;
};

type Props = {
  days: string[];
  rovActs: RovActs[];
  uuid: string;
  refresh: () => void;
};

export default function Daily({ days, rovActs, uuid, refresh }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectAct, setSelectAct] = useState<RovActs>();
  const [qrUrl, setQrUrl] = useState<string>("");

  // ask for / check geolocation permission
  const requestGeo = async () => {
    try {
      const status = await navigator.permissions.query({ name: "geolocation" });

      if (status.state === "granted" || status.state === "prompt") {
        const { coords } = (await getPosition()) as GeolocationPosition;
        calculateDistance(
          coords.latitude,
          coords.longitude,
          Number(process.env.NEXT_PUBLIC_MAIN_LOCATION_LAT),
          Number(process.env.NEXT_PUBLIC_MAIN_LOCATION_LON)
        );
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

    if (distance > Number(process.env.NEXT_PUBLIC_DISTANCE_RADIUS)) {
      return toast.error(
        `You are too far from ${process.env.NEXT_PUBLIC_MAIN_LOCATION_NAME}.`
      );
    }
    if (distance < Number(process.env.NEXT_PUBLIC_DISTANCE_RADIUS)) {
      return confirm.mutate();
    }
  };

  const today = moment().tz("Asia/Bangkok").startOf("day");

  const result: RovActs[] = days.map((dateStr) => {
    const date = moment
      .tz(dateStr, "YYYY-MM-DD", "Asia/Bangkok")
      .startOf("day");
    const existing = rovActs.find((item) => item.dayChecked === dateStr);

    let status: "past" | "today" | "future";
    if (date.isSame(today)) {
      status = "today";
    } else if (date.isBefore(today)) {
      status = "past";
    } else {
      status = "future";
    }
    return {
      id: existing?.id || uuidv4(),
      dayChecked: date.format("YYYY-MM-DD"),
      isChecked: existing?.isChecked || false,
      isRedeemed: existing?.isRedeemed || false,
      status,
    };
  });

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

  const generateQR = async (text: string) => {
    console.log("text: ", text);
    QRCode.toDataURL(text)
      .then((url) => {
        setQrUrl(url);
        console.log("url: ", url);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <p className="text-white text-2xl">Today Event</p>
      {result.filter((day) => day.status === "today").length > 0 ? (
        result
          .filter((day) => day.status === "today")
          .map((day, index) => (
            <CardRov
              key={day.id}
              index={index}
              day={day}
              requestGeo={requestGeo}
              onOpen={() => {
                generateQR(`[${uuid},${day.id}]`);
                onOpen();
              }}
              confirm={confirm}
              setSelectAct={setSelectAct}
            />
          ))
      ) : (
        <p className="text-white/60 text-center">No Today Event</p>
      )}

      <Divider className="border-red-100 bg-white/15 my-4" />

      <p className="text-white text-2xl">Upcoming Event</p>

      {result.filter((day) => day.status === "future").length > 0 ? (
        result
          .filter((day) => day.status === "future")
          .map((day, index) => (
            <CardRov
              key={day.id}
              index={index}
              day={day}
              requestGeo={requestGeo}
              onOpen={onOpen}
              confirm={confirm}
              setSelectAct={setSelectAct}
            />
          ))
      ) : (
        <p className="text-white/60 text-center">No Future Event</p>
      )}

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
                  <p className="text-2xl bold text-white uppercase text-center">
                    {today.format("dddd DD MMMM YYYY")}
                  </p>
                  <p>{`[${uuid},${selectAct?.id}]`}</p>
                  {/* <QRCode value={`[${uuid},${selectAct?.id}]`} /> */}
                  {/* <QRCode value={`[${uuid},${selectAct?.id}]`} /> */}

                  {/* <QRCodeCanvas value={"TEST"} size={300} /> */}
                  <img src={qrUrl} alt="" width={400} height={400}></img>
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

type CardRovProps = {
  index: number;
  day: RovActs;
  requestGeo: () => void;
  onOpen: () => void;
  confirm: UseMutationResult<
    AxiosResponse<any, any>,
    AxiosError<unknown, any>,
    void,
    void
  >;
  setSelectAct: Dispatch<SetStateAction<RovActs | undefined>>;
};

const CardRov = ({
  day,
  index,
  requestGeo,
  onOpen,
  confirm,
  setSelectAct,
}: CardRovProps) => {
  return (
    <div className="bg-black/40 rounded-3xl text-gray-300  p-8" key={index}>
      <div className="flex  justify-between items-center">
        <p className="text-sm">
          {moment(day.dayChecked).format("ddd DD MMMM YYYY")}
        </p>
        <p className="font-bold">
          {day.isChecked && day.isRedeemed ? "Completed" : ""}
        </p>
      </div>
      <Divider className="border-red-100 bg-white/15 my-4" />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p>Check in</p>
          <Button
            className="rounded-full button-primary text-lg w-[140px]"
            onPress={requestGeo}
            isLoading={confirm.isPending}
            isDisabled={day.status !== "today" || day.isChecked}
          >
            {day.isChecked ? "Checked" : "Check in"}
          </Button>
        </div>
        <div className="flex justify-between items-center">
          <p>Food & Beverage</p>
          <Button
            className="rounded-full button-primary text-lg w-[140px]"
            isDisabled={
              day.status !== "today" || day.isRedeemed || !day.isChecked
            }
            onPress={() => {
              onOpen();
              setSelectAct(day);
            }}
          >
            {day.isRedeemed ? "Redeemed" : "Get QR"}
          </Button>
        </div>
      </div>
    </div>
  );
};
