// render.js — ถ่ายเฟรมจาก scene.html แล้วรวมเป็น MP4 1080x1920 30fps
// ใช้: node render.js [--still]   (ไฟล์ออก: out/glow-line-simplify.mp4, out/still.png, out/storyboard.png)
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30;
const here = __dirname;
const out = path.join(here, 'out');
const frames = path.join(out, 'frames');

(async () => {
  fs.mkdirSync(frames, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(here, 'scene.html'));
  await page.evaluate(() => document.fonts.ready);
  const dur = await page.evaluate(() => window.DURATION);

  // still (last frame) + storyboard moments
  await page.evaluate(t => setT(t), dur);
  await page.screenshot({ path: path.join(out, 'still.png') });
  const moments = [1.6, 2.9, 4.0, dur];
  for (let i = 0; i < moments.length; i++) {
    await page.evaluate(t => setT(t), moments[i]);
    await page.screenshot({ path: path.join(out, `sb${i}.png`) });
  }
  if (process.argv.includes('--still')) { await browser.close(); return; }

  const n = Math.round(dur * FPS);
  for (let f = 0; f <= n; f++) {
    await page.evaluate(t => setT(t), f / FPS);
    await page.screenshot({ path: path.join(frames, String(f).padStart(4, '0') + '.png') });
  }
  await browser.close();

  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i "${frames}/%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 -preset slow -movflags +faststart "${out}/glow-line-simplify.mp4"`);
  fs.rmSync(frames, { recursive: true });
})();
