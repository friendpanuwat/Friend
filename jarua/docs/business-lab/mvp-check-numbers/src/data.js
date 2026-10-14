/* ============================================================
   DATA — รูปแบบรายได้ 8 แบบ (ตรงกับ PL2 v4) · ช่องกรอก · ตัวเลขที่ปรับได้ · คลังคำถาม · เครื่องมือ PL1
   ============================================================ */

/* ตารางนี้จำลองตาราง pl1dev.tool_meta (tool, title, subtitle)
   โค้ดอ้างเครื่องมือด้วยรหัสเท่านั้น ชื่อและคำโปรยที่แสดงดึงจากตารางนี้ (ของจริงดึงจากฐานข้อมูล) */
var TOOLS = {
  bmc1: ['ตรวจสุขภาพธุรกิจ', 'ตรวจ 9 ส่วนของธุรกิจ หาต้นเหตุปัญหา และรู้ว่าต้องแก้อะไรก่อน'],
  bmc2: ['หาลูกค้าที่ใช่', 'เลือกกลุ่มลูกค้ากลุ่มแรกที่ควรเจาะ'],
  bmc3: ['แบ่งกลุ่มลูกค้า', 'แบ่งลูกค้าที่มีอยู่ และดูแลแต่ละกลุ่มให้ถูกวิธี'],
  bmc5: ['เช็กความแข็งแรงของจุดขาย', 'รู้ว่าลูกค้าแคร์จริงไหม และคู่แข่งลอกได้ง่ายแค่ไหน'],
  bmc7: ['วิเคราะห์ที่มาของรายได้', 'รู้ว่าเงินมาจากไหน และพึ่งแหล่งเดียวมากไปไหม'],
  bmc8: ['เพิ่มรายได้จากลูกค้าเดิม', 'จัดชุด ขายเพิ่ม และชวนซื้อซ้ำ โดยไม่ต้องหาลูกค้าใหม่'],
  bmc9: ['จัดลำดับความสำคัญของงาน', 'รู้ว่างานไหนช่วยเป้าหมาย และงานไหนเลิกได้'],
  bmc10: ['เลือกช่องทางขายที่ได้ผล', 'รู้ว่าช่องทางไหนควรเก็บ เพิ่ม หรือเลิก'],
  comp6: ['วางแผนรับมือคู่แข่ง', 'ตัดสินใจรับมือเมื่อคู่แข่งออกโปร โดยไม่ทำร้ายตัวเอง'],
  cont6: ['เลือกแพลตฟอร์มที่ควรโฟกัส', 'ทุ่มเวลาให้ถูกที่ รวมถึง LINE OA และแผนที่ออนไลน์'],
  cust1: ['สร้างข้อมูลลูกค้าเป้าหมาย', 'รู้ว่าลูกค้าตัวจริงคือใคร และไปหาเพิ่มที่ไหน'],
  cust2: ['ค้นหาปัญหาของลูกค้า', 'รู้ว่าลูกค้าติดอะไร และต้องแก้ที่จุดไหน'],
  cust4: ['วิเคราะห์พฤติกรรมการซื้อ', 'รู้ว่าลูกค้าซื้อเพราะอะไร และควรตามเมื่อไหร่'],
  cust5: ['ค้นหาช่องทางที่ลูกค้าใช้งาน', 'รู้ว่าช่องทางไหนทำเงิน และควรเลิกช่องทางไหน'],
  cust6: ['ค้นหาสาเหตุที่ลูกค้าไม่ซื้อ', 'รู้ว่าลูกค้าหายไปเพราะอะไร พร้อมสคริปต์ตอบ'],
  goal1: ['ตั้งเป้าหมายธุรกิจให้ชัด', 'เปลี่ยนความอยากเป็นเป้าหมายที่มีตัวเลขและที่มา'],
  goal4: ['เตรียมแผนรับมือเหตุไม่คาดฝัน', 'รู้ล่วงหน้าว่าวันที่เกิดเรื่องต้องทำอะไร'],
  goal8: ['วางแผนมอบหมายงานให้คนอื่น', 'รู้ว่างานไหนปล่อยได้ก่อน และส่งต่ออย่างไรไม่ให้คุณภาพตก'],
  grow2: ['ดูสาเหตุที่ยอดขายไม่คงที่', 'ดูว่าเดือนไหนแกว่งเพราะอะไร จากยอดขายและเหตุการณ์จริง'],
  grow3: ['หาสาเหตุที่ยอดขายตกฉับพลัน', 'เทียบยอดต่อวันให้รู้ว่าตกจริงแค่ไหน และตกเพราะอะไร'],
  grow5: ['คุณใช้ข้อมูลหรือความรู้สึก?', 'เช็กว่าแต่ละด้านตัดสินใจจากอะไร และควรเริ่มจดอะไรก่อน'],
  grow6: ['ค้นหางานที่ติดอยู่กับเจ้าของ', 'หาว่างานไหนควรปล่อย ทำให้ง่ายลง หรือเลิกทำ'],
  grow7: ['เช็กความพร้อมก่อนขยายธุรกิจ', 'ดูว่าคน งาน เงิน ลูกค้า และสต็อก รับการขยายไหวไหม'],
  grow9: ['ดูว่าการตลาดเริ่มไม่เวิร์กหรือไม่', 'เทียบตัวเลขช่วงที่ได้ผลกับตอนนี้ และหาว่าติดที่ขั้นไหน'],
  grow10: ['ดูว่าสินค้ายังตรงกับตลาดไหม', 'ตัดสินรายสินค้าจากยอดขายและเสียงลูกค้าจริง'],
  grow11: ['ธุรกิจตามหลังคู่แข่งไม่ทันหรือไม่', 'แยกว่าตามหลังจริงด้านไหน และด้านไหนไม่ต้องไล่ตาม'],
  grow12: ['ดูว่าตลาดเริ่มอิ่มตัวหรือไม่', 'อ่านสัญญาณตลาด และแยกปัญหาของตลาดออกจากปัญหาของร้าน'],
  grow13: ['ดูว่าราคายังแข่งขันได้หรือไม่', 'คำนวณกำไร ส่วนต่างกับคู่แข่ง และผลถ้าลดราคาตาม'],
  grow14: ['วิเคราะห์ความเหมาะสมของทำเล', 'ดูว่าทำเลฉุดจริงไหม และแก้อะไรได้ก่อนคิดย้าย'],
  grow15: ['ดูว่าต้นทุนกำลังฉุดรั้งธุรกิจหรือไม่', 'คำนวณต้นทุนคงที่ กำไร และยอดขายที่ไม่ขาดทุน'],
  idea8: ['ต่อยอดธุรกิจเดิมด้วยไอเดียใหม่', 'เพิ่มสินค้า บริการ หรือช่องทางขาย จากสิ่งที่มีอยู่แล้ว'],
  swot4: ['หาโอกาสในการเติบโต', 'เลือกโอกาสที่คุ้มที่สุด พร้อมแผนทดลอง 2 สัปดาห์'],
  swot5: ['วิเคราะห์ความเสี่ยงของธุรกิจ', 'รู้สัญญาณเตือนล่วงหน้า และเตรียมแผนรับมือ'],
  ver8: ['หาช่องทางขายที่ไม่ต้องพึ่งคอนเทนต์', 'หาลูกค้าจากเครือข่ายและลูกค้าเก่า ไม่ต้องโพสต์ทุกวัน']
};

