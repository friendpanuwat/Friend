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
  const P = {line: glowHex(ink), fill: glowHex(fill), soft: glowMix(ink, fill, .25), accent: glowHex(acc)};   // soft nearer the line (at .38 grey details read 2.3:1 on gold)
  if (!surf) P.fillAlpha = base === 'glass' ? .75 : .55;   // floating: the video shows a little through the bodies (glass: darker, its glow sits under them)
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
  if (k >= 2) for (let t = .1; t <= 1; t += .05) { const m = glowMix(acc, glowRgba(P.line), t); if (glowContrast(glowRgba(m), ground) >= 3) { ink = m; break; } }
  const hex = P.accent.toLowerCase(), rgb = new RegExp(`rgba?\\(\\s*${acc[0]}\\s*,\\s*${acc[1]}\\s*,\\s*${acc[2]}\\b`);
  const isAcc = v => { v = (v || '').toLowerCase(); return v === hex || (rgb.test(v) && glowRgba(v)[3] >= .5); };
  svg.querySelectorAll('[stroke],[fill]').forEach(e => {
    if (e.closest('[data-fig]') || GLOW_PEOPLE.has(e.closest('[data-icon]')?.getAttribute('data-icon'))) return;   // a chosen person keeps its accent: glowDress fills it
    if (isAcc(e.getAttribute('stroke'))) e.setAttribute('stroke', ink);
    if (/^(text|tspan)$/i.test(e.tagName) && isAcc(e.getAttribute('fill'))) e.setAttribute('fill', ink);
  });
}
/* faint lines (the engine draws connectors, rails and secondary rings in the line colour at 35–50 %) that end up under 3:1 on
   their ground are made more solid, up to 80 % (Friend: "ยังมีเรื่องสีที่กลืนกันและมองยากอยู่") */
