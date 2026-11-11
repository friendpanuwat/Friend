# glowline.js API

Scene = `scene.html` ที่โหลด `glowline.js` แล้วเรียกทุกอย่างใน `GL.run(() => { ... })`
(`run` รอฟอนต์โหลดก่อน เพื่อให้วัดความกว้างตัวอักษรถูก แล้วเรียก `GL.finish()` ให้เองถ้าไม่ได้เรียก).
หน่วยเวลา = วินาที. หน่วยระยะ = px ของ stage. ทุกฟังก์ชันเลย์เอาต์ **คืนเวลาที่มันจบ** เอาไปต่อคิวได้.

## โครง scene

```js
GL.run(() => {
  GL.stage({ w: 1080, h: 1920 });                 // 9:16 (ค่าเริ่ม) · {w:1080,h:1080} · {w:1920,h:1080}
  const top = GL.title({ kicker: '3 WAYS TO', main: 'SIMPLIFY', sub: 'ตัดให้เหลือแค่สิ่งที่จำเป็น' });
  const end = GL.rows([{ label: '1. INBOX', pair: 'inbox' }, ...], { top });
  GL.finish({ hold: 1.6 });                       // ค้างภาพสุดท้าย 1.6 วิ (ไม่ใส่ก็ได้)
});
```

## Stage / title / text

| ฟังก์ชัน | ตัวเลือก (ค่าเริ่ม) | หมายเหตุ |
|---|---|---|
| `GL.stage(o)` | `w 1080`, `h 1920`, `glow 1` (คูณความฟุ้ง), `seed` | เรียกครั้งเดียวก่อนอย่างอื่น. `GL.W`, `GL.H` = ขนาด |
| `GL.title(o)` → y ล่างสุด | `kicker`, `main`, `sub`, `top 40`, `at .05`, `size 142` | kicker ตัวห่าง 50px · main ตัวใหญ่เรืองแสง (ย่อเองถ้ายาว) · sub ไทยสีเทา 34px. ไม่มี sub → คืน ~280 |
| `GL.text(str, o)` | `x W/2`, `y`, `size 56`, `at 0`, `dur .45`, `rise`, `color`, `weight 700`, `anchor 'middle'`, `ls 0`, `maxW W-80`, `glow true`, `lh 1.3` | `\n` = ขึ้นบรรทัดใหม่. ยาวเกิน `maxW` → ย่อฟอนต์อัตโนมัติ. ขึ้นแบบ fade + ลอยขึ้น |
| `GL.caption(str, o)` | `y H-300`, `at`, `size 46` | ประโยคเทาใต้ภาพ อยู่เหนือแถบแคปชันของ TikTok |
| `GL.hline(y, at, {x1, x2})` / `GL.vline(x, y1, y2, at)` | | เส้นแบ่งสีเทา วาดตัวเอง |
| `GL.finish({hold})` | `hold 1.6` | ตั้ง `window.DURATION` |

## เลย์เอาต์ก่อน→หลัง

item ของ rows / grid / hero = `{ label, pair: 'inbox' }` หรือ `{ label, messy(p){…}, clean(p){…} }` (วาดสดใน item เลย).

| ฟังก์ชัน | ตัวเลือก (ค่าเริ่ม) | พฤติกรรม |
|---|---|---|
| `GL.rows(items, o)` | `top 340`, `bottom H`, `at .9`, `gap .15`, `arrow true`, `rule true`, `labelSize 56`, `dim .42`, `ts 1` | แถวละข้อ: ป้าย → ฝั่งรก (ซ้าย) → ลูกศร → ฝั่งเรียบ (ขวา) → ฝั่งรกหรี่ → เรืองแสง. ข้อต่อไปเริ่มเมื่อข้อก่อนเสร็จ. ภาพย่อเองตามความสูงแถว (≤ 4 แถว/จอ 9:16 ถึงจะชัด) |
| `GL.grid(items, o)` | `cols 2`, `top 340`, `bottom H`, `at .9`, `stagger .55`, `labelSize auto`, `dim .6`, `ts .8` | โปสเตอร์หลายช่อง (ซ้อนเวลากันทุก `stagger` วิ). 12 ช่อง = ภาพยังชัด, 20 ช่อง = ภาพเล็กแบบรูปอ้างอิง (ลด `stagger` เป็น .35) |
| `GL.hero(item, o)` | `at .4`, `y H*.5`, `label`, `caption`, `swap true`, `scale auto`, `ts 1` | ข้อเดียวเต็มจอ: ฝั่งรกวาด → จางหาย → ฝั่งเรียบวาดที่เดิม. `swap:false` = วางซ้าย→ขวาแทน. `caption` = ข้อความไทยใต้ภาพ |
| `GL.steps(items, o)` | `top 340`, `bottom H`, `at .9`, `gap .1`, `rule true`, `ts 1` | item = `{ icon, label, sub }`; `icon` = ชื่อ icon, ชื่อ pair (ใช้ฝั่งเรียบ) หรือ `p => {…}` |
| `GL.page(at, at => layout(…), o)` | `hold 1.2`, `out true` | ห่อเลย์เอาต์เป็นหน้า: จบแล้วค้าง `hold` วิ แล้วจางออกก่อนหน้าถัดไป. คืนเวลาเริ่มหน้าถัดไป. หน้าสุดท้ายใส่ `{ out: false }` |