var MODEL_ORDER = ['unit', 'service', 'resell', 'subscription', 'project', 'rental', 'commission', 'other'];

var MODELS = {
  unit: {
    tile: 'ขายของที่ทำเอง', short: 'กาแฟ อาหาร ขนม',
    title: 'ขายของที่ทำเอง', ex: 'ร้านกาแฟ ร้านอาหาร เบเกอรี ขนม งานแฮนด์เมด',
    units: ['แก้ว', 'จาน', 'ชิ้น', 'กล่อง'], defUnit: 'แก้ว', defPer: 'day',
    sample: { unitLabel: 'แก้ว', price: 65, volume: 80, volumePer: 'day', daysOpen: 26, unitCost: 22, feePct: 6,
      staffCount: 2, staffSalary: 12000, ownerSalary: 15000, rent: 18000, marketing: 3000, otherFixed: 9000, cash: 30000, capacity: 140 }
  },
  service: {
    tile: 'ขายบริการ', short: 'ทำผม นวด ซ่อมรถ',
    title: 'ขายบริการ คิดเงินต่อครั้ง', ex: 'ร้านทำผม ร้านนวด คาร์แคร์ ช่างซ่อม คลินิก',
    units: ['ครั้ง', 'คน', 'คัน', 'ชั่วโมง'], defUnit: 'ครั้ง', defPer: 'day',
    sample: { unitLabel: 'ครั้ง', price: 350, volume: 14, volumePer: 'day', daysOpen: 26, unitCost: 60, feePct: 0,
      staffCount: 2, staffSalary: 15000, ownerSalary: 15000, rent: 12000, marketing: 2000, otherFixed: 6000, cash: 50000, capacity: 15 }
  },
  resell: {
    tile: 'ซื้อมาขายไป', short: 'เสื้อผ้า ของชำ ร้านออนไลน์',
    title: 'ซื้อมาขายไป', ex: 'ร้านเสื้อผ้าออนไลน์ ร้านขายของชำ ร้านอะไหล่ ตัวแทนจำหน่าย',
    units: ['ชิ้น', 'ตัว', 'กล่อง', 'แพ็ก'], defUnit: 'ชิ้น', defPer: 'month',
    sample: { unitLabel: 'ตัว', price: 390, volume: 420, volumePer: 'month', daysOpen: 30, unitCost: 180, feePct: 12,
      staffCount: 1, staffSalary: 12000, ownerSalary: 15000, rent: 0, marketing: 25000, otherFixed: 4000, cash: 80000,
      stockDays: 45, newCustomers: 120, repeatPerMonth: 0.2, lifespanMonths: 6 }
  },
  subscription: {
    tile: 'สมาชิก / แพ็กเกจ', short: 'ฟิตเนส คอร์สเรียน',
    title: 'สมาชิก หรือแพ็กเกจรายเดือน', ex: 'ฟิตเนส คอร์สเรียน ข้าวกล่องรายเดือน กล่องสมาชิก',
    sample: { fee: 1200, cycle: 1, members: 180, newMembers: 20, leaving: 24, costPerMember: 80, feePct: 3,
      staffCount: 3, staffSalary: 13000, ownerSalary: 20000, rent: 45000, marketing: 6000, otherFixed: 25000, cash: 100000, maxMembers: 250 }
  },
  project: {
    tile: 'รับงานโปรเจกต์', short: 'ออกแบบ รับเหมา จัดงาน',
    title: 'รับงานเป็นโปรเจกต์', ex: 'รับออกแบบ รับเหมาตกแต่ง ทำเว็บไซต์ จัดงาน ถ่ายภาพงานแต่ง',
    sample: { projectValue: 120000, projectsPerYear: 18, durationMonths: 2, directCostPct: 58, depositPct: 30,
      staffCount: 1, staffSalary: 20000, ownerSalary: 25000, rent: 8000, marketing: 5000, otherFixed: 6000, cash: 90000, creditDays: 30 }
  },
  rental: {
    tile: 'ให้เช่า / ให้จอง', short: 'ห้องพัก รถเช่า ชุดเช่า',
    title: 'ให้เช่า หรือให้จอง', ex: 'โฮมสเตย์ ห้องพัก รถเช่า ชุดเช่า ห้องประชุม',
    units: ['ห้อง', 'หลัง', 'คัน', 'ชุด'], defUnit: 'ห้อง',
    sample: { unitLabel: 'ห้อง', rentableUnits: 6, periodKind: 'night', pricePerPeriod: 1200, occupancy: 45, costPerOccupied: 180, feePct: 15,
      staffCount: 1, staffSalary: 12000, ownerSalary: 15000, rent: 15000, marketing: 3000, otherFixed: 12000, cash: 60000,
      season: { high: [11, 12, 1, 2], low: [6, 7, 8, 9], highPct: 40, lowPct: 40 } }
  },
  commission: {
    tile: 'นายหน้า / ตัวแทน', short: 'อสังหาฯ ประกัน',
    title: 'นายหน้า หรือตัวแทน ได้ค่าคอม', ex: 'นายหน้าอสังหาฯ ตัวแทนประกัน ตัวแทนขายรถ',
    sample: { dealsPerMonth: 1.5, avgDealValue: 2500000, commissionPct: 3, splitPct: 30,
      staffCount: 0, staffSalary: 0, ownerSalary: 20000, rent: 0, marketing: 15000, otherFixed: 5000, cash: 50000 }
  },
  other: {
    tile: 'รายได้อื่นรายเดือน', short: 'สปอนเซอร์ ลิขสิทธิ์',
    title: 'รายได้อื่นเป็นก้อนต่อเดือน', ex: 'ค่าสปอนเซอร์ ค่าลิขสิทธิ์ ค่าที่ปรึกษารายเดือน',
    sample: { amount: 40000, costPct: 10, staffCount: 0, staffSalary: 0, ownerSalary: 15000, rent: 0, marketing: 2000, otherFixed: 5000, cash: 30000 }
  }
};

function isVolModel(m) { return m === 'unit' || m === 'service' || m === 'resell'; }

/* ---------- ช่องกรอก ----------
   g = กลุ่ม (sell / var / fixed / cash / adv-*) · t = ชนิด · req = ต้องกรอก */
function U(inp, model) {
  if (model === 'subscription') return 'คน';
  if (model === 'project') return 'งาน';
  if (model === 'commission') return 'ดีล';
  return (inp.unitLabel || (MODELS[model].defUnit || 'หน่วย')).trim() || 'หน่วย';
}
function perWord(inp) { return inp.volumePer === 'month' ? 'เดือน' : 'วัน'; }
function periodWord(inp) { return inp.periodKind === 'month' ? 'เดือน' : 'คืน'; }

