/* ============================================================
   ตัวที่ 2 "เช็กก่อนเปิดร้าน" — ข้อมูล สูตร และสิ่งที่ตัวเลขบอก (ไม่มีหน้าจอ)
   · กำไรต่อเดือนเมื่อยอดขายเต็ม และจุดคุ้มทุน = ตัวคำนวณ PL2 (calculateV4 ผ่าน compute ของตัวที่ 1) → ตรงกับตัวที่ 1 ทุกบาท
   · ตัวคำนวณ PL2 คิดแบบร้านที่ขายคงที่แล้ว จึงคิดเพิ่มในไฟล์นี้: เงินก่อนเปิดร้าน · ยอดขายเดือนแรก ๆ · เงินในมือเดือนต่อเดือน · คืนทุน
     · เงินพอ ถ้า… · เรื่องที่ทำให้ต้องใช้เงินเพิ่ม (HANDOFF ข้อ 9.1 ข้อ 1: คิดเพิ่มในไฟล์ของ Lab ไม่แก้ตัวคำนวณ)
   · เงินในมือคิดเป็นเงินสด (ไม่หักเงินกันไว้ซื้ออุปกรณ์ใหม่ เพราะยังไม่ได้จ่ายจริง) · กำไรต่อเดือนหักเงินนั้นแบบตัวที่ 1
   · บอกปัญหาและขนาดเป็นเงิน ไม่บอกวิธีแก้ (HANDOFF ข้อ 4 เกณฑ์ข้อ 5)
   ใช้ data.js และ engine.js ของตัวที่ 1 (อ่านอย่างเดียว): MODELS · FIELDS · compute · fixedTotal · volMonthly · daysOf · TH_MONTHS · num · n0 · pos · fmtN
   ============================================================ */

/* รอบแรก 3 รูปแบบรายได้ (เจ้าของตกลง) */
var OP_MODELS = ['unit', 'resell', 'service'];
var OP_H = 60;          /* คิดเดือนต่อเดือน 5 ปี */
var OP_SHOW = 24;       /* กราฟเงินในมือ 24 เดือน */

/* เครื่องมือ PL1 ของคนที่ยังไม่เปิดร้าน (อ้างด้วยรหัส · ชื่อจาก reference/pl1-tools.md) — เติมเข้าตาราง TOOLS ของตัวที่ 1 */
var OP_TOOLS = {
  idea7: ['เทียบทำเลและวางงบเปิดร้าน', 'เลือกทำเล และวางงบให้เงินไม่หมดก่อนร้านตั้งตัว'],
  ver5: ['เช็กความพร้อมก่อนเปิดร้าน', 'รู้ว่าพร้อมแค่ไหน ก่อนเซ็นสัญญาหรือจ่ายเงินก้อนใหญ่'],
  ver4: ['เปลี่ยนไอเดียเป็นแผนเริ่มต้น', 'เริ่มทีละขั้น พิสูจน์ว่ามีคนซื้อก่อนลงเงิน'],
  ver1: ['เช็กจุดต่างจากคู่แข่ง', 'รู้ว่าจุดเด่นไหนต่างจริง และตลาดแน่นจริงไหม'],
  cust8: ['ค้นหาลูกค้าเป้าหมายก่อนเริ่มธุรกิจ', 'รู้ว่าควรขายให้ใครก่อน และพิสูจน์ก่อนลงเงิน'],
  idea3: ['หาไอเดียธุรกิจตามงบที่มี', 'รู้ว่างบนี้ทำอะไรได้ และใช้เงินก้อนแรกอย่างไร'],
  idea5: ['หาไอเดียธุรกิจที่เสี่ยงเท่าที่รับได้', 'เริ่มธุรกิจโดยไม่เสี่ยงเกินที่คุณรับไหว'],
  idea6: ['เปรียบเทียบไอเดียธุรกิจ', 'เทียบไอเดียตามเรื่องที่คุณให้ความสำคัญ แล้วเลือกให้หนึ่งอย่าง'],
  goal3: ['วางแผนเปิดตัวสินค้าหรือบริการ', 'เปิดตัวแบบเสี่ยงน้อย มีด่านตรวจทุกขั้น'],
  goal4: ['เตรียมแผนรับมือเหตุไม่คาดฝัน', 'รู้ล่วงหน้าว่าวันที่เกิดเรื่องต้องทำอะไร'],
  grow14: ['วิเคราะห์ความเหมาะสมของทำเล', 'ดูว่าทำเลฉุดจริงไหม และแก้อะไรได้ก่อนคิดย้าย']
};
if (typeof TOOLS !== 'undefined') Object.keys(OP_TOOLS).forEach(function (k) { if (!TOOLS[k]) TOOLS[k] = OP_TOOLS[k]; });

