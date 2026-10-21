/* ตัวเลขสุ่มและตัวเลขแปลก: ร้านสุ่ม (สินค้า 1–12 × ช่องทาง 1–6) ต้องไม่พัง ไม่มี NaN / Infinity
   · ทุกช่องคิดซ้ำด้วยสูตรตรง ๆ ในไฟล์นี้ต้องได้เท่ากัน · ยอดรวมทุกทางเท่ากัน · กำไรตรงกับตัวคำนวณ PL2 และตัวที่ 1
   · สิ่งที่ตัวเลขบอกเรียงตามความหนัก · จับเวลา 12 สินค้า × 6 ช่องทาง
   รัน: ./build.sh แล้ว node tests/fuzz.js */
const { load } = require('./cases');
const vm = require('vm');
const ctx = load();
const X = (c) => vm.runInContext(c, ctx);
let seed = 20261021;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
const pick = (a) => a[Math.floor(rnd() * a.length)];
const rint = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const r2 = (x) => Math.round(x * 100) / 100;
const MODELS_ = X('PC_MODELS.slice()');
const KINDS = {}; for (const m of MODELS_) KINDS[m] = X(`chKindsFor('${m}')`);
const QB4 = JSON.parse(X('JSON.stringify(QB4)'));
const LV = { high: 0, mid: 1, watch: 2, note: 3 };
const KNOWN = new Set(['loss', 'chshort', 'cheat', 'gap', 'chlow', 'conc', 'forgot']);
const BAD_WORDS = ['ควร', 'เลิก', 'ตัด', 'ต้อง'];
const sum = (a, f) => a.reduce((s, x) => s + f(x), 0);

/* เรียกในบริบทของหน้าเว็บ: ส่งข้อมูลเป็น JSON แต่รับผลเป็นวัตถุจริง (JSON จะเปลี่ยน NaN เป็น null จนมองไม่เห็น) */
function run(fnName, ...args) { ctx.__s = JSON.stringify(args); return X(fnName + '.apply(null, JSON.parse(__s))'); }

