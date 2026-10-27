# timeline.js API (glass-ui)

`timeline.js` คือ JavaScript ธรรมดาที่ถูกแทรกระหว่างเอนจินสองส่วนตอน build — ทุกฟังก์ชันด้านล่างเรียกได้ตรง ๆ.
หน่วยเวลาเป็น **วินาทีของคลิป**; ทุกอย่างคำนวณจากเวลา (seekable) → ห้ามใช้ `Math.random()` / `Date` (ใช้ `rnd(k)` ถ้าต้องสุ่ม).
ผืนงาน 1080×1920 px, (0,0) มุมซ้ายบน. สี: `ACC` `SKY` `DEEP` (ฟ้า), `NAVY` (ตัวอักษรบนพื้นสว่าง), `GOOD` เขียว, `BAD` แดง — มาจาก brand.json.

## ลำดับในไฟล์

```js
/* 1 · <คำพูด> */                         // หนึ่งบล็อกต่อหนึ่งก้อนซับ เรียงตามเวลา
blurIn(2.0);                               // กล้อง (ถ้ามี)
cap({t0, t1, top, lead, key, tail}); keyHit(tKey);
{ const w = widget(css, t0, t1, {...}); gpill(w, ...); hand(w, ...); }   // วิดเจ็ต (ถ้ามี) ในวงเล็บปีกกา
```

## ซับ (ใต้คาง)

```js
cap({t0, t1, top: 1150, lead: [['เวลาเรา', .05]], key: [['มีไอเดีย', .47]], tail: [['ที่อยากจะ', 1.0], ['เริ่มทำธุรกิจ', 1.36]],
     size: {l: 52, k: 140, t: 46}, maxW: 980, out: 'blur'});   // คืน element; .keys = [element ของคำใหญ่]
```
- `lead` / `key` / `tail` = รายการ `[ข้อความ, เวลาขึ้น]` (หรือ string เดียว = ขึ้นที่ `t0`). ทั้งสามแถวไม่บังคับ — ไม่มี `key` = แถวอยู่กลาง.
- **lead** ตัวเอียงขาว 52 px ชิดซ้ายของคำใหญ่ · **key** Kanit Black Italic 140 px ไล่ขาว→ฟ้า→น้ำเงิน ขอบขาว ปาดเข้าจากซ้าย 0.3 วิ · **tail** 46 px ชิดขวา.
  คำสั้นมาก (≤ 4 ตัว เช่น "เฮ้ย!") ขยาย `size.k` ได้ถึง 170–180. ช่วงที่มี UI ใต้ซับและที่ว่างน้อย ให้ใช้แค่ `lead` (UI เล่าแทน). ก้อนกว้างเกิน `maxW` ย่อเอง.
- `t1` = เวลาก้อนถัดไป − 0.02; ก้อนสุดท้ายให้ `t1` เกินความยาวคลิป. ออกแบบเบลอจาง 0.15 วิ (`out: 'cut'` = หายทันที).
- ซับที่เริ่มในช่วง `screen()` ถูกซ่อนอัตโนมัติ (screen มีข้อความของตัวเอง). ซับในช่วง `cutaway()` แสดงปกติ.
- `keyHit(t, db = -22)` เสียง softswish — ใส่ทุกคำใหญ่.

## กล้อง

```js
zoom(t, z, d = .35)          // ซูมเฉพาะคลิป (ซับ/วิดเจ็ตไม่ขยับ) แบบนุ่ม; 1.04–1.10 แล้วกลับ 1.0
blurIn(t, {px: 24, d: .32, z: 1.05})              // เบลอ→ชัด ที่ต้นประโยค/เรื่องใหม่ (+ whoosh เบา)
whip(t, {dir: 'up'|'down'|'left'|'right', px: 48, dist: 110, d: .34})   // ภาพเบลอทิศทางวิ่งออกแล้วเข้า — t = กลางทรานสิชัน
push(t0, t1, {z: 1.6, x: 540, y: 1150, d: .38, blur: 8})   // ดันเข้าทั้งภาพ (คลิป+ซับ+วิดเจ็ต) ที่จุด x,y แล้วถอยออกที่ t1
shake(t, {d: .35, a: 14})    // สั่นสั้น ๆ + thud
flash(t, o = .6)             // แฟลชขาว (ใช้น้อยมาก)
```
`push` เหมาะกับ "ซูมเข้าไปดูวิดเจ็ต/คำเด็ด" (ref: ดันเข้า 2 เท่าที่การ์ด "PAID OFF"); ระหว่าง push ทั้งภาพเบลอเล็กน้อยตอนเข้า/ออก.

