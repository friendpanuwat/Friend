/**
 * Jarua Product Line 2 — Financial Calculation Module v4.0
 *
 * หลักการ: ตัวเลขทั้งหมดคำนวณด้วยโค้ดนี้เท่านั้น AI ไม่มีสิทธิ์คำนวณ/แก้ตัวเลขเอง
 * ใช้กับ Persona A เท่านั้น (ธุรกิจที่ดำเนินการอยู่แล้ว) · สกุลเงินบาทไทยเท่านั้น
 *
 * โครงสร้าง v4:
 *  - ธุรกิจ 1 แห่งมีรายได้ได้หลายทาง (revenue stream) แต่ละทางมีวิธีได้เงิน (type) และเครื่องคำนวณ (engine) ของตัวเอง
 *  - ทุก engine ส่งผลรูปเดียวกัน (สมุดรายเดือน: รายได้ ต้นทุนผันแปร เงินเข้า เงินออก จำนวน เพดาน)
 *  - ส่วนรวม (กำไรขาดทุน จุดคุ้มทุน เงินสด ฉาก ตัวแปรที่กระทบแรงสุด) คำนวณจากสมุดรวม
 *  - แยก "กำไร" (นับเมื่อส่งมอบ) ออกจาก "เงินสด" (นับเมื่อเงินเข้า-ออกจริง)
 *  - ทางรายได้แบบขายเป็นหน่วย (unit/service/resell) รับข้อมูลไม่ครบได้ — ค่าที่ขาดข้อมูลคำนวณเป็น null ไม่เดา
 *
 * ทางเข้าเดิมของเว็บ `calculateFinancials(FinancialRawInput)` ยังอยู่ — แปลงข้อมูลฟอร์มเดิมเป็น 1 ทางรายได้แบบ unit
 * → คำนวณด้วย v4 → แปลงผลกลับเป็นรูปแบบเดิม (FinancialCalculationResult) ให้ prompt / กราฟ / หน้า "ดูตัวเลข" ใช้ต่อได้
 */

// ============================================================
// 1. LEGACY INPUT/OUTPUT TYPES (รูปแบบที่เว็บใช้อยู่)
// ============================================================

export interface BusinessAsset {
  name: string;
  purchasePrice: number;
  usefulLifeYears: number;
}

export interface FinancialRawInput {
  unitLabel: string | null;
  pricePerUnit: number | null;
  costPerUnit: number | null;
  grossMarginPercent: number | null;
  avgMonthlySalesVolume: number | null;
  fixedCostsMonthly: number | null;
  growthRatePercentMonthly: number | null;
  daysOpenPerMonth: number | null;
  productionType: 'makes_own' | 'buys_to_resell' | null;
  maxUnitsProducedPerDay: number | null;
  maxUnitsSourcedPerMonth: number | null;
  maxUnitsFulfilledPerDay: number | null;
  cashOnHand: number | null;
  marketingSpendMonthly: number | null;
  newCustomersPerMonth: number | null;
  purchasesPerCustomerPerMonth: number | null;
  customerLifespanMonths: number | null;
  avgUnitsPerPurchase: number | null;
  assets: BusinessAsset[] | null;
  serviceAreaScope: ServiceAreaScope | null;
  populationDensityLevel: PopulationDensityLevel | null;
}

export type ServiceAreaScope = 'limited' | 'unlimited';

export type PopulationDensityLevel =
  | 'very_low'
  | 'low'
  | 'medium'
  | 'medium_high'
  | 'high';

export type ProvenanceSource = 'user' | 'derived' | 'structural_default';

export type BindingConstraint = 'production' | 'sourcing' | 'fulfillment';

/**
 * สถานะเงินสำรอง (คิดจากประมาณการ 12 เดือน)
 * - no_burn: กระแสเงินสดไม่ติดลบเลยใน 12 เดือน
 * - burn_no_cash: มีเดือนที่กระแสเงินสดติดลบ แต่ไม่ได้กรอกเงินสดที่มี
 * - cash_negative: กรอกเงินสดที่มีเป็นค่าติดลบ (คำนวณระยะเวลาไม่ได้)
 * - runs_out: เงินสดจะหมด — monthsRemaining = จำนวนเดือน (มีเศษ) คิดรายเดือนจริงถึง 36 เดือน (เกินนั้นเฉพาะกรณีกระแสเงินสดคงที่)
 * - recovers: มีเดือนที่ติดลบ แต่เงินสดไม่หมดภายใน 36 เดือน และเดือนที่ 36 กระแสเงินสดไม่ติดลบแล้ว
 * - beyond_36: เงินสดยังไม่หมดภายใน 36 เดือนแต่กระแสเงินสดยังติดลบ — ไม่ระบุตัวเลข (เกินช่วงที่คำนวณได้น่าเชื่อถือ)
 */
export type RunwayStatus = 'no_burn' | 'burn_no_cash' | 'cash_negative' | 'runs_out' | 'recovers' | 'beyond_36';

/**
 * สถานะข้อมูลต้นทุนหาลูกค้า vs มูลค่าลูกค้า (#17)
 * - FULL: มีทั้งต้นทุนหาลูกค้า (> 0) และกำไรตลอดอายุลูกค้า
 * - CAC_WITH_REVENUE_ONLY: มีต้นทุนหาลูกค้า (> 0) + รายได้ตลอดอายุลูกค้า แต่ไม่มีกำไร (ไม่ได้กรอกต้นทุนต่อหน่วย)
 * - ZERO_CAC_WITH_LTV: งบการตลาด 0 (ได้ลูกค้าใหม่โดยไม่ใช้งบ) + มีรายได้ตลอดอายุลูกค้า
 * - CAC_ONLY: มีต้นทุนหาลูกค้า แต่ไม่มีรายได้ตลอดอายุลูกค้า
 * - LTV_WITH_PROFIT: ไม่มีต้นทุนหาลูกค้า แต่มีกำไรตลอดอายุลูกค้า
 * - LTV_REVENUE_ONLY: ไม่มีต้นทุนหาลูกค้า และมีแค่รายได้ตลอดอายุลูกค้า
 * - NONE: ไม่มีทั้งสองฝั่ง
 */
export type CustomerEconomicsStatus =
  | 'FULL'
  | 'CAC_WITH_REVENUE_ONLY'
  | 'ZERO_CAC_WITH_LTV'
  | 'CAC_ONLY'
  | 'LTV_WITH_PROFIT'
  | 'LTV_REVENUE_ONLY'
  | 'NONE';

/** ตำแหน่งรายได้เทียบขนาดตลาด: ต่ำกว่าขอบล่าง / อยู่ระหว่างขอบล่าง-ขอบบน / เท่ากับหรือเกินขอบบน */
export type RevenuePositionCase = 'below_low' | 'within_range' | 'at_or_above_high';

export interface DataProvenance {
  source: ProvenanceSource;
  note?: string;
}

export interface ValueWithProvenance {
  value: number;
  provenance: DataProvenance;
}

export interface BlockedSection {
  section: string;
  missingData: string[];
  howToFind: string;
}

export interface MonthlyProjection {
  month: number;
  revenue: number;
  cogs: number;
  fixedCosts: number;
  depreciation: number;
  netProfitAccounting: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  unitsRequired: number;
  exceedsCapacity: boolean | null;
}

export interface CappedMonthlyProjection {
  month: number;
  unitsSold: number;
  revenue: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
}

export interface ScenarioResult {
  label: 'ดี' | 'กลาง' | 'แย่';
  volumeDeltaPercent: number;
  revenueMonthly: number;
  netProfitMonthly: number;
  netCashFlowMonthly: number;
  breakevenUnitsPerMonth: number | null;
  isCurrentlyProfitable: boolean;
}

export type SensitivityKey = 'price' | 'unitCost' | 'volume' | 'fixedCosts';

export interface SensitivityItem {
  key: SensitivityKey;
  variable: string;
  profitChangeIfImproved10Percent: number;
  profitChangeIfWorsened10Percent: number;
  impactMagnitude: number;
}

export interface ActionThresholds {
  pricePerUnitAlert: number;
  costPerUnitAlert: number;
  avgMonthlySalesVolumeAlert: number;
  fixedCostsMonthlyAlert: number;
  alertPercent: number;
}

export interface AssetSummaryItem {
  name: string;
  purchasePrice: number;
  usefulLifeYears: number;
  monthlyDepreciation: number;
  monthlySetAsideNeeded: number;
}

export interface MarketSizeAnalysis {
  avgSpendPerCustomerPerMonth: number;
  populationRangeLabel: string;
  populationRangeLow: number;
  populationRangeHigh: number;
  marketSizeLowBaht: number;
  marketSizeHighBaht: number;
  marketSizeLowUnitsPerMonth: number;
  marketSizeHighUnitsPerMonth: number;
  marketSizeLowUnitsPerDayRounded: number;
  marketSizeHighUnitsPerDayRounded: number;
  currentRevenueMonthly: number;
  currentUnitsPerDay: number;
  impliedPopulationFromRevenue: number;
  revenuePositionLabel: string;
  revenuePositionCase: RevenuePositionCase;
}

export interface FinancialCalculationResult {
  hasCoreData: boolean;
  blockedSections: BlockedSection[];
  inputs: {
    pricePerUnit: ValueWithProvenance | null;
    costPerUnit: ValueWithProvenance | null;
    grossMarginPercent: ValueWithProvenance | null;
    avgMonthlySalesVolume: ValueWithProvenance | null;
    fixedCostsMonthly: ValueWithProvenance | null;
    growthRatePercentMonthly: ValueWithProvenance;
    daysOpenPerMonth: ValueWithProvenance;
    cashOnHand: ValueWithProvenance | null;
  };
  revenueMonthly: number | null;
  cogsMonthly: number | null;
  totalExpensesMonthly: number | null;
  grossProfitMonthly: number | null;
  grossMarginPercentActual: number | null;
  netProfitMonthly: number | null;
  netMarginPercent: number | null;
  contributionMarginPerUnit: number | null;
  /** ทุกค่าเป็น null เมื่อธุรกิจขายได้ไม่ถึงวันละ 1 หน่วย */
  perDay: {
    unitsSold: number | null;
    revenue: number | null;
    breakevenUnits: number | null;
    unitsGapToBreakeven: number | null;
  };
  breakeven: {
    unitsPerMonth: number | null;
    revenueBaht: number | null;
    /** กำไรสุทธิต่อเดือน ≥ 0 · null = ไม่ทราบ (ข้อมูลไม่พอคำนวณกำไรสุทธิ) */
    isCurrentlyProfitable: boolean | null;
    cashUnitsPerMonth: number | null;
    cashRevenueBaht: number | null;
    firstMonthWithPositiveCashFlow: number | null;
    monthCumulativeTurnsPositive: number | null;
  };
  depreciation: {
    monthlyTotal: number;
    hasAssetData: boolean;
    assets: AssetSummaryItem[];
  };
  capacity: {
    productionType: 'makes_own' | 'buys_to_resell' | null;
    maxUnitsPerMonth: number | null;
    currentUtilizationPercent: number | null;
    monthCapacityReached: number | null;
    maxRevenueMonthly: number | null;
    bindingConstraint: BindingConstraint | null;
  };
  customerEconomics: {
    costToAcquireOneCustomer: number | null;
    revenuePerCustomerLifetime: number | null;
    profitPerCustomerLifetime: number | null;
    profitToAcquisitionCostRatio: number | null;
    status: CustomerEconomicsStatus;
    /** ชื่อช่องในฟอร์มที่ยังขาดจริง (ภาษาไทย) — ว่างเมื่อ status = FULL */
    missingData: string[];
    /** true เมื่อรายได้/กำไรตลอดอายุลูกค้าคิดเป็นซื้อ 1 ครั้ง เพราะความถี่ซื้อ × ระยะเวลาไม่ถึง 1 ครั้ง (G11 E-6) */
    lifetimeCountedAsOnePurchase: boolean;
  };
  marketSize: MarketSizeAnalysis | null;
  runway: {
    /** เงินสดจะพอใช้อีกกี่เดือน (คิดจากประมาณการรายเดือนสูงสุด 36 เดือน) */
    monthsRemaining: number | null;
    /** เงินสดไหลออกสุทธิของเดือนแรก (> 0) — null ถ้าเดือนแรกไม่ติดลบ */
    monthlyCashBurn: number | null;
    status: RunwayStatus | null;
    /** เดือนแรกที่กระแสเงินสดติดลบ (1-12) */
    firstNegativeMonth: number | null;
    /** หลังเริ่มติดลบ กระแสเงินสดกลับเป็นบวกครั้งแรกเดือนไหน (1-36) — null ถ้าไม่กลับภายใน 36 เดือน */
    recoveryMonth: number | null;
    /** เงินสดต่ำสุดใน 12 เดือน (เงินสดที่มี + กระแสเงินสดสะสม) และเดือนที่เกิด — null ถ้าไม่ได้กรอกเงินสด */
    lowestCashBalance: number | null;
    lowestCashMonth: number | null;
  };
  projection12Months: MonthlyProjection[];
  projection3YearsRough: Array<{
    year: number;
    revenue: number;
    netCashFlow: number;
    unitsPerDayRequired: number;
    exceedsCapacity: boolean | null;
  }>;
  /** ประมาณการเดียวกับ projection12Months แต่ยอดขายแต่ละเดือนไม่เกินเพดาน (ถ้าไม่เพิ่มกำลัง) — null ถ้าไม่มีข้อมูลเพดาน หรือไม่เกินเพดานเลยใน 12 เดือน */
  projectionIfCapacityUnchanged: CappedMonthlyProjection[] | null;
  hasGrowth: boolean;
  scenarios: ScenarioResult[] | null;
  scenarioVariancePercent: number;
  sensitivity: SensitivityItem[] | null;
  actionThresholds: ActionThresholds | null;
  assumptionsSummary: Array<{
    label: string;
    value: string;
    provenance: ProvenanceSource;
    note?: string;
  }>;
  warnings: string[];
}

