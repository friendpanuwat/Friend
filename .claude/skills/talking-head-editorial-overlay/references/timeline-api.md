# timeline.js API (editorial-overlay)

`timeline.js` คือ JavaScript ธรรมดาที่ถูกแทรกระหว่างเอนจินสองส่วนตอน build — ทุกฟังก์ชันด้านล่างเรียกได้ตรง ๆ.
หน่วยเวลาเป็น **วินาทีของคลิป**; ทุกอย่างคำนวณจากเวลา (seekable) → ห้ามใช้ `Math.random()` / `Date`.
ผืนงาน 1080×1920 px, (0,0) มุมซ้ายบน. ซับและวิดเจ็ตอยู่ชั้นเดียวกันเหนือวิดีโอ — **ไม่ซูมตามกล้อง**.
สีคงที่: `ACC` (accent), `NAVY`, `INK`; แดงสำหรับความหมายลบ `'#FF3B30'`.

## ลำดับในไฟล์

```js
const N = {color: NAVY}, GRAY = '#8A93A6';
for (const [t, z] of [[0, 1], [1.06, 1.06], ...]) zoom(t, z);   // 1) ซูมตัดชน
cap({...}); keyHit(...);                                         // 2) ซับทุกคำพูด (เรียงตามเวลา)
{ const w = widget(css, t0, t1, {...}); ... }                    // 3) วิดเจ็ต ชิ้นละหนึ่งบล็อก { } เรียงตามเวลา
```
**ห้ามใช้ `cards()` / `card()` / `frame()` / `mood()` / `bg:'glass'`** — สไตล์นี้ไม่มีการ์ดเต็มจอและไม่เบลอ.

## ซับ (ระดับอก)

```js
cap({t0, t1, top?, maxH?, lines: [
  [['เวลาลูกค้า', 'l', 0.0], ['ทักมาถาม', 'l', 0.70]],   // หนึ่งบรรทัด = หลาย chunk
  [['รายละเอียด', 'k', 1.06]],                            // [ข้อความ, สไตล์, เวลาขึ้น, {size, color, wipe, type, step}]
]});   // คืน element ของก้อน — ใช้ .querySelectorAll('.ch')[n] หา chunk (เช่นเพื่อ strike)
```
| สไตล์ | ฟอนต์ / ขนาดเริ่ม | ใช้ |
|---|---|---|
| `l` | Mitr Regular 54 ขาว | คำนำ/คำเชื่อม |
| `m` | Mitr SemiBold 84 ขาว | วลีกลาง ๆ ไม่มีคำเด่น |
| `k` / `kw` | Mitr Bold 146 accent / ขาว | คำใหญ่แบบหนัก |
| `i` / `iw` | Sriracha 150 accent / ขาว | คำใหญ่แบบลายมือ (อารมณ์ คำถาม) |
| `hl` | Mitr Bold 116 ดำบนกล่อง accent | การกระทำ/ตัวปัญหา ("ลดราคา", "น้อยลง") |
- `top` ค่าเริ่ม 1150 (ตรวจกับ grid.jpg), กว้าง ≤960 สูง ≤`maxH` 420 ย่อเอง. ก้อนหายแบบตัดที่ `t1` = เวลาก้อนถัดไป − 0.02; ก้อนสุดท้ายให้ `t1` เกินความยาวคลิป.
- `{wipe: true}` ขึ้นทีละตัวแล้วเปลี่ยนขาว→accent · `strike(chunkEl, t, '#111')` ขีดฆ่าคำในซับ.
- ซับต้องครอบคลุม **ทุกคำพูด**; ตัดคำลงท้าย "เนี่ย / อ่ะ / นะเว้ย" ได้ (บอกผู้ใช้).

```js
keyHit(t, db = -22)   // ใส่ทุก k / i / hl
zoom(t, z, d = .001)  // ตัดชน 1.05–1.10 ที่คำใหญ่, กลับ 1.0 ที่ก้อนถัดไป; อย่าเกิน 1.12
sfx(name, t, db, pitch?)
```

## วิดเจ็ต

