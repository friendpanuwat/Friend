# CutPack engine

Shared core used by every style. It's a copy of the `talking-head-editorial` skill engine, so CutPack edits don't touch Friend's personal skills, and skill edits don't touch CutPack.

## Layout

| Folder | What's in it |
|---|---|
| `core/` | Copied from `.claude/skills/talking-head-editorial` on 2026-11-03: `engine_head.html`, `engine_tail.html`, `render.js`, `sfx.py`, `pipeline.sh`, `brand.default.json`, fonts (Mitr, Sriracha) and `licenses/`. Every file except `build_scene.py` is byte-for-byte identical to the original |
| `core/build_scene.py` | Rewritten from the skill: injects the full icon set into `ICONS` (the skill's icons win where names clash, so they look identical) and inserts the style pack before `timeline.js` |
| `icons/` | `lucide.json`: all 1,539 Lucide icons, `lucide-static` 0.460.0 from npm, fetched 2026-11-03, plus `LICENSE-lucide.txt` (ISC) |
| `styles/<style>/` | Style pack: `motion.js` (locked motions) and `parts/*.js` (library parts) |

## Usage

`bash core/pipeline.sh <work_dir> <clip.mp4> frames|build|preview|render|audio|encode`, same as the skill. The build step calls `core/build_scene.py`, which uses the `editorial` style by default.

## Checked

On 2026-11-03 I rendered the skill's example timeline (`examples/timeline_mg.js`) on Friend's sample clip with both the skill engine and this one. All 3 test frames were pixel-identical (PSNR = inf), and icons that only exist in the full set (utensils, dumbbell, graduation-cap, heart-pulse, plane, house) render correctly.
