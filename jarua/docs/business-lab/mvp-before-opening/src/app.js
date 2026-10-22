/* ============================================================
   UI ตัวที่ 2 "เช็กก่อนเปิดร้าน" — สี ฟอนต์ ปุ่ม และคำถามตัวเลขร้านชุดเดียวกับตัวที่ 1 3 4
   เส้นทาง (เจ้าของยืนยันแล้ว proposal.html): หน้าเริ่ม (ขายที่ไหน · ร้านแบบไหน · ร้านตัวอย่าง) → ขายอะไร ราคาเท่าไร → คาดว่าขายได้เท่าไร
   → ช่วงเปิดร้าน (ตกแต่งกี่เดือน · เปิดเดือนไหน · เดือนขายดีขายแย่) → ยอดขายเดือนแรก ๆ → ค่าใช้จ่ายทุกเดือน (มีตัวเลขร้านแล้วข้าม)
   → เงินก่อนเปิดร้าน → เงินที่มี → ผล · ปุ่มค้างล่างจอ: แก้ตัวเลข | หาจุดที่ควรตรวจสอบ
   ปุ่มย้อนกลับในแอปกับของมือถือไปที่เดียวกันทุกหน้า (แบบเดียวกับตัวที่ 1 3 4)
   ============================================================ */
