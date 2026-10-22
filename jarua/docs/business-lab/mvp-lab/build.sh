#!/bin/bash
# สร้าง Business Lab ทั้งชุดใน site/ (publish เป็น artifact เดียว หลายหน้า)
#   site/index.html          หน้ารวม Business Lab (หน้าหลักของ artifact — ไม่มีโครง html เพราะระบบใส่ให้)
#   site/check-numbers.html  ตัวที่ 1 "เช็กตัวเลขร้าน" (หน้าแยก มีโครง html ของตัวเอง)
#   site/big-decisions.html  ตัวที่ 3 "เช็กก่อนตัดสินใจเรื่องใหญ่" (หน้าแยก มีโครง html ของตัวเอง)
#   site/product-channel.html ตัวที่ 4 "กำไรรายสินค้าและรายช่องทาง" (หน้าแยก มีโครง html ของตัวเอง)
#   site/before-opening.html  ตัวที่ 2 "เช็กก่อนเปิดร้าน" (หน้าแยก มีโครง html ของตัวเอง)
# ตัวที่ 1 2 3 และ 4 สร้างจากโฟลเดอร์ของตัวเอง (ไม่แก้ไฟล์ของมัน) · ตัวเลขร้านชุดกลางอยู่ใน ../shared/lab-shop.js
set -e
cd "$(dirname "$0")"
../mvp-check-numbers/build.sh
../mvp-big-decisions/build.sh
../mvp-product-channel/build.sh
../mvp-before-opening/build.sh
mkdir -p site
P1=../mvp-check-numbers
{
cat <<'H'
<title>Business Lab</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Sora:wght@500;600&display=swap">
H
echo "<style>"; cat $P1/src/style.css; echo "</style>"
echo "<script>"; cat ../shared/lab-shop.js; echo "</script>"
cat src/hub.html
} > site/index.html
# หน้าของเครื่องมือ: โครง html ครบ + บอกเครื่องมือว่ามีหน้ารวม (ปุ่มกลับหน้า Business Lab)
page() {
  { echo '<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
    echo '<style>[hidden]{display:none!important}</style><script>var LAB_HUB = "index.html";</script></head><body>'
    cat "$1"
    echo '</body></html>'; } > "$2"
}
page ../mvp-check-numbers/check-numbers.html site/check-numbers.html
page ../mvp-big-decisions/big-decisions.html site/big-decisions.html
page ../mvp-product-channel/product-channel.html site/product-channel.html
page ../mvp-before-opening/before-opening.html site/before-opening.html
# หน้ารวมสำหรับทดสอบในเครื่อง (มีโครง html ครบ)
mkdir -p .out
{ echo '<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>[hidden]{display:none!important}</style></head><body>'
  cat site/index.html
  echo '</body></html>'; } > .out/index.html
cp site/check-numbers.html site/big-decisions.html site/product-channel.html site/before-opening.html .out/
echo "built site/ ($(du -ch site/*.html | tail -1 | cut -f1))"
