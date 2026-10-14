import { KeyboardEvent, useState } from "react";
import { Check, LayoutGrid, ListChecks, Plus, Trash2, X } from "lucide-react";
import ToolLayout from "../components/ToolLayout";
import { Panel, Segmented } from "../components/fields";
import { CopyButton, Insights } from "../components/results";
import { useToast } from "../components/Toast";
import { BLOCKS, EXAMPLE_NAME, canvasToText, checkCanvas, emptyNotes, exampleNotes, type Block, type BlockKey, type CanvasNotes } from "../lib/canvasModel";
import { useLabState } from "../lib/storage";
import { useRecent } from "../lib/hooks";

type View = "steps" | "board";
type State = { preset: string | null; name: string; notes: CanvasNotes; view: View };

const EXAMPLE: State = { preset: "example", name: EXAMPLE_NAME, notes: exampleNotes(), view: "steps" };
const EMPTY: State = { preset: null, name: "", notes: emptyNotes(), view: "steps" };

const Ring = ({ value, total }: { value: number; total: number }) => {
  const size = 56;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} fill="none" stroke="hsl(var(--lab-border-strong))" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          fill="none"
          stroke="hsl(var(--lab-fg))"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / total)}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <span className="lab-num absolute inset-0 flex items-center justify-center text-[13px] font-semibold">
        {value}/{total}
      </span>
    </div>
  );
};

