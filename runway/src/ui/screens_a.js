/* RUNWAY — screens: title & setup, end, overview, founder, team */
(function (RW) {
  'use strict';
  var UI = RW.UI, F = RW.F, U = RW.U, h = UI.h, A = RW.Act;

  // =====================================================================
  //  TITLE & NEW GAME
  // =====================================================================
  UI.INDUSTRIES = function () {
    return Object.keys(RW.Models).map(function (k) { return { id: k, n: RW.Models[k].n, d: RW.Models[k].d }; });
  };
  function ng() {
    if (!UI.form.ng) {
      UI.form.ng = { name: '', bg: 'engineer', industry: 'saas', concept: null, cof: null, vesting: true, company: '', capital: null, diff: 'normal', seed: '' };
      UI.genCofounders();
    }
    return UI.form.ng;
  }
  UI.genCofounders = function () {
    var f = UI.form.ng;
    var tmp = { s: (Math.random() * 2e9) | 0 };
    var prev = RW.R.st; RW.R.bind(tmp);
    f.cofs = RW.Founder.genCofounders(f.bg);
    RW.R.bind(prev);
    f.cof = null;
  };

  UI.titleScreen = function () {
    var f = ng();
    var M = RW.Models[f.industry];
    var concepts = M.concepts();
    if (!f.concept || !concepts.some(function (c) { return c.id === f.concept; })) f.concept = concepts[0].id;
    var bg = RW.BACKGROUNDS[f.bg];
    if (f.capital == null || f.capital > bg.savings) f.capital = Math.round(bg.savings * (f.industry === 'fnb' ? 0.85 : 0.6) / 50000) * 50000;
    var saves = UI.SLOTS.map(function (sl) { var m = UI.slotMeta(sl); return m ? { slot: sl, m: m } : null; }).filter(Boolean);
    var lamps = ''; for (var i = 0; i < 18; i++) lamps += '<i style="animation-delay:' + (i * 0.12).toFixed(2) + 's"></i>';
    var html = '<div class="title-screen">' +
      '<div class="hero"><div><h1>RUNWAY</h1><p class="tag-line">เกมจำลองการปั้นธุรกิจตั้งแต่วันที่ลาออกจากงานประจำ จนถึงวันที่ขายกิจการ เข้าตลาดหลักทรัพย์ หรือปิดบริษัท</p><div class="strip" aria-hidden="true">' + lamps + '</div></div>' +
      '<div class="panel facts">' +
      '<div><b>บัญชี</b><span>บัญชีคู่จริง งบกำไรขาดทุน งบดุล กระแสเงินสด ภาษีนิติบุคคลอัตรา SME, VAT 1.8 ล้าน, หัก ณ ที่จ่าย 3%</span></div>' +
      '<div><b>คน</b><span>สรรหา สัมภาษณ์ ทดลองงาน 119 วัน ค่าชดเชยตามกฎหมายแรงงาน ขวัญกำลังใจ คนเก่งถูกซื้อตัว</span></div>' +
      '<div><b>ทุน</b><span>SAFE, Priced round, Option pool shuffle, Liquidation preference, Anti-dilution, บอร์ดปลด CEO ได้</span></div>' +
      '<div><b>ตลาด</b><span>วัฏจักรเศรษฐกิจ ฤดูหนาวของ VC คู่แข่งระดมทุนและตัดราคา ค่าเงินบาท</span></div>' +
      '<div><b>ตัวคุณ</b><span>เวลามีจำกัด พลังงาน ความเครียด เงินเก็บส่วนตัว ครอบครัว — และการตัดสินใจทางจริยธรรม</span></div>' +
      '</div></div>';
    if (saves.length) {
      html += '<section class="panel" style="margin-bottom:18px"><h3>เล่นต่อ</h3><div class="row">' + saves.map(function (x) {
        return UI.btn((x.slot === 'auto' ? 'เซฟอัตโนมัติ' : 'ช่อง ' + x.slot) + ': ' + h(x.m.name) + ' · ' + h(x.m.label) + (x.m.over ? ' (จบแล้ว)' : ''), 'loadSlot', [x.slot], x.slot === 'auto' ? 'primary' : '');
      }).join('') + '</div></section>';
    }
    html += '<section class="panel"><h3>เริ่มบริษัทใหม่</h3>';
    // step 1: founder
    html += '<div class="step"><h3><span class="n">01</span> คุณเป็นใคร</h3><div class="row" style="margin-bottom:8px"><label class="field" for="ng_name">ชื่อของคุณ<input type="text" id="ng_name" value="' + h(f.name) + '" placeholder="เช่น ภูมิ" data-act="ngSet" data-a=\'["name"]\'></label></div><div class="choices-grid">' +
      Object.keys(RW.BACKGROUNDS).map(function (k) {
        var b = RW.BACKGROUNDS[k];
        var top = Object.keys(b.skills).sort(function (x, y) { return b.skills[y] - b.skills[x]; }).slice(0, 2).map(function (s) { return RW.SKILL_NAMES[s] + ' ' + b.skills[s]; }).join(' · ');
        return '<button type="button" class="card-opt ' + (f.bg === k ? 'on' : '') + '" data-act="ngSet" data-a=\'["bg","' + k + '"]\'><b>' + b.n + '</b><span>' + b.d + '</span><span class="tiny muted">เงินเก็บ ' + F.m(b.savings) + ' · ค่าใช้จ่ายส่วนตัว ' + F.m(b.burn) + '/ด. · ' + top + '</span></button>';
      }).join('') + '</div></div>';
    // step 2: industry & concept
    html += '<div class="step"><h3><span class="n">02</span> ธุรกิจที่จะสร้าง</h3><div class="choices-grid" style="margin-bottom:10px">' +
      UI.INDUSTRIES().map(function (x) {
        return '<button type="button" class="card-opt ' + (f.industry === x.id ? 'on' : '') + '" data-act="ngSet" data-a=\'["industry","' + x.id + '"]\'><b>' + x.n + '</b><span>' + x.d + '</span></button>';
      }).join('') + '</div><div class="choices-grid">' +
      concepts.map(function (c) {
        return '<button type="button" class="card-opt ' + (f.concept === c.id ? 'on' : '') + '" data-act="ngSet" data-a=\'["concept","' + c.id + '"]\'><b>' + c.n + '</b><span>' + c.d + '</span></button>';
      }).join('') + '</div></div>';
    // step 3: cofounder
    html += '<div class="step"><h3><span class="n">03</span> ผู้ร่วมก่อตั้ง (ไม่บังคับ)</h3><p class="small ink2" style="margin:0 0 8px">ผู้ร่วมก่อตั้งช่วยงานได้มากและแทบไม่ต้องจ่ายเงินเดือน แต่แลกกับหุ้น และอาจทะเลาะกันหรือลาออกกลางทาง ตั้ง vesting ไว้เสมอ</p><div class="choices-grid">' +
      '<button type="button" class="card-opt ' + (!f.cof ? 'on' : '') + '" data-act="ngSet" data-a=\'["cof",null]\'><b>ไปคนเดียว</b><span>ถือหุ้น 100% ตัดสินใจเร็ว แต่ทุกอย่างอยู่บนบ่าคุณ นักลงทุนบางรายไม่ชอบผู้ก่อตั้งเดี่ยว</span></button>' +
      f.cofs.map(function (c) {
        var tr = RW.COFOUNDER_TRAITS[c.trait];
        return '<button type="button" class="card-opt ' + (f.cof === c.id ? 'on' : '') + '" data-act="ngSet" data-a=\'["cof","' + c.id + '"]\'><b>' + h(c.name) + ' (' + h(c.nick) + ')</b><span>' + RW.ROLES[c.role].n + ' · ฝีมือ ' + c.skill + '/100 · ขอหุ้น ' + F.pct(c.ask, 0) + '</span><span class="tiny muted">นิสัย: ' + tr.n + ' — ' + tr.d + ' · เงินเดือน ' + (c.salary ? F.b(c.salary) : 'ไม่รับ') + (c.cash ? ' · ลงเงิน ' + F.m(c.cash) : '') + '</span></button>';
      }).join('') + '</div>' +
      '<label class="row small" style="margin-top:8px"><input type="checkbox" ' + (f.vesting ? 'checked' : '') + ' data-act="ngSet" data-a=\'["vesting"]\'> ตั้ง vesting 4 ปี (cliff 1 ปี) ให้ผู้ร่วมก่อตั้ง — ถ้าลาออกก่อน หุ้นส่วนที่ยังไม่ vest กลับคืนบริษัท</label></div>';
    // step 4: company & difficulty
    html += '<div class="step"><h3><span class="n">04</span> บริษัทและความยาก</h3><div class="row" style="margin-bottom:10px;align-items:flex-end">' +
      '<label class="field" for="ng_company">ชื่อบริษัท/แบรนด์<input type="text" id="ng_company" value="' + h(f.company) + '" placeholder="เช่น ' + h(M.sampleName || 'NovaWorks') + '" data-act="ngSet" data-a=\'["company"]\'></label>' +
      '<label class="field" for="ng_seed">Seed (ว่าง = สุ่ม)<input type="text" id="ng_seed" value="' + h(f.seed) + '" data-act="ngSet" data-a=\'["seed"]\' style="width:120px"></label></div>' +
      UI.slider('เงินส่วนตัวที่ลงเป็นทุนจดทะเบียน', f.capital, 0, bg.savings, 50000, 'ngSet', ['capital'], 'b') +
      '<p class="small muted" style="margin:4px 0 10px">เหลือเป็นเงินเก็บส่วนตัว ' + F.m(bg.savings - f.capital) + ' (ค่าใช้จ่ายส่วนตัวเดือนละ ' + F.m(bg.burn) + ' → อยู่ได้ ' + F.months((bg.savings - f.capital) / bg.burn) + ' ถ้าไม่รับเงินเดือน)' + (M.capitalHint ? ' · ' + M.capitalHint : '') + '</p>' +
      '<div class="choices-grid">' + Object.keys(RW.DIFFICULTY).map(function (k) {
        var d = RW.DIFFICULTY[k];
        return '<button type="button" class="card-opt ' + (f.diff === k ? 'on' : '') + '" data-act="ngSet" data-a=\'["diff","' + k + '"]\'><b>' + d.n + '</b><span>' + d.d + '</span></button>';
      }).join('') + '</div></div>';
    html += '<div class="row" style="justify-content:flex-end">' + UI.btn('เริ่มต้นการเดินทาง →', 'startGame', [], 'primary go') + '</div></section>';
    html += '<p class="small muted" style="margin-top:14px">ทุกบริษัท นักลงทุน และบุคคลในเกมเป็นเรื่องสมมติ ตัวเลขอ้างอิงตลาดไทยโดยประมาณ ไม่ใช่คำแนะนำทางการเงิน · เกมเซฟอัตโนมัติทุกสัปดาห์ในเบราว์เซอร์นี้ · กด Space เพื่อเล่นสัปดาห์ถัดไป</p></div>';
    return html;
  };

  UI.acts.ngSet = function (key, val) {
    var f = ng();
    if (key === 'vesting') { f.vesting = !!val; return; }
    f[key] = val;
    if (key === 'bg') { UI.genCofounders(); f.capital = null; }
    if (key === 'industry') { f.concept = null; f.capital = null; }
    if (key === 'name' || key === 'company' || key === 'seed') return { render: false };
  };
  UI.acts.startGame = function () {
    var f = ng();
    var cof = f.cof ? f.cofs.find(function (c) { return c.id === f.cof; }) : null;
    var seed = f.seed ? (parseInt(f.seed, 10) || Array.from(f.seed).reduce(function (a, c) { return (a * 31 + c.charCodeAt(0)) | 0; }, 7)) : undefined;
    var M = RW.Models[f.industry];
    UI.s = RW.Engine.newGame({
      seed: seed, industry: f.industry, difficulty: f.diff, founderName: f.name || 'คุณ', bg: f.bg,
      companyName: f.company || M.sampleName || 'NovaWorks', capital: f.capital, concept: f.concept, product: f.concept, cofounder: cof, vesting: f.vesting
    });
    UI.tab = 'overview';
    UI.form = {};
    UI.save('auto');
  };
  UI.acts.loadSlot = function (slot) {
    if (!UI.loadSlot(slot)) return { ok: false, msg: 'โหลดเซฟไม่สำเร็จ' };
    setTimeout(function () { if (UI.s && !UI.s.over) UI.showEvent(); }, 0);
  };

  // =====================================================================
  //  END SCREEN
  // =====================================================================
  UI.endScreen = function () {
    var s = UI.s, o = s.over;
    var reasons = { bankrupt: 'ล้มละลาย', personal: 'ถังแตกส่วนตัว', fired: 'ถูกบอร์ดปลด', quit: 'ลาออกไปทำงานประจำ', shutdown: 'ปิดบริษัทอย่างมีระเบียบ', acquired: 'ขายกิจการ', ipo: 'IPO', timeup: 'ครบ 10 ปี' };
    var ach = Object.keys(s.achievements).filter(function (k) { return RW.Engine.ACH[k]; });
    var rounds = s.funding.rounds.map(function (r) { return [RW.T.label(r.w), h(RW.STAGES[r.stage] ? RW.STAGES[r.stage].n : r.stage), F.m(r.amount), F.m(r.pre), h(r.lead)]; });
    var hm = s.hist.monthly;
    var chart = UI.chart({ labels: hm.map(function (m) { return m.label; }), series: [{ name: 'รายได้/เดือน', color: 'var(--s1)', data: hm.map(function (m) { return m.p.rev; }), area: true }, { name: 'เงินสด', color: 'var(--s2)', data: hm.map(function (m) { return m.cash; }) }], fmt: F.k, tipFmt: F.m });
    var wf = o.waterfall ? '<h3 style="margin:14px 0 6px">ใครได้เงินเท่าไหร่จากการขาย</h3>' + UI.table(['ผู้ถือหุ้น', 'ประเภท', '#ได้รับ'], o.waterfall.holders.filter(function (x) { return x.amount > 1; }).sort(function (a, b) { return b.amount - a.amount; }).map(function (x) { return [h(x.name), h(x.cls), F.m(x.amount)]; })) : '';
    return '<div class="end"><section class="panel"><div class="muted small">จบเกม · ' + h(reasons[o.reason] || o.reason) + ' · หลังจาก ' + o.years + ' ปี</div>' +
      '<div class="rank">' + h(o.rank.title) + '</div><p class="ink2">' + h(o.rank.desc) + '</p><p>' + h(o.text) + '</p>' +
      '<div class="tiles" style="margin:12px 0">' + UI.tile('ความมั่งคั่งสุทธิของคุณ', F.m(o.wealth), 'เงินส่วนตัว + มูลค่าหุ้น', o.wealth > 3e7 ? 'good' : '') + UI.tile('เงินจากหุ้น/Exit', F.m(o.equity)) + UI.tile('ระดมทุนรวม', F.m(o.raised)) + UI.tile('รายได้สูงสุด/เดือน', F.m(o.maxRev)) + UI.tile('พนักงานสูงสุด', o.peakHC + ' คน') + UI.tile('ความสำเร็จ', ach.length + '/' + Object.keys(RW.Engine.ACH).length) + '</div>' +
      chart + wf +
      (rounds.length ? '<h3 style="margin:14px 0 6px">การระดมทุน</h3>' + UI.table(['เมื่อ', 'รอบ', '#เงิน', '#Pre-money', 'Lead'], rounds) : '') +
      '<h3 style="margin:14px 0 6px">ความสำเร็จที่ปลดล็อก</h3><div class="row">' + (ach.map(function (k) { return UI.pill(RW.Engine.ACH[k][0], 'accent'); }).join('') || '<span class="muted small">ไม่มี</span>') + '</div>' +
      '<div class="row" style="margin-top:18px;justify-content:flex-end">' + (o.reason === 'timeup' ? UI.btn('เล่นต่อแบบไม่จำกัดเวลา', 'endless', []) : '') + UI.btn('เริ่มบริษัทใหม่', 'newGame', [], 'primary') + '</div></section></div>';
  };
  UI.acts.newGame = function () { UI.s = null; UI.form = {}; UI.modal(''); };
  UI.acts.endless = function () { var s = UI.s; s.over = null; A.continueEndless(s); };

  // =====================================================================
  //  OVERVIEW
  // =====================================================================
  UI.views.overview = function (s) {
    var k = s.kpi, M = RW.Models[s.industry];
    var hm = s.hist.monthly;
    var labels = hm.map(function (m) { return m.label; });
    var stage = s.funding.stage === 'bootstrap' ? 'Bootstrapped' : (RW.STAGES[s.funding.stage] ? RW.STAGES[s.funding.stage].n : s.funding.stage);
    var da = k.defaultAlive;
    var daPill = da == null || da.tooEarly ? UI.pill('รายได้ยังน้อยเกินจะประเมิน Default alive') : da.alive ? UI.pill(da.months ? 'Default alive — มีกำไรในอีก ~' + da.months + ' เดือน' : 'มีกำไรแล้ว', 'good') : UI.pill('Default dead — เงินหมดก่อนมีกำไรใน ~' + da.months + ' เดือน', 'crit');
    var adv = RW.Engine.advice(s);
    var head = '<div class="page-head"><div><h2>' + h(s.company.name) + '</h2><p>' + h(M.headline(s)) + '</p></div><div class="row">' + UI.pill(stage, 'accent') + daPill + UI.pill(RW.MACRO[s.world.phase].n) + '</div></div>';
    var tiles = '<div class="tiles" style="margin-bottom:14px">' +
      UI.tile('เงินสด', F.m(k.cash), 'Runway ' + F.months(k.runway), k.runway < 3 ? 'crit' : k.runway < 6 ? 'warn' : '') +
      UI.tile(UI.tip('Burn rate', 'เงินสดสุทธิที่ไหลออกต่อเดือน (เฉลี่ย 3 เดือน) ไม่รวมเงินระดมทุน'), k.burn > 0 ? F.m(k.burn) + '/ด.' : 'เงินสดเป็นบวก', '') +
      UI.tile('รายได้เดือนล่าสุด', F.m(k.revenueMonthly), k.momGrowth ? UI.delta(k.momGrowth) + ' MoM' : '') +
      UI.tile(UI.tip('Gross margin', 'กำไรขั้นต้น ÷ รายได้ — เหลือเท่าไหร่หลังหักต้นทุนตรง'), k.revenueMonthly > 0 ? F.pct(k.gm, 0) : '–') +
      M.ui.tiles(s) +
      UI.tile('หุ้นของคุณ', F.pct(k.founderPct, 1), s.funding.lastPost ? 'มูลค่ารอบล่าสุด ' + F.m(s.funding.lastPost) : 'ยังไม่มีมูลค่าตลาด') +
      '</div>';
    var charts = '<div class="grid g2" style="margin-bottom:14px">' +
      UI.panel('รายได้ vs ค่าใช้จ่ายรายเดือน', UI.chart({ labels: labels, series: [{ name: 'รายได้', color: 'var(--s1)', data: hm.map(function (m) { return m.p.rev; }), area: true }, { name: 'ค่าใช้จ่ายรวม', color: 'var(--s2)', data: hm.map(function (m) { return m.p.rev - m.p.ni; }) }], fmt: F.k, tipFmt: F.m })) +
      UI.panel('เงินสดปลายเดือน', UI.chart({ labels: labels, series: [{ name: 'เงินสด', color: 'var(--s3)', data: hm.map(function (m) { return m.cash; }), area: true }], fmt: F.k, tipFmt: F.m })) +
      '</div>';
    var due = RW.Events.dueCount(s);
    var mails = s.inbox.slice(0, 6).map(function (m) { return UI.mailRow(m, true); }).join('');
    var ms = UI.milestones(s);
    var body = head + (ms ? '<div style="margin-bottom:14px">' + ms + '</div>' : '') + tiles + '<div class="grid g-side" style="margin-bottom:14px">' +
      UI.panel('ที่ปรึกษาเตือน', '<div class="stack">' + UI.alerts(adv, 8) + '</div>', adv.length ? adv.length + ' เรื่อง' : '') +
      UI.panel('ล่าสุด', (due ? '<div class="row" style="margin-bottom:8px">' + UI.btn('มี ' + due + ' เรื่องรอคุณตัดสินใจ', 'openEvent', [], 'primary sm') + '</div>' : '') + '<div class="panel flush" style="border:0">' + (mails || '<div class="empty">ยังไม่มีข้อความ</div>') + '</div>' + '<div class="row" style="margin-top:6px">' + UI.btn('ดูทั้งหมด', 'tab', ['inbox'], 'sm ghost') + '</div>') +
      '</div>' + charts + (M.ui.overviewExtra ? M.ui.overviewExtra(s) : '');
    return body;
  };
  UI.acts.openEvent = function () { UI.showEvent(); return { render: false }; };

  // early-game checklist: common steps + business-specific milestones
  UI.milestones = function (s) {
    var M = RW.Models[s.industry];
    if (!M.milestones || s.flags.hideMilestones) return '';
    var list = [['จดทะเบียนบริษัท', s.company.registered, 'company'], ['ตั้งเวลาทำงานของคุณให้เหมาะกับช่วงนี้ (หน้าผู้ก่อตั้ง)', !!s.flags.focusSet, 'founder']].concat(M.milestones(s));
    list.push(['จ้างพนักงานคนแรก', RW.Team.headcount(s) > 0, 'team']);
    list.push(['ได้เงินทุนก้อนแรก หรือมีกำไรทั้งเดือน', s.stats.raised > 0 || !!s.achievements.ramen, 'funding']);
    var done = list.filter(function (x) { return x[1]; }).length;
    if (done === list.length) return '';
    var next = list.find(function (x) { return !x[1]; });
    return '<section class="panel"><h3><span>เส้นทางช่วงแรก <small class="muted">' + done + '/' + list.length + '</small></span><small>' + UI.btn('ซ่อน', 'hideMilestones', [], 'sm ghost') + '</small></h3>' +
      '<div class="row" style="gap:6px">' + list.map(function (x) {
        return '<button type="button" class="pill ' + (x[1] ? 'good' : x === next ? 'accent' : '') + '" data-act="tab" data-a="' + h(JSON.stringify([x[2]])) + '" style="cursor:pointer">' + (x[1] ? '✓ ' : x === next ? '→ ' : '') + h(x[0]) + '</button>';
      }).join('') + '</div></section>';
  };
  UI.acts.hideMilestones = function () { UI.s.flags.hideMilestones = 1; };

  UI.mailRow = function (m, compact) {
    var open = UI.mailOpen === m.id || !compact;
    return '<div class="mail ' + (m.read ? '' : 'unread') + '" data-act="readMail" data-a="' + h(JSON.stringify([m.id])) + '"><span class="tone ' + h(m.tone) + '"></span><div><div class="row between"><span class="t">' + h(m.title) + '</span><span class="d">' + RW.T.label(m.w) + '</span></div>' + (open || UI.mailOpen === m.id ? '<div class="b">' + h(m.body) + '</div>' : '') + '</div></div>';
  };
  UI.acts.readMail = function (id) {
    var m = UI.s.inbox.find(function (x) { return x.id === id; });
    if (m) m.read = true;
    UI.mailOpen = UI.mailOpen === id ? null : id;
  };

  // =====================================================================
  //  FOUNDER
  // =====================================================================
  UI.views.founder = function (s) {
    var f = s.founder, bg = RW.BACKGROUNDS[f.bg];
    var eff = RW.Founder.effectiveness(s);
    var contrib = RW.Founder.contribution(s);
    var ci = RW.Founder.consultIncome(s);
    var net = f.salary - RW.Founder.pit(f.salary * 12) / 12 - Math.min(f.salary, 17500) * 0.05;
    var personalRunway = net >= f.burn ? Infinity : f.cash / (f.burn - net);
    var head = '<div class="page-head"><div><h2>' + h(f.name) + '</h2><p>' + h(bg.n) + ' — เวลาของคุณคือทรัพยากรที่มีค่าที่สุดของบริษัทช่วงแรก จัดสรรให้ดี</p></div></div>';
    var hours = UI.panel('ชั่วโมงทำงานและสุขภาพ',
      UI.slider('ชั่วโมงทำงาน/สัปดาห์', f.hours, 30, 100, 5, 'fHours', [], 'h') +
      '<p class="small muted" style="margin:4px 0 10px">มากกว่า ~60 ชม. ผลงานเพิ่มน้อยลงเรื่อยๆ แต่พลังงานและชีวิตส่วนตัวลดเร็วขึ้นมาก</p>' +
      '<div class="stack">' +
      UI.bar('พลังงาน', f.energy, 100, f.energy < 25 ? 'crit' : f.energy < 45 ? 'warn' : 'good') +
      UI.bar('ความเครียด', f.stress, 100, f.stress > 75 ? 'crit' : f.stress > 55 ? 'warn' : '') +
      UI.bar('สุขภาพ', f.health, 100, f.health < 40 ? 'crit' : f.health < 60 ? 'warn' : 'good') +
      UI.bar('ชีวิตส่วนตัว/ครอบครัว', f.life, 100, f.life < 30 ? 'crit' : f.life < 50 ? 'warn' : 'good') +
      UI.bar('ประสิทธิภาพการทำงาน', eff * 100, 100, eff < 0.6 ? 'crit' : eff < 0.9 ? 'warn' : 'good', F.pct(eff, 0)) +
      UI.bar('ชื่อเสียงในวงการ', f.rep, 100, '', Math.round(f.rep)) +
      '</div><div class="row" style="margin-top:10px">' +
      (f.vacation ? UI.pill('ลาพักอีก ' + f.vacation + ' สัปดาห์', 'accent') : UI.btn('ลาพัก 1 สัปดาห์', 'fVacation', [1]) + UI.btn('ลาพัก 2 สัปดาห์', 'fVacation', [2])) +
      (f.burnout ? UI.pill('หมดไฟ อีก ' + f.burnout + ' สัปดาห์', 'crit') : '') + '</div>');
    var focusRows = Object.keys(RW.FOCUS).map(function (k) {
      var fo = RW.FOCUS[k];
      var u = contrib['f_' + k] || 0;
      return '<div>' + UI.slider(fo.n, f.focus[k] || 0, 0, 100, 5, 'fFocus', [k], 'pct') + '<div class="tiny muted" style="margin:-2px 0 6px 0">' + fo.d + (u ? ' · ผลงาน ≈ ' + u.toFixed(2) + ' คน-สัปดาห์' : '') + (k === 'consult' && ci ? ' · รายได้ ≈ ' + F.m(ci * 4.33) + '/เดือน' : '') + '</div></div>';
    }).join('');
    var focus = UI.panel('คุณใช้เวลาไปกับอะไร', '<p class="small ink2" style="margin:0 0 8px">รวมเป็น 100% เสมอ ปรับตัวหนึ่ง ตัวอื่นจะปรับตามสัดส่วน ทักษะที่ใช้บ่อยจะเก่งขึ้นช้าๆ</p>' + focusRows);
    var skills = UI.panel('ทักษะ', '<div class="stack">' + Object.keys(f.skills).map(function (k) { return UI.bar(RW.SKILL_NAMES[k], f.skills[k], 100, '', Math.round(f.skills[k])); }).join('') + '</div>');
    var loan = s.fin.loans.find(function (l) { return l.kind === 'founder'; });
    var money = UI.panel('เงินส่วนตัว',
      '<div class="kv"><span>เงินเก็บส่วนตัว</span><span class="' + (f.cash < 0 ? 'crit' : '') + '">' + F.b(f.cash) + '</span><span>ค่าใช้จ่ายส่วนตัว/เดือน</span><span>' + F.b(f.burn) + '</span><span>เงินเดือนจากบริษัท (ก่อนภาษี)</span><span>' + F.b(f.salary) + '</span><span>สุทธิหลังภาษีและประกันสังคม</span><span>' + F.b(net) + '</span><span>เงินเก็บพอใช้อีก</span><span>' + F.months(personalRunway) + '</span>' +
      (loan ? '<span>บริษัทติดหนี้คุณ</span><span>' + F.b(loan.balance) + '</span>' : '') + '</div>' +
      '<div class="divider"></div><div class="row" style="align-items:flex-end"><label class="field" for="f_sal">เงินเดือนผู้ก่อตั้ง' + UI.numInput('f_sal', f.salary, 'fSalary', [], 5000) + '</label></div>' +
      '<div class="row" style="margin-top:8px">' + UI.btn('ให้บริษัทยืม ฿200K', 'fLend', [200000], 'sm', f.cash < 200000 ? 'disabled' : '') + UI.btn('ให้ยืม ฿500K', 'fLend', [500000], 'sm', f.cash < 500000 ? 'disabled' : '') +
      (loan ? UI.btn('ขอเงินคืน ฿200K', 'fRepay', [200000], 'sm') : '') +
      (s.funding.rounds.length || s.funding.safes.length ? '' : UI.btn('เพิ่มทุน ฿200K', 'fInject', [200000], 'sm', f.cash < 200000 ? 'disabled' : '')) + '</div>' +
      '<p class="tiny muted" style="margin-top:8px">ผู้ก่อตั้งที่ไม่รับเงินเดือนเลยจะถังแตกเอง — เงินเก็บติดลบหนักเท่ากับจบเกม</p>');
    var cofs = (s.cofounders || []).length ? UI.panel('ผู้ร่วมก่อตั้ง', UI.table(['ชื่อ', 'บทบาท', '#ฝีมือ', '#ขวัญ', '#ความขัดแย้ง', 'สถานะ'], s.cofounders.map(function (c) {
      return [h(c.name) + ' <span class="muted">(' + h(c.nick) + ')</span>', RW.ROLES[c.role].n, Math.round(c.skill), Math.round(c.morale), '<span class="' + (c.conflict > 60 ? 'crit' : c.conflict > 35 ? 'warn' : '') + '">' + Math.round(c.conflict) + '</span>', c.active ? UI.pill('ทำงาน', 'good') : UI.pill(c.left ? 'ออกแล้ว' : 'พักงาน', 'warn')];
    }))) : '';
    return head + '<div class="grid g2">' + '<div class="stack">' + hours + money + '</div><div class="stack">' + focus + skills + cofs + '</div></div>';
  };
  UI.acts.fHours = function (v) { UI.s.flags.focusSet = 1; return A.setHours(UI.s, v); };
  UI.acts.fFocus = function (k, v) { UI.s.flags.focusSet = 1; return A.setFocus(UI.s, k, v); };
  UI.acts.fSalary = function (v) { return A.setFounderSalary(UI.s, v); };
  UI.acts.fVacation = function (w) { return A.vacation(UI.s, w); };
  UI.acts.fLend = function (a) { return A.lendToCompany(UI.s, a); };
  UI.acts.fRepay = function (a) { return A.repayFounderLoan(UI.s, a); };
  UI.acts.fInject = function (a) { return A.injectEquity(UI.s, a); };

  // =====================================================================
  //  TEAM
  // =====================================================================
  UI.views.team = function (s) {
    var T = RW.Team, pol = s.team.policy;
    var sub = UI.sub.team || 'people';
    var act = T.active(s), all = T.all(s);
    var span = T.mgmtSpan(s), eff = T.mgmtEfficiency(s);
    var head = '<div class="page-head"><div><h2>ทีมงาน</h2><p>คนคือต้นทุนก้อนใหญ่ที่สุดและเป็นตัวกำหนดความเร็วของบริษัท จ้างช้า ไล่ออกเร็ว — แต่ทุกการไล่ออกมีราคา</p></div>' +
      UI.segBtns([['people', 'พนักงาน (' + all.length + ')'], ['hire', 'สรรหา (' + s.team.openings.length + '/' + s.team.candidates.length + ')'], ['policy', 'นโยบาย']], sub, 'teamSub') + '</div>';
    var tiles = '<div class="tiles" style="margin-bottom:14px">' +
      UI.tile('พนักงาน', all.length + ' คน', act.length !== all.length ? (all.length - act.length) + ' คนรอเริ่มงาน' : '') +
      UI.tile('ค่าใช้จ่ายบุคลากร/เดือน', F.m(T.monthlyCost(s)), 'รวมประกันสังคมและสวัสดิการ') +
      UI.tile('ขวัญกำลังใจเฉลี่ย', s.kpi.morale != null ? Math.round(s.kpi.morale) + '/100' : '–', '', s.kpi.morale != null && s.kpi.morale < 40 ? 'crit' : s.kpi.morale < 55 ? 'warn' : '') +
      UI.tile(UI.tip('ความสามารถในการบริหาร', 'จำนวนคนที่คุณและหัวหน้าทีมดูแลได้ทั่วถึง เกินแล้วทุกคนทำงานช้าลง'), Math.round(span) + ' คน', 'ประสิทธิภาพองค์กร ' + F.pct(eff, 0), act.length > span ? 'warn' : '') +
      UI.tile('ที่นั่งในออฟฟิศ', (T.headcount(s) + 1) + '/' + T.officeCapacity(s), RW.OFFICES[s.company.office.type].n, T.headcount(s) + 1 > T.officeCapacity(s) ? 'warn' : '') +
      UI.tile(UI.tip('Employer brand', 'ภาพลักษณ์นายจ้าง — มีผลต่อจำนวนและคุณภาพผู้สมัคร'), Math.round(s.team.brand) + '/100') +
      '</div>';
    var body;
    if (sub === 'people') body = UI.teamPeople(s);
    else if (sub === 'hire') body = UI.teamHire(s);
    else body = UI.teamPolicy(s);
    return head + tiles + body;
  };
  UI.acts.teamSub = function (v) { UI.sub.team = v; };

  UI.empTraits = function (e) {
    return e.known.map(function (t) { var tr = RW.TRAITS[t]; return '<span class="pill ' + (tr.good ? 'good' : tr.hidden ? 'crit' : '') + '" title="' + h(tr.d) + '">' + tr.n + '</span>'; }).join(' ');
  };
  UI.teamPeople = function (s) {
    var T = RW.Team;
    var sel = UI.sel.layoff || {};
    var emps = T.all(s).slice().sort(function (a, b) { return RW.ROLES[a.role].dept.localeCompare(RW.ROLES[b.role].dept) || b.level - a.level; });
    var w = s.time.w;
    var rows = emps.map(function (e) {
      var mk = T.marketSalary(s, e.role, e.level, e.est);
      var ratio = e.salary / mk;
      var tenure = w - e.startW;
      var status = e.startW > w ? UI.pill('เริ่มงาน ' + RW.T.label(e.startW), 'accent') : e.leaving ? UI.pill('ลาออก มีผล ' + RW.T.label(e.leaveW), 'crit') : tenure < 17 ? UI.pill('ทดลองงาน', 'warn') : '';
      return [
        '<input type="checkbox" aria-label="เลือกเพื่อเลิกจ้าง" ' + (sel[e.id] ? 'checked' : '') + ' data-act="selLayoff" data-a="' + h(JSON.stringify([e.id])) + '">',
        '<b>' + h(e.name) + '</b> <span class="muted">(' + h(e.nick) + ')</span><div class="tiny">' + UI.empTraits(e) + ' ' + status + '</div>',
        RW.ROLES[e.role].n + '<div class="tiny muted">' + RW.LEVELS[e.level] + '</div>',
        '<span title="ประเมินจากผลงาน">' + Math.round(e.est) + '</span>',
        F.b(e.salary) + '<div class="tiny ' + (ratio < 0.92 ? 'crit' : ratio > 1.1 ? 'good' : 'muted') + '">ตลาด ' + F.m(mk) + '</div>',
        '<div style="min-width:70px">' + UI.meter(e.morale, 100, e.morale < 35 ? 'crit' : e.morale < 55 ? 'warn' : 'good') + '<div class="tiny muted">' + Math.round(e.morale) + ' · เครียด ' + Math.round(e.stress) + '</div></div>',
        tenure > 0 ? (tenure >= 52 ? (tenure / 52).toFixed(1) + ' ปี' : tenure + ' สป.') : '–',
        e.options ? F.pct(e.options / RW.Funding.fullyDiluted(s), 2) : '–',
        '<div class="row" style="gap:4px;flex-wrap:nowrap">' + UI.btn('+10%', 'empRaise', [e.id, 0.1], 'sm') + (e.level < 5 ? UI.btn('เลื่อนขั้น', 'empPromote', [e.id], 'sm') : '') + UI.btn('ESOP', 'empOptions', [e.id, 0.0025], 'sm', 'title="มอบหุ้น 0.25%"') + UI.btn('ไล่ออก', 'empFire', [e.id], 'sm danger') + '</div>'
      ];
    });
    var nSel = Object.keys(sel).filter(function (id) { return sel[id] && T.find(s, id) && !T.find(s, id).gone; });
    var sev = U.sum(nSel, function (id) { return T.severanceCost(s, T.find(s, id)); });
    var layoff = nSel.length ? '<div class="row" style="margin-top:10px">' + UI.pill('เลือก ' + nSel.length + ' คน · ค่าชดเชยรวม ' + F.b(sev), 'warn') + UI.btn('เลิกจ้างกลุ่มนี้ (Layoff)', 'doLayoff', [], 'danger') + UI.btn('ยกเลิกการเลือก', 'clearSel', [], 'ghost') + '</div>' : '';
    return UI.panel('พนักงานทั้งหมด', UI.table(['', 'ชื่อ', 'ตำแหน่ง', '#ฝีมือ', '#เงินเดือน', 'ขวัญ', '#อายุงาน', '#ESOP', ''], rows, { empty: 'ยังไม่มีพนักงาน — ไปที่แท็บ "สรรหา" เพื่อเปิดรับสมัคร' }) + layoff +
      '<p class="tiny muted" style="margin-top:8px">ค่าชดเชยตาม พ.ร.บ.คุ้มครองแรงงาน: อายุงาน 120 วัน–1 ปี = 30 วัน, 1–3 ปี = 90 วัน, 3–6 ปี = 180 วัน, 6–10 ปี = 240 วัน, 10–20 ปี = 300 วัน, 20 ปีขึ้นไป = 400 วัน + ค่าจ้างแทนการบอกกล่าวล่วงหน้า · ทดลองงานไม่เกิน 119 วันไม่ต้องจ่ายค่าชดเชย</p>');
  };
  UI.acts.selLayoff = function (id, v) { UI.sel.layoff = UI.sel.layoff || {}; UI.sel.layoff[id] = v; };
  UI.acts.clearSel = function () { UI.sel.layoff = {}; };
  UI.acts.doLayoff = function () {
    var ids = Object.keys(UI.sel.layoff || {}).filter(function (id) { return UI.sel.layoff[id]; });
    UI.sel.layoff = {};
    return A.layoff(UI.s, ids);
  };
  UI.acts.empRaise = function (id, p) { return A.raise(UI.s, id, p); };
  UI.acts.empPromote = function (id) { return A.promote(UI.s, id); };
  UI.acts.empOptions = function (id, p) { return A.grantOptions(UI.s, id, p); };
  UI.acts.empFire = function (id) {
    var e = RW.Team.find(UI.s, id);
    if (!e) return;
    if (UI.sel.confirmFire !== id) { UI.sel.confirmFire = id; return { ok: false, msg: 'กด "ไล่ออก" อีกครั้งเพื่อยืนยันเลิกจ้าง ' + e.name + ' (ค่าชดเชย ' + F.b(RW.Team.severanceCost(UI.s, e)) + ')' }; }
    UI.sel.confirmFire = null;
    return A.fire(UI.s, id);
  };

  UI.teamHire = function (s) {
    var T = RW.Team;
    var form = UI.form.hire || (UI.form.hire = { role: null, level: 2, channel: 'board' });
    var roles = Object.keys(RW.ROLES).filter(function (r) { return RW.ROLES[r].ind.indexOf(s.industry) >= 0; });
    if (!form.role || roles.indexOf(form.role) < 0) form.role = roles[0];
    var r = RW.ROLES[form.role];
    var mk = T.marketSalary(s, form.role, form.level, 50 + form.level * 8);
    var ch = T.CHANNELS[form.channel];
    var open = '<div class="row" style="align-items:flex-end">' +
      '<label class="field" for="h_role">ตำแหน่ง<select id="h_role" data-act="hireForm" data-a=\'["role"]\'>' + roles.map(function (x) { return '<option value="' + x + '"' + (x === form.role ? ' selected' : '') + '>' + RW.ROLES[x].n + '</option>'; }).join('') + '</select></label>' +
      '<label class="field" for="h_level">ระดับ<select id="h_level" data-act="hireForm" data-a=\'["level"]\'>' + [1, 2, 3, 4, 5].map(function (l) { return '<option value="' + l + '"' + (l === form.level ? ' selected' : '') + '>' + RW.LEVELS[l] + (l === 5 ? ' (' + r.exec + ')' : '') + '</option>'; }).join('') + '</select></label>' +
      '<label class="field" for="h_ch">ช่องทาง<select id="h_ch" data-act="hireForm" data-a=\'["channel"]\'>' + Object.keys(T.CHANNELS).map(function (c) { return '<option value="' + c + '"' + (c === form.channel ? ' selected' : '') + '>' + T.CHANNELS[c].n + '</option>'; }).join('') + '</select></label>' +
      UI.btn('เปิดรับสมัคร', 'openPos', [], 'primary') + '</div>' +
      '<p class="small ink2" style="margin:8px 0 0">เงินเดือนตลาดโดยประมาณ ' + F.b(mk) + '/เดือน · ' + h(ch.d) + (ch.cost ? ' · ค่าประกาศ ' + F.b(ch.cost) : '') + (ch.fee ? ' · ค่าธรรมเนียม ~' + F.b(mk * 12 * ch.fee) : '') + '</p>';
    var openings = s.team.openings.map(function (op) {
      var cands = s.team.candidates.filter(function (c) { return c.opId === op.id; });
      return '<div class="panel" style="margin-top:10px"><h3><span>' + RW.ROLES[op.role].n + ' · ' + RW.LEVELS[op.level] + '</span><small>' + T.CHANNELS[op.channel].n + ' · เปิดมา ' + (s.time.w - op.openedW) + ' สัปดาห์ ' + UI.btn('ปิดประกาศ', 'closePos', [op.id], 'sm ghost') + '</small></h3>' +
        (cands.length ? cands.map(function (c) { return UI.candCard(s, c); }).join('') : '<div class="empty">ยังไม่มีผู้สมัครที่ผ่านการคัดกรอง — ผู้สมัครจะเข้ามาทุกสัปดาห์</div>') + '</div>';
    }).join('');
    return UI.panel('เปิดรับสมัครตำแหน่งใหม่', open + (s.company.registered ? '' : '<div class="alert warn" style="margin-top:8px"><span class="dot"></span><span>ต้องจดทะเบียนบริษัทก่อนจึงจะจ้างพนักงานได้</span></div>')) + openings;
  };
  UI.candCard = function (s, c) {
    var form = UI.form['offer_' + c.id] || (UI.form['offer_' + c.id] = { salary: c.ask, eq: c.wantsEquity ? 0.0025 : 0 });
    var fd = RW.Funding.fullyDiluted(s);
    var p = RW.Team.acceptProb(s, c, form.salary, form.eq);
    var traits = c.traits.filter(function (t) { return !RW.TRAITS[t].hidden; }).map(function (t) { return '<span class="pill ' + (RW.TRAITS[t].good ? 'good' : '') + '" title="' + h(RW.TRAITS[t].d) + '">' + RW.TRAITS[t].n + '</span>'; }).join(' ');
    return '<div style="border-top:1px solid var(--line2);padding:10px 0" class="row between">' +
      '<div style="min-width:220px;flex:1"><b>' + h(c.name) + '</b> <span class="muted">(' + h(c.nick) + ')</span> ' + traits + '<div class="small ink2">ฝีมือจากการสัมภาษณ์ ' + c.est + ' ±' + c.errSd + ' · ขอเงินเดือน ' + F.b(c.ask) + (c.wantsEquity ? ' · อยากได้หุ้น' : '') + ' · เริ่มงานได้ใน ' + c.notice + ' สัปดาห์ · ตัดสินใจภายใน ' + Math.max(0, c.expires - s.time.w) + ' สัปดาห์' + (c.countered ? ' · ต่อรองมาแล้ว' : '') + '</div></div>' +
      '<div class="row"><label class="field" for="of_' + c.id + '">เงินเดือนที่เสนอ' + UI.numInput('of_' + c.id, form.salary, 'offerForm', [c.id, 'salary'], 1000) + '</label>' +
      '<label class="field" for="oe_' + c.id + '">หุ้น ESOP<select id="oe_' + c.id + '" data-act="offerForm" data-a=\'["' + c.id + '","eq"]\'>' + [0, 0.001, 0.0025, 0.005, 0.01, 0.02].map(function (x) { return '<option value="' + x + '"' + (x === form.eq ? ' selected' : '') + '>' + (x ? F.pct(x, 2) : 'ไม่ให้') + '</option>'; }).join('') + '</select></label>' +
      '<span class="pill ' + (p > 0.6 ? 'good' : p > 0.35 ? 'warn' : 'crit') + '" title="โอกาสตอบรับโดยประมาณ">ตอบรับ ~' + F.pct(p, 0) + '</span>' +
      UI.btn('ยื่นข้อเสนอ', 'makeOffer', [c.id], 'primary sm') + UI.btn('ไม่รับ', 'rejectCand', [c.id], 'sm ghost') + '</div></div>';
  };
  UI.acts.hireForm = function (k, v) { UI.form.hire[k] = k === 'level' ? Number(v) : v; };
  UI.acts.openPos = function () { var f = UI.form.hire; return A.openPosition(UI.s, f.role, f.level, f.channel); };
  UI.acts.closePos = function (id) { return A.closePosition(UI.s, id); };
  UI.acts.offerForm = function (id, k, v) { var f = UI.form['offer_' + id]; f[k] = Number(v); };
  UI.acts.makeOffer = function (id) {
    var f = UI.form['offer_' + id];
    var r = A.offer(UI.s, id, f.salary, f.eq);
    if (r.counter) { var c = UI.s.team.candidates.find(function (x) { return x.id === id; }); if (c) f.salary = c.ask; }
    return r;
  };
  UI.acts.rejectCand = function (id) { return A.rejectCandidate(UI.s, id); };

  UI.teamPolicy = function (s) {
    var pol = s.team.policy, P = RW.POLICIES;
    function opts(key, list, fmt) { return UI.segBtns(list.map(function (x, i) { return [i, x.n]; }), pol[key], 'setPolicy', [key]); }
    var per = U.sum(RW.Team.all(s), function () { return 1; });
    return '<div class="grid g2">' +
      UI.panel('สวัสดิการ', opts('benefits', P.benefits) + '<p class="small muted">ค่าใช้จ่าย ' + F.b(P.benefits[pol.benefits].cost) + '/คน/เดือน (รวม ' + F.m(P.benefits[pol.benefits].cost * per) + ') — มีผลต่อขวัญและการดึงดูดคน</p>') +
      UI.panel('รูปแบบการทำงาน', opts('workmode', P.workmode) + '<p class="small muted">ไฮบริด/รีโมทลดพื้นที่ออฟฟิศที่ต้องใช้ แต่การทำงานร่วมกันอาจช้าลงเล็กน้อย</p>') +
      UI.panel('ชั่วโมงทำงาน', opts('hours', P.hours) + '<p class="small muted">Crunch ได้งานเพิ่ม 25% แต่ความเครียดพุ่ง คนหมดไฟและลาออก</p>') +
      UI.panel('กิจกรรมและการพัฒนา', opts('culture', P.culture) + '<p class="small muted">' + F.b(P.culture[pol.culture].cost) + '/คน/เดือน · ช่วยให้พนักงานเก่งขึ้นเร็วและผูกพันกับบริษัท</p>') +
      '</div>';
  };
  UI.acts.setPolicy = function (k, v) { return A.setPolicy(UI.s, k, Number(v)); };
})(globalThis.RW = globalThis.RW || {});
