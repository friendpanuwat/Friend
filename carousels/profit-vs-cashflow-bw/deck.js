/* กำไร vs เงินสด — 8 slides, 1080×1080, theme bw + semantic green/red (ผู้ใช้ขอ: กราฟเขียว, เงินสดติดลบแดง) */

/* 1 · Hook · dark */
slide({tone: 'dark'}, s => {
  tag(s, 'การเงินร้านค้า', .05, 'left:80px;top:140px', {dot: true});
  title(s, 'ขายดี\nแต่__เงินไม่เหลือ__', .15, 'left:80px;top:205px', {size: 108, lh: 1.24});
  body(s, 'เพราะ**กำไร** กับ **เงินสด**\nไม่ใช่เรื่องเดียวกัน', .55, 'left:80px;top:500px', {W: 700, size: 36});
  const a = box(s, 'left:80px;top:650px;width:560px;height:250px', .6);
  label(a, 'ยอดขาย', 'left:36px;top:32px');
  const up = div('right:36px;top:26px;color:var(--pos)', a, ico('trending-up', 44, 'currentColor', 2.6)); popIn(up, 1.3);
  line(a, [[0, 130], [110, 112], [210, 116], [320, 70], [400, 46], [480, 8]], .8, 'left:40px;top:92px', {w: 480, h: 140, sw: 7, color: 'var(--pos)'});
  const b = box(s, 'left:660px;top:650px;width:340px;height:250px', .8);
  label(b, 'เงินในกระเป๋า', 'left:36px;top:32px');
  const w = div('left:0;top:80px;width:340px;height:150px;display:flex;align-items:center;justify-content:center;color:color-mix(in srgb,var(--fg) 42%,transparent)', b, ico('wallet', 110, 'currentColor', 1.8)); popIn(w, 1.0);
});

/* 2 · Setup · light · bank app + stacked bills */
slide({tone: 'light'}, s => {
  tag(s, 'ปัญหา', .05, 'left:80px;top:140px');
  title(s, 'สิ้นเดือน\nเปิดดู__ตัวเลข__', .12, 'left:80px;top:205px', {size: 84, lh: 1.24});
  body(s, 'ยอดขายดี กำไรก็มี\nแต่พอจะจ่ายเงินเดือน ค่าเช่า ค่าของ\nเงินในบัญชี**กลับไม่พอ**', .4, 'left:80px;top:440px', {W: 500, size: 28});
  body(s, 'เจ้าของร้านหลายคนเจอแบบนี้\nแต่ไม่รู้ว่าเกิดจากอะไร', .6, 'left:80px;top:610px', {W: 480, size: 26});
  const sc = phone(s, 'left:620px;top:130px', .2, {w: 340, h: 640});
  label(sc, 'บัญชีร้าน', 'left:28px;top:70px');
  title(sc, 'ยอดคงเหลือ', .5, 'left:28px;top:120px', {size: 34, W: 280});
  const tr = div('left:28px;top:186px;width:256px;height:22px;border-radius:99px;background:color-mix(in srgb,var(--fg) 10%,transparent)', sc);
  const f = div('left:0;top:0;height:100%;width:8%;border-radius:99px;background:var(--neg);transform-origin:0 50%', tr);
  A(f, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], .7, .6, {e: SMOOTH});
  label(sc, 'ไม่พอจ่าย', 'left:28px;top:226px', {color: 'var(--neg)'});
  skel(sc, 'left:28px;top:300px;width:256px', [.9, .6, .75], {t: .6, h: 16});
  [['ค่าเช่า', 640], ['เงินเดือน', 728], ['ค่าของ', 816]].forEach(([t1, y], k) =>
    notify(s, t1, 'ถึงกำหนดจ่าย', .9 + k * .18, `left:${520 - k * 18}px;top:${y - 40}px;width:400px`, {icon: 'receipt'}));
});

