// Measure every visible text box of a built scene at the given times (used by render_check.py; nothing is rendered to disk).
// usage: node render_check.js <scene_dir> <times.json>   → JSON on stdout: {errors: [...page errors], planErr: [[what, index, msg]], samples: [{t, texts: [...]}]}
// A text = one element's own text nodes: {id, owner: card|sub|widget, text, box: [x0,y0,x1,y1], fs, clip: [..] | null}.
// `box` is the INK of the letters, Thai marks above and below included: the line box from Range.getClientRects, cut down
// to the ink with canvas measureText (actualBoundingBox vs fontBoundingBox, scaled by any transform). Line boxes of a
// Thai font are much taller than its letters, so they overlap on every two-row subtitle Friend approved; the ink does not.
// `parts` = the same ink box per letter cluster (a consonant with its marks); overlap is tested on these.
// Texts parked off-screen (the font warmer in motion.js sits at left -9999) are skipped.
const { chromium } = require('playwright');
// no network in the render browser: AI-written scene code (plan/custom_check.py) can never reach anything outside the page
const NO_NET = ['--proxy-server=http://127.0.0.1:9', '--proxy-bypass-list=<-loopback>', '--host-resolver-rules=MAP * ~NOTFOUND'];
const path = require('path'), fs = require('fs');
(async () => {
  const [dir, timesFile] = process.argv.slice(2);
  const times = JSON.parse(fs.readFileSync(timesFile, 'utf8'));
  const browser = await chromium.launch({ args: NO_NET });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto('file://' + path.join(path.resolve(dir), 'scene.html'));
  await page.evaluate(() => document.fonts.ready);
  const planErr = await page.evaluate(() => window.__planErr || []);   // [[scene|subtitle|camera, index, message]] from guard mode
  const samples = [];
  for (const t of times) {
    try { await page.evaluate(t => window.seek(t), t); } catch (e) { errors.push(String(e.message || e)); break; }
    const texts = await page.evaluate(() => {
      const ids = window.__ids ??= new WeakMap(); let next = window.__next ??= { n: 0 };
      const shown = el => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) {
        const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= parseFloat(cs.opacity); } return o; };
      const owner = el => el.closest('.card') ? 'card' : el.closest('.cap') ? 'sub' : 'widget';
      const clipOf = el => { for (let e = el.parentElement; e && e.id !== 'g' && e.id !== 'S'; e = e.parentElement) {
        const cs = getComputedStyle(e); if (cs.overflow === 'hidden' || cs.overflowX === 'hidden' || (cs.clipPath && cs.clipPath !== 'none')) {
          const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom]; } } return null; };
      const seg = new Intl.Segmenter('th', { granularity: 'grapheme' }), out = [], byEl = new Map(), ctx = (window.__cv ??= document.createElement('canvas')).getContext('2d');
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n; (n = w.nextNode());) {
        if (!n.textContent.trim()) continue;
        const el = n.parentElement; if (!el || el.closest('script,style,#flash')) continue;
        const r = document.createRange(); r.selectNodeContents(n);
        const rects = [...r.getClientRects()].filter(q => q.width > 0 && q.height > 0); if (!rects.length) continue;
        const cs = getComputedStyle(el);
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const m = ctx.measureText(n.textContent.trim()), fH = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
        const b = byEl.get(el) ?? { text: '', box: [1e9, 1e9, -1e9, -1e9], parts: [] };
        b.text += n.textContent;
        for (const q of rects) {
          const k = q.height / fH;   // CSS transforms scale the line box; scale the ink the same way
          const y0 = q.top + (m.fontBoundingBoxAscent - m.actualBoundingBoxAscent) * k, y1 = q.top + (m.fontBoundingBoxAscent + m.actualBoundingBoxDescent) * k;
          b.box[0] = Math.min(b.box[0], q.left); b.box[1] = Math.min(b.box[1], y0); b.box[2] = Math.max(b.box[2], q.right); b.box[3] = Math.max(b.box[3], y1);
        }
        // the same per letter cluster (consonant + its marks), so two words only "touch" where letters really meet
        let off = 0;
        for (const { segment: g } of seg.segment(n.textContent)) {
          if (g.trim()) {
            const gr = document.createRange(); gr.setStart(n, off); gr.setEnd(n, off + g.length);
            const q = [...gr.getClientRects()].find(z => z.width > 0 && z.height > 0);
            if (q) { const gm = ctx.measureText(g), k = q.height / fH;
              b.parts.push([q.left - Math.max(0, gm.actualBoundingBoxLeft) * k, q.top + (m.fontBoundingBoxAscent - gm.actualBoundingBoxAscent) * k,
                            q.left + Math.max(q.width, gm.actualBoundingBoxRight * k), q.top + (m.fontBoundingBoxAscent + gm.actualBoundingBoxDescent) * k].map(v => Math.round(v * 10) / 10)); }
          }
          off += g.length;
        }
        byEl.set(el, b);
      }
      for (const [el, b] of byEl) {
        if (shown(el) < .5 || b.box[2] < -500) continue;
        if (!ids.has(el)) ids.set(el, next.n++);
        out.push({ id: ids.get(el), owner: owner(el), text: b.text.trim(), box: b.box.map(v => Math.round(v * 10) / 10), parts: b.parts, fs: parseFloat(getComputedStyle(el).fontSize), clip: clipOf(el) });
      }
      return out;
    });
    samples.push({ t, texts });
  }
  await browser.close();
  process.stdout.write(JSON.stringify({ errors, planErr, samples }));
})();