var FIELDS = [
  /* ----- volume models ----- */
  { k: 'unitLabel', g: 'sell', t: 'unit', models: ['unit', 'service', 'resell'], label: function () { return 'นับยอดขายเป็นอะไร'; } },
  { k: 'price', g: 'sell', t: 'money', req: true, models: ['unit', 'service', 'resell'],
    label: function (i, m) { return 'ราคาขายเฉลี่ยต่อ' + U(i, m); },
    help: function (i, m) { return 'ถ้ามีหลายราคา เอายอดขายทั้งเดือนหารด้วยจำนวน' + U(i, m) + 'ที่ขายได้'; } },
  { k: 'volume', g: 'sell', t: 'volume', req: true, models: ['unit', 'service', 'resell'],
    label: function (i, m) { return m === 'service' ? 'มีลูกค้าใช้บริการ' : 'ขายได้'; } },
  { k: 'daysOpen', g: 'sell', t: 'int', req: true, models: ['unit', 'service', 'resell'], suf: function () { return 'วัน'; },
    show: function (i) { return i.volumePer !== 'month'; }, label: function () { return 'เปิดขายเดือนละ'; } },
  { k: 'unitCost', g: 'var', t: 'money', req: true, models: ['unit', 'service', 'resell'],
    label: function (i, m) { return m === 'resell' ? 'ราคาที่ซื้อมาต่อ' + U(i, m) : 'ต้นทุนต่อ' + U(i, m); },
    help: function (i, m) {
      if (m === 'service') return 'ของที่ใช้ และค่ามือหรือค่าคอมที่จ่ายช่างต่อ' + U(i, m) + ' ยังไม่รวมเงินเดือนประจำ';
      if (m === 'resell') return 'รวมค่าส่งเข้าร้าน ยังไม่รวมค่าเช่าและเงินเดือน';
      return 'ค่าวัตถุดิบและบรรจุภัณฑ์ที่ใช้ทำ 1 ' + U(i, m) + ' ยังไม่รวมค่าเช่าและเงินเดือน';
    } },
  { k: 'feePct', g: 'var', t: 'pct', models: ['unit', 'service', 'resell'], label: function () { return 'ค่าธรรมเนียมที่โดนหักจากยอดขาย'; },
    help: function () { return 'เช่น ส่วนแบ่งแอปส่งอาหาร มาร์เก็ตเพลส ค่าธรรมเนียมบัตร ถ้าขายผ่านช่องทางนี้แค่บางส่วน ใส่ค่าเฉลี่ยของยอดขายทั้งหมด'; },
    suf: function () { return '% ของยอดขาย'; } },

  /* ----- subscription ----- */
  { k: 'fee', g: 'sell', t: 'money', req: true, models: ['subscription'], label: function () { return 'ค่าสมาชิกต่อรอบ'; } },
  { k: 'cycle', g: 'sell', t: 'cycle', models: ['subscription'], label: function () { return 'จ่ายรอบละ'; } },
  { k: 'members', g: 'sell', t: 'int', req: true, models: ['subscription'], suf: function () { return 'คน'; }, label: function () { return 'สมาชิกตอนนี้'; } },
  { k: 'newMembers', g: 'sell', t: 'dec', req: true, models: ['subscription'], suf: function () { return 'คน'; }, label: function () { return 'สมาชิกใหม่ต่อเดือน'; } },
  { k: 'leaving', g: 'sell', t: 'dec', req: true, models: ['subscription'], suf: function () { return 'คน'; }, label: function () { return 'สมาชิกที่เลิกต่อเดือน'; } },
  { k: 'costPerMember', g: 'var', t: 'money', models: ['subscription'], label: function () { return 'ต้นทุนต่อสมาชิก 1 คนต่อเดือน'; },
    help: function () { return 'ของหรือบริการที่ให้สมาชิก เช่น น้ำดื่ม ผ้าเช็ดตัว อาหาร ของในกล่อง'; } },
  { k: 'feePct', g: 'var', t: 'pct', models: ['subscription'], label: function () { return 'ค่าธรรมเนียมรับชำระเงิน'; }, suf: function () { return '% ของยอดขาย'; } },

  /* ----- project ----- */
  { k: 'projectValue', g: 'sell', t: 'money', req: true, models: ['project'], label: function () { return 'มูลค่าเฉลี่ยต่องาน'; } },
  { k: 'projectsPerYear', g: 'sell', t: 'dec', req: true, models: ['project'], suf: function () { return 'งาน'; }, label: function () { return 'ได้งานปีละ'; } },
  { k: 'durationMonths', g: 'sell', t: 'dec', req: true, models: ['project'], suf: function () { return 'เดือน'; }, label: function () { return 'งานหนึ่งใช้เวลาทำประมาณ'; } },
  { k: 'depositPct', g: 'sell', t: 'pct', models: ['project'], suf: function () { return '% ของมูลค่างาน'; }, label: function () { return 'เก็บมัดจำก่อนเริ่มงาน'; } },
  { k: 'directCostPct', g: 'var', t: 'pct', req: true, models: ['project'], suf: function () { return '% ของมูลค่างาน'; }, label: function () { return 'ต้นทุนตรงของงาน'; },
    help: function () { return 'ค่าวัสดุ และค่าจ้างช่างหรือฟรีแลนซ์ที่จ้างเฉพาะงานนั้น'; } },

  /* ----- rental ----- */
  { k: 'unitLabel', g: 'sell', t: 'unit', models: ['rental'], label: function () { return 'ให้เช่าอะไร'; } },
  { k: 'rentableUnits', g: 'sell', t: 'int', req: true, models: ['rental'], suf: function (i, m) { return U(i, m); }, label: function (i, m) { return 'มีให้เช่ากี่' + U(i, m); } },
  { k: 'periodKind', g: 'sell', t: 'period', models: ['rental'], label: function () { return 'คิดเงินเป็น'; } },
  { k: 'pricePerPeriod', g: 'sell', t: 'money', req: true, models: ['rental'], label: function (i) { return 'ราคาเฉลี่ยต่อ' + periodWord(i); } },
  { k: 'occupancy', g: 'sell', t: 'pct', req: true, models: ['rental'], suf: function () { return '%'; }, label: function () { return 'มีคนเช่าเฉลี่ย'; },
    help: function (i) { return i.periodKind === 'month' ? 'จากทั้งหมดที่มี มีคนเช่ากี่ %' : 'เช่น 30 คืน มีคนเช่า 12 คืน = 40%'; } },
  { k: 'costPerOccupied', g: 'var', t: 'money', models: ['rental'], label: function (i) { return 'ค่าใช้จ่ายต่อ' + periodWord(i) + 'ที่มีคนเช่า'; },
    help: function () { return 'ค่าน้ำไฟที่เพิ่มขึ้น ของใช้ ซักผ้า'; } },
  { k: 'feePct', g: 'var', t: 'pct', models: ['rental'], label: function () { return 'ค่าธรรมเนียมแพลตฟอร์มจอง'; }, suf: function () { return '% ของยอดขาย'; } },

  /* ----- commission ----- */
  { k: 'dealsPerMonth', g: 'sell', t: 'dec', req: true, models: ['commission'], suf: function () { return 'ดีล'; }, label: function () { return 'ปิดดีลได้เดือนละ'; } },
  { k: 'avgDealValue', g: 'sell', t: 'money', req: true, models: ['commission'], label: function () { return 'มูลค่าเฉลี่ยต่อดีล'; } },
  { k: 'commissionPct', g: 'sell', t: 'pct', req: true, models: ['commission'], suf: function () { return '% ของมูลค่าดีล'; }, label: function () { return 'ค่าคอมที่ได้'; } },
  { k: 'splitPct', g: 'var', t: 'pct', models: ['commission'], suf: function () { return '% ของค่าคอม'; }, label: function () { return 'แบ่งให้ทีมหรือบริษัท'; } },

  /* ----- other ----- */
  { k: 'amount', g: 'sell', t: 'money', req: true, models: ['other'], label: function () { return 'ได้เงินเดือนละ'; } },
  { k: 'costPct', g: 'var', t: 'pct', models: ['other'], suf: function () { return '% ของรายได้'; }, label: function () { return 'ต้นทุนที่เกิดจากรายได้นี้'; } },

  /* ----- ค่าใช้จ่ายคงที่ (ทุกรูปแบบ) ----- */
  { k: 'staffCount', g: 'fixed', t: 'int', suf: function () { return 'คน'; }, label: function () { return 'พนักงาน (ไม่นับคุณ)'; } },
  { k: 'staffSalary', g: 'fixed', t: 'money', label: function () { return 'เงินเดือนพนักงานเฉลี่ยต่อคน'; }, show: function (i) { return num(i.staffCount) > 0; } },
  { k: 'ownerSalary', g: 'fixed', t: 'money', label: function () { return 'เงินเดือนคุณเอง'; },
    help: function () { return 'ถ้ายังไม่ได้จ่ายตัวเอง ลองใส่เงินที่คุณควรได้ถ้าไปทำงานที่อื่น หรือใส่ 0'; } },
  { k: 'rent', g: 'fixed', t: 'money', label: function () { return 'ค่าเช่าที่'; } },
  { k: 'marketing', g: 'fixed', t: 'money', label: function () { return 'งบการตลาดและโฆษณา'; } },
  { k: 'otherFixed', g: 'fixed', t: 'money', label: function () { return 'ค่าใช้จ่ายคงที่อื่น'; },
    help: function () { return 'ค่าน้ำ ค่าไฟ อินเทอร์เน็ต ค่าส่วนกลาง ค่าผ่อนอุปกรณ์'; } },
  { k: 'cash', g: 'cash', t: 'money', label: function () { return 'เงินสดที่ใช้หมุนในร้านตอนนี้'; },
    help: function () { return 'เงินในบัญชีและเงินสดที่เอามาใช้กับร้านได้จริง'; } },

  /* ----- รายละเอียดเพิ่ม ----- */
  { k: 'growth', g: 'adv-grow', t: 'pct', neg: true, models: ['unit', 'service', 'resell', 'project', 'rental', 'commission', 'other'],
    suf: function () { return '% ต่อเดือน'; },
    label: function (i, m) { return m === 'rental' ? 'คนเช่าเพิ่มขึ้นเดือนละ' : m === 'project' ? 'งานเพิ่มขึ้นเดือนละ' : 'ยอดขายโตขึ้นเดือนละ'; },
    help: function () { return 'ถ้าไม่รู้ ใส่ 0 · ถ้ายอดลดลงทุกเดือน ใส่ติดลบ เช่น -2'; } },
  { k: 'capacity', g: 'adv-grow', t: 'dec', models: ['unit', 'service', 'resell'],
    suf: function (i, m) { return U(i, m) + '/' + perWord(i); },
    label: function (i, m) { return m === 'resell' ? 'หาของมาขายหรือส่งของได้สูงสุด' : m === 'service' ? 'รับลูกค้าได้สูงสุด' : 'ทำได้สูงสุด'; },
    help: function () { return 'ถ้าไม่รู้ เว้นว่างไว้'; } },
  { k: 'maxMembers', g: 'adv-grow', t: 'int', models: ['subscription'], suf: function () { return 'คน'; }, label: function () { return 'รับสมาชิกได้สูงสุด'; } },
  { k: 'joinFee', g: 'adv-grow', t: 'money', models: ['subscription'], label: function () { return 'ค่าแรกเข้า'; } },
  { k: 'maxConcurrent', g: 'adv-grow', t: 'dec', models: ['project'], suf: function () { return 'งาน'; }, label: function () { return 'รับงานพร้อมกันได้สูงสุด'; } },
  { k: 'maxDeals', g: 'adv-grow', t: 'dec', models: ['commission'], suf: function () { return 'ดีล'; }, label: function () { return 'ดูแลดีลได้สูงสุดเดือนละ'; } },
  { k: 'avgStay', g: 'adv-grow', t: 'dec', models: ['rental'], suf: function (i) { return periodWord(i); }, label: function () { return 'ลูกค้าเช่าครั้งละ'; } },
  { k: 'costPerStay', g: 'adv-grow', t: 'money', models: ['rental'], label: function () { return 'ค่าทำความสะอาดต่อการเช่า 1 ครั้ง'; } },

  { k: 'creditDays', g: 'adv-cash', t: 'int', suf: function () { return 'วัน'; },
    label: function (i, m) { return m === 'project' ? 'ลูกค้าจ่ายงวดสุดท้ายหลังจบงาน' : 'ลูกค้าจ่ายเงินหลังได้ของหรือบริการ'; },
    help: function () { return 'ถ้าลูกค้าจ่ายทันที ใส่ 0'; } },
  { k: 'stockDays', g: 'adv-cash', t: 'int', models: ['unit', 'resell'], suf: function () { return 'วัน'; },
    label: function () { return 'ซื้อของมาเก็บไว้ก่อนขายได้ประมาณ'; } },
  { k: 'supplierCreditDays', g: 'adv-cash', t: 'int', models: ['unit', 'resell'], suf: function () { return 'วัน'; },
    label: function () { return 'จ่ายค่าของให้คนขายหลังได้ของ'; } },
  { k: 'season', g: 'adv-season', t: 'season', models: ['unit', 'service', 'resell', 'subscription', 'project', 'rental', 'commission'], label: function () { return 'ช่วงขายดีและขายแย่ของปี'; } },

  { k: 'newCustomers', g: 'adv-cust', t: 'dec', models: ['unit', 'service', 'resell'], suf: function () { return 'คน'; }, label: function () { return 'ได้ลูกค้าใหม่เดือนละ'; } },
  { k: 'repeatPerMonth', g: 'adv-cust', t: 'dec', models: ['unit', 'service', 'resell'], suf: function () { return 'ครั้ง'; }, label: function () { return 'ลูกค้า 1 คนซื้อเดือนละ'; },
    help: function () { return 'นึกถึงลูกค้าประจำ 3–5 คน ว่าเดือนหนึ่งมากี่ครั้ง ถ้าเดือนละไม่ถึงครั้ง ใส่ทศนิยมได้ เช่น 0.5'; } },
  { k: 'lifespanMonths', g: 'adv-cust', t: 'dec', models: ['unit', 'service', 'resell'], suf: function () { return 'เดือน'; }, label: function () { return 'ลูกค้า 1 คนซื้อต่อเนื่องประมาณ'; } },

  { k: 'equipValue', g: 'adv-equip', t: 'money', label: function () { return 'อุปกรณ์ราคาสูงที่ต้องซื้อใหม่เมื่อเสีย'; },
    help: function () { return 'เช่น เครื่องชงกาแฟ ตู้เย็น รถ รวมมูลค่าตอนซื้อ'; } },
  { k: 'equipYears', g: 'adv-equip', t: 'dec', suf: function () { return 'ปี'; }, label: function () { return 'ใช้ได้ประมาณ'; }, show: function (i) { return num(i.equipValue) > 0; } }
];

