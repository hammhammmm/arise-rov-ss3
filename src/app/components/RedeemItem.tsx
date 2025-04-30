import { redeemItem } from "@libs/api";
import {
  Button,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";

type Props = {
  refresh: () => void;
  size: string
};

export default function RedeemItem({ refresh, size }: Props) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const confirm = useMutation({
    mutationKey: ["confim"],
    mutationFn: async () => {
      return await redeemItem()
    },
    onMutate: () => {},
    onError: (error: AxiosError) => {
      console.log(error);
      //@ts-ignore
      toast.error(error.response?.data.message);
    },
    onSuccess: () => {
      onClose();
    },
    onSettled: () => {
      refresh();
    },
  });
  return (
    <>
      {" "}
      <Button
        className="relative  bg-gradient-to-br w-full
 hover:bg-gradient-to-bl
     font-bold
     rounded-lg text-xl px-10 py-2 text-center min-w-[160px] h-[64px] disabled:opacity-30  bg-[#FCD11A]"
        type="submit"
        onPress={onOpen}
      >
        Redeem
      </Button>
      <Modal
        isOpen={isOpen}
        placement={"center"}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={false}
        hideCloseButton={true}
        onClose={() => {
          refresh();
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                COLLECT YOUR T-SHIRT
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="text-5xl italic bold">SIZE: {size}</p>
                  <p className="text-2xl text-center">
                    Are you about to collect your T-shirt and show this screen to
                    the staff to confirm the T-shirt size?
                  </p>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-between">
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={confirm.isPending}
                   size="lg"
                >
                  Close
                </Button>
                <Button
                  isLoading={confirm.isPending}
                  onPress={() => {
                    confirm.mutate();
                  }}
                  className="bg-[#FCD11A]"
                  size="lg"
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
