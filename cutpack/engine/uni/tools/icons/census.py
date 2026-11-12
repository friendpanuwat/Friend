"""census.py <style> <out.json> [max scenes]: load every scene file, play every SENTENCE scene of a variant in one page and
record which icon names each one reads from ICONS (a Proxy), minus the icons its sentence gives."""
import glob, json, os, sys, subprocess
UNI = '/home/user/Friend/cutpack/engine/uni'; ENGINE = os.path.dirname(UNI)
style, out = sys.argv[1], sys.argv[2]; lim = int(sys.argv[3]) if len(sys.argv) > 3 else 100000
rd = lambda p: open(os.path.join(UNI, p)).read()
base = style.split('-overlay')[0]
styles = [f'styles/{base}.js', f'styles/{base}-overlay.js'] if '-overlay' in style else [f'styles/{style}.js']
scenes = sorted(glob.glob(os.path.join(UNI, 'scenes', '*.js')))
js = ['window.__ic = new Set(); const ICONS = new Proxy(' + open(os.path.join(ENGINE, 'icons', 'lucide.json')).read() +
      ', {get(t, k) { if (typeof k === "string" && k in t) window.__ic.add(k); return t[k]; }});', rd('core.js'), rd('kit.js'), rd('overlay.js')] + [rd(f) for f in styles]
for f in scenes:
    js.append(open(f).read())
    if f.endswith('/cats.js'):
        js.append('window.__sent = {}; const __S0 = SENTENCE; SENTENCE = function (id, r) { window.__sent[id] = r; return __S0(id, r); };')
js.append(f'''
useStyle({json.dumps(style)});
window.__ic.clear(); try {{ ST.frame(0, 4, {{index: 0, scene: 'x'}}); }} catch (e) {{}}
const chrome = [...window.__ic];
const walk = (v, acc) => {{ if (typeof v === 'string') {{ if (v in ICONS) acc.add(v); }} else if (v && typeof v === 'object') Object.values(v).forEach(x => walk(x, acc)); return acc; }};
const res = [], errs = []; let k = 0;
for (const [id, S] of Object.entries(SCENES)) {{
  const v = S.meta.variant; if (!v) continue; if (k++ >= {lim}) break;
  const sid = id.slice(0, id.length - v.length - 1), r = window.__sent[sid]; if (!r) continue;
  for (const el of [...SC.children, ...TX.children]) el.remove();
  window.__ic.clear();
  try {{ play(id, .5, 4.5, {{}}, {{index: k % 3}}); }} catch (e) {{ errs.push(id + ': ' + e.message); continue; }}
  const slot = walk(r, new Set());
  res.push({{cat: S.meta.cat, variant: v, sentence: sid, all: [...window.__ic], fixed: [...window.__ic].filter(n => !slot.has(n)), slot: [...slot]}});
}}
window.__out = {{style: {json.dumps(style)}, chrome, res, errs}};''')
html = ('<!doctype html><html><head><meta charset="utf-8"><style>' + rd('base.css') + '</style></head><body>'
        '<div class="layer" id="BG"></div><img id="v"><img id="vb"><div class="layer" id="SC"></div><div class="layer" id="TX"></div>'
        + ''.join(f'<script>\n{s}\n</script>' for s in js) + '</body></html>')
open(f'page_{style}.html', 'w').write(html)
node = f'''
const {{chromium}} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage({{viewport: {{width: 1080, height: 1920}}}});
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + {json.dumps(os.path.abspath(f'page_{style}.html'))}); await p.waitForFunction(() => window.__out, null, {{timeout: 600000}});
  const o = await p.evaluate(() => window.__out); o.pageerrs = errs; require('fs').writeFileSync({json.dumps(out)}, JSON.stringify(o)); await b.close(); }})();'''
open(f'run_{style}.js', 'w').write(node)
r = subprocess.run(['node', f'run_{style}.js'], env={**os.environ, 'NODE_PATH': subprocess.check_output(['npm', 'root', '-g']).decode().strip()}, capture_output=True, text=True)
print(r.stdout[-500:], r.stderr[-1500:])
o = json.load(open(out)); print(style, 'scenes', len(o['res']), 'errors', len(o['errs']), o['errs'][:3], 'pageerrs', o['pageerrs'][:3], 'chrome', o['chrome'])
