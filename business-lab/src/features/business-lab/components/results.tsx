import { ReactNode, useState } from "react";
import { AlertOctagon, AlertTriangle, ArrowRight, CheckCircle2, Copy, FunctionSquare, Lightbulb } from "lucide-react";
import { useToast } from "./Toast";

export type Tone = "good" | "warn" | "bad" | "neutral";

// ───────────────────────── Status pill ─────────────────────────

export const StatusPill = ({ tone, children, inverted }: { tone: Tone; children: ReactNode; inverted?: boolean }) => {
  const Icon = tone === "good" ? CheckCircle2 : tone === "bad" ? AlertOctagon : tone === "warn" ? AlertTriangle : null;
  const base = "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none";
  const cls = inverted
    ? tone === "bad"
      ? "bg-lab-danger text-white"
      : tone === "good"
        ? "bg-lab-strong-fg text-lab-strong"
        : "text-lab-strong-fg"
    : tone === "bad"
      ? "bg-lab-danger-soft text-lab-danger"
      : tone === "good"
        ? "bg-lab-strong text-lab-strong-fg"
        : "border border-lab-border-strong text-lab-fg";
  return (
    <span className={`${base} ${cls}`} style={inverted && (tone === "warn" || tone === "neutral") ? { border: "1px solid hsl(var(--lab-strong-fg) / 0.35)" } : undefined}>
      {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />}
      {children}
    </span>
  );
};

// ───────────────────────── Result hero ─────────────────────────

export const ResultHero = ({
  label,
  value,
  unit,
  sentence,
  status,
  footer,
}: {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  sentence?: ReactNode;
  status?: { tone: Tone; text: ReactNode };
  footer?: ReactNode;
}) => (
  <section aria-live="polite" className="rounded-lab-card bg-lab-strong p-5 text-lab-strong-fg sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-[13px] font-semibold opacity-70">{label}</p>
      {status && (
        <StatusPill tone={status.tone} inverted>
          {status.text}
        </StatusPill>
      )}
    </div>
    <p className="lab-num mt-2 flex flex-wrap items-baseline gap-x-2 leading-none">
      <span className="text-[52px] font-semibold tracking-tight sm:text-[60px]">{value}</span>
      {unit && <span className="text-[18px] font-medium opacity-80">{unit}</span>}
    </p>
    {sentence && <p className="mt-3 max-w-prose text-[14.5px] leading-relaxed opacity-85">{sentence}</p>}
    {footer && <div className="mt-4 border-t pt-4" style={{ borderColor: "hsl(var(--lab-strong-fg) / 0.15)" }}>{footer}</div>}
  </section>
);

// ───────────────────────── Stats ─────────────────────────

export const Stat = ({ label, value, sub, tone }: { label: ReactNode; value: ReactNode; sub?: ReactNode; tone?: Tone }) => (
  <div className="min-w-0 rounded-[1rem] border border-lab-border bg-lab-surface p-3.5">
    <p className="text-[12px] font-medium leading-snug text-lab-muted">{label}</p>
    <p className={`lab-num mt-1.5 break-words text-[21px] font-semibold leading-tight ${tone === "bad" ? "text-lab-danger" : "text-lab-fg"}`}>
      {value}
    </p>
    {sub && <p className="mt-1 text-[11.5px] leading-snug text-lab-muted">{sub}</p>}
  </div>
);

export const StatGrid = ({ children }: { children: ReactNode }) => (
  <div className="grid grid-cols-2 gap-2.5">{children}</div>
);

// ───────────────────────── Insights ─────────────────────────

export type InsightItem = { tone: "good" | "warn" | "bad" | "tip"; title: ReactNode; body?: ReactNode };

