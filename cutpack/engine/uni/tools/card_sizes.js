/* CutPack · uni · the card and picture box of every picture of a built clip against the 6 standard sizes (2026-11-19, Friend: "ผมแค่อยากจะดูขนาดของการ์ดว่ามันตรงตามที่เราวางแผนไว้ไหม")
   The style marks each card with data-std="<size>:<scale>" (lime). Prints per picture: time · screen · size · scale % · the standard box at that scale ·
   the card and the picture box on the page (the picture box follows the drawing's shape inside the standard box, common.md 4.1).
   usage: NODE_PATH=$(npm root -g) node tools/card_sizes.js <built page dir (build_only.sh / st_<style>)> [<shots dir>]
   with a shots dir: one still per picture with the standard box (dashed magenta) and the card (cyan) drawn over it */
const {chromium} = require('playwright'), path = require('path'), fs = require('fs');
const STD = {1: [860, 230], 2: [860, 470], 3: [560, 490], 4: [400, 635], 5: [860, 710], 6: [860, 965]};
(async () => { const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1080, height: 1920}}), D = path.resolve(process.argv[2]);
  await p.goto('file://' + path.join(D, 'scene.html')); await p.waitForFunction(() => window.GLOW_READY !== false, null, {timeout: 120000});
  const wins = await p.evaluate(() => CLIPWINS.map(x => [x.t0, x.t1, x.F.name])), N = fs.readdirSync(path.join(D, 'src_frames')).length;
  for (const [t0, t1, name] of wins) { const t = Math.min(t1 - .35, (N - 2) / 30), f = Math.round(t * 30);
    await p.evaluate(([t, s]) => window.seek(t, s), [t, 'file://' + path.join(D, 'src_frames/s' + String(f + 1).padStart(5, '0') + '.jpg')]);
    const r = await p.evaluate(t0 => { const w = CLIPWINS.find(x => Math.abs(x.t0 - t0) < .01), st = w.F.stage, c = st.closest('.l-card') ?? document.querySelector('[data-std]');
      const R = e => { const q = e.getBoundingClientRect(); return [Math.round(q.width), Math.round(q.height)]; };
      const q = c?.getBoundingClientRect(); return {std: c?.dataset.std ?? null, card: c ? R(c) : null, stage: R(st), xy: q ? [q.left, q.top] : null}; }, t0);
    const [k, s] = (r.std ?? '').split(':'), box = k ? STD[k].map(v => Math.round(v * s)) : null;
    if (process.argv[3] && k) {
      const [cw, ch] = r.card, [bw, bh] = [box[0] + 52, box[1] + 70], [x, y] = r.xy, a = name === 'top' ? 'bottom' : /side|screen/.test(name) ? 'center' : 'top';
      const bx = x + cw / 2 - bw / 2, by = a === 'bottom' ? y + ch - bh : a === 'center' ? y + ch / 2 - bh / 2 : y;
      await p.evaluate(([bx, by, bw, bh, x, y, cw, ch, lab]) => { document.querySelectorAll('.cs-mark').forEach(e => e.remove());
        const d = (css, t = '') => { const e = document.createElement('div'); e.className = 'cs-mark'; e.style.cssText = 'position:fixed;z-index:999;box-sizing:border-box;' + css; e.textContent = t; document.body.appendChild(e); };
        d(`left:${bx}px;top:${by}px;width:${bw}px;height:${bh}px;border:5px dashed #ff3df5`); d(`left:${x}px;top:${y}px;width:${cw}px;height:${ch}px;border:4px solid #3df0ff`);
        d('left:0;right:0;bottom:0;padding:24px 30px 40px;background:rgba(0,0,0,.85);color:#fff;font:600 40px Anuphan,sans-serif', lab); },
        [bx, by, bw, bh, x, y, cw, ch, `${t0.toFixed(1)} s · ${name} · ขนาด ${k} · ${Math.round(s * 100)}% · การ์ด ${cw}×${ch}`]);
      fs.mkdirSync(process.argv[3], {recursive: true}); await p.screenshot({path: path.join(process.argv[3], `c_${t0.toFixed(1).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 85});
    }
    console.log(t0.toFixed(1).padStart(5), name.padEnd(12), k ? `size ${k} · ${Math.round(s * 100)}% · box ${box.join('x')} · card ${r.card.join('x')} · picture ${r.stage.join('x')}` : `no standard size (picture ${r.stage.join('x')})`); }
  await b.close(); })();
