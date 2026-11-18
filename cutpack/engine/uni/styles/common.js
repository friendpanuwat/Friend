/* =====================================================================
   CutPack · uni · what every new style shares (2026-11-18, from the neon style; build.py loads this file before the style)
   Friend's rules for every style:
   · SAFE ZONE (2026-11-17: "ที่สำคัญที่สุดอย่าลืมเลี่ยงโซนอันตรายของติ๊กต๊อกและ IG ... อย่าให้ปุ่มพวกนี้มันมาบังเด็ดขาด", measured on TikTok's
     own screen Friend sent: the name starts at y 1690, the buttons are x 936– from y 754 to 1680): every word and picture inside
     x 60–920 and above y 1660; above y 740 the right edge is 1020 (no buttons there); no top limit for words ("ขอบบนเอาเท่าเดิม")
   · FRAMED FACES and cards of the speaker (2026-11-18: "กรอบสี่เหลี่ยมหน้าผม ... จะโดนแถบค้นหาของ TikTok บัง"): start at y 220 or lower
   · the video always fills its frame, the face at a set share of it (2026-11-17: "อยากให้คลิปของผมมันเต็มกรอบสี่เหลี่ยม", "zoom out
     หน้าผมหน่อย")
   · words centred (2026-11-17: "ทำไม subtitle มันชิดซ้ายมันต้องอยู่กึ่งกลางสิ")
   · random from the run's seed (RUN.seed), never over the face (faces.json)
   ===================================================================== */