/* ---------- ตัวสุ่ม ---------- */
function money() { const r = rnd(); return r < 0.15 ? r2(0.01 + rnd()) : r < 0.25 ? r2(1e4 + rnd() * 1e7) : r2(5 + rnd() * 2000); }
function genItem(i) {
  const price = money();
  let r = rnd();
  const cost = r < 0.15 ? 0 : r < 0.3 ? r2(price * (1 + rnd())) : r2(price * rnd() * 0.9);
  r = rnd();
  const qty = r < 0.1 ? r2(0.01 + rnd()) : r < 0.2 ? rint(1000, 100000) : r < 0.3 ? r2(1 + rnd() * 50) : rint(1, 300);
  return { id: 'p' + i, name: 'สินค้า ' + i, unit: pick(['ชิ้น', 'แก้ว', 'ครั้ง', '']), price, cost, qty };
}
function genChannel(kind, j) {
  const c = { id: 'c' + j, kind, share: 0, fee: 0, vat: pick(['in', 'ex']), disc: 0, perOrder: 0, ipo: 1, monthly: 0, off: {} };
  if (kind === 'other') c.name = 'ช่องทาง ' + j;
  if (kind === 'shop' && rnd() < 0.3) { c.priceMode = pick(['up', 'down']); c.markup = rint(1, 90); }
  if (kind !== 'shop') {
    c.priceMode = pick(['same', 'same', 'up', 'down']);
    if (c.priceMode === 'up') c.markup = rnd() < 0.1 ? 200 : r2(0.5 + rnd() * 60);
    if (c.priceMode === 'down') c.markup = rnd() < 0.1 ? 99 : rint(1, 60);
  }
  let r = rnd();
  c.fee = r < 0.05 ? 99 : r < 0.3 ? 0 : r2(rnd() * 60);
  r = rnd();
  c.disc = r < 0.05 ? 99 : r < 0.5 ? 0 : r2(rnd() * 80);
  if (rnd() < 0.6) { c.perOrder = r2(rnd() * 100) || 1; c.ipo = rnd() < 0.5 ? rint(1, 5) : r2(1 + rnd() * 4); }
  else c.ipo = pick([1, 3, '', 5]);
  r = rnd();
  c.monthly = r < 0.5 ? 0 : r < 0.6 ? rint(1e6, 1e8) : r2(rnd() * 20000);
  return c;
}
function genShop() {
  const m = pick(MODELS_);
  const items = Array.from({ length: rint(1, 12) }, (_, i) => genItem(i + 1));
  const chs = Array.from({ length: rint(1, 6) }, (_, j) => genChannel(pick(KINDS[m]), j + 1));
  if (chs.length > 1) {
    const w = chs.map(() => 1 + rnd() * 99), W = sum(w, (x) => x);
    chs.forEach((c, j) => { c.share = r2(w[j] / W * 100); });
    let fix = r2(100 - sum(chs, (c) => c.share));
    chs[chs.length - 1].share = r2(chs[chs.length - 1].share + fix);
    if (chs[chs.length - 1].share <= 0) { chs.forEach((c) => { c.share = r2(100 / chs.length); }); }
    /* ปิดบางสินค้าในบางช่องทาง แต่ไม่ปิดครบทุกช่องทาง และทุกช่องทางยังมีสินค้าอย่างน้อย 1 ตัว */
    for (const p of items) for (const c of chs) if (rnd() < 0.25) c.off[p.id] = true;
    for (const p of items) if (chs.every((c) => c.off[p.id])) delete pick(chs).off[p.id];
    for (const c of chs) if (items.every((p) => c.off[p.id])) delete c.off[pick(items).id];
  } else chs[0].share = pick([100, '', 37, 0]);
  const big = () => rint(1e8, 1e9);
  const fx = () => { const r = rnd(); return r < 0.25 ? 0 : r < 0.32 ? big() : r2(rnd() * 50000); };
  const inp = { volumePer: pick(['day', 'month']), daysOpen: rint(1, 31), staffCount: rnd() < 0.3 ? 0 : rint(1, 10), ownerSalary: fx(), rent: fx(), marketing: fx(), otherFixed: fx(), cash: fx() };
  inp.staffSalary = inp.staffCount ? (rnd() < 0.05 ? big() : rint(5000, 30000)) : pick([0, '']);
  if (inp.volumePer === 'month' && rnd() < 0.5) inp.daysOpen = '';
  if (rnd() < 0.3) inp.chMkt = r2(rnd() * 2 * (inp.marketing || 1000));
  if (rnd() < 0.3) { inp.equipValue = rint(1000, 1e6); inp.equipYears = rint(1, 10); }
  if (rnd() < 0.2) inp.growth = pick([-5, 3, 10]);
  if (rnd() < 0.15) { inp.creditDays = pick([15, 30]); inp.stockDays = pick([0, 45]); }
  const rest = rnd() < 0.4 ? { on: true, sales: rnd() < 0.1 ? r2(0.01 + rnd()) : r2(10 + rnd() * 1e5), costPct: r2(rnd() * 99) } : { on: false };
  return { m, pc: { items, channels: chs, rest }, inp };
}

