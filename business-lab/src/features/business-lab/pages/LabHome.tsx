import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Clock, FlaskConical, FunctionSquare, Lock, Search, SearchX, X, Zap } from "lucide-react";
import { LabNavbar } from "../components/LabHeader";
import { useToast } from "../components/Toast";
import { Phrase, plain } from "../components/Phrase";
import { GROUP_LABEL, LIVE_TOOLS, TOOLS, ToolGroup, getTool, type LabTool } from "../registry";
import { breakEven } from "../lib/calc/breakEven";
import { fmtNum } from "../lib/format";
import { getRecents, type RecentEntry } from "../lib/storage";
import { SAMPLES } from "../samples";
import { BLOCKS } from "../lib/canvasModel";
import { toolPath } from "../paths";

type Filter = "all" | ToolGroup;

// ───────────────────────── Hero demo ─────────────────────────

const MiniField = ({ id, label, value, onChange, prefix, suffix }: { id: string; label: string; value: number; onChange: (n: number) => void; prefix?: string; suffix?: string }) => (
  <label htmlFor={id} className="block">
    <span className="mb-1 block text-[12px] font-semibold text-lab-muted">{label}</span>
    <span className="flex h-11 items-center rounded-[0.8rem] border border-lab-border bg-lab-surface px-3 focus-within:border-lab-fg">
      {prefix && <span className="mr-1 text-[15px] text-lab-muted">{prefix}</span>}
      <input
        id={id}
        inputMode="numeric"
        value={value ? value.toLocaleString("en-US") : ""}
        placeholder="0"
        onChange={(e) => {
          const n = Number(e.target.value.replace(/[^\d]/g, ""));
          onChange(Number.isFinite(n) ? n : 0);
        }}
        onFocus={(e) => {
          const t = e.currentTarget;
          requestAnimationFrame(() => t.select());
        }}
        className="lab-num lab-tnum w-full min-w-0 bg-transparent text-[16px] font-medium outline-none"
      />
      {suffix && <span className="ml-1 shrink-0 text-[12px] text-lab-muted">{suffix}</span>}
    </span>
  </label>
);

