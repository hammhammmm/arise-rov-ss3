import { v4 as uuidv4 } from "uuid";
import { Act } from "../types";
import { Coupons } from "../src/app/api/sign-in/coupons.model";

const currentTime = new Date();
const timeZoneOffset = 0 * 60;
const now = currentTime.getTime() + timeZoneOffset * 60 * 1000;

export const acts: Act[] = [
  {
    id: 0,
    uuid: uuidv4(),
    title: "Tech Day",
    isRedeemed: false,
    updatedAt: now,
    updatedBy: "",
    status: true,
  },
  {
    id: 1,
    uuid: uuidv4(),
    title: "Agile ปากซอย",
    isRedeemed: false,
    updatedAt: now,
    updatedBy: "",
    status: true,
  },
  {
    id: 2,
    uuid: uuidv4(),
    title: "Party Game",
    isRedeemed: false,
    updatedAt: now,
    updatedBy: "",
    status: true,
  },
  {
    id: 3,
    uuid: uuidv4(),
    title: "Lotto",
    isRedeemed: false,
    updatedAt: now,
    updatedBy: "",
    status: true,
  },
  {
    id: 4,
    uuid: uuidv4(),
    title: "Nintendo",
    isRedeemed: false,
    updatedAt: now,
    updatedBy: "",
    status: true,
  },
  {
    id: 5,
    uuid: uuidv4(),
    title: "Sphere",
    isRedeemed: false,
    updatedAt: now,
    updatedBy: "",
    status: true,
  }
];

export const coupons: Coupons[] = [
  {
    id: uuidv4(),
    categoryName: "Main Courses",
    maxUsage: 2,
    usage: 0,
    status: true,
    couponItems: [
      {
        id: uuidv4(),
        name: "หมี่คลุก",
      },
      {
        id: uuidv4(),
        name: "เกาเหลาเนื้อ",
      },
      {
        id: uuidv4(),
        name: "ข้าวหน้าไก่",
      },
      {
        id: uuidv4(),
        name: "บะหมี่หน้าไก่",
      },
      {
        id: uuidv4(),
        name: "ข้าวรวมมิตรผัดผัก+เห็ดออรินจิคั่วเกลือ (มังสวิรัติ)",
      },
      {
        id: uuidv4(),
        name: "ข้าวปลากะพงทอดกระเทียม + ไก่ผัดซอสญี่ปุ่น",
      },
      {
        id: uuidv4(),
        name: "ข้าวพริกแกงไก่ชิ้น+กะเพราไก่ทอด",
      },
      {
        id: uuidv4(),
        name: "มักกะโรนีผัดไข่ไก่สับ (ผัดแบบไม่ใส่ซอสมะเขือเทศ)",
      }, 
      {
        id: uuidv4(),
        name: "Mix veggies Salad",
      },
      {
        id: uuidv4(),
        name: "ข้าวพะแนงเนื้อ + ไข่ยัดไส้",
      },
      {
        id: uuidv4(),
        name: "ข้าวกุ้งทอดซอสมะขาม + คั่วกลิ้งไก่",
      },
    ],
  },
  {
    id: uuidv4(),
    categoryName: "Appetizer",
    maxUsage: 1,
    usage: 0,
    status: true,
    couponItems: [
      {
        id: uuidv4(),
        name: "ขนมจีบจัดเซ็ท 6 ลูก",
      },
      {
        id: uuidv4(),
        name: "KFC 7 PCS. CHICKEN POP",
      },
      {
        id: uuidv4(),
        name: "KFC 3 PCS. WINGZ ZABB",
      },
    ],
  },
  {
    id: uuidv4(),
    categoryName: "Dessert",
    maxUsage: 1,
    usage: 0,
    status: true,
    couponItems: [
      {
        id: uuidv4(),
        name: "บัวลอยมะพร้าวอ่อน",
      },
      {
        id: uuidv4(),
        name: "ครองแครงมะพร้าวอ่อน",
      },
      {
        id: uuidv4(),
        name: "เต้าฮวยนมสด",
      },
      {
        id: uuidv4(),
        name: "ข้าวเหนียวมะม่วง",
      },
    ],
  },
  {
    id: uuidv4(),
    categoryName: "Drink",
    maxUsage: 1,
    usage: 0,
    status: true,
    couponItems: [
      {
        id: uuidv4(),
        name: "ชาใต้ชีสขูด",
      },
      {
        id: uuidv4(),
        name: "ชาใต้ชีส",
      },
      {
        id: uuidv4(),
        name: "ชาใต้",
      },
      {
        id: uuidv4(),
        name: "ชาใต้เฉาก๋วย",
      },
      {
        id: uuidv4(),
        name: "สตอเบอรี่นมสด",
      },
      {
        id: uuidv4(),
        name: "ชาอินฟิว",
      },
    ],
  },
];
