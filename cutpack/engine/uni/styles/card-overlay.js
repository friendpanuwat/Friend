/* =====================================================================
   STYLE · card-overlay (+ card-overlay-big) — the card style as small widgets over the speaker
   (Friend's skill talking-head-editorial-overlay). Same look as `card` (styles/card.js), only these change:
   1 frame    no full-screen card: the speaker stays on screen, the picture is a flat card above the head (overlay.js)
   5 words    inside the card: the lead in small Mitr, the key word in the lime box; a hard zoom cut on the key word
   ===================================================================== */
const CARD_OV = {
  name: 'การ์ด แบบ overlay',
  card: i => i % 3 === 1 ? {cls: 'c-dark ov-navy', dark: true} : {cls: 'c-light ov-white', dark: false},
  smallCls: 'c-dark',                                // a small form floats over the video: white lines and tiles…
  panelTheme: 'c-light',                             // …and its cards are white (like the cards in Friend's sample clip)
  css: `
.ov-white{background:#FFFFFF;box-shadow:0 24px 60px rgba(0,0,0,.45),0 4px 12px rgba(0,0,0,.25)}
.ov-navy{background:#14213D;box-shadow:0 24px 60px rgba(0,0,0,.5)}
.ov-white .u-panel{box-shadow:0 0 0 6px rgba(20,33,61,.08)}
.ov-lead{font-family:"CardSans";line-height:1.25}
.ov-white .ov-lead{color:#14213D}.ov-navy .ov-lead{color:#FFFFFF}
.ov-key{display:inline-block;font-family:"KeySans";line-height:1.15;letter-spacing:-1px;color:#0A0A0A;background:#DDFF45;border-radius:12px;padding:0 .14em .04em}
.c-dark .c-light .u-num,.c-light .u-num{color:#14213D}
.u-panel.c-light{background:#FFFFFF;border-radius:36px;box-shadow:0 26px 60px rgba(0,0,0,.38),0 3px 10px rgba(0,0,0,.18)}
.ov-sl{font-family:"Lead";font-size:50px;line-height:1.2;color:#FFFFFF;text-shadow:0 3px 16px rgba(0,0,0,.75)}
.ov-k{font-family:"KeySans";font-size:120px;line-height:1.1;letter-spacing:-2px;color:#DDFF45;text-shadow:0 6px 26px rgba(0,0,0,.6)}
.ov-hl{display:inline-block;font-family:"KeySans";font-size:104px;line-height:1.1;letter-spacing:-2px;color:#0A0A0A;background:#DDFF45;padding:0 .16em .04em;border-radius:12px}
.ov-hand{font-family:"Hand";font-size:124px;line-height:1.15;color:#DDFF45;text-shadow:0 6px 26px rgba(0,0,0,.6)}`,
  /* the subtitle under the chin (small forms): small lead in Mitr, the key word lime in turn as Mitr / lime box / Sriracha */
  sub(F, T, lead, key) {
    const M = STYLES.card.motion, [l, k] = ovSub(T, [[lead ?? '', 'ov-sl'], [key ?? '', ['ov-k', 'ov-hl', 'ov-hand'][F.index % 3]]]);
    if (lead) A(l, M.lead.kf, T.t0 + .15, M.lead.d, {e: M.lead.e});
    if (key) { A(k, M.key.kf, T.hit, M.key.d, {e: M.key.e}); sfx('softswish', T.hit - .04, -22); }
  },
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
/* a small form floats on the video (c-dark: white lines) but its cards are white (c-light). Every ".c-dark X" rule of the
   card style would also reach inside those white cards and win (same weight, later in the file): white box borders and
   white tiles on a white card (Friend 2026-11-08: the checklist boxes "กลืนไปกับพื้นหลังเพราะมันเป็นสีเดียวกัน").
   So every ".c-light X" rule is repeated one step heavier for a white card inside the dark frame. */
CARD_OV.css += (STYLES.card.css.match(/\.c-light \.[^{]+\{[^}]*\}/g) ?? []).map(r => '.c-dark ' + r).join('\n');
OVERLAY('card-overlay', 'card', CARD_OV);
OVERLAY('card-overlay-big', 'card', {...CARD_OV, name: 'การ์ด แบบ overlay (ใหญ่ ย่อคนพูด)', size: 'big'});
