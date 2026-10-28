# Graphics — how to write `graphics.js` and `timeline.js`

Both skills share the same engine; `assets/MODE` sets the layout (`split` or `overlay`). You write two files per clip:
`graphics.js` (one function per section of the clip) and `timeline.js` (when everything happens). Read `core.md` first.

## The surface: `area(t0, t1)`
Every graphic starts with `const s = area(t0, t1);` — it returns the drawing surface for that time window and does the layout work:

| | split-screen-shorts | split-screen-shorts-overlay |
|---|---|---|
| what `area` also does | turns the split screen on for `[t0, t1)` (straight cuts in and out) | lays the surface **behind the head** (layer B + matte) |
| surface | 1080 design px wide; keep content in **x 120–960, y 0–700** | 1080 × 430 design px; draw ONE landscape screen at **`screen(s, 160, 0, 760, 430, t)`** |
| on screen | y 245 → ~945, full safe width | y 250 → ~700, ~800 px wide; the head covers the lower middle — keep key items up top / at the sides |

Back-to-back `area` windows join into one panel stretch (no cut between them). A gap between two windows = a full-screen beat.

## `timeline.js` — what you call
```js
theme('white');                                   // first line (page tokens; recolor.py paints them in the theme)
push(9.55, 11.43, 1.08);                          // a slow camera push — full-screen beats only
title(-.2, 2.0, [['เวลาลูกค้า', -.2], ['ทักมาถาม', .56]], [['แล้วก็', 1.77], ['หายไป', 1.85]]);   // the 2-line headline = THE subtitle
gAsk(-.2, 3.6);                                   // your graphic for this stretch (graphics.js)
say(2.02, 2.30, 'หลายคน');                         // spoken words (hidden while a title is up; shown on full-screen beats)
bigWord(9.57, 11.4, 'ปัญหา', {behind: true, size: 300});   // one big word on a full-screen beat: behind the head, or in front by the hands
```
- `title(t0, t1, line1, line2)` — each word is `[word, timeItIsSaid]`; words light up as they are said. Words only from the transcript.
- `say(t0, t1, text, {key})` — splits Thai into short word groups by itself.
- Full-screen beats: `bigWord` and/or `say`; nothing else. Keep them few (core.md).

## The kit (use these; stock colours are fine — recolor.py turns everything into the theme)
**Screens and detail** (`art_screens.js`)
- `screen(s, x, y, w, h, t, {bg, dark, chrome})` — a rounded "real screen" with timecode, dots and a scrubber.
- `areaChart(el, x, y, w, h, t, {color, dir: 'up'|'down', dur})` — a line that draws itself over a soft fill (no numbers).
- `metrics(el, x, y, w, t, {colors})` — a row of metric slots (bars, no figures).
- `sphere(el, cx, cy, R, t0, {color: 'r,g,b', burst, horizon})` — a particle sphere; `burst` = it scatters and is gone.
- `select(el, x, y, w, h, t)` — an editor selection box with handles. `note(el, x, y, 'word', t, {to: {x, y}})` — a hand-written note + arrow.
- `appIcon(el, x, y, size, t, {glyph})`, `wire(el, [x0, y0], [x1, y1], t)` — node-graph pieces.
- `stickerBox`, `starburst`, `hazard` — sticker-style illustration bits. `dotGlyph(el, '?', cx, cy, size, t)` — a symbol built from dots.
- `layers(el, x, y, w, rows, t)` — an editor layer panel; a row with `off: t` gets switched off and struck.

**Pictures** (`art_icons.js`, drawn into any box): `artVanish` (a chat bubble that dissolves), `artTag` (price tag), `artScale` (a balance
that can't settle), `artBoxQ` (a box with orbiting ?), `artHover` (a pointer that won't click), `artPeople` (people fading one by one),
`artTagRain`, `artCross`, `artAnswer` (a bubble with a tick), `artTarget` (a dart that lands).

**Basics** (`kit.js`, `ui.js`, `tiles.js`): `icon(el, 'tag'|'chat'|'box'|'balance'|'cursor'|'check'|'cross'|'down'|'up', cx, cy, size, t)`,
`pop(el, t)`, `div(css, parent, html)`, `A(el, keyframes, t, dur, {e})`, `tile`, `big`, `dash`, `orb`, `dotfield`, `coverflow`, `chips`.

## Design rules (short)
- Each section: 1–3 objects that SHOW the sentence (a tag for "แพง", a balance for "ลังเล", a chat that vanishes for "หายไป").
- Pictures over words; a spoken word on a sticker/note at most.
- Things move when the word is said (pass the word's time). Hold still → nothing on screen sits frozen for more than ~2 s.
- Overlay: one landscape screen per section, key content in the top half or at the sides.
- Check every section with `preview` before rendering.
