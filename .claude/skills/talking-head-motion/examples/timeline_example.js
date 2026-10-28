/* Example timeline — clip: "เริ่มทำไปก่อน" (52 s). Generated chunks + hand-designed scenes. */
scenes([[4.93, 8.58], [8.61, 12.57], [14.0, 15.0], [18.0, 21.97], [26.0, 29.6], [32.0, 32.97], [33.0, 37.97], [39.52, 40.97], [44.29, 46.97], [49.97, 53]]);

/* ===================== A-ROLL TEXT TIMELINE ===================== */
block({t0: 0, t1: 1.98, lines: [[['เวลาเรา', 's', 0.05], ['มีไอเดีย', 'k', 0.47]], [['ที่อยากจะ', 's', 1.0]], [['เริ่มทำธุรกิจ', 'm', 1.36]]]});
keyHit(.47, -19);
block({t0: 2, t1: 4.88, lines: [[['บางทีเราก็', 's', 2.0]], [['คิดว่าแบบ', 'm', 3.0]], [['เฮ้ย!', 'k', 3.75, 170]]]});
keyHit(3.75);
block({t0: 12.6, t1: 13.95, lines: [[['ผมจะบอกว่า', 's', 12.6]], [['สุดท้าย', 'm', 13.0], ['ตรงนั้น...', 's', 13.45]]]});
block({t0: 15, t1: 15.97, lines: [[['แล้วเราก็จะ', 's', 15.0]], [['ไม่ได้เริ่มทำ', 'm', 15.38], ['สักที', 'k', 15.7]]]});
keyHit(15.7, -23);
block({t0: 16, t1: 17.97, lines: [[['คือ', 's', 16.0], ['ไอเดียเจ๋ง ๆ', 'k', 16.15]], [['หลาย ๆ ไอเดีย', 'm', 17.0]]]});
keyHit(16.15);
block({t0: 22, t1: 24.38, lines: [[['มันไม่ได้', 's', 22.0], ['เป็นอย่างนั้น', 'm', 22.26]], [['ตั้งแต่แรก', 'k', 22.63]], [['นึกออกมั้ย?', 's', 23.05]]]});
keyHit(22.63);
block({t0: 24.42, t1: 25.97, top: 1380, lines: [[['ก็คงไม่ได้คิดว่า', 'm', 25.0]]]});
block({t0: 29.62, t1: 31.97, lines: [[['คือผมอยากจะสื่อว่า', 's', 29.62]], [['เรามีไอเดีย', 'm', 31.0], ['อะไร?', 'k', 31.58]]]});
keyHit(31.58);
block({t0: 38, t1: 39.5, lines: [[['ไม่รู้ว่าผมพูด', 's', 38.0], ['งง', 'k', 38.6]], [['หรือเปล่านะทุกคน', 's', 39.0]]]});
keyHit(38.6, -23);
block({t0: 41, t1: 43.6, lines: [[['ผมพูดสด ๆ', 'm', 41.0]], [['ออกมาจากใจ', 'k', 42.21]]]});
keyHit(42.21);
block({t0: 43.63, t1: 44.27, lines: [[['ทุกคน', 's', 43.63]]]});
block({t0: 47, t1: 47.97, lines: [[['ไม่ต้องรอ', 'm', 47.0]], [['ไอเดียเจ๋ง ๆ', 'k', 47.45]]]});
keyHit(47.45);
block({t0: 48, t1: 49.4, lines: [[['บางทีไอเดีย', 's', 48.0]], [['มันก็ผุดออกมา', 'm', 48.46]]]});
block({t0: 49.42, t1: 49.97, lines: [[['อย่างที่บอก', 's', 49.42]]]});

lowerThird('ชื่อ นามสกุล', 'ผู้ก่อตั้งแอปดัง', 24.42, 25.97);   // real person → name card (placeholder name here)

badge('bulb', .4, 1.98); badge('heart', 42.21, 43.6); badge('glass', 47.05, 47.97);

/* camera: a few slow push-ins on the strongest sentences only (user: zoom on every phrase felt too frequent) */
zoom(3.35, 1.06, 1.4); zoom(7.25, 1.0, 1.0);
zoom(22.23, 1.06, 1.4); zoom(26.13, 1.0, 1.0);
zoom(31.18, 1.06, 1.4); zoom(35.08, 1.0, 1.0);
zoom(47.05, 1.06, 1.4);