export const Insights = ({ items, title = "สิ่งที่ตัวเลขบอก" }: { items: InsightItem[]; title?: string }) => {
  if (!items.length) return null;
  return (
    <section className="lab-card p-4 sm:p-5">
      <h2 className="mb-3 text-[15px] font-semibold">{title}</h2>
      <ul className="space-y-3.5">
        {items.map((it, i) => {
          const Icon = it.tone === "good" ? CheckCircle2 : it.tone === "bad" ? AlertOctagon : it.tone === "warn" ? AlertTriangle : Lightbulb;
          return (
            <li key={i} className="flex gap-3">
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  it.tone === "bad" ? "bg-lab-danger-soft text-lab-danger" : it.tone === "good" ? "bg-lab-strong text-lab-strong-fg" : "bg-lab-surface2 text-lab-fg"
                }`}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2.4} />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold leading-snug">{it.title}</p>
                {it.body && <p className="mt-0.5 text-[13px] leading-relaxed text-lab-muted">{it.body}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

// ───────────────────────── Formula box ─────────────────────────

export type FormulaLine = { label: ReactNode; formula: ReactNode; worked?: ReactNode };

export const Formulas = ({ lines, note }: { lines: FormulaLine[]; note?: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <section className="lab-card overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 p-4 text-left sm:px-5"
      >
        <FunctionSquare className="h-5 w-5 shrink-0 text-lab-muted" />
        <span className="flex-1">
          <span className="block text-[14px] font-semibold">ดูสูตรที่ใช้คำนวณ</span>
          <span className="block text-[12px] text-lab-muted">ทุกตัวเลขมาจากสูตรตรงไปตรงมา ตรวจสอบได้</span>
        </span>
        <span className="text-[12px] font-semibold text-lab-muted">{open ? "ซ่อน" : "เปิด"}</span>
      </button>
      {open && (
        <div className="space-y-4 border-t border-lab-border bg-lab-bg/40 p-4 sm:px-5">
          {lines.map((l, i) => (
            <div key={i}>
              <p className="text-[12.5px] font-semibold text-lab-fg">{l.label}</p>
              <p className="mt-1 font-lab-mono text-[12.5px] leading-relaxed text-lab-muted">{l.formula}</p>
              {l.worked && <p className="mt-0.5 font-lab-mono text-[12.5px] leading-relaxed text-lab-fg">{l.worked}</p>}
            </div>
          ))}
          {note && <p className="text-[12px] leading-relaxed text-lab-muted">{note}</p>}
        </div>
      )}
    </section>
  );
};

// ───────────────────────── Actions ─────────────────────────

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
};

export const CopyButton = ({ text, label = "คัดลอกสรุป" }: { text: () => string; label?: string }) => {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={async () => {
        const ok = await copyText(text());
        toast(ok ? "คัดลอกแล้ว วางใน LINE หรือโน้ตได้เลย" : "คัดลอกไม่ได้ในหน้านี้ ลองกดค้างที่ตัวเลขแทน");
      }}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-lab-strong px-5 text-[14px] font-semibold text-lab-strong-fg press"
    >
      <Copy className="h-4 w-4" />
      {label}
    </button>
  );
};

export const NextStep = ({ title, body, onClick }: { title: ReactNode; body: ReactNode; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex w-full items-center gap-3 rounded-[1rem] border border-lab-border bg-lab-surface p-3.5 text-left transition-colors hover:border-lab-border-strong press"
  >
    <span className="min-w-0 flex-1">
      <span className="block text-[13.5px] font-semibold">{title}</span>
      <span className="mt-0.5 block text-[12px] leading-snug text-lab-muted">{body}</span>
    </span>
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lab-surface2 transition-transform group-hover:translate-x-0.5">
      <ArrowRight className="h-4 w-4" />
    </span>
  </button>
);

// ───────────────────────── Empty / invalid state ─────────────────────────

export const NeedInput = ({ title, body }: { title: ReactNode; body: ReactNode }) => (
  <section className="rounded-lab-card border border-dashed border-lab-border-strong p-6 text-center">
    <p className="text-[16px] font-semibold">{title}</p>
    <p className="mx-auto mt-1 max-w-sm text-[13px] leading-relaxed text-lab-muted">{body}</p>
  </section>
);
