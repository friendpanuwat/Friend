/* =====================================================================
   CutPack · uni · glow shapes (2026-11-17): how wide each glow-line design is for its height, measured once
   Friend 2026-11-17 on the first real clip in neon: "ทำไมโมชั่นกราฟฟิกเล็กจังเลยมันดูโล่งๆอ่ะ" — a flat picture had been put in a
   tall narrow box (443 × 94 = 2 % of the screen). The style picks the screen whose picture box fits the picture's shape
   (styles/neon.js), so it needs every design's shape before it draws: this draws each design with its own sample data
   (as glow/bridge.js does: the end of its motion, what is really visible) and writes glow/shapes.json = {"B04T.rail": 0.62, …}
   (width / height). Run it again whenever the skill gets new designs: NODE_PATH=$(npm root -g) node glow/shapes.js
   ===================================================================== */
const {chromium} = require('playwright'), fs = require('fs'), path = require('path'), os = require('os');
const SKILL = path.resolve(__dirname, '../../../../.claude/skills/glow-line-motion'), EX = path.join(SKILL, 'examples'), AS = path.join(SKILL, 'assets');
const sets = fs.readdirSync(EX).filter(d => /^b\d\dt?$/.test(d) && fs.existsSync(path.join(EX, d, d + '.js'))).sort();
(async () => {
  /* a page next to the runtime's helpers (it loads beats.js, pro*.js and its fonts from next to the page) */
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'glowshapes-'));
  for (const f of fs.readdirSync(AS)) fs.symlinkSync(path.join(AS, f), path.join(dir, f));
  fs.writeFileSync(path.join(dir, 'p.html'), '<!doctype html><meta charset=utf-8><body style="margin:0;background:#000">'
    + `<script src="${path.join(AS, 'glowline.js')}"></script>` + sets.map(d => `<script src="${path.join(EX, d, d + '.js')}"></script>`).join(''));
  const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1000, height: 700}}), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(dir, 'p.html'));
  const out = await p.evaluate(() => new Promise(done => GL.run(() => {
    const res = {}, cats = Object.keys(GL.cats).filter(k => /^B\d\dT?$/.test(k)).sort();
    for (const k of cats) GL.cats[k].variants.forEach((v, i) => {
      try {
        GL.stage({w: 1000, h: 700, glow: 0});
        const svg = [...document.body.children].filter(e => e.tagName.toLowerCase() === 'svg').pop();
        const S = GL.cats[k].SAMPLES, d = S[i % S.length];
        GL.cats[k].draw(i, d, {x: 500, y: 350, s: 1, at: 0, hit: 1.8});
        GL.finish({hold: 0}); window.setT(window.DURATION);
        const root = svg.querySelector(':scope > g');
        const seen = e => { for (let x = e; x && x !== svg; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || +cs.opacity < .05) return false; } return true; };
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        root.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse,text,image').forEach(e => {
          if (e.closest('clipPath,defs') || !seen(e)) return; const r = e.getBoundingClientRect(); if (r.width < .5 && r.height < .5) return;
          x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); });
        if (x1 > x0 && y1 > y0) res[`${k}.${v.id}`] = +((x1 - x0) / (y1 - y0)).toFixed(2);
        svg.remove();
      } catch (e) { res[`${k}.${v.id}`] = null; }
    });
    done(res);
  })));
  await b.close(); fs.rmSync(dir, {recursive: true, force: true});
  const bad = Object.entries(out).filter(([, v]) => !v).map(([k]) => k);
  fs.writeFileSync(path.join(__dirname, 'shapes.json'), JSON.stringify(out).replace(/,"/g, ',\n"') + '\n');
  const v = Object.values(out).filter(Boolean).sort((a, b) => a - b);
  console.log(`${v.length} designs measured · width/height from ${v[0]} to ${v[v.length - 1]} · middle ${v[v.length >> 1]}` + (bad.length ? ` · not measured: ${bad.join(' ')}` : ''));
  if (errs.length) console.log('page errors:', errs.slice(0, 3));
})();
