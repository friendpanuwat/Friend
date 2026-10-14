// Screenshot helper: node scripts/shoot.mjs <outDir> <route> [route...]
// env: W (default 390), H (default 844), THEME (dark|light), FULL (1 = full page), CLICK (css selector to click first)
import { chromium } from "playwright-core";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [outDir, ...routes] = process.argv.slice(2);
const W = Number(process.env.W || 390);
const H = Number(process.env.H || 844);
const theme = process.env.THEME || "dark";
const full = process.env.FULL === "1";
const file = pathToFileURL(resolve("dist-single/index.html")).href;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, colorScheme: theme });
await ctx.addInitScript((t) => localStorage.setItem("promptdd-theme", t), theme);
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
for (const route of routes) {
  await page.goto(`${file}#${route}`);
  await page.waitForTimeout(900);
  if (process.env.CLICK) {
    for (const sel of process.env.CLICK.split("|")) {
      await page.click(sel).catch((e) => errors.push("click " + sel + ": " + e.message));
      await page.waitForTimeout(300);
    }
  }
  const name = `${outDir}/${route.replace(/\//g, "_").replace(/^_/, "") || "root"}-${W}-${theme}${full ? "-full" : ""}.png`;
  await page.screenshot({ path: name, fullPage: full });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(name, overflow > 0 ? `HORIZONTAL OVERFLOW ${overflow}px` : "");
}
if (errors.length) console.log("ERRORS:\n" + errors.join("\n"));
await browser.close();
