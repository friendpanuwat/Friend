import { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";
import { Check } from "lucide-react";

type Toast = { id: number; text: string };
const Ctx = createContext<(text: string) => void>(() => {});

/** Tiny toast (Jarua uses sonner — swap `useToast()` for `toast()` when porting). */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Toast[]>([]);
  const seq = useRef(0);
  const push = useCallback((text: string) => {
    const id = ++seq.current;
    setItems((l) => [...l.slice(-2), { id, text }]);
    window.setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 2600);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 z-[60] flex flex-col items-center gap-2 lab-gutter"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 72px)" }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            className="lab-shell animate-lab-in flex max-w-sm items-center gap-2 rounded-full border border-lab-border bg-lab-surface2 px-4 py-2.5 text-[13px] font-medium text-lab-fg shadow-[var(--lab-shadow)]"
            style={{ backgroundColor: "hsl(var(--lab-surface-2))" }}
          >
            <Check className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
};

export const useToast = () => useContext(Ctx);