var GROUPS = {
  sell: function (m) {
    var t = { unit: 'ขายได้เท่าไหร่', service: 'ลูกค้ามาเท่าไหร่', resell: 'ขายได้เท่าไหร่', subscription: 'สมาชิกและค่าสมาชิก',
      project: 'งานที่รับ', rental: 'ของที่ให้เช่า', commission: 'ดีลที่ปิดได้', other: 'รายได้' };
    return [t[m], ''];
  },
  var: function () { return ['ต้นทุนที่ขึ้นลงตามยอดขาย', 'ยิ่งขายมาก ต้นทุนส่วนนี้ยิ่งมาก']; },
  fixed: function () { return ['ค่าใช้จ่ายคงที่ต่อเดือน', 'จ่ายทุกเดือน ไม่ว่าจะขายได้มากหรือน้อย']; },
  cash: function () { return ['เงินในมือ', 'ใช้ดูว่าเงินพอใช้ถึงเดือนไหน']; }
};
var ADV_GROUPS = [
  ['adv-grow', 'การเติบโตและกำลังรับ', ''],
  ['adv-cash', 'จังหวะเงินเข้าออก', 'ทำให้ภาพเงินสด 12 เดือนตรงกับความจริงมากขึ้น'],
  ['adv-season', 'ฤดูกาล', 'แตะเดือนเพื่อสลับ ปกติ → ขายดี → ขายแย่'],
  ['adv-cust', 'ลูกค้า', 'ใช้ดูว่าค่าหาลูกค้าใหม่ 1 คน คุ้มกับกำไรที่ได้จากลูกค้าคนนั้นไหม'],
  ['adv-equip', 'อุปกรณ์', 'กำไรจะหักเงินที่ควรกันไว้ซื้ออุปกรณ์ใหม่']
];

