/* ===================== iOS MOTION GRAPHICS (experiment) — iOS design language, own compositions ===================== */
const SYS = {blue: '#0A84FF', green: '#30D158', red: '#FF453A', orange: '#FF9F0A', indigo: '#5E5CE6', purple: '#BF5AF2', teal: '#40C8E0', grey: '#8E8E93'};
const GLASS = 'background:rgba(250,250,252,.72);backdrop-filter:blur(30px) saturate(1.6);-webkit-backdrop-filter:blur(30px) saturate(1.6)';
const GLASS_DARK = 'background:rgba(40,40,46,.42);backdrop-filter:blur(30px) saturate(1.5);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.22)';
const SPRING_IOS = 'cubic-bezier(.2,1.25,.35,1)';
const outBackS = p => { const c = 1.2; return p <= 0 ? 0 : 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
const SYM = {   // line icons, viewBox 0 0 24 24
  chat: 'M4 5h16v11H9l-5 4z',
  scale: 'M12 4v16M6 20h12M4 9h16M7 9l-3 6a3 3 0 0 0 6 0zM17 9l-3 6a3 3 0 0 0 6 0z',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM10 9.5a2 2 0 1 1 2.6 1.9c-.6.2-.6.7-.6 1.3M12 15.5v.5',
  cart: 'M3 4h2l2.4 10h10.2L20 7H6.2M9 19a1 1 0 1 0 0 .1M17 19a1 1 0 1 0 0 .1',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',
  tag: 'M3 12V4h8l9 9-8 8zM7.5 7.5v.1',
  megaphone: 'M3 10v4h3l7 4V6L6 10zM16 9a4 4 0 0 1 0 6',
  x: 'M7 7l10 10M17 7L7 17',
  check: 'M6 12.5l4 4L18 8',
  q: 'M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.5v.6M12 16.5v.3',
};
const sym = (k, size, color, w = 2) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="${SYM[k]}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const appIcon = (k, bg, size = 84) => `<span style="flex:none;width:${size}px;height:${size}px;border-radius:${size * .24}px;background:${bg};display:flex;align-items:center;justify-content:center">${sym(k, size * .6, '#fff', 2.2)}</span>`;

/* full-screen layer that frosts the clip underneath (no flat background — the clip shows through, blurred) */
function iosScene(t0, t1, {tint = .28, blur = 36} = {}) {
  SCENE_WIN.push([t0, t1]);
  const root = div(`inset:0;background:rgba(0,0,0,${tint});backdrop-filter:blur(${blur}px) saturate(1.3);-webkit-backdrop-filter:blur(${blur}px) saturate(1.3);overflow:hidden`, S);
  life(root, t0, t1, [{opacity: 0}, {opacity: 1}], FADE_OUT, .22, .2, 'ease-out');
  HOOKS.push(t => { root.style.visibility = t >= t0 && t <= t1 ? 'visible' : 'hidden'; });
  return root;
}

/* notification banner — slides down, can show a receipt line, then swipes away */
function banner(parent, {app = 'ข้อความ', icon = 'chat', color = SYS.green, title = '', body = '', when = 'ตอนนี้', top = 560}) {
  return div(`left:30px;width:1020px;top:${top}px;padding:36px 40px 42px;border-radius:60px;${GLASS};box-shadow:0 20px 50px rgba(0,0,0,.25)`, parent,
    `<div style="display:flex;gap:30px;align-items:flex-start">${appIcon(icon, color, 112)}
      <div style="flex:1;min-width:0;font-family:RefSans;color:#111">
        <div style="display:flex;justify-content:space-between;font-size:38px;color:#6E6E73"><span>${app}</span><span>${when}</span></div>
        ${title ? `<div style="font-weight:600;font-size:62px;margin-top:4px">${title}</div>` : ''}
        <div class="bd" style="font-size:58px;line-height:1.3;margin-top:2px">${body}</div>
      </div></div>`);
}
function notif(t0, t1, {read, swipe, ...b} = {}) {
  const root = iosScene(t0, t1), n = banner(root, b);
  A(n, [{transform: 'translateY(-420px)'}, {transform: 'none'}], t0 + .05, .5, {e: SPRING_IOS});
  if (read != null) { const r = div(`position:relative;margin-top:14px;font-family:RefSans;font-size:44px;color:${SYS.blue}`, n.firstChild.children[1], 'อ่านแล้ว ✓');
    r.style.position = 'relative'; A(r, [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'none'}], read, .25); }
  if (swipe != null) A(n, [{transform: 'none', opacity: 1}, {transform: 'translateX(1150px)', opacity: .6}], swipe, .35, {e: 'cubic-bezier(.5,0,.8,.4)', f: 'forwards'});
}

