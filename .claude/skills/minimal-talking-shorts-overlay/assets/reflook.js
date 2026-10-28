/* ===================== REF LOOK (experiment) — phone-UI storytelling ===================== */
{ const st = document.createElement('style'); st.textContent = '@font-face{font-family:"RefSans";src:url(fonts/Anuphan-VF.ttf);font-weight:100 700}'; document.head.appendChild(st); }
const UIC = {blue: '#1E87FF', grey: '#E9E9EB', ink: '#111111', sub: '#8E8E93', yellow: '#F7CE46', green: '#34C759', red: '#FF453A'};
const SHADOW = '0 2px 14px rgba(0,0,0,.5)';
const glow = c => `0 0 18px ${c}AA, 0 0 2px ${c}, 0 2px 10px rgba(0,0,0,.45)`;

/* letters fade in one after another with a little blur (the reference's "typing") */
function typeIn(parent, txt, t, dur, color, sh) {
  const gs = graphemes(txt);
  gs.forEach((ch, i) => { const s = document.createElement('span'); s.textContent = ch === ' ' ? ' ' : ch; s.style.cssText = `color:${color};text-shadow:${sh};display:inline-block`; parent.appendChild(s);
    A(s, [{opacity: 0, filter: 'blur(6px)'}, {opacity: 1, filter: 'blur(0)'}], t + dur * i / Math.max(1, gs.length), .18, {e: 'ease-out'}); });
  return t + dur;
}
/* split a sentence around coloured key words: keys = {word: colour} */
function segments(txt, keys = {}) {
  const out = []; let rest = txt;
  while (rest) { let best = null; for (const k in keys) { const i = rest.indexOf(k); if (i >= 0 && (!best || i < best.i)) best = {i, k}; }
    if (!best) { out.push([rest, null]); break; } if (best.i) out.push([rest.slice(0, best.i), null]); out.push([best.k, keys[best.k]]); rest = rest.slice(best.i + best.k.length); }
  return out;
}
function placeUnderChin(el, t0, t1, minTop = 1235) {
  FITS.push(() => { if (inScene(t0)) { el.style.display = 'none'; return; }
    let top = minTop; for (const f of faceAt(t0, t1)) top = Math.max(top, f.bottom + ZONE.gap); el.style.top = top + 'px';
    const s = Math.min(1, el.clientWidth / el.scrollWidth); if (s < 1) el.style.transform = `scale(${s})`; });   // fit the element's own width (kcap / markList: the safe width)
}

