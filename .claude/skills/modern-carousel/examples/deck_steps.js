/* Example — 7 slides, steps + myth/fact + quote. Content = the user's own clip ("อย่ารอไอเดียที่สมบูรณ์").
   Looks right in every theme (shown in ember / mono). Slide names L1…L7 are referenced in references/layouts.md. */

/* L1 cover · light · big title with circled word + asterisk + paper-plane path */
slide({tone: 'light'}, s => {
  tag(s, 'แนวคิดเริ่มต้นธุรกิจ', .05, 'left:80px;top:150px', {dot: true});
  title(s, 'อย่ารอ\nไอเดียที่\n((สมบูรณ์))', .15, 'left:80px;top:250px', {size: 120, lh: 1.1});
  ornament(s, undefined, .6, 'right:110px;top:170px', {size: 90});
  path(s, [[0, 230], [180, 90], [380, 200], [470, 40]], .7, 'left:520px;top:640px', {w: 500, h: 260});
});

/* L2 dark · myth / fact with switches */
slide({tone: 'dark'}, s => {
  title(s, 'ความเชื่อ vs ความจริง', .05, 'left:80px;top:140px', {size: 72});
  const a = box(s, 'left:80px;top:300px;width:920px;height:270px', .2);
  chip(a, 'ความเชื่อ', .35, 'left:40px;top:40px', {icon: 'x'});
  toggle(a, false, .4, 'left:780px;top:40px');
  title(a, 'ต้องรอไอเดียที่ ~เจ๋งพอ~', .5, 'left:40px;top:140px', {size: 52, W: 840});
  const b = box(s, 'left:80px;top:600px;width:920px;height:270px', .6, {style: 'accent'});
  chip(b, 'ความจริง', .75, 'left:40px;top:40px', {icon: 'check', style: 'ink'});
  title(b, 'ไอเดียดี ๆ ผุดขึ้นระหว่างทาง', .85, 'left:40px;top:140px', {size: 52, W: 840, color: 'var(--acc-ink)'});
});

/* L3 light · step 01 */
slide({tone: 'light'}, s => {
  num(s, '01', .05, 'left:72px;top:190px', {size: 240});
  title(s, 'ไอเดียแรก\nไม่ต้อง{ล้ำ}', .25, 'left:80px;top:470px', {size: 96});
  body(s, 'เรามักคิดว่ามันยังไม่เจ๋งพอ ไม่ล้ำพอ\nแล้วก็วนคิดไอเดียที่ดีกว่าเดิมไม่จบ', .55, 'left:80px;top:720px', {W: 760, size: 36});
  icon(s, 'lightbulb', .4, 'left:760px;top:220px', {size: 170, style: 'accent'});
});

/* L4 dark · step 02 + glowing growth line */
slide({tone: 'dark'}, s => {
  num(s, '02', .05, 'left:72px;top:130px', {size: 240});
  title(s, 'Facebook วันแรก\nก็ไม่ใช่แบบ[ทุกวันนี้]', .2, 'left:80px;top:420px', {size: 76});
  const b = box(s, 'left:80px;top:650px;width:920px;height:260px', .4);
  line(b, [[30, 210], [250, 190], [470, 150], [680, 90], [860, 30]], .6, 'left:0;top:0', {w: 920, h: 260});
  chip(b, 'ตอนเริ่ม', .7, 'left:24px;top:24px', {style: 'soft'});
  chip(b, 'ทุกวันนี้', 1.4, 'left:660px;top:90px', {style: 'accent'});
});

/* L5 light · step 03 + path ending on a bulb */
slide({tone: 'light'}, s => {
  num(s, '03', .05, 'left:72px;top:130px', {size: 240});
  title(s, 'ไอเดียผุดขึ้น\nระหว่าง[ลงมือทำ]', .2, 'left:80px;top:420px', {size: 92});
  path(s, [[0, 200], [260, 120], [520, 170], [800, 40]], .5, 'left:80px;top:640px', {w: 860, h: 260, iconName: 'lightbulb', color: 'var(--acc-text)'});
});

/* L6 accent · big quote */
slide({tone: 'accent'}, s => {
  icon(s, 'quote', .05, 'left:60px;top:190px', {size: 240, style: 'plain', fl: false, color: 'var(--fg)'});
  title(s, 'เริ่มทำเลย\nอยากทำอะไร\nเริ่มทำ', .2, 'left:80px;top:450px', {size: 120, lh: 1.08});
});

/* L7 dark · CTA */
slide({tone: 'dark'}, s => {
  title(s, 'เซฟไว้\nวันที่[ลังเล]', .05, 'left:80px;top:300px', {size: 120, lh: 1.08});
  cta(s, 'เริ่มวันนี้', .5, 'left:80px;top:640px');
  coin(s, .4, 'left:700px;top:560px', {size: 240, iconName: 'rocket', tilt: 12});
});
