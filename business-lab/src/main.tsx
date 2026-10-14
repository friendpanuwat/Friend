import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import LabRoot from "@/features/business-lab/LabRoot";
import "./index.css";

// Prototype entry. HashRouter keeps navigation working inside a single HTML file.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/lab/*" element={<LabRoot />} />
        <Route path="*" element={<Navigate to="/lab" replace />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
