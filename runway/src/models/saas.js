/* RUNWAY — B2B SaaS business model */
(function (RW) {
  'use strict';
  var R = RW.R, U = RW.U, F = RW.F, L = RW.Ledger;
  var M = (RW.Models.saas = { id: 'saas', b2c: false });
  M.n = 'B2B SaaS';
  M.d = 'ซอฟต์แวร์ขายแบบสมัครสมาชิกให้ธุรกิจไทย รายได้ประจำ (MRR) ทบต้น แต่ต้องสร้างสินค้าให้ตรงใจลูกค้า ขายองค์กรใหญ่ใช้เวลาหลายเดือน';

  var SEGS = (M.SEGS = ['micro', 'sme', 'mid', 'ent']);
  var SEG = (M.SEG = {
    micro: { n: 'ธุรกิจจิ๋ว (1-10 คน)', s: 'Micro', buy: 0.07, elast: 1.6, churn: 0.045, tickets: 0.12, host: 25, conv: 0.12, win: 0, qual: 0, cycle: [0, 0], expand: 0.002, refs: 0, motions: ['self'], intake: 0, load: 0, fee: true, invoiced: false },
    sme: { n: 'SME (11-50 คน)', s: 'SME', buy: 0.10, elast: 1.25, churn: 0.022, tickets: 0.25, host: 90, conv: 0.10, win: 0.34, qual: 0.55, cycle: [2, 5], expand: 0.007, refs: 0, motions: ['self', 'inside'], intake: 12, load: 0.04, fee: true, invoiced: false },
    mid: { n: 'องค์กรขนาดกลาง (51-500 คน)', s: 'Mid-market', buy: 0.12, elast: 0.9, churn: 0.011, tickets: 0.9, host: 700, conv: 0, win: 0.26, qual: 0.45, cycle: [6, 12], expand: 0.012, refs: 5, motions: ['inside', 'field'], intake: 5, load: 0.12, fee: false, invoiced: true },
    ent: { n: 'องค์กรขนาดใหญ่ (500+ คน)', s: 'Enterprise', buy: 0.10, elast: 0.6, churn: 0.0065, tickets: 4, host: 5000, conv: 0, win: 0.2, qual: 0.4, cycle: [16, 36], expand: 0.006, refs: 3, motions: ['field'], intake: 1.5, load: 0.45, fee: false, invoiced: true }
  });

  var FEAT = (M.FEAT = {
    core: { n: 'ระบบหลัก (Core)', costs: [10, 16, 26, 40, 60, 90], d: 'ความสามารถหลักของสินค้า ระดับ 1 = MVP พร้อมขาย', design: 0.3 },
    ux: { n: 'UX & Onboarding', costs: [6, 10, 16, 24], d: 'ใช้ง่าย สมัครแล้วใช้เป็นเอง ลด churn ลูกค้าเล็ก', design: 1 },
    mobile: { n: 'แอปมือถือ', costs: [14, 20, 30], d: 'ใช้งานผ่านมือถือ (iOS/Android)', design: 0.7 },
    integ: { n: 'การเชื่อมต่อ (ธนาคาร, e-Tax, LINE, ERP)', costs: [8, 12, 18, 26], d: 'เชื่อมกับระบบที่ลูกค้าใช้อยู่' },
    analytics: { n: 'รายงานและ Analytics', costs: [10, 16, 24], d: 'Dashboard ผู้บริหาร รายงานเชิงลึก', data: true },
    auto: { n: 'AI & Automation', costs: [16, 28, 45], d: 'ระบบอัตโนมัติและ AI ช่วยลดงานคน — จุดขายที่นักลงทุนชอบ', data: true },
    ent: { n: 'Enterprise (SSO, สิทธิ์, Audit log)', costs: [14, 22, 34], d: 'จำเป็นสำหรับองค์กรใหญ่' },
    security: { n: 'Security & Compliance (ISO 27001, PDPA)', costs: [10, 18, 28], d: 'ลดความเสี่ยงข้อมูลรั่ว องค์กรใหญ่บังคับ' },
    api: { n: 'Open API & Webhooks', costs: [10, 18], d: 'ให้ลูกค้าและพาร์ทเนอร์ต่อยอดได้' },
    scale: { n: 'Scalability & Infra', costs: [10, 18, 30, 45], d: 'รองรับลูกค้าจำนวนมาก ลดค่าเซิร์ฟเวอร์และระบบล่ม' },
    i18n: { n: 'หลายภาษา/หลายประเทศ', costs: [12, 20], d: 'จำเป็นสำหรับขยายไปต่างประเทศ' }
  });
  M.FKEYS = Object.keys(FEAT);

  // base needs: required level & weight per segment
  var NEED = {
    micro: { core: [1, 0.36], ux: [2, 0.3], mobile: [1, 0.14], integ: [1, 0.1], auto: [1, 0.1] },
    sme: { core: [2, 0.3], ux: [2, 0.14], mobile: [1, 0.1], integ: [2, 0.2], analytics: [1, 0.1], auto: [1, 0.1], security: [1, 0.06] },
    mid: { core: [3, 0.25], ux: [2, 0.05], mobile: [2, 0.08], integ: [3, 0.2], analytics: [2, 0.14], auto: [1, 0.07], ent: [1, 0.1], security: [1, 0.06], api: [1, 0.05] },
    ent: { core: [4, 0.2], integ: [3, 0.15], analytics: [2, 0.1], auto: [2, 0.05], ent: [2, 0.2], security: [2, 0.2], api: [1, 0.05], scale: [2, 0.05] }
  };

  var CONCEPTS = (M.CONCEPTS = {
    hr: {
      n: 'HR & Payroll Cloud', d: 'ระบบเงินเดือน ลงเวลา ลางาน ประกันสังคม ภาษี สำหรับธุรกิจไทย ตลาดใหญ่ คู่แข่งท้องถิ่นหลายราย',
      tam: { micro: 450000, sme: 95000, mid: 14000, ent: 2200 }, price: { micro: 690, sme: 3500, mid: 28000, ent: 2400000 },
      mod: { mobile: 0.05, integ: 0.03 },
      comps: [['PeopleDesk', 'HR Cloud เจ้าตลาด SME มา 8 ปี', 62, 1.0, 55, 'sme'], ['Sabai HR', 'ราคาถูก เจาะร้านค้าและธุรกิจเล็ก', 45, 0.7, 40, 'micro'], ['WorkPlus Enterprise', 'ซอฟต์แวร์ HR ติดตั้งในองค์กร (on-premise) รุ่นเก่า', 58, 1.35, 30, 'ent']]
    },
    acct: {
      n: 'Cloud Accounting & e-Tax', d: 'ระบบบัญชี ใบกำกับภาษีอิเล็กทรอนิกส์ เชื่อมสรรพากร ตลาดจิ๋วใหญ่มากแต่ราคาต่ำและคู่แข่งดุ',
      tam: { micro: 900000, sme: 120000, mid: 12000, ent: 1500 }, price: { micro: 450, sme: 2200, mid: 18000, ent: 1500000 },
      mod: { integ: 0.06, auto: 0.03 },
      comps: [['BookKeep.co', 'ผู้นำตลาดบัญชีออนไลน์ ฐานลูกค้าแสนราย', 68, 0.95, 65, 'micro'], ['EasyLedger', 'ขายผ่านสำนักงานบัญชีทั่วประเทศ', 55, 0.85, 45, 'sme'], ['TaxEase', 'ทีมเล็ก เน้น e-Tax invoice', 42, 0.8, 30, 'sme']]
    },
    pos: {
      n: 'POS & ระบบหลังร้าน', d: 'ระบบขายหน้าร้าน สต็อก สมาชิก สำหรับร้านค้าและร้านอาหาร ลูกค้าเยอะ churn สูง มือถือสำคัญมาก',
      tam: { micro: 700000, sme: 60000, mid: 5000, ent: 600 }, price: { micro: 590, sme: 2900, mid: 22000, ent: 1800000 },
      mod: { mobile: 0.12, ux: 0.04 },
      comps: [['CloudCashier', 'POS บนแท็บเล็ตยอดนิยม ระดมทุน Series A แล้ว', 64, 0.9, 60, 'micro'], ['ร้านดี POS', 'POS ราคาประหยัดของคนไทย', 48, 0.65, 45, 'micro'], ['RetailPro TH', 'ระบบค้าปลีกสำหรับเชนใหญ่', 60, 1.3, 30, 'mid']]
    },
    ai: {
      n: 'AI ผู้ช่วยตอบแชทลูกค้า', d: 'AI ตอบแชท LINE/Facebook และปิดการขายอัตโนมัติ ตลาดใหม่ร้อนแรง นักลงทุนชอบ แต่ยักษ์ใหญ่ระดับโลกจ้องอยู่',
      tam: { micro: 350000, sme: 70000, mid: 9000, ent: 1500 }, price: { micro: 990, sme: 4900, mid: 35000, ent: 3000000 },
      mod: { auto: 0.18, integ: 0.04 }, hype: 1.25,
      comps: [['BotBuddy', 'แชทบอทเจ้าแรกๆ ในไทย', 52, 0.9, 45, 'sme'], ['ChatSiam AI', 'ทีมวิจัย AI จากมหาวิทยาลัย ระดมทุน Seed แล้ว', 50, 1.0, 35, 'mid']]
    }
  });

  var CH = (M.CH = {
    direct: { n: 'ขายตรงโดยผู้ก่อตั้ง', kind: 'founder', q: 2.6, d: 'คุณโทรหา เข้าไปพบ เดโมเอง — คนรู้จักและเครือข่าย ได้ผลมากช่วงแรก (ขึ้นกับเวลาที่ใช้ "ขายและหาลูกค้า")' },
    organic: { n: 'ออร์แกนิก/ปากต่อปาก', kind: 'organic', q: 1.1, d: 'คนที่หาเจอเองหรือได้ยินต่อๆ กันมา โตตามแบรนด์และจำนวนลูกค้า' },
    search: { n: 'Search Ads (Google)', kind: 'paid', reach: { micro: 0.25, sme: 0.25, mid: 0.1, ent: 0.03 }, cpl: { micro: 350, sme: 750, mid: 2600, ent: 9500 }, q: 1.0, d: 'คนที่ค้นหาโซลูชันอยู่แล้ว คุณภาพสูง แพงขึ้นเมื่ออัดงบมาก' },
    social: { n: 'Social Ads (FB/IG/LinkedIn/TikTok)', kind: 'paid', reach: { micro: 0.22, sme: 0.15, mid: 0.06, ent: 0.01 }, cpl: { micro: 230, sme: 600, mid: 2800, ent: 16000 }, q: 0.72, d: 'ถูก เข้าถึงคนเยอะ แต่คนยังไม่ได้ตั้งใจซื้อ' },
    content: { n: 'Content & SEO', kind: 'stock', reach: { micro: 0.2, sme: 0.18, mid: 0.1, ent: 0.04 }, q: 1.05, d: 'ลงทุนสะสม ผลช้า 3-6 เดือน แต่ยิ่งนานยิ่งคุ้ม' },
    events: { n: 'สัมมนา/งานแสดงสินค้า', kind: 'paid', reach: { micro: 0.02, sme: 0.07, mid: 0.16, ent: 0.22 }, cpl: { micro: 2500, sme: 3000, mid: 6000, ent: 18000 }, q: 1.25, d: 'พบลูกค้าองค์กรตัวจริง ได้ลีดคุณภาพสูง' },
    partners: { n: 'พาร์ทเนอร์/ตัวแทนขาย', kind: 'partner', q: 1.4, d: 'สำนักงานบัญชีและ System Integrator แนะนำลูกค้า จ่ายคอมมิชชันต่อดีล' },
    referral: { n: 'Referral (ลูกค้าแนะนำ)', kind: 'referral', q: 2.0, d: 'ลูกค้าที่พอใจแนะนำต่อ ยิ่งสินค้าดียิ่งได้ผล' },
    outbound: { n: 'Outbound (ทีม SDR)', kind: 'team', q: 0.8, d: 'ทีม SDR โทร/อีเมลหาลูกค้าเป้าหมายโดยตรง' }
  });
  M.CHKEYS = Object.keys(CH);

  var MARKETS = (M.MARKETS = {
    vn: { n: 'เวียดนาม', mult: 1.3, cost: 4e6, monthly: 450000, i18n: 1 },
    ph: { n: 'ฟิลิปปินส์', mult: 1.0, cost: 4e6, monthly: 420000, i18n: 1 },
    my: { n: 'มาเลเซีย', mult: 0.7, cost: 3.5e6, monthly: 480000, i18n: 1 },
    id: { n: 'อินโดนีเซีย', mult: 2.4, cost: 7e6, monthly: 650000, i18n: 2 }
  });

  M.founderMap = {
    build: { dev: 1, product: 0.25 },
    sell: { sales: 1, leadgen: 0.4 },
    market: { mkt: 0.8, content: 0.6 },
    discover: { discovery: 1 },
    team: { hr: 0.6 },
    fundraise: {},
    admin: { finance: 0.5, ops: 0.4 },
    consult: {}
  };

  // ---------- Init ----------
  M.init = function (state, opt) {
    var cKey = opt.concept || 'hr';
    var c = CONCEPTS[cKey];
    var segs = {};
    SEGS.forEach(function (k) {
      // hidden true needs: base needs jittered, plus concept modifiers
      var need = {};
      var base = NEED[k];
      var tot = 0;
      M.FKEYS.forEach(function (f) {
        var b = base[f];
        var lvl = b ? b[0] : 0, w = b ? b[1] : 0.0;
        if (c.mod[f]) { w += c.mod[f]; if (!lvl) lvl = 1; }
        if (b && R.chance(0.35)) lvl = U.clamp(lvl + (R.chance(0.5) ? 1 : -1), 1, FEAT[f].costs.length);
        w *= R.range(0.6, 1.5);
        if (w > 0) { need[f] = { lvl: lvl, w: w }; tot += w; }
      });
      M.FKEYS.forEach(function (f) { if (need[f]) need[f].w /= tot; });
      segs[k] = {
        on: k === 'micro' || k === 'sme', price: c.price[k], motion: SEG[k].motions[0],
        cohorts: [], trials: [], queue: 0, opps: [], need: need, disc: 0,
        stat: { leads: 0, won: 0, churned: 0, churnMRR: 0, expMRR: 0, newMRR: 0 }, mstat: { leads: 0, won: 0, churned: 0, churnMRR: 0, expMRR: 0, newMRR: 0, startMRR: 0, startN: 0 }
      };
    });
    var ch = {};
    M.CHKEYS.forEach(function (k) { ch[k] = { budget: 0, stock: 0, leads: 0, cust: 0, spend: 0, m: { spend: 0, leads: 0, cust: 0 } }; });
    ch.partners.on = false; ch.partners.commission = 0.2; ch.partners.count = 0;
    ch.referral.incentive = 0;
    var feats = {};
    M.FKEYS.forEach(function (f) { feats[f] = 0; });
    var biz = {
      concept: cKey, product: c.n, feats: feats, roadmap: [{ f: 'core', prog: 0 }], alloc: { feat: 70, quality: 20, infra: 10 }, ship: 'balanced',
      bugs: 5, debt: 5, reliability: 40, uptime: 0.999, outages: [], security: 15, launched: false, launchW: null,
      segs: segs, ch: ch, brand: 8, buzz: [], annualDiscount: 0.15, maxDiscount: 0.1, discTarget: 'sme',
      impl: 0, accounts: [], support: { backlog: 0, tickets: 0, cap: 0, csat: 0.8 }, markets: {}, weekRev: 0,
      lifetime: { customers: 0, churned: 0 }, cacHist: [], hype: c.hype || 1, chanMonthHist: []
    };
    state.biz = biz;
    c.comps.forEach(function (x) {
      RW.World.addCompetitor(state, { name: x[0], desc: x[1], quality: x[2], price: x[3], mkt: x[4], focus: x[5], cash: R.range(8e6, 60e6), burn: R.range(0.6e6, 2.5e6), stage: R.pick(['seed', 'A', 'bootstrap']), aggr: R.range(0.3, 0.8) });
    });
    return biz;
  };

  M.welcome = function (state) {
    var b = state.biz, c = CONCEPTS[b.concept];
    return 'คุณลาออกจากงานประจำเพื่อสร้าง "' + c.n + '" — ' + c.d + '\n\nสิ่งที่ต้องทำช่วงแรก:\n1) จดทะเบียนบริษัท (หน้าบริษัท)\n2) สร้าง MVP (Core ระดับ 1) — ดูหน้าสินค้า\n3) ใช้เวลาคุยกับลูกค้า (Discovery) เพื่อรู้ว่าแต่ละกลุ่มต้องการอะไรจริงๆ\n4) หาลูกค้ารายแรก แล้วค่อยตัดสินใจว่าจะระดมทุนหรือโตด้วยตัวเอง\n\nเงินในบริษัทคือเวลาที่เหลืออยู่ — ดู Runway ที่มุมบนเสมอ';
  };

  // ---------- Helpers ----------
  M.customers = function (b, k) { return U.sum(b.segs[k].cohorts, function (c) { return c.n; }) + (k === 'ent' ? b.accounts.length : 0); };
  M.totalCustomers = function (b) { return U.sum(SEGS, function (k) { return M.customers(b, k); }); };
  M.segMRR = function (b, k) {
    var s = U.sum(b.segs[k].cohorts, function (c) { return c.n * c.arpa * c.exp; });
    if (k === 'ent') s += U.sum(b.accounts, function (a) { return a.acv / 12; });
    return s;
  };
  M.mrr = function (b) { return U.sum(SEGS, function (k) { return M.segMRR(b, k); }); };

  M.marketMult = function (state) {
    var b = state.biz, m = 1;
    for (var k in b.markets) m += MARKETS[k].mult * b.markets[k].ramp * 0.7;
    return m;
  };
  M.inMarket = function (state, k) {
    var c = CONCEPTS[state.biz.concept];
    var demand = state.world.macro.demand * state.diff.market;
    var reg = state.flags.regBoost && state.flags.regBoost.until > state.time.w ? state.flags.regBoost.m : 1;
    return c.tam[k] * SEG[k].buy / 52 * demand * M.marketMult(state) * reg;
  };

  // value delivered to a segment (0..~1.2): feature fit × quality
  M.fit = function (b, k, known) {
    var need = b.segs[k].need, f = 0;
    for (var key in need) {
      var n = need[key];
      var lvl = b.feats[key];
      f += n.w * Math.min(1.15, lvl / n.lvl);
    }
    return f;
  };
  M.quality = function (b) {
    var q = (1 - b.bugs / 160) * (b.uptime >= 0.999 ? 1 : b.uptime >= 0.995 ? 0.94 : 0.85);
    return U.clamp(q, 0.3, 1);
  };
  M.value = function (state, k) {
    var b = state.biz;
    if (!b.launched) return 0;
    var v = M.fit(b, k) * M.quality(b);
    v *= 1 + Math.min(0.08, b.segs[k].disc / 1000) + Math.min(0.1, RW.Team.capOf(state, 'product') * 0.04);
    // gates
    if (k === 'ent' && (b.feats.ent < 2 || b.feats.security < 2)) v *= 0.25;
    if (k === 'mid' && b.feats.core < 2) v *= 0.5;
    return v;
  };
  M.wtp = function (state, k) { return CONCEPTS[state.biz.concept].price[k] * (0.45 + 0.75 * M.value(state, k)); };
  M.priceFactor = function (state, k) {
    var p = state.biz.segs[k].price;
    return U.clamp(Math.pow(M.wtp(state, k) / Math.max(1, p), SEG[k].elast), 0.05, 1.8);
  };
  M.compAttract = function (state, k) {
    var cs = RW.World.aliveCompetitors(state);
    if (!cs.length) return 0.3;
    var tot = 0, wsum = 0;
    cs.forEach(function (c) {
      var w = c.focus === k ? 1.6 : 0.7;
      tot += w * (c.quality / 100) * 1.08 / Math.pow(c.price, 0.6) * (0.85 + c.mkt / 300);
      wsum += w;
    });
    return tot / wsum * Math.min(1.5, 0.8 + cs.length * 0.12);
  };
  M.compFactor = function (state, k) {
    var b = state.biz;
    var you = M.value(state, k) / Math.pow(b.segs[k].price / CONCEPTS[b.concept].price[k], 0.6) * (0.85 + b.brand / 300);
    var them = M.compAttract(state, k);
    return U.clamp(2 * you / (you + them), 0.35, 1.6);
  };
  M.buzzMult = function (b) {
    var m = 1;
    b.buzz.forEach(function (x) { m *= 1 + (x.m - 1) * (x.weeks / x.total); });
    return m;
  };
  M.fitTerm = function (v) { return 0.15 + 0.85 * Math.pow(Math.max(0, v), 1.6); };
  M.qAvg = function (by, state) {
    var t = 0, q = 0;
    var sk = state ? 0.45 + state.founder.skills.sales / 90 : 1;
    for (var ch in by) { t += by[ch]; q += by[ch] * (CH[ch].q || 1) * (ch === 'direct' ? sk : 1); }
    return t > 0 ? q / t : 1;
  };
  // innovators & early adopters buy immature products from founders they trust
  M.earlyAdopter = function (b, k) {
    var n = M.customers(b, k);
    return n >= 20 ? 1 : 1 + 1.5 * (1 - n / 20);
  };
  M.annualShare = function (b, k) {
    if (k === 'ent') return 1;
    return U.clamp(0.06 + b.annualDiscount * 2.2, 0.03, 0.65) * (k === 'micro' ? 0.6 : 1);
  };

  // ---------- Weekly ----------
  M.weekly = function (state, info) {
    var b = state.biz, w = state.time.w;
    b.buzz.forEach(function (x) { x.weeks--; });
    b.buzz = b.buzz.filter(function (x) { return x.weeks > 0; });
    SEGS.forEach(function (k) { b.segs[k].stat = { leads: 0, won: 0, churned: 0, churnMRR: 0, expMRR: 0, newMRR: 0 }; });
    M.engineering(state);
    M.discovery(state);
    if (b.launched) {
      var leads = M.marketing(state);
      M.sales(state, leads);
      M.churn(state);
    } else {
      // still spend marketing budget pre-launch (waitlist building)
      M.marketing(state, true);
    }
    M.revenue(state);
    M.supportOps(state);
    M.outages(state);
    // markets ramp
    for (var mk in b.markets) b.markets[mk].ramp = Math.min(1, b.markets[mk].ramp + 1 / 52);
    b.brand = U.clamp(b.brand * 0.997 + Math.log10(1 + M.totalCustomers(b)) * 0.02, 0, 100);
  };

  M.devPoints = function (state) {
    var b = state.biz;
    var dev = RW.Team.capOf(state, 'dev');
    var leadBoost = 1 + Math.min(0.15, RW.Team.capOf(state, 'lead_eng') * 0.12);
    var pm = 1 + Math.min(0.12, RW.Team.capOf(state, 'product') * 0.06);
    var debt = 1 - b.debt / 180;
    var mode = b.ship === 'fast' ? 1.2 : b.ship === 'careful' ? 0.82 : 1;
    return dev * leadBoost * pm * debt * mode * RW.Engine.tm(state, 'dev');
  };

  M.engineering = function (state) {
    var b = state.biz;
    var pts = M.devPoints(state);
    var a = b.alloc, tot = a.feat + a.quality + a.infra || 1;
    var featPts = pts * a.feat / tot, qPts = pts * a.quality / tot, iPts = pts * a.infra / tot;
    // implementation work for new enterprise/mid customers comes first
    if (b.impl > 0) {
      var use = Math.min(b.impl, featPts * 0.7 + qPts * 0.2);
      b.impl -= use;
      featPts -= Math.min(featPts, use * 0.78);
      qPts -= Math.max(0, use - use * 0.78);
      if (qPts < 0) qPts = 0;
    }
    // roadmap
    var devHC = RW.Team.active(state).filter(function (e) { return e.role === 'eng'; }).length + (state.founder.focus.build > 10 ? 1 : 0);
    var parallel = Math.max(1, Math.floor(devHC / 3) + 1);
    var design = RW.Team.capOf(state, 'design'), data = RW.Team.capOf(state, 'data');
    var bugRate = (b.ship === 'fast' ? 0.55 : b.ship === 'careful' ? 0.16 : 0.32) * (1 + b.debt / 90);
    var debtRate = b.ship === 'fast' ? 0.45 : b.ship === 'careful' ? 0.1 : 0.24;
    var perfectionists = RW.Team.active(state).filter(function (e) { return e.role === 'eng' && e.traits.indexOf('perfectionist') >= 0; }).length;
    if (perfectionists) bugRate *= 0.8;
    // nothing else can ship before there is a working core product
    var items = (b.launched ? b.roadmap : b.roadmap.filter(function (it) { return it.f === 'core'; })).slice(0, parallel);
    var leftover = featPts;
    items.forEach(function (it, idx) {
      if (leftover <= 0) return;
      var fd = FEAT[it.f];
      var lvl = b.feats[it.f];
      if (lvl >= fd.costs.length) return;
      var cost = fd.costs[lvl];
      var maxPerWeek = cost / (2 + lvl);
      var share = idx === items.length - 1 ? leftover : Math.min(leftover, featPts / items.length * 1.3);
      var p = Math.min(share, maxPerWeek);
      var mult = 1;
      if (fd.design) mult *= 1 - fd.design * 0.5 + fd.design * 0.5 * Math.min(1.4, design / Math.max(0.5, RW.Team.capOf(state, 'dev')) * 4);
      if (fd.data) mult *= 0.75 + Math.min(0.5, data * 0.4);
      it.prog += p * mult;
      leftover -= p;
      if (it.prog >= cost) {
        b.feats[it.f]++;
        b.bugs = Math.min(100, b.bugs + cost * bugRate * 0.55);
        b.debt = Math.min(100, b.debt + cost * debtRate * 0.45);
        it.done = true;
        M.onShip(state, it.f, b.feats[it.f]);
      }
    });
    b.roadmap = b.roadmap.filter(function (it) { return !it.done; });
    // leftover feature points help quality
    qPts += Math.max(0, leftover) * 0.5;
    // quality work: bugs first if severe
    var bugShare = b.bugs > b.debt ? 0.6 : 0.4;
    b.bugs = Math.max(0, b.bugs - qPts * bugShare * 3.2);
    b.debt = Math.max(0, b.debt - qPts * (1 - bugShare) * 1.6);
    // reliability
    var devops = iPts * 2.5 + RW.Team.capOf(state, 'ops') * 0.3;
    var load = Math.log10(1 + M.totalCustomers(b) / 200);
    b.reliability = U.clamp(b.reliability + devops - load * 0.4 - 0.3, 0, 100);
    // natural bug inflow grows with usage
    b.bugs = Math.min(100, b.bugs + Math.sqrt(M.totalCustomers(b)) / 45 + 0.1);
    b.security = U.clamp(b.security + iPts * 0.3 - 0.05 + (b.feats.security * 0.02), 0, 100);
  };

  M.onShip = function (state, f, lvl) {
    var b = state.biz;
    if (f === 'core' && lvl === 1 && !b.launched) {
      b.launched = true; b.launchW = state.time.w;
      b.brand += 4;
      RW.Engine.mail(state, 'product', 'MVP พร้อมขายแล้ว! 🚀'.replace(' 🚀', ''), b.product + ' เวอร์ชันแรกเปิดให้ใช้งาน — ตอนนี้เริ่มหาลูกค้าได้ ช่องทางการตลาดและทีมขายจะเริ่มสร้างลูกค้าจริง ระวัง: MVP ยังมีบั๊กและฟีเจอร์น้อย', 'good');
      return;
    }
    if (f === 'security' && lvl >= 2) L.spend(state.fin, 'prof', 450000);
    RW.Engine.mail(state, 'product', 'ปล่อยฟีเจอร์: ' + FEAT[f].n + ' ระดับ ' + lvl, FEAT[f].d + (f === 'security' && lvl >= 2 ? ' · ค่าตรวจรับรอง ISO 27001 ฿450,000' : ''), 'good');
    b.buzz.push({ m: 1.04 + lvl * 0.01, weeks: 3, total: 3 });
  };

  M.discovery = function (state) {
    var b = state.biz;
    var units = RW.Team.capOf(state, 'discovery') * 1.0 + RW.Team.capOf(state, 'product') * 0.35 + RW.Team.capOf(state, 'cs') * 0.15;
    var t = b.discTarget;
    SEGS.forEach(function (k) {
      var s = b.segs[k];
      var learn = (k === t ? units * 5.5 : units * 0.6) + Math.sqrt(M.customers(b, k)) * 0.15;
      s.disc = U.clamp(s.disc + learn * (1 - s.disc / 105), 0, 100);
    });
  };

  // returns leads per segment {k: {total, byCh: {ch: n}}}
  M.marketing = function (state, prelaunch) {
    var b = state.biz, w = state.time.w, fin = state.fin;
    var out = {};
    SEGS.forEach(function (k) { out[k] = { total: 0, by: {} }; });
    var mkt = RW.Team.capOf(state, 'mkt');
    var eff = 1 / (1 + Math.min(1.2, mkt * 0.35)) * (mkt < 0.3 ? 1.3 : 1) / RW.Engine.tm(state, 'mkt'); // skilled marketers lower CPL
    var compInfl = 1 + U.sum(RW.World.aliveCompetitors(state), function (c) { return c.mkt / 100 * 0.12; });
    var brandF = (0.7 + b.brand / 100 * 0.8) * M.buzzMult(b) * b.hype;
    var on = SEGS.filter(function (k) { return b.segs[k].on; });
    if (!on.length) on = ['micro'];
    function weights(reach) {
      var t = U.sum(on, function (k) { return reach[k] || 0; });
      var o = {};
      on.forEach(function (k) { o[k] = t > 0 ? (reach[k] || 0) / t : 0; });
      return o;
    }
    M.CHKEYS.forEach(function (key) {
      var c = CH[key], st = b.ch[key];
      st.leads = 0;
      if (c.kind === 'paid') {
        var spend = st.budget;
        if (spend <= 0) return;
        L.spend(fin, 'mkt', spend);
        st.m.spend += spend;
        if (prelaunch) { b.brand = Math.min(100, b.brand + spend / 400000); return; }
        var wts = weights(c.reach);
        on.forEach(function (k) {
          var cap = M.inMarket(state, k) * c.reach[k] * brandF;
          var cpl = c.cpl[k] * eff * compInfl;
          var s = spend * wts[k];
          if (cap <= 0 || s <= 0) return;
          var n = cap * (1 - Math.exp(-s / (cap * cpl)));
          out[k].by[key] = (out[k].by[key] || 0) + n;
          st.leads += n;
        });
        b.brand = Math.min(100, b.brand + spend / 2500000);
      } else if (c.kind === 'stock') {
        var sp = st.budget;
        if (sp > 0) { L.spend(fin, 'mkt', sp); st.m.spend += sp; }
        var prod = 0.5 + Math.min(1.5, RW.Team.capOf(state, 'content') * 0.45);
        st.stock = st.stock * 0.992 + sp / 1000 * prod;
        if (prelaunch) return;
        var wc = weights(c.reach);
        on.forEach(function (k) {
          var cap = M.inMarket(state, k) * c.reach[k] * brandF;
          var n = cap * (1 - Math.exp(-st.stock / 900));
          out[k].by[key] = (out[k].by[key] || 0) + n * wc[k];
          st.leads += n * wc[k];
        });
        b.brand = Math.min(100, b.brand + st.stock / 200000);
      } else if (c.kind === 'founder') {
        if (prelaunch) return;
        // meeting volume depends on time spent; sales skill shows up in the close rate (see qAvg)
        var fo = state.founder;
        var fu = (fo.focus.sell || 0) / 100 * Math.pow(fo.hours / 45, 0.85) * RW.Founder.effectiveness(state);
        if (fu <= 0) return;
        // a full-time founder-seller books ~12 qualified meetings a week
        var net = RW.BACKGROUNDS[state.founder.bg].net.customers;
        var per = { micro: 1.5, sme: 1.0, mid: 0.6, ent: 0.25 };
        var wsum = U.sum(on, function (k) { return per[k]; });
        on.forEach(function (k) {
          var n = fu * 12 * net * per[k] / wsum;
          n = Math.min(n, M.inMarket(state, k) * 3);
          out[k].by[key] = (out[k].by[key] || 0) + n;
          st.leads += n;
        });
      } else if (c.kind === 'organic') {
        if (prelaunch) return;
        on.forEach(function (k) {
          var n = M.inMarket(state, k) * 0.004 * brandF * (1 + Math.log10(1 + M.customers(b, k)) * 0.5);
          out[k].by[key] = (out[k].by[key] || 0) + n;
          st.leads += n;
        });
      } else if (c.kind === 'partner') {
        if (!st.on || prelaunch) return;
        var grow = (0.12 + RW.Team.capOf(state, 'ops') * 0.08 + RW.Team.capOf(state, 'sales') * 0.05) * (st.commission / 0.2);
        st.count = Math.min(250, st.count * 0.995 + grow * R.range(0.5, 1.5));
        ['micro', 'sme', 'mid'].forEach(function (k) {
          if (!b.segs[k].on) return;
          var r = { micro: 0.07, sme: 0.05, mid: 0.008 }[k];
          var n = st.count * r * M.value(state, k);
          out[k].by[key] = (out[k].by[key] || 0) + n;
          st.leads += n;
        });
      } else if (c.kind === 'referral') {
        if (prelaunch) return;
        var inc = st.incentive;
        on.forEach(function (k) {
          var v = M.value(state, k);
          var nps = U.clamp((v - 0.55) * 2.2, 0, 1.4);
          var n = M.customers(b, k) * 0.0022 * nps * (1 + Math.min(1, inc / 3000)) * (k === 'ent' ? 0.5 : 1);
          out[k].by[key] = (out[k].by[key] || 0) + n;
          st.leads += n;
        });
      } else if (c.kind === 'team') {
        if (prelaunch) return;
        var sdr = RW.Team.capOf(state, 'leadgen');
        if (sdr <= 0) return;
        var tgt = on.filter(function (k) { return b.segs[k].motion !== 'self'; });
        if (!tgt.length) return;
        tgt.forEach(function (k) {
          var per = { sme: 14, mid: 6, ent: 1.6 }[k] || 0;
          var c2 = CONCEPTS[b.concept];
          var n = Math.min(sdr / tgt.length * per * (1 + Math.min(0.3, RW.Team.capOf(state, 'lead_sdr') * 0.3)), c2.tam[k] * M.marketMult(state) * 0.003);
          out[k].by[key] = (out[k].by[key] || 0) + n;
          st.leads += n;
        });
      }
    });
    if (prelaunch) return out;
    // total capture cannot exceed 80% of in-market buyers (outbound excluded)
    SEGS.forEach(function (k) {
      var o = out[k];
      var inbound = 0;
      for (var ch in o.by) if (ch !== 'outbound' && ch !== 'direct') inbound += o.by[ch];
      var cap = M.inMarket(state, k) * 0.8;
      if (inbound > cap && inbound > 0) {
        var f = cap / inbound;
        for (var ch2 in o.by) if (ch2 !== 'outbound' && ch2 !== 'direct') o.by[ch2] *= f;
      }
      o.total = U.sum(Object.keys(o.by), function (ch) { return o.by[ch]; });
      b.segs[k].stat.leads = o.total;
      b.segs[k].mstat.leads += o.total;
      for (var ch3 in o.by) b.ch[ch3].m.leads += o.by[ch3];
    });
    return out;
  };

  M.sales = function (state, leads) {
    var b = state.biz, w = state.time.w;
    var salesCap = RW.Team.capOf(state, 'sales') * (1 + Math.min(0.2, RW.Team.capOf(state, 'lead_ae') * 0.2));
    var salesSkill = U.clamp(0.75 + (state.founder.focus.sell > 20 ? (state.founder.skills.sales - 50) / 200 : 0) + RW.Team.capOf(state, 'lead_ae') * 0.1, 0.6, 1.25);
    var sellers = SEGS.filter(function (k) { return b.segs[k].on && b.segs[k].motion !== 'self'; });
    // opportunity load
    var load = 0;
    SEGS.forEach(function (k) { b.segs[k].opps.forEach(function (o) { load += o.n * SEG[k].load; }); });
    var overload = load > 0 ? U.clamp(salesCap * 1.0 / load, 0.35, 1) : 1;
    var intakeTotalW = U.sum(sellers, function (k) { return SEG[k].intake ? 1 / SEG[k].intake : 0; });
    SEGS.forEach(function (k) {
      var s = b.segs[k], g = SEG[k], l = leads[k];
      if (!s.on && l.total < 0.01) return;
      var v = M.value(state, k), pf = M.priceFactor(state, k), cf = M.compFactor(state, k);
      var mixQ = l.total > 0 ? U.sum(Object.keys(l.by), function (ch) { return l.by[ch]; }) / l.total : 1;
      if (s.motion === 'self' || !g.intake) {
        // self-serve trial funnel (2 weeks)
        if (l.total > 0) s.trials.push({ w: w, n: l.total, by: l.by });
        var due = s.trials.filter(function (t) { return t.w <= w - 2; });
        s.trials = s.trials.filter(function (t) { return t.w > w - 2; });
        due.forEach(function (t) {
          var ux = 1 + b.feats.ux * 0.08;
          var p = g.conv * M.fitTerm(v) * Math.pow(pf, 0.8) * Math.pow(cf, 0.7) * ux * M.qAvg(t.by, state) * M.earlyAdopter(b, k);
          p = U.clamp(p, 0, 0.65);
          var won = R.binom(Math.round(t.n), p) + (R.f() < (t.n % 1) * p ? 1 : 0);
          if (won > 0) M.addCustomers(state, k, won, t.by, t.n);
        });
      } else {
        s.queue = s.queue * 0.75 + l.total;
        var share = sellers.length ? (1 / g.intake) / intakeTotalW : 0;
        var intake = salesCap * share * g.intake * 1.0;
        var worked = Math.min(s.queue, intake);
        s.queue -= worked;
        if (worked > 0.01) {
          var cyc = R.int(g.cycle[0], g.cycle[1]) * (k === 'ent' && b.feats.security >= 3 ? 0.8 : 1);
          s.opps.push({ w: w, close: w + Math.round(cyc), n: worked * g.qual, by: l.by, src: l.total });
        }
        var keep = [];
        s.opps.forEach(function (o) {
          if (o.close > w) { keep.push(o); return; }
          var refs = g.refs ? 0.65 + 0.35 * Math.min(1, M.customers(b, k) / g.refs) : 1;
          var disc = 1 + b.maxDiscount * 1.6;
          var motionF = s.motion === 'field' ? 1.15 : 1;
          var p = g.win * M.fitTerm(v) * Math.pow(pf, 0.7) * Math.pow(cf, 0.7) * salesSkill * refs * disc * overload * motionF * Math.min(1.6, M.qAvg(o.by, state)) * M.earlyAdopter(b, k);
          p = U.clamp(p, 0, 0.75);
          var n = R.binom(Math.round(o.n), p) + (R.f() < (o.n % 1) * p ? 1 : 0);
          if (n > 0) M.addCustomers(state, k, n, o.by, o.src);
        });
        s.opps = keep;
      }
    });
  };

  M.addCustomers = function (state, k, n, by, srcTotal) {
    var b = state.biz, s = b.segs[k], w = state.time.w;
    var info = RW.T.info(w);
    var g = SEG[k];
    var priceEff = s.price * (1 - (g.intake ? b.maxDiscount * 0.6 : 0));
    // attribute to channels
    var tot = 0; for (var ch in by) tot += by[ch];
    for (var ch2 in by) b.ch[ch2].m.cust += n * by[ch2] / Math.max(1e-9, tot);
    // channel-specific costs at acquisition
    if (by.partners && b.ch.partners.on) {
      var pn = n * by.partners / Math.max(1e-9, tot);
      L.spend(state.fin, 'commission', pn * priceEff * 12 * b.ch.partners.commission);
    }
    if (by.referral && b.ch.referral.incentive) L.spend(state.fin, 'commission', n * by.referral / Math.max(1e-9, tot) * b.ch.referral.incentive);
    // sales commission (10% of first-year contract value for sales-led)
    if (g.intake && s.motion !== 'self') L.spend(state.fin, 'commission', n * priceEff * 12 * (k === 'ent' ? 0.06 : 0.1) * (k === 'ent' ? 1 / 12 : 1));
    s.stat.won += n; s.mstat.won += n;
    b.lifetime.customers += n;
    if (k === 'ent') {
      for (var i = 0; i < n; i++) {
        var acv = Math.round(s.price * R.range(0.55, 1.9) * (1 - b.maxDiscount) / 10000) * 10000;
        var acc = { id: R.id('ac'), name: RW.Names.company(), acv: acv, w: w, renew: w + 52, health: 70, impl: R.range(6, 14) };
        b.accounts.push(acc);
        b.impl += acc.impl;
        L.billAdvance(state.fin, acv, true, state, w + 9, { wht: true, name: acc.name, seg: 'ent' });
        L.invoice(state, 'rev_svc', Math.round(acv * 0.2), w + 9, { wht: true, name: acc.name + ' (implementation)', seg: 'ent' });
        s.stat.newMRR += acv / 12;
        RW.Engine.mail(state, 'sales', 'ปิดดีลองค์กร: ' + acc.name, 'สัญญา 1 ปี มูลค่า ' + F.b(acv) + ' + ค่าติดตั้ง ' + F.b(acv * 0.2) + ' · เครดิตเทอม 60 วัน หัก ณ ที่จ่าย 3% · งาน implementation ~' + Math.round(acc.impl) + ' dev-weeks', 'good');
      }
      return;
    }
    var annual = R.binom(n, M.annualShare(b, k));
    var monthly = n - annual;
    var arpaM = priceEff * (k === 'mid' ? R.range(0.8, 1.4) : 1);
    if (k === 'mid') b.impl += n * R.range(0.8, 2);
    if (monthly > 0) M.cohortAdd(s, info.monthsElapsed, monthly, arpaM, false, null);
    if (annual > 0) {
      var arpaA = arpaM * (1 - b.annualDiscount);
      M.cohortAdd(s, info.monthsElapsed, annual, arpaA, true, w + 52);
      var amt = annual * arpaA * 12;
      if (g.invoiced) L.billAdvance(state.fin, amt, true, state, w + 4, { wht: true, seg: k });
      else { L.billAdvance(state.fin, amt, false); L.post(state.fin, { cogs_fees: amt * 0.028, cash: -amt * 0.028 }, 'op'); }
    }
    s.stat.newMRR += monthly * arpaM + annual * arpaM * (1 - b.annualDiscount);
    s.mstat.newMRR += monthly * arpaM + annual * arpaM * (1 - b.annualDiscount);
  };

  M.cohortAdd = function (s, m, n, arpa, annual, renewW) {
    var c = s.cohorts.find(function (x) { return x.m === m && x.annual === annual && Math.abs(x.arpa - arpa) < arpa * 0.05 && (!annual || Math.abs(x.renew - renewW) <= 2); });
    if (c) { c.arpa = (c.arpa * c.n + arpa * n) / (c.n + n); c.n += n; c.start += n; return; }
    s.cohorts.push({ m: m, n: n, start: n, arpa: arpa, exp: 1, annual: annual, renew: renewW, age: 0 });
  };

  M.churnMonthly = function (state, k) {
    var b = state.biz, g = SEG[k];
    var v = Math.max(0.15, M.value(state, k));
    var mult = U.clamp(Math.pow(1.05 / v, 1.25), 0.45, 4.5);
    var sup = b.support;
    var supF = 1 + U.clamp(sup.overload || 0, 0, 1) * 0.7;
    var up = b.uptime >= 0.999 ? 1 : b.uptime >= 0.995 ? 1.2 : 1.55;
    var priceF = U.clamp(Math.pow(b.segs[k].price / M.wtp(state, k), 0.5), 0.75, 1.8);
    var comp = U.clamp(Math.pow(M.compAttract(state, k) / Math.max(0.15, v), 0.4), 0.8, 1.5);
    var csCov = M.csCoverage(state);
    var cs = (k === 'mid' || k === 'ent') ? 1 - 0.35 * csCov : 1 - 0.1 * csCov;
    var impl = b.impl > 20 && (k === 'mid' || k === 'ent') ? 1.25 : 1;
    return g.churn * mult * supF * up * priceF * comp * cs * impl * state.world.macro.churn * state.diff.churn * (state.flags.pdpaHidden ? 1.05 : 1);
  };
  M.csCoverage = function (state) {
    var b = state.biz;
    var need = M.customers(b, 'mid') / 40 + b.accounts.length / 10;
    if (need <= 0) return 1;
    return U.clamp(RW.Team.capOf(state, 'cs') / need, 0, 1);
  };

  M.churn = function (state) {
    var b = state.biz, w = state.time.w;
    SEGS.forEach(function (k) {
      var s = b.segs[k];
      var cm = M.churnMonthly(state, k);
      s.churnRate = cm;
      s.cohorts.forEach(function (c) {
        if (c.n <= 0) return;
        if (!c.annual) {
          var early = c.age < 3 ? 1.5 : c.age < 6 ? 1.15 : 1;
          var hz = U.weeklyFromMonthly(cm * early);
          var lost = R.binom(c.n, hz);
          if (lost > 0) { c.n -= lost; s.stat.churned += lost; s.mstat.churned += lost; s.stat.churnMRR += lost * c.arpa * c.exp; s.mstat.churnMRR += lost * c.arpa * c.exp; b.lifetime.churned += lost; }
        } else if (c.renew <= w) {
          var renewP = Math.pow(1 - cm, 12) * 1.12;
          var keep = R.binom(c.n, U.clamp(renewP, 0.2, 0.98));
          var lost2 = c.n - keep;
          s.stat.churned += lost2; s.mstat.churned += lost2; s.stat.churnMRR += lost2 * c.arpa * c.exp; s.mstat.churnMRR += lost2 * c.arpa * c.exp; b.lifetime.churned += lost2;
          c.n = keep;
          if (keep > 0) {
            // renewal invoice at current value (+ price uplift if list went up)
            c.exp *= 1 + SEG[k].expand * 6 * Math.min(1.3, M.value(state, k));
            var amt = keep * c.arpa * c.exp * 12;
            if (SEG[k].invoiced) L.billAdvance(state.fin, amt, true, state, w + 4, { wht: true, seg: k });
            else { L.billAdvance(state.fin, amt, false); L.post(state.fin, { cogs_fees: amt * 0.028, cash: -amt * 0.028 }, 'op'); }
            c.renew = w + 52;
          }
        }
      });
      s.cohorts = s.cohorts.filter(function (c) { return c.n > 0; });
    });
    // enterprise accounts: health & renewals
    var keepAcc = [];
    var cm = M.churnMonthly(state, 'ent');
    b.accounts.forEach(function (a) {
      var target = 85 - cm * 1500 - (b.impl > 15 && w - a.w < 26 ? 15 : 0);
      a.health = U.clamp(U.approach(a.health, target, 0.08) + R.normal(0, 1.2), 0, 100);
      if (a.renew <= w) {
        var p = U.clamp(0.35 + a.health / 120, 0.2, 0.97);
        if (R.chance(p)) {
          var up = 1 + R.range(0, 0.12) * (a.health / 80);
          a.acv = Math.round(a.acv * up / 1000) * 1000;
          a.renew = w + 52;
          L.billAdvance(state.fin, a.acv, true, state, w + 9, { wht: true, name: a.name, seg: 'ent' });
          RW.Engine.mail(state, 'sales', a.name + ' ต่อสัญญาอีก 1 ปี', 'มูลค่าใหม่ ' + F.b(a.acv) + '/ปี', 'good');
          keepAcc.push(a);
        } else {
          b.segs.ent.stat.churned++; b.segs.ent.mstat.churned++; b.segs.ent.mstat.churnMRR += a.acv / 12; b.lifetime.churned++;
          RW.Engine.mail(state, 'sales', 'สูญเสียลูกค้าองค์กร: ' + a.name, 'ไม่ต่อสัญญา ' + F.b(a.acv) + '/ปี — ' + R.pick(['ย้ายไปใช้คู่แข่งที่ถูกกว่า', 'ผู้บริหารคนใหม่อยากใช้ระบบต่างชาติ', 'ไม่พอใจที่ implementation ล่าช้า', 'ตัดงบ IT']), 'bad');
        }
      } else keepAcc.push(a);
    });
    b.accounts = keepAcc;
  };

  M.revenue = function (state) {
    var b = state.biz, fin = state.fin, w = state.time.w;
    var weekRev = 0;
    SEGS.forEach(function (k) {
      var s = b.segs[k], g = SEG[k];
      var monthlyRev = 0, annualRev = 0;
      s.cohorts.forEach(function (c) {
        var r = c.n * c.arpa * c.exp * 12 / 52;
        if (c.annual) annualRev += r; else monthlyRev += r;
      });
      if (monthlyRev > 0) {
        if (g.invoiced) L.invoice(state, 'rev_sub', monthlyRev, w + 4, { wht: true, seg: k });
        else {
          L.earnCash(fin, 'rev_sub', monthlyRev);
          L.post(fin, { cogs_fees: monthlyRev * 0.028, cash: -monthlyRev * 0.028 }, 'op');
        }
      }
      // annual: recognize from deferred (guard against rounding drift)
      var rec = Math.min(annualRev, Math.max(0, -fin.bal.deferred));
      if (rec > 0) L.recognizeDeferred(fin, 'rev_sub', rec);
      weekRev += monthlyRev + annualRev;
    });
    var entRev = U.sum(b.accounts, function (a) { return a.acv / 52; });
    var rec2 = Math.min(entRev, Math.max(0, -fin.bal.deferred));
    if (rec2 > 0) L.recognizeDeferred(fin, 'rev_sub', rec2);
    b.weekRev = weekRev + entRev;
  };

  M.supportOps = function (state) {
    var b = state.biz, sup = b.support;
    var t = 0;
    SEGS.forEach(function (k) { t += M.customers(b, k) * SEG[k].tickets; });
    t += (b.ltd || 0) * 0.08; // lifetime-deal users
    t *= (1 + b.bugs / 60) * (1 - Math.min(0.3, b.feats.ux * 0.06));
    var cap = RW.Team.capOf(state, 'support') * 70 + RW.Team.capOf(state, 'cs') * 15 + (state.founder.focus.build > 0 ? 6 : 0) + RW.Team.capOf(state, 'f_sell') * 10 + 4;
    sup.tickets = t; sup.cap = cap;
    sup.backlog = Math.max(0, sup.backlog * 0.6 + t - cap);
    sup.overload = t > 0 ? U.clamp((t + sup.backlog * 0.5 - cap) / Math.max(1, t), 0, 1) : 0;
    sup.csat = U.clamp(U.approach(sup.csat, 0.92 - sup.overload * 0.6 - b.bugs / 300, 0.2), 0, 1);
  };

  M.outages = function (state) {
    var b = state.biz, w = state.time.w;
    var n = M.totalCustomers(b);
    if (!b.launched) return;
    var load = 1 + Math.log10(1 + n / 300);
    var p = 0.012 * load * (1 + b.debt / 35) / (1 + b.feats.scale * 0.5) * (1.4 - b.reliability / 100);
    var minutes = 0;
    if (R.chance(p)) {
      var major = R.chance(0.25 + b.debt / 300);
      minutes = major ? R.int(180, 900) : R.int(10, 90);
      b.outages.push({ w: w, min: minutes });
      if (major) {
        state.flags.crisis = w;
        b.brand = Math.max(0, b.brand - 2);
        var credit = U.sum(b.accounts, function (a) { return a.acv / 12 * 0.05; });
        if (credit > 0) L.post(state.fin, { contra_rev: credit, cash: -credit }, 'op');
        b.accounts.forEach(function (a) { a.health -= 6; });
        RW.Engine.mail(state, 'product', 'ระบบล่มครั้งใหญ่ ' + Math.round(minutes / 60) + ' ชั่วโมง', 'ลูกค้าใช้งานไม่ได้ ทีมต้องทำงานทั้งคืน' + (credit ? ' · ชดเชยตาม SLA ให้ลูกค้าองค์กร ' + F.b(credit) : '') + (b.debt > 50 ? ' · สาเหตุหลัก: หนี้ทางเทคนิคสะสม' : ''), 'bad');
      }
    }
    b.outages = b.outages.filter(function (o) { return o.w > w - 13; });
    var down = U.sum(b.outages, function (o) { return o.min; });
    b.uptime = 1 - down / (13 * 7 * 24 * 60);
  };

  // ---------- Monthly ----------
  M.monthly = function (state, info) {
    var b = state.biz, fin = state.fin;
    // hosting (USD-denominated cloud bills)
    var host = b.launched ? 4500 : 1500;
    SEGS.forEach(function (k) { host += M.customers(b, k) * SEG[k].host; });
    host *= (1 - Math.min(0.45, b.feats.scale * 0.11)) * state.world.fx / 35.5;
    if (state.flags.cloudCredits && state.flags.cloudCredits > state.time.w) host *= 0.2;
    if (b.launched || state.time.w > 4) L.spend(fin, 'cogs_host', host);
    b.lastHost = host;
    // expansion revenue & cohort aging
    SEGS.forEach(function (k) {
      var s = b.segs[k];
      var v = M.value(state, k);
      var csCov = M.csCoverage(state);
      var rate = SEG[k].expand * U.clamp(v, 0.3, 1.2) * (1 + csCov * 0.5) * state.world.macro.demand;
      s.cohorts.forEach(function (c) {
        c.age++;
        if (!c.annual) { var before = c.exp; c.exp *= 1 + rate; s.mstat.expMRR += c.n * c.arpa * (c.exp - before); }
      });
    });
    // markets: local teams
    for (var mk in b.markets) L.spend(fin, 'sal_sm', MARKETS[mk].monthly);
    // security certification upkeep
    if (b.feats.security >= 2) L.spend(fin, 'prof', 25000);
    // channel history snapshot
    var snap = {};
    M.CHKEYS.forEach(function (k) { snap[k] = U.deepCopy(b.ch[k].m); b.ch[k].m = { spend: 0, leads: 0, cust: 0 }; });
    b.chanMonthHist.push(snap);
    if (b.chanMonthHist.length > 24) b.chanMonthHist.shift();
    // segment month stats → history
    var segSnap = {};
    SEGS.forEach(function (k) {
      var s = b.segs[k];
      segSnap[k] = U.deepCopy(s.mstat);
      segSnap[k].endMRR = M.segMRR(b, k);
      segSnap[k].endN = M.customers(b, k);
      s.mstat = { leads: 0, won: 0, churned: 0, churnMRR: 0, expMRR: 0, newMRR: 0, startMRR: segSnap[k].endMRR, startN: segSnap[k].endN };
    });
    b.segHist = b.segHist || [];
    b.segHist.push(segSnap);
    if (b.segHist.length > 24) b.segHist.shift();
  };

  // ---------- KPIs ----------
  M.kpis = function (state) {
    var b = state.biz;
    var mrr = M.mrr(b);
    var cust = M.totalCustomers(b);
    var hist = b.segHist || [];
    var last = hist.length ? hist[hist.length - 1] : null;
    var startMRR = 0, churnMRR = 0, expMRR = 0, startN = 0, churnN = 0, newMRR = 0, won = 0;
    U.last(hist, 3).forEach(function (h) {
      SEGS.forEach(function (k) { startMRR += h[k].startMRR; churnMRR += h[k].churnMRR; expMRR += h[k].expMRR; startN += h[k].startN; churnN += h[k].churned; newMRR += h[k].newMRR; won += h[k].won; });
    });
    var months = Math.min(3, hist.length) || 1;
    var nrrM = startMRR > 0 ? (startMRR - churnMRR + expMRR) / startMRR : 1;
    var nrr = Math.pow(Math.max(0.5, nrrM), 12 / months);
    var logoChurn = startN > 0 ? churnN / startN / months : 0;
    // CAC: S&M spend last 3 months / new customers
    var smSpend = U.sum(U.last(state.hist.monthly, 3), function (m) { return (m.pl.mkt || 0) + (m.pl.commission || 0) + (m.pl.sal_sm || 0); });
    var cac = won > 0 ? smSpend / won : null;
    var arpa = cust > 0 ? mrr / cust : 0;
    var gm = state.kpi && state.kpi.gm > 0 ? state.kpi.gm : 0.75;
    var ltv = logoChurn > 0 ? arpa * gm / Math.max(0.005, logoChurn) : arpa * gm * 60;
    var adopters = U.sum(SEGS, function (k) { return CONCEPTS[b.concept].tam[k] * 0.3 * (k === 'micro' ? 0.4 : 1); }) * M.marketMult(state);
    var yoy = Math.pow(1 + (state.kpi.cmgr3 || 0), 12) - 1;
    return {
      mrr: mrr, arr: mrr * 12, customers: cust, nrr: nrr, logoChurn: logoChurn, cac: cac, ltv: ltv, ltvCac: cac ? ltv / cac : null,
      payback: cac && arpa > 0 ? cac / (arpa * gm) : null, arpa: arpa, marketShare: cust / Math.max(1, adopters), yoyGrowth: yoy,
      workload: { rnd: U.clamp(0.8 + b.impl / 40 + (b.roadmap.length > 3 ? 0.15 : 0), 0.8, 1.6), cogs: 1 + (b.support.overload || 0) * 0.8, sm: 1 },
      bugs: b.bugs, debt: b.debt, uptime: b.uptime
    };
  };

  M.monthKPIs = function (state) {
    var b = state.biz;
    return { mrr: M.mrr(b), customers: M.totalCustomers(b), seg: SEGS.map(function (k) { return M.customers(b, k); }) };
  };

  M.reportLine = function (state) {
    var k = state.kpi;
    return 'MRR ' + F.b(k.mrr) + ' · ลูกค้า ' + F.num(k.customers) + ' ราย · Logo churn ' + F.pct(k.logoChurn) + '/เดือน · NRR ' + F.pct(k.nrr, 0);
  };

  M.forecastCost = function (state) {
    var b = state.biz;
    var mk = U.sum(M.CHKEYS, function (k) { return (b.ch[k].budget || 0) * 4.33; });
    return mk + 12000;
  };
  M.forecastRevenue = function (state) { return M.mrr(state.biz); };

  // ---------- Investor view ----------
  M.traction = function (state) {
    var b = state.biz, k = state.kpi;
    var arr = M.mrr(b) * 12;
    var bestV = Math.max.apply(null, SEGS.map(function (s) { return M.value(state, s); }));
    var prod = b.launched ? 6 + bestV * 10 : b.feats.core * 2 + U.clamp((b.roadmap[0] && b.roadmap[0].f === 'core' ? b.roadmap[0].prog / FEAT.core.costs[0] : 0) * 4, 0, 4);
    var arrPts = 20 * Math.log10(1 + arr / 250000);
    var g = Math.pow(1 + (k.cmgr3 || 0), 12) - 1;
    var gw = Math.min(1, arr / 2e6);
    var growthPts = U.clamp(12 * Math.log2(1 + Math.max(-0.5, g)), -15, 26) * gw;
    var nrrPts = arr > 1e6 ? U.clamp(((k.nrr || 1) - 0.95) * 60, -10, 9) : 0;
    var execs = RW.Team.active(state).filter(function (e) { return e.level >= 4; }).length + (state.cofounders || []).filter(function (c) { return c.active; }).length;
    var team = Math.min(8, execs * 1.5 + state.founder.rep / 12);
    var eff = arr > 5e6 ? (k.burnMultiple < 1.5 ? 3 : k.burnMultiple > 4 ? -4 : 0) : 0;
    var hype = b.feats.auto * 1.5 * b.hype;
    var score = prod + arrPts + growthPts + nrrPts + team + eff + hype;
    return {
      score: score, arr: arr, growth: g,
      lines: [['ARR', F.m(arr)], ['การเติบโต (annualized)', arr > 0 ? F.spct(g, 0) : '–'], ['NRR', arr > 1e6 ? F.pct(k.nrr || 1, 0) : '–'], ['ลูกค้า', F.num(M.totalCustomers(b))], ['Fit สูงสุด', F.pct(bestV, 0)]]
    };
  };

  var VANCHOR = [[0, 6e6], [18, 25e6], [50, 100e6], [80, 500e6], [95, 2.2e9], [106, 7e9], [115, 20e9], [125, 45e9], [140, 120e9]];
  M.qualValue = function (score) {
    if (score <= 0) return VANCHOR[0][1];
    for (var i = 1; i < VANCHOR.length; i++) {
      if (score <= VANCHOR[i][0]) {
        var a = VANCHOR[i - 1], c = VANCHOR[i];
        var t = (score - a[0]) / (c[0] - a[0]);
        return Math.exp(Math.log(a[1]) + t * (Math.log(c[1]) - Math.log(a[1])));
      }
    }
    return VANCHOR[VANCHOR.length - 1][1];
  };
  M.valuation = function (state) {
    var tr = M.traction(state);
    var qual = M.qualValue(tr.score);
    var arr = tr.arr;
    if (arr <= 0) return qual;
    var g = U.clamp(tr.growth, 0, 3);
    var nrr = state.kpi.nrr || 1;
    var gm = Math.max(0.3, state.kpi.gm || 0.7);
    var mult = (3 + 7 * Math.pow(g, 0.6)) * (0.7 + 0.3 * nrr) * Math.sqrt(gm / 0.75);
    if (state.kpi.ebitdaMargin > 0.15) mult = Math.max(mult, 5 + state.kpi.ebitdaMargin * 20);
    var fund = arr * mult;
    var a = Math.sqrt(U.clamp(arr / 30e6, 0, 1));
    return Math.exp(a * Math.log(fund) + (1 - a) * Math.log(qual));
  };

  // ---------- Advice ----------
  M.advice = function (state) {
    var b = state.biz, out = [], k = state.kpi;
    function add(l, t) { out.push({ lvl: l, t: t }); }
    if (!b.launched && !b.roadmap.some(function (r) { return r.f === 'core'; })) add('crit', 'ยังไม่มี Core ใน roadmap — ต้องสร้าง MVP ก่อนจึงจะขายได้');
    if (!b.launched && RW.Team.capOf(state, 'dev') < 0.3) add('warn', 'ไม่มีใครเขียนโค้ด — จ้างวิศวกรหรือตั้งเวลาของคุณไปที่ "สร้างสินค้า"');
    if (b.launched && k.customers === 0 && state.time.w - b.launchW > 6) add('warn', 'เปิดขายมาแล้วแต่ยังไม่มีลูกค้า — ลองเพิ่มงบการตลาด หรือใช้เวลาขายด้วยตัวเอง');
    SEGS.forEach(function (s) {
      if (!b.segs[s].on) return;
      if (b.segs[s].disc < 25 && state.time.w > 8) add('info', 'คุณยังรู้จักลูกค้ากลุ่ม ' + SEG[s].s + ' น้อยมาก (Discovery ' + Math.round(b.segs[s].disc) + '%) — การสร้างฟีเจอร์ตอนนี้คือการเดา');
    });
    if (b.segs.ent.on && (b.feats.ent < 2 || b.feats.security < 2)) add('warn', 'องค์กรใหญ่จะไม่ซื้อถ้าไม่มี Enterprise ≥2 และ Security ≥2');
    if ((b.segs.mid.on || b.segs.ent.on) && RW.Team.capOf(state, 'sales') < 0.3) add('warn', 'ขายองค์กรต้องมีคนปิดการขาย (AE) หรือคุณต้องใช้เวลาขายเอง');
    if (b.debt > 55) add('warn', 'หนี้ทางเทคนิคสูง (' + Math.round(b.debt) + ') — การพัฒนาช้าลงและระบบล่มบ่อย');
    if (b.bugs > 50) add('warn', 'บั๊กเยอะ (' + Math.round(b.bugs) + ') ลูกค้าหนีและซัพพอร์ตล้น');
    if (b.support.overload > 0.25) add('warn', 'ทีมซัพพอร์ตรับไม่ไหว (เกิน ' + F.pct(b.support.overload, 0) + ') — churn กำลังเพิ่ม');
    if (b.impl > 25) add('warn', 'งาน implementation ค้าง ' + Math.round(b.impl) + ' dev-weeks — ลูกค้าใหม่รอใช้งาน เสี่ยงยกเลิก');
    if (k.ltvCac != null && k.ltvCac < 1 && state.hist.monthly.length > 3) add('warn', 'LTV/CAC = ' + k.ltvCac.toFixed(1) + ' — ทุกลูกค้าใหม่ทำให้ขาดทุน ปรับสินค้า ราคา หรือช่องทาง');
    if (k.logoChurn > 0.06 && k.customers > 30) add('warn', 'ลูกค้ายกเลิก ' + F.pct(k.logoChurn) + ' ต่อเดือน — ถังรั่ว เติมลูกค้าเท่าไหร่ก็ไม่โต');
    return out;
  };

  // ---------- Hooks ----------
  M.onEmployeeLeft = function (state, e) {
    if (e.role === 'eng' && e.skill > 70 && state.time.w - e.startW > 26) {
      state.biz.debt = Math.min(100, state.biz.debt + 4);
      RW.Engine.mail(state, 'product', 'ความรู้หายไปกับ ' + e.name, 'โค้ดส่วนที่เขาดูแลไม่มีใครเข้าใจ หนี้ทางเทคนิคเพิ่มขึ้น', 'warn');
    }
  };
  M.onCompetitorDied = function (state, c) {
    state.biz.buzz.push({ m: 1.35, weeks: 8, total: 8 });
  };
  M.onPandemic = function (state, pivot) {
    var b = state.biz;
    if (b.concept === 'pos') { b.buzz.push({ m: 0.55, weeks: 10, total: 10 }); SEGS.forEach(function (k) { b.segs[k].cohorts.forEach(function (c) { c.n = Math.round(c.n * 0.88); }); }); }
    else b.buzz.push({ m: pivot ? 1.3 : 1.12, weeks: 10, total: 10 });
  };
  M.onDisaster = function (state, sev) { };
  M.onPermit = function (state, fast) { if (!fast) state.biz.buzz.push({ m: 0.97, weeks: 4, total: 4 }); };
  M.newEntrant = function (state) {
    var b = state.biz;
    var c = CONCEPTS[b.concept];
    var big = R.chance(0.3 + (state.kpi.marketShare || 0) * 2);
    if (big) {
      return { name: R.pick(['GlobalSuite Cloud', 'OmniWork', 'Zentro', 'AsiaStack']), desc: 'ซอฟต์แวร์ยักษ์ใหญ่ระดับโลกเปิดสำนักงานในไทย เงินทุนไม่จำกัด ราคาแพงแต่แบรนด์แรง', quality: R.int(70, 85), price: R.range(1.1, 1.5), mkt: R.int(55, 80), focus: R.pick(['mid', 'ent']), cash: 500e6, burn: 6e6, stage: 'D', aggr: 0.4, global: true };
    }
    return { name: R.pick(['Nimbus', 'Kumo', 'Thaiwise', 'Flowly', 'Bangkok Labs', 'Siamsoft', 'Rakuen', 'Pila']) + ' ' + R.pick(['Cloud', 'HQ', 'App', 'One']), desc: 'สตาร์ทอัพใหม่ที่เพิ่งได้ทุน Seed เห็นว่าตลาดนี้โต', quality: R.int(35, 55), price: R.range(0.6, 0.95), mkt: R.int(30, 60), focus: R.pick(['micro', 'sme']), cash: R.range(15e6, 40e6), burn: R.range(1e6, 2e6), stage: 'seed', aggr: R.range(0.5, 0.9) };
  };

  // ---------- Actions ----------
  // ---------- Paid research: buy customer knowledge with money instead of founder time ----------
  M.RESEARCH = {
    interviews: {
      n: 'จ้างบริษัทวิจัยสัมภาษณ์ลูกค้า', weeks: 4,
      d: 'สัมภาษณ์เชิงลึก 20 รายในกลุ่มที่เลือก — เร่ง Discovery โดยไม่ใช้เวลาคุณ แต่ได้ข้อมูลมือสองที่ตื้นกว่าคุยเอง',
      cost: function (s, k) { return k === 'ent' || k === 'mid' ? 240000 : 140000; },
      can: function (s, k) { return SEG[k] ? (s.biz.segs[k].disc >= 85 ? 'รู้จักกลุ่มนี้ดีแล้ว — วิจัยเพิ่มได้ข้อมูลใหม่น้อยมาก' : null) : 'เลือกกลุ่มลูกค้า'; },
      done: function (s, k) {
        var sg = s.biz.segs[k], gain = 28 * (1 - sg.disc / 110);
        sg.disc = U.clamp(sg.disc + gain, 0, 100);
        var top = Object.keys(sg.need).sort(function (a, b) { return sg.need[b].w - sg.need[a].w; }).slice(0, 2).map(function (f) { return FEAT[f].n; });
        return 'รายงานสัมภาษณ์กลุ่ม ' + SEG[k].n + ' (+' + gain.toFixed(0) + '% Discovery → ' + Math.round(sg.disc) + '%) · สิ่งที่พูดถึงบ่อยที่สุด: ' + top.join(' และ ') + ' · ดูรายละเอียดในหน้า Discovery';
      }
    },
    pricing: {
      n: 'ศึกษาความเต็มใจจ่าย (Van Westendorp)', weeks: 3,
      d: 'สำรวจราคาที่ลูกค้ามองว่าถูกเกินไป/แพงเกินไป — เห็นความเต็มใจจ่ายของกลุ่มนี้ทันที แม้ Discovery ยังต่ำ',
      cost: function (s, k) { return k === 'ent' || k === 'mid' ? 150000 : 90000; },
      can: function (s, k) { return !SEG[k] ? 'เลือกกลุ่มลูกค้า' : s.biz.segs[k].priceKnown || s.biz.segs[k].disc >= 40 ? 'รู้ความเต็มใจจ่ายของกลุ่มนี้แล้ว' : null; },
      done: function (s, k) {
        var sg = s.biz.segs[k];
        sg.priceKnown = 1; sg.disc = Math.min(100, sg.disc + 4);
        var w = s.biz.launched ? M.wtp(s, k) : CONCEPTS[s.biz.concept].price[k] * 0.9;
        return 'ลูกค้ากลุ่ม ' + SEG[k].n + ' มองว่าราคาที่ "สมเหตุสมผล" สำหรับสินค้าตอนนี้อยู่ราว ' + F.b(Math.round(w / 10) * 10) + '/เดือน — ตั้งราคาสูงกว่านี้มากจะปิดการขายยาก ต่ำกว่านี้มากคือทิ้งเงินบนโต๊ะ (ความเต็มใจจ่ายจะเปลี่ยนตามคุณค่าของสินค้า)';
      }
    }
  };

  M.act = {
    addRoadmap: function (s, f) {
      var b = s.biz;
      if (b.feats[f] + b.roadmap.filter(function (r) { return r.f === f; }).length >= FEAT[f].costs.length) return { ok: false, msg: 'ถึงระดับสูงสุดแล้ว' };
      if (b.roadmap.some(function (r) { return r.f === f; })) return { ok: false, msg: 'อยู่ใน roadmap แล้ว' };
      b.roadmap.push({ f: f, prog: 0 });
      return { ok: true };
    },
    removeRoadmap: function (s, idx) {
      var b = s.biz, it = b.roadmap[idx];
      if (!it) return { ok: false };
      b.roadmap.splice(idx, 1);
      return { ok: true, msg: it.prog > 0 ? 'งานที่ทำไปแล้ว ' + Math.round(it.prog) + ' dev-weeks สูญเปล่า' : '' };
    },
    moveRoadmap: function (s, idx, dir) {
      var b = s.biz, j = idx + dir;
      if (j < 0 || j >= b.roadmap.length) return { ok: false };
      var t = b.roadmap[idx]; b.roadmap[idx] = b.roadmap[j]; b.roadmap[j] = t;
      return { ok: true };
    },
    setAlloc: function (s, key, v) {
      var a = s.biz.alloc;
      a[key] = U.clamp(Math.round(v), 0, 100);
      var others = Object.keys(a).filter(function (k) { return k !== key; });
      var rest = 100 - a[key], tot = U.sum(others, function (k) { return a[k]; });
      others.forEach(function (k, i) { a[k] = tot > 0 ? Math.round(a[k] * rest / tot) : (i === 0 ? rest : 0); });
      var diff = 100 - (a.feat + a.quality + a.infra);
      a[others[0]] += diff;
      return { ok: true };
    },
    setShip: function (s, m) { s.biz.ship = m; return { ok: true }; },
    setPrice: function (s, k, p) { s.biz.segs[k].price = Math.max(50, Math.round(p)); return { ok: true, msg: 'ราคาใหม่ใช้กับลูกค้าใหม่ (ลูกค้าเดิมคงราคาเดิม)' }; },
    repriceExisting: function (s, k) {
      var seg = s.biz.segs[k];
      var lost = 0;
      seg.cohorts.forEach(function (c) {
        var ratio = seg.price / c.arpa;
        if (ratio > 1.02) {
          var churnP = U.clamp((ratio - 1) * 0.5 * SEG[k].elast, 0, 0.6);
          var l = R.binom(c.n, churnP); c.n -= l; lost += l; c.arpa = seg.price * (c.annual ? 1 - s.biz.annualDiscount : 1);
        } else c.arpa = Math.min(c.arpa, seg.price);
      });
      seg.cohorts = seg.cohorts.filter(function (c) { return c.n > 0; });
      s.biz.brand = Math.max(0, s.biz.brand - (lost > 0 ? 3 : 0));
      return { ok: true, msg: 'ปรับราคาลูกค้าเดิมแล้ว' + (lost ? ' — ลูกค้ายกเลิกทันที ' + lost + ' ราย' : '') };
    },
    toggleSeg: function (s, k) { s.biz.segs[k].on = !s.biz.segs[k].on; return { ok: true }; },
    setMotion: function (s, k, m) { s.biz.segs[k].motion = m; return { ok: true }; },
    setBudget: function (s, ch, v) { s.biz.ch[ch].budget = Math.max(0, Math.round(v / 1000) * 1000); return { ok: true }; },
    setAnnualDiscount: function (s, v) { s.biz.annualDiscount = U.clamp(v, 0, 0.4); return { ok: true }; },
    setMaxDiscount: function (s, v) { s.biz.maxDiscount = U.clamp(v, 0, 0.4); return { ok: true }; },
    togglePartners: function (s) { s.biz.ch.partners.on = !s.biz.ch.partners.on; return { ok: true }; },
    setCommission: function (s, v) { s.biz.ch.partners.commission = U.clamp(v, 0.05, 0.4); return { ok: true }; },
    setReferral: function (s, v) { s.biz.ch.referral.incentive = Math.max(0, Math.round(v)); return { ok: true }; },
    setDiscTarget: function (s, k) { s.biz.discTarget = k; return { ok: true }; },
    prLaunch: function (s) {
      if (s.fin.bal.cash < 350000) return { ok: false, msg: 'เงินไม่พอ' };
      L.spend(s.fin, 'mkt', 350000);
      s.biz.buzz.push({ m: 1.45, weeks: 5, total: 5 });
      s.biz.brand = Math.min(100, s.biz.brand + 6);
      return { ok: true, msg: 'จ้างเอเจนซี PR แถลงข่าว + สื่อเทคฯ — กระแสพุ่ง 5 สัปดาห์' };
    },
    expand: function (s, mk) {
      var b = s.biz, m = MARKETS[mk];
      if (b.markets[mk]) return { ok: false, msg: 'เปิดตลาดนี้แล้ว' };
      if (b.feats.i18n < m.i18n) return { ok: false, msg: 'ต้องมีฟีเจอร์หลายภาษาระดับ ' + m.i18n };
      if (s.fin.bal.cash < m.cost * 1.5) return { ok: false, msg: 'เงินสดไม่พอ (ต้องการอย่างน้อย ' + F.m(m.cost * 1.5) + ')' };
      L.spend(s.fin, 'prof', m.cost);
      b.markets[mk] = { ramp: 0.05, w: s.time.w };
      return { ok: true, msg: 'ตั้งบริษัทลูกและทีมท้องถิ่นใน' + m.n + ' — ค่าใช้จ่ายรายเดือน ' + F.m(m.monthly) };
    },
    exitMarket: function (s, mk) { delete s.biz.markets[mk]; return { ok: true, msg: 'ถอนตัวจากตลาดแล้ว' }; }
  };

  // ---------- SaaS-specific events ----------
  var E = RW.Events, H = E.H;
  E.register({
    id: 'saas_bigclient', cat: 'sales', ind: ['saas'], weight: 1.4, cooldown: 26,
    cond: function (s) { return s.biz.launched && s.biz.feats.core >= 2 && M.totalCustomers(s.biz) > 5; },
    init: function (s) { return { name: RW.Names.company(), acv: Math.round(CONCEPTS[s.biz.concept].price.ent * R.range(0.8, 1.6) / 10000) * 10000 }; },
    title: function (s, d) { return d.name + ' อยากเป็นลูกค้า — แต่มีเงื่อนไข'; },
    body: function (s, d) { return 'องค์กรใหญ่สนใจใช้ระบบของคุณ มูลค่าสัญญา ' + F.b(d.acv) + '/ปี แต่ต้องการ:\n• พัฒนาฟีเจอร์เฉพาะสำหรับเขา (~20 dev-weeks)\n• เครดิตเทอม 90 วัน\n• ส่วนลด 25%\n\nดีลนี้จะเป็น logo ใหญ่ที่สุดของคุณ แต่ทีมจะเสียเวลาพัฒนาสินค้าหลักหลายสัปดาห์'; },
    choices: function (s, d) {
      return [
        { t: 'รับทุกเงื่อนไข', fx: function () { var b = s.biz; var acv = Math.round(d.acv * 0.75); var acc = { id: R.id('ac'), name: d.name, acv: acv, w: s.time.w, renew: s.time.w + 52, health: 65, impl: 20 }; b.accounts.push(acc); b.impl += 20; L.billAdvance(s.fin, acv, true, s, s.time.w + 13, { wht: true, name: d.name, seg: 'ent' }); b.brand += 4; b.debt = Math.min(100, b.debt + 6); s.biz.segs.ent.stat.won++; return 'ได้ลูกค้าองค์กร ' + d.name + ' — ทีมต้องทำงานพิเศษ 20 dev-weeks'; } },
        { t: 'ต่อรอง: ส่วนลด 10% และไม่ทำ custom', fx: function () { if (R.chance(0.35 + M.value(s, 'ent') * 0.4)) { var acv = Math.round(d.acv * 0.9); s.biz.accounts.push({ id: R.id('ac'), name: d.name, acv: acv, w: s.time.w, renew: s.time.w + 52, health: 75, impl: 8 }); s.biz.impl += 8; L.billAdvance(s.fin, acv, true, s, s.time.w + 9, { wht: true, name: d.name, seg: 'ent' }); return 'เขายอม! ปิดดีลโดยไม่ต้องทำ custom'; } return d.name + ' ไปเลือกคู่แข่งแทน'; } },
        { t: 'ปฏิเสธ — โฟกัสสินค้าหลัก', fx: function () { return 'คุณรักษาโฟกัสไว้ได้'; } }
      ];
    }
  });

  E.register({
    id: 'saas_cloudcredits', cat: 'product', ind: ['saas'], weight: 0.8, once: true,
    cond: function (s) { return s.company.registered && s.biz.launched; },
    title: 'โปรแกรมเครดิตคลาวด์สำหรับสตาร์ทอัพ',
    body: 'ผู้ให้บริการคลาวด์รายใหญ่เสนอเครดิตฟรี US$25,000-100,000 ใช้ได้ 12 เดือน (ถ้ามี VC หรือ accelerator รับรองจะได้วงเงินสูงสุด) เงื่อนไข: ต้องย้ายระบบไปใช้แพลตฟอร์มเขา (~6 dev-weeks)',
    choices: function (s) {
      return [
        { t: 'สมัครและย้ายระบบ', fx: function () { s.flags.cloudCredits = s.time.w + 52; s.biz.impl += 6; return 'ได้เครดิต ค่าเซิร์ฟเวอร์ลดลง ~80% เป็นเวลา 1 ปี (ระวัง: ปีหน้าบิลจะกลับมาเต็ม)'; } },
        { t: 'ไม่สนใจ', fx: function () { return 'ใช้ผู้ให้บริการเดิมต่อ'; } }
      ];
    }
  });

  E.register({
    id: 'saas_regulation', cat: 'market', ind: ['saas'], weight: 0.6, once: true,
    cond: function (s) { return s.time.w > 30 && (s.biz.concept === 'acct' || s.biz.concept === 'hr'); },
    title: function (s) { return s.biz.concept === 'acct' ? 'สรรพากรบังคับใช้ e-Tax Invoice กับ SME' : 'กฎหมายใหม่: บังคับนายจ้างยื่นข้อมูลเงินเดือนออนไลน์'; },
    body: 'กฎระเบียบใหม่จะมีผลใน 6 เดือน ธุรกิจจำนวนมากต้องหาซอฟต์แวร์ที่รองรับ ความต้องการในตลาดจะพุ่งขึ้นชั่วคราว ใครพร้อมก่อนได้เปรียบ',
    choices: function (s) {
      return [
        { t: 'เร่งพัฒนาให้รองรับ (เพิ่ม Integrations ไว้หัว roadmap)', fx: function () { var b = s.biz; if (b.feats.integ < FEAT.integ.costs.length) { b.roadmap = b.roadmap.filter(function (r) { return r.f !== 'integ'; }); b.roadmap.unshift({ f: 'integ', prog: 0 }); } s.flags.regBoost = { until: s.time.w + 40, m: 1.6 }; return 'ทีมเร่งพัฒนา ตลาดคึกคัก 40 สัปดาห์'; } },
        { t: 'ใช้ฟีเจอร์ที่มี ทำการตลาดเกาะกระแส', fx: function () { s.flags.regBoost = { until: s.time.w + 40, m: 1.35 }; return 'ตลาดคึกคักขึ้น'; } }
      ];
    }
  });

  E.register({
    id: 'saas_ai_hype', cat: 'market', ind: ['saas'], weight: 0.7, once: true,
    cond: function (s) { return s.time.w > 26; },
    title: 'กระแส AI ถล่มวงการลงทุน',
    body: 'นักลงทุนทั่วโลกเทเงินให้บริษัทที่มี "AI" อยู่ในเรื่องเล่า บริษัทที่ไม่มีเริ่มถูกถามว่า "แล้วถ้า AI มาแทนคุณล่ะ?"',
    choices: function (s) {
      return [
        { t: 'ปรับเรื่องเล่าเป็น AI-first และใส่ AI & Automation หัว roadmap', fx: function () { var b = s.biz; if (b.feats.auto < FEAT.auto.costs.length) { b.roadmap = b.roadmap.filter(function (r) { return r.f !== 'auto'; }); b.roadmap.unshift({ f: 'auto', prog: 0 }); } b.hype = Math.min(1.5, b.hype + 0.1); s.world.vc = Math.min(1.6, s.world.vc + 0.05); return 'นักลงทุนเริ่มสนใจมากขึ้น'; } },
        { t: 'ยืนหยัดกับสินค้าหลัก ไม่ตามกระแส', fx: function () { return 'คุณเลือกทางที่มั่นคงกว่า'; } }
      ];
    }
  });

  E.register({
    id: 'saas_acct_unhappy', cat: 'sales', ind: ['saas'], weight: 2, cooldown: 16,
    cond: function (s) { return s.biz.accounts.some(function (a) { return a.health < 45; }); },
    init: function (s) { var a = s.biz.accounts.filter(function (x) { return x.health < 45; }); return a.length ? { id: R.pick(a).id } : null; },
    valid: function (s, d) { return s.biz.accounts.some(function (a) { return a.id === d.id; }); },
    title: function (s, d) { var a = s.biz.accounts.find(function (x) { return x.id === d.id; }); return a.name + ' ขู่ยกเลิกสัญญา'; },
    body: function (s, d) { var a = s.biz.accounts.find(function (x) { return x.id === d.id; }); return 'ผู้บริหาร ' + a.name + ' (สัญญา ' + F.b(a.acv) + '/ปี) ส่งอีเมลถึงคุณโดยตรง ไม่พอใจเรื่อง ' + R.pick(['ระบบช้าและบั๊กเยอะ', 'ติดต่อซัพพอร์ตไม่ได้', 'ฟีเจอร์ที่สัญญาไว้ยังไม่มา', 'ค่าบริการแพงเกินคุณค่า']) + ' ความพอใจ ' + Math.round(a.health) + '/100'; },
    choices: function (s, d) {
      var a = s.biz.accounts.find(function (x) { return x.id === d.id; });
      return [
        { t: 'ไปพบผู้บริหารด้วยตัวเอง + ทีมแก้ไขด่วน', fx: function () { H.energy(s, -6); a.health = Math.min(100, a.health + 30); s.biz.impl += 4; return 'การไปพบด้วยตัวเองช่วยได้มาก'; } },
        { t: 'ให้ส่วนลด 20% ในปีถัดไป', fx: function () { a.acv = Math.round(a.acv * 0.8); a.health = Math.min(100, a.health + 22); return 'ลูกค้ายอมอยู่ต่อแบบมีเงื่อนไข'; } },
        { t: 'ปล่อยไป ทรัพยากรเราจำกัด', fx: function () { a.health -= 15; return 'ความสัมพันธ์แย่ลงอีก'; } }
      ];
    }
  });

  E.register({
    id: 'saas_reseller', cat: 'sales', ind: ['saas'], weight: 0.8, cooldown: 60,
    cond: function (s) { return s.biz.launched && M.totalCustomers(s.biz) > 20; },
    title: 'ผู้จัดจำหน่ายรายใหญ่ขอเป็นตัวแทนขายแบบ Exclusive',
    body: 'บริษัท System Integrator ที่มีลูกค้าองค์กรกว่า 2,000 ราย ขอเป็นตัวแทนขายรายเดียวในกลุ่มลูกค้า Mid-market นาน 3 ปี รับส่วนแบ่ง 30% ของรายได้ปีแรก',
    choices: function (s) {
      return [
        { t: 'ตกลง Exclusive', fx: function () { var b = s.biz; b.ch.partners.on = true; b.ch.partners.count += 60; b.ch.partners.commission = Math.max(b.ch.partners.commission, 0.3); b.segs.mid.on = true; s.flags.exclusiveMid = s.time.w + 156; return 'ลีดจากพาร์ทเนอร์พุ่ง แต่คุณผูกมัดเงื่อนไข 3 ปี'; } },
        { t: 'เสนอแบบ Non-exclusive', fx: function () { if (R.chance(0.5)) { s.biz.ch.partners.on = true; s.biz.ch.partners.count += 25; return 'เขายอมเป็นพาร์ทเนอร์แบบไม่ผูกขาด'; } return 'เขาไปเซ็นกับคู่แข่งแทน'; } },
        { t: 'ปฏิเสธ', fx: function () { return 'ขายเองต่อไป'; } }
      ];
    }
  });

  E.register({
    id: 'saas_price_war_global', cat: 'market', ind: ['saas'], weight: 0.5, once: true, bad: true,
    cond: function (s) { return s.time.w > 60 && RW.World.aliveCompetitors(s).some(function (c) { return c.global; }); },
    title: 'ยักษ์ใหญ่ระดับโลกแจกใช้ฟรี 1 ปี',
    body: 'คู่แข่งข้ามชาติประกาศให้ธุรกิจไทยใช้ฟรี 12 เดือนเพื่อตีตลาด สื่อทุกสำนักลงข่าว ลูกค้าของคุณเริ่มถามว่า "ทำไมเราต้องจ่าย?"',
    choices: function (s) {
      return [
        { t: 'ลดราคา 30% ทุกแพ็กเกจ (ลูกค้าเดิมด้วย)', fx: function () { var b = s.biz; SEGS.forEach(function (k) { b.segs[k].price = Math.round(b.segs[k].price * 0.7); b.segs[k].cohorts.forEach(function (c) { c.arpa *= 0.7; }); }); return 'รักษาลูกค้าไว้ได้ แต่รายได้หายไป 30%'; } },
        { t: 'เน้นจุดแข็ง: บริการคนไทย ซัพพอร์ตภาษาไทย 24 ชม.', fx: function () { s.biz.buzz.push({ m: 0.85, weeks: 20, total: 20 }); s.biz.brand += 3; return 'ลูกค้าบางส่วนลองไปใช้ของฟรี แต่หลายรายกลับมา'; } },
        { t: 'ไม่ตอบโต้', fx: function () { s.biz.buzz.push({ m: 0.7, weeks: 26, total: 26 }); return 'ลีดใหม่ลดลงอย่างมากช่วงครึ่งปี'; } }
      ];
    }
  });
})(globalThis.RW = globalThis.RW || {});
