# deck.js API

`deck.js` คือ JavaScript ธรรมดาที่ถูกแทรกระหว่างเอนจินสองส่วนตอน build — ทุกฟังก์ชันด้านล่างเรียกได้ตรง ๆ.
เอนจินเป็นชุดเดียวกับ talking-head-editorial (ฟังก์ชัน MG / ข้อความชื่อเดียวกัน) ต่างกันที่ **หน่วยเป็นสไลด์** และ **เวลาเป็นวินาทีภายในสไลด์**.
ผืนงาน 1080×1080 px (หรือ 1080×1350 / 1080×1920 ถ้า build ด้วย `SIZE=`), (0,0) มุมซ้ายบน; ค่าคงที่ `W`, `H` ใช้ได้.
สีคงที่: `ACC` (accent), `NAVY`, `CREAM`, `INK` (ดำ) — build เปลี่ยนตาม brand.json. ห้ามใช้ `Math.random()` / `Date`.

## โครงไฟล์

```js
slide({bg: 'black', dur: 3.2}, s => {      // สไลด์ 1 = ปก (ชิป "เลื่อนดู" ขึ้นเอง)
  mood(s, {seed: 0});
  tile(s, 'ghost', .3, 'left:440px;top:130px', {size: 200, bg: '#fff', color: NAVY});
  txt(s, [[['ลูกค้าทักแล้ว', 'm', .45]], [['หายไป', 'i', .8, {size: 190}]]], 'top:420px');
  keyHit(.8);
});
slide({bg: 'white'}, s => { ... });         // สไลด์ 2 …
```

```js
slide({bg, dur = 3.5, still, sound, chrome = true, swipe}, s => {...})
```
| ตัวเลือก | ความหมาย |
|---|---|
| `bg` | `'black'` · `'white'` · `'cream'` · `'navy'` · `'accent'` · `'#hex'` — พื้นสว่าง (white/cream/accent/hex สว่าง) ได้คลาส `light`: ตัวอักษรทุกสไตล์เป็นกรมท่าเอง |
| `dur` | ความยาวสไลด์ใน MP4 (วินาที). แอนิเมชันควรจบใน ~1.5 วิ แล้วค้าง |
| `still` | เวลาที่ถ่าย PNG (ค่าเริ่ม = ท้ายสไลด์). ใช้เมื่อมีของที่ตั้งใจให้หายไปตอนท้าย |
| `sound` | เสียงตอนสไลด์เข้าใน MP4 (`SFX=1`): ค่าเริ่ม `swipe` (สว่าง) / `whoosh` (มืด); `null` = ไม่มี |
| `chrome` | `false` = ไม่แสดง handle ซ้ายล่าง + เลขหน้า `n / N` ขวาล่าง |
| `swipe` | ข้อความชิปมุมขวาล่างของปก (ค่าเริ่ม `'เลื่อนดู'` บนสไลด์ 1; ใส่ในสไลด์อื่นได้) |

`s` = เวที (stage) ของสไลด์: ใส่ทุกอย่างลงใน `s`. `s.light` บอกว่าพื้นสว่างไหม. ทุกเวลาที่ส่งให้ฟังก์ชันในบล็อกนี้เริ่มที่ 0 = สไลด์เข้า.

## ข้อความ