## เลย์เอาต์อื่น (ไม่ใช่ก่อน→หลัง) — วิธีใช้ละเอียดใน `scenes.md`

| ฟังก์ชัน | ตัวเลือก (ค่าเริ่ม) | พฤติกรรม |
|---|---|---|
| `GL.flow(items, o)` | `top 340`, `bottom H`, `at .9`, `dir 'zigzag'` (จอนอน `'right'`), `numbers true`, `connector`, `bend`, `gap .12`, `labelSize auto`, `ts 1` | ขั้นตอนต่อกันด้วยลูกศรที่วาดตัวเอง. item = `{ icon, label, sub }`. `dir`: `zigzag` · `down` · `right` |
| `GL.diagram({nodes, edges}, o)` | `top 340`, `bottom H`, `at .9`, `size auto`, `boxSize 40`, `labelSize 36`, `gap .05`, `edge {}` | โหนดวางที่ไหนก็ได้ + ลูกศร; โตทีละโหนดตามลำดับใน `nodes`. โหนด = `{ x, y, icon \| draw \| box: 'คำ' \| dot: true, label, scale, strong }`; edge = `[จาก, ไป, { label, style, bend, dash, both, head, via }]` |
| `GL.showcase(it, o)` | `top 340`, `bottom H-380`, `at .6`, `scale auto`, `stagger .55`, `labelSize 42` | สินค้าใหญ่กลางจอ + เส้นชี้ฟีเจอร์ทีละอัน. it = `{ draw, box: [w, h], callouts: [{ x, y, text, sub, side }], caption }` (x, y ของ callout = พิกัดในภาพ) |
| `GL.shots(list, o)` | `at .4`, `hold 1.3`, `top 200`, `bottom H-330`, `dots true`, `titleSize 92` | เล่าเป็นฉาก: วาด → ค้าง → จาง → ฉากต่อไป. shot = `{ draw \| icon, box, kicker, title, caption, hold, more(at, geo), glow }` |
| `GL.place(fn, o)` → `{wrap, g, end}` | `x W/2`, `y H/2`, `w W-120`, `h = w`, `box [400, 370]`, `at`, `filter 'glow'` | วางภาพให้กรอบ `box` พอดี w × h px (ไม่ต้องคิดสเกลเอง) |
| `GL.connect(x1, y1, x2, y2, o)` → เวลาจบ | ตัวเลือกเดียวกับ `kit.connect` + `at` (เวลาคลิป) | ลูกศรบนเวที: `style` straight / curve / swoosh / elbow / loop, `dash`, `head`, `both`, `gap` |

ตัวอย่างหลายหน้า (`examples/pages-six.html`):
```js
let t = GL.page(.9, at => GL.rows(items.slice(0, 3), { top, at }));
GL.page(t, at => GL.rows(items.slice(3, 6), { top, at }), { out: false });
```
หัวข้อ (`title`) อยู่นอก page → ค้างตลอดทุกหน้า.

## Pen — ปากกาที่ทุกเส้นวาดตัวเอง

