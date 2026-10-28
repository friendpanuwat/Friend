/* ===================== GLOW-STYLE MOTION GRAPHICS (experiment) =====================
   One idea per frame, centred, generous space · flat full-bleed backgrounds (white / black / one bold colour)
   · clean bold type · glow on the one thing that matters · springy physics · a cursor that clicks */
const SW = {ink: '#0A0A0A', paper: '#FFFFFF', electric: '#2323FF', green: '#30D158', red: '#FF3B30', orange: '#FF9500', blue: '#0A84FF'};
const BOLD = 'font-family:RefSans;font-weight:700';
const bounce = 'cubic-bezier(.34,1.56,.64,1)';
const solid = (t0, t1, bg, enter = 'cut') => scene(t0, t1, {bg, enter});
const seeded = s => () => ((s = (s * 16807) % 2147483647) / 2147483647);

/* chat bubble pops in the middle, then dissolves into dots */
function bubblePop(t0, t1, txt, {tGone} = {}) {
  const root = solid(t0, t1, SW.paper), tg = tGone ?? t1 - .45;
  const b = div(`left:0;width:1080px;top:820px;text-align:center`, root,
    `<span style="display:inline-block;padding:40px 60px 50px;border-radius:70px;border-bottom-left-radius:18px;background:#EDEDF0;${BOLD};font-size:70px;color:${SW.ink}">${txt}</span>`);
  A(b, [{opacity: 0, transform: 'scale(.4) translateY(80px)'}, {opacity: 1, transform: 'none'}], t0 + .1, .5, {e: bounce});
  A(b, [{opacity: 1, transform: 'none', filter: 'blur(0)'}, {opacity: 0, transform: 'scale(1.08)', filter: 'blur(6px)'}], tg, .22, {f: 'forwards'});
  const r = seeded(11);
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2, d = 160 + r() * 420, s = 10 + r() * 22, x = 540 + Math.cos(a) * r() * 300, y = 900 + Math.sin(a) * r() * 60;
    const p = div(`left:${x}px;top:${y}px;width:${s}px;height:${s}px;border-radius:50%;background:${r() < .5 ? '#C7C7CC' : SW.ink};opacity:0`, root);
    A(p, [{opacity: 1, transform: 'translate(0,0) scale(1)'}, {opacity: 0, transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d}px) scale(.2)`}], tg + r() * .1, .6, {e: 'cubic-bezier(.1,.8,.3,1)', f: 'none'});
  }
}

/* word chips beside the head (never over the face) — chips: [[text, t]] */
function chipsNear(t0, t1, chips) {
  const fb = faceBox(t0), spots = [[790, fb.top + 40, 8], [230, fb.top + 10, -10], [640, fb.top - 110, -6], [170, fb.top + 260, 7]];   // nothing right of x 900
  chips.forEach(([txt, t], i) => { const [x, y, rot] = spots[i % spots.length];
    const c = div(`left:${x}px;top:${y}px;transform:translateX(-50%)`, Q,
      `<span style="display:inline-block;padding:18px 40px 26px;border-radius:60px;background:#fff;${BOLD};font-size:64px;color:${SW.ink};box-shadow:0 14px 34px rgba(0,0,0,.35);transform:rotate(${rot}deg)">${txt}</span>`);
    life(c.firstChild, t, t1, [{opacity: 0, transform: `rotate(${rot * 3}deg) scale(.3)`}, {opacity: 1, transform: `rotate(${rot}deg) scale(1)`}], [{opacity: 1}, {opacity: 0, transform: `rotate(${rot}deg) scale(.6)`}], .45, .2, bounce);
    A(c, [{translate: '0 0'}, {translate: '0 -14px'}], t + .4, .9, {it: Math.ceil((t1 - t) / .9), dir: 'alternate', e: 'ease-in-out', f: 'none'}); });
}

/* giant word that stretches in (and out), with outlined echoes above and below */
function stretchWord(t0, t1, txt, {bg = SW.ink, color = '#fff'} = {}) {
  const root = solid(t0, t1, bg);
  const line = (y, outline) => { const l = div(`left:0;width:1080px;top:${y}px;text-align:center;white-space:nowrap;${BOLD};font-size:190px;line-height:1.25;${outline ? `color:transparent;-webkit-text-stroke:3px ${color};opacity:.55` : `color:${color}`}`, root, txt); return l; };
  const mid = line(800, false), up = line(560, true), dn = line(1040, true);
  FITS.push(() => { const w = mid.firstChild ? mid.scrollWidth : 1000; const s = Math.min(1, 1000 / mid.scrollWidth); [mid, up, dn].forEach(e => e.style.fontSize = 190 * s + 'px'); });
  A(mid, [{transform: 'scaleY(3.2) scaleX(.55)', opacity: 0}, {transform: 'scaleY(1) scaleX(1)', opacity: 1}], t0 + .02, .45, {e: bounce});
  [up, dn].forEach((e, i) => A(e, [{transform: `translateY(${i ? -240 : 240}px) scaleY(.2)`, opacity: 0}, {transform: 'none', opacity: .55}], t0 + .12, .45, {e: bounce}));
  A(mid, [{transform: 'none'}, {transform: 'scaleY(.05) scaleX(1.4)', opacity: 0}], t1 - .18, .18, {f: 'forwards', e: 'ease-in'});
}

/* word chips fall from the top and pile up with a bounce — chips: [[text, t]] */
function chipDrop(t0, t1, chips, {bg = SW.ink, title = '', outline = true} = {}) {
  const root = solid(t0, t1, bg);
  if (title) { const h = div(`left:0;width:1080px;top:380px;text-align:center;${BOLD};font-size:64px;color:rgba(255,255,255,.75)`, root, title); A(h, [{opacity: 0}, {opacity: 1}], t0, .3); }
  const r = seeded(chips.length * 7 + 3), n = chips.length;
  chips.forEach(([txt, t], i) => {
    const rot = (r() - .5) * 14, x = (r() - .5) * 120, y = 1240 - (n - 1 - i) * 190;
    const c = div(`left:0;width:1080px;top:${y}px;text-align:center`, root,
      `<span style="display:inline-block;max-width:960px;white-space:nowrap;padding:24px 54px 34px;border-radius:80px;${outline ? 'border:6px solid #fff;color:#fff' : 'background:#fff;color:' + SW.ink};${BOLD};font-size:${txt.length > 18 ? 58 : 76}px;transform:translateX(${x}px) rotate(${rot}deg)">${txt}</span>`);
    A(c, [{transform: 'translateY(-1500px)', offset: 0}, {transform: 'translateY(0)', offset: .55}, {transform: 'translateY(-70px)', offset: .72}, {transform: 'translateY(0)', offset: .86}, {transform: 'translateY(-14px)', offset: .93}, {transform: 'translateY(0)', offset: 1}], t, .75, {e: 'ease-in'});
  });
}

/* a red line glows its way down + a big word with a falling arrow */
function lineDown(t0, t1, {label = ''} = {}) {
  const root = solid(t0, t1, SW.ink);
  const g = svg(1080, 1920, `<defs><linearGradient id="ldA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SW.red}" stop-opacity=".35"/><stop offset="1" stop-color="${SW.red}" stop-opacity="0"/></linearGradient></defs>
    <path d="M60 760 L260 820 L400 790 L560 980 L720 1050 L860 1240 L1020 1380 L1020 1700 L60 1700Z" fill="url(#ldA)" class="ar" opacity="0"/>
    <path class="ln" d="M60 760 L260 820 L400 790 L560 980 L720 1050 L860 1240 L1020 1380" fill="none" stroke="${SW.red}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 18px ${SW.red})"/>
    <circle class="dt" cx="1020" cy="1380" r="20" fill="#fff" style="filter:drop-shadow(0 0 16px ${SW.red})" opacity="0"/>`, 'left:0;top:0', root);
  const ln = g.querySelector('.ln'); ln.setAttribute('pathLength', 1); ln.style.strokeDasharray = 1;
  A(ln, [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t0 + .05, Math.min(.8, t1 - t0 - .1), {e: INOUT});
  A(g.querySelector('.ar'), [{opacity: 0}, {opacity: 1}], t0 + .5, .3); A(g.querySelector('.dt'), [{opacity: 0}, {opacity: 1}], t0 + .7, .15);
  const w = div(`left:0;width:1080px;top:380px;text-align:center;${BOLD};font-size:150px;color:#fff`, root, `${label} <span style="color:${SW.red};text-shadow:0 0 30px ${SW.red}">↓</span>`);
  A(w, [{opacity: 0, transform: 'translateY(40px)'}, {opacity: 1, transform: 'none'}], t0 + .05, .35, {e: bounce});
}

/* a big switch goes from ON (green glow) to OFF */
function toggleOff(t0, t1, {tOff, label = ''} = {}) {
  const root = solid(t0, t1, SW.ink);
  const tr = div(`left:270px;top:760px;width:540px;height:300px;border-radius:150px;background:${SW.green};box-shadow:0 0 140px ${SW.green}AA`, root,
    `<i class="kn" style="position:absolute;left:250px;top:10px;width:280px;height:280px;border-radius:50%;background:#fff;display:block;box-shadow:0 10px 30px rgba(0,0,0,.35)"></i>`);
  A(tr, [{opacity: 0, transform: 'scale(.7)'}, {opacity: 1, transform: 'none'}], t0, .35, {e: bounce});
  A(tr, [{background: SW.green, boxShadow: `0 0 140px ${SW.green}AA`}, {background: '#3A3A3C', boxShadow: '0 0 0px transparent'}], tOff, .3);
  A(tr.querySelector('.kn'), [{transform: 'none'}, {transform: 'translateX(-240px)'}], tOff, .35, {e: bounce});
  const on = div(`left:0;width:1080px;top:1120px;text-align:center;${BOLD};font-size:64px;color:${SW.green}`, root, 'ON');
  const off = div(`left:0;width:1080px;top:1120px;text-align:center;${BOLD};font-size:64px;color:#8E8E93`, root, label || 'OFF');
  A(on, [{opacity: 1}, {opacity: 0}], tOff, .15, {f: 'both'}); A(off, [{opacity: 0}, {opacity: 1}], tOff + .1, .2);
}

/* the cursor clicks buttons one after another — buttons: [[label, colour, t]] */
function clickButtons(t0, t1, buttons, {bg = SW.paper} = {}) {
  const root = solid(t0, t1, bg), n = buttons.length, ys = buttons.map((_, i) => 960 - (n - 1) * 130 + i * 260);
  const els = buttons.map(([lab, col], i) => { const b = div(`left:240px;width:600px;top:${ys[i] - 85}px;height:170px;border-radius:85px;background:${col};display:flex;align-items:center;justify-content:center;${BOLD};font-size:68px;color:#fff;box-shadow:0 20px 50px ${col}66`, root, lab);
    A(b, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'none'}], t0 + .05 + i * .1, .4, {e: bounce}); return b; });
  const cur = div('left:0;top:0;width:110px;height:110px;filter:drop-shadow(0 8px 16px rgba(0,0,0,.35))', root,
    `<svg width="110" height="110" viewBox="0 0 24 24"><path d="M5 3l14 8-6.5 1.5L9 19z" fill="#111" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>`);
  const kf = [{transform: 'translate(900px,1700px)', offset: 0}], tA = t0 + .15, tB = buttons.at(-1)[2] + .4;
  buttons.forEach(([, , t], i) => { kf.push({transform: `translate(560px,${ys[i] + 10}px)`, offset: clamp((t - .05 - tA) / (tB - tA))}); });
  kf.push({transform: `translate(620px,${ys.at(-1) + 120}px)`, offset: 1});
  A(cur, kf, tA, tB - tA, {e: INOUT});
  buttons.forEach(([, col, t], i) => { A(els[i], [{transform: 'scale(1)'}, {transform: 'scale(.9)'}, {transform: 'scale(1)'}], t, .25, {f: 'none'});
    const rp = div(`left:${540 - 90}px;top:${ys[i] - 90}px;width:180px;height:180px;border-radius:50%;border:6px solid ${col};opacity:0`, root);
    A(rp, [{opacity: .9, transform: 'scale(.4)'}, {opacity: 0, transform: 'scale(3)'}], t, .6, {f: 'none'}); });
}