/* ===================== FULL-SCREEN SCENES ===================== */

/* S1 · ยังไม่เจ๋ง / ล้ำ / ดีพอ — glass "idea review" card, items fail one by one (4.93–8.58) */
{
  const c = scene(4.93, 8.58, {seed: 1});
  const card = div('left:110px;top:430px;width:860px;height:900px;padding:56px 56px', c); card.className = 'glass';
  card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><span class="chip"><span class="dot"></span>ไอเดียของฉัน</span>
    <span style="font-family:BodyFont;font-size:36px;color:rgba(255,255,255,.55)">รีวิว 0/3</span></div>`;
  rise(card, 4.95, .6);
  [['เจ๋งพอ', 5.05], ['ล้ำพอ', 5.9], ['ดีพอ', 7.12]].forEach(([w, t], i) => {
    const row = div(`left:56px;right:56px;top:${190 + i * 220}px;height:180px;border-radius:28px;background:rgba(255,255,255,.04);border:1.5px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:34px;padding:0 34px`, card,
      `<div style="width:96px;height:96px;border-radius:24px;border:3px solid rgba(255,255,255,.5);position:relative;flex:none"><svg width="96" height="96" viewBox="0 0 96 96" style="position:absolute;left:-3px;top:-3px"><path d="M30 30L66 66M66 30L30 66" stroke="${BLUE}" stroke-width="10" stroke-linecap="round" fill="none"/></svg></div>
       <div style="flex:1"><div class="lbl" style="font-family:SmallFont;font-size:46px;color:rgba(255,255,255,.7)">มันยังไม่</div>
       <div style="height:12px;border-radius:6px;background:rgba(255,255,255,.08);margin-top:14px;overflow:hidden"><div class="bar" style="height:100%;width:100%;border-radius:6px;background:linear-gradient(90deg,#4E9BFF,${BLUE});transform-origin:left;transform:scaleX(0)"></div></div></div>`);
    A(row, [{opacity: 0, transform: 'translateX(60px)'}, {opacity: 1, transform: 'none'}], 5.0 + i * .1, .45, {e: SPRING});
    const lab = row.querySelector('.lbl'); const k = kinetic(lab, ' ' + w, 'k', t); k.style.fontSize = '84px'; k.style.marginLeft = '10px';
    // the bar fills toward "enough" then falls short
    A(row.querySelector('.bar'), [{transform: 'scaleX(0)'}, {transform: `scaleX(${[.62, .48, .7][i]})`, offset: .7}, {transform: `scaleX(${[.55, .4, .6][i]})`}], t, .9, {e: SMOOTH});
    draw(row.querySelector('path'), t + .35, .3);
    A(row, [{borderColor: 'rgba(255,255,255,.08)'}, {borderColor: 'rgba(143,211,255,.55)'}], t + .35, .3, {f: 'forwards'});
    sfx('stamp', t + .4, -20, 1 + i * .06);
  });
  const prog = card.firstChild.lastElementChild;
  HOOKS.push(t => { prog.textContent = `รีวิว ${[5.45, 6.3, 7.5].filter(x => t >= x).length}/3`; });
  text(c, 'ยังไม่พอสักข้อ', 'm', 7.9, 'top:1400px', {size: 70});
}

/* S2 · มัวแต่ไปวน / ดีกว่าเดิม ×3 — idea cards stacking in a loop (8.61–12.57) */
{
  const c = scene(8.61, 12.57, {seed: 2, tilt: 6});
  text(c, 'แล้วเราก็', 's', 8.65, 'top:150px');
  text(c, 'มัวแต่ไปวน', 'k', 9.0, 'top:220px', {size: 150});
  // loop ring with travelling light
  const ring = svg(760, 760, `<circle cx="380" cy="380" r="330" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="3"/>
     <circle class="arc" cx="380" cy="380" r="330" fill="none" stroke="url(#lg)" stroke-width="8" stroke-linecap="round" stroke-dasharray="380 1700"/>
     <defs><linearGradient id="lg"><stop offset="0" stop-color="#4E9BFF" stop-opacity="0"/><stop offset="1" stop-color="${BLUE}"/></linearGradient></defs>`, 'left:160px;top:520px', c);
  A(ring, [{opacity: 0, transform: 'scale(.8)'}, {opacity: 1, transform: 'none'}], 8.7, .6, {e: SPRING});
  A(ring.querySelector('.arc'), [{strokeDashoffset: 0}, {strokeDashoffset: -2073}], 8.7, 1.4, {it: 3, e: 'linear', f: 'none'});
  sfx('swell', 9.0, -26);
  // three idea cards — each "better" version slides in front of the last
  [['ไอเดีย v1', 11.0], ['ไอเดีย v2', 11.57], ['ไอเดีย v3', 12.0]].forEach(([n, t], i) => {
    const cd = div(`left:260px;top:${720 - i * 34}px;width:560px;height:360px;padding:40px 44px;transform:translateZ(${i * 40}px)`, c,
      `<span class="chip"><span class="dot"></span>${n}</span>`);
    cd.className = 'glass';
    const lab = div('left:44px;top:170px', cd); const k = kinetic(lab, 'ดีกว่าเดิม', i === 2 ? 'k' : 'm', t + .05); k.style.fontSize = (i === 2 ? 104 : 84) + 'px';
    A(cd, [{opacity: 0, transform: `translate(260px,80px) rotate(8deg) translateZ(${i * 40}px)`, filter: 'blur(12px)'}, {opacity: 1, transform: `translate(${i * 18}px,0) rotate(${(i - 1) * -3}deg) translateZ(${i * 40}px)`, filter: 'blur(0)'}], t, .5, {e: SPRING});
    sfx('softswish', t - .03, -24, 1 + i * .1);
  });
  text(c, 'ใช่ปะ?', 's', 12.3, 'top:1240px');
}

/* S3 · ลูปนรก (14.0–15.0) — black statement with an infinite loop trace */
{
  const c = scene(14.0, 15.0, {seed: 3, tilt: 2});
  const inf = svg(620, 300, `<path d="M310 150c-60-90-240-90-240 0s180 90 240 0 240-90 240 0-180 90-240 0z" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="6"/>
     <path class="tr" d="M310 150c-60-90-240-90-240 0s180 90 240 0 240-90 240 0-180 90-240 0z" fill="none" stroke="${BLUE}" stroke-width="10" stroke-linecap="round" pathLength="1" stroke-dasharray=".22 .78" style="filter:drop-shadow(0 0 12px ${BLUE})"/>`, 'left:230px;top:520px', c);
  A(inf.querySelector('.tr'), [{strokeDashoffset: 0}, {strokeDashoffset: -2}], 14.0, 1.0, {e: 'linear'});
  text(c, 'มันจะกลายเป็น', 's', 14.0, 'top:900px');
  text(c, 'ลูปนรก', 'k', 14.45, 'top:970px', {size: 230});
  bloom(13.95, .5); sfx('swell', 13.3, -22); sfx('sub', 14.0, -12);
}

/* S4 · บริษัทระดับโลก — 3D dot globe (18.0–21.97) */
{
  const c = scene(18.0, 21.97, {seed: 4, tilt: 3});
  const cv = document.createElement('canvas'); cv.width = 900; cv.height = 900; cv.style.cssText = 'position:absolute;left:90px;top:300px;width:900px;height:900px;opacity:0';
  c.appendChild(cv); A(cv, [{opacity: 0, transform: 'scale(.7)'}, {opacity: 1, transform: 'none'}], 18.0, .8, {e: SPRING});
  const ctx = cv.getContext('2d'), pts = [], N = 900;
  for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; pts.push([Math.cos(th) * r, y, Math.sin(th) * r]); }
  const pins = [[.5, .3], [2.1, -.2], [3.6, .5], [4.9, .1], [1.2, -.55]];
  HOOKS.push(t => {
    if (t < 17.9 || t > 22.1) return;
    const a = (t - 18) * .55, R = 380, cx = 450, cy = 450, tilt = .35;
    ctx.clearRect(0, 0, 900, 900);
    const halo = ctx.createRadialGradient(cx, cy, R * .6, cx, cy, R * 1.25); halo.addColorStop(0, 'rgba(78,155,255,.18)'); halo.addColorStop(1, 'rgba(78,155,255,0)');
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(cx, cy, R * 1.25, 0, 7); ctx.fill();
    for (const [x, y, z] of pts) {
      const X = x * Math.cos(a) + z * Math.sin(a), Z0 = -x * Math.sin(a) + z * Math.cos(a);
      const Y = y * Math.cos(tilt) - Z0 * Math.sin(tilt), Z = y * Math.sin(tilt) + Z0 * Math.cos(tilt);
      const d = (Z + 1) / 2; ctx.fillStyle = `rgba(${170 + d * 85},${215 + d * 40},255,${.12 + d * .8})`;
      ctx.beginPath(); ctx.arc(cx + X * R, cy + Y * R, 1.4 + d * 2.6, 0, 7); ctx.fill();
    }
    pins.forEach(([lon, lat], i) => {
      const show = Math.min(1, Math.max(0, (t - 19.0 - i * .15) / .3)); if (!show) return;
      let x = Math.cos(lat) * Math.cos(lon), y = Math.sin(lat), z = Math.cos(lat) * Math.sin(lon);
      const X = x * Math.cos(a) + z * Math.sin(a), Z0 = -x * Math.sin(a) + z * Math.cos(a);
      const Y = y * Math.cos(tilt) - Z0 * Math.sin(tilt), Z = y * Math.sin(tilt) + Z0 * Math.cos(tilt);
      if (Z < -.1) return;
      ctx.fillStyle = `rgba(255,255,255,${show})`; ctx.shadowColor = BLUE; ctx.shadowBlur = 24;
      ctx.beginPath(); ctx.arc(cx + X * R, cy + Y * R, 9 * show, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    });
  });
  text(c, 'ของบริษัท', 'm', 18.0, 'top:1270px');
  text(c, 'ระดับโลก', 'k', 19.0, 'top:1370px', {size: 160});
  const sub = text(c, 'หรือธุรกิจอะไรหลาย ๆ อย่าง', 's', 20.0, 'top:1590px');
  const chip = div('left:0;width:1080px;top:210px;text-align:center;opacity:0', c, '<span class="chip"><span class="dot"></span>GLOBAL</span>'); rise(chip, 18.2, .5, 40);
}

/* S5 · แอปดัง — phone UI with a growth chart (26.0–29.6) */
{
  const c = scene(26.0, 29.6, {seed: 5, tilt: 5});
  const ph = div('left:270px;top:240px;width:540px;height:1080px;border-radius:80px;padding:30px;opacity:0', c); ph.className = 'glass';
  ph.innerHTML = `<div style="width:150px;height:34px;border-radius:20px;background:rgba(0,0,0,.6);margin:0 auto 34px"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:0 16px 24px"><span style="font-family:KeyFont;font-size:54px;color:${BLUE}">แอป</span><span class="dot"></span></div>`;
  A(ph, [{opacity: 0, transform: 'translateY(300px) rotateX(30deg)', filter: 'blur(14px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], 26.0, .65, {e: SPRING});
  for (let i = 0; i < 2; i++) { const f = div(`left:30px;right:30px;top:${190 + i * 150}px;height:120px;border-radius:26px;background:rgba(255,255,255,.06)`, ph); A(f, [{opacity: 0, transform: 'translateY(40px)'}, {opacity: 1, transform: 'none'}], 26.2 + i * .08, .4); }
  const ch = svg(480, 360, `<defs><linearGradient id="ar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${BLUE}" stop-opacity=".45"/><stop offset="1" stop-color="${BLUE}" stop-opacity="0"/></linearGradient></defs>
     <path class="area" d="M10 340 C 160 335, 250 300, 320 220 S 430 40, 470 20 L470 360 L10 360Z" fill="url(#ar)" opacity="0"/>
     <path class="ln" d="M10 340 C 160 335, 250 300, 320 220 S 430 40, 470 20" fill="none" stroke="${BLUE}" stroke-width="8" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${BLUE})"/>
     <circle class="p0" cx="10" cy="340" r="12" fill="#fff" opacity="0"/><circle class="p1" cx="470" cy="20" r="16" fill="#fff" opacity="0" style="filter:drop-shadow(0 0 14px ${BLUE})"/>`, 'left:30px;top:520px', ph);
  draw(ch.querySelector('.ln'), 26.5, 1.0);
  A(ch.querySelector('.area'), [{opacity: 0}, {opacity: 1}], 27.0, .6);
  A(ch.querySelector('.p1'), [{opacity: 0}, {opacity: 1}], 27.4, .2); A(ch.querySelector('.p0'), [{opacity: 0}, {opacity: 1}], 28.0, .2);
  const t1 = div('left:250px;top:470px;opacity:0', ph, '<span class="chip">ทุกวันนี้</span>'); rise(t1, 27.05, .45, 30);
  const t0 = div('left:20px;top:910px;opacity:0', ph, '<span class="chip">ตอนเริ่ม</span>'); rise(t0, 28.05, .45, 30);
  sfx('swell', 26.4, -27);
  const a1 = text(c, 'จะเป็นเหมือน', 's', 26.55, 'top:1400px'), a2 = text(c, 'ทุกวันนี้', 'k', 27.0, 'top:1470px');
  fadeOut(a1, 27.85, .14); fadeOut(a2, 27.85, .14);
  text(c, 'ตอนที่เขาเริ่มทำ', 'm', 28.0, 'top:1400px'); text(c, 'แอปของเขา', 'k', 28.79, 'top:1500px');
}

/* S6 · เริ่มทำไปก่อน — the key line (32.0–32.97) */
{
  const c = scene(32.0, 32.97, {seed: 6, tilt: 2});
  const ring = div(`left:240px;top:560px;width:600px;height:600px;border-radius:50%;border:3px solid rgba(143,211,255,.35);opacity:0`, c);
  A(ring, [{opacity: .9, transform: 'scale(.4)'}, {opacity: 0, transform: 'scale(1.6)'}], 32.15, .8, {e: 'ease-out'});
  text(c, 'เรา', 's', 32.0, 'top:700px');
  text(c, 'เริ่มทำ', 'k', 32.15, 'top:770px', {size: 230});
  text(c, 'ไปก่อน', 'm', 32.55, 'top:1050px', {size: 110});
  bloom(31.95, .55); sfx('swell', 31.3, -22); sfx('sub', 32.0, -12);
}

/* S7 · ไอเดียผุดขึ้นระหว่างทาง — route with milestone nodes and a travelling light (33.0–37.97) */
{
  const c = scene(33.0, 37.97, {seed: 7, tilt: 5});
  text(c, 'บางที', 's', 33.0, 'top:170px');
  text(c, 'ไอเดียเจ๋ง ๆ', 'k', 33.3, 'top:240px');
  text(c, 'มันจะผุดขึ้นมา', 'm', 34.4, 'top:420px');
  const P = 'M80 1380 C 300 1380, 330 1080, 540 1060 S 800 760, 1000 720';
  const route = svg(1080, 1920, `<path d="${P}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="6" stroke-dasharray="2 22" stroke-linecap="round"/>
     <path class="rt" d="${P}" fill="none" stroke="${BLUE}" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${BLUE})"/>`, 'left:0;top:0', c);
  const rt = route.querySelector('.rt'); rt.setAttribute('pathLength', 1); rt.style.strokeDasharray = 1;
  A(rt, [{strokeDashoffset: 1}, {strokeDashoffset: .08}], 33.1, 4.6, {e: 'linear'});
  const head = div(`left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;background:#fff;box-shadow:0 0 30px 8px rgba(143,211,255,.8);offset-path:path('${P}')`, c);
  A(head, [{offsetDistance: '0%'}, {offsetDistance: '92%'}], 33.1, 4.6, {e: 'linear'});
  [[300, 1290, 34.45], [560, 1056, 35.05], [850, 800, 35.75]].forEach(([x, y, t], i) => {
    const n = div(`left:${x - 70}px;top:${y - 230}px;width:140px;height:140px;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0`, c,
      `<svg width="76" height="76" viewBox="0 0 100 100"><path d="${IC.bulb}" fill="none" stroke="${i === 2 ? BLUE : '#fff'}" stroke-width="6" stroke-linecap="round"/></svg>`);
    n.className = 'glass'; n.style.borderRadius = '50%';
    A(n, [{opacity: 0, transform: 'translateY(60px) scale(.5)'}, {opacity: 1, transform: 'none'}], t, .5, {e: SPRING});
    const stem = div(`left:${x - 1}px;top:${y - 90}px;width:2px;height:80px;background:linear-gradient(rgba(143,211,255,.7),transparent);opacity:0`, c); A(stem, [{opacity: 0}, {opacity: 1}], t + .1, .3);
    sfx('softswish', t, -25, 1.2 + i * .1);
  });
  text(c, 'ระหว่างทาง', 'k', 35.75, 'top:1500px', {size: 150});
  text(c, 'ที่เรากำลังทำไป', 's', 36.71, 'top:1700px');
}

/* S8 · ไม่มีสคริปต์ — a script page that never gets written (39.52–40.97) */
{
  const c = scene(39.52, 40.97, {seed: 8, tilt: 5});
  text(c, 'เพราะว่าคลิปนี้', 's', 39.55, 'top:250px');
  const doc = div('left:230px;top:400px;width:620px;height:780px;padding:56px', c); doc.className = 'glass';
  doc.innerHTML = `<span class="chip"><span class="dot"></span>script.txt</span>` +
    [0, 1, 2, 3, 4].map(i => `<div class="ln" style="height:18px;border-radius:9px;background:rgba(255,255,255,.12);margin-top:${i ? 34 : 60}px;width:${[90, 74, 84, 56, 70][i]}%"></div>`).join('');
  rise(doc, 39.55, .5);
  const lines = doc.querySelectorAll('.ln');
  lines.forEach((l, i) => A(l, [{opacity: 1, transform: 'scaleX(1)'}, {opacity: 0, transform: 'scaleX(0)'}], 39.95 + i * .04, .25, {f: 'forwards', e: 'ease-in'}));
  const empty = div('left:0;right:0;top:420px;text-align:center;opacity:0;font-family:BodyFont;font-size:40px;color:rgba(255,255,255,.45)', doc, '— ว่างเปล่า —'); A(empty, [{opacity: 0}, {opacity: 1}], 40.25, .3);
  text(c, 'ไม่มีสคริปต์', 'k', 40.0, 'top:1260px');
  text(c, 'เลยนะ', 's', 40.6, 'top:1450px');
  sfx('stamp', 40.0, -21);
}

/* S9 · เริ่มทำเลย — CTA button pressed, then the word lands (44.29–46.97) */
{
  const c = scene(44.29, 46.97, {seed: 9, tilt: 4});
  text(c, 'ก็...', 's', 44.3, 'top:560px');
  const btn = div('left:170px;top:700px;width:740px;height:220px;border-radius:120px;display:flex;align-items:center;justify-content:center;opacity:0;' +
    `background:linear-gradient(135deg,rgba(143,211,255,.22),rgba(78,155,255,.10));border:2px solid rgba(143,211,255,.7);box-shadow:0 0 60px rgba(143,211,255,.25),inset 0 1px 0 rgba(255,255,255,.3)`, c);
  const lb = kinetic(btn, 'เริ่มทำเลย', 'k', 44.4); lb.style.fontSize = '112px';
  A(btn, [{opacity: 0, transform: 'scale(.7)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], 44.3, .45, {e: SPRING});
  A(btn, [{transform: 'scale(1)'}, {transform: 'scale(.92)'}, {transform: 'scale(1.03)'}, {transform: 'scale(1)'}], 44.66, .4, {f: 'none'});
  cursor(c, [[44.3, 920, 1500], [44.62, 640, 850], [45.3, 640, 850], [45.6, 980, 1600]], [44.64]);
  ripple(c, 650, 870, 44.66); ripple(c, 650, 870, 44.8, 3.4);
  sfx('impact', 44.62, -24);
  const q = text(c, 'อยากทำอะไร?', 'm', 45.44, 'top:1040px');
  fadeOut(btn, 46.25); fadeOut(q, 46.25);
  text(c, 'เริ่มทำ!', 'k', 46.41, 'top:800px', {size: 250});
  bloom(46.4, .3); sfx('thud', 46.42, -23);
}

/* S10 · ending — ผุดออกมาโดยที่เราไม่รู้ตัว (49.97–end) */
{
  const c = scene(49.97, 53, {seed: 10, tilt: 3});
  const b = div('left:420px;top:420px;width:240px;height:240px;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0', c,
    `<svg width="140" height="140" viewBox="0 0 100 100"><path d="${IC.bulb}" fill="none" stroke="${BLUE}" stroke-width="5" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${BLUE})"/></svg>`);
  b.className = 'glass'; b.style.borderRadius = '50%';
  draw(b.querySelector('path'), 50.6, .7); rise(b, 50.5, .6, 60);
  text(c, 'ผุดออกมา', 'm', 50.0, 'top:760px');
  text(c, 'โดยที่เรา', 's', 50.31, 'top:880px');
  text(c, 'ไม่รู้ตัว', 'k', 50.7, 'top:950px', {size: 210});
  bloom(49.9, .45); sfx('swell', 49.3, -22); sfx('sub', 50.0, -12);
}

