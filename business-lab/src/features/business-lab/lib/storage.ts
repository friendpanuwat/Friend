import { useCallback, useEffect, useRef, useState } from "react";

// Everything Business Lab remembers stays in this browser (localStorage).
const PREFIX = "jarua:lab:";

export const readJSON = <T,>(key: string): T | null => {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const writeJSON = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage blocked — the tool still works for this visit */
  }
};

export const removeKey = (key: string) => {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
};

/** Tool state that survives reloads. Missing keys fall back to `initial`. */
export function useLabState<T extends object>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => ({ ...initial, ...(readJSON<Partial<T>>(key) ?? {}) }));
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    writeJSON(key, state);
  }, [key, state]);
  const patch = useCallback((p: Partial<T>) => setState((s) => ({ ...s, ...p })), []);
  return [state, setState, patch] as const;
}

// ── Recently used tools (shown on the Lab home) ──

export type RecentEntry = { id: string; headline: string; at: number };
const RECENT_KEY = "recent";

export const getRecents = (): RecentEntry[] => {
  const r = readJSON<RecentEntry[]>(RECENT_KEY);
  return Array.isArray(r) ? r.filter((x) => x && typeof x.id === "string") : [];
};

export const recordRecent = (id: string, headline: string) => {
  const list = getRecents().filter((r) => r.id !== id);
  list.unshift({ id, headline, at: Date.now() });
  writeJSON(RECENT_KEY, list.slice(0, 6));
};

export const clearRecents = () => removeKey(RECENT_KEY);