const CP = {
  face: {x: 540, y: 700, w: 320},                  // the test clip's face centre and width (a real clip reads faces.json)
  safe: [60, 0, 920, 1660], safeTop: {y: 740, x1: 1020},
  insets: [],
};
/* a number 0–1 from the run's seed and a key (the same seed and key, the same number) */
function cpRand(key) {
  let h = 2166136261; for (const c of String(key)) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0;
  let a = ((typeof RUN !== 'undefined' && RUN.seed) || 1) ^ h; a = (a + 0x6D2B79F5) >>> 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
/* the speaker's face between t0 and t1 (every face box of the clip in that time, pushed in by the camera's 1.05 zoom); the test
   clip's face without faces.json. [x0, y0 (forehead), x1, y1 (chin)] */
function cpFaceBox(t0, t1) {
  if (typeof FACES === 'undefined' || !FACES.track?.length) return [380, 470, 700, 950];
  let tr = FACES.track.filter(([t]) => t >= t0 - .25 && t <= t1 + .25).map(x => x[1]);
  if (!tr.length) tr = [FACES.track.reduce((a, b) => Math.abs(b[0] - t0) < Math.abs(a[0] - t0) ? b : a)[1]];
  const z = (v, c) => c + (v - c) * 1.06;
  return [z(Math.min(...tr.map(b => b[0])), 540), z(Math.min(...tr.map(b => b[1])), 864), z(Math.max(...tr.map(b => b[2])), 540), z(Math.max(...tr.map(b => b[3])), 864)];
}
/* the speaker's face at time t (centre x, y and width w) */
function cpFace(t) {
  if (typeof FACES === 'undefined' || !FACES.track?.length) return CP.face;
  const tr = FACES.track.reduce((a, b) => Math.abs(b[0] - t) < Math.abs(a[0] - t) ? b : a)[1];
  return {x: (tr[0] + tr[2]) / 2, y: (tr[1] + tr[3]) / 2, w: tr[2] - tr[0]};
}
/* the speaker inside a shape (w × h): a copy of the speaker's frame (it follows the video on every seek, the style's setup adds
   cpInsetHook); the video always covers the whole shape, the face is `faceK` of the shape's width (never smaller than covering
   allows) and sits at (w / 2, h × faceY) unless that would leave an edge */
function cpInset(parent, w, h, t, faceK = .4, faceY = .45) {
  const f = cpFace(t), im = document.createElement('img');
  const s = Math.max(w / 1080, h / 1920, faceK * w / (f.w || 320));
  const clamp = (v, lo) => Math.min(0, Math.max(lo, v));
  const left = clamp(w / 2 - f.x * s, w - 1080 * s), top = clamp(h * faceY - f.y * s, h - 1920 * s);
  Object.assign(im.style, {position: 'absolute', width: `${1080 * s}px`, height: `${1920 * s}px`, left: `${left}px`, top: `${top}px`, maxWidth: 'none'});
  parent.appendChild(im); CP.insets.push(im); return im;
}
const cpInsetHook = async () => { for (const im of CP.insets) if (V.src && im.src !== V.src) { im.src = V.src; try { await im.decode(); } catch (e) {} } };
/* one line of words (class rowCls + the span's cls): Latin words in <i>, shrunk (never wrapped) to maxW and to the safe zone at its
   height; `hi` = a last phrase to colour (span.hi) */
function cpLine(parent, txt, cls, P, maxW, rowCls = 'cp-row', hi = null) {
  const row = div('', parent); row.className = rowCls + ' cp-row';
  const sp = document.createElement('span'); sp.className = cls; row.appendChild(sp);
  const put = (host, s) => { for (const part of String(s).split(/([A-Za-z][A-Za-z'’-]*)/)) {
    if (!part) continue;
    if (/^[A-Za-z]/.test(part)) { const i = document.createElement('i'); i.textContent = part; host.appendChild(i); } else host.appendChild(document.createTextNode(part)); } };
  if (hi && String(txt).endsWith(hi) && String(txt).length > hi.length) {
    put(sp, String(txt).slice(0, -hi.length)); const h = document.createElement('span'); h.className = 'hi'; put(h, hi); sp.appendChild(h);
  } else put(sp, txt);
  const al = P.align ?? 'center';
  Object.assign(row.style, {left: `${P.x}px`, top: `${P.y}px`, translate: al === 'left' ? '0 -50%' : '-50% -50%', transformOrigin: al === 'left' ? '0 50%' : '50% 50%'});
  const x0 = CP.safe[0], x1 = P.y + (P.half ?? 120) < CP.safeTop.y ? CP.safeTop.x1 : CP.safe[2];   // the right edge at this height (the buttons start at y 754; half = the row's half height)
  const room = al === 'left' ? x1 - P.x : 2 * Math.min(P.x - x0, x1 - P.x);
  FITS.push(() => { const w = sp.offsetWidth, m = Math.min(maxW ?? P.maxW ?? 960, room); if (w > m) row.style.scale = String(m / w); });
  return row;
}
/* what sits outside the safe zone now (tests and stills): words (.cp-row), pictures (what the drawing really shows), frames and
   cards with the speaker (.cp-frame: also under the search bar) · and in the style's layouts, a picture box closer than 40 to a
   framed face. styleSafeCheck() = the active style's (glow/stills.js, tools/picture_sizes.js) */
function cpSafeCheck(layouts = {}) {
  const [x0, y0, xb, y1] = CP.safe, k = 1080 / document.documentElement.clientWidth || 1, out = [];
  const test = (what, r) => { if (!r || r.width < 1) return; const b = [r.left * k, r.top * k, r.right * k, r.bottom * k].map(Math.round);
    const x1 = b[3] <= CP.safeTop.y ? CP.safeTop.x1 : xb;
    if (b[0] < x0 - 1 || b[1] < y0 - 1 || b[2] > x1 + 1 || b[3] > y1 + 1) out.push({what, box: b}); };
  const shown = e => { if (getComputedStyle(e).visibility === 'hidden') return false; for (let x = e; x && x !== document.body; x = x.parentElement) if (+getComputedStyle(x).opacity < .05 || getComputedStyle(x).display === 'none') return false; return true; };
  document.querySelectorAll('.cp-row > span').forEach(e => { if (shown(e)) test('words "' + e.textContent + '"', e.getBoundingClientRect()); });
  document.querySelectorAll('.glow-host svg').forEach(svg => { if (!shown(svg)) return;
    const seen = e => { for (let x = e; x && x !== svg; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || +cs.opacity < .05) return false; } return true; };
    let u = null; svg.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse,text,image').forEach(e => { if (e.closest('clipPath,defs') || !seen(e)) return;
      const r = e.getBoundingClientRect(); if (r.width < .5 && r.height < .5) return;
      u = u ? {left: Math.min(u.left, r.left), top: Math.min(u.top, r.top), right: Math.max(u.right, r.right), bottom: Math.max(u.bottom, r.bottom)} : {left: r.left, top: r.top, right: r.right, bottom: r.bottom}; });
    if (u) test('picture', {...u, width: u.right - u.left}); });
  document.querySelectorAll('.cp-frame').forEach(e => { if (!shown(e)) return; const r = e.getBoundingClientRect(); test('frame', r);
    if (r.top * k < 215) out.push({what: 'frame under the TikTok search bar', box: [r.left, r.top, r.right, r.bottom].map(v => Math.round(v * k))}); });
  for (const L of Object.values(layouts)) {
    const f = L.square ? L.square[1] + L.square[2] : L.win ? L.win[1] + L.win[3] : L.band ? L.band[1] + L.band[3] : null;
    if (f != null && L.stage && L.stage[1] < f + 40) out.push({what: 'picture box closer than 40 to the framed face', box: L.stage}); }
  return out;
}
function styleSafeCheck() { return cpSafeCheck(typeof ST !== 'undefined' && ST ? ST.layouts : {}); }
/* FIT PICK for every style (Friend 2026-11-18: "motion graphic ที่ระบบจะสุ่มเลือกมาต้องเหมาะสมกับพื้นที่ว่างที่มีอยู่", tried on neon, then for all 9 others: "ข"):
   cpShape = a picture's shape in this clip (REAL_SHAPES of tools/real_shapes.js, else the sample's, glow/shapes.json) · cpFitSize = the share of
   the screen a picture of shape `ar` takes on average over the boxes frame() would pick from (tools/fit_pick.js asks the style's fitSize) */
function cpShape(variant, t0) { const r = typeof REAL_SHAPES !== 'undefined' ? REAL_SHAPES[t0.toFixed(2)] : null; return r ?? (typeof GLOW_SHAPES !== 'undefined' && variant ? GLOW_SHAPES[variant] : null); }
function cpFitSize(ar, names, boxOf, keep = .75, isSpk = () => false) {
  /* as frame() picks (cpSizeKeep): the screens within `keep` of the best one for this shape and the speaker's screens over the floor, then one
     of them at random → the mean of those (the second best, as neon, took pink's pictures from 10 % to 8 %; the mean of every screen told the
     drawings apart too little: hud 13 % → 11 %) */
  const sz = names.map(n => { const b = boxOf(n); if (!b) return null; const [, , w, h] = b; return {n, v: ar > w / h ? w * w / ar : h * h * ar}; }).filter(x => x && x.v > 0);
  if (!sz.length) return 0;
  const big = sz.filter(x => !isSpk(x.n)), best = Math.max(...(big.length ? big : sz).map(x => x.v));
  const kept = sz.filter(x => isSpk(x.n) ? x.v >= CP.speakerFloor : x.v >= keep * best);
  return kept.length ? kept.reduce((a, x) => a + x.v, 0) / kept.length / (1080 * 1920) : 0;
}
/* THE SPEAKER'S SCREENS WITH A PICTURE take part (Friend 2026-11-18, every style: "อยากให้ ก ขึ้นบ้าง (ทุกสไตล์เลยนะ) ส่วนเรื่อง motion graphic มีขนาดเล็ก
   ก็ไม่เห็นเป็นไรเลยเพราะว่าเรามีระบบให้โค้ดเลือก motion graphic ตามขนาดพื้นที่ว่างอยู่แล้ว"): the speaker full screen with a picture at the hands or the
   chest always lost the size race to the graphic screens (its picture is smaller), so it never came. Now only the graphic screens race (within
   `keep` of the best of them); a speaker's screen needs only its picture over CP.speakerFloor (the teal style's floor for its speaker cards). */
CP.speakerFloor = 60000;
function cpSizeKeep(pool, size, keep, isSpk, noPic = () => false) {
  const big = pool.filter(n => !isSpk(n) && !noPic(n)), best = Math.max(0, ...(big.length ? big : pool).map(size));
  return pool.filter(n => noPic(n) || (isSpk(n) ? size(n) >= CP.speakerFloor : size(n) >= keep * best));
}
/* A AND B AS OFTEN (Friend 2026-11-18, every style: "ก. กับ ข. ควรมีโอกาสขึ้นเท่าๆกันนะครับไม่ควรมีแบบไหนมากกว่าแบบไหน"): when a picture may go on
   the speaker full screen (ก, layout.speaker) or on a graphic screen (ข), the kind this clip has used less, a tie at random from the run's seed;
   only one kind left (the face leaves no room): that one. Counts what was taken (CP.kinds). */
CP.kinds = {spk: 0, scr: 0};
function cpBalance(pool, isSpk, key) {
  const a = pool.filter(isSpk), b = pool.filter(n => !isSpk(n));
  let pick = a.length && b.length ? (CP.kinds.spk === CP.kinds.scr ? (cpRand('kind' + key) < .5 ? 'spk' : 'scr') : CP.kinds.spk < CP.kinds.scr ? 'spk' : 'scr') : a.length ? 'spk' : 'scr';
  CP.kinds[pick]++;
  return pick === 'spk' ? a : b;
}
