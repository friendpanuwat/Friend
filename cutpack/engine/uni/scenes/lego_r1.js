/* =====================================================================
   CutPack · uni · LEGO step 3, round 1 (Friend 2026-11-07: "ดีเลยครับ" → step 3)
   Five new story frames chosen from what the AI could not tell in the recipe tests (it fell back on icon swaps):
     chain  (เหตุ → ผล)   domino: things fall onto the next one · arrows: impact travels along a row
     number (ตัวเลขเด่น)   a big number counts to the value the speaker SAID, with its unit
     warn   (คำเตือน)     a warning sign lands on the risky thing; it is crossed, or just flagged
     time   (เวลา)        line: a marker travels along three moments · clock: time runs, then the result
     chat   (คำพูด/แชต)   a phone where messages pop in turn; a reaction at the end
   New parts (kit-level helpers here, all painted by role classes the styles already have): domino, counter,
   pulse, track, clock, phone, bubble. Same rules as every base scene: no colour, font or speed in here.
   ===================================================================== */
const R1 = {
  /* a tall tile with an icon that can tip over its bottom-right corner */
  domino(K, parent, cx, base, w, h, it, t) {
    const n = node(parent, cx - w / 2, base - h, w, h, `u-badge u-${it.tone ?? 'main'} u-tile`, ICO(it.icon, Math.round(w * .55)));
    n.p.style.borderRadius = `calc(${w}px * var(--tile-r))`; n.m.style.transformOrigin = '100% 100%';
    K.enter(n.o, t, 'rise');
    let a = 0;
    return Object.assign(n, {tip(t, deg) { K.move(n.m, t, `rotate(${a}deg)`, `rotate(${deg}deg)`, {kind: 'tilt'}); a = deg; }});
  },
  /* a big number that counts from 0 to the value said (recomputed on every seek, so it is exact frame by frame) */
  counter(K, parent, cx, cy, size, t, value, d = 1.1) {
    const m = String(value).match(/^([^\d]*)([\d,.]+)(.*)$/);
    const box = div(`left:${cx - 400}px;top:${cy - size * .62}px;width:800px;height:${size * 1.25}px;display:flex;justify-content:center;align-items:center`, parent);
    const el = document.createElement('span'); el.className = 'u-num'; el.style.fontSize = size + 'px'; el.textContent = String(value); box.appendChild(el);
    K.enter(box, t, 'pop');
    if (m) {
      const to = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, comma = m[2].includes(',');
      const fmt = v => m[1] + (comma ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec)) + m[3];
      HOOKS.push(tt => { const k = Math.min(1, Math.max(0, (tt - t) / d)); el.textContent = fmt(to * (1 - Math.pow(1 - k, 3))); });
    }
    return box;
  },
  /* a ring that spreads and fades (an alarm, an impact) */
  pulse(K, parent, cx, cy, r, t, n = 2, tone = 'neg') {
    for (let i = 0; i < n; i++) {
      const c = div(`left:${cx - r}px;top:${cy - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;opacity:0`, parent); c.className = `u-pulse u-pulse-${tone}`;
      A(c, [{opacity: .9, transform: 'scale(.55)'}, {opacity: 0, transform: 'scale(1.5)'}], t + i * .35, .8, {e: EASE.out, f: 'none'});
    }
  },
  /* a phone frame; content goes in .p, the screen starts below the notch */
  phone(K, x, y, w, h, t) {
    const P = K.panel(x, y, w, h, t);
    P.p.classList.add('u-phone'); P.p.style.borderRadius = '56px';
    const notch = div(`left:${w / 2 - 70}px;top:22px;width:140px;height:26px;border-radius:13px`, P.p); notch.className = 'u-skel';
    return P;
  },
  /* a chat bubble: left = the other person (a card), right = me (the accent) */
  bubble(K, parent, x, y, w, side, t, label) {
    const h = label ? 104 : 96;
    const n = node(parent, side === 'left' ? x : x - w, y, w, h, side === 'left' ? 'u-panel u-bubble' : 'u-badge u-acc u-bubble');
    n.p.style.borderRadius = side === 'left' ? '34px 34px 34px 10px' : '34px 34px 10px 34px';
    if (label) { const l = div('left:0;top:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;white-space:nowrap;font-size:42px', n.p); l.className = 'u-label u-bubble-text'; l.textContent = label; }
    else K.skel(n.p, 34, 28, [w - 120, (w - 120) * .6], t + .1, {h: 14, gap: 14});
    n.o.style.transformOrigin = side === 'left' ? '0 100%' : '100% 100%';
    K.enter(n.o, t, 'pop'); return n;
  },
};

