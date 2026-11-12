#!/usr/bin/env node
/* render.js — scene.html → MP4 (+ still.png + storyboard.jpg)
   usage: node render.js <scene.html> [outdir] [--name clip] [--fps 30] [--still] [--at 3.5] [--alpha] [--workers N]
     --still   only still.png (last frame) + storyboard.jpg — fast check while designing
     --at T    with --still: still.png at T seconds instead of the last frame (check page 1 of a multi-page clip)
     --alpha   transparent background → <name>.mov (ProRes 4444 with alpha) for overlaying on video
   Prints DURATION / frames / output paths. Scene errors are printed as "SCENE ERROR". */
const path = require('path'), fs = require('fs'), os = require('os');
const { execFileSync } = require('child_process');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require(path.join(execFileSync('npm', ['root', '-g']).toString().trim(), 'playwright'))); }

const argv = process.argv.slice(2), flag = f => argv.includes(f);
const opt = (f, d) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : d; };
const pos = argv.filter((a, i) => !a.startsWith('--') && !['--name', '--fps', '--workers', '--at', '--scale'].includes(argv[i - 1]));
if (!pos[0]) { console.error('usage: node render.js <scene.html> [outdir] [--name clip] [--fps 30] [--still] [--alpha]'); process.exit(2); }
const scene = path.resolve(pos[0]);
const out = path.resolve(pos[1] || path.join(path.dirname(scene), 'out'));
const name = opt('--name', path.basename(scene, '.html'));
const FPS = +opt('--fps', 30), ALPHA = flag('--alpha'), SCALE = +opt('--scale', 1);   // --scale 2 = sharper stills (2x pixels)
const WORKERS = +opt('--workers', Math.max(1, Math.min(4, os.cpus().length)));
// point the scene at this skill's engine whatever path it was written with (scenes stay portable)
const ENGINE = 'file://' + path.resolve(__dirname, '../assets/glowline.js');
const html = fs.readFileSync(scene, 'utf8');
if (!/glowline\.js/.test(html)) { console.error('SCENE ERROR: scene.html does not load glowline.js'); process.exit(1); }
const tmp = path.join(path.dirname(scene), '.render-' + path.basename(scene));
fs.writeFileSync(tmp, html.replace(/src=["'][^"']*glowline\.js["']/, `src="${ENGINE}"`));
process.on('exit', () => { try { fs.rmSync(tmp); } catch {} });
const url = 'file://' + tmp + (ALPHA ? '?alpha=1' : '');

async function open(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: SCALE });
  page.on('pageerror', e => console.error('SCENE ERROR:', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('SCENE ERROR:', m.text()); });
  await page.goto(url);
  await page.waitForFunction(() => window.READY || window.GL_ERROR, null, { timeout: 30000 });
  const err = await page.evaluate(() => window.GL_ERROR);
  if (err) { console.error('SCENE ERROR:', err); process.exit(1); }
  const st = await page.evaluate(() => ({ w: STAGE.w, h: STAGE.h, dur: DURATION }));
  await page.setViewportSize({ width: st.w, height: st.h });
  return { page, ...st };
}
const shot = (page, t, file) => page.evaluate(t => setT(t), t).then(() => page.screenshot({ path: file, omitBackground: ALPHA }));

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const first = await open(browser);
  const { w, h, dur } = first;

  // still + storyboard (6 moments)
  const AT = opt('--at') != null ? +opt('--at') : dur;
  await shot(first.page, AT, path.join(out, 'still.png'));
  const moments = [.14, .3, .46, .62, .8, 1].map(f => +(f * dur).toFixed(2));
  const sb = [];
  for (let i = 0; i < moments.length; i++) { const f = path.join(out, `.sb${i}.png`); await shot(first.page, moments[i], f); sb.push(f); }
  const tw = Math.round(360 * w / Math.max(w, h) * (h > w ? 1 : 1.6));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...sb.flatMap(f => ['-i', f]), '-filter_complex',
    sb.map((_, i) => `[${i}]scale=${tw}:-2[s${i}]`).join(';') + ';' + sb.map((_, i) => `[s${i}]`).join('') + `hstack=inputs=${sb.length}`,
    '-q:v', '3', path.join(out, 'storyboard.jpg')]);
  sb.forEach(f => fs.rmSync(f));
  console.log(`DURATION ${dur}s  STAGE ${w}x${h}  storyboard @ ${moments.join(', ')}s`);
  if (flag('--still')) { await browser.close(); console.log(`STILL ${out}/still.png (t=${AT}s)\nSTORYBOARD ${out}/storyboard.jpg`); return; }

  // frames, split across workers
  const frames = path.join(out, '.frames');
  fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames);
  const n = Math.round(dur * FPS) + 1, chunk = Math.ceil(n / WORKERS);
  const t0 = Date.now();
  await Promise.all(Array.from({ length: WORKERS }, async (_, k) => {
    const { page } = k === 0 ? first : await open(browser);
    for (let f = k * chunk; f < Math.min(n, (k + 1) * chunk); f++) await shot(page, f / FPS, path.join(frames, String(f).padStart(5, '0') + '.png'));
  }));
  await browser.close();

  const file = path.join(out, name + (ALPHA ? '.mov' : '.mp4'));
  const enc = ALPHA ? ['-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le']
    : ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart'];
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(frames, '%05d.png'), ...enc, file]);
  fs.rmSync(frames, { recursive: true });
  const mb = (fs.statSync(file).size / 1e6).toFixed(1);
  console.log(`FRAMES ${n} @ ${FPS}fps in ${((Date.now() - t0) / 1000).toFixed(0)}s\nVIDEO ${file} (${mb} MB)\nSTILL ${out}/still.png\nSTORYBOARD ${out}/storyboard.jpg`);
})().catch(e => { console.error(e); process.exit(1); });