/* ---------- ตัวเลขที่ปรับได้ในส่วนทดลอง (ตามที่เจ้าของกำหนด: ยอดขาย ต้นทุนผันแปร ต้นทุนคงที่ พนักงานและเงินเดือน เงินเดือนตัวเอง ราคาขาย งบการตลาด) ---------- */
var COMMON_LEVERS = ['staffCount', 'staffSalary', 'ownerSalary', 'rent', 'marketing', 'otherFixed'];
var MODEL_LEVERS = {
  unit: ['price', 'volume', 'unitCost', 'feePct'],
  service: ['price', 'volume', 'unitCost', 'feePct'],
  resell: ['price', 'volume', 'unitCost', 'feePct'],
  subscription: ['fee', 'members', 'newMembers', 'leaving', 'costPerMember'],
  project: ['projectValue', 'projectsPerYear', 'directCostPct'],
  rental: ['pricePerPeriod', 'occupancy', 'costPerOccupied', 'feePct'],
  commission: ['dealsPerMonth', 'avgDealValue', 'commissionPct', 'splitPct'],
  other: ['amount', 'costPct']
};
/* คีย์บทบาทของแต่ละรูปแบบ: ราคา / ปริมาณ / ต้นทุนต่อหน่วย */
var ROLE = {
  unit: { price: 'price', vol: 'volume', cost: 'unitCost' },
  service: { price: 'price', vol: 'volume', cost: 'unitCost' },
  resell: { price: 'price', vol: 'volume', cost: 'unitCost' },
  subscription: { price: 'fee', vol: 'members', cost: 'costPerMember' },
  project: { price: 'projectValue', vol: 'projectsPerYear', cost: 'directCostPct' },
  rental: { price: 'pricePerPeriod', vol: 'occupancy', cost: 'costPerOccupied' },
  commission: { price: 'commissionPct', vol: 'dealsPerMonth', cost: 'splitPct' },
  other: { price: null, vol: 'amount', cost: 'costPct' }
};

function leverLabel(k, inp, m) {
  var u = U(inp, m);
  var L = {
    price: ['ราคา', 'ราคาขายต่อ' + u], volume: ['ขายได้', m === 'service' ? 'ลูกค้าต่อ' + perWord(inp) : 'ขายได้ต่อ' + perWord(inp)],
    unitCost: ['ต้นทุน', (m === 'resell' ? 'ราคาที่ซื้อมาต่อ' : 'ต้นทุนต่อ') + u], feePct: ['ค่าธรรมเนียม', 'ค่าธรรมเนียม % ของยอดขาย'],
    fee: ['ค่าสมาชิก', 'ค่าสมาชิกต่อรอบ'], members: ['สมาชิก', 'สมาชิกตอนนี้'], newMembers: ['สมาชิกใหม่', 'สมาชิกใหม่ต่อเดือน'],
    leaving: ['คนเลิก', 'สมาชิกที่เลิกต่อเดือน'], costPerMember: ['ต้นทุนต่อคน', 'ต้นทุนต่อสมาชิกต่อเดือน'],
    projectValue: ['ราคาต่องาน', 'มูลค่าเฉลี่ยต่องาน'], projectsPerYear: ['งานต่อปี', 'ได้งานปีละ'], directCostPct: ['ต้นทุนตรง', 'ต้นทุนตรง % ของมูลค่างาน'],
    pricePerPeriod: ['ราคา', 'ราคาต่อ' + periodWord(inp)], occupancy: ['คนเช่า', 'มีคนเช่าเฉลี่ย'], costPerOccupied: ['ต้นทุนต่อ' + periodWord(inp), 'ค่าใช้จ่ายต่อ' + periodWord(inp) + 'ที่มีคนเช่า'],
    dealsPerMonth: ['ดีลต่อเดือน', 'ปิดดีลได้เดือนละ'], avgDealValue: ['มูลค่าดีล', 'มูลค่าเฉลี่ยต่อดีล'], commissionPct: ['ค่าคอม', 'ค่าคอม % ของมูลค่าดีล'],
    splitPct: ['ส่วนแบ่งทีม', 'แบ่งให้ทีม % ของค่าคอม'], amount: ['รายได้', 'ได้เงินเดือนละ'], costPct: ['ต้นทุน', 'ต้นทุน % ของรายได้'],
    staffCount: ['พนักงาน', 'จำนวนพนักงาน'], staffSalary: ['เงินเดือนพนักงาน', 'เงินเดือนเฉลี่ยต่อคน'], ownerSalary: ['เงินเดือนคุณ', 'เงินเดือนคุณเอง'],
    rent: ['ค่าเช่า', 'ค่าเช่าที่ต่อเดือน'], marketing: ['การตลาด', 'งบการตลาดต่อเดือน'], otherFixed: ['ค่าใช้จ่ายอื่น', 'ค่าใช้จ่ายคงที่อื่นต่อเดือน']
  };
  return L[k] || [k, k];
}
function leverUnit(k, inp, m) {
  var u = U(inp, m);
  var pctKeys = { feePct: 1, directCostPct: 1, commissionPct: 1, splitPct: 1, costPct: 1, occupancy: 1 };
  if (pctKeys[k]) return '%';
  if (k === 'volume') return u + '/' + perWord(inp);
  if (k === 'members' || k === 'newMembers' || k === 'leaving' || k === 'staffCount') return 'คน';
  if (k === 'projectsPerYear') return 'งาน/ปี';
  if (k === 'dealsPerMonth') return 'ดีล';
  return 'บาท';
}

