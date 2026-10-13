/* ทำไมอายุ 20 ต้นๆ ถึงควรเริ่มทำธุรกิจ — 8 slides, theme bw */

/* 1 · Hook · dark */
slide({tone: 'dark'}, s => {
  tag(s, 'อายุ 20 ต้นๆ', .05, 'left:80px;top:140px', {dot: true});
  title(s, 'ทำไมอายุ 20 ต้นๆ\nถึงควร\n__เริ่มทำธุรกิจ__', .15, 'left:80px;top:215px', {size: 96, lh: 1.36});
  num(s, '20+', .7, 'left:600px;top:600px', {size: 230, count: false});
});

/* 2 · Problem · light */
slide({tone: 'light'}, s => {
  tag(s, 'ปัญหา', .05, 'left:80px;top:140px');
  title(s, 'หลายคนรอให้ __พร้อม__\nก่อนค่อยเริ่ม', .12, 'left:80px;top:205px', {size: 80, lh: 1.36});
  const a = box(s, 'left:80px;top:470px;width:450px;height:400px', .4, {style: 'solid'});
  icon(a, 'hourglass', .55, 'left:36px;top:60px', {size: 80, style: 'accent', fl: false});
  title(a, 'รอให้พร้อม', .6, 'left:36px;top:200px', {size: 44, W: 380});
  body(a, 'ไม่ได้เริ่มสักที', .7, 'left:36px;top:280px', {W: 380, size: 30});
  const b = box(s, 'left:550px;top:470px;width:450px;height:400px', .7, {style: 'accent'});
  div('left:36px;top:60px;width:80px;height:80px;display:flex;align-items:center;justify-content:center', b, ico('rocket', 60, 'var(--acc-ink)', 2.4));
  title(b, 'เริ่มเลย', .9, 'left:36px;top:200px', {size: 44, W: 380, color: 'var(--acc-ink)'});
  body(b, 'เรียนรู้ระหว่างทาง', 1.0, 'left:36px;top:280px', {W: 380, size: 30, color: 'var(--acc-ink)'});
});

/* 3 · Reason 1 · dark */
slide({tone: 'dark'}, s => {
  tag(s, 'เหตุผล 1', .05, 'left:80px;top:140px');
  title(s, 'ภาระยังน้อย\n__ล้มแล้วลุกง่าย__', .12, 'left:80px;top:205px', {size: 84, lh: 1.36});
  const rows = [['users', 'ไม่มีภาระครอบครัว'], ['banknote', 'หนี้ยังน้อย'], ['wallet', 'รายจ่ายต่ำ']];
  rows.forEach(([ic, tx], k) => {
    const t = .4 + k * .2, y = 470 + k * 140;
    const b = box(s, `left:80px;top:${y}px;width:920px;height:124px`, t, {from: 'left'});
    icon(b, ic, t + .1, 'left:30px;top:26px', {size: 72, style: 'accent', fl: false});
    title(b, tx, t + .15, 'left:136px;top:38px', {size: 38, W: 720});
  });
});

/* 4 · Reason 2 · light */
slide({tone: 'light'}, s => {
  tag(s, 'เหตุผล 2', .05, 'left:80px;top:140px');
  title(s, '__เวลา__ คือทุน\nที่มากที่สุดของคุณ', .12, 'left:80px;top:205px', {size: 80, lh: 1.36});
  const c = box(s, 'left:80px;top:520px;width:920px;height:340px', .55, {style: 'solid'});
  hbar(c, 'เริ่มอายุ 22', 1, .8, 64, {w: 840, strong: true, value: 'มากกว่า'});
  hbar(c, 'เริ่มอายุ 35', .5, .95, 204, {w: 840, value: 'น้อยกว่า'});
});

