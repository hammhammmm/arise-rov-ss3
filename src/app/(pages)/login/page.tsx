"use client";

import { loginRequest } from "@/config/ms-auth";
import { Eligible, ManualFormSubmit } from "@/types/index";
import { useMsal } from "@azure/msal-react";
import { useApp } from "@context/appContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { manualSignIn } from "@libs/api";
import {
  Button,
  Divider,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const domain = [
  "arise.tech",
  "infinitaskt.com",
  "krungthai.com",
  "Infinitaskt.com",
];

export default function LoginPage() {
  const app = useApp();
  const router = useRouter();
  const [tempEligible, setTempEligible] = useState<Eligible | null>(null);

  const { instance, inProgress } = useMsal();
  const handleLoginMs = async () => {
    instance
      .loginRedirect(loginRequest)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.error(`loginRedirect failed: ${e}`);
        toast.dismiss();
        toast.error("Can't connect MSAL please try again.");
      });
  };

  const schema = yup
    .object({
      employeeId: yup
        .string()
        .min(5, "")
        .max(6, "")
        .required()
        .matches(/^\d{5,6}$/, "Only numberic are allowed for this field"),
      email: yup.string().required().email(),
    })
    .required();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<ManualFormSubmit>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      employeeId: "",
      email: "",
    },
  });

  const onSubmit = (data: ManualFormSubmit) => {
    console.log(data);
    submit.mutate(data);
  };

  const submit = useMutation({
    mutationFn: async (data: ManualFormSubmit) => {
      return manualSignIn(data);
    },
    onMutate: () => {
      app.lodingShow();
    },
    onError: (error: AxiosError) => {
      //@ts-ignore
      toast.error(error.response?.data.message);
      //@ts-ignore
      if (error.response?.data.code === 4000) {
        router.push("/");
      }
    },
    onSuccess: (data) => {
      app.addEligibleForm(data.data.data);
      app.addSource("manual");
      router.replace("/check-in");
    },
    onSettled: () => {
      app.loadingHide();
    },
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <div className="flex flex-col gap-6 mt-3 justify-center items-center mb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl  font-bold tracking-widest text-center text-white">
            Welcome to Arise Connext {process.env.NEXT_PUBLIC_ARISE_CONNEXT_EP}
          </h1>
          {/* <h4 className="text-xl  text-[white]  text-center">
            {"Please check-in to redeem your food & drink coupon"}
          </h4> */}
        </div>

        <div className="mt-6 flex flex-col gap-4 justify-center items-center">
          <Button
            size="lg"
            className="w-full bg-white rounded-md max-w-[300px]"
            onPress={() => {
              handleLoginMs();
            }}
          >
            <Image
              src="/images/ms.png"
              alt=""
              width={20}
              height={20}
              className=" rounded-none"
            ></Image>
            Sign-in with Microsoft
          </Button>

          {/* <Divider className="max-w-[300px]" /> */}
          {/* <p className="text-white text-sm">Or</p> */}
          {/* <Button
            className="rounded-md bg-[#FCD11A] max-w-[300px] w-[300px] h-[48px] text-md"
            onPress={onOpen}
          >
            Manual Sign in
          </Button>
          <p className="text-md text-white italic bg-black/40 text-center p-4 rounded-lg max-w-[300px]">
            *Use manual sign-in if Microsoft fails.
          </p> */}
        </div>
      </div>
      <Modal
        backdrop={"blur"}
        isOpen={isOpen}
        placement={"bottom-center"}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex flex-col gap-6 text-center"
              >
                <ModalHeader className="flex flex-col gap-1">
                  Manual Sign in
                </ModalHeader>
                <ModalBody>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        label="Email"
                        size="lg"
                        className="input"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="employeeId"
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="tel"
                        label="Employee Id"
                        size="lg"
                        className="input"
                        maxLength={6}
                        autoComplete="off"
                      />
                    )}
                  />
                </ModalBody>
                <ModalFooter className="flex justify-between">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#FCD11A]"
                    isDisabled={!isValid}
                  >
                    Sign in
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