/* ---------- เหตุ → ผล ---------- */
LAYOUT('chain', {name: 'เหตุ → ผล'}, (K, r, T) => {
  const its = r.items, xs = [230, 500, 770], when = [T.b[0], T.b[1], T.b[2]];
  if (r.as === 'arrows') {
    const nodes = its.map((it, i) => {
      const c = K.panel(xs[i] - 115, 150, 230, 290, when[i]);
      const b = K.badge(c.p, it.icon, 115, 115, 140, when[i] + .1, {tone: it.tone ?? (i === 2 ? 'acc' : 'main')});
      if (it.label) K.chipC(c.p, it.label, 115, 236, when[i] + .25, {size: 38}); else K.skel(c.p, 55, 228, [120], when[i] + .25);
      if (i) { K.sat(K.stage, 'arrow-right', (xs[i - 1] + xs[i]) / 2, 295, 64, when[i] - .25, {tone: 'soft', shape: 'round', k: .5}); R1.pulse(K, c.p, 115, 115, 110, when[i] + .2, 1, 'acc'); }
      return {c, b};
    });
    K.halo(nodes[2].c.p, 115, 115, 120, T.hit);
    K.punch(nodes[2].c.p, T.hit);
    K.move(nodes[2].c.m, T.after, 'none', 'translateY(-16px) scale(1.05)');
  } else {                                                                   // dominoes
    const dx = [190, 430, 670];                                              // 240 apart: a tile 250 tall leaning 28° touches the next one
    const ds = its.map((it, i) => R1.domino(K, K.stage, dx[i], 560, 140, 250, {...it, tone: it.tone ?? (i === 2 ? 'acc' : 'main')}, T.b[0] + i * .12));
    const floor = div('left:0;top:0;width:1000px;height:700px', K.stage, '<svg width="1000" height="700" style="overflow:visible"><path class="ln u-thin" d="M120 562H900"/></svg>');
    K.draw(floor.querySelector('path'), T.b[0]);
    ds[0].tip(T.b[1], 28); ds[1].tip(T.b[2], 28);
    ds[0].tip(T.b[2] + .05, 44); ds[2].tip(T.hit - .1, 64);                  // the last one falls on the key word
    R1.pulse(K, K.stage, 820, 520, 120, T.hit);
    its.forEach((it, i) => { if (it.label) K.chipC(K.stage, it.label, dx[i], 640, T.b[0] + i * .12 + .3, {size: 38}); });
  }
  if (r.end) { K.halo(K.stage, 860, 140, 110, T.after); K.sat(K.stage, r.end.icon, 860, 140, 120, T.after, {tone: r.end.tone ?? 'acc'}); }
});

/* ---------- ตัวเลขเด่น ---------- */
LAYOUT('number', {name: 'ตัวเลขเด่น'}, (K, r, T) => {
  K.ghost(K.stage, 210, 110, 640, 470, T.b[0] - .05);
  const P = K.panel(180, 80, 640, 470, T.b[0]);
  K.halo(P.p, 320, 210, 200, T.b[1]);
  R1.counter(K, P.p, 320, 210, 230, T.b[1], r.value, T.hit - T.b[1]);
  if (r.unit) K.chipC(P.p, r.unit, 320, 380, T.hit - .2, {size: 52, tone: 'acc'});
  if (r.icon) K.sat(K.stage, r.icon, 210, 90, 120, T.b[0] + .2, {tone: 'main'});
  if (r.dir) K.sat(K.stage, r.dir === 'down' ? 'trending-down' : 'trending-up', 820, 130, 104, T.hit, {tone: r.dir === 'down' ? 'soft' : 'acc'});
  K.sat(K.stage, 'sparkles', 800, 520, 72, T.after, {tone: 'acc'});
});

/* ---------- คำเตือน ---------- */
LAYOUT('warn', {name: 'คำเตือน'}, (K, r, T) => {
  const it = r.thing;
  K.ghost(K.stage, 240, 130, 520, 460, T.b[0] - .05);
  const P = K.panel(210, 100, 520, 460, T.b[0]);
  const hero = K.badge(P.p, it.icon, 260, 190, 200, T.b[0] + .15, {tone: it.tone ?? 'main'});
  K.float(hero, T.b[0] + .8, T.b[2]);
  if (it.label) K.chipC(P.p, it.label, 260, 355, T.b[0] + .3, {size: 44}); else K.skel(P.p, 130, 340, [260, 170], T.b[0] + .3);
  const sign = K.sat(K.stage, r.sign ?? 'triangle-alert', 760, 130, 150, T.b[1], {tone: 'neg'});
  R1.pulse(K, K.stage, 760, 130, 130, T.b[1] + .1, 3);
  K.shake(sign.p, T.b[2]);
  if (r.how === 'cross') { K.mark(P.p, 'cross', 430, 60, 96, T.hit); K.fade(hero.o, T.hit + .1, 1, .45); }
  else { K.shake(P.p, T.hit); R1.pulse(K, P.p, 260, 190, 150, T.hit, 2); }
});

