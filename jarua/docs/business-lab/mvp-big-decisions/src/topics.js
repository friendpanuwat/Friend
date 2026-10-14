/* ============================================================
   TOPICS — 5 เรื่องใหญ่ที่เจ้าของร้านกำลังคิด · คำถามของแต่ละเรื่อง · คลังคำถามเช็กความพร้อม → เครื่องมือ PL1 (อ้างด้วยรหัส)
   ใช้ข้อมูลร้านชุดเดียวกับตัวที่ 1 (MODELS, FIELDS, ROLE ใน ../mvp-check-numbers/src/data.js)
   ============================================================ */

/* เครื่องมือ PL1 ที่ตัวที่ 3 ใช้แต่ตารางของตัวที่ 1 ยังไม่มี (จำลอง pl1dev.tool_meta · ของจริงดึงจากฐานข้อมูล) */
TOOLS.idea7 = ['เทียบทำเลและวางงบเปิดร้าน', 'เลือกทำเล และวางงบให้เงินไม่หมดก่อนร้านตั้งตัว'];
TOOLS.cust3 = ['ค้นหาความต้องการของลูกค้า', 'รู้ว่าลูกค้าอยากได้อะไร และควรเพิ่มอะไรขาย'];

var TOPIC_ORDER = ['hire', 'place', 'channel', 'equip', 'branch'];

/* models = รูปแบบรายได้ที่เรื่องนี้ใช้ได้ · q = คำบนหน้าเริ่ม (ต่อท้าย "กำลังคิดจะ…") */
var TOPICS = {
  hire: { tile: 'จ้างคนเพิ่ม', q: 'จ้างคนเพิ่ม', title: 'จ้างคนเพิ่ม', models: MODEL_ORDER },
  place: { tile: 'ย้ายร้าน', q: 'ย้ายร้าน หรือเปลี่ยนทำเล', title: 'ย้ายร้าน', models: ['unit', 'service', 'resell', 'subscription', 'project', 'rental', 'commission'] },
  channel: { tile: 'ขายผ่านช่องทางใหม่', q: 'ขายผ่านแอป หรือช่องทางใหม่', title: 'ขายผ่านช่องทางใหม่', models: ['unit', 'service', 'resell', 'subscription', 'project', 'rental', 'commission'] },
  equip: { tile: 'ซื้ออุปกรณ์', q: 'ซื้ออุปกรณ์ หรือเครื่องใหม่', title: 'ซื้ออุปกรณ์', models: MODEL_ORDER },
  branch: { tile: 'เปิดสาขาที่ 2', q: 'เปิดสาขาที่ 2', title: 'เปิดสาขาที่ 2', models: ['unit', 'service', 'resell', 'subscription', 'rental'] }
};
function topicOk(t, m) { return !!(TOPICS[t] && TOPICS[t].models.indexOf(m) >= 0); }

/* ชื่อช่องทางที่ให้เลือก ตามรูปแบบรายได้ */
var CH_NAMES = {
  unit: ['แอปส่งอาหาร', 'มาร์เก็ตเพลส', 'ส่งขายร้านอื่น'],
  service: ['แอปจองคิว', 'แพลตฟอร์มบริการ'],
  resell: ['มาร์เก็ตเพลส', 'ไลฟ์สด', 'ส่งขายร้านอื่น'],
  subscription: ['แพลตฟอร์มคอร์ส', 'พาร์ตเนอร์'],
  project: ['แพลตฟอร์มหางาน', 'เอเจนซี'],
  rental: ['แพลตฟอร์มจองที่พัก', 'เอเจนซีทัวร์'],
  commission: ['เว็บประกาศ', 'คนแนะนำลูกค้า']
};

