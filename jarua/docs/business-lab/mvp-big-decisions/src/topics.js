/* ============================================================
   TOPICS — 5 เรื่องใหญ่ที่เจ้าของร้านกำลังคิด · คำถามของแต่ละเรื่อง · คลังคำถามเช็กความพร้อม → เครื่องมือ PL1 (อ้างด้วยรหัส)
   ใช้ข้อมูลร้านชุดเดียวกับตัวที่ 1 (MODELS, FIELDS, ROLE ใน ../mvp-check-numbers/src/data.js)
   ============================================================ */

/* เครื่องมือ PL1 ที่ตัวที่ 3 ใช้แต่ตารางของตัวที่ 1 ยังไม่มี (จำลอง pl1dev.tool_meta · ของจริงดึงจากฐานข้อมูล) */
TOOLS.idea7 = ['เทียบทำเลและวางงบเปิดร้าน', 'เลือกทำเล และวางงบให้เงินไม่หมดก่อนร้านตั้งตัว'];
TOOLS.cust3 = ['ค้นหาความต้องการของลูกค้า', 'รู้ว่าลูกค้าอยากได้อะไร และควรเพิ่มอะไรขาย'];
TOOLS.comp3 = ['วิเคราะห์การตอบโต้ของคู่แข่ง', 'รู้ล่วงหน้าว่าคู่แข่งจะตอบโต้ไหม ก่อนลงมือเปลี่ยน'];
TOOLS.cont1 = ['สร้างไอเดียคอนเทนต์ 30 วัน', 'มีเรื่องโพสต์ครบเดือน พร้อมประโยคเปิดทุกวัน'];
TOOLS.cont9 = ['เขียนข้อความสำหรับยิงโฆษณา', 'ข้อความโฆษณา 3 แบบ ไม่มีรีวิวหรือคำสัญญาที่ไม่จริง'];
TOOLS.goal3 = ['วางแผนเปิดตัวสินค้าหรือบริการ', 'เปิดตัวแบบเสี่ยงน้อย มีด่านตรวจทุกขั้น'];

/* ---------- เรื่องที่ให้เลือก จัดเป็นหมวด ----------
   models = รูปแบบรายได้ที่เรื่องนี้ใช้ได้ · where = ร้านที่ขายแบบไหนเห็นเรื่องนี้ (หน้าร้าน / ออนไลน์ / ทั้งสองแบบ) · q = คำบนหน้าเริ่ม (ต่อท้าย "กำลังคิดจะ…") */
var VOLM = ['unit', 'service', 'resell'];
var ALLW = ['shop', 'online', 'both'];
var TOPIC_CATS = [
  { id: 'sell', name: 'ราคาและสินค้า', topics: ['price', 'promo', 'newprod', 'freeship'] },
  { id: 'mkt', name: 'การตลาดและช่องทางขาย', topics: ['ads', 'channel'] },
  { id: 'team', name: 'คนและการทำงาน', topics: ['hire', 'freelance'] },
  { id: 'cost', name: 'ต้นทุนและอุปกรณ์', topics: ['equip', 'supplier'] },
  { id: 'grow', name: 'ที่ทางและการขยาย', topics: ['place', 'branch'] }
];
var TOPIC_ORDER = TOPIC_CATS.reduce(function (a, c) { return a.concat(c.topics); }, []);
var TOPICS = {
  price: { q: 'ขึ้นราคา', title: 'ขึ้นราคา', models: ['unit', 'service', 'resell', 'subscription', 'project', 'rental'], where: ALLW },
  promo: { q: 'จัดโปรโมชัน ลดราคา หรือแจกโค้ด', title: 'จัดโปรโมชัน', models: VOLM, where: ALLW },
  newprod: { q: 'เพิ่มสินค้าหรือบริการใหม่', title: 'เพิ่มของขายใหม่', models: VOLM, where: ALLW },
  freeship: { q: 'ส่งฟรี หรือช่วยค่าส่ง', title: 'ส่งฟรีหรือช่วยค่าส่ง', models: ['unit', 'resell'], where: ['online', 'both'] },
  ads: { q: 'ยิงโฆษณาออนไลน์', title: 'ยิงโฆษณาออนไลน์', models: ['unit', 'service', 'resell', 'subscription', 'project', 'rental', 'commission'], where: ALLW },
  channel: { q: 'ขายผ่านแอป หรือช่องทางใหม่', title: 'ขายผ่านช่องทางใหม่', models: ['unit', 'service', 'resell', 'subscription', 'project', 'rental', 'commission'], where: ALLW },
  hire: { q: 'จ้างคนเพิ่ม', title: 'จ้างคนเพิ่ม', models: MODEL_ORDER, where: ALLW },
  freelance: { q: 'จ้างฟรีแลนซ์ เช่น แอดมิน คนไลฟ์', title: 'จ้างฟรีแลนซ์', models: ['unit', 'service', 'resell', 'subscription', 'project', 'rental', 'commission'], where: ALLW },
  equip: { q: 'ซื้ออุปกรณ์ หรือเครื่องใหม่', title: 'ซื้ออุปกรณ์', models: MODEL_ORDER, where: ALLW },
  supplier: { q: 'เปลี่ยนซัพพลายเออร์ หรือวัตถุดิบ', title: 'เปลี่ยนซัพพลายเออร์', models: VOLM, where: ALLW },
  place: { q: 'ย้ายร้าน หรือเปลี่ยนทำเล', title: 'ย้ายร้าน', models: ['unit', 'service', 'resell', 'subscription', 'project', 'rental', 'commission'], where: ['shop', 'both'] },
  branch: { q: 'เปิดสาขาที่ 2', title: 'เปิดสาขาที่ 2', models: ['unit', 'service', 'resell', 'subscription', 'rental'], where: ['shop', 'both'] }
};
Object.keys(TOPICS).forEach(function (t) { TOPICS[t].tile = TOPICS[t].title; });
function topicOk(t, m) { return !!(TOPICS[t] && TOPICS[t].models.indexOf(m) >= 0); }
function whereOk(t, w) { return !w || !!(TOPICS[t] && TOPICS[t].where.indexOf(w) >= 0); }
var WHERE = [['shop', 'หน้าร้าน'], ['online', 'ออนไลน์'], ['both', 'ทั้งสองแบบ']];

