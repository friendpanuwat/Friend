/* RUNWAY — Food & Beverage chain model */
(function (RW) {
  'use strict';
  var R = RW.R, U = RW.U, F = RW.F, L = RW.Ledger;
  var M = (RW.Models.fnb = { id: 'fnb', b2c: true });
  M.n = 'ร้านอาหาร/คาเฟ่ (สร้างเชน)';
  M.d = 'เปิดสาขาแรกด้วยเงินเก็บ ทำให้กำไรต่อสาขาดีพอ แล้วขยายเป็นเชน ครัวกลาง และแฟรนไชส์ — ทำเลคือทุกอย่าง';
  M.sampleName = 'บ้านสวนคาเฟ่';

  var CONCEPTS = (M.CONCEPTS = {
    cafe: { n: 'คาเฟ่กาแฟสเปเชียลตี้', d: 'ตั๋วเฉลี่ยต่ำ ต้นทุนวัตถุดิบต่ำ หมุนโต๊ะเร็ว แข่งกันดุทุกหัวมุม', ticket: 145, food: 0.31, capture: 0.05, turns: 5, take: 0.4, staff: 4, fitSqm: 14000, util: 0.05, deliv: 30, sqm: [45, 110], seatsPerSqm: 0.45, menuQ: 55 },
    thai: { n: 'ร้านอาหารไทยสตรีทฟู้ดพรีเมียม', d: 'ขายดีทั้งหน้าร้านและเดลิเวอรี ต้นทุนวัตถุดิบผันผวน ใช้คนเยอะ', ticket: 185, food: 0.32, capture: 0.045, turns: 4, take: 0.15, staff: 6, fitSqm: 11000, util: 0.06, deliv: 60, sqm: [60, 130], seatsPerSqm: 0.5, menuQ: 55 },
    bbq: { n: 'ปิ้งย่าง/ชาบูบุฟเฟ่ต์', d: 'ตั๋วสูง พื้นที่ใหญ่ ลงทุนหนัก ไฟฟ้าแพง ขายมื้อเย็นเป็นหลัก', ticket: 459, food: 0.38, capture: 0.035, turns: 2.4, take: 0, staff: 8, fitSqm: 18000, util: 0.09, deliv: 8, sqm: [110, 220], seatsPerSqm: 0.55, menuQ: 50 },
    bakery: { n: 'เบเกอรี่และขนมโฮมเมด', d: 'ของฝาก ของขวัญ ขายดีเทศกาล ครัวกลางช่วยได้มาก ของเหลือคือขยะ', ticket: 125, food: 0.30, capture: 0.05, turns: 6, take: 0.65, staff: 4, fitSqm: 12000, util: 0.05, deliv: 35, sqm: [40, 90], seatsPerSqm: 0.35, menuQ: 55 }
  });

  var LOCS = (M.LOCS = {
    street: { n: 'ตึกแถวริมถนน', foot: 2200, rent: [28000, 62000], sqmMult: 1, fit: 1, weekend: 1, deliv: 1.0, d: 'ค่าเช่าถูก ลูกค้าแถวบ้าน ที่จอดรถน้อย', lease: 36 },
    community: { n: 'คอมมูนิตี้มอลล์', foot: 2700, rentSqm: [700, 1000], fit: 1.05, weekend: 1.25, deliv: 1.1, d: 'ครอบครัวและวันหยุด มีที่จอดรถ', lease: 36 },
    cbd: { n: 'อาคารสำนักงานย่าน CBD', foot: 4200, rentSqm: [900, 1300], fit: 1.15, weekend: 0.35, deliv: 1.3, d: 'มื้อกลางวันวันธรรมดาแน่นมาก วันหยุดเงียบสนิท', lease: 36 },
    mall: { n: 'ห้างสรรพสินค้าใหญ่', foot: 6500, rentSqm: [1600, 2600], fit: 1.35, weekend: 1.35, deliv: 0.9, d: 'คนเดินเยอะที่สุด ค่าเช่าและค่าตกแต่งแพงที่สุด ห้างกำหนดมาตรฐานเข้มงวด', lease: 36 },
    cloud: { n: 'คลาวด์คิทเช่น (เดลิเวอรีอย่างเดียว)', foot: 0, rent: [22000, 35000], fit: 0.35, weekend: 1, deliv: 1.6, d: 'ไม่มีหน้าร้าน ลงทุนต่ำ แต่ต้องพึ่งแอปเดลิเวอรีที่หัก GP ~30%', lease: 12, sqmFixed: 35 }
  });

  M.founderMap = {
    build: { branch: 0.9, kitchen: 0.5, menu: 0.35 },
    sell: { sales: 1 },
    market: { mkt: 0.8, content: 0.8 },
    discover: { discovery: 1, menu: 0.2 },
    team: { hr: 0.7 },
    fundraise: {},
    admin: { finance: 0.5, ops: 0.5 },
    consult: {}
  };

  M.concepts = function () { return Object.keys(CONCEPTS).map(function (k) { return { id: k, n: CONCEPTS[k].n, d: CONCEPTS[k].d }; }); };

  M.init = function (state, opt) {
    var key = opt.concept || 'cafe';
    var c = CONCEPTS[key];
    var biz = {
      concept: key, product: c.n, branches: [], nextB: 1, sites: null, menuQ: c.menuQ, priceIdx: 1.0, foodAdj: 0, menuProj: null,
      deliv: { on: true, promo: 0.05 }, loyalty: false, brand: 4, buzz: [], ck: null, fr: { on: false, count: 0, fee: 600000, royalty: 0.05, units: [] },
      insight: 0, weekRev: 0, mstats: M.blank(), stats: [], rating: 4.2, consistency: 60, staffing: 1.0, wage: 13500, lifetime: { covers: 0 }
    };
    state.biz = biz;
    var comps = [['เชนร้านดังจากญี่ปุ่น', 'แบรนด์ต่างชาติเงินหนา ขยายสาขาเร็ว', 70, 1.2, 70], ['ร้านเจ้าเก่าแก่ 30 ปี', 'ลูกค้าประจำเหนียวแน่น ราคาย่อมเยา', 62, 0.85, 30], ['แบรนด์ไวรัลในโซเชียล', 'คิวยาวช่วงแรก แต่ไม่แน่ว่าจะอยู่ยาว', 55, 1.05, 65]];
    comps.forEach(function (x) { RW.World.addCompetitor(state, { name: x[0], desc: x[1], quality: x[2], price: x[3], mkt: x[4], cash: R.range(10e6, 80e6), burn: R.range(0.5e6, 2e6), stage: R.pick(['bootstrap', 'A', 'B']), aggr: R.range(0.3, 0.7) }); });
    M.scout(state, 'street');
    return biz;
  };
  M.blank = function () { return { covers: 0, deliv: 0, rev: 0, dineRev: 0, delivRev: 0, food: 0, labor: 0, lost: 0, royalty: 0 }; };
  M.welcome = function (state) {
    var c = CONCEPTS[state.biz.concept];
    return 'คุณลาออกมาเปิด "' + c.n + '" — ' + c.d + '\n\nสิ่งที่ต้องทำช่วงแรก:\n1) จดทะเบียนบริษัท\n2) ดูทำเลที่หน้า "สาขา" — ตัวเลขคนเดินผ่านจากโบรกเกอร์เป็นแค่ค่าประมาณ ของจริงอาจต่างไป ±30%\n3) จ่ายมัดจำ ค่าตกแต่ง เปิดร้าน แล้วทำให้สาขาแรกมีกำไรก่อนคิดขยาย\n4) ต้นทุนวัตถุดิบ + ค่าแรง (Prime cost) ไม่ควรเกิน ~60–65% ของยอดขาย\n\nร้านอาหารไทยส่วนใหญ่ปิดตัวภายใน 3 ปี — เพราะเปิดผิดทำเล และขยายเร็วเกินไป';
  };

  // ---------- Sites ----------
  M.scout = function (state, type) {
    var b = state.biz, c = CONCEPTS[b.concept], L0 = LOCS[type];
    var sites = [];
    for (var i = 0; i < 3; i++) {
      var sqm = L0.sqmFixed || Math.round(R.range(c.sqm[0], c.sqm[1]) / 5) * 5;
      var rent = L0.rent ? Math.round(R.range(L0.rent[0], L0.rent[1]) / 1000) * 1000 : Math.round(sqm * R.range(L0.rentSqm[0], L0.rentSqm[1]) / 1000) * 1000;
      var trueFoot = L0.foot * R.range(0.6, 1.45);
      var quoted = trueFoot * R.range(0.8, 1.3); // broker estimates are optimistic and noisy
      var area = ['ลาดพร้าว', 'อารีย์', 'ทองหล่อ', 'บางนา', 'สีลม', 'รัชดา', 'พระราม 9', 'บางแค', 'งามวงศ์วาน', 'แจ้งวัฒนะ', 'สุขุมวิท', 'ปิ่นเกล้า', 'รามอินทรา', 'บางกะปิ'];
      sites.push({ id: R.id('st'), type: type, area: R.pick(area), sqm: sqm, rent: rent, foot: trueFoot, quoted: Math.round(quoted / 50) * 50, seats: Math.round(sqm * c.seatsPerSqm), fit: Math.round(sqm * c.fitSqm * L0.fit / 10000) * 10000 + (type === 'cloud' ? 250000 : 0) });
    }
    b.sites = { type: type, list: sites, w: state.time.w };
    return sites;
  };

  M.openBranch = function (state, siteId, finance) {
    var b = state.biz, c = CONCEPTS[b.concept];
    if (!b.sites) return { ok: false, msg: 'ยังไม่มีทำเล' };
    var st = b.sites.list.find(function (x) { return x.id === siteId; });
    if (!st) return { ok: false, msg: 'ทำเลนี้ถูกคนอื่นเช่าไปแล้ว' };
    var L0 = LOCS[st.type];
    var deposit = st.rent * 3;
    var pre = 120000 + c.staff * 15000; // hiring, training, opening marketing
    var partner = finance === 'partner';
    if (partner && !M.partnerReady(state)) return { ok: false, msg: 'ยังไม่มีสาขาต้นแบบที่ทำกำไรต่อเนื่อง — หุ้นส่วนอยากเห็นตัวเลขจริงก่อนลงเงิน' };
    var leased = finance && !partner ? Math.round(st.fit * 0.5 / 10000) * 10000 : 0;
    var pIn = partner ? Math.round((deposit + st.fit + pre) * M.PARTNER.funds / 10000) * 10000 : 0;
    var need = deposit + st.fit + pre - leased - pIn;
    if (state.fin.bal.cash < need) return { ok: false, msg: 'เงินสดไม่พอ (ต้องใช้ ' + F.b(need) + ' = มัดจำ ' + F.m(deposit) + ' + ตกแต่ง ' + F.m(st.fit - leased) + (leased ? ' (หลังเช่าซื้อ)' : '') + ' + ก่อนเปิด ' + F.m(pre) + (pIn ? ' − หุ้นส่วนออก ' + F.m(pIn) : '') + ')' };
    if (!state.company.registered) return { ok: false, msg: 'ต้องจดทะเบียนบริษัทก่อนเซ็นสัญญาเช่าและขอใบอนุญาต' };
    if (leased) L.addLoan(state, { kind: 'lease', name: 'เช่าซื้ออุปกรณ์ครัว ' + st.area, amount: leased, rate: state.world.macro.rate + 0.07, months: 36 });
    var pLoan = null;
    if (pIn) {
      pLoan = L.addLoan(state, { kind: 'partner', name: 'หุ้นส่วนสาขา ' + st.area + ' (ส่วนแบ่งกำไร ' + F.pct(M.PARTNER.share, 0) + ')', amount: pIn, rate: 0, months: 0 });
      pLoan.feeLeft = Math.round(pIn * (M.PARTNER.buyout - 1)); // buying the partner out costs a premium
    }
    L.post(state.fin, { prepaid: deposit, cash: -deposit }, 'op');
    L.buyAsset(state, 'ตกแต่งและครัว สาขา' + st.area, st.fit, Math.min(60, L0.lease * 1.5));
    var fid = state.fin.assets[state.fin.assets.length - 1].id;
    L.spend(state.fin, 'other_exp', pre);
    var br = {
      id: 'b' + (b.nextB++), n: M.uniqueName(b, (st.type === 'cloud' ? 'ครัว ' : 'สาขา ') + st.area), type: st.type, sqm: st.sqm, rent: st.rent, foot: st.foot, seats: st.seats,
      deposit: deposit, fitId: fid, fit: st.fit, leaseEnd: state.time.w + Math.round(L0.lease * 4.33), state: 'building', ready: state.time.w + R.int(6, 10) + (state.flags.fastPermit ? -2 : 0), opened: null,
      mgr: null, staff: st.type === 'cloud' ? Math.ceil(c.staff * 0.5) : c.staff, staffSkill: 45, rating: 0, reviews: 0, ms: M.blank(), last: null, util: 0,
      partnerLoan: pLoan ? pLoan.id : null
    };
    b.branches.push(br);
    b.sites.list = b.sites.list.filter(function (x) { return x.id !== siteId; });
    return { ok: true, msg: 'เซ็นสัญญาเช่า ' + br.n + ' — ตกแต่งและขอใบอนุญาต ~' + (br.ready - state.time.w) + ' สัปดาห์ (จ่ายแล้ว ' + F.b(need) + (leased ? ' · เช่าซื้ออุปกรณ์ ' + F.b(leased) + ' ผ่อน 36 เดือน' : '') + (pIn ? ' · หุ้นส่วนออก ' + F.b(pIn) + ' แลกส่วนแบ่งกำไรสาขา ' + F.pct(M.PARTNER.share, 0) : '') + ')' };
  };

  // Branch partners (หุ้นส่วนสาขา): common way Thai chains fund expansion once a model branch is proven
  M.PARTNER = { funds: 0.6, share: 0.45, buyout: 1.3 };
  M.partnerReady = function (state) {
    return M.openBranches(state.biz).some(function (br) {
      var h = (br.hist || []).slice(-3);
      return h.length >= 3 && h.every(function (v) { return v > 0; }) && br.last && br.last.wall / Math.max(1, br.last.rev) > 0.06;
    });
  };
  M.partnerOf = function (state, br) {
    return br.partnerLoan ? state.fin.loans.find(function (l) { return l.id === br.partnerLoan; }) : null;
  };

  M.uniqueName = function (b, n) {
    var name = n, i = 2;
    while (b.branches.some(function (x) { return x.n === name; })) name = n + ' ' + (i++);
    return name;
  };

  M.closeBranch = function (state, id) {
    var b = state.biz, br = b.branches.find(function (x) { return x.id === id; });
    if (!br || br.state === 'closed') return { ok: false };
    var early = br.leaseEnd > state.time.w;
    if (early) L.post(state.fin, { penalties: br.deposit, prepaid: -br.deposit });
    else L.post(state.fin, { cash: br.deposit, prepaid: -br.deposit }, 'op');
    var nbv = L.writeOffAsset(state, br.fitId);
    var sev = br.staff * b.wage * 1.2;
    L.spend(state.fin, 'severance', sev);
    var pl = M.partnerOf(state, br);
    if (pl) {
      // the partner's capital was at risk in the branch and is lost with it
      L.post(state.fin, { loans: pl.balance, gainloss: -pl.balance });
      state.fin.loans = state.fin.loans.filter(function (l) { return l.id !== pl.id; });
      br.partnerLoan = null;
    }
    br.state = 'closed'; br.closedW = state.time.w;
    if (br.mgr) { var e = RW.Team.find(state, br.mgr); if (e) e.branch = null; br.mgr = null; }
    b.brand = Math.max(0, b.brand - 2);
    return { ok: true, msg: 'ปิด ' + br.n + (early ? ' — ยึดเงินมัดจำ ' + F.b(br.deposit) : '') + ' · ตัดค่าตกแต่งที่เหลือ ' + F.b(nbv) + ' · ค่าชดเชยพนักงาน ' + F.b(sev) };
  };

  M.openBranches = function (b) { return b.branches.filter(function (x) { return x.state === 'open'; }); };
  M.liveBranches = function (b) { return b.branches.filter(function (x) { return x.state !== 'closed'; }); };

  // ---------- Weekly ----------
  M.buzzMult = function (b) { var m = 1; b.buzz.forEach(function (x) { m *= 1 + (x.m - 1) * (x.weeks / x.total); }); return m; };
  M.season = function (info, type) {
    var m = info.month;
    var dine = [1.0, 0.98, 1.0, 0.92, 0.98, 0.94, 0.92, 0.95, 0.92, 0.95, 1.02, 1.12][m];
    var del = [1.0, 1.0, 1.0, 1.0, 1.05, 1.1, 1.12, 1.12, 1.12, 1.08, 1.0, 1.05][m];
    if (type === 'cbd' && m === 3) dine *= 0.75; // Songkran empties offices
    return { dine: dine, del: del };
  };

  M.mgrQuality = function (state, br) {
    var b = state.biz;
    if (br.mgr) { var e = RW.Team.find(state, br.mgr); if (e && !e.gone && e.startW <= state.time.w) return U.clamp(e.skill * (0.7 + e.morale / 330), 20, 98); br.mgr = null; }
    // founder can run one or two shops personally
    var fb = RW.Team.capOf(state, 'f_build');
    var n = M.openBranches(b).filter(function (x) { return !x.mgr; }).length;
    return U.clamp(25 + fb * 70 / Math.max(1, n) + state.founder.skills.leadership * 0.15, 15, 85);
  };

  M.weekly = function (state, info) {
    var b = state.biz, c = CONCEPTS[b.concept], fin = state.fin, w = state.time.w;
    b.buzz.forEach(function (x) { x.weeks--; });
    b.buzz = b.buzz.filter(function (x) { return x.weeks > 0; });
    b.insight = U.clamp(b.insight + RW.Team.capOf(state, 'discovery') * 4 * (1 - b.insight / 110), 0, 100);
    // menu R&D project
    if (b.menuProj) {
      b.menuProj.prog += (RW.Team.capOf(state, 'menu') + 0.15) * RW.Engine.tm(state, 'dev');
      if (b.menuProj.prog >= b.menuProj.need) {
        var gain = R.range(4, 10) * (1 + b.insight / 150);
        b.menuQ = U.clamp(b.menuQ + gain, 0, 98);
        b.buzz.push({ m: 1.15, weeks: 4, total: 4 });
        RW.Engine.mail(state, 'product', 'เปิดตัวเมนูใหม่', 'คุณภาพเมนู +' + gain.toFixed(1) + ' → ' + Math.round(b.menuQ) + ' · ลูกค้าเก่ากลับมาลอง', 'good');
        b.menuProj = null;
      }
    }
    var vat = fin.vat.registered ? 1 / 1.07 : 1;
    // walk-in trade depends mostly on location; brand adds on top
    var brandF = (0.8 + b.brand / 200) * M.buzzMult(b) * state.world.macro.consumer * state.diff.market * (1 + (RW.Engine.tm(state, 'mkt') - 1) * 0.6);
    var priceVal = Math.pow(1 / b.priceIdx, 1.25);
    var compF = 1 / (1 + U.sum(RW.World.aliveCompetitors(state), function (x) { return x.mkt / 100 * 0.08; }));
    var ck = b.ck && b.ck.ready <= w;
    var st = { covers: 0, deliv: 0, rev: 0, food: 0, lost: 0 };
    var weekRev = 0;
    b.branches.forEach(function (br) {
      if (br.state === 'building') {
        if (w >= br.ready) {
          br.state = 'open';
          if (br.opened != null) { RW.Engine.mail(state, 'product', br.n + ' กลับมาเปิดแล้ว', 'ซ่อมแซมเสร็จ ลูกค้าประจำทยอยกลับมา', 'good'); return; }
          br.opened = w; br.rating = 4.0;
          b.buzz.push({ m: 1.08, weeks: 3, total: 3 });
          RW.Engine.mail(state, 'product', 'เปิด ' + br.n + ' อย่างเป็นทางการ', 'ช่วงแรกลูกค้ายังไม่รู้จัก ยอดขายจะค่อยๆ โตใน 3–4 เดือน · ' + br.seats + ' ที่นั่ง · ค่าเช่า ' + F.b(br.rent) + '/เดือน', 'good');
        }
        return;
      }
      if (br.state !== 'open') return;
      var age = w - br.opened;
      var ramp = Math.min(1, 0.4 + age / 18 * 0.6);
      var mq = M.mgrQuality(state, br);
      br.mq = mq;
      var cons = U.clamp(mq * 0.7 + (ck ? 25 : 10) + br.staffSkill * 0.15, 10, 100);
      br.cons = cons;
      var sea = M.season(info, br.type);
      var L0 = LOCS[br.type];
      var ratingF = br.rating >= 4.6 ? 1.25 : br.rating >= 4.3 ? 1.08 : br.rating >= 4.0 ? 0.95 : br.rating >= 3.6 ? 0.75 : 0.5;
      var menuF = Math.pow(b.menuQ / 60, 1.2);
      var A = menuF * priceVal * ratingF * brandF * compF * (0.85 + cons / 650);
      // staffing: required staff grows with volume
      var baseStaff = br.type === 'cloud' ? Math.ceil(c.staff * 0.5) : c.staff;
      var required = baseStaff + (br.last ? (br.last.covers + br.last.deliv * 0.6) / 4.33 / 320 : 0);
      var staffRatio = br.staff / Math.max(1, required);
      var serviceF = U.clamp(0.55 + 0.45 * staffRatio, 0.5, 1.08);
      // dine-in
      var footWeek = br.foot * (5 + 2 * L0.weekend) * sea.dine;
      var demand = footWeek * c.capture * A * ramp * (state.flags.pandemic && state.flags.pandemic > w ? 0.15 : 1);
      // seats only limit dine-in; takeaway customers (most of a bakery's trade) don't need a table
      var cap = br.seats * c.turns * 7 * U.clamp(staffRatio, 0.5, 1.05) / (1 - (c.take || 0));
      var covers = R.poisson(Math.min(demand, cap));
      var lost = Math.max(0, demand - cap);
      br.util = cap > 0 ? covers / cap : 0;
      if (lost > cap * 0.2) b.buzz.push({ m: 1.01, weeks: 1, total: 1 }); // queues create hype
      // delivery
      var deliv = 0;
      if (b.deliv.on) {
        var dBase = c.deliv * L0.deliv * 7 * (br.type === 'cloud' ? 2.2 : 1);
        deliv = R.poisson(dBase * A * ramp * sea.del * (1 + b.deliv.promo * 6) * (state.flags.pandemic && state.flags.pandemic > w ? 2.5 : 1) * (b.delivAppBoost || 1));
        var kitchenCap = (br.staff * 70 + 50) * (br.type === 'cloud' ? 1.6 : 1);
        if (covers + deliv > kitchenCap) { var cut = covers + deliv - kitchenCap; deliv = Math.max(0, deliv - cut); }
      }
      var ticket = c.ticket * b.priceIdx;
      var dineRev = covers * ticket * vat;
      var delGross = deliv * ticket * 1.2;
      var delRev = delGross * vat * (1 - b.deliv.promo);
      L.earnCash(fin, 'rev_food', dineRev);
      if (delRev > 0) L.invoice(state, 'rev_deliv', delRev, w + 1, { name: 'แอปเดลิเวอรี', seg: 'delivery', sure: true });
      // variable costs
      var foodPct = Math.max(0.12, c.food + b.foodAdj - (ck ? 0.035 : 0) + (state.world.fx - 35.5) * 0.002 + (1 - Math.min(1, staffRatio)) * 0.02);
      var waste = 0.05 * (ck ? 0.7 : 1) * (1.3 - Math.min(0.3, RW.Team.capOf(state, 'data') * 0.15)) * (br.util < 0.4 ? 1.4 : 1);
      // ingredients cost the same whether dine-in or delivery (app prices are marked up ~20% to cover GP)
      var food = (dineRev + deliv * ticket * vat) * foodPct * (1 + waste);
      L.spend(fin, 'cogs_goods', food);
      if (delGross > 0) {
        var gp = delGross * vat * 0.30;
        L.post(fin, { cogs_platform: gp, cash: -gp }, 'op');
        L.spend(fin, 'cogs_other', delGross * 0.05); // packaging
      }
      L.spend(fin, 'cogs_fees', dineRev * 0.4 * 0.016);
      // rating dynamics
      var target = 3.1 + b.menuQ / 100 * 1.2 + (serviceF - 0.8) * 1.5 + cons / 250 - (b.priceIdx - 1) * 0.6;
      br.rating = U.clamp(U.approach(br.rating, target, 0.06), 1, 5);
      br.reviews += (covers + deliv) * 0.02;
      // staff skill improves with tenure & training
      br.staffSkill = U.clamp(br.staffSkill + (RW.POLICIES.culture[state.team.policy.culture].train || 1) * 0.15 - 0.08, 20, 95);
      br.ms.covers += covers; br.ms.deliv += deliv; br.ms.rev += dineRev + delRev; br.ms.dineRev += dineRev; br.ms.delivRev += delRev; br.ms.food += food;
      st.covers += covers; st.deliv += deliv; st.rev += dineRev + delRev; st.food += food; st.lost += lost;
      weekRev += dineRev + delRev;
      b.lifetime.covers += covers + deliv;
    });
    // franchise royalties
    if (b.fr.on && b.fr.units.length) {
      var sys = U.sum(b.fr.units, function (u) { return u.weekly * (0.8 + b.brand / 250); });
      var roy = sys * b.fr.royalty;
      L.invoice(state, 'rev_franchise', roy, w + 4, { name: 'ค่ารอยัลตี้แฟรนไชส์', seg: 'franchise', wht: true });
      b.mstats.royalty += roy; weekRev += roy;
    }
    // catering / corporate orders from sales capacity
    var sales = RW.Team.capOf(state, 'sales');
    if (sales > 0.1 && M.openBranches(b).length) {
      var cat = R.poisson(sales * 3) * c.ticket * 40 * vat;
      if (cat > 0) { L.invoice(state, 'rev_food', cat, w + 4, { name: 'งานจัดเลี้ยง/ข้าวกล่ององค์กร', seg: 'catering', wht: true }); L.spend(fin, 'cogs_goods', cat * c.food * 1.05); weekRev += cat; st.rev += cat; }
    }
    var ms = b.mstats;
    ms.covers += st.covers; ms.deliv += st.deliv; ms.rev += st.rev; ms.food += st.food; ms.lost += st.lost;
    // brand & overall rating
    var ob = M.openBranches(b);
    b.rating = ob.length ? U.sum(ob, function (x) { return x.rating * (x.reviews + 5); }) / U.sum(ob, function (x) { return x.reviews + 5; }) : b.rating;
    b.consistency = ob.length ? U.avg(ob, function (x) { return x.cons || 50; }) : b.consistency;
    b.brand = U.clamp(b.brand * 0.997 + ob.length * 0.12 + (b.rating - 4.2) * 0.3 + Math.log10(1 + st.covers) * 0.03, 0, 100);
    b.weekRev = weekRev;
  };

  // ---------- Monthly ----------
  M.monthly = function (state, info) {
    var b = state.biz, fin = state.fin, c = CONCEPTS[b.concept];
    var minWageIdx = state.world.wageIndex * (state.flags.minWage || 1);
    b.wage = Math.round(13500 * minWageIdx / 100) * 100;
    var totalStaff = 0;
    b.branches.forEach(function (br) {
      if (br.state === 'closed') return;
      L.spend(fin, 'rent', br.rent + (br.type === 'mall' ? br.sqm * 120 : 0));
      if (br.state !== 'open') { br.ms = M.blank(); return; }
      var labor = br.staff * b.wage * (br.type === 'mall' ? 1.08 : 1);
      L.spend(fin, 'cogs_staff', labor);
      L.spend(fin, 'benefits', br.staff * L.socialSecurity(b.wage));
      var util = br.ms.rev * c.util + br.sqm * 110;
      L.spend(fin, 'utilities', util);
      L.spend(fin, 'office', br.ms.rev * 0.015 + 4000); // maintenance, smallwares, cleaning
      // frontline turnover → recruiting & training cost; understaffing persists if HR weak
      var turnover = br.staff * (0.07 + (b.staffing > 1.1 ? -0.02 : b.staffing < 0.9 ? 0.04 : 0));
      L.spend(fin, 'recruit', turnover * 3500);
      br.staffSkill = Math.max(20, br.staffSkill - turnover / Math.max(1, br.staff) * 12);
      var required = (br.type === 'cloud' ? Math.ceil(c.staff * 0.5) : c.staff) + (br.ms.covers + br.ms.deliv * 0.6) / 4.33 / 320;
      var hrF = Math.min(1, 0.75 + RW.Team.capOf(state, 'hr') * 0.2 + RW.Team.capOf(state, 'ops') * 0.1);
      br.staff = Math.max(2, Math.round(required * b.staffing * (R.chance(hrF) ? 1 : 0.9)));
      totalStaff += br.staff;
      var rent = br.rent + (br.type === 'mall' ? br.sqm * 120 : 0);
      var foodC = br.ms.food;
      var gp = br.ms.delivRev / (1 - b.deliv.promo) * 0.30;
      // the store manager is part of the shop's own P&L (true 4-wall)
      var mgrE = br.mgr ? RW.Team.find(state, br.mgr) : null;
      var mgrCost = mgrE && !mgrE.gone && mgrE.startW <= state.time.w ? mgrE.salary + L.socialSecurity(mgrE.salary) : 0;
      br.last = { rev: br.ms.rev, covers: br.ms.covers, deliv: br.ms.deliv, food: foodC, labor: labor + br.staff * L.socialSecurity(b.wage) + mgrCost, rent: rent, util: util, gp: gp, other: br.ms.rev * 0.015 + 4000 };
      br.last.wall = br.last.rev - br.last.food - br.last.labor - br.last.rent - br.last.util - br.last.gp - br.last.other - br.ms.delivRev * 0.05;
      var pl = M.partnerOf(state, br);
      if (pl && br.last.wall > 0) {
        var share = Math.round(br.last.wall * M.PARTNER.share * U.clamp(pl.balance / pl.principal, 0, 1)); // partial buybacks shrink the share
        L.post(fin, { interest: share, cash: -share }, 'fin');
        br.last.partner = share;
      }
      br.hist = br.hist || [];
      br.hist.push(br.last.wall);
      if (br.hist.length > 12) br.hist.shift();
      br.ms = M.blank();
    });
    b.staffTotal = totalStaff;
    // central kitchen
    if (b.ck && b.ck.ready <= state.time.w) { L.spend(fin, 'cogs_other', 160000); L.spend(fin, 'rent', 60000); }
    if (b.loyalty) L.spend(fin, 'software', 15000 + M.openBranches(b).length * 2000);
    // franchise program upkeep & new franchisees
    if (b.fr.on) {
      L.spend(fin, 'sal_ga', 60000);
      var avgWall = U.avg(M.openBranches(b), function (x) { return x.last ? x.last.wall / Math.max(1, x.last.rev) : 0; });
      var apps = (b.brand / 45) * (avgWall > 0.12 ? 1 : 0.3) * state.world.macro.consumer;
      if (R.chance(Math.min(0.85, apps * 0.35))) {
        b.fr.units.push({ w: state.time.w, weekly: c.ticket * c.capture * 3500 * 7 * R.range(0.6, 1.2), q: R.range(40, 80) });
        L.post(fin, { cash: b.fr.fee, rev_franchise: -b.fr.fee }, 'op');
        RW.Engine.mail(state, 'sales', 'แฟรนไชส์ซีรายใหม่เปิดสาขา', 'รับค่าแฟรนไชส์แรกเข้า ' + F.b(b.fr.fee) + ' · รวม ' + b.fr.units.length + ' สาขาแฟรนไชส์', 'good');
      }
      // franchisee quality drags the brand
      var badQ = U.avg(b.fr.units, function (u) { return u.q; });
      if (b.fr.units.length && badQ < 55) b.brand = Math.max(0, b.brand - 0.5);
    }
    b.stats.push(b.mstats);
    if (b.stats.length > 24) b.stats.shift();
    b.mstats = M.blank();
  };

  // ---------- KPIs / investor view ----------
  M.kpis = function (state) {
    var b = state.biz;
    var ob = M.openBranches(b);
    var walls = ob.filter(function (x) { return x.last; });
    var revB = U.sum(walls, function (x) { return x.last.rev; });
    var wallM = revB > 0 ? U.sum(walls, function (x) { return x.last.wall; }) / revB : null;
    var primeC = revB > 0 ? U.sum(walls, function (x) { return x.last.food + x.last.labor; }) / revB : null;
    var mo = b.stats.length ? b.stats[b.stats.length - 1] : null;
    var avgFit = U.avg(ob, function (x) { return x.fit; });
    var avgWall = walls.length ? U.avg(walls, function (x) { return x.last.wall; }) : 0;
    return {
      branches: ob.length, building: b.branches.filter(function (x) { return x.state === 'building'; }).length, franchise: b.fr.units.length,
      wallMargin: wallM, primeCost: primeC, covers: mo ? mo.covers + mo.deliv : 0, rating: b.rating, customers: Math.round(b.lifetime.covers),
      payback: avgWall > 0 ? avgFit / avgWall : null, marketShare: Math.min(0.5, ob.length / 400),
      workload: { cogs: 1 + Math.max(0, 1 - b.staffing) * 1.5, sm: 1, rnd: 1 }, arr: 0, mrr: 0
    };
  };
  M.monthKPIs = function (state) {
    var b = state.biz, mo = b.stats.length ? b.stats[b.stats.length - 1] : null;
    return { covers: mo ? mo.covers + mo.deliv : 0, branches: M.openBranches(b).length + b.fr.units.length };
  };
  M.reportLine = function (state) {
    var k = state.kpi;
    return 'สาขาเปิดอยู่ ' + k.branches + (k.franchise ? ' + แฟรนไชส์ ' + k.franchise : '') + ' · ลูกค้า/เดือน ' + F.num(k.covers) + ' · 4-wall margin ' + (k.wallMargin != null ? F.pct(k.wallMargin, 0) : '–') + ' · Prime cost ' + (k.primeCost != null ? F.pct(k.primeCost, 0) : '–') + ' · เรตติ้ง ' + state.biz.rating.toFixed(2);
  };
  M.forecastCost = function (state) {
    var b = state.biz;
    return U.sum(M.liveBranches(b), function (br) { return br.rent + br.staff * b.wage; });
  };
  M.forecastRevenue = function (state) { return state.kpi.revenueMonthly || 0; };
  M.rbfEligible = function (state) { return state.hist.monthly.length >= 6 && (state.kpi.revenueMonthly || 0) > 400000; };

  M.traction = function (state) {
    var b = state.biz, k = state.kpi;
    var revRun = (k.revenueMonthly || 0) * 12;
    var wall = k.wallMargin != null ? k.wallMargin : 0;
    var eq = revRun * U.clamp(0.25 + wall * 1.4, 0.1, 0.65) + b.fr.units.length * 2e6;
    var prod = M.openBranches(b).length ? 5 + Math.min(6, M.openBranches(b).length) + (b.rating - 4) * 5 : (b.branches.length ? 3 : 0);
    var arrPts = 20 * Math.log10(1 + eq / 250000);
    var g = Math.pow(1 + (k.cmgr3 || 0), 12) - 1;
    var growthPts = U.clamp(10 * Math.log2(1 + Math.max(-0.5, g)), -15, 20) * Math.min(1, revRun / 4e6);
    var execs = RW.Team.active(state).filter(function (e) { return e.level >= 4; }).length + (state.cofounders || []).filter(function (c) { return c.active; }).length;
    var team = Math.min(8, execs * 1.5 + state.founder.rep / 12);
    var unit = wall > 0.18 ? 6 : wall > 0.1 ? 2 : wall < 0 ? -6 : 0;
    var score = prod + arrPts + growthPts + team + unit + Math.min(5, b.brand / 12);
    return { score: score, arr: eq, growth: g, lines: [['รายได้ (annualized)', F.m(revRun)], ['การเติบโต', revRun > 0 ? F.spct(g, 0) : '–'], ['สาขา', String(M.openBranches(b).length) + (b.fr.units.length ? ' + แฟรนไชส์ ' + b.fr.units.length : '')], ['4-wall margin', k.wallMargin != null ? F.pct(k.wallMargin, 0) : '–'], ['เรตติ้ง', b.rating.toFixed(2)]] };
  };
  M.valuation = function (state) {
    var tr = M.traction(state);
    var qual = RW.Models.saas.qualValue(tr.score) * 0.4; // restaurants rarely earn tech-style story premiums
    var revRun = (state.kpi.revenueMonthly || 0) * 12;
    if (revRun <= 0) return qual;
    var g = U.clamp(tr.growth, 0, 2);
    var ebitda = state.kpi.ebitdaTTM || 0;
    var fund = Math.max(revRun * (0.6 + 1.2 * Math.pow(g, 0.6)) * U.clamp(0.6 + (state.kpi.wallMargin || 0) * 2, 0.4, 1.3), ebitda * 11);
    var a = Math.sqrt(U.clamp(revRun / 80e6, 0, 1));
    return Math.exp(a * Math.log(Math.max(1e6, fund)) + (1 - a) * Math.log(qual));
  };

  M.advice = function (state) {
    var b = state.biz, k = state.kpi, out = [];
    function add(l, t) { out.push({ lvl: l, t: t }); }
    if (!b.branches.length) add('warn', 'ยังไม่มีร้าน — เลือกทำเลที่หน้า "สาขา" แล้วเซ็นสัญญาเช่า');
    var fixedM = U.sum(M.liveBranches(b), function (br) { return br.rent + br.staff * b.wage; });
    if (fixedM > 0 && state.fin.bal.cash < fixedM * 2 && (k.revenueMonthly || 0) < fixedM * 1.5) add('crit', 'เงินสดเหลือไม่ถึง 2 เดือนของค่าเช่า+ค่าแรง (' + F.m(fixedM) + '/เดือน) — ร้านใหม่ต้องใช้เวลา 3–4 เดือนกว่ายอดจะขึ้น');
    if (k.primeCost != null && k.primeCost > 0.68) add('warn', 'Prime cost (วัตถุดิบ+ค่าแรง) ' + F.pct(k.primeCost, 0) + ' ของยอดขาย — สูงเกิน ~65% ร้านจะขาดทุน');
    M.openBranches(b).forEach(function (br) {
      if (br.last && br.last.wall < 0 && state.time.w - br.opened > 20) add('warn', br.n + ' ขาดทุนระดับสาขา (' + F.m(br.last.wall) + '/เดือน) หลังเปิดมา ' + Math.round((state.time.w - br.opened) / 4.33) + ' เดือน');
      if (!br.mgr && M.openBranches(b).length > 1) add('info', br.n + ' ยังไม่มีผู้จัดการสาขา — คุณภาพไม่สม่ำเสมอ');
      if (br.util > 0.95) add('info', br.n + ' ที่นั่งเต็มตลอด ลูกค้ารอคิวแล้วกลับบ้าน — ขึ้นราคาหรือขยายสาขาได้');
      if (br.rating && br.rating < 3.8) add('warn', br.n + ' เรตติ้ง ' + br.rating.toFixed(1) + ' — ลูกค้าเริ่มหนี');
    });
    if (M.openBranches(b).length >= 4 && !b.ck) add('info', 'มี 4 สาขาขึ้นไป — ครัวกลางช่วยลดต้นทุนวัตถุดิบและทำให้รสชาติสม่ำเสมอ');
    if (b.staffing < 0.9) add('warn', 'จัดพนักงานน้อยเกินไป — บริการช้า เรตติ้งตก คนลาออกเยอะ');
    return out;
  };

  M.onEmployeeLeft = function (state, e) {
    state.biz.branches.forEach(function (br) { if (br.mgr === e.id) { br.mgr = null; RW.Engine.mail(state, 'team', br.n + ' ไม่มีผู้จัดการแล้ว', e.name + ' ออกไป — คุณภาพร้านจะตกถ้าไม่หาคนแทน', 'warn'); } });
  };
  M.onCompetitorDied = function (state) { state.biz.buzz.push({ m: 1.12, weeks: 8, total: 8 }); };
  M.onPandemic = function (state, pivot) { if (pivot) state.biz.delivAppBoost = 1.4; };
  M.onDisaster = function (state, sev) { M.openBranches(state.biz).forEach(function (br) { if (R.chance(sev)) { br.ready = state.time.w + 2; br.state = 'building'; } }); };
  M.onPermit = function (state, fast) { if (fast) state.flags.fastPermit = 1; else state.biz.branches.forEach(function (br) { if (br.state === 'building') br.ready += 2; }); };
  M.newEntrant = function (state) {
    return { name: R.pick(['ร้านดังจากเกาหลี', 'เชนคาเฟ่จีนราคาถูก', 'แบรนด์ลูกของบริษัทใหญ่', 'ร้านเชฟดังเปิดใหม่']), desc: 'เปิดสาขาใกล้ร้านคุณหลายแห่ง ทุนหนา', quality: R.int(55, 75), price: R.range(0.7, 1.2), mkt: R.int(55, 85), cash: R.range(30e6, 150e6), burn: R.range(1e6, 3e6), stage: 'B', aggr: R.range(0.4, 0.8) };
  };

  // ---------- Actions ----------
  // ---------- Paid research ----------
  M.RESEARCH = {
    count: {
      n: 'จ้างคนนับคนเดินผ่านจริง', weeks: 1,
      d: 'จ้างนักศึกษายืนนับคนหน้าทำเล 7 วันทั้งวันธรรมดาและวันหยุด — ตัวเลขจริงแทนตัวเลขสวยๆ ของโบรกเกอร์',
      cost: 12000,
      can: function (s, id) { var x = s.biz.sites && s.biz.sites.list.find(function (t) { return t.id === id; }); return !x ? 'ไม่พบทำเลนี้' : x.type === 'cloud' ? 'คลาวด์คิทเช่นไม่มีหน้าร้าน' : x.counted ? 'นับไปแล้ว' : null; },
      done: function (s, id) {
        var x = s.biz.sites && s.biz.sites.list.find(function (t) { return t.id === id; });
        if (!x) return 'ทำเลนี้ถูกคนอื่นเช่าไปก่อนผลนับจะมา';
        x.counted = Math.round(x.foot * R.normal(1, 0.06) / 50) * 50;
        var gap = x.quoted / x.counted - 1;
        return 'ทำเล ' + x.area + ': นับได้เฉลี่ย ' + F.num(x.counted) + ' คน/วัน เทียบกับที่โบรกเกอร์บอก ' + F.num(x.quoted) + (gap > 0.1 ? ' — โบรกเกอร์โม้ไป ' + F.pct(gap, 0) : gap < -0.1 ? ' — คนเดินจริงมากกว่าที่โบรกเกอร์บอก!' : ' — ใกล้เคียงกัน');
      }
    },
    taste: {
      n: 'Blind taste test + Mystery shopper', weeks: 2,
      d: 'ให้ลูกค้าเป้าหมายชิมเทียบกับคู่แข่งแบบไม่รู้แบรนด์ และส่งคนแฝงตัวไปใช้บริการทุกสาขา — Insight เพิ่ม และรู้ว่าเมนูเราอยู่ตรงไหนในตลาด',
      cost: 38000,
      can: function (s) { return s.biz.insight >= 85 ? 'Insight สูงแล้ว' : null; },
      done: function (s) {
        var b = s.biz, gain = 16 * (1 - b.insight / 110);
        b.insight = U.clamp(b.insight + gain, 0, 100);
        var comps = RW.World.aliveCompetitors(s);
        var cq = comps.length ? U.avg(comps, function (c) { return c.quality; }) : 60;
        var rel = b.menuQ - cq;
        return 'Insight +' + gain.toFixed(0) + '% · ผลชิมแบบปิดตา: ' + (rel > 8 ? 'เมนูเราชนะคู่แข่งชัดเจน' : rel > -3 ? 'สูสีกับคู่แข่ง — ต้องชนะด้วยบริการและทำเล' : 'คู่แข่งอร่อยกว่าในสายตาลูกค้า — ควรพัฒนาเมนู') + ' (คุณภาพเมนู ' + Math.round(b.menuQ) + ' vs คู่แข่งเฉลี่ย ' + Math.round(cq) + ')' + (M.openBranches(b).length ? ' · Mystery shopper: ' + R.pick(['พนักงานบางสาขาลืมทักทายลูกค้า', 'เวลารออาหารช่วงพีคนานเกิน 20 นาที', 'ความสะอาดห้องน้ำต่างกันมากระหว่างสาขา', 'บริการดีสม่ำเสมอเกือบทุกสาขา']) : '');
      }
    }
  };

  M.act = {
    scout: function (s, type) {
      L.spend(s.fin, 'prof', type === 'mall' ? 30000 : 8000);
      M.scout(s, type);
      return { ok: true, msg: 'โบรกเกอร์ส่งทำเล ' + LOCS[type].n + ' มา 3 แห่ง (ค่าสำรวจ ' + F.b(type === 'mall' ? 30000 : 8000) + ')' };
    },
    open: function (s, id, fin) { return M.openBranch(s, id, fin); },
    close: function (s, id) { return M.closeBranch(s, id); },
    setPrice: function (s, v) { s.biz.priceIdx = U.clamp(v, 0.7, 1.6); if (s.fin.vat.registered) s.flags.vatRepriced = 1; return { ok: true }; },
    setStaffing: function (s, v) { s.biz.staffing = U.clamp(v, 0.75, 1.3); return { ok: true }; },
    assign: function (s, brId, empId) {
      var b = s.biz;
      var br = b.branches.find(function (x) { return x.id === brId; });
      b.branches.forEach(function (x) { if (x.mgr === empId) x.mgr = null; });
      if (br) br.mgr = empId || null;
      return { ok: true };
    },
    menuRD: function (s) {
      var b = s.biz;
      if (b.menuProj) return { ok: false, msg: 'กำลังพัฒนาเมนูอยู่' };
      L.spend(s.fin, 'other_exp', 60000);
      b.menuProj = { prog: 0, need: 6 };
      return { ok: true, msg: 'เริ่มพัฒนาเมนูใหม่ (ค่าวัตถุดิบทดลอง ฿60,000) — เชฟช่วยให้เร็วและดีขึ้น' };
    },
    costCut: function (s) {
      var b = s.biz;
      if (s.flags.costCutW && s.time.w - s.flags.costCutW < 26) return { ok: false, msg: 'เพิ่งปรับสูตรไป' };
      s.flags.costCutW = s.time.w;
      b.foodAdj -= 0.02; b.menuQ = Math.max(10, b.menuQ - 4);
      return { ok: true, msg: 'ปรับสูตร/เปลี่ยนซัพพลายเออร์ถูกลง — ต้นทุนวัตถุดิบ −2pp แต่คุณภาพเมนูลดลง' };
    },
    premiumIngredients: function (s) {
      var b = s.biz;
      b.foodAdj += 0.025; b.menuQ = Math.min(98, b.menuQ + 6);
      return { ok: true, msg: 'ใช้วัตถุดิบเกรดดีขึ้น — คุณภาพเมนู +6 ต้นทุนวัตถุดิบ +2.5pp' };
    },
    toggleDelivery: function (s) { s.biz.deliv.on = !s.biz.deliv.on; return { ok: true }; },
    setPromo: function (s, v) { s.biz.deliv.promo = U.clamp(v, 0, 0.3); return { ok: true }; },
    toggleLoyalty: function (s) { s.biz.loyalty = !s.biz.loyalty; if (s.biz.loyalty) s.biz.buzz.push({ m: 1.08, weeks: 52, total: 52 }); return { ok: true, msg: s.biz.loyalty ? 'เปิดแอปสะสมแต้ม/LINE OA — ลูกค้าประจำกลับมาบ่อยขึ้น' : 'ปิดโปรแกรมสมาชิก' }; },
    campaign: function (s, tier) {
      var t = { blogger: [40000, 1.2, 3, 2], kol: [250000, 1.5, 4, 5], tv: [1200000, 1.9, 6, 10] }[tier];
      if (s.fin.bal.cash < t[0]) return { ok: false, msg: 'เงินไม่พอ' };
      L.spend(s.fin, 'mkt', t[0]);
      s.biz.buzz.push({ m: t[1], weeks: t[2], total: t[2] });
      s.biz.brand = Math.min(100, s.biz.brand + t[3]);
      return { ok: true, msg: { blogger: 'เชิญฟู้ดบล็อกเกอร์ 8 คนมารีวิว', kol: 'จ้าง KOL สายกินชื่อดัง', tv: 'ออกรายการทีวีและโฆษณาออนไลน์ใหญ่' }[tier] + ' (' + F.b(t[0]) + ')' };
    },
    buildCK: function (s) {
      var b = s.biz;
      if (b.ck) return { ok: false, msg: 'มีครัวกลางแล้ว' };
      var cost = 7500000;
      if (s.fin.bal.cash < cost) return { ok: false, msg: 'ต้องใช้เงิน ' + F.m(cost) };
      L.buyAsset(s, 'ครัวกลาง', cost, 84);
      b.ck = { ready: s.time.w + 16 };
      return { ok: true, msg: 'เริ่มสร้างครัวกลาง (' + F.m(cost) + ') เสร็จใน ~16 สัปดาห์ — ค่าดำเนินการ ~฿220K/เดือน' };
    },
    startFranchise: function (s) {
      var b = s.biz;
      if (b.fr.on) return { ok: false, msg: 'เปิดแฟรนไชส์แล้ว' };
      if (M.openBranches(b).length < 4 || b.brand < 35) return { ok: false, msg: 'ต้องมีอย่างน้อย 4 สาขาที่มีกำไร และแบรนด์ ≥35 คนถึงจะอยากซื้อแฟรนไชส์' };
      L.spend(s.fin, 'prof', 1500000);
      b.fr.on = true;
      return { ok: true, msg: 'จ้างที่ปรึกษาทำคู่มือ ระบบ และสัญญาแฟรนไชส์ (฿1.5M) — ค่าแรกเข้า ' + F.b(b.fr.fee) + ' + รอยัลตี้ ' + F.pct(b.fr.royalty, 0) };
    }
  };

  // ---------- F&B events ----------
  var E = RW.Events, H = E.H;
  E.register({
    id: 'fnb_poison', cat: 'admin', ind: ['fnb'], weight: function (s) { return 0.3 + (80 - s.biz.consistency) / 60; }, cooldown: 52, bad: true,
    cond: function (s) { return M.openBranches(s.biz).length > 0 && s.time.w > 10; },
    init: function (s) { return { br: R.pick(M.openBranches(s.biz)).id }; },
    valid: function (s, d) { return s.biz.branches.some(function (x) { return x.id === d.br && x.state === 'open'; }); },
    title: 'ลูกค้าอาหารเป็นพิษ',
    body: function (s, d) { var br = s.biz.branches.find(function (x) { return x.id === d.br; }); return 'ลูกค้า 6 คนที่ทานที่ ' + br.n + ' เข้าโรงพยาบาลด้วยอาการอาหารเป็นพิษ หนึ่งในนั้นโพสต์ลงโซเชียลพร้อมรูปใบรับรองแพทย์ เจ้าหน้าที่สาธารณสุขเขตจะเข้าตรวจ'; },
    choices: function (s, d) {
      var br = s.biz.branches.find(function (x) { return x.id === d.br; });
      return [
        { t: 'ปิดสาขาชั่วคราว 1 สัปดาห์ ตรวจทั้งระบบ ชดเชยลูกค้าเต็มที่', fx: function () { br.ready = s.time.w + 1; br.state = 'building'; L.spend(s.fin, 'penalties', 80000); br.rating = Math.max(1, br.rating - 0.2); H.brand(s, -3); return 'ลูกค้าเห็นความรับผิดชอบ ความเสียหายจำกัด'; } },
        { t: 'ชดเชยลูกค้าเงียบๆ เปิดร้านต่อ', fx: function () { L.spend(s.fin, 'penalties', 30000); if (R.chance(0.4)) { br.rating -= 0.6; H.brand(s, -10); s.biz.buzz.push({ m: 0.75, weeks: 8, total: 8 }); return 'เรื่องบานปลายในโซเชียล "ร้านปกปิดความจริง"'; } br.rating -= 0.15; return 'เรื่องเงียบไป'; } }
      ];
    }
  });
  E.register({
    id: 'fnb_minwage', cat: 'market', ind: ['fnb'], weight: 0.5, once: true, bad: true,
    cond: function (s) { return s.time.w > 30; },
    title: 'รัฐบาลประกาศขึ้นค่าแรงขั้นต่ำ',
    body: 'คณะกรรมการค่าจ้างประกาศขึ้นค่าแรงขั้นต่ำทั่วประเทศ ~8% มีผลเดือนหน้า ธุรกิจร้านอาหารที่ใช้แรงงานเข้มข้นได้รับผลกระทบโดยตรง',
    choices: function (s) {
      return [
        { t: 'ขึ้นราคาเมนู 5%', fx: function () { s.flags.minWage = (s.flags.minWage || 1) * 1.08; s.biz.priceIdx *= 1.05; return 'ลูกค้าบางส่วนบ่นเรื่องราคา'; } },
        { t: 'ลดจำนวนพนักงานต่อกะ', fx: function () { s.flags.minWage = (s.flags.minWage || 1) * 1.08; s.biz.staffing = Math.max(0.75, s.biz.staffing - 0.08); return 'ต้นทุนแรงงานคงที่ แต่บริการช้าลง'; } },
        { t: 'ยอมรับต้นทุนเพิ่ม', fx: function () { s.flags.minWage = (s.flags.minWage || 1) * 1.08; return 'อัตรากำไรระดับสาขาลดลง'; } }
      ];
    }
  });
  E.register({
    id: 'fnb_ingredient', cat: 'market', ind: ['fnb'], weight: 1, cooldown: 40, bad: true,
    cond: function (s) { return M.openBranches(s.biz).length > 0; },
    title: function (s) { return R.pick(['ราคาหมูพุ่งทำสถิติใหม่', 'ไข่ไก่และน้ำมันพืชขึ้นราคา', 'เมล็ดกาแฟโลกแพงขึ้น 40%', 'ภัยแล้งทำผักแพง']); },
    body: 'ต้นทุนวัตถุดิบหลักของคุณเพิ่มขึ้นอย่างมาก คาดว่าจะยืดเยื้อหลายเดือน',
    choices: function (s) {
      return [
        { t: 'ขึ้นราคา 6%', fx: function () { s.biz.foodAdj += 0.03; s.biz.priceIdx *= 1.06; return 'ส่งต่อต้นทุนให้ลูกค้า'; } },
        { t: 'ปรับสูตร ลดปริมาณเล็กน้อย', fx: function () { s.biz.foodAdj += 0.01; s.biz.menuQ -= 3; return 'ลูกค้าบางคนสังเกตว่าจานเล็กลง'; } },
        { t: 'ยอมกินมาร์จิ้น', fx: function () { s.biz.foodAdj += 0.04; E.later(s, 20, 'fnb_ingredient_end', {}); return 'ต้นทุนวัตถุดิบ +4pp ชั่วคราว'; } }
      ];
    }
  });
  E.effect('fnb_ingredient_end', function (s) { s.biz.foodAdj -= 0.03; H.mail(s, 'ราคาวัตถุดิบเริ่มกลับสู่ปกติ', 'ต้นทุนวัตถุดิบลดลง', 'good'); });
  E.register({
    id: 'fnb_landlord', cat: 'admin', ind: ['fnb'], weight: 0.8, cooldown: 52, bad: true,
    cond: function (s) { return M.openBranches(s.biz).some(function (x) { return x.leaseEnd - s.time.w < 20; }); },
    init: function (s) { var br = M.openBranches(s.biz).filter(function (x) { return x.leaseEnd - s.time.w < 20; }); return br.length ? { br: br[0].id } : null; },
    valid: function (s, d) { return s.biz.branches.some(function (x) { return x.id === d.br && x.state === 'open'; }); },
    title: 'สัญญาเช่าใกล้หมด — เจ้าของขอขึ้นค่าเช่า',
    body: function (s, d) { var br = s.biz.branches.find(function (x) { return x.id === d.br; }); return 'เจ้าของพื้นที่ ' + br.n + ' เห็นว่าร้านขายดี ขอขึ้นค่าเช่า 25% (จาก ' + F.b(br.rent) + ') สำหรับสัญญาใหม่ 3 ปี'; },
    choices: function (s, d) {
      var br = s.biz.branches.find(function (x) { return x.id === d.br; });
      return [
        { t: 'ต่อสัญญา +25%', fx: function () { br.rent = Math.round(br.rent * 1.25 / 1000) * 1000; br.leaseEnd = s.time.w + 156; return 'ต่อสัญญาแล้ว'; } },
        { t: 'ต่อรอง (+10%)', fx: function () { if (R.chance(0.55)) { br.rent = Math.round(br.rent * 1.1 / 1000) * 1000; br.leaseEnd = s.time.w + 156; return 'ตกลงที่ +10%'; } br.rent = Math.round(br.rent * 1.3 / 1000) * 1000; br.leaseEnd = s.time.w + 156; return 'เจ้าของไม่ยอม ขึ้น 30% ไม่งั้นให้ย้ายออก — คุณจำใจต่อ'; } },
        { t: 'ไม่ต่อ ย้ายออกเมื่อหมดสัญญา', fx: function () { br.leaseEnd = s.time.w; return M.closeBranch(s, br.id).msg; } }
      ];
    }
  });
  E.register({
    id: 'fnb_viral', cat: 'market', ind: ['fnb'], weight: 1, cooldown: 30,
    cond: function (s) { return M.openBranches(s.biz).length > 0; },
    title: 'ร้านของคุณดังในติ๊กต๊อก',
    body: 'คลิปรีวิวเมนูของร้านมียอดวิวหลายล้าน คนแห่มาต่อคิวยาวเหยียด พนักงานเริ่มรับมือไม่ไหว',
    choices: function (s) {
      return [
        { t: 'เพิ่มพนักงานชั่วคราวรับคิว (฿60,000)', fx: function () { L.spend(s.fin, 'cogs_staff', 60000); s.biz.buzz.push({ m: 1.6, weeks: 5, total: 5 }); s.biz.brand += 6; return 'รับลูกค้าได้เต็มที่ ได้ลูกค้าประจำใหม่จำนวนมาก'; } },
        { t: 'ปล่อยให้คิวยาวไป (สร้างกระแส)', fx: function () { s.biz.buzz.push({ m: 1.4, weeks: 4, total: 4 }); M.openBranches(s.biz).forEach(function (br) { br.rating -= 0.1; }); s.biz.brand += 4; return 'คิวยาวกลายเป็นคอนเทนต์ แต่รีวิวบ่นเรื่องบริการ'; } }
      ];
    }
  });
  E.register({
    id: 'fnb_guide', cat: 'market', ind: ['fnb'], weight: 0.4, once: true,
    cond: function (s) { return s.biz.menuQ > 75 && s.biz.rating > 4.4; },
    title: 'ร้านของคุณติดไกด์บุ๊กอาหารระดับโลก',
    body: 'ไกด์บุ๊กร้านอาหารชื่อดังประกาศรายชื่อร้านแนะนำประจำปี ร้านของคุณได้รับรางวัลร้านอร่อยคุ้มค่า สื่อทั่วประเทศรายงาน',
    choices: function (s) {
      return [{ t: 'ฉลอง! ใช้โอกาสนี้ทำแคมเปญ', fx: function () { s.biz.brand = Math.min(100, s.biz.brand + 15); s.biz.buzz.push({ m: 1.5, weeks: 12, total: 12 }); H.rep(s, 6); return 'แบรนด์แข็งแกร่งขึ้นมาก'; } }];
    }
  });
  E.register({
    id: 'fnb_delivery_gp', cat: 'market', ind: ['fnb'], weight: 0.6, once: true,
    cond: function (s) { return s.biz.deliv.on && s.time.w > 26; },
    title: 'แอปเดลิเวอรีเสนอดีลพิเศษ',
    body: 'แอปเดลิเวอรีรายใหญ่เสนอให้ร้านคุณเป็นพาร์ทเนอร์พิเศษ: ขึ้นหน้าแรก + ป้าย "ร้านแนะนำ" แลกกับ GP เพิ่มจาก 30% เป็น 35% และห้ามขึ้นแอปคู่แข่ง',
    choices: function (s) {
      return [
        { t: 'ตกลง', fx: function () { s.biz.delivAppBoost = 1.45; s.biz.foodAdj += 0.01; return 'ยอดเดลิเวอรีพุ่ง แต่ GP แพงขึ้น'; } },
        { t: 'ปฏิเสธ', fx: function () { return 'อยู่แบบเดิม'; } }
      ];
    }
  });
  E.register({
    id: 'fnb_staff_walkout', cat: 'team', ind: ['fnb'], weight: function (s) { return s.biz.staffing < 0.9 ? 1.5 : 0.4; }, cooldown: 40, bad: true,
    cond: function (s) { return M.openBranches(s.biz).length > 1; },
    title: 'พนักงานหน้าร้านประท้วงเรื่องเซอร์วิสชาร์จ',
    body: 'พนักงานหลายสาขารวมตัวเรียกร้องให้แบ่งเซอร์วิสชาร์จโปร่งใส และเพิ่มคนต่อกะเพราะทำงานหนักเกินไป ขู่จะหยุดงานพร้อมกันวันเสาร์นี้',
    choices: function (s) {
      return [
        { t: 'เจรจา เพิ่มคน 10% และแบ่งเซอร์วิสชาร์จเต็มจำนวน', fx: function () { s.biz.staffing = Math.min(1.3, s.biz.staffing + 0.1); M.openBranches(s.biz).forEach(function (br) { br.staffSkill += 5; }); return 'พนักงานพอใจ บรรยากาศดีขึ้น'; } },
        { t: 'ไม่ยอม — ใครไม่พอใจก็ลาออก', fx: function () { M.openBranches(s.biz).forEach(function (br) { br.staffSkill = Math.max(20, br.staffSkill - 15); br.rating -= 0.15; }); return 'พนักงานเก่าลาออกจำนวนมาก บริการแย่ลงหลายเดือน'; } }
      ];
    }
  });
})(globalThis.RW = globalThis.RW || {});
