# timeline.js API

`timeline.js` คือ JavaScript ธรรมดาที่ถูกแทรกระหว่างเอนจินสองส่วนตอน build — ทุกฟังก์ชันด้านล่างเรียกได้ตรง ๆ.
หน่วยเวลาเป็น **วินาทีของคลิป**; ทุกอย่างคำนวณจากเวลา (seekable) → ห้ามใช้ `Math.random()` / `Date` (ต้องการสุ่มให้ใช้ seed).
ผืนงาน 1080×1920 px, (0,0) มุมซ้ายบน. สีคงที่ที่ใช้ได้: `ACC` (accent), `NAVY`, `CREAM`, `INK` (ดำ) — build เปลี่ยนตาม brand.json.

## ลำดับในไฟล์

```js
const N = {color: NAVY}, NS = s => ({color: NAVY, size: s});   // ตัวช่วยสีกรมท่าบนการ์ดสว่าง
cards([[1.86, 2.46], [3.64, 5.10], ...]);   // 1) ประกาศช่วงการ์ด + frame() ทั้งหมดก่อน
for (const [t, z] of [[0, 1], [1.06, 1.08], ...]) zoom(t, z);   // 2) ซูมตัดชน
cap({...}); keyHit(...);                     // 3) ซับ A-roll
{ const c = card(t0, t1, {...}); ... }       // 4) การ์ด ฉากละหนึ่งบล็อก { }
```
`cap()` ที่เริ่มในช่วง `cards()` จะถูกซ่อนเอง. ชั้นซับ A-roll อยู่เหนือการ์ด → `t1` ของ cap ต้องจบก่อนการ์ดถัดไปเริ่ม.

## ซับบนหน้าคนพูด

```js
cap({t0, t1, top?, maxH?, lines: [
  [['เวลาลูกค้า', 'l', 0.0], ['ทักมาถาม', 'l', 0.70]],   // หนึ่งบรรทัด = หลาย chunk เรียงต่อกัน (เว้น 16px)
  [['รายละเอียด', 'k', 1.06]],                            // [ข้อความ, สไตล์, เวลาขึ้น, {size, color, type, wipe, step}]
]});
```
| สไตล์ | ฟอนต์ / ขนาดเริ่ม | ใช้ |
|---|---|---|
| `l` | Mitr Regular 54 ขาว | คำนำ/คำเชื่อม (ขึ้นแบบลอยขึ้นจากเบลอ) |
| `m` | Mitr SemiBold 84 ขาว | วลีกลาง ๆ ที่ไม่มีคำเด่น |
| `k` | Mitr Bold 146 สี accent, ชิดตัว | คำสำคัญแบบหนัก |
| `kw` | เหมือน `k` แต่ขาว (หรือ `{color: NAVY}`) | คำใหญ่ที่ไม่ใช่ไฮไลต์ |
| `i` | Sriracha 150 สี accent | คำสำคัญแบบลายมือ (อารมณ์/คำถาม) |
| `iw` | เหมือน `i` แต่ขาว/กรมท่า | หัวเรื่องบนการ์ด |
| `hl` | Mitr Bold 116 ตัวดำบนกล่อง accent | คำที่เป็นการกระทำ/ปัญหา เช่น "ลดราคา" |
- `top` ค่าเริ่ม 1150 (ระดับอก — ตรวจกับ grid.jpg ของคลิปจริง), กว้าง ≤960 และสูง ≤`maxH` (420) ย่อพอดีเอง.
- ก้อนหายแบบตัดทันทีที่ `t1` → ตั้ง `t1` = เวลาก้อนถัดไป − 0.02.
- `{type: true}` พิมพ์ทีละตัวอักษร · `{wipe: true}` ขึ้นทีละตัวแล้วเปลี่ยนขาว→accent (หรือ `wipe: '#hex'`) · `step` = วินาทีต่อตัว (0.045).
- ตัดคำลงท้าย "เนี่ย / อ่ะ / นะเว้ย" ออกจากซับได้ (บอกผู้ใช้).

