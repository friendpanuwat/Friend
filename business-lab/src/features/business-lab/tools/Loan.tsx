import { useMemo } from "react";
import ToolLayout from "../components/ToolLayout";
import { Chips, Disclosure, NumberField, Panel, Segmented } from "../components/fields";
import { CopyButton, Formulas, InsightItem, Insights, NeedInput, ResultHero, Stat, StatGrid } from "../components/results";
import { CompareBars } from "../components/charts/Bars";
import { ChartCard } from "../components/charts/core";
import { loan, type LoanMethod, type RateUnit } from "../lib/calc/loan";
import { fmtBaht, fmtNum, fmtPct, num } from "../lib/format";
import { useLabState } from "../lib/storage";
import { useRecent } from "../lib/hooks";

type State = {
  preset: string | null;
  principal: number | null;
  rate: number | null;
  rateUnit: RateUnit;
  method: LoanMethod;
  term: number | null;
};

const EMPTY: State = { preset: null, principal: null, rate: null, rateUnit: "year", method: "flat", term: 36 };
const PRESETS: Record<string, { label: string; values: Partial<State> }> = {
  personal: { label: "สินเชื่อดอกเบี้ย 1%/เดือน", values: { principal: 100000, rate: 1, rateUnit: "month", method: "flat", term: 36 } },
  car: { label: "ผ่อนรถ", values: { principal: 500000, rate: 2.99, rateUnit: "year", method: "flat", term: 60 } },
  sme: { label: "เงินกู้ SME ลดต้นลดดอก", values: { principal: 1000000, rate: 7.5, rateUnit: "year", method: "reducing", term: 60 } },
};
const withPreset = (id: string): State => ({ ...EMPTY, ...PRESETS[id].values, preset: id });
const TERMS = [12, 24, 36, 48, 60, 72, 84];
const METHOD_LABEL: Record<LoanMethod, string> = { flat: "ดอกเบี้ยคงที่ (flat)", reducing: "ลดต้นลดดอก" };
const pct = (n: number) => `${fmtNum(n, 2).replace(/\.00$/, "")}%`;

