/* =====================================================================
   STYLE · hud — "เส้นชี้ HUD" (HUD Callout) (Friend 2026-11-18, the 7th of the new sheets: "ทำสไตล์นี้เป็นสไตล์ต่อไปครับ", then
   then the 12 shots full size: "รูปทั้ง 12 รูปครับผมส่งให้ใหม่"). Every place, size and colour is measured on those 1080 × 1920 shots, then held to the rules every style shares (styles/common.js: safe zone, frames below the search bar, centred
   words, the video filling its frame, seeded random, never over the face). The pictures: the glow-line template set first, in the
   yellow style's glass look (near-black bodies, white lines, the lit part yellow: GLASSY.hud = GLASSY.yellow's values).
   Friend's rules for the new styles: no small spaced labels on cards, the words in a card are the spoken words. The small notes at
   the end of the callout lines ("มือใหม่ · 0 ทริป") are the picture's next subtitles, on screen from the start in grey and white when
   said (Claude's default, Friend did not answer the question; the yellow style's chips work the same way and passed).
   The 7-item form:
   1 frame    one of 12 layouts (HUD.layouts, named after Friend's shots): the speaker full screen inside yellow HUD corners, or with
              corners around the words, a picture at the hands, a path of lines around him; a dark screen with the words, a picture
              and callout notes (a timeline, a measuring line); the speaker's card inside HUD corners with two notes; the screen
              split under a yellow line; a recap of three pictures on one axis (stills only)
   2 surface  near-black grey screen, a faint 60 px grid moving up slowly, a warm yellow glow in the middle (the yellow style's)
   3 drawing  thin callout lines (yellow or white) ending in a dot, HUD corners; the glow-line pictures in the yellow glass look
   4 colours  near-black · white · one yellow (#FFD600; lines and corners #FDC43F)
   5 words    a white lead (Kanit 500 51) + the key word big (Kanit 900 155) white-to-yellow with a yellow glow; notes Kanit 500 38
   6 motion   lines draw themselves, corners slide in, notes light up on their words, the key word glows in
   7 sound    whoosh on a screen cut, a soft swish on the key word, a soft tick on a note
   ===================================================================== */