/* ---------- คำที่ใช้กับ "ปริมาณ" ของแต่ละรูปแบบ ---------- */
function gainUnit(inp, m) { return m === 'rental' ? '% ของ' + U(inp, m) + 'ทั้งหมด' : volUnitText(inp, m); }
function gainWord(m) {
  return { unit: 'ขายได้เพิ่ม', service: 'มีลูกค้าเพิ่ม', resell: 'ขายได้เพิ่ม', subscription: 'มีสมาชิกเพิ่ม', project: 'ได้งานเพิ่ม',
    rental: 'มีคนเช่าเพิ่ม', commission: 'ปิดดีลได้เพิ่ม', other: 'ได้รายได้เพิ่ม' }[m];
}
function expectWord(m) {
  return { rental: 'คาดว่าคนเช่าจะเพิ่มขึ้น', other: 'คาดว่ารายได้จะเพิ่ม' }[m] || 'คาดว่าจะ' + gainWord(m);
}
function salesWord(m) { return { rental: 'คนเช่า', subscription: 'สมาชิก', project: 'งานที่ได้', commission: 'ดีลที่ปิดได้', other: 'รายได้' }[m] || 'ยอดขาย'; }
function chPriceLabel(inp, m) {
  return { subscription: 'ค่าสมาชิกต่อรอบ บนช่องทางนี้', project: 'มูลค่าเฉลี่ยต่องาน จากช่องทางนี้', rental: 'ราคาต่อ' + periodWord(inp) + ' บนช่องทางนี้' }[m] ||
    'ราคาขายต่อ' + U(inp, m) + ' บนช่องทางนี้';
}
function costDownLabel(inp, m) {
  return { unit: 'ต้นทุนต่อ' + U(inp, m) + 'ลดลง', service: 'ต้นทุนต่อ' + U(inp, m) + 'ลดลง', resell: 'ราคาที่ซื้อมาต่อ' + U(inp, m) + 'ลดลง',
    subscription: 'ต้นทุนต่อสมาชิกลดลง', project: 'ต้นทุนตรงลดลง', rental: 'ค่าใช้จ่ายต่อ' + periodWord(inp) + 'ลดลง',
    commission: 'ส่วนแบ่งให้ทีมลดลง', other: 'ต้นทุนลดลง' }[m];
}
function costDownSuf(m) { return { project: '% ของมูลค่างาน', commission: '% ของค่าคอม', other: '% ของรายได้' }[m] || 'บาท'; }

/* ตัวอย่างในช่องกรอก (เช่น ...) คิดจากตัวเลขร้านคุณ ไม่ได้เติมให้ */
function roundNice(x) { if (!(x > 0)) return 0; var s = niceStep(x / 4); return Math.max(s, Math.round(x / s) * s); }
function phGain(inp, m) {
  var v = n0(inp[ROLE[m].vol]);
  if (m === 'rental') return Math.max(5, Math.min(20, Math.round((100 - v) / 3 / 5) * 5));
  if (m === 'commission' || m === 'project') return Math.max(1, Math.round(v * 0.25));
  return roundNice(Math.max(1, v * 0.25));
}
function sameAs(k) { return function (i) { var v = num(i[k]); return v === null ? null : v; }; }

/* ---------- ช่องกรอกของแต่ละเรื่อง ----------
   t: money / int / dec / pct / count (ปุ่ม −/+) / ramp (ชิป) / names (ชิปชื่อช่องทาง) / signed (เพิ่มขึ้น–ลดลง + ตัวเลข)
   req = ต้องกรอก (ช่องที่ถ้าว่างแล้วผลจะดีเกินจริง ต้องกรอกเสมอ) · quick = ปุ่มลัดเติมค่า เช่น "ไม่มี" "เท่าร้านเดิม" */