/* caption — light sans, white (or yellow inside the notes frame), key words green/red with glow */
function rcap(t0, t1, txt, {keys = {}, color = '#fff', size = 82, dur, top} = {}) {
  const el = div(`left:60px;width:960px;text-align:center;white-space:nowrap;font-family:RefSans;font-weight:400;font-size:${size}px;line-height:1.3;transform-origin:50% 0`, G);
  let t = t0; const d = dur ?? Math.min(.55, (t1 - t0) * .5), n = graphemes(txt).length;
  for (const [s, c] of segments(txt, keys)) { const k = c ?? color; t = typeIn(el, s, t, d * graphemes(s).length / n, k, c || color !== '#fff' ? glow(k) : SHADOW); }
  if (top != null) { el.style.top = top + 'px'; FITS.push(() => { if (inScene(t0)) el.style.display = 'none'; }); } else placeUnderChin(el, t0, t1);
  A(el, FADE_OUT, t1 - .1, .1, {e: 'linear', f: 'forwards'});
}
/* caption on the navy → blue bar */
function rbar(t0, t1, txt) {
  const el = div(`left:70px;width:940px;padding:20px 40px 28px;border-radius:16px;background:linear-gradient(90deg,#15206A,#2A48D8);box-shadow:0 10px 30px rgba(0,0,0,.35);white-space:nowrap;font-family:RefSans;font-weight:500;font-size:62px;line-height:1.3`, G);
  A(el, [{clipPath: 'inset(0 100% 0 0 round 16px)'}, {clipPath: 'inset(0 0 0 0 round 16px)'}], t0, .25);
  typeIn(el, txt, t0 + .1, Math.min(.6, (t1 - t0) * .5), '#fff', 'none');
  placeUnderChin(el, t0, t1);
  A(el, FADE_OUT, t1 - .1, .1, {e: 'linear', f: 'forwards'});
}
/* white ? marks beside the head */
function rq(t0, t1) {
  const fb = faceBox(t0);
  [[150, fb.top + 60, -10, 230], [920, fb.top + 10, 12, 200], [960, fb.cy + 170, -8, 150]].forEach(([x, y, rot, sz], i) => {
    const q = div(`left:${x - sz / 2}px;top:${y - sz / 2}px;width:${sz}px;text-align:center;font-family:SmallFont;font-size:${sz}px;line-height:1;color:rgba(255,255,255,.92);text-shadow:0 0 24px rgba(255,255,255,.35),0 4px 18px rgba(0,0,0,.4)`, Q, '?');
    life(q, t0 + i * .2, t1, [{opacity: 0, transform: `scale(.4) rotate(${rot * 3}deg)`}, {opacity: 1, transform: `rotate(${rot}deg)`}], [{opacity: 1}, {opacity: 0}], .35, .15);
    A(q, [{translate: '0 0'}, {translate: '0 -14px'}], t0 + .4, .9, {it: Math.max(1, Math.ceil((t1 - t0) / .9)), dir: 'alternate', e: 'ease-in-out', f: 'none'});
  });
}
const statusBar = (root, dark = false) => div(`left:0;top:0;width:1080px;height:110px;display:flex;align-items:center;justify-content:space-between;padding:20px 70px 0;font-family:RefSans;font-weight:600;font-size:40px;color:${dark ? '#fff' : UIC.ink}`, root,
  `<span>9:41</span><svg width="150" height="34" viewBox="0 0 150 34"><g fill="${dark ? '#fff' : UIC.ink}"><rect x="0" y="22" width="8" height="10" rx="2"/><rect x="12" y="16" width="8" height="16" rx="2"/><rect x="24" y="9" width="8" height="23" rx="2"/><rect x="36" y="2" width="8" height="30" rx="2"/>
   <path d="M62 14a26 26 0 0 1 34 0l-4 4a20 20 0 0 0-26 0zM70 22a14 14 0 0 1 18 0l-9 9z"/><rect x="104" y="6" width="40" height="22" rx="6" fill="none" stroke="${dark ? '#fff' : UIC.ink}" stroke-width="3"/><rect x="108" y="10" width="28" height="14" rx="3"/></g></svg>`);