/* ---------- สูตรตรง ๆ (ตามที่ตกลงไว้) ใช้เทียบกับหน้าเว็บ ---------- */
const nv = (v) => { const x = typeof v === 'number' ? v : parseFloat(String(v === undefined || v === null ? '' : v).replace(/[,\s]/g, '')); return isFinite(x) ? x : 0; };
function oracle(pc, inp) {
  const Number = nv;
  const mult = inp.volumePer === 'month' ? 1 : (Number(inp.daysOpen) > 0 ? Number(inp.daysOpen) : 30);
  const rows = pc.items.map((p) => ({ id: p.id, price: Number(p.price), cost: Number(p.cost), units: Number(p.qty) * mult }));
  if (pc.rest.on === true && Number(pc.rest.sales) > 0) {
    const u0 = sum(rows, (r) => r.units), avg = u0 > 0 ? sum(rows, (r) => r.price * r.units) / u0 : 100;
    rows.push({ id: '_rest', price: avg, cost: avg * Number(pc.rest.costPct) / 100, units: Number(pc.rest.sales) * mult / avg });
  }
  const chs = pc.channels, many = chs.length > 1, cells = [];
  rows.forEach((p, i) => {
    let on = chs.map((c, j) => j).filter((j) => p.id === '_rest' || !(chs[j].off && chs[j].off[p.id]));
    const tot = sum(on, (j) => Number(chs[j].share) || 0);
    on.forEach((j) => {
      const c = chs[j], mk = Number(c.markup) || 0;
      const list = c.kind === 'shop' || !c.priceMode || c.priceMode === 'same' ? p.price : c.priceMode === 'up' ? p.price * (1 + mk / 100) : p.price * (1 - mk / 100);
      const net = list * (1 - (Number(c.disc) || 0) / 100);
      const f = (Number(c.fee) || 0) / 100;
      const fee = net * f * (c.vat === 'ex' && f > 0 ? 1.07 : 1);
      const pack = Number(c.perOrder) > 0 ? Number(c.perOrder) / Math.max(1, Number(c.ipo) || 1) : 0;
      const units = p.units * (many ? (Number(c.share) || 0) / tot : 1);
      cells.push({ i, j, units, list, net, fee, pack, left: net - fee - p.cost - pack });
    });
  });
  const fixed = (Number(inp.staffCount) || 0) * (Number(inp.staffSalary) || 0) + (Number(inp.ownerSalary) || 0) + (Number(inp.rent) || 0)
    + (Number(inp.marketing) || 0) + (Number(inp.otherFixed) || 0) - Math.min(Number(inp.chMkt) || 0, Number(inp.marketing) || 0);
  const dep = Number(inp.equipValue) > 0 && Number(inp.equipYears) > 0 ? Math.round(inp.equipValue / (inp.equipYears * 12) * 100) / 100 : 0;
  return { rows, cells, fixed, dep, chMonthly: sum(chs, (c) => Number(c.monthly) || 0) };
}

/* ---------- ตัวตรวจ ---------- */
let bad = 0, runs = 0;
const STATS = {};
const probs = [];
function fail(tag, msg, data) { bad++; if (probs.length < 12) probs.push(tag + ': ' + msg + (data ? ' · ' + JSON.stringify(data).slice(0, 600) : '')); }
function nonFinite(o) {
  const seen = new Set(), out = [];
  (function walk(x, p) {
    if (x === null || x === undefined) return;
    if (typeof x === 'number') { if (!isFinite(x)) out.push(p + '=' + x); return; }
    if (typeof x !== 'object' || seen.has(x)) return;
    seen.add(x);
    for (const k of Object.keys(x)) walk(x[k], p + '.' + k);
  })(o, 'R');
  return out;
}
const close = (a, b, tol) => typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= tol;

