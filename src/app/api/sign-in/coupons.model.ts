export interface Coupons {
  id: string;
  categoryName: string;
  maxUsage: number;
  usage: number;
  status: boolean;
  couponItems: CouponItems[];
}

export interface CouponItems {
  id: string;
  name: string;
}
