// Deterministic frame renderer.
//   node render.js --preview 1.2,3.4 [--mod film] [--out prev.jpg]       -> contact sheet of stills
//   node render.js --frames 0:300 --out seg0.mp4 [--mod film]             -> encoded segment
const { chromium } = require('playwright');
const http = require('http'), fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? a.concat([[v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : '1']]) : a), []));
const ROOT = __dirname;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.woff2': 'font/woff2', '.obj': 'text/plain', '.mtl': 'text/plain', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json' };

function serve() {
  return new Promise((res) => {
    const srv = http.createServer((req, resp) => {
      const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      fs.readFile(p, (err, data) => {
        if (err) { resp.writeHead(404); resp.end(); return; }
        resp.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); resp.end(data);
      });
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

(async () => {
  const srv = await serve();
  const port = srv.address().port;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  let jsErr = false;
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') { console.log('[page]', m.type(), m.text()); if (m.type() === 'error') jsErr = true; } });
  page.on('pageerror', (e) => { console.log('[pageerror]', e.message); jsErr = true; });
  await page.goto(`http://127.0.0.1:${port}/index.html?mod=${args.mod || 'film'}`);
  await page.waitForFunction(() => window.READY || window.INIT_ERROR, null, { timeout: 120000 });
  const initErr = await page.evaluate(() => window.INIT_ERROR);
  if (initErr) { console.log(initErr); process.exit(2); }
  const clip = { x: 0, y: 0, width: 1920, height: 1080 };
  const shot = async (t) => { await page.evaluate((t) => window.renderAt(t), t); return page.screenshot({ clip, type: 'jpeg', quality: 94 }); };

  if (args.preview) {
    const ts = args.preview.split(',').map(Number);
    const dir = path.join(ROOT, 'out', 'prev'); fs.mkdirSync(dir, { recursive: true });
    for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
    const files = [];
    for (const [i, t] of ts.entries()) {
      const t0 = Date.now(); const buf = await shot(t);
      const f = path.join(dir, `p${String(i).padStart(2, '0')}.jpg`); fs.writeFileSync(f, buf); files.push(f);
      console.log(`t=${t} ${Date.now() - t0}ms`);
    }
    const out = args.out || path.join(ROOT, 'out', 'prev.jpg');
    const cols = Math.min(ts.length, Number(args.cols || 4));
    const rows = Math.ceil(ts.length / cols);
    const lab = ts.map((t, i) => `[${i}:v]scale=640:360,drawtext=text='${t.toFixed(2)}':x=8:y=8:fontsize=26:fontcolor=yellow:box=1:boxcolor=black@0.6[v${i}]`).join(';');
    const pad = cols * rows - ts.length;
    const inputs = files.flatMap((f) => ['-i', f]);
    let fc = lab + ';';
    for (let i = 0; i < pad; i++) fc += `color=black:s=640x360:d=1[e${i}];`;
    const all = ts.map((_, i) => `[v${i}]`).join('') + Array.from({ length: pad }, (_, i) => `[e${i}]`).join('');
    fc += `${all}xstack=inputs=${cols * rows}:layout=${Array.from({ length: cols * rows }, (_, i) => `${(i % cols) * 640}_${Math.floor(i / cols) * 360}`).join('|')}[o]`;
    if (cols * rows === 1) fc = lab.replace(`[v0]`, '[o]');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', fc, '-map', '[o]', '-frames:v', '1', out]);
    console.log('PREVIEW', out);
  } else if (args.frames) {
    const [a, b] = args.frames.split(':').map(Number);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '12', '-pix_fmt', 'yuv420p', args.out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t0 = Date.now();
    for (let f = a; f < b; f++) {
      const buf = await shot(f / 30);
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      if ((f - a) % 30 === 0) console.log(`frame ${f} (${((Date.now() - t0) / (f - a + 1)).toFixed(0)} ms/f)`);
    }
    ff.stdin.end(); await new Promise((r) => ff.on('close', r));
    console.log('SEGMENT', args.out);
  }
  await browser.close(); srv.close();
  process.exit(jsErr ? 2 : 0);
})();
