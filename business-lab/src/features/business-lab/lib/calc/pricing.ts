// ตั้งราคาขาย — price that leaves the margin you want after fees, ads and VAT.

export type PricingInput = {
  productCost: number;   // ทุนสินค้าต่อชิ้น
  extraCost: number;     // ค่าแพ็ก / ค่าส่งที่เราจ่ายต่อชิ้น
  feePct: number;        // ค่าธรรมเนียมแพลตฟอร์ม/บัตร (% ของราคาที่ลูกค้าจ่าย)
  adCost: number;        // ค่าโฆษณาต่อออเดอร์
  vat: boolean;          // ราคาที่ลูกค้าจ่ายรวม VAT แล้ว (ผู้ประกอบการจด VAT)
  vatRate: number;       // % เช่น 7
};

export type PriceBreakdown = {
  price: number;         // ราคาที่ลูกค้าจ่าย
  netPrice: number;      // ราคาหลังหัก VAT (รายได้จริงของร้าน)
  vatAmount: number;
  fee: number;
  productCost: number;
  extraCost: number;
  adCost: number;
  profit: number;        // กำไรต่อชิ้นหลังหักทุกอย่าง
  margin: number;        // กำไร / ราคาหลัง VAT
  markup: number;        // (ราคาหลัง VAT − ทุนสินค้ารวมค่าแพ็ก) / ทุนนั้น
  costMultiple: number;  // ราคาที่ลูกค้าจ่าย ÷ ทุนสินค้า
  maxAdPerOrder: number; // ค่าโฆษณาต่อออเดอร์สูงสุดก่อนขาดทุน
  breakEvenRoas: number | null; // ยอดขาย ÷ ค่าโฆษณา ขั้นต่ำ
};

const vatMult = (i: PricingInput) => (i.vat ? 1 + Math.max(0, i.vatRate) / 100 : 1);

export function breakdown(i: PricingInput, price: number): PriceBreakdown {
  const v = vatMult(i);
  const netPrice = price / v;
  const fee = (Math.max(0, i.feePct) / 100) * price;
  const goods = Math.max(0, i.productCost) + Math.max(0, i.extraCost);
  const ad = Math.max(0, i.adCost);
  const beforeAds = netPrice - fee - goods;
  const profit = beforeAds - ad;
  return {
    price,
    netPrice,
    vatAmount: price - netPrice,
    fee,
    productCost: Math.max(0, i.productCost),
    extraCost: Math.max(0, i.extraCost),
    adCost: ad,
    profit,
    margin: netPrice > 0 ? profit / netPrice : 0,
    markup: goods > 0 ? (netPrice - goods) / goods : 0,
    costMultiple: i.productCost > 0 ? price / i.productCost : 0,
    maxAdPerOrder: beforeAds,
    breakEvenRoas: beforeAds > 0 ? price / beforeAds : null,
  };
}

export type TargetPriceResult =
  | { ok: false; reason: "no-cost" | "impossible" }
  | { ok: true; exact: number; pretty: number; atExact: PriceBreakdown; atPretty: PriceBreakdown; naive: NaiveTrap };

/** What happens if someone just marks cost up by the target % (the common mistake). */
export type NaiveTrap = { price: number; margin: number };

/** Solve price G so that profit = targetMargin × (G / vat). */
export function targetPrice(i: PricingInput, targetMarginPct: number): TargetPriceResult {
  const direct = Math.max(0, i.productCost) + Math.max(0, i.extraCost) + Math.max(0, i.adCost);
  if (!(direct > 0)) return { ok: false, reason: "no-cost" };
  const v = vatMult(i);
  const m = targetMarginPct / 100;
  const f = Math.max(0, i.feePct) / 100;
  const denom = (1 - m) / v - f;
  if (!(denom > 0.0001)) return { ok: false, reason: "impossible" };
  const exact = direct / denom;
  const pretty = prettyPrice(exact);
  const naivePrice = direct * (1 + m);
  return {
    ok: true,
    exact,
    pretty,
    atExact: breakdown(i, exact),
    atPretty: breakdown(i, pretty),
    naive: { price: naivePrice, margin: breakdown(i, naivePrice).margin },
  };
}

/**
 * Round up to a price that looks deliberate on a Thai shelf:
 * 47.2 → 49 · 234 → 239 · 1,234 → 1,290 · 12,345 → 12,390
 */
export function prettyPrice(x: number): number {
  if (!(x > 0)) return 0;
  if (x <= 9) return Math.ceil(x);
  if (x < 100) return Math.ceil((x + 1) / 10) * 10 - 1;
  if (x < 1000) return Math.ceil((x + 1) / 10) * 10 - 1;
  if (x < 10000) return Math.ceil((x + 10) / 100) * 100 - 10;
  return Math.ceil((x + 10) / 100) * 100 - 10;
}
