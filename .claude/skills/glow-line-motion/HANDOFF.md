# HANDOFF — glow-line-motion · ไอคอน `-pro` + ตัวปรับท่าขยับกลาง

อัปเดตล่าสุด: 2026-11-12 · branch `ccr-6c2d51f7-mmdaoj` (push แล้ว; ชุด 1–18 + เอกสาร merge แล้วใน PR #19–#22;
ตัวปรับท่าขยับกลาง = branch นี้ **ยังไม่เปิด PR** — เปิดเมื่อผู้ใช้สั่งเท่านั้น). Default branch ของ repo คือ `ccr-045810ba-gj4imq`.
คุยกับผู้ใช้เป็นภาษาไทย สุภาพ ลงท้าย "ครับ". ผู้ใช้สั่งงานจากมือถือ — ห้ามขอให้เขารันคำสั่งเอง, ส่งไฟล์ผ่าน SendUserFile.

## สถานะ: ไอคอน `-pro` ครบแล้ว — ชุด 1–18 ผู้ใช้ตอบ "ผ่าน" ทุกชุด

- วาดไอคอนที่ CutPack ใช้ (Lucide 308 ชื่อ, รายชื่อ `references/cutpack-icon-list.txt`) ใหม่เป็น `-pro` แล้ว **298 อัน**; พักไว้ (อวัยวะ) 10 อัน.
- ไอคอนชุดนี้ **ยังไม่ได้เชื่อมเข้า CutPack** (CutPack ใช้ Lucide 24×24 คนละระบบ) — บอกผู้ใช้ไปแล้ว.
- ผู้ใช้ **ไม่ให้ย้อนแก้ชุด 1–17** ให้เป็นลายเส้นแบบใหม่ ("ไม่ต้องย้อนกลับไปแก้").

## แผนของผู้ใช้: ทำ motion graphics ในแชทแยก แล้วค่อยรวมเข้า CutPack ทีหลัง (2026-11-12) — แชทนี้คือแชทนั้น

- ผู้ใช้จะเปิด **แชทเฉพาะงาน motion graphics (skill นี้)** แยกจากแชท CutPack แล้วค่อยรวมเข้าระบบ CutPack ในภายหลัง (ทำในแชท CutPack).
- ตอนนี้ **CutPack ยังไม่ได้ใช้เอนจิน/ไอคอนของ skill นี้เลย** (CutPack มีเอนจินและระบบขยับของตัวเอง ใน `cutpack/engine/`) และกฎของสองงานต่างกัน
  (เช่น CutPack: "ลอกจากรูปที่ส่ง" · งานนี้: ห้ามลอก) — แชทนี้ทำตามกฎของ skill นี้เท่านั้น **ไม่แตะโฟลเดอร์ `cutpack/`**.
- ออกแบบงานให้รวมง่ายภายหลัง: ฟังก์ชัน/ตัวเลือกใหม่ต้องมีชื่อชัด จดใน `references/api.md`, ไอคอนแต่ละอันเรียกด้วยชื่อ Lucide ได้ (`GL.icons['bus']`),
  ส่งออกได้ทั้ง MP4 / PNG / MOV พื้นใส. ถ้าเจอเรื่องที่ CutPack จะต้องรู้ตอนรวม ให้จดไว้ในหัวข้อนี้.
- ทำ **ทีละแชท** สำหรับไฟล์ของ skill นี้ (หลายแชทแก้ `glowline.js` พร้อมกันจะชนกัน). จบงานแต่ละรอบ: อัปเดต HANDOFF → commit + push → เปิด PR เมื่อผู้ใช้สั่ง.

## ✅ ตัวปรับท่าขยับกลาง — ทำเสร็จแล้ว (2026-11-12) · **รอผู้ใช้ตอบ "ผ่าน"**

