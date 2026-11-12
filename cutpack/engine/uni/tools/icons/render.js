const {chromium} = require('playwright'); const fs = require('fs');
const ICONS = JSON.parse(fs.readFileSync('/home/user/Friend/cutpack/engine/icons/lucide.json', 'utf8'));
const rows = JSON.parse(fs.readFileSync('rows.json', 'utf8'));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 1200, height: 800}, deviceScaleFactor: 1});
  const html = '<body style="margin:0;background:#fff">' + rows.map((r, i) => `<div id="i${i}" style="width:96px;height:96px;display:inline-flex;align-items:center;justify-content:center;background:#fff"><svg width="76" height="76" viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[r.name]}</svg></div>`).join('') + '</body>';
  await p.setContent(html);
  for (let i = 0; i < rows.length; i++) await (await p.$('#i' + i)).screenshot({path: `png/${rows[i].name}.png`});
  // the visual sheet (PDF): grouped by priority, each icon with its name and meaning
  const font = 'file:///home/user/Friend/cutpack/engine/uni/fonts/Anuphan-VF.ttf';
  const PR = {1: 'ลำดับ 1 · วาดก่อน (ร่างในคลังวาดเอง หรือ AI เลือกบ่อย)', 2: 'ลำดับ 2 · AI เคยเลือก 1–2 ครั้ง', 3: 'ลำดับ 3 · AI เลือกได้ แต่ยังไม่เคยถูกเลือกในการทดสอบ'};
  const sec = [1, 2, 3].map(pr => { const rs = rows.filter(r => r.pr === pr); return `<h2>${PR[pr]} — ${rs.length} ไอคอน</h2><div class="g">` +
    rs.map(r => `<div class="c"><svg viewBox="0 0 24 24" fill="none" stroke="#111827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[r.name]}</svg><b>${r.th}</b><i>${r.name}</i></div>`).join('') + '</div>'; }).join('');
  const page = `<html><head><meta charset="utf-8"><style>@font-face{font-family:A;src:url(${font})}
    body{font-family:A,sans-serif;margin:0;color:#111827} h1{font-size:22px;margin:0 0 4px} p{margin:0 0 10px;color:#4B5563;font-size:12px}
    h2{font-size:15px;margin:16px 0 8px;padding:6px 10px;background:#EEF2FF;border-radius:6px;break-after:avoid}
    .g{display:grid;grid-template-columns:repeat(8,1fr);gap:6px} .c{border:1px solid #E5E7EB;border-radius:8px;padding:8px 4px 6px;display:flex;flex-direction:column;align-items:center;gap:3px;break-inside:avoid}
    .c svg{width:44px;height:44px} .c b{font-size:10.5px;font-weight:600;text-align:center;line-height:1.25} .c i{font-style:normal;font-size:8.5px;color:#6B7280;font-family:monospace}
  </style></head><body><h1>ไอคอนที่ CutPack ใช้ทั้งหมด ${rows.length} ไอคอน</h1><p>ภาพคือไอคอนปัจจุบัน (Lucide) · ชื่อภาษาอังกฤษคือชื่อไฟล์ที่ใช้ตอนส่งไอคอนที่วาดใหม่ · รายละเอียดอยู่ในไฟล์ Excel</p>${sec}</body></html>`;
  await p.setContent(page, {waitUntil: 'networkidle'}); await p.waitForTimeout(500);
  await p.pdf({path: 'icon_preview.pdf', format: 'A4', margin: {top: '12mm', bottom: '12mm', left: '10mm', right: '10mm'}, printBackground: true});
  await b.close(); console.log('ok', rows.length);
})();
