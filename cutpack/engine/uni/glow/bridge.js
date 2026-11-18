/* =====================================================================
   CutPack · uni · GLOW BRIDGE (prototype, 2026-11-17) — the glow-line sets drawn inside CutPack's styles
   Friend 2026-11-17: "เริ่มวางแผนต่อชุด glow-line เข้าระบบได้เลยครับ ให้ภาพเปลี่ยนสีตามแต่ละสไตล์" · "ก่อนอื่นทำเป็นรูปภาพมาให้ผมดูก่อน
   4 สไตล์ ทั้ง overlay และเต็มจอ" (DECISIONS 3). LESSONS 59 (Friend: "สีของ motion graphics ต้องเป็นสีเดียวกับสไตล์นั้นๆสิ"): every
   colour of the picture comes from the style — line, the bodies' fill, soft lines, the accent and the style's glow.
   The glow-line runtime (assets/glowline.js of the skill glow-line-motion, read only) draws a design of GL.cats.<cat> on its own
   1000 × 700 canvas; this file puts that canvas inside the style's frame (F.stage), sets GL.theme from the frame's colours, takes
   the glow-line background away, adds the style's glow, and drives the drawing from CutPack's clock (seek → GL setT).
   Full-screen: the 1000 × 700 canvas as designed · overlay: the small form (600 × 340 above the head, words in the subtitle),
   the drawing fitted to what it really draws.
   Limits of the prototype (one GL stage per page): one glow scene per page — enough for stills; a real clip with many scenes needs
   the runtime to hold one stage per scene (next step, see HANDOFF).
   ===================================================================== */
/* per full-screen style: the accent (what lights up) and the glow (colour, on every line or only on the accent) */
/* weight (Friend 2026-11-17: "ความหนาของเส้น ปรับได้ตามสไตล์นั้นๆ"): every line × k, and at least min px on screen (an overlay
   shrinks the drawing: its icon lines were 1.5 px and read as grey) — one factor for the whole drawing, so a tube keeps its walls */
const GLOWLOOK = {
  card:  {acc: '--ac',     glow: null,                          weight: {k: 1.7, min: 3.2}},   // card: no glow, lime accent, bold lines like its UI
  glass: {acc: '#8FD3FF',  glow: {c: '#8FD3FF', all: true},     weight: {k: 1.0, min: 2.0}},   // glass: every line glows sky blue, fine lines (the first look)
  split: {acc: '--ac',     glow: null,                          weight: {k: 1.45, min: 2.6}},  // split: flat pastel, medium lines
  gold:  {acc: '--ac',     glow: {c: '#FF9A2E', all: false},    weight: {k: 1.3, min: 2.4}},   // gold: only the orange accent glows
  /* the new styles (Friend 2026-11-17 cancelled the 4 above and is replacing them with 12 sheets made with AI, copied 100%) */
  neon:  {acc: '--ac',     glow: {c: '#2FA8F0', self: true},    weight: {k: 1.0, min: 2.4, floor: 2.0}, floatAlpha: .5, clipRoom: true},   // clipRoom: final 2026-11-18 (B06T radar's waves grew past its box onto the key word, test clip 24 s; shrinking the pictures to their motion took the first one from 17 % of the screen to 10 %)
  window: {acc: '--ac',    glow: {c: '#3E86FF', self: true},    weight: {k: 1.0, min: 2.4, floor: 2.0}, floatAlpha: .5, motionFit: true},    // หน้าต่างแอป (Friend's 3rd new sheet, 2026-11-18): the glass look in app windows, blue light
  violet: {acc: '--ac',    glow: {c: '#8B5CF6', self: true},    weight: {k: 1.0, min: 2.4, floor: 2.0}, floatAlpha: .5, motionFit: true},   // ม่วงคลื่นเสียง (Friend's 5th new sheet, 2026-11-18): the glass look in violet cards, violet light
  teal:  {acc: '--ac',     glow: {c: '#3FCEBA', self: true},    weight: {k: 1.0, min: 2.4, floor: 2.0}, floatAlpha: .5, motionFit: true},
  yellow: {acc: '--ac',    glow: {c: '#FFD600', self: true},    weight: {k: 1.6, min: 4.0, floor: 2.6}, floatAlpha: .62},   // the sheet's lines are 5 px where neon's are 3
  hud:   {acc: '--ac',     glow: {c: '#FFD600', self: true},    weight: {k: 1.6, min: 4.0, floor: 2.6}, floatAlpha: .62},
  pink:  {acc: '--ac',     glow: {c: '#E8469A', all: false},    weight: {k: 1.4, min: 3.4, floor: 2.2}, floatAlpha: .9},    // การ์ดชมพู (Friend's 10th new sheet, 2026-11-18): the first light style, dark lines on white cards, only the pink lit part glows
  terminal: {acc: '--ac',  glow: {c: '#EE4444', self: true},    weight: {k: 1.6, min: 4.0, floor: 2.6}, floatAlpha: .62},   // เทอร์มินัลแดง (Friend's 9th new sheet, 2026-11-18): thick white glowing lines, the lit part red
  horizon: {acc: '--ac',   glow: {c: '#FB7A1A', self: true},    weight: {k: 1.8, min: 5.0, floor: 3.0}, floatAlpha: .6},    // ขอบฟ้าส้ม (Friend's 8th new sheet, 2026-11-18): thick warm-white lines (7 px on the full-size shot 04), the lit part orange   // เส้นชี้ HUD (Friend's 7th new sheet, 2026-11-18): the same glow-line look as the yellow style (the sheet draws them alike)   // ขั้นตอนเหลือง (Friend's 6th new sheet, 2026-11-18): near-black bodies, white lines glowing white, the lit part yellow    // การ์ดเขียวน้ำทะเล (Friend's 4th new sheet, 2026-11-18): the glass look in teal cards, teal light
  lime:  {acc: '--ac',     glow: {c: '#B5EE38', self: true},    weight: {k: 1.0, min: 2.4, floor: 2.0}, floatAlpha: .5},    // เขียวมะนาว (Friend's 2nd new sheet, 2026-11-18): the neon glass, lime light    // นีออนฟ้า (Friend's sheet 2): frosted grey glass, white lines with their own soft glow, the lit part blue and glowing hard
};
/* what is really visible at the end of the drawing (not the things still hidden or gone: the getBBox of the whole drawing counted
   four hidden coins and made an overlay picture small), in the svg's user units */
function glowVisibleBox(svg, fallback = true) {
  const root = svg.querySelector(':scope > g'), inv = svg.getScreenCTM().inverse(), pt = svg.createSVGPoint();
  const seen = e => { for (let x = e; x && x !== svg; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || +cs.opacity < .05) return false; } return true; };
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  root.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse,text,image').forEach(e => {
    if (e.closest('clipPath,defs') || !seen(e)) return;
    const r = e.getBoundingClientRect(); if (r.width < .5 && r.height < .5) return;
    for (const [sx, sy] of [[r.left, r.top], [r.right, r.bottom]]) { pt.x = sx; pt.y = sy; const p = pt.matrixTransform(inv);
      x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); }
  });
  return x1 > x0 ? {x: x0, y: y0, width: x1 - x0, height: y1 - y0} : fallback ? root.getBBox() : null;
}
/* what the picture shows over its whole motion, not only at its end (2026-11-18, the window style's first real clip: B08T pinlock's
   ring grows past its end size mid-motion, so it was cut by its window and ran past x 920): the end box `e` widened to every
   moment's box between t0 and t1, by at most `cap` of its size on each side (something that flies far comes in from the picture's
   edge instead of making the whole picture small). t0 starts after the entrance (a part rising in from below at the start made
   B18 lectern a third smaller). Leaves the drawing at its end. */
function glowMotionBox(svg, e, t0, t1, cap = .2) {
  let [x0, y0, x1, y1] = [e.x, e.y, e.x + e.width, e.y + e.height];
  if (t1 > t0) for (let k = 0; k <= 16; k++) { window.setT(t0 + (t1 - t0) * k / 16); const b = glowVisibleBox(svg, false); if (!b) continue;
    x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); }
  window.setT(window.DURATION);
  const m = cap * Math.max(e.width, e.height);
  x0 = Math.max(x0, e.x - m); y0 = Math.max(y0, e.y - m); x1 = Math.min(x1, e.x + e.width + m); y1 = Math.min(y1, e.y + e.height + m);
  return {x: x0, y: y0, width: x1 - x0, height: y1 - y0};
}
/* the viewBox of a style with motionFit (the window style only, Friend 2026-11-18: "อยากให้มีผลเฉพาะสไตล์นี้ครับ"): the end of the
   drawing fills the box W × H (Friend: "อันไหนมีขนาดเล็กเกินไป ขยายให้พอดีด้วย"); only when its motion
   runs out of the box (12 px of slack: a window's padding) the motion's box fills it instead, so a picture shrinks only when it has to
   (fitting every picture to its motion took the window clip's pictures from 13 % of the screen to 10 %) */
