/* CutPack · uni · picture sizes of a built real clip (2026-11-17, Friend: "ทำไมโมชั่นกราฟฟิกเล็กจังเลยมันดูโล่งๆอ่ะ")
   For every picture of the page, at its end: how much of the screen it really shows, anything outside the TikTok / IG safe
   zone (neonSafeCheck) and its own lines under 3:1 (glowCheckOne). A line that fades on purpose (a pulse ring) shows here too.
   usage: NODE_PATH=$(npm root -g) node tools/picture_sizes.js <project dir with scene.html + src_frames>   (st_neon of clip_all_styles.sh) */
const {chromium} = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1080, height: 1920}});
  await p.goto('file://' + path.resolve(process.argv[2], 'scene.html')); await p.waitForFunction(() => window.GLOW_READY !== false, null, {timeout: 120000});
  const wins = await p.evaluate(() => CLIPWINS.map(x => [x.t0, x.t1, x.F.name])); let tot = 0;
  for (const [t0, t1, name] of wins) { const t = t1 - .35; const f = Math.round(t * 30);
    await p.evaluate(([t, s]) => window.seek(t, s), [t, 'file://' + path.resolve(process.argv[2], 'src_frames/s' + String(f + 1).padStart(5, '0') + '.jpg')]);
    const r = await p.evaluate((t0) => { const w = CLIPWINS.find(x => Math.abs(x.t0 - t0) < .01), host = w.F.stage.querySelector('.glow-host'), svg = host.querySelector('svg');
      const seen = e => { for (let x = e; x && x !== svg; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || +cs.opacity < .05) return false; } return true; };
      let u = null; svg.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse,text').forEach(e => { if (e.closest('clipPath,defs') || !seen(e)) return; const r = e.getBoundingClientRect(); if (r.width < .5 && r.height < .5) return;
        u = u ? [Math.min(u[0], r.left), Math.min(u[1], r.top), Math.max(u[2], r.right), Math.max(u[3], r.bottom)] : [r.left, r.top, r.right, r.bottom]; });
      return {pic: [Math.round(u[2] - u[0]), Math.round(u[3] - u[1])], frame: Math.round(100 * (u[2] - u[0]) * (u[3] - u[1]) / (1080 * 1920)), unsafe: neonSafeCheck().map(x => x.what + ' ' + x.box), low: glowCheckOne(host).filter(x => x.ratio < 3).map(x => x.what + ' ' + x.ratio)}; }, t0);
    tot += r.frame; console.log(t0.toFixed(1), name.padEnd(7), 'picture', r.pic.join('x'), String(r.frame).padStart(2) + '% of the screen', r.unsafe.length ? 'OUTSIDE ' + r.unsafe.join(' | ') : '', r.low.length ? 'LOW ' + r.low.join(' | ') : ''); }
  console.log('average', Math.round(tot / wins.length) + '%'); await b.close(); })();
