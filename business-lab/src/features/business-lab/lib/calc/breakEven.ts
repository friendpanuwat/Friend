// จุดคุ้มทุน — how many units per day/month cover fixed costs.

export type BreakEvenInput = {
  price: number;            // ราคาขายต่อชิ้น
  unitCost: number;         // ต้นทุนผันแปรต่อชิ้น
  fixedMonthly: number;     // ค่าใช้จ่ายคงที่ต่อเดือน
  daysOpen: number;         // วันที่เปิดขายต่อเดือน
  targetProfit?: number;    // กำไรที่อยากได้ต่อเดือน
  currentDaily?: number;    // ตอนนี้ขายได้วันละ (ถ้ามี)
};

export type BreakEvenResult =
  | { ok: false; reason: "no-price" | "no-margin" | "no-days" }
  | {
      ok: true;
      contribution: number;       // กำไรต่อชิ้นก่อนหักค่าคงที่
      contributionRatio: number;  // สัดส่วนกำไรต่อชิ้นต่อราคา
      unitsMonthExact: number;
      unitsMonth: number;         // ปัดขึ้น
      unitsDay: number;           // ปัดขึ้น
      unitsDayExact: number;
      revenueMonth: number;       // ยอดขายขั้นต่ำต่อเดือน
      revenueDay: number;
      target?: { unitsMonth: number; unitsDay: number; revenueMonth: number };
      current?: {
        unitsMonth: number;
        profitMonth: number;
        gapPerDay: number;        // >0 = ยังขาดอีกวันละเท่านี้
        safetyMargin: number;     // (ขายจริง − จุดคุ้มทุน) / ขายจริง
      };
    };

export function breakEven(i: BreakEvenInput): BreakEvenResult {
  if (!(i.price > 0)) return { ok: false, reason: "no-price" };
  if (!(i.daysOpen > 0)) return { ok: false, reason: "no-days" };
  const contribution = i.price - Math.max(0, i.unitCost);
  if (!(contribution > 0)) return { ok: false, reason: "no-margin" };

  const fixed = Math.max(0, i.fixedMonthly);
  const unitsMonthExact = fixed / contribution;
  const unitsDayExact = unitsMonthExact / i.daysOpen;
  const unitsDay = Math.ceil(unitsDayExact - 1e-9);
  const unitsMonth = Math.ceil(unitsMonthExact - 1e-9);

  const res: BreakEvenResult = {
    ok: true,
    contribution,
    contributionRatio: contribution / i.price,
    unitsMonthExact,
    unitsMonth,
    unitsDay,
    unitsDayExact,
    revenueMonth: unitsMonthExact * i.price,
    revenueDay: unitsDayExact * i.price,
  };

  if (i.targetProfit && i.targetProfit > 0) {
    const tm = (fixed + i.targetProfit) / contribution;
    res.target = {
      unitsMonth: Math.ceil(tm - 1e-9),
      unitsDay: Math.ceil(tm / i.daysOpen - 1e-9),
      revenueMonth: tm * i.price,
    };
  }

  if (i.currentDaily !== undefined && i.currentDaily > 0) {
    const unitsMonth = i.currentDaily * i.daysOpen;
    res.current = {
      unitsMonth,
      profitMonth: unitsMonth * contribution - fixed,
      gapPerDay: unitsDayExact - i.currentDaily,
      safetyMargin: (unitsMonth - unitsMonthExact) / unitsMonth,
    };
  }
  return res;
}