function checkShop(S, tag) {
  const { m, pc, inp } = S;
  let R;
  try { R = run('pcCompute', pc, inp, m); } catch (e) { fail(tag, 'exception ' + e.message, S); return; }
  if (!R || !R.ok) { fail(tag, 'not ok for complete inputs', S); return; }
  const nf = nonFinite(R);
  if (nf.length) fail(tag, 'non-finite ' + nf.slice(0, 5).join(' '), S);
  const O = oracle(pc, inp);
  const n = R.cells.length;
  const scale = Math.max(1, Math.abs(R.rev), sum(R.cells, (x) => Math.abs(x.leftM)) + sum(R.cells, (x) => Math.abs(x.feeM) + Math.abs(x.costM) + Math.abs(x.packM)), R.fixed + R.chMonthly + R.dep);
  const tol = 1e-4 * scale, tolV4 = tol + 0.02 * n + 0.02;
  /* ทุกช่องตรงกับสูตรตรง ๆ */
  if (n !== O.cells.length) fail(tag, 'cell count ' + n + ' vs ' + O.cells.length);
  else for (let k = 0; k < n; k++) {
    const a = R.cells[k], b = O.cells[k];
    const t = 1e-9 * Math.max(1, Math.abs(b.list), Math.abs(b.net) + Math.abs(b.fee) + Math.abs(O.rows[b.i].cost) + b.pack);
    /* ฤดูกาล/การเติบโต: จำนวนของทุกคู่ปรับด้วยอัตราเดียวกัน (R.season) ให้รวมแล้วเท่ากำไรเฉลี่ยของตัวคำนวณ */
    if (a.i !== b.i || a.j !== b.j || !close(a.units, b.units * (R.season || 1), 1e-9 * Math.max(1, b.units)) || !close(a.list, b.list, t) || !close(a.net, b.net, t) || !close(a.fee, b.fee, t) || !close(a.pack, b.pack, t) || !close(a.left, b.left, t)) {
      fail(tag, 'cell ' + k + ' differs from formula', { got: a, want: b }); break;
    }
  }
  /* ยอดรวมทุกทางเท่ากัน */
  const ids = [
    ['Σprod.left', sum(R.prods, (p) => p.left), R.left, tol], ['Σchan.left', sum(R.chans, (c) => c.left), R.left, tol],
    ['Σcell.rev', sum(R.cells, (x) => x.rev), R.rev, tol], ['Σprod.rev', sum(R.prods, (p) => p.rev), R.rev, tol], ['Σchan.rev', sum(R.chans, (c) => c.rev), R.rev, tol],
    ['Σchan.after', sum(R.chans, (c) => c.after), R.left - R.chMonthly, tol],
    ['rev=v4', R.rev, R.r.revenueMonthly, tolV4], ['left−fixed−ch−dep=profit', R.left - R.fixed - R.chMonthly - R.dep, R.profit, tolV4],
    ['fixed', R.fixed, O.fixed, 1e-6 * Math.max(1, O.fixed)], ['dep', R.dep, O.dep, 1e-9], ['chMonthly', R.chMonthly, O.chMonthly, 1e-9]];
  for (const [k, a, b, t] of ids) if (!close(a, b, t)) fail(tag, 'identity ' + k + ' ' + a + ' vs ' + b + ' (tol ' + t + ')', S);
  if (R.profit !== R.r.netProfitMonthly) fail(tag, 'R.profit ≠ v4 netProfitMonthly');
  /* ตัวที่ 1 ได้กำไรเท่ากัน */
  const agg = run('pcAggregate', pc, inp, m);
  const C = agg && run('compute', agg, m);
  if (!C || !C.ok) fail(tag, 'tool 1 cannot compute aggregated numbers', { agg });
  else if (!close(C.profit, R.profit, tolV4 + 0.05)) fail(tag, 'tool 1 profit ' + C.profit + ' vs tool 4 ' + R.profit, S);
  /* สิ่งที่ตัวเลขบอก */
  const F = R.finds;
  for (let k = 0; k < F.length; k++) {
    const f = F[k];
    if (!KNOWN.has(f.kind || f.id)) fail(tag, 'unknown finding ' + f.id);
    if (!(f.money === null || (typeof f.money === 'number' && isFinite(f.money)))) fail(tag, 'finding money ' + f.id + ' = ' + f.money);
    if (typeof f.t !== 'string' || !f.t.trim()) fail(tag, 'finding without text ' + f.id);
    if (!(f.lv in LV)) fail(tag, 'finding level ' + f.lv);
    if ((f.q || []).some((q) => !QB4[q])) fail(tag, 'finding question not in QB4 ' + f.id);
    for (const w of BAD_WORDS) if ((f.t + ' ' + f.s).indexOf(w) >= 0) fail(tag, 'advice word ' + w + ' in ' + f.id + ': ' + f.t + ' / ' + f.s);
    if (/undefined|NaN|null|Infinity/.test(f.t + f.s)) fail(tag, 'broken text in ' + f.id + ': ' + f.t + ' / ' + f.s);
    if (k > 0) {
      const a = F[k - 1];
      if (!(LV[a.lv] < LV[f.lv] || (LV[a.lv] === LV[f.lv] && Math.abs(a.money || 0) >= Math.abs(f.money || 0)))) fail(tag, 'finds not sorted ' + a.id + ' > ' + f.id);
    }
  }
  /* ขาดทุนทุกชิ้น และค่าใช้จ่ายของช่องทาง: เทียบกับเกณฑ์ */
  const neg = R.cells.filter((x) => x.left < -0.005 && x.units > 0);
  const loss = F.filter((f) => f.id === 'loss');
  if ((neg.length > 0) !== (loss.length === 1)) fail(tag, 'loss finding presence ' + neg.length + ' / ' + loss.length);
  else if (neg.length && !close(loss[0].money, sum(neg, (x) => x.leftM), tol)) fail(tag, 'loss money');
  const shortCh = R.chans.filter((c) => c.monthly > 0.5 && c.after < -0.5).map((c) => c.j).join();
  if (shortCh !== F.filter((f) => f.kind === 'chshort').map((f) => f.ch).sort((a, b) => a - b).join()) fail(tag, 'chshort set');
  /* เกณฑ์ข้ออื่น: คิดชุดที่ควรขึ้นจากยอดรวมทีละสินค้าและทีละช่องทาง แล้วเทียบ id */
  const want = new Set(neg.length ? ['loss'] : []);
  const G = X('(function(){var o={};Object.keys(CH_KINDS).forEach(function(k){o[k]=CH_KINDS[k].g;});return JSON.stringify(o);})()');
  const grp = JSON.parse(G);
  R.chans.forEach((c) => {
    if (c.monthly > 0.5 && c.after < -0.5) want.add('chshort-' + c.j);
    else if (c.monthly > 0.5 && c.left > 0 && c.monthly > c.left * 0.5) want.add('cheat-' + c.j);
    const g = grp[c.c.kind] || 'other';
    /* ร้านบริการไม่มีค่าแพ็กและค่าส่ง จึงเตือนเฉพาะค่าธรรมเนียม */
    if (((g === 'app' || g === 'mkt') && nv(c.c.fee) === 0) || (m !== 'service' && (g === 'app' || g === 'mkt' || g === 'direct') && nv(c.c.perOrder) === 0)) want.add('forgot-' + c.j);
  });
  const per100 = R.rev > 0 ? R.left / R.rev * 100 : 0;
  if (R.prods.length > 1 && R.left > 0) R.prods.forEach((p) => {
    if (p.rest) return;
    const rs = R.rev > 0 ? p.rev / R.rev * 100 : 0, ls = p.left / R.left * 100, p100 = p.rev > 0 ? p.left / p.rev * 100 : 0;
    if (rs >= 10 && ls < rs * 0.75 && p.rev * (per100 - p100) / 100 >= 1) want.add('gap-' + p.i);
    if (ls > 50) want.add('conc-' + p.i);
  });
  if (R.chans.length > 1) {
    let best = null;
    R.chans.forEach((c) => { const v = c.rev > 0 ? c.left / c.rev * 100 : 0; if (c.rev > 0 && (!best || v > best.v)) best = { j: c.j, v }; });
    if (best && best.v > 0) R.chans.forEach((c) => { const v = c.rev > 0 ? c.left / c.rev * 100 : 0; if (c.j !== best.j && c.rev > 0 && v < best.v * 0.5) want.add('chlow-' + c.j); });
  }
  const got = new Set(F.map((f) => f.id));
  const miss = [...want].filter((x) => !got.has(x)), extra = [...got].filter((x) => !want.has(x));
  if (miss.length || extra.length) fail(tag, 'findings differ from rules: missing ' + miss.join(',') + ' extra ' + extra.join(','), S);
  F.forEach((f) => { STATS[f.kind || f.id] = (STATS[f.kind || f.id] || 0) + 1; });
  /* ราคาที่ทำให้เหลือเงินเท่าที่เห็น = ราคาที่ใช้อยู่ (listPriceFor กลับทางได้) */
  for (const x of R.cells.slice(0, 3)) {
    const L = run('listPriceFor', R.chs[x.j], x.cost, x.left);
    const k = (1 - nv(R.chs[x.j].disc) / 100) * (1 - x.fee / (x.net || 1));
    if (k > 1e-6 && x.net > 0 && !close(L, x.list, 1e-6 * Math.max(1, x.list, Math.abs(x.left) + x.cost + x.pack))) { fail(tag, 'listPriceFor round trip ' + L + ' vs ' + x.list); break; }
  }
  const A = run('pcAskList', R);
  if (!(A.length >= 1 && A.length <= 5 && new Set(A).size === A.length && A.every((q) => QB4[q]))) fail(tag, 'ask list ' + JSON.stringify(A));
  return R;
}

