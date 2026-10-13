ICONS['plus'] = '<path d="M5 12h14"/><path d="M12 5v14"/>';
/* ลูกค้าใหม่แพงกว่าลูกค้าเก่า 5 เท่า — 8-slide carousel, 1080×1080, monochrome dark mode (#000000 + #FFFFFF only).
   Text is the user's own copy, split into slides as given. Times are slide-local seconds. */

document.head.insertAdjacentHTML('beforeend', `<style>
.hl{padding:.16em .18em .2em}
.hl,.para mark,.num span,.row .bul span{color:#000}
.row{align-items:flex-start}
.row .bul{margin-top:-6px}
.row .bul svg{stroke:#000}
.sub{display:block;font-family:"Lead";font-size:33px;line-height:1.4;color:rgba(255,255,255,.66);margin-top:4px}
.sub b{font-family:"CardSans";font-weight:normal;color:#fff}
</style>`);

/* black backdrop: one faint white glow + dot grid (no colour) */
function dark(s, seed = 0) {
  const g = div(`left:${seed % 2 ? 300 : -320}px;top:${seed % 2 ? -380 : 360}px;width:1100px;height:1100px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.075),transparent 62%)`, s);
  if (s.t1) A(g, [{transform: 'translate(0,0)'}, {transform: `translate(${seed % 2 ? -140 : 160}px,${seed % 2 ? 140 : -160}px)`}], 0, s.t1, {e: 'linear', idle: true});
  div('inset:0;background-image:radial-gradient(rgba(255,255,255,.08) 1.6px,transparent 1.8px);background-size:54px 54px;-webkit-mask-image:radial-gradient(ellipse 72% 60% at 50% 48%,#000,transparent 85%)', s);
}
/* panel with centred icon + label */
function card(s, css, t, icon, html, {style = 'glass', size = 34, radius = 36} = {}) {
  const p = panel(s, css, t, {style, radius});
  const fg = style === 'white' ? '#000' : '#fff';
  div(`inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:0 20px;text-align:center;font-family:CardSans;font-size:${size}px;line-height:1.3;color:${fg}`, p,
    (icon ? ico(icon, 60, fg, 2) : '') + `<div>${html}</div>`);
  return p;
}
const glyph = (s, name, t, css, size = 46) => { const e = div(css + ';opacity:0', s, ico(name, size, '#fff', 2.6)); popIn(e, t, {from: 'scale(0)'}); return e; };
const rule = (s, t, css) => { const l = div(css + ';height:3px;border-radius:2px;background:rgba(255,255,255,.3)', s); A(l, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], t, .4, {e: SMOOTH}); return l; };

/* ---------- 1 · Hook ---------- */
slide({bg: 'black', dur: 3.4}, s => {
  dark(s, 0);
  tile(s, 'user-plus', .10, 'left:250px;top:160px', {size: 140, bg: 'glass'});
  tile(s, 'banknote', .28, 'left:440px;top:130px', {size: 200, bg: '#fff', color: '#000'});
  tile(s, 'trending-down', .46, 'left:690px;top:160px', {size: 140, bg: 'glass'});
  txt(s, [[['ลูกค้าใหม่แพงกว่าลูกค้าเก่า', 'm', .40, {size: 68}]], [['5 เท่า', 'k', .75, {size: 200}]],
    [['และนี่คือเหตุผลที่ยอดขายโต', 'l', 1.15, {size: 46}]], [['แต่กำไร', 'l', 1.30, {size: 46}], ['ไม่โตตาม', 'hl', 1.45, {size: 84}]]], 'top:375px', {gap: 8});
  keyHit(.75);
});

/* ---------- 2 · Setup ---------- */
slide({bg: 'black', dur: 3.6}, s => {
  dark(s, 1);
  txt(s, [[['ร้านส่วนใหญ่ทำแบบนี้', 'm', .10, {size: 70}]], [['ทุกเดือน', 'i', .40, {size: 124}]]], 'top:80px');
  rows(s, ['เทงบยิงแอดหาลูกค้าใหม่', 'ลูกค้าซื้อครั้งเดียวแล้วหายไป', 'เดือนหน้าเริ่มยิงแอดใหม่อีกรอบ'], .75, 'top:380px', {icon: 'arrow-right', size: 46, W: 800, gap: 28});
  txt(s, [[['ยอดขายมี แต่ต้อง', 'l', 1.55, {size: 48}], ['จ่ายซ้ำ', 'hl', 1.75, {size: 84}]], [['ทุกครั้งที่อยากได้ยอด', 'l', 1.95, {size: 48}]]], 'top:730px');
  keyHit(1.75);
});

