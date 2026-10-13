/* ลูกค้าเก่า vs ลูกค้าใหม่ — 8 slides, 1080×1080, ธีมขาว-ดำ (ฐาน mono), ตัวหนาทั้งชุด.
   accent บนพื้นดำ = ขาว, บนพื้นขาว = ดำ → ทั้งชุดมีแค่ขาว/ดำ/เทา.
   กริด: tag y140 · พาดหัว y205 · บล็อกเนื้อหา y≈470–900 · ขอบ 80 px */
(() => {
  const st = document.createElement('style');
  st.textContent = '.t-light{--acc:#0A0A0A;--acc-ink:#FFFFFF}' +
    '.t-dark{--muted:rgba(246,246,248,.78)}.t-light,.t-accent{--muted:#2E2E33}' +
    '.bdy{font-weight:500}.bdy b{font-weight:600}.lst .tx{font-weight:600}.tag,.chip{font-weight:600}';
  document.head.appendChild(st);
})();
const LBL = 'font-family:Body;font-weight:600;font-size:24px;letter-spacing:.04em;color:var(--muted);white-space:nowrap';

/* horizontal comparison bar (label + track + fill) */
function hbar(p, label, frac, t, top, {w = 340, strong = false, value = ''} = {}) {
  div(`left:36px;top:${top}px;${LBL}`, p, label);
  if (value) div(`right:36px;top:${top}px;${LBL};color:var(--fg)`, p, value);
  const tr = div(`left:36px;top:${top + 44}px;width:${w}px;height:26px;border-radius:99px;background:color-mix(in srgb,var(--fg) 10%,transparent)`, p);
  const f = div(`left:0;top:0;height:100%;width:${frac * 100}%;border-radius:99px;background:${strong ? 'var(--fg)' : 'color-mix(in srgb,var(--fg) 45%,transparent)'};transform-origin:0 50%`, tr);
  A(f, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], t, .7, {e: SMOOTH});
}

/* 1 · Hook · dark cover */
slide({tone: 'dark'}, s => {
  tag(s, 'ต้นทุนลูกค้า', .05, 'left:80px;top:140px', {dot: true});
  title(s, 'ลูกค้าใหม่\nแพงกว่าลูกค้าเก่า\n__5 เท่า__', .15, 'left:80px;top:215px', {size: 100, lh: 1.24});
  body(s, 'และนี่คือเหตุผลที่ยอดขายโต\nแต่**กำไรไม่โตตาม**', .6, 'left:80px;top:700px', {W: 460, size: 34});
  const c = box(s, 'left:580px;top:640px;width:420px;height:250px', .7);
  hbar(c, 'ลูกค้าใหม่', 1, .9, 34, {strong: true, value: '×5'});
  hbar(c, 'ลูกค้าเก่า', .2, 1.05, 136, {value: '×1'});
});

/* 2 · Setup · light · the monthly ad loop */
slide({tone: 'light'}, s => {
  tag(s, 'ปัญหา', .05, 'left:80px;top:140px');
  title(s, 'ร้านส่วนใหญ่\nทำแบบนี้ __ทุกเดือน__', .12, 'left:80px;top:205px', {size: 84, lh: 1.24});
  const steps = [['megaphone', 'เทงบยิงแอด\nหาลูกค้าใหม่'], ['ghost', 'ลูกค้าซื้อครั้งเดียว\nแล้วหายไป'], ['repeat-2', 'เดือนหน้าเริ่ม\nยิงแอดใหม่อีกรอบ']];
  steps.forEach(([ic, tx], k) => {
    const t = .35 + k * .2, x = 80 + k * 320;
    const c = box(s, `left:${x}px;top:465px;width:280px;height:250px`, t, {style: 'solid'});
    div(`left:28px;top:28px;${LBL}`, c, `0${k + 1}`);
    icon(c, ic, t + .1, 'left:180px;top:22px', {size: 72, style: 'accent', fl: false});
    title(c, tx, t + .15, 'left:28px;top:134px', {size: 27, W: 240, lh: 1.3, step: .06});
    if (k < 2) {
      const a = div(`left:${x + 280}px;top:572px;width:40px;height:36px;display:flex;align-items:center;justify-content:center;color:var(--fg)`, s, ico('chevron-right', 34, 'currentColor', 2.6));
      popIn(a, t + .2);
    }
  });
  const b = box(s, 'left:80px;top:760px;width:920px;height:116px', 1.0, {style: 'accent'});
  div('left:34px;top:30px;width:56px;height:56px;display:flex;align-items:center;justify-content:center', b, ico('refresh-cw', 40, 'var(--acc-ink)', 2.4));
  title(b, 'ยอดขายมี แต่ต้องจ่ายซ้ำทุกครั้งที่อยากได้ยอด', 1.1, 'left:110px;top:34px', {size: 34, W: 780, color: 'var(--acc-ink)'});
});

