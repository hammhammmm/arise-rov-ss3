"use client";
import React, { useEffect, useState } from "react";
import Loading from "../../loading";
import { useRouter } from "next/navigation";
import { useMsal } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import { callMsGraph } from "@libs/MsGraphApiCall";
import { loginRequest } from "@/config/ms-auth";
import { Eligible, MSRedirectResponse } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { eligible } from "@libs/api";
import EligibleForm from "@components/EligibleForm";
import { useApp } from "@context/appContext";
import { toast } from "sonner";

type Props = {};

const domain = [
  "arise.tech",
  "infinitaskt.com",
  "krungthai.com",
  "Infinitaskt.com",
];

export default function AuthPag({}: Props) {
  const app = useApp();
  const router = useRouter();
  const { instance, inProgress } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [tempEligible, setTempEligible] = useState<Eligible | null>(null);

  const checkEligible = useMutation({
    mutationFn: async (email: string) => {
      console.log(email);
      return await eligible(email);
    },
    onMutate: () => {
      app.lodingShow();
    },
    onError: async (err) => {
      console.log(err);
      if (tempEligible) {
        tempEligible.is_registered = false;
        app.addEligibleForm(tempEligible);
        console.log(tempEligible);
        await EligibleForm(tempEligible);
      }
    },
    onSuccess: async (data) => {
      console.log(data.data.data);
      if (tempEligible) {
        const temp: Eligible = {
          ...tempEligible,
          employee_id: data.data.data.employee_id,
          source: data.data.data.source,
          size: data.data.data.size,
          team: data.data.data.team,
          eligible: data.data.data.eligible,
          is_registered: true,
        };
        console.log(temp);
        app.addEligibleForm(temp);
      }
    },
    onSettled: () => {
      app.loadingHide();
      router.replace("/check-in");
    },
  });

  useEffect(() => {
    if (!graphData && inProgress === InteractionStatus.None) {
      callMsGraph()
        .then((response: MSRedirectResponse) => {
          const checkDomain = response.mail.toLowerCase().split("@");
          if (domain.includes(checkDomain[1].toLowerCase())) {
            //   setGraphData(response);
            console.log(response);
            const temp: Eligible = {
              id: 0,
              first_name: response.givenName,
              last_name: response.surname,
              email: response.mail.toLowerCase(),
              is_registered: false,
              employee_id: "",
              source: "",
              created_at: 0,
              eligible: true,
              size: "-",
              team: 0,
            };
            setTempEligible(temp);
            checkEligible.mutate(response.mail.toLowerCase());
          } else {
            toast.dismiss();
            toast.error(
              "Please sign in with an email from @arise.tech, @infinitaskt.com, or @krungthai.com domains."
            );
          }
        })
        .catch((e) => {
          if (e instanceof InteractionRequiredAuthError) {
            instance.acquireTokenRedirect({
              ...loginRequest,
              account: instance.getActiveAccount()!,
            });
          }
        });
      console.log(graphData);
    }
  }, [inProgress, graphData, instance]);
  return (
    <>
      <Loading></Loading>
    </>
  );
}
