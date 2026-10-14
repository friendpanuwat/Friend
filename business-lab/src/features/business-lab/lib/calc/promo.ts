// ลดราคาแล้วคุ้มไหม — how many more units a promotion must sell to earn the same profit.

export type PromoType = "percent" | "baht" | "bxgy";

export type PromoInput = {
  price: number;
  unitCost: number;
  baseUnits: number;        // ยอดขายปกติต่อเดือน (ชิ้น)
  type: PromoType;
  percent: number;          // ใช้เมื่อ type = percent
  baht: number;             // ใช้เมื่อ type = baht
  buyX: number;             // ซื้อ X
  getY: number;             // แถม Y
  expectedLiftPct: number;  // คาดว่าจะขายได้เพิ่มกี่ %
};

export type PromoVerdict = "worth" | "even" | "not-worth" | "loss-per-unit";

export type PromoResult =
  | { ok: false; reason: "no-price" | "no-margin" }
  | {
      ok: true;
      promoPrice: number;          // รายได้ต่อชิ้นที่ส่งออกไปจริง
      effectiveDiscount: number;   // 0..1
      baseProfitPerUnit: number;
      promoProfitPerUnit: number;
      baseMargin: number;
      requiredLift: number | null; // null = ขายเท่าไหร่ก็ไม่คืนทุน
      requiredUnits: number | null;
      expectedUnits: number;
      baseProfit: number;
      promoProfit: number;
      profitDiff: number;
      verdict: PromoVerdict;
    };

export function promoUnitPrice(i: PromoInput): number {
  const p = Math.max(0, i.price);
  switch (i.type) {
    case "percent":
      return p * (1 - Math.min(100, Math.max(0, i.percent)) / 100);
    case "baht":
      return Math.max(0, p - Math.max(0, i.baht));
    case "bxgy": {
      const x = Math.max(1, Math.round(i.buyX));
      const y = Math.max(0, Math.round(i.getY));
      return (p * x) / (x + y);
    }
  }
}

/** Required sales lift (0.5 = +50%) to keep profit for a given effective discount (0..1). */
export function requiredLiftFor(price: number, unitCost: number, discount: number): number | null {
  const base = price - unitCost;
  const promo = price * (1 - discount) - unitCost;
  if (!(base > 0) || !(promo > 0)) return null;
  return base / promo - 1;
}

export function promo(i: PromoInput): PromoResult {
  if (!(i.price > 0)) return { ok: false, reason: "no-price" };
  const base = i.price - Math.max(0, i.unitCost);
  if (!(base > 0)) return { ok: false, reason: "no-margin" };

  const promoPrice = promoUnitPrice(i);
  const promoPPU = promoPrice - Math.max(0, i.unitCost);
  const units = Math.max(0, i.baseUnits);
  const lift = Math.max(-1, i.expectedLiftPct / 100);
  const expectedUnits = units * (1 + lift);
  const baseProfit = units * base;
  const promoProfit = expectedUnits * promoPPU;
  const requiredLift = promoPPU > 0 ? base / promoPPU - 1 : null;
  const diff = promoProfit - baseProfit;

  let verdict: PromoVerdict;
  if (!(promoPPU > 0)) verdict = "loss-per-unit";
  else if (Math.abs(diff) <= Math.max(1, baseProfit * 0.005)) verdict = "even";
  else verdict = diff > 0 ? "worth" : "not-worth";

  return {
    ok: true,
    promoPrice,
    effectiveDiscount: 1 - promoPrice / i.price,
    baseProfitPerUnit: base,
    promoProfitPerUnit: promoPPU,
    baseMargin: base / i.price,
    requiredLift,
    requiredUnits: requiredLift === null ? null : Math.ceil(units * (1 + requiredLift) - 1e-9),
    expectedUnits,
    baseProfit,
    promoProfit,
    profitDiff: diff,
    verdict,
  };
}

/** Deepest effective discount (0..1) that still earns at least normal profit at a given sales lift. */
export function maxDiscountFor(price: number, unitCost: number, liftPct: number): number | null {
  const base = price - unitCost;
  if (!(price > 0) || !(base > 0) || !(liftPct > 0)) return null;
  return 1 - (unitCost + base / (1 + liftPct / 100)) / price;
}
