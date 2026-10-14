import { describe, expect, it } from "vitest";
import { breakEven } from "@/features/business-lab/lib/calc/breakEven";
import { targetPrice, breakdown, prettyPrice } from "@/features/business-lab/lib/calc/pricing";
import { promo, requiredLiftFor } from "@/features/business-lab/lib/calc/promo";
import { runway } from "@/features/business-lab/lib/calc/runway";
import { loan, amortPayment } from "@/features/business-lab/lib/calc/loan";
import { vatCalc } from "@/features/business-lab/lib/calc/vat";
import { fmtBaht, fmtBahtBig, fmtCompact, fmtDuration, fmtPct, thaiMonthYear } from "@/features/business-lab/lib/format";

describe("breakEven", () => {
  it("coffee shop example", () => {
    const r = breakEven({ price: 55, unitCost: 22, fixedMonthly: 45000, daysOpen: 26, currentDaily: 40, targetProfit: 30000 });
    if (!r.ok) throw new Error("expected ok");
    expect(r.contribution).toBe(33);
    expect(r.unitsMonth).toBe(1364);
    expect(r.unitsDay).toBe(53);
    expect(r.revenueMonth).toBeCloseTo(75000, 6);
    expect(r.current!.profitMonth).toBeCloseTo(-10680, 6);
    expect(r.current!.gapPerDay).toBeCloseTo(12.45, 2);
    expect(r.target!.unitsMonth).toBe(Math.ceil(75000 / 33));
  });
  it("exact integer break-even is not rounded up", () => {
    const r = breakEven({ price: 100, unitCost: 50, fixedMonthly: 30000, daysOpen: 30 });
    if (!r.ok) throw new Error();
    expect(r.unitsMonth).toBe(600);
    expect(r.unitsDay).toBe(20);
  });
  it("rejects price at or below cost", () => {
    expect(breakEven({ price: 20, unitCost: 20, fixedMonthly: 1000, daysOpen: 30 })).toEqual({ ok: false, reason: "no-margin" });
    expect(breakEven({ price: 0, unitCost: 0, fixedMonthly: 1000, daysOpen: 30 })).toEqual({ ok: false, reason: "no-price" });
  });
});

describe("pricing", () => {
  it("simple 50% margin doubles cost", () => {
    const r = targetPrice({ productCost: 100, extraCost: 0, feePct: 0, adCost: 0, vat: false, vatRate: 7 }, 50);
    if (!r.ok) throw new Error();
    expect(r.exact).toBeCloseTo(200, 6);
    expect(r.atExact.margin).toBeCloseTo(0.5, 6);
    expect(r.naive.price).toBeCloseTo(150, 6);
    expect(r.naive.margin).toBeCloseTo(1 / 3, 6);
  });
  it("hits target margin after VAT and platform fee", () => {
    const i = { productCost: 100, extraCost: 0, feePct: 10, adCost: 0, vat: true, vatRate: 7 };
    const r = targetPrice(i, 30);
    if (!r.ok) throw new Error();
    expect(r.exact).toBeCloseTo(180.44, 2);
    expect(r.atExact.margin).toBeCloseTo(0.3, 6);
    expect(r.atPretty.price).toBeGreaterThanOrEqual(r.exact);
    expect(r.atPretty.margin).toBeGreaterThanOrEqual(0.3);
  });
  it("flags impossible margins", () => {
    expect(targetPrice({ productCost: 100, extraCost: 0, feePct: 30, adCost: 0, vat: false, vatRate: 7 }, 75)).toEqual({ ok: false, reason: "impossible" });
  });
  it("break-even ROAS", () => {
    const b = breakdown({ productCost: 100, extraCost: 0, feePct: 0, adCost: 0, vat: false, vatRate: 7 }, 250);
    expect(b.maxAdPerOrder).toBe(150);
    expect(b.breakEvenRoas).toBeCloseTo(250 / 150, 6);
  });
  it("pretty prices", () => {
    expect(prettyPrice(47.2)).toBe(49);
    expect(prettyPrice(234)).toBe(239);
    expect(prettyPrice(239)).toBe(239);
    expect(prettyPrice(240)).toBe(249);
    expect(prettyPrice(1234)).toBe(1290);
    expect(prettyPrice(12345)).toBe(12390);
    expect(prettyPrice(5.2)).toBe(6);
  });
});

