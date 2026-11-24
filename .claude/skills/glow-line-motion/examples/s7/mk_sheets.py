# writes sheet-<cat>-<n>.html: one idea of one category in all 7 sizes, one data line per sheet (dashed frame = the size's box)
import sys
cat, idea, js, sets = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]   # sets: "SAMPLES:0" "STRESS:1" ...
for n, st in enumerate(sets, 1):
    arr, ix = st.split(':')
    open(f'sheet-{cat.lower()}-{n}.html', 'w').write(f'''<!doctype html>
<html><head><meta charset="utf-8"><title>{cat} 7 sizes {n}</title>
<script src="../../assets/glowline.js"></script><script src="{js}"></script></head>
<body><script>
GL.run(() => {{
  GL.stage({{ w: 1800, h: 2340 }});
  const K = GL.cats.{cat}, d = K.{arr}[{ix}], s = .8, f = v => +v.toFixed(1);
  GL.text('{cat} · {idea} · 7 ขนาด', {{ y: 60, size: 44, ls: 3, color: GL.C.kicker, glow: false }});
  GL.text('“' + d.say + '”', {{ y: 108, size: 30, weight: 500, color: GL.C.sub, glow: false }});
  /* where each size sits on the sheet: centre x, top y */
  const AT = {{ 1: [470, 170], 2: [470, 470], 5: [470, 1000], 6: [1340, 170], 3: [1340, 1180], 4: [1130, 1700], 7: [1560, 1700] }};
  for (const k of [1, 2, 3, 4, 5, 6, 7]) {{ const [w, h] = K.CANV(k), [x, y0] = AT[k], cy = y0 + h * s / 2;
    GL.art(p => {{ const e = p.rect(f(-w * s / 2), 0, f(w * s), f(h * s), {{ rx: 6, sw: 1.6, stroke: GL.C.mute, fill: 'none', dur: .01 }}); e.setAttribute('stroke-dasharray', '10 10'); }}, {{ x, y: y0, filter: 'none' }});
    GL.text('ขนาด ' + k + ' · ' + K.SZ[k].join(' × '), {{ x, y: y0 - 12, size: 22, weight: 700, color: GL.C.mute, glow: false }});
    K.draw('{idea}', k, d, {{ x, y: cy, s, at: .3 + k * .03, hit: 1.5 }}); }}); }}
  GL.finish({{ hold: 2.4, out: true, stagger: .02 }});
}});
</script></body></html>''')
