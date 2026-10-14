import { ReactNode, useEffect, useId, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// ───────────────────────── helpers ─────────────────────────

const groupInt = (s: string) => s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/** Format a typed string with thousands separators but keep the decimal part as typed. */
const groupLive = (clean: string) => {
  const neg = clean.startsWith("-");
  const body = neg ? clean.slice(1) : clean;
  const [int, dec] = body.split(".");
  const g = groupInt(int ?? "");
  return (neg ? "-" : "") + g + (dec !== undefined ? "." + dec : "");
};

const toText = (v: number | null, decimals: number) => {
  if (v === null || !Number.isFinite(v)) return "";
  const fixed = decimals > 0 ? String(Math.round(v * 10 ** decimals) / 10 ** decimals) : String(Math.round(v));
  return groupLive(fixed);
};

// ───────────────────────── Field shell ─────────────────────────

export const FieldLabel = ({
  htmlFor,
  label,
  optional,
  help,
}: {
  htmlFor?: string;
  label: ReactNode;
  optional?: boolean;
  help?: ReactNode;
}) => (
  <div className="mb-2">
    <label htmlFor={htmlFor} className="flex items-center gap-2 text-[14px] font-semibold leading-snug text-lab-fg">
      {label}
      {optional && (
        <span className="shrink-0 whitespace-nowrap rounded-full border border-lab-border px-1.5 py-px text-[10.5px] font-medium text-lab-muted">
          ไม่บังคับ
        </span>
      )}
    </label>
    {help && <p className="mt-0.5 text-[12.5px] leading-relaxed text-lab-muted">{help}</p>}
  </div>
);

// ───────────────────────── NumberField ─────────────────────────

export type NumberFieldProps = {
  id: string;
  label: ReactNode;
  value: number | null;
  onChange: (v: number | null) => void;
  prefix?: string;
  suffix?: string;
  help?: ReactNode;
  decimals?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  optional?: boolean;
  allowNegative?: boolean;
};

export const NumberField = ({
  id,
  label,
  value,
  onChange,
  prefix,
  suffix,
  help,
  decimals = 2,
  min,
  max,
  placeholder = "0",
  optional,
  allowNegative,
}: NumberFieldProps) => {
  const [text, setText] = useState(() => toText(value, decimals));
  const focused = useRef(false);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!focused.current) setText(toText(value, decimals));
  }, [value, decimals]);

  const handle = (raw: string) => {
    const el = ref.current;
    const caret = el?.selectionStart ?? raw.length;
    let clean = raw.replace(/[,\s฿%]/g, "");
    if (!allowNegative) clean = clean.replace(/-/g, "");
    if (!/^-?\d*\.?\d*$/.test(clean)) return;
    if (decimals === 0) clean = clean.replace(/\..*$/, "");
    const digitsBefore = raw.slice(0, caret).replace(/[^\d.-]/g, "").length;
    const formatted = groupLive(clean);
    setText(formatted);
    requestAnimationFrame(() => {
      if (!el || document.activeElement !== el) return;
      let pos = 0;
      let count = 0;
      while (pos < formatted.length && count < digitsBefore) {
        if (/[\d.-]/.test(formatted[pos])) count++;
        pos++;
      }
      el.setSelectionRange(pos, pos);
    });
    if (clean === "" || clean === "-" || clean === "." || clean === "-.") onChange(null);
    else {
      let n = Number(clean);
      if (max !== undefined && n > max) n = max;
      onChange(n);
    }
  };

  const blur = () => {
    focused.current = false;
    let v = value;
    if (v !== null && min !== undefined && v < min) {
      v = min;
      onChange(v);
    }
    setText(toText(v, decimals));
  };

  return (
    <div>
      <FieldLabel htmlFor={id} label={label} optional={optional} help={help} />
      <div className="group relative flex h-12 items-center rounded-lab-field border border-lab-border bg-lab-bg transition-colors focus-within:border-lab-fg hover:border-lab-border-strong">
        {prefix && <span className="pointer-events-none pl-3.5 text-[16px] font-medium text-lab-muted">{prefix}</span>}
        <input
          ref={ref}
          id={id}
          type="text"
          inputMode={decimals > 0 ? "decimal" : "numeric"}
          autoComplete="off"
          enterKeyHint="next"
          value={text}
          placeholder={placeholder}
          onFocus={(e) => {
            focused.current = true;
            const t = e.currentTarget;
            requestAnimationFrame(() => t.select());
          }}
          onBlur={blur}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            const all = Array.from(document.querySelectorAll<HTMLInputElement>(".lab-shell input[inputmode]"));
            const next = all[all.indexOf(e.currentTarget) + 1];
            if (next) next.focus();
            else e.currentTarget.blur();
          }}
          onChange={(e) => handle(e.target.value)}
          className={`lab-num lab-tnum h-full w-full min-w-0 bg-transparent text-[17px] font-medium text-lab-fg outline-none placeholder:text-lab-subtle ${
            prefix ? "pl-1.5" : "pl-3.5"
          } ${suffix ? "pr-1.5" : "pr-3.5"}`}
        />
        {suffix && (
          <span className="pointer-events-none shrink-0 whitespace-nowrap pr-3.5 text-[13.5px] font-medium text-lab-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

// ───────────────────────── SliderField ─────────────────────────

export const SliderField = ({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
  help,
  ends,
}: {
  id: string;
  label: ReactNode;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  format: (v: number) => string;
  help?: ReactNode;
  ends?: [string, string];
}) => {
  const fill = ((Math.min(max, Math.max(min, value)) - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[14px] font-semibold text-lab-fg">
          {label}
        </label>
        <span className="lab-num lab-tnum shrink-0 text-[17px] font-semibold text-lab-fg">{format(value)}</span>
      </div>
      {help && <p className="mt-0.5 text-[12.5px] leading-relaxed text-lab-muted">{help}</p>}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="lab-range mt-1"
        style={{ ["--fill" as string]: `${fill}%` }}
        aria-valuetext={format(value)}
      />
      {ends && (
        <div className="flex justify-between text-[11px] font-medium text-lab-subtle">
          <span>{ends[0]}</span>
          <span>{ends[1]}</span>
        </div>
      )}
    </div>
  );
};

// ───────────────────────── Segmented ─────────────────────────

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  stretch = true,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  label: string;
  stretch?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`flex rounded-full border border-lab-border bg-lab-surface2 p-1 ${stretch ? "w-full" : "w-fit"}`}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`min-h-9 rounded-full px-3 text-[13px] font-semibold transition-colors ${stretch ? "flex-1" : ""} ${
              active ? "bg-lab-strong text-lab-strong-fg shadow-sm" : "text-lab-muted hover:text-lab-fg"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ───────────────────────── Switch ─────────────────────────

export const SwitchRow = ({
  id,
  label,
  help,
  checked,
  onChange,
}: {
  id: string;
  label: ReactNode;
  help?: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0">
      <label htmlFor={id} className="text-[14px] font-semibold text-lab-fg">
        {label}
      </label>
      {help && <p className="mt-0.5 text-[12.5px] leading-relaxed text-lab-muted">{help}</p>}
    </div>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full border transition-colors ${
        checked ? "border-lab-strong bg-lab-strong" : "border-lab-border-strong bg-lab-surface2"
      }`}
    >
      <span
        className={`absolute top-[3px] h-5 w-5 rounded-full transition-all ${
          checked ? "left-[calc(100%-23px)] bg-lab-strong-fg" : "left-[3px] bg-lab-muted"
        }`}
      />
    </button>
  </div>
);