/* ---------- เงินก่อนเปิดร้าน ----------
   t = ชนิดเงิน: gone หมดไป · back ได้คืน · stock เงินจมในของ · equip อุปกรณ์ใช้หลายปี (y = ใช้ได้กี่ปี)
   w = ขายที่ไหนที่เห็น (shop = มีหน้าร้าน) · m = รูปแบบร้าน · n = ชื่อ (ต่างตามรูปแบบร้านได้) */
var SU_TYPES = { gone: 'หมดไป', back: 'ได้คืน', stock: 'เงินจมในของ', equip: 'อุปกรณ์ใช้หลายปี' };
var SU_SHOP = ['shop', 'both'], SU_ALL = ['shop', 'online', 'both'], SU_ON = ['online', 'both'];
var SU_CAT = {
  deposit: { n: 'มัดจำค่าเช่า', t: 'back', w: SU_SHOP, h: 'มักเป็น 2–3 เดือนของค่าเช่า · ค่าเช่าที่จ่ายล่วงหน้า 1 เดือนคือค่าเช่าเดือนแรก ไม่ต้องใส่ตรงนี้' },
  decor: { n: 'ตกแต่ง ซ่อมแซมร้าน', t: 'gone', w: SU_SHOP, h: 'พื้น ผนัง ไฟ น้ำ ฝีมือช่าง' },
  sign: { n: 'ป้ายร้าน', t: 'gone', w: SU_SHOP },
  tools: { n: { unit: 'เครื่องมือทำสินค้า', resell: 'ชั้นวาง ตู้โชว์', service: 'อุปกรณ์ช่าง' }, t: 'equip', y: 5, w: SU_ALL,
    h: { unit: 'เช่น เครื่องชง เครื่องบด เตา หม้อ', resell: 'เช่น ชั้นวางสินค้า ตู้กระจก ราวแขวน', service: 'เช่น เก้าอี้ เตียง เครื่องมือช่าง' } },
  cold: { n: 'ตู้เย็น ตู้แช่ เครื่องปั่น', t: 'equip', y: 5, w: SU_ALL, m: ['unit'] },
  furn: { n: 'โต๊ะ เก้าอี้ เคาน์เตอร์', t: 'equip', y: 5, w: SU_SHOP },
  pos: { n: 'เครื่องขายหน้าร้าน แท็บเล็ต', t: 'equip', y: 3, w: SU_SHOP },
  photo: { n: 'ไฟถ่ายรูป ฉาก', t: 'equip', y: 3, w: SU_ON },
  printer: { n: 'เครื่องพิมพ์ใบปะหน้า', t: 'equip', y: 3, w: SU_ON, m: ['unit', 'resell'] },
  stock: { n: { unit: 'วัตถุดิบล็อตแรก', resell: 'สินค้าล็อตแรก', service: 'ผลิตภัณฑ์ล็อตแรก' }, t: 'stock', w: SU_ALL,
    h: 'ของที่ซื้อมาเก็บไว้ก่อนขาย · ขายแล้วซื้อเติม เงินก้อนนี้จึงจมอยู่ในของตลอด' },
  pack: { n: 'บรรจุภัณฑ์ล็อตแรก', t: 'stock', w: SU_ALL, m: ['unit', 'resell'], h: 'เช่น แก้ว ฝา ถุง กล่อง ซอง' },
  util: { n: 'มัดจำมิเตอร์ไฟ น้ำ', t: 'back', w: SU_SHOP },
  train: { n: 'ค่าจ้างพนักงานช่วงฝึกก่อนเปิด', t: 'gone', w: SU_ALL },
  brand: { n: 'โลโก้ ถ่ายรูปสินค้า', t: 'gone', w: SU_ALL },
  setup: { n: 'ตั้งร้านออนไลน์ เว็บ แอป', t: 'gone', w: SU_ON },
  launch: { n: 'โปรเปิดร้าน โฆษณาช่วงเปิด', t: 'gone', w: SU_ALL },
  other: { n: 'อื่น ๆ', t: 'gone', w: SU_ALL, custom: true }
};
var SU_ORDER = ['deposit', 'decor', 'sign', 'tools', 'cold', 'furn', 'pos', 'photo', 'printer', 'stock', 'pack', 'util', 'train', 'brand', 'setup', 'launch', 'other'];
/* ร้านแบบนี้มักมี (ใช้บอกในสิ่งที่ตัวเลขบอก ถ้ายังไม่ได้ใส่) */
var SU_USUAL = { shop: ['deposit', 'decor', 'sign', 'tools', 'stock', 'launch'], online: ['tools', 'stock', 'launch', 'photo'], both: ['deposit', 'decor', 'tools', 'stock', 'launch'] };
function suKinds(m, where) { return SU_ORDER.filter(function (k) { var c = SU_CAT[k]; return (!c.m || c.m.indexOf(m) >= 0) && (!where || c.w.indexOf(where) >= 0); }); }
function suName(it, m) { if (it.k === 'other' || !SU_CAT[it.k]) return String(it.name || '').trim() || 'อื่น ๆ'; var n = SU_CAT[it.k].n; return typeof n === 'string' ? n : n[m] || n.unit; }
function suHint(k, m) { var h = SU_CAT[k] && SU_CAT[k].h; return !h ? '' : typeof h === 'string' ? h : h[m] || ''; }
function suItemOk(it) { return num(it.amt) !== null && num(it.amt) >= 0 && (it.k !== 'other' || !!String(it.name || '').trim()) && (it.t !== 'equip' || pos(it.y) !== null); }
/* ค่าเช่าช่วงตกแต่ง: ค่าเช่าต่อเดือน × เดือนที่ตกแต่ง (ใส่ให้เอง) */
function fitRent(op, inp) { return Math.max(0, n0(op.fit)) * n0(inp.rent); }
function suTotals(op, inp) {
  var T = { all: 0, gone: 0, back: 0, stock: 0, equip: 0, equipDep: 0, fit: fitRent(op, inp) };
  (op.items || []).forEach(function (it) {
    var a = Math.max(0, n0(it.amt)); T.all += a; T[it.t] = (T[it.t] || 0) + a;
    if (it.t === 'equip' && pos(it.y)) T.equipDep += a / (pos(it.y) * 12);
  });
  if (op.lump !== null && op.lump !== undefined && op.mode === 'lump') { var l = Math.max(0, n0(op.lump)); T = { all: l, gone: l, back: 0, stock: 0, equip: 0, equipDep: 0, fit: T.fit }; }
  T.all += T.fit; T.gone += T.fit;
  /* เงินที่จ่ายหมดไป = ทุกอย่าง ยกเว้นเงินที่ได้คืนและเงินจมในของ (ยังเป็นของร้าน) */
  T.spent = T.all - T.back - T.stock;
  return T;
}
/* อุปกรณ์ทั้งหมดเป็นช่อง "อุปกรณ์ราคาสูง" ของตัวเลขร้านชุดกลาง (ตัวที่ 1): ราคารวม · ปีที่ให้ค่ากันเงินต่อเดือนเท่ากัน */
function suEquip(op) {
  var v = 0, d = 0;
  if (op.mode !== 'lump') (op.items || []).forEach(function (it) { if (it.t === 'equip' && pos(it.amt) && pos(it.y)) { v += pos(it.amt); d += pos(it.amt) / pos(it.y); } });
  return v > 0 && d > 0 ? { value: v, years: Math.round(v / d * 100) / 100 } : null;
}

