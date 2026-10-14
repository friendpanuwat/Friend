import { useMemo } from "react";
import ToolLayout from "../components/ToolLayout";
import { Chips, Disclosure, NumberField, Panel, Segmented, SwitchRow } from "../components/fields";
import { CopyButton, Formulas, InsightItem, Insights, NeedInput, ResultHero } from "../components/results";
import { vatCalc, type VatMode } from "../lib/calc/vat";
import { fmtBahtExact, fmtNumMax as fmtNum, num } from "../lib/format";
import { useLabState } from "../lib/storage";
import { useRecent } from "../lib/hooks";

type WhtKey = "none" | "transport" | "ad" | "service" | "rent" | "custom";
type State = {
  preset: string | null;
  mode: VatMode;
  amount: number | null;
  vat: boolean;
  vatRate: number | null;
  wht: WhtKey;
  whtCustom: number | null;
};

const WHT: Record<Exclude<WhtKey, "custom">, { label: string; rate: number; what: string }> = {
  none: { label: "ไม่หัก", rate: 0, what: "" },
  transport: { label: "ขนส่ง 1%", rate: 1, what: "ค่าขนส่ง" },
  ad: { label: "โฆษณา 2%", rate: 2, what: "ค่าโฆษณา" },
  service: { label: "บริการ / จ้างทำของ 3%", rate: 3, what: "ค่าบริการ" },
  rent: { label: "ค่าเช่า 5%", rate: 5, what: "ค่าเช่า" },
};

const EMPTY: State = { preset: null, mode: "beforeVat", amount: null, vat: true, vatRate: 7, wht: "service", whtCustom: null };
const PRESETS: Record<string, { label: string; values: Partial<State> }> = {
  freelance: { label: "ฟรีแลนซ์ออกบิล", values: { mode: "beforeVat", amount: 25000, vat: false, wht: "service" } },
  agency: { label: "บริษัทรับทำโฆษณา", values: { mode: "beforeVat", amount: 50000, vat: true, wht: "ad" } },
  net: { label: "อยากได้รับ 10,000 สุทธิ", values: { mode: "netTarget", amount: 10000, vat: true, wht: "service" } },
};
const withPreset = (id: string): State => ({ ...EMPTY, ...PRESETS[id].values, preset: id });

const Row = ({ label, value, strong, minus, note }: { label: string; value: number; strong?: boolean; minus?: boolean; note?: string }) => (
  <div className={`flex items-baseline gap-2 py-2 ${strong ? "text-[15px] font-semibold" : "text-[13.5px]"}`}>
    <span className={strong ? "" : "text-lab-muted"}>
      {label}
      {note && <span className="ml-1 text-[11.5px] text-lab-subtle">{note}</span>}
    </span>
    <span aria-hidden className="mb-1 min-w-4 flex-1 border-b border-dotted border-lab-border-strong" />
    <span className="font-lab-mono lab-tnum whitespace-nowrap">
      {minus ? "−" : ""}
      {fmtBahtExact(value).replace("฿", "")}
    </span>
  </div>
);