function glowFit(svg, at, t1, W, H, room = null) {
  /* room (the neon style only, final 2026-11-18): the free space around the box on each side in px {l, t, r, b} (to the words, the face's
     frame, the safe zone), which the motion may use before the picture shrinks; else 12 px on every side (the window style's padding) */
  const pad = b => { const p = Math.max(b.width, b.height) * .03; return {x: b.x - p, y: b.y - p, width: b.width + 2 * p, height: b.height + 2 * p}; };
  const e = glowVisibleBox(svg), u = glowMotionBox(svg, e, at + .4, t1);
  let v = pad(e); const s = Math.min(W / v.width, H / v.height), R = room ?? {l: 12, t: 12, r: 12, b: 12};
  const rx = v.x - (W / s - v.width) / 2, ry = v.y - (H / s - v.height) / 2;
  if (u.x < rx - R.l / s || u.y < ry - R.t / s || u.x + u.width > rx + W / s + R.r / s || u.y + u.height > ry + H / s + R.b / s) {
    if (!room) v = pad(u);
    else {                                         // the smallest shrink that keeps the motion in the box and its room (k: how much wider the view gets)
      const cx = v.x + v.width / 2, cy = v.y + v.height / 2;
      const k = Math.min(1.6, Math.max(1, (cx - u.x) * s / (W / 2 + R.l), (u.x + u.width - cx) * s / (W / 2 + R.r), (cy - u.y) * s / (H / 2 + R.t), (u.y + u.height - cy) * s / (H / 2 + R.b)));
      v = {x: cx - v.width * k / 2, y: cy - v.height * k / 2, width: v.width * k, height: v.height * k};
    }
  }
  svg.dataset.motion = (u.width / u.height).toFixed(3);   // the shape of the whole motion (tools/real_shapes.js: a style picks the box the motion fits best)
  svg.setAttribute('viewBox', `${v.x} ${v.y} ${v.width} ${v.height}`);
}
/* DIMS (Friend 2026-11-17: "จำไว้เลยว่า สีมันต้องตัดกันเสมอ"): the templates dim what is not the point (the crowd around the chosen
   person, the wrong answer, the steps not reached) to 25–55 %, which took them under 3:1. Whatever ends dimmed (opacity .1–.62 at the
   end of the drawing) keeps its motion but is scaled up to end at .85 (.8 left a white ring on frosted glass at 2.99:1): still dimmer than the point, but readable (.72 left dark lines on a pale tile at 2.8:1) */
function glowDims(svg) {
  const dims = [...svg.querySelectorAll('[opacity]')].filter(e => !/bloom/.test(e.getAttribute('filter') || '') && !e.closest('[filter*="bloom"]'))   // not the soft light of a pulse
    .map(e => ({e, raw: e.getAttribute('opacity')})).filter(d => +d.raw > .1 && +d.raw < .62)
    .map(d => Object.assign(d, {k: .85 / +d.raw}));
  for (const d of dims) if (dims.some(o => o !== d && o.e.contains(d.e))) d.k = 1 / +d.raw;   // a dim inside a dim: only the outer one stays dim (.8 × .8 left 2.8:1)
  if (!dims.length) return;
  const base = window.setT;
  window.setT = t => { for (const d of dims) d.e.setAttribute('opacity', d.raw); base(t);
    for (const d of dims) { d.raw = d.e.getAttribute('opacity'); d.e.setAttribute('opacity', Math.min(1, +d.raw * d.k).toFixed(3)); } };
}
function glowWeight(svg, P, base) {
  const W = GLOWLOOK[base]?.weight; if (!W) return;
  const fill = glowRgba(P.fill), els = [...svg.querySelectorAll('[stroke-width]')].filter(e => (e.getAttribute('stroke') || 'none') !== 'none');
  const px = e => { const m = e.getScreenCTM(); return m ? +e.getAttribute('stroke-width') * Math.hypot(m.a, m.b) : 0; };
  const lines = els.filter(e => { const c = glowRgba(e.getAttribute('stroke')); return !(c[0] === fill[0] && c[1] === fill[1] && c[2] === fill[2]); })
    .map(px).filter(w => w >= .3 && w <= 14).sort((a, b) => a - b);
  const med = lines.length ? lines[lines.length >> 1] : 2, k = Math.min(2.8, Math.max(W.k, W.min / med));
  els.forEach(e => e.setAttribute('stroke-width', (+e.getAttribute('stroke-width') * k).toFixed(3)));
  /* and no hairline: a detail line still under 1.6 px on screen (glass keeps its fine lines, but not 1 px ones) is set to 1.6 px;
     the body-colour cuts of a tube are left as they are */
  els.forEach(e => { const c = glowRgba(e.getAttribute('stroke')); if (c[0] === fill[0] && c[1] === fill[1] && c[2] === fill[2]) return;
    const w = px(e), fl = W.floor ?? 1.6; if (w > 0 && w < fl) e.setAttribute('stroke-width', (+e.getAttribute('stroke-width') * fl / w).toFixed(3)); });
}
/* a floating drawing (no solid surface behind it: glass, card-overlay on the video) gets this body colour, see-through */
const GLOW_FLOAT = {card: '#14213D', glass: '#0F1B2A', split: '#4B3D6E', gold: '#1C1C20', neon: '#2A2E33', lime: '#26292B', window: '#151B26', teal: '#152A26', violet: '#1A1030', yellow: '#141414', hud: '#141414', horizon: '#1A100B', terminal: '#121214', pink: '#FFFFFF'};
/* the GLASS styles (neon, lime): frosted glass bodies, white lines glowing in their own colour, the lit part washed in the style's
   colour. Per style: lit = the lit tile's wash · litBar = a lit bar's wash under white words · litIcon = the icon on a lit tile ·
   mark = a white mark on a solid accent shape · halo = the wide halo of every line */
const GLASSY = {
  neon: {lit: 'rgba(25,95,150,.85)', litBar: 'rgba(30,120,185,.6)', litIcon: '#CFEFFF', litBody: '#1A6390', mark: '#0B2238', halo: '#5AB8FF',
    noEdge: true, centreBox: true},   // final 2026-11-18 (Friend): "ตัวหนังสือส่วยนี้ไม่ต้องมีกรอบ" · "ถ้ามีกรอบข้อความแบบนี้ อยากให้ icon และข้อความอยู่กึ่งกลาง"
  window: {lit: 'rgba(40,110,230,.30)', litBar: 'rgba(40,110,230,.38)', litIcon: '#A8CCFF', litBody: '#16325C', mark: '#0B2238', halo: '#7FB0FF', outlineLit: true, glow: 1.3, fig: '#7586A3', washLit: true},   // fig: people 5:1 on the window, white edge 3.7:1 on them
  violet: {lit: 'rgba(120,80,240,.24)', litBar: 'rgba(120,80,240,.30)', litIcon: '#C4AEFF', litBody: '#2A1A55', mark: '#160B30', halo: '#E8E0FF', outlineLit: true, glow: 1.3, fig: '#8A82A8', washLit: true},   // lit parts a violet outline (Friend's sheet)
  teal: {lit: 'rgba(40,190,165,.24)', litBar: 'rgba(40,190,165,.30)', litIcon: '#8FEBD9', litBody: '#123A33', mark: '#0A231F', halo: '#D8F5EE', outlineLit: true, glow: 1.3, fig: '#6E8C86', washLit: true},   // lit parts a teal outline (Friend's sheet), people teal-grey 4.3:1 on the card
  /* yellow (Friend's 6th sheet, sampled): the bodies are near-black, not frosted grey (#0A0A0A–#181818 on the screen, the hands show
     through them on the video) → frost [on a screen, on the video]; an icon's own body on them, solid → solid; a solid accent mark
     on a lit tile → litMark (the blue styles' #CDEFFF) */
  yellow: {lit: 'rgba(24,20,4,.9)', litBar: 'rgba(64,53,0,.92)', litIcon: '#FFD600', litBody: '#2A2300', mark: '#1A1600', halo: '#FFF6D6', outlineLit: true, glow: 1.2, fig: '#7E7E7A', washLit: true,
    frost: ['rgba(12,12,12,.86)', 'rgba(10,10,10,.62)'], solid: '#161616', litMark: '#FFF3B0', litWord: true},   // litWord: the lit step's word is yellow too
  hud: {lit: 'rgba(24,20,4,.9)', litBar: 'rgba(64,53,0,.92)', litIcon: '#FFD600', litBody: '#2A2300', mark: '#1A1600', halo: '#FFF6D6', outlineLit: true, glow: 1.2, fig: '#7E7E7A', washLit: true,
    frost: ['rgba(12,12,12,.86)', 'rgba(10,10,10,.62)'], solid: '#161616', litMark: '#FFF3B0', litWord: true},   // เส้นชี้ HUD: the yellow style's values (the sheet's pictures are drawn alike)
  /* ขอบฟ้าส้ม (shot 04 full size, sampled): bodies a warm see-through brown (#2B1E16 on the screen), the lit tile a deep orange wash
     (#3D210) under an orange edge, its icon and word orange, the white lines warm (#FEF1E3) */
  /* เทอร์มินัลแดง (the full-size shots, sampled): near-black bodies in the windows, the lit tile a deep red wash under a red edge,
     its icon and word red (#EE4444, 4.6:1 on #111113) */
  /* การ์ดชมพู (the full-size shots, sampled): white bodies with dark edges on the white cards, the lit tile a faint pink wash under
     a pink edge (#E8469A, 3.8:1 on white), its icon and word pink, marks on solid pink white; noEdge: no dark edge under the words
     (they are dark on white already) */
  pink: {lit: 'rgba(232,70,154,.07)', litBar: 'rgba(232,70,154,.14)', litIcon: '#E8469A', litBody: '#FFFFFF', mark: '#FFFFFF', halo: '#FFFFFF', outlineLit: true, glow: 1, fig: '#55536A', washLit: true,
    frost: ['rgba(255,255,255,.98)', 'rgba(255,255,255,.95)'], solid: '#FFFFFF', litMark: '#FFFFFF', litWord: true, noEdge: true},
  terminal: {lit: 'rgba(70,14,16,.7)', litBar: 'rgba(110,22,26,.7)', litIcon: '#F04848', litBody: '#3A0C0E', mark: '#2A0808', halo: '#FFFFFF', outlineLit: true, glow: 1.3, fig: '#80808A', washLit: true,
    frost: ['rgba(14,14,16,.86)', 'rgba(12,12,14,.62)'], solid: '#18181B', litMark: '#FFC9C9', litWord: true},
  horizon: {lit: 'rgba(90,38,8,.45)', litBar: 'rgba(110,48,10,.55)', litIcon: '#FB7A1A', litBody: '#3A1C08', mark: '#2A1204', halo: '#FFE6CC', outlineLit: true, glow: 1.3, fig: '#8A7A70', washLit: true,
    frost: ['rgba(78,56,42,.5)', 'rgba(30,20,15,.6)'], solid: '#2A1C14', litMark: '#FFD9B0', litWord: true},
  lime: {lit: 'rgba(120,170,25,.32)', litBar: 'rgba(120,170,25,.32)', litIcon: '#D4FA6A', litBody: '#2C3A12', mark: '#18220A', halo: '#EEF4E6', outlineLit: true, glow: 1.7},   // the white lines glow white on the sheet, only the lit part lime
};

