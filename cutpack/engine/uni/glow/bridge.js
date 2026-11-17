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
const GLOWLOOK = {
  card:  {acc: '--ac',     glow: null},                                  // card: no glow, lime accent
  glass: {acc: '#8FD3FF',  glow: {c: '#8FD3FF', all: true}},             // glass: every line glows sky blue
  split: {acc: '--ac',     glow: null},                                  // split: flat pastel
  gold:  {acc: '--ac',     glow: {c: '#FF9A2E', all: false}},            // gold: only the orange accent glows
};
/* a floating drawing (no solid surface behind it: glass, card-overlay on the video) gets this body colour, see-through */
const GLOW_FLOAT = {card: '#14213D', glass: '#0F1B2A', split: '#4B3D6E', gold: '#1C1C20'};

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
  const P = {line: glowHex(ink), fill: glowHex(fill), soft: glowMix(ink, fill, .38), accent: glowHex(acc)};
  if (!surf) P.fillAlpha = base === 'glass' ? .75 : .55;   // floating: the video shows a little through the bodies (glass: darker, its glow sits under them)
  return P;
}
/* an accent that cannot be read on its surface (contrast < 2, e.g. card's lime on white or cream) stays only as a fill (a lime
   tile, as the card style's own things); its lines and words take the line colour (navy), like the card style's lime tiles with
   navy edges. Seen at full size 2026-11-17: a lime tick on cream nearly vanished. */
const glowLum = ([r, g, b]) => { const f = v => (v /= 255) <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const glowContrast = (a, b) => { const x = glowLum(a), y = glowLum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
function glowReadable(svg, P) {
  const acc = glowRgba(P.accent); if (glowContrast(acc, glowRgba(P.fill)) >= 2) return;
  const hex = P.accent.toLowerCase(), rgb = new RegExp(`rgba?\\(\\s*${acc[0]}\\s*,\\s*${acc[1]}\\s*,\\s*${acc[2]}\\b`);
  const isAcc = v => { v = (v || '').toLowerCase(); return v === hex || (rgb.test(v) && glowRgba(v)[3] >= .5); };
  svg.querySelectorAll('[stroke],[fill]').forEach(e => {
    if (isAcc(e.getAttribute('stroke'))) e.setAttribute('stroke', P.line);
    if (/^(text|tspan)$/i.test(e.tagName) && isAcc(e.getAttribute('fill'))) e.setAttribute('fill', P.line);
  });
}
/* the style's glow: a soft halo of one colour around every line (glass) or around what took the accent (gold) */
function glowLight(svg, P, base) {
  const G = GLOWLOOK[base]?.glow; if (!G) return;
  const defs = svg.querySelector('defs');
  defs.insertAdjacentHTML('beforeend', `<filter id="cpGlow" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="a"/><feGaussianBlur in="SourceAlpha" stdDeviation="10" result="b"/>
    <feFlood flood-color="${G.c}" flood-opacity=".9"/><feComposite in2="a" operator="in" result="ga"/>
    <feFlood flood-color="${G.c}" flood-opacity=".55"/><feComposite in2="b" operator="in" result="gb"/>
    <feMerge><feMergeNode in="gb"/><feMergeNode in="ga"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`);
  const root = svg.querySelector(':scope > g');
  if (G.all) { root.setAttribute('filter', 'url(#cpGlow)'); return; }
  const [r, g, b] = glowRgba(P.accent), hex = P.accent.toLowerCase(), rgb = new RegExp(`rgba?\\(\\s*${r}\\s*,\\s*${g}\\s*,\\s*${b}\\b`);
  root.querySelectorAll('[fill],[stroke]').forEach(e => {
    const hit = ['fill', 'stroke'].some(a => { const v = (e.getAttribute(a) || '').toLowerCase(); return v === hex || rgb.test(v); });
    if (hit && !e.closest('[filter="url(#cpGlow)"]')) e.setAttribute('filter', 'url(#cpGlow)');
  });
}
/* draw design i of category cat with data d inside the frame F (scene times T) */
function glowDraw(F, T, cat, i, d) {
  const small = !!F.small, W = small ? 600 : 1000, H = small ? 340 : 700, base = ST.id.split('-overlay')[0];
  const host = div(`left:0;top:0;width:${W}px;height:${H}px`, F.stage); host.className = 'glow-host';
  window.GLOW_READY = false;
  GL.run(() => {
    const P = glowPalette(host, base);
    GL.stage({w: 1000, h: 700, glow: 0});           // the style's glow is added below (glowLight); the engine's own white glow is off
    GL.theme(P);                                    // after stage(): stage() sets the body fill back to its own black
    const svg = [...document.body.children].filter(e => e.tagName.toLowerCase() === 'svg').pop();
    svg.querySelector('rect[fill="url(#glbg)"]')?.remove();   // no glow-line background: the style's frame is the background
    host.appendChild(svg); svg.setAttribute('width', W); svg.setAttribute('height', H); svg.style.overflow = 'visible';
    const at = T.b[0];
    GL.cats[cat].draw(i, d, {x: 500, y: 350, s: 1, at, hit: Math.max(.6, T.hit - at)});
    GL.finish({hold: 0});                           // themeApply: every fixed glow-line colour → the style's
    glowReadable(svg, P);
    glowLight(svg, P, base);
    const b = svg.querySelector(':scope > g').getBBox();   // what is really drawn, at its end
    if (small) {                                    // the widget: fit it into 600 × 340
      const p = Math.max(b.width, b.height) * .04;
      svg.setAttribute('viewBox', `${b.x - p} ${b.y - p} ${b.width + 2 * p} ${b.height + 2 * p}`);
    } else if (b.width <= 1000 && b.height <= 700) {  // full screen: designed size, but centred (some designs sit to one side of their canvas)
      const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
      svg.setAttribute('viewBox', `${cx - 500} ${cy - 350} 1000 700`);
    }
    HOOKS.push(t => window.setT(t));
    window.GLOW_READY = true;
  });
}
/* one glow scene: <id> draws design i of cat; say = [lead, key] (the sentence's words: under the picture full-screen, the
   subtitle in an overlay). small: true → an overlay draws the small form (no sentence inside the widget). */
function GLOWSCENE(id, cat, i, d, say) {
  SCENE(id, {name: id, story: cat, beats: 4, cat, small: true,
    slots: {lead: {type: 'text', max: 60, sample: say[0]}, key: {type: 'text', max: 30, sample: say[1]}}},
    (K, s, T) => { glowDraw(K.F, T, cat, i, d); K.say(s.lead, s.key); });
}
