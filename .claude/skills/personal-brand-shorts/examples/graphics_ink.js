/* ===================== MINIMAL NIB — the scene look (user's pick: the "steps" scene) =====================
   White paper · black ink line drawings (people, objects, paths — anything) · small grey numbers / labels · bold black Thai ·
   ONE red accent with a soft glow. Every scene is drawn for its own sentence (designed per clip). */
const NIB = '#111111', GREY = '#8E8E93', RED = '#FF3B30', PAPER = '#FFFFFF';
const SW_ = 6;   // ink stroke width
const paper = (t0, t1) => solid(t0, t1, PAPER);
/* draw every path/line/circle with class "d" on, one after another from t over d seconds */
function inkDraw(svgEl, t, d = .5, stagger = .08) {
  [...svgEl.querySelectorAll('.d')].forEach((p, i) => { p.setAttribute('pathLength', 1); p.style.strokeDasharray = 1;
    A(p, [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t + i * stagger, d, {e: 'cubic-bezier(.45,0,.2,1)'}); });
}
const inkSvg = (root, inner, css = 'left:0;top:0', w = 1080, h = 1920) => div(css, root, `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible;display:block" fill="none" stroke="${NIB}" stroke-width="${SW_}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`).firstChild;
const fadeUp = (el, t, d = .35) => A(el, [{opacity: 0, transform: 'translateY(18px)'}, {opacity: 1, transform: 'none'}], t, d, {e: 'cubic-bezier(.2,.8,.2,1)'});
/* small grey number over a bold label (red when it is the point) */
function inkLabel(root, x, y, {num = '', text = '', red = false, t, size = 76, align = 'center', w = 960} = {}) {
  const left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  const el = div(`left:${left}px;top:${y}px;width:${w}px;text-align:${align};white-space:nowrap`, root,
    `${num ? `<div style="${BOLD};font-size:${Math.max(34, size * .5)}px;color:${GREY};margin-bottom:6px">${num}</div>` : ''}<div style="${BOLD};font-size:${size}px;line-height:1.2;color:${red ? RED : NIB}">${text}</div>`);
  fadeUp(el, t); return el;
}
function redDot(root, x, y, t, r = 22) {
  const d = div(`left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${RED};box-shadow:0 0 ${r * 1.4}px ${RED}88`, root);
  A(d, [{opacity: 0, transform: 'scale(0)'}, {opacity: 1, transform: 'scale(1.25)', offset: .6}, {opacity: 1, transform: 'none'}], t, .35); return d;
}
/* a line-drawn person standing at (x, y = feet); parts get classes so scenes can move them */
const person = (x, y, s = 1, col = NIB) => `<g transform="translate(${x} ${y}) scale(${s})" stroke="${col}">
  <circle class="d hd" cx="0" cy="-200" r="32"/><path class="d" d="M-36 -86 V-136 Q-36 -158 -14 -158 H14 Q36 -158 36 -136 V-86 Z"/>
  <path class="d a1" d="M-36 -146 L-58 -96" style="transform-origin:-36px -146px"/><path class="d a2" d="M36 -146 L58 -96" style="transform-origin:36px -146px"/>
  <path class="d l1" d="M-16 -86 L-22 0" style="transform-origin:-16px -86px"/><path class="d l2" d="M16 -86 L22 0" style="transform-origin:16px -86px"/></g>`;
const walk = (svgEl, t0, t1, per = .5) => {   // swing legs and arms while walking
  [['.l1', 18], ['.l2', -18], ['.a1', -14], ['.a2', 14]].forEach(([c, deg]) => svgEl.querySelectorAll(c).forEach(p =>
    A(p, [{transform: `rotate(${deg}deg)`}, {transform: `rotate(${-deg}deg)`}], t0, per / 2, {it: Math.max(1, Math.round((t1 - t0) / (per / 2))), dir: 'alternate', e: 'ease-in-out', f: 'none'})));
};

/* HOOK 0–2: "ลูกค้าทักมา" is there at frame 0; a person walks in, a message bubble pops above them… then they vanish */
function inkHook(t0, t1, {title = '', msg = '', tMsg, gone = '', tGone} = {}) {
  const root = solid(t0 - .05, t1, PAPER);
  const ti = div(`left:0;width:1080px;top:330px;text-align:center;${BOLD};font-size:130px;color:${NIB}`, root, title);
  A(ti, [{transform: 'scale(1.05)'}, {transform: 'none'}], t0, .5, {e: 'ease-out'});
  const g = div('left:0;top:0;width:1080px;height:1920px', root, `<svg width="1080" height="1920" fill="none" stroke="${NIB}" stroke-width="${SW_}" stroke-linecap="round" stroke-linejoin="round" style="overflow:visible">
    <path d="M120 1380 H960" stroke="${GREY}" stroke-width="3"/>${person(0, 1380, 1.25)}</svg>`);
  const fig = g.querySelector('g');
  A(fig, [{transform: 'translate(180px,1380px) scale(1.25)'}, {transform: 'translate(540px,1380px) scale(1.25)'}], t0, tMsg - t0 + .1, {e: 'ease-out'});
  walk(g.firstChild, t0, tMsg + .1, .4);
  const b = div(`left:0;width:1080px;top:780px;text-align:center`, root, `<span style="position:relative;display:inline-block;padding:30px 50px 40px;border:${SW_}px solid ${NIB};border-radius:60px;border-bottom-left-radius:14px;${BOLD};font-size:56px;color:${NIB};background:${PAPER}">${msg}</span>`);
  A(b, [{opacity: 0, transform: 'scale(.5) translateY(60px)'}, {opacity: 1, transform: 'none'}], tMsg, .35, {e: bounce});
  [b, g].forEach(e => A(e, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(10px)'}], tGone, .25, {f: 'forwards'}));
  redDot(root, 540, 1300, tGone + .05, 26);
  const l = div(`left:0;width:1080px;top:1400px;text-align:center;${BOLD};font-size:120px;color:${RED}`, root, gone);
  A(l, [{opacity: 0, transform: 'translateY(30px)'}, {opacity: 1, transform: 'none'}], tGone + .05, .3, {e: bounce});
}

/* turn word: big black word, an ink underline sweeps under it and ends in the red dot */
function inkTurn(t0, t1, word, {arrow = false} = {}) {
  const root = paper(t0, t1);
  const w = div(`left:0;width:1080px;top:${arrow ? 700 : 760}px;text-align:center;white-space:nowrap;${BOLD};font-size:170px;color:${NIB}`, root, word);
  A(w, [{opacity: 0, transform: 'translateY(40px)'}, {opacity: 1, transform: 'none'}], t0, .3, {e: 'cubic-bezier(.2,.8,.2,1)'});
  const s = inkSvg(root, arrow ? `<path class="d" d="M180 1090 H800 Q910 1090 910 990"/><path class="d" d="M870 1030 L910 985 L950 1030"/>` : `<path class="d" d="M140 1030 Q540 1080 900 1010"/>`);
  inkDraw(s, t0 + .15, .4);
  if (!arrow) redDot(root, 900, 1010, t0 + .55);
}

/* ลังเล: a person steps forward… back… forward, head turning — undecided */
function inkHesitate(t0, t1, {head = '', word = ''} = {}) {
  const root = paper(t0, t1);
  inkLabel(root, 540, 420, {text: head, size: 60, t: t0 + .05}).querySelector('div:last-child').style.color = GREY;
  const s = inkSvg(root, `<path d="M200 1240 H880" stroke="${GREY}" stroke-width="3"/>${person(540, 1240, 1.4)}
    <path class="d" d="M380 1290 Q460 1330 540 1290 Q620 1250 700 1290" stroke="${GREY}" stroke-width="3" stroke-dasharray="2 14"/>`);
  inkDraw(s, t0, .35, .04);
  const fig = s.querySelector('g');
  A(fig, [0, -50, 40, -30, 20].map((dx, i, a) => ({transform: `translate(${540 + dx}px,1240px) scale(1.4)`, offset: i / (a.length - 1)})), t0 + .25, t1 - t0 - .35, {e: 'ease-in-out'});
  const hd = s.querySelector('.hd'); hd.style.transformOrigin = '0px -196px';
  A(hd, [{transform: 'translateX(0)'}, {transform: 'translateX(-8px)'}, {transform: 'translateX(8px)'}, {transform: 'translateX(0)'}], t0 + .25, .6, {it: 2, f: 'none'});
  redDot(root, 540, 1360, t0 + .3);
  inkLabel(root, 540, 1410, {text: word, red: true, size: 90, t: t0 + .35});
}

/* ไม่รู้ว่าจะซื้อดีไหม: a person at a fork in the road, a red "?" over the head */
function inkFork(t0, t1, {text = ''} = {}) {
  const root = paper(t0, t1);
  const s = inkSvg(root, `<path class="d" d="M540 1500 V1150"/><path class="d" d="M540 1150 Q540 1000 300 880"/><path class="d" d="M540 1150 Q540 1000 780 880"/>
    ${person(540, 1300, 1.1)}`);
  inkDraw(s, t0, .4, .06);
  [[290, 800], [790, 800]].forEach(([x, y], i) => { const q = div(`left:${x - 30}px;top:${y - 50}px;width:60px;text-align:center;${BOLD};font-size:80px;color:${GREY}`, root, '?'); fadeUp(q, t0 + .35 + i * .1); });
  const q = div(`left:500px;top:930px;width:80px;height:80px;border-radius:50%;background:${RED};box-shadow:0 0 30px ${RED}88;${BOLD};font-size:58px;line-height:74px;text-align:center;color:#fff`, root, '?');
  A(q, [{opacity: 0, transform: 'scale(0)'}, {opacity: 1, transform: 'none'}], t0 + .45, .35, {e: bounce});
  inkLabel(root, 540, 1560, {text, size: 76, t: t0 + .3});
}

/* ลูกค้าน้อยลง: five people in a row, three fade to faint outlines one by one, a red arrow points down */
function inkFewer(t0, t1, {label = ''} = {}) {
  const root = paper(t0, t1);
  const xs = [190, 365, 540, 715, 890];
  const s = inkSvg(root, xs.map(x => person(x, 1180, 1.05)).join(''));
  inkDraw(s, t0, .3, .015);
  [...s.querySelectorAll(':scope > g')].slice(2).reverse().forEach((g, i) => A(g, [{opacity: 1}, {opacity: .12}], t0 + .3 + i * .15, .25));
  const a = inkSvg(root, `<path class="d" d="M540 1260 V1420" stroke="${RED}"/><path class="d" d="M490 1370 L540 1425 L590 1370" stroke="${RED}"/>`);
  inkDraw(a, t0 + .45, .25, .05);
  inkLabel(root, 540, 560, {text: label, size: 90, t: t0 + .1});
}

/* เงียบ: a line-drawn phone, a pulse line on its screen goes flat — nothing comes in */
function inkSilent(t0, t1, {word = '', tFlat} = {}) {
  const root = paper(t0, t1);
  const s = inkSvg(root, `<rect class="d" x="340" y="560" width="400" height="760" rx="60"/><path class="d" d="M500 610 H580"/>
    <path class="pl" d="M380 940 H470 L500 860 L540 1030 L575 900 L600 940 H700" stroke="${RED}" stroke-width="5"/>`);
  inkDraw(s, t0, .35, .05);
  const pl = s.querySelector('.pl'); pl.setAttribute('pathLength', 1); pl.style.strokeDasharray = 1;
  A(pl, [{strokeDashoffset: 1}, {strokeDashoffset: 0, offset: .7}, {strokeDashoffset: 0}], t0, Math.max(.2, tFlat - t0), {e: 'linear'});
  const flat = inkSvg(root, `<path class="d" d="M380 940 H700" stroke="${GREY}" stroke-width="5"/>`);
  flat.style.opacity = 0; A(flat, [{opacity: 0}, {opacity: 1}], tFlat, .05); inkDraw(flat, tFlat, .3);
  A(pl, [{opacity: 1}, {opacity: 0}], tFlat, .05);
  inkLabel(root, 540, 1400, {text: word, red: true, size: 100, t: tFlat + .05});
}

/* ทำโปรโมชั่น · ลดราคา: two tags hang on strings, each swings and gets ticked as it is said */
function inkTags(t0, t1, tags) {   // tags: [[label, t], ...] — the last one is red
  const root = paper(t0, t1);
  tags.forEach(([lab, t], i) => { const x = i ? 720 : 340, red = i === tags.length - 1, c = red ? RED : NIB;
    const s = inkSvg(root, `<path class="d" d="M${x} 360 V600"/><path class="d" d="M${x - 120} 660 L${x - 60} 600 H${x + 60} L${x + 120} 660 V900 Q${x + 120} 930 ${x + 90} 930 H${x - 90} Q${x - 120} 930 ${x - 120} 900 Z" stroke="${c}"/><circle class="d" cx="${x}" cy="650" r="14" stroke="${c}"/>`);
    s.parentNode.style.transformOrigin = `${x}px 360px`;
    inkDraw(s, t0 + i * .15, .35, .05);
    A(s.parentNode, [{transform: 'rotate(8deg)'}, {transform: 'rotate(-5deg)'}, {transform: 'rotate(2deg)'}, {transform: 'none'}], t, .7, {e: 'ease-out'});
    const pct = div(`left:${x - 100}px;top:700px;width:200px;text-align:center;${BOLD};font-size:110px;color:${c}`, root, red ? '%' : '★'); fadeUp(pct, t0 + .2 + i * .15);
    inkLabel(root, x, 990, {num: `0${i + 1}`, text: lab, red, size: 60, t, w: 400});
    const ck = inkSvg(root, `<path class="d" d="M${x - 40} 1150 L${x - 10} 1180 L${x + 50} 1115" stroke="${c}" stroke-width="9"/>`);
    inkDraw(ck, t + .15, .25); });
}

/* ไม่กล้าจ่ายเงิน: an outlined pay button; a line-drawn finger comes close… and pulls back; red ? */
function inkPay(t0, t1, {label = '', tq} = {}) {
  const root = paper(t0, t1);
  const btn = div(`left:240px;top:800px;width:600px;height:170px;border:${SW_}px solid ${NIB};border-radius:85px;display:flex;align-items:center;justify-content:center;${BOLD};font-size:70px;color:${NIB}`, root, label);
  A(btn, [{opacity: 0, transform: 'scale(.9)'}, {opacity: 1, transform: 'none'}], t0, .3);
  const f = inkSvg(root, `<path class="d" d="M0 0 V-150 Q0 -180 26 -180 Q52 -180 52 -150 V-60 Q90 -80 110 -50 Q140 -70 160 -40 Q190 -55 205 -20 V60 Q205 140 120 160 H60 Q20 160 0 120 L-60 30 Q-75 0 -40 -10 Z"/>`, 'left:600px;top:1060px', 300, 300);
  inkDraw(f, t0 + .1, .35, .02);
  A(f.parentNode, [{transform: 'translate(120px,300px)', offset: 0}, {transform: 'translate(0,40px)', offset: .45}, {transform: 'translate(10px,55px)', offset: .6}, {transform: 'translate(0,40px)', offset: .7}, {transform: 'translate(140px,330px)', offset: 1}], t0 + .1, t1 - t0 - .2, {e: 'ease-in-out'});
  const q = div(`left:860px;top:690px;width:100px;height:100px;border-radius:50%;background:${RED};box-shadow:0 0 34px ${RED}88;${BOLD};font-size:72px;line-height:92px;text-align:center;color:#fff`, root, '?');
  A(q, [{opacity: 0, transform: 'scale(0)'}, {opacity: 1, transform: 'none'}], tq, .35, {e: bounce});
}

/* 01 ไม่มั่นใจเรื่องคุณภาพ: a magnifier scans a box, a red ? appears in the lens */
function inkQuality(t0, t1, {num = '', text = '', tq} = {}) {
  const root = paper(t0, t1);
  const s = inkSvg(root, `<path class="d" d="M380 900 L540 820 L700 900 L540 980 Z"/><path class="d" d="M380 900 V1100 L540 1180 L700 1100 V900"/><path class="d" d="M540 980 V1180"/>`);
  inkDraw(s, t0, .35, .05);
  const m = inkSvg(root, `<circle class="d" cx="0" cy="0" r="110"/><path class="d" d="M78 78 L170 170" stroke-width="16"/>`, 'left:0;top:0', 300, 300);
  inkDraw(m, t0 + .1, .3);
  A(m.parentNode, [{transform: 'translate(420px,880px)'}, {transform: 'translate(660px,960px)'}, {transform: 'translate(560px,920px)'}], t0 + .1, t1 - t0 - .2, {e: 'ease-in-out'});
  const q = div(`left:-30px;top:-55px;width:60px;text-align:center;${BOLD};font-size:96px;color:${RED};text-shadow:0 0 20px ${RED}66;opacity:0`, m.parentNode, '?');
  A(q, [{opacity: 0, transform: 'scale(0)'}, {opacity: 1, transform: 'none'}], tq, .3, {e: bounce});
  inkLabel(root, 540, 1320, {num, text, size: 72, t: t0 + .2});
}

/* 02 กลัวซื้อไปแล้วไม่คุ้ม: a scale — money on one pan, the product on the other — tips the wrong way */
function inkScale(t0, t1, {num = '', text = '', tTip} = {}) {
  const root = paper(t0, t1);
  const s = inkSvg(root, `<path class="d" d="M540 1200 V760"/><path class="d" d="M440 1200 H640"/><circle class="d" cx="540" cy="750" r="14"/>`);
  inkDraw(s, t0, .3, .05);
  const beam = inkSvg(root, `<path class="d" d="M300 760 H780"/>
    <path class="d" d="M300 760 L240 940 M300 760 L360 940"/><path class="d" d="M220 940 Q300 990 380 940"/>
    <path class="d" d="M780 760 L720 940 M780 760 L840 940"/><path class="d" d="M700 940 Q780 990 860 940"/>
    <circle class="d" cx="285" cy="905" r="22" stroke="${RED}"/><circle class="d" cx="315" cy="880" r="22" stroke="${RED}"/>
    <rect class="d" x="745" y="870" width="70" height="60" rx="6"/>`);
  beam.parentNode.style.transformOrigin = '540px 760px';
  inkDraw(beam, t0 + .1, .3, .03);
  A(beam.parentNode, [{transform: 'rotate(0deg)'}, {transform: 'rotate(-9deg)', offset: .7}, {transform: 'rotate(-7deg)'}], tTip, .5, {e: 'ease-out'});
  inkLabel(root, 540, 1300, {num, text, size: 72, t: t0 + .2});
}

/* 03 ยังไม่เห็นว่าช่วยแก้ปัญหาตรงไหน: a puzzle piece slides toward its gap… and does not fit */
function inkPuzzle(t0, t1, {num = '', text = '', tMiss} = {}) {
  const root = paper(t0, t1);
  const s = inkSvg(root, `<path class="d" d="M260 700 H820 V1160 H260 Z"/><path class="d" d="M560 820 H680 Q680 870 720 870 Q760 870 760 920 Q760 970 720 970 Q680 970 680 1020 H560 Z" stroke="${GREY}" stroke-dasharray="4 14"/>`);
  inkDraw(s, t0, .35, .05);
  const p = inkSvg(root, `<path class="d" d="M0 0 H100 Q100 40 140 40 Q180 40 180 80 L180 90 Q140 90 140 130 Q140 170 100 170 V200 H0 Z" stroke="${RED}"/>`, 'left:0;top:0', 200, 220);
  inkDraw(p, t0 + .1, .3);
  A(p.parentNode, [{transform: 'translate(280px,820px) rotate(-20deg)'}, {transform: 'translate(545px,820px) rotate(4deg)', offset: .8}, {transform: 'translate(520px,830px) rotate(10deg)'}], t0 + .2, tMiss - t0 - .2 + .3, {e: 'ease-in-out'});
  inkLabel(root, 540, 1260, {num, text, size: 72, t: t0 + .2});
}

/* ไม่ใช่การลดราคา: grey lead-in, big black word, the ink strikes it out and turns red */
function inkStrike(t0, t1, {pre = '', word = '', tStrike} = {}) {
  const root = paper(t0, t1);
  inkLabel(root, 540, 620, {text: pre, size: 64, t: t0 + .05}).querySelector('div:last-child').style.color = GREY;
  const w = div(`left:0;width:1080px;top:780px;text-align:center;${BOLD};font-size:200px;color:${NIB}`, root, word);
  fadeUp(w, t0 + .25);
  A(w, [{color: NIB}, {color: RED}], tStrike + .2, .2);
  const s = inkSvg(root, `<path class="d" d="M170 920 Q540 900 910 930" stroke="${RED}" stroke-width="16"/>`);
  inkDraw(s, tStrike, .3);
}
