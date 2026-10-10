/* RUNWAY — screens: finance, funding, company, inbox, world, journal, settings */
(function (RW) {
  'use strict';
  var UI = RW.UI, F = RW.F, U = RW.U, h = UI.h, A = RW.Act, L = RW.Ledger, AC = RW.ACCOUNTS;

  // =====================================================================
  //  FINANCE
  // =====================================================================
  UI.views.finance = function (s) {
    var sub = UI.sub.finance || 'pl';
    var head = '<div class="page-head"><div><h2>การเงิน</h2><p>บัญชีคู่ตามมาตรฐาน — กำไรไม่ใช่เงินสด ลูกค้าองค์กรจ่ายช้า 60 วัน รายได้รายปีเก็บเงินล่วงหน้าแต่ทยอยรับรู้</p></div>' +
      UI.segBtns([['pl', 'งบกำไรขาดทุน'], ['bs', 'งบดุล'], ['cf', 'กระแสเงินสด'], ['debt', 'เงินกู้'], ['tax', 'ภาษีและลูกหนี้']], sub, 'finSub') + '</div>';
    var body = { pl: UI.finPL, bs: UI.finBS, cf: UI.finCF, debt: UI.finDebt, tax: UI.finTax }[sub](s);
    return head + body;
  };
  UI.acts.finSub = function (v) { UI.sub.finance = v; };

  UI.finPL = function (s) {
    var hm = U.last(s.hist.monthly, 12);
    var cur = { label: 'เดือนนี้*', pl: s.fin.month.pl, p: L.pnl(s.fin.month.pl) };
    var cols = hm.concat([cur]);
    if (!hm.length) return UI.panel('งบกำไรขาดทุนรายเดือน', '<div class="empty">ยังไม่ครบเดือนแรก — ตัวเลขเดือนปัจจุบัน: รายได้ ' + F.b(cur.p.rev) + ' ค่าใช้จ่าย ' + F.b(cur.p.rev - cur.p.ni) + '</div>');
    var used = {};
    cols.forEach(function (c) { for (var k in c.pl) if (Math.abs(c.pl[k]) > 0.5) used[k] = 1; });
    function line(k) { return [AC[k].n].concat(cols.map(function (c) { var v = c.pl[k] || 0; return F.k(AC[k].t === 'R' ? -v : v); })); }
    function group(g) { return Object.keys(AC).filter(function (k) { return AC[k].g === g && used[k]; }); }
    function tot(label, f, cls) { var r = [label].concat(cols.map(function (c) { return F.k(f(c.p)); })); r._cls = cls; return { cells: r, _cls: cls }; }
    function sub(k) { return { cells: line(k), _cls: 'sub' }; }
    var rows = [];
    group('rev').forEach(function (k) { rows.push(sub(k)); });
    rows.push(tot('รายได้รวม', function (p) { return p.rev; }, 'total'));
    group('cogs').forEach(function (k) { rows.push(sub(k)); });
    rows.push(tot('กำไรขั้นต้น', function (p) { return p.gp; }, 'total'));
    rows.push({ cells: ['อัตรากำไรขั้นต้น'].concat(cols.map(function (c) { return c.p.rev > 0 ? F.pct(c.p.gm, 0) : '–'; })), _cls: 'sub' });
    ['rnd', 'sm', 'ga'].forEach(function (g) { group(g).forEach(function (k) { rows.push(sub(k)); }); });
    rows.push(tot('EBITDA', function (p) { return p.ebitda; }, 'total'));
    rows.push(tot('กำไรจากการดำเนินงาน (EBIT)', function (p) { return p.ebit; }));
    group('nonop').forEach(function (k) { rows.push(sub(k)); });
    group('tax').forEach(function (k) { rows.push(sub(k)); });
    rows.push(tot('กำไร (ขาดทุน) สุทธิ', function (p) { return p.ni; }, 'total'));
    var heads = ['รายการ'].concat(cols.map(function (c) { return '#' + c.label; }));
    var chart = UI.chart({ labels: hm.map(function (m) { return m.label; }), series: [{ name: 'กำไรสุทธิ', color: 'var(--s1)', data: hm.map(function (m) { return m.p.ni; }), bars: true, negColor: 'var(--s2)' }], fmt: F.k, tipFmt: F.m });
    var ue = RW.Models[s.industry].ui.unitEconomics ? UI.panel('Unit economics', RW.Models[s.industry].ui.unitEconomics(s)) : '';
    return UI.panel('งบกำไรขาดทุนรายเดือน', UI.table(heads, rows) + '<p class="tiny muted" style="margin-top:6px">* เดือนปัจจุบันยังไม่ปิดงบ (ยังไม่รวมเงินเดือน ค่าเช่า และค่าใช้จ่ายสิ้นเดือน)</p>') +
      '<div class="grid g2" style="margin-top:14px">' + UI.panel('กำไร (ขาดทุน) สุทธิรายเดือน', chart) + ue + '</div>';
  };

  UI.finBS = function (s) {
    var b = s.fin.bal, bs = L.balanceSheet(s.fin);
    function r(label, v, cls) { return { cells: [label, F.b(v)], _cls: cls || '' }; }
    var assets = [r(AC.cash.n, b.cash), r(AC.ar.n, b.ar), r(AC.inventory.n, b.inventory), r(AC.prepaid.n, b.prepaid), r(AC.whtc.n, b.whtc), r(AC.ppe.n, b.ppe), r(AC.accdep.n, b.accdep), r('สินทรัพย์รวม', bs.assets, 'total')];
    var liab = [r(AC.ap.n, -b.ap), r(AC.accrued.n, -b.accrued), r(AC.deferred.n, -b.deferred), r(AC.loans.n, -b.loans), r(AC.safe.n, -b.safe), r(AC.taxpay.n, -b.taxpay), r('หนี้สินรวม', bs.liab, 'total'),
      r(AC.capital.n, -b.capital), r(AC.retained.n, -b.retained), r('กำไร (ขาดทุน) ปีปัจจุบัน', bs.currentEarnings), r('ส่วนของผู้ถือหุ้นรวม', bs.equity, 'total'), r('หนี้สินและส่วนของผู้ถือหุ้น', bs.liab + bs.equity, 'total')];
    return '<div class="grid g2">' + UI.panel('สินทรัพย์', UI.table(['รายการ', '#บาท'], assets)) + UI.panel('หนี้สินและส่วนของผู้ถือหุ้น', UI.table(['รายการ', '#บาท'], liab) + '<p class="tiny muted" style="margin-top:6px">ส่วนของผู้ถือหุ้นติดลบ = ขาดทุนสะสมเกินทุน (ภาวะหนี้สินล้นพ้นตัวทางบัญชี) · ตรวจสอบสมดุล: ' + F.b(bs.check) + '</p>') + '</div>';
  };

  UI.finCF = function (s) {
    var hm = U.last(s.hist.monthly, 12);
    var rows = hm.map(function (m) { var net = m.cf.op + m.cf.inv + m.cf.fin; return [m.label, F.k(m.cf.op), F.k(m.cf.inv), F.k(m.cf.fin), F.k(net), F.k(m.cash)]; });
    var chart = UI.chart({ labels: hm.map(function (m) { return m.label; }), series: [{ name: 'จากการดำเนินงาน', color: 'var(--s1)', data: hm.map(function (m) { return m.cf.op; }) }, { name: 'จากการลงทุน', color: 'var(--s2)', data: hm.map(function (m) { return m.cf.inv; }) }, { name: 'จากการจัดหาเงิน', color: 'var(--s3)', data: hm.map(function (m) { return m.cf.fin; }) }], fmt: F.k, tipFmt: F.m });
    return UI.panel('งบกระแสเงินสด (วิธีทางตรง)', UI.table(['เดือน', '#ดำเนินงาน', '#ลงทุน', '#จัดหาเงิน', '#สุทธิ', '#เงินสดปลายงวด'], rows)) + '<div style="margin-top:14px">' + UI.panel('กระแสเงินสดแยกประเภท', chart) + '</div>';
  };

  UI.finDebt = function (s) {
    var offers = RW.Funding.debtOffers(s);
    var form = UI.form.debt || (UI.form.debt = {});
    var offerRows = offers.map(function (o) {
      var amt = form[o.kind] != null ? form[o.kind] : Math.round(o.max / 2 / 10000) * 10000;
      return '<div style="border-top:1px solid var(--line2);padding:10px 0"><div class="row between"><b>' + h(o.n) + '</b>' + (o.max > 0 ? UI.pill('วงเงินสูงสุด ' + F.m(o.max), 'good') : UI.pill('ไม่ผ่านเงื่อนไข', 'crit')) + '</div><div class="small ink2">' + h(o.d) + '</div>' +
        (o.max > 0 ? '<div class="row" style="margin-top:6px">' + UI.numInput('debt_' + o.kind, amt, 'debtForm', [o.kind], 50000) + UI.btn(o.kind === 'founder' ? 'ให้ยืม' : 'กู้', 'takeDebt', [o.kind], 'primary sm') + '</div>' : '') + '</div>';
    }).join('');
    var loans = s.fin.loans.map(function (l) {
      return [h(l.name), F.b(l.principal), F.b(l.balance + (l.feeLeft || 0)), l.kind === 'rbf' ? F.pct(l.revShare, 0) + ' ของรายได้' : F.pct(l.rate, 1) + '/ปี', l.payment ? F.b(l.payment) + '/ด.' : '–', UI.btn('ชำระ ฿500K', 'repayLoan', [l.id, 500000], 'sm')];
    });
    return '<div class="grid g2">' + UI.panel('ทางเลือกเงินกู้', offerRows + '<p class="tiny muted" style="margin-top:6px">หนี้ไม่ทำให้เสียหุ้น แต่ต้องจ่ายคืนทุกเดือนไม่ว่าธุรกิจจะดีหรือแย่ ผิดนัดชำระ = ล้มละลายเร็วขึ้น</p>') + UI.panel('เงินกู้คงค้าง', UI.table(['ชื่อ', '#เงินต้น', '#คงเหลือ', 'ดอกเบี้ย', '#ผ่อน', ''], loans, { empty: 'ไม่มีหนี้' })) + '</div>';
  };
  UI.acts.debtForm = function (k, v) { UI.form.debt[k] = v; return { render: false }; };
  UI.acts.takeDebt = function (k) {
    var o = RW.Funding.debtOffers(UI.s).find(function (x) { return x.kind === k && x.max > 0; });
    var amt = UI.form.debt[k] != null ? UI.form.debt[k] : Math.round(o.max / 2 / 10000) * 10000;
    if (k === 'founder') return A.lendToCompany(UI.s, amt);
    return A.takeDebt(UI.s, k, Math.min(amt, o.max));
  };
  UI.acts.repayLoan = function (id, amt) {
    var l = UI.s.fin.loans.find(function (x) { return x.id === id; });
    if (l && l.kind === 'founder') return A.repayFounderLoan(UI.s, amt);
    return A.repayLoan(UI.s, id, Math.min(amt, l ? l.balance + (l.feeLeft || 0) : amt));
  };

  UI.finTax = function (s) {
    var fin = s.fin, w = s.time.w;
    var overdue = fin.ar.filter(function (i) { return i.due < w; });
    var ytd = L.pnl(fin.ytd);
    var losses = U.sum(fin.taxLoss, function (l) { return l.amt; });
    var tax = UI.panel('ภาษี',
      '<div class="kv">' +
      '<span>สถานะ VAT</span><span>' + (fin.vat.registered ? UI.pill('จดทะเบียนแล้ว', 'good') : fin.vat.required ? UI.pill('ต้องจด! รายได้เกิน 1.8M', 'crit') : UI.pill('ยังไม่ถึงเกณฑ์')) + '</span>' +
      '<span>กำไร(ขาดทุน)ก่อนภาษี ปีนี้ (YTD)</span><span>' + F.b(ytd.ebt) + '</span>' +
      '<span>ขาดทุนสะสมยกไป (ใช้ได้ 5 ปี)</span><span>' + F.b(losses) + '</span>' +
      '<span>ภาษีถูกหัก ณ ที่จ่ายสะสม (เครดิต)</span><span>' + F.b(fin.bal.whtc) + '</span>' +
      '<span>ภาษีนิติบุคคลค้างจ่าย</span><span>' + F.b(-fin.bal.taxpay) + (fin.taxDue ? ' (ครบกำหนด ' + RW.T.label(fin.taxDue.dueWeek) + ')' : '') + '</span>' +
      '</div><div class="row" style="margin-top:10px">' + UI.btn('ยื่นขอคืนภาษีหัก ณ ที่จ่าย', 'claimWHT', [], 'sm', fin.bal.whtc < 1000 || s.flags.whtRefund ? 'disabled' : '') + '</div>' +
      '<p class="tiny muted" style="margin-top:8px">ภาษีนิติบุคคล SME (ทุนชำระ ≤ 5 ล้าน และรายได้ ≤ 30 ล้าน): กำไร 300,000 แรกยกเว้น, ถึง 3 ล้าน 15%, ส่วนเกิน 20% · ลูกค้านิติบุคคลหักภาษี ณ ที่จ่าย 3% ทุกครั้งที่จ่าย ใช้เครดิตตอนยื่น ภ.ง.ด.50 หรือขอคืน (ใช้เวลานานและอาจถูกตรวจ)</p>');
    var ar = UI.panel('ลูกหนี้ค้างชำระ', UI.table(['ลูกค้า', '#ยอด', 'ครบกำหนด', '#ค้างนาน'], overdue.slice(0, 30).map(function (i) { return [h(i.name || i.seg || 'ลูกค้า'), F.b(i.amt), RW.T.label(i.due), (w - i.due) + ' สป.']; }), { empty: 'ไม่มีลูกหนี้เกินกำหนด' }) + '<div class="kv" style="margin-top:8px"><span>ลูกหนี้ทั้งหมด</span><span>' + F.b(fin.bal.ar) + '</span><span>เกินกำหนด</span><span>' + F.b(L.arOverdue(s)) + '</span></div>');
    return '<div class="grid g2">' + tax + ar + '</div>';
  };
  UI.acts.claimWHT = function () { return A.claimWHT(UI.s); };

  // =====================================================================
  //  FUNDING
  // =====================================================================
  UI.views.funding = function (s) {
    var sub = UI.sub.funding || (s.funding.raise ? 'raise' : 'overview');
    var head = '<div class="page-head"><div><h2>ระดมทุน & โครงสร้างผู้ถือหุ้น</h2><p>ทุกเปอร์เซ็นต์ที่ขายไปคือส่วนของ Exit ที่คุณจะไม่ได้ ระดมทุนตอนที่ยังไม่ต้องการเงินคือตอนที่ได้ราคาดีที่สุด</p></div>' +
      UI.segBtns([['overview', 'ภาพรวม & Cap table'], ['raise', s.funding.raise ? 'กำลังระดมทุน ●' : 'เปิดระดมทุน'], ['investors', 'นักลงทุน'], ['exit', 'Exit & Waterfall']], sub, 'fundSub') + '</div>';
    var body = { overview: UI.fundOverview, raise: UI.fundRaise, investors: UI.fundInvestors, exit: UI.fundExit }[sub](s);
    return head + body;
  };
  UI.acts.fundSub = function (v) { UI.sub.funding = v; };

  UI.capRows = function (s) {
    var fd = RW.Funding.fullyDiluted(s);
    var groups = {};
    s.funding.holders.forEach(function (x) {
      var key = x.kind === 'employee' ? '_esop' : x.id + '|' + x.cls;
      if (!groups[key]) groups[key] = { name: x.kind === 'employee' ? 'พนักงาน (ESOP ที่มอบแล้ว)' : x.name, cls: x.kind === 'employee' ? 'common' : x.cls, kind: x.kind, shares: 0, invested: 0 };
      groups[key].shares += x.shares; groups[key].invested += x.invested || 0;
    });
    var rows = Object.keys(groups).map(function (k) { return groups[k]; });
    if (s.funding.pool > 0) rows.push({ name: 'Option pool (ยังไม่จัดสรร)', cls: 'pool', kind: 'pool', shares: s.funding.pool, invested: 0 });
    rows.sort(function (a, b) { return b.shares - a.shares; });
    return { rows: rows, fd: fd };
  };
  UI.fundOverview = function (s) {
    var fund = s.funding, k = s.kpi;
    var cr = UI.capRows(s);
    var colors = { founder: 'var(--s1)', cofounder: 'var(--s4)', investor: 'var(--s2)', employee: 'var(--s3)', pool: 'var(--line)', advisor: 'var(--muted)' };
    var bar = '<div class="stackbar" style="margin-bottom:10px">' + cr.rows.map(function (r) { return '<i style="width:' + (r.shares / cr.fd * 100).toFixed(2) + '%;background:' + (colors[r.kind] || 'var(--muted)') + '" title="' + h(r.name) + ' ' + F.pct(r.shares / cr.fd) + '"></i>'; }).join('') + '</div>' +
      '<div class="legend"><span><i style="background:var(--s1)"></i>ผู้ก่อตั้ง</span><span><i style="background:var(--s4)"></i>ผู้ร่วมก่อตั้ง</span><span><i style="background:var(--s2)"></i>นักลงทุน</span><span><i style="background:var(--s3)"></i>พนักงาน</span><span><i style="background:var(--line)"></i>Pool ว่าง</span></div>';
    var cap = UI.panel('Cap table (fully diluted)', bar + UI.table(['ผู้ถือหุ้น', 'ประเภทหุ้น', '#จำนวนหุ้น', '#สัดส่วน', '#เงินลงทุน'], cr.rows.map(function (r) { return [h(r.name), h(r.cls === 'common' ? 'สามัญ' : r.cls === 'pool' ? '–' : r.cls), F.num(r.shares), F.pct(r.shares / cr.fd, 2), r.invested ? F.m(r.invested) : '–']; })) +
      (fund.safes.length ? '<h3 style="margin:12px 0 6px">SAFE ที่ยังไม่แปลงสภาพ</h3>' + UI.table(['นักลงทุน', '#จำนวน', '#Cap', '#ส่วนลด', '#สัดส่วนโดยประมาณ'], fund.safes.map(function (x) { return [h(x.name), F.m(x.amount), F.m(x.cap), F.pct(x.discount, 0), '~' + F.pct(x.amount / x.cap, 1)]; })) : ''));
    var M = RW.Models[s.industry];
    var tr = k.tractionInfo || M.traction(s);
    var stage = RW.Funding.stageOfRaise(s);
    var bars = RW.STAGE_ORDER.map(function (st) {
      var r = (k.traction || 0) / RW.Funding.BAR[st];
      return UI.bar(RW.STAGES[st].n, Math.min(1, r) * 100, 100, r >= 1 ? 'good' : r > 0.75 ? 'warn' : '', F.pct(Math.min(r, 9.99), 0));
    }).join('');
    var fair = RW.Funding.fairPre(s, stage);
    var ready = UI.panel('ความพร้อมในสายตานักลงทุน', '<div class="kv" style="margin-bottom:10px">' + tr.lines.map(function (l) { return '<span>' + l[0] + '</span><span>' + l[1] + '</span>'; }).join('') +
      '<span>' + UI.tip('Traction score', 'คะแนนรวมที่นักลงทุนใช้ประเมิน: รายได้ การเติบโต การรักษาลูกค้า สินค้า และทีม') + '</span><span>' + (k.traction || 0).toFixed(0) + '</span>' +
      '<span>บรรยากาศการลงทุน</span><span>' + RW.World.vcLabel(s.world.vc) + '</span>' +
      '<span>มูลค่าที่นักลงทุนน่าจะให้ (' + RW.STAGES[stage].n + ')</span><span>' + F.m(fair * 0.8) + ' – ' + F.m(fair * 1.15) + '</span></div><div class="stack">' + bars + '</div><p class="tiny muted" style="margin-top:6px">100% = ตัวเลขถึงมาตรฐานที่นักลงทุนรอบนั้นคาดหวัง ยิ่งเกินยิ่งต่อรองได้</p>');
    var b = fund.board;
    var board = UI.panel('คณะกรรมการบริษัท', '<div class="kv"><span>ที่นั่งผู้ก่อตั้ง</span><span>' + (b.founderSeats + (s.cofounders || []).filter(function (c) { return c.active && c.boardSeat; }).length) + '</span><span>ที่นั่งนักลงทุน</span><span>' + b.investorSeats + '</span><span>ใครคุมบอร์ด</span><span>' + (RW.Funding.investorControl(s) ? UI.pill('นักลงทุน', 'crit') : UI.pill('ผู้ก่อตั้ง', 'good')) + '</span>' +
      (fund.rounds.length ? '<span>ความเชื่อมั่นของบอร์ด</span><span>' + Math.round(b.confidence) + '/100</span>' : '') + '</div>' +
      '<label class="row small" style="margin-top:10px"><input type="checkbox" ' + (fund.updates ? 'checked' : '') + ' data-act="toggleUpdates"> ส่ง Investor update ทุกเดือน (สร้างความเชื่อใจ ช่วยรอบถัดไป)</label>');
    var rounds = UI.panel('ประวัติการระดมทุน', UI.table(['เมื่อ', 'รอบ', '#จำนวนเงิน', '#Pre-money', '#ราคา/หุ้น', 'Lead'], fund.rounds.map(function (r) {
      return [RW.T.label(r.w), h(RW.STAGES[r.stage] ? RW.STAGES[r.stage].n : r.stage) + (r.down ? ' ' + UI.pill('Down round', 'crit') : ''), F.m(r.amount), F.m(r.pre), F.b(r.pps), h(r.lead)];
    }), { empty: 'ยังไม่เคยขายหุ้นให้นักลงทุน' }));
    return '<div class="grid g-side">' + '<div class="stack">' + cap + rounds + '</div><div class="stack">' + ready + board + '</div></div>';
  };
  UI.acts.toggleUpdates = function () { return A.toggleUpdates(UI.s); };

  UI.fundRaise = function (s) {
    var r = s.funding.raise;
    if (!r) return UI.raiseForm(s);
    var Fn = RW.Funding;
    var committed = Fn.committed(s);
    var status = r.status === 'closing' ? UI.pill('กำลังปิดรอบ — เงินเข้าประมาณ ' + RW.T.label(r.closingW), 'good') : r.leadId ? UI.pill('มี Lead แล้ว', 'good') : UI.pill('กำลังหา ' + (r.instrument === 'safe' ? 'นักลงทุน' : 'Lead investor'), 'accent');
    var head = UI.panel(RW.STAGES[r.stage].n + ' · ' + (r.instrument === 'safe' ? 'SAFE' : 'Priced round'),
      '<div class="row" style="margin-bottom:10px">' + status + UI.pill('เปิดมา ' + (s.time.w - r.startW) + ' สัปดาห์') + '</div>' +
      '<div class="kv"><span>เป้าหมาย</span><span>' + F.m(r.target) + '</span><span>' + (r.instrument === 'safe' ? 'Valuation cap' : 'Pre-money') + '</span><span>' + F.m(r.leadTerms ? r.leadTerms.pre : r.ask) + '</span>' +
      (r.instrument === 'safe' ? '<span>ได้รับแล้ว</span><span>' + F.m(r.raised || 0) + '</span>' : '<span>ยืนยันแล้ว</span><span>' + F.m(committed) + ' (ขั้นต่ำ ' + F.m(r.minClose) + ')</span>') +
      '<span>คุยพร้อมกันได้</span><span>' + Fn.pipelineCap(s) + ' ราย (ขึ้นกับเวลาที่คุณใช้ระดมทุน ' + s.founder.focus.fundraise + '%)</span></div>' +
      '<div class="row" style="margin-top:10px">' +
      (r.leadId && r.status === 'active' ? UI.btn('ปิดรอบ (เริ่มทำสัญญา)', 'closeRound', [], 'primary', committed < r.minClose ? 'disabled' : '') : '') +
      (r.instrument === 'safe' ? UI.btn('ปิดรอบ SAFE', 'endSafe', [], 'primary') : '') +
      (r.status === 'active' ? UI.btn('ยุติการระดมทุน', 'cancelRaise', [], 'danger') : '') + '</div>');
    var pipe = UI.panel('Pipeline นักลงทุน', UI.table(['นักลงทุน', 'ประเภท', 'ขั้นตอน', 'สัญญาณ', 'สถานะ'], r.pipeline.map(function (p) {
      var inv = s.funding.investors.find(function (i) { return i.id === p.invId; });
      var sig = p.interest == null ? '–' : p.interest > 0.65 ? UI.pill('สนใจมาก', 'good') : p.interest > 0.4 ? UI.pill('กลางๆ', 'warn') : UI.pill('เย็นชา', 'crit');
      var st = { active: 'กำลังคุย', passed: 'ปฏิเสธ', termsheet: 'ยื่นข้อเสนอแล้ว', committed: 'ยืนยันลงทุน', waiting: 'รอ Lead', declined: 'คุณปฏิเสธ' }[p.status];
      return [h(inv.name), UI.invType(inv), p.status === 'active' ? Fn.STEPS[p.step] + '<div class="meter" style="margin-top:3px"><i style="width:' + Math.min(100, (p.step + p.prog) / 4 * 100) + '%"></i></div>' : '–', sig, (p.status === 'passed' ? '<span class="muted" title="' + h(p.reason || '') + '">' + st + (p.reason ? ' — ' + h(p.reason) : '') + '</span>' : st)];
    }), { empty: 'ยังไม่ได้ติดต่อใคร — เลือกนักลงทุนด้านล่าง' }));
    var elig = Fn.eligibleInvestors(s, r.stage).filter(function (i) { return !r.pipeline.some(function (p) { return p.invId === i.id; }); });
    var add = UI.panel('ติดต่อนักลงทุนเพิ่ม', UI.table(['นักลงทุน', 'ประเภท', '#เช็ค', '#ชื่อเสียง', '#ความเป็นมิตร', 'ความสัมพันธ์', ''], elig.map(function (i) {
      return [h(i.name) + '<div class="tiny muted">' + h(i.bio) + '</div>', UI.invType(i), F.m(i.check[0]) + '–' + F.m(i.check[1]), i.rep, i.friendly, i.warm > 0.6 ? UI.pill('อบอุ่น', 'good') : i.warm > 0.2 ? UI.pill('รู้จัก') : '–', UI.btn('ส่ง deck', 'pitch', [i.id], 'sm')];
    }), { empty: 'ไม่มีนักลงทุนที่เหลือสำหรับรอบนี้' }));
    var log = UI.panel('บันทึก', '<div class="stack small">' + r.log.map(function (l) { return '<div><span class="muted">' + RW.T.label(l.w) + '</span> — ' + h(l.m) + '</div>'; }).join('') + '</div>');
    return '<div class="grid g-side"><div class="stack">' + head + pipe + add + '</div><div class="stack">' + log + '</div></div>';
  };
  UI.invType = function (i) { return { angel: 'Angel', accelerator: 'Accelerator', vc: 'VC', cvc: 'Corporate VC', growth: 'Growth fund', family: 'Family office' }[i.type] || i.type; };
  UI.raiseForm = function (s) {
    var Fn = RW.Funding;
    var stage = Fn.stageOfRaise(s);
    var fair = Fn.fairPre(s, stage);
    var st = RW.STAGES[stage];
    var f = UI.form.raise;
    if (!f || f.stage !== stage) {
      var inst = stage === 'preseed' ? 'safe' : 'priced';
      var target = Math.round(Math.min(st.amt[1], Math.max(st.amt[0], fair * (inst === 'safe' ? 0.15 : 0.22))) / 1e5) * 1e5;
      f = UI.form.raise = { stage: stage, inst: inst, target: target, ask: Math.round(fair / 1e5) * 1e5 };
    }
    var dil = f.inst === 'safe' ? f.target / f.ask : f.target / (f.ask + f.target);
    var invs = Fn.eligibleInvestors(s, stage);
    var html = '<div class="grid g2">' + UI.panel('เปิดระดมทุนรอบ ' + st.n,
      '<div class="stack"><div class="row">' + UI.segBtns([['safe', 'SAFE (เร็ว ไม่ต้องตั้งราคา)'], ['priced', 'Priced round (ขายหุ้นบุริมสิทธิ์)']], f.inst, 'raiseForm', ['inst']) + '</div>' +
      '<label class="field" for="r_target">จำนวนเงินที่ต้องการ (บาท)' + UI.numInput('r_target', f.target, 'raiseForm', ['target'], 100000) + '</label>' +
      '<label class="field" for="r_ask">' + (f.inst === 'safe' ? 'Valuation cap (post-money)' : 'Pre-money valuation ที่ขอ') + UI.numInput('r_ask', f.ask, 'raiseForm', ['ask'], 1000000) + '</label>' +
      '<div class="kv"><span>สัดส่วนที่จะขายโดยประมาณ</span><span class="' + (dil > 0.3 ? 'crit' : dil > 0.22 ? 'warn' : '') + '">' + F.pct(dil, 1) + '</span><span>มูลค่าที่นักลงทุนน่าจะให้</span><span>' + F.m(fair * 0.8) + ' – ' + F.m(fair * 1.15) + '</span><span>ขนาดรอบทั่วไปของ ' + st.n + '</span><span>' + F.m(st.amt[0]) + ' – ' + F.m(st.amt[1]) + '</span><span>Burn ปัจจุบัน</span><span>' + (s.kpi.burn > 0 ? F.m(s.kpi.burn) + '/ด. → เงินก้อนนี้อยู่ได้ ~' + F.months(f.target / s.kpi.burn) : 'ไม่ burn') + '</span></div>' +
      '<div class="note">ขอราคาสูงเกิน = นักลงทุนปฏิเสธมากขึ้น · ขอต่ำเกิน = เสียหุ้นเปล่าๆ · ระดมให้พอใช้ 18–24 เดือน · การระดมทุนจะดึงเวลาคุณไปอย่างน้อย 25%</div>' +
      UI.btn('เริ่มระดมทุน', 'startRaise', [], 'primary') + '</div>') +
      UI.panel('นักลงทุนที่ลงทุนรอบนี้', UI.table(['ชื่อ', 'ประเภท', '#เช็ค', 'ความสัมพันธ์'], invs.slice(0, 14).map(function (i) { return [h(i.name), UI.invType(i), F.m(i.check[0]) + '–' + F.m(i.check[1]), i.warm > 0.6 ? UI.pill('อบอุ่น', 'good') : i.warm > 0.2 ? UI.pill('รู้จัก') : '–']; }), { empty: 'ไม่มีนักลงทุนที่ลงทุนระยะนี้ (หรือเพิ่งปฏิเสธคุณไป)' }) +
        '<div class="row" style="margin-top:8px">' + UI.btn('ไปงาน networking (฿8,000, พลังงาน −8)', 'network', [], 'sm') + '</div>') + '</div>';
    return html;
  };
  UI.acts.raiseForm = function (k, v) { UI.form.raise[k] = v; };
  UI.acts.startRaise = function () {
    var f = UI.form.raise, s = UI.s;
    var r = A.startRaise(s, { stage: f.stage, instrument: f.inst, target: f.target, ask: f.ask, minClose: f.target * 0.6 });
    if (r.ok) {
      // auto-pitch the warmest few investors
      RW.Funding.eligibleInvestors(s, f.stage).sort(function (a, b) { return b.warm - a.warm || b.rep - a.rep; }).slice(0, 4).forEach(function (i) { RW.Funding.pitch(s, i.id); });
      UI.sub.funding = 'raise';
    }
    return r;
  };
  UI.acts.pitch = function (id) { return A.pitch(UI.s, id); };
  UI.acts.closeRound = function () { return A.closeRound(UI.s); };
  UI.acts.endSafe = function () { return A.endSafeRound(UI.s); };
  UI.acts.cancelRaise = function () {
    if (!UI.sel.confirmCancel) { UI.sel.confirmCancel = 1; return { ok: false, msg: 'กดอีกครั้งเพื่อยืนยันยุติการระดมทุน' }; }
    UI.sel.confirmCancel = 0;
    return A.cancelRaise(UI.s);
  };
  UI.acts.network = function () { return A.network(UI.s); };

  UI.fundInvestors = function (s) {
    var list = s.funding.investors.slice().sort(function (a, b) { return RW.STAGE_ORDER.indexOf(a.stages[0]) - RW.STAGE_ORDER.indexOf(b.stages[0]); });
    var rows = list.map(function (i) {
      var holds = s.funding.holders.some(function (x) { return x.id === i.id; }) || s.funding.safes.some(function (x) { return x.invId === i.id; });
      return [h(i.name) + '<div class="tiny muted">' + h(i.bio) + '</div>', UI.invType(i), i.stages.map(function (x) { return RW.STAGES[x].n; }).join(', '), F.m(i.check[0]) + '–' + F.m(i.check[1]), i.rep, i.friendly, { customers: 'แนะนำลูกค้า', talent: 'ช่วยหาคน', investors: 'เครือข่ายนักลงทุน', none: '–' }[i.valueAdd] || '–',
        holds ? UI.pill('ผู้ถือหุ้น', 'good') : i.passedUntil > s.time.w ? UI.pill('เพิ่งปฏิเสธ', 'crit') : i.warm > 0.6 ? UI.pill('อบอุ่น', 'good') : i.warm > 0.2 ? UI.pill('รู้จัก') : '–'];
    });
    return UI.panel('ทำเนียบนักลงทุน (สมมติ)', UI.table(['ชื่อ', 'ประเภท', 'ระยะที่ลงทุน', '#เช็ค', '#ชื่อเสียง', '#เป็นมิตร', 'ช่วยอะไร', 'สถานะ'], rows) + '<p class="tiny muted" style="margin-top:6px">"ความเป็นมิตร" ต่ำ = มักขอเงื่อนไขโหด เช่น Participating preferred, 2x liquidation preference, Full ratchet · CVC อาจขอสิทธิ์ซื้อก่อน (ROFR) ซึ่งทำให้ขายกิจการให้คู่แข่งของเขายาก</p>');
  };

  UI.fundExit = function (s) {
    var Fn = RW.Funding, M = RW.Models[s.industry];
    var v = M.valuation(s) * Fn.climate(s);
    var f = UI.form.exit || (UI.form.exit = { value: Math.round(Math.max(v, 1e6) / 1e6) * 1e6 });
    var wf = Fn.waterfall(s, f.value);
    var rows = wf.holders.filter(function (x) { return x.amount > 0.5 || x.kind === 'founder'; }).sort(function (a, b) { return b.amount - a.amount; }).map(function (x) { return [h(x.name), h(x.cls), F.m(x.amount), F.pct(x.amount / f.value, 1)]; });
    var sim = UI.panel('จำลอง Liquidation waterfall', '<p class="small ink2" style="margin:0 0 8px">ถ้าบริษัทถูกขายที่ราคานี้ เงินจะไหลไปหาใครบ้าง (หุ้นบุริมสิทธิ์ได้ก่อนตาม preference)</p><label class="field" for="ex_v">ราคาขายกิจการ (Equity value)' + UI.numInput('ex_v', f.value, 'exitForm', [], 1000000) + '</label>' +
      '<div class="row" style="margin:8px 0">' + [0.25, 0.5, 1, 2, 5].map(function (m) { return UI.btn(F.m(v * m), 'exitPreset', [Math.round(v * m / 1e6) * 1e6], 'sm'); }).join('') + '</div>' +
      '<div class="tiles" style="margin:8px 0">' + UI.tile('คุณได้รับ', F.m(wf.founder), F.pct(wf.founder / Math.max(1, f.value), 1) + ' ของดีล', 'good') + UI.tile('สัดส่วนหุ้นคุณ', F.pct(Fn.founderPct(s), 1)) + '</div>' + UI.table(['ผู้ถือหุ้น', 'ประเภท', '#ได้รับ', '#%'], rows));
    var ipo = RW.Engine.ipoCheck(s);
    var ipoP = UI.panel('ความพร้อมเข้าตลาดหลักทรัพย์ (IPO)', '<div class="stack">' + ipo.reqs.map(function (r) { return '<div class="alert ' + (r.ok ? 'good' : '') + '"><span class="dot"></span><span>' + (r.ok ? '✓ ' : '✗ ') + h(r.t) + '</span></div>'; }).join('') + '</div><div class="row" style="margin-top:10px">' + (s.flags.ipo ? UI.pill('กำลังเตรียม IPO — เข้าตลาดประมาณ ' + RW.T.label(s.flags.ipo.w), 'good') : UI.btn('เริ่มกระบวนการ IPO (฿15M)', 'startIPO', [], 'primary', ipo.ok ? '' : 'disabled')) + '</div>');
    var offers = s.funding.offers.map(function (o) { return [h(o.buyer), F.m(o.price), RW.T.label(o.expires)]; });
    var mna = UI.panel('ขายกิจการ (M&A)', '<p class="small ink2" style="margin:0 0 8px">ข้อเสนอซื้อจะเข้ามาเองเมื่อบริษัทน่าสนใจ หรือจ้างวาณิชธนกิจช่วยหาผู้ซื้อ</p>' + UI.table(['ผู้ซื้อ', '#ราคา', 'หมดอายุ'], offers, { empty: 'ยังไม่มีข้อเสนอที่เปิดอยู่' }) + '<div class="row" style="margin-top:8px">' + (s.flags.banker > s.time.w ? UI.pill('ที่ปรึกษา M&A กำลังหาผู้ซื้อถึง ' + RW.T.label(s.flags.banker), 'accent') : UI.btn('จ้างที่ปรึกษา M&A (฿1.5M)', 'hireBanker', [])) + '</div>');
    return '<div class="grid g2">' + sim + '<div class="stack">' + mna + ipoP + '</div></div>';
  };
  UI.acts.exitForm = function (v) { UI.form.exit.value = Math.max(0, v); };
  UI.acts.exitPreset = function (v) { UI.form.exit.value = v; };
  UI.acts.startIPO = function () { return A.startIPO(UI.s); };
  UI.acts.hireBanker = function () { return A.hireBanker(UI.s); };

  // =====================================================================
  //  COMPANY & LEGAL
  // =====================================================================
  UI.views.company = function (s) {
    var c = s.company, fl = s.flags;
    var head = '<div class="page-head"><div><h2>บริษัท & กฎหมาย</h2><p>งานที่ไม่มีใครเห็น จนกระทั่งนักลงทุนทำ Due Diligence หรือสรรพากรมาเคาะประตู</p></div></div>';
    function item(ok, label, desc, action) {
      return '<div class="alert ' + (ok ? 'good' : 'warn') + '"><span class="dot"></span><div style="flex:1"><b>' + label + '</b><div class="small ink2">' + desc + '</div></div>' + (action || '') + '</div>';
    }
    var legal = UI.panel('เช็กลิสต์', '<div class="stack">' +
      item(c.registered, 'จดทะเบียนบริษัทจำกัด', c.registered ? 'จดทะเบียนแล้ว' : fl.registering ? 'กำลังดำเนินการ เสร็จ ' + RW.T.label(fl.registering) : 'จำเป็นสำหรับจ้างพนักงาน ออกใบกำกับภาษี และระดมทุน (฿12,000, 2 สัปดาห์)', c.registered || fl.registering ? '' : UI.btn('จดทะเบียน', 'register', [], 'primary sm')) +
      item(!fl.ipNotAssigned, 'สัญญาโอนทรัพย์สินทางปัญญา & ข้อตกลงผู้ก่อตั้ง', fl.ipNotAssigned ? 'โค้ด/แบรนด์ยังเป็นชื่อบุคคล — นักลงทุนจะติดใน DD (฿25,000)' : 'เรียบร้อย', fl.ipNotAssigned ? UI.btn('ทำสัญญา', 'assignIP', [], 'sm') : '') +
      item(!fl.booksMessy, 'ระบบบัญชี', fl.booksMessy ? 'บัญชีช่วงแรกไม่เป็นระเบียบ — จ้างสำนักงานบัญชีจัดการ (฿60,000)' : 'บัญชีเป็นระเบียบ ผ่านการสอบบัญชี', fl.booksMessy ? UI.btn('จัดระเบียบ', 'cleanBooks', [], 'sm') : '') +
      item(!!fl.auditor, 'ผู้สอบบัญชี', fl.auditor === 'big4' ? 'Big4 — ค่าสอบบัญชีแพง แต่จำเป็นสำหรับ IPO' : fl.auditor ? 'ผู้สอบบัญชีท้องถิ่น' : 'ยังไม่ได้เลือก (ใช้ผู้สอบบัญชีท้องถิ่นอัตโนมัติ)', UI.segBtns([['local', 'ท้องถิ่น'], ['big4', 'Big4']], fl.auditor || 'local', 'setAuditor')) +
      item(c.insured, 'ประกันภัยธุรกิจ', c.insured ? 'คุ้มครองทรัพย์สิน น้ำท่วม ไซเบอร์ D&O — ' + F.b(RW.Events.insuranceCost(s)) + '/เดือน' : 'ไม่มีประกัน — น้ำท่วมหรือข้อมูลรั่วอาจกินเงินก้อนใหญ่', UI.btn(c.insured ? 'ยกเลิก' : 'ซื้อประกัน', 'insurance', [!c.insured], 'sm')) +
      item(s.fin.vat.registered || !s.fin.vat.required, 'ภาษีมูลค่าเพิ่ม (VAT)', s.fin.vat.registered ? 'จดทะเบียนแล้ว' : s.fin.vat.required ? 'รายได้เกิน 1.8 ล้าน — ต้องจด' : 'ยังไม่ถึงเกณฑ์ 1.8 ล้านบาท/ปี', '') +
      item(!fl.pdpaHidden, 'PDPA', fl.pdpaHidden ? 'มีเหตุข้อมูลรั่วที่ปกปิดไว้ — ความเสี่ยงค่าปรับสูง' : 'ไม่มีประเด็นค้าง', '') +
      '</div>');
    var o = c.office;
    var oq = UI.form.office || (UI.form.office = { type: o.type === 'home' ? 'cowork' : o.type, seats: Math.max(6, RW.Team.headcount(s) + 4) });
    var q = A.officeQuote(s, oq.type, oq.seats);
    var office = UI.panel('ที่ทำงาน', '<div class="kv" style="margin-bottom:10px"><span>ปัจจุบัน</span><span>' + RW.OFFICES[o.type].n + '</span><span>ที่นั่ง</span><span>' + (o.type === 'home' ? 3 : o.seats) + ' (รองรับ ~' + RW.Team.officeCapacity(s) + ' คนตามรูปแบบการทำงาน)</span>' + (o.rent || o.type === 'cowork' ? '<span>ค่าเช่า/เดือน</span><span>' + F.b(o.type === 'cowork' ? o.seats * RW.OFFICES.cowork.rentPerSeat + RW.OFFICES.cowork.fixed : o.rent) + '</span>' : '') + (o.leaseEnd > s.time.w ? '<span>สัญญาเช่าหมด</span><span>' + RW.T.label(o.leaseEnd) + '</span>' : '') + '</div>' +
      '<div class="choices-grid">' + Object.keys(RW.OFFICES).map(function (k) { var x = RW.OFFICES[k]; return '<button type="button" class="card-opt ' + (oq.type === k ? 'on' : '') + '" data-act="officeForm" data-a=\'["type","' + k + '"]\'><b>' + x.n + '</b><span>' + x.d + '</span></button>'; }).join('') + '</div>' +
      (oq.type !== 'home' ? UI.slider('จำนวนที่นั่ง', oq.seats, 2, RW.OFFICES[oq.type].cap, 1, 'officeForm', ['seats']) : '') +
      '<div class="kv" style="margin:8px 0"><span>ค่าเช่า/เดือน</span><span>' + F.b(q.rent) + '</span><span>เงินมัดจำ</span><span>' + F.b(q.deposit) + '</span><span>ค่าตกแต่ง (ตัดค่าเสื่อม 3 ปี)</span><span>' + F.b(q.fitout) + '</span></div>' +
      (o.leaseEnd > s.time.w ? '<div class="alert warn"><span class="dot"></span><span>ยังติดสัญญาเช่า — ย้ายออกก่อนกำหนดจะถูกยึดเงินมัดจำ ' + F.b(o.deposit) + '</span></div>' : '') +
      '<div class="row" style="margin-top:8px">' + UI.btn('ย้ายไปที่นี่', 'moveOffice', [], 'primary') + '</div>');
    var danger = UI.panel('ปิดกิจการ', '<p class="small ink2" style="margin:0 0 8px">ปิดบริษัทอย่างมีระเบียบ: จ่ายค่าชดเชยพนักงานทุกคน ชำระหนี้ แล้วแบ่งเงินที่เหลือตามลำดับสิทธิ์ผู้ถือหุ้น เกมจะจบ</p>' + UI.btn(UI.sel.confirmShutdown ? 'ยืนยัน: ปิดบริษัทตอนนี้' : 'ปิดบริษัท', 'shutdown', [], 'danger'));
    return head + '<div class="grid g2"><div class="stack">' + legal + danger + '</div>' + office + '</div>';
  };
  UI.acts.register = function () { return A.registerCompany(UI.s); };
  UI.acts.assignIP = function () { return A.assignIP(UI.s); };
  UI.acts.cleanBooks = function () { return A.cleanBooks(UI.s); };
  UI.acts.setAuditor = function (k) { return A.setAuditor(UI.s, k); };
  UI.acts.insurance = function (on) { return A.setInsurance(UI.s, on); };
  UI.acts.officeForm = function (k, v) { UI.form.office[k] = v; };
  UI.acts.moveOffice = function () { var f = UI.form.office; return A.moveOffice(UI.s, f.type, f.seats); };
  UI.acts.shutdown = function () {
    if (!UI.sel.confirmShutdown) { UI.sel.confirmShutdown = 1; return { ok: false, msg: 'กดอีกครั้งเพื่อยืนยันปิดบริษัท (จบเกม)' }; }
    UI.sel.confirmShutdown = 0;
    return A.shutdown(UI.s);
  };

  // =====================================================================
  //  INBOX
  // =====================================================================
  UI.views.inbox = function (s) {
    var cat = UI.sub.inbox || 'all';
    var cats = [['all', 'ทั้งหมด'], ['report', 'รายงาน'], ['team', 'ทีม'], ['funding', 'การเงิน/ทุน'], ['sales', 'ขาย'], ['product', 'สินค้า/ปฏิบัติการ'], ['world', 'ตลาด'], ['decisions', 'การตัดสินใจ']];
    var head = '<div class="page-head"><div><h2>กล่องข้อความ</h2></div><div class="row">' + UI.segBtns(cats, cat, 'inboxCat') + UI.btn('อ่านทั้งหมด', 'readAll', [], 'sm') + '</div></div>';
    if (cat === 'decisions') {
      return head + UI.panel('การตัดสินใจที่ผ่านมา', UI.table(['เมื่อ', 'เรื่อง', 'คุณเลือก', 'ผลลัพธ์'], s.events.log.map(function (l) { return [RW.T.label(l.w), h(l.title), h(l.choice), '<span class="small ink2">' + h(l.result) + '</span>']; }), { empty: 'ยังไม่มี' }));
    }
    var map = { funding: ['funding', 'finance'], product: ['product', 'admin', 'founder'], world: ['world', 'event'] };
    var list = s.inbox.filter(function (m) { return cat === 'all' || m.cat === cat || (map[cat] && map[cat].indexOf(m.cat) >= 0); });
    return head + '<section class="panel flush">' + (list.map(function (m) { return UI.mailRow(m, true); }).join('') || '<div class="empty">ว่างเปล่า</div>') + '</section>';
  };
  UI.acts.inboxCat = function (c) { UI.sub.inbox = c; };
  UI.acts.readAll = function () { UI.s.inbox.forEach(function (m) { m.read = true; }); };

  // =====================================================================
  //  WORLD
  // =====================================================================
  UI.views.world = function (s) {
    var w = s.world, M = RW.Models[s.industry];
    var head = '<div class="page-head"><div><h2>ตลาด & เศรษฐกิจ</h2><p>คุณควบคุมเศรษฐกิจไม่ได้ แต่เลือกได้ว่าจะระดมทุนตอนไหนและจะเผาเงินเร็วแค่ไหน</p></div></div>';
    var macro = UI.panel('ภาวะเศรษฐกิจ', '<div class="kv"><span>วัฏจักร</span><span>' + RW.MACRO[w.phase].n + ' (' + w.monthsInPhase + ' เดือน)</span><span>ความต้องการในตลาด</span><span>' + F.pct(w.macro.demand, 0) + '</span><span>อัตราการยกเลิกของลูกค้า</span><span>×' + w.macro.churn.toFixed(2) + '</span><span>ลูกค้าจ่ายช้า</span><span>' + F.pct(w.macro.payDelay, 0) + '</span><span>ดอกเบี้ยนโยบาย</span><span>' + F.pct(w.macro.rate, 2) + '</span><span>บรรยากาศ VC</span><span>' + RW.World.vcLabel(w.vc) + ' (' + w.vc.toFixed(2) + ')</span><span>ค่าเงิน (บาท/ดอลลาร์)</span><span>' + w.fx.toFixed(2) + '</span><span>ดัชนีค่าจ้าง</span><span>' + w.wageIndex.toFixed(3) + '</span><span>ตลาดแรงงาน</span><span>' + (w.talentSupply > 1.15 ? 'หาคนง่าย' : w.talentSupply < 0.85 ? 'แย่งตัวคนเก่ง' : 'ปกติ') + '</span></div>');
    var comps = UI.panel('คู่แข่ง', UI.table(['ชื่อ', 'จุดเด่น', '#คุณภาพ', '#ราคา (เทียบตลาด)', '#การตลาด', 'ระยะ', 'สถานะ'], w.competitors.map(function (c) {
      return [h(c.name) + (c.global ? ' ' + UI.pill('ข้ามชาติ', 'warn') : ''), '<span class="small ink2">' + h(c.desc) + '</span>', Math.round(c.quality), '×' + c.price.toFixed(2), Math.round(c.mkt), c.stage === 'bootstrap' ? 'Bootstrapped' : RW.STAGES[c.stage] ? RW.STAGES[c.stage].n : c.stage, c.alive ? UI.pill('ดำเนินการ', 'good') : UI.pill('ปิดกิจการ', 'crit')];
    })));
    var news = UI.panel('ข่าว', '<div class="stack small">' + (w.news.map(function (n) { return '<div><span class="muted">' + RW.T.label(n.w) + '</span> — ' + h(n.text) + '</div>'; }).join('') || '<div class="empty">ยังไม่มีข่าว</div>') + '</div>');
    return head + '<div class="grid g-side"><div class="stack">' + comps + news + '</div>' + macro + '</div>';
  };

  // =====================================================================
  //  JOURNAL
  // =====================================================================
  UI.views.journal = function (s) {
    var a = s.achievements;
    var ach = Object.keys(RW.Engine.ACH).map(function (k) {
      var x = RW.Engine.ACH[k];
      return '<div class="tile ' + (a[k] ? 'good' : '') + '" style="opacity:' + (a[k] ? 1 : 0.55) + '"><label>' + (a[k] ? RW.T.label(a[k]) : 'ยังไม่ปลดล็อก') + '</label><strong style="font-size:15px">' + x[0] + '</strong><div class="sub">' + x[1] + '</div></div>';
    }).join('');
    var st = s.stats;
    var stats = UI.panel('สถิติ', '<div class="kv"><span>เวลาที่ผ่านไป</span><span>' + (s.time.w / 52).toFixed(1) + ' ปี</span><span>ระดมทุนรวม</span><span>' + F.m(st.raised) + '</span><span>จ้างพนักงานทั้งหมด</span><span>' + s.team.history.hired + ' คน</span><span>ลาออก / ถูกไล่ออก / เลย์ออฟ</span><span>' + s.team.history.quit + ' / ' + s.team.history.fired + ' / ' + s.team.history.laidOff + '</span><span>พนักงานสูงสุด</span><span>' + st.peakHC + ' คน</span><span>รายได้สูงสุดต่อเดือน</span><span>' + F.m(st.maxRevenueMonth) + '</span><span>รายได้จากงานที่ปรึกษา</span><span>' + F.m(st.consult || 0) + '</span><span>Seed ของเกม</span><span>' + s.seed + '</span></div>');
    return '<div class="page-head"><div><h2>บันทึก & ความสำเร็จ</h2></div></div><div class="grid g-side"><div class="tiles">' + ach + '</div>' + stats + '</div>';
  };

  // =====================================================================
  //  SETTINGS
  // =====================================================================
  UI.views.settings = function (s) {
    var slots = UI.SLOTS.map(function (sl) {
      var m = UI.slotMeta(sl);
      return [sl === 'auto' ? 'อัตโนมัติ' : 'ช่อง ' + sl, m ? h(m.name) + ' · ' + h(m.label) : '<span class="muted">ว่าง</span>', '<div class="row">' + (sl !== 'auto' ? UI.btn('เซฟทับ', 'saveSlot', [sl], 'sm') : '') + (m ? UI.btn('โหลด', 'loadSlot', [sl], 'sm') : '') + '</div>'];
    });
    var theme = document.documentElement.getAttribute('data-theme') || 'system';
    return '<div class="page-head"><div><h2>เซฟ & ตั้งค่า</h2></div></div><div class="grid g2"><div class="stack">' +
      UI.panel('ช่องเซฟ (ในเบราว์เซอร์นี้)', UI.table(['ช่อง', 'เกม', ''], slots)) +
      UI.panel('ย้ายเซฟข้ามเครื่อง', '<p class="small ink2" style="margin:0 0 8px">คัดลอกรหัสนี้เก็บไว้ แล้ววางในช่องด้านล่างบนเครื่องอื่นเพื่อเล่นต่อ</p><textarea id="exp_code" rows="3" style="width:100%" readonly>' + (UI.sel.showCode ? h(UI.exportCode()) : '') + '</textarea><div class="row" style="margin:6px 0 12px">' + UI.btn('สร้างรหัสเซฟ', 'showCode', [], 'sm') + UI.btn('คัดลอก', 'copyCode', [], 'sm') + '</div>' +
        '<textarea id="imp_code" rows="3" style="width:100%" placeholder="วางรหัสเซฟที่นี่"></textarea><div class="row" style="margin-top:6px">' + UI.btn('โหลดจากรหัส', 'importCode', [], 'sm primary') + '</div>') +
      '</div><div class="stack">' +
      UI.panel('ธีม', UI.segBtns([['system', 'ตามระบบ'], ['light', 'สว่าง'], ['dark', 'มืด']], theme, 'theme')) +
      UI.panel('วิธีเล่นโดยย่อ', '<div class="stack small ink2"><div>• กด <b>สัปดาห์ถัดไป</b> (หรือ Space) เพื่อเดินเวลา เกมจะหยุดเมื่อมีเรื่องให้ตัดสินใจ</div><div>• ทุกปลายเดือนจ่ายเงินเดือน ค่าเช่า ค่าเซิร์ฟเวอร์ — ดูไฟ Runway ด้านบนเสมอ</div><div>• ช่วงแรกเวลาของคุณคือทุกอย่าง: สร้างสินค้า คุยกับลูกค้า และขายเอง</div><div>• ระดมทุนใช้เวลา 2–6 เดือน เริ่มก่อนเงินจะหมดอย่างน้อย 6 เดือน</div><div>• เกมจบเมื่อเงินสดติดลบนาน 6 สัปดาห์, คุณถังแตก, ถูกบอร์ดปลด, ขายกิจการ, IPO หรือครบ 10 ปี</div><div>• คะแนนคือความมั่งคั่งสุทธิของคุณ ไม่ใช่ขนาดบริษัท</div></div>') +
      UI.panel('เกมใหม่', '<p class="small ink2" style="margin:0 0 8px">เกมปัจจุบันยังอยู่ในเซฟอัตโนมัติจนกว่าจะเริ่มเกมใหม่</p>' + UI.btn('กลับหน้าแรก / เริ่มบริษัทใหม่', 'newGame', [], 'danger')) +
      '</div></div>';
  };
  UI.acts.saveSlot = function (sl) { return UI.save(sl) ? { ok: true, msg: 'บันทึกแล้ว' } : { ok: false, msg: 'บันทึกไม่ได้ (เบราว์เซอร์ไม่อนุญาตพื้นที่จัดเก็บ) — ใช้รหัสเซฟแทน' }; };
  UI.acts.showCode = function () { UI.sel.showCode = 1; };
  UI.acts.copyCode = function () {
    var ta = document.getElementById('exp_code');
    var code = UI.exportCode();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(function () { UI.toast('คัดลอกแล้ว'); }, function () { UI.sel.showCode = 1; UI.render(); var t = document.getElementById('exp_code'); if (t) { t.focus(); t.select(); } });
    } else { UI.sel.showCode = 1; UI.render(); var t2 = document.getElementById('exp_code'); if (t2) { t2.focus(); t2.select(); } }
    return { render: false };
  };
  UI.acts.importCode = function () {
    var ta = document.getElementById('imp_code');
    if (!ta || !ta.value.trim()) return { ok: false, msg: 'ยังไม่ได้วางรหัส' };
    return UI.importCode(ta.value) ? { ok: true, msg: 'โหลดเกมแล้ว' } : { ok: false, msg: 'รหัสไม่ถูกต้อง' };
  };
})(globalThis.RW = globalThis.RW || {});
