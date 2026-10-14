// Number & date formatting for Thai readers.

const nf = (digits: number) =>
  new Intl.NumberFormat("th-TH", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const NF0 = nf(0);
const NF1 = nf(1);
const NF2 = nf(2);

const pick = (d: number) => (d === 0 ? NF0 : d === 1 ? NF1 : d === 2 ? NF2 : nf(d));

export const isNum = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

/** 12,345 */
export const fmtNum = (n: number, digits = 0) => (isNum(n) ? pick(digits).format(n) : "—");

/** 7 · 2.5 · 12.75 — up to `maxDigits` decimals, no trailing zeros. */
export const fmtNumMax = (n: number, maxDigits = 2) =>
  isNum(n) ? new Intl.NumberFormat("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: maxDigits }).format(n) : "—";

/** ฿12,345 · −฿1,200 */
export const fmtBaht = (n: number, digits = 0) => {
  if (!isNum(n)) return "—";
  const s = pick(digits).format(Math.abs(n));
  return n < 0 ? `−฿${s}` : `฿${s}`;
};

/** Baht with satang only when the value has them (for VAT / invoices). */
export const fmtBahtExact = (n: number) => {
  if (!isNum(n)) return "—";
  const r = Math.round(n * 100) / 100;
  return fmtBaht(r, Number.isInteger(r) ? 0 : 2);
};

/** Large headline amounts: ฿12.5 ล้าน once past ten million. */
export const fmtBahtBig = (n: number) => {
  if (!isNum(n)) return "—";
  if (Math.abs(n) >= 10_000_000) {
    const v = n / 1_000_000;
    return `${n < 0 ? "−" : ""}฿${NF1.format(Math.abs(v)).replace(/\.0$/, "")} ล้าน`;
  }
  return fmtBaht(n);
};

/** Axis ticks: 0 · 20K · 1.2M */
export const fmtCompact = (n: number) => {
  if (!isNum(n)) return "";
  const a = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  if (a >= 1_000_000) return `${sign}${trim(a / 1_000_000)}M`;
  if (a >= 1_000) return `${sign}${trim(a / 1_000)}K`;
  return `${sign}${Math.round(a)}`;
};
const trim = (v: number) => (v >= 100 ? Math.round(v).toString() : v.toFixed(1).replace(/\.0$/, ""));

/** 33.3% (digits default 1, trailing .0 dropped) */
export const fmtPct = (ratio: number, digits = 1) => {
  if (!isNum(ratio)) return "—";
  const s = (ratio * 100).toFixed(digits).replace(/\.0+$/, "");
  return `${s}%`;
};

const TH_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

/** "มี.ค. 2570" — Thai short month + Buddhist-era year. */
export const thaiMonthYear = (d: Date) => `${TH_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;

export const addMonths = (d: Date, months: number) => {
  const r = new Date(d.getFullYear(), d.getMonth(), 1);
  r.setMonth(r.getMonth() + Math.floor(months));
  return r;
};

/** "2 ปี 3 เดือน" / "8 เดือน" / "0.5 เดือน" */
export const fmtDuration = (months: number) => {
  if (!isNum(months)) return "—";
  if (months < 1) return `${(Math.max(0, months)).toFixed(1).replace(/\.0$/, "")} เดือน`;
  const m = Math.floor(months);
  const y = Math.floor(m / 12);
  const rest = m % 12;
  if (y === 0) return `${m} เดือน`;
  return rest === 0 ? `${y} ปี` : `${y} ปี ${rest} เดือน`;
};

export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Safe number from possibly-empty input. */
export const num = (v: number | null | undefined, fallback = 0) => (isNum(v) ? v : fallback);