## วิดเจ็ต

```js
const w = stack(top, width, height, t0, t1, {enter: 'rise'|'pop'|'left'|'right'|'down'|'none', exit: 'blur'|'pop'|'cut', sound: 'softswish'|null});   // กึ่งกลางจอ (แนะนำ)
const w = widget('left:..;top:..;width:..;height:..', t0, t1, {...});   // วางเอง (เฉพาะเมื่อต้องอยู่ข้างหัว)
```
กล่องบนชั้นซับ. `stack()` = กึ่งกลางแกน x 540 ให้ซับกับ UI เป็นก้อนเดียว. `enter: 'none'` = ให้ลูก ๆ เข้าเอง (ตั้ง `sound: null`).
ทุกพิกัดของลูกอิงมุมซ้ายบนของ widget. **วิดเจ็ตห้ามซ้อนเวลากัน** (เอนจินโยน error) — ซับซ้อนกับวิดเจ็ตได้.

### คอมโพเนนต์หลัก (ดูเป็นหน้าจอแอปจริง — ใช้ก่อน)

| ตัวช่วย | ทำอะไร |
|---|---|
| `gcard(w, t, css, {icon, iconBg, title, sub, w: null\|px, tone: 'dark'\|'light'\|'blue', head: true, rows: [{icon, text, t, strike}], rowH: 104})` | การ์ดกระจก: หัว (ไอคอนแอป + หัวข้อ + รอง) + แถวที่ขึ้นตรงคำ — **การ์ดขยายตามแถว** และกว้างพอดีเนื้อหา (`w: null`). คืน `c.rowY(k)`, `c.badgeX` ให้ `hand()` เล็ง |
| `versions(w, [{icon, title, sub, t}], css, {w: 600, step: 24})` | การ์ดซ้อนเป็นสำรับ: ใบใหม่ลงบนสุด ใบเก่าถอยหลังและจาง (v1 → v2 → v3, ทำซ้ำ, แก้ไปเรื่อย ๆ) |
| `compare(w, t, css, {a: {icon, iconBg, title, sub}, b: {...}, tB, w: 900, iconSize: 132})` | ก่อน → หลัง สองการ์ด + ลูกศร; b ขึ้นที่ `tB` |
| `hand(w, [[t,x,y],...], [clickT,...], {size: 88})` | มือชี้ (ปลายนิ้ว = x,y) เลื่อนตามจุด, กด = ย่อ + วงคลื่น + click |
| `progress(w, t, css, {img, title, label, from, to, tFill, dFill, pct: false, w: 760})` | การ์ดฟ้า + แถบเติม (+ % เฉพาะเมื่อมีความหมายจริง) |
| `loopRing(w\|screen, t, cx, cy, r, {t1, color, sw, period})` | ลูกศรวงกลมหมุน — วนซ้ำ/ติดลูป |
| `bigWord(parent, text, t, css, {size: 150, onLight})` | คำใหญ่ไล่สีที่ไหนก็ได้ (`onLight` = โทนน้ำเงินสำหรับพื้นสว่าง เช่น screen) |

### ชิ้นเสริม