const HUD = {
  /* boxes [x, y, w, h] · lead / key {x, y (centre), maxW, align} · pic = the picture box · corners = HUD corners [x, y, w, h] ·
     notes = the callout notes in the order the subtitles fill them: {path: [[x, y], …] (drawn from the first point, the dot at the
     last), dot, text {x, y, align}, y: yellow line} · links = lines with no words (a connector) · line = the split screen's yellow
     line · half = the video half [x, y, w, h, faceK, faceY] · card = the speaker's card [x, y, w, h, radius] · timeline / measure ·
     axis (the recap) · fitFrom = on a speaker screen, what is at or below this y moves under the chin · noPic = no picture on the
     sheet. Moved where the sheet ran under TikTok's buttons (x 1000–1020 below y 740 → 920), name (1680 → 1660) and search bar
     (the corners at y 95 → 220). */
  layouts: {   // measured on Friend's full-size shots (2026-11-18: "รูปทั้ง 12 รูปครับผมส่งให้ใหม่")
    /* final 2026-11-18 (Friend: "อยากให้กรอบอยู่กึ่งกลางของคลิปและ subtitle อยู่กึ่งกลางของกรอบ"): the corners round the words x 160–920
       (centre 540; was 110–900) and the words' block (lead top − 33 to key bottom + 100) in the middle of them */
    talk:      {speaker: true, fitFrom: 940, corners: [160, 950, 760, 350], lead: {x: 540, y: 1023}, key: {x: 540, y: 1160}},
    hud_open:  {speaker: true, noPic: true, fitFrom: 1040, corners: [60, 220, 860, 1440], lead: {x: 540, y: 1405}, key: {x: 540, y: 1545},          // shot 01 (the sheet's corners 58–1022 × 89–1682)
                notes: [{path: [[790, 1049], [900, 1049], [900, 1170]], text: {x: 900, y: 1213, align: 'right'}}]},
    hud_row:   {speaker: true, fitFrom: 980, lead: {x: 540, y: 1025}, key: {x: 540, y: 1132}, pic: [205, 1255, 670, 310],                            // shot 02
                links: [{path: [[290, 1200], [908, 1200], [908, 1393], [885, 1393]], y: true, dotAt: 0}],
                notes: [{path: [[210, 1390], [80, 1390], [80, 1622], [300, 1622]], text: {x: 322, y: 1622, align: 'left'}}]},   // (the sheet's 1662: the words' box ends 1650)
    hud_diag:  {screen: true, lead: {x: 540, y: 290}, key: {x: 540, y: 435}, pic: [115, 600, 805, 750],   // final 2026-11-18 (Friend: "subtitle สูงเกินไปเอาลงมาอีก"): 189/334 → 290/435                                             // shot 03
                notes: [{path: [[855, 668], [812, 563]], text: {x: 1020, y: 527, align: 'right'}},
                        {path: [[222, 1320], [180, 1470]], text: {x: 180, y: 1507, align: 'left'}},
                        {path: [[535, 1150], [560, 1597]], text: {x: 580, y: 1597, align: 'left'}, y: true}]},
    hud_card:  {screen: true, noPic: true, card: [190, 300, 700, 820, 26], corners: [160, 270, 740, 880], lead: {x: 540, y: 1398}, key: {x: 540, y: 1540},   // shot 04
                notes: [{path: [[220, 1080], [100, 1080], [100, 1240]], text: {x: 62, y: 1277, align: 'left'}, y: true},
                        {path: [[860, 1060], [908, 1060], [908, 1240]], text: {x: 920, y: 1275, align: 'right'}}]},   // (a dot on x 908: its edge at 916)
    hud_time:  {screen: true, lead: {x: 540, y: 290}, key: {x: 540, y: 435}, pic: [100, 610, 820, 540], timeline: {y: 1300, x0: 140, x1: 920},   // final: words 199/344 → 290/435, the picture 520 → 610      // shot 05 (the sheet's line 100–980)
                notes: [{dot: [200, 1300], text: {x: 200, y: 1363, align: 'center', maxW: 280}, y: true},
                        {dot: [530, 1300], text: {x: 530, y: 1363, align: 'center', maxW: 300}, y: true},
                        {dot: [820, 1300], text: {x: 820, y: 1363, align: 'center', maxW: 200}, y: true}]},   // (dots 140 / 540 / 940 on the sheet: the last label would run under the buttons)
    hud_path:  {speaker: true, noPic: true, fitFrom: 1000, lead: {x: 540, y: 1250}, key: {x: 540, y: 1395},                                        // shot 06
                notes: [{dot: [120, 232], text: {x: 150, y: 232, align: 'left'}, y: true},                                                 // (the sheet's 200 is under the search bar)
                        {path: [[120, 232], [120, 1080]], text: {x: 150, y: 1047, align: 'left'}, y: true, dotW: true},
                        {path: [[120, 1080], [908, 1080]], text: {x: 880, y: 1047, align: 'right'}, y: true, dotW: true},
                        {path: [[908, 1080], [908, 1560]], text: {x: 880, y: 1562, align: 'right'}, y: true}]},
    hud_split: {screen: true, half: [0, 0, 1080, 900, .3, .55], line: 900, lead: {x: 540, y: 1470}, key: {x: 540, y: 1560},                          // shot 07 (the key word at 1597 on the sheet)
                pic: [280, 1030, 560, 300], links: [{path: [[860, 780], [860, 1060]], y: true}]},
    hud_rail:  {speaker: true, fitFrom: 1150, pic: [95, 1210, 380, 370], lead: {x: 600, y: 1230, align: 'left', maxW: 320}, key: {x: 603, y: 1318, align: 'left', maxW: 317},   // shot 08 (the note is the lead)
                links: [{path: [[390, 1385], [540, 1385], [540, 1230], [580, 1230]], y: true}]},
    hud_measure: {screen: true, lead: {x: 540, y: 1380}, key: {x: 540, y: 1517}, pic: [100, 840, 820, 340]},   // shot 09 · final 2026-11-18 (Friend "ข2"): no measuring line and no word box over the picture
    hud_word:  {speaker: true, noPic: true, fitFrom: 940, corners: [160, 950, 760, 350], lead: {x: 540, y: 1023}, key: {x: 540, y: 1160},           // shot 10
                notes: [{path: [[860, 1125], [908, 1125], [908, 1480]], text: {x: 920, y: 1517, align: 'right'}}]},
    hud_recap: {screen: true, still: true, lead: {x: 540, y: 154}, key: {x: 540, y: 287}, axis: {x: 110, y0: 390, y1: 1600, at: [[570, 247], [990, 122], [1410, 152]]},
                three: [[400, 390, 420, 350], [290, 870, 640, 250], [320, 1280, 580, 270]]},                                                     // shot 11 (three pictures: stills only)
    /* final 2026-11-18 (Friend: "เพิ่มฉากโอเวอร์เลย์เข้ามาด้วย พื้นที่ด้านบนหัวยังเหลือ"): the picture over the head inside HUD corners,
       from under the search bar (220) to 140 over the face box; its height from the clip's face (hudFit) · the words at the chest as talk */
    hud_top:   {speaker: true, top: true, fitFrom: 940, corners: [100, 220, 880, 600], pic: [124, 244, 832, 552], lead: {x: 540, y: 1023}, key: {x: 540, y: 1160}},
    hud_cta:   {speaker: true, noPic: true, fitFrom: 970, corners: [160, 980, 760, 350], lead: {x: 540, y: 1053}, key: {x: 540, y: 1190},           // shot 12
                notes: [{path: [[540, 1330], [540, 1480], [690, 1480]], text: {x: 710, y: 1478, align: 'left'}, y: true, yText: true}]},   // (the sheet's dot at 760: its words ran to 965)
  },
  /* RANDOM, as the other styles: a call to action (B15) gets shot 12; every other picture takes one of `pool` (never the one before
     it) where the face leaves room (hudFit), a screen without a picture only when at least 2 more subtitles come for its notes (or
     its words) and not twice within 5 pictures nor first, among those with a picture the ones that show this picture's shape at
     least 75 % as big as the best, then the least used, then at random from the run's seed */
  /* final 2026-11-18: hud_path out (its notes were all it had: with no notes it is the talk screen) · hud_top in */
  pool: ['hud_open', 'hud_row', 'hud_diag', 'hud_card', 'hud_time', 'hud_split', 'hud_rail', 'hud_measure', 'hud_word', 'hud_cta', 'hud_top'],   // + the call-to-action screen as any screen (Friend 2026-11-18: "ทำตามที่คุณแนะนำ" · the sheets are read for their layout only)
  byCat: {B15: 'hud_cta'},
  keep: .75, noPicGap: 4, sinceNoPic: 4,
  spkMin: 82944,   // final 2026-11-18 (Friend chose "ก" on "motion graphic เล็กเกินไป"): a speaker screen with a picture shows it at least 4 % of the screen (1080 × 1920 × .04), else another screen
  gridUp: 12,
  used: {}, last: null, place: {top: 0, low: 0},   // place: speaker screens with the picture over the head / anywhere else
  /* final 2026-11-18 (Friend, a screen with its three callouts ringed in red: "ลบจุดที่ผมวงกลมสีแดงไว้ลบทั้งคลิปเลยนะไม่ให้ในสไตล์นี้มีเลย"):
     no callout line, dot or note anywhere · the timeline keeps its line and dots without words ("ก1") · the HUD corners of the screens
     that only had notes stay ("ค1") · the connectors (links: lines with no words) stay */
  noNotes: true,
};
/* the subtitles said inside [t0, t1] (a real clip) */
function hudChunks(t0, t1) {
  if (typeof CAPTIONS === 'undefined' || !CAPTIONS.length) return null;
  return CAPTIONS.filter(c => Math.min(c.t1, t1) - Math.max(c.t0, t0) >= .15).map(c => ({t0: c.t0, t1: c.t1, words: c.parts.map(p => p[0]).join(' ')}));
}
/* every y of a layout (words, picture, notes, links, corners) */
function hudEachY(L, fn) {
  for (const k of ['lead', 'key']) if (L[k]) L[k].y = fn(L[k].y);
  if (L.pic) { const b = fn(L.pic[1] + L.pic[3]); L.pic[1] = fn(L.pic[1]); L.pic[3] = b - L.pic[1]; }
  if (L.corners) { const b = fn(L.corners[1] + L.corners[3]); L.corners[1] = fn(L.corners[1]); L.corners[3] = b - L.corners[1]; }
  for (const n of [...(L.notes ?? []), ...(L.links ?? [])]) {
    if (n.path) n.path = n.path.map(([x, y]) => [x, fn(y)]);
    if (n.dot) n.dot = [n.dot[0], fn(n.dot[1])];
    if (n.text) n.text.y = fn(n.text.y);
  }
}
/* fit a speaker screen to this face [x0, top, x1, chin]: what is at or below fitFrom moves down so its top is 30 under the chin; when
   it then runs under y 1660 it is pressed together (positions only, at most to 70 %); null = no room. Screens: always fit. */