// ───────────────────────── Chips ─────────────────────────

export function Chips<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T | null;
  onChange: (v: T) => void;
  options: { value: T; label: ReactNode }[];
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`min-h-8 rounded-full border px-3 text-[12.5px] font-semibold transition-colors press ${
              active
                ? "border-lab-strong bg-lab-strong text-lab-strong-fg"
                : "border-lab-border text-lab-muted hover:border-lab-border-strong hover:text-lab-fg"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// ───────────────────────── Panels ─────────────────────────

export const Panel = ({
  title,
  children,
  aside,
  className = "",
}: {
  title?: ReactNode;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) => (
  <section className={`lab-card p-4 sm:p-5 ${className}`}>
    {(title || aside) && (
      <div className="mb-4 flex items-center justify-between gap-3">
        {title && <h2 className="text-[15px] font-semibold text-lab-fg">{title}</h2>}
        {aside}
      </div>
    )}
    {children}
  </section>
);

export const Disclosure = ({
  summary,
  children,
  defaultOpen,
}: {
  summary: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) => {
  const id = useId();
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-t border-lab-border pt-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 py-1 text-left text-[13.5px] font-semibold text-lab-fg"
      >
        {summary}
        <ChevronDown className={`h-4 w-4 shrink-0 text-lab-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={id} hidden={!open} className="pt-4">
        {children}
      </div>
    </div>
  );
};
