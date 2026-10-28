/* ===================== UI — screen-like pieces (cards, chats, chips, charts) =====================
   Pieces that look like real apps without being any real app: windows, chats, notifications, product pages, charts,
   chips, search bars, comparisons. Every word in them comes from what was said; no invented numbers or names.
   Colour changes from section to section (pick from COL); the captions keep one look all clip long. */
const COL = {blue: '#2F7BFF', orange: '#FF6B2C', green: '#17B37A', purple: '#7C5CFF', pink: '#FF4F8B', yellow: '#FFB81A', red: '#F2443A', teal: '#12B3C6', ink: '#0F1115'};
const tint = (c, a) => c + Math.round(a * 255).toString(16).padStart(2, '0');
const UIF = 'font-family:Sans';
const pop = (el, t, {d = .55, y = 34, s = .96} = {}) => A(el, [{opacity: 0, transform: `translateY(${y}px) scale(${s})`}, {opacity: 1, transform: 'none'}], t, d, {e: OUTX});

/* win(s, x, y, w, h, t, {title, color}) — an app window: traffic dots, a title, a body. Returns the body (window px). */
function win(s, x, y, w, h, t, {title = '', color = COL.blue, dark = false} = {}) {
  const el = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:30px;overflow:hidden;background:${dark ? '#121418' : '#FFFFFF'};box-shadow:0 30px 70px rgba(15,20,35,.16),0 3px 10px rgba(15,20,35,.08);border:1px solid ${dark ? '#2A2D35' : 'rgba(15,17,21,.08)'}`, s);
  pop(el, t);
  const bar = div(`left:0;top:0;width:100%;height:76px;border-bottom:1px solid ${dark ? '#2A2D35' : 'rgba(15,17,21,.07)'};background:${dark ? '#181B21' : '#FAFBFC'}`, el);
  ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, i) => div(`left:${28 + i * 34}px;top:28px;width:20px;height:20px;border-radius:50%;background:${c}`, bar));
  if (title) div(`left:0;top:0;width:100%;height:76px;display:flex;align-items:center;justify-content:center;${UIF};font-weight:600;font-size:30px;color:${dark ? '#C9CDD6' : '#5B616E'}`, bar, title);
  div(`left:${w - 130}px;top:26px;width:90px;height:24px;border-radius:12px;background:${tint(color, .18)}`, bar);
  return div(`left:0;top:76px;width:${w}px;height:${h - 76}px`, el);
}
/* chat(s, x, y, w, h, t, {name, color}) → add(text, t, {me}) — a messenger with a header; bubbles stack from the top */
function chat(s, x, y, w, h, t, {name = '', color = COL.blue} = {}) {
  const el = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:36px;overflow:hidden;background:#fff;box-shadow:0 30px 70px rgba(15,20,35,.16),0 3px 10px rgba(15,20,35,.08)`, s); pop(el, t);
  const hd = div(`left:0;top:0;width:100%;height:120px;background:linear-gradient(180deg,#fff,#F7F8FA);border-bottom:1px solid rgba(15,17,21,.07)`, el);
  const av = div(`left:32px;top:24px;width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,${tint(color, .35)},${color})`, hd);
  const dot = div(`left:84px;top:78px;width:22px;height:22px;border-radius:50%;background:#2FD07A;border:4px solid #fff`, hd);
  if (name) div(`left:126px;top:38px;${UIF};font-weight:700;font-size:38px;color:${COL.ink}`, hd, name);
  let yy = 150; const out = (txt, tt, {me = false, size = 40} = {}) => {
    const b = div(`top:${yy}px;${me ? 'right:28px' : 'left:28px'};max-width:${w - 140}px;padding:20px 30px 24px;border-radius:32px;${me ? 'border-bottom-right-radius:8px' : 'border-bottom-left-radius:8px'};background:${me ? color : '#EFF1F5'};color:${me ? '#fff' : COL.ink};${UIF};font-weight:500;font-size:${size}px;line-height:1.3;white-space:nowrap;transform-origin:${me ? '100%' : '0'} 100%`, el, txt);
    A(b, [{opacity: 0, transform: 'translateY(18px) scale(.86)'}, {opacity: 1, transform: 'none'}], tt, .45, {e: OUTX}); yy += size * 1.3 + 70; return b; };
  out.dot = dot; out.el = el; return out;
}
/* typing(el, x, y, t0, t1) — the three bouncing dots */
function typing(el, x, y, t0, t1) {
  const b = div(`left:${x}px;top:${y}px;width:130px;height:72px;border-radius:36px;background:#EFF1F5`, el);
  [0, 1, 2].forEach(i => { const d = div(`left:${30 + i * 26}px;top:28px;width:16px;height:16px;border-radius:50%;background:#9AA1AE`, b);
    A(d, [{transform: 'translateY(0)'}, {transform: 'translateY(-10px)'}, {transform: 'translateY(0)'}], t0 + i * .12, .5, {it: Math.max(1, Math.floor((t1 - t0) / .5)), f: 'none'}); });
  window_(b, t0, t1); return b;
}
/* notif(s, x, y, w, t, {title, body, color, glyph}) — a notification banner sliding down */
function notif(s, x, y, w, t, {title = '', body = '', color = COL.green, glyph = 'chat'} = {}) {
  const el = div(`left:${x}px;top:${y}px;width:${w}px;height:150px;border-radius:34px;background:rgba(255,255,255,.96);box-shadow:0 24px 60px rgba(15,20,35,.18)`, s);
  A(el, [{opacity: 0, transform: 'translateY(-50px) scale(.95)'}, {opacity: 1, transform: 'none'}], t, .55, {e: OUTX});
  const ic = div(`left:28px;top:31px;width:88px;height:88px;border-radius:22px;background:${color}`, el); icon(ic, glyph, 44, 44, 54, t + .2, {color: '#fff', width: 8});
  div(`left:140px;top:30px;${UIF};font-weight:700;font-size:34px;color:${COL.ink};white-space:nowrap`, el, title);
  div(`left:140px;top:78px;${UIF};font-weight:500;font-size:32px;color:#5B616E;white-space:nowrap`, el, body);
  return el;
}
/* product(s, x, y, w, t, {color, label}) — a product page card: a soft gradient image, a title bar, a price chip (no figures), a buy button */
function product(s, x, y, w, t, {color = COL.orange, button = '', tag = ''} = {}) {
  const h = w * 1.05, el = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:36px;background:#fff;box-shadow:0 30px 70px rgba(15,20,35,.16)`, s); pop(el, t);
  const img = div(`left:24px;top:24px;width:${w - 48}px;height:${w * .55}px;border-radius:24px;background:radial-gradient(circle at 30% 30%,${tint(color, .35)},${tint(color, .12)} 70%)`, el);
  icon(img, 'box', (w - 48) / 2, w * .275, w * .3, t + .2, {color, width: 3.5});
  div(`left:24px;top:${w * .55 + 54}px;width:${w * .55}px;height:30px;border-radius:15px;background:#E9ECF1`, el);
  div(`left:24px;top:${w * .55 + 100}px;width:${w * .35}px;height:24px;border-radius:12px;background:#F0F2F5`, el);
  const pr = div(`left:24px;top:${w * .55 + 150}px;height:66px;padding:0 26px;border-radius:33px;background:${tint(color, .14)};display:flex;align-items:center;gap:12px;${UIF};font-weight:700;font-size:40px;color:${color}`, el, `฿ <span style="display:inline-block;width:140px;height:26px;border-radius:13px;background:${tint(color, .35)}"></span>`);
  pop(pr, t + .25, {y: 14});
  const btn = div(`left:24px;top:${h - 110}px;width:${w - 48}px;height:84px;border-radius:24px;background:${COL.ink};color:#fff;${UIF};font-weight:700;font-size:38px;display:flex;align-items:center;justify-content:center`, el, button);
  if (tag) { const tg = div(`right:24px;top:${w * .55 + 140}px;padding:10px 26px 14px;border-radius:40px;background:${color};color:#fff;font-family:Accent;font-style:italic;font-weight:700;font-size:48px;white-space:nowrap`, el, tag);
    A(tg, [{opacity: 0, transform: 'scale(.5) rotate(-10deg)'}, {opacity: 1, transform: 'rotate(-5deg)'}], t + .5, .5, {e: 'cubic-bezier(.3,1.5,.5,1)'}); }
  return {el, btn};
}
/* chart(s, x, y, w, h, t, {color, dir, label}) — a chart card: grid, a filled curve that draws, a live dot at the end. No axis numbers. */
function chart(s, x, y, w, h, t, {color = COL.blue, dir = 'down', label = '', dur = 1.1} = {}) {
  const el = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:32px;background:#fff;box-shadow:0 30px 70px rgba(15,20,35,.14)`, s); pop(el, t);
  if (label) { const lb = div(`left:32px;top:28px;display:flex;align-items:center;gap:14px;${UIF};font-weight:700;font-size:36px;color:${COL.ink}`, el, `<span style="width:18px;height:18px;border-radius:50%;background:${color}"></span>${label}`); pop(lb, t + .1, {y: 10}); }
  const W = w - 64, H = h - 140, ys = dir === 'down' ? [.18, .26, .2, .42, .38, .62, .7, .9] : [.9, .78, .82, .6, .64, .4, .3, .12];
  const pts = ys.map((v, i) => [i / (ys.length - 1) * W, v * H]), d = 'M' + pts.map(p => p.map(n => n.toFixed(1)).join(' ')).join(' L');
  const g = gid('cg'), sv = div(`left:32px;top:110px;width:${W}px;height:${H}px`, el, `<svg width="${W}" height="${H}" style="overflow:visible">
    <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".28"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    ${[0, .33, .66, 1].map(f => `<line x1="0" x2="${W}" y1="${f * H}" y2="${f * H}" stroke="#E9ECF1" stroke-width="2"/>`).join('')}
    <path class="a" d="${d} L${W} ${H} L0 ${H} Z" fill="url(#${g})"/>
    <path class="l" d="${d}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/>
    <circle class="c" cx="${pts.at(-1)[0]}" cy="${pts.at(-1)[1]}" r="12" fill="${color}"/></svg>`);
  A(sv.querySelector('.l'), [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t + .3, dur, {e: OUTQ});
  A(sv.querySelector('.a'), [{clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0 0 0)'}], t + .3, dur, {e: OUTQ});
  A(sv.querySelector('.c'), [{opacity: 0, transform: 'scale(0)'}, {opacity: 1, transform: 'scale(1)'}], t + .3 + dur, .3, {e: OUTX}); sv.querySelector('.c').style.transformBox = 'fill-box'; sv.querySelector('.c').style.transformOrigin = 'center';
  return el;
}
let _g = 0; const gid = p => `${p}${++_g}`;
/* chips(s, x, y, words, t, {colors, step}) — rounded tags that pop in one by one */
function chips(s, x, y, words, t, {colors = [COL.blue, COL.orange, COL.green, COL.purple], step = .12, size = 40} = {}) {
  const row = div(`left:${x}px;top:${y}px;display:flex;flex-wrap:wrap;gap:18px;max-width:900px`, s);
  return words.map((w, i) => { const c = colors[i % colors.length], el = div(`position:relative;padding:14px 30px 18px;border-radius:40px;background:#fff;box-shadow:0 10px 26px rgba(15,20,35,.12);border:3px solid ${tint(c, .35)};color:${c};${UIF};font-weight:700;font-size:${size}px;white-space:nowrap`, row, w);
    A(el, [{opacity: 0, transform: 'scale(.6)'}, {opacity: 1, transform: 'none'}], (Array.isArray(t) ? t[i] : t + i * step), .4, {e: 'cubic-bezier(.3,1.4,.5,1)'}); return el; });
}
/* search(s, x, y, w, text, t, {d}) — a search bar that types the words */
function search(s, x, y, w, text, t, {d = .8, color = COL.blue} = {}) {
  const el = div(`left:${x}px;top:${y}px;width:${w}px;height:120px;border-radius:60px;background:#fff;box-shadow:0 20px 50px rgba(15,20,35,.14);border:3px solid ${tint(color, .4)}`, s); pop(el, t);
  icon(el, 'M42 42 m-24 0 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0 M60 60 L84 84', 60, 55, 54, t + .1, {color: '#9AA1AE', width: 8});
  const tx = div(`left:110px;top:24px;${UIF};font-weight:500;font-size:44px;color:${COL.ink};white-space:nowrap`, el), gs = graphemes(text);
  const caret = div(`left:110px;top:28px;width:4px;height:54px;background:${color}`, el);
  HOOKS.push(tt => { const n = clamp(Math.round((tt - t - .2) / d * gs.length), 0, gs.length); tx.textContent = gs.slice(0, n).join(''); caret.style.left = 112 + tx.offsetWidth + 'px'; caret.style.opacity = Math.floor(tt * 2.4) % 2 ? .2 : 1; });
  return el;
}
/* versus(s, x, y, w, h, [left, right], t, {colors}) — two cards side by side, the losing one fades and gets a ✗, the winner a ✓ */
function versus(s, x, y, w, h, sides, t, {colors = [COL.red, COL.green], tVerdict, winner = 1} = {}) {
  const cw = (w - 30) / 2;
  return sides.map(([title, glyph], i) => { const c = colors[i], el = div(`left:${x + i * (cw + 30)}px;top:${y}px;width:${cw}px;height:${h}px;border-radius:32px;background:#fff;box-shadow:0 26px 60px rgba(15,20,35,.14)`, s); pop(el, t + i * .12);
    const ic = div(`left:${cw / 2 - 70}px;top:46px;width:140px;height:140px;border-radius:40px;background:${tint(c, .14)}`, el); icon(ic, glyph, 70, 70, 84, t + .2 + i * .12, {color: c, width: 6});
    div(`left:0;top:220px;width:${cw}px;text-align:center;${UIF};font-weight:700;font-size:44px;color:${COL.ink};white-space:nowrap`, el, title);
    if (tVerdict != null) { const ok = i === winner, b = div(`left:${cw - 96}px;top:-26px;width:84px;height:84px;border-radius:50%;background:${ok ? COL.green : COL.red}`, el);
      icon(b, ok ? 'check' : 'cross', 42, 42, 46, tVerdict + .1, {color: '#fff', width: 12}); A(b, [{transform: 'scale(0)'}, {transform: 'none'}], tVerdict, .4, {e: 'cubic-bezier(.3,1.5,.5,1)'});
      if (!ok) A(el, [{opacity: 1}, {opacity: .45}], tVerdict, .3, {f: 'forwards'}); }
    return el; });
}