function hudFit(name, f) {
  const L = JSON.parse(JSON.stringify(HUD.layouts[name])); if (!L.speaker) return L;
  /* over the head: from under the search bar to 80 over the face box (the picture may cover the top of the hair, never the face:
     faces.py "Hair may sit under a widget; the face may not"; 140 at first, Friend: "โมชั่นกราฟฟิกมันสามารถใหญ่ได้กว่านี้อีก") */
  if (L.top) { const h = Math.min(L.corners[3], f[1] - 80 - L.corners[1]); if (h < 300) return null;   // no room under the search bar? not this screen
    L.corners[3] = h; L.pic[3] = h - 48; }   // (the picture 24 inside the corners, was 30)
  const [, , , chin] = f, from = L.fitFrom, top = Math.min(L.lead.y - 40, L.key.y - 90, ...(L.pic && !L.top ? [L.pic[1]] : []), ...(L.corners && L.corners[1] >= from ? [L.corners[1]] : []));   // (corners round the words: under the chin too)   // (hud_top: its picture stays over the head)
  const d = Math.max(0, chin + 30 - top); if (!d) return L;
  hudEachY(L, y => y >= from ? y + d : y);
  let bottom = from + d; hudEachY(L, y => { bottom = Math.max(bottom, y); return y; }); bottom = Math.max(bottom, L.key.y + 80);
  if (bottom > 1660) { const a = from + d, k = (1660 - a) / (bottom - a); if (k < .7) return null; hudEachY(L, y => y >= a ? a + (y - a) * k : y); }
  return L;
}
const HUD_NS = 'http://www.w3.org/2000/svg';
/* a note's words at (x, y): left / right / center of x, shrunk (never wrapped) to maxW and to the safe zone (a .cp-row, so the
   safe-zone check measures it) */
