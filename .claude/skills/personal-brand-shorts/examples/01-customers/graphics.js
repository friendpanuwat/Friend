/* graphics designed for clip 01 ("ลูกค้าทักมาแล้วหายไป", 42 s) — REFERENCE IDEAS ONLY.
   Each clip gets its own graphics.js, designed for what that clip talks about (references/overlays.md).
   Do not copy these into another clip; read them for the level of finish and how the primitives are used. */
/* ✕ / ✓ list under the chin */
function olist(t0, t1, items) {
  const el = lower(t0, t1, 'display:flex;flex-direction:column;align-items:flex-start;padding-left:40px');
  items.forEach(it => { const row = div('position:relative;display:flex;align-items:center;gap:28px;margin-bottom:20px;white-space:nowrap', el);
    const m = div(`position:relative;flex:none;width:72px;height:72px;border-radius:50%;background:${it.mark === 'x' ? OV.red : OV.green};display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.35)`, row, sym(it.mark === 'x' ? 'x' : 'check', 50, '#fff', 3));
    A(m, [{opacity: 0, transform: 'scale(0)'}, {opacity: 1, transform: 'none'}], it.t, .35, {e: bounce});
    const tx = div('position:relative;font-family:RefSans;font-weight:400;font-size:70px;line-height:1.3', row);
    let t = it.t + .15; const n = graphemes(it.text).length, d = Math.min(.7, n * .04);
    for (const [s, c] of segments(it.text, it.keys)) t = typeIn(tx, s, t, d * graphemes(s).length / n, c ?? '#fff', c ? glow(c) : SHADOW); });
}