/* a glowing button waits; the cursor circles it but never clicks; small ? marks appear */
function hoverButton(t0, t1, {label = '', tq} = {}) {
  const root = solid(t0, t1, SW.ink);
  const b = div(`left:240px;width:600px;top:875px;height:170px;border-radius:85px;background:${SW.blue};display:flex;align-items:center;justify-content:center;${BOLD};font-size:70px;color:#fff;box-shadow:0 0 90px ${SW.blue}AA`, root, label);
  A(b, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'none'}], t0 + .05, .4, {e: bounce});
  A(b, [{boxShadow: `0 0 60px ${SW.blue}77`}, {boxShadow: `0 0 130px ${SW.blue}EE`}], t0 + .5, .7, {it: Math.ceil((t1 - t0) / .7), dir: 'alternate', e: 'ease-in-out', f: 'none'});
  const cur = div('left:0;top:0;width:110px;height:110px;filter:drop-shadow(0 8px 16px rgba(0,0,0,.5))', root,
    `<svg width="110" height="110" viewBox="0 0 24 24"><path d="M5 3l14 8-6.5 1.5L9 19z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>`);
  const pts = [[900, 1650], [700, 1150], [880, 1080], [760, 1190], [900, 1120], [740, 1220], [860, 1160], [920, 1700]];
  A(cur, pts.map(([x, y], i) => ({transform: `translate(${x}px,${y}px)`, offset: i / (pts.length - 1)})), t0 + .2, t1 - t0 - .3, {e: 'ease-in-out'});
  if (tq != null) [[300, 700, -12], [800, 640, 10], [880, 1300, -8]].forEach(([x, y, rot], i) => { const q = div(`left:${x}px;top:${y}px;${BOLD};font-size:120px;color:#fff;opacity:.85`, root, '?');
    A(q, [{opacity: 0, transform: `scale(.3) rotate(${rot * 3}deg)`}, {opacity: .85, transform: `rotate(${rot}deg)`}], tq + i * .15, .4, {e: bounce}); });
}

