/* ===================== LAYOUT — one design, two skills =====================
   MODE 'split'   : the speaker drops into a panel at the bottom (head breaking out of it); the graphics fill the top of the
                    page, the headline (the subtitle) sits under them, just above the head.
   MODE 'overlay' : the speaker stays full screen; the graphics sit high, partly BEHIND the head (the cut-out speaker covers
                    them, never the other way round); the headline sits under the chin.
   area(t0, t1) returns the drawing surface: 1080 design px wide, content kept to x 120–960. */
let MODE = SKILL_MODE;   // set by the skill (assets/MODE): 'split' or 'overlay'
const mode = m => { MODE = m; };
const OVER = {top: 250, k: 1.05, h: 430, sub: 330};   // sub: overlay subtitles sit this far above SAFE.b — down by the hands and forearms   // overlay: a 760 × 430 landscape screen drawn at x 160, scaled to ~800 px wide
function area(t0, t1) {
  if (MODE === 'split') { split(t0, t1); return ui(t0, t1); }
  const s = div(`left:0;top:${OVER.top}px;width:1080px;height:${OVER.h}px;transform-origin:540px 0;transform:translateX(-60px) scale(${OVER.k})`, B);   // layer B: behind the cut-out head
  MATTES.push([t0, t1]); window_(s, t0, t1); fadeOut(s, t1, .2); return s;
}
/* title(t0, t1, l1, l2) — the two-line headline: under the graphics (split) or under the chin (overlay). It is the subtitle while it is up. */
function title(t0, t1, l1, l2, o = {}) {
  const el = headline(t0, t1, l1, l2, {...o, onVideo: MODE === 'overlay'}); capOff(t0, t1);
  if (MODE === 'overlay') el.style.top = SAFE.b - OVER.sub + 'px';
  return el;
}