/* ---------- ยอดขายเดือนแรก ๆ ----------
   curve = สัดส่วนของยอดขายปกติในเดือนที่ 1, 2, … · หลังจากนั้น = 100% · ค่าตั้งต้นเป็นค่าประมาณ (ไม่มีข้อมูลของร้านไทย) */
var RAMP_PRESETS = {
  now: { n: 'เต็มตั้งแต่เดือนแรก', c: [] },
  r3: { n: 'ค่อย ๆ ขึ้น 3 เดือน', c: [0.4, 0.6, 0.8] },
  r6: { n: 'ค่อย ๆ ขึ้น 6 เดือน', c: [0.4, 0.5, 0.6, 0.7, 0.8, 0.9] },
  honey: { n: 'คนมาลองเยอะช่วงเปิด แล้วลดลง', c: [0.9, 0.6, 0.7, 0.8, 0.9] }
};
var RAMP_ORDER = ['now', 'r3', 'r6', 'honey'];
var RAMP_MAX = 24;
function rampCurve(op) { var r = op.ramp || {}; if (r.p === 'custom') return (r.c || []).slice(0, RAMP_MAX); return (RAMP_PRESETS[r.p] || RAMP_PRESETS.r3).c.slice(); }
function rampAt(c, m) { return m <= c.length ? Math.max(0, c[m - 1]) : 1; }
/* เดือนที่ยอดขายเต็ม (เดือนแรกที่ไม่มีเดือนหลังจากนั้นต่ำกว่า 100%) */
function rampFull(c) { var L = c.length; while (L > 0 && c[L - 1] >= 0.999) L--; return L + 1; }
/* ยอดขายเต็มช้าลง k เดือน: ยืดช่วงเดือนแรก ๆ ออกไปเท่า ๆ กัน (เดือนแรกเท่าเดิม ถึงเต็มช้าลง k เดือน)
   ร้านที่เต็มตั้งแต่เดือนแรก: ใช้ค่อย ๆ ขึ้น k เดือนจาก 40% */
function rampDelay(c, k) {
  if (k <= 0) return c.slice();
  var L = c.length;
  if (!L) { var o = []; for (var i = 1; i <= k; i++) o.push(0.4 + 0.6 * (i - 1) / k); return o; }
  var P = c.concat([1]), out = [];
  for (var m = 1; m <= L + k; m++) {
    var t = 1 + (m - 1) * L / (L + k), a = Math.floor(t), f = t - a;
    out.push(P[a - 1] + (P[Math.min(a, L)] - P[a - 1]) * f);
  }
  return out;
}

