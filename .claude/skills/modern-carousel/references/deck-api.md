# deck.js API (modern-carousel)

`deck.js` คือ JavaScript ธรรมดาที่ถูกแทรกเข้าเอนจินตอน build. **เวลาเป็นวินาทีภายในสไลด์** (0 = สไลด์เข้า).
ผืน 1080×1080 (หรือ 1350 / 1920 ด้วย `SIZE=`); ค่าคงที่ `W`, `H`. พิกัดเป็น px แบบ absolute: ส่ง `pos` เป็น CSS เช่น `'left:80px;top:300px'`.
สีทั้งหมดมาจากธีม + โทนของสไลด์ — ใช้ตัวแปร CSS แทนการใส่ hex: `var(--fg)` `var(--muted)` `var(--acc)` `var(--acc-ink)`
`var(--acc-text)` (accent ที่อ่านออกบนโทนนั้น) `var(--bg)` `var(--bg2)` `var(--line)` `var(--neg)`. ห้ามใช้ `Math.random()` / `Date`.

## สไลด์

```js
slide({tone: 'dark', dur: 3.5}, s => {
  tag(s, 'หมวด', .05, 'left:80px;top:150px');
  title(s, 'พาดหัว\nมีคำ [accent]', .15, 'left:80px;top:250px', {size: 104});
  icon(s, 'rocket', .5, 'left:760px;top:600px', {size: 180, style: 'accent'});
});
```
| ตัวเลือก `slide()` | ความหมาย |
|---|---|
| `tone` | `'dark'` · `'light'` · `'accent'` (พื้น = สี accent, ตัวอักษร = accent_ink) |
| `dur` | ความยาวใน MP4 (ค่าเริ่ม 3.5 วิ) · `still` = เวลาที่ถ่าย PNG (ค่าเริ่ม = ท้ายสไลด์) |
| `chrome` | `false` = ไม่แสดง handle ซ้ายบน + เลขหน้า `01 / 08` ขวาบน + ลูกศร |
| `arrow` | ลูกศรวงกลมขวาล่าง (ค่าเริ่ม: ทุกสไลด์ยกเว้นสไลด์สุดท้าย) |
| `texture` · `glow` | แทนค่าธีมเฉพาะสไลด์: `'grain'`·`'grid'`·`'dots'`·`'paper'`·`'leak'`·`'none'` / `false` ปิด glow |
| `bg` | พื้นกำหนดเอง (CSS) เช่น gradient — ใช้น้อย |

`s` = เวทีของสไลด์ (`s.tone` บอกโทน). ทุก helper คืน element (ใส่ลูกใน `box()` / `phone()` ได้ — พิกัดลูกนับจากมุมกล่อง).

## ข้อความ

```js
title(s, text, t, pos, {size: 92, weight, W: 920, align: 'left'|'center'|'right', lh: 1.14, step: .12, wrap: false, color})
```
- `\n` = ขึ้นบรรทัด (บรรทัดขึ้นทีละบรรทัด, ห่าง `step` วิ). ค่าเริ่มไม่ตัดบรรทัดเอง — แบ่งบรรทัดเองให้สวย (`wrap: true` ให้ตัดตาม `W`).
- markup ในบรรทัด (ใช้หนึ่งจุดต่อสไลด์):

| markup | ผล |
|---|---|
| `[คำ]` | สี accent |
| `{คำ}` | กล่องไฮไลต์ accent (ตัวอักษร accent_ink) ปาดเข้า |
| `((คำ))` | วงกลมวาดมือล้อมคำ |
| `__คำ__` | เส้นใต้โค้ง |
| `~คำ~` | ขีดฆ่าสีแดง (ความหมายลบ/ความเชื่อผิด) |
- ขนาด: ปก 100–124 · สไลด์ปกติ 76–96 · ในการ์ด 48–64. น้ำหนักตามธีม (`title_weight`).