| ตัวช่วย | ทำอะไร |
|---|---|
| `gpill(w, text, t, css, {icon: 'check'\|'x'\|'shield'\|<lucide>\|null, size: 54, from, tone, glint})` | ป้ายกระจกเดี่ยว + badge + แสงวิ่ง |
| `bubble(w, icon, text, t, css, {size: 56, side})` | ฟองแชตขาว badge ไอคอน + คำสีฟ้า |
| `recommend(w, text, t, css, {tFill, dFill, rot, size, burstWith: 'sparkles'\|null})` | ป้ายขาว → สีฟ้าปาดเต็ม + ไอคอนแตก (ใช้แทนซับตอนคำเน้นหนัก ๆ) |
| `polaroid(w, src, caption, t, css, {w, h, tag, rot})` · `viewfinder(w, src, t, css, {w, h})` · `pic(w, src, t, css)` | รูปจากผู้ใช้ |
| `burst(w, icon, t, x, y, {n, r})` · `flyers(w, icon, t, x, y, {n, dx, dy})` | badge ไอคอนแตกออก · บินออก (`'banknote'` = เงินหาย) |
| `tile(w, icon, t, css, {size, tone})` · `appIcon(icon, size, bg)` (คืน HTML) · `badge(icon, size)` (คืน HTML) | ไอคอนในกล่องกระจก · ไอคอนแอป · วงกลม badge |
| `glass(w, css, {tone, radius})` · `label(w, text, t, css, {size, color, font})` · `typeText(w, text, t, css)` · `cross(w, t, css)` | แผงกระจก · ข้อความ · พิมพ์ทีละตัว · กากบาท |
| `popIn` `punch` `wobble` `float` `A` `div` `ico` `svg` `draw` `ripple` | พื้นฐาน |

**ไอคอน: Lucide เท่านั้น — ห้ามอีโมจิ** (ตัวช่วยทุกตัวโยน error ถ้าส่งอย่างอื่น). ที่มีในเอนจิน:
`check x shield-check circle-check circle-x circle-help pointer hand house flame gavel file-text umbrella trending-up trending-down heart thumbs-up thumbs-down
smile frown wallet piggy-bank banknote coins credit-card shopping-cart store calendar clock hourglass phone mail rocket lock key user users
message-circle bell star target search lightbulb sparkles zap triangle-alert circle-alert shield-alert badge-percent tag gift chart-column eye ban
list-checks award trophy medal crown flag car plane briefcase graduation-cap stethoscope pencil pen-line globe repeat refresh-cw building-2 party-popper siren bomb`.
เพิ่มเอง: ดาวน์โหลด `https://cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/<name>.svg` แล้ว `ICONS['name'] = '<path …/>…'` (เฉพาะข้างใน `<svg>`) ที่บรรทัดแรกของ timeline.js.

## screen — หน้าคนพูดหดเป็นไอคอนแอปบนพื้นฟ้า

```js
const s = screen(t0, t1, {face: [cx, cy, size], to: [540, 520, 420], r: 70, d: .42, bg: 'sky'|'white'|'deep', out: 'grow'|'cut'});
label(div('left:0;width:1080px;top:800px;display:flex;justify-content:center', s), 'หัวข้อ', t, 'position:relative', {size: 66, color: NAVY, font: 'UiBold'});
loopRing(s, t, 540, 520, 280);                                         // (ถ้าความหมายคือวนซ้ำ)
bigWord(s, 'คำใหญ่', t, 'top:975px', {size: 180, onLight: true});
srow(div('left:0;width:1080px;top:1250px;display:flex;justify-content:center', s), 'circle-help', 'ใช่หรือไม่?', t, 'position:relative', {size: 52});   // ไอคอนเด้ง + ข้อความพิมพ์; mark = วงล้อม
```
- `face` = สี่เหลี่ยมจัตุรัสในคลิปที่จะเก็บไว้ (กลาง x,y และขนาด — ครอบหัวถึงคาง จาก grid.jpg), `to` = ตำแหน่ง/ขนาดของไอคอนบนจอ.
- `out: 'grow'` (ค่าเริ่ม) ไอคอนขยายกลับเต็มจอใน `d` วินาทีสุดท้าย — ข้อความจางออกก่อนหน้านั้น (`t1 − d − 0.16`) ดังนั้น **ทุก srow ต้องขึ้นก่อนเวลานั้น**;
  ถ้าคำพูดแน่นจนท้ายฉาก ใช้ `out: 'cut'` (ตัดกลับเต็มจอแบบเบลอ→ชัด).