/* ---------- ฤดูกาล การเติบโต และเครดิต (ตัวเลขร้านชุดกลางของตัวที่ 1) ---------- */
function seasonAt(inp, cal) {
  var s = inp.season;
  if (!s) return 1;
  if ((s.high || []).indexOf(cal) >= 0) return 1 + n0(s.highPct) / 100;
  if ((s.low || []).indexOf(cal) >= 0) return 1 - n0(s.lowPct) / 100;
  return 1;
}
function calAfter(openMonth, m) { return ((n0(openMonth) - 1 + m - 1) % 12 + 12) % 12 + 1; }

/* ---------- คิดเดือนต่อเดือน ----------
   o: { inp, m, op, mult (ยอดขาย ×), curve, startupMult (เงินก่อนเปิด ×), fixedMult, costMult, priceMult }
   ยอดขายเดือน m = ยอดขายปกติ × ช่วงเดือนแรก ๆ × ฤดูกาล × การเติบโต · ค่าใช้จ่ายทุกเดือนเต็มตั้งแต่เดือนแรก
   ลูกค้าจ่ายช้า (creditDays) / จ่ายร้านค้าช้า (supplierCreditDays) เลื่อนเงินเข้าออก */
function opSim(o) {
  var x1 = function (v) { return v === undefined || v === null ? 1 : v; };
  var inp = o.inp, op = o.op, U = (volMonthly(inp) || 0) * x1(o.mult), price = n0(inp.price) * x1(o.priceMult);
  /* ค่าใช้จ่ายทุกเดือนเพิ่ม: ไม่รวมเงินเดือนตัวเอง (ตั้งเองได้ ไม่ขึ้นตามราคา) */
  var cost = n0(inp.unitCost) * x1(o.costMult), fee = n0(inp.feePct) / 100, own = n0(inp.ownerSalary), F = (fixedTotal(inp) - own) * x1(o.fixedMult) + own;
  var c = o.curve || rampCurve(op), g = n0(inp.growth) / 100, T = suTotals(op, inp), all = T.all * x1(o.startupMult), spent = T.spent + (all - T.all);
  var save = num(op.savings), dIn = Math.max(0, n0(inp.creditDays)) / 30, dOut = Math.max(0, n0(inp.supplierCreditDays)) / 30;
  var rev = [], cogs = [], months = [];
  for (var m = 1; m <= OP_H; m++) {
    var f = rampAt(c, m) * seasonAt(inp, calAfter(op.openMonth || 1, m)) * Math.pow(1 + g, m - 1);
    var u = U * f;
    rev.push(price * u); cogs.push(cost * u);
    months.push({ m: m, f: f, units: u });
  }
  var lag = function (arr, d, m) { var i = Math.floor(d), fr = d - i, a = m - 1 - i, b = a - 1; return (a >= 0 ? arr[a] : 0) * (1 - fr) + (b >= 0 ? arr[b] : 0) * fr; };
  var cum = 0, low = 0, lowM = 0, payS = null, payA = null;
  months.forEach(function (x, k) {
    var mm = k + 1, cin = lag(rev, dIn, mm), cout = rev[k] * fee + lag(cogs, dOut, mm) + F;
    x.rev = rev[k]; x.cashIn = cin; x.cashOut = cout; x.net = cin - cout; cum += x.net; x.cum = cum;
    x.bal = save === null ? null : save - all + cum;
    if (cum < low - 1e-9) { low = cum; lowM = mm; }
    if (payS === null && cum >= spent - 1e-6) payS = mm;
    if (payA === null && cum >= all - 1e-6) payA = mm;
  });
  var need = all - low;
  return { months: months, all: all, spent: spent, low: low, lowM: lowM, need: need, save: save,
    left: save === null ? null : save - need, payS: payS, payA: payA, F: F, U: U,
    net1: months[0].net, start: save === null ? null : save - all };
}

/* ---------- ผลทั้งหมด ---------- */
function opCompute(inp, m, op) {
  var S = compute(inp, m);
  if (!S.ok) return { ok: false, S: S };
  var R = { ok: true, S: S, m: m, inp: inp, op: op, T: suTotals(op, inp), curve: rampCurve(op) };
  R.full = rampFull(R.curve);
  R.days = daysOf(inp);
  R.perDay = inp.volumePer !== 'month';
  R.cu = S.volMonth > 0 ? S.contribution / S.volMonth : 0;     /* เงินที่เหลือต่อชิ้น หลังต้นทุนและค่าธรรมเนียม */
  var r = (pos(op.range) || 20) / 100;
  R.range = r * 100;
  R.sc = { low: opSim({ inp: inp, op: op, mult: 1 - r }), mid: opSim({ inp: inp, op: op }), high: opSim({ inp: inp, op: op, mult: 1 + r }) };
  R.base = R.sc.mid;
  /* ยอดขายค้างที่เดือนแรก / ไม่มียอดขายเลย: เงินที่เหลือหลังจ่ายเงินก่อนเปิดอยู่ได้กี่เดือน */
  var st = R.base.start;
  R.stuck = st === null ? null : R.base.net1 >= 0 ? { none: true } : { months: Math.max(0, st) / -R.base.net1, burn: -R.base.net1 };
  R.zero = st === null ? null : { months: Math.max(0, st) / R.base.F };
  R.enough = opEnough(R);
  R.sens = opSens(R);
  R.finds = opFinds(R);
  return R;
}

