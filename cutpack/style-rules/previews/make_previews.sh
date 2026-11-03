#!/usr/bin/env bash
# CutPack: stills that compare the open style decisions (cutpack/style-rules/editorial.md, section 1.1),
# rendered with the real engines of talking-head-editorial / talking-head-editorial-overlay.
# The skills are only read: every variant is a brand.json or a few lines prepended to a copy of the example timeline.
# usage: make_previews.sh [work_dir]   → writes 1_font.jpg 2_color.jpg 3_glow_glass.jpg 3_capsule.jpg next to this script
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../.." && pwd)"
ED="$ROOT/.claude/skills/talking-head-editorial"
OV="$ROOT/.claude/skills/talking-head-editorial-overlay"
W="$(mkdir -p "${1:-/tmp/cutpack-previews}" && cd "${1:-/tmp/cutpack-previews}" && pwd)"
export NODE_PATH="${NODE_PATH:-$(npm root -g)}"

# 1) clean talking-head source: the raw "BEFORE" half of the product demo, label cropped off, 1080×1920
[ -s "$W/src.mp4" ] || ffmpeg -y -loglevel error -i "$ROOT/product/docs/before_after.mp4" -t 43.5 \
  -vf "crop=540:860:0:100,scale=-2:1920:flags=lanczos,crop=1080:1920" -c:v libx264 -crf 16 -preset fast -c:a aac "$W/src.mp4"
[ -d "$W/base/src_frames" ] || HOLD=1.0 bash "$ED/scripts/pipeline.sh" "$W/base" "$W/src.mp4" frames >/dev/null

# 2) Prompt (OFL, Google Fonts) for the font comparison
mkdir -p "$W/prompt"
for f in "Regular -W__XJnvUD7dzB26Zw" "SemiBold -W_8XJnvUD7dzB2Cv_44bg" "Bold -W_8XJnvUD7dzB2C2_84bg"; do set -- $f
  [ -s "$W/prompt/Prompt-$1.ttf" ] || curl -sSfL -o "$W/prompt/Prompt-$1.ttf" "https://fonts.gstatic.com/s/prompt/v12/$2.ttf"
done

brand() {  # brand <file> <accent> <key_sans> <key_serif> <lead> <card_sans>
  cat > "$1" <<EOF
{"accent": "$2", "navy": "#14213D", "cream": "#F2EDE2", "ink": "#000000", "pill": "#1B2A52",
 "fonts": {"key_sans": "$3", "key_serif": "$4", "lead": "$5", "card_sans": "$6"}, "sfx_db": -17}
EOF
}
MITR=("$ED/assets/fonts/Mitr-Bold.ttf" "$ED/assets/fonts/Sriracha-Regular.ttf" "$ED/assets/fonts/Mitr-Regular.ttf" "$ED/assets/fonts/Mitr-SemiBold.ttf")
PROMPT=("$W/prompt/Prompt-Bold.ttf" "$W/prompt/Prompt-Bold.ttf" "$W/prompt/Prompt-Regular.ttf" "$W/prompt/Prompt-SemiBold.ttf")

variant() {  # variant <name> <skill_dir> <timeline.js> <accent> <font set name> <prepend js> <times>
  local P="$W/$1" SK="$2"; mkdir -p "$P"; ln -sfn "$W/base/src_frames" "$P/src_frames"
  local -n F="$5"; brand "$P/brand.json" "$4" "${F[@]}"
  { printf '%s\n' "$6"; cat "$3"; } > "$P/timeline.js"
  if [ -n "${SUB:-}" ]; then sed -i "$SUB" "$P/timeline.js"; fi
  python3 "$SK/scripts/build_scene.py" "$P" >/dev/null
  rm -rf "$P/prev"; node "$SK/scripts/render.js" "$P" preview "$7"
}

EDT="$ED/examples/timeline_mg.js"; OVT="$OV/examples/timeline_example.js"
T_FONT="1.25,3.6,4.6,14.6"; T_COLOR="1.25,4.6,14.6"; T_GLOW="4.6,9.5,32.6,41.6"; T_CHIP="14.0,14.6,17.1,37.4"

variant ed_base   "$ED" "$EDT" "#DDFF45" MITR   "" "$T_FONT,$T_GLOW"
variant ed_prompt "$ED" "$EDT" "#DDFF45" PROMPT "" "$T_FONT"
for a in FFD60A FF8A3D 4CD7F6; do variant "ed_$a" "$ED" "$EDT" "#$a" MITR "" "$T_COLOR"; done
# no purple glow, no frosted glass: glows become blue + navy, glass tiles become solid dark tiles, glass panels become navy
SUB="s/bg: 'glass'/bg: '#1D2740', color: '#fff'/g; s/style: 'glass'/style: 'navy'/g" \
variant ed_flat   "$ED" "$EDT" "#DDFF45" MITR \
  "const __mood = mood; mood = (c, o = {}) => __mood(c, Object.assign({}, o, {accent: '#1F4FD8', blue: '#14213D'}));" "$T_GLOW"
variant ov_base   "$OV" "$OVT" "#DDFF45" MITR   "" "$T_CHIP"
# capsule chips → rounded rectangles
variant ov_square "$OV" "$OVT" "#DDFF45" MITR \
  "const __chipW = chipW; chipW = (...a) => { const c = __chipW(...a); c.style.borderRadius = '18px'; return c; };" "$T_CHIP"

# 3) sheets
node "$HERE/compose.js" "$W" "$HERE" "$ED/assets/fonts"
ls -la "$HERE"/*.jpg