(function () {
  'use strict';

  var P = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var ICON = {
    back: P('<path d="m15 18-6-6 6-6"/>'),
    next: P('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'),
    chev: P('<path d="m9 18 6-6-6-6"/>'),
    out: P('<path d="M7 17 17 7"/><path d="M8 7h9v9"/>'),
    moon: P('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>'),
    sun: P('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-2.93 1.41-1.41M17.66 6.34l1.41-1.41M2 12h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41"/>'),
    plus: P('<path d="M12 5v14"/><path d="M5 12h14"/>'),
    x: P('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
    q: P('<path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>'),
    undo: P('<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'),
    ok: P('<path d="M20 6 9 17l-5-5"/>'),
    store: P('<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>'),
    phone: P('<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>'),
    both: P('<path d="M3 9h11v11H3z"/><path d="M14 13h7v7h-7"/><path d="M6 9V5h11v8"/>')
  };
  var MICON = {
    unit: P('<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>'),
    service: P('<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>'),
    resell: P('<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>')
  };

  /* op = ตัวเลขของตัวที่ 2 เท่านั้น (ไม่อยู่ในตัวเลขร้านชุดกลาง) */
  function emptyOp() { return { where: null, fit: null, openMonth: null, seasonAsked: null, ramp: { p: null, c: [] }, mode: null, items: [], lump: null, savings: null, menu: null, fh: null, range: 20, sens: null, target: { income: null, months: 12 } }; }
  var state = {
    view: 'start', model: null, inp: {}, op: emptyOp(), where: null, isSample: false, sampleKind: null,
    /* link: own = ตัวที่ 2 เขียนตัวเลขร้านชุดกลาง · local = ชุดกลางเป็นร้านแบบที่ตัวที่ 2 ยังไม่รองรับ → ใช้ร่วมเฉพาะค่าใช้จ่ายคงที่ */
    link: 'own', askFixed: false, k: 0, editing: false, edOrig: null,
    sc: 'mid', trial: null, rampSel: 0, sensEdit: false, answers: {}, qidx: 0, seq: 0, mine: null
  };
  var app;

  /* ---------- memo ---------- */
  var memo = new Map();
  function RC(inp, m, op) {
    var key = m + '|' + JSON.stringify(inp) + '|' + JSON.stringify(op);
    if (memo.has(key)) return memo.get(key);
    var R = opCompute(inp, m, op);
    if (memo.size > 120) memo.clear();
    memo.set(key, R);
    return R;
  }
  function R0() { return RC(state.inp, state.model, state.op); }
  function flowOk() { return !!state.model && flowSteps().every(stepOk); }

  /* ---------- persistence & ตัวเลขร้านชุดกลาง ---------- */
  function snapshot() {
    return { view: state.view, model: state.model, inp: state.inp, op: state.op, where: state.where, isSample: state.isSample, sampleKind: state.sampleKind,
      link: state.link, askFixed: state.askFixed, k: state.k, editing: state.editing, edOrig: state.edOrig, sc: state.sc, rampSel: state.rampSel,
      answers: state.answers, qidx: state.qidx, seq: state.seq, mine: state.mine };
  }
  var lastPut = null;
  var FX = ['staffCount', 'staffSalary', 'ownerSalary', 'rent', 'marketing', 'otherFixed'];
  function fxOk(inp) { return FX.every(function (k) { if (k === 'staffSalary' && !(num(inp.staffCount) > 0)) return true; return num(inp[k]) !== null && num(inp[k]) >= 0; }); }
  /* ตัวเลขที่ตัวที่ 2 ส่งต่อให้ชุดกลาง: เงินสดตอนเปิดร้าน = เงินที่มี − เงินก่อนเปิดร้าน · อุปกรณ์ · เดือนขายดีขายแย่ · ป้าย "ตัวเลขที่ตั้งใจไว้ก่อนเปิดร้าน" */
  function derive(inp, op, m) {
    inp.preOpen = 1;
    if (num(op.savings) !== null && stepOkAll(['su'])) inp.cash = Math.round((num(op.savings) - suTotals(op, inp).all) * 100) / 100;
    var pick = function (g) { inp.advMode = 'yes'; inp.advPick = (inp.advPick || []).filter(function (x) { return x !== g; }).concat([g]); };
    var e = op.mode === 'items' ? suEquip(op) : null;
    if (e) { inp.equipValue = e.value; inp.equipYears = e.years; pick('adv-equip'); }
    if (op.seasonAsked === 'yes' && hasSeason(inp)) pick('adv-season');
    if (op.seasonAsked === 'no') inp.season = { high: [], low: [], highPct: 0, lowPct: 0 };
    if (!inp.advMode) inp.advMode = 'no';
    return inp;
  }
  function save() {
    try { sessionStorage.setItem('labOpen', JSON.stringify(snapshot())); } catch (e) { /* ignore */ }
    if (typeof LabShop === 'undefined') return;
    LabShop.setWhere(state.where);
    if (!state.model || state.isSample) return;
    var sh0 = LabShop.get();
    if (state.link === 'local' && sh0 && sh0.model !== state.model) {
      var mg = JSON.parse(JSON.stringify(sh0.inp));
      FX.forEach(function (k) { if (state.inp[k] !== undefined) mg[k] = state.inp[k]; });
      var js0 = sh0.model + '|' + JSON.stringify(mg);
      if (js0 !== lastPut && !LabShop.same(mg, sh0.inp)) LabShop.put(sh0.model, mg, sh0.label, missingFields(mg, sh0.model).length === 0 && advValid(mg, sh0.model));
      lastPut = js0;
      return;
    }
    state.link = 'own';
    derive(state.inp, state.op, state.model);
    var js = state.model + '|' + JSON.stringify(state.inp);
    if (js === lastPut) return;
    LabShop.put(state.model, state.inp, MODELS[state.model].tile, missingFields(state.inp, state.model).length === 0 && advValid(state.inp, state.model));
    lastPut = js;
  }
  /* เปิดเครื่องมือ: ใช้ตัวเลขร้านชุดกลางล่าสุด (กรอกหรือแก้ในเครื่องมืออื่น) · ร้านแบบเดียวกัน = ใช้ทั้งชุด · ร้านคนละแบบ = ใช้ค่าใช้จ่ายคงที่
     · เงินที่มี: ถ้ายังไม่มีและชุดกลางมาจากตัวที่ 2 → เงินสดตอนเปิดร้าน + เงินก่อนเปิดร้าน */
  function adoptShared() {
    if (typeof LabShop === 'undefined') return;
    var sh = LabShop.get();
    if (!state.where) state.where = LabShop.where();
    if (!sh || !MODELS[sh.model]) return;
    var js = sh.model + '|' + JSON.stringify(sh.inp);
    if (js === lastPut) return;
    lastPut = js;
    var copy = advNormalize(JSON.parse(JSON.stringify(sh.inp)), sh.model), tgt = state.isSample ? state.mine : state;
    if (!tgt || !tgt.model) {
      if (OP_MODELS.indexOf(sh.model) < 0) return;
      var op = tgt && tgt.op ? tgt.op : emptyOp();
      if (state.isSample) state.mine = { model: sh.model, inp: copy, op: op, link: 'own' };
      else { state.model = sh.model; state.inp = copy; state.op = op; state.link = 'own'; }
      return;
    }
    if (tgt.model !== sh.model) { FX.forEach(function (k) { if (sh.inp[k] !== undefined) tgt.inp[k] = sh.inp[k]; }); tgt.link = 'local'; return; }
    tgt.inp = copy; tgt.link = 'own';
  }
  function restore(d) {
    if (!d || typeof d !== 'object') return;
    if (d.model && OP_MODELS.indexOf(d.model) < 0) return;
    Object.assign(state, d);
    state.op = Object.assign(emptyOp(), state.op || {}); state.answers = state.answers || {}; state.trial = null;
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
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var shown = {};
  function anim(key, v, d0) { return '<span data-anim="' + key + '" data-v="' + v + '" data-dec="' + (d0 || 0) + '">' + fmtN(Math.abs(v), d0) + '</span>'; }
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
  }
  function money(v, d0) { return (v < -0.005 ? '<span class="down"><span class="sr">ขาดทุน </span>−' : '<span>') + fmtN(Math.abs(v), d0) + '</span>'; }
  function moneyTxt(v, d0) { return (v < -0.005 ? '−' : '') + fmtN(Math.abs(v), d0); }
  var qmOpen = {};
  function plain(s) { return String(s).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&(amp|lt|gt|quot|#39);/g, function (m, k) { return { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[k]; }).replace(/ /g, ' '); }
  function qmBtn(key, label) { return '<button type="button" class="qm" data-act="qm" data-q="' + key + '" aria-expanded="' + !!qmOpen[key] + '" aria-label="' + esc(plain(label)) + '"><i>' + ICON.q + '</i></button>'; }
  function qmT(key, html, tag) { tag = tag || 'p'; return html ? '<' + tag + ' class="qm-tx" data-qmt="' + key + '"' + (qmOpen[key] ? '' : ' hidden') + '>' + html + '</' + tag + '>' : ''; }
  function hq(tag, title, key, help, cls) {
    var t = '<' + tag + (cls ? ' class="' + cls + '"' : '') + '>' + title + '</' + tag + '>';
    return help ? '<div class="hq">' + t + qmBtn(key, title) + '</div>' + qmT(key, help) : t;
  }
  function bar(left, title, sub, right) {
    if (state.isSample) sub = (sub ? sub + ' · ' : '') + 'ร้านตัวอย่าง';
    return '<header class="bar"><div class="wrap">' + (left || '<span class="spacer44"></span>') +
      '<div class="ttl">' + (sub ? '<small>' + esc(sub) + '</small>' : '') + esc(title) + '</div>' +
      (right || '') + '<button class="ib" data-act="theme" aria-label="สลับโหมดมืดและสว่าง">' + (themeNow() === 'dark' ? ICON.sun : ICON.moon) + '</button></div></header>';
  }
  function hubLink() { return window.LAB_HUB ? '<a class="ib" href="' + esc(window.LAB_HUB) + '" aria-label="กลับไปหน้า Business Lab">' + ICON.back + '</a>' : null; }
  function backBtn(label) { return '<button class="ib" data-act="back" aria-label="' + (label || 'ย้อนกลับ') + '">' + ICON.back + '</button>'; }
  var srT = 0;
  function announce(txt) { clearTimeout(srT); srT = setTimeout(function () { var el = document.getElementById('sr-live'); if (el) el.textContent = txt; }, 700); }
  var NW = ['เงินที่ต้องมี', 'ก่อนเปิดร้าน', 'ยอดขาย', 'ต่อเดือน', 'ค่าใช้จ่าย', 'ค่าเช่า', 'คืนทุน', 'เงินเดือน', 'ขาดทุน', 'เดือนละ', 'วันละ', 'เงินในมือ', 'จุดคุ้มทุน', 'ตกแต่ง'];
  function tw(str) {
    var h = esc(String(str).replace(/([A-Za-z)])([ก-๙])/g, '$1 $2').replace(/([ก-๙])([A-Za-z(])/g, '$1 $2').replace(/ บาท/g, ' บาท'));
    NW.forEach(function (w) { h = h.split(w).join('<span class="nw">' + w + '</span>'); });
    return h;
  }
  function Ux() { return U(state.inp, state.model); }
  function perW() { return state.inp.volumePer === 'month' ? 'เดือน' : 'วัน'; }
  function newId(pfx) { state.seq = (state.seq || 0) + 1; return pfx + Date.now().toString(36).slice(-4) + state.seq; }
  function shopW() { return state.where !== 'online'; }
  function monthName(c) { return TH_MONTHS[((c - 1) % 12 + 12) % 12]; }

  /* ============================================================ เส้นทาง */
  var FIXED_STEPS = [
    { id: 'people', q: 'คนที่ทำงานในร้าน', p: 'รวมเงินเดือนของคุณเองด้วย · ไม่เอาเงินเดือนก็ได้ แต่ผลจะบอกว่ายังไม่ได้หัก', f: ['staffCount', 'staffSalary', 'ownerSalary'] },
    { id: 'fixed', q: 'ค่าใช้จ่ายที่จะจ่ายทุกเดือน', p: 'จ่ายเท่าเดิม ไม่ว่าจะขายได้มากหรือน้อย · เริ่มจ่ายเต็มตั้งแต่เดือนแรกที่เปิด', f: ['rent', 'marketing', 'otherFixed'] }
  ];
  var FLOW_VIEWS = ['sell', 'vol', 'open', 'ramp', 'fixed', 'su', 'save'];
  function flowSteps() {
    var S = [{ v: 'sell', k: 0 }, { v: 'vol', k: 0 }, { v: 'open', k: 0 }, { v: 'ramp', k: 0 }];
    if (state.askFixed) FIXED_STEPS.forEach(function (f, i) { S.push({ v: 'fixed', k: i }); });
    S.push({ v: 'su', k: 0 }, { v: 'save', k: 0 });
    return S;
  }
  function flowIdx() { var S = flowSteps(); for (var i = 0; i < S.length; i++) if (S[i].v === state.view && S[i].k === state.k) return i; return -1; }
  function fieldDef(k) { for (var i = 0; i < FIELDS.length; i++) { var f = FIELDS[i]; if (f.k === k && (!f.models || f.models.indexOf(state.model) >= 0)) return f; } return null; }
  function stepOk(st) { return !stepMissing(st); }
  function stepOkAll(views) { return flowSteps().filter(function (s) { return views.indexOf(s.v) >= 0; }).every(stepOk); }
  function firstBad() { var S = flowSteps(); for (var i = 0; i < S.length; i++) if (!stepOk(S[i])) return S[i]; return null; }
  /* เมนู: ราคาและต้นทุนเฉลี่ยถ่วงด้วยสัดส่วนที่คาดว่าขาย */
  function menuSum(op) { return (op.menu || []).reduce(function (s, x) { return s + n0(x.share); }, 0); }
  function menuApply() {
    var M = state.op.menu; if (!M || !M.length) return;
    var w = menuSum(state.op); if (w <= 0) return;
    state.inp.price = Math.round(M.reduce(function (s, x) { return s + n0(x.price) * n0(x.share); }, 0) / w * 100) / 100;
    state.inp.unitCost = Math.round(M.reduce(function (s, x) { return s + n0(x.cost) * n0(x.share); }, 0) / w * 100) / 100;
  }
  function fhApply() { var F = state.op.fh; if (!F) return; if (num(F.share) !== null && num(F.rate) !== null) state.inp.feePct = Math.round(n0(F.share) * n0(F.rate)) / 100; }

  /* ช่องที่ยังขาดของแต่ละขั้น: [ช่อง, ข้อความ] หรือ null */
  function stepMissing(st) {
    var inp = state.inp, op = state.op;
    if (st.v === 'sell') {
      var M = op.menu;
      if (M && M.length) {
        for (var i = 0; i < M.length; i++) {
          if (!String(M[i].name || '').trim()) return ['mn.' + i + '.name'];
          if (pos(M[i].price) === null) return ['mn.' + i + '.price'];
          if (num(M[i].cost) === null || num(M[i].cost) < 0) return ['mn.' + i + '.cost'];
          if (pos(M[i].share) === null) return ['mn.' + i + '.share'];
        }
        if (Math.abs(menuSum(op) - 100) > 0.5) return ['menu-tot', 'สัดส่วนรวมกันต้องได้ 100% ตอนนี้ได้ ' + fmtN(menuSum(op), 1) + '%'];
      }
      if (pos(inp.price) === null) return ['inp.price', num(inp.price) === 0 ? 'ราคาต้องมากกว่า 0' : null];
      if (num(inp.unitCost) === null || num(inp.unitCost) < 0) return ['inp.unitCost'];
      if (op.fh) { if (num(op.fh.share) === null || num(op.fh.share) < 0 || num(op.fh.share) > 100) return ['fh.share', num(op.fh.share) > 100 ? 'ไม่เกิน 100%' : null]; if (num(op.fh.rate) === null || num(op.fh.rate) < 0 || num(op.fh.rate) >= 100) return ['fh.rate']; }
      if (num(inp.feePct) === null || num(inp.feePct) < 0 || num(inp.feePct) >= 100) return ['inp.feePct', num(inp.feePct) >= 100 ? 'ต้องน้อยกว่า 100%' : null];
      return null;
    }
    if (st.v === 'vol') {
      if (inp.volumePer !== 'day' && inp.volumePer !== 'month') return ['inp.volumePer'];
      if (inp.volumePer === 'day' && (pos(inp.daysOpen) === null || n0(inp.daysOpen) > 31)) return ['inp.daysOpen', n0(inp.daysOpen) > 31 ? 'เดือนหนึ่งมีไม่เกิน 31 วัน' : null];
      if (pos(inp.volume) === null) return ['inp.volume', num(inp.volume) === 0 ? 'ใส่จำนวนที่คาดว่าจะขายได้เมื่อยอดขายเข้าที่' : null];
      return null;
    }
    if (st.v === 'open') {
      if (num(op.fit) === null || num(op.fit) < 0 || num(op.fit) > 24) return ['op.fit', num(op.fit) > 24 ? 'ไม่เกิน 24 เดือน' : null];
      if (!(op.openMonth >= 1 && op.openMonth <= 12)) return ['op.openMonth'];
      if (op.seasonAsked !== 'yes' && op.seasonAsked !== 'no') return ['op.seasonAsked'];
      if (op.seasonAsked === 'yes') {
        var s = inp.season || {};
        if (!(s.high || []).length && !(s.low || []).length) return ['season', 'แตะเดือนที่ขายดีหรือขายแย่อย่างน้อย 1 เดือน'];
        if ((s.high || []).length && pos(s.highPct) === null) return ['ss.highPct'];
        if ((s.low || []).length && (pos(s.lowPct) === null || n0(s.lowPct) >= 100)) return ['ss.lowPct', n0(s.lowPct) >= 100 ? 'ต้องน้อยกว่า 100%' : null];
      }
      return null;
    }
    if (st.v === 'ramp') { if (!op.ramp || !op.ramp.p) return ['ramp']; return null; }
    if (st.v === 'fixed') {
      var fs = FIXED_STEPS[st.k].f;
      for (var x = 0; x < fs.length; x++) { var f = fieldDef(fs[x]); if (f && f.req && (!f.show || f.show(inp, state.model)) && (num(inp[fs[x]]) === null || num(inp[fs[x]]) < 0)) return ['inp.' + fs[x]]; }
      if (st.k === 0 && num(inp.staffCount) > 0 && num(inp.staffSalary) === null) return ['inp.staffSalary'];
      return null;
    }
    if (st.v === 'su') {
      if (op.mode !== 'items' && op.mode !== 'lump') return ['op.mode'];
      if (op.mode === 'lump') return num(op.lump) === null || num(op.lump) < 0 ? ['op.lump'] : null;
      if (!op.items.length) return ['su-pick', 'เลือกอย่างน้อย 1 รายการ หรือเลือก “ใส่ยอดรวมก้อนเดียว”'];
      for (var j = 0; j < op.items.length; j++) {
        var it = op.items[j];
        if (it.k === 'other' && !String(it.name || '').trim()) return ['su.' + j + '.name'];
        if (num(it.amt) === null || num(it.amt) < 0) return ['su.' + j + '.amt'];
        if (it.t === 'equip' && pos(it.y) === null) return ['su.' + j + '.y'];
      }
      return null;
    }
    if (st.v === 'save') return num(op.savings) === null || num(op.savings) < 0 ? ['op.savings'] : null;
    return null;
  }

  /* ============================================================ START */
  var WHERE4 = [['shop', 'หน้าร้าน', 'มีร้านหรือแผงให้ลูกค้ามา', ICON.store], ['online', 'ออนไลน์', 'ขายในโซเชียล แอป หรือเว็บ', ICON.phone], ['both', 'ทั้งสองแบบ', 'มีหน้าร้าน และขายออนไลน์ด้วย', ICON.both]];
  function whereHtml() {
    if (!state.where) return '<section class="where4 big"><h2 class="wh-q" id="wh-l">ร้านที่จะเปิดขายที่ไหน?</h2><div class="wh-cards" role="group" aria-labelledby="wh-l">' + WHERE4.map(function (w) {
      return '<button type="button" class="wh-c" data-act="where" data-v="' + w[0] + '" aria-pressed="false"><span class="wh-i">' + w[3] + '</span><span class="wh-b"><b>' + w[1] + '</b><small>' + w[2] + '</small></span>' + ICON.chev + '</button>';
    }).join('') + '</div></section>';
    return '<div class="where4"><span class="wh-l" id="wh-l">ร้านที่จะเปิดขายที่ไหน?</span><div class="seg" role="group" aria-labelledby="wh-l">' + WHERE4.map(function (w) {
      return '<button type="button" data-act="where" data-v="' + w[0] + '" aria-pressed="' + (state.where === w[0]) + '">' + w[1] + '</button>';
    }).join('') + '</div></div>';
  }
  function shopLine() {
    if (!state.model || state.isSample) return '';
    var ok = flowOk(), R = ok ? R0() : null;
    return '<div class="shopline"><span class="sl-t"><small>ร้านของคุณ</small><b>' + esc(MODELS[state.model].tile) + '</b>' +
      (R && R.ok ? '<span>ต้องมีเงินทั้งหมด ' + fmtN(R.base.need) + ' บาท · ' + (R.base.left < 0 ? 'ขาดอีก ' + fmtN(-R.base.left) : 'มีพอ') + '</span>' : '<span>ยังกรอกไม่ครบ</span>') + '</span>' +
      '<button class="btn sm' + (ok ? '' : ' ghost') + '" data-act="' + (ok ? 'result' : 'continue') + '">' + (ok ? 'ดูผล' : 'ทำต่อ') + '</button></div>';
  }
  function modelTiles() {
    var sh = typeof LabShop !== 'undefined' ? LabShop.get() : null, unsup = sh && OP_MODELS.indexOf(sh.model) < 0 ? sh.model : null;
    return '<h2 class="sec4">ร้านที่จะเปิดขายแบบไหน?</h2><div class="tiles t3">' + OP_MODELS.map(function (k) {
      var on = state.model === k && !state.isSample;
      return '<button class="tile' + (on ? ' on' : '') + '" data-act="model" data-m="' + k + '" aria-pressed="' + on + '"><span class="ic">' + MICON[k] + '</span><span class="t">' + MODELS[k].tile + '</span><span class="ex">' + MODELS[k].short + '</span></button>';
    }).join('') + '</div>' +
      '<p class="fine4">' + (unsup ? 'ตัวเลขร้านของคุณเป็นแบบ “' + esc(MODELS[unsup].tile) + '” ซึ่งเครื่องมือนี้ยังไม่รองรับ เลือกแบบที่ใกล้ที่สุดได้ ค่าใช้จ่ายคงที่ใช้ชุดเดิม · ' : '') +
      'แบบอื่น (สมาชิก งานโปรเจกต์ ให้เช่า นายหน้า เงินรายเดือนคงที่) ยังไม่รองรับ</p>';
  }
  function viewStart() {
    var out = bar(hubLink(), 'เช็กก่อนเปิดร้าน', 'Business Lab') + '<main class="screen"><div class="wrap">' +
      '<section class="st4">' + hq('h1', 'เปิดร้านแล้วไปรอดไหม ต้องมีเงินเท่าไร?', 'st',
        'ใส่ตัวเลขที่ตั้งใจไว้ แล้วดูว่าต้องขายวันละเท่าไร ต้องมีเงินทั้งหมดเท่าไร เงินอยู่ได้กี่เดือน และคืนทุนเดือนที่เท่าไร · ใช้ตัวเลขร้านชุดเดียวกับเครื่องมืออื่นใน Business Lab') + '</section>';
    if (!state.where && !state.model) out += '<div class="samp4 two4"><span class="wh-l">หรือลองกับร้านตัวอย่างก่อน</span>' + ['cafe', 'online', 'salon'].map(function (k) {
      return '<button class="btn ghost sm" data-act="sample1" data-k="' + k + '">' + esc(OP_SAMPLES[k].short) + '</button>'; }).join('') + '</div>';
    out += whereHtml();
    if (state.where) {
      out += shopLine();
      out += '<div class="samp4"><button class="lnk" data-act="sample">' + (state.isSample ? 'ดูผลร้านตัวอย่าง' : 'ลองกับ' + esc(OP_SAMPLES[sampleKindFor()].short) + 'ตัวอย่างก่อน') + '</button></div>';
      out += modelTiles();
    }
    return out + '</div></main>';
  }
  function sampleKindFor() { return state.where === 'online' ? 'online' : state.model === 'service' ? 'salon' : 'cafe'; }

  /* ============================================================ ช่องกรอก (path: inp.<ช่อง> · op.<ช่อง> · ss.<ช่อง> ฤดูกาล · fh.<ช่อง> · mn.<ลำดับ>.<ช่อง> · su.<ลำดับ>.<ช่อง>) */
  function getP(path) {
    var a = path.split('.');
    if (a[0] === 'inp') return state.inp[a[1]];
    if (a[0] === 'op') return state.op[a[1]];
    if (a[0] === 'ss') return (state.inp.season || {})[a[1]];
    if (a[0] === 'fh') return (state.op.fh || {})[a[1]];
    if (a[0] === 'mn') return ((state.op.menu || [])[+a[1]] || {})[a[2]];
    if (a[0] === 'su') return (state.op.items[+a[1]] || {})[a[2]];
  }
  function setP(path, v) {
    var a = path.split('.');
    if (a[0] === 'inp') state.inp[a[1]] = v;
    else if (a[0] === 'op') state.op[a[1]] = v;
    else if (a[0] === 'ss') { state.inp.season = state.inp.season || { high: [], low: [] }; state.inp.season[a[1]] = v; }
    else if (a[0] === 'fh') { state.op.fh = state.op.fh || {}; state.op.fh[a[1]] = v; fhApply(); }
    else if (a[0] === 'mn') { var mi = (state.op.menu || [])[+a[1]]; if (mi) { mi[a[2]] = v; menuApply(); } }
    else if (a[0] === 'su') { var it = state.op.items[+a[1]]; if (it) it[a[2]] = v; }
  }
  function fmtIn(v, t) { return v === null || v === undefined || v === '' ? '' : (t === 'money' && Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('th-TH') : String(v)); }
  function fld(path, label, o) {
    o = o || {};
    var id = 'f-' + path.replace(/\./g, '-'), v = getP(path), lab = qmark(label);
    var labRow = o.help ? '<div class="hq"><label for="' + id + '">' + esc(lab) + '</label>' + qmBtn('h-' + path, lab) + '</div>' + qmT('h-' + path, esc(o.help)) : '<label for="' + id + '">' + esc(lab) + '</label>';
    var chips = (o.chips || []).map(function (c) {
      var on = v !== null && v !== undefined && v !== '' && (typeof c[1] === 'number' ? Math.abs(num(v) - c[1]) < 1e-9 : v === c[1]);
      return '<button type="button" class="chip" data-act="pset" data-path="' + path + '" data-v="' + esc(c[1]) + '" data-num="' + (typeof c[1] === 'number' ? 1 : 0) + '" aria-pressed="' + on + '">' + esc(c[0]) + '</button>';
    }).join('');
    var input;
    if (o.t === 'text') input = '<div class="inbox txt"><input id="' + id + '" data-path="' + path + '" data-t="text" autocomplete="off" enterkeyhint="next" maxlength="40" placeholder="' + esc(o.ph || '') + '" value="' + esc(v || '') + '"></div>';
    else input = '<div class="inbox"><input id="' + id + '" data-path="' + path + '" data-t="' + (o.t || 'money') + '" inputmode="' + (o.t === 'money' || o.t === 'int' ? 'numeric' : 'decimal') + '" autocomplete="off" enterkeyhint="next" placeholder="' + esc(o.ph || '') + '" value="' + esc(fmtIn(v, o.t || 'money')) + '"' + (o.readonly ? ' readonly' : '') + '><span class="suf">' + esc(o.suf || (o.t === 'pct' ? '%' : 'บาท')) + '</span></div>';
    return '<div class="field' + (o.small ? ' sm' : '') + '" data-need="' + path + '"' + (o.hidden ? ' hidden' : '') + '>' + labRow + (chips ? '<div class="chips quick">' + chips + '</div>' : '') + input + '</div>';
  }
  function segF(path, label, opts, help) {
    var v = getP(path), id = 'sg-' + path.replace(/\./g, '-');
    return '<div class="field" data-need="' + path + '">' + (help ? '<div class="hq"><span class="lab" id="' + id + '">' + esc(qmark(label)) + '</span>' + qmBtn('h-' + path, label) + '</div>' + qmT('h-' + path, esc(help)) : '<span class="lab" id="' + id + '">' + esc(qmark(label)) + '</span>') +
      '<div class="seg wide" role="group" aria-labelledby="' + id + '">' + opts.map(function (o) {
        return '<button type="button" data-act="pset" data-path="' + path + '" data-v="' + esc(o[0]) + '" data-num="0" aria-pressed="' + (v !== null && v !== undefined && String(v) === o[0]) + '">' + esc(o[1]) + '</button>';
      }).join('') + '</div></div>';
  }
  function shField(k, o) {
    var f = fieldDef(k); if (!f) return '';
    var m = state.model, inp = state.inp, lab = f.label(inp, m), help = f.help ? f.help(inp, m) : '', sample = MODELS[m].sample[k];
    o = o || {};
    return fld('inp.' + k, o.label || lab, { t: f.t === 'int' ? 'int' : f.t === 'pct' ? 'pct' : 'money', suf: f.suf ? f.suf(inp, m) : 'บาท', help: o.help !== undefined ? o.help : help, chips: f.chip ? [[f.chip[0], f.chip[1]]] : null,
      ph: typeof sample === 'number' ? 'เช่น ' + (sample >= 1000 ? Math.round(sample).toLocaleString('th-TH') : sample) : '', hidden: f.show && !f.show(inp, m), readonly: o.readonly });
  }
  function qHead(q, p, key) {
    q = tw(qmark(q));
    if (!p) return '<div class="q-head"><h1>' + q + '</h1></div>';
    return '<div class="q-head"><div class="hq"><h1>' + q + '</h1>' + qmBtn('q-' + key, q) + '</div>' + qmT('q-' + key, esc(p)) + '</div>';
  }
  function progHtml() {
    if (state.editing) return '';
    var S = flowSteps(), i = flowIdx();
    return '<div class="prog" aria-hidden="true">' + S.map(function (s, x) { return '<i class="' + (x <= i ? 'on' : '') + '"></i>'; }).join('') + '</div>';
  }
  function stepSub() { if (state.editing) return 'แก้ตัวเลข'; var S = flowSteps(), i = flowIdx(); return 'ข้อ ' + (i + 1) + ' จาก ' + S.length; }
  function footStep() {
    var S = flowSteps(), i = flowIdx(), last = i === S.length - 1;
    var primary = state.editing ? '<button class="btn" data-act="step-done">เสร็จ</button>' : '<button class="btn" data-act="step-next">' + (last ? 'ดูผล' : 'ถัดไป') + ICON.next + '</button>';
    return '<div class="foot" id="foot"><div class="wrap"><button class="btn ghost back" data-act="back" aria-label="ย้อนกลับ">' + ICON.back + '</button>' + primary + '</div></div>';
  }
  function stepBar(title) { return bar(backBtn(), title, stepSub()); }

  /* ---------- แถบสรุปสดระหว่างกรอก: ขึ้นทีละตัวตามที่ตอบแล้ว ---------- */
  function liveStrip() {
    var inp = state.inp, s1 = !stepMissing({ v: 'sell', k: 0 }), s2 = s1 && !stepMissing({ v: 'vol', k: 0 });
    if (!s1) return '<section class="panel strip4" id="strip"><span class="rs-k">ผลสรุป</span><div class="rs-empty">ตัวเลขจะค่อย ๆ ขึ้นตรงนี้ระหว่างที่คุณกรอก</div></section>';
    var cu = n0(inp.price) * (1 - n0(inp.feePct) / 100) - n0(inp.unitCost), u = Ux();
    if (!s2) return '<section class="panel strip4" id="strip"><div class="rs-top"><span class="rs-k">ขาย 1 ' + esc(u) + ' เหลือ</span><span class="rs-v">' + (cu < 0 ? '−' : '') + anim('st-cu', cu, Math.abs(cu) < 100 ? 1 : 0) + '<small>บาท</small></span></div><div class="rs-lines"><div class="rs-line"><span>หลังหักต้นทุนและค่าธรรมเนียม</span></div></div></section>';
    var mon = cu * (volMonthly(inp) || 0), fx = fxOk(inp), su = fx && !stepMissing({ v: 'su', k: 0 }), sv = su && !stepMissing({ v: 'save', k: 0 }) && stepOkAll(['open', 'ramp']);
    if (sv) {
      var R = R0();
      if (R.ok) return '<section class="panel strip4" id="strip"><div class="rs-top"><span class="rs-k">ต้องมีเงินทั้งหมด</span><span class="rs-v">' + anim('st-need', R.base.need) + '<small>บาท</small></span></div>' +
        '<div class="rs-lines"><div class="rs-line"><span>มี</span><i></i><b>' + fmtN(R.base.save) + '</b></div><div class="rs-line"><span>' + (R.base.left < 0 ? 'ขาดอีก' : 'เหลือช่วงตึงที่สุด') + '</span><i></i><b>' + fmtN(Math.abs(R.base.left)) + '</b></div></div></section>';
    }
    var lines = '<div class="rs-line"><span>เงินที่เหลือจากการขายเมื่อยอดเต็ม (ยังไม่หักค่าใช้จ่ายทุกเดือน)</span><i></i><b>' + moneyTxt(mon) + '</b></div>';
    if (fx) lines = '<div class="rs-line"><span>หักค่าใช้จ่ายทุกเดือน ' + fmtN(fixedTotal(inp)) + ' บาท</span><i></i><b>' + moneyTxt(mon - fixedTotal(inp)) + '</b></div>';
    if (su) lines += '<div class="rs-line"><span>เงินก่อนเปิดร้าน</span><i></i><b>' + fmtN(suTotals(state.op, inp).all) + '</b></div>';
    return '<section class="panel strip4" id="strip"><div class="rs-top"><span class="rs-k">' + (fx ? 'เหลือต่อเดือนเมื่อยอดขายเต็ม' : 'เงินที่เหลือจากการขายต่อเดือน') + '</span><span class="rs-v">' + ((fx ? mon - fixedTotal(inp) : mon) < 0 ? '−' : '') + anim('st-mon', fx ? mon - fixedTotal(inp) : mon) + '<small>บาท</small></span></div><div class="rs-lines">' + lines + '</div></section>';
  }

  /* ============================================================ ขั้น 1: ขายอะไร ราคาเท่าไร */
  function viewSell() {
    var m = state.model, u = Ux(), units = MODELS[m].units, M = state.op.menu, menuOn = !!(M && M.length), F = state.op.fh;
    var unitChips = '<div class="field" data-need="inp.unitLabel"><span class="lab" id="u-l">นับยอดขายเป็นอะไร</span><div class="chips" role="group" aria-labelledby="u-l">' + units.map(function (x) {
      return '<button type="button" class="chip" data-act="pset" data-path="inp.unitLabel" data-v="' + esc(x) + '" data-num="0" aria-pressed="' + (u === x) + '">' + esc(x) + '</button>';
    }).join('') + '</div></div>';
    var menu = '';
    if (menuOn) {
      menu = '<section class="card mn2" aria-label="คิดราคาเฉลี่ยจากเมนู"><div class="hq"><h3>คิดราคาเฉลี่ยจากเมนู</h3>' + qmBtn('mn', 'คิดราคาเฉลี่ยจากเมนู') + '</div>' +
        qmT('mn', 'ใส่ราคา ต้นทุน และสัดส่วนที่คาดว่าจะขายแต่ละอย่าง (คิดจากจำนวน ไม่ใช่ยอดเงิน) ระบบคิดราคาและต้นทุนเฉลี่ยให้ · ใส่ได้สูงสุด 8 อย่าง') +
        M.map(function (x, i) {
          return '<div class="mrow"><div class="mh"><span>อย่างที่ ' + (i + 1) + '</span><button type="button" class="ib sm" data-act="mn-del" data-i="' + i + '" aria-label="ลบอย่างที่ ' + (i + 1) + '">' + ICON.x + '</button></div>' +
            fld('mn.' + i + '.name', 'ชื่อ', { t: 'text', ph: m === 'service' ? 'เช่น ตัดผม' : 'เช่น ลาเต้เย็น' }) +
            '<div class="three">' + fld('mn.' + i + '.price', 'ราคา', { t: 'money' }) + fld('mn.' + i + '.cost', 'ต้นทุน', { t: 'dec' }) + fld('mn.' + i + '.share', 'สัดส่วน', { t: 'pct', suf: '%' }) + '</div></div>';
        }).join('') +
        '<div id="mtot" class="field" data-need="menu-tot"><div class="tot4" role="status"><span>สัดส่วนรวม</span><b class="num">' + fmtN(menuSum(state.op), 1) + '%</b>' + (Math.abs(menuSum(state.op) - 100) <= 0.5 ? '<i>' + ICON.ok + '</i>' : '') + '</div></div>' +
        (M.length < 8 ? '<button type="button" class="lnk" data-act="mn-add">+ เพิ่มอีกอย่าง</button>' : '') +
        '<button type="button" class="lnk" data-act="mn-off">ไม่ใช้เมนู ใส่ราคาเฉลี่ยเอง</button></section>';
    }
    var fh = F ? '<section class="card fh2"><div class="hq"><h3>คิดค่าธรรมเนียมจากสัดส่วนที่ขายผ่านแอป</h3>' + qmBtn('fh', 'คิดค่าธรรมเนียม') + '</div>' +
      qmT('fh', 'เช่น ขายผ่านแอปส่งอาหาร 30% ของยอดขาย แอปหัก 32.1% (GP 30% + VAT) → ค่าธรรมเนียมเฉลี่ย 9.6% ของยอดขายทั้งหมด') +
      '<div class="two">' + fld('fh.share', 'ขายผ่านแอปกี่ % ของยอดขาย', { t: 'pct', suf: '%' }) + fld('fh.rate', 'แอปหักกี่ %', { t: 'pct', suf: '%' }) + '</div>' +
      '<button type="button" class="lnk" data-act="fh-off">ใส่ค่าธรรมเนียมเอง</button></section>' : '';
    return stepBar('ขายอะไร ราคาเท่าไร') + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() +
      qHead(m === 'service' ? 'บริการที่จะขาย ราคาเท่าไร' : 'สินค้าที่จะขาย ราคาเท่าไร', 'ขายหลายอย่าง ใส่ราคาเฉลี่ย หรือแตะ “คิดราคาเฉลี่ยจากเมนู”', 'sell') +
      '<div class="qfields">' + unitChips +
      (menuOn ? menu : '<button type="button" class="lnk" data-act="mn-on">ขายหลายอย่าง? คิดราคาเฉลี่ยจากเมนู</button>') +
      '<div class="two">' + shField('price', { readonly: menuOn }) + shField('unitCost', { readonly: menuOn }) + '</div>' +
      (F ? fh : shField('feePct') + '<button type="button" class="lnk" data-act="fh-on">ขายผ่านแอปบางส่วน? คิดจากสัดส่วน</button>') +
      (F ? shField('feePct', { readonly: true }) : '') +
      '</div></div></main>' + footStep();
  }

  /* ============================================================ ขั้น 2: คาดว่าจะขายได้เท่าไร */
  function viewVol() {
    var pv = state.inp.volumePer, u = Ux();
    return stepBar('คาดว่าจะขายได้เท่าไร') + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() +
      qHead('เมื่อยอดขายเข้าที่แล้ว คาดว่าจะขายได้เท่าไร', 'ยอดขายเดือนแรก ๆ ที่ยังไม่เต็ม ถามในข้อถัดไป · ตัวเลขประมาณก็ได้ หน้าผลจะบอกว่าถ้าขายได้น้อยหรือมากกว่านี้เป็นอย่างไร', 'vol') +
      '<div class="qfields">' +
      '<div class="field" data-need="inp.volumePer"><span class="lab" id="per-l">นับยอดขายต่อวันหรือต่อเดือน?</span><div class="seg wide" role="group" aria-labelledby="per-l">' +
      '<button type="button" data-act="per" data-v="day" aria-pressed="' + (pv === 'day') + '">ต่อวัน</button><button type="button" data-act="per" data-v="month" aria-pressed="' + (pv === 'month') + '">ต่อเดือน</button></div></div>' +
      (pv === 'day' ? fld('inp.daysOpen', 'จะเปิดขายเดือนละกี่วัน', { t: 'int', suf: 'วัน', ph: 'เช่น 26' }) : '') +
      (pv ? fld('inp.volume', (state.model === 'service' ? 'คาดว่าจะมีลูกค้า' : 'คาดว่าจะขายได้') + (pv === 'day' ? 'วันละ' : 'เดือนละ') + 'กี่' + u, { t: 'dec', suf: u + '/' + (pv === 'day' ? 'วัน' : 'เดือน'), help: 'ตอนที่ยอดขายเข้าที่แล้ว ไม่ใช่ช่วงเปิดร้านใหม่ ๆ' }) : '') +
      '</div></div></main>' + footStep();
  }

  /* ============================================================ ขั้น 3: ช่วงเปิดร้าน */
  function viewOpen() {
    var op = state.op, s = state.inp.season || { high: [], low: [] }, rent = n0(state.inp.rent);
    var months = '<div class="field" data-need="op.openMonth"><span class="lab" id="om-l">จะเปิดร้านเดือนไหน?</span><div class="months om2" role="group" aria-labelledby="om-l">' + TH_MONTHS.map(function (n, i) {
      return '<button type="button" class="month mo" data-act="pset" data-path="op.openMonth" data-v="' + (i + 1) + '" data-num="1" aria-pressed="' + (op.openMonth === i + 1) + '">' + n + '</button>';
    }).join('') + '</div></div>';
    var season = '';
    if (op.seasonAsked === 'yes') {
      season = '<div class="field" data-need="season"><span class="lab" id="ss-l">แตะเดือนเพื่อสลับ ปกติ → ขายดี → ขายแย่</span><div class="months" role="group" aria-labelledby="ss-l">' + TH_MONTHS.map(function (n, i) {
        var c = i + 1, st = (s.high || []).indexOf(c) >= 0 ? 'high' : (s.low || []).indexOf(c) >= 0 ? 'low' : 'n';
        return '<button type="button" class="month" data-act="ss-tog" data-c="' + c + '" data-s="' + st + '" aria-label="' + n + ' ' + (st === 'high' ? 'ขายดี' : st === 'low' ? 'ขายแย่' : 'ปกติ') + '">' + n + '<small>' + (st === 'high' ? 'ดี' : st === 'low' ? 'แย่' : '') + '</small></button>';
      }).join('') + '</div></div>' +
        '<div class="two">' + fld('ss.highPct', 'เดือนขายดี ขายได้มากกว่าปกติกี่ %', { t: 'pct', suf: '%', hidden: !(s.high || []).length }) + fld('ss.lowPct', 'เดือนขายแย่ ขายได้น้อยกว่าปกติกี่ %', { t: 'pct', suf: '%', hidden: !(s.low || []).length }) + '</div>';
    }
    return stepBar('ช่วงเปิดร้าน') + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() +
      qHead('ก่อนเปิดร้าน และเดือนที่เปิด', 'ใช้คิดเงินในมือเดือนต่อเดือน · เดือนที่เปิดสำคัญถ้าร้านมีเดือนขายดีขายแย่', 'open') +
      '<div class="qfields">' +
      fld('op.fit', shopW() ? 'ตกแต่งร้านกี่เดือนก่อนเปิด (ต้องจ่ายค่าเช่าแล้ว)' : 'เตรียมร้านกี่เดือนก่อนเริ่มขาย', { t: 'int', suf: 'เดือน', chips: [['ไม่มี', 0], ['1 เดือน', 1], ['2 เดือน', 2]],
        help: shopW() ? 'ค่าเช่าช่วงนั้นใส่ให้เองในเงินก่อนเปิดร้าน (ค่าเช่าต่อเดือน' + (rent > 0 ? ' ' + fmtN(rent) + ' บาท' : '') + ' × จำนวนเดือน)' : 'ช่วงที่ยังไม่มียอดขาย' }) +
      months +
      segF('op.seasonAsked', 'ร้านแบบนี้มีเดือนขายดีขายแย่ไหม', [['no', 'ไม่มี ขายพอ ๆ กันทั้งปี'], ['yes', 'มี']], 'เช่น ร้านใกล้โรงเรียนขายแย่ช่วงปิดเทอม ร้านเครื่องดื่มเย็นขายดีหน้าร้อน · คำถามเดียวกับตัวที่ 1') + season +
      '</div></div></main>' + footStep();
  }

  /* ============================================================ ขั้น 4: ยอดขายเดือนแรก ๆ */
  function rampBars(c, sel, edit) {
    var L = Math.max(c.length + 1, 6), out = '';
    if (n0(state.op.fit) > 0) out += '<div class="rb pre"><i style="height:3%"></i><b>0%</b><span>' + (shopW() ? 'ตกแต่ง' : 'เตรียม') + '</span></div>';
    for (var m = 1; m <= L; m++) {
      var v = rampAt(c, m), h = Math.min(100, v / 1.2 * 100);
      out += '<button type="button" class="rb' + (edit && sel === m - 1 ? ' on' : '') + '" data-act="rb" data-m="' + (m - 1) + '"' + (edit ? '' : ' tabindex="-1"') + ' aria-label="เดือนที่ ' + m + ' ขายได้ ' + Math.round(v * 100) + '% ของยอดปกติ"><i style="height:' + h.toFixed(1) + '%"></i><b>' + Math.round(v * 100) + '%</b><span>' + (m === 1 ? 'เดือน 1' : m) + '</span></button>';
    }
    return '<div class="rampv" style="grid-template-columns:repeat(' + (L + (n0(state.op.fit) > 0 ? 1 : 0)) + ',minmax(0,1fr))">' + out + '</div>';
  }
  function viewRamp() {
    var r = state.op.ramp || {}, c = rampCurve(state.op), sel = Math.min(state.rampSel || 0, c.length);
    var chips = RAMP_ORDER.map(function (k) { return '<button type="button" class="chip" data-act="ramp" data-v="' + k + '" aria-pressed="' + (r.p === k) + '">' + esc(RAMP_PRESETS[k].n) + '</button>'; }).join('') +
      '<button type="button" class="chip" data-act="ramp" data-v="custom" aria-pressed="' + (r.p === 'custom') + '">ปรับเองทีละเดือน</button>';
    var ed = '';
    if (r.p) {
      var v = rampAt(c, sel + 1);
      ed = '<div class="redit"><span class="lab">เดือนที่ ' + (sel + 1) + ' ขายได้</span><div class="tctl"><button type="button" class="stp" data-act="rstep" data-d="-0.1" aria-label="ลดเดือนที่ ' + (sel + 1) + ' 10%">−</button><span class="tv"><b class="num">' + Math.round(v * 100) + '</b><small>% ของยอดปกติ</small></span><button type="button" class="stp" data-act="rstep" data-d="0.1" aria-label="เพิ่มเดือนที่ ' + (sel + 1) + ' 10%">+</button></div>' +
        '<div class="rbtns"><button type="button" class="sbtn light" data-act="rlen" data-d="1"' + (c.length >= RAMP_MAX ? ' disabled' : '') + '>+ ยืดอีก 1 เดือน</button><button type="button" class="sbtn light" data-act="rlen" data-d="-1"' + (c.length ? '' : ' disabled') + '>− ลด 1 เดือน</button></div></div>';
    }
    var full = rampFull(c);
    return stepBar('ยอดขายเดือนแรก ๆ') + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() +
      qHead('เดือนแรก ๆ หลังเปิด ยอดขายเป็นอย่างไร', 'ค่าเช่าและค่าแรงจ่ายเต็มตั้งแต่เดือนแรก แต่ยอดขายมักยังไม่เต็ม · ตัวเลขตั้งต้นเป็นค่าประมาณ (ยังไม่มีข้อมูลของร้านไทย) ปรับให้ตรงกับร้านคุณได้', 'ramp') +
      '<div class="qfields"><div class="field" data-need="ramp"><div class="chips">' + chips + '</div></div>' +
      (r.p ? rampBars(c, sel, true) + '<p class="fine4" id="rfull">' + (full <= 1 ? 'ยอดขายเต็มตั้งแต่เดือนแรก' : 'ยอดขายเต็มในเดือนที่ ' + full) + ' · แตะแท่งเพื่อเลือกเดือน แล้วปรับทีละ 10%</p>' + ed : '') +
      '</div></div></main>' + footStep();
  }

  /* ============================================================ ค่าใช้จ่ายทุกเดือน */
  function viewFixed() {
    var st = FIXED_STEPS[state.k] || FIXED_STEPS[0];
    return stepBar('ค่าใช้จ่ายทุกเดือน') + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() + qHead(st.q, st.p, st.id) +
      '<div class="qfields">' + st.f.map(function (k) { return shField(k); }).join('') + '</div>' +
      '<p class="fine4">ตัวเลขร้านชุดนี้ใช้ร่วมกับเครื่องมืออื่นใน Business Lab กรอกครั้งเดียว</p></div></main>' + footStep();
  }

  /* ============================================================ เงินก่อนเปิดร้าน */
  function typeTag(t) { return '<span class="tg2 t-' + t + '">' + SU_TYPES[t] + '</span>'; }
  function viewSu() {
    var op = state.op, m = state.model, kinds = suKinds(m, state.where), T = suTotals(op, state.inp);
    var have = {}; op.items.forEach(function (it) { have[it.k] = (have[it.k] || 0) + 1; });
    var mode = segF('op.mode', 'จะใส่เงินก่อนเปิดร้านแบบไหน', [['items', 'ทีละรายการ'], ['lump', 'ยอดรวมก้อนเดียว']], 'ทีละรายการ: ระบบรู้ว่าเงินไหนได้คืน เงินไหนจมในของ และอุปกรณ์ใช้ได้กี่ปี จึงบอกคืนทุนได้ละเอียดกว่า');
    var body = '';
    if (op.mode === 'lump') body = fld('op.lump', 'เงินก่อนเปิดร้านทั้งหมด', { t: 'money', help: 'รวมทุกอย่างที่ต้องจ่ายก่อนเปิด ยกเว้นค่าเช่าช่วงตกแต่ง (ใส่ให้เอง)' });
    if (op.mode === 'items') {
      body = '<div class="field" data-need="su-pick"><span class="lab">แตะรายการที่ต้องจ่าย</span><div class="chips pick2">' + kinds.map(function (k) {
        var on = !!have[k] && k !== 'other';
        return '<button type="button" class="chip" data-act="su-tog" data-k="' + k + '" aria-pressed="' + on + '">' + (k === 'other' ? '+ ' : '') + esc(suName({ k: k }, m)) + '</button>';
      }).join('') + '</div></div>' +
        op.items.map(function (it, j) {
          var base = 'su.' + j + '.', h = suHint(it.k, m);
          return '<section class="su2" data-su="' + j + '"><div class="su-h"><span class="su-n">' + tw(suName(it, m)) + '</span>' + typeTag(it.t) + '<button type="button" class="ib sm" data-act="su-del" data-j="' + j + '" aria-label="ลบ ' + esc(suName(it, m)) + '">' + ICON.x + '</button></div>' +
            (it.k === 'other' ? fld(base + 'name', 'ชื่อรายการ', { t: 'text', ph: 'เช่น ค่าทดลองสูตร' }) + segF(base + 't', 'เงินนี้เป็นแบบไหน', [['gone', 'หมดไป'], ['back', 'ได้คืน'], ['stock', 'จมในของ'], ['equip', 'อุปกรณ์']]) : '') +
            (it.t === 'equip' ? '<div class="two">' + fld(base + 'amt', 'ราคา', { t: 'money', help: h }) + fld(base + 'y', 'ใช้ได้ประมาณกี่ปี', { t: 'dec', suf: 'ปี' }) + '</div>' : fld(base + 'amt', 'จำนวนเงิน', { t: 'money', help: h })) + '</section>';
        }).join('');
    }
    var fit = T.fit > 0 ? '<div class="su2 auto"><div class="su-h"><span class="su-n">ค่าเช่าช่วงตกแต่ง ' + fmtN(n0(op.fit)) + ' เดือน</span>' + typeTag('gone') + '</div><p class="fine4">' + fmtN(T.fit) + ' บาท · ใส่ให้จากค่าเช่าต่อเดือน (แก้ได้ที่ข้อช่วงเปิดร้าน)</p></div>' : '';
    var tot = op.mode ? '<div id="sutot" class="tot4 su-tot" role="status"><span>รวม</span><b class="num">' + fmtN(T.all) + '</b><small>บาท</small></div>' +
      (op.mode === 'items' && T.all > 0 ? '<p class="fine4" id="sutyp">หมดไป ' + fmtN(T.gone + T.equip) + ' (อุปกรณ์ ' + fmtN(T.equip) + ') · ได้คืน ' + fmtN(T.back) + ' · จมในของ ' + fmtN(T.stock) + '</p>' : '') : '';
    return stepBar('เงินก่อนเปิดร้าน') + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() +
      qHead('ก่อนเปิดร้าน ต้องจ่ายอะไรบ้าง', 'ทุกอย่างที่ต้องจ่ายก่อนวันเปิด · ค่าเช่าที่จ่ายล่วงหน้า 1 เดือนคือค่าเช่าเดือนแรก ไม่ต้องใส่ (คิดในค่าใช้จ่ายทุกเดือนแล้ว)', 'su') +
      '<div class="qfields">' + mode + body + fit + tot + '</div></div></main>' + footStep();
  }

  /* ============================================================ เงินที่มี */
  function viewSave() {
    return stepBar('เงินที่มี') + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() +
      qHead('มีเงินสำหรับเปิดร้านนี้เท่าไร', 'เงินทั้งหมดที่ตั้งใจใช้กับร้านนี้ ทั้งจ่ายก่อนเปิด และใช้ช่วงยอดขายยังไม่เต็ม', 'save') +
      '<div class="qfields">' + fld('op.savings', 'เงินที่มีสำหรับร้านนี้', { t: 'money', ph: 'เช่น 200,000' }) + '</div>' +
      '<p class="fine4">เงินที่เหลือหลังจ่ายเงินก่อนเปิดร้าน ใช้เป็น “เงินสดพร้อมใช้” ในเครื่องมืออื่นของ Business Lab</p></div></main>' + footStep();
  }

  /* ============================================================ ผล */
  var LVP = { high: ['high', 'ร้ายแรง'], mid: ['mid', 'ปานกลาง'], watch: ['watch', 'ควรเฝ้าระวัง'], note: ['note', 'ข้อสังเกต'] };
  function scOf(R) { return R.sc[state.sc] || R.base; }
  function scLabel(k, R) { return k === 'low' ? 'น้อยกว่า ' + fmtN(R.range) + '%' : k === 'high' ? 'มากกว่า ' + fmtN(R.range) + '%' : 'ตามที่คาด'; }
  function volTxt(v) { var u = Ux(); return (state.inp.volumePer === 'month' ? 'เดือนละ ' : 'วันละ ') + fmtN(Math.ceil(v - 1e-9)) + ' ' + u; }
  function payTxt(m) { return m === null ? 'เกิน 5 ปี' : 'เดือนที่ ' + m; }
  function panelHtml(R) {
    var B = scOf(R), short = B.left < -0.5;
    return '<section class="panel res4" id="rpanel"><div class="hq"><h1 class="eyebrow">เงินที่ต้องมีทั้งหมด</h1>' + qmBtn('need', 'เงินที่ต้องมีทั้งหมดคิดอย่างไร') + '</div>' +
      '<div class="bignum">' + anim('need', B.need) + '<span class="u">บาท</span></div>' +
      '<div class="walk"><div><span>จ่ายก่อนเปิดร้าน</span><b>' + fmtN(B.all) + '</b></div>' +
      (B.low < -0.5 ? '<div><span>ควักเพิ่มช่วงยอดขายยังไม่พอจ่าย</span><b>' + fmtN(-B.low) + '</b></div>' : '') +
      '<div class="k"><span>คุณมี ' + fmtN(B.save) + ' · ' + (short ? 'ขาดอีก' : 'เหลือช่วงตึงที่สุด' + (B.lowM ? ' (เดือนที่ ' + B.lowM + ')' : '')) + '</span><b>' + (short ? '−' : '') + fmtN(Math.abs(B.left)) + '</b></div></div>' +
      qmT('need', 'เงินที่ต้องมี = เงินก่อนเปิดร้าน + เงินที่ต้องควักเพิ่มจนถึงเดือนที่เงินในมือต่ำที่สุด (ช่วงยอดขายยังไม่พอจ่ายค่าใช้จ่ายทุกเดือน) · คิดเดือนต่อเดือน 5 ปี ไม่ใช้กฎ “เผื่อ 3 หรือ 6 เดือน”') + '</section>';
  }
  function scSeg(R) {
    return '<div class="seg wide sc2" role="group" aria-label="ถ้าขายได้"><span class="sr">ถ้าขายได้</span>' + ['low', 'mid', 'high'].map(function (k) {
      return '<button type="button" data-act="sc" data-v="' + k + '" aria-pressed="' + (state.sc === k) + '">' + scLabel(k, R) + '</button>';
    }).join('') + '</div>';
  }
  function tilesHtml(R) {
    var B = scOf(R), S = R.S, be = S.be && !S.be.impossible ? S.be.vol : null, vol = n0(state.inp.volume) * (state.sc === 'low' ? 1 - R.range / 100 : state.sc === 'high' ? 1 + R.range / 100 : 1);
    var prof = state.sc === 'mid' ? S.profit : (compute(scaleVol(state.inp, state.model, vol / n0(state.inp.volume)), state.model).profit);
    var st = B.net1 >= 0 ? null : Math.max(0, B.start) / -B.net1;
    return '<div class="ovg m4" id="tiles">' +
      '<div class="ovt"><span class="k">ขาย' + (state.inp.volumePer === 'month' ? 'เดือนละ' : 'วันละ') + 'เท่าไรถึงไม่ขาดทุน</span><span class="v">' + (be === null ? 'ขายเท่าไรก็ขาดทุน' : fmtN(Math.ceil(be - 1e-9)) + '<small>' + esc(Ux()) + '</small>') + '</span><span class="n">คาดไว้ ' + fmtN(vol, 1) + ' ' + esc(Ux()) + '</span></div>' +
      '<div class="ovt"><span class="k">คืนเงินที่จ่ายหมดไป</span><span class="v">' + payTxt(B.payS) + '</span><span class="n">' + (Math.abs(B.all - B.spent) > 0.5 ? 'รวมมัดจำและของในสต็อก: ' + payTxt(B.payA) : 'ไม่มีเงินที่ได้คืนหรือจมในของ') + '</span></div>' +
      '<div class="ovt"><span class="k">ถ้ายอดขายค้างที่เดือนแรก เงินอยู่ได้</span><span class="v">' + (st === null ? 'ไม่ขาดเงิน' : fmtN(Math.floor(st * 10) / 10, 1) + '<small>เดือน</small>') + '</span><span class="n">' + (st === null ? 'เดือนแรกขายได้พอจ่ายแล้ว' : 'ขาดเดือนละ ' + fmtN(-B.net1)) + '</span></div>' +
      '<div class="ovt"><span class="k">' + (prof < 0 ? 'ขาดทุน' : 'กำไร') + 'ต่อเดือนเมื่อยอดขายเต็ม</span><span class="v">' + moneyTxt(prof) + '</span><span class="n">' + (n0(state.inp.ownerSalary) > 0 ? 'หักเงินเดือนตัวเองแล้ว' : 'ยังไม่ได้หักเงินเดือนตัวเอง') + (S.dep > 0.5 ? ' · กันไว้ซื้ออุปกรณ์ใหม่ ' + fmtN(S.dep) : '') + '</span></div></div>';
  }
  function chartHtml(R) {
    var L = { low: R.sc.low, mid: R.sc.mid, high: R.sc.high }, N = OP_SHOW, W = 330, H = 190, pl = 46, pr = 10, pt = 14, pb = 26;
    var series = {}, all = [];
    Object.keys(L).forEach(function (k) { var s = L[k], a = [s.start]; for (var i = 0; i < N; i++) a.push(s.months[i].bal); series[k] = a; all = all.concat(a); });
    var mx = Math.max.apply(null, all.concat([0])), mn = Math.min.apply(null, all.concat([0]));
    var step = niceStep((mx - mn) / 4 || 1), top = Math.ceil(mx / step) * step, bot = Math.floor(mn / step) * step;
    if (top === bot) top = bot + step;
    var x = function (m) { return pl + (W - pl - pr) * m / N; }, y = function (v) { return pt + (H - pt - pb) * (top - v) / (top - bot); };
    var path = function (a) { return a.map(function (v, m) { return (m ? 'L' : 'M') + x(m).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' '); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="เงินในมือหลังเปิดร้าน ' + N + ' เดือน">';
    for (var v = bot; v <= top + 1e-6; v += step) s += '<line class="' + (Math.abs(v) < 1e-6 ? 'zero' : 'grid') + '" x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '"/><text class="ax" x="' + (pl - 6) + '" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end">' + shortB(v) + '</text>';
    [1, 6, 12, 18, 24].forEach(function (m) { s += '<text class="axth" x="' + x(m).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + (m === 1 ? 'เดือน 1' : m) + '</text>'; });
    ['low', 'high', 'mid'].forEach(function (k) { if (k !== state.sc) s += '<path class="line ghost" d="' + path(series[k]) + '"/>'; });
    s += '<path class="line" d="' + path(series[state.sc]) + '"/>';
    var B = scOf(R), lm = B.lowM <= N ? B.lowM : 0, lv = series[state.sc][lm];
    s += '<circle class="dot" cx="' + x(lm).toFixed(1) + '" cy="' + y(lv).toFixed(1) + '" r="4"/>';
    var lx = x(lm) + 8, anchor = 'start'; if (lx > W - 120) { lx = x(lm) - 8; anchor = 'end'; }
    s += '<text class="endlab" x="' + lx.toFixed(1) + '" y="' + (y(lv) - 10).toFixed(1) + '" text-anchor="' + anchor + '">' + (lv < 0 ? 'ติดลบที่สุด ' : 'ตึงที่สุด ') + moneyTxt(lv) + '</text></svg>';
    return '<section class="card cash2" id="cashc">' + hq('h3', 'เงินในมือหลังเปิดร้าน', 'cash', 'เงินที่มี หักเงินก่อนเปิดร้าน แล้วบวกลบเงินที่เหลือแต่ละเดือน (ยอดขายหักต้นทุน ค่าธรรมเนียม และค่าใช้จ่ายทุกเดือน) · เส้นเข้ม = ' + scLabel(state.sc, R) + ' · เส้นจาง = อีก 2 แบบ') +
      '<div class="chart" aria-hidden="false">' + s + '</div><div class="legend"><span><i></i>ขาย' + scLabel(state.sc, R) + '</span><span><i class="g"></i>อีก 2 แบบ</span></div></section>';
  }
  function niceStep(r) { var p = Math.pow(10, Math.floor(Math.log10(Math.max(1, r)))), f = r / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; }
  function shortB(v) { var a = Math.abs(v), s = a >= 1e6 ? fmtN(a / 1e6, 1) + 'M' : a >= 1000 ? fmtN(a / 1000, 0) + 'k' : fmtN(a); return (v < 0 ? '−' : '') + s; }
  function enoughHtml(R) {
    var E = R.enough; if (!E) return '';
    var rows = '';
    rows += '<div class="en2"><span>ขายได้อย่างน้อย' + (state.inp.volumePer === 'month' ? 'เดือนละ' : 'วันละ') + '</span><b>' + (E.minVol === null ? 'ไม่พอ' : fmtN(Math.ceil(E.minVol - 1e-9)) + '<small>' + esc(Ux()) + '</small>') + '</b></div>';
    if (E.ok) {
      rows += '<div class="en2"><span>ยอดขายเต็มภายใน</span><b>' + (E.delayCapped ? 'เกิน 5 ปี' : 'เดือนที่ ' + E.fullBy) + '</b></div>';
      rows += '<div class="en2"><span>เงินก่อนเปิดเกินงบได้ไม่เกิน</span><b>' + fmtN(E.over) + '<small>บาท</small></b></div>';
    }
    return '<section class="card enough2" id="enough">' + hq('h3', 'เงิน ' + fmtN(E.save) + ' บาท ' + (E.ok ? 'พอ ถ้า' : 'ยังไม่พอ'), 'enough', 'ทีละเรื่อง เรื่องอื่นเป็นไปตามที่คาด · ' + (E.ok ? 'ตัวเลขนี้คือจุดที่เงินที่มีพอดีพอ' : 'ขาดอีก ' + fmtN(-E.over) + ' บาท ถ้ายอดขายเป็นไปตามที่คาด · แถวแรกบอกยอดขายที่ทำให้เงินที่มีพอดีพอ')) +
      rows + '<p class="fine4">ทีละเรื่อง เรื่องอื่นเป็นไปตามที่คาด</p></section>';
  }
  function sensHtml(R) {
    var rows = R.sens, max = Math.max.apply(null, rows.map(function (x) { return Math.max(0, x.more); }).concat([1]));
    var body = rows.map(function (x) {
      var w = Math.max(0, x.more) / max * 100;
      return '<div class="rk2" data-sens="' + x.k + '"><span>' + tw(SENS_TXT[x.k](x.p, R).replace(/^ถ้า/, '')) + '</span><i aria-hidden="true"><b style="width:' + w.toFixed(1) + '%"></b></i><em>' + (x.more >= 0 ? '+' : '−') + fmtN(Math.abs(x.more)) + '</em>' +
        '<small>' + (x.left !== null && x.left < -0.5 ? 'เงินไม่พอ ขาด ' + fmtN(-x.left) : x.payS === null ? 'คืนเงินที่จ่ายหมดไปเกิน 5 ปี' : x.payMore > 0 ? 'คืนเงินช้าลง ' + x.payMore + ' เดือน' : 'คืนเงินทันเดือนเดิม') + '</small></div>';
    }).join('');
    var ed = state.sensEdit ? '<div class="sens-ed">' + [['over', 'เงินก่อนเปิดเกินงบ', '%', 1, 100], ['sales', 'ขายได้น้อยกว่าที่คาด', '%', 1, 90], ['delay', 'ยอดขายเต็มช้าลง', 'เดือน', 1, 24], ['fixed', 'ค่าใช้จ่ายทุกเดือนเพิ่ม', '%', 1, 100], ['cost', 'ต้นทุนต่อ' + Ux() + 'เพิ่ม', '%', 1, 100]].map(function (d) {
      var v = (state.op.sens || {})[d[0]]; if (v === undefined) v = SENS_DEF[d[0]];
      return '<div class="trow"><span class="lab">' + esc(d[1]) + '</span><div class="tctl"><button type="button" class="stp" data-act="sstep" data-k="' + d[0] + '" data-d="-1" data-min="' + d[3] + '" data-max="' + d[4] + '" aria-label="ลด ' + esc(d[1]) + '">−</button><span class="tv"><b class="num">' + fmtN(v) + '</b><small>' + d[2] + '</small></span><button type="button" class="stp" data-act="sstep" data-k="' + d[0] + '" data-d="1" data-min="' + d[3] + '" data-max="' + d[4] + '" aria-label="เพิ่ม ' + esc(d[1]) + '">+</button></div></div>';
    }).join('') + '</div>' : '';
    return '<section class="card rank2" id="sens">' + hq('h3', 'ถ้าเรื่องนี้แย่ลง ต้องใช้เงินเพิ่ม', 'sens', 'ทีละเรื่อง เรียงจากต้องใช้เงินเพิ่มมากไปน้อย (บาท) · เทียบกับยอดขายตามที่คาด') + body +
      '<button type="button" class="lnk" data-act="sens-ed" aria-expanded="' + state.sensEdit + '">' + (state.sensEdit ? 'เสร็จ' : 'เปลี่ยน % ที่ใช้ทดสอบ') + '</button>' + ed + '</section>';
  }
  /* ลองปรับบนหน้าผล: ยอดขาย ราคา และยอดขายเต็มช้าลง · ยังไม่แก้ตัวเลขจริงจนกด "ใช้ค่านี้" */
  function trialRes() {
    var T = state.trial; if (!T) return null;
    var inp = JSON.parse(JSON.stringify(state.inp)), op = JSON.parse(JSON.stringify(state.op));
    if (T.volume !== undefined) inp.volume = T.volume;
    if (T.price !== undefined) inp.price = T.price;
    if (T.delay) op.ramp = { p: 'custom', c: rampDelay(rampCurve(state.op), T.delay) };
    return { inp: inp, op: op, R: RC(inp, state.model, op) };
  }
  function tvFmt(v) { return (Math.round(v * 100) / 100).toLocaleString('th-TH', { maximumFractionDigits: 2 }); }
  function stepper(k, label, cur, step, unit, min, max) {
    var T = state.trial || {}, v = T[k] !== undefined ? T[k] : cur, id = 'tv-' + k;
    return '<div class="trow"><label for="' + id + '">' + esc(label) + '</label><div class="tctl"><button type="button" class="stp" data-act="tstep" data-k="' + k + '" data-d="' + (-step) + '" data-min="' + min + '" data-max="' + max + '" aria-label="ลด' + esc(label) + '">−</button>' +
      '<span class="tv"><input id="' + id + '" data-tv="' + k + '" data-min="' + min + '" data-max="' + max + '" inputmode="decimal" value="' + esc(tvFmt(v)) + '"><small>' + esc(unit) + '</small></span>' +
      '<button type="button" class="stp" data-act="tstep" data-k="' + k + '" data-d="' + step + '" data-min="' + min + '" data-max="' + max + '" aria-label="เพิ่ม' + esc(label) + '">+</button></div>' +
      '<small class="tcur" data-tcur="' + k + '">' + (Math.abs(v - cur) > 1e-9 ? 'ตัวเลขปัจจุบัน: ' + esc(tvFmt(cur)) + ' ' + esc(unit) : '') + '</small></div>';
  }
  function tStep(v) { v = Math.abs(v); return v < 20 ? 1 : v < 200 ? 1 : v < 1000 ? 5 : v < 5000 ? 10 : 100; }
  function tryHtml(R) {
    var X = trialRes(), B = R.base, inp = state.inp, u = Ux(), d = '';
    if (X && X.R.ok) {
      var N = X.R.base, dn = N.need - B.need;
      d = '<p class="dl4" id="dl4">เงินที่ต้องมี ' + (Math.abs(dn) < 0.5 ? 'เท่าเดิม' : '<b class="' + (dn < 0 ? 'up' : 'down') + '">' + (dn < 0 ? 'ลดลง ' : 'เพิ่มขึ้น ') + fmtN(Math.abs(dn)) + '</b> บาท (เป็น ' + fmtN(N.need) + ')') +
        ' · คืนเงินที่จ่ายหมดไป ' + payTxt(N.payS) + (N.payS !== B.payS ? ' (เดิม ' + payTxt(B.payS) + ')' : '') + (N.left < -0.5 ? ' · เงินไม่พอ ขาด ' + fmtN(-N.left) : '') + '</p>';
    } else d = '<p class="dl4" id="dl4">ลองเปลี่ยนตัวเลขด้านบน แล้วดูว่าเงินที่ต้องมีและคืนทุนเปลี่ยนอย่างไร</p>';
    return '<section class="card try4" id="try">' + hq('h3', 'ลองปรับ', 'try', 'ลองเปลี่ยนตัวเลขดูก่อน ยังไม่แก้ตัวเลขจริง · กด “ใช้ค่านี้” ถ้าอยากใช้ค่าที่ลอง') +
      stepper('volume', (state.model === 'service' ? 'ลูกค้า' : 'ขายได้') + (inp.volumePer === 'month' ? 'เดือนละ' : 'วันละ'), n0(inp.volume), tStep(n0(inp.volume)), u, 0, 1e7) +
      stepper('price', 'ราคาเฉลี่ยต่อ' + u, n0(inp.price), tStep(n0(inp.price)), 'บาท', 0.01, 1e9) +
      stepper('delay', 'ยอดขายเต็มช้าลง', 0, 1, 'เดือน', 0, 24) +
      d + (state.trial ? '<div class="tbtns"><button type="button" class="sbtn" data-act="t-use">ใช้ค่านี้</button><button type="button" class="sbtn light" data-act="t-reset">' + ICON.undo + 'คืนค่าเดิม</button></div>' : '') + '</section>';
  }
  function targetHtml(R) {
    var t = state.op.target || {}, inc = t.income !== null && t.income !== undefined ? t.income : (n0(state.inp.ownerSalary) > 0 ? n0(state.inp.ownerSalary) : 15000), mo = pos(t.months) || 12;
    var A = opTarget(R, inc, mo), u = Ux(), per = state.inp.volumePer === 'month' ? 'เดือนละ' : 'วันละ';
    var ans = function (v, id) { return '<div class="ans2" id="' + id + '"><span>ต้องขาย' + per + '</span><b>' + (v === null || v === undefined ? 'ไม่ได้' : fmtN(Math.ceil(v - 1e-9)) + '<small>' + esc(u) + '</small>') + '</b></div>'; };
    var gstep = function (k, label, v, step, unit, min, max) {
      return '<div class="trow"><span class="lab">' + esc(label) + '</span><div class="tctl"><button type="button" class="stp" data-act="gstep" data-k="' + k + '" data-d="' + (-step) + '" data-min="' + min + '" data-max="' + max + '" aria-label="ลด' + esc(label) + '">−</button><span class="tv"><b class="num">' + fmtN(v) + '</b><small>' + unit + '</small></span><button type="button" class="stp" data-act="gstep" data-k="' + k + '" data-d="' + step + '" data-min="' + min + '" data-max="' + max + '" aria-label="เพิ่ม' + esc(label) + '">+</button></div></div>';
    };
    return '<section class="card back2" id="target">' + hq('h3', 'อยากได้เท่าไร ต้องขาย' + per + 'เท่าไร', 'tg', 'แถวแรก: ยอดขายเมื่อยอดเต็มที่ทำให้ได้เงินเดือนละเท่านี้ (แทนเงินเดือนตัวเองที่ใส่ไว้ · หลังกันไว้ซื้ออุปกรณ์ใหม่) · แถวที่สอง: ยอดขายที่ทำให้คืนเงินที่จ่ายหมดไปทันเดือนที่ตั้งไว้ คิดรวมช่วงยอดขายเดือนแรก ๆ') +
      gstep('income', 'อยากได้เงินเดือนละ', inc, 1000, 'บาท', 0, 1e7) + ans(A.income, 'ta1') +
      gstep('months', 'อยากคืนเงินที่จ่ายหมดไปภายใน', mo, 1, 'เดือน', 1, 60) + ans(A.pay, 'ta2') +
      '<p class="fine4">คาดไว้' + per + ' ' + fmtN(n0(state.inp.volume), 1) + ' ' + esc(u) + '</p></section>';
  }
  function findsHtml(R) {
    if (!R.finds.length) return '<div class="ok-box"><b>ไม่พบปัญหาที่น่ากังวลจากตัวเลขที่ตรวจสอบได้</b><p>เงินที่มีพอ ทั้งตอนขายได้ตามที่คาดและน้อยกว่าที่คาด ' + fmtN(R.range) + '%</p></div>';
    return '<div class="flist">' + R.finds.map(function (f) {
      var lv = LVP[f.lv];
      return '<div class="frow f4"><span class="ft">' + tw(f.t) + '</span><span class="fr-r">' + (f.money !== null && f.money !== undefined ? '<span class="fm">' + (f.ml ? '<small>' + tw(f.ml) + '</small>' : '') + (f.mabs ? fmtN(Math.abs(f.money)) : moneyTxt(f.money)) + '<small>บาท</small></span>' : '') + '</span>' +
        '<span class="pill ' + lv[0] + '">' + lv[1] + '</span><span class="fs">' + tw(f.s) + '</span></div>';
    }).join('') + '</div>';
  }
  function tool1Link() { return window.LAB_HUB ? '<a class="lnk t1l" href="check-numbers.html">ดูกำไร จุดคุ้มทุน และเงินสด 12 เดือนของร้านนี้ ในเช็กตัวเลขร้าน</a>' : ''; }
  function viewResult() {
    var R = R0();
    if (!R.ok) return viewStart();
    var out = bar('<button class="tb" data-act="back" aria-label="กลับหน้าแรก">' + ICON.back + 'หน้าแรก</button>', 'เช็กก่อนเปิดร้าน', state.isSample ? '' : MODELS[state.model].tile) +
      '<main class="screen res4m"><div class="wrap">' +
      (state.isSample ? '<div class="banner4"><span><small>กำลังใช้</small>' + esc(OP_SAMPLES[state.sampleKind].name) + '</span><button class="btn ghost sm" data-act="mine">ใส่ตัวเลขร้านคุณ</button></div>' : '') +
      '<div class="scw"><span class="wh-l">ถ้าขายได้</span>' + scSeg(R) + '</div>' +
      panelHtml(R) + tilesHtml(R) + chartHtml(R) + enoughHtml(R) + sensHtml(R) + tryHtml(R) + targetHtml(R) +
      '<section class="block">' + hq('h2', 'สิ่งที่ตัวเลขบอก', 'fnd', 'บอกปัญหาและขนาดเป็นเงิน ไม่บอกวิธีแก้') + findsHtml(R) + '</section>' +
      tool1Link() + '</div></main>' +
      '<div class="foot foot2" id="foot"><div class="wrap"><button class="btn ghost" data-act="review">แก้ตัวเลข</button><button class="btn" data-act="ask">หาจุดที่ควรตรวจสอบ' + ICON.next + '</button></div></div>';
    return out;
  }

  /* ============================================================ แก้ตัวเลข */
  function rvRow(data, t, v) { return '<button type="button" class="rv-row" data-act="edit"' + data + '><span class="t">' + t + '</span><span class="v">' + v + '</span>' + ICON.chev + '</button>'; }
  function viewReview() {
    var inp = state.inp, op = state.op, u = Ux(), T = suTotals(op, inp), c = rampCurve(op);
    var rows = rvRow(' data-v="sell"', 'ขายอะไร ราคาเท่าไร', esc('ราคาเฉลี่ย ' + fmtN(n0(inp.price), 2) + ' · ต้นทุน ' + fmtN(n0(inp.unitCost), 2) + ' · ค่าธรรมเนียม ' + fmtN(n0(inp.feePct), 2) + '%' + (op.menu && op.menu.length ? ' · จากเมนู ' + op.menu.length + ' อย่าง' : ''))) +
      rvRow(' data-v="vol"', 'คาดว่าจะขายได้', esc(fmtN(n0(inp.volume), 1) + ' ' + u + '/' + perW() + (inp.volumePer === 'day' ? ' · เปิดเดือนละ ' + fmtN(n0(inp.daysOpen)) + ' วัน' : ''))) +
      rvRow(' data-v="open"', 'ช่วงเปิดร้าน', esc((n0(op.fit) > 0 ? (shopW() ? 'ตกแต่ง ' : 'เตรียม ') + fmtN(n0(op.fit)) + ' เดือน · ' : '') + 'เปิด' + monthName(op.openMonth) + ' · ' + (op.seasonAsked === 'yes' ? 'มีเดือนขายดีขายแย่' : 'ขายพอ ๆ กันทั้งปี'))) +
      rvRow(' data-v="ramp"', 'ยอดขายเดือนแรก ๆ', esc((op.ramp.p === 'custom' ? 'ปรับเอง' : RAMP_PRESETS[op.ramp.p].n) + ' · เต็มในเดือนที่ ' + rampFull(c)));
    var fx = FIXED_STEPS.map(function (st, k) {
      var v = st.f.filter(function (x) { var f = fieldDef(x); return f && (!f.show || f.show(inp, state.model)); }).map(function (x) { var f = fieldDef(x); return f.label(inp, state.model) + ' ' + fmtN(n0(inp[x])); }).join(' · ');
      return rvRow(' data-v="fixed" data-k="' + k + '"', st.q, esc(v));
    }).join('');
    rows += fx + rvRow(' data-v="su"', 'เงินก่อนเปิดร้าน', esc(fmtN(T.all) + ' บาท' + (op.mode === 'items' ? ' · ' + op.items.length + ' รายการ' : ' · ยอดรวม'))) +
      rvRow(' data-v="save"', 'เงินที่มี', esc(fmtN(n0(op.savings)) + ' บาท'));
    return bar(backBtn('กลับไปดูผล'), 'แก้ตัวเลข', '') + '<main class="screen"><div class="wrap"><h1 class="sr">แก้ตัวเลข</h1>' +
      '<div class="rv">' + rows + '</div>' +
      '<p class="fine4">ราคา ต้นทุน ยอดขาย และค่าใช้จ่ายทุกเดือน ใช้ร่วมกับเครื่องมืออื่นใน Business Lab · รูปแบบร้าน: ' + esc(MODELS[state.model].tile) + ' เปลี่ยนได้ที่หน้าแรก</p></div></main>' +
      '<div class="foot" id="foot"><div class="wrap"><button class="btn" data-act="result">ดูผล' + ICON.next + '</button></div></div>';
  }

  /* ============================================================ หาจุดที่ควรตรวจสอบ */
  function askList() { return opAskList(R0(), state.where); }
  function viewAsk() {
    var L = askList(); if (state.qidx >= L.length) state.qidx = L.length - 1;
    var q = L[state.qidx], b = QB2[q], a = state.answers[q];
    return bar(backBtn('กลับไปดูผล'), 'หาจุดที่ควรตรวจสอบ', 'ข้อ ' + (state.qidx + 1) + ' จาก ' + L.length) + '<main class="screen"><div class="wrap">' +
      '<div class="prog" aria-hidden="true">' + L.map(function (x, n) { return '<i class="' + (n <= state.qidx ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<h1 class="ask-q">' + tw(b.q) + '</h1><div class="ask-ans" role="group" aria-label="คำตอบ">' + ['yes', 'no', 'unsure'].map(function (v) {
        return '<button type="button" data-act="answer" data-q="' + q + '" data-v="' + v + '" aria-pressed="' + (a === v) + '">' + esc(b.ans[v]) + '</button>';
      }).join('') + '</div>' +
      (state.qidx > 0 ? '<div class="qnav"><button class="lnk" data-act="q-prev">‹ ข้อก่อนหน้า</button></div>' : '') + '</div></main>';
  }
  function flagOf(b, a) { return a === 'unsure' || a === b.risk; }
  function toolsHtml(codes) {
    return '<div class="tools">' + codes.filter(function (c) { return TOOLS[c]; }).map(function (c) {
      return '<button type="button" class="tool" data-act="tool" data-t="' + c + '"><span class="tn">' + esc(TOOLS[c][0]) + '</span><span class="ts">' + esc(TOOLS[c][1]) + '</span>' + ICON.out + '</button>';
    }).join('') + '</div>';
  }
  function viewPoints() {
    var L = askList(), A = state.answers, pts = L.filter(function (q) { return flagOf(QB2[q], A[q]); });
    var out = bar(backBtn('กลับไปดูผล'), 'จุดที่ควรตรวจสอบ', '') + '<main class="screen"><div class="wrap"><h1 class="sr">จุดที่ควรตรวจสอบ</h1>';
    if (!pts.length) out += '<div class="ok-box"><b>ไม่พบจุดที่ควรตรวจสอบจากคำตอบ</b><p>ตอบครบทุกข้อแล้ว ไม่มีข้อที่ต้องตรวจสอบเพิ่ม</p></div>' + toolsHtml(['ver5', 'idea7', 'goal3']);
    else out += '<div class="points">' + pts.map(function (q) {
      var b = QB2[q];
      return '<div class="point"><div class="pt"><span>' + tw(b.p) + '</span>' + (A[q] === 'unsure' ? '<span class="unsure">ไม่แน่ใจ</span>' : '') + '</div><p class="pd">' + esc(b.d) + '</p>' + toolsHtml(b.tools) + '</div>';
    }).join('') + '</div>';
    return out + '<p class="fine4">แผนธุรกิจ (PL2) ยังทำให้ร้านที่เปิดแล้วเท่านั้น</p><div class="skip"><button class="lnk" data-act="ask-again">ตอบใหม่</button></div></div></main>' +
      '<div class="foot" id="foot"><div class="wrap"><button class="btn ghost" data-act="result">กลับไปดูผล</button></div></div>';
  }

  /* ============================================================ RENDER + NAV */
  function render() {
    var v = state.view;
    if (state.model && OP_MODELS.indexOf(state.model) < 0) { state.model = null; v = state.view = 'start'; }
    if (!state.model && v !== 'start') v = state.view = 'start';
    if (state.model && !fxOk(state.inp)) state.askFixed = true;
    if (['result', 'review', 'ask', 'points'].indexOf(v) >= 0 && !flowOk()) {
      var fb = firstBad();
      if (fb) { state.view = v = fb.v; state.k = fb.k; } else v = state.view = 'start';
    }
    if (v === 'fixed' && !state.askFixed && !state.editing) state.askFixed = true;
    if (v === 'fixed' && !FIXED_STEPS[state.k]) state.k = 0;
    if (FLOW_VIEWS.indexOf(v) >= 0 && v !== 'fixed') state.k = 0;
    app.innerHTML = v === 'start' ? viewStart() : v === 'sell' ? viewSell() : v === 'vol' ? viewVol() : v === 'open' ? viewOpen() : v === 'ramp' ? viewRamp()
      : v === 'fixed' ? viewFixed() : v === 'su' ? viewSu() : v === 'save' ? viewSave() : v === 'review' ? viewReview() : v === 'ask' ? viewAsk() : v === 'points' ? viewPoints() : viewResult();
    runAnim(app);
    var foot = $('#foot');
    document.documentElement.style.setProperty('--foot-h', (foot ? foot.offsetHeight : 0) + 'px');
    save();
  }
  function go(view, top, noPush) {
    var same = state.view === view && top === false;
    if (top !== false) $$('.toast').forEach(function (x) { x.remove(); });
    state.view = view; render();
    if (!noPush) { if (state.view === 'start') leaveAll(); else { var k = 0; while (needDepth() > hdepth && k++ < 24) hpush(); } }
    if (same) $$('.screen').forEach(function (el) { el.style.animation = 'none'; });
    if (top !== false) { window.scrollTo(0, 0); focusMain(); }
  }
  function goStep(st, top, noPush) { state.view = st.v; state.k = st.k; go(st.v, top, noPush); }
  function goBack(noPush) {
    var v = state.view;
    if (FLOW_VIEWS.indexOf(v) >= 0) {
      if (state.editing) { var cm = cancelEdit(); state.editing = false; go(flowOk() ? 'review' : 'start', true, noPush); if (cm) toast(cm); return; }
      var S = flowSteps(), i = flowIdx();
      if (i > 0) goStep(S[i - 1], true, noPush); else go('start', true, noPush);
    } else if (v === 'review' || v === 'ask' || v === 'points') go('result', true, noPush);
    else if (v !== 'start') { state.trial = null; go('start', true, noPush); }
  }
  function cancelEdit() {
    if (!state.edOrig) return null;
    var msg = null;
    if (!flowOk()) { state.inp = state.edOrig.inp; state.op = state.edOrig.op; msg = 'ยกเลิกตัวเลขที่ยังไม่ครบ ใช้ตัวเลขเดิม'; }
    state.edOrig = null;
    return msg;
  }
  var hdepth = 0, leaving = false;
  function needDepth() {
    var v = state.view;
    if (v === 'start') return 0;
    if (v === 'result') return 1;
    if (v === 'review' || v === 'ask' || v === 'points') return 2;
    if (FLOW_VIEWS.indexOf(v) >= 0) return state.editing ? 3 : Math.max(0, flowIdx()) + 1;
    return 1;
  }
  function hpush() { try { history.pushState({ labOpen: 1, d: hdepth + 1 }, ''); hdepth++; } catch (e) { /* ignore */ } }
  function leaveAll() { if (hdepth > 0) { var k = hdepth; hdepth = 0; leaving = true; try { history.go(-k); } catch (e) { leaving = false; } } }
  function readDepth(st) { return st && st.labOpen && typeof st.d === 'number' ? st.d : 0; }
  function topUp() { var k = 0; while (hdepth < needDepth() && k++ < 24) hpush(); }
  function goBackBtn() { if (hdepth > 0) { try { history.back(); return; } catch (e) { /* ignore */ } } goBack(); }
  function onPop(ev) {
    hdepth = readDepth(ev.state);
    if (leaving) { leaving = false; return; }
    $$('.toast').forEach(function (x) { x.remove(); });
    if (state.view === 'start') { leaveAll(); return; }
    goBack(true);
    if (state.view === 'start') leaveAll();
  }
  function focusMain() { var h = $('main h1') || $('main h2'); if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } } }
  function toast(msg) {
    var o = $('.toast'); if (o) o.remove();
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200);
  }
  function showNeed(path, msg) {
    var node = $('[data-need="' + path + '"]');
    if (!node) return;
    $$('.field.need').forEach(function (x) { x.classList.remove('need'); var mm = $('.need-msg', x); if (mm) mm.remove(); });
    node.classList.add('need');
    var m = document.createElement('p'); m.className = 'need-msg'; m.textContent = msg || 'ยังไม่ได้ตอบข้อนี้'; node.appendChild(m);
    var y = node.getBoundingClientRect().top + window.scrollY - 140;
    window.scrollTo(0, Math.max(0, y));
    var inp0 = $('input:not([readonly])', node); if (inp0) { try { inp0.focus({ preventScroll: true }); } catch (e) { inp0.focus(); } }
    else { var b0 = $('button', node); if (b0) b0.focus({ preventScroll: true }); }
  }

  /* ============================================================ EVENTS */
  function chooseModel(m) {
    var sh = typeof LabShop !== 'undefined' ? LabShop.get() : null;
    var prev = state.model && !state.isSample ? { model: state.model, inp: state.inp, op: state.op } : null;
    var mine = state.mine && state.mine.model === m ? state.mine : null;
    state.isSample = false; state.sampleKind = null; state.model = m; state.answers = {}; state.trial = null; state.editing = false; state.sc = 'mid';
    state.op = mine ? mine.op : prev ? prev.op : emptyOp();
    if (sh && sh.model === m) { state.inp = advNormalize(JSON.parse(JSON.stringify(sh.inp)), m); state.link = 'own'; lastPut = sh.model + '|' + JSON.stringify(sh.inp); }
    else if (mine) { state.inp = mine.inp; state.link = 'own'; }
    else {
      var inp = { volumePer: (prev && prev.inp.volumePer) || MODELS[m].defPer || 'day', unitLabel: MODELS[m].defUnit };
      var src = sh ? sh.inp : prev ? prev.inp : null;
      if (src) FX.forEach(function (k) { if (src[k] !== undefined) inp[k] = src[k]; });
      if (prev && prev.inp.daysOpen !== undefined) inp.daysOpen = prev.inp.daysOpen;
      state.inp = inp; state.link = sh && OP_MODELS.indexOf(sh.model) < 0 ? 'local' : 'own';
    }
    if (MODELS[m].units.indexOf(state.inp.unitLabel) < 0) state.inp.unitLabel = MODELS[m].defUnit;
    state.op.where = state.where;
    /* รายการเงินก่อนเปิดที่ไม่มีในร้านแบบใหม่ ตัดออก */
    state.op.items = (state.op.items || []).filter(function (it) { return SU_CAT[it.k] && (!SU_CAT[it.k].m || SU_CAT[it.k].m.indexOf(m) >= 0); });
    state.mine = null;
    state.askFixed = !fxOk(state.inp);
  }
  function useSample(k) {
    k = k || sampleKindFor();
    var S = opSample(k);
    if (!state.isSample && state.model) state.mine = { model: state.model, inp: state.inp, op: state.op, link: state.link };
    state.isSample = true; state.sampleKind = k; state.model = S.m; state.inp = S.inp; state.op = S.op; state.answers = {}; state.trial = null; state.editing = false; state.sc = 'mid';
  }
  function leaveSample() {
    var mine = state.mine;
    state.isSample = false; state.sampleKind = null; state.trial = null;
    if (mine && OP_MODELS.indexOf(mine.model) >= 0) { state.model = mine.model; state.inp = mine.inp; state.op = mine.op; state.link = mine.link || 'own'; state.mine = null; }
    else {
      var sh = typeof LabShop !== 'undefined' ? LabShop.get() : null;
      state.model = null; state.mine = null; state.inp = {}; state.op = emptyOp();
      if (sh && OP_MODELS.indexOf(sh.model) >= 0) chooseModel(sh.model);
    }
    state.answers = {}; state.sc = 'mid';
  }
  function startFlow() {
    state.editing = false; state.askFixed = !fxOk(state.inp); state.op.where = state.where;
    var fb = firstBad();
    if (fb) goStep(fb); else go('result');
  }
  function stepNext() {
    var S = flowSteps(), i = flowIdx(), st = { v: state.view, k: state.k };
    var miss = stepMissing(st);
    if (miss) { showNeed(miss[0], miss[1]); return; }
    if (state.editing) { stepDone(); return; }
    if (i < S.length - 1) goStep(S[i + 1]);
    else { var fb = firstBad(); if (fb) { goStep(fb); var m2 = stepMissing(fb); if (m2) showNeed(m2[0], m2[1]); } else { state.askFixed = false; go('result'); } }
  }
  function stepDone() {
    var st = { v: state.view, k: state.k }, miss = stepMissing(st);
    if (miss) { showNeed(miss[0], miss[1]); return; }
    var fb = firstBad();
    if (fb) { state.view = fb.v; state.k = fb.k; go(fb.v, true); var m2 = stepMissing(fb); if (m2) showNeed(m2[0], m2[1]); toast('ยังมีข้อที่ต้องตอบ'); return; }
    state.editing = false; state.edOrig = null; go('review');
  }
  function refocus(sel) { var b = $(sel); if (b) { try { b.focus({ preventScroll: true }); } catch (e) { b.focus(); } } }
  function rampEditable() { var r = state.op.ramp; if (r.p !== 'custom') { r.c = rampCurve(state.op); r.p = 'custom'; } return r.c; }
  function onClick(e) {
    var t = e.target.closest('[data-act]');
    if (!t || t.disabled) return;
    var a = t.getAttribute('data-act');
    switch (a) {
      case 'theme': {
        var nt = themeNow() === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nt);
        try { localStorage.setItem('lab-theme', nt); } catch (er) { /* ignore */ }
        t.innerHTML = nt === 'dark' ? ICON.sun : ICON.moon;
        if (state.view === 'result') go('result', false);
        break;
      }
      case 'where': {
        state.where = t.getAttribute('data-v'); state.op.where = state.where;
        if (state.isSample && OP_SAMPLES[state.sampleKind].where !== state.where && state.where === 'online') useSample('online');
        go('start', false); refocus('[data-act="where"][data-v="' + state.where + '"]'); break;
      }
      case 'sample': useSample(); go('result'); announce('กำลังใช้' + OP_SAMPLES[state.sampleKind].name); break;
      case 'sample1': { var sk = t.getAttribute('data-k'); state.where = OP_SAMPLES[sk].where; useSample(sk); go('result'); announce('กำลังใช้' + OP_SAMPLES[sk].name); break; }
      case 'mine': leaveSample(); if (state.model) startFlow(); else go('start'); break;
      case 'model': {
        var nm = t.getAttribute('data-m');
        if (state.isSample) leaveSample();
        if (state.model === nm) { startFlow(); break; }
        chooseModel(nm); startFlow(); break;
      }
      case 'continue': startFlow(); break;
      case 'back': goBackBtn(); break;
      case 'step-next': stepNext(); break;
      case 'step-done': stepDone(); break;
      case 'per': {
        var nv = t.getAttribute('data-v'), cur = state.inp.volumePer;
        if (nv !== cur) {
          var had = num(state.inp.volume) !== null, days = pos(state.inp.daysOpen) || 30, f = nv === 'month' ? days : 1 / days;
          if (had && (cur === 'day' || cur === 'month')) {
            state.inp.volume = Math.round(num(state.inp.volume) * f * 100) / 100;
            ['capacity'].forEach(function (k) { var v = num(state.inp[k]); if (v !== null) state.inp[k] = Math.round(v * f * 100) / 100; });
            if (nv === 'day' && pos(state.inp.daysOpen) === null) state.inp.daysOpen = days;
          }
          state.inp.volumePer = nv; go('vol', false); refocus('[data-act="per"][data-v="' + nv + '"]');
          if (had && (cur === 'day' || cur === 'month')) toast(nv === 'month' ? 'เปลี่ยนเป็นต่อเดือนแล้ว (คูณ ' + fmtN(days) + ' วัน)' : 'เปลี่ยนเป็นต่อวันแล้ว (หาร ' + fmtN(days) + ' วัน แก้จำนวนวันได้)');
        }
        break;
      }
      case 'pset': {
        var path = t.getAttribute('data-path'), raw = t.getAttribute('data-v'), val = t.getAttribute('data-num') === '1' ? +raw : raw;
        setP(path, val);
        if (path === 'op.mode' && val === 'lump' && num(state.op.lump) === null && state.op.items.length) state.op.lump = suTotals(Object.assign({}, state.op, { mode: 'items' }), state.inp).all - fitRent(state.op, state.inp);
        if (path === 'op.seasonAsked' && val === 'yes' && !state.inp.season) state.inp.season = { high: [], low: [] };
        if (/^su\.\d+\.t$/.test(path) && val === 'equip') { var ie = state.op.items[+path.split('.')[1]]; if (ie && !pos(ie.y)) ie.y = 5; }
        go(state.view, false); refocus('[data-act="pset"][data-path="' + path + '"][data-v="' + raw + '"]'); break;
      }
      case 'ss-tog': {
        var cc = +t.getAttribute('data-c'), s = state.inp.season = state.inp.season || { high: [], low: [] };
        s.high = s.high || []; s.low = s.low || [];
        var inH = s.high.indexOf(cc), inL = s.low.indexOf(cc);
        if (inH >= 0) { s.high.splice(inH, 1); s.low.push(cc); } else if (inL >= 0) s.low.splice(inL, 1); else s.high.push(cc);
        s.high.sort(function (x, y) { return x - y; }); s.low.sort(function (x, y) { return x - y; });
        go('open', false); refocus('[data-act="ss-tog"][data-c="' + cc + '"]'); break;
      }
      case 'mn-on': {
        var p0 = num(state.inp.price), c0 = num(state.inp.unitCost);
        state.op.menu = [{ name: '', price: p0, cost: c0, share: 100 }];
        go('sell', false); refocus('#f-mn-0-name'); break;
      }
      case 'mn-add': { state.op.menu.push({ name: '', price: null, cost: null, share: null }); go('sell', false); refocus('#f-mn-' + (state.op.menu.length - 1) + '-name'); break; }
      case 'mn-del': { state.op.menu.splice(+t.getAttribute('data-i'), 1); if (!state.op.menu.length) state.op.menu = null; else menuApply(); go('sell', false); break; }
      case 'mn-off': state.op.menu = null; go('sell', false); refocus('#f-inp-price'); break;
      case 'fh-on': state.op.fh = { share: null, rate: null }; go('sell', false); refocus('#f-fh-share'); break;
      case 'fh-off': state.op.fh = null; go('sell', false); refocus('#f-inp-feePct'); break;
      case 'ramp': {
        var rv = t.getAttribute('data-v'), r = state.op.ramp = state.op.ramp || { p: null, c: [] };
        if (rv === 'custom') { r.c = r.p ? rampCurve(state.op) : RAMP_PRESETS.r3.c.slice(); r.p = 'custom'; }
        else { r.p = rv; r.c = []; }
        state.rampSel = 0; go('ramp', false); refocus('[data-act="ramp"][data-v="' + rv + '"]'); break;
      }
      case 'rb': { state.rampSel = +t.getAttribute('data-m'); var cv = rampEditable(); while (cv.length < state.rampSel) cv.push(1); go('ramp', false); refocus('[data-act="rb"][data-m="' + state.rampSel + '"]'); break; }
      case 'rstep': {
        var cs = rampEditable(), sel = state.rampSel || 0;
        while (cs.length <= sel) cs.push(1);
        cs[sel] = Math.max(0, Math.min(1.5, Math.round((cs[sel] + +t.getAttribute('data-d')) * 10) / 10));
        while (cs.length && cs[cs.length - 1] === 1) cs.pop();
        go('ramp', false); refocus('[data-act="rstep"][data-d="' + t.getAttribute('data-d') + '"]'); break;
      }
      case 'rlen': {
        var cl = rampEditable(), dd = +t.getAttribute('data-d');
        if (dd > 0 && cl.length < RAMP_MAX) { var lastv = cl.length ? cl[cl.length - 1] : 0.4; cl.push(Math.min(1, lastv)); state.rampSel = cl.length - 1; }
        else if (dd < 0 && cl.length) { cl.pop(); state.rampSel = Math.max(0, cl.length - 1); }
        go('ramp', false); refocus('[data-act="rlen"][data-d="' + dd + '"]'); break;
      }
      case 'su-tog': {
        var kk = t.getAttribute('data-k'), items = state.op.items, at = -1;
        if (kk !== 'other') items.forEach(function (it, j) { if (it.k === kk) at = j; });
        if (at >= 0) items.splice(at, 1);
        else { var cat = SU_CAT[kk]; items.push({ id: newId('u'), k: kk, name: '', amt: null, t: cat.t, y: cat.y || null }); }
        go('su', false);
        if (at < 0) { var nj = items.length - 1, nf = $('#f-su-' + nj + '-' + (kk === 'other' ? 'name' : 'amt')); if (nf) { nf.scrollIntoView({ block: 'center' }); nf.focus({ preventScroll: true }); } }
        else refocus('[data-act="su-tog"][data-k="' + kk + '"]');
        break;
      }
      case 'su-del': { var dj = +t.getAttribute('data-j'), gone = state.op.items[dj]; state.op.items.splice(dj, 1); go('su', false); toast('ลบ' + (gone ? suName(gone, state.model) : 'รายการ') + 'แล้ว'); break; }
      case 'result': state.trial = null; go('result'); break;
      case 'sc': state.sc = t.getAttribute('data-v'); go('result', false); refocus('[data-act="sc"][data-v="' + state.sc + '"]'); announce('ขายได้' + scLabel(state.sc, R0()) + ' ต้องมีเงินทั้งหมด ' + fmtN(scOf(R0()).need) + ' บาท'); break;
      case 'sens-ed': state.sensEdit = !state.sensEdit; liveResult(); refocus('[data-act="sens-ed"]'); break;
      case 'sstep': {
        var sk2 = t.getAttribute('data-k'), S2 = state.op.sens = state.op.sens || {}, v0 = S2[sk2] !== undefined ? S2[sk2] : SENS_DEF[sk2];
        S2[sk2] = Math.max(+t.getAttribute('data-min'), Math.min(+t.getAttribute('data-max'), v0 + +t.getAttribute('data-d')));
        liveResult(); refocus('[data-act="sstep"][data-k="' + sk2 + '"][data-d="' + t.getAttribute('data-d') + '"]'); break;
      }
      case 'tstep': {
        var tk = t.getAttribute('data-k'), d = +t.getAttribute('data-d'), T0 = state.trial || {};
        var curv = tk === 'delay' ? 0 : n0(state.inp[tk]), v1 = T0[tk] !== undefined ? T0[tk] : curv, nv2 = Math.round((v1 + d) * 100) / 100;
        nv2 = Math.max(+t.getAttribute('data-min'), Math.min(+t.getAttribute('data-max'), nv2));
        state.trial = Object.assign({}, T0); state.trial[tk] = nv2;
        liveResult(); refocus('[data-act="tstep"][data-k="' + tk + '"][data-d="' + d + '"]'); break;
      }
      case 't-use': {
        var X = trialRes(); if (!X) break;
        var Tu = state.trial; state.inp = X.inp; state.op = X.op; if (Tu.price !== undefined) state.op.menu = null; state.trial = null;
        go('result', false); toast('ใช้ค่านี้แล้ว'); break;
      }
      case 't-reset': state.trial = null; liveResult(); refocus('#try h3'); break;
      case 'gstep': {
        var gk = t.getAttribute('data-k'), tg = state.op.target = state.op.target || {};
        var cur0 = gk === 'income' ? (tg.income !== null && tg.income !== undefined ? tg.income : (n0(state.inp.ownerSalary) > 0 ? n0(state.inp.ownerSalary) : 15000)) : (pos(tg.months) || 12);
        tg[gk] = Math.max(+t.getAttribute('data-min'), Math.min(+t.getAttribute('data-max'), cur0 + +t.getAttribute('data-d')));
        liveResult(); refocus('[data-act="gstep"][data-k="' + gk + '"][data-d="' + t.getAttribute('data-d') + '"]'); break;
      }
      case 'review': go('review'); break;
      case 'edit': {
        var ev = t.getAttribute('data-v');
        state.editing = true; state.edOrig = { inp: JSON.parse(JSON.stringify(state.inp)), op: JSON.parse(JSON.stringify(state.op)) };
        state.k = +(t.getAttribute('data-k') || 0); go(ev); break;
      }
      case 'ask': {
        var L0 = askList(), first = 0;
        while (first < L0.length - 1 && state.answers[L0[first]]) first++;
        state.qidx = first; go('ask'); break;
      }
      case 'ask-again': state.answers = {}; state.qidx = 0; go('ask'); break;
      case 'answer': {
        var q = t.getAttribute('data-q'), v = t.getAttribute('data-v');
        state.answers[q] = v;
        $$('.ask-ans button').forEach(function (b2) { b2.setAttribute('aria-pressed', String(b2 === t)); });
        setTimeout(function () {
          if (state.view !== 'ask') return;
          var L1 = askList(), i = L1.indexOf(q) + 1;
          while (i < L1.length && state.answers[L1[i]]) i++;
          if (i >= L1.length) { var un = L1.filter(function (x) { return !state.answers[x]; })[0]; if (un) { state.qidx = L1.indexOf(un); go('ask'); } else go('points'); }
          else { state.qidx = i; go('ask'); }
        }, reduced ? 0 : 200);
        break;
      }
      case 'q-prev': state.qidx = Math.max(0, state.qidx - 1); go('ask'); break;
      case 'qm': {
        var qk = t.getAttribute('data-q'), qo = !qmOpen[qk];
        qmOpen[qk] = qo;
        $$('[data-qmt="' + qk + '"]').forEach(function (el) { el.hidden = !qo; });
        $$('[data-act="qm"][data-q="' + qk + '"]').forEach(function (b) { b.setAttribute('aria-expanded', String(qo)); });
        break;
      }
      case 'tool': toast('ตัวอย่างนี้ยังไม่เชื่อมกับเครื่องมือจริง ในเว็บจริงจะเปิด "' + TOOLS[t.getAttribute('data-t')][0] + '" พร้อมตัวเลขร้านคุณ'); break;
    }
  }
  /* หน้าผล: วาดใหม่เฉพาะส่วนที่เปลี่ยน (ช่องที่พิมพ์อยู่ไม่หลุด) */
  function liveResult() {
    var y = window.scrollY, ae = document.activeElement, aid = ae && ae.id;
    var tmp = document.createElement('div'); tmp.innerHTML = viewResult();
    ['#sens', '#target', '#dl4', '.tbtns', '[data-tcur]'].forEach(function (sel) {
      var a2 = $$(sel, app), b2 = $$(sel, tmp);
      a2.forEach(function (el, n) { if (b2[n]) el.outerHTML = b2[n].outerHTML; });
    });
    if (!$('.tbtns', app) && $('.tbtns', tmp)) { var dl = $('#dl4', app); if (dl) dl.insertAdjacentHTML('afterend', $('.tbtns', tmp).outerHTML); }
    if ($('.tbtns', app) && !$('.tbtns', tmp)) $('.tbtns', app).remove();
    $$('[data-tv]', tmp).forEach(function (inp) { var cur = $('#' + inp.id, app); if (cur && cur.id !== aid) cur.value = inp.value; });
    runAnim(app); window.scrollTo(0, y);
    var X = trialRes(); if (X && X.R.ok) announce('เงินที่ต้องมี ' + fmtN(X.R.base.need) + ' บาท');
    save();
  }

  function parseNum(el) {
    var raw = el.value.replace(/[,\s]/g, '').replace(/[−–]/g, '-').replace(/[^\d.\-]/g, '').replace(/-/g, '');
    if (raw === '' || raw === '.') return null;
    var v = parseFloat(raw);
    return isFinite(v) ? v : null;
  }
  var liveT = 0;
  function onInput(e) {
    var el = e.target;
    if (el.hasAttribute('data-path')) {
      var path = el.getAttribute('data-path'), t = el.getAttribute('data-t');
      setP(path, t === 'text' ? el.value : parseNum(el));
      var node = el.closest('.field.need'); if (node) { node.classList.remove('need'); var mm = $('.need-msg', node); if (mm) mm.remove(); }
      clearTimeout(liveT); liveT = setTimeout(refreshLive, 60);
      save();
    } else if (el.hasAttribute('data-tv')) {
      var v = parseNum(el);
      if (v === null) return;
      v = Math.max(+el.getAttribute('data-min'), Math.min(+el.getAttribute('data-max'), v));
      state.trial = Object.assign({}, state.trial || {}); state.trial[el.getAttribute('data-tv')] = v;
      clearTimeout(liveT); liveT = setTimeout(liveResult, 120);
    }
  }
  /* ระหว่างกรอก: แถบสรุป ยอดรวม และช่องที่คิดให้ (ราคาเฉลี่ยจากเมนู ค่าธรรมเนียมจากสัดส่วน) โดยไม่วาดช่องที่พิมพ์อยู่ใหม่ */
  function refreshLive() {
    var s = $('#strip'); if (s) { var tmp = document.createElement('div'); tmp.innerHTML = liveStrip(); if (tmp.firstChild) { s.outerHTML = tmp.firstChild.outerHTML; runAnim($('#strip')); } }
    var ae = document.activeElement, aid = ae && ae.id;
    var put = function (id, v, t) { var el = document.getElementById(id); if (el && el.id !== aid) el.value = fmtIn(v, t); };
    if (state.view === 'sell') {
      if (state.op.menu) { put('f-inp-price', state.inp.price, 'money'); put('f-inp-unitCost', state.inp.unitCost, 'money'); var mt = $('#mtot'), t2 = document.createElement('div'); t2.innerHTML = viewSell(); var nm = $('#mtot', t2); if (mt && nm) mt.outerHTML = nm.outerHTML; }
      if (state.op.fh) put('f-inp-feePct', state.inp.feePct, 'pct');
    }
    if (state.view === 'open') { var s0 = state.inp.season || {}; var hp = $('[data-need="ss.highPct"]'), lp = $('[data-need="ss.lowPct"]'); if (hp) hp.hidden = !(s0.high || []).length; if (lp) lp.hidden = !(s0.low || []).length; }
    if (state.view === 'fixed') FIXED_STEPS[state.k].f.forEach(function (k) { var f = fieldDef(k), node = $('[data-need="inp.' + k + '"]'); if (f && f.show && node) node.hidden = !f.show(state.inp, state.model); });
    if (state.view === 'su') {
      var tmp3 = document.createElement('div'); tmp3.innerHTML = viewSu();
      ['#sutot', '#sutyp'].forEach(function (sel) { var a3 = $(sel), b3 = $(sel, tmp3); if (a3 && b3) a3.outerHTML = b3.outerHTML; else if (!a3 && b3 && sel === '#sutyp') { var tt = $('#sutot'); if (tt) tt.insertAdjacentHTML('afterend', b3.outerHTML); } });
    }
  }
  function onBlur(e) {
    var el = e.target;
    if (!el.hasAttribute) return;
    if (el.hasAttribute('data-path') && el.getAttribute('data-t') === 'money') { var v = getP(el.getAttribute('data-path')); if (v !== null && v !== undefined) el.value = fmtIn(v, 'money'); }
    if (el.hasAttribute('data-tv')) { var T = state.trial; var k = el.getAttribute('data-tv'); if (T && T[k] !== undefined) el.value = tvFmt(T[k]); }
  }
  function onKey(e) {
    if (e.key !== 'Enter' || !e.target.hasAttribute) return;
    if (e.target.hasAttribute('data-path') && FLOW_VIEWS.indexOf(state.view) >= 0) {
      var ins = $$('main input[data-path]:not([readonly])').filter(function (x) { return !x.closest('[hidden]'); }), i = ins.indexOf(e.target);
      e.preventDefault();
      if (i >= 0 && i < ins.length - 1) { ins[i + 1].focus(); return; }
      var btn = $('#foot [data-act="step-next"], #foot [data-act="step-done"]'); if (btn) btn.click();
    }
    if (e.target.hasAttribute('data-tv')) e.target.blur();
  }

  function start(data) {
    app = document.getElementById('app');
    if (!document.getElementById('sr-live')) { var lv = document.createElement('div'); lv.id = 'sr-live'; lv.className = 'sr'; lv.setAttribute('aria-live', 'polite'); document.body.appendChild(lv); }
    var r = data && data.view ? data : null;
    if (!r) { try { r = JSON.parse(sessionStorage.getItem('labOpen') || 'null'); } catch (e) { r = null; } }
    restore(r);
    adoptShared();
    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput);
    document.addEventListener('focusout', onBlur);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', function () { var f = $('#foot'); document.documentElement.style.setProperty('--foot-h', (f ? f.offsetHeight : 0) + 'px'); });
    window.addEventListener('pageshow', function (ev) {
      if (!ev.persisted) return;
      hdepth = readDepth(history.state);
      try { var th2 = localStorage.getItem('lab-theme'); if (th2 === 'dark' || th2 === 'light') document.documentElement.setAttribute('data-theme', th2); } catch (e) { /* ignore */ }
      adoptShared(); render();
    });
    window.addEventListener('popstate', onPop);
    document.addEventListener('click', topUp, true);
    hdepth = readDepth(history.state);
    render();
  }
  var hot = window.claude && window.claude.hot;
  if (hot && hot.snapshot) { try { hot.snapshot(snapshot); } catch (e) { /* ignore */ } }
  window.__labOpen = { state: state, render: render, go: go, R0: R0, useSample: useSample, chooseModel: chooseModel, startFlow: startFlow };
  if (hot && hot.ready) hot.ready(start); else start(hot && hot.data ? hot.data : {});
})();
