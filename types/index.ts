import { SVGProps } from "react";
import { Coupons } from "../src/app/api/sign-in/coupons.model";
import { RovActs } from "@components/Daily";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type JWTGoogleResponse = {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: number;
  exp: number;
  jti: string;
};

export type CheckEligibleRequest = {
  email: string;
};

export interface CheckEligibleResponse {
  message: string;
  data: Eligible;
}

export interface Eligible {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  employee_id: string;
  source: string;
  team?: number;
  size?: string;
  eligible?: boolean;
  is_registered?: boolean;
  created_at?: number;
}

export type ManualFormSubmit = {
  employeeId: string;
  email: string;
};

export type FormSubmit = {
  employeeId: string;
};

export interface CheckInWalkInRequest {
  first_name: string;
  last_name: string;
  email: string;
  employee_id: string;
}

export interface UserInfoResponse {
  message: string;
  data: UserInfoEPassport;
}

export interface UserInfo {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_walkin: boolean;
  created_at: number;
  coupons: Coupon[];
  updated_at: number;
  employee_id: string;
  uuid: string;
}

export interface Coupon {
  id: string;
  name: string;
  isClaimed: boolean;
}

export interface UserInfoEPassport {
  id: number;
  uuid: string;
  employee_id: string;
  email: string;
  acts: RovActs[];
  created_at: Date;
  updated_at: Date;
  role: string;
}

export interface Act {
  id: number;
  uuid: string;
  title: string;
  updatedAt: number;
  updatedBy: string;
  isRedeemed: boolean;
  status: boolean;
}
export interface Checkin {
  is_walkin: boolean;
  is_checkin: boolean;
  is_redeem: boolean;
}

export interface StaffResponse {
  message: string;
  data: Staff;
}

export interface Staff {
  id: number;
  email: string;
  role: number;
  created_at: Date;
  // roleName:   RoleName;
}

export interface RoleName {
  role: string;
}

export interface MSRedirectResponse {
  "@odata.context": string;
  businessPhones: any[];
  displayName: string;
  givenName: string;
  jobTitle: string;
  mail: string;
  mobilePhone: null;
  officeLocation: null;
  preferredLanguage: null;
  surname: string;
  userPrincipalName: string;
  id: string;
}

export type WorkingHours = {
  open: string,
  close: string
}
export interface WorkingHoursResponse {
  message: string;
  data: WorkingHours;
}