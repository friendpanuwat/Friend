/* ============================================================
   UI v2 — เริ่ม → กรอกทีละคำถาม (มีใบเสร็จสด) → ภาพรวม → รายละเอียดแต่ละเรื่อง / หน้าทดลอง
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
    sliders: P('<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>')
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
    view: 'start', model: null, inp: {}, isSample: false, step: 0, editing: false,
    trial: {}, active: null, fid: null, qidx: 0, answers: {}, feeHelp: false, fh: { share: '', rate: '' }
  };
  var app;

  /* ---------- memo ของการคำนวณ (ตัวเลขชุดเดิมไม่ต้องคิดซ้ำ) ---------- */
  var memo = new Map();
  function C(inp, m) {
    var key = m + '|' + JSON.stringify(inp);
    if (memo.has(key)) return memo.get(key);
    var S = compute(inp, m);
    if (memo.size > 300) memo.clear();
    memo.set(key, S);
    return S;
  }
  var fmemo = new Map();
  function D(inp, m) {
    var key = m + '|' + JSON.stringify(inp);
    if (fmemo.has(key)) return fmemo.get(key);
    var F = detect(C(inp, m), inp, m);
    if (fmemo.size > 300) fmemo.clear();
    fmemo.set(key, F);
    return F;
  }

  /* ---------- persistence & theme ---------- */
  function save() { try { sessionStorage.setItem('lab2', JSON.stringify(snapshot())); } catch (e) { /* ignore */ } }
  function snapshot() {
    return { view: state.view, model: state.model, inp: state.inp, isSample: state.isSample, step: state.step, editing: state.editing,
      trial: state.trial, active: state.active, fid: state.fid, qidx: state.qidx, answers: state.answers };
  }
  function restore(d) { if (d && d.model && MODELS[d.model]) Object.assign(state, d); }
  function themeNow() {
    var t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  try { var th = localStorage.getItem('lab-theme'); if (th) document.documentElement.setAttribute('data-theme', th); } catch (e) { /* ignore */ }

  /* ---------- helpers ---------- */
  function esc(s) { return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function trialInp() { return Object.assign({}, state.inp, state.trial); }
  function hasTrial() { return Object.keys(state.trial).length > 0; }
  function fieldDef(k) { var m = state.model; for (var i = 0; i < FIELDS.length; i++) { var f = FIELDS[i]; if (f.k === k && (!f.models || f.models.indexOf(m) >= 0)) return f; } return null; }
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ตัวเลขที่ค่อยๆ วิ่งไปค่าใหม่ */
  var shown = {};
  function anim(key, v, dec) { return '<span data-anim="' + key + '" data-v="' + v + '" data-dec="' + (dec || 0) + '">' + fmtN(Math.abs(v), dec) + '</span>'; }
  function runAnim(root) {
    $$('[data-anim]', root).forEach(function (el) {
      var key = el.getAttribute('data-anim'), to = +el.getAttribute('data-v'), dec = +el.getAttribute('data-dec');
      var from = shown[key]; shown[key] = to;
      if (from === undefined || Math.abs(from - to) < 0.5 || reduced) { el.textContent = fmtN(Math.abs(to), dec); return; }
      var t0 = performance.now(), dur = 450;
      (function tick(t) {
        var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmtN(Math.abs(from + (to - from) * e), dec);
        if (p < 1 && el.isConnected) requestAnimationFrame(tick);
      })(t0);
    });
  }

  function bar(left, title, sub, right) {
    return '<header class="bar"><div class="wrap">' + (left || '<span class="spacer44"></span>') +
      '<div class="ttl">' + (sub ? '<small>' + sub + '</small>' : '') + esc(title) + '</div>' +
      (right || '') + '<button class="ib" data-act="theme" aria-label="สลับโหมดมืดและสว่าง">' + (themeNow() === 'dark' ? ICON.sun : ICON.moon) + '</button></div></header>';
  }

  /* ============================================================ START */
  function viewStart() {
    var M = MODELS.unit;
    var smp = Object.assign({}, M.sample);
    var S0 = C(smp, 'unit'), S1 = C(Object.assign({}, smp, { price: smp.price + 5 }), 'unit');
    var tiles = MODEL_ORDER.map(function (k) {
      return '<button class="tile" data-act="model" data-m="' + k + '"><span class="ic">' + MICON[k] + '</span><span class="t">' + MODELS[k].tile + '</span><span class="ex">' + MODELS[k].short + '</span></button>';
    }).join('');
    return bar(null, 'เช็กตัวเลขร้าน', 'Business Lab') + '<main class="screen"><div class="wrap">' +
      '<section class="panel start-hero">' +
      '<h1>รู้ว่าร้านอยู่ตรงไหน<br>เรื่องไหนทำให้เสียเงินเท่าไหร่</h1>' +
      '<p>แล้วลองเปลี่ยนตัวเลขดูก่อนลงมือจริง เปลี่ยนบนตัวเลขไม่เสียเงินสักบาท</p>' +
      '<div class="demo"><span class="k">ร้านกาแฟตัวอย่าง · กำไรต่อเดือน</span><span></span>' +
      '<span class="v">' + anim('demo', S0.profit) + '</span><span class="d up">' + fmtN(S1.profit - S0.profit) + '</span>' +
      '<span class="note">ถ้าขึ้นราคาแก้วละ 5 บาท โดยลูกค้าเท่าเดิม</span></div>' +
      '<div class="cta"><button class="btn on-panel block" data-act="sample-shop">ลองกับร้านตัวอย่าง' + ICON.next + '</button></div></section>' +
      '<div class="sec-h"><h2>หรือใส่ตัวเลขร้านคุณ</h2><span class="aside">ประมาณ 3 นาที</span></div>' +
      '<p class="muted" style="margin:-6px 2px 12px;font-size:14px">ร้านคุณได้เงินจากอะไรเป็นหลัก</p>' +
      '<div class="tiles">' + tiles + '</div>' +
      '<p class="fine">ไม่ต้องสมัคร ตัวเลขอยู่ในเครื่องคุณเท่านั้น และหายไปเมื่อปิดหน้านี้ · คำนวณด้วยสูตรชุดเดียวกับแผนธุรกิจของ Jarua</p>' +
      '</div></main>';
  }

  /* ============================================================ WIZARD */
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
    S.push({ id: 'cash', q: 'ตอนนี้มีเงินหมุนในร้านเท่าไหร่', p: 'ใช้ดูว่าเงินพอใช้ถึงเดือนไหน ไม่ใส่ก็ได้', f: ['cash'] });
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

  /* ใบเสร็จที่ค่อยๆ เติมระหว่างกรอก */
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
    } else {
      body = '<div class="qfields">' + st.f.map(fieldHtml).join('') + '</div>';
    }
    var cashIdx = steps.map(function (s) { return s.id; }).indexOf('cash');
    var isLastReq = state.step === cashIdx, isAdv = !!st.adv;
    var allOk = steps.every(stepValid);
    var primary;
    if (state.editing) primary = '<button class="btn" data-act="see"' + (allOk ? '' : ' disabled') + '>ดูผล</button>';
    else if (isLastReq || isAdv) primary = '<button class="btn" data-act="see"' + (allOk ? '' : ' disabled') + '>ดูผล' + ICON.next + '</button>';
    else primary = '<button class="btn" data-act="next"' + (stepValid(st) ? '' : ' disabled') + '>ถัดไป' + ICON.next + '</button>';
    var foot = '<div class="foot" id="foot"><div class="wrap"><button class="btn ghost back" data-act="prev" aria-label="ย้อนกลับ">' + ICON.back + '</button>' + primary + '</div></div>';
    var more = isLastReq && !state.editing ? '<div class="skip"><button class="lnk" data-act="next">เพิ่มรายละเอียดให้แม่นขึ้น (ไม่ใส่ก็ได้)</button></div>' : '';
    return bar('<button class="ib" data-act="prev" aria-label="ย้อนกลับ">' + ICON.back + '</button>', MODELS[m].tile, 'ข้อ ' + (state.step + 1) + ' จาก ' + steps.length) +
      '<main class="screen"><div class="wrap">' + prog + wizReceipt() +
      '<div class="q-head"><h1>' + esc(st.q) + '</h1>' + (st.p ? '<p>' + esc(st.p) + '</p>' : '') + '</div>' + body + more + '</div></main>' + foot;
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
  function viewReview() {
    var steps = stepsFor(state.model);
    var ok = steps.every(stepValid);
    return bar('<button class="ib" data-act="home" aria-label="กลับ">' + ICON.back + '</button>', 'แก้ตัวเลขร้าน', MODELS[state.model].tile) +
      '<main class="screen"><div class="wrap">' + (state.isSample ? '<div class="banner"><span>กำลังใช้ตัวเลขร้านกาแฟตัวอย่าง</span><button class="lnk" data-act="to-start">เริ่มใหม่กับร้านคุณ</button></div>' : '') +
      '<div class="rv">' + steps.map(function (st, i) {
        return '<button class="rv-row" data-act="edit-step" data-i="' + i + '"><span class="t">' + esc(st.q) + '</span><span class="v">' + esc(stepSummary(st)) + '</span>' + ICON.chev + '</button>';
      }).join('') + '</div></div></main>' +
      '<div class="foot" id="foot"><div class="wrap"><button class="btn" data-act="see"' + (ok ? '' : ' disabled') + '>ดูผล</button></div></div>';
  }

  /* ============================================================ HOME */
  function statsHtml(S, base, m, prefix, B) {
    var u = volUnitText(base, m);
    var s1, s2, s3;
    if (!S.be || S.be.impossible) s1 = ['จุดคุ้มทุน', '—', '<small>ขายเท่าไหร่ก็ไม่คุ้ม</small>'];
    else s1 = ['จุดคุ้มทุน', anim(prefix + 'be', S.be.vol, 1), '<small>' + esc(u) + '</small>'];
    if (S.profit < 0 && S.be && !S.be.impossible) s2 = ['ต้อง' + (m === 'rental' ? 'มีคนเช่า' : 'ขาย') + 'เพิ่ม', anim(prefix + 'sf', (S.be.vol / S.vol - 1) * 100, 0), '<small>%</small>'];
    else if (S.be && !S.be.impossible) s2 = [(m === 'rental' ? 'คนเช่า' : m === 'subscription' ? 'สมาชิก' : 'ยอด') + 'ลดได้อีก', anim(prefix + 'sf', S.be.safety * 100, 0), '<small>%</small>'];
    else s2 = ['ขาดทุนทุก' + U(base, m) + 'ที่ขาย', '—', ''];
    if (S.hasCash && S.firstNegT) s3 = ['เงินสดหมดราว', '<span>' + monthLabel(S.firstNegT, true) + '</span>', ''];
    else if (S.hasCash) s3 = ['เงินสดอีก 12 เดือน', '<span>' + compactTH(S.cashEnd) + '</span>', ''];
    else s3 = ['เงินเพิ่มใน 12 เดือน', '<span>' + (S.cashEnd < 0 ? '−' : '') + compactTH(Math.abs(S.cashEnd)) + '</span>', ''];
    function d(a, b, dec) {
      if (!B || a === null || b === null || Math.abs(a - b) < 0.05) return '';
      return '<div class="d ' + (a > b ? 'up' : 'down') + '">' + fmtN(Math.abs(a - b), dec) + '</div>';
    }
    var dd = B ? [
      d(S.be && !S.be.impossible ? S.be.vol : null, B.be && !B.be.impossible ? B.be.vol : null, 1),
      d(S.be && !S.be.impossible ? S.be.safety * 100 : null, B.be && !B.be.impossible ? B.be.safety * 100 : null, 0),
      d(S.cashEnd, B.cashEnd, 0)
    ] : ['', '', ''];
    return '<div class="stats">' + [s1, s2, s3].map(function (s, i) {
      return '<div class="stat"><div class="k">' + s[0] + '</div><div class="v">' + s[1] + s[2] + '</div>' + dd[i] + '</div>';
    }).join('') + '</div>';
  }
  function moneyOf(f) {
    if (f.unit === 'month') return [fmtN(f.money), 'บาท/เดือน'];
    if (f.unit === 'year') return [fmtN(f.money * 12), 'บาท ใน 12 เดือน'];
    if (f.unit === 'once') return [fmtN(f.money), 'บาท'];
    return ['', ''];
  }
  var PILL = { high: ['high', 'หนัก'], mid: ['mid', 'ปานกลาง'], watch: ['watch', 'ควรจับตา'], note: ['note', 'ข้อสังเกต'] };

  function viewHome() {
    var m = state.model, base = state.inp, S = C(base, m);
    var head = bar('<button class="tb" data-act="review">' + ICON.back + 'แก้ตัวเลข</button>', 'เช็กตัวเลขร้าน', 'Business Lab');
    if (!S.ok) return head + '<main class="screen"><div class="wrap"><div class="ok-box"><b>ตัวเลขยังไม่ครบ</b><p>กด "แก้ตัวเลข" เพื่อกรอกให้ครบ</p></div></div></main>';
    var F = D(base, m), real = F.filter(function (f) { return f.lv !== 'note'; }), notes = F.filter(function (f) { return f.lv === 'note'; });
    var out = head + '<main class="screen"><div class="wrap">';
    if (state.isSample) out += '<div class="banner"><span>นี่คือร้านกาแฟตัวอย่าง</span><button class="lnk" data-act="to-start">ใส่ตัวเลขร้านคุณ</button></div>';
    out += '<section class="panel"><div class="eyebrow"><span>' + (S.profit < 0 ? 'ขาดทุนต่อเดือน' : 'กำไรต่อเดือน') + '</span>' + (state.isSample ? '<span class="tag">ตัวอย่าง</span>' : '') + '</div>' +
      '<div class="bignum">' + (S.profit < 0 ? '−' : '') + anim('hp', S.profit) + '<span class="u">บาท</span></div>' +
      '<div class="sub">' + (S.owner > 0 ? 'หักเงินเดือนคุณ ' + fmtN(S.owner) + ' แล้ว' : 'ยังไม่ได้หักเงินเดือนคุณ') + ' · รายได้ ' + fmtN(S.revenue) + '</div>' +
      statsHtml(S, base, m, 'h') +
      '<div class="cta"><button class="btn on-panel block" data-act="lab">' + ICON.sliders + 'ลองเปลี่ยนตัวเลข</button></div></section>';

    out += '<div class="sec-h"><h2>สิ่งที่ตัวเลขบอก</h2><span class="aside">' + (real.length ? real.length + ' เรื่อง' : '') + '</span></div>';
    if (real.length) {
      out += '<div class="flist">' + real.map(function (f) {
        var mo = moneyOf(f);
        return '<button class="frow" data-act="finding" data-f="' + f.id + '"><span class="pill ' + PILL[f.lv][0] + '">' + PILL[f.lv][1] + '</span><span class="ft">' + esc(f.title) + '</span>' +
          '<span class="fr-r"><span class="fm">' + mo[0] + '<small>' + mo[1] + '</small></span>' + ICON.chev + '</span></button>';
      }).join('') + '</div>';
    } else {
      out += '<div class="ok-box"><b>ยังไม่มีเรื่องที่น่าห่วง</b><p>ในเรื่องที่ตรวจได้จากตัวเลข ร้านคุณยังแข็งแรง ดูด้านล่างว่าตัวเลขไหนขยับแล้วได้เงินเพิ่มมากที่สุด</p></div>';
    }
    if (notes.length) out += '<div class="flist" style="margin-top:8px">' + notes.map(function (f) {
      return '<button class="frow" data-act="finding" data-f="' + f.id + '"><span class="pill note">ข้อสังเกต</span><span class="ft">' + esc(f.title) + '</span><span class="fr-r">' + ICON.chev + '</span></button>';
    }).join('') + '</div>';
    out += '<div style="margin-top:12px">' + nextStepCard() + '</div>';

    out += '<div class="sec-h"><h2>ภาพร้าน</h2></div><div class="cards">' + beCard(S, base, m) + cashCard(S) + '</div>' + receiptHtml(S, null) +
      '<div class="cards">' + rankCard(S, base, m) + capCard(S, base, m) + custCard(S) + '</div>';
    out += '<section class="panel plan"><span class="tag">เร็วๆ นี้</span><h3>อยากเห็นทุกเรื่องเชื่อมกันเป็นแผนเดียว</h3><p>แผนธุรกิจของ Jarua ใช้ตัวเลขชุดนี้ต่อได้ทันที แล้ววางทางทั้งร้าน ทั้งการตลาด ทีม และเงิน 12 เดือน</p>' +
      '<button class="btn on-panel block" data-act="plan">ดูแผนธุรกิจ</button></section>';
    out += '<details class="about"><summary>ตัวเลขชุดนี้คิดอย่างไร' + ICON.down + '</summary><ul>' +
      '<li>คำนวณด้วยสูตรชุดเดียวกับแผนธุรกิจของ Jarua ตัวเลขจึงตรงกันทุกที่</li><li>ทุกตัวเลขมาจากที่คุณกรอก ไม่ได้เทียบกับร้านอื่น</li><li>กำไรเป็นกำไรก่อนหักภาษี</li>' +
      '<li>' + (n0(base.growth) ? 'ยอดขายเปลี่ยนเดือนละ ' + fmtPct(n0(base.growth)) + ' ตามที่กรอก' : 'คิดแบบยอดขายเท่าเดิมทุกเดือน') + ' · ค่าใช้จ่ายคงที่เท่าเดิมตลอด 12 เดือน</li></ul></details>';
    return out + '</div></main>';
  }

  function beCard(S, base, m) {
    var u = U(base, m), ut = volUnitText(base, m);
    if (!S.be || S.be.impossible) return '<section class="card"><h3>จุดคุ้มทุน</h3><p class="lead">ขายเท่าไหร่ก็ไม่คุ้มทุน เพราะเงินที่ได้ต่อ' + esc(u) + ' ไม่พอจ่ายต้นทุนที่ขึ้นลงตามยอดขาย</p></section>';
    var cur = S.vol, be = S.be.vol;
    var max = m === 'rental' ? 100 : Math.max(cur, be) * 1.2;
    function pc(v) { return Math.max(0, Math.min(100, v / max * 100)); }
    function ed(p) { return p < 14 ? ' el' : p > 86 ? ' er' : ''; }
    var gap = cur - be;
    var lead = gap >= 0 ? 'ตอนนี้เกินจุดคุ้มทุน <b>' + fmtN(gap, 1) + '</b> ' + esc(ut) : 'ยังขาดอีก <b>' + fmtN(-gap, 1) + '</b> ' + esc(ut) + ' ถึงจะคุ้มทุน';
    return '<section class="card"><h3>จุดคุ้มทุน</h3><p class="lead">' + lead + '</p>' +
      '<div class="gauge" role="img" aria-label="จุดคุ้มทุน ' + fmtN(be, 1) + ' ตอนนี้ ' + fmtN(cur, 1) + '"><span class="ml' + ed(pc(be)) + '" style="left:' + pc(be) + '%">คุ้มทุน ' + fmtN(be, 1) + '</span>' +
      '<div class="track"><div class="fill" style="width:' + pc(cur) + '%"></div><div class="mark" style="left:' + pc(be) + '%"></div></div>' +
      '<span class="nl' + ed(pc(cur)) + '" style="left:' + pc(cur) + '%">ตอนนี้ ' + fmtN(cur, 1) + '</span></div></section>';
  }
  function cashCard(S) {
    if (!S.cash.length) return '';
    var lead = S.hasCash ? (S.firstNegT ? 'เงินจะเริ่มติดลบเดือน <b>' + monthLabel(S.firstNegT, true) + '</b>' : 'สิ้น ' + monthLabel(12, true) + ' มีเงินสด <b>' + fmtN(S.cashEnd) + '</b> บาท')
      : (S.cashEnd >= 0 ? 'อีก 12 เดือน เงินเพิ่มขึ้น <b>' + fmtN(S.cashEnd) + '</b> บาท' : 'อีก 12 เดือน เงินลดลง <b>' + fmtN(-S.cashEnd) + '</b> บาท');
    return '<section class="card"><h3>เงินสด 12 เดือนข้างหน้า</h3><p class="lead">' + lead + '</p><div class="chart" data-chart="cash">' + cashSvg(S) + '</div></section>';
  }
  function cashSvg(S) {
    var W = 340, H = 190, L = 44, R = 12, T = 18, B = 26;
    var s1 = [S.cashStart].concat(S.cash.map(function (c) { return c.bal; }));
    var mn = Math.min(0, Math.min.apply(null, s1)), mx = Math.max(0, Math.max.apply(null, s1));
    if (mx === mn) mx = mn + 1;
    var step = niceStep((mx - mn) / 3), lo = Math.floor(mn / step) * step, hi = Math.ceil(mx / step) * step;
    function x(i) { return L + (W - L - R) * i / 12; }
    function y(v) { return T + (H - T - B) * (1 - (v - lo) / (hi - lo)); }
    var g = '';
    for (var v = lo; v <= hi + 1e-6; v += step) g += '<line class="' + (Math.abs(v) < 1e-6 && lo < 0 ? 'zero' : 'grid') + '" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v).toFixed(1) + '" y2="' + y(v).toFixed(1) + '"/><text class="ax" x="' + (L - 6) + '" y="' + (y(v) + 4).toFixed(1) + '" text-anchor="end">' + compactTH(v) + '</text>';
    [0, 3, 6, 9, 12].forEach(function (i) { g += '<text class="axth" x="' + x(i).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="' + (i === 0 ? 'start' : i === 12 ? 'end' : 'middle') + '">' + (i === 0 ? 'ตอนนี้' : monthLabel(i, i === 12)) + '</text>'; });
    var path = s1.map(function (v, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); }).join(' ');
    var y0 = y(Math.max(lo, 0)).toFixed(1);
    var out = g + '<path class="area" d="' + path + ' L' + x(12).toFixed(1) + ' ' + y0 + ' L' + x(0).toFixed(1) + ' ' + y0 + ' Z"/><path class="line" d="' + path + '"/>';
    var ey = y(s1[12]);
    out += '<circle class="dot" cx="' + x(12).toFixed(1) + '" cy="' + ey.toFixed(1) + '" r="5"/><text class="endlab" x="' + (x(12) - 4).toFixed(1) + '" y="' + (ey < T + 14 ? ey + 20 : ey - 11).toFixed(1) + '" text-anchor="end">' + compactTH(s1[12]) + '</text>';
    if (S.firstNegT) out += '<circle class="dot" cx="' + x(S.firstNegT).toFixed(1) + '" cy="' + y(s1[S.firstNegT]).toFixed(1) + '" r="5"/>';
    for (var i = 0; i <= 12; i++) {
      var x0 = i === 0 ? L : (x(i) + x(i - 1)) / 2, x1 = i === 12 ? W - R : (x(i) + x(i + 1)) / 2;
      out += '<rect class="hit" data-i="' + i + '" x="' + x0.toFixed(1) + '" y="' + T + '" width="' + (x1 - x0).toFixed(1) + '" height="' + (H - T - B) + '"/>';
    }
    out += '<line class="cross" x1="0" x2="0" y1="' + T + '" y2="' + (H - B) + '" visibility="hidden"/>';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="กราฟเงินสด 12 เดือน">' + out + '</svg>';
  }
  function receiptHtml(S, B) {
    if (!(S.revenue > 0)) return '';
    var segs = S.split.map(function (s) { return '<i style="flex-grow:' + Math.max(0, s.per100).toFixed(2) + '"></i>'; }).join('') + (S.keep100 > 0 ? '<i class="k" style="flex-grow:' + S.keep100.toFixed(2) + '"></i>' : '');
    var lines = S.split.map(function (s) {
      var b = B ? B.split.filter(function (x) { return x.k === s.k; })[0] : null;
      return '<div class="rc-line"><span>' + esc(s.label) + '</span><i></i>' + (b && Math.abs(b.per100 - s.per100) > 0.05 ? '<span class="was">' + b.per100.toFixed(2) + '</span>' : '') + '<b>' + s.per100.toFixed(2) + '</b></div>';
    }).join('');
    var now = new Date();
    return '<section class="receipt" aria-label="เงิน 100 บาทที่ลูกค้าจ่าย ไปไหนบ้าง"><div class="rc-head"><div class="rt">เงิน 100 บาทที่ลูกค้าจ่าย ไปไหนบ้าง</div><div class="rs">ต่อเดือน · ' + TH_MONTHS[now.getMonth()] + ' ' + (now.getFullYear() + 543) + '</div></div>' +
      '<div class="rc-bar" aria-hidden="true">' + segs + '</div><div class="rc-lines">' + lines + '</div>' +
      '<div class="rc-total"><span>' + (S.keep100 >= 0 ? 'เหลือเป็นกำไร' : 'ขาดทุน') + '</span><b>' + (S.keep100 < 0 ? '−' : '') + Math.abs(S.keep100).toFixed(2) + '</b></div>' +
      '<div class="rc-foot">จากทุก 100.00 บาท</div></section>';
  }
  function rankCard(S, base, m) {
    var items = sensitivity(S, base, m);
    if (!items.length) return '';
    var mx = items[0].gain;
    return '<section class="card"><h3>ตัวเลขไหนขยับแล้วได้เงินเพิ่มมากที่สุด</h3><p class="lead">ถ้าตัวเลขนั้นดีขึ้น 10% · แตะเพื่อลอง</p><div class="rank">' + items.map(function (it) {
      return '<button data-act="lab" data-k="' + (it.lever || 'rent') + '"><span class="rl">' + esc(it.label) + '<small>' + esc(it.how) + '</small></span><span class="rv">+' + fmtN(it.gain) + '</span><span class="rb"><i style="width:' + (it.gain / mx * 100).toFixed(1) + '%"></i></span></button>';
    }).join('') + '</div></section>';
  }
  function capCard(S, base, m) {
    if (!S.util || S.util.rental) return '';
    var u = S.util;
    return '<section class="card"><h3>กำลังที่รับได้</h3><p class="lead">ใช้ไปแล้ว <b>' + fmtPct(u.pct) + '</b> · ' + (u.reachT ? 'จะเต็มในเดือน ' + monthLabel(u.reachT, true) : 'สูงสุด ' + fmtN(u.max, 1) + ' ' + esc(m === 'project' ? 'งานพร้อมกัน' : volUnitText(base, m))) + '</p><div class="meter"><i style="width:' + Math.min(100, u.pct) + '%"></i></div></section>';
  }
  function custCard(S) {
    if (!S.cust || S.cust.ltvProfit === null || S.cust.cac === null) return '';
    var c = S.cust;
    return '<section class="card"><h3>ลูกค้า 1 คน คุ้มค่าหาไหม</h3><p class="lead">ค่าหาลูกค้าใหม่ <b>' + fmtN(c.cac) + '</b> บาท · ลูกค้าสร้างกำไรให้ <b>' + fmtN(c.ltvProfit) + '</b> บาท ตลอดที่ซื้อกับคุณ</p></section>';
  }

  /* ============================================================ FINDING DETAIL */
  function viewFinding() {
    var m = state.model, base = state.inp, S = C(base, m);
    var f = D(base, m).filter(function (x) { return x.id === state.fid; })[0];
    var head = bar('<button class="ib" data-act="home" aria-label="กลับ">' + ICON.back + '</button>', 'สิ่งที่ตัวเลขบอก', '');
    if (!f) return head + '<main class="screen"><div class="wrap"><div class="ok-box"><b>เรื่องนี้หายไปแล้ว</b><p>ตัวเลขร้านเปลี่ยน เรื่องนี้จึงไม่เกิดแล้ว</p></div></div></main>';
    var mo = moneyOf(f);
    var out = head + '<main class="screen"><div class="wrap"><section class="panel fd-panel"><div class="eyebrow"><span class="tag">' + PILL[f.lv][1] + '</span></div><div class="ft">' + esc(f.title) + '</div>' +
      (f.unit !== 'none' ? '<div class="bignum">' + mo[0] + '<span class="u">' + mo[1] + '</span></div><div class="sub">' + esc(f.moneyCap) + '</div>' : '') + '</section>';
    out += '<div class="block"><h2>ตัวเลขบอกอะไร</h2><div class="say">' + f.ev.map(function (e) { return '<span>' + esc(e) + '</span>'; }).join('') + '</div></div>';
    if (f.ways && f.ways.length) {
      out += '<div class="block"><h2>' + esc(f.waysTitle) + '</h2><div class="ways">' + f.ways.map(function (w) {
        var go = w.lever ? '<span class="go">ลองดู' + ICON.chev + '</span>' : '';
        var inner = w.big ? '<span class="wl">' + esc(w.label) + '</span><span class="wb">' + esc(w.big) + '</span><span class="wn">' + esc(w.note) + '</span>' : '<span class="wt">' + w.text + '</span>';
        return w.lever ? '<button class="way" data-act="try" data-k="' + w.lever + '"' + (w.value !== null && w.value !== undefined ? ' data-v="' + w.value + '"' : '') + '>' + inner + go + '</button>'
          : '<div class="way static">' + inner + '</div>';
      }).join('') + '</div></div>';
    }
    if (f.tryLever) out += '<div class="block"><button class="sbtn" data-act="try" data-k="' + f.tryLever + '" data-v="15000">ลองใส่เงินเดือนคุณ</button></div>';
    if (f.editField) out += '<div class="block"><button class="sbtn" data-act="edit-field" data-k="' + f.editField + '">ใส่เงินสดที่มี</button></div>';
    if (askList().length) out += '<div class="block"><div class="next"><div class="nx-k">ขั้นต่อไป</div><h3>หาจุดที่ควรเช็ก และเครื่องมือที่ช่วยได้</h3>' +
      '<p>' + (askDone() ? 'คุณตอบครบแล้ว ดูผลได้เลย' : 'ตอบ ' + askList().length + ' ข้อ แค่ ใช่ / ไม่ใช่ / ไม่แน่ใจ') + '</p>' +
      '<button class="btn block" data-act="' + (askDone() ? 'points' : 'ask') + '">' + (askDone() ? 'ดูจุดที่ควรเช็กและเครื่องมือ' : 'เริ่มตอบ') + ICON.next + '</button></div></div>';
    return out + '</div></main>';
  }
  /* ============================================================ หาจุดที่ควรเช็ก → เครื่องมือ PL1 / แผนธุรกิจ PL2
     รวมคำถามของทุกเรื่องที่ตัวเลขบอกเป็นชุดเดียว (ไม่ถามซ้ำ) สลับกันทีละเรื่อง สูงสุด 5 ข้อ */
  function askList() {
    var F = D(state.inp, state.model).filter(function (f) { return f.lv !== 'note' && f.qs && f.qs.length; });
    var out = [], seen = {}, idx = F.map(function () { return 0; }), more = true;
    while (out.length < 5 && more) {
      more = false;
      for (var i = 0; i < F.length && out.length < 5; i++) {
        while (idx[i] < F[i].qs.length && seen[F[i].qs[idx[i]]]) idx[i]++;
        if (idx[i] < F[i].qs.length) { var q = F[i].qs[idx[i]++]; seen[q] = 1; out.push(q); more = true; }
      }
    }
    return out.map(function (q) { return { qid: q, fs: F.filter(function (f) { return f.qs.indexOf(q) >= 0; }) }; });
  }
  function askDone() { var L = askList(); return L.length > 0 && L.every(function (q) { return state.answers[q.qid]; }); }
  function askedCount() { return askList().filter(function (q) { return state.answers[q.qid]; }).length; }
  /* เรียงจุดที่ควรเช็กตามความหนักของเรื่องที่ตัวเลขบอก (ลำดับเดียวกับหน้าภาพรวม) แล้วตามลำดับคำถาม */
  function pointsList() {
    var order = D(state.inp, state.model).map(function (f) { return f.id; });
    var L = askList();
    return L.filter(function (q) { var a = state.answers[q.qid]; return a === 'yes' || a === 'unsure'; })
      .map(function (q) { return { q: q, r: Math.min.apply(null, q.fs.map(function (f) { return order.indexOf(f.id); })), i: L.indexOf(q) }; })
      .sort(function (a, b) { return a.r - b.r || a.i - b.i; }).map(function (x) { return x.q; });
  }
  function nextStepCard() {
    var L = askList();
    if (!L.length) return '<section class="next"><div class="nx-k">ขั้นต่อไป</div><h3>ร้านแข็งแรง อยากโตต่อ?</h3><p>ดูเครื่องมือที่ช่วยหาทางเลือกในการเติบโต และแผนธุรกิจทั้งร้าน</p><button class="btn block" data-act="points">ดูเครื่องมือที่ช่วยต่อยอด' + ICON.next + '</button></section>';
    if (askDone()) {
      var n = pointsList().length;
      return '<section class="next"><div class="nx-k">ขั้นต่อไป</div><h3>' + (n ? 'เจอ ' + n + ' จุดที่ควรเช็ก' : 'ยังไม่เจอจุดที่ควรเช็กจากคำตอบ') + '</h3><p>ดูว่าแต่ละจุดมีผลกับเงินเท่าไหร่ และเครื่องมือไหนช่วยหาแนวทางแก้ไขได้</p>' +
        '<button class="btn block" data-act="points">ดูจุดที่ควรเช็กและเครื่องมือ' + ICON.next + '</button><div class="nx-sub"><button class="lnk" data-act="ask-restart">ตอบใหม่</button></div></section>';
    }
    return '<section class="next"><div class="nx-k">ขั้นต่อไป</div><h3>หาจุดที่ควรเช็ก และเครื่องมือที่ช่วยได้</h3><p>ตอบ ' + L.length + ' ข้อ แค่ ใช่ / ไม่ใช่ / ไม่แน่ใจ ใช้เวลาไม่ถึง 1 นาที</p>' +
      '<button class="btn block" data-act="ask">' + (askedCount() ? 'ตอบต่อ' : 'เริ่มตอบ') + ICON.next + '</button></section>';
  }
  function viewAsk() {
    var L = askList();
    if (!L.length) return viewPoints();
    var i = Math.max(0, Math.min(state.qidx, L.length - 1));
    var q = L[i], b = QBANK[q.qid], a = state.answers[q.qid];
    var why = q.fs.map(function (f) { return f.title; }).join(' และ ');
    return bar('<button class="ib" data-act="home" aria-label="กลับ">' + ICON.back + '</button>', 'หาจุดที่ควรเช็ก', 'ข้อ ' + (i + 1) + ' จาก ' + L.length) +
      '<main class="screen"><div class="wrap"><div class="prog">' + L.map(function (x, j) { return '<i class="' + (state.answers[x.qid] || j <= i ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
      '<div class="ask-why"><span>เพราะตัวเลขบอกว่า</span><b>' + esc(why) + '</b></div>' +
      '<h1 class="ask-q">' + esc(b.q(state.inp, state.model)) + '</h1>' +
      '<div class="ask-ans">' + [['yes', 'ใช่'], ['no', 'ไม่ใช่'], ['unsure', 'ไม่แน่ใจ']].map(function (o) {
        return '<button data-act="answer" data-q="' + q.qid + '" data-v="' + o[0] + '" aria-pressed="' + (a === o[0]) + '">' + o[1] + '</button>';
      }).join('') + '</div>' +
      '<div class="qnav">' + (i > 0 ? '<button class="lnk" data-act="q-prev">ข้อก่อนหน้า</button>' : '<span></span>') +
      (askedCount() ? '<button class="lnk" data-act="points">ดูผลเลย</button>' : '') + '</div></div></main>';
  }
  function pointCard(q, S, seenTools) {
    var b = QBANK[q.qid], a = state.answers[q.qid];
    var tag = pointTag(b.lever, S, state.inp, state.model);
    var lk = b.lever ? roleKey(state.model, b.lever) : null;
    var canTry = lk && leverKeys().indexOf(lk) >= 0;
    var fresh = b.tools.filter(function (c) { return !seenTools[c]; });
    fresh.forEach(function (c) { seenTools[c] = 1; });
    return '<div class="point"><div class="pt-from">จาก: ' + esc(q.fs.map(function (f) { return f.title; }).join(' · ')) + '</div>' +
      '<div class="pt">' + esc(b.p) + (a === 'unsure' ? '<span class="unsure">ไม่แน่ใจ</span>' : '') + '</div><div class="pd">' + esc(b.d) + '</div>' +
      (tag ? '<div class="ptag">' + tag + '</div>' : '') +
      (fresh.length ? toolsHtml(fresh, 'เครื่องมือที่ช่วยหาแนวทางแก้ไข') : '<div class="tools"><span class="tl">ใช้เครื่องมือเดียวกับด้านบน</span></div>') +
      (canTry ? '<button class="sbtn light" data-act="try" data-k="' + lk + '">' + ICON.sliders + 'ลองเปลี่ยนตัวเลขนี้</button>' : '') + '</div>';
  }
  function viewPoints() {
    var m = state.model, S = C(state.inp, m), L = askList(), P = pointsList(), seen = {};
    var out = bar('<button class="ib" data-act="home" aria-label="กลับ">' + ICON.back + '</button>', 'จุดที่ควรเช็ก', '') + '<main class="screen"><div class="wrap">';
    if (!L.length) {
      out += '<section class="panel"><div class="eyebrow">ร้านคุณ</div><div class="pp-t">ยังไม่มีเรื่องที่น่าห่วง</div><div class="sub">ในเรื่องที่ตรวจได้จากตัวเลข ถ้าอยากโตต่อ เครื่องมือด้านล่างช่วยหาทางเลือกได้</div></section>' +
        '<div class="block"><h2>เครื่องมือที่ช่วยหาทางเลือกในการเติบโต</h2>' + toolsHtml(['swot4', 'idea8', 'bmc8', 'goal1'], '') + '</div>';
    } else {
      out += '<section class="panel"><div class="eyebrow">จากคำตอบ ' + askedCount() + ' ข้อ</div><div class="pp-t">' + (P.length ? 'เจอ ' + P.length + ' จุดที่ควรเช็ก' : 'ยังไม่เจอจุดที่ควรเช็กจากคำตอบ') + '</div>' +
        '<div class="sub">' + (P.length ? 'แต่ละจุดบอกว่ามีผลกับเงินเท่าไหร่ และเครื่องมือไหนช่วยหาแนวทางแก้ไขได้ เปิดแล้วใช้ตัวเลขร้านคุณต่อได้ทันที' : 'ลองใช้เครื่องมือตรวจภาพรวมของร้าน') + '</div>' +
        '<div class="cta"><button class="pbtn" data-act="ask-restart">แก้คำตอบ</button></div></section>';
      if (P.length) out += '<div class="points" style="margin-top:14px">' + P.map(function (q) { return pointCard(q, S, seen); }).join('') + '</div>';
      else out += '<div class="block">' + toolsHtml(['bmc1', 'swot5'], 'เครื่องมือที่ช่วยดูภาพรวม') + '</div>';
    }
    out += '<section class="panel plan"><span class="tag">เร็วๆ นี้</span><h3>อยากได้แผนที่เชื่อมทุกเรื่องของร้าน</h3><p>แผนธุรกิจของ Jarua ใช้ตัวเลขชุดนี้ต่อได้ทันที แล้ววางทางทั้งร้าน ทั้งการตลาด ทีม และเงิน 12 เดือน</p>' +
      '<button class="btn on-panel block" data-act="plan">ดูแผนธุรกิจ</button></section>';
    return out + '</div></main>';
  }
  function toolsHtml(codes, title) {
    var seen = {};
    var items = codes.filter(function (c) { if (seen[c] || !TOOLS[c]) return false; seen[c] = 1; return true; }).map(function (c) {
      return '<button class="tool" data-act="tool" data-t="' + c + '"><span class="tn">' + esc(TOOLS[c][0]) + '</span><span class="ts">' + esc(TOOLS[c][1]) + '</span>' + ICON.out + '</button>';
    }).join('');
    return items ? '<div class="tools">' + (title ? '<span class="tl">' + esc(title) + '</span>' : '') + items + '</div>' : '';
  }

  /* ============================================================ LAB */
  var VAR_KEYS = { unitCost: 1, feePct: 1, costPerMember: 1, directCostPct: 1, costPerOccupied: 1, splitPct: 1, costPct: 1 };
  function leverKeys() {
    var m = state.model;
    return MODEL_LEVERS[m].concat(COMMON_LEVERS).filter(function (k) {
      return !(k === 'staffSalary' && n0(state.inp.staffCount) === 0 && n0(state.trial.staffCount) === 0);
    });
  }
  function labPanel() {
    var m = state.model, B = C(state.inp, m), T = hasTrial() ? C(trialInp(), m) : B;
    if (!B.ok || !T.ok) return '<section class="panel lab-panel"><div class="k">ตัวเลขยังไม่ครบ</div></section>';
    var d = T.profit - B.profit;
    var fb = D(state.inp, m).filter(function (f) { return f.lv !== 'note'; }), ft = D(trialInp(), m).filter(function (f) { return f.lv !== 'note'; });
    var ib = fb.map(function (f) { return f.id; }), it = ft.map(function (f) { return f.id; });
    var chips = fb.filter(function (f) { return it.indexOf(f.id) < 0; }).map(function (f) { return '<span><b>หายไป</b> ' + esc(f.title) + '</span>'; })
      .concat(ft.filter(function (f) { return ib.indexOf(f.id) < 0; }).map(function (f) { return '<span><b>เกิดใหม่</b> ' + esc(f.title) + '</span>'; }));
    return '<section class="panel lab-panel" aria-live="polite"><div class="row1"><span class="k">' + (T.profit < 0 ? 'ขาดทุนต่อเดือน' : 'กำไรต่อเดือน') + (hasTrial() ? ' ถ้าเป็นแบบนี้' : '') + '</span>' +
      (hasTrial() ? '<span class="delta ' + (d > 0.5 ? 'up' : d < -0.5 ? 'down' : '') + '">' + fmtN(Math.abs(d)) + '</span>' : '') + '</div>' +
      '<div class="bignum">' + (T.profit < 0 ? '−' : '') + anim('lp', T.profit) + '<span class="u">บาท</span></div>' +
      '<div class="was">' + (hasTrial() ? 'ตัวเลขจริง ' + (B.profit < 0 ? '−' : '') + fmtN(Math.abs(B.profit)) + ' บาท' : 'เลื่อนตัวเลขด้านล่าง แล้วดูผลตรงนี้') + '</div>' +
      statsHtml(T, state.inp, m, 'l', hasTrial() ? B : null) + (chips.length ? '<div class="chg">' + chips.join('') + '</div>' : '') + '</section>';
  }
  function fmtInputNum(v) {
    if (v === null || v === undefined) return '';
    var r = Math.round(v * 100) / 100;
    return Math.abs(r) >= 1000 ? Math.round(r).toLocaleString('th-TH') : String(r);
  }
  function wasTxt(k) {
    var bv = n0(state.inp[k]), tv = n0(trialInp()[k]);
    if (Math.abs(bv - tv) < 1e-9) return '';
    var pct = leverUnit(k, state.inp, state.model) === '%';
    return 'จริง ' + fmtN(bv, 2) + (pct ? '%' : '') + ' · <span class="' + (tv > bv ? 'up' : 'down') + '">' + fmtN(Math.abs(tv - bv), 2) + (pct ? '%' : '') + '</span>';
  }
  function insight(k) {
    var m = state.model;
    return leverInsight(k, state.inp, trialInp(), m, C(state.inp, m), C(trialInp(), m));
  }
  function lrowHtml(k) {
    var m = state.model, base = state.inp, ti = trialInp();
    var rng = leverRange(k, base, m), st = leverStep(k, base, m);
    var bv = n0(base[k]), tv = n0(ti[k]);
    var lo = Math.min(rng[0], tv), hi = Math.max(rng[1], tv);
    var op = hi > lo ? (bv - lo) / (hi - lo) : 0;
    var chg = state.trial.hasOwnProperty(k);
    var ins = state.active === k ? insight(k) : '';
    var val = fmtInputNum(tv);
    return '<div class="lrow' + (chg ? ' changed' : '') + '" data-row="' + k + '"><div class="lr-top"><span class="lr-name">' + esc(leverLabel(k, base, m)[1]) + '</span>' +
      '<span class="lr-val"><input data-lv="' + k + '" inputmode="decimal" size="' + Math.max(2, val.length) + '" value="' + esc(val) + '" aria-label="' + esc(leverLabel(k, base, m)[1]) + '"><span class="u">' + esc(leverUnit(k, base, m)) + '</span></span></div>' +
      '<div class="lr-was">' + wasTxt(k) + '</div><div class="lr-ctl"><button class="stp" data-act="step" data-k="' + k + '" data-dir="-1" aria-label="ลด">−</button>' +
      '<div class="sl"><span class="orig" style="left:calc(14px + (100% - 28px) * ' + op.toFixed(4) + ')"></span><input type="range" data-range="' + k + '" min="' + lo + '" max="' + hi + '" step="' + st + '" value="' + tv + '" aria-label="ปรับ ' + esc(leverLabel(k, base, m)[1]) + '"></div>' +
      '<button class="stp" data-act="step" data-k="' + k + '" data-dir="1" aria-label="เพิ่ม">+</button></div>' +
      (ins ? '<div class="lr-ins">' + ins + '</div>' : '') + '</div>';
  }
  function viewLab() {
    var keys = leverKeys();
    var inc = keys.filter(function (k) { return !VAR_KEYS[k] && COMMON_LEVERS.indexOf(k) < 0; });
    var vr = keys.filter(function (k) { return VAR_KEYS[k]; });
    var fx = keys.filter(function (k) { return COMMON_LEVERS.indexOf(k) >= 0; });
    function grp(t, ks) { return ks.length ? '<div class="lgroup"><h2>' + t + '</h2><div class="lrows">' + ks.map(lrowHtml).join('') + '</div></div>' : ''; }
    var right = hasTrial() ? '<button class="tb" data-act="reset">ล้าง</button>' : '';
    return bar('<button class="tb" data-act="home">' + ICON.back + 'เสร็จ</button>', 'ลองเปลี่ยนตัวเลข', state.isSample ? 'ร้านตัวอย่าง' : '', right) +
      '<main class="screen"><div class="lab-top"><div class="wrap" id="labp">' + labPanel() + '</div></div><div class="wrap">' +
      grp('รายได้', inc) + grp('ต้นทุนที่ขึ้นลงตามยอดขาย', vr) + grp('ค่าใช้จ่ายคงที่ต่อเดือน', fx) + '</div></main>';
  }
  function labUpdate(k, fromSlider) {
    var p = $('#labp'); if (p) { p.innerHTML = labPanel(); runAnim(p); }
    var row = $('.lrow[data-row="' + k + '"]');
    if (!row) return;
    row.classList.toggle('changed', state.trial.hasOwnProperty(k));
    var tv = n0(trialInp()[k]);
    var inp = $('input[data-lv]', row);
    if (inp && document.activeElement !== inp) { inp.value = fmtInputNum(tv); inp.size = Math.max(2, inp.value.length); }
    if (!fromSlider) { var r = $('input[type="range"]', row); if (r) { if (tv > +r.max) r.max = tv; if (tv < +r.min) r.min = tv; r.value = tv; } }
    $('.lr-was', row).innerHTML = wasTxt(k);
    var h = insight(k), box = $('.lr-ins', row);
    if (h && !box) row.insertAdjacentHTML('beforeend', '<div class="lr-ins">' + h + '</div>');
    else if (box) { if (h) box.innerHTML = h; else box.remove(); }
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
    if (row && !$('.lr-ins', row)) { var h = insight(k); if (h) row.insertAdjacentHTML('beforeend', '<div class="lr-ins">' + h + '</div>'); }
  }
  function setTrial(k, v) {
    var bv = n0(state.inp[k]);
    v = Math.round(v * 1e6) / 1e6;
    if (k === 'staffCount') v = Math.max(0, Math.round(v));
    if (v < 0) v = 0;
    if (leverUnit(k, state.inp, state.model) === '%' && k !== 'commissionPct') v = Math.min(100, v);
    if (Math.abs(v - bv) < 1e-9) delete state.trial[k]; else state.trial[k] = v;
  }

  /* ============================================================ RENDER */
  function render() {
    var v = state.view;
    app.innerHTML = v === 'start' ? viewStart() : v === 'wizard' ? viewWizard() : v === 'review' ? viewReview() : v === 'finding' ? viewFinding() : v === 'lab' ? viewLab() : v === 'ask' ? viewAsk() : v === 'points' ? viewPoints() : viewHome();
    runAnim(app);
    var foot = $('#foot');
    document.documentElement.style.setProperty('--foot-h', (foot ? foot.offsetHeight : 0) + 'px');
    save();
  }
  function go(view, top) { state.view = view; render(); if (top !== false) window.scrollTo(0, 0); }
  function toast(msg) {
    var o = $('.toast'); if (o) o.remove();
    var t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3200);
  }
  function refreshWizardLive() {
    var r = $('#rstrip'); if (r) { r.outerHTML = wizReceipt(); runAnim($('#rstrip')); }
    var steps = stepsFor(state.model), st = steps[state.step];
    var nb = $('#foot [data-act="next"]'); if (nb) nb.disabled = !stepValid(st);
    var sb = $('#foot [data-act="see"]'); if (sb) sb.disabled = !steps.every(stepValid);
    FIELDS.forEach(function (fd) { if (!fd.show) return; var node = $('.field[data-f="' + fd.k + '"]'); if (node) node.hidden = !fd.show(state.inp, state.model); });
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
    state.feeHelp = false; state.fh = { share: '', rate: '' };
    go(sample ? 'home' : 'wizard');
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
    if (!t) return;
    var a = t.getAttribute('data-act'), m = state.model, steps;
    switch (a) {
      case 'theme': {
        var nt = themeNow() === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nt);
        try { localStorage.setItem('lab-theme', nt); } catch (er) { /* ignore */ }
        t.innerHTML = nt === 'dark' ? ICON.sun : ICON.moon; break;
      }
      case 'model': chooseModel(t.getAttribute('data-m'), false); break;
      case 'sample-shop': chooseModel('unit', true); break;
      case 'to-start': go('start'); break;
      case 'next': steps = stepsFor(m); if (state.step < steps.length - 1) { state.step++; go('wizard'); } break;
      case 'prev':
        if (state.editing) go('review');
        else if (state.step > 0) { state.step--; go('wizard'); }
        else go('start');
        break;
      case 'see': if (stepsFor(m).every(stepValid)) { state.editing = false; state.trial = {}; go('home'); } break;
      case 'review': go('review'); break;
      case 'home': go('home'); break;
      case 'edit-step': state.step = +t.getAttribute('data-i'); state.editing = true; go('wizard'); break;
      case 'edit-field': {
        var fk = t.getAttribute('data-k');
        stepsFor(m).forEach(function (s, i) { if (s.f.indexOf(fk) >= 0) state.step = i; });
        state.editing = true; go('wizard');
        var el = $('#f-' + fk); if (el) el.focus();
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
      case 'finding': state.fid = t.getAttribute('data-f'); go('finding'); break;
      case 'lab': {
        var lk = t.getAttribute('data-k');
        state.active = lk || null; go('lab');
        if (lk) scrollToRow(lk);
        break;
      }
      case 'try': {
        var k3 = t.getAttribute('data-k'), v3 = t.getAttribute('data-v');
        if (v3 !== null && v3 !== '') {
          var st3 = leverStep(k3, state.inp, m), val = +v3;
          val = val >= n0(state.inp[k3]) ? Math.ceil(val / st3 - 1e-9) * st3 : Math.floor(val / st3 + 1e-9) * st3;
          if (k3 === 'ownerSalary' && n0(state.inp.ownerSalary) > 0) val = n0(state.inp.ownerSalary);
          setTrial(k3, val);
        }
        state.active = k3; go('lab'); scrollToRow(k3); break;
      }
      case 'step': {
        var k = t.getAttribute('data-k'), st = leverStep(k, state.inp, m);
        var nvv = Math.round((n0(trialInp()[k]) + st * +t.getAttribute('data-dir')) / st) * st;
        setActive(k); setTrial(k, nvv); labUpdate(k, false); break;
      }
      case 'reset': state.trial = {}; go('lab', false); break;
      case 'ask': {
        var L0 = askList(), first = 0;
        while (first < L0.length - 1 && state.answers[L0[first].qid]) first++;
        state.qidx = first; go('ask'); break;
      }
      case 'ask-restart': state.answers = {}; state.qidx = 0; go('ask'); break;
      case 'points': go('points'); break;
      case 'answer': {
        var q = t.getAttribute('data-q'), v = t.getAttribute('data-v');
        state.answers[q] = v;
        $$('.ask-ans button').forEach(function (bb) { bb.setAttribute('aria-pressed', String(bb === t)); });
        setTimeout(function () {
          var L1 = askList(), i = L1.map(function (x) { return x.qid; }).indexOf(q) + 1;
          while (i < L1.length && state.answers[L1[i].qid]) i++;
          if (i >= L1.length) { var un = L1.filter(function (x) { return !state.answers[x.qid]; })[0]; if (un) { state.qidx = L1.indexOf(un); go('ask'); } else go('points'); }
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
    var raw = el.value.replace(/[,\s]/g, '').replace(/[^\d.\-]/g, '');
    if (!el.getAttribute('data-neg')) raw = raw.replace(/-/g, '');
    if (raw === '' || raw === '-' || raw === '.') return null;
    var v = parseFloat(raw);
    return isFinite(v) ? v : null;
  }
  function onInput(e) {
    var el = e.target;
    if (el.hasAttribute('data-k')) {
      state.inp[el.getAttribute('data-k')] = parseInput(el);
      refreshWizardLive(); save();
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
    if (!el.hasAttribute || !el.hasAttribute('data-k')) return;
    var k = el.getAttribute('data-k'), v = state.inp[k];
    if (v !== null && v !== undefined) el.value = el.getAttribute('data-t') === 'money' ? Math.round(v).toLocaleString('th-TH') : String(v);
  }
  function onKey(e) {
    if (e.key !== 'Enter' || !e.target.hasAttribute) return;
    if (e.target.hasAttribute('data-k') && state.view === 'wizard') {
      var ins = $$('.qfields input[data-k]').filter(function (x) { return !x.closest('[hidden]'); });
      var i = ins.indexOf(e.target);
      if (i >= 0 && i < ins.length - 1) { ins[i + 1].focus(); e.preventDefault(); return; }
      var btn = $('#foot [data-act="next"]:not([disabled])') || $('#foot [data-act="see"]:not([disabled])');
      if (btn) { e.preventDefault(); btn.click(); }
    }
    if (e.target.hasAttribute('data-lv')) e.target.blur();
  }

  /* tooltip ของกราฟเงินสด */
  function onPointer(e) {
    var hit = e.target.closest && e.target.closest('.chart .hit');
    var chart = e.target.closest && e.target.closest('.chart');
    $$('.tip').forEach(function (x) { if (!chart || !chart.contains(x)) x.remove(); });
    $$('.chart .cross').forEach(function (c) { if (!chart || !chart.contains(c)) c.setAttribute('visibility', 'hidden'); });
    if (!hit) { if (chart) { var tp = $('.tip', chart); if (tp) tp.remove(); var cr = $('.cross', chart); if (cr) cr.setAttribute('visibility', 'hidden'); } return; }
    var i = +hit.getAttribute('data-i'), S = C(state.inp, state.model);
    var v = i === 0 ? S.cashStart : S.cash[i - 1].bal;
    var svg = $('svg', chart), vb = svg.viewBox.baseVal, rc = svg.getBoundingClientRect(), cb = chart.getBoundingClientRect();
    var hx = i === 0 ? +hit.getAttribute('x') : i === 12 ? +hit.getAttribute('x') + +hit.getAttribute('width') : +hit.getAttribute('x') + +hit.getAttribute('width') / 2;
    var px = hx / vb.width * rc.width + (rc.left - cb.left);
    var cross = $('.cross', chart); cross.setAttribute('x1', hx); cross.setAttribute('x2', hx); cross.setAttribute('visibility', 'visible');
    var tip = $('.tip', chart); if (!tip) { tip = document.createElement('div'); tip.className = 'tip'; chart.appendChild(tip); }
    tip.innerHTML = (i === 0 ? 'ตอนนี้' : 'สิ้น ' + monthLabel(i, true)) + ' · <b>' + fmtN(v) + '</b> บาท';
    var w = tip.offsetWidth;
    tip.style.left = Math.max(w / 2, Math.min(cb.width - w / 2, px)) + 'px'; tip.style.top = '14px';
  }

  function start(data) {
    app = document.getElementById('app');
    var r = data && data.model ? data : null;
    if (!r) { try { r = JSON.parse(sessionStorage.getItem('lab2') || 'null'); } catch (e) { r = null; } }
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
  window.__lab = { state: state, compute: compute, detect: detect, render: render, go: go };
  if (hot && hot.ready) hot.ready(start); else start(hot && hot.data ? hot.data : {});
})();