describe("promo", () => {
  const base = { price: 100, unitCost: 60, baseUnits: 300, percent: 20, baht: 0, buyX: 1, getY: 1, expectedLiftPct: 50 };
  it("20% off on 40% margin needs +100% sales", () => {
    const r = promo({ ...base, type: "percent" });
    if (!r.ok) throw new Error();
    expect(r.promoPrice).toBe(80);
    expect(r.requiredLift).toBeCloseTo(1, 6);
    expect(r.requiredUnits).toBe(600);
    expect(r.baseProfit).toBe(12000);
    expect(r.promoProfit).toBe(9000);
    expect(r.verdict).toBe("not-worth");
  });
  it("buy 1 get 1 halves revenue per unit", () => {
    const r = promo({ ...base, unitCost: 30, type: "bxgy" });
    if (!r.ok) throw new Error();
    expect(r.promoPrice).toBe(50);
    expect(r.effectiveDiscount).toBeCloseTo(0.5, 6);
    expect(r.requiredLift).toBeCloseTo(2.5, 6);
  });
  it("discount deeper than margin loses on every unit", () => {
    const r = promo({ ...base, type: "baht", baht: 45 });
    if (!r.ok) throw new Error();
    expect(r.verdict).toBe("loss-per-unit");
    expect(r.requiredLift).toBeNull();
  });
  it("curve helper", () => {
    expect(requiredLiftFor(100, 60, 0.2)).toBeCloseTo(1, 6);
    expect(requiredLiftFor(100, 60, 0.4)).toBeNull();
  });
});

describe("runway", () => {
  it("flat burn", () => {
    const r = runway({ cash: 500000, revenue: 100000, expenses: 150000, revenueGrowthPct: 0 });
    expect(r.burn).toBe(50000);
    expect(r.runwayMonths).toBeCloseTo(10, 6);
    expect(r.status).toBe("watch");
  });
  it("growth that recovers before cash runs out", () => {
    const r = runway({ cash: 500000, revenue: 100000, expenses: 150000, revenueGrowthPct: 10 });
    expect(r.runwayMonths).toBeNull();
    expect(r.breakevenMonth).toBe(6);
    expect(r.lowestCash.month).toBe(5);
    expect(r.lowestCash.cash).toBeCloseTo(500000 - 139490, 0);
    expect(r.status).toBe("recovers");
  });
  it("profitable and empty", () => {
    expect(runway({ cash: 0, revenue: 200, expenses: 100, revenueGrowthPct: 0 }).status).toBe("profitable");
    const e = runway({ cash: 0, revenue: 100, expenses: 200, revenueGrowthPct: 0 });
    expect(e.status).toBe("empty");
    expect(e.runwayMonths).toBe(0);
  });
  it("what-if cut extends runway", () => {
    const a = runway({ cash: 300000, revenue: 0, expenses: 100000, revenueGrowthPct: 0 });
    const b = runway({ cash: 300000, revenue: 0, expenses: 100000, revenueGrowthPct: 0, cutExpensesPct: 25 });
    expect(a.runwayMonths).toBeCloseTo(3, 6);
    expect(b.runwayMonths).toBeCloseTo(4, 6);
  });
});

