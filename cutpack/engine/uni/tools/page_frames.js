/* CutPack · uni · frames of a built real clip without rendering it (2026-11-18, Friend: "รอบนี้ให้ส่งมาเป็นรูปแบบเป็นเฟรมให้ผมดูก็ได้ครับ
   เพราะว่าถ้า render คลิปมันจะเปลือง usage"): opens the page (tools/build_only.sh), seeks it to each time on the clip's own frame and
   screenshots it. Writes <out dir>/f_<time>.jpg (540 × 960) and <out dir>/sheet.jpg (all of them, the time under each).
   usage: NODE_PATH=$(npm root -g) node tools/page_frames.js <project dir> <out dir> [every s = 1] [from s] [to s]  (or times: --at 0.2,1.5,…) */
const {chromium} = require('playwright'), fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');
(async () => { const [P, O] = process.argv.slice(2, 4); fs.mkdirSync(O, {recursive: true});
  const N = fs.readdirSync(path.resolve(P, 'src_frames')).length, end = (N - 2) / 30;
  const atI = process.argv.indexOf('--at'); let times;
  if (atI > 0) times = process.argv[atI + 1].split(',').map(Number);
  else { const every = +(process.argv[4] || 1), from = +(process.argv[5] || 0), to = +(process.argv[6] || end); times = []; for (let t = from; t <= to + 1e-6; t += every) times.push(+t.toFixed(2)); }
  const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1080, height: 1920}});
  await p.goto('file://' + path.resolve(P, 'scene.html')); await p.waitForFunction(() => window.GLOW_READY !== false, null, {timeout: 120000});
  const files = [];
  for (const t0 of times) { const t = Math.min(t0, end), f = Math.round(t * 30);
    await p.evaluate(([t, s]) => window.seek(t, s), [t, 'file://' + path.resolve(P, 'src_frames/s' + String(f + 1).padStart(5, '0') + '.jpg')]);
    const file = path.join(O, `f_${t.toFixed(2).padStart(6, '0')}.jpg`); await p.screenshot({path: file, type: 'jpeg', quality: 85}); files.push([file, t]); }
  await b.close();
  execFileSync('python3', ['-c', `
import sys, json
from PIL import Image, ImageDraw, ImageFont
fs = json.loads(sys.argv[1]); out = sys.argv[2]; W, H = 270, 480; cols = 8; rows = (len(fs) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (W + 6), rows * (H + 30)), 'white'); d = ImageDraw.Draw(sheet)
for k, (f, t) in enumerate(fs):
    im = Image.open(f); x, y = (k % cols) * (W + 6), (k // cols) * (H + 30); sheet.paste(im.resize((W, H)), (x, y))
    im.resize((540, 960)).save(f, quality=85); d.text((x + 4, y + H + 6), f'{t:.1f} s', fill='black')
sheet.save(out, quality=85)`, JSON.stringify(files), path.join(O, 'sheet.jpg')]);
  console.log(files.length, 'frames →', path.join(O, 'sheet.jpg')); })();
