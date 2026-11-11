#!/usr/bin/env bash
# Verify the machine can run the skill. Prints OK/MISSING per dependency.
ok=1
for b in ffmpeg ffprobe node; do if command -v $b >/dev/null; then echo "OK      $b"; else echo "MISSING $b"; ok=0; fi; done
if NODE_PATH="${NODE_PATH:-$(npm root -g 2>/dev/null)}" node -e "require('playwright')" 2>/dev/null; then echo "OK      playwright (node)"; else echo "MISSING playwright  → npm i -g playwright && npx playwright install chromium"; ok=0; fi
ffmpeg -hide_banner -encoders 2>/dev/null | grep -q libx264 && echo "OK      libx264" || { echo "MISSING ffmpeg libx264"; ok=0; }
SK="$(cd "$(dirname "$0")/.." && pwd)"
for f in InterDisplay-Bold.otf Anuphan-VF.ttf; do [ -f "$SK/assets/fonts/$f" ] && echo "OK      font $f" || { echo "MISSING font $f"; ok=0; }; done
[ $ok = 1 ] && echo "READY" || { echo "NOT READY"; exit 1; }