/* ---------- คลังคำถามต่อท้าย → จุดที่ควรเช็ก → เครื่องมือ PL1 (อ้างด้วยรหัส) ---------- */
var QBANK = {
  newcust: { q: function () { return 'ช่วงนี้ลูกค้าใหม่เข้ามาน้อยกว่าเมื่อก่อนไหม'; }, p: 'จำนวนลูกค้าใหม่', d: 'เช็กว่าลูกค้าใหม่มาจากช่องทางไหน และช่องทางไหนเงียบลง', lever: 'vol', tools: ['cust1', 'grow9'] },
  repeat: { q: function () { return 'ลูกค้าเก่ากลับมาซื้อซ้ำน้อยลงไหม'; }, p: 'ลูกค้าเก่าที่กลับมาซื้อซ้ำ', d: 'เช็กว่าลูกค้าประจำหายไปตั้งแต่เมื่อไหร่ และเป็นกลุ่มไหน', lever: 'vol', tools: ['cust6', 'bmc8'] },
  price: { q: function () { return 'ตั้งราคาตามคู่แข่ง โดยยังไม่ได้คิดจากต้นทุนของร้านคุณไหม'; }, p: 'ราคาขาย', d: 'เช็กว่าราคาตอนนี้ครอบคลุมต้นทุนต่อหน่วย ค่าธรรมเนียม และค่าใช้จ่ายคงที่แล้วหรือยัง', lever: 'price', tools: ['grow13', 'bmc5'] },
  promo: { q: function () { return 'จัดโปรลดราคาบ่อยจนลูกค้ารอซื้อตอนลดไหม'; }, p: 'ส่วนลดและโปรโมชัน', d: 'เช็กว่ายอดขายช่วงโปรได้กำไรจริงเท่าไหร่หลังหักส่วนลด', lever: 'price', tools: ['grow13', 'comp6'] },
  cost: { q: function (i, m) {
      return { resell: 'ราคาที่ซื้อของมาแพงขึ้นในช่วงที่ผ่านมาไหม', rental: 'ค่าน้ำไฟ ของใช้ หรือค่าซักผ้าแพงขึ้นในช่วงที่ผ่านมาไหม',
        subscription: 'ต้นทุนของหรือบริการที่ให้สมาชิกแพงขึ้นในช่วงที่ผ่านมาไหม', project: 'ค่าวัสดุหรือค่าจ้างช่างแพงขึ้นในช่วงที่ผ่านมาไหม',
        other: 'ต้นทุนที่เกิดจากรายได้นี้เพิ่มขึ้นในช่วงที่ผ่านมาไหม' }[m] || 'ค่าวัตถุดิบหรือของที่ใช้แพงขึ้นในช่วงที่ผ่านมาไหม'; },
    p: 'ต้นทุนต่อหน่วย', d: 'เช็กว่าต้นทุนตอนนี้ยังตรงกับตัวเลขที่ใช้ตั้งราคาไหม', lever: 'cost', tools: ['grow15'] },
  fee: { q: function () { return 'ยอดขายส่วนใหญ่มาจากแอปหรือแพลตฟอร์มที่หักค่าธรรมเนียมสูงไหม'; }, p: 'ค่าธรรมเนียมของช่องทางขาย', d: 'เช็กว่าแต่ละช่องทางเหลือเงินจริงเท่าไหร่หลังหักค่าธรรมเนียม', lever: 'feePct', tools: ['cust5', 'bmc10'],
    when: function (i) { return num(i.feePct) > 0; } },
  rent: { q: function () { return 'ค่าเช่าสูงเมื่อเทียบกับจำนวนลูกค้าที่เข้าร้านไหม'; }, p: 'ทำเลและค่าเช่า', d: 'เช็กว่าทำเลนี้พาลูกค้ามาคุ้มกับค่าเช่าที่จ่ายไหม', lever: 'rent', tools: ['grow14'],
    when: function (i) { return num(i.rent) > 0; } },
  staff: { q: function () { return 'บางช่วงของวันมีพนักงานมากกว่างานไหม'; }, p: 'จำนวนคนกับปริมาณงาน', d: 'เช็กว่าช่วงไหนคนว่าง และช่วงไหนคนไม่พอ', lever: 'staffCount', tools: ['bmc9', 'grow15'],
    when: function (i) { return num(i.staffCount) > 0; } },
  compet: { q: function () { return 'มีคู่แข่งเปิดใหม่ หรือคู่แข่งลดราคาใกล้ๆ ไหม'; }, p: 'คู่แข่ง', d: 'เช็กว่าลูกค้าที่หายไปย้ายไปที่ไหน และเพราะอะไร', lever: 'vol', tools: ['grow11', 'comp6'] },
  mkt: { q: function () { return 'ยังไม่รู้ว่าเงินค่าการตลาดแต่ละช่องทางพาลูกค้ามากี่คนใช่ไหม'; }, p: 'ผลของงบการตลาด', d: 'เช็กว่าเงินค่าการตลาดแต่ละก้อนพาลูกค้ามาได้กี่คน', lever: 'marketing', tools: ['grow9', 'grow5'],
    when: function (i) { return num(i.marketing) > 0; } },
  drop: { q: function () { return 'ยอดขายตกลงฉับพลันในช่วงไม่กี่สัปดาห์ไหม'; }, p: 'ยอดขายที่ตกฉับพลัน', d: 'เช็กว่ายอดเริ่มตกวันไหน และช่วงนั้นมีอะไรเปลี่ยน', lever: 'vol', tools: ['grow3'] },
  swing: { q: function () { return 'ยอดขายเดือนดีเดือนแย่สลับกันไหม'; }, p: 'ยอดขายที่ไม่คงที่', d: 'เช็กว่าเดือนที่ขายแย่ตรงกับเหตุการณ์อะไร', lever: null, tools: ['grow2'] },
  market: { q: function () { return 'ลูกค้าในพื้นที่หรือตลาดโดยรวมซื้อน้อยลงไหม'; }, p: 'ตลาดโดยรวม', d: 'เช็กว่ายอดลดเพราะตลาด หรือเพราะร้าน', lever: 'vol', tools: ['grow12'] },
  product: { q: function () { return 'สินค้าบางตัวขายช้าลงอย่างชัดเจนไหม'; }, p: 'สินค้าที่ขายช้าลง', d: 'เช็กยอดขายรายสินค้าว่าตัวไหนยังไปได้ ตัวไหนไม่ไป', lever: null, tools: ['grow10'] },
  turnaway: { q: function (i, m) {
      if (m === 'subscription') return 'เคยต้องปิดรับสมาชิกใหม่ หรือแน่นจนสมาชิกบ่นไหม';
      if (m === 'rental') return 'ช่วงขายดีเต็มจนต้องปฏิเสธลูกค้าไหม';
      return 'เคยต้องปฏิเสธลูกค้า หรือให้ลูกค้ารอนานไหม';
    }, p: 'กำลังรับลูกค้า', d: 'เช็กว่าช่วงไหนรับไม่ทัน และเสียลูกค้าไปกี่คน', lever: 'vol', tools: ['grow7'] },
  ownerwork: { q: function () { return 'งานหลายอย่างต้องรอคุณทำเองไหม'; }, p: 'งานที่ติดอยู่กับคุณ', d: 'เช็กว่างานไหนต้องเป็นคุณเท่านั้น และงานไหนคนอื่นทำแทนได้', lever: null, tools: ['grow6', 'goal8'] },
  peak: { q: function () { return 'ลูกค้ามากระจุกอยู่บางช่วงเวลาไหม'; }, p: 'ช่วงเวลาที่ลูกค้ามา', d: 'เช็กว่าช่วงไหนเต็ม และช่วงไหนว่าง', lever: null, tools: ['cust4'] },
  credit: { q: function () { return 'ลูกค้าจ่ายเงินช้ากว่าที่ตกลงบ่อยไหม'; }, p: 'เงินที่ลูกค้ายังไม่จ่าย', d: 'เช็กว่ามีเงินค้างรับเท่าไหร่ และค้างนานแค่ไหน', lever: 'creditDays', tools: ['swot5', 'goal4'],
    when: function (i, m) { return num(i.creditDays) > 0 || m === 'project'; } },
  stock: { q: function () { return 'ของในสต็อกค้างนานกว่าที่คิดไหม'; }, p: 'เงินที่จมอยู่ในสต็อก', d: 'เช็กว่าของตัวไหนค้างนาน และเงินจมอยู่เท่าไหร่', lever: 'stockDays', tools: ['grow10'],
    when: function (i) { return num(i.stockDays) > 0; } },
  season: { q: function () { return 'เดือนที่ขายแย่ ค่าใช้จ่ายยังเท่าเดิมไหม'; }, p: 'ช่วงขายแย่ของปี', d: 'เช็กว่าต้องมีเงินสำรองเท่าไหร่ก่อนเข้าช่วงขายแย่', lever: null, tools: ['grow2', 'goal4'],
    when: function (i) { return hasSeason(i); } },
  bigspend: { q: function () { return 'มีเงินก้อนใหญ่ที่ต้องจ่ายในอีกไม่กี่เดือนไหม เช่น ผ่อนหนี้ ซ่อมร้าน'; }, p: 'เงินก้อนที่ต้องจ่ายล่วงหน้า', d: 'เช็กว่าเงินก้อนนั้นต้องจ่ายเดือนไหน และตอนนั้นเงินในมือเหลือเท่าไหร่', lever: null, tools: ['goal4', 'swot5'] },
  mixmoney: { q: function () { return 'ใช้เงินร้านกับเงินส่วนตัวปนกันในบัญชีเดียวไหม'; }, p: 'เงินร้านกับเงินส่วนตัว', d: 'เช็กว่าแต่ละเดือนเงินออกจากร้านไปใช้ส่วนตัวเท่าไหร่ เทียบกับเงินเดือนคุณที่กรอกไว้', lever: 'ownerSalary', tools: ['goal1', 'swot5'] },
  onetime: { q: function () { return 'ลูกค้าใหม่ส่วนใหญ่ซื้อครั้งเดียวแล้วไม่กลับมาไหม'; }, p: 'ลูกค้าใหม่ที่ไม่กลับมาซื้อซ้ำ', d: 'เช็กว่าลูกค้าใหม่กลับมาซื้อครั้งที่สองกี่คน', lever: null, tools: ['cust6', 'bmc8'] },
  wide: { q: function () { return 'ยิงโฆษณากว้างๆ โดยยังไม่ได้เลือกกลุ่มลูกค้าชัดเจนไหม'; }, p: 'กลุ่มลูกค้าที่โฆษณาไปถึง', d: 'เช็กว่าลูกค้าที่ซื้อจริงเป็นใคร และโฆษณาไปถึงคนกลุ่มนั้นไหม', lever: 'marketing', tools: ['cust1', 'bmc2'] },
  s_early: { q: function () { return 'สมาชิกส่วนใหญ่เลิกในช่วงเดือนแรกๆ ไหม'; }, p: 'สมาชิกที่เลิกเร็ว', d: 'เช็กว่าสมาชิกเลิกหลังสมัครกี่เดือน', lever: 'leaving', tools: ['cust2'] },
  s_why: { q: function () { return 'ยังไม่รู้ว่าสมาชิกเลิกเพราะอะไรใช่ไหม'; }, p: 'เหตุผลที่สมาชิกเลิก', d: 'เช็กจากสมาชิกที่เลิกไปจริง 5–10 คน', lever: 'leaving', tools: ['cust6'] },
  s_group: { q: function () { return 'สมาชิกส่วนใหญ่มาจากกลุ่มเดียวหรือช่องทางเดียวไหม'; }, p: 'ที่มาของสมาชิก', d: 'เช็กว่าสมาชิกมาจากกลุ่มไหน ช่องทางไหน', lever: 'newMembers', tools: ['bmc3', 'bmc7'] },
  s_new: { q: function () { return 'สมาชิกใหม่ต่อเดือนน้อยลงกว่าเมื่อก่อนไหม'; }, p: 'สมาชิกใหม่', d: 'เช็กว่าสมาชิกใหม่มาจากช่องทางไหน และช่องทางไหนเงียบลง', lever: 'newMembers', tools: ['cust1', 'grow9'] },
  s_price: { q: function () { return 'ตั้งค่าสมาชิกตามคู่แข่ง โดยยังไม่ได้คิดจากต้นทุนของคุณไหม'; }, p: 'ค่าสมาชิก', d: 'เช็กว่าค่าสมาชิกครอบคลุมต้นทุนต่อคนและค่าใช้จ่ายคงที่แล้วหรือยัง', lever: 'price', tools: ['grow13', 'bmc5'] },
  r_channel: { q: function () { return 'ลูกค้าจองผ่านช่องทางเดียวเป็นหลักไหม'; }, p: 'ช่องทางที่ลูกค้าจอง', d: 'เช็กว่าแต่ละช่องทางพาลูกค้ามาเท่าไหร่ และเหลือเงินเท่าไหร่หลังหักค่าธรรมเนียม', lever: 'feePct', tools: ['cont6', 'bmc10'] },
  r_weekday: { q: function () { return 'วันธรรมดาว่างมากกว่าวันหยุดชัดเจนไหม'; }, p: 'วันที่ว่าง', d: 'เช็กว่าวันไหนว่าง และลูกค้ากลุ่มไหนมาวันธรรมดาได้', lever: 'vol', tools: ['cust4', 'bmc3'] },
  r_who: { q: function () { return 'ยังไม่แน่ใจว่าลูกค้าหลักเป็นใครใช่ไหม'; }, p: 'ลูกค้าหลัก', d: 'เช็กว่าลูกค้าที่มาซ้ำหรือรีวิวดีเป็นคนกลุ่มไหน', lever: 'vol', tools: ['cust1'] },
  r_price: { q: function () { return 'ตั้งราคาตามที่อื่นในย่านเดียวกัน โดยยังไม่ได้คิดจากต้นทุนของคุณไหม'; }, p: 'ราคาต่อคืน', d: 'เช็กว่าราคาครอบคลุมต้นทุนต่อคืนและค่าใช้จ่ายคงที่แล้วหรือยัง', lever: 'price', tools: ['grow13'] },
  p_pipe: { q: function () { return 'งานเข้าไม่สม่ำเสมอ บางเดือนไม่มีงานเลยไหม'; }, p: 'งานที่เข้ามาแต่ละเดือน', d: 'เช็กว่างานมาจากไหน และเดือนที่ไม่มีงานเกิดอะไรขึ้น', lever: 'vol', tools: ['grow2', 'cust5'] },
  p_scope: { q: function () { return 'งานบานปลายเกินกว่าที่ตกลงราคาไว้บ่อยไหม'; }, p: 'ขอบเขตงานกับราคา', d: 'เช็กว่างานที่ผ่านมาใช้ต้นทุนจริงเกินที่ตั้งไว้เท่าไหร่', lever: 'cost', tools: ['grow13'] },
  p_source: { q: function () { return 'งานส่วนใหญ่มาจากลูกค้ากลุ่มเดียว หรือคนแนะนำต่อเป็นหลักไหม'; }, p: 'ที่มาของงาน', d: 'เช็กว่างานแต่ละชิ้นมาจากไหน และพึ่งทางเดียวมากแค่ไหน', lever: 'vol', tools: ['bmc7', 'ver8'] },
  p_price: { q: function () { return 'ตั้งราคางานตามคู่แข่ง โดยยังไม่ได้คิดจากต้นทุนและเวลาที่ใช้ไหม'; }, p: 'ราคาต่องาน', d: 'เช็กว่าราคาต่องานครอบคลุมต้นทุนตรงและค่าใช้จ่ายคงที่แล้วหรือยัง', lever: 'price', tools: ['grow13', 'bmc5'] },
  c_close: { q: function () { return 'ลูกค้าที่คุยแล้วไม่ปิดดีลมีเยอะไหม'; }, p: 'ดีลที่คุยแล้วไม่ปิด', d: 'เช็กว่าลูกค้าหยุดตัดสินใจที่ขั้นไหน', lever: 'vol', tools: ['cust6'] },
  c_source: { q: function () { return 'ลูกค้าส่วนใหญ่มาจากช่องทางเดียวไหม'; }, p: 'ที่มาของลูกค้า', d: 'เช็กว่าดีลแต่ละดีลมาจากช่องทางไหน', lever: 'vol', tools: ['bmc7', 'cust5'] },
  c_split: { q: function () { return 'ส่วนแบ่งที่ให้ทีมหรือบริษัท ทำให้เหลือเงินไม่พอค่าใช้จ่ายไหม'; }, p: 'ส่วนแบ่งค่าคอม', d: 'เช็กว่าหลังแบ่งแล้วเหลือต่อดีลเท่าไหร่', lever: 'cost', tools: ['grow15'] },
  o_source: { q: function () { return 'รายได้นี้มาจากแหล่งเดียวหรือลูกค้ารายเดียวไหม'; }, p: 'แหล่งรายได้', d: 'เช็กว่าถ้าแหล่งนี้หายไป จะเหลือรายได้จากที่ไหน', lever: 'vol', tools: ['bmc7'] }
};

