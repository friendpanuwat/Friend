// VAT & หัก ณ ที่จ่าย — what to invoice and what actually lands in the bank.

export type VatMode = "beforeVat" | "includesVat" | "netTarget";

export type VatInput = {
  amount: number;
  mode: VatMode;      // ยอดที่กรอกคือ: ก่อน VAT / รวม VAT แล้ว / เงินที่อยากได้รับสุทธิ
  vat: boolean;       // ผู้ขายจด VAT
  vatRate: number;    // %
  whtRate: number;    // % หัก ณ ที่จ่าย (คิดจากยอดก่อน VAT)
};

export type VatResult = {
  base: number;       // ยอดก่อน VAT
  vatAmount: number;
  total: number;      // ยอดในใบแจ้งหนี้ (รวม VAT)
  wht: number;        // ภาษีหัก ณ ที่จ่าย
  net: number;        // เงินที่ผู้รับได้จริง / ผู้จ่ายโอนจริง
};

const r2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function vatCalc(i: VatInput): VatResult {
  const amt = Math.max(0, i.amount || 0);
  const v = i.vat ? Math.max(0, i.vatRate) / 100 : 0;
  const w = Math.max(0, i.whtRate) / 100;
  let base: number;
  if (i.mode === "includesVat") base = amt / (1 + v);
  else if (i.mode === "netTarget") base = 1 + v - w > 0 ? amt / (1 + v - w) : 0;
  else base = amt;
  base = r2(base);
  const vatAmount = r2(base * v);
  const total = r2(base + vatAmount);
  const wht = r2(base * w);
  return { base, vatAmount, total, wht, net: r2(total - wht) };
}