```js
txt(s, rows, 'top:380px', {W: 920, H?, gap: 0})   // บล็อกกึ่งกลางแนวนอน; css ระบุ top (และ left ถ้า W แคบกว่าผืน)
// rows = [[ [ข้อความ, สไตล์, เวลาขึ้น, {size, color, type, wipe, step}], ... ], ...]  หนึ่งแถวใน = หนึ่งบรรทัด
```
| สไตล์ | ฟอนต์ / ขนาดเริ่ม | ใช้ |
|---|---|---|
| `l` | Mitr Regular 54 | คำนำ/คำเชื่อม (ลอยขึ้นจากเบลอ) |
| `m` | Mitr SemiBold 84 | วลีกลาง ๆ / หัวเรื่องรอง |
| `k` | Mitr Bold 146 สี accent (พื้นสว่าง = กรมท่า) | คำสำคัญแบบหนัก |
| `kw` | เหมือน `k` แต่ขาว (พื้นสว่าง = กรมท่า) | คำใหญ่ที่ไม่ใช่ไฮไลต์ |
| `i` | Sriracha 150 สี accent (พื้นสว่าง = กรมท่า) | คำสำคัญแบบลายมือ (อารมณ์/คำถาม) |
| `iw` | เหมือน `i` แต่ขาว/กรมท่า | หัวเรื่องลายมือ |
| `hl` | Mitr Bold 116 ตัวดำบนกล่อง accent | คำที่เป็นการกระทำ/ปัญหา — วิธีเดียวที่ accent ขึ้นบนพื้นสว่าง |
- บรรทัดกว้างเกิน `W` ถูกย่อทั้งบรรทัดเอง (QC เตือนถ้าย่อต่ำกว่า 70% → แยกบรรทัดหรือใส่ `size`).
- `gap` = ระยะระหว่างบรรทัด (px) — เพิ่มเมื่อสระบน/วรรณยุกต์ของบรรทัดล่างชนบรรทัดบน (เช่น "ไม่ใช่" Sriracha ใต้ตัวหนา → `gap: 22`).
- `{type: true}` พิมพ์ทีละตัว · `{wipe: true}` ขึ้นทีละตัวแล้วเปลี่ยนขาว→accent (ใช้บนพื้นมืด).
- `keyHit(t)` = เสียงวูบตอนคำสำคัญขึ้น (มีผลเฉพาะ MP4 ที่ `SFX=1`) — ใส่ตรงเวลาของ `k` / `i` / `hl`.

```js
para(s, text, t, 'top:600px', {size: 44, W: 900, align: 'left'|'center', step: .18, color})
```
ย่อหน้าตัดบรรทัดเอง (ภาษาไทยตัดคำโดยเบราว์เซอร์). `\n\n` = ย่อหน้าใหม่ (ขึ้นทีละย่อหน้า), `\n` = ขึ้นบรรทัด,
`**คำ**` = ตัวหนา (บนพื้นมืดเป็นสี accent), `==คำ==` = กล่อง accent. ใช้กับสไลด์ที่ต้องมีคำอธิบาย 1–3 บรรทัด — อย่าใช้เป็นหลักของชุด.

```js
rows(s, ['ข้อแรก', 'ข้อสอง', ...], t, 'top:470px', {size: 50, gap: 34, step: .22, W: 860, start: 1})
rows(s, [['check', 'ทำแบบนี้'], ['x', 'ไม่ทำแบบนี้']], t, css)      // ไอคอนแทนเลข
rows(s, items, t, css, {icon: 'check'})                                 // ไอคอนเดียวกันทุกข้อ
```
รายการ: ป้ายข้าวหลามตัด accent (เลข หรือไอคอน) + ข้อความ Mitr SemiBold, เลื่อนเข้าทีละข้อ. คืน array ของแถว.

| ตัวช่วย | ทำอะไร |
|---|---|
| `pill(s, text, t, css)` | ป้ายเม็ดยากรมท่า ตัวลายมือ — จัดกลาง: `left:0;right:0;margin:auto;width:fit-content;top:…`, ซ้อนห่างกัน ≥ 120 px |
| `strike(chunkEl, t, color?)` | ขีดฆ่าคำ — `txt(...).querySelectorAll('.ch')[n]` |
| `num(s, n, t, css)` | ป้ายตัวเลขข้าวหลามตัด (ข้อ 1, 2, 3 — หนึ่งข้อต่อสไลด์) |
| `curl(s, t)` | มุมกระดาษม้วนดำของโปสเตอร์ (ใช้กับ `bg: 'cream'`) |

## รูป

