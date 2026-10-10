/* RUNWAY — e-commerce screens */
(function (RW) {
  'use strict';
  var M = RW.Models.ecom, UI = RW.UI, F = RW.F, U = RW.U, h = UI.h;
  var CHN = M.CHN;

  M.headline = function (s) {
    var b = s.biz;
    var act = b.skus.filter(function (k) { return k.active; }).length;
    return b.product + ' · ' + (act ? act + ' สินค้าวางขาย · ลูกค้าสะสม ' + F.num(Math.round(b.customers)) + ' คน · เรตติ้ง ' + b.rating.toFixed(2) : 'กำลังพัฒนาสินค้าตัวแรก');
  };
  M.guide = [
    'สินค้าใหม่ต้องพัฒนาสูตร/ตัวอย่าง และขอ อย. ก่อนขาย (ยกเว้นเสื้อผ้า) — วางแผนล่วงหน้าหลายเดือน',
    'ความนิยมของสินค้าใหม่เป็นการเดิมพัน ยิ่งรู้จักลูกค้า (Insight) ยิ่งเดาแม่น',
    'สั่งผลิตต้องจ่ายมัดจำ 50% และรอ 2–14 สัปดาห์ สต็อกคือเงินสดที่จมอยู่ — สั่งมากได้ราคาต่อชิ้นถูก แต่เสี่ยงหมดอายุและเงินจม',
    'ของหมดสต็อก = เสียยอดขายและอันดับร้านในมาร์เก็ตเพลส ซึ่งโตตามยอดขายสะสมและรีวิว',
    'วันเมกะเซล 11.11 / 12.12 ยอดขายพุ่งหลายเท่า ต้องเตรียมสต็อกล่วงหน้าตาม lead time',
    'ครีเอทีฟโฆษณาเก่าลงทุกสัปดาห์ ต้องมีคนผลิตคอนเทนต์ใหม่ ไม่งั้นโฆษณาแพงขึ้นเรื่อยๆ',
    'ลูกค้าซื้อซ้ำคือกำไรที่แท้จริง — CRM/LINE OA และคุณภาพสินค้าทำให้คนกลับมา',
    'มาร์เก็ตเพลสคนเยอะแต่ค่าธรรมเนียมสูง เว็บไซต์ของตัวเองกำไรดีกว่าแต่ต้องพาคนมาเอง',
    'จด VAT แล้วราคาที่ลูกค้าจ่ายรวม VAT — ถ้าไม่ขึ้นราคา รายได้สุทธิหายไป 6.5%'
  ];
  M.snapshot = function (s) { return { orders: s.biz.lifetime.orders, cust: s.biz.customers }; };
  M.snapDiff = function (s, a, b) { return 'ออเดอร์ ' + F.num(b.orders - a.orders) + ' · ลูกค้าใหม่ ' + F.num(Math.round(b.cust - a.cust)); };
  M.milestones = function (s) {
    var b = s.biz;
    var orders = U.sum(b.stats, function (m) { return m.orders; }) + (b.mstats ? b.mstats.orders : 0);
    var openCh = ['market', 'social', 'web'].filter(function (k) { return b.ch[k].open; }).length;
    return [
      ['พัฒนาสินค้าตัวแรกและได้เลข อย./พร้อมขาย', b.skus.length > 0, 'products'],
      ['สั่งผลิตล็อตแรก', b.skus.some(function (k) { return k.sold > 0 || M.stock(k) > 0; }) || b.pos.length > 0, 'products'],
      ['ขายได้ 100 ออเดอร์', orders >= 100, 'channels'],
      ['เปิดช่องทางขายที่ 2', openCh >= 2, 'channels'],
      ['ROAS เกิน 3 เท่า', (s.kpi.roas || 0) > 3, 'marketing']
    ];
  };
  M.topMetric = function (s) { var mo = s.biz.stats.length ? s.biz.stats[s.biz.stats.length - 1] : null; return ['ยอดขาย/เดือน', F.m(s.kpi.revenueMonthly)]; };

  var ui = (M.ui = { tabs: [{ id: 'products', n: 'สินค้า & สต็อก' }, { id: 'channels', n: 'ช่องทางขาย & คลัง' }, { id: 'marketing', n: 'การตลาด' }], render: {}, acts: {} });

  ui.tiles = function (s) {
    var k = s.kpi;
    return UI.tile('ออเดอร์ 3 เดือน', F.num(k.orders3 || 0), 'AOV ' + F.b(k.aov || 0)) +
      UI.tile(UI.tip('ROAS', 'รายได้ ÷ ค่าโฆษณา ควรเกิน ~3 เท่าถึงจะคุ้มหลังหักต้นทุน'), k.roas ? k.roas.toFixed(1) + 'x' : '–', '', k.roas && k.roas < 1.5 ? 'crit' : k.roas > 3 ? 'good' : '') +
      UI.tile('สต็อก (มูลค่าทุน)', F.m(k.inventory || 0), k.invDays ? 'พอขาย ~' + Math.round(k.invDays) + ' วัน' : '', k.invDays > 150 ? 'warn' : '') +
      UI.tile('ซื้อซ้ำ', F.pct(k.repeatShare || 0, 0), 'ลูกค้า active ' + F.num(k.activeCustomers || 0));
  };

  ui.overviewExtra = function (s) {
    var hm = s.hist.monthly;
    return UI.panel('ออเดอร์และมูลค่าสต็อก', '<div class="grid g2"><div>' +
      UI.chart({ labels: hm.map(function (m) { return m.label; }), series: [{ name: 'ออเดอร์/เดือน', color: 'var(--s1)', data: hm.map(function (m) { return m.k.orders || 0; }), area: true }], fmt: F.k, tipFmt: F.num }) + '</div><div>' +
      UI.chart({ labels: hm.map(function (m) { return m.label; }), series: [{ name: 'มูลค่าสต็อก', color: 'var(--s2)', data: hm.map(function (m) { return m.k.inventory || 0; }), area: true }], fmt: F.k, tipFmt: F.m }) + '</div></div>');
  };

  ui.unitEconomics = function (s) {
    var k = s.kpi, b = s.biz;
    var mo = b.stats.length ? b.stats[b.stats.length - 1] : null;
    var last = s.hist.monthly.length ? s.hist.monthly[s.hist.monthly.length - 1] : null;
    var perOrder = function (acct) { return last && mo && mo.orders ? (last.pl[acct] || 0) / mo.orders : 0; };
    return '<div class="kv"><span>AOV (ยอดต่อออเดอร์)</span><span>' + F.b(k.aov || 0) + '</span>' +
      '<span>ต้นทุนสินค้า/ออเดอร์</span><span>' + F.b(perOrder('cogs_goods')) + '</span>' +
      '<span>ค่าธรรมเนียมแพลตฟอร์ม/ออเดอร์</span><span>' + F.b(perOrder('cogs_platform')) + '</span>' +
      '<span>ค่าส่ง+แพ็ก/ออเดอร์</span><span>' + F.b(perOrder('cogs_fulfil')) + '</span>' +
      '<span>ค่าโฆษณา/ออเดอร์</span><span>' + F.b(perOrder('mkt')) + '</span>' +
      '<span>' + UI.tip('CAC', 'ค่าการตลาดและทีมขาย ÷ ลูกค้าใหม่') + '</span><span>' + (k.cac ? F.b(k.cac) : '–') + '</span>' +
      '<span>LTV (กำไรขั้นต้นตลอดอายุลูกค้า)</span><span>' + F.b(k.ltv || 0) + '</span>' +
      '<span>ROAS</span><span>' + (k.roas ? k.roas.toFixed(2) + 'x' : '–') + '</span>' +
      '<span>' + UI.tip('Inventory days', 'สต็อกที่มีพอขายได้กี่วัน — ยิ่งมากยิ่งเงินจม') + '</span><span>' + (k.invDays ? Math.round(k.invDays) + ' วัน' : '–') + '</span>' +
      '<span>Stock-out (ออเดอร์ที่หลุดเพราะของหมด)</span><span>' + F.pct(k.stockout || 0, 0) + '</span></div>';
  };

  // ---------------- PRODUCTS ----------------
  ui.render.products = function (s) {
    var b = s.biz, c = M.CONCEPTS[b.concept];
    var head = '<div class="page-head"><div><h2>สินค้า & สต็อก</h2><p>สั่งผลิตต้องจ่ายมัดจำ 50% ล่วงหน้าและรอหลายสัปดาห์ สั่งน้อยไปของขาด สั่งมากไปเงินจมและหมดอายุ</p></div></div>';
    var rows = b.skus.filter(function (k) { return k.active; }).map(function (k) {
      var st = M.stock(k), inc = M.incoming(b, k.id), f = M.forecastWeekly(k);
      var cover = k.avg > 0.5 ? st / f : null;
      var form = UI.form['po_' + k.id] || (UI.form['po_' + k.id] = { qty: c.sup.local.moq, sup: 'local' });
      var unit = M.unitCost(s, k, form.sup, form.qty);
      var margin = 1 - unit / (k.price / (s.fin.vat.registered ? 1.07 : 1));
      return [
        '<b>' + h(k.n) + '</b><div class="tiny muted">คุณภาพ ' + Math.round(k.quality) + ' · ' + (k.appealSeen != null ? 'ความนิยม ' + (k.appealSeen > 1.1 ? 'สูง' : k.appealSeen > 0.85 ? 'ปานกลาง' : 'ต่ำ') + (k.tested && k.sold <= 50 ? ' (จากการทดสอบ)' : '') : 'ยังไม่รู้ความนิยม') + (k.retail ? ' · วางขายหน้าร้าน' : '') + '</div>' + (k.appealSeen == null ? '<div style="margin-top:4px">' + UI.researchBtn('adtest', k.id, 'ทดสอบตลาด') + '</div>' : ''),
        UI.numInput('pr_' + k.id, k.price, 'ePrice', [k.id], 10) + '<div class="tiny muted">ทุน ~' + F.b(k.cost) + ' · GM ~' + F.pct(margin, 0) + '</div>',
        '<span class="' + (st === 0 ? 'crit' : cover != null && cover < 3 ? 'warn' : '') + '">' + F.num(st) + '</span>' + (inc ? '<div class="tiny muted">กำลังมา ' + F.num(inc) + '</div>' : ''),
        k.avg.toFixed(1) + '<div class="tiny muted">' + (cover != null ? 'พอ ' + (cover > 99 ? '99+' : cover.toFixed(0)) + ' สป.' : '') + '</div>',
        '<div class="row" style="gap:4px;flex-wrap:nowrap">' + UI.numInput('poq_' + k.id, form.qty, 'poForm', [k.id, 'qty'], 50) + '<select data-act="poForm" data-a=\'["' + k.id + '","sup"]\' aria-label="โรงงาน">' + Object.keys(c.sup).map(function (x) { return '<option value="' + x + '"' + (x === form.sup ? ' selected' : '') + '>' + c.sup[x].n + '</option>'; }).join('') + '</select>' + UI.btn('สั่งผลิต', 'eOrder', [k.id], 'sm primary') + '</div><div class="tiny muted">@' + F.b(unit) + ' · รวม ' + F.m(unit * Math.max(form.qty, c.sup[form.sup].moq)) + ' · ขั้นต่ำ ' + F.num(c.sup[form.sup].moq) + ' · รอ ' + c.sup[form.sup].lead.join('–') + ' สป.</div>',
        '<label class="row small" style="gap:4px;flex-wrap:nowrap"><input type="checkbox" ' + (k.auto ? 'checked' : '') + ' data-act="eAuto" data-a=\'["' + k.id + '"]\'> อัตโนมัติ</label><div class="tiny muted">เก็บ ' + k.cover + ' สป.</div>',
        '<div class="row" style="gap:4px">' + UI.btn('เทขาย 50%', 'eClear', [k.id], 'sm') + UI.btn('เลิกขาย', 'eDisc', [k.id], 'sm danger') + '</div>'
      ];
    });
    var skus = UI.panel('สินค้าที่วางขาย', UI.table(['สินค้า', 'ราคาขาย', '#สต็อก', '#ขาย/สป.', 'สั่งผลิต', 'เติมสต็อก', ''], rows, { empty: 'ยังไม่มีสินค้าพร้อมขาย' }) + '<p class="tiny muted" style="margin-top:6px">ราคาที่แสดงคือราคาที่ลูกค้าจ่าย' + (s.fin.vat.registered ? ' (รวม VAT 7% แล้ว — รายได้สุทธิของคุณคือ ÷1.07)' : '') + ' · สั่งจำนวนมากต่อครั้งได้ราคาต่อหน่วยถูกลง · นำเข้าถูกกว่าแต่รอนาน ขึ้นกับค่าเงินบาท และเสี่ยงล็อตเสีย</p>');
    var pos = UI.panel('ใบสั่งผลิตที่รอรับ', UI.table(['สินค้า', '#จำนวน', '#มูลค่า', '#จ่ายมัดจำแล้ว', 'ถึง'], b.pos.map(function (p) { var k = b.skus.find(function (x) { return x.id === p.sku; }); return [h(k ? k.n : p.sku) + (p.auto ? ' <span class="tag">auto</span>' : ''), F.num(p.qty), F.b(p.total), F.b(p.deposit), RW.T.label(p.arrive)]; }), { empty: 'ไม่มี' }));
    var devRows = b.dev.map(function (d) { return [h(d.n), d.regLeft == null ? UI.meter(d.prog, d.need) + '<div class="tiny muted">พัฒนาสูตร/ตัวอย่าง ' + d.prog.toFixed(1) + '/' + d.need.toFixed(1) + '</div>' : 'รอ อย. อีก ' + d.regLeft + ' สัปดาห์', UI.btn('ยกเลิก', 'eCancelDev', [d.id], 'sm ghost')]; });
    var df = UI.form.dev || (UI.form.dev = { type: c.types[0][0], pos: 'mass' });
    var t = c.types.find(function (x) { return x[0] === df.type; });
    var devFee = Math.round((35000 + t[2] * 60) * M.POS[df.pos].dev / 1000) * 1000;
    var dev = UI.panel('พัฒนาสินค้าใหม่', UI.table(['สินค้า', 'สถานะ', ''], devRows, { empty: 'ไม่มีสินค้าที่กำลังพัฒนา' }) +
      '<div class="row" style="margin-top:10px;align-items:flex-end"><label class="field" for="dv_t">ประเภท<select id="dv_t" data-act="devForm" data-a=\'["type"]\'>' + c.types.map(function (x) { return '<option value="' + x[0] + '"' + (x[0] === df.type ? ' selected' : '') + '>' + x[1] + ' (~' + F.b(x[2]) + ')</option>'; }).join('') + '</select></label>' +
      '<label class="field" for="dv_p">ตำแหน่งสินค้า<select id="dv_p" data-act="devForm" data-a=\'["pos"]\'>' + Object.keys(M.POS).map(function (x) { return '<option value="' + x + '"' + (x === df.pos ? ' selected' : '') + '>' + M.POS[x].n + '</option>'; }).join('') + '</select></label>' + UI.btn('เริ่มพัฒนา (' + F.b(devFee) + ')', 'eDev', [], 'primary') + '</div>' +
      '<p class="tiny muted" style="margin-top:6px">ความนิยมของสินค้าใหม่ไม่แน่นอน — ยิ่งรู้จักลูกค้า (Insight ' + Math.round(b.insight) + '%) ยิ่งเดาถูก · ' + (c.reg[1] ? 'ต้องขอ อย. ' + c.reg[0] + '–' + c.reg[1] + ' สัปดาห์' : 'ไม่ต้องขอ อย.') + ' · ทีม R&D ช่วยให้เร็วขึ้นและคุณภาพดีขึ้น</p>' +
      '<div class="row" style="margin-top:6px"><span class="tiny muted">เพิ่ม Insight ด้วยงานวิจัย:</span>' + UI.researchBtn('panel') + '</div>');
    return head + skus + '<div class="grid g2" style="margin-top:14px">' + dev + pos + '</div>';
  };
  ui.acts.ePrice = function (id, v) { return M.act.setPrice(UI.s, id, v); };
  ui.acts.poForm = function (id, k, v) { UI.form['po_' + id][k] = k === 'qty' ? Number(v) : v; };
  ui.acts.eOrder = function (id) { var f = UI.form['po_' + id]; return M.act.order(UI.s, id, f.qty, f.sup); };
  ui.acts.eAuto = function (id, v) { var f = UI.form['po_' + id] || {}; return M.act.setAuto(UI.s, id, v, null, f.sup); };
  ui.acts.eClear = function (id) { return M.act.clearance(UI.s, id); };
  ui.acts.eDisc = function (id) {
    if (UI.sel.confirmDisc !== id) { UI.sel.confirmDisc = id; return { ok: false, msg: 'กดอีกครั้งเพื่อยืนยันเลิกขายสินค้านี้' }; }
    UI.sel.confirmDisc = null; return M.act.discontinue(UI.s, id);
  };
  ui.acts.devForm = function (k, v) { UI.form.dev[k] = v; };
  ui.acts.eDev = function () { var f = UI.form.dev; return M.act.develop(UI.s, f.type, f.pos); };
  ui.acts.eCancelDev = function (id) { return M.act.cancelDev(UI.s, id); };

  // ---------------- CHANNELS ----------------
  ui.render.channels = function (s) {
    var b = s.biz;
    var mo = b.stats.length ? b.stats[b.stats.length - 1] : null;
    var head = '<div class="page-head"><div><h2>ช่องทางขาย & คลังสินค้า</h2><p>แต่ละช่องทางกินค่าธรรมเนียมและโอนเงินช้าเร็วไม่เท่ากัน ยอดขายดี ≠ เงินเข้า</p></div></div>';
    var rows = Object.keys(CHN).map(function (k) {
      var ch = b.ch[k], d = CHN[k];
      var m = mo ? mo.byCh[k] : null;
      var status = ch.open ? UI.pill('เปิดอยู่', 'good') : UI.btn('เปิดช่องทาง', 'eOpen', [k], 'sm');
      var extra = k === 'market' || k === 'social' ? '<div class="tiny muted">อันดับร้าน ' + ch.rank.toFixed(1) + '/20 · รีวิว ' + F.num(Math.round(ch.reviews)) + '</div>' : k === 'web' && ch.open ? '<div class="tiny muted">SEO ' + Math.round(ch.seo) + '</div>' : k === 'retail' && ch.open ? '<div class="tiny muted">' + ch.stores + ' สาขา ' + UI.btn('ขยายเชน (฿400K)', 'eRetailExp', [], 'sm') + '</div>' : '';
      return ['<b>' + d.n + '</b><div class="tiny muted">' + d.d + '</div>', status + extra, m ? F.num(Math.round(m.t)) : '–', m ? F.num(m.o) : '–', m ? F.m(m.r) : '–', k === 'retail' ? '38% (ส่วนลดร้าน)' : F.pct(d.fee + d.pay + (k === 'market' ? b.feeAdj || 0 : 0), 0), d.payout ? d.payout + ' สป.' : 'ทันที'];
    });
    var chan = UI.panel('ช่องทางขาย (เดือนที่แล้ว)', UI.table(['ช่องทาง', 'สถานะ', '#ผู้เข้าชม', '#ออเดอร์', '#รายได้', '#ค่าธรรมเนียม', 'รับเงิน'], rows));
    var retail = b.ch.retail.open ? UI.panel('สินค้าในร้านค้าปลีก', UI.table(['สินค้า', ''], b.skus.filter(function (k) { return k.active; }).map(function (k) { return [h(k.n), k.retail ? UI.pill('วางขายแล้ว', 'good') : UI.btn('วางขาย (฿150K)', 'eListRetail', [k.id], 'sm')]; }))) : '';
    var nextMega = null;
    for (var i = 0; i <= 10; i++) { var m = M.isMega(s.time.w + i); if (m) { nextMega = [i, m[2]]; break; } }
    var camp = UI.panel('แคมเปญเมกะเซล (มาร์เก็ตเพลส)', '<p class="small ink2" style="margin:0 0 8px">วันลดราคาใหญ่ 3.3, 6.6, 9.9, 10.10, 11.11, 12.12 — ยอดขายพุ่งหลายเท่า แต่ต้องให้ส่วนลดและแพลตฟอร์มเก็บค่าธรรมเนียมเพิ่ม 3% สัปดาห์ก่อนแคมเปญคนจะรอซื้อ</p>' +
      UI.slider('ส่วนลดที่เข้าร่วม', Math.round(b.campaign.disc * 100), 0, 50, 5, 'eCampaign', [], 'pct') +
      '<div class="kv" style="margin-top:6px"><span>แคมเปญถัดไป</span><span>' + (nextMega ? nextMega[1] + (nextMega[0] ? ' (อีก ' + nextMega[0] + ' สัปดาห์)' : ' (สัปดาห์นี้!)') : '–') + '</span><span>ยอดขายคาดการณ์ช่วงแคมเปญ</span><span>×' + (1 + b.campaign.disc * 10).toFixed(1) + '</span></div>');
    var cap = M.fulfilCap(s);
    var ops = UI.panel('คลังสินค้าและบริการลูกค้า', '<div class="row" style="margin-bottom:8px">' + UI.segBtns([['self', 'แพ็กเอง'], ['3pl', 'จ้าง 3PL']], b.fulfil.mode, 'eFulfil') + '</div>' +
      '<div class="kv"><span>ความสามารถแพ็กส่ง/สัปดาห์</span><span>' + (b.fulfil.mode === '3pl' ? 'ไม่จำกัด (฿25/ออเดอร์)' : F.num(Math.round(cap))) + '</span><span>ออเดอร์ค้างส่ง</span><span class="' + (b.fulfil.backlog > 30 ? 'crit' : '') + '">' + Math.round(b.fulfil.backlog) + '</span><span>แชทค้างตอบ</span><span class="' + (b.chat.backlog > 200 ? 'warn' : '') + '">' + Math.round(b.chat.backlog) + '</span><span>เรตติ้งร้าน</span><span>' + b.rating.toFixed(2) + ' ★</span><span>ตีกลับ (COD ไม่รับของ) เดือนที่แล้ว</span><span>' + (mo ? F.num(mo.rto || 0) : '–') + '</span><span>สินค้าหมดอายุทิ้งเดือนที่แล้ว</span><span>' + (mo ? F.num(mo.expired || 0) + ' ชิ้น' : '–') + '</span></div>' +
      '<label class="row small" style="margin-top:8px"><input type="checkbox" ' + (b.cod ? 'checked' : '') + ' data-act="eCOD"> รับเก็บเงินปลายทาง (COD) บนเว็บไซต์ — ขายง่ายขึ้นแต่ของตีกลับ</label>' +
      '<label class="field" for="fs" style="margin-top:8px">ส่งฟรีเมื่อซื้อครบ (เว็บไซต์)' + UI.numInput('fs', b.freeShip, 'eFreeShip', [], 50) + '</label>');
    return head + chan + (retail ? '<div style="margin-top:14px">' + retail + '</div>' : '') + '<div class="grid g2" style="margin-top:14px">' + camp + ops + '</div>';
  };
  ui.acts.eOpen = function (k) { return M.act.openChannel(UI.s, k); };
  ui.acts.eRetailExp = function () { return M.act.expandRetail(UI.s); };
  ui.acts.eListRetail = function (id) { return M.act.listRetail(UI.s, id); };
  ui.acts.eCampaign = function (v) { return M.act.setCampaign(UI.s, v / 100); };
  ui.acts.eFulfil = function (m) { return M.act.setFulfil(UI.s, m); };
  ui.acts.eCOD = function () { return M.act.toggleCOD(UI.s); };
  ui.acts.eFreeShip = function (v) { return M.act.setFreeShip(UI.s, v); };

  // ---------------- MARKETING ----------------
  ui.render.marketing = function (s) {
    var b = s.biz;
    var mo = b.stats.length ? b.stats[b.stats.length - 1] : null;
    var weekly = b.ch.market.ads + b.ch.social.ads + b.ch.web.ads;
    var head = '<div class="page-head"><div><h2>การตลาด</h2><p>โฆษณาซื้อยอดขายได้ แต่ครีเอทีฟเก่าเร็ว ต้นทุนต่อคลิกแพงขึ้นเมื่ออัดงบ — ลูกค้าที่ซื้อซ้ำคือกำไรที่แท้จริง</p></div>' + UI.pill('โฆษณา ' + F.m(weekly) + '/สัปดาห์', 'accent') + '</div>';
    var ads = UI.panel('งบโฆษณา (บาท/สัปดาห์)', ['market', 'social', 'web'].map(function (k) {
      var lbl = { market: 'โฆษณาในมาร์เก็ตเพลส', social: 'โฆษณาวิดีโอสั้น/ไลฟ์', web: 'Social ads พาเข้าเว็บไซต์' }[k];
      return '<div class="row between" style="padding:6px 0;border-bottom:1px solid var(--line2)"><span>' + lbl + (b.ch[k].open ? '' : ' <span class="tiny muted">(ยังไม่เปิดช่องทาง)</span>') + '</span>' + UI.numInput('ad_' + k, b.ch[k].ads, 'eAds', [k], 5000) + '</div>';
    }).join('') +
      '<div class="stack" style="margin-top:10px">' + UI.bar(UI.tip('ความสดของครีเอทีฟ', 'คลิป/ภาพโฆษณาที่คนเห็นซ้ำจะได้ผลลดลงทุกสัปดาห์ ต้องผลิตใหม่ตลอด'), b.creative * 100, 100, b.creative < 0.35 ? 'crit' : b.creative < 0.6 ? 'warn' : 'good', F.pct(b.creative, 0)) + UI.bar('แบรนด์', b.brand, 100, '', Math.round(b.brand)) + '</div>' +
      '<div class="kv" style="margin-top:8px"><span>ค่าโฆษณาเดือนที่แล้ว</span><span>' + F.m(mo ? mo.adSpend : 0) + '</span><span>ROAS</span><span>' + (s.kpi.roas ? s.kpi.roas.toFixed(2) + 'x' : '–') + '</span><span>ลูกค้าใหม่เดือนที่แล้ว</span><span>' + F.num(Math.round(mo ? mo.newCust : 0)) + '</span></div>');
    var kol = UI.panel('อินฟลูเอนเซอร์ & PR', '<div class="stack">' +
      '<div class="row between"><span><b>ไมโครอินฟลูเอนเซอร์ 10 คน</b><div class="tiny muted">ฐานแฟนเล็กแต่เชื่อถือสูง กระแส 3 สัปดาห์</div></span>' + UI.btn('฿60,000', 'eKol', ['micro'], 'sm') + '</div>' +
      '<div class="row between"><span><b>อินฟลูเอนเซอร์ชื่อดัง</b><div class="tiny muted">ยอดขายพุ่ง 4 สัปดาห์ แบรนด์โต</div></span>' + UI.btn('฿350,000', 'eKol', ['macro'], 'sm') + '</div>' +
      '<div class="row between"><span><b>พรีเซนเตอร์ดารา</b><div class="tiny muted">แรงมาก แต่ถ้าดารามีข่าวฉาว แบรนด์โดนด้วย</div></span>' + UI.btn('฿1,500,000', 'eKol', ['celeb'], 'sm') + '</div>' +
      '</div>');
    var crm = UI.panel('ลูกค้าเก่า & Affiliate', '<div class="kv"><span>ลูกค้าสะสม</span><span>' + F.num(Math.round(b.customers)) + '</span><span>ลูกค้าที่ยัง active</span><span>' + F.num(Math.round(b.active)) + '</span><span>สัดส่วนออเดอร์ซื้อซ้ำ</span><span>' + F.pct(s.kpi.repeatShare || 0, 0) + '</span><span>Insight ลูกค้า</span><span>' + Math.round(b.insight) + '%</span></div>' +
      '<label class="row small" style="margin-top:8px"><input type="checkbox" ' + (b.crm ? 'checked' : '') + ' data-act="eCRM"> ระบบ CRM / LINE OA (฿9,000+/เดือน) — ลูกค้าเก่าซื้อซ้ำเพิ่ม ~35%</label>' +
      (b.ch.social.open ? UI.slider('ค่าคอมฯ ครีเอเตอร์ (affiliate)', Math.round(b.ch.social.affiliate * 100), 0, 30, 1, 'eAff', [], 'pct') : ''));
    return head + '<div class="grid g2">' + ads + '<div class="stack">' + kol + crm + '</div></div>';
  };
  ui.acts.eAds = function (k, v) { return M.act.setAds(UI.s, k, v); };
  ui.acts.eKol = function (t) { return M.act.kol(UI.s, t); };
  ui.acts.eCRM = function () { return M.act.toggleCRM(UI.s); };
  ui.acts.eAff = function (v) { return M.act.setAffiliate(UI.s, v / 100); };
})(globalThis.RW = globalThis.RW || {});
