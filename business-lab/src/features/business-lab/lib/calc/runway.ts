// เงินสดอยู่ได้กี่เดือน — month-by-month cash simulation.

export type RunwayInput = {
  cash: number;               // เงินสดตอนนี้
  revenue: number;            // รายรับต่อเดือน
  expenses: number;           // รายจ่ายต่อเดือน
  revenueGrowthPct: number;   // รายรับโตเดือนละกี่ %
  revenueCap?: number;        // รายรับสูงสุดที่โตไปถึงได้ (0/ว่าง = ไม่จำกัด)
  cutExpensesPct?: number;    // what-if: ลดรายจ่าย %
  boostRevenuePct?: number;   // what-if: เพิ่มรายรับ %
};

export type RunwayStatus = "profitable" | "recovers" | "safe" | "watch" | "urgent" | "empty";

export type RunwayMonth = { month: number; revenue: number; expenses: number; net: number; cash: number };

export type RunwayResult = {
  status: RunwayStatus;
  burn: number;                    // รายจ่าย − รายรับ เดือนแรก (>0 = เงินไหลออก)
  runwayMonths: number | null;     // null = ไม่หมดภายในช่วงที่จำลอง
  breakevenMonth: number | null;   // เดือนแรกที่รายรับ ≥ รายจ่าย (ถ้าเริ่มจากขาดทุน)
  lowestCash: { month: number; cash: number };
  months: RunwayMonth[];
};

export const HORIZON = 36;

export function runway(i: RunwayInput, horizon = HORIZON): RunwayResult {
  const cut = Math.min(100, Math.max(0, i.cutExpensesPct ?? 0)) / 100;
  const boost = Math.max(0, i.boostRevenuePct ?? 0) / 100;
  const g = (i.revenueGrowthPct || 0) / 100;
  const startCash = i.cash || 0;
  const exp = Math.max(0, i.expenses) * (1 - cut);
  const rev0 = Math.max(0, i.revenue) * (1 + boost);

  const months: RunwayMonth[] = [];
  let cash = startCash;
  let runwayMonths: number | null = null;
  let breakevenMonth: number | null = null;
  let lowest = { month: 0, cash: startCash };

  for (let m = 1; m <= horizon; m++) {
    const grown = rev0 * Math.pow(1 + g, m - 1);
    const revenue = i.revenueCap && i.revenueCap > 0 && g > 0 ? Math.min(grown, Math.max(rev0, i.revenueCap * (1 + boost))) : grown;
    const net = revenue - exp;
    const prev = cash;
    cash = prev + net;
    months.push({ month: m, revenue, expenses: exp, net, cash });
    if (cash < lowest.cash) lowest = { month: m, cash };
    if (runwayMonths === null && prev >= 0 && cash < 0 && net < 0) {
      runwayMonths = m - 1 + prev / -net;
    }
    if (breakevenMonth === null && net >= 0 && months[0].net < 0) breakevenMonth = m;
  }

  const burn = exp - rev0;
  let status: RunwayStatus;
  if (burn <= 0 && g >= 0) status = "profitable";
  else if (startCash <= 0 && burn > 0) status = "empty";
  else if (runwayMonths === null) status = breakevenMonth !== null ? "recovers" : "safe";
  else if (runwayMonths >= 12) status = "safe";
  else if (runwayMonths >= 6) status = "watch";
  else status = "urgent";

  if (startCash <= 0 && burn > 0) runwayMonths = 0;

  return { status, burn, runwayMonths, breakevenMonth, lowestCash: lowest, months };
}
