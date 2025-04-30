"use client";
import { Eligible } from "@/types/index";
import { ReactNode, createContext, useContext, useState } from "react";
import { Toaster } from "sonner";
import Loading from "../loading";

type Props = {
  children: ReactNode;
};

type AppContextType = {
  eligibleForm: Eligible | null;
  addEligibleForm: (user: Eligible) => void;
  removeEligibleForm: () => void;
  lodingShow: () => void;
  loadingHide: () => void;
  source: string;
  addSource: (data: string) => void;
  addRedirect: (data: string) => void;
  removeRedirect: () => void;
  getRedirect: string;
};

const defaultValue: AppContextType = {
  eligibleForm: null,
  addEligibleForm: () => {},
  removeEligibleForm: () => {},
  lodingShow: () => {},
  loadingHide: () => {},
  source: "",
  addSource: () => {},
  addRedirect: () => {},
  removeRedirect: () => {},
  getRedirect: "",
};

const AppContext = createContext(defaultValue);

const AppProvider = ({ children }: Props) => {
  const [isShow, setIsShow] = useState(false);
  const [eligible, setEligible] = useState<Eligible | null>(null);
  const [currentSource, setCurrentSource] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("");

  const handleSource = (data: string) => {
    setCurrentSource(data);
  };

  const handleAddEligible = (user: Eligible) => {
    setEligible(user);
  };

  const handleRemoveEligible = () => {
    setEligible(null);
  };

  const handleShow = () => {
    setIsShow(true);
  };
  const handleHide = () => {
    setIsShow(false);
  };

  const handleAddRedirect = (url: string) => {
    console.log(url);
    setRedirectUrl(url);
    console.log(redirectUrl);
  };

  const handleRemoveRedirect = () => {
    setRedirectUrl("");
  };

  const values = {
    eligibleForm: eligible,
    addEligibleForm: handleAddEligible,
    removeEligibleForm: handleRemoveEligible,
    lodingShow: handleShow,
    loadingHide: handleHide,
    source: currentSource,
    addSource: handleSource,
    addRedirect: async (url: string) => {
      await setRedirectUrl(url);
      console.log(await redirectUrl);
    },
    removeRedirect: handleRemoveRedirect,
    getRedirect: redirectUrl,
  };

  return (
    <AppContext.Provider value={values}>
      {children}
      {isShow && <Loading />}
      <Toaster position="bottom-right" richColors />
    </AppContext.Provider>
  );
};

export { AppProvider };

export const useApp = () => useContext(AppContext);
