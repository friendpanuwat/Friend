// clip_audit.js <skill sheet.html>… (2026-11-27, LESSONS 85): for every drawing on a glow-line-motion sheet (the yellow cards), how far its
// parts' boxes reach past what really shows (clip-paths), as a share of the card: before glowClipRect such a drawing was shrunk in
// motionFit styles. Run from .claude/skills/glow-line-motion/examples: node <this> $(ls b??s/sheet-S?.html) sg/sheet.html s7g/sheet-S7.html
// Prints "ok" or the cards over 4 %.
const {chromium} = require('playwright'), path = require('path'), fs = require('fs');
const src = fs.readFileSync(path.join(__dirname, '../glow/bridge.js'), 'utf8'), fn = src.slice(src.indexOf('function glowClipRect'), src.indexOf('function glowVisibleBox'));
(async () => { const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1080, height: 1920}});
  for (const sheet of process.argv.slice(2)) {
    await p.goto('file://' + path.resolve(sheet)); await p.waitForTimeout(800);
    await p.addScriptTag({content: fn});
    const r = await p.evaluate(() => { const svg = document.querySelector('svg'), yellow = c => { const m = String(c).match(/\d+/g); return m && +m[0] > 180 && +m[1] > 130 && +m[2] < 110; };
      setT(DURATION * .7); const cards = [...svg.querySelectorAll('rect')].filter(e => yellow(getComputedStyle(e).stroke) && e.getBoundingClientRect().width > 60).map(e => e.getBoundingClientRect()).map(r => ({r, raw: null, vis: null}));
      const seen = e => { for (let x = e; x && x !== svg; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || +cs.opacity < .05) return false; } return true; };
      const U = (a, q) => a ? {l: Math.min(a.l, q.left), t: Math.min(a.t, q.top), r: Math.max(a.r, q.right), b: Math.max(a.b, q.bottom)} : {l: q.left, t: q.top, r: q.right, b: q.bottom};
      for (let k = 0; k <= 24; k++) { setT(DURATION * k / 24);
        svg.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse,text,image').forEach(e => { if (e.closest('clipPath,defs') || !seen(e)) return;
          const raw = e.getBoundingClientRect(); if (raw.width < .5 && raw.height < .5) return; const vis = glowClipRect(e, svg, raw);
          const q = vis ?? raw, cx = (q.left + q.right) / 2, cy = (q.top + q.bottom) / 2;
          const c = cards.find(c => cx > c.r.left && cx < c.r.right && cy > c.r.top && cy < c.r.bottom); if (!c || yellow(getComputedStyle(e).stroke)) return;
          c.raw = U(c.raw, raw); if (vis) c.vis = U(c.vis, vis); }); }
      window.__n = cards.length; return [].concat(cards.map((c, i) => { if (!c.raw || !c.vis) return null; const W = c.r.width, H = c.r.height;
        const over = Math.max((c.vis.l - c.raw.l) / W, (c.raw.r - c.vis.r) / W, (c.vis.t - c.raw.t) / H, (c.raw.b - c.vis.b) / H);
        return {i, row: Math.round(c.r.top), col: Math.round(c.r.left), over: +over.toFixed(2)}; }).filter(x => x && x.over > .04)); });
    console.log(path.basename(path.dirname(sheet)) + '/' + path.basename(sheet), r.length ? JSON.stringify(r) : 'ok'); }
  await b.close(); })();
