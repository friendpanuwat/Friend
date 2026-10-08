# NITE RUN — ep.01 "loose change"

A 30-second vertical (1080×1920, 30 fps) 3D short, styled after the Y2K-streetwear animation references
(fisheye lenses, very low camera angles, ink-outlined characters, green-tinted night grading, film grain,
hand-drawn marker text). The characters, story, brands and music are all original.

**Story:** 1:12 AM. Milo skates up to the NITE OWL 24-hour shop, grabs his usual GLOW soda,
pays a sleepy cat cashier ($2.00 for a $1.99 drink, 1 cent change), and skates off into the night.

| Time | Shot |
|---|---|
| 0:00–0:03.7 | Establishing shot across the street, neon sign flickers, "1:12 AM" |
| 0:03.7–0:06.2 | Ground-level fisheye, the board rolls in and tail-stops (beat drops) |
| 0:06.2–0:08.7 | Low-angle hero shot under the neon, "YO MILO!" |
| 0:08.7–0:11.2 | Fisheye tracking shot down the snack aisle |
| 0:11.2–0:13.7 | POV from inside the fridge: door opens, hand takes the can |
| 0:13.7–0:16.2 | Ink-outlined close-up, smirk, "the usual." |
| 0:16.2–0:18.7 | Cat cashier yawns, can + coins on the counter |
| 0:18.7–0:20.0 | Register screen insert, "1 cent. nice." |
| 0:20.0–0:23.7 | Tracking shot skating away, cracks the can ("PSSHT"), drinks |
| 0:23.7–0:27.5 | Crane up over the empty street, fade |
| 0:27.5–0:30.0 | Title card "NITE RUN" |

Every cut lands on the beat of the original 96 BPM lo-fi track (bar = 2.5 s).

## How it's made
- `js/` — Three.js scene: characters built from primitives with an inverted-hull ink outline
  (`milo.js`, `cat.js`), procedural canvas textures (`env_tex.js`), the street (`exterior.js`),
  the shop (`interior.js`), the shot list (`film.js`), hand-drawn SVG text with a "boil" effect (`overlay.js`)
  and the post pass: fisheye, chromatic aberration, colour grade, vignette, grain (`post.js`).
- `render.js` — renders frames deterministically in headless Chromium (Playwright) and pipes them to ffmpeg.
- `audio.py` — synthesizes the score and all sound effects (numpy/scipy), mastered to -14 LUFS.
- `build.sh` — full build → `out/nite_run_hq.mp4` (master) and `out/nite_run.mp4` (chat-sized).

Preview stills: `node render.js --preview 4.5,12.6,17.3` → `out/prev.jpg`.

Fonts: Permanent Marker (Apache 2.0), Bangers and VT323 (SIL OFL) — licences in `fonts/`.