ฟังก์ชันวาด (`messy`, `clean`, icon) ได้ `p` = Pen ที่ตั้งเวลาเริ่ม + ตำแหน่ง + สเกลไว้แล้ว. วาดรอบ (0, 0) ในกรอบ ±200 × ±185.
ทุกเมธอดรับ `o` = `{ at, dur, sw, fill, stroke, rx }`:
- `at` วินาทีนับจากจุดเริ่มของภาพนี้ (ไม่ใช่ของคลิป), `dur` เวลาลากเส้น (ค่าเริ่ม .4)
- `sw` ความหนาเส้น (ค่าเริ่ม 3 — เอนจินปรับตามสเกลให้ดูหนาเท่ากันทุกขนาด)
- `fill: GL.C.fill` = ถมดำเพื่อบังของข้างหลัง (ใส่กับทุกรูปทรงปิดที่ซ้อนกับอย่างอื่น)
- `stroke`: `GL.C.ink` (ขาว ค่าเริ่ม) · `GL.C.soft` (เทาอ่อน — ขอบใน/รายละเอียด) · `GL.C.mute` (เทา — ลูกศร, เส้นรอง)

| เมธอด | |
|---|---|
| `p.line(x1, y1, x2, y2, o)` | เส้นตรง |
| `p.rect(x, y, w, h, o)` / `p.box(cx, cy, w, h, o)` | สี่เหลี่ยม (มุมซ้ายบน / กึ่งกลาง), `o.rx` มุมมน |
| `p.circle(cx, cy, r, o)` / `p.ellipse(cx, cy, rx, ry, o)` | วงกลม / วงรี |
| `p.poly([[x,y],…], o)` / `p.shape([[x,y],…], o)` | เส้นหลายจุด (เปิด) / รูปหลายเหลี่ยม (ปิด) |
| `p.path('M … C …', o)` | SVG path ใดก็ได้ |
| `p.dot(cx, cy, r, o)` | จุดถมขาว (badge, bullet) |
| `p.tube(points \| 'M…', T, o)` | ท่อหนา T px: ขอบขาว แกนดำ ปลายมน — แขนขา นิ้ว หูหิ้ว สายคล้อง (ดู `kit.md`) |
| `p.text(str, x, y, {size, at, ls, color})` | ตัวหนังสือในภาพ (fade) — ใช้น้อย ๆ เช่นป้าย `FILES` |
| `p.child({ transform: 'translate(…) rotate(…)' }, scale)` | กลุ่มย่อยหมุน/ย้าย/ย่อ (ส่ง `scale` ถ้ามี `scale()` ใน transform เพื่อให้เส้นไม่บางลง) |
| `p.shift(dt)` | Pen เดิมที่เริ่มช้าลง `dt` วิ |

สุ่มแบบได้ผลเดิมทุกครั้ง: `GL.rnd()` (0–1), `GL.rr(a, b)` — ห้ามใช้ `Math.random()` (เฟรมจะไม่ตรงกันระหว่าง worker).

## Kit — คน มือ ลูกศรเชื่อม ของประกอบ (`GL.kit.*`)

ชิ้นที่วาดยาก ปรับไว้แล้ว: `kit.person` (10 ท่า) `kit.bust` `kit.team` `kit.hand` (point / thumb / open) `kit.tap` `kit.holdPhone`
`kit.connect` (5 แบบ + เส้นประ) `kit.cycle` `kit.badge` `kit.cursor` `kit.sparkle` `kit.burst` `kit.ripple` `kit.callout` `kit.isoBox` `kit.table` + `GL.iso`.
รับ options object: `GL.kit.person(p, { x, y, h: 300, pose: 'wave' })`. รายละเอียดทั้งหมด + ภาพ: `kit.md`, `kit.jpg`.

## Parts — ชิ้นส่วนสำเร็จ (`GL.parts.*`, ส่ง `p` เป็นตัวแรก)

