/* ============================================================
   ตัวที่ 4 "กำไรรายสินค้าและรายช่องทาง" — ข้อมูล สูตร และสิ่งที่ตัวเลขบอก (ไม่มีหน้าจอ)
   · ทุกคู่ สินค้า × ช่องทาง = ทางรายได้ 1 ทางในตัวคำนวณ PL2 (calculateV4) → กำไรของร้านตรงกับตัวที่ 1 ทุกบาท
   · เงินที่เหลือ = ราคาหลังส่วนลดที่ร้านออก − ค่าธรรมเนียม − ต้นทุนสินค้า − ค่าแพ็กและค่าส่งต่อชิ้น
   · ไม่หารค่าใช้จ่ายคงที่ของร้านลงสินค้าหรือช่องทาง · หักเฉพาะค่าใช้จ่ายรายเดือนที่เกิดเพราะช่องทางนั้น
   · บอกปัญหาและขนาดเป็นเงิน ไม่บอกวิธีแก้ (HANDOFF ข้อ 4 เกณฑ์ข้อ 5)
   ใช้ data.js และ engine.js ของตัวที่ 1 (อ่านอย่างเดียว): MODELS · FIELDS · v4Input · fixedTotal · daysOf · num · n0 · pos · fmtN
   ============================================================ */

/* รอบแรก 3 รูปแบบรายได้ (เจ้าของตกลง) · อีก 5 แบบทำทีหลัง */
var PC_MODELS = ['unit', 'resell', 'service'];
var PC_MAX_ITEMS = 12;
var PC_MAX_CH = 6;
var VAT = 1.07;

/* ช่องทางขาย · g = กลุ่ม (คำใบ้ต่างกัน) · w = ขายที่ไหนที่เห็นช่องทางนี้ · m = รูปแบบรายได้ */
var ALL_W = ['shop', 'online', 'both'], ON_W = ['online', 'both'], OFF_W = ['shop', 'both'];
var CH_KINDS = {
  shop: { n: 'หน้าร้าน', g: 'shop', w: OFF_W, m: ['unit', 'resell', 'service'] },
  booth: { n: 'ออกบูธ / ตลาดนัด', g: 'off', w: OFF_W, m: ['unit', 'resell'] },
  onsite: { n: 'ไปบริการนอกร้าน', g: 'off', w: OFF_W, m: ['service'] },
  wholesale: { n: 'ขายส่ง / ฝากขาย', g: 'off', w: ALL_W, m: ['unit', 'resell'] },
  grab: { n: 'GrabFood', g: 'app', w: ON_W, m: ['unit'] },
  lineman: { n: 'LINE MAN', g: 'app', w: ON_W, m: ['unit'] },
  shopeefood: { n: 'ShopeeFood', g: 'app', w: ON_W, m: ['unit'] },
  robinhood: { n: 'Robinhood', g: 'app', w: ON_W, m: ['unit'] },
  shopee: { n: 'Shopee', g: 'mkt', w: ON_W, m: ['unit', 'resell'] },
  lazada: { n: 'Lazada', g: 'mkt', w: ON_W, m: ['unit', 'resell'] },
  tiktok: { n: 'TikTok Shop', g: 'mkt', w: ON_W, m: ['unit', 'resell'] },
  bookapp: { n: 'แอปจองคิว', g: 'app', w: ALL_W, m: ['service'] },
  social: { n: 'LINE / Facebook', g: 'direct', w: ON_W, m: ['unit', 'resell', 'service'] },
  web: { n: 'เว็บไซต์ร้าน', g: 'direct', w: ON_W, m: ['unit', 'resell', 'service'] },
  other: { n: 'ช่องทางอื่น', g: 'other', w: ALL_W, m: ['unit', 'resell', 'service'], custom: true }
};
var CH_ORDER = ['shop', 'booth', 'onsite', 'wholesale', 'grab', 'lineman', 'shopeefood', 'robinhood', 'shopee', 'lazada', 'tiktok', 'bookapp', 'social', 'web', 'other'];
function chKindsFor(m, where) {
  return CH_ORDER.filter(function (k) { var c = CH_KINDS[k]; return c.m.indexOf(m) >= 0 && (!where || c.w.indexOf(where) >= 0); });
}
/* คำใบ้ "เช่น" ของแต่ละกลุ่ม (จาก research.md · ค่าธรรมเนียมเปลี่ยนบ่อย จึงไม่ใส่ค่าให้ก่อน ให้ร้านใส่ตัวเลขของตัวเอง) */
var CH_HINT = {
  shop: { fee: 'ถ้ารับเงินสดหรือพร้อมเพย์อย่างเดียว มักไม่มีค่าธรรมเนียม · รูดบัตรเครดิตราว 1.6–1.8%', pack: 'เช่น ถุงใส่กลับบ้าน' },
  off: { fee: 'เช่น ส่วนแบ่งที่ร้านฝากขายหักไป', pack: 'เช่น ถุง กล่อง ค่าขนส่งไปส่งของ' },
  app: { fee: 'ดูในแอปของร้าน แอปส่งอาหารมัก GP ราว 30% และคิด VAT 7% บน GP เพิ่ม', pack: 'เช่น ถุง ซีล ช้อนส้อม ราว 5–8 บาทต่อออร์เดอร์', up: 'หลายร้านตั้งราคาบนแอปสูงกว่าราคาปกติ 10–30%' },
  mkt: { fee: 'รวมค่าคอม ค่าชำระเงิน และโปรแกรมส่งฟรีหรือคืนเหรียญที่ร้านเข้าร่วม ดูในหน้าร้านค้าของแพลตฟอร์ม', pack: 'เช่น กล่อง เทป ใบปะหน้า ราว 3–8 บาท และค่าส่งที่ร้านช่วยจ่าย', up: '' },
  direct: { fee: 'พร้อมเพย์มักไม่มีค่าธรรมเนียม · เก็บเงินปลายทางมีค่าธรรมเนียมราว 2%', pack: 'ค่าส่งที่ร้านจ่ายเอง + กล่อง เช่น พัสดุเล็กราว 25–45 บาท', up: '' },
  other: { fee: '', pack: '', up: '' }
};
function chHint(c, k) { var h = CH_HINT[(CH_KINDS[c.kind] || CH_KINDS.other).g] || {}; return h[k] || ''; }
function chName(c) { return (c.kind === 'other' || !CH_KINDS[c.kind]) ? (String(c.name || '').trim() || 'ช่องทางอื่น') : CH_KINDS[c.kind].n; }
function chIsShop(c) { return c.kind === 'shop'; }

