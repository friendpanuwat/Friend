# HANDOFF — glow-line-motion · ไอคอน `-pro` + ตัวปรับท่าขยับกลาง

อัปเดตล่าสุด: 2026-11-12 · branch `ccr-5f414913-nr4ptm` (push แล้ว; ชุด 1–13 + people.js merge แล้วใน PR #19/#20;
ชุด 14–18 + เอกสาร = **PR #21** (ผู้ใช้สั่งเปิด, รอ merge). PR ใหม่เปิดเมื่อผู้ใช้สั่งเท่านั้น). Default branch ของ repo คือ `ccr-045810ba-gj4imq`.
คุยกับผู้ใช้เป็นภาษาไทย สุภาพ ลงท้าย "ครับ". ผู้ใช้สั่งงานจากมือถือ — ห้ามขอให้เขารันคำสั่งเอง, ส่งไฟล์ผ่าน SendUserFile.

## สถานะ: ไอคอน `-pro` ครบแล้ว — ชุด 1–18 ผู้ใช้ตอบ "ผ่าน" ทุกชุด

- วาดไอคอนที่ CutPack ใช้ (Lucide 308 ชื่อ, รายชื่อ `references/cutpack-icon-list.txt`) ใหม่เป็น `-pro` แล้ว **298 อัน**; พักไว้ (อวัยวะ) 10 อัน.
- ไอคอนชุดนี้ **ยังไม่ได้เชื่อมเข้า CutPack** (CutPack ใช้ Lucide 24×24 คนละระบบ) — บอกผู้ใช้ไปแล้ว.
- ผู้ใช้ **ไม่ให้ย้อนแก้ชุด 1–17** ให้เป็นลายเส้นแบบใหม่ ("ไม่ต้องย้อนกลับไปแก้").

## ▶ งานถัดไป: ตัวปรับท่าขยับกลาง (ผู้ใช้ตอบ "สนใจ" แล้วสั่งทำ handoff — **ยังไม่ได้เริ่มเขียนโค้ด**)

ที่มา: ผู้ใช้ถามว่า motion graphic ทุกอันปรับ parameter ได้ไหม → ตอบว่า "ตอนวาง" ปรับได้ (ตำแหน่ง ขนาด เวลาเริ่ม ท่าออก เวลาออก,
ทั้งคลิป: ขนาดจอ แสงเรือง สี) แต่ **รายละเอียดท่าขยับ** (แกว่งกว้างแค่ไหน วนรอบละกี่วิ เด้งแรงแค่ไหน, เลือกชิ้นที่ขยับ) ต้องแก้โค้ด rig ทีละอัน
→ เสนอ "ตัวปรับกลาง" ที่ใช้ได้กับทุกไอคอนโดยแก้ตัวกลางของระบบ ไม่ต้องไล่แก้ทีละอัน → ผู้ใช้: **"สนใจ"**.

**⚠ ข้อเท็จจริงที่ต้องแก้ก่อน (บอกผู้ใช้แล้วในแชทปิดท้าย):** `GL.art(fn, { ts })` กับไอคอน `-pro` **เลื่อนแค่เวลาเริ่ม** ของแต่ละท่า —
ความยาวคีย์เฟรม/รอบ `loop` ไม่ถูกคูณด้วย `ts` (`on()` ใน pro*.js = `G.kf(el, p.t0 + start * p.ts, spec)`; `kf`/`setT` ใช้เวลาคีย์เป็นวินาทีตรง ๆ;
ท่าออก `leave()` ก็ไม่คูณ). ดังนั้น "ความเร็ว" ของ rig ตอนนี้ปรับไม่ได้จริง.

### สิ่งที่จะทำ (ทั้งหมดใน `assets/glowline.js` — ไม่แตะ rig ทีละอัน)
ใน `art()` มี `i0 = items.length` ก่อน `fn(p)` อยู่แล้ว → ทุก item `type: 'kf'` ที่ index ≥ i0 เป็นของไอคอนนี้ ปรับมันหลัง `fn(p)` ได้เลย:

| ตัวเลือกใหม่ใน `GL.art(fn, {...})` | ทำอะไร | วิธี |
|---|---|---|
| `speed` (ค่าเริ่ม 1; 0.5 = ช้าลงครึ่ง) | ช้า/เร็วทั้งไอคอน: ท่าเข้า ท่าวน ท่าออก | คูณเวลาคีย์ทุก track และ `loop` ด้วย `1/speed`; เลื่อน `start` เป็น `at + (start - at)/speed`; `ready` และ `EXIT.dur` + เวลาคีย์ท่าออกคูณด้วย |
| `amp` (ค่าเริ่ม 1; 0 = ไม่ขยับ, 1.5 = แรงขึ้น) | ความแรงของ**ท่าวน** | เฉพาะ kf ที่มี `loop > 0`: `r x y ky` → `v * amp`; `s sx sy` → `1 + (v - 1) * amp`; **ไม่แตะ** `o` `draw`; **ข้าม track ที่ค่าแรก ≠ ค่าสุดท้าย** (หมุนสะสม เช่น เฟือง/เข็ม 360°, ขีดถนนไหล `x: 0→-80`) ไม่งั้นรอยต่อรอบจะกระตุก |
| `loop: false` (หรือ `still: true`) | ปิดท่าวน — โผล่ด้วยท่าเข้าแล้วนิ่ง (ยังมีท่าออก) | kf ที่มี `loop > 0` ให้ค้างที่ค่า ณ `pose` วินาทีในรอบ (ค่าเริ่ม 0) แทนการวน |
| (ทั้งคลิป) `GL.stage({ speed, amp })` หรือ `GL.motion({...})` | ค่าเริ่มของทุกไอคอนในคลิป | `art()` ใช้ค่าจาก stage ถ้าไม่ได้ส่งมา |
| (ไอคอนธรรมดา non-rig) | `amp` คูณ `sp.amp` ของ LOOP (`bob sway swing …`), `speed` หาร `period` | ใน `art()` ส่วน `spec` |

**จุดที่ต้องระวัง**
- `globe-pro` (pro14.js) วาดเส้นเมริเดียนผ่าน `HOOK` ที่ห่อ `window.setT` ด้วยเวลา `T = 2.4`, `start` ของตัวเอง — `speed`/`loop:false` จะไม่มีผลกับเส้นนั้น
  ต้องให้ HOOK อ่านค่าจาก art (เช่น เก็บ `p.motion = { speed, still }` ไว้บน Pen แล้วให้ rig อ่าน) — แก้ rig นี้อันเดียว.
- `loop:false` ค้างที่ `u = 0`: บางไอคอนตอนต้นรอบ "ยังไม่มีเครื่องหมาย" (calendar-check/x: วง+ติ๊ก `draw 0`, egg: รอยร้าว `draw 0`, clipboard-check, file-text บรรทัด)
  → ทำแผ่นตรวจ 298 อันแบบ `loop:false` ดูทีละแผ่น แล้วใส่ `fn.pose = <วินาทีที่ภาพสมบูรณ์>` เฉพาะอันที่ดูไม่ครบ (art ใช้ `fn.pose` เป็นค่าเริ่ม).
- ท่าวนบางอันทำหน้าที่ "โชว์ของ" (party-popper กระดาษสี, receipt พิมพ์, piggy-bank เหรียญ) — `amp` ไม่ควรทำให้ของหายหรือล้นกรอบ ±200 → ตรวจที่ `amp 1.5`.
- `check_icons.js` ต้องผ่านเหมือนเดิม (ค่าเริ่มทุกตัว = 1 → ผลเดิมทุกพิกเซล). ทดสอบเพิ่ม: render แผ่นเดิม 1 แผ่นด้วยค่าเริ่ม แล้วเทียบกับไฟล์เดิมว่าเหมือนกัน.
- "เลือกชิ้นที่จะขยับ/ไม่ขยับ" (เช่น ล้อหมุนแต่ตัวรถไม่เด้ง) **ทำจากตัวกลางไม่ได้** เพราะชิ้นใน rig ไม่มีชื่อ → ระยะ 2: เพิ่ม `name` ใน `on()` เฉพาะ rig ที่ผู้ใช้ขอ
  แล้ว `GL.art(..., { mute: ['body'] })`. บอกผู้ใช้ตรง ๆ ว่าเป็นงานรายไอคอน.

### ขั้นตอนส่งงานรอบนี้
1. เขียนโค้ดใน `glowline.js` + อัปเดต `references/api.md` (ตาราง `art`) + SKILL.md หัวข้อ "ปรับค่าอะไรได้บ้าง".
2. `node scripts/check_icons.js` → `done 298` ไม่มี LEAK.
3. ทำแผ่นสาธิต `examples/motion-controls.html`: ไอคอนเดียวกัน 3–4 อัน (เช่น bus, bell, flower, timer) แถวละค่า
   `amp 0.5 / 1 / 1.5`, `speed 0.5 / 1 / 2`, `loop:false` → **ภาพนิ่ง + วิดีโอ** ส่งผู้ใช้ พร้อมอธิบายภาษาไทยง่าย ๆ ว่าสั่งยังไง
   (ผู้ใช้ไม่เขียนโค้ด — เขาจะพิมพ์บอก เช่น "ให้รถช้าลงครึ่งหนึ่ง ไม่ต้องเด้ง" แล้ว Claude ใส่ค่าให้).
4. ตรวจ `loop:false` ทั้ง 298 (แผ่นละ 20 ใช้ `GL.PRO2…PRO18` + ชุด 1 จาก `pro.js`) → ใส่ `fn.pose` ที่จำเป็น → รายงานว่าแก้อันไหน.
5. commit + push, รอผู้ใช้ตอบ.

## พักไว้ — อวัยวะคน (ผู้ใช้: "พวกมือ หู หรืออวัยวะต่าง ๆ พักไว้ก่อน ... เพราะคุณวาดพวกนี้ได้ไม่ค่อยดีเท่าไร")
heart-handshake · thumbs-up · hand · footprints · hand-heart · hand-helping · ear-off · hand-coins · hand-metal · scan-eye (ตา — "ข้ามก่อน")
+ 4 อันเก่าที่ยังไม่ได้ลดรายละเอียดตามกฎ: handshake ear thumbs-down biceps-flexed. **ห้ามแตะจนกว่าผู้ใช้สั่ง** — ถ้ากลับมาทำ เสนอแนวทางเป็นภาพก่อน.
**ไม่นับเป็นอวัยวะ (ทำได้ปกติ):** หน้าอิโมจิ, คนทั้งตัว, คนครึ่งตัว.

## ประวัติการตัดสินใจเรื่องลายเส้น (สำคัญ — อย่าเสนอซ้ำ)

- ชุด 14: ผู้ใช้ "เหมือนงาน canva" → ลอง **style v2** (เส้นหนา sw 5 + ชั้นแสงเบลอ + ฉากประกอบ + มุม 3/4, `examples/style-v2.html`, `motion/…/style-v2/`)
  และ **light 3D** (ด้านข้าง/ความหนา/เหลี่ยมนูน, `motion/…/light-3d/`) → ผู้ใช้ **"สรุปคือเอาแบบเดิม"** ไม่เอาทั้งคู่.
- ชุด 15: **"เพิ่มรายละเอียดเล็ก ๆ น้อย ๆ แต่อย่าให้รกเกิน"** (`motion/…/detail15/`); แครอท "เส้นเลยออกมาจากตัว" →
  **กฎ: รายละเอียดข้างในต้องอยู่ในขอบวัตถุ** (คำนวณจากขอบจริง เว้นเข้าไป ~8px).
- ชุด 18: ผู้ใช้ส่งภาพอ้างอิง 13 แผ่น ("20 … IDEAS") **"อยากได้ลายเส้นและความละเอียดประมาณนี้ แต่ยังคงโปร่งแสง"** → **ref detail**
  (`examples/ref-detail.html`, `motion/…/ref-detail/`) → ผู้ใช้ **"ทุกอย่างใช้อันใหม่หมด ยกเว้นพระจันทร์กับเต็นท์"**; แล้วสั่ง **รถบรรทุกกลับเป็นแบบก่อนหน้า**.
  ⇒ **ไอคอนใหม่ทุกอันใช้ ref detail** (`pro18.js`: `W()` เส้นรายละเอียดสีขาว sw 1.4–2.4, `F()` เส้นขอบ 3–3.2 + ถมดำโปร่ง, ใส่โครงจริงมากขึ้น);
  ยกเว้นที่ผู้ใช้เลือกแบบเดิม: `moon-pro`, `tent-pro`, `truck-pro`.
- ทิศทางที่ไม่ถูกเลือกก่อนหน้า (เก็บไว้เฉย ๆ): `detail.js` (-hd/-mn), `sets.js`, วัสดุสีเงิน, `examples/house-style.html`.

## ไฟล์ไอคอน (`assets/`, โหลดตามลำดับใน loader ท้าย `glowline.js`)

| ไฟล์ | ชุด | ไอคอน |
|---|---|---|
| `pro.js` | 1 | heart bell alarm bulb mail rocket growth gears target notify — แบบอย่างความละเอียดชุดแรก |
| `pro2.js` | 2 | user* sparkles brain check triangle-alert message-circle coins package trending-down briefcase |
| `pro3.js` | 3 | bookmark circle-help users* eye utensils-crossed search handshake† infinity image user-plus* tag wallet calendar repeat book-open ear† fish crown message-circle-question share-2 |
| `pro4.js` | 4 | book languages trash-2 user-check* circle-check x thumbs-down† puzzle biceps-flexed† heart-pulse zap banknote store bookmark-check arrow-right message-circle-warning video graduation-cap octagon-alert shield |
| `pro5.js` | 5 | heart-crack heart-off map-pin lightbulb-off battery-low droplets utensils award message-circle-heart arrow-down arrow-up phone lock star arrow-left-right link quote send pen-line printer |
| `pro6.js` | 6 | circle-alert lock-open eye-off flag megaphone trophy hourglass arrow-down-up chevrons-left-right phone-off pin rewind sliders-horizontal |
| `pro7.js` | 7 | smile frown |
| `pro8.js` | 8 | chart-column shield-check angry leaf weight badge-percent building factory medal package-open headphones message-square box gift palette user-x* key glasses activity droplet |
| `pro9.js` | 9 | dumbbell salad building-2 clipboard-list gem scale shopping-cart signature tags calendar-days clock history |
| `pro10.js` | 10 | arrow-down-right arrow-left arrow-up-right chart-bar chart-line chart-no-axes-combined chart-pie divide equal gauge minus move-right plus redo-2 refresh-cw rotate-ccw sigma undo-2 at-sign bell-off |
| `pro11.js` | 11 | bell-ring camera clapperboard film messages-square mic mic-off music newspaper pause play radio tv archive file-question folder folder-open inbox kanban keyboard |
| `pro12.js` | 12 | laptop library list-checks list-ordered list-todo microscope monitor notebook notebook-pen pencil school brush camera-off dice-5 gamepad-2 key-round lamp paintbrush recycle ruler |
| `pro13.js` | 13 | scissors shirt sofa ticket umbrella accessibility baby contact-round* person-standing user-round* users-round* ban circle-x shield-alert shield-x siren square-check annoyed laugh meh — **`GL.parts.human`** |
| `pro14.js` | 14 | party-popper smile-plus bus car church compass flower globe hospital house map mountain navigation plane ship sprout tent train-front trees star-off — globe ใช้ `HOOK`; `puff()` |
| `pro15.js` | 15 | wand-sparkles apple battery-charging battery-full bed bed-double bike cigarette-off glass-water pill stethoscope thermometer zap-off banana beef cake candy carrot chef-hat cherry — `zee()` `STAR4` `ZAP` |
| `pro16.js` | 16 | citrus coffee cookie cooking-pot croissant cup-soda egg grape ice-cream-cone pizza sandwich soup wheat bot cloud code cog cpu database filter — `steam()` |
| `pro17.js` | 17 | hammer link-2 plug power qr-code wifi wifi-off wrench badge-dollar-sign calculator circle-dollar-sign clipboard-check contact credit-card file-text goal id-card landmark percent piggy-bank — `DOLLAR()` `bust()` `WAVES` |
| `pro18.js` | 18 (6+5) | presentation receipt shopping-bag truck‡ calendar-check calendar-x moon‡ sun sunrise sunset timer — **แบบ ref detail** (`W()` `F()` `calendar()` `cell()` `rays()`) |
| `people.js` | — (โหลดท้ายสุด) | user แบบใหม่ แทนทุกอันที่มี `*` — **`GL.parts.bizUser`** |

`*` = ถูก `people.js` ทับแล้ว · `†` = อวัยวะที่พักไว้ · `‡` = แบบเดิมตามที่ผู้ใช้เลือก. ทุกชื่อ Lucide เรียกได้ทั้ง `<ชื่อ>` และ `<ชื่อ>-pro` (ตัวเก่า = `<ชื่อ>-basic`).

## กฎของผู้ใช้ (สะสมทั้งหมด — สรุปใน `references/style.md` §0 และ SKILL.md ด้วย)

**รูปทรง / รายละเอียด**
1. ทรง = แบบ `-pro`. **ห้ามเปลี่ยนแนวเองโดยไม่ถาม.** ไอคอนใหม่ = ref detail (ดูประวัติข้างบน).
2. ใส่รายละเอียดเล็ก ๆ ที่วัตถุมีจริงเสมอ แต่ไม่รก — ไม่ใส่ตะเข็บเส้นประ, หมุดเรียงแถวประดับ, วงขีดรอบวงกลม, เส้นขอบในซ้อน 2 ชั้น, กระดุม, บาร์โค้ด, ตัวหนังสือจิ๋ว.
3. **รายละเอียดข้างในต้องอยู่ในขอบวัตถุ** ห้ามแตะหรือเลยเส้นขอบ.
4. ไม่มีแสงสะท้อน "เส้นโค้ง + จุด" (ดูเหมือน "!"), ไม่มีดาวระยิบระยับประดับ (ดาวได้เมื่อเป็นความหมาย).
5. ไม่มีสี — ขาว/เทา/ดำ, ข้างในถมดำ **โปร่งแสง**; ไม่ถมเทา/สีเงิน แม้ภาพอ้างอิงจะถมเทา.
6. **ห้ามลอกภาพอ้างอิง** — เอาแนวคิดมา แล้วออกแบบเอง.
7. คนทั้งตัว → `GL.parts.human(q, 'line', pose)`; คนครึ่งตัว → `GL.parts.bizUser(q, soft)`.
8. ไอคอน "…-off": ขีดฆ่าต้องอยู่ตลอด.

**การขยับ**
9. ทุกไอคอนมี **ท่าเข้า + ท่าวน + ท่าออก**, ท่าออกสะท้อนท่าเข้า.
10. แบบมืออาชีพ: anticipation, overshoot + settle, follow-through, ท่ารอง (เส้นความเร็ว ฝุ่น ขีดคลิก ระลอก), squash & stretch.
11. ห้ามมีชิ้นไหนโผล่ก่อนเวลา — `node scripts/check_icons.js` ต้องได้ `done N` ไม่มี `LEAK`.

**ขั้นตอนการส่งงาน**
12. แก้ใหญ่ / เปลี่ยนแนว → **ส่งภาพนิ่ง (เทียบก่อน-หลัง) ก่อน** แล้วค่อยทำวิดีโอ (ผู้ใช้อาจสั่ง "ทำเป็นคลิปเลย").
13. ส่งทุกรอบแล้ว **รอผู้ใช้ตอบ "ผ่าน"** ก่อนเริ่มรอบใหม่.

## วิธีเขียนไอคอนใหม่ (แบบ ref detail)

คัดลอกหัวไฟล์ของ `pro18.js` (helper ทั้งหมด + `W()` `F()`) แล้วเติมจากไฟล์อื่นที่ต้องใช้ (`follow` pro12, `human` pro13, `bust` pro17 …).

```js
rig('flag-pro', .6, 'rise', p => {           // ชื่อ, เวลาท่าเข้า (วิ), ท่าออก, ฟังก์ชันวาด
  const intro = sub(p), oO = sub(intro), part = sub(oO);   // oO = ท่าเข้า, part = ท่าวน (คนละ group เสมอ!)
  part.path('...', F());                                   // เส้นขอบ 3–3.2 + ถม C.fill
  part.line(..., W(2));                                    // รายละเอียดสีขาว sw 1.4–2.4 (อยู่ในขอบ!)
  on(part, p, .7, { loop: 2.4, ox, oy, r: [[0, 0], [.15, -4, 'out'], [.45, 10, 'out'], [.8, 0, 'soft']] });
  drop(p, oO, 0, -100);                                    // ทุกชิ้นต้องอยู่ใต้ group ที่มีท่าเข้า (คีย์แรก o:0) หรือมี o:0 ของตัวเอง
});
```

- กล่องวาด ±200. ป้ายชื่ออยู่ใต้ไอคอน — อย่าให้ของล้นต่ำกว่า y ≈ 185 หรือเลย ±200 แม้ตอนขยับ.
- คีย์เฟรม: `GL.kf(el, start, { loop, ox, oy, x, y, r, s, sx, sy, ky, o, draw })`, ease `lin in out io back soft`. ก่อนเริ่ม = ค่าคีย์แรก.
- **บั๊กที่ต้องระวังที่สุด: `GL.kf` สองอันบน element เดียวกัน → อันหลังทับ transform ทั้งหมด.** ท่าเข้ากับท่าวนต้องอยู่คนละ group;
  อย่าใส่ kf บน group ที่มี transform ของตัวเอง (ห่อด้วย group ใหม่).
- ท่าวนต้องต่อเนื่องตอนวนรอบ: หมุนครบรอบ/สมมาตร หรือกลับค่าเดิมก่อนจบ loop.
- ท่าออก (`GL.EXIT`): `pop rise sink slide slideL launch spin squash blink fade` หรือ object. จับคู่: หล่นลงมา→`rise`, ลอยขึ้นมา→`sink`,
  เข้าจากซ้าย→`slide`, เข้าจากขวา→`slideL`, จรวด→`launch`, ไฟ→`blink`, หมุน→`spin`, กล่อง/ตึก→`squash`, ที่เหลือ→`pop`.
- helper: `tubes(q, [d…], w)` เส้นกลวงรวมเงาเดียว · `clip(q, d)` clip-path · `follow(pathEl, t0, T)` เดินตาม path ·
  `human()` กลุ่ม `thigh±1 shin±1 upper±1 fore±1 torso head` · `bizUser()` คืน `{ head, body, tie }`.
- ท้ายไฟล์: `Object.assign(G.icons, R)` + ALIAS + `G.PROnn = names.map(n => n + '-pro')`. เพิ่มไฟล์เข้า loader **ก่อน `'people.js'`**.

## ขั้นตอนต่อรอบไอคอน (เปลี่ยนเลข nn เป็นชุดปัจจุบัน)

1. เขียน `assets/pronn.js` + เพิ่มเข้า loader (ก่อน people.js).
2. แผ่น: `sed -e "s/GL.PRO13/GL.PROnn/" -e "s/BATCH 13 · /BATCH nn · /" -e "s/pro13.js/pronn.js/" examples/pro-icons-13a.html > examples/pro-icons-nna.html` (a/b);
   ไม่ถึง 10 อัน → แม่แบบตาราง 4 แถวคงที่ของ `pro-icons-6a.html` (ดู `pro-icons-18a/b.html`).
3. `node scripts/check_icons.js` → ไม่มี LEAK.
4. ภาพนิ่ง: `node scripts/render.js examples/pro-icons-nna.html <scratch>/a --still --at 4.2 --scale 2` → เปิดดู แก้ของล้น/ชน/เส้นเลยขอบ.
5. วิดีโอ (~1 นาที/แผ่น, a กับ b ขนานกันได้): `node scripts/render.js examples/pro-icons-nna.html <scratch>/va --name pro-icons-batchnna`
   ดูท่าวน: `ffmpeg -ss 1.4 -t 4.8 -i x.mp4 -vf "fps=2.5,scale=300:-1,tile=6x2" -frames:v 1 mid.jpg` · ท่าออก: `-ss <ยาว-1.4> … fps=8`.
6. คัดลอก mp4 + still ไป `motion/glow-line-pro-icons/`, อัปเดต HANDOFF, commit + push.
7. ส่งผู้ใช้ + สรุปไทย: ตาราง A/B (ไอคอน · ท่าขยับ), ที่แก้ระหว่างทำ, ความคืบหน้า → รอ "ผ่าน".

## ไฟล์ผลงาน (`motion/glow-line-pro-icons/`)

- วิดีโอ + ภาพนิ่งทุกแผ่น: `pro-icons-grid.mp4` (ชุด 1), `pro-icons-batch2.mp4`, `pro-icons-batch3a/3b … 18a/18b.mp4`, `pro-icons-batch7a.mp4`,
  `pro-icons-people.mp4` + `*-still.png`; `pro-icons-tour.mp4` (ชุด 1 ทีละอันเต็มจอ).
- ภาพเทียบ / ข้อเสนอ: `detail6/` `detail8/` `detail15/` (เพิ่มรายละเอียด, `carrot-fix.png`), `cleanup/`, `user-redesign/`,
  `house-style/` `style-v2/` `light-3d/` (แนวที่ไม่ถูกเลือก), `ref-detail/` (แนวที่ถูกเลือก).

## อื่น ๆ

- push ปกติได้ (fast-forward); `--force-with-lease` เคยถูกปฏิเสธ.
- commit message ลงท้ายด้วยบรรทัด attribution ตามที่ระบบกำหนด; ห้ามใส่ชื่อโมเดลในไฟล์/commit.
- ระบบมี stop hook: ถ้ามีไฟล์ไม่ได้ commit จะเตือน — commit + push ก่อนจบทุกครั้ง.
- ภาพนิ่งปกติ `--at 4.2`; เลือกเวลาที่เห็นท่าเด่นได้ (นาฬิกาทราย 3.2 วิ, ลายเซ็น 2.9 วิ).
- คำสั่ง render ที่ถูกผู้ใช้หยุดกลางทาง: เช็ก `pgrep -af render.js` และสถานะไฟล์ก่อนรันซ้ำ.