// ============================================================
// 2. V4 INPUT TYPES (หลายทางรายได้ — ใช้เต็มรูปแบบตั้งแต่ระยะ 2)
// ============================================================

export type StreamType =
  | 'unit' // ขายเป็นชิ้น/แก้ว/จาน ทำเอง
  | 'service' // บริการคิดเงินต่อครั้ง/ต่อชั่วโมง
  | 'resell' // ซื้อมาขายไป
  | 'subscription' // สมาชิก/แพ็กเกจจ่ายล่วงหน้า
  | 'project' // รับงานเป็นโปรเจกต์
  | 'rental' // ให้เช่า/ให้จอง
  | 'commission' // นายหน้า/ตัวแทน ได้ค่าคอม
  | 'other'; // รายได้อื่นเป็นก้อนต่อเดือน

export interface StreamBase {
  id: string;
  name: string;
  type: StreamType;
  unitLabel: string;
  growthRatePercentMonthly?: number | null;
  variableCostPercent?: number | null; // ต้นทุนที่คิดเป็น % ของรายได้
  creditDays?: number | null; // ลูกค้าจ่ายเงินหลังส่งมอบกี่วัน
  seasonal?: boolean; // ใช้ฤดูกาลของธุรกิจกับทางนี้ไหม (ค่าเริ่มต้น true)
}

/** ขายเป็นหน่วย — ทุกตัวเลขเป็น null ได้ (ไม่ทราบ) */
export interface VolumeStream extends StreamBase {
  type: 'unit' | 'service' | 'resell';
  price: number | null;
  costPerUnit?: number | null;
  grossMarginPercent?: number | null;
  unitsPerMonth: number | null;
  /** ประเภทการทำของ ใช้ตัดสินว่าเพดานไหนนับ — ถ้าไม่ระบุ (undefined) ใช้ตาม type · null = ไม่ได้ระบุ (ไม่วิเคราะห์เพดาน) */
  productionType?: 'makes_own' | 'buys_to_resell' | null;
  capacity?: {
    producedPerDay?: number | null;
    sourcedPerMonth?: number | null;
    fulfilledPerDay?: number | null;
    staffCount?: number | null;
    hoursPerDay?: number | null;
    jobsPerHourPerStaff?: number | null;
  };
  inventoryDays?: number | null;
  supplierCreditDays?: number | null;
  purchasesPerCustomerPerMonth?: number | null;
  customerLifespanMonths?: number | null;
  avgUnitsPerPurchase?: number | null;
}
export interface SubscriptionStream extends StreamBase {
  type: 'subscription';
  activeMembers: number;
  feePerCycle: number;
  cycleMonths: number;
  newMembersPerMonth: number;
  leavingMembersPerMonth: number;
  costPerMemberPerMonth?: number | null;
  maxMembers?: number | null;
  joinFee?: number | null;
}
export interface ProjectStream extends StreamBase {
  type: 'project';
  avgProjectValue: number;
  projectsPerYear: number;
  durationMonths: number;
  directCostPercent: number;
  depositPercent?: number | null;
  maxConcurrentProjects?: number | null;
  repeatJobsPerClient?: number | null;
}
export interface RentalStream extends StreamBase {
  type: 'rental';
  rentableUnits: number;
  pricePerPeriod: number;
  periodsPerMonth?: number | null;
  occupancyPercent: number;
  occupancyHighPercent?: number | null;
  occupancyLowPercent?: number | null;
  costPerOccupiedPeriod?: number | null;
  avgPeriodsPerStay?: number | null;
  costPerStay?: number | null;
  staysPerGuestLifetime?: number | null;
}
export interface CommissionStream extends StreamBase {
  type: 'commission';
  dealsPerMonth: number;
  avgDealValue: number;
  commissionPercent: number;
  splitPercent?: number | null;
  maxDealsPerMonth?: number | null;
  repeatDealsPerClient?: number | null;
}
export interface OtherStream extends StreamBase {
  type: 'other';
  amountPerMonth: number;
}
export type RevenueStream =
  | VolumeStream
  | SubscriptionStream
  | ProjectStream
  | RentalStream
  | CommissionStream
  | OtherStream;

export interface Seasonality {
  highMonths: number[];
  lowMonths: number[];
  highPercent: number;
  lowPercent: number;
}

export interface BusinessInputV4 {
  streams: RevenueStream[];
  fixedCostsMonthly: number | null;
  assets?: BusinessAsset[] | null;
  cashOnHand?: number | null;
  daysOpenPerMonth?: number | null;
  planStartMonth?: number | null;
  seasonality?: Seasonality | null;
  marketingSpendMonthly?: number | null;
  newCustomersPerMonth?: number | null;
  serviceAreaScope?: ServiceAreaScope | null;
  populationDensityLevel?: PopulationDensityLevel | null;
}

// ============================================================
// 3. CONSTANTS + HELPERS
// ============================================================

const SCENARIO_VARIANCE_PERCENT = 20;
const DEFAULT_DAYS_OPEN_PER_MONTH = 30;
const SENSITIVITY_TEST_PERCENT = 10;

const POPULATION_DENSITY_RANGES: Record<
  PopulationDensityLevel,
  { low: number; high: number; label: string }
> = {
  very_low: { low: 0, high: 200, label: 'น้อยมาก (น้อยกว่า 200 คน)' },
  low: { low: 200, high: 500, label: 'น้อย (200-500 คน)' },
  medium: { low: 500, high: 1000, label: 'ปานกลาง (500-1,000 คน)' },
  medium_high: { low: 1000, high: 2000, label: 'ค่อนข้างมาก (1,000-2,000 คน)' },
  high: { low: 2000, high: 4000, label: 'มาก (มากกว่า 2,000 คน)' },
};

const BINDING_CONSTRAINT_LABEL: Record<BindingConstraint, string> = {
  production: 'ทำ/ผลิต/ให้บริการเอง',
  sourcing: 'หาของเข้าร้าน',
  fulfillment: 'เตรียมของส่งลูกค้า',
};

/** จำลองย้อนหลังคงที่ก่อนเริ่มแผน (ให้เดือนแรกได้เงินจากยอดขายก่อนหน้าตามจริง) */
const WARMUP = 24;
/** เดือนที่คาดการณ์ (12 เดือนละเอียด + ถึง 36 เดือนแบบหยาบ) */
const H = 36;
const N = WARMUP + H;
const monthNo = (i: number) => i - WARMUP + 1; // 1 = เดือนแรกของแผน (<=0 = ช่วงจำลองย้อนหลัง)

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
const sum = (a: number[]) => a.reduce((s, x) => s + x, 0);
const isPos = (v: number | null | undefined): v is number => v !== null && v !== undefined && v > 0;

/** ตัวคูณการเติบโตของเดือนที่ i — เดือนแรกของแผนและช่วงย้อนหลัง = 1 (สูตรเดียวกับ v3: (1+g/100)^(m-1)) */
function growthMult(i: number, g: number | null | undefined): number {
  const m = monthNo(i);
  if (m <= 1) return 1;
  return Math.pow(1 + (g ?? 0) / 100, m - 1);
}

function seasonFactors(s: Seasonality | null | undefined, start: number): number[] {
  // ตัวเลขที่ผู้ใช้กรอก = "เดือนปกติ" / เดือนขายดี-ขายแย่ ปรับขึ้นลงจากเดือนปกติ
  const raw = Array.from({ length: 12 }, (_, k) => {
    const cal = k + 1;
    if (!s) return 1;
    if (s.highMonths.includes(cal)) return 1 + s.highPercent / 100;
    if (s.lowMonths.includes(cal)) return 1 - s.lowPercent / 100;
    return 1;
  });
  return Array.from({ length: N }, (_, i) => {
    const cal = ((((start - 1 + monthNo(i) - 1) % 12) + 12) % 12) + 1;
    return raw[cal - 1];
  });
}

function seasonKinds(s: Seasonality | null | undefined, start: number): Array<'high' | 'low' | 'normal'> {
  return Array.from({ length: N }, (_, i) => {
    const cal = ((((start - 1 + monthNo(i) - 1) % 12) + 12) % 12) + 1;
    if (!s) return 'normal';
    return s.highMonths.includes(cal) ? 'high' : s.lowMonths.includes(cal) ? 'low' : 'normal';
  });
}

/** เลื่อนเงินไปข้างหน้า d วัน แบ่งตามสัดส่วนระหว่างสองเดือน (d = 0 คืนค่าเดิม) */
function shift(series: number[], days: number): number[] {
  if (!days) return [...series];
  const out = new Array(series.length).fill(0);
  const L = days / 30;
  const k = Math.floor(L);
  const f = L - k;
  series.forEach((v, i) => {
    const a = i + k;
    const b = i + k + 1;
    if (a >= 0 && a < out.length) out[a] += v * (1 - f);
    if (b >= 0 && b < out.length) out[b] += v * f;
  });
  return out;
}

/** เงินก้อนเดียว (เช่น งวดสุดท้ายของงาน) เข้าเดือนที่ถึงกำหนดจริง (ปัดขึ้นเป็นเดือนเต็ม) */
function lumpShift(series: number[], days: number): number[] {
  const k = Math.ceil(days / 30 - 1e-9);
  const out = new Array(series.length).fill(0);
  series.forEach((v, i) => {
    if (i + k >= 0 && i + k < out.length) out[i + k] += v;
  });
  return out;
}

// ============================================================
// 4. ENGINES — ทุก engine คืนสมุดรายเดือนรูปเดียวกัน (Ledger)
// ============================================================

type CapKind = BindingConstraint | 'staff' | 'members' | 'rooms' | 'deals' | 'concurrent';

interface Ledger {
  stream: RevenueStream;
  /** รายได้/ต้นทุนผันแปร/เงินเข้า/เงินออกต่อเดือน (index 0..N-1) — null = ไม่ทราบ (ข้อมูลไม่พอ) */
  revenue: number[] | null;
  varCost: number[] | null;
  cashIn: number[] | null;
  cashOutVar: number[] | null;
  /** จำนวนตามหน่วยของทางนี้ (หลังตัดเพดานจริงแล้ว) */
  volume: number[] | null;
  /** จำนวนที่อยากขายก่อนชนเพดาน */
  volumeWanted: number[] | null;
  /** ค่าไม่ปัดเศษ (ใช้ประมาณการ 3 ปีแบบหยาบ) */
  revenueRaw: number[] | null;
  varCostRaw: number[] | null;
  /** เพดานต่อเดือน (null = ไม่ทราบ/ไม่มี) */
  capacity: number | null;
  capacityKind: CapKind | null;
  /** true = เพดานจริงทางกายภาพ ตัดยอดเสมอ · false = เพดานที่ขยายได้ (เส้นหลักไม่ตัด) */
  hardCap: boolean;
  /** "เดือนปกติ" ของทางนี้ */
  typical: { revenue: number | null; varCost: number | null; volume: number | null };
  /** ประมาณการถ้าไม่เพิ่มกำลัง (เฉพาะเพดานที่ขยายได้) */
  capped: { revenue: number[]; varCost: number[]; units: number[] } | null;
  /** เฉพาะทางแบบขายเป็นหน่วย */
  unit: VolumeUnitDetail | null;
}

interface VolumeUnitDetail {
  price: number | null;
  units: number | null;
  unitCost: number | null;
  unitCostSource: 'user' | 'derived' | null;
  grossMarginInput: number | null;
  grossMarginInputSource: 'user' | 'derived' | null;
  contributionMarginPerUnit: number | null;
  productionType: 'makes_own' | 'buys_to_resell' | null;
  lifetimeUnits: number | null;
  lifetimeFloored: boolean;
  purchasesPerCustomerPerMonth: number | null;
  avgUnitsPerPurchase: number;
}