/* island — black capsule at the top that expands and shows a thinking "?" */
function island(t0, t1) {
  const p = div('left:415px;top:36px;width:250px;height:74px;border-radius:37px;background:#000;overflow:hidden;display:flex;align-items:center;gap:26px;padding:0 34px;opacity:0', Q,
    `<span class="qi" style="flex:none;width:96px;height:96px;border-radius:50%;background:${SYS.orange};display:flex;align-items:center;justify-content:center">${sym('q', 70, '#fff', 2.4)}</span>
     <span style="font-family:RefSans;font-size:52px;color:#fff;white-space:nowrap">กำลังคิด</span>
     <span style="display:flex;gap:10px;margin-left:auto">${[0, 1, 2].map(i => `<i class="dt" style="width:16px;height:16px;border-radius:50%;background:#fff;display:block"></i>`).join('')}</span>`);
  A(p, [{opacity: 0, width: '250px', height: '74px', left: '415px', top: '36px'}, {opacity: 1, width: '250px', height: '74px', left: '415px', top: '36px', offset: .2},
        {opacity: 1, width: '760px', height: '160px', left: '160px', top: '40px', borderRadius: '80px'}], t0, .55, {e: SPRING_IOS});
  A(p, [{opacity: 1, width: '760px', height: '160px', left: '160px'}, {opacity: 0, width: '250px', height: '74px', left: '415px'}], t1 - .35, .35, {e: SMOOTH, f: 'forwards'});
  A(p.querySelector('.qi'), [{transform: 'rotate(-12deg) scale(1)'}, {transform: 'rotate(12deg) scale(1.08)'}], t0 + .5, .45, {it: Math.ceil((t1 - t0) / .45), dir: 'alternate', e: 'ease-in-out', f: 'none'});
  p.querySelectorAll('.dt').forEach((d, i) => A(d, [{opacity: .25}, {opacity: 1}, {opacity: .25}], t0 + .5 + i * .15, .7, {it: Math.ceil((t1 - t0) / .7), f: 'none'}));
}

/* frosted word — the whole frame blurs, a word types in, the blur clears back to the clip */
function blurWord(t0, t1, txt) {
  SCENE_WIN.push([t0, t1]);
  const root = div('inset:0;background:rgba(0,0,0,.18)', S);
  const tx = div('left:0;width:1080px;top:860px;text-align:center;font-family:RefSans;font-weight:300;font-size:100px', root);
  typeIn(tx, txt, t0 + .1, (t1 - t0) * .45, '#fff', '0 2px 20px rgba(0,0,0,.3)');
  HOOKS.push(t => { if (t < t0 || t > t1) { root.style.display = 'none'; return; } root.style.display = '';
    const p = Math.min(clamp((t - t0) / .2), clamp((t1 - t) / .35)), b = 40 * p;
    root.style.backdropFilter = root.style.webkitBackdropFilter = `blur(${b}px) saturate(${1 + .3 * p})`; tx.style.opacity = clamp((t1 - .3 - t) / .15 + 1) ; });
}

