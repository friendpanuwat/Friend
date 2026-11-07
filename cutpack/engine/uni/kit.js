/* =====================================================================
   CutPack · uni · KIT — the only words a base scene may use.
   Nothing here picks a colour, a font, a size of line or a speed: every element gets a role class
   (u-panel, u-badge, ln/sd/fl/ac …) that the style's CSS paints, and every move asks the style's motion set.
   Scenes draw on a 1000 × 700 canvas; the style decides where that canvas sits and how big it is.
   ===================================================================== */
const ICO = (name, size, cls = 'u-ico') =>
  `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
/* a drawn thing has 4 nested layers so its moves never fight: o = enter/leave, f = idle float, m = state moves, p = punch/shake */
function node(parent, x, y, w, h, cls = '', html = '') {
  const o = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
  const f = div('inset:0', o), m = div('inset:0', f), p = div('inset:0', m, html);
  if (cls) p.className = cls;
  return {o, f, m, p, x, y, w, h};
}
/* jigsaw piece outline, clockwise, edges [top, right, bottom, left]: 1 tab out, -1 tab in, 0 flat */
function jigsawPath(s, edges, ox = 0, oy = 0) {
  const r = s * .17, a = .36, b = .64;
  const edge = (x0, y0, dx, dy, type) => {
    const P = k => `${(ox + x0 + dx * s * k).toFixed(1)} ${(oy + y0 + dy * s * k).toFixed(1)}`;
    return type ? `L${P(a)} A${r.toFixed(1)} ${r.toFixed(1)} 0 1 ${type > 0 ? 1 : 0} ${P(b)} L${P(1)}` : `L${P(1)}`;
  };
  const [t, rt, bt, l] = edges;
  return `M${ox} ${oy}` + edge(0, 0, 1, 0, t) + edge(s, 0, 0, 1, rt) + edge(s, s, -1, 0, bt) + edge(0, s, 0, -1, l) + 'Z';
}

/* icons that only decorate (an overlay too small for them leaves them out) */
const DECOR_ICONS = new Set(['sparkles', 'star', 'hourglass']);

function kit(F, T) {
  const M = ST.motion;
  const snd = (name, t) => { const s = ST.sound?.[name]; if (s) sfx(s[0], t, s[1]); };
  const K = {
    F, T, W: 1000, H: 700, stage: F.stage,

    /* ---------- motion verbs (the style decides how each one looks) ---------- */
    enter(el, t, kind = 'pop') { const m = M[kind]; A(el, m.kf, t, m.d, {e: m.e}); snd(kind, t); return el; },
    leave(el, t) { A(el, M.leave.kf, t, M.leave.d, {e: M.leave.e, f: 'forwards'}); snd('leave', t); },
    punch(el, t) { A(el, M.punch.kf, t, M.punch.d, {e: M.punch.e, f: 'none'}); snd('hit', t); },
    shake(el, t) { A(el, M.shake.kf, t, M.shake.d, {e: M.shake.e, f: 'none'}); snd('hit', t); },
    /* a state change: from → to. hold = also keep "from" before t (for the first move of a thing that starts off-place) */
    move(el, t, from, to, {kind = 'move', hold = false} = {}) {
      const m = M[kind]; A(el, [{transform: from}, {transform: to}], t, m.d, {e: m.e, f: hold ? 'both' : 'forwards'});
    },
    fade(el, t, from, to, {hold = false} = {}) { A(el, [{opacity: from}, {opacity: to}], t, M.swap.d, {e: M.swap.e, f: hold ? 'both' : 'forwards'}); },
    draw(path, t, d = M.draw.d) {
      path.setAttribute('pathLength', 1); path.style.strokeDasharray = 1;
      A(path, [{strokeDashoffset: 1}, {strokeDashoffset: 0}], t, d, {e: M.draw.e});
    },
    /* grow a bar from its start (origin set by the caller) */
    grow(el, t, axis = 'X', d = M.draw.d) { A(el, [{transform: `scale${axis}(0)`}, {transform: 'none'}], t, d, {e: M.draw.e}); },

    /* idle float (style's amplitude and period) from t0 to t1, so a finished picture is never frozen */
    float(n, t0, t1 = T.t1, k = 1) {
      const fl = M.float; if (!fl || !n.f || t1 <= t0) return;
      const it = Math.max(1, Math.ceil((t1 - t0) / fl.p)), a = fl.a * k;
      A(n.f, [{transform: 'translateY(0)'}, {transform: `translateY(${-a}px)`}, {transform: 'translateY(0)'}], t0, fl.p, {e: 'ease-in-out', f: 'none', it});
    },

    /* ---------- surfaces ---------- */
    /* a soft light / ring behind the hero thing (the style paints .u-halo) */
    halo(parent, cx, cy, r, t) {
      const h = div(`left:${cx - r}px;top:${cy - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%`, parent); h.className = 'u-halo u-decor';
      K.enter(h, t, 'glow'); return h;
    },
    /* a small satellite tile that floats beside the hero (✓ ? ✦ ↑ …) */
    sat(parent, icon, cx, cy, size, t, {tone = 'main', shape = 'tile', k = 1.4} = {}) {
      const n = K.badge(parent, icon, cx, cy, size, t, {tone, shape});
      if (DECOR_ICONS.has(icon)) n.o.classList.add('u-decor');                  // a small overlay drops pure decoration
      K.float(n, t + .5, T.t1, k); return n;
    },
    /* a faded card behind a card, for depth */
    ghost(parent, x, y, w, h, t) {
      const n = node(parent, x, y, w, h, 'u-panel u-ghost'); n.o.classList.add('u-decor'); K.enter(n.o, t, 'rise'); return n;
    },
    /* a word chip centred on (cx, cy) */
    chipC(parent, txt, cx, cy, t, {tone = 'main', size = 40} = {}) {
      const w = div(`left:${cx - 300}px;top:${cy - size * .75}px;width:600px;height:${size * 1.5}px;display:flex;justify-content:center;align-items:center`, parent);
      const c = document.createElement('span'); c.className = `u-chip u-${tone}`; c.style.fontSize = size + 'px'; c.textContent = txt; w.appendChild(c); w.classList.add('u-text');
      K.enter(w, t, 'chip'); return w;
    },
    panel(x, y, w, h, t, {parent = F.stage, kind = 'rise'} = {}) {
      const n = node(parent, x, y, w, h, 'u-panel'); K.enter(n.o, t, kind); return n;
    },
    skel(parent, x, y, widths, t, {h = 18, gap = 26} = {}) {
      return widths.map((w, i) => {
        const l = div(`left:${x}px;top:${y + i * (h + gap)}px;width:${w}px;height:${h}px;border-radius:${h / 2}px;transform-origin:0 50%`, parent);
        l.className = 'u-skel u-decor'; K.grow(l, t + i * M.stagger); return l;
      });
    },
    label(parent, txt, x, y, {size = 40, cls = 'u-label', anchor = 'left'} = {}) {
      const l = div(`left:${x}px;top:${y}px;white-space:nowrap;font-size:${size}px;line-height:1.25;${anchor === 'center' ? 'transform:translateX(-50%)' : ''}`, parent);
      l.className = cls + ' u-text'; l.textContent = txt; return l;
    },
    /* icon in the style's holder. tone: main | acc | soft | neg · shape: tile | round */
    badge(parent, icon, cx, cy, size, t, {tone = 'main', shape = 'tile', kind = 'pop'} = {}) {
      const n = node(parent, cx - size / 2, cy - size / 2, size, size, `u-badge u-${tone} u-${shape}`, ICO(icon, Math.round(size * .5)));
      n.p.style.borderRadius = shape === 'round' ? '50%' : `calc(${size}px * var(--tile-r))`;
      if (t != null) K.enter(n.o, t, kind);
      return n;
    },
    chip(parent, txt, x, y, t, {tone = 'main', size = 40, dot = false} = {}) {
      const n = node(parent, x, y, 0, 0, '');
      const c = div(`left:0;top:0;white-space:nowrap;font-size:${size}px`, n.p, (dot ? '<i class="u-dot"></i>' : '') + `<span>${txt}</span>`);
      c.className = `u-chip u-${tone}`; n.o.classList.add('u-text');
      if (t != null) K.enter(n.o, t, 'chip');
      return n;
    },
    /* ✓ in the style's "ok" holder, or ✗ drawn in two strokes */
    mark(parent, kind, cx, cy, size, t) {
      if (kind === 'check') { const b = K.badge(parent, 'check', cx, cy, size, t, {tone: 'ok', shape: 'tile'}); snd('ok', t); return b; }
      const n = node(parent, cx - size / 2, cy - size / 2, size, size, '',
        `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="overflow:visible"><path class="u-cross" d="M18 18L82 82"/><path class="u-cross" d="M82 18L18 82"/></svg>`);
      const [a, b] = n.p.querySelectorAll('path');
      K.draw(a, t, M.stroke.d); K.draw(b, t + M.stroke.d * .8, M.stroke.d); snd('cross', t);
      return n;
    },

    /* ---------- shared things (drawn once, painted by every style) ---------- */
    toggle(parent, x, y, w, t) {
      const h = Math.round(w * .5), pad = Math.round(h * .1), k = h - 2 * pad;
      const n = node(parent, x, y, w, h, 'u-track'); n.p.style.borderRadius = h / 2 + 'px';
      const on = div(`inset:0;border-radius:${h / 2}px;opacity:0`, n.p); on.className = 'u-track-on';
      const knob = node(n.p, pad, pad, k, k, 'u-knob'); knob.p.style.borderRadius = '50%';
      K.enter(n.o, t, 'pop');
      let v = 0;
      return {n, knob, set(t, nv) {
        K.move(knob.m, t, `translateX(${v * (w - h)}px)`, `translateX(${nv * (w - h)}px)`);
        K.fade(on, t, v, nv); v = nv;
      }};
    },
    /* a price-style slider; v runs 0..1 (left → right, or bottom → top when vertical) */
    slider(parent, x, y, len, t, v0 = 0, {knobIcon = 'percent', k = 76, vertical = false} = {}) {
      const h = 18, n = vertical ? node(parent, x - h / 2, y, h, len, 'u-bar') : node(parent, x, y - h / 2, len, h, 'u-bar');
      n.p.style.borderRadius = h / 2 + 'px';
      const sc = v => vertical ? `scaleY(${v})` : `scaleX(${v})`, pos = v => vertical ? `translateY(${-v * len}px)` : `translateX(${v * len}px)`;
      const fill = div(`left:0;top:0;width:${vertical ? h : len}px;height:${vertical ? len : h}px;border-radius:${h / 2}px;` +
        `transform-origin:${vertical ? '50% 100%' : '0 50%'};transform:${sc(v0)}`, n.p); fill.className = 'u-bar-on';
      const knob = node(parent, x - k / 2, (vertical ? y + len : y) - k / 2, k, k, 'u-knob', ICO(knobIcon, Math.round(k * .46), 'u-ico u-knob-ico'));
      knob.p.style.borderRadius = '50%'; knob.m.style.transform = pos(v0);
      K.enter(n.o, t, 'rise'); K.enter(knob.o, t + M.stagger, 'pop');
      let v = v0;
      return {n, knob, set(t, nv) {
        K.move(knob.m, t, pos(v), pos(nv));
        A(fill, [{transform: sc(v)}, {transform: sc(nv)}], t, M.move.d, {e: M.move.e, f: 'forwards'});
        v = nv;
      }};
    },
    /* rows: [{text} | {skel: 0..1}] → [{box, cx, cy}] */
    checklist(parent, x, y, w, rows, t, {rowH = 120, box = 66} = {}) {
      return rows.map((r, i) => {
        const cy = y + i * rowH + rowH / 2, ti = t + i * M.stagger;
        const b = node(parent, x, cy - box / 2, box, box, 'u-box'); b.p.style.borderRadius = `calc(${box}px * var(--box-r))`;
        K.enter(b.o, ti, 'pop');
        let label = null;
        if (r.text) { label = K.label(parent, r.text, x + box + 32, cy - 34, {size: 54}); K.enter(label, ti + .05, 'lead'); }
        else K.skel(parent, x + box + 30, cy - 9, [(w - box - 30) * (r.skel ?? .6)], ti);
        return {box: b, label, cx: x + box / 2, cy};
      });
    },
    avatar(parent, cx, cy, size, t) { return K.badge(parent, 'user', cx, cy, size, t, {tone: 'main', shape: 'round'}); },
    /* a balance. kind 'hanging': post + beam + two hanging pans · 'seesaw': a plank on a triangle, things sit on its ends.
       Pivot at (cx, top), half-length L. Items go in panL.p / panR.p at .item (they stay upright when it tips) */
    scale(parent, cx, top, t, {kind = 'hanging', L = 300, stand = 400, pan = 230} = {}) {
      const g = div(`left:0;top:0;width:1000px;height:700px`, parent);
      const base = kind === 'seesaw'
        ? `<path class="sd" d="M${cx} ${top + 14}L${cx + 96} ${top + 170}H${cx - 96}Z"/><path class="ln u-thick" d="M${cx - 260} ${top + 170}H${cx + 260}"/>`
        : `<path class="ln" d="M${cx} ${top}V${top + stand}"/><path class="ln u-thick" d="M${cx - 120} ${top + stand}H${cx + 120}"/>`;
      const st = div('left:0;top:0;width:1000px;height:700px', g, `<svg width="1000" height="700" style="overflow:visible">${base}</svg>`);
      st.querySelectorAll('path').forEach((p, i) => p.classList.contains('sd') ? K.enter(st, t, 'rise') : K.draw(p, t + i * .1));
      const beam = node(g, cx - L, top - 20, 2 * L, 40, '', `<svg width="${2 * L}" height="40" style="overflow:visible"><path class="ln" d="M0 20H${2 * L}"/></svg>`);
      K.draw(beam.p.querySelector('path'), t + .15);
      const pivot = div(`left:${cx - 20}px;top:${top - 20}px;width:40px;height:40px`, g, '<svg width="40" height="40"><circle class="ac u-dotc" cx="20" cy="20" r="15"/></svg>');
      K.enter(pivot, t + .3, 'pop');
      const hang = kind === 'seesaw' ? 0 : 178, panH = 42;
      const mk = side => {
        const ex = cx + side * L;
        const n = node(g, ex - pan / 2, top, pan, hang + panH, '', kind === 'seesaw' ? '' :
          `<svg width="${pan}" height="${hang + panH}" style="overflow:visible"><path class="ln u-thin" d="M${pan / 2} 0V${hang}"/>` +
          `<path class="sd" d="M4 ${hang}H${pan - 4}Q${pan * .78} ${hang + panH} ${pan / 2} ${hang + panH}Q${pan * .22} ${hang + panH} 4 ${hang}Z"/></svg>`);
        if (kind !== 'seesaw') K.enter(n.o, t + .35, 'rise');
        n.item = {cx: pan / 2, cy: kind === 'seesaw' ? -82 : hang - 70};      // where an item badge sits (inside n.p)
        return n;
      };
      const panL = mk(-1), panR = mk(1);
      return {panL, panR, beam, tilt(t, deg) {        // deg < 0: left side goes down
        const r = deg * Math.PI / 180, dy = L * Math.sin(r), dx = L * (1 - Math.cos(r));
        K.move(beam.m, t, 'rotate(0deg)', `rotate(${deg}deg)`, {kind: 'tilt'});
        K.move(panL.m, t, 'translate(0,0)', `translate(${dx}px,${-dy}px)`, {kind: 'tilt'});
        K.move(panR.m, t, 'translate(0,0)', `translate(${-dx}px,${dy}px)`, {kind: 'tilt'});
      }};
    },
    /* a jigsaw board of cols × rows pieces (side s) with one piece missing (miss = [col, row]);
       enterLoose(t) shows the loose piece away from its place (from), place(t) flies it in */
    puzzle(parent, x, y, s, t, {icon = 'package', cols = 2, rows = 2, miss = [1, 1], from = 'translate(250px,90px) rotate(-16deg)'} = {}) {
      const H = (i, j) => (i + j) % 2 ? 1 : -1, Vb = (i, j) => (i + j) % 2 ? -1 : 1;
      const edges = (i, j) => [j > 0 ? -H(i, j - 1) : 0, i < cols - 1 ? Vb(i, j) : 0, j < rows - 1 ? H(i, j) : 0, i > 0 ? -Vb(i - 1, j) : 0];
      const pad = s * .3, BW = cols * s + 2 * pad, BH = rows * s + 2 * pad, [mi, mj] = miss;
      let inner = `<path class="u-slot" d="${jigsawPath(s, edges(mi, mj), pad + mi * s, pad + mj * s)}"/>`;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++)
        if (i !== mi || j !== mj) inner += `<path class="fl" d="${jigsawPath(s, edges(i, j), pad + i * s, pad + j * s)}"/>`;
      const board = div(`left:${x - pad}px;top:${y - pad}px;width:${BW}px;height:${BH}px`, parent, `<svg width="${BW}" height="${BH}" style="overflow:visible">${inner}</svg>`);
      K.enter(board, t, 'rise');
      const loose = node(parent, x + mi * s - pad, y + mj * s - pad, s + 2 * pad, s + 2 * pad, '',
        `<svg width="${s + 2 * pad}" height="${s + 2 * pad}" style="overflow:visible"><path class="ac" d="${jigsawPath(s, edges(mi, mj), pad, pad)}"/></svg>`);
      div(`left:${pad + s / 2 - s * .22}px;top:${pad + s / 2 - s * .22}px;width:${s * .44}px;height:${s * .44}px`, loose.p, ICO(icon, Math.round(s * .44), 'u-ico u-on-acc'));
      K.move(loose.m, 0, from, from, {hold: true});
      return {board, loose, right: x + cols * s, top: y, enterLoose(t) { K.enter(loose.o, t, 'pop'); },
        place(t) { K.move(loose.m, t, from, 'none', {kind: 'snap'}); }};
    },

    /* ---------- more shared things (round 2: other pictures of the same meanings) ---------- */
    /* vertical bars on a floor: values 0..1; set(t, values) moves them to new heights */
    bars(parent, x, y, w, h, values, t, {gap = 26, acc = -1, step = M.stagger, trend = false} = {}) {
      const n = values.length, bw = (w - gap * (n - 1)) / n;
      const floor = div(`left:${x - 10}px;top:${y + h}px;width:${w + 20}px;height:0`, parent,
        `<svg width="${w + 20}" height="10" style="overflow:visible"><path class="ln u-thin" d="M0 0H${w + 20}"/></svg>`);
      K.draw(floor.querySelector('path'), t);
      let cur = values.slice();
      const cols = values.map((v, i) => {
        const c = div(`left:${x + i * (bw + gap)}px;top:${y}px;width:${bw}px;height:${h}px;transform-origin:50% 100%;border-radius:${Math.min(18, bw / 4)}px ${Math.min(18, bw / 4)}px 4px 4px`, parent);
        c.className = i === (acc < 0 ? n + acc : acc) ? 'u-col u-col-acc' : 'u-col';
        A(c, [{transform: 'scaleY(0)'}, {transform: `scaleY(${v})`}], t + .1 + i * step, M.draw.d * .8, {e: M.move.e});
        return c;
      });
      if (trend) {                                               // a line through the tops, drawn after the last bar
        const pts = values.map((v, i) => [x + i * (bw + gap) + bw / 2, y + h * (1 - v)]);
        const tl = div('left:0;top:0;width:1px;height:1px', parent,
          `<svg width="1" height="1" style="overflow:visible"><path class="ln u-thin u-trend" d="M${pts.map(p => p.map(n => n.toFixed(1)).join(' ')).join('L')}"/></svg>`);
        K.draw(tl.querySelector('path'), t + .1 + n * step + .2, .6);
      }
      return {cols, set(t, nv) { cols.forEach((c, i) => A(c, [{transform: `scaleY(${cur[i]})`}, {transform: `scaleY(${nv[i]})`}], t + i * M.stagger * .5, M.move.d, {e: M.move.e, f: 'forwards'})); cur = nv.slice(); }};
    },
    /* one horizontal measure: icon holder + a track that fills to v */
    measure(parent, x, y, w, t, v, icon, {tone = 'main', fill = 'u-bar-main', size = 104} = {}) {
      K.badge(parent, icon, x + size / 2, y, size, t, {tone});
      const bx = x + size + 30, bw = w - size - 30, h = 34;
      const tr = node(parent, bx, y - h / 2, bw, h, 'u-bar'); tr.p.style.borderRadius = h / 2 + 'px';
      const f = div(`left:0;top:0;width:${bw}px;height:${h}px;border-radius:${h / 2}px;transform-origin:0 50%`, tr.p); f.className = fill;
      K.enter(tr.o, t + .1, 'rise');
      A(f, [{transform: 'scaleX(0)'}, {transform: `scaleX(${v})`}], t + .3, M.move.d * 1.3, {e: M.move.e});
      let cur = v;
      return {track: tr, end: bx + bw * v, bx, bw, at: k => bx + bw * k,
        set(t, nv) { A(f, [{transform: `scaleX(${cur})`}, {transform: `scaleX(${nv})`}], t, M.move.d * 1.3, {e: M.move.e, f: 'forwards'}); cur = nv; }};
    },
    /* n stars in a row; light(t, k) lights the first k */
    stars(parent, cx, cy, n, size, t) {
      const gap = size * .25, W = n * size + (n - 1) * gap, star = r => {
        let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += `${i ? 'L' : 'M'}${(r + rr * Math.cos(a)).toFixed(1)} ${(r + rr * Math.sin(a)).toFixed(1)}`; }
        return d + 'Z'; };
      const items = [...Array(n)].map((_, i) => {
        const g = node(parent, cx - W / 2 + i * (size + gap), cy - size / 2, size, size, '',
          `<svg width="${size}" height="${size}" style="overflow:visible"><path class="u-star" d="${star(size / 2)}"/><path class="ac u-star-on" d="${star(size / 2)}" style="opacity:0"/></svg>`);
        K.enter(g.o, t + i * M.stagger * .6, 'pop'); return g;
      });
      return {items, light(t, k) { items.slice(0, k).forEach((g, i) => { K.fade(g.p.querySelector('.u-star-on'), t + i * .12, 0, 1); K.punch(g.p, t + i * .12); }); }};
    },
    /* a pill button with an icon (tone as badges) */
    button(parent, cx, cy, w, h, icon, t, {tone = 'main'} = {}) {
      const n = node(parent, cx - w / 2, cy - h / 2, w, h, `u-badge u-${tone}`, ICO(icon, Math.round(h * .5)));
      n.p.style.borderRadius = '999px'; if (t != null) K.enter(n.o, t, 'pop'); return n;
    },
    /* a pointer that travels through [[t, x, y], …] and presses at clicks (it never presses when clicks is empty) */
    cursor(parent, pts, {clicks = [], size = 92} = {}) {
      const n = node(parent, 0, 0, size, size, 'u-cursor',
        `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="overflow:visible"><path d="M4 2l15 9-7 1.5L9 20z" stroke-width="1.3" stroke-linejoin="round"/></svg>`);
      const t0 = pts[0][0], t1 = pts.at(-1)[0];
      A(n.o, pts.map(([t, x, y]) => ({transform: `translate(${x}px,${y}px)`, offset: (t - t0) / (t1 - t0)})), t0, t1 - t0, {e: M.move.e});
      A(n.m, [{opacity: 0}, {opacity: 1}], t0, .25);
      clicks.forEach(t => A(n.p, [{transform: 'scale(1)'}, {transform: 'scale(.82)'}, {transform: 'scale(1)'}], t, .25, {f: 'none'}));
      return n;
    },
    /* a half-round gauge; swing(t, deg) turns the needle (-80 = far left, 0 = middle, 80 = far right) */
    gauge(parent, cx, cy, r, t) {
      const ticks = [...Array(9)].map((_, i) => { const a = Math.PI + i * Math.PI / 8, r0 = r * .78, r1 = r * .88;
        return `<path class="ln u-thin" d="M${(r + r0 * Math.cos(a)).toFixed(1)} ${(r + r0 * Math.sin(a)).toFixed(1)}L${(r + r1 * Math.cos(a)).toFixed(1)} ${(r + r1 * Math.sin(a)).toFixed(1)}"/>`; }).join('');
      const g = div(`left:${cx - r}px;top:${cy - r}px;width:${2 * r}px;height:${r}px`, parent,
        `<svg width="${2 * r}" height="${r}" style="overflow:visible"><path class="ln" d="M0 ${r}A${r} ${r} 0 0 1 ${2 * r} ${r}"/>${ticks}</svg>`);
      g.querySelectorAll('path').forEach((p, i) => K.draw(p, t + (i ? .3 + i * .03 : 0)));
      const nd = node(parent, cx - 20, cy - r * .74, 40, r * .74 + 20, '',
        `<svg width="40" height="${r * .74 + 20}" style="overflow:visible"><path class="ln" d="M20 ${r * .74}V8"/><circle class="ac u-dotc" cx="20" cy="${r * .74}" r="18"/></svg>`);
      nd.m.style.transformOrigin = `20px ${r * .74}px`; nd.p.style.transformOrigin = `20px ${r * .74}px`;
      K.enter(nd.o, t + .4, 'pop');
      let a = 0;
      return {swing(t, deg) { K.move(nd.m, t, `rotate(${a}deg)`, `rotate(${deg}deg)`, {kind: 'tilt'}); a = deg; }};
    },
    /* a target of rings; hit(t, from) flies an arrow into the middle */
    target(parent, cx, cy, r, t) {
      const g = node(parent, cx - r, cy - r, 2 * r, 2 * r, '',
        `<svg width="${2 * r}" height="${2 * r}" style="overflow:visible"><circle class="u-tgt" cx="${r}" cy="${r}" r="${r}"/><circle class="ln" cx="${r}" cy="${r}" r="${r * .66}"/>` +
        `<circle class="ln" cx="${r}" cy="${r}" r="${r * .34}"/><circle class="ac" cx="${r}" cy="${r}" r="${r * .14}"/></svg>`);
      K.enter(g.o, t, 'pop');
      return {g, hit(t, {angle = -35, dist = 420} = {}) {     // the arrow flies in along its own line, tail up-right
        const L = r * 1.3;
        const ar = node(parent, cx, cy - 22, L, 44, '',
          `<svg width="${L}" height="44" style="overflow:visible"><path class="ln" d="M30 22H${L}"/><path class="ac" d="M46 4L0 22L46 40Z"/><path class="ln u-thin" d="M${L} 22l26 -18M${L} 22l26 18"/></svg>`);
        ar.o.style.transformOrigin = '0 22px'; ar.o.style.transform = `rotate(${angle}deg)`;
        K.move(ar.m, t - .3, `translateX(${dist}px)`, 'none', {hold: true, kind: 'snap'});
        K.fade(ar.p, t - .32, 0, 1, {hold: true});
        K.punch(g.p, t);
      }};
    },
    /* four corner marks that close in on (cx, cy) */
    brackets(parent, cx, cy, size, t, tIn) {
      const h = size / 2, k = size * .26;
      const n = node(parent, cx - h, cy - h, size, size, '',
        `<svg width="${size}" height="${size}" style="overflow:visible"><path class="ln" d="M0 ${k}V0H${k}M${size - k} 0H${size}V${k}M${size} ${size - k}V${size}H${size - k}M${k} ${size}H0V${size - k}"/></svg>`);
      K.enter(n.o, t, 'pop');
      K.move(n.m, tIn, 'scale(1.7)', 'none', {hold: true});
      return n;
    },
    /* a signpost: a board pointing left (with words) and one pointing right (with an icon) */
    signpost(parent, cx, top, t, {leftText = '', rightIcon = 'circle-help'} = {}) {
      const post = div(`left:${cx - 18}px;top:${top}px;width:36px;height:560px`, parent, `<svg width="36" height="560"><rect class="sd" x="0" y="0" width="36" height="560" rx="8"/></svg>`);
      K.enter(post, t, 'rise');
      const board = (y, side, html) => {
        const W = 380, H = 120, x = side < 0 ? cx - W + 30 : cx - 30;
        const d = side < 0 ? `M40 0H${W}V${H}H40L0 ${H / 2}Z` : `M0 0H${W - 40}L${W} ${H / 2}L${W - 40} ${H}H0Z`;
        const n = node(parent, x, y, W, H, '', `<svg width="${W}" height="${H}" style="overflow:visible"><path class="fl" d="${d}"/></svg>`);
        div(`left:${side < 0 ? 60 : 20}px;top:0;width:${W - 80}px;height:${H}px;display:flex;align-items:center;justify-content:center`, n.p, html);
        return n;
      };
      const L = board(top + 60, -1, `<span class="u-label" style="font-size:48px">${leftText}</span>`);
      const R = board(top + 230, 1, `<div style="color:var(--ink)">${ICO(rightIcon, 64)}</div>`);
      K.enter(L.o, t + .25, 'pop'); K.enter(R.o, t + .4, 'pop');
      return {L, R};
    },

    /* ---------- words of the scene (the style places and animates them) ---------- */
    say(lead, key, o = {}) { return ST.text(F, T, lead, key, o); },
  };
  return K;
}