function emptyArr(): number[] {
  return new Array(N).fill(0);
}

function volumeEngine(s: VolumeStream, days: number, sf: number[]): Ledger {
  const price = isPos(s.price) ? s.price : null;
  const units = isPos(s.unitsPerMonth) ? s.unitsPerMonth : null;
  const pct = s.variableCostPercent ?? 0;

  let unitCost: number | null = null;
  let unitCostSource: 'user' | 'derived' | null = null;
  let grossMarginInput: number | null = null;
  let grossMarginInputSource: 'user' | 'derived' | null = null;
  if (s.costPerUnit !== null && s.costPerUnit !== undefined && s.costPerUnit >= 0) {
    unitCost = s.costPerUnit;
    unitCostSource = 'user';
    if (price !== null && price > 0) {
      grossMarginInput = ((price - unitCost) / price) * 100;
      grossMarginInputSource = 'derived';
    }
  } else if (s.grossMarginPercent !== null && s.grossMarginPercent !== undefined) {
    grossMarginInput = s.grossMarginPercent;
    grossMarginInputSource = 'user';
    if (price !== null) {
      unitCost = price * (1 - grossMarginInput / 100);
      unitCostSource = 'derived';
    }
  }

  const contributionMarginPerUnit =
    price !== null && unitCost !== null
      ? pct
        ? round2(price - unitCost - (price * pct) / 100)
        : round2(price - unitCost)
      : null;

  // เพดาน — ลำดับและเงื่อนไขเดียวกับ v3 (เท่ากันให้ตัวแรกชนะ)
  const productionType: 'makes_own' | 'buys_to_resell' | null =
    s.productionType !== undefined ? s.productionType : s.type === 'resell' ? 'buys_to_resell' : 'makes_own';
  const c = s.capacity ?? {};
  let capacity: number | null = null;
  let capacityKind: CapKind | null = null;
  if (productionType !== null) {
    const cands: Array<{ type: CapKind; unitsPerMonth: number }> = [];
    if (productionType === 'makes_own' && isPos(c.producedPerDay)) cands.push({ type: 'production', unitsPerMonth: round2(c.producedPerDay * days) });
    if (productionType === 'buys_to_resell' && isPos(c.sourcedPerMonth)) cands.push({ type: 'sourcing', unitsPerMonth: c.sourcedPerMonth });
    if (isPos(c.fulfilledPerDay)) cands.push({ type: 'fulfillment', unitsPerMonth: round2(c.fulfilledPerDay * days) });
    if (isPos(c.staffCount) && isPos(c.hoursPerDay) && isPos(c.jobsPerHourPerStaff))
      cands.push({ type: 'staff', unitsPerMonth: Math.floor(c.staffCount * c.hoursPerDay * c.jobsPerHourPerStaff) * days });
    if (cands.length > 0) {
      const lowest = cands.reduce((min, x) => (x.unitsPerMonth < min.unitsPerMonth ? x : min));
      capacity = lowest.unitsPerMonth;
      capacityKind = lowest.type;
    }
  }

  // เดือนปกติ (ไม่มีฤดูกาล) — สูตรเดียวกับ v3
  const baseRevenue = price !== null && units !== null ? round2(price * units) : null;
  const baseCogs = unitCost !== null && units !== null ? round2(unitCost * units) : null;
  const seasonOn = s.seasonal !== false;

  const L: Ledger = {
    stream: s,
    revenue: null, varCost: null, cashIn: null, cashOutVar: null,
    volume: null, volumeWanted: null, revenueRaw: null, varCostRaw: null,
    capacity, capacityKind, hardCap: false,
    typical: { revenue: null, varCost: null, volume: null },
    capped: null,
    unit: {
      price, units, unitCost, unitCostSource, grossMarginInput, grossMarginInputSource, contributionMarginPerUnit, productionType,
      lifetimeUnits: null,
      lifetimeFloored: false,
      purchasesPerCustomerPerMonth: s.purchasesPerCustomerPerMonth ?? null,
      avgUnitsPerPurchase: s.avgUnitsPerPurchase ?? 1,
    },
  };

  const mults = Array.from({ length: N }, (_, i) => {
    const season = seasonOn ? sf[i] : 1;
    const g = growthMult(i, s.growthRatePercentMonthly);
    return season === 1 ? g : season * g;
  });
  const hasSeason = seasonOn && sf.some((x) => x !== 1);

  if (units !== null) {
    L.volumeWanted = mults.map((m) => units * m);
    L.volume = mults.map((m) => round2(units * m));
    L.typical.volume = hasSeason ? sum(L.volume.slice(WARMUP - 12, WARMUP)) / 12 : units;
  }
  if (baseRevenue !== null) {
    L.revenue = mults.map((m) => round2(baseRevenue * m));
    L.revenueRaw = mults.map((m) => baseRevenue * m);
    L.typical.revenue = hasSeason ? round2(sum(L.revenue.slice(WARMUP - 12, WARMUP)) / 12) : baseRevenue;
  }
  if (baseCogs !== null) {
    const cogs = mults.map((m) => round2(baseCogs * m));
    const cogsRaw = mults.map((m) => baseCogs * m);
    if (!pct) {
      L.varCost = cogs;
      L.varCostRaw = cogsRaw;
      L.typical.varCost = hasSeason ? round2(sum(cogs.slice(WARMUP - 12, WARMUP)) / 12) : baseCogs;
    } else if (L.revenue !== null) {
      const rev = L.revenue;
      L.varCost = cogs.map((x, i) => round2(x + round2((rev[i] * pct) / 100)));
      L.varCostRaw = cogsRaw.map((x, i) => x + (L.revenueRaw![i] * pct) / 100);
      L.typical.varCost = hasSeason
        ? round2(sum(L.varCost.slice(WARMUP - 12, WARMUP)) / 12)
        : round2(baseCogs + round2(((baseRevenue as number) * pct) / 100));
    }
    // เงินออก: ค่าของจ่ายตามเครดิตผู้ขาย/สต๊อก + ต้นทุนที่เป็น % จ่ายเดือนเดียวกับรายได้
    const payShift = (s.supplierCreditDays ?? 0) - (s.inventoryDays ?? 0);
    if (L.varCost !== null) {
      if (!pct) L.cashOutVar = shift(cogs, payShift);
      else {
        const goods = shift(cogs, payShift);
        L.cashOutVar = goods.map((g, i) => g + (L.varCost![i] - cogs[i]));
      }
    }
  }
  if (L.revenue !== null) L.cashIn = shift(L.revenue, s.creditDays ?? 0);

  // ถ้าไม่เพิ่มกำลัง: ยอดแต่ละเดือนไม่เกินเพดาน (สูตรเดียวกับ v3.6)
  if (capacity !== null && units !== null && baseRevenue !== null && baseCogs !== null && !pct) {
    const capRev: number[] = [], capCogs: number[] = [], capUnits: number[] = [];
    for (let i = 0; i < N; i++) {
      const unitsWanted = units * mults[i];
      const unitsSold = Math.min(unitsWanted, capacity);
      const share = unitsSold / unitsWanted;
      capRev.push(round2(baseRevenue * mults[i] * share));
      capCogs.push(round2(baseCogs * mults[i] * share));
      capUnits.push(round2(unitsSold));
    }
    L.capped = { revenue: capRev, varCost: capCogs, units: capUnits };
  }

  // จำนวนหน่วยที่ลูกค้า 1 คนซื้อตลอดอายุ
  if (s.purchasesPerCustomerPerMonth !== null && s.purchasesPerCustomerPerMonth !== undefined &&
      s.customerLifespanMonths !== null && s.customerLifespanMonths !== undefined) {
    // ลูกค้าที่หามาได้ซื้ออย่างน้อย 1 ครั้งเสมอ (G11 E-6) — ลำดับการคูณเดียวกับ v3 เมื่อซื้อตั้งแต่ 1 ครั้งขึ้นไป
    const upp = s.avgUnitsPerPurchase ?? 1;
    L.unit!.lifetimeUnits = s.purchasesPerCustomerPerMonth * s.customerLifespanMonths >= 1
      ? upp * s.purchasesPerCustomerPerMonth * s.customerLifespanMonths
      : upp;
    L.unit!.lifetimeFloored = !(s.purchasesPerCustomerPerMonth * s.customerLifespanMonths >= 1);
  }
  return L;
}

function fullLedger(s: RevenueStream, hardCap: boolean): Ledger {
  return {
    stream: s,
    revenue: emptyArr(), varCost: emptyArr(), cashIn: emptyArr(), cashOutVar: emptyArr(),
    volume: emptyArr(), volumeWanted: emptyArr(), revenueRaw: null, varCostRaw: null,
    capacity: null, capacityKind: null, hardCap,
    typical: { revenue: null, varCost: null, volume: null },
    capped: null, unit: null,
  };
}

function finishTypical(L: Ledger) {
  const typ = (a: number[]) => sum(a.slice(WARMUP - 12, WARMUP)) / 12;
  L.typical = { revenue: typ(L.revenue!), varCost: typ(L.varCost!), volume: typ(L.volume!) };
  L.revenueRaw = [...L.revenue!];
  L.varCostRaw = [...L.varCost!];
}

function subscriptionEngine(s: SubscriptionStream, sf: number[]): Ledger {
  const churn = s.activeMembers > 0 ? s.leavingMembersPerMonth / s.activeMembers : 0;
  const cyc = Math.max(1, Math.round(s.cycleMonths));
  const lossAtRenewal = Math.min(1, churn * cyc);
  const feeM = s.feePerCycle / cyc;
  const max = isPos(s.maxMembers) ? s.maxMembers : Infinity;
  const L = fullLedger(s, true);
  let buckets = new Array(cyc).fill(s.activeMembers / cyc);
  const cashRaw = emptyArr();
  for (let i = 0; i < N; i++) {
    const planning = monthNo(i) >= 1;
    const season = s.seasonal === false ? 1 : sf[i];
    const due = buckets[0];
    const renew = due * (1 - lossAtRenewal);
    const stay = buckets.slice(1).reduce((x: number, y: number) => x + y, 0);
    const wantNew = planning ? s.newMembersPerMonth * season * growthMult(i, s.growthRatePercentMonthly) : due - renew;
    const room = Math.max(0, max - (stay + renew));
    const acceptedNew = Math.min(wantNew, room);
    buckets = [...buckets.slice(1), renew + acceptedNew];
    const members = stay + renew + acceptedNew;
    L.volumeWanted![i] = stay + renew + wantNew;
    L.volume![i] = members;
    const rev = members * feeM + acceptedNew * (s.joinFee ?? 0);
    L.revenue![i] = rev;
    L.varCost![i] = members * (s.costPerMemberPerMonth ?? 0) + rev * ((s.variableCostPercent ?? 0) / 100);
    cashRaw[i] = (renew + acceptedNew) * s.feePerCycle + acceptedNew * (s.joinFee ?? 0);
    L.cashOutVar![i] = L.varCost![i];
  }
  L.cashIn = shift(cashRaw, s.creditDays ?? 0);
  L.capacity = isFinite(max) ? max : null;
  L.capacityKind = isFinite(max) ? 'members' : null;
  finishTypical(L);
  return L;
}

function projectEngine(s: ProjectStream, sf: number[]): Ledger {
  // เริ่มงานแบบค่าคาดหมาย (เศษได้) ไม่ปัดเป็นงานเต็ม
  const L = fullLedger(s, false);
  const d = Math.max(1, Math.round(s.durationMonths));
  const dep = (s.depositPercent ?? 0) / 100;
  const dc = s.directCostPercent / 100;
  const balance = emptyArr();
  const concurrent = emptyArr();
  for (let i = 0; i < N; i++) {
    const season = s.seasonal === false ? 1 : sf[i];
    const k = (s.projectsPerYear / 12) * season * growthMult(i, s.growthRatePercentMonthly);
    L.volume![i] = k;
    L.volumeWanted![i] = k;
    for (let m = 0; m < d; m++) {
      const j = i + m;
      if (j >= N) break;
      L.revenue![j] += (k * s.avgProjectValue) / d;
      L.varCost![j] += (k * s.avgProjectValue * dc) / d;
      concurrent[j] += k;
    }
    L.cashIn![i] += k * s.avgProjectValue * dep;
    const end = i + d - 1;
    if (end < N) balance[end] += k * s.avgProjectValue * (1 - dep);
  }
  const bal = lumpShift(balance, s.creditDays ?? 0);
  for (let i = 0; i < N; i++) {
    L.cashIn![i] += bal[i];
    L.varCost![i] += L.revenue![i] * ((s.variableCostPercent ?? 0) / 100);
    L.cashOutVar![i] = L.varCost![i];
  }
  // เพดานของงานโปรเจกต์ = งานที่ทำพร้อมกันได้ — เทียบกับงานที่ทำพร้อมกันจริง
  if (isPos(s.maxConcurrentProjects)) {
    const max = s.maxConcurrentProjects;
    L.capacity = max;
    L.capacityKind = 'concurrent';
    L.volumeWanted = concurrent;
    L.volume = concurrent;
  }
  finishTypical(L);
  return L;
}

