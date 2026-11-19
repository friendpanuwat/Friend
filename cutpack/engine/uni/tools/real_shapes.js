/* CutPack · uni · the real shape of each picture of a built real clip (2026-11-18, neon final, Friend: "ฉากไหนที่ motion graphics มีขนาดเล็ก
   จนจอดูโล่ง ให้ขยายด้วย"). glow/shapes.json measures each design with its own sample words; drawn with a clip's words a design can come
   out another shape (B06T.dial: 1.34 wide with its sample, 0.44 tall in the test clip), so a style that picks its screen by the shape put
   it in the wrong box. This opens a first build of the clip, reads what each picture really shows (its fitted viewBox) and writes
   `const REAL_SHAPES = {"<scene start>": width / height, …};` for the second build (tools/clip_all_styles.sh, tools/build_only.sh, styles
   with realShapes: true only).
   usage: NODE_PATH=$(npm root -g) node tools/real_shapes.js <project dir with scene.html> <out.js> */
const {chromium} = require('playwright'), fs = require('fs'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage({viewport: {width: 1080, height: 1920}});
  await p.goto('file://' + path.resolve(process.argv[2], 'scene.html')); await p.waitForFunction(() => window.GLOW_READY !== false, null, {timeout: 120000});
  const shapes = await p.evaluate(() => Object.fromEntries(CLIPWINS.map(x => { const svg = x.F.stage?.querySelector('.glow-host svg'); if (!svg) return null;
    if (svg.dataset.motion) return [x.t0.toFixed(2), +svg.dataset.motion];   // a style with motionFit: the shape of the whole motion (what has to fit)
    const v = (svg.getAttribute('viewBox') || '').split(/[\s,]+/).map(Number); return v.length === 4 && v[3] > 0 ? [x.t0.toFixed(2), +(v[2] / v[3]).toFixed(3)] : null; }).filter(Boolean)));
  fs.writeFileSync(process.argv[3], `const REAL_SHAPES = ${JSON.stringify(shapes)};\n`);
  console.log(Object.keys(shapes).length, 'shapes →', process.argv[3]); await b.close(); })();
