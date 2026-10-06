# jarua-start — "เริ่มทำไปก่อน + Jarua" (85.8 s)

Source files for the edit made with the `talking-head-motion` skill.

- `timeline.js` — full timeline. Project overrides at the top:
  - no colour grade (raw video; tone, vignette, grain and bloom layers off)
  - `bscene()` replaces the navy/aurora scene background with the original clip at the same moment, blurred and dimmed slightly for legibility
  - Jarua walkthrough (54.0–71.98 s): screen recording in a phone frame, speech-synced time map, 4-step tracker
- `brand.json` — default v9 palette, grain 0
- `transcript.txt` / `chunks.json` — transcript and timed chunks

Rebuild: put the talking clip at `<P>/input.mp4`, extract the screen recording to `<P>/scr_frames/f%05d.jpg`
(`ffmpeg -i screen.mp4 -vf "fps=30,scale=720:1280" -q:v 2 scr_frames/f%05d.jpg`), copy these files into `<P>`, then run
`pipeline.sh <P> <P>/input.mp4 all`.
