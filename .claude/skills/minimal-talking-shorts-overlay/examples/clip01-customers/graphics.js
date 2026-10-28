/* pop-up cards designed for clip 01 ("ลูกค้าทักมาแล้วหายไป", 42 s) — REFERENCE IDEAS ONLY, built from assets/minimal_kit.js +
   assets/overlay_kit.js. Do not copy these into another clip: design each clip's own cards for what it says.
   Every card is 760 × 330 card px unless noted; it sits in the free space above the head (pop() places it). */

/* draw at 1080-px scale inside a card: (x0, y0) of the big drawing lands at (ox, oy) of the card, scaled by s */
const mini = (box, x0, y0, ox, oy, s) => div(`left:${ox - x0 * s}px;top:${oy - y0 * s}px;width:1080px;height:1920px;transform-origin:0 0;transform:scale(${s})`, box);

/* 2–5 "หลายคนคิดว่า… ของเราแพงหรือเปล่า": a person thinks · a price tag rises · red ? */
function cardThink(t0, t1, {tTag, tQ}) {
  const b = pop(t0, t1);
  const p = cv(b, `<rect x="40" y="296" width="680" height="5" rx="2.5" fill="${G2}"/>${pic(150, 296, .56)}`); rise(p, t0 + .05, .4, 30);
  [[232, 112, 9], [266, 80, 13], [310, 52, 17]].forEach(([x, y, r], i) => popIn(cv(b, `<circle cx="${x}" cy="${y}" r="${r}" fill="${G2}"/>`), t0 + .3 + i * .18, .3));
  const tag = cv(b, `<g filter="url(#sh)"><path d="M400 70 H600 L660 130 V250 Q660 270 640 270 H420 Q400 270 400 250 Z" fill="${G3}" ${OUT}/></g>
    <circle cx="612" cy="126" r="13" fill="#fff" ${OUT}/>`); rise(tag, tTag, .4, 30);
  const baht = txt(b, 500, 106, '฿', {size: 120, center: true, w: 200}); rise(baht, tTag + .1, .4, 20);
  redQ(b, 668, 74, tQ, 40);
}