/* ---------- ค่าที่ตอบแล้วหรือยัง ---------- */
function pcNum(v) { return num(v); }
function itemOk(p) { return !!String(p.name || '').trim() && pos(p.price) !== null && num(p.cost) !== null && num(p.cost) >= 0 && pos(p.qty) !== null; }
function restOk(pc) { return !pc.rest || pc.rest.on === false || (pc.rest.on === true && pos(pc.rest.sales) !== null && num(pc.rest.costPct) !== null && num(pc.rest.costPct) >= 0 && num(pc.rest.costPct) < 100); }
function restAnswered(pc) { return !!pc.rest && (pc.rest.on === true || pc.rest.on === false); }
function chList(pc) { return pc.channels || []; }
function chMany(pc) { return chList(pc).length > 1; }
function shareSum(pc) { return chList(pc).reduce(function (s, c) { return s + n0(c.share); }, 0); }
function sharesOk(pc) { if (!chMany(pc)) return chList(pc).length === 1; return chList(pc).every(function (c) { return num(c.share) !== null && num(c.share) > 0; }) && Math.abs(shareSum(pc) - 100) < 0.51; }
/* ช่องของช่องทางที่ต้องตอบ · คืนชื่อช่องแรกที่ยังขาด หรือ null */
function chMissing(c, pc) {
  if (c.kind === 'other' && !String(c.name || '').trim()) return 'name';
  if (!chIsShop(c) && !c.priceMode) return 'priceMode';
  if (!chIsShop(c) && c.priceMode !== 'same' && pos(c.markup) === null) return 'markup';
  if (!chIsShop(c) && c.priceMode === 'down' && n0(c.markup) >= 100) return 'markup';
  if (num(c.fee) === null || num(c.fee) < 0 || num(c.fee) >= 100) return 'fee';
  if (num(c.fee) > 0 && c.vat !== 'in' && c.vat !== 'ex') return 'vat';
  if (num(c.disc) === null || num(c.disc) < 0 || num(c.disc) >= 100) return 'disc';
  if (num(c.perOrder) === null || num(c.perOrder) < 0) return 'perOrder';
  if (num(c.perOrder) > 0 && (num(c.ipo) === null || num(c.ipo) < 1)) return 'ipo';
  if (num(c.monthly) === null || num(c.monthly) < 0) return 'monthly';
  if (chMany(pc) && pcItems(pc).length && pcItems(pc).every(function (p) { return c.off && c.off[p.id]; })) return 'off';
  return null;
}
/* สินค้าที่ไม่มีช่องทางให้ขายเลย (ปิดทุกช่องทาง) */
function itemNoChannel(pc, p) { return chList(pc).length > 0 && chList(pc).every(function (c) { return c.off && c.off[p.id]; }); }
function pcItems(pc) { return (pc.items || []); }
function daysOk(inp) { return inp.volumePer === 'month' || (pos(inp.daysOpen) !== null && n0(inp.daysOpen) <= 31); }
function itemsStepOk(pc, inp) { return pcItems(pc).length > 0 && pcItems(pc).every(itemOk) && restAnswered(pc) && restOk(pc) && daysOk(inp) && (inp.volumePer === 'day' || inp.volumePer === 'month'); }
function channelsStepOk(pc) { return chList(pc).length > 0 && chList(pc).every(function (c) { return !chMissing(c, pc); }) && sharesOk(pc) && pcItems(pc).every(function (p) { return !itemNoChannel(pc, p); }); }