/* phone-style chat — typing: [tIn, tOut] shows the other side "typing…" and then nothing */
function rchat(t0, t1, {name = '', msgs = [], typing} = {}) {
  const root = scene(t0, t1, {bg: '#fff', enter: 'cut'});
  statusBar(root);
  div(`left:0;top:110px;width:1080px;height:230px;background:#F6F6F6;border-bottom:1.5px solid #E2E2E5`, root,
    `<div style="position:absolute;left:60px;top:60px;font-family:RefSans;font-size:84px;line-height:1;color:${UIC.blue}">‹</div>
     <div style="position:absolute;left:470px;top:22px;width:140px;height:140px;border-radius:50%;background:linear-gradient(#A9ABB5,#83858F);display:flex;align-items:center;justify-content:center;font-family:RefSans;font-weight:600;font-size:64px;color:#fff">${firstLetter(name)}</div>
     <div style="position:absolute;left:0;width:1080px;top:170px;text-align:center;font-family:RefSans;font-size:32px;color:${UIC.ink}">${name} ›</div>
     <svg style="position:absolute;right:60px;top:66px" width="70" height="46" viewBox="0 0 70 46"><rect x="3" y="6" width="44" height="34" rx="8" fill="none" stroke="${UIC.blue}" stroke-width="5"/><path d="M50 18l16-10v30l-16-10z" fill="none" stroke="${UIC.blue}" stroke-width="5" stroke-linejoin="round"/></svg>`);
  const col = div('left:44px;right:44px;top:430px;display:flex;flex-direction:column;gap:22px', root);
  msgs.forEach(m => { const me = m.from === 'me', b = document.createElement('div');
    b.style.cssText = `align-self:${me ? 'flex-end' : 'flex-start'};max-width:780px;padding:26px 40px 32px;border-radius:46px;background:${me ? UIC.blue : UIC.grey};color:${me ? '#fff' : UIC.ink};font-family:RefSans;font-size:52px;line-height:1.3;transform-origin:${me ? '100%' : '0'} 100%`;
    b.textContent = m.text; col.appendChild(b); A(b, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'none'}], m.t, .28); });
  if (typing) { const b = document.createElement('div'); b.style.cssText = `align-self:flex-start;padding:30px 40px;border-radius:46px;background:${UIC.grey};display:flex;gap:14px`; col.appendChild(b);
    for (let i = 0; i < 3; i++) { const d = document.createElement('span'); d.style.cssText = 'width:22px;height:22px;border-radius:50%;background:#9A9AA0;display:block'; b.appendChild(d);
      A(d, [{opacity: .3}, {opacity: 1}, {opacity: .3}], typing[0] + i * .12, .6, {it: 6, f: 'none'}); }
    A(b, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'none'}], typing[0], .2); A(b, [{opacity: 1}, {opacity: 0, transform: 'scale(.8)'}], typing[1], .2, {f: 'forwards'}); }
  div(`left:40px;right:40px;top:1690px;display:flex;align-items:center;gap:22px`, root,
    `<div style="flex:none;width:84px;height:84px;border-radius:50%;background:#EDEDF0;display:flex;align-items:center;justify-content:center;font-family:RefSans;font-size:56px;color:#8E8E93">+</div>
     <div style="flex:1;height:84px;border-radius:42px;border:2px solid #D6D6DA;display:flex;align-items:center;justify-content:space-between;padding:0 34px;font-family:RefSans;font-size:38px;color:#B5B5BA"><span>ข้อความ</span><span>🎙</span></div>`);
}
/* pure black, words fade in, iris opens onto the clip */
function rblack(t0, t1, txt, {iris = .4} = {}) {
  SCENE_WIN.push([t0, t1]);
  const root = div('inset:0;background:#000', S), fb = faceBox(t0);
  const tx = div(`left:0;width:1080px;top:860px;text-align:center;font-family:RefSans;font-weight:300;font-size:92px`, root);
  typeIn(tx, txt, t0 + .05, (t1 - iris - t0) * .6, '#fff', 'none');
  A(root, [{opacity: 0}, {opacity: 1}], t0, .06, {e: 'linear'});
  HOOKS.push(t => { if (t < t0 || t > t1) { root.style.display = 'none'; return; } root.style.display = '';
    const p = clamp((t - (t1 - iris)) / iris), r = 1400 * p * p;
    root.style.webkitMaskImage = root.style.maskImage = p > 0 ? `radial-gradient(circle at 540px ${fb.cy}px, transparent ${r}px, #000 ${r + 2}px)` : ''; });
}
/* blue app-style icon, above the head (the reference puts it on the face — our rule keeps faces clear) */
function ricon(t, {glyph = ICON.question, d = .7} = {}) {
  SCENE_WIN.push([t + d * .6, t + d]);
  const c = div(`left:${540 - 125}px;top:${Math.max(120, faceBox(t).top - 300)}px;width:250px;height:250px;border-radius:50%;background:linear-gradient(160deg,#5BB8FF,#1E6BFF);box-shadow:0 0 0 12px #fff,0 20px 60px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;opacity:0`, Q,
    `<svg width="140" height="140" viewBox="0 0 100 100"><path d="${glyph}" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
  A(c, [{opacity: 0, transform: 'scale(.2)'}, {opacity: 1, transform: 'scale(1)', offset: .35}, {opacity: 1, transform: 'scale(1)', offset: .7}, {opacity: 0, transform: 'scale(3)', filter: 'blur(24px)'}], t, d, {e: 'ease-out', f: 'none'});
}
/* analog clock in a glass card on grey — time passing */
function rclock(t0, t1, {turns = 1.5} = {}) {
  const root = scene(t0, t1, {bg: 'radial-gradient(circle at 50% 45%,#C9CBD0,#8F9197)', enter: 'fade'});
  const card = div('left:200px;top:740px;width:680px;height:440px;border-radius:34px;background:rgba(255,255,255,.22);box-shadow:0 30px 70px rgba(0,0,0,.25),inset 0 0 0 2px rgba(255,255,255,.55);backdrop-filter:blur(14px)', root);
  const ticks = Array.from({length: 60}, (_, i) => `<line x1="0" y1="-178" x2="0" y2="${i % 5 ? -168 : -152}" stroke="#222" stroke-width="${i % 5 ? 2 : 5}" transform="rotate(${i * 6})"/>`).join('');
  const f = svg(400, 400, `<g transform="translate(200 200)"><circle r="190" fill="#fff" stroke="#E4E4E8" stroke-width="6"/>${ticks}
    <line class="hh" x1="0" y1="18" x2="0" y2="-95" stroke="#111" stroke-width="12" stroke-linecap="round"/><line class="mh" x1="0" y1="22" x2="0" y2="-150" stroke="#111" stroke-width="8" stroke-linecap="round"/>
    <line class="sh" x1="0" y1="30" x2="0" y2="-165" stroke="${UIC.red}" stroke-width="3"/><circle r="10" fill="${UIC.red}"/></g>`, 'left:140px;top:20px', card);
  const hh = f.querySelector('.hh'), mh = f.querySelector('.mh'), sh = f.querySelector('.sh');
  HOOKS.push(t => { if (t < t0 || t > t1) return; const p = (t - t0) / (t1 - t0);
    mh.setAttribute('transform', `rotate(${120 + 360 * turns * p})`); hh.setAttribute('transform', `rotate(${150 + 30 * turns * p})`); sh.setAttribute('transform', `rotate(${(t - t0) * 360 * 1.5})`); });
  A(card, [{opacity: 0, transform: 'scale(.9)'}, {opacity: 1, transform: 'none'}], t0, .35);
}
const svg = (w, h, inner, css, parent) => div(css, parent, `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible;display:block">${inner}</svg>`);
/* pinned notes in a glass card on lavender — notes: [[text, sub, t]] */
function rboard(t0, t1, {title = '', count = '', notes = []} = {}) {
  const root = scene(t0, t1, {bg: 'linear-gradient(#C9CEF4,#A9B3EC)', enter: 'whip'});
  const card = div('left:60px;top:560px;width:960px;height:720px;border-radius:40px;background:rgba(255,255,255,.35);box-shadow:0 30px 70px rgba(40,50,120,.18),inset 0 0 0 2px rgba(255,255,255,.75);backdrop-filter:blur(16px)', root,
    `<div style="position:absolute;left:54px;top:40px;font-family:RefSans;font-weight:600;font-size:62px;color:${UIC.ink}">${title}<span style="margin-left:22px;font-weight:400;font-size:38px;color:${UIC.sub}">${count}</span></div>`);
  const n = notes.length, w = n > 2 ? 280 : 360, pins = ['#C8302E', '#2F47C8', '#C8302E'];
  notes.forEach(([txt, sub, t], i) => {
    const rot = [-5, 3, 6][i % 3], x = 40 + i * ((880 - w) / Math.max(1, n - 1)), y = 170 + [40, 0, 30][i % 3];
    const nt = div(`left:${x}px;top:${y}px;width:${w}px;height:${w * 1.15}px;padding:64px 28px 0;background:#fff;border-radius:6px 6px 46px 6px;box-shadow:0 16px 36px rgba(40,50,120,.25);font-family:RefSans;font-size:${n > 2 ? 44 : 52}px;line-height:1.3;color:${UIC.ink}`, card,
      `<span style="position:absolute;left:26px;top:22px;width:28px;height:28px;border-radius:50%;background:${pins[i % 3]};box-shadow:0 4px 8px rgba(0,0,0,.35)"></span>${txt}
       <div style="position:absolute;left:28px;bottom:30px;font-size:30px;color:${i === 1 ? '#8B5CF6' : UIC.sub}">${sub ?? ''}</div>`);
    A(nt, [{opacity: 0, transform: `translateY(-90px) rotate(${rot * 3}deg) scale(1.15)`}, {opacity: 1, transform: `rotate(${rot}deg)`}], t, .4, {e: 'cubic-bezier(.3,1.4,.5,1)'});
  });
}
/* payment screen, phone-UI style */
function rpay(t0, t1, {hover = [], thought} = {}) {
  const root = scene(t0, t1, {bg: '#F2F2F7', enter: 'whip'});
  statusBar(root);
  div(`left:0;width:1080px;top:170px;text-align:center;font-family:RefSans;font-weight:600;font-size:64px;color:${UIC.ink}`, root, 'ชำระเงิน');
  const bar = (w, a = .1) => `<div style="height:28px;width:${w}px;border-radius:14px;background:rgba(0,0,0,${a});margin-top:24px"></div>`;
  div(`left:50px;right:50px;top:330px;height:320px;border-radius:36px;background:#fff;display:flex;gap:40px;padding:44px`, root, `<div style="flex:none;width:230px;height:230px;border-radius:24px;background:#E5E5EA"></div><div>${bar(440)}${bar(300)}${bar(200, .06)}</div>`);
  div(`left:50px;right:50px;top:700px;height:300px;border-radius:36px;background:#fff;padding:20px 44px`, root, bar(880, .06) + bar(880, .06) + bar(520, .06));
  div(`left:80px;right:80px;top:1220px;height:150px;border-radius:75px;background:${UIC.blue};display:flex;align-items:center;justify-content:center;font-family:RefSans;font-weight:600;font-size:62px;color:#fff`, root, 'ชำระเงิน');
  if (thought) { const th = div('left:0;width:1080px;top:1070px;text-align:center', root, `<span style="display:inline-block;padding:22px 44px 28px;border-radius:46px;background:${UIC.grey};font-family:RefSans;font-size:52px;color:${UIC.ink}">${thought[0]}</span>`);
    A(th, [{opacity: 0, transform: 'translateY(30px) scale(.9)'}, {opacity: 1, transform: 'none'}], thought[1], .3); }
  if (hover.length === 2) { const [a, b] = hover, f = div('left:0;top:0;width:130px;height:130px;filter:drop-shadow(0 10px 18px rgba(0,0,0,.35))', root,
      `<svg width="130" height="130" viewBox="0 0 24 24"><path d="M9 11V5a1.6 1.6 0 0 1 3.2 0v5.2l4.6.9a2 2 0 0 1 1.6 2.2L17.6 19a3 3 0 0 1-3 2.5H11a3 3 0 0 1-2.4-1.2L5.4 16a1.5 1.5 0 0 1 2.2-2L9 15.4z" fill="#fff" stroke="#111" stroke-width="1.1" stroke-linejoin="round"/></svg>`);
    A(f, [{transform: 'translate(820px,1780px)', offset: 0}, {transform: 'translate(560px,1330px)', offset: .45}, {transform: 'translate(590px,1360px)', offset: .6}, {transform: 'translate(560px,1340px)', offset: .75}, {transform: 'translate(860px,1820px)', offset: 1}], a, b - a, {e: INOUT}); }
}
/* ◇ list — items: [{text, t, keys: {word: colour}}] */
function rlist(t0, t1, items) {
  const el = div('left:110px;width:880px;transform-origin:0 0', G);
  items.forEach(it => {
    const row = div('position:relative;display:flex;align-items:center;gap:34px;margin-bottom:20px;white-space:nowrap', el);
    const dm = div('position:relative;flex:none;width:44px;height:44px;transform:rotate(45deg);border:4px solid #fff;box-shadow:0 0 14px rgba(255,255,255,.6)', row);
    A(dm, [{opacity: 0, transform: 'rotate(45deg) scale(0)'}, {opacity: 1, transform: 'rotate(45deg) scale(1)'}], it.t, .25, {e: SPRING});
    const tx = div('position:relative;font-family:RefSans;font-weight:400;font-size:74px;line-height:1.3', row);
    let t = it.t + .15; const n = graphemes(it.text).length, d = Math.min(.7, n * .04);
    for (const [s, c] of segments(it.text, it.keys)) t = typeIn(tx, s, t, d * graphemes(s).length / n, c ?? '#fff', c ? glow(c) : SHADOW);
  });
  placeUnderChin(el, t0, t1, 1200);
  A(el, FADE_OUT, t1 - .1, .1, {e: 'linear', f: 'forwards'});
}