/* ชุดคำถามของแต่ละเรื่อง (เรียงตามลำดับที่ถาม เลือกข้อที่เข้ากับร้าน สูงสุด 5 ข้อ) */
var QSETS = {
  gap: {
    unit: ['newcust', 'repeat', 'price', 'cost', 'fee', 'rent', 'staff', 'compet'],
    service: ['newcust', 'repeat', 'price', 'cost', 'fee', 'rent', 'staff', 'compet'],
    resell: ['newcust', 'repeat', 'price', 'cost', 'fee', 'mkt', 'compet'],
    subscription: ['s_new', 's_early', 's_why', 's_price', 'rent', 'staff'],
    project: ['p_pipe', 'p_price', 'p_scope', 'p_source', 'staff'],
    rental: ['r_who', 'r_weekday', 'r_channel', 'r_price', 'staff'],
    commission: ['c_close', 'c_source', 'c_split', 'mkt'],
    other: ['o_source', 'mkt', 'staff']
  },
  /* ขายทุกหน่วยแล้วขาดทุน: ถามเรื่องราคาและต้นทุน (เพิ่มลูกค้าไม่ช่วย) */
  neg: {
    unit: ['price', 'promo', 'cost', 'fee'], service: ['price', 'promo', 'cost', 'fee'], resell: ['price', 'promo', 'cost', 'fee'],
    subscription: ['s_price', 'promo', 'cost', 'fee'], project: ['p_price', 'p_scope', 'cost'], rental: ['r_price', 'r_channel', 'cost', 'fee'],
    commission: ['c_split', 'cost'], other: ['cost', 'o_source']
  },
  cash: { all: ['credit', 'stock', 'season', 'bigspend', 'mixmoney', 'swing'] },
  capacity: { all: ['turnaway', 'ownerwork', 'peak'] },
  cac: { all: ['onetime', 'wide', 'mkt'] },
  decline: {
    unit: ['drop', 'compet', 'market', 'product', 'repeat'],
    service: ['drop', 'compet', 'market', 'repeat'],
    resell: ['drop', 'compet', 'market', 'product', 'repeat'],
    subscription: ['s_early', 's_why', 's_group', 's_new'],
    project: ['p_pipe', 'p_source', 'market'],
    rental: ['r_who', 'r_weekday', 'r_channel', 'market'],
    commission: ['c_close', 'c_source', 'market'],
    other: ['o_source', 'market']
  }
};
