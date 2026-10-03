/* "Day 1 — หาเงินซื้อรถ BMW M4 ผ่านการปักตะกร้า TikTok" (100.8 s)
   User requests: graphics scenes sit on the ORIGINAL clip (blurred) instead of the navy/aurora background,
   no colour grading on the footage, text = white + light green, graphics may be multi-colour, varied pro SFX. */

/* ---------- no colour grading: show the footage as shot ---------- */
document.getElementById('v').style.filter = 'none';
['tone', 'vig', 'grain'].forEach(id => document.getElementById(id).style.display = 'none');

/* ---------- graphic palette (graphics only — all text stays white / light green) ---------- */
const GOLD = '#FFC94D', CORAL = '#FF7A8A', CYAN = '#5FE3F0', VIOLET = '#B28CFF', ORANGE = '#FF9D4D';
const chipH = (txt, col = BLUE) => `<span class="chip"><span class="dot" style="background:${col};box-shadow:0 0 14px ${col}"></span>${txt}</span>`;
const glass = (css, parent, html = '') => { const d = div(css, parent, html); d.className = 'glass'; return d; };
const icon = (path, col, size = 120, sw = 6) => `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><path d="${path}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 10px ${col}88)"/></svg>`;
function counter(el, t0, t1, to, fmt) {
  HOOKS.push(t => { const p = Math.min(1, Math.max(0, (t - t0) / (t1 - t0))); el.textContent = fmt(to * (1 - Math.pow(1 - p, 3))); });
}
const num = v => Math.round(v).toLocaleString('en-US');

IC.clock = 'M86 50a36 36 0 1 1-72 0a36 36 0 1 1 72 0zM50 28v24l15 10';
IC.phone = 'M36 10h28a7 7 0 0 1 7 7v66a7 7 0 0 1-7 7H36a7 7 0 0 1-7-7V17a7 7 0 0 1 7-7zM44 80h12';
IC.target = 'M82 50a32 32 0 1 1-64 0a32 32 0 1 1 64 0zM64 50a14 14 0 1 1-28 0a14 14 0 1 1 28 0zM50 8v18M50 74v18M8 50h18M74 50h18';
IC.basket = 'M14 40h72l-9 44H23zM34 40l12-24M66 40L54 16M40 56v14M60 56v14';
IC.box = 'M50 12l34 16v44L50 88 16 72V28zM16 28l34 16 34-16M50 44v44';
IC.person = 'M64 32a14 14 0 1 1-28 0a14 14 0 1 1 28 0zM24 86c0-16 12-28 26-28s26 12 26 28';
IC.mousse = 'M38 36h24v50a4 4 0 0 1-4 4H42a4 4 0 0 1-4-4zM44 36V24h12v12M56 26h14l4 6M50 50v26';
IC.check = 'M24 52l18 18 34-38';

/* ---------- scene on the blurred original clip (replaces the navy + aurora background) ---------- */
function sceneV(t0, t1, {tilt = 4, seed = 0, dim = .42, snd = 'whoosh'} = {}) {
  const root = div('inset:0;background:#000;opacity:0;overflow:hidden', S);
  const cv = document.createElement('canvas'); cv.width = 270; cv.height = 480;
  cv.style.cssText = 'position:absolute;left:-60px;top:-107px;width:1200px;height:2134px;filter:blur(14px)';
  root.appendChild(cv);
  const cx = cv.getContext('2d'), VID = document.getElementById('v');
  HOOKS.push(t => { if (t < t0 - .1 || t > t1 + .05) return; cx.filter = 'blur(6px)'; cx.drawImage(VID, 0, 0, 270, 480); });
  A(cv, [{transform: `scale(1) translateX(${seed % 2 ? -12 : 12}px)`}, {transform: 'scale(1.06) translateX(0)'}], t0, t1 - t0, {e: 'linear'});
  div(`inset:0;background:rgba(0,0,0,${dim})`, root);          // legibility scrim over the blurred footage
  const stage = div('inset:0;perspective:1600px', root);
  const cam = div('inset:0;transform-style:preserve-3d;transform-origin:50% 50%', stage);
  A(root, [{opacity: 0, filter: 'blur(22px)', transform: 'scale(1.08)'}, {opacity: 1, filter: 'blur(0)', transform: 'scale(1)'}], t0 - .04, .34, {e: SMOOTH});
  A(cam, [{transform: `rotateX(${tilt}deg) rotateY(${-tilt}deg) translateZ(-60px)`}, {transform: `rotateX(${-tilt * .4}deg) rotateY(${tilt * .5}deg) translateZ(0)`}], t0, t1 - t0, {e: INOUT});
  A(root, [{opacity: 1, filter: 'blur(0)', transform: 'scale(1)'}, {opacity: 0, filter: 'blur(18px)', transform: 'scale(.95)'}], t1 - .2, .2, {e: 'cubic-bezier(.5,0,.9,.5)', f: 'forwards'});
  sfx(snd, t0 - .1, -19);
  return cam;
}

