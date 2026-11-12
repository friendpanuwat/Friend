# HANDOFF — glow-line-motion · ไอคอน `-pro` (ชุดไอคอนที่ CutPack ใช้บ่อย)

อัปเดตล่าสุด: 2026-11-12 · branch `ccr-e5509ed3-id7gvt` (push แล้ว, **ยังไม่มี PR** — เปิดเมื่อผู้ใช้สั่งเท่านั้น; ชุด 1–5 merge แล้วใน PR #19)
คุยกับผู้ใช้เป็นภาษาไทย สุภาพ ลงท้าย "ครับ". ผู้ใช้สั่งงานจากมือถือ — ห้ามขอให้เขารันคำสั่งเอง.

## งานคืออะไร

วาดไอคอนที่ผู้ใช้ใช้บ่อยใน CutPack (PDF `icons_preview.pdf` ของผู้ใช้: Lucide 308 อัน, **ลำดับ 1 = 95 อัน**) ใหม่ในสไตล์
glow-line `-pro` ของ skill นี้: เส้นขาวเรืองแสงบนพื้นดำ, ถมดำโปร่ง, ชิ้นส่วนแยกเป็น rig ขยับด้วยคีย์เฟรม.
ตั้งชื่อตาม Lucide ภาษาอังกฤษ (`<ชื่อ>-pro` + alias ชื่อธรรมดา). ทำรอบละ ~20 อัน แบ่ง 2 แผ่น (A/B แผ่นละ 10).

> ไอคอนชุดนี้ **ยังไม่ได้เชื่อมเข้า CutPack** (CutPack ใช้ Lucide 24×24 คนละระบบ, และ `cutpack/HANDOFF.md` บอกว่ายกเลิก skill นี้ในฉากรอบ 11) — บอกผู้ใช้ไปแล้ว.

## สถานะ: ไอคอนที่ไม่ใช่อวัยวะเสร็จครบแล้ว (ชุด 1–7) — เหลือเฉพาะชุดอวัยวะคนที่พักไว้

| ไฟล์ | ไอคอน |
|---|---|
| `assets/pro.js` (ชุด 1) | heart bell alarm bulb mail rocket growth gears target notify |
| `assets/pro2.js` (ชุด 2) | user sparkles brain check triangle-alert message-circle coins package trending-down briefcase |
| `assets/pro3.js` (ชุด 3) | bookmark circle-help users eye utensils-crossed search handshake* infinity image user-plus tag wallet calendar repeat book-open ear* fish crown message-circle-question share-2 |
| `assets/pro4.js` (ชุด 4) | book languages trash-2 user-check circle-check x thumbs-down* puzzle biceps-flexed* heart-pulse zap banknote store bookmark-check arrow-right message-circle-warning video graduation-cap octagon-alert shield |
| `assets/pro5.js` (ชุด 5) | heart-crack heart-off map-pin lightbulb-off battery-low droplets utensils award message-circle-heart arrow-down arrow-up phone lock star arrow-left-right link quote send pen-line printer |
| `assets/pro13.js` (ชุด 13 = ลำดับ 3 อันที่ 61–80) | scissors shirt sofa ticket umbrella accessibility baby contact-round person-standing user-round · users-round ban circle-x shield-alert shield-x siren square-check annoyed laugh meh |
| `assets/pro12.js` (ชุด 12 = ลำดับ 3 อันที่ 41–60) | laptop library list-checks list-ordered list-todo microscope monitor notebook notebook-pen pencil · school brush camera-off dice-5 gamepad-2 key-round lamp paintbrush recycle ruler |
| `assets/pro11.js` (ชุด 11 = ลำดับ 3 อันที่ 21–40) | bell-ring camera clapperboard film messages-square mic mic-off music newspaper pause · play radio tv archive file-question folder folder-open inbox kanban keyboard |
| `assets/pro10.js` (ชุด 10 = ลำดับ 3 อันที่ 1–20, แผ่น A/B) | arrow-down-right arrow-left arrow-up-right chart-bar chart-line chart-no-axes-combined chart-pie divide equal gauge · minus move-right plus redo-2 refresh-cw rotate-ccw sigma undo-2 at-sign bell-off |
| `assets/pro9.js` (ชุด 9 = ลำดับ 2 อันที่ 21–32, แผ่น A/B 6+6) | dumbbell salad building-2 clipboard-list gem scale · shopping-cart signature tags calendar-days clock history |
| `assets/pro8.js` (ชุด 8 = ลำดับ 2 อันที่ 1–20, แผ่น A/B) | chart-column shield-check angry leaf weight badge-percent building factory medal package-open · headphones message-square box gift palette user-x key glasses activity droplet |
| `assets/pro7.js` (ชุด 7, แผ่น A) | smile frown (หน้าอิโมจิ — **ผู้ใช้บอกว่าไม่นับเป็นอวัยวะ**) |
| `assets/pro6.js` (ชุด 6, แผ่น A 7 + B 6) | circle-alert lock-open eye-off flag megaphone trophy hourglass · arrow-down-up chevrons-left-right phone-off pin rewind sliders-horizontal |

`*` = อวัยวะคน — ทำไปก่อนผู้ใช้สั่งพัก, **ยังไม่ได้ปรับตามกฎล่าสุด** (ยังมีรายละเอียดเดิม). จะกลับมาทำทีหลังพร้อมชุดที่พักไว้.

ชุด 6 (13 อันสุดท้าย): รอบ 2 = ผู้ใช้สั่ง "แก้นาฬิกาทราย + เพิ่มรายละเอียดเล็ก ๆ ทุกอัน" (ภาพเทียบ `motion/glow-line-pro-icons/detail6/`) →
ผู้ใช้ชี้ว่าทรายทะลุแก้ว → แก้ด้วย clip-path (`clip()` ใน pro6.js) ให้ทรายอยู่ในกระเปาะเสมอ, ผิวทรายบนเลื่อนลง/กองล่างเลื่อนขึ้น (ไม่ใช้ scale).
render วิดีโอ 6a/6b ใหม่แล้ว (ภาพนิ่งที่ 3.2 วิ ให้เห็นทรายกำลังไหล) — **ผู้ใช้ตอบ "ผ่าน" แล้ว (2026-11-12)**.
ทำงานค้างแล้ว (2026-11-12): ชุด 7 = smile/frown (`pro-icons-batch7a.mp4`), แก้บั๊ก kf ซ้อน 3 อัน (arrow-left-right, map-pin ใน pro5; puzzle ใน pro4 —
ท่าวนไม่เคยเล่น) + render 4a/5a/5b ใหม่, render `pro-icons-tour.mp4` ใหม่ (ใช้ GL.PRO ชุด 1 = ตรงกับแผ่น grid ที่ผ่านแล้ว).
book-pro: เพิ่มเส้นบรรทัดบนหน้ากระดาษ (เห็นตอนปกเปิด, ภาพ `cleanup/book-ruled-lines.png`) — **ผู้ใช้ตอบ "ผ่าน" ทั้งหมดแล้ว**. งานที่เหลือมีแค่ชุดอวัยวะที่พักไว้ (รอผู้ใช้สั่ง).
**ลำดับ 2 (เริ่ม 2026-11-12)**: 37 อัน − rocket (มีแล้ว) − hand-heart hand-helping hand-coins ear-off (อวัยวะ → พัก) = 32 อัน.
รอบแรก 20 อัน = `pro8.js`. ผู้ใช้สั่ง "เพิ่มรายละเอียดเล็ก ๆ" + "ดูอันที่ผมใช้เป็นหลัก (pro)" = **ใช้ `pro.js` ชุด 1 เป็นแบบอย่างความละเอียด**
(เส้นขอบในสีเทา 1 เส้น, แถบ/ฐาน, ขีดแกน, จุดบนข้อมูล, ชิ้นเด่นเส้น ink ที่เหลือ soft) แต่ยังอยู่ในกฎ 2–3. ภาพเทียบ `detail8/compare-8a/8b.jpg` → ผู้ใช้ "ผ่าน ทำอนิเมชั่นแบบมืออาชีพ" → เติมหลักอนิเมชันแบบ pro.js ให้ทุกอัน
(ย่อก่อนพุ่ง, เด้งเกินแล้วนิ่ง, ชิ้นตามช้ากว่า, ท่ารอง) แล้ว render `pro-icons-batch8a/8b.mp4` — ผู้ใช้ "ผ่าน".
ชุด 9 (12 อันสุดท้ายของลำดับ 2) ทำด้วยมาตรฐานเดียวกันตั้งแต่แรก → `pro-icons-batch9a/9b.mp4` (ภาพนิ่งที่ 2.9 วิ ให้เห็นลายเซ็น) — **รอผู้ใช้ตอบ**.
ลำดับ 2 ครบแล้ว (เว้นอวัยวะ 4 อัน) — ผู้ใช้ "ผ่าน".
**ลำดับ 3** (176 อัน #133–308): มีแล้ว 3 (smartphone settings alarm-clock), ข้ามอวัยวะ hand-metal + scan-eye (ผู้ใช้สั่ง "ข้ามก่อน" — พักไว้กับชุดอวัยวะ) → 171 อัน.
ชุด 10 = 20 อันแรก (`pro10.js`, ไอคอนเครื่องหมาย/ลูกศรใช้เส้น tube แบบ union ผ่าน `tubes()`) — ผ่าน.
ชุด 11 = #153–173 (`pro11.js`) — ผ่าน.
ชุด 12 = #174–194 (`pro12.js`, ข้าม hand-metal) — ผ่าน.
เครื่องมือที่เดินตามเส้น (ปากกา ดินสอ พู่กัน) ใช้ `follow()` = getPointAtLength ของ path จริง; ระวังด้ามยื่นเลยกรอบ ±200 ตอนเคลื่อน.
ชุด 13 = #195–214 (`pro13.js`). ผู้ใช้ส่งภาพอ้างอิง (คนทึบขาว, Neuron Visuals) บอก "อยากให้คนมันดูเป็นคนมากกว่านี้" แล้วเลือก **"แบบโปร่งแสง"**
(= เส้นขอบ + ถมดำ ตามสไตล์เดิม ไม่ใช่ทึบขาว) → **โครงคนใหม่ `GL.parts.human(q, 'line', pose)`** ใน pro13.js: หัวกลมแยกจากตัว (มีคอ), ลำตัวไหล่กว้างสะโพกแคบ,
แขนขาหนางอที่ศอก/เข่าได้ (กลุ่ม thigh±1 shin±1 upper±1 fore±1 torso head, สั่งด้วย `hm.on(name, …)`), ทุกชิ้นรวมเป็นเงาเดียว (เส้นขอบทั้งหมดก่อน แล้วค่อยถมดำ);
pose.armOver = แขนข้างใกล้ทับตัวพร้อมเส้นขอบของมันเอง (มุมด้านข้าง). ใช้แล้วกับ person-standing (ย่อเข่า-กระโดด-ชูแขน) และ accessibility (นั่งรถเข็นมองด้านข้าง เข็นล้อ).
**คนทั้งตัวในชุดต่อ ๆ ไปให้ใช้ `human()` เสมอ**. ส่ง 13a/13b แล้ว — **รอผู้ใช้ตอบ**.
รอบถัดไป (ชุด 14) เริ่มที่ #215 party-popper, smile-plus, bus, car, church, compass, flower, globe(basic→pro), hospital, house(basic→pro), map(basic→pro) …
หมายเหตุ signature-pro: ปากกาเดินตามเส้นด้วย `getPointAtLength` ของ path จริง (ใช้ได้เพราะ element อยู่ใน DOM ตอนวาด). 
ไอคอนที่มีขีดฆ่า (eye-off, phone-off) — ขีดฆ่าต้องอยู่ตลอด ห้ามให้ท่าวนยกขีดออก (ไม่งั้นตอนท่าออกจะกลายเป็น eye/phone ธรรมดา).

**พักไว้ (อวัยวะคน + hand-heart hand-helping hand-coins ear-off hand-metal scan-eye จากลำดับ 2–3 — ผู้ใช้สั่งพักอีกครั้ง: "พวกมือ หู หรืออวัยวะต่าง ๆ พักไว้ก่อน ... เพราะคุณวาดพวกนี้ได้ไม่ค่อยดีเท่าไร")**:
hand · thumbs-up · footprints · heart-handshake + ปรับ 4 อันเดิม (handshake ear thumbs-down biceps-flexed). **ห้ามแตะจนกว่าผู้ใช้สั่ง** —
ผมเคยเริ่มร่าง/ลดรายละเอียดไปแล้วแต่ย้อนคืนทั้งหมด (ไม่มีในไฟล์). ถ้ากลับมาทำ ควรเสนอแนวทางวาดให้ผู้ใช้ดูเป็นภาพก่อน.

## กฎที่ผู้ใช้ตั้ง (สำคัญ — สะสมมาทั้งแชท, บันทึกไว้ใน `references/style.md` §0 ด้วย)

1. **ทรง = แบบ `-pro` ปัจจุบัน** — ผู้ใช้ดูภาพรวม 80 อันแล้วบอก "เอาแบบเดิมแหละครับ ผมชอบสุด". เคยเสนอแนว A "มีมิติ" / B "เส้นเว้นช่อง"
   (`examples/house-style.html`, ภาพ `motion/glow-line-pro-icons/house-style/`) — ไม่เลือก. ห้ามเปลี่ยนแนวเองโดยไม่ถาม.
   (ก่อนหน้านั้นผู้ใช้เคยบอก "อยากให้ลอกต้นฉบับ Lucide น้อย ๆ หน่อย" — แต่สุดท้ายเลือกแบบเดิม; ถ้าจะออกแบบอันใหม่ ให้เป็นภาพวาดของเราเองที่ไม่ใช่ glyph Lucide เป๊ะ ๆ แต่ยังอยู่ในแนวเดิม.)
2. **รายละเอียดเท่าที่มีความหมาย** — ไม่ใส่ตะเข็บเส้นประ, หมุด/น็อตเรียงแถว, วงขีดรอบวงกลม, เส้นขอบในซ้อน, กระดุม, บาร์โค้ด, ตัวหนังสือจิ๋ว, เส้น `C.mute` บาง ๆ.
   อันไหนใส่ไม่ได้ก็ไม่ต้องพยายามใส่.
3. **ไม่มีแสงสะท้อน "เส้นโค้ง + จุด"** (ผู้ใช้ว่าดูเหมือน "!") และ **ไม่มีดาวระยิบระยับประดับ** (ดาวได้เฉพาะเมื่อดาวคือความหมาย หรือเป็นลายบนวัตถุ).
4. **ทุกไอคอนต้องมีท่าเข้า + ท่าขยับวน + ท่าออก** ("อย่าลืมท่าออกนะครับ"). ท่าออกสะท้อนท่าเข้า (ดูตารางด้านล่าง).
5. **ห้ามมีชิ้นไหนโผล่ก่อนเวลาของมัน** (เคยเป็นบั๊ก: ถังขยะ/ภาษา/กากบาท) — รัน `node scripts/check_icons.js` ทุกครั้ง ต้องได้ `done N` ไม่มีบรรทัด `LEAK`.
6. อวัยวะคน → ข้ามไปก่อน.
7. แก้ทั้งชุดใหญ่ ๆ → **ส่งเป็นภาพก่อน** (ภาพนิ่ง / ภาพเทียบก่อน-หลัง) แล้วค่อยทำวิดีโอ.
8. ไม่มีสี — ขาว/เทา/ดำ, วัสดุดำโปร่ง (ไม่เอาสีเงิน).

## โครงไอคอน `-pro` (วิธีเขียนอันใหม่)

เริ่มจากคัดลอกหัวไฟล์ `assets/pro5.js` (helper: `sub` `on` `pop` `drop` `twinkle` `tube` `shakeKeys` `star4`, `HEART` `BUBBLE` `BULB`).

```js
rig('flag-pro', .6, 'sink', p => {          // ชื่อ, เวลาท่าเข้า (วิ), ท่าออก, ฟังก์ชันวาด
  const intro = sub(p), part = sub(intro);   // ทุกชิ้นที่ขยับ = group ของตัวเอง
  part.path('...', { fill: C.fill, sw: 3.2 }); // เส้นหลัก ~3, ถม C.fill; รายละเอียด sw 1.4–2.4 C.soft
  on(part, p, .7, { loop: 2.4, ox, oy, r: [[0, 0], [.3, 8, 'out'], [.8, 0, 'soft']] });  // วน — เริ่มหลังท่าเข้า
  pop(p, intro);                             // ท่าเข้า — ทุกชิ้นต้องอยู่ใต้ intro (หรือมี kf o:0 ของตัวเอง)
});
```

- กล่องวาด ±200 (เลข 400 = ความกว้างใน `GL.art(..., { w })`). ป้ายชื่อในแผ่นอยู่ใต้ไอคอน — อย่าให้ของล้นลงไปเกิน y ≈ 190.
- คีย์เฟรม: `GL.kf(el, start, { loop, ox, oy, x, y, r, s, sx, sy, ky, o, draw })`, ease: `lin in out io back soft`.
  ก่อนเริ่ม = ค่าคีย์แรก → ของที่ต้องซ่อนก่อนถึงคิวให้คีย์แรก `o: 0`.
- ท่าออก (`GL.EXIT` ใน `glowline.js`): `pop` `rise` `sink` `slide` `slideL` `launch` `spin` `squash` `blink` `fade` หรือ object ตั้งเอง
  (เช่น send-pro บินขึ้นขวา `{ kind:'slide', x:[...], y:[...] }`). กฎจับคู่: หล่นลงมา→`rise`, ลอยขึ้นมา→`sink`, เข้าจากซ้าย→`slide`,
  จรวด→`launch`, หลอดไฟ/สายฟ้า→`blink`, เฟือง/ดาว/วงวน→`spin`, กล่อง/กราฟ→`squash`, ที่เหลือ→`pop`.
  ไฟล์เก่า (pro–pro4) ตั้งท่าออกด้วย `Object.entries({...}).forEach(([n,k]) => R[n].exit = k)` ท้ายไฟล์; pro5 ส่งเป็นอาร์กิวเมนต์ที่ 3 ของ `rig`.
- เอนจิน: `art(..., { out: T, exit })`, `a.leave(T)`, `GL.page` เล่นท่าออกเองก่อนเปลี่ยนหน้า, `GL.finish({ hold, out: true, stagger })`.
- ท้ายไฟล์: `Object.assign(G.icons, R)` + ALIAS (ชื่อ Lucide → `-pro`, ของเดิมเก็บเป็น `<ชื่อ>-basic`) + `G.PRO6 = Object.keys(R)`.
- เพิ่มไฟล์ใหม่เข้า loader ใน `assets/glowline.js`: `load([... 'pro5.js', 'pro6.js'])`.

## ขั้นตอนต่อรอบ (ที่ใช้มาตลอด)

1. เขียน `assets/proN.js` (20 อัน) + เพิ่มเข้า loader.
2. แผ่น: `sed -e "s/GL.PRO5/GL.PRO6/" -e "s/BATCH 5 · A/BATCH 6 · A/" examples/pro-icons-5a.html > examples/pro-icons-6a.html` (และ b — `slice(10, 20)`).
3. `node scripts/check_icons.js` → ต้องไม่มี LEAK.
4. ภาพนิ่ง (ก่อนท่าออก): `node scripts/render.js examples/pro-icons-6a.html <scratch>/a --still --at 4.2 --scale 2` → เปิดดู แก้ของล้น/ชน.
5. วิดีโอ: `node scripts/render.js examples/pro-icons-6a.html <scratch>/va --name pro-icons-batch6a` (~1 นาที/แผ่น).
   ดูท่าออก: `ffmpeg -ss <ยาว-1.4> -i x.mp4 -vf "fps=8,scale=270:-1,tile=6x2" -frames:v 1 ex.jpg`.
6. คัดลอก mp4 + still ไป `motion/glow-line-pro-icons/` (`pro-icons-batch6a.mp4`, `pro-icons-batch6a-still.png`), commit + push.
7. ส่งผู้ใช้ (SendUserFile) + สรุปไทย: ตาราง A/B, ท่าขยับเด่น, ที่แก้ระหว่างทำ, ความคืบหน้า, รายชื่อรอบถัดไป → **รอ "ผ่าน" ก่อนเริ่มรอบใหม่**.

## ไฟล์ผลงาน (`motion/glow-line-pro-icons/`)

- ชุด 6: `pro-icons-batch6a/6b.mp4` + `*-still.png`
- วิดีโอล่าสุดทั้ง 8 แผ่น (ลดรายละเอียด + ไม่มีแสงสะท้อน/ดาว + มีท่าออก): `pro-icons-grid.mp4` (ชุด 1), `pro-icons-batch2.mp4`,
  `pro-icons-batch3a/3b.mp4`, `pro-icons-batch4a/4b.mp4`, `pro-icons-batch5a/5b.mp4` + `*-still.png` (ภาพนิ่งที่ 4.6 วิ)
- `cleanup/compare-1…6.jpg` ก่อน/หลังลดรายละเอียด · `house-style/` ภาพรวม 80 อัน + ข้อเสนอแนว A/B
- `pro-icons-tour.mp4` = render ใหม่แล้ว (ชุด 1, 37 วิ)

## อื่น ๆ ที่ค้าง / ควรรู้

- **ระวัง: `GL.kf` สองอันบน element เดียวกัน → อันที่ใส่ทีหลังทับ transform ทั้งหมด** (ท่าเข้าที่จบแล้วจะค้างค่าสุดท้ายทับท่าวน).
  ให้ท่าเข้ากับท่าวนอยู่คนละ group (`const o = sub(intro), q = sub(o)`). สแกนทุกไฟล์แล้ว แก้ครบ (arrow-left-right, map-pin, puzzle).
- ไอคอนอวัยวะคน 4 อันที่ทำแล้ว (handshake ear thumbs-down biceps-flexed) ยังไม่ได้ผ่านกฎข้อ 2–3 — ทำตอนกลับมาทำชุดอวัยวะ.
- push ปกติได้ (fast-forward); `--force-with-lease` เคยถูกปฏิเสธ. Default branch ของ repo คือ `ccr-045810ba-gj4imq` (PR #10–#16 merge แล้ว).
- commit message ลงท้ายด้วยบรรทัด attribution ตามที่ระบบกำหนด; ห้ามใส่ชื่อโมเดลในไฟล์/commit.
- ทิศทางที่ลองแล้วไม่ถูกเลือก (เก็บไว้เป็นทางเลือก): `assets/detail.js` (-hd/-mn), `assets/sets.js`, วัสดุสีเงิน, `examples/house-style.html`.
