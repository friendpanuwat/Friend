/* clip01-customers — graphics for the overlay layout: a flat landscape screen (760 × 430) high in the frame, partly behind the head
   (designed for this clip; read it for the level of work, never copy a scene into another clip). Words only from the transcript. */
function gAsk(t0, t1) {
  const s = area(t0, t1), a = screen(s, 160, 0, 760, 430, t0 + .05);
  const c = div(`left:50px;top:90px;width:270px;height:230px;border-radius:24px;background:#16171C;border:1px solid rgba(255,255,255,.1)`, a); pop(c, t0 + .2);
  [[28, 30, 190], [28, 86, 140]].forEach(([x, y, w], i) => { const b = div(`left:${x}px;top:${y}px;width:${w}px;height:38px;border-radius:19px;background:rgba(255,255,255,.14)`, c); A(b, [{transform: 'scaleX(0)'}, {transform: 'none'}], t0 + .35 + i * .12, .4, {e: OUTX}); b.style.transformOrigin = 'left'; });
  const ty = div(`left:28px;top:150px;width:110px;height:56px;border-radius:28px;background:#24252C`, c);
  [0, 1, 2].forEach(i => { const d = div(`left:${24 + i * 24}px;top:22px;width:12px;height:12px;border-radius:50%;background:#9A9AA6`, ty); A(d, [{transform: 'translateY(0)'}, {transform: 'translateY(-8px)'}, {transform: 'translateY(0)'}], t0 + .5 + i * .12, .45, {it: 4, f: 'none'}); });
  A(ty, [{opacity: 1}, {opacity: 0}], 1.77, .2, {f: 'forwards'});
  sphere(a, 545, 190, 130, t0 + .2, {color: '255,122,26', burst: 1.77});
  note(a, 600, 40, 'หายไป', 1.8, {to: {x: 560, y: 110}, color: '#FF9A55'});
}
function gPrice(t0, t1) {
  const s = area(t0, t1), a = screen(s, 160, 0, 760, 430, t0, {bg: '#F4F1EA', dark: false});
  areaChart(a, 50, 230, 660, 130, t0 + .1, {color: '#2F5BFF', dir: 'up', dur: 1.2});
  const tg = div(`left:60px;top:50px;width:210px;height:210px`, a, `<svg viewBox="0 0 100 100" width="210" height="210"><path d="M58 14 H86 a4 4 0 0 1 4 4 V46 L48 88 a5 5 0 0 1 -7 0 L12 59 a5 5 0 0 1 0 -7 Z" fill="#14161C"/><circle cx="74" cy="30" r="6" fill="#F4F1EA"/></svg>`);
  A(tg, [{opacity: 0, transform: 'translateY(-40px) rotate(-25deg)'}, {opacity: 1, transform: 'rotate(8deg)', offset: .6}, {opacity: 1, transform: 'rotate(0)'}], 4.0, .7, {e: 'ease-out'});
  select(a, 65, 55, 200, 200, 4.25);
  note(a, 300, 70, 'แพง?', 4.45, {to: {x: 272, y: 130}, color: '#2F5BFF', size: 42});
}
function gDoubts(t0, t1, rows) {
  const s = area(t0, t1), hub = appIcon(s, 170, 140, 130, t0, {glyph: 'M50 30 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M24 84 a26 26 0 0 1 52 0', color: '#7C5CFF'});
  rows.forEach(([, t, ], i) => { const x = [370, 560, 750][i], y = i === 1 ? 0 : 40;
    const ph = div(`left:${x - 20}px;top:${y}px;width:190px;height:150px;border-radius:22px;border:3px dashed rgba(76,155,255,.45);background:rgba(76,155,255,.05)`, s); pop(ph, t0 + .1 + i * .08, {y: 10});
    wire(s, [300, 205], [x - 20, y + 75], t0 + .3 + i * .1);
    const c = div(`left:${x - 20}px;top:${y}px;width:190px;height:150px;border-radius:22px;background:#0A0A0C;border:3px solid #4C9BFF;overflow:hidden`, s); pop(c, t, {s: .9, y: 0});
    if (i === 0) artScale(c, t + .1); if (i === 1) artBoxQ(c, t + .1, {ink: '#fff', q: '#4C9BFF'}); if (i === 2) artHover(c, t + .1);
  });
  const halo = div(`left:150px;top:120px;width:170px;height:170px;border-radius:50%;border:3px solid rgba(76,155,255,.5)`, s);
  A(halo, [{opacity: 0, transform: 'scale(.8)'}, {opacity: 1, transform: 'none'}], t0 + .4, .5, {e: OUTX});
}
function gRush(t0, t1, tPromo) {
  const s = area(t0, t1), a = screen(s, 160, 0, 760, 430, t0);
  metrics(a, 50, 70, 660, t0 + .2, {colors: ['#F2481C', '#8A8A96', '#8A8A96']});
  areaChart(a, 50, 150, 660, 190, t0 + .35, {color: '#F2481C', dir: 'down', dur: 1.3, seed: 7});
  const b = screen(s, 560, 120, 360, 230, tPromo - .1, {bg: TC.red, from: 'up'}); artTagRain(b, tPromo, t1, {n: 7});
  sphere(b, 180, 240, 170, tPromo, {color: '255,255,255', n: 320, horizon: true});
}
function gAnswer(t0, t1, tAns) {
  const s = area(t0, t1), a = screen(s, 160, 0, 760, 430, t0);
  const tg = div(`left:60px;top:80px;width:220px;height:220px`, a, `<svg viewBox="0 0 100 100" width="220" height="220"><path d="M58 14 H86 a4 4 0 0 1 4 4 V46 L48 88 a5 5 0 0 1 -7 0 L12 59 a5 5 0 0 1 0 -7 Z" fill="#E8E8EE"/><circle cx="74" cy="30" r="6" fill="#0A0A0C"/>
    <path class="x" d="M14 14 L86 86 M86 14 L14 86" stroke="#F2481C" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/></svg>`);
  pop(tg, t0 + .15, {s: .7}); A(tg.querySelector('.x'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], 16.6, .4, {e: OUTX});
  A(tg, [{opacity: 1}, {opacity: .35}], tAns - .4, .3, {f: 'forwards'});
  wire(a, [300, 190], [470, 190], tAns - .3, {color: '#16B97A'});
  const bb = div(`left:470px;top:70px;width:240px;height:240px`, a); artAnswer(bb, tAns, {ink: '#fff', tick: '#16B97A'});
}
function gPay(t0, t1, tPay) {
  const s = area(t0, t1), a = screen(s, 160, 0, 760, 430, t0, {bg: '#0B1430'});
  dotGlyph(a, '?', 200, 200, 240, t0 + .2, {color: '120,170,255', step: 9});
  const btn = div(`left:420px;top:120px;width:280px;height:90px;border-radius:45px;background:#2F5BFF;box-shadow:0 0 40px rgba(47,91,255,.6)`, a); pop(btn, tPay - .1, {y: 20});
  div(`left:100px;top:39px;width:80px;height:12px;border-radius:6px;background:rgba(255,255,255,.8)`, btn);
  const cur = div('left:0;top:0;width:50px;height:50px', a, `<svg viewBox="0 0 24 24" width="50" height="50"><path d="M5 3 L19 12 L12.5 13.5 L16 20.5 L13.2 21.8 L9.8 14.8 L5 19 Z" fill="#fff" stroke="#0B1430" stroke-width="1.2"/></svg>`);
  A(cur, [{transform: 'translate(700px,330px)'}, {transform: 'translate(560px,165px)', offset: .45}, {transform: 'translate(566px,170px)', offset: .6}, {transform: 'translate(710px,340px)'}], tPay, .9, {e: 'ease-in-out'});
}
function gReasons(t0, t1, items) {
  const s = area(t0, t1), a = screen(s, 160, 0, 760, 430, t0, {bg: '#FFF8E8', dark: false});
  const ta = items[0][3], tb = items[1][3];
  const box = stickerBox(a, 60, 90, 200, 180, ta, {fill: '#C8F24A', r: 18});
  icon(box, 'box', 100, 90, 130, ta + .2, {color: '#14161C', width: 6});
  const mg = div(`left:215px;top:60px;width:170px;height:170px`, a, `<svg viewBox="0 0 100 100" width="170" height="170" style="overflow:visible"><circle cx="40" cy="40" r="26" fill="rgba(255,255,255,.6)" stroke="#14161C" stroke-width="7"/><path d="M60 60 L88 88" stroke="#14161C" stroke-width="11" stroke-linecap="round"/><text x="40" y="52" text-anchor="middle" font-family="Display" font-weight="900" font-size="34" fill="#FF5C9A">?</text></svg>`);
  A(mg, [{opacity: 0, transform: 'translate(80px,60px) rotate(20deg)'}, {opacity: 1, transform: 'none'}], ta + .25, .5, {e: OUTX});
  A(mg, [{translate: '0 0'}, {translate: '-26px 16px'}], ta + .8, 1.0, {it: 2, dir: 'alternate', f: 'none', e: 'ease-in-out'});
  const sc = div(`left:470px;top:60px;width:250px;height:250px`, a, `<svg viewBox="0 0 100 100" width="250" height="250" style="overflow:visible">
    <path d="M50 22 V84 M32 86 H68" stroke="#14161C" stroke-width="6" stroke-linecap="round"/>
    <g class="bm" style="transform-origin:50px 26px"><path d="M14 26 H86" stroke="#14161C" stroke-width="6" stroke-linecap="round"/>
      <path d="M14 26 L4 50 H24 Z" fill="#FFD23F" stroke="#14161C" stroke-width="3"/><circle cx="14" cy="44" r="7" fill="#FFB81A" stroke="#14161C" stroke-width="3"/>
      <path d="M86 26 L76 50 H96 Z" fill="#fff" stroke="#14161C" stroke-width="3"/><rect x="80" y="36" width="12" height="10" fill="#C8F24A" stroke="#14161C" stroke-width="2.5"/></g></svg>`);
  pop(sc, tb - .1, {s: .7}); A(sc.querySelector('.bm'), [{transform: 'rotate(0)'}, {transform: 'rotate(-16deg)'}], tb + .2, .6, {e: 'cubic-bezier(.3,1.5,.5,1)', f: 'both'});
  starburst(a, 690, 70, 46, tb + .5, {fill: '#FF5C9A'});
  hazard(a, 60, 320, 220, 34, t0 + .2);
}
function gWhere(t0, t1, tType) {
  const sc = area(t0, t1), s = screen(sc, 160, 0, 760, 430, t0, {bg: '#F6F8FC', dark: false});
  appIcon(s, 60, 130, 140, t0 + .1, {glyph: 'box', color: '#2F5BFF'});
  [0, 1, 2].forEach(i => { const y = 50 + i * 115;
    const ph = div(`left:400px;top:${y}px;width:300px;height:100px;border-radius:20px;border:3px dashed rgba(47,91,255,.5);background:rgba(47,91,255,.05)`, s); pop(ph, t0 + .15 + i * .1, {y: 10});
    wire(s, [200, 200], [400, y + 50], tType + i * .15, {color: '#2F5BFF'});
    const q = div(`left:520px;top:${y + 10}px;width:60px;height:80px;font-family:Display;font-weight:900;font-size:62px;line-height:80px;text-align:center;color:rgba(47,91,255,.6)`, s, '?');
    A(q, [{opacity: 0, transform: 'scale(.4)'}, {opacity: 1, transform: 'none'}], 29.0 + i * .12, .4, {e: 'cubic-bezier(.3,1.5,.5,1)'}); });
}
function gStillNo(t0, t1, tNo) {
  const s = area(t0, t1), a = screen(s, 160, 0, 760, 430, t0);
  metrics(a, 50, 70, 660, t0 + .15, {colors: ['#F2481C', '#2F5BFF', '#8A8A96']});
  areaChart(a, 50, 150, 660, 190, t0 + .3, {color: '#F2481C', dir: 'down', dur: 1.1, seed: 11});
  const st = div(`left:500px;top:60px;width:170px;height:170px;border-radius:50%;border:7px solid #F2481C;display:flex;align-items:center;justify-content:center`, a);
  icon(st, 'cross', 78, 78, 90, 33.4, {color: '#F2481C', width: 11, dur: .3});
  A(st, [{opacity: 0, transform: 'scale(1.8) rotate(-20deg)'}, {opacity: 1, transform: 'rotate(-10deg)'}], 33.3, .25, {e: 'cubic-bezier(.5,0,.9,.6)'});
}
function gFirst(t0, t1, tNot) {
  const s = area(t0, t1), a = screen(s, 160, 0, 760, 430, t0);
  layers(a, 50, 70, 660, [{color: '#7C5CFF'}, {name: 'ลดราคา', color: '#F2481C', off: tNot + .2}, {color: '#16B97A'}], t0 + .1);
  const ph = div(`left:420px;top:58px;width:3px;height:300px;background:#FF7A1A`, a); A(ph, [{transform: 'translateX(0)'}, {transform: 'translateX(250px)'}], t0, t1 - t0, {e: 'linear'});
}
function gFix(t0, t1, tFix) {
  const s = area(t0, t1), a = screen(s, 160, 0, 760, 430, t0, {bg: '#FFF8E8', dark: false});
  stickerBox(a, 50, 60, 210, 64, t0 + .1, {fill: '#FFD23F', rot: -4}).innerHTML = `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Sans;font-weight:700;font-size:30px;color:#14161C">ติดอะไร?</div>`;
  const tg = div(`left:290px;top:60px;width:250px;height:250px`, a, `<svg viewBox="0 0 100 100" width="250" height="250" style="overflow:visible">${[44, 31, 18].map((r, i) => `<circle cx="50" cy="50" r="${r}" fill="${['#FF5C9A', '#fff', '#2F5BFF'][i]}" stroke="#14161C" stroke-width="2.6"/>`).join('')}<circle cx="50" cy="50" r="6" fill="#14161C"/></svg>`);
  tg.style.filter = 'drop-shadow(5px 5px 0 #14161C)'; pop(tg, t0 + .2, {s: .6});
  const dt = div(`left:0;top:0;width:1px;height:1px;overflow:visible`, a, `<svg width="1" height="1" style="overflow:visible"><path d="M415 185 L600 40" stroke="#14161C" stroke-width="8" stroke-linecap="round"/><path d="M592 22 L628 16 L622 52 Z" fill="#2F5BFF" stroke="#14161C" stroke-width="4"/></svg>`);
  A(dt, [{opacity: 0, transform: 'translate(200px,-160px)'}, {opacity: 1, transform: 'none'}], 40.95, .3, {e: 'cubic-bezier(.5,0,.9,.6)'});
  starburst(a, 640, 300, 50, 41.25, {fill: '#C8F24A'});
  stickerBox(a, 50, 300, 200, 62, 41.2, {fill: '#16B97A', rot: 5}).innerHTML = `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Sans;font-weight:700;font-size:30px;color:#fff">ถูกจุด</div>`;
}
