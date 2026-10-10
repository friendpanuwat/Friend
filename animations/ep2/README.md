# NITE SHIFT — ep.02

15-second horizontal (1920×1080, 30 fps) 3D short in the same NITE OWL world as ep.01 (`../nite-run`),
starring the scanned character from the user's zip as the night-shift clerk.

**Story:** 3:04 AM. The clerk is dozing behind the counter (BOSS the cat asleep next to him).
The door chimes, he jolts awake, a skateboard rolls in by itself and stops at the counter.
"...milo?" Outside, Milo comes running after his board. Title: NITE SHIFT.

| Time | Shot |
|---|---|
| 0:00–0:02.5 | Exterior across the street, "3:04 AM" |
| 0:02.5–0:05 | Counter shot: the clerk nods off, "hour 7 of 8" |
| 0:05–0:07.5 | *ding* — he jolts awake and looks to the door |
| 0:07.5–0:10 | Floor-level: the empty board rolls in through the door |
| 0:10–0:12.5 | He follows it, looks at us, shrugs, "...milo?" |
| 0:12.5–0:15 | Milo runs to the door outside, title "NITE SHIFT ep.02" |

## The scanned character
The scan is a static mesh (no rig). `js/clerk.js` animates it in a vertex shader: the head rotates about a
measured neck pivot (blend band below the chin), the chest breathes and the shoulders shrug; the ink-outline
hull uses the same deformation. The scan's face has little geometric detail, so the shots stay chest-up.

Put the zip's files in `model/` as `char.obj` (with `mtllib char.mtl`), `char.mtl`, `texture_20250901.png`.

Build: `bash build.sh` → `out/nite_shift.mp4` (chat size) and `out/nite_shift_hq.mp4`.
Engine, fonts and texture code are shared with ep.01 (copied here so the project is self-contained).
