// Bundles src/ into single-file HTML: dist/runway.html (standalone) and dist/artifact.html (fragment for hosting)
const fs = require('fs'), path = require('path');
const L = require('./files');
const SRC = path.join(__dirname, '..', 'src');
const read = f => fs.readFileSync(path.join(SRC, f), 'utf8');
const js = [].concat(L.core, L.models, L.ui, L.modelUI, L.boot).map(f => '/* ---- ' + f + ' ---- */\n' + read(f)).join('\n');
const css = L.css.map(read).join('\n');
const fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600;700&display=swap">';
const body = '<div id="app"></div><div id="modal"></div><div id="toasts" class="toasts" aria-live="polite"></div>';
const safeJs = js.replace(/<\/script/gi, '<\\/script');
const fragment = `<title>RUNWAY</title>\n<meta name="description" content="เกมจำลองการปั้นสตาร์ทอัพแบบสมจริง">\n${fonts}\n<style>\n${css}\n</style>\n${body}\n<script>\n${safeJs}\n</script>\n`;
const full = `<!doctype html>\n<html lang="th">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>RUNWAY — เกมจำลองการทำธุรกิจ</title>\n${fonts}\n<style>\n${css}\n</style>\n</head>\n<body>\n${body}\n<script>\n${safeJs}\n</script>\n</body>\n</html>\n`;
const out = path.join(__dirname, '..', 'dist');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'runway.html'), full);
fs.writeFileSync(path.join(out, 'artifact.html'), fragment);
console.log('built', (full.length / 1024).toFixed(0) + 'KB');
