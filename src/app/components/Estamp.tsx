import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

import { Act } from "@/types/index";
import QRCode from "react-qr-code";

type Props = {
  acts: Act[];
  uuid: string;
  refresh: () => void;
};

export default function Estamp({ acts, uuid, refresh }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectAct, setSelectAct] = useState<Act>();

  const getASTR = () => {
    let astr = 0;
    const countRedeemed = acts.filter(
      (act) => act.isRedeemed && act.status
    ).length;
    if (countRedeemed >= Number(process.env.NEXT_PUBLIC_MAX_ACT)) {
      astr = Number(process.env.NEXT_PUBLIC_MAX_ASTR);
    } else if (countRedeemed >= Number(process.env.NEXT_PUBLIC_MIN_ACT)) {
      astr = Number(process.env.NEXT_PUBLIC_MIN_ASTR);
    } else {
      astr = 0;
    }

    return (
      <>
        <div className="flex flex-col items-center mt-6">
          <p className="text-white text-lg">
            Completed {countRedeemed}/{acts.filter((act) => act.status).length}{" "}
            activities.
          </p>
          <p className="text-white text-3xl bold">
            Earned <span className="text-yellow-400">{astr} ASTR</span>
          </p>
          <p className="text-sm text-white mt-4">
            *Complete {Number(process.env.NEXT_PUBLIC_MIN_ACT)} activities to
            receive {Number(process.env.NEXT_PUBLIC_MIN_ASTR)} ASTR.
          </p>
          <p className="text-sm text-white">
            **Complete {Number(process.env.NEXT_PUBLIC_MAX_ACT)} activities to
            receive {Number(process.env.NEXT_PUBLIC_MAX_ASTR)} ASTR.
          </p>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="relative wrap overflow-hidden  h-full">
          <div
            className="absolute border-opacity-20 border-gray-400 h-full border"
            style={{ left: "50%" }}
          ></div>
          {acts
            .filter((act) => act.status)
            .map((act, index) => (
              <div
                key={index}
                className="mb-8 flex justify-between items-center w-full"
              >
                <div className={`order-1 w-5/12 text-right`}>
                  <p className="text-white text-sm">{act.title}</p>
                </div>
                <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full">
                  <h1 className="mx-auto text-white font-semibold text-lg">
                    {index + 1}
                  </h1>
                </div>
                <div className={`order-1 w-5/12 text-left`}>
                  <Button
                    onPress={() => {
                      onOpen();
                      setSelectAct(act);
                    }}
                    variant="bordered"
                    className="rounded-full text-white text-md w-[95%] px-1 font-bold disabled:bg-gradient-to-r from-[#4E7D8A] to-[#6D8677] disabled:text-[#0B1534] disabled:border-none"
                    isDisabled={act.isRedeemed}
                  >
                    {act.isRedeemed ? "Completed" : "Collect Stamp"}
                  </Button>
                </div>
              </div>
            ))}
        </div>
        {getASTR()}
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
                Please show this QR code to redeem.
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="text-xl bold text-blue-900 uppercase text-center">
                    {Number(selectAct?.id) + 1}.{selectAct?.title}
                  </p>
                  <QRCode value={`[${uuid},${selectAct?.uuid}]`} />
                </div>
                <div className="flex justify-center items-center mt-6 mb-6">
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
