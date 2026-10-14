import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { recordRecent } from "./storage";

export type Handoff<T> = { prefill: Partial<T>; from: string };

/** Apply numbers handed over from another tool (via router state) once, then clear them. */
export function useHandoff<T>(apply: (prefill: Partial<T>, from: string) => void) {
  const loc = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const st = loc.state as Handoff<T> | null;
    if (st && st.prefill) {
      apply(st.prefill, st.from);
      navigate(loc.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Remember this tool + its headline answer for the Lab home. */
export function useRecent(id: string, headline: string | null) {
  useEffect(() => {
    if (!headline) return;
    const t = window.setTimeout(() => recordRecent(id, headline), 700);
    return () => window.clearTimeout(t);
  }, [id, headline]);
}
