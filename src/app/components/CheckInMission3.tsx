"use client";
import { Act } from "@/types/index";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import QRCode from "react-qr-code";

type Props = {
  act: Act | undefined;
  uuid: string;
  refresh: () => void;
};

export default function CheckInMission3({ act, uuid, refresh }: Props) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectAct, setSelectAct] = useState<Act | undefined>(act);
  const [checkin, setCheckin] = useState(false);


  return (
    <div className="flex justify-center items-center mt-6 mb-2 flex-col">
      {selectAct?.isRedeemed ? (
        <p className="text-white/60 text-2xl italic">Checked</p>
      ) : (
        <Button
          isDisabled={selectAct?.isRedeemed}
          className=" italic text-white glowButton
             font-bold
             rounded-lg text-xl px-10 py-2 text-center mb-2 min-w-[160px] h-[64px] disabled:opacity-30 w-full uppercase"
          onPress={() => {
            onOpen();
          }}
        >
          {`Costume Check!`}
        </Button>
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
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                Please show this QR code to redeem.
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="text-3xl bold text-blue-900 uppercase text-center">
                    {Number(selectAct?.id) + 1}.{selectAct?.title}
                  </p>
                  <QRCode value={`[${uuid},${selectAct?.uuid}]`} />
                </div>
                <div className="flex justify-center items-center mt-6 mb-6">
                  <Button
                    color="primary"
                    onPress={() => {
                      router.refresh();
                      onClose();
                    }}
                    variant="bordered"
                  >
                    Close
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
