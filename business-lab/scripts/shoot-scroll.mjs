// node scripts/shoot-scroll.mjs <outDir> <route> <y1,y2,...>   (viewport shots at scroll offsets)
import { chromium } from "playwright-core";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const [outDir, route, ys] = process.argv.slice(2);
const W = Number(process.env.W || 390), H = Number(process.env.H || 844), theme = process.env.THEME || "dark";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, colorScheme: theme });
await ctx.addInitScript((t) => localStorage.setItem("promptdd-theme", t), theme);
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(pathToFileURL(resolve("dist-single/index.html")).href + "#" + route);
await page.waitForTimeout(1000);
if (process.env.CLICK) for (const sel of process.env.CLICK.split("|")) { await page.click(sel).catch((e) => errors.push(e.message)); await page.waitForTimeout(300); }
const wide = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll("body *").forEach((el) => { const r = el.getBoundingClientRect(); if (r.right > window.innerWidth + 0.5 && r.width > 0) out.push(el.tagName + "." + String(el.className).slice(0, 60) + " right=" + Math.round(r.right)); });
  return out.slice(0, 8);
});
if (wide.length) console.log("WIDE:", wide.join("\n  "));
for (const y of ys.split(",").map(Number)) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await page.waitForTimeout(450);
  const name = `${outDir}/${route.replace(/\//g, "_").replace(/^_/, "")}-${W}-${theme}-y${y}.png`;
  await page.screenshot({ path: name });
  console.log(name);
}
console.log("height", await page.evaluate(() => document.documentElement.scrollHeight));
if (errors.length) console.log("ERRORS:\n" + errors.join("\n"));
await browser.close();
