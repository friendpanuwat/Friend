/* graphics designed for clip 02 ("เกษียณ / รวย", 21 s) — REFERENCE IDEAS ONLY.
   This clip's head reaches the top edge → band('chest'): band graphics sit under the chin, captions below them.
   Every graphic here is drawn for this clip's words: work → retire, salary, time sand → money, the money tap,
   months left, years flipping, the broken crown, the laptop that closes, the road to the end on a full tank. */
const GOLD = '#FFD60A', GOLD_D = '#C9A400', AMBER = '#FFB800';
const coinCss = s => `width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF3B0,${GOLD} 45%,${AMBER});box-shadow:inset 0 -${s * .1}px 0 ${GOLD_D},0 0 ${s * .5}px ${GOLD}66`;

/* door sign on a nail: "ทำงาน" flips over to "เกษียณ" and swings */
function doorSign(t0, t1, {front = '', back = '', tFlip} = {}) {
  const el = topBand(t0, t1, 'height:270px;display:flex;justify-content:center', `
    <div class="sg" style="position:relative;width:420px;height:262px;perspective:1100px;transform-origin:210px 12px">
      <svg width="420" height="100" style="position:absolute;left:0;top:0;overflow:visible"><path d="M70 92 L210 14 L350 92" fill="none" stroke="#E5E5EA" stroke-width="5" stroke-linejoin="round"/>
        <circle cx="210" cy="14" r="11" fill="#8E8E93" stroke="#fff" stroke-width="3"/></svg>
      <div class="cd" style="position:absolute;left:30px;top:84px;width:360px;height:170px;transform-style:preserve-3d">
        <div style="position:absolute;inset:0;border-radius:30px;${WHITE_CARD};backface-visibility:hidden;display:flex;align-items:center;justify-content:center;${BOLD};font-size:86px;color:${OV.ink}">${front}</div>
        <div style="position:absolute;inset:0;border-radius:30px;background:linear-gradient(140deg,#FFE680,${AMBER});box-shadow:0 0 70px ${AMBER}AA,0 16px 40px rgba(0,0,0,.35);transform:rotateY(180deg);backface-visibility:hidden;display:flex;align-items:center;justify-content:center;${BOLD};font-size:86px;color:#fff;text-shadow:0 3px 12px rgba(150,80,0,.6)">${back}</div>
      </div></div>`);
  const sg = el.querySelector('.sg');
  pop(sg, t0, {y: -60, from: .7});
  A(el.querySelector('.cd'), [{transform: 'rotateY(0deg)'}, {transform: 'rotateY(180deg)'}], tFlip, .6, {e: bounce});
  burst(el, 420, 170, tFlip + .3, {n: 14, colors: [GOLD, '#fff'], dist: [150, 260], size: [8, 16], seed: 3});
  sway(sg, tFlip + .6, t1, 3, .9);
}

/* a salary slip slides up and gets stamped */
function paySlip(t0, t1, {head = '', stamp = '', tStamp} = {}) {
  const bar = (w, c = '#E5E5EA', h = 18) => `<div style="height:${h}px;width:${w}px;border-radius:${h / 2}px;background:${c};margin-top:16px"></div>`;
  const el = topBand(t0, t1, 'height:285px');
  const slip = div(`left:170px;top:14px;width:500px;height:258px;border-radius:22px;${WHITE_CARD};padding:26px 36px;border-top:10px dashed #D1D1D6`, el,
    `<div style="${BOLD};font-size:50px;color:${OV.ink}">${head}</div>${bar(300)}${bar(240)}
     <div style="display:flex;align-items:center;gap:16px;margin-top:20px"><span style="${BOLD};font-size:48px;color:${OV.green}">฿</span><div style="height:26px;width:230px;border-radius:13px;background:${OV.green}"></div></div>`);
  A(slip, [{opacity: 0, transform: 'translateY(150px) rotate(5deg)'}, {opacity: 1, transform: 'rotate(-2deg)'}], t0, .55, {e: bounce});
  const st = div(`left:330px;top:120px;padding:8px 26px 16px;border:8px solid ${OV.red};border-radius:18px;${BOLD};font-size:56px;color:${OV.red};white-space:nowrap;background:rgba(255,255,255,.6);transform:rotate(-12deg)`, el, stamp);
  A(st, [{opacity: 0, transform: 'rotate(-12deg) scale(2.8)'}, {opacity: 1, transform: 'rotate(-12deg) scale(1)'}], tStamp, .22, {e: 'ease-in'});
  shake(slip, tStamp + .2, {amp: 8});
}

