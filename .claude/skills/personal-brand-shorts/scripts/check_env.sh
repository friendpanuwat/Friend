#!/usr/bin/env bash
# Verify the machine can run the skill. Prints OK/MISSING per dependency.
ok=1
for b in ffmpeg ffprobe node python3; do if command -v $b >/dev/null; then echo "OK      $b"; else echo "MISSING $b"; ok=0; fi; done
if NODE_PATH="${NODE_PATH:-$(npm root -g 2>/dev/null)}" node -e "require('playwright')" 2>/dev/null; then echo "OK      playwright (node)"; else echo "MISSING playwright  → npm i -g playwright && npx playwright install chromium"; ok=0; fi
node -e "console.log(typeof Intl.Segmenter==='function'?'OK      Intl.Segmenter':'MISSING Intl.Segmenter (Node 16+)')"
# background removal (layers.py): numpy, opencv, onnxruntime, LiteRT — try to install if missing
for m in "numpy numpy" "cv2 opencv-python-headless" "onnxruntime onnxruntime" "ai_edge_litert ai-edge-litert"; do set -- $m
  python3 -c "import $1" 2>/dev/null || pip install -q "$2" >/dev/null 2>&1 || pip install -q --break-system-packages "$2" >/dev/null 2>&1
  if python3 -c "import $1" 2>/dev/null; then echo "OK      python: $1"; else echo "MISSING python: $1  → pip install $2"; ok=0; fi
done
[ $ok = 1 ] && echo "READY" || { echo "NOT READY"; exit 1; }