const glowCtx = document.createElement('canvas').getContext('2d');
function glowRgba(c) {                               // any CSS colour → [r, g, b, a]
  glowCtx.fillStyle = '#000'; glowCtx.fillStyle = String(c).trim();
  const v = glowCtx.fillStyle;
  if (v[0] === '#') { const n = parseInt(v.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1]; }
  const m = v.match(/[\d.]+/g).map(Number); return [m[0], m[1], m[2], m[3] ?? 1];
}
const glowHex = ([r, g, b]) => '#' + [r, g, b].map(x => Math.round(x).toString(16).padStart(2, '0')).join('');
const glowMix = (a, b, k) => glowHex(a.map((x, i) => x + (b[i] - x) * k));
/* the solid colour behind the canvas: the nearest parent with a background at least 60 % solid (or the first colour of its
   gradient), up to the scene layer; null = the drawing floats (over the video or a see-through glass) */
function glowSurface(el) {
  for (let e = el; e && e.id !== 'SC' && e !== document.body; e = e.parentElement) {
    const cs = getComputedStyle(e), bc = glowRgba(cs.backgroundColor);
    if (bc[3] >= .6) return bc;
    const m = cs.backgroundImage.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}\b/i);
    if (m) { const g = glowRgba(m[0]); if (g[3] >= .6) return g; }
  }
  return null;
}
/* the GL.theme of this frame: line = the style's ink · fill = the surface (so a body hides what is behind it, as the black
   does on the glow-line page) · soft = between the two · accent = the style's accent */
function glowPalette(host, base) {
  const cs = getComputedStyle(host), L = GLOWLOOK[base] ?? GLOWLOOK.card;
  const ink = glowRgba(cs.getPropertyValue('--ink') || '#fff');
  const acc = glowRgba(L.acc.startsWith('--') ? cs.getPropertyValue(L.acc) : L.acc);
  const surf = glowSurface(host), fill = surf ?? glowRgba(GLOW_FLOAT[base] ?? '#111');
  const P = {line: glowHex(ink), fill: glowHex(fill), soft: glowMix(ink, fill, GLASSY[base] ? .12 : .25), accent: glowHex(acc)};   // neon: soft lines sit on frosted glass over a bright video too (.25 read 2.95:1)   // soft nearer the line (at .38 grey details read 2.3:1 on gold)
  if (!surf) P.fillAlpha = L.floatAlpha ?? (base === 'glass' ? .75 : .55);   // floating: the video shows a little through the bodies (glass/neon: darker, the glow sits under them)
  if (GLASSY[base]?.frost) P.frost = GLASSY[base].frost;   // a style's own body colour (yellow: near-black), else the frosted grey
  return P;
}
/* an accent that cannot be read on its surface (contrast < 2, e.g. card's lime on white or cream) stays only as a fill (a lime
   tile, as the card style's own things); its lines and words take the line colour (navy), like the card style's lime tiles with
   navy edges. Seen at full size 2026-11-17: a lime tick on cream nearly vanished. */
