#!/bin/bash
# รวมเนื้อหาข้อเสนอกับหน้าตาของเครื่องมือจริง → proposal.html (publish เป็น artifact)
set -e
cd "$(dirname "$0")"
{
cat <<'H'
<title>เช็กก่อนเปิดร้าน ข้อเสนอ</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Sora:wght@500;600&display=swap">
H
echo "<style>"; cat ../mvp-check-numbers/src/style.css ../mvp-product-channel/src/style.css proposal.css; echo "</style>"
cat proposal-src.html
} > proposal.html
echo "built proposal.html ($(wc -c < proposal.html) bytes)"