/* glass widget with rows — rows: [[symbol, colour, text, t]] */
function widget(t0, t1, {title = '', rows = []} = {}) {
  const root = iosScene(t0, t1);
  const w = div(`left:60px;width:960px;top:${960 - (110 + rows.length * 150) / 2}px;padding:40px 46px 24px;border-radius:64px;${GLASS_DARK}`, root,
    `<div style="font-family:RefSans;font-weight:600;font-size:36px;letter-spacing:1px;color:rgba(255,255,255,.65);margin-bottom:14px">${title}</div>`);
  A(w, [{opacity: 0, transform: 'scale(.9)'}, {opacity: 1, transform: 'none'}], t0, .4, {e: SPRING_IOS});
  rows.forEach(([k, c, txt, t]) => { const r = div('position:relative;display:flex;align-items:center;gap:32px;height:150px', w,
      `${appIcon(k, c, 96)}<span style="font-family:RefSans;font-size:60px;color:#fff;white-space:nowrap">${txt}</span>`);
    A(r, [{opacity: 0, transform: 'translateY(30px) scale(.96)'}, {opacity: 1, transform: 'none'}], t, .35, {e: SPRING_IOS}); });
}

/* focus mode — the frame dims, a moon capsule switches on */
function focusMode(t0, t1, {label = 'เงียบ', sub = 'เปิดอยู่'} = {}) {
  const root = iosScene(t0, t1, {tint: .45});
  const p = div(`left:110px;width:860px;top:840px;height:230px;border-radius:115px;${GLASS_DARK};display:flex;align-items:center;gap:34px;padding:0 34px`, root,
    `<span class="mn" style="flex:none;width:160px;height:160px;border-radius:50%;background:${SYS.indigo};display:flex;align-items:center;justify-content:center">${sym('moon', 76, '#fff', 2.2)}</span>
     <span style="font-family:RefSans;color:#fff"><div style="font-weight:600;font-size:78px;line-height:1.1">${label}</div><div style="font-size:44px;color:rgba(255,255,255,.65)">${sub}</div></span>`);
  A(p, [{opacity: 0, transform: 'scale(.7)'}, {opacity: 1, transform: 'none'}], t0 + .05, .45, {e: SPRING_IOS});
  A(p.querySelector('.mn'), [{transform: 'rotate(-120deg) scale(.4)', background: 'rgba(255,255,255,.2)'}, {transform: 'none', background: SYS.indigo}], t0 + .25, .5, {e: SPRING_IOS});
}

/* control tiles — a switch flips ON, a slider is dragged down: toggle [label, t], slider [label, t] */
function controls(t0, t1, {toggle, slider} = {}) {
  const root = iosScene(t0, t1, {tint: .35});
  const tile = (x, y, w, h, inner) => div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:64px;${GLASS_DARK};overflow:hidden`, root, inner);
  if (toggle) { const [lab, ton] = toggle;
    const tg = tile(80, 640, 520, 300, `<div style="position:absolute;left:44px;top:44px">${appIcon('megaphone', SYS.orange, 96)}</div>
      <div style="position:absolute;left:44px;bottom:42px;font-family:RefSans;font-weight:600;font-size:52px;color:#fff">${lab}</div>
      <div class="sw" style="position:absolute;right:44px;top:56px;width:150px;height:90px;border-radius:45px;background:rgba(255,255,255,.25)"><i class="kn" style="position:absolute;left:6px;top:6px;width:78px;height:78px;border-radius:50%;background:#fff;display:block;box-shadow:0 4px 10px rgba(0,0,0,.25)"></i></div>`);
    A(tg, [{opacity: 0, transform: 'scale(.85)'}, {opacity: 1, transform: 'none'}], t0, .4, {e: SPRING_IOS});
    A(tg.querySelector('.sw'), [{background: 'rgba(255,255,255,.25)'}, {background: SYS.green}], ton, .25);
    A(tg.querySelector('.kn'), [{transform: 'none'}, {transform: 'translateX(60px)'}], ton, .3, {e: SPRING_IOS}); }
  if (slider) { const [lab, td] = slider;
    const sl = tile(660, 520, 340, 760, `<div class="fl" style="position:absolute;left:0;right:0;bottom:0;height:78%;background:rgba(255,255,255,.92)"></div>
      <div style="position:absolute;left:0;right:0;bottom:60px;display:flex;justify-content:center">${sym('tag', 96, '#555', 2)}</div>`);
    div(`left:660px;width:340px;top:1310px;text-align:center;font-family:RefSans;font-weight:600;font-size:52px;color:#fff`, root, lab);
    A(sl, [{opacity: 0, transform: 'scale(.85)'}, {opacity: 1, transform: 'none'}], t0 + .1, .4, {e: SPRING_IOS});
    A(sl.querySelector('.fl'), [{height: '78%'}, {height: '18%'}], td, .55, {e: SPRING_IOS}); }
}

