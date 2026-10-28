/* clip01-customers — graphics for the split-screen layout: each scene a "real screen" drawn for its sentence (designed for this clip;
   read it for the level of work, never copy a scene into another clip). Words only from the transcript; no numbers were said. */
function gAsk(t0, t1) {
  const s = area(t0, t1), a = screen(s, 140, 10, 800, 640, t0 + .05);
  const c = div(`left:60px;top:120px;width:300px;height:250px;border-radius:26px;background:#16171C;border:1px solid rgba(255,255,255,.1)`, a); pop(c, t0 + .2);
  [[30, 30, 200], [30, 90, 150]].forEach(([x, y, w], i) => { const b = div(`left:${x}px;top:${y}px;width:${w}px;height:40px;border-radius:20px;background:rgba(255,255,255,.14)`, c); A(b, [{transform: 'scaleX(0)'}, {transform: 'none'}], t0 + .35 + i * .12, .4, {e: OUTX}); b.style.transformOrigin = 'left'; });
  const ty = div(`left:30px;top:160px;width:110px;height:56px;border-radius:28px;background:#24252C`, c);
  [0, 1, 2].forEach(i => { const d = div(`left:${24 + i * 24}px;top:22px;width:12px;height:12px;border-radius:50%;background:#9A9AA6`, ty); A(d, [{transform: 'translateY(0)'}, {transform: 'translateY(-8px)'}, {transform: 'translateY(0)'}], t0 + .5 + i * .12, .45, {it: 4, f: 'none'}); });
  A(ty, [{opacity: 1}, {opacity: 0}], 1.77, .2, {f: 'forwards'});
  sphere(a, 560, 330, 150, t0 + .2, {color: '255,122,26', burst: 1.77});
  note(a, 470, 540, 'หายไป', 1.8, {to: {x: 545, y: 470}, color: '#FF9A55'});
}
function gPrice(t0, t1) {
  const s = area(t0, t1), a = screen(s, 140, 10, 800, 640, t0, {bg: '#F4F1EA', dark: false});
  areaChart(a, 60, 300, 680, 260, t0 + .1, {color: '#2F5BFF', dir: 'up', dur: 1.2});   // a deep line on the light screen
  const tg = div(`left:250px;top:110px;width:300px;height:300px`, a, `<svg viewBox="0 0 100 100" width="300" height="300"><path d="M58 14 H86 a4 4 0 0 1 4 4 V46 L48 88 a5 5 0 0 1 -7 0 L12 59 a5 5 0 0 1 0 -7 Z" fill="#14161C"/><circle cx="74" cy="30" r="6" fill="#F4F1EA"/></svg>`);
  A(tg, [{opacity: 0, transform: 'translateY(-40px) rotate(-25deg)'}, {opacity: 1, transform: 'rotate(8deg)', offset: .6}, {opacity: 1, transform: 'rotate(0)'}], 4.0, .7, {e: 'ease-out'});
  select(a, 255, 115, 290, 290, 4.25);
  note(a, 560, 120, 'แพง?', 4.45, {to: {x: 552, y: 200}, color: '#2F5BFF', size: 46});
}
function gDoubts(t0, t1, rows) {
  const s = area(t0, t1), hub = appIcon(s, 130, 250, 190, t0, {glyph: 'M50 30 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M24 84 a26 26 0 0 1 52 0', color: '#7C5CFF'});
  rows.forEach(([, t, ], i) => { const y = 20 + i * 230;
    const ph = div(`left:520px;top:${y}px;width:420px;height:200px;border-radius:24px;border:3px dashed rgba(76,155,255,.45);background:rgba(76,155,255,.05)`, s); pop(ph, t0 + .1 + i * .08, {y: 10});
    wire(s, [320, 345], [520, y + 100], t0 + .3 + i * .1);
    const c = div(`left:520px;top:${y}px;width:420px;height:200px;border-radius:24px;background:#0A0A0C;border:3px solid #4C9BFF;overflow:hidden`, s); pop(c, t, {s: .9, y: 0});
    if (i === 0) artScale(c, t + .1); if (i === 1) artBoxQ(c, t + .1, {ink: '#fff', q: '#4C9BFF'}); if (i === 2) artHover(c, t + .1);
  });
  const halo = div(`left:105px;top:225px;width:240px;height:240px;border-radius:50%;border:3px solid rgba(76,155,255,.5)`, s);
  A(halo, [{opacity: 0, transform: 'scale(.8)'}, {opacity: 1, transform: 'none'}], t0 + .4, .5, {e: OUTX});
}
function gRush(t0, t1, tPromo) {
  const s = area(t0, t1), a = screen(s, 140, 0, 800, 470, t0);
  metrics(a, 60, 80, 680, t0 + .2, {colors: ['#F2481C', '#8A8A96', '#8A8A96']});
  areaChart(a, 60, 180, 680, 200, t0 + .35, {color: '#F2481C', dir: 'down', dur: 1.3, seed: 7});
  const b = screen(s, 330, 360, 610, 320, tPromo - .1, {bg: TC.red, from: 'up'}); artTagRain(b, tPromo, t1, {n: 8});
  sphere(b, 305, 330, 260, tPromo, {color: '255,255,255', n: 380, horizon: true});
}
function gFix(t0, t1, tFix) {
  const s = area(t0, t1), a = screen(s, 140, 10, 800, 640, t0, {bg: '#FFF8E8', dark: false});
  stickerBox(a, 60, 70, 230, 70, t0 + .1, {fill: '#FFD23F', rot: -4}).innerHTML = `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Sans;font-weight:700;font-size:34px;color:#14161C">ติดอะไร?</div>`;
  const tg = div(`left:250px;top:150px;width:330px;height:330px`, a, `<svg viewBox="0 0 100 100" width="330" height="330" style="overflow:visible">${[44, 31, 18].map((r, i) => `<circle cx="50" cy="50" r="${r}" fill="${['#FF5C9A', '#fff', '#2F5BFF'][i]}" stroke="#14161C" stroke-width="2.6"/>`).join('')}<circle cx="50" cy="50" r="6" fill="#14161C"/></svg>`);
  tg.style.filter = 'drop-shadow(6px 6px 0 #14161C)'; pop(tg, t0 + .2, {s: .6});
  const dt = div(`left:0;top:0;width:1px;height:1px;overflow:visible`, a, `<svg width="1" height="1" style="overflow:visible"><path d="M415 315 L640 110" stroke="#14161C" stroke-width="9" stroke-linecap="round"/><path d="M630 90 L668 84 L660 122 Z" fill="#F2481C" stroke="#14161C" stroke-width="4"/></svg>`);
  A(dt, [{opacity: 0, transform: 'translate(220px,-220px)'}, {opacity: 1, transform: 'none'}], 40.95, .3, {e: 'cubic-bezier(.5,0,.9,.6)'});
  starburst(a, 640, 420, 70, 41.25, {fill: '#C8F24A'});
  hazard(a, 520, 540, 240, 40, t0 + .3);
  stickerBox(a, 520, 300, 220, 70, 41.2, {fill: '#16B97A', rot: 5}).innerHTML = `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:Sans;font-weight:700;font-size:34px;color:#fff">ถูกจุด</div>`;
}

