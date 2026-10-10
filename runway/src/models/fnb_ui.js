/* RUNWAY — F&B screens */
(function (RW) {
  'use strict';
  var M = RW.Models.fnb, UI = RW.UI, F = RW.F, U = RW.U, h = UI.h;

  M.capitalHint = 'ร้านแรกในตึกแถวใช้เงิน ~1–2 ล้าน (ปิ้งย่าง/ชาบู ~2.5–4 ล้าน) และควรมีเงินสำรองอีก 3–4 เดือน · เช่าซื้ออุปกรณ์ช่วยได้';
  M.guide = [
    'ตัวเลขคนเดินผ่านที่โบรกเกอร์บอกมักสวยเกินจริง ±30% — ทำเลแย่คือแผลที่แก้ไม่ได้ตลอดสัญญาเช่า 3 ปี',
    'ร้านใหม่เริ่มที่ ~40% ของศักยภาพและใช้ 3–4 เดือนกว่าจะเต็มที่ ต้องมีเงินสำรองจ่ายค่าเช่าและค่าแรงช่วงนั้น',
    'Prime cost (วัตถุดิบ + ค่าแรง) ไม่ควรเกิน ~65% · ค่าเช่าไม่ควรเกิน ~15% ของยอดขาย',
    'เดลิเวอรีโดน GP ~30% ราคาบนแอปต้องสูงกว่าหน้าร้าน คลาวด์คิทเช่นลงทุนต่ำแต่กำไรบาง',
    'คุณดูแลร้านเองได้ 1–2 สาขา หลังจากนั้นต้องมีผู้จัดการสาขาที่เก่ง ไม่งั้นคุณภาพไม่สม่ำเสมอ',
    'VC ไม่ค่อยลงทุนร้านอาหาร — เชนในไทยโตด้วยกำไรของร้านเดิม เงินกู้ SME หุ้นส่วนสาขา และแฟรนไชส์ · ทำสาขาต้นแบบให้กำไรก่อน แล้วหุ้นส่วนจะมาเอง',
    'จัดพนักงานน้อยประหยัดค่าแรงแต่บริการช้า เรตติ้งตก และคนลาออก',
    'ครัวกลางคุ้มเมื่อมี 3–4 สาขา: ลดต้นทุนวัตถุดิบและทำให้รสชาติเหมือนกันทุกสาขา',
    'แฟรนไชส์ขยายเร็วด้วยเงินคนอื่น แต่แฟรนไชส์ซีทำแย่ แบรนด์คุณพังด้วย',
    'สาขาที่ขาดทุนต่อเนื่องหลายเดือน การปิดเร็วมักดีกว่าแบกต่อ (แต่จะเสียมัดจำถ้ายังไม่หมดสัญญา)'
  ];
  M.headline = function (s) {
    var b = s.biz, n = M.openBranches(b).length, bl = b.branches.filter(function (x) { return x.state === 'building'; }).length;
    return b.product + ' · ' + (n ? n + ' สาขาเปิดอยู่' : 'ยังไม่มีร้าน') + (bl ? ' · กำลังสร้าง ' + bl : '') + (b.fr.units.length ? ' · แฟรนไชส์ ' + b.fr.units.length : '') + ' · เรตติ้ง ' + b.rating.toFixed(2);
  };
  M.topMetric = function (s) { return ['ยอดขาย/เดือน', F.m(s.kpi.revenueMonthly)]; };
  M.snapshot = function (s) { return { covers: s.biz.lifetime.covers }; };
  M.snapDiff = function (s, a, b) { return 'ลูกค้า ' + F.num(Math.round(b.covers - a.covers)) + ' คน'; };
  M.milestones = function (s) {
    var b = s.biz, ob = M.openBranches(b);
    return [
      ['เซ็นสัญญาเช่าร้านแรก', b.branches.length > 0, 'branches'],
      ['เปิดร้านแรก', ob.length > 0, 'branches'],
      ['สาขาแรกมีกำไรระดับหน้าร้าน (4-wall)', ob.some(function (x) { return x.last && x.last.wall > 0; }), 'branches'],
      ['Prime cost ต่ำกว่า 62%', s.kpi.primeCost != null && s.kpi.primeCost < 0.62, 'menu'],
      ['เปิดสาขาที่ 2', ob.length >= 2, 'branches']
    ];
  };

  var ui = (M.ui = { tabs: [{ id: 'branches', n: 'สาขา & ทำเล' }, { id: 'menu', n: 'เมนู & ครัว' }, { id: 'fmarketing', n: 'การตลาด & แฟรนไชส์' }], render: {}, acts: {} });

  ui.tiles = function (s) {
    var k = s.kpi;
    return UI.tile('สาขา', k.branches + (k.building ? ' (+' + k.building + ')' : ''), k.franchise ? 'แฟรนไชส์ ' + k.franchise : '') +
      UI.tile(UI.tip('4-wall margin', 'กำไรระดับหน้าร้าน (ก่อนค่าใช้จ่ายสำนักงานใหญ่) ร้านดีควรได้ 15–25%'), k.wallMargin != null ? F.pct(k.wallMargin, 0) : '–', '', k.wallMargin != null && k.wallMargin < 0 ? 'crit' : k.wallMargin > 0.15 ? 'good' : '') +
      UI.tile(UI.tip('Prime cost', 'ต้นทุนวัตถุดิบ + ค่าแรง ÷ ยอดขาย ไม่ควรเกิน ~65%'), k.primeCost != null ? F.pct(k.primeCost, 0) : '–', '', k.primeCost > 0.68 ? 'crit' : '') +
      UI.tile('ลูกค้า/เดือน', F.num(k.covers || 0), 'เรตติ้ง ' + s.biz.rating.toFixed(2) + ' ★');
  };

  ui.overviewExtra = function (s) {
    var hm = s.hist.monthly;
    return UI.panel('จำนวนลูกค้าต่อเดือน', UI.chart({ labels: hm.map(function (m) { return m.label; }), series: [{ name: 'ลูกค้า (หน้าร้าน+เดลิเวอรี)', color: 'var(--s1)', data: hm.map(function (m) { return m.k.covers || 0; }), area: true }], fmt: F.k, tipFmt: F.num }));
  };

  ui.unitEconomics = function (s) {
    var b = s.biz;
    var walls = M.openBranches(b).filter(function (x) { return x.last; });
    var rev = U.sum(walls, function (x) { return x.last.rev; });
    function pct(f) { return rev > 0 ? F.pct(U.sum(walls, f) / rev, 1) : '–'; }
    return '<div class="kv"><span>ยอดขายรวมสาขา (เดือนที่แล้ว)</span><span>' + F.b(rev) + '</span>' +
      '<span>ต้นทุนวัตถุดิบ</span><span>' + pct(function (x) { return x.last.food; }) + '</span>' +
      '<span>ค่าแรงหน้าร้าน</span><span>' + pct(function (x) { return x.last.labor; }) + '</span>' +
      '<span>ค่าเช่า</span><span>' + pct(function (x) { return x.last.rent; }) + '</span>' +
      '<span>ค่าน้ำไฟ</span><span>' + pct(function (x) { return x.last.util; }) + '</span>' +
      '<span>GP แอปเดลิเวอรี</span><span>' + pct(function (x) { return x.last.gp; }) + '</span>' +
      '<span>4-wall margin</span><span>' + pct(function (x) { return x.last.wall; }) + '</span>' +
      '<span>' + UI.tip('คืนทุนค่าตกแต่ง', 'ค่าตกแต่งสาขาเฉลี่ย ÷ กำไรระดับสาขาต่อเดือน') + '</span><span>' + (s.kpi.payback ? s.kpi.payback.toFixed(0) + ' เดือน' : '–') + '</span></div>';
  };

  // ---------------- BRANCHES ----------------
  ui.render.branches = function (s) {
    var b = s.biz, c = M.CONCEPTS[b.concept];
    var head = '<div class="page-head"><div><h2>สาขา & ทำเล</h2><p>ทำเลกำหนดชะตาร้าน สัญญาเช่า 3 ปีถอนตัวยาก — ตัวเลขคนเดินผ่านจากโบรกเกอร์มักสวยเกินจริง</p></div></div>';
    var mgrs = RW.Team.all(s).filter(function (e) { return e.role === 'branchmgr' || e.role === 'ops'; });
    var rows = b.branches.filter(function (x) { return x.state !== 'closed'; }).map(function (br) {
      var l = br.last;
      var status = br.state === 'building' ? UI.pill((br.opened != null ? 'ปิดซ่อมแซม — เปิดอีกครั้ง ' : 'กำลังตกแต่ง — เปิด ') + RW.T.label(br.ready), br.opened != null ? 'warn' : 'accent') : UI.pill('เปิดมา ' + Math.round((s.time.w - br.opened) / 4.33) + ' เดือน', 'good');
      var sel = '<select data-act="fAssign" data-a=\'["' + br.id + '"]\' aria-label="ผู้จัดการสาขา"><option value="">' + (br.mgr ? '— ไม่มี —' : 'คุณดูแลเอง') + '</option>' + mgrs.map(function (e) { return '<option value="' + e.id + '"' + (br.mgr === e.id ? ' selected' : '') + '>' + h(e.name) + ' (' + Math.round(e.est) + ')</option>'; }).join('') + '</select>';
      return [
        '<b>' + h(br.n) + '</b><div class="tiny muted">' + M.LOCS[br.type].n + ' · ' + br.sqm + ' ตร.ม. · ' + (br.seats || 0) + ' ที่นั่ง' + (c.take ? ' + ซื้อกลับ ~' + F.pct(c.take, 0) : '') + '</div>' + status,
        l ? F.m(l.rev) : '–', l ? F.num(l.covers) + ' / ' + F.num(l.deliv) : '–',
        l ? '<span class="' + (l.wall < 0 ? 'crit' : 'good') + '">' + F.m(l.wall) + '</span><div class="tiny muted">' + F.pct(l.wall / Math.max(1, l.rev), 0) + '</div>' : '–',
        br.state === 'open' ? (br.rating || 0).toFixed(2) + ' ★' : '–',
        br.state === 'open' ? '<div style="min-width:70px">' + UI.meter(br.util * 100, 100, br.util > 0.95 ? 'warn' : '') + '<div class="tiny muted">' + F.pct(br.util, 0) + '</div></div>' : '–',
        br.staff + ' คน<div class="tiny muted">ฝีมือ ' + Math.round(br.staffSkill) + '</div>',
        sel + (br.mq ? '<div class="tiny muted">คุณภาพการบริหาร ' + Math.round(br.mq) + '</div>' : ''),
        F.b(br.rent) + '<div class="tiny muted">สัญญาถึง ' + RW.T.label(br.leaseEnd) + '</div>',
        UI.btn('ปิดสาขา', 'fClose', [br.id], 'sm danger')
      ];
    });
    var list = UI.panel('สาขาของคุณ (เดือนที่แล้ว)', UI.table(['สาขา', '#ยอดขาย', '#ลูกค้า หน้าร้าน/ส่ง', '#กำไรสาขา', '#เรตติ้ง', UI.tip('ใช้กำลังร้าน', 'ลูกค้าที่รับได้เทียบกับความจุ (ที่นั่ง × รอบโต๊ะ + ซื้อกลับบ้าน) — เกิน 95% คือคิวยาว ลูกค้าหลุด'), '#พนักงาน', 'ผู้จัดการ', '#ค่าเช่า', ''], rows, { empty: 'ยังไม่มีสาขา' }) +
      UI.slider('จำนวนพนักงานต่อกะ (เทียบความจำเป็น)', Math.round(b.staffing * 100), 75, 130, 5, 'fStaffing', [], 'pct') + '<p class="tiny muted" style="margin:-2px 0 0">ค่าแรงเฉลี่ย ' + F.b(b.wage) + '/คน/เดือน (อิงค่าแรงขั้นต่ำ) · คนน้อยประหยัดแต่บริการช้า เรตติ้งตก คนลาออก · พนักงานหน้าร้านจ้างผ่านทีม Ops/HR โดยอัตโนมัติ</p>');
    var sites = b.sites ? b.sites.list : [];
    var partnerOK = M.partnerReady(s);
    var siteRows = sites.map(function (x) {
      var L0 = M.LOCS[x.type];
      var deposit = x.rent * 3, pre = 120000 + c.staff * 15000;
      return ['<b>' + M.LOCS[x.type].n + ' — ' + h(x.area) + '</b><div class="tiny muted">' + L0.d + '</div>', x.sqm + ' ตร.ม.', x.type === 'cloud' ? 'เดลิเวอรีอย่างเดียว' : F.num(x.quoted) + ' คน/วัน' + (x.counted ? '<div class="tiny ' + (x.counted < x.quoted * 0.9 ? 'warn' : 'good') + '">นับจริง ' + F.num(x.counted) + '</div>' : '<div style="margin-top:3px">' + UI.researchBtn('count', x.id, 'นับเอง') + '</div>'), F.b(x.rent), F.m(x.fit), F.m(deposit + x.fit + pre), '<div class="row" style="gap:4px;flex-wrap:nowrap">' + UI.btn('เซ็นสัญญา', 'fOpen', [x.id, false], 'sm primary') + UI.btn('+ เช่าซื้ออุปกรณ์ 50%', 'fOpen', [x.id, true], 'sm', 'title="ผ่อนค่าอุปกรณ์ครัวครึ่งหนึ่ง 36 เดือน ดอกเบี้ยสูง"') + (partnerOK ? UI.btn('+ หุ้นส่วนสาขา', 'fOpen', [x.id, 'partner'], 'sm', 'title="หุ้นส่วนออกเงิน ' + F.pct(M.PARTNER.funds, 0) + ' ของเงินที่ต้องใช้ แลกส่วนแบ่ง ' + F.pct(M.PARTNER.share, 0) + ' ของกำไรสาขาทุกเดือน ซื้อคืนได้ที่ ' + M.PARTNER.buyout + ' เท่า"') : '') + '</div>'];
    });
    var scout = UI.panel('หาทำเลใหม่', '<div class="row" style="margin-bottom:10px">' + Object.keys(M.LOCS).map(function (k) { return UI.btn(M.LOCS[k].n, 'fScout', [k], 'sm' + (b.sites && b.sites.type === k ? ' primary' : '')); }).join('') + '</div>' +
      UI.table(['ทำเล', '#ขนาด', '#คนเดินผ่าน (โบรกเกอร์บอก)', '#ค่าเช่า/เดือน', '#ค่าตกแต่ง', '#เงินที่ต้องใช้', ''], siteRows, { empty: 'กดประเภททำเลเพื่อให้โบรกเกอร์หาที่ (ค่าสำรวจ ฿8,000 / ห้าง ฿30,000)' }) +
      '<p class="tiny muted" style="margin-top:6px">เงินที่ต้องใช้ = มัดจำ 3 เดือน + ค่าตกแต่งและอุปกรณ์ครัว + ค่าจ้าง/อบรม/โปรโมตก่อนเปิด · ใช้เวลา 6–10 สัปดาห์ก่อนเปิด · ยอดขายช่วงแรก ~40% แล้วค่อยๆ โตใน 4 เดือน · ' + (partnerOK ? 'มีนักลงทุนสนใจเป็นหุ้นส่วนสาขาแล้ว (ออกเงิน ' + F.pct(M.PARTNER.funds, 0) + ' รับส่วนแบ่งกำไรสาขา ' + F.pct(M.PARTNER.share, 0) + ' — ซื้อคืนได้ในหน้าการเงิน > เงินกู้)' : 'เมื่อมีสาขาต้นแบบที่ทำกำไรต่อเนื่อง 3 เดือน จะหาหุ้นส่วนลงทุนสาขาได้') + '</p>');
    return head + list + '<div style="margin-top:14px">' + scout + '</div>';
  };
  ui.acts.fAssign = function (br, emp) { return M.act.assign(UI.s, br, emp); };
  ui.acts.fStaffing = function (v) { return M.act.setStaffing(UI.s, v / 100); };
  ui.acts.fScout = function (t) { return M.act.scout(UI.s, t); };
  ui.acts.fOpen = function (id, fin) { return M.act.open(UI.s, id, fin); };
  ui.acts.fClose = function (id) {
    if (UI.sel.confirmClose !== id) { UI.sel.confirmClose = id; return { ok: false, msg: 'กดอีกครั้งเพื่อยืนยันปิดสาขา (ถ้ายังไม่หมดสัญญาจะถูกยึดมัดจำ)' }; }
    UI.sel.confirmClose = null; return M.act.close(UI.s, id);
  };

  // ---------------- MENU ----------------
  ui.render.menu = function (s) {
    var b = s.biz, c = M.CONCEPTS[b.concept];
    var ck = b.ck ? (b.ck.ready <= s.time.w ? UI.pill('ครัวกลางเปิดใช้งาน', 'good') : UI.pill('กำลังสร้าง เสร็จ ' + RW.T.label(b.ck.ready), 'accent')) : UI.btn('สร้างครัวกลาง (฿7.5M)', 'fCK', [], '', M.openBranches(b).length < 2 ? 'disabled' : '');
    var head = '<div class="page-head"><div><h2>เมนู & ครัว</h2><p>รสชาติดีพาลูกค้ามาครั้งแรก ความสม่ำเสมอพาเขากลับมา — และต้นทุนวัตถุดิบตัดสินว่ากำไรหรือขาดทุน</p></div></div>';
    var foodPct = c.food + b.foodAdj - (b.ck && b.ck.ready <= s.time.w ? 0.035 : 0);
    var menu = UI.panel('เมนูและราคา', '<div class="stack">' + UI.bar('คุณภาพเมนู', b.menuQ, 100, b.menuQ < 45 ? 'warn' : 'good', Math.round(b.menuQ)) + UI.bar('ความสม่ำเสมอ', b.consistency, 100, b.consistency < 50 ? 'warn' : 'good', Math.round(b.consistency)) + '</div>' +
      UI.slider('ระดับราคา (เทียบตลาด)', Math.round(b.priceIdx * 100), 70, 160, 5, 'fPrice', [], 'pct') +
      '<div class="kv" style="margin-top:6px"><span>ราคาเฉลี่ยต่อบิล</span><span>' + F.b(c.ticket * b.priceIdx) + '</span><span>ต้นทุนวัตถุดิบ (เป้าหมาย)</span><span>' + F.pct(foodPct, 1) + ' + ของเสีย</span></div>' +
      '<div class="row" style="margin-top:10px">' + (b.menuProj ? UI.pill('กำลังพัฒนาเมนู ' + F.pct(b.menuProj.prog / b.menuProj.need, 0), 'accent') : UI.btn('พัฒนาเมนูใหม่ (฿60K)', 'fMenu', [])) + UI.btn('ลดต้นทุนสูตร', 'fCostCut', [], 'sm') + UI.btn('ใช้วัตถุดิบพรีเมียม', 'fPremium', [], 'sm') + '</div>' +
      '<div class="row" style="margin-top:8px"><span class="tiny muted">Insight ลูกค้า ' + Math.round(b.insight) + '% (ช่วยให้เมนูใหม่ปังขึ้น):</span>' + UI.researchBtn('taste') + '</div>');
    var kitchen = UI.panel('ครัวกลาง', '<p class="small ink2" style="margin:0 0 8px">ผลิตซอส วัตถุดิบเตรียม และเบเกอรี่ส่งทุกสาขา: ต้นทุนวัตถุดิบ −3.5pp, ของเสีย −30%, รสชาติสม่ำเสมอขึ้นมาก — คุ้มเมื่อมี 3–4 สาขาขึ้นไป · ค่าดำเนินการ ~฿220K/เดือน</p>' + ck);
    var deliv = UI.panel('แอปเดลิเวอรี', '<label class="row small"><input type="checkbox" ' + (b.deliv.on ? 'checked' : '') + ' data-act="fDeliv"> ขายผ่านแอปเดลิเวอรี (GP ~30% + บรรจุภัณฑ์ 5%)</label>' + UI.slider('ส่วนลดโปรโมชันในแอป', Math.round(b.deliv.promo * 100), 0, 30, 1, 'fPromo', [], 'pct') + '<p class="tiny muted" style="margin:-2px 0 0">ส่วนลดช่วยดันอันดับในแอป แต่เงินมาจากกระเป๋าคุณ</p>');
    return head + '<div class="grid g2">' + menu + '<div class="stack">' + kitchen + deliv + '</div></div>';
  };
  ui.acts.fPrice = function (v) { return M.act.setPrice(UI.s, v / 100); };
  ui.acts.fMenu = function () { return M.act.menuRD(UI.s); };
  ui.acts.fCostCut = function () { return M.act.costCut(UI.s); };
  ui.acts.fPremium = function () { return M.act.premiumIngredients(UI.s); };
  ui.acts.fCK = function () { return M.act.buildCK(UI.s); };
  ui.acts.fDeliv = function () { return M.act.toggleDelivery(UI.s); };
  ui.acts.fPromo = function (v) { return M.act.setPromo(UI.s, v / 100); };

  // ---------------- MARKETING & FRANCHISE ----------------
  ui.render.fmarketing = function (s) {
    var b = s.biz;
    var head = '<div class="page-head"><div><h2>การตลาด & แฟรนไชส์</h2><p>คนลองครั้งแรกเพราะรีวิวและกระแส แต่ธุรกิจอยู่ได้เพราะลูกค้าประจำ</p></div></div>';
    var mk = UI.panel('แคมเปญ', '<div class="stack">' +
      '<div class="row between"><span><b>ฟู้ดบล็อกเกอร์ 8 คน</b><div class="tiny muted">กระแส 3 สัปดาห์</div></span>' + UI.btn('฿40,000', 'fCamp', ['blogger'], 'sm') + '</div>' +
      '<div class="row between"><span><b>KOL สายกินชื่อดัง</b><div class="tiny muted">ลูกค้าใหม่หลั่งไหล 4 สัปดาห์</div></span>' + UI.btn('฿250,000', 'fCamp', ['kol'], 'sm') + '</div>' +
      '<div class="row between"><span><b>ออกทีวี + โฆษณาใหญ่</b><div class="tiny muted">แบรนด์โตแรง 6 สัปดาห์</div></span>' + UI.btn('฿1,200,000', 'fCamp', ['tv'], 'sm') + '</div>' +
      '<label class="row small"><input type="checkbox" ' + (b.loyalty ? 'checked' : '') + ' data-act="fLoyalty"> แอปสมาชิก/สะสมแต้ม (฿15K + ฿2K/สาขา ต่อเดือน)</label>' +
      UI.bar('แบรนด์', b.brand, 100, '', Math.round(b.brand)) + '</div>');
    var fr = b.fr;
    var frP = UI.panel('แฟรนไชส์', '<p class="small ink2" style="margin:0 0 8px">ขยายเร็วด้วยเงินคนอื่น: รับค่าแรกเข้า ' + F.b(fr.fee) + ' และรอยัลตี้ ' + F.pct(fr.royalty, 0) + ' ของยอดขาย — แต่ถ้าแฟรนไชส์ซีทำร้านแย่ แบรนด์คุณเสียด้วย</p>' +
      (fr.on ? '<div class="kv"><span>สาขาแฟรนไชส์</span><span>' + fr.units.length + '</span><span>รอยัลตี้เดือนที่แล้ว</span><span>' + F.b(b.stats.length ? b.stats[b.stats.length - 1].royalty : 0) + '</span><span>คุณภาพเฉลี่ยแฟรนไชส์ซี</span><span>' + (fr.units.length ? Math.round(U.avg(fr.units, function (u) { return u.q; })) : '–') + '</span></div>' : UI.btn('เริ่มขายแฟรนไชส์ (฿1.5M)', 'fFranchise', [], 'primary')));
    return head + '<div class="grid g2">' + mk + frP + '</div>';
  };
  ui.acts.fCamp = function (t) { return M.act.campaign(UI.s, t); };
  ui.acts.fLoyalty = function () { return M.act.toggleLoyalty(UI.s); };
  ui.acts.fFranchise = function () { return M.act.startFranchise(UI.s); };
})(globalThis.RW = globalThis.RW || {});
