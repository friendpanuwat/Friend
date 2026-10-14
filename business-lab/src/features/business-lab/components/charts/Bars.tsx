import { ReactNode, useState } from "react";
import { ink } from "./core";

export type Segment = { key: string; label: string; value: number; tone: 1 | 2 | 3 | 4; emphasis?: boolean };

/** Horizontal 100% bar: where each baht of the price goes. Legend rows double as the table view. */
export const StackBar = ({ segments, total, fmt, footnote }: { segments: Segment[]; total: number; fmt: (n: number) => string; footnote?: ReactNode }) => {
  const [hot, setHot] = useState<string | null>(null);
  const shown = segments.filter((s) => s.value > 0.0001);
  const sum = shown.reduce((a, s) => a + s.value, 0) || 1;
  return (
    <div>
      <div className="flex h-8 w-full gap-[2px] overflow-hidden rounded-[8px]" role="img" aria-label="สัดส่วนของราคาขาย">
        {shown.map((s) => (
          <div
            key={s.key}
            onPointerEnter={() => setHot(s.key)}
            onPointerLeave={() => setHot(null)}
            className="h-full transition-opacity"
            style={{
              width: `${(s.value / sum) * 100}%`,
              minWidth: 3,
              background: ink(s.tone),
              opacity: hot && hot !== s.key ? 0.45 : 1,
            }}
            title={`${s.label} ${fmt(s.value)}`}
          />
        ))}
      </div>
      <ul className="mt-3 divide-y divide-lab-border">
        {segments.map((s) => (
          <li
            key={s.key}
            onPointerEnter={() => setHot(s.key)}
            onPointerLeave={() => setHot(null)}
            className={`flex items-center gap-2.5 py-2 text-[13px] ${s.emphasis ? "font-semibold text-lab-fg" : "text-lab-muted"}`}
          >
            <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ background: ink(s.tone), outline: s.tone === 4 ? "1px solid hsl(var(--lab-border-strong))" : undefined }} />
            <span className="min-w-0 flex-1 truncate">{s.label}</span>
            <span className={`lab-num lab-tnum ${s.emphasis ? "text-lab-fg" : "text-lab-fg/90"}`}>{fmt(s.value)}</span>
            <span className="lab-tnum w-12 text-right text-[12px] text-lab-muted">{total > 0 ? `${Math.round((s.value / total) * 100)}%` : ""}</span>
          </li>
        ))}
      </ul>
      {footnote && <p className="mt-2 text-[12px] leading-relaxed text-lab-muted">{footnote}</p>}
    </div>
  );
};

/** Two or more horizontal bars on one scale, value at the tip. */
export const CompareBars = ({ rows, fmt }: { rows: { label: ReactNode; value: number; highlight?: boolean; note?: ReactNode }[]; fmt: (n: number) => string }) => {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="space-y-3.5">
      {rows.map((r, i) => (
        <div key={i}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13px]">
            <span className={r.highlight ? "font-semibold text-lab-fg" : "text-lab-muted"}>{r.label}</span>
            {r.note && <span className="text-[11.5px] text-lab-muted">{r.note}</span>}
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-6 rounded-r-[6px]" style={{ width: `${Math.max(1.5, (r.value / max) * 78)}%`, background: ink(r.highlight ? 1 : 3) }} />
            <span className={`lab-num lab-tnum shrink-0 text-[14px] ${r.highlight ? "font-semibold text-lab-fg" : "text-lab-muted"}`}>{fmt(r.value)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