/* หาค่าที่ทำให้ cond เป็นจริงพอดี (cond จริงเมื่อ x มาก) */
function bisect(cond, lo, hi) {
  if (!cond(hi)) return null;
  if (cond(lo)) return lo;
  for (var i = 0; i < 60; i++) { var mid = (lo + hi) / 2; if (cond(mid)) hi = mid; else lo = mid; }
  return hi;
}
/* ยอดขายต่อวัน (หรือต่อเดือน) ในหน่วยที่ผู้ใช้กรอก จากตัวคูณยอดขาย */
function volAt(R, mult) { return n0(R.inp.volume) * mult; }

/* ---------- เงินพอ ถ้า… (ทีละเรื่อง เรื่องอื่นเป็นไปตามที่คาด) ---------- */
function opEnough(R) {
  var inp = R.inp, op = R.op, save = num(op.savings);
  if (save === null) return null;
  var fits = function (o) { return opSim(Object.assign({ inp: inp, op: op }, o)).need <= save + 1e-6; };
  var E = { save: save, ok: R.base.need <= save + 1e-6 };
  var mv = bisect(function (x) { return fits({ mult: x }); }, 0, 20);
  E.minVol = mv === null ? null : volAt(R, mv);
  /* ยอดขายเต็มช้าได้อีกกี่เดือน */
  E.delay = null;
  if (E.ok) { var k = 0; while (k < OP_H && fits({ curve: rampDelay(R.curve, k + 1) })) k++; E.delay = k; E.fullBy = rampFull(rampDelay(R.curve, k)); E.delayCapped = k >= OP_H; }
  E.over = save - R.base.need;
  return E;
}

/* ---------- เรื่องที่ทำให้ต้องใช้เงินเพิ่ม (เรียงจากมากไปน้อยเป็นบาท) ---------- */
var SENS_DEF = { over: 15, sales: 20, delay: 3, fixed: 10, cost: 10 };
function opSens(R) {
  var inp = R.inp, op = R.op, P = Object.assign({}, SENS_DEF, op.sens || {}), B = R.base;
  var rows = [
    { k: 'over', p: P.over, o: { startupMult: 1 + P.over / 100 } },
    { k: 'sales', p: P.sales, o: { mult: Math.max(0, 1 - P.sales / 100) } },
    { k: 'delay', p: P.delay, o: { curve: rampDelay(R.curve, Math.round(P.delay)) } },
    { k: 'fixed', p: P.fixed, o: { fixedMult: 1 + P.fixed / 100 } },
    { k: 'cost', p: P.cost, o: { costMult: 1 + P.cost / 100 } }
  ];
  rows.forEach(function (x) {
    var s = opSim(Object.assign({ inp: inp, op: op }, x.o));
    x.need = s.need; x.more = s.need - B.need; x.payS = s.payS; x.left = s.left;
    x.payMore = s.payS === null ? null : B.payS === null ? null : s.payS - B.payS;
  });
  return rows.sort(function (a, b) { return b.more - a.more; });
}

/* ---------- ย้อนจากเงินที่อยากได้ ----------
   อยากได้เงินเดือนละ X (แทนเงินเดือนตัวเอง) → ยอดขายที่ทำให้กำไรต่อเดือน (หลังกันเงินซื้ออุปกรณ์ใหม่ แบบจุดคุ้มทุนของตัวคำนวณ PL2) = 0
   อยากคืนเงินที่จ่ายหมดไปภายใน N เดือน → ยอดขายที่ทำให้คืนทุนทันเดือนที่ N (คิดรวมช่วงเดือนแรก ๆ) */
function opTarget(R, income, months) {
  var inp = R.inp, op = R.op, S = R.S, out = {};
  if (income !== null && income !== undefined) {
    var need = fixedTotal(inp) - n0(inp.ownerSalary) + Math.max(0, income) + S.dep;
    out.income = R.cu > 0 ? need / R.cu / (R.perDay ? R.days : 1) : null;
  }
  if (pos(months)) {
    var mv = bisect(function (x) { var s = opSim({ inp: inp, op: op, mult: x }); return s.payS !== null && s.payS <= months; }, 0, 50);
    out.pay = mv === null ? null : volAt(R, mv);
  }
  return out;
}

