// node print_pdf.js IN.html OUT.pdf — A4 PDF with the page footer of the original guide
const {chromium} = require('playwright');
(async () => {
  const [inp, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('file://' + require('path').resolve(inp));
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({
    path: out, format: 'A4', preferCSSPageSize: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="font-family:Loma,sans-serif;font-size:7.5pt;color:#8a96a3;width:100%;padding:0 20mm;">คู่มือหมวดหน้าที่ของประโยค – <span class="pageNumber"></span></div>',
  });
  await b.close();
})();
