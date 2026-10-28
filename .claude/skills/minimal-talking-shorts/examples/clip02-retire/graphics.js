/* example clip 02 — "เกษียณ / รวย" (21 s), made with the current rules (opens on the face) — REFERENCE IDEAS ONLY */
const big = (root, y, text, size = 120, color = NIB) => div(`left:50px;top:${y}px;width:980px;text-align:center;white-space:nowrap;${BOLD};font-size:${size}px;line-height:1.15;color:${color}`, root, text);
const grey = (root, y, text, size = 64) => div(`left:50px;top:${y}px;width:980px;text-align:center;white-space:nowrap;${BOLD};font-size:${size}px;color:${G1}`, root, text);
const coinSvg = (r = 40) => `<svg width="${2 * r}" height="${2 * r}" style="overflow:visible"><circle cx="${r}" cy="${r}" r="${r - 3}" fill="${G3}" ${OUT}/><circle cx="${r}" cy="${r}" r="${r * .62}" fill="none" ${OUT}/><text x="${r}" y="${r + r * .34}" text-anchor="middle" font-family="RefSans" font-weight="700" font-size="${r}" fill="${NIB}">฿</text></svg>`;

/* 2–7 one scene: a person works, coins flow into a wallet ("Active income = เงินเดือน") → the hourglass: time runs out as money */
function sceneIncome(t0, t1, {tSalary, tTime, tSacrifice}) {
  const root = paper(t0, t1);
  const a = phase(root, t0, tTime, {first: true});
  rise(big(a, 380, 'Active income', 120), t0);
  const eq = big(a, 530, '= เงินเดือน', 96, RED); rise(eq, tSalary);
  const p = svgLayer(a, `<rect x="120" y="1330" width="840" height="6" rx="3" fill="${G2}"/>${pic(270, 1330, .95)}`); rise(p, t0 + .1, .4, 40);
  const w = svgLayer(a, `<g filter="url(#sh)"><rect x="620" y="1010" width="300" height="220" rx="40" fill="#fff" ${OUT}/></g>
    <path d="M620 1080 H920" ${OUT}/><rect x="820" y="1110" width="100" height="64" rx="20" fill="${G3}" ${OUT}/><circle cx="852" cy="1142" r="10" fill="${NIB}"/>`); rise(w, t0 + .2, .4, 40);
  for (let i = 0; i < 4; i++) { const c = div('left:0;top:0;width:80px;height:80px;opacity:0', a, coinSvg(40));
    A(c, [{opacity: 0, transform: 'translate(330px,960px) scale(.6)'}, {opacity: 1, transform: 'translate(500px,820px) scale(1)', offset: .5}, {opacity: 1, transform: 'translate(730px,1000px) scale(.8)', offset: .9}, {opacity: 0, transform: 'translate(730px,1040px) scale(.6)'}], t0 + .3 + i * .4, .9, {e: 'ease-in-out', it: Math.max(1, Math.floor((tTime - t0 - .5 - i * .4) / .9) + 1), f: 'none'}); }

  const b = phase(root, tTime, t1, {last: true});
  const hg = svgLayer(b, `<g filter="url(#sh)">
      <path d="M380 560 C380 760 520 790 540 860 C560 790 700 760 700 560 Z M380 1160 C380 960 520 930 540 860 C560 930 700 960 700 1160 Z" fill="#fff" ${OUT} stroke-width="5"/></g>
    <path class="sd" d="M405 600 H675 L540 830 Z" fill="${G2}" style="transform-box:fill-box;transform-origin:50% 100%"/>
    <path class="st" d="M540 862 V1120" stroke="${G1}" stroke-width="5" stroke-dasharray="8 12"/>
    <rect x="350" y="530" width="380" height="36" rx="18" fill="${NIB}"/><rect x="350" y="1154" width="380" height="36" rx="18" fill="${NIB}"/>`);
  rise(hg, tTime, .4, 40);
  A(hg.querySelector('.sd'), [{transform: 'scale(1,1)'}, {transform: 'scale(.3,.08)'}], tTime + .2, t1 - tTime - .4, {e: 'linear'});
  loop(hg.querySelector('.st'), [{strokeDashoffset: 0}, {strokeDashoffset: -40}], tTime + .2, t1, .35);
  [0, 1, 2].forEach(i => { const c = div(`left:${500 + (i % 2 ? 14 : -14)}px;top:${1070 - i * 34}px;width:80px;height:80px`, b, coinSvg(40)); popIn(c, tTime + .6 + i * .55); });
  const lt = grey(b, 640, 'เวลา', 84); lt.style.left = '-250px'; rise(lt, tTime + .2);
  const lm = big(b, 1040, 'เงิน', 90); lm.style.left = '300px'; rise(lm, tTime + .5);
  const s = big(b, 1300, 'เสียสละเวลาไปหามา', 90); rise(s, tSacrifice);
  const ar = svgLayer(b, `<path d="M180 1440 H900" stroke="${RED}" stroke-width="8" stroke-linecap="round" pathLength="1" style="stroke-dasharray:1" class="u"/>`);
  A(ar.querySelector('.u'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], tSacrifice + .2, .4, {e: EASE});
}