/* ---------- สิ่งที่ตัวเลขบอก (เกณฑ์ที่เสนอ ⏳) · lv: high ร้ายแรง · mid ปานกลาง · watch ควรเฝ้าระวัง · note ข้อสังเกต ---------- */
var OP_LV = { high: 0, mid: 1, watch: 2, note: 3 };
function opFinds(R) {
  var F = [], B = R.base, S = R.S, inp = R.inp, op = R.op, u = U(inp, R.m), perW = R.perDay ? 'วันละ' : 'เดือนละ';
  if (B.left !== null && B.left < -0.5) {
    var neg = null; B.months.forEach(function (x) { if (neg === null && x.bal < 0) neg = x.m; });
    F.push({ id: 'short', lv: 'high', money: -B.left, ml: 'ขาดอีก', mabs: true,
      t: 'เงินที่มีไม่พอ ขาดอีก ' + fmtN(-B.left) + ' บาท', s: B.start < 0 ? 'ไม่พอจ่ายเงินก่อนเปิดร้าน' : 'เงินหมดในเดือนที่ ' + neg + ' หลังเปิดร้าน', q: ['startup_quote', 'own_buffer', 'test_first'] });
  }
  if (S.profit < -0.5) {
    var be = S.be && S.be.vol;
    F.push({ id: 'loss', lv: 'high', money: S.profit, ml: 'ขาดทุนเดือนละ', mabs: true,
      t: 'ยอดขายที่คาดไว้ยังต่ำกว่าจุดคุ้มทุน', s: be ? 'คาดไว้' + perW + ' ' + fmtN(n0(inp.volume), 1) + ' ' + u + ' · จุดคุ้มทุน' + perW + ' ' + fmtN(Math.ceil(be - 1e-9)) + ' ' + u : 'ขายเท่าไรก็ยังขาดทุน เพราะต้นทุนและค่าธรรมเนียมเกินราคาขาย', q: ['sales_basis', 'price_check'] });
  } else if (B.payS === null) {
    F.push({ id: 'nopay', lv: 'mid', money: null, t: 'เงินที่จ่ายหมดไปยังไม่คืนภายใน 5 ปี', s: 'กำไรต่อเดือนเมื่อยอดขายเต็ม ' + fmtN(S.profit) + ' บาท · เงินที่จ่ายหมดไป ' + fmtN(B.spent) + ' บาท', q: ['sales_basis', 'startup_quote'] });
  }
  if (B.left !== null && B.left >= -0.5) {
    var lowSc = R.sc.low;
    if (lowSc.left !== null && lowSc.left < -0.5) F.push({ id: 'lowshort', lv: 'watch', money: -lowSc.left, ml: 'ขาดอีก', mabs: true,
      t: 'ถ้าขายได้น้อยกว่าที่คาด ' + fmtN(R.range) + '% เงินที่มีไม่พอ', s: 'ต้องมีเงินทั้งหมด ' + fmtN(lowSc.need) + ' บาท · มี ' + fmtN(B.save) + ' บาท', q: ['sales_basis', 'own_buffer'] });
    var worst = R.sens[0];
    if (worst && worst.left !== null && worst.left < -0.5 && !(worst.k === 'sales' && Math.abs(worst.p - R.range) < 1e-9)) F.push({ id: 'sens-' + worst.k, lv: 'watch', money: worst.more, ml: 'ต้องใช้เงินเพิ่ม',
      t: SENS_TXT[worst.k](worst.p, R) + ' เงินที่มีไม่พอ', s: 'ขาดอีก ' + fmtN(-worst.left) + ' บาท', q: worst.k === 'over' ? ['startup_quote', 'own_buffer'] : ['sales_basis', 'test_first'] });
    if (B.left < B.F - 0.5) F.push({ id: 'thin', lv: 'watch', money: B.left, ml: 'เหลือช่วงตึงที่สุด',
      t: 'เงินเหลือช่วงตึงที่สุดน้อยกว่าค่าใช้จ่าย 1 เดือน', s: 'เดือนที่ ' + Math.max(1, B.lowM) + ' หลังเปิดร้าน · ค่าใช้จ่ายทุกเดือน ' + fmtN(B.F) + ' บาท', q: ['own_buffer', 'startup_quote'] });
  }
  if (n0(inp.ownerSalary) <= 0) F.push({ id: 'noown', lv: 'note', money: null, t: 'ยังไม่ได้หักเงินเดือนตัวเอง', s: 'กำไรและคืนทุนที่เห็น ยังไม่รวมเงินที่คุณใช้ใช้ชีวิตแต่ละเดือน', q: ['own_buffer'] });
  if (op.mode !== 'lump') {
    var have = {}; (op.items || []).forEach(function (it) { have[it.k] = 1; });
    var usual = (SU_USUAL[op.where] || SU_USUAL.shop).filter(function (k) { return suKinds(R.m, op.where).indexOf(k) >= 0 && !have[k]; });
    if (usual.length) F.push({ id: 'forgot', lv: 'note', money: null, t: 'ยังไม่ได้ใส่เงินที่ร้านแบบนี้มักต้องจ่ายก่อนเปิด', s: usual.map(function (k) { return suName({ k: k }, R.m); }).join(' · '), q: ['startup_quote'] });
  }
  if (S.util && S.util.pct > 100.5) F.push({ id: 'cap', lv: 'mid', money: null, t: 'ยอดขายที่คาดไว้เกินที่ร้านทำได้', s: 'ทำได้สูงสุด' + perW + ' ' + fmtN(S.util.max, 1) + ' ' + u, q: ['sales_basis'] });
  F.sort(function (a, b) { return OP_LV[a.lv] - OP_LV[b.lv] || Math.abs(b.money || 0) - Math.abs(a.money || 0); });
  return F;
}
var SENS_TXT = {
  over: function (p) { return 'ถ้าเงินก่อนเปิดร้านเกินงบ ' + fmtN(p) + '%'; },
  sales: function (p) { return 'ถ้าขายได้น้อยกว่าที่คาด ' + fmtN(p) + '%'; },
  delay: function (p, R) { return R && !R.curve.length ? 'ถ้ายอดขายค่อย ๆ ขึ้น ' + fmtN(p) + ' เดือน (ไม่เต็มตั้งแต่เดือนแรก)' : 'ถ้ายอดขายเต็มช้ากว่าที่คาด ' + fmtN(p) + ' เดือน'; },
  fixed: function (p) { return 'ถ้าค่าใช้จ่ายทุกเดือน (ไม่รวมเงินเดือนตัวเอง) เพิ่ม ' + fmtN(p) + '%'; },
  cost: function (p, R) { return 'ถ้าต้นทุนต่อ' + (R ? U(R.inp, R.m) : 'ชิ้น') + 'เพิ่ม ' + fmtN(p) + '%'; }
};

