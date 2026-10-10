const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 860 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto('file://' + path.join(__dirname, '..', 'dist', 'runway.html'));
  for (const ind of ['saas', 'ecom', 'fnb']) {
    const res = await page.evaluate(async (ind) => {
      const out = [];
      RW.UI.s = RW.Engine.newGame({ seed: 4242, industry: ind, difficulty: 'easy', founderName: 'ทดสอบ', bg: 'consultant', companyName: 'Fuzz', capital: 2000000, concept: null });
      const s = RW.UI.s;
      RW.Act.registerCompany(s);
      const tabs = RW.UI.tabs().map(t => t[0]).filter(t => t !== 'sep');
      for (let w = 0; w < 260 && !s.over; w++) {
        // crude activity so screens have content
        if (ind === 'saas' && w === 20) { s.biz.ch.search.budget = 20000; RW.Models.saas.act.addRoadmap(s, 'ux'); }
        if (ind === 'ecom') { const M = RW.Models.ecom; s.biz.skus.forEach(k => { if (M.stock(k) + M.incoming(s.biz, k.id) === 0) M.placePO(s, k.id, 1000, 'local'); }); s.biz.ch.market.ads = 15000; }
        if (ind === 'fnb' && w === 5) { const M = RW.Models.fnb; const st = s.biz.sites.list[0]; M.openBranch(s, st.id, true); }
        if (w === 30) RW.Act.openPosition(s, Object.keys(RW.ROLES).find(r => RW.ROLES[r].ind.includes(ind)), 2, 'board');
        if (w === 60 && !s.funding.raise) { const st = RW.Funding.stageOfRaise(s); const fair = RW.Funding.fairPre(s, st); RW.Act.startRaise(s, { stage: st, instrument: 'safe', target: Math.round(fair * 0.15 / 1e5) * 1e5, ask: Math.round(fair / 1e5) * 1e5 }); RW.Funding.eligibleInvestors(s, st).slice(0, 6).forEach(i => RW.Funding.pitch(s, i.id)); }
        RW.Engine.tick(s);
        let ev, g = 0;
        while ((ev = RW.Events.current(s)) && g++ < 10) { const r = RW.Events.render(s, ev); RW.Events.resolve(s, ev.pid, Math.floor(Math.random() * r.choices.length)); }
        if (w % 13 === 0 || s.over) {
          for (const t of tabs) {
            RW.UI.tab = t;
            const subs = { team: ['people', 'hire', 'policy'], finance: ['pl', 'bs', 'cf', 'plan', 'debt', 'tax'], funding: ['overview', 'raise', 'investors', 'exit'], inbox: ['all', 'decisions'] }[t] || [null];
            for (const sb of subs) {
              if (sb) RW.UI.sub[t] = sb;
              RW.UI.render();
              const txt = document.getElementById('app').innerText;
              if (txt.includes('เกิดข้อผิดพลาดในการแสดงผล') || txt.includes('undefined') || txt.includes('NaN')) out.push(ind + ' w' + s.time.w + ' tab ' + t + '/' + sb + ': ' + (txt.match(/.{0,60}(undefined|NaN|เกิดข้อผิดพลาด).{0,60}/) || [''])[0]);
            }
          }
          if (RW.Events.current(s)) { RW.UI.showEvent(); RW.UI.modal(''); }
        }
      }
      RW.UI.render(); // end screen if over
      return { out: out.slice(0, 12), week: s.time.w, over: s.over && s.over.reason };
    }, ind);
    console.log(ind, JSON.stringify(res));
  }
  console.log('page errors:', errors.length ? errors.slice(0, 10).join('\n') : 'none');
  await browser.close();
})();