/* 9–13 one scene: "อยู่ได้กี่เดือน" (a calendar with a red ?) → 1 ปี · 2 ปี · 3 ปี fill in one by one */
function sceneHowLong(t0, t1, {tYears}) {
  const root = paper(t0, t1);
  const a = phase(root, t0, tYears[0][1], {first: true});
  const cal = svgLayer(a, `<g filter="url(#sh)"><rect x="300" y="560" width="480" height="520" rx="50" fill="#fff" ${OUT}/></g>
    <path d="M300 690 H780" ${OUT}/><rect x="400" y="520" width="24" height="80" rx="12" fill="${NIB}"/><rect x="656" y="520" width="24" height="80" rx="12" fill="${NIB}"/>
    ${Array.from({length: 12}, (_, i) => `<rect x="${350 + (i % 4) * 100}" y="${730 + Math.floor(i / 4) * 105}" width="80" height="80" rx="16" fill="${G3}" ${OUT} stroke-width="2.5"/>`).join('')}`);
  rise(cal, t0, .45, 50);
  redQ(a, 760, 580, t0 + .4, 60);
  rise(big(a, 1200, 'อยู่ได้กี่เดือน', 110), t0 + .15);

  const b = phase(root, tYears[0][1], t1, {last: true});
  svgLayer(b, `<rect x="140" y="1040" width="800" height="6" rx="3" fill="${G2}"/>`);
  tYears.forEach(([lab, t], i) => { const x = 150 + i * 270;
    const blk = div(`left:${x}px;top:${760 - i * 120}px;width:240px;height:${280 + i * 120}px;border-radius:36px 36px 8px 8px;background:${NIB};border:3.5px solid ${NIB};transform-origin:bottom;box-shadow:0 18px 40px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center;${BOLD};font-size:72px;color:#fff`, b, lab);
    A(blk, [{transform: 'scaleY(0)', opacity: 0}, {transform: 'none', opacity: 1}], t, .5, {e: 'cubic-bezier(.3,1.3,.5,1)'}); });
}

/* 17–20 the walk from "วันนี้" to "วันตาย" — the money bar above stays full the whole way */
function sceneLifeline(t0, t1, {tEnd}) {
  const root = paper(t0, t1);
  const bar = svgLayer(root, `<g filter="url(#sh)"><rect x="140" y="560" width="800" height="120" rx="60" fill="#fff" ${OUT}/></g>`); rise(bar, t0, .4, 30);
  const fill = div(`left:156px;top:576px;width:768px;height:88px;border-radius:44px;background:${NIB};transform-origin:left`, root);
  A(fill, [{transform: 'scaleX(0)'}, {transform: 'none'}], t0 + .2, .6, {e: EASE});
  const lm = div(`left:190px;top:580px;${BOLD};font-size:64px;color:#fff`, root, 'เงิน'); rise(lm, t0 + .5);
  svgLayer(root, `<rect x="140" y="1250" width="800" height="8" rx="4" fill="${G2}"/>`);
  const prog = div(`left:140px;top:1250px;width:800px;height:8px;border-radius:4px;background:${NIB};transform-origin:left`, root);
  A(prog, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], t0 + .3, tEnd - t0 - .3, {e: 'linear'});
  const walker = div('left:0;top:0;width:200px;height:400px', root, `<svg width="200" height="400" style="overflow:visible">${pic(100, 400, .78)}</svg>`);
  A(walker, [{transform: 'translate(40px,850px)'}, {transform: 'translate(740px,850px)'}], t0 + .3, tEnd - t0 - .3, {e: 'linear'});
  loop(walker.firstChild, [{transform: 'translateY(0)'}, {transform: 'translateY(-10px)'}, {transform: 'translateY(0)'}], t0 + .3, tEnd, .4);
  const lt = grey(root, 1300, 'วันนี้', 84); lt.style.left = '-250px'; lt.style.color = NIB; rise(lt, t0 + .2);
  const le = grey(root, 1300, 'วันตาย', 84); le.style.left = '340px'; rise(le, t0 + .3);
  A(le, [{color: G1}, {color: RED}], tEnd, .25);
  const dot = div(`left:916px;top:1230px;width:48px;height:48px;border-radius:50%;background:${RED};box-shadow:0 0 30px ${RED}88`, root); popIn(dot, tEnd);
  A(fill, [{boxShadow: '0 0 0 transparent'}, {boxShadow: `0 0 40px ${RED}66`}], tEnd, .3);
}
