/* RUNWAY — UI framework: rendering shell, delegation, modal, toasts, charts, persistence */
(function (RW) {
  'use strict';
  var F = RW.F, U = RW.U;
  var UI = (RW.UI = { s: null, tab: 'overview', sub: {}, sel: {}, form: {}, charts: {}, views: {}, acts: {}, lastResult: null, mailOpen: null });
  var h = (UI.h = U.esc);

  // ---------- small builders ----------
  UI.btn = function (label, act, args, cls, extra) {
    return '<button type="button" class="btn ' + (cls || '') + '" data-act="' + act + '" data-a="' + h(JSON.stringify(args || [])) + '" ' + (extra || '') + '>' + label + '</button>';
  };
  UI.segBtns = function (opts, cur, act, extraArgs) {
    return '<div class="seg" role="group">' + opts.map(function (o) {
      return '<button type="button" class="' + (String(o[0]) === String(cur) ? 'on' : '') + '" data-act="' + act + '" data-a="' + h(JSON.stringify((extraArgs || []).concat([o[0]]))) + '">' + o[1] + '</button>';
    }).join('') + '</div>';
  };
  UI.pill = function (t, tone) { return '<span class="pill ' + (tone || '') + '">' + t + '</span>'; };
  UI.tip = function (label, tip) { return '<span data-tip="' + h(tip) + '" tabindex="0">' + label + '</span>'; };
  UI.meter = function (v, max, tone) {
    var p = U.clamp(v / (max || 100), 0, 1) * 100;
    return '<div class="meter ' + (tone || '') + '"><i style="width:' + p.toFixed(1) + '%"></i></div>';
  };
  UI.bar = function (label, v, max, tone, right) {
    return '<div><div class="bar-label"><span>' + label + '</span><span class="tnum">' + (right != null ? right : Math.round(v)) + '</span></div>' + UI.meter(v, max, tone) + '</div>';
  };
  UI.tile = function (label, value, sub, tone) {
    return '<div class="tile ' + (tone || '') + '"><label>' + label + '</label><strong class="tnum">' + value + '</strong>' + (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div>';
  };
  UI.panel = function (title, body, aside, cls) {
    return '<section class="panel ' + (cls || '') + '"><h3><span>' + title + '</span>' + (aside ? '<small>' + aside + '</small>' : '') + '</h3>' + body + '</section>';
  };
  UI.table = function (heads, rows, opts) {
    opts = opts || {};
    var th = heads.map(function (x) { var n = x.charAt(0) === '#'; return '<th class="' + (n ? 'n' : '') + '">' + (n ? x.slice(1) : x) + '</th>'; }).join('');
    var tr = rows.map(function (r) {
      var cls = r._cls || '';
      var cells = (r.cells || r).map(function (c, i) {
        var n = heads[i] && heads[i].charAt(0) === '#';
        var neg = n && typeof c === 'string' && c.indexOf('−') === 0;
        return '<td class="' + (n ? 'n' : '') + (neg ? ' neg' : '') + '">' + (c == null ? '' : c) + '</td>';
      }).join('');
      return '<tr class="' + cls + '">' + cells + '</tr>';
    }).join('');
    return '<div class="tbl-wrap"><table class="tbl">' + (heads.length ? '<thead><tr>' + th + '</tr></thead>' : '') + '<tbody>' + (tr || '<tr><td colspan="' + heads.length + '" class="empty">' + (opts.empty || 'ไม่มีข้อมูล') + '</td></tr>') + '</tbody></table></div>';
  };
  UI.slider = function (label, val, min, max, step, act, args, fmt) {
    var id = 'sl_' + act + '_' + (args || []).join('_');
    return '<label class="slider-row" for="' + id + '"><span>' + label + '</span><input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="' + (step || 1) + '" value="' + val + '" data-act="' + act + '" data-a="' + h(JSON.stringify(args || [])) + '" data-fmt="' + (fmt || '') + '"><output>' + UI.fmtVal(val, fmt) + '</output></label>';
  };
  UI.fmtVal = function (v, fmt) {
    v = Number(v);
    if (fmt === 'pct') return v + '%';
    if (fmt === 'pct1') return (v * 100).toFixed(0) + '%';
    if (fmt === 'b') return F.m(v);
    if (fmt === 'h') return v + ' ชม.';
    return v;
  };
  UI.numInput = function (id, val, act, args, step) {
    return '<input type="number" id="' + id + '" value="' + Math.round(val) + '" step="' + (step || 1000) + '" data-act="' + act + '" data-a="' + h(JSON.stringify(args || [])) + '">';
  };
  UI.alerts = function (list, max) {
    if (!list.length) return '<div class="alert good"><span class="dot"></span><span>ไม่มีสัญญาณอันตรายในตอนนี้</span></div>';
    return list.slice(0, max || 20).map(function (a) { return '<div class="alert ' + a.lvl + '"><span class="dot"></span><span>' + h(a.t) + '</span></div>'; }).join('');
  };
  UI.delta = function (v, goodUp) {
    if (v == null || !isFinite(v)) return '';
    var up = v >= 0;
    var tone = (up === (goodUp !== false)) ? 'good' : 'crit';
    return '<span class="' + tone + '">' + (up ? '▲ ' : '▼ ') + F.pct(Math.abs(v), 1) + '</span>';
  };

  // ---------- Charts (SVG line/area with hover) ----------
  var chartSeq = 0;
  UI.chart = function (opt) {
    var id = 'ch' + (++chartSeq);
    var W = 640, Hh = opt.height || 190, pl = 54, pr = 14, pt = 10, pb = 24;
    var n = opt.labels.length;
    var all = [];
    opt.series.forEach(function (s) { s.data.forEach(function (v) { if (v != null && isFinite(v)) all.push(v); }); });
    if (!n || !all.length) return '<div class="empty">ยังไม่มีข้อมูลพอสำหรับกราฟ — เล่นต่ออีกสักเดือน</div>';
    var mn = Math.min.apply(null, all), mx = Math.max.apply(null, all);
    if (opt.zero !== false) mn = Math.min(0, mn);
    if (mx === mn) mx = mn + 1;
    var ticks = UI.niceTicks(mn, mx, 4);
    mn = ticks[0]; mx = ticks[ticks.length - 1];
    var x = function (i) { return pl + (n === 1 ? (W - pl - pr) / 2 : i * (W - pl - pr) / (n - 1)); };
    var y = function (v) { return pt + (Hh - pt - pb) * (1 - (v - mn) / (mx - mn)); };
    var fmt = opt.fmt || F.k;
    var svg = '<svg viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="' + h(opt.title || 'chart') + '">';
    ticks.forEach(function (t) {
      svg += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(t) + '" y2="' + y(t) + '" stroke="var(--grid)" stroke-width="1"/>';
      svg += '<text x="' + (pl - 6) + '" y="' + (y(t) + 4) + '" text-anchor="end" font-size="11" fill="var(--muted)" style="font-variant-numeric:tabular-nums">' + h(fmt(t)) + '</text>';
    });
    if (mn < 0 && mx > 0) svg += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + y(0) + '" y2="' + y(0) + '" stroke="var(--muted)" stroke-width="1"/>';
    var step = Math.max(1, Math.ceil(n / 8));
    opt.labels.forEach(function (l, i) {
      if (i % step === 0 || i === n - 1) svg += '<text x="' + x(i) + '" y="' + (Hh - 6) + '" text-anchor="middle" font-size="10.5" fill="var(--muted)">' + h(l) + '</text>';
    });
    opt.series.forEach(function (s, si) {
      var pts = [];
      s.data.forEach(function (v, i) { if (v != null && isFinite(v)) pts.push([x(i), y(v)]); });
      if (!pts.length) return;
      var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
      if (s.area) {
        var base = y(Math.max(mn, 0));
        svg += '<path d="' + d + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + base + ' L' + pts[0][0].toFixed(1) + ' ' + base + ' Z" fill="' + s.color + '" fill-opacity="0.1" stroke="none"/>';
      }
      if (s.bars) {
        var bw = Math.min(18, (W - pl - pr) / n * 0.6);
        s.data.forEach(function (v, i) {
          if (v == null) return;
          var y0 = y(0), y1 = y(v);
          svg += '<rect x="' + (x(i) - bw / 2).toFixed(1) + '" y="' + Math.min(y0, y1).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(1, Math.abs(y1 - y0)).toFixed(1) + '" rx="2" fill="' + (v < 0 && s.negColor ? s.negColor : s.color) + '"/>';
        });
      } else {
        svg += '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"' + (s.dash ? ' stroke-dasharray="4 4"' : '') + '/>';
        var lp = pts[pts.length - 1];
        svg += '<circle cx="' + lp[0].toFixed(1) + '" cy="' + lp[1].toFixed(1) + '" r="4" fill="' + s.color + '" stroke="var(--panel)" stroke-width="2"/>';
      }
    });
    svg += '<line class="xh" x1="0" x2="0" y1="' + pt + '" y2="' + (Hh - pb) + '" stroke="var(--muted)" stroke-width="1" visibility="hidden"/>';
    svg += '<rect class="hit" x="' + pl + '" y="' + pt + '" width="' + (W - pl - pr) + '" height="' + (Hh - pt - pb) + '" fill="transparent"/>';
    svg += '</svg>';
    UI.charts[id] = { labels: opt.labels, series: opt.series.map(function (s) { return { name: s.name, color: s.color, data: s.data }; }), W: W, pl: pl, pr: pr, n: n, fmt: opt.tipFmt || fmt, x: null };
    var legend = opt.series.length > 1 ? '<div class="legend">' + opt.series.map(function (s) { return '<span><i style="background:' + s.color + '"></i>' + h(s.name) + '</span>'; }).join('') + '</div>' : '';
    return legend + '<div class="chart" data-chart="' + id + '">' + svg + '<div class="tip"></div></div>';
  };
  UI.niceTicks = function (mn, mx, count) {
    var span = mx - mn;
    var step = Math.pow(10, Math.floor(Math.log10(span / count)));
    var err = span / count / step;
    if (err >= 7.5) step *= 10; else if (err >= 3.5) step *= 5; else if (err >= 1.5) step *= 2;
    var lo = Math.floor(mn / step) * step, hi = Math.ceil(mx / step) * step;
    var out = [];
    for (var v = lo; v <= hi + step * 0.5; v += step) out.push(Math.abs(v) < step * 1e-6 ? 0 : v);
    return out;
  };
  function chartHover(e) {
    var el = e.target.closest && e.target.closest('.chart');
    if (!el) return;
    var c = UI.charts[el.getAttribute('data-chart')];
    if (!c) return;
    var svg = el.querySelector('svg');
    var r = svg.getBoundingClientRect();
    var px = (e.clientX - r.left) / r.width * c.W;
    var i = Math.round((px - c.pl) / ((c.W - c.pl - c.pr) / Math.max(1, c.n - 1)));
    i = U.clamp(i, 0, c.n - 1);
    var xh = svg.querySelector('.xh');
    var xx = c.pl + (c.n === 1 ? (c.W - c.pl - c.pr) / 2 : i * (c.W - c.pl - c.pr) / (c.n - 1));
    xh.setAttribute('x1', xx); xh.setAttribute('x2', xx); xh.setAttribute('visibility', 'visible');
    var tip = el.querySelector('.tip');
    tip.innerHTML = '<b>' + h(c.labels[i]) + '</b>' + c.series.map(function (s) {
      var v = s.data[i];
      return '<div><i style="display:inline-block;width:8px;height:8px;border-radius:2px;margin-right:6px;background:' + s.color + '"></i>' + h(s.name) + ': <strong class="tnum">' + (v == null ? '–' : h(c.fmt(v))) + '</strong></div>';
    }).join('');
    tip.style.display = 'block';
    var left = xx / c.W * r.width;
    tip.style.left = Math.min(r.width - tip.offsetWidth - 4, Math.max(0, left + 10)) + 'px';
    tip.style.top = '4px';
  }
  function chartLeave(e) {
    var el = e.target.closest && e.target.closest('.chart');
    if (!el) return;
    var tip = el.querySelector('.tip'); if (tip) tip.style.display = 'none';
    var xh = el.querySelector('.xh'); if (xh) xh.setAttribute('visibility', 'hidden');
  }

  // ---------- Persistence ----------
  UI.store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } },
    del: function (k) { try { window.localStorage.removeItem(k); } catch (e) { } }
  };
  UI.SLOTS = ['auto', '1', '2', '3'];
  UI.save = function (slot) {
    if (!UI.s) return false;
    var ok = UI.store.set('runway.save.' + slot, JSON.stringify(UI.s));
    if (ok) UI.store.set('runway.meta.' + slot, JSON.stringify({ name: UI.s.company.name, ind: UI.s.industry, w: UI.s.time.w, label: RW.T.label(UI.s.time.w), cash: UI.s.fin.bal.cash, over: !!UI.s.over, at: Date.now() }));
    return ok;
  };
  UI.slotMeta = function (slot) { try { return JSON.parse(UI.store.get('runway.meta.' + slot) || 'null'); } catch (e) { return null; } };
  UI.loadSlot = function (slot) {
    var raw = UI.store.get('runway.save.' + slot);
    if (!raw) return false;
    try { UI.s = UI.migrate(JSON.parse(raw)); UI.tab = 'overview'; return true; } catch (e) { return false; }
  };
  UI.migrate = function (s) {
    s.founder.focus.consult = s.founder.focus.consult || 0;
    return s;
  };
  UI.exportCode = function () {
    var json = JSON.stringify(UI.s);
    return btoa(unescape(encodeURIComponent(json)));
  };
  UI.importCode = function (code) {
    try {
      var json = decodeURIComponent(escape(atob(code.trim())));
      var s = JSON.parse(json);
      if (!s || !s.fin || !s.time) return false;
      UI.s = UI.migrate(s); UI.tab = 'overview';
      return true;
    } catch (e) { return false; }
  };

  // ---------- Toasts & modal ----------
  UI.toast = function (msg, bad) {
    if (!msg) return;
    var box = document.getElementById('toasts');
    var t = document.createElement('div');
    t.className = 'toast' + (bad ? ' bad' : '');
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () { t.remove(); }, bad ? 5200 : 3600);
  };
  UI.result = function (r) {
    if (!r) return;
    if (r.msg) UI.toast(r.msg, r.ok === false);
  };

  UI.modal = function (html) {
    var m = document.getElementById('modal');
    m.innerHTML = html ? '<div class="modal-back"><div class="modal" role="dialog" aria-modal="true">' + html + '</div></div>' : '';
    if (html) { var b = m.querySelector('button'); if (b) b.focus(); }
  };

  UI.showEvent = function () {
    var s = UI.s;
    var p = RW.Events.current(s);
    if (!p) { UI.modal(''); return false; }
    var r = RW.Events.render(s, p);
    var catN = { team: 'ทีมงาน', founder: 'ชีวิตผู้ก่อตั้ง', funding: 'การระดมทุน', admin: 'กฎหมาย & ภาษี', market: 'ตลาด', sales: 'การขาย', product: 'สินค้า', general: 'เหตุการณ์' }[r.cat] || 'เหตุการณ์';
    var due = RW.Events.dueCount(s);
    var html = '<header><div class="cat">' + catN + ' · ' + RW.T.label(s.time.w) + (due > 1 ? ' · อีก ' + (due - 1) + ' เรื่องรอตัดสินใจ' : '') + '</div><h2>' + h(r.title) + '</h2></header>' +
      '<div class="body">' + h(r.body) + '</div><div class="choices">' +
      r.choices.map(function (c, i) {
        return '<button type="button" class="choice" data-act="choose" data-a="' + h(JSON.stringify([p.pid, i])) + '"' + (c.ok === false ? ' disabled' : '') + '><b>' + h(c.t) + '</b>' + (c.d ? '<span>' + h(c.d) + '</span>' : '') + '</button>';
      }).join('') + '</div>';
    UI.modal(html);
    return true;
  };

  UI.showResult = function (title, text) {
    UI.modal('<header><div class="cat">ผลลัพธ์</div><h2>' + h(title) + '</h2></header><div class="result">' + h(text) + '</div><div class="choices"><button type="button" class="btn primary" data-act="closeResult" data-a="[]">ตกลง</button></div>');
  };

  // ---------- Game flow ----------
  UI.advance = function (mode) {
    var s = UI.s;
    if (!s || s.over) return;
    if (RW.Events.current(s)) { UI.showEvent(); return; }
    var startM = RW.T.info(s.time.w).monthsElapsed;
    var n = 0, max = mode === 'month' ? 6 : mode === 'quarter' ? 14 : 1;
    while (n < max) {
      RW.Engine.tick(s);
      n++;
      if (s.over || RW.Events.current(s)) break;
      if (mode === 'month' && RW.T.info(s.time.w).monthEnd) break;
      if (mode === 'quarter' && RW.T.info(s.time.w).quarterEnd) break;
      if (s.kpi.runway < 1 && mode !== 'week') break;
    }
    UI.save('auto');
    UI.render();
    if (!s.over) UI.showEvent();
  };

  UI.unread = function () { return UI.s ? UI.s.inbox.filter(function (m) { return !m.read; }).length : 0; };

  // ---------- Tabs ----------
  UI.tabs = function () {
    var s = UI.s;
    var M = RW.Models[s.industry];
    var t = [['overview', 'ภาพรวม'], ['founder', 'ผู้ก่อตั้ง']];
    M.ui.tabs.forEach(function (x) { t.push([x.id, x.n]); });
    t.push(['team', 'ทีมงาน'], ['finance', 'การเงิน'], ['funding', 'ระดมทุน & หุ้น'], ['company', 'บริษัท & กฎหมาย'], ['sep'], ['inbox', 'กล่องข้อความ'], ['world', 'ตลาด & เศรษฐกิจ'], ['journal', 'บันทึก & ความสำเร็จ'], ['settings', 'เซฟ & ตั้งค่า']);
    return t;
  };

  UI.topbar = function () {
    var s = UI.s, k = s.kpi, f = s.founder;
    var rw = k.runway;
    var lit = !isFinite(rw) ? 24 : Math.min(24, Math.floor(rw));
    var lamps = '';
    for (var i = 0; i < 24; i++) {
      var cls = i < lit ? (lit < 3 ? 'c' : lit < 6 ? 'w' : 'on') : '';
      lamps += '<i class="' + cls + '"></i>';
    }
    var runwayTone = rw < 3 ? 'crit' : rw < 6 ? 'warn' : '';
    var M = RW.Models[s.industry];
    var revLabel = M.topMetric ? M.topMetric(s) : ['รายได้/เดือน', F.m(k.revenueMonthly)];
    return '<header class="topbar">' +
      '<div class="brand"><b>RUNWAY</b><span>' + h(s.company.name) + '</span></div>' +
      '<div class="gauges">' +
      '<div class="gauge"><label>เงินสด</label><strong class="' + (k.cash < 0 ? 'crit' : '') + '">' + F.m(k.cash) + '</strong><span class="sub">Burn ' + (k.burn > 0 ? F.m(k.burn) + '/ด.' : 'กำไร') + '</span></div>' +
      '<div class="gauge"><label>' + UI.tip('Runway', 'จำนวนเดือนที่เงินสดจะหมดถ้าใช้จ่ายเท่าเดิม แต่ละไฟ = 1 เดือน') + '</label><strong class="' + runwayTone + '">' + F.months(rw) + '</strong><div class="lights" aria-hidden="true">' + lamps + '</div></div>' +
      '<div class="gauge"><label>' + revLabel[0] + '</label><strong>' + revLabel[1] + '</strong><span class="sub">' + (k.momGrowth ? UI.delta(k.momGrowth) + ' MoM' : '&nbsp;') + '</span></div>' +
      '<div class="gauge"><label>ทีม</label><strong>' + (RW.Team.headcount(s) + 1 + (s.cofounders || []).filter(function (c) { return c.active; }).length) + ' คน</strong><span class="sub">ขวัญ ' + (k.morale != null ? Math.round(k.morale) : '–') + '</span></div>' +
      '<div class="gauge"><label>พลังงานคุณ</label><strong class="' + (f.energy < 25 ? 'crit' : f.energy < 45 ? 'warn' : '') + '">' + Math.round(f.energy) + '</strong><span class="sub">เครียด ' + Math.round(f.stress) + (f.vacation ? ' · ลาพัก' : f.burnout ? ' · หมดไฟ' : '') + '</span></div>' +
      '</div>' +
      '<div class="controls"><span class="date">' + RW.T.label(s.time.w) + '</span>' +
      UI.btn('▶ สัปดาห์ถัดไป', 'advance', ['week'], 'primary go', 'title="Space"') +
      UI.btn('▶▶ จบเดือน', 'advance', ['month'], 'go', 'title="Shift+Space"') +
      '</div></header>';
  };

  UI.rail = function () {
    var s = UI.s;
    var unread = UI.unread();
    var crit = RW.Engine.advice(s).filter(function (a) { return a.lvl === 'crit'; }).length;
    return '<nav class="rail" aria-label="แผนก">' + UI.tabs().map(function (t) {
      if (t[0] === 'sep') return '<div class="sep"></div>';
      var badge = '';
      if (t[0] === 'inbox' && unread) badge = '<span class="badge">' + Math.min(99, unread) + '</span>';
      if (t[0] === 'overview' && crit) badge = '<span class="badge crit">' + crit + '</span>';
      if (t[0] === 'funding' && s.funding.raise) badge = '<span class="badge">●</span>';
      if (t[0] === 'team' && s.team.candidates.length) badge = '<span class="badge">' + s.team.candidates.length + '</span>';
      return '<button type="button" class="' + (UI.tab === t[0] ? 'on' : '') + '" data-act="tab" data-a="' + h(JSON.stringify([t[0]])) + '"><span>' + t[1] + '</span>' + badge + '</button>';
    }).join('') + '</nav>';
  };

  UI.render = function () {
    var app = document.getElementById('app');
    UI.charts = {};
    if (!UI.s) { app.innerHTML = RW.UI.titleScreen(); return; }
    if (UI.s.over) { app.innerHTML = RW.UI.endScreen(); return; }
    var view = UI.views[UI.tab];
    var M = RW.Models[UI.s.industry];
    if (!view && M.ui.render[UI.tab]) view = M.ui.render[UI.tab];
    if (!view) { UI.tab = 'overview'; view = UI.views.overview; }
    var html;
    try { html = view(UI.s); } catch (e) { html = '<div class="panel"><h3>เกิดข้อผิดพลาดในการแสดงผล</h3><pre class="small">' + h(e.stack || e) + '</pre></div>'; console.error(e); }
    var scrollY = window.scrollY;
    app.innerHTML = UI.topbar() + '<div class="shell">' + UI.rail() + '<main class="main" id="main">' + html + '</main></div>';
    window.scrollTo(0, scrollY);
  };

  UI.rerenderKeep = function () { UI.render(); };

  // ---------- Delegation ----------
  function args(el) { try { return JSON.parse(el.getAttribute('data-a') || '[]'); } catch (e) { return []; } }
  function dispatch(el, value) {
    var act = el.getAttribute('data-act');
    var a = args(el);
    if (value !== undefined) a = a.concat([value]);
    var fn = UI.acts[act];
    var M = UI.s && RW.Models[UI.s.industry];
    if (!fn && M && M.ui.acts[act]) fn = M.ui.acts[act];
    if (!fn) { console.warn('no action', act); return; }
    var r = fn.apply(null, a);
    if (r && r.then) return;
    if (r && r.msg) UI.result(r);
    if (!r || r.render !== false) UI.render();
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el || el.tagName === 'INPUT' || el.tagName === 'SELECT') return;
    if (el.disabled) return;
    e.preventDefault();
    dispatch(el);
  });
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (!el.getAttribute || !el.getAttribute('data-act')) return;
    var v = el.type === 'checkbox' ? el.checked : el.type === 'range' || el.type === 'number' ? Number(el.value) : el.value;
    dispatch(el, v);
  });
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.type === 'range') {
      var out = el.parentNode.querySelector('output');
      if (out) out.textContent = UI.fmtVal(el.value, el.getAttribute('data-fmt'));
    }
  });
  document.addEventListener('mousemove', chartHover);
  document.addEventListener('mouseout', chartLeave);
  document.addEventListener('keydown', function (e) {
    if (!UI.s || UI.s.over) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (document.querySelector('.modal-back')) return;
    if (e.code === 'Space') { e.preventDefault(); UI.advance(e.shiftKey ? 'month' : 'week'); }
  });

  // ---------- Core actions ----------
  var A = RW.Act;
  UI.acts.tab = function (t) { UI.tab = t; window.scrollTo(0, 0); if (t === 'inbox') { } return { render: true }; };
  UI.acts.advance = function (mode) { UI.advance(mode); return { render: false }; };
  UI.acts.choose = function (pid, idx) {
    var s = UI.s;
    var p = s.events.pending.find(function (x) { return x.pid === pid; });
    if (!p) return { render: true };
    var r = RW.Events.render(s, p);
    var res = RW.Events.resolve(s, pid, idx);
    RW.Engine.computeKPIs(s);
    UI.save('auto');
    if (s.over) { UI.modal(''); UI.render(); return { render: false }; }
    UI.render();
    UI.showResult(r.title, res || 'ดำเนินการแล้ว');
    return { render: false };
  };
  UI.acts.closeResult = function () {
    UI.modal('');
    if (!UI.showEvent()) UI.render();
    return { render: false };
  };
  UI.acts.theme = function (t) {
    if (t === 'system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', t);
    UI.store.set('runway.theme', t);
  };

  // boot
  UI.boot = function (hot) {
    var t = UI.store.get('runway.theme');
    if (t && t !== 'system') document.documentElement.setAttribute('data-theme', t);
    if (hot && hot.state) { UI.s = hot.state; UI.tab = hot.tab || 'overview'; }
    UI.render();
    if (UI.s && !UI.s.over) UI.showEvent();
  };
})(globalThis.RW = globalThis.RW || {});