scenes([[2.0, 5.74], [8.35, 12.27], [25.28, 29.28], [31.0, 33.27], [37.0, 42.5], [47.37, 53.9],
        [57.85, 60.2], [72.4, 74.98], [77.0, 81.6], [89.5, 91.98], [94.0, 97.98], [98.98, 101.5]]);

/* ===================== A-ROLL TEXT ===================== */
block({t0: .37, t1: 1.98, lines: [[['นี่คือ', 's', .37], ['วันแรก', 'k', .58]], [['ของการหาเงิน', 'm', 1.0]]]});
keyHit(.58, -20); zoom(.58, 1.05, .6); zoom(1.95, 1.0, .3);

block({t0: 5.76, t1: 8.33, lines: [[['โอเค', 's', 5.76], ['สรุปก่อนนะ', 'm', 6.01]], [['คือ', 's', 7.01], ['เดือนที่แล้ว', 'k', 7.2, 120]]]});
keyHit(7.2, -22); zoom(7.2, 1.05, .7);

block({t0: 12.29, t1: 16.05, lines: [[['จากการทำงาน', 's', 12.29]], [['วันละประมาณ', 'm', 13.08]], [['ครึ่งชั่วโมง', 'k', 14.0]]]});
keyHit(14.0); zoom(12.4, 1.0, .1); zoom(14.0, 1.08, .12); zoom(15.9, 1.0, .35);
block({t0: 16.07, t1: 19.14, lines: [[['ด้วยโทรศัพท์', 'm', 16.07]], [['เครื่องเดียว', 'k', 16.4, 120]], [['แล้วก็คอมพิวเตอร์ข้างหลังนี้', 's', 16.85]]]});
keyHit(16.4, -22);
badge('clock', 13.08, 16.05); badge('phone', 16.07, 18.6);

block({t0: 19.16, t1: 20.98, lines: [[['ใช้', 's', 19.16], ['AI ช่วย', 'k', 19.35]], [['แต่ถ่ายคลิป', 'm', 20.18], ['ปกตินะ', 's', 20.7]]]});
keyHit(19.35); zoom(19.35, 1.06, .5); zoom(20.95, 1.0, .35);

block({t0: 21.0, t1: 22.98, lines: [[['บทเรียน', 'm', 21.78]], [['ที่ผมได้', 's', 22.3]]]});
block({t0: 23.0, t1: 25.26, lines: [[['แล้ว', 's', 23.0], ['Road map', 'k', 23.15]], [['ที่ผมวาง ก็คือ...', 's', 23.62]]]});
keyHit(23.15); zoom(23.15, 1.07, .14); zoom(25.2, 1.0, .3);

block({t0: 29.3, t1: 30.98, lines: [[['ตกเฉลี่ยแล้ว', 's', 29.3]], [['ค่าคอม', 'm', 30.0], ['เฉลี่ยต่อชิ้น', 'k', 30.46, 110]]]});
keyHit(30.46, -22);

block({t0: 33.29, t1: 35.98, lines: [[['คราวนี้', 's', 33.29]], [['วิธีการที่เราจะ', 'm', 34.3]], [['สเกล', 'k', 34.8, 170], ['ขึ้นไป', 'm', 35.2]]]});
keyHit(34.8); zoom(34.8, 1.09, .12); zoom(35.95, 1.0, .35);
block({t0: 36.0, t1: 36.98, lines: [[['การวางแผน', 'm', 36.0]], [['ของผมก็คือ', 's', 36.47]]]});

block({t0: 42.54, t1: 47.35, lines: [[['เพราะปกติ', 's', 42.54]], [['ค่าคอมผม', 'm', 44.06], ['ต่อชิ้น', 'k', 44.6, 120]], [['อยู่ที่ประมาณ...', 's', 45.1]]]});
keyHit(44.6, -22); zoom(44.6, 1.05, .8); zoom(47.3, 1.0, .3);

block({t0: 53.94, t1: 56.98, lines: [[['ถ้าหาตัว', 's', 53.94], ['พวกนี้ได้', 'm', 55.22]], [['ก็จะ', 's', 56.19], ['ง่ายขึ้น', 'k', 56.35]]]});
keyHit(56.35); zoom(56.35, 1.07, .14); zoom(56.98, 1.0, .3);
block({t0: 57.0, t1: 57.83, lines: [[['ซึ่งจริง ๆ', 's', 57.0]], [['ผมมีแล้ว', 'm', 57.2]]]});

