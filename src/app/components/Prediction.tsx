"use client";
import { predict } from "@libs/api";
import {
  Button,
  cn,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Radio,
  useDisclosure
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  time: string;
  refresh: () => void;
};

export default function Prediction({ time, refresh }: Props) {
  const [selected, setSelected] = useState(0);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [eligible, setEligible] = useState(true);


  const confirm = useMutation({
    mutationFn: async () => {
      return await predict(selected);
    },
    onMutate: () => {},
    onError: (error: AxiosError) => {
      console.log(error);
      //@ts-ignore
      toast.error(error.response?.data.message);
    },
    onSuccess: (data) => {
      if (data.status == 200) {
        toast.success("Prediction successfully.");
        onClose();
        refresh();
      }
    },
    onSettled: () => {
      onClose();
      refresh();
    },
  });
  return (
    <>
      {eligible && (
        <div className="loaderPredict">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      <div className="absolute top-0 z-10">
        {eligible ? (
          <Button
            onPress={onOpen}
            isDisabled={!eligible}
            color="primary"
            size="lg"
            radius="full"
            variant="shadow"
            className="rounded-full  text-white
            w-[250px] h-[250px] shadow-xl text-5xl  bold
            bg-transparent
            transition duration-300 delay-150 hover:delay-300 italic
            "
          >
          <p className="text-4xl">Show my Dress</p>
          </Button>
        ) : (
          <p className="text-white/80 text-3xl">TIME OUT</p>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        placement={"center"}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={false}
        hideCloseButton={true}
        onClose={() => {
          refresh();
          setSelected(0);
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                PREDICTION THE WINNER
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onPress={() => {
                        setSelected(1);
                      }}
                      className={`${
                        selected == 1 ? "predict-selected" : ""
                      } w-[150px] h-[150px] p-0 rounded-lg bg-black`}
                    >
                      <div
                        className={`${
                          selected != 1 && selected != 0
                            ? "predict-overlay"
                            : "hidden"
                        }`}
                      ></div>
                      <Image
                        className="rounded-lg"
                        src={"/images/team/1.png"}
                        alt=""
                        width={150}
                        height={150}
                      ></Image>
                    </Button>
                    <Button
                      onPress={() => {
                        setSelected(2);
                      }}
                      className={`${
                        selected == 2 ? "predict-selected" : ""
                      } w-[150px] h-[150px] p-0 rounded-lg bg-black`}
                    >
                      <div
                        className={`${
                          selected != 2 && selected != 0
                            ? "predict-overlay"
                            : "hidden"
                        }`}
                      ></div>
                      <Image
                        className="rounded-lg"
                        src={"/images/team/2.png"}
                        alt=""
                        width={150}
                        height={150}
                      ></Image>
                    </Button>
                    <Button
                      onPress={() => {
                        setSelected(3);
                      }}
                      className={`${
                        selected == 3 ? "predict-selected" : ""
                      } w-[150px] h-[150px] p-0 rounded-lg bg-black`}
                    >
                      <div
                        className={`${
                          selected != 3 && selected != 0
                            ? "predict-overlay"
                            : "hidden"
                        }`}
                      ></div>
                      <Image
                        className="rounded-lg"
                        src={"/images/team/3.png"}
                        alt=""
                        width={150}
                        height={150}
                      ></Image>
                    </Button>
                    <Button
                      onPress={() => {
                        setSelected(4);
                      }}
                      className={`${
                        selected == 4 ? "predict-selected" : ""
                      } w-[150px] h-[150px] p-0 rounded-lg bg-black`}
                    >
                      <div
                        className={`${
                          selected != 4 && selected != 0
                            ? "predict-overlay"
                            : "hidden"
                        }`}
                      ></div>
                      <Image
                        className="rounded-lg"
                        src={"/images/team/4.png"}
                        alt=""
                        width={150}
                        height={150}
                      ></Image>
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center mt-6 mb-6 gap-4">
                  <Button
                    isDisabled={selected == 0}
                    isLoading={confirm.isPending}
                    onPress={() => {
                      if (selected != 0) {
                        confirm.mutate();
                      }
                    }}
                    className="italic text-white bg-gradient-to-br
            from-[#C74DE6] to-[#460B67] hover:bg-gradient-to-bl
             font-bold
             rounded-lg text-xl px-10 py-2 text-center mb-2 min-w-[160px] h-[64px] disabled:opacity-30 w-full uppercase"
                    size="lg"
                  >
                    Confirm
                  </Button>
                  <Button
                    isDisabled={confirm.isPending}
                    color="primary"
                    onPress={onClose}
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
    </>
  );
}

export const CustomRadio = (props: any) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
          "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
          "data-[selected=true]:border-primary"
        ),
      }}
    >
      {children}
    </Radio>
  );
};
