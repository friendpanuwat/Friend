import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ToolLayout from "../components/ToolLayout";
import { NumberField, Panel, Segmented, SliderField, SwitchRow } from "../components/fields";
import { CopyButton, Formulas, InsightItem, Insights, NeedInput, NextStep, ResultHero, Stat, StatGrid, Tone } from "../components/results";
import { StackBar, type Segment } from "../components/charts/Bars";
import { ChartCard } from "../components/charts/core";
import { useToast } from "../components/Toast";
import { breakdown, targetPrice, type PriceBreakdown, type PricingInput } from "../lib/calc/pricing";
import { fmtBaht, fmtNum, fmtPct, num } from "../lib/format";
import { useLabState } from "../lib/storage";
import { useHandoff, useRecent } from "../lib/hooks";
import { toolPath } from "../paths";

type Mode = "target" | "check";
type State = {
  preset: string | null;
  mode: Mode;
  productCost: number | null;
  extraCost: number | null;
  feePct: number | null;
  adCost: number | null;
  vat: boolean;
  vatRate: number | null;
  margin: number;
  price: number | null;
};

const EMPTY: State = { preset: null, mode: "target", productCost: null, extraCost: null, feePct: null, adCost: null, vat: false, vatRate: 7, margin: 30, price: null };

const PRESETS: Record<string, { label: string; values: Partial<State> }> = {
  online: { label: "ขายบนแพลตฟอร์มออนไลน์", values: { productCost: 120, extraCost: 15, feePct: 12, adCost: 25, vat: false, margin: 30, price: 259 } },
  cafe: { label: "เมนูคาเฟ่", values: { productCost: 22, extraCost: 4, feePct: 0, adCost: 0, vat: false, margin: 60, price: 65 } },
  b2b: { label: "ขายส่ง จด VAT", values: { productCost: 1800, extraCost: 60, feePct: 0, adCost: 0, vat: true, margin: 25, price: 2790 } },
};
const withPreset = (id: string): State => ({ ...EMPTY, ...PRESETS[id].values, preset: id });

const money = (n: number) => fmtBaht(n, Math.abs(n) < 1000 && Math.round(n * 100) % 100 !== 0 ? 2 : 0);

const segmentsFor = (b: PriceBreakdown, vat: boolean): Segment[] => [
  { key: "goods", label: "ทุนสินค้า", value: b.productCost, tone: 2 },
  { key: "extra", label: "ค่าแพ็ก / ค่าส่ง", value: b.extraCost, tone: 3 },
  { key: "fee", label: "ค่าธรรมเนียม", value: b.fee, tone: 4 },
  { key: "ad", label: "ค่าโฆษณา", value: b.adCost, tone: 3 },
  ...(vat ? [{ key: "vat", label: "VAT (นำส่งสรรพากร)", value: b.vatAmount, tone: 4 as const }] : []),
  { key: "profit", label: b.profit >= 0 ? "กำไรของคุณ" : "ขาดทุน", value: Math.max(0, b.profit), tone: 1, emphasis: true },
];

