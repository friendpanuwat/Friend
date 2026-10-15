/* ============================================================
   UI ตัวที่ 3 — รูปแบบหน้าจอของตัวเอง (สี ฟอนต์ และส่วนกรอกตัวเลขร้านใช้ชุดเดียวกับตัวที่ 1)
   ทางเดียว 4 ขั้น (แถบขั้นตอนชุดเดียว): เลือกเรื่อง → ตัวเลขร้าน (ครั้งเดียว ข้ามได้ถ้ามีแล้ว) → ตัวเลขเรื่องนี้ (เห็น ไม่ทำ | ทำ สด) → ผล
   หน้าผล: สองเส้นทาง ไม่ทำ | ทำ · แถบลากหาจุดคุ้ม · สิ่งที่ต้องเป็นจริง · ดูละเอียด (เงินในมือ / กำไรเปลี่ยนเพราะอะไร) · ขั้นต่อไป (PL1 / PL2)
   ปุ่มค้างด้านล่าง: ปรับตัวเลข (ที่เดียวสำหรับแก้ทุกตัวเลข) | เช็กความพร้อม → จุดที่ควรเช็ก
   ============================================================ */
(function () {
  'use strict';

  var P = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var ICON = {
    back: P('<path d="m15 18-6-6 6-6"/>'),
    next: P('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
    chev: P('<path d="m9 18 6-6-6-6"/>'),
    down: P('<path d="m6 9 6 6 6-6"/>'),
    out: P('<path d="M7 17 17 7"/><path d="M8 7h9v9"/>'),
    moon: P('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
    sun: P('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-2.93 1.41-1.41M17.66 6.34l1.41-1.41M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41"/>'),
    sliders: P('<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>'),
    info: P('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
    alert: P('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'),
    ok: P('<path d="M20 6 9 17l-5-5"/>'),
    no: P('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
    dot: P('<circle cx="12" cy="12" r="3"/>'),
    q: P('<path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>'),
    mark: P('<path d="M12 6v8"/><path d="M12 18h.01"/>'),
    undo: P('<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'),
    store: P('<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>'),
    phone: P('<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>'),
    both: P('<path d="M3 9h11v11H3z"/><path d="M14 13h7v7h-7"/><path d="M6 9V5h11v8"/>')
  };
  var TICON = {
    hire: P('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>'),
    place: P('<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>'),
    channel: P('<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>'),
    equip: P('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
    branch: P('<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>'),
    price: P('<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="1"/>'),
    promo: P('<line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>'),
    newprod: P('<path d="M16 16h6"/><path d="M19 13v6"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><path d="M3.29 7 12 12l8.71-5"/><path d="M12 22V12"/>'),
    freeship: P('<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>'),
    ads: P('<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'),
    supplier: P('<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>'),
    freelance: P('<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>')
  };
  var MICON = {
    unit: P('<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>'),
    service: P('<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>'),
    resell: P('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>'),
    subscription: P('<path d="m2 9 3-3 3 3"/><path d="M13 18H7a2 2 0 0 1-2-2V6"/><path d="m22 15-3 3-3-3"/><path d="M11 6h6a2 2 0 0 1 2 2v10"/>'),
    project: P('<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>'),
    rental: P('<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>'),
    commission: P('<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>'),
    other: P('<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>')
  };

  var state = {
    view: 'start', topic: null, model: null, inp: {}, isSample: false, sampleKind: null, where: null, step: 0, editing: false, dstep: 0, dediting: false,
    ds: {}, wi: {}, dsign: {}, labOrig: null, active: null, answers: {}, qidx: 0, feeHelp: false, fh: { share: '', rate: '' },
    /* shopInFlow = ตัวเลขร้านถูกกรอกระหว่างทางของเรื่องนี้ (ย้อนจากคำถามข้อแรกจึงกลับไปตัวเลขร้าน) · editFrom = หน้าที่เปิดแก้ตัวเลขร้าน (lab | review) · rtab = แท็บดูละเอียดบนหน้าผล */
    shopInFlow: false, editFrom: null, rtab: 'cash'
  };
  var app;

  /* ---------- memo ---------- */
  var memo = new Map();
  function C(inp, m) {
    var key = m + '|' + JSON.stringify(inp);
    if (memo.has(key)) return memo.get(key);
    var S = compute(inp, m);
    if (memo.size > 300) memo.clear();
    memo.set(key, S);
    return S;
  }
  var emo = new Map();
  function E(d) {
    var key = state.topic + '|' + state.model + '|' + JSON.stringify(state.inp) + '|' + JSON.stringify(d);
    if (emo.has(key)) return emo.get(key);
    var R = dEval(state.inp, state.model, state.topic, d);
    if (R.ok) { R.conds = dConds(R, state.inp, state.model, state.topic, d); R.P = dPivot(state.inp, state.model, state.topic, d); }
    if (emo.size > 300) emo.clear();
    emo.set(key, R);
    return R;
  }
  function dec() { if (!state.ds[state.topic]) state.ds[state.topic] = Object.assign({}, DEC_DEFAULT[state.topic]); return state.ds[state.topic]; }
  function piv() { return dPivot(state.inp, state.model, state.topic, dec()); }
  /* ตัวเลขที่กำลังดู: ค่าบนแถบลาก (ถ้าลากอยู่) หรือค่าที่ใส่ไว้ */
  function wiVal() { var w = state.wi[state.topic]; return w === undefined || w === null ? null : w; }
  function viewD() { var w = wiVal(); return w === null ? dec() : piv().set(dec(), w); }

  /* ---------- persistence & theme ---------- */
  function snapshot() {
    return { view: state.view, topic: state.topic, model: state.model, inp: state.inp, isSample: state.isSample, sampleKind: state.sampleKind, where: state.where, step: state.step, editing: state.editing,
      dstep: state.dstep, dediting: state.dediting, ds: state.ds, wi: state.wi, dsign: state.dsign, active: state.active, answers: state.answers, qidx: state.qidx,
      shopInFlow: state.shopInFlow, editFrom: state.editFrom, rtab: state.rtab };
  }
  function save() {
    try { sessionStorage.setItem('lab3', JSON.stringify(snapshot())); } catch (e) { /* ignore */ }
    /* ข้อมูลร้านชุดกลาง: ตัวเลขร้านของผู้ใช้เอง (ไม่ใช่ร้านตัวอย่าง) ใช้ต่อได้ในเครื่องมืออื่นของ Business Lab */
    if (typeof LabShop !== 'undefined') {
      if (state.model && !state.isSample) LabShop.put(state.model, state.inp, MODELS[state.model].tile, shopOk());
      LabShop.setWhere(state.where);
    }
  }
  /* เปิดเครื่องมือ: ถ้ามีตัวเลขร้านชุดกลางที่ต่างจากของเดิม (กรอกหรือแก้ในเครื่องมืออื่น) ใช้ชุดกลาง */
  function adoptShared() {
    if (typeof LabShop === 'undefined') return;
    var sh = LabShop.get();
    if (sh && MODELS[sh.model] && (state.isSample || state.model !== sh.model || !LabShop.same(state.inp, sh.inp))) {
      if (state.isSample || state.model !== sh.model) {
        chooseModel(sh.model, false);
        if (['start', 'review'].indexOf(state.view) < 0) state.view = 'start';
        state.topic = null;
      }
      state.inp = JSON.parse(JSON.stringify(sh.inp));
      if (state.view === 'wizard' || state.view === 'shop') state.view = 'start';
    }
    if (!state.where) state.where = LabShop.where();
  }
  function restore(d) {
    if (!d || typeof d !== 'object') return;
    if (d.model && !MODELS[d.model]) return;
    if (d.topic && !TOPICS[d.topic]) return;
    Object.assign(state, d);
    state.wi = state.wi || {}; state.dsign = state.dsign || {};
  }
  function themeNow() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  try { var th = localStorage.getItem('lab-theme'); if (th === 'dark' || th === 'light') document.documentElement.setAttribute('data-theme', th); } catch (e) { /* ignore */ }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function fieldDef(k) { var m = state.model; for (var i = 0; i < FIELDS.length; i++) { var f = FIELDS[i]; if (f.k === k && (!f.models || f.models.indexOf(m) >= 0)) return f; } return null; }
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var shown = {};
  function anim(key, v, dec0) { return '<span data-anim="' + key + '" data-v="' + v + '" data-dec="' + (dec0 || 0) + '">' + fmtN(Math.abs(v), dec0) + '</span>'; }
  function runAnim(root) {
    $$('[data-anim]', root).forEach(function (el) {
      var key = el.getAttribute('data-anim'), to = +el.getAttribute('data-v'), dc = +el.getAttribute('data-dec');
      var from = shown[key]; shown[key] = to;
      if (from === undefined) from = 0;
      if (Math.abs(from - to) < 0.5 || reduced) { el.textContent = fmtN(Math.abs(to), dc); return; }
      var t0 = performance.now(), dur = 520;
      (function tick(t) {
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmtN(Math.abs(from + (to - from) * e), dc);
        if (p < 1 && el.isConnected) requestAnimationFrame(tick);
      })(t0);
    });
    $$('.flow3 i[data-f]', root).forEach(function (el) {
      if (!reduced) getComputedStyle(el, '::after').transform;
      el.style.setProperty('--f', el.getAttribute('data-f'));
    });
    /* เส้นกราฟค่อย ๆ วาด (ไม่วาดใหม่ระหว่างลากแถบ) */
    if (!reduced && !$('main.live')) $$('path.draw', root).forEach(function (p) {
      var L = p.getTotalLength ? p.getTotalLength() : 0;
      if (!L) return;
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
      p.getBoundingClientRect();
      p.style.transition = 'stroke-dashoffset 900ms cubic-bezier(.3,.7,.2,1)';
      p.style.strokeDashoffset = 0;
    });
  }
  function signed(v) { return (v < -0.5 ? '−' : v > 0.5 ? '+' : '') + fmtN(Math.abs(v)); }
  function plain(v) { return (v < -0.5 ? '−' : '') + fmtN(Math.abs(v)); }
  function dirSpan(v, txt) {
    var sr = /^(มากกว่า|น้อยกว่า)/.test(txt) || Math.abs(v) <= 0.5 ? '' : '<span class="sr">' + (v > 0 ? 'เพิ่ม ' : 'ลด ') + '</span>';
    return '<span class="' + (v > 0.5 ? 'up' : v < -0.5 ? 'down' : '') + '">' + sr + txt + '</span>';
  }
  function bar(left, title, sub, right) {
    return '<header class="bar"><div class="wrap">' + (left || '<span class="spacer44"></span>') +
      '<div class="ttl">' + (sub ? '<small>' + esc(sub) + '</small>' : '') + esc(title) + '</div>' +
      (right || '') + '<button class="ib" data-act="theme" aria-label="สลับโหมดมืดและสว่าง">' + (themeNow() === 'dark' ? ICON.sun : ICON.moon) + '</button></div></header>';
  }
  /* ปุ่มกลับหน้ารวม Business Lab (มีเฉพาะตอนเปิดผ่านหน้ารวม) */
  function hubLink() { return window.LAB_HUB ? '<a class="ib" href="' + esc(window.LAB_HUB) + '" aria-label="กลับไปหน้า Business Lab">' + ICON.back + '</a>' : null; }
  function backBtn(act, label) { return '<button class="ib" data-act="' + act + '" aria-label="' + (label || 'ย้อนกลับ') + '">' + ICON.back + '</button>'; }
  function nf(v, u) { return fmtN(v, decOf(v)) + (u ? (u.charAt(0) === '%' ? '' : '\u00a0') + u : ''); }
  /* เสียงอ่านหน้าจอ: บอกผลครั้งเดียวหลังหยุดลาก/หยุดพิมพ์ ไม่อ่านทุกขยับ */
  var srT = 0;
  function announce(txt) {
    clearTimeout(srT);
    srT = setTimeout(function () {
      var el = document.getElementById('sr-live');
      if (!el) { el = document.createElement('div'); el.id = 'sr-live'; el.className = 'sr'; el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
      el.textContent = txt;
    }, 700);
  }
  function deltaWords(dl) { return Math.abs(dl) < 0.5 ? 'กำไรเท่าเดิม' : 'กำไร' + (dl > 0 ? 'เพิ่มขึ้น ' : 'ลดลง ') + fmtN(Math.abs(dl)) + ' บาทต่อเดือน'; }
  /* คำที่ไม่ควรถูกตัดกลางคำเวลาขึ้นบรรทัดใหม่ */
  var NW = ['ตัดสินใจ', 'ยอดขาย', 'ตอนนี้', 'เงินก้อน', 'ไหวไหม', 'คืนทุน', 'ต่อเดือน', 'ขาดมือ', 'เท่าเดิม', 'อย่างน้อย', 'ร้านเดิม', 'คนใหม่', 'ถึงจะคุ้ม', 'ที่ใหม่', 'ขั้นต่ำ', 'คอนเทนต์', 'เพิ่มขึ้น', 'ออร์เดอร์'];
  function tw(str) {
    var h = esc(str);
    NW.forEach(function (w) { h = h.split(w).join('<span class="nw">' + w + '</span>'); });
    return h.replace(/([ก-ฮ]\.[ก-ฮ]\.(?:[ก-ฮ]\.)?) (\d{2})/g, '$1&nbsp;$2');
  }
  function ml(t, y) { return monthLabel(t, y).replace(' ', '\u00a0'); }

  /* ============================================================ START — "กำลังคิดจะ…" */
  /* ร้านตัวอย่างใช้ทีละร้าน ตามที่ผู้ใช้ขาย: ออนไลน์ = ร้านเสื้อผ้าออนไลน์ · หน้าร้านหรือทั้งสองแบบ = ร้านกาแฟ (ร้านตัวอย่างทั้งสองร้านเปิดได้ทุกเรื่องที่โชว์) */
  function sampleKindFor(t) {
    var k = state.where === 'online' ? 'online' : 'cafe';
    if (t && !topicOk(t, SAMPLES[k].m)) k = k === 'cafe' ? 'online' : 'cafe';
    return k;
  }
  function sampleInpOf(k) {
    var m = SAMPLES[k].m, inp = JSON.parse(JSON.stringify(MODELS[m].sample));
    if (!inp.volumePer && MODELS[m].defPer) inp.volumePer = MODELS[m].defPer;
    return inp;
  }
  function sampleDec(k, t) { return (k === 'online' ? SAMPLE_DEC_ON : SAMPLE_DEC)[t]; }
  function sampleName() { return SAMPLES[state.sampleKind || 'cafe'].name; }
  var teaserCache = {};
  function teaserFor(t) {
    var k = state.sampleKind || sampleKindFor(t), ck = k + '|' + t;
    if (!topicOk(t, SAMPLES[k].m)) return null;
    if (teaserCache[ck] !== undefined) return teaserCache[ck];
    var m = SAMPLES[k].m, inp = sampleInpOf(k), d = sampleDec(k, t), R = dEval(inp, m, t, d), out = null;
    if (R.ok) {
      var Cn = dConds(R, inp, m, t, d), row = function (id) { return Cn.filter(function (c) { return c.id === id; })[0]; };
      var need = row('need'), pay = row('pay'), lab = '', v = null, u = '';
      if ((t === 'place' || t === 'equip') && pay && pay.value !== null) { lab = 'คืนทุนใน'; v = Math.ceil(pay.value - 1e-9); u = 'เดือน'; }
      else if (t === 'branch' && R.need > 0.5) { lab = 'ต้องหาเงินเพิ่ม'; v = Math.round(R.need / 1000) * 1000; u = 'บาท'; }
      else if (t === 'channel') { var cu = channelUnit(inp, m, d); if (cu) { lab = 'เหลือเงิน' + U(inp, m) + 'ละ'; v = cu.ch; u = 'บาท (ขายเอง ' + fmtN(cu.own, 1) + ')'; } }
      else if (t === 'supplier' && need && need.value !== null && dPivot(inp, m, t, d).now > 0) {
        var Ps = dPivot(inp, m, t, d), dr = (1 - need.value / Ps.now) * 100;
        lab = dr >= 0 ? salesWord(m) + 'ลดได้ไม่เกิน' : salesWord(m) + 'ต้องเพิ่มอย่างน้อย'; v = Math.floor(Math.abs(dr) * 10) / 10; u = '%';
      }
      else if (need && need.value !== null) { lab = need.label; v = need.value; u = need.unit; }
      else if (pay && pay.value !== null) { lab = 'คืนทุนใน'; v = Math.ceil(pay.value - 1e-9); u = 'เดือน'; }
      if (v !== null) out = [dSummary(t, d, inp, m) + ' · ' + lab, v, u];
    }
    teaserCache[ck] = out;
    return out;
  }
  var TOPIC_EX = {
    hire: 'ดูว่าต้องขายเพิ่มเท่าไร ถึงจะคุ้มค่าจ้างคนใหม่', place: 'ดูว่าที่ใหม่ต้องขายได้เท่าไร และเงินค่าย้ายคืนทุนเมื่อไร',
    channel: 'ดูว่าหลังหักส่วนแบ่ง ยังเหลือเงินเท่าไร และต้องขายได้เท่าไร', equip: 'ดูว่าเครื่องคืนทุนกี่เดือน ทันก่อนหมดอายุไหม',
    branch: 'ดูว่าสาขาต้องขายได้เท่าไร และเงินพอช่วงตั้งตัวไหม',
    price: 'ดูว่าลูกค้าลดลงได้มากสุดเท่าไร ราคาใหม่ถึงยังคุ้ม', promo: 'ดูว่าช่วงโปรยอดต้องเพิ่มเท่าไร และทั้งปีได้หรือเสีย',
    newprod: 'ดูว่าของใหม่ต้องขายได้เท่าไร ถึงจะคุ้มเงินที่ลง', freeship: 'ดูว่ายอดต้องเพิ่มเท่าไร ถึงจะคุ้มค่าส่งที่ร้านจ่าย',
    ads: 'ดูว่าต้องขายเพิ่มเท่าไร ถึงจะคุ้มค่าโฆษณา', freelance: 'ดูว่าต้องขายเพิ่มเท่าไร ถึงจะคุ้มค่าจ้าง',
    supplier: 'ดูว่าหลังเปลี่ยน ยอดขายลดได้แค่ไหนถึงยังคุ้ม'
  };
  function topicCard(t, i) {
    var ok = !state.model || topicOk(t, state.model), tz1 = ok && state.isSample ? teaserFor(t) : null;
    var u = tz1 ? String(tz1[2]) : '', pc = u.charAt(0) === '%';
    return '<button class="qc rise" style="--d:' + i + '" data-act="topic" data-t="' + t + '"' + (ok ? '' : ' aria-disabled="true"') + '><span class="qc-ic">' + TICON[t] + '</span>' +
      '<span class="qc-b"><b>' + esc(TOPICS[t].q) + '</b>' +
      (ok ? (tz1 ? '<small>' + tw(tz1[0]) + ' <em>' + anim('tz' + t, tz1[1], decOf(tz1[1])) + (pc ? '%' : '') + '</em> ' + esc(pc ? u.slice(1).trim() : u) + '</small>' : '<small>' + esc(TOPIC_EX[t]) + '</small>')
        : '<small>ยังไม่มีสำหรับร้านแบบ' + esc(MODELS[state.model].tile) + '</small>') + '</span>' + ICON.chev + '</button>';
  }
  function topicRows() {
    var i = 0;
    return TOPIC_CATS.map(function (c) {
      var ts = c.topics.filter(function (t) { return whereOk(t, state.where); });
      if (!ts.length) return '';
      return '<section class="cat3"><h3 class="cat-h">' + esc(c.name) + '</h3><div class="qcards">' + ts.map(function (t) { return topicCard(t, i++); }).join('') + '</div></section>';
    }).join('');
  }
  /* ขายที่ไหน: ยังไม่เลือก = การ์ดใหญ่ 3 ใบ (ต้องตอบก่อนเห็นเรื่อง) · เลือกแล้ว = แถบเลือกเล็ก เปลี่ยนได้ */
  var WICON = { shop: ICON.store, online: ICON.phone, both: ICON.both };
  var WSUB = { shop: 'มีร้านหรือแผงให้ลูกค้ามา', online: 'ขายในโซเชียล แอป หรือเว็บ', both: 'มีหน้าร้าน และขายออนไลน์ด้วย' };
  function whereHtml() {
    if (!state.where) return '<section class="where3 big"><h2 class="wh-q" id="wh-l">ร้านคุณขายที่ไหน</h2><p class="wh-n">ตอบข้อนี้ก่อน แล้วจะเหลือเฉพาะเรื่องที่เข้ากับร้านคุณ</p><div class="wh-cards" role="group" aria-labelledby="wh-l">' + WHERE.map(function (w, i) {
      return '<button type="button" class="wh-c rise" style="--d:' + i + '" data-act="where" data-v="' + w[0] + '" aria-pressed="false"><span class="wh-i">' + WICON[w[0]] + '</span><span class="wh-b"><b>' + w[1] + '</b><small>' + WSUB[w[0]] + '</small></span>' + ICON.chev + '</button>';
    }).join('') + '</div></section>';
    return '<div class="where3"><span class="wh-l" id="wh-l">ร้านคุณขายที่ไหน</span><div class="seg" role="group" aria-labelledby="wh-l">' + WHERE.map(function (w) {
      return '<button type="button" data-act="where" data-v="' + w[0] + '" aria-pressed="' + (state.where === w[0]) + '">' + w[1] + '</button>';
    }).join('') + '</div></div>';
  }
  /* แถบ 3 ขั้นบนหน้าเริ่ม: ให้รู้ก่อนว่าจะต้องทำอะไรบ้าง */
  function howHtml() {
    var has = !!state.model && !state.isSample && shopOk();
    var S = [['เลือกเรื่อง', 'ที่กำลังคิดอยู่'], ['ใส่ตัวเลขร้าน', has ? 'มีแล้ว ใช้ของเดิม' : 'ครั้งเดียว ~3 นาที'], ['ดูผล', 'ทำ เทียบกับ ไม่ทำ']];
    return '<ol class="how3" aria-label="วิธีใช้">' + S.map(function (s, i) {
      return '<li class="' + (i === 1 && has ? 'done' : '') + '"><i aria-hidden="true">' + (i === 1 && has ? ICON.ok : i + 1) + '</i><span><b>' + s[0] + '</b><small>' + s[1] + '</small></span></li>';
    }).join('') + '</ol>';
  }
  function shopLine() {
    if (state.model) {
      var S = C(state.inp, state.model), ok = shopOk() && S.ok;
      return '<div class="shopline' + (state.isSample ? ' smp' : '') + '"><span class="sl-t"><small>' + (state.isSample ? 'กำลังใช้ร้านตัวอย่าง' : 'ตัวเลขร้านคุณ') + '</small><b>' + (state.isSample ? esc(sampleName()) : esc(MODELS[state.model].tile)) + '</b>' +
        (ok ? '<span>' + (S.profit < 0 ? 'ขาดทุน ' : 'กำไร ') + fmtN(Math.abs(S.profit)) + ' บาท/เดือน</span>' : '<span>ยังกรอกไม่ครบ</span>') + '</span>' +
        '<button class="btn ghost sm" data-act="shop-edit">' + (state.isSample ? 'ใส่ร้านคุณ' : 'แก้') + '</button></div>' +
        (state.isSample ? '<p class="sl-n">แตะเรื่องไหนก็ได้ จะเห็นผลกับร้านตัวอย่างทันที</p>' : '');
    }
    return '<div class="samp3"><span>ยังไม่พร้อมกรอก?</span><button class="lnk" data-act="sample">ลองกับ' + esc(SAMPLES[sampleKindFor(null)].short) + 'ตัวอย่างก่อน</button></div>';
  }
  function viewStart() {
    var out = bar(hubLink(), 'เช็กก่อนตัดสินใจเรื่องใหญ่', 'Business Lab') + '<main class="screen"><div class="wrap">' +
      '<section class="st3"><h1>กำลังคิดจะ…</h1><p>เทียบ “ทำ” กับ “ไม่ทำ” ด้วยตัวเลขร้านคุณ ดูว่าต้องขายเท่าไรถึงจะคุ้ม เงินพอไหม และคืนทุนเมื่อไร ก่อนเสียเงินจริง</p></section>';
    if (!state.model || state.isSample) out += howHtml();
    out += whereHtml();
    if (state.where) out += shopLine() + '<h2 class="sec3 pick-h">เลือกเรื่องที่คิดอยู่</h2>' + topicRows();
    out += '<p class="fine">ไม่ต้องสมัคร ตัวเลขอยู่ในเครื่องคุณเท่านั้น และหายไปเมื่อปิดหน้านี้ · คำนวณด้วยสูตรชุดเดียวกับแผนธุรกิจของ Jarua</p>';
    return out + '</div></main>';
  }

  /* ============================================================ แถบขั้นตอน (ชุดเดียวตลอดทาง) */
  var FLOW = ['เลือกเรื่อง', 'ตัวเลขร้าน', 'ตัวเลขเรื่องนี้', 'ผล'];
  var flowPrev = [1, 0, 0, 0];
  /* แถบเติมจากค่าของหน้าก่อน ไปถึงค่าของหน้านี้ (runAnim เป็นคนเลื่อน) */
  function flowBar(stage, frac) {
    var tgt = FLOW.map(function (l, i) { return i < stage ? 1 : i === stage ? Math.max(0.06, Math.min(1, frac || 0)) : 0; });
    var out = '<nav class="flow3" aria-label="ขั้นตอน ขั้นที่ ' + (stage + 1) + ' จาก 4 ' + FLOW[stage] + '"><ol>' + FLOW.map(function (l, i) {
      return '<li class="' + (i < stage ? 'done' : i === stage ? 'now' : '') + '"' + (i === stage ? ' aria-current="step"' : '') + '><i aria-hidden="true" style="--f:' + (reduced ? tgt[i] : flowPrev[i]).toFixed(3) + '" data-f="' + tgt[i].toFixed(3) + '"></i><span>' + l + '</span></li>';
    }).join('') + '</ol></nav>';
    flowPrev = tgt;
    return out;
  }

  /* ============================================================ SHOP (เลือกรูปแบบรายได้) */
  function viewShop() {
    var t = state.topic;
    var tiles = MODEL_ORDER.map(function (k) {
      var ok = !t || topicOk(t, k);
      return '<button class="tile" data-act="model" data-m="' + k + '"' + (ok ? '' : ' disabled aria-disabled="true"') + '><span class="ic">' + MICON[k] + '</span><span class="t">' + MODELS[k].tile + '</span><span class="ex">' + (ok ? MODELS[k].short : 'ยังไม่มีเรื่องนี้') + '</span></button>';
    }).join('');
    return bar(backBtn('to-start', 'กลับไปเลือกเรื่อง'), t ? TOPICS[t].title : 'ตัวเลขร้าน', t ? 'ตัวเลขร้าน' : '') + '<main class="screen"><div class="wrap">' + (t ? flowBar(1, 0) : '') +
      '<div class="q-head"><h1>ร้านคุณได้เงินจากอะไรเป็นหลัก</h1><p>' + (t ? 'ก่อนดูเรื่อง' + esc(TOPICS[t].title) + ' ขอตัวเลขร้านคุณตอนนี้ไว้เทียบ · ' : '') + 'กรอกครั้งเดียว ใช้ได้กับทุกเรื่อง ประมาณ 3 นาที</p></div>' +
      '<div class="tiles">' + tiles + '</div>' +
      '<div class="alt"><span>ยังไม่อยากกรอก?</span><button class="lnk" data-act="sample">ลองกับ' + esc(SAMPLES[sampleKindFor(t)].short) + 'ตัวอย่างก่อน</button></div></div></main>';
  }

  /* ============================================================ WIZARD (ตัวเลขร้าน — ขั้นเดียวกับตัวที่ 1) */
  function stepsFor(m) {
    var inp = state.inp, u = U(inp, m), S = [];
    if (isVolModel(m)) {
      S.push({ id: 'what', q: m === 'service' ? 'คุณขายบริการอะไร คิดราคาเท่าไหร่' : 'คุณขายอะไร ราคาเท่าไหร่', p: 'เลือกสิ่งที่ใช้นับยอดขาย แล้วใส่ราคาเฉลี่ย', f: ['unitLabel', 'price'] });
      S.push({ id: 'qty', q: m === 'service' ? 'มีลูกค้ากี่' + u : 'ขายได้กี่' + u, p: 'ตัวเลขประมาณก็ได้', f: ['volume', 'daysOpen'] });
      S.push({ id: 'var', q: 'ต้นทุนของ 1 ' + u, p: 'เฉพาะต้นทุนที่ขึ้นลงตามยอดขาย', f: ['unitCost', 'feePct'] });
    } else if (m === 'subscription') {
      S.push({ id: 'fee', q: 'ค่าสมาชิกเท่าไหร่', f: ['fee', 'cycle'] });
      S.push({ id: 'mem', q: 'สมาชิกตอนนี้มีกี่คน', p: 'และแต่ละเดือนมีคนสมัครใหม่และคนเลิกกี่คน', f: ['members', 'newMembers', 'leaving'] });
      S.push({ id: 'var', q: 'ต้นทุนต่อสมาชิก 1 คน', f: ['costPerMember', 'feePct'] });
    } else if (m === 'project') {
      S.push({ id: 'job', q: 'ได้งานปีละกี่งาน งานละเท่าไหร่', f: ['projectValue', 'projectsPerYear'] });
      S.push({ id: 'time', q: 'งานหนึ่งใช้เวลานานแค่ไหน', f: ['durationMonths', 'depositPct'] });
      S.push({ id: 'var', q: 'ต้นทุนตรงของงาน', f: ['directCostPct'] });
    } else if (m === 'rental') {
      S.push({ id: 'what', q: 'คุณให้เช่าอะไร มีกี่' + u, f: ['unitLabel', 'rentableUnits'] });
      S.push({ id: 'price', q: 'ราคาเท่าไหร่ มีคนเช่ากี่ %', f: ['periodKind', 'pricePerPeriod', 'occupancy'] });
      S.push({ id: 'var', q: 'ต้นทุนต่อ' + periodWord(inp) + 'ที่มีคนเช่า', f: ['costPerOccupied', 'feePct'] });
    } else if (m === 'commission') {
      S.push({ id: 'deal', q: 'ปิดดีลได้เดือนละกี่ดีล', f: ['dealsPerMonth', 'avgDealValue'] });
      S.push({ id: 'com', q: 'ได้ค่าคอมเท่าไหร่', f: ['commissionPct', 'splitPct'] });
    } else {
      S.push({ id: 'amt', q: 'ได้เงินเดือนละเท่าไหร่', f: ['amount', 'costPct'] });
    }
    S.push({ id: 'people', q: 'คนที่ทำงานในร้าน', p: 'รวมเงินเดือนของคุณเองด้วย', f: ['staffCount', 'staffSalary', 'ownerSalary'] });
    S.push({ id: 'fixed', q: 'ค่าใช้จ่ายที่จ่ายทุกเดือน', p: 'จ่ายเท่าเดิม ไม่ว่าจะขายได้มากหรือน้อย', f: ['rent', 'marketing', 'otherFixed'] });
    S.push({ id: 'cash', q: 'ตอนนี้มีเงินหมุนในร้านเท่าไหร่', p: 'เรื่องใหญ่มักใช้เงินก้อน ใส่ไว้จะเห็นว่าเงินพอไหม', f: ['cash'] });
    S.push({ id: 'adv', q: 'อยากให้ภาพ 12 เดือนตรงขึ้นไหม', p: 'ไม่ใส่ก็ได้ เลือกใส่เฉพาะเรื่องที่รู้', adv: true, f: [] });
    return S;
  }
  function stepValid(st) {
    var m = state.model, inp = state.inp;
    return st.f.every(function (k) {
      var f = fieldDef(k);
      if (!f || !f.req) return true;
      if (f.show && !f.show(inp, m)) return true;
      return num(inp[k]) !== null;
    });
  }
  function shopOk() { return !!state.model && stepsFor(state.model).every(stepValid) && C(state.inp, state.model).ok; }
  function placeholder(k) {
    var v = MODELS[state.model].sample[k];
    if (typeof v !== 'number') return '';
    return 'เช่น ' + (v >= 1000 ? Math.round(v).toLocaleString('th-TH') : v);
  }
  function fieldHtml(k) {
    var f = fieldDef(k);
    if (!f) return '';
    var m = state.model, inp = state.inp;
    var hidden = f.show && !f.show(inp, m) ? ' hidden' : '';
    var lab = esc(f.label(inp, m));
    var help = f.help ? '<p class="help">' + esc(f.help(inp, m)) + '</p>' : '';
    var id = 'f-' + k;
    if (f.t === 'unit') {
      var M = MODELS[m], cur = inp.unitLabel || M.defUnit;
      var chips = M.units.map(function (u) { return '<button type="button" class="chip" data-act="unit" data-v="' + esc(u) + '" aria-pressed="' + (cur === u) + '">' + esc(u) + '</button>'; }).join('');
      return '<div class="field" data-f="' + k + '"><span class="lab">' + lab + '</span><div class="chips">' + chips +
        '<input id="' + id + '" data-unit-custom placeholder="อื่นๆ พิมพ์เอง" value="' + esc(M.units.indexOf(cur) < 0 ? cur : '') + '" maxlength="12" aria-label="หน่วยอื่น"></div></div>';
    }
    if (f.t === 'cycle') {
      var c = num(inp.cycle) || 1;
      return '<div class="field"><span class="lab">' + lab + '</span><div class="seg">' + [1, 3, 6, 12].map(function (v) {
        return '<button type="button" data-act="cycle" data-v="' + v + '" aria-pressed="' + (c === v) + '">' + v + ' เดือน</button>'; }).join('') + '</div></div>';
    }
    if (f.t === 'period') {
      var pk = inp.periodKind || 'night';
      return '<div class="field"><span class="lab">' + lab + '</span><div class="seg">' +
        '<button type="button" data-act="period" data-v="night" aria-pressed="' + (pk === 'night') + '">ต่อคืนหรือวัน</button>' +
        '<button type="button" data-act="period" data-v="month" aria-pressed="' + (pk === 'month') + '">ต่อเดือน</button></div></div>';
    }
    if (f.t === 'season') return seasonHtml();
    var mode = (f.t === 'money' || f.t === 'int') ? 'numeric' : 'decimal';
    var v = inp[k];
    var val = v === null || v === undefined || v === '' ? '' : (f.t === 'money' ? Math.round(v).toLocaleString('th-TH') : String(v));
    var input = '<input id="' + id + '" data-k="' + k + '" data-t="' + f.t + '" inputmode="' + mode + '" autocomplete="off" enterkeyhint="next" placeholder="' + esc(placeholder(k)) + '" value="' + esc(val) + '"' + (f.neg ? ' data-neg="1"' : '') + '>';
    var suf = f.t === 'volume' ? esc(U(inp, m)) + '/' + perWord(inp) : esc(f.suf ? f.suf(inp, m) : (f.t === 'pct' ? '%' : 'บาท'));
    var per = '';
    if (f.t === 'volume') {
      var pv = inp.volumePer || MODELS[m].defPer || 'day';
      per = '<div class="seg" role="group" aria-label="นับต่อวันหรือต่อเดือน"><button type="button" data-act="per" data-v="day" aria-pressed="' + (pv === 'day') + '">ต่อวัน</button>' +
        '<button type="button" data-act="per" data-v="month" aria-pressed="' + (pv === 'month') + '">ต่อเดือน</button></div>';
    }
    var extra = '';
    if (k === 'feePct' && (isVolModel(m) || m === 'rental')) {
      extra = state.feeHelp
        ? '<div class="fee-help"><div class="two"><div class="field"><label for="fh-share">ขายผ่านแอปกี่ % ของยอด</label><div class="inbox"><input id="fh-share" data-fh="share" inputmode="decimal" value="' + esc(state.fh.share) + '"><span class="suf">%</span></div></div>' +
          '<div class="field"><label for="fh-rate">แอปหักไปกี่ %</label><div class="inbox"><input id="fh-rate" data-fh="rate" inputmode="decimal" value="' + esc(state.fh.rate) + '"><span class="suf">%</span></div></div></div><div class="fh-res" id="fh-res">' + feeHelpText() + '</div></div>'
        : '<button type="button" class="lnk" data-act="fee-help" style="justify-self:start">ขายผ่านแอปบางส่วน? ให้ช่วยคิด</button>';
    }
    return '<div class="field" data-f="' + k + '"' + hidden + '><label for="' + id + '">' + lab + '</label>' + per + '<div class="inbox">' + input + '<span class="suf">' + suf + '</span></div>' + help + extra + '</div>';
  }
  function feeHelpText() {
    var a = num(state.fh.share), b = num(state.fh.rate);
    if (a === null || b === null) return 'ใส่ทั้งสองช่อง แล้วจะเติมค่าเฉลี่ยให้';
    return 'ค่าธรรมเนียมเฉลี่ย = <b>' + fmtN(a * b / 100, 2) + '%</b> ของยอดขายทั้งหมด (เติมให้แล้ว)';
  }
  function seasonHtml() {
    var s = state.inp.season || { high: [], low: [], highPct: 30, lowPct: 30 };
    var ms = [];
    for (var c = 1; c <= 12; c++) {
      var k = s.high.indexOf(c) >= 0 ? 'high' : s.low.indexOf(c) >= 0 ? 'low' : 'normal';
      ms.push('<button type="button" class="month" data-act="month" data-c="' + c + '" data-s="' + k + '" aria-label="' + TH_MONTHS[c - 1] + ' ' + { high: 'ขายดี', low: 'ขายแย่', normal: 'ปกติ' }[k] + '">' + TH_MONTHS[c - 1] + '<small>' + { high: 'ดี', low: 'แย่', normal: '' }[k] + '</small></button>');
    }
    return '<div class="field"><p class="help">แตะเดือนเพื่อสลับ ปกติ → ขายดี → ขายแย่</p><div class="months">' + ms.join('') + '</div><div class="two">' +
      '<div class="field"><label for="f-hp" class="help">ขายดีกว่าปกติ</label><div class="inbox"><input id="f-hp" data-season="highPct" inputmode="decimal" value="' + esc(s.highPct) + '"><span class="suf">%</span></div></div>' +
      '<div class="field"><label for="f-lp" class="help">ขายแย่กว่าปกติ</label><div class="inbox"><input id="f-lp" data-season="lowPct" inputmode="decimal" value="' + esc(s.lowPct) + '"><span class="suf">%</span></div></div></div></div>';
  }
  function wizReceipt() {
    var m = state.model, inp = state.inp, steps = stepsFor(m);
    var sellOk = steps.filter(function (s) { return ['var', 'people', 'fixed', 'cash', 'adv'].indexOf(s.id) < 0; }).every(stepValid);
    var varStep = steps.filter(function (s) { return s.id === 'var'; })[0];
    var varIdx = varStep ? steps.indexOf(varStep) : -1;
    var varOk = !varStep || (stepValid(varStep) && (state.editing || state.step >= varIdx));
    var fx = fixedTotal(inp);
    var head = '<section class="panel receipt-strip" id="rstrip"><div class="rs-top"><span class="rs-k">';
    if (!sellOk) return head + 'ใบเสร็จร้านคุณ</span></div><div class="rs-empty">ตัวเลขจะค่อยๆ ขึ้นตรงนี้ระหว่างที่คุณกรอก</div></section>';
    var fill = Object.assign({}, inp);
    FIELDS.forEach(function (f) { if (f.req && (!f.models || f.models.indexOf(m) >= 0) && num(fill[f.k]) === null) fill[f.k] = 0; });
    var S = C(fill, m);
    if (!S.ok) return head + 'ใบเสร็จร้านคุณ</span></div><div class="rs-empty">ตัวเลขยังไม่ครบ</div></section>';
    var lines = '<div class="rs-line"><span>รายได้ต่อเดือน</span><i></i><b>' + fmtN(S.revenue) + '</b></div>';
    if (varOk) lines += '<div class="rs-line"><span>ต้นทุนที่ขึ้นลงตามยอดขาย</span><i></i><b>−' + fmtN(S.varCost) + '</b></div>';
    if (fx > 0) lines += '<div class="rs-line"><span>ค่าใช้จ่ายคงที่</span><i></i><b>−' + fmtN(fx) + '</b></div>';
    var topK = varOk ? (S.profit < 0 ? 'ขาดทุนต่อเดือน' : 'เหลือต่อเดือน') : 'รายได้ต่อเดือน';
    var topV = varOk ? S.profit : S.revenue;
    return head + topK + '</span><span class="rs-v">' + (varOk && S.profit < 0 ? '−' : '') + anim('rs', topV) + '<small>บาท</small></span></div><div class="rs-lines">' + lines + '</div></section>';
  }
  function viewWizard() {
    var m = state.model, steps = stepsFor(m);
    if (state.step >= steps.length) state.step = steps.length - 1;
    var st = steps[state.step];
    var nReq = steps.filter(function (s) { return !s.adv; }).length;
    /* ระหว่างทางของเรื่อง: แถบขั้นตอนชุดเดียว · ตัวเลขร้านอย่างเดียว (ไม่มีเรื่อง): แถบของตัวเลขร้าน · แก้ทีละข้อ: ไม่มีแถบ */
    var prog = state.editing ? '' : state.topic ? flowBar(1, st.adv ? 1 : (state.step + 1) / (nReq + 1))
      : '<div class="prog">' + steps.map(function (s, i) { return '<i class="' + (i <= state.step ? 'on' : '') + '"></i>'; }).join('') + '</div>';
    var body;
    if (st.adv) {
      body = '<div class="adv-list">' + ADV_GROUPS.map(function (g) {
        var fs = FIELDS.filter(function (f) { return f.g === g[0] && (!f.models || f.models.indexOf(m) >= 0); });
        if (!fs.length) return '';
        var filled = fs.some(function (f) { return f.k === 'season' ? hasSeason(state.inp) : num(state.inp[f.k]) !== null; });
        return '<details class="adv-block"' + (filled ? ' open' : '') + '><summary><span>' + g[1] + (g[2] ? '<small>' + g[2] + '</small>' : '') + '</span>' + ICON.down + '</summary><div class="qfields">' +
          fs.map(function (f) { return fieldHtml(f.k); }).join('') + '</div></details>';
      }).join('') + '</div>';
    } else body = '<div class="qfields">' + st.f.map(fieldHtml).join('') + '</div>';
    var cashIdx = steps.map(function (s) { return s.id; }).indexOf('cash');
    var isLastReq = state.step === cashIdx, isAdv = !!st.adv;
    var allOk = steps.every(stepValid);
    var primary;
    if (state.editing) primary = '<button class="btn" data-act="shop-done"' + (allOk ? '' : ' disabled') + '>เสร็จ</button>';
    else if (isLastReq || isAdv) primary = '<button class="btn" data-act="shop-done"' + (allOk ? '' : ' disabled') + '>' + (state.topic ? 'ต่อไป: ตัวเลขเรื่องนี้' : 'เสร็จ') + ICON.next + '</button>';
    else primary = '<button class="btn" data-act="next"' + (stepValid(st) ? '' : ' disabled') + '>ถัดไป' + ICON.next + '</button>';
    var foot = '<div class="foot" id="foot"><div class="wrap"><button class="btn ghost back" data-act="prev" aria-label="ย้อนกลับ">' + ICON.back + '</button>' + primary + '</div></div>';
    var more = isLastReq && !state.editing ? '<div class="skip"><button class="lnk" data-act="next">เพิ่มรายละเอียดให้แม่นขึ้น (ไม่ใส่ก็ได้)</button></div>' : '';
    var sub = state.editing ? 'แก้ตัวเลขร้าน' : 'ตัวเลขร้าน · ' + (st.adv ? 'ไม่ใส่ก็ได้' : 'ข้อ ' + (state.step + 1) + ' จาก ' + nReq);
    return bar(backBtn('prev'), state.topic && !state.editing ? TOPICS[state.topic].title : MODELS[m].tile, sub) +
      '<main class="screen"><div class="wrap">' + prog + wizReceipt() +
      '<div class="q-head"><h1>' + esc(st.q) + '</h1>' + (st.p ? '<p>' + esc(st.p) + '</p>' : '') + '</div>' + body + more + '</div></main>' + foot;
  }

  /* ============================================================ คำถามของเรื่องที่กำลังคิด */
  function dDef(k) { return DFIELDS[k]; }
  function dGet(d, k) { return d[dKey(k)]; }
  function dShown(k, d) { var f = dDef(k); return !f.show || f.show(state.inp, state.model, d || dec()); }
  function dMax(k) { var f = dDef(k); var mx = typeof f.max === 'function' ? f.max(state.inp, state.model) : f.max; return mx !== undefined ? mx : (f.t === 'pct' ? 100 : null); }
  function dErr(k, d) {
    var f = dDef(k), v = num(dGet(d || dec(), k));
    if (v === null) return '';
    var mx = dMax(k), pctish = f.t === 'pct' || (f.suf && f.suf(state.inp, state.model, d || dec()).charAt(0) === '%');
    if (mx !== null && v > mx) return 'ใส่ได้ไม่เกิน ' + fmtN(mx) + (pctish ? '%' : k === 'closedDays' ? ' วัน (วันที่เปิดร้านต่อเดือน)' : '');
    if (f.min !== undefined && v < f.min) return k === 'salesPct' || k === 'supSales' ? 'น้อยลงได้ไม่เกิน ' + fmtN(-f.min) + '%' : 'ต้องไม่น้อยกว่า ' + fmtN(f.min);
    if (k === 'npPrice' && v <= 0) return 'ต้องมากกว่า 0';
    if (k === 'fixedChg' && v < -fixedTotal(state.inp)) return 'ลดได้ไม่เกินค่าใช้จ่ายคงที่ทั้งหมดของร้าน (' + fmtN(fixedTotal(state.inp)) + ' บาท)';
    return '';
  }
  function dStepValid(st, d) {
    d = d || dec();
    return st.f.every(function (k) {
      if (!dShown(k, d)) return true;
      if (dErr(k, d)) return false;
      var f = dDef(k);
      if (f.t === 'kind') return kindsOf(state.topic, state.inp, state.model).some(function (o) { return o[0] === d.kind; });
      if (f.req) return num(dGet(d, k)) !== null;
      if (f.t === 'count') return num(dGet(d, k)) >= (f.min || 1);
      return true;
    });
  }
  function dAllValid() { var s = dStepsFor(state.topic, state.inp, state.model); return s.every(function (x) { return dStepValid(x); }); }
  function dPh(k) {
    var f = dDef(k);
    if (!f.ph) return '';
    var v = f.ph(state.inp, state.model);
    if (typeof v !== 'number' || !(v > 0)) return '';
    return 'เช่น ' + (v >= 1000 ? Math.round(v).toLocaleString('th-TH') : fmtN(v, 1));
  }
  function quickHtml(k, f, d) {
    if (!f.quick) return '';
    var cur = num(dGet(d, k));
    var items = f.quick.map(function (q, i) {
      var v = q[1](state.inp, state.model);
      if (v === null || v === undefined) return '';
      var lab = q[0] + (q[0].indexOf('เท่า') === 0 && v > 0 && !/%/.test(q[0]) ? ' (' + fmtN(v) + ')' : '');
      return '<button type="button" class="chip" data-act="dquick" data-k="' + k + '" data-i="' + i + '" aria-pressed="' + (cur !== null && Math.abs(cur - v) < 1e-9) + '">' + esc(lab) + '</button>';
    }).join('');
    return items ? '<div class="chips quick">' + items + '</div>' : '';
  }
  function dFieldHtml(k) {
    var f = dDef(k), m = state.model, inp = state.inp, d = dec();
    var hidden = dShown(k, d) ? '' : ' hidden';
    var lab = esc(f.label(inp, m, d));
    var help = f.help ? '<p class="help">' + esc(f.help(inp, m, d)) + '</p>' : '';
    var err = dErr(k, d);
    var errHtml = '<p class="err" id="err-' + k + '" role="alert"' + (err ? '' : ' hidden') + '>' + esc(err) + '</p>';
    var id = 'd-' + k;
    if (f.t === 'count') {
      var c = Math.max(f.min || 1, Math.round(num(d[k]) || f.min || 1));
      return '<div class="field" data-df="' + k + '"' + hidden + '><span class="lab" id="lab-' + k + '">' + lab + '</span><div class="counter" role="group" aria-labelledby="lab-' + k + '">' +
        '<button type="button" class="stp" data-act="dcount" data-k="' + k + '" data-dir="-1" aria-label="ลด"' + (c <= (f.min || 1) ? ' disabled' : '') + '>−</button>' +
        '<span class="cnum" aria-live="polite">' + c + '<small>' + esc(f.suf(inp, m)) + '</small></span>' +
        '<button type="button" class="stp" data-act="dcount" data-k="' + k + '" data-dir="1" aria-label="เพิ่ม"' + (c >= f.max ? ' disabled' : '') + '>+</button></div>' + help + '</div>';
    }
    if (f.t === 'ramp') {
      var raw = num(dGet(d, k)), rv = raw === null ? null : Math.round(raw);
      return '<div class="field" data-df="' + k + '"' + hidden + '><span class="lab" id="lab-' + k + '">' + lab + '</span><div class="seg wrapseg" role="group" aria-labelledby="lab-' + k + '">' + f.opts.map(function (o) {
        var on = rv === o || (!f.req && rv === null && o === f.opts[0]);
        return '<button type="button" data-act="dpick" data-k="' + k + '" data-v="' + o + '" aria-pressed="' + on + '"' + (o ? ' aria-label="' + o + ' เดือน"' : '') + '>' + (o === 0 ? 'ทันที' : o) + '</button>';
      }).join('') + '</div>' + (f.opts[0] !== 0 || f.opts.length < 5 ? '' : '<p class="help">ตัวเลขคือจำนวนเดือน</p>') + help + '</div>';
    }
    if (f.t === 'kind') {
      return '<div class="field" data-df="kind"><span class="sr" id="lab-kind">' + esc(KIND_Q[state.topic] || lab) + '</span><div class="kinds" role="radiogroup" aria-labelledby="lab-kind">' +
        kindsOf(state.topic, inp, m).map(function (o) {
          var on = d.kind === o[0];
          return '<button type="button" class="kd" role="radio" data-act="dkind" data-v="' + o[0] + '" aria-checked="' + on + '"><span class="kd-r" aria-hidden="true"></span><span class="kd-b"><b>' + esc(o[1]) + '</b><small>' + esc(o[2]) + '</small></span></button>';
        }).join('') + '</div></div>';
    }
    var v = dGet(d, k), suf = esc(f.suf ? f.suf(inp, m, d) : (f.t === 'pct' ? '%' : 'บาท'));
    var sign = '';
    if (f.t === 'signed') {
      var neg = num(v) !== null ? num(v) < 0 : state.dsign[k] === -1;
      sign = '<div class="seg" role="group" aria-label="' + lab + '"><button type="button" data-act="dsign" data-k="' + k + '" data-v="1" aria-pressed="' + !neg + '">' + f.words[0] + '</button>' +
        '<button type="button" data-act="dsign" data-k="' + k + '" data-v="-1" aria-pressed="' + neg + '">' + f.words[1] + '</button></div>';
      v = num(v) === null ? null : Math.abs(num(v));
    }
    var mode = (f.t === 'money' || f.t === 'int') ? 'numeric' : 'decimal';
    var val = v === null || v === undefined || v === '' ? '' : (f.t === 'money' || (f.t === 'signed' && f.suf && f.suf().indexOf('บาท') >= 0) ? Math.round(v).toLocaleString('th-TH') : String(v));
    var input = '<input id="' + id + '" data-dk="' + k + '" data-t="' + f.t + '" inputmode="' + mode + '" autocomplete="off" enterkeyhint="next" placeholder="' + esc(dPh(k)) + '" value="' + esc(val) + '" aria-describedby="err-' + k + '">';
    return '<div class="field" data-df="' + k + '"' + hidden + '><label for="' + id + '">' + lab + '</label>' + sign + quickHtml(k, f, d) +
      '<div class="inbox' + (err ? ' bad' : '') + '">' + input + '<span class="suf">' + suf + '</span></div>' + help + errHtml + '</div>';
  }
  /* ผลสดด้านบนระหว่างตอบ: ไม่ทำ | ทำ */
  function dStrip() {
    var S = C(state.inp, state.model);
    var a = '<div class="ds-a"><small>ไม่ทำ · กำไร/เดือน</small><b>' + (S.ok ? plain(S.profit) : '–') + '</b></div>';
    var b;
    if (S.ok && dAllValid()) {
      var R = E(dec());
      b = R.ok ? '<div class="ds-b"><small>ทำ · กำไร/เดือน</small><b>' + (R.profit < 0 ? '−' : '') + anim('ds', R.profit) + '</b><i>' + dirSpan(R.delta, fmtN(Math.abs(R.delta))) + '</i></div>'
        : '<div class="ds-b"><small>ทำ</small><b>–</b></div>';
    } else b = '<div class="ds-b wait"><small>ทำ · กำไร/เดือน</small><b>?</b><i>ตอบข้อที่ต้องกรอกให้ครบ แล้วจะเห็นทันที</i></div>';
    return a + b;
  }
  function viewDq() {
    var t = state.topic, steps = dStepsFor(t, state.inp, state.model);
    if (state.dstep >= steps.length) state.dstep = steps.length - 1;
    var st = steps[state.dstep];
    var prog = state.dediting ? '' : flowBar(2, (state.dstep + 1) / (steps.length + 1));
    var last = state.dstep === steps.length - 1;
    var primary = state.dediting ? '<button class="btn" data-act="d-done"' + (dAllValid() ? '' : ' disabled') + '>เสร็จ</button>'
      : last ? '<button class="btn" data-act="d-done"' + (dAllValid() ? '' : ' disabled') + '>ดูผล' + ICON.next + '</button>'
        : '<button class="btn" data-act="d-next"' + (dStepValid(st) ? '' : ' disabled') + '>ถัดไป' + ICON.next + '</button>';
    var foot = '<div class="foot" id="foot"><div class="wrap"><button class="btn ghost back" data-act="d-prev" aria-label="ย้อนกลับ">' + ICON.back + '</button>' + primary + '</div></div>';
    return bar(backBtn('d-prev'), TOPICS[t].title, state.dediting ? 'แก้คำตอบ' : 'ตัวเลขเรื่องนี้ · ข้อ ' + (state.dstep + 1) + ' จาก ' + steps.length) +
      '<main class="screen"><div class="wrap">' + prog + '<section class="dstrip" id="dstrip" aria-label="ไม่ทำ เทียบกับ ทำ">' + dStrip() + '</section>' +
      '<div class="q-head"><h1>' + esc(st.q) + '</h1>' + (st.p ? '<p>' + esc(st.p) + '</p>' : '') + '</div>' +
      '<div class="qfields">' + st.f.map(dFieldHtml).join('') + '</div></div></main>' + foot;
  }

  /* ============================================================ REVIEW (แก้ตัวเลข) */
  function stepSummary(st) {
    var m = state.model, inp = state.inp;
    if (st.adv) {
      var bits = [];
      if (num(inp.growth)) bits.push('โต ' + inp.growth + '%/เดือน');
      if (hasSeason(inp)) bits.push('มีฤดูกาล');
      if (num(inp.capacity) || num(inp.maxMembers) || num(inp.maxConcurrent) || num(inp.maxDeals)) bits.push('มีกำลังสูงสุด');
      if (num(inp.creditDays) || num(inp.stockDays)) bits.push('มีจังหวะเงินเข้าออก');
      if (num(inp.newCustomers)) bits.push('มีข้อมูลลูกค้า');
      if (num(inp.equipValue)) bits.push('มีอุปกรณ์');
      return bits.length ? bits.join(' · ') : 'ยังไม่ได้ใส่';
    }
    return st.f.map(function (k) {
      var f = fieldDef(k);
      if (!f || (f.show && !f.show(inp, m))) return '';
      if (f.t === 'unit') return 'นับเป็น' + U(inp, m);
      if (f.t === 'cycle') return 'จ่ายรอบละ ' + (num(inp.cycle) || 1) + ' เดือน';
      if (f.t === 'period') return inp.periodKind === 'month' ? 'คิดต่อเดือน' : 'คิดต่อคืน';
      var v = num(inp[k]);
      if (v === null) return '';
      var suf = f.t === 'volume' ? U(inp, m) + '/' + perWord(inp) : (f.suf ? f.suf(inp, m) : (f.t === 'pct' ? '%' : 'บาท'));
      return f.label(inp, m) + ' ' + fmtN(v, 2) + (suf.charAt(0) === '%' ? suf : ' ' + suf);
    }).filter(Boolean).join(' · ') || 'ยังไม่ได้ใส่';
  }
  function dStepSummary(st) {
    var m = state.model, inp = state.inp, d = dec();
    return st.f.map(function (k) {
      var f = dDef(k);
      if (!dShown(k, d)) return '';
      if (f.t === 'kind') return kindName(state.topic, d, inp, m);
      if (f.t === 'ramp') { var r = num(dGet(d, k)); return r === null ? '' : f.label(inp, m, d) + ' ' + (r > 0 ? fmtN(r) + ' เดือน' : 'ทันที'); }
      var v = num(dGet(d, k));
      if (v === null) return '';
      var suf = f.suf ? f.suf(inp, m, d) : (f.t === 'pct' ? '%' : 'บาท');
      var vt = f.t === 'signed' ? (v < 0 ? f.words[1] : v > 0 ? f.words[0] : 'เท่าเดิม') + ' ' + fmtN(Math.abs(v), 2) : fmtN(v, 2);
      return f.label(inp, m, d) + ' ' + vt + (suf.charAt(0) === '%' ? suf : ' ' + suf);
    }).filter(Boolean).join(' · ') || 'ยังไม่ได้ใส่';
  }
  /* รายการตัวเลขร้าน แตะเพื่อแก้ทีละข้อ (ใช้ในหน้าปรับตัวเลข และหน้าแก้ตัวเลขร้านจากหน้าเริ่ม) */
  function shopRows() {
    return '<div class="rv">' + stepsFor(state.model).map(function (st, i) {
      return '<button class="rv-row" data-act="edit-step" data-i="' + i + '"><span class="t">' + esc(st.q) + '</span><span class="v">' + esc(stepSummary(st)) + '</span>' + ICON.chev + '</button>';
    }).join('') + '</div><div class="alt"><span>ร้านได้เงินจากอย่างอื่น?</span><button class="lnk" data-act="to-shop">เปลี่ยนรูปแบบร้าน</button></div>';
  }
  /* แก้ตัวเลขร้าน (เปิดจากหน้าเริ่ม ยังไม่ได้อยู่ในเรื่องไหน) */
  function viewReview() {
    return bar(backBtn('to-start', 'กลับไปหน้าเริ่ม'), 'ตัวเลขร้าน', 'แก้ตัวเลข') + '<main class="screen"><div class="wrap">' +
      '<div class="q-head"><h1>ตัวเลขร้านคุณ</h1><p>ใช้กับทุกเรื่อง แตะข้อที่อยากแก้</p></div>' +
      '<div class="sec-h"><h2>' + esc(MODELS[state.model].tile) + '</h2></div>' + shopRows() + '</div></main>';
  }

  /* ============================================================ RESULT — สองเส้นทาง */
  function pivotWord(P, v) {
    if (P.verb) return P.verb + ' ' + nf(v, P.unit);
    if (P.T === 'branch') return 'สาขามี' + salesWord(state.model) + ' ' + fmtN(v) + '% ของร้านเดิม';
    if (P.T === 'channel') return P.word + (/ได้$/.test(P.word) ? ' ' : 'ได้ ') + nf(v, P.unit);
    return P.word + ' ' + nf(v, P.unit);
  }
  function heroHtml(R, P, v) {
    var dl = R.delta, ab = fmtN(Math.abs(dl)), pre = state.topic === 'promo' ? 'ช่วงจัดโปร ' : '';
    var h = pre + (Math.abs(dl) < 0.5 ? 'กำไรเท่าเดิม' : 'กำไร<span class="nw">' + (dl > 0 ? 'เพิ่มขึ้น' : 'ลดลง') + '</span> <span class="hb ' + (dl > 0 ? 'up' : 'down') + '">' + anim('hb' + state.topic, Math.abs(dl)) + '</span> <span class="hu">บาท/เดือน</span>');
    var has = v !== null && v !== undefined && v > 0;
    var ctx = 'ถ้า' + (state.topic === 'channel' && has ? pivotWord(P, v) : dSummary(state.topic, dec(), state.inp, state.model) + (has ? ' และ' + pivotWord(P, v) : '')) +
      (R.k > 0 && has ? ' · ' + salesWord(state.model) + 'ขึ้นถึงที่คาดในเดือนที่ ' + (R.k + 1) : '');
    var loss = R.profit < -0.5 ? '<p class="h-loss">ร้านจะขาดทุน <b>' + fmtN(-R.profit) + '</b> บาท/เดือน</p>' : '';
    var risk = '';
    if (R.need > 0.5) risk = '<p class="h-risk">' + ICON.alert + '<span>' + (R.B.hasCash ? 'เงินจะขาดมือมากสุด <b>' + fmtN(R.need) + '</b> บาท · ' + tw(cashWhen(R)) + ' (มีอยู่ ' + fmtN(R.cashStart) + ' บาท)'
      : 'ช่วงแรกต้องมีเงินอย่างน้อย <b>' + fmtN(R.need) + '</b> บาท') + '</span></p>';
    return '<div class="h-k"></div>' +
      '<h1 class="h-big" aria-label="' + esc(pre + (Math.abs(dl) < 0.5 ? 'กำไรเท่าเดิม' : 'กำไร' + (dl > 0 ? 'เพิ่มขึ้น ' : 'ลดลง ') + ab + ' บาทต่อเดือน')) + '">' + h + '</h1>' +
      loss + '<p class="h-sub">' + tw(ctx) + '</p>' + (state.topic === 'promo' ? '<p class="h-sub">ทั้งปี (ช่วงโปรและหลังจบโปร) กำไร' + (R.total12 >= -0.5 ? 'เพิ่ม' : 'ลด') + ' <b>' + fmtN(Math.abs(R.total12)) + '</b> บาท เทียบกับไม่ทำ</p>' : '') + risk;
  }
  function laneRows(R) {
    var m = state.model, inp = state.inp, d = viewD(), x = R.st.b.x, rows = [];
    rows.push([state.topic === 'promo' ? 'กำไรต่อเดือน (ช่วงโปร)' : 'กำไรต่อเดือน', plain(R.B.profit), plain(R.profit), R.delta, 'big']);
    var hc = R.B.hasCash;
    var cA = R.rows[11].bBal, cB = R.rows[11].bal, big = Math.min(Math.abs(cA), Math.abs(cB)) >= 1e5;
    rows.push([hc ? 'เงินสดสิ้น ' + monthLabel(12, true) : 'เงินเพิ่ม/ลดใน 12 เดือน', big ? fmtCompact(cA) : plain(cA), big ? fmtCompact(cB) : plain(cB), cB - cA, '', big]);
    if (R.one > 0) {
      rows.push([state.topic === 'promo' ? 'ค่าจัดโปร' : 'เงินก้อนตอนเริ่ม', '–', fmtN(R.one), null]);
      if (state.topic !== 'promo') rows.push(['คืนทุน', '–', R.payback === null ? 'ไม่ได้' : fmtMonths(R.payback), null]);
    }
    var u = volUnitText(inp, m), cur = n0(inp[ROLE[m].vol]), now = n0(x[ROLE[m].vol]), T = state.topic, sw = salesWord(m);
    var volRow = function (lab) { rows.push([lab || sw, nf(cur, u), nf(now, u), null]); };
    var costRow = function (lab) { rows.push([lab, fmtN(n0(inp.unitCost), 2), fmtN(n0(x.unitCost), 2), null]); };
    if (T === 'hire') {
      if (isKind(d, 'piece')) costRow('ต้นทุนต่อ' + U(inp, m) + ' (รวมค่าจ้าง)');
      else rows.push(['พนักงาน (ไม่นับคุณ)', fmtN(n0(inp.staffCount)) + ' คน', fmtN(n0(inp.staffCount) + Math.max(1, Math.round(n0(d.count)))) + ' คน', null]);
      if (n0(d.gain) > 0) volRow();
    } else if (T === 'price') {
      var pk = ROLE[m].price;
      rows.push(['ราคาต่อ' + priceWord(inp, m) + (isKind(d, 'some') ? ' (เฉลี่ย)' : ''), fmtN(n0(inp[pk]), 2), fmtN(n0(x[pk]), 2), null]);
      volRow();
    } else if (T === 'promo') {
      if (isKind(d, 'gift')) costRow('ต้นทุนต่อ' + U(inp, m) + ' (รวมของแถม)');
      else rows.push(['ราคาเฉลี่ยช่วงโปร', fmtN(n0(inp.price), 2), fmtN(n0(x.price), 2), null]);
      volRow(sw + 'ช่วงโปร');
    } else if (T === 'newprod') {
      rows.push(['ของใหม่', '–', nf(n0(R.st.b.note.npQ), npUnit(m) + '/' + perWord(inp)), null]);
      if (Math.abs(now - cur) > 1e-9) volRow(sw + 'ของเดิม');
    } else if (T === 'freeship') {
      costRow('ต้นทุนต่อ' + U(inp, m) + ' (รวมค่าส่ง)');
      volRow();
    } else if (T === 'ads') {
      rows.push(['ค่าโฆษณาต่อเดือน', '–', fmtN(n0(d.adBudget) + n0(d.adMgmt)), null]);
      if (n0(d.adGain) > 0) volRow();
    } else if (T === 'freelance') {
      rows.push(['ค่าจ้างต่อเดือน', '–', fmtN(n0(d.flFee)), null]);
      if (n0(d.flGain) > 0) volRow();
    } else if (T === 'supplier') {
      costRow('ต้นทุนต่อ' + U(inp, m));
      volRow();
    } else if (T === 'place') {
      rows.push(['ค่าเช่า', fmtN(n0(inp.rent)), fmtN(n0(d.newRent)), null]);
      rows.push([salesWord(m), nf(cur, u), nf(cur * (1 + n0(d.salesPct) / 100), u), null]);
    } else if (T === 'channel') {
      var cu = channelUnit(inp, m, d);
      if (cu) rows.push(['เหลือเงินต่อ' + ({ subscription: 'สมาชิก/เดือน', project: 'งาน', rental: periodWord(inp) + 'ที่มีคนเช่า', commission: 'ดีล' }[m] || U(inp, m)), fmtN(cu.own, 1), fmtN(cu.ch, 1) + ' <small>' + esc(tj('ผ่าน', d.chName || 'ช่องทาง')) + '</small>', null]);
    } else if (T === 'equip') {
      if (isVolModel(m) && pos(inp.capacity) && pos(d.eqCap)) rows.push(['ทำได้สูงสุด', nf(n0(inp.capacity), u), nf(n0(x.capacity), u), null]);
      var cpc = costDownSuf(m).charAt(0) === '%' ? '%' : '';
      if (n0(d.costDown) > 0) rows.push([costDownLabel(inp, m).replace('ลดลง', ''), fmtN(n0(inp[ROLE[m].cost]), 1) + cpc, fmtN(n0(x[ROLE[m].cost]), 1) + cpc, null]);
    } else if (T === 'branch') {
      rows.push(['ร้าน', '1 ที่', '2 ที่', null]);
      rows.push([salesWord(m) + 'รวม', m === 'rental' ? fmtN(cur) + '% · 1 ที่' : nf(cur, u), m === 'rental' ? '2 ที่' : nf(cur * (1 + n0(d.bPct) / 100), u), null]);
    }
    return rows;
  }
  function lanesHtml(R) {
    return '<div class="ln-head" aria-hidden="true"><span>ไม่ทำ</span><span>ทำ</span></div>' + laneRows(R).map(function (r, i) {
      return '<div class="ln-row' + (r[4] ? ' ' + r[4] : '') + '" style="--d:' + i + '"><div class="ln-a"><small>' + esc(r[0]) + '</small><b><span class="sr">ไม่ทำ </span>' + r[1] + '</b></div>' +
        '<div class="ln-b"><small>' + (r[3] !== null && Math.abs(r[3]) >= 0.5 ? dirSpan(r[3], r[5] ? fmtCompact(Math.abs(r[3])) : fmtN(Math.abs(r[3]))) : '&nbsp;') + '</small><b><span class="sr">ทำ </span>' + r[2] + '</b></div></div>';
    }).join('');
  }
  /* แถบลากหาจุดคุ้ม */
  function pct(P, v) { return Math.max(0, Math.min(100, (v - P.lo) / (P.hi - P.lo) * 100)); }
  function pivotCard(R, P) {
    var v = wiVal() !== null ? wiVal() : P.have, be = P.be;
    var pc = P.unit.charAt(0) === '%', ut = esc(pc ? P.unit.slice(1).trim() : P.unit);
    var rn = function (x) { return nf(needAt(P, x, state.model, v), '') + (pc ? '%' : ''); };
    var numU = function (txt) { return '<b>' + txt + '</b>' + (ut ? '<small>' + ut + '</small>' : ''); };
    var head;
    if ((be.kind === 'value' || be.kind === 'zero') && P.target) head = '<span class="pn"><span>กำไรต่อเดือนเท่าเดิม</span>' + numU(rn(P.need)) + '</span>' +
      '<span class="pn pay"><span>' + esc(P.targetTxt) + '</span>' + (P.payNeed !== null ? numU(rn(P.payNeed)) : '<b class="pn-x">ไม่ทัน</b>') + '</span>';
    else if (be.kind === 'value' || be.kind === 'zero') head = '<span>จุดคุ้ม</span>' + numU(rn(P.need));
    else if (be.kind === 'max') head = '<span>ต้องไม่เกิน</span>' + numU(nf(downAt(be.x, state.model, v), '') + (pc ? '%' : ''));
    else head = '<span class="txt">' + esc(needText(P, state.model, state.inp, dec())) + '</span>';
    var np = P.need !== null ? pct(P, P.need) : be.kind === 'max' ? pct(P, be.x) : null;
    var zone = be.kind === 'always' ? 'all-ok' : be.kind === 'never' ? 'all-no' : be.kind === 'max' ? 'rev' : 'fwd';
    var pp = P.target ? (P.payNeed !== null && P.payNeed !== undefined ? pct(P, P.payNeed) : 100) : null;
    if (pp !== null && zone === 'fwd') zone = 'fwd3';
    var hp = P.have > 0 || P.showHave ? pct(P, P.have) : null;
    var S = dScenarios(state.inp, state.model, state.topic, dec(), P);
    var chips = S.map(function (s) {
      var on = Math.abs(v - s.v) < 1e-6;
      return '<button type="button" class="sc" data-act="wi" data-v="' + s.v + '" aria-pressed="' + on + '"><span>' + esc(s.label) + '</span><b>' + dirSpan(s.delta, fmtN(Math.abs(s.delta))) + '</b></button>';
    }).join('');
    if (!chips && P.need !== null && P.need > P.lo) chips = '<button type="button" class="sc" data-act="wi" data-v="' + P.need + '" aria-pressed="' + (Math.abs(v - P.need) < 1e-6) + '"><span>ที่จุดคุ้ม</span><b>' + nf(P.need, '') + '</b></button>';
    return '<section class="piv" id="piv"><h2 class="pv-q">' + tw(P.q) + '</h2><div class="pv-need' + (P.target && head.indexOf('class="pn') >= 0 ? ' two' : '') + '">' + head + '</div>' +
      '<div class="pv-track ' + zone + '" style="--n:' + (np === null ? 50 : np.toFixed(2)) + '%;--p:' + (pp === null ? 100 : pp.toFixed(2)) + '%">' +
      '<div class="pv-zone" aria-hidden="true"><i class="z1"></i><i class="z2"></i><i class="z3"></i></div>' +
      (np !== null ? '<span class="pv-mk need" style="left:calc(14px + (100% - 28px) * ' + (np / 100).toFixed(4) + ')" aria-hidden="true"></span>' +
        '<span class="pv-tk l" style="left:calc(14px + (100% - 28px) * ' + (np / 100).toFixed(4) + ')" aria-hidden="true">' + (be.kind === 'max' ? nf(downAt(be.x, state.model, v), '') : P.need !== null ? nf(needAt(P, P.need, state.model, v), '') : '') + '</span>' : '') +
      (pp !== null && pp < 100 ? '<span class="pv-mk pay" style="left:calc(14px + (100% - 28px) * ' + (pp / 100).toFixed(4) + ')" aria-hidden="true"></span>' +
        '<span class="pv-tk r" style="left:calc(14px + (100% - 28px) * ' + (pp / 100).toFixed(4) + ')" aria-hidden="true">' + nf(needAt(P, P.payNeed, state.model, v), '') + '</span>' : '') +
      (hp !== null ? '<span class="pv-mk have" style="left:calc(14px + (100% - 28px) * ' + (hp / 100).toFixed(4) + ')" aria-hidden="true"><em>คุณคาด</em></span>' : '') +
      '<input type="range" id="pvr" data-pv="1" min="' + P.lo + '" max="' + P.hi + '" step="' + P.step + '" value="' + v + '" aria-label="' + esc(P.q) + '" aria-valuetext="' + esc(pivotWord(P, v)) + '"></div>' +
      '<div class="pv-scale" aria-hidden="true"><span>' + nf(P.lo, '') + '</span><span>' + nf(P.hi, P.unit) + '</span></div>' + legendHtml(P, zone, pp) +
      '<div class="pv-read" id="pvread">' + pvRead(R, P, v) + '</div>' +
      (chips ? '<div class="pv-chips" role="group" aria-label="ถ้าไม่เป็นอย่างที่คาด">' + chips + '</div>' : '') + '</section>';
  }
  function legendHtml(P, zone, pp) {
    if (zone === 'fwd3') return '<div class="pv-leg" aria-hidden="true"><span><i class="lz1"></i>กำไรน้อยกว่าตอนนี้</span><span><i class="lz2"></i>กำไรมากกว่า แต่คืนทุนช้ากว่า 3\u00a0ปี</span>' +
      (pp < 100 ? '<span><i class="lz3"></i>' + esc(P.targetTxt) + '</span>' : '') + '</div>';
    if (zone === 'fwd' || zone === 'rev') return '<div class="pv-leg" aria-hidden="true"><span><i class="lz1"></i>กำไรน้อยกว่าตอนนี้</span><span><i class="lz3"></i>กำไรมากกว่าตอนนี้</span></div>';
    return '';
  }
  function pvRead(R, P, v) {
    var rows = (R.conds || []).filter(function (c) { return (c.id === 'need' || c.id === 'payneed') && c.value !== null; });
    var ok = rows.length ? rows.every(function (c) { return c.status === 'ok'; }) && !(P.target && P.payNeed === null)
      : R.delta >= -0.5 && (!(R.one > 0) || (R.payback !== null && (!P.target || R.payback <= P.target + 1e-9)));
    /* คืนทุนก่อนเครื่องหมดอายุ · ไม่เกินกำลังร้าน ก็เป็นเงื่อนไขด้วย */
    ok = ok && (R.conds || []).every(function (c) { return !(c.id === 'pay' || c.id === 'cap' || c.id === 'room' || c.id === 'total' || c.id === 'after') || c.status !== 'short'; });
    var pay = state.topic === 'promo' ? ' · ทั้งปี ' + dirSpan(R.total12, fmtN(Math.abs(R.total12))) : R.one > 0 ? ' · คืนทุน' + payIn(R.payback) : '';
    return '<span class="pr-v">ถ้า' + tw(pivotWord(P, v)) + '</span><span class="pr-r ' + (ok ? 'ok' : 'no') + '">' + (ok ? ICON.ok : ICON.no) +
      '<span><span class="sr">' + (ok ? 'ถึงเงื่อนไข ' : 'ยังไม่ถึงเงื่อนไข ') + '</span>กำไรต่อเดือน' + (state.topic === 'promo' ? 'ช่วงโปร ' : ' ') + dirSpan(R.delta, fmtN(Math.abs(R.delta))) + pay + '</span></span>';
  }
  function checkHtml(c) {
    var icon = c.status === 'ok' ? ICON.ok : c.status === 'short' ? ICON.no : ICON.dot;
    var val = c.value === null ? '' : ' <b>' + (c.payback ? esc(payIn(c.value)) : (c.cash || c.unit === 'บาท' || c.unit === 'บาท/เดือน' ? plain(c.value) + ' ' + esc(c.unit) : nf(c.value, c.unit))) + '</b>';
    if (c.payback && c.value === null) val = ' <b>' + payIn(null) + '</b>';
    var have = '';
    if ((c.id === 'need' || c.id === 'payneed') && c.value !== null && c.have !== null && c.have !== undefined) {
      var w = wiVal(), hv = c.haveShown !== undefined ? c.haveShown : c.have, gap = Math.round((hv - c.value) * 10) / 10;
      have = (w !== null ? 'ที่ลองดู ' : 'คุณคาดไว้ ') + nf(hv, '') + ' · ' + (c.over ? 'แต่จุดนี้เกินกำลังที่ร้านทำได้' : Math.abs(gap) < 1e-9 ? 'พอดีเงื่อนไข' : dirSpan(gap > 0 ? 1 : -1, (gap > 0 ? 'มากกว่า ' : 'น้อยกว่า ') + nf(Math.abs(gap), '')));
    }
    var txt = c.value === null && !c.payback ? '<span class="ck-txt">' + esc(c.txt || '') + '</span>' : '';
    var inner = '<span class="ck-i" aria-hidden="true">' + icon + '</span>' +
      '<span class="ck-b"><span class="ck-t"><span class="sr">' + (c.status === 'ok' ? 'ถึงแล้ว: ' : c.status === 'short' ? 'ยังไม่ถึง: ' : '') + '</span>' + tw(c.label) + val + txt + '</span>' + (c.sub ? '<small>' + tw(c.sub) + '</small>' : '') + (have ? '<small class="ck-h">' + have + '</small>' : '') + '</span>';
    if (c.lever && labKeys().indexOf(c.lever) >= 0) return '<li data-id="' + c.id + '"><button class="ck ' + c.status + '" data-act="lab" data-k="' + c.lever + '">' + inner + '<span class="go">ปรับ' + ICON.chev + '</span></button></li>';
    return '<li data-id="' + c.id + '"><div class="ck ' + c.status + '">' + inner + '</div></li>';
  }
  function cashCard(R) {
    var hc = R.B.hasCash, end = R.rows[11].bal, bEnd = R.rows[11].bBal;
    var lead;
    if (R.need > 0.5) lead = hc ? 'เงินจะขาดมือมากสุด <b>' + fmtN(R.need) + '</b> บาท · ' + tw(cashWhen(R)) : 'ช่วงแรกต้องมีเงินอย่างน้อย <b>' + fmtN(R.need) + '</b> บาท ก่อนเงินเริ่มกลับมา';
    else lead = 'สิ้น ' + monthLabel(12, true) + (hc ? ' มีเงินสด <b>' + fmtN(end) + '</b> บาท' : ' เงินเพิ่มขึ้น <b>' + fmtN(end) + '</b> บาท') + ' · ไม่ทำ ' + fmtN(bEnd);
    var pay = R.payback !== null && R.payback <= 12 ? '<span><i class="pf"></i>คืนทุน ' + monthLabel(Math.ceil(R.payback - 1e-9), true) + '</span>' : '';
    return '<section class="card cashp"><p class="lead">' + lead + '</p><div class="chart" data-chart="cash">' + cashSvg(R) + '</div>' +
      '<div class="legend"><span><i></i>ทำ</span><span><i class="g"></i>ไม่ทำ</span>' + pay + '</div></section>';
  }
  function cashSvg(R) {
    var W = 340, H = 200, L = 50, Rr = 14, Tp = 22, Bt = 26;
    var a = [R.aStart].concat(R.rows.map(function (w) { return w.bal; }));
    var b = [R.cashStart].concat(R.rows.map(function (w) { return w.bBal; }));
    var all = a.concat(b);
    var mn = Math.min(0, Math.min.apply(null, all)), mx = Math.max(0, Math.max.apply(null, all));
    if (mx === mn) mx = mn + 1;
    var step = niceStep((mx - mn) / 3), lo = Math.floor(mn / step) * step, hi = Math.ceil(mx / step) * step;
    function x(i) { return L + (W - L - Rr) * i / 12; }
    function y(v) { return Tp + (H - Tp - Bt) * (1 - (v - lo) / (hi - lo)); }
    var g = '';
    for (var v = lo; v <= hi + 1e-6; v += step) g += '<line class="' + (Math.abs(v) < 1e-6 && lo < 0 ? 'zero' : 'grid') + '" x1="' + L + '" x2="' + (W - Rr) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '"/><text class="ax" x="' + (L - 6) + '" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end">' + compactTH(v) + '</text>';
    [0, 3, 6, 9, 12].forEach(function (i) { g += '<text class="axth" x="' + x(i).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="' + (i === 0 ? 'start' : i === 12 ? 'end' : 'middle') + '">' + (i === 0 ? 'ตอนนี้' : monthLabel(i, i === 12)) + '</text>'; });
    function path(s) { return s.map(function (vv, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(vv).toFixed(1); }).join(' '); }
    var out = g + '<path class="line base3" d="' + path(b) + '"/><path class="line draw" d="' + path(a) + '"/>';
    var li = R.lowT;
    if (R.low < R.aStart - 1 || (R.low < 0 && li > 0)) {
      var ly = y(a[li]);
      out += '<circle class="dot" cx="' + x(li).toFixed(1) + '" cy="' + ly.toFixed(1) + '" r="5"/><text class="mk" x="' + Math.max(L + 2, Math.min(W - Rr - 2, x(li))).toFixed(1) + '" y="' + (ly + 18 > H - Bt ? ly - 10 : ly + 18).toFixed(1) + '" text-anchor="' + (li < 2 ? 'start' : li > 10 ? 'end' : 'middle') + '">ต่ำสุด ' + compactTH(a[li]) + '</text>';
    }
    if (R.payback !== null && R.payback <= 12) {
      var pt = Math.ceil(R.payback - 1e-9), px = x(pt);
      out += '<line class="payl" x1="' + px.toFixed(1) + '" x2="' + px.toFixed(1) + '" y1="' + Tp + '" y2="' + (H - Bt) + '"/><text class="mk" x="' + px.toFixed(1) + '" y="' + (Tp - 6) + '" text-anchor="' + (pt > 10 ? 'end' : pt < 2 ? 'start' : 'middle') + '">คืนทุน</text>';
    }
    var ey = y(a[12]);
    out += '<circle class="dot" cx="' + x(12).toFixed(1) + '" cy="' + ey.toFixed(1) + '" r="4"/><text class="endlab" x="' + (x(12) - 8).toFixed(1) + '" y="' + (ey < Tp + 16 ? ey + 20 : ey - 12).toFixed(1) + '" text-anchor="end">' + compactTH(a[12]) + '</text>';
    for (var i = 0; i <= 12; i++) {
      var x0 = i === 0 ? L : (x(i) + x(i - 1)) / 2, x1 = i === 12 ? W - Rr : (x(i) + x(i + 1)) / 2;
      out += '<rect class="hit" data-i="' + i + '" x="' + x0.toFixed(1) + '" y="' + Tp + '" width="' + (x1 - x0).toFixed(1) + '" height="' + (H - Tp - Bt) + '"/>';
    }
    out += '<line class="cross" x1="0" x2="0" y1="' + Tp + '" y2="' + (H - Bt) + '" visibility="hidden"/>';
    var aria = 'กราฟเงินในมือ 12 เดือน ถ้าทำ สิ้นปี ' + fmtN(a[12]) + ' บาท ต่ำสุด ' + fmtN(a[li]) + ' บาท · ไม่ทำ สิ้นปี ' + fmtN(b[12]) + ' บาท';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(aria) + '">' + out + '</svg>';
  }
  /* กำไรเปลี่ยนเพราะอะไร: น้ำตก จากกำไรตอนนี้ → ทีละเรื่อง → กำไรถ้าทำ */
  function waterfallHtml(R) {
    if (!R.ledger.length) return '';
    var run = R.B.profit, pts = [run];
    R.ledger.forEach(function (l) { run += l.amount; pts.push(run); });
    var lo = Math.min(0, Math.min.apply(null, pts)), hi = Math.max(0, Math.max.apply(null, pts));
    if (hi === lo) hi = lo + 1;
    function p(v) { return (v - lo) / (hi - lo) * 100; }
    function rowH(label, from, to, kind, i) {
      var a = p(Math.min(from, to)), w = Math.max(0.6, Math.abs(p(to) - p(from)));
      var val = kind === 'end' || kind === 'start' ? plain(to) : (to - from < 0 ? '−' : '+') + fmtN(Math.abs(to - from));
      return '<div class="wf-r ' + kind + '" style="--d:' + i + '"><div class="wf-t"><span>' + esc(label) + '</span><b>' + val + '</b></div>' +
        '<div class="wf-track"><i class="' + (to >= from ? 'pos' : 'neg') + '" style="left:' + a.toFixed(2) + '%;width:' + w.toFixed(2) + '%"></i>' + (lo < 0 ? '<span class="wf-zero" style="left:' + p(0).toFixed(2) + '%"></span>' : '') + '</div></div>';
    }
    var rows = rowH('กำไรต่อเดือนตอนนี้', 0, R.B.profit, 'start', 0), cur = R.B.profit;
    R.ledger.forEach(function (l, i) { rows += rowH(l.label, cur, cur + l.amount, l.amount >= 0 ? 'plus' : 'minus', i + 1); cur += l.amount; });
    rows += rowH('กำไรต่อเดือนถ้าทำ', 0, R.profit, 'end', R.ledger.length + 1);
    return '<section class="card wf"><p class="lead">' + (R.k > 0 ? 'เมื่อ' + salesWord(state.model) + 'ขึ้นถึงที่คาด · ' : '') + 'บวกและลบกันแล้วเท่ากับกำไรที่เปลี่ยนพอดี</p>' + rows + '</section>';
  }
  /* ขั้นต่อไป: เครื่องมือ PL1 ที่ช่วยคิดเรื่องนี้ + เช็กความพร้อม (ไม่บังคับ) */
  function ans() { if (!state.answers[state.topic]) state.answers[state.topic] = {}; return state.answers[state.topic]; }
  function askList() {
    var d = dec();
    return (QSET3[state.topic] || []).filter(function (id) { var q = QB3[id]; return q && (!q.when || q.when(state.inp, state.model, d)); }).slice(0, 5);
  }
  function askDone() { var L = askList(), A = ans(); return L.length > 0 && L.every(function (q) { return A[q]; }); }
  function askedCount() { var A = ans(); return askList().filter(function (q) { return A[q]; }).length; }
  function pointsList() { var A = ans(); return askList().filter(function (q) { return A[q] === 'yes' || A[q] === 'unsure'; }); }
  function toolsHtml(codes, title, seen) {
    seen = seen || {};
    var items = codes.filter(function (c) { if (seen[c] || !TOOLS[c]) return false; seen[c] = 1; return true; }).map(function (c) {
      return '<button class="tool" data-act="tool" data-t="' + c + '"><span class="tn">' + esc(TOOLS[c][0]) + '</span><span class="ts">' + esc(TOOLS[c][1]) + '</span>' + ICON.out + '</button>';
    }).join('');
    return items ? '<div class="tools">' + (title ? '<span class="tl">' + esc(title) + '</span>' : '') + items + '</div>' : '';
  }
  /* ปุ่มหลักของหน้าผล (ค้างด้านล่าง): เช็กความพร้อม → จุดที่ควรเช็ก */
  function readyBtn() {
    if (askDone()) { var n = pointsList().length; return '<button class="btn" data-act="points">' + (n ? 'ดู ' + n + ' จุดที่ควรเช็ก' : 'ดูผลเช็กความพร้อม') + ICON.next + '</button>'; }
    return '<button class="btn" data-act="ask">' + (askedCount() ? 'เช็กความพร้อมต่อ' : 'เช็กความพร้อม') + ICON.next + '</button>';
  }
  /* ขั้นต่อไป (ท้ายหน้าผล): เช็กความพร้อม + เครื่องมือ PL1 ที่ช่วยคิดเรื่องนี้ต่อ */
  function nextCard() {
    var L = askList(), n = askDone() ? pointsList().length : null;
    var lead = n === null ? 'ตอบ ' + L.length + ' ข้อ แค่ ใช่ / ไม่ใช่ / ไม่แน่ใจ แล้วดูว่าควรเช็กจุดไหนก่อนตัดสินใจ' : n ? 'ตอบครบแล้ว เจอ ' + n + ' จุดที่ควรเช็ก' : 'ตอบครบแล้ว ยังไม่เจอจุดที่ควรเช็ก';
    return '<section class="next3"><h2 class="nx-h">ขั้นต่อไป</h2><div class="nx-ready"><b>เช็กความพร้อม</b><p>' + lead + '</p>' + readyBtn().replace('class="btn"', 'class="btn block"') + '</div>' +
      toolsHtml(TOPIC_TOOLS[state.topic], 'เครื่องมือที่ช่วยหาแนวทางเรื่องนี้') + '</section>';
  }
  function planCard() {
    return '<section class="plan3"><div class="p3-l"><span class="p3-tag">เร็ว ๆ นี้</span><h2>อยากเห็นเรื่องนี้ในแผนทั้งร้าน</h2><p>แผนธุรกิจของ Jarua จะใช้ตัวเลขชุดนี้วางทางทั้งร้าน ทั้งการตลาด ทีม และเงิน 12 เดือน</p></div>' +
      '<button class="btn ghost block" data-act="plan">ดูแผนธุรกิจ</button></section>';
  }
  /* ดูละเอียด: แท็บ เงินในมือ 12 เดือน | กำไรเปลี่ยนเพราะอะไร */
  var RTABS = [['cash', 'เงินในมือ 12 เดือน'], ['wf', 'กำไรเปลี่ยนเพราะอะไร']];
  function detailsHtml(R) {
    var tabs = RTABS.filter(function (x) { return x[0] !== 'wf' || R.ledger.length; });
    var cur = tabs.some(function (x) { return x[0] === state.rtab; }) ? state.rtab : 'cash';
    return '<section class="det3" id="det3"><h2 class="sec3">ดูละเอียด</h2>' + (tabs.length > 1 ? '<div class="seg tabs3" role="tablist" aria-label="ดูละเอียด">' + tabs.map(function (x) {
      var on = x[0] === cur;
      return '<button type="button" role="tab" id="tab-' + x[0] + '" data-act="rtab" data-v="' + x[0] + '" aria-selected="' + on + '" aria-pressed="' + on + '" aria-controls="detp" tabindex="' + (on ? 0 : -1) + '">' + x[1] + '</button>';
    }).join('') + '</div>' : '') +
      '<div id="detp"' + (tabs.length > 1 ? ' role="tabpanel" aria-labelledby="tab-' + cur + '"' : '') + '>' + (cur === 'wf' ? waterfallHtml(R) : cashCard(R)) + '</div></section>';
  }
  function restHtml(R) {
    var out = '';
    if (R.warn.length) out += '<div class="warns" role="note">' + R.warn.map(function (w) { return '<p>' + ICON.info + '<span>' + esc(w) + '</span></p>'; }).join('') + '</div>';
    out += '<section class="checks"><h2 class="sec3">สิ่งที่ต้องเป็นจริง ถึงจะคุ้ม</h2><ul class="cklist">' + R.conds.map(checkHtml).join('') + '</ul></section>';
    out += detailsHtml(R);
    out += nextCard() + planCard();
    out += '<button class="btn ghost block other3" data-act="to-start">ลองเรื่องอื่น กับตัวเลขร้านเดิม' + ICON.next + '</button>';
    out += '<details class="about"><summary>ตัวเลขชุดนี้คิดอย่างไร' + ICON.down + '</summary><ul>' +
      '<li>ทุกตัวเลขต่อเดือนคำนวณด้วยสูตรชุดเดียวกับแผนธุรกิจของ Jarua และเทียบกับร้านคุณตอนนี้ที่ใช้สูตรเดียวกัน</li>' +
      '<li>ทุกตัวเลขมาจากที่คุณกรอก ไม่ได้เทียบกับร้านอื่น และไม่ได้ตัดสินใจแทนคุณ</li><li>กำไรเป็นกำไรก่อนหักภาษี</li>' +
      (R.one > 0 ? '<li>เงินก้อน ' + fmtN(R.one) + ' บาท จ่ายด้วยเงินสดตอนเริ่ม · คืนทุนนับจากเงินที่ได้เพิ่มจริงในแต่ละเดือน เทียบกับไม่ทำ (หลังเดือนที่ 12 ใช้ตัวเลขปีที่ 2 และ 3)</li>' : '') +
      (R.k > 0 ? '<li>' + salesWord(state.model) + 'ที่คาด ค่อย ๆ ขึ้นเท่ากันทุกเดือน และถึงที่คาดในเดือนที่ ' + (R.k + 1) + '</li>' : '') +
      (Math.abs(R.wc) >= 1 ? '<li>เงินในมือหักเงินที่ต้องจมเพิ่มกับลูกค้าที่ยังไม่จ่ายและของในสต็อก (หรือบวกเงินที่ได้คืน) ในเดือนที่ยอดเปลี่ยน</li>' : '') +
      (state.topic === 'promo' ? '<li>ช่วงจัดโปรใช้ราคาและยอดของช่วงโปร หลังจบโปรใช้ยอดหลังจบโปร · กำไรรวม 12 เดือนหักค่าจัดโปรแล้ว</li>' : '') +
      (state.topic === 'equip' ? '<li>กำไรหักเงินที่ควรกันไว้ซื้อเครื่องใหม่เมื่อหมดอายุ (ราคา ÷ เดือนที่ใช้ได้) แต่เงินสดไม่หัก เพราะจ่ายไปแล้วตอนซื้อ</li>' : '') +
      '<li>' + (n0(state.inp.growth) ? 'ยอดขายของร้านเปลี่ยนเดือนละ ' + fmtPct(n0(state.inp.growth)) + ' ตามที่กรอก' : 'ยอดขายของร้านเท่าเดิมทุกเดือน') + ' · ค่าใช้จ่ายคงที่เท่าเดิมตลอด 12 เดือน</li></ul></details>';
    return out;
  }
  function resultFoot() {
    return '<div class="foot rfoot" id="foot"><div class="wrap"><button class="btn ghost fb-edit" data-act="lab">' + ICON.sliders + 'ปรับตัวเลข</button>' + readyBtn() + '</div></div>';
  }
  function viewResult() {
    var head = bar('<button class="tb" data-act="to-start" aria-label="กลับไปเลือกเรื่อง">' + ICON.back + 'เลือกเรื่อง</button>', TOPICS[state.topic].title, 'ผล');
    var R = E(viewD());
    if (!R.ok) return head + '<main class="screen"><div class="wrap"><div class="ok-box"><b>ตัวเลขยังไม่ครบ</b><p>กด "ปรับตัวเลข" เพื่อกรอกให้ครบ</p></div></div></main>' +
      '<div class="foot" id="foot"><div class="wrap"><button class="btn" data-act="lab">' + ICON.sliders + 'ปรับตัวเลข</button></div></div>';
    var P = piv(), v = wiVal() !== null ? wiVal() : P.have;
    var out = head + '<main class="screen res3"><div class="wrap">';
    if (state.isSample) out += '<div class="banner"><span>นี่คือ' + esc(sampleName()) + '</span><button class="lnk" data-act="to-shop">ใส่ตัวเลขร้านคุณ</button></div>';
    out += '<section class="hero3" id="hero">' + heroHtml(R, P, (P.have > 0 || wiVal() !== null || P.showHave) ? v : null) + '</section>';
    out += '<section class="lanes" id="lanes" aria-label="เทียบ ไม่ทำ กับ ทำ">' + lanesHtml(R) + '</section>';
    out += pivotCard(R, P);
    out += '<div id="rest">' + restHtml(R) + '</div>';
    return out + '</div></main>' + resultFoot();
  }
  /* อัปเดตหน้าผลระหว่างลากแถบ (ไม่วาดแถบใหม่ เพื่อให้ลากต่อได้) */
  var wiRaf = 0;
  function resultLive() {
    if (wiRaf) return;
    wiRaf = requestAnimationFrame(function () {
      wiRaf = 0;
      var R = E(viewD()), P = piv(), v = wiVal() !== null ? wiVal() : P.have;
      if (!R.ok) return;
      var main = $('main.res3'); if (main) main.classList.add('live');
      var h = $('#hero'); if (h) { h.innerHTML = heroHtml(R, P, v); runAnim(h); }
      var l = $('#lanes'); if (l) l.innerHTML = lanesHtml(R);
      var pr = $('#pvread'); if (pr) { pr.innerHTML = pvRead(R, P, v); announce([].map.call(pr.children, function (c) { return c.textContent; }).join(' · ')); }
      var rs = $('#rest'); if (rs) { rs.innerHTML = restHtml(R); runAnim(rs); }
      var inp = $('#pvr'); if (inp) inp.setAttribute('aria-valuetext', pivotWord(P, v));
      $$('.pv-chips .sc').forEach(function (b) { b.setAttribute('aria-pressed', String(Math.abs(+b.getAttribute('data-v') - v) < 1e-6)); });
      save();
    });
  }

  /* ============================================================ ASK / POINTS */
  function viewAsk() {
    var L = askList();
    if (!L.length) return viewPoints();
    var i = Math.max(0, Math.min(state.qidx, L.length - 1));
    var id = L[i], q = QB3[id], a = ans()[id];
    return bar(backBtn('result', 'กลับ'), 'เช็กความพร้อม', 'ข้อ ' + (i + 1) + ' จาก ' + L.length) +
      '<main class="screen"><div class="wrap"><div class="prog">' + L.map(function (x, j) { return '<i class="' + (ans()[x] || j <= i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<div class="ask-why"><span>เพราะคุณกำลังคิดเรื่อง</span><b>' + esc(TOPICS[state.topic].title) + '</b></div>' +
      '<h1 class="ask-q">' + esc(q.q(state.inp, state.model, dec())) + '</h1>' +
      '<div class="ask-ans">' + [['yes', 'ใช่'], ['no', 'ไม่ใช่'], ['unsure', 'ไม่แน่ใจ']].map(function (o) {
        return '<button data-act="answer" data-q="' + id + '" data-v="' + o[0] + '" aria-pressed="' + (a === o[0]) + '">' + o[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="qnav">' + (i > 0 ? '<button class="lnk" data-act="q-prev">ข้อก่อนหน้า</button>' : '<span></span>') +
      (askedCount() ? '<button class="lnk" data-act="points">ดูผลเลย</button>' : '') + '</div>' +
      '<h2 class="sec3 ak-h">ทุกข้อในเรื่องนี้</h2><ol class="ak-list">' + L.map(function (x, j) {
        var av = ans()[x], cls = j === i ? 'now' : av === 'yes' ? 'yes' : av === 'no' ? 'no' : av === 'unsure' ? 'uns' : 'todo';
        var ic = cls === 'yes' ? ICON.mark : cls === 'no' ? ICON.ok : cls === 'uns' ? ICON.q : '<span>' + (j + 1) + '</span>';
        var aw = j === i ? 'ข้อนี้' : av === 'yes' ? 'ใช่ · ควรเช็ก' : av === 'no' ? 'ไม่ใช่' : av === 'unsure' ? 'ไม่แน่ใจ · ควรเช็ก' : 'ยังไม่ตอบ';
        return '<li><button class="ak ' + cls + '" data-act="q-go" data-i="' + j + '"' + (j === i ? ' aria-current="step"' : '') + '><span class="ak-i" aria-hidden="true">' + ic + '</span>' +
          '<span class="ak-t">' + esc(QB3[x].p) + '</span><span class="ak-a">' + aw + '</span></button></li>';
      }).join('') + '</ol></div></main>';
  }
  function pointTag(id, R) {
    var lv = QB3[id].lever;
    if (!lv || !R.ok) return '';
    var cs = R.conds.filter(function (x) { return x.lever === lv && x.value !== null; }).slice(0, 2);
    return cs.map(function (c) { return tw(c.label) + ' <b>' + esc(c.payback ? payIn(c.value) : nf(c.value, c.unit)) + '</b>'; }).join('<br>');
  }
  function viewPoints() {
    var R = E(dec()), L = askList(), Pn = pointsList(), seen = {}, A = ans();
    var out = bar(backBtn('result', 'กลับ'), 'จุดที่ควรเช็ก', TOPICS[state.topic].title) + '<main class="screen"><div class="wrap">';
    var nNo = L.filter(function (x) { return A[x] === 'no'; }).length;
    out += '<section class="pp3"><div class="pp-k">เช็กความพร้อม · ตอบแล้ว ' + askedCount() + ' จาก ' + L.length + ' ข้อ</div><h1 class="pp-t">' + (Pn.length ? 'เจอ ' + Pn.length + ' จุดที่ควรเช็ก' : 'ยังไม่เจอจุดที่ควรเช็กจากคำตอบ') + '</h1>' +
      '<p class="pp-s">' + (Pn.length ? 'แต่ละจุดบอกว่าเกี่ยวกับตัวเลขไหน และเครื่องมือไหนช่วยหาแนวทางได้' + (nNo ? ' · อีก ' + nNo + ' ข้อที่ตอบว่าไม่ใช่ ไม่ได้แสดงตรงนี้' : '') : 'ถ้าอยากคิดเรื่องนี้ให้ละเอียดขึ้น เครื่องมือด้านล่างช่วยได้') + '</p>' +
      (L.length ? '<button class="btn ghost" data-act="ask-restart">แก้คำตอบ</button>' : '') + '</section>';
    if (Pn.length) {
      out += '<div class="points pts3">' + Pn.map(function (id) {
        var q = QB3[id], tag = pointTag(id, R), lk = q.lever && labKeys().indexOf(q.lever) >= 0 ? q.lever : null;
        var fresh = q.tools.filter(function (c) { return !seen[c]; });
        return '<div class="point pt3"><span class="pt-i ' + (A[id] === 'unsure' ? 'uns' : 'yes') + '" aria-hidden="true">' + (A[id] === 'unsure' ? ICON.q : ICON.mark) + '</span><div class="pt-b">' +
          '<h2 class="pt">' + esc(q.p) + '<span class="sr"> · ' + (A[id] === 'unsure' ? 'ตอบว่าไม่แน่ใจ' : 'ตอบว่าใช่') + '</span>' + (A[id] === 'unsure' ? '<span class="unsure" aria-hidden="true">ไม่แน่ใจ</span>' : '') + '</h2><div class="pd">' + esc(q.d) + '</div>' +
          (tag ? '<div class="ptag">' + tag + '</div>' : '') +
          (fresh.length ? toolsHtml(fresh, 'เครื่องมือที่ช่วยหาแนวทางแก้ไข', seen) : '<div class="tools"><span class="tl">ใช้เครื่องมือเดียวกับด้านบน</span></div>') +
          (lk ? '<button class="sbtn light" data-act="lab" data-k="' + lk + '">' + ICON.sliders + 'ปรับตัวเลขนี้</button>' : '') + '</div></div>';
      }).join('') + '</div>';
    } else {
      out += '<div class="block">' + toolsHtml(TOPIC_TOOLS[state.topic], 'เครื่องมือที่ช่วยคิดเรื่องนี้', seen) + '</div>';
    }
    out += planCard();
    out += '<div class="end3"><button class="btn ghost block" data-act="result">' + ICON.back + 'กลับไปดูผล</button><button class="btn ghost block" data-act="to-start">ลองเรื่องอื่น' + ICON.next + '</button></div>';
    return out + '</div></main>';
  }

  /* ============================================================ LAB (ปรับตัวเลขของเรื่องนี้ — เปลี่ยนแล้วใช้ทันที) */
  var LAB_KEYS = {
    hire: ['gain', 'salary', 'count', 'partRate', 'partHours', 'partDays', 'pieceRate', 'pieceShare', 'capAdd'],
    price: ['lostPct', 'raiseBy', 'raiseShare'], promo: ['lift', 'discPct', 'usePct', 'giftCost', 'afterPct', 'promoCost'],
    newprod: ['npQty', 'npAttach', 'npPrice', 'npCost', 'npCanni', 'npFixed', 'npSetup'], freeship: ['shipLift', 'shipOrders', 'shipCost', 'shipShare', 'perOrder'],
    ads: ['adGain', 'adBudget', 'adMgmt', 'adSetup'], supplier: ['supSales', 'newCost', 'supStock', 'supCredit', 'switchCost'], freelance: ['flGain', 'flFee', 'flPct', 'hours'],
    place: ['salesPct', 'newRent', 'moveCost', 'closedDays', 'dipPct'],
    channel: ['chQty', 'cut', 'chPrice', 'movePct', 'extraCost', 'chFee'],
    equip: ['eqGain', 'price', 'life', 'costDown', 'fixedChg', 'eqCap'],
    branch: ['bPct', 'setup', 'bRent', 'bStaff', 'bSalary', 'bOther']
  };
  function labKeys() {
    var d = dec();
    return (LAB_KEYS[state.topic] || []).filter(function (k) { return dShown(k, d) || k === 'bSalary' && n0(d.bStaff) > 0; });
  }
  function curVal(k, d) {
    var v = num(d[k]);
    if (v !== null) return v;
    if (k === 'chPrice') return n0(state.inp[ROLE[state.model].price]);
    if (k === 'count') return 1;
    return 0;
  }
  function lStep(k, v) {
    var f = dDef(k), a = Math.abs(v);
    if (f.t === 'count' || k === 'bStaff' || k === 'closedDays' || k === 'life') return 1;
    if (k === 'salesPct' || k === 'bPct') return 5;
    if (f.t === 'pct' || k === 'supSales' || k === 'lift' || k === 'shipLift' || k === 'afterPct' || k === 'partDays') return 1;
    if (k === 'partHours' || k === 'perOrder') return 0.5;
    if (k === 'gain' || k === 'eqGain' || k === 'chQty' || k === 'capAdd' || k === 'eqCap' || k === 'adGain' || k === 'flGain' || k === 'npQty') {
      if (state.model === 'rental') return 1;
      if (isVolModel(state.model) && state.inp.volumePer !== 'month') return a >= 50 ? niceStep(a * 0.05) : 1;
      return Math.max(state.model === 'commission' || state.model === 'project' ? 0.5 : 1, niceStep(a * 0.05));
    }
    if (['chPrice', 'extraCost', 'costDown', 'raiseBy', 'newCost', 'giftCost', 'shipCost', 'npPrice', 'npCost', 'pieceRate', 'partRate'].indexOf(k) >= 0) return a < 20 ? 0.5 : a < 100 ? 1 : niceStep(a * 0.01);
    if (k === 'fixedChg' || k === 'chFee') return 100;
    if (['salary', 'bSalary', 'newRent', 'bRent', 'bOther', 'flFee', 'adBudget', 'adMgmt', 'npFixed', 'promoCost', 'adSetup', 'npSetup', 'switchCost'].indexOf(k) >= 0) return a >= 10000 ? 500 : 100;
    return Math.max(1000, niceStep(a * 0.02));
  }
  function lRange(k, v0, st) {
    var f = dDef(k), lo = 0, hi;
    if (k === 'salesPct' || k === 'supSales') { lo = -80; hi = Math.max(100, v0 + 50); }
    else if (k === 'lostPct') hi = 95;
    else if (k === 'lift' || k === 'shipLift' || k === 'afterPct') hi = Math.max(100, v0 * 2);
    else if (k === 'partHours') hi = 24;
    else if (k === 'partDays') hi = 31;
    else if (k === 'perOrder') { lo = 1; hi = Math.max(5, v0 * 2); }
    else if (k === 'npPrice') { lo = st; hi = Math.max(v0 * 2.5, st * 20); }
    else if (k === 'bPct') hi = Math.max(150, v0 + 50);
    else if (k === 'cut') hi = Math.max(50, v0 + 20);
    else if (k === 'movePct' || k === 'dipPct') hi = 100;
    else if (k === 'count') { lo = 1; hi = Math.max(5, v0 * 2); }
    else if (k === 'bStaff') hi = Math.max(6, v0 * 2);
    else if (k === 'closedDays') hi = dMax('closedDays') || 30;
    else if (k === 'life') { lo = 1; hi = Math.max(15, v0 * 2); }
    else if (k === 'fixedChg') { lo = -Math.floor(fixedTotal(state.inp) / st) * st; hi = Math.max(5000, Math.abs(v0) * 3); }
    else if (k === 'chPrice') { lo = Math.floor(v0 * 0.5 / st) * st; hi = Math.ceil(v0 * 2 / st) * st; }
    else if (k === 'gain' || k === 'eqGain' || k === 'chQty' || k === 'adGain' || k === 'flGain' || k === 'npQty') hi = Math.max(v0 * 3, phGain(state.inp, state.model) * 4, st * 10);
    else hi = Math.max(v0 * 2.5, st * 20);
    var mx = dMax(k); if (mx !== null) hi = Math.min(hi, mx);
    hi = Math.ceil(hi / st) * st;
    return [lo, Math.max(hi, lo + st)];
  }
  function lUnit(k) { var f = dDef(k); return f.suf ? f.suf(state.inp, state.model, dec()) : (f.t === 'pct' ? '%' : 'บาท'); }
  function lName(k) { var f = dDef(k); return f.t === 'signed' ? f.label(state.inp, state.model, dec()) + ' (' + f.words[0] + ' + / ' + f.words[1] + ' −)' : f.label(state.inp, state.model, dec()); }
  function lInsight(k) {
    var R = E(dec());
    if (!R.ok) return '';
    var cs = R.conds.filter(function (x) { return x.lever === k; }).slice(0, 1);
    if (k === piv().key || k === 'salary' || k === 'count' || k === 'partRate' || k === 'flFee' || k === 'adBudget' || k === 'raiseBy' || k === 'discPct' || k === 'shipCost' || k === 'newCost')
      cs = R.conds.filter(function (x) { return x.id === 'need' || x.id === 'payneed'; });
    if (!cs.length) return R.one > 0 && (k === 'price' || k === 'setup' || k === 'moveCost') ? 'คืนทุน <b>' + payIn(R.payback) + '</b>' : '';
    return cs.map(function (c) {
      if (c.value === null) return tw(c.label) + ' · <b>' + esc(c.payback ? payIn(null) : c.txt || '') + '</b>';
      return tw(c.label) + ' <b>' + esc(c.payback ? payIn(c.value) : nf(c.value, c.unit)) + '</b>';
    }).join('<br>');
  }
  function labPanel() {
    var Rr = E(dec());
    if (!Rr.ok) return '<section class="panel lab-panel"><div class="k">ตัวเลขยังไม่ครบ</div></section>';
    var d = Rr.delta;
    var s3 = Rr.need > 0.5 ? [Rr.B.hasCash ? 'เงินขาดมือ' : 'ต้องมีเงิน', fmtCompact(Rr.need)] : ['เงินต่ำสุด', fmtCompact(Rr.low)];
    var s2 = Rr.one > 0 ? ['คืนทุน', Rr.payback === null ? 'ไม่ได้' : fmtMonths(Rr.payback)] : [Rr.sumDiff < -0.5 ? 'กำไรลดใน 1 ปี' : 'กำไรเพิ่มใน 1 ปี', fmtCompact(Math.abs(Rr.sumDiff))];
    var c = Rr.conds.filter(function (x) { return x.id === 'need'; })[0];
    var s1n = Rr.P && Rr.P.target ? 'กำไรเท่าเดิมที่' : 'จุดคุ้ม';
    var s1 = c && c.value !== null ? [s1n, nf(c.value, c.unit.charAt(0) === '%' ? '%' : '') + ' <small>' + esc(c.unit.charAt(0) === '%' ? c.unit.slice(1).trim() : c.unit) + '</small>'] : [s1n, '–'];
    return '<section class="lab3"><div class="dstrip"><div class="ds-a"><small>ไม่ทำ · กำไร/เดือน</small><b>' + plain(Rr.B.profit) + '</b></div>' +
      '<div class="ds-b"><small>ทำ · กำไร/เดือน</small><b>' + (Rr.profit < 0 ? '−' : '') + anim('lp', Rr.profit) + '</b><i>' + (Math.abs(d) < 0.5 ? 'เท่าเดิม' : dirSpan(d, fmtN(Math.abs(d)))) + '</i></div></div>' +
      '<div class="l3s">' + [s1, s2, s3].map(function (s) { return '<div><small>' + s[0] + '</small><b>' + s[1] + '</b></div>'; }).join('') + '</div></section>';
  }
  function fmtInputNum(v) {
    if (v === null || v === undefined) return '';
    var r = Math.round(v * 100) / 100;
    return Math.abs(r) >= 1000 ? Math.round(r).toLocaleString('th-TH') : String(r);
  }
  function wasTxt(k) {
    if (!state.labOrig) return '';
    var bv = curVal(k, state.labOrig), tv = curVal(k, dec());
    if (Math.abs(bv - tv) < 1e-9) return '';
    var pc = lUnit(k).charAt(0) === '%';
    return 'เดิม ' + fmtN(bv, 2) + (pc ? '%' : '') + ' · <span class="' + (tv > bv ? 'up' : 'down') + '">' + fmtN(Math.abs(tv - bv), 2) + (pc ? '%' : '') + '</span>';
  }
  function lrowHtml(k) {
    var orig = state.labOrig || dec(), bv = curVal(k, orig), tv = curVal(k, dec()), st = lStep(k, bv), rng = lRange(k, bv, st);
    var lo = Math.min(rng[0], tv), hi = Math.max(rng[1], tv);
    var op = hi > lo ? (bv - lo) / (hi - lo) : 0;
    var chg = Math.abs(bv - tv) > 1e-9;
    var ins = state.active === k ? lInsight(k) : '';
    var val = fmtInputNum(tv), name = lName(k);
    return '<div class="lrow' + (chg ? ' changed' : '') + '" data-row="' + k + '"><div class="lr-top"><span class="lr-name">' + esc(name) + '</span>' +
      '<span class="lr-val"><input data-lv="' + k + '" inputmode="decimal" size="' + Math.max(2, val.length) + '" value="' + esc(val) + '" aria-label="' + esc(name) + '"><span class="u">' + esc(lUnit(k)) + '</span></span></div>' +
      '<div class="lr-was">' + wasTxt(k) + '</div><div class="lr-ctl"><button class="stp" data-act="step" data-k="' + k + '" data-dir="-1" aria-label="ลด">−</button>' +
      '<div class="sl"><span class="orig" style="left:calc(14px + (100% - 28px) * ' + op.toFixed(4) + ')"></span><input type="range" data-range="' + k + '" min="' + lo + '" max="' + hi + '" step="' + st + '" value="' + tv + '" aria-label="ปรับ ' + esc(name) + '"></div>' +
      '<button class="stp" data-act="step" data-k="' + k + '" data-dir="1" aria-label="เพิ่ม">+</button></div>' +
      (ins ? '<div class="lr-ins">' + ins + '</div>' : '') + '</div>';
  }
  function labChanged() { var o = state.labOrig; return !!o && JSON.stringify(o) !== JSON.stringify(dec()); }
  /* คำตอบของเรื่องที่ไม่มีแถบเลื่อน (เช่น แบบที่เลือก ยอดค่อย ๆ ขึ้นกี่เดือน) แตะเพื่อตอบใหม่ข้อนั้น */
  function otherAnswerRows() {
    var keys = labKeys(), d = dec();
    var rows = dStepsFor(state.topic, state.inp, state.model).map(function (st, i) {
      var rest = st.f.filter(function (k) { return keys.indexOf(k) < 0 && dShown(k, d); });
      if (!rest.length) return '';
      var t = rest.indexOf('kind') >= 0 ? 'แบบที่เลือก' : st.q;
      return '<button class="rv-row" data-act="d-edit" data-i="' + i + '"><span class="t">' + esc(t) + '</span><span class="v">' + esc(dStepSummary(st)) + '</span>' + ICON.chev + '</button>';
    }).join('');
    return rows ? '<div class="rv">' + rows + '</div>' : '';
  }
  /* หน้าปรับตัวเลข: ที่เดียวสำหรับแก้ทุกตัวเลข — ตัวเลขของเรื่องนี้ (เลื่อน/พิมพ์ ใช้ทันที) + คำตอบอื่น + ตัวเลขร้าน */
  function viewLab() {
    var right = labChanged() ? '<button class="tb" data-act="lab-undo">' + ICON.undo + 'คืนค่าเดิม</button>' : '';
    return bar('<button class="tb" data-act="result" aria-label="กลับไปดูผล">' + ICON.back + 'ผล</button>', 'ปรับตัวเลข', TOPICS[state.topic].title, right) +
      '<main class="screen"><h1 class="sr">ปรับตัวเลข ' + esc(TOPICS[state.topic].title) + '</h1><div class="lab-top"><div class="wrap" id="labp">' + labPanel() + '</div></div><div class="wrap">' +
      (state.isSample ? '<div class="banner lab-bn"><span>กำลังใช้ตัวเลข' + esc(sampleName()) + '</span><button class="lnk" data-act="to-shop">ใส่ร้านคุณ</button></div>' : '') +
      '<div class="sec-h"><h2>ตัวเลขของเรื่องนี้</h2></div><p class="lab-note">เลื่อนหรือพิมพ์ ผลด้านบนเปลี่ยนทันที</p>' +
      '<div class="lgroup"><div class="lrows">' + labKeys().map(lrowHtml).join('') + '</div></div>' + otherAnswerRows() +
      (state.isSample ? '' : '<div class="sec-h"><h2>ตัวเลขร้าน</h2><span class="aside">' + esc(MODELS[state.model].tile) + '</span></div>' + shopRows()) +
      '</div></main>';
  }
  var labRaf = 0;
  function labUpdate(k, fromSlider) {
    if (!labRaf) labRaf = requestAnimationFrame(function () { labRaf = 0; var p = $('#labp'); if (p) { p.innerHTML = labPanel(); runAnim(p); } });
    var Rl = E(dec()); if (Rl.ok) announce(deltaWords(Rl.delta) + (Rl.one > 0 ? ' · คืนทุน' + payIn(Rl.payback) : ''));
    var row = $('.lrow[data-row="' + k + '"]');
    if (row) {
      var tv = curVal(k, dec());
      row.classList.toggle('changed', !!state.labOrig && Math.abs(curVal(k, state.labOrig) - tv) > 1e-9);
      var inp = $('input[data-lv]', row);
      if (inp && document.activeElement !== inp) { inp.value = fmtInputNum(tv); inp.size = Math.max(2, inp.value.length); }
      if (!fromSlider) { var r = $('input[type="range"]', row); if (r) { if (tv > +r.max) r.max = tv; if (tv < +r.min) r.min = tv; r.value = tv; } }
      $('.lr-was', row).innerHTML = wasTxt(k);
      var h = lInsight(k), box = $('.lr-ins', row);
      if (h && !box) row.insertAdjacentHTML('beforeend', '<div class="lr-ins">' + h + '</div>');
      else if (box) { if (h) box.innerHTML = h; else box.remove(); }
    }
    var bt = $('.bar .tb[data-act="lab-undo"]');
    if (labChanged() && !bt) { var thb = $('.bar [data-act="theme"]'); thb.insertAdjacentHTML('beforebegin', '<button class="tb" data-act="lab-undo">' + ICON.undo + 'คืนค่าเดิม</button>'); }
    if (!labChanged() && bt) bt.remove();
    save();
  }
  function setActive(k) {
    if (state.active === k) return;
    var prev = state.active; state.active = k;
    if (prev) { var pr = $('.lrow[data-row="' + prev + '"] .lr-ins'); if (pr) pr.remove(); }
    var row = $('.lrow[data-row="' + k + '"]');
    if (row && !$('.lr-ins', row)) { var h = lInsight(k); if (h) row.insertAdjacentHTML('beforeend', '<div class="lr-ins">' + h + '</div>'); }
  }
  /* เปลี่ยนตัวเลขของการตัดสินใจ (ใช้ทันที) */
  function setDec(k, v) {
    var f = dDef(k);
    v = Math.round(v * 1e6) / 1e6;
    if (f.t === 'count' || f.t === 'int') v = Math.round(v);
    if (k === 'count') v = Math.max(1, v);
    if (k === 'npPrice') v = Math.max(0.5, v);
    if (f.min !== undefined) v = Math.max(f.min, v);
    if (k === 'fixedChg') v = Math.max(-fixedTotal(state.inp), v);
    else if (k !== 'salesPct' && k !== 'supSales' && v < 0) v = 0;
    var mx = dMax(k); if (mx !== null) v = Math.min(mx, v);
    dec()[k] = v;
    if (k === piv().key) delete state.wi[state.topic];
  }

  /* ============================================================ RENDER + การนำทาง (ปุ่มย้อนกลับของมือถือใช้ได้) */
  function render() {
    var v = state.view;
    if (['dq', 'result', 'lab', 'ask', 'points'].indexOf(v) >= 0 && (!state.topic || !shopOk())) v = state.view = state.model ? 'review' : 'start';
    if (['result', 'lab', 'ask', 'points'].indexOf(v) >= 0 && !dAllValid()) { v = state.view = 'dq'; }
    if ((v === 'review' || v === 'wizard') && !state.model) v = state.view = 'start';
    app.innerHTML = v === 'start' ? viewStart() : v === 'shop' ? viewShop() : v === 'wizard' ? viewWizard() : v === 'dq' ? viewDq() : v === 'review' ? viewReview()
      : v === 'lab' ? viewLab() : v === 'ask' ? viewAsk() : v === 'points' ? viewPoints() : viewResult();
    runAnim(app);
    var foot = $('#foot');
    document.documentElement.style.setProperty('--foot-h', (foot ? foot.offsetHeight : 0) + 'px');
    save();
  }
  function hpush(v) { try { history.pushState({ v: v, t: state.topic }, ''); } catch (e) { /* ignore */ } }
  function go(view, top) {
    var same = state.view === view && top === false;
    if (state.view !== view && top !== false) hpush(view);
    state.view = view; render();
    if (same) $$('.screen').forEach(function (el) { el.style.animation = 'none'; el.classList.add('still'); });
    if (top !== false) { window.scrollTo(0, 0); focusMain(); }
  }
  function focusMain() { var h = $('main h1') || $('main h2'); if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } } }
  function toast(msg) {
    var o = $('.toast'); if (o) o.remove();
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200);
  }
  function refreshWizardLive() {
    var r = $('#rstrip'); if (r) { r.outerHTML = wizReceipt(); runAnim($('#rstrip')); }
    var steps = stepsFor(state.model), st = steps[state.step];
    var nb = $('#foot [data-act="next"]'); if (nb) nb.disabled = !stepValid(st);
    var sb = $('#foot [data-act="shop-done"]'); if (sb) sb.disabled = !steps.every(stepValid);
    FIELDS.forEach(function (fd) { if (!fd.show) return; var node = $('.field[data-f="' + fd.k + '"]'); if (node) node.hidden = !fd.show(state.inp, state.model); });
  }
  function refreshDqLive() {
    var r = $('#dstrip'); if (r) { r.innerHTML = dStrip(); runAnim(r); }
    if (dAllValid()) { var Rd = E(dec()); if (Rd.ok) announce('ถ้าทำ ' + deltaWords(Rd.delta)); }
    var steps = dStepsFor(state.topic, state.inp, state.model), st = steps[state.dstep], d = dec();
    var nb = $('#foot [data-act="d-next"]'); if (nb) nb.disabled = !dStepValid(st);
    var sb = $('#foot [data-act="d-done"]'); if (sb) sb.disabled = !dAllValid();
    Object.keys(DFIELDS).forEach(function (k) {
      var node = $('.field[data-df="' + k + '"]'); if (!node) return;
      node.hidden = !dShown(k, d);
      var e = $('#err-' + k); if (e) { var m = dErr(k, d); e.textContent = m; e.hidden = !m; var ib = $('.inbox', node); if (ib) ib.classList.toggle('bad', !!m); }
      $$('[data-act="dquick"][data-k="' + k + '"]', node).forEach(function (b) {
        var f = dDef(k), q = f.quick[+b.getAttribute('data-i')], qv = q[1](state.inp, state.model), cv = num(dGet(d, k));
        b.setAttribute('aria-pressed', String(cv !== null && qv !== null && Math.abs(cv - qv) < 1e-9));
      });
    });
  }

  /* ============================================================ EVENTS */
  function chooseModel(m, sample, kind) {
    var M = MODELS[m];
    state.model = m;
    state.inp = sample ? JSON.parse(JSON.stringify(M.sample)) : {};
    state.sampleKind = sample ? (kind || (m === 'resell' ? 'online' : 'cafe')) : null;
    if (M.defPer && !state.inp.volumePer) state.inp.volumePer = M.defPer;
    if (M.units && !state.inp.unitLabel) state.inp.unitLabel = M.defUnit;
    if (m === 'subscription' && !state.inp.cycle) state.inp.cycle = 1;
    if (m === 'rental' && !state.inp.periodKind) state.inp.periodKind = 'night';
    state.isSample = !!sample; state.answers = {}; state.qidx = 0; state.active = null; state.step = 0; state.editing = false;
    state.ds = {}; state.wi = {}; state.dsign = {}; state.dstep = 0; state.dediting = false;
    state.feeHelp = false; state.fh = { share: '', rate: '' };
  }
  function openTopic(t) {
    if (!state.model) { state.topic = t; state.shopInFlow = true; go('shop'); return; }
    if (!topicOk(t, state.model)) { toast('เรื่องนี้ยังไม่มีสำหรับร้านแบบ' + MODELS[state.model].tile); return; }
    state.topic = t; state.active = null; state.qidx = 0; state.dediting = false; state.labOrig = null;
    if (!state.ds[t]) state.ds[t] = Object.assign({}, state.isSample && state.sampleKind && SAMPLES[state.sampleKind].m === state.model ? sampleDec(state.sampleKind, t) : DEC_DEFAULT[t]);
    state.shopInFlow = !shopOk();
    if (!shopOk()) { state.step = 0; state.editing = false; go('wizard'); return; }
    if (dAllValid()) go('result');
    else { state.dstep = 0; state.dediting = false; go('dq'); }
  }
  function scrollToRow(k) {
    var row = $('.lrow[data-row="' + k + '"]');
    if (!row) return;
    var top = $('.lab-top');
    var y = row.getBoundingClientRect().top + window.scrollY - (top ? top.offsetHeight : 0) - 70;
    window.scrollTo(0, Math.max(0, y));
  }
  function onClick(e) {
    var t = e.target.closest('[data-act]');
    if (!t || t.disabled) return;
    var a = t.getAttribute('data-act'), m = state.model, steps;
    switch (a) {
      case 'theme': {
        var nt = themeNow() === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nt);
        try { localStorage.setItem('lab-theme', nt); } catch (er) { /* ignore */ }
        t.innerHTML = nt === 'dark' ? ICON.sun : ICON.moon; break;
      }
      case 'sample': {
        /* จากหน้าเริ่ม: ใช้ร้านตัวอย่างแล้วอยู่หน้าเดิมให้เลือกเรื่องเอง · จากหน้าเลือกรูปแบบร้าน (มีเรื่องอยู่แล้ว): เปิดผลของเรื่องนั้นกับร้านตัวอย่าง */
        var sk = sampleKindFor(state.view === 'shop' ? state.topic : null), tp = state.view === 'shop' && state.topic && topicOk(state.topic, SAMPLES[sk].m) ? state.topic : null;
        chooseModel(SAMPLES[sk].m, true, sk); state.topic = null; state.shopInFlow = false;
        if (tp) { openTopic(tp); break; }
        go('start', false);
        var sl = $('.shopline'); if (sl) { sl.setAttribute('tabindex', '-1'); sl.focus({ preventScroll: true }); }
        announce('กำลังใช้' + sampleName() + ' แตะเรื่องไหนก็ได้ จะเห็นผลทันที');
        break;
      }
      case 'topic': if (t.getAttribute('aria-disabled') === 'true') { toast('เรื่องนี้ยังไม่มีสำหรับร้านแบบ' + MODELS[state.model].tile); break; } openTopic(t.getAttribute('data-t')); break;
      case 'to-start': state.topic = null; state.labOrig = null; state.editing = false; state.dediting = false; go('start'); break;
      case 'to-shop': state.shopInFlow = !!state.topic; state.editing = false; go('shop'); break;
      case 'shop-edit': if (state.isSample) { state.topic = null; state.shopInFlow = false; go('shop'); } else { state.editFrom = 'review'; go('review'); } break;
      case 'rtab': {
        state.rtab = t.getAttribute('data-v');
        var Rt = E(viewD()), sec = $('#det3');
        if (Rt.ok && sec) { sec.outerHTML = detailsHtml(Rt); runAnim($('#det3')); var nb0 = $('#tab-' + state.rtab); if (nb0) nb0.focus(); }
        save(); break;
      }
      case 'model': {
        var nm = t.getAttribute('data-m');
        if (state.model === nm && !state.isSample && Object.keys(state.inp).length > 3) { state.step = 0; state.editing = false; go('wizard'); break; }
        chooseModel(nm, false); go('wizard'); break;
      }
      case 'next': steps = stepsFor(m); if (state.step < steps.length - 1) { state.step++; go('wizard'); } break;
      case 'prev':
        if (state.editing) { state.editing = false; go(state.editFrom === 'lab' && state.topic ? 'lab' : 'review'); }
        else if (state.step > 0) { state.step--; go('wizard'); }
        else go('shop');
        break;
      case 'shop-done': {
        if (!stepsFor(m).every(stepValid)) break;
        var wasEd = state.editing;
        state.editing = false;
        if (wasEd && state.editFrom === 'lab' && state.topic && topicOk(state.topic, m)) { if (dAllValid()) go('lab'); else { state.dstep = 0; state.dediting = false; go('dq'); } break; }
        if (wasEd) { go('review'); break; }
        if (!state.topic) { go('start'); break; }
        if (!topicOk(state.topic, m)) { toast('เรื่องนี้ยังไม่มีสำหรับร้านแบบ' + MODELS[m].tile); go('start'); break; }
        dec();
        if (dAllValid()) go('result');
        else { state.dstep = 0; state.dediting = false; go('dq'); }
        break;
      }
      case 'review': state.editFrom = 'review'; go('review'); break;
      case 'result': state.labOrig = null; state.dediting = false; go('result'); break;
      case 'edit-step': state.editFrom = state.view === 'lab' ? 'lab' : 'review'; state.step = +t.getAttribute('data-i'); state.editing = true; go('wizard'); break;
      case 'd-edit': state.dstep = +t.getAttribute('data-i'); state.dediting = true; go('dq'); break;
      case 'd-next': { steps = dStepsFor(state.topic, state.inp, m); if (state.dstep < steps.length - 1 && dStepValid(steps[state.dstep])) { state.dstep++; go('dq'); } break; }
      case 'd-prev':
        if (state.dediting) { if (dAllValid()) { state.dediting = false; go('lab'); } else toast('ตอบข้อนี้ให้ครบก่อน แล้วค่อยกลับ'); }
        else if (state.dstep > 0) { state.dstep--; go('dq'); }
        else if (state.shopInFlow && !state.isSample) { var ss = stepsFor(m); state.step = Math.max(0, ss.map(function (x) { return x.id; }).indexOf('cash')); state.editing = false; go('wizard'); }
        else { state.topic = null; go('start'); }
        break;
      case 'd-done':
        if (!dAllValid()) break;
        delete state.wi[state.topic];
        if (state.dediting) { state.dediting = false; go('lab'); } else go('result');
        break;
      case 'dcount': {
        var k0 = t.getAttribute('data-k'), f0 = dDef(k0), d0 = dec();
        d0[k0] = Math.max(f0.min || 1, Math.min(f0.max || 99, Math.round(n0(d0[k0]) || 1) + +t.getAttribute('data-dir')));
        go('dq', false); var bb = $('[data-act="dcount"][data-k="' + k0 + '"][data-dir="' + t.getAttribute('data-dir') + '"]'); if (bb && !bb.disabled) bb.focus();
        break;
      }
      case 'dpick': {
        var k1 = t.getAttribute('data-k');
        dec()[dKey(k1)] = +t.getAttribute('data-v');
        go('dq', false); var pb = $('[data-act="dpick"][data-k="' + k1 + '"][data-v="' + t.getAttribute('data-v') + '"]'); if (pb) pb.focus();
        break;
      }
      case 'dquick': {
        var kq = t.getAttribute('data-k'), fq = dDef(kq), qv = fq.quick[+t.getAttribute('data-i')][1](state.inp, m);
        if (qv !== null && qv !== undefined) dec()[dKey(kq)] = qv;
        go('dq', false); var qb = $('[data-act="dquick"][data-k="' + kq + '"][data-i="' + t.getAttribute('data-i') + '"]'); if (qb) qb.focus();
        break;
      }
      case 'dsign': {
        var ks = t.getAttribute('data-k'), sg = +t.getAttribute('data-v'), cvs = num(dec()[ks]);
        state.dsign[ks] = sg;
        if (cvs !== null) dec()[ks] = Math.abs(cvs) * sg;
        go('dq', false); var sb2 = $('[data-act="dsign"][data-k="' + ks + '"][data-v="' + sg + '"]'); if (sb2) sb2.focus();
        break;
      }
      case 'dkind': {
        var kv = t.getAttribute('data-v'), dk0 = dec();
        if (dk0.kind !== kv) { dk0.kind = kv; delete state.wi[state.topic]; }
        if (state.topic === 'channel') dk0.chName = kindName('channel', dk0, state.inp, m);
        go('dq', false); var kb = $('[data-act="dkind"][data-v="' + kv + '"]'); if (kb) kb.focus();
        break;
      }
      case 'where': {
        var wv = t.getAttribute('data-v'), first = !state.where;
        state.where = wv;
        /* ร้านตัวอย่างเปลี่ยนตามที่ขาย (ออนไลน์ = ร้านเสื้อผ้า · อื่น ๆ = ร้านกาแฟ) */
        if (state.isSample && state.sampleKind !== sampleKindFor(null)) { var nk = sampleKindFor(null); chooseModel(SAMPLES[nk].m, true, nk); }
        go('start', false);
        announce('เหลือ ' + TOPIC_ORDER.filter(function (x) { return whereOk(x, state.where); }).length + ' เรื่องที่เข้ากับร้านคุณ');
        var wb = $('[data-act="where"][data-v="' + wv + '"]'); if (wb) wb.focus({ preventScroll: true });
        if (first) { var ph = $('.where3'); if (ph && !reduced) ph.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        break;
      }
      case 'fee-help': state.feeHelp = true; go('wizard', false); var fs1 = $('#fh-share'); if (fs1) fs1.focus(); break;
      case 'per': {
        var nv = t.getAttribute('data-v'), cur = state.inp.volumePer || 'day';
        if (nv !== cur) {
          var days = pos(state.inp.daysOpen) || 26;
          ['volume', 'capacity'].forEach(function (k) { var v = num(state.inp[k]); if (v !== null) state.inp[k] = nv === 'month' ? Math.round(v * days) : Math.round(v / days * 10) / 10; });
          state.inp.volumePer = nv; go('wizard', false);
        }
        break;
      }
      case 'unit': state.inp.unitLabel = t.getAttribute('data-v'); go('wizard', false); break;
      case 'cycle': state.inp.cycle = +t.getAttribute('data-v'); go('wizard', false); break;
      case 'period': state.inp.periodKind = t.getAttribute('data-v'); go('wizard', false); break;
      case 'month': {
        var c = +t.getAttribute('data-c');
        var s = state.inp.season || { high: [], low: [], highPct: 30, lowPct: 30 };
        s = { high: (s.high || []).slice(), low: (s.low || []).slice(), highPct: s.highPct, lowPct: s.lowPct };
        var hi = s.high.indexOf(c), lo = s.low.indexOf(c);
        if (hi >= 0) { s.high.splice(hi, 1); s.low.push(c); } else if (lo >= 0) s.low.splice(lo, 1); else s.high.push(c);
        state.inp.season = s; go('wizard', false); break;
      }
      case 'wi': {
        state.wi[state.topic] = +t.getAttribute('data-v');
        var rg = $('#pvr'); if (rg) rg.value = state.wi[state.topic];
        resultLive(); break;
      }
      case 'lab': {
        var lk = t.getAttribute('data-k');
        if (lk && labKeys().indexOf(lk) < 0) lk = null;
        state.labOrig = JSON.parse(JSON.stringify(dec())); delete state.wi[state.topic];
        state.active = lk || null; go('lab'); if (lk) scrollToRow(lk);
        break;
      }
      case 'lab-undo': if (state.labOrig) { state.ds[state.topic] = JSON.parse(JSON.stringify(state.labOrig)); go('lab', false); } break;
      case 'step': {
        var k = t.getAttribute('data-k'), st = lStep(k, curVal(k, state.labOrig || dec()));
        var nvv = Math.round((curVal(k, dec()) + st * +t.getAttribute('data-dir')) / st) * st;
        setActive(k); setDec(k, nvv); labUpdate(k, false); break;
      }
      case 'ask': {
        var L0 = askList(), first = 0, A0 = ans();
        while (first < L0.length - 1 && A0[L0[first]]) first++;
        state.qidx = first; go('ask'); break;
      }
      case 'ask-restart': state.answers[state.topic] = {}; state.qidx = 0; go('ask'); break;
      case 'points': go('points'); break;
      case 'answer': {
        var q = t.getAttribute('data-q'), v = t.getAttribute('data-v');
        ans()[q] = v;
        $$('.ask-ans button').forEach(function (bb2) { bb2.setAttribute('aria-pressed', String(bb2 === t)); });
        setTimeout(function () {
          var L1 = askList(), A1 = ans(), i = L1.indexOf(q) + 1;
          while (i < L1.length && A1[L1[i]]) i++;
          if (i >= L1.length) { var un = L1.filter(function (x) { return !A1[x]; })[0]; if (un) { state.qidx = L1.indexOf(un); go('ask'); } else go('points'); }
          else { state.qidx = i; go('ask'); }
        }, reduced ? 0 : 200);
        break;
      }
      case 'q-prev': state.qidx = Math.max(0, state.qidx - 1); go('ask'); break;
      case 'q-go': state.qidx = +t.getAttribute('data-i') || 0; go('ask'); break;
      case 'tool': toast('ตัวอย่างนี้ยังไม่เชื่อมกับเครื่องมือจริง ในเว็บจริงจะเปิด "' + TOOLS[t.getAttribute('data-t')][0] + '" พร้อมตัวเลขร้านคุณ'); break;
      case 'plan': toast('แผนธุรกิจของ Jarua ยังไม่เปิดให้ใช้ เร็ว ๆ นี้จะใช้ตัวเลขชุดนี้ต่อได้'); break;
    }
  }

  function parseInput(el) {
    var raw = el.value.replace(/[,\s]/g, '').replace(/[−–]/g, '-').replace(/[^\d.\-]/g, '');
    if (!el.getAttribute('data-neg')) raw = raw.replace(/-/g, '');
    else raw = raw.replace(/(?!^)-/g, '');
    if (raw === '' || raw === '-' || raw === '.') return null;
    var v = parseFloat(raw);
    return isFinite(v) ? v : null;
  }
  function onInput(e) {
    var el = e.target;
    if (el.hasAttribute('data-k')) {
      state.inp[el.getAttribute('data-k')] = parseInput(el);
      refreshWizardLive(); save();
    } else if (el.hasAttribute('data-dk')) {
      var dk = el.getAttribute('data-dk'), f = dDef(dk), pv0 = parseInput(el);
      if (f.t === 'signed' && pv0 !== null) { var curS = num(dec()[dk]); var sg = curS !== null && curS !== 0 ? (curS < 0 ? -1 : 1) : (state.dsign[dk] || 1); pv0 = Math.abs(pv0) * sg; }
      dec()[dKey(dk)] = pv0;
      refreshDqLive(); save();
    } else if (el.hasAttribute('data-fh')) {
      state.fh[el.getAttribute('data-fh')] = el.value;
      var a = num(state.fh.share), b = num(state.fh.rate);
      if (a !== null && b !== null) { state.inp.feePct = Math.round(a * b) / 100; var fi = $('#f-feePct'); if (fi) fi.value = String(state.inp.feePct); }
      var fr = $('#fh-res'); if (fr) fr.innerHTML = feeHelpText();
      refreshWizardLive(); save();
    } else if (el.hasAttribute('data-season')) {
      var s = state.inp.season || { high: [], low: [], highPct: 30, lowPct: 30 };
      s[el.getAttribute('data-season')] = parseInput(el); state.inp.season = s; refreshWizardLive(); save();
    } else if (el.hasAttribute('data-unit-custom')) {
      var v = el.value.trim();
      if (v) { state.inp.unitLabel = v; $$('.chips .chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); }); }
      save();
    } else if (el.hasAttribute('data-pv')) {
      state.wi[state.topic] = +el.value;
      resultLive();
    } else if (el.hasAttribute('data-range')) {
      var k = el.getAttribute('data-range');
      setActive(k); setDec(k, +el.value); labUpdate(k, true);
    } else if (el.hasAttribute('data-lv')) {
      var k2 = el.getAttribute('data-lv'), pv = parseInput(el);
      el.size = Math.max(2, el.value.length);
      if (pv !== null) { setActive(k2); setDec(k2, pv); labUpdate(k2, false); }
    }
  }
  function onChange(e) {
    if (e.target.hasAttribute('data-unit-custom')) go('wizard', false);
    if (e.target.hasAttribute('data-pv')) { var main = $('main.res3'); if (main) main.classList.remove('live'); }
  }
  function onBlur(e) {
    var el = e.target;
    if (!el.hasAttribute) return;
    if (el.hasAttribute('data-k')) {
      var v = state.inp[el.getAttribute('data-k')];
      if (v !== null && v !== undefined) el.value = el.getAttribute('data-t') === 'money' ? Math.round(v).toLocaleString('th-TH') : String(v);
    } else if (el.hasAttribute('data-dk')) {
      var dk = el.getAttribute('data-dk'), dv = dec()[dKey(dk)];
      if (dv !== null && dv !== undefined) { var f = dDef(dk); dv = f.t === 'signed' ? Math.abs(dv) : dv; el.value = el.getAttribute('data-t') === 'money' || (f.t === 'signed' && dk === 'fixedChg') ? Math.round(dv).toLocaleString('th-TH') : String(dv); }
    } else if (el.hasAttribute('data-lv')) {
      el.value = fmtInputNum(curVal(el.getAttribute('data-lv'), dec()));
    }
  }
  function onKey(e) {
    /* แท็บดูละเอียด: ลูกศรซ้าย/ขวา สลับแท็บ */
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && e.target.getAttribute && e.target.getAttribute('role') === 'tab') {
      var tabs = $$('[role="tab"]', e.target.parentNode), ti = tabs.indexOf(e.target);
      var nx = tabs[(ti + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      if (nx && nx !== e.target) { e.preventDefault(); nx.click(); }
      return;
    }
    if (e.key !== 'Enter' || !e.target.hasAttribute) return;
    var isW = e.target.hasAttribute('data-k') && state.view === 'wizard', isD = e.target.hasAttribute('data-dk') && state.view === 'dq';
    if (isW || isD) {
      var ins = $$(isW ? '.qfields input[data-k]' : '.qfields input[data-dk]').filter(function (x) { return !x.closest('[hidden]'); });
      var i = ins.indexOf(e.target);
      if (i >= 0 && i < ins.length - 1) { ins[i + 1].focus(); e.preventDefault(); return; }
      var btn = isW ? ($('#foot [data-act="next"]:not([disabled])') || $('#foot [data-act="shop-done"]:not([disabled])')) : ($('#foot [data-act="d-next"]:not([disabled])') || $('#foot [data-act="d-done"]:not([disabled])'));
      if (btn) { e.preventDefault(); btn.click(); }
    }
    if (e.target.hasAttribute('data-lv')) e.target.blur();
  }
  /* tooltip ของกราฟเงินในมือ (ทำ / ไม่ทำ) */
  function onPointer(e) {
    var hit = e.target.closest && e.target.closest('.chart .hit');
    var chart = e.target.closest && e.target.closest('.chart');
    $$('.tip').forEach(function (x) { if (!chart || !chart.contains(x)) x.remove(); });
    $$('.chart .cross').forEach(function (c) { if (!chart || !chart.contains(c)) c.setAttribute('visibility', 'hidden'); });
    if (!hit) { if (chart) { var tp = $('.tip', chart); if (tp) tp.remove(); var cr = $('.cross', chart); if (cr) cr.setAttribute('visibility', 'hidden'); } return; }
    var i = +hit.getAttribute('data-i'), R = E(viewD());
    if (!R.ok) return;
    var va = i === 0 ? R.aStart : R.rows[i - 1].bal, vb = i === 0 ? R.cashStart : R.rows[i - 1].bBal;
    var svg = $('svg', chart), vbx = svg.viewBox.baseVal, rc = svg.getBoundingClientRect(), cb = chart.getBoundingClientRect();
    var hx = i === 0 ? +hit.getAttribute('x') : i === 12 ? +hit.getAttribute('x') + +hit.getAttribute('width') : +hit.getAttribute('x') + +hit.getAttribute('width') / 2;
    var px = hx / vbx.width * rc.width + (rc.left - cb.left);
    var cross = $('.cross', chart); cross.setAttribute('x1', hx); cross.setAttribute('x2', hx); cross.setAttribute('visibility', 'visible');
    var tip = $('.tip', chart); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; chart.appendChild(tip); }
    tip.innerHTML = (i === 0 ? 'ตอนนี้' : 'สิ้น ' + monthLabel(i, true)) + ' · ทำ <b>' + plain(va) + '</b> · ไม่ทำ ' + plain(vb);
    var w = tip.offsetWidth;
    tip.style.left = Math.max(w / 2, Math.min(cb.width - w / 2, px)) + 'px'; tip.style.top = '14px';
  }

  function start(data) {
    app = document.getElementById('app');
    if (!document.getElementById('sr-live')) { var lv = document.createElement('div'); lv.id = 'sr-live'; lv.className = 'sr'; lv.setAttribute('aria-live', 'polite'); document.body.appendChild(lv); }
    var r = data && data.view ? data : null;
    if (!r) { try { r = JSON.parse(sessionStorage.getItem('lab3') || 'null'); } catch (e) { r = null; } }
    restore(r);
    adoptShared();
    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput);
    document.addEventListener('change', onChange);
    document.addEventListener('focusout', onBlur);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointermove', onPointer);
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('resize', function () { var f = $('#foot'); document.documentElement.style.setProperty('--foot-h', (f ? f.offsetHeight : 0) + 'px'); });
    window.addEventListener('popstate', function (ev) {
      var s = ev.state;
      state.view = s && s.v ? s.v : 'start';
      if (s && s.t && TOPICS[s.t]) state.topic = s.t;
      if (state.view === 'lab') state.view = 'result';
      render(); window.scrollTo(0, 0); focusMain();
    });
    try { history.replaceState({ v: state.view, t: state.topic }, ''); } catch (e) { /* ignore */ }
    render();
  }
  var hot = window.claude && window.claude.hot;
  if (hot && hot.snapshot) { try { hot.snapshot(snapshot); } catch (e) { /* ignore */ } }
  window.__lab3 = { state: state, render: render, go: go, E: E, openTopic: openTopic, chooseModel: chooseModel };
  if (hot && hot.ready) hot.ready(start); else start(hot && hot.data ? hot.data : {});
})();
