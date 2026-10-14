import { useMemo, useState } from "react";
import ToolLayout from "../components/ToolLayout";
import { Disclosure, NumberField, Panel, SliderField } from "../components/fields";
import { CopyButton, Formulas, InsightItem, Insights, NeedInput, ResultHero, Stat, StatGrid, Tone } from "../components/results";
import RunwayChart from "../components/charts/RunwayChart";
import { runway, HORIZON, type RunwayInput, type RunwayResult } from "../lib/calc/runway";
import { addMonths, fmtBaht, fmtDuration, fmtNum, num, thaiMonthYear } from "../lib/format";
import { useLabState } from "../lib/storage";
import { useRecent } from "../lib/hooks";

type State = {
  preset: string | null;
  cash: number | null;
  revenue: number | null;
  expenses: number | null;
  growth: number | null;
  cap: number | null;
};

const EMPTY: State = { preset: null, cash: null, revenue: null, expenses: null, growth: 0, cap: null };
const PRESETS: Record<string, { label: string; values: Partial<State> }> = {
  new: { label: "เพิ่งเปิดร้าน", values: { cash: 300000, revenue: 60000, expenses: 110000, growth: 8, cap: 150000 } },
  slow: { label: "ช่วงขายเงียบ", values: { cash: 400000, revenue: 90000, expenses: 160000, growth: 0 } },
  steady: { label: "ร้านที่อยู่ตัวแล้ว", values: { cash: 150000, revenue: 220000, expenses: 205000, growth: 0 } },
};
const withPreset = (id: string): State => ({ ...EMPTY, ...PRESETS[id].values, preset: id });

const STATUS: Record<RunwayResult["status"], { tone: Tone; text: string }> = {
  profitable: { tone: "good", text: "มีเงินเหลือทุกเดือน" },
  recovers: { tone: "good", text: "ฟื้นก่อนเงินหมด" },
  safe: { tone: "good", text: "ยังมีเวลา" },
  watch: { tone: "warn", text: "ควรเริ่มวางแผน" },
  urgent: { tone: "bad", text: "เร่งด่วน" },
  empty: { tone: "bad", text: "เงินสดหมดแล้ว" },
};

const headline = (r: RunwayResult) => (r.runwayMonths === null ? "ไม่หมด" : fmtDuration(r.runwayMonths));

