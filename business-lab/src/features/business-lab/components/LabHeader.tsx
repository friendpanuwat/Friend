import { ChevronLeft, FlaskConical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useToast } from "./Toast";
import { LAB_BASE } from "../paths";

const useScrolled = () => {
  const [s, setS] = useState(false);
  useEffect(() => {
    const on = () => setS(window.scrollY > 4);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return s;
};

const headerCls = (scrolled: boolean) =>
  `sticky z-40 border-b transition-colors ${scrolled ? "border-lab-border bg-lab-bg/85 backdrop-blur-xl" : "border-transparent bg-lab-bg"}`;

/** Lab home header — mirrors Jarua's Navbar with "Business Lab" as a third tab. */
export const LabNavbar = () => {
  const scrolled = useScrolled();
  const toast = useToast();
  const notInPrototype = () => toast("ต้นแบบนี้มีเฉพาะส่วน Business Lab");
  const item = "relative py-1 text-sm font-semibold whitespace-nowrap transition-colors";
  return (
    <header className={headerCls(scrolled)} style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="lab-gutter mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 md:h-16">
        <div className="flex min-w-0 items-center gap-5 md:gap-8">
          <button type="button" onClick={notInPrototype} className="shrink-0" aria-label="JARUA — หน้าแรก">
            <span className="font-cinematic text-xl leading-none tracking-wider text-lab-fg md:text-2xl">JARUA</span>
          </button>
          <nav className="flex min-w-0 items-center gap-4 overflow-x-auto scrollbar-hide md:gap-6">
            <button type="button" onClick={notInPrototype} className={`${item} text-lab-muted hover:text-lab-fg hidden sm:block`}>
              หน้าแรก
            </button>
            <button type="button" onClick={notInPrototype} className={`${item} text-lab-muted hover:text-lab-fg`}>
              หมวดหมู่
            </button>
            <Link to={LAB_BASE} className={`${item} text-lab-fg`} aria-current="page">
              Business Lab
              <span className="absolute -bottom-1 left-1 right-1 h-0.5 rounded-full bg-lab-fg" />
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

/** Tool page header — back to the Lab, tool name, theme. Same anatomy as Jarua's PlanShell. */
export const ToolHeader = ({ title }: { title: string }) => {
  const scrolled = useScrolled();
  const navigate = useNavigate();
  return (
    <header className={headerCls(scrolled)} style={{ top: "env(safe-area-inset-top, 0px)" }}>
      <div className="lab-gutter mx-auto grid h-14 max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(LAB_BASE))}
          className="-ml-2 flex h-10 items-center gap-1 rounded-full pl-1 pr-3 text-lab-muted transition-colors hover:text-lab-fg"
          aria-label="กลับไปหน้า Business Lab"
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="hidden items-center gap-1.5 text-[13px] font-semibold sm:flex">
            <FlaskConical className="h-3.5 w-3.5" /> Business Lab
          </span>
        </button>
        <p className={`truncate text-center text-[15px] font-semibold transition-opacity ${scrolled ? "opacity-100" : "opacity-0 sm:opacity-100"}`}>
          {title}
        </p>
        <ThemeToggle />
      </div>
    </header>
  );
};