/* ---------- เวลา ---------- */
LAYOUT('time', {name: 'เวลา'}, (K, r, T) => {
  if (r.as === 'clock') {
    K.halo(K.stage, 360, 330, 230, T.b[0]);
    const R = 210;
    const face = node(K.stage, 360 - R, 330 - R, 2 * R, 2 * R, '', `<svg width="${2 * R}" height="${2 * R}" style="overflow:visible"><circle class="u-tgt" cx="${R}" cy="${R}" r="${R}"/>` +
      [...Array(12)].map((_, i) => { const a = i * Math.PI / 6, r0 = R * .8, r1 = R * .9; return `<path class="ln u-thin" d="M${(R + r0 * Math.sin(a)).toFixed(1)} ${(R - r0 * Math.cos(a)).toFixed(1)}L${(R + r1 * Math.sin(a)).toFixed(1)} ${(R - r1 * Math.cos(a)).toFixed(1)}"/>`; }).join('') + '</svg>');
    K.enter(face.o, T.b[0], 'pop');
    const hand = (len, w, cls) => { const n = node(K.stage, 360 - w / 2, 330 - len, w, len, '', `<svg width="${w}" height="${len}" style="overflow:visible"><path class="${cls}" d="M${w / 2} ${len}V0"/></svg>`); n.m.style.transformOrigin = `${w / 2}px ${len}px`; K.enter(n.o, T.b[0] + .2, 'pop'); return n; };
    const hh = hand(R * .5, 20, 'ln'), mh = hand(R * .78, 20, 'ln u-thin');
    const turns = r.turns ?? 3;
    A(mh.m, [{transform: 'rotate(0deg)'}, {transform: `rotate(${360 * turns}deg)`}], T.b[1], T.hit - T.b[1], {e: EASE.inout, f: 'forwards'});
    A(hh.m, [{transform: 'rotate(0deg)'}, {transform: `rotate(${30 * turns}deg)`}], T.b[1], T.hit - T.b[1], {e: EASE.inout, f: 'forwards'});
    const dot = div('left:340px;top:310px;width:40px;height:40px', K.stage, '<svg width="40" height="40"><circle class="ac u-dotc" cx="20" cy="20" r="14"/></svg>'); K.enter(dot, T.b[0] + .25, 'pop');
    if (r.icon) { K.halo(K.stage, 760, 330, 150, T.hit); K.sat(K.stage, r.icon, 760, 330, 170, T.hit, {tone: r.tone ?? 'acc'}); }
    K.sat(K.stage, 'hourglass', 640, 120, 84, T.b[1] + .2, {tone: 'soft'});
    return;
  }
  const pts = r.points, xs = [180, 500, 820], y = 360;                      // a line with three moments
  const line = div('left:0;top:0;width:1000px;height:700px', K.stage, `<svg width="1000" height="700" style="overflow:visible"><path class="ln" d="M120 ${y}H880"/></svg>`);
  K.draw(line.querySelector('path'), T.b[0]);
  const stops = pts.map((p, i) => {
    const b = K.badge(K.stage, p.icon, xs[i], y - 140, 140, T.b[0] + .2 + i * .15, {tone: p.tone ?? 'main'});
    const d = div(`left:${xs[i] - 18}px;top:${y - 18}px;width:36px;height:36px`, K.stage, '<svg width="36" height="36"><circle class="sd" cx="18" cy="18" r="13"/></svg>'); K.enter(d, T.b[0] + .2 + i * .15, 'pop');
    if (p.label) K.chipC(K.stage, p.label, xs[i], y + 80, T.b[0] + .35 + i * .15, {size: 40});
    return b;
  });
  const mk = node(K.stage, xs[0] - 30, y - 30, 60, 60, '', '<svg width="60" height="60"><circle class="ac" cx="30" cy="30" r="24"/></svg>');
  K.enter(mk.o, T.b[1] - .2, 'pop');
  K.move(mk.m, T.b[1], 'translateX(0px)', `translateX(${xs[1] - xs[0]}px)`);
  K.move(mk.m, T.b[2] + .2, `translateX(${xs[1] - xs[0]}px)`, `translateX(${xs[2] - xs[0]}px)`);
  const at = r.at ?? 2;
  K.halo(K.stage, xs[at], y - 140, 120, T.hit);
  LG.light(K, K.stage, pts[at].icon, xs[at], y - 140, 140, T.hit);
  K.sat(K.stage, 'sparkles', xs[at] + 100, y - 230, 72, T.after, {tone: 'acc'});
  stops.forEach((b, i) => { if (i < at) K.fade(b.o, T.hit, 1, .5); });
});