block({t0: 60.22, t1: 63.98, lines: [[['ตัวนี้เตรียม', 's', 61.0]], [['น่าจะเป็น', 's', 62.0], ['ตัวทำเงิน', 'k', 62.5]], [['ของเดือนนี้', 'm', 63.0]]]});
keyHit(62.5); zoom(62.5, 1.08, .12); zoom(63.95, 1.0, .35);
block({t0: 64.0, t1: 65.45, lines: [[['ได้ค่อนข้างดี', 'm', 64.0]]]});
lowerThird('Kalodata', 'เครื่องมือหาสินค้า TikTok Shop', 65.47, 66.98, {top: 1300});
block({t0: 67.0, t1: 70.26, lines: [[['ผมมีสินค้า', 'm', 67.0]], [['ในใจแล้ว', 'k', 67.42]], [['ประมาณนึงเลย', 's', 68.0]]]});
keyHit(67.42, -22);
block({t0: 70.28, t1: 72.36, lines: [[['จากที่ไล่ ๆ', 's', 70.28], ['คัดมา', 'k', 70.95]]]});
keyHit(70.95, -23);

block({t0: 75.0, t1: 76.98, lines: [[['เดี๋ยว', 's', 75.0], ['ลองเทส', 'k', 75.5], ['ดู', 's', 75.85]]]});
keyHit(75.5); zoom(75.5, 1.06, .5); zoom(76.95, 1.0, .3);

block({t0: 81.63, t1: 84.36, lines: [[['ทีนี้', 's', 81.63]], [['Cosmic', 'k', 82.95]]]});
keyHit(82.95); zoom(82.95, 1.07, .14); zoom(84.3, 1.0, .35);
block({t0: 84.38, t1: 85.98, lines: [[['อันนี้ผม', 's', 84.38], ['จะลองดู', 'm', 85.09]]]});
block({t0: 86.0, t1: 87.98, lines: [[['ผมมี', 's', 86.0], ['มุม', 'k', 86.35, 150]], [['ในการเล่นอยู่', 'm', 87.37]]]});
keyHit(86.35); badge('target', 86.0, 87.98);
block({t0: 88.0, t1: 89.48, lines: [[['เดี๋ยวลองเทส', 'm', 88.0]], [['ดูว่าจะมาไหม', 's', 88.5]]]});

block({t0: 92.0, t1: 93.98, lines: [[['แล้วก็', 's', 92.0]], [['อีกอันนึง', 'm', 92.46]]]});
block({t0: 98.38, t1: 98.96, lines: [[['แต่เดี๋ยวเรา', 's', 98.38]], [['จะลองดูว่า', 'm', 98.6]]]});

/* ===================== FULL-SCREEN SCENES ===================== */