- ซับที่เริ่มในช่วงนี้ถูกซ่อน → ข้อความบน screen ต้องครอบคลุมคำพูดช่วงนั้น. ข้อความจัดกึ่งกลางเป็นก้อนเดียวใต้ไอคอน. ความยาวที่ดี 2–4.5 วิ.

## cutaway — ภาพเต็มจอ ขอบกระดาษฉีก

```js
cutaway(t0, t1, {src: 'img/x.jpg' /* หรือ clip: '<name>', from: 0 */, torn: true, papers: 8, seed: 5, drift: .06});
cap({...});   // ซับในช่วงนี้แสดงทับภาพตามปกติ
```
ใช้เมื่อมีรูป/คลิปจริงของเหตุการณ์ที่พูดถึงเท่านั้น. ภาพเข้าแบบซูม 1.16→1 + เบลอ→ชัด, กรอบกระดาษปิดเข้ามา, กระดาษ `papers` แผ่นบินเข้าเกาะขอบ, เสียง paper + whoosh. ความยาวที่ดี 1–3 วิ.
`clip:` ใช้เฟรมจาก `scripts/prep_broll.sh <P> <video> <name> [start] [dur]`. `seed` เปลี่ยนรูปขอบฉีก.

## เสียง

`sfx(name, t, db, pitch?)` — ชื่อที่มี: `softswish whoosh whoosh_long swipe pop pop_hi pop_lo click tick glint paper thud stamp sub swell ding riser`.
ส่วนใหญ่ใส่ให้อัตโนมัติ (ดูตารางใน standards.md); ใส่เองเฉพาะจังหวะปิดคลิป (`sub`) หรือจุดพิเศษ.

## กับดักที่พบบ่อย

- **กระจก (backdrop-filter) เบลอไม่ติด** ถ้ามี element แม่ที่ค้าง `opacity < 1` หรือ `filter` — อย่าใส่ opacity/filter ค้างไว้บน widget หรือ div ที่ห่อ gpill/progress/glass/tile.
  (ตัวช่วยทุกตัวจบ animation ที่ opacity 1 / filter none ให้แล้ว)
- **keyframe แรก = สถานะก่อนเริ่ม** (fill `'both'`); element ที่สร้างด้วย `div()` เฉย ๆ จะโผล่พร้อม widget — ใส่ `opacity:0` + `popIn` ถ้าอยากให้ขึ้นทีหลัง.
- **สอง animation บน transform เดียวกันทับกัน** — punch/wobble ใช้ `.inner` ของ holder (bubbleE/polaroid/recommend/emo/tile) ไม่ใช่ตัว widget.
- **ขนาดที่ขึ้นกับฟอนต์** (ความกว้างข้อความ) รู้ได้หลังโหลดฟอนต์ — ถ้าต้องวัด ใส่โค้ดใน `FITS.push(() => {...})` (รันตอน seek ครั้งแรก) และห้ามเรียก `sfx()` ในนั้น.
- **ตำแหน่งเทียบหัว** — ตรวจกับเฟรมที่ zoom/push มากที่สุดของช่วงนั้น. ซับ+วิดเจ็ตต้องไม่เลยล่าง y 1620 (UI ของแอป) และไม่ทับปาก/ตา.
- **ป้าย/ฟองไม่ตัดบรรทัด** — ข้อความยาวให้ลด `size` หรือแยกเป็นสองป้าย.
- **ไอคอนผิดชื่อ** = error `not a Lucide icon` → ใช้ชื่อจากรายการข้างบนหรือเพิ่มเข้า `ICONS`.
