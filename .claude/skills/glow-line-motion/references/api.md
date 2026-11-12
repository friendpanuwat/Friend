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
| `GL.stage(o)` | `w 1080`, `h 1920`, `glow 1` (คูณความฟุ้ง), `seed`, `icons 'motion'│'draw'`, `material 'ink'│'silver'` | เรียกครั้งเดียวก่อนอย่างอื่น. `GL.W`, `GL.H` = ขนาด |
| `GL.title(o)` → y ล่างสุด | `kicker`, `main`, `sub`, `top 40`, `at .05`, `size 142` | kicker ตัวห่าง 50px · main ตัวใหญ่เรืองแสง (ย่อเองถ้ายาว) · sub ไทยสีเทา 34px. ไม่มี sub → คืน ~280 |
| `GL.text(str, o)` | `x W/2`, `y`, `size 56`, `at 0`, `dur .45`, `rise`, `color`, `weight 700`, `anchor 'middle'`, `ls 0`, `maxW W-80`, `glow true`, `lh 1.3` | `\n` = ขึ้นบรรทัดใหม่. ยาวเกิน `maxW` → ย่อฟอนต์อัตโนมัติ. ขึ้นแบบ fade + ลอยขึ้น |
| `GL.hline(y, at, {x1, x2})` / `GL.vline(x, y1, y2, at)` | | เส้นแบ่งสีเทา วาดตัวเอง |
| `GL.counter(value, o)` → `{g, end}` | `from 0`, `prefix`, `suffix`, `decimals`, `at`, `dur 1.4` + ตัวเลือกของ `text` | ตัวเลขนับขึ้น ใส่คอมม่าให้เอง (`12,500`) |
| `GL.connect(x1, y1, x2, y2, o)` → end | `at`, `dur .5`, `bend 0`, `ctrl [x, y]`, `dots`, `stroke C.soft`, `sw 2.6` | ลูกศรโค้ง (`bend` ±0.1–0.4) หรือจุดไข่ปลา (`dots: true`) ระหว่างจุดบนจอ |
| `GL.finish({hold})` | `hold 1.6` | ตั้ง `window.DURATION` |

## เลย์เอาต์

item ของ rows / grid / hero = `{ label, pair: 'inbox' }` หรือ `{ label, messy(p){…}, clean(p){…} }` (วาดสดใน item เลย).

