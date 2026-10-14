import { ReactNode, useLayoutEffect, useRef, useState } from "react";

/** Width of a container, updated on resize (charts draw at real pixel size so text never shrinks). */
export const useWidth = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => setW(Math.round(el.getBoundingClientRect().width));
    set();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
};

const niceStep = (raw: number) => {
  if (!(raw > 0)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / p;
  const m = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return m * p;
};

/** Clean ticks from 0 (or a negative min) up to at least max — picks the step that wastes the least headroom. */
export const niceTicks = (min: number, max: number, count = 4): number[] => {
  const lo = Math.min(0, min);
  const hi = Math.max(max, lo + 1e-9);
  const build = (n: number) => {
    const step = niceStep((hi - lo) / n);
    const start = Math.floor(lo / step + 1e-9) * step;
    const ticks: number[] = [];
    for (let v = start; v < hi - 1e-9 * step; v += step) ticks.push(Math.round(v / step) * step);
    ticks.push(Math.round((ticks[ticks.length - 1] + step) / step) * step);
    return ticks;
  };
  let best = build(count);
  for (const n of [count - 1, count + 1]) {
    if (n < 2) continue;
    const t = build(n);
    const waste = (x: number[]) => (x[x.length - 1] - hi) / (hi - lo);
    if (t.length >= 3 && t.length <= 7 && waste(t) < waste(best) - 0.05) best = t;
  }
  return best;
};

export const linear = (d0: number, d1: number, r0: number, r1: number) => (v: number) =>
  d1 === d0 ? r0 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);

export const ink = (n: 1 | 2 | 3 | 4, a?: number) => (a === undefined ? `hsl(var(--lab-ink-${n}))` : `hsl(var(--lab-ink-${n}) / ${a})`);
export const DANGER = "hsl(var(--lab-danger))";
export const dangerA = (a: number) => `hsl(var(--lab-danger) / ${a})`;
export const GRID = "hsl(var(--lab-border))";
export const SURFACE = "hsl(var(--lab-surface))";
export const MUTED = "hsl(var(--lab-muted))";
export const FG = "hsl(var(--lab-fg))";

export const LegendKey = ({ color, label, dashed }: { color: string; label: ReactNode; dashed?: boolean }) => (
  <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-lab-muted">
    <svg width="18" height="6" aria-hidden>
      <line x1="1" y1="3" x2="17" y2="3" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeDasharray={dashed ? "3 3" : undefined} />
    </svg>
    {label}
  </span>
);

export const ChartCard = ({
  title,
  subtitle,
  legend,
  children,
  footer,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  legend?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) => (
  <figure className="lab-card m-0 p-4 sm:p-5">
    <figcaption>
      <p className="text-[15px] font-semibold text-lab-fg">{title}</p>
      {subtitle && <p className="mt-0.5 text-[12.5px] leading-relaxed text-lab-muted">{subtitle}</p>}
    </figcaption>
    {legend && <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">{legend}</div>}
    <div className="mt-3">{children}</div>
    {footer && <div className="mt-3">{footer}</div>}
  </figure>
);

/** Floating tooltip positioned inside the chart wrapper. */
export const Tip = ({ x, y, width, children }: { x: number; y: number; width: number; children: ReactNode }) => {
  const tipW = 176;
  const left = Math.min(Math.max(4, x - tipW / 2), Math.max(4, width - tipW - 4));
  return (
    <div
      className="pointer-events-none absolute z-10 rounded-xl border border-lab-border-strong bg-lab-bg/95 px-3 py-2 text-[12px] leading-relaxed shadow-[var(--lab-shadow)] backdrop-blur"
      style={{ left, top: Math.max(0, y), width: tipW }}
    >
      {children}
    </div>
  );
};

export const TipRow = ({ label, value, strong }: { label: ReactNode; value: ReactNode; strong?: boolean }) => (
  <div className="flex items-baseline justify-between gap-3">
    <span className="text-lab-muted">{label}</span>
    <span className={`lab-num lab-tnum ${strong ? "font-semibold text-lab-fg" : "text-lab-fg"}`}>{value}</span>
  </div>
);

/** Shared text style for SVG tick labels. */
export const tickText = { fontSize: 11, fill: MUTED, fontFamily: "IBM Plex Sans Thai, system-ui, sans-serif" } as const;
export const labelText = { fontSize: 12, fill: FG, fontWeight: 600, fontFamily: "IBM Plex Sans Thai, system-ui, sans-serif" } as const;

/** Halo behind SVG text so labels stay readable where they cross a line. */
export const halo = { paintOrder: "stroke", stroke: SURFACE, strokeWidth: 4, strokeLinejoin: "round" } as const;

/** Pointer → value along x, for hover layers. */
export const usePointerX = () => {
  const [px, setPx] = useState<number | null>(null);
  const handlers = {
    onPointerMove: (e: React.PointerEvent<SVGRectElement>) => {
      const r = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
      setPx(e.clientX - r.left);
    },
    onPointerLeave: () => setPx(null),
    onPointerDown: (e: React.PointerEvent<SVGRectElement>) => {
      const r = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
      setPx(e.clientX - r.left);
    },
  };
  return [px, handlers, setPx] as const;
};