const Vat = () => {
  const [s, setS, patchRaw] = useLabState<State>("vat", withPreset("freelance"));
  const patch = (p: Partial<State>) => patchRaw({ ...p, preset: null });
  const whtRate = s.wht === "custom" ? num(s.whtCustom) : WHT[s.wht].rate;
  const vatRate = num(s.vatRate, 7);
  const input = { amount: num(s.amount), mode: s.mode, vat: s.vat, vatRate, whtRate };
  const r = useMemo(() => vatCalc(input), [JSON.stringify(input)]);
  const valid = num(s.amount) > 0;

  useRecent("vat", valid ? (s.mode === "netTarget" ? `ออกบิล ${fmtBahtExact(r.base)}` : `รับสุทธิ ${fmtBahtExact(r.net)}`) : null);

  const insights: InsightItem[] = [];
  if (valid) {
    if (whtRate > 0)
      insights.push({
        tone: "tip",
        title: `ภาษีหัก ณ ที่จ่าย ${fmtBahtExact(r.wht)} ไม่ได้หายไป`,
        body: "ผู้จ่ายต้องออกหนังสือรับรองการหักภาษี ณ ที่จ่าย (50 ทวิ) ให้คุณ เก็บไว้ใช้เป็นเครดิตตอนยื่นภาษีเงินได้ประจำปี",
      });
    if (s.vat && whtRate > 0)
      insights.push({ tone: "tip", title: "หัก ณ ที่จ่ายคิดจากยอดก่อน VAT", body: `${fmtNum(whtRate, 1)}% × ${fmtBahtExact(r.base)} = ${fmtBahtExact(r.wht)} ไม่ใช่คิดจากยอดรวม VAT ${fmtBahtExact(r.total)}` });
    if (!s.vat)
      insights.push({ tone: "tip", title: "ยังไม่ได้จด VAT?", body: "ตามเกณฑ์ปัจจุบัน ผู้ประกอบการที่มีรายรับเกิน 1.8 ล้านบาทต่อปีต้องจดทะเบียน VAT ตรวจสอบกับนักบัญชีหรือกรมสรรพากรอีกครั้ง" });
  }

  const label = s.mode === "netTarget" ? "ต้องออกใบแจ้งหนี้ (ก่อน VAT)" : "เงินเข้าบัญชีจริง";
  const heroValue = s.mode === "netTarget" ? r.base : r.net;

  const summary = () =>
    [
      "VAT & หัก ณ ที่จ่าย · Jarua Business Lab",
      `มูลค่าก่อน VAT ${fmtBahtExact(r.base)}`,
      s.vat ? `VAT ${fmtNum(vatRate, 1)}% ${fmtBahtExact(r.vatAmount)}` : "ไม่มี VAT",
      `ยอดในใบแจ้งหนี้ ${fmtBahtExact(r.total)}`,
      whtRate > 0 ? `หัก ณ ที่จ่าย ${fmtNum(whtRate, 1)}% (จากยอดก่อน VAT) ${fmtBahtExact(r.wht)}` : "",
      `ยอดโอนสุทธิ ${fmtBahtExact(r.net)}`,
    ]
      .filter(Boolean)
      .join("\n");

  const inputs = (
    <>
      <Panel title="ยอดเงิน">
        <div className="space-y-4">
          <Segmented<VatMode>
            label="ยอดที่จะกรอก"
            value={s.mode}
            onChange={(v) => patch({ mode: v })}
            options={[
              { value: "beforeVat", label: "ก่อน VAT" },
              { value: "includesVat", label: "รวม VAT แล้ว" },
              { value: "netTarget", label: "ยอดที่อยากได้" },
            ]}
          />
          <NumberField
            id="vt-amt"
            label={s.mode === "beforeVat" ? "มูลค่าสินค้า/บริการ (ยังไม่รวม VAT)" : s.mode === "includesVat" ? "ยอดรวม VAT แล้ว" : "เงินที่อยากได้รับเข้าบัญชี"}
            prefix="฿"
            value={s.amount}
            onChange={(v) => patch({ amount: v })}
          />
        </div>
      </Panel>
      <Panel title="ภาษี">
        <div className="space-y-5">
          <SwitchRow id="vt-vat" label="ผู้รับเงินจดทะเบียน VAT" help={`บวก VAT ${fmtNum(vatRate, 1)}% ในใบแจ้งหนี้`} checked={s.vat} onChange={(v) => patch({ vat: v })} />
          <div>
            <p className="mb-1 text-[14px] font-semibold">หัก ณ ที่จ่าย</p>
            <p className="mb-2.5 text-[12.5px] leading-relaxed text-lab-muted">อัตราที่ใช้ทั่วไปเมื่อผู้จ่ายเป็นนิติบุคคล ตรวจสอบประเภทเงินได้กับนักบัญชีอีกครั้ง</p>
            <Chips<WhtKey>
              label="อัตราหัก ณ ที่จ่าย"
              value={s.wht}
              onChange={(v) => patch({ wht: v })}
              options={[...(Object.keys(WHT) as Exclude<WhtKey, "custom">[]).map((k) => ({ value: k, label: WHT[k].label })), { value: "custom", label: "กำหนดเอง" }]}
            />
            {s.wht === "custom" && (
              <div className="mt-3">
                <NumberField id="vt-whtc" label="อัตราหัก ณ ที่จ่าย" suffix="%" max={50} value={s.whtCustom} onChange={(v) => patch({ whtCustom: v })} />
              </div>
            )}
          </div>
          <Disclosure summary="ปรับอัตรา VAT">
            <NumberField id="vt-rate" label="อัตรา VAT" help="อัตราที่ใช้อยู่ 7% เปลี่ยนได้ถ้ามีประกาศใหม่" suffix="%" max={30} value={s.vatRate} onChange={(v) => patch({ vatRate: v })} />
          </Disclosure>
        </div>
      </Panel>
    </>
  );

  const results = !valid ? (
    <NeedInput title="ใส่ยอดเงินเพื่อเริ่มคำนวณ" body="จะเห็นยอดในใบแจ้งหนี้ ภาษีที่ถูกหัก และเงินที่ได้รับจริง" />
  ) : (
    <>
      <ResultHero
        label={label}
        value={fmtBahtExact(heroValue)}
        sentence={
          s.mode === "netTarget" ? (
            <>
              ออกใบแจ้งหนี้ {fmtBahtExact(r.base)}
              {s.vat ? ` + VAT ${fmtBahtExact(r.vatAmount)} = ${fmtBahtExact(r.total)}` : ""}
              {whtRate > 0 ? ` ผู้จ่ายหัก ${fmtNum(whtRate, 1)}% แล้วโอนให้คุณ ${fmtBahtExact(r.net)} พอดี` : ""}
            </>
          ) : (
            <>
              ผู้จ่ายโอนให้ {fmtBahtExact(r.net)}
              {whtRate > 0 ? ` และออกหนังสือรับรองการหักภาษี ${fmtBahtExact(r.wht)} ให้คุณ` : ""}
            </>
          )
        }
      />
      <section className="lab-card overflow-hidden" aria-label="รายละเอียดแบบใบแจ้งหนี้">
        <div className="flex items-center justify-between border-b border-dashed border-lab-border-strong px-4 py-3 sm:px-5">
          <p className="text-[14px] font-semibold">รายละเอียดแบบใบแจ้งหนี้</p>
          <p className="text-[11.5px] text-lab-muted">หน่วย: บาท</p>
        </div>
        <div className="px-4 py-2 sm:px-5">
          <Row label="มูลค่าสินค้า / บริการ" value={r.base} />
          {s.vat && <Row label={`VAT ${fmtNum(vatRate, 1)}%`} value={r.vatAmount} />}
          <div className="border-t border-lab-border" />
          <Row label="ยอดรวมในใบแจ้งหนี้" value={r.total} strong />
          {whtRate > 0 && <Row label={`หัก ณ ที่จ่าย ${fmtNum(whtRate, 1)}%`} note="จากยอดก่อน VAT" value={r.wht} minus />}
          <div className="border-t-2 border-double border-lab-border-strong" />
          <Row label="ยอดโอนสุทธิ" value={r.net} strong />
        </div>
      </section>
      <Insights items={insights} />
      <Formulas
        lines={[
          ...(s.mode === "includesVat" && s.vat ? [{ label: "ยอดก่อน VAT", formula: `ยอดรวม VAT ÷ ${1 + vatRate / 100}`, worked: `${fmtNum(num(s.amount), 2)} ÷ ${1 + vatRate / 100} = ${fmtNum(r.base, 2)}` }] : []),
          ...(s.mode === "netTarget"
            ? [{ label: "ยอดก่อน VAT ที่ต้องออกบิล", formula: "เงินที่อยากได้รับ ÷ (1 + VAT% − หัก ณ ที่จ่าย%)", worked: `${fmtNum(num(s.amount), 2)} ÷ (1 + ${s.vat ? vatRate / 100 : 0} − ${whtRate / 100}) = ${fmtNum(r.base, 2)}` }]
            : []),
          ...(s.vat ? [{ label: "VAT", formula: `ยอดก่อน VAT × ${fmtNum(vatRate, 1)}%`, worked: `${fmtNum(r.base, 2)} × ${vatRate / 100} = ${fmtNum(r.vatAmount, 2)}` }] : []),
          ...(whtRate > 0 ? [{ label: "หัก ณ ที่จ่าย", formula: `ยอดก่อน VAT × ${fmtNum(whtRate, 1)}%`, worked: `${fmtNum(r.base, 2)} × ${whtRate / 100} = ${fmtNum(r.wht, 2)}` }] : []),
          { label: "ยอดโอนสุทธิ", formula: "ยอดรวมในใบแจ้งหนี้ − หัก ณ ที่จ่าย", worked: `${fmtNum(r.total, 2)} − ${fmtNum(r.wht, 2)} = ${fmtNum(r.net, 2)}` },
        ]}
        note="ปัดเศษเป็นสตางค์ (ทศนิยม 2 ตำแหน่ง) ทุกบรรทัด"
      />
      <div>
        <CopyButton text={summary} label="คัดลอกรายละเอียด" />
      </div>
    </>
  );

  return (
    <ToolLayout
      toolId="vat"
      presets={Object.entries(PRESETS).map(([id, p]) => ({ id, label: p.label }))}
      activePreset={s.preset}
      onPreset={(id) => setS(withPreset(id))}
      onReset={() => setS({ ...EMPTY })}
      inputs={inputs}
      results={results}
      bar={valid ? { label, value: fmtBahtExact(heroValue) } : null}
    />
  );
};

export default Vat;