var DFIELDS = {
  /* จ้างคนเพิ่ม */
  count: { t: 'count', label: function () { return 'จ้างเพิ่มกี่คน'; }, suf: function () { return 'คน'; }, min: 1, max: 20 },
  salary: { t: 'money', req: true, label: function () { return 'เงินเดือนต่อคน'; }, quick: [['เท่าพนักงานตอนนี้', sameAs('staffSalary')]],
    ph: function (i) { return pos(i.staffSalary) || 12000; }, help: function () { return 'รวมค่าประกันสังคม และสวัสดิการที่จ่ายทุกเดือน'; } },
  gain: { t: 'dec', label: function (i, m) { return expectWord(m); }, suf: function (i, m) { return gainUnit(i, m); },
    ph: phGain, help: function (i, m) { return 'ถ้ายังไม่รู้ เว้นว่างไว้ แล้วดูในหน้าผลว่าต้อง' + gainWord(m) + 'เท่าไรถึงจะคุ้ม'; } },
  capAdd: { t: 'dec', label: function (i, m) { return 'พนักงาน 1 คน ช่วยให้ร้าน' + (m === 'service' ? 'รับลูกค้า' : 'ทำ') + 'ได้เพิ่ม'; },
    suf: function (i, m) { return U(i, m) + '/' + perWord(i); },
    show: function (i, m) { return isVolModel(m) && pos(i.capacity) !== null; },
    help: function (i, m) { return 'ตอนนี้ร้านทำได้สูงสุด ' + fmtN(n0(i.capacity)) + ' ' + U(i, m) + '/' + perWord(i) + ' ถ้าไม่รู้ เว้นว่างไว้'; } },
  hours: { t: 'dec', label: function () { return 'คุณได้เวลาคืนวันละ'; }, suf: function () { return 'ชั่วโมง'; }, max: 24,
    help: function () { return 'ถ้าคนใหม่มาช่วยงานที่คุณทำอยู่ ไม่ใส่ก็ได้'; } },

  /* ย้ายร้าน */
  newRent: { t: 'money', req: true, label: function () { return 'ค่าเช่าที่ใหม่ต่อเดือน'; }, ph: function (i) { return Math.round((n0(i.rent) || 15000) * 1.3 / 1000) * 1000; },
    help: function (i) { return 'ตอนนี้จ่าย ' + fmtN(n0(i.rent)) + ' บาท/เดือน'; } },
  salesPct: { t: 'signed', req: true, words: ['มากขึ้น', 'น้อยลง'], quick: [['เท่าเดิม', function () { return 0; }]],
    label: function (i, m) { return salesWord(m) + 'ที่ใหม่ เทียบกับตอนนี้'; }, suf: function () { return '%'; }, max: 500, min: -90 },
  moveCost: { t: 'money', req: true, quick: [['ไม่มี', function () { return 0; }]], label: function () { return 'ค่าย้าย ตกแต่ง และเงินมัดจำรวม'; }, ph: function () { return 150000; },
    help: function () { return 'เงินก้อนที่ต้องจ่ายครั้งเดียวตอนย้าย'; } },
  closedDays: { t: 'int', quick: [['ไม่ปิด', function () { return 0; }]], label: function () { return 'ปิดร้านช่วงย้าย'; }, suf: function () { return 'วัน'; },
    max: function (i, m) { return isVolModel(m) ? daysOf(i) : 30; }, show: function (i, m) { return m !== 'other'; } },
  dipPct: { t: 'pct', label: function (i, m) { return 'เดือนแรกที่ใหม่ ' + salesWord(m) + 'ยังมาไม่ครบ ขาดไป'; }, suf: function () { return '%'; }, max: 90,
    help: function () { return 'ลูกค้ายังหาร้านใหม่ไม่เจอ ถ้าไม่รู้ เว้นว่างไว้'; } },
  backMonths: { t: 'ramp', opts: [1, 3, 6], label: function () { return 'กี่เดือนกว่าลูกค้าจะมาครบ'; },
    show: function (i, m, d) { return n0(d.dipPct) > 0; } },

  /* ช่องทางใหม่ */
  chName: { t: 'names', label: function () { return 'ช่องทางไหน'; } },
  cut: { t: 'pct', req: true, label: function () { return 'ช่องทางหักส่วนแบ่ง'; }, suf: function () { return '% ของยอดขาย'; }, max: 95,
    help: function () { return 'รวมค่าธรรมเนียมทุกอย่างที่หักจากยอดขายผ่านช่องทางนี้'; } },
  chQty: { t: 'dec', req: true, label: function (i, m) {
      return { subscription: 'คาดว่าจะได้สมาชิกจากช่องทางนี้', project: 'คาดว่าจะได้งานจากช่องทางนี้ปีละ', rental: 'คาดว่าคนเช่าผ่านช่องทางนี้',
        commission: 'คาดว่าจะปิดดีลจากช่องทางนี้เดือนละ', service: 'คาดว่าจะมีลูกค้าจากช่องทางนี้' }[m] || 'คาดว่าจะขายผ่านช่องทางนี้ได้'; },
    suf: function (i, m) { return m === 'rental' ? '% ของทั้งหมด' : gainUnit(i, m); }, ph: phGain },
  chPrice: { t: 'money', label: chPriceLabel, show: function (i, m) { return m !== 'commission'; }, quick: [['เท่าขายเอง', function (i, m) { return n0(i[ROLE[m].price]) || null; }]],
    ph: function (i, m) { return n0(i[ROLE[m].price]); }, help: function (i, m) { return 'ถ้าเท่ากับตอนนี้ เว้นว่างไว้ (ตอนนี้ ' + fmtN(n0(i[ROLE[m].price])) + ' บาท)'; } },
  extraCost: { t: 'money', req: true, quick: [['ไม่มี', function () { return 0; }]], label: function (i, m) { return 'ต้นทุนเพิ่มต่อ' + U(i, m); }, show: function (i, m) { return isVolModel(m); },
    ph: function () { return 3; }, help: function () { return 'เช่น กล่อง ถุง ค่าแพ็กของ ที่เพิ่มเฉพาะยอดขายผ่านช่องทางนี้'; } },
  chFee: { t: 'money', req: true, quick: [['ไม่มี', function () { return 0; }]], label: function () { return 'ค่าใช้จ่ายรายเดือนของช่องทาง'; }, ph: function () { return 1500; },
    help: function () { return 'เช่น ค่าสมาชิกแพลตฟอร์ม ค่าโฆษณาในแอป'; } },
  movePct: { t: 'pct', req: true, quick: [['ไม่มีเลย', function () { return 0; }], ['บางส่วน 20%', function () { return 20; }], ['ครึ่งหนึ่ง 50%', function () { return 50; }]],
    label: function () { return 'ในนั้นเป็นลูกค้าเดิมที่ย้ายมาซื้อผ่านช่องทางนี้'; }, suf: function () { return '%'; },
    help: function () { return 'ลูกค้าที่เคยซื้อกับคุณอยู่แล้ว แต่เปลี่ยนมาซื้อผ่านช่องทางนี้แทน ร้านจะได้เงินจากคนกลุ่มนี้น้อยลง'; } },

  /* ซื้ออุปกรณ์ */
  price: { t: 'money', req: true, label: function () { return 'ราคาอุปกรณ์'; }, ph: function () { return 120000; },
    help: function () { return 'รวมค่าติดตั้งและค่าขนส่ง'; } },
  life: { t: 'dec', req: true, min: 0.5, label: function () { return 'ใช้ได้ประมาณ'; }, suf: function () { return 'ปี'; }, ph: function () { return 5; }, max: 50 },
  eqCap: { t: 'dec', label: function (i, m) { return 'ช่วยให้ร้าน' + (m === 'service' ? 'รับลูกค้า' : 'ทำ') + 'ได้เพิ่ม'; },
    suf: function (i, m) { return U(i, m) + '/' + perWord(i); }, show: function (i, m) { return isVolModel(m) && pos(i.capacity) !== null; },
    help: function (i, m) { return 'ตอนนี้ร้านทำได้สูงสุด ' + fmtN(n0(i.capacity)) + ' ' + U(i, m) + '/' + perWord(i); } },
  eqGain: { t: 'dec', label: function (i, m) { return expectWord(m); }, suf: function (i, m) { return gainUnit(i, m); }, ph: phGain,
    help: function () { return 'ถ้าเครื่องนี้ไม่ได้ช่วยขายเพิ่ม เว้นว่างไว้'; } },
  costDown: { t: 'money', label: costDownLabel, suf: function (i, m) { return costDownSuf(m); },
    help: function () { return 'เช่น ของเสียน้อยลง ใช้วัตถุดิบน้อยลง ถ้าไม่มี เว้นว่างไว้'; } },
  fixedChg: { t: 'signed', words: ['เพิ่มขึ้น', 'ลดลง'], label: function () { return 'ค่าใช้จ่ายรายเดือนที่เปลี่ยนไป'; }, suf: function () { return 'บาท/เดือน'; },
    help: function (i, m, d) { return d && n0(d.fixedChg) < 0 ? 'เช่น ไม่ต้องจ้างคนช่วยแล้ว ประหยัดได้เดือนละ 6,000' : 'เช่น ค่าไฟ ค่าดูแลเครื่อง ถ้าไม่มี เว้นว่างไว้'; } },

  /* เปิดสาขาที่ 2 */
  setup: { t: 'money', req: true, label: function () { return 'เงินลงทุนเปิดสาขา'; }, ph: function () { return 400000; },
    help: function () { return 'ตกแต่ง อุปกรณ์ เงินมัดจำ ของเข้าร้านรอบแรก'; } },
  bRent: { t: 'money', req: true, quick: [['เท่าร้านเดิม', sameAs('rent')], ['ไม่มี', function () { return 0; }]], label: function () { return 'ค่าเช่าสาขาต่อเดือน'; }, ph: function (i) { return n0(i.rent) || 15000; } },
  bStaff: { t: 'int', req: true, quick: [['เท่าร้านเดิม', sameAs('staffCount')], ['ไม่มี', function () { return 0; }]], label: function () { return 'พนักงานที่สาขา'; }, suf: function () { return 'คน'; },
    ph: function (i) { return n0(i.staffCount) || 2; }, max: 200 },
  bSalary: { t: 'money', req: true, quick: [['เท่าร้านเดิม', sameAs('staffSalary')]], label: function () { return 'เงินเดือนเฉลี่ยต่อคน'; }, ph: function (i) { return pos(i.staffSalary) || 12000; },
    show: function (i, m, d) { return n0(d.bStaff) > 0; } },
  bOther: { t: 'money', req: true, quick: [['เท่าร้านเดิม', sameAs('otherFixed')], ['ไม่มี', function () { return 0; }]], label: function () { return 'ค่าใช้จ่ายคงที่อื่นของสาขา'; }, ph: function (i) { return n0(i.otherFixed) || 8000; },
    help: function () { return 'ค่าน้ำ ค่าไฟ อินเทอร์เน็ต การตลาดของสาขา'; } },
  bPct: { t: 'pct', req: true, quick: [['ครึ่งหนึ่ง 50%', function () { return 50; }], ['70%', function () { return 70; }], ['เท่าร้านเดิม', function () { return 100; }]],
    label: function (i, m) { return 'สาขาน่าจะมี' + salesWord(m) + 'กี่ % ของร้านเดิม'; }, suf: function () { return '%'; }, max: 300 },
  ramp: { t: 'ramp', opts: [0, 1, 3, 6, 12], label: function (i, m) { return 'ใช้เวลากี่เดือนกว่า' + salesWord(m) + 'จะขึ้นถึงที่คาด'; } },
  bRamp: { t: 'ramp', key: 'ramp', req: true, opts: [0, 1, 3, 6, 12], label: function (i, m) { return 'สาขาใช้เวลากี่เดือนกว่า' + salesWord(m) + 'จะขึ้นถึงที่คาด'; },
    help: function () { return 'ช่วงนี้ยอดขายค่อย ๆ ขึ้นเท่ากันทุกเดือน ระหว่างนั้นค่าใช้จ่ายของสาขาเต็มจำนวน'; } }
};