/* ---------- 1) ร้านสุ่ม ---------- */
const N = 900;
let invalid = 0;
for (let i = 0; i < N; i++) {
  const S = genShop();
  runs++;
  let okSteps;
  try { okSteps = run('itemsStepOk', S.pc, S.inp) && run('channelsStepOk', S.pc) && run('fixedOk', S.inp); } catch (e) { fail('rand' + i, 'validation exception ' + e.message); continue; }
  if (!okSteps) { invalid++; fail('rand' + i, 'generated complete inputs rejected by validation', S); continue; }
  checkShop(S, 'rand' + i + '/' + S.m);
}

/* ---------- 2) กรณีขอบ ---------- */
const INP = { volumePer: 'month', daysOpen: 30, staffCount: 0, ownerSalary: 0, rent: 0, marketing: 0, otherFixed: 0, cash: 0 };
const it = (o) => Object.assign({ id: 'a', name: 'สินค้า', unit: 'ชิ้น', price: 100, cost: 40, qty: 10 }, o);
const ch = (o) => Object.assign({ id: 'c1', kind: 'grab', share: 100, priceMode: 'same', fee: 30, vat: 'ex', disc: 0, perOrder: 0, ipo: 1, monthly: 0 }, o);
const one = (item, chan, inp, m) => ({ m: m || 'unit', pc: { items: [item], channels: [chan], rest: { on: false } }, inp: Object.assign({}, INP, inp || {}) });
function edge(tag, S, expectValid, extra) {
  runs++;
  let valid;
  try { valid = run('itemsStepOk', S.pc, S.inp) && run('channelsStepOk', S.pc) && run('fixedOk', S.inp); } catch (e) { fail(tag, 'validation exception ' + e.message); return; }
  if (valid !== expectValid) { fail(tag, 'validation ' + valid + ', expected ' + expectValid); }
  if (expectValid) { const R = checkShop(S, tag); if (R && extra) extra(R); return; }
  try {
    const R = run('pcCompute', S.pc, S.inp, S.m);
    if (R && R.ok) { const nf = nonFinite(R); if (nf.length) fail(tag, 'non-finite ' + nf.slice(0, 5).join(' ')); }
  } catch (e) { fail(tag, 'exception ' + e.message); }
}
const hasLoss = (R) => R.finds.some((f) => f.id === 'loss');
edge('zero qty', one(it({ qty: 0 }), ch()), false);
edge('price 0', one(it({ price: 0 }), ch()), false);
edge('qty empty', one(it({ qty: '' }), ch()), false);
edge('cost > price', one(it({ cost: 150 }), ch()), true, (R) => { if (!hasLoss(R)) fail('cost > price', 'no loss finding'); });
edge('fee 99', one(it({}), ch({ fee: 99, vat: 'in' })), true, (R) => { if (!hasLoss(R)) fail('fee 99', 'no loss finding'); });
edge('fee 99 ex VAT', one(it({}), ch({ fee: 99, vat: 'ex' })), true, (R) => { if (run('listPriceFor', ch({ fee: 99, vat: 'ex' }), 40, 10) !== null) fail('fee 99 ex VAT', 'list price should be impossible'); });
edge('fee 100', one(it({}), ch({ fee: 100, vat: 'in' })), false);
edge('disc 99', one(it({}), ch({ disc: 99 })), true, (R) => { if (!close(R.cells[0].net, 1, 1e-9)) fail('disc 99', 'net ' + R.cells[0].net); });
edge('markup down 99', one(it({}), ch({ priceMode: 'down', markup: 99, fee: 0 })), true, (R) => { if (!close(R.cells[0].list, 1, 1e-9)) fail('markup down 99', 'list ' + R.cells[0].list); });
edge('markup down 100', one(it({}), ch({ priceMode: 'down', markup: 100, fee: 0 })), false);
edge('markup up 1000', one(it({}), ch({ priceMode: 'up', markup: 1000 })), true);
edge('tiny price × tiny qty', one(it({ price: 0.01, cost: 0, qty: 0.01 }), ch({ fee: 0 })), true);
edge('huge price × huge qty per day', one(it({ price: 1e7, cost: 9e6, qty: 1e5 }), ch({ fee: 5 }), { volumePer: 'day', daysOpen: 31 }), true);
edge('huge fixed costs', one(it({}), ch(), { rent: 1e9, ownerSalary: 1e9, staffCount: 10, staffSalary: 1e8 }), true, (R) => { if (!(R.profit < -1e9)) fail('huge fixed', 'profit ' + R.profit); });
edge('price with comma', one(it({ price: '1,200', qty: '1,000' }), ch()), true);
edge('ipo 0 with pack', one(it({}), ch({ perOrder: 10, ipo: 0 })), false);
edge('fee 30 VAT not answered', one(it({}), ch({ vat: undefined })), false);
edge('no channels', { m: 'unit', pc: { items: [it({})], channels: [], rest: { on: false } }, inp: INP }, false);
edge('no items, rest only', { m: 'unit', pc: { items: [], channels: [ch()], rest: { on: true, sales: 1000, costPct: 30 } }, inp: INP }, false);
edge('all shares 0', { m: 'unit', pc: { items: [it({})], channels: [ch({ share: 0 }), ch({ id: 'c2', kind: 'shop', share: 0 })], rest: { on: false } }, inp: INP }, false);
edge('item off everywhere', { m: 'unit', pc: { items: [it({}), it({ id: 'b' })], channels: [ch({ share: 50, off: { a: true } }), ch({ id: 'c2', kind: 'shop', share: 50, off: { a: true } })], rest: { on: false } }, inp: INP }, false);
edge('rest on, all items off on a channel', { m: 'unit', pc: { items: [it({})], channels: [ch({ share: 50, off: { a: true } }), ch({ id: 'c2', kind: 'shop', share: 50 })], rest: { on: true, sales: 500, costPct: 30 } }, inp: INP }, false);
edge('service on booking app', one(it({ unit: 'ครั้ง' }), ch({ kind: 'bookapp', fee: 10, vat: 'in' }), { volumePer: 'day', daysOpen: 26 }, 'service'), true);
edge('resell rest only tiny sales', { m: 'resell', pc: { items: [it({ price: 0.05, cost: 0.01, qty: 1 })], channels: [ch({ kind: 'shopee' })], rest: { on: true, sales: 0.01, costPct: 99 } }, inp: INP }, true);