/* TOP: a message bubble (customer = white, left · me = blue, right), optional read mark, typing dots, then it breaks into dots */
function tChat(t0, t1, {text = '', from = 'them', read, typing, gone} = {}) {
  const me = from === 'me', el = topBand(t0, t1, `text-align:${me ? 'right' : 'left'};padding:0 30px`, '', 1);
  el.innerHTML = `<span class="bb" style="position:relative;display:inline-block;padding:28px 46px 38px;border-radius:58px;${me ? 'border-bottom-right-radius:14px;background:' + OV.blue + ';color:#fff' : 'border-bottom-left-radius:14px;' + WHITE_CARD + ';color:' + OV.ink};${BOLD};font-size:56px;box-shadow:0 14px 34px rgba(0,0,0,.35)">${text}</span>
    <div class="rd" style="margin-top:10px;font-family:RefSans;font-weight:600;font-size:36px;color:#fff;text-shadow:0 2px 10px rgba(0,0,0,.6);opacity:0">อ่านแล้ว ✓</div>
    <div class="ty" style="display:inline-flex;gap:12px;margin-top:14px;padding:22px 30px;border-radius:40px;${WHITE_CARD};opacity:0">${[0, 1, 2].map(() => '<i style="width:18px;height:18px;border-radius:50%;background:#9A9AA0;display:block"></i>').join('')}</div>`;
  const bb = el.querySelector('.bb');
  A(bb, [{opacity: 0, transform: `translateY(-50px) scale(.6)`}, {opacity: 1, transform: 'none'}], t0, .45, {e: bounce});
  if (read != null) A(el.querySelector('.rd'), [{opacity: 0}, {opacity: 1}], read, .25);
  if (typing) { const ty = el.querySelector('.ty'); A(ty, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'none'}], typing[0], .25, {e: bounce}); A(ty, [{opacity: 1}, {opacity: 0, transform: 'scale(.6)'}], typing[1], .25, {f: 'forwards'});
    ty.querySelectorAll('i').forEach((d, i) => A(d, [{opacity: .3}, {opacity: 1}, {opacity: .3}], typing[0] + i * .12, .6, {it: 4, f: 'none'})); }
  if (gone != null) { A(bb, [{opacity: 1, filter: 'blur(0)'}, {opacity: 0, filter: 'blur(8px)'}], gone, .2, {f: 'forwards'});
    const r = seeded(9); for (let i = 0; i < 34; i++) { const a = r() * Math.PI * 2, d = 100 + r() * 260, s = 8 + r() * 14;
      const p = div(`left:${me ? 420 + r() * 400 : 60 + r() * 520}px;top:${TOPY + 30 + r() * 70}px;width:${s}px;height:${s}px;border-radius:50%;background:${me ? '#7EC0FF' : '#fff'};opacity:0`, Q);
      A(p, [{opacity: .95, transform: 'none'}, {opacity: 0, transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d * .45 - 50}px) scale(.2)`}], gone + r() * .08, .55, {e: 'cubic-bezier(.1,.8,.3,1)', f: 'none'}); } }
}

/* TOP: a price tag drops on its string from the top edge and swings */
function tTag(t0, t1, {label = ''} = {}) {
  const g = div(`left:${SAFE.cx - 120}px;top:-40px;width:240px;height:520px;transform-origin:120px 0`, Q,
    `<svg width="240" height="520" viewBox="0 0 240 520" style="overflow:visible"><path d="M120 0 V250" stroke="#fff" stroke-width="4"/>
      <path d="M65 250 H175 L212 295 V470 a20 20 0 0 1-20 20 H48 a20 20 0 0 1-20-20 V295z" fill="#fff" style="filter:drop-shadow(0 14px 24px rgba(0,0,0,.45))"/>
      <circle cx="120" cy="285" r="13" fill="none" stroke="#111" stroke-width="5"/></svg>
     <div style="position:absolute;left:0;width:240px;top:340px;text-align:center;${BOLD};font-size:70px;color:${OV.red};text-shadow:0 0 18px ${OV.red}66">${label}</div>`);
  A(g, [{opacity: 0, transform: 'translateY(-420px)'}, {opacity: 1, transform: 'rotate(10deg)', offset: .55}, {transform: 'rotate(-6deg)', offset: .78}, {opacity: 1, transform: 'rotate(3deg)'}], t0, .85, {e: 'ease-out'});
  A(g, [{rotate: '0deg'}, {rotate: '-4deg'}], t0 + .85, .8, {it: Math.ceil((t1 - t0) / .8), dir: 'alternate', e: 'ease-in-out', f: 'none'});
  A(g, [{opacity: 1}, {opacity: 0, transform: 'translateY(-420px)'}], t1 - .25, .25, {f: 'forwards', e: 'ease-in'});
}

/* LEFT of the head / TOP: little ? chips — spots: [[x, y, t]] (x ≤ 860) */
function qChips(t0, t1, spots) {
  spots.forEach(([x, y, t], i) => { const rot = [-10, 8, -6, 12][i % 4];
    const c = div(`left:${x}px;top:${y}px`, Q, `<span style="display:inline-block;width:110px;height:110px;border-radius:50%;${WHITE_CARD};${BOLD};font-size:72px;line-height:104px;text-align:center;color:${OV.ink}">?</span>`);
    life(c.firstChild, t, t1, [{opacity: 0, transform: `scale(.3) rotate(${rot * 3}deg)`}, {opacity: 1, transform: `rotate(${rot}deg)`}], [{opacity: 1}, {opacity: 0, transform: 'scale(.5)'}], .4, .18, bounce);
    A(c, [{translate: '0 0'}, {translate: '0 -12px'}], t + .3, .9, {it: Math.ceil((t1 - t) / .9), dir: 'alternate', e: 'ease-in-out', f: 'none'}); });
}

/* UNDER: turn word stretches in with outlined echoes below */
function uStretch(t0, t1, txt) {
  const el = lower(t0, t1, 'text-align:center');
  const line = o => { const l = document.createElement('div'); l.textContent = txt; l.style.cssText = `white-space:nowrap;${BOLD};font-size:140px;line-height:1.15;${o ? `color:transparent;-webkit-text-stroke:3px rgba(255,255,255,${o})` : 'color:#fff;text-shadow:0 6px 30px rgba(0,0,0,.55)'}`; el.appendChild(l); return l; };
  const mid = line(0), e1 = line(.55), e2 = line(.25);
  A(mid, [{transform: 'scaleY(3) scaleX(.55)', opacity: 0}, {transform: 'none', opacity: 1}], t0 + .02, .45, {e: bounce});
  [e1, e2].forEach((e, i) => A(e, [{transform: `translateY(${-140 * (i + 1)}px) scaleY(.2)`, opacity: 0}, {transform: 'none', opacity: 1}], t0 + .1 + i * .06, .45, {e: bounce}));
}
/* UNDER: pills fall in a short drop and settle — chips: [[text, t]] */
function uChips(t0, t1, chips, {style = 'white'} = {}) {
  const el = lower(t0, t1, 'display:flex;flex-direction:column;align-items:center;gap:18px'), r = seeded(chips.length * 3 + 1);
  chips.forEach(([txt, t]) => { const w = document.createElement('div'), rot = (r() - .5) * 8, sz = txt.length > 18 ? 50 : 60;
    w.innerHTML = chip(txt, style === 'outline' ? {bg: 'rgba(0,0,0,.25)', fg: '#fff', border: '#fff', size: sz} : {size: sz});
    w.style.transform = `rotate(${rot}deg)`; el.appendChild(w);
    A(w, [{opacity: 0, transform: `translateY(-130px) rotate(${rot * 4}deg) scale(.8)`, offset: 0}, {opacity: 1, transform: `rotate(${rot}deg)`, offset: .55}, {transform: `translateY(-28px) rotate(${rot}deg)`, offset: .75}, {opacity: 1, transform: `rotate(${rot}deg)`, offset: 1}], t, .6, {e: 'ease-in'}); });
}

/* TOP: a row of round icons that light up one by one — items: [[symbol, colour, t]] */
function tIcons(t0, t1, items, {label = ''} = {}) {
  const el = topBand(t0, t1, 'display:flex;flex-direction:column;align-items:center;gap:16px');
  if (label) { const l = document.createElement('div'); l.style.cssText = `font-family:RefSans;font-weight:600;font-size:46px;color:#fff;text-shadow:${SHADOW}`; l.textContent = label; el.appendChild(l); }
  const row = document.createElement('div'); row.style.cssText = 'display:flex;gap:34px'; el.appendChild(row);
  items.forEach(([k, c, t]) => { const b = document.createElement('span');
    b.style.cssText = `width:150px;height:150px;border-radius:44px;${GL};display:flex;align-items:center;justify-content:center`; b.innerHTML = sym(k, 84, '#fff', 2); row.appendChild(b);
    A(b, [{opacity: 0, transform: 'scale(.5)'}, {opacity: .55, transform: 'none'}], t0, .35, {e: bounce});
    A(b, [{opacity: .55, background: 'rgba(18,18,22,.5)', transform: 'none'}, {opacity: 1, background: c, transform: 'scale(1.12)', offset: .5}, {opacity: 1, background: c, transform: 'none'}], t, .45, {e: 'ease-out'}); });
}
/* TOP: a little shop (awning + door) pops up — the business owner */
function tShop(t0, t1) {
  const el = topBand(t0, t1, 'display:flex;justify-content:center', `<svg width="300" height="240" viewBox="0 0 300 240" style="overflow:visible;filter:drop-shadow(0 14px 26px rgba(0,0,0,.45))">
    <rect x="30" y="90" width="240" height="140" rx="14" fill="#fff"/><rect x="120" y="140" width="60" height="90" rx="8" fill="${OV.ink}"/>
    <rect x="50" y="125" width="50" height="45" rx="6" fill="#DADAE0"/><rect x="200" y="125" width="50" height="45" rx="6" fill="#DADAE0"/>
    <g class="aw">${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${10 + i * 46.7} 30 h46.7 v50 a23.3 23.3 0 0 1-46.7 0z" fill="${i % 2 ? '#fff' : OV.orange}"/>`).join('')}</g></svg>`);
  A(el.firstChild, [{opacity: 0, transform: 'translateY(60px) scale(.6)'}, {opacity: 1, transform: 'none'}], t0, .5, {e: bounce});
  A(el.querySelector('.aw'), [{transform: 'translateY(-40px)', opacity: 0}, {transform: 'none', opacity: 1}], t0 + .25, .45, {e: bounce});
}
/* TOP: people, some fade out, red arrow down */
function tPeople(t0, t1, {n = 5, fade = 3} = {}) {
  const icon = c => `<svg width="92" height="106" viewBox="0 0 24 28"><circle cx="12" cy="8" r="5" fill="${c}"/><path d="M3 27c0-6 4-10 9-10s9 4 9 10z" fill="${c}"/></svg>`;
  const el = topBand(t0, t1, 'display:flex;justify-content:center');
  el.innerHTML = `<div style="display:flex;align-items:center;gap:20px;padding:26px 40px;border-radius:50px;${GL}">${Array.from({length: n}, () => `<span class="pp" style="display:block">${icon('#fff')}</span>`).join('')}<span style="margin-left:14px;${BOLD};font-size:70px;color:${OV.red};text-shadow:0 0 20px ${OV.red}">↓</span></div>`;
  A(el.firstChild, [{opacity: 0, transform: 'translateY(-30px) scale(.9)'}, {opacity: 1, transform: 'none'}], t0, .35, {e: bounce});
  [...el.querySelectorAll('.pp')].slice(n - fade).reverse().forEach((p, i) => A(p, [{opacity: 1, transform: 'none'}, {opacity: .15, transform: 'translateY(10px) scale(.9)'}], t0 + .25 + i * .1, .25));
}
/* TOP: a switch goes ON → OFF */
function tToggle(t0, t1, {tOff, label = ''} = {}) {
  const el = topBand(t0, t1, 'display:flex;align-items:center;justify-content:center;gap:30px',
    `<span class="tr" style="position:relative;display:block;width:290px;height:164px;border-radius:82px;background:${OV.green};box-shadow:0 0 90px ${OV.green}AA"><i class="kn" style="position:absolute;left:132px;top:7px;width:150px;height:150px;border-radius:50%;background:#fff;display:block;box-shadow:0 8px 20px rgba(0,0,0,.35)"></i></span>
     <span class="lb" style="${BOLD};font-size:80px;color:#fff;text-shadow:0 4px 20px rgba(0,0,0,.6);opacity:0">${label}</span>`);
  A(el, [{transform: 'scale(.7)'}, {transform: 'none'}], t0, .35, {e: bounce});
  A(el.querySelector('.tr'), [{background: OV.green, boxShadow: `0 0 90px ${OV.green}AA`}, {background: 'rgba(120,120,128,.75)', boxShadow: '0 0 0 transparent'}], tOff, .3);
  A(el.querySelector('.kn'), [{transform: 'none'}, {transform: 'translateX(-124px)'}], tOff, .35, {e: bounce});
  A(el.querySelector('.lb'), [{opacity: 0, transform: 'translateX(-20px)'}, {opacity: 1, transform: 'none'}], tOff + .15, .3);
}
/* TOP: a big question bubble that turns into a green tick (the answer) */
function tAnswer(t0, t1, {tCheck} = {}) {
  const el = topBand(t0, t1, 'display:flex;justify-content:center', `<div class="bb" style="position:relative;width:250px;height:210px;border-radius:70px;border-bottom-left-radius:20px;background:#fff;box-shadow:0 16px 40px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center">
      <span class="q" style="position:absolute;${BOLD};font-size:140px;color:${OV.ink}">?</span><span class="ck" style="position:absolute;opacity:0">${sym('check', 140, '#fff', 3.2)}</span></div>`);
  const bb = el.querySelector('.bb');
  A(bb, [{opacity: 0, transform: 'scale(.4)'}, {opacity: 1, transform: 'none'}], t0, .45, {e: bounce});
  A(bb, [{transform: 'rotate(-6deg)'}, {transform: 'rotate(6deg)'}], t0 + .5, .5, {it: Math.max(1, Math.floor((tCheck - t0 - .5) / .5)), dir: 'alternate', e: 'ease-in-out', f: 'none'});
  A(bb, [{background: '#fff', boxShadow: '0 16px 40px rgba(0,0,0,.4)'}, {background: OV.green, boxShadow: `0 0 80px ${OV.green}`}], tCheck, .3);
  A(el.querySelector('.q'), [{opacity: 1, transform: 'none'}, {opacity: 0, transform: 'scale(.3) rotate(90deg)'}], tCheck, .2);
  A(el.querySelector('.ck'), [{opacity: 0, transform: 'scale(.3)'}, {opacity: 1, transform: 'none'}], tCheck + .1, .35, {e: bounce});
}
/* TOP: a price tag with red chevrons dropping, again and again */
function tDown(t0, t1) {
  const el = topBand(t0, t1, 'display:flex;align-items:center;justify-content:center;gap:40px',
    `<span style="display:flex;width:190px;height:190px;border-radius:50px;${GL};align-items:center;justify-content:center">${sym('tag', 110, '#fff', 2)}</span>
     <span class="ch" style="display:flex;flex-direction:column;align-items:center;gap:4px;filter:drop-shadow(0 0 14px ${OV.red})">${`<span style="display:block"><svg width="110" height="50" viewBox="0 0 110 50"><path d="M12 10l43 30 43-30" fill="none" stroke="${OV.red}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`.repeat(3)}</span>`);
  A(el.firstElementChild, [{opacity: 0, transform: 'scale(.5)'}, {opacity: 1, transform: 'none'}], t0, .4, {e: bounce});
  el.querySelectorAll('.ch span').forEach((c, i) => A(c, [{opacity: 0, transform: 'translateY(-30px)'}, {opacity: 1, transform: 'translateY(-10px)', offset: .3}, {opacity: 1, transform: 'translateY(10px)', offset: .65}, {opacity: 0, transform: 'translateY(30px)'}], t0 + .2 + i * .2, .9, {e: 'linear', it: Math.ceil((t1 - t0) / .9), f: 'none'}));
}
/* UNDER: two buttons, the cursor clicks them in turn */
function uButtons(t0, t1, buttons) {
  const el = lower(t0, t1, 'height:420px'), n = buttons.length, w = n > 1 ? 380 : 520, xs = buttons.map((_, i) => n > 1 ? 20 + i * 420 : 160);
  const els = buttons.map(([lab, col], i) => { const b = div(`left:${xs[i]}px;top:100px;width:${w}px;height:150px;border-radius:75px;background:${col};display:flex;align-items:center;justify-content:center;${BOLD};font-size:${n > 1 ? 54 : 62}px;color:#fff;box-shadow:0 16px 40px ${col}88`, el, lab);
    A(b, [{opacity: 0, transform: 'scale(.5)'}, {opacity: 1, transform: 'none'}], t0 + i * .12, .4, {e: bounce}); return b; });
  const cx = xs.map(x => x + w / 2), cur = div('left:0;top:0;width:96px;height:96px;filter:drop-shadow(0 6px 12px rgba(0,0,0,.45))', el, CUR());
  const tA = t0 + .1, tB = buttons.at(-1)[2] + .35;
  A(cur, [{transform: 'translate(420px,420px)', offset: 0}, ...buttons.map(([, , t], i) => ({transform: `translate(${cx[i]}px,180px)`, offset: clamp((t - .05 - tA) / (tB - tA))})), {transform: `translate(${Math.min(cx.at(-1) + 40, 720)}px,330px)`, offset: 1}], tA, tB - tA, {e: INOUT});
  buttons.forEach(([, , t], i) => { A(els[i], [{transform: 'scale(1)'}, {transform: 'scale(.9)'}, {transform: 'scale(1)'}], t, .25, {f: 'none'});
    const rp = div(`left:${cx[i] - 90}px;top:${175 - 90}px;width:180px;height:180px;border-radius:50%;border:6px solid #fff;opacity:0`, el); A(rp, [{opacity: .9, transform: 'scale(.3)'}, {opacity: 0, transform: 'scale(2.4)'}], t, .55, {f: 'none'}); });
}
/* UNDER: glowing pay button, cursor hovers and never clicks */
function uPay(t0, t1, {label = ''} = {}) {
  const el = lower(t0, t1, 'height:400px');
  const b = div(`left:160px;top:90px;width:520px;height:160px;border-radius:80px;background:${OV.blue};display:flex;align-items:center;justify-content:center;${BOLD};font-size:66px;color:#fff;box-shadow:0 0 70px ${OV.blue}AA`, el, label);
  A(b, [{opacity: 0, transform: 'scale(.5)'}, {opacity: 1, transform: 'none'}], t0, .4, {e: bounce});
  A(b, [{boxShadow: `0 0 50px ${OV.blue}77`}, {boxShadow: `0 0 110px ${OV.blue}EE`}], t0 + .4, .6, {it: Math.ceil((t1 - t0) / .6), dir: 'alternate', e: 'ease-in-out', f: 'none'});
  const cur = div('left:0;top:0;width:96px;height:96px;filter:drop-shadow(0 6px 12px rgba(0,0,0,.5))', el, CUR('#fff', '#111'));
  const pts = [[720, 380], [560, 250], [680, 210], [580, 290], [700, 250], [600, 320], [740, 390]];
  A(cur, pts.map(([x, y], i) => ({transform: `translate(${x}px,${y}px)`, offset: i / (pts.length - 1)})), t0 + .1, t1 - t0 - .2, {e: 'ease-in-out'});
}
/* TOP: three people, a ? pops over each as the doubts are spoken — times: [t, t, t] */
function tDoubts(t0, t1, times, {label = ''} = {}) {
  const icon = `<svg width="92" height="106" viewBox="0 0 24 28"><circle cx="12" cy="8" r="5" fill="#fff"/><path d="M3 27c0-6 4-10 9-10s9 4 9 10z" fill="#fff"/></svg>`;
  const el = topBand(t0, t1, 'display:flex;flex-direction:column;align-items:center;gap:10px');
  if (label) { const l = document.createElement('div'); l.style.cssText = `font-family:RefSans;font-weight:600;font-size:46px;color:#fff;text-shadow:${SHADOW}`; l.textContent = label; el.appendChild(l); }
  const row = document.createElement('div'); row.style.cssText = 'display:flex;gap:70px;align-items:flex-end'; el.appendChild(row);
  times.forEach(t => { const p = document.createElement('span'); p.style.cssText = 'position:relative;display:block;padding-top:72px;filter:drop-shadow(0 8px 16px rgba(0,0,0,.45))';
    p.innerHTML = `<span class="q" style="position:absolute;left:7px;top:0;width:78px;height:78px;border-radius:50%;background:${OV.orange};${BOLD};font-size:52px;line-height:72px;text-align:center;color:#fff;opacity:0">?</span>${icon}`; row.appendChild(p);
    A(p, [{opacity: 0, transform: 'translateY(30px)'}, {opacity: .6, transform: 'none'}], t0, .35, {e: bounce});
    A(p, [{opacity: .6}, {opacity: 1}], t, .2);
    A(p.querySelector('.q'), [{opacity: 0, transform: 'scale(.3)'}, {opacity: 1, transform: 'none'}], t, .35, {e: bounce}); });
}
/* UNDER: big word struck through */
function uStrike(t0, t1, {pre = '', word = '', tStrike} = {}) {
  const el = lower(t0, t1, 'text-align:center');
  const p = document.createElement('div'); p.style.cssText = `${BOLD};font-size:58px;line-height:1.3;white-space:nowrap`; el.appendChild(p); typeIn(p, pre, t0 + .05, .35, '#fff', SHADOW);
  const w = document.createElement('div'); w.style.cssText = `white-space:nowrap;${BOLD};font-size:160px;line-height:1.15;color:#fff;text-shadow:0 6px 30px rgba(0,0,0,.55)`;
  w.innerHTML = `<span style="position:relative;display:inline-block">${word}<i class="st" style="position:absolute;left:-16px;right:-16px;top:52%;height:18px;border-radius:9px;background:${OV.red};box-shadow:0 0 34px ${OV.red};display:block;transform-origin:left;transform:scaleX(0)"></i></span>`; el.appendChild(w);
  A(w, [{opacity: 0, transform: 'scaleY(2.2) scaleX(.7)'}, {opacity: 1, transform: 'none'}], t0 + .35, .4, {e: bounce});
  A(w.querySelector('.st'), [{transform: 'scaleX(0)'}, {transform: 'scaleX(1)'}], tStrike, .3, {e: SMOOTH});
}
/* UNDER: line through numbered dots */
function uSteps(t0, t1, steps) {
  const el = lower(t0, t1, 'height:420px'), n = steps.length, xs = steps.map((_, i) => 110 + i * (620 / Math.max(1, n - 1)));
  const g = svg(840, 420, `<path class="ln" d="M40 280 H800" stroke="#fff" stroke-width="7" stroke-linecap="round" style="filter:drop-shadow(0 2px 8px rgba(0,0,0,.5))"/>`, 'left:0;top:0', el);
  const ln = g.querySelector('.ln'); ln.setAttribute('pathLength', 1); ln.style.strokeDasharray = 1;
  A(ln, [{strokeDashoffset: 1}, {strokeDashoffset: 0}], steps[0][1] - .15, steps.at(-1)[1] - steps[0][1] + .4, {e: 'linear'});
  steps.forEach(([lab, t], i) => { const last = i === n - 1;
    const d = div(`left:${xs[i] - 30}px;top:250px;width:60px;height:60px;border-radius:50%;background:${last ? OV.green : '#fff'};${last ? `box-shadow:0 0 40px ${OV.green}` : 'box-shadow:0 4px 12px rgba(0,0,0,.5)'}`, el);
    A(d, [{transform: 'scale(0)'}, {transform: 'scale(1)'}], t, .35, {e: bounce});
    const c = div(`left:${clamp(xs[i] - 210, 0, 420)}px;top:${i % 2 ? 330 : 60}px;width:420px;text-align:center;white-space:nowrap`, el,
      `<div style="${BOLD};font-size:32px;color:rgba(255,255,255,.7);text-shadow:${SHADOW}">0${i + 1}</div><div style="${BOLD};font-size:52px;line-height:1.2;color:${last ? OV.green : '#fff'};text-shadow:${last ? glow(OV.green) : SHADOW}">${lab}</div>`);
    A(c, [{opacity: 0, transform: 'translateY(20px)'}, {opacity: 1, transform: 'none'}], t + .05, .35, {e: bounce}); });
}
/* TOP: pin drops on a target above the head */
function tPin(t, t1) {
  const el = topBand(t, t1, 'display:flex;justify-content:center', `<svg width="300" height="260" viewBox="0 0 300 260" style="overflow:visible">
      <ellipse cx="150" cy="215" rx="80" ry="26" fill="${OV.red}" opacity=".25"/><ellipse class="r1" cx="150" cy="215" rx="80" ry="26" fill="none" stroke="${OV.red}" stroke-width="5" opacity="0"/>
      <g class="pin" style="filter:drop-shadow(0 0 22px ${OV.red}aa)"><path d="M150 215c-6-28-50-56-50-96a50 50 0 0 1 100 0c0 40-44 68-50 96z" fill="${OV.red}" stroke="#fff" stroke-width="5"/><circle cx="150" cy="120" r="19" fill="#fff"/></g></svg>`);
  A(el.querySelector('.pin'), [{transform: 'translateY(-300px)', opacity: 0}, {transform: 'none', opacity: 1, offset: .55}, {transform: 'translateY(-28px)', offset: .75}, {transform: 'none'}], t, .6, {e: 'ease-in'});
  const r1 = el.querySelector('.r1'); r1.style.transformOrigin = '150px 215px';
  A(r1, [{transform: 'scale(1)', opacity: .9}, {transform: 'scale(2.2)', opacity: 0}], t + .35, .7, {f: 'none'});
}