/* hourglass: the sand of time runs down and lands as coins */
function hourglass(t0, t1, {top = '', bottom = '', coins = 6} = {}) {
  const el = topBand(t0, t1, 'height:280px');
  const g = svg(220, 272, `
    <path d="M40 16 C40 100 98 112 110 136 C122 112 180 100 180 16 Z M40 256 C40 172 98 160 110 136 C122 160 180 172 180 256 Z" fill="rgba(255,255,255,.14)" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
    <path class="sd" d="M54 36 H166 L110 128 Z" fill="#F5C26B" style="transform-box:fill-box;transform-origin:50% 100%"/>
    <path class="st" d="M110 136 V246" stroke="#F5C26B" stroke-width="5" stroke-dasharray="10 10"/>
    <rect x="18" y="0" width="184" height="18" rx="9" fill="#C7A27A"/><rect x="18" y="254" width="184" height="18" rx="9" fill="#C7A27A"/>`, 'left:310px;top:4px', el);
  pop(g, t0, {from: .6});
  A(g.querySelector('.sd'), [{transform: 'scale(1,1)'}, {transform: 'scale(.25,.08)'}], t0 + .3, t1 - t0 - .5, {e: 'linear'});
  loop(g.querySelector('.st'), [{strokeDashoffset: 0}, {strokeDashoffset: -40}], t0 + .3, t1, .35);
  const per = (t1 - t0 - .8) / coins;
  for (let i = 0; i < coins; i++) {   // the coin pile grows in the bottom bulb
    const c = div(`left:${410 - 34 + (i % 2 ? 10 : -10)}px;top:${236 - i * 13}px;width:68px;height:18px;border-radius:50%;background:linear-gradient(${GOLD},${AMBER});box-shadow:inset 0 -4px 0 ${GOLD_D}`, el);
    A(c, [{opacity: 0, transform: 'translateY(-40px) scale(.6)'}, {opacity: 1, transform: 'none'}], t0 + .5 + i * per, .25, {e: bounce});
  }
  const lab = (x, y, txt, c, align) => { const l = div(`left:${x}px;top:${y}px;width:220px;text-align:${align};${BOLD};font-size:50px;color:${c};text-shadow:${c === '#fff' ? SHADOW : glow(c)}`, el, txt); pop(l, t0 + .2, {from: .7}); };
  lab(70, 40, top, '#fff', 'right'); lab(550, 170, bottom, GOLD, 'left');
}

