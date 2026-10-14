// One-line example answers for the Lab home cards — computed by the same engines, never typed by hand.
import { breakEven } from "./lib/calc/breakEven";
import { targetPrice } from "./lib/calc/pricing";
import { promo } from "./lib/calc/promo";
import { runway } from "./lib/calc/runway";
import { loan } from "./lib/calc/loan";
import { vatCalc } from "./lib/calc/vat";
import { fmtBaht, fmtBahtExact, fmtDuration, fmtNum, fmtPct } from "./lib/format";

const be = breakEven({ price: 55, unitCost: 22, fixedMonthly: 45000, daysOpen: 26 });
const pr = targetPrice({ productCost: 120, extraCost: 15, feePct: 12, adCost: 25, vat: false, vatRate: 7 }, 30);
const pm = promo({ price: 290, unitCost: 150, baseUnits: 300, type: "percent", percent: 20, baht: 0, buyX: 1, getY: 1, expectedLiftPct: 0 });
const rw = runway({ cash: 400000, revenue: 90000, expenses: 160000, revenueGrowthPct: 0 });
const ln = loan({ principal: 100000, rate: 1, rateUnit: "month", method: "flat", termMonths: 36 });
const vt = vatCalc({ amount: 25000, mode: "beforeVat", vat: false, vatRate: 7, whtRate: 3 });

export const SAMPLES: Record<string, string> = {
  "break-even": be.ok ? `ร้านกาแฟ → ขายวันละ ${fmtNum(be.unitsDay)} แก้ว` : "",
  pricing: pr.ok ? `ทุน ฿120 → ควรขาย ${fmtBaht(pr.pretty)}` : "",
  promo: pm.ok && pm.requiredLift !== null ? `ลด 20% → ต้องขายเพิ่ม ${fmtPct(pm.requiredLift, 0)}` : "",
  runway: rw.runwayMonths !== null ? `เงิน ${fmtBaht(400000)} → อยู่ได้ ${fmtDuration(rw.runwayMonths)}` : "",
  loan: ln.ok ? `1% ต่อเดือน → จริง ${fmtNum(ln.effectiveAnnual, 1)}% ต่อปี` : "",
  vat: `บิล ${fmtBaht(25000)} หัก 3% → เข้าบัญชี ${fmtBahtExact(vt.net)}`,
  canvas: "9 ช่อง พร้อมตัวอย่างร้านกาแฟ",
};
