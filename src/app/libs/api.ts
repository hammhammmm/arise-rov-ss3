
import { CheckEligibleResponse, CheckInWalkInRequest, ManualFormSubmit, StaffResponse, UserInfoResponse, WorkingHours, WorkingHoursResponse } from "@/types/index";
import HttpClient from "./http-clients";

export const eligible = async (email: string) => {
  const req = { email: email };
  return HttpClient.post<CheckEligibleResponse>("/api/check-eligible", req);
};

export const manualSignIn = async (req: ManualFormSubmit) => {
  return HttpClient.post<CheckEligibleResponse>("/api/manual-signin", req);
};

export const signIn = async () => {
  return HttpClient.post(`/api/sign-in`);
};

export const checkIn = async () => {
  return HttpClient.post(`/api/check-in`);
};

export const checkInWalkIn = async (req: CheckInWalkInRequest) => {
  return HttpClient.post(`/api/check-in-walkin`, req);
};

export const getUserInfo = async () => {
  return HttpClient.get<UserInfoResponse>(`/api/user`);
};

export const redeem = async (code: string[]) => {
  const req = { code: code};

  return HttpClient.post(`/api/redeem`, req);
};
export const logout = async () => {
  return HttpClient.post(`/api/logout`, {});
};

export const getStaff = async () => {
  return HttpClient.get<StaffResponse>(`/api/staff`);
};

export const predict = async (voted: number) => {
  const req = { voted: voted};
  return HttpClient.post(`/api/predict`, req);
};

export const coupon = async (id: string) => {
  const req = { id: id};

  return HttpClient.post(`/api/use-coupon`, req);
};

export const redeemItem = async () => {
  return HttpClient.post(`/api/redeem-item`,);
};

export const getWorkingHours = async () => {
  return HttpClient.get<WorkingHoursResponse>(`/api/working-hours`);
};
