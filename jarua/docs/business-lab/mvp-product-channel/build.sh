#!/bin/bash
# สร้าง product-channel.html (ไฟล์เดียว เปิดในเบราว์เซอร์หรือ publish เป็น artifact ได้)
# ใช้ร่วมกับตัวที่ 1: ตัวคำนวณ PL2 (คอมไพล์จาก ../reference/pl2-calc-v4.ts แบบไม่แก้อะไร) · ข้อมูลร้านและหน้าตาจาก ../mvp-check-numbers/src (อ่านอย่างเดียว)
set -e
cd "$(dirname "$0")"
P1=../mvp-check-numbers/src
mkdir -p .out/calc
tsc ../reference/pl2-calc-v4.ts --target ES2019 --module commonjs --outDir .out/calc --strict false --skipLibCheck
{ echo "/* Jarua PL2 Financial Calculation Module v4.2 — compiled unchanged from reference/pl2-calc-v4.ts */"
  echo "var JaruaCalc = (function(){ var exports = {};"; cat .out/calc/pl2-calc-v4.js; echo "return exports; })();"; } > .out/calc.js
{
cat <<'H'
<title>กำไรรายสินค้าและรายช่องทาง</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Sora:wght@500;600&display=swap">
H
echo "<style>"; cat $P1/style.css src/style.css; echo "</style>"
echo '<div id="app"></div>'
echo "<script>"; cat .out/calc.js; echo "</script>"
echo "<script>"; cat ../shared/lab-shop.js $P1/data.js $P1/engine.js src/profit.js src/app.js; echo "</script>"
} > product-channel.html
# หน้าสำหรับทดสอบในเครื่อง (มีโครง html ครบ)
{ echo '<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>[hidden]{display:none!important}</style></head><body>'
  cat product-channel.html
  echo '</body></html>'; } > .out/test.html
echo "built product-channel.html ($(wc -c < product-channel.html) bytes)"