function rentalEngine(s: RentalStream, sf: number[], sk: Array<'high' | 'low' | 'normal'>): Ledger {
  const per = s.periodsPerMonth ?? 30;
  const available = s.rentableUnits * per;
  const L = fullLedger(s, true);
  for (let i = 0; i < N; i++) {
    const season = s.seasonal === false ? 1 : sf[i];
    const direct = s.seasonal !== false && sk[i] === 'high' && s.occupancyHighPercent != null ? s.occupancyHighPercent
      : s.seasonal !== false && sk[i] === 'low' && s.occupancyLowPercent != null ? s.occupancyLowPercent : null;
    const occWanted = direct !== null ? (direct / 100) * growthMult(i, s.growthRatePercentMonthly)
      : (s.occupancyPercent / 100) * season * growthMult(i, s.growthRatePercentMonthly);
    const occ = Math.min(1, occWanted);
    const booked = available * occ;
    L.volumeWanted![i] = available * occWanted;
    L.volume![i] = booked;
    L.revenue![i] = booked * s.pricePerPeriod;
    const stays = s.avgPeriodsPerStay ? booked / s.avgPeriodsPerStay : 0;
    L.varCost![i] = booked * (s.costPerOccupiedPeriod ?? 0) + stays * (s.costPerStay ?? 0) + L.revenue![i] * ((s.variableCostPercent ?? 0) / 100);
    L.cashOutVar![i] = L.varCost![i];
  }
  L.cashIn = shift(L.revenue!, s.creditDays ?? 0);
  L.capacity = available;
  L.capacityKind = 'rooms';
  finishTypical(L);
  return L;
}

function commissionEngine(s: CommissionStream, sf: number[]): Ledger {
  const L = fullLedger(s, false);
  for (let i = 0; i < N; i++) {
    const season = s.seasonal === false ? 1 : sf[i];
    const deals = s.dealsPerMonth * season * growthMult(i, s.growthRatePercentMonthly);
    L.volumeWanted![i] = deals;
    L.volume![i] = deals;
    L.revenue![i] = deals * s.avgDealValue * (s.commissionPercent / 100);
    L.varCost![i] = L.revenue![i] * (((s.splitPercent ?? 0) + (s.variableCostPercent ?? 0)) / 100);
  }
  L.cashIn = shift(L.revenue!, s.creditDays ?? 0);
  L.cashOutVar = shift(L.varCost!, s.creditDays ?? 0); // จ่ายส่วนแบ่งเมื่อได้เงินค่าคอม
  if (isPos(s.maxDealsPerMonth)) {
    L.capacity = s.maxDealsPerMonth;
    L.capacityKind = 'deals';
  }
  finishTypical(L);
  return L;
}

function otherEngine(s: OtherStream, sf: number[]): Ledger {
  const L = fullLedger(s, false);
  for (let i = 0; i < N; i++) {
    const season = s.seasonal === false ? 1 : sf[i];
    L.volume![i] = L.volumeWanted![i] = 1;
    L.revenue![i] = s.amountPerMonth * season * growthMult(i, s.growthRatePercentMonthly);
    L.varCost![i] = L.revenue![i] * ((s.variableCostPercent ?? 0) / 100);
  }
  L.cashIn = shift(L.revenue!, s.creditDays ?? 0);
  L.cashOutVar = [...L.varCost!];
  finishTypical(L);
  return L;
}

// ============================================================
// 5. CORE — calculateV4
// ============================================================

export interface V4Month {
  month: number;
  calendarMonth: number;
  revenue: number;
  variableCost: number;
  fixedCosts: number;
  depreciation: number;
  netProfitAccounting: number;
  cashIn: number;
  cashOut: number;
  netCashFlow: number;
  cumulativeCashFlow: number;
  cashBalance: number | null;
  /** จำนวนของทางหลัก (ธุรกิจ 1 ทางแบบขายเป็นหน่วย = จำนวนที่ต้องขาย) */
  unitsMain: number;
  exceedsCapacity: boolean | null;
  capacityHit: string[];
}

export interface V4Result {
  daysOpenPerMonth: number;
  daysOpenProvided: boolean;
  growthRatePercentMonthly: number;
  growthProvided: boolean;
  isSingleVolumeStream: boolean;
  streams: Array<{
    id: string; name: string; type: StreamType; unitLabel: string;
    revenueMonthly: number | null; variableCostMonthly: number | null; contributionMonthly: number | null;
    shareOfRevenuePercent: number | null;
    capacity: number | null; capacityKind: CapKind | null;
  }>;
  /** ข้อมูลระดับหน่วยของทางหลัก (เฉพาะธุรกิจ 1 ทางแบบขายเป็นหน่วย) */
  unit: VolumeUnitDetail | null;
  revenueMonthly: number | null;
  variableCostMonthly: number | null;
  grossProfitMonthly: number | null;
  grossMarginPercentActual: number | null;
  fixedCostsMonthly: number | null;
  depreciation: { monthlyTotal: number; hasAssetData: boolean; assets: AssetSummaryItem[] };
  totalExpensesMonthly: number | null;
  netProfitMonthly: number | null;
  netMarginPercent: number | null;
  breakeven: {
    unitsPerMonth: number | null;
    revenueBaht: number | null;
    cashUnitsPerMonth: number | null;
    cashRevenueBaht: number | null;
    isCurrentlyProfitable: boolean | null;
    firstMonthWithPositiveCashFlow: number | null;
    monthCumulativeTurnsPositive: number | null;
    contributionNotPositive: boolean;
    lowVolume: boolean;
  };
  perDay: { unitsSold: number | null; revenue: number | null; breakevenUnits: number | null; unitsGapToBreakeven: number | null };
  capacity: {
    maxUnitsPerMonth: number | null;
    bindingConstraint: BindingConstraint | null;
    currentUtilizationPercent: number | null;
    maxRevenueMonthly: number | null;
    monthCapacityReached: number | null;
  };
  projection: V4Month[];
  projectionIfCapacityUnchanged: CappedMonthlyProjection[] | null;
  projection3YearsRough: FinancialCalculationResult['projection3YearsRough'];
  cashOnHand: number | null;
  runway: FinancialCalculationResult['runway'];
  customerEconomics: FinancialCalculationResult['customerEconomics'];
  marketSize: MarketSizeAnalysis | null;
  marketSizeMissing: { density: boolean; purchaseFrequency: boolean; unitsPerPurchase: boolean; price: boolean; volume: boolean } | null;
  scenarios: ScenarioResult[] | null;
  sensitivity: SensitivityItem[] | null;
  actionThresholds: ActionThresholds | null;
  hasGrowth: boolean;
}

