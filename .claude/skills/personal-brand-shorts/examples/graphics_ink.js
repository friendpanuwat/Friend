/* scenes designed for clip 01 ("ลูกค้าทักมาแล้วหายไป", 42 s) — REFERENCE IDEAS ONLY, built from assets/minimal_kit.js.
   Do not copy these into another clip: design each clip's own scenes for what it says. */
/* ---------- 0–2 HOOK: "ลูกค้าทักมา" at frame 0 · the customer asks · then dissolves: "แล้วก็หายไป" ---------- */
function sceneHook(t0, t1, {title, msg, tMsg, gone, tGone}) {
  const root = safeStage(solid(t0 - .05, t1, PAPER));
  const ti = label(root, 540, 280, {text: title, size: 130}); A(ti, [{transform: 'scale(1.05)'}, {transform: 'none'}], t0, .5, {e: 'ease-out'});
  svgLayer(root, `<rect x="140" y="1330" width="800" height="6" rx="3" fill="${G2}"/>`);
  vanishingPerson(root, 400, 1330, 1, t0 - .05, tGone);
  const b = div('left:0;top:0;width:1080px;height:1920px', root, `<svg width="1080" height="1920"><path d="M450 770 H910 Q950 770 950 810 V880 Q950 920 910 920 H500 L450 960 V810 Q450 770 490 770 Z" fill="${NIB}"/></svg>
    <div style="position:absolute;left:450px;top:812px;width:500px;text-align:center;${BOLD};font-size:40px;color:#fff;white-space:nowrap">${msg}</div>`);
  b.style.transformOrigin = '470px 950px';
  A(b, [{opacity: 0, transform: 'scale(.4)'}, {opacity: 1, transform: 'none'}], tMsg, .4, {e: bounce});
  A(b, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(8px)'}], tGone, .3, {f: 'forwards'});
  const g = label(root, 540, 1440, {text: gone, size: 120, red: true}); A(g, [{opacity: 0, transform: 'translateY(30px) scale(.9)'}, {opacity: 1, transform: 'none'}], tGone + .1, .4, {e: bounce});
}

/* ---------- 5–9.5: "แต่จริง ๆ แล้ว" → the customer may be… three reasons build up in one card ---------- */
function sceneReasons(t0, t1, {turn, head, rows}) {   // rows: [[text, t, icon]]
  const root = paper(t0, t1);
  const big = label(root, 540, 820, {text: turn, size: 150}); rise(big, t0, .35);
  A(big, [{transform: 'none', opacity: 1}, {transform: 'translateY(-480px) scale(.55)', opacity: 0}], rows[0][1] - .3, .4, {e: EASE, f: 'forwards'});
  const h = label(root, 540, 470, {text: head, size: 64, grey: true}); rise(h, rows[0][1] - .1);
  const c = svgLayer(root, card(110, 620, 860, 760)); rise(c, rows[0][1] - .1, .45, 60);
  const icons = {
    hesitate: x => `${pic(x, 92, .2)}<path d="M${x - 46} 30 Q${x - 60} 10 ${x - 40} -4 M${x + 46} 30 Q${x + 60} 10 ${x + 40} -4" stroke="${NIB}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    box: x => `<path d="M${x - 50} 0 L${x} -25 L${x + 50} 0 L${x} 25 Z M${x - 50} 0 V60 L${x} 85 L${x + 50} 60 V0 M${x} 25 V85" fill="${G3}" ${OUT}/>`,
    cart: x => `<path d="M${x - 64} -10 H${x - 44} L${x - 26} 56 H${x + 46} L${x + 62} 6 H${x - 38}" fill="none" ${OUT} stroke-width="6"/><circle cx="${x - 16}" cy="78" r="10" fill="${NIB}"/><circle cx="${x + 36}" cy="78" r="10" fill="${NIB}"/>`,
  };
  rows.forEach(([text, t, icon], i) => {
    const y = 700 + i * 230;
    const row = div(`left:150px;top:${y}px;width:780px;height:190px`, root, `<svg width="190" height="190" style="position:absolute;left:0;top:0;overflow:visible"><rect x="10" y="10" width="170" height="170" rx="40" fill="${G3}" ${OUT}/><g transform="translate(0 80)">${icons[icon](95)}</g></svg>
      <div class="tx" style="position:absolute;left:230px;top:44px;width:560px;${BOLD};font-size:${text.length > 12 ? 56 : 72}px;line-height:1.2;color:${NIB};white-space:nowrap">${text}</div>`);
    rise(row, t, .4, 30);
    const q = redQ(row, 170, 20, t + .15, 30);
    if (i < rows.length - 1) { A(row.querySelector('.tx'), [{color: NIB}, {color: G1}], rows[i + 1][1], .3); A(q, [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'scale(.4)'}], rows[i + 1][1], .25, {f: 'forwards'}); }
  });
}

/* ---------- 11–15: fewer customers → the phone goes quiet → rush: promotion, discount ---------- */
function sceneRush(t0, t1, {tQuiet, tRush, tags}) {
  const root = paper(t0, t1);
  const a = phase(root, t0, tQuiet, {first: true});
  rise(label(a, 540, 480, {text: 'ลูกค้า', size: 120}), t0);
  const people = [190, 365, 540, 715, 890].map((x, i) => { const p = svgLayer(a, pic(x, 1330, .78)); rise(p, t0 + i * .04, .35, 40); return p; });
  people.slice(2).forEach((p, i) => A(p, [{opacity: 1}, {opacity: .12}], t0 + .35 + i * .14, .3));
  svgLayer(a, `<rect x="100" y="1330" width="880" height="6" rx="3" fill="${G2}"/>`);
  const pill = div(`left:370px;top:1420px;width:340px;height:84px;border-radius:42px;background:${RED};display:flex;align-items:center;justify-content:center;gap:12px;${BOLD};font-size:46px;color:#fff;white-space:nowrap`, a,
    `<svg width="40" height="40" viewBox="0 0 24 24"><path d="M12 4v15M5 12l7 7 7-7" stroke="#fff" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>น้อยลง`);
  popIn(pill, t0 + .5);

  const b = phase(root, tQuiet, tRush);
  const ph = svgLayer(b, `<rect x="320" y="380" width="440" height="880" rx="76" fill="#fff" ${OUT} filter="url(#sh)"/><rect x="490" y="410" width="100" height="26" rx="13" fill="${NIB}"/>
    ${[0, 1, 2].map(i => `<rect class="ph" x="360" y="${500 + i * 120}" width="360" height="96" rx="28" fill="${G3}" ${OUT} stroke-dasharray="8 10"/>`).join('')}
    <g transform="translate(540 1020)"><path d="M-62 34 Q-62 -54 0 -62 Q62 -54 62 34 L80 62 H-80 Z" fill="${G3}" ${OUT}/><path d="M-18 80 Q0 100 18 80" ${OUT} fill="none"/></g>`);
  ph.querySelectorAll('.ph').forEach((r, i) => A(r, [{opacity: .9}, {opacity: .15}], tQuiet + .2 + i * .12, .4));
  const badge = div(`left:584px;top:932px;width:52px;height:52px;border-radius:50%;background:${RED};box-shadow:0 0 24px ${RED}88`, b, `<div style="position:absolute;left:14px;top:23px;width:24px;height:6px;border-radius:3px;background:#fff"></div>`);
  popIn(badge, tQuiet + .3);
  rise(label(b, 540, 1340, {text: 'เงียบ', size: 120, red: true}), tQuiet + .25);

  const c = phase(root, tRush, t1, {last: true});
  tags.forEach(([text, t], i) => { const x = i ? 730 : 350, red = i === tags.length - 1, col = red ? RED : NIB;
    const g = svgLayer(c, `<path d="M${x} 330 V560" stroke="${G1}" stroke-width="3"/>
      <path d="M${x - 130} 640 L${x - 66} 570 H${x + 66} L${x + 130} 640 V930 Q${x + 130} 960 ${x + 100} 960 H${x - 100} Q${x - 130} 960 ${x - 130} 930 Z" fill="${red ? '#FFF1F0' : G3}" stroke="${col}" stroke-width="3.5" stroke-linejoin="round" filter="url(#sh)"/>
      <circle cx="${x}" cy="625" r="15" fill="#fff" stroke="${col}" stroke-width="3.5"/>`);
    g.style.transformOrigin = `${x}px 330px`;
    A(g, [{opacity: 0, transform: 'translateY(-200px) rotate(10deg)'}, {opacity: 1, transform: 'rotate(-6deg)', offset: .6}, {opacity: 1, transform: 'rotate(3deg)', offset: .8}, {opacity: 1, transform: 'none'}], tRush + i * .12, .7, {e: 'ease-out'});
    const sym = div(`left:${x - 100}px;top:700px;width:200px;text-align:center;${BOLD};font-size:120px;color:${col}`, c, red ? '%' : '★'); rise(sym, tRush + .2 + i * .12);
    rise(label(c, x, 1010, {num: `0${i + 1}`, text, red, size: 60, w: 420}), t);
    const ck = div(`left:${x - 40}px;top:1170px;width:80px;height:80px;border-radius:50%;background:${col};display:flex;align-items:center;justify-content:center`, c,
      `<svg width="44" height="44" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    popIn(ck, t + .1); });
}

/* ---------- 21–23: checkout card; the black hand comes close… and pulls back; red ? ---------- */
function scenePay(t0, t1, {button, tq}) {
  const root = paper(t0, t1);
  const c = svgLayer(root, `${card(140, 520, 800, 700)}<rect x="200" y="590" width="200" height="200" rx="30" fill="${G3}" ${OUT}/>
    <path d="M250 650 L300 625 L350 650 L300 675 Z M250 650 V720 L300 745 L350 720 V650 M300 675 V745" fill="#fff" ${OUT}/>
    <rect x="440" y="620" width="320" height="26" rx="13" fill="${G2}"/><rect x="440" y="672" width="220" height="26" rx="13" fill="${G3}"/>
    <path d="M200 860 H880" stroke="${G2}" stroke-width="3"/><rect x="200" y="900" width="260" height="26" rx="13" fill="${G3}"/><rect x="700" y="900" width="180" height="26" rx="13" fill="${G2}"/>`);
  rise(c, t0, .45, 50);
  const btn = div(`left:200px;top:1020px;width:680px;height:140px;border-radius:70px;background:${NIB};display:flex;align-items:center;justify-content:center;${BOLD};font-size:62px;color:#fff`, root, button);
  rise(btn, t0 + .1, .45, 40);
  const h = div('left:0;top:0;width:200px;height:330px', root, `<svg width="200" height="330" viewBox="-70 0 250 330" style="overflow:visible">${HAND}</svg>`);
  A(h, [{transform: 'translate(640px,1560px)', offset: 0}, {transform: 'translate(560px,1130px)', offset: .42}, {transform: 'translate(575px,1150px)', offset: .55}, {transform: 'translate(560px,1135px)', offset: .64}, {transform: 'translate(700px,1600px)', offset: 1}], t0 + .15, t1 - t0 - .25, {e: 'ease-in-out'});
  redQ(root, 890, 1020, tq, 54);
}

/* ---------- 23–30: "บางคน…" — three doubts, 01 → 02 → 03, in one scene; a 3-dot indicator shows where we are ---------- */
function sceneDoubts(t0, t1, {head, items}) {   // items: [[num, text, t, kind]]
  const root = paper(t0, t1);
  rise(label(root, 540, 330, {text: head, size: 72, grey: true}), t0);
  const ind = div(`left:450px;top:1620px;width:180px;display:flex;justify-content:space-between`, root, items.map(() => `<i style="display:block;width:36px;height:12px;border-radius:6px;background:${G2}"></i>`).join(''));
  rise(ind, t0 + .1);
  const draw = {
    quality: (el, t) => { const g = svgLayer(el, `${card(240, 560, 600, 600)}<path d="M400 780 L540 710 L680 780 L540 850 Z" fill="#fff" ${OUT}/><path d="M400 780 V950 L540 1020 L680 950 V780 M540 850 V1020" fill="${G3}" ${OUT}/>`); rise(g, t, .45, 50);
      const m = div('left:0;top:0;width:300px;height:300px', el, `<svg width="300" height="300" style="overflow:visible"><circle cx="110" cy="110" r="96" fill="rgba(255,255,255,.55)" ${OUT} stroke-width="8"/><path d="M180 180 L262 262" stroke="${NIB}" stroke-width="26" stroke-linecap="round"/></svg>`);
      A(m, [{transform: 'translate(560px,620px)'}, {transform: 'translate(420px,760px)'}, {transform: 'translate(470px,700px)'}], t + .1, 1.4, {e: 'ease-in-out'});
      redQ(m, 110, 110, t + .5, 44); },
    scale: (el, t) => { const g = svgLayer(el, `<ellipse cx="540" cy="1170" rx="200" ry="22" fill="#000" opacity=".06"/>
        <path d="M440 1160 Q540 1080 640 1160 Z" fill="${G3}" ${OUT}/><rect x="528" y="640" width="24" height="500" rx="12" fill="${G3}" ${OUT}/><circle cx="540" cy="632" r="26" fill="#fff" ${OUT}/>
        <g class="bm" style="transform-origin:540px 640px"><rect x="230" y="628" width="620" height="24" rx="12" fill="${G3}" ${OUT}/>
          <path d="M250 652 L200 840 M250 652 L300 840 M830 652 L780 840 M830 652 L880 840" ${OUT} fill="none"/>
          <path d="M165 840 H335 Q335 895 250 895 Q165 895 165 840 Z" fill="${G3}" ${OUT}/><path d="M745 840 H915 Q915 895 830 895 Q745 895 745 840 Z" fill="${G3}" ${OUT}/>
          ${[0, 1, 2, 3].map(i => `<ellipse cx="${250 + (i % 2 ? 6 : -4)}" cy="${818 - i * 26}" rx="52" ry="16" fill="${RED}" stroke="#B3201A" stroke-width="3"/>`).join('')}
          <rect x="795" y="780" width="70" height="60" rx="8" fill="#fff" ${OUT}/><path d="M830 780 V840 M795 802 H865" ${OUT} fill="none"/></g>`);
      rise(g, t, .45, 50);
      A(g.querySelector('.bm'), [{transform: 'rotate(0deg)'}, {transform: 'rotate(-12deg)', offset: .65}, {transform: 'rotate(-9deg)'}], t + .4, .8, {e: 'ease-out'}); },
    puzzle: (el, t) => { const g = svgLayer(el, `${card(220, 560, 640, 600)}<path d="M500 700 H660 Q660 750 700 750 Q740 750 740 800 Q740 850 700 850 Q660 850 660 900 H500 Z" fill="${G3}" ${OUT} stroke-dasharray="10 12"/>`); rise(g, t, .45, 50);
      const p = div('left:0;top:0;width:260px;height:240px', el, `<svg width="260" height="240" style="overflow:visible">${SHDEF}<path d="M0 0 H150 Q150 50 190 50 Q230 50 230 100 L230 110 Q190 110 190 150 Q190 190 150 190 V200 H0 Z" fill="${RED}" stroke="#B3201A" stroke-width="3.5" stroke-linejoin="round" filter="url(#sh)"/></svg>`);
      A(p, [{transform: 'translate(160px,1250px) rotate(-25deg)'}, {transform: 'translate(500px,700px) rotate(6deg)', offset: .75}, {transform: 'translate(470px,715px) rotate(14deg)'}], t + .2, 1.1, {e: 'ease-in-out'}); },
  };
  items.forEach(([num, text, t, kind], i) => {
    const end = items[i + 1]?.[2] ?? t1;
    const ph = phase(root, t, end, {first: i === 0, last: i === items.length - 1});
    draw[kind](ph, t);
    rise(label(ph, 540, 1300, {num, text, size: text.length > 22 ? 58 : 76}), t + .2);
    A(ind.children[i], [{background: G2}, {background: RED}], t, .25, {f: 'forwards'});
    if (i < items.length - 1) A(ind.children[i], [{background: RED}, {background: NIB}], end, .25, {f: 'forwards'});
  });
}

/* ---------- 33.5–37.5: "เพราะฉะนั้น" → "ถ้าลูกค้าทักมาแล้วหายไป" (the vanishing customer again) → not a discount ---------- */
function sceneTherefore(t0, t1, {turn, recall, tRecall, pre, word, tStrikeIn, tStrike}) {
  const root = paper(t0, t1);
  const a = phase(root, t0, tRecall, {first: true});
  const w = label(a, 540, 820, {text: turn, size: 150}); rise(w, t0, .35);
  const u = svgLayer(a, `<path class="u" d="M220 1050 H860" stroke="${RED}" stroke-width="10" stroke-linecap="round" pathLength="1" style="stroke-dasharray:1"/>`);
  A(u.querySelector('.u'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t0 + .2, .4, {e: EASE});

  const b = phase(root, tRecall, tStrikeIn);
  svgLayer(b, `<rect x="240" y="1220" width="600" height="6" rx="3" fill="${G2}"/>`);
  vanishingPerson(b, 540, 1220, .9, tRecall, tRecall + .55);
  rise(label(b, 540, 420, {text: recall, size: 76}), tRecall + .05);

  const c = phase(root, tStrikeIn, t1, {last: true});
  rise(label(c, 540, 620, {text: pre, size: 64, grey: true}), tStrikeIn + .05);
  const wd = label(c, 540, 760, {text: word, size: 210}); rise(wd, tStrikeIn + .2);
  A(wd.lastChild, [{color: NIB}, {color: RED}], tStrike + .2, .25);
  const s = svgLayer(c, `<path class="s" d="M170 905 Q540 885 910 915" stroke="${RED}" stroke-width="16" stroke-linecap="round" fill="none" pathLength="1" style="stroke-dasharray:1"/>`);
  A(s.querySelector('.s'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], tStrike, .3, {e: EASE});
}