const Pricing = () => {
  const [s, setS, patchRaw] = useLabState<State>("pricing", withPreset("online"));
  const toast = useToast();
  const navigate = useNavigate();
  const patch = (p: Partial<State>) => patchRaw({ ...p, preset: null });

  useHandoff<State>((p, from) => {
    patchRaw({ ...p, preset: null });
    toast(`ใส่ตัวเลขจาก “${from}” ให้แล้ว`);
  });

  const input: PricingInput = {
    productCost: num(s.productCost),
    extraCost: num(s.extraCost),
    feePct: num(s.feePct),
    adCost: num(s.adCost),
    vat: s.vat,
    vatRate: num(s.vatRate, 7),
  };
  const key = JSON.stringify([input, s.margin, s.price, s.mode]);
  const t = useMemo(() => targetPrice(input, s.margin), [key]);
  const chk = useMemo(() => (num(s.price) > 0 ? breakdown(input, num(s.price)) : null), [key]);

  const active: PriceBreakdown | null = s.mode === "target" ? (t.ok ? t.atPretty : null) : chk;
  useRecent("pricing", s.mode === "target" ? (t.ok ? `ขาย ${fmtBaht(t.pretty)}` : null) : chk ? `กำไร ${fmtPct(chk.margin, 0)}` : null);

  const insights: InsightItem[] = [];
  const leakParts = active ? [active.fee > 0 && "ค่าธรรมเนียม", active.adCost > 0 && "ค่าแอด", active.vatAmount > 0 && "VAT"].filter(Boolean) as string[] : [];
  const leakNames = leakParts.length > 1 ? `${leakParts.slice(0, -1).join(" ")} และ ${leakParts[leakParts.length - 1]}` : leakParts[0] ?? "";
  if (active) {
    if (s.mode === "target" && t.ok && t.naive.margin < s.margin / 100 - 0.02) {
      insights.push({
        tone: "warn",
        title: `บวกเพิ่มจากทุน ${s.margin}% ไม่ได้กำไร ${s.margin}%`,
        body: `ถ้าตั้งราคาด้วยการบวกเพิ่มจากต้นทุน ${s.margin}% จะได้ราคา ${money(t.naive.price)} แต่กำไรจริงเหลือ ${fmtPct(t.naive.margin)} เพราะกำไรคิดเทียบกับราคาขาย ไม่ใช่เทียบกับทุน${leakNames ? ` และยังต้องหัก${leakNames}` : ""}`,
      });
    }
    const leak = active.fee + active.vatAmount + active.adCost;
    if (leak > 0 && active.price > 0) {
      insights.push({
        tone: "tip",
        title: `${leakNames}${leakParts.length > 1 ? " รวมกัน" : ""}กินราคาไป ${fmtPct(leak / active.price, 0)}`,
        body: `ลูกค้าจ่าย ${money(active.price)} แต่ ${money(leak)} ไม่ได้อยู่กับคุณ อย่าลืมนับส่วนนี้ทุกครั้งที่ตั้งราคาหรือจัดโปร`,
      });
    }
    if (active.breakEvenRoas !== null) {
      insights.push({
        tone: active.adCost > active.maxAdPerOrder ? "bad" : "tip",
        title: `ถ้ายิงแอด ต้องได้ ROAS อย่างน้อย ${fmtNum(active.breakEvenRoas, 2)} เท่า`,
        body: `หมายถึงทุก 1 บาทค่าแอดต้องกลับมาเป็นยอดขาย ${fmtNum(active.breakEvenRoas, 2)} บาท หรือค่าแอดต่อออเดอร์ไม่เกิน ${money(active.maxAdPerOrder)} ถ้าต่ำกว่านี้คือขาดทุน`,
      });
    } else {
      insights.push({ tone: "bad", title: "ราคานี้ไม่พอแม้ยังไม่จ่ายค่าแอด", body: "ทุนสินค้า ค่าแพ็ก ค่าธรรมเนียม และ VAT รวมกันเกินราคาขายแล้ว" });
    }
  }

  const status = (b: PriceBreakdown): { tone: Tone; text: string } =>
    b.profit < 0 ? { tone: "bad", text: "ขาดทุนทุกชิ้น" } : b.margin < 0.15 ? { tone: "warn", text: "กำไรบาง" } : b.margin < 0.3 ? { tone: "neutral", text: "กำไรพอใช้" } : { tone: "good", text: "กำไรดี" };

  const summary = () => {
    if (!active) return "";
    return [
      "ตั้งราคาขาย · Jarua Business Lab",
      `ทุนสินค้า ${money(input.productCost)} + ค่าแพ็ก/ส่ง ${money(input.extraCost)} · ค่าธรรมเนียม ${input.feePct}% · ค่าแอด ${money(input.adCost)}/ออเดอร์${input.vat ? ` · รวม VAT ${input.vatRate}%` : ""}`,
      s.mode === "target" && t.ok ? `ราคาขั้นต่ำเพื่อกำไร ${s.margin}%: ${money(t.exact)} → แนะนำ ${fmtBaht(t.pretty)}` : `ราคาขาย ${money(active.price)}`,
      `กำไรต่อชิ้น ${money(active.profit)} (${fmtPct(active.margin)})`,
      active.breakEvenRoas ? `ROAS ขั้นต่ำ ${fmtNum(active.breakEvenRoas, 2)} เท่า` : "",
    ]
      .filter(Boolean)
      .join("\n");
  };

  const inputs = (
    <>
      <Segmented<Mode>
        label="สิ่งที่อยากรู้"
        value={s.mode}
        onChange={(v) => patchRaw({ mode: v })}
        options={[
          { value: "target", label: "หาราคาที่ควรขาย" },
          { value: "check", label: "เช็กกำไรจากราคาเดิม" },
        ]}
      />
      <Panel title="ต้นทุนต่อชิ้น">
        <div className="grid grid-cols-2 gap-3">
          <NumberField id="pr-cost" label="ทุนสินค้า" prefix="฿" value={s.productCost} onChange={(v) => patch({ productCost: v })} />
          <NumberField id="pr-extra" label="ค่าแพ็ก / ค่าส่ง" prefix="฿" value={s.extraCost} onChange={(v) => patch({ extraCost: v })} />
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-lab-muted">ค่าแพ็ก/ค่าส่ง = กล่อง ถุง สติกเกอร์ และค่าส่งที่ร้านออกให้ลูกค้า</p>
      </Panel>
      <Panel title="ค่าใช้จ่ายที่ตามมากับการขาย">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <NumberField id="pr-fee" label="ค่าธรรมเนียม" suffix="% ของราคา" value={s.feePct} max={90} onChange={(v) => patch({ feePct: v })} />
            <NumberField id="pr-ad" label="ค่าแอดต่อออเดอร์" prefix="฿" value={s.adCost} onChange={(v) => patch({ adCost: v })} />
          </div>
          <p className="-mt-2 text-[12.5px] leading-relaxed text-lab-muted">
            ค่าธรรมเนียม = ค่าคอมมิชชันและค่าชำระเงินของแพลตฟอร์ม หรือค่าธรรมเนียมบัตร (เช็กอัตราล่าสุดของช่องทางที่คุณขาย) · ค่าแอดต่อออเดอร์ = ค่าแอดทั้งเดือน ÷ จำนวนออเดอร์
          </p>
          <SwitchRow id="pr-vat" label="จดทะเบียน VAT" help={`ราคาที่ลูกค้าจ่ายรวม VAT ${num(s.vatRate, 7)}% ซึ่งคุณต้องนำส่งสรรพากร`} checked={s.vat} onChange={(v) => patch({ vat: v })} />
        </div>
      </Panel>
      <Panel title={s.mode === "target" ? "กำไรที่ต้องการ" : "ราคาที่ตั้งไว้"}>
        {s.mode === "target" ? (
          <SliderField
            id="pr-margin"
            label="กำไรต่อชิ้น"
            help="คิดเป็น % ของราคาขาย (หลังหัก VAT) หลังหักทุกอย่างข้างบนแล้ว"
            min={0}
            max={80}
            value={s.margin}
            onChange={(v) => patch({ margin: v })}
            format={(v) => `${v}%`}
            ends={["0%", "80%"]}
          />
        ) : (
          <NumberField id="pr-price" label="ราคาที่ลูกค้าจ่าย" help={s.vat ? "รวม VAT แล้ว" : undefined} prefix="฿" value={s.price} onChange={(v) => patch({ price: v })} />
        )}
      </Panel>
    </>
  );

  let results: React.ReactNode;
  if (s.mode === "target" && !t.ok) {
    results =
      t.reason === "no-cost" ? (
        <NeedInput title="ใส่ทุนสินค้าเพื่อเริ่มคำนวณ" body="ราคาที่แนะนำจะขึ้นทันทีที่กรอก" />
      ) : (
        <NeedInput title={`กำไร ${s.margin}% เป็นไปไม่ได้กับค่าธรรมเนียมนี้`} body={`ค่าธรรมเนียม ${input.feePct}%${input.vat ? " และ VAT" : ""} รวมกับกำไรที่ตั้งไว้เกิน 100% ของราคาแล้ว ลองลดกำไรที่ต้องการลง`} />
      );
  } else if (s.mode === "check" && !chk) {
    results = <NeedInput title="ใส่ราคาที่ตั้งไว้" body="แล้วดูว่าแต่ละชิ้นเหลือกำไรจริงเท่าไหร่" />;
  } else if (active) {
    const st = status(active);
    results = (
      <>
        {s.mode === "target" && t.ok ? (
          <ResultHero
            label="ราคาที่แนะนำ"
            value={fmtBaht(t.pretty)}
            sentence={
              <>
                ราคาต่ำสุดที่ได้กำไร {s.margin}% คือ <b>{money(t.exact)}</b> ปัดเป็นราคาที่ดูตั้งใจแล้วได้กำไรชิ้นละ <b>{money(active.profit)}</b> ({fmtPct(active.margin)})
              </>
            }
            status={st}
          />
        ) : (
          <ResultHero
            label="กำไรต่อชิ้น"
            value={money(active.profit)}
            sentence={
              <>
                ขาย {money(active.price)} {input.vat ? "(รวม VAT) " : ""}เหลือกำไร <b>{fmtPct(active.margin)}</b> ของราคาขาย{input.vat ? "หลังหัก VAT" : ""}
              </>
            }
            status={st}
          />
        )}
        <ChartCard title={`ลูกค้าจ่าย ${money(active.price)} ไปอยู่ที่ไหนบ้าง`} subtitle="แต่ละช่องคือส่วนของราคาขาย เรียงจากซ้ายไปขวา">
          <StackBar
            segments={segmentsFor(active, input.vat)}
            total={active.price}
            fmt={money}
            footnote={active.profit < 0 ? <span className="text-lab-danger">ต้นทุนรวมเกินราคาขาย {money(-active.profit)} ต่อชิ้น</span> : undefined}
          />
        </ChartCard>
        <StatGrid>
          <Stat label="บวกเพิ่มจากทุน (markup)" value={fmtPct(active.markup, 0)} sub="เทียบราคาหลัง VAT กับทุนสินค้า + ค่าแพ็ก" />
          <Stat label="ราคาเท่ากับทุนสินค้า" value={`${fmtNum(active.costMultiple, 2)} เท่า`} sub="ราคาที่ลูกค้าจ่าย ÷ ทุนสินค้า" />
          <Stat label="ค่าแอดต่อออเดอร์ได้ไม่เกิน" value={money(Math.max(0, active.maxAdPerOrder))} tone={active.maxAdPerOrder <= 0 ? "bad" : undefined} sub="เกินกว่านี้ขายแล้วขาดทุน" />
          <Stat label="ROAS ขั้นต่ำ" value={active.breakEvenRoas ? `${fmtNum(active.breakEvenRoas, 2)} เท่า` : "—"} sub="ยอดขาย ÷ ค่าแอด" />
        </StatGrid>
        <Insights items={insights} />
        <Formulas
          lines={[
            ...(s.mode === "target" && t.ok
              ? [
                  {
                    label: "ราคาขั้นต่ำ",
                    formula: `(ทุน + ค่าแพ็ก + ค่าแอด) ÷ ((1 − กำไร%)${input.vat ? ` ÷ ${1 + input.vatRate / 100}` : ""} − ค่าธรรมเนียม%)`,
                    worked: `${fmtNum(input.productCost + input.extraCost + input.adCost, 2)} ÷ ((1 − ${s.margin / 100})${input.vat ? ` ÷ ${1 + input.vatRate / 100}` : ""} − ${input.feePct / 100}) = ${fmtNum(t.exact, 2)}`,
                  },
                ]
              : []),
            {
              label: "กำไรต่อชิ้น",
              formula: `ราคา${input.vat ? " ÷ VAT" : ""} − ค่าธรรมเนียม − ทุน − ค่าแพ็ก − ค่าแอด`,
              worked: `${fmtNum(active.netPrice, 2)} − ${fmtNum(active.fee, 2)} − ${fmtNum(active.productCost, 2)} − ${fmtNum(active.extraCost, 2)} − ${fmtNum(active.adCost, 2)} = ${fmtNum(active.profit, 2)}`,
            },
            { label: "กำไร (%)", formula: `กำไรต่อชิ้น ÷ ราคา${input.vat ? "หลังหัก VAT" : ""}`, worked: `${fmtNum(active.profit, 2)} ÷ ${fmtNum(active.netPrice, 2)} = ${fmtPct(active.margin)}` },
            ...(active.breakEvenRoas ? [{ label: "ROAS ขั้นต่ำ", formula: "ราคาที่ลูกค้าจ่าย ÷ กำไรก่อนหักค่าแอด", worked: `${fmtNum(active.price, 2)} ÷ ${fmtNum(active.maxAdPerOrder, 2)} = ${fmtNum(active.breakEvenRoas, 2)}` }] : []),
          ]}
          note="ค่าธรรมเนียมคิดจากราคาที่ลูกค้าจ่าย (รวม VAT) ตามที่แพลตฟอร์มส่วนใหญ่คิด"
        />
        <div>
          <CopyButton text={summary} />
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <NextStep
            title="ราคานี้ต้องขายวันละเท่าไหร่"
            body="เอาราคาและต้นทุนไปหาจุดคุ้มทุน"
            onClick={() =>
              navigate(toolPath("break-even"), {
                state: {
                  prefill: { price: Math.round(active.netPrice * 100) / 100, unitCost: Math.round((active.productCost + active.extraCost + active.fee + active.adCost) * 100) / 100, noun: "ชิ้น" },
                  from: "ตั้งราคาขาย",
                },
              })
            }
          />
          <NextStep
            title="ลดราคาจากราคานี้คุ้มไหม"
            body="ดูว่าจัดโปรแล้วต้องขายเพิ่มเท่าไหร่"
            onClick={() =>
              navigate(toolPath("promo"), {
                state: { prefill: { price: Math.round(active.netPrice * 100) / 100, unitCost: Math.round((active.productCost + active.extraCost + active.fee + active.adCost) * 100) / 100 }, from: "ตั้งราคาขาย" },
              })
            }
          />
        </div>
      </>
    );
  }

  const barValue = s.mode === "target" ? (t.ok ? { label: "ราคาที่แนะนำ", value: `${fmtBaht(t.pretty)} · กำไร ${fmtPct(t.atPretty.margin, 0)}` } : null) : chk ? { label: "กำไรต่อชิ้น", value: `${money(chk.profit)} · ${fmtPct(chk.margin, 0)}` } : null;

  return (
    <ToolLayout
      toolId="pricing"
      presets={Object.entries(PRESETS).map(([id, p]) => ({ id, label: p.label }))}
      activePreset={s.preset}
      onPreset={(id) => setS({ ...withPreset(id), mode: s.mode })}
      onReset={() => setS({ ...EMPTY, mode: s.mode })}
      inputs={inputs}
      results={results}
      bar={barValue}
    />
  );
};

export default Pricing;