| part | signature | |
|---|---|---|
| envelope | `(p, x, y, w, h, rot, at, d)` | ซองจดหมาย |
| phone | `(p, x, y, at)` | กรอบมือถือ 196×364 |
| appIcon | `(p, x, y, size, at, d, glyph 0–2)` | ไอคอนแอป |
| target | `(p, x, y, at, d, k)` | เป้า 4 วง (r 100 × k) |
| arrow | `(p, tipX, tipY, angle, len, at, d, sw)` | ลูกธนู (ปลายอยู่ที่ tip) |
| link | `(p, x1, y1, x2, y2, at, d, o)` | ลูกศรเส้นตรงมีหัว |
| folder | `(p, x, y, w, h, at, d, rot)` | แฟ้ม |
| doc | `(p, x, y, w, h, rot, at, d, lines)` | กระดาษพับมุม + บรรทัด |
| scribble | `(p, x, y, w, h, at, d, o)` | ลายมือหยึกหยัก (ซ้าย→ขวา) |
| tangle | `(p, x, y, r, at, d, turns)` | เส้นพันกันเป็นก้อน (ความคิดยุ่ง / กระดาษขยำ เมื่อ r เล็ก + turns 2) |
| bulb | `(p, x, y, scale, at, d, rays)` | หลอดไฟ + รัศมี |
| clock | `(p, x, y, r, at, d, {h, m, ticks, fill})` | นาฬิกา |
| check | `(p, x, y, scale, at, d, sw)` | เครื่องหมายถูก |
| checkbox | `(p, x, y, size, at, d, checked)` | ช่องติ๊ก |
| star | `(p, x, y, r, at, d, o)` | ดาว 5 แฉก |
| bubble | `(p, x, y, w, h, at, d, flip)` | กล่องแชต / ความคิด |
| laptop | `(p, x, baseY, w, at, d)` | โน้ตบุ๊ก (y = ฐาน) |
| tablet | `(p, x, y, w, h, at, d)` | แท็บเล็ต |
| moon / zzz | `(p, x, y, r, at, d)` / `(p, x, y, at, d)` | พระจันทร์เสี้ยว / Z Z Z |
| paperStack | `(p, x, bottomY, n, w, at, d)` | กองกระดาษ isometric |
| calendar | `(p, x, y, w, h, at, d, {cols, rows})` → `{l, hy, cw, ch}` | ปฏิทิน + ตาราง (คืนพิกัดช่องไว้เติม) |
| wifi / gamepad / tv / globe / bell | `(p, x, y, scale|r, at, d)` | ไอคอนสิ่งรบกวน |
| wallet | `(p, x, y, w, h, at, d)` | กระเป๋าสตางค์/ซองการ์ด |

## เวลาและเอฟเฟกต์ระดับกลุ่ม

- `GL.tween(el, at, dur, from, to, {cx, cy, ease})` — `from/to` = `{o, s, dx, dy}` (opacity, scale รอบ cx/cy, เลื่อน)
- `GL.fade(el, at, dur, rise)` — โผล่ + ลอยขึ้น
- `GL.art(fn, {x, y, s, at, ts, filter})` → `{wrap, g, end}` — วางภาพวาดเองนอกเลย์เอาต์ (`filter: 'glow' | 'glowS' | null`)
- `GL.pulse(g, at, 'bloom' | 'bloomS')` — เรืองแสงเป็นจังหวะบนภาพที่วาดเสร็จ (`g` จาก `GL.art`)
- `GL.midArrow(x, y, at)` — ลูกศรเทาระหว่างคู่
- `GL.end` — เวลาสิ้นสุดล่าสุดของทุกอย่างที่สร้างแล้ว

ตัวอย่างฉากอิสระ (ไม่ใช้เลย์เอาต์สำเร็จ):
```js
const a = GL.art(p => GL.parts.bulb(p, 0, 0, 2.2, 0, .7), { x: GL.W / 2, y: 820, at: .5 });
GL.text('ไอเดียเดียวที่ชัด', { y: 1250, size: 72, at: a.end });
GL.pulse(a.g, a.end + .1);
```

## render.js

```
node render.js <scene.html> [outdir=<scene dir>/out] [--name clip] [--fps 30] [--still] [--alpha] [--workers 4] [--at 3.2,6.5]
```
- ทุกครั้งได้ `still.png` (เฟรมสุดท้าย) + `storyboard.jpg` (6 จังหวะเรียงแนวนอน)
- `--at 3.2,6.5,9.8` = storyboard ที่วินาทีเหล่านี้แทน — ใช้ตรวจทุกหน้า / ทุกฉากของคลิปที่มีหลายหน้า (`page`, `shots`)
- `--still` หยุดแค่นั้น (ใช้ระหว่างออกแบบ) · ไม่ใส่ = ถ่ายทุกเฟรม → `<name>.mp4` (H.264, CRF 18)
- `--alpha` → `<name>.mov` ProRes 4444 พื้นใส (รูปทรงถมดำยังเป็นสีดำ — ตั้งใจ ให้อ่านออกบนวิดีโอ)
- `SCENE ERROR: …` = scene มีบั๊ก (ชื่อ pair ผิด, syntax) — ข้อความบอกชื่อที่มีให้เลือก