/* ---------- ค่าใช้จ่ายคงที่ของร้าน (ชุดกลาง) ----------
   inp.chMkt = ค่าใช้จ่ายรายเดือนของช่องทางที่ตัวที่ 4 รวมไว้ในงบการตลาดของตัวเลขร้านแล้ว (ตอนผู้ใช้กด "ใช้ยอดจากรายสินค้าเป็นตัวเลขร้าน")
   → ตัวที่ 4 หักออกก่อนบวกค่าใช้จ่ายของช่องทางที่ใส่ไว้ จึงไม่นับซ้ำ */
function fixedBase(inp) { return fixedTotal(inp) - Math.min(n0(inp.chMkt), n0(inp.marketing)); }
var FIXED_KEYS = ['staffCount', 'staffSalary', 'ownerSalary', 'rent', 'marketing', 'otherFixed', 'cash'];
function fixedOk(inp) {
  return FIXED_KEYS.every(function (k) {
    if (k === 'staffSalary' && !(num(inp.staffCount) > 0)) return true;
    return num(inp[k]) !== null && num(inp[k]) >= 0;
  });
}

/* ---------- คำนวณ ---------- */
function perMult(inp) { return inp.volumePer === 'month' ? 1 : daysOf(inp); }
function mkFactor(c) { if (chIsShop(c) || c.priceMode === 'same' || !c.priceMode) return 1; var m = n0(c.markup) / 100; return c.priceMode === 'down' ? 1 - m : 1 + m; }
function feeRate(c) { var f = n0(c.fee) / 100; return f > 0 && c.vat === 'ex' ? f * VAT : f; }
function packPer(c) { return n0(c.perOrder) > 0 ? n0(c.perOrder) / Math.max(1, n0(c.ipo) || 1) : 0; }
/* ทุกรายการที่คิด: สินค้าที่ใส่ + "สินค้าอื่น ๆ" (ถ้ามี) — สินค้าอื่น ๆ ใช้ราคาเฉลี่ยของสินค้าที่ใส่ จำนวน = ยอดขาย ÷ ราคานั้น */
function pcRows(pc, inp) {
  var mult = perMult(inp), rows = pcItems(pc).map(function (p) {
    return { id: p.id, name: String(p.name || '').trim(), unit: p.unit || '', price: n0(p.price), cost: n0(p.cost), units: n0(p.qty) * mult, rest: false };
  });
  if (pc.rest && pc.rest.on === true && pos(pc.rest.sales)) {
    var u0 = rows.reduce(function (s, r) { return s + r.units; }, 0);
    var avg = u0 > 0 ? rows.reduce(function (s, r) { return s + r.price * r.units; }, 0) / u0 : 100;
    var sales = n0(pc.rest.sales) * mult;
    rows.push({ id: '_rest', name: 'สินค้าอื่น ๆ', unit: '', price: avg, cost: avg * n0(pc.rest.costPct) / 100, units: sales / avg, rest: true });
  }
  return rows;
}
function chOff(c, id) { return id !== '_rest' && !!(c.off && c.off[id]); }
function pcCompute(pc, inp, m) {
  var rows = pcRows(pc, inp), chs = chList(pc), mult = perMult(inp);
  if (!rows.length || !chs.length) return { ok: false };
  var many = chs.length > 1, cells = [], streams = [];
  rows.forEach(function (p, i) {
    var avail = chs.map(function (c, j) { return j; }).filter(function (j) { return !chOff(chs[j], p.id); });
    if (!avail.length) avail = chs.map(function (c, j) { return j; });
    var tot = many ? avail.reduce(function (s, j) { return s + n0(chs[j].share); }, 0) : 1;
    avail.forEach(function (j) {
      var c = chs[j], sh = many ? (tot > 0 ? n0(c.share) / tot : 1 / avail.length) : 1;
      var units = p.units * sh, list = p.price * mkFactor(c), net = list * (1 - n0(c.disc) / 100);
      var fr = feeRate(c), fee = net * fr, pack = packPer(c), left = net - fee - p.cost - pack;
      cells.push({ i: i, j: j, units: units, list: list, net: net, disc: list - net, fee: fee, cost: p.cost, pack: pack, left: left,
        rev: net * units, leftM: left * units, feeM: fee * units, costM: p.cost * units, packM: pack * units, discM: (list - net) * units });
      streams.push({ id: p.id + '@' + (c.id || j), name: p.name + ' · ' + chName(c), type: m, unitLabel: p.unit || U(inp, m),
        price: net, costPerUnit: p.cost + pack, variableCostPercent: fr * 100, unitsPerMonth: units,
        growthRatePercentMonthly: num(inp.growth), creditDays: n0(inp.creditDays),
        productionType: m === 'resell' ? 'buys_to_resell' : 'makes_own', inventoryDays: n0(inp.stockDays), supplierCreditDays: n0(inp.supplierCreditDays) });
    });
  });
  var chMonthly = chs.reduce(function (s, c) { return s + n0(c.monthly); }, 0);
  var v = v4Input(inp, m);
  v.streams = streams;
  v.fixedCostsMonthly = fixedBase(inp) + chMonthly;
  var r;
  try { r = JaruaCalc.calculateV4(v); } catch (e) { return { ok: false, error: String(e) }; }
  if (r.netProfitMonthly === null || r.revenueMonthly === null) return { ok: false, r: r };

  /* ฤดูกาลและการเติบโต: ตัวคำนวณบอกกำไรต่อเดือนเป็นค่าเฉลี่ย 12 เดือน (เหมือนตัวที่ 1) · ทุกทางใช้ฤดูกาลเดียวกัน
     จึงปรับจำนวนของทุกคู่ด้วยอัตราเดียวกัน ผลรวมรายสินค้าและรายช่องทางจึงเท่ากำไรของร้านเสมอ (ต่อชิ้นไม่เปลี่ยน) */
  var raw = cells.reduce(function (s, x) { return s + x.rev; }, 0);
  var f = (hasSeason(inp) || (num(inp.growth) !== null && num(inp.growth) !== 0)) && raw > 0 ? r.revenueMonthly / raw : 1;
  if (f !== 1) cells.forEach(function (x) { ['units', 'rev', 'leftM', 'feeM', 'costM', 'packM', 'discM'].forEach(function (k) { x[k] *= f; }); });
  var R = { ok: true, r: r, m: m, rows: rows, chs: chs, cells: cells, many: many, mult: mult, season: f };
  R.rev = cells.reduce(function (s, x) { return s + x.rev; }, 0);
  R.left = cells.reduce(function (s, x) { return s + x.leftM; }, 0);
  R.disc = cells.reduce(function (s, x) { return s + x.discM; }, 0);
  R.chMonthly = chMonthly;
  R.fixed = fixedBase(inp);
  R.dep = r.depreciation.monthlyTotal;
  R.profit = r.netProfitMonthly;
  R.units = cells.reduce(function (s, x) { return s + x.units; }, 0);
  R.unitsIn = rows.reduce(function (s, p) { return s + p.units; }, 0);

  R.prods = rows.map(function (p, i) {
    var cs = cells.filter(function (x) { return x.i === i; });
    var o = { i: i, id: p.id, name: p.name, unit: p.unit, rest: p.rest, price: p.price, cost: p.cost, unitsIn: p.units, units: cs.reduce(function (s, x) { return s + x.units; }, 0), cells: cs,
      rev: cs.reduce(function (s, x) { return s + x.rev; }, 0), left: cs.reduce(function (s, x) { return s + x.leftM; }, 0) };
    o.leftPer = o.units > 0 ? o.left / o.units : 0;
    o.per100 = o.rev > 0 ? o.left / o.rev * 100 : 0;
    return o;
  });
  R.chans = chs.map(function (c, j) {
    var cs = cells.filter(function (x) { return x.j === j; });
    var o = { j: j, c: c, name: chName(c), cells: cs, units: cs.reduce(function (s, x) { return s + x.units; }, 0),
      rev: cs.reduce(function (s, x) { return s + x.rev; }, 0), left: cs.reduce(function (s, x) { return s + x.leftM; }, 0),
      fee: cs.reduce(function (s, x) { return s + x.feeM; }, 0), cost: cs.reduce(function (s, x) { return s + x.costM; }, 0),
      pack: cs.reduce(function (s, x) { return s + x.packM; }, 0), disc: cs.reduce(function (s, x) { return s + x.discM; }, 0), monthly: n0(c.monthly) };
    o.after = o.left - o.monthly;
    o.per100 = o.rev > 0 ? o.left / o.rev * 100 : 0;
    return o;
  });
  var L = R.left;
  R.prods.forEach(function (p) { p.revShare = R.rev > 0 ? p.rev / R.rev * 100 : 0; p.leftShare = L > 0 ? p.left / L * 100 : null; });
  R.chans.forEach(function (c) { c.revShare = R.rev > 0 ? c.rev / R.rev * 100 : 0; c.leftShare = L > 0 ? c.left / L * 100 : null; });
  R.per100 = R.rev > 0 ? R.left / R.rev * 100 : 0;
  R.rank = R.prods.slice().sort(function (a, b) { return b.left - a.left || a.i - b.i; });
  R.chRank = R.chans.slice().sort(function (a, b) { return b.after - a.after || a.j - b.j; });
  R.finds = pcFinds(R);
  return R;
}
function cellOf(R, i, j) { for (var k = 0; k < R.cells.length; k++) if (R.cells[k].i === i && R.cells[k].j === j) return R.cells[k]; return null; }