/* 5 · Reason 3 · dark */
slide({tone: 'dark'}, s => {
  tag(s, 'เหตุผล 3', .05, 'left:80px;top:140px');
  title(s, 'ทุกความผิดพลาดคือ\n__บทเรียนราคาถูก__', .12, 'left:80px;top:205px', {size: 80, lh: 1.36});
  const b = box(s, 'left:80px;top:450px;width:920px;height:440px', .4);
  line(b, [[0, 250], [120, 190], [200, 260], [330, 150], [420, 200], [620, 80], [780, 20]], .6, 'left:40px;top:40px', {w: 840, h: 270, sw: 7, area: true, dot: true, color: 'var(--fg)'});
  const steps = [['circle-x', 'ผิด'], ['lightbulb', 'เรียนรู้'], ['trending-up', 'ดีขึ้น']].map(([ic, tx]) => `<span style="display:flex;align-items:center;gap:14px">${ico(ic, 40, 'currentColor', 2.4)}${tx}</span>`).join('<span>→</span>');
  popIn(div('left:40px;top:350px;width:840px;display:flex;align-items:center;justify-content:space-between;font-weight:700;font-size:32px;color:var(--fg)', b, steps), 1.0);
});

/* 6 · How · light */
slide({tone: 'light'}, s => {
  tag(s, 'เริ่มยังไง', .05, 'left:80px;top:140px');
  title(s, 'เริ่ม __เล็กๆ__\nได้ตั้งแต่วันนี้', .12, 'left:80px;top:205px', {size: 80, lh: 1.36});
  const rows = [
    ['01', 'ขายสิ่งที่ถนัด', '', 'store'],
    ['02', 'ทำควบคู่งานประจำ', '', 'briefcase'],
    ['03', 'เก็บกำไรไปต่อยอด', '', 'trending-up'],
  ];
  let y = 450;
  rows.forEach(([n, h, sub, ic], k) => {
    const t = .35 + k * .22;
    const b = box(s, `left:80px;top:${y}px;width:920px;height:140px`, t, {style: 'solid', from: 'left'});
    num(b, n, t + .1, 'left:32px;top:34px', {size: 60, count: false});
    title(b, h, t + .15, 'left:140px;top:44px', {size: 40, W: 640});
    icon(b, ic, t + .25, 'left:820px;top:36px', {size: 68, style: 'accent', fl: false});
    y += 154;
  });
});

/* 7 · Summary · accent */
slide({tone: 'accent'}, s => {
  tag(s, 'สรุป', .05, 'left:80px;top:140px');
  title(s, 'ไม่ต้องพร้อม 100%\nแค่ __เริ่มก่อน__', .12, 'left:80px;top:205px', {size: 84, lh: 1.36});
  [['shield-check', 'ภาระน้อย'], ['hourglass', 'เวลาเยอะ'], ['lightbulb', 'บทเรียนถูก']].forEach(([ic, tx], k) => {
    const c = box(s, `left:${80 + k * 313}px;top:520px;width:294px;height:340px`, .5 + k * .15, {style: 'accent', from: 'up'});
    div(`left:32px;top:32px;${LBL};color:color-mix(in srgb,var(--acc-ink) 60%,transparent)`, c, `0${k + 1}`);
    div('left:32px;top:100px;width:90px;height:90px;display:flex;align-items:center;justify-content:center', c, ico(ic, 72, 'var(--acc-ink)', 2.4));
    title(c, tx, .65 + k * .15, 'left:32px;top:240px', {size: 40, W: 240, color: 'var(--acc-ink)'});
  });
});

/* 8 · CTA · dark */
slide({tone: 'dark'}, s => {
  tag(s, 'ฝากไว้', .05, 'left:80px;top:140px');
  title(s, 'ถ้าโพสต์นี้\n__มีประโยชน์__', .12, 'left:80px;top:205px', {size: 88, lh: 1.36});
  list(s, [['bookmark', 'เซฟไว้'], ['message-circle', 'คอมเมนต์'], ['share-2', 'แชร์ให้เพื่อน']],
    .4, 'left:80px;top:500px', {mark: 'icon', size: 36, gap: 28, W: 920});
  cta(s, 'เซฟโพสต์นี้', 1.0, 'left:80px;top:790px', {icon: 'bookmark'});
  path(s, [[0, 150], [150, 40], [310, 110]], .9, 'left:640px;top:740px', {w: 360, h: 200});
});