/* ขั้นของคำถามแต่ละเรื่อง */
function dStepsFor(t, inp, m) {
  if (t === 'hire') return [
    { id: 'who', q: 'จ้างเพิ่มกี่คน เงินเดือนเท่าไร', f: ['count', 'salary'] },
    { id: 'gain', q: 'จ้างแล้วร้านได้อะไรเพิ่ม', p: 'ไม่รู้ก็เว้นว่างได้ แล้วดูว่าต้องได้เท่าไรถึงจะคุ้ม', f: ['gain', 'capAdd', 'ramp', 'hours'] }
  ];
  if (t === 'place') return [
    { id: 'rent', q: 'ที่ใหม่ค่าเช่าเท่าไร ' + salesWord(m) + 'จะเป็นอย่างไร', f: ['newRent', 'salesPct'] },
    { id: 'move', q: 'เงินและเวลาที่ใช้ตอนย้าย', f: ['moveCost', 'closedDays', 'dipPct', 'backMonths'] }
  ];
  if (t === 'channel') return [
    { id: 'ch', q: 'ช่องทางไหน หักส่วนแบ่งเท่าไร', f: ['chName', 'cut', 'chPrice'] },
    { id: 'qty', q: 'คาดว่าจะขายผ่านช่องทางนี้ได้เท่าไร', f: ['chQty', 'movePct', 'ramp'] },
    { id: 'cost', q: 'ค่าใช้จ่ายที่เพิ่มขึ้น', f: ['extraCost', 'chFee'] }
  ];
  if (t === 'equip') return [
    { id: 'buy', q: 'อุปกรณ์ราคาเท่าไร ใช้ได้กี่ปี', f: ['price', 'life'] },
    { id: 'does', q: 'อุปกรณ์นี้ช่วยร้านอย่างไร', p: 'ใส่เฉพาะข้อที่ช่วยจริง', f: ['eqCap', 'eqGain', 'costDown', 'fixedChg', 'ramp'] }
  ];
  return [
    { id: 'money', q: 'เปิดสาขาต้องใช้เงินเท่าไร', f: ['setup'] },
    { id: 'cost', q: 'ค่าใช้จ่ายของสาขาต่อเดือน', p: 'ใส่ให้ครบ ถ้าเว้นไว้ ผลจะดีกว่าความจริง', f: ['bRent', 'bStaff', 'bSalary', 'bOther'] },
    { id: 'sales', q: 'สาขาน่าจะขายได้เท่าไร', f: ['bPct', 'bRamp'] }
  ];
}
/* ช่องจริงในข้อมูลการตัดสินใจ (bRamp เก็บไว้ที่ ramp) */
function dKey(k) { return DFIELDS[k] && DFIELDS[k].key || k; }

