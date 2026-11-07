/* =====================================================================
   CutPack · uni · overlap check (Friend 2026-11-07: "การ์ดมีการทับซ้อนกัน ตรวจดูและแก้ไขทุกการ์ด")
   Builds every scene in one style and looks at 5 moments of each for
     card × card      two visible cards that cross each other (one fully inside the other is fine)
     thing on edge    a badge / chip that sits across a card's edge (fine only if the style draws it solid)
   usage: NODE_PATH=$(npm root -g) node check_overlap.js <style> <work_dir> [scene ids…]   (no ids = every scene)
   writes <work_dir>/overlaps.json and prints the scenes that have any
   ===================================================================== */
const {chromium} = require('playwright'); const fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');
const [style, work, ...only] = process.argv.slice(2), TIMES = [1.6, 2.4, 2.9, 3.5, 4.1];
const build = (id, dir) => execFileSync('python3', [path.join(__dirname, 'build.py'), dir, style, id]);
(async () => {
  const b = await chromium.launch(); const page = await b.newPage({viewport: {width: 1080, height: 1920}});
  const open = async dir => { await page.goto('file://' + path.join(dir, 'scene.html')); await page.evaluate(() => document.fonts.ready); };
  let ids = only;
  if (!ids.length) { const p = path.join(work, '_probe'); build('price-cut', p); await open(p); ids = await page.evaluate(() => Object.keys(SCENES)); }
  const res = {};
  for (const id of ids) {
    const dir = path.join(work, id); build(id, dir); await open(dir);
    const hits = [];
    for (const t of TIMES) {
      await page.evaluate(t => window.seek(t), t);
      (await page.evaluate(() => {
        const vis = el => { let o = 1; for (let e = el; e && e.id !== 'SC'; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
        const R = [...document.querySelectorAll('#SC .u-panel, #SC .u-badge, #SC .u-chip, #SC .u-bubble')].filter(e => vis(e) > .3)
          .map(e => ({e, r: e.getBoundingClientRect()})).filter(x => x.r.width > 4);
        const area = r => r.width * r.height;
        const inter = (a, c) => Math.max(0, Math.min(a.right, c.right) - Math.max(a.left, c.left)) * Math.max(0, Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top));
        const name = e => e.className.replace(/\s+/g, '.');
        const box = r => [r.left, r.top, r.width, r.height].map(Math.round).join(',');
        const out = [];
        for (const a of R) { if (!a.e.classList.contains('u-panel')) continue;
          for (const c of R) { if (a === c) continue; const I = inter(a.r, c.r); if (I < 4) continue;
            const fc = I / area(c.r), fa = I / area(a.r);
            if (c.e.classList.contains('u-panel')) { if (fc > .97 || fa > .97 || a.e.compareDocumentPosition(c.e) & 2) continue; out.push(['card×card', name(a.e), box(a.r), name(c.e), box(c.r), +fc.toFixed(2)]); }
            else if (fc > .03 && fc < .97) out.push(['thing on edge', name(a.e), box(a.r), name(c.e), box(c.r), +fc.toFixed(2)]);
          } }
        return out; })).forEach(x => hits.push([t, ...x]));
    }
    res[id] = hits;
    if (hits.length) { const k = {}; hits.forEach(h => k[h[1]] = (k[h[1]] || 0) + 1); console.log(id, JSON.stringify(k)); }
  }
  fs.writeFileSync(path.join(work, 'overlaps.json'), JSON.stringify(res, null, 1)); await b.close();
  console.log(`${ids.length} scenes checked in ${style}`);
})();