/* payment sheet — slides up, the confirm ring spins and stalls */
function paySheet(t0, t1, {title = 'ชำระเงิน', thought} = {}) {
  const root = iosScene(t0, t1, {tint: .4});
  const sh = div(`left:0;width:1080px;top:820px;height:1200px;border-radius:64px 64px 0 0;background:#F2F2F7;box-shadow:0 -20px 60px rgba(0,0,0,.3)`, root,
    `<i style="position:absolute;left:480px;top:22px;width:120px;height:12px;border-radius:6px;background:#C7C7CC;display:block"></i>
     <div style="position:absolute;left:0;width:1080px;top:70px;text-align:center;font-family:RefSans;font-weight:600;font-size:60px;color:#111">${title}</div>
     <div style="position:absolute;left:60px;right:60px;top:190px;height:170px;border-radius:34px;background:#fff;display:flex;gap:34px;align-items:center;padding:0 34px">
       <span style="flex:none;width:110px;height:110px;border-radius:24px;background:#E5E5EA"></span><span style="flex:1"><i style="display:block;height:26px;width:70%;border-radius:13px;background:#E5E5EA"></i><i style="display:block;height:26px;width:45%;border-radius:13px;background:#EFEFF4;margin-top:20px"></i></span></div>
     <svg style="position:absolute;left:430px;top:420px" width="220" height="220" viewBox="0 0 220 220"><circle cx="110" cy="110" r="90" fill="none" stroke="#E5E5EA" stroke-width="14"/>
       <circle class="rg" cx="110" cy="110" r="90" fill="none" stroke="${SYS.blue}" stroke-width="14" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" transform="rotate(-90 110 110)"/></svg>`);
  A(sh, [{transform: 'translateY(1150px)'}, {transform: 'none'}], t0 + .05, .55, {e: SPRING_IOS});
  const rg = sh.querySelector('.rg');
  A(rg, [{strokeDashoffset: 1}, {strokeDashoffset: .32, offset: .6}, {strokeDashoffset: .36, offset: .75}, {strokeDashoffset: .32}], t0 + .7, Math.max(1, t1 - t0 - 1), {e: 'ease-out'});
  if (thought) { const th = div('left:0;width:1080px;top:600px;text-align:center', root,
      `<span style="display:inline-block;padding:24px 46px 30px;border-radius:50px;${GLASS};font-family:RefSans;font-size:54px;color:#111;box-shadow:0 14px 40px rgba(0,0,0,.25)">${thought[0]}</span>`);
    A(th, [{opacity: 0, transform: 'translateY(30px) scale(.9)'}, {opacity: 1, transform: 'none'}], thought[1], .35, {e: SPRING_IOS}); }
}

/* stacked notifications — items: [[body, t]] newest on top, older ones slide down */
function notifStack(t0, t1, {app = 'ลูกค้า', items = []} = {}) {
  const root = iosScene(t0, t1);
  items.forEach(([body, t], i) => {
    const n = banner(root, {app, icon: 'chat', color: SYS.green, body, top: 420});
    A(n, [{opacity: 0, transform: 'translateY(-300px) scale(.96)'}, {opacity: 1, transform: 'none'}], t, .45, {e: SPRING_IOS});
    const later = items.slice(i + 1).map(([, tn]) => tn);   // each newer banner pushes this one down a slot
    HOOKS.push(u => { n.style.translate = `0 ${later.reduce((a, tn) => a + outBackS(clamp((u - tn) / .45)), 0) * 300}px`; });
  });
}