/* 3 · Body 1 · dark · CAC: new vs returning */
slide({tone: 'dark'}, s => {
  tag(s, 'สาเหตุ', .05, 'left:80px;top:140px');
  title(s, 'ทุกครั้งที่หาลูกค้าใหม่\nคุณจ่าย __CAC__', .12, 'left:80px;top:200px', {size: 76, lh: 1.24});
  body(s, '**Customer Acquisition Cost** (ต้นทุนการหาลูกค้าใหม่)', .4, 'left:80px;top:410px', {W: 920, size: 28});
  const a = box(s, 'left:80px;top:500px;width:450px;height:400px', .5);
  div(`left:36px;top:36px;${LBL}`, a, 'ลูกค้าใหม่ จ่าย');
  const L = list(a, [['megaphone', 'ค่าแอด'], ['tag', 'ค่าโปรเปิดตัว'], ['message-circle', 'เวลาตอบแชต']], .65, 'left:36px;top:96px', {mark: 'icon', size: 30, gap: 24, W: 390});
  L.querySelectorAll('.tx')[2].innerHTML = 'เวลาตอบแชต<br>คนที่ยังไม่ซื้อ';
  const b = box(s, 'left:550px;top:500px;width:450px;height:400px', .8, {style: 'accent'});
  div(`left:36px;top:36px;${LBL};color:color-mix(in srgb,var(--acc-ink) 60%,transparent)`, b, 'ลูกค้าเก่า');
  title(b, 'รู้จักร้าน\nเชื่อใจสินค้าแล้ว', .95, 'left:36px;top:86px', {size: 34, W: 380, lh: 1.3, color: 'var(--acc-ink)'});
  num(b, '≈0', 1.1, 'left:30px;top:190px', {size: 130, count: false, color: 'var(--acc-ink)'});
  body(b, 'ต้นทุนส่วนนี้เกือบเป็นศูนย์', 1.2, 'left:36px;top:325px', {W: 380, size: 28, color: 'var(--acc-ink)'});
});

/* 4 · Body 2 · light · worked example */
slide({tone: 'light'}, s => {
  tag(s, 'ตัวอย่างร้านสมมติ', .05, 'left:80px;top:140px', {icon: 'store'});
  title(s, 'ได้ยอดเท่ากัน\nแต่ถูกกว่า __4 เท่า__', .12, 'left:80px;top:205px', {size: 80, lh: 1.24});
  const a = box(s, 'left:80px;top:440px;width:450px;height:460px', .4, {style: 'solid'});
  div(`left:36px;top:36px;${LBL}`, a, 'ลูกค้าใหม่');
  num(a, '200', .55, 'left:30px;top:84px', {size: 120});
  div(`left:36px;top:206px;${LBL};color:var(--fg)`, a, 'บาท / คน');
  div('left:36px;top:262px;width:378px;height:2px;background:var(--line)', a);
  body(a, 'ค่าแอด 10,000 บาท\n→ ได้ลูกค้า 50 คน', .8, 'left:36px;top:286px', {W: 380, size: 26});
  const b = box(s, 'left:550px;top:440px;width:450px;height:460px', .7, {style: 'accent'});
  div(`left:36px;top:36px;${LBL};color:color-mix(in srgb,var(--acc-ink) 60%,transparent)`, b, 'ลูกค้าเก่า');
  num(b, '50', .85, 'left:30px;top:84px', {size: 120, color: 'var(--acc-ink)'});
  div(`left:36px;top:206px;${LBL};color:var(--acc-ink)`, b, 'บาท / คน');
  div('left:36px;top:262px;width:378px;height:2px;background:color-mix(in srgb,var(--acc-ink) 22%,transparent)', b);
  body(b, 'ทักลูกค้าเก่า 200 คน + ส่วนลด 50 บาท\nกลับมาซื้อ 40 คน\n→ ต้นทุนส่วนลด 2,000 บาท', 1.1, 'left:36px;top:286px', {W: 390, size: 24, color: 'color-mix(in srgb,var(--acc-ink) 78%,transparent)'});
});

/* 5 · Body 3 · dark · 3 steps */
slide({tone: 'dark'}, s => {
  tag(s, 'สิ่งที่ควรทำ', .05, 'left:80px;top:140px');
  title(s, 'ทำให้ลูกค้าเก่ากลับมา\nใน __3 ขั้น__', .12, 'left:80px;top:200px', {size: 76, lh: 1.24});
  const rows = [
    ['01', 'เก็บช่องทางติดต่อทุกออเดอร์', 'LINE OA / เบอร์โทร', 'smartphone', 140],
    ['02', 'ทักกลับในจังหวะที่สินค้าน่าจะหมด', 'เช่น 30 วันหลังซื้อ', 'calendar', 140],
    ['03', 'ให้เหตุผลที่จะกลับมา', 'Loyalty Program (โปรแกรมสะสมแต้ม)\nหรือให้เห็นสินค้าใหม่ก่อนคนอื่น', 'gift', 172],
  ];
  let y = 435;
  rows.forEach(([n, h, sub, ic, hh], k) => {
    const t = .35 + k * .22;
    const b = box(s, `left:80px;top:${y}px;width:920px;height:${hh}px`, t, {from: 'left'});
    num(b, n, t + .1, 'left:32px;top:30px', {size: 60, count: false});
    title(b, h, t + .15, 'left:140px;top:28px', {size: 34, W: 640});
    body(b, sub, t + .2, 'left:140px;top:80px', {size: 24, W: 640});
    icon(b, ic, t + .25, `left:820px;top:${(hh - 68) / 2}px`, {size: 68, style: 'accent', fl: false});
    y += hh + 14;
  });
});