/* ---------- 3) จับเวลา 12 สินค้า × 6 ช่องทาง ---------- */
function timing(withRest) {
  const items = Array.from({ length: 12 }, (_, i) => ({ id: 'p' + i, name: 'สินค้า ' + i, unit: 'ชิ้น', price: 50 + i * 10, cost: 20 + i * 3, qty: 10 + i }));
  const kinds = ['shop', 'grab', 'lineman', 'shopee', 'social', 'wholesale'];
  const channels = kinds.map((k, j) => ({ id: 'c' + j, kind: k, share: [40, 15, 10, 15, 10, 10][j], priceMode: k === 'wholesale' ? 'down' : k === 'grab' ? 'up' : 'same', markup: 15, fee: k === 'shop' ? 0 : 20, vat: 'ex', disc: 5, perOrder: 8, ipo: 1.5, monthly: 500, off: j === 5 ? { p0: true } : {} }));
  ctx.__T = { pc: { items, channels, rest: withRest ? { on: true, sales: 2000, costPct: 40 } : { on: false } }, inp: Object.assign({}, INP, { volumePer: 'day', daysOpen: 26, rent: 15000 }) };
  X('pcCompute(__T.pc, __T.inp, "unit")');
  const ts = [];
  for (let k = 0; k < 300; k++) { const t0 = process.hrtime.bigint(); X('pcCompute(__T.pc, __T.inp, "unit")'); ts.push(Number(process.hrtime.bigint() - t0) / 1e6); }
  ts.sort((a, b) => a - b);
  return { median: ts[150], p95: ts[285], streams: X('pcCompute(__T.pc, __T.inp, "unit").cells.length') };
}
const t1 = timing(false), t2 = timing(true);

probs.forEach((p) => console.log('  FAIL', p));
console.log('findings seen: ' + Object.entries(STATS).map(([k, v]) => k + ' ' + v).join(' · '));
console.log(`${runs} runs (${N} random shops) · ${invalid} rejected by validation · ${bad} problems`);
console.log(`timing pcCompute 12 items × 6 channels (${t1.streams} streams): median ${t1.median.toFixed(2)} ms · p95 ${t1.p95.toFixed(2)} ms`);
console.log(`timing pcCompute 12 items + other items × 6 channels (${t2.streams} streams): median ${t2.median.toFixed(2)} ms · p95 ${t2.p95.toFixed(2)} ms`);
console.log(bad ? 'FUZZ FAILED' : 'FUZZ OK');
process.exit(bad ? 1 : 0);
