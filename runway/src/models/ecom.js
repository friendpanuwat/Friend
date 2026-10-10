/* RUNWAY — D2C e-commerce brand model */
(function (RW) {
  'use strict';
  var R = RW.R, U = RW.U, F = RW.F, L = RW.Ledger;
  var M = (RW.Models.ecom = { id: 'ecom', b2c: true });
  M.n = 'แบรนด์สินค้าออนไลน์ (D2C)';
  M.d = 'สร้างแบรนด์สินค้าของตัวเอง ผลิตกับ OEM ขายผ่านมาร์เก็ตเพลส โซเชียล และเว็บ — สต็อกคือเงินสดที่จมอยู่ในโกดัง';

  // ---------- Concepts ----------
  var CONCEPTS = (M.CONCEPTS = {
    skincare: {
      n: 'สกินแคร์แบรนด์ไทย', d: 'กำไรขั้นต้นสูง แข่งดุ ต้องพึ่ง KOL และรีวิว ต้องจดแจ้ง อย. ทุกสินค้า',
      repeat: 0.016, upo: 1.5, ret: 0.02, ship: 38, reg: [3, 6], regFee: 8000, shelf: 104, decay: 0, cpc: 4.6, comp: 1.25,
      organic: { market: 260, social: 200, web: 50 }, cvr: { market: 0.03, social: 0.022, web: 0.018 },
      sup: { local: { n: 'OEM ในประเทศ', moq: 1000, lead: [5, 7], mult: 1 }, imp: { n: 'OEM เกาหลี/จีน (นำเข้า)', moq: 3000, lead: [9, 12], mult: 0.72, fx: true } },
      types: [['serum', 'เซรั่มบำรุงผิวหน้า', 590, 95, 1.1, 8], ['sunscreen', 'กันแดด SPF50', 390, 70, 1.15, 10], ['cleanser', 'โฟมล้างหน้า', 290, 45, 0.9, 6], ['moist', 'มอยส์เจอไรเซอร์', 450, 80, 1.0, 8], ['toner', 'โทนเนอร์', 350, 55, 0.85, 6], ['acne', 'เจลแต้มสิว', 250, 32, 1.0, 7], ['body', 'โลชั่นบำรุงผิวกาย', 290, 52, 0.8, 6]],
      comps: [['Glow Lab', 'แบรนด์สกินแคร์ที่ขายดีในมาร์เก็ตเพลส', 62, 0.95, 70], ['ผิวใสคลินิก', 'แบรนด์ของคลินิกความงาม มีฐานลูกค้าหน้าร้าน', 58, 1.2, 50], ['Seoul Beauty Import', 'ผู้นำเข้าแบรนด์เกาหลีหลายสิบแบรนด์', 66, 1.0, 65]]
    },
    coffee: {
      n: 'กาแฟพิเศษคั่วสด', d: 'ลูกค้าซื้อซ้ำบ่อยมาก แต่กำไรขั้นต้นต่ำกว่า สินค้าหมดอายุเร็ว อย. อาหารใช้เวลานาน',
      repeat: 0.032, upo: 1.8, ret: 0.01, ship: 42, reg: [5, 10], regFee: 12000, shelf: 26, decay: 0, cpc: 3.6, comp: 0.9,
      organic: { market: 180, social: 150, web: 70 }, cvr: { market: 0.028, social: 0.018, web: 0.022 },
      sup: { local: { n: 'โรงคั่วรับจ้างผลิต', moq: 300, lead: [2, 3], mult: 1 }, imp: { n: 'นำเข้าเมล็ดเขียว + คั่วเอง', moq: 1500, lead: [6, 9], mult: 0.78, fx: true } },
      types: [['house', 'เฮาส์เบลนด์ 250g', 320, 120, 1.0, 5], ['single', 'Single origin ดอยไทย 200g', 450, 190, 1.05, 6], ['drip', 'กาแฟดริปซอง (10 ซอง)', 290, 95, 1.1, 6], ['coldbrew', 'Cold brew เข้มข้น', 260, 80, 0.95, 7, 8], ['capsule', 'แคปซูลกาแฟ (10 แคปซูล)', 390, 140, 0.9, 8], ['gift', 'กิฟต์เซ็ตเทศกาล', 990, 380, 0.7, 6]],
      comps: [['Roast & Co.', 'โรงคั่วชื่อดังที่ขายออนไลน์มานาน', 64, 1.05, 50], ['ดอยดีคอฟฟี่', 'แบรนด์กาแฟดอยราคาเข้าถึงง่าย', 52, 0.8, 45]]
    },
    apparel: {
      n: 'แฟชั่นแบรนด์ออนไลน์', d: 'เทรนด์เปลี่ยนเร็ว สต็อกตกรุ่นกลายเป็นขยะ คืนสินค้าเยอะ แต่ไม่ต้องขอ อย.',
      repeat: 0.009, upo: 1.4, ret: 0.12, ship: 40, reg: [0, 0], regFee: 0, shelf: 0, decay: 0.018, cpc: 3.2, comp: 1.3,
      organic: { market: 300, social: 260, web: 50 }, cvr: { market: 0.022, social: 0.02, web: 0.014 },
      sup: { local: { n: 'โรงงานตัดเย็บโบ๊เบ๊/ประตูน้ำ', moq: 300, lead: [3, 5], mult: 1 }, imp: { n: 'โรงงานจีน (กวางโจว)', moq: 1200, lead: [7, 10], mult: 0.68, fx: true } },
      types: [['tee', 'เสื้อยืดเบสิก', 290, 95, 0.9, 4], ['shirt', 'เชิ้ต Oversize', 490, 160, 1.0, 5], ['dress', 'เดรส', 790, 280, 1.1, 6], ['pants', 'กางเกงขายาว', 690, 240, 0.95, 5], ['jacket', 'แจ็กเก็ต', 1290, 480, 0.9, 7], ['set', 'ชุดเซ็ต', 990, 330, 1.05, 6]],
      comps: [['Mellow Studio', 'แบรนด์มินิมอลยอดฮิตในไอจี', 60, 1.1, 60], ['Cheap Chic Import', 'ร้านนำเข้าเสื้อผ้าจีนราคาถูกมาก', 40, 0.55, 75], ['Urban Thread', 'แบรนด์ streetwear ที่มีหน้าร้านในห้าง', 64, 1.25, 50]]
    },
    supplement: {
      n: 'อาหารเสริมเพื่อสุขภาพ', d: 'กำไรสูงมาก ซื้อซ้ำดี แต่ อย. ใช้เวลานาน และการโฆษณาเกินจริงมีโทษทางกฎหมาย',
      repeat: 0.02, upo: 1.6, ret: 0.015, ship: 36, reg: [8, 16], regFee: 20000, shelf: 78, decay: 0, cpc: 5.2, comp: 1.2,
      organic: { market: 220, social: 220, web: 45 }, cvr: { market: 0.026, social: 0.024, web: 0.016 },
      sup: { local: { n: 'โรงงาน GMP ในประเทศ', moq: 1000, lead: [5, 8], mult: 1 }, imp: { n: 'นำเข้าวัตถุดิบ + ผลิตในประเทศ', moq: 3000, lead: [10, 14], mult: 0.75, fx: true } },
      types: [['collagen', 'คอลลาเจนผง', 690, 120, 1.1, 8], ['vitc', 'วิตามินซีสูง', 390, 60, 0.95, 6], ['fishoil', 'น้ำมันปลา', 590, 130, 0.85, 7], ['probiotic', 'โพรไบโอติก', 790, 150, 1.05, 9], ['gummy', 'กัมมี่ช่วยนอนหลับ', 450, 75, 1.15, 8], ['fiber', 'ไฟเบอร์ดีท็อกซ์', 390, 55, 1.0, 6]],
      comps: [['VitaPlus', 'แบรนด์อาหารเสริมในร้านขายยา', 60, 1.0, 55], ['ดาราเฮลท์', 'แบรนด์ของดาราที่มียอดขายถล่มทลาย', 50, 1.3, 85]]
    }
  });

  // sales channels
  var CHN = (M.CHN = {
    market: { n: 'มาร์เก็ตเพลส (ร้าน Mall)', fee: 0.13, pay: 0.02, payout: 2, cod: 0.35, d: 'คนเข้าเยอะที่สุด ค่าคอมฯ ~13% + ค่าธรรมเนียม โอนเงินหลังลูกค้ารับของ ~2 สัปดาห์ อันดับร้านโตตามยอดขายและรีวิว' },
    social: { n: 'Social commerce / Live', fee: 0.08, pay: 0.02, payout: 1, cod: 0.4, d: 'ไลฟ์ขายของและคลิปสั้น คอมฯ ~8% + ค่าคอมฯ ครีเอเตอร์ (affiliate) โตแบบไวรัล' },
    web: { n: 'เว็บไซต์แบรนด์', fee: 0, pay: 0.03, payout: 0, cod: 0.15, d: 'ไม่เสียค่าคอมฯ เก็บข้อมูลลูกค้าได้ แต่ต้องพาคนมาเอง (โฆษณา/CRM) ต้องมีคนดูแลเว็บ' },
    retail: { n: 'ร้านค้าปลีกสมัยใหม่', fee: 0, pay: 0, payout: 11, cod: 0, d: 'ขายส่งให้เชนร้านค้าปลีก (ร้านขายยา/ร้านสะดวกซื้อ) ได้ราคา ~62% ของราคาปลีก เครดิต 75 วัน ค่าวางสินค้าต่อ SKU' }
  });

  // mega sale days (month index, week-of-month) and multipliers
  M.MEGA = [[2, 0, '3.3'], [5, 1, '6.6'], [8, 1, '9.9'], [9, 1, '10.10'], [10, 1, '11.11'], [11, 2, '12.12']];

  M.founderMap = {
    build: { rnd: 0.6, buying: 0.4, fulfil: 0.6 },
    sell: { sales: 1, live: 0.6, chat: 0.6 },
    market: { mkt: 0.8, content: 0.9 },
    discover: { discovery: 1 },
    team: { hr: 0.6 },
    fundraise: {},
    admin: { finance: 0.5, ops: 0.5 },
    consult: {}
  };

  M.concepts = function () { return Object.keys(CONCEPTS).map(function (k) { return { id: k, n: CONCEPTS[k].n, d: CONCEPTS[k].d }; }); };
  M.sampleName = 'Somboon';

  // ---------- Init ----------
  M.init = function (state, opt) {
    var key = opt.concept || 'skincare';
    var c = CONCEPTS[key];
    var biz = {
      concept: key, product: c.n, skus: [], nextSku: 1, pos: [], dev: [],
      ch: {
        market: { open: true, ads: 0, rank: 5, velocity: 0, rating: 0, reviews: 0, traffic: 0, orders: 0 },
        social: { open: false, ads: 0, affiliate: 0.1, rank: 3, velocity: 0, rating: 0, reviews: 0, traffic: 0, orders: 0 },
        web: { open: false, ads: 0, traffic: 0, orders: 0, seo: 0 },
        retail: { open: false, stores: 0, chains: [], orders: 0 }
      },
      brand: 5, buzz: [], creative: 0.6, crm: false, cod: true, freeShip: 299, campaign: { disc: 0.15 },
      customers: 0, active: 0, fulfil: { mode: 'self', backlog: 0, cap: 0 }, chat: { backlog: 0 },
      rating: 4.5, quality: 60, weekRev: 0, weekStats: {}, mstats: M.blankStats(), stats: [], insight: 0,
      lifetime: { orders: 0, customers: 0 }
    };
    state.biz = biz;
    // first product idea is in development
    M.startDev(state, c.types[0][0], 'mass', true);
    c.comps.forEach(function (x) {
      RW.World.addCompetitor(state, { name: x[0], desc: x[1], quality: x[2], price: x[3], mkt: x[4], cash: R.range(5e6, 40e6), burn: R.range(0.4e6, 1.5e6), stage: R.pick(['bootstrap', 'seed', 'A']), aggr: R.range(0.3, 0.8) });
    });
    return biz;
  };
  M.blankStats = function () { return { orders: 0, newCust: 0, gmv: 0, rev: 0, units: 0, adSpend: 0, byCh: { market: { o: 0, r: 0, t: 0 }, social: { o: 0, r: 0, t: 0 }, web: { o: 0, r: 0, t: 0 }, retail: { o: 0, r: 0, t: 0 } }, stockout: 0, rto: 0, returns: 0, expired: 0 }; };

  M.welcome = function (state) {
    var c = CONCEPTS[state.biz.concept];
    return 'คุณลาออกมาสร้างแบรนด์ "' + c.n + '" — ' + c.d + '\n\nสิ่งที่ต้องทำช่วงแรก:\n1) จดทะเบียนบริษัท (จำเป็นสำหรับขอ อย. และเปิดร้าน Mall)\n2) พัฒนาสินค้าตัวแรกให้เสร็จ (หน้าสินค้า & สต็อก) แล้วสั่งผลิตล็อตแรก — ระวัง MOQ และเงินมัดจำ\n3) เปิดร้านในมาร์เก็ตเพลส ทดลองยิงโฆษณาเล็กๆ ดูว่าคนซื้อไหม\n4) วางแผนสต็อกล่วงหน้าก่อนแคมเปญใหญ่ 11.11 / 12.12\n\nเงินที่จมในสต็อกคือเงินที่จ่ายเงินเดือนไม่ได้';
  };

  M.typeOf = function (b, t) { return CONCEPTS[b.concept].types.find(function (x) { return x[0] === t; }); };

  // ---------- Product development ----------
  M.POS = { mass: { n: 'ตลาดแมส', price: 1, cost: 1, q: 55, dev: 1 }, premium: { n: 'พรีเมียม', price: 1.6, cost: 1.45, q: 75, dev: 1.5 } };
  M.startDev = function (state, type, pos, free) {
    var b = state.biz, c = CONCEPTS[b.concept];
    var t = M.typeOf(b, type);
    var p = M.POS[pos];
    var fee = Math.round((35000 + t[2] * 60) * p.dev / 1000) * 1000;
    if (!free) L.spend(state.fin, 'other_exp', fee);
    var d = { id: 'd' + (b.nextSku++), type: type, pos: pos, n: t[1] + (pos === 'premium' ? ' (พรีเมียม)' : ''), need: t[5] * p.dev * 1.2, prog: 0, fee: fee, regLeft: null };
    b.dev.push(d);
    return d;
  };

  M.devWeekly = function (state) {
    var b = state.biz, c = CONCEPTS[b.concept];
    var cap = (RW.Team.capOf(state, 'rnd') * 1.0 + 0.35) * RW.Engine.tm(state, 'dev'); // OEM's own formulation team helps a bit
    var active = b.dev.filter(function (d) { return d.regLeft == null; });
    active.forEach(function (d) { d.prog += cap / Math.max(1, active.length); });
    b.dev.forEach(function (d) {
      if (d.regLeft == null && d.prog >= d.need) {
        if (c.reg[1] > 0) {
          if (!state.company.registered) return; // can't file without a company
          d.regLeft = R.int(c.reg[0], c.reg[1]) - (state.flags.fastPermit ? 2 : 0);
          L.spend(state.fin, 'prof', c.regFee);
          RW.Engine.mail(state, 'product', 'สูตร/ต้นแบบ "' + d.n + '" เสร็จแล้ว — ยื่นขอ อย.', 'ค่าธรรมเนียม ' + F.b(c.regFee) + ' · รอผลประมาณ ' + d.regLeft + ' สัปดาห์');
        } else d.regLeft = 0;
      }
      if (d.regLeft != null && d.regLeft > 0) d.regLeft--;
      if (d.regLeft === 0) { M.launchSku(state, d); d.done = true; }
    });
    b.dev = b.dev.filter(function (d) { return !d.done; });
  };

  M.launchSku = function (state, d) {
    var b = state.biz, c = CONCEPTS[b.concept];
    var t = M.typeOf(b, d.type), p = M.POS[d.pos];
    // true appeal is uncertain; customer insight narrows the spread
    var spread = U.lerp(0.35, 0.12, U.clamp(b.insight / 100, 0, 1));
    var appeal = Math.max(0.3, t[4] * R.normal(1 + b.insight / 500, spread));
    var sku = {
      id: d.id, type: d.type, n: d.n, pos: d.pos, price: Math.round(t[2] * p.price / 10) * 10 - 10, cost: Math.round(t[3] * p.cost),
      quality: U.clamp(p.q + R.normal(0, 8) + RW.Team.capOf(state, 'rnd') * 4, 20, 98), appeal: appeal, appealSeen: null,
      lots: [], born: state.time.w, active: true, sold: 0, week: 0, avg: 0, ret: c.ret, auto: false, cover: 8, shelf: t[6] || c.shelf, oos: 0
    };
    b.skus.push(sku);
    RW.Engine.mail(state, 'product', 'สินค้าใหม่พร้อมขาย: ' + sku.n, 'ราคาตั้งต้น ' + F.b(sku.price) + ' · ต้นทุนผลิตต่อชิ้น ~' + F.b(sku.cost) + ' — สั่งผลิตล็อตแรกที่หน้าสินค้า & สต็อก (ขั้นต่ำ ' + F.num(c.sup.local.moq) + ' ชิ้น)', 'good');
  };

  // ---------- Purchasing ----------
  M.unitCost = function (state, sku, sup, qty) {
    var c = CONCEPTS[state.biz.concept], s = c.sup[sup];
    var scale = 1 - 0.12 * Math.log10(Math.max(1, qty / s.moq));
    var buy = 1 - Math.min(0.1, RW.Team.capOf(state, 'buying') * 0.05);
    var fx = s.fx ? state.world.fx / 35.5 : 1;
    return Math.max(sku.cost * 0.4, sku.cost * s.mult * scale * buy * fx);
  };
  M.placePO = function (state, skuId, qty, sup, auto) {
    var b = state.biz, c = CONCEPTS[b.concept], s = c.sup[sup];
    var sku = b.skus.find(function (x) { return x.id === skuId; });
    if (!sku) return { ok: false, msg: 'ไม่พบสินค้า' };
    qty = Math.max(s.moq, Math.round(qty / 50) * 50);
    var unit = M.unitCost(state, sku, sup, qty);
    var total = Math.round(unit * qty);
    var deposit = Math.round(total * 0.5);
    if (state.fin.bal.cash < deposit) return { ok: false, msg: 'เงินสดไม่พอจ่ายมัดจำ 50% (' + F.b(deposit) + ')' };
    L.post(state.fin, { prepaid: deposit, cash: -deposit }, 'op');
    var lead = R.int(s.lead[0], s.lead[1]);
    b.pos.push({ id: R.id('po'), sku: skuId, qty: qty, unit: unit, total: total, deposit: deposit, arrive: state.time.w + lead, sup: sup, auto: !!auto });
    return { ok: true, msg: 'สั่งผลิต ' + sku.n + ' ' + F.num(qty) + ' ชิ้น @' + F.b(unit) + ' รวม ' + F.b(total) + ' — จ่ายมัดจำ ' + F.b(deposit) + ' ของจะมาถึงใน ~' + lead + ' สัปดาห์' };
  };
  M.receivePOs = function (state) {
    var b = state.biz, w = state.time.w, keep = [];
    b.pos.forEach(function (po) {
      if (po.arrive > w) { keep.push(po); return; }
      var sku = b.skus.find(function (x) { return x.id === po.sku; });
      var bal = po.total - po.deposit;
      L.post(state.fin, { inventory: po.total, prepaid: -po.deposit, cash: -bal }, 'op');
      var defect = R.chance(0.04 * (po.sup === 'imp' ? 1.5 : 1) / (1 + RW.Team.capOf(state, 'buying') * 0.5));
      if (sku) {
        sku.lots.push({ q: po.qty, c: po.unit, exp: sku.shelf ? w + sku.shelf : 0 });
        if (defect) RW.Events.queue(state, 'ecom_defect', { sku: sku.id, qty: Math.round(po.qty * R.range(0.1, 0.35)) });
      }
      RW.Engine.mail(state, 'product', 'สินค้าเข้าคลัง: ' + (sku ? sku.n : 'สินค้า') + ' ' + F.num(po.qty) + ' ชิ้น', 'จ่ายส่วนที่เหลือ ' + F.b(bal));
    });
    b.pos = keep;
  };
  M.stock = function (sku) { return U.sum(sku.lots, function (l) { return l.q; }); };
  M.incoming = function (b, id) { return U.sum(b.pos.filter(function (p) { return p.sku === id; }), function (p) { return p.qty; }); };
  M.stockValue = function (b) { return U.sum(b.skus, function (s) { return U.sum(s.lots, function (l) { return l.q * l.c; }); }); };

  // take units FIFO, returns cost
  M.takeUnits = function (sku, n) {
    var cost = 0, left = n;
    sku.lots.sort(function (a, c) { return (a.exp || 1e9) - (c.exp || 1e9); });
    for (var i = 0; i < sku.lots.length && left > 0; i++) {
      var l = sku.lots[i];
      var t = Math.min(l.q, left);
      l.q -= t; left -= t; cost += t * l.c;
    }
    sku.lots = sku.lots.filter(function (l) { return l.q > 0; });
    return { taken: n - left, cost: cost };
  };

  // ---------- Demand ----------
  M.isMega = function (w) {
    var i = RW.T.info(w);
    return M.MEGA.find(function (m) { return m[0] === i.month && m[1] === i.weekOfMonth; }) || null;
  };
  M.buzzMult = function (b) { var m = 1; b.buzz.forEach(function (x) { m *= 1 + (x.m - 1) * (x.weeks / x.total); }); return m; };

  M.weekly = function (state, info) {
    var b = state.biz, c = CONCEPTS[b.concept], fin = state.fin, w = state.time.w;
    b.buzz.forEach(function (x) { x.weeks--; });
    b.buzz = b.buzz.filter(function (x) { return x.weeks > 0; });
    M.devWeekly(state);
    M.receivePOs(state);
    // insight from talking to customers
    b.insight = U.clamp(b.insight + RW.Team.capOf(state, 'discovery') * 4 * (1 - b.insight / 110) + Math.log10(1 + b.customers) * 0.05, 0, 100);
    // creative freshness: decays, refreshed by content production
    var content = RW.Team.capOf(state, 'content') + RW.Team.capOf(state, 'f_market') * 0.4;
    b.creative = U.clamp(b.creative * 0.93 + content * 0.09 + (b.ch.social.open ? RW.Team.capOf(state, 'live') * 0.03 : 0), 0.15, 1);
    var sellable = b.skus.filter(function (s) { return s.active && M.stock(s) > 0; });
    var listed = b.skus.filter(function (s) { return s.active; });
    var st = { orders: 0, newCust: 0, gmv: 0, rev: 0, units: 0, adSpend: 0, byCh: {}, stockout: 0 };
    b.weekStats = st;
    if (!listed.length) { b.weekRev = 0; M.fixedWeekly(state); return; }
    var mega = M.isMega(w), preMega = M.isMega(w + 1);
    var vat = fin.vat.registered ? 1 / 1.07 : 1;
    // average attractiveness of the catalogue
    var attr = U.avg(listed, function (s) { return s.appeal * (0.6 + s.quality / 250); });
    var priceF = U.avg(listed, function (s) { var t = M.typeOf(b, s.type); var ref = t[2] * M.POS[s.pos].price; return Math.pow(ref / s.price, 1.4); });
    var compF = 1 / (1 + U.sum(RW.World.aliveCompetitors(state), function (x) { return x.mkt / 100 * 0.12; }) * c.comp);
    var brandF = (0.5 + b.brand / 60) * M.buzzMult(b) * state.world.macro.consumer * state.diff.market;
    var ratingF = b.rating >= 4.7 ? 1.15 : b.rating >= 4.4 ? 1 : b.rating >= 4.0 ? 0.8 : 0.55;
    var csF = 1 - Math.min(0.35, (b.chat.backlog || 0) / 600);
    var season = [1.0, 0.95, 1.0, 1.08, 0.95, 0.95, 0.95, 1.0, 1.0, 1.05, 1.2, 1.3][info.month];
    var mkt = RW.Team.capOf(state, 'mkt');
    var adEff = (1 + Math.min(1, mkt * 0.3)) * (0.45 + 0.55 * b.creative) * RW.Engine.tm(state, 'mkt');
    var orders = {};
    ['market', 'social', 'web'].forEach(function (k) {
      var ch = b.ch[k];
      if (!ch.open) return;
      var org = c.organic[k] * brandF * (k === 'web' ? 1 + ch.seo / 50 : (1 + Math.log10(1 + ch.velocity) * 0.9) * (ch.rank / 5));
      if (k === 'social') org *= 1 + RW.Team.capOf(state, 'live') * 0.8 + ch.affiliate * 3;
      var paid = 0;
      if (ch.ads > 0) {
        L.spend(fin, 'mkt', ch.ads);
        st.adSpend += ch.ads;
        var cpc = c.cpc * Math.pow(1 + ch.ads / 120000, 0.55) / compF * (k === 'market' ? 0.85 : 1);
        paid = ch.ads / cpc * adEff;
      }
      var traffic = org + paid;
      var cvr = c.cvr[k] * attr * Math.pow(priceF, 0.8) * ratingF * csF * (k === 'web' ? 1 + (b.cod ? 0.25 : 0) : 1);
      if (k === 'market' && mega) cvr *= 1 + b.campaign.disc * 10;
      if (k === 'market' && preMega) cvr *= 0.85;
      if (k === 'market' && info.weekOfMonth === info.weeksInMonth - 1) cvr *= 1.15; // payday sale
      var n = R.poisson(traffic * cvr * season);
      orders[k] = n;
      ch.traffic = traffic;
      st.byCh[k] = { o: 0, r: 0, t: traffic };
    });
    // repeat orders from active customer base
    var crm = b.crm ? 1.35 : 1;
    var repeat = R.poisson(b.active * c.repeat * crm * U.clamp(attr, 0.5, 1.4) * ratingF);
    var repeatSplit = b.ch.web.open ? { web: 0.45, market: 0.45, social: 0.1 } : { market: 0.85, social: 0.15 };
    Object.keys(repeatSplit).forEach(function (k) { if (b.ch[k].open) orders[k] = (orders[k] || 0) + Math.round(repeat * repeatSplit[k]); });
    // fulfillment capacity
    var totalOrders = U.sum(Object.keys(orders), function (k) { return orders[k]; });
    var capF = M.fulfilCap(state);
    b.fulfil.cap = capF;
    var lateRatio = totalOrders + b.fulfil.backlog > capF ? (totalOrders + b.fulfil.backlog - capF) / Math.max(1, totalOrders + b.fulfil.backlog) : 0;
    b.fulfil.backlog = Math.max(0, b.fulfil.backlog + totalOrders - capF) * 0.5; // half cancel/ship late
    var chatCap = (RW.Team.capOf(state, 'chat') * 450 + 60);
    b.chat.backlog = Math.max(0, b.chat.backlog * 0.5 + totalOrders * 0.6 - chatCap);
    // allocate orders to SKUs by appeal, constrained by stock
    var weekRev = 0, newCust = 0;
    Object.keys(orders).forEach(function (k) {
      var n = orders[k];
      if (n <= 0) return;
      var ch = CHN[k];
      var revK = 0, units = 0, cogs = 0, ordersFilled = 0;
      for (var i = 0; i < n; i++) {
        var pool = b.skus.filter(function (s) { return s.active; });
        var pick = R.weighted(pool, function (s) { return s.appeal; });
        var sku = M.stock(pick) > 0 ? pick : (R.chance(0.35) ? R.weighted(pool.filter(function (s) { return M.stock(s) > 0; }), function (s) { return s.appeal; }) : null);
        if (!sku) { st.stockout++; pick.oos++; continue; }
        var u = Math.max(1, R.poisson(c.upo - 1) + 1);
        var tk = M.takeUnits(sku, u);
        if (tk.taken <= 0) { st.stockout++; continue; }
        var price = sku.price * (k === 'market' && mega ? 1 - b.campaign.disc : 1);
        revK += price * tk.taken; units += tk.taken; cogs += tk.cost; ordersFilled++;
        sku.sold += tk.taken; sku.week += tk.taken;
      }
      if (ordersFilled <= 0) return;
      var netRev = revK * vat;
      // cash collection by channel
      var feeRate = ch.fee + (k === 'market' ? b.feeAdj || 0 : 0) + ch.pay + (k === 'market' && mega ? 0.03 : 0) + (k === 'social' ? b.ch.social.affiliate * 0.5 : 0);
      var shipCost = ordersFilled * (c.ship + 8) * (k === 'web' && revK / ordersFilled > b.freeShip ? 1 : 0.55);
      var codShare = b.cod || k !== 'web' ? ch.cod : 0;
      var rto = R.binom(Math.round(ordersFilled * codShare), 0.09);
      var rtoCost = rto * (c.ship * 2 + 10);
      var rtoRev = rto / ordersFilled * netRev;
      var payoutRev = netRev - rtoRev;
      if (ch.payout > 0) L.invoice(state, 'rev_goods', payoutRev, state.time.w + ch.payout, { name: ch.n, seg: k, sure: true });
      else L.earnCash(fin, 'rev_goods', payoutRev);
      L.post(fin, { cogs_platform: payoutRev * feeRate, cash: -payoutRev * feeRate }, 'op');
      // goods returned by RTO go back to stock (approx: add cost back as a fresh lot on a random sku)
      var unitsKept = units * (1 - rto / ordersFilled);
      L.post(fin, { cogs_goods: cogs * (1 - rto / ordersFilled), inventory: -cogs * (1 - rto / ordersFilled) });
      if (rto > 0) { /* returned units restocked */ var anySku = b.skus.find(function (s) { return s.active; }); if (anySku) anySku.lots.push({ q: Math.round(units * rto / ordersFilled), c: cogs / units, exp: anySku.shelf ? w + Math.round(anySku.shelf / 2) : 0 }); }
      L.spend(fin, 'cogs_fulfil', shipCost + rtoCost + (b.fulfil.mode === '3pl' ? ordersFilled * 25 : 0));
      st.byCh[k].o += ordersFilled; st.byCh[k].r += payoutRev;
      st.orders += ordersFilled; st.units += unitsKept; st.gmv += revK; st.rev += payoutRev; st.rto = (st.rto || 0) + rto;
      weekRev += payoutRev;
      b.ch[k].orders = ordersFilled;
      if (b.ch[k].velocity != null) b.ch[k].velocity = b.ch[k].velocity * 0.85 + ordersFilled;
    });
    // retail channel
    if (b.ch.retail.open && b.ch.retail.stores > 0) M.retailWeekly(state, st, vat);
    // returns & refunds
    var retUnits = st.units * c.ret;
    if (retUnits > 0 && st.units > 0) {
      var refund = st.rev * c.ret;
      L.post(fin, { contra_rev: refund, cash: -refund }, 'op');
      st.returns = retUnits; st.rev -= refund; weekRev -= refund;
    }
    // customers
    newCust = Math.max(0, st.orders - repeat) * 0.85;
    b.customers += newCust; b.active += newCust;
    b.active *= 1 - U.weeklyFromMonthly(0.11);
    st.newCust = newCust;
    b.lifetime.orders += st.orders;
    // rating & ranking
    var quality = U.avg(listed, function (s) { return s.quality; });
    var target = 3.6 + quality / 100 * 1.3 - lateRatio * 1.2 - (b.chat.backlog > 300 ? 0.3 : 0) - (st.stockout > st.orders * 0.3 ? 0.1 : 0);
    b.rating = U.clamp(U.approach(b.rating, target, 0.05 + Math.min(0.1, st.orders / 5000)), 1, 5);
    b.quality = quality;
    ['market', 'social'].forEach(function (k) {
      var ch = b.ch[k];
      if (!ch.open) return;
      ch.reviews += (st.byCh[k] ? st.byCh[k].o : 0) * 0.08;
      ch.rating = b.rating;
      var rt = 3 + Math.log10(1 + ch.velocity) * 1.8 + (b.rating - 4.4) * 3 + Math.log10(1 + ch.reviews) * 0.6;
      ch.rank = U.clamp(U.approach(ch.rank, rt, 0.12), 1, 20);
    });
    b.ch.web.seo = Math.min(100, b.ch.web.seo * 0.995 + (b.ch.web.open ? RW.Team.capOf(state, 'content') * 0.3 + Math.log10(1 + b.customers) * 0.05 : 0));
    // brand
    b.brand = U.clamp(b.brand * 0.996 + st.adSpend / 1500000 + Math.log10(1 + st.orders) * 0.05 + (b.creative - 0.5) * 0.05, 0, 100);
    M.fixedWeekly(state);
    M.autoReplenish(state);
    b.skus.forEach(function (s) { s.avg = s.avg * 0.8 + s.week * 0.2; s.week = 0; if (s.appealSeen == null && s.sold > 50) s.appealSeen = s.appeal; });
    // month accumulators
    var ms = b.mstats;
    ['orders', 'newCust', 'gmv', 'rev', 'units', 'adSpend', 'stockout', 'returns'].forEach(function (k2) { ms[k2] += st[k2] || 0; });
    ms.rto += st.rto || 0;
    Object.keys(st.byCh).forEach(function (k3) { ms.byCh[k3].o += st.byCh[k3].o; ms.byCh[k3].r += st.byCh[k3].r; ms.byCh[k3].t += st.byCh[k3].t; });
    b.weekRev = weekRev;
  };

  M.fulfilCap = function (state) {
    var b = state.biz;
    if (b.fulfil.mode === '3pl') return 1e6;
    return RW.Team.capOf(state, 'fulfil') * 320 + RW.Team.capOf(state, 'ops') * 60 + 25;
  };

  M.retailWeekly = function (state, st, vat) {
    var b = state.biz, c = CONCEPTS[b.concept];
    var listed = b.skus.filter(function (s) { return s.active && s.retail; });
    var rev = 0;
    listed.forEach(function (sku) {
      var vel = 0.35 * sku.appeal * (0.5 + b.brand / 80) * state.world.macro.consumer;
      var units = R.poisson(b.ch.retail.stores * vel);
      var tk = M.takeUnits(sku, units);
      if (tk.taken < units) st.stockout += units - tk.taken;
      if (tk.taken <= 0) return;
      var wholesale = sku.price * 0.62 * tk.taken * vat;
      L.invoice(state, 'rev_goods', wholesale, state.time.w + 11, { name: 'ร้านค้าปลีก', seg: 'retail', wht: true });
      L.post(state.fin, { cogs_goods: tk.cost, inventory: -tk.cost });
      L.spend(state.fin, 'mkt', wholesale * 0.05); // trade promotion support
      sku.sold += tk.taken; sku.week += tk.taken;
      rev += wholesale;
    });
    st.byCh.retail = { o: 0, r: rev, t: 0 };
    st.rev += rev; st.gmv += rev;
  };

  M.fixedWeekly = function (state) {
    var b = state.biz;
    // storage cost for inventory
    var units = U.sum(b.skus, function (s) { return M.stock(s); });
    var storage = units * (b.fulfil.mode === '3pl' ? 0.6 : 0.25);
    if (storage > 0) L.spend(state.fin, 'cogs_fulfil', storage);
  };

  M.forecastWeekly = function (sku) { return Math.max(sku.avg, 1); };

  M.autoReplenish = function (state) {
    var b = state.biz;
    b.skus.forEach(function (s) {
      if (!s.active || !s.auto) return;
      var lead = CONCEPTS[b.concept].sup[s.autoSup || 'local'].lead[1];
      var have = M.stock(s) + M.incoming(b, s.id);
      var need = M.forecastWeekly(s) * (lead + s.cover);
      if (have < need * 0.75) {
        var r = M.placePO(state, s.id, need - have, s.autoSup || 'local', true);
        if (!r.ok) { s.auto = false; RW.Engine.mail(state, 'product', 'สั่งผลิตอัตโนมัติไม่สำเร็จ: ' + s.n, r.msg + ' — ปิดการสั่งอัตโนมัติไว้ก่อน', 'warn'); }
      }
    });
  };

  // ---------- Monthly ----------
  M.monthly = function (state, info) {
    var b = state.biz, fin = state.fin, w = state.time.w, c = CONCEPTS[b.concept];
    if (b.crm) L.spend(fin, 'software', 9000 + b.active * 0.4);
    if (b.ch.web.open) L.spend(fin, 'software', 3500);
    if (b.fulfil.mode === 'self' && RW.Team.capOf(state, 'fulfil') > 0.5) L.spend(fin, 'rent', 18000 + RW.Team.capOf(state, 'fulfil') * 4000);
    // expiry & trend decay
    var waste = 0;
    b.skus.forEach(function (s) {
      s.lots.forEach(function (l) {
        if (l.exp && l.exp <= w + 4 && l.q > 0) { waste += l.q * l.c; b.mstats.expired += l.q; l.q = 0; }
      });
      s.lots = s.lots.filter(function (l) { return l.q > 0; });
      if (c.decay && w - s.born > 12) s.appeal = Math.max(0.15, s.appeal * (1 - c.decay * 4.33));
    });
    if (waste > 0) {
      L.post(fin, { cogs_waste: waste, inventory: -waste });
      RW.Engine.mail(state, 'product', 'ตัดสต็อกสินค้าหมดอายุ ' + F.b(waste), 'สินค้าใกล้หมดอายุขายไม่ได้ ต้องทำลายทิ้ง — สั่งผลิตให้พอดีกับยอดขาย', 'warn');
    }
    // retail chains: monthly listing upkeep / rebate
    if (b.ch.retail.open) L.spend(fin, 'mkt', b.ch.retail.stores * 120);
    b.stats.push(b.mstats);
    if (b.stats.length > 24) b.stats.shift();
    b.mstats = M.blankStats();
  };

  // ---------- KPIs ----------
  M.kpis = function (state) {
    var b = state.biz;
    var last3 = U.last(b.stats, 3);
    var orders = U.sum(last3, function (m) { return m.orders; }), newC = U.sum(last3, function (m) { return m.newCust; });
    var gmv = U.sum(last3, function (m) { return m.gmv; }), ad = U.sum(last3, function (m) { return m.adSpend; });
    var rev = U.sum(last3, function (m) { return m.rev; });
    var sm = U.sum(U.last(state.hist.monthly, 3), function (m) { return (m.pl.mkt || 0) + (m.pl.sal_sm || 0) + (m.pl.commission || 0); });
    var inv = state.fin.bal.inventory;
    var cogsM = U.avg(U.last(state.hist.monthly, 3), function (m) { return m.pl.cogs_goods || 0; });
    var aov = orders > 0 ? gmv / orders : 0;
    var repeatShare = orders > 0 ? 1 - newC / orders : 0;
    var mo = b.stats.length ? b.stats[b.stats.length - 1] : null;
    var stockout = mo && mo.orders + mo.stockout > 0 ? mo.stockout / (mo.orders + mo.stockout) : 0;
    var c = CONCEPTS[b.concept];
    var gm = state.kpi && state.kpi.gm ? state.kpi.gm : 0.5;
    var cac = newC > 0 ? sm / newC : null;
    var ltv = aov * gm * (1 + c.repeat * 4.33 * 12 * 1.2);
    return {
      customers: Math.round(b.customers), activeCustomers: Math.round(b.active), orders3: orders, aov: aov, roas: ad > 0 ? rev / ad : null,
      cac: cac, ltv: ltv, ltvCac: cac ? ltv / cac : null, repeatShare: repeatShare, invDays: cogsM > 0 ? inv / cogsM * 30 : null, inventory: inv,
      stockout: stockout, rating: b.rating, marketShare: Math.min(0.5, rev / 3 / 30e6),
      workload: { cogs: 1 + Math.min(0.8, (b.fulfil.backlog || 0) / Math.max(50, b.fulfil.cap) + (b.chat.backlog || 0) / 800), sm: 1, rnd: 1 },
      arr: 0, mrr: 0
    };
  };
  M.monthKPIs = function (state) {
    var b = state.biz, mo = b.stats.length ? b.stats[b.stats.length - 1] : null;
    return { orders: mo ? mo.orders : 0, gmv: mo ? mo.gmv : 0, customers: Math.round(b.customers), inventory: state.fin.bal.inventory };
  };
  M.reportLine = function (state) {
    var k = state.kpi, mo = state.biz.stats.length ? state.biz.stats[state.biz.stats.length - 1] : null;
    return 'ออเดอร์ ' + F.num(mo ? mo.orders : 0) + ' · AOV ' + F.b(k.aov) + ' · ROAS ' + (k.roas ? k.roas.toFixed(1) + 'x' : '–') + ' · สต็อก ' + F.m(k.inventory) + (k.invDays ? ' (' + Math.round(k.invDays) + ' วัน)' : '') + ' · เรตติ้ง ' + state.biz.rating.toFixed(2);
  };
  M.forecastCost = function (state) {
    var b = state.biz;
    return (b.ch.market.ads + b.ch.social.ads + b.ch.web.ads) * 4.33;
  };
  M.forecastRevenue = function (state) { return state.kpi.revenueMonthly || 0; };
  M.rbfEligible = function (state) { return state.hist.monthly.length >= 6 && (state.kpi.revenueMonthly || 0) > 300000; };

  M.traction = function (state) {
    var b = state.biz, k = state.kpi;
    var revRun = (k.revenueMonthly || 0) * 12;
    var eq = revRun * (0.3 + 0.45 * U.clamp(k.repeatShare || 0, 0, 0.8)) * U.clamp((k.gm || 0.4) / 0.55, 0.5, 1.3);
    var prod = b.skus.length ? 5 + Math.min(5, b.skus.length) + (b.rating - 4) * 4 : (b.dev.length ? 3 : 0);
    var arrPts = 20 * Math.log10(1 + eq / 250000);
    var g = Math.pow(1 + (k.cmgr3 || 0), 12) - 1;
    var growthPts = U.clamp(11 * Math.log2(1 + Math.max(-0.5, g)), -15, 24) * Math.min(1, revRun / 3e6);
    var execs = RW.Team.active(state).filter(function (e) { return e.level >= 4; }).length + (state.cofounders || []).filter(function (c) { return c.active; }).length;
    var team = Math.min(8, execs * 1.5 + state.founder.rep / 12);
    var eff = revRun > 10e6 ? (k.ebitdaMargin > 0 ? 5 : k.burnMultiple > 4 ? -4 : 0) : 0;
    var invPenalty = k.invDays > 150 ? -5 : 0;
    var score = prod + arrPts + growthPts + team + eff + invPenalty + Math.min(6, b.brand / 10);
    return { score: score, arr: eq, growth: g, lines: [['รายได้ (annualized)', F.m(revRun)], ['การเติบโต', revRun > 0 ? F.spct(g, 0) : '–'], ['ซื้อซ้ำ', F.pct(k.repeatShare || 0, 0)], ['เรตติ้ง', b.rating.toFixed(2)], ['ลูกค้าสะสม', F.num(Math.round(b.customers))]] };
  };
  M.valuation = function (state) {
    var tr = M.traction(state);
    var qual = RW.Models.saas.qualValue(tr.score);
    var revRun = (state.kpi.revenueMonthly || 0) * 12;
    if (revRun <= 0) return qual;
    var g = U.clamp(tr.growth, 0, 3);
    var mult = (0.8 + 1.6 * Math.pow(g, 0.6)) * (0.7 + (state.kpi.repeatShare || 0)) * Math.sqrt(Math.max(0.2, state.kpi.gm || 0.4) / 0.55);
    var fund = revRun * mult;
    if (state.kpi.ebitdaMargin > 0.08) fund = Math.max(fund, revRun * state.kpi.ebitdaMargin * 12);
    var a = Math.sqrt(U.clamp(revRun / 60e6, 0, 1));
    return Math.exp(a * Math.log(fund) + (1 - a) * Math.log(qual));
  };

  M.advice = function (state) {
    var b = state.biz, out = [], k = state.kpi, c = CONCEPTS[b.concept];
    function add(l, t) { out.push({ lvl: l, t: t }); }
    var w = state.time.w;
    if (!b.skus.length && b.dev.length && c.reg[1] > 0 && !state.company.registered) add('warn', 'ต้องจดทะเบียนบริษัทก่อนจึงยื่นขอ อย. ได้');
    b.skus.forEach(function (s) {
      if (!s.active) return;
      var st = M.stock(s), inc = M.incoming(b, s.id), f = M.forecastWeekly(s);
      var lead = c.sup.local.lead[1];
      if (st === 0 && inc === 0) add('crit', s.n + ' สินค้าหมด และไม่มีของกำลังมา — ทุกออเดอร์ที่หลุดไปคือรายได้และอันดับร้านที่เสีย');
      else if (st < f * lead && inc === 0 && s.avg > 2) add('warn', s.n + ' สต็อกพอขายอีก ~' + Math.round(st / f) + ' สัปดาห์ แต่สั่งผลิตต้องรอ ' + lead + ' สัปดาห์');
      if (st > f * 30 && s.avg > 1) add('warn', s.n + ' สต็อกล้น (~' + Math.round(st / f) + ' สัปดาห์) — เงินจมและเสี่ยงหมดอายุ');
    });
    var nextMega = null;
    for (var i = 1; i <= 8; i++) if (M.isMega(w + i)) { nextMega = [i, M.isMega(w + i)[2]]; break; }
    if (nextMega && nextMega[0] >= 3) add('info', 'แคมเปญ ' + nextMega[1] + ' อีก ' + nextMega[0] + ' สัปดาห์ — ยอดขายมาร์เก็ตเพลสจะพุ่งหลายเท่า เตรียมสต็อกให้พอ');
    if (b.creative < 0.35) add('warn', 'ครีเอทีฟโฆษณาเก่า คนเห็นซ้ำจนเบื่อ (creative fatigue) — ต้นทุนโฆษณาแพงขึ้น จ้าง Content creator หรือใช้เวลาทำการตลาด');
    if (b.fulfil.backlog > 30) add('warn', 'แพ็กของไม่ทัน ออเดอร์ค้าง ' + Math.round(b.fulfil.backlog) + ' — เรตติ้งร้านจะตก จ้างพนักงานคลังหรือใช้ 3PL');
    if (b.chat.backlog > 200) add('warn', 'แชทลูกค้าค้างจำนวนมาก — อัตราการซื้อลดลง จ้างแอดมิน');
    if (b.rating < 4.2 && b.skus.length) add('warn', 'เรตติ้งร้าน ' + b.rating.toFixed(2) + ' — อันดับในมาร์เก็ตเพลสกำลังร่วง');
    if (k.roas != null && k.roas < 1.5 && (b.ch.market.ads + b.ch.social.ads + b.ch.web.ads) > 0) add('warn', 'ROAS ' + k.roas.toFixed(1) + 'x — โฆษณาขาดทุนหลังหักต้นทุนสินค้าและค่าธรรมเนียม');
    if (state.fin.vat.registered && !state.flags.vatRepriced) add('info', 'จด VAT แล้ว ราคาที่ลูกค้าจ่ายรวม VAT — ถ้าไม่ปรับราคา รายได้สุทธิหายไป 6.5%');
    return out;
  };

  M.onEmployeeLeft = function () { };
  M.onCompetitorDied = function (state) { state.biz.buzz.push({ m: 1.2, weeks: 6, total: 6 }); };
  M.onPandemic = function (state, pivot) { state.biz.buzz.push({ m: pivot ? 1.5 : 1.3, weeks: 10, total: 10 }); state.flags.supplyShock = state.time.w + 10; };
  M.onDisaster = function (state, sev) {
    var b = state.biz;
    if (b.fulfil.mode === '3pl') return;
    var lost = 0;
    b.skus.forEach(function (s) { s.lots.forEach(function (l) { var d = Math.round(l.q * sev * 0.4); l.q -= d; lost += d * l.c; }); });
    if (lost > 0) { L.post(state.fin, { cogs_waste: lost, inventory: -lost }); RW.Engine.mail(state, 'product', 'สต็อกเสียหายจากน้ำท่วม ' + F.b(lost), 'น้ำเข้าที่เก็บสินค้า', 'bad'); }
  };
  M.onPermit = function (state, fast) { if (fast) state.flags.fastPermit = 1; };
  M.newEntrant = function (state) {
    var b = state.biz;
    if (R.chance(0.4)) return { name: R.pick(['Dupe Factory', 'CopyCat Co.', 'ถูกและดี Shop']), desc: 'ร้านก๊อปสูตร/ดีไซน์สินค้าขายดีของคุณ ขายถูกกว่าครึ่ง', quality: R.int(30, 45), price: R.range(0.45, 0.6), mkt: R.int(50, 75), cash: R.range(2e6, 8e6), burn: R.range(0.2e6, 0.6e6), stage: 'bootstrap', aggr: 0.9 };
    return { name: R.pick(['Pure', 'Nature', 'Siam', 'Velvet', 'Bloom', 'Mori']) + ' ' + R.pick(['Lab', 'Studio', 'Co.', 'Daily']), desc: 'แบรนด์ใหม่ที่ได้ทุนจาก VC อัดงบโฆษณาหนัก', quality: R.int(50, 70), price: R.range(0.8, 1.1), mkt: R.int(60, 85), cash: R.range(20e6, 60e6), burn: R.range(1.5e6, 3e6), stage: 'seed', aggr: R.range(0.5, 0.9) };
  };

  // ---------- Actions ----------
  M.act = {
    develop: function (s, type, pos) {
      var b = s.biz;
      if (b.dev.length >= 3) return { ok: false, msg: 'พัฒนาพร้อมกันได้สูงสุด 3 สินค้า' };
      var d = M.startDev(s, type, pos);
      return { ok: true, msg: 'เริ่มพัฒนา ' + d.n + ' (ค่าพัฒนาสูตร/ตัวอย่าง ' + F.b(d.fee) + ')' };
    },
    cancelDev: function (s, id) { s.biz.dev = s.biz.dev.filter(function (d) { return d.id !== id; }); return { ok: true }; },
    order: function (s, id, qty, sup) { return M.placePO(s, id, qty, sup); },
    setPrice: function (s, id, p) { var k = s.biz.skus.find(function (x) { return x.id === id; }); if (k) k.price = Math.max(10, Math.round(p)); if (s.fin.vat.registered) s.flags.vatRepriced = 1; return { ok: true }; },
    setAuto: function (s, id, on, cover, sup) { var k = s.biz.skus.find(function (x) { return x.id === id; }); if (!k) return { ok: false }; k.auto = !!on; if (cover) k.cover = cover; if (sup) k.autoSup = sup; return { ok: true }; },
    discontinue: function (s, id) {
      var b = s.biz, k = b.skus.find(function (x) { return x.id === id; });
      if (!k) return { ok: false };
      var units = M.stock(k);
      var cost = U.sum(k.lots, function (l) { return l.q * l.c; });
      var cash = units * k.price * 0.3;
      if (units > 0) { L.post(s.fin, { cash: cash, rev_goods: -cash }, 'op'); L.post(s.fin, { cogs_goods: cost, inventory: -cost }); }
      k.lots = []; k.active = false;
      return { ok: true, msg: 'เลิกขาย ' + k.n + (units ? ' — ล้างสต็อก ' + F.num(units) + ' ชิ้นให้พ่อค้าคนกลางที่ 30% ของราคา ได้ ' + F.b(cash) : '') };
    },
    clearance: function (s, id) {
      var k = s.biz.skus.find(function (x) { return x.id === id; });
      if (!k) return { ok: false };
      var units = Math.round(M.stock(k) * 0.5);
      if (!units) return { ok: false, msg: 'ไม่มีสต็อก' };
      var tk = M.takeUnits(k, units);
      var cash = tk.taken * k.price * 0.45;
      L.post(s.fin, { cash: cash, rev_goods: -cash }, 'op');
      L.post(s.fin, { cogs_goods: tk.cost, inventory: -tk.cost });
      s.biz.brand = Math.max(0, s.biz.brand - 2);
      return { ok: true, msg: 'เทขายลดราคา 55% ไป ' + F.num(tk.taken) + ' ชิ้น ได้เงินสด ' + F.b(cash) + ' (แบรนด์ดูถูกลงเล็กน้อย)' };
    },
    setAds: function (s, ch, v) { s.biz.ch[ch].ads = Math.max(0, Math.round(v / 1000) * 1000); return { ok: true }; },
    openChannel: function (s, ch) {
      var b = s.biz;
      if (b.ch[ch].open) return { ok: false, msg: 'เปิดแล้ว' };
      if (ch === 'web') {
        var hasEng = RW.Team.capOf(s, 'dev') > 0.3;
        var cost = hasEng ? 30000 : 120000;
        L.spend(s.fin, hasEng ? 'software' : 'prof', cost);
        b.ch.web.open = true;
        return { ok: true, msg: 'เปิดเว็บไซต์แบรนด์ (' + (hasEng ? 'ทีมทำเอง' : 'จ้างเอเจนซีทำ') + ' ' + F.b(cost) + ')' };
      }
      if (ch === 'social') { b.ch.social.open = true; return { ok: true, msg: 'เปิดร้านใน Social commerce — ไลฟ์ขายของต้องมี Live host หรือคุณต้องไลฟ์เอง' }; }
      if (ch === 'retail') {
        if (b.brand < 30 || b.rating < 4.3 || (s.kpi.revenueMonthly || 0) < 600000) return { ok: false, msg: 'เชนค้าปลีกยังไม่สนใจ — ต้องมีแบรนด์ ≥30, เรตติ้ง ≥4.3 และยอดขาย ≥฿600K/เดือน' };
        if (RW.Team.capOf(s, 'sales') < 0.3) return { ok: false, msg: 'ต้องมีคนดูแลการขายช่องทางค้าปลีก (Account Executive) หรือคุณต้องใช้เวลาขายเอง' };
        b.ch.retail.open = true;
        return { ok: true, msg: 'เปิดช่องทางค้าปลีก — เลือกสินค้าที่จะวางขาย (ค่าวางสินค้าต่อ SKU)' };
      }
      return { ok: false };
    },
    listRetail: function (s, id) {
      var b = s.biz, k = b.skus.find(function (x) { return x.id === id; });
      if (!k || !b.ch.retail.open) return { ok: false };
      var fee = 150000;
      if (s.fin.bal.cash < fee) return { ok: false, msg: 'เงินไม่พอค่าวางสินค้า ' + F.b(fee) };
      L.spend(s.fin, 'mkt', fee);
      k.retail = true;
      b.ch.retail.stores = Math.max(b.ch.retail.stores, 120);
      return { ok: true, msg: 'จ่ายค่าวางสินค้า ' + F.b(fee) + ' — ' + k.n + ' ขึ้นชั้นวาง ' + b.ch.retail.stores + ' สาขา' };
    },
    expandRetail: function (s) {
      var b = s.biz;
      if (!b.ch.retail.open) return { ok: false };
      var fee = 400000;
      if (s.fin.bal.cash < fee) return { ok: false, msg: 'เงินไม่พอ' };
      L.spend(s.fin, 'mkt', fee);
      b.ch.retail.stores = Math.min(4000, Math.round(b.ch.retail.stores * 1.8 + 150));
      return { ok: true, msg: 'ขยายไปเชนใหม่ รวม ' + b.ch.retail.stores + ' สาขา' };
    },
    kol: function (s, tier) {
      var t = { micro: [60000, 1.25, 3, 1], macro: [350000, 1.7, 4, 4], celeb: [1500000, 2.6, 6, 10] }[tier];
      if (s.fin.bal.cash < t[0]) return { ok: false, msg: 'เงินไม่พอ' };
      L.spend(s.fin, 'mkt', t[0]);
      s.biz.buzz.push({ m: t[1], weeks: t[2], total: t[2] });
      s.biz.brand = Math.min(100, s.biz.brand + t[3]);
      if (tier === 'celeb' && R.chance(0.12)) RW.Events.queue(s, 'ecom_kol_scandal', {}, s.time.w + R.int(2, 10));
      return { ok: true, msg: { micro: 'จ้างไมโครอินฟลูเอนเซอร์ 10 คนรีวิว', macro: 'จ้างอินฟลูเอนเซอร์ชื่อดังรีวิว', celeb: 'เซ็นสัญญาพรีเซนเตอร์ดารา' }[tier] + ' (' + F.b(t[0]) + ')' };
    },
    setCampaign: function (s, d) { s.biz.campaign.disc = U.clamp(d, 0, 0.5); return { ok: true }; },
    setAffiliate: function (s, v) { s.biz.ch.social.affiliate = U.clamp(v, 0, 0.3); return { ok: true }; },
    toggleCRM: function (s) { s.biz.crm = !s.biz.crm; return { ok: true, msg: s.biz.crm ? 'เปิดระบบ CRM/LINE OA — ลูกค้าเก่ากลับมาซื้อบ่อยขึ้น' : 'ปิด CRM' }; },
    toggleCOD: function (s) { s.biz.cod = !s.biz.cod; return { ok: true }; },
    setFulfil: function (s, m) { s.biz.fulfil.mode = m; return { ok: true, msg: m === '3pl' ? 'ใช้คลังสินค้าภายนอก (3PL) — ฿25/ออเดอร์ + ค่าเก็บรักษา รองรับไม่จำกัด' : 'แพ็กและส่งเอง' }; },
    setFreeShip: function (s, v) { s.biz.freeShip = Math.max(0, Math.round(v)); return { ok: true }; }
  };

  // ---------- E-commerce events ----------
  var E = RW.Events, H = E.H;
  E.register({
    id: 'ecom_defect', cat: 'product',
    valid: function (s, d) { return s.biz.skus.some(function (x) { return x.id === d.sku; }); },
    title: 'ล็อตสินค้ามีปัญหาคุณภาพ',
    body: function (s, d) { var k = s.biz.skus.find(function (x) { return x.id === d.sku; }); return 'ล็อตล่าสุดของ ' + k.n + ' มีปัญหา ' + R.pick(['บรรจุภัณฑ์รั่ว', 'กลิ่น/สีผิดจากมาตรฐาน', 'ฉลากพิมพ์ผิด', 'ไซส์ไม่ตรงสเปก']) + ' ประมาณ ' + F.num(d.qty) + ' ชิ้น โรงงานบอกว่า "อยู่ในเกณฑ์ยอมรับได้"'; },
    choices: function (s, d) {
      var k = s.biz.skus.find(function (x) { return x.id === d.sku; });
      return [
        { t: 'คัดทิ้งทั้งหมด เรียกร้องโรงงานชดเชย', d: 'ได้คืนบางส่วน', fx: function () { var tk = M.takeUnits(k, d.qty); var back = tk.cost * (R.chance(0.6) ? 0.6 : 0.2); L.post(s.fin, { cogs_waste: tk.cost - back, inventory: -tk.cost, cash: back }, 'op'); return 'ทิ้งสินค้า ' + F.num(tk.taken) + ' ชิ้น ได้ชดเชยคืน ' + F.b(back); } },
        { t: 'ขายไปตามปกติ', d: 'ประหยัด แต่ลูกค้าอาจเจอ', fx: function () { k.quality = Math.max(10, k.quality - 12); s.biz.rating -= 0.15; return 'ลูกค้าเริ่มรีวิวว่าสินค้าไม่เหมือนเดิม'; } }
      ];
    }
  });
  E.register({
    id: 'ecom_kol_scandal', cat: 'market', bad: true,
    title: 'พรีเซนเตอร์ของคุณมีข่าวฉาว',
    body: 'ดาราที่คุณจ้างเป็นพรีเซนเตอร์ตกเป็นข่าวอื้อฉาว ชาวเน็ตเรียกร้องให้แบนแบรนด์ที่เกี่ยวข้อง',
    choices: function (s) {
      return [
        { t: 'ยกเลิกสัญญาทันที แถลงจุดยืน', fx: function () { H.brand(s, -4); return 'กระแสลบไม่ลามมาถึงแบรนด์มากนัก'; } },
        { t: 'เงียบ รอข่าวซา', fx: function () { H.brand(s, -12); s.biz.buzz.push({ m: 0.65, weeks: 8, total: 8 }); return 'ยอดขายตกหนักหลายสัปดาห์'; } }
      ];
    }
  });
  E.register({
    id: 'ecom_fda', cat: 'admin', ind: ['ecom'], weight: function (s) { return s.biz.concept === 'supplement' ? 1.6 : s.biz.concept === 'skincare' ? 0.8 : 0.3; }, cooldown: 52, bad: true,
    cond: function (s) { return s.biz.skus.length > 0 && s.time.w > 20; },
    title: 'อย. ตรวจพบโฆษณาเกินจริง',
    body: 'ทีมการตลาด/ครีเอเตอร์ใช้คำโฆษณาอย่าง "ขาวไวใน 7 วัน" "รักษาได้" ซึ่งผิดกฎหมาย อย. ส่งหนังสือเรียกพบ',
    choices: function (s) {
      return [
        { t: 'ยอมรับ แก้ไขคอนเทนต์ทั้งหมด จ่ายค่าปรับ ฿50,000', fx: function () { L.spend(s.fin, 'penalties', 50000); s.biz.creative *= 0.6; return 'ต้องถอดโฆษณาทั้งหมดและทำใหม่'; } },
        { t: 'โต้แย้งว่าเป็นคำพูดของครีเอเตอร์ ไม่ใช่บริษัท', fx: function () { if (R.chance(0.4)) return 'อย. รับฟังคำชี้แจง ตักเตือนครั้งแรก'; L.spend(s.fin, 'penalties', 200000); H.brand(s, -6); return 'แพ้ — ปรับ ฿200,000 และถูกสื่อนำไปเสนอข่าว'; } }
      ];
    }
  });
  E.register({
    id: 'ecom_fake_reviews', cat: 'market', ind: ['ecom'], weight: 1.2, cooldown: 60,
    cond: function (s) { return s.biz.skus.length > 0; },
    title: 'ข้อเสนอปั๊มรีวิวและยอดขาย',
    body: 'เอเจนซีแห่งหนึ่งเสนอ "แพ็กเกจปั๊มร้าน": รีวิว 5 ดาว 2,000 รีวิว + ออเดอร์ปลอมดันอันดับ ราคา ฿80,000 "ทุกแบรนด์ก็ทำ"',
    choices: function (s) {
      return [
        { t: 'ซื้อแพ็กเกจ', d: 'อันดับพุ่ง แต่ถ้าแพลตฟอร์มจับได้...', fx: function () { L.spend(s.fin, 'mkt', 80000); s.biz.ch.market.rank += 4; s.biz.ch.market.reviews += 2000; s.flags.fakeReviews = 1; E.later(s, R.int(6, 30), 'ecom_fake_caught', {}); return 'ร้านขึ้นหน้าแรก ยอดขายพุ่ง'; } },
        { t: 'ปฏิเสธ', fx: function () { return 'คุณเลือกโตแบบออร์แกนิก'; } }
      ];
    }
  });
  E.effect('ecom_fake_caught', function (s) {
    if (!R.chance(0.45)) return;
    var ch = s.biz.ch.market;
    ch.rank = 1; ch.reviews *= 0.3; s.biz.rating = Math.max(1, s.biz.rating - 0.4);
    s.biz.buzz.push({ m: 0.6, weeks: 8, total: 8 });
    H.mail(s, 'แพลตฟอร์มจับได้ว่าปั๊มรีวิว', 'ร้านโดนลบรีวิว ลดอันดับ และห้ามเข้าร่วมแคมเปญ 2 เดือน', 'bad');
  });
  E.register({
    id: 'ecom_platform_fee', cat: 'market', ind: ['ecom'], weight: 0.6, once: true, bad: true,
    cond: function (s) { return s.time.w > 40; },
    title: 'มาร์เก็ตเพลสขึ้นค่าธรรมเนียม',
    body: 'แพลตฟอร์มประกาศขึ้นค่าคอมมิชชันร้าน Mall อีก 3% และเก็บค่าบริการส่งฟรีเพิ่ม มีผลเดือนหน้า ผู้ขายทั่วประเทศโวย',
    choices: function (s) {
      return [
        { t: 'ขึ้นราคาสินค้า 5% ชดเชย', fx: function () { s.biz.feeAdj = (s.biz.feeAdj || 0) + 0.03; s.biz.skus.forEach(function (k) { k.price = Math.round(k.price * 1.05 / 10) * 10; }); return 'ราคาขึ้น ลูกค้าบางส่วนบ่น'; } },
        { t: 'ยอมกินมาร์จิ้น และเร่งพาลูกค้าไปซื้อที่เว็บ', fx: function () { s.biz.feeAdj = (s.biz.feeAdj || 0) + 0.03; if (!s.biz.ch.web.open) return 'กำไรต่อออเดอร์ลดลง — คุณยังไม่มีเว็บไซต์ของตัวเอง'; s.biz.ch.web.seo += 10; return 'เริ่มแคมเปญย้ายลูกค้าไปซื้อตรง'; } }
      ];
    }
  });
  E.register({
    id: 'ecom_viral_clip', cat: 'market', ind: ['ecom'], weight: 1, cooldown: 40,
    cond: function (s) { return s.biz.skus.some(function (k) { return k.active; }); },
    title: 'คลิปรีวิวสินค้าของคุณเป็นไวรัล',
    body: 'ครีเอเตอร์คนหนึ่งรีวิวสินค้าคุณเองโดยไม่ได้รับเงิน ยอดวิว 3 ล้านในสองวัน คนแห่ถามหาในคอมเมนต์ — แต่สต็อกคุณพอไหม?',
    choices: function (s) {
      return [
        { t: 'อัดโฆษณาตามกระแส ฿100,000', fx: function () { L.spend(s.fin, 'mkt', 100000); s.biz.buzz.push({ m: 2.4, weeks: 3, total: 3 }); s.biz.brand += 5; return 'ยอดขายพุ่งกระฉูด — ตรวจสต็อกด่วน'; } },
        { t: 'ติดต่อครีเอเตอร์มาทำ affiliate', fx: function () { s.biz.ch.social.open = true; s.biz.buzz.push({ m: 1.9, weeks: 4, total: 4 }); s.biz.brand += 4; return 'ได้พาร์ทเนอร์ครีเอเตอร์ระยะยาว'; } }
      ];
    }
  });
  E.register({
    id: 'ecom_counterfeit', cat: 'market', ind: ['ecom'], weight: 0.8, cooldown: 80, bad: true,
    cond: function (s) { return s.biz.brand > 25; },
    title: 'พบสินค้าปลอมแบรนด์คุณในมาร์เก็ตเพลส',
    body: 'มีร้านค้าหลายสิบร้านขายสินค้าปลอมแบรนด์คุณในราคาครึ่งเดียว ลูกค้าที่ซื้อของปลอมมารีวิวด่าแบรนด์คุณ',
    choices: function (s) {
      return [
        { t: 'จ้างทนายแจ้งแพลตฟอร์มและดำเนินคดี (฿150,000)', fx: function () { L.spend(s.fin, 'prof', 150000); return 'ร้านปลอมถูกลบส่วนใหญ่'; } },
        { t: 'ทำ QR ตรวจสอบของแท้บนบรรจุภัณฑ์ (+฿3 ต่อชิ้น)', fx: function () { s.biz.skus.forEach(function (k) { k.cost += 3; }); H.brand(s, 2); return 'ลูกค้ามั่นใจขึ้น ต้นทุนเพิ่มเล็กน้อย'; } },
        { t: 'ปล่อยไป', fx: function () { s.biz.rating -= 0.15; H.brand(s, -5); return 'ภาพลักษณ์แบรนด์เสียหาย'; } }
      ];
    }
  });
  E.register({
    id: 'ecom_retail_offer', cat: 'sales', ind: ['ecom'], weight: 1, cooldown: 80,
    cond: function (s) { return !s.biz.ch.retail.open && s.biz.brand > 25 && (s.kpi.revenueMonthly || 0) > 400000; },
    title: 'เชนร้านขายยาอยากนำสินค้าคุณไปวางขาย',
    body: 'Buyer ของเชนร้านค้าปลีก 800 สาขาติดต่อมา อยากทดลองวางสินค้า 2 SKU ใน 150 สาขา เงื่อนไข: ค่าวางสินค้า ฿150,000/SKU, ราคาส่ง 62% ของราคาปลีก, เครดิต 75 วัน, รับคืนสินค้าที่ขายไม่ออก',
    choices: function (s) {
      return [
        { t: 'ตกลง', fx: function () { var b = s.biz; b.ch.retail.open = true; b.ch.retail.stores = 150; b.skus.filter(function (k) { return k.active; }).sort(function (x, y) { return y.appeal - x.appeal; }).slice(0, 2).forEach(function (k) { k.retail = true; L.spend(s.fin, 'mkt', 150000); }); return 'สินค้าขึ้นชั้นวาง 150 สาขา — เตรียมสต็อกเพิ่ม'; } },
        { t: 'ยังไม่พร้อม', fx: function () { return 'ขอบคุณ Buyer และขอคุยใหม่ปีหน้า'; } }
      ];
    }
  });
  E.register({
    id: 'ecom_supplier_hike', cat: 'product', ind: ['ecom'], weight: 0.8, cooldown: 60, bad: true,
    cond: function (s) { return s.biz.skus.length > 0; },
    title: 'โรงงานแจ้งขึ้นราคา',
    body: 'OEM แจ้งว่าวัตถุดิบและค่าแรงขึ้น ขอปรับราคาต่อหน่วย +12% ทุกสินค้า มีผลกับการสั่งผลิตครั้งถัดไป',
    choices: function (s) {
      return [
        { t: 'ยอมรับ', fx: function () { s.biz.skus.forEach(function (k) { k.cost = Math.round(k.cost * 1.12); }); return 'ต้นทุนเพิ่ม 12%'; } },
        { t: 'ต่อรอง + ขู่ย้ายโรงงาน', fx: function () { var buy = RW.Team.capOf(s, 'buying'); if (R.chance(0.35 + buy * 0.2)) { s.biz.skus.forEach(function (k) { k.cost = Math.round(k.cost * 1.04); }); return 'ต่อรองเหลือ +4%'; } s.biz.skus.forEach(function (k) { k.cost = Math.round(k.cost * 1.12); }); return 'โรงงานไม่ยอม และล็อตถัดไปอาจได้คิวช้า'; } }
      ];
    }
  });
})(globalThis.RW = globalThis.RW || {});
