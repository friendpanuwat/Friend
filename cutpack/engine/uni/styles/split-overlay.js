/* =====================================================================
   STYLE · split-overlay — the pastel split style as widgets over the speaker (Friend's overlay sample clip 1, 2026-11-07).
   Same look as `split` (styles/split.js), only these change:
   1 frame    the speaker stays full screen (no shrinking into the frame); the picture is the pastel app window above the head
              (Friend: no cut-out of the speaker in front of the window, "ไม่ต้องทำ")
   5 words    the subtitle under the chin in Anuphan: the line waits pale, each part turns white / lavender as it is said
   ===================================================================== */
const SPLIT_OV = {
  name: 'แบ่งจอพาสเทล แบบ overlay',
  card: i => ({cls: `p-win ${i % 3 === 1 ? 'p-dark' : 'p-light'}`, dark: i % 3 === 1}),
  smallFrame(t0, t1, index, C) {
    const dark = index % 3 === 1;
    const root = div(`left:${C.x - 40}px;top:${C.y - 64}px;width:${C.w + 80}px;height:${C.h + 100}px`, SC);
    root.className = `p-win ${dark ? 'p-dark' : 'p-light'}`;
    A(root, [{opacity: 0, transform: 'translateY(-30px)'}, {opacity: 1, transform: 'none'}], t0 + .05, .55, {e: EASE.gentle});
    A(root, [{opacity: 1}, {opacity: 0}], t1 - .35, .3, {e: EASE.gentle, f: 'forwards'});
    const tc = `00:00:${String(10 + index * 7).padStart(2, '0')}:15`;
    div('', root, `<div class="p-dots"><i></i><i></i><i></i></div><div class="p-tc">${tc}</div>`).className = 'p-bar';
    return {root, stage: div(`left:40px;top:58px;width:${C.w}px;height:${C.h}px`, root), dark};
  },
  css: `
.ov-psl,.ov-psk{font-family:"Anu";font-weight:700;line-height:1.3;color:rgba(255,255,255,.5);text-shadow:0 3px 18px rgba(30,20,60,.6)}
.ov-psl{font-size:58px}.ov-psk{font-size:84px}
.ov-plead{font-family:"Anu";font-weight:600;line-height:1.25}.p-light .ov-plead{color:#4B3D6E}.p-dark .ov-plead{color:#F1ECFB}
.ov-pkey{font-family:"Anu";font-weight:700;line-height:1.2}.p-light .ov-pkey{color:#7E66BE}.p-dark .ov-pkey{color:#D9CCF6}`,
  sub(F, T, lead, key) {
    const [l, k] = ovSub(T, [[lead ?? '', 'ov-psl'], [key ?? '', 'ov-psk']]);
    const d = T.lead != null ? .2 : .35;             // a real clip: the lead turns when it is said, quick enough for short blocks
    A(l, [{color: 'rgba(255,255,255,.5)'}, {color: '#FFFFFF'}], T.lead ?? T.t0 + .3, d, {e: 'ease-out'});
    A(k, [{color: 'rgba(255,255,255,.5)'}, {color: '#D9C9FF'}], T.hit, d, {e: 'ease-out'});
  },
  text(F, T, lead, key) {                            // a scene without a small form: the words inside the window (auto-fit path)
    if (lead) A(ovLine(F, lead, 'ov-plead', 34), [{opacity: 0}, {opacity: 1}], T.t0 + .25, .4);
    if (key) A(ovLine(F, key, 'ov-pkey', 56), [{opacity: 0}, {opacity: 1}], T.hit, .4);
  },
};
OVERLAY('split-overlay', 'split', SPLIT_OV);
