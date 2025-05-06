"use client";

import EmployeeMode from "@components/EmployeeMode";
import { redeem } from "@libs/api";
import { Button, Card, CardBody } from "@nextui-org/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "sonner";
import { Scanner } from '@yudiel/react-qr-scanner';

export default function Page() {
  const router = useRouter();
  const [data, setData] = useState("");
  const submit = () => {
    if (data) {
      console.log(data);
      redeemCoupon.mutate(String(data));
    }
  };

  const redeemCoupon = useMutation({
    mutationFn: async (data: string) => {
      console.log(data);

      const trimmedString = data.substring(1, data.length - 1); // Remove the square brackets
      const array = trimmedString.split(",");
      return await redeem(array);
    },
    onMutate: () => {},
    onError: (error: AxiosError) => {
      console.log(error);
      // @ts-ignore
      toast.error(error.response?.data.message);
    },
    onSuccess: (data) => {
      toast.success("Redeem successfully.");
    },
    onSettled: () => {
      setData("");
    },
  });

  return (
    <div className="flex flex-col gap-3 justify-start items-center mt-3">
      <EmployeeMode/>
      <Card
        isBlurred
        className="border-none w-full dark:bg-default-100/50"
        shadow="sm"
      >
        <CardBody className="flex flex-col justify-center gap-3">
          <div className=" p-6">
         
            <QrReader
              scanDelay={1000}
              onResult={(result, error) => {
                if (!!result) {
                  // @ts-ignore
                  console.log(result?.text);
                  // @ts-ignore
                  setData(result?.text);
                }

                if (!!error) {
                  console.info(error);
                }
              }}
              videoContainerStyle={{
                border: "2px solid red",
                background: "#000",
              }}
              videoStyle={{
                width: "390px",
                height: "390px",
                border: "2px solid #000",
                paddingBottom: "2rem",
              }}
              constraints={{ facingMode: "environment" }}
            />
          </div>

          <p className="text-center text-xl text-green-600">
            {!!data && "System is ready for redeem."}
          </p>
          <Button
            className="p-12 text-3xl disabled:bg-gray-400 bold uppercase italic"
            color="success"
            isDisabled={!!!data}
            isLoading={redeemCoupon.isPending}
            onPress={submit}
          >
            Confirm Redeem
          </Button>
          <Button
            color="danger"
            variant="light"
            className="mt-2"
            onPress={() => {
              setData("");
            }}
          >
            Clear
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