/* ---------- แชต / คำพูด ---------- */
LAYOUT('chat', {name: 'แชต / คำพูด'}, (K, r, T) => {
  const P = R1.phone(K, 250, 0, 500, 690, T.b[0]);
  const bs = r.bubbles.slice(0, 4), n = bs.length;
  const when = LG.spread(T.b[0] + .4, T.hit - .1, n);
  const nodes = bs.map((b, i) => R1.bubble(K, P.p, b.side === 'right' ? 460 : 40, 90 + i * 132, b.label ? Math.min(420, 90 + b.label.length * 34) : 340, b.side ?? (i % 2 ? 'right' : 'left'), when[i], b.label));
  K.punch(nodes[n - 1].p, T.hit + .05);
  if (r.react) { const s = K.sat(K.stage, r.react, 760, 90 + (n - 1) * 132 + 40, 110, T.after, {tone: 'acc', shape: 'round'}); R1.pulse(K, K.stage, 760, 90 + (n - 1) * 132 + 40, 90, T.after, 1, 'acc'); }
  if (r.seen) { K.fade(nodes[n - 1].o, T.after + .3, 1, .4); K.sat(K.stage, 'eye-off', 760, 590, 90, T.after + .3, {tone: 'soft'}); }
});

/* ================= sample recipes of round 1 (3 per frame) ================= */
RECIPE('r1.chain-post', {meaning: 'cause-effect', name: 'ไม่สม่ำเสมอ → คนลืม → ยอดตก', say: ['โพสต์ไม่สม่ำเสมอ คนก็ลืม', 'ยอดตก'], layout: 'chain', as: 'domino',
  items: [{icon: 'calendar-x'}, {icon: 'eye-off'}, {icon: 'trending-down'}], end: {icon: 'circle-alert', tone: 'neg'}, recipe: 'เหตุ → ผล + โดมิโน 3 ตัว ปฏิทินขาด → ไม่มีใครเห็น → ยอดลง'});
RECIPE('r1.chain-word', {meaning: 'cause-effect', name: 'พอใจ → บอกต่อ → ยอดเพิ่ม', say: ['ลูกค้าพอใจ ก็บอกต่อ', 'ยอดเพิ่มเอง'], layout: 'chain', as: 'arrows',
  items: [{icon: 'smile', label: 'พอใจ'}, {icon: 'megaphone', label: 'บอกต่อ'}, {icon: 'trending-up', label: 'ยอดเพิ่ม'}], recipe: 'เหตุ → ผล + 3 การ์ดมีลูกศร แรงส่งวิ่งไปทีละการ์ด'});
RECIPE('r1.chain-diet', {meaning: 'cause-effect', name: 'อดหนัก → หิวจัด → กินหนัก', say: ['ยิ่งอดหนัก ยิ่งหิวจัด', 'กินหนักกว่าเดิม'], layout: 'chain', as: 'domino',
  items: [{icon: 'utensils-crossed'}, {icon: 'battery-low'}, {icon: 'pizza'}], recipe: 'เหตุ → ผล + โดมิโน 3 ตัว อดอาหาร → หมดแรง → กินหนัก'});