/* ✕ / ✓ list — items: [{text, t, keys, mark: 'x'|'check'}] */
function markList(t0, t1, items) {
  const el = div('left:100px;width:880px;transform-origin:0 0', G);
  items.forEach(it => {
    const row = div('position:relative;display:flex;align-items:center;gap:30px;margin-bottom:22px;white-space:nowrap', el);
    const m = div(`position:relative;flex:none;width:76px;height:76px;border-radius:50%;background:${it.mark === 'x' ? SYS.red : SYS.green};display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.35)`, row, sym(it.mark === 'x' ? 'x' : 'check', 52, '#fff', 3));
    A(m, [{opacity: 0, transform: 'scale(0)'}, {opacity: 1, transform: 'none'}], it.t, .35, {e: SPRING_IOS});
    const tx = div('position:relative;font-family:RefSans;font-weight:400;font-size:72px;line-height:1.3', row);
    let t = it.t + .15; const n = graphemes(it.text).length, d = Math.min(.7, n * .04);
    for (const [s, c] of segments(it.text, it.keys)) t = typeIn(tx, s, t, d * graphemes(s).length / n, c ?? '#fff', c ? glow(c) : SHADOW);
  });
  placeUnderChin(el, t0, t1, 1200);
  A(el, FADE_OUT, t1 - .1, .1, {e: 'linear', f: 'forwards'});
}

/* map pin drops onto a target beside the head (never over the face) */
function pinDrop(t, t1, {x = 880} = {}) {
  const fb = faceBox(t), y = fb.top + 60;
  const g = div(`left:${x - 150}px;top:${y - 150}px;width:300px;height:300px`, Q,
    `<svg width="300" height="300" viewBox="0 0 300 300" style="overflow:visible">
      <ellipse cx="150" cy="200" rx="70" ry="24" fill="${SYS.blue}" opacity=".25"/><ellipse class="r1" cx="150" cy="200" rx="70" ry="24" fill="none" stroke="${SYS.blue}" stroke-width="5"/>
      <g class="pin"><path d="M150 200c-6-28-46-52-46-90a46 46 0 0 1 92 0c0 38-40 62-46 90z" fill="${SYS.red}" stroke="#fff" stroke-width="5"/><circle cx="150" cy="110" r="17" fill="#fff"/></g></svg>`);
  life(g, t, t1, [{opacity: 0}, {opacity: 1}], FADE_OUT, .1, .2, 'linear');
  A(g.querySelector('.pin'), [{transform: 'translateY(-260px)', opacity: 0}, {transform: 'translateY(0)', opacity: 1, offset: .55}, {transform: 'translateY(-26px)', offset: .75}, {transform: 'translateY(0)'}], t, .6, {e: 'ease-in'});
  A(g.querySelector('.r1'), [{transform: 'scale(1)', opacity: .9}, {transform: 'scale(2.4)', opacity: 0}], t + .35, .7, {f: 'none'});
  g.querySelector('.r1').style.transformOrigin = '150px 200px'; g.querySelector('.r1').style.opacity = 0;
}

