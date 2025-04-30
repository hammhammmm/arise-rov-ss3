"use client";
import { Eligible, FormSubmit } from "@/types/index";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { AxiosError } from "axios";
import { toast } from "sonner";

import EligibleForm from "@components/EligibleForm";
import { useApp } from "@context/appContext";
import { signIn } from "@libs/api";
import Link from "next/link";
import Privacy from "@components/Privacy";

type Props = {};

export default function Page({}: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { eligibleForm, loadingHide, lodingShow } = useApp();
  const router = useRouter();
  const employeeIdRef = useRef<HTMLInputElement | null>(null);
  const loginRef = useRef<HTMLDivElement | null>(null);
  const [isSelected, setIsSelected] = useState(false);

  const schema = yup
  .object({
    employeeId: yup.string().min(5, "").max(6, "").required(),
  })
  .required();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormSubmit>({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      employeeId: eligibleForm?.employee_id,
    },
  });

  const onSubmit = async (data: FormSubmit) => {
    lodingShow();
    if (eligibleForm) {
      const temp: Eligible = {
        ...eligibleForm,
        employee_id: data.employeeId,
      };
      await EligibleForm(temp);
      submit.mutate();
    } else {
      loadingHide();
    }
  };

  const submit = useMutation({
    mutationFn: async () => {
      return await signIn();
    },
    onMutate: () => {},
    onError: (error: AxiosError) => {
      console.log(error);
      // //@ts-ignore
      // toast.error(error.response?.data.message);
      //@ts-ignore
      if (error.response?.data.code === 4000) {
        toast.dismiss();
        //@ts-ignore
        toast.success(error.response?.data.message);
        router.replace("/");
      }
    },
    onSuccess: (data) => {
      if (data.status == 200) {
        toast.success("Checkin successfully.");
        router.replace("/");
      }
    },
    onSettled: () => {
      loadingHide();
    },
  });

  useEffect(() => {
    console.log(eligibleForm);
    if (!eligibleForm) {
      router.replace("/login");
    }
  }, [eligibleForm]);

  useEffect(() => {
    if (!loginRef.current) {
      return;
    }
    loginRef.current.scrollTop = loginRef.current.scrollHeight;
  }, []);

  const privacy = () => {
    return "Privacy Policy";
  };

   // Event handler to update the state based on the checkbox's value
   const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSelected(event.target.checked);
  };
  return (
    <>
    <div className="flex justify-center" ref={loginRef}>
      <div className="flex flex-col justify-start flex-wrap content-start gap-6 mt-6  w-full max-w-[700px] items-center p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6 text-center bg-black/50 p-4 rounded-lg"
        >
          <Input
            type="email"
            label="Email"
            isDisabled
            size="lg"
            value={eligibleForm?.email}
            className="input"
          />
          <Input
            type="text"
            label="First Name"
            isDisabled
            size="lg"
            value={eligibleForm?.first_name}
            className="input "
          />
          <Input
            type="text"
            label="Last Name"
            isDisabled
            size="lg"
            value={eligibleForm?.last_name}
            className="input "
          />

          <div className="flex w-full flex-nowrap gap-4">
            <Controller
              control={control}
              name="employeeId"
              render={({ field }) => (
                <Input
                  {...field}
                  ref={employeeIdRef}
                  type="tel"
                  maxLength={6}
                  label="Employee Id"
                  size="lg"
                  className={`input`}
                  autoComplete="off"
                  defaultValue={eligibleForm?.employee_id}
                  isDisabled={!!eligibleForm?.employee_id}
                />
              )}
            />
          </div>

          <div className="flex items-start">
            <input type="checkbox" onChange={handleCheckboxChange}  checked={isSelected} className="scale-150 mr-2 mt-1"/>
            {/* <Checkbox
              isDisabled={isSubmitting}
              isSelected={isSelected}
              onValueChange={setIsSelected}
              className="flex items-start"
            ></Checkbox> */}
            <span className="text-white text-sm text-left">
              {`By registering for this event, I acknowledge that I have read, understood, and agree to the `}{" "}
              <span className="bold underline cursor-pointer" onClick={onOpen}>Privacy Policy</span>{" "}
              {`, and I understand that my information will be used solely  for the purposes stated in the privacy policy.`}
            </span>
          </div>

          <Button
            className="relative  text-black
            bg-[#FCD11A]
             font-bold
             rounded-lg text-xl px-10 py-2 text-center mb-2 min-w-[160px] h-[64px] disabled:opacity-30"
            type="submit"
            color="primary"
            isLoading={submit.isPending || isSubmitting}
            isDisabled={
              !isValid || !isSelected || submit.isPending || isSubmitting
            }
          >
            Sign In!
          </Button>
        </form>
      </div>
    </div>
    <Modal
        isOpen={isOpen}
        placement={"center"}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={false}
        hideCloseButton={true}
        onClose={()=>{}}
        scrollBehavior={"inside"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="py-4">
                <div className="flex flex-col items-center justify-center gap-4">
                <Privacy/>
                </div>
                <div className="flex justify-center items-center mt-6 mb-6">
                  <Button color="primary" onPress={onClose} variant="bordered">
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