/* ---------- แบบย่อยของแต่ละเรื่อง (ข้อแรกของคำถาม) ---------- */
var CH_KINDS = {
  delivery: { name: 'แอปส่งอาหาร', sub: 'แอปที่มีคนขับไปส่งให้', extra: 'เช่น กล่อง ถุง ช้อนส้อม ที่เพิ่มเฉพาะออร์เดอร์จากแอป', fee: 'เช่น ค่าโฆษณาในแอป ส่วนลดที่ร้านร่วมจ่าย' },
  market: { name: 'Shopee Lazada', sub: 'ร้านค้าในแอปขายของ', extra: 'เช่น กล่อง ถุง ค่าแพ็ก ที่ร้านจ่ายเอง', fee: 'เช่น ค่าโฆษณาในแอป ค่าเข้าร่วมแคมเปญ' },
  social: { name: 'TikTok Shop หรือไลฟ์', sub: 'ขายผ่านคลิปและไลฟ์', extra: 'เช่น กล่อง ถุง ค่าแพ็ก ที่ร้านจ่ายเอง', fee: 'เช่น ค่าจ้างคนไลฟ์ ค่าโปรโมตคลิป' },
  own: { name: 'เว็บหรือ LINE ของร้าน', sub: 'ลูกค้าสั่งกับร้านโดยตรง', extra: 'เช่น ค่าส่งที่ร้านจ่าย กล่อง ถุง', fee: 'เช่น ค่าเว็บ ค่าระบบรับออร์เดอร์ ค่าโฆษณาให้คนรู้จัก' },
  agent: { name: 'ฝากขายหรือตัวแทน', sub: 'ร้านอื่นหรือตัวแทนขายให้', extra: 'เช่น ค่าขนส่งไปส่งร้านที่ฝากขาย', fee: 'เช่น ค่าวางสินค้า ค่าเดินทางไปเติมของ' },
  booking: { name: 'แอปจองคิว', sub: 'ลูกค้าจองผ่านแอป', extra: '', fee: 'เช่น ค่าสมาชิกแอป ค่าโฆษณาในแอป' },
  platform: { name: 'แพลตฟอร์มกลาง', sub: 'เว็บหรือแอปที่รวมร้านหลายร้าน', extra: '', fee: 'เช่น ค่าสมาชิกแพลตฟอร์ม ค่าโฆษณาในแพลตฟอร์ม' },
  partner: { name: 'พาร์ตเนอร์', sub: 'ธุรกิจอื่นช่วยหาลูกค้าให้', extra: '', fee: 'เช่น ค่าทำสื่อร่วมกับพาร์ตเนอร์' },
  agency: { name: 'เอเจนซี', sub: 'คนกลางหาลูกค้าให้', extra: '', fee: 'เช่น ค่าสมาชิก ค่าทำสื่อ' },
  referrer: { name: 'คนแนะนำลูกค้า', sub: 'จ่ายค่าแนะนำเมื่อปิดดีลได้', extra: '', fee: 'เช่น ค่าเลี้ยงรับรอง ค่าทำสื่อ' }
};
var CH_BY_MODEL = {
  unit: ['delivery', 'market', 'social', 'own', 'agent'], resell: ['market', 'social', 'own', 'agent'], service: ['booking', 'platform', 'social', 'own'],
  subscription: ['platform', 'partner', 'own'], project: ['platform', 'agency', 'own'], rental: ['platform', 'agency', 'own'], commission: ['platform', 'referrer', 'own']
};
function kindsOf(t, inp, m) {
  if (t === 'channel') return (CH_BY_MODEL[m] || []).map(function (k) {
    var c = CH_KINDS[k];
    return [k, k === 'platform' && m === 'rental' ? 'แพลตฟอร์มจองที่พัก' : k === 'platform' && m === 'project' ? 'แพลตฟอร์มหางาน' : k === 'platform' && m === 'commission' ? 'เว็บประกาศ' : c.name, c.sub];
  });
  var u = U(inp, m);
  return {
    hire: [['full', 'พนักงานประจำ', 'จ่ายเป็นเงินเดือน'], ['part', 'พาร์ตไทม์', 'จ่ายเป็นชั่วโมง']].concat(isVolModel(m) ? [['piece', 'จ่ายรายชิ้น', 'จ่ายตามจำนวน' + u + 'ที่ทำ']] : []),
    price: [['all', 'ขึ้นราคาทุกอย่าง', 'ทุก' + (isVolModel(m) ? u : 'รายการ') + 'ราคาใหม่เท่ากัน'], ['some', 'ขึ้นบางตัว', 'เฉพาะบางสินค้าหรือบางแพ็กเกจ']],
    promo: [['disc', 'ลดราคา', 'ทุกคนได้ส่วนลด'], ['code', 'แจกโค้ดหรือคูปอง', 'เฉพาะคนที่ใช้โค้ด'], ['gift', 'ของแถม', 'ซื้อแล้วได้ของแถม']],
    newprod: [['new', 'สินค้าหรือบริการตัวใหม่', 'ขายแยกจากของเดิม'], ['addon', 'ของขายพ่วง', 'ลูกค้าซื้อเพิ่มตอนซื้อของเดิม']],
    freeship: [['all', 'ส่งฟรีทุกออร์เดอร์', 'ร้านจ่ายค่าส่งแทนทั้งหมด'], ['min', 'ส่งฟรีเมื่อซื้อถึงขั้นต่ำ', 'เฉพาะออร์เดอร์ที่ซื้อถึง'], ['part', 'ช่วยค่าส่งบางส่วน', 'ร้านจ่ายแทนออร์เดอร์ละไม่กี่บาท']],
    ads: [['social', 'Facebook หรือ Instagram', 'โฆษณาเพจหรือโพสต์'], ['tiktok', 'TikTok', 'โฆษณาคลิป'], ['search', 'Google', 'คนค้นหาแล้วเจอร้าน'], ['market', 'โฆษณาในแอปขายของ', 'เช่น Shopee Lazada']],
    supplier: [['cheaper', 'ถูกลง', 'ต้นทุนลดลง แต่ต้องดูเรื่องคุณภาพ'], ['better', 'ดีขึ้น แต่แพงขึ้น', 'ต้นทุนเพิ่ม แต่อาจขายได้มากขึ้น']],
    freelance: [['admin', 'แอดมินตอบแชต', 'ตอบลูกค้าและรับออร์เดอร์']].concat(isVolModel(m) ? [['live', 'คนไลฟ์ขายของ', 'ไลฟ์ขายแทนคุณ']] : []).concat([['content', 'ช่างภาพหรือทำคอนเทนต์', 'ถ่ายรูป ทำคลิป เขียนโพสต์']])
  }[t] || [];
}
function kindName(t, d, inp, m) { var k = kindsOf(t, inp, m).filter(function (x) { return x[0] === d.kind; })[0]; return k ? k[1] : ''; }
function isKind(d, k) { return d && d.kind === k; }

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
  /* แบบย่อยของเรื่อง (ข้อแรกของทุกเรื่องที่มีหลายแบบ) */
  kind: { t: 'kind', req: true, label: function () { return 'แบบไหน'; } },

  /* จ้างคนเพิ่ม */
  count: { t: 'count', label: function () { return 'จ้างเพิ่มกี่คน'; }, suf: function () { return 'คน'; }, min: 1, max: 20, show: function (i, m, d) { return !isKind(d, 'piece'); } },
  salary: { t: 'money', req: true, label: function () { return 'เงินเดือนต่อคน'; }, quick: [['เท่าพนักงานตอนนี้', sameAs('staffSalary')]], show: function (i, m, d) { return !d.kind || isKind(d, 'full'); },
    ph: function (i) { return pos(i.staffSalary) || 12000; }, help: function () { return 'รวมค่าประกันสังคม และสวัสดิการที่จ่ายทุกเดือน'; } },
  gain: { t: 'dec', label: function (i, m) { return expectWord(m); }, suf: function (i, m) { return gainUnit(i, m); },
    ph: phGain, help: function (i, m) { return 'ถ้ายังไม่รู้ เว้นว่างไว้ แล้วดูในหน้าผลว่าต้อง' + gainWord(m) + 'เท่าไรถึงจะคุ้ม'; } },
  capAdd: { t: 'dec', label: function (i, m) { return 'พนักงาน 1 คน ช่วยให้ร้าน' + (m === 'service' ? 'รับลูกค้า' : 'ทำ') + 'ได้เพิ่ม'; },
    suf: function (i, m) { return U(i, m) + '/' + perWord(i); },
    show: function (i, m) { return isVolModel(m) && pos(i.capacity) !== null; },
    help: function (i, m) { return 'ตอนนี้ร้านทำได้สูงสุด ' + fmtN(n0(i.capacity)) + ' ' + U(i, m) + '/' + perWord(i) + ' ถ้าไม่รู้ เว้นว่างไว้'; } },
  partRate: { t: 'money', req: true, label: function () { return 'ค่าจ้างต่อชั่วโมง'; }, ph: function () { return 60; }, show: function (i, m, d) { return isKind(d, 'part'); } },
  partHours: { t: 'dec', req: true, label: function () { return 'ทำงานวันละ'; }, suf: function () { return 'ชั่วโมง'; }, max: 24, ph: function () { return 5; }, show: function (i, m, d) { return isKind(d, 'part'); } },
  partDays: { t: 'int', req: true, label: function () { return 'เดือนละ'; }, suf: function () { return 'วัน'; }, max: 31, show: function (i, m, d) { return isKind(d, 'part'); },
    quick: [['เท่าวันที่เปิดร้าน', function (i, m) { return isVolModel(m) && i.volumePer !== 'month' ? pos(i.daysOpen) : null; }]] },
  pieceRate: { t: 'money', req: true, label: function (i, m) { return 'ค่าจ้างต่อ' + U(i, m); }, ph: function () { return 5; }, show: function (i, m, d) { return isKind(d, 'piece'); },
    help: function () { return 'เช่น ค่าแพ็กของ ค่าทำ ค่าส่ง ที่จ่ายตามจำนวน'; } },
  pieceShare: { t: 'pct', req: true, label: function (i, m) { return 'คนนี้ทำกี่ % ของ' + U(i, m) + 'ทั้งหมด'; }, suf: function () { return '%'; }, show: function (i, m, d) { return isKind(d, 'piece'); },
    quick: [['ทั้งหมด 100%', function () { return 100; }]] },
  hours: { t: 'dec', label: function () { return 'คุณได้เวลาคืนวันละ'; }, suf: function () { return 'ชั่วโมง'; }, max: 24,
    show: function (i, m, d) { return !isKind(d, 'live'); }, help: function () { return 'ถ้าคนใหม่มาช่วยงานที่คุณทำอยู่ ไม่ใส่ก็ได้'; } },

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
  cut: { t: 'pct', req: true, label: function (i, m, d) { return isKind(d, 'agent') ? 'ส่วนลดหรือส่วนแบ่งที่ให้ร้านที่ฝากขาย' : isKind(d, 'own') ? 'ค่าธรรมเนียมรับเงิน' : 'ช่องทางหักส่วนแบ่ง'; },
    suf: function () { return '% ของยอดขาย'; }, max: 95, quick: [['ไม่มี', function () { return 0; }]],
    help: function (i, m, d) { return isKind(d, 'own') ? 'เช่น ค่าธรรมเนียมรับบัตรหรือรับโอนผ่านระบบ ถ้าไม่มี กด ไม่มี' : 'รวมค่าคอมมิชชัน ค่าธรรมเนียมรับเงิน และค่าบริการทุกอย่างที่หักจากยอดขาย'; } },
  chQty: { t: 'dec', req: true, label: function (i, m) {
      return { subscription: 'คาดว่าจะได้สมาชิกจากช่องทางนี้', project: 'คาดว่าจะได้งานจากช่องทางนี้ปีละ', rental: 'คาดว่าคนเช่าผ่านช่องทางนี้',
        commission: 'คาดว่าจะปิดดีลจากช่องทางนี้เดือนละ', service: 'คาดว่าจะมีลูกค้าจากช่องทางนี้' }[m] || 'คาดว่าจะขายผ่านช่องทางนี้ได้'; },
    suf: function (i, m) { return m === 'rental' ? '% ของทั้งหมด' : gainUnit(i, m); }, ph: phGain },
  chPrice: { t: 'money', label: chPriceLabel, show: function (i, m) { return m !== 'commission'; }, quick: [['เท่าขายเอง', function (i, m) { return n0(i[ROLE[m].price]) || null; }]],
    ph: function (i, m) { return n0(i[ROLE[m].price]); }, help: function (i, m) { return 'ถ้าเท่ากับตอนนี้ เว้นว่างไว้ (ตอนนี้ ' + fmtN(n0(i[ROLE[m].price])) + ' บาท)'; } },
  extraCost: { t: 'money', req: true, quick: [['ไม่มี', function () { return 0; }]], label: function (i, m) { return 'ต้นทุนเพิ่มต่อ' + U(i, m); }, show: function (i, m) { return isVolModel(m); },
    ph: function () { return 3; }, help: function (i, m, d) { var k = CH_KINDS[d.kind]; return k && k.extra ? k.extra : 'ต้นทุนที่เพิ่มเฉพาะยอดขายผ่านช่องทางนี้'; } },
  chFee: { t: 'money', req: true, quick: [['ไม่มี', function () { return 0; }]], label: function () { return 'ค่าใช้จ่ายรายเดือนของช่องทาง'; }, ph: function () { return 1500; },
    help: function (i, m, d) { var k = CH_KINDS[d.kind]; return k && k.fee ? k.fee : 'เช่น ค่าสมาชิกแพลตฟอร์ม ค่าโฆษณาในแอป'; } },
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
    help: function () { return 'ช่วงนี้ยอดขายค่อย ๆ ขึ้นเท่ากันทุกเดือน ระหว่างนั้นค่าใช้จ่ายของสาขาเต็มจำนวน'; } },

  /* ขึ้นราคา */
  raiseBy: { t: 'money', req: true, label: function (i, m) { return 'ขึ้นราคา' + priceWord(i, m) + 'ละกี่บาท'; }, suf: function () { return 'บาท'; },
    ph: function (i, m) { var p = n0(i[ROLE[m].price]); return p > 0 ? roundNice(p * 0.08) : 0; },
    help: function (i, m) { return 'ตอนนี้ ' + priceWord(i, m) + 'ละ ' + fmtN(n0(i[ROLE[m].price])) + ' บาท' + (isVolModel(m) ? ' (ราคาเฉลี่ย)' : ''); } },
  raiseShare: { t: 'pct', req: true, label: function () { return 'ของที่ขึ้นราคา คิดเป็นกี่ % ของยอดขาย'; }, suf: function () { return '%'; }, show: function (i, m, d) { return isKind(d, 'some'); },
    help: function () { return 'เช่น เมนูที่ขึ้นราคาขายได้ครึ่งหนึ่งของร้าน ใส่ 50'; } },
  lostPct: { t: 'pct', req: true, max: 95, quick: [['ไม่มีใครหาย', function () { return 0; }]], label: function (i, m) { return 'คาดว่า' + salesWord(m) + 'จะลดลง'; }, suf: function () { return '%'; },
    help: function () { return 'ไม่รู้ใส่ 0 ไว้ก่อน แล้วดูในหน้าผลว่าลดได้มากสุดเท่าไรถึงยังคุ้ม'; } },

  /* จัดโปรโมชัน */
  discPct: { t: 'pct', req: true, max: 90, label: function (i, m, d) { return isKind(d, 'code') ? 'โค้ดลดกี่ %' : 'ลดกี่ %'; }, suf: function () { return '%'; }, ph: function () { return 20; },
    show: function (i, m, d) { return !isKind(d, 'gift'); } },
  giftCost: { t: 'money', req: true, label: function (i, m) { return 'ต้นทุนของแถมต่อ' + U(i, m) + 'ที่ขาย'; }, ph: function () { return 10; }, show: function (i, m, d) { return isKind(d, 'gift'); } },
  usePct: { t: 'pct', req: true, label: function (i, m) { return 'คาดว่ากี่ % ของ' + U(i, m) + 'ที่ขาย จะใช้โค้ด'; }, suf: function () { return '%'; }, show: function (i, m, d) { return isKind(d, 'code'); },
    help: function () { return 'รวมลูกค้าเดิมที่ได้โค้ดไปด้วย'; } },
  promoMonths: { t: 'ramp', req: true, opts: [1, 2, 3, 6], label: function () { return 'จัดโปรนานกี่เดือน'; } },
  lift: { t: 'dec', req: true, max: 1000, quick: [['ยอดไม่เพิ่ม', function () { return 0; }]], label: function () { return 'ช่วงจัดโปร ยอดขายจะเพิ่มขึ้น'; }, suf: function () { return '%'; },
    help: function () { return 'ไม่รู้ใส่ 0 ไว้ก่อน แล้วดูในหน้าผลว่าต้องเพิ่มเท่าไรถึงจะคุ้ม'; } },
  afterPct: { t: 'dec', max: 500, label: function () { return 'หลังจบโปร ยอดขายยังสูงกว่าเดิม'; }, suf: function () { return '%'; },
    help: function () { return 'จากลูกค้าใหม่ที่ยังกลับมาซื้อ ถ้าไม่รู้ เว้นว่างไว้'; } },
  promoCost: { t: 'money', req: true, quick: [['ไม่มี', function () { return 0; }]], label: function () { return 'ค่าใช้จ่ายจัดโปรครั้งเดียว'; }, ph: function () { return 3000; },
    help: function () { return 'เช่น ป้าย ใบปลิว ค่าโฆษณาบอกว่ามีโปร'; } },

  /* เพิ่มสินค้าหรือบริการใหม่ */
  npPrice: { t: 'money', req: true, label: function (i, m) { return 'ราคาขายต่อ' + npUnit(m); }, ph: function (i, m) { return roundNice(n0(i.price) * 0.8); } },
  npCost: { t: 'money', req: true, label: function (i, m) { return 'ต้นทุนต่อ' + npUnit(m); }, ph: function (i, m) { return roundNice(n0(i.unitCost) * 0.8); },
    help: function () { return 'วัตถุดิบหรือราคาที่ซื้อมา รวมแพ็กเกจ'; } },
  npQty: { t: 'dec', label: function () { return 'คาดว่าจะขายได้'; }, suf: function (i, m) { return npUnit(m) + '/' + perWord(i); }, ph: phGain,
    show: function (i, m, d) { return !isKind(d, 'addon'); }, help: function () { return 'ไม่รู้เว้นว่างไว้ แล้วดูในหน้าผลว่าต้องขายได้เท่าไรถึงจะคุ้ม'; } },
  npAttach: { t: 'pct', label: function (i, m) { return 'ลูกค้าเดิมกี่ % จะซื้อเพิ่ม'; }, suf: function (i, m) { return '% ของ' + U(i, m) + 'ที่ขาย'; },
    show: function (i, m, d) { return isKind(d, 'addon'); }, help: function (i, m) { return 'เช่น 100 ' + U(i, m) + ' มีคนซื้อเพิ่ม 15 คน ใส่ 15 · ไม่รู้เว้นว่างไว้'; } },
  npCanni: { t: 'pct', req: true, show: function (i, m, d) { return !isKind(d, 'addon'); },
    quick: [['ไม่มีเลย', function () { return 0; }], ['บางส่วน 20%', function () { return 20; }], ['ครึ่งหนึ่ง 50%', function () { return 50; }]],
    label: function () { return 'ในนั้นเป็นคนที่เปลี่ยนจากของเดิมมาซื้อของใหม่แทน'; }, suf: function () { return '%'; },
    help: function () { return 'คนที่เคยซื้อของเดิม แต่เปลี่ยนมาซื้อของใหม่แทน ร้านไม่ได้ยอดขายเพิ่มจากคนกลุ่มนี้'; } },
  npFixed: { t: 'money', req: true, quick: [['ไม่มี', function () { return 0; }]], label: function () { return 'ค่าใช้จ่ายรายเดือนที่เพิ่ม'; }, help: function () { return 'เช่น ค่าไฟ ค่าจ้างคนช่วยทำ'; } },
  npSetup: { t: 'money', req: true, quick: [['ไม่มี', function () { return 0; }]], label: function () { return 'เงินก้อนตอนเริ่ม'; }, ph: function () { return 20000; },
    help: function () { return 'เช่น อุปกรณ์ ทดลองสูตร ของล็อตแรก ทำแพ็กเกจ'; } },

  /* ส่งฟรีหรือช่วยค่าส่ง */
  shipCost: { t: 'money', req: true, label: function (i, m, d) { return isKind(d, 'part') ? 'ร้านช่วยค่าส่งออร์เดอร์ละ' : 'ค่าส่งเฉลี่ยต่อออร์เดอร์ ที่ร้านจ่ายแทนลูกค้า'; }, ph: function () { return 40; } },
  shipShare: { t: 'pct', req: true, label: function () { return 'ออร์เดอร์ที่ซื้อถึงขั้นต่ำ คิดเป็นกี่ % ของออร์เดอร์ทั้งหมด'; }, suf: function () { return '%'; }, show: function (i, m, d) { return isKind(d, 'min'); } },
  perOrder: { t: 'dec', req: true, min: 1, label: function (i, m) { return 'เฉลี่ยออร์เดอร์ละกี่' + U(i, m); }, suf: function (i, m) { return U(i, m); },
    quick: [['ออร์เดอร์ละ 1', function () { return 1; }]] },
  shipLift: { t: 'dec', req: true, max: 1000, quick: [['ยอดไม่เพิ่ม', function () { return 0; }]], label: function () { return 'คาดว่ายอดขายจะเพิ่มขึ้น'; }, suf: function () { return '%'; },
    help: function () { return 'ไม่รู้ใส่ 0 ไว้ก่อน แล้วดูในหน้าผลว่าต้องเพิ่มเท่าไรถึงจะคุ้ม'; } },

  /* ยิงโฆษณาออนไลน์ */
  adBudget: { t: 'money', req: true, label: function () { return 'งบโฆษณาต่อเดือน'; }, ph: function () { return 5000; } },
  adMgmt: { t: 'money', req: true, quick: [['ทำเอง ไม่มี', function () { return 0; }]], label: function () { return 'ค่าจ้างคนดูแลโฆษณาต่อเดือน'; } },
  adSetup: { t: 'money', req: true, quick: [['ไม่มี', function () { return 0; }]], label: function () { return 'ค่าทำภาพหรือคลิปโฆษณาครั้งแรก'; } },
  adGain: { t: 'dec', label: function (i, m) { return expectWord(m); }, suf: function (i, m) { return gainUnit(i, m); }, ph: phGain,
    help: function (i, m) { return 'ไม่รู้เว้นว่างไว้ แล้วดูในหน้าผลว่าต้อง' + gainWord(m) + 'เท่าไรถึงจะคุ้มค่าโฆษณา'; } },

  /* เปลี่ยนซัพพลายเออร์ */
  newCost: { t: 'money', req: true, label: function (i, m) { return 'ต้นทุนต่อ' + U(i, m) + ' กับเจ้าใหม่'; },
    help: function (i, m) { return 'ตอนนี้ ' + fmtN(n0(i.unitCost), 2) + ' บาท'; } },
  supSales: { t: 'signed', req: true, words: ['มากขึ้น', 'น้อยลง'], quick: [['เท่าเดิม', function () { return 0; }]],
    label: function (i, m) { return 'ยอดขายหลังเปลี่ยน เทียบกับตอนนี้'; }, suf: function () { return '%'; }, max: 500, min: -90,
    help: function () { return 'ของถูกลงแต่คุณภาพเปลี่ยน ลูกค้าบางคนอาจหาย · ของดีขึ้นอาจขายได้มากขึ้น'; } },
  supStock: { t: 'int', max: 365, label: function () { return 'เจ้าใหม่สั่งขั้นต่ำ ต้องเก็บของไว้กี่วัน'; }, suf: function () { return 'วัน'; },
    show: function (i, m) { return m !== 'service'; }, help: function (i) { return 'ตอนนี้ ' + fmtN(n0(i.stockDays)) + ' วัน · ถ้าไม่เปลี่ยน เว้นว่างไว้'; } },
  supCredit: { t: 'int', max: 365, label: function () { return 'เจ้าใหม่ให้จ่ายเงินช้าได้กี่วัน'; }, suf: function () { return 'วัน'; },
    show: function (i, m) { return m !== 'service'; }, help: function (i) { return 'ตอนนี้ ' + fmtN(n0(i.supplierCreditDays)) + ' วัน · ถ้าไม่เปลี่ยน เว้นว่างไว้'; } },
  switchCost: { t: 'money', req: true, quick: [['ไม่มี', function () { return 0; }]], label: function () { return 'ค่าใช้จ่ายครั้งเดียวตอนเปลี่ยน'; },
    help: function () { return 'เช่น ทดลองของ ค่าขนส่งรอบแรก ของเดิมที่ต้องทิ้ง'; } },

  /* จ้างฟรีแลนซ์ */
  flFee: { t: 'money', req: true, label: function (i, m, d) { return isKind(d, 'live') ? 'ค่าจ้างคนไลฟ์ต่อเดือน รวมทุกครั้ง' : isKind(d, 'admin') ? 'ค่าจ้างแอดมินต่อเดือน' : 'ค่าจ้างต่อเดือน'; }, ph: function () { return 6000; } },
  flPct: { t: 'pct', max: 90, label: function () { return 'ค่าคอมจากยอดที่ขายได้เพิ่ม'; }, suf: function () { return '% ของยอดขาย'; },
    show: function (i, m, d) { return isKind(d, 'live') && isVolModel(m); }, help: function () { return 'ถ้าจ่ายแค่ค่าจ้าง เว้นว่างไว้'; } },
  flGain: { t: 'dec', label: function (i, m) { return expectWord(m); }, suf: function (i, m) { return gainUnit(i, m); }, ph: phGain,
    help: function (i, m) { return 'ไม่รู้เว้นว่างไว้ แล้วดูในหน้าผลว่าต้อง' + gainWord(m) + 'เท่าไรถึงจะคุ้ม'; } }
};
function priceWord(i, m) { return { subscription: 'ค่าสมาชิกรอบ', project: 'งาน', rental: periodWord(i) }[m] || U(i, m); }
function npUnit(m) { return m === 'service' ? 'ครั้ง' : 'ชิ้น'; }