function glowFirm(svg, P) {
  const ground = glowRgba(P.fill), fam = [glowRgba(P.line), glowRgba(P.soft)];
  svg.querySelectorAll('[stroke]').forEach(e => {
    const c = glowRgba(e.getAttribute('stroke') || 'none'); if (c[3] >= .8 || c[3] < .2) return;
    if (!fam.some(f => f[0] === c[0] && f[1] === c[1] && f[2] === c[2])) return;
    for (let a = c[3]; a <= .8; a += .05) { const m = [0, 1, 2].map(i => c[i] * a + ground[i] * (1 - a));
      if (glowContrast(m, ground) >= 3 || a + .05 > .8) { e.setAttribute('stroke', `rgba(${c[0]},${c[1]},${c[2]},${Math.min(.8, a).toFixed(2)})`); break; } }
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
function glowMaterial(base, P) {
  const surf = glowRgba(P.fill), light = glowLum(surf) > .45 && P.fillAlpha == null;   // floating (fillAlpha) = on the video, a dark ground
  if (base === 'card') return {body: {fill: '#FFFFFF', edge: 'rgba(20,33,61,.16)', shadow: true},
    tile: P.fillAlpha == null ? {fill: '#14213D', stroke: '#14213D'} : {fill: '#FFFFFF', stroke: '#FFFFFF'},   // on the video a navy tile vanished (1:1): white tiles, as the white cards
    ink: '#14213D', soft: '#6B7489', icon: P.fillAlpha == null ? '#FFFFFF' : '#14213D', lit: 'solid', fig: light ? {fill: '#14213D', edge: '#14213D'} : {fill: '#FFFFFF', edge: '#FFFFFF'}};
  if (base === 'split') return light
    ? {body: {fill: '#FFFFFF', edge: P.line}, tile: {fill: '#ECE6F8', stroke: P.line}, ink: P.line, soft: P.soft, icon: P.line, lit: 'solid', fig: {fill: '#CDBFEA', edge: P.line}}
    : {body: {fill: '#7A6AA4', edge: '#F1ECFB'}, tile: {fill: '#4E3F78', stroke: '#F1ECFB'}, ink: '#F1ECFB', soft: '#E4DCF4', icon: '#F1ECFB', lit: 'solid', fig: {fill: '#B5A5E0', edge: '#F1ECFB'}};   // people a step darker than the accent (#D9CCF6), so the chosen one stands out   // a deep tile under a light icon (a mid-purple one read 1.9:1)
  if (base === 'gold') return {body: {fill: 'url(#cpGloss)', edge: 'rgba(255,255,255,.24)'}, tile: {fill: 'url(#cpGloss)', stroke: P.accent},
    ink: P.line, soft: P.soft, icon: P.line, lit: 'tint', fig: {fill: '#C9CACF', edge: '#F2F2F4'}};
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
  const solidOf = f => f.startsWith('url') ? (base === 'glass' ? '#2E343D' : '#1A1A1F') : f;   // a cut or an icon's own body on a see-through / glossy surface
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
  for (const {b, r} of plain) {
    b.setAttribute('fill', M.body.fill); b.removeAttribute('fill-opacity');
    if (area(r) > big || base !== 'card') { if (M.body.edge) b.setAttribute('stroke', M.body.edge); }
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
      if (M.lit === 'solid') e.setAttribute('fill', P.accent);
      else if (base === 'glass') e.setAttribute('fill', `rgba(${acc[0]},${acc[1]},${acc[2]},${Math.min(c[3], .1)})`);   // glass: a faint blue wash, the light is on the edge
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
  if (G.all) { root.setAttribute('filter', 'url(#cpGlow)'); return; }   // glass: the whole drawing glows (the first look, which Friend kept)
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
    glowTagIcons();
    GL.cats[cat].draw(i, d, {x: 500, y: 350, s: 1, at, hit: Math.max(.6, T.hit - at)});
    GL.finish({hold: 0});                           // themeApply: every fixed glow-line colour → the style's
    glowReadable(svg, P);
    glowFirm(svg, P);
    glowDress(svg, P, base);
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
/* COLOUR CHECK (Friend 2026-11-17: "ยังมีเรื่องสีที่กลืนกันและมองยากอยู่ แก้ไขด้วย"): every line and word of the drawing against what is
   right behind it (the nearest filled shape drawn before it that covers its middle, else the frame's surface; on the video = dark grey),
   with its real see-through (colour alpha × every parent's opacity at the shot). A line or word under 3:1 is listed (WCAG for graphics);
   a thing faded below 25 % on purpose (a ghost, a "wrong" that dims) is left out. Returns [{what, colour, behind, ratio}]. */
function glowCheck() {
  const host = document.querySelector('.glow-host'); if (!host) return [];
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
  for (const e of all) {
    const text = e.tagName === 'text', v = text ? e.getAttribute('fill') : e.getAttribute('stroke');
    if (!v || v === 'none' || v.startsWith('url') || (!text && +(e.getAttribute('stroke-width') || 1) < 1.2)) continue;
    const c = glowRgba(v), a = c[3] * seen(e) * +(e.getAttribute(text ? 'fill-opacity' : 'stroke-opacity') ?? 1); if (a < .25) continue;
    const r = box(e); if (r.width < 2 && r.height < 2) continue;
    const bg = behind(e, (r.left + r.right) / 2, (r.top + r.bottom) / 2), fg = over(c, a, bg), k = glowContrast(fg, bg);
    if (!text && (rgbEq(c, body) || rgbEq(c, top?.c))) continue;    // on purpose: a cut in the body colour, a shape's own edge, a solid person's limbs
    if (k < 3) out.push({what: text ? 'word "' + e.textContent + '"' : e.tagName, colour: v, behind: glowHex(bg), ratio: +k.toFixed(2)});
  }
  return out;
}
/* one glow scene: <id> draws design i of cat; say = [lead, key] (the sentence's words: under the picture full-screen, the
   subtitle in an overlay). small: true → an overlay draws the small form (no sentence inside the widget). */
function GLOWSCENE(id, cat, i, d, say) {
  SCENE(id, {name: id, story: cat, beats: 4, cat, small: true,
    slots: {lead: {type: 'text', max: 60, sample: say[0]}, key: {type: 'text', max: 30, sample: say[1]}}},
    (K, s, T) => { glowDraw(K.F, T, cat, i, d); K.say(s.lead, s.key); });
}
