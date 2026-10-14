#!/bin/bash
# สร้าง check-numbers.html (ไฟล์เดียว เปิดในเบราว์เซอร์หรือ publish เป็น artifact ได้)
# ตัวคำนวณ PL2 คอมไพล์จาก ../reference/pl2-calc-v4.ts แบบไม่แก้อะไร (ห้ามแก้ไฟล์ต้นฉบับ)
set -e
cd "$(dirname "$0")"
mkdir -p .out/calc
tsc ../reference/pl2-calc-v4.ts --target ES2019 --module commonjs --outDir .out/calc --strict false --skipLibCheck
{ echo "/* Jarua PL2 Financial Calculation Module v4.2 — compiled unchanged from reference/pl2-calc-v4.ts */"
  echo "var JaruaCalc = (function(){ var exports = {};"; cat .out/calc/pl2-calc-v4.js; echo "return exports; })();"; } > .out/calc.js
{
cat <<'H'
<title>เช็กตัวเลขร้าน</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Sora:wght@500;600&display=swap">
H
echo "<style>"; cat src/style.css; echo "</style>"
echo '<div id="app"></div>'
echo "<script>"; cat .out/calc.js; echo "</script>"
echo "<script>"; cat src/data.js src/engine.js src/app.js; echo "</script>"
} > check-numbers.html
# หน้าสำหรับทดสอบในเครื่อง (มีโครง html ครบ + ตัวช่วยของ test)
{ echo '<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>[hidden]{display:none!important}</style></head><body>'
  cat check-numbers.html
  echo '<script>window.__sample=function(m){return JSON.parse(JSON.stringify(MODELS[m].sample));};</script></body></html>'; } > .out/test.html
echo "built check-numbers.html ($(wc -c < check-numbers.html) bytes)"
