/* RUNWAY — core utilities: seeded RNG, math, formatting, calendar, name generators */
(function (RW) {
  'use strict';

  // ---------- Seeded RNG (mulberry32). State lives inside the save game. ----------
  var R = (RW.R = {
    st: { s: 1 },
    bind: function (st) { R.st = st; },
    f: function () {
      var t = (R.st.s = (R.st.s + 0x6d2b79f5) | 0);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    range: function (a, b) { return a + (b - a) * R.f(); },
    int: function (a, b) { return Math.floor(a + (b - a + 1) * R.f()); },
    chance: function (p) { return R.f() < p; },
    pick: function (arr) { return arr[Math.floor(R.f() * arr.length)]; },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(R.f() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    },
    weighted: function (items, wf) {
      var tot = 0, i, w = [];
      for (i = 0; i < items.length; i++) { w[i] = Math.max(0, wf(items[i])); tot += w[i]; }
      if (tot <= 0) return null;
      var r = R.f() * tot;
      for (i = 0; i < items.length; i++) { r -= w[i]; if (r <= 0) return items[i]; }
      return items[items.length - 1];
    },
    normal: function (mean, sd) {
      var u = 1 - R.f(), v = R.f();
      return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    // Poisson draw (Knuth for small lambda, normal approx for large)
    poisson: function (lam) {
      if (!(lam > 0)) return 0;
      if (lam > 40) return Math.max(0, Math.round(R.normal(lam, Math.sqrt(lam))));
      var L = Math.exp(-lam), k = 0, p = 1;
      do { k++; p *= R.f(); } while (p > L);
      return k - 1;
    },
    // Binomial draw
    binom: function (n, p) {
      n = Math.floor(n);
      if (n <= 0 || p <= 0) return 0;
      if (p >= 1) return n;
      if (n < 30) { var c = 0; for (var i = 0; i < n; i++) if (R.f() < p) c++; return c; }
      var m = n * p, sd = Math.sqrt(n * p * (1 - p));
      if (m < 10) return Math.min(n, R.poisson(m));
      return Math.max(0, Math.min(n, Math.round(R.normal(m, sd))));
    },
    // fractional count -> integer with expected value preserved
    round: function (x) { var f = Math.floor(x); return f + (R.f() < x - f ? 1 : 0); },
    id: function (prefix) { return (prefix || 'x') + Math.floor(R.f() * 1e9).toString(36); }
  });

  // ---------- Math helpers ----------
  var U = (RW.U = {
    clamp: function (x, a, b) { return x < a ? a : x > b ? b : x; },
    lerp: function (a, b, t) { return a + (b - a) * t; },
    sat: function (x, k) { return 1 - Math.exp(-x / k); },
    sigmoid: function (x) { return 1 / (1 + Math.exp(-x)); },
    sum: function (arr, f) { var s = 0; for (var i = 0; i < arr.length; i++) s += f ? f(arr[i]) : arr[i]; return s; },
    avg: function (arr, f) { return arr.length ? U.sum(arr, f) / arr.length : 0; },
    last: function (arr, n) { return arr.slice(Math.max(0, arr.length - (n || 1))); },
    approach: function (cur, target, rate) { return cur + (target - cur) * rate; },
    weeklyFromMonthly: function (m) { return 1 - Math.pow(1 - U.clamp(m, 0, 0.999), 12 / 52); },
    monthlyFromWeekly: function (w) { return 1 - Math.pow(1 - w, 52 / 12); },
    deepCopy: function (o) { return JSON.parse(JSON.stringify(o)); },
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
  });

  // ---------- Formatting ----------
  var F = (RW.F = {
    num: function (n, d) {
      if (n == null || isNaN(n)) return '–';
      return Number(n).toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
    },
    // full baht
    b: function (n) {
      if (n == null || isNaN(n)) return '–';
      var neg = n < 0;
      return (neg ? '−฿' : '฿') + F.num(Math.abs(Math.round(n)));
    },
    // compact baht: ฿850K / ฿1.25M / ฿3.4B
    m: function (n, digits) {
      if (n == null || isNaN(n)) return '–';
      var a = Math.abs(n), s = n < 0 ? '−฿' : '฿', d = digits == null ? 2 : digits;
      if (a >= 1e9) return s + (a / 1e9).toFixed(a >= 1e11 ? 0 : d) + 'B';
      if (a >= 1e6) return s + (a / 1e6).toFixed(a >= 1e8 ? 0 : a >= 1e7 ? 1 : d) + 'M';
      if (a >= 1e4) return s + Math.round(a / 1e3) + 'K';
      if (a >= 1e3) return s + (a / 1e3).toFixed(1) + 'K';
      return s + Math.round(a);
    },
    // compact plain number
    k: function (n) {
      if (n == null || isNaN(n)) return '–';
      var a = Math.abs(n), s = n < 0 ? '−' : '';
      if (a > 0 && a < 10 && Math.round(a) !== a) return s + a.toFixed(a < 1 ? 2 : 1);
      if (a >= 1e9) return s + (a / 1e9).toFixed(1) + 'B';
      if (a >= 1e6) return s + (a / 1e6).toFixed(a >= 1e7 ? 1 : 2) + 'M';
      if (a >= 1e4) return s + Math.round(a / 1e3) + 'K';
      if (a >= 1e3) return s + (a / 1e3).toFixed(1) + 'K';
      return s + Math.round(a);
    },
    pct: function (x, d) {
      if (x == null || isNaN(x) || !isFinite(x)) return '–';
      return (x * 100).toFixed(d == null ? 1 : d) + '%';
    },
    spct: function (x, d) {
      if (x == null || isNaN(x) || !isFinite(x)) return '–';
      return (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x * 100).toFixed(d == null ? 1 : d) + '%';
    },
    months: function (m) {
      if (m == null || isNaN(m)) return '–';
      if (!isFinite(m) || m > 120) return '∞';
      if (m < 1) return Math.max(0, Math.round(m * 4.33)) + ' สัปดาห์';
      return m.toFixed(m < 10 ? 1 : 0) + ' เดือน';
    },
    x: function (v, d) { return (v == null || !isFinite(v)) ? '–' : v.toFixed(d == null ? 1 : d) + 'x'; }
  });

  // ---------- Calendar: 4-4-5 retail calendar, 52 weeks/year, game starts Jan 2027 ----------
  var TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  var TH_MONTHS_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  RW.T = {
    START_YEAR: 2027,
    MONTHS: TH_MONTHS,
    MONTHS_FULL: TH_MONTHS_FULL,
    info: function (w) {
      var year = RW.T.START_YEAR + Math.floor(w / 52);
      var woy = w % 52;
      var q = Math.floor(woy / 13);
      var wiq = woy % 13;
      var mq = wiq < 4 ? 0 : wiq < 8 ? 1 : 2;
      var month = q * 3 + mq;
      var monthStart = mq === 0 ? 0 : mq === 1 ? 4 : 8;
      var weeksInMonth = mq === 2 ? 5 : 4;
      var weekOfMonth = wiq - monthStart;
      var monthEnd = wiq === 3 || wiq === 7 || wiq === 12;
      return {
        w: w, year: year, be: year + 543, woy: woy, quarter: q, month: month,
        weekOfMonth: weekOfMonth, weeksInMonth: weeksInMonth,
        monthEnd: monthEnd, quarterEnd: wiq === 12, yearEnd: woy === 51,
        monthStart: weekOfMonth === 0, yearStart: woy === 0,
        monthsElapsed: Math.floor(w / 52) * 12 + month
      };
    },
    label: function (w) {
      var i = RW.T.info(w);
      return TH_MONTHS[i.month] + ' ' + i.be + ' · สัปดาห์ ' + (i.weekOfMonth + 1);
    },
    monthLabel: function (monthsElapsed) {
      var y = RW.T.START_YEAR + Math.floor(monthsElapsed / 12);
      return TH_MONTHS[monthsElapsed % 12] + ' ' + String(y + 543).slice(2);
    },
    weekOfMonthIndex: function (monthsElapsed) {
      // first week index of an absolute month index
      var y = Math.floor(monthsElapsed / 12), m = monthsElapsed % 12;
      var q = Math.floor(m / 3), mq = m % 3;
      return y * 52 + q * 13 + (mq === 0 ? 0 : mq === 1 ? 4 : 8);
    },
    yearsSince: function (w0, w1) { return (w1 - w0) / 52; }
  };

  // ---------- Thai name generators ----------
  var FIRST = ['ณัฐวุฒิ', 'ธนพล', 'กิตติพัฒน์', 'ปิยะพงษ์', 'วรเมธ', 'ศุภกร', 'ภาณุพงศ์', 'อนุชา', 'ชยพล', 'ธีรภัทร', 'พีรพัฒน์', 'สิรวิชญ์', 'กฤษดา', 'ณภัทร', 'ภูมิ', 'ปัณณวัฒน์', 'เตชิน', 'จิรายุ', 'นนทกร', 'วีรภัทร',
    'ธัญญ์ชนก', 'ปวีณา', 'กมลชนก', 'ชนิดา', 'พิมพ์ชนก', 'สุพิชญา', 'ณัฐธิดา', 'อรอุมา', 'ศิริลักษณ์', 'วรรณิดา', 'ภัทรา', 'ญาณิศา', 'กัญญาณัฐ', 'ปริยากร', 'มนัสนันท์', 'ธนัชพร', 'รินรดา', 'อลิสา', 'ชลธิชา', 'พรรษชล',
    'ธนวัฒน์', 'ปรเมศวร์', 'ศักดิ์ชัย', 'อิทธิพล', 'นพดล', 'วิศรุต', 'สรวิศ', 'ภาคิน', 'คุณากร', 'ณัฐนนท์', 'ปภาวี', 'ลลิตา', 'จิดาภา', 'นภัสสร', 'เบญญาภา', 'ชาลิสา', 'ขวัญข้าว', 'ปุณยวีร์', 'ศศิธร', 'อาภัสรา'];
  var LAST = ['ศรีสุข', 'วงศ์ไพศาล', 'ทองดี', 'แสงอรุณ', 'จันทร์เพ็ญ', 'รัตนวงศ์', 'บุญมา', 'พงษ์พานิช', 'สุวรรณรัตน์', 'เจริญผล', 'อินทรประเสริฐ', 'กิจเจริญ', 'ธนากร', 'ศิริพงษ์', 'ประเสริฐวงศ์', 'ชัยมงคล', 'ลิ้มสกุล', 'ตั้งตระกูล', 'แก้วมณี', 'เลิศวิไล',
    'อุดมสุข', 'นาคสวัสดิ์', 'พรหมมา', 'ศักดิ์ศรี', 'วัฒนกุล', 'จิตรภักดี', 'โชติช่วง', 'มหาวงศ์', 'สมบูรณ์ชัย', 'เกียรติยศ', 'สุขเกษม', 'อัครวงศ์', 'ปัญญาดี', 'ชูเกียรติ', 'บรรจงศิลป์', 'ทวีทรัพย์', 'พิทักษ์ไทย', 'หอมจันทร์', 'วิเศษสุวรรณ', 'คงมั่น'];
  var NICK = ['บอส', 'เบียร์', 'ต้น', 'ฟ้า', 'มิ้นท์', 'แบงก์', 'นุ่น', 'ปอ', 'เอิร์ธ', 'ไอซ์', 'จูน', 'ภูมิ', 'แพร', 'โอ๊ต', 'ปาล์ม', 'เฟิร์น', 'กอล์ฟ', 'ขิม', 'บีม', 'อาร์ม', 'นิว', 'เมย์', 'ตาล', 'ฝน', 'พลอย', 'ก้อง', 'วิว', 'ออม', 'เจ', 'หมิว'];
  RW.Names = {
    person: function () { return R.pick(FIRST) + ' ' + R.pick(LAST); },
    nick: function () { return R.pick(NICK); },
    company: function (kind) {
      var pre = ['สยาม', 'ไทย', 'แอดวานซ์', 'เอเชีย', 'รุ่งเรือง', 'ศรีกรุง', 'บางกอก', 'ยูไนเต็ด', 'โกลเด้น', 'พรีเมียร์', 'ซิตี้', 'นครทอง', 'อีสเทิร์น', 'แกรนด์', 'ทรัพย์สมบูรณ์', 'เมืองไทย'];
      var mid = { factory: ['อุตสาหกรรม', 'แมนูแฟคเจอริ่ง', 'พลาสติก', 'ออโตพาร์ท', 'ฟู้ดส์', 'สตีล', 'เท็กซ์ไทล์'], service: ['โลจิสติกส์', 'คอนสตรัคชั่น', 'เทรดดิ้ง', 'เฮลท์แคร์', 'รีเทล', 'ดีเวลลอปเมนท์', 'เอ็นจิเนียริ่ง', 'การแพทย์'], any: ['กรุ๊ป', 'โฮลดิ้ง', 'คอร์ปอเรชั่น', 'อินเตอร์', 'เวนเจอร์'] };
      var m = R.pick(mid[kind] || mid.service.concat(mid.factory));
      return R.pick(pre) + m + (R.chance(0.5) ? ' จำกัด' : ' จำกัด (มหาชน)');
    }
  };
})(globalThis.RW = globalThis.RW || {});