| ฟังก์ชัน | ตัวเลือก (ค่าเริ่ม) | พฤติกรรม |
|---|---|---|
| `GL.rows(items, o)` | `top 340`, `bottom H`, `at .9`, `gap .15`, `arrow true`, `rule true`, `labelSize 56`, `dim .42`, `ts 1` | แถวละข้อ: ป้าย → ฝั่งรก (ซ้าย) → ลูกศร → ฝั่งเรียบ (ขวา) → ฝั่งรกหรี่ → เรืองแสง. ข้อต่อไปเริ่มเมื่อข้อก่อนเสร็จ. ภาพย่อเองตามความสูงแถว (≤ 4 แถว/จอ 9:16 ถึงจะชัด) |
| `GL.grid(items, o)` | `cols 2`, `top 340`, `bottom H`, `at .9`, `stagger .55`, `labelSize auto`, `dim .6`, `ts .8` | โปสเตอร์หลายช่อง (ซ้อนเวลากันทุก `stagger` วิ). 12 ช่อง = ภาพยังชัด, 20 ช่อง = ภาพเล็กแบบรูปอ้างอิง (ลด `stagger` เป็น .35) |
| `GL.hero(item, o)` | `at .4`, `y H*.5`, `label`, `caption`, `swap true`, `scale auto`, `ts 1` | ข้อเดียวเต็มจอ: ฝั่งรกวาด → จางหาย → ฝั่งเรียบวาดที่เดิม. `swap:false` = วางซ้าย→ขวาแทน. `caption` = ข้อความไทยใต้ภาพ |
| `GL.steps(items, o)` | `top 340`, `bottom H`, `at .9`, `gap .1`, `rule true`, `ts 1` | item = `{ icon, label, sub }`; `icon` = ชื่อ icon, ชื่อ pair (ใช้ฝั่งเรียบ) หรือ `p => {…}` |
| `GL.spot(item, o)` | `at .4`, `y H*.48`, `w auto`, `label`, `caption`, `float true` | ภาพเดี่ยวใหญ่กลางจอ + ป้ายบน + คำบรรยายล่าง (ฉากประโยคเดียว). item = `{ icon, label, caption }` |
| `GL.flow(items, o)` | `top 340`, `bottom H`, `at .9`, `dir auto`, `dots true` | ขั้นตอนต่อกันด้วยจุดไข่ปลา: 9:16 = ซิกแซกซ้าย-ขวา (≤ 4–5 ขั้น), 16:9 = แถวเดียว (≤ 5 ขั้น). item = `{ icon, label, sub }` |
| `GL.versus({left, right, vs, win}, o)` | `top 340`, `bottom H`, `at .9`; `vs 'VS'`, `win 'left'│'right'` | A vs B สองคอลัมน์ มีเส้นแบ่งกลาง; `win` = ฝั่งที่แพ้หรี่ ฝั่งที่ชนะเรืองแสง. left/right = `{ icon, label, sub }` |
| `GL.stat({value, …}, o)` | item: `value`, `from 0`, `prefix`, `suffix`, `decimals 0`, `label`, `sub`, `icon`; o: `at .4`, `top 0`, `bottom H`, `size auto` | ตัวเลขใหญ่นับขึ้น (+ ไอคอนด้านบน) จัดกลางแนวตั้งเอง. ตัวเลขต้องมาจากผู้ใช้เท่านั้น |
| `GL.page(at, at => layout(…), o)` | `hold 1.2`, `out true` | ห่อเลย์เอาต์เป็นหน้า: จบแล้วค้าง `hold` วิ แล้วจางออกก่อนหน้าถัดไป. คืนเวลาเริ่มหน้าถัดไป. หน้าสุดท้ายใส่ `{ out: false }` |

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
| `p.text(str, x, y, {size, at, ls, color})` | ตัวหนังสือในภาพ (fade) — ใช้น้อย ๆ เช่นป้าย `FILES` |
| `p.child({ transform: 'translate(…) rotate(…)' }, scale)` | กลุ่มย่อยหมุน/ย้าย/ย่อ (ส่ง `scale` ถ้ามี `scale()` ใน transform เพื่อให้เส้นไม่บางลง) |
| `p.shift(dt)` | Pen เดิมที่เริ่มช้าลง `dt` วิ |

สุ่มแบบได้ผลเดิมทุกครั้ง: `GL.rnd()` (0–1), `GL.rr(a, b)` — ห้ามใช้ `Math.random()` (เฟรมจะไม่ตรงกันระหว่าง worker).

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
| capsule | `(p, x1, y1, x2, y2, r, o)` | แคปซูลถมดำ (แขนขา ด้าม ท่อ) |
| person | `(p, x, y, height, at, d, {pose})` | คนพิกโตแกรม; pose `stand` `wave` `cheer` `point` `think` |
| bust / team | `(p, x, y, scale, at, d)` | อวาตาร์ (±60 × ±62 × scale) / 3 คน |
| hand | `(p, x, y, scale, at, d)` | มือนิ้วชี้กด (ปลายนิ้วที่ y − 64·scale) |
| cursor | `(p, tipX, tipY, scale, at, d, {click})` | ลูกศรเมาส์ + เส้นคลิก |
| card | `(p, x, y, w, h, {text, size, at, dur, rx})` | กล่องป้ายมุมมน + ข้อความ |
| connect | `(p, x1, y1, x2, y2, at, d, {bend, ctrl, dots, head, stroke, sw})` | ลูกศรโค้ง / จุดไข่ปลา ภายในภาพ |
| coins | `(p, x, bottomY, n, r, at, d)` | กองเหรียญ |
| bag | `(p, x, y, scale, at, d)` | ถุงช้อปปิ้ง (±62 × ±90 × scale) |
| bars | `(p, x, y, w, h, values, at, d, {accent})` | กราฟแท่ง (แท่ง `accent` เด่น — ค่าเริ่ม = แท่งสุดท้าย) |
| lineChart | `(p, x, y, w, h, values, at, d, {dots})` | กราฟเส้น + แกน + จุดปลายเด่น |

## การขยับของไอคอน (idle motion)

