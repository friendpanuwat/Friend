import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

// Same behaviour and storage key as Jarua's ThemeToggle.
type Mode = "dark" | "light";
const read = (): Mode => (document.documentElement.classList.contains("light") ? "light" : "dark");

const ThemeToggle = () => {
  const [mode, setMode] = useState<Mode>(read);

  useEffect(() => {
    const obs = new MutationObserver(() => setMode(read()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("light", next === "light");
    try {
      localStorage.setItem("promptdd-theme", next);
    } catch {
      /* ignore */
    }
    setMode(next);
  };

  const isDay = mode === "light";
  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDay}
      aria-label={isDay ? "เปลี่ยนเป็นโหมดมืด" : "เปลี่ยนเป็นโหมดสว่าง"}
      className="relative flex h-7 w-11 shrink-0 items-center overflow-hidden rounded-full border border-lab-border press sm:w-[84px]"
      style={{ background: isDay ? "#F0F0EB" : "#1A1A1A", transition: "background-color 0.3s ease" }}
    >
      <span
        className={`absolute top-[3px] flex h-5 w-5 items-center justify-center rounded-full shadow-md ${
          isDay ? "left-[calc(100%-23px)]" : "left-[3px]"
        }`}
        style={{ background: isDay ? "#FFFFFF" : "#0A0A0A", transition: "left 0.3s ease, background-color 0.3s ease" }}
      >
        {isDay ? <Sun className="h-3 w-3" style={{ color: "#B45309" }} /> : <Moon className="h-3 w-3 text-white" />}
      </span>
      <span
        className="pointer-events-none absolute hidden text-[9px] font-bold uppercase tracking-wider sm:block"
        style={{
          left: isDay ? "9px" : "auto",
          right: isDay ? "auto" : "9px",
          color: isDay ? "#1A1A1F" : "#F0F0F0",
        }}
      >
        {isDay ? "Light" : "Dark"}
      </span>
    </button>
  );
};

export default ThemeToggle;
