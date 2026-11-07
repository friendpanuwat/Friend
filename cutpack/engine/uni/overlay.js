/* =====================================================================
   CutPack · uni · OVERLAY — the speaker stays on screen; the picture becomes a small widget in free room
   (Friend 2026-11-07: "ทดสอบ overlay ก่อนรอบที่ 3"; looks from Friend's overlay skills talking-head-editorial-overlay and
   talking-head-overlay; sizes from engine/plan/room.py, which Friend approved on real clips 2026-11-05).
   An overlay style = its full-screen style's look (colours, surfaces, drawing, motion, sound) + only a new frame and text:
     short   600 × 190 card above the head (or at the chest): the picture in a box on the left, the words on the right
     big     600 × 380 card at the top while the speaker shrinks to 80 % (the shrink Friend approved for tight clips)
   Variants are not redrawn: the scene still draws on its 1000 × 700 canvas, and the frame measures what was really drawn
   (at the end of the scene) and fits that into the picture box. A widget is COMPACT: pure decoration (u-decor: halos,
   skeleton lines, ghost cards, sparkles) and the words inside the picture (u-text: chips, labels) are left out, because
   the card already shows the sentence; a card that is the whole picture goes flat (the widget is that card).
   ===================================================================== */
const OV = {
  size: {short: {x: 240, y: 150, w: 600, h: 190}, big: {x: 240, y: 150, w: 600, h: 380}},
  shrink: {s: .8, d: .45},                          // room.SHRINK: the speaker at 80 %, in and out in .45 s
  wideMax: 300,                                     // a short card's picture box may grow this wide for a wide picture
  keepCard: '.u-phone,.u-receipt,.u-note,.u-bubble',  // cards that are the thing itself (never flattened)
};
const OV_CSS = `
.ov-card{border-radius:36px;overflow:hidden;opacity:0}
.ov-compact .u-decor,.ov-compact .u-text{display:none !important}
.ov-flat{background:none !important;border-color:transparent !important;box-shadow:none !important}
.ov-text{position:absolute;display:flex}
.ov-text>div{position:relative;white-space:nowrap}
`;
/* what the scene really drew, in canvas units, at time tm (solid things only: no decoration, words, rings or glows) */
function drawnBox(stage, tm) {
  ANIMS.forEach(a => { a.pause(); a.currentTime = ms(tm); });
  stage.style.transform = 'none';
  const o = stage.getBoundingClientRect(); let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  stage.querySelectorAll('.u-panel,.u-badge,.u-col,.u-bar,.u-num,path,circle').forEach(e => {
    if (e.closest('.u-decor,.u-text,.u-pulse,.u-halo,.u-beam,.u-flash') || e.classList.contains('ov-flat')) return;
    const r = e.getBoundingClientRect(); if (r.width < 1 && r.height < 1) return;
    x0 = Math.min(x0, r.left - o.left); y0 = Math.min(y0, r.top - o.top); x1 = Math.max(x1, r.right - o.left); y1 = Math.max(y1, r.bottom - o.top);
  });
  return x1 > x0 ? {x0, y0, x1, y1, w: x1 - x0, h: y1 - y0} : {x0: 0, y0: 0, x1: 1000, y1: 700, w: 1000, h: 700};
}
function OVERLAY(id, base, def) {
  const B = STYLES[base]; if (!B) throw new Error('overlay of unknown style ' + base);
  const kind = def.size ?? 'short', big = kind === 'big';
  STYLE(id, {name: def.name, overlay: kind, css: B.css + OV_CSS + (def.css ?? ''), motion: B.motion, sound: B.sound,
    frame(t0, t1, {index}) {
      const L = OV.size[kind], look = def.card(index), m = B.motion;
      const root = div(`left:${L.x}px;top:${L.y}px;width:${L.w}px;height:${L.h}px`, SC);
      root.className = `ov-card ${look.cls} ov-compact`;                 // a widget is always small: no decoration, no words inside the picture
      A(root, m.pop.kf, t0, m.pop.d, {e: m.pop.e});
      A(root, m.leave.kf, t1 - m.leave.d, m.leave.d, {e: m.leave.e, f: 'forwards'});
      if (big) {                                    // the speaker steps back to make room, then comes back
        const D = t1 - t0 + .1, k = OV.shrink, S = `translate(${540 * (1 - k.s)}px,${1920 * (1 - k.s)}px) scale(${k.s})`;
        A(V, [{transform: 'none'}, {transform: S, offset: k.d / D}, {transform: S, offset: 1 - k.d / D}, {transform: 'none'}], t0 - .1, D, {e: 'ease-in-out', f: 'none'});
      }
      const pic = big ? {x: 24, y: 20, w: L.w - 48, h: L.h - 178} : {x: 18, y: 18, w: L.h - 36, h: L.h - 36};
      const box = div(`left:${pic.x}px;top:${pic.y}px;width:${pic.w}px;height:${pic.h}px`, root);
      const stage = div('left:0;top:0;width:1000px;height:700px;transform-origin:0 0', box);
      const text = div('', root); text.className = 'ov-text';
      const F = {root, stage, box, pic, text, L, big, dark: look.dark};
      const place = () => {                         // the words take what the picture leaves
        if (big) Object.assign(text.style, {left: '24px', top: `${L.h - 142}px`, width: `${L.w - 48}px`, height: '128px', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px'});
        else Object.assign(text.style, {left: `${pic.x + pic.w + 24}px`, top: '0', width: `${L.w - pic.x - pic.w - 48}px`, height: `${L.h}px`, flexDirection: 'column', justifyContent: 'center', gap: '10px'});
      };
      place();
      FITS.unshift(() => {                          // before the words are fitted: fit the drawn picture into its box
        const tm = Math.max(F.T.after + .3, t1 - .75);
        let b = drawnBox(stage, tm);
        {                                           // the widget is already a card: a card that is the whole picture goes flat
          const o = stage.getBoundingClientRect(), flat = [...stage.querySelectorAll('.u-panel')].filter(e => {
            if (e.matches(OV.keepCard) || e.closest('.u-decor')) return false;
            const r = e.getBoundingClientRect(); return r.width * r.height >= .8 * b.w * b.h;
          });
          if (flat.length) { flat.forEach(e => e.classList.add('ov-flat')); b = drawnBox(stage, tm); }
        }
        if (!big) { pic.w = Math.round(Math.min(OV.wideMax, Math.max(pic.h, pic.h * b.w / b.h))); box.style.width = pic.w + 'px'; place(); }
        const s = Math.min(pic.w / b.w, pic.h / b.h) * .94;
        F.scale = s;
        stage.style.transform = `translate(${(pic.w - b.w * s) / 2 - b.x0 * s}px,${(pic.h - b.h * s) / 2 - b.y0 * s}px) scale(${s})`;
      });
      return F;
    },
    text(F, T, lead, key) { def.text(F, T, lead, key); if (!F.big && def.camera) def.camera(T); },
  });
}
/* one line of words in the card, shrunk (never wrapped) to the room it has */
function ovLine(F, txt, cls, size) {
  const r = document.createElement('div'); F.text.appendChild(r);
  const s = document.createElement('span'); s.className = cls; s.style.fontSize = size + 'px'; s.textContent = txt; r.appendChild(s);
  FITS.push(() => { const room = F.text.offsetWidth, w = s.offsetWidth; if (w > room) r.style.transform = `scale(${room / w})`, r.style.transformOrigin = F.big ? '50% 50%' : '0 50%'; });
  return s;
}
