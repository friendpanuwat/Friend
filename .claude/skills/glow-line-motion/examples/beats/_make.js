// Writes one scene per beat (Bxx.html) + all.html (every beat in sequence) from _spec.js
const fs = require('fs'), path = require('path'), spec = require('./_spec.js');
const head = (t) => `<!doctype html>\n<html><head><meta charset="utf-8"><title>${t}</title>\n<script src="../../assets/glowline.js"></script></head>\n<body><script>\n`;
const tail = `</script></body></html>\n`;
for (const [code, { say, d }] of Object.entries(spec))
  fs.writeFileSync(path.join(__dirname, code + '.html'), head(code) + `/* ${code} — "${say}" */\nGL.run(() => {\n  GL.stage();\n  GL.beat('${code}', ${JSON.stringify(d, null, 2).replace(/\n/g, '\n  ')});\n});\n` + tail);
const all = Object.entries(spec).map(([c, { d }]) => `  t = GL.page(t, at => GL.beat('${c}', ${JSON.stringify(d)}, { at }), { hold: .9${c === 'B21' ? ', out: false' : ''} });`).join('\n');
fs.writeFileSync(path.join(__dirname, 'all.html'), head('all beats') + `/* all 21 beats one after another */\nGL.run(() => {\n  GL.stage();\n  let t = .3;\n${all}\n});\n` + tail);