/* ---------- 3 · Body 1: cause ---------- */
slide({bg: 'black', dur: 3.8}, s => {
  dark(s, 0);
  txt(s, [[['ทุกครั้งที่หาลูกค้าใหม่ คุณจ่าย', 'l', .05, {size: 46}]], [['Customer Acquisition Cost', 'kw', .30, {size: 80}]],
    [['(ต้นทุนการหาลูกค้าใหม่)', 'l', .50, {size: 40}]]], 'top:115px', {gap: 6});
  [['banknote', 'ค่าแอด'], ['tag', 'ค่าโปรเปิดตัว'], ['message-circle', 'เวลาตอบแชต<br>คนที่ยังไม่ซื้อ']].forEach(([ic, lab], k) => {
    card(s, `left:${70 + k * 325}px;top:385px;width:290px;height:240px`, .70 + k * .15, ic, lab, {size: 34});
    if (k) glyph(s, 'plus', .78 + k * .15, `left:${70 + k * 325 - 34}px;top:483px`, 34);
  });
  txt(s, [[['ส่วนลูกค้าเก่ารู้จักร้าน เชื่อใจสินค้าแล้ว', 'l', 1.35, {size: 44}]], [['ต้นทุนส่วนนี้จึง', 'l', 1.50, {size: 46}], ['เกือบเป็นศูนย์', 'hl', 1.70, {size: 84}]]], 'top:705px', {gap: 6});
  keyHit(1.70);
});

/* ---------- 4 · Body 2: worked example ---------- */
slide({bg: 'black', dur: 4.2}, s => {
  dark(s, 1);
  txt(s, [[['ตัวอย่างร้านสมมติ', 'l', .05, {size: 44}]]], 'top:52px');
  const side = (x, t, style, icon, head, lines, big) => {
    const fg = style === 'white' ? '#000' : '#fff', dim = style === 'white' ? 'rgba(0,0,0,.62)' : 'rgba(255,255,255,.66)';
    const p = panel(s, `left:${x}px;top:135px;width:460px;height:650px`, t, {style, radius: 44});
    div(`left:36px;top:34px;display:flex;align-items:center;gap:18px;font-family:CardSans;font-size:50px;line-height:1.2;color:${fg}`, p,
      `<span style="width:76px;height:76px;border-radius:22px;display:flex;align-items:center;justify-content:center;background:${fg}">${ico(icon, 44, style === 'white' ? '#fff' : '#000', 2.2)}</span>${head}`);
    const body = div(`left:36px;top:150px;width:400px;font-family:Lead;font-size:33px;line-height:1.5;color:${dim};opacity:0`, p, lines);
    A(body, [{opacity: 0, transform: 'translateY(16px)'}, {opacity: 1, transform: 'none'}], t + .25, .3, {e: SMOOTH});
    div(`left:36px;top:430px;width:388px;height:3px;border-radius:2px;background:${dim};opacity:.5`, p);
    const n = div(`left:36px;top:438px;display:flex;align-items:baseline;gap:14px;color:${fg};opacity:0`, p,
      `<span style="font-family:KeySans;font-size:56px">=</span><span style="font-family:KeySans;font-size:140px;line-height:1.05;letter-spacing:-3px">${big}</span>`);
    div(`left:36px;top:588px;font-family:CardSans;font-size:38px;line-height:1;color:${fg}`, p, 'บาท/คน');
    A(n, [{opacity: 0, transform: 'scale(1.12)', filter: 'blur(12px)'}, {opacity: 1, transform: 'none', filter: 'blur(0)'}], t + .5, .28, {e: SMOOTH});
  };
  side(60, .15, 'glass', 'user-plus', 'ลูกค้าใหม่', 'ค่าแอด <b style="color:#fff;font-family:CardSans;font-weight:normal">10,000 บาท</b><br>→ ได้ลูกค้า <b style="color:#fff;font-family:CardSans;font-weight:normal">50 คน</b>', '200');
  side(560, .55, 'white', 'repeat-2', 'ลูกค้าเก่า', 'ทักหาลูกค้าเก่า <b style="color:#000;font-family:CardSans;font-weight:normal">200 คน</b><br>+ ส่วนลด <b style="color:#000;font-family:CardSans;font-weight:normal">50 บาท</b><br>กลับมาซื้อ <b style="color:#000;font-family:CardSans;font-weight:normal">40 คน</b><br>→ ต้นทุนส่วนลด <b style="color:#000;font-family:CardSans;font-weight:normal">2,000 บาท</b>', '50');
  txt(s, [[['ได้ยอดเท่ากัน แต่', 'l', 1.45, {size: 48}], ['ถูกกว่า 4 เท่า', 'hl', 1.65, {size: 80}]]], 'top:820px');
  keyHit(1.65);
});

/* ---------- 5 · Body 3: what to do ---------- */
slide({bg: 'black', dur: 3.8}, s => {
  dark(s, 0);
  txt(s, [[['ทำให้ลูกค้าเก่า', 'l', .05, {size: 56}], ['กลับมา', 'i', .35, {size: 124}]], [['ใน 3 ขั้น', 'm', .60, {size: 66}]]], 'top:105px');
  rows(s, [
    'เก็บช่องทางติดต่อทุกออเดอร์<span class="sub">(LINE OA / เบอร์โทร)</span>',
    'ทักกลับในจังหวะที่สินค้าน่าจะหมด<span class="sub">(เช่น 30 วันหลังซื้อ)</span>',
    'ให้เหตุผลที่จะกลับมา<span class="sub"><b>Loyalty Program</b> (โปรแกรมสะสมแต้ม)<br>หรือให้เห็นสินค้าใหม่ก่อนคนอื่น</span>'],
    .85, 'top:395px', {size: 46, W: 840, gap: 42});
  keyHit(.35);
});

