/* =====================================================================
   CutPack · uni · glow stills (prototype, 2026-11-17): one still per (style, glow scene) on a speaker frame
   usage: NODE_PATH=$(npm root -g) node glow/stills.js <work_dir> <out_dir> <frame.jpg> <scenes.js> <at> "<style>:<scene>@<index> …"
     scenes.js = GLOWSCENE(...) lines (bridge.js) · at = the second to shoot (after the key word) · an overlay style gets
     --speaker .86 (the head room of Friend's clips, as stills.sh) · out: <out_dir>/<style>_<scene>.jpg (1080 × 1920)
   Loads the glow-line runtime and the category files read-only from the skill (.claude/skills/glow-line-motion).
   ===================================================================== */
const {chromium} = require('playwright'), fs = require('fs'), path = require('path'), {execFileSync} = require('child_process');
const [work, out, frame, scenes, at, list] = process.argv.slice(2);
const UNI = path.resolve(__dirname, '..'), SKILL = path.resolve(UNI, '../../../.claude/skills/glow-line-motion');
const ASSETS = path.join(SKILL, 'assets'), EX = path.join(SKILL, 'examples');
const cats = fs.readdirSync(EX).filter(d => /^b\d\dt?$/.test(d)).map(d => path.join(EX, d, d + '.js')).filter(f => fs.existsSync(f));
const extra = [path.join(ASSETS, 'glowline.js'), ...cats, path.join(__dirname, 'bridge.js'), path.resolve(scenes)].flatMap(f => ['--extra', f]);
fs.mkdirSync(out, {recursive: true});
(async () => {
  const b = await chromium.launch(), page = await b.newPage({viewport: {width: 1080, height: 1920}});
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  for (const job of list.trim().split(/\s+/)) {
    const [style, rest] = job.split(':'), [scene, idx = '0'] = rest.split('@'), P = path.join(work, `${style}_${scene}_${idx}`);
    fs.rmSync(P, {recursive: true, force: true}); fs.mkdirSync(path.join(P, 'fonts'), {recursive: true});
    for (const f of fs.readdirSync(ASSETS)) if (f.endsWith('.js') && f !== 'glowline.js') fs.symlinkSync(path.join(ASSETS, f), path.join(P, f));   // the runtime loads these next to the page
    for (const f of fs.readdirSync(path.join(ASSETS, 'fonts'))) fs.copyFileSync(path.join(ASSETS, 'fonts', f), path.join(P, 'fonts', f));
    execFileSync('python3', [path.join(UNI, 'build.py'), P, style, scene, '--index', idx, ...(style.includes('-overlay') ? ['--speaker', '.86'] : []), ...extra]);
    errs.length = 0;
    await page.goto('file://' + path.join(P, 'scene.html'));
    await page.waitForFunction(() => window.GLOW_READY || window.GL_ERROR, null, {timeout: 60000});
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(([t, s]) => window.seek(t, s), [+at, 'file://' + path.resolve(frame)]);
    const file = path.join(out, `${style}_${scene}_${idx}.jpg`);
    await page.screenshot({path: file, type: 'jpeg', quality: 90});
    const low = await page.evaluate(() => glowCheck());                // lines and words under 3:1 against what is behind them
    fs.writeFileSync(file.replace(/\.jpg$/, '.contrast.json'), JSON.stringify(low, null, 1));
    console.log(path.basename(file), errs.length ? 'ERRORS ' + errs.slice(0, 3).join(' | ') : 'ok', low.length ? `· ${low.length} low contrast (worst ${Math.min(...low.map(x => x.ratio))})` : '· colours ok');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
