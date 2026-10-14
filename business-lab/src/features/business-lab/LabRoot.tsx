import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import LabHome from "./pages/LabHome";
import { getTool } from "./registry";
import { LAB_BASE } from "./paths";

const BreakEven = lazy(() => import("./tools/BreakEven"));
const Pricing = lazy(() => import("./tools/Pricing"));
const Promo = lazy(() => import("./tools/Promo"));
const Runway = lazy(() => import("./tools/Runway"));
const Loan = lazy(() => import("./tools/Loan"));
const Vat = lazy(() => import("./tools/Vat"));
const Canvas = lazy(() => import("./tools/Canvas"));

const PAGES: Record<string, React.ComponentType> = {
  "break-even": BreakEven,
  pricing: Pricing,
  promo: Promo,
  runway: Runway,
  loan: Loan,
  vat: Vat,
  canvas: Canvas,
};

const ToolRoute = () => {
  const { toolId = "" } = useParams();
  const tool = getTool(toolId);
  const Page = PAGES[toolId];
  if (!tool || tool.status !== "live" || !Page) return <Navigate to={LAB_BASE} replace />;
  return (
    <Suspense fallback={<div className="lab-shell min-h-dvh" />}>
      <Page key={toolId} />
    </Suspense>
  );
};

/**
 * Business Lab entry. In Jarua's App.tsx:
 *   <Route path="/lab/*" element={<LabRoot />} />
 */
const LabRoot = () => (
  <ToastProvider>
    <Routes>
      <Route index element={<LabHome />} />
      <Route path=":toolId" element={<ToolRoute />} />
    </Routes>
  </ToastProvider>
);

export default LabRoot;