/* 6 · Rehook · light · discounts are not retention */
slide({tone: 'light'}, s => {
  tag(s, 'พลิกมุม', .05, 'left:80px;top:140px');
  title(s, 'แต่การรักษาลูกค้า ไม่ใช่\n~การแจกส่วนลดทุกครั้ง~', .12, 'left:80px;top:205px', {size: 66, lh: 1.26});
  const b = box(s, 'left:80px;top:410px;width:920px;height:240px', .4, {style: 'solid'});
  const L = list(b, [['tag', 'ลดราคาบ่อย'], ['hourglass', 'ลูกค้ารอแต่โปร'], ['trending-down', 'Profit Margin (อัตรากำไร)']], .5, 'left:36px;top:30px', {mark: 'icon', size: 26, gap: 14, W: 470, box: 46});
  L.querySelectorAll('.tx')[2].innerHTML = 'Profit Margin (อัตรากำไร)<br><span style="font-weight:500;color:var(--muted)">หายไปเรื่อยๆ</span>';
  line(b, [[0, 24], [100, 50], [200, 92], [300, 128], [370, 168]], .8, 'left:510px;top:30px', {w: 380, h: 190, sw: 6, area: false, dot: true, color: 'var(--fg)'});
  div(`left:80px;top:690px;${LBL}`, s, 'ลูกค้าที่กลับมาซื้อจริง กลับมาเพราะ');
  [['truck', 'ส่งไว'], ['message-circle', 'ตอบเร็ว'], ['heart', 'ร้านจำเขาได้']].forEach(([ic, tx], k) => {
    const c = box(s, `left:${80 + k * 313}px;top:740px;width:294px;height:120px`, 1.0 + k * .15, {style: 'accent', from: 'up'});
    div('left:26px;top:30px;width:60px;height:60px;display:flex;align-items:center;justify-content:center', c, ico(ic, 44, 'var(--acc-ink)', 2.4));
    title(c, tx, 1.1 + k * .15, 'left:96px;top:40px', {size: 30, W: 190, color: 'var(--acc-ink)'});
  });
});

/* 7 · Payoff · accent (white) */
slide({tone: 'accent'}, s => {
  tag(s, 'สรุป', .05, 'left:80px;top:140px');
  title(s, 'ยอดขายที่ยั่งยืน\nมาจาก __อัตราการซื้อซ้ำ__', .12, 'left:80px;top:205px', {size: 80, lh: 1.24});
  body(s, '**Repeat Purchase Rate**\nไม่ใช่จำนวนลูกค้าใหม่อย่างเดียว', .45, 'left:80px;top:455px', {W: 920, size: 32});
  const b = box(s, 'left:80px;top:625px;width:920px;height:240px', .7, {style: 'accent'});
  div(`left:40px;top:44px;${LBL};color:color-mix(in srgb,var(--acc-ink) 60%,transparent)`, b, 'ก่อนเพิ่มงบแอดเดือนหน้า');
  title(b, 'เช็กก่อนว่าลูกค้าเก่า\nกลับมาซื้อกี่ %', .9, 'left:40px;top:92px', {size: 44, W: 620, lh: 1.25, color: 'var(--acc-ink)'});
  const r = div('left:700px;top:40px;width:160px;height:160px;border-radius:50%;border:3px solid color-mix(in srgb,var(--acc-ink) 30%,transparent);display:flex;align-items:center;justify-content:center', b, ico('percent', 72, 'var(--acc-ink)', 2.4));
  popIn(r, 1.0);
});

/* 8 · CTA · dark */
slide({tone: 'dark'}, s => {
  tag(s, 'ลองทำดู', .05, 'left:80px;top:140px');
  title(s, 'ร้านคุณมีลูกค้า\nกลับมาซื้อซ้ำ __กี่ %__', .12, 'left:80px;top:205px', {size: 88, lh: 1.24});
  list(s, [['bookmark', 'เซฟไว้ แล้วลองนับลูกค้าซื้อซ้ำของร้านคุณ'], ['message-circle', 'คอมเมนต์บอกหน่อย ร้านคุณมีกี่ %'], ['share-2', 'แชร์ให้เพื่อนเจ้าของร้านที่กำลังเทงบแอดอยู่']],
    .4, 'left:80px;top:485px', {mark: 'icon', size: 30, gap: 28, W: 920});
  cta(s, 'เซฟโพสต์นี้', 1.0, 'left:80px;top:790px', {icon: 'bookmark'});
  path(s, [[0, 150], [150, 40], [310, 110]], .9, 'left:640px;top:740px', {w: 360, h: 200});
});