/* ===== v8 — the rest of the clip ===== */
function gAnswer(t0, t1, tAns) {
  const s = area(t0, t1), a = screen(s, 140, 10, 800, 640, t0);
  const tg = div(`left:80px;top:150px;width:260px;height:260px`, a, `<svg viewBox="0 0 100 100" width="260" height="260"><path d="M58 14 H86 a4 4 0 0 1 4 4 V46 L48 88 a5 5 0 0 1 -7 0 L12 59 a5 5 0 0 1 0 -7 Z" fill="#E8E8EE"/><circle cx="74" cy="30" r="6" fill="#0A0A0C"/>
    <path class="x" d="M14 14 L86 86 M86 14 L14 86" stroke="#F2481C" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/></svg>`);
  pop(tg, t0 + .15, {s: .7}); A(tg.querySelector('.x'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], 16.6, .4, {e: OUTX});
  A(tg, [{opacity: 1}, {opacity: .35}], tAns - .4, .3, {f: 'forwards'});
  wire(a, [345, 280], [470, 280], tAns - .3, {color: '#16B97A'});
  const bb = div(`left:460px;top:130px;width:280px;height:280px`, a); artAnswer(bb, tAns, {ink: '#fff', tick: '#16B97A'});
  note(a, 470, 470, 'คำตอบ', tAns + .3, {to: {x: 560, y: 410}, color: '#16B97A'});
}
function gPay(t0, t1, tPay) {
  const s = area(t0, t1), a = screen(s, 140, 10, 800, 640, t0, {bg: '#0B1430'});
  dotGlyph(a, '?', 400, 270, 300, t0 + .2, {color: '120,170,255', step: 10});
  const btn = div(`left:200px;top:470px;width:400px;height:96px;border-radius:48px;background:#2F5BFF;box-shadow:0 0 40px rgba(47,91,255,.6)`, a); pop(btn, tPay - .1, {y: 20});
  div(`left:150px;top:42px;width:100px;height:12px;border-radius:6px;background:rgba(255,255,255,.8)`, btn);
  const cur = div('left:0;top:0;width:54px;height:54px', a, `<svg viewBox="0 0 24 24" width="54" height="54"><path d="M5 3 L19 12 L12.5 13.5 L16 20.5 L13.2 21.8 L9.8 14.8 L5 19 Z" fill="#fff" stroke="#0B1430" stroke-width="1.2"/></svg>`);
  A(cur, [{transform: 'translate(720px,620px)'}, {transform: 'translate(420px,520px)', offset: .45}, {transform: 'translate(430px,525px)', offset: .6}, {transform: 'translate(740px,640px)'}], tPay, .9, {e: 'ease-in-out'});
}
function gReasons(t0, t1, items) {
  const s = area(t0, t1), a = screen(s, 140, 10, 800, 640, t0, {bg: '#FFF8E8', dark: false});
  const ta = items[0][3], tb = items[1][3];
  const box = stickerBox(a, 90, 170, 230, 200, ta, {fill: '#C8F24A', r: 18});
  icon(box, 'box', 115, 100, 150, ta + .2, {color: '#14161C', width: 6});
  const mg = div(`left:250px;top:120px;width:200px;height:200px`, a, `<svg viewBox="0 0 100 100" width="200" height="200" style="overflow:visible"><circle cx="40" cy="40" r="26" fill="rgba(255,255,255,.6)" stroke="#14161C" stroke-width="7"/><path d="M60 60 L88 88" stroke="#14161C" stroke-width="11" stroke-linecap="round"/><text x="40" y="52" text-anchor="middle" font-family="Display" font-weight="900" font-size="34" fill="#FF5C9A">?</text></svg>`);
  A(mg, [{opacity: 0, transform: 'translate(80px,60px) rotate(20deg)'}, {opacity: 1, transform: 'none'}], ta + .25, .5, {e: OUTX});
  A(mg, [{translate: '0 0'}, {translate: '-30px 20px'}], ta + .8, 1.0, {it: 2, dir: 'alternate', f: 'none', e: 'ease-in-out'});
  const sc = div(`left:470px;top:150px;width:280px;height:280px`, a, `<svg viewBox="0 0 100 100" width="280" height="280" style="overflow:visible">
    <path d="M50 22 V84 M32 86 H68" stroke="#14161C" stroke-width="6" stroke-linecap="round"/>
    <g class="bm" style="transform-origin:50px 26px"><path d="M14 26 H86" stroke="#14161C" stroke-width="6" stroke-linecap="round"/>
      <path d="M14 26 L4 50 H24 Z" fill="#FFD23F" stroke="#14161C" stroke-width="3"/><circle cx="14" cy="44" r="7" fill="#FFB81A" stroke="#14161C" stroke-width="3"/>
      <path d="M86 26 L76 50 H96 Z" fill="#fff" stroke="#14161C" stroke-width="3"/><rect x="80" y="36" width="12" height="10" fill="#C8F24A" stroke="#14161C" stroke-width="2.5"/></g></svg>`);
  pop(sc, tb - .1, {s: .7}); A(sc.querySelector('.bm'), [{transform: 'rotate(0)'}, {transform: 'rotate(-16deg)'}], tb + .2, .6, {e: 'cubic-bezier(.3,1.5,.5,1)', f: 'both'});
  starburst(a, 700, 120, 54, tb + .5, {fill: '#FF5C9A'});
  hazard(a, 80, 520, 260, 38, t0 + .2);
}
function gWhere(t0, t1, tType) {   // a node graph inside a light screen (reads on the page and over the video)
  const sc = area(t0, t1), s = screen(sc, 120, 0, 840, 690, t0, {bg: '#F6F8FC', dark: false});
  appIcon(s, 70, 250, 170, t0 + .1, {glyph: 'box', color: '#2F5BFF'});
  [0, 1, 2].forEach(i => { const y = 70 + i * 190;
    const ph = div(`left:430px;top:${y}px;width:350px;height:160px;border-radius:22px;border:3px dashed rgba(47,91,255,.5);background:rgba(47,91,255,.05)`, s); pop(ph, t0 + .15 + i * .1, {y: 10});
    wire(s, [240, 335], [430, y + 80], tType + i * .15, {color: '#2F5BFF'});
    const q = div(`left:575px;top:${y + 40}px;width:60px;height:80px;font-family:Display;font-weight:900;font-size:72px;line-height:80px;text-align:center;color:rgba(47,91,255,.6)`, s, '?');
    A(q, [{opacity: 0, transform: 'scale(.4)'}, {opacity: 1, transform: 'none'}], 29.0 + i * .12, .4, {e: 'cubic-bezier(.3,1.5,.5,1)'}); });
  const scan = div(`left:430px;top:70px;width:350px;height:6px;border-radius:3px;background:linear-gradient(90deg,transparent,#2F5BFF,transparent);box-shadow:0 0 20px #2F5BFF`, s);
  A(scan, [{transform: 'translateY(0)', opacity: 0}, {opacity: 1, offset: .1}, {transform: 'translateY(520px)', opacity: 1, offset: .9}, {transform: 'translateY(540px)', opacity: 0}], 28.0, 1.0, {e: 'ease-in-out', f: 'none'}); scan.style.opacity = 0;
}
function gStillNo(t0, t1, tNo) {
  const s = area(t0, t1), a = screen(s, 140, 10, 800, 640, t0);
  metrics(a, 60, 80, 680, t0 + .15, {colors: ['#F2481C', '#2F5BFF', '#8A8A96']});
  areaChart(a, 60, 200, 680, 260, t0 + .3, {color: '#F2481C', dir: 'down', dur: 1.1, seed: 11});
  const flat = div(`left:60px;top:460px;width:680px;height:4px;border-radius:2px;background:#2F5BFF;box-shadow:0 0 12px #2F5BFF;transform-origin:left`, a);
  A(flat, [{transform: 'scaleX(0)'}, {transform: 'none'}], t0 + .5, 1.1, {e: 'cubic-bezier(.4,0,.2,1)'});
  const st = div(`left:520px;top:300px;width:220px;height:220px;border-radius:50%;border:8px solid #F2481C;display:flex;align-items:center;justify-content:center`, a);
  icon(st, 'cross', 102, 102, 120, 33.4, {color: '#F2481C', width: 12, dur: .3});
  A(st, [{opacity: 0, transform: 'scale(1.8) rotate(-20deg)'}, {opacity: 1, transform: 'rotate(-10deg)'}], 33.3, .25, {e: 'cubic-bezier(.5,0,.9,.6)'});
}
function gFirst(t0, t1, tNot) {
  const s = area(t0, t1), a = screen(s, 140, 10, 800, 640, t0);
  layers(a, 50, 90, 700, [{color: '#7C5CFF'}, {name: 'ลดราคา', color: '#F2481C', off: tNot + .2}, {color: '#16B97A'}, {color: '#FFB81A'}, {color: '#2F5BFF'}], t0 + .1);
  const ph = div(`left:440px;top:70px;width:3px;height:480px;background:#FF7A1A`, a); A(ph, [{transform: 'translateX(0)'}, {transform: 'translateX(260px)'}], t0, t1 - t0, {e: 'linear'});
}