const Runway = () => {
  const [s, setS, patchRaw] = useLabState<State>("runway", withPreset("new"));
  const [cut, setCut] = useState(0);
  const [boost, setBoost] = useState(0);
  const patch = (p: Partial<State>) => patchRaw({ ...p, preset: null });
  const start = useMemo(() => new Date(), []);

  const base: RunwayInput = { cash: num(s.cash), revenue: num(s.revenue), expenses: num(s.expenses), revenueGrowthPct: num(s.growth), revenueCap: num(s.cap) };
  const key = JSON.stringify(base);
  const r0 = useMemo(() => runway(base), [key]);
  const whatIf = cut > 0 || boost > 0;
  const r = useMemo(() => (whatIf ? runway({ ...base, cutExpensesPct: cut, boostRevenuePct: boost }) : r0), [key, cut, boost, r0]);
  const valid = num(s.expenses) > 0 || num(s.revenue) > 0;

  useRecent("runway", valid ? (r0.runwayMonths === null ? "เงินไม่หมดใน 3 ปี" : `อยู่ได้ ${fmtDuration(r0.runwayMonths)}`) : null);

  const tenPct = useMemo(() => runway({ ...base, cutExpensesPct: 10 }), [key]);
  const insights: InsightItem[] = [];
  if (valid) {
    if (r0.status === "urgent" || r0.status === "empty") {
      insights.push({
        tone: "bad",
        title: r0.status === "empty" ? "เงินสดติดลบตั้งแต่ตอนนี้" : "เหลือเวลาไม่ถึง 6 เดือน",
        body: "เริ่มหาเงินทุนสำรองหรือคุยกับธนาคารตั้งแต่ตอนนี้ เพราะการขอสินเชื่อมักใช้เวลาหลายสัปดาห์ถึงหลายเดือน",
      });
    }
    if (r0.runwayMonths !== null && tenPct.runwayMonths !== null && r0.burn > 0) {
      const gain = tenPct.runwayMonths - r0.runwayMonths;
      if (gain >= 0.3)
        insights.push({
          tone: "tip",
          title: `ลดรายจ่าย 10% (${fmtBaht(num(s.expenses) * 0.1)}/เดือน) ซื้อเวลาเพิ่มได้ ${fmtNum(gain, 1)} เดือน`,
          body: "ลองเลื่อนแถบ “ลดรายจ่าย” ด้านล่างเพื่อดูว่าต้องลดเท่าไหร่ถึงพอ",
        });
    } else if (r0.runwayMonths !== null && tenPct.runwayMonths === null) {
      insights.push({ tone: "good", title: "ลดรายจ่ายแค่ 10% เงินก็ไม่หมดภายใน 3 ปี", body: `เท่ากับลดเดือนละ ${fmtBaht(num(s.expenses) * 0.1)}` });
    }
    if (r0.status === "recovers" && r0.breakevenMonth) {
      insights.push({
        tone: "good",
        title: `รายรับแซงรายจ่ายในเดือนที่ ${r0.breakevenMonth} (${thaiMonthYear(addMonths(start, r0.breakevenMonth))})`,
        body: `ถ้าโตได้เดือนละ ${num(s.growth)}%${num(s.cap) ? ` จนถึง ${fmtBaht(num(s.cap))}` : ""} จริง เงินสดจะต่ำสุดที่ ${fmtBaht(r0.lowestCash.cash)} แล้วค่อยๆ เพิ่มขึ้น ลองใส่การเติบโตที่ต่ำลงเพื่อดูกรณีไม่เป็นตามแผน`,
      });
    }
    insights.push({
      tone: "tip",
      title: "นับรายจ่ายก้อนใหญ่ที่ไม่ได้จ่ายทุกเดือนด้วย",
      body: "เช่น ภาษีปลายปี ค่าต่อสัญญาเช่า โบนัส หรือค่าซ่อมเครื่อง เอามาเฉลี่ยเป็นรายเดือนแล้วบวกในรายจ่าย",
    });
  }

  const summary = () =>
    [
      "เงินสดพอไปกี่เดือน · Jarua Business Lab",
      `เงินสด ${fmtBaht(base.cash)} · รายรับ ${fmtBaht(base.revenue)}/เดือน · รายจ่าย ${fmtBaht(base.expenses)}/เดือน${base.revenueGrowthPct ? ` · รายรับโต ${base.revenueGrowthPct}%/เดือน` : ""}`,
      r0.runwayMonths === null ? "เงินสดไม่หมดภายใน 3 ปี" : `อยู่ได้ ${fmtDuration(r0.runwayMonths)} (เงินหมดราว ${thaiMonthYear(addMonths(start, r0.runwayMonths))})`,
      whatIf ? `ถ้าลดรายจ่าย ${cut}% และเพิ่มรายรับ ${boost}%: ${r.runwayMonths === null ? "ไม่หมดใน 3 ปี" : fmtDuration(r.runwayMonths)}` : "",
    ]
      .filter(Boolean)
      .join("\n");

  const st = STATUS[r.status];
  const heroSentence = () => {
    if (r.status === "profitable") return <>รายรับมากกว่ารายจ่ายเดือนละ <b>{fmtBaht(-r.burn)}</b> อีก 3 ปีเงินสดจะเป็น <b>{fmtBaht(r.months[r.months.length - 1].cash)}</b></>;
    if (r.status === "empty") return <>เงินสดตอนนี้ {fmtBaht(base.cash)} และยังใช้เงินเกินรายรับเดือนละ {fmtBaht(r.burn)}</>;
    if (r.runwayMonths === null)
      return r.breakevenMonth ? (
        <>เงินจะลดต่ำสุดที่ <b>{fmtBaht(r.lowestCash.cash)}</b> ในเดือนที่ {r.lowestCash.month} แล้วเริ่มเพิ่มขึ้นตั้งแต่เดือนที่ {r.breakevenMonth}</>
      ) : (
        <>ภายใน 3 ปีเงินสดยังไม่หมด เหลือต่ำสุด {fmtBaht(r.lowestCash.cash)}</>
      );
    return (
      <>
        เงินจะหมดราว <b>{thaiMonthYear(addMonths(start, r.runwayMonths))}</b> ถ้ารายรับรายจ่ายเป็นแบบนี้ เดือนแรกใช้เงินเกินรายรับ {fmtBaht(r.burn)}
      </>
    );
  };

  const inputs = (
    <>
      <Panel title="ตอนนี้">
        <NumberField id="rw-cash" label="เงินสดที่ใช้ได้ทั้งหมด" help="เงินในบัญชีธุรกิจ + เงินสดในมือ ไม่รวมสต็อกหรือลูกหนี้" prefix="฿" value={s.cash} onChange={(v) => patch({ cash: v })} />
      </Panel>
      <Panel title="แต่ละเดือน">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="rw-rev" label="รายรับเฉลี่ย" prefix="฿" value={s.revenue} onChange={(v) => patch({ revenue: v })} />
            <NumberField id="rw-exp" label="รายจ่ายเฉลี่ย" prefix="฿" value={s.expenses} onChange={(v) => patch({ expenses: v })} />
          </div>
          <p className="-mt-2 text-[12.5px] leading-relaxed text-lab-muted">รายจ่าย = ทุกอย่างที่จ่ายออกไป ทั้งค่าของ ค่าเช่า เงินเดือน ค่าผ่อน</p>
          <NumberField id="rw-growth" label="รายรับโตเดือนละ" help="ใส่ 0 ถ้าคิดว่าเท่าเดิม ใส่ติดลบได้ถ้ายอดกำลังลด" suffix="% ต่อเดือน" allowNegative decimals={1} min={-50} max={50} value={s.growth} onChange={(v) => patch({ growth: v })} />
          {num(s.growth) > 0 && (
            <NumberField
              id="rw-cap"
              label="รายรับโตได้สูงสุดเดือนละ"
              help="ร้านมีขีดจำกัดเสมอ เช่น จำนวนโต๊ะ เวลาเปิด หรือกำลังผลิต เว้นว่างถ้าไม่จำกัด"
              prefix="฿"
              optional
              value={s.cap}
              onChange={(v) => patch({ cap: v })}
            />
          )}
        </div>
      </Panel>
    </>
  );

  const results = !valid ? (
    <NeedInput title="ใส่เงินสด รายรับ และรายจ่ายต่อเดือน" body="กราฟเงินสดล่วงหน้า 3 ปีจะขึ้นทันที" />
  ) : (
    <>
      <ResultHero label={whatIf ? "หลังปรับตัวเลข เงินสดพอใช้อีก" : "เงินสดพอใช้อีก"} value={headline(r)} unit={r.runwayMonths === null ? "ภายใน 3 ปี" : undefined} sentence={heroSentence()} status={st} />
      <StatGrid>
        <Stat label={r.burn > 0 ? "ใช้เงินเกินรายรับ (เดือนแรก)" : "เงินเหลือ (เดือนแรก)"} value={fmtBaht(Math.abs(r.burn))} tone={r.burn > 0 ? "bad" : undefined} sub="ต่อเดือน" />
        <Stat label="เงินสดต่ำสุด" value={fmtBaht(r.lowestCash.cash)} tone={r.lowestCash.cash < 0 ? "bad" : undefined} sub={r.lowestCash.month === 0 ? "คือตอนนี้" : `เดือนที่ ${r.lowestCash.month}`} />
        <Stat label="เงินสดอีก 12 เดือน" value={fmtBaht(r.months[11].cash)} tone={r.months[11].cash < 0 ? "bad" : undefined} sub={thaiMonthYear(addMonths(start, 12))} />
        <Stat label="รายรับแซงรายจ่าย" value={r.status === "profitable" ? "แล้ว" : r.breakevenMonth ? `เดือนที่ ${r.breakevenMonth}` : "ยังไม่เกิด"} sub={r.breakevenMonth ? thaiMonthYear(addMonths(start, r.breakevenMonth)) : "ภายใน 3 ปี"} />
      </StatGrid>
      <RunwayChart
        startCash={base.cash}
        months={r.months}
        runwayMonths={r.runwayMonths}
        breakevenMonth={r.breakevenMonth}
        start={start}
        baseline={whatIf ? [base.cash, ...r0.months.map((m) => m.cash)] : null}
      />
      <Panel title="ลองปรับ">
        <div className="space-y-5">
          <SliderField id="rw-cut" label="ลดรายจ่าย" min={0} max={50} value={cut} onChange={setCut} format={(v) => (v ? `−${v}% · ${fmtBaht(num(s.expenses) * (1 - v / 100))}` : "ไม่ลด")} />
          <SliderField id="rw-boost" label="เพิ่มรายรับ" min={0} max={100} step={5} value={boost} onChange={setBoost} format={(v) => (v ? `+${v}% · ${fmtBaht(num(s.revenue) * (1 + v / 100))}` : "เท่าเดิม")} />
        </div>
        {whatIf && (
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Stat label="ตามตัวเลขเดิม" value={headline(r0)} sub={`เงินต่ำสุด ${fmtBaht(r0.lowestCash.cash)}`} tone={r0.lowestCash.cash < 0 ? "bad" : undefined} />
            <Stat
              label="หลังปรับ"
              value={headline(r)}
              sub={r.runwayMonths !== null && r0.runwayMonths !== null ? `นานขึ้น ${fmtNum(r.runwayMonths - r0.runwayMonths, 1)} เดือน` : `เงินต่ำสุด ${fmtBaht(r.lowestCash.cash)}`}
            />
          </div>
        )}
      </Panel>
      <Insights items={insights} />
      <Panel>
        <Disclosure summary="ดูตารางรายเดือน">
          <div className="-mx-1 max-h-[420px] overflow-auto">
            <table className="w-full min-w-[420px] text-[12.5px]">
              <thead className="sticky top-0 bg-lab-surface text-lab-muted">
                <tr className="text-right">
                  <th className="py-2 pl-1 text-left font-semibold">เดือน</th>
                  <th className="py-2 font-semibold">รายรับ</th>
                  <th className="py-2 font-semibold">รายจ่าย</th>
                  <th className="py-2 pr-1 font-semibold">เงินคงเหลือ</th>
                </tr>
              </thead>
              <tbody className="lab-tnum">
                {r.months.slice(0, HORIZON).map((m) => (
                  <tr key={m.month} className="border-t border-lab-border text-right">
                    <td className="py-1.5 pl-1 text-left text-lab-muted">{thaiMonthYear(addMonths(start, m.month))}</td>
                    <td className="py-1.5">{fmtNum(m.revenue)}</td>
                    <td className="py-1.5">{fmtNum(m.expenses)}</td>
                    <td className={`py-1.5 pr-1 font-medium ${m.cash < 0 ? "text-lab-danger" : ""}`}>{fmtNum(m.cash)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Disclosure>
      </Panel>
      <Formulas
        lines={[
          { label: "เงินสดสิ้นเดือน", formula: "เงินสดต้นเดือน + รายรับเดือนนั้น − รายจ่ายเดือนนั้น" },
          { label: "รายรับเดือนที่ n", formula: `รายรับเฉลี่ย × (1 + การเติบโต)^(n − 1)${num(s.cap) ? " แต่ไม่เกินรายรับสูงสุด" : ""}`, worked: num(s.growth) ? `${fmtNum(base.revenue)} × ${fmtNum(1 + num(s.growth) / 100, 3)}^(n − 1)${num(s.cap) ? ` ≤ ${fmtNum(num(s.cap))}` : ""}` : undefined },
          ...(r0.runwayMonths !== null && !num(s.growth) && r0.burn > 0
            ? [{ label: "อยู่ได้ (กรณีรายรับคงที่)", formula: "เงินสด ÷ (รายจ่าย − รายรับ)", worked: `${fmtNum(base.cash)} ÷ ${fmtNum(r0.burn)} = ${fmtNum(r0.runwayMonths, 1)} เดือน` }]
            : []),
        ]}
        note="จำลองล่วงหน้า 36 เดือน รายจ่ายคงที่ทุกเดือน"
      />
      <div>
        <CopyButton text={summary} />
      </div>
    </>
  );

  return (
    <ToolLayout
      toolId="runway"
      presets={Object.entries(PRESETS).map(([id, p]) => ({ id, label: p.label }))}
      activePreset={s.preset}
      onPreset={(id) => {
        setS(withPreset(id));
        setCut(0);
        setBoost(0);
      }}
      onReset={() => {
        setS({ ...EMPTY });
        setCut(0);
        setBoost(0);
      }}
      inputs={inputs}
      results={results}
      bar={valid ? { label: "เงินสดพอใช้อีก", value: r.runwayMonths === null ? "ไม่หมดใน 3 ปี" : `${fmtDuration(r.runwayMonths)} · ถึง ${thaiMonthYear(addMonths(start, r.runwayMonths))}` } : null}
    />
  );
};

export default Runway;