/* ตัวอย่างการตัดสินใจของร้านกาแฟตัวอย่าง (ใช้เมื่อกด "ลองกับร้านตัวอย่าง" เท่านั้น) */
var SAMPLE_DEC = {
  hire: { count: 1, salary: 12000, gain: 20, capAdd: 40, ramp: 1 },
  place: { newRent: 26000, salesPct: 20, moveCost: 150000, closedDays: 7, dipPct: 30, backMonths: 3 },
  channel: { chName: 'แอปส่งอาหาร', cut: 30, chPrice: 75, chQty: 25, movePct: 20, ramp: 3, extraCost: 3, chFee: 1500 },
  equip: { price: 120000, life: 5, eqCap: 60, eqGain: 15, costDown: 1, fixedChg: 800, ramp: 1 },
  branch: { setup: 400000, bRent: 15000, bStaff: 2, bSalary: 12000, bOther: 8000, bPct: 70, ramp: 6 }
};
/* ค่าเริ่มของช่องที่ไม่บังคับ = 0 · count เริ่มที่ 1 */
var DEC_DEFAULT = { hire: { count: 1 }, place: {}, channel: {}, equip: {}, branch: {} };

/* ---------- คลังคำถามเช็กความพร้อม → จุดที่ควรเช็ก → เครื่องมือ PL1 ----------
   ทุกข้อเขียนให้ "ใช่" = มีความเสี่ยง · บอกแค่จุดที่ควรเช็ก ไม่ฟันธงและไม่ให้วิธีแก้ · lever = ตัวเลขที่เกี่ยวข้อง */
