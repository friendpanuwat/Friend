/* ============================================================
   UI ตัวที่ 4 "กำไรรายสินค้าและรายช่องทาง" — รูปแบบหน้าจอของตัวเอง (สี ฟอนต์ ปุ่ม และคำถามตัวเลขร้านชุดเดียวกับตัวที่ 1 และ 3)
   เส้นทาง (เจ้าของยืนยันแล้ว proposal.html): หน้าเริ่ม (ขายที่ไหน · ร้านแบบไหน · ร้านตัวอย่าง) → สินค้า → ช่องทาง → สัดส่วน → ทีละช่องทาง
   → ค่าใช้จ่ายคงที่ (มีตัวเลขร้านแล้วข้าม) → ผล (รายสินค้า | รายช่องทาง | ทุกคู่ · สิ่งที่ตัวเลขบอก)
   แตะสินค้าหรือช่องทาง → รายละเอียด + ลองปรับ · ปุ่มค้างล่างจอ: แก้ตัวเลข | หาจุดที่ควรตรวจสอบ
   ปุ่มย้อนกลับในแอปกับของมือถือไปที่เดียวกันทุกหน้า (แบบเดียวกับตัวที่ 1 และ 3)
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

  function emptyPc() { return { items: [], rest: null, channels: [] }; }
  var state = {
    view: 'start', model: null, inp: {}, pc: emptyPc(), where: null, isSample: false, sampleKind: null,
    /* link = ตัวเลขร้านกับชุดกลาง: own (ตัวที่ 4 สร้าง/ผู้ใช้เลือกใช้ยอดจากรายสินค้า → เขียนยอดรวมกลับ) · shared (ใช้ชุดกลางของเครื่องมืออื่น → เขียนกลับเฉพาะที่แก้) · local (ชุดกลางเป็นร้านแบบอื่น → ไม่เขียน) */
    link: 'own', askFixed: false,
    /* ตำแหน่งในเส้นทาง: view + k (ลำดับช่องทาง หรือข้อของค่าใช้จ่ายคงที่) · editing = แก้จากหน้าแก้ตัวเลข */
    k: 0, editing: false, edOrig: null,
    tab: 'p', sel: 0, dch: 0, trial: null, answers: {}, qidx: 0, seq: 0,
    mine: null
  };
  var app;

  /* ---------- memo ---------- */
  var memo = new Map();
  function RC(pc, inp, m) {
    var key = m + '|' + JSON.stringify(pc) + '|' + JSON.stringify(inp);
    if (memo.has(key)) return memo.get(key);
    var R = pcCompute(pc, inp, m);
    if (memo.size > 200) memo.clear();
    memo.set(key, R);
    return R;
  }
  function R0() { return RC(state.pc, state.inp, state.model); }
  function flowOk() { return !!state.model && itemsStepOk(state.pc, state.inp) && channelsStepOk(state.pc) && fixedOk(state.inp); }

  /* ---------- persistence & ตัวเลขร้านชุดกลาง ---------- */
  function snapshot() {
    return { view: state.view, model: state.model, inp: state.inp, pc: state.pc, where: state.where, isSample: state.isSample, sampleKind: state.sampleKind,
      link: state.link, askFixed: state.askFixed, k: state.k, editing: state.editing, edOrig: state.edOrig, tab: state.tab, sel: state.sel, dch: state.dch,
      answers: state.answers, qidx: state.qidx, seq: state.seq, mine: state.mine };
  }
  var lastPut = null;
  function save() {
    try { sessionStorage.setItem('lab4', JSON.stringify(snapshot())); } catch (e) { /* ignore */ }
    if (typeof LabShop === 'undefined') return;
    if (!state.isSample) LabShop.setWhere(state.where);
    if (!state.model || state.isSample) return;
    var sh0 = LabShop.get();
    if (state.link === 'local') {
      /* ร้านคนละแบบ: เขียนกลับเฉพาะค่าใช้จ่ายคงที่ */
      if (!sh0 || sh0.model === state.model) { state.link = sh0 ? 'shared' : 'own'; }
      else {
        var mg = JSON.parse(JSON.stringify(sh0.inp));
        FIXED_KEYS.forEach(function (k) { if (state.inp[k] !== undefined) mg[k] = state.inp[k]; });
        var js0 = sh0.model + '|' + JSON.stringify(mg);
        if (js0 !== lastPut && !LabShop.same(mg, sh0.inp)) { LabShop.put(sh0.model, mg, sh0.label, missingFields(mg, sh0.model).length === 0 && advValid(mg, sh0.model)); }
        lastPut = js0;
        return;
      }
    }
    var out = state.inp;
    if (state.link === 'own' && fixedOk(state.inp) && itemsStepOk(state.pc, state.inp) && channelsStepOk(state.pc)) {
      var agg = pcAggregate(state.pc, state.inp, state.model, R0());
      if (agg) { out = agg; state.inp = agg; }
    }
    var js = state.model + '|' + JSON.stringify(out);
    if (js === lastPut) return;
    var ok = PC_MODELS.indexOf(state.model) >= 0 && missingFields(out, state.model).length === 0 && advValid(out, state.model);
    LabShop.put(state.model, out, MODELS[state.model].tile, ok);
    lastPut = js;
  }
  /* เปิดเครื่องมือ: ใช้ตัวเลขร้านชุดกลางล่าสุด (กรอกหรือแก้ในเครื่องมืออื่น)
     · ร้านแบบเดียวกัน: ใช้ชุดกลาง (จำนวนที่ขายแปลงตาม ถ้านับต่อวัน/ต่อเดือนต่างกัน) · ยอดจากรายสินค้ายังตรงกัน = ยังเขียนกลับได้ (own)
     · ร้านคนละแบบ (เลือกแบบอื่นในตัวที่ 4 หรือเปลี่ยนแบบในเครื่องมืออื่น): ตัวที่ 4 ใช้แบบของตัวเองต่อ (local) ใช้ร่วมเฉพาะค่าใช้จ่ายคงที่ ไม่ลบข้อมูลของตัวที่ 4
     · ระหว่างใช้ร้านตัวอย่าง ข้อมูลของผู้ใช้อยู่ใน state.mine */
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
      if (PC_MODELS.indexOf(sh.model) < 0) return; /* ร้านแบบอื่น: ค่าใช้จ่ายคงที่ใช้เติมให้ตอนเลือกแบบร้าน */
      if (state.isSample) state.mine = { model: sh.model, inp: copy, pc: emptyPc(), link: 'shared' };
      else { state.model = sh.model; state.inp = copy; state.pc = emptyPc(); state.link = 'shared'; state.pc.items = [newItem()]; }
      return;
    }
    if (tgt.model !== sh.model) { syncFixed(tgt.inp, sh.inp); tgt.link = 'local'; return; }
    convertPer(tgt.pc, tgt.inp, copy);
    tgt.link = tgt.link === 'own' && pcDiff(tgt.pc, copy, tgt.model) === null ? 'own' : 'shared';
    tgt.inp = copy;
  }
  /* ค่าใช้จ่ายคงที่ใช้ร่วมกันได้ทุกแบบร้าน (คำถามเดียวกัน) */
  function syncFixed(dst, src) {
    FIXED_KEYS.forEach(function (k) { if (src[k] !== undefined) dst[k] = src[k]; });
    if (src.chMkt !== undefined) dst.chMkt = src.chMkt; else delete dst.chMkt;
  }
  /* นับต่อวัน ↔ ต่อเดือนต่างกัน: แปลงจำนวนของสินค้า (ไม่อ่านจำนวนผิดหน่วย) */
  function convertPer(pc, from, to) {
    var a = from.volumePer, b = to.volumePer;
    if (!pc || !a || !b || a === b) return;
    var f = b === 'month' ? (pos(from.daysOpen) || 30) : 1 / (pos(to.daysOpen) || 30);
    (pc.items || []).forEach(function (p) { if (num(p.qty) !== null) p.qty = Math.round(num(p.qty) * f * 100) / 100; });
    if (pc.rest && num(pc.rest.sales) !== null) pc.rest.sales = Math.round(num(pc.rest.sales) * f);
  }
  function restore(d) {
    if (!d || typeof d !== 'object') return;
    if (d.model && PC_MODELS.indexOf(d.model) < 0) return;
    Object.assign(state, d);
    state.pc = state.pc || emptyPc(); state.answers = state.answers || {};
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
  /* เงินที่ติดลบใช้ − และ ▼ (ไม่พึ่งสี) */
  function money(v, d0) { return (v < -0.005 ? '<span class="down"><span class="sr">ขาดทุน </span>−' : '<span>') + fmtN(Math.abs(v), d0) + '</span>'; }
  function moneyTxt(v, d0) { return (v < -0.005 ? '−' : '') + fmtN(Math.abs(v), d0); }
  function per(v) { return fmtN(v, Math.abs(v) < 100 ? 1 : 0); }
  function pctTxt(v) { return fmtN(v, 0) + '%'; }
  var qmOpen = {};
  /* ข้อความล้วนจากข้อความหรือ HTML (ใช้กับ aria-label ไม่ให้ escape ซ้ำ) */
  function plain(s) { return String(s).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&(amp|lt|gt|quot|#39);/g, function (m, k) { return { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[k]; }).replace(/\u00a0/g, ' '); }
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
  function announce(txt) {
    clearTimeout(srT);
    srT = setTimeout(function () { var el = document.getElementById('sr-live'); if (el) el.textContent = txt; }, 700);
  }
  /* คำที่ไม่ควรถูกตัดกลางคำ · เว้นวรรคระหว่างคำไทยกับชื่อภาษาอังกฤษ (เช่น ผ่าน LINE MAN) */
  var NW = ['ยอดขาย', 'เงินที่เหลือ', 'ต่อเดือน', 'ช่องทาง', 'ค่าธรรมเนียม', 'ค่าแพ็ก', 'ค่าส่ง', 'ค่าใช้จ่าย', 'ค่าเดินทาง', 'ต้นทุน', 'ส่วนลด', 'หน้าร้าน', 'ออร์เดอร์', 'สินค้า', 'บริการ', 'ราคาปกติ', 'เหลือจริง', 'ขาดทุน', 'เดือนละ', 'ชิ้นละ', 'ต่ำกว่า', 'สูงกว่า', 'เท่ากัน'];
  function tw(str) {
    var h = esc(String(str).replace(/([A-Za-z)])([ก-๙])/g, '$1 $2').replace(/([ก-๙])([A-Za-z(])/g, '$1 $2').replace(/ บาท/g, '\u00a0บาท'));
    /* ชื่อภาษาอังกฤษหลายคำ (เช่น LINE MAN, TikTok Shop) ไม่ขึ้นบรรทัดใหม่กลางชื่อ */
    h = h.replace(/[A-Za-z][A-Za-z0-9]*(?: [A-Za-z0-9][A-Za-z0-9]*)+/g, function (m) { return m.length <= 18 ? '<span class="nw">' + m + '</span>' : m; });
    NW.forEach(function (w) { h = h.split(w).join('<span class="nw">' + w + '</span>'); });
    return h;
  }
  /* ต่อคำไทยกับชื่อ: เว้นวรรคเฉพาะข้างที่เป็นภาษาอังกฤษหรือตัวเลข (ผ่านหน้าร้าน · ผ่าน LINE MAN) */
  function thj(a, b) { a = String(a); b = String(b); return a + (/[A-Za-z0-9)%]$/.test(a) || /^[A-Za-z0-9(]/.test(b) ? ' ' : '') + b; }
  /* คำของร้านขายบริการ */
  function SW() { return state.model === 'service' ? 'บริการ' : 'สินค้า'; }
  function packWord() { return state.model === 'service' ? 'ค่าเดินทาง' : 'ค่าแพ็กและค่าส่ง'; }
  function U4(p) { return (p && p.unit) || U(state.inp, state.model); }
  function perW() { return state.inp.volumePer === 'month' ? 'เดือน' : 'วัน'; }
  function newId(pfx) { state.seq = (state.seq || 0) + 1; return pfx + Date.now().toString(36).slice(-4) + state.seq; }

  /* ============================================================ เส้นทาง (ลำดับหน้าระหว่างกรอก) */
  function flowSteps() {
    var S = [{ v: 'items', k: 0 }, { v: 'chpick', k: 0 }];
    if (chMany(state.pc)) S.push({ v: 'share', k: 0 });
    chList(state.pc).forEach(function (c, j) { S.push({ v: 'ch', k: j }); });
    if (state.askFixed) FIXED_STEPS.forEach(function (f, i) { S.push({ v: 'fixed', k: i }); });
    return S;
  }
  function flowIdx() { var S = flowSteps(); for (var i = 0; i < S.length; i++) if (S[i].v === state.view && S[i].k === state.k) return i; return -1; }
  var FLOW_VIEWS = ['items', 'chpick', 'share', 'ch', 'fixed'];
  function stepOk(st) {
    if (st.v === 'items') return itemsStepOk(state.pc, state.inp);
    if (st.v === 'chpick') return chList(state.pc).length > 0 && chList(state.pc).every(function (c) { return c.kind !== 'other' || !!String(c.name || '').trim(); });
    if (st.v === 'share') return sharesOk(state.pc);
    if (st.v === 'ch') { var c = chList(state.pc)[st.k]; return !!c && !chMissing(c, state.pc) && (st.k < chList(state.pc).length - 1 || !noChannelItem()); }
    if (st.v === 'fixed') return fixedStepOk(FIXED_STEPS[st.k]);
    return true;
  }
  function firstBad() { var S = flowSteps(); for (var i = 0; i < S.length; i++) if (!stepOk(S[i])) return S[i]; return null; }
  var FIXED_STEPS = [
    { id: 'people', q: 'คนที่ทำงานในร้าน', p: 'รวมเงินเดือนของคุณเองด้วย', f: ['staffCount', 'staffSalary', 'ownerSalary'] },
    { id: 'fixed', q: 'ค่าใช้จ่ายที่จ่ายทุกเดือน', p: 'จ่ายเท่าเดิม ไม่ว่าจะขายได้มากหรือน้อย · ไม่รวมค่าใช้จ่ายรายเดือนของช่องทางที่ใส่ไว้แล้ว', f: ['rent', 'marketing', 'otherFixed'] },
    { id: 'cash', q: 'ตอนนี้ร้านมีเงินสดพร้อมใช้เท่าไร?', p: 'ใช้ต่อในเครื่องมืออื่นของ Business Lab เช่น ดูว่าเงินพอใช้ถึงเดือนไหน', f: ['cash'] }
  ];
  function fieldDef(k) { for (var i = 0; i < FIELDS.length; i++) { var f = FIELDS[i]; if (f.k === k && (!f.models || f.models.indexOf(state.model) >= 0)) return f; } return null; }
  function fixedStepOk(st) { return st.f.every(function (k) { var f = fieldDef(k); if (!f || !f.req) return true; if (f.show && !f.show(state.inp, state.model)) return true; return num(state.inp[k]) !== null; }); }

  /* ============================================================ START */
  var WHERE4 = [['shop', 'หน้าร้าน', 'มีร้านหรือแผงให้ลูกค้ามา', ICON.store], ['online', 'ออนไลน์', 'ขายในโซเชียล แอป หรือเว็บ', ICON.phone], ['both', 'ทั้งสองแบบ', 'มีหน้าร้าน และขายออนไลน์ด้วย', ICON.both]];
  function sampleKindFor() { return state.where === 'online' ? 'online' : 'cafe'; }
  function whereHtml() {
    if (!state.where) return '<section class="where4 big"><h2 class="wh-q" id="wh-l">ร้านคุณขายที่ไหน?</h2><div class="wh-cards" role="group" aria-labelledby="wh-l">' + WHERE4.map(function (w) {
      return '<button type="button" class="wh-c" data-act="where" data-v="' + w[0] + '" aria-pressed="false"><span class="wh-i">' + w[3] + '</span><span class="wh-b"><b>' + w[1] + '</b><small>' + w[2] + '</small></span>' + ICON.chev + '</button>';
    }).join('') + '</div></section>';
    return '<div class="where4"><span class="wh-l" id="wh-l">ร้านคุณขายที่ไหน?</span><div class="seg" role="group" aria-labelledby="wh-l">' + WHERE4.map(function (w) {
      return '<button type="button" data-act="where" data-v="' + w[0] + '" aria-pressed="' + (state.where === w[0]) + '">' + w[1] + '</button>';
    }).join('') + '</div></div>';
  }
  function shopLine() {
    if (!state.model || state.isSample) return '';
    var ok = flowOk(), R = ok ? R0() : null;
    return '<div class="shopline"><span class="sl-t"><small>ตัวเลขร้านคุณ</small><b>' + esc(MODELS[state.model].tile) + '</b>' +
      (R && R.ok ? '<span>' + pcItems(state.pc).length + ' สินค้า · ' + chList(state.pc).length + ' ช่องทาง · ' + (R.profit < 0 ? 'ขาดทุน ' : 'กำไร ') + fmtN(Math.abs(R.profit)) + ' บาท/เดือน</span>' : '<span>' + (pcItems(state.pc).length ? 'ยังกรอกไม่ครบ' : 'ยังไม่ได้ใส่สินค้า') + '</span>') + '</span>' +
      '<button class="btn sm' + (ok ? '' : ' ghost') + '" data-act="' + (ok ? 'result' : 'continue') + '">' + (ok ? 'ดูผล' : 'ทำต่อ') + '</button></div>';
  }
  function modelTiles() {
    var sh = typeof LabShop !== 'undefined' ? LabShop.get() : null, unsup = sh && PC_MODELS.indexOf(sh.model) < 0 ? sh.model : null;
    return '<h2 class="sec4">ร้านคุณขายแบบไหน?</h2><div class="tiles t3">' + PC_MODELS.map(function (k) {
      var on = state.model === k && !state.isSample;
      return '<button class="tile' + (on ? ' on' : '') + '" data-act="model" data-m="' + k + '" aria-pressed="' + on + '"><span class="ic">' + MICON[k] + '</span><span class="t">' + MODELS[k].tile + '</span><span class="ex">' + MODELS[k].short + '</span></button>';
    }).join('') + '</div>' +
      '<p class="fine4">' + (unsup ? 'ตัวเลขร้านของคุณเป็นแบบ “' + esc(MODELS[unsup].tile) + '” ซึ่งเครื่องมือนี้ยังไม่รองรับ เลือกแบบที่ใกล้ที่สุดได้ ค่าใช้จ่ายคงที่ใช้ชุดเดิม · ' : '') +
      'แบบอื่น (สมาชิก งานโปรเจกต์ ให้เช่า นายหน้า เงินรายเดือนคงที่) ยังไม่รองรับ</p>';
  }
  function viewStart() {
    var out = bar(hubLink(), 'กำไรรายสินค้าและรายช่องทาง', 'Business Lab') + '<main class="screen"><div class="wrap">' +
      '<section class="st4">' + hq('h1', 'สินค้าไหน ช่องทางไหน เหลือเงินจริง?', 'st',
        'ใส่สินค้าที่ขายและช่องทางที่ขาย แล้วดูว่าแต่ละตัวเหลือเงินให้ร้านเดือนละกี่บาท หลังหักต้นทุน ค่าธรรมเนียม ค่าแพ็ก และส่วนลด · ใช้ตัวเลขร้านชุดเดียวกับเครื่องมืออื่นใน Business Lab') + '</section>';
    if (!state.where && !state.model) out += '<div class="samp4 two4"><span class="wh-l">หรือลองกับร้านตัวอย่างก่อน</span>' + ['cafe', 'online'].map(function (k) {
      return '<button class="btn ghost sm" data-act="sample1" data-k="' + k + '">' + esc(PC_SAMPLES[k].short) + '</button>'; }).join('') + '</div>';
    out += whereHtml();
    if (state.where) {
      out += shopLine();
      out += '<div class="samp4"><button class="lnk" data-act="sample">' + (state.isSample ? 'ดูผลร้านตัวอย่าง' : 'ลองกับ' + esc(PC_SAMPLES[sampleKindFor()].short) + 'ตัวอย่างก่อน') + '</button></div>';
      out += modelTiles();
    }
    return out + '</div></main>';
  }

  /* ============================================================ ช่องกรอก (ของตัวที่ 4 ผูกด้วย path: i.<ลำดับ>.<ช่อง> · c.<ลำดับ>.<ช่อง> · r.<ช่อง> · inp.<ช่อง>) */
  function getP(path) {
    var a = path.split('.');
    if (a[0] === 'i') return (pcItems(state.pc)[+a[1]] || {})[a[2]];
    if (a[0] === 'c') return (chList(state.pc)[+a[1]] || {})[a[2]];
    if (a[0] === 'r') return (state.pc.rest || {})[a[1]];
    if (a[0] === 'inp') return a[1] === 'marketing' && num(state.inp.marketing) !== null ? n0(state.inp.marketing) - Math.min(n0(state.inp.chMkt), n0(state.inp.marketing)) : state.inp[a[1]];
    if (a[0] === 'pt') { var it = pcItems(state.pc)[+a[1]]; return it && it.parts && it.parts[+a[2]] ? it.parts[+a[2]][a[3]] : undefined; }
  }
  function setP(path, v) {
    var a = path.split('.');
    if (a[0] === 'i') { var it = pcItems(state.pc)[+a[1]]; if (it) it[a[2]] = v; }
    else if (a[0] === 'c') { var c = chList(state.pc)[+a[1]]; if (c) c[a[2]] = v; }
    else if (a[0] === 'r') { state.pc.rest = state.pc.rest || {}; state.pc.rest[a[1]] = v; }
    else if (a[0] === 'inp') {
      /* งบการตลาดในตัวเลขร้านรวมค่าใช้จ่ายของช่องทางไว้แล้ว (chMkt) · ช่องนี้แสดงและแก้เฉพาะส่วนของร้าน */
      if (a[1] === 'marketing') state.inp.marketing = v === null ? null : v + n0(state.inp.chMkt);
      else state.inp[a[1]] = v;
    }
    else if (a[0] === 'pt') { var p2 = pcItems(state.pc)[+a[1]]; if (p2 && p2.parts && p2.parts[+a[2]]) { p2.parts[+a[2]][a[3]] = v; syncParts(p2); } }
  }
  function syncParts(p) {
    if (!p.parts || !p.parts.length) return;
    var s = 0, any = false;
    p.parts.forEach(function (x) { var v = num(x.v); if (v !== null) { s += v; any = true; } });
    p.cost = any ? Math.round(s * 100) / 100 : null;
  }
  function fmtIn(v, t) { return v === null || v === undefined || v === '' ? '' : (t === 'money' && Math.abs(v) >= 1000 ? Math.round(v).toLocaleString('th-TH') : String(v)); }
  /* o: { t: money|pct|dec|int|text, suf, help, chips: [[label, value]], ph, need, small } */
  function fld(path, label, o) {
    o = o || {};
    var id = 'f-' + path.replace(/\./g, '-'), v = getP(path), lab = esc(qmark(label));
    var labRow = o.help ? '<div class="hq"><label for="' + id + '">' + lab + '</label>' + qmBtn('h-' + path, lab) + '</div>' + qmT('h-' + path, esc(o.help)) : '<label for="' + id + '">' + lab + '</label>';
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
  /* ช่องของตัวเลขร้านชุดกลาง (ใช้ FIELDS ของตัวที่ 1 · คำถามเดียวกันทุกเครื่องมือ) */
  function shField(k) {
    var f = fieldDef(k); if (!f) return '';
    var m = state.model, inp = state.inp, lab = qmark(f.label(inp, m));
    var help = f.help ? f.help(inp, m) : '';
    if (k === 'marketing' && chList(state.pc).some(function (c) { return n0(c.monthly) > 0; })) help = (help ? help + ' · ' : '') + 'ไม่รวมค่าใช้จ่ายรายเดือนของช่องทางที่ใส่ไว้แล้ว';
    var sample = MODELS[m].sample[k];
    return fld('inp.' + k, lab, { t: f.t === 'int' ? 'int' : 'money', suf: f.suf ? f.suf(inp, m) : 'บาท', help: help, chips: f.chip ? [[f.chip[0], f.chip[1]]] : null,
      ph: typeof sample === 'number' ? 'เช่น ' + (sample >= 1000 ? Math.round(sample).toLocaleString('th-TH') : sample) : '', hidden: f.show && !f.show(inp, m) });
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
  function stepSub() {
    if (state.editing) return 'แก้ตัวเลข';
    var S = flowSteps(), i = flowIdx();
    return 'ข้อ ' + (i + 1) + ' จาก ' + S.length;
  }
  function footStep() {
    var S = flowSteps(), i = flowIdx(), last = i === S.length - 1;
    var primary = state.editing ? '<button class="btn" data-act="step-done">เสร็จ</button>'
      : last ? '<button class="btn" data-act="step-next">ดูผล' + ICON.next + '</button>'
        : '<button class="btn" data-act="step-next">ถัดไป' + ICON.next + '</button>';
    return '<div class="foot" id="foot"><div class="wrap"><button class="btn ghost back" data-act="back" aria-label="ย้อนกลับ">' + ICON.back + '</button>' + primary + '</div></div>';
  }
  function stepBar(title) { return bar(backBtn(), title, stepSub()); }

  /* ---------- แถบสรุปสดระหว่างกรอก ---------- */
  function liveStrip() {
    var v = state.view, R = null;
    var rows = pcItems(state.pc).filter(itemOk);
    if (!rows.length) return '<section class="panel strip4" id="strip"><span class="rs-k">ผลสรุป</span><div class="rs-empty">ตัวเลขจะค่อย ๆ ขึ้นตรงนี้ระหว่างที่คุณกรอก</div></section>';
    var mult = perMult(state.inp), rev = 0, left = 0;
    if (v === 'items' || v === 'chpick' || !channelsStepOk(state.pc)) {
      rows.forEach(function (p) { var u = n0(p.qty) * mult; rev += n0(p.price) * u; left += (n0(p.price) - n0(p.cost)) * u; });
      var rs = state.pc.rest;
      if (rs && rs.on === true && pos(rs.sales) !== null) { var sm = n0(rs.sales) * mult; rev += sm; left += sm * (1 - Math.min(100, n0(rs.costPct)) / 100); }
      if (v === 'ch') {
        var c = chList(state.pc)[state.k];
        if (c && !chMissing(c, state.pc)) {
          var mk = mkFactor(c), d = 1 - n0(c.disc) / 100, fr = feeRate(c), pk = packPer(c), r2 = 0, l2 = 0;
          rows.forEach(function (p) { if (chOff(c, p.id)) return; var q = n0(p.qty), net = n0(p.price) * mk * d; r2 += net * q; l2 += (net - net * fr - n0(p.cost) - pk) * q; });
          var p100 = r2 > 0 ? l2 / r2 * 100 : 0;
          return '<section class="panel strip4" id="strip"><div class="rs-top"><span class="rs-k">' + tw(thj('ขาย 100 บาทผ่าน', chName(c)) + ' เหลือ') + '</span><span class="rs-v">' + (p100 < 0 ? '−' : '') + anim('st-ch', p100) + '<small>บาท</small></span></div>' +
            '<div class="rs-lines"><div class="rs-line"><span>หลังหักต้นทุน' + SW() + ' ค่าธรรมเนียม' + (state.model === 'service' ? '' : ' ค่าแพ็ก') + ' และส่วนลด</span></div></div></section>';
        }
      }
      return '<section class="panel strip4" id="strip"><div class="rs-top"><span class="rs-k">ยอดขายต่อเดือน</span><span class="rs-v">' + anim('st-rev', rev) + '<small>บาท</small></span></div>' +
        '<div class="rs-lines"><div class="rs-line"><span>หักต้นทุนสินค้าแล้วเหลือ</span><i></i><b>' + moneyTxt(left) + '</b></div><div class="rs-line"><span>ยังไม่หักค่าธรรมเนียมและค่าแพ็กของช่องทาง</span></div></div></section>';
    }
    R = R0();
    if (!R.ok) return '';
    var fx = fixedOk(state.inp);
    return '<section class="panel strip4" id="strip"><div class="rs-top"><span class="rs-k">' + (fx ? (R.profit < 0 ? 'ขาดทุนต่อเดือน' : 'กำไรต่อเดือน') : 'เงินที่เหลือต่อเดือน') + '</span><span class="rs-v">' + ((fx ? R.profit : R.left) < 0 ? '−' : '') + anim('st-p', fx ? R.profit : R.left) + '<small>บาท</small></span></div>' +
      '<div class="rs-lines"><div class="rs-line"><span>ยอดขาย</span><i></i><b>' + fmtN(R.rev) + '</b></div><div class="rs-line"><span>เงินที่เหลือจากทุกสินค้า</span><i></i><b>' + moneyTxt(R.left) + '</b></div>' +
      (fx ? '<div class="rs-line"><span>ค่าใช้จ่ายคงที่และของช่องทาง</span><i></i><b>−' + fmtN(R.fixed + R.chMonthly + R.dep) + '</b></div>' : '') + '</div></section>';
  }

  /* ============================================================ ขั้น 2: สินค้า */
  function itemCard(p, i) {
    var u = U4(p), units = MODELS[state.model].units, hasParts = p.parts && p.parts.length;
    var unitChips = '<div class="field sm"><span class="lab" id="u-' + i + '">นับเป็น</span><div class="chips" role="group" aria-labelledby="u-' + i + '">' + units.map(function (x) {
      return '<button type="button" class="chip sm" data-act="pset" data-path="i.' + i + '.unit" data-v="' + esc(x) + '" data-num="0" aria-pressed="' + (u === x) + '">' + esc(x) + '</button>';
    }).join('') + '</div></div>';
    var costHelp = state.model === 'resell' ? 'ราคาที่ซื้อมาต่อชิ้น รวมค่าส่งเข้าร้าน ยังไม่รวมค่าแพ็กของช่องทาง' : state.model === 'service' ? 'ของที่ใช้ และค่ามือหรือค่าคอมที่จ่ายช่างต่อครั้ง ยังไม่รวมเงินเดือนประจำ' : 'ค่าวัตถุดิบและบรรจุภัณฑ์ที่ใช้ทำ 1 ' + u + ' เช่น แก้ว ฝา หลอด ยังไม่รวมค่าแพ็กส่งของ';
    var parts = '';
    if (hasParts) {
      parts = '<div class="parts" role="group" aria-label="ต้นทุนทีละอย่างของ' + esc(p.name || SW() + 'นี้') + '">' + p.parts.map(function (x, k) {
        return '<div class="part"><input class="pn" data-path="pt.' + i + '.' + k + '.n" data-t="text" maxlength="24" placeholder="เช่น นม" value="' + esc(x.n || '') + '" aria-label="ชื่อรายการที่ ' + (k + 1) + '">' +
          '<div class="inbox mini"><input data-path="pt.' + i + '.' + k + '.v" data-t="dec" inputmode="decimal" placeholder="0" value="' + esc(fmtIn(x.v, 'dec')) + '" aria-label="บาท รายการที่ ' + (k + 1) + '"><span class="suf">บาท</span></div>' +
          '<button type="button" class="ib sm" data-act="part-del" data-i="' + i + '" data-k="' + k + '" aria-label="ลบรายการที่ ' + (k + 1) + '">' + ICON.x + '</button></div>';
      }).join('') + '<div class="part-f"><button type="button" class="lnk" data-act="part-add" data-i="' + i + '">+ เพิ่มรายการ</button><span>รวม <b class="num">' + fmtN(n0(p.cost), 2) + '</b> บาท</span></div></div>';
    }
    return '<section class="pi" data-item="' + i + '"><div class="pi-h"><span class="pi-n">' + SW() + 'ที่ ' + (i + 1) + '</span>' +
      (pcItems(state.pc).length > 1 ? '<button type="button" class="ib sm" data-act="item-del" data-i="' + i + '" aria-label="ลบ' + SW() + 'ที่ ' + (i + 1) + (p.name ? ' ' + esc(p.name) : '') + '">' + ICON.x + '</button>' : '') + '</div>' +
      fld('i.' + i + '.name', 'ชื่อ' + SW(), { t: 'text', ph: state.model === 'service' ? 'เช่น ตัดผมชาย' : state.model === 'resell' ? 'เช่น เสื้อยืด' : 'เช่น ลาเต้เย็น' }) + unitChips +
      '<div class="two">' + fld('i.' + i + '.price', 'ราคาปกติต่อ' + u, { t: 'money', help: 'ราคาที่ขายหน้าร้านหรือราคาที่ตั้งไว้ ก่อนส่วนลด' }) +
      fld('i.' + i + '.cost', 'ต้นทุนต่อ' + u, { t: 'dec', help: costHelp, readonly: hasParts }) + '</div>' +
      (hasParts ? parts : '<button type="button" class="lnk sm4" data-act="part-open" data-i="' + i + '">แยกต้นทุนทีละอย่าง</button>') +
      fld('i.' + i + '.qty', (state.model === 'service' ? 'มีลูกค้าใช้บริการนี้กี่' + u + 'ต่อ' : 'ขายได้กี่' + u + 'ต่อ') + perW(), { t: 'dec', suf: u + '/' + perW(), help: 'รวมทุกช่องทาง ตัวเลขประมาณก็ได้' }) + '</section>';
  }
  function viewItems() {
    var items = pcItems(state.pc), pv = state.inp.volumePer || MODELS[state.model].defPer || 'day', rest = state.pc.rest;
    var out = stepBar(SW() + 'ที่ขาย') + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() +
      qHead(SW() + 'ที่ร้านขาย', 'ใส่เฉพาะตัวหลัก 3–8 ตัวก่อนก็ได้ ที่เหลือรวมเป็น “' + SW() + 'อื่น ๆ” ด้านล่าง · ใส่ได้สูงสุด ' + PC_MAX_ITEMS + ' ตัว', 'items') +
      '<div class="qfields">' +
      '<div class="field" data-need="inp.volumePer"><span class="lab" id="per-l">นับยอดขายต่อวันหรือต่อเดือน?</span><div class="seg wide" role="group" aria-labelledby="per-l">' +
      '<button type="button" data-act="per" data-v="day" aria-pressed="' + (pv === 'day') + '">ต่อวัน</button><button type="button" data-act="per" data-v="month" aria-pressed="' + (pv === 'month') + '">ต่อเดือน</button></div></div>' +
      (pv === 'day' ? fld('inp.daysOpen', 'เปิดขายเดือนละกี่วัน', { t: 'int', suf: 'วัน', ph: 'เช่น 26' }) : '') +
      items.map(itemCard).join('') +
      (items.length < PC_MAX_ITEMS ? '<button type="button" class="btn ghost block add4" data-act="item-add">' + ICON.plus + 'เพิ่ม' + SW() + '</button>' : '<p class="fine4">ใส่ได้สูงสุด ' + PC_MAX_ITEMS + ' ตัว ที่เหลือรวมเป็น' + SW() + 'อื่น ๆ</p>') +
      segF('r.on', 'นอกจากนี้ มี' + SW() + 'อื่นที่ขายอีกไหม', [[false, 'ไม่มี ขายแค่นี้'], [true, 'มี รวมเป็น' + SW() + 'อื่น ๆ']].map(function (o) { return [String(o[0]), o[1]]; }), '') +
      (rest && rest.on === true ? '<div class="two">' + fld('r.sales', 'ยอดขายของ' + SW() + 'อื่น ๆ รวมกันต่อ' + perW(), { t: 'money', suf: 'บาท/' + perW() }) + fld('r.costPct', 'ต้นทุนประมาณกี่ % ของราคา', { t: 'pct', suf: '%' }) + '</div>' : '') +
      '</div></div></main>' + footStep();
    return out;
  }
  /* segF เก็บค่าเป็นข้อความ · r.on ต้องเป็น true/false */
  function fixRestOn() { if (state.pc.rest && typeof state.pc.rest.on === 'string') state.pc.rest.on = state.pc.rest.on === 'true'; }

  /* ============================================================ ขั้น 3: ช่องทาง */
  function viewChpick() {
    var chs = chList(state.pc), full = chs.length >= PC_MAX_CH, kinds = chKindsFor(state.model, state.where);
    chs.forEach(function (c) { if (kinds.indexOf(c.kind) < 0) kinds.push(c.kind); });
    var chips = kinds.filter(function (k) { return k !== 'other'; }).map(function (k) {
      var on = chs.some(function (c) { return c.kind === k; });
      return '<button type="button" class="chip" data-act="ch-toggle" data-k="' + k + '" aria-pressed="' + on + '"' + (!on && full ? ' disabled' : '') + '>' + esc(CH_KINDS[k].n) + '</button>';
    }).join('');
    var others = chs.map(function (c, j) { return c.kind === 'other' ? '<div class="oth">' + fld('c.' + j + '.name', 'ชื่อช่องทางอื่น', { t: 'text', ph: 'เช่น ขายให้บริษัท' }) + '<button type="button" class="ib sm" data-act="ch-del" data-j="' + j + '" aria-label="ลบช่องทางนี้">' + ICON.x + '</button></div>' : ''; }).join('');
    return stepBar('ช่องทางขาย') + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() +
      qHead('ขายผ่านช่องทางไหนบ้าง', 'เลือกทุกช่องทางที่มียอดขาย สูงสุด ' + PC_MAX_CH + ' ช่องทาง · ขายช่องทางเดียวก็เลือกช่องทางนั้น', 'chpick') +
      '<div class="qfields"><div class="field" data-need="chpick"><div class="chips">' + chips + '</div></div>' + others +
      (full ? '' : '<button type="button" class="lnk" data-act="ch-other">+ ช่องทางอื่น</button>') +
      (chs.length ? '<p class="fine4">เลือกแล้ว: ' + chs.map(function (c) { return esc(chName(c)); }).join(' · ') + '</p>' : '') + '</div></div></main>' + footStep();
  }
  function viewShare() {
    var chs = chList(state.pc), tot = shareSum(state.pc);
    return stepBar('สัดส่วนการขาย') + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() +
      qHead('ขายผ่านแต่ละช่องทางประมาณกี่ %', 'คิดจากจำนวนที่ขาย (ไม่ใช่ยอดเงิน) รวมกันต้องได้ 100% · ตัวเลขประมาณก็ได้ ดูได้จากใบสรุปยอดของแต่ละช่องทาง', 'share') +
      '<div class="qfields">' + chs.map(function (c, j) { return fld('c.' + j + '.share', chName(c), { t: 'pct', suf: '% ของจำนวนที่ขาย' }); }).join('') +
      '<div id="tot4w" class="field" data-need="share-tot"><div class="tot4" role="status"><span>รวม</span><b class="num">' + fmtN(tot, 1) + '%</b>' + (Math.abs(tot - 100) < 0.51 ? '<i>' + ICON.ok + '</i>' : '<small>' + (tot < 100 ? 'ขาดอีก ' + fmtN(100 - tot, 1) + '%' : 'เกินมา ' + fmtN(tot - 100, 1) + '%') + '</small>') + '</div>' + shareFillBtn() + '</div>' +
      '</div></div></main>' + footStep();
  }
  /* ช่องทางเดียวที่ยังไม่ได้ใส่ % และที่เหลือยังไม่ครบ 100: ปุ่มใส่ส่วนที่เหลือให้ */
  function shareFillBtn() {
    var chs = chList(state.pc), empty = chs.map(function (c, j) { return num(c.share) === null ? j : -1; }).filter(function (j) { return j >= 0; }), rest = 100 - shareSum(state.pc);
    if (empty.length !== 1 || rest <= 0.05) return '';
    return '<button type="button" class="sbtn light" data-act="share-fill" data-j="' + empty[0] + '">ใส่ ' + fmtN(rest, 1) + '% ให้ ' + tw(chName(chs[empty[0]])) + '</button>';
  }
  function viewCh() {
    var j = state.k, c = chList(state.pc)[j];
    if (!c) { state.view = 'chpick'; return viewChpick(); }
    var nm = chName(c), base = 'c.' + j + '.', shop = chIsShop(c), items = pcItems(state.pc), u = U(state.inp, state.model);
    var f = '', svc = state.model === 'service', trip = svc && c.kind === 'onsite';
    if (!shop) {
      f += segF(base + 'priceMode', thj('ราคาบน', nm) + ' เทียบกับราคาปกติเป็นอย่างไร?', [['same', 'เท่ากัน'], ['up', 'สูงกว่า'], ['down', 'ต่ำกว่า']], chHint(c, 'up'));
      if (c.priceMode === 'up' || c.priceMode === 'down') f += fld(base + 'markup', c.priceMode === 'up' ? 'สูงกว่าราคาปกติกี่ %' : 'ต่ำกว่าราคาปกติกี่ %', { t: 'pct', suf: '%' });
    }
    f += fld(base + 'fee', shop ? 'รับเงินที่หน้าร้านเสียค่าธรรมเนียมกี่ % (เช่น รูดบัตร)?' : thj('ค่าธรรมเนียมที่', nm) + ' หักไปกี่ % ของราคาขาย', { t: 'pct', suf: '%', chips: [['ไม่มี', 0]], help: chHint(c, 'fee') });
    if (n0(c.fee) > 0) f += segF(base + 'vat', 'อัตรานี้รวม VAT แล้วหรือยัง', [['in', 'รวม VAT แล้ว'], ['ex', 'ยังไม่รวม (คิดเพิ่ม 7%)']], 'แอปส่งอาหารมักบอก GP เป็นตัวเลขที่ยังไม่รวม VAT เช่น GP 30% + VAT = ร้านเสีย 32.1% ของราคา');
    f += fld(base + 'disc', thj('ส่วนลดที่ร้านออกเองบน', nm) + ' โดยเฉลี่ยกี่ %', { t: 'pct', suf: '% ของราคา', chips: [['ไม่มี', 0]], help: 'เฉพาะส่วนลดที่ร้านจ่ายเอง เช่น โค้ดของร้าน ส่วนลดที่ร้านร่วมออกกับแอป · ไม่นับส่วนลดที่แอปออกให้' });
    if (trip) f += fld(base + 'perOrder', 'ร้านจ่ายค่าเดินทางต่อครั้งเท่าไร?', { t: 'dec', suf: 'บาท/ครั้ง', chips: [['ไม่มี', 0]], help: 'เช่น ค่าน้ำมัน ค่ารถ ที่ร้านจ่ายเองทุกครั้งที่ไปบริการนอกร้าน' });
    else if (!svc) {
      f += fld(base + 'perOrder', 'ร้านจ่ายค่าแพ็กและค่าส่งต่อออร์เดอร์เท่าไร?', { t: 'dec', suf: 'บาท/ออร์เดอร์', chips: [['ไม่มี', 0]], help: chHint(c, 'pack') });
      if (n0(c.perOrder) > 0) f += fld(base + 'ipo', 'ออร์เดอร์หนึ่งมีเฉลี่ยกี่' + u, { t: 'dec', suf: u, chips: [['1 ' + u, 1]] });
    }
    f += fld(base + 'monthly', 'ค่าใช้จ่ายรายเดือนของช่องทางนี้เท่าไร?', { t: 'money', suf: 'บาท/เดือน', chips: [['ไม่มี', 0]],
      help: 'ค่าใช้จ่ายที่จ่ายเพราะช่องทางนี้เท่านั้น เช่น ค่าโฆษณาในแอป ค่าบูธ ค่าคนดูแลช่องทาง' + (state.link === 'shared' && n0(state.inp.marketing) > 0 ? ' · ถ้านับรวมไว้ในงบการตลาดของร้าน (' + fmtN(n0(state.inp.marketing)) + ' บาท) แล้ว กด “ไม่มี” เพื่อไม่ให้นับซ้ำ' : '') });
    /* สินค้าที่ไม่ได้ขายผ่านช่องทางนี้ · ขึ้นเสมอถ้ามีสินค้าที่เอาออกไว้ (ไม่ให้ค้างเมื่อเหลือสินค้าเดียว) */
    var anyOff = items.some(function (p) { return c.off && c.off[p.id]; });
    if (chMany(state.pc) && (items.length > 1 || anyOff)) {
      var ol = SW() + 'ไหนไม่ได้ขายผ่าน' + (/^[A-Za-z0-9]/.test(nm) ? ' ' : '') + nm + '? แตะเพื่อเอาออก';
      f += '<div class="field" data-need="' + base + 'off"><div class="hq"><span class="lab" id="off-l">' + tw(ol) + '</span>' + qmBtn('h-off', ol) + '</div>' +
        qmT('h-off', 'จำนวนที่ขายของ' + SW() + 'ที่เอาออก จะแบ่งไปช่องทางอื่นตามสัดส่วน · แตะอีกครั้งเพื่อใส่กลับ') +
        '<div class="chips offc" role="group" aria-labelledby="off-l">' + items.map(function (p) {
          var on = !(c.off && c.off[p.id]);
          return '<button type="button" class="chip sm" data-act="ch-off" data-j="' + j + '" data-id="' + esc(p.id) + '" aria-pressed="' + on + '"><span aria-hidden="true">' + (on ? '✓ ' : '✕ ') + '</span>' + esc(p.name || 'ยังไม่มีชื่อ') + (on ? '' : '<span class="sr"> ไม่ได้ขายผ่านช่องทางนี้</span>') + '</button>';
        }).join('') + '</div></div>';
    }
    return stepBar(nm) + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() +
      qHead(thj('ราคาและค่าใช้จ่ายของ', nm), 'ดูได้จากใบสรุปยอดหรือหน้าร้านค้าของช่องทางนั้น · ตัวเลขประมาณก็ได้', 'ch') +
      '<div class="qfields">' + f + '</div></div></main>' + footStep();
  }
  function viewFixed() {
    var st = FIXED_STEPS[state.k] || FIXED_STEPS[0];
    return stepBar('ตัวเลขร้าน') + '<main class="screen"><div class="wrap">' + progHtml() + liveStrip() + qHead(st.q, st.p, st.id) +
      '<div class="qfields">' + st.f.map(shField).join('') + '</div>' +
      '<p class="fine4">ตัวเลขร้านชุดนี้ใช้ร่วมกับเครื่องมืออื่นใน Business Lab กรอกครั้งเดียว</p></div></main>' + footStep();
  }

  /* ============================================================ ผล */
  var LVP = { high: ['high', 'ร้ายแรง'], mid: ['mid', 'ปานกลาง'], watch: ['watch', 'ควรเฝ้าระวัง'], note: ['note', 'ข้อสังเกต'] };
  function walkPanel(R) {
    var neg = R.profit < -0.5;
    return '<section class="panel res4"><div class="hq"><h1 class="eyebrow">' + (neg ? 'ขาดทุนต่อเดือน' : 'กำไรต่อเดือน') + '</h1>' + qmBtn('walk', 'กำไรต่อเดือนคิดอย่างไร') + '</div>' +
      '<div class="bignum">' + (neg ? '−' : '') + anim('profit', R.profit) + '<span class="u">บาท</span></div>' +
      '<div class="walk"><div><span>ยอดขาย</span><b>' + fmtN(R.rev) + '</b></div>' +
      '<div class="k"><span>เงินที่เหลือจากทุก' + SW() + '</span><b>' + moneyTxt(R.left) + '</b></div>' +
      (R.chMonthly > 0.5 ? '<div><span>ค่าใช้จ่ายของช่องทาง</span><b>−' + fmtN(R.chMonthly) + '</b></div>' : '') +
      '<div><span>ค่าใช้จ่ายคงที่ของร้าน</span><b>−' + fmtN(R.fixed) + '</b></div>' +
      (R.dep > 0.5 ? '<div><span>กันไว้ซื้ออุปกรณ์ใหม่</span><b>−' + fmtN(R.dep) + '</b></div>' : '') + '</div>' +
      qmT('walk', 'เงินที่เหลือ = ราคาที่ลูกค้าจ่าย หักส่วนลดที่ร้านออก ต้นทุน' + SW() + ' ค่าธรรมเนียม' + (state.model === 'service' ? '' : ' ค่าแพ็กและค่าส่ง') + ' · เงินก้อนนี้ใช้จ่ายค่าเช่า เงินเดือน และค่าใช้จ่ายคงที่อื่นของร้าน ซึ่งไม่ได้หารลงแต่ละ' + SW() + ' เพราะจ่ายเท่าเดิมไม่ว่าจะขาย' + SW() + 'ไหน · ยอดขายในเครื่องมือนี้คือตัวเลขเดียวกับ “รายได้ต่อเดือน” ในเช็กตัวเลขร้าน' +
        (R.disc > 0.5 ? ' · ส่วนลดที่ร้านออกรวมเดือนละ <b>' + fmtN(R.disc) + '</b> บาท (หักออกจากยอดขายแล้ว)' : '')) + '</section>';
  }
  function reconHtml(R) {
    if (state.isSample || state.link !== 'shared') return '';
    var D = pcDiff(state.pc, state.inp, state.model, R);
    if (!D) return '';
    return '<section class="card recon"><div class="hq"><h3>ตัวเลขร้านที่กรอกไว้ในเครื่องมืออื่น ไม่ตรงกับยอดจากรายสินค้า</h3>' + qmBtn('recon', 'ทำไมไม่ตรงกัน') + '</div>' +
      qmT('recon', 'ตัวเลขร้านเดิมใช้ราคาและต้นทุนเฉลี่ยของทั้งร้าน ส่วนตรงนี้คิดทีละสินค้าและทีละช่องทาง · ค่าใช้จ่ายคงที่ใช้ชุดเดียวกันอยู่แล้ว · ถ้าเลือกใช้ยอดจากรายสินค้า เครื่องมืออื่นใน Business Lab จะเปลี่ยนตาม') +
      '<div class="rc4"><span></span><b>รายสินค้า</b><b>ตัวเลขร้าน</b>' +
      '<span>ยอดขาย (รายได้) ต่อเดือน</span><i class="num">' + fmtN(D.rev4) + '</i><i class="num">' + fmtN(D.rev1) + '</i>' +
      '<span>กำไรต่อเดือน</span><i class="num">' + moneyTxt(D.profit4) + '</i><i class="num">' + moneyTxt(D.profit1) + '</i></div>' +
      '<button class="sbtn" data-act="apply-agg">ใช้ยอดจากรายสินค้าเป็นตัวเลขร้าน</button></section>';
  }
  function tabsHtml(R) {
    if (!R.many) return '';
    var T = [['p', 'ราย' + SW()], ['c', 'รายช่องทาง'], ['g', 'ทุกคู่']];
    return '<div class="tabs4" role="tablist" aria-label="ดูผลแบบ">' + T.map(function (t) {
      var on = state.tab === t[0];
      return '<button type="button" role="tab" id="tab-' + t[0] + '" aria-controls="tp" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '" data-act="tab" data-v="' + t[0] + '">' + t[1] + '</button>';
    }).join('') + '</div>';
  }
  function duo(lab, v, mine) { var w = Math.max(0, Math.min(100, v || 0)); return '<div class="duo"><span>' + lab + '</span><i class="' + (mine ? 'm' : '') + '"><b style="width:' + w.toFixed(1) + '%"></b></i><em>' + (v === null ? '–' : pctTxt(Math.max(0, v))) + '</em></div>'; }
  function prodList(R) {
    var finds = {};
    R.finds.forEach(function (f) { if (f.kind === 'gap') finds[f.prod] = f; });
    return '<p class="fine4 cap4">เรียงตามเงินที่เหลือต่อเดือน</p><div class="rank4">' + R.rank.map(function (p, n) {
      var gap = finds[p.i];
      return '<button type="button" class="rk4" data-act="prod" data-i="' + p.i + '" data-rk="' + esc(p.id) + '"><span class="top"><span class="nm"><small class="num">' + (n + 1) + '</small>' + tw(p.name) + '</span><span class="v"><small>เหลือ </small>' + money(p.left) + '<small>/เดือน</small></span></span>' +
        duo('ยอดขาย', p.revShare, false) + duo('เงินที่เหลือ', p.leftShare, true) +
        '<span class="sub">' + (p.rest ? 'รวมหลาย' + SW() : 'เหลือ' + esc(U4(p)) + 'ละ ' + moneyTxt(p.leftPer, Math.abs(p.leftPer) < 100 ? 1 : 0) + '\u00a0บาท') +
        (gap ? ' · <b>▼ ขายได้ ' + fmtN(p.revShare, 0) + '% ของยอดขาย แต่ได้เงินแค่ ' + fmtN(Math.max(0, p.leftShare), 0) + '% ของเงินที่เหลือ</b>' : '') + '</span>' + ICON.chev + '</button>';
    }).join('') + '</div>' + (R.left > 0 ? '' : '<p class="fine4">เงินที่เหลือรวมยังติดลบ จึงไม่แสดงส่วนแบ่งของเงินที่เหลือ</p>');
  }
  function stackHtml(o) {
    var base = o.rev > 0 ? o.rev : 1, parts = [['s1', o.cost], ['s2', o.fee], ['s3', o.pack], ['s4', Math.max(0, o.left)]];
    var tot = parts.reduce(function (s, x) { return s + Math.max(0, x[1]); }, 0) || 1, scale = Math.max(base, tot);
    return '<div class="stack" aria-hidden="true">' + parts.map(function (x) { var w = Math.max(0, x[1]) / scale * 100; return w > 0.05 ? '<i class="' + x[0] + '" style="width:' + w.toFixed(2) + '%"></i>' : ''; }).join('') + '</div>';
  }
  /* ส่วนของ 100 บาท พร้อมตัวเลขใต้แถบ */
  function legendN(c) {
    var b = function (v) { return c.rev > 0 ? v / c.rev * 100 : 0; };
    var P = [['s1', 'ต้นทุน' + SW(), b(c.cost)], ['s2', 'ค่าธรรมเนียม', b(c.fee)], ['s3', packWord(), b(c.pack)], ['s4', 'เหลือ', c.per100]];
    if (state.model === 'service' && c.pack < 0.005) P.splice(2, 1);
    return '<div class="lg4">' + P.map(function (x) { return '<span><i class="' + x[0] + '" aria-hidden="true"></i>' + x[1] + ' <b class="num">' + (x[2] < -0.005 ? '−' : '') + per(Math.abs(x[2])) + '</b></span>'; }).join('') + '</div>';
  }
  function chanList(R) {
    return '<div class="chl4">' + R.chRank.map(function (c) {
      return '<button type="button" class="chc" data-act="chan" data-j="' + c.j + '" data-rk="' + esc(c.c.id || c.j) + '"><span class="top"><span class="nm">' + tw(c.name) + '</span><span class="v">ขาย 100 บาท เหลือ <b>' + (c.per100 < 0 ? '−' : '') + fmtN(Math.abs(c.per100), 0) + '</b></span></span>' +
        '<span class="sr">จากยอดขาย 100 บาท</span>' + stackHtml(c) + legendN(c) +
        '<span class="sub">เหลือเดือนละ ' + money(c.left) + '\u00a0บาท' + (c.monthly > 0.5 ? ' · หักค่าใช้จ่ายของช่องทาง ' + fmtN(c.monthly) + ' → <b>เหลือจริง ' + money(c.after) + '</b>' : '') + '</span>' + ICON.chev + '</button>';
    }).join('') + '</div>';
  }
  function gridHtml(R) {
    var chs = R.chans;
    return '<div class="gw4" tabindex="0" role="region" aria-label="เงินที่เหลือต่อชิ้น แยก' + SW() + 'และช่องทาง"><table class="grid4"><caption>เงินที่เหลือต่อชิ้น (บาท)</caption><thead><tr><th scope="col"><span class="sr">' + SW() + '</span></th>' +
      chs.map(function (c) { return '<th scope="col">' + tw(c.name) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      R.rank.map(function (p) {
        return '<tr><th scope="row"><button type="button" class="gl" data-act="prod" data-i="' + p.i + '">' + tw(p.name) + '</button></th>' + chs.map(function (c) {
          var x = cellOf(R, p.i, c.j);
          if (!x) return '<td class="na">ไม่ขาย</td>';
          return '<td class="' + (x.left < -0.005 ? 'neg' : '') + '"><button type="button" data-act="prod" data-i="' + p.i + '" data-c="' + c.j + '" aria-label="' + esc(thj(p.name + ' ผ่าน', c.name) + ' เหลือ ' + moneyTxt(x.left, 1) + ' บาทต่อ' + (p.rest ? 'ชิ้น' : U4(p))) + '">' + (x.left < -0.005 ? '▼ ' : '') + moneyTxt(x.left, Math.abs(x.left) < 100 ? 1 : 0) + '</button></td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
  }
  function findsHtml(R) {
    if (!R.finds.length) return '<div class="ok-box"><b>ไม่พบปัญหาที่น่ากังวลจากตัวเลขที่ตรวจสอบได้</b><p>ทุก' + SW() + 'และทุกช่องทางยังเหลือเงิน และไม่มีช่องทางที่ค่าใช้จ่ายของตัวเองกินเงินที่เหลือเกินครึ่ง</p></div>' +
      '<h3 class="sub4">เครื่องมือที่ช่วยต่อยอด</h3>' + toolsHtml(['grow13', 'bmc10', 'bmc8']);
    return '<div class="flist">' + R.finds.map(function (f, n) {
      var lv = LVP[f.lv], go = f.prod !== undefined ? ' data-act="prod" data-i="' + f.prod + '"' : f.ch !== undefined ? ' data-act="chan" data-j="' + f.ch + '"' : f.cells && f.cells.length ? ' data-act="prod" data-i="' + f.cells[0].i + '" data-c="' + f.cells[0].j + '"' : '';
      var tag = go ? 'button type="button"' : 'div';
      return '<' + tag + ' class="frow f4"' + go + '><span class="ft">' + tw(f.t) + '</span><span class="fr-r">' + (f.money !== null && f.money !== undefined ? '<span class="fm">' + (f.ml ? '<small>' + tw(f.ml) + '</small>' + (f.mabs ? fmtN(Math.abs(f.money)) : money(f.money)) + '<small>บาท</small>' : money(f.money) + '<small>บาท/เดือน</small>') + '</span>' : '') + (go ? ICON.chev : '') + '</span>' +
        '<span class="pill ' + lv[0] + '">' + lv[1] + '</span><span class="fs">' + tw(f.s) + '</span></' + (go ? 'button' : 'div') + '>';
    }).join('') + '</div>';
  }
  function planRow() {
    return '<div class="plan-row"><b>แผนธุรกิจ</b><span class="pill">PL2</span><span class="sp"></span><button class="go" data-act="plan">ดู' + ICON.chev + '</button>' + qmBtn('plan-r', 'แผนธุรกิจ') +
      qmT('plan-r', 'วางแผนทั้งร้านต่อจากตัวเลขชุดนี้ เช่น สินค้าและช่องทางที่จะเน้นในปีหน้า และเงินที่ต้องใช้') + '</div>';
  }
  function tool1Link() {
    if (!window.LAB_HUB) return '';
    var more = !state.isSample && (missingFields(state.inp, state.model).length > 0 || !advValid(state.inp, state.model));
    return '<a class="lnk t1l" href="check-numbers.html">ดูภาพรวมทั้งร้าน (จุดคุ้มทุน เงินสด 12 เดือน) ในเช็กตัวเลขร้าน</a>' +
      (more ? '<p class="fine4">เช็กตัวเลขร้านจะถามเพิ่มอีกเล็กน้อยก่อนแสดงภาพรวม</p>' : '');
  }
  function viewResult() {
    var R = R0();
    if (!R.ok) return viewStart();
    if (!R.many && state.tab !== 'p') state.tab = 'p';
    var body = state.tab === 'c' ? chanList(R) : state.tab === 'g' ? gridHtml(R) : prodList(R);
    var out = bar('<button class="tb" data-act="back" aria-label="กลับหน้าแรก">' + ICON.back + 'หน้าแรก</button>', 'สินค้าและช่องทาง', state.isSample ? '' : MODELS[state.model].tile) +
      '<main class="screen res4m"><div class="wrap">' +
      (state.isSample ? '<div class="banner4"><span><small>กำลังใช้</small>' + esc(PC_SAMPLES[state.sampleKind].name) + '</span><button class="btn ghost sm" data-act="mine">ใส่ตัวเลขร้านคุณ</button></div>' : state.inp.preOpen ? '<div class="banner pre-open"><span>ตัวเลขที่ตั้งใจไว้ก่อนเปิดร้าน <span class="nw">(จากเช็กก่อนเปิดร้าน)</span></span><button class="lnk" data-act="opened">ร้านเปิดแล้ว</button></div>' : '') +
      walkPanel(R) + reconHtml(R) + tabsHtml(R) +
      '<section id="tp"' + (R.many ? ' role="tabpanel" aria-labelledby="tab-' + state.tab + '"' : '') + ' class="tp4">' +
      (R.many ? '' : hq('h2', 'เงินที่เหลือของแต่ละ' + SW(), 'one', 'ขายช่องทางเดียว จึงดูราย' + SW() + 'อย่างเดียว · แตะ' + SW() + 'เพื่อดูว่าเงินจากขาย 1 ชิ้นไปไหนบ้าง และลองปรับราคาหรือต้นทุน', 'sec4')) + body + '</section>' +
      '<section class="block">' + hq('h2', 'สิ่งที่ตัวเลขบอก', 'fnd', 'บอกปัญหาและขนาดเป็นเงินต่อเดือน ไม่บอกวิธีแก้ · แตะเพื่อดูรายละเอียดของ' + SW() + 'หรือช่องทางนั้น') + findsHtml(R) + '</section>' +
      tool1Link() + planRow() + '</div></main>' +
      '<div class="foot foot2" id="foot"><div class="wrap"><button class="btn ghost" data-act="review">แก้ตัวเลข</button><button class="btn" data-act="ask">หาจุดที่ควรตรวจสอบ' + ICON.next + '</button></div></div>';
    return out;
  }

  /* ============================================================ รายละเอียด + ลองปรับ */
  /* ลองปรับ: state.trial = { p: { ลำดับสินค้า: { ช่อง: ค่า } }, c: { ลำดับช่องทาง: { ช่อง: ค่า } } } หรือ null
     · ลองตัวเลขของสินค้าและของช่องทางพร้อมกันได้ · เปลี่ยนช่องทางที่ดูแล้วค่าที่ลองไว้ยังอยู่ · ยังไม่แก้ตัวเลขจริงจนกด "ใช้ค่านี้" */
  function applyTrial(pc, T) {
    Object.keys(T.p || {}).forEach(function (i) { var o = pc.items[+i]; if (!o) return; Object.keys(T.p[i]).forEach(function (k) { o[k] = T.p[i][k]; if (k === 'cost') delete o.parts; }); });
    Object.keys(T.c || {}).forEach(function (j) {
      var o = pc.channels[+j]; if (!o) return;
      Object.keys(T.c[j]).forEach(function (k) { if (k !== 'markup') o[k] = T.c[j][k]; });
      if (T.c[j].markup !== undefined) { var mv = T.c[j].markup; o.priceMode = mv > 0.0001 ? 'up' : mv < -0.0001 ? 'down' : 'same'; o.markup = Math.abs(mv); }
    });
    return pc;
  }
  function trialPc() { return state.trial ? applyTrial(JSON.parse(JSON.stringify(state.pc)), state.trial) : state.pc; }
  function RT() { return RC(trialPc(), state.inp, state.model); }
  function tvals(t, i) { var T = state.trial; return T && T[t] && T[t][i] ? T[t][i] : null; }
  function tval(t, i, k, cur) { var o = tvals(t, i); return o && o[k] !== undefined ? o[k] : cur; }
  function tvFmt(v) { return (Math.round(v * 100) / 100).toLocaleString('th-TH', { maximumFractionDigits: 2 }); }
  function tcurTxt(v, cur, unit) { return Math.abs(v - cur) > 1e-9 ? 'ตัวเลขปัจจุบัน: ' + tvFmt(cur) + ' ' + unit : ''; }
  function stepper(t, i, k, label, cur, step, unit, min, max) {
    var id = 'tv-' + k, v = tval(t, i, k, cur);
    return '<div class="trow"><label for="' + id + '">' + esc(label) + '</label><div class="tctl"><button type="button" class="stp" data-act="tstep" data-t="' + t + '" data-i="' + i + '" data-k="' + k + '" data-d="' + (-step) + '" data-min="' + min + '" data-max="' + max + '" aria-label="ลด' + esc(label) + '">−</button>' +
      '<span class="tv"><input id="' + id + '" data-tv="' + k + '" data-t="' + t + '" data-i="' + i + '" data-min="' + min + '" data-max="' + max + '"' + (min < 0 ? ' data-neg="1"' : '') + ' inputmode="' + (min < 0 ? 'text' : 'decimal') + '" value="' + esc(tvFmt(v)) + '"><small>' + esc(unit) + '</small></span>' +
      '<button type="button" class="stp" data-act="tstep" data-t="' + t + '" data-i="' + i + '" data-k="' + k + '" data-d="' + step + '" data-min="' + min + '" data-max="' + max + '" aria-label="เพิ่ม' + esc(label) + '">+</button></div><small class="tcur" data-tcur="' + k + '">' + esc(tcurTxt(v, cur, unit)) + '</small></div>';
  }
  /* ขั้นของปุ่ม −/+ ตามขนาดตัวเลข (ราคา 70 บาท = ทีละ 1 บาท) */
  function tStep(v) { v = Math.abs(v); return v < 200 ? 1 : v < 1000 ? 5 : v < 5000 ? 10 : 100; }
  function trialFoot() {
    if (!state.trial) return '';
    return '<div class="tbtns"><button type="button" class="sbtn" data-act="t-use">ใช้ค่านี้</button><button type="button" class="sbtn light" data-act="t-reset">' + ICON.undo + 'คืนค่าเดิม</button></div>';
  }
  /* ค่าที่ลองไว้ในสินค้าหรือช่องทางที่ไม่ได้แสดงอยู่ (เช่น เปลี่ยนไปดูช่องทางอื่นแล้ว) */
  function trialElse(pi, cj) {
    var T = state.trial, L = [];
    if (!T) return '';
    Object.keys(T.p).forEach(function (i) { var it = pcItems(state.pc)[+i]; if (+i !== pi && it) L.push(it.name); });
    Object.keys(T.c).forEach(function (j) { var c = chList(state.pc)[+j]; if (+j !== cj && c) L.push(chName(c)); });
    return L.length ? '<span class="dl4o">' + tw('รวมค่าที่ลองไว้ใน ' + L.join(' · ') + ' ด้วย') + '</span>' : '';
  }
  function deltaLine(Rb, Rt, pi, cj) {
    var d = Rt.profit - Rb.profit, o = trialElse(pi, cj);
    if (Math.abs(d) < 0.5) return '<p class="dl4" id="dl4">กำไรของร้านเท่าเดิม' + o + '</p>';
    return '<p class="dl4" id="dl4">กำไรของร้าน <b class="' + (d > 0 ? 'up' : 'down') + '">' + (d > 0 ? 'เพิ่มขึ้น ' : 'ลดลง ') + fmtN(Math.abs(d)) + '</b> บาท/เดือน (จาก ' + moneyTxt(Rb.profit) + ' เป็น ' + moneyTxt(Rt.profit) + ')' + o + '</p>';
  }
  function wfHtml(x, p, c) {
    var max = Math.max(x.list, 1), rows = [['ราคาบน' + (chIsShop(c) ? 'หน้าร้าน' : 'ช่องทางนี้'), x.list, '']];
    if (x.disc > 0.005) rows.push(['ส่วนลดที่ร้านออก', -x.disc, '']);
    if (x.fee > 0.005) rows.push(['ค่าธรรมเนียม', -x.fee, '']);
    rows.push([state.model === 'resell' ? 'ราคาที่ซื้อมา' : 'ต้นทุน' + SW(), -x.cost, '']);
    if (x.pack > 0.005) rows.push([packWord(), -x.pack, '']);
    rows.push(['เหลือ', x.left, 'l']);
    return '<div class="wf4">' + rows.map(function (r) {
      var w = Math.min(100, Math.abs(r[1]) / max * 100);
      return '<div class="r' + (r[2] ? ' ' + r[2] : '') + (r[2] && r[1] < -0.005 ? ' neg' : '') + '"><span>' + esc(r[0]) + '</span><i aria-hidden="true"><b style="width:' + w.toFixed(1) + '%"></b></i><em>' + (r[1] < -0.005 ? '−' : '') + fmtN(Math.abs(r[1]), Math.abs(r[1]) < 100 ? 1 : 0) + '</em></div>';
    }).join('') + '</div>';
  }
  function viewProd() {
    var Rb = R0(), R = RT(), i = state.sel, p = R.prods[i];
    if (!p) { state.view = 'result'; return viewResult(); }
    var it = pcItems(state.pc)[i], cs = p.cells, u = p.rest ? 'ชิ้น' : U4(p);
    if (!cs.some(function (x) { return x.j === state.dch; })) state.dch = cs.length ? cs[0].j : 0;
    var x = cellOf(R, i, state.dch), c = R.chs[state.dch], rk = R.rank.indexOf(p) + 1;
    var bestC = cs.reduce(function (b, y) { return !b || y.left > b.left ? y : b; }, null);
    var sel = R.many && cs.length > 1 ? '<div class="chips chsel" role="group" aria-label="เลือกช่องทาง">' + cs.map(function (y) {
      return '<button type="button" class="chip" data-act="dch" data-v="' + y.j + '" aria-pressed="' + (y.j === state.dch) + '">' + tw(chName(R.chs[y.j])) + '</button>';
    }).join('') + '</div>' : '';
    var cond = '';
    if (x && !p.rest) {
      var real = x.cost + x.fee + x.pack;
      cond += '<p class="cn4">' + tw(thj('ต้นทุนจริงต่อ' + u + 'เมื่อขายผ่าน', chName(c))) + ' = <b>' + fmtN(real, 1) + '</b>\u00a0บาท (ต้นทุนที่กรอก ' + fmtN(x.cost, 1) + '\u00a0บาท)</p>';
      if (x.left < -0.005) { var lp = listPriceFor(c, x.cost, 0); if (lp !== null) cond += '<p class="cn4">ราคาบนช่องทางนี้ที่ทำให้ไม่ขาดทุน: ประมาณ <b>' + fmtN(Math.ceil(lp - 1e-9)) + '</b>\u00a0บาท</p>'; }
      if (bestC && bestC.j !== state.dch && bestC.left > x.left + 0.005) { var lp2 = listPriceFor(c, x.cost, bestC.left); if (lp2 !== null) cond += '<p class="cn4">' + tw(thj('ราคาบนช่องทางนี้ที่ทำให้เหลือเท่า', chName(R.chs[bestC.j]))) + ' (' + fmtN(bestC.left, 1) + '\u00a0บาท): ประมาณ <b>' + fmtN(Math.ceil(lp2 - 1e-9)) + '</b>\u00a0บาท</p>'; }
    }
    var ch = chList(state.pc)[state.dch], nOn = ch ? pcItems(state.pc).filter(function (q) { return !chOff(ch, q.id); }).length : 0;
    var tr = p.rest ? '' : '<section class="card try4">' + hq('h3', 'ลองปรับ', 'try', 'ลองเปลี่ยนตัวเลขดูก่อน ยังไม่แก้ตัวเลขจริง · กด “ใช้ค่านี้” ถ้าอยากใช้ค่าที่ลอง · เปลี่ยนช่องทางที่ดูด้านบนได้ ค่าที่ลองไว้ไม่หาย') +
      '<h4 class="tg4">' + tw('ตัวเลขของ' + (/^[A-Za-z0-9]/.test(p.name) ? ' ' : '') + p.name) + '</h4>' +
      stepper('p', i, 'price', 'ราคาปกติต่อ' + u, n0(it.price), tStep(n0(it.price)), 'บาท', 0.01, 1e9) +
      stepper('p', i, 'cost', (state.model === 'resell' ? 'ราคาที่ซื้อมาต่อ' : 'ต้นทุนต่อ') + u, n0(it.cost), tStep(n0(it.cost)), 'บาท', 0, 1e9) +
      (ch ? '<h4 class="tg4">' + tw(thj('ตัวเลขของ', chName(ch))) + '</h4>' + (nOn > 1 ? '<p class="tgn4">' + tw(thj('มีผลกับทุก' + SW() + 'ที่ขายผ่าน', chName(ch))) + '</p>' : '') + chSteppers(ch, state.dch, false) : '') +
      deltaLine(Rb, R, i, ch ? state.dch : -1) + trialFoot() + '</section>';
    return bar(backBtn('กลับไปดูผล'), p.name, 'รายละเอียด' + SW()) + '<main class="screen"><div class="wrap">' +
      '<section class="panel res4" id="dpanel"><h1 class="eyebrow">เงินที่เหลือต่อเดือน · <span class="nw">อันดับ ' + rk + ' จาก ' + R.prods.length + '</span><span class="sr"> · ' + esc(p.name) + '</span></h1>' +
      '<div class="bignum">' + (p.left < -0.5 ? '−' : '') + anim('pl-' + i, p.left) + '<span class="u">บาท/เดือน</span></div>' +
      '<div class="walk"><div><span>ยอดขาย</span><b>' + fmtN(p.rev) + '</b></div><div><span>ขายได้</span><b>' + fmtN(p.unitsIn / R.mult, 1) + ' ' + esc(u) + '/' + perW() + '</b></div>' +
      (p.rest ? '' : '<div><span>เหลือเฉลี่ย' + esc(u) + 'ละ</span><b>' + moneyTxt(p.leftPer, 1) + '</b></div>') + '</div></section>' +
      '<section class="block">' + hq('h2', tw((c ? thj('ขาย 1 ' + u + 'ผ่าน', chName(c)) : 'ขาย 1 ' + u) + ' เงินไปไหน'), 'wf', 'ราคาที่ลูกค้าจ่าย ลบส่วนลดที่ร้านออก ค่าธรรมเนียม ต้นทุน' + SW() + (state.model === 'service' ? '' : ' และค่าแพ็กและค่าส่งต่อชิ้น') + ' เหลือเท่าไรให้ร้าน') +
      sel + (x ? wfHtml(x, p, c) : '') + cond + '</section>' + tr + '</div></main>';
  }
  /* ตัวเลขของช่องทางที่ลองปรับได้ (เรียงตามแถว "เงินไปไหน") · ชิ้นต่อออร์เดอร์ขึ้นเมื่อมีค่าแพ็ก · ค่าใช้จ่ายรายเดือนอยู่ในหน้าช่องทาง */
  function chSteppers(ch, j, monthly) {
    var shop = chIsShop(ch), svc = state.model === 'service', mk = ch.priceMode === 'down' ? -n0(ch.markup) : ch.priceMode === 'up' ? n0(ch.markup) : 0;
    var po = tval('c', j, 'perOrder', n0(ch.perOrder)), u = U(state.inp, state.model);
    return (shop ? '' : stepper('c', j, 'markup', 'ราคาบนช่องทางนี้เทียบราคาปกติ (+ สูงกว่า / − ต่ำกว่า)', mk, 5, '%', -99, 300)) +
      stepper('c', j, 'disc', 'ส่วนลดที่ร้านออก', n0(ch.disc), 1, '% ของราคา', 0, 99) +
      stepper('c', j, 'fee', 'ค่าธรรมเนียม', n0(ch.fee), 1, '%' + (ch.vat === 'ex' && n0(ch.fee) > 0 ? ' + VAT' : ''), 0, 99) +
      (svc && ch.kind !== 'onsite' ? '' : stepper('c', j, 'perOrder', svc ? 'ค่าเดินทางต่อครั้ง' : 'ค่าแพ็กและค่าส่งต่อออร์เดอร์', n0(ch.perOrder), 1, 'บาท', 0, 1e6)) +
      (!svc && po > 0 ? stepper('c', j, 'ipo', 'ออร์เดอร์หนึ่งมีเฉลี่ยกี่' + u, num(ch.ipo) >= 1 ? n0(ch.ipo) : 1, 0.1, u, 1, 1000) : '') +
      (monthly ? stepper('c', j, 'monthly', 'ค่าใช้จ่ายรายเดือนของช่องทางนี้', n0(ch.monthly), 100, 'บาท', 0, 1e9) : '');
  }
  function viewChan() {
    var Rb = R0(), R = RT(), j = state.sel, c = R.chans[j];
    if (!c) { state.view = 'result'; return viewResult(); }
    var ch = chList(state.pc)[j];
    var rows = c.cells.slice().sort(function (a, b) { return a.left - b.left; }).map(function (x) {
      var p = R.prods[x.i];
      return '<div class="cr4' + (x.left < -0.005 ? ' neg' : '') + '"><span>' + tw(p.name) + '</span><b>' + (x.left < -0.005 ? '▼ ' : '') + moneyTxt(x.left, 1) + '<small>/' + esc(p.rest ? 'ชิ้น' : U4(p)) + '</small></b><i>' + money(x.leftM) + '<small>/เดือน</small></i></div>';
    }).join('');
    var tr = '<section class="card try4">' + hq('h3', 'ลองปรับ', 'try', 'ลองเปลี่ยนตัวเลขของช่องทางนี้ดูก่อน ยังไม่แก้ตัวเลขจริง · กด “ใช้ค่านี้” ถ้าอยากใช้ค่าที่ลอง') +
      chSteppers(ch, j, true) + deltaLine(Rb, R, -1, j) + trialFoot() + '</section>';
    return bar(backBtn('กลับไปดูผล'), c.name, 'รายละเอียดช่องทาง') + '<main class="screen"><div class="wrap">' +
      '<section class="panel res4" id="dpanel"><h1 class="eyebrow">' + (c.monthly > 0.5 ? 'เหลือจริงต่อเดือน' : 'เงินที่เหลือต่อเดือน') + ' · ' + tw(c.name) + '</h1>' +
      '<div class="bignum">' + (c.after < -0.5 ? '−' : '') + anim('ca-' + j, c.after) + '<span class="u">บาท</span></div>' +
      '<div class="walk"><div><span>ยอดขาย</span><b>' + fmtN(c.rev) + '</b></div>' +
      '<div><span>ต้นทุน' + SW() + '</span><b>−' + fmtN(c.cost) + '</b></div>' +
      (c.fee > 0.5 ? '<div><span>ค่าธรรมเนียม</span><b>−' + fmtN(c.fee) + '</b></div>' : '') +
      (c.pack > 0.5 ? '<div><span>' + packWord() + '</span><b>−' + fmtN(c.pack) + '</b></div>' : '') +
      '<div class="k"><span>เงินที่เหลือ</span><b>' + moneyTxt(c.left) + '</b></div>' +
      (c.monthly > 0.5 ? '<div><span>ค่าใช้จ่ายของช่องทาง</span><b>−' + fmtN(c.monthly) + '</b></div>' : '') + '</div>' +
      (c.disc > 0.5 ? '<p class="sub">ส่วนลดที่ร้านออกเดือนละ ' + fmtN(c.disc) + ' บาท (หักออกจากยอดขายแล้ว)</p>' : '') + '</section>' +
      '<section class="block">' + hq('h2', 'ขาย 100 บาท เหลือ ' + (c.per100 < 0 ? '−' : '') + fmtN(Math.abs(c.per100), 1) + ' บาท', 'c100', 'จากยอดขาย 100 บาทผ่านช่องทางนี้ แต่ละส่วนไปที่ไหน · ส่วนที่เหลือใช้จ่ายค่าใช้จ่ายของช่องทางและของร้าน') +
      '<div class="card">' + stackHtml(c) + legendN(c) + '</div></section>' +
      '<section class="block">' + hq('h2', SW() + 'ที่ขายผ่านช่องทางนี้', 'cp', 'เรียงจากเหลือเงินต่อชิ้นน้อยไปมาก') + '<div class="card crl4">' + rows + '</div></section>' + tr + '</div></main>';
  }

  /* ============================================================ แก้ตัวเลข (ที่เดียวสำหรับแก้ทุกตัวเลข) */
  function rvRow(act, data, t, v) { return '<button type="button" class="rv-row" data-act="' + act + '"' + data + '><span class="t">' + t + '</span><span class="v">' + v + '</span>' + ICON.chev + '</button>'; }
  function viewReview() {
    var items = pcItems(state.pc), chs = chList(state.pc), inp = state.inp;
    var rows = rvRow('edit', ' data-v="items"', SW() + ' ' + items.length + ' รายการ', esc(items.map(function (p) { return p.name || 'ยังไม่มีชื่อ'; }).join(' · ')) + (state.pc.rest && state.pc.rest.on ? ' · ' + SW() + 'อื่น ๆ' : '')) +
      rvRow('edit', ' data-v="chpick"', 'ช่องทางขาย', esc(chs.map(chName).join(' · ')));
    if (chMany(state.pc)) rows += rvRow('edit', ' data-v="share"', 'สัดส่วนการขาย', chs.map(function (c) { return esc(chName(c)) + ' ' + fmtN(n0(c.share), 1) + '%'; }).join(' · '));
    chs.forEach(function (c, j) {
      var bits = [];
      if (!chIsShop(c)) bits.push(c.priceMode === 'up' ? 'ราคาสูงกว่า ' + fmtN(n0(c.markup), 1) + '%' : c.priceMode === 'down' ? 'ราคาต่ำกว่า ' + fmtN(n0(c.markup), 1) + '%' : 'ราคาเท่าราคาปกติ');
      bits.push('ค่าธรรมเนียม ' + fmtN(n0(c.fee), 2) + '%' + (n0(c.fee) > 0 && c.vat === 'ex' ? ' + VAT' : ''));
      if (n0(c.disc) > 0) bits.push('ส่วนลด ' + fmtN(n0(c.disc), 1) + '%');
      if (n0(c.perOrder) > 0) bits.push(state.model === 'service' ? 'ค่าเดินทาง ' + fmtN(n0(c.perOrder), 1) + ' บาท/ครั้ง' : 'ค่าแพ็ก ' + fmtN(n0(c.perOrder), 1) + ' บาท/ออร์เดอร์');
      if (n0(c.monthly) > 0) bits.push('รายเดือน ' + fmtN(n0(c.monthly)) + ' บาท');
      rows += rvRow('edit', ' data-v="ch" data-k="' + j + '"', esc(chName(c)), esc(bits.join(' · ')));
    });
    var fx = FIXED_STEPS.map(function (st, k) {
      var v = st.f.filter(function (x) { var f = fieldDef(x); return f && (!f.show || f.show(inp, state.model)); }).map(function (x) { var f = fieldDef(x); return f.label(inp, state.model) + ' ' + fmtN(n0(getP('inp.' + x))); }).join(' · ');
      return rvRow('edit', ' data-v="fixed" data-k="' + k + '"', st.q.replace(/\?$/, ''), esc(v));
    }).join('');
    return bar(backBtn('กลับไปดูผล'), 'แก้ตัวเลข', '') + '<main class="screen"><div class="wrap">' +
      '<h1 class="sr">แก้ตัวเลข</h1><h2 class="sec4">' + SW() + 'และช่องทาง</h2><div class="rv">' + rows + '</div>' +
      '<div class="hq sec4"><h2>ตัวเลขร้าน</h2>' + qmBtn('rv-sh', 'ตัวเลขร้าน') + '</div>' + qmT('rv-sh', 'ใช้ร่วมกับเครื่องมืออื่นใน Business Lab แก้ที่ไหนก็เปลี่ยนทุกเครื่องมือ') + '<div class="rv">' + fx + '</div>' +
      '<p class="fine4">รูปแบบร้าน: ' + esc(MODELS[state.model].tile) + ' · เปลี่ยนได้ที่หน้าแรก</p></div></main>' +
      '<div class="foot" id="foot"><div class="wrap"><button class="btn" data-act="result">ดูผล' + ICON.next + '</button></div></div>';
  }

  /* ============================================================ หาจุดที่ควรตรวจสอบ */
  function askList() { return pcAskList(R0()); }
  function viewAsk() {
    var L = askList(); if (state.qidx >= L.length) state.qidx = L.length - 1;
    var q = L[state.qidx], b = QB4[q], a = state.answers[q], ctx = pcAskCtx(R0());
    return bar(backBtn('กลับไปดูผล'), 'หาจุดที่ควรตรวจสอบ', 'ข้อ ' + (state.qidx + 1) + ' จาก ' + L.length) + '<main class="screen"><div class="wrap">' +
      '<div class="prog" aria-hidden="true">' + L.map(function (x, n) { return '<i class="' + (n <= state.qidx ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<h1 class="ask-q">' + tw(qbText(q, ctx)) + '</h1><div class="ask-ans" role="group" aria-label="คำตอบ">' + ['yes', 'no', 'unsure'].map(function (v) {
        return '<button type="button" data-act="answer" data-q="' + q + '" data-v="' + v + '" aria-pressed="' + (a === v) + '">' + esc(ansLabel(b, v)) + '</button>';
      }).join('') + '</div>' +
      (state.qidx > 0 ? '<div class="qnav"><button class="lnk" data-act="q-prev">‹ ข้อก่อนหน้า</button></div>' : '') + '</div></main>';
  }
  function toolsHtml(codes) {
    return '<div class="tools">' + codes.filter(function (c) { return TOOLS[c]; }).map(function (c) {
      return '<button type="button" class="tool" data-act="tool" data-t="' + c + '"><span class="tn">' + esc(TOOLS[c][0]) + '</span><span class="ts">' + esc(TOOLS[c][1]) + '</span>' + ICON.out + '</button>';
    }).join('') + '</div>';
  }
  function viewPoints() {
    var L = askList(), A = state.answers, pts = L.filter(function (q) { return ansFlag(QB4[q], A[q]); }), ctx = pcAskCtx(R0());
    var out = bar(backBtn('กลับไปดูผล'), 'จุดที่ควรตรวจสอบ', '') + '<main class="screen"><div class="wrap"><h1 class="sr">จุดที่ควรตรวจสอบ</h1>';
    if (!pts.length) out += '<div class="ok-box"><b>ไม่พบจุดที่ควรตรวจสอบจากคำตอบ</b><p>ตอบครบทุกข้อแล้ว ไม่มีข้อที่ต้องตรวจสอบเพิ่ม</p></div>' + toolsHtml(['bmc10', 'grow13', 'bmc8']);
    else out += '<div class="points">' + pts.map(function (q) {
      var b = QB4[q];
      var nm = qbName(q, ctx);
      return '<div class="point"><div class="pt"><span>' + tw(b.p + (nm ? ' · ' + nm : '')) + '</span>' + (A[q] === 'unsure' ? '<span class="unsure">ไม่แน่ใจ</span>' : '') + '</div><p class="pd">' + esc(b.d) + '</p>' + toolsHtml(b.tools) + '</div>';
    }).join('') + '</div>';
    return out + planRow() + '<div class="skip"><button class="lnk" data-act="ask-again">ตอบใหม่</button></div></div></main>' +
      '<div class="foot" id="foot"><div class="wrap"><button class="btn ghost" data-act="result">กลับไปดูผล</button></div></div>';
  }

  /* ============================================================ RENDER + NAV */
  function render() {
    var v = state.view;
    if (state.model && PC_MODELS.indexOf(state.model) < 0) { state.model = null; v = state.view = 'start'; }
    if (!state.model && v !== 'start') v = state.view = 'start';
    if (state.model && !fixedOk(state.inp)) state.askFixed = true;
    if (['result', 'prod', 'chan', 'review', 'ask', 'points'].indexOf(v) >= 0 && !flowOk()) {
      var fb = firstBad();
      if (fb) { state.view = v = fb.v; state.k = fb.k; } else v = state.view = 'start';
    }
    if (v === 'fixed' && !state.askFixed && !state.editing) state.askFixed = true;
    if (v === 'share' && !chMany(state.pc)) { v = state.view = 'chpick'; state.k = 0; }
    if (v === 'ch' && !chList(state.pc)[state.k]) { if (chList(state.pc).length) state.k = chList(state.pc).length - 1; else { v = state.view = 'chpick'; state.k = 0; } }
    if (v === 'fixed' && !FIXED_STEPS[state.k]) state.k = 0;
    if (v === 'items' || v === 'chpick' || v === 'share') state.k = 0;
    fixRestOn();
    app.innerHTML = v === 'start' ? viewStart() : v === 'items' ? viewItems() : v === 'chpick' ? viewChpick() : v === 'share' ? viewShare() : v === 'ch' ? viewCh()
      : v === 'fixed' ? viewFixed() : v === 'prod' ? viewProd() : v === 'chan' ? viewChan() : v === 'review' ? viewReview() : v === 'ask' ? viewAsk() : v === 'points' ? viewPoints() : viewResult();
    runAnim(app);
    flip();
    var foot = $('#foot');
    document.documentElement.style.setProperty('--foot-h', (foot ? foot.offsetHeight : 0) + 'px');
    save();
  }
  /* อันดับขยับ: แถวที่เปลี่ยนที่เลื่อนจากตำแหน่งเดิม (ปิดเมื่อเครื่องตั้งลดการเคลื่อนไหว) */
  var lastPos = {};
  function flip() {
    var els = $$('[data-rk]'), now = {};
    els.forEach(function (el) { now[el.getAttribute('data-act') + el.getAttribute('data-rk')] = el.getBoundingClientRect().top + window.scrollY; });
    if (!reduced) els.forEach(function (el) {
      var key = el.getAttribute('data-act') + el.getAttribute('data-rk'), was = lastPos[key];
      if (was === undefined || Math.abs(was - now[key]) < 2) return;
      el.style.transform = 'translateY(' + (was - now[key]) + 'px)'; el.style.transition = 'none';
      el.getBoundingClientRect();
      el.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1)'; el.style.transform = '';
    });
    lastPos = now;
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
  /* ย้อนกลับในแอปกับของมือถือไปที่เดียวกัน:
     ระหว่างกรอก → ข้อก่อนหน้า (ข้อแรก → หน้าแรก) · แก้ทีละส่วน → หน้าแก้ตัวเลข (ยังไม่ครบ = ยกเลิกการแก้นั้น)
     ผล → หน้าแรก · แก้ตัวเลข / รายละเอียด / หาจุดที่ควรตรวจสอบ → ผล · หน้าแรก → ออกไปหน้า Business Lab */
  function goBack(noPush) {
    var v = state.view;
    if (FLOW_VIEWS.indexOf(v) >= 0) {
      if (state.editing) { var cm = cancelEdit(); state.editing = false; go(flowOk() ? 'review' : 'start', true, noPush); if (cm) toast(cm); return; }
      var S = flowSteps(), i = flowIdx();
      if (i > 0) goStep(S[i - 1], true, noPush); else go('start', true, noPush);
    } else if (v === 'prod' || v === 'chan') { state.trial = null; go('result', true, noPush); }
    else if (v === 'review' || v === 'ask' || v === 'points') go('result', true, noPush);
    else if (v !== 'start') go('start', true, noPush);
  }
  function cancelEdit() {
    if (!state.edOrig) return null;
    var msg = null;
    if (!flowOk()) { state.pc = state.edOrig.pc; state.inp = state.edOrig.inp; msg = 'ยกเลิกตัวเลขที่ยังไม่ครบ ใช้ตัวเลขเดิม'; }
    state.edOrig = null;
    return msg;
  }
  /* ประวัติของมือถือ: 1 ขั้นต่อการกดย้อนกลับ 1 ครั้งกว่าจะถึงหน้าแรก (เพิ่มเฉพาะตอนแตะ ไม่เพิ่มตอนกดย้อนกลับ) */
  var hdepth = 0, leaving = false;
  function needDepth() {
    var v = state.view;
    if (v === 'start') return 0;
    if (v === 'result') return 1;
    if (v === 'review' || v === 'prod' || v === 'chan' || v === 'ask' || v === 'points') return 2;
    if (FLOW_VIEWS.indexOf(v) >= 0) return state.editing ? 3 : Math.max(0, flowIdx()) + 1;
    return 1;
  }
  function hpush() { try { history.pushState({ lab4: 1, d: hdepth + 1 }, ''); hdepth++; } catch (e) { /* ignore */ } }
  function leaveAll() { if (hdepth > 0) { var k = hdepth; hdepth = 0; leaving = true; try { history.go(-k); } catch (e) { leaving = false; } } }
  function readDepth(st) { return st && st.lab4 && typeof st.d === 'number' ? st.d : 0; }
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

  /* ---------- ช่องที่ยังขาด ---------- */
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
  function stepMissing(st) {
    var inp = state.inp, pc = state.pc;
    if (st.v === 'items') {
      if (inp.volumePer !== 'day' && inp.volumePer !== 'month') return ['inp.volumePer'];
      if (inp.volumePer === 'day' && !daysOk(inp)) return ['inp.daysOpen', num(inp.daysOpen) > 31 ? 'เดือนหนึ่งมีไม่เกิน 31 วัน' : null];
      var its = pcItems(pc);
      for (var i = 0; i < its.length; i++) {
        var p = its[i];
        if (!String(p.name || '').trim()) return ['i.' + i + '.name'];
        if (pos(p.price) === null) return ['i.' + i + '.price', num(p.price) === 0 ? 'ราคาต้องมากกว่า 0' : null];
        if (num(p.cost) === null || num(p.cost) < 0) return ['i.' + i + '.cost'];
        if (pos(p.qty) === null) return ['i.' + i + '.qty', num(p.qty) === 0 ? 'ใส่จำนวนที่ขายได้ (ถ้าไม่ได้ขายแล้ว ลบสินค้านี้ออก)' : null];
      }
      if (!restAnswered(pc)) return ['r.on'];
      if (pc.rest.on === true) {
        if (pos(pc.rest.sales) === null) return ['r.sales'];
        if (num(pc.rest.costPct) === null || num(pc.rest.costPct) < 0 || num(pc.rest.costPct) >= 100) return ['r.costPct', num(pc.rest.costPct) >= 100 ? 'ต้องน้อยกว่า 100%' : null];
      }
      return null;
    }
    if (st.v === 'chpick') {
      if (!chList(pc).length) return ['chpick', 'เลือกอย่างน้อย 1 ช่องทาง'];
      var bad = chList(pc).map(function (c, j) { return c.kind === 'other' && !String(c.name || '').trim() ? j : -1; }).filter(function (x) { return x >= 0; })[0];
      return bad !== undefined ? ['c.' + bad + '.name'] : null;
    }
    if (st.v === 'share') {
      var e = chList(pc).map(function (c, j) { return num(c.share) === null || num(c.share) <= 0 ? j : -1; }).filter(function (x) { return x >= 0; })[0];
      if (e !== undefined) return ['c.' + e + '.share', num(chList(pc)[e].share) === 0 ? 'ถ้าไม่ได้ขายช่องทางนี้แล้ว ลบออกที่ข้อก่อนหน้า' : null];
      return Math.abs(shareSum(pc) - 100) < 0.51 ? null : ['share-tot', 'รวมกันต้องได้ 100% ตอนนี้ได้ ' + fmtN(shareSum(pc), 1) + '%'];
    }
    if (st.v === 'ch') {
      var c = chList(pc)[st.k], k = chMissing(c, pc);
      if (!k && st.k === chList(pc).length - 1) { var nc = noChannelItem(); if (nc) return ['c.' + st.k + '.off', thj(nc.name, 'ยังไม่มีช่องทางให้ขาย เปิดอย่างน้อย 1 ช่องทาง')]; }
      if (!k) return null;
      var msg = null;
      if (k === 'markup' && c.priceMode === 'down' && n0(c.markup) >= 100) msg = 'ต้องน้อยกว่า 100%';
      if ((k === 'fee' || k === 'disc') && num(c[k]) >= 100) msg = 'ต้องน้อยกว่า 100%';
      if (k === 'ipo' && num(c.ipo) !== null && num(c.ipo) < 1) msg = 'อย่างน้อย 1';
      if (k === 'off') msg = 'เปิดอย่างน้อย 1 สินค้า หรือลบช่องทางนี้ออก';
      return ['c.' + st.k + '.' + k, msg];
    }
    if (st.v === 'fixed') {
      var fs = FIXED_STEPS[st.k].f;
      for (var x = 0; x < fs.length; x++) { var f = fieldDef(fs[x]); if (f && f.req && (!f.show || f.show(inp, state.model)) && num(inp[fs[x]]) === null) return ['inp.' + fs[x]]; }
    }
    return null;
  }
  /* สินค้าที่ปิดทุกช่องทาง: บอกที่ช่องทางสุดท้าย */
  function noChannelItem() { var its = pcItems(state.pc); for (var i = 0; i < its.length; i++) if (itemNoChannel(state.pc, its[i])) return its[i]; return null; }

  /* ============================================================ EVENTS */
  function chooseModel(m) {
    var sh = typeof LabShop !== 'undefined' ? LabShop.get() : null;
    /* ข้อมูลของผู้ใช้ก่อนเปลี่ยนแบบร้าน (ไม่ใช่ร้านตัวอย่าง) */
    var prev = state.model && !state.isSample ? { model: state.model, inp: state.inp, link: state.link } : null;
    if (!prev) state.pc = emptyPc();
    /* ตัวเลขร้านชุดกลางเป็นของตัวที่ 4 เอง (สร้างหรือผู้ใช้เลือกใช้ยอดจากรายสินค้า): เปลี่ยนแบบร้านแล้วยังเขียนกลับต่อ */
    var owned = !!(prev && prev.link === 'own' && sh && sh.model === prev.model && lastPut === sh.model + '|' + JSON.stringify(sh.inp));
    state.isSample = false; state.sampleKind = null; state.model = m; state.answers = {}; state.trial = null; state.editing = false;
    if (sh && sh.model === m) {
      var cp = advNormalize(JSON.parse(JSON.stringify(sh.inp)), m);
      if (prev) convertPer(state.pc, prev.inp, cp);
      state.inp = cp; state.link = prev && prev.link === 'own' && pcDiff(state.pc, cp, m) === null ? 'own' : 'shared'; lastPut = sh.model + '|' + JSON.stringify(sh.inp);
    } else {
      var inp = { volumePer: (prev && prev.inp.volumePer) || MODELS[m].defPer || 'day', unitLabel: MODELS[m].defUnit };
      if (prev && prev.inp.daysOpen !== undefined) inp.daysOpen = prev.inp.daysOpen;
      /* ค่าใช้จ่ายคงที่ใช้ชุดเดิม (คำถามเดียวกันทุกแบบร้าน) รวมถึงค่าใช้จ่ายของช่องทางที่รวมในงบการตลาดแล้ว (chMkt) */
      var src = sh ? sh.inp : prev ? prev.inp : null;
      if (src) syncFixed(inp, src);
      state.inp = inp; state.link = !sh || owned ? 'own' : 'local';
    }
    if (!state.inp.volumePer) state.inp.volumePer = MODELS[m].defPer || 'day';
    state.pc = state.mine && state.mine.model === m && state.mine.pc ? state.mine.pc : carryPc(state.pc, m);
    state.mine = null;
    if (!pcItems(state.pc).length) state.pc.items = [newItem()];
    state.askFixed = !fixedOk(state.inp);
  }
  /* เปลี่ยนแบบร้าน: สินค้ายังอยู่ (หน่วยที่ไม่มีในแบบใหม่ใช้หน่วยหลักของแบบใหม่) · ช่องทางที่ไม่มีในแบบใหม่ตัดออก */
  function carryPc(pc, m) {
    pc = pc ? JSON.parse(JSON.stringify(pc)) : emptyPc();
    pc.items = (pc.items || []).map(function (p) { if (MODELS[m].units.indexOf(p.unit) < 0) p.unit = MODELS[m].defUnit; return p; });
    pc.channels = (pc.channels || []).filter(function (c) { return CH_KINDS[c.kind] && CH_KINDS[c.kind].m.indexOf(m) >= 0; });
    if (m === 'service') pc.channels.forEach(function (c) { c.ipo = 1; if (c.kind !== 'onsite') c.perOrder = 0; });
    return pc;
  }
  function newItem() { return { id: newId('p'), name: '', unit: MODELS[state.model].defUnit, price: null, cost: null, qty: null }; }
  function newCh(kind) {
    var svc = state.model === 'service';
    return { id: newId('c'), kind: kind, name: '', share: null, priceMode: kind === 'shop' ? 'same' : null, markup: null, fee: null, vat: null, disc: null,
      perOrder: svc && kind !== 'onsite' ? 0 : null, ipo: svc ? 1 : null, monthly: null, off: {} };
  }
  function useSample() {
    var k = sampleKindFor(), S = pcSample(k);
    if (!state.isSample && state.model) state.mine = { model: state.model, inp: state.inp, pc: state.pc, link: state.link };
    state.isSample = true; state.sampleKind = k; state.model = S.m; state.inp = S.inp; state.pc = S.pc; state.answers = {}; state.trial = null; state.editing = false;
    state.tab = 'p';
  }
  function leaveSample() {
    var mine = state.mine;
    state.isSample = false; state.sampleKind = null;
    if (mine && PC_MODELS.indexOf(mine.model) >= 0) { state.model = mine.model; state.inp = mine.inp; state.pc = mine.pc; state.link = mine.link || 'own'; state.mine = null; }
    else {
      /* ยังไม่มีร้านของผู้ใช้: เริ่มว่าง ไม่เอาตัวเลขของร้านตัวอย่างมา */
      var sh = typeof LabShop !== 'undefined' ? LabShop.get() : null;
      state.model = null; state.mine = null; state.pc = emptyPc(); state.inp = {};
      if (sh && PC_MODELS.indexOf(sh.model) >= 0) chooseModel(sh.model);
    }
    state.answers = {}; state.trial = null;
  }
  function startFlow() {
    state.editing = false; state.askFixed = !fixedOk(state.inp);
    var fb = firstBad();
    if (fb) goStep(fb); else if (flowOk()) go('result'); else goStep({ v: 'items', k: 0 });
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
  function onClick(e) {
    var t = e.target.closest('[data-act]');
    if (!t || t.disabled) return;
    var a = t.getAttribute('data-act');
    switch (a) {
      case 'theme': {
        var nt = themeNow() === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nt);
        try { localStorage.setItem('lab-theme', nt); } catch (er) { /* ignore */ }
        t.innerHTML = nt === 'dark' ? ICON.sun : ICON.moon; break;
      }
      case 'where': {
        state.where = t.getAttribute('data-v');
        if (state.isSample && state.sampleKind !== sampleKindFor()) useSample();
        go('start', false); refocus('[data-act="where"][data-v="' + state.where + '"]'); break;
      }
      case 'sample': useSample(); go('result'); announce('กำลังใช้' + PC_SAMPLES[state.sampleKind].name); break;
      case 'sample1': state.where = PC_SAMPLES[t.getAttribute('data-k')].where; useSample(); go('result'); announce('กำลังใช้' + PC_SAMPLES[state.sampleKind].name); break;
      case 'mine': leaveSample(); if (state.model) startFlow(); else go('start'); break;
      case 'opened': state.inp.preOpen = 0; go(state.view, false); toast('ใช้เป็นตัวเลขของร้านที่เปิดแล้ว'); break;
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
          var days = pos(state.inp.daysOpen) || 30, f = nv === 'month' ? days : 1 / days;
          var rr = function (v) { return Math.round(v * f * 100) / 100; };
          var had = pcItems(state.pc).some(function (p) { return num(p.qty) !== null; }) || (state.pc.rest && num(state.pc.rest.sales) !== null);
          if (cur === 'day' || cur === 'month') {
            pcItems(state.pc).forEach(function (p) { if (num(p.qty) !== null) p.qty = rr(num(p.qty)); });
            if (state.pc.rest && num(state.pc.rest.sales) !== null) state.pc.rest.sales = Math.round(num(state.pc.rest.sales) * f);
            /* ตัวเลขร้านชุดกลาง: จำนวนขายและกำลังสูงสุดของตัวที่ 1 ต้องแปลงตามด้วย */
            ['volume', 'capacity'].forEach(function (k) { var v = num(state.inp[k]); if (v !== null) state.inp[k] = rr(v); });
          }
          /* นับต่อวัน: จำนวนวันที่ใช้แปลง ใส่ไว้ให้เห็นและแก้ได้ */
          if (nv === 'day' && had && pos(state.inp.daysOpen) === null) state.inp.daysOpen = days;
          state.inp.volumePer = nv; go('items', false); refocus('[data-act="per"][data-v="' + nv + '"]');
          if (had && (cur === 'day' || cur === 'month')) toast(nv === 'month' ? 'เปลี่ยนจำนวนที่ขายเป็นต่อเดือนแล้ว (คูณ ' + fmtN(days) + ' วัน)' : 'เปลี่ยนจำนวนที่ขายเป็นต่อวันแล้ว (หาร ' + fmtN(days) + ' วัน แก้จำนวนวันได้)');
        }
        break;
      }
      case 'pset': {
        var path = t.getAttribute('data-path'), raw = t.getAttribute('data-v'), val = t.getAttribute('data-num') === '1' ? +raw : raw;
        if (path === 'r.on') { state.pc.rest = state.pc.rest || {}; state.pc.rest.on = raw === 'true'; }
        else setP(path, val);
        if (/^c\.\d+\.priceMode$/.test(path) && val === 'same') setP(path.replace('priceMode', 'markup'), null);
        go(state.view, false); refocus('[data-act="pset"][data-path="' + path + '"][data-v="' + raw + '"]'); break;
      }
      case 'item-add': {
        if (pcItems(state.pc).length >= PC_MAX_ITEMS) break;
        state.pc.items.push(newItem()); go('items', false);
        var nn = pcItems(state.pc).length - 1; var ni = $('#f-i-' + nn + '-name'); if (ni) { ni.scrollIntoView({ block: 'center' }); ni.focus({ preventScroll: true }); }
        break;
      }
      case 'item-del': {
        var di = +t.getAttribute('data-i'), gone = state.pc.items[di];
        state.pc.items.splice(di, 1);
        chList(state.pc).forEach(function (c) { if (c.off && gone) delete c.off[gone.id]; });
        go('items', false); toast('ลบ' + (gone && gone.name ? gone.name : 'สินค้า') + 'แล้ว'); break;
      }
      case 'part-open': { var pi = pcItems(state.pc)[+t.getAttribute('data-i')]; pi.parts = [{ n: '', v: num(pi.cost) }, { n: '', v: null }]; go('items', false); refocus('[data-path="pt.' + t.getAttribute('data-i') + '.0.n"]'); break; }
      case 'part-add': { var pa = pcItems(state.pc)[+t.getAttribute('data-i')]; pa.parts.push({ n: '', v: null }); go('items', false); refocus('[data-path="pt.' + t.getAttribute('data-i') + '.' + (pa.parts.length - 1) + '.n"]'); break; }
      case 'part-del': {
        var pd = pcItems(state.pc)[+t.getAttribute('data-i')]; pd.parts.splice(+t.getAttribute('data-k'), 1);
        if (!pd.parts.length) delete pd.parts; else syncParts(pd);
        go('items', false); break;
      }
      case 'ch-toggle': {
        var kk = t.getAttribute('data-k'), chs = state.pc.channels, at = -1;
        chs.forEach(function (c, j) { if (c.kind === kk) at = j; });
        if (at >= 0) chs.splice(at, 1); else if (chs.length < PC_MAX_CH) chs.push(newCh(kk));
        go('chpick', false); refocus('[data-act="ch-toggle"][data-k="' + kk + '"]'); break;
      }
      case 'ch-other': { if (chList(state.pc).length < PC_MAX_CH) { state.pc.channels.push(newCh('other')); go('chpick', false); refocus('#f-c-' + (chList(state.pc).length - 1) + '-name'); } break; }
      case 'ch-del': state.pc.channels.splice(+t.getAttribute('data-j'), 1); go('chpick', false); break;
      case 'share-fill': { var fj = +t.getAttribute('data-j'); chList(state.pc)[fj].share = Math.round((100 - shareSum(state.pc)) * 10) / 10; go('share', false); refocus('#f-c-' + fj + '-share'); break; }
      case 'ch-off': {
        var cj = chList(state.pc)[+t.getAttribute('data-j')], id = t.getAttribute('data-id');
        cj.off = cj.off || {}; if (cj.off[id]) delete cj.off[id]; else cj.off[id] = true;
        go('ch', false); refocus('[data-act="ch-off"][data-id="' + id + '"]'); break;
      }
      case 'result': state.trial = null; go('result'); break;
      case 'tab': {
        state.tab = t.getAttribute('data-v'); go('result', false);
        refocus('#tab-' + state.tab); break;
      }
      case 'prod': state.sel = +t.getAttribute('data-i'); state.trial = null; if (t.hasAttribute('data-c')) state.dch = +t.getAttribute('data-c'); go('prod'); break;
      case 'chan': state.sel = +t.getAttribute('data-j'); state.trial = null; go('chan'); break;
      case 'dch': state.dch = +t.getAttribute('data-v'); go('prod', false); refocus('[data-act="dch"][data-v="' + state.dch + '"]'); break;
      case 'tstep': {
        var tt = t.getAttribute('data-t'), ti = +t.getAttribute('data-i'), tk = t.getAttribute('data-k'), d = +t.getAttribute('data-d');
        var base = tt === 'p' ? pcItems(state.pc)[ti] : chList(state.pc)[ti];
        var curv = tt === 'c' && tk === 'markup' ? (base.priceMode === 'down' ? -n0(base.markup) : base.priceMode === 'up' ? n0(base.markup) : 0) : tk === 'ipo' ? (num(base.ipo) >= 1 ? n0(base.ipo) : 1) : n0(base[tk]);
        var v0 = tval(tt, ti, tk, curv), nv2 = Math.round((v0 + d) * 100) / 100;
        nv2 = Math.max(+t.getAttribute('data-min'), Math.min(+t.getAttribute('data-max'), nv2));
        setTrial(tt, ti, tk, nv2);
        liveDetail(); refocus('[data-act="tstep"][data-k="' + tk + '"][data-d="' + d + '"]'); break;
      }
      case 't-use': {
        var T = state.trial; if (!T) break;
        state.pc = trialPc();
        Object.keys(T.c || {}).forEach(function (cj) { var uc = state.pc.channels[+cj]; if (uc) { if (n0(uc.fee) > 0 && uc.vat !== 'in' && uc.vat !== 'ex') uc.vat = 'in'; if (n0(uc.perOrder) > 0 && !(num(uc.ipo) >= 1)) uc.ipo = 1; } });
        state.trial = null; go(state.view, false); toast('ใช้ค่านี้แล้ว'); break;
      }
      case 't-reset': state.trial = null; go(state.view, false); break;
      case 'apply-agg': {
        var agg = pcAggregate(state.pc, state.inp, state.model, R0());
        if (agg) { state.inp = agg; state.link = 'own'; lastPut = null; go('result', false); toast('ใช้ยอดจากรายสินค้าแล้ว เครื่องมืออื่นใน Business Lab ใช้ตัวเลขนี้ด้วย'); }
        break;
      }
      case 'review': go('review'); break;
      case 'edit': {
        var ev = t.getAttribute('data-v');
        state.editing = true; state.edOrig = { pc: JSON.parse(JSON.stringify(state.pc)), inp: JSON.parse(JSON.stringify(state.inp)) };
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
      case 'plan': toast('แผนธุรกิจของ Jarua ยังไม่เปิดให้ใช้ เร็ว ๆ นี้จะใช้ตัวเลขชุดนี้ต่อได้'); break;
    }
  }
  function setTrial(t, i, k, v) {
    var T = state.trial = state.trial || { p: {}, c: {} };
    T[t][i] = T[t][i] || {};
    T[t][i][k] = v;
  }
  /* ลองปรับ: เปลี่ยนเฉพาะตัวเลขบนหน้า (ช่องที่พิมพ์อยู่ไม่หลุด) */
  function liveDetail() {
    var y = window.scrollY, ae = document.activeElement, aid = ae && ae.id;
    var html = state.view === 'prod' ? viewProd() : viewChan(), tmp = document.createElement('div');
    tmp.innerHTML = html;
    /* ชุดช่องลองปรับเปลี่ยน (เช่น ชิ้นต่อออร์เดอร์ขึ้นเมื่อมีค่าแพ็ก): วาดใหม่ทั้งหน้า แล้วคืนช่องที่พิมพ์อยู่ */
    var keys = function (r) { return $$('[data-tv]', r).map(function (x) { return x.id; }).join(','); };
    if (keys(tmp) !== keys(app)) {
      var pos0 = ae && ae.selectionStart;
      render(); window.scrollTo(0, y);
      var bk = aid && document.getElementById(aid); if (bk) { bk.focus({ preventScroll: true }); try { bk.setSelectionRange(pos0, pos0); } catch (er) { /* ignore */ } }
      return;
    }
    ['#dpanel', '.wf4', '.cn4', '.crl4', '.stack', '.lg4', '#dl4', '.tbtns', '.chsel', '.tcur'].forEach(function (sel) {
      var a2 = $$(sel, app), b2 = $$(sel, tmp);
      a2.forEach(function (el, n) { if (b2[n]) el.outerHTML = b2[n].outerHTML; });
    });
    if (!$('.tbtns', app) && $('.tbtns', tmp)) { var dl = $('#dl4', app); if (dl) dl.insertAdjacentHTML('afterend', $('.tbtns', tmp).outerHTML); }
    $$('[data-tv]', tmp).forEach(function (inp) { var cur = $('#' + inp.id, app); if (cur && cur.id !== aid) cur.value = inp.value; });
    runAnim(app); window.scrollTo(0, y);
    var R = RT(), Rb = R0(); announce(Math.abs(R.profit - Rb.profit) < 0.5 ? 'กำไรของร้านเท่าเดิม' : 'กำไรของร้าน' + (R.profit > Rb.profit ? 'เพิ่มขึ้น ' : 'ลดลง ') + fmtN(Math.abs(R.profit - Rb.profit)) + ' บาทต่อเดือน');
    save();
  }

  function parseNum(el) {
    var raw = el.value.replace(/[,\s]/g, '').replace(/[−–]/g, '-').replace(/[^\d.\-]/g, '');
    if (!el.getAttribute('data-neg')) raw = raw.replace(/-/g, ''); else raw = raw.replace(/(?!^)-/g, '');
    if (raw === '' || raw === '-' || raw === '.') return null;
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
      setTrial(el.getAttribute('data-t'), +el.getAttribute('data-i'), el.getAttribute('data-tv'), v);
      clearTimeout(liveT); liveT = setTimeout(liveDetail, 120);
    }
  }
  /* ระหว่างกรอก: แถบสรุป ยอดรวม % และช่องที่ขึ้นตามคำตอบ (เช่น จำนวนชิ้นต่อออร์เดอร์) โดยไม่วาดช่องที่พิมพ์อยู่ใหม่ */
  function refreshLive() {
    var s = $('#strip'); if (s) { var tmp = document.createElement('div'); tmp.innerHTML = liveStrip(); if (tmp.firstChild) { s.outerHTML = tmp.firstChild.outerHTML; runAnim($('#strip')); } }
    if (state.view === 'share') { var tt = $('#tot4w'), tmp2 = document.createElement('div'); tmp2.innerHTML = viewShare(); var nt = $('#tot4w', tmp2); if (tt && nt) tt.outerHTML = nt.outerHTML; }
    if (state.view === 'items') $$('.pi').forEach(function (card) {
      var i = +card.getAttribute('data-item'), p = pcItems(state.pc)[i];
      if (p && p.parts) { var sum = $('.part-f b', card); if (sum) sum.textContent = fmtN(n0(p.cost), 2); var ci = $('#f-i-' + i + '-cost', card); if (ci) ci.value = fmtIn(p.cost, 'dec'); }
    });
    if (state.view === 'fixed') FIXED_STEPS[state.k].f.forEach(function (k) {
      var f = fieldDef(k), node = $('[data-need="inp.' + k + '"]');
      if (f && f.show && node) node.hidden = !f.show(state.inp, state.model);
    });
    /* ช่องที่ขึ้นตามคำตอบ (VAT ขึ้นเมื่อมีค่าธรรมเนียม · ชิ้นต่อออร์เดอร์ขึ้นเมื่อมีค่าแพ็ก): วาดใหม่เมื่อเปลี่ยนเท่านั้น */
    if (state.view === 'ch') {
      var c = chList(state.pc)[state.k], needVat = n0(c && c.fee) > 0, needIpo = n0(c && c.perOrder) > 0;
      var hasVat = !!$('[data-need="c.' + state.k + '.vat"]'), hasIpo = !!$('[data-need="c.' + state.k + '.ipo"]');
      if (needVat !== hasVat || needIpo !== hasIpo) {
        var ae = document.activeElement, aid = ae && ae.id, pos0 = ae && ae.selectionStart;
        var y = window.scrollY; go('ch', false); window.scrollTo(0, y);
        var back = aid && document.getElementById(aid); if (back) { back.focus({ preventScroll: true }); try { back.setSelectionRange(pos0, pos0); } catch (er) { /* ignore */ } }
      }
    }
  }
  function onBlur(e) {
    var el = e.target;
    if (!el.hasAttribute) return;
    if (el.hasAttribute('data-path') && el.getAttribute('data-t') === 'money') { var v = getP(el.getAttribute('data-path')); if (v !== null && v !== undefined) el.value = fmtIn(v, 'money'); }
    if (el.hasAttribute('data-tv')) { var tv = tval(el.getAttribute('data-t'), +el.getAttribute('data-i'), el.getAttribute('data-tv'), undefined); if (tv !== undefined) el.value = tvFmt(tv); }
  }
  function onKey(e) {
    if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].indexOf(e.key) >= 0 && e.target.getAttribute && e.target.getAttribute('role') === 'tab') {
      var tabs = $$('[role="tab"]', e.target.parentNode), ti = tabs.indexOf(e.target);
      var nx = e.key === 'Home' ? tabs[0] : e.key === 'End' ? tabs[tabs.length - 1] : tabs[(ti + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      if (nx && nx !== e.target) { e.preventDefault(); nx.click(); }
      return;
    }
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
    if (!r) { try { r = JSON.parse(sessionStorage.getItem('lab4') || 'null'); } catch (e) { r = null; } }
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
  window.__lab4 = { state: state, render: render, go: go, R0: R0, useSample: useSample, chooseModel: chooseModel, startFlow: startFlow };
  if (hot && hot.ready) hot.ready(start); else start(hot && hot.data ? hot.data : {});
})();