```js
keyHit(t, db = -22)   // เสียงวูบตอนคำสำคัญขึ้น — ใส่ทุก k / i / hl
zoom(t, z, d = .001)  // ค่าเริ่มเป็นการตัดชน; ใส่ d > 0 ถ้าอยากไหล
flash(t, o = .7)      // แฟลชขาวสั้น (ใช้น้อยมาก)
sfx(name, t, db, pitch?)
```

## การ์ดเต็มจอ

```js
const c = card(t0, t1, {bg: 'black'|'white'|'cream'|'navy'|'#hex', sound: 'whoosh'|'swipe'|'whoosh_long'|null, db: -24});
txt(c, rows, 'top:740px', {W: 960, H?})     // rows แบบเดียวกับ cap().lines; คืน element (ใช้ .querySelectorAll('.ch')[n] หา chunk)
```
การ์ดเข้า-ออกแบบตัดชน, เนื้อในย่อ 1.035→1 ใน 0.45 วิ. บนการ์ดดำที่มีภาพ/MG ให้ `el.classList.add('aroll')` กับข้อความเพื่อเงาตัวอักษร.
บนการ์ดขาว/ครีมใช้ `{color: NAVY}` (หรือ `N` / `NS(size)`) กับ `l`, `kw`, `iw`; accent บนพื้นสว่างใช้ได้เฉพาะ `hl`.

| ตัวช่วย | ทำอะไร |
|---|---|
| `pic(c, 'img/x.jpg', t, css, {anim: 'blur'\|'up'\|'right'\|'left', drift: .05, d: .5})` | รูปนิ่ง เข้าแบบเบลอ→คม/เลื่อน + ค่อย ๆ ดันเข้า |
| `clip(c, name, t, css, {from: 0, anim, fit: 'cover'})` | B-roll วิดีโอ (เตรียมด้วย `prep_broll.sh`) |
| `pill(c, text, t, css)` | ป้ายเม็ดยากรมท่า ตัวลายมือ (รายการที่ขึ้นทีละอัน) — จัดกลาง: `left:0;right:0;margin:auto;width:fit-content;top:…` |
| `strike(chunkEl, t, color?)` | ขีดฆ่าคำ |
| `num(c, n, t, css)` | ป้ายตัวเลขข้าวหลามตัด (ขั้นที่ 1, 2, 3) |
| `curl(c, t)` | มุมกระดาษม้วนดำของโปสเตอร์ (ไม่ใช้บาร์โค้ด — ผู้ใช้ไม่เอา) |
| `frame(t0, t1, {bg: 'cream', s: .54, y: 1095})` | หน้าคนพูดย่อเป็นการ์ดมุมมนบนพื้นเรียบ — คืน container โปร่งใสสำหรับข้อความ (ประกาศใน `cards()` ด้วย) |

## Motion graphics (ใช้เมื่อไม่มี B-roll) — สูตรเต็มใน card-library.md

| ตัวช่วย | ทำอะไร |
|---|---|
| `mood(c, {seed, o})` | พื้นการ์ดดำแบบ Glow: แสงฟ้า+ม่วงไหลช้า + ตารางจุดจาง |
| `tile(c, icon, t, css, {size: 200, bg: '#fff'\|'glass'\|ACC\|NAVY, color, sound, float: true})` | ไอคอนในกล่องมุมมน เด้งเข้าแบบสปริง + ลอยขึ้นลงเบา ๆ; คืน outer (`.inner` = ตัวกล่อง) |
| `bubble(parent, text, t, css, {side, size, bg, color})` | บับเบิลแชต |
| `panel(c, css, t, {style: 'white'\|'glass'\|'navy', radius, from: 'up'\|'scale'})` | แผง UI (หน้าจอแอป/การ์ดสินค้า/มือถือ) |
| `skel(panel, css, [.8, .55], {t, color, h})` | เส้นข้อความจำลองสีเทาใน UI |
| `bars(parent, [..0–1], t, css, {to: [...], tTo, h, w, last})` | กราฟแท่งโตขึ้น แล้ว (ถ้ามี `to`) เปลี่ยนความสูง เช่นยอดตก |
| `trend(parent, [[x,y],...], t, css, {w, h, color, sw})` | เส้นแนวโน้มวาดเองพร้อมหัวลูกศร |
| `stars(parent, 5, filled, t, css, {size})` | ดาวรีวิว ไล่ติดทีละดวง |
| `target(c, t, tHit, css, {size})` | เป้าธนู วงเด้งเข้า แล้วลูกศรพุ่งเข้ากลางที่ `tHit` |
| `cross(c, t, css, {size, color})` | กากบาทวาดทับ |
| `cursor(c, [[t,x,y],...], [clickT...])` · `ripple(c, x, y, t)` | เคอร์เซอร์เคลื่อน/คลิก · วงคลื่น |
| `popIn(el, t)` · `punch(el, t, s)` · `wobble(el, t)` · `float(el, t0, t1)` | เด้งเข้า · เต้นย้ำ · ส่ายปฏิเสธ · ลอย |
| `ico(name, size, color)` | สตริง SVG ไอคอน Lucide ไว้ใส่ใน `div(..., html)` |

