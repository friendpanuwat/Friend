// ดอกเบี้ยแท้จริงของเงินกู้ — flat-rate vs reducing-balance, with the true yearly rate.

export type RateUnit = "year" | "month";
export type LoanMethod = "flat" | "reducing";

export type LoanInput = {
  principal: number;
  rate: number;          // ตัวเลขดอกเบี้ยตามที่ประกาศ
  rateUnit: RateUnit;
  method: LoanMethod;
  termMonths: number;
};

export type LoanYear = { year: number; principal: number; interest: number; balance: number };

export type LoanResult =
  | { ok: false; reason: "no-principal" | "no-term" }
  | {
      ok: true;
      annualQuoted: number;     // % ต่อปีตามที่ประกาศ
      payment: number;          // ค่างวดต่อเดือน
      totalInterest: number;
      totalPaid: number;
      effectiveAnnual: number;  // % ต่อปีแบบลดต้นลดดอก (เทียบเท่า)
      flatEquivalent: number;   // % ต่อปีถ้าคิดแบบ flat
      other: { method: LoanMethod; payment: number; totalInterest: number }; // ถ้าใช้อีกวิธีที่ตัวเลขเดียวกัน
      years: LoanYear[];
    };

/** Monthly payment for a reducing-balance (amortised) loan. */
export function amortPayment(P: number, monthlyRate: number, n: number): number {
  if (n <= 0) return 0;
  if (Math.abs(monthlyRate) < 1e-12) return P / n;
  return (P * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
}

/** Monthly rate i such that pmt amortises P over n months (bisection — stable for any input). */
export function solveMonthlyRate(P: number, pmt: number, n: number): number {
  if (pmt * n <= P + 1e-9) return 0;
  let lo = 0;
  let hi = 1; // 100% per month upper bound
  for (let k = 0; k < 200; k++) {
    const mid = (lo + hi) / 2;
    if (amortPayment(P, mid, n) > pmt) hi = mid;
    else lo = mid;
  }
  return (lo + hi) / 2;
}

function flatTerms(P: number, annual: number, n: number) {
  const totalInterest = P * (annual / 100) * (n / 12);
  return { payment: (P + totalInterest) / n, totalInterest };
}

function reducingTerms(P: number, annual: number, n: number) {
  const payment = amortPayment(P, annual / 1200, n);
  return { payment, totalInterest: payment * n - P };
}

export function loan(i: LoanInput): LoanResult {
  if (!(i.principal > 0)) return { ok: false, reason: "no-principal" };
  const n = Math.round(i.termMonths);
  if (!(n >= 1)) return { ok: false, reason: "no-term" };
  const P = i.principal;
  const annual = Math.max(0, i.rateUnit === "month" ? i.rate * 12 : i.rate);

  const flat = flatTerms(P, annual, n);
  const reducing = reducingTerms(P, annual, n);
  const mine = i.method === "flat" ? flat : reducing;
  const other = i.method === "flat" ? reducing : flat;

  const monthly = i.method === "flat" ? solveMonthlyRate(P, mine.payment, n) : annual / 1200;
  const effectiveAnnual = monthly * 12 * 100;
  const flatEquivalent = (mine.totalInterest / P / (n / 12)) * 100;

  // Yearly schedule on the effective rate (how the balance really falls).
  const years: LoanYear[] = [];
  let bal = P;
  let yp = 0;
  let yi = 0;
  for (let m = 1; m <= n; m++) {
    const interest = bal * monthly;
    let principal = mine.payment - interest;
    if (m === n) principal = bal;
    bal = Math.max(0, bal - principal);
    yp += principal;
    yi += interest;
    if (m % 12 === 0 || m === n) {
      years.push({ year: Math.ceil(m / 12), principal: yp, interest: yi, balance: bal });
      yp = 0;
      yi = 0;
    }
  }

  return {
    ok: true,
    annualQuoted: annual,
    payment: mine.payment,
    totalInterest: mine.totalInterest,
    totalPaid: mine.payment * n,
    effectiveAnnual,
    flatEquivalent,
    other: { method: i.method === "flat" ? "reducing" : "flat", ...other },
    years,
  };
}