ที่มา: ผู้ใช้ถามว่าปรับ parameter ของท่าขยับได้ไหม → เสนอตัวปรับกลาง → ผู้ใช้ "สนใจ" → ทำในแชทนี้ (แชทเฉพาะ motion graphics).
ส่งแล้ว: ภาพนิ่ง + วิดีโอ `motion/glow-line-pro-icons/motion-controls.mp4` / `-still.png` (แผ่น `examples/motion-controls.html`:
bus bell flower timer × แถว ปกติ / amp 0.5 / amp 1.5 / speed 0.5 / speed 2 / loop:false) + วิธีสั่งเป็นภาษาไทย.

**สิ่งที่ทำ (ทั้งหมดใน `assets/glowline.js` + hook ของ globe ใน `pro14.js`; ไม่แตะ rig อื่น)** — รายละเอียด `references/api.md` หัวข้อ "ตัวปรับท่าขยับกลาง"
- `GL.art(fn, { speed, amp, loop, still, pose, ampMax })` · `GL.tune(icon, {…})` (ไอคอนที่จำค่า ใช้ได้ทุกที่ที่รับไอคอน) ·
  `GL.motion({…})` (ค่าเริ่มของไอคอนที่วางหลังจากนี้, คืนค่าเดิม) · `GL.stage({ speed, amp, loop })` (ทั้งคลิป).
- ทำงานหลัง `fn(p)` ใน `art()` กับทุก item ที่ index ≥ `i0` + tween ที่จับไว้ระหว่างวาด (`CAP`) → `applyMove()`; คำนวณ `lastEnd` ใหม่.
  ท่าออก (`leave`) คูณเวลาด้วย `1/speed` ผ่าน `a.speed`. ค่าเริ่มทุกตัว = ผลเดิม **ทุกไบต์** (เทียบ 48 เฟรมจาก 8 แผ่น ก่อน/หลัง).
- `amp`: เฉพาะ kf ที่มี `loop`, track `r x y ky s sx sy`, `v0 + (v−v0)·amp`. ข้าม: ค่าแรก ≠ ค่าสุดท้าย (หมุนสะสม), ชิ้นที่ `o`/`draw` เปลี่ยน
  (ของโผล่-หาย), x/y เดินตามเส้น (x และ y ≥ 8 คีย์) หรือเลื่อน > 80 หน่วย (ท่าเดินทาง เช่น ruler, signature, infinity, ดินสอ/พู่กัน).
- `GL.AMPMAX` (21 rig): เพดาน amp > 1 ที่วัดจากพิกเซลจริงที่ amp 1.5 ให้ไม่เกินกรอบ ±200 (หรือขอบเดิมของมัน) + 6 px. ยกเพดาน: `ampMax`.
- `loop:false`: ค้างทุก loop kf ที่ `pose` วิ หลัง loop แรกของภาพเริ่ม; `GL.POSE` (12 rig ที่ภาพครบช้ากว่าต้นรอบ):
  user-check puzzle bookmark-check heart-pulse heart-off signature party-popper clipboard-check file-text calendar-check calendar-x sunrise.
  ตรวจด้วยตาครบ 298 อัน (แผ่นละ 20). `list-checks` จุดกลาง = ดีไซน์ตาม Lucide ไม่ต้องแก้. `egg` ไม่มีรอยร้าว = ไข่ปกติ ไม่ต้องแก้.
- `p.motion = { speed, amp, still, pose, freezeAt, time(t) }` บน Pen — rig ที่มีโค้ดวาดเองทุกเฟรมอ่านค่านี้ (ตอนนี้มีแค่ `globe-pro`).
- `scripts/check_icons.js` รับ JSON ตัวปรับได้: `node scripts/check_icons.js '{"speed":0.5}'`. ผ่านทั้งหมด (done 298 ไม่มี LEAK):
  `{}` `speed 0.5` `speed 2` `loop:false` `amp 1.5` (`amp 0` ตรวจแล้วหรือไม่ — ดู log ท้ายรอบ).