```js
body(s, text, t, pos, {size: 34, W: 820, align, step: .14, color})   // เนื้อความสีจาง; '\n\n' ย่อหน้าใหม่ · **ตัวหนา** · [accent]
num(s, '01', t, pos, {size: 260, weight, count: true, d: 1.1, color})  // ตัวเลขยักษ์ — นับขึ้นใน MP4; '[+]' ทำส่วนนั้นเป็น accent เช่น '5M[+]'
tag(s, 'หมวด', t, pos, {style: 'outline'|'soft'|'solid', dot: false, icon})  // ป้ายหมวดเล็กเหนือพาดหัว
cta(s, 'ทักแชตเลย', t, pos, {icon: 'arrow-up-right', style: 'solid'|'outline'})  // ปุ่ม pill สำหรับสไลด์สุดท้าย
list(s, items, t, pos, {mark: 'num'|'check'|'x'|'icon'|'dot', size: 36, gap: 30, step: .2, W: 860})
//   items: ['ข้อความ', …] หรือ (mark 'icon') [['icon-name', 'ข้อความ'], …]; [accent] ในข้อความได้
```
**ตัวเลขใน `num()` ต้องมาจากผู้ใช้** (หรือเป็นเลขลำดับ 01–09). ห้ามสร้างสถิติขึ้นเอง.

## พื้นผิวและการ์ด

```js
const b = box(s, 'left:80px;top:520px;width:920px;height:380px', t, {style, radius, from: 'up'|'left'|'right'|'scale', fl: false})
//   style: 'glass' | 'solid' | 'outline' | 'accent' | 'paper' (ค่าเริ่มตามธีม) — ลูกใช้พิกัดภายในกล่อง
const sc = phone(s, 'left:600px;top:160px', t, {w: 380, h: 760})   // มือถือจำลอง → คืนหน้าจอ (พื้น var(--bg2))
icon(s, 'rocket', t, pos, {size: 150, style: 'glass'|'accent'|'solid'|'outline'|'plain', fl: true, color})
chip(parent, 'ข้อความ', t, pos, {style: 'soft'|'accent'|'ink', icon})          // ป้ายเล็กในการ์ด / รอบ orbit
notify(s, 'หัวข้อ', 'บรรทัดรอง', t, pos, {icon: 'check'})                         // การแจ้งเตือนเด้งลงจากบน
toggle(parent, on, t, pos, {w: 120, h: 64})                                      // สวิตช์ (on = เปิดตอน t + .35)
skel(parent, pos, [.8, .55], {t, h: 18, gap: 16})                                // เส้นข้อความจำลอง
avatars(parent, n, t, pos, {size: 84, labels: ['ก', 'ข']})                       // วงกลมคนแบบไม่มีรูป
progress(parent, pct, t, pos, {w: 600, h: 18})
photo(s, 'img/x.jpg', t, pos, {radius, focus: '50% 35%', mono: false})           // เฉพาะรูปที่ผู้ใช้ส่งมา
```

## กราฟและกราฟิก