const glowLum = ([r, g, b]) => { const f = v => (v /= 255) <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const glowContrast = (a, b) => { const x = glowLum(a), y = glowLum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
function glowReadable(svg, P) {
  const acc = glowRgba(P.accent), ground = glowRgba(P.fill), k = glowContrast(acc, ground); if (k >= 3) return;
  /* under 2:1 (lime on white): the line colour · 2–3:1 (split's lavender words on its pale window read 2.8:1): the accent made deeper
     toward the line colour until it reads 3:1, so it stays the accent's colour */
  let ink = P.line;
  if (k >= 2) for (let t = .1; t <= 1; t += .05) { const m = glowMix(acc, glowRgba(P.line), t); if (glowContrast(glowRgba(m), ground) >= 3.6) { ink = m; break; } }   // 3.6 on the ground leaves room for a pale tile under it
  const hex = P.accent.toLowerCase(), rgb = new RegExp(`rgba?\\(\\s*${acc[0]}\\s*,\\s*${acc[1]}\\s*,\\s*${acc[2]}\\b`);
  const isAcc = v => { v = (v || '').toLowerCase(); return v === hex || (rgb.test(v) && glowRgba(v)[3] >= .5); };
  svg.querySelectorAll('[stroke],[fill]').forEach(e => {
    if (e.closest('[data-fig]') || GLOW_PEOPLE.has(e.closest('[data-icon]')?.getAttribute('data-icon'))) return;   // a chosen person keeps its accent: glowDress fills it
    if (isAcc(e.getAttribute('stroke'))) e.setAttribute('stroke', ink);
    if (/^(text|tspan)$/i.test(e.tagName) && isAcc(e.getAttribute('fill'))) e.setAttribute('fill', ink);
  });
}
/* faint lines (the engine draws connectors, rails and secondary rings in the line colour at 35–50 %) that end up under 3:1 on
   their ground are made more solid, up to 90 %, aiming at 3.5:1 on the page so a pale tile under it still leaves 3:1
   (Friend: "ยังมีเรื่องสีที่กลืนกันและมองยากอยู่") */
function glowFirm(svg, P, base) {
  /* neon: aimed at the frosted glass (#AAB2B9 over the ground), the lighter of its two grounds */
  const f0 = glowRgba(P.fill), fam = [glowRgba(P.line), glowRgba(P.soft)];
  const fr = glowRgba(glowFrost(P)), fa = fr[3], ground = GLASSY[base] ? fr.slice(0, 3).map((v, i) => v * fa + f0[i] * (1 - fa)).concat(1) : f0;
  svg.querySelectorAll('[stroke]').forEach(e => {
    const c = glowRgba(e.getAttribute('stroke') || 'none'); if (c[3] >= .9 || c[3] < .2) return;
    if (!fam.some(f => f[0] === c[0] && f[1] === c[1] && f[2] === c[2])) return;
    for (let a = c[3]; a <= .9; a += .05) { const m = [0, 1, 2].map(i => c[i] * a + ground[i] * (1 - a));
      if (glowContrast(m, ground) >= 3.5 || a + .05 > .9) { e.setAttribute('stroke', `rgba(${c[0]},${c[1]},${c[2]},${Math.min(.9, a).toFixed(2)})`); break; } }
  });
}
/* MATERIALS (Friend 2026-11-17 with a clip of the 4 skills side by side, VID_20261117_044422: "ทำให้ motion graphics มันเข้ากับ
   สไตล์นั้นๆมากกว่านี้"). Colour alone kept the glow-line look (outline drawings whose bodies are the background). In the clip each
   style draws with its own surfaces:
     card  (editorial)  flat UI: white cards with a soft shadow, icons on SOLID navy tiles (white icon), solid lime for what is lit
     glass (motion)     frosted glass: see-through white panels with a thin light edge, thin white lines, blue light
     split              flat pastel: white or lavender shapes with purple edges, icons on soft lavender tiles, solid lavender lit parts
     gold               glossy black cards with a thin light edge, icon tiles with an orange edge, orange light
   The drawing has a layout group (cards, plates, pills, frames) and one group per icon (GL.art). A body = a closed shape filled with
   the theme's body colour; an icon's tile = the smallest body around the icon. Lines over a body take the body's ink. */
/* glass keeps the first look, dark tiles with glowing edges (Friend 2026-11-17 with a still of it: "ส่วนสไตล์ talking head motion ผมชอบ
   แบบเก่ามากกว่า"), so it has no material. People (person icons) are one solid shape, as the people in Friend's clip (Friend: "ตัวคนทำไม
   สีมันแปลกๆหล่ะ" — they were the background showing through a see-through body) */
const GLOW_PEOPLE = new Set(['person-body', 'user', 'users', 'user-round', 'person-standing', 'users-round', 'user-check', 'user-x', 'user-plus', 'baby', 'contact']);
const glowFrost = P => P.frost ? P.frost[P.fillAlpha != null ? 1 : 0] : `rgba(170,178,185,${P.fillAlpha != null ? .4 : .3})`;
function glowMaterial(base, P) {
  const surf = glowRgba(P.fill), light = glowLum(surf) > .45 && P.fillAlpha == null;   // floating (fillAlpha) = on the video, a dark ground
  /* card: a navy tile only on a light page; on the dark page or the video a white tile with a navy icon (Friend 2026-11-17 sent a
     navy tile on the black page that vanished: "จำไว้เลยว่า สีมันต้องตัดกันเสมอ ไม่อย่างนั้นมันจะมองยาก") */
  if (base === 'card') return {body: {fill: '#FFFFFF', edge: 'rgba(20,33,61,.16)', shadow: true},
    tile: light ? {fill: '#14213D', stroke: '#14213D'} : {fill: '#FFFFFF', stroke: '#FFFFFF'},
    ink: '#14213D', soft: '#4F5A70', icon: light ? '#FFFFFF' : '#14213D', lit: 'solid', fig: light ? {fill: '#14213D', edge: '#14213D'} : {fill: '#FFFFFF', edge: '#FFFFFF'}};
  if (base === 'split') return light
    ? {body: {fill: '#FFFFFF', edge: P.line}, tile: {fill: '#ECE6F8', stroke: P.line}, ink: P.line, soft: P.soft, icon: P.line, lit: 'solid', fig: {fill: '#7A66B5', edge: P.line}}   // people 4.2:1 on the pale window (lavender #CDBFEA read 1.5:1)
    : {body: {fill: '#7A6AA4', edge: '#F1ECFB'}, tile: {fill: '#4E3F78', stroke: '#F1ECFB'}, ink: '#F1ECFB', soft: '#E4DCF4', icon: '#F1ECFB', lit: 'solid', fig: {fill: '#B9AAE4', edge: '#F1ECFB'}};   // people 3.4:1 on the dark window, a step darker than the accent (#D9CCF6, 4.8:1), so the chosen one stands out   // a deep tile under a light icon (a mid-purple one read 1.9:1)
  if (base === 'gold') return {body: {fill: 'url(#cpGloss)', edge: 'rgba(255,255,255,.52)'}, tile: {fill: 'url(#cpGloss)', stroke: P.accent},
    ink: P.line, soft: P.soft, icon: P.line, lit: 'tint', fig: {fill: '#C9CACF', edge: '#F2F2F4'}};
  /* neon (Friend's sheet 2, sampled): every body and tile is frosted grey glass (#3C454C on the navy screen) with a white edge, on the
     navy screen and on the video alike (on the video it reads lighter, #50555A on the dark sweater: .4, on the navy .3); the lit tile
     is a blue wash (#2F738C on the navy, #2A7997 on the video) under a blue edge, its icon in blue */
  if (GLASSY[base]) return {body: {fill: glowFrost(P), edge: P.line}, tile: {fill: glowFrost(P), stroke: P.line},
    ink: P.line, soft: P.soft, icon: P.line, lit: 'tint', fig: GLASSY[base].outlineLit ? {fill: GLASSY[base].fig ?? '#3A3E3F', edge: P.line} : {fill: '#C9D3DC', edge: P.line}};   // lime: people white outlines on dark (Friend's sheet) · window: a blue-grey body (#3A3E3F read 1.7:1 in its near-black window)
  return null;
}
/* the name of the icon a GL.art call draws (the icon groups are tagged data-icon, so people can be found) */
let GLOW_NAMES = null;
function glowTagIcons() {
  if (GL.art.__cp) return;
  const art0 = GL.art, tagged = (fn, o) => { const a = art0(fn, o);
    if (!GLOW_NAMES) GLOW_NAMES = new Map(Object.entries(GL.icons).map(([n, f]) => [f, n]));
    const n = GLOW_NAMES.get(fn); if (n && a && a.wrap) a.wrap.setAttribute('data-icon', n); return a; };
  tagged.__cp = true; GL.art = tagged;
  /* people drawn inside a design (a crowd: person-body → GL.parts.human, not GL.art): the pen's group is tagged data-fig */
  for (const k of ['human', 'person', 'bust', 'team']) { const f0 = GL.parts[k]; if (!f0 || f0.__cp) continue;
    const f = function (p, ...a) { const r = f0.call(this, p, ...a); if (p && p.g && p.g.setAttribute) p.g.setAttribute('data-fig', k); return r; };
    f.__cp = true; GL.parts[k] = f; }
}
function glowDress(svg, P, base) {
  const M = glowMaterial(base, P); if (!M) return;
  const light = glowLum(glowRgba(P.fill)) > .45 && P.fillAlpha == null;   // a light page (not the video)
  const solidOf = f => GLASSY[base] ? (GLASSY[base].solid ?? '#323C45') : f.startsWith('url') ? (base === 'glass' ? '#2E343D' : '#1A1A1F') : f;   // a cut or an icon's own body on a see-through / glossy surface
  svg.querySelector('defs').insertAdjacentHTML('beforeend', `
    <linearGradient id="cpGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".12"/><stop offset="1" stop-color="#ffffff" stop-opacity=".04"/></linearGradient>
    <linearGradient id="cpGloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34343B"/><stop offset=".5" stop-color="#1F1F24"/><stop offset="1" stop-color="#141417"/></linearGradient>
    <filter id="cpShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#14213D" flood-opacity=".16"/></filter>`);
  const same = (v, c) => { if (!v || v === 'none' || v.startsWith('url')) return false; const a = glowRgba(v), b = glowRgba(c); return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]; };
  const root = svg.querySelector(':scope > g'), box = e => e.getBoundingClientRect(), area = r => r.width * r.height;
  const bodies = [...root.querySelectorAll('rect,circle,ellipse,path,polygon')].filter(e => same(e.getAttribute('fill'), P.fill) && !e.closest('clipPath') && area(box(e)) > 40);
  const icons = [...root.children].slice(1).filter(g => g.tagName === 'g').map(g => ({g, r: box(g)})).filter(o => area(o.r) > 0);   // after the layout group: one group per icon
  const inside = (r, x, y) => x > r.left && x < r.right && y > r.top && y < r.bottom;
  const tiles = new Map();                          // body → its icon group
  for (const ic of icons) {
    const cx = (ic.r.left + ic.r.right) / 2, cy = (ic.r.top + ic.r.bottom) / 2;
    const t = bodies.filter(b => { const r = box(b); return !ic.g.contains(b) && inside(r, cx, cy) && area(r) < 7 * area(ic.r) && area(r) > .6 * area(ic.r); })   // the tile is outside the icon (not the icon's own cloud or face)
      .sort((a, b) => area(box(a)) - area(box(b)))[0];
    if (t) tiles.set(t, ic.g);
  }
  const big = 700 * 1000 * .04 * Math.pow(box(svg).width / 1000, 2);   // a body bigger than this is a card (no dark outline, a shadow)
  const order = [...root.querySelectorAll('*')], pos = new Map(order.map((e, i) => [e, i]));
  const tiledIcons = [...tiles.values()], inTiledIcon = e => tiledIcons.some(g => g.contains(e));
  const figs = icons.map(o => o.g).filter(g => GLOW_PEOPLE.has(g.getAttribute('data-icon')) && !tiledIcons.includes(g))
    .concat([...root.querySelectorAll('[data-fig]')].filter(g => !inTiledIcon(g))), inFig = e => figs.some(g => g.contains(e));
  const plain = bodies.filter(b => !tiles.has(b) && !inTiledIcon(b) && !inFig(b)).map(b => ({b, r: box(b), i: pos.get(b)}));   // an icon on a tile and a person keep their own shapes for their own step
  /* people: one solid shape; the chosen one (drawn in the accent) is a solid accent shape, edged in the ink where the accent alone
     would not read (card's lime on cream: Friend's crowd lost its chosen person when the lime edge turned navy) */
  const accRgb = glowRgba(P.accent), isAccV = v => !!v && v !== 'none' && !v.startsWith('url') && same(v, P.accent);
  for (const g of figs) {
    const sel = [...g.querySelectorAll('[fill],[stroke]')].some(e => isAccV(e.getAttribute('stroke')) || isAccV(e.getAttribute('fill')));
    const fill = sel ? P.accent : M.fig.fill, edge = sel ? (glowContrast(accRgb, glowRgba(P.fill)) < 3 ? M.ink : P.accent) : M.fig.edge;
    g.querySelectorAll('[fill],[stroke]').forEach(e => ['fill', 'stroke'].forEach(a => { const v = e.getAttribute(a);
      if (same(v, P.fill) || (a === 'fill' && isAccV(v))) { e.setAttribute(a, fill); if (a === 'fill') e.removeAttribute('fill-opacity'); }
      else if (same(v, P.line) || same(v, P.soft) || isAccV(v)) e.setAttribute(a, edge); }));
  }
  /* bodies */
  for (const {b, r, i} of plain) {
    /* neon: a body on another body (an icon's own shape on a frosted card) is solid, else the frosted glass stacks up and turns pale
       (the white lines on it read 1.1:1) */
    const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2, onBody = !!GLASSY[base] && plain.some(o => o.i < i && area(o.r) > area(r) && inside(o.r, cx, cy));
    b.setAttribute('fill', onBody ? solidOf(M.body.fill) : M.body.fill); b.removeAttribute('fill-opacity');
    if (area(r) > big || base !== 'card') { if (M.body.edge) b.setAttribute('stroke', M.body.edge); }
    else b.setAttribute('stroke', M.ink);           // a small white card piece keeps a navy edge on any page (a white knob on lime, a white plate on a white card read 1:1)
    if (M.body.shadow) b.setAttribute('filter', 'url(#cpShadow)');
  }
  for (const [t, g] of tiles) {
    t.setAttribute('fill', M.tile.fill); t.setAttribute('stroke', M.tile.stroke);
    g.querySelectorAll('[fill],[stroke]').forEach(e => ['fill', 'stroke'].forEach(a => { const v = e.getAttribute(a);
      if (same(v, P.fill)) e.setAttribute(a, solidOf(M.tile.fill));   // the icon's own bodies and cuts take the tile
      else if (same(v, P.line) || same(v, P.soft)) e.setAttribute(a, M.icon); }));
  }
  /* lines and words over a body take the body's ink (card: navy on its white cards, also on a dark page) */
  order.forEach(e => {
    if (bodies.includes(e) || inTiledIcon(e) || inFig(e)) return;
    const r = box(e); if (!area(r) && !r.width) return;
    const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2, i = pos.get(e);
    if (!plain.some(o => o.i < i && inside(o.r, cx, cy))) return;
    for (const a of ['fill', 'stroke']) { const v = e.getAttribute(a);
      if (same(v, P.line)) e.setAttribute(a, M.ink); else if (same(v, P.soft)) e.setAttribute(a, M.soft);
      else if (same(v, P.fill)) e.setAttribute(a, solidOf(M.body.fill));
      else if ((a === 'stroke' || e.tagName === 'text') && same(v, P.accent) && !M.body.fill.startsWith('url') && glowContrast(glowRgba(P.accent), glowRgba(M.body.fill)) < 2)
        e.setAttribute(a, M.ink); }                  // an accent line or word on a body it cannot be read on (lime on a white card 1.1:1): the body's ink
  });
  /* what lights up: a solid accent in the flat styles (card's lime, split's lavender), a tint under the glow in glass and gold */
  { const acc = glowRgba(P.accent);
    root.querySelectorAll('[fill]').forEach(e => { const f = e.getAttribute('fill') || 'none'; if (/^url|none/.test(f)) return; const c = glowRgba(f);
      if (c[0] !== acc[0] || c[1] !== acc[1] || c[2] !== acc[2] || c[3] < .12 || c[3] >= 1) return;
      if (M.lit === 'solid') { e.setAttribute('fill', P.accent);
        if (base === 'card' && (light || P.fillAlpha != null)) { e.setAttribute('stroke', M.ink); if (!+e.getAttribute('stroke-width')) e.setAttribute('stroke-width', 2.2); } }   // lime on white needs its navy edge (1.1:1 without)
      else if (base === 'glass') e.setAttribute('fill', `rgba(${acc[0]},${acc[1]},${acc[2]},${Math.min(c[3], .1)})`);   // glass: a faint blue wash, the light is on the edge
      else if (GLASSY[base]) e.setAttribute('fill', GLASSY[base].lit);   // neon: Friend's lit tile, a deep blue wash
    }); }
  /* a word on a solid accent shape takes whichever ink reads best on it (split's chosen label: white words on pale lavender 1.3:1) */
  const accSolid = [...root.querySelectorAll('rect,circle,ellipse,path,polygon')].filter(e => { const f = e.getAttribute('fill') || 'none';
    return !/^url|none/.test(f) && same(f, P.accent) && glowRgba(f)[3] >= .9; }).map(e => ({r: box(e), i: pos.get(e) ?? -1}));
  if (accSolid.length) root.querySelectorAll('text').forEach(t => {
    const r = box(t), cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2, i = pos.get(t) ?? 1e9;
    if (!accSolid.some(s => s.i < i && inside(s.r, cx, cy))) return;
    const cur = glowRgba(t.getAttribute('fill') || P.line); if (glowContrast(cur, accRgb) >= 3) return;
    const best = [M.ink, P.line, P.fill, '#14213D', '#FFFFFF'].filter(c => !String(c).startsWith('url')).sort((a, b) => glowContrast(glowRgba(b), accRgb) - glowContrast(glowRgba(a), accRgb))[0];
    t.setAttribute('fill', best);
  });
  /* neon: the templates stack two copies of a tile (the tile + its "not reached / reached" state on top); two frosted glasses on one
     another turned the tile pale grey (#8A97A8 where Friend's is #3C454C), so a copy over the same box keeps only its edge */
  if (GLASSY[base]) {
    const GS = GLASSY[base];
    /* lime (Friend's sheet: every lit tile is a lime outline on dark glass, none is filled): a solid accent tile becomes the lit wash
       with an accent edge (the lit-tile pass below then colours its icon) */
    /* lime: a big solid white shape (a category-set drawing's page or screen, B18 calendar: 1.1:1 under its white lines) becomes frosted
       glass with a white edge, as every body on Friend's sheet */
    if (GS.outlineLit) root.querySelectorAll('rect,circle,ellipse,path,polygon').forEach(e => { const f = e.getAttribute('fill');
      if (!same(f, P.line) || glowRgba(f)[3] < .9 || area(box(e)) < 4000) return;
      e.setAttribute('fill', '#3A3E3F'); if ((e.getAttribute('stroke') || 'none') === 'none') { e.setAttribute('stroke', P.line); e.setAttribute('stroke-width', '2.5'); } });   // solid (frosted ones stacked pale: 1.5:1)
    if (GS.outlineLit) root.querySelectorAll('rect,circle,ellipse,path,polygon').forEach(e => { const f = e.getAttribute('fill');
      if (!isAccV(f) || glowRgba(f)[3] < .9 || area(box(e)) < 2500) return;
      e.setAttribute('fill', GS.lit); if ((e.getAttribute('stroke') || 'none') === 'none') { e.setAttribute('stroke', P.accent); e.setAttribute('stroke-width', '3'); } });
    /* every word of a picture gets a thin dark edge under it, so a label that lands on a white ring or a bright video still reads
       (Friend's clip 2026-11-17: "ไม่ต้องรอ" over the ring of a no-sign); dark, so the glow does not light it */
    /* a white mark on a solid light-blue shape (a lit dot with its white ring: 1.5:1 in B08T) turns deep navy */
    { const filled = [...root.querySelectorAll('rect,circle,ellipse,path,polygon')].filter(e => { const f = e.getAttribute('fill') || 'none'; return !/^url|none/.test(f) && glowRgba(f)[3] >= .3; })
        .map(e => ({e, r: box(e), i: pos.get(e) ?? -1, acc: isAccV(e.getAttribute('fill')) && glowRgba(e.getAttribute('fill'))[3] >= .9}));
      if (filled.some(o => o.acc)) root.querySelectorAll('*').forEach(e => { const i = pos.get(e) ?? -1, r = box(e); if (!area(r) && !r.width) return;
        const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
        const under = filled.filter(o => o.e !== e && o.i < i && !o.e.contains(e) && inside(o.r, cx, cy)).pop();   // the shape right behind it
        if (!under?.acc) return;
        for (const k of ['stroke', 'fill']) if (same(e.getAttribute(k), P.line)) e.setAttribute(k, GS.mark); }); }
    if (!GS.noEdge) root.querySelectorAll('text').forEach(t => { t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke', 'rgba(6,12,20,.85)'); t.setAttribute('stroke-width', '7'); t.setAttribute('stroke-linejoin', 'round'); });   // (noEdge: the pink style's dark words on white)
    const fr = glowFrost(P), shapes = [...root.querySelectorAll('rect,circle,ellipse,path,polygon')], same4 = (a, b) => ['left', 'top', 'width', 'height'].every(q => Math.abs(a[q] - b[q]) < 3);
    const frost = shapes.filter(e => e.getAttribute('fill') === fr).map(e => ({e, r: box(e)}));
    frost.forEach((f, k) => { if (frost.slice(0, k).some(o => same4(o.r, f.r))) f.e.setAttribute('fill', 'rgba(170,178,185,0)'); });
    /* the lit tile (Friend's sheet: shot 02 the magnifier, shot 04 the envelope): a blue edge and a blue icon, the frosted glass under it gone */
    /* washLit (the window style only, Friend 2026-11-18: "อยากให้มีผลเฉพาะสไตล์นี้ครับ ถ้าสไตล์อื่นไม่มีปัญหาก็ไม่ต้องแก้"): a see-through accent
       tile (a goal's lit box, LIT2) is a lit tile too, a lit shape on it is its icon, and accent lines on it turn light (B08T pinlock's star: 2.1:1) */
    const washed = e => { const f = e.getAttribute('fill'); return GS.washLit && isAccV(f) && glowRgba(f)[3] >= .12 && glowRgba(f)[3] < .9 && area(box(e)) >= 2500; };
    const lits = shapes.filter(e => e.getAttribute('fill') === GS.lit || washed(e));
    for (const l of lits) {
      const r = box(l);
      if (GS.washLit && lits.some(m => m !== l && area(box(m)) > area(r) && inside(box(m), (r.left + r.right) / 2, (r.top + r.bottom) / 2))) {   // a lit shape on a lit tile (pinlock's star on its goal box) is the tile's icon
        if ((l.getAttribute('stroke') || 'none') !== 'none') { l.setAttribute('stroke', GS.litIcon); l.setAttribute('stroke-width', ((+l.getAttribute('stroke-width') || 2) * 1.6).toFixed(2)); } continue; }   // (its thin line read 2.75:1)
      const ics = icons.filter(o => inside(r, (o.r.left + o.r.right) / 2, (o.r.top + o.r.bottom) / 2) && area(r) < 7 * area(o.r));
      frost.forEach(f => { if (same4(f.r, r)) f.e.setAttribute('fill', 'rgba(170,178,185,0)'); });   // (the frost under it made the wash a solid light blue, Friend's is a deep see-through blue)
      if (!ics.length && r.width > 3 * r.height) { l.setAttribute('fill', GS.litBar); continue; }   // a lit bar keeps its white edge (shot 02), a deeper blue under its white words (2.8:1 on the light one)
      if ((l.getAttribute('stroke') || 'none') !== 'none') l.setAttribute('stroke', P.accent);
      ics.forEach(o => o.g.querySelectorAll('[stroke],[fill]').forEach(e => {   // the icon: light blue lines (#CFEFFF: #9FE0FF read 2.9:1 where the icon is dimmed), its own bodies the deep blue
        const v = e.getAttribute('stroke'), f = e.getAttribute('fill'); if (same(v, P.line) || same(v, P.soft) || isAccV(v)) e.setAttribute('stroke', GS.litIcon);
        if (same(f, GS.solid ?? '#323C45')) e.setAttribute('fill', GS.litBody); }));
      shapes.forEach(e => { const f = e.getAttribute('fill'), q = box(e); if (e !== l && isAccV(f) && glowRgba(f)[3] >= .9 && inside(r, (q.left + q.right) / 2, (q.top + q.bottom) / 2)) e.setAttribute('fill', GS.litMark ?? '#CDEFFF'); });   // a solid accent mark on it (shot 05's "!") reads 2.7:1 on the blue: a paler blue
      if (GS.washLit) shapes.forEach(e => { const q = box(e); if (e !== l && isAccV(e.getAttribute('stroke')) && area(q) < area(r) && inside(r, (q.left + q.right) / 2, (q.top + q.bottom) / 2)) e.setAttribute('stroke', GS.litIcon); });
    }
    /* litWord (the yellow style only, Friend's 6th sheet: the lit step's word is yellow, "ยืดเส้น" over the lit chevron, "เข้านอน" beside
       the lit tile, "ทบทวน" in the lit bar): a white word whose nearest tile is a lit one takes the accent */
    if (GS.litWord && lits.length) {
      const tilesW = shapes.filter(e => area(box(e)) >= 2500 && (lits.includes(e) || (e.getAttribute('fill') === fr && glowRgba(fr)[3] > 0))).map(e => ({e, r: box(e), lit: lits.includes(e)}));
      const gap = (r, q) => Math.hypot(Math.max(r.left - q.right, 0, q.left - r.right), Math.max(r.top - q.bottom, 0, q.top - r.bottom));   // between the word's box and the tile's
      const mid = (r, q) => Math.hypot((r.left + r.right - q.left - q.right) / 2, (r.top + r.bottom - q.top - q.bottom) / 2);
      root.querySelectorAll('text').forEach(t => { if (!same(t.getAttribute('fill'), P.line) && !same(t.getAttribute('fill'), P.soft)) return;   // (the rail's second line too, shot 07)
        const q = box(t), near = tilesW.map(o => ({o, d: gap(o.r, q) + .01 * mid(o.r, q)})).sort((a, b) => a.d - b.d || b.o.lit - a.o.lit)[0];   // a word over a row of chevrons: the one under its middle
        if (near?.o.lit && near.d < .6 * Math.min(near.o.r.width, near.o.r.height)) t.setAttribute('fill', P.accent); });   // an accent line drawn on it that is not a tagged icon (B08T pinlock: 2.1:1 on the wash)
    }
  }
}
/* centreBox (the neon style only, Friend 2026-11-18 on the final: "ถ้ามีกรอบข้อความแบบนี้ อยากให้ icon และข้อความอยู่กึ่งกลาง", B18 ribbon's sign:
   a mic and "พูดสดๆ" at its left, its right half empty): a text box (a rect at least twice as wide as tall, a word in it) whose icon and
   words sit off its middle gets them moved to its middle, as one group, at the drawing's end. Only what lies wholly in the box and is
   drawn after it moves; a box holding a wide shape (a bar's fill, a second box) is not a text box and stays as it is. */
function glowCentre(svg) {
  const root = svg.querySelector(':scope > g'); if (!root) return;
  const box = e => e.getBoundingClientRect(), within = (q, r, m = 2) => q.left >= r.left - m && q.right <= r.right + m && q.top >= r.top - m && q.bottom <= r.bottom + m;
  const leafSel = 'path,line,polyline,polygon,rect,circle,ellipse,text,image';
  const seen = e => { for (let x = e; x && x !== svg; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || +cs.opacity < .05) return false; } return true; };
  const pos = new Map([...root.querySelectorAll('*')].map((e, k) => [e, k]));
  const rects = [...root.querySelectorAll('rect')].filter(e => !e.closest('clipPath,defs,mask') && seen(e)).map(e => ({e, r: box(e)}))
    .filter(o => o.r.width >= 2 * o.r.height && o.r.width > 60);
  const ctm = svg.getScreenCTM(), k = ctm ? 1 / ctm.a : 1;          // screen px → the drawing's units
  for (const {e: b, r} of rects) {
    const leaves = [...root.querySelectorAll(leafSel)].filter(e => e !== b && !e.closest('clipPath,defs,mask') && seen(e) && (pos.get(e) ?? 0) > (pos.get(b) ?? 0))
      .map(e => ({e, q: box(e)})).filter(o => (o.q.width > .5 || o.q.height > .5) && within(o.q, r));
    if (!leaves.some(o => o.e.tagName === 'text' && o.e.textContent.trim())) continue;
    if (leaves.some(o => o.e.tagName !== 'text' && o.q.width >= .5 * r.width)) continue;   // a bar's fill or a box in the box: not a text box
    /* what moves: the highest group around each leaf that still lies wholly in the box (an icon moves as its group) */
    const tops = new Set(leaves.map(({e}) => { let x = e; while (x.parentElement && x.parentElement !== root && !x.parentElement.contains(b) && within(box(x.parentElement), r)) x = x.parentElement; return x; }));
    const u = [...tops].map(box).reduce((a, q) => ({left: Math.min(a.left, q.left), right: Math.max(a.right, q.right), top: Math.min(a.top, q.top), bottom: Math.max(a.bottom, q.bottom)}));
    const dx = ((r.left + r.right) - (u.left + u.right)) / 2, dy = ((r.top + r.bottom) - (u.top + u.bottom)) / 2;
    if (Math.abs(dx) < .04 * r.width && Math.abs(dy) < .08 * r.height) continue;   // already in the middle
    for (const x of tops) { const m = x.parentNode.getScreenCTM?.(), kx = m ? 1 / Math.hypot(m.a, m.b) : k;   // in the units of its own parent (a scaled group)
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('transform', `translate(${(dx * kx).toFixed(1)} ${(dy * kx).toFixed(1)})`); g.setAttribute('data-centred', '');
      x.parentNode.insertBefore(g, x); g.appendChild(x); }
  }
}
/* the style's glow: a soft halo of one colour around every line (glass) or around what took the accent (gold) */
function glowLight(svg, P, base) {
  const G = GLOWLOOK[base]?.glow; if (!G) return;
  const defs = svg.querySelector('defs');
  /* neon glows harder (Friend 2026-11-17: "ผมรู้สึกว่า motion graphics มันยังไม่เรืองแสงเท่ากับ reference"): a third, wide halo */
  const hard = !!GLASSY[base];
  /* lime: only the bright edge glows, not the tile's dim wash (Friend's sheet: lit tiles are a lime outline; the wash had lit up the
     whole tile as a solid lime block) — the glow is made from the bright parts (as cpGlowSelf), not from every pixel's alpha */
  const edge = GLASSY[base]?.outlineLit, src = edge ? 'hi' : 'SourceAlpha';
  defs.insertAdjacentHTML('beforeend', `<filter id="cpGlow" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB">
    ${edge ? '<feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  .6 1 .4 1 -2" result="hi"/>' : ''}
    <feGaussianBlur in="${src}" stdDeviation="3" result="a"/><feGaussianBlur in="${src}" stdDeviation="10" result="b"/><feGaussianBlur in="${src}" stdDeviation="22" result="c"/>
    <feFlood flood-color="${G.c}" flood-opacity="${hard ? 1 : .9}"/><feComposite in2="a" operator="in" result="ga"/>
    <feFlood flood-color="${G.c}" flood-opacity="${hard ? .85 : .55}"/><feComposite in2="b" operator="in" result="gb"/>
    <feFlood flood-color="${G.c}" flood-opacity="${hard ? .5 : 0}"/><feComposite in2="c" operator="in" result="gc"/>
    <feMerge><feMergeNode in="gc"/><feMergeNode in="gb"/><feMergeNode in="ga"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
  const root = svg.querySelector(':scope > g');
  if (G.self) {                                   // neon: every line glows softly in its own colour (white lines a white haze), the accent below glows blue
    /* only the bright parts glow (alpha' = 2 × lightness + alpha − 2): the white and blue lines, not the frosted glass (its blurred copies
       stacked up and turned the tiles pale grey) */
    /* stronger (Friend 2026-11-17: "ยังไม่เรืองแสงเท่ากับ reference"): a tight white glow, a wider one, and a wide blue halo as on the sheet */
    defs.insertAdjacentHTML('beforeend', `<filter id="cpGlowSelf" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
      <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  .6 1 .4 1 -2" result="hi"/>
      <feGaussianBlur in="hi" stdDeviation="2.6" result="a"/><feGaussianBlur in="hi" stdDeviation="8" result="b"/><feGaussianBlur in="hi" stdDeviation="18" result="c"/>
      <feComponentTransfer in="b" result="b2"><feFuncA type="linear" slope="${(.95 * (GLASSY[base]?.glow ?? 1)).toFixed(2)}"/></feComponentTransfer>
      <feFlood flood-color="${GLASSY[base]?.halo ?? '#5AB8FF'}" flood-opacity="${Math.min(1, .6 * (GLASSY[base]?.glow ?? 1)).toFixed(2)}"/><feComposite in2="c" operator="in" result="c2"/>
      <feMerge><feMergeNode in="c2"/><feMergeNode in="b2"/><feMergeNode in="a"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
    root.setAttribute('filter', 'url(#cpGlowSelf)');
    root.querySelectorAll('[filter="url(#glow)"]').forEach(e => e.removeAttribute('filter'));   // the engine's own glow merges blurred copies of the frosted glass too (tiles #6C7C8C, not #3C454C)
  }
  if (G.all) { root.setAttribute('filter', 'url(#cpGlow)'); return; }   // glass: the whole drawing glows (the first look, which Friend kept)
  const [r, g, b] = glowRgba(P.accent), hex = P.accent.toLowerCase(), rgb = new RegExp(`rgba?\\(\\s*${r}\\s*,\\s*${g}\\s*,\\s*${b}\\b`);
  root.querySelectorAll('[fill],[stroke]').forEach(e => {
    const hit = ['fill', 'stroke'].some(a => { const v = (e.getAttribute(a) || '').toLowerCase(); return v === hex || rgb.test(v); });
    if (hit && !e.closest('[filter="url(#cpGlow)"]') && !e.closest('[data-fig]')) e.setAttribute('filter', 'url(#cpGlow)');
  });
}
/* draw design i of category cat with data d into a box of the frame (F.stage, or another box the style gives, e.g. the recap's three
   rows). The drawing is fitted to the box by what it really shows (a style decides every box: Friend's sheets place each picture
   exactly). Several drawings per page work: each one gets its own GL stage, the runtime's clock drives them all. */
let GLOW_HOOKED = false;
function glowDraw(F, T, cat, i, d, box = F.stage) {
  const base = ST.id.split('-overlay')[0], W = parseFloat(box.style.width) || 1000, H = parseFloat(box.style.height) || 700;
  /* clipRoom (the neon style only, final 2026-11-18): the picture keeps its size and whatever of its motion runs past its box and the room
     around it (F.room: up to the words, the framed face, the safe zone) fades out over up to 28 px at that edge, so it never crosses them */
  const R = GLOWLOOK[base]?.clipRoom && F.room && box === F.stage ? F.room : null;
  let into = box;
  if (R) { into = div(`left:${-R.l}px;top:${-R.t}px;width:${W + R.l + R.r}px;height:${H + R.t + R.b}px;overflow:hidden;` +
    `-webkit-mask-image:linear-gradient(90deg,transparent,#000 ${Math.min(28, R.l)}px,#000 calc(100% - ${Math.min(28, R.r)}px),transparent),linear-gradient(180deg,transparent,#000 ${Math.min(28, R.t)}px,#000 calc(100% - ${Math.min(28, R.b)}px),transparent);` +   // (a side with less room fades over less: the picture's own end never fades)
    '-webkit-mask-composite:source-in;mask-composite:intersect', box); into.className = 'glow-room'; }
  const host = div(`left:${R ? R.l : 0}px;top:${R ? R.t : 0}px;width:${W}px;height:${H}px`, into); host.className = 'glow-host';
  window.GLOW_PENDING = (window.GLOW_PENDING || 0) + 1; window.GLOW_READY = false;
  GL.run(() => {
    const P = glowPalette(host, base);
    GL.stage({w: 1000, h: 700, glow: 0});           // the style's glow is added below (glowLight); the engine's own white glow is off
    GL.theme(P);                                    // after stage(): stage() sets the body fill back to its own black
    const svg = [...document.body.children].filter(e => e.tagName.toLowerCase() === 'svg').pop();
    svg.querySelector('rect[fill="url(#glbg)"]')?.remove();   // no glow-line background: the style's frame is the background
    host.appendChild(svg); svg.setAttribute('width', W); svg.setAttribute('height', H); svg.style.overflow = 'visible';
    const at = T.b[0];
    glowTagIcons();
    GL.cats[cat].draw(i, d, {x: 500, y: 350, s: 1, at, hit: Math.max(.6, T.hit - at)});
    GL.finish({hold: 0});                           // themeApply: every fixed glow-line colour → the style's
    glowDims(svg);
    window.setT(window.DURATION);                   // the end state again, with the dims lifted (the colour steps measure it)
    glowReadable(svg, P);
    glowFirm(svg, P, base);
    glowDress(svg, P, base);
    if (GLASSY[base]?.centreBox) glowCentre(svg);  // neon only (final 2026-11-18): the icon and word of a text box in its middle
    glowLight(svg, P, base);
    if (GLOWLOOK[base]?.motionFit) glowFit(svg, at, T.t1 ?? window.DURATION, W, H, F.room ?? null);   // window: what is really visible fills the box, and its motion stays in it
    else { const b = glowVisibleBox(svg), p = Math.max(b.width, b.height) * .03;      // the other styles: what is really visible at its end fills the box (Friend: "อันไหนมีขนาดเล็กเกินไป ขยายให้พอดีด้วย")
      svg.setAttribute('viewBox', `${b.x - p} ${b.y - p} ${b.width + 2 * p} ${b.height + 2 * p}`); }
    glowWeight(svg, P, base);                       // after the fit: the line weight is measured on screen
    if (!GLOW_HOOKED) { GLOW_HOOKED = true; HOOKS.push(t => window.setT(t)); }
    window.GLOW_PENDING--; window.GLOW_READY = window.GLOW_PENDING === 0;
  });
}
/* COLOUR CHECK (Friend 2026-11-17: "ยังมีเรื่องสีที่กลืนกันและมองยากอยู่ แก้ไขด้วย"): every line and word of the drawing against what is
   right behind it (the nearest filled shape drawn before it that covers its middle, else the frame's surface; on the video = dark grey),
   with its real see-through (colour alpha × every parent's opacity at the shot). A line or word under 3:1 is listed (WCAG for graphics);
   a thing faded below 25 % on purpose (a ghost, a "wrong" that dims) is left out. Returns [{what, colour, behind, ratio}]. */
function glowCheck() { return [...document.querySelectorAll('.glow-host')].flatMap(glowCheckOne); }   // every drawing on the page (a recap has three)
function glowCheckOne(host) {
  const svg = host.querySelector('svg'), root = svg.querySelector(':scope > g'), box = e => e.getBoundingClientRect();
  const ground = glowSurface(host) ?? [30, 30, 32, 1];
  const solid = f => f === 'url(#cpGloss)' ? [31, 31, 36, 1] : f === 'url(#cpGlass)' ? [255, 255, 255, .08] : glowRgba(f);
  const over = (c, a, b) => [0, 1, 2].map(i => c[i] * a + b[i] * (1 - a)).concat(1);
  const seen = e => { let a = 1; for (let x = e; x && x !== svg; x = x.parentElement) a *= +getComputedStyle(x).opacity; return a; };
  const all = [...root.querySelectorAll('*')], pos = new Map(all.map((e, i) => [e, i]));
  const fills = all.filter(e => /^(rect|circle|ellipse|path|polygon)$/.test(e.tagName) && !e.closest('clipPath')).map(e => {
    const f = e.getAttribute('fill'); if (!f || f === 'none') return null; const c = solid(f), a = c[3] * seen(e) * +(e.getAttribute('fill-opacity') ?? 1);
    const r = box(e); return a >= .3 && r.width * r.height > 300 ? {e, c, a, r, i: pos.get(e)} : null; }).filter(Boolean);
  let top = null;                                   // the nearest shape behind (its own colour, before see-through)
  const behind = (e, cx, cy) => { let col = ground; top = null; for (const f of fills) if (f.i < pos.get(e) && f.e !== e && !f.e.contains(e) && cx > f.r.left && cx < f.r.right && cy > f.r.top && cy < f.r.bottom) { col = over(f.c, f.a, col); top = f; } return col; };
  const rgbEq = (a, b) => a && b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2], P = GL.themeNow || {}, body = glowRgba(P.fill || '#000');
  const out = [];
  /* shapes against what is behind them: a tile or a card whose fill is under 1.4:1 with its ground and whose edge is under 3:1
     cannot be seen (Friend 2026-11-17: a navy tile on the black page) */
  for (const f of fills) {
    if (f.r.width * f.r.height < 1500 || f.e.closest('[data-fig]') || f.e.getAttribute('filter') === 'url(#cpShadow)') continue;   // a card with a shadow stands out by its shadow
    const bg = behind(f.e, (f.r.left + f.r.right) / 2, (f.r.top + f.r.bottom) / 2), col = over(f.c, f.a, bg), k = glowContrast(col, bg);
    const s = f.e.getAttribute('stroke'), sc = s && s !== 'none' && !s.startsWith('url') ? glowRgba(s) : null;
    const edge = sc ? glowContrast(over(sc, sc[3] * seen(f.e), bg), bg) : 1;
    /* a fill inside a shape whose own edge reads (the lit part of neon's white-edged bar) is seen by that edge */
    const held = fills.some(o => o !== f && o.i < f.i && f.r.left >= o.r.left - 6 && f.r.right <= o.r.right + 6 && f.r.top >= o.r.top - 6 && f.r.bottom <= o.r.bottom + 6 && (() => {
      const s2 = o.e.getAttribute('stroke'); if (!s2 || s2 === 'none' || s2.startsWith('url')) return false; const c2 = glowRgba(s2); return glowContrast(over(c2, c2[3] * seen(o.e), ground), ground) >= 3; })());
    if (k < 1.4 && edge < 3 && !held && !(rgbEq(f.c, body) && !top)) out.push({what: 'shape ' + f.e.tagName, colour: glowHex(f.c), behind: glowHex(bg), ratio: +k.toFixed(2)});
  }
  /* people as a whole: their own colour (the most used one) against the ground; their limbs are tubes, so line by line they are skipped */
  for (const g of root.querySelectorAll('[data-fig]')) {
    const n = {}; g.querySelectorAll('[stroke],[fill]').forEach(e => ['stroke', 'fill'].forEach(a => { const v = e.getAttribute(a); if (v && v !== 'none' && !v.startsWith('url')) n[v] = (n[v] || 0) + 1; }));
    const main = Object.entries(n).sort((a, b) => b[1] - a[1])[0]; if (!main) continue;
    const r = box(g), cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2; let bg = ground;   // what is behind the person, not the person's own layers
    for (const f of fills) if (f.i < pos.get(g) && !f.e.closest('[data-fig]') && cx > f.r.left && cx < f.r.right && cy > f.r.top && cy < f.r.bottom) bg = over(f.c, f.a, bg);
    const c = glowRgba(main[0]), k = glowContrast(over(c, c[3] * seen(g), bg), bg);
    if (k < 3) out.push({what: 'person', colour: main[0], behind: glowHex(bg), ratio: +k.toFixed(2)});
  }
  const px = e => { const m = e.getScreenCTM(); return m ? +(e.getAttribute('stroke-width') || 1) * Math.hypot(m.a, m.b) : 0; };
  for (const e of all) {
    if (e.closest('[data-fig]')) continue;            // checked as a whole above
    { const f = e.getAttribute('fill'); if (e.tagName !== 'text' && f && f !== 'none' && !f.startsWith('url') && glowRgba(f)[3] >= .5) continue; }   // a filled shape's own edge: the shape is checked by its fill above
    const text = e.tagName === 'text', v = text ? e.getAttribute('fill') : e.getAttribute('stroke');
    if (!v || v === 'none' || v.startsWith('url') || (!text && px(e) < .6)) continue;   // every line that shows on screen (the thin icon lines too)
    const c = glowRgba(v), a = c[3] * seen(e) * +(e.getAttribute(text ? 'fill-opacity' : 'stroke-opacity') ?? 1); if (a < .25) continue;
    const r = box(e); if (r.width < 2 && r.height < 2) continue;
    const bg = behind(e, (r.left + r.right) / 2, (r.top + r.bottom) / 2), fg = over(c, a, bg), k = glowContrast(fg, bg);
    if (!text && (rgbEq(c, body) || rgbEq(c, top?.c) || rgbEq(c, [50, 60, 69]) || (GLASSY[ST.id.split('-overlay')[0]]?.solid && rgbEq(c, glowRgba(GLASSY[ST.id.split('-overlay')[0]].solid))))) continue;   // (#323C45 = neon's solid cut)    // on purpose: a cut in the body colour, a shape's own edge, a solid person's limbs
    if (k < 3) out.push({what: text ? 'word "' + e.textContent + '"' : e.tagName, colour: v, behind: glowHex(bg), ratio: +k.toFixed(2)});
    else if (!text && px(e) < 1.5 && a >= .5) out.push({what: 'thin ' + e.tagName + ' ' + px(e).toFixed(1) + 'px', colour: v, behind: glowHex(bg), ratio: +k.toFixed(2)});   // a hairline reads grey however its colour
  }
  return out;
}
/* one glow scene: <id> draws design i of cat; say = [lead, key] (the sentence's words: placed by the style). o.layout = one of the
   style's layouts by name (tests, a planner's choice); cat null = words only (a talk shot). */
function GLOWSCENE(id, cat, i, d, say, o = {}) {
  SCENE(id, {name: id, story: cat, beats: 4, cat, small: true, layout: o.layout, variant: cat && GL.cats[cat] ? `${cat}.${GL.cats[cat].variants[i].id}` : null,
    slots: {lead: {type: 'text', max: 60, sample: say[0]}, key: {type: 'text', max: 30, sample: say[1]}}},
    (K, s, T) => { if (cat) glowDraw(K.F, T, cat, i, d); else if (!window.GLOW_PENDING) window.GLOW_READY = true; K.say(s.lead, s.key); });   // words only: nothing to wait for
}
/* a recap: several designs at once, one per box of the style's recap layout (F.stages) */
function GLOWRECAP(id, list, say, o = {}) {
  SCENE(id, {name: id, story: 'recap', beats: 4, small: true, layout: o.layout ?? 'recap',
    slots: {lead: {type: 'text', max: 60, sample: say[0]}, key: {type: 'text', max: 30, sample: say[1]}}},
    (K, s, T) => { list.forEach(([cat, i, d], k) => { const box = K.F.stages?.[k]; if (box) glowDraw(K.F, T, cat, i, d, box); }); K.say(s.lead, s.key); });
}
