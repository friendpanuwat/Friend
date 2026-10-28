/* ===================== ART SCREENS — "real screen" tiles: the detail that makes it look professional =====================
   Each tile behaves like a frame from a motion designer's screen: editor chrome (the clip's own timecode, a scrubber, frame
   ticks), selection boxes with handles, hand-written notes with arrows, particle spheres, analytics-style area charts,
   node graphs whose wires draw to cards, sticker-style editorial illustration. Tiny chrome text is only real data
   (the clip's timecode) or words from the transcript. */
const MONO = 'font-family:Sans;font-weight:500;font-variant-numeric:tabular-nums';   // the one font, tabular digits
const tc = t => { const f = Math.max(0, Math.floor(t * 30)), s = Math.floor(f / 30); return `00:00:${String(s).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`; };

/* screen(s, x, y, w, h, t, {bg, dark}) — a tile with editor chrome: timecode top-right, a scrubber along the bottom, hairline frame */
function screen(s, x, y, w, h, t, {bg = '#0A0A0C', dark = true, from = 'pop', chrome = true, r = 26} = {}) {
  const el = tile(s, x, y, w, h, t, {bg, from, r});
  if (!chrome) return el;
  const fg = dark ? 'rgba(255,255,255,' : 'rgba(10,10,12,';
  div(`left:14px;top:14px;right:14px;bottom:14px;border:1px solid ${fg}.08);border-radius:${r - 10}px`, el);
  const tcEl = div(`right:30px;top:24px;${MONO};font-size:17px;letter-spacing:.06em;color:${fg}.55)`, el);
  HOOKS.push(tt => { tcEl.textContent = tc(tt); });
  [0, 1, 2].forEach(i => div(`left:${30 + i * 16}px;top:30px;width:8px;height:8px;border-radius:50%;background:${fg}${i ? .18 : .5})`, el));
  const bar = div(`left:30px;right:30px;bottom:26px;height:2px;background:${fg}.12)`, el);
  for (let i = 0; i <= 24; i++) div(`left:${i / 24 * 100}%;bottom:6px;width:1px;height:${i % 4 ? 5 : 10}px;background:${fg}.22)`, bar);
  const head = div(`left:0;bottom:-7px;width:2px;height:16px;background:${TC.orange}`, bar);
  A(head, [{left: '0%'}, {left: '100%'}], t, 4, {e: 'linear'});
  return el;
}
/* select(el, x, y, w, h, t) — an editor selection box with corner and mid handles that snaps around something */
function select(el, x, y, w, h, t, {color = '#4C7DFF'} = {}) {
  const b = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:2px solid ${color}`, el);
  [[0, 0], [.5, 0], [1, 0], [0, .5], [1, .5], [0, 1], [.5, 1], [1, 1]].forEach(([u, v]) => div(`left:${u * w - 6}px;top:${v * h - 6}px;width:12px;height:12px;background:#fff;border:2px solid ${color}`, b));
  A(b, [{opacity: 0, transform: 'scale(1.15)'}, {opacity: 1, transform: 'none'}], t, .35, {e: OUTX}); return b;
}
/* note(el, x, y, text, t, {to, color}) — a hand-written note with a drawn arrow pointing at (to.x, to.y) */
function note(el, x, y, text, t, {to, color = '#4C7DFF', size = 34} = {}) {
  const n = div(`left:${x}px;top:${y}px;font-family:Accent;font-style:italic;font-weight:600;font-size:${size}px;color:${color};white-space:nowrap`, el, text);
  A(n, [{opacity: 0, transform: 'translateY(8px)'}, {opacity: 1, transform: 'none'}], t + .25, .35, {e: OUTX});
  if (to) { const sx = x - 10, sy = y + size * .6, mx = (sx + to.x) / 2, my = Math.min(sy, to.y) - 30;
    const a = div('left:0;top:0;width:1px;height:1px;overflow:visible', el, `<svg width="1" height="1" style="overflow:visible"><path d="M${sx} ${sy} Q${mx} ${my} ${to.x} ${to.y}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
      <path class="h" d="M${to.x} ${to.y} l12 -4 M${to.x} ${to.y} l4 12" stroke="${color}" stroke-width="3" stroke-linecap="round" opacity="0"/></svg>`);
    A(a.querySelector('path'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t, .4, {e: OUTQ});
    A(a.querySelector('.h'), [{opacity: 0}, {opacity: 1}], t + .38, .1); }
  return n;
}
/* sphere(el, cx, cy, R, t0, {color, n, spin, burst}) — a sphere made of hundreds of glowing particles, slowly turning;
   from `burst` on, the particles drift apart and fade (something that disappears) */
function sphere(el, cx, cy, R, t0, {color = '255,122,26', n = 520, spin = .35, burst = null, t1 = 1e9, horizon = false} = {}) {
  const W = parseFloat(el.style.width), H = parseFloat(el.style.height), cv = document.createElement('canvas'); cv.width = W * 2; cv.height = H * 2;
  cv.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px`; el.appendChild(cv); const g = cv.getContext('2d');
  const pts = Array.from({length: n}, (_, i) => { const y = 1 - (i + .5) / n * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996; return [Math.cos(a) * r, y, Math.sin(a) * r, (i * 7919 % 100) / 100]; });
  HOOKS.push(t => { g.clearRect(0, 0, cv.width, cv.height); if (t < t0 || t > t1) return;
    const grow = clamp((t - t0) / .7), e = 1 - Math.pow(1 - grow, 3), rot = (t - t0) * spin, b = burst == null ? 0 : clamp((t - burst) / 1.1);
    for (const [x, y, z, k] of pts) { const X = x * Math.cos(rot) - z * Math.sin(rot), Z = x * Math.sin(rot) + z * Math.cos(rot);
      const d = 1 + b * (1.2 + k * 2.2), px = cx + X * R * e * d, py = cy + (y * R * e * d) - b * b * 160 * k, depth = (Z + 1) / 2;
      if (horizon && py < cy - R * .05) continue;
      const a = (.18 + .82 * depth) * (1 - b) * grow; if (a <= .01) continue;
      g.fillStyle = `rgba(${color},${a})`; g.beginPath(); g.arc(px * 2, py * 2, (1.2 + depth * 2.2) * 2, 0, 6.283); g.fill(); }
    const glow = g.createRadialGradient(cx * 2, cy * 2, 0, cx * 2, cy * 2, R * 2.4); glow.addColorStop(0, `rgba(${color},${.16 * grow * (1 - b)})`); glow.addColorStop(1, `rgba(${color},0)`);
    g.fillStyle = glow; g.fillRect(0, 0, cv.width, cv.height); });
  return cv;
}
/* area(el, x, y, w, h, t, {color, dir, dur}) — an analytics area chart: a jagged line that draws, a soft fill, a live end dot */
function areaChart(el, x, y, w, h, t, {color = '#3D7BFF', dir = 'up', dur = 1.4, seed = 3} = {}) {
  const r = rnd(seed), n = 34, pts = Array.from({length: n}, (_, i) => { const p = i / (n - 1), base = dir === 'up' ? .85 - .7 * p ** 1.4 : .18 + .7 * p ** 1.3; return [p * w, clamp(base + (r() - .5) * .12, .03, .97) * h]; });
  const d = 'M' + pts.map(p => p.map(v => v.toFixed(1)).join(' ')).join(' L'), id = gid('ac');
  const sv = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, el, `<svg width="${w}" height="${h}" style="overflow:visible"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".45"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <path class="f" d="${d} L${w} ${h} L0 ${h} Z" fill="url(#${id})"/><path class="l" d="${d}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/>
    <circle class="c" cx="${pts.at(-1)[0]}" cy="${pts.at(-1)[1]}" r="7" fill="#fff" style="filter:drop-shadow(0 0 8px ${color})"/></svg>`);
  A(sv.querySelector('.l'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t, dur, {e: 'cubic-bezier(.4,0,.2,1)'});
  A(sv.querySelector('.f'), [{clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0 0 0)'}], t, dur, {e: 'cubic-bezier(.4,0,.2,1)'});
  A(sv.querySelector('.c'), [{opacity: 0}, {opacity: 1}], t + dur, .2); return sv;
}
/* metrics(el, x, y, n, t) — a strip of metric slots like an analytics header (dots + bars, no invented figures) */
function metrics(el, x, y, w, t, {colors = ['#3D7BFF', '#8A8A96', '#8A8A96'], active = 0} = {}) {
  colors.forEach((c, i) => { const m = div(`left:${x + i * w / colors.length}px;top:${y}px;width:${w / colors.length - 20}px;height:70px`, el);
    div(`left:0;top:0;width:10px;height:10px;border-radius:50%;background:${c}`, m); div(`left:18px;top:-2px;width:70px;height:12px;border-radius:6px;background:rgba(255,255,255,.18)`, m);
    const v = div(`left:0;top:26px;width:${i === active ? 160 : 60}px;height:26px;border-radius:8px;background:rgba(255,255,255,${i === active ? .9 : .25})`, m);
    if (i === active) div(`left:0;top:66px;width:100%;height:3px;background:${c}`, m);
    A(m, [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], t + i * .08, .4, {e: OUTX}); });
}
/* appIcon(el, x, y, size, t, {glyph, color}) — a soft app-icon tile (the hub of a node graph) */
function appIcon(el, x, y, size, t, {glyph = 'M50 14 V86 M14 50 H86 M24 24 L76 76 M76 24 L24 76', color = TC.orange, label = ''} = {}) {
  const a = div(`left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:${size * .24}px;background:#fff;box-shadow:0 18px 40px rgba(10,12,20,.14),inset 0 -3px 0 rgba(10,12,20,.05)`, el);
  icon(a, glyph, size / 2, size / 2, size * .6, t + .15, {color, width: 7});
  A(a, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'none'}], t, .5, {e: 'cubic-bezier(.3,1.4,.5,1)'});
  if (label) { const l = div(`left:${x - 60}px;top:${y + size + 16}px;width:${size + 120}px;text-align:center;${MONO};font-weight:700;font-size:24px;color:#14161C`, el, label); A(l, [{opacity: 0}, {opacity: 1}], t + .2, .3); }
  return a;
}
/* wire(el, from, to, t) — a curved wire that draws from one point to another */
function wire(el, [x0, y0], [x1, y1], t, {color = '#4C9BFF', w = 3.5, d = .5} = {}) {
  const mx = (x0 + x1) / 2, sv = div('left:0;top:0;width:1px;height:1px;overflow:visible', el, `<svg width="1" height="1" style="overflow:visible"><path d="M${x0} ${y0} C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/></svg>`);
  A(sv.querySelector('path'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t, d, {e: OUTQ}); return sv;
}
/* sticker(el, x, y, w, h, t, {fill, label}) — editorial-illustration block: thick ink outline, hard offset shadow */
function stickerBox(el, x, y, w, h, t, {fill = '#FFD23F', r = 12, rot = 0} = {}) {
  const b = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${r}px;background:${fill};border:4px solid #14161C;box-shadow:6px 6px 0 #14161C;transform:rotate(${rot}deg)`, el);
  A(b, [{opacity: 0, transform: `rotate(${rot}deg) scale(.6)`}, {opacity: 1, transform: `rotate(${rot}deg)`}], t, .45, {e: 'cubic-bezier(.3,1.5,.5,1)'}); return b;
}
function starburst(el, x, y, r, t, {fill = '#FF5CC8'} = {}) {
  const pts = Array.from({length: 24}, (_, i) => { const a = i / 24 * Math.PI * 2, rr = i % 2 ? r * .62 : r; return `${(r + Math.cos(a) * rr).toFixed(1)},${(r + Math.sin(a) * rr).toFixed(1)}`; }).join(' ');
  const s = div(`left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px`, el, `<svg width="${2 * r}" height="${2 * r}"><polygon points="${pts}" fill="${fill}" stroke="#14161C" stroke-width="3"/></svg>`);
  A(s, [{opacity: 0, transform: 'scale(0) rotate(-40deg)'}, {opacity: 1, transform: 'none'}], t, .45, {e: 'cubic-bezier(.3,1.5,.5,1)'});
  A(s, [{rotate: '0deg'}, {rotate: '20deg'}], t + .45, 2, {it: 3, dir: 'alternate', f: 'none', e: 'ease-in-out'}); return s;
}
const hazard = (el, x, y, w, h, t) => { const z = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:3px solid #14161C;background:repeating-linear-gradient(45deg,#FFD23F 0 14px,#14161C 14px 28px);transform:rotate(-8deg)`, el); pop(z, t, {y: 10}); return z; };
/* dotGlyph(el, ch, cx, cy, size, t, {color}) — a glyph (a symbol, e.g. ?) rebuilt as a dot matrix that pops in dot by dot */
function dotGlyph(el, ch, cx, cy, size, t, {color = '255,255,255', step = 9, font = '900 100px Display'} = {}) {
  const W = parseFloat(el.style.width), H = parseFloat(el.style.height), cv = document.createElement('canvas'); cv.width = W * 2; cv.height = H * 2;
  cv.style.cssText = `position:absolute;left:0;top:0;width:${W}px;height:${H}px`; el.appendChild(cv); const g = cv.getContext('2d');
  let dots = null;   // dot order is deterministic: every render worker draws the same frame
  HOOKS.push(tt => { if (!dots) { const o = document.createElement('canvas'); o.width = o.height = 200; const og = o.getContext('2d'); og.font = font.replace('100px', '170px'); og.textAlign = 'center'; og.textBaseline = 'middle'; og.fillStyle = '#000'; og.fillText(ch, 100, 108);
      const d = og.getImageData(0, 0, 200, 200).data; dots = []; const k = size / 200;
      for (let y = 0; y < 200; y += step / k) for (let x = 0; x < 200; x += step / k) if (d[(Math.floor(y) * 200 + Math.floor(x)) * 4 + 3] > 128) dots.push([cx + (x - 100) * k, cy + (y - 100) * k, (Math.floor(x) * 7 + Math.floor(y) * 13) % 100 / 100]); }
    g.clearRect(0, 0, cv.width, cv.height);
    for (const [x, y, r] of dots) { const p = clamp((tt - t - r * .6) / .25); if (p <= 0) continue; g.fillStyle = `rgba(${color},${p})`; g.beginPath(); g.arc(x * 2, y * 2, step * .8 * p, 0, 6.283); g.fill(); } });
  return cv;
}
/* layers(el, x, y, w, rows, t) — an editor layer panel: colour-coded rows with an eye toggle and a bar on the timeline.
   rows: [{name, color, off: tOff}] — a row with `off` gets its eye switched off and its bar struck at that time */
function layers(el, x, y, w, rows, t, {dark = true} = {}) {
  const fg = dark ? '#E8E8EE' : '#14161C', mute = dark ? 'rgba(255,255,255,.14)' : 'rgba(10,10,12,.1)';
  return rows.map((r, i) => { const row = div(`left:${x}px;top:${y + i * 92}px;width:${w}px;height:76px;border-radius:14px;background:${dark ? '#16171C' : '#fff'};border:1px solid ${mute}`, el); pop(row, t + i * .08, {y: 14});
    const eye = div(`left:18px;top:22px;width:32px;height:32px`, row, `<svg viewBox="0 0 24 24" width="32" height="32"><path d="M2 12 C5 6 19 6 22 12 C19 18 5 18 2 12 Z" fill="none" stroke="${fg}" stroke-width="2"/><circle cx="12" cy="12" r="3.2" fill="${fg}"/><path class="sl" d="M4 4 L20 20" stroke="#F2481C" stroke-width="2.6" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/></svg>`);
    div(`left:64px;top:30px;width:16px;height:16px;border-radius:4px;background:${r.color}`, row);
    if (r.name) div(`left:94px;top:16px;font-family:Sans;font-weight:600;font-size:34px;color:${fg};white-space:nowrap`, row, r.name); else div(`left:94px;top:30px;width:${120 + i * 30}px;height:16px;border-radius:8px;background:${mute}`, row);
    const bar = div(`left:${w * .5 + (i % 3) * 30}px;top:20px;width:${w * .38 - (i % 3) * 30}px;height:36px;border-radius:10px;background:${r.color}`, row);
    A(bar, [{transform: 'scaleX(0)'}, {transform: 'none'}], t + .2 + i * .08, .5, {e: OUTX}); bar.style.transformOrigin = 'left';
    if (r.off != null) { A(eye.querySelector('.sl'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], r.off, .3, {e: OUTX});
      A(row, [{opacity: 1}, {opacity: .45}], r.off + .1, .3, {f: 'forwards'});
      const st = div(`left:${w * .48}px;top:36px;width:${w * .44}px;height:5px;border-radius:3px;background:#F2481C;transform-origin:left`, row); A(st, [{transform: 'scaleX(0)'}, {transform: 'none'}], r.off + .15, .35, {e: OUTX}); }
    return row; });
}