**สำหรับตอนรวมเข้า CutPack** (จดไว้ตามแผนผู้ใช้)
- ค่าทั้งหมดเป็นตัวเลือกของ `GL.art` → ตัวรวมส่ง `{ speed, amp, loop }` ต่อไอคอน หรือ `GL.stage` ทั้งคลิปได้เลย ไม่ต้องรู้โครง rig.
- `speed` ยืดเวลารอบ `at` (เวลาเริ่มไม่เลื่อน) — ความยาวท่าเข้า = `fn.dur / speed`, ท่าออก = `EXIT.dur / speed`; `a.end` และ `GL.end` คิดให้แล้ว.
- rig ใหม่ที่มีโค้ดวาดเองทุกเฟรม (แบบ globe) ต้องอ่าน `p.motion.time(t)` / `still` / `freezeAt` เอง ไม่งั้น speed/loop:false ไม่มีผลกับส่วนนั้น.
- rig ใหม่: ถ้า loop ต้นรอบภาพยังไม่ครบ → เพิ่มใน `GL.POSE`; ถ้าเด้งสูง → วัดแล้วเพิ่มใน `GL.AMPMAX` (สคริปต์วัดอยู่ใน "ขั้นตอนตรวจ" ด้านล่าง).

**ระยะ 2 (ยังไม่ทำ — รอผู้ใช้ขอ)**: "เลือกชิ้นที่จะขยับ/ไม่ขยับ" (เช่น ล้อหมุนแต่ตัวรถไม่เด้ง) ทำจากตัวกลางไม่ได้ เพราะชิ้นใน rig ไม่มีชื่อ
→ เพิ่ม `name` ใน `on()` เฉพาะ rig ที่ผู้ใช้ขอ แล้ว `GL.art(..., { mute: ['body'] })`. บอกผู้ใช้แล้วว่าเป็นงานรายไอคอน.

**ขั้นตอนตรวจ (ใช้ซ้ำได้)**: ภาพก่อน/หลังด้วยสคริปต์ playwright ถ่ายเฟรมที่เวลาเดียวกันแล้วเทียบไบต์; แผ่นตรวจ `loop:false` = แผ่น 4×5
วาง `Object.keys(GL.icons).filter(k => k.endsWith('-pro')).slice(k*20, k*20+20)` ด้วย `{ loop: false }` ถ่ายที่ t=3; หา pose = สแกน pose 0–4 วิ
นับพิกเซลสว่าง (>90) เลือกกลางช่วงที่ภาพเต็ม; ล้นกรอบ = กล่องพิกเซลสว่างตลอดรอบ (t = dur…dur+4 ทุก 0.1) ที่ amp 1 เทียบ 1.5 บนแคนวาส 600×600, w 300.

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
- ตัวปรับท่าขยับกลาง: `motion-controls.mp4` + `motion-controls-still.png` (แผ่น `examples/motion-controls.html`).
- ภาพเทียบ / ข้อเสนอ: `detail6/` `detail8/` `detail15/` (เพิ่มรายละเอียด, `carrot-fix.png`), `cleanup/`, `user-redesign/`,
  `house-style/` `style-v2/` `light-3d/` (แนวที่ไม่ถูกเลือก), `ref-detail/` (แนวที่ถูกเลือก).

## อื่น ๆ

- push ปกติได้ (fast-forward); `--force-with-lease` เคยถูกปฏิเสธ.
- commit message ลงท้ายด้วยบรรทัด attribution ตามที่ระบบกำหนด; ห้ามใส่ชื่อโมเดลในไฟล์/commit.
- ระบบมี stop hook: ถ้ามีไฟล์ไม่ได้ commit จะเตือน — commit + push ก่อนจบทุกครั้ง.
- ภาพนิ่งปกติ `--at 4.2`; เลือกเวลาที่เห็นท่าเด่นได้ (นาฬิกาทราย 3.2 วิ, ลายเซ็น 2.9 วิ).
- คำสั่ง render ที่ถูกผู้ใช้หยุดกลางทาง: เช็ก `pgrep -af render.js` และสถานะไฟล์ก่อนรันซ้ำ.