/* ---------- คำถามเช็ก → จุดที่ควรตรวจสอบ → เครื่องมือ PL1 (อ้างด้วยรหัส) · ไม่บอกวิธีแก้ ---------- */
var QB2 = {
  sales_basis: { q: 'ยอดขายที่คาดไว้ มาจากการนับลูกค้าจริงในทำเลนั้น หรือร้านแบบเดียวกันแถวนั้นไหม?', ans: { yes: 'ใช่', no: 'ไม่ใช่', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'ยอดขายที่คาดไว้', d: 'เช็กว่าตัวเลขยอดขายมาจากอะไร เช่น นับคนเดินผ่าน ดูร้านแบบเดียวกันในทำเลนั้น หรือเคยขายจริงมาก่อน', tools: ['cust8', 'ver4', 'idea7'] },
  startup_quote: { q: 'เงินก่อนเปิดร้านแต่ละรายการ มาจากใบเสนอราคาหรือราคาจริงแล้วหรือยัง?', ans: { yes: 'แล้ว', no: 'ยังไม่ได้', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'เงินก่อนเปิดร้าน', d: 'เช็กราคาจริงของแต่ละรายการ และรายการที่ร้านแบบนี้มักต้องจ่าย', tools: ['idea7', 'ver5'] },
  own_buffer: { q: 'ช่วงที่ร้านยังไม่มีกำไร คุณมีเงินใช้จ่ายส่วนตัวแยกจากเงินของร้านไหม?', ans: { yes: 'มี', no: 'ไม่มี', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'เงินใช้จ่ายส่วนตัวช่วงแรก', d: 'เช็กว่าถ้าร้านยังไม่มีกำไรหลายเดือน เงินใช้จ่ายของคุณและบ้านมาจากไหน', tools: ['idea5', 'goal4'] },
  test_first: { q: 'เคยลองขายจริงขนาดเล็กก่อนไหม เช่น ขายออนไลน์ ออกบูธ หรือรับออร์เดอร์ล่วงหน้า?', ans: { yes: 'เคย', no: 'ไม่เคย', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'ลองขายจริงก่อนลงเงินก้อนใหญ่', d: 'เช็กว่ามีคนซื้อจริงในราคานี้ก่อนจ่ายเงินก้อนใหญ่', tools: ['ver4', 'goal3', 'cust8'] },
  price_check: { q: 'ราคาที่ตั้งไว้ เคยเทียบกับร้านแบบเดียวกันแถวนั้นแล้วหรือยัง?', ans: { yes: 'เคย', no: 'ยังไม่เคย', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'ราคาเทียบกับร้านอื่น', d: 'เช็กราคาของร้านแบบเดียวกันในทำเลหรือช่องทางเดียวกัน', tools: ['grow13', 'ver1'] },
  location: { q: 'ทำเลที่เลือก เคยไปดูคนเดินผ่านช่วงเวลาที่จะเปิดร้านแล้วหรือยัง?', ans: { yes: 'แล้ว', no: 'ยังไม่ได้', unsure: 'ไม่แน่ใจ' }, risk: 'no',
    p: 'ทำเล', d: 'เช็กคนเดินผ่านในวันและเวลาที่จะเปิดจริง', tools: ['idea7', 'grow14'] }
};
function opAskList(R, where) {
  var L = [];
  (R && R.ok ? R.finds : []).forEach(function (f) { (f.q || []).forEach(function (q) { if (L.indexOf(q) < 0) L.push(q); }); });
  ['sales_basis', 'startup_quote', 'test_first'].forEach(function (q) { if (L.length < 3 && L.indexOf(q) < 0) L.push(q); });
  if (where !== 'online' && L.length < 5 && L.indexOf('location') < 0) L.push('location');
  return L.slice(0, 5);
}

/* ---------- ร้านตัวอย่าง (ค่าประมาณจาก research-thai-costs.md ข้อ 6) ---------- */
var OP_SAMPLES = {
  cafe: { m: 'unit', where: 'shop', name: 'ร้านกาแฟคีออสก์ตัวอย่าง', short: 'ร้านกาแฟคีออสก์',
    inp: { unitLabel: 'แก้ว', price: 60, unitCost: 22, feePct: 0, volume: 60, volumePer: 'day', daysOpen: 30,
      staffCount: 1, staffSalary: 13000, ownerSalary: 15000, rent: 12000, marketing: 0, otherFixed: 6000 },
    op: { where: 'shop', fit: 1, openMonth: 5, ramp: { p: 'r3' }, savings: 220000, mode: 'items', seasonAsked: 'no',
      items: [{ k: 'tools', amt: 60000, t: 'equip', y: 5 }, { k: 'cold', amt: 15000, t: 'equip', y: 5 }, { k: 'decor', amt: 40000, t: 'gone' }, { k: 'sign', amt: 5000, t: 'gone' },
        { k: 'pos', amt: 5000, t: 'equip', y: 3 }, { k: 'deposit', amt: 24000, t: 'back' }, { k: 'stock', amt: 10000, t: 'stock' }, { k: 'launch', amt: 4000, t: 'gone' }] } },
  online: { m: 'resell', where: 'online', name: 'ร้านเสื้อผ้าออนไลน์ตัวอย่าง', short: 'ร้านเสื้อผ้าออนไลน์',
    inp: { unitLabel: 'ตัว', price: 290, unitCost: 130, feePct: 20.33, volume: 120, volumePer: 'month',
      staffCount: 0, ownerSalary: 5000, rent: 0, marketing: 3000, otherFixed: 1100 },
    op: { where: 'online', fit: 1, openMonth: 5, ramp: { p: 'r6' }, savings: 40000, mode: 'items', seasonAsked: 'no',
      items: [{ k: 'stock', amt: 19500, t: 'stock' }, { k: 'pack', amt: 1000, t: 'stock' }, { k: 'photo', amt: 2500, t: 'equip', y: 3 }, { k: 'printer', amt: 2000, t: 'equip', y: 3 },
        { k: 'tools', amt: 1500, t: 'equip', y: 5 }, { k: 'launch', amt: 3500, t: 'gone' }] } },
  salon: { m: 'service', where: 'shop', name: 'ร้านทำผม 2 เก้าอี้ตัวอย่าง', short: 'ร้านทำผม',
    inp: { unitLabel: 'คน', price: 350, unitCost: 105, feePct: 0, volume: 10, volumePer: 'day', daysOpen: 26,
      staffCount: 0, ownerSalary: 15000, rent: 10000, marketing: 0, otherFixed: 9000 },
    op: { where: 'shop', fit: 1, openMonth: 5, ramp: { p: 'r3' }, savings: 230000, mode: 'items', seasonAsked: 'no',
      items: [{ k: 'deposit', amt: 20000, t: 'back' }, { k: 'decor', amt: 50000, t: 'gone' }, { k: 'furn', amt: 20000, t: 'equip', y: 5 }, { k: 'tools', amt: 41000, t: 'equip', y: 4 },
        { k: 'other', name: 'ของชิ้นเล็ก ผ้าขนหนู', amt: 10000, t: 'gone' }, { k: 'stock', amt: 25000, t: 'stock' }, { k: 'launch', amt: 10000, t: 'gone' }, { k: 'pos', amt: 4000, t: 'equip', y: 3 }] } }
};
function opSample(k) {
  var S = OP_SAMPLES[k], op = JSON.parse(JSON.stringify(S.op)), inp = JSON.parse(JSON.stringify(S.inp));
  op.items.forEach(function (it, i) { it.id = 's' + i; });
  inp.season = { high: [], low: [], highPct: 0, lowPct: 0 };
  inp.advMode = 'no';
  var e = suEquip(op);
  if (e) { inp.advMode = 'yes'; inp.advPick = ['adv-equip']; inp.equipValue = e.value; inp.equipYears = e.years; }
  inp.cash = op.savings - suTotals(op, inp).all;
  return { m: S.m, where: S.where, inp: inp, op: op };
}