```js
photo(s, 'img/v_12.4.jpg', t, 'left:250px;top:150px;width:580px;height:580px', {radius: 40, pos: '50% 30%', anim: 'up', shadow: true, border})
pic(s, 'img/i01.png', t, css, {anim: 'blur'|'up'|'right'|'left'|'none', fit: 'contain'|'cover', pos, drift: .04})
```
- `photo()` = ครอปเต็มกรอบมุมมนพร้อมเงา — เหมาะกับรูปคน/สินค้า/เฟรมจากคลิป. `pos` = จุดโฟกัส (`'50% 30%'` = เน้นส่วนบน → เห็นหน้า).
- `pic()` = แสดงทั้งรูปไม่ครอป (`contain`) — รูปพื้นดำ / ภาพตัดพื้นหลัง / สกรีนช็อต วางบน `bg: 'black'` ให้กลืน.
- path อิงจากโฟลเดอร์งาน (`img/...`). รูปหาไม่เจอ → render ออก exit 2 พร้อมชื่อไฟล์.
- `drift` = ซูมช้า ๆ ใน MP4 (PNG ไม่ซูม). ไม่ปรับสีรูป.
- `anim: 'none'` = รูปอยู่ตั้งแต่เฟรมแรก — ใช้กับรูปเต็มผืนบนปกถ้าจะส่ง MP4 (เฟรมแรกของวิดีโอคือภาพตัวอย่างในกริด/ฟีด).

## Motion graphics (ใช้เมื่อไม่มีรูป) — สูตรเต็มใน slide-library.md

| ตัวช่วย | ทำอะไร |
|---|---|
| `mood(s, {seed, o})` | พื้นสไลด์ดำแบบ Swishy: แสงฟ้า+ม่วง + ตารางจุดจาง |
| `tile(s, icon, t, css, {size: 200, bg: '#fff'\|'glass'\|ACC\|NAVY, color, float: true})` | ไอคอนในกล่องมุมมน เด้งเข้า; คืน outer (`.inner` = ตัวกล่อง สำหรับ punch/wobble) |
| `bubble(parent, text, t, css, {side, size, bg, color})` | บับเบิลแชต |
| `panel(s, css, t, {style: 'white'\|'glass'\|'navy', radius, from: 'up'\|'scale'})` | แผง UI (หน้าจอแอป/มือถือ/การ์ด) |
| `skel(panel, css, [.8, .55], {t, color, h})` | เส้นข้อความจำลอง |
| `bars(parent, [..0–1], t, css, {to, tTo, h, w, last})` | กราฟแท่ง (เปลี่ยนความสูงด้วย `to`) — PNG แสดงค่าสุดท้าย |
| `trend(parent, [[x,y],...], t, css, {w, h, color, sw})` | เส้นแนวโน้มพร้อมหัวลูกศร |
| `stars(parent, 5, filled, t, css, {size})` | ดาวรีวิว |
| `target(s, t, tHit, css, {size})` | เป้าธนู ลูกศรเข้ากลางที่ `tHit` |
| `cross(s, t, css, {size, color})` | กากบาทวาดทับ |
| `cursor(s, [[t,x,y],...], [clickT...])` · `ripple(s, x, y, t)` | เคอร์เซอร์ · วงคลื่น (เห็นการเคลื่อนเฉพาะใน MP4) |
| `popIn(el, t)` · `punch(el, t)` · `wobble(el, t)` · `float(el, t0, t1)` | เด้งเข้า · เต้นย้ำ · ส่าย · ลอย (ลอย/drift ถูกรีเซ็ตใน PNG) |
| `ico(name, size, color)` | สตริง SVG ไอคอน Lucide สำหรับ `div(..., html)` |

ไอคอนที่มี: `arrow-down arrow-right badge-percent banknote bell book-open bookmark calendar camera check chevron-right
circle-alert circle-check-big circle-help circle-x clock coins credit-card eye-off flame ghost hand-coins heart hourglass image
lightbulb list-checks message-circle message-circle-question message-square-quote mouse-pointer-2 package package-x percent
quote repeat-2 rocket scale search send shield-check shopping-cart sparkles star store tag target thumbs-down trending-down
trending-up user user-plus wallet x zap`.
ต้องการเพิ่ม: ดาวน์โหลด `https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/<name>.svg` แล้วใส่ส่วนข้างใน `<svg>` ลง
`ICONS['<name>'] = '…';` ที่บรรทัดแรกของ deck.js.

