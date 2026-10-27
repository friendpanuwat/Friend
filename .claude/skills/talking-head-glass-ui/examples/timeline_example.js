/* Example timeline — clip "เริ่มทำไปก่อน" (first 24 s, Thai). Every widget type + screen + cutaway.
   Zones from grid.jpg: face y 240–1120 (chin 1120) → captions top 1170, widgets y 1260–1620 (or beside / above the head).
   img/start.jpg   = a frame of the clip at 0.3 s cropped to the face (ffmpeg crop) — used as thumbnail + polaroid
   img/closeup.jpg = a frame at 14.5 s cropped tighter — used as the cutaway picture (no user B-roll for this clip)
   Times come from chunks.json; each block = one caption chunk (+ its widget / camera move). */

/* 1 · เวลาเรา มีไอเดีย ที่อยากจะเริ่มทำธุรกิจ */
cap({t0: 0, t1: 1.98, top: 1170, lead: [['เวลาเรา', .05]], key: [['มีไอเดีย', .47]], tail: [['ที่อยากจะ', 1.0], ['เริ่มทำธุรกิจ', 1.36]]});
keyHit(.47);
{ const w = widget('left:800px;top:330px;width:200px;height:200px', .5, 1.98, {enter: 'none', sound: null});
  tile(w, '💡', .5, 'left:0;top:0', {size: 180, tone: 'light'}); }

/* 2 · บางทีเราก็ คิดว่าแบบ เฮ้ย! */
blurIn(2.0);
cap({t0: 2.0, t1: 4.9, top: 1170, lead: [['บางทีเราก็', 2.0], ['คิดว่าแบบ', 3.0]], key: [['เฮ้ย!', 3.75]], size: {k: 150}});
keyHit(3.75); push(3.75, 4.9, {z: 1.22, x: 520, y: 900, d: .22}); shake(3.78, {a: 10});

/* 3 · มันยังไม่ เจ๋งพอ · ล้ำพอ · ดีพอ — red-x glass pills, the hand taps each one */
cap({t0: 4.93, t1: 8.58, top: 1170, lead: [['มันยังไม่...', 4.93]]});
{ const w = widget('left:200px;top:1260px;width:680px;height:360px', 5.0, 8.58, {enter: 'none', sound: null});
  gpill(w, 'เจ๋งพอ', 5.05, 'left:0;top:0', {icon: 'x'});
  gpill(w, 'ล้ำพอ', 5.9, 'left:0;top:120px', {icon: 'x'});
  gpill(w, 'ดีพอ', 7.12, 'left:0;top:240px', {icon: 'x'});
  hand(w, [[5.3, 470, 210], [5.55, 250, 52], [6.2, 230, 172], [7.35, 210, 292], [8.0, 330, 345]], [5.58, 6.22, 7.4]); }

/* 4 · แล้วเราก็มัวแต่ไปวน … ดีกว่าเดิม ×3 ใช่ปะ? — the speaker shrinks into an app tile on a sky page */
{ const s = screen(8.61, 12.6, {face: [520, 700, 820], to: [540, 520, 420], out: 'cut'});
  const h = div('left:0;width:1080px;top:800px;display:flex;justify-content:center', s);
  label(h, 'แล้วเราก็มัวแต่ไปวน', 8.85, 'position:relative', {size: 66, color: NAVY, font: 'UiBold'});
  srow(s, '💡', 'ไอเดีย v1 ดีกว่าเดิม', 11.0, 'left:250px;top:960px', {size: 52});
  srow(s, '✨', 'ไอเดีย v2 ดีกว่าเดิม', 11.57, 'left:250px;top:1060px', {size: 52});
  srow(s, '🚀', 'ไอเดีย v3 ดีกว่าเดิม', 12.0, 'left:250px;top:1160px', {size: 52, mark: true});
  srow(s, '🤔', 'ใช่ปะ?', 12.3, 'left:250px;top:1280px', {size: 52}); }

/* 5 · ผมจะบอกว่า สุดท้าย ตรงนั้น... */

cap({t0: 12.6, t1: 13.98, top: 1170, lead: [['ผมจะบอกว่า', 12.6]], key: [['สุดท้าย', 13.0]], tail: [['ตรงนั้น...', 13.45]]});
keyHit(13.0);