export function calculateV4(input: BusinessInputV4): V4Result {
  const daysProvided = input.daysOpenPerMonth !== null && input.daysOpenPerMonth !== undefined && input.daysOpenPerMonth > 0;
  const days = daysProvided ? (input.daysOpenPerMonth as number) : DEFAULT_DAYS_OPEN_PER_MONTH;
  const start = input.planStartMonth ?? 1;
  const sf = seasonFactors(input.seasonality, start);
  const sk = seasonKinds(input.seasonality, start);
  const fixed = input.fixedCostsMonthly !== null && input.fixedCostsMonthly !== undefined && input.fixedCostsMonthly >= 0
    ? input.fixedCostsMonthly : null;

  // ค่าเสื่อม (สูตรเดียวกับ v3)
  const assetSummary: AssetSummaryItem[] = (input.assets ?? [])
    .filter((a) => a.purchasePrice > 0 && a.usefulLifeYears > 0)
    .map((a) => {
      const monthly = round2(a.purchasePrice / (a.usefulLifeYears * 12));
      return { name: a.name, purchasePrice: round2(a.purchasePrice), usefulLifeYears: a.usefulLifeYears, monthlyDepreciation: monthly, monthlySetAsideNeeded: monthly };
    });
  const dep = round2(assetSummary.reduce((s, a) => s + a.monthlyDepreciation, 0));
  const hasAssetData = assetSummary.length > 0;

  const ledgers: Ledger[] = input.streams.map((s) => {
    switch (s.type) {
      case 'unit':
      case 'service':
      case 'resell':
        return volumeEngine(s as VolumeStream, days, sf);
      case 'subscription':
        return subscriptionEngine(s as SubscriptionStream, sf);
      case 'project':
        return projectEngine(s as ProjectStream, sf);
      case 'rental':
        return rentalEngine(s as RentalStream, sf, sk);
      case 'commission':
        return commissionEngine(s as CommissionStream, sf);
      default:
        return otherEngine(s as OtherStream, sf);
    }
  });
  const single = ledgers.length === 1;
  const isSingleVolumeStream = single && ledgers[0].unit !== null;
  const u = isSingleVolumeStream ? ledgers[0].unit : null;

  const totalOf = (pick: (L: Ledger) => number | null): number | null => {
    const vals = ledgers.map(pick);
    if (vals.some((v) => v === null)) return null;
    return single ? (vals[0] as number) : round2(sum(vals as number[]));
  };
  const seriesOf = (pick: (L: Ledger) => number[] | null): number[] | null => {
    const arrs = ledgers.map(pick);
    if (arrs.some((a) => a === null)) return null;
    if (single) return arrs[0] as number[];
    return Array.from({ length: N }, (_, i) => sum((arrs as number[][]).map((a) => a[i])));
  };

  const revenueMonthly = totalOf((L) => L.typical.revenue);
  const varMonthly = totalOf((L) => L.typical.varCost);

  let grossProfitMonthly: number | null = null;
  let grossMarginPercentActual: number | null = null;
  let totalExpensesMonthly: number | null = null;
  let netProfitMonthly: number | null = null;
  let netMarginPercent: number | null = null;
  if (revenueMonthly !== null && varMonthly !== null) {
    grossProfitMonthly = round2(revenueMonthly - varMonthly);
    grossMarginPercentActual = revenueMonthly > 0 ? round2((grossProfitMonthly / revenueMonthly) * 100) : 0;
    if (fixed !== null) {
      totalExpensesMonthly = round2(varMonthly + fixed + dep);
      netProfitMonthly = round2(grossProfitMonthly - fixed - dep);
      netMarginPercent = revenueMonthly > 0 ? round2((netProfitMonthly / revenueMonthly) * 100) : 0;
    }
  }

  // ---------------- จุดคุ้มทุน + ตัวเลขรายวัน ----------------
  let beUnits: number | null = null, beRevenue: number | null = null, cbeUnits: number | null = null, cbeRevenue: number | null = null;
  let contributionNotPositive = false;
  let lowVolume = false;
  // G11 (11-2): กำไรอยู่ไหม = กำไรสุทธิต่อเดือน ≥ 0 · ไม่ทราบกำไรสุทธิ → null (ไม่ตอบว่าขาดทุนแทน)
  const isCurrentlyProfitable: boolean | null = netProfitMonthly !== null ? netProfitMonthly >= 0 : null;
  const perDay = { unitsSold: null as number | null, revenue: null as number | null, breakevenUnits: null as number | null, unitsGapToBreakeven: null as number | null };
  if (u) {
    // ธุรกิจ 1 ทางแบบขายเป็นหน่วย — สูตรต่อหน่วยเดียวกับ v3.7
    const cm = u.contributionMarginPerUnit;
    lowVolume = u.units !== null && u.units / days < 1;
    const toBE = (x: number) => (lowVolume ? Math.ceil(Math.round(x * 1e6) / 1e4) / 100 : Math.ceil(x)); // ขายน้อย: ปัดขึ้นที่ทศนิยม 2 ตำแหน่ง (เดิมปัดใกล้สุด ทำให้ขาดทุนแต่ยอดขายเท่าจุดคุ้มทุนได้)
    if (cm !== null && cm > 0 && fixed !== null && u.price !== null) {
      beUnits = toBE((fixed + dep) / cm);
      beRevenue = round2(beUnits * u.price);
      cbeUnits = toBE(fixed / cm);
      cbeRevenue = round2(cbeUnits * u.price);
    } else if (cm !== null && cm <= 0) {
      contributionNotPositive = true;
    }
    const perDayApplies = u.units !== null && !lowVolume;
    if (perDayApplies) {
      perDay.unitsSold = round2((u.units as number) / days);
      perDay.revenue = revenueMonthly !== null ? round2(revenueMonthly / days) : null;
      perDay.breakevenUnits = beUnits !== null ? Math.ceil(beUnits / days) : null;
      perDay.unitsGapToBreakeven = perDay.breakevenUnits !== null ? round2(perDay.breakevenUnits - perDay.unitsSold) : null;
      if (perDay.unitsGapToBreakeven !== null && perDay.unitsGapToBreakeven > 0 && isCurrentlyProfitable === true && beUnits !== null) {
        perDay.breakevenUnits = round2(beUnits / days);
        perDay.unitsGapToBreakeven = round2(perDay.breakevenUnits - perDay.unitsSold);
      }
    }
  } else if (revenueMonthly !== null && varMonthly !== null && fixed !== null && revenueMonthly > 0) {
    // หลายทาง: รายได้รวมที่ต้องมี (สัดส่วนรายได้แต่ละทางคงเดิม)
    const cmr = (revenueMonthly - varMonthly) / revenueMonthly;
    if (cmr > 0) {
      beRevenue = round2((fixed + dep) / cmr);
      cbeRevenue = round2(fixed / cmr);
    } else contributionNotPositive = true;
  }

  // ---------------- เพดาน ----------------
  const capLedger = u ? ledgers[0] : null;
  const maxUnitsPerMonth = capLedger ? capLedger.capacity : null;
  const capKind = capLedger ? capLedger.capacityKind : null;
  const bindingConstraint: BindingConstraint | null =
    capKind === 'production' || capKind === 'sourcing' || capKind === 'fulfillment' ? capKind : null;
  const currentUtilizationPercent =
    u && maxUnitsPerMonth !== null && maxUnitsPerMonth > 0 && u.units !== null ? round2((u.units / maxUnitsPerMonth) * 100) : null;
  const maxRevenueMonthly = u && maxUnitsPerMonth !== null && u.price !== null ? round2(maxUnitsPerMonth * u.price) : null;

  // ---------------- ประมาณการ 12 เดือน ----------------
  const revS = seriesOf((L) => L.revenue);
  const varS = seriesOf((L) => L.varCost);
  const cinS = seriesOf((L) => L.cashIn);
  const coutS = seriesOf((L) => L.cashOutVar);
  const cashOnHand = input.cashOnHand ?? null;
  const projection: V4Month[] = [];
  let firstMonthWithPositiveCashFlow: number | null = null;
  let monthCumulativeTurnsPositive: number | null = null;
  let monthCapacityReached: number | null = null;
  const mainLedger = ledgers.length ? ledgers[0] : null;
  if (revS && varS && cinS && coutS && fixed !== null && (!u || u.units !== null)) {
    let cum = 0;
    for (let t = 0; t < 12; t++) {
      const i = WARMUP + t;
      const rev = u ? revS[i] : round2(revS[i]);
      const vc = u ? varS[i] : round2(varS[i]);
      const cin = u ? cinS[i] : round2(cinS[i]);
      const cout = u ? coutS[i] : round2(coutS[i]);
      const net = round2(cin - cout - fixed);
      const accrual = round2(rev - vc - fixed);
      cum = round2(cum + net);
      if (firstMonthWithPositiveCashFlow === null && net > 0) firstMonthWithPositiveCashFlow = t + 1;
      if (monthCumulativeTurnsPositive === null && cum > 0) monthCumulativeTurnsPositive = t + 1;
      const capacityHit = ledgers
        .filter((L) => L.capacity !== null && L.volumeWanted !== null && (L.unit ? L.volume![i] > (L.capacity as number) : L.volumeWanted[i] > (L.capacity as number) + 1e-9))
        .map((L) => L.stream.id);
      const exceeds = u ? (maxUnitsPerMonth !== null ? ledgers[0].volume![i] > maxUnitsPerMonth : null)
        : ledgers.some((L) => L.capacity !== null) ? capacityHit.length > 0 : null;
      if (!u && exceeds === true && monthCapacityReached === null) monthCapacityReached = t + 1;
      projection.push({
        month: t + 1,
        calendarMonth: ((start - 1 + t) % 12) + 1,
        revenue: rev,
        variableCost: vc,
        fixedCosts: fixed,
        depreciation: dep,
        netProfitAccounting: round2(accrual - dep),
        cashIn: cin,
        cashOut: round2(cout + fixed),
        netCashFlow: net,
        cumulativeCashFlow: cum,
        cashBalance: cashOnHand !== null ? round2(cashOnHand + cum) : null,
        unitsMain: mainLedger && mainLedger.volume ? (u ? mainLedger.volume[i] : round2(mainLedger.volume[i])) : 0,
        exceedsCapacity: exceeds,
        capacityHit,
      });
    }
  }

  // G11 (19-4): เดือนที่ชนเพดาน คิดจากยอดขาย + การเติบโต + เพดานอย่างเดียว (ไม่ต้องรอต้นทุน/ค่าใช้จ่ายคงที่)
  if (u && maxUnitsPerMonth !== null && ledgers[0].volume !== null) {
    for (let t = 0; t < 12; t++) {
      if (ledgers[0].volume[WARMUP + t] > maxUnitsPerMonth) { monthCapacityReached = t + 1; break; }
    }
  }

  // ถ้าไม่เพิ่มกำลัง (เฉพาะธุรกิจ 1 ทางแบบขายเป็นหน่วย — ใช้กับกราฟ #22)
  let projectionIfCapacityUnchanged: CappedMonthlyProjection[] | null = null;
  if (u && maxUnitsPerMonth !== null && monthCapacityReached !== null && ledgers[0].capped && fixed !== null) {
    const cp = ledgers[0].capped;
    projectionIfCapacityUnchanged = [];
    let cc = 0;
    for (let t = 0; t < 12; t++) {
      const i = WARMUP + t;
      const net = round2(cp.revenue[i] - cp.varCost[i] - fixed);
      cc = round2(cc + net);
      projectionIfCapacityUnchanged.push({ month: t + 1, unitsSold: cp.units[i], revenue: cp.revenue[i], netCashFlow: net, cumulativeCashFlow: cc });
    }
  }

  // ประมาณการ 3 ปีแบบหยาบ (ไม่ปัดเศษรายเดือน — สูตรเดียวกับ v3)
  const projection3YearsRough: FinancialCalculationResult['projection3YearsRough'] = [];
  const revRaw = seriesOf((L) => L.revenueRaw);
  const varRaw = seriesOf((L) => L.varCostRaw);
  if (revRaw && varRaw && fixed !== null && mainLedger && mainLedger.volumeWanted && revenueMonthly !== null && varMonthly !== null) {
    for (let year = 1; year <= 3; year++) {
      let yearRevenue = 0, yearCashFlow = 0, lastMonthUnits = 0;
      for (let m = 1; m <= 12; m++) {
        const i = WARMUP + (year - 1) * 12 + m - 1;
        yearRevenue += revRaw[i];
        yearCashFlow += revRaw[i] - varRaw[i] - fixed;
        lastMonthUnits = mainLedger.volumeWanted[i];
      }
      const unitsPerDayRequired = round2(lastMonthUnits / days);
      projection3YearsRough.push({
        year,
        revenue: round2(yearRevenue),
        netCashFlow: round2(yearCashFlow),
        unitsPerDayRequired,
        exceedsCapacity: maxUnitsPerMonth !== null ? unitsPerDayRequired > round2(maxUnitsPerMonth / days) : null,
      });
    }
  }

  // ---------------- เงินสำรอง ----------------
  const monthlyCashBurn = revenueMonthly !== null && varMonthly !== null && fixed !== null
    ? round2(-(revenueMonthly - varMonthly - fixed)) : null;
  // G11 (C-3): เงินสดพอใช้อีกกี่เดือน — คิดจากประมาณการรายเดือนจริงสูงสุด 36 เดือน
  // (ยอดขายไม่โต = กระแสเงินสดคงที่ → ผลเท่าสูตรเดิม เงินสด ÷ เงินไหลออกต่อเดือน)
  let monthsRemaining: number | null = null;
  let runwayStatus: RunwayStatus | null = null;
  let firstNegativeMonth: number | null = null;
  let recoveryMonth: number | null = null;
  let lowestCashBalance: number | null = null;
  let lowestCashMonth: number | null = null;
  if (projection.length === 12 && revS && varS && cinS && coutS && fixed !== null) {
    const nets: number[] = [];
    for (let t = 0; t < H; t++) {
      const i = WARMUP + t;
      const cin = u ? cinS[i] : round2(cinS[i]);
      const cout = u ? coutS[i] : round2(coutS[i]);
      nets.push(round2(cin - cout - fixed));
    }
    const neg = projection.findIndex((m) => m.netCashFlow < 0);
    firstNegativeMonth = neg >= 0 ? neg + 1 : null;
    if (neg >= 0) {
      const rec = nets.findIndex((n, k) => k > neg && n > 0);
      recoveryMonth = rec >= 0 ? rec + 1 : null;
    }
    if (cashOnHand !== null) {
      projection.forEach((m) => {
        const bal = m.cashBalance as number;
        if (lowestCashBalance === null || bal < lowestCashBalance) { lowestCashBalance = bal; lowestCashMonth = m.month; }
      });
    }
    if (neg < 0) runwayStatus = 'no_burn';
    else if (cashOnHand === null) runwayStatus = 'burn_no_cash';
    else if (cashOnHand < 0) runwayStatus = 'cash_negative';
    else {
      let cum = 0;
      let prev = cashOnHand;
      for (let t = 0; t < H; t++) {
        cum = round2(cum + nets[t]);
        const bal = cashOnHand + cum; // ไม่ปัดยอดคงเหลือ (สูตรเดิมใช้เงินสดที่กรอกตรงๆ)
        if (bal < 0) { monthsRemaining = round2(t + prev / -nets[t]); break; }
        prev = bal;
      }
      const last = nets[H - 1];
      if (monthsRemaining !== null) runwayStatus = 'runs_out';
      else if (last >= 0) runwayStatus = 'recovers';
      else if (Math.max(...nets) - Math.min(...nets) <= 0.01) {
        // กระแสเงินสดคงที่ทุกเดือน (คลาดไม่เกิน 1 สตางค์จากการปัดเศษ): ต่อเส้นได้ตรงตามจริง
        monthsRemaining = round2(H + prev / -last);
        runwayStatus = 'runs_out';
      } else runwayStatus = 'beyond_36';
    }
  }

  // ---------------- ลูกค้า ----------------
  const costToAcquireOneCustomer =
    input.marketingSpendMonthly !== null && input.marketingSpendMonthly !== undefined &&
    input.newCustomersPerMonth !== null && input.newCustomersPerMonth !== undefined && input.newCustomersPerMonth > 0
      ? round2(input.marketingSpendMonthly / input.newCustomersPerMonth) : null;
  let revenuePerCustomerLifetime: number | null = null;
  let profitPerCustomerLifetime: number | null = null;
  if (u && u.price !== null && u.lifetimeUnits !== null) {
    revenuePerCustomerLifetime = round2(u.price * u.lifetimeUnits);
    if (u.contributionMarginPerUnit !== null) profitPerCustomerLifetime = round2(u.contributionMarginPerUnit * u.lifetimeUnits);
  }
  const profitToAcquisitionCostRatio =
    profitPerCustomerLifetime !== null && costToAcquireOneCustomer !== null && costToAcquireOneCustomer > 0
      ? round2(profitPerCustomerLifetime / costToAcquireOneCustomer) : null;

  // G10: สถานะข้อมูลลูกค้า + ชื่อช่องที่ขาดจริง (ให้ #17 ใช้ตรงๆ ไม่ต้องเดา)
  let customerStatus: CustomerEconomicsStatus;
  const cac = costToAcquireOneCustomer;
  if (cac === null) {
    customerStatus = profitPerCustomerLifetime !== null ? 'LTV_WITH_PROFIT' : revenuePerCustomerLifetime !== null ? 'LTV_REVENUE_ONLY' : 'NONE';
  } else if (revenuePerCustomerLifetime === null) {
    customerStatus = 'CAC_ONLY';
  } else if (cac <= 0) {
    customerStatus = 'ZERO_CAC_WITH_LTV';
  } else {
    customerStatus = profitPerCustomerLifetime !== null ? 'FULL' : 'CAC_WITH_REVENUE_ONLY';
  }
  const customerMissing: string[] = [];
  if (customerStatus !== 'FULL') {
    const ul = mainLedger ? mainLedger.stream.unitLabel : 'หน่วย';
    const spend = input.marketingSpendMonthly ?? null;
    const newC = input.newCustomersPerMonth ?? null;
    if (customerStatus !== 'ZERO_CAC_WITH_LTV') {
      if (spend === null) customerMissing.push('งบการตลาดต่อเดือน');
      if (newC === null) customerMissing.push('ลูกค้าใหม่ต่อเดือน');
      else if (newC <= 0) customerMissing.push('ลูกค้าใหม่ต่อเดือน (ต้องมากกว่า 0)');
    }
    const vs = mainLedger && mainLedger.unit ? (mainLedger.stream as VolumeStream) : null;
    if (vs) {
      const mu = mainLedger!.unit!;
      if (mu.price === null) customerMissing.push(`ราคาขายต่อ${ul}`);
      if (vs.purchasesPerCustomerPerMonth === null || vs.purchasesPerCustomerPerMonth === undefined) customerMissing.push('ครั้งที่ลูกค้าซื้อซ้ำต่อเดือน');
      if (vs.customerLifespanMonths === null || vs.customerLifespanMonths === undefined) customerMissing.push('ระยะเวลาลูกค้าซื้อต่อเนื่อง');
      if (mu.unitCost === null) customerMissing.push(`ต้นทุนต่อ${ul}`);
    }
  }

  // ---------------- ขนาดตลาด (#7 — ทางหลักแบบขายเป็นหน่วย ในพื้นที่จำกัด) ----------------
  let marketSize: MarketSizeAnalysis | null = null;
  let marketSizeMissing: V4Result['marketSizeMissing'] = null;
  if (input.serviceAreaScope === 'limited' && u) {
    const density = input.populationDensityLevel ?? null;
    const freq = u.purchasesPerCustomerPerMonth;
    const hasDensity = density !== null;
    const hasPurchaseFrequency = freq !== null && freq > 0;
    const hasValidUnitsPerPurchase = u.avgUnitsPerPurchase > 0;
    if (hasDensity && hasPurchaseFrequency && hasValidUnitsPerPurchase && u.price !== null && u.units !== null && revenueMonthly !== null) {
      const range = POPULATION_DENSITY_RANGES[density as PopulationDensityLevel];
      const avgSpendPerCustomerPerMonth = round2(u.price * (freq as number) * u.avgUnitsPerPurchase);
      const marketSizeLowBaht = round2(range.low * avgSpendPerCustomerPerMonth);
      const marketSizeHighBaht = round2(range.high * avgSpendPerCustomerPerMonth);
      const marketSizeLowUnitsPerMonth = Math.round(marketSizeLowBaht / u.price);
      const marketSizeHighUnitsPerMonth = Math.round(marketSizeHighBaht / u.price);
      // G11 (7-1): ตำแหน่งเทียบขอบล่าง/ขอบบนตรงๆ — ถ้ารายได้ถึงขอบล่างแล้ว แปลว่าร้านเดียวมีลูกค้าเท่ากับหรือมากกว่าคนทั้งพื้นที่ (กรณีคนน้อย)
      const positionCase: RevenuePositionCase =
        revenueMonthly < marketSizeLowBaht ? 'below_low' : revenueMonthly < marketSizeHighBaht ? 'within_range' : 'at_or_above_high';
      marketSize = {
        avgSpendPerCustomerPerMonth,
        populationRangeLabel: range.label,
        populationRangeLow: range.low,
        populationRangeHigh: range.high,
        marketSizeLowBaht,
        marketSizeHighBaht,
        marketSizeLowUnitsPerMonth,
        marketSizeHighUnitsPerMonth,
        marketSizeLowUnitsPerDayRounded: roundPerDayApprox(marketSizeLowUnitsPerMonth / days),
        marketSizeHighUnitsPerDayRounded: roundPerDayApprox(marketSizeHighUnitsPerMonth / days),
        currentRevenueMonthly: revenueMonthly,
        currentUnitsPerDay: Math.round(u.units / days),
        impliedPopulationFromRevenue: Math.round(revenueMonthly / avgSpendPerCustomerPerMonth),
        revenuePositionLabel: positionCase === 'within_range' && range.low === 0 ? REVENUE_POSITION_LABEL_NO_LOWER : REVENUE_POSITION_LABEL[positionCase],
        revenuePositionCase: positionCase,
      };
    } else {
      marketSizeMissing = {
        density: !hasDensity,
        purchaseFrequency: !hasPurchaseFrequency,
        unitsPerPurchase: !hasValidUnitsPerPurchase,
        price: u.price === null,
        volume: u.units === null,
      };
    }
  }

  // ---------------- ฉากสถานการณ์ / ตัวแปรที่กระทบแรงสุด / เกณฑ์เตือน (ธุรกิจ 1 ทางแบบขายเป็นหน่วย) ----------------
  let scenarios: ScenarioResult[] | null = null;
  let sensitivity: SensitivityItem[] | null = null;
  let actionThresholds: ActionThresholds | null = null;
  const unitLabel = u ? ledgers[0].stream.unitLabel : 'หน่วย';
  const coreOk = u !== null && u.price !== null && u.unitCost !== null && u.units !== null && fixed !== null && u.contributionMarginPerUnit !== null;
  if (coreOk && u) {
    const price = u.price as number, cost = u.unitCost as number, vol = u.units as number, fx = fixed as number;
    const cm = u.contributionMarginPerUnit as number;
    const pct = (ledgers[0].stream as VolumeStream).variableCostPercent ?? 0;
    const toBE = (x: number) => (lowVolume ? Math.ceil(Math.round(x * 1e6) / 1e4) / 100 : Math.ceil(x)); // ขายน้อย: ปัดขึ้นที่ทศนิยม 2 ตำแหน่ง (เดิมปัดใกล้สุด ทำให้ขาดทุนแต่ยอดขายเท่าจุดคุ้มทุนได้)
    const build = (label: ScenarioResult['label'], d: number): ScenarioResult => {
      const volume = vol * (1 + d / 100);
      const rev = round2(price * volume);
      const cogs = round2(cost * volume);
      const varCost = pct ? round2(cogs + round2((rev * pct) / 100)) : cogs;
      const cash = round2(rev - varCost - fx);
      const net = round2(cash - dep);
      const be = cm > 0 ? toBE((fx + dep) / cm) : null;
      return { label, volumeDeltaPercent: d, revenueMonthly: rev, netProfitMonthly: net, netCashFlowMonthly: cash, breakevenUnitsPerMonth: be, isCurrentlyProfitable: net >= 0 };
    };
    scenarios = [build('ดี', SCENARIO_VARIANCE_PERCENT), build('กลาง', 0), build('แย่', -SCENARIO_VARIANCE_PERCENT)];

    if (netProfitMonthly !== null) {
      const base = netProfitMonthly;
      const p = SENSITIVITY_TEST_PERCENT / 100;
      const pw = (pr: number, c: number, v: number, f: number) =>
        pct ? round2(pr * v - c * v - (pr * v * pct) / 100 - f - dep) : round2(pr * v - c * v - f - dep);
      const item = (key: SensitivityKey, variable: string, up: number, down: number): SensitivityItem => ({
        key, variable, profitChangeIfImproved10Percent: round2(up - base), profitChangeIfWorsened10Percent: round2(down - base), impactMagnitude: 0,
      });
      const items: SensitivityItem[] = [
        item('price', `ราคาขายต่อ${unitLabel}`, pw(price * (1 + p), cost, vol, fx), pw(price * (1 - p), cost, vol, fx)),
        item('unitCost', `ต้นทุนต่อ${unitLabel}`, pw(price, cost * (1 - p), vol, fx), pw(price, cost * (1 + p), vol, fx)),
        item('volume', 'จำนวนที่ขายได้ต่อเดือน', pw(price, cost, vol * (1 + p), fx), pw(price, cost, vol * (1 - p), fx)),
        item('fixedCosts', 'ค่าใช้จ่ายคงที่ต่อเดือน', pw(price, cost, vol, fx * (1 - p)), pw(price, cost, vol, fx * (1 + p))),
      ];
      items.forEach((it) => { it.impactMagnitude = round2(Math.abs(it.profitChangeIfImproved10Percent)); });
      items.sort((a, b) => b.impactMagnitude - a.impactMagnitude);
      sensitivity = items;
    }

    const p = SENSITIVITY_TEST_PERCENT / 100;
    actionThresholds = {
      pricePerUnitAlert: round2(price * (1 - p)),
      costPerUnitAlert: round2(cost * (1 + p)),
      avgMonthlySalesVolumeAlert: round2(vol * (1 - p)),
      fixedCostsMonthlyAlert: round2(fx * (1 + p)),
      alertPercent: SENSITIVITY_TEST_PERCENT,
    };
  }

  // จุดคุ้มทุนที่ปัดขึ้นเป็นจำนวนเต็มต้องไม่ขัดกับสถานะกำไร: ถ้ายอดขาย (ตอนนี้ หรือในฉากสถานการณ์) อยู่ระหว่างจุดคุ้มทุนจริงกับค่าที่ปัดขึ้น
  // ทั้งที่กำไร/กระแสเงินสด ≥ 0 → ใช้จุดคุ้มทุนแบบไม่ปัดเป็นจำนวนเต็ม (ปัดขึ้นที่ทศนิยม 2 ตำแหน่ง และไม่เกินยอดขายที่มีกำไร) ทั้งตัวหลักและทุกฉาก (ตัวเลขรายวันคิดใหม่จากค่าใหม่)
  if (u && u.price !== null && u.contributionMarginPerUnit !== null && u.contributionMarginPerUnit > 0 && fixed !== null) {
    const cmU = u.contributionMarginPerUnit;
    const ceil2 = (x: number) => Math.ceil(Math.round(x * 1e6) / 1e4) / 100;
    const pts: { v: number; net: number; cash: number }[] = [];
    if (u.units !== null && netProfitMonthly !== null) pts.push({ v: round2(u.units), net: netProfitMonthly, cash: round2(netProfitMonthly + dep) });
    if (scenarios && u.units !== null) {
      scenarios.forEach((s) => { if (s.netProfitMonthly !== null) pts.push({ v: round2((u.units as number) * (1 + s.volumeDeltaPercent / 100)), net: s.netProfitMonthly, cash: s.netCashFlowMonthly }); });
    }
    if (beUnits !== null && pts.some((p) => p.net >= 0 && p.v < (beUnits as number))) {
      beUnits = Math.min(ceil2((fixed + dep) / cmU), ...pts.filter((p) => p.net >= 0).map((p) => p.v));
      beRevenue = round2(beUnits * u.price);
      if (scenarios) scenarios = scenarios.map((s) => ({ ...s, breakevenUnitsPerMonth: s.breakevenUnitsPerMonth !== null ? beUnits : null }));
      // ตัวเลขรายวันคิดใหม่จากจุดคุ้มทุนใหม่ ด้วยกฎเดิม (ปัดขึ้นต่อวัน แต่ถ้ากำไร ≥ 0 แล้วดูเหมือนยังขาด ให้ใช้ค่าไม่ปัด)
      if (perDay.unitsSold !== null) {
        perDay.breakevenUnits = Math.ceil(beUnits / days);
        perDay.unitsGapToBreakeven = round2(perDay.breakevenUnits - perDay.unitsSold);
        if (perDay.unitsGapToBreakeven > 0 && isCurrentlyProfitable === true) {
          perDay.breakevenUnits = round2(beUnits / days);
          perDay.unitsGapToBreakeven = round2(perDay.breakevenUnits - perDay.unitsSold);
        }
      }
    }
    if (cbeUnits !== null && pts.some((p) => p.cash >= 0 && p.v < (cbeUnits as number))) {
      cbeUnits = Math.min(ceil2(fixed / cmU), ...pts.filter((p) => p.cash >= 0).map((p) => p.v));
      cbeRevenue = round2(cbeUnits * u.price);
    }
  }

  const growthOf = (L: Ledger | null) => (L ? L.stream.growthRatePercentMonthly ?? null : null);
  const g0 = growthOf(mainLedger);
  const streamsOut = ledgers.map((L) => ({
    id: L.stream.id, name: L.stream.name, type: L.stream.type, unitLabel: L.stream.unitLabel,
    revenueMonthly: L.typical.revenue !== null ? round2(L.typical.revenue) : null,
    variableCostMonthly: L.typical.varCost !== null ? round2(L.typical.varCost) : null,
    contributionMonthly: L.typical.revenue !== null && L.typical.varCost !== null ? round2(L.typical.revenue - L.typical.varCost) : null,
    shareOfRevenuePercent: L.typical.revenue !== null && revenueMonthly !== null && revenueMonthly > 0 ? round2((L.typical.revenue / revenueMonthly) * 100) : null,
    capacity: L.capacity, capacityKind: L.capacityKind,
  }));

  return {
    daysOpenPerMonth: days,
    daysOpenProvided: daysProvided,
    growthRatePercentMonthly: g0 ?? 0,
    growthProvided: g0 !== null,
    isSingleVolumeStream,
    streams: streamsOut,
    unit: u,
    revenueMonthly,
    variableCostMonthly: varMonthly,
    grossProfitMonthly,
    grossMarginPercentActual,
    fixedCostsMonthly: fixed,
    depreciation: { monthlyTotal: dep, hasAssetData, assets: assetSummary },
    totalExpensesMonthly,
    netProfitMonthly,
    netMarginPercent,
    breakeven: {
      unitsPerMonth: beUnits,
      revenueBaht: beRevenue,
      cashUnitsPerMonth: cbeUnits,
      cashRevenueBaht: cbeRevenue,
      isCurrentlyProfitable,
      firstMonthWithPositiveCashFlow,
      monthCumulativeTurnsPositive,
      contributionNotPositive,
      lowVolume,
    },
    perDay,
    capacity: { maxUnitsPerMonth, bindingConstraint, currentUtilizationPercent, maxRevenueMonthly, monthCapacityReached },
    projection,
    projectionIfCapacityUnchanged,
    projection3YearsRough,
    cashOnHand,
    runway: {
      monthsRemaining,
      monthlyCashBurn: monthlyCashBurn !== null && monthlyCashBurn > 0 ? monthlyCashBurn : null,
      status: runwayStatus,
      firstNegativeMonth,
      recoveryMonth,
      lowestCashBalance,
      lowestCashMonth,
    },
    customerEconomics: {
      costToAcquireOneCustomer, revenuePerCustomerLifetime, profitPerCustomerLifetime, profitToAcquisitionCostRatio,
      status: customerStatus,
      missingData: customerMissing,
      lifetimeCountedAsOnePurchase: revenuePerCustomerLifetime !== null && u !== null && u.lifetimeFloored,
    },
    marketSize,
    marketSizeMissing,
    scenarios,
    sensitivity,
    actionThresholds,
    hasGrowth: ledgers.some((L) => (L.stream.growthRatePercentMonthly ?? 0) !== 0),
  };
}

