/* Example — "เริ่มทำไปก่อน" first 24 s (Thai), planned from the MEANING of each line, not from the reference's props.
   Story: we wait for a "perfect" idea → we keep polishing versions → it becomes a loop → we never start
          → world-class ideas weren't like that on day one.
   Zones (grid.jpg): face y 240–1120 → caption unit centred on x 540, lead/key from y 1150; widgets below it, never past y 1620.
   Frames step ran with LOOK=clean (dark phone footage). */

/* 1 · hook — caption only, slow push on the face */
zoom(0, 1.07, 1.9);
cap({t0: 0, t1: 1.98, top: 1150, lead: [['เวลาเรา', .05]], key: [['มีไอเดีย', .47]], tail: [['ที่อยากจะ', 1.0], ['เริ่มทำธุรกิจ', 1.36]]});
keyHit(.47);

/* 2 · the doubt — punch in on "เฮ้ย!" */
blurIn(2.0); zoom(2.0, 1.0, .01);
cap({t0: 2.0, t1: 4.9, top: 1150, lead: [['บางทีเราก็', 2.0], ['คิดว่าแบบ', 3.0]], key: [['เฮ้ย!', 3.75]], size: {k: 176}});
keyHit(3.75); push(3.75, 4.9, {z: 1.16, x: 540, y: 820, d: .2, blur: 5}); shake(3.78, {a: 8});

/* 3 · the checklist the idea "fails" — one card, rows land on each word, the finger ticks them off */
cap({t0: 4.93, t1: 8.58, top: 1150, lead: [['มันยังไม่...', 4.93]]});
{ const w = stack(1232, 460, 372, 4.98, 8.58, {enter: 'rise'});
  const c = gcard(w, 4.98, 'left:0;top:0', {w: 460, head: false,
    rows: [{icon: 'x', text: 'เจ๋งพอ', t: 5.05}, {icon: 'x', text: 'ล้ำพอ', t: 5.9}, {icon: 'x', text: 'ดีพอ', t: 7.12}]});
  hand(w, [[5.2, 420, 330], [5.45, c.badgeX, c.rowY(0)], [6.05, c.badgeX, c.rowY(1)], [7.25, c.badgeX, c.rowY(2)], [7.9, 300, 360]], [5.47, 6.07, 7.27]); }

/* 4 · polishing forever — a deck of versions, each "better" one lands on top */
blurIn(8.61, {px: 18});
cap({t0: 8.61, t1: 10.98, top: 1150, lead: [['แล้วเราก็', 8.65]], key: [['มัวแต่ไปวน', 9.0]]});
keyHit(9.0);
{ const w = stack(1166, 600, 270, 10.95, 12.58, {enter: 'none', sound: null});
  versions(w, [{icon: 'lightbulb', title: 'ไอเดีย v1', sub: 'ดีกว่าเดิม', t: 11.0}, {icon: 'sparkles', title: 'ไอเดีย v2', sub: 'ดีกว่าเดิม', t: 11.57},
               {icon: 'rocket', title: 'ไอเดีย v3', sub: 'ดีกว่าเดิม', t: 12.0}], 'left:0;top:0', {w: 600}); }
cap({t0: 12.3, t1: 12.58, top: 1470, lead: [['ใช่ปะ?', 12.3]], out: 'cut'});

/* 5 · the turn */
blurIn(12.6, {px: 18});
cap({t0: 12.6, t1: 13.98, top: 1150, lead: [['ผมจะบอกว่า', 12.6]], key: [['สุดท้าย', 13.0]], tail: [['ตรงนั้น...', 13.45]]});
keyHit(13.0); zoom(13.0, 1.06, .5);

/* 6 · the loop — the speaker shrinks into an app tile trapped inside a spinning loop arrow */
{ const s = screen(14.0, 15.98, {face: [520, 700, 820], to: [540, 560, 380], out: 'cut'});
  loopRing(s, 14.1, 540, 560, 290, {color: ACC, sw: 14});
  label(div('left:0;width:1080px;top:900px;display:flex;justify-content:center', s), 'มันจะกลายเป็น', 14.0, 'position:relative', {size: 54, color: NAVY, font: 'LeadIt'});
  bigWord(s, 'ลูปนรก', 14.45, 'top:975px', {size: 190, onLight: true}); shake(14.47, {a: 6});
  const r = div('left:0;width:1080px;top:1250px;display:flex;justify-content:center', s);
  srow(r, 'hourglass', 'แล้วเราก็จะไม่ได้เริ่มทำสักที', 15.0, 'position:relative', {size: 50}); }

/* 7 · breathing room — caption only */
cap({t0: 16.0, t1: 17.98, top: 1150, lead: [['คือ', 16.0]], key: [['ไอเดียเจ๋ง ๆ', 16.15]], tail: [['หลาย ๆ ไอเดีย', 17.0]]});
keyHit(16.15); zoom(16.15, 1.05, .6);

/* 8 · scale — whip in, push on "ระดับโลก" */
whip(18.0, {dir: 'up'}); zoom(18.0, 1.0, .01);
cap({t0: 18.0, t1: 19.98, top: 1150, lead: [['ของบริษัท', 18.0]], key: [['ระดับโลก', 19.0]]});
keyHit(19.0); push(19.0, 19.98, {z: 1.12, x: 540, y: 1240, d: .25, blur: 5});
cap({t0: 20.0, t1: 21.98, top: 1150, lead: [['หรือธุรกิจอะไร', 20.0]], key: [['หลาย ๆ อย่าง', 20.6]]});
keyHit(20.6);

/* 9 · payoff — "it wasn't like that on day one": day one → today */
blurIn(22.0, {px: 20});
cap({t0: 22.0, t1: 23.03, top: 1150, lead: [['มันไม่ได้', 22.0], ['เป็นอย่างนั้น', 22.26]], key: [['ตั้งแต่แรก', 22.63]]});
keyHit(22.63);
cap({t0: 23.05, t1: 30, top: 1150, lead: [['นึกออกมั้ย?', 23.05]]});
{ const w = stack(1232, 860, 340, 23.05, 30, {enter: 'none', sound: null});
  compare(w, 23.1, 'left:0;top:0', {w: 860, iconSize: 120, tB: 23.65,
    a: {icon: 'pencil', iconBg: 'white', title: 'วันแรก', sub: 'แค่ร่างแรก'}, b: {icon: 'rocket', title: 'วันนี้', sub: 'ระดับโลก'}}); }
sfx('sub', 23.65, -18);