/* 3 · Body 1 · dark · Profit vs Cash Flow + timeline */
slide({tone: 'dark'}, s => {
  tag(s, 'สาเหตุ', .05, 'left:80px;top:140px');
  title(s, 'สองอย่างนี้\n__เกิดคนละเวลา__', .12, 'left:80px;top:205px', {size: 80, lh: 1.24});
  const cards = [['receipt', 'Profit (กำไร)', 'รายได้ − ต้นทุน\nนับตอนที่ขายได้', 'left:80px', null],
                 ['banknote', 'Cash Flow (กระแสเงินสด)', 'เงินที่เข้ามาจริง\n− เงินที่จ่ายออกจริง', 'left:550px', 'accent']];
  cards.forEach(([ic, h, tx, x, st], k) => {
    const c = box(s, `${x};top:430px;width:450px;height:250px`, .35 + k * .2, st ? {style: st} : {});
    const ink = st ? 'var(--acc-ink)' : 'var(--fg)';
    div('left:36px;top:34px', c, ico(ic, 52, ink, 2.2));
    title(c, h, .5 + k * .2, 'left:36px;top:104px', {size: 32, W: 390, color: ink});
    body(c, tx, .6 + k * .2, 'left:36px;top:156px', {W: 390, size: 26, color: st ? 'color-mix(in srgb,var(--acc-ink) 80%,transparent)' : undefined});
  });
  /* timeline: same sale, two moments */
  body(s, '**ขายได้วันนี้ ไม่ได้แปลว่าเงินเข้าวันนี้**', .9, 'left:80px;top:715px', {W: 920, size: 30});
  const ln = div('left:80px;top:800px;width:920px;height:4px;border-radius:2px;background:var(--line);transform-origin:0 50%', s);
  A(ln, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], 1.0, .6, {e: SMOOTH});
  [['วันที่ขายได้ → กำไร', 80, 'var(--pos)'], ['วันที่เงินเข้า → เงินสด', 560, 'var(--fg)']].forEach(([a, x, col], k) => {
    const d = div(`left:${x}px;top:788px;width:28px;height:28px;border-radius:50%;background:${col};box-shadow:0 0 0 8px var(--bg)`, s); popIn(d, 1.2 + k * .3);
    title(s, a, 1.25 + k * .3, `left:${x}px;top:832px`, {size: 28, W: 420});
  });
});

/* 4 · Body 2 · light · profit +25,000 vs cash −75,000 */
slide({tone: 'light'}, s => {
  tag(s, 'ตัวอย่างร้านสมมติ (ขายส่ง)', .05, 'left:80px;top:140px', {icon: 'store'});
  title(s, 'กำไรเป็นบวก\nแต่__เงินสดติดลบ__', .12, 'left:80px;top:205px', {size: 80, lh: 1.24});
  const a = box(s, 'left:80px;top:430px;width:920px;height:220px', .4, {style: 'solid'});
  label(a, 'กำไรบนกระดาษ', 'left:36px;top:34px');
  body(a, 'ขายของได้ 100,000 บาท\n− ต้นทุนสินค้า 60,000 − ค่าเช่า 15,000', .55, 'left:36px;top:86px', {W: 470, size: 24});
  num(a, '+25,000', .6, 'right:36px;top:52px', {size: 112, count: false, color: 'var(--pos)'});
  const b = box(s, 'left:80px;top:670px;width:920px;height:220px', .7, {style: 'solid'});
  label(b, 'เงินสด', 'left:36px;top:34px');
  body(b, 'ลูกค้าขอเครดิต 60 วัน เงินยังไม่เข้า\nแต่ค่าของและค่าเช่าต้องจ่ายเดือนนี้', .85, 'left:36px;top:86px', {W: 470, size: 24});
  num(b, '−75,000', .9, 'right:36px;top:52px', {size: 112, count: false, color: 'var(--neg)'});
});

/* 5 · Body 3 · dark · 3 steps */
slide({tone: 'dark'}, s => {
  tag(s, 'วิธีป้องกัน', .05, 'left:80px;top:140px');
  title(s, 'ป้องกันเงินขาดมือ\nใน __3 ขั้น__', .12, 'left:80px;top:205px', {size: 80, lh: 1.24});
  const rows = [
    ['01', 'ทำ Cash Flow Forecast', 'ประมาณการกระแสเงินสดล่วงหน้า 3 เดือน\nว่าเงินเข้า-ออกเมื่อไหร่', 'calendar'],
    ['02', 'เก็บเงินลูกค้าให้เร็วขึ้น', 'ลด Accounts Receivable (ลูกหนี้การค้า)\nหรือขอมัดจำก่อนส่งของ', 'hand-coins'],
    ['03', 'ต่อรอง Credit Term ให้ยาวขึ้น', 'ระยะเวลาเครดิตกับซัพพลายเออร์', 'handshake'],
  ];
  let y = 415;
  rows.forEach(([n, h, sub, ic], k) => {
    const t = .35 + k * .22, hh = 158;
    const b = box(s, `left:80px;top:${y}px;width:920px;height:${hh}px`, t, {from: 'left'});
    num(b, n, t + .1, 'left:32px;top:30px', {size: 60, count: false});
    title(b, h, t + .15, 'left:140px;top:20px', {size: 34, W: 640});
    body(b, sub, t + .2, 'left:140px;top:68px', {size: 24, W: 640});
    icon(b, ic, t + .25, `left:820px;top:${(hh - 68) / 2}px`, {size: 68, style: 'accent', fl: false});
    y += hh + 10;
  });
});