## ตัวช่วยพื้นฐาน

| ฟังก์ชัน | ทำอะไร |
|---|---|
| `div(css, parent, html='')` | element `position:absolute` |
| `A(el, keyframes, t, d, {e, f, it, dir, idle})` | Web Animation เริ่มที่เวลาในสไลด์ — `e`: `SMOOTH`/`SPRING`/`BOUNCE`/`INOUT`; `idle: true` = เคลื่อนไหวประกอบที่ PNG ไม่เอา |
| `visible(el, t0, t1)` | แสดง element เฉพาะช่วงเวลา (element ต้องมี `opacity:0`) |
| `svg(w, h, inner, css, parent)` · `draw(pathEl, t, d)` | ห่อ SVG · วาดเส้น |
| `sfx(name, t, db)` | เสียงประกอบใน MP4 (`pop`, `pop_hi`, `pop_lo`, `swipe`, `whoosh`, `thud`, `stamp`, `tick`, `sub`, `softswish`) |

## ยกการ์ดจาก timeline.js (talking-head-editorial) มาเป็นสไลด์

1. `card(t0, t1, {bg})` → `slide({bg, dur: 3.5}, s => {...})`; ตัวแปร `c` → `s`.
2. เวลา: ลบ `t0` ของการ์ดออกจากทุกเวลาในบล็อก (เช่น 3.70 ในการ์ดที่เริ่ม 3.64 → .06). แผ่จังหวะให้คำสำคัญขึ้นราว .6–1.0.
3. ตำแหน่ง y: การ์ด 1920 ใช้ MG y 150–1100 / ข้อความ y 1200–1600 → สไลด์ 1080 ใช้ MG y 100–560 / ข้อความ y 560–940
   (หรือข้อความบน + MG ล่าง). ลดขนาด tile/panel ราว 0.6–0.75 เท่า; ขนาดตัวอักษรคงเดิมได้.
4. `{color: NAVY}` / `N` / `NS(size)` บนพื้นสว่างไม่ต้องใส่แล้ว (คลาส `light` ทำให้เอง) แต่ใส่ไว้ก็ไม่เสียหาย.
5. `.classList.add('aroll')` ไม่ต้องใช้ — สไลด์มืดใส่เงาตัวอักษรให้เอง. `cap()`, `zoom()`, `frame()`, `clip()`, `cards()` ไม่มีในเอนจินนี้
   (หน้าคนพูด → `photo()` กับเฟรมจาก `pipeline.sh grab`).

## กับดักที่พบบ่อย

- **PNG = สถานะท้ายสไลด์** — เอฟเฟกต์ที่ทำให้คำหายไป (เบลอจาง, opacity → 0) จะทำให้ PNG ไม่มีคำนั้น. ถ้าต้องใช้ ตั้ง `still` ก่อนเวลาที่หาย.
- **สอง animation บน transform เดียวกันจะทับกัน** — ใช้ `tile().inner` สำหรับ punch/wobble, หรือห่อ div อีกชั้น.
- **สระบน/วรรณยุกต์ไทยชนบรรทัดบน** — เพิ่ม `gap` ใน `txt()` หรือลด `size`. ตรวจใน PNG ทุกครั้ง.
- **แถบล่าง 100 px เป็นของ handle + เลขหน้า** — QC เตือนถ้าข้อความล้ำ. ถ้าสไลด์ต้องใช้เต็มจอ ตั้ง `chrome: false`.
- **pill ซ้อนกัน** — Sriracha สูง; เว้นแนวตั้ง ≥ 120 px ระหว่าง pill.
- **ตำแหน่งเป็นพิกัดตายตัว** — เปลี่ยน `SIZE` แล้วต้องจัดตำแหน่งใหม่ (โดยเฉพาะ top ของบล็อกล่าง).