/* the money tap: coins drip out until the valve is turned off */
function moneyTap(t0, t1, {tOff} = {}) {
  const el = topBand(t0, t1, 'height:280px');
  const g = svg(440, 150, `
    <rect x="0" y="40" width="250" height="44" rx="10" fill="#AEB4BF"/><rect x="0" y="40" width="250" height="12" rx="6" fill="#D5D9E0"/>
    <path d="M210 40 h56 a26 26 0 0 1 26 26 v58 h-46 v-38 h-36z" fill="#AEB4BF"/><rect x="244" y="118" width="50" height="14" rx="5" fill="#8E949E"/>
    <g class="vl" style="transform-box:fill-box;transform-origin:50% 100%"><rect x="146" y="6" width="14" height="36" fill="#8E949E"/><rect class="hd" x="108" y="0" width="90" height="16" rx="8" fill="${OV.green}"/></g>`, 'left:150px;top:10px', el);
  pop(g, t0, {from: .7, y: -20});
  const vl = g.querySelector('.vl');
  A(vl, [{transform: 'rotate(0deg)'}, {transform: 'rotate(90deg)'}], tOff, .35, {e: bounce});
  A(g.querySelector('.hd'), [{fill: OV.green}, {fill: OV.red}], tOff, .25);
  for (let i = 0; i < 3; i++) {   // drips fall from the spout (x ≈ 150 + 268), stop after tOff
    const c = div(`left:${418 - 21}px;top:142px;${coinCss(42)};opacity:0`, el);
    const s = t0 + .1 + i * .2, n = Math.max(1, Math.floor((tOff + .25 - s) / .6));
    A(c, [{opacity: 0, transform: 'translateY(0) scale(.5)'}, {opacity: 1, transform: 'translateY(30px) scale(1)', offset: .25}, {opacity: 1, transform: 'translateY(105px)', offset: .85}, {opacity: 0, transform: 'translateY(118px) scaleY(.6)'}], s, .6, {e: 'ease-in', it: n, f: 'none'});
  }
  const pool = div(`left:${418 - 90}px;top:250px;width:180px;height:26px;border-radius:50%;background:radial-gradient(${GOLD},${AMBER}88 60%,transparent 72%)`, el);
  pop(pool, t0 + .5, {from: .3});
  A(pool, [{opacity: 1, transform: 'none'}, {opacity: .35, transform: 'scaleX(.7)'}], tOff + .5, .6);
}

/* battery of months drains, a ? appears */
function monthsBattery(t0, t1, {label = '', tQ} = {}) {
  const el = topBand(t0, t1, 'height:240px');
  const l = div(`left:0;width:840px;top:0;text-align:center;${BOLD};font-size:46px;color:#fff;text-shadow:${SHADOW}`, el, label); pop(l, t0, {from: .7});
  const b = div(`left:220px;top:72px;width:380px;height:160px;border-radius:34px;border:9px solid #fff;padding:12px;box-shadow:0 10px 30px rgba(0,0,0,.4)`, el,
    `<div class="fl" style="width:100%;height:100%;border-radius:18px;background:${OV.green};transform-origin:left"></div><i style="position:absolute;right:-30px;top:44px;width:18px;height:54px;border-radius:0 9px 9px 0;background:#fff;display:block"></i>`);
  pop(b, t0, {from: .6});
  A(b.querySelector('.fl'), [{transform: 'scaleX(1)', background: OV.green}, {transform: 'scaleX(.5)', background: OV.orange, offset: .5}, {transform: 'scaleX(.12)', background: OV.red}], t0 + .3, Math.max(.6, (tQ ?? t0 + 1) - t0), {e: 'ease-in-out'});
  if (tQ != null) { const q = div(`left:650px;top:90px;width:110px;height:110px;border-radius:50%;background:${OV.orange};${BOLD};font-size:76px;line-height:100px;text-align:center;color:#fff;box-shadow:0 0 40px ${OV.orange}`, el, '?');
    pop(q, tQ, {from: .3, rot: -40}); floatY(q, tQ + .4, t1, 10, .7); }
}

/* split-flap counter: the number flips with each word — steps: [[text, t], ...] */
function flipCounter(t0, t1, steps, {unit = ''} = {}) {
  const el = topBand(t0, t1, 'height:270px;display:flex;justify-content:center;align-items:center;gap:30px', `
    <div class="tl" style="position:relative;width:220px;height:250px;border-radius:30px;background:linear-gradient(#2C2C2E 50%,#1C1C1E 50%);box-shadow:0 18px 40px rgba(0,0,0,.5),inset 0 0 0 2px rgba(255,255,255,.12)">
      <div class="nm" style="position:absolute;inset:0;text-align:center;${BOLD};font-size:200px;line-height:236px;color:#fff;transform-origin:50% 50%"></div>
      <i style="position:absolute;left:0;right:0;top:124px;height:3px;background:rgba(0,0,0,.6);display:block"></i></div>
    <div class="un" style="${BOLD};font-size:130px;color:#fff;text-shadow:0 6px 24px rgba(0,0,0,.5)">${unit}</div>`);
  pop(el.querySelector('.tl'), t0, {from: .5}); pop(el.querySelector('.un'), t0 + .1, {from: .5});
  flipText(el.querySelector('.nm'), steps);
  steps.slice(1).forEach(([, t]) => A(el.querySelector('.tl'), [{boxShadow: `0 0 60px ${GOLD}AA,inset 0 0 0 2px ${GOLD}`}, {boxShadow: '0 18px 40px rgba(0,0,0,.5),inset 0 0 0 2px rgba(255,255,255,.12)'}], t, .5, {f: 'none'}));
}

