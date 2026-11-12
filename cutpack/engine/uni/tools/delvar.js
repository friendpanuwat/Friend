// delvar.js <scene file> <cat:id> … (node tools/delvar.js scenes/lego_r7.js B04:belt) — removes top-level R3.both(cat, id, …) / VARIANT(cat, id, …) statements (with their leading comments)
const ts = require(require('child_process').execSync('npm root -g').toString().trim() + '/typescript'), fs = require('fs');
const [file, ...keys] = process.argv.slice(2); const want = new Set(keys);
const src = fs.readFileSync(file, 'utf8'); const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
const cuts = [];
for (const st of sf.statements) {
  if (!ts.isExpressionStatement(st) || !ts.isCallExpression(st.expression)) continue;
  const c = st.expression, name = c.expression.getText(sf), a = c.arguments;
  if (!['R3.both', 'VARIANT', 'SMALLV'].includes(name) || a.length < 2 || !ts.isStringLiteral(a[0]) || !ts.isStringLiteral(a[1])) continue;
  const k = a[0].text + ':' + a[1].text;
  if (want.has(k)) {
    // keep a category header (/* ===== … ===== */) that sits in the leading comments: it belongs to the section, not the variant
    let s = st.getFullStart(); const lead = src.slice(s, st.getStart(sf)); const h = lead.lastIndexOf('================= */');
    if (h >= 0) s += h + '================= */'.length;
    cuts.push([s, st.getEnd(), k]); want.delete(k);
  }
}
if (want.size) { console.error('not found in', file, [...want]); process.exit(1); }
let out = src; for (const [s, e] of cuts.sort((x, y) => y[0] - x[0])) out = out.slice(0, s) + out.slice(e);
fs.writeFileSync(file, out); console.log(file, cuts.map(c => c[2] + ' ' + (c[1] - c[0]) + 'B').join(', '));
