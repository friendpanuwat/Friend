/* Clip: "เริ่มทำไปก่อน + Jarua" (85.8 s)
   Requests: (1) motion-graphic scenes sit on the ORIGINAL clip, blurred (no navy/aurora background)
             (2) no colour grade on the video  (3) more varied shapes than glass blocks, kept restrained */

/* ===================== PROJECT OVERRIDES ===================== */
// (2) no grade: raw video, no tone/vignette/grain layers
document.head.insertAdjacentHTML('beforeend', `<style>
#v{filter:none!important}#tone,#vig,#grain,#bloom{display:none!important}
.outline .g{color:transparent!important;-webkit-text-stroke:3px rgba(255,255,255,.92);text-shadow:none!important}
.lbl{font-family:BodyFont;font-size:34px;color:rgba(255,255,255,.62);white-space:nowrap}
</style>`);
// async work after each seek (images that must be decoded before the screenshot)
const PRE = [];
Object.defineProperty(window, 'seek', {configurable: true, set(fn) {
  Object.defineProperty(window, 'seek', {configurable: true, writable: true, value: async (t, src) => { await fn(t, src); for (const p of PRE) await p(t); }});
}});
const VID = document.getElementById('v');
// (1) blurred-source background: each scene paints the current source frame into a tiny canvas, CSS upscales + blurs it
const BGS = [];
PRE.push(t => { for (const [a, b, ctx] of BGS) if (t >= a && t <= b) { ctx.imageSmoothingQuality = 'high'; ctx.drawImage(VID, 0, 0, 108, 192); } });
function bscene(t0, t1, {tilt = 3, dim = .36} = {}) {
  const root = div('inset:0;opacity:0;overflow:hidden;background:#000', S);
  const cv = document.createElement('canvas'); cv.width = 108; cv.height = 192;
  cv.style.cssText = 'position:absolute;left:-60px;top:-106px;width:1200px;height:2132px;filter:blur(16px)';
  root.appendChild(cv); BGS.push([t0 - .1, t1 + .05, cv.getContext('2d')]);
  div(`inset:0;background:rgba(0,0,0,${dim})`, root);
  const stage = div('inset:0;perspective:1600px', root);
  const cam = div('inset:0;transform-style:preserve-3d;transform-origin:50% 50%', stage);
  A(root, [{opacity: 0}, {opacity: 1}], t0 - .04, .3);
  A(stage, [{opacity: 0, transform: 'scale(1.06)', filter: 'blur(14px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 - .04, .4, {e: SMOOTH});
  A(cam, [{transform: `rotateX(${tilt}deg) rotateY(${-tilt}deg) translateZ(-60px)`}, {transform: `rotateX(${-tilt * .4}deg) rotateY(${tilt * .5}deg) translateZ(0)`}], t0, t1 - t0, {e: INOUT});
  A(stage, [{opacity: 1, transform: 'none', filter: 'blur(0)'}, {opacity: 0, transform: 'scale(.96)', filter: 'blur(14px)'}], t1 - .2, .2, {e: 'ease-in', f: 'forwards'});
  A(root, [{opacity: 1}, {opacity: 0}], t1 - .2, .2, {e: 'ease-in', f: 'forwards'});
  sfx('whoosh', t0 - .1, -19);
  return cam;
}
let SEED = 11; const rnd = () => (SEED = (SEED * 16807) % 2147483647) / 2147483647;
const BULB = (w, stroke, sw = 5) => `<svg width="${w}" height="${w}" viewBox="0 0 100 100" style="overflow:visible"><path d="${IC.bulb}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
// short light rays around a point (lines drawn outward)
function rays(parent, cx, cy, r0, r1, n, t, {w = 5, color = BLUE, skip = []} = {}) {
  let inner = '';
  for (let i = 0; i < n; i++) {
    if (skip.includes(i)) continue;
    const a = -Math.PI / 2 + i * 2 * Math.PI / n;
    inner += `<line x1="${cx + Math.cos(a) * r0}" y1="${cy + Math.sin(a) * r0}" x2="${cx + Math.cos(a) * r1}" y2="${cy + Math.sin(a) * r1}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  }
  const s = svg(1080, 1920, inner, 'left:0;top:0', parent);
  s.querySelectorAll('line').forEach((l, i) => draw(l, t + i * .025, .35));
  return s;
}

scenes([[4.93, 8.55], [8.57, 12.52], [14.0, 14.98], [18.0, 21.97], [26.0, 29.98], [32.0, 32.97], [33.0, 37.97], [39.52, 40.97],
        [44.29, 46.97], [49.97, 51.98], [54.0, 71.98], [73.0, 75.98], [77.0, 79.22], [83.36, 86.5]]);

/* ===================== A-ROLL TEXT ===================== */
block({t0: 0, t1: 1.98, lines: [[['เวลาเรา', 's', 0.05], ['มีไอเดีย', 'k', 0.47]], [['ที่อยากจะ', 's', 1.0]], [['เริ่มทำธุรกิจ', 'm', 1.36]]]});
keyHit(.47, -19); zoom(.47, 1.05, .6);
block({t0: 2, t1: 4.88, lines: [[['บางทีเราก็', 's', 2.0]], [['คิดว่าแบบ', 'm', 3.0]], [['เฮ้ย!', 'k', 3.75, 170]]]});
keyHit(3.75); zoom(3.75, 1.09, .12); zoom(4.9, 1.0, .35);
block({t0: 12.6, t1: 13.95, lines: [[['ผมจะบอกว่า', 's', 12.6]], [['สุดท้าย', 'm', 13.0], ['ตรงนั้น...', 's', 13.45]]]});
block({t0: 15, t1: 15.97, lines: [[['แล้วเราก็จะ', 's', 15.0]], [['ไม่ได้เริ่มทำ', 'm', 15.38], ['สักที', 'k', 15.7]]]});
keyHit(15.7, -23);
block({t0: 16, t1: 17.97, lines: [[['คือ', 's', 16.0], ['ไอเดียเจ๋ง ๆ', 'k', 16.15]], [['หลาย ๆ ไอเดีย', 'm', 17.0]]]});
keyHit(16.15); zoom(16.15, 1.05, .7);
block({t0: 22, t1: 24.38, lines: [[['มันไม่ได้', 's', 22.0], ['เป็นอย่างนั้น', 'm', 22.26]], [['ตั้งแต่แรก', 'k', 22.63]], [['นึกออกมั้ย?', 's', 23.05]]]});
keyHit(22.63); zoom(22.63, 1.07, .14); zoom(24.3, 1.0, .4);
block({t0: 24.42, t1: 25.97, top: 1380, lines: [[['ก็คงไม่ได้คิดว่า', 'm', 25.0]]]});
block({t0: 30.02, t1: 31.97, lines: [[['คือผมอยากจะสื่อว่า', 's', 30.02]], [['เรามีไอเดีย', 'm', 31.0], ['อะไร?', 'k', 31.58]]]});
keyHit(31.58); zoom(31.58, 1.08, .12);
block({t0: 38, t1: 39.5, lines: [[['ไม่รู้ว่าผมพูด', 's', 38.0], ['งง', 'k', 38.6]], [['หรือเปล่านะทุกคน', 's', 39.0]]]});
keyHit(38.6, -23);
block({t0: 41, t1: 43.6, lines: [[['ผมพูดสด ๆ', 'm', 41.0]], [['ออกมาจากใจ', 'k', 42.21]]]});
keyHit(42.21); zoom(42.21, 1.06, .8);
block({t0: 43.63, t1: 44.27, lines: [[['ทุกคน', 's', 43.63]]]});
block({t0: 47, t1: 47.97, lines: [[['ไม่ต้องรอ', 'm', 47.0]], [['ไอเดียเจ๋ง ๆ', 'k', 47.45]]]});
keyHit(47.45); zoom(47.45, 1.07, .14); zoom(48.0, 1.0, .35);
block({t0: 48, t1: 49.4, lines: [[['บางทีไอเดีย', 's', 48.0]], [['มันก็ผุดออกมา', 'm', 48.46]]]});
block({t0: 49.42, t1: 49.97, lines: [[['อย่างที่บอก', 's', 49.42]]]});
block({t0: 52.0, t1: 53.98, lines: [[['แต่ว่าถ้าใคร', 's', 52.0]], [['คิดไอเดีย', 'm', 53.0], ['ไม่ออก', 'k', 53.42]], [['สักที', 's', 53.75]]]});
keyHit(53.42); zoom(53.42, 1.07, .14); zoom(53.98, 1.0, .3);
block({t0: 72.0, t1: 72.98, lines: [[['แล้วก็จะบอกว่า', 's', 72.0]], [['มันไม่ได้', 'm', 72.47], ['การันตี', 'k', 72.68]]]});
keyHit(72.68); zoom(72.68, 1.07, .14);
block({t0: 76.0, t1: 76.98, lines: [[['คือไอเดีย', 'm', 76.0]], [['ที่ได้ออกมา', 's', 76.5]]]});
zoom(76.0, 1.0, .3);
block({t0: 79.24, t1: 80.98, lines: [[['มันก็อาจจะไม่ใช่', 's', 79.24]], [['ไอเดียที่', 'm', 80.0], ['เจ๋งที่สุด', 'k', 80.3]], [['ก็ได้', 's', 80.75]]]});
keyHit(80.3); zoom(80.3, 1.06, .6);
block({t0: 81.0, t1: 83.34, lines: [[['เราอาจจะไปเจอไอเดีย', 's', 81.0]], [['ที่แบบมัน', 's', 82.0], ['เจ๋งกว่านี้', 'k', 82.35]], [['ก็ได้', 's', 83.0]]]});
keyHit(82.35); zoom(82.35, 1.09, .12); zoom(83.3, 1.0, .3);

lowerThird('Mark Zuckerberg', 'ผู้ก่อตั้ง Facebook', 24.42, 25.97);
zoom(24.5, 1.06, .7); zoom(25.95, 1.0, .3);
badge('bulb', .4, 1.98); badge('heart', 42.21, 43.6); badge('glass', 47.05, 47.97);

/* ===================== FULL-SCREEN SCENES (blurred source behind) ===================== */

/* S1 · ยังไม่เจ๋ง / ล้ำ / ดีพอ — three ring gauges that stop short of the goal tick (4.93–8.55) */
{
  const c = bscene(4.93, 8.55);
  text(c, 'มันยังไม่...', 'm', 4.95, 'top:470px');
  [['เจ๋ง', 5.05, 62], ['ล้ำ', 5.9, 46], ['ดี', 7.12, 71]].forEach(([w, t, v], i) => {
    const x = 140 + i * 280;
    const g = svg(240, 240, `<circle cx="120" cy="120" r="104" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="13"/>
      <circle class="arc" cx="120" cy="120" r="104" fill="none" stroke="${BLUE}" stroke-width="13" stroke-linecap="round" pathLength="100" stroke-dasharray="0 100" transform="rotate(-90 120 120)" style="filter:drop-shadow(0 0 10px ${BLUE})"/>
      <line x1="120" y1="2" x2="120" y2="34" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`, `left:${x}px;top:700px`, c);
    A(g, [{opacity: 0, transform: 'scale(.6) rotate(-40deg)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], 4.98 + i * .08, .55, {e: SPRING});
    A(g.querySelector('.arc'), [{strokeDasharray: '0 100'}, {strokeDasharray: `${v + 9} 100`, offset: .6}, {strokeDasharray: `${v} 100`}], t, 1.0);
    const inside = div(`left:${x}px;top:700px;width:240px;height:240px;display:flex;align-items:center;justify-content:center;perspective:900px`, c);
    kinetic(inside, w, 'k', t).style.fontSize = '92px';
    const lb = div(`left:${x}px;top:965px;width:240px;text-align:center;opacity:0`, c, `<span class="lbl">ยังไม่พอ</span>`);
    A(lb, [{opacity: 0, transform: 'translateY(16px)'}, {opacity: 1, transform: 'none'}], t + .7, .35);
    sfx('softswish', t - .03, -23, 1 + i * .08);
  });
  text(c, 'อะไรอย่างงี้', 's', 8.0, 'top:1120px');
}

/* S2 · มัวแต่ป่วน → ดีกว่าเดิม ×3 — a tangled scribble, then a ladder of ever-bigger "ดีกว่าเดิม" (8.57–12.52) */
{
  const c = bscene(8.57, 12.52, {tilt: 4});
  const h1 = text(c, 'แล้วเราก็', 's', 8.6, 'top:250px');
  const h2 = text(c, 'มัวแต่ป่วน', 'k', 9.31, 'top:320px', {size: 150});
  const h3 = text(c, 'อยู่กับการคิด', 'm', 9.56, 'top:510px');
  let d = '';
  for (let i = 0; i <= 260; i++) { const u = i / 260 * Math.PI * 6; d += (i ? 'L' : 'M') + (540 + 250 * Math.sin(1.03 * u) + 70 * Math.sin(4.1 * u)).toFixed(1) + ' ' + (960 + 170 * Math.sin(1.7 * u + 1) + 60 * Math.cos(5.3 * u)).toFixed(1); }
  const sc = svg(1080, 1920, `<path d="${d}" fill="none" stroke="rgba(255,255,255,.85)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`, 'left:0;top:0', c);
  draw(sc.querySelector('path'), 9.3, 1.5);
  const q = text(c, 'ไอเดียที่...', 's', 10.0, 'top:1230px');
  [h1, h2, h3, sc, q].forEach(e => fadeOut(e, 10.82, .16));
  // ladder: each better version lands bigger, the previous dims
  const rail = svg(60, 640, `<line x1="30" y1="10" x2="30" y2="630" stroke="rgba(143,211,255,.5)" stroke-width="4" stroke-linecap="round"/>`, 'left:120px;top:520px', c);
  draw(rail.querySelector('line'), 10.95, .9);
  [[11.0, 84, 'm', 560], [11.81, 112, 'm', 760], [12.06, 150, 'k', 990]].forEach(([t, sz, cl, y], i) => {
    const w = div(`left:200px;top:${y}px;perspective:900px`, c);
    kinetic(w, 'ดีกว่าเดิม', cl, t, {stagger: .02}).style.fontSize = sz + 'px';
    const dot = div(`left:138px;top:${y + sz * .55}px;width:24px;height:24px;border-radius:50%;background:${i === 2 ? BLUE : '#fff'};box-shadow:0 0 18px ${BLUE};opacity:0`, c);
    A(dot, [{opacity: 0, transform: 'scale(0)'}, {opacity: 1, transform: 'none'}], t, .35, {e: SPRING});
    if (i < 2) A(w, [{opacity: 1}, {opacity: .38}], [11.81, 12.06][i], .25, {f: 'forwards'});
    sfx('softswish', t - .03, -24, 1 + i * .12);
  });
  text(c, 'ใช่ป่ะ?', 's', 12.25, 'top:1230px');
}

/* S3 · ลูปนรก — infinity trace around the word (14.0–14.98) */
{
  const c = bscene(14.0, 14.98, {tilt: 2});
  const P = 'M540 960c-110-170-430-170-430 0s320 170 430 0 430-170 430 0-320 170-430 0z';
  const inf = svg(1080, 1920, `<path d="${P}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="6"/>
     <path class="tr" d="${P}" fill="none" stroke="${BLUE}" stroke-width="11" stroke-linecap="round" pathLength="1" stroke-dasharray=".2 .8" style="filter:drop-shadow(0 0 12px ${BLUE})"/>`, 'left:0;top:0', c);
  A(inf, [{opacity: 0, transform: 'scale(.85)'}, {opacity: 1, transform: 'none'}], 14.0, .4, {e: SPRING});
  A(inf.querySelector('.tr'), [{strokeDashoffset: 0}, {strokeDashoffset: -2}], 14.0, 1.0, {e: 'linear'});
  text(c, 'มันจะกลายเป็น', 's', 14.0, 'top:640px');
  text(c, 'ลูปนรก', 'k', 14.45, 'top:850px', {size: 200});
  sfx('swell', 13.3, -22); sfx('sub', 14.0, -12);
}

/* S4 · บริษัทระดับโลก — 3D dot globe with an orbit ring (18.0–21.97) */
{
  const c = bscene(18.0, 21.97, {tilt: 3});
  const cv = document.createElement('canvas'); cv.width = 900; cv.height = 900; cv.style.cssText = 'position:absolute;left:90px;top:300px;width:900px;height:900px;opacity:0';
  c.appendChild(cv); A(cv, [{opacity: 0, transform: 'scale(.7)'}, {opacity: 1, transform: 'none'}], 18.0, .8, {e: SPRING});
  const orb = svg(1000, 300, `<ellipse cx="500" cy="150" rx="470" ry="110" fill="none" stroke="rgba(143,211,255,.45)" stroke-width="3" stroke-dasharray="3 14" stroke-linecap="round"/>`, 'left:40px;top:600px;transform:rotate(-14deg)', c);
  A(orb, [{opacity: 0}, {opacity: 1}], 18.4, .6);
  const sat = div(`left:0;top:0;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:#fff;box-shadow:0 0 20px 6px rgba(143,211,255,.8);offset-path:path('M970 150 A470 110 0 1 1 30 150 A470 110 0 1 1 970 150');opacity:0`, orb);
  A(sat, [{offsetDistance: '0%'}, {offsetDistance: '100%'}], 18.4, 3.6, {e: 'linear'}); A(sat, [{opacity: 0}, {opacity: 1}], 18.5, .3);
  const ctx = cv.getContext('2d'), pts = [], N = 900;
  for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
  const pins = [[.5, .3], [2.1, -.2], [3.6, .5], [4.9, .1], [1.2, -.55]];
  HOOKS.push(t => {
    if (t < 17.9 || t > 22.1) return;
    const a = (t - 18) * .55, R = 360, cx = 450, cy = 450, tilt = .35;
    ctx.clearRect(0, 0, 900, 900);
    for (const [x, y, z] of pts) {
      const X = x * Math.cos(a) + z * Math.sin(a), Z0 = -x * Math.sin(a) + z * Math.cos(a);
      const Y = y * Math.cos(tilt) - Z0 * Math.sin(tilt), Z = y * Math.sin(tilt) + Z0 * Math.cos(tilt);
      const d = (Z + 1) / 2; ctx.fillStyle = `rgba(${170 + d * 85},${215 + d * 40},255,${.15 + d * .8})`;
      ctx.beginPath(); ctx.arc(cx + X * R, cy + Y * R, 1.4 + d * 2.6, 0, 7); ctx.fill();
    }
    pins.forEach(([lon, lat], i) => {
      const show = Math.min(1, Math.max(0, (t - 19.0 - i * .15) / .3)); if (!show) return;
      const x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.sin(lon);
      const X = x * Math.cos(a) + z * Math.sin(a), Z0 = -x * Math.sin(a) + z * Math.cos(a);
      const Y = y * Math.cos(tilt) - Z0 * Math.sin(tilt), Z = y * Math.sin(tilt) + Z0 * Math.cos(tilt);
      if (Z < -.1) return;
      ctx.fillStyle = `rgba(255,255,255,${show})`; ctx.shadowColor = BLUE; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(cx + X * R, cy + Y * R, 9 * show, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    });
  });
  text(c, 'ของบริษัท', 'm', 18.0, 'top:1240px');
  text(c, 'ระดับโลก', 'k', 18.92, 'top:1340px', {size: 160});
  text(c, 'หรือธุรกิจอะไรหลาย ๆ อย่าง', 's', 20.0, 'top:1560px');
  keyHit(18.92, -23);
}

/* S5 · Facebook — a dot that grows into a big network ("ทุกวันนี้"), then shrinks back to where it began (26.0–29.98) */
{
  const c = bscene(26.0, 29.98, {tilt: 3});
  text(c, 'Facebook', 'k', 26.0, 'top:240px', {size: 130});
  const core = div(`left:526px;top:846px;width:28px;height:28px;border-radius:50%;background:#fff;box-shadow:0 0 22px 6px rgba(143,211,255,.8);opacity:0`, c);
  A(core, [{opacity: 0, transform: 'scale(0)'}, {opacity: 1, transform: 'none'}], 26.25, .4, {e: SPRING});
  let net = '', dots = '';
  SEED = 5;
  const P = [...Array(16)].map((_, i) => { const a = i * 2.399963, r = 120 + rnd() * 200; return [540 + Math.cos(a) * r, 860 + Math.sin(a) * r * .95]; });
  P.forEach(([x, y], i) => {
    net += `<line x1="540" y1="860" x2="${x}" y2="${y}" stroke="rgba(143,211,255,.35)" stroke-width="2.5"/>`;
    const [x2, y2] = P[(i + 3) % P.length]; net += `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="rgba(255,255,255,.12)" stroke-width="2"/>`;
    dots += `<circle cx="${x}" cy="${y}" r="${7 + (i % 3) * 3}" fill="${i % 4 ? '#fff' : BLUE}"/>`;
  });
  const grow = svg(1080, 1920, `<defs><radialGradient id="fbg"><stop offset="0" stop-color="${BLUE}" stop-opacity=".28"/><stop offset="1" stop-color="${BLUE}" stop-opacity="0"/></radialGradient></defs>
     <circle cx="540" cy="860" r="360" fill="url(#fbg)"/><circle cx="540" cy="860" r="360" fill="none" stroke="rgba(143,211,255,.6)" stroke-width="3"/>${net}${dots}`, 'left:0;top:0;transform-origin:540px 860px', c);
  A(grow, [{opacity: 0, transform: 'scale(.04)'}, {opacity: 1, transform: 'none'}], 26.97, .75, {e: SPRING});
  A(grow, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'scale(.04)'}], 27.85, .6, {e: INOUT, f: 'forwards'});
  const a1 = text(c, 'จะเป็นเหมือน', 's', 26.97, 'top:1300px'), a2 = text(c, 'ทุกวันนี้', 'k', 27.25, 'top:1370px');
  fadeOut(a1, 27.7, .14); fadeOut(a2, 27.7, .14);
  sfx('swell', 26.6, -26); keyHit(27.25, -23);
  text(c, 'ตอนที่เขาเริ่มทำ', 'm', 27.85, 'top:1340px');
  const tag = div('left:580px;top:800px;opacity:0', c, '<span class="chip">ตอนเริ่ม</span>');
  A(tag, [{opacity: 0, transform: 'translateX(-30px)'}, {opacity: 1, transform: 'none'}], 28.3, .4, {e: SPRING});
  ripple(c, 540, 860, 28.75, 2.2);
}

/* S6 · เริ่มทำไปก่อน — the key line with two soft ripples (32.0–32.97) */
{
  const c = bscene(32.0, 32.97, {tilt: 2});
  [0, .18].forEach(d => { const r = div(`left:240px;top:560px;width:600px;height:600px;border-radius:50%;border:3px solid rgba(143,211,255,.45);opacity:0`, c);
    A(r, [{opacity: .9, transform: 'scale(.4)'}, {opacity: 0, transform: 'scale(1.6)'}], 32.15 + d, .8, {e: 'ease-out', f: 'none'}); });
  text(c, 'เรา', 's', 32.0, 'top:700px');
  text(c, 'เริ่มทำ', 'k', 32.15, 'top:770px', {size: 230});
  text(c, 'ไปก่อน', 'm', 32.5, 'top:1050px', {size: 110});
  sfx('swell', 31.3, -22); sfx('sub', 32.0, -12);
}

/* S7 · ไอเดียผุดขึ้นระหว่างทาง — dotted road, travelling light, bulbs pop up with rays (33.0–37.97) */
{
  const c = bscene(33.0, 37.97, {tilt: 5});
  text(c, 'บางที', 's', 33.0, 'top:170px');
  text(c, 'ไอเดียเจ๋ง ๆ', 'k', 33.3, 'top:240px');
  text(c, 'มันจะผุดขึ้นมา', 'm', 34.4, 'top:420px');
  const P = 'M80 1380 C 300 1380, 330 1080, 540 1060 S 800 760, 940 720';
  const route = svg(1080, 1920, `<path d="${P}" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="6" stroke-dasharray="2 22" stroke-linecap="round"/>
     <path class="rt" d="${P}" fill="none" stroke="${BLUE}" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${BLUE})"/>`, 'left:0;top:0', c);
  const rt = route.querySelector('.rt'); rt.setAttribute('pathLength', 1); rt.style.strokeDasharray = 1;
  A(rt, [{strokeDashoffset: 1}, {strokeDashoffset: .04}], 33.1, 4.6, {e: 'linear'});
  const head = div(`left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:#fff;box-shadow:0 0 30px 8px rgba(143,211,255,.8);offset-path:path('${P}')`, c);
  A(head, [{offsetDistance: '0%'}, {offsetDistance: '96%'}], 33.1, 4.6, {e: 'linear'});
  [[300, 1290, 34.45], [560, 1050, 35.05], [830, 790, 35.75]].forEach(([x, y, t], i) => {
    const by = y - 210;
    const b = div(`left:${x - 50}px;top:${by - 50}px;width:100px;height:100px;opacity:0`, c, BULB(100, i === 2 ? BLUE : '#fff', 6));
    A(b, [{opacity: 0, transform: 'translateY(60px) scale(.4)'}, {opacity: 1, transform: 'none'}], t, .5, {e: SPRING});
    draw(b.querySelector('path'), t, .5);
    rays(c, x, by, 70, 98, 8, t + .25, {w: 4, color: i === 2 ? BLUE : 'rgba(255,255,255,.8)', skip: [3, 4, 5]});
    const stem = div(`left:${x - 1}px;top:${by + 62}px;width:2px;height:${y - by - 72}px;background:linear-gradient(rgba(143,211,255,.7),transparent);opacity:0`, c);
    A(stem, [{opacity: 0}, {opacity: 1}], t + .1, .3);
    sfx('softswish', t, -25, 1.2 + i * .1);
  });
  text(c, 'ระหว่างทาง', 'k', 35.75, 'top:1470px', {size: 150});
  text(c, 'ที่เรากำลังทำไป', 's', 36.71, 'top:1660px', {size: 54});
}

/* S8 · ไม่มีสคริปต์ — outlined word gets struck through (39.52–40.97) */
{
  const c = bscene(39.52, 40.97, {tilt: 3});
  text(c, 'เพราะว่าคลิปนี้', 's', 39.55, 'top:560px');
  text(c, 'ไม่มี', 'k', 40.0, 'top:640px');
  const w = text(c, 'สคริปต์', 'm outline', 40.08, 'top:820px', {size: 210});
  w.firstChild.style.fontFamily = 'KeyFont';
  const st = svg(1080, 1920, `<path d="M190 990 L890 955" stroke="${BLUE}" stroke-width="14" stroke-linecap="round" fill="none" style="filter:drop-shadow(0 0 10px ${BLUE})"/>`, 'left:0;top:0', c);
  draw(st.querySelector('path'), 40.42, .28);
  sfx('stamp', 40.5, -21);
  text(c, 'เลยนะ', 's', 40.6, 'top:1120px');
}

/* S9 · เริ่มทำเลย — cursor flips a switch ON (44.29–46.97) */
{
  const c = bscene(44.29, 46.97, {tilt: 3});
  text(c, 'ก็คือ...', 's', 44.3, 'top:520px');
  const sw = div('left:290px;top:660px;width:500px;height:240px;border-radius:120px;border:3px solid rgba(255,255,255,.35);background:rgba(255,255,255,.07);box-shadow:0 30px 80px rgba(0,0,0,.45);opacity:0', c);
  const fill = div(`inset:0;border-radius:120px;background:linear-gradient(90deg,rgba(78,155,255,.55),rgba(143,211,255,.75));box-shadow:0 0 70px rgba(143,211,255,.45);opacity:0`, sw);
  const knob = div('left:16px;top:16px;width:202px;height:202px;border-radius:50%;background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center', sw,
    `<svg width="100" height="100" viewBox="0 0 100 100"><path d="M24 52 L43 70 L77 32" fill="none" stroke="${BLUE}" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
  const chk = knob.querySelector('path'); chk.style.opacity = 0;
  A(sw, [{opacity: 0, transform: 'scale(.7)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], 44.3, .45, {e: SPRING});
  A(knob, [{transform: 'translateX(0)'}, {transform: 'translateX(246px)'}], 44.66, .38, {e: SPRING});
  A(fill, [{opacity: 0}, {opacity: 1}], 44.66, .3);
  A(chk, [{opacity: 0}, {opacity: 1}], 44.78, .05); draw(chk, 44.78, .3);
  cursor(c, [[44.3, 900, 1450], [44.6, 450, 800], [45.2, 470, 810], [45.6, 960, 1550]], [44.62]);
  ripple(c, 680, 780, 44.7); sfx('impact', 44.62, -24);
  const t1 = text(c, 'เริ่มทำเลย', 'k', 44.63, 'top:960px', {size: 120});
  const q = text(c, 'อยากทำอะไร?', 'm', 45.0, 'top:1150px');
  [sw, t1, q].forEach(e => fadeOut(e, 45.85, .18));
  text(c, 'เริ่มทำ!', 'k', 46.0, 'top:800px', {size: 250});
  sfx('thud', 46.02, -23); keyHit(44.63, -24);
}

/* S10 · ผุดออกมาโดยไม่รู้ตัว — a bulb lights up with a burst of rays (49.97–51.98) */
{
  const c = bscene(49.97, 51.98, {tilt: 3});
  const b = div('left:400px;top:470px;width:280px;height:280px;opacity:0', c, BULB(280, '#fff', 4.5));
  A(b, [{opacity: 0, transform: 'translateY(80px) scale(.6)'}, {opacity: 1, transform: 'none'}], 50.0, .6, {e: SPRING});
  const bp = b.querySelector('path'); draw(bp, 50.05, .7);
  A(bp, [{stroke: '#fff', filter: 'none'}, {stroke: BLUE, filter: `drop-shadow(0 0 14px ${BLUE})`}], 50.6, .35, {f: 'forwards'});
  rays(c, 540, 585, 175, 235, 12, 50.62, {w: 5, skip: [5, 6, 7]});
  const halo = div('left:290px;top:335px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(143,211,255,.35),transparent 65%);opacity:0', c);
  A(halo, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'none'}], 50.6, .5);
  text(c, 'ผุดออกมา', 'm', 50.0, 'top:860px');
  text(c, 'โดยที่เรา', 's', 50.31, 'top:980px');
  text(c, 'ไม่รู้ตัว', 'k', 50.6, 'top:1050px', {size: 200});
  sfx('swell', 49.3, -22); sfx('sub', 50.0, -12);
}

/* J · Jarua walkthrough — screen recording in a phone frame + 4-step tracker (54.0–71.98) */
{
  const c = bscene(54.0, 71.98, {tilt: 1.5, dim: .42});
  // screen-recording time for each clip time (speech-synced, piecewise linear)
  const MAP = [[54.3, 0], [66.1, 11.8], [66.27, 12.0], [67.21, 13.3], [68.78, 14.6], [70.2, 16.2], [70.8, 17.6], [72.0, 19.6]];
  const scrT = t => { if (t <= MAP[0][0]) return 0; for (let i = 1; i < MAP.length; i++) { const [a, x] = MAP[i - 1], [b, y] = MAP[i]; if (t <= b) return x + (y - x) * (t - a) / (b - a); } return MAP.at(-1)[1]; };
  const phone = div('left:236px;top:360px;width:608px;height:1080px;border-radius:56px;overflow:hidden;border:3px solid rgba(255,255,255,.28);background:#000;box-shadow:0 50px 120px rgba(0,0,0,.6),0 0 0 10px rgba(255,255,255,.05)', c);
  const img = document.createElement('img'); img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover'; phone.appendChild(img);
  PRE.push(async t => {
    if (t < 53.9 || t > 72.1) return;
    const f = Math.min(633, Math.round(scrT(t) * 30) + 1), s = `scr_frames/f${String(f).padStart(5, '0')}.jpg`;
    if (img.dataset.s !== s) { img.dataset.s = s; img.src = s; await img.decode(); }
  });
  A(phone, [{opacity: 0, transform: 'translateY(420px) rotateX(24deg) scale(.9)', filter: 'blur(12px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], 54.15, .75, {e: SPRING});
  // gentle push-in on each step the speaker names
  [66.27, 67.21, 68.78, 70.43].forEach(t => A(phone, [{scale: '1'}, {scale: '1.025'}, {scale: '1'}], t, .5, {f: 'none', c: 'add'}));
  // captions above the phone (each one replaces the last)
  const cap = (items, t1) => { const els = items.map(([txt, cl, t, top, size]) => text(c, txt, cl, t, `top:${top}px`, size ? {size} : {})); els.forEach(e => fadeOut(e, t1 - .16, .16)); };
  cap([['นี่เลย!', 'k', 54.0, 160, 120]], 54.98);
  cap([['เรามีตัวช่วย', 'm', 55.0, 180]], 55.65);
  cap([['เข้าไปที่เว็บของ', 's', 55.67, 100], ['Jarua', 'k', 57.0, 165, 130]], 57.77);
  cap([['แพลตฟอร์ม', 's', 57.79, 100], ['ที่ผมสร้างขึ้นมา', 'm', 58.62, 180]], 59.53);
  cap([['แพลตฟอร์มสำหรับ', 's', 59.55, 100], ['ช่วยงานธุรกิจ', 'k', 60.0, 165, 120]], 60.98);
  cap([['มีหลากหลาย', 's', 61.0, 100], ['เครื่องมือ', 'k', 62.0, 165, 120]], 63.98);
  cap([['สามารถไปใช้กันได้', 'm', 64.0, 180]], 64.98);
  cap([['ใครจะคิดไอเดีย', 's', 65.0, 100], ['ไม่ออก?', 'k', 66.0, 165, 120]], 66.25);
  cap([['ไปหมวดหมู่นี้เลย', 'm', 66.27, 180]], 67.19);
  cap([['ดู tools · ดูเครื่องมือ', 'm', 67.21, 180, 80]], 68.76);
  cap([['ตามนี้ได้', 's', 68.78, 100], ['กรอกข้อมูล', 'k', 69.3, 165, 120]], 70.41);
  cap([['รับผลลัพธ์ได้เลย', 'k', 70.43, 165, 110]], 70.98);
  cap([['นะทุกคน', 's', 71.0, 190]], 72.3);
  [57.0, 60.0, 62.0, 66.0, 69.3, 70.43].forEach(t => keyHit(t, -24));
  // step tracker under the phone
  const steps = [['หมวดหมู่', 66.27], ['ดู tools', 67.21], ['กรอกข้อมูล', 68.78], ['รับผลลัพธ์', 70.43]];
  const X = [210, 420, 630, 840], Y = 1500;
  const trk = div('left:0;top:0;width:1080px;height:1920px;opacity:0', c);
  A(trk, [{opacity: 0, transform: 'translateY(40px)'}, {opacity: 1, transform: 'none'}], 65.9, .45, {e: SPRING});
  const ln = svg(1080, 1920, `<line x1="${X[0]}" y1="${Y}" x2="${X[3]}" y2="${Y}" stroke="rgba(255,255,255,.22)" stroke-width="4" stroke-linecap="round"/>
     <line class="pr" x1="${X[0]}" y1="${Y}" x2="${X[3]}" y2="${Y}" stroke="${BLUE}" stroke-width="5" stroke-linecap="round" pathLength="3" stroke-dasharray="0 3" style="filter:drop-shadow(0 0 8px ${BLUE})"/>`, 'left:0;top:0', trk);
  const pr = ln.querySelector('.pr');
  A(pr, [{strokeDasharray: '0 3'}, {strokeDasharray: '1 3'}], 67.21, .35, {f: 'forwards'});
  A(pr, [{strokeDasharray: '1 3'}, {strokeDasharray: '2 3'}], 68.78, .35, {f: 'forwards'});
  A(pr, [{strokeDasharray: '2 3'}, {strokeDasharray: '3 3'}], 70.43, .35, {f: 'forwards'});
  steps.forEach(([lb, t], i) => {
    const n = div(`left:${X[i] - 22}px;top:${Y - 22}px;width:44px;height:44px;border-radius:50%;border:3px solid rgba(255,255,255,.5);background:rgba(0,0,0,.35)`, trk);
    A(n, [{background: 'rgba(0,0,0,.35)', borderColor: 'rgba(255,255,255,.5)', boxShadow: '0 0 0 rgba(0,0,0,0)', transform: 'scale(1)'},
          {background: BLUE, borderColor: BLUE, boxShadow: `0 0 24px ${BLUE}`, transform: 'scale(1.18)'}], t, .35, {e: SPRING, f: 'forwards'});
    const l = div(`left:${X[i] - 105}px;top:${Y + 38}px;width:210px;text-align:center`, trk, `<span class="lbl">${lb}</span>`);
    A(l.firstChild, [{color: 'rgba(255,255,255,.55)'}, {color: '#fff'}], t, .3, {f: 'forwards'});
    sfx('tick', t, -24, 1.3 + i * .08);
  });
}

/* S11 · ไม่ได้การันตีความสำเร็จ — a rotating seal with text on a circle, then a slash (73.0–75.98) */
{
  const c = bscene(73.0, 75.98, {tilt: 3});
  const R = 'M540 820 m-262 0 a262 262 0 1 1 524 0 a262 262 0 1 1 -524 0';
  const seal = svg(1080, 1920, `<defs><path id="sealp" d="${R}"/></defs>
     <circle cx="540" cy="820" r="320" fill="none" stroke="rgba(143,211,255,.7)" stroke-width="4"/>
     <circle cx="540" cy="820" r="214" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="3" stroke-dasharray="4 12" stroke-linecap="round"/>
     <g class="rot"><text font-family="BodyFont" font-size="40" letter-spacing="9" fill="rgba(255,255,255,.85)"><textPath href="#sealp">SUCCESS · GUARANTEED · SUCCESS · GUARANTEED · </textPath></text></g>`, 'left:0;top:0;transform-origin:540px 820px', c);
  A(seal, [{opacity: 0, transform: 'scale(1.35) rotate(-20deg)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], 73.0, .45, {e: SPRING});
  const rot = seal.querySelector('.rot'); rot.style.transformOrigin = '540px 820px';
  A(rot, [{transform: 'rotate(0deg)'}, {transform: 'rotate(60deg)'}], 73.0, 3.0, {e: 'linear'});
  sfx('thud', 73.05, -22);
  const word = text(c, 'ความสำเร็จ', 'k', 73.0, 'top:735px', {size: 104});
  // the slash — "not guaranteed"
  const sl = svg(1080, 1920, `<path d="M300 1080 L780 560" stroke="#fff" stroke-width="14" stroke-linecap="round" fill="none" style="filter:drop-shadow(0 4px 14px rgba(0,0,0,.6))"/>`, 'left:0;top:0', c);
  draw(sl.querySelector('path'), 74.16, .28); sfx('stamp', 74.25, -20);
  A(seal, [{opacity: 1}, {opacity: .4}], 74.3, .3, {f: 'forwards'}); A(word, [{opacity: 1}, {opacity: .45}], 74.3, .3, {f: 'forwards'});
  text(c, 'ถ้าเราไม่กล้า', 's', 75.0, 'top:1220px');
  text(c, 'เริ่มทำ', 'k', 75.35, 'top:1300px', {size: 150});
  keyHit(75.35, -23);
}

/* S12 · จาก AI วิเคราะห์ให้ — a node network converges into one idea (77.0–79.22) */
{
  const c = bscene(77.0, 79.22, {tilt: 4});
  text(c, 'จาก', 's', 77.0, 'top:250px');
  text(c, 'AI', 'k', 77.2, 'top:310px', {size: 170});
  SEED = 23;
  const N = [...Array(22)].map((_, i) => { const a = i * 2.399963 + rnd(), r = 170 + rnd() * 250; return [540 + Math.cos(a) * r, 900 + Math.sin(a) * r * .85]; });
  let lines = '';
  N.forEach(([x, y], i) => { const near = N.map((p, j) => [Math.hypot(p[0] - x, p[1] - y), j]).sort((a, b) => a[0] - b[0]).slice(1, 3);
    near.forEach(([, j]) => { if (j > i) lines += `<line x1="${x}" y1="${y}" x2="${N[j][0]}" y2="${N[j][1]}" stroke="rgba(143,211,255,.4)" stroke-width="2.5"/>`; }); });
  const net = svg(1080, 1920, lines, 'left:0;top:0', c);
  net.querySelectorAll('line').forEach((l, i) => draw(l, 77.2 + i * .02, .4));
  fadeOut(net, 78.15, .3);
  N.forEach(([x, y], i) => {
    const d = div(`left:${x - 9}px;top:${y - 9}px;width:18px;height:18px;border-radius:50%;background:${i % 3 ? '#fff' : BLUE};box-shadow:0 0 14px ${BLUE};opacity:0`, c);
    A(d, [{opacity: 0, transform: 'scale(0)'}, {opacity: 1, transform: 'none'}], 77.15 + i * .02, .3, {e: SPRING});
    A(d, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: `translate(${540 - x}px,${880 - y}px) scale(.3)`}], 78.0 + (i % 5) * .04, .45, {e: 'cubic-bezier(.6,0,.4,1)', f: 'forwards'});
  });
  const b = div('left:440px;top:780px;width:200px;height:200px;opacity:0', c, BULB(200, BLUE, 5));
  A(b, [{opacity: 0, transform: 'scale(.4)'}, {opacity: 1, transform: 'none'}], 78.4, .45, {e: SPRING});
  b.querySelector('path').style.filter = `drop-shadow(0 0 12px ${BLUE})`; draw(b.querySelector('path'), 78.4, .5);
  text(c, 'วิเคราะห์ให้', 'm', 77.9, 'top:1230px');
  sfx('riser', 77.3, -28); sfx('softswish', 78.4, -22);
}

/* S14 · ending — ตอนที่เรา เริ่มทำไปแล้ว: a path keeps going and a brighter idea appears along it (83.36–end) */
{
  const c = bscene(83.36, 86.5, {tilt: 3});
  text(c, 'ตอนที่เรา', 's', 83.36, 'top:560px');
  text(c, 'เริ่มทำ', 'k', 84.0, 'top:630px', {size: 220});
  text(c, 'ไปแล้ว', 'm', 84.5, 'top:900px', {size: 110});
  const P = 'M120 1330 C 330 1330, 420 1250, 560 1250 S 800 1190, 900 1160';
  const r = svg(1080, 1920, `<path d="${P}" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="6" stroke-dasharray="2 22" stroke-linecap="round"/>
     <path class="rt" d="${P}" fill="none" stroke="${BLUE}" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${BLUE})"/>
     <path class="ah" d="M872 1134 L904 1159 L866 1176" fill="none" stroke="${BLUE}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`, 'left:0;top:0', c);
  A(r, [{opacity: 0}, {opacity: 1}], 83.5, .3);
  draw(r.querySelector('.rt'), 83.6, 1.4);
  A(r.querySelector('.ah'), [{opacity: 0}, {opacity: 1}], 84.95, .15);
  const b = div('left:705px;top:1060px;width:110px;height:110px;opacity:0', c, BULB(110, BLUE, 6));
  A(b, [{opacity: 0, transform: 'translateY(40px) scale(.4)'}, {opacity: 1, transform: 'none'}], 84.75, .5, {e: SPRING});
  draw(b.querySelector('path'), 84.75, .5);
  rays(c, 760, 1115, 74, 100, 8, 85.0, {w: 4, skip: [3, 4, 5]});
  sfx('swell', 83.0, -23); sfx('sub', 84.0, -13); keyHit(84.0, -22);
}