```js
const w = widget('left:250px;top:170px;width:580px;height:330px', t0, t1, {card: 'white'|'navy'|'accent'|null, radius: 40, sound: 'softswish'|null});
```
กล่อง absolute บนชั้นซับ: เด้งเข้าแบบสปริง (scale .78 + เลื่อนขึ้น 46 px) ที่ `t0`, ย่อหายที่ `t1`. `card: null` = กล่องโปร่ง (ใส่ tile/chip ลอย ๆ) —
ตั้ง `sound: null` เมื่อของข้างในมีเสียงเองแล้ว. ทุกพิกัดของลูก ๆ อิงมุมซ้ายบนของ widget. **วิดเจ็ตห้ามซ้อนเวลากัน** (เอนจินโยน error).

| ตัวช่วยในวิดเจ็ต | ทำอะไร |
|---|---|
| `label(w, text, t, css, {size: 40, color: NAVY, font: 'CardSans'})` | ข้อความเรียบ (ไม่มีเงา) |
| `chipW(w, icon, text, t, css, {bg: ACC, color, size: 44, drop: false})` | ชิปแคปซูลไอคอน+คำ; `drop: true` = ตกลงมาเด้ง + เสียง thud |
| `tile(w, icon, t, css, {size, bg: '#fff'\|ACC\|NAVY\|'#FF3B30', color, sound, float})` | ไอคอนในกล่องมุมมน เด้ง + ลอย; `.inner` สำหรับ punch/wobble |
| `bubble(w, text, t, css, {bg, color, size, side})` | ฟองแชต |
| `skel(w, css, [.9, .55], {t})` | เส้นข้อความจำลอง |
| `bars(w, [..0–1], t, css, {w, gap, h, to, tTo})` · `trend(w, pts, t, css, {w, h, color, sw})` | กราฟแท่ง (เปลี่ยนความสูงได้) · เส้นแนวโน้มวาดเอง |
| `stars(w, 5, filled, t, css, {size})` | ดาวรีวิว |
| `target(w, t, tHit, css, {size})` | เป้า + ลูกศรเข้ากลางที่ `tHit` (ลูกศรยื่นขึ้นขวา ~0.75×size) |
| `cross(w, t, css, {size, sw})` · `num(w, n, t, css)` | กากบาทวาด · ป้ายตัวเลขข้าวหลามตัด |
| `cursor(w, [[t,x,y],...], [clickT], {size})` · `ripple(w, x, y, t, s)` | เคอร์เซอร์ · วงคลื่น |
| `popIn(el, t)` · `punch(el, t, s)` · `wobble(el, t, {a, d})` · `float(el, t0, t1)` | เด้งเข้า · เต้นย้ำ · ส่าย · ลอย |
| `pic(w, 'img/x.jpg', t, css, {anim})` | รูปจากผู้ใช้ในกรอบเล็ก (ใส่ `border-radius;overflow:hidden` ใน css) |
| `ico(name, size, color)` · `div(css, parent, html)` · `svg(w, h, inner, css, parent)` · `draw(path, t, d)` · `A(el, kf, t, d, {e, f})` | พื้นฐาน |

ไอคอน (Lucide): `shopping-cart package package-x star circle-help message-circle message-circle-question wallet tag badge-percent percent
trending-down store credit-card thumbs-down target search lightbulb check x user mouse-pointer-2 coins banknote hand-coins
eye-off ghost clock hourglass scale shield-check bell sparkles arrow-down zap list-checks circle-alert`.
เพิ่มเอง: ดาวน์โหลด `https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/<name>.svg` แล้ว `ICONS['name'] = '<path …/>…'` (เฉพาะข้างใน `<svg>`).

## กับดักที่พบบ่อย

- **keyframe แรก = สถานะก่อนเริ่ม** (fill `'both'`); element ลูกที่สร้างด้วย `div()` เฉย ๆ จะโผล่พร้อม widget — ใส่ `opacity:0` + `popIn` ถ้าอยากให้ขึ้นทีหลัง.
- **สอง animation บน transform เดียวกันทับกัน** — punch/wobble ใช้ `tile().inner` หรือ element ลูก ไม่ใช่ตัว widget.
- **ตำแหน่งเทียบหัว** — ตรวจกับเฟรมที่ซูมมากที่สุดของช่วงนั้น; วิดเจ็ตไม่ซูมตามแต่หัวขยับขึ้น. อย่าวางเหนือ y 120 (แท็บของแอป) — รวมปลายลูกศรของ `target`.
- **ชิป/label ไม่ตัดบรรทัด** — ข้อความยาวให้ลด `size`.
- **สระบนของตัวใหญ่ชนบรรทัดบน** — ตรวจใน preview, แยกก้อนหรือลดขนาด.