/* ---------- added from the third reference (own iOS take) ---------- */
/* #3 floating glass card beside the head — a line that slides down + an arrow label (no numbers) */
function floatCard(t0, t1, {label = '', side = 'right'} = {}) {
  const fb = faceBox(t0), x = side === 'right' ? 720 : 40, y = Math.max(140, fb.top - 300);
  const c = div(`left:${x}px;top:${y}px;width:330px;padding:26px 26px 22px;border-radius:44px;${GLASS_DARK}`, Q,
    `<svg width="278" height="146" viewBox="0 0 228 120"><path class="ln" d="M8 22 L60 30 L100 26 L140 58 L180 70 L220 104" fill="none" stroke="${SYS.red}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
      <path d="M8 22 L60 30 L100 26 L140 58 L180 70 L220 104 L220 120 L8 120Z" fill="${SYS.red}" opacity=".15"/></svg>
     <div style="display:flex;align-items:center;gap:12px;margin-top:10px;font-family:RefSans;font-weight:600;font-size:56px;color:#fff"><span style="color:${SYS.red}">↓</span>${label}</div>`);
  life(c, t0, t1, [{opacity: 0, transform: 'translateY(40px) scale(.85)'}, {opacity: 1, transform: 'none'}], [{opacity: 1}, {opacity: 0, transform: 'scale(.9)'}], .45, .2, SPRING_IOS);
  A(c.querySelector('.ln'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t0 + .3, .9, {e: INOUT});
  A(c, [{translate: '0 0'}, {translate: '0 -12px'}], t0 + .5, 1, {it: Math.ceil((t1 - t0) / 1), dir: 'alternate', e: 'ease-in-out', f: 'none'});
}

/* #5 split screen — app screen on top, the speaker slides into the lower half (both the clip and its edge-fill move together) */
const SPLIT = [];
function split(t0, t1, {drop = 420, build} = {}) {
  SPLIT.push([t0, t1, drop]);
  const panel = div(`left:0;top:0;width:1080px;height:${drop + 360}px;background:#fff;border-radius:0 0 56px 56px;box-shadow:0 20px 60px rgba(0,0,0,.35);overflow:hidden`, Q);
  life(panel, t0, t1, [{transform: 'translateY(-100%)'}, {transform: 'none'}], [{transform: 'none'}, {transform: 'translateY(-100%)'}], .45, .35, SPRING_IOS);
  if (build) build(panel);
  return panel;
}
HOOKS.push(t => {   // runs after the camera has been applied: shift the (zoomed) clip down while a split is open
  const s = SPLIT.find(([a, b]) => t >= a && t <= b); if (!s) return;
  const [a, b, drop] = s, p = Math.min(outBackS(clamp((t - a) / .45)), smooth3(clamp((b - t) / .35)));
  const v = document.getElementById('v'), e = document.getElementById('ed');
  v.style.transform = `translateY(${drop * .75 * p}px) ` + v.style.transform; e.style.transform = `translateY(${drop * .75 * p}px) ` + e.style.transform;
});
const smooth3 = p => p * p * (3 - 2 * p);
function splitChat(t0, t1, {name = 'ลูกค้า', msgs = [], read} = {}) {
  split(t0, t1, {build: panel => {
    div(`left:0;top:0;width:1080px;height:250px;background:#F6F6F6;border-bottom:1.5px solid #E2E2E5`, panel,
      `<div style="position:absolute;left:470px;top:40px;width:140px;height:140px;border-radius:50%;background:linear-gradient(#A9ABB5,#83858F);display:flex;align-items:center;justify-content:center;font-family:RefSans;font-weight:600;font-size:64px;color:#fff">${firstLetter(name)}</div>
       <div style="position:absolute;left:0;width:1080px;top:190px;text-align:center;font-family:RefSans;font-size:34px;color:#111">${name} ›</div>`);
    const col = div('left:44px;right:44px;top:330px;display:flex;flex-direction:column;gap:22px', panel);
    msgs.forEach(m => { const me = m.from === 'me', b = document.createElement('div');
      b.style.cssText = `align-self:${me ? 'flex-end' : 'flex-start'};max-width:780px;padding:26px 40px 32px;border-radius:46px;background:${me ? SYS.blue : '#E9E9EB'};color:${me ? '#fff' : '#111'};font-family:RefSans;font-size:54px;line-height:1.3;transform-origin:${me ? '100%' : '0'} 100%`;
      b.textContent = m.text; col.appendChild(b); A(b, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'none'}], m.t, .3, {e: SPRING_IOS}); });
    if (read != null) { const r = document.createElement('div'); r.style.cssText = 'align-self:flex-end;margin-top:-10px;font-family:RefSans;font-size:34px;color:#8E8E93'; r.textContent = 'อ่านแล้ว'; col.appendChild(r); A(r, [{opacity: 0}, {opacity: 1}], read, .2); }
  }});
}