/* 6 · มันจะกลายเป็น ลูปนรก — full-screen cutaway, torn paper + flying sheets */
cutaway(14.0, 15.0, {src: 'img/closeup.jpg', papers: 9});
cap({t0: 14.0, t1: 14.98, top: 1170, lead: [['มันจะกลายเป็น', 14.0]], key: [['ลูปนรก', 14.45]], size: {k: 160}});
keyHit(14.45); shake(14.47, {a: 12});

/* 7 · แล้วเราก็จะ ไม่ได้เริ่มทำ สักที — progress card that barely moves */
blurIn(15.0, {px: 20});
cap({t0: 15.0, t1: 15.98, top: 1170, lead: [['แล้วเราก็จะ', 15.0], ['ไม่ได้เริ่มทำ', 15.38]], key: [['สักที', 15.7]]});
keyHit(15.7);
{ const w = widget('left:160px;top:1400px', 15.2, 15.98);
  progress(w, 15.2, 'left:0;top:0', {img: 'img/start.jpg', title: 'ธุรกิจของฉัน', label: 'ยังไม่เริ่ม', from: 0, to: .05, tFill: 15.4, dFill: .5}); }

/* 8 · คือ ไอเดียเจ๋ง ๆ หลาย ๆ ไอเดีย — emoji bubbles */
cap({t0: 16.0, t1: 17.98, top: 1170, lead: [['คือ', 16.0]], key: [['ไอเดียเจ๋ง ๆ', 16.15]], tail: [['หลาย ๆ ไอเดีย', 17.0]]});
keyHit(16.15); zoom(16.15, 1.06, .6); zoom(18.0, 1.0, .3);
{ const w = widget('left:90px;top:1440px;width:900px;height:180px', 16.4, 17.98, {enter: 'none', sound: null});
  bubbleE(w, '💡', 'ไอเดีย', 16.45, 'left:0;top:20px');
  bubbleE(w, '🔥', 'ไอเดีย', 17.0, 'left:320px;top:70px');
  bubbleE(w, '✨', 'ไอเดีย', 17.35, 'left:640px;top:0px', {side: 'right'}); }

/* 9 · ของบริษัท ระดับโลก หรือธุรกิจอะไรหลาย ๆ อย่าง — white pill, blue fill sweeps, globe burst */
whip(18.0, {dir: 'up'});
cap({t0: 18.0, t1: 18.98, top: 1170, lead: [['ของบริษัท', 18.0]]});
push(18.95, 20.0, {z: 1.18, x: 540, y: 760, d: .3, blur: 6});
{ const w = widget('left:240px;top:1250px', 18.95, 19.98, {enter: 'none', sound: null});
  recommend(w, 'ระดับโลก', 19.0, 'left:0;top:0', {tFill: 19.3, size: 64, burstWith: '🌍'}); }
cap({t0: 20.0, t1: 21.98, top: 1170, lead: [['หรือธุรกิจอะไร', 20.0]], key: [['หลาย ๆ อย่าง', 20.6]]});
keyHit(20.6);
{ const w = widget('left:250px;top:1420px;width:600px;height:200px', 20.7, 21.98, {enter: 'none', sound: null});
  gpill(w, 'ธุรกิจ', 20.75, 'left:0;top:0', {icon: 'shield'});
  gpill(w, 'บริษัท', 21.05, 'left:0;top:112px', {icon: 'shield'}); }

/* 10 · มันไม่ได้เป็นอย่างนั้น ตั้งแต่แรก นึกออกมั้ย? — polaroid of the first frame */
blurIn(22.0, {px: 20});
cap({t0: 22.0, t1: 30, top: 1170, lead: [['มันไม่ได้', 22.0], ['เป็นอย่างนั้น', 22.26]], key: [['ตั้งแต่แรก', 22.63]], tail: [['นึกออกมั้ย?', 23.05]]});
keyHit(22.63);
{ const w = widget('left:670px;top:96px', 22.7, 30, {enter: 'none', sound: null});
  polaroid(w, 'img/start.jpg', 'ตอนเริ่ม', 22.7, 'left:0;top:0', {w: 300, h: 234, tag: 'วันแรก', rot: 5}); }
sfx('sub', 23.05, -18);