ไอคอนที่มี: `shopping-cart package package-x star circle-help message-circle message-circle-question wallet tag badge-percent percent
trending-down store credit-card thumbs-down target search lightbulb check x user mouse-pointer-2 coins banknote hand-coins
eye-off ghost clock hourglass scale shield-check bell sparkles arrow-down zap list-checks circle-alert`.
ต้องการไอคอนเพิ่ม: ดาวน์โหลด `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/<name>.svg` แล้วเพิ่มลง `ICONS` ใน timeline:
`ICONS['rocket'] = '<path d="…"/>…';` (เอาเฉพาะข้างใน `<svg>`).

## ตัวช่วยพื้นฐาน

| ฟังก์ชัน | ทำอะไร |
|---|---|
| `div(css, parent, html='')` | element `position:absolute` |
| `A(el, keyframes, t, d, {e, f, it, dir})` | Web Animation ที่มีเวลาเริ่ม — `e`: `SMOOTH`/`SPRING`/`BOUNCE`/`INOUT`; `f`: `'both'` (ค่าเริ่ม) / `'forwards'` / `'none'` |
| `visible(el, t0, t1)` | แสดง element เฉพาะช่วงเวลา (element ต้องมี `opacity:0` ใน CSS) |
| `svg(w, h, inner, css, parent)` · `draw(pathEl, t, d)` | ห่อ SVG · วาดเส้น |
| `HOOKS.push(t => {...})` | โค้ดต่อเฟรม (คืน Promise ได้) |

## กับดักที่พบบ่อย

- **ทุกช่วงใน `cards()` ต้องมี `card()` / `frame()` ที่ t0 เดียวกัน** — ไม่งั้นช่วงนั้นจะเป็นหน้าคนพูดเปล่าไม่มีซับ; เอนจินโยน error ตอน preview/render ให้แล้ว.
- **keyframe แรก = สถานะก่อนเริ่ม** (fill `'both'`). element ที่ไม่ animate และไม่มี `opacity:0` จะโผล่ตลอดการ์ด.
- **สอง animation บน transform เดียวกันจะทับกัน** — ใช้ `tile().inner` สำหรับ punch/wobble (outer ใช้ลอย), หรือห่อ div อีกชั้น.
- **สระบน/วรรณยุกต์ไทย** ของตัวใหญ่ชนบรรทัดบนได้ ถ้าวางบรรทัดชิดกัน — ตรวจใน preview, แยกเป็นสองก้อนหรือลดขนาด.
- **ข้อความยาวในสไตล์ใหญ่** จะถูกย่อทั้งบรรทัด — ถ้าย่อมาก ให้ใส่ `size` เองหรือแยกบรรทัด.
- **ภาพพื้นดำ** วางบนการ์ด `bg: 'black'` (ink = #000) ไม่งั้นเห็นขอบรูป.
- **การ์ดที่จบหลังเสียงพูด** (ตอนจบ) — ต้องใช้ `HOLD=` ที่ขั้น frames ไม่งั้นคลิปจบก่อนการ์ด.
