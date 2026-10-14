import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ToolLayout from "../components/ToolLayout";
import { Chips, Disclosure, NumberField, Panel, SliderField, SwitchRow } from "../components/fields";
import { CopyButton, Formulas, InsightItem, Insights, NeedInput, NextStep, ResultHero, Stat, StatGrid } from "../components/results";
import BreakEvenChart from "../components/charts/BreakEvenChart";
import { useToast } from "../components/Toast";
import { breakEven } from "../lib/calc/breakEven";
import { fmtBaht, fmtNum, fmtPct, num } from "../lib/format";
import { useLabState } from "../lib/storage";
import { useHandoff, useRecent } from "../lib/hooks";
import { toolPath } from "../paths";

type State = {
  preset: string | null;
  noun: string;
  price: number | null;
  unitCost: number | null;
  fixed: number | null;
  split: boolean;
  rent: number | null;
  staff: number | null;
  utilities: number | null;
  other: number | null;
  days: number | null;
  current: number | null;
  target: number | null;
};

const PRESETS: Record<string, { label: string; values: Partial<State> }> = {
  coffee: {
    label: "ร้านกาแฟ",
    values: { noun: "แก้ว", price: 55, unitCost: 22, rent: 15000, staff: 20000, utilities: 6000, other: 4000, days: 26, current: 40, target: 30000 },
  },
  online: {
    label: "ขายของออนไลน์",
    values: { noun: "ชิ้น", price: 390, unitCost: 215, rent: 0, staff: 15000, utilities: 2000, other: 8000, days: 30, current: 3, target: 20000 },
  },
  noodle: {
    label: "ร้านก๋วยเตี๋ยว",
    values: { noun: "ชาม", price: 60, unitCost: 27, rent: 12000, staff: 18000, utilities: 5000, other: 3000, days: 26, current: 70, target: 25000 },
  },
};

const withPreset = (id: string): State => {
  const v = PRESETS[id].values;
  const fixed = num(v.rent) + num(v.staff) + num(v.utilities) + num(v.other);
  return { ...EMPTY, ...v, fixed, split: false, preset: id };
};

const EMPTY: State = {
  preset: null,
  noun: "ชิ้น",
  price: null,
  unitCost: null,
  fixed: null,
  split: false,
  rent: null,
  staff: null,
  utilities: null,
  other: null,
  days: 26,
  current: null,
  target: null,
};

const NOUNS = ["ชิ้น", "แก้ว", "จาน", "ชาม", "ครั้ง", "คน"];