var QB3 = {
  h_owner: { q: function () { return 'งานหลายอย่างยังต้องรอคุณทำเองไหม'; }, p: 'งานที่ติดอยู่กับคุณ',
    d: 'เช็กว่างานไหนต้องเป็นคุณเท่านั้น และงานไหนส่งต่อให้คนใหม่ได้', tools: ['grow6', 'goal8'], lever: 'hours' },
  h_turn: { q: function (i, m) { return 'ยอดที่คาดว่าจะ' + gainWord(m) + ' มาจากการเดามากกว่าตัวเลขจริงไหม'; },
    p: 'ที่มาของยอดที่คาดว่าจะเพิ่ม', d: 'เช็กว่าเคยต้องปฏิเสธลูกค้าหรือให้รอนานวันละกี่คน ตัวเลขนี้บอกว่าคนใหม่จะช่วยขายเพิ่มได้จริงแค่ไหน', tools: ['grow7'], lever: 'gain' },
  h_peak: { q: function () { return 'ลูกค้าแน่นแค่บางช่วงของวัน ช่วงอื่นค่อนข้างว่างไหม'; }, p: 'ช่วงเวลาที่ต้องการคนเพิ่ม',
    d: 'เช็กว่าต้องการคนทั้งวัน หรือแค่ช่วงที่ลูกค้าแน่น', tools: ['goal8'], lever: 'salary', when: function (i, m) { return m !== 'project' && m !== 'commission' && m !== 'other'; } },
  h_train: { q: function () { return 'คนใหม่ต้องใช้เวลาหลายสัปดาห์กว่าจะทำงานได้เองไหม'; }, p: 'การสอนงานคนใหม่',
    d: 'เช็กว่าคนใหม่ต้องใช้เวลาเท่าไรกว่าจะทำงานได้เอง ระหว่างนั้นยังขายเพิ่มไม่ได้เต็มที่', tools: ['goal8'], lever: 'gain' },
  h_slow: { q: function () { return 'มีบางเดือนที่ขายได้น้อยจนจ่ายเงินเดือนทุกคนลำบากไหม'; }, p: 'เงินเดือนในเดือนที่ขายไม่ดี',
    d: 'เช็กว่าเดือนที่แย่ที่สุดของปี ร้านยังมีเงินพอจ่ายเงินเดือนทุกคน', tools: ['goal4', 'swot5'], lever: null },

  p_why: { q: function () { return 'ยอดขายร้านเดิมที่ไม่ดี อาจมาจากเรื่องอื่นด้วย เช่น ราคา สินค้า หรือการตลาดไหม'; }, p: 'ทำเลเดิมฉุดจริงไหม',
    d: 'เช็กว่ายอดเป็นแบบนี้เพราะทำเล หรือเพราะเรื่องอื่นที่เปลี่ยนได้โดยไม่ต้องย้าย', tools: ['grow14'], lever: null },
  p_traffic: { q: function () { return 'ยอดขายที่ใหม่ที่คาดไว้ มาจากการเดามากกว่าการไปนับคนผ่านจริงไหม'; }, p: 'คนที่ผ่านที่ใหม่',
    d: 'เช็กจำนวนคนผ่านในวันและเวลาที่ร้านเปิดจริง ตัวเลขนี้เป็นที่มาของยอดขายที่ใหม่', tools: ['idea7', 'grow14'], lever: 'salesPct' },
  p_regular: { q: function () { return 'ลูกค้าประจำส่วนใหญ่มาเพราะร้านอยู่ใกล้บ้านหรือที่ทำงานของเขาไหม'; }, p: 'ลูกค้าประจำที่อาจหายไป',
    d: 'เช็กว่าลูกค้าประจำมาจากไหน และจะตามไปที่ใหม่ได้กี่คน', tools: ['cust4', 'cust1'], lever: 'dipPct' },
  p_budget: { q: function () { return 'งบย้ายร้านอาจยังขาดบางก้อน เช่น ค่าตกแต่ง เงินมัดจำ หรือเงินสำรองช่วงแรกไหม'; }, p: 'งบย้ายร้านทั้งหมด',
    d: 'เช็กว่างบรวมทุกก้อนแล้ว รวมเงินที่ต้องใช้ระหว่างลูกค้ายังมาไม่ครบ', tools: ['idea7'], lever: 'moveCost' },
  p_lease: { q: function () { return 'สัญญาเช่าที่ใหม่สั้นกว่าเวลาที่ต้องใช้คืนทุนไหม'; }, p: 'อายุสัญญาเช่า',
    d: 'เช็กว่าสัญญาเช่ายาวพอให้เงินค่าย้ายคืนกลับมาก่อนหมดสัญญา', tools: ['idea7'], lever: 'moveCost', when: function (i, m, d) { return n0(d.moveCost) > 0; } },

  c_price: { q: function () { return 'ตั้งราคาบนช่องทางใหม่เท่าขายเอง โดยยังไม่ได้คิดส่วนแบ่งที่ช่องทางหักไหม'; }, p: 'ราคาบนช่องทางใหม่',
    d: 'เช็กว่าราคาบนช่องทางนี้ ยังเหลือเงินหลังหักส่วนแบ่งและต้นทุนพอหรือไม่', tools: ['grow13'], lever: 'chPrice', when: function (i, m) { return m !== 'commission'; } },
  c_move: { q: function () { return 'ลูกค้าประจำน่าจะเปลี่ยนมาซื้อผ่านช่องทางใหม่ แทนการซื้อกับคุณโดยตรงไหม'; }, p: 'ลูกค้าเดิมที่ย้ายช่องทาง',
    d: 'เช็กว่าลูกค้าจากช่องทางใหม่เป็นคนใหม่จริงกี่ % ลูกค้าเดิมที่ย้ายมาทำให้ร้านได้เงินน้อยลงทุกครั้งที่ซื้อ', tools: ['cust5', 'bmc10'], lever: 'movePct' },
  c_who: { q: function () { return 'คนที่ใช้ช่องทางนี้ อาจเป็นคนละกลุ่มกับลูกค้าที่ซื้อของแบบคุณไหม'; }, p: 'ลูกค้าในช่องทางใหม่',
    d: 'เช็กว่าคนที่ใช้ช่องทางนี้ ตรงกับลูกค้าที่ซื้อของแบบคุณหรือไม่', tools: ['cust5', 'cust1'], lever: 'chQty' },
  c_cap: { q: function () { return 'ช่วงที่ร้านแน่น ออร์เดอร์จากช่องทางใหม่อาจทำให้ลูกค้าที่ร้านต้องรอนานไหม'; }, p: 'กำลังรับออร์เดอร์เพิ่ม',
    d: 'เช็กว่าช่วงที่ออร์เดอร์เข้าพร้อมกัน ร้านทำทันโดยลูกค้าที่ร้านไม่ต้องรอนาน', tools: ['grow7'], lever: null, when: function (i, m) { return isVolModel(m) || m === 'rental'; } },
  c_hidden: { q: function () { return 'ช่องทางนี้อาจขอให้ร่วมจ่ายค่าโฆษณาหรือส่วนลด ถึงจะมีคนเห็นไหม'; }, p: 'ค่าใช้จ่ายแฝงของช่องทาง',
    d: 'เช็กค่าโฆษณาและส่วนลดที่ช่องทางขอให้ร่วมจ่าย แล้วใส่ไว้ในค่าใช้จ่ายรายเดือน', tools: ['bmc10'], lever: 'chFee' },

  e_slow: { q: function () { return 'ที่ร้านทำได้ช้า มีส่วนมาจากคนหรือของไม่พอด้วยไหม'; }, p: 'จุดที่ทำให้ร้านทำได้ช้า',
    d: 'เช็กว่าอะไรทำให้ร้านรับลูกค้าได้เท่านี้ ถ้าเป็นเรื่องคนหรือของ เครื่องใหม่จะช่วยได้ไม่เต็มที่', tools: ['grow7', 'grow6'], lever: 'eqCap', when: function (i, m) { return isVolModel(m); } },
  e_demand: { q: function () { return 'ยอดที่คาดว่าจะขายเพิ่ม มาจากการเดามากกว่าลูกค้าที่รอซื้ออยู่จริงไหม'; }, p: 'ลูกค้าที่จะซื้อเพิ่ม',
    d: 'เช็กว่ามีลูกค้าที่รอหรือเคยถูกปฏิเสธอยู่จริงกี่คน ก่อนนับยอดขายที่เพิ่มเป็นเงินคืนทุน', tools: ['swot4', 'cust3'], lever: 'eqGain' },
  e_hidden: { q: function () { return 'อาจมีค่าใช้จ่ายที่ยังไม่ได้นับ เช่น ค่าติดตั้ง ค่าดูแล หรือค่าไฟที่เพิ่มไหม'; }, p: 'ค่าใช้จ่ายแฝงของอุปกรณ์',
    d: 'เช็กค่าใช้จ่ายทุกก้อนที่มากับเครื่อง แล้วใส่ไว้ในราคาและค่าใช้จ่ายรายเดือน', tools: ['grow15'], lever: 'fixedChg' },
  e_life: { q: function () { return 'เครื่องอาจเสียหรือหมดอายุ ก่อนเวลาที่ต้องใช้คืนทุนไหม'; }, p: 'อายุใช้งานกับเวลาคืนทุน',
    d: 'เช็กอายุใช้งานจริงและประกันของเครื่อง เทียบกับเวลาที่ต้องใช้คืนทุน', tools: ['goal4'], lever: 'life' },

  b_owner: { q: function () { return 'ร้านเดิมยังต้องมีคุณอยู่ทุกวัน ถึงจะเดินได้ไหม'; }, p: 'ร้านเดิมเดินได้โดยไม่มีคุณไหม',
    d: 'เช็กว่างานไหนยังติดอยู่กับคุณ เพราะตอนเปิดสาขา เวลาของคุณจะแบ่งเป็น 2 ที่', tools: ['grow6', 'goal8'], lever: null },
  b_system: { q: function () { return 'สูตร ขั้นตอน หรือวิธีทำงานของร้าน ยังอยู่ในหัวคุณมากกว่าที่จดไว้ให้คนอื่นทำตามไหม'; }, p: 'วิธีทำงานที่ทำซ้ำได้',
    d: 'เช็กว่าสาขาใหม่จะทำได้เหมือนร้านเดิม โดยไม่ต้องมีคุณคุมทุกขั้น', tools: ['grow7', 'goal8'], lever: null },
  b_place: { q: function () { return 'ยอดขายของสาขาที่คาดไว้ มาจากการเดามากกว่าการเทียบทำเลจริงไหม'; }, p: 'ทำเลของสาขาใหม่',
    d: 'เช็กว่าที่ใหม่มีคนแบบลูกค้าร้านเดิมผ่านมากพอ ตัวเลขนี้เป็นที่มาของ % ที่ใส่ไว้', tools: ['idea7', 'grow14'], lever: 'bPct' },
  b_cash: { q: function () { return 'ถ้าสาขาใหม่ใช้เวลาตั้งตัวนานกว่าที่คิด เงินที่มีอาจไม่พอไหม'; }, p: 'เงินช่วงที่สาขากำลังตั้งตัว',
    d: 'เช็กว่าเงินที่มีพอจ่ายทั้งเงินลงทุน และค่าใช้จ่ายสาขาในเดือนที่ยังขายได้ไม่ถึงที่คาด', tools: ['goal4', 'swot5'], lever: 'setup' },
  b_demand: { q: function () { return 'ลูกค้าย่านใหม่อาจต้องการสินค้าหรือราคาไม่เหมือนลูกค้าร้านเดิมไหม'; }, p: 'ความต้องการของลูกค้าย่านใหม่',
    d: 'เช็กว่าลูกค้าย่านใหม่ซื้ออะไร ในราคาเท่าไร', tools: ['cust3', 'cust1'], lever: null }
};
var QSET3 = {
  hire: ['h_owner', 'h_turn', 'h_peak', 'h_train', 'h_slow'],
  place: ['p_why', 'p_traffic', 'p_regular', 'p_budget', 'p_lease'],
  channel: ['c_price', 'c_move', 'c_who', 'c_cap', 'c_hidden'],
  equip: ['e_slow', 'e_demand', 'e_hidden', 'e_life'],
  branch: ['b_owner', 'b_system', 'b_place', 'b_cash', 'b_demand']
};
/* เครื่องมือ PL1 ที่ช่วยคิดเรื่องนี้โดยตรง (แสดงในหน้าผลเสมอ) */
var TOPIC_TOOLS = { hire: ['goal8', 'grow6', 'grow7'], place: ['grow14', 'idea7'], channel: ['cust5', 'bmc10'], equip: ['grow7', 'grow15'], branch: ['grow7', 'idea7', 'grow6'] };
