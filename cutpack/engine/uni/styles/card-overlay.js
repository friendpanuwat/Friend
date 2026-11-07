/* =====================================================================
   STYLE · card-overlay (+ card-overlay-big) — the card style as small widgets over the speaker
   (Friend's skill talking-head-editorial-overlay). Same look as `card` (styles/card.js), only these change:
   1 frame    no full-screen card: the speaker stays on screen, the picture is a flat card above the head (overlay.js)
   5 words    inside the card: the lead in small Mitr, the key word in the lime box; a hard zoom cut on the key word
   ===================================================================== */
const CARD_OV = {
  name: 'การ์ด แบบ overlay',
  card: i => i % 3 === 1 ? {cls: 'c-dark ov-navy', dark: true} : {cls: 'c-light ov-white', dark: false},
  css: `
.ov-white{background:#FFFFFF;box-shadow:0 24px 60px rgba(0,0,0,.45),0 4px 12px rgba(0,0,0,.25)}
.ov-navy{background:#14213D;box-shadow:0 24px 60px rgba(0,0,0,.5)}
.ov-white .u-panel{box-shadow:0 0 0 6px rgba(20,33,61,.08)}
.ov-lead{font-family:"CardSans";line-height:1.25}
.ov-white .ov-lead{color:#14213D}.ov-navy .ov-lead{color:#FFFFFF}
.ov-key{display:inline-block;font-family:"KeySans";line-height:1.15;letter-spacing:-1px;color:#0A0A0A;background:#DDFF45;border-radius:12px;padding:0 .14em .04em}`,
  text(F, T, lead, key) {
    const M = STYLES.card.motion;
    if (lead) { const l = ovLine(F, lead, 'ov-lead', 34); A(l, M.lead.kf, T.t0 + .2, M.lead.d, {e: M.lead.e}); }
    if (key) { const k = ovLine(F, key, 'ov-key', F.big ? 62 : 58); A(k, M.key.kf, T.hit, M.key.d, {e: M.key.e}); sfx('softswish', T.hit - .04, -22); }
  },
  /* editorial: a zoom cut to 1.06 on the key word, cut back when the widget leaves (the widget does not zoom) */
  camera(T) {
    const z = 1.06, Z = `translate(${540 * (1 - z)}px,${700 * (1 - z)}px) scale(${z})`;
    A(V, [{transform: Z}, {transform: Z}], T.hit, T.t1 - T.hit, {f: 'none'});
  },
};
OVERLAY('card-overlay', 'card', CARD_OV);
OVERLAY('card-overlay-big', 'card', {...CARD_OV, name: 'การ์ด แบบ overlay (ใหญ่ ย่อคนพูด)', size: 'big'});