const HeroDemo = () => {
  const [price, setPrice] = useState(55);
  const [cost, setCost] = useState(22);
  const [fixed, setFixed] = useState(45000);
  const navigate = useNavigate();
  const r = breakEven({ price, unitCost: cost, fixedMonthly: fixed, daysOpen: 26 });
  return (
    <div className="rounded-lab-card border border-lab-border bg-lab-bg p-4 shadow-[var(--lab-shadow)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-semibold">ลองเลย · ร้านกาแฟต้องขายวันละกี่แก้ว</p>
        <span className="rounded-full border border-lab-border px-2 py-0.5 text-[11px] font-medium text-lab-muted">ตัวอย่าง</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <MiniField id="demo-price" label="ราคาต่อแก้ว" prefix="฿" value={price} onChange={setPrice} />
        <MiniField id="demo-cost" label="ต้นทุนต่อแก้ว" prefix="฿" value={cost} onChange={setCost} />
        <div className="col-span-2">
          <MiniField id="demo-fixed" label="ค่าเช่า + เงินเดือน + ค่าน้ำไฟ ต่อเดือน" prefix="฿" value={fixed} onChange={setFixed} />
        </div>
      </div>
      <div className="mt-4 rounded-[1rem] bg-lab-strong p-4 text-lab-strong-fg" aria-live="polite">
        {r.ok ? (
          <>
            <p className="text-[12px] font-semibold opacity-70">เปิด 26 วันต่อเดือน ต้องขายอย่างน้อย</p>
            <p className="lab-num mt-1 flex items-baseline gap-2 leading-none">
              <span className="text-[44px] font-semibold tracking-tight">{fmtNum(r.unitsDay)}</span>
              <span className="text-[16px] font-medium opacity-80">แก้ว / วัน</span>
            </p>
          </>
        ) : (
          <p className="py-3 text-[14px] font-semibold">{r.reason === "no-margin" ? "ราคาต้องสูงกว่าต้นทุนต่อแก้ว" : "ใส่ราคาขายต่อแก้ว"}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => navigate(toolPath("break-even"), { state: { prefill: { price, unitCost: cost, fixed, days: 26, noun: "แก้ว" }, from: "หน้า Business Lab" } })}
        className="mt-3 flex w-full items-center justify-between gap-2 rounded-full px-1 py-1 text-[13px] font-semibold text-lab-fg"
      >
        <span>ดูละเอียด กราฟ และวิธีให้ถึงเป้า</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lab-surface2">
          <ArrowRight className="h-4 w-4" />
        </span>
      </button>
    </div>
  );
};

// ───────────────────────── Cards ─────────────────────────

// Miniature of the canvas layout for the wide planning card.
const MINI: Record<string, string> = {
  partners: "col-[1/3] row-[1/3]",
  activities: "col-[3/5] row-[1/2]",
  resources: "col-[3/5] row-[2/3]",
  value: "col-[5/7] row-[1/3]",
  relationships: "col-[7/9] row-[1/2]",
  channels: "col-[7/9] row-[2/3]",
  customers: "col-[9/11] row-[1/3]",
  costs: "col-[1/6] row-[3/4]",
  revenue: "col-[6/11] row-[3/4]",
};
const MiniCanvas = () => (
  <div aria-hidden className="grid h-[132px] w-[260px] grid-cols-10 grid-rows-[1fr_1fr_0.8fr] gap-[3px] rounded-[0.9rem] border border-lab-border bg-lab-border p-0 overflow-hidden">
    {BLOCKS.map((b, i) => (
      <div key={b.key} className={`${MINI[b.key]} flex flex-col gap-1 bg-lab-bg p-1.5`}>
        <span className="lab-num text-[9px] font-semibold text-lab-subtle">{i + 1}</span>
        <span className="h-[3px] w-3/4 rounded-full bg-lab-border-strong" />
        <span className="h-[3px] w-1/2 rounded-full bg-lab-border-strong" />
      </div>
    ))}
  </div>
);

const ToolCard = ({ tool, recent, wide }: { tool: LabTool; recent?: RecentEntry; wide?: boolean }) => {
  const Icon = tool.icon;
  return (
    <Link
      to={toolPath(tool.id)}
      className={`group flex h-full rounded-lab-card border border-lab-border bg-lab-surface p-4 transition-colors hover:border-lab-border-strong press sm:p-5 ${
        wide ? "flex-col md:flex-row md:items-center md:gap-8" : "flex-col"
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-[0.9rem] bg-lab-surface2 text-lab-fg transition-colors group-hover:bg-lab-strong group-hover:text-lab-strong-fg">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <span className="inline-flex items-center gap-1 pt-1 text-[11.5px] font-medium text-lab-muted">
          <Clock className="h-3 w-3" /> {tool.minutes} นาที
        </span>
      </div>
      <p className="mt-4 text-[12.5px] font-semibold text-lab-muted">{tool.name}</p>
      <h3 className="mt-0.5 text-[17px] font-semibold leading-snug">
        <Phrase text={tool.question} />
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-lab-muted">{tool.blurb}</p>
      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        {recent ? (
          <span className="min-w-0 truncate rounded-full bg-lab-strong px-2.5 py-1 text-[11.5px] font-semibold text-lab-strong-fg">ล่าสุดของคุณ · {recent.headline}</span>
        ) : SAMPLES[tool.id] ? (
          <span className="min-w-0 truncate rounded-full bg-lab-surface2 px-2.5 py-1 text-[11.5px] font-medium">
            <span className="text-lab-muted">เช่น </span>
            {SAMPLES[tool.id]}
          </span>
        ) : (
          <span className="text-[11.5px] font-medium text-lab-subtle">{GROUP_LABEL[tool.group]}</span>
        )}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-lab-border transition-all group-hover:border-lab-strong group-hover:bg-lab-strong group-hover:text-lab-strong-fg">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      </div>
      {wide && (
        <div className="hidden shrink-0 md:block">
          <MiniCanvas />
        </div>
      )}
    </Link>
  );
};

const SoonCard = ({ tool }: { tool: LabTool }) => {
  const toast = useToast();
  const Icon = tool.icon;
  return (
    <button
      type="button"
      onClick={() => toast(`“${tool.name}” กำลังจะมาใน Business Lab`)}
      className="flex w-full min-w-0 items-center gap-3 rounded-[1rem] border border-dashed border-lab-border p-3.5 text-left opacity-80 transition-opacity hover:opacity-100"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.75rem] bg-lab-surface2 text-lab-muted">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-semibold">{tool.name}</span>
        <span className="block truncate text-[12px] text-lab-muted">{plain(tool.question)}</span>
      </span>
      <span className="shrink-0 rounded-full border border-lab-border px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-lab-muted">Soon</span>
    </button>
  );
};

// ───────────────────────── Page ─────────────────────────

const match = (t: LabTool, q: string) => {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return [t.name, plain(t.question), t.blurb, ...t.keywords].some((f) => f.toLowerCase().includes(s));
};

const LabHome = () => {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [recents, setRecents] = useState<RecentEntry[]>([]);

  useEffect(() => {
    setRecents(getRecents().filter((r) => getTool(r.id)?.status === "live"));
  }, []);

  const live = useMemo(() => LIVE_TOOLS.filter((t) => (filter === "all" || t.group === filter) && match(t, q)), [q, filter]);
  const soon = TOOLS.filter((t) => t.status === "soon");
  const recentFor = (id: string) => recents.find((r) => r.id === id);
  const filters: { value: Filter; label: string; count: number }[] = [
    { value: "all", label: "ทั้งหมด", count: LIVE_TOOLS.length },
    ...(["profit", "cash", "plan"] as ToolGroup[]).map((g) => ({ value: g, label: GROUP_LABEL[g], count: LIVE_TOOLS.filter((t) => t.group === g).length })),
  ];

  return (
    <div className="lab-shell min-h-dvh">
      <LabNavbar />
      <main className="lab-gutter mx-auto max-w-6xl pb-16">
        {/* Hero */}
        <section className="lab-grid-bg animate-lab-in relative mt-2 overflow-hidden rounded-[1.5rem] border border-lab-border bg-lab-surface md:mt-4">
          <div className="grid gap-6 p-5 sm:gap-8 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10 lg:p-12">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-lab-border bg-lab-bg px-2.5 py-1 text-[12px] font-semibold">
                <FlaskConical className="h-3.5 w-3.5" /> ใหม่ใน Jarua
              </span>
              <p className="font-cinematic mt-4 text-[40px] leading-[0.95] sm:mt-5 sm:text-[60px] lg:text-[68px]">
                BUSINESS
                <br />
                LAB
              </p>
              <h1 className="mt-4 text-[26px] font-semibold leading-[1.3] sm:mt-5 sm:text-[32px]">
                <span className="inline-block">ลองตัวเลขก่อน</span> <span className="inline-block">ตัดสินใจจริง</span>
              </h1>
              <p className="mt-3 max-w-[34rem] text-[15px] leading-relaxed text-lab-muted sm:text-[16px]">
                เครื่องมือคำนวณและวางแผนธุรกิจ ใส่ตัวเลขแล้วเห็นคำตอบทันที ไม่ต้องสมัคร ไม่ต้องรอ และตัวเลขของคุณอยู่ในเครื่องนี้เท่านั้น
              </p>
              <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2.5 text-[13px] font-medium sm:mt-6 sm:text-[13.5px]">
                {[
                  { icon: Zap, t: "คำตอบขึ้นขณะพิมพ์" },
                  { icon: Lock, t: "ข้อมูลไม่ออกจากเครื่อง" },
                  { icon: FunctionSquare, t: "เปิดดูสูตรได้ทุกตัว" },
                ].map(({ icon: I, t }) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lab-bg sm:h-7 sm:w-7">
                      <I className="h-3.5 w-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <HeroDemo />
          </div>
        </section>

        {/* Recents */}
        {recents.length > 0 && (
          <section className="mt-8">
            <h2 className="text-[15px] font-semibold">ทำต่อจากครั้งก่อน</h2>
            <div className="-mx-4 mt-3 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 scrollbar-hide md:mx-0 md:px-0">
              {recents.map((r) => {
                const t = getTool(r.id)!;
                const I = t.icon;
                return (
                  <Link
                    key={r.id}
                    to={toolPath(r.id)}
                    className="flex min-w-[220px] snap-start items-center gap-3 rounded-[1rem] border border-lab-border bg-lab-surface p-3 transition-colors hover:border-lab-border-strong press"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.75rem] bg-lab-surface2">
                      <I className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[12px] font-semibold text-lab-muted">{t.name}</span>
                      <span className="lab-num block truncate text-[15px] font-semibold">{r.headline}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Tools */}
        <section className="mt-10" aria-labelledby="lab-tools">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="lab-tools" className="text-[22px] font-semibold sm:text-[26px]">
                เครื่องมือในแล็บ
              </h2>
              <p className="mt-1 text-[13.5px] text-lab-muted">เลือกจากคำถามที่คุณอยากรู้คำตอบ</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative md:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lab-muted" />
              <input
                id="lab-search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ค้นหา เช่น ราคา ภาษี เงินกู้"
                aria-label="ค้นหาเครื่องมือ"
                className="h-11 w-full rounded-xl border border-lab-border bg-lab-surface pl-11 pr-10 text-[14px] font-medium text-lab-fg outline-none transition-colors placeholder:text-lab-subtle focus:border-lab-fg"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-lab-surface2 text-lab-muted hover:text-lab-fg"
                  aria-label="ล้างคำค้นหา"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 scrollbar-hide md:mx-0 md:px-0" role="tablist" aria-label="กลุ่มเครื่องมือ">
              {filters.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  role="tab"
                  aria-selected={filter === f.value}
                  onClick={() => setFilter(f.value)}
                  className={`flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-semibold transition-colors ${
                    filter === f.value ? "border-lab-strong bg-lab-strong text-lab-strong-fg" : "border-lab-border text-lab-muted hover:text-lab-fg"
                  }`}
                >
                  {f.label}
                  <span className={`lab-tnum text-[11.5px] ${filter === f.value ? "opacity-70" : "text-lab-subtle"}`}>{f.count}</span>
                </button>
              ))}
            </div>
          </div>

          {live.length > 0 ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {live.map((t, i) => {
                // The planning board is a different kind of tool: give it the full row when everything is listed.
                const wide = t.id === "canvas" && filter === "all" && !q.trim();
                return (
                  <div key={t.id} className={`animate-lab-in ${wide ? "sm:col-span-2 lg:col-span-3" : ""}`} style={{ animationDelay: `${i * 40}ms` }}>
                    <ToolCard tool={t} recent={recentFor(t.id)} wide={wide} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 flex flex-col items-center rounded-lab-card border border-lab-border bg-lab-surface px-6 py-10 text-center">
              <SearchX className="h-7 w-7 text-lab-muted" />
              <p className="mt-2 text-[15px] font-semibold">ไม่พบเครื่องมือที่ค้นหา</p>
              <p className="mt-1 text-[13px] text-lab-muted">ลองคำว่า “ราคา” “ภาษี” หรือ “เงินกู้”</p>
            </div>
          )}
        </section>

        {/* Coming soon */}
        <section className="mt-10">
          <h2 className="text-[15px] font-semibold">กำลังมา</h2>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {soon.map((t) => (
              <SoonCard key={t.id} tool={t} />
            ))}
          </div>
        </section>

        {/* About */}
        <section className="mt-10 grid gap-4 rounded-lab-card border border-lab-border p-5 sm:p-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <p className="font-cinematic text-[15px]">BUSINESS LAB</p>
            <p className="mt-2 text-[13px] leading-relaxed text-lab-muted">ส่วนหนึ่งของ Jarua แพลตฟอร์มเครื่องมือสำหรับธุรกิจ</p>
          </div>
          <dl className="grid gap-4 text-[13px] sm:grid-cols-3 md:col-span-2">
            <div>
              <dt className="font-semibold">ผลเหมือนเดิมทุกครั้ง</dt>
              <dd className="mt-1 leading-relaxed text-lab-muted">คำนวณด้วยสูตรมาตรฐาน กรอกตัวเลขเดิมได้คำตอบเดิม</dd>
            </div>
            <div>
              <dt className="font-semibold">ใช้ได้ไม่จำกัด</dt>
              <dd className="mt-1 leading-relaxed text-lab-muted">ไม่ต้องสมัคร ไม่มีโควตา เปิดใช้ได้แม้สัญญาณเน็ตไม่ดี</dd>
            </div>
            <div>
              <dt className="font-semibold">ตัวเลขเป็นของคุณ</dt>
              <dd className="mt-1 leading-relaxed text-lab-muted">เก็บในเบราว์เซอร์เครื่องนี้ ไม่ถูกส่งขึ้นเซิร์ฟเวอร์</dd>
            </div>
          </dl>
          <p className="border-t border-lab-border pt-4 text-[12px] leading-relaxed text-lab-subtle md:col-span-3">
            ตัวเลขจากเครื่องมือเป็นการประมาณจากข้อมูลที่คุณกรอก ใช้ประกอบการตัดสินใจ ไม่ใช่คำแนะนำทางการเงิน ภาษี หรือกฎหมาย ควรตรวจสอบกับผู้เชี่ยวชาญก่อนตัดสินใจเรื่องสำคัญ
          </p>
        </section>
      </main>
    </div>
  );
};

export default LabHome;
