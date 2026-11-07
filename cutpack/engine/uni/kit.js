/* =====================================================================
   CutPack · uni · KIT — the only words a base scene may use.
   Nothing here picks a colour, a font, a size of line or a speed: every element gets a role class
   (u-panel, u-badge, ln/sd/fl/ac …) that the style's CSS paints, and every move asks the style's motion set.
   Scenes draw on a 1000 × 700 canvas; the style decides where that canvas sits and how big it is.
   ===================================================================== */
const ICO = (name, size, cls = 'u-ico') =>
  `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
/* a drawn thing has 3 nested layers so its moves never fight: o = enter/leave, m = state moves, p = punch/shake */
function node(parent, x, y, w, h, cls = '', html = '') {
  const o = div(`left:${x}px;top:${y}px;width:${w}px;height:${h}px`, parent);
  const m = div('inset:0', o), p = div('inset:0', m, html);
  if (cls) p.className = cls;
  return {o, m, p, x, y, w, h};
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

    /* ---------- surfaces ---------- */
    panel(x, y, w, h, t, {parent = F.stage, kind = 'rise'} = {}) {
      const n = node(parent, x, y, w, h, 'u-panel'); K.enter(n.o, t, kind); return n;
    },
    skel(parent, x, y, widths, t, {h = 18, gap = 26} = {}) {
      return widths.map((w, i) => {
        const l = div(`left:${x}px;top:${y + i * (h + gap)}px;width:${w}px;height:${h}px;border-radius:${h / 2}px;transform-origin:0 50%`, parent);
        l.className = 'u-skel'; K.grow(l, t + i * M.stagger); return l;
      });
    },
    label(parent, txt, x, y, {size = 40, cls = 'u-label', anchor = 'left'} = {}) {
      const l = div(`left:${x}px;top:${y}px;white-space:nowrap;font-size:${size}px;line-height:1.25;${anchor === 'center' ? 'transform:translateX(-50%)' : ''}`, parent);
      l.className = cls; l.textContent = txt; return l;
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
      c.className = `u-chip u-${tone}`;
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
    slider(parent, x, y, w, t, v0 = 0, {knobIcon = 'percent', k = 76} = {}) {
      const h = 18, n = node(parent, x, y - h / 2, w, h, 'u-bar'); n.p.style.borderRadius = h / 2 + 'px';
      const fill = div(`left:0;top:0;width:${w}px;height:${h}px;border-radius:${h / 2}px;transform-origin:0 50%;transform:scaleX(${v0})`, n.p); fill.className = 'u-bar-on';
      const knob = node(parent, x - k / 2, y - k / 2, k, k, 'u-knob', ICO(knobIcon, Math.round(k * .46), 'u-ico u-knob-ico'));
      knob.p.style.borderRadius = '50%'; knob.m.style.transform = `translateX(${v0 * w}px)`;
      K.enter(n.o, t, 'rise'); K.enter(knob.o, t + M.stagger, 'pop');
      let v = v0;
      return {n, knob, set(t, nv) {
        K.move(knob.m, t, `translateX(${v * w}px)`, `translateX(${nv * w}px)`);
        A(fill, [{transform: `scaleX(${v})`}, {transform: `scaleX(${nv})`}], t, M.move.d, {e: M.move.e, f: 'forwards'});
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
    /* a balance: pivot at (cx, top), beam half-length L. Items go in panL.p / panR.p (their centre is (L*? , 0) of the pan box) */
    scale(parent, cx, top, t, {L = 300, stand = 400, pan = 230} = {}) {
      const g = div(`left:0;top:0;width:1000px;height:700px`, parent);
      const st = div('left:0;top:0;width:1000px;height:700px', g,
        `<svg width="1000" height="700" style="overflow:visible"><path class="ln" d="M${cx} ${top}V${top + stand}"/><path class="ln u-thick" d="M${cx - 120} ${top + stand}H${cx + 120}"/></svg>`);
      st.querySelectorAll('path').forEach((p, i) => K.draw(p, t + i * .1));
      const beam = node(g, cx - L, top - 20, 2 * L, 40, '', `<svg width="${2 * L}" height="40" style="overflow:visible"><path class="ln" d="M0 20H${2 * L}"/></svg>`);
      K.draw(beam.p.querySelector('path'), t + .15);
      const pivot = div(`left:${cx - 20}px;top:${top - 20}px;width:40px;height:40px`, g, '<svg width="40" height="40"><circle class="ac u-dotc" cx="20" cy="20" r="15"/></svg>');
      K.enter(pivot, t + .3, 'pop');
      const hang = 178, panH = 42;
      const mk = side => {
        const ex = cx + side * L;
        const n = node(g, ex - pan / 2, top, pan, hang + panH, '',
          `<svg width="${pan}" height="${hang + panH}" style="overflow:visible"><path class="ln u-thin" d="M${pan / 2} 0V${hang}"/>` +
          `<path class="sd" d="M4 ${hang}H${pan - 4}Q${pan * .78} ${hang + panH} ${pan / 2} ${hang + panH}Q${pan * .22} ${hang + panH} 4 ${hang}Z"/></svg>`);
        K.enter(n.o, t + .35, 'rise');
        n.item = {cx: pan / 2, cy: hang - 70};      // where an item badge sits (inside n.p)
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
    /* a 2×2 jigsaw with the bottom-right piece missing; place(t) flies the loose piece in */
    puzzle(parent, x, y, s, t, {icon = 'package'} = {}) {
      const E = {tl: [0, 1, -1, 0], tr: [0, 0, 1, -1], bl: [1, -1, 0, 0], br: [-1, 0, 0, 1]};
      const pad = s * .3, W = 2 * s + 2 * pad;
      const board = div(`left:${x - pad}px;top:${y - pad}px;width:${W}px;height:${W}px`, parent,
        `<svg width="${W}" height="${W}" style="overflow:visible">` +
        `<path class="u-slot" d="${jigsawPath(s, E.br, pad + s, pad + s)}"/>` +
        ['tl', 'tr', 'bl'].map((k, i) => `<path class="fl" d="${jigsawPath(s, E[k], pad + (i % 2) * s, pad + Math.floor(i / 2) * s)}"/>`).join('') + '</svg>');
      const paths = board.querySelectorAll('path');
      K.enter(board, t, 'rise');
      const loose = node(parent, x + s - pad, y + s - pad, s + 2 * pad, s + 2 * pad, '',
        `<svg width="${s + 2 * pad}" height="${s + 2 * pad}" style="overflow:visible"><path class="ac" d="${jigsawPath(s, E.br, pad, pad)}"/></svg>`);
      const ic = div(`left:${pad + s / 2 - s * .22}px;top:${pad + s / 2 - s * .22}px;width:${s * .44}px;height:${s * .44}px`, loose.p, ICO(icon, Math.round(s * .44), 'u-ico u-on-acc'));
      return {board, slot: paths[0], loose, enterLoose(t) { K.enter(loose.o, t, 'pop'); },
        place(t, from = 'translate(250px,90px) rotate(-16deg)') { K.move(loose.m, t, from, 'none', {hold: true, kind: 'snap'}); }};
    },

    /* ---------- words of the scene (the style places and animates them) ---------- */
    say(lead, key, o = {}) { return ST.text(F, T, lead, key, o); },
  };
  return K;
}