/* ขั้นของคำถามแต่ละเรื่อง · เรื่องที่มีหลายแบบ ข้อแรกให้เลือกแบบ */
var KIND_Q = { hire: 'จ้างแบบไหน', price: 'ขึ้นราคาแบบไหน', promo: 'จัดโปรแบบไหน', newprod: 'เพิ่มอะไร', freeship: 'ช่วยค่าส่งแบบไหน',
  ads: 'โฆษณาที่ไหน', channel: 'ช่องทางไหน', supplier: 'เจ้าใหม่เป็นแบบไหน', freelance: 'จ้างฟรีแลนซ์ทำอะไร' };
function dStepsFor(t, inp, m) {
  var S = KIND_Q[t] ? [{ id: 'kind', q: KIND_Q[t], f: ['kind'] }] : [];
  if (t === 'hire') return S.concat([
    { id: 'who', q: 'จ้างกี่คน จ่ายเท่าไร', f: ['count', 'salary', 'partRate', 'partHours', 'partDays', 'pieceRate', 'pieceShare'] },
    { id: 'gain', q: 'จ้างแล้วร้านได้อะไรเพิ่ม', p: 'ไม่รู้ก็เว้นว่างได้ แล้วดูว่าต้องได้เท่าไรถึงจะคุ้ม', f: ['gain', 'capAdd', 'ramp', 'hours'] }
  ]);
  if (t === 'price') return S.concat([
    { id: 'raise', q: 'ขึ้นราคาเท่าไร', f: ['raiseBy', 'raiseShare'] },
    { id: 'lost', q: salesWord(m) + 'จะลดลงไหม', p: 'ลูกค้าบางคนอาจซื้อน้อยลงหรือไปร้านอื่น', f: ['lostPct'] }
  ]);
  if (t === 'promo') return S.concat([
    { id: 'deal', q: 'โปรนี้ให้อะไรลูกค้า นานแค่ไหน', f: ['discPct', 'giftCost', 'usePct', 'promoMonths'] },
    { id: 'lift', q: 'คาดว่ายอดขายจะเป็นอย่างไร', f: ['lift', 'afterPct', 'promoCost'] }
  ]);
  if (t === 'newprod') return S.concat([
    { id: 'what', q: 'ราคาและต้นทุนของใหม่', f: ['npPrice', 'npCost'] },
    { id: 'qty', q: 'คาดว่าจะขายได้เท่าไร', f: ['npQty', 'npAttach', 'npCanni', 'ramp'] },
    { id: 'cost', q: 'เงินที่ต้องใช้เพิ่ม', f: ['npFixed', 'npSetup'] }
  ]);
  if (t === 'freeship') return S.concat([
    { id: 'cost', q: 'ร้านต้องจ่ายค่าส่งเท่าไร', f: ['shipCost', 'shipShare', 'perOrder'] },
    { id: 'lift', q: 'คาดว่ายอดขายจะเพิ่มเท่าไร', f: ['shipLift', 'ramp'] }
  ]);
  if (t === 'ads') return S.concat([
    { id: 'money', q: 'ค่าโฆษณาเท่าไร', f: ['adBudget', 'adMgmt', 'adSetup'] },
    { id: 'gain', q: 'คาดว่าจะได้อะไรเพิ่ม', p: 'ไม่รู้ก็เว้นว่างได้ แล้วดูว่าต้องได้เท่าไรถึงจะคุ้ม', f: ['adGain', 'ramp'] }
  ]);
  if (t === 'channel') return S.concat([
    { id: 'ch', q: 'หักส่วนแบ่งเท่าไร ขายราคาเท่าไร', f: ['cut', 'chPrice'] },
    { id: 'qty', q: 'คาดว่าจะขายผ่านช่องทางนี้ได้เท่าไร', f: ['chQty', 'movePct', 'ramp'] },
    { id: 'cost', q: 'ค่าใช้จ่ายที่เพิ่มขึ้น', f: ['extraCost', 'chFee'] }
  ]);
  if (t === 'freelance') return S.concat([
    { id: 'pay', q: 'ค่าจ้างเท่าไร', f: ['flFee', 'flPct'] },
    { id: 'gain', q: 'จ้างแล้วร้านได้อะไรเพิ่ม', p: 'ไม่รู้ก็เว้นว่างได้ แล้วดูว่าต้องได้เท่าไรถึงจะคุ้ม', f: ['flGain', 'ramp', 'hours'] }
  ]);
  if (t === 'supplier') return S.concat([
    { id: 'cost', q: 'ต้นทุนกับเจ้าใหม่', f: ['newCost', 'supStock', 'supCredit', 'switchCost'] },
    { id: 'sales', q: 'ยอดขายหลังเปลี่ยนจะเป็นอย่างไร', f: ['supSales'] }
  ]);
  if (t === 'place') return [
    { id: 'rent', q: 'ที่ใหม่ค่าเช่าเท่าไร ' + salesWord(m) + 'จะเป็นอย่างไร', f: ['newRent', 'salesPct'] },
    { id: 'move', q: 'เงินและเวลาที่ใช้ตอนย้าย', f: ['moveCost', 'closedDays', 'dipPct', 'backMonths'] }
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

/* ตัวอย่างการตัดสินใจของร้านตัวอย่าง (ใช้เมื่อกด "ดูตัวอย่าง" เท่านั้น)
   ร้านกาแฟ = ร้านหน้าร้าน (ขายของที่ทำเอง) · ร้านเสื้อผ้าออนไลน์ = ร้านออนไลน์ (ซื้อมาขายไป) ใช้ตัวเลขร้านตัวอย่างชุดเดียวกับตัวที่ 1 */
var SAMPLES = {
  cafe: { m: 'unit', name: 'ร้านกาแฟตัวอย่าง', short: 'ร้านกาแฟ', where: 'shop' },
  online: { m: 'resell', name: 'ร้านเสื้อผ้าออนไลน์ตัวอย่าง', short: 'ร้านเสื้อผ้าออนไลน์', where: 'online' }
};
var SAMPLE_DEC = {
  hire: { kind: 'full', count: 1, salary: 12000, gain: 20, capAdd: 40, ramp: 1 },
  price: { kind: 'all', raiseBy: 5, lostPct: 5 },
  promo: { kind: 'disc', discPct: 20, promoMonths: 1, lift: 30, afterPct: 5, promoCost: 3000 },
  newprod: { kind: 'new', npPrice: 55, npCost: 20, npQty: 15, npCanni: 20, npFixed: 1000, npSetup: 20000, ramp: 1 },
  freeship: { kind: 'part', shipCost: 15, perOrder: 2, shipLift: 10, ramp: 1 },
  ads: { kind: 'social', adBudget: 5000, adMgmt: 0, adSetup: 2000, adGain: 8, ramp: 1 },
  channel: { kind: 'delivery', chName: 'แอปส่งอาหาร', cut: 30, chPrice: 75, chQty: 25, movePct: 20, ramp: 3, extraCost: 3, chFee: 1500 },
  freelance: { kind: 'content', flFee: 5000, flGain: 6, ramp: 2, hours: 1 },
  equip: { price: 120000, life: 5, eqCap: 60, eqGain: 15, costDown: 1, fixedChg: 800, ramp: 1 },
  supplier: { kind: 'cheaper', newCost: 19, supSales: -3, switchCost: 5000 },
  place: { newRent: 26000, salesPct: 20, moveCost: 150000, closedDays: 7, dipPct: 30, backMonths: 3 },
  branch: { setup: 400000, bRent: 15000, bStaff: 2, bSalary: 12000, bOther: 8000, bPct: 70, ramp: 6 }
};
var SAMPLE_DEC_ON = {
  hire: { kind: 'part', count: 1, partRate: 60, partHours: 5, partDays: 26, gain: 60, ramp: 1, hours: 4 },
  price: { kind: 'all', raiseBy: 30, lostPct: 5 },
  promo: { kind: 'code', discPct: 15, usePct: 40, promoMonths: 1, lift: 25, afterPct: 5, promoCost: 2000 },
  newprod: { kind: 'addon', npPrice: 150, npCost: 60, npAttach: 15, npFixed: 0, npSetup: 15000, ramp: 1 },
  freeship: { kind: 'min', shipCost: 45, shipShare: 50, perOrder: 1.5, shipLift: 12, ramp: 1 },
  ads: { kind: 'tiktok', adBudget: 8000, adMgmt: 0, adSetup: 3000, adGain: 60, ramp: 1 },
  channel: { kind: 'social', chName: 'TikTok Shop หรือไลฟ์', cut: 8, chPrice: 390, chQty: 120, movePct: 20, extraCost: 10, chFee: 3000, ramp: 2 },
  freelance: { kind: 'live', flFee: 8000, flPct: 5, flGain: 100, ramp: 1 },
  equip: { price: 25000, life: 3, eqGain: 20, costDown: 0, fixedChg: 300, ramp: 1 },
  supplier: { kind: 'cheaper', newCost: 165, supSales: -4, supStock: 60, supCredit: 0, switchCost: 5000 },
  place: { newRent: 12000, salesPct: 15, moveCost: 80000, closedDays: 3, dipPct: 10, backMonths: 1 },
  branch: { setup: 200000, bRent: 10000, bStaff: 1, bSalary: 12000, bOther: 4000, bPct: 50, ramp: 6 }
};
/* ค่าเริ่มของช่องที่ไม่บังคับ = 0 · count เริ่มที่ 1 */
var DEC_DEFAULT = { hire: { count: 1 } };

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
    d: 'เช็กว่าลูกค้าย่านใหม่ซื้ออะไร ในราคาเท่าไร', tools: ['cust3', 'cust1'], lever: null },

  r_comp: { q: function () { return 'ร้านอื่นที่ขายของแบบเดียวกัน ขายถูกกว่าราคาใหม่ไหม'; }, p: 'ราคาใหม่เทียบกับร้านอื่น',
    d: 'เช็กราคาของร้านที่ลูกค้าเลือกแทนได้ เทียบกับราคาใหม่', tools: ['grow13', 'comp3'], lever: 'raiseBy' },
  r_why: { q: function () { return 'ลูกค้าส่วนใหญ่เลือกร้านคุณเพราะราคาถูกไหม'; }, p: 'เหตุผลที่ลูกค้าเลือกร้าน',
    d: 'เช็กว่าลูกค้าซื้อเพราะราคา หรือเพราะเรื่องอื่นที่ยังอยู่หลังขึ้นราคา', tools: ['cust4', 'bmc5'], lever: 'lostPct' },
  r_guess: { q: function (i, m) { return salesWord(m) + 'ที่คาดว่าจะลดลง มาจากการเดามากกว่าเคยลองจริงไหม'; }, p: 'ที่มาของยอดที่จะลดลง',
    d: 'เช็กว่าเคยขึ้นราคาแล้วลูกค้าลดลงเท่าไร หรือลองขึ้นบางตัวก่อนได้ไหม', tools: ['grow13'], lever: 'lostPct' },
  r_cost: { q: function () { return 'ที่ต้องขึ้นราคาเพราะต้นทุนขึ้น และต้นทุนอาจขึ้นอีกไหม'; }, p: 'ต้นทุนที่อาจขึ้นอีก',
    d: 'เช็กว่าต้นทุนตัวไหนขึ้น และราคาใหม่ยังพอถ้าต้นทุนขึ้นอีกรอบ', tools: ['grow15'], lever: 'raiseBy' },

  pr_old: { q: function () { return 'คนที่จะได้ส่วนลดส่วนใหญ่ เป็นลูกค้าเดิมที่ซื้ออยู่แล้วไหม'; }, p: 'ใครได้ส่วนลด',
    d: 'เช็กว่าส่วนลดไปถึงลูกค้าใหม่กี่คน ลูกค้าเดิมที่ได้ส่วนลดทำให้ร้านได้เงินน้อยลงโดยยอดไม่เพิ่ม', tools: ['cust4', 'bmc8'], lever: 'discPct',
    when: function (i, m, d) { return !isKind(d, 'gift'); } },
  pr_guess: { q: function () { return 'ยอดที่คาดว่าจะเพิ่มช่วงโปร มาจากการเดามากกว่าโปรที่เคยจัดไหม'; }, p: 'ที่มาของยอดที่เพิ่มช่วงโปร',
    d: 'เช็กยอดช่วงที่เคยจัดโปร เทียบกับช่วงปกติ', tools: ['grow9'], lever: 'lift' },
  pr_after: { q: function () { return 'หลังจบโปร ลูกค้าอาจรอโปรรอบหน้า แทนการซื้อราคาปกติไหม'; }, p: 'ลูกค้าที่รอแต่โปร',
    d: 'เช็กว่ายอดหลังจบโปรกลับมาเท่าเดิมไหม หรือลูกค้าเริ่มรอส่วนลด', tools: ['cust4', 'grow2'], lever: 'afterPct' },
  pr_cap: { q: function () { return 'ถ้ายอดเพิ่มตามที่คาด ร้านอาจทำหรือส่งของไม่ทันไหม'; }, p: 'กำลังรับออร์เดอร์ช่วงโปร',
    d: 'เช็กว่าช่วงโปรร้านทำทัน โดยลูกค้าไม่ต้องรอนาน', tools: ['grow7'], lever: null },

  n_ask: { q: function () { return 'ของใหม่นี้มาจากที่คุณอยากขาย มากกว่าที่ลูกค้าเคยถามหาไหม'; }, p: 'ลูกค้าอยากได้จริงไหม',
    d: 'เช็กว่ามีลูกค้าถามหา หรือซื้อของแบบนี้จากที่อื่นอยู่แล้ว', tools: ['cust3', 'idea8'], lever: 'npQty' },
  n_canni: { q: function () { return 'ของใหม่คล้ายของเดิม จนลูกค้าอาจซื้อแทนกันไหม'; }, p: 'ของใหม่แย่งยอดของเดิม',
    d: 'เช็กว่าลูกค้าซื้อของใหม่เพิ่ม หรือซื้อแทนของเดิม', tools: ['grow10'], lever: 'npCanni', when: function (i, m, d) { return !isKind(d, 'addon'); } },
  n_work: { q: function () { return 'ของใหม่ทำให้งานในร้านช้าลง หรือต้องใช้คนเพิ่มไหม'; }, p: 'งานที่เพิ่มขึ้น',
    d: 'เช็กว่าเวลาและคนที่มีพอทำของใหม่ โดยของเดิมไม่ช้าลง', tools: ['grow6', 'grow7'], lever: 'npFixed' },
  n_waste: { q: function () { return 'ถ้าขายไม่หมด ของใหม่ต้องทิ้ง หรือค้างสต็อกนานไหม'; }, p: 'ของที่เหลือ',
    d: 'เช็กว่าถ้าขายได้น้อยกว่าที่คาด จะเหลือทิ้งหรือค้างเท่าไร', tools: ['grow15'], lever: 'npCost' },
  n_launch: { q: function () { return 'ยังไม่ได้ลองขายของใหม่กับลูกค้าจริงสักกลุ่มไหม'; }, p: 'ลองขายก่อนลงเงินเต็ม',
    d: 'เช็กว่าลองขายจำนวนน้อยก่อนได้ไหม ก่อนลงเงินก้อน', tools: ['goal3'], lever: 'npSetup' },

  f_why: { q: function () { return 'ลูกค้าที่ทักมาแล้วไม่ซื้อ ส่วนใหญ่ไม่ได้ติดเรื่องค่าส่งไหม'; }, p: 'ลูกค้าไม่ซื้อเพราะค่าส่งจริงไหม',
    d: 'เช็กว่าลูกค้าที่ทักมาแล้วไม่ซื้อ ติดเรื่องค่าส่งกี่คน', tools: ['cust6'], lever: 'shipLift' },
  f_cost: { q: function () { return 'ค่าส่งแต่ละออร์เดอร์ต่างกันมาก เช่น ของหนักหรือส่งไกลไหม'; }, p: 'ค่าส่งที่ไม่เท่ากัน',
    d: 'เช็กค่าส่งของออร์เดอร์ที่แพงที่สุด ว่าร้านยังเหลือเงินไหม', tools: ['grow15'], lever: 'shipCost' },
  f_comp: { q: function () { return 'ร้านอื่นส่งฟรีอยู่แล้ว จนลูกค้ามองว่าเป็นเรื่องปกติไหม'; }, p: 'ส่งฟรีเป็นเรื่องปกติของตลาด',
    d: 'เช็กว่าส่งฟรีช่วยให้ลูกค้าเลือกคุณ หรือแค่ทำให้เท่าร้านอื่น', tools: ['comp3', 'grow13'], lever: null },
  f_basket: { q: function () { return 'ลูกค้าอาจซื้อแค่พอถึงขั้นต่ำ แล้วไม่ซื้อเพิ่มอีกไหม'; }, p: 'ยอดต่อออร์เดอร์',
    d: 'เช็กว่ายอดต่อออร์เดอร์เพิ่มขึ้นจริงหลังตั้งขั้นต่ำ', tools: ['bmc8'], lever: 'perOrder', when: function (i, m, d) { return isKind(d, 'min'); } },

  a_track: { q: function () { return 'ตอนนี้ยังนับไม่ได้ว่าลูกค้าแต่ละคนมาจากโฆษณาหรือไม่'; }, p: 'นับลูกค้าจากโฆษณา',
    d: 'เช็กว่าจะนับยอดที่มาจากโฆษณาอย่างไร ไม่อย่างนั้นจะไม่รู้ว่าคุ้มไหม', tools: ['grow9'], lever: 'adGain' },
  a_guess: { q: function () { return 'ยอดที่คาดว่าจะเพิ่ม มาจากการเดามากกว่าโฆษณาที่เคยลองไหม'; }, p: 'ที่มาของยอดที่คาด',
    d: 'เช็กว่าเคยลองงบน้อย ๆ แล้วได้ลูกค้ากี่คน', tools: ['grow9', 'cont9'], lever: 'adGain' },
  a_who: { q: function () { return 'ยังไม่แน่ใจว่าลูกค้าของคุณใช้แอปที่จะลงโฆษณาไหม'; }, p: 'ลูกค้าอยู่ที่ไหน',
    d: 'เช็กว่าลูกค้าใช้แอปไหน ก่อนเลือกที่ลงโฆษณา', tools: ['cust5', 'cont6'], lever: null },
  a_repeat: { q: function () { return 'ลูกค้าส่วนใหญ่ซื้อครั้งเดียว ไม่ค่อยกลับมาซื้อซ้ำไหม'; }, p: 'ลูกค้าใหม่กลับมาซื้อซ้ำไหม',
    d: 'เช็กว่าลูกค้าจากโฆษณากลับมาซื้อเองไหม ถ้าไม่กลับ ต้องจ่ายค่าโฆษณาทุกครั้งที่ขาย', tools: ['bmc8', 'cust4'], lever: null },
  a_page: { q: function () { return 'คนที่กดโฆษณาเข้ามา อาจเจอหน้าร้านหรือเพจที่ยังไม่พร้อมขายไหม'; }, p: 'หน้าร้านที่คนกดเข้ามาเจอ',
    d: 'เช็กว่ารูป ราคา และวิธีสั่งชัดพอ คนที่กดเข้ามาจะซื้อได้ทันที', tools: ['cust6'], lever: null },

  s_quality: { q: function () { return 'ของจากเจ้าใหม่ยังไม่ได้ลองใช้จริงกับลูกค้าไหม'; }, p: 'คุณภาพของเจ้าใหม่',
    d: 'เช็กว่าลองใช้ของเจ้าใหม่กับลูกค้าจำนวนน้อยก่อนได้ไหม', tools: ['grow10'], lever: 'supSales' },
  s_steady: { q: function () { return 'เจ้าใหม่อาจส่งของช้า หรือของขาดบางช่วงไหม'; }, p: 'ส่งของสม่ำเสมอไหม',
    d: 'เช็กว่าเจ้าใหม่ส่งของตรงเวลา และมีเจ้าสำรองถ้าของขาด', tools: ['goal4', 'swot5'], lever: null },
  s_min: { q: function () { return 'เจ้าใหม่ให้สั่งขั้นต่ำมาก จนต้องเก็บของนานขึ้นไหม'; }, p: 'ของที่ต้องเก็บเพิ่ม',
    d: 'เช็กเงินที่ต้องจมกับของในสต็อก และของที่อาจเสียก่อนขาย', tools: ['grow15'], lever: 'supStock', when: function (i, m) { return m !== 'service'; } },
  s_price: { q: function () { return 'ราคาที่ได้เป็นราคาช่วงแรก ที่อาจขึ้นภายหลังไหม'; }, p: 'ราคาของเจ้าใหม่ในระยะยาว',
    d: 'เช็กว่าราคานี้ใช้ได้นานแค่ไหน', tools: ['grow15'], lever: 'newCost' },

  fl_task: { q: function () { return 'ยังไม่ได้เขียนไว้ว่าฟรีแลนซ์ต้องทำอะไร และวัดผลอย่างไรไหม'; }, p: 'งานและผลที่ต้องได้',
    d: 'เช็กว่างานที่จ้างชัด และรู้ว่าวัดอย่างไรว่าได้ผล', tools: ['goal8'], lever: null },
  fl_guess: { q: function () { return 'ยอดที่คาดว่าจะเพิ่ม มาจากการเดามากกว่าตัวเลขจริงไหม'; }, p: 'ที่มาของยอดที่คาด',
    d: 'เช็กยอดช่วงที่คุณทำงานนี้เองได้เต็มที่ เทียบกับช่วงที่ทำไม่ทัน', tools: ['grow9'], lever: 'flGain' },
  fl_owner: { q: function () { return 'งานนี้ยังต้องรอคุณตรวจหรือตอบเองอยู่ดีไหม'; }, p: 'งานที่ยังติดอยู่กับคุณ',
    d: 'เช็กว่าส่งงานต่อได้จริงแค่ไหน เวลาที่ได้คืนมากหรือน้อยตามนี้', tools: ['grow6'], lever: 'hours', when: function (i, m, d) { return !isKind(d, 'live'); } },
  fl_voice: { q: function () { return 'ลูกค้าซื้อเพราะได้คุยกับคุณ หรือชอบที่คุณไลฟ์เองไหม'; }, p: 'ลูกค้าที่ผูกกับตัวคุณ',
    d: 'เช็กว่าลูกค้าจะยังซื้อ เมื่อคนอื่นตอบหรือไลฟ์แทน', tools: ['cust4'], lever: 'flGain' }
};
var QSET3 = {
  hire: ['h_owner', 'h_turn', 'h_peak', 'h_train', 'h_slow'],
  place: ['p_why', 'p_traffic', 'p_regular', 'p_budget', 'p_lease'],
  channel: ['c_price', 'c_move', 'c_who', 'c_cap', 'c_hidden'],
  equip: ['e_slow', 'e_demand', 'e_hidden', 'e_life'],
  branch: ['b_owner', 'b_system', 'b_place', 'b_cash', 'b_demand'],
  price: ['r_comp', 'r_why', 'r_guess', 'r_cost'],
  promo: ['pr_old', 'pr_guess', 'pr_after', 'pr_cap'],
  newprod: ['n_ask', 'n_canni', 'n_work', 'n_waste', 'n_launch'],
  freeship: ['f_why', 'f_cost', 'f_comp', 'f_basket'],
  ads: ['a_track', 'a_guess', 'a_who', 'a_repeat', 'a_page'],
  supplier: ['s_quality', 's_steady', 's_min', 's_price'],
  freelance: ['fl_task', 'fl_guess', 'fl_owner', 'fl_voice']
};
/* เครื่องมือ PL1 ที่ช่วยคิดเรื่องนี้โดยตรง (แสดงในหน้าผลเสมอ) */
var TOPIC_TOOLS = { hire: ['goal8', 'grow6', 'grow7'], place: ['grow14', 'idea7'], channel: ['cust5', 'bmc10'], equip: ['grow7', 'grow15'], branch: ['grow7', 'idea7', 'grow6'],
  price: ['grow13', 'comp3'], promo: ['bmc8', 'cust4'], newprod: ['idea8', 'cust3', 'goal3'], freeship: ['cust6', 'grow13'], ads: ['cont9', 'grow9', 'cust5'],
  supplier: ['grow15', 'goal4'], freelance: ['goal8', 'grow6'] };