/* a crown drops… and breaks in two */
function crownBreak(t0, t1, {tBreak} = {}) {
  const crown = `<svg width="300" height="200" viewBox="0 0 300 200"><path d="M30 170 L48 56 L104 116 L150 30 L196 116 L252 56 L270 170 Z" fill="${GOLD}" stroke="${AMBER}" stroke-width="6" stroke-linejoin="round"/>
    <rect x="30" y="160" width="240" height="28" rx="8" fill="${AMBER}"/><circle cx="150" cy="30" r="13" fill="#fff"/><circle cx="48" cy="56" r="11" fill="#fff"/><circle cx="252" cy="56" r="11" fill="#fff"/></svg>`;
  const el = topBand(t0, t1, 'height:270px');
  const w = div('left:270px;top:40px;width:300px;height:200px', el);
  const L = div(`left:0;top:0;width:300px;height:200px;clip-path:polygon(0 0,52% 0,46% 35%,55% 60%,47% 100%,0 100%);filter:drop-shadow(0 0 24px ${GOLD}88)`, w, crown);
  const R = div(`left:0;top:0;width:300px;height:200px;clip-path:polygon(52% 0,100% 0,100% 100%,47% 100%,55% 60%,46% 35%);filter:drop-shadow(0 0 24px ${GOLD}88)`, w, crown);
  A(w, [{opacity: 0, transform: 'translateY(-260px)'}, {opacity: 1, transform: 'none', offset: .6}, {transform: 'translateY(-26px)', offset: .8}, {opacity: 1, transform: 'none'}], t0, .5, {e: 'ease-in'});
  A(L, [{transform: 'none', opacity: 1}, {transform: 'translate(-70px,40px) rotate(-24deg)', opacity: .55}], tBreak, .4, {e: SMOOTH});
  A(R, [{transform: 'none', opacity: 1}, {transform: 'translate(70px,40px) rotate(24deg)', opacity: .55}], tBreak, .4, {e: SMOOTH});
  burst(w, 150, 100, tBreak, {n: 12, colors: [GOLD, AMBER], dist: [80, 180], size: [6, 14], round: false, seed: 11});
  const x = div(`left:365px;top:80px;width:110px;height:110px;border-radius:50%;background:${OV.red};display:flex;align-items:center;justify-content:center;box-shadow:0 0 40px ${OV.red}`, el, sym('x', 74, '#fff', 3.4));
  pop(x, tBreak + .12, {from: .2});
}

/* turn word: two halves slam together from both sides, a light sweeps through; small line types below */
function clash(t0, t1, {a = '', b = '', sub = ''} = {}) {
  const el = lower(t0, t1, 'text-align:center');
  const outer = div('position:relative', el), row = div(`position:relative;overflow:hidden;display:flex;justify-content:center;gap:12px;padding:10px 0;${BOLD};font-size:170px;line-height:1.15;color:#fff;text-shadow:0 6px 30px rgba(0,0,0,.55)`, outer);
  const sa = document.createElement('span'), sb = document.createElement('span'); sa.textContent = a; sb.textContent = b; row.append(sa, sb);
  A(sa, [{transform: 'translateX(-700px)'}, {transform: 'none'}], t0, .32, {e: 'cubic-bezier(.5,0,.2,1)'});
  A(sb, [{transform: 'translateX(700px)'}, {transform: 'none'}], t0, .32, {e: 'cubic-bezier(.5,0,.2,1)'});
  shake(outer, t0 + .32, {amp: 12});
  A(row, [{textShadow: '0 0 60px #fff, 0 0 20px #fff'}, {textShadow: '0 6px 30px rgba(0,0,0,.55)'}], t0 + .32, .5, {f: 'none'});
  if (sub) { const s = document.createElement('div'); s.style.cssText = 'position:relative;white-space:nowrap;font-family:RefSans;font-weight:400;font-size:70px;line-height:1.3'; el.appendChild(s); typeIn(s, sub, t0 + .45, .35, '#fff', SHADOW); }
}

