import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ToolLayout from "../components/ToolLayout";
import { Chips, NumberField, Panel, Segmented, SliderField } from "../components/fields";
import { CopyButton, Formulas, InsightItem, Insights, NeedInput, NextStep, ResultHero, Stat, StatGrid } from "../components/results";
import PromoCurve from "../components/charts/PromoCurve";
import { CompareBars } from "../components/charts/Bars";
import { ChartCard } from "../components/charts/core";
import { useToast } from "../components/Toast";
import { maxDiscountFor, promo, type PromoInput, type PromoType } from "../lib/calc/promo";
import { fmtBaht, fmtNum, fmtNumMax, fmtPct, num } from "../lib/format";
import { useLabState } from "../lib/storage";
import { useHandoff, useRecent } from "../lib/hooks";
import { toolPath } from "../paths";

type State = {
  preset: string | null;
  noun: string;
  price: number | null;
  unitCost: number | null;
  baseUnits: number | null;
  type: PromoType;
  percent: number | null;
  baht: number | null;
  buyX: number | null;
  getY: number | null;
  lift: number;
};

const EMPTY: State = { preset: null, noun: "ชิ้น", price: null, unitCost: null, baseUnits: null, type: "percent", percent: 20, baht: null, buyX: 1, getY: 1, lift: 30 };
const PRESETS: Record<string, { label: string; values: Partial<State> }> = {
  sale: { label: "ลด 20% วันเซล", values: { noun: "ชิ้น", price: 290, unitCost: 150, baseUnits: 300, type: "percent", percent: 20, lift: 50 } },
  bogo: { label: "ซื้อ 1 แถม 1", values: { noun: "แก้ว", price: 120, unitCost: 35, baseUnits: 400, type: "bxgy", buyX: 1, getY: 1, lift: 60 } },
  coupon: { label: "คูปองลด 50 บาท", values: { noun: "ชิ้น", price: 590, unitCost: 260, baseUnits: 120, type: "baht", baht: 50, lift: 25 } },
};
const withPreset = (id: string): State => ({ ...EMPTY, ...PRESETS[id].values, preset: id });
const NOUNS = ["ชิ้น", "แก้ว", "จาน", "ชุด", "ครั้ง"];
const money = (n: number) => fmtBaht(n, Math.abs(n) < 1000 && Math.round(n * 100) % 100 !== 0 ? 2 : 0);

