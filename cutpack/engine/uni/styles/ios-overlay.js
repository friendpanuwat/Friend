/* =====================================================================
   STYLE · ios-overlay (+ ios-overlay-big) — the app-screen style as widgets over the speaker (Friend 2026-11-11: "มีแบบ overlay ด้วย").
   Same look as `ios` (styles/ios.js: palette, surfaces, motion, sound, the app-screen variants first), only these change
   (style-rules/ios.md 9):
   1 frame    the speaker stays full screen (does not move or shrink, except the big size that shrinks to 80 % like every
              overlay); the picture sits on a white notification card above the head: it drops in from above (.45 s) and
              slides up and away at the end (.3 s)
   5 words    the subtitle under the chin in Anuphan 700: lead 58, key word 84, white; words not said yet are white at .45.
              A text shadow keeps it readable (no dark band: an overlay never dims the clip, DECISIONS 3)
   no zoom on the key word (unlike card-overlay): this style is still
   ===================================================================== */
const IOS_OV = {
  name: 'หน้าจอแอป แบบ overlay',
  card: () => ({cls: 'i-app i-note', dark: false}),   // a scene without a small form: the same white card (auto-fit path)
  smallFrame(t0, t1, index, C) {
    const pad = 24, root = div(`left:${C.x - pad}px;top:${C.y - pad}px;width:${C.w + 2 * pad}px;height:${C.h + 2 * pad}px`, SC);
    root.className = 'i-app i-note';
    A(root, [{opacity: 0, transform: 'translateY(-40px)'}, {opacity: 1, transform: 'none'}], t0 + .05, .45, {e: IOS_EASE});
    A(root, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'translateY(-40px)'}], t1 - .3, .3, {e: IOS_EASE, f: 'forwards'});
    return {root, stage: div(`left:${pad}px;top:${pad}px;width:${C.w}px;height:${C.h}px`, root), dark: false};
  },
  css: `
.i-note{background:#FFFFFF;border-radius:36px;box-shadow:0 18px 50px rgba(0,0,0,.35);opacity:0}
.i-note.ov-card{border-radius:36px}
.i-sl,.i-sk{font-family:"Anu";font-weight:700;line-height:1.25;color:rgba(255,255,255,.45);text-shadow:0 2px 14px rgba(0,0,0,.55)}
.i-sl{font-size:58px}.i-sk{font-size:84px}
.i-olead{font-family:"Anu";font-weight:600;line-height:1.25;color:#1C1C1E}
.i-okey{font-family:"Anu";font-weight:700;line-height:1.2;color:#1C1C1E}`,
  sub(F, T, lead, key) {
    const [l, k] = ovSub(T, [[lead ?? '', 'i-sl'], [key ?? '', 'i-sk']]);
    A(l, [{color: 'rgba(255,255,255,.45)'}, {color: '#FFFFFF'}], T.t0 + .4, .3, {e: 'ease-out'});
    A(k, [{color: 'rgba(255,255,255,.45)'}, {color: '#FFFFFF'}], T.hit, .3, {e: 'ease-out'});
  },
  text(F, T, lead, key) {                            // a scene without a small form: the words inside the card
    if (lead) A(ovLine(F, lead, 'i-olead', 34), [{opacity: 0}, {opacity: 1}], T.t0 + .25, .3);
    if (key) A(ovLine(F, key, 'i-okey', 56), [{opacity: 0}, {opacity: 1}], T.hit, .3);
  },
};
OVERLAY('ios-overlay', 'ios', IOS_OV);
OVERLAY('ios-overlay-big', 'ios', {...IOS_OV, name: 'หน้าจอแอป แบบ overlay (ใหญ่ ย่อคนพูด)', size: 'big'});