describe("loan", () => {
  it("reducing balance 12% / 3 years", () => {
    const r = loan({ principal: 100000, rate: 12, rateUnit: "year", method: "reducing", termMonths: 36 });
    if (!r.ok) throw new Error();
    expect(r.payment).toBeCloseTo(3321.43, 2);
    expect(r.totalInterest).toBeCloseTo(19571.52, 2);
    expect(r.effectiveAnnual).toBeCloseTo(12, 6);
    expect(r.years.at(-1)!.balance).toBeCloseTo(0, 6);
  });
  it("flat 1% per month is ~21% effective", () => {
    const r = loan({ principal: 100000, rate: 1, rateUnit: "month", method: "flat", termMonths: 36 });
    if (!r.ok) throw new Error();
    expect(r.annualQuoted).toBe(12);
    expect(r.totalInterest).toBeCloseTo(36000, 6);
    expect(r.payment).toBeCloseTo(3777.78, 2);
    // the solved rate must reproduce the same payment
    expect(amortPayment(100000, r.effectiveAnnual / 1200, 36)).toBeCloseTo(r.payment, 4);
    expect(r.effectiveAnnual).toBeGreaterThan(20.5);
    expect(r.effectiveAnnual).toBeLessThan(22);
    expect(r.flatEquivalent).toBeCloseTo(12, 6);
    const sumPrincipal = r.years.reduce((s, y) => s + y.principal, 0);
    expect(sumPrincipal).toBeCloseTo(100000, 4);
  });
  it("zero interest", () => {
    const r = loan({ principal: 12000, rate: 0, rateUnit: "year", method: "flat", termMonths: 12 });
    if (!r.ok) throw new Error();
    expect(r.payment).toBe(1000);
    expect(r.effectiveAnnual).toBe(0);
  });
});

describe("vat", () => {
  it("before VAT + 3% WHT", () => {
    expect(vatCalc({ amount: 10000, mode: "beforeVat", vat: true, vatRate: 7, whtRate: 3 })).toEqual({ base: 10000, vatAmount: 700, total: 10700, wht: 300, net: 10400 });
  });
  it("includes VAT", () => {
    const r = vatCalc({ amount: 10700, mode: "includesVat", vat: true, vatRate: 7, whtRate: 3 });
    expect(r.base).toBe(10000);
    expect(r.net).toBe(10400);
  });
  it("net target works backwards", () => {
    const r = vatCalc({ amount: 10400, mode: "netTarget", vat: true, vatRate: 7, whtRate: 3 });
    expect(r.base).toBe(10000);
    expect(r.total).toBe(10700);
  });
  it("no VAT, rounding to satang", () => {
    const r = vatCalc({ amount: 3333.333, mode: "beforeVat", vat: false, vatRate: 7, whtRate: 3 });
    expect(r.base).toBe(3333.33);
    expect(r.wht).toBe(100);
    expect(r.net).toBe(3233.33);
  });
});

describe("format", () => {
  it("formats Thai-friendly values", () => {
    expect(fmtBaht(12345)).toBe("฿12,345");
    expect(fmtBaht(-1200)).toBe("−฿1,200");
    expect(fmtBahtBig(12_500_000)).toBe("฿12.5 ล้าน");
    expect(fmtCompact(1_200_000)).toBe("1.2M");
    expect(fmtCompact(20_000)).toBe("20K");
    expect(fmtPct(1 / 3)).toBe("33.3%");
    expect(fmtPct(0.5)).toBe("50%");
    expect(fmtDuration(27)).toBe("2 ปี 3 เดือน");
    expect(fmtDuration(8.6)).toBe("8 เดือน");
    expect(thaiMonthYear(new Date(2027, 2, 1))).toBe("มี.ค. 2570");
  });
});

import { maxDiscountFor } from "@/features/business-lab/lib/calc/promo";
describe("maxDiscountFor", () => {
  it("is the discount where required lift equals expected lift", () => {
    const d = maxDiscountFor(100, 60, 50)!;
    expect(d).toBeCloseTo(1 - (60 + 40 / 1.5) / 100, 9);
    expect(requiredLiftFor(100, 60, d)).toBeCloseTo(0.5, 9);
    expect(maxDiscountFor(100, 60, 0)).toBeNull();
  });
});

describe("runway revenue ceiling", () => {
  it("stops growth at the cap", () => {
    const r = runway({ cash: 300000, revenue: 60000, expenses: 110000, revenueGrowthPct: 8, revenueCap: 150000 });
    expect(Math.max(...r.months.map((m) => m.revenue))).toBeCloseTo(150000, 6);
    expect(r.months[35].cash).toBeLessThan(2_000_000);
    expect(r.breakevenMonth).toBe(9);
  });
});