RECIPE('r1.num-years', {meaning: 'big-number', name: '4 ปี', say: ['ผมทำคลิปมา', '4 ปี'], layout: 'number', value: '4', unit: 'ปี', icon: 'video', recipe: 'ตัวเลขเด่น + 0 นับถึง 4 + แคปซูล "ปี"'});
RECIPE('r1.num-percent', {meaning: 'big-number', name: 'ยอดเพิ่ม 30%', say: ['ยอดขายเพิ่มขึ้น', '30%'], layout: 'number', value: '30%', unit: 'ยอดขาย', icon: 'shopping-cart', dir: 'up', recipe: 'ตัวเลขเด่น + 0 นับถึง 30% + ลูกศรขึ้น'});
RECIPE('r1.num-one', {meaning: 'big-number', name: 'เหลือ 1 คน', say: ['จากสิบคน เหลือแค่', '1 คน'], layout: 'number', value: '1', unit: 'คน', icon: 'users', dir: 'down', recipe: 'ตัวเลขเด่น + เหลือ 1 + ลูกศรลง'});
RECIPE('r1.warn-diet', {meaning: 'warning', name: 'อย่าโรแมนติไซส์การอดอาหาร', say: ['อย่าโรแมนติไซส์', 'การอดอาหาร'], layout: 'warn', thing: {icon: 'utensils-crossed'}, how: 'cross', recipe: 'คำเตือน + การ์ดอดอาหาร + ป้ายเตือนเด้ง แล้วโดนกากบาท'});
RECIPE('r1.warn-ads', {meaning: 'warning', name: 'ระวังโฆษณาเกินจริง', say: ['ระวัง', 'โฆษณาเกินจริง'], layout: 'warn', thing: {icon: 'megaphone', label: 'โฆษณา'}, recipe: 'คำเตือน + การ์ดโฆษณา + ป้ายเตือนเด้ง การ์ดสั่น'});
RECIPE('r1.warn-loan', {meaning: 'warning', name: 'อย่ากู้มาลงทุน', say: ['อย่ากู้เงิน', 'มาลงทุน'], layout: 'warn', thing: {icon: 'landmark'}, sign: 'octagon-alert', how: 'cross', recipe: 'คำเตือน + การ์ดธนาคาร + ป้ายหยุด แล้วโดนกากบาท'});
RECIPE('r1.time-line', {meaning: 'timeline', name: 'วันแรก เดือนแรก ปีแรก', say: ['วันแรก เดือนแรก', 'ปีแรก'], layout: 'time', as: 'line',
  points: [{icon: 'sprout', label: 'วันแรก'}, {icon: 'users', label: 'เดือนแรก'}, {icon: 'store', label: 'ปีแรก'}], recipe: 'เวลา + เส้นเวลา 3 จุด ตัวชี้วิ่งไปถึงปีแรก'});
RECIPE('r1.time-clock', {meaning: 'timeline', name: 'เวลาผ่านไป ยอดไม่ขยับ', say: ['เวลาผ่านไปเป็นเดือน', 'ยอดไม่ขยับ'], layout: 'time', as: 'clock', icon: 'chart-no-axes-column', tone: 'soft', turns: 4, recipe: 'เวลา + นาฬิกาหมุนเร็ว + กราฟนิ่ง'});
RECIPE('r1.time-grow', {meaning: 'timeline', name: 'จากศูนย์ จนมีร้าน', say: ['เริ่มจากศูนย์ จนวันนี้', 'มีหน้าร้าน'], layout: 'time', as: 'line',
  points: [{icon: 'sprout', label: 'ศูนย์'}, {icon: 'users'}, {icon: 'store', label: 'หน้าร้าน'}], recipe: 'เวลา + เส้นเวลา ต้นอ่อน → คน → ร้าน'});
RECIPE('r1.chat-price', {meaning: 'quote', name: 'ทักมาถามราคา แล้วหายไป', say: ['ลูกค้าทักมาถามราคา', 'แล้วหายไป'], layout: 'chat',
  bubbles: [{side: 'left', label: 'ราคาเท่าไร'}, {side: 'right'}, {side: 'left'}], seen: true, recipe: 'แชต + ลูกค้าถามราคา เราตอบ แล้วข้อความสุดท้ายจางไป'});
RECIPE('r1.chat-review', {meaning: 'quote', name: 'คอมเมนต์ว่าได้ผล', say: ['คอมเมนต์ว่า ลองแล้ว', 'ได้ผลจริง'], layout: 'chat',
  bubbles: [{side: 'left'}, {side: 'left', label: 'ได้ผลจริง'}], react: 'heart', recipe: 'แชต + คอมเมนต์เด้งขึ้น 2 อัน อันสุดท้ายเด่น + หัวใจ'});
RECIPE('r1.chat-ask', {meaning: 'quote', name: 'ถามว่าเริ่มยังไง', say: ['ทุกคนถามว่า', 'เริ่มยังไง'], layout: 'chat',
  bubbles: [{side: 'left'}, {side: 'left'}, {side: 'left', label: 'เริ่มยังไง'}], react: 'lightbulb', recipe: 'แชต + คำถามเด้งรัว 3 อัน + หลอดไฟ'});