```js
bars(parent, [.3, .5, .9], t, pos, {w: 70, gap: 26, h: 320, hi: last, to: [...], tTo})   // แท่ง hi = สี accent เรือง
line(parent, [[x,y], …], t, pos, {w: 600, h: 300, sw: 7, area: true, dot: true, dash: false, color})  // เส้นเรือง + พื้นไล่
donut(parent, pct, t, pos, {size: 360, thick: 46, label: true})                          // วงแหวน % (ตัวเลขจากผู้ใช้เท่านั้น)
orbit(s, cx, cy, [['icon', 'ชื่อ'], …], t, {r: [210, 360], center: 'zap', size: 170})      // ไอคอนกลาง + วงแหวนประ + ชิปรอบ ๆ
path(s, [[x,y], …], t, pos, {w, h, iconName: 'send', dash: true, color})                 // เส้นประโค้ง + ไอคอนปลาย (เครื่องบินกระดาษ)
coin(s, t, pos, {size: 300, iconName, text, tilt: -14})                                  // เหรียญ 3D มันวาวสี accent
ornament(s, kind, t, pos, {size: 70, color})   // kind: 'asterisk' | 'plus' | 'cross' | 'sparkles' | 'dot' (ค่าเริ่มตามธีม)
glow(s, x, y, {r: 360, o: .5})                 // แสง accent เพิ่มเฉพาะจุด
blob(s, x, y, {r: 560, o: .9})                 // ก้อนไล่สีมีเกรน (ลุค cobalt)
cursor(s, [[t,x,y], …], [clickT])              // เคอร์เซอร์ (เห็นการเคลื่อนเฉพาะ MP4)
```
แอนิเมชันพื้นฐาน: `popIn(el, t)` · `rise(el, t)` · `punch(el, t)` · `float(el, t0, t1)` (ลอย = รีเซ็ตใน PNG) · `ripple(parent, x, y, t)`
· `A(el, keyframes, t, d, {e, f, idle})` · `svg(w, h, inner, pos, parent)` + `draw(path, t, d)` · `div(css, parent, html)` · `ico(name, size, color)`.

ไอคอน (Lucide): `activity arrow-down arrow-down-right arrow-left arrow-right arrow-up arrow-up-right asterisk at-sign award
banknote book-open bookmark bot brain briefcase building-2 calendar camera chart-bar chart-column-increasing chart-line chart-pie
check check-check chevron-down chevron-right circle-alert circle-check-big circle-help circle-x clipboard-check clock cloud code
coins compass cpu credit-card database eye eye-off file-text flag flame frown gauge ghost gift globe graduation-cap hand-coins
handshake hash heart hourglass image infinity info key layers layout-grid leaf lightbulb link list-checks list-ordered loader
lock mail map-pin megaphone message-circle message-square mic minus monitor moon mouse-pointer-2 move-right package palette
pen-tool percent piggy-bank play plus puzzle quote receipt refresh-cw repeat-2 rocket scale search send settings share-2
shield-check shopping-bag shopping-cart sliders-horizontal smartphone smile sparkles star store sun tag target thumbs-down
thumbs-up timer toggle-left toggle-right trending-down trending-up trophy truck user user-plus users video wallet wand-sparkles
wifi x zap`. เพิ่มเอง: `ICONS['name'] = '<path …/>'` (ข้างใน `<svg>` จาก `cdn.jsdelivr.net/npm/lucide-static@0.460.0/icons/<name>.svg`).

## กับดัก

- **PNG = สถานะท้ายสไลด์**: ของที่ตั้งใจให้หายไปจะไม่อยู่ใน PNG; ตัวเลข `num()` แสดงค่าสุดท้าย.
- **พาดหัวไม่ตัดบรรทัดเอง**: บรรทัดยาวเกินจะล้นขอบ (QC เตือน) → แบ่ง `\n` เองหรือลด `size`.
- **แถบบน 100 px = handle + เลขหน้า**, มุมขวาล่าง 150×150 = ลูกศร (QC เตือนถ้าข้อความทับ).
- **ลูกในการ์ด** ใช้พิกัดภายในการ์ด; `title()` ในการ์ดใส่ `W` ให้พอดีกล่อง และใน `box({style: 'accent'})` ใส่ `color: 'var(--acc-ink)'`.
- **สอง animation บน transform เดียวกันจะทับกัน** → ใช้ `icon().inner` กับ `punch`.
- **สระบน/วรรณยุกต์** ของพาดหัวหลายบรรทัดชนกัน → เพิ่ม `lh` (1.14 → 1.2).
- **orbit**: ชิปรอบนอกต้องไม่เกินขอบ — รัศมีนอก ≤ 360 เมื่อศูนย์กลางอยู่กลางผืน 1080.