/* ราคาบนช่องทางนี้ที่ทำให้เหลือเงินต่อชิ้น = target (ก่อนส่วนลดที่ร้านออก) · null = ทำไม่ได้ (ค่าธรรมเนียมหรือส่วนลด 100%) */
function listPriceFor(c, cost, target) {
  var k = (1 - n0(c.disc) / 100) * (1 - feeRate(c));
  return k > 1e-9 ? (target + cost + packPer(c)) / k : null;
}

/* ---------- สิ่งที่ตัวเลขบอก (เกณฑ์ที่เสนอ ⏳ HANDOFF ข้อ 7.9) ----------
   lv: high = ร้ายแรง · mid = ปานกลาง · watch = ควรเฝ้าระวัง · note = ข้อสังเกต · money = ขนาดเป็นเงินต่อเดือน */
var PC_LV = { high: 0, mid: 1, watch: 2, note: 3 };
function pcFinds(R) {
  var F = [];
  /* 1. ขายแล้วขาดทุนทุกชิ้น */
  var neg = R.cells.filter(function (x) { return x.left < -0.005 && x.units > 0; });
  if (neg.length) {
    var nm = neg.reduce(function (s, x) { return s + x.leftM; }, 0);
    F.push({ id: 'loss', lv: 'high', money: nm, cells: neg,
      t: neg.length === 1 ? R.rows[neg[0].i].name + (R.many ? 'ขายผ่าน ' + chName(R.chs[neg[0].j]) : '') + ' ขาดทุนทุกชิ้นที่ขาย' : 'มี ' + neg.length + ' คู่สินค้าและช่องทางที่ขาดทุนทุกชิ้นที่ขาย',
      s: 'ยิ่งขายมาก ยิ่งขาดทุนมาก', q: ['loss_price', 'loss_cost', 'ch_new'] });
  }
  /* 2–3. ช่องทางที่ค่าใช้จ่ายของตัวเองกินเงินที่เหลือ */
  R.chans.forEach(function (c) {
    if (c.monthly <= 0.5) return;
    if (c.after < -0.5) F.push({ id: 'chshort-' + c.j, kind: 'chshort', lv: 'high', money: c.after, ch: c.j,
      t: 'เงินที่เหลือจาก ' + c.name + ' ไม่พอจ่ายค่าใช้จ่ายของช่องทางนี้', s: 'เหลือ ' + fmtN(c.left) + ' บาท · ค่าใช้จ่ายของช่องทาง ' + fmtN(c.monthly) + ' บาท', q: ['ch_ads', 'ch_new'] });
    else if (c.left > 0 && c.monthly > c.left * 0.5) F.push({ id: 'cheat-' + c.j, kind: 'cheat', lv: 'mid', money: c.after, ch: c.j,
      t: 'ค่าใช้จ่ายของ ' + c.name + ' กินเงินที่เหลือไป ' + fmtN(c.monthly / c.left * 100, 0) + '%', s: 'เหลือ ' + fmtN(c.left) + ' บาท หักค่าใช้จ่ายของช่องทาง ' + fmtN(c.monthly) + ' บาท เหลือจริง ' + fmtN(c.after) + ' บาท', q: ['ch_ads', 'ch_new'] });
  });
  /* 4. ขายดีแต่เหลือเงินน้อย (เทียบกับค่าเฉลี่ยของร้าน) */
  if (R.prods.length > 1 && R.left > 0) R.prods.forEach(function (p) {
    if (p.rest || p.revShare < 10 || p.leftShare === null || p.leftShare >= p.revShare * 0.75) return;
    var gap = p.rev * (R.per100 - p.per100) / 100;
    if (gap < 1) return;
    F.push({ id: 'gap-' + p.i, kind: 'gap', lv: 'mid', money: gap, prod: p.i,
      t: p.name + ' ขายได้ ' + fmtN(p.revShare, 0) + '% ของยอดขาย แต่ได้เงินแค่ ' + fmtN(Math.max(0, p.leftShare), 0) + '% ของเงินที่เหลือ',
      s: 'ถ้า ' + p.name + ' เหลือเงินต่อ 100 บาทเท่าค่าเฉลี่ยของร้าน จะเหลือเพิ่มเดือนละ ' + fmtN(gap) + ' บาท', q: ['p_cost', 'p_price', 'p_pair'] });
  });
  /* 5. ช่องทางที่เหลือเงินน้อยกว่าช่องทางที่ดีที่สุดมาก */
  if (R.many) {
    var best = R.chans.reduce(function (b, c) { return c.rev > 0 && (!b || c.per100 > b.per100) ? c : b; }, null);
    if (best && best.per100 > 0) R.chans.forEach(function (c) {
      if (c === best || c.rev <= 0 || c.per100 >= best.per100 * 0.5) return;
      F.push({ id: 'chlow-' + c.j, kind: 'chlow', lv: 'watch', money: c.rev * (best.per100 - c.per100) / 100, ch: c.j, best: best.j,
        t: 'ขายผ่าน ' + c.name + ' 100 บาท เหลือ ' + fmtN(c.per100, 0) + ' บาท · ' + best.name + ' เหลือ ' + fmtN(best.per100, 0) + ' บาท',
        s: 'ยอดขายผ่าน ' + c.name + ' เดือนละ ' + fmtN(c.rev) + ' บาท ถ้าเหลือเท่า ' + best.name + ' จะเหลือเพิ่มเดือนละ ' + fmtN(c.rev * (best.per100 - c.per100) / 100) + ' บาท', q: ['loss_price', 'ch_new'] });
    });
  }
  /* 6. พึ่งสินค้าเดียว */
  if (R.prods.length > 1 && R.left > 0) R.prods.forEach(function (p) {
    if (p.rest || p.leftShare === null || p.leftShare <= 50) return;
    F.push({ id: 'conc-' + p.i, kind: 'conc', lv: 'note', money: p.left, prod: p.i,
      t: 'เงินที่เหลือ ' + fmtN(p.leftShare, 0) + '% มาจาก ' + p.name + ' ตัวเดียว', s: 'เดือนละ ' + fmtN(p.left) + ' บาท', q: ['conc'] });
  });
  /* 7. ต้นทุนที่อาจยังไม่ได้ใส่ */
  R.chans.forEach(function (c) {
    var g = (CH_KINDS[c.c.kind] || CH_KINDS.other).g;
    var miss = [];
    if ((g === 'app' || g === 'mkt') && n0(c.c.fee) === 0) miss.push('ค่าธรรมเนียม');
    if (R.m !== 'service' && (g === 'app' || g === 'mkt' || g === 'direct') && n0(c.c.perOrder) === 0) miss.push('ค่าแพ็กและค่าส่ง');
    if (miss.length) F.push({ id: 'forgot-' + c.j, kind: 'forgot', lv: 'note', money: null, ch: c.j,
      t: c.name + ' ยังไม่มี' + miss.join('และ'), s: 'ถ้าช่องทางนี้มีค่าใช้จ่ายนี้จริง เงินที่เหลือจะน้อยกว่าที่เห็น', q: ['f_pack'] });
  });
  F.sort(function (a, b) { return PC_LV[a.lv] - PC_LV[b.lv] || Math.abs(b.money || 0) - Math.abs(a.money || 0); });
  return F;
}