/* S1 · ไปซื้อรถ BMW M4 ผ่านการปักตะกร้า TikTok (2.0–5.74) — line-drawn coupe drives in */
{
  const c = sceneV(2.0, 5.74, {seed: 1, tilt: 3, snd: 'whoosh_long'});
  const d1 = div('left:0;width:1080px;top:215px;text-align:center;opacity:0', c, chipH('DAY 1', BLUE)); rise(d1, 2.05, .5, 40);
  text(c, 'ไปซื้อรถ', 's', 2.0, 'top:310px');
  text(c, 'BMW M4', 'k', 3.0, 'top:380px', {size: 170});
  const car = svg(800, 320, `
     <defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="${CYAN}"/><stop offset="1" stop-color="${BLUE}"/></linearGradient></defs>
     <path class="sp" d="M-120 150H60M-180 200H20M-90 250H40" stroke="${CYAN}" stroke-width="5" stroke-linecap="round" opacity=".6"/>
     <path class="b" d="M70 262H44l6-44q22-34 120-46l132-58q72-30 168-26l116 10q64 8 124 60l50 16q30 12 28 48l-4 40H662" fill="none" stroke="url(#cg)" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" style="filter:drop-shadow(0 0 12px ${BLUE})"/>
     <path class="b" d="M548 262H252" fill="none" stroke="url(#cg)" stroke-width="9" stroke-linecap="round"/>
     <path class="b" d="M318 168l52-48q40-14 92-14l92 6q38 6 66 56z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="6" stroke-linejoin="round"/>
     <circle class="b" cx="200" cy="262" r="50" fill="none" stroke="#fff" stroke-width="9"/><circle cx="200" cy="262" r="18" fill="${BLUE}"/>
     <circle class="b" cx="606" cy="262" r="50" fill="none" stroke="#fff" stroke-width="9"/><circle cx="606" cy="262" r="18" fill="${BLUE}"/>`, 'left:140px;top:640px', c);
  car.querySelectorAll('.b').forEach((p, i) => draw(p, 2.15 + i * .08, .8));
  A(car, [{opacity: 0, transform: 'translateX(-260px)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], 2.1, .9, {e: SMOOTH});
  A(car.querySelector('.sp'), [{opacity: .7, transform: 'translateX(0)'}, {opacity: 0, transform: 'translateX(-160px)'}], 2.1, 1.1, {f: 'forwards'});
  const road = div(`left:120px;top:960px;width:840px;height:4px;border-radius:2px;background:linear-gradient(90deg,transparent,${CYAN},${BLUE},transparent);transform-origin:left`, c);
  A(road, [{transform: 'scaleX(0)', opacity: 0}, {transform: 'scaleX(1)', opacity: .8}], 2.2, .7);
  sfx('thud', 3.0, -23);
  text(c, 'ผ่านการ', 's', 3.46, 'top:1070px');
  const row = div('left:0;width:1080px;top:1150px;display:flex;justify-content:center;align-items:center;gap:22px;perspective:900px', c);
  const ic = div('position:relative;width:120px;height:120px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex:none', row, icon(IC.basket, CORAL, 76));
  ic.className = 'glass'; ic.style.position = 'relative'; ic.style.borderRadius = '50%';
  A(ic, [{opacity: 0, transform: 'scale(.5)'}, {opacity: 1, transform: 'none'}], 3.95, .45, {e: SPRING});
  kinetic(row, 'ปักตะกร้า', 'm', 4.0); kinetic(row, 'TikTok', 'k', 4.6, {}).style.fontSize = '110px';
  sfx('softswish', 4.55, -22);
}

/* S2 · ค่าคอมเดือนที่แล้ว ≈ 50,000 บาท (8.35–12.27) — counter card */
{
  const c = sceneV(8.35, 12.27, {seed: 2, tilt: 4});
  text(c, 'ผมได้ค่าคอม', 'm', 8.35, 'top:250px');
  text(c, 'จากการปักตะกร้า', 's', 9.3, 'top:370px');
  const card = glass('left:110px;top:540px;width:860px;height:640px;padding:50px 56px', c, chipH('ค่าคอมเดือนที่แล้ว', GOLD));
  rise(card, 8.45, .6);
  const ring = div(`left:230px;top:150px;width:400px;height:400px;border-radius:50%;border:3px solid ${GOLD};opacity:0;box-shadow:0 0 50px ${GOLD}55,inset 0 0 40px ${GOLD}33`, card);
  A(ring, [{opacity: 0, transform: 'scale(.6)'}, {opacity: .55, transform: 'scale(1)'}], 9.9, .6, {e: SPRING});
  const lab = div('left:0;right:0;top:190px;text-align:center', card); kinetic(lab, 'ทั้งหมดประมาณ', 's', 10.0);
  const n = div('left:0;right:0;top:270px;text-align:center;font-family:KeyFont;font-size:150px;line-height:1.1;color:#fff;opacity:0', card, '0');
  A(n, [{opacity: 0, transform: 'translateY(30px)'}, {opacity: 1, transform: 'none'}], 10.55, .3);
  counter(n, 10.6, 11.15, 50000, v => '≈' + num(v));
  A(n, [{color: '#FFFFFF', textShadow: '0 0 0 transparent'}, {color: BLUE, textShadow: `0 0 40px ${BLUE}`}], 11.15, .35, {f: 'forwards'});
  A(n, [{transform: 'scale(1)'}, {transform: 'scale(1.08)'}, {transform: 'scale(1)'}], 11.15, .35, {f: 'none'});
  const baht = div('left:0;right:0;top:450px;text-align:center;opacity:0', card); kinetic(baht, 'บาท', 'm', 11.2);
  for (let i = 0; i < 3; i++) { const r = div(`left:330px;top:250px;width:200px;height:200px;border-radius:50%;border:3px solid ${GOLD};opacity:0`, card); A(r, [{opacity: .8, transform: 'scale(.5)'}, {opacity: 0, transform: 'scale(2.4)'}], 11.15 + i * .1, .7, {f: 'none'}); }
  sfx('riser', 9.95, -27); sfx('impact', 11.12, -24);
}

/* S3 · 58 คลิป → ≈ 50,000 (25.28–29.28) — clip tiles fill a grid */
{
  const c = sceneV(25.28, 29.28, {seed: 3, tilt: 4, snd: 'swipe'});
  text(c, 'จากเดิมผมลงไป', 's', 25.3, 'top:190px');
  const hd = div('left:0;width:1080px;top:270px;text-align:center;display:flex;justify-content:center;align-items:baseline;gap:20px', c);
  const n = div('position:relative;font-family:KeyFont;font-size:170px;line-height:1.1;color:#fff;opacity:0', hd, '0');
  A(n, [{opacity: 0}, {opacity: 1}], 25.5, .2);
  counter(n, 25.55, 26.5, 58, v => num(v));
  A(n, [{color: '#FFFFFF'}, {color: BLUE}], 26.5, .3, {f: 'forwards'});
  const cl = div('position:relative', hd); kinetic(cl, 'คลิป', 'm', 26.0);
  const cols = [CYAN, VIOLET, CORAL, ORANGE, BLUE];
  for (let i = 0; i < 58; i++) {
    const x = 147 + (i % 10) * 80, y = 540 + Math.floor(i / 10) * 118, col = cols[(i * 7) % 5];
    const tl = div(`left:${x}px;top:${y}px;width:66px;height:104px;border-radius:12px;background:linear-gradient(160deg,${col}66,${col}1a);border:1.5px solid ${col}aa;opacity:0`, c,
      `<svg width="66" height="104" viewBox="0 0 66 104"><path d="M27 42l14 10-14 10z" fill="#fff" opacity=".8"/></svg>`);
    A(tl, [{opacity: 0, transform: 'translateY(30px) scale(.6)'}, {opacity: 1, transform: 'none'}], 25.55 + i * .016, .3, {e: SPRING});
  }
  sfx('riser', 25.4, -29); sfx('thud', 26.5, -23);
  text(c, 'แล้วได้ค่าคอมมาประมาณ', 's', 27.0, 'top:1290px');
  const v = text(c, '50,000 บาท', 'k', 28.57, 'top:1370px', {size: 130});
  const gl = div(`left:240px;top:1400px;width:600px;height:150px;border-radius:50%;background:radial-gradient(${GOLD}55,transparent 70%);opacity:0;filter:blur(20px)`, c);
  A(gl, [{opacity: 0}, {opacity: 1}], 28.6, .4);
  c.appendChild(v);
  sfx('sub', 28.55, -16); sfx('softswish', 28.5, -22);
}

/* S4 · ค่าคอมเฉลี่ย Overall ≈ 12% (31.0–33.27) — donut ring */
{
  const c = sceneV(31.0, 33.27, {seed: 4, tilt: 3});
  const ch = div('left:0;width:1080px;top:250px;text-align:center;opacity:0', c, chipH('Overall', CYAN)); rise(ch, 31.05, .45, 40);
  text(c, 'ค่าคอมเฉลี่ยต่อชิ้น', 'm', 31.05, 'top:350px', {size: 80});
  const R = 260, L = 2 * Math.PI * R;
  const ring = svg(640, 640, `
     <defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${CYAN}"/><stop offset="1" stop-color="${BLUE}"/></linearGradient></defs>
     <circle cx="320" cy="320" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="44"/>
     <circle class="arc" cx="320" cy="320" r="${R}" fill="none" stroke="url(#dg)" stroke-width="44" stroke-linecap="round" transform="rotate(-90 320 320)" stroke-dasharray="0 ${L}" style="filter:drop-shadow(0 0 16px ${CYAN})"/>`, 'left:220px;top:560px', c);
  A(ring, [{opacity: 0, transform: 'scale(.75)'}, {opacity: 1, transform: 'none'}], 31.1, .55, {e: SPRING});
  A(ring.querySelector('.arc'), [{strokeDasharray: `0 ${L}`}, {strokeDasharray: `${L * .12} ${L}`}], 31.65, .6, {e: SMOOTH});
  const n = div('left:220px;width:640px;top:790px;text-align:center;font-family:KeyFont;font-size:170px;line-height:1.1;color:#fff;opacity:0', c, '0%');
  A(n, [{opacity: 0}, {opacity: 1}], 31.6, .2);
  counter(n, 31.65, 32.25, 12, v => '≈' + Math.round(v) + '%');
  A(n, [{color: '#FFFFFF', textShadow: '0 0 0 transparent'}, {color: BLUE, textShadow: `0 0 40px ${BLUE}`}], 32.25, .35, {f: 'forwards'});
  sfx('swipe', 31.62, -23); sfx('thud', 32.25, -22);
}

/* S5 · หาสินค้าราคาสูงขึ้น → ค่าคอมต่อชิ้นเยอะขึ้น (37.0–42.5) — two rising columns */
{
  const c = sceneV(37.0, 42.5, {seed: 5, tilt: 5});
  const a1 = text(c, 'จะต้องหาสินค้า', 'm', 37.0, 'top:200px'), a2 = text(c, 'ที่ราคาสูงขึ้น', 'k', 38.0, 'top:310px', {size: 120});
  fadeOut(a1, 40.2, .16); fadeOut(a2, 40.2, .16);
  text(c, 'แน่นอนว่าค่าคอมต่อชิ้น', 'm', 40.37, 'top:200px', {size: 80});
  text(c, 'ต้องเยอะขึ้น', 'k', 41.72, 'top:310px', {size: 120});
  const card = glass('left:110px;top:540px;width:860px;height:880px', c); rise(card, 37.05, .6);
  div('left:60px;right:60px;top:700px;height:2px;background:rgba(255,255,255,.2)', card);
  [[CYAN, VIOLET, 'ราคาสินค้า', 39.12], [GOLD, ORANGE, 'ค่าคอม/ชิ้น', 41.72]].forEach(([c1, c2, lb, t], i) => {
    const x = 120 + i * 380;
    const ghost = div(`left:${x}px;top:${700 - 160}px;width:240px;height:160px;border-radius:22px 22px 0 0;border:2px dashed rgba(255,255,255,.35);opacity:0`, card);
    A(ghost, [{opacity: 0}, {opacity: 1}], 37.4 + i * .15, .4);
    const bar = div(`left:${x}px;top:${700 - 520}px;width:240px;height:520px;border-radius:22px 22px 0 0;background:linear-gradient(${c1},${c2});transform-origin:bottom;box-shadow:0 0 40px ${c1}66`, card);
    A(bar, [{transform: 'scaleY(0)'}, {transform: 'scaleY(.31)', offset: .15}, {transform: 'scaleY(1)'}], t - .3, .9, {e: SMOOTH});
    const ar = div(`left:${x + 70}px;top:${700 - 640}px;opacity:0`, card, icon('M50 86V18M24 42l26-26 26 26', '#fff', 100, 9));
    A(ar, [{opacity: 0, transform: 'translateY(40px)'}, {opacity: 1, transform: 'none'}], t + .35, .4, {e: SPRING});
    const ch = div(`left:${x - 30}px;width:300px;top:730px;text-align:center;opacity:0`, card, chipH(lb, c1)); rise(ch, 37.5 + i * .15, .45, 30);
    sfx('swell', t - .55, -26, 1 + i * .12);
  });
  sfx('thud', 41.75, -23);
}

/* S6 · ตอนนี้ 15–20 บาท vs ที่ต้องหา 80–100 บาท (47.37–53.9) — honest-scale comparison */
{
  const c = sceneV(47.37, 53.9, {seed: 6, tilt: 4, snd: 'whoosh_long'});
  text(c, 'ค่าคอมต่อชิ้น', 'm', 47.4, 'top:200px');
  const cards = [[90, 'ตอนนี้', CORAL, 47.45], [560, 'ที่ต้องหา', GOLD, 50.5]].map(([x, lb, col, t]) => {
    const cd = glass(`left:${x}px;top:380px;width:430px;height:900px`, c, `<div style="position:absolute;left:0;right:0;top:40px;text-align:center">${chipH(lb, col)}</div>`);
    rise(cd, t, .55); return cd;
  });
  // bars share one scale: 17.5 → 90 baht midpoints
  const mk = (cd, h, c1, c2, t) => { const b = div(`left:115px;top:${820 - h}px;width:200px;height:${h}px;border-radius:20px 20px 0 0;background:linear-gradient(${c1},${c2});transform-origin:bottom;box-shadow:0 0 40px ${c1}55`, cd);
    A(b, [{transform: 'scaleY(0)'}, {transform: 'scaleY(1)'}], t, .7, {e: SMOOTH}); div('left:40px;right:40px;top:820px;height:2px;background:rgba(255,255,255,.25)', cd); };
  mk(cards[0], 90, CORAL, ORANGE, 47.9);
  mk(cards[1], 460, GOLD, BLUE, 52.48);
  const v0 = div('left:0;right:0;top:560px;text-align:center', cards[0]); kinetic(v0, '15–20', 'k', 47.9).style.fontSize = '96px';
  const b0 = div('left:0;right:0;top:665px;text-align:center', cards[0]); kinetic(b0, 'บาท', 's', 48.3);
  const cap = div('left:0;right:0;top:150px;text-align:center;opacity:0', cards[0], `<span class="chip" style="border-color:${CORAL};background:${CORAL}22">ไม่เกินนี้</span>`);
  A(cap, [{opacity: 0, transform: 'scale(1.4)', filter: 'blur(8px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], 49.0, .3, {e: SPRING});
  sfx('stamp', 49.02, -21);
  text(c, 'อาจจะต้องหาค่าคอม', 's', 50.97, 'top:1330px');
  const v1 = div('left:0;right:0;top:150px;text-align:center', cards[1]); kinetic(v1, '80–100', 'k', 52.48).style.fontSize = '96px';
  const b1 = div('left:0;right:0;top:255px;text-align:center', cards[1]); kinetic(b1, 'บาท/ชิ้น', 's', 52.8);
  sfx('riser', 51.35, -28); sfx('impact', 52.45, -24);
}

/* S7 · ผมมีอยู่ 2 ตัว (57.85–60.2) — two product boxes get checked */
{
  const c = sceneV(57.85, 60.2, {seed: 7, tilt: 4, snd: 'swipe'});
  text(c, 'ผมมีอยู่', 's', 57.85, 'top:260px');
  text(c, '2 ตัว', 'k', 58.3, 'top:330px', {size: 200});
  [[150, CYAN, 'ตัวที่ 1'], [570, VIOLET, 'ตัวที่ 2']].forEach(([x, col, lb], i) => {
    const t = 58.4 + i * .22;
    const cd = glass(`left:${x}px;top:700px;width:360px;height:480px`, c,
      `<div style="position:absolute;left:0;right:0;top:70px;display:flex;justify-content:center">${icon(IC.box, col, 170, 5)}</div>
       <div style="position:absolute;left:0;right:0;top:300px;text-align:center">${chipH(lb, col)}</div>`);
    A(cd, [{opacity: 0, transform: 'translateY(120px) rotateX(20deg)', filter: 'blur(12px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t, .55, {e: SPRING});
    const ck = div(`left:${x + 270}px;top:650px;width:120px;height:120px;border-radius:50%;background:${BLUE};display:flex;align-items:center;justify-content:center;opacity:0;box-shadow:0 0 30px ${BLUE}`, c,
      `<svg width="80" height="80" viewBox="0 0 100 100"><path d="${IC.check}" fill="none" stroke="#0b2a17" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    A(ck, [{opacity: 0, transform: 'scale(1.6)'}, {opacity: 1, transform: 'none'}], t + .5, .3, {e: SPRING});
    draw(ck.querySelector('path'), t + .55, .3);
    sfx('stamp', t + .5, -22, 1 + i * .08);
  });
}

/* S8 · ในตลาด Beauty ผมเล็งไว้ 3 ตัว (72.4–74.98) — three reticles lock on */
{
  const c = sceneV(72.4, 74.98, {seed: 8, tilt: 3});
  text(c, 'ในตลาด', 's', 72.66, 'top:250px');
  text(c, 'Beauty', 'k', 72.95, 'top:320px', {size: 170});
  const cols = [CORAL, VIOLET, CYAN];
  [0, 1, 2].forEach(i => {
    const x = 105 + i * 300, t = 73.72 + i * .2;
    const cd = glass(`left:${x}px;top:720px;width:270px;height:360px`, c, `<div style="position:absolute;left:0;right:0;top:110px;display:flex;justify-content:center">${icon(IC.box, 'rgba(255,255,255,.75)', 130, 5)}</div>`);
    A(cd, [{opacity: 0, transform: 'translateY(80px)', filter: 'blur(10px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], 72.9 + i * .1, .5, {e: SPRING});
    const rt = div(`left:${x - 15}px;top:705px;width:300px;height:390px;opacity:0`, c,
      `<svg width="300" height="390" viewBox="0 0 300 390" fill="none" stroke="${cols[i]}" stroke-width="8" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${cols[i]})">
         <path d="M8 70V8h62M230 8h62v62M292 320v62h-62M70 382H8v-62"/></svg>`);
    A(rt, [{opacity: 0, transform: 'scale(1.35) rotate(8deg)'}, {opacity: 1, transform: 'none'}], t, .32, {e: SPRING});
    sfx('tick', t + .2, -24, 1 + i * .1);
  });
  text(c, 'เล็งไว้อยู่ 3 ตัว', 'm', 73.72, 'top:1180px');
}

/* S9 · แบรนด์ D-Prao — ผู้หญิงขายกันเยอะ เงินเยอะมาก (77.0–81.6) */
{
  const c = sceneV(77.0, 81.6, {seed: 9, tilt: 5, snd: 'whoosh_long'});
  text(c, 'แบรนด์', 's', 77.49, 'top:210px');
  text(c, 'D-Prao', 'k', 77.75, 'top:280px', {size: 160});
  const card = glass('left:140px;top:560px;width:800px;height:620px', c,
    `<div style="position:absolute;left:44px;top:40px">${chipH('สินค้าตัวที่ 1', CORAL)}</div>`);
  rise(card, 77.5, .6);
  div('left:60px;right:60px;top:540px;height:2px;background:rgba(255,255,255,.2)', card);
  [.25, .38, .5, .7, 1].forEach((h, i) => {
    const b = div(`left:${90 + i * 130}px;top:${540 - 340 * h}px;width:90px;height:${340 * h}px;border-radius:16px 16px 0 0;background:linear-gradient(${i === 4 ? GOLD : CORAL},${i === 4 ? ORANGE : VIOLET});transform-origin:bottom;opacity:.92`, card);
    A(b, [{transform: 'scaleY(0)'}, {transform: 'scaleY(1)'}], 79.87 + i * .08, .55, {e: SPRING});
  });
  const ln = svg(800, 620, `<path d="M135 ${540 - 85 - 30} L265 ${540 - 129 - 30} L395 ${540 - 170 - 30} L525 ${540 - 238 - 30} L655 ${540 - 340 - 30}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" style="filter:drop-shadow(0 0 8px ${GOLD})"/>`, 'left:0;top:0', card);
  draw(ln.querySelector('path'), 80.1, .6);
  text(c, 'ผู้หญิงขายกันเยอะ ๆ', 'm', 79.0, 'top:1240px', {size: 80});
  text(c, 'เงินเยอะมาก', 'k', 80.45, 'top:1350px', {size: 140});
  sfx('swell', 79.3, -26); sfx('sub', 80.45, -16); bloom(80.45, .3);
}

/* S10 · Cosmic มูสกำจัดขน (89.5–91.98) */
{
  const c = sceneV(89.5, 91.98, {seed: 10, tilt: 4, snd: 'swipe'});
  text(c, 'Cosmic', 'k', 89.5, 'top:240px', {size: 170});
  const card = glass('left:290px;top:520px;width:500px;height:640px', c,
    `<div style="position:absolute;left:0;right:0;top:40px;text-align:center">${chipH('สินค้าตัวที่ 2', VIOLET)}</div>
     <div style="position:absolute;left:0;right:0;top:150px;display:flex;justify-content:center">${icon(IC.mousse, VIOLET, 360, 3.5)}</div>`);
  rise(card, 89.55, .6);
  draw(card.querySelector('svg path'), 89.7, .9);
  for (let i = 0; i < 6; i++) { const b = div(`left:${200 + (i * 53) % 110}px;top:${200 - i * 18}px;width:${16 + (i % 3) * 8}px;height:${16 + (i % 3) * 8}px;border-radius:50%;border:2px solid ${CYAN};opacity:0`, card);
    A(b, [{opacity: 0, transform: 'translateY(30px) scale(.4)'}, {opacity: .8, offset: .4}, {opacity: 0, transform: `translateY(-90px) scale(1)`}], 90.0 + i * .15, 1.2, {f: 'none', e: 'ease-out'}); }
  text(c, 'ที่เป็น', 's', 90.0, 'top:1210px');
  text(c, 'มูสกำจัดขน', 'k', 90.99, 'top:1290px', {size: 130});
  sfx('softswish', 90.95, -21);
}

/* S11 · Mediclair — Target ผู้ชาย (94.0–97.98) */
{
  const c = sceneV(94.0, 97.98, {seed: 11, tilt: 4});
  text(c, 'Mediclair', 'k', 94.05, 'top:230px', {size: 160});
  const card = glass('left:190px;top:520px;width:700px;height:640px', c,
    `<div style="position:absolute;left:0;right:0;top:40px;text-align:center">${chipH('สินค้าตัวที่ 3', CYAN)}</div>
     <div style="position:absolute;left:0;right:0;top:170px;display:flex;justify-content:center">${icon(IC.person, '#fff', 300, 4)}</div>`);
  rise(card, 94.05, .6);
  const rt = div('left:310px;top:640px;opacity:0', c, icon(IC.target, CYAN, 460, 2.5));
  A(rt, [{opacity: 0, transform: 'scale(1.5) rotate(-30deg)'}, {opacity: 1, transform: 'none'}], 95.95, .5, {e: SPRING});
  A(rt.firstChild, [{transform: 'rotate(0)'}, {transform: 'rotate(90deg)'}], 96.4, 1.5, {e: INOUT, f: 'forwards'});
  sfx('swell', 95.4, -26); sfx('tick', 96.4, -23);
  text(c, 'Target จริง ๆ', 's', 95.95, 'top:1210px');
  text(c, 'ก็จะมีผู้ชาย', 'k', 96.5, 'top:1290px', {size: 130});
}

/* S12 · ending — จะลุยอะไรกับมันได้อีก (98.98–end) — Day 1 bookend with the car outline */
{
  const c = sceneV(98.98, 101.5, {seed: 12, tilt: 3, dim: .5});
  const car = svg(560, 230, `
     <path class="b" d="M49 184H31l4-31q15-24 84-32l92-41q50-21 118-18l81 7q45 6 87 42l35 11q21 8 20 34l-3 28H463" fill="none" stroke="${BLUE}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round" style="filter:drop-shadow(0 0 10px ${BLUE})"/>
     <path class="b" d="M384 184H176" fill="none" stroke="${BLUE}" stroke-width="7" stroke-linecap="round"/>
     <circle class="b" cx="140" cy="184" r="35" fill="none" stroke="#fff" stroke-width="7"/><circle class="b" cx="424" cy="184" r="35" fill="none" stroke="#fff" stroke-width="7"/>`, 'left:260px;top:330px', c);
  car.querySelectorAll('.b').forEach((p, i) => draw(p, 99.0 + i * .06, .7));
  const ch = div('left:0;width:1080px;top:600px;text-align:center;opacity:0', c, chipH('DAY 1', BLUE)); rise(ch, 99.05, .45, 30);
  const pb = div('left:290px;top:700px;width:500px;height:10px;border-radius:5px;background:rgba(255,255,255,.14);overflow:hidden', c,
    `<div style="height:100%;width:100%;border-radius:5px;background:linear-gradient(90deg,${CYAN},${BLUE});transform-origin:left;transform:scaleX(0)"></div>`);
  A(pb.firstChild, [{transform: 'scaleX(0)'}, {transform: 'scaleX(.06)'}], 99.3, .6, {f: 'forwards'});
  text(c, 'จะลุยอะไร', 'm', 99.0, 'top:820px', {size: 110});
  text(c, 'กับมันได้อีก', 'k', 99.43, 'top:960px', {size: 170});
  bloom(99.4, .35); sfx('swell', 98.6, -23); sfx('sub', 99.43, -13);
}