/* ---------- 6 · Rehook ---------- */
slide({bg: 'black', dur: 4.2}, s => {
  dark(s, 1);
  txt(s, [[['แต่การรักษาลูกค้า', 'l', .05, {size: 50}], ['ไม่ใช่', 'iw', .30, {size: 104}]], [['การแจกส่วนลดทุกครั้ง', 'hl', .55, {size: 78}]]], 'top:38px', {gap: 12});
  [['badge-percent', 'ลดราคาบ่อย', 'glass'], ['hourglass', 'ลูกค้ารอแต่โปร', 'glass'], ['trending-down', '<span style="font-family:KeySans">Profit Margin</span><br><span style="font-family:Lead;font-size:28px">(อัตรากำไร)</span><br>หายไปเรื่อยๆ', 'white']].forEach(([ic, lab, st], k) => {
    card(s, `left:${70 + k * 325}px;top:330px;width:290px;height:240px`, 1.05 + k * .2, ic, lab, {style: st, size: 32});
    if (k) glyph(s, 'arrow-right', 1.12 + k * .2, `left:${70 + k * 325 - 34}px;top:433px`, 34);
  });
  rule(s, 1.6, 'left:390px;top:612px;width:300px');
  txt(s, [[['ลูกค้าที่กลับมาซื้อจริง กลับมาเพราะ', 'l', 1.70, {size: 46}]]], 'top:640px');
  [['package', 'ส่งไว'], ['message-circle', 'ตอบเร็ว'], ['heart', 'ร้านจำเขาได้']].forEach(([ic, lab], k) => {
    const cx = 240 + k * 300;
    tile(s, ic, 1.90 + k * .15, `left:${cx - 55}px;top:725px`, {size: 110, bg: '#fff', color: '#000'});
    const l = div(`left:${cx - 150}px;top:848px;width:300px;text-align:center;font-family:CardSans;font-size:42px;line-height:1.2;color:#fff;opacity:0`, s, lab);
    A(l, [{opacity: 0, transform: 'translateY(14px)'}, {opacity: 1, transform: 'none'}], 2.0 + k * .15, .25, {e: SMOOTH});
  });
  keyHit(.30);
});

/* ---------- 7 · Payoff ---------- */
slide({bg: 'black', dur: 3.8}, s => {
  dark(s, 0);
  tile(s, 'percent', .10, 'left:290px;top:140px', {size: 110, bg: 'glass'});
  tile(s, 'repeat-2', .25, 'left:460px;top:110px', {size: 160, bg: '#fff', color: '#000'});
  tile(s, 'user', .40, 'left:680px;top:140px', {size: 110, bg: 'glass'});
  txt(s, [[['ยอดขายที่ยั่งยืน มาจาก', 'l', .45, {size: 48}]], [['Repeat Purchase Rate', 'k', .70, {size: 100}]],
    [['(อัตราการซื้อซ้ำ)', 'l', .90, {size: 42}]], [['ไม่ใช่จำนวนลูกค้าใหม่อย่างเดียว', 'l', 1.05, {size: 46}]]], 'top:315px', {gap: 4});
  rule(s, 1.20, 'left:390px;top:680px;width:300px');
  txt(s, [[['ก่อนเพิ่มงบแอดเดือนหน้า', 'l', 1.35, {size: 46}]], [['เช็กก่อนว่าลูกค้าเก่ากลับมาซื้อ', 'l', 1.50, {size: 46}], ['กี่ %', 'hl', 1.70, {size: 80}]]], 'top:715px', {gap: 6});
  keyHit(.70);
});

/* ---------- 8 · CTA ---------- */
slide({bg: 'black', dur: 3.6}, s => {
  dark(s, 1);
  tile(s, 'message-circle', .10, 'left:290px;top:140px', {size: 110, bg: 'glass'});
  tile(s, 'bookmark', .25, 'left:460px;top:110px', {size: 160, bg: '#fff', color: '#000'});
  tile(s, 'send', .40, 'left:680px;top:140px', {size: 110, bg: 'glass'});
  txt(s, [[['เซฟไว้', 'i', .50, {size: 140}]], [['แล้วลองนับลูกค้าซื้อซ้ำของร้านคุณ', 'l', .75, {size: 46}]]], 'top:300px');
  rows(s, [
    ['message-circle', 'คอมเมนต์บอกหน่อย<span class="sub">ร้านคุณมีลูกค้ากลับมาซื้อซ้ำกี่ %</span>'],
    ['send', 'แชร์ให้เพื่อนเจ้าของร้าน<span class="sub">ที่กำลังเทงบแอดอยู่</span>']],
    1.05, 'top:625px', {size: 46, W: 760, gap: 44});
  keyHit(.50);
});
