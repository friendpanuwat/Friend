import { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronDown, Lock, RotateCcw } from "lucide-react";
import { ToolHeader } from "./LabHeader";
import { GROUP_LABEL, getTool } from "../registry";
import { Phrase } from "./Phrase";

export type Preset = { id: string; label: string };

/** Shared frame for every Lab tool: intro → examples → inputs | results, plus a live result bar on phones. */
const ToolLayout = ({
  toolId,
  presets,
  activePreset,
  onPreset,
  onReset,
  inputs,
  results,
  wide,
  bar,
}: {
  toolId: string;
  presets?: Preset[];
  activePreset?: string | null;
  onPreset?: (id: string) => void;
  onReset?: () => void;
  inputs?: ReactNode;
  results?: ReactNode;
  /** Full-width body instead of the inputs | results split (used by the canvas). */
  wide?: ReactNode;
  bar?: { label: ReactNode; value: ReactNode } | null;
}) => {
  const tool = getTool(toolId)!;
  const resultsRef = useRef<HTMLDivElement>(null);
  const [resultsVisible, setResultsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [toolId]);

  useEffect(() => {
    const el = resultsRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([e]) => setResultsVisible(e.isIntersecting || e.boundingClientRect.top < 0), {
      rootMargin: "0px 0px -35% 0px",
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lab-shell min-h-dvh">
      <ToolHeader title={tool.name} />
      <main className="lab-gutter mx-auto max-w-6xl pb-32 pt-4 lg:pb-20 lg:pt-8">
        <div className="animate-lab-in max-w-3xl">
          <p className="flex flex-wrap items-center gap-x-2 text-[12.5px] font-semibold text-lab-muted">
            <span>{tool.name}</span>
            <span aria-hidden>·</span>
            <span>{GROUP_LABEL[tool.group]}</span>
          </p>
          <h1 className="mt-1.5 text-[27px] font-semibold leading-[1.3] sm:text-[34px]">
            <Phrase text={tool.question} />
          </h1>
          <p className="mt-2 max-w-2xl text-[14.5px] leading-relaxed text-lab-muted">{tool.blurb}</p>
        </div>

        {presets && presets.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[12.5px] font-semibold text-lab-muted">ลองกับตัวอย่าง</span>
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onPreset?.(p.id)}
                aria-pressed={activePreset === p.id}
                className={`min-h-8 rounded-full border px-3 text-[12.5px] font-semibold transition-colors press ${
                  activePreset === p.id
                    ? "border-lab-strong bg-lab-strong text-lab-strong-fg"
                    : "border-lab-border text-lab-muted hover:border-lab-border-strong hover:text-lab-fg"
                }`}
              >
                {p.label}
              </button>
            ))}
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="ml-auto inline-flex min-h-8 items-center gap-1.5 rounded-full px-2 text-[12.5px] font-semibold text-lab-muted hover:text-lab-fg"
              >
                <RotateCcw className="h-3.5 w-3.5" /> ล้างค่า
              </button>
            )}
          </div>
        )}

        {wide ? (
          <div className="mt-5 min-w-0">{wide}</div>
        ) : (
          <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-6">
            <div className="min-w-0 space-y-4">
              {inputs}
              <p className="flex items-center gap-1.5 px-1 text-[12px] text-lab-subtle">
                <Lock className="h-3.5 w-3.5" /> ตัวเลขที่กรอกเก็บไว้ในเครื่องนี้เท่านั้น ไม่ถูกส่งไปที่ไหน
              </p>
            </div>
            <div ref={resultsRef} id="lab-results" className="min-w-0 scroll-mt-20 space-y-4">
              {results}
            </div>
          </div>
        )}
      </main>

      {bar && (
        <div
          className={`fixed inset-x-0 bottom-0 z-30 transition-all duration-300 lg:hidden ${
            resultsVisible ? "pointer-events-none translate-y-full opacity-0" : "translate-y-0 opacity-100"
          }`}
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
        >
          <div className="lab-gutter">
            <button
              type="button"
              onClick={() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="flex w-full items-center gap-3 rounded-[1.1rem] bg-lab-strong px-4 py-3 text-left text-lab-strong-fg shadow-[0_12px_40px_hsl(0_0%_0%/0.35)] press"
              aria-label="เลื่อนไปดูผลลัพธ์"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[11.5px] font-semibold opacity-70">{bar.label}</span>
                <span className="lab-num block truncate text-[21px] font-semibold leading-tight">{bar.value}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-[12.5px] font-semibold opacity-80">
                ดูผล <ChevronDown className="h-4 w-4" />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolLayout;