function hudNote(parent, txt, cls, {x, y, align = 'left', maxW = 420}) {
  const row = div('', parent); row.className = 'h-row cp-row'; const sp = document.createElement('span'); sp.className = cls; sp.textContent = txt; row.appendChild(sp);
  const tx = align === 'right' ? '-100%' : align === 'center' ? '-50%' : '0';
  Object.assign(row.style, {left: `${x}px`, top: `${y}px`, translate: `${tx} -50%`, transformOrigin: align === 'right' ? '100% 50%' : align === 'center' ? '50% 50%' : '0 50%'});
  const x1 = y + 30 < CP.safeTop.y ? CP.safeTop.x1 : CP.safe[2], x0 = CP.safe[0];
  const room = align === 'right' ? x - x0 : align === 'center' ? 2 * Math.min(x - x0, x1 - x) : x1 - x;
  FITS.push(() => { const w = sp.offsetWidth, m = Math.min(maxW, room); if (w <= m) return;
    /* spoken words run longer than the sheet's notes: a note of several phrases that would shrink under 74 % takes two lines,
       broken at the spaces between phrases only (the first real clip's timeline labels read at about 60 %) */
    if (w > m / .74 && /\s/.test(txt.trim())) {
      const ph = txt.trim().split(/\s+/); sp.textContent = '';
      ph.forEach((q, i) => { if (i) sp.appendChild(document.createTextNode(' ')); const e = document.createElement('span'); e.style.whiteSpace = 'nowrap'; e.textContent = q; sp.appendChild(e); });
      Object.assign(sp.style, {whiteSpace: 'normal', display: 'inline-block', width: `${m}px`, lineHeight: '1.12', textAlign: align === 'left' ? 'left' : align});
      const widest = Math.max(sp.scrollWidth, ...[...sp.children].map(e => e.offsetWidth));   // a phrase wider than the note runs out of it (scrollWidth of the note stays m): "กังวลอยู่" ran to x 943, 2026-11-18
      const k = Math.min(1, m / widest); if (k < 1) row.style.scale = String(k); return; }
    row.style.scale = String(m / w); });
  return row;
}
function hudSvg(root) { const s = document.createElementNS(HUD_NS, 'svg'); s.setAttribute('viewBox', '0 0 1080 1920');
  Object.assign(s.style, {position: 'absolute', left: 0, top: 0, width: '1080px', height: '1920px', overflow: 'visible'}); root.appendChild(s); return s; }
/* a line drawing itself (pathLength 1) · a dot · class cp-frame, so the safe-zone check measures every line */
function hudLine(svg, pts, yellow, t, d = .45) {
  const p = document.createElementNS(HUD_NS, 'path'); p.setAttribute('d', 'M ' + pts.map(q => q.join(' ')).join(' L '));
  p.setAttribute('class', 'h-line cp-frame' + (yellow ? ' h-y' : '')); p.setAttribute('pathLength', '1'); svg.appendChild(p);
  A(p, [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t, d, {e: EASE.inout, f: 'both'}); return p;
}
function hudDot(svg, [x, y], yellow, t) {
  const c = document.createElementNS(HUD_NS, 'circle'); c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 8);
  c.setAttribute('class', 'h-dot cp-frame' + (yellow ? ' h-y' : '')); svg.appendChild(c);
  A(c, [{opacity: 0, transform: 'scale(0)'}, {opacity: 1, transform: 'scale(1)'}], t, .25, {e: EASE.soft, f: 'both'}); return c;
}

