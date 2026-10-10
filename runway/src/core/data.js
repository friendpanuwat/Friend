/* RUNWAY — static game data: roles, traits, backgrounds, offices, policies, macro, investors, difficulty */
(function (RW) {
  'use strict';
  var R = RW.R;

  RW.LEVELS = ['', 'จูเนียร์', 'มิดเลเวล', 'ซีเนียร์', 'หัวหน้าทีม', 'ผู้บริหาร (Head/VP)'];

  // salary: market monthly salary (THB, Bangkok) by level 1..5
  // cap: capacity contributions per unit of effective output
  // dept: accounting department; mgr: can manage people at level>=4
  RW.ROLES = {
    eng: { n: 'วิศวกรซอฟต์แวร์', dept: 'rnd', salary: [0, 35000, 60000, 95000, 140000, 220000], cap: { dev: 1 }, ind: ['saas', 'ecom'], exec: 'CTO / VP Engineering' },
    design: { n: 'นักออกแบบ UX/UI', dept: 'rnd', salary: [0, 28000, 45000, 70000, 100000, 160000], cap: { design: 1 }, ind: ['saas', 'ecom'], exec: 'Head of Design' },
    pm: { n: 'Product Manager', dept: 'rnd', salary: [0, 40000, 65000, 100000, 140000, 220000], cap: { product: 1 }, ind: ['saas'], exec: 'VP Product' },
    data: { n: 'Data Analyst / Data Scientist', dept: 'rnd', salary: [0, 35000, 58000, 90000, 130000, 200000], cap: { data: 1 }, ind: ['saas', 'ecom', 'fnb'], exec: 'Head of Data' },
    sdr: { n: 'SDR (หาลูกค้าเป้าหมาย)', dept: 'sm', salary: [0, 22000, 30000, 40000, 55000, 80000], cap: { leadgen: 1 }, ind: ['saas'], exec: 'Head of SDR' },
    ae: { n: 'Account Executive (ปิดการขาย)', dept: 'sm', salary: [0, 35000, 55000, 80000, 120000, 220000], cap: { sales: 1 }, ind: ['saas', 'ecom', 'fnb'], exec: 'VP Sales' },
    marketer: { n: 'Growth / Performance Marketer', dept: 'sm', salary: [0, 28000, 45000, 70000, 110000, 200000], cap: { mkt: 1 }, ind: ['saas', 'ecom', 'fnb'], exec: 'CMO' },
    content: { n: 'Content Creator / Graphic', dept: 'sm', salary: [0, 22000, 32000, 48000, 70000, 100000], cap: { content: 1 }, ind: ['saas', 'ecom', 'fnb'], exec: 'Head of Content' },
    support: { n: 'Customer Support', dept: 'cogs', salary: [0, 18000, 25000, 35000, 50000, 80000], cap: { support: 1 }, ind: ['saas', 'ecom'], exec: 'Head of Support' },
    csm: { n: 'Customer Success Manager', dept: 'cogs', salary: [0, 30000, 45000, 65000, 95000, 160000], cap: { cs: 1 }, ind: ['saas'], exec: 'VP Customer Success' },
    ops: { n: 'Operations', dept: 'ga', salary: [0, 22000, 35000, 55000, 85000, 180000], cap: { ops: 1 }, ind: ['saas', 'ecom', 'fnb'], exec: 'COO' },
    finance: { n: 'บัญชีและการเงิน', dept: 'ga', salary: [0, 25000, 40000, 65000, 110000, 250000], cap: { finance: 1 }, ind: ['saas', 'ecom', 'fnb'], exec: 'CFO' },
    hr: { n: 'HR / Recruiter', dept: 'ga', salary: [0, 25000, 38000, 58000, 90000, 160000], cap: { hr: 1 }, ind: ['saas', 'ecom', 'fnb'], exec: 'Head of People' },
    // e-commerce
    buyer: { n: 'Sourcing / Merchandiser', dept: 'ga', salary: [0, 25000, 40000, 60000, 90000, 150000], cap: { buying: 1 }, ind: ['ecom'], exec: 'Head of Supply Chain' },
    rnd: { n: 'นักพัฒนาผลิตภัณฑ์ (R&D)', dept: 'rnd', salary: [0, 30000, 50000, 75000, 110000, 170000], cap: { rnd: 1 }, ind: ['ecom'], exec: 'Head of R&D' },
    warehouse: { n: 'พนักงานคลัง/แพ็กสินค้า', dept: 'cogs', salary: [0, 12500, 15000, 20000, 30000, 50000], cap: { fulfil: 1 }, ind: ['ecom'], exec: 'Warehouse Manager' },
    live: { n: 'Live Host / Creator', dept: 'sm', salary: [0, 18000, 30000, 50000, 80000, 120000], cap: { live: 1 }, ind: ['ecom'], exec: 'Head of Live Commerce' },
    cs: { n: 'แอดมินแชท / บริการลูกค้า', dept: 'cogs', salary: [0, 15000, 20000, 28000, 40000, 60000], cap: { chat: 1 }, ind: ['ecom', 'fnb'], exec: 'CX Manager' },
    // F&B
    cook: { n: 'พ่อครัว/แม่ครัว', dept: 'cogs', salary: [0, 13500, 17000, 23000, 35000, 70000], cap: { kitchen: 1 }, ind: [], exec: 'Executive Chef' },
    service: { n: 'พนักงานบริการ/บาริสต้า', dept: 'cogs', salary: [0, 12500, 14500, 17500, 22000, 30000], cap: { service: 1 }, ind: [], exec: 'Service Director' },
    branchmgr: { n: 'ผู้จัดการสาขา', dept: 'cogs', salary: [0, 25000, 32000, 40000, 55000, 95000], cap: { branch: 1 }, ind: ['fnb'], exec: 'Area Manager' },
    chef: { n: 'เชฟพัฒนาเมนู', dept: 'rnd', salary: [0, 30000, 45000, 65000, 90000, 150000], cap: { menu: 1 }, ind: ['fnb'], exec: 'Culinary Director' }
  };

  RW.TRAITS = {
    rockstar: { n: 'ฝีมือเหนือชั้น', d: 'ผลงานสูงกว่าคนระดับเดียวกันมาก', out: 1.25, hidden: false, good: true },
    hustler: { n: 'ขยันสุดตัว', d: 'ทำงานหนักกว่าคนอื่น แต่เสี่ยงหมดไฟ', out: 1.1, burn: 1.6, good: true },
    mentor: { n: 'ชอบสอนงาน', d: 'ทำให้คนในทีมเก่งขึ้นเร็ว', mentor: true, good: true },
    leader: { n: 'ภาวะผู้นำสูง', d: 'บริหารคนได้มากขึ้น ทีมรักใคร่', lead: 1.5, good: true },
    loyal: { n: 'รักองค์กร', d: 'ไม่ค่อยลาออกแม้ช่วงลำบาก', quit: 0.4, good: true },
    connector: { n: 'คอนเนคชั่นดี', d: 'แนะนำคนเก่งและลูกค้าให้ได้', refer: true, good: true },
    perfectionist: { n: 'เพอร์เฟกชันนิสต์', d: 'งานละเอียด บั๊กน้อย แต่ช้ากว่า', out: 0.9, quality: true },
    ambitious: { n: 'ทะเยอทะยาน', d: 'โตเร็ว อยากได้ตำแหน่ง ถ้าไม่ได้จะไป', grow: 1.6, wantsPromo: true },
    jobhopper: { n: 'เปลี่ยนงานบ่อย', d: 'มีแนวโน้มลาออกสูง', quit: 2.2, hidden: true },
    toxic: { n: 'เป็นพิษต่อทีม', d: 'เก่งแต่ทำให้คนรอบข้างหมดใจ', out: 1.05, toxic: true, hidden: true },
    slacker: { n: 'อู้งาน', d: 'ผลงานต่ำกว่าที่สัมภาษณ์ไว้', out: 0.7, hidden: true },
    drama: { n: 'ดราม่า', d: 'มักมีเรื่องขัดแย้งกับเพื่อนร่วมงาน', drama: true, hidden: true }
  };

  // Founder backgrounds
  RW.BACKGROUNDS = {
    engineer: {
      n: 'อดีตวิศวกรบริษัทเทคฯ', d: 'เขียนโค้ดเองได้ สร้าง MVP ได้เร็ว แต่ขายของไม่เป็น และไม่รู้จักนักลงทุน',
      skills: { tech: 78, product: 52, sales: 22, marketing: 25, finance: 28, leadership: 35, pitch: 32 },
      savings: 1800000, burn: 38000, rep: 15, net: { talent: 1.3, investors: 0.9, customers: 0.8 }
    },
    sales: {
      n: 'อดีตผู้จัดการฝ่ายขายองค์กร', d: 'ปิดดีลเก่ง รู้จักลูกค้ามาก แต่ต้องพึ่งคนอื่นสร้างสินค้า',
      skills: { tech: 12, product: 40, sales: 80, marketing: 52, finance: 40, leadership: 52, pitch: 62 },
      savings: 1500000, burn: 45000, rep: 20, net: { talent: 0.9, investors: 1.0, customers: 1.5 }
    },
    consultant: {
      n: 'อดีตที่ปรึกษา / MBA ต่างประเทศ', d: 'เก่งตัวเลขและพรีเซนต์ เข้าหานักลงทุนง่าย แต่ไม่เคยลงมือสร้างอะไรเอง',
      skills: { tech: 15, product: 48, sales: 48, marketing: 45, finance: 76, leadership: 55, pitch: 72 },
      savings: 2600000, burn: 55000, rep: 25, net: { talent: 1.0, investors: 1.45, customers: 1.0 }
    },
    heir: {
      n: 'ทายาทธุรกิจครอบครัว', d: 'มีทุนตั้งต้นสูงและเส้นสายกับบริษัทใหญ่ แต่คนในวงการมองว่า "เด็กเส้น"',
      skills: { tech: 15, product: 35, sales: 45, marketing: 42, finance: 50, leadership: 42, pitch: 50 },
      savings: 6000000, burn: 80000, rep: 10, net: { talent: 0.9, investors: 1.1, customers: 1.25 }
    },
    serial: {
      n: 'ผู้ก่อตั้งที่เคยล้มมาแล้ว', d: 'เคยปิดบริษัทมาหนึ่งครั้ง รู้ว่าอะไรฆ่าสตาร์ทอัพ เงินเก็บเหลือน้อย',
      skills: { tech: 50, product: 60, sales: 55, marketing: 50, finance: 55, leadership: 58, pitch: 58 },
      savings: 700000, burn: 35000, rep: 35, net: { talent: 1.15, investors: 1.25, customers: 1.1 }
    },
    grad: {
      n: 'นักศึกษาจบใหม่', d: 'ไฟแรง อยู่บ้านพ่อแม่ ค่าใช้จ่ายต่ำ แต่ไม่มีประสบการณ์และไม่มีเงิน — โหมดยาก',
      skills: { tech: 45, product: 35, sales: 30, marketing: 40, finance: 20, leadership: 25, pitch: 35 },
      savings: 250000, burn: 9000, rep: 0, net: { talent: 0.8, investors: 0.7, customers: 0.7 }
    }
  };

  RW.SKILL_NAMES = { tech: 'เทคนิค', product: 'สินค้า', sales: 'การขาย', marketing: 'การตลาด', finance: 'การเงิน', leadership: 'ภาวะผู้นำ', pitch: 'การระดมทุน' };

  // Founder focus areas (time allocation)
  RW.FOCUS = {
    build: { n: 'สร้างสินค้า/ปฏิบัติการ', skill: 'tech', d: 'ลงมือเอง: เขียนโค้ด ทำสินค้า หรือคุมหน้าร้าน' },
    sell: { n: 'ขายและหาลูกค้า', skill: 'sales', d: 'Founder-led sales — สำคัญมากช่วงแรก' },
    market: { n: 'การตลาด/แบรนด์', skill: 'marketing', d: 'ทำคอนเทนต์ PR และวางกลยุทธ์การตลาด' },
    discover: { n: 'คุยกับลูกค้า (Discovery)', skill: 'product', d: 'สัมภาษณ์ลูกค้า ค้นหาว่าเขาต้องการอะไรจริงๆ' },
    team: { n: 'สรรหาและดูแลทีม', skill: 'leadership', d: 'สัมภาษณ์ ดูแลขวัญกำลังใจ บริหารคน' },
    fundraise: { n: 'ระดมทุน/นักลงทุนสัมพันธ์', skill: 'pitch', d: 'พิตช์ ประชุมนักลงทุน ทำ Due diligence' },
    admin: { n: 'บริหาร การเงิน กฎหมาย', skill: 'finance', d: 'งานเอกสาร บัญชี ภาษี สัญญา — ไม่มีใครทำให้ถ้าคุณไม่ทำ' },
    consult: { n: 'รับงานนอก/ที่ปรึกษา', skill: 'best', d: 'รับจ้างทำโปรเจกต์/ที่ปรึกษาเพื่อหาเงินเลี้ยงบริษัท — ได้เงินสดทันทีแต่สินค้าไม่เดิน นักลงทุนไม่นับเป็น traction' }
  };

  RW.OFFICES = {
    home: { n: 'ทำงานที่บ้าน/คอนโด', cap: 3, rentPerSeat: 0, fixed: 0, deposit: 0, fitout: 0, morale: -4, brand: -8, d: 'ฟรี แต่ทีมเกิน 3 คนเริ่มทำงานยาก ลูกค้าองค์กรไม่ค่อยเชื่อถือ' },
    cowork: { n: 'Co-working space', cap: 25, rentPerSeat: 4500, fixed: 3000, deposit: 1, fitout: 0, morale: 2, brand: 0, d: 'จ่ายรายที่นั่ง ยืดหยุ่น ไม่มีสัญญาผูกมัด' },
    small: { n: 'ออฟฟิศเช่า (อาคารเกรด B)', sqmPerSeat: 8, rentSqm: 650, cap: 60, deposit: 3, fitoutSqm: 7000, morale: 4, brand: 4, lease: 36, d: 'สัญญา 3 ปี มัดจำ 3 เดือน ต้องตกแต่งเอง' },
    gradeA: { n: 'ออฟฟิศเกรด A ใจกลางเมือง', sqmPerSeat: 9, rentSqm: 1150, cap: 400, deposit: 3, fitoutSqm: 12000, morale: 8, brand: 12, lease: 36, d: 'ภาพลักษณ์ดี ดึงดูดคนเก่ง แต่แพงมาก' }
  };

  RW.POLICIES = {
    benefits: [
      { n: 'ตามกฎหมาย', cost: 0, morale: -4, hire: -0.08 },
      { n: 'พื้นฐาน (ประกันกลุ่ม)', cost: 1500, morale: 0, hire: 0 },
      { n: 'ดี (ประกัน+ทันตกรรม+สวัสดิการ)', cost: 3500, morale: 4, hire: 0.06 },
      { n: 'พรีเมียม (ระดับบริษัทเทคฯ)', cost: 7000, morale: 7, hire: 0.12 }
    ],
    workmode: [
      { n: 'เข้าออฟฟิศ 5 วัน', officeNeed: 1, morale: -3, prod: 1.0, hire: -0.06 },
      { n: 'ไฮบริด 3/2', officeNeed: 0.65, morale: 2, prod: 0.99, hire: 0.03 },
      { n: 'รีโมททั้งหมด', officeNeed: 0.1, morale: 3, prod: 0.94, hire: 0.08 }
    ],
    hours: [
      { n: 'ปกติ (เลิกตรงเวลา)', prod: 1.0, stress: -1.2, morale: 2 },
      { n: 'ทำล่วงเวลาบ้าง', prod: 1.1, stress: 0.6, morale: -1 },
      { n: 'Crunch (ทำงานหนักต่อเนื่อง)', prod: 1.25, stress: 2.6, morale: -6 }
    ],
    culture: [
      { n: 'ไม่มีงบ', cost: 0, morale: -2 },
      { n: 'กินข้าวทีมเดือนละครั้ง', cost: 800, morale: 2 },
      { n: 'กิจกรรม+อบรม', cost: 2500, morale: 4, train: 1.3 },
      { n: 'เต็มที่ (outing+คอร์ส+โค้ช)', cost: 5500, morale: 6, train: 1.7 }
    ]
  };

  // Macro-economic phases (monthly Markov chain)
  RW.MACRO = {
    boom: { n: 'เศรษฐกิจร้อนแรง', demand: 1.12, churn: 0.9, payDelay: 0.0, vc: 1.3, rate: 0.0275, wage: 1.07, consumer: 1.1, next: { boom: 0.92, slowdown: 0.08 } },
    growth: { n: 'เติบโตปกติ', demand: 1.04, churn: 1.0, payDelay: 0.05, vc: 1.08, rate: 0.0225, wage: 1.045, consumer: 1.03, next: { growth: 0.95, boom: 0.03, slowdown: 0.02 } },
    slowdown: { n: 'ชะลอตัว', demand: 0.93, churn: 1.12, payDelay: 0.15, vc: 0.82, rate: 0.02, wage: 1.025, consumer: 0.95, next: { slowdown: 0.86, recession: 0.07, growth: 0.07 } },
    recession: { n: 'ถดถอย', demand: 0.8, churn: 1.35, payDelay: 0.35, vc: 0.55, rate: 0.0125, wage: 1.0, consumer: 0.84, next: { recession: 0.88, recovery: 0.12 } },
    recovery: { n: 'ฟื้นตัว', demand: 0.97, churn: 1.05, payDelay: 0.12, vc: 0.85, rate: 0.015, wage: 1.025, consumer: 0.97, next: { recovery: 0.87, growth: 0.13 } }
  };

  RW.DIFFICULTY = {
    easy: { n: 'ผู้เริ่มต้น', d: 'ตลาดใจดี นักลงทุนใจป้ำ เหตุการณ์ร้ายน้อยลง เหมาะกับการเรียนรู้ระบบ', market: 1.3, churn: 0.8, vc: 1.25, harsh: 0.6, cash: 1000000, macro: 'growth' },
    normal: { n: 'สมจริง', d: 'ใกล้เคียงโลกจริง ส่วนใหญ่ของสตาร์ทอัพไปไม่ถึงซีรีส์ A', market: 1.0, churn: 1.0, vc: 1.0, harsh: 1.0, cash: 0, macro: 'growth' },
    hard: { n: 'โหด', d: 'ตลาดเล็กกว่า ลูกค้าหนีง่ายกว่า นักลงทุนเลือกมาก', market: 0.85, churn: 1.15, vc: 0.85, harsh: 1.3, cash: 0, macro: 'slowdown' },
    brutal: { n: 'ชีวิตจริงฉบับไม่ปรุงแต่ง', d: 'เริ่มในช่วงเศรษฐกิจชะลอ ทุนหายาก ทุกอย่างพังได้ — 9 ใน 10 ไปไม่รอด', market: 0.75, churn: 1.25, vc: 0.7, harsh: 1.55, cash: 0, macro: 'slowdown' }
  };

  // Optional challenge modifiers layered on top of difficulty
  RW.CHALLENGES = {
    none: { n: 'ไม่มีเงื่อนไขพิเศษ', d: 'เส้นทางปกติ ระดมทุนได้ เล่นได้ 10 ปี' },
    bootstrap: { n: 'Bootstrap ล้วน', d: 'ห้ามขายหุ้นให้นักลงทุนตลอดเกม เงินทุนมาจากลูกค้า เงินกู้ และเงินส่วนตัวเท่านั้น' },
    crisis: { n: 'เริ่มกลางวิกฤต', d: 'เปิดบริษัทวันที่เศรษฐกิจถดถอยและ VC หยุดลงทุน ลูกค้ารัดเข็มขัด แต่คนเก่งหางานอยู่เยอะ' },
    sprint: { n: 'Sprint 5 ปี', d: 'มีเวลาแค่ 5 ปีพิสูจน์ตัวเอง วัดผลด้วยความมั่งคั่งเมื่อครบกำหนด' }
  };

  // Funding stages: typical (normal climate) round sizes and pre-money valuations in THB
  RW.STAGES = {
    preseed: { n: 'Pre-seed', amt: [1.5e6, 8e6], pre: [12e6, 45e6], next: 'seed' },
    seed: { n: 'Seed', amt: [10e6, 45e6], pre: [45e6, 180e6], next: 'A' },
    A: { n: 'Series A', amt: [80e6, 300e6], pre: [250e6, 900e6], next: 'B' },
    B: { n: 'Series B', amt: [350e6, 1.2e9], pre: [1.2e9, 4e9], next: 'C' },
    C: { n: 'Series C', amt: [1e9, 3.5e9], pre: [4e9, 14e9], next: 'D' },
    D: { n: 'Series D+ / Pre-IPO', amt: [2e9, 8e9], pre: [12e9, 40e9], next: 'D' }
  };
  RW.STAGE_ORDER = ['preseed', 'seed', 'A', 'B', 'C', 'D'];

  // ---------- Investor generator (fictional firms & people) ----------
  RW.genInvestors = function (industry) {
    var list = [];
    function add(o) { o.id = R.id('iv'); o.warm = 0; o.passedUntil = -1; o.history = []; list.push(o); }
    var angelBios = ['อดีตผู้ก่อตั้งที่ขายบริษัทให้กลุ่มทุนญี่ปุ่น', 'ผู้บริหารธนาคารที่ชอบลงทุนสตาร์ทอัพ', 'ทายาทธุรกิจอสังหาฯ', 'อดีต CTO บริษัทเทคฯ ระดับภูมิภาค', 'นักลงทุนสายเทคฯ ที่ปรึกษาหลายบริษัท', 'แพทย์ผู้ร่ำรวยจากคลินิกเครือข่าย', 'เจ้าของโรงงานรุ่นสองที่อยากลอง new economy', 'อดีตผู้บริหารห้างค้าปลีก'];
    var usedFirst = {};
    function uniquePerson() {
      for (var t = 0; t < 30; t++) { var n = RW.Names.person(); var f0 = n.split(' ')[0]; if (!usedFirst[f0]) { usedFirst[f0] = 1; return n; } }
      return RW.Names.person();
    }
    for (var i = 0; i < 7; i++) {
      add({ name: 'คุณ' + uniquePerson(), type: 'angel', bio: R.pick(angelBios), stages: ['preseed', 'seed'], check: [R.pick([3e5, 5e5, 1e6]), R.pick([1.5e6, 2e6, 3e6, 5e6])], lead: R.chance(0.3), rep: R.int(10, 45), friendly: R.int(55, 90), speed: R.int(1, 2), valueAdd: R.pick(['customers', 'talent', 'investors', 'none']), fit: { saas: R.range(0.6, 1.2), ecom: R.range(0.6, 1.2), fnb: R.range(0.5, 1.2) } });
    }
    add({ name: 'LaunchPad BKK Accelerator', type: 'accelerator', bio: 'โปรแกรมบ่มเพาะ 12 สัปดาห์ ให้เงินแลกหุ้นตายตัว พร้อม Demo Day', stages: ['preseed'], check: [1.5e6, 1.5e6], fixedPct: 0.07, lead: true, rep: 45, friendly: 80, speed: 1, valueAdd: 'investors', fit: { saas: 1.1, ecom: 1, fnb: 0.7 } });
    add({ name: 'Rocket Garage (โปรแกรมของธนาคาร)', type: 'accelerator', bio: 'Corporate accelerator ของธนาคารใหญ่ ไม่เอาหุ้น แต่ต้องทำ POC กับธนาคาร', stages: ['preseed'], check: [5e5, 5e5], fixedPct: 0, lead: true, rep: 35, friendly: 85, speed: 1, valueAdd: 'customers', fit: { saas: 1.2, ecom: 0.8, fnb: 0.4 } });
    var seedFunds = ['Saffron Seed Partners', 'Tamarind Capital', 'Monsoon Bay Ventures', 'Banyan Lane Ventures', 'Orchid Ridge Capital', 'Ratchada Venture Partners'];
    seedFunds.forEach(function (n) {
      add({ name: n, type: 'vc', bio: R.pick(['กองทุนระยะเริ่มต้นที่เน้นผู้ก่อตั้งไทย', 'Micro-VC ที่ช่วยเรื่องจ้างคนเก่ง', 'กองทุนที่มีเครือข่ายนักลงทุนสิงคโปร์', 'กองทุนที่ขึ้นชื่อเรื่องเงื่อนไขเข้มงวด']), stages: ['seed', 'A'].concat(R.chance(0.4) ? ['preseed'] : []), check: [R.pick([3e6, 5e6, 8e6]), R.pick([20e6, 30e6, 45e6])], lead: R.chance(0.7), rep: R.int(35, 70), friendly: R.int(30, 80), speed: R.int(2, 3), valueAdd: R.pick(['talent', 'customers', 'investors']), fit: { saas: R.range(0.7, 1.3), ecom: R.range(0.5, 1.2), fnb: R.range(0.3, 1.0) } });
    });
    var cvcs = [['SD Ventures (เครือสยามธนา)', 'CVC ของธนาคาร ให้ช่องทางลูกค้าองค์กร แต่ตัดสินใจช้าและอาจขอสิทธิ์ซื้อก่อน (ROFR)'], ['RR Corp Ventures (เครือรุ่งโรจน์)', 'CVC ของกลุ่มค้าปลีกยักษ์ใหญ่ ช่วยเรื่องช่องทางจัดจำหน่าย'], ['NextGen Telecom Ventures', 'CVC ของค่ายมือถือ ชอบดีลที่ใช้ประโยชน์จากฐานลูกค้าได้']];
    cvcs.forEach(function (c) {
      add({ name: c[0], type: 'cvc', bio: c[1], stages: ['seed', 'A', 'B'], check: [10e6, 150e6], lead: R.chance(0.5), rep: R.int(40, 65), friendly: R.int(40, 70), speed: 4, valueAdd: 'customers', rofr: true, fit: { saas: R.range(0.8, 1.3), ecom: R.range(0.8, 1.3), fnb: R.range(0.5, 1.2) } });
    });
    var regional = ['Strait Line Capital', 'Equator Ventures', 'Kopi Partners', 'Archipelago Growth'];
    regional.forEach(function (n) {
      add({ name: n, type: 'vc', bio: 'VC ระดับภูมิภาคจากสิงคโปร์/จาการ์ตา ลงทุนข้ามประเทศใน SEA', stages: ['A', 'B'], check: [R.pick([60e6, 100e6]), R.pick([300e6, 500e6])], lead: true, rep: R.int(60, 85), friendly: R.int(30, 70), speed: R.int(3, 4), valueAdd: R.pick(['investors', 'talent', 'customers']), fit: { saas: R.range(0.9, 1.3), ecom: R.range(0.7, 1.2), fnb: R.range(0.3, 0.9) } });
    });
    var growth = ['Northbridge Growth Equity', 'Halcyon Global', 'Pacific Crest Partners'];
    growth.forEach(function (n) {
      add({ name: n, type: 'growth', bio: 'กองทุน Growth ระดับโลก เช็คใหญ่ ประเมินมูลค่าสูง แต่คาดหวังการเติบโตโหดมาก', stages: ['B', 'C', 'D'], check: [R.pick([400e6, 700e6]), R.pick([2e9, 4e9])], lead: true, rep: R.int(75, 95), friendly: R.int(25, 60), speed: 4, valueAdd: 'investors', fit: { saas: R.range(1.0, 1.4), ecom: R.range(0.7, 1.1), fnb: R.range(0.3, 0.8) } });
    });
    add({ name: 'ครอบครัวตระกูลวัฒนพานิช (Family Office)', type: 'family', bio: 'Family office ของตระกูลเก่าแก่ ใจป้ำแต่ชอบเงื่อนไขพิเศษ', stages: ['seed', 'A', 'B'], check: [10e6, 120e6], lead: true, rep: R.int(25, 50), friendly: R.int(20, 55), speed: 3, valueAdd: 'customers', fit: { saas: 0.8, ecom: 1.1, fnb: 1.3 } });
    return list;
  };

  // Board & governance labels
  RW.TERMS = {
    pref: { '1x': 'Liquidation Pref 1 เท่า (non-participating)', '1xp': '1 เท่า แบบ Participating (กินสองต่อ)', '2x': '2 เท่า (non-participating)' },
    anti: { broad: 'Broad-based weighted average', full: 'Full ratchet (โหดมาก)' }
  };
})(globalThis.RW = globalThis.RW || {});