/* laptop: screen glowing with work… the lid closes */
function laptopClose(t0, t1, {tClose} = {}) {
  const el = topBand(t0, t1, 'height:275px');
  const wrap = div('left:190px;top:4px;width:460px;height:270px;perspective:900px', el);
  const scr = div(`left:50px;top:0;width:360px;height:232px;border-radius:20px 20px 4px 4px;background:#2C2C2E;padding:12px;transform-origin:50% 100%;box-shadow:0 0 60px ${OV.blue}66`, wrap,
    `<div class="in" style="width:100%;height:100%;border-radius:10px;background:linear-gradient(160deg,#0A84FF,#5E5CE6);padding:22px 24px;overflow:hidden">${[220, 160, 250, 120, 190].map(w => `<div class="ln" style="height:16px;width:${w}px;border-radius:8px;background:rgba(255,255,255,.75);margin-bottom:14px;transform-origin:left"></div>`).join('')}</div>`);
  div(`left:0;top:232px;width:460px;height:30px;border-radius:4px 4px 22px 22px;background:linear-gradient(#E5E5EA,#AEAEB2);box-shadow:0 14px 30px rgba(0,0,0,.45)`, wrap);
  pop(wrap, t0, {from: .7, y: 30});
  scr.querySelectorAll('.ln').forEach((l, i) => loop(l, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)', offset: .6}, {transform: 'scaleX(1)'}], t0 + .2 + i * .12, tClose, .8));
  A(scr.querySelector('.in'), [{filter: 'brightness(1)'}, {filter: 'brightness(.15)'}], tClose, .4);
  A(scr, [{transform: 'rotateX(0deg)', boxShadow: `0 0 60px ${OV.blue}66`}, {transform: 'rotateX(-86deg)', boxShadow: '0 0 0 transparent'}], tClose, .5, {e: 'cubic-bezier(.6,0,.4,1)'});
}

/* the road from "today" to the end: the car drives, the money gauge stays full the whole way */
function roadTrip(t0, t1, {tEnd, from = '', to = '', money = ''} = {}) {
  const el = topBand(t0, t1, 'height:280px');
  const gauge = svg(200, 120, `<path d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="22" stroke-linecap="round"/>
    <path class="arc" d="M20 110 A80 80 0 0 1 180 110" fill="none" stroke="${OV.green}" stroke-width="22" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${OV.green})"/>
    <g class="nd" style="transform-origin:100px 110px"><path d="M100 110 L172 104" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle cx="100" cy="110" r="12" fill="#fff"/></g>`, 'left:20px;top:40px', el);
  pop(gauge, t0, {from: .6}); drawOn(gauge.querySelector('.arc'), t0 + .1, .5);
  const nd = gauge.querySelector('.nd');
  A(nd, [{transform: 'rotate(-170deg)'}, {transform: 'rotate(0deg)'}], t0 + .1, .6, {e: bounce});
  loop(nd, [{transform: 'rotate(0deg)'}, {transform: 'rotate(-3deg)'}, {transform: 'rotate(0deg)'}], t0 + .8, t1, .5);
  const gl = div(`left:20px;top:176px;width:200px;text-align:center;${BOLD};font-size:46px;color:${OV.green};text-shadow:${glow(OV.green)}`, el, money); pop(gl, t0 + .2, {from: .7});
  const road = div(`left:260px;top:186px;width:540px;height:30px;border-radius:15px;background:#3A3A3C;box-shadow:0 8px 20px rgba(0,0,0,.4)`, el,
    `<svg width="540" height="30" style="position:absolute;left:0;top:0"><path class="dl" d="M20 15 H520" stroke="#fff" stroke-width="4" stroke-dasharray="22 18"/></svg>`);
  A(road, [{opacity: 0, transform: 'scaleX(0)'}, {opacity: 1, transform: 'none'}], t0 + .1, .4, {e: SMOOTH}); road.style.transformOrigin = 'left';
  const flag = div('left:740px;top:70px;width:70px;height:120px', el, `<svg width="70" height="120"><rect x="6" y="0" width="7" height="120" rx="3" fill="#fff"/><path class="fg" d="M13 4 H64 L52 24 L64 44 H13 Z" fill="${OV.red}"/></svg>`);
  pop(flag, t0 + .3, {from: .3, y: 40});
  const car = div('left:250px;top:132px;width:96px;height:60px', el, `<svg width="96" height="60" viewBox="0 0 96 60"><path d="M8 40 L14 24 Q18 16 28 16 H60 Q68 16 74 24 L86 32 Q92 34 92 40 V46 H8 Z" fill="#fff"/>
    <path d="M30 22 H48 V32 H24 Z M54 22 H64 L72 32 H54 Z" fill="${OV.blue}"/><circle cx="26" cy="47" r="10" fill="#1C1C1E" stroke="#fff" stroke-width="3"/><circle cx="72" cy="47" r="10" fill="#1C1C1E" stroke="#fff" stroke-width="3"/></svg>`);
  pop(car, t0 + .2, {from: .5});
  A(car, [{translate: '0 0'}, {translate: '420px 0'}], t0 + .45, tEnd - t0 - .45, {e: 'ease-in-out'});
  loop(car, [{transform: 'translateY(0)'}, {transform: 'translateY(-3px)'}, {transform: 'translateY(0)'}], t0 + .7, tEnd, .25);
  A(flag, [{transform: 'scale(1)'}, {transform: 'scale(1.25)'}, {transform: 'scale(1)'}], tEnd, .45, {e: bounce, f: 'none'});
  A(gauge, [{filter: 'drop-shadow(0 0 0 transparent)'}, {filter: `drop-shadow(0 0 30px ${OV.green})`}, {filter: `drop-shadow(0 0 14px ${OV.green})`}], tEnd, .6);
  const lb = (x, txt, al) => { const l = div(`left:${x}px;top:222px;width:240px;text-align:${al};${BOLD};font-size:42px;color:#fff;text-shadow:${SHADOW}`, el, txt); pop(l, t0 + .3, {from: .7}); };
  lb(250, from, 'left'); lb(570, to, 'right');
}

/* payoff: gold word with a shine, coins burst out (downwards and sideways only — never up into the face) */
function richBurst(t0, t1, {word = '', sub = '', tSub} = {}) {
  const el = lower(t0, t1, 'text-align:center');
  const w = div(`position:relative;white-space:nowrap;${BOLD};font-size:180px;line-height:1.15;background:linear-gradient(110deg,${AMBER} 0%,#FFE680 38%,#FFFFFF 50%,#FFE680 62%,${AMBER} 100%);background-size:300% 100%;background-position:100% 0;-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 26px ${AMBER}AA) drop-shadow(0 6px 18px rgba(0,0,0,.5))`, el, word);
  A(w, [{opacity: 0, transform: 'scale(.3)'}, {opacity: 1, transform: 'none'}], t0, .45, {e: bounce});
  A(w, [{backgroundPosition: '100% 0'}, {backgroundPosition: '0% 0'}], t0 + .45, .7, {e: 'ease-in-out'});
  burst(el, 420, 110, t0 + .05, {n: 26, colors: [GOLD, AMBER, '#FFF3B0'], dist: [150, 330], size: [16, 30], up: -130, seed: 5, d: .9});
  if (sub) { const s = div('position:relative;margin-top:6px;white-space:nowrap;font-family:RefSans;font-weight:400;font-size:72px;line-height:1.3', el); typeIn(s, sub, tSub ?? t0 + .4, .4, '#fff', SHADOW); }
}
