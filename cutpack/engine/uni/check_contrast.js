/* =====================================================================
   CutPack · uni · colour check (Friend 2026-11-08: the checklist boxes "กลืนไปกับพื้นหลังเพราะมันเป็นสีเดียวกัน" and
   "สีที่มันคล้ายๆกันแล้วทำให้มองยากก็ไม่ได้เหมือนกัน"). Builds scenes in one style and, at a moment after the key word,
   measures the contrast (WCAG ratio, 1 = same colour, 21 = black on white) of
     box       a checkbox / frame border against what is behind it           (needs ≥ 3)
     icon      an icon against its own holder (or what is behind it)        (≥ 3; a "soft" = faded holder ≥ 2)
     tile      a holder against what is behind it, when it has no clear edge (≥ 1.4 by fill, or its border ≥ 3)
     word      a word / chip text against what is behind it                  (≥ 3)
   "Behind" = the nearest parent with a solid colour (a gradient counts by its first colour); things straight on the
   video count as on a dark grey (the test clip). Glass is see-through by design, so its tiles are checked by their
   edge only. Prints every problem; writes <work>/contrast.json.
   usage: NODE_PATH=$(npm root -g) node check_contrast.js <style> <work_dir> [scene ids…]  (ids may end with @index)
   ===================================================================== */
const {chromium} = require('playwright'); const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');
const [style, work, ...only] = process.argv.slice(2), AT = 3.6;
const build = (id, i, dir) => execFileSync('python3', [path.join(__dirname, 'build.py'), dir, style, id, '--index', String(i)].concat(style.includes('-overlay') ? ['--speaker', '.86'] : []));
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({viewport: {width: 1080, height: 1920}});
  const open = async dir => { await page.goto('file://' + path.join(dir, 'scene.html')); await page.evaluate(() => document.fonts.ready); };
  let ids = only;
  if (!ids.length) { const p = path.join(work, '_probe'); build('price-cut', 0, p); await open(p); ids = await page.evaluate(() => Object.keys(SCENES).filter(k => /^(r[2-9]|c2|ov)\./.test(k))); }
  const res = {}; let bad = 0;
  for (const sid of ids) {
    const [id, i] = sid.split('@'), dir = path.join(work, id.replace(/[^\w.-]/g, '_') + '_' + (i ?? 0)); build(id, i ?? 0, dir); await open(dir);
    await page.evaluate(t => window.seek(t), AT);
    const hits = await page.evaluate(glass => {
      const rgba = s => { const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return {r: v[0], g: v[1], b: v[2], a: v[3] ?? 1}; };
      const hex = s => { const m = String(s).match(/#([0-9a-f]{6})\b/i); return m ? {r: parseInt(m[1].slice(0, 2), 16), g: parseInt(m[1].slice(2, 4), 16), b: parseInt(m[1].slice(4), 16), a: 1} : null; };
      const over = (c, d) => ({r: c.r * c.a + d.r * (1 - c.a), g: c.g * c.a + d.g * (1 - c.a), b: c.b * c.a + d.b * (1 - c.a), a: 1});
      const lum = c => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }; return .2126 * f(c.r) + .7152 * f(c.g) + .0722 * f(c.b); };
      const ratio = (x, y) => { const a = lum(x), b = lum(y); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05); };
      const VIDEO = {r: 28, g: 28, b: 30, a: 1};
      const fill = e => { const cs = getComputedStyle(e); let c = rgba(cs.backgroundColor); const g = cs.backgroundImage.match(/rgba?\([^)]+\)|#[0-9a-f]{6}/i);
        if ((!c || c.a < .05) && g) c = rgba(g[0]) ?? hex(g[0]); return c && c.a >= .05 ? c : null; };
      const behind = e => { const stack = []; for (let a = e.parentElement; a && a.id !== 'SC' && a !== document.body; a = a.parentElement) { const c = fill(a); if (c) { stack.push(c); if (c.a > .95) break; } }
        let base = VIDEO; for (let k = stack.length - 1; k >= 0; k--) base = over(stack[k], base); return base; };
      const vis = e => { for (let a = e; a && a.id !== 'SC'; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .5) return false; } const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4; };
      const name = e => (e.className.baseVal ?? e.className).replace(/\s+/g, '.');
      const out = [], add = (kind, e, v, need) => { if (v < need) out.push([kind, name(e), +v.toFixed(2), need, e.textContent.trim().slice(0, 20)]); };
      for (const e of document.querySelectorAll('#SC .u-box')) if (vis(e)) {
        const cs = getComputedStyle(e), c = rgba(cs.borderTopColor); if (c && parseFloat(cs.borderTopWidth) > 0) add('box', e, ratio(over(c, behind(e)), behind(e)), 3);
      }
      for (const e of document.querySelectorAll('#SC .u-badge')) if (vis(e)) {
        const own = fill(e), bg = behind(e), base = own ? over(own, bg) : bg, cs = getComputedStyle(e);
        const ico = e.querySelector(':scope > svg.u-ico'); if (ico) add('icon', e, ratio(over(rgba(getComputedStyle(ico).color), base), base), e.classList.contains('u-soft') ? 2 : 3);
        const bw = parseFloat(cs.borderTopWidth), bc = rgba(cs.borderTopColor), edge = bw >= 2 && bc ? ratio(over(bc, bg), bg) : 1;
        if (!glass && own && edge < 3 && !e.classList.contains('u-soft')) add('tile', e, ratio(base, bg), 1.4);
      }
      for (const e of document.querySelectorAll('#SC .u-label, #SC .u-chip')) if (vis(e)) {
        const own = fill(e), bg = behind(e), base = own ? over(own, bg) : bg; add('word', e, ratio(over(rgba(getComputedStyle(e).color), base), base), 3);
      }
      return out;
    }, style.startsWith('glass'));
    res[sid] = hits; if (hits.length) { bad++; console.log(sid, JSON.stringify(hits)); }
  }
  fs.writeFileSync(path.join(work, 'contrast.json'), JSON.stringify(res, null, 1)); await b.close();
  console.log(`${ids.length} scenes checked in ${style}, ${bad} with problems`);
})();