const Loan = () => {
  const [s, setS, patchRaw] = useLabState<State>("loan", withPreset("personal"));
  const patch = (p: Partial<State>) => patchRaw({ ...p, preset: null });
  const input = { principal: num(s.principal), rate: num(s.rate), rateUnit: s.rateUnit, method: s.method, termMonths: num(s.term) };
  const r = useMemo(() => loan(input), [JSON.stringify(input)]);

  useRecent("loan", r.ok ? `แท้จริง ${pct(r.effectiveAnnual)} ต่อปี` : null);

  const ratio = r.ok && r.annualQuoted > 0 ? r.effectiveAnnual / r.annualQuoted : 1;
  const insights: InsightItem[] = [];
  if (r.ok) {
    if (s.method === "flat" && r.annualQuoted > 0) {
      insights.push({
        tone: ratio > 1.5 ? "warn" : "tip",
        title: `ตัวเลขที่ประกาศ ${pct(r.annualQuoted)} แต่จ่ายจริงเท่ากับ ${pct(r.effectiveAnnual)} ต่อปี`,
        body: "แบบ flat คิดดอกเบี้ยจากเงินต้นเต็มจำนวนตลอดสัญญา แม้คุณจะผ่อนคืนไปเกือบหมดแล้ว ดอกเบี้ยจริงจึงสูงกว่าตัวเลขที่เห็นเกือบเท่าตัว",
      });
    }
    if (s.method === "reducing" && r.annualQuoted > 0) {
      insights.push({
        tone: "good",
        title: `${pct(r.annualQuoted)} แบบลดต้นลดดอก คืออัตราจริงอยู่แล้ว`,
        body: `ถ้าผู้ให้กู้อีกเจ้าเสนอแบบ flat ต้องต่ำกว่า ${pct(r.flatEquivalent)} ต่อปี ถึงจะถูกกว่าข้อเสนอนี้`,
      });
    }
    insights.push({
      tone: "tip",
      title: "เทียบเงินกู้ด้วยดอกเบี้ยแท้จริงเสมอ",
      body: "ขอดูอัตราดอกเบี้ยแท้จริง (Effective Rate) และค่าธรรมเนียมอื่นๆ จากผู้ให้กู้ทุกเจ้า แล้วใช้ตัวเลขนั้นเทียบกัน ไม่ใช่ตัวเลขในโฆษณา",
    });
  }

  const summary = () =>
    r.ok
      ? [
          "ดอกเบี้ยแท้จริง · Jarua Business Lab",
          `กู้ ${fmtBaht(input.principal)} · ${pct(input.rate)} ต่อ${s.rateUnit === "month" ? "เดือน" : "ปี"} แบบ${METHOD_LABEL[s.method]} · ${input.termMonths} งวด`,
          `ค่างวด ${fmtBaht(r.payment, 2)}/เดือน · ดอกเบี้ยรวม ${fmtBaht(r.totalInterest)} · จ่ายทั้งหมด ${fmtBaht(r.totalPaid)}`,
          `ดอกเบี้ยแท้จริง (ลดต้นลดดอก) ${pct(r.effectiveAnnual)} ต่อปี`,
        ].join("\n")
      : "";

  const inputs = (
    <>
      <Panel title="เงินกู้">
        <div className="space-y-5">
          <NumberField id="ln-p" label="ยอดเงินกู้" prefix="฿" value={s.principal} onChange={(v) => patch({ principal: v })} />
          <div>
            <NumberField id="ln-r" label="ดอกเบี้ยตามที่ผู้ให้กู้แจ้ง" suffix={s.rateUnit === "month" ? "% ต่อเดือน" : "% ต่อปี"} value={s.rate} max={100} onChange={(v) => patch({ rate: v })} />
            <div className="mt-2.5">
              <Segmented<RateUnit>
                label="หน่วยดอกเบี้ย"
                value={s.rateUnit}
                onChange={(v) => patch({ rateUnit: v })}
                options={[
                  { value: "year", label: "ต่อปี" },
                  { value: "month", label: "ต่อเดือน" },
                ]}
              />
            </div>
          </div>
          <div>
            <p className="mb-2 text-[14px] font-semibold">วิธีคิดดอกเบี้ย</p>
            <Segmented<LoanMethod>
              label="วิธีคิดดอกเบี้ย"
              value={s.method}
              onChange={(v) => patch({ method: v })}
              options={[
                { value: "flat", label: "คงที่ (flat)" },
                { value: "reducing", label: "ลดต้นลดดอก" },
              ]}
            />
            <p className="mt-2 text-[12.5px] leading-relaxed text-lab-muted">
              {s.method === "flat"
                ? "พบบ่อยในเช่าซื้อรถ สินเชื่อส่วนบุคคล และเงินกู้นอกระบบ ดอกเบี้ยคิดจากเงินต้นตั้งต้นทุกงวด"
                : "พบบ่อยในเงินกู้ธนาคาร สินเชื่อบ้าน ดอกเบี้ยคิดจากเงินต้นที่ยังเหลือ"}
            </p>
          </div>
        </div>
      </Panel>
      <Panel title="ระยะเวลาผ่อน">
        <div className="space-y-4">
          <Chips label="จำนวนงวด" value={String(s.term)} onChange={(v) => patch({ term: Number(v) })} options={TERMS.map((t) => ({ value: String(t), label: `${t / 12} ปี` }))} />
          <NumberField id="ln-n" label="หรือใส่จำนวนงวด" suffix="เดือน" decimals={0} max={480} value={s.term} onChange={(v) => patch({ term: v })} />
        </div>
      </Panel>
    </>
  );

  const results = !r.ok ? (
    <NeedInput title={r.reason === "no-term" ? "ใส่จำนวนงวด" : "ใส่ยอดเงินกู้เพื่อเริ่มคำนวณ"} body="ค่างวดและดอกเบี้ยแท้จริงจะขึ้นทันที" />
  ) : (
    <>
      <ResultHero
        label="ดอกเบี้ยแท้จริง (เทียบแบบลดต้นลดดอก)"
        value={pct(r.effectiveAnnual)}
        unit="ต่อปี"
        sentence={
          s.method === "flat" && r.annualQuoted > 0 ? (
            <>
              ดอกเบี้ย flat {pct(input.rate)} ต่อ{s.rateUnit === "month" ? "เดือน" : "ปี"} จ่ายจริงเท่ากับเงินกู้ลดต้นลดดอก {pct(r.effectiveAnnual)} ต่อปี <b>สูงกว่าตัวเลขที่เห็น {fmtNum(ratio, 1)} เท่า</b>
            </>
          ) : r.annualQuoted === 0 ? (
            <>ไม่มีดอกเบี้ย จ่ายคืนเท่าเงินต้น</>
          ) : (
            <>แบบลดต้นลดดอก ตัวเลขที่ประกาศคืออัตราจริง ถ้าเขียนแบบ flat จะเท่ากับ {pct(r.flatEquivalent)} ต่อปี</>
          )
        }
        status={s.method === "flat" && ratio > 1.5 ? { tone: "warn", text: "แพงกว่าที่เห็น" } : undefined}
      />
      <StatGrid>
        <Stat label="ค่างวดต่อเดือน" value={fmtBaht(r.payment, r.payment < 100000 ? 2 : 0)} sub={`${input.termMonths} งวด`} />
        <Stat label="ดอกเบี้ยรวมทั้งสัญญา" value={fmtBaht(r.totalInterest)} sub={`${fmtPct(r.totalInterest / input.principal, 0)} ของเงินต้น`} />
        <Stat label="จ่ายคืนทั้งหมด" value={fmtBaht(r.totalPaid)} />
        <Stat label="ดอกเบี้ยตามที่ประกาศ" value={`${pct(r.annualQuoted)}`} sub={`ต่อปี${s.rateUnit === "month" ? ` (${pct(input.rate)} × 12)` : ""}`} />
      </StatGrid>
      <ChartCard title={`ดอกเบี้ยรวม ถ้าตัวเลข ${pct(r.annualQuoted)} ต่อปี คิดคนละวิธี`} subtitle={`กู้ ${fmtBaht(input.principal)} ผ่อน ${input.termMonths} งวด`}>
        <CompareBars
          fmt={(n) => fmtBaht(n)}
          rows={[
            { label: `${METHOD_LABEL[s.method]} (ของคุณ)`, value: r.totalInterest, highlight: true, note: `งวดละ ${fmtBaht(r.payment)}` },
            { label: METHOD_LABEL[r.other.method], value: r.other.totalInterest, note: `งวดละ ${fmtBaht(r.other.payment)}` },
          ]}
        />
        <p className="mt-3 text-[12.5px] text-lab-muted">
          ต่างกัน <b className="text-lab-fg">{fmtBaht(Math.abs(r.totalInterest - r.other.totalInterest))}</b> จากตัวเลขดอกเบี้ยเดียวกัน
        </p>
      </ChartCard>
      <Insights items={insights} />
      <Panel>
        <Disclosure summary="ดูเงินต้นและดอกเบี้ยรายปี">
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[360px] text-[12.5px]">
              <thead className="text-lab-muted">
                <tr className="text-right">
                  <th className="py-2 pl-1 text-left font-semibold">ปีที่</th>
                  <th className="py-2 font-semibold">จ่ายเงินต้น</th>
                  <th className="py-2 font-semibold">จ่ายดอกเบี้ย</th>
                  <th className="py-2 pr-1 font-semibold">หนี้คงเหลือ</th>
                </tr>
              </thead>
              <tbody className="lab-tnum">
                {r.years.map((y) => (
                  <tr key={y.year} className="border-t border-lab-border text-right">
                    <td className="py-1.5 pl-1 text-left text-lab-muted">{y.year}</td>
                    <td className="py-1.5">{fmtNum(y.principal)}</td>
                    <td className="py-1.5">{fmtNum(y.interest)}</td>
                    <td className="py-1.5 pr-1 font-medium">{fmtNum(y.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-lab-muted">แบ่งเงินต้นกับดอกเบี้ยตามอัตราแท้จริง ซึ่งสะท้อนหนี้ที่เหลือจริง ผู้ให้กู้บางรายใช้วิธีแบ่งต่างออกไป</p>
        </Disclosure>
      </Panel>
      <Formulas
        lines={
          s.method === "flat"
            ? [
                { label: "ดอกเบี้ยรวม (flat)", formula: "เงินต้น × ดอกเบี้ยต่อปี × จำนวนปี", worked: `${fmtNum(input.principal)} × ${fmtNum(r.annualQuoted / 100, 4)} × ${fmtNum(input.termMonths / 12, 2)} = ${fmtNum(r.totalInterest, 2)}` },
                { label: "ค่างวด", formula: "(เงินต้น + ดอกเบี้ยรวม) ÷ จำนวนงวด", worked: `${fmtNum(input.principal + r.totalInterest, 2)} ÷ ${input.termMonths} = ${fmtNum(r.payment, 2)}` },
                { label: "ดอกเบี้ยแท้จริง", formula: "หาอัตราต่อเดือน i ที่ทำให้ค่างวดเดิมผ่อนเงินต้นหมดพอดีแบบลดต้นลดดอก แล้ว × 12", worked: `i = ${fmtNum(r.effectiveAnnual / 12, 4)}% ต่อเดือน → ${pct(r.effectiveAnnual)} ต่อปี` },
              ]
            : [
                { label: "ค่างวด (ลดต้นลดดอก)", formula: "เงินต้น × i ÷ (1 − (1 + i)^−n)  เมื่อ i = ดอกเบี้ยต่อปี ÷ 12", worked: `i = ${fmtNum(r.annualQuoted / 12, 4)}% · n = ${input.termMonths} → ${fmtNum(r.payment, 2)}` },
                { label: "ดอกเบี้ยรวม", formula: "ค่างวด × จำนวนงวด − เงินต้น", worked: `${fmtNum(r.payment, 2)} × ${input.termMonths} − ${fmtNum(input.principal)} = ${fmtNum(r.totalInterest, 2)}` },
              ]
        }
        note="ไม่รวมค่าธรรมเนียม ประกัน หรือค่าใช้จ่ายอื่นที่ผู้ให้กู้อาจเรียกเก็บเพิ่ม"
      />
      <div>
        <CopyButton text={summary} />
      </div>
    </>
  );

  return (
    <ToolLayout
      toolId="loan"
      presets={Object.entries(PRESETS).map(([id, p]) => ({ id, label: p.label }))}
      activePreset={s.preset}
      onPreset={(id) => setS(withPreset(id))}
      onReset={() => setS({ ...EMPTY })}
      inputs={inputs}
      results={results}
      bar={r.ok ? { label: "ดอกเบี้ยแท้จริง", value: `${pct(r.effectiveAnnual)}/ปี · งวดละ ${fmtBaht(r.payment)}` } : null}
    />
  );
};

export default Loan;