/* ---------- คำถามเช็ก → จุดที่ควรตรวจสอบ → เครื่องมือ PL1 (อ้างด้วยรหัส) ----------
   ans = คำบนปุ่ม · risk = คำตอบที่นับเป็นจุดที่ควรตรวจสอบ (ไม่แน่ใจ นับเสมอ) · ไม่บอกวิธีแก้ */
var QB4 = {
  loss_price: { q: 'ราคาบนช่องทางที่ขายผ่านแอปหรือแพลตฟอร์ม ตั้งโดยคิดค่าธรรมเนียมและส่วนลดของช่องทางนั้นแล้วหรือยัง?', ans: { yes: 'คิดแล้ว', no: 'ยังไม่ได้คิด', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'ราคาบนแต่ละช่องทาง', d: 'เช็กว่าราคาบนช่องทางนั้นครอบคลุมค่าธรรมเนียม ส่วนลดที่ร้านออก และค่าแพ็กแล้วหรือยัง', tools: ['grow13', 'cust5'] },
  loss_cost: { q: 'ต้นทุนของสินค้าที่ขาดทุน รวมแพ็กเกจและของที่เสียระหว่างทำแล้วหรือยัง?', ans: { yes: 'รวมแล้ว', no: 'ยังไม่รวม', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'ต้นทุนต่อชิ้น', d: 'เช็กต้นทุนทีละอย่าง (วัตถุดิบ แพ็กเกจ ของเสีย) ว่าตรงกับที่ซื้อจริงไหม', tools: ['grow13'] },
  ch_new: { q: 'ลูกค้าที่ซื้อผ่านช่องทางที่เหลือเงินน้อย ส่วนใหญ่เป็นลูกค้าใหม่ที่ไม่ได้ซื้อทางอื่นใช่ไหม?', ans: { yes: 'ใช่', no: 'ไม่ใช่', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'ลูกค้าที่ย้ายมาจากช่องทางอื่น', d: 'เช็กว่าลูกค้าในช่องทางนั้นเป็นคนใหม่ หรือเป็นลูกค้าเดิมที่เปลี่ยนมาซื้อทางที่เหลือเงินน้อยกว่า', tools: ['cust5', 'bmc10'] },
  ch_ads: { q: 'คุณรู้ไหมว่าค่าใช้จ่ายรายเดือนของช่องทางนั้น (เช่น โฆษณาในแอป) ทำให้ขายได้เพิ่มกี่ชิ้น?', ans: { yes: 'รู้', no: 'ไม่รู้', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'ผลของค่าใช้จ่ายของช่องทาง', d: 'เช็กยอดขายของช่องทางนั้นช่วงที่จ่ายกับช่วงที่ไม่จ่าย', tools: ['bmc10', 'grow9'] },
  p_cost: { q: 'ต้นทุนของสินค้าที่เหลือเงินน้อย รวมแพ็กเกจและของที่เสียแล้วหรือยัง?', ans: { yes: 'รวมแล้ว', no: 'ยังไม่รวม', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'ต้นทุนของสินค้าที่เหลือเงินน้อย', d: 'เช็กต้นทุนทีละอย่างของสินค้านั้นว่าตรงกับที่ซื้อจริงไหม', tools: ['grow13'] },
  p_price: { q: 'เคยเทียบราคาของสินค้าที่เหลือเงินน้อยกับร้านอื่นที่ขายของคล้ายกันไหม?', ans: { yes: 'เคย', no: 'ไม่เคย', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'ราคาเทียบกับร้านอื่น', d: 'เช็กว่าราคาของสินค้านั้นต่ำกว่าร้านอื่นที่ขายของคล้ายกันไหม และต่างกันเท่าไร', tools: ['grow13', 'grow10'] },
  p_pair: { q: 'ลูกค้าที่ซื้อสินค้าที่เหลือเงินน้อย มักซื้อสินค้าอื่นของร้านไปด้วยไหม?', ans: { yes: 'ใช่', no: 'ไม่ใช่', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'สินค้าที่ลูกค้าซื้อคู่กัน', d: 'เช็กว่าสินค้านั้นพาให้ลูกค้าซื้อสินค้าอื่นของร้านด้วยหรือเปล่า และลูกค้ากลุ่มนั้นซื้ออะไรอีก', tools: ['bmc8', 'grow10'] },
  conc: { q: 'ถ้าสินค้าที่ขายดีที่สุดขายได้น้อยลง ร้านมีสินค้าอื่นที่ลูกค้าซื้อแทนได้ไหม?', ans: { yes: 'มี', no: 'ไม่มี', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'การพึ่งสินค้าตัวเดียว', d: 'เช็กว่าถ้าสินค้าตัวนั้นขายได้น้อยลง ร้านจะเสียเงินเท่าไร และลูกค้ามีตัวเลือกอื่นในร้านไหม', tools: ['grow10', 'bmc8'] },
  f_pack: { q: 'ค่าแพ็กเกจ ค่าส่ง และค่าธรรมเนียมของทุกช่องทาง ใส่ไว้ในตัวเลขครบแล้วหรือยัง?', ans: { yes: 'ครบแล้ว', no: 'ยังไม่ครบ', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'ค่าใช้จ่ายของแต่ละช่องทาง', d: 'เช็กใบสรุปยอดของแต่ละช่องทาง ว่าหักอะไรไปบ้างต่อออร์เดอร์', tools: ['cust5'] }
};
/* คำถามที่จะถาม: ตามสิ่งที่ตัวเลขบอก เรียงตามความหนัก ไม่ซ้ำ ไม่เกิน 5 ข้อ · ไม่มีปัญหา = ถามเรื่องราคาและช่องทางทั่วไป */
function pcAskList(R) {
  var L = [];
  (R && R.ok ? R.finds : []).forEach(function (f) { (f.q || []).forEach(function (q) { if (L.indexOf(q) < 0) L.push(q); }); });
  if (!L.length) L = R && R.many ? ['loss_price', 'p_pair', 'f_pack'] : ['p_price', 'p_pair', 'conc'];
  return L.slice(0, 5);
}

/* ---------- ตัวเลขร้านจากรายสินค้า (ใช้เมื่อผู้ใช้เลือกเอง หรือเมื่อตัวที่ 4 เป็นคนสร้างตัวเลขร้าน) ----------
   ราคาเฉลี่ย = ยอดขายหลังส่วนลด ÷ จำนวน · ต้นทุนต่อหน่วย = ต้นทุนสินค้า + ค่าแพ็ก · ค่าธรรมเนียม = % ของยอดขาย
   ค่าใช้จ่ายของช่องทาง รวมเข้างบการตลาด (จำไว้ใน chMkt เพื่อไม่นับซ้ำ) → ตัวที่ 1 ได้กำไรเท่าตัวที่ 4 */
function pcAggregate(pc, inp, m, R) {
  R = R || pcCompute(pc, inp, m);
  if (!R.ok || R.units <= 0) return null;
  var o = JSON.parse(JSON.stringify(inp));
  var units = R.units, mult = R.mult;
  /* จำนวนที่กรอก (เดือนปกติ) · ตัวที่ 1 ใส่ฤดูกาลเอง */
  o.volume = Math.round(R.unitsIn / mult * 1e6) / 1e6;
  o.price = R.rev / units;
  o.unitCost = R.cells.reduce(function (s, x) { return s + (x.cost + x.pack) * x.units; }, 0) / units;
  o.feePct = R.rev > 0 ? R.cells.reduce(function (s, x) { return s + x.feeM; }, 0) / R.rev * 100 : 0;
  var byU = {};
  R.prods.forEach(function (p) { if (p.unit) byU[p.unit] = (byU[p.unit] || 0) + p.unitsIn; });
  var top = Object.keys(byU).sort(function (a, b) { return byU[b] - byU[a]; })[0];
  o.unitLabel = top || o.unitLabel || MODELS[m].defUnit;
  o.marketing = Math.max(0, n0(inp.marketing) - Math.min(n0(inp.chMkt), n0(inp.marketing))) + R.chMonthly;
  o.chMkt = R.chMonthly;
  /* กำลังสูงสุดของร้านคิดจากจำนวนรวม · ตัวที่ 4 ไม่ใช้ แต่ถ้าเดิมต่ำกว่าจำนวนที่ขายได้ ตัวที่ 1 จะขึ้นว่าเกินกำลัง จึงไม่แตะ */
  return o;
}
/* เทียบกับตัวเลขร้านที่มีอยู่ (เช่น กรอกในตัวที่ 1) · null = ตรงกันหรือเทียบไม่ได้ */
function pcDiff(pc, inp, m, R) {
  R = R || pcCompute(pc, inp, m);
  if (!R.ok || num(inp.price) === null || num(inp.volume) === null || num(inp.unitCost) === null) return null;
  var S = compute(inp, m);
  if (!S.ok) return null;
  var dRev = R.rev - S.revenue, dProfit = R.profit - S.profit;
  if (Math.abs(dRev) < 1 && Math.abs(dProfit) < 1) return null;
  return { rev4: R.rev, rev1: S.revenue, profit4: R.profit, profit1: S.profit, dRev: dRev, dProfit: dProfit };
}

/* ---------- ร้านตัวอย่าง (ตัวเลขอ้างอิงใน research.md) ---------- */
var PC_SAMPLES = {
  cafe: { m: 'unit', where: 'both', name: 'ร้านกาแฟตัวอย่าง', short: 'ร้านกาแฟ',
    inp: { volumePer: 'day', daysOpen: 26, staffCount: 2, staffSalary: 12000, ownerSalary: 15000, rent: 18000, marketing: 3000, otherFixed: 9000, cash: 30000 },
    items: [
      { id: 'p1', name: 'อเมริกาโน่เย็น', unit: 'แก้ว', price: 60, cost: 16, qty: 22 },
      { id: 'p2', name: 'ลาเต้เย็น', unit: 'แก้ว', price: 70, cost: 24, qty: 22 },
      { id: 'p3', name: 'ชาไทยเย็น', unit: 'แก้ว', price: 55, cost: 19, qty: 12 },
      { id: 'p4', name: 'โกโก้เย็น', unit: 'แก้ว', price: 55, cost: 22, qty: 14 },
      { id: 'p5', name: 'คาราเมลมัคคิอาโต้เย็น', unit: 'แก้ว', price: 80, cost: 28, qty: 6 },
      { id: 'p6', name: 'ครัวซองต์', unit: 'ชิ้น', price: 75, cost: 40, qty: 4 }
    ],
    rest: { on: false },
    channels: [
      { id: 'c1', kind: 'shop', share: 75, fee: 0, disc: 0, perOrder: 0, monthly: 0 },
      { id: 'c2', kind: 'grab', share: 16, priceMode: 'up', markup: 15, fee: 30, vat: 'ex', disc: 0, perOrder: 6, ipo: 1.5, monthly: 0 },
      { id: 'c3', kind: 'lineman', share: 9, priceMode: 'same', fee: 30, vat: 'ex', disc: 20, perOrder: 6, ipo: 1.5, monthly: 1500 }
    ] },
  online: { m: 'resell', where: 'online', name: 'ร้านเสื้อผ้าออนไลน์ตัวอย่าง', short: 'ร้านเสื้อผ้าออนไลน์',
    inp: { volumePer: 'month', staffCount: 1, staffSalary: 12000, ownerSalary: 15000, rent: 0, marketing: 8000, otherFixed: 4000, cash: 80000 },
    items: [
      { id: 'p1', name: 'เสื้อยืดโอเวอร์ไซซ์', unit: 'ตัว', price: 199, cost: 110, qty: 240 },
      { id: 'p2', name: 'เดรสลายดอก', unit: 'ตัว', price: 590, cost: 260, qty: 90 },
      { id: 'p3', name: 'กางเกงขากว้าง', unit: 'ตัว', price: 450, cost: 190, qty: 90 },
      { id: 'p4', name: 'เซ็ตเสื้อและกางเกง', unit: 'ชุด', price: 790, cost: 360, qty: 40 },
      { id: 'p5', name: 'หมวกบักเก็ต', unit: 'ชิ้น', price: 190, cost: 70, qty: 30 }
    ],
    rest: { on: false },
    channels: [
      { id: 'c1', kind: 'shopee', share: 45, priceMode: 'same', fee: 18, vat: 'in', disc: 5, perOrder: 9, ipo: 1.3, monthly: 0 },
      { id: 'c2', kind: 'tiktok', share: 35, priceMode: 'same', fee: 28, vat: 'in', disc: 10, perOrder: 8, ipo: 1.2, monthly: 6000 },
      { id: 'c3', kind: 'social', share: 20, priceMode: 'same', fee: 0, disc: 0, perOrder: 45, ipo: 1.4, monthly: 0 }
    ] }
};
function pcSample(k) {
  var S = PC_SAMPLES[k], pc = { items: JSON.parse(JSON.stringify(S.items)), rest: JSON.parse(JSON.stringify(S.rest)), channels: JSON.parse(JSON.stringify(S.channels)), multi: S.channels.length > 1 ? 'yes' : 'no' };
  var inp = JSON.parse(JSON.stringify(S.inp));
  inp.unitLabel = MODELS[S.m].defUnit;
  var agg = pcAggregate(pc, inp, S.m);
  return { m: S.m, pc: pc, inp: agg || inp };
}
