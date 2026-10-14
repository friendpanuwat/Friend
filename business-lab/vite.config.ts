import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "path";

// `--mode single` builds one self-contained index.html (used for the chat prototype).
export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "single" ? viteSingleFile() : null].filter(Boolean),
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: { outDir: mode === "single" ? "dist-single" : "dist" },
  test: { environment: "node", include: ["src/test/**/*.test.ts"] },
}));
