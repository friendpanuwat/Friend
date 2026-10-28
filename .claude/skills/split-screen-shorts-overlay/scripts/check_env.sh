#!/usr/bin/env bash
# Verify the machine can run the skill. Prints OK/MISSING per dependency and installs the two Python packages itself
# (onnxruntime + pillow from the package index — allowed under "Limited" network with package managers on).
ok=1
for b in ffmpeg ffprobe node python3; do if command -v $b >/dev/null; then echo "OK      $b"; else echo "MISSING $b"; ok=0; fi; done
if NODE_PATH="${NODE_PATH:-$(npm root -g 2>/dev/null)}" node -e "require('playwright')" 2>/dev/null; then echo "OK      playwright (node)"; else echo "MISSING playwright  → npm i -g playwright && npx playwright install chromium"; ok=0; fi
node -e "console.log(typeof Intl.Segmenter==='function'?'OK      Intl.Segmenter':'MISSING Intl.Segmenter (Node 16+)')"
if ! python3 -c "import onnxruntime, PIL, numpy" 2>/dev/null; then
  pip install -q onnxruntime pillow numpy 2>/dev/null || pip install -q --break-system-packages onnxruntime pillow numpy 2>/dev/null || true
fi
if python3 -c "import onnxruntime, PIL, numpy" 2>/dev/null; then echo "OK      onnxruntime (cut-outs)"
else echo "MISSING onnxruntime → cut-outs of the speaker unavailable: draw every scene without them (references/core.md · ถ้าไดคัทไม่ได้)"; fi
[ $ok = 1 ] && echo "READY" || { echo "NOT READY"; exit 1; }