// ============================================================
// 6. ทางเข้าเดิมของเว็บ — ข้อมูลฟอร์มเดิม → v4 → ผลรูปแบบเดิม
// ============================================================

export function legacyToV4(x: FinancialRawInput): BusinessInputV4 {
  return {
    streams: [{
      id: 'main',
      name: 'รายได้หลัก',
      type: 'unit',
      unitLabel: x.unitLabel && x.unitLabel.trim() !== '' ? x.unitLabel.trim() : 'หน่วย',
      price: x.pricePerUnit,
      costPerUnit: x.costPerUnit,
      grossMarginPercent: x.grossMarginPercent,
      unitsPerMonth: x.avgMonthlySalesVolume,
      growthRatePercentMonthly: x.growthRatePercentMonthly,
      productionType: x.productionType ?? null,
      capacity: {
        producedPerDay: x.maxUnitsProducedPerDay,
        sourcedPerMonth: x.maxUnitsSourcedPerMonth,
        fulfilledPerDay: x.maxUnitsFulfilledPerDay,
      },
      purchasesPerCustomerPerMonth: x.purchasesPerCustomerPerMonth,
      customerLifespanMonths: x.customerLifespanMonths,
      avgUnitsPerPurchase: x.avgUnitsPerPurchase,
    }],
    fixedCostsMonthly: x.fixedCostsMonthly,
    assets: x.assets,
    cashOnHand: x.cashOnHand,
    daysOpenPerMonth: x.daysOpenPerMonth,
    marketingSpendMonthly: x.marketingSpendMonthly,
    newCustomersPerMonth: x.newCustomersPerMonth,
    serviceAreaScope: x.serviceAreaScope,
    populationDensityLevel: x.populationDensityLevel,
  };
}

