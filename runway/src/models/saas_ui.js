/* RUNWAY — SaaS screens */
(function (RW) {
  'use strict';
  var M = RW.Models.saas, UI = RW.UI, F = RW.F, U = RW.U, h = UI.h;
  var SEGS = M.SEGS, SEG = M.SEG, FEAT = M.FEAT;

  M.sampleName = 'Thaiflow';
  M.guide = [
    'ต้องมี MVP (Core ระดับ 1) ก่อนจึงขายได้ — ช่วงนี้อย่าเพิ่งเผาเงินกับโฆษณา',
    'ความต้องการจริงของแต่ละกลุ่มลูกค้าซ่อนอยู่ ต้องใช้เวลา "คุยกับลูกค้า" (Discovery) เพื่อรู้ว่าควรสร้างฟีเจอร์อะไร สร้างผิดคือเผาเงิน',
    'ลูกค้า 20 รายแรกของแต่ละกลุ่มซื้อเพราะเชื่อในตัวคุณ (early adopters) — ขายตรงด้วยตัวเองได้ผลที่สุดช่วงแรก',
    'Product fit ต่ำ = ปิดการขายยากและลูกค้าหนี ตั้งราคาใกล้ "ยอมจ่าย" ที่ Discovery บอก',
    'Micro/SME ซื้อเองผ่านเว็บ (self-serve) · Mid-market และ Enterprise ต้องมีทีมขาย รอบการขายยาวหลายเดือน และองค์กรใหญ่ต้องการ Security/Enterprise features',
    'ลูกค้าองค์กรต้องการงาน implementation ที่กินเวลาวิศวกร ถ้าค้างนาน ลูกค้าจะไม่ต่อสัญญา',
    'เร่งปล่อยฟีเจอร์ (Move fast) สะสมบั๊กและหนี้ทางเทคนิค ซึ่งทำให้ช้าลงและระบบล่มในอนาคต',
    'ส่วนลดรายปีดึงเงินสดเข้ามาก่อน (รายได้รับล่วงหน้า) — ช่วยยืด runway ได้มาก',
    'วัดทุกช่องทางด้วย CAC เทียบ LTV — ช่องทางที่ LTV:CAC < 1 คือการซื้อลูกค้าแบบขาดทุน',
    'ตลาดไทยมีเพดาน การโตระดับ Series B+ มักต้องขยายไปเวียดนาม/อินโดนีเซีย (ต้องมีฟีเจอร์หลายภาษา)'
  ];
  M.concepts = function () { return Object.keys(M.CONCEPTS).map(function (k) { return { id: k, n: M.CONCEPTS[k].n, d: M.CONCEPTS[k].d }; }); };
  M.headline = function (s) {
    var b = s.biz;
    return b.product + ' · ' + (b.launched ? 'เปิดขายมา ' + Math.round((s.time.w - b.launchW) / 4.33) + ' เดือน · ลูกค้า ' + F.num(M.totalCustomers(b)) + ' ราย' : 'กำลังสร้าง MVP');
  };
  M.topMetric = function (s) { var hm = s.hist.monthly, p = hm.length >= 2 ? hm[hm.length - 2].k.mrr : 0; return ['MRR', F.m(s.kpi.mrr || 0), p > 0 ? (s.kpi.mrr || 0) / p - 1 : null]; };
  M.snapshot = function (s) { return { cust: M.totalCustomers(s.biz), mrr: M.mrr(s.biz), life: s.biz.lifetime.customers }; };
  M.snapDiff = function (s, a, b) {
    var won = b.life - a.life, lost = won - (b.cust - a.cust);
    return 'ลูกค้าใหม่ +' + won + (lost > 0 ? ' / ยกเลิก −' + lost : '') + ' · MRR ' + (b.mrr - a.mrr >= 0 ? '+' : '') + F.m(b.mrr - a.mrr);
  };
  M.milestones = function (s) {
    var b = s.biz;
    var bestDisc = Math.max.apply(null, SEGS.map(function (k) { return b.segs[k].disc; }));
    return [
      ['สร้าง MVP (Core ระดับ 1) ให้เสร็จ', b.launched, 'product'],
      ['คุยกับลูกค้าจนเข้าใจกลุ่มเป้าหมาย (Discovery ≥ 40% ในกลุ่มใดกลุ่มหนึ่ง)', bestDisc >= 40, 'market'],
      ['ได้ลูกค้าจ่ายเงิน 10 ราย', M.totalCustomers(b) >= 10, 'growth'],
      ['MRR ถึง ฿50,000', (s.kpi.mrr || 0) >= 50000, 'growth'],
      ['LTV:CAC มากกว่า 3 เท่า', (s.kpi.ltvCac || 0) > 3, 'growth']
    ];
  };

  var ui = (M.ui = { tabs: [{ id: 'product', n: 'สินค้า & วิศวกรรม' }, { id: 'market', n: 'ลูกค้า & ราคา' }, { id: 'growth', n: 'การตลาด & ขาย' }], render: {}, acts: {} });

  ui.tiles = function (s) {
    var k = s.kpi;
    return UI.tile(UI.tip('MRR', 'Monthly Recurring Revenue — รายได้ประจำต่อเดือนจากการสมัครสมาชิก'), F.m(k.mrr), 'ARR ' + F.m(k.arr)) +
      UI.tile('ลูกค้า', F.num(k.customers), k.logoChurn ? 'ยกเลิก ' + F.pct(k.logoChurn) + '/เดือน' : '', k.logoChurn > 0.05 ? 'warn' : '') +
      UI.tile(UI.tip('NRR', 'Net Revenue Retention — รายได้จากลูกค้าเดิมเทียบปีก่อน (รวมขยายและหักยกเลิก) >100% = ฐานลูกค้าเดิมโตเอง'), k.mrr > 20000 && s.hist.monthly.length > 2 ? F.pct(k.nrr, 0) : '–', k.mrr > 20000 ? '' : 'ฐานลูกค้ายังเล็กเกินจะวัด', k.mrr > 20000 && k.nrr < 0.85 ? 'warn' : k.nrr > 1.05 && k.mrr > 20000 ? 'good' : '') +
      UI.tile(UI.tip('LTV : CAC', 'มูลค่าตลอดอายุลูกค้า ÷ ต้นทุนหาลูกค้าหนึ่งราย ควรมากกว่า 3'), k.ltvCac ? k.ltvCac.toFixed(1) + 'x' : '–', k.cac ? 'CAC ' + F.m(k.cac) : '', k.ltvCac && k.ltvCac < 1 ? 'crit' : k.ltvCac > 3 ? 'good' : '');
  };

  ui.overviewExtra = function (s) {
    var hm = s.hist.monthly;
    var labels = hm.map(function (m) { return m.label; });
    return UI.panel('MRR และจำนวนลูกค้า', '<div class="grid g2"><div>' +
      UI.chart({ labels: labels, series: [{ name: 'MRR', color: 'var(--s1)', data: hm.map(function (m) { return m.k.mrr || 0; }), area: true }], fmt: F.k, tipFmt: F.m, title: 'MRR' }) + '</div><div>' +
      UI.chart({ labels: labels, series: SEGS.map(function (k, i) { return { name: SEG[k].s, color: ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)'][i], data: hm.map(function (m) { return m.k.seg ? m.k.seg[i] : 0; }) }; }), fmt: F.k, tipFmt: F.num, title: 'ลูกค้าแยกกลุ่ม' }) +
      '</div></div>');
  };

  ui.unitEconomics = function (s) {
    var k = s.kpi, b = s.biz;
    return '<div class="kv">' +
      '<span>ARPA (รายได้เฉลี่ย/ลูกค้า/เดือน)</span><span>' + F.b(k.arpa) + '</span>' +
      '<span>' + UI.tip('CAC', 'ค่าการตลาด + ค่าคอมมิชชัน + เงินเดือนฝ่ายขายและการตลาด 3 เดือนล่าสุด ÷ ลูกค้าใหม่') + '</span><span>' + (k.cac ? F.b(k.cac) : '–') + '</span>' +
      '<span>LTV</span><span>' + F.b(k.ltv) + '</span>' +
      '<span>LTV : CAC</span><span>' + (k.ltvCac ? k.ltvCac.toFixed(2) + 'x' : '–') + '</span>' +
      '<span>' + UI.tip('CAC payback', 'กี่เดือนกว่ากำไรขั้นต้นจากลูกค้าหนึ่งรายจะคุ้มต้นทุนหามา') + '</span><span>' + (k.payback ? k.payback.toFixed(1) + ' เดือน' : '–') + '</span>' +
      '<span>Logo churn / เดือน</span><span>' + F.pct(k.logoChurn) + '</span>' +
      '<span>NRR (annualized)</span><span>' + F.pct(k.nrr, 0) + '</span>' +
      '<span>' + UI.tip('Burn multiple', 'Net burn ÷ ARR ใหม่ที่ได้ — ต่ำกว่า 1.5 ดีมาก เกิน 3 คือเผาเงินไม่คุ้ม') + '</span><span>' + (k.burnMultiple > 50 ? '∞' : k.burnMultiple ? k.burnMultiple.toFixed(1) + 'x' : '–') + '</span>' +
      '<span>ค่าเซิร์ฟเวอร์เดือนล่าสุด</span><span>' + F.b(b.lastHost || 0) + '</span>' +
      '</div>';
  };

  // ---------------- PRODUCT ----------------
  ui.render.product = function (s) {
    var b = s.biz;
    var pts = M.devPoints(s);
    var a = b.alloc;
    var head = '<div class="page-head"><div><h2>' + h(b.product) + '</h2><p>' + (b.launched ? 'เปิดขายแล้ว — ทุกฟีเจอร์ที่ปล่อยเพิ่มบั๊กและหนี้ทางเทคนิค ยิ่งเร่งยิ่งต้องจ่ายคืนทีหลัง' : 'ยังไม่มีสินค้าให้ขาย — สร้าง Core ระดับ 1 (MVP) ให้เสร็จก่อน') + '</p></div>' + (b.launched ? UI.pill('Live', 'good') : UI.pill('Pre-launch', 'warn')) + '</div>';
    var eng = UI.panel('กำลังวิศวกรรม', '<div class="kv" style="margin-bottom:10px"><span>' + UI.tip('กำลังพัฒนา', 'หน่วยเป็น dev-week: งานของวิศวกรฝีมือกลางๆ 1 คน 1 สัปดาห์ หลังหักผลของหนี้ทางเทคนิคและโหมดการทำงาน') + '</span><span>' + pts.toFixed(2) + ' dev-week/สัปดาห์</span><span>วิศวกร</span><span>' + RW.Team.active(s).filter(function (e) { return e.role === 'eng'; }).length + ' คน + คุณ ' + (s.founder.focus.build || 0) + '% ของเวลา</span><span>' + UI.tip('งาน Implementation ค้าง', 'งานติดตั้ง/เชื่อมระบบให้ลูกค้าองค์กรใหม่ — กินเวลาวิศวกรก่อนงานพัฒนาฟีเจอร์') + '</span><span class="' + (b.impl > 20 ? 'warn' : '') + '">' + b.impl.toFixed(1) + ' dev-weeks</span></div>' +
      UI.slider('พัฒนาฟีเจอร์ใหม่', a.feat, 0, 100, 5, 'sAlloc', ['feat'], 'pct') +
      UI.slider('แก้บั๊ก/ลดหนี้เทคนิค', a.quality, 0, 100, 5, 'sAlloc', ['quality'], 'pct') +
      UI.slider('ความเสถียร/Infra', a.infra, 0, 100, 5, 'sAlloc', ['infra'], 'pct') +
      '<div class="row" style="margin-top:8px"><span class="small ink2">โหมดการปล่อยงาน</span>' + UI.segBtns([['fast', 'Move fast (เร็ว +20% บั๊กเยอะ)'], ['balanced', 'สมดุล'], ['careful', 'รอบคอบ (ช้า บั๊กน้อย)']], b.ship, 'sShip') + '</div>');
    var q = UI.panel('คุณภาพระบบ', '<div class="stack">' +
      UI.bar('บั๊กสะสม', b.bugs, 100, b.bugs > 50 ? 'crit' : b.bugs > 25 ? 'warn' : 'good') +
      UI.bar(UI.tip('หนี้ทางเทคนิค', 'โค้ดที่เขียนแบบรีบ — ทำให้ทุกอย่างช้าลงและล่มบ่อย'), b.debt, 100, b.debt > 55 ? 'crit' : b.debt > 30 ? 'warn' : 'good') +
      UI.bar('ความเสถียรของ Infra', b.reliability, 100, b.reliability < 30 ? 'warn' : 'good') +
      UI.bar('ความปลอดภัย', b.security, 100, b.security < 25 ? 'warn' : 'good') +
      '<div class="kv"><span>Uptime 90 วัน</span><span class="' + (b.uptime < 0.995 ? 'crit' : b.uptime < 0.999 ? 'warn' : 'good') + '">' + (b.uptime * 100).toFixed(2) + '%</span><span>เหตุระบบล่ม 90 วัน</span><span>' + b.outages.length + ' ครั้ง</span><span>ความเร็วพัฒนาลดลงจากหนี้เทคนิค</span><span>' + F.pct(b.debt / 180, 0) + '</span></div></div>');
    var parallel = Math.max(1, Math.floor((RW.Team.active(s).filter(function (e) { return e.role === 'eng'; }).length + (s.founder.focus.build > 10 ? 1 : 0)) / 3) + 1);
    var featPts = pts * a.feat / 100;
    var rm = b.roadmap.map(function (it, i) {
      var f = FEAT[it.f], lvl = b.feats[it.f], cost = f.costs[lvl];
      var share = i < parallel ? featPts / Math.min(parallel, b.roadmap.length) : 0;
      var eta = share > 0 ? Math.ceil((cost - it.prog) / Math.min(share, cost / (2 + lvl))) : null;
      var blocked = !b.launched && it.f !== 'core';
      return [(blocked ? UI.pill('รอ MVP', 'warn') + ' ' : i < parallel ? UI.pill('กำลังทำ', 'accent') + ' ' : '') + '<b>' + f.n + '</b> → ระดับ ' + (lvl + 1), '<div style="min-width:120px">' + UI.meter(it.prog, cost) + '<div class="tiny muted">' + it.prog.toFixed(1) + '/' + cost + ' dev-weeks</div></div>', eta ? '~' + eta + ' สัปดาห์' : 'รอคิว',
        '<div class="row" style="gap:4px;flex-wrap:nowrap">' + UI.btn('↑', 'sMove', [i, -1], 'sm') + UI.btn('↓', 'sMove', [i, 1], 'sm') + UI.btn('ลบ', 'sRemove', [i], 'sm danger') + '</div>'];
    });
    var roadmap = UI.panel('Roadmap', UI.table(['งาน', 'ความคืบหน้า', '#ETA', ''], rm, { empty: 'Roadmap ว่าง — เพิ่มงานจากรายการด้านล่าง' }) + '<p class="tiny muted" style="margin-top:6px">ทำพร้อมกันได้ ' + parallel + ' งาน (เพิ่มเมื่อมีวิศวกรมากขึ้น) · แต่ละงานมีเวลาขั้นต่ำ เอาคนมาอัดเพิ่มไม่ได้เร็วขึ้นเสมอไป</p>');
    var rows = M.FKEYS.map(function (fk) {
      var f = FEAT[fk], lvl = b.feats[fk], max = f.costs.length;
      var queued = b.roadmap.some(function (r) { return r.f === fk; });
      var who = SEGS.filter(function (sg) { var n = b.segs[sg].need[fk]; return n && b.segs[sg].disc >= 30 && n.w > 0.08; }).map(function (sg) { return SEG[sg].s; });
      return ['<b>' + f.n + '</b><div class="tiny muted">' + f.d + '</div>', '<span class="tnum">' + lvl + '/' + max + '</span>', lvl < max ? f.costs[lvl] + ' dw' : '–', who.length ? who.map(function (w) { return UI.pill(w, 'accent'); }).join(' ') : '<span class="tiny muted">' + (SEGS.some(function (sg) { return b.segs[sg].disc < 30; }) ? 'ต้อง Discovery เพิ่ม' : '–') + '</span>',
        lvl < max && !queued ? UI.btn('+ Roadmap', 'sAdd', [fk], 'sm') : queued ? UI.pill('ใน roadmap') : UI.pill('สูงสุด', 'good')];
    });
    var feats = UI.panel('ฟีเจอร์ทั้งหมด', UI.table(['ฟีเจอร์', '#ระดับ', '#งานขั้นถัดไป', 'กลุ่มที่ให้ความสำคัญ (จาก Discovery)', ''], rows));
    return head + '<div class="grid g2" style="margin-bottom:14px">' + eng + q + '</div>' + roadmap + '<div style="margin-top:14px">' + feats + '</div>';
  };
  ui.acts.sAlloc = function (k, v) { return M.act.setAlloc(UI.s, k, v); };
  ui.acts.sShip = function (m) { return M.act.setShip(UI.s, m); };
  ui.acts.sAdd = function (f) { return M.act.addRoadmap(UI.s, f); };
  ui.acts.sRemove = function (i) { return M.act.removeRoadmap(UI.s, i); };
  ui.acts.sMove = function (i, d) { return M.act.moveRoadmap(UI.s, i, d); };

  // ---------------- MARKET ----------------
  ui.render.market = function (s) {
    var b = s.biz;
    var head = '<div class="page-head"><div><h2>ลูกค้า & ราคา</h2><p>สี่กลุ่มลูกค้าต้องการคนละอย่าง จ่ายไม่เท่ากัน และซื้อคนละวิธี ความต้องการจริงของแต่ละกลุ่มจะรู้ได้จากการคุยกับลูกค้า (Discovery) เท่านั้น</p></div></div>';
    var rows = SEGS.map(function (k) {
      var sg = b.segs[k], g = SEG[k];
      var v = M.value(s, k);
      var wtpKnown = sg.disc >= 40 || sg.priceKnown;
      return [
        '<label class="row" style="gap:6px;flex-wrap:nowrap"><input type="checkbox" ' + (sg.on ? 'checked' : '') + ' data-act="sToggleSeg" data-a=\'["' + k + '"]\'><b>' + g.s + '</b></label><div class="tiny muted">' + g.n + '</div>',
        F.num(M.customers(b, k)), F.m(M.segMRR(b, k)),
        UI.numInput('pr_' + k, sg.price, 'sPrice', [k], k === 'ent' ? 100000 : 50) + '<div class="tiny muted">' + (k === 'ent' ? 'ต่อปี/สัญญา' : 'ต่อเดือน') + (wtpKnown ? ' · ลูกค้ายอมจ่าย ~' + F.m(M.wtp(s, k)) : '') + '</div>',
        '<div style="min-width:80px">' + UI.meter(v * 100, 100, v < 0.4 ? 'crit' : v < 0.7 ? 'warn' : 'good') + '<div class="tiny muted">' + F.pct(v, 0) + '</div></div>',
        sg.churnRate != null && M.customers(b, k) > 0 ? F.pct(sg.churnRate, 1) : '–',
        g.motions.length > 1 ? UI.segBtns(g.motions.map(function (m) { return [m, { self: 'Self-serve', inside: 'Inside sales', field: 'Field sales' }[m]]; }), sg.motion, 'sMotion', [k]) : { self: 'Self-serve', inside: 'Inside sales', field: 'Field sales' }[g.motions[0]],
        '<div style="min-width:70px">' + UI.meter(sg.disc, 100) + '<div class="tiny muted">' + Math.round(sg.disc) + '%</div></div>'
      ];
    });
    var segs = UI.panel('กลุ่มลูกค้าเป้าหมาย', UI.table(['กลุ่ม (ติ๊ก = ทำตลาด)', '#ลูกค้า', '#MRR', 'ราคา', UI.tip('Product fit', 'สินค้าตอบโจทย์กลุ่มนี้แค่ไหน (ฟีเจอร์ × คุณภาพ) มีผลต่อการปิดการขายและการยกเลิก'), '#Churn/ด.', 'วิธีขาย', 'Discovery'], rows) +
      '<p class="tiny muted" style="margin-top:6px">เปลี่ยนราคามีผลกับลูกค้าใหม่เท่านั้น (ลูกค้าเดิมคงราคาเดิม) · Enterprise ต้องมีฟีเจอร์ Enterprise ≥2 และ Security ≥2 · Self-serve ไม่ต้องใช้ทีมขาย แต่ลูกค้าใหญ่ซื้อผ่านพนักงานขายเท่านั้น</p>');
    // discovery
    var t = b.discTarget;
    var disc = UI.panel('Discovery — สิ่งที่ลูกค้าต้องการจริงๆ', '<div class="row" style="margin-bottom:8px"><span class="small ink2">โฟกัสการสัมภาษณ์ลูกค้า:</span>' + UI.segBtns(SEGS.map(function (k) { return [k, SEG[k].s]; }), t, 'sDiscTarget') + '</div>' +
      '<p class="small ink2" style="margin:0 0 8px">ความเร็วขึ้นกับเวลาที่คุณใช้ "คุยกับลูกค้า" + PM + CSM · ลูกค้าที่ใช้งานอยู่ก็ให้ feedback</p>' +
      '<div class="row" style="margin-bottom:10px"><span class="small ink2">หรือจ้างวิจัยกลุ่ม ' + SEG[t].s + ':</span>' + UI.researchBtn('interviews', t) + UI.researchBtn('pricing', t, 'ศึกษาความเต็มใจจ่าย') + '</div>' +
      '<div class="grid g2">' + SEGS.map(function (k) {
        var sg = b.segs[k];
        var needs = Object.keys(sg.need).map(function (f) { return { f: f, w: sg.need[f].w, lvl: sg.need[f].lvl }; }).sort(function (x, y) { return y.w - x.w; });
        var body;
        if (sg.disc < 15) body = '<div class="empty">ยังไม่รู้อะไรเลย — สัมภาษณ์ลูกค้ากลุ่มนี้ก่อน</div>';
        else body = needs.map(function (n, i) {
          var showW = sg.disc >= 30, showL = sg.disc >= 60;
          var rank = sg.disc < 30 ? (i < 2 ? 'สำคัญมาก' : '?') : null;
          if (sg.disc < 30 && i >= 2) return '';
          var have = b.feats[n.f];
          var ok = have >= n.lvl;
          return '<div class="row between small" style="padding:3px 0;border-bottom:1px solid var(--line2)"><span>' + FEAT[n.f].n + '</span><span class="row" style="gap:6px">' + (showW ? UI.pill(n.w > 0.18 ? 'สำคัญมาก' : n.w > 0.08 ? 'สำคัญ' : 'มีก็ดี', n.w > 0.18 ? 'accent' : '') : UI.pill(rank, 'accent')) + (showL ? '<span class="' + (ok ? 'good' : 'warn') + '">ต้องการระดับ ' + n.lvl + (ok ? ' ✓' : ' (มี ' + have + ')') + '</span>' : '') + '</span></div>';
        }).join('') + (sg.disc < 60 ? '<div class="tiny muted" style="margin-top:4px">Discovery ' + (sg.disc < 30 ? '≥30% เพื่อเห็นลำดับความสำคัญทั้งหมด' : '≥60% เพื่อรู้ระดับที่ต้องการ') + '</div>' : '');
        return '<div class="panel" style="padding:10px 12px"><h3 style="margin-bottom:6px"><span>' + SEG[k].s + '</span><small>' + Math.round(sg.disc) + '%</small></h3>' + body + '</div>';
      }).join('') + '</div>');
    var pricing = UI.panel('นโยบายราคาและส่วนลด',
      UI.slider('ส่วนลดเมื่อจ่ายรายปี', Math.round(b.annualDiscount * 100), 0, 40, 5, 'sAnnual', [], 'pct') +
      '<p class="tiny muted" style="margin:-2px 0 8px">ลูกค้าเลือกจ่ายรายปี ~' + F.pct(M.annualShare(b, 'sme'), 0) + ' — ได้เงินสดล่วงหน้าทั้งปีและยกเลิกยากขึ้น แต่รายได้ต่อรายลดลง</p>' +
      UI.slider('ส่วนลดสูงสุดที่ฝ่ายขายให้ได้', Math.round(b.maxDiscount * 100), 0, 40, 5, 'sMaxDisc', [], 'pct') +
      '<p class="tiny muted" style="margin:-2px 0 8px">ส่วนลดมากปิดดีลง่ายขึ้น แต่ ARR ต่อดีลลดลง</p>' +
      '<div class="divider"></div><div class="small ink2" style="margin-bottom:6px">ขึ้นราคาลูกค้าเดิมให้เท่าราคาปัจจุบัน (เสี่ยงยกเลิกทันที):</div><div class="row">' + SEGS.filter(function (k) { return k !== 'ent'; }).map(function (k) { return UI.btn(SEG[k].s, 'sReprice', [k], 'sm'); }).join('') + '</div>');
    // cohorts
    var allC = {};
    SEGS.forEach(function (k) { b.segs[k].cohorts.forEach(function (c) { var e = allC[c.m] || (allC[c.m] = { start: 0, n: 0 }); e.start += c.start; e.n += c.n; }); });
    var cm = Object.keys(allC).map(Number).sort(function (x, y) { return y - x; }).slice(0, 14);
    var cohort = UI.panel('Cohort — ลูกค้าแต่ละรุ่นยังอยู่กี่ %', UI.table(['รุ่น (เดือนที่ได้ลูกค้า)', '#ได้มา', '#ยังอยู่', 'Retention'], cm.map(function (m) { var e = allC[m]; var r = e.n / Math.max(1, e.start); return [RW.T.monthLabel(m), F.num(e.start), F.num(e.n), '<div style="min-width:90px">' + UI.meter(r * 100, 100, r < 0.5 ? 'crit' : r < 0.75 ? 'warn' : 'good') + '<span class="tiny">' + F.pct(r, 0) + '</span></div>']; }), { empty: 'ยังไม่มีลูกค้า' }));
    // expansion
    var mk = UI.panel('ขยายตลาด SEA', '<p class="small ink2" style="margin:0 0 8px">ตลาดไทยมีเพดาน การเติบโตระดับ Series B+ มักต้องไปต่างประเทศ — ต้องมีฟีเจอร์หลายภาษา ตั้งบริษัทลูก และทีมท้องถิ่น</p>' + UI.table(['ประเทศ', 'ขนาดตลาดเทียบไทย', '#ค่าตั้ง', '#ทีม/เดือน', 'สถานะ'], Object.keys(M.MARKETS).map(function (key) {
      var m = M.MARKETS[key], st = b.markets[key];
      return [m.n, '×' + m.mult, F.m(m.cost), F.m(m.monthly), st ? UI.pill('เปิดแล้ว · ' + F.pct(st.ramp, 0), 'good') + ' ' + UI.btn('ถอน', 'sExitMk', [key], 'sm ghost') : UI.btn('เปิดตลาด', 'sExpand', [key], 'sm', b.feats.i18n < m.i18n ? 'disabled title="ต้องมีฟีเจอร์หลายภาษาระดับ ' + m.i18n + '"' : '')];
    })));
    return head + segs + '<div style="margin-top:14px">' + disc + '</div><div class="grid g2" style="margin-top:14px">' + pricing + cohort + '</div><div style="margin-top:14px">' + mk + '</div>';
  };
  ui.acts.sToggleSeg = function (k) { return M.act.toggleSeg(UI.s, k); };
  ui.acts.sPrice = function (k, v) { return M.act.setPrice(UI.s, k, v); };
  ui.acts.sMotion = function (k, m) { return M.act.setMotion(UI.s, k, m); };
  ui.acts.sDiscTarget = function (k) { return M.act.setDiscTarget(UI.s, k); };
  ui.acts.sAnnual = function (v) { return M.act.setAnnualDiscount(UI.s, v / 100); };
  ui.acts.sMaxDisc = function (v) { return M.act.setMaxDiscount(UI.s, v / 100); };
  ui.acts.sReprice = function (k) {
    if (UI.sel.confirmReprice !== k) { UI.sel.confirmReprice = k; return { ok: false, msg: 'กดอีกครั้งเพื่อยืนยันขึ้นราคาลูกค้าเดิมกลุ่ม ' + SEG[k].s }; }
    UI.sel.confirmReprice = null;
    return M.act.repriceExisting(UI.s, k);
  };
  ui.acts.sExpand = function (k) { return M.act.expand(UI.s, k); };
  ui.acts.sExitMk = function (k) { return M.act.exitMarket(UI.s, k); };

  // ---------------- GROWTH ----------------
  ui.render.growth = function (s) {
    var b = s.biz;
    var last = b.chanMonthHist.length ? b.chanMonthHist[b.chanMonthHist.length - 1] : null;
    var weekly = U.sum(M.CHKEYS, function (k) { return b.ch[k].budget || 0; });
    var head = '<div class="page-head"><div><h2>การตลาด & การขาย</h2><p>ทุกช่องทางมีเพดาน ยิ่งอัดเงินมาก ต้นทุนต่อลีดยิ่งแพง (diminishing returns) — วัดผลด้วย CAC ของแต่ละช่องทาง</p></div>' + UI.pill('งบการตลาด ' + F.m(weekly) + '/สัปดาห์ ≈ ' + F.m(weekly * 4.33) + '/เดือน', 'accent') + '</div>';
    var rows = M.CHKEYS.map(function (k) {
      var c = M.CH[k], st = b.ch[k];
      var lm = last ? last[k] : { spend: 0, leads: 0, cust: 0 };
      var ctl;
      if (c.kind === 'paid' || c.kind === 'stock') ctl = UI.numInput('bud_' + k, st.budget, 'sBudget', [k], 5000) + '<div class="tiny muted">บาท/สัปดาห์</div>';
      else if (c.kind === 'partner') ctl = '<label class="row small" style="gap:6px"><input type="checkbox" ' + (st.on ? 'checked' : '') + ' data-act="sPartners"> เปิดโปรแกรม</label><div class="tiny muted">พาร์ทเนอร์ ' + Math.round(st.count) + ' ราย · คอมฯ ' + F.pct(st.commission, 0) + ' ของปีแรก</div>';
      else if (c.kind === 'referral') ctl = UI.numInput('ref_inc', st.incentive, 'sReferral', [], 500) + '<div class="tiny muted">บาท/ลูกค้าที่แนะนำ</div>';
      else if (c.kind === 'founder') ctl = '<span class="small">เวลาคุณ ' + (s.founder.focus.sell || 0) + '%</span>';
      else if (c.kind === 'team') ctl = '<span class="small">SDR ' + RW.Team.capOf(s, 'leadgen').toFixed(1) + ' FTE</span>';
      else ctl = '<span class="tiny muted">อัตโนมัติ</span>';
      var cac = lm.cust > 0.5 && lm.spend > 0 ? F.m(lm.spend / lm.cust) : '–';
      return ['<b>' + c.n + '</b><div class="tiny muted">' + c.d + '</div>', ctl, F.m(lm.spend), F.num(Math.round(lm.leads)), (lm.cust).toFixed(1), cac];
    });
    var chan = UI.panel('ช่องทางหาลูกค้า (ตัวเลขเดือนที่แล้ว)', UI.table(['ช่องทาง', 'งบ/การตั้งค่า', '#ใช้จ่าย', '#ลีด', '#ลูกค้าใหม่', '#CAC'], rows) +
      (b.ch.partners.on ? UI.slider('คอมมิชชันพาร์ทเนอร์', Math.round(b.ch.partners.commission * 100), 5, 40, 5, 'sCommission', [], 'pct') : '') +
      '<div class="row" style="margin-top:8px">' + UI.btn('จัดแถลงข่าว/PR Launch (฿350,000)', 'sPR', [], '', b.launched ? '' : 'disabled') + '</div>');
    // funnel
    var segRows = SEGS.map(function (k) {
      var sg = b.segs[k];
      var h2 = b.segHist && b.segHist.length ? b.segHist[b.segHist.length - 1][k] : null;
      var trials = U.sum(sg.trials, function (t) { return t.n; });
      var opps = U.sum(sg.opps, function (o) { return o.n; });
      return ['<b>' + SEG[k].s + '</b>' + (sg.on ? '' : ' <span class="tiny muted">(ไม่ได้ทำตลาด)</span>'), h2 ? F.num(Math.round(h2.leads)) : '–', sg.motion === 'self' ? F.num(Math.round(trials)) + ' trial' : F.num(Math.round(sg.queue)) + ' ลีดรอ / ' + opps.toFixed(1) + ' ดีล', h2 ? F.num(h2.won) : '–', h2 ? F.num(h2.churned) : '–', h2 ? F.m(h2.newMRR) : '–', h2 ? F.m(h2.churnMRR) : '–'];
    });
    var funnel = UI.panel('Funnel แยกกลุ่ม (เดือนที่แล้ว)', UI.table(['กลุ่ม', '#ลีด', '#ในกระบวนการ', '#ลูกค้าใหม่', '#ยกเลิก', '#MRR ใหม่', '#MRR ที่เสีย'], segRows));
    var load = 0;
    SEGS.forEach(function (k) { b.segs[k].opps.forEach(function (o) { load += o.n * SEG[k].load; }); });
    var salesCap = RW.Team.capOf(s, 'sales');
    var sales = UI.panel('ทีมขาย', '<div class="kv"><span>กำลังปิดการขาย (AE + คุณ)</span><span>' + salesCap.toFixed(2) + ' FTE</span><span>ภาระดีลที่ต้องดูแล</span><span class="' + (load > salesCap ? 'crit' : '') + '">' + load.toFixed(2) + ' FTE' + (load > salesCap ? ' (ล้น — อัตราปิดดีลลดลง)' : '') + '</span><span>SDR (หาลีด)</span><span>' + RW.Team.capOf(s, 'leadgen').toFixed(2) + ' FTE</span><span>คอมมิชชันพนักงานขาย</span><span>10% ของมูลค่าปีแรก (Enterprise 6%)</span></div><p class="tiny muted" style="margin-top:6px">ลีดที่ไม่มีคนตามจะเย็นลง 25% ต่อสัปดาห์ · รอบการขาย SME 2–5 สัปดาห์, Mid 6–12, Enterprise 16–36 สัปดาห์</p>');
    var sup = b.support;
    var support = UI.panel('ซัพพอร์ต & Customer Success', '<div class="stack">' + UI.bar('ตั๋วต่อสัปดาห์ vs ความสามารถรองรับ', Math.min(sup.tickets, sup.cap * 2), Math.max(1, sup.cap * 2), sup.tickets > sup.cap ? 'crit' : 'good', Math.round(sup.tickets) + ' / ' + Math.round(sup.cap)) +
      '<div class="kv"><span>งานค้าง</span><span>' + Math.round(sup.backlog) + ' ตั๋ว</span><span>CSAT</span><span>' + F.pct(sup.csat, 0) + '</span><span>' + UI.tip('CS coverage', 'สัดส่วนลูกค้า Mid/Enterprise ที่มี CSM ดูแล — ลด churn และเพิ่มการขยายบัญชี') + '</span><span>' + F.pct(M.csCoverage(s), 0) + '</span></div></div>');
    var acc = UI.panel('ลูกค้าองค์กร (' + b.accounts.length + ')', UI.table(['บริษัท', '#มูลค่า/ปี', 'ต่อสัญญา', 'ความพอใจ'], b.accounts.slice().sort(function (x, y) { return y.acv - x.acv; }).map(function (a) { return [h(a.name), F.m(a.acv), RW.T.label(a.renew), '<div style="min-width:80px">' + UI.meter(a.health, 100, a.health < 40 ? 'crit' : a.health < 60 ? 'warn' : 'good') + '</div>']; }), { empty: 'ยังไม่มีลูกค้าองค์กร' }));
    return head + chan + '<div style="margin-top:14px">' + funnel + '</div><div class="grid g3" style="margin-top:14px">' + sales + support + acc + '</div>';
  };
  ui.acts.sBudget = function (k, v) { return M.act.setBudget(UI.s, k, v); };
  ui.acts.sPartners = function () { return M.act.togglePartners(UI.s); };
  ui.acts.sCommission = function (v) { return M.act.setCommission(UI.s, v / 100); };
  ui.acts.sReferral = function (v) { return M.act.setReferral(UI.s, v); };
  ui.acts.sPR = function () { return M.act.prLaunch(UI.s); };
})(globalThis.RW = globalThis.RW || {});