STYLE('hud', {
  name: 'เส้นชี้ HUD',
  layouts: HUD.layouts,
  css: `
@font-face{font-family:"HudLead";src:url(fonts/Kanit-500-thai.woff);font-weight:500;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"HudLead";src:url(fonts/Kanit-500-latin.woff);font-weight:500;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
@font-face{font-family:"HudKey";src:url(fonts/Kanit-900-thai.woff);font-weight:900;unicode-range:U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC}
@font-face{font-family:"HudKey";src:url(fonts/Kanit-900-latin.woff);font-weight:900;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+2000-206F}
.h-root{position:absolute;inset:0;--ink:#F5F5F2;--ac:#FFD600;--lw:5;--sd:#F5F5F2;--fl:rgba(14,14,14,.85);--text:#F5F5F2}
.h-screen{background:radial-gradient(ellipse 560px 900px at 540px 1050px,rgba(255,214,0,.115) 0%,rgba(255,214,0,.06) 45%,rgba(255,214,0,0) 100%),
  linear-gradient(180deg,#0e0e10 0%,#131313 12%,#151514 22%,#171716 40%,#171716 60%,#181818 85%,#18181a 100%);background-color:#161615;overflow:hidden}
.h-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:60px 60px}
.h-half{position:absolute;overflow:hidden}
.h-bar{position:absolute;left:0;width:1080px;height:4px;background:#FFC93A;box-shadow:0 0 10px rgba(255,201,58,.6);transform-origin:0 50%}
.h-card{position:absolute;overflow:hidden;border:2px solid rgba(255,201,58,.55);box-sizing:border-box}
.h-text{position:absolute;inset:0}
.h-row{position:absolute;white-space:nowrap}
.h-row i{font-style:normal}
.h-lead{font-family:"HudLead","Anu",sans-serif;font-weight:500;font-size:51px;line-height:1.3;color:#FFFFFF;text-shadow:0 0 3px rgba(0,0,0,.85),0 2px 12px rgba(0,0,0,.6)}
.h-key{display:inline-block;font-family:"HudKey";font-weight:900;font-size:155px;line-height:1.1;padding:.1em .04em;color:transparent;
  background:linear-gradient(180deg,#FFFBE6 0%,#FFF0A8 30%,#FFD84A 62%,#FFC21A 100%);-webkit-background-clip:text;background-clip:text;
  filter:drop-shadow(0 0 2px rgba(255,236,160,.9)) drop-shadow(0 0 12px rgba(255,190,30,.85)) drop-shadow(0 0 28px rgba(255,170,0,.55))}
.h-note{font-family:"HudLead","Anu",sans-serif;font-weight:500;font-size:38px;line-height:1.3;color:#FFFFFF;text-shadow:0 0 3px rgba(0,0,0,.9),0 1px 8px rgba(0,0,0,.7)}
.h-note.h-ny{color:#FFD84A}
.h-nbox{position:absolute;background:#121212;border-radius:6px}
.h-line{fill:none;stroke:rgba(255,255,255,.88);stroke-width:3;stroke-dasharray:1;filter:drop-shadow(0 0 2px rgba(0,0,0,.8))}
.h-line.h-y{stroke:#FDC43F;filter:drop-shadow(0 0 4px rgba(253,196,63,.6))}
.h-dot{fill:#F2F2F2;transform-box:fill-box;transform-origin:50% 50%}
.h-dot.h-y{fill:#FDC43F}
.h-corner{fill:none;stroke:#FDC43F;stroke-width:4;filter:drop-shadow(0 0 4px rgba(255,190,40,.6))}
.h-tick{fill:none;stroke:#E8C66A;stroke-width:3}
`,
  motion: {
    pop:   {kf: [{opacity: 0, transform: 'translateY(30px) scale(.8)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .5, e: EASE.soft},
    drop:  {kf: [{opacity: 0, transform: 'translateY(-70px)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .6, e: EASE.soft},
    rise:  {kf: [{opacity: 0, transform: 'translateY(50px)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .6, e: EASE.soft},
    lead:  {kf: [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], d: .35, e: EASE.smooth},
    chip:  {kf: [{opacity: 0, transform: 'translateY(24px)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], d: .5, e: EASE.soft},
    leave: {kf: [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(12px)'}], d: .3, e: EASE.out},
    punch: {kf: [{transform: 'scale(1)', filter: 'brightness(1)'}, {transform: 'scale(1.06)', filter: 'brightness(1.5)', offset: .4}, {transform: 'scale(1)', filter: 'brightness(1)'}], d: .6, e: EASE.calm},
    shake: {kf: [{transform: 'translateX(0)'}, {transform: 'translateX(-12px)'}, {transform: 'translateX(10px)'}, {transform: 'translateX(-6px)'}, {transform: 'translateX(0)'}], d: .5, e: 'ease-in-out'},
    move:  {d: .7, e: EASE.calm}, tilt: {d: .8, e: EASE.calm}, snap: {d: .7, e: EASE.soft}, swap: {d: .45, e: EASE.smooth},
    draw:  {d: .8, e: EASE.inout}, stroke: {d: .25}, stagger: .12, fall: {d: 1.2}, float: {a: 6, p: 3.0},
    glow:  {kf: [{opacity: 0, filter: 'blur(16px)'}, {opacity: 1, filter: 'blur(0)'}], d: .7, e: EASE.soft},
  },
  sound: {hit: ['softswish', -22], cross: ['swipe', -24], key: ['softswish', -21]},
  setup() { BGL.style.background = '#000'; HOOKS.push(cpInsetHook);
    /* load this style's fonts at once (2026-11-18): build.py preloads only the older styles' families, so the words were fitted to the safe
       zone with the fallback font and came out wider in Kanit (the key word "กังวลอยู่" ran to x 943 once the speaker screens joined) */
    ['HudKey', 'HudLead'].forEach(f => div(`left:-9999px;top:0;font-family:${f};font-weight:${f === 'HudKey' ? 900 : 500}`, document.body, 'กขคฅ ึ่้ 0123 Ab')); },

  /* FIT PICK (Friend 2026-11-18: "motion graphic ที่ระบบจะสุ่มเลือกมาต้องเหมาะสมกับพื้นที่ว่างที่มีอยู่" → every style: "ข"): the pictures' real shapes
     (tools/real_shapes.js, a second build) and how much of the screen a shape can take here (tools/fit_pick.js), as the neon style */
  realShapes: true,
  fitSize(ar, t0, t1) { const face = cpFaceBox(t0, t1); return cpFitSize(ar, HUD.pool.filter(n => !HUD.layouts[n].noPic && hudFit(n, face)), n => hudFit(n, face)?.pic, HUD.keep, n => !!HUD.layouts[n].speaker); },
  fitSurface() { const r = div('', SC); r.className = 'h-root h-screen'; return r; },

  frame(t0, t1, {index, scene}) {
    const meta = SCENES[scene]?.meta ?? {}, face = cpFaceBox(t0, t1), ch = hudChunks(t0, t1);
    const more = ch ? Math.max(0, ch.length - 1) : (meta.rows?.length ?? 0);
    let name = meta.layout;
    if (!name) {
      const ok = n => { const L = HUD.layouts[n]; if (L.noPic && (more < 2 || index === 0 || HUD.sinceNoPic < HUD.noPicGap)) return false; return !!hudFit(n, face); };
      const want = HUD.byCat[String(meta.cat ?? '').slice(0, 3)];
      if (want && ok(want)) name = want;
      else {
        let pool = HUD.pool.filter(n => n !== HUD.last && ok(n));
        if (!pool.length) pool = ['hud_diag', 'hud_time', 'hud_split', 'hud_measure'].filter(n => n !== HUD.last);
        const ar = cpShape(meta.variant, t0);   // the picture's shape in this clip (REAL_SHAPES), else the sample's (fit pick, 2026-11-18)
        if (ar) {
          const size = n => { const p = hudFit(n, face)?.pic; if (!p) return 0; const [, , w, h] = p; return ar > w / h ? w * w / ar : h * h * ar; };
          pool = cpSizeKeep(pool, size, HUD.keep, n => !!HUD.layouts[n].speaker, n => !!HUD.layouts[n].noPic);   // the speaker's screens with a picture: a floor, no race on size (Friend 2026-11-18: "อยากให้ ก ขึ้นบ้าง (ทุกสไตล์เลยนะ)")
          const big = pool.filter(n => !HUD.layouts[n].speaker || HUD.layouts[n].noPic || size(n) >= HUD.spkMin); if (big.length) pool = big;   // (hud: 4 %, not the shared 30000 px²)
        }
        pool = cpBalance(pool, n => !!HUD.layouts[n].speaker, index);   // ก (the speaker full screen) and ข (a graphic screen) as often (Friend 2026-11-18)
        /* a speaker screen: the picture over the head or not as often (as the window style's final: "เพื่อความหลากหลาย"); the less used, a tie by the run's seed */
        const tp = pool.filter(n => HUD.layouts[n].top), lw = pool.filter(n => HUD.layouts[n].speaker && !HUD.layouts[n].top);
        if (tp.length && lw.length) { const P = HUD.place, up = P.top !== P.low ? P.top < P.low : cpRand('place' + index) < .5; pool = up ? tp : lw; }
        const least = Math.min(...pool.map(n => HUD.used[n] ?? 0)); pool = pool.filter(n => (HUD.used[n] ?? 0) === least);
        name = pool[Math.floor(cpRand('screen' + index) * pool.length)];
      }
    }
    if (HUD.layouts[name].speaker) HUD.place[HUD.layouts[name].top ? 'top' : 'low']++;
    HUD.used[name] = (HUD.used[name] ?? 0) + 1; HUD.last = name; HUD.sinceNoPic = HUD.layouts[name].noPic ? 0 : HUD.sinceNoPic + 1;
    const L = (meta.layout ? JSON.parse(JSON.stringify(HUD.layouts[name])) : hudFit(name, face)) ?? JSON.parse(JSON.stringify(HUD.layouts.hud_diag));
    /* final 2026-11-18 (Friend: "กรอบควรจะพอดีกับ motion graphic ด้วยไม่ใช่กรอบกว้างแต่ motion graphic เล็ก"): over the head, the picture's box
       takes the picture's own shape (REAL_SHAPES) in the middle of the room and the corners close in to 24 px round it */
    const arT = L.top ? cpShape(meta.variant, t0) : null;
    if (arT) { const [px, py, pw, ph] = L.pic, w = arT > pw / ph ? pw : ph * arT, h = arT > pw / ph ? pw / arT : ph, x = px + (pw - w) / 2, y = py + (ph - h) / 2;
      L.pic = [x, y, w, h].map(v => Math.round(v)); L.corners = [x - 24, y - 24, w + 48, h + 48].map(v => Math.round(v)); }
    const screen = !L.speaker, root = div('', SC); root.className = 'h-root' + (screen ? ' h-screen' : '');
    const box = ([x, y, w, h], parent = root) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
    if (screen) {
      const g = div('', root); g.className = 'h-grid';
      const at = t => `0px ${(-HUD.gridUp * t).toFixed(1)}px`;
      A(g, [{backgroundPosition: at(t0 - .2)}, {backgroundPosition: at(t1 + .2)}], t0 - .2, t1 - t0 + .4, {e: 'linear'});
      A(root, [{opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)'}, {opacity: 1, filter: 'blur(0)', transform: 'none'}], t0 - .04, .35, {e: EASE.smooth});
      sfx('whoosh', t0 - .1, -20);
    }
    A(root, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], t1 - .3, .3, {e: EASE.out, f: 'forwards'});
    /* the video half and its yellow line (shot 07) · the speaker's card (shot 04) */
    if (L.half) { const [x, y, w, h, k, fy] = L.half, f = box([x, y, w, h]); f.className = 'h-half'; cpInset(f, w, h, t0, k, fy);
      A(f, [{opacity: 0, transform: 'translateY(-60px)'}, {opacity: 1, transform: 'none'}], t0, .45, {e: EASE.soft});
      const b = div(`top:${L.line - 2}px`, root); b.className = 'h-bar'; A(b, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], t0 + .1, .45, {e: EASE.soft}); }
    if (L.card) { const [x, y, w, h, r] = L.card, f = box([x, y, w, h]); f.className = 'h-card cp-frame'; f.style.borderRadius = r + 'px';
      cpInset(f, w - 4, h - 4, t0, .36, .42); A(f, [{opacity: 0, transform: 'translateY(30px)'}, {opacity: 1, transform: 'none'}], t0 + .05, .45, {e: EASE.soft}); }
    const svg = hudSvg(root);
    /* HUD corners: four L shapes, 60 long, sliding in from a little outside */
    if (L.corners) { const [x, y, w, h] = L.corners, s = 60;
      [[`M ${x} ${y + s} V ${y} H ${x + s}`, -1, -1], [`M ${x + w - s} ${y} H ${x + w} V ${y + s}`, 1, -1], [`M ${x} ${y + h - s} V ${y + h} H ${x + s}`, -1, 1], [`M ${x + w - s} ${y + h} H ${x + w} V ${y + h - s}`, 1, 1]]
        .forEach(([d, sx, sy], k) => { const p = document.createElementNS(HUD_NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', 'h-corner cp-frame'); svg.appendChild(p);
          A(p, [{opacity: 0, transform: `translate(${sx * 24}px,${sy * 24}px)`}, {opacity: 1, transform: 'none'}], t0 + .05 + .04 * k, .4, {e: EASE.soft, f: 'both'}); }); }
    /* the timeline (shot 05) and the measuring line (shot 09) */
    if (L.timeline) hudLine(svg, [[L.timeline.x0, L.timeline.y], [L.timeline.x1, L.timeline.y]], false, t0 + .15, .6);
    if (L.measure) { const {y, x0, x1} = L.measure; hudLine(svg, [[x0, y], [x1, y]], true, t0 + .15, .6);
      [x0, x1].forEach(x => { const p = document.createElementNS(HUD_NS, 'path'); p.setAttribute('d', `M ${x} ${y - 16} V ${y + 16}`); p.setAttribute('class', 'h-tick cp-frame'); svg.appendChild(p); }); }
    /* the recap's axis (shot 11) */
    let stages = null;
    if (L.axis) { const {x, y0, y1, at} = L.axis; hudLine(svg, [[x, y0], [x, y1]], false, t0 + .1, .7);
      at.forEach(([y, len], k) => { hudLine(svg, [[x, y], [x + len, y]], true, t0 + .3 + .1 * k, .35); hudDot(svg, [x, y], true, t0 + .3 + .1 * k); });
      stages = L.three.map(b => box(b)); }
    /* lines with no words (connectors) */
    for (const l of L.links ?? []) { hudLine(svg, l.path, l.y, t0 + .2); hudDot(svg, l.path[l.dotAt ?? l.path.length - 1], l.y, t0 + .55); }
    const stage = L.pic ? box(L.pic) : box([540, 960, 1, 1]);
    if (!L.pic) stage.style.visibility = 'hidden';
    else A(stage, [{opacity: 0, transform: 'translateY(24px) scale(.94)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t0 + .05, .45, {e: EASE.soft});
    const F = {root, stage, stages, cam: root, L, name, dark: screen, t1, n: 0, meta, svg, notes: []};
    /* the notes: every line and dot from the start; the words of the picture's next subtitles in grey from the start, white (or
       yellow) when said (a still: as the sheet, all said) */
    if (HUD.noNotes) { if (L.timeline) (L.notes ?? []).forEach((n, k) => n.dot && hudDot(svg, n.dot, n.y, t0 + .65 + .12 * k)); }   // ("ก1": the timeline's dots, lit, no words)
    else (L.notes ?? []).forEach((n, k) => {
      const words = ch ? ch[k + 1]?.words : meta.rows?.[k]; if (!words) return;
      const t = t0 + .25 + .12 * k, P = n.text;
      if (n.path) hudLine(svg, n.path, n.y, t);
      const dotAt = n.dot ?? n.path?.[n.path.length - 1], dot = dotAt ? hudDot(svg, dotAt, n.y && !n.dotW, t + .4) : null;   // (shot 06: the path's corners are white dots)
      let bx = null; if (n.box) { bx = div('', root); bx.className = 'h-nbox'; }
      const r = hudNote(root, words, 'h-note' + (n.yText ? ' h-ny' : ''), P);
      if (bx) FITS.push(() => { const q = r.getBoundingClientRect(), k1 = 1080 / document.documentElement.clientWidth || 1; Object.assign(bx.style, {left: `${q.left * k1 - 18}px`, top: `${q.top * k1 - 4}px`, width: `${q.width * k1 + 36}px`, height: `${q.height * k1 + 8}px`}); });
      A(r, [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], t + .35, .35, {e: EASE.soft, f: 'both'});
      F.notes.push({r, dot, said: !ch});
      if (ch) { r.firstChild.style.color = '#9C9C9C'; if (dot) dot.style.fill = '#8A8A8A'; }
    });
    if ((typeof CAPTIONS === 'undefined' || !CAPTIONS.length) && meta.rows) F.stillRows = meta.rows;
    return F;
  },
  /* between pictures: the words at the chest inside HUD corners, moved below the chin when the face is low */
  speakerFrame(a, b) {
    const L = hudFit('talk', cpFaceBox(a, b)) ?? JSON.parse(JSON.stringify(HUD.layouts.talk)), root = div('', SC); root.className = 'h-root';
    const svg = hudSvg(root), [x, y, w, h] = L.corners, s = 60;
    [`M ${x} ${y + s} V ${y} H ${x + s}`, `M ${x + w - s} ${y} H ${x + w} V ${y + s}`, `M ${x} ${y + h - s} V ${y + h} H ${x + s}`, `M ${x + w - s} ${y + h} H ${x + w} V ${y + h - s}`]
      .forEach(d => { const p = document.createElementNS(HUD_NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', 'h-corner cp-frame'); svg.appendChild(p);
        A(p, [{opacity: 0}, {opacity: 1}], a - .02, .001, {f: 'both'}); A(p, [{opacity: 1}, {opacity: 0}], b - .021, .001, {f: 'forwards'}); });   // (one block after another: steady corners)
    /* final 2026-11-18 (Friend: "อยากให้ขอบมุมทั้ง 4 มุมที่อยู่ครอบ subtitle ... เวลา subtitle มันขยับ ... อยากให้ไอ้ขอบเนี้ยมันขยับตามแบบสมูท"): each block
       sits under its own chin, so a block right after another can sit a few px to 30 px lower or higher: the corners and the words glide
       from the last block's place to this one's in .35 s instead of jumping */
    const P = HUD.prevTalk, dy = P && Math.abs(a - P.b) < .15 ? P.y - L.corners[1] : 0;
    if (Math.abs(dy) > .5) A(svg, [{translate: `0 ${dy}px`}, {translate: '0 0'}], a - .02, .35, {e: EASE.smooth});
    HUD.prevTalk = {y: L.corners[1], b};
    return {root, cam: root, speaker: true, L, name: 'talk', glide: Math.abs(dy) > .5 ? [dy, a - .02] : null};
  },
  /* the words: the picture's first subtitle is the lead + key word; each next one lights its note (grey → white, the dot yellow);
     with all notes used, a next subtitle takes the lead and key word's place */
  text(F, T, lead, key) {
    const L = F.L ?? HUD.layouts.talk, el = div('', F.root ?? SC); el.className = 'h-text';
    const head = (t, swap) => {
      if (swap && F.head) A(F.head, [{opacity: 1}, {opacity: 0}], t - .04, .12, {f: 'forwards'});
      const h = div('', el); h.className = 'h-text'; F.head = h;
      if (lead && L.lead) { const r = cpLine(h, lead, 'h-lead', L.lead, undefined, 'h-row'); A(r, [{opacity: 0, filter: 'blur(8px)'}, {opacity: 1, filter: 'blur(0)'}], swap ? t + .08 : T.t0 + .15, .35, {e: EASE.smooth}); }
      if (key && L.key) { const r = cpLine(h, key, 'h-key', L.key, undefined, 'h-row');
        A(r, [{opacity: 0, transform: 'scale(.9)', filter: 'blur(10px) brightness(1.8)'}, {opacity: 1, transform: 'none', filter: 'blur(0) brightness(1)'}], T.hit - .05, .45, {e: EASE.soft});
        sfx('softswish', T.hit - .05, -21); } };
    if (F.speaker || !F.L) {
      head(T.t0);
      if (F.glide) A(el, [{translate: `0 ${F.glide[0]}px`}, {translate: '0 0'}], F.glide[1], .35, {e: EASE.smooth});   // (the words glide with their corners)
      if (F.speaker && T.clip) {
        A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], T.b[0] - .02, .001); A(el, [{visibility: 'visible'}, {visibility: 'hidden'}], T.end - .021, .001, {f: 'forwards'});
        return null;
      }
      return el;
    }
    const words = [lead, key].map(s => String(s ?? '').trim()).filter(Boolean).join(' ');
    if (!words && !(F.stillRows && T.clip !== true)) return null;
    const n = F.n++, start = T.b[0] - .02, N = F.notes[n - 1];
    if (n === 0) head(T.t0);
    else if (N) { A(N.r.firstChild, [{color: '#9C9C9C'}, {color: N.r.firstChild.classList.contains('h-ny') ? '#FFD84A' : '#FFFFFF'}], start, .25, {f: 'forwards'});
      if (N.dot) { A(N.dot, [{fill: '#8A8A8A'}, {fill: N.dot.classList.contains('h-y') ? '#FFC93A' : '#F2F2F2'}], start, .25, {f: 'forwards'});
        A(N.dot, [{transform: 'scale(1)'}, {transform: 'scale(1.8)', offset: .4}, {transform: 'scale(1)'}], start, .4, {e: EASE.soft}); }
      sfx('softswish', start, -26); }
    else head(start, true);
    if (T.clip) { A(el, [{visibility: 'hidden'}, {visibility: 'visible'}], start, .001); return null; }
    return el;
  },
});
