#!/bin/bash
# โหลดฟอนต์ Google มาเก็บไว้ใน .out/fontcache เพื่อให้ภาพหน้าจอตอนทดสอบเป็นภาษาไทยจริง
set -e
cd "$(dirname "$0")/.." && mkdir -p .out/fontcache && cd .out/fontcache
curl -sS -A "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36" \
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=Sora:wght@500;600&display=swap' -o fonts.css
grep -o 'https://fonts.gstatic.com[^)]*' fonts.css | sort -u | while read u; do f=$(echo -n "$u" | md5sum | cut -c1-16).woff2; [ -f "$f" ] || curl -sS "$u" -o "$f"; done
echo "fonts: $(ls *.woff2 | wc -l)"