const BlockEditor = ({ block, index, items, onChange }: { block: Block; index: number; items: string[]; onChange: (next: string[]) => void }) => {
  const [text, setText] = useState("");
  const [showIdeas, setShowIdeas] = useState(false);
  const add = (value: string) => {
    const v = value.trim().slice(0, 80);
    if (!v || items.includes(v)) return;
    onChange([...items, v]);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      add(text);
      setText("");
    }
  };
  const ideas = block.ideas.filter((i) => !items.includes(i));
  const done = items.length > 0;
  return (
    <section id={`bmc-${block.key}`} className="lab-card scroll-mt-20 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <span
          className={`lab-num flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
            done ? "bg-lab-strong text-lab-strong-fg" : "border border-lab-border-strong text-lab-muted"
          }`}
          aria-label={done ? `ช่องที่ ${index + 1} กรอกแล้ว` : `ช่องที่ ${index + 1}`}
        >
          {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-semibold leading-snug">
            {block.title} <span className="text-[12px] font-normal text-lab-subtle">{block.en}</span>
          </h2>
          <p className="mt-0.5 text-[13px] leading-relaxed text-lab-muted">{block.question}</p>
        </div>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {items.map((it) => (
            <li key={it} className="flex max-w-full items-center gap-1 rounded-full bg-lab-surface2 py-1 pl-3 pr-1 text-[13px] font-medium">
              <span className="min-w-0 break-words">{it}</span>
              <button
                type="button"
                onClick={() => onChange(items.filter((x) => x !== it))}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-lab-muted hover:bg-lab-bg hover:text-lab-fg"
                aria-label={`ลบ ${it}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex gap-2">
        <input
          id={`bmc-input-${block.key}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          placeholder="พิมพ์แล้วกด Enter"
          maxLength={80}
          enterKeyHint="done"
          aria-label={`เพิ่มใน ${block.title}`}
          className="h-11 min-w-0 flex-1 rounded-lab-field border border-lab-border bg-lab-bg px-3.5 text-[14.5px] outline-none transition-colors placeholder:text-lab-subtle focus:border-lab-fg"
        />
        <button
          type="button"
          onClick={() => {
            add(text);
            setText("");
          }}
          disabled={!text.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lab-strong text-lab-strong-fg transition-opacity disabled:opacity-30 press"
          aria-label="เพิ่ม"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {ideas.length > 0 && (
        <div className="mt-2.5">
          <button type="button" onClick={() => setShowIdeas((v) => !v)} className="text-[12.5px] font-semibold text-lab-muted underline-offset-2 hover:text-lab-fg hover:underline">
            {showIdeas ? "ซ่อนไอเดียตัวอย่าง" : "ดูไอเดียตัวอย่าง"}
          </button>
          {showIdeas && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ideas.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => add(i)}
                  className="inline-flex items-center gap-1 rounded-full border border-dashed border-lab-border-strong px-2.5 py-1 text-[12.5px] text-lab-muted hover:border-lab-fg hover:text-lab-fg"
                >
                  <Plus className="h-3 w-3" /> {i}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

// Classic canvas arrangement on a 10-column grid.
const AREA: Record<BlockKey, string> = {
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

const Board = ({ notes, onPick }: { notes: CanvasNotes; onPick: (k: BlockKey) => void }) => (
  <div>
    <p className="mb-2 text-[12px] text-lab-muted lg:hidden">เลื่อนซ้าย-ขวาเพื่อดูทั้งแผ่น · แตะช่องเพื่อแก้ไข</p>
    <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      <div className="grid min-w-[860px] grid-cols-10 grid-rows-[minmax(150px,auto)_minmax(150px,auto)_minmax(120px,auto)] gap-[2px] overflow-hidden rounded-lab-card border border-lab-border bg-lab-border">
        {BLOCKS.map((b, i) => (
          <button
            key={b.key}
            type="button"
            onClick={() => onPick(b.key)}
            className={`${AREA[b.key]} flex flex-col items-stretch justify-start bg-lab-surface p-3 text-left transition-colors hover:bg-lab-surface2`}
          >
            <p className="flex items-baseline gap-1.5 text-[12.5px] font-semibold">
              <span className="lab-num text-lab-subtle">{i + 1}</span> {b.title}
            </p>
            {notes[b.key].length ? (
              <ul className="mt-2 space-y-1 text-[12.5px] leading-snug">
                {notes[b.key].map((n) => (
                  <li key={n} className="flex gap-1.5">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-lab-fg" />
                    <span className="min-w-0 break-words">{n}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[12px] text-lab-subtle">แตะเพื่อเติม</p>
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const Canvas = () => {
  const [s, setS, patchRaw] = useLabState<State>("canvas", EXAMPLE);
  const [confirmClear, setConfirmClear] = useState(false);
  const toast = useToast();
  const notes = { ...emptyNotes(), ...s.notes };
  const filled = BLOCKS.filter((b) => notes[b.key].length > 0).length;
  const checks = checkCanvas(notes);

  useRecent("canvas", filled > 0 ? `กรอกแล้ว ${filled}/9 ช่อง` : null);

  const setBlock = (k: BlockKey, next: string[]) => patchRaw({ notes: { ...notes, [k]: next }, preset: null });
  const pick = (k: BlockKey) => {
    patchRaw({ view: "steps" });
    window.setTimeout(() => {
      document.getElementById(`bmc-${k}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById(`bmc-input-${k}`)?.focus({ preventScroll: true });
    }, 60);
  };

  const wide = (
    <div className="space-y-4">
      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <Ring value={filled} total={9} />
            <div className="min-w-0 flex-1">
              <label htmlFor="bmc-name" className="text-[12.5px] font-semibold text-lab-muted">
                ชื่อธุรกิจ
              </label>
              <input
                id="bmc-name"
                value={s.name}
                onChange={(e) => patchRaw({ name: e.target.value.slice(0, 60), preset: null })}
                placeholder="เช่น ร้านขนมของแม่"
                className="lab-num mt-0.5 w-full min-w-0 border-b border-lab-border bg-transparent pb-1 text-[20px] font-semibold outline-none transition-colors placeholder:text-lab-subtle focus:border-lab-fg"
              />
            </div>
          </div>
          <div className="md:w-72">
            <Segmented<View>
              label="มุมมอง"
              value={s.view}
              onChange={(v) => patchRaw({ view: v })}
              options={[
                { value: "steps", label: <span className="inline-flex items-center gap-1.5"><ListChecks className="h-4 w-4" /> ทีละช่อง</span> },
                { value: "board", label: <span className="inline-flex items-center gap-1.5"><LayoutGrid className="h-4 w-4" /> ภาพรวม</span> },
              ]}
            />
          </div>
        </div>
        {s.preset === "example" && (
          <p className="mt-4 rounded-[0.875rem] bg-lab-surface2 px-3.5 py-2.5 text-[13px] leading-relaxed text-lab-muted">
            กำลังดู <b className="text-lab-fg">ตัวอย่างร้านกาแฟ</b> กด “ล้างค่า” ด้านบนเพื่อเริ่มธุรกิจของคุณเอง
          </p>
        )}
      </Panel>

      {s.view === "board" ? (
        <Board notes={notes} onPick={pick} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {BLOCKS.map((b, i) => (
            <BlockEditor key={b.key} block={b} index={i} items={notes[b.key]} onChange={(next) => setBlock(b.key, next)} />
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        {checks.length > 0 ? (
          <Insights title="ระบบช่วยเช็ก" items={checks.map((c) => ({ tone: c.tone, title: c.title, body: c.body }))} />
        ) : (
          <section className="lab-card p-4 sm:p-5">
            <h2 className="text-[15px] font-semibold">ระบบช่วยเช็ก</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-lab-muted">{filled === 0 ? "เริ่มจากช่องที่ 1 กลุ่มลูกค้า แล้วระบบจะช่วยดูว่าช่องไหนยังไม่เชื่อมกัน" : "ยังไม่พบช่องที่ขัดกัน เติมต่อให้ครบ 9 ช่อง"}</p>
          </section>
        )}
        <section className="lab-card flex flex-col gap-3 p-4 sm:p-5">
          <h2 className="text-[15px] font-semibold">เก็บไว้ใช้ต่อ</h2>
          <p className="text-[13px] leading-relaxed text-lab-muted">ระบบบันทึกในเครื่องนี้ให้อัตโนมัติ คัดลอกเป็นข้อความเพื่อส่งให้ทีมหรือวางในโน้ตได้</p>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={() => canvasToText(s.name, notes)} label="คัดลอกเป็นข้อความ" />
            {confirmClear ? (
              <span className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setS({ ...EMPTY });
                    setConfirmClear(false);
                    toast("ล้างแคนวาสแล้ว");
                  }}
                  className="h-11 rounded-full bg-lab-danger px-4 text-[13.5px] font-semibold text-white press"
                >
                  ยืนยันล้างทั้งหมด
                </button>
                <button type="button" onClick={() => setConfirmClear(false)} className="h-11 px-2 text-[13.5px] font-semibold text-lab-muted">
                  ยกเลิก
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                disabled={filled === 0 && !s.name}
                className="inline-flex h-11 items-center gap-1.5 rounded-full border border-lab-border px-4 text-[13.5px] font-semibold text-lab-muted hover:text-lab-fg disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" /> ล้างทั้งหมด
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );

  return (
    <ToolLayout
      toolId="canvas"
      presets={[{ id: "example", label: "ร้านกาแฟ" }]}
      activePreset={s.preset}
      onPreset={() => setS({ ...EXAMPLE, view: s.view })}
      onReset={() => setS({ ...EMPTY, view: s.view })}
      wide={wide}
      bar={null}
    />
  );
};

export default Canvas;