`kind` (ค่าเริ่มอยู่ใน `GL.LOOP`): `bob` ลอยขึ้นลง · `sway` ส่ายซ้ายขวา · `swing` แกว่งรอบจุดหมุน · `spin` หมุนรอบ ·
`beat` เต้นตุบ ๆ · `breathe` ขยายหดช้า ๆ · `blink` กะพริบ (หดแนวตั้ง) · `buzz` สั่นเป็นช่วง ๆ · `hop` กระโดด ·
`orbit` วนเป็นวง · `tap` กด · `flap` สะบัด (ธง) · `grow` ยืดหด (แท่งกราฟ) · `flash` จางเข้าออก · `rise` ลอยขึ้นแล้วจาง.
`amp` = px (เลื่อน), องศา (หมุน), สัดส่วน (ขยาย); `ox/oy` = จุดหมุนในพิกัดกรอบ ±200 ของภาพ; `phase` เหลื่อมจังหวะ; `delay` หน่วงเริ่ม.

- ทั้งชิ้น: ตั้ง `myIcon.motion = { kind: 'swing', amp: 10, oy: -120 }` หรือส่ง `idle` ให้ `GL.art` — ตารางของไอคอนในคลัง: `GL.MOTION`
- บางส่วนของภาพ: ใน drawing ใช้ `p.loop({ kind: 'spin', period: 5, ox, oy }, q => q.line(...))` — ส่วนที่วาดด้วย `q` จะขยับ
  (ตัวอย่างใน parts: เข็มนาฬิกา, แขนโบก, รัศมีหลอดไฟ, แท่งกราฟ, ผ้าธง, Z Z Z, wifi)

## เวลาและเอฟเฟกต์ระดับกลุ่ม

- `GL.tween(el, at, dur, from, to, {cx, cy, ease})` — `from/to` = `{o, s, dx, dy}` (opacity, scale รอบ cx/cy, เลื่อน)
- `GL.fade(el, at, dur, rise)` — โผล่ + ลอยขึ้น
- `GL.art(fn, {x, y, s | w, at, ts, filter, float, idle, reveal})` → `{wrap, g, end}` — วางภาพวาดเองนอกเลย์เอาต์.
  โหมด `motion` (ค่าเริ่ม): ภาพโผล่มาครบทั้งชิ้นใน 0.5 วิ แล้วเล่น idle motion ของมัน (`fn.motion` ของไอคอนในคลัง).
  `idle: { kind, amp, period, ox, oy, phase, delay }` = กำหนด/ทับการขยับ · `idle: false` = นิ่ง · `reveal: 'draw'` = ชิ้นนี้วาดเส้นแทน (ใช้กับเส้นจริง ๆ).
  `w` = ความกว้างบนจอ (px) ของกรอบ ±200 (แทน `s`), `filter: 'glow' | 'glowS' | null`,
  `float: true | {amp 8, period 3.2, dx 0}` = ลอยขึ้นลงเบา ๆ หลังวาดเสร็จ (ให้ฉากนิ่งมีชีวิต)
- **ของเคลื่อนที่**: tween ที่ `wrap` ของภาพ — `GL.tween(a.wrap, at, .9, {dx: 0, dy: 0}, {dx: -150, dy: -330})` (เลื่อน),
  `{s: .9}→{s: 1}` + `{cx, cy}` (ขยายรอบจุด). เลื่อนช้า ≥ 0.6 วิ, ขยับพร้อมกันไม่เกิน 1–2 ชิ้น (`style.md` ข้อ 6)
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
node render.js <scene.html> [outdir=<scene dir>/out] [--name clip] [--fps 30] [--still] [--at T] [--alpha] [--workers 4]
```
- ทุกครั้งได้ `still.png` (เฟรมสุดท้าย) + `storyboard.jpg` (6 จังหวะเรียงแนวนอน)
- `--still` หยุดแค่นั้น (ใช้ระหว่างออกแบบ) · `--at T` = still ที่วินาที T (ดูหน้าแรกของคลิปหลายหน้า) · ไม่ใส่ `--still` = ถ่ายทุกเฟรม → `<name>.mp4` (H.264, CRF 18)
- `--alpha` → `<name>.mov` ProRes 4444 พื้นใส (รูปทรงถมดำยังเป็นสีดำ — ตั้งใจ ให้อ่านออกบนวิดีโอ)
- `SCENE ERROR: …` = scene มีบั๊ก (ชื่อ pair ผิด, syntax) — ข้อความบอกชื่อที่มีให้เลือก
