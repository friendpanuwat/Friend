/* CutPack · uni · picture sizes of a built real clip (2026-11-17, Friend: "ทำไมโมชั่นกราฟฟิกเล็กจังเลยมันดูโล่งๆอ่ะ")
   For every picture of the page, at its end: how much of the screen it really shows, anything outside the TikTok / IG safe
   zone (styleSafeCheck) and its own lines under 3:1 (glowCheckOne). Both read what really shows: a part cut by its card or window is not counted (cpClipBox). A line that fades on purpose (a pulse ring) shows here too.
   THE SAFE ZONE IS READ BEFORE ANYTHING STARTS LEAVING (2026-11-20, Friend: "ผมว่าเลื่อนลงไปเหมือนเดิมน่ะดีแล้ว" + "2 เริ่มได้"): a style whose
   scene slides out (lime's split screens: the card slides down past the buttons, the words slide up off the top) sets ST.exitLead = the
   seconds before t1 that the move starts, and the zone is read at t1 − exitLead instead. The sizes are still read at t1 − 0.35.
   usage: NODE_PATH=$(npm root -g) node tools/picture_sizes.js <project dir with scene.html + src_frames>   (st_neon of clip_all_styles.sh) */
const {chromium} = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1080, height: 1920}});
  await p.goto('file://' + path.resolve(process.argv[2], 'scene.html')); await p.waitForFunction(() => window.GLOW_READY !== false, null, {timeout: 120000});
  const wins = await p.evaluate(() => CLIPWINS.map(x => [x.t0, x.t1, x.F.name])); let tot = 0;
  const lead = await p.evaluate(() => (typeof ST !== 'undefined' && ST && ST.exitLead) || 0);
  const seek = async (t) => { const f = Math.round(t * 30);
    await p.evaluate(([t, s]) => window.seek(t, s), [t, 'file://' + path.resolve(process.argv[2], 'src_frames/s' + String(f + 1).padStart(5, '0') + '.jpg')]); };
  const N = require('fs').readdirSync(path.resolve(process.argv[2], 'src_frames')).length;   // the clip's frames (read once)
  for (const [t0, t1, name] of wins) { const t = Math.min(t1 - .35, (N - 2) / 30);
    let unsafe = null;
    if (lead > .35) { await seek(Math.max(t0 + .05, Math.min(t1 - lead, (N - 2) / 30))); unsafe = await p.evaluate(() => styleSafeCheck().map(x => x.what + ' ' + x.box)); }
    await seek(t);
    const r = await p.evaluate((t0) => { const w = CLIPWINS.find(x => Math.abs(x.t0 - t0) < .01), host = w.F.stage.querySelector('.glow-host'), svg = host.querySelector('svg');
      const seen = e => { for (let x = e; x && x !== svg; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || +cs.opacity < .05) return false; } return true; };
      let u = null; svg.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse,text').forEach(e => { if (e.closest('clipPath,defs') || !seen(e)) return; const r = e.getBoundingClientRect(); if (r.width < .5 && r.height < .5) return;
        u = u ? [Math.min(u[0], r.left), Math.min(u[1], r.top), Math.max(u[2], r.right), Math.max(u[3], r.bottom)] : [r.left, r.top, r.right, r.bottom]; });
      if (!u) return {pic: [0, 0], frame: 0, none: true, unsafe: styleSafeCheck().map(x => x.what + ' ' + x.box), low: []};   // a screen without a picture (teal's number card, 2026-11-18)
      const c = cpClipBox(svg, {left: u[0], top: u[1], right: u[2], bottom: u[3]}); if (c) u = [c.left, c.top, c.right, c.bottom];   // what really shows (cut by its card / window, 2026-11-24)
      return {pic: [Math.round(u[2] - u[0]), Math.round(u[3] - u[1])], frame: Math.round(100 * (u[2] - u[0]) * (u[3] - u[1]) / (1080 * 1920)), unsafe: styleSafeCheck().map(x => x.what + ' ' + x.box), low: glowCheckOne(host).filter(x => x.ratio < 3).map(x => x.what + ' ' + x.ratio)}; }, t0);
    if (unsafe) r.unsafe = unsafe;   // read before the exit slide (ST.exitLead)
    tot += r.frame; console.log(t0.toFixed(1), name.padEnd(7), r.none ? 'no picture (the screen has none)' : 'picture', r.pic.join('x'), String(r.frame).padStart(2) + '% of the screen', r.unsafe.length ? 'OUTSIDE ' + r.unsafe.join(' | ') : '', r.low.length ? 'LOW ' + r.low.join(' | ') : ''); }
  console.log('average', Math.round(tot / wins.length) + '%'); await b.close(); })();
