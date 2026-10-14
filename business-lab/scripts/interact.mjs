// End-to-end checks of real interactions in the built single-file app.
import { chromium } from "playwright-core";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
const SS = process.argv[2];
const url = pathToFileURL(resolve("dist-single/index.html")).href;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
let pass = 0, fail = 0;
const check = (name, ok, extra = "") => { ok ? pass++ : fail++; console.log(`${ok ? "PASS" : "FAIL"} ${name} ${extra}`); };
const heroText = () => page.locator("section[aria-live=polite]").first().innerText();

await page.goto(url + "#/lab/break-even");
await page.waitForTimeout(700);
// 1. live thousands grouping while typing
const fixed = page.locator("#be-fixed");
await fixed.click();
await page.keyboard.press("Control+A");
await page.keyboard.type("1234567");
check("grouping while typing", (await fixed.inputValue()) === "1,234,567", await fixed.inputValue());
// 2. result updates live
await page.keyboard.press("Control+A");
await page.keyboard.type("45000");
const price = page.locator("#be-price");
await price.click();
await page.keyboard.press("Control+A");
await page.keyboard.type("60");
const h = await heroText();
check("hero recomputes (45,000 ÷ (60−22) ÷ 26 = 45.5 → 46/day)", /\n46\n/.test(h), JSON.stringify(h.slice(0, 60)));
// 3. Enter moves to next field
await page.keyboard.press("Enter");
const focused = await page.evaluate(() => document.activeElement?.id);
check("Enter focuses next field", focused === "be-cost", focused);
// 4. price below cost → explanation
await price.click();
await page.keyboard.press("Control+A");
await page.keyboard.type("10");
check("price below cost explained", (await page.locator("text=ราคาขายต้องสูงกว่าต้นทุนต่อชิ้น").count()) > 0);
await page.keyboard.press("Control+A");
await page.keyboard.type("55");
// 5. hand-off to pricing
await page.locator("button:has-text('ตั้งราคาให้กำไรมากขึ้น')").click();
await page.waitForTimeout(800);
check("navigated to pricing", page.url().endsWith("#/lab/pricing"), page.url());
check("hand-off toast", (await page.locator("text=ใส่ตัวเลขจาก “จุดคุ้มทุน” ให้แล้ว").count()) > 0);
check("hand-off prefilled cost 22", (await page.locator("#pr-cost").inputValue()) === "22", await page.locator("#pr-cost").inputValue());
// 6. check mode
await page.locator("button[role=radio]:has-text('เช็กกำไรจากราคาเดิม')").click();
await page.locator("#pr-price").fill("");
await page.locator("#pr-price").type("99");
check("check mode shows profit", (await heroText()).includes("กำไรต่อชิ้น"));
// 7. copy summary → toast
await page.locator("button:has-text('คัดลอกสรุป')").first().click();
await page.waitForTimeout(300);
check("copy gives feedback", (await page.locator("text=/คัดลอก(แล้ว|ไม่ได้)/").count()) > 0);
// 8. every tool: reset → empty state, no crash
for (const t of ["break-even", "pricing", "promo", "runway", "loan", "vat"]) {
  await page.goto(url + "#/lab/" + t);
  await page.waitForTimeout(500);
  await page.locator("button:has-text('ล้างค่า')").click();
  await page.waitForTimeout(250);
  const empties = await page.locator("section.border-dashed").count();
  check(`reset → empty state (${t})`, empties > 0);
  if (t === "promo") await page.screenshot({ path: `${SS}/empty-promo.png` });
  // restore example
  await page.locator("main button[aria-pressed]").first().click();
}
// 9. canvas add / remove
await page.goto(url + "#/lab/canvas");
await page.waitForTimeout(500);
const inp = page.locator("#bmc-input-customers");
await inp.fill("แม่ค้าออนไลน์");
await inp.press("Enter");
check("canvas add note", (await page.locator("li:has-text('แม่ค้าออนไลน์')").count()) === 1);
await page.locator("button[aria-label='ลบ แม่ค้าออนไลน์']").click();
check("canvas remove note", (await page.locator("li:has-text('แม่ค้าออนไลน์')").count()) === 0);
// 10. recents on home + theme toggle
await page.goto(url + "#/lab");
await page.waitForTimeout(600);
check("recents shown", (await page.locator("text=ทำต่อจากครั้งก่อน").count()) > 0);
const before = await page.evaluate(() => document.documentElement.classList.contains("light"));
await page.locator("button[role=switch][aria-label*='โหมด']").click();
check("theme toggles", (await page.evaluate(() => document.documentElement.classList.contains("light"))) === !before);
await page.screenshot({ path: `${SS}/home-recents-light.png` });
// 11. search
await page.locator("#lab-search").fill("ดอกเบี้ย");
check("search finds loan", (await page.locator("a[href$='/lab/loan']").count()) === 1 && (await page.locator("a[href$='/lab/vat']").count()) === 0);
await page.locator("#lab-search").fill("zzzz");
check("search empty state", (await page.locator("text=ไม่พบเครื่องมือที่ค้นหา").count()) === 1);
console.log(`\n${pass} passed, ${fail} failed`);
if (errors.length) console.log("ERRORS:\n" + errors.join("\n"));
await browser.close();