/* 6 · Rehook · light · sales up, cash down */
slide({tone: 'light'}, s => {
  tag(s, 'แต่…', .05, 'left:80px;top:140px');
  title(s, 'ร้านที่เสี่ยงเงินขาดที่สุด\nคือร้านที่__กำลังขายดีขึ้น__', .12, 'left:80px;top:205px', {size: 66, lh: 1.24});
  const c = box(s, 'left:80px;top:400px;width:920px;height:330px', .4, {style: 'solid'});
  body(c, 'ยิ่งโต ยิ่งต้องสต็อกของเพิ่ม\nยิ่งให้เครดิตลูกค้าเพิ่ม\n\n**เงินออกไปก่อน**\nแต่เงินเข้าตามมาทีหลัง', .55, 'left:36px;top:40px', {W: 380, size: 26, step: .25});
  line(c, [[0, 170], [80, 150], [170, 120], [260, 80], [350, 46], [430, 14]], .7, 'left:440px;top:40px', {w: 440, h: 250, sw: 7, area: false, color: 'var(--pos)'});
  line(c, [[0, 170], [80, 172], [170, 186], [260, 206], [350, 222], [430, 238]], .9, 'left:440px;top:40px', {w: 440, h: 250, sw: 7, area: false, color: 'var(--neg)'});
  const warn = div('left:494px;top:112px;color:var(--neg)', c, ico('circle-alert', 52, 'currentColor', 2.6)); popIn(warn, 1.5);
  label(c, 'ยอดขาย', 'left:690px;top:24px', {color: 'var(--pos)'});
  label(c, 'เงินสด', 'left:730px;top:290px', {color: 'var(--neg)'});
  const b = box(s, 'left:80px;top:760px;width:920px;height:116px', 1.2, {style: 'accent'});
  title(b, 'ธุรกิจจำนวนมากปิดตัวตอนขายดี ไม่ใช่ตอนขายไม่ได้', 1.3, 'left:40px;top:36px', {size: 32, W: 850, color: 'var(--acc-ink)'});
});

/* 7 · Payoff · accent (white) · type only */
slide({tone: 'accent'}, s => {
  tag(s, 'สรุป', .05, 'left:80px;top:140px');
  const T = title(s, 'กำไร บอกว่าธุรกิจ\nดีหรือไม่\nเงินสด บอกว่าธุรกิจ\n__อยู่รอด__หรือไม่', .12, 'left:80px;top:205px', {size: 76, lh: 1.24, step: .15});
  tint(T, 'ดี', 'var(--pos)');
  const b = box(s, 'left:80px;top:640px;width:920px;height:230px', .9, {style: 'accent'});
  label(b, 'ก่อนขยายร้าน รับออเดอร์ใหญ่ หรือให้เครดิตเพิ่ม', 'left:40px;top:50px', {color: 'color-mix(in srgb,var(--acc-ink) 65%,transparent)'});
  title(b, 'เช็กเงินสดก่อนทุกครั้ง', 1.05, 'left:40px;top:100px', {size: 54, W: 840, color: 'var(--acc-ink)'});
});

/* 8 · CTA · dark (สีเดียวกับสไลด์ 1) */
slide({tone: 'dark'}, s => {
  tag(s, 'ลองทำดู', .05, 'left:80px;top:140px');
  title(s, 'กำไร กับ เงินสดของร้านคุณ\n__ห่างกันแค่ไหน__', .12, 'left:80px;top:205px', {size: 72, lh: 1.24});
  const L = list(s, [['bookmark', 'x'], ['message-circle', 'x'], ['share-2', 'x']], .4, 'left:80px;top:440px', {mark: 'icon', size: 30, gap: 30, W: 920, box: 76});
  L.style.setProperty('--acc', 'var(--pos)'); L.style.setProperty('--acc-ink', '#0A0A0A');
  const tx = ['<b>เซฟไว้</b> แล้วลองเทียบตัวเลขของร้านคุณ',
              '<b>คอมเมนต์</b>บอกหน่อย เดือนที่แล้วกำไร กับ<br>เงินสดที่เหลือจริง ห่างกันแค่ไหน',
              '<b>แชร์</b>ให้เพื่อนเจ้าของร้านที่ขายดีแต่เงินไม่เหลือ'];
  L.querySelectorAll('.tx').forEach((e, k) => e.innerHTML = tx[k]);
  cta(s, 'เซฟโพสต์นี้', 1.0, 'left:80px;top:800px', {icon: 'bookmark'});
  path(s, [[0, 150], [150, 40], [310, 110]], .9, 'left:640px;top:720px', {w: 360, h: 200, color: 'var(--pos)'});
});
