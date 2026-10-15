/* ตัวเลขสุ่มและตัวเลขแปลก: ทุกรูปแบบ × ทุกเรื่อง ต้องไม่พัง และไม่มี NaN / Infinity ในตัวเลขที่ขึ้นจอ · รัน: node tests/fuzz.js */
const { load, genDec, sampleInp } = require('./cases');
const vm = require('vm');
const ctx = load();
const R = (c) => vm.runInContext(c, ctx);
let seed = 12345;
function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
function pick(a) { return a[Math.floor(rnd() * a.length)]; }
function wild(v) {
  const r = rnd();
  if (r < 0.12) return 0;
  if (r < 0.18) return null;
  if (r < 0.24) return v * 1000;
  if (r < 0.3) return v / 1000;
  return v * (0.2 + rnd() * 2);
}
const models = R('MODEL_ORDER'), topics = R('TOPIC_ORDER');
let bad = 0, runs = 0, okRuns = 0;
function scan(o, where) {
  const seen = new Set();
  (function walk(x, p) {
    if (x === null || x === undefined) return;
    if (typeof x === 'number') { if (!isFinite(x)) throw new Error('non-finite at ' + where + p); return; }
    if (typeof x !== 'object' || seen.has(x)) return;
    seen.add(x);
    for (const k of Object.keys(x)) { if (k === 'B' || k === 'st' || k === 'r') continue; walk(x[k], p + '.' + k); }
  })(o, '');
}
for (let i = 0; i < 1400; i++) {
  const m = pick(models);
  const inp = sampleInp(ctx, m);
  for (const k of Object.keys(inp)) if (typeof inp[k] === 'number' && rnd() < 0.35) inp[k] = wild(inp[k]);
  if (rnd() < 0.2) inp.growth = pick([-5, -2, 3, 10]);
  if (rnd() < 0.15) inp.season = { high: [11, 12], low: [6, 7], highPct: 40, lowPct: 50 };
  if (rnd() < 0.15) inp.creditDays = pick([15, 45, 90]);
  const T = pick(topics);
  ctx.__t = T; ctx.__m = m;
  if (!R('topicOk(__t, __m)')) continue;
  const d = genDec(ctx, T, inp, m, Math.floor(rnd() * 5));
  for (const k of Object.keys(d)) if (typeof d[k] === 'number' && rnd() < 0.35) d[k] = wild(d[k]);
  if (T === 'equip' && rnd() < 0.2) d.fixedChg = -1e9;
  if (T === 'channel' && rnd() < 0.2) d.cut = pick([0, 99, 100, 150]);
  if (T === 'place' && rnd() < 0.2) d.salesPct = pick([-100, -95, 400]);
  if (T === 'place' && rnd() < 0.3) d.closedDays = pick([26, 30, 60]);
  if (T === 'price' && rnd() < 0.3) d.lostPct = pick([0, 95, 100]);
  if (T === 'promo' && rnd() < 0.3) { d.discPct = pick([0, 90, 100]); d.lift = pick([0, 1000]); d.promoMonths = pick([1, 6, 12]); }
  if (T === 'supplier' && rnd() < 0.3) { d.newCost = pick([0, 1e6]); d.supSales = pick([-90, -100, 500]); }
  if (T === 'freeship' && rnd() < 0.3) { d.perOrder = pick([0, 1, 50]); d.shipLift = pick([0, 1000]); }
  if (T === 'newprod' && rnd() < 0.3) { d.npAttach = pick([0, 100, 150]); d.npCanni = pick([0, 100]); }
  if (T === 'channel' && rnd() < 0.2) { d.movePct = 100; d.chQty = inp.volume || inp[R('ROLE["' + m + '"].vol')] || 1; }
  ctx.__x = { inp, m, T, d };
  runs++;
  try {
    const E = R('dEval(__x.inp,__x.m,__x.T,__x.d)');
    if (!E.ok) { if (R('steady(__x.inp,__x.m,__x.T,__x.d).r.projection.length') === 12 && R('compute(__x.inp,__x.m).ok')) throw new Error('not ok although inputs complete'); continue; }
    okRuns++;
    const C = R('dConds(dEval(__x.inp,__x.m,__x.T,__x.d),__x.inp,__x.m,__x.T,__x.d)');
    const S = R('dScenarios(__x.inp,__x.m,__x.T,__x.d)');
    scan({ profit: E.profit, delta: E.delta, low: E.low, need: E.need, payback: E.payback, rows: E.rows, ledger: E.ledger, conds: C, scen: S, extra: E.extraSteady }, m + '/' + T);
    /* ✓ ต้องเป็นจริงเสมอ: ตัวเลขที่แสดงเทียบกันตรง · ✓ จุดคุ้ม = กำไรไม่ลด · ✓ คืนทุน 3 ปี = คืนทุนภายใน 36 เดือนจริง */
    for (const c of C) {
      if ((c.id !== 'need' && c.id !== 'payneed') || c.value === null || c.haveShown === undefined) continue;
      const atLeast = /อย่างน้อย/.test(c.label);
      const over = /เกินกำลัง/.test(c.sub || '');
      if ((c.status === 'ok') !== (!over && (atLeast ? c.haveShown >= c.value - 1e-9 : c.haveShown <= c.value + 1e-9))) throw new Error(c.id + ' status vs shown ' + c.haveShown + '/' + c.value);
      if (c.id === 'need' && atLeast && c.status === 'ok' && E.delta < -1) throw new Error('need ✓ while profit falls ' + E.delta);
      if (c.id === 'payneed' && c.status === 'ok' && !(E.payback !== null && E.payback <= 36 + 1e-6)) throw new Error('payneed ✓ but payback ' + E.payback);
    }
    const sum = E.ledger.reduce((a, l) => a + l.amount, 0);
    if (E.ledger.length && Math.abs(sum - E.delta) > 0.05) throw new Error('ledger ' + sum + ' vs ' + E.delta);
  } catch (e) { bad++; if (bad < 8) console.log('FAIL', m, T, e.message, JSON.stringify(d)); }
}
console.log(`${runs} runs · ${okRuns} computed · ${bad} problems`);
console.log(bad ? 'FUZZ FAILED' : 'FUZZ OK');
process.exit(bad ? 1 : 0);