const BreakEven = () => {
  const [s, setS, patchRaw] = useLabState<State>("break-even", withPreset("coffee"));
  const [priceShift, setPriceShift] = useState(10);
  const toast = useToast();
  const navigate = useNavigate();
  const patch = (p: Partial<State>) => patchRaw({ ...p, preset: null });

  useHandoff<State>((p, from) => {
    patchRaw({ ...p, preset: null, split: false });
    toast(`ใส่ตัวเลขจาก “${from}” ให้แล้ว`);
  });

  const fixed = s.split ? num(s.rent) + num(s.staff) + num(s.utilities) + num(s.other) : num(s.fixed);
  const noun = s.noun || "ชิ้น";
  const input = {
    price: num(s.price),
    unitCost: num(s.unitCost),
    fixedMonthly: fixed,
    daysOpen: num(s.days),
    targetProfit: s.target ?? undefined,
    currentDaily: s.current ?? undefined,
  };
  const r = useMemo(() => breakEven(input), [JSON.stringify(input)]);
  const shifted = useMemo(
    () => (r.ok ? breakEven({ ...input, price: input.price * (1 + priceShift / 100), currentDaily: undefined }) : null),
    [r, priceShift, JSON.stringify(input)],
  );

  useRecent("break-even", r.ok ? `วันละ ${fmtNum(r.unitsDay)} ${noun}` : null);

  const insights: InsightItem[] = [];
  if (r.ok) {
    if (r.current) {
      if (r.current.gapPerDay > 0) {
        const priceAtCurrent = input.unitCost + fixed / (input.currentDaily! * input.daysOpen);
        insights.push({
          tone: "bad",
          title: `ยังขาดอีกวันละ ${fmtNum(Math.ceil(r.current.gapPerDay - 1e-9))} ${noun} ถึงจะคุ้มทุน`,
          body: `ถ้ายอดขายเท่าเดิม (วันละ ${fmtNum(input.currentDaily!)} ${noun}) ต้องขายราคา ${fmtBaht(Math.ceil(priceAtCurrent))} ขึ้นไปถึงจะไม่ขาดทุน`,
        });
      } else {
        insights.push({
          tone: "good",
          title: `ขายเกินจุดคุ้มทุนมา ${fmtPct(r.current.safetyMargin, 0)}`,
          body: `ยอดขายลดลงได้อีกราว ${fmtPct(r.current.safetyMargin, 0)} ก่อนจะเริ่มขาดทุน ยิ่งตัวเลขนี้สูง ร้านยิ่งทนต่อเดือนที่ขายไม่ดี`,
        });
      }
    }
    if (r.contributionRatio < 0.3) {
      insights.push({
        tone: "warn",
        title: `ขาย 100 บาท เหลือไว้จ่ายค่าเช่าและเงินเดือนแค่ ${fmtNum(r.contributionRatio * 100)} บาท`,
        body: "กำไรต่อชิ้นบางทำให้ต้องขายจำนวนมากถึงจะคุ้มทุน ลองดูว่าขึ้นราคาได้ไหม หรือลดต้นทุนวัตถุดิบลงได้อีกเท่าไหร่",
      });
    } else if (r.contributionRatio >= 0.55) {
      insights.push({
        tone: "good",
        title: `ขาย 100 บาท เหลือไว้จ่ายค่าใช้จ่ายคงที่ ${fmtNum(r.contributionRatio * 100)} บาท`,
        body: "กำไรต่อชิ้นดี ยอดขายที่เกินจุดคุ้มทุนจะกลายเป็นกำไรได้เร็ว",
      });
    }
    if (!s.split) {
      insights.push({
        tone: "tip",
        title: "ใส่เงินเดือนของตัวเองในค่าใช้จ่ายคงที่ด้วย",
        body: "ถ้าไม่นับค่าแรงเจ้าของ จุดคุ้มทุนจะดูต่ำกว่าความจริง กด “ช่วยแยกรายการ” เพื่อเช็กว่าไม่ลืมอะไร",
      });
    }
  }

  const summary = () =>
    r.ok
      ? [
          "จุดคุ้มทุน · Jarua Business Lab",
          `ราคาขาย ${fmtBaht(input.price)} · ต้นทุน ${fmtBaht(input.unitCost)}/${noun} · ค่าใช้จ่ายคงที่ ${fmtBaht(fixed)}/เดือน · เปิด ${input.daysOpen} วัน`,
          `ต้องขายอย่างน้อยวันละ ${fmtNum(r.unitsDay)} ${noun} (${fmtNum(r.unitsMonth)} ${noun}/เดือน)`,
          `ยอดขายขั้นต่ำ ${fmtBaht(r.revenueMonth)}/เดือน`,
          r.target ? `ถ้าอยากได้กำไร ${fmtBaht(input.targetProfit!)}/เดือน ต้องขายวันละ ${fmtNum(r.target.unitsDay)} ${noun}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      : "";

  const inputs = (
    <>
      <Panel title="ราคาและต้นทุนต่อชิ้น">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-[14px] font-semibold">เรียกสิ่งที่ขายว่า</p>
            <Chips label="หน่วยที่ขาย" value={noun} onChange={(v) => patchRaw({ noun: v })} options={NOUNS.map((n) => ({ value: n, label: n }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="be-price" label={`ราคาขายต่อ${noun}`} prefix="฿" value={s.price} onChange={(v) => patch({ price: v })} />
            <NumberField id="be-cost" label={`ต้นทุนต่อ${noun}`} prefix="฿" value={s.unitCost} onChange={(v) => patch({ unitCost: v })} />
          </div>
          <p className="-mt-2 text-[12.5px] leading-relaxed text-lab-muted">
            ต้นทุนต่อชิ้น = ทุกอย่างที่จ่ายเพิ่มเมื่อขายได้หนึ่ง{noun} เช่น วัตถุดิบ แก้ว/กล่อง ค่าส่ง ค่าธรรมเนียม
          </p>
        </div>
      </Panel>

      <Panel title="ค่าใช้จ่ายต่อเดือน">
        <div className="space-y-5">
          {s.split ? (
            <div className="grid grid-cols-2 gap-3">
              <NumberField id="be-rent" label="ค่าเช่าที่" prefix="฿" value={s.rent} onChange={(v) => patch({ rent: v })} />
              <NumberField id="be-staff" label="เงินเดือน (รวมของตัวเอง)" prefix="฿" value={s.staff} onChange={(v) => patch({ staff: v })} />
              <NumberField id="be-util" label="ค่าน้ำ ไฟ เน็ต" prefix="฿" value={s.utilities} onChange={(v) => patch({ utilities: v })} />
              <NumberField id="be-other" label="อื่นๆ (การตลาด ผ่อนอุปกรณ์)" prefix="฿" value={s.other} onChange={(v) => patch({ other: v })} />
              <div className="col-span-2 flex items-baseline justify-between rounded-[0.875rem] bg-lab-surface2 px-3.5 py-2.5">
                <span className="text-[13px] font-semibold text-lab-muted">รวมค่าใช้จ่ายคงที่</span>
                <span className="lab-num text-[17px] font-semibold">{fmtBaht(fixed)}</span>
              </div>
            </div>
          ) : (
            <NumberField
              id="be-fixed"
              label="ค่าใช้จ่ายคงที่ต่อเดือน"
              help="ต้องจ่ายแม้ไม่มีลูกค้าเลย เช่น ค่าเช่า เงินเดือน ค่าน้ำไฟ"
              prefix="฿"
              suffix="/เดือน"
              value={s.fixed}
              onChange={(v) => patch({ fixed: v })}
            />
          )}
          <SwitchRow
            id="be-split"
            label="ช่วยแยกรายการ"
            help="กันลืมค่าใช้จ่ายที่มักตกหล่น"
            checked={s.split}
            onChange={(v) => patchRaw({ split: v, ...(v && s.rent === null && s.staff === null ? { rent: null, staff: s.fixed, utilities: null, other: null } : {}), ...(!v ? { fixed } : {}) })}
          />
          <NumberField id="be-days" label="เปิดขายกี่วันต่อเดือน" suffix="วัน" decimals={0} max={31} value={s.days} onChange={(v) => patch({ days: v })} />
        </div>
      </Panel>

      <Panel>
        <Disclosure summary={<span>เทียบกับยอดขายจริง และกำไรที่อยากได้ <span className="font-normal text-lab-muted">(ไม่บังคับ)</span></span>} defaultOpen>
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="be-current" label="ตอนนี้ขายได้วันละ" suffix={noun} value={s.current} onChange={(v) => patch({ current: v })} />
            <NumberField id="be-target" label="อยากได้กำไรเดือนละ" prefix="฿" value={s.target} onChange={(v) => patch({ target: v })} />
          </div>
        </Disclosure>
      </Panel>
    </>
  );

  const results = !r.ok ? (
    <NeedInput
      title={r.reason === "no-margin" ? "ราคาขายต้องสูงกว่าต้นทุนต่อชิ้น" : r.reason === "no-days" ? "ใส่จำนวนวันที่เปิดขาย" : "ใส่ราคาขายเพื่อเริ่มคำนวณ"}
      body={
        r.reason === "no-margin"
          ? `ตอนนี้ขายหนึ่ง${noun}ได้ ${fmtBaht(input.price)} แต่ต้นทุน ${fmtBaht(input.unitCost)} ยิ่งขายมากยิ่งขาดทุน จึงไม่มีจุดคุ้มทุน`
          : "ตัวเลขจะคำนวณทันทีที่กรอกครบ"
      }
    />
  ) : (
    <>
      <ResultHero
        label="ต้องขายอย่างน้อย"
        value={fmtNum(r.unitsDay)}
        unit={`${noun} / วัน`}
        sentence={
          <>
            หรือ {fmtNum(r.unitsMonth)} {noun}ต่อเดือน (เปิด {input.daysOpen} วัน) คิดเป็นยอดขาย <b>{fmtBaht(r.revenueMonth)}</b> ต่อเดือน
          </>
        }
        status={
          r.current
            ? r.current.profitMonth >= 0
              ? { tone: "good", text: `ตอนนี้กำไร ${fmtBaht(r.current.profitMonth)}/เดือน` }
              : { tone: "bad", text: `ตอนนี้ขาดทุน ${fmtBaht(-r.current.profitMonth)}/เดือน` }
            : undefined
        }
      />
      <StatGrid>
        <Stat label={`กำไรต่อ${noun} ก่อนหักค่าใช้จ่ายคงที่`} value={fmtBaht(r.contribution, r.contribution % 1 ? 2 : 0)} sub={`${fmtPct(r.contributionRatio)} ของราคาขาย`} />
        <Stat label="ยอดขายขั้นต่ำต่อวัน" value={fmtBaht(r.revenueDay)} sub={`จากค่าใช้จ่ายคงที่ ${fmtBaht(fixed)}`} />
        {r.target ? (
          <Stat label={<>ถ้าอยากได้กำไร <span className="whitespace-nowrap">{fmtBaht(input.targetProfit!)}/เดือน</span></>} value={`${fmtNum(r.target.unitsDay)} ${noun}/วัน`} sub={`ยอดขาย ${fmtBaht(r.target.revenueMonth)}/เดือน`} />
        ) : (
          <Stat label="ต้องขายต่อเดือน" value={`${fmtNum(r.unitsMonth)} ${noun}`} />
        )}
        {r.current ? (
          <Stat
            label={<>ตอนนี้ขายได้ <span className="whitespace-nowrap">วันละ {fmtNum(input.currentDaily!)} {noun}</span></>}
            value={r.current.gapPerDay > 0 ? `ขาดอีก ${fmtNum(Math.ceil(r.current.gapPerDay - 1e-9))}/วัน` : `เกินมา ${fmtNum(Math.floor(-r.current.gapPerDay + 1e-9))}/วัน`}
            tone={r.current.gapPerDay > 0 ? "bad" : undefined}
            sub={r.current.gapPerDay > 0 ? "ยังต่ำกว่าจุดคุ้มทุน" : "สูงกว่าจุดคุ้มทุน"}
          />
        ) : (
          <Stat label="เปิดขายต่อเดือน" value={`${input.daysOpen} วัน`} />
        )}
      </StatGrid>

      <BreakEvenChart price={input.price} unitCost={input.unitCost} fixed={fixed} days={input.daysOpen} beDay={r.unitsDayExact} currentDaily={input.currentDaily} noun={noun} />

      {shifted && shifted.ok && (
        <Panel title="ลองขยับราคา">
          <SliderField
            id="be-shift"
            label="ปรับราคาขาย"
            min={-30}
            max={30}
            step={1}
            value={priceShift}
            onChange={setPriceShift}
            format={(v) => `${v > 0 ? "+" : ""}${v}% · ${fmtBaht(input.price * (1 + v / 100), input.price * (1 + v / 100) % 1 ? 2 : 0)}`}
            ends={["ลด 30%", "ขึ้น 30%"]}
          />
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Stat label="จุดคุ้มทุนใหม่" value={`${fmtNum(shifted.unitsDay)} ${noun}/วัน`} />
            <Stat
              label="เทียบกับตอนนี้"
              value={shifted.unitsDay === r.unitsDay ? "เท่าเดิม" : `${shifted.unitsDay < r.unitsDay ? "น้อยลง" : "มากขึ้น"} ${fmtNum(Math.abs(shifted.unitsDay - r.unitsDay))}`}
              sub={shifted.unitsDay === r.unitsDay ? undefined : `${noun}ต่อวัน`}
            />
          </div>
        </Panel>
      )}
      {shifted && !shifted.ok && (
        <Panel title="ลองขยับราคา">
          <SliderField id="be-shift" label="ปรับราคาขาย" min={-30} max={30} value={priceShift} onChange={setPriceShift} format={(v) => `${v > 0 ? "+" : ""}${v}%`} ends={["ลด 30%", "ขึ้น 30%"]} />
          <p className="mt-3 text-[13px] text-lab-danger">ราคานี้ต่ำกว่าต้นทุนต่อชิ้น ขายเท่าไหร่ก็ไม่คุ้มทุน</p>
        </Panel>
      )}

      <Insights items={insights} />

      <Formulas
        lines={[
          { label: `กำไรต่อ${noun}`, formula: "ราคาขาย − ต้นทุนต่อชิ้น", worked: `${fmtNum(input.price, 2)} − ${fmtNum(input.unitCost, 2)} = ${fmtNum(r.contribution, 2)} บาท` },
          { label: "จุดคุ้มทุนต่อเดือน", formula: `ค่าใช้จ่ายคงที่ ÷ กำไรต่อ${noun}`, worked: `${fmtNum(fixed)} ÷ ${fmtNum(r.contribution, 2)} = ${fmtNum(r.unitsMonthExact, 1)} ${noun}` },
          { label: "จุดคุ้มทุนต่อวัน", formula: "จุดคุ้มทุนต่อเดือน ÷ วันที่เปิด แล้วปัดขึ้น", worked: `${fmtNum(r.unitsMonthExact, 1)} ÷ ${input.daysOpen} = ${fmtNum(r.unitsDayExact, 2)} → ${fmtNum(r.unitsDay)} ${noun}` },
          { label: "ยอดขายขั้นต่ำต่อเดือน", formula: "จุดคุ้มทุนต่อเดือน × ราคาขาย", worked: `${fmtNum(r.unitsMonthExact, 1)} × ${fmtNum(input.price, 2)} = ${fmtBaht(r.revenueMonth)}` },
        ]}
        note="คำนวณแบบทุกชิ้นราคาเดียวกัน ถ้าขายหลายเมนู ให้ใช้ราคาเฉลี่ยต่อบิลและต้นทุนเฉลี่ยต่อบิลแทน"
      />

      <div className="flex flex-wrap items-center gap-2">
        <CopyButton text={summary} />
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2">
        <NextStep
          title="ตั้งราคาให้กำไรมากขึ้น"
          body={`เอาต้นทุน ${fmtBaht(input.unitCost)} ไปหาราคาที่ควรขาย`}
          onClick={() => navigate(toolPath("pricing"), { state: { prefill: { productCost: input.unitCost, extraCost: 0, mode: "target" }, from: "จุดคุ้มทุน" } })}
        />
        <NextStep
          title="ถ้าจัดโปรลดราคา คุ้มไหม"
          body="ใช้ราคาและต้นทุนนี้คำนวณยอดที่ต้องขายเพิ่ม"
          onClick={() =>
            navigate(toolPath("promo"), {
              state: { prefill: { price: input.price, unitCost: input.unitCost, noun, baseUnits: input.currentDaily ? Math.round(input.currentDaily * input.daysOpen) : r.unitsMonth }, from: "จุดคุ้มทุน" },
            })
          }
        />
      </div>
    </>
  );

  return (
    <ToolLayout
      toolId="break-even"
      presets={Object.entries(PRESETS).map(([id, p]) => ({ id, label: p.label }))}
      activePreset={s.preset}
      onPreset={(id) => setS(withPreset(id))}
      onReset={() => setS({ ...EMPTY })}
      inputs={inputs}
      results={results}
      bar={r.ok ? { label: "ต้องขายอย่างน้อย", value: `${fmtNum(r.unitsDay)} ${noun}/วัน` } : null}
    />
  );
};

export default BreakEven;