/* 5–9.5 "ลูกค้าอาจจะ… ลังเล / ไม่มั่นใจในตัวสินค้า / ไม่รู้ว่าจะซื้อดีไหม": three rows build; the current one carries the red ? */
function cardReasons(t0, t1, {head, rows}) {   // rows: [[text, t, icon]]
  const b = pop(t0, t1, {h: 340});
  rise(txt(b, 44, 26, head, {size: 40, color: G1}), t0 + .1);
  const icons = {
    hesitate: `${pic(95, 172, .3)}<path d="M54 72 Q40 52 60 38 M136 72 Q150 52 130 38" stroke="${NIB}" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    box: `<path d="M45 80 L95 55 L145 80 L95 105 Z M45 80 V140 L95 165 L145 140 V80 M95 105 V165" fill="${G3}" ${OUT} stroke-width="7"/>`,
    cart: `<path d="M31 70 H51 L69 136 H141 L157 86 H57" fill="none" ${OUT} stroke-width="9"/><circle cx="79" cy="158" r="11" fill="${NIB}"/><circle cx="131" cy="158" r="11" fill="${NIB}"/>`,
  };
  rows.forEach(([text, t, icon], i) => {
    const y = 90 + i * 80;
    const row = div(`left:44px;top:${y}px;width:680px;height:70px`, b, `<svg width="70" height="70" viewBox="0 0 190 190" style="position:absolute;left:0;top:0;overflow:visible"><rect x="6" y="6" width="178" height="178" rx="44" fill="${G3}" ${OUT} stroke-width="7"/>${icons[icon]}</svg>
      <div class="tx" style="position:absolute;left:96px;top:8px;${BOLD};font-size:44px;line-height:1.2;color:${NIB};white-space:nowrap">${text}</div>`);
    rise(row, t, .35, 20);
    const q = redQ(row, 66, 4, t + .15, 17);
    if (i < rows.length - 1) { A(row.querySelector('.tx'), [{color: NIB}, {color: G1}], rows[i + 1][1], .3);
      A(q, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'scale(.4)'}], rows[i + 1][1], .25, {f: 'forwards'}); }
  });
}

/* 11–15 fewer customers → the phone goes quiet → rush: promotion, discount (three beats in one card) */
function cardRush(t0, t1, {tQuiet, tRush, tags}) {
  const b = pop(t0, t1);
  const a = beat(b, t0, tQuiet, {first: true});
  rise(txt(a, 44, 24, 'ลูกค้า', {size: 40, color: G1}), t0);
  const people = [150, 265, 380, 495, 610].map((x, i) => { const p = cv(a, pic(x, 280, .42)); rise(p, t0 + i * .04, .35, 30); return p; });
  people.slice(2).forEach((p, i) => A(p, [{opacity: 1}, {opacity: .12}], t0 + .35 + i * .12, .3));
  cv(a, `<rect x="60" y="280" width="640" height="5" rx="2.5" fill="${G2}"/>`);
  const pill = div(`left:520px;top:30px;width:200px;height:62px;border-radius:31px;background:${RED};display:flex;align-items:center;justify-content:center;${BOLD};font-size:36px;color:#fff`, a, 'น้อยลง');
  popIn(pill, t0 + .45);

  const m = beat(b, tQuiet, tRush);
  const ph = cv(m, `<rect x="150" y="34" width="180" height="262" rx="34" fill="#fff" ${OUT}/><rect x="212" y="48" width="56" height="12" rx="6" fill="${NIB}"/>
    ${[0, 1, 2].map(i => `<rect class="ph" x="172" y="${80 + i * 52}" width="136" height="38" rx="12" fill="${G3}" ${OUT} stroke-width="2.5" stroke-dasharray="6 7"/>`).join('')}
    <g transform="translate(240 250)"><path d="M-22 12 Q-22 -20 0 -22 Q22 -20 22 12 L28 22 H-28 Z" fill="${G3}" ${OUT} stroke-width="3"/></g>`);
  ph.querySelectorAll('.ph').forEach((r, i) => A(r, [{opacity: .9}, {opacity: .15}], tQuiet + .2 + i * .12, .4));
  popIn(div(`left:256px;top:214px;width:24px;height:24px;border-radius:50%;background:${RED}`, m), tQuiet + .3);
  rise(txt(m, 400, 120, 'เงียบ', {size: 96}), tQuiet + .2);

  const c = beat(b, tRush, t1, {last: true});
  tags.forEach(([text, t], i) => { const x = i ? 520 : 240, red = i === tags.length - 1, col = red ? RED : NIB;
    const g = cv(c, `<path d="M${x} 0 V44" stroke="${G1}" stroke-width="3"/>
      <path d="M${x - 70} 96 L${x - 36} 56 H${x + 36} L${x + 70} 96 V196 Q${x + 70} 212 ${x + 54} 212 H${x - 54} Q${x - 70} 212 ${x - 70} 196 Z" fill="${red ? '#FFF1F0' : G3}" stroke="${col}" stroke-width="3.5" stroke-linejoin="round" filter="url(#sh)"/>
      <circle cx="${x}" cy="84" r="9" fill="#fff" stroke="${col}" stroke-width="3.5"/>`);
    A(g, [{opacity: 0, transform: 'translateY(-120px)'}, {opacity: 1, transform: 'none', offset: .7}, {opacity: 1, transform: 'translateY(-6px)', offset: .85}, {opacity: 1, transform: 'none'}], tRush + i * .12, .6, {e: 'ease-out'});
    rise(txt(c, x, 104, red ? '%' : '★', {size: 76, color: col, center: true, w: 140}), tRush + .2 + i * .12);
    rise(txt(c, x, 232, `<span style="font-size:28px;color:${G1}">0${i + 1}</span> ${text}`, {size: 44, color: red ? RED : NIB, center: true, w: 300}), t); });
}

/* 15–19 "สิ่งที่ลูกค้าต้องการ อาจจะไม่ใช่ส่วนลด แต่คือคำตอบที่เขากังวล": ✕ ส่วนลด (struck) → ✓ คำตอบ */
function cardWant(t0, t1, {head, no, tNo, yes, tYes}) {
  const b = pop(t0, t1);
  rise(txt(b, 44, 26, head, {size: 40, color: G1}), t0 + .05);
  const mark = (y, red, check) => `<circle cx="80" cy="${y}" r="34" fill="${red ? RED : NIB}"/><path d="${check ? `M64 ${y + 2} l11 11 l22 -24` : `M67 ${y - 13} l26 26 M93 ${y - 13} l-26 26`}" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const r1 = cv(b, mark(140, true, false)); popIn(r1, tNo);
  const n = txt(b, 140, 104, no, {size: 64}); rise(n, tNo + .05);
  const s = div(`left:-6px;right:-6px;top:50%;height:8px;border-radius:4px;background:${RED};transform-origin:left`, n);   // strike across the word, whatever its width
  A(s, [{transform: 'scaleX(0)'}, {transform: 'none'}], tNo + .45, .3, {e: EASE});
  A(n, [{color: NIB}, {color: G1}], tYes, .3);
  popIn(cv(b, mark(250, false, true)), tYes);
  rise(txt(b, 140, 214, yes, {size: 64}), tYes + .05);
}

/* 21–23 the pay button nobody presses: a black hand comes close… and pulls back; red ? */
function cardPay(t0, t1, {button, tq}) {
  const b = pop(t0, t1);
  const c = cv(b, `<rect x="44" y="40" width="150" height="150" rx="30" fill="${G3}" ${OUT}/>
    <path d="M79 100 L119 80 L159 100 L119 120 Z M79 100 V150 L119 170 L159 150 V100 M119 120 V170" fill="#fff" ${OUT}/>
    <rect x="226" y="62" width="300" height="24" rx="12" fill="${G2}"/><rect x="226" y="108" width="200" height="24" rx="12" fill="${G3}"/><rect x="226" y="150" width="140" height="24" rx="12" fill="${G3}"/>`);
  rise(c, t0, .4, 30);
  const btn = div(`left:44px;top:220px;width:480px;height:80px;border-radius:40px;background:${NIB};display:flex;align-items:center;justify-content:center;${BOLD};font-size:42px;color:#fff`, b, button);
  rise(btn, t0 + .1, .4, 24);
  const h = div('left:0;top:0;width:110px;height:180px', b, `<svg width="110" height="180" viewBox="-70 0 250 330" style="overflow:visible">${HAND}</svg>`);
  A(h, [{transform: 'translate(560px,340px)', offset: 0}, {transform: 'translate(450px,250px)', offset: .42}, {transform: 'translate(458px,258px)', offset: .55}, {transform: 'translate(450px,252px)', offset: .64}, {transform: 'translate(620px,360px)', offset: 1}], t0 + .15, t1 - t0 - .25, {e: 'ease-in-out'});
  redQ(b, 560, 210, tq, 36);
}

/* 23–26.5 and 27.6–31: "บางคน…" — doubts 01 → 02 | 03 (+ "ถ้าเราไม่แก้ข้อสงสัย"); three dots show where we are */
function cardDoubts(t0, t1, {items, total = items.length, done = 0, tail}) {   // items: [[num, text, t, kind]] · text may hold <br>
  const b = pop(t0, t1);
  const ind = div(`left:360px;top:282px;width:120px;display:flex;justify-content:space-between`, b, Array.from({length: total}, (_, k) => `<i style="display:block;width:30px;height:10px;border-radius:5px;background:${k < done ? NIB : G2}"></i>`).join(''));
  rise(ind, t0 + .1);
  const draw = {
    quality: (el, t) => { const m = mini(el, 240, 560, 40, 30, .45);
      rise(svgLayer(m, `${card(240, 560, 600, 600)}<path d="M400 780 L540 710 L680 780 L540 850 Z" fill="#fff" ${OUT}/><path d="M400 780 V950 L540 1020 L680 950 V780 M540 850 V1020" fill="${G3}" ${OUT}/>`), t, .4, 40);
      const g = div('left:0;top:0;width:300px;height:300px', m, `<svg width="300" height="300" style="overflow:visible"><circle cx="110" cy="110" r="96" fill="rgba(255,255,255,.55)" ${OUT} stroke-width="8"/><path d="M180 180 L262 262" stroke="${NIB}" stroke-width="26" stroke-linecap="round"/></svg>`);
      A(g, [{transform: 'translate(560px,620px)'}, {transform: 'translate(420px,760px)'}, {transform: 'translate(470px,700px)'}], t + .1, 1.3, {e: 'ease-in-out'});
      redQ(g, 110, 110, t + .5, 44); },
    scale: (el, t) => { const m = mini(el, 160, 600, 24, 50, .4);
      const g = svgLayer(m, `<path d="M440 1160 Q540 1080 640 1160 Z" fill="${G3}" ${OUT}/><rect x="528" y="640" width="24" height="500" rx="12" fill="${G3}" ${OUT}/><circle cx="540" cy="632" r="26" fill="#fff" ${OUT}/>
        <g class="bm" style="transform-origin:540px 640px"><rect x="230" y="628" width="620" height="24" rx="12" fill="${G3}" ${OUT}/>
          <path d="M250 652 L200 840 M250 652 L300 840 M830 652 L780 840 M830 652 L880 840" ${OUT} fill="none"/>
          <path d="M165 840 H335 Q335 895 250 895 Q165 895 165 840 Z" fill="${G3}" ${OUT}/><path d="M745 840 H915 Q915 895 830 895 Q745 895 745 840 Z" fill="${G3}" ${OUT}/>
          ${[0, 1, 2, 3].map(i => `<ellipse cx="${250 + (i % 2 ? 6 : -4)}" cy="${818 - i * 26}" rx="52" ry="16" fill="${RED}" stroke="#B3201A" stroke-width="3"/>`).join('')}
          <rect x="795" y="780" width="70" height="60" rx="8" fill="#fff" ${OUT}/><path d="M830 780 V840 M795 802 H865" ${OUT} fill="none"/></g>`);
      rise(g, t, .4, 40);
      A(g.querySelector('.bm'), [{transform: 'rotate(0deg)'}, {transform: 'rotate(-12deg)', offset: .65}, {transform: 'rotate(-9deg)'}], t + .35, .8, {e: 'ease-out'}); },
    puzzle: (el, t) => { const m = mini(el, 220, 560, 40, 30, .45);
      rise(svgLayer(m, `${card(220, 560, 640, 600)}<path d="M500 700 H660 Q660 750 700 750 Q740 750 740 800 Q740 850 700 850 Q660 850 660 900 H500 Z" fill="${G3}" ${OUT} stroke-dasharray="10 12"/>`), t, .4, 40);
      const p = div('left:0;top:0;width:260px;height:240px', m, `<svg width="260" height="240" style="overflow:visible">${SHDEF}<path d="M0 0 H150 Q150 50 190 50 Q230 50 230 100 L230 110 Q190 110 190 150 Q190 190 150 190 V200 H0 Z" fill="${RED}" stroke="#B3201A" stroke-width="3.5" stroke-linejoin="round" filter="url(#sh)"/></svg>`);
      A(p, [{transform: 'translate(160px,1250px) rotate(-25deg)'}, {transform: 'translate(500px,700px) rotate(6deg)', offset: .75}, {transform: 'translate(470px,715px) rotate(14deg)'}], t + .2, 1.1, {e: 'ease-in-out'}); },
  };
  items.forEach(([num, text, t, kind], i) => {
    const end = items[i + 1]?.[2] ?? t1;
    const ph = beat(b, t, end, {first: i === 0, last: i === items.length - 1});
    draw[kind](ph, t);
    rise(txt(ph, 360, 40, num, {size: 34, color: G1}), t + .15);
    rise(txt(ph, 360, 86, text, {size: text.length > 24 ? 40 : 46}), t + .25);
    A(ind.children[done + i], [{background: G2}, {background: RED}], t, .25, {f: 'forwards'});
    if (i < items.length - 1) A(ind.children[done + i], [{background: RED}, {background: NIB}], end, .25, {f: 'forwards'});
  });
  if (tail) rise(txt(b, 360, 214, tail[0], {size: 34, color: G1}), tail[1]);
}

/* 33.5–37.5 "เพราะฉะนั้น ถ้าลูกค้าทักมาแล้วหายไป" (the person dissolves) → "สิ่งที่ควรทำอย่างแรก ไม่ใช่การ ลดราคา" (struck in red) */
function cardTherefore(t0, t1, {recall, pre, word, tStrikeIn, tStrike}) {
  const b = pop(t0, t1);
  const a = beat(b, t0, tStrikeIn, {first: true});
  cv(a, `<rect x="60" y="292" width="300" height="5" rx="2.5" fill="${G2}"/>`);
  vanishingPerson(mini(a, 340, 760, 90, 20, .58), 540, 1220, .9, t0 + .1, t0 + 1.1);
  rise(txt(a, 380, 120, recall, {size: 48}), t0 + .2);

  const c = beat(b, tStrikeIn, t1, {last: true});
  rise(txt(c, 380, 46, pre, {size: 38, color: G1, center: true, w: 720}), tStrikeIn + .05);
  const wd = txt(c, 380, 104, word, {size: 130, center: true, w: 720}); rise(wd, tStrikeIn + .2);
  A(wd, [{color: NIB}, {color: RED}], tStrike + .2, .25);
  const s = cv(c, `<path class="s" d="M150 196 Q380 186 610 202" stroke="${RED}" stroke-width="12" stroke-linecap="round" fill="none" pathLength="1" style="stroke-dasharray:1"/>`);
  A(s.querySelector('.s'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], tStrike, .3, {e: EASE});
}

/* 37.5–39.5 "การหาว่าจริง ๆ แล้วเขาติดอะไรอยู่": a magnifier searches the person and finds the red ? */
function cardFind(t0, t1, {label, tFound}) {
  const b = pop(t0, t1);
  rise(cv(b, `<rect x="60" y="296" width="300" height="5" rx="2.5" fill="${G2}"/>${pic(210, 296, .56)}`), t0, .4, 30);
  const g = div('left:0;top:0;width:150px;height:150px', b, `<svg width="150" height="150" style="overflow:visible"><circle cx="55" cy="55" r="46" fill="rgba(255,255,255,.55)" ${OUT} stroke-width="6"/><path d="M90 90 L132 132" stroke="${NIB}" stroke-width="16" stroke-linecap="round"/></svg>`);
  A(g, [{transform: 'translate(300px,170px)'}, {transform: 'translate(110px,200px)', offset: .45}, {transform: 'translate(155px,40px)'}], t0 + .1, tFound - t0 - .1, {e: 'ease-in-out'});
  redQ(b, 210, 95, tFound, 30);
  rise(txt(b, 400, 128, label, {size: 52}), tFound + .05);
}

/* 39.5–42 "แก้ปัญหานั้นให้ถูกจุด": a target; the red dot lands dead centre */
function cardTarget(t0, t1, {tHit}) {
  const b = pop(t0, t1);
  const rings = cv(b, `<circle cx="380" cy="165" r="132" fill="#fff" ${OUT}/><circle cx="380" cy="165" r="92" fill="${G3}" ${OUT}/><circle cx="380" cy="165" r="52" fill="#fff" ${OUT}/>
    <path d="M380 20 V60 M380 270 V310 M235 165 H275 M485 165 H525" ${OUT}/>`);
  rings.style.transformOrigin = '380px 165px'; popIn(rings, t0, .45);
  const d = div(`left:356px;top:141px;width:48px;height:48px;border-radius:50%;background:${RED};box-shadow:0 0 30px ${RED}88`, b);
  A(d, [{opacity: 0, transform: 'translate(260px,-200px) scale(.6)'}, {opacity: 1, transform: 'none', offset: .8}, {opacity: 1, transform: 'scale(1.25)', offset: .9}, {opacity: 1, transform: 'none'}], tHit - .45, .6, {e: 'ease-in'});
}
