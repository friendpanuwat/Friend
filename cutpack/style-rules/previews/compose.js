// Lays the preview stills out as labelled comparison sheets (Thai labels need a real browser for shaping).
// usage: node compose.js <work_dir> <out_dir> <dir with Mitr-*.ttf>
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const [W, OUT, FONTS] = process.argv.slice(2);
const img = (v, t) => {
  const f = path.join(W, v, 'prev', `p_${t.toFixed(2).padStart(6, '0')}.jpg`);
  if (!fs.existsSync(f)) throw new Error('missing still ' + f);
  return 'data:image/jpeg;base64,' + fs.readFileSync(f).toString('base64');
};
// fonts go in as data URIs: a page opened with setContent may not load file:// fonts
const font = f => 'data:font/ttf;base64,' + fs.readFileSync(path.join(FONTS, f)).toString('base64');
const SHEETS = [
  {file: '1_font.jpg', title: '1) ฟอนต์ในคลิป', note: 'ภาพเดียวกัน เปลี่ยนแค่ฟอนต์ · Prompt ไม่มีแบบลายมือ คำที่เคยเป็นลายมือ (เช่น "เฮ้ย!") จึงกลายเป็นตัวหนา',
   cols: [['ed_base', 'Mitr + Sriracha (skill)'], ['ed_prompt', 'Prompt (เอกสารส่งต่องาน)']], times: [1.25, 3.6, 4.6, 14.6]},
  {file: '2_color.jpg', title: '2) สี accent (สีเดียวต่อคลิป)', note: 'ตัวอย่างสีที่อ่านออกทั้งบนหน้าคนและพื้นดำ · สีแดงสงวนไว้ให้ความหมายลบ',
   cols: [['ed_base', 'เขียวมะนาว (ค่าเดิม)'], ['ed_FFD60A', 'เหลือง'], ['ed_FF8A3D', 'ส้ม'], ['ed_4CD7F6', 'ฟ้า']], times: [1.25, 4.6, 14.6]},
  {file: '3_glow_glass.jpg', title: '3) editorial: แสงม่วง + กระจกฝ้า', note: 'ขวา: แสงเปลี่ยนเป็นฟ้า + กรมท่า, กล่องกระจกเป็นกล่องทึบ, แผงกระจกเป็นแผงกรมท่า · ภาพนิ่งไม่เห็นแสงที่ไหลช้า ๆ',
   cols: [['ed_base', 'เดิม (ม่วง + กระจก)'], ['ed_flat', 'ไม่มีม่วง ไม่มีกระจก']], times: [4.6, 9.5, 32.6, 41.6]},
  {file: '3_capsule.jpg', title: '3) overlay: ชิปทรงแคปซูล (ขยายเฉพาะส่วนบนของจอ)', note: 'ขวา: ชิปเป็นสี่เหลี่ยมมุมมน (มุม 18 px) ส่วนอื่นเหมือนเดิมทุกอย่าง · ชิปทับผมเพราะตำแหน่งในคลิปตัวอย่างวางไว้สำหรับคลิปอื่น ในระบบจะคำนวณจากตำแหน่งหน้าของแต่ละคลิป',
   cols: [['ov_base', 'เดิม (แคปซูล)'], ['ov_square', 'สี่เหลี่ยมมุมมน']], times: [14.0, 14.6, 17.1, 37.4], crop: {x: 180, y: 120, w: 720, h: 640}},
];
(async () => {
  const browser = await chromium.launch();
  for (const s of SHEETS) {
    const cw = s.cols.length > 2 ? 230 : 340, cr = s.crop || {x: 0, y: 0, w: 1080, h: 1920}, k = cw / cr.w, ch = Math.round(cr.h * k);
    const html = `<!doctype html><meta charset="utf-8"><style>
      @font-face{font-family:M;src:url(${font('Mitr-Regular.ttf')})} @font-face{font-family:MB;src:url(${font('Mitr-SemiBold.ttf')})}
      body{margin:0;background:#f4f4f2;font-family:M;color:#111;padding:28px 24px;width:${s.cols.length * (cw + 16) + 32}px}
      h1{font-family:MB;font-size:30px;margin:0 0 6px} p{font-size:17px;margin:0 0 18px;color:#444;max-width:${s.cols.length * (cw + 16)}px;line-height:1.5}
      .row{display:flex;gap:16px;margin-bottom:16px} .h{font-family:MB;font-size:19px;width:${cw}px}
      .f{width:${cw}px;height:${ch}px;border-radius:10px;overflow:hidden;background:#000}
      img{width:${Math.round(1080 * k)}px;height:${Math.round(1920 * k)}px;margin:${-Math.round(cr.y * k)}px 0 0 ${-Math.round(cr.x * k)}px;display:block}
      .t{font-size:13px;color:#777;margin:2px 0 0}</style>
      <h1>${s.title}</h1><p>${s.note}</p>
      <div class="row">${s.cols.map(c => `<div class="h">${c[1]}</div>`).join('')}</div>
      ${s.times.map(t => `<div class="row">${s.cols.map(c => `<div><div class="f"><img src="${img(c[0], t)}"></div><div class="t">วินาที ${t}</div></div>`).join('')}</div>`).join('')}`;
    const page = await browser.newPage({viewport: {width: 400, height: 400}, deviceScaleFactor: 1});
    await page.setContent(html, {waitUntil: 'load'});
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path: path.join(OUT, s.file), fullPage: true, type: 'jpeg', quality: 82});
    await page.close();
  }
  await browser.close();
})();