/* #10 title card — black box with a white frame on the lower half; lines: [[text, t, {strike, colour}]] */
function titleCard(t0, t1, lines, {top = 1180} = {}) {
  SCENE_WIN.push([t0, t1]);   // the card carries the line: captions hide
  const c = div(`left:70px;width:940px;top:${top}px;padding:44px 50px 50px;background:#0B0B0D;border:5px solid #fff;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,.45)`, S);
  A(c, [{opacity: 0, transform: 'translateY(60px) scale(.95)'}, {opacity: 1, transform: 'none'}], t0, .4, {e: SPRING_IOS});
  A(c, FADE_OUT, t1 - .15, .15, {f: 'forwards', e: 'linear'});
  lines.forEach(([txt, t, o = {}]) => { const l = div('position:relative;font-family:RefSans;font-weight:700;font-size:80px;line-height:1.25;white-space:nowrap', c);
    for (const [s, col] of segments(txt, o.keys)) { const sp = document.createElement('span'); sp.style.position = 'relative'; l.appendChild(sp); typeIn(sp, s, t, Math.min(.5, graphemes(s).length * .04), col ?? '#fff', 'none');
      if (col && o.strike) { const st = div(`left:-6px;right:-6px;top:52%;height:9px;border-radius:5px;background:${col};transform-origin:left;transform:scaleX(0)`, sp); A(st, [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], o.strike, .3, {e: SMOOTH}); } } });
}

/* #7 steps diagram — 01 → 02 → 03 on a light card over the frosted clip; steps: [[text, t]] */
function flowSteps(t0, t1, {title = '', steps = []} = {}) {
  const root = iosScene(t0, t1, {tint: .3});
  const card = div(`left:80px;width:920px;top:${960 - (170 + steps.length * 230) / 2}px;padding:50px 56px 30px;border-radius:56px;background:#F7F7F9;box-shadow:0 30px 80px rgba(0,0,0,.35)`, root,
    `<div style="display:inline-block;padding:8px 22px 12px;border-radius:14px;background:${SYS.green};font-family:RefSans;font-weight:600;font-size:32px;color:#fff;margin-bottom:24px">${title}</div>`);
  A(card, [{opacity: 0, transform: 'scale(.9)'}, {opacity: 1, transform: 'none'}], t0, .4, {e: SPRING_IOS});
  steps.forEach(([txt, t], i) => {
    const row = div('position:relative;margin-bottom:0', card);
    if (i) { const ar = div('position:relative;left:58px;width:6px;height:60px;background:#C7C7CC;transform-origin:top;transform:scaleY(0)', row); A(ar, [{transform: 'scaleY(0)'}, {transform: 'scaleY(1)'}], t - .15, .2); }
    const box = div(`position:relative;display:flex;align-items:center;gap:30px;padding:26px 30px;border-radius:30px;background:#fff;border:3px solid ${i === steps.length - 1 ? SYS.blue : '#E5E5EA'};font-family:RefSans;font-size:58px;color:#111;white-space:nowrap`, row,
      `<span style="flex:none;width:90px;height:90px;border-radius:24px;background:${i === steps.length - 1 ? SYS.blue : '#E9E9EB'};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:40px;color:${i === steps.length - 1 ? '#fff' : '#111'}">0${i + 1}</span>${txt}`);
    A(box, [{opacity: 0, transform: 'translateY(30px) scale(.95)'}, {opacity: 1, transform: 'none'}], t, .35, {e: SPRING_IOS});
  });
}
