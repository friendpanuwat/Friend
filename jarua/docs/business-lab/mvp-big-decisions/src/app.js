/* ============================================================
   UI — เริ่ม (เลือกเรื่อง) → ตัวเลขร้าน (ครั้งเดียว ใช้ได้ทุกเรื่อง) → คำถามของเรื่อง (เห็นผลสดด้านบน)
   → ผล: ไม่ทำ กับ ทำ · เงื่อนไขที่ทำให้คุ้ม · ถ้าไม่เป็นอย่างที่คาด · เงินสด 12 เดือน · เช็กความพร้อม → เครื่องมือ PL1 / แผนธุรกิจ PL2
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
    info: P('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>')
  };
  var TICON = {
    hire: P('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>'),
    place: P('<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>'),
    channel: P('<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>'),
    equip: P('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'),
    branch: P('<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/>')
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
    view: 'start', topic: null, model: null, inp: {}, isSample: false, step: 0, editing: false, dstep: 0, dediting: false,
    ds: {}, trial: {}, active: null, answers: {}, qidx: 0, feeHelp: false, fh: { share: '', rate: '' }
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
    if (R.ok) R.conds = dConds(R, state.inp, state.model, state.topic, d);
    if (emo.size > 200) emo.clear();
    emo.set(key, R);
    return R;
  }
  var smo = new Map();
  function SC(d) {
    var key = state.topic + '|' + JSON.stringify(state.inp) + '|' + JSON.stringify(d);
    if (smo.has(key)) return smo.get(key);
    var s = dScenarios(state.inp, state.model, state.topic, d);
    if (smo.size > 50) smo.clear();
    smo.set(key, s);
    return s;
  }
  function dec() { if (!state.ds[state.topic]) state.ds[state.topic] = Object.assign({}, DEC_DEFAULT[state.topic]); return state.ds[state.topic]; }
  function trialD() { return Object.assign({}, dec(), state.trial); }
  function hasTrial() { return Object.keys(state.trial).length > 0; }

  /* ---------- persistence & theme ---------- */
  function snapshot() {
    return { view: state.view, topic: state.topic, model: state.model, inp: state.inp, isSample: state.isSample, step: state.step, editing: state.editing,
      dstep: state.dstep, dediting: state.dediting, ds: state.ds, trial: state.trial, active: state.active, answers: state.answers, qidx: state.qidx };
  }
  function save() { try { sessionStorage.setItem('lab3', JSON.stringify(snapshot())); } catch (e) { /* ignore */ } }
  function restore(d) {
    if (!d || typeof d !== 'object') return;
    if (d.model && !MODELS[d.model]) return;
    if (d.topic && !TOPICS[d.topic]) return;
    Object.assign(state, d);
    if (!state.model && ['wizard', 'dq', 'result', 'lab', 'ask', 'points', 'review'].indexOf(state.view) >= 0) state.view = 'start';
    if (!state.topic && ['dq', 'result', 'lab', 'ask', 'points'].indexOf(state.view) >= 0) state.view = 'start';
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
      if (from === undefined || Math.abs(from - to) < 0.5 || reduced) { el.textContent = fmtN(Math.abs(to), dc); return; }
      var t0 = performance.now(), dur = 450;
      (function tick(t) {
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmtN(Math.abs(from + (to - from) * e), dc);
        if (p < 1 && el.isConnected) requestAnimationFrame(tick);
      })(t0);
    });
  }
  function signed(v) { return (v < -0.5 ? '−' : v > 0.5 ? '+' : '') + fmtN(Math.abs(v)); }
  function dirSpan(v, txt) { return '<span class="' + (v > 0.5 ? 'up' : v < -0.5 ? 'down' : '') + '">' + txt + '</span>'; }
  function bar(left, title, sub, right) {
    return '<header class="bar"><div class="wrap">' + (left || '<span class="spacer44"></span>') +
      '<div class="ttl">' + (sub ? '<small>' + esc(sub) + '</small>' : '') + esc(title) + '</div>' +
      (right || '') + '<button class="ib" data-act="theme" aria-label="สลับโหมดมืดและสว่าง">' + (themeNow() === 'dark' ? ICON.sun : ICON.moon) + '</button></div></header>';
  }
  function backBtn(act, label) { return '<button class="ib" data-act="' + act + '" aria-label="' + (label || 'ย้อนกลับ') + '">' + ICON.back + '</button>'; }
  function T() { return TOPICS[state.topic]; }

  /* ============================================================ START */
  function demoNumbers() {
    var inp = JSON.parse(JSON.stringify(MODELS.unit.sample)); inp.volumePer = 'day';
    var R = dEval(inp, 'unit', 'hire', SAMPLE_DEC.hire);
    if (!R.ok) return null;
    var c = dConds(R, inp, 'unit', 'hire', SAMPLE_DEC.hire).filter(function (x) { return x.id === 'need'; })[0];
    return c && c.value ? c.value : null;
  }
  function topicRows(exclude) {
    return '<div class="trows">' + TOPIC_ORDER.filter(function (t) { return t !== exclude; }).map(function (t) {
      var ok = !state.model || topicOk(t, state.model);
      return '<button class="trow" data-act="topic" data-t="' + t + '"' + (ok ? '' : ' aria-disabled="true"') + '><span class="ic">' + TICON[t] + '</span>' +
        '<span class="tt"><b>' + esc(TOPICS[t].tile) + '</b><small>' + esc(ok ? TOPICS[t].ex : 'ยังไม่มีสำหรับร้านแบบ' + MODELS[state.model].tile) + '</small></span>' + ICON.chev + '</button>';
    }).join('') + '</div>';
  }
  function viewStart() {
    var need = demoNumbers();
    var out = bar(null, 'เช็กก่อนตัดสินใจเรื่องใหญ่', 'Business Lab') + '<main class="screen"><div class="wrap">' +
      '<section class="panel start-hero"><h1>ก่อนจ่ายเงินก้อนใหญ่<br>รู้ก่อนว่าคุ้มไหม</h1>' +
      '<p>เทียบร้านคุณตอนนี้ กับถ้าตัดสินใจทำ ทั้งกำไร เงินสด และเวลาคืนทุน ลองบนตัวเลขก่อน ไม่เสียเงินสักบาท</p>' +
      (need ? '<div class="demo"><span class="k">ร้านกาแฟตัวอย่าง · ถ้าจ้างพนักงานเพิ่ม 1 คน เงินเดือน 12,000 บาท</span><span></span>' +
        '<span class="v">' + fmtN(need) + '<small> แก้ว/วัน</small></span><span></span>' +
        '<span class="note">ต้องขายเพิ่มอย่างน้อยเท่านี้ ถึงจะได้กำไรเท่าเดิม</span></div>' : '') +
      '<div class="cta"><button class="btn on-panel block" data-act="sample">ลองกับร้านตัวอย่าง' + ICON.next + '</button></div></section>';
    if (state.model) {
      var S = C(state.inp, state.model);
      out += '<div class="shopline"><span><b>' + (state.isSample ? 'ร้านกาแฟตัวอย่าง' : 'ร้านคุณ') + '</b> · ' + esc(MODELS[state.model].tile) +
        (S.ok ? ' · ' + (S.profit < 0 ? 'ขาดทุน ' : 'กำไร ') + fmtN(Math.abs(S.profit)) + ' บาท/เดือน' : '') + '</span>' +
        '<button class="lnk" data-act="shop-edit">' + (state.isSample ? 'ใส่ร้านคุณ' : 'แก้ตัวเลขร้าน') + '</button></div>';
    }
    out += '<div class="sec-h"><h2>คุณกำลังคิดเรื่องไหน</h2></div>' + topicRows(null) +
      '<p class="fine">ไม่ต้องสมัคร ตัวเลขอยู่ในเครื่องคุณเท่านั้น และหายไปเมื่อปิดหน้านี้ · ใส่ตัวเลขร้านครั้งเดียว ลองได้ทุกเรื่อง · คำนวณด้วยสูตรชุดเดียวกับแผนธุรกิจของ Jarua</p>';
    return out + '</div></main>';
  }

  /* ============================================================ SHOP (เลือกรูปแบบรายได้) */
  function viewShop() {
    var t = state.topic;
    var tiles = MODEL_ORDER.map(function (k) {
      var ok = !t || topicOk(t, k);
      return '<button class="tile" data-act="model" data-m="' + k + '"' + (ok ? '' : ' disabled aria-disabled="true"') + '><span class="ic">' + MICON[k] + '</span><span class="t">' + MODELS[k].tile + '</span><span class="ex">' + (ok ? MODELS[k].short : 'ยังไม่มีเรื่องนี้') + '</span></button>';
    }).join('');
    return bar(backBtn('to-start'), t ? TOPICS[t].title : 'ตัวเลขร้าน', 'ขั้นแรก') + '<main class="screen"><div class="wrap">' +
      '<div class="q-head"><h1>ก่อนอื่น ขอตัวเลขร้านคุณตอนนี้</h1><p>ใช้เทียบว่าถ้าตัดสินใจแล้ว ร้านจะเปลี่ยนไปเท่าไหร่ กรอกครั้งเดียว ใช้ได้กับทุกเรื่อง ประมาณ 3 นาที</p></div>' +
      '<p class="muted" style="margin:18px 2px 12px;font-size:15px;font-weight:600">ร้านคุณได้เงินจากอะไรเป็นหลัก</p>' +
      '<div class="tiles">' + tiles + '</div>' +
      '<div class="alt"><span>ยังไม่อยากกรอก?</span><button class="lnk" data-act="sample">ลองกับร้านกาแฟตัวอย่างก่อน</button></div></div></main>';
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
    var prog = '<div class="prog">' + steps.map(function (s, i) { return '<i class="' + (i <= state.step ? 'on' : '') + '"></i>'; }).join('') + '</div>';
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
    else if (isLastReq || isAdv) primary = '<button class="btn" data-act="shop-done"' + (allOk ? '' : ' disabled') + '>' + (state.topic ? 'ต่อไป: ' + esc(TOPICS[state.topic].title) : 'เสร็จ') + ICON.next + '</button>';
    else primary = '<button class="btn" data-act="next"' + (stepValid(st) ? '' : ' disabled') + '>ถัดไป' + ICON.next + '</button>';
    var foot = '<div class="foot" id="foot"><div class="wrap"><button class="btn ghost back" data-act="prev" aria-label="ย้อนกลับ">' + ICON.back + '</button>' + primary + '</div></div>';
    var more = isLastReq && !state.editing ? '<div class="skip"><button class="lnk" data-act="next">เพิ่มรายละเอียดให้แม่นขึ้น (ไม่ใส่ก็ได้)</button></div>' : '';
    return bar(backBtn('prev'), 'ตัวเลขร้าน · ' + MODELS[m].tile, 'ข้อ ' + (state.step + 1) + ' จาก ' + steps.length) +
      '<main class="screen"><div class="wrap">' + prog + wizReceipt() +
      '<div class="q-head"><h1>' + esc(st.q) + '</h1>' + (st.p ? '<p>' + esc(st.p) + '</p>' : '') + '</div>' + body + more + '</div></main>' + foot;
  }

  /* ============================================================ คำถามของเรื่องที่กำลังคิด */
  function dDef(k) { return DFIELDS[k]; }
  function dShown(k, d) { var f = dDef(k); return !f.show || f.show(state.inp, state.model, d || dec()); }
  function dMax(k) { var f = dDef(k); return f.max !== undefined ? f.max : (f.t === 'pct' ? 100 : null); }
  function dErr(k, d) {
    var f = dDef(k), v = num((d || dec())[k]);
    if (v === null) return '';
    var mx = dMax(k);
    if (mx !== null && v > mx) return 'ใส่ได้ไม่เกิน ' + fmtN(mx) + (f.t === 'pct' || f.t === 'pctchips' ? '%' : '');
    if (k === 'salesPct' && v < -90) return 'ใส่ได้ต่ำสุด −90%';
    if (k === 'life' && !(v > 0)) return 'ต้องมากกว่า 0';
    if (k === 'fixedChg' && v < -fixedTotal(state.inp)) return 'ลดได้ไม่เกินค่าใช้จ่ายคงที่ทั้งหมดของร้าน (' + fmtN(fixedTotal(state.inp)) + ' บาท)';
    if (k === 'movePct' && v > 100) return 'ใส่ได้ไม่เกิน 100%';
    return '';
  }
  function dStepValid(st, d) {
    d = d || dec();
    return st.f.every(function (k) {
      if (!dShown(k, d)) return true;
      if (dErr(k, d)) return false;
      var f = dDef(k);
      if (f.req) return num(d[k]) !== null;
      if (f.t === 'count') return num(d[k]) >= (f.min || 1);
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
      var rv = Math.round(n0(d[k]));
      return '<div class="field" data-df="' + k + '"' + hidden + '><span class="lab">' + lab + '</span><div class="seg wrapseg" role="group" aria-label="' + lab + '">' + f.opts.map(function (o) {
        return '<button type="button" data-act="dpick" data-k="' + k + '" data-v="' + o + '" aria-pressed="' + (rv === o || (o === f.opts[0] && rv < f.opts[0])) + '"' + (o ? ' aria-label="' + o + ' เดือน"' : '') + '>' + (o === 0 ? 'ทันที' : o) + '</button>';
      }).join('') + '</div>' + help + '</div>';
    }
    if (f.t === 'names') {
      var names = CH_NAMES[m] || [], cur = d.chName || '';
      return '<div class="field" data-df="' + k + '"' + hidden + '><span class="lab">' + lab + '</span><div class="chips">' + names.map(function (n) {
        return '<button type="button" class="chip" data-act="chname" data-v="' + esc(n) + '" aria-pressed="' + (cur === n) + '">' + esc(n) + '</button>';
      }).join('') + '<input id="' + id + '" data-chname-custom placeholder="อื่นๆ พิมพ์เอง" value="' + esc(names.indexOf(cur) < 0 ? cur : '') + '" maxlength="24" aria-label="ชื่อช่องทางอื่น"></div></div>';
    }
    var mode = (f.t === 'money' || f.t === 'int') ? 'numeric' : 'decimal';
    if (f.neg) mode = 'text';
    var v = d[k];
    var val = v === null || v === undefined || v === '' ? '' : (f.t === 'money' ? Math.round(v).toLocaleString('th-TH') : String(v));
    var suf = esc(f.suf ? f.suf(inp, m, d) : (f.t === 'pct' ? '%' : 'บาท'));
    var chips = '';
    if (f.t === 'pctchips') {
      chips = '<div class="chips pchips">' + f.chips.map(function (c) {
        return '<button type="button" class="chip" data-act="dpick" data-k="' + k + '" data-v="' + c + '" aria-pressed="' + (num(v) === c) + '">' + (c > 0 && f.neg ? '+' : '') + (c < 0 ? '−' + Math.abs(c) : c) + '%</button>';
      }).join('') + '</div>';
    }
    var input = '<input id="' + id + '" data-dk="' + k + '" data-t="' + f.t + '" inputmode="' + mode + '" autocomplete="off" enterkeyhint="next" placeholder="' + esc(dPh(k)) + '" value="' + esc(val) + '"' +
      (f.neg ? ' data-neg="1"' : '') + ' aria-describedby="err-' + k + '">';
    return '<div class="field" data-df="' + k + '"' + hidden + '><label for="' + id + '">' + lab + '</label>' + chips + '<div class="inbox">' + input + '<span class="suf">' + suf + '</span></div>' + help + errHtml + '</div>';
  }
  /* ผลสดด้านบนระหว่างตอบ */
  function dStrip() {
    var head = '<section class="panel receipt-strip" id="dstrip"><div class="rs-top"><span class="rs-k">';
    var S = C(state.inp, state.model);
    if (!S.ok) return head + 'ผลการตัดสินใจ</span></div><div class="rs-empty">ตัวเลขร้านยังไม่ครบ</div></section>';
    if (!dAllValidLoose()) return head + 'ร้านคุณตอนนี้ กำไรต่อเดือน</span><span class="rs-v">' + (S.profit < 0 ? '−' : '') + anim('ds', S.profit) + '<small>บาท</small></span></div><div class="rs-empty">ตอบต่อ แล้วจะเห็นว่าถ้า' + esc(TOPICS[state.topic].title) + ' กำไรจะเปลี่ยนไปเท่าไหร่</div></section>';
    var R = E(dec());
    if (!R.ok) return head + 'ผลการตัดสินใจ</span></div><div class="rs-empty">ตัวเลขยังไม่ครบ</div></section>';
    return head + 'ถ้า' + esc(dSummary(state.topic, dec(), state.inp, state.model)) + ' กำไรต่อเดือน' + '</span><span class="rs-v">' + (R.profit < 0 ? '−' : '') + anim('ds', R.profit) + '<small>บาท</small></span></div>' +
      '<div class="rs-lines"><div class="rs-line"><span>ตอนนี้ (ไม่ทำ)</span><i></i><b>' + (S.profit < 0 ? '−' : '') + fmtN(Math.abs(S.profit)) + '</b></div>' +
      '<div class="rs-line"><span>เปลี่ยนไป</span><i></i><b>' + dirSpan(R.delta, fmtN(Math.abs(R.delta))) + '</b></div></div></section>';
  }
  /* คำนวณได้เมื่อช่องที่ต้องกรอกครบ (ช่องที่ไม่บังคับถือเป็น 0) */
  function dAllValidLoose() { return dAllValid(); }
  function viewDq() {
    var t = state.topic, steps = dStepsFor(t, state.inp, state.model);
    if (state.dstep >= steps.length) state.dstep = steps.length - 1;
    var st = steps[state.dstep];
    var prog = '<div class="prog">' + steps.map(function (s, i) { return '<i class="' + (i <= state.dstep ? 'on' : '') + '"></i>'; }).join('') + '</div>';
    var last = state.dstep === steps.length - 1;
    var primary = state.dediting ? '<button class="btn" data-act="d-done"' + (dAllValid() ? '' : ' disabled') + '>ดูผล</button>'
      : last ? '<button class="btn" data-act="d-done"' + (dAllValid() ? '' : ' disabled') + '>ดูผล' + ICON.next + '</button>'
        : '<button class="btn" data-act="d-next"' + (dStepValid(st) ? '' : ' disabled') + '>ถัดไป' + ICON.next + '</button>';
    var foot = '<div class="foot" id="foot"><div class="wrap"><button class="btn ghost back" data-act="d-prev" aria-label="ย้อนกลับ">' + ICON.back + '</button>' + primary + '</div></div>';
    return bar(backBtn('d-prev'), TOPICS[t].title, 'ข้อ ' + (state.dstep + 1) + ' จาก ' + steps.length) +
      '<main class="screen"><div class="wrap">' + prog + dStrip() +
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
      if (f.t === 'names') return d.chName ? d.chName : '';
      if (f.t === 'ramp') return f.label(inp, m, d) + ' ' + (n0(d[k]) > 0 ? fmtN(n0(d[k])) + ' เดือน' : 'ทันที');
      var v = num(d[k]);
      if (v === null) return '';
      var suf = f.suf ? f.suf(inp, m, d) : (f.t === 'pct' ? '%' : 'บาท');
      return f.label(inp, m, d) + ' ' + (f.neg && v > 0 ? '+' : '') + fmtN(v, 2) + (suf.charAt(0) === '%' ? suf : ' ' + suf);
    }).filter(Boolean).join(' · ') || 'ยังไม่ได้ใส่';
  }
  function viewReview() {
    var steps = stepsFor(state.model);
    var out = bar(backBtn(state.topic && dAllValid() ? 'result' : 'to-start', 'กลับ'), 'แก้ตัวเลข', state.topic ? TOPICS[state.topic].title : '') + '<main class="screen"><div class="wrap">';
    if (state.isSample) out += '<div class="banner"><span>กำลังใช้ตัวเลขร้านกาแฟตัวอย่าง</span><button class="lnk" data-act="to-shop">ใส่ร้านคุณ</button></div>';
    if (state.topic) {
      out += '<div class="sec-h"><h2>' + esc(TOPICS[state.topic].title) + '</h2></div><div class="rv">' + dStepsFor(state.topic, state.inp, state.model).map(function (st, i) {
        return '<button class="rv-row" data-act="d-edit" data-i="' + i + '"><span class="t">' + esc(st.q) + '</span><span class="v">' + esc(dStepSummary(st)) + '</span>' + ICON.chev + '</button>';
      }).join('') + '</div>';
    }
    out += '<div class="sec-h"><h2>ตัวเลขร้าน</h2><span class="aside">' + esc(MODELS[state.model].tile) + '</span></div><div class="rv">' + steps.map(function (st, i) {
      return '<button class="rv-row" data-act="edit-step" data-i="' + i + '"><span class="t">' + esc(st.q) + '</span><span class="v">' + esc(stepSummary(st)) + '</span>' + ICON.chev + '</button>';
    }).join('') + '</div>';
    out += '<div class="alt"><span>ร้านได้เงินจากอย่างอื่น?</span><button class="lnk" data-act="to-shop">เปลี่ยนรูปแบบร้าน</button></div>';
    return out + '</div></main>';
  }

  /* ============================================================ RESULT */
  function needStat(R) {
    var c = (R.conds || []).filter(function (x) { return x.id === 'need'; })[0];
    if (state.topic === 'equip' || !c) {
      if (R.one > 0) return ['คืนทุน', R.payback === null ? '<span>ไม่คืนทุน</span>' : '<span>' + fmtMonths(R.payback) + '</span>', ''];
      return ['', '—', ''];
    }
    var k = { hire: { unit: 'ต้องขายเพิ่ม', resell: 'ต้องขายเพิ่ม', service: 'ต้องมีลูกค้าเพิ่ม', subscription: 'ต้องมีสมาชิกเพิ่ม', project: 'ต้องได้งานเพิ่ม',
      rental: 'คนเช่าต้องเพิ่ม', commission: 'ต้องปิดดีลเพิ่ม', other: 'รายได้ต้องเพิ่ม' }[state.model], place: 'ที่ใหม่ต้องได้', channel: 'ช่องทางต้องได้', branch: 'สาขาต้องได้' }[state.topic];
    if (c.value === null) return [k, '—', '<small>ไม่คุ้ม</small>'];
    return [k, fmtN(c.value), '<small>' + esc(c.unit) + '</small>'];
  }
  function statsHtml(R, prefix, B) {
    var s1 = needStat(R), s2, s3;
    if (R.one > 0 && state.topic !== 'equip') s2 = ['คืนทุน', '<span>' + (R.payback === null ? 'ไม่คืนทุน' : fmtMonths(R.payback)) + '</span>', ''];
    else s2 = [R.sumDiff < -0.5 ? 'กำไรลดใน 1 ปี' : 'กำไรเพิ่มใน 1 ปี', '<span>' + compactTH(Math.abs(R.sumDiff)) + '</span>', ''];
    if (R.need > 0.5) s3 = [R.B.hasCash ? 'เงินขาดมือ' : 'ต้องมีเงิน', '<span>' + compactTH(R.need) + '</span>', ''];
    else s3 = ['เงินต่ำสุด', '<span>' + compactTH(R.low) + '</span>', ''];
    var dd = ['', '', ''];
    if (B) {
      var d1 = (R.conds || []).filter(function (x) { return x.id === 'need'; })[0], b1 = (B.conds || []).filter(function (x) { return x.id === 'need'; })[0];
      if (d1 && b1 && d1.value !== null && b1.value !== null && Math.abs(d1.value - b1.value) > 0.05 && state.topic !== 'equip') dd[0] = '<div class="d ' + (d1.value > b1.value ? 'up' : 'down') + '">' + fmtN(Math.abs(d1.value - b1.value), 1) + '</div>';
      if (R.payback !== null && B.payback !== null && Math.abs(R.payback - B.payback) > 0.05 && R.one > 0) {
        var di = state.topic === 'equip' ? 0 : 1;
        dd[di] = '<div class="d ' + (R.payback > B.payback ? 'up' : 'down') + '">' + fmtN(Math.abs(R.payback - B.payback), 1) + ' เดือน</div>';
      }
      var lowA = R.need > 0.5 ? R.need : R.low, lowB = B.need > 0.5 ? B.need : B.low;
      if ((R.need > 0.5) === (B.need > 0.5) && Math.abs(lowA - lowB) > 0.5) dd[2] = '<div class="d ' + (lowA > lowB ? 'up' : 'down') + '">' + compactTH(Math.abs(lowA - lowB)) + '</div>';
    }
    return '<div class="stats">' + [s1, s2, s3].map(function (s, i) {
      return '<div class="stat"><div class="k">' + s[0] + '</div><div class="v">' + s[1] + s[2] + '</div>' + dd[i] + '</div>';
    }).join('') + '</div>';
  }
  function condHtml(c) {
    var val = c.value === null ? '<span class="cv txt">' + esc(c.txt) + '</span>'
      : '<span class="cv">' + (c.payback ? esc(fmtMonths(c.value)) : (c.id === 'unit' && c.value < 0 ? '−' : '') + fmtN(Math.abs(c.value), c.unit === '%' || c.id === 'unit' ? 1 : (c.value < 10 ? 1 : 0)) + (c.unit && !c.payback ? '<small>' + esc(c.unit) + '</small>' : '')) + '</span>';
    if (c.payback && c.value === null) val = '<span class="cv txt">ไม่คืนทุน</span>';
    var have = '';
    if (c.have !== null && c.have !== undefined && c.value !== null && c.dir !== 'info') {
      var diff = c.have - c.value, u = c.unit && c.unit.charAt(0) === '%' ? '%' : '';
      var who = c.id === 'rent' ? 'ค่าเช่าที่ใหม่ ' : c.id === 'price' ? 'ราคาที่ตั้งไว้ ' : c.id === 'move' ? 'ที่คุณใส่ ' : 'คุณคาดไว้ ';
      have = '<span class="chave"><span class="pill2 ' + c.status + '">' + (c.status === 'ok' ? 'ถึงเงื่อนไข' : 'ยังไม่ถึง') + '</span>' +
        '<span>' + who + fmtN(c.have, c.have < 10 ? 1 : 0) + u + ' · ' + dirSpan(diff, (diff > 0 ? 'มากกว่า ' : 'น้อยกว่า ') + fmtN(Math.abs(diff), Math.abs(diff) < 10 ? 1 : 0) + u) + '</span></span>';
    } else if (c.status && c.dir === 'info' && !c.cash && c.id !== 'pay' && c.id !== 'unit') {
      have = '<span class="chave"><span class="pill2 ' + c.status + '">' + (c.status === 'ok' ? 'พอ' : 'ไม่พอ') + '</span></span>';
    } else if (c.id === 'pay' && c.status) {
      have = '<span class="chave"><span class="pill2 ' + c.status + '">' + (c.status === 'ok' ? 'เร็วกว่าอายุเครื่อง' : c.value === null ? 'ยังไม่คืนทุน' : 'ช้ากว่าอายุเครื่อง') + '</span></span>';
    }
    var inner = '<span class="cl">' + esc(c.label) + '</span>' + val + (c.sub ? '<span class="cs">' + esc(c.sub) + '</span>' : '') + have;
    if (c.lever && labKeys().indexOf(c.lever) >= 0) {
      var tv = c.value !== null && !c.payback && c.dir !== 'info' && c.id !== 'unit' ? ' data-v="' + c.value + '"' : '';
      return '<button class="cond" data-act="try" data-k="' + c.lever + '"' + tv + '>' + inner + '<span class="go">ลองดู' + ICON.chev + '</span></button>';
    }
    return '<div class="cond static">' + inner + '</div>';
  }
  function ledgerHtml(R) {
    if (!R.ledger.length) return '';
    var lines = R.ledger.map(function (l) {
      return '<div class="rc-line"><span>' + esc(l.label) + '</span><i></i><b>' + (l.amount < -0.5 ? '−' : '+') + fmtN(Math.abs(l.amount)) + '</b></div>';
    }).join('');
    return '<section class="receipt" aria-label="กำไรต่อเดือนเปลี่ยนเพราะอะไร"><div class="rc-head"><div class="rt">กำไรต่อเดือนเปลี่ยนเพราะอะไร</div><div class="rs">ต่อเดือน' + (R.k > 0 ? ' · เมื่อยอดขึ้นถึงที่คาด' : '') + '</div></div>' +
      '<div class="rc-lines">' + lines + '</div>' +
      '<div class="rc-total"><span>กำไรต่อเดือน' + (R.delta < -0.5 ? 'ลดลง' : 'เพิ่มขึ้น') + '</span><b>' + (R.delta < -0.5 ? '−' : '+') + fmtN(Math.abs(R.delta)) + '</b></div>' +
      '<div class="rc-foot">ตอนนี้ ' + signedPlain(R.B.profit) + ' → ถ้าทำ ' + signedPlain(R.profit) + ' บาท/เดือน</div></section>';
  }
  function signedPlain(v) { return (v < -0.5 ? '−' : '') + fmtN(Math.abs(v)); }
  function scenHtml(R) {
    var S = SC(dec());
    if (!S.length) return '';
    var lead = { hire: 'ถ้า' + salesWord(state.model) + 'ที่เพิ่ม ได้ไม่ถึงที่คาด', place: 'ถ้า' + salesWord(state.model) + 'ที่ใหม่ ต่ำกว่าที่คาด', channel: 'ถ้าขายผ่านช่องทางนี้ได้น้อยกว่าที่คาด',
      equip: 'ถ้าเครื่องช่วยได้น้อยกว่าที่คาด', branch: 'ถ้าสาขาขายได้น้อยกว่าที่คาด' }[state.topic];
    var rows = '<div class="sc-row now"><div class="sc-l">ตอนนี้ ไม่ทำ</div><div class="sc-v">' + signedPlain(R.B.profit) + '</div></div>' + S.map(function (s) {
      var bits = [];
      if (s.one > 0) bits.push(s.payback === null ? 'ไม่คืนทุน' : 'คืนทุน ' + fmtMonths(s.payback));
      bits.push(s.low < -0.5 ? (R.B.hasCash ? 'เงินขาดมือ ' : 'ต้องมีเงิน ') + compactTH(-s.low) : 'เงินต่ำสุด ' + compactTH(s.low));
      return '<div class="sc-row' + (s.f === 1 ? ' main' : '') + '"><div class="sc-l">' + esc(s.label) + '<small>' + esc(bits.join(' · ')) + '</small></div>' +
        '<div class="sc-v">' + signedPlain(s.profit) + '<small>' + dirSpan(s.delta, fmtN(Math.abs(s.delta))) + '</small></div></div>';
    }).join('');
    return '<section class="card"><h3>ถ้าไม่เป็นอย่างที่คาด</h3><p class="lead">' + esc(lead) + ' · กำไรต่อเดือน เทียบกับตอนนี้</p><div class="scen">' + rows + '</div></section>';
  }
  function cashCard(R) {
    var hc = R.B.hasCash, end = R.rows[11].bal, bEnd = R.rows[11].bBal;
    var lead;
    if (R.need > 0.5) lead = hc ? 'เงินในมือจะติดลบ ต่ำสุด <b>−' + fmtN(R.need) + '</b> บาท ' + (R.lowT ? 'เดือน ' + monthLabel(R.lowT, true) : 'ตอนจ่ายเงินก้อน')
      : 'ช่วงแรกต้องใช้เงิน <b>' + fmtN(R.need) + '</b> บาท ก่อนเงินเริ่มกลับมา';
    else lead = 'สิ้น ' + monthLabel(12, true) + (hc ? ' มีเงินสด <b>' + fmtN(end) + '</b> บาท' : ' เงินเพิ่มขึ้น <b>' + fmtN(end) + '</b> บาท') + ' · ไม่ทำ ' + fmtN(bEnd);
    return '<section class="card"><h3>เงินสด 12 เดือนข้างหน้า</h3><p class="lead">' + lead + '</p><div class="chart" data-chart="cash">' + cashSvg(R) + '</div>' +
      '<div class="legend"><span><i></i>ถ้าทำ</span><span><i class="g"></i>ไม่ทำ</span></div></section>';
  }
  function cashSvg(R) {
    var W = 340, H = 196, L = 46, Rr = 12, Tp = 18, Bt = 26;
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
    var out = g + '<path class="line ghost" d="' + path(b) + '"/><path class="line" d="' + path(a) + '"/>';
    var lowI = R.lowT;
    out += '<circle class="dot" cx="' + x(lowI).toFixed(1) + '" cy="' + y(a[lowI]).toFixed(1) + '" r="5"/>';
    var ey = y(a[12]);
    out += '<circle class="dot" cx="' + x(12).toFixed(1) + '" cy="' + ey.toFixed(1) + '" r="4"/><text class="endlab" x="' + (x(12) - 4).toFixed(1) + '" y="' + (ey < Tp + 14 ? ey + 20 : ey - 11).toFixed(1) + '" text-anchor="end">' + compactTH(a[12]) + '</text>';
    for (var i = 0; i <= 12; i++) {
      var x0 = i === 0 ? L : (x(i) + x(i - 1)) / 2, x1 = i === 12 ? W - Rr : (x(i) + x(i + 1)) / 2;
      out += '<rect class="hit" data-i="' + i + '" x="' + x0.toFixed(1) + '" y="' + Tp + '" width="' + (x1 - x0).toFixed(1) + '" height="' + (H - Tp - Bt) + '"/>';
    }
    out += '<line class="cross" x1="0" x2="0" y1="' + Tp + '" y2="' + (H - Bt) + '" visibility="hidden"/>';
    var aria = 'กราฟเงินสด 12 เดือน ถ้าทำ สิ้นปี ' + fmtN(a[12]) + ' บาท ต่ำสุด ' + fmtN(a[lowI]) + ' บาท · ไม่ทำ สิ้นปี ' + fmtN(b[12]) + ' บาท';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(aria) + '">' + out + '</svg>';
  }
  function paybackCard(R) {
    if (!(R.one > 0)) return '';
    var cum = R.rows[11].cumExtra, got = Math.max(0, cum), pct = Math.max(0, Math.min(100, got / R.one * 100));
    var what = { place: 'ค่าย้าย', equip: 'ค่าเครื่อง', branch: 'เงินลงทุนสาขา' }[state.topic] || 'เงินก้อน';
    var lead = R.payback === null ? 'ตัวเลขแบบนี้ เงินที่ได้เพิ่มแต่ละเดือนยังไม่พอคืน' + what
      : 'คืนทุนราว <b>' + monthLabel(Math.min(120, Math.ceil(R.payback - 1e-9)), true) + '</b> (' + fmtMonths(R.payback) + ')';
    return '<section class="card"><h3>' + esc(what) + ' ' + fmtN(R.one) + ' บาท ได้คืนเมื่อไหร่</h3><p class="lead">' + lead + '</p>' +
      '<div class="meter" role="img" aria-label="ใน 12 เดือนได้คืน ' + fmtN(pct, 0) + '%"><i style="width:' + pct.toFixed(1) + '%"></i></div>' +
      '<p class="mnote">' + (cum < -0.5 ? 'ใน 12 เดือนแรก เงินที่ได้จากเรื่องนี้ยังติดลบ ' + fmtN(-cum) + ' บาท เพราะยอดยังขึ้นไม่ถึงที่คาด'
        : 'ใน 12 เดือนได้คืนแล้ว ' + fmtN(got) + ' บาท (' + fmtN(pct, 0) + '%)') + ' · เมื่อเข้าที่ได้เพิ่มเดือนละ ' + signedPlain(R.extraSteady) + ' บาท</p></section>';
  }
  /* ---------- เช็กความพร้อม → จุดที่ควรเช็ก → เครื่องมือ PL1 ---------- */
  function ans() { if (!state.answers[state.topic]) state.answers[state.topic] = {}; return state.answers[state.topic]; }
  function askList() {
    var d = dec();
    return (QSET3[state.topic] || []).filter(function (id) { var q = QB3[id]; return q && (!q.when || q.when(state.inp, state.model, d)); }).slice(0, 5);
  }
  function askDone() { var L = askList(), A = ans(); return L.length > 0 && L.every(function (q) { return A[q]; }); }
  function askedCount() { var A = ans(); return askList().filter(function (q) { return A[q]; }).length; }
  function pointsList() { var A = ans(); return askList().filter(function (q) { return A[q] === 'yes' || A[q] === 'unsure'; }); }
  function nextStepCard() {
    var L = askList();
    if (askDone()) {
      var n = pointsList().length;
      return '<section class="next"><div class="nx-k">ขั้นต่อไป</div><h3>' + (n ? 'เจอ ' + n + ' จุดที่ควรเช็กก่อนตัดสินใจ' : 'ยังไม่เจอจุดที่ควรเช็กจากคำตอบ') + '</h3><p>ดูว่าแต่ละจุดเกี่ยวกับตัวเลขไหน และเครื่องมือไหนช่วยหาแนวทางได้</p>' +
        '<button class="btn block" data-act="points">ดูจุดที่ควรเช็กและเครื่องมือ' + ICON.next + '</button><div class="nx-sub"><button class="lnk" data-act="ask-restart">ตอบใหม่</button></div></section>';
    }
    return '<section class="next"><div class="nx-k">ขั้นต่อไป</div><h3>เช็กความพร้อมก่อนตัดสินใจ</h3><p>ตอบ ' + L.length + ' ข้อ แค่ ใช่ / ไม่ใช่ / ไม่แน่ใจ แล้วดูจุดที่ควรเช็ก และเครื่องมือที่ช่วยได้</p>' +
      '<button class="btn block" data-act="ask">' + (askedCount() ? 'ตอบต่อ' : 'เริ่มตอบ') + ICON.next + '</button></section>';
  }
  function planCard() {
    return '<section class="panel plan"><span class="tag">เร็วๆ นี้</span><h3>อยากเห็นเรื่องนี้ในแผนทั้งร้าน</h3><p>แผนธุรกิจของ Jarua ใช้ตัวเลขชุดนี้ต่อได้ทันที แล้ววางทางทั้งร้าน ทั้งการตลาด ทีม และเงิน 12 เดือน</p>' +
      '<button class="btn on-panel block" data-act="plan">ดูแผนธุรกิจ</button></section>';
  }
  function viewResult() {
    var head = bar('<button class="tb" data-act="review">' + ICON.back + 'แก้ตัวเลข</button>', TOPICS[state.topic].title, 'Business Lab');
    var R = E(dec());
    if (!R.ok) return head + '<main class="screen"><div class="wrap"><div class="ok-box"><b>ตัวเลขยังไม่ครบ</b><p>กด "แก้ตัวเลข" เพื่อกรอกให้ครบ</p></div></div></main>';
    var d = dec(), out = head + '<main class="screen"><div class="wrap">';
    if (state.isSample) out += '<div class="banner"><span>นี่คือร้านกาแฟตัวอย่าง</span><button class="lnk" data-act="to-shop">ใส่ตัวเลขร้านคุณ</button></div>';
    var dl = R.delta;
    out += '<section class="panel dpanel"><div class="eyebrow"><span>ถ้า' + esc(dSummary(state.topic, d, state.inp, state.model)) + '</span>' + (state.isSample ? '<span class="tag">ตัวอย่าง</span>' : '') + '</div>' +
      '<div class="k2">' + (R.profit < 0 ? 'ขาดทุนต่อเดือน' : 'กำไรต่อเดือน') + (R.k > 0 ? ' เมื่อยอดขึ้นถึงที่คาด' : '') + '</div>' +
      '<div class="bignum">' + (R.profit < 0 ? '−' : '') + anim('rp' + state.topic + state.model, R.profit) + '<span class="u">บาท</span></div>' +
      '<div class="sub">' + (Math.abs(dl) < 0.5 ? 'เท่ากับตอนนี้' : dirSpan(dl, '<b class="delta">' + fmtN(Math.abs(dl)) + '</b>') + ' จากตอนนี้ ' + signedPlain(R.B.profit) + ' บาท') + '</div>' +
      statsHtml(R, 'r') + '<div class="cta"><button class="btn on-panel block" data-act="lab">' + ICON.sliders + 'ลองเปลี่ยนตัวเลข</button></div></section>';
    if (R.warn.length) out += '<div class="warns" role="note">' + R.warn.map(function (w) { return '<p>' + ICON.info + '<span>' + esc(w) + '</span></p>'; }).join('') + '</div>';
    out += '<div class="sec-h"><h2>เงื่อนไขที่ทำให้คุ้ม</h2><span class="aside">เทียบกับตอนนี้</span></div><div class="conds">' + R.conds.map(condHtml).join('') + '</div>';
    out += '<div class="cards" style="margin-top:12px">' + scenHtml(R) + '</div>';
    out += '<div style="margin-top:12px">' + nextStepCard() + '</div>';
    out += '<div class="sec-h"><h2>ภาพเงินของเรื่องนี้</h2></div><div class="cards">' + cashCard(R) + paybackCard(R) + '</div>' + ledgerHtml(R);
    out += '<div class="sec-h"><h2>ลองเรื่องอื่น กับตัวเลขร้านเดิม</h2></div>' + topicRows(state.topic);
    out += planCard();
    out += '<details class="about"><summary>ตัวเลขชุดนี้คิดอย่างไร' + ICON.down + '</summary><ul>' +
      '<li>ทุกตัวเลขต่อเดือนคำนวณด้วยสูตรชุดเดียวกับแผนธุรกิจของ Jarua และเทียบกับร้านคุณตอนนี้ที่ใช้สูตรเดียวกัน</li>' +
      '<li>ทุกตัวเลขมาจากที่คุณกรอก ไม่ได้เทียบกับร้านอื่น และไม่ได้ตัดสินใจแทนคุณ</li><li>กำไรเป็นกำไรก่อนหักภาษี</li>' +
      (R.one > 0 ? '<li>เงินก้อน ' + fmtN(R.one) + ' บาท จ่ายด้วยเงินสดตอนเริ่ม · คืนทุนนับจากเงินที่ได้เพิ่มจริงในแต่ละเดือน เทียบกับไม่ทำ</li>' : '') +
      (R.k > 0 ? '<li>' + salesWord(state.model) + 'ที่คาด ค่อยๆ ขึ้นเท่ากันทุกเดือน จนถึงที่คาดในเดือนที่ ' + R.k + '</li>' : '') +
      (state.topic === 'equip' ? '<li>กำไรหักเงินที่ควรกันไว้ซื้อเครื่องใหม่เมื่อหมดอายุ (ราคา ÷ เดือนที่ใช้ได้) แต่เงินสดไม่หัก เพราะจ่ายไปแล้วตอนซื้อ</li>' : '') +
      '<li>' + (n0(state.inp.growth) ? 'ยอดขายของร้านเปลี่ยนเดือนละ ' + fmtPct(n0(state.inp.growth)) + ' ตามที่กรอก' : 'ยอดขายของร้านเท่าเดิมทุกเดือน') + ' · ค่าใช้จ่ายคงที่เท่าเดิมตลอด 12 เดือน</li></ul></details>';
    return out + '</div></main>';
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
      (askedCount() ? '<button class="lnk" data-act="points">ดูผลเลย</button>' : '') + '</div></div></main>';
  }
  function pointTag(id, R) {
    var lv = QB3[id].lever;
    if (!lv || !R.ok) return '';
    var c = R.conds.filter(function (x) { return x.lever === lv && x.value !== null; })[0];
    if (!c) return '';
    var v = c.payback ? fmtMonths(c.value) : fmtN(c.value, c.value < 10 ? 1 : 0) + (c.unit ? ' ' + c.unit : '');
    return esc(c.label) + ' <b>' + esc(v) + '</b>';
  }
  function toolsHtml(codes, title, seen) {
    seen = seen || {};
    var items = codes.filter(function (c) { if (seen[c] || !TOOLS[c]) return false; seen[c] = 1; return true; }).map(function (c) {
      return '<button class="tool" data-act="tool" data-t="' + c + '"><span class="tn">' + esc(TOOLS[c][0]) + '</span><span class="ts">' + esc(TOOLS[c][1]) + '</span>' + ICON.out + '</button>';
    }).join('');
    return items ? '<div class="tools">' + (title ? '<span class="tl">' + esc(title) + '</span>' : '') + items + '</div>' : '';
  }
  function viewPoints() {
    var R = E(dec()), L = askList(), Pn = pointsList(), seen = {}, A = ans();
    var out = bar(backBtn('result', 'กลับ'), 'จุดที่ควรเช็ก', TOPICS[state.topic].title) + '<main class="screen"><div class="wrap">';
    out += '<section class="panel"><div class="eyebrow">จากคำตอบ ' + askedCount() + ' ข้อ</div><div class="pp-t">' + (Pn.length ? 'เจอ ' + Pn.length + ' จุดที่ควรเช็กก่อนตัดสินใจ' : 'ยังไม่เจอจุดที่ควรเช็กจากคำตอบ') + '</div>' +
      '<div class="sub">' + (Pn.length ? 'แต่ละจุดบอกว่าเกี่ยวกับตัวเลขไหน และเครื่องมือไหนช่วยหาแนวทางได้ เปิดแล้วใช้ตัวเลขร้านคุณต่อได้ทันที' : 'ถ้าอยากคิดเรื่องนี้ให้ละเอียดขึ้น เครื่องมือด้านล่างช่วยได้') + '</div>' +
      (L.length ? '<div class="cta"><button class="pbtn" data-act="ask-restart">แก้คำตอบ</button></div>' : '') + '</section>';
    if (Pn.length) {
      out += '<div class="points" style="margin-top:14px">' + Pn.map(function (id) {
        var q = QB3[id], tag = pointTag(id, R), lk = q.lever && labKeys().indexOf(q.lever) >= 0 ? q.lever : null;
        var fresh = q.tools.filter(function (c) { return !seen[c]; });
        return '<div class="point"><div class="pt">' + esc(q.p) + (A[id] === 'unsure' ? '<span class="unsure">ไม่แน่ใจ</span>' : '') + '</div><div class="pd">' + esc(q.d) + '</div>' +
          (tag ? '<div class="ptag">' + tag + '</div>' : '') +
          (fresh.length ? toolsHtml(fresh, 'เครื่องมือที่ช่วยหาแนวทางแก้ไข', seen) : '<div class="tools"><span class="tl">ใช้เครื่องมือเดียวกับด้านบน</span></div>') +
          (lk ? '<button class="sbtn light" data-act="try" data-k="' + lk + '">' + ICON.sliders + 'ลองเปลี่ยนตัวเลขนี้</button>' : '') + '</div>';
      }).join('') + '</div>';
    } else {
      out += '<div class="block">' + toolsHtml(TOPIC_TOOLS[state.topic], 'เครื่องมือที่ช่วยคิดเรื่องนี้', seen) + '</div>';
    }
    out += planCard();
    return out + '</div></main>';
  }

  /* ============================================================ LAB (ลองเปลี่ยนตัวเลขของเรื่องนี้) */
  var LAB_KEYS = {
    hire: ['salary', 'count', 'gain', 'capAdd'],
    place: ['newRent', 'salesPct', 'moveCost', 'closedDays', 'dipPct'],
    channel: ['cut', 'chQty', 'chPrice', 'movePct', 'extraCost', 'chFee'],
    equip: ['price', 'life', 'eqGain', 'costDown', 'fixedChg', 'eqCap'],
    branch: ['bPct', 'setup', 'bRent', 'bStaff', 'bSalary', 'bOther']
  };
  function labKeys() {
    var d = trialD();
    return (LAB_KEYS[state.topic] || []).filter(function (k) { return dShown(k, d) || k === 'bSalary' && n0(d.bStaff) > 0; });
  }
  function curVal(k, d) {
    var v = num(d[k]);
    if (v !== null) return v;
    if (k === 'chPrice') return n0(state.inp[ROLE[state.model].price]);
    return 0;
  }
  function lStep(k, v) {
    var f = dDef(k), a = Math.abs(v);
    if (f.t === 'count' || k === 'bStaff' || k === 'closedDays' || k === 'life') return 1;
    if (f.t === 'pct' || f.t === 'pctchips') return k === 'cut' ? 1 : (k === 'salesPct' || k === 'bPct' ? 5 : 1);
    if (k === 'gain' || k === 'eqGain' || k === 'chQty' || k === 'capAdd' || k === 'eqCap') {
      if (state.model === 'rental') return 1;
      if (isVolModel(state.model) && state.inp.volumePer !== 'month') return a >= 50 ? niceStep(a * 0.05) : 1;
      return Math.max(state.model === 'commission' || state.model === 'project' ? 0.5 : 1, niceStep(a * 0.05));
    }
    if (k === 'chPrice' || k === 'extraCost' || k === 'costDown') return a < 20 ? 0.5 : a < 100 ? 1 : niceStep(a * 0.01);
    if (k === 'fixedChg' || k === 'chFee') return 100;
    if (k === 'salary' || k === 'bSalary' || k === 'newRent' || k === 'bRent' || k === 'bOther') return a >= 10000 ? 500 : 100;
    return Math.max(1000, niceStep(a * 0.02));
  }
  function lRange(k, v0, st) {
    var f = dDef(k), lo = 0, hi;
    if (k === 'salesPct') { lo = -80; hi = Math.max(100, v0 + 50); }
    else if (k === 'bPct') hi = Math.max(150, v0 + 50);
    else if (k === 'cut') hi = Math.max(50, v0 + 20);
    else if (k === 'movePct' || k === 'dipPct') hi = 100;
    else if (k === 'count') { lo = 1; hi = Math.max(5, v0 * 2); }
    else if (k === 'bStaff') hi = Math.max(6, v0 * 2);
    else if (k === 'closedDays') hi = Math.max(30, v0 * 2);
    else if (k === 'life') { lo = 1; hi = Math.max(15, v0 * 2); }
    else if (k === 'fixedChg') { lo = -Math.floor(fixedTotal(state.inp) / st) * st; hi = Math.max(5000, Math.abs(v0) * 3); }
    else if (k === 'chPrice') { lo = Math.floor(v0 * 0.5 / st) * st; hi = Math.ceil(v0 * 2 / st) * st; }
    else if (k === 'gain' || k === 'eqGain' || k === 'chQty') hi = Math.max(v0 * 3, phGain(state.inp, state.model) * 4, st * 10);
    else hi = Math.max(v0 * 2.5, st * 20);
    if (f.max !== undefined) hi = Math.min(hi, f.max);
    hi = Math.ceil(hi / st) * st;
    return [lo, Math.max(hi, lo + st)];
  }
  function lUnit(k) { var f = dDef(k), d = trialD(); return f.suf ? f.suf(state.inp, state.model, d) : (f.t === 'pct' ? '%' : 'บาท'); }
  function lName(k) { return dDef(k).label(state.inp, state.model, trialD()); }
  function lInsight(k) {
    var d = trialD(), R = E(d);
    if (!R.ok) return '';
    var c = R.conds.filter(function (x) { return x.lever === k; })[0];
    var gk = { gain: 1, eqGain: 1, chQty: 1 };
    if (gk[k]) {
      var st = lStep(k, curVal(k, d));
      var R2 = E(Object.assign({}, d, (function () { var o = {}; o[k] = curVal(k, d) + st; return o; })()));
      var e = R2.ok ? R2.profit - R.profit : null;
      var t1 = e !== null ? 'เพิ่มทีละ ' + fmtN(st) + ' ' + esc(lUnit(k)) + ' = กำไร <b>' + signed(e) + '</b> บาท/เดือน' : '';
      if (c && c.value !== null) t1 += ' · ' + esc(c.label) + ' ' + fmtN(c.value, c.value < 10 ? 1 : 0) + ' ' + esc(c.unit);
      return t1;
    }
    if (k === 'salary' || k === 'count') {
      var cn = R.conds.filter(function (x) { return x.id === 'need'; })[0];
      return cn && cn.value !== null ? esc(cn.label) + ' <b>' + fmtN(cn.value, cn.value < 10 ? 1 : 0) + '</b> ' + esc(cn.unit) + ' ถึงจะคุ้ม' : '';
    }
    if (c) {
      if (c.value === null) return esc(c.label) + ' · ' + esc(c.txt || 'ไม่คืนทุน');
      return esc(c.label) + ' <b>' + (c.payback ? fmtMonths(c.value) : fmtN(c.value, c.value < 10 ? 1 : 0) + '</b> ' + esc(c.unit || '')) + (c.payback ? '</b>' : '');
    }
    if (R.one > 0 && (k === 'price' || k === 'setup' || k === 'moveCost')) return 'คืนทุน <b>' + (R.payback === null ? 'ไม่คืนทุน' : fmtMonths(R.payback)) + '</b>';
    return '';
  }
  function labPanel() {
    var B = E(dec()), Tt = hasTrial() ? E(trialD()) : B;
    if (!B.ok || !Tt.ok) return '<section class="panel lab-panel"><div class="k">ตัวเลขยังไม่ครบ</div></section>';
    var d = Tt.profit - B.profit;
    return '<section class="panel lab-panel" aria-live="polite"><div class="row1"><span class="k">' + (Tt.profit < 0 ? 'ขาดทุนต่อเดือน' : 'กำไรต่อเดือน') + ' ถ้า' + esc(TOPICS[state.topic].title) + '</span>' +
      (hasTrial() ? '<span class="delta ' + (d > 0.5 ? 'up' : d < -0.5 ? 'down' : '') + '">' + fmtN(Math.abs(d)) + '</span>' : '') + '</div>' +
      '<div class="bignum">' + (Tt.profit < 0 ? '−' : '') + anim('lp', Tt.profit) + '<span class="u">บาท</span></div>' +
      '<div class="was">ตอนนี้ (ไม่ทำ) ' + signedPlain(Tt.B.profit) + ' บาท' + (hasTrial() ? ' · ตัวเลขที่ใส่ไว้ ' + signedPlain(B.profit) + ' บาท' : '') + '</div>' +
      statsHtml(Tt, 'l', hasTrial() ? B : null) + '</section>';
  }
  function fmtInputNum(v) {
    if (v === null || v === undefined) return '';
    var r = Math.round(v * 100) / 100;
    return Math.abs(r) >= 1000 ? Math.round(r).toLocaleString('th-TH') : String(r);
  }
  function wasTxt(k) {
    var bv = curVal(k, dec()), tv = curVal(k, trialD());
    if (Math.abs(bv - tv) < 1e-9) return '';
    var pct = lUnit(k).charAt(0) === '%';
    return 'ที่ใส่ไว้ ' + fmtN(bv, 2) + (pct ? '%' : '') + ' · <span class="' + (tv > bv ? 'up' : 'down') + '">' + fmtN(Math.abs(tv - bv), 2) + (pct ? '%' : '') + '</span>';
  }
  function lrowHtml(k) {
    var bv = curVal(k, dec()), tv = curVal(k, trialD()), st = lStep(k, bv), rng = lRange(k, bv, st);
    var lo = Math.min(rng[0], tv), hi = Math.max(rng[1], tv);
    var op = hi > lo ? (bv - lo) / (hi - lo) : 0;
    var chg = state.trial.hasOwnProperty(k);
    var ins = state.active === k ? lInsight(k) : '';
    var val = fmtInputNum(tv), name = lName(k);
    return '<div class="lrow' + (chg ? ' changed' : '') + '" data-row="' + k + '"><div class="lr-top"><span class="lr-name">' + esc(name) + '</span>' +
      '<span class="lr-val"><input data-lv="' + k + '" inputmode="decimal" size="' + Math.max(2, val.length) + '" value="' + esc(val) + '" aria-label="' + esc(name) + '"><span class="u">' + esc(lUnit(k)) + '</span></span></div>' +
      '<div class="lr-was">' + wasTxt(k) + '</div><div class="lr-ctl"><button class="stp" data-act="step" data-k="' + k + '" data-dir="-1" aria-label="ลด">−</button>' +
      '<div class="sl"><span class="orig" style="left:calc(14px + (100% - 28px) * ' + op.toFixed(4) + ')"></span><input type="range" data-range="' + k + '" min="' + lo + '" max="' + hi + '" step="' + st + '" value="' + tv + '" aria-label="ปรับ ' + esc(name) + '"></div>' +
      '<button class="stp" data-act="step" data-k="' + k + '" data-dir="1" aria-label="เพิ่ม">+</button></div>' +
      (ins ? '<div class="lr-ins">' + ins + '</div>' : '') + '</div>';
  }
  function viewLab() {
    var right = hasTrial() ? '<button class="tb" data-act="reset">ล้าง</button>' : '';
    return bar('<button class="tb" data-act="result">' + ICON.back + 'เสร็จ</button>', 'ลองเปลี่ยนตัวเลข', TOPICS[state.topic].title, right) +
      '<main class="screen"><div class="lab-top"><div class="wrap" id="labp">' + labPanel() + '</div></div><div class="wrap">' +
      '<div class="lgroup"><h2>' + esc(TOPICS[state.topic].title) + '</h2><div class="lrows">' + labKeys().map(lrowHtml).join('') + '</div></div>' +
      (hasTrial() ? '<div class="keep"><button class="btn block" data-act="keep">ใช้ตัวเลขชุดนี้</button><p class="help">ผลทุกหน้าจะเปลี่ยนตามตัวเลขชุดนี้</p></div>' : '') +
      '<p class="fine">ตัวเลขร้านเปลี่ยนได้ที่ <button class="lnk" data-act="review">แก้ตัวเลข</button></p></div></main>';
  }
  function labUpdate(k, fromSlider) {
    var p = $('#labp'); if (p) { p.innerHTML = labPanel(); runAnim(p); }
    var row = $('.lrow[data-row="' + k + '"]');
    if (!row) return;
    row.classList.toggle('changed', state.trial.hasOwnProperty(k));
    var tv = curVal(k, trialD());
    var inp = $('input[data-lv]', row);
    if (inp && document.activeElement !== inp) { inp.value = fmtInputNum(tv); inp.size = Math.max(2, inp.value.length); }
    if (!fromSlider) { var r = $('input[type="range"]', row); if (r) { if (tv > +r.max) r.max = tv; if (tv < +r.min) r.min = tv; r.value = tv; } }
    $('.lr-was', row).innerHTML = wasTxt(k);
    var h = lInsight(k), box = $('.lr-ins', row);
    if (h && !box) row.insertAdjacentHTML('beforeend', '<div class="lr-ins">' + h + '</div>');
    else if (box) { if (h) box.innerHTML = h; else box.remove(); }
    var hasKeep = !!$('.keep');
    if (hasTrial() !== hasKeep) {
      if (hasTrial()) $('.lgroup').insertAdjacentHTML('afterend', '<div class="keep"><button class="btn block" data-act="keep">ใช้ตัวเลขชุดนี้</button><p class="help">ผลทุกหน้าจะเปลี่ยนตามตัวเลขชุดนี้</p></div>');
      else $('.keep').remove();
    }
    var bt = $('.bar .tb[data-act="reset"]');
    if (hasTrial() && !bt) { var thb = $('.bar [data-act="theme"]'); thb.insertAdjacentHTML('beforebegin', '<button class="tb" data-act="reset">ล้าง</button>'); }
    if (!hasTrial() && bt) bt.remove();
    save();
  }
  function setActive(k) {
    if (state.active === k) return;
    var prev = state.active; state.active = k;
    if (prev) { var pr = $('.lrow[data-row="' + prev + '"] .lr-ins'); if (pr) pr.remove(); }
    var row = $('.lrow[data-row="' + k + '"]');
    if (row && !$('.lr-ins', row)) { var h = lInsight(k); if (h) row.insertAdjacentHTML('beforeend', '<div class="lr-ins">' + h + '</div>'); }
  }
  function setTrial(k, v) {
    var f = dDef(k), bv = curVal(k, dec());
    v = Math.round(v * 1e6) / 1e6;
    if (f.t === 'count' || k === 'bStaff' || k === 'closedDays') v = Math.round(v);
    if (k === 'count') v = Math.max(1, v);
    if (k === 'life') v = Math.max(0.5, v);
    if (k === 'salesPct') v = Math.max(-90, v);
    else if (k === 'fixedChg') v = Math.max(-fixedTotal(state.inp), v);
    else if (v < 0) v = 0;
    var mx = dMax(k); if (mx !== null) v = Math.min(mx, v);
    if (Math.abs(v - bv) < 1e-9) delete state.trial[k]; else state.trial[k] = v;
  }

  /* ============================================================ RENDER */
  function render() {
    var v = state.view;
    if (['dq', 'result', 'lab', 'ask', 'points'].indexOf(v) >= 0 && (!state.topic || !shopOk())) v = state.view = state.model ? 'review' : 'start';
    if (v === 'review' && !state.model) v = state.view = 'start';
    app.innerHTML = v === 'start' ? viewStart() : v === 'shop' ? viewShop() : v === 'wizard' ? viewWizard() : v === 'dq' ? viewDq() : v === 'review' ? viewReview()
      : v === 'lab' ? viewLab() : v === 'ask' ? viewAsk() : v === 'points' ? viewPoints() : viewResult();
    runAnim(app);
    var foot = $('#foot');
    document.documentElement.style.setProperty('--foot-h', (foot ? foot.offsetHeight : 0) + 'px');
    save();
  }
  function go(view, top) {
    var same = state.view === view && top === false;
    state.view = view; render();
    if (same) $$('.screen').forEach(function (el) { el.style.animation = 'none'; });
    if (top !== false) window.scrollTo(0, 0);
  }
  function focusMain() { var h = $('main h1') || $('main h2'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }
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
    var r = $('#dstrip'); if (r) { r.outerHTML = dStrip(); runAnim($('#dstrip')); }
    var steps = dStepsFor(state.topic, state.inp, state.model), st = steps[state.dstep], d = dec();
    var nb = $('#foot [data-act="d-next"]'); if (nb) nb.disabled = !dStepValid(st);
    var sb = $('#foot [data-act="d-done"]'); if (sb) sb.disabled = !dAllValid();
    Object.keys(DFIELDS).forEach(function (k) {
      var node = $('.field[data-df="' + k + '"]'); if (!node) return;
      node.hidden = !dShown(k, d);
      var e = $('#err-' + k); if (e) { var m = dErr(k, d); e.textContent = m; e.hidden = !m; var ib = $('.inbox', node); if (ib) ib.classList.toggle('bad', !!m); }
    });
  }

  /* ============================================================ EVENTS */
  function chooseModel(m, sample) {
    var M = MODELS[m];
    state.model = m;
    state.inp = sample ? JSON.parse(JSON.stringify(M.sample)) : {};
    if (M.defPer && !state.inp.volumePer) state.inp.volumePer = M.defPer;
    if (M.units && !state.inp.unitLabel) state.inp.unitLabel = M.defUnit;
    if (m === 'subscription' && !state.inp.cycle) state.inp.cycle = 1;
    if (m === 'rental' && !state.inp.periodKind) state.inp.periodKind = 'night';
    state.isSample = !!sample; state.trial = {}; state.answers = {}; state.qidx = 0; state.active = null; state.step = 0; state.editing = false;
    state.ds = {}; state.dstep = 0; state.dediting = false;
    state.feeHelp = false; state.fh = { share: '', rate: '' };
  }
  function openTopic(t) {
    if (!state.model) { state.topic = t; go('shop'); return; }
    if (!topicOk(t, state.model)) { toast('เรื่องนี้ยังไม่มีสำหรับร้านแบบ' + MODELS[state.model].tile); return; }
    state.topic = t; state.trial = {}; state.active = null; state.qidx = 0;
    if (!state.ds[t]) state.ds[t] = Object.assign({}, state.isSample && state.model === 'unit' ? SAMPLE_DEC[t] : DEC_DEFAULT[t]);
    if (!shopOk()) { state.step = 0; state.editing = false; go('wizard'); return; }
    if (dAllValid() && (state.isSample || Object.keys(state.ds[t]).length > Object.keys(DEC_DEFAULT[t]).length)) go('result');
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
        var tp = state.topic && topicOk(state.topic, 'unit') ? state.topic : 'hire';
        chooseModel('unit', true); state.topic = null; openTopic(tp); break;
      }
      case 'topic': openTopic(t.getAttribute('data-t')); break;
      case 'to-start': go('start'); break;
      case 'to-shop': go('shop'); break;
      case 'shop-edit': if (state.isSample) go('shop'); else go('review'); break;
      case 'model': {
        var nm = t.getAttribute('data-m');
        if (state.model === nm && !state.isSample && Object.keys(state.inp).length > 3) { state.step = 0; state.editing = false; go('wizard'); break; }
        chooseModel(nm, false); go('wizard'); break;
      }
      case 'next': steps = stepsFor(m); if (state.step < steps.length - 1) { state.step++; go('wizard'); focusMain(); } break;
      case 'prev':
        if (state.editing) go('review');
        else if (state.step > 0) { state.step--; go('wizard'); }
        else go('shop');
        break;
      case 'shop-done': {
        if (!stepsFor(m).every(stepValid)) break;
        state.editing = false; state.trial = {};
        if (!state.topic) { go('start'); break; }
        if (!topicOk(state.topic, m)) { toast('เรื่องนี้ยังไม่มีสำหรับร้านแบบ' + MODELS[m].tile); go('start'); break; }
        dec();
        if (dAllValid() && Object.keys(dec()).length > Object.keys(DEC_DEFAULT[state.topic]).length) go('result');
        else { state.dstep = 0; state.dediting = false; go('dq'); focusMain(); }
        break;
      }
      case 'review': state.trial = {}; go('review'); break;
      case 'result': go('result'); break;
      case 'edit-step': state.step = +t.getAttribute('data-i'); state.editing = true; go('wizard'); break;
      case 'd-edit': state.dstep = +t.getAttribute('data-i'); state.dediting = true; go('dq'); break;
      case 'd-next': { steps = dStepsFor(state.topic, state.inp, m); if (state.dstep < steps.length - 1 && dStepValid(steps[state.dstep])) { state.dstep++; go('dq'); focusMain(); } break; }
      case 'd-prev':
        if (state.dediting) go('review');
        else if (state.dstep > 0) { state.dstep--; go('dq'); }
        else if (state.isSample) go('start');
        else { state.step = stepsFor(m).length - 2; state.editing = false; go('wizard'); }
        break;
      case 'd-done': if (dAllValid()) { state.dediting = false; state.trial = {}; go('result'); } break;
      case 'dcount': {
        var k0 = t.getAttribute('data-k'), f0 = dDef(k0), d0 = dec();
        d0[k0] = Math.max(f0.min || 1, Math.min(f0.max || 99, Math.round(n0(d0[k0]) || 1) + +t.getAttribute('data-dir')));
        go('dq', false); var bb = $('[data-act="dcount"][data-k="' + k0 + '"][data-dir="' + t.getAttribute('data-dir') + '"]'); if (bb && !bb.disabled) bb.focus();
        break;
      }
      case 'dpick': {
        var k1 = t.getAttribute('data-k');
        dec()[k1] = +t.getAttribute('data-v');
        go('dq', false); var pb = $('[data-act="dpick"][data-k="' + k1 + '"][data-v="' + t.getAttribute('data-v') + '"]'); if (pb) pb.focus();
        break;
      }
      case 'chname': dec().chName = t.getAttribute('data-v'); go('dq', false); break;
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
      case 'lab': state.active = t.getAttribute('data-k') || null; go('lab'); if (state.active) scrollToRow(state.active); break;
      case 'try': {
        var k3 = t.getAttribute('data-k'), v3 = t.getAttribute('data-v');
        if (labKeys().indexOf(k3) < 0) break;
        state.trial = {};
        if (v3 !== null && v3 !== '') setTrial(k3, +v3);
        state.active = k3; go('lab'); scrollToRow(k3); break;
      }
      case 'step': {
        var k = t.getAttribute('data-k'), cv = curVal(k, trialD()), st = lStep(k, curVal(k, dec()));
        var nvv = Math.round((cv + st * +t.getAttribute('data-dir')) / st) * st;
        setActive(k); setTrial(k, nvv); labUpdate(k, false); break;
      }
      case 'reset': state.trial = {}; go('lab', false); break;
      case 'keep': Object.assign(dec(), state.trial); state.trial = {}; go('result'); toast('ใช้ตัวเลขชุดใหม่แล้ว'); break;
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
      case 'tool': toast('ตัวอย่างนี้ยังไม่เชื่อมกับเครื่องมือจริง ในเว็บจริงจะเปิด "' + TOOLS[t.getAttribute('data-t')][0] + '" พร้อมตัวเลขร้านคุณ'); break;
      case 'plan': toast('แผนธุรกิจยังไม่เปิดให้ใช้ ข้อความส่วนนี้รอเจ้าของตกลง'); break;
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
      var dk = el.getAttribute('data-dk');
      dec()[dk] = parseInput(el);
      if (dDef(dk).t === 'pctchips') $$('[data-act="dpick"][data-k="' + dk + '"]').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-v') === dec()[dk])); });
      refreshDqLive(); save();
    } else if (el.hasAttribute('data-chname-custom')) {
      var nmv = el.value.trim().slice(0, 24);
      dec().chName = nmv;
      $$('[data-act="chname"]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === nmv)); });
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
    } else if (el.hasAttribute('data-range')) {
      var k = el.getAttribute('data-range');
      setActive(k); setTrial(k, +el.value); labUpdate(k, true);
    } else if (el.hasAttribute('data-lv')) {
      var k2 = el.getAttribute('data-lv'), pv = parseInput(el);
      el.size = Math.max(2, el.value.length);
      if (pv !== null) { setActive(k2); setTrial(k2, pv); labUpdate(k2, false); }
    }
  }
  function onChange(e) { if (e.target.hasAttribute('data-unit-custom')) go('wizard', false); }
  function onBlur(e) {
    var el = e.target;
    if (!el.hasAttribute) return;
    if (el.hasAttribute('data-k')) {
      var v = state.inp[el.getAttribute('data-k')];
      if (v !== null && v !== undefined) el.value = el.getAttribute('data-t') === 'money' ? Math.round(v).toLocaleString('th-TH') : String(v);
    } else if (el.hasAttribute('data-dk')) {
      var dv = dec()[el.getAttribute('data-dk')];
      if (dv !== null && dv !== undefined) el.value = el.getAttribute('data-t') === 'money' ? Math.round(dv).toLocaleString('th-TH') : String(dv);
    } else if (el.hasAttribute('data-lv')) {
      el.value = fmtInputNum(curVal(el.getAttribute('data-lv'), trialD()));
    }
  }
  function onKey(e) {
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
  /* tooltip ของกราฟเงินสด (ทำ / ไม่ทำ) */
  function onPointer(e) {
    var hit = e.target.closest && e.target.closest('.chart .hit');
    var chart = e.target.closest && e.target.closest('.chart');
    $$('.tip').forEach(function (x) { if (!chart || !chart.contains(x)) x.remove(); });
    $$('.chart .cross').forEach(function (c) { if (!chart || !chart.contains(c)) c.setAttribute('visibility', 'hidden'); });
    if (!hit) { if (chart) { var tp = $('.tip', chart); if (tp) tp.remove(); var cr = $('.cross', chart); if (cr) cr.setAttribute('visibility', 'hidden'); } return; }
    var i = +hit.getAttribute('data-i'), R = E(dec());
    if (!R.ok) return;
    var va = i === 0 ? R.aStart : R.rows[i - 1].bal, vb = i === 0 ? R.cashStart : R.rows[i - 1].bBal;
    var svg = $('svg', chart), vbx = svg.viewBox.baseVal, rc = svg.getBoundingClientRect(), cb = chart.getBoundingClientRect();
    var hx = i === 0 ? +hit.getAttribute('x') : i === 12 ? +hit.getAttribute('x') + +hit.getAttribute('width') : +hit.getAttribute('x') + +hit.getAttribute('width') / 2;
    var px = hx / vbx.width * rc.width + (rc.left - cb.left);
    var cross = $('.cross', chart); cross.setAttribute('x1', hx); cross.setAttribute('x2', hx); cross.setAttribute('visibility', 'visible');
    var tip = $('.tip', chart); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; chart.appendChild(tip); }
    tip.innerHTML = (i === 0 ? 'ตอนนี้' : 'สิ้น ' + monthLabel(i, true)) + ' · ทำ <b>' + signedPlain(va) + '</b> · ไม่ทำ ' + signedPlain(vb);
    var w = tip.offsetWidth;
    tip.style.left = Math.max(w / 2, Math.min(cb.width - w / 2, px)) + 'px'; tip.style.top = '14px';
  }

  function start(data) {
    app = document.getElementById('app');
    var r = data && data.view ? data : null;
    if (!r) { try { r = JSON.parse(sessionStorage.getItem('lab3') || 'null'); } catch (e) { r = null; } }
    restore(r);
    document.addEventListener('click', onClick);
    document.addEventListener('input', onInput);
    document.addEventListener('change', onChange);
    document.addEventListener('focusout', onBlur);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointermove', onPointer);
    document.addEventListener('pointerdown', onPointer);
    window.addEventListener('resize', function () { var f = $('#foot'); document.documentElement.style.setProperty('--foot-h', (f ? f.offsetHeight : 0) + 'px'); });
    render();
  }
  var hot = window.claude && window.claude.hot;
  if (hot && hot.snapshot) { try { hot.snapshot(snapshot); } catch (e) { /* ignore */ } }
  window.__lab3 = { state: state, render: render, go: go, E: E, openTopic: openTopic, chooseModel: chooseModel };
  if (hot && hot.ready) hot.ready(start); else start(hot && hot.data ? hot.data : {});
})();
