import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  ChefHat,
  Grid2x2,
  Hourglass,
  Landmark,
  LayoutGrid,
  ListOrdered,
  Receipt,
  Scale,
  Tag,
  Users,
  Wallet,
} from "lucide-react";

export type ToolGroup = "profit" | "cash" | "plan";

export const GROUP_LABEL: Record<ToolGroup, string> = {
  profit: "ราคา & กำไร",
  cash: "เงินสด & ภาษี",
  plan: "วางแผน",
};

export type LabTool = {
  id: string;
  name: string;          // ชื่อเครื่องมือ
  question: string;      // คำถามที่เครื่องมือตอบ — "|" = จุดตัดบรรทัดที่อนุญาต
  blurb: string;         // อธิบายหนึ่งบรรทัด
  group: ToolGroup;
  icon: LucideIcon;
  minutes: number;
  status: "live" | "soon";
  keywords: string[];
};

export const TOOLS: LabTool[] = [
  {
    id: "break-even",
    name: "จุดคุ้มทุน",
    question: "ต้องขายวันละเท่าไหร่|ถึงไม่ขาดทุน?",
    blurb: "รู้ยอดขายขั้นต่ำต่อวัน และระยะห่างจากยอดที่ขายได้ตอนนี้",
    group: "profit",
    icon: Scale,
    minutes: 1,
    status: "live",
    keywords: ["คุ้มทุน", "break even", "ยอดขาย", "ขาดทุน", "กำไร", "ร้านกาแฟ"],
  },
  {
    id: "pricing",
    name: "ตั้งราคาขาย",
    question: "ตั้งราคาเท่าไหร่ |ให้เหลือกำไรจริง|ตามที่ตั้งใจ?",
    blurb: "รวมค่าธรรมเนียมแพลตฟอร์ม ค่าแอด และ VAT ให้ครบก่อนตั้งราคา",
    group: "profit",
    icon: Tag,
    minutes: 2,
    status: "live",
    keywords: ["ราคา", "ตั้งราคา", "margin", "markup", "กำไร", "shopee", "lazada", "tiktok", "roas", "แอด"],
  },
  {
    id: "promo",
    name: "ลดราคาคุ้มไหม",
    question: "จัดโปรลดราคา |ต้องขายเพิ่มอีกเท่าไหร่|ถึงจะคุ้ม?",
    blurb: "เทียบกำไรเดือนปกติกับเดือนจัดโปร ทั้งลด % ลดบาท และซื้อ 1 แถม 1",
    group: "profit",
    icon: BadgePercent,
    minutes: 1,
    status: "live",
    keywords: ["โปร", "โปรโมชั่น", "ลดราคา", "ส่วนลด", "แถม", "11.11", "sale"],
  },
  {
    id: "runway",
    name: "เงินสดพอไปกี่เดือน",
    question: "เงินที่มีอยู่ |ใช้ได้อีกกี่เดือน |และจะหมดเมื่อไหร่?",
    blurb: "จำลองเงินสดรายเดือนล่วงหน้า 3 ปี พร้อมลองลดรายจ่ายหรือเพิ่มรายรับ",
    group: "cash",
    icon: Hourglass,
    minutes: 1,
    status: "live",
    keywords: ["เงินสด", "runway", "กระแสเงินสด", "cash flow", "เงินหมด", "รายจ่าย"],
  },
  {
    id: "loan",
    name: "ดอกเบี้ยแท้จริง",
    question: "ดอกเบี้ย 1% ต่อเดือน |จริงๆ แล้ว|แพงแค่ไหน?",
    blurb: "แปลงดอกเบี้ยแบบคงที่ (flat) เป็นดอกเบี้ยลดต้นลดดอก พร้อมค่างวดและดอกเบี้ยรวม",
    group: "cash",
    icon: Landmark,
    minutes: 1,
    status: "live",
    keywords: ["เงินกู้", "ดอกเบี้ย", "ผ่อน", "ค่างวด", "flat rate", "effective rate", "ลดต้นลดดอก", "สินเชื่อ"],
  },
  {
    id: "vat",
    name: "VAT & หัก ณ ที่จ่าย",
    question: "ออกบิลเท่าไหร่ |หักภาษีแล้ว|เงินเข้าบัญชีเท่าไหร่?",
    blurb: "คิด VAT 7% และภาษีหัก ณ ที่จ่าย หรือคิดย้อนจากยอดเงินที่อยากได้รับ",
    group: "cash",
    icon: Receipt,
    minutes: 1,
    status: "live",
    keywords: ["vat", "ภาษี", "หัก ณ ที่จ่าย", "ใบแจ้งหนี้", "ใบกำกับภาษี", "ฟรีแลนซ์", "3%"],
  },
  {
    id: "canvas",
    name: "Business Model Canvas",
    question: "ธุรกิจของคุณทำเงินยังไง |สรุปให้เห็นในหน้าเดียว",
    blurb: "เติม 9 ช่องตามลำดับที่แนะนำ ระบบช่วยเช็กว่าช่องไหนยังไม่เชื่อมกัน",
    group: "plan",
    icon: LayoutGrid,
    minutes: 10,
    status: "live",
    keywords: ["bmc", "canvas", "โมเดลธุรกิจ", "business model", "แผน", "ลูกค้า"],
  },
  {
    id: "ltv-cac",
    name: "ลูกค้าหนึ่งคนคุ้มค่าแอดไหม",
    question: "จ่ายค่าหาลูกค้าได้สูงสุดเท่าไหร่|ถึงยังมีกำไร?",
    blurb: "เทียบมูลค่าลูกค้าตลอดอายุกับต้นทุนการหาลูกค้าใหม่",
    group: "profit",
    icon: Users,
    minutes: 2,
    status: "soon",
    keywords: ["ltv", "cac", "ลูกค้า", "แอด"],
  },
  {
    id: "menu-cost",
    name: "ต้นทุนต่อเมนู",
    question: "เมนูนี้ต้นทุนจานละเท่าไหร่ |ควรขายเท่าไหร่?",
    blurb: "คิดต้นทุนวัตถุดิบตามสูตร แล้วดู food cost %",
    group: "profit",
    icon: ChefHat,
    minutes: 3,
    status: "soon",
    keywords: ["อาหาร", "เมนู", "food cost", "สูตร"],
  },
  {
    id: "payroll",
    name: "เงินเดือน & ประกันสังคม",
    question: "จ้างพนักงานหนึ่งคน |ต้นทุนจริงต่อเดือนเท่าไหร่?",
    blurb: "รวมเงินสมทบและค่าใช้จ่ายแฝงของการจ้างงาน",
    group: "cash",
    icon: Wallet,
    minutes: 1,
    status: "soon",
    keywords: ["เงินเดือน", "ประกันสังคม", "พนักงาน"],
  },
  {
    id: "swot",
    name: "SWOT",
    question: "จุดแข็ง จุดอ่อน โอกาส |และความเสี่ยงของธุรกิจคุณ",
    blurb: "กระดานสี่ช่อง พร้อมจับคู่เป็นกลยุทธ์",
    group: "plan",
    icon: Grid2x2,
    minutes: 5,
    status: "soon",
    keywords: ["swot", "จุดแข็ง", "จุดอ่อน"],
  },
  {
    id: "idea-score",
    name: "เทียบไอเดียธุรกิจ",
    question: "มีหลายไอเดีย |ควรเริ่มอันไหนก่อน?",
    blurb: "ให้คะแนนตามเกณฑ์ที่คุณให้น้ำหนักเอง แล้วเรียงลำดับ",
    group: "plan",
    icon: ListOrdered,
    minutes: 5,
    status: "soon",
    keywords: ["ไอเดีย", "เลือก", "คะแนน"],
  },
];

export const LIVE_TOOLS = TOOLS.filter((t) => t.status === "live");
export const getTool = (id: string) => TOOLS.find((t) => t.id === id);