/* big word struck through with a glowing red line */
function bigStrike(t0, t1, {pre = '', word = '', tStrike} = {}) {
  const root = solid(t0, t1, SW.ink);
  const p = div(`left:0;width:1080px;top:640px;text-align:center;${BOLD};font-size:84px;color:rgba(255,255,255,.8)`, root);
  typeIn(p, pre, t0 + .05, .4, 'rgba(255,255,255,.85)', 'none');
  const w = div(`left:0;width:1080px;top:820px;text-align:center;white-space:nowrap;${BOLD};font-size:220px;line-height:1.2;color:#fff`, root, `<span style="position:relative;display:inline-block">${word}<i class="st" style="position:absolute;left:-20px;right:-20px;top:52%;height:22px;border-radius:11px;background:${SW.red};box-shadow:0 0 40px ${SW.red};display:block;transform-origin:left;transform:scaleX(0)"></i></span>`);
  A(w, [{opacity: 0, transform: 'scaleY(2.4) scaleX(.7)'}, {opacity: 1, transform: 'none'}], t0 + .35, .4, {e: bounce});
  A(w.querySelector('.st'), [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], tStrike, .3, {e: SMOOTH});
  A(w.firstChild, [{color: '#fff'}, {color: 'rgba(255,255,255,.35)'}], tStrike + .25, .3);
}