export function calculateFinancials(input: FinancialRawInput): FinancialCalculationResult {
  return toLegacyResult(input, calculateV4(legacyToV4(input)));
}

/** แปลงผล v4 เป็นรูปแบบเดิม — แปลงชื่อ/รูปแบบ และเขียนข้อความภาษาไทย (blockedSections / warnings / assumptionsSummary) */
export function toLegacyResult(input: FinancialRawInput, r: V4Result): FinancialCalculationResult {
  const warnings: string[] = [];
  const blockedSections: BlockedSection[] = [];
  const u = r.unit;
  const unit = input.unitLabel && input.unitLabel.trim() !== '' ? input.unitLabel.trim() : 'หน่วย';

  const hasPrice = input.pricePerUnit !== null && input.pricePerUnit > 0;
  const hasCostBasis =
    (input.costPerUnit !== null && input.costPerUnit >= 0) ||
    (input.grossMarginPercent !== null && input.grossMarginPercent !== undefined);
  const hasVolume = input.avgMonthlySalesVolume !== null && input.avgMonthlySalesVolume > 0;
  const hasFixedCosts = input.fixedCostsMonthly !== null && input.fixedCostsMonthly >= 0;
  const hasCoreData = hasPrice && hasCostBasis && hasVolume && hasFixedCosts;

  if (!hasPrice) {
    blockedSections.push({
      section: 'รายได้ / กำไรขาดทุน / จุดคุ้มทุน / กระแสเงินสด',
      missingData: ['ราคาขายต่อหน่วย'],
      howToFind: `ดูจากป้ายราคาหรือใบเสร็จล่าสุด ถ้าขายหลายราคาให้ใช้ราคาที่ขายดีที่สุด หรือเอายอดขายรวมหารด้วยจำนวน${unit}ที่ขายได้`,
    });
  }
  if (!hasCostBasis) {
    blockedSections.push({
      section: 'กำไรขาดทุน / จุดคุ้มทุน / กระแสเงินสด',
      missingData: ['ต้นทุนต่อหน่วย'],
      howToFind: `ลองรวมดูว่าสินค้าหรือบริการ 1 ${unit} ใช้ต้นทุนอะไรบ้าง เช่น วัตถุดิบ/แรงงาน + บรรจุภัณฑ์ + ค่าขนส่งเฉลี่ยต่อ${unit} (ยังไม่ต้องรวมค่าเช่าหรือเงินเดือน)`,
    });
  }
  if (!hasVolume) {
    blockedSections.push({
      section: 'รายได้ / กำไรขาดทุน / กระแสเงินสด',
      missingData: ['ยอดขายเฉลี่ยต่อเดือน'],
      howToFind: `นับว่าขายหรือให้บริการได้ประมาณกี่${unit}ต่อวัน แล้วคูณด้วยจำนวนวันที่เปิดขายต่อเดือน`,
    });
  }
  if (!hasFixedCosts) {
    blockedSections.push({
      section: 'กำไรขาดทุน / จุดคุ้มทุน / กระแสเงินสด',
      missingData: ['ค่าใช้จ่ายคงที่ต่อเดือน'],
      howToFind:
        'ไล่ทีละรายการที่ต้องจ่ายทุกเดือนไม่ว่าจะขายได้หรือไม่ เช่น ค่าเช่า ค่าไฟ ค่าน้ำ เงินเดือน ค่าอินเทอร์เน็ต แล้วรวมกัน',
    });
  }

  const price = u ? u.price : null;
  const cost = u ? u.unitCost : null;
  const vol = u ? u.units : null;
  const fixed = r.fixedCostsMonthly;
  const dep = r.depreciation.monthlyTotal;

  const growthProvenance: DataProvenance = r.growthProvided
    ? { source: 'user' }
    : { source: 'structural_default', note: 'ไม่ได้ระบุอัตราการเติบโตไว้ จึงคำนวณแบบยอดขายคงที่ ไม่ได้หมายความว่าธุรกิจจะไม่โต' };
  const daysOpenProvenance: DataProvenance = r.daysOpenProvided
    ? { source: 'user' }
    : {
        source: 'structural_default',
        note: `ไม่ได้ระบุจำนวนวันเปิดขายไว้ จึงใช้ ${DEFAULT_DAYS_OPEN_PER_MONTH} วันเพื่อแปลงตัวเลขเป็นรายวันเท่านั้น ไม่กระทบยอดรวมรายเดือน`,
      };

  if (r.breakeven.contributionNotPositive) {
    warnings.push(
      `ขายได้เท่าไหร่ก็ไม่มีทางคุ้มทุน เพราะราคาขายต่อ${unit}ยังไม่มากกว่าต้นทุนต่อ${unit} ต้องขึ้นราคาหรือลดต้นทุนก่อน`
    );
  }

  // เงินสด — สอดคล้องกับสถานะเงินสำรองที่คิดจากประมาณการ 12 เดือน
  const rw = r.runway;
  if (rw.status === 'burn_no_cash') {
    blockedSections.push({
      section: 'เงินจะพอใช้อีกกี่เดือน',
      missingData: ['เงินสดที่มีอยู่ตอนนี้'],
      howToFind:
        'รวมเงินในบัญชีธนาคารกับเงินสดในร้านที่ใช้หมุนธุรกิจได้จริง (ไม่รวมเงินส่วนตัวที่ไม่ตั้งใจเอามาใช้กับธุรกิจ)',
    });
  }
  if (rw.monthlyCashBurn !== null && rw.monthlyCashBurn > 0) {
    if (rw.recoveryMonth === null) {
      warnings.push('ตอนนี้เงินที่เข้าน้อยกว่าเงินที่ออกทุกเดือน ถ้ายังเป็นแบบนี้ต่อไปเงินสำรองจะลดลงเรื่อยๆ');
    } else if (rw.status === 'runs_out' && rw.monthsRemaining !== null && rw.monthsRemaining < rw.recoveryMonth) {
      warnings.push(
        `ตอนนี้เงินที่เข้ายังน้อยกว่าเงินที่ออก ถ้ายอดขายเป็นไปตามอัตราที่ระบุ กระแสเงินสดจะกลับเป็นบวกในเดือนที่ ${rw.recoveryMonth} แต่เงินสดที่มีจะหมดก่อนถึงตอนนั้น`
      );
    } else if (rw.status === 'recovers') {
      warnings.push(
        `ตอนนี้เงินที่เข้ายังน้อยกว่าเงินที่ออก แต่ถ้ายอดขายเป็นไปตามอัตราที่ระบุ กระแสเงินสดจะกลับเป็นบวกในเดือนที่ ${rw.recoveryMonth} และเงินสดที่มีพอใช้ถึงตอนนั้น`
      );
    } else {
      warnings.push(
        `ตอนนี้เงินที่เข้ายังน้อยกว่าเงินที่ออก ถ้ายอดขายเป็นไปตามอัตราที่ระบุ กระแสเงินสดจะกลับเป็นบวกในเดือนที่ ${rw.recoveryMonth}`
      );
    }
  } else if (rw.firstNegativeMonth !== null) {
    warnings.push(
      `ถ้ายอดขายเป็นไปตามอัตราที่ระบุ กระแสเงินสดจะเริ่มติดลบตั้งแต่เดือนที่ ${rw.firstNegativeMonth} ถ้ายังเป็นแบบนี้ต่อไปเงินสำรองจะลดลงเรื่อยๆ`
    );
  }

  const ce = r.customerEconomics;
  if (ce.profitToAcquisitionCostRatio !== null && ce.profitToAcquisitionCostRatio < 1) {
    warnings.push(
      'เงินที่จ่ายไปเพื่อให้ได้ลูกค้า 1 คน มากกว่ากำไรที่ได้จากลูกค้าคนนั้นตลอดที่อยู่กับเรา — ยิ่งหาลูกค้าใหม่มากยิ่งขาดทุนมาก'
    );
  }

  if (r.marketSizeMissing) {
    const m = r.marketSizeMissing;
    const missingData: string[] = [];
    const howToFindParts: string[] = [];
    if (m.density) {
      missingData.push('ความหนาแน่นของคนในพื้นที่ให้บริการ');
      howToFindParts.push(
        'นึกถึงพื้นที่ที่ลูกค้าส่วนใหญ่ของคุณอยู่ แล้วเลือกช่วงจำนวนคนในพื้นที่นั้นที่ใกล้เคียงที่สุด ไม่ต้องแม่นยำ เป็นค่าประมาณคร่าวๆ ได้'
      );
    }
    if (m.purchaseFrequency) {
      missingData.push('จำนวนครั้งที่ลูกค้าประจำกลับมาซื้อซ้ำต่อเดือน');
      howToFindParts.push(`นึกถึงลูกค้าประจำที่จำได้ 3-5 คน ว่าเดือนหนึ่งกลับมาซื้อหรือใช้บริการกี่ครั้ง แล้วหาค่าเฉลี่ย`);
    }
    if (m.unitsPerPurchase) {
      missingData.push(`จำนวน${unit}ที่ลูกค้าซื้อต่อครั้ง`);
      howToFindParts.push(`ดูจากใบเสร็จล่าสุดว่าลูกค้าส่วนใหญ่ซื้อครั้งละกี่${unit}`);
    }
    if (m.price) missingData.push('ราคาขายต่อหน่วย');
    if (m.volume) missingData.push('ยอดขายเฉลี่ยต่อเดือน');
    if (missingData.length > 0) {
      blockedSections.push({
        section: 'ขนาดตลาดคร่าวๆ',
        missingData,
        howToFind:
          howToFindParts.length > 0
            ? howToFindParts.join(' — ')
            : 'กรอกราคาขายต่อหน่วยและยอดขายเฉลี่ยต่อเดือนให้ครบก่อน (ดูวิธีหาได้ในหัวข้อการเงิน)',
      });
    }
  }

  const net = r.netProfitMonthly;
  if (net !== null && net < 0) {
    warnings.push('จากข้อมูลปัจจุบัน ธุรกิจยังขาดทุนอยู่ทุกเดือน ต้องปรับราคา ต้นทุน หรือจำนวนที่ขายได้');
  }
  if (r.depreciation.hasAssetData && net !== null && net >= 0 && dep > 0) {
    warnings.push(
      `ควรกันเงินไว้เดือนละ ${dep.toLocaleString('th-TH')} บาท สำหรับซื้ออุปกรณ์ใหม่ตอนของเก่าหมดอายุ เงินก้อนนี้ถูกหักออกจากกำไรแล้ว แต่ยังไม่ได้จ่ายออกจริง`
    );
  }
  if (r.growthRatePercentMonthly !== 0 && fixed !== null && r.projection.length === 12) {
    const firstRev = r.projection[0].revenue;
    const lastRev = r.projection[11].revenue;
    if (firstRev > 0 && lastRev / firstRev >= 1.5) {
      warnings.push(
        'การคำนวณนี้ตั้งอยู่บนสมมติฐานว่าค่าใช้จ่ายคงที่ไม่เปลี่ยนเลยตลอด 12 เดือน ทั้งที่ยอดขายโตขึ้นมาก ในความเป็นจริงอาจต้องจ้างคนเพิ่มหรือขยายพื้นที่ ซึ่งจะทำให้ค่าใช้จ่ายคงที่สูงขึ้น'
      );
    }
  }
  const cap = r.capacity;
  if (cap.monthCapacityReached !== null && cap.bindingConstraint !== null) {
    warnings.push(
      `ถ้ายอดขายโตตามอัตราที่ระบุ จะขายชนเพดานเรื่อง${BINDING_CONSTRAINT_LABEL[cap.bindingConstraint]}ในเดือนที่ ${cap.monthCapacityReached} — ต้องวางแผนแก้จุดนี้ก่อนถึงเวลานั้น`
    );
  }
  if (cap.currentUtilizationPercent !== null && cap.currentUtilizationPercent > 90 && cap.bindingConstraint !== null) {
    warnings.push(
      `ตอนนี้ใช้กำลังที่รับได้เรื่อง${BINDING_CONSTRAINT_LABEL[cap.bindingConstraint]}ไปแล้ว ${cap.currentUtilizationPercent}% เหลือที่ให้โตอีกไม่มาก`
    );
  }

  const assumptionsSummary: FinancialCalculationResult['assumptionsSummary'] = [];
  if (price !== null) {
    assumptionsSummary.push({ label: `ราคาขายต่อ${unit}`, value: `${price.toLocaleString('th-TH')} บาท`, provenance: 'user' });
  }
  if (cost !== null && u && u.unitCostSource !== null) {
    assumptionsSummary.push({ label: `ต้นทุนต่อ${unit}`, value: `${round2(cost).toLocaleString('th-TH')} บาท`, provenance: u.unitCostSource });
  }
  if (vol !== null) {
    assumptionsSummary.push({ label: 'ขายได้ต่อเดือน', value: `${vol.toLocaleString('th-TH')} ${unit}`, provenance: 'user' });
  }
  if (fixed !== null) {
    assumptionsSummary.push({ label: 'ค่าใช้จ่ายคงที่ต่อเดือน', value: `${fixed.toLocaleString('th-TH')} บาท`, provenance: 'user' });
  }
  assumptionsSummary.push({
    label: 'การเติบโตของยอดขายต่อเดือน',
    value: `${r.growthRatePercentMonthly}%`,
    provenance: growthProvenance.source,
    note: growthProvenance.note,
  });
  assumptionsSummary.push({
    label: 'จำนวนวันเปิดขายต่อเดือน',
    value: `${r.daysOpenPerMonth} วัน`,
    provenance: daysOpenProvenance.source,
    note: daysOpenProvenance.note,
  });
  assumptionsSummary.push({
    label: 'เงินที่ควรกันไว้ซื้ออุปกรณ์ใหม่',
    value: r.depreciation.hasAssetData ? `${dep.toLocaleString('th-TH')} บาท/เดือน` : 'ไม่ได้คิด (ไม่ได้กรอกข้อมูลอุปกรณ์)',
    provenance: r.depreciation.hasAssetData ? 'derived' : 'structural_default',
    note: r.depreciation.hasAssetData
      ? undefined
      : 'ไม่ได้กรอกข้อมูลอุปกรณ์ไว้ จึงไม่ได้คิดเงินส่วนนี้ ไม่ได้หมายความว่าธุรกิจไม่มีอุปกรณ์ที่ต้องเปลี่ยน',
  });
  assumptionsSummary.push({
    label: 'เพดานของธุรกิจ',
    value:
      cap.maxUnitsPerMonth !== null && cap.bindingConstraint !== null
        ? `${cap.maxUnitsPerMonth.toLocaleString('th-TH')} ${unit}/เดือน (คอขวดจริงคือ${BINDING_CONSTRAINT_LABEL[cap.bindingConstraint]})`
        : (input.productionType ?? null) === null
          ? 'ไม่ได้วิเคราะห์ (ไม่ได้ระบุประเภทธุรกิจหรือข้อมูลกำลังรับ)'
          : 'ไม่ได้วิเคราะห์ (ไม่ได้กรอกจำนวนสูงสุดที่ทำได้หรือส่งมอบได้)',
    provenance: cap.maxUnitsPerMonth !== null ? 'user' : 'structural_default',
    note:
      cap.maxUnitsPerMonth !== null
        ? undefined
        : (input.productionType ?? null) === null
          ? 'ไม่ได้ระบุไว้ว่าธุรกิจทำเองหรือซื้อมาขายต่อ จึงไม่วิเคราะห์เรื่องเพดาน ไม่ได้หมายความว่าธุรกิจไม่มีเพดาน'
          : input.productionType === 'makes_own'
            ? `ระบุไว้ว่าธุรกิจทำเอง แต่ไม่ได้กรอกว่าผลิตได้กี่${unit}ต่อวันหรือเตรียมส่งมอบได้กี่${unit}ต่อวัน จึงไม่วิเคราะห์เรื่องเพดาน ไม่ได้หมายความว่าธุรกิจไม่มีเพดาน`
            : `ระบุไว้ว่าธุรกิจซื้อมาขายต่อ แต่ไม่ได้กรอกว่านำเข้าสต๊อกได้กี่${unit}ต่อเดือนหรือเตรียมส่งมอบได้กี่${unit}ต่อวัน จึงไม่วิเคราะห์เรื่องเพดาน ไม่ได้หมายความว่าธุรกิจไม่มีเพดาน`,
  });
  assumptionsSummary.push({
    label: 'ภาษี',
    value: 'ไม่ได้คิดรวมในตัวเลขทั้งหมด',
    provenance: 'structural_default',
    note: 'ตัวเลขกำไรทั้งหมดเป็นกำไรก่อนหักภาษี ควรปรึกษานักบัญชีเรื่องภาษีแยกต่างหาก',
  });

  const projection12Months: MonthlyProjection[] = r.projection.map((m) => ({
    month: m.month,
    revenue: m.revenue,
    cogs: m.variableCost,
    fixedCosts: m.fixedCosts,
    depreciation: m.depreciation,
    netProfitAccounting: m.netProfitAccounting,
    netCashFlow: m.netCashFlow,
    cumulativeCashFlow: m.cumulativeCashFlow,
    unitsRequired: m.unitsMain,
    exceedsCapacity: m.exceedsCapacity,
  }));

  return {
    hasCoreData,
    blockedSections,
    inputs: {
      pricePerUnit: price !== null ? { value: round2(price), provenance: { source: 'user' } } : null,
      costPerUnit: cost !== null && u && u.unitCostSource !== null ? { value: round2(cost), provenance: { source: u.unitCostSource } } : null,
      grossMarginPercent:
        u && u.grossMarginInput !== null && u.grossMarginInputSource !== null
          ? { value: round2(u.grossMarginInput), provenance: { source: u.grossMarginInputSource } }
          : null,
      avgMonthlySalesVolume: vol !== null ? { value: vol, provenance: { source: 'user' } } : null,
      fixedCostsMonthly: fixed !== null ? { value: fixed, provenance: { source: 'user' } } : null,
      growthRatePercentMonthly: { value: r.growthRatePercentMonthly, provenance: growthProvenance },
      daysOpenPerMonth: { value: r.daysOpenPerMonth, provenance: daysOpenProvenance },
      cashOnHand: input.cashOnHand !== null ? { value: round2(input.cashOnHand), provenance: { source: 'user' } } : null,
    },
    revenueMonthly: r.revenueMonthly,
    cogsMonthly: r.variableCostMonthly,
    totalExpensesMonthly: r.totalExpensesMonthly,
    grossProfitMonthly: r.grossProfitMonthly,
    grossMarginPercentActual: r.grossMarginPercentActual,
    netProfitMonthly: r.netProfitMonthly,
    netMarginPercent: r.netMarginPercent,
    contributionMarginPerUnit: u ? u.contributionMarginPerUnit : null,
    perDay: { ...r.perDay },
    breakeven: {
      unitsPerMonth: r.breakeven.unitsPerMonth,
      revenueBaht: r.breakeven.revenueBaht,
      isCurrentlyProfitable: r.breakeven.isCurrentlyProfitable,
      cashUnitsPerMonth: r.breakeven.cashUnitsPerMonth,
      cashRevenueBaht: r.breakeven.cashRevenueBaht,
      firstMonthWithPositiveCashFlow: r.breakeven.firstMonthWithPositiveCashFlow,
      monthCumulativeTurnsPositive: r.breakeven.monthCumulativeTurnsPositive,
    },
    depreciation: { monthlyTotal: dep, hasAssetData: r.depreciation.hasAssetData, assets: r.depreciation.assets },
    capacity: {
      productionType: input.productionType ?? null,
      maxUnitsPerMonth: cap.maxUnitsPerMonth,
      currentUtilizationPercent: cap.currentUtilizationPercent,
      monthCapacityReached: cap.monthCapacityReached,
      maxRevenueMonthly: cap.maxRevenueMonthly,
      bindingConstraint: cap.bindingConstraint,
    },
    customerEconomics: { ...ce },
    marketSize: r.marketSize,
    runway: { ...r.runway },
    projection12Months,
    projection3YearsRough: r.projection3YearsRough,
    projectionIfCapacityUnchanged: r.projectionIfCapacityUnchanged,
    hasGrowth: r.hasGrowth,
    scenarios: r.scenarios,
    scenarioVariancePercent: SCENARIO_VARIANCE_PERCENT,
    sensitivity: r.sensitivity,
    actionThresholds: r.actionThresholds,
    assumptionsSummary,
    warnings,
  };
}

// ============================================================
// 7. HELPER
// ============================================================

function roundPerDayApprox(n: number): number {
  if (n >= 10) return Math.round(n / 5) * 5;
  if (n >= 1) return Math.round(n);
  if (n > 0) return Math.max(0.1, Math.round(n * 10) / 10);
  return 0;
}

/** ช่วงความหนาแน่น "น้อยมาก" ขอบล่างเป็น 0 คน — ไม่มีความหมายที่จะเทียบกับขอบล่าง */
const REVENUE_POSITION_LABEL_NO_LOWER = 'อยู่ต่ำกว่าขอบบนของช่วงขนาดตลาด';
const REVENUE_POSITION_LABEL: Record<RevenuePositionCase, string> = {
  below_low: 'ต่ำกว่าขอบล่างของช่วงขนาดตลาด',
  within_range: 'อยู่ระหว่างขอบล่างกับขอบบนของช่วงขนาดตลาด — ถ้าพื้นที่มีคนน้อยตามขอบล่าง ยอดขายตอนนี้เท่ากับหรือมากกว่าตลาดทั้งพื้นที่แล้ว',
  at_or_above_high: 'เท่ากับหรือเกินขอบบนของช่วงขนาดตลาดแล้ว',
};
