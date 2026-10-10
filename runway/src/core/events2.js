/* RUNWAY — more dilemmas: ethics, people, legal, industry-specific */
(function (RW) {
  'use strict';
  var R = RW.R, U = RW.U, F = RW.F, L = RW.Ledger;
  var E = RW.Events, H = E.H;
  function rev(s) { return Math.max(150000, s.kpi.revenueMonthly || 0); }

  E.register({
    id: 'grey_client', cat: 'sales', weight: 0.7, cooldown: 80, once: true,
    cond: function (s) { return s.time.w > 20 && (s.kpi.revenueMonthly || 0) > 100000; },
    title: 'ลูกค้ารายใหญ่จากธุรกิจสีเทา',
    body: function (s) { return 'บริษัทที่ "ทุกคนรู้" ว่าเป็นหน้าฉากของเว็บพนันออนไลน์ ติดต่อมาขอใช้บริการ/สั่งของล็อตใหญ่ จ่ายเงินสดล่วงหน้า ' + F.b(rev(s) * 4) + ' ทันที ไม่ต่อราคา\n\nเงินก้อนนี้เท่ากับรายได้ 4 เดือน แต่ถ้าวันหนึ่ง ปปง. ตามรอยเส้นทางการเงิน...'; },
    choices: function (s) {
      var amt = Math.round(rev(s) * 4 / 1000) * 1000;
      return [
        { t: 'รับ — เงินก็คือเงิน', d: 'เงินสดก้อนใหญ่ทันที', fx: function () { L.post(s.fin, { cash: amt, rev_other: -amt }, 'op'); s.flags.grey = 1; E.later(s, R.int(20, 70), 'grey_amlo', { amt: amt }); return 'เงินเข้าบัญชี ' + F.b(amt) + ' — ทีมบางคนตั้งคำถามเงียบๆ'; } },
        { t: 'ปฏิเสธ', fx: function () { H.morale(s, 2, 8, 'ผู้ก่อตั้งยึดหลักจริยธรรม'); return 'คุณเลือกเงินที่สะอาด'; } }
      ];
    }
  });
  E.effect('grey_amlo', function (s, d) {
    if (!R.chance(0.35)) return;
    var frozen = Math.min(Math.max(0, s.fin.bal.cash), d.amt * 1.5);
    if (frozen > 0) { s.flags.frozen = { amt: frozen, until: s.time.w + 16 }; L.post(s.fin, { cash: -frozen, prepaid: frozen }, 'op'); }
    L.spend(s.fin, 'prof', 300000);
    H.rep(s, -15); H.brand(s, -10);
    H.mail(s, 'ปปง. อายัดบัญชีบริษัท', 'ลูกค้าธุรกิจสีเทารายนั้นถูกกวาดล้าง ปปง. อายัดบัญชีบริษัทคุณ ' + F.b(frozen) + ' ระหว่างตรวจสอบเส้นทางการเงิน 4 เดือน ค่าทนาย ฿300,000 สื่อลงข่าว', 'bad');
  });

  E.register({
    id: 'gov_tender', cat: 'sales', weight: 0.7, cooldown: 70,
    cond: function (s) { return s.company.registered && s.time.w > 30 && (s.kpi.revenueMonthly || 0) > 200000 && s.industry !== 'fnb'; },
    title: 'งานประมูลภาครัฐ — มีคนเสนอ "ช่วยวิ่ง"',
    body: function (s) { return 'หน่วยงานรัฐเปิดประมูลงานมูลค่า ' + F.b(rev(s) * 8) + ' นายหน้าคนหนึ่งบอกว่า "ผลถูกล็อกไว้แล้ว ถ้าอยากได้ต้องมีค่าดำเนินการ 15% จ่ายก่อนครึ่งหนึ่ง"'; },
    choices: function (s) {
      var v = Math.round(rev(s) * 8 / 10000) * 10000;
      return [
        { t: 'จ่ายค่าวิ่งเต้น', d: 'ได้งานแน่ แต่ผิดกฎหมาย', fx: function () { L.spend(s.fin, 'other_exp', v * 0.075); s.flags.bribe = (s.flags.bribe || 0) + 1; E.later(s, 10, 'tender_win', { v: v, dirty: 1 }); if (R.chance(0.3)) E.later(s, R.int(30, 100), 'bribe_scandal', {}); return 'จ่ายงวดแรก ' + F.b(v * 0.075) + ' ไปแล้ว'; } },
        { t: 'ยื่นประมูลตามปกติ', d: 'โอกาสชนะต่ำ', fx: function () { L.spend(s.fin, 'prof', 40000); if (R.chance(0.18)) E.later(s, 10, 'tender_win', { v: v }); return 'ยื่นเอกสารแล้ว — ผลประกาศใน 10 สัปดาห์'; } },
        { t: 'แจ้ง ป.ป.ช. และไม่ยื่น', fx: function () { H.rep(s, 4); return 'คุณยื่นเรื่องร้องเรียน ชื่อเสียงในหมู่ผู้ประกอบการดีขึ้น'; } }
      ];
    }
  });
  E.effect('tender_win', function (s, d) {
    L.invoice(s, s.industry === 'ecom' ? 'rev_goods' : 'rev_svc', d.v, s.time.w + 13, { name: 'หน่วยงานรัฐ', wht: true });
    if (d.dirty) L.spend(s.fin, 'other_exp', d.v * 0.075);
    if (s.industry === 'saas') s.biz.impl += 15;
    H.mail(s, 'ชนะประมูลงานภาครัฐ ' + F.b(d.v), 'หน่วยงานรัฐจ่ายเงินช้า (~90 วัน)' + (d.dirty ? ' · จ่ายค่าดำเนินการงวดสองแล้ว' : '') + (s.industry === 'saas' ? ' · งานติดตั้ง 15 dev-weeks' : ''), 'good');
  });

  E.register({
    id: 'remote_move', cat: 'team', weight: 1, cooldown: 40,
    cond: function (s) { return RW.Team.active(s).some(function (e) { return e.level >= 3 && s.time.w - e.startW > 26; }); },
    init: function (s) { var e = H.pickEmp(s, function (e) { return e.level >= 3 && s.time.w - e.startW > 26; }); return e ? { emp: e.id } : null; },
    valid: function (s, d) { var e = H.emp(s, d.emp); return e && !e.gone; },
    title: function (s, d) { return H.emp(s, d.emp).name + ' ขอย้ายไปทำงานจากเชียงใหม่'; },
    body: function (s, d) { var e = H.emp(s, d.emp); return e.nick + ' (' + RW.ROLES[e.role].n + ') บอกว่าแฟนได้งานที่เชียงใหม่ อยากย้ายไปแต่ยังอยากทำงานกับบริษัทแบบรีโมทเต็มเวลา ถ้าไม่ได้ก็คงต้องลาออก\n\nนโยบายบริษัทตอนนี้: ' + RW.POLICIES.workmode[s.team.policy.workmode].n; },
    choices: function (s, d) {
      var e = H.emp(s, d.emp);
      return [
        { t: 'อนุญาต', d: 'รักษาคนเก่งไว้ ทีมอาจขอบ้าง', fx: function () { e.morale = Math.min(100, e.morale + 15); e.remote = true; if (s.team.policy.workmode === 0) H.morale(s, -2, 10, 'คนอื่นอยากได้สิทธิ์แบบเดียวกัน'); return e.nick + ' ซาบซึ้งมาก ทำงานได้ดีเหมือนเดิม'; } },
        { t: 'อนุญาตแต่ลดเงินเดือน 10% (ค่าครองชีพต่ำกว่า)', fx: function () { e.salary = Math.round(e.salary * 0.9 / 500) * 500; e.morale -= 8; return e.nick + ' ยอมรับแต่ไม่ค่อยพอใจ'; } },
        { t: 'ไม่อนุญาต', fx: function () { if (R.chance(0.7)) { RW.Team.resign(s, e); return e.nick + ' ยื่นใบลาออก'; } e.morale -= 20; return e.nick + ' ยอมอยู่กรุงเทพฯ แต่หมดไฟ'; } }
      ];
    }
  });

  E.register({
    id: 'list_theft', cat: 'admin', weight: 0.9, cooldown: 60, bad: true,
    cond: function (s) { return s.team.history.quit > 0 && (s.kpi.customers || 0) > 30 && s.industry !== 'fnb'; },
    title: 'อดีตพนักงานขายเอารายชื่อลูกค้าไปให้คู่แข่ง',
    body: 'อดีตพนักงานที่เพิ่งลาออกไปอยู่กับคู่แข่ง โทรหาลูกค้าของคุณทีละรายพร้อมเสนอส่วนลด มีหลักฐานว่าเขาดาวน์โหลดฐานข้อมูลลูกค้าก่อนออก',
    choices: function (s) {
      return [
        { t: 'ฟ้องละเมิดความลับทางการค้า (' + F.b(H.sc(s, 250000)) + ')', fx: function () { L.spend(s.fin, 'prof', H.sc(s, 250000)); if (R.chance(0.5)) { L.post(s.fin, { cash: H.sc(s, 400000), other_income: -H.sc(s, 400000) }, 'op'); return 'ชนะคดี ได้ค่าเสียหายคืน และคู่แข่งต้องหยุด'; } return 'คดียืดเยื้อ สุดท้ายยกฟ้องเพราะสัญญาจ้างไม่ได้เขียนเรื่องนี้ไว้'; } },
        { t: 'โทรหาลูกค้าสำคัญทุกรายด้วยตัวเอง', d: 'ใช้เวลาและพลังงานคุณ', fx: function () { H.energy(s, -12); return 'รักษาลูกค้าไว้ได้เกือบทั้งหมด'; } },
        { t: 'ปล่อยไป', fx: function () { if (s.industry === 'saas') { var seg = s.biz.segs.sme; seg.cohorts.forEach(function (c) { c.n = Math.round(c.n * 0.96); }); } H.brand(s, -2); return 'เสียลูกค้าบางส่วนให้คู่แข่ง'; } }
      ];
    }
  });

  E.register({
    id: 'embezzle', cat: 'admin', weight: function (s) { return s.flags.booksMessy ? 1.2 : 0.4; }, cooldown: 120, once: true, bad: true,
    cond: function (s) { return RW.Team.active(s).some(function (e) { return e.role === 'finance'; }) && s.time.w > 40; },
    title: 'พบเงินหายจากบัญชีบริษัท',
    body: function (s) { return 'ระหว่างกระทบยอดบัญชี พบว่ามีการโอนเงินเข้าบัญชีบุคคลภายนอกหลายครั้ง รวม ' + F.b(H.sc(s, 600000)) + ' ย้อนไป 8 เดือน ทุกรายการอนุมัติด้วยรหัสของพนักงานบัญชี'; },
    choices: function (s) {
      var amt = H.sc(s, 600000);
      var acc = RW.Team.active(s).find(function (e) { return e.role === 'finance'; });
      return [
        { t: 'แจ้งความดำเนินคดี + เลิกจ้างทันที', fx: function () { L.spend(s.fin, 'other_exp', amt); if (acc) RW.Team.remove(s, acc, 'fire'); s.flags.booksMessy = 1; if (R.chance(0.35)) { L.post(s.fin, { cash: amt * 0.5, other_income: -amt * 0.5 }, 'op'); return 'ตำรวจตามเงินคืนได้ครึ่งหนึ่ง'; } return 'เงินหายไปแล้ว บทเรียนเรื่องระบบอนุมัติสองชั้น'; } },
        { t: 'ให้ลาออกเงียบๆ แลกกับทยอยคืนเงิน', fx: function () { L.spend(s.fin, 'other_exp', amt); if (acc) RW.Team.remove(s, acc, 'quit'); if (R.chance(0.5)) { L.post(s.fin, { cash: amt * 0.7, other_income: -amt * 0.7 }, 'op'); return 'ได้เงินคืน 70%'; } return 'หลังลาออกก็ติดต่อไม่ได้อีกเลย'; } }
      ];
    }
  });

  E.register({
    id: 'early_helper_claim', cat: 'admin', weight: 0.5, once: true, bad: true,
    cond: function (s) { return s.funding.rounds.length > 0 && s.funding.lastPost > 50e6; },
    title: 'เพื่อนเก่าอ้างว่าเคยถูกสัญญาว่าจะได้หุ้น',
    body: 'เพื่อนที่ช่วยออกแบบโลโก้และให้คำปรึกษาช่วงแรกๆ ส่งหนังสือทนายมา อ้างว่าคุณเคยพูดในแชทว่า "ถ้าบริษัทไปได้ เดี๋ยวแบ่งหุ้นให้" ตอนนี้บริษัทมีมูลค่าหลายสิบล้าน เขาต้องการหุ้น 2%',
    choices: function (s) {
      return [
        { t: 'ยอมให้หุ้น 0.75% ยุติเรื่อง', fx: function () { var sh = Math.round(RW.Funding.fullyDiluted(s) * 0.0075); RW.Funding.addHolder(s, { id: 'friend1', name: 'เพื่อนผู้ช่วยช่วงแรก', kind: 'advisor', cls: 'common', shares: sh }); return 'เคลียร์จบ ความสัมพันธ์ไม่เหมือนเดิม'; } },
        { t: 'สู้คดี — แชทไม่ใช่สัญญา', fx: function () { L.spend(s.fin, 'prof', 200000); s.flags.lawsuit = 1; E.later(s, R.int(20, 40), 'helper_verdict', {}); return 'ทนายบอกว่าโอกาสชนะ 60%'; } }
      ];
    }
  });
  E.effect('helper_verdict', function (s) {
    s.flags.lawsuit = 0;
    if (R.chance(0.6)) H.mail(s, 'ชนะคดีเรื่องหุ้น', 'ศาลเห็นว่าข้อความในแชทไม่มีรายละเอียดพอจะเป็นสัญญา', 'good');
    else { var sh = Math.round(RW.Funding.fullyDiluted(s) * 0.015); RW.Funding.addHolder(s, { id: 'friend1', name: 'เพื่อนผู้ช่วยช่วงแรก', kind: 'advisor', cls: 'common', shares: sh }); H.mail(s, 'แพ้คดีเรื่องหุ้น', 'ศาลสั่งให้โอนหุ้น 1.5% ให้โจทก์', 'bad'); }
  });

  E.register({
    id: 'family_call', cat: 'founder', weight: 0.6, once: true,
    cond: function (s) { return s.time.w > 40; },
    title: 'ครอบครัวขอให้กลับไปช่วยกิจการที่บ้าน',
    body: 'คุณแม่โทรมาร้องไห้ ธุรกิจครอบครัวที่ต่างจังหวัดกำลังมีปัญหาหนัก พี่ชายรับมือไม่ไหว อยากให้คุณกลับไปช่วยสักพัก "ทำบริษัทของตัวเองมาตั้งนาน ยังไม่เห็นได้อะไรเลย"',
    choices: function (s) {
      return [
        { t: 'กลับไปช่วย 3 เดือน (ทำงานบริษัทได้ครึ่งเวลา)', fx: function () { s.founder.hours = Math.max(30, Math.round(s.founder.hours * 0.6)); H.life(s, 20); E.later(s, 13, 'family_back', {}); return 'คุณทำงานสองที่ เหนื่อยแต่ครอบครัวอุ่นใจ'; } },
        { t: 'ส่งเงินช่วยแทน ฿300,000', fx: function () { H.personal(s, -300000); H.life(s, 5); return 'ครอบครัวเข้าใจ (บ้าง)'; } },
        { t: 'ปฏิเสธ บริษัทกำลังสำคัญ', fx: function () { H.life(s, -20); H.stress(s, 8); return 'ครอบครัวผิดหวังในตัวคุณอย่างมาก'; } }
      ];
    }
  });
  E.effect('family_back', function (s) { s.founder.hours = Math.max(s.founder.hours, 55); H.mail(s, 'กลับมาทำงานเต็มเวลา', 'กิจการที่บ้านเริ่มตั้งตัวได้ คุณกลับมาทุ่มเทให้บริษัทเต็มที่', 'good'); });

  E.register({
    id: 'exec_offer_founder', cat: 'founder', weight: 0.5, once: true,
    cond: function (s) { return s.funding.lastPost > 300e6 && s.time.w > 104; },
    title: 'บริษัทข้ามชาติชวนคุณไปเป็นผู้บริหารระดับภูมิภาค',
    body: 'Headhunter เสนอตำแหน่ง Managing Director ประจำ SEA ของบริษัทเทคฯ ระดับโลก เงินเดือน ฿900,000 ต่อเดือน + หุ้น RSU มูลค่า 30 ล้าน — "ทุกอย่างที่คุณพยายามสร้าง ได้มาทันทีโดยไม่ต้องเสี่ยง"',
    choices: function (s) {
      return [
        { t: 'ปฏิเสธ — นี่คือบริษัทของฉัน', fx: function () { H.morale(s, 3, 10, 'ผู้ก่อตั้งเลือกอยู่กับทีม'); return 'ทีมรู้ข่าวและฮึกเหิม'; } },
        { t: 'รับข้อเสนอ ส่งต่อบริษัทให้ CEO ใหม่', d: 'จบเกม (คุณยังถือหุ้นไว้)', fx: function () { s.founder.cash += 900000 * 12 * 0.65 + 30e6 * 0.5; RW.Engine.gameOver(s, 'fired', 'คุณลาออกไปเป็นผู้บริหารบริษัทข้ามชาติ และส่งต่อบริษัทให้ CEO มืออาชีพ'); return 'จบเกม'; } }
      ];
    }
  });

  E.register({
    id: 'charity', cat: 'market', weight: 0.6, cooldown: 52,
    cond: function (s) { return (s.kpi.revenueMonthly || 0) > 300000; },
    title: 'ขอรับบริจาคช่วยผู้ประสบภัย',
    body: 'เกิดน้ำป่าไหลหลากในภาคเหนือ ชุมชนหลายแห่งเดือดร้อน ทีมงานอยากให้บริษัทร่วมบริจาค บางคนเสนอให้ทำแคมเปญ "ทุกออเดอร์บริจาค 10 บาท"',
    choices: function (s) {
      return [
        { t: 'บริจาคเงิน ' + F.b(H.sc(s, 100000)) + ' เงียบๆ', fx: function () { L.spend(s.fin, 'other_exp', H.sc(s, 100000)); H.morale(s, 3, 10, 'บริษัทช่วยสังคม'); return 'ทีมภูมิใจในบริษัท'; } },
        { t: 'ทำแคมเปญประชาสัมพันธ์ + บริจาค', fx: function () { L.spend(s.fin, 'other_exp', H.sc(s, 100000)); if (R.chance(0.25)) { H.brand(s, -4); return 'ชาวเน็ตบางส่วนมองว่าหาประโยชน์จากภัยพิบัติ'; } H.brand(s, 4); H.buzz(s, 1.08, 3); return 'แบรนด์ได้ภาพลักษณ์ดี'; } },
        { t: 'ไม่บริจาค', fx: function () { H.morale(s, -1, 6, ''); return 'ทีมบางคนผิดหวังเล็กน้อย'; } }
      ];
    }
  });

  E.register({
    id: 'office_breakin', cat: 'admin', weight: 0.5, cooldown: 100, bad: true,
    cond: function (s) { return s.company.office.type !== 'home' && s.company.office.type !== 'cowork' && RW.Team.headcount(s) > 5; },
    title: 'ออฟฟิศถูกงัด',
    body: function (s) { return 'ช่วงวันหยุดยาวมีคนงัดเข้าออฟฟิศ ขโมยโน้ตบุ๊ก ' + Math.min(12, RW.Team.headcount(s)) + ' เครื่อง' + (s.company.insured ? ' — มีประกันคุ้มครองบางส่วน' : ''); },
    choices: function (s) {
      var n = Math.min(12, RW.Team.headcount(s));
      var cost = n * 38000 * (s.company.insured ? 0.2 : 1);
      return [
        { t: 'ซื้อเครื่องใหม่ + ติดระบบรักษาความปลอดภัย (' + F.b(cost + 60000) + ')', fx: function () { L.spend(s.fin, 'office', cost + 60000); return 'ทุกคนกลับมาทำงานได้ใน 2 วัน'; } },
        { t: 'ซื้อเครื่องใหม่อย่างเดียว (' + F.b(cost) + ')', fx: function () { L.spend(s.fin, 'office', cost); if (s.biz && s.biz.security != null) s.biz.security -= 5; return 'เรียบร้อย แต่ข้อมูลในเครื่องที่หายอาจรั่ว'; } }
      ];
    }
  });

  // ---------- industry-specific ----------
  E.register({
    id: 'saas_ltd', cat: 'sales', ind: ['saas'], weight: 0.6, once: true,
    cond: function (s) { return s.biz.launched && RW.Models.saas.totalCustomers(s.biz) > 20; },
    title: 'แพลตฟอร์มดีลเสนอขาย "Lifetime deal"',
    body: function (s) { var p = Math.round(s.biz.segs.micro.price * 8 / 100) * 100; return 'เว็บไซต์ดีลซอฟต์แวร์ชื่อดังเสนอขายแพ็กเกจจ่ายครั้งเดียวใช้ตลอดชีพราคา ' + F.b(p) + ' คาดว่าขายได้ ~600 สิทธิ์ (แพลตฟอร์มหัก 70%) — เงินสดก้อนใหญ่ แต่ลูกค้ากลุ่มนี้ไม่จ่ายอีกเลยและใช้ซัพพอร์ตหนัก'; },
    choices: function (s) {
      var p = Math.round(s.biz.segs.micro.price * 8 / 100) * 100;
      return [
        { t: 'ตกลง', fx: function () { var cash = Math.round(600 * p * 0.3); L.post(s.fin, { cash: cash, rev_svc: -cash }, 'op'); s.biz.ltd = (s.biz.ltd || 0) + 600; s.biz.brand += 3; return 'ได้เงิน ' + F.b(cash) + ' — ผู้ใช้ 600 รายจะสร้างงานซัพพอร์ตไปตลอด'; } },
        { t: 'ปฏิเสธ', fx: function () { return 'รักษามูลค่าของสินค้าไว้'; } }
      ];
    }
  });

  E.register({
    id: 'saas_platform_feature', cat: 'market', ind: ['saas'], weight: 0.4, once: true, bad: true,
    cond: function (s) { return s.time.w > 80; },
    title: 'แพลตฟอร์มยักษ์ใส่ฟีเจอร์แบบคุณให้ใช้ฟรี',
    body: 'แอปแชทและแพลตฟอร์มคลาวด์ที่ธุรกิจไทยใช้กันทุกบริษัท ประกาศฟีเจอร์ใหม่ที่ทำได้ 60% ของสินค้าคุณ "ฟรี" สำหรับผู้ใช้ทุกคน นักวิเคราะห์บอกว่าลูกค้ารายเล็กจะไหลออก',
    choices: function (s) {
      return [
        { t: 'ถอยจากลูกค้าจิ๋ว ไปเน้น SME ขึ้นไป', fx: function () { s.biz.segs.micro.on = false; s.biz.segs.micro.cohorts.forEach(function (c) { c.n = Math.round(c.n * 0.85); }); return 'เสียลูกค้าจิ๋วบางส่วน แต่โฟกัสชัดขึ้น'; } },
        { t: 'ทำ integration กับแพลตฟอร์มนั้นแทนการแข่ง', fx: function () { var b = s.biz; if (b.feats.integ < 4) { b.roadmap = b.roadmap.filter(function (r) { return r.f !== 'integ'; }); b.roadmap.unshift({ f: 'integ', prog: 0 }); } b.buzz.push({ m: 0.9, weeks: 12, total: 12 }); return 'ทีมเร่งพัฒนา integration — ระยะสั้นกระทบ ระยะยาวได้พันธมิตร'; } },
        { t: 'ไม่ทำอะไร', fx: function () { s.biz.buzz.push({ m: 0.75, weeks: 20, total: 20 }); s.biz.segs.micro.cohorts.forEach(function (c) { c.n = Math.round(c.n * 0.85); }); return 'ลูกค้ารายเล็กไหลออกต่อเนื่อง'; } }
      ];
    }
  });

  E.register({
    id: 'ecom_ad_ban', cat: 'market', ind: ['ecom'], weight: 0.8, cooldown: 80, bad: true,
    cond: function (s) { return s.biz.ch.web.ads + s.biz.ch.social.ads + s.biz.ch.market.ads > 0; },
    title: 'บัญชีโฆษณาโดนแบน',
    body: 'ระบบอัตโนมัติของแพลตฟอร์มโฆษณาแบนบัญชีของคุณ อ้างว่า "ละเมิดนโยบายการกล่าวอ้างทางสุขภาพ" ทั้งที่คุณไม่แน่ใจว่าผิดอะไร ยอดขายจากโฆษณาหายไปทันที',
    choices: function (s) {
      return [
        { t: 'ยื่นอุทธรณ์และรอ', d: 'อาจใช้เวลาหลายสัปดาห์', fx: function () { s.biz.buzz.push({ m: 0.7, weeks: R.int(3, 8), total: 6 }); return 'ระหว่างรอ ยอดขายลดลงหนัก'; } },
        { t: 'เปิดบัญชีใหม่ผ่านเอเจนซี (฿40,000)', d: 'เร็ว แต่ถ้าโดนจับจะแบนถาวร', fx: function () { L.spend(s.fin, 'prof', 40000); if (R.chance(0.25)) { s.biz.buzz.push({ m: 0.6, weeks: 12, total: 12 }); return 'โดนจับได้ว่าเลี่ยงการแบน — แบนถาวรทั้งเครือข่าย 3 เดือน'; } return 'กลับมายิงโฆษณาได้ใน 3 วัน'; } }
      ];
    }
  });

  E.register({
    id: 'ecom_supplier_bankrupt', cat: 'product', ind: ['ecom'], weight: 0.5, once: true, bad: true,
    cond: function (s) { return s.biz.skus.length > 1 && s.time.w > 40; },
    title: 'โรงงาน OEM หลักล้มละลาย',
    body: 'โรงงานที่ผลิตสินค้าให้คุณเกือบทั้งหมดถูกเจ้าหนี้ยื่นฟ้องล้มละลาย ใบสั่งผลิตที่จ่ายมัดจำไปแล้วอาจสูญ',
    choices: function (s) {
      var b = s.biz, dep = U.sum(b.pos.filter(function (p) { return p.sup === 'local'; }), function (p) { return p.deposit; });
      return [
        { t: 'ย้ายไปโรงงานใหม่ทันที (ต้นทุน +8%, ของล่าช้า 4 สัปดาห์)', fx: function () { b.skus.forEach(function (k) { k.cost = Math.round(k.cost * 1.08); }); b.pos.forEach(function (p) { if (p.sup === 'local') p.arrive += 4; }); if (dep > 0) { L.post(s.fin, { penalties: dep * 0.5, prepaid: -dep * 0.5 }); b.pos.forEach(function (p) { if (p.sup === 'local') { p.deposit *= 0.5; } }); } return 'ย้ายโรงงานแล้ว เสียมัดจำครึ่งหนึ่ง ' + F.b(dep * 0.5); } },
        { t: 'ซื้อแม่พิมพ์และสูตรคืนจากผู้ดูแลทรัพย์ (฿350,000)', fx: function () { L.spend(s.fin, 'prof', 350000); b.pos.forEach(function (p) { if (p.sup === 'local') p.arrive += 2; }); return 'ได้สูตรและแม่พิมพ์คืน โรงงานใหม่ผลิตต่อได้เร็ว'; } }
      ];
    }
  });

  E.register({
    id: 'fnb_popup', cat: 'sales', ind: ['fnb'], weight: 0.7, cooldown: 52,
    cond: function (s) { var m = RW.T.info(s.time.w).month; return RW.Models.fnb.openBranches(s.biz).length > 0 && (m === 2 || m === 10); },
    title: 'ห้างชวนเปิดบูธป๊อปอัพช่วงเทศกาล',
    body: 'ห้างใหญ่ใจกลางเมืองชวนร้านคุณเปิดบูธ 3 สัปดาห์ในงานเทศกาล ค่าพื้นที่ ฿120,000 + พนักงานเพิ่ม คนเดินวันละหลายหมื่น',
    choices: function (s) {
      return [
        { t: 'ไปออกบูธ', fx: function () { L.spend(s.fin, 'rent', 120000); L.spend(s.fin, 'cogs_staff', 60000); var c = RW.Models.fnb.CONCEPTS[s.biz.concept]; var sales = c.ticket * R.int(1500, 4000) * (0.8 + s.biz.brand / 100); L.earnCash(s.fin, 'rev_food', sales); L.spend(s.fin, 'cogs_goods', sales * c.food); s.biz.brand = Math.min(100, s.biz.brand + 5); return 'ขายได้ ' + F.b(sales) + ' และคนรู้จักแบรนด์มากขึ้น'; } },
        { t: 'ไม่ไป ทีมไม่พอ', fx: function () { return 'โฟกัสหน้าร้านเดิม'; } }
      ];
    }
  });

  E.register({
    id: 'fnb_staff_incident', cat: 'team', ind: ['fnb'], weight: 0.7, cooldown: 60, bad: true,
    cond: function (s) { return RW.Models.fnb.openBranches(s.biz).length > 0; },
    title: 'คลิปพนักงานทำอาหารไม่ถูกสุขลักษณะ',
    body: 'ลูกค้าถ่ายคลิปพนักงานในครัวทำอาหารหล่นพื้นแล้วเก็บขึ้นมาใส่จานต่อ คลิปถูกแชร์ในกลุ่มรีวิวอาหารที่มีสมาชิกหลายแสนคน',
    choices: function (s) {
      return [
        { t: 'ขอโทษ ปิดสาขาทำความสะอาด 2 วัน อบรมพนักงานทุกสาขา', fx: function () { L.spend(s.fin, 'culture', 50000); RW.Models.fnb.openBranches(s.biz).forEach(function (b) { b.staffSkill += 6; b.rating -= 0.05; }); H.brand(s, -2); return 'ลูกค้าส่วนใหญ่ให้โอกาส'; } },
        { t: 'เลิกจ้างพนักงานคนนั้นแล้วจบ', fx: function () { RW.Models.fnb.openBranches(s.biz).forEach(function (b) { b.rating -= 0.12; }); H.brand(s, -5); return 'คนมองว่าโยนความผิดให้ลูกน้อง ไม่แก้ที่ระบบ'; } }
      ];
    }
  });
})(globalThis.RW = globalThis.RW || {});