/* a curved line draws itself through numbered dots — steps: [[label, t]] */
function timelineSteps(t0, t1, steps) {
  const root = safeStage(solid(t0, t1, SW.paper));   // kept clear of the right-side buttons
  const pts = steps.map((_, i) => [200 + i * 340, i % 2 ? 1180 : 900]);
  const d = `M 30 1480 C 110 1480, 110 ${pts[0][1]}, ${pts[0][0]} ${pts[0][1]} ` + pts.slice(1).map(p => `S ${p[0] - 170} ${p[1]}, ${p[0]} ${p[1]}`).join(' ') + ' S 980 700, 1010 650';
  const g = svg(1080, 1920, `<path class="ln" d="${d}" fill="none" stroke="${SW.ink}" stroke-width="7" stroke-linecap="round"/>`, 'left:0;top:0', root);
  const ln = g.querySelector('.ln'); ln.setAttribute('pathLength', 1); ln.style.strokeDasharray = 1;
  A(ln, [{strokeDashoffset: 1}, {strokeDashoffset: 0}], steps[0][1] - .2, steps.at(-1)[1] - steps[0][1] + .5, {e: 'linear'});
  steps.forEach(([lab, t], i) => { const [x, y] = pts[i], last = i === steps.length - 1;
    const dot = div(`left:${x - 28}px;top:${y - 28}px;width:56px;height:56px;border-radius:50%;background:${last ? SW.red : SW.ink};${last ? `box-shadow:0 0 40px ${SW.red}` : ''}`, root);
    A(dot, [{transform: 'scale(0)'}, {transform: 'scale(1)'}], t, .35, {e: bounce});
    const above = i % 2 === 0;   // labels sit on the open side of the curve
    const c = div(`left:${clamp(x - 260, 20, 540)}px;top:${above ? y - 250 : y + 60}px;width:520px;text-align:center;white-space:nowrap`, root,
      `<div style="${BOLD};font-size:38px;color:#8E8E93">0${i + 1}</div><div style="${BOLD};font-size:62px;line-height:1.2;color:${last ? SW.red : SW.ink}">${lab}</div>`);
    A(c, [{opacity: 0, transform: 'translateY(30px)'}, {opacity: 1, transform: 'none'}], t + .05, .35, {e: bounce}); });
}