const Promo = () => {
  const [s, setS, patchRaw] = useLabState<State>("promo", withPreset("sale"));
  const toast = useToast();
  const navigate = useNavigate();
  const patch = (p: Partial<State>) => patchRaw({ ...p, preset: null });
  useHandoff<State>((p, from) => {
    patchRaw({ ...p, preset: null });
    toast(`ใส่ตัวเลขจาก “${from}” ให้แล้ว`);
  });

  const noun = s.noun || "ชิ้น";
  const input: PromoInput = {
    price: num(s.price),
    unitCost: num(s.unitCost),
    baseUnits: num(s.baseUnits),
    type: s.type,
    percent: num(s.percent),
    baht: num(s.baht),
    buyX: num(s.buyX, 1),
    getY: num(s.getY, 1),
    expectedLiftPct: s.lift,
  };
  const r = useMemo(() => promo(input), [JSON.stringify(input)]);
  const maxWorth = r.ok ? maxDiscountFor(input.price, input.unitCost, s.lift) : null;
  const promoLabel =
    s.type === "percent" ? `ลด ${fmtNumMax(input.percent, 1)}%` : s.type === "baht" ? `ลด ${money(input.baht)}` : `ซื้อ ${fmtNum(input.buyX)} แถม ${fmtNum(input.getY)}`;

  useRecent("promo", r.ok ? (r.requiredLift === null ? `${promoLabel} ขาดทุน` : `${promoLabel} ต้องขาย +${fmtPct(r.requiredLift, 0)}`) : null);

  const insights: InsightItem[] = [];
  if (r.ok) {
    if (s.type !== "percent") {
      insights.push({
        tone: "tip",
        title: `${promoLabel} เท่ากับลดราคา ${fmtPct(r.effectiveDiscount)}`,
        body: s.type === "bxgy" ? `ลูกค้าได้ของ ${fmtNum(input.buyX + input.getY)} ${noun} จ่ายเงินแค่ ${fmtNum(input.buyX)} ${noun} รายได้ต่อ${noun}ที่ส่งออกไปจึงเหลือ ${money(r.promoPrice)}` : `ราคาหลังใช้คูปองคือ ${money(r.promoPrice)} ต่อ${noun}`,
      });
    }
    if (r.verdict === "not-worth" && maxWorth !== null && maxWorth > 0) {
      insights.push({
        tone: "warn",
        title: `ถ้าคาดว่าขายเพิ่มได้ ${s.lift}% ควรลดไม่เกิน ${fmtPct(maxWorth)}`,
        body: `ส่วนลดที่ลึกกว่านั้นทำให้กำไรเดือนนี้น้อยกว่าเดือนปกติ (${promoLabel} เท่ากับลด ${fmtPct(r.effectiveDiscount)})`,
      });
    }
    if (r.verdict === "worth") {
      insights.push({ tone: "good", title: `คุ้ม ถ้าขายเพิ่มได้ ${s.lift}% จริง`, body: `กำไรเดือนจัดโปรมากกว่าเดือนปกติ ${money(r.profitDiff)} ลองเช็กว่าสต็อกและคนพอรองรับยอดที่เพิ่มขึ้นไหม` });
    }
    if (r.verdict === "loss-per-unit") {
      insights.push({ tone: "bad", title: "ราคาหลังลดต่ำกว่าต้นทุน", body: `ทุก${noun}ที่ขายออกไปขาดทุน ${money(-r.promoProfitPerUnit)} ยิ่งขายดียิ่งเสียเงิน ใช้ได้เฉพาะเมื่อตั้งใจซื้อลูกค้าใหม่และคุมจำนวนได้` });
    }
    insights.push({ tone: "tip", title: "ตัวเลขนี้คิดเฉพาะเดือนที่จัดโปร", body: "ถ้าโปรดึงลูกค้าใหม่ที่กลับมาซื้อซ้ำในราคาปกติ ผลระยะยาวอาจดีกว่าที่เห็นตรงนี้" });
  }

  const summary = () =>
    r.ok
      ? [
          "ลดราคาคุ้มไหม · Jarua Business Lab",
          `ราคาปกติ ${money(input.price)} · ต้นทุน ${money(input.unitCost)}/${noun} · ขายปกติ ${fmtNum(input.baseUnits)} ${noun}/เดือน`,
          `โปร: ${promoLabel} (เท่ากับลด ${fmtPct(r.effectiveDiscount)})`,
          r.requiredLift === null ? "ราคาหลังลดต่ำกว่าต้นทุน ขาดทุนทุกชิ้น" : `ต้องขายเพิ่ม ${fmtPct(r.requiredLift, 0)} (${fmtNum(r.requiredUnits!)} ${noun}) ถึงได้กำไรเท่าเดิม`,
          `ถ้าขายเพิ่ม ${s.lift}%: กำไร ${money(r.promoProfit)} เทียบกับปกติ ${money(r.baseProfit)}`,
        ].join("\n")
      : "";

  const inputs = (
    <>
      <Panel title="สินค้าที่จะจัดโปร">
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-[14px] font-semibold">เรียกสิ่งที่ขายว่า</p>
            <Chips label="หน่วยที่ขาย" value={noun} onChange={(v) => patchRaw({ noun: v })} options={NOUNS.map((n) => ({ value: n, label: n }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="pm-price" label="ราคาปกติ" prefix="฿" value={s.price} onChange={(v) => patch({ price: v })} />
            <NumberField id="pm-cost" label={`ต้นทุนต่อ${noun}`} prefix="฿" value={s.unitCost} onChange={(v) => patch({ unitCost: v })} />
          </div>
          <NumberField id="pm-units" label="เดือนปกติขายได้" suffix={`${noun}/เดือน`} decimals={0} value={s.baseUnits} onChange={(v) => patch({ baseUnits: v })} />
        </div>
      </Panel>
      <Panel title="รูปแบบโปร">
        <div className="space-y-5">
          <Segmented<PromoType>
            label="รูปแบบโปร"
            value={s.type}
            onChange={(v) => patch({ type: v })}
            options={[
              { value: "percent", label: "ลด %" },
              { value: "baht", label: "ลดเป็นบาท" },
              { value: "bxgy", label: "ซื้อ X แถม Y" },
            ]}
          />
          {s.type === "percent" && <NumberField id="pm-pct" label="ลดกี่ %" suffix="%" max={100} value={s.percent} onChange={(v) => patch({ percent: v })} />}
          {s.type === "baht" && <NumberField id="pm-baht" label={`ลดกี่บาทต่อ${noun}`} prefix="฿" value={s.baht} onChange={(v) => patch({ baht: v })} />}
          {s.type === "bxgy" && (
            <div className="grid grid-cols-2 gap-3">
              <NumberField id="pm-x" label="ซื้อ" suffix={noun} decimals={0} min={1} value={s.buyX} onChange={(v) => patch({ buyX: v })} />
              <NumberField id="pm-y" label="แถม" suffix={noun} decimals={0} value={s.getY} onChange={(v) => patch({ getY: v })} />
            </div>
          )}
          <SliderField
            id="pm-lift"
            label="คาดว่าโปรนี้จะขายได้เพิ่ม"
            help={s.type === "bxgy" ? "นับจำนวนที่ส่งออกไป รวมของแถม" : "เทียบกับเดือนปกติ"}
            min={0}
            max={200}
            step={5}
            value={s.lift}
            onChange={(v) => patch({ lift: v })}
            format={(v) => `+${v}%`}
            ends={["+0%", "+200%"]}
          />
        </div>
      </Panel>
    </>
  );

  const results = !r.ok ? (
    <NeedInput
      title={r.reason === "no-margin" ? "ราคาปกติต้องสูงกว่าต้นทุน" : "ใส่ราคาปกติและต้นทุนเพื่อเริ่มคำนวณ"}
      body={r.reason === "no-margin" ? "ตอนนี้ยังไม่มีกำไรต่อชิ้นให้ลดได้" : "ผลจะขึ้นทันทีที่กรอก"}
    />
  ) : (
    <>
      <ResultHero
        label={r.requiredLift === null ? "ผลของโปรนี้" : "ต้องขายเพิ่มอย่างน้อย"}
        value={r.requiredLift === null ? "ขาดทุนทุกชิ้น" : `+${fmtPct(r.requiredLift, 0)}`}
        sentence={
          r.requiredLift === null ? (
            <>
              ราคาหลังลด {money(r.promoPrice)} ต่ำกว่าต้นทุน {money(input.unitCost)} ต่อ{noun}
            </>
          ) : (
            <>
              จาก {fmtNum(input.baseUnits)} เป็น <b>{fmtNum(r.requiredUnits!)} {noun}</b>ต่อเดือน ถึงจะได้กำไรเท่าเดือนปกติ ({money(r.baseProfit)})
            </>
          )
        }
        status={
          r.verdict === "worth"
            ? { tone: "good", text: `ขายเพิ่ม ${s.lift}% · คุ้ม` }
            : r.verdict === "even"
              ? { tone: "neutral", text: `ขายเพิ่ม ${s.lift}% · เสมอตัว` }
              : { tone: "bad", text: `ขายเพิ่ม ${s.lift}% · ไม่คุ้ม` }
        }
      />
      <ChartCard title={`กำไรต่อเดือน ถ้าขายเพิ่มได้ ${s.lift}%`} subtitle={`${promoLabel} · ต่างกัน ${r.profitDiff >= 0 ? "+" : "−"}${money(Math.abs(r.profitDiff))}`}>
        <CompareBars
          fmt={money}
          rows={[
            { label: "เดือนปกติ", value: Math.max(0, r.baseProfit), note: `${fmtNum(input.baseUnits)} ${noun} × ${money(r.baseProfitPerUnit)}` },
            { label: "เดือนจัดโปร", value: Math.max(0, r.promoProfit), highlight: true, note: `${fmtNum(Math.round(r.expectedUnits))} ${noun} × ${money(r.promoProfitPerUnit)}` },
          ]}
        />
        {r.promoProfit < 0 && <p className="mt-2 text-[12.5px] text-lab-danger">เดือนจัดโปรขาดทุน {money(-r.promoProfit)}</p>}
      </ChartCard>
      <StatGrid>
        <Stat label={`รายได้ต่อ${noun}หลังลด`} value={money(r.promoPrice)} sub={`เท่ากับลด ${fmtPct(r.effectiveDiscount)}`} />
        <Stat label={`กำไรต่อ${noun}`} value={money(r.promoProfitPerUnit)} tone={r.promoProfitPerUnit <= 0 ? "bad" : undefined} sub={`ปกติ ${money(r.baseProfitPerUnit)} (${fmtPct(r.baseMargin, 0)})`} />
        <Stat label={`ลดได้ลึกสุดที่ยังคุ้ม`} value={maxWorth !== null && maxWorth > 0 ? fmtPct(maxWorth) : "—"} sub={`ถ้าขายเพิ่มได้ ${s.lift}%`} />
        <Stat label="ลดลึกสุดก่อนขาดทุนทุกชิ้น" value={fmtPct(r.baseMargin)} sub="เท่ากับอัตรากำไรปกติ" />
      </StatGrid>
      <PromoCurve price={input.price} unitCost={input.unitCost} discount={r.effectiveDiscount} expectedLift={s.lift / 100} maxWorth={maxWorth} />
      <Insights items={insights} />
      <Formulas
        lines={[
          { label: `กำไรต่อ${noun} ปกติ`, formula: "ราคาปกติ − ต้นทุน", worked: `${fmtNum(input.price, 2)} − ${fmtNum(input.unitCost, 2)} = ${fmtNum(r.baseProfitPerUnit, 2)}` },
          {
            label: `กำไรต่อ${noun} ช่วงโปร`,
            formula: s.type === "bxgy" ? "ราคาปกติ × ซื้อ ÷ (ซื้อ + แถม) − ต้นทุน" : "ราคาหลังลด − ต้นทุน",
            worked: `${fmtNum(r.promoPrice, 2)} − ${fmtNum(input.unitCost, 2)} = ${fmtNum(r.promoProfitPerUnit, 2)}`,
          },
          ...(r.requiredLift !== null
            ? [{ label: "ยอดที่ต้องขายเพิ่ม", formula: "กำไรต่อชิ้นปกติ ÷ กำไรต่อชิ้นช่วงโปร − 1", worked: `${fmtNum(r.baseProfitPerUnit, 2)} ÷ ${fmtNum(r.promoProfitPerUnit, 2)} − 1 = ${fmtPct(r.requiredLift)}` }]
            : []),
        ]}
        note="คิดเฉพาะกำไรขั้นต้นของสินค้าที่จัดโปร ไม่รวมค่าโฆษณาโปรหรือค่าใช้จ่ายคงที่"
      />
      <div>
        <CopyButton text={summary} />
      </div>
      <NextStep
        title="ตั้งราคาใหม่แทนการลด"
        body="ดูว่าราคาแบบไหนให้กำไรตามที่ต้องการ"
        onClick={() => navigate(toolPath("pricing"), { state: { prefill: { productCost: input.unitCost, extraCost: 0, mode: "target" }, from: "ลดราคาคุ้มไหม" } })}
      />
    </>
  );

  return (
    <ToolLayout
      toolId="promo"
      presets={Object.entries(PRESETS).map(([id, p]) => ({ id, label: p.label }))}
      activePreset={s.preset}
      onPreset={(id) => setS(withPreset(id))}
      onReset={() => setS({ ...EMPTY })}
      inputs={inputs}
      results={results}
      bar={r.ok ? { label: promoLabel, value: r.requiredLift === null ? "ขาดทุนทุกชิ้น" : `ต้องขายเพิ่ม +${fmtPct(r.requiredLift, 0)}` } : null}
    />
  );
};

export default Promo;
