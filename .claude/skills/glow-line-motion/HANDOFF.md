# HANDOFF — glow-line-motion · ไอคอน `-pro` (ชุดไอคอนที่ CutPack ใช้)

อัปเดตล่าสุด: 2026-11-12 · branch `ccr-5f414913-nr4ptm` (push แล้ว, **ยังไม่มี PR** — เปิดเมื่อผู้ใช้สั่งเท่านั้น; ถึงชุด 13 + people.js merge แล้วใน PR #19/#20)
คุยกับผู้ใช้เป็นภาษาไทย สุภาพ ลงท้าย "ครับ". ผู้ใช้สั่งงานจากมือถือ — ห้ามขอให้เขารันคำสั่งเอง.

## งานคืออะไร

วาดไอคอนที่ CutPack ใช้ (Lucide 308 ชื่อ) ใหม่ในสไตล์ glow-line `-pro` ของ skill นี้: เส้นขาวเรืองแสงบนพื้นดำ, ข้างในถมดำโปร่ง,
ชิ้นส่วนแยกเป็น rig ขยับด้วยคีย์เฟรม. ตั้งชื่อ `<ชื่อ Lucide>-pro` + alias ชื่อธรรมดา. ทำรอบละ ~20 อัน แบ่ง 2 แผ่น (A/B แผ่นละ 10).

- **รายชื่อทั้งหมด + ลำดับความสำคัญ: `references/cutpack-icon-list.txt`** (ไฟล์ของผู้ใช้, ลำดับ 1 = #1–95, ลำดับ 2 = #96–132, ลำดับ 3 = #133–308)
- ไอคอนชุดนี้ **ยังไม่ได้เชื่อมเข้า CutPack** (CutPack ใช้ Lucide 24×24 คนละระบบ) — บอกผู้ใช้ไปแล้ว.

## สถานะ (2026-11-12): เสร็จ 247 / 308 · พักไว้ (อวัยวะ) 10 · **เหลือทำ 51**

- ลำดับ 1 ✅ (เว้นอวัยวะ) · ลำดับ 2 ✅ (เว้นอวัยวะ) · ลำดับ 3 ทำแล้ว 120 จาก 171 (#133–255 ✅ เว้น scan-eye)
- ทุกชุดถึงชุด 13 ผู้ใช้ตอบ "ผ่าน" แล้ว (user ใหม่ `people.js` ผู้ใช้ไม่ได้ติ แล้วสั่งเริ่มชุด 14 ต่อเลย).
- ชุด 14 ส่งแล้ว (`pro14.js`, ภาพ/วิดีโอ `pro-icons-batch14a/b`). ผู้ใช้ติว่า "เหมือนงาน canva" + ส่งภาพอ้างอิง 15 แผ่น →
  ลองให้ดู 2 ทาง แล้ว **ผู้ใช้ไม่เอาทั้งคู่: "สรุปคือเอาแบบเดิมครับ"** — ชุด 14 ใช้ตามที่ส่งไปครั้งแรก (ไม่ได้แก้อะไร).
  - ไม่เอา **style v2** (เส้นหนา sw 5 + ชั้นแสงเบลอ + ฉากประกอบ + มุม 3/4): `examples/style-v2.html`, ภาพ `motion/glow-line-pro-icons/style-v2/`
  - ไม่เอา **light 3D** (ด้านข้างแคบ ๆ / ความหนา / เหลี่ยมนูน, ถมสว่าง-มืด `#262626`/`#0e0e0e`): ภาพ `motion/glow-line-pro-icons/light-3d/`
  - **ห้ามเสนอเปลี่ยนแนวอีกเองจนกว่าผู้ใช้จะขอ** — ทำต่อแบบชุด 1–14 เดิม.
- ผู้ใช้สั่งเริ่มชุด 15 ต่อ (= ชุด 14 ผ่าน). **ชุด 15 ส่งแล้ว (`pro15.js`) — รอผู้ใช้ตอบ "ผ่าน"** ก่อนเริ่มชุด 16.

### รอบถัดไป — ชุด 16 (`pro16.js`)
citrus · coffee · cookie · cooking-pot · croissant · cup-soda · egg · grape · ice-cream-cone · pizza · sandwich · soup · wheat ·
bot · cloud · code · cog · cpu · database · filter

### ที่เหลือหลังจากนั้น (31 อัน, ตามลำดับในไฟล์)
hammer link-2 plug power qr-code wifi wifi-off wrench ·
badge-dollar-sign calculator circle-dollar-sign clipboard-check contact credit-card file-text goal id-card landmark percent piggy-bank presentation receipt
shopping-bag truck · calendar-check calendar-x moon sun sunrise sunset timer
(wifi/moon มีแบบ basic → ทำ pro ใหม่. settings = gears-pro, alarm-clock = alarm-pro, smartphone = notify-pro มีแล้ว)

### พักไว้ — อวัยวะคน (ผู้ใช้: "พวกมือ หู หรืออวัยวะต่าง ๆ พักไว้ก่อน ... เพราะคุณวาดพวกนี้ได้ไม่ค่อยดีเท่าไร")
heart-handshake · thumbs-up · hand · footprints · hand-heart · hand-helping · ear-off · hand-coins · hand-metal · scan-eye (ตา — ผู้ใช้ "ข้ามก่อน")
+ 4 อันเก่าที่ยังไม่ได้ลดรายละเอียดตามกฎ: handshake ear thumbs-down biceps-flexed. **ห้ามแตะจนกว่าผู้ใช้สั่ง** — ถ้ากลับมาทำ เสนอแนวทางเป็นภาพก่อน.
**ไม่นับเป็นอวัยวะ (ทำได้ปกติ):** หน้าอิโมจิ (smile frown angry annoyed laugh meh baby …), คนทั้งตัว, คนครึ่งตัว.

## ไฟล์ไอคอน (`assets/`, โหลดตามลำดับใน loader ท้าย `glowline.js`)

| ไฟล์ | ชุด / ลำดับ | ไอคอน |
|---|---|---|
| `pro.js` | 1 | heart bell alarm bulb mail rocket growth gears target notify — **แบบอย่างความละเอียดหลัก** |
| `pro2.js` | 2 | user* sparkles brain check triangle-alert message-circle coins package trending-down briefcase |
| `pro3.js` | 3 A/B | bookmark circle-help users* eye utensils-crossed search handshake† infinity image user-plus* tag wallet calendar repeat book-open ear† fish crown message-circle-question share-2 |
| `pro4.js` | 4 A/B | book (มีเส้นบรรทัด) languages trash-2 user-check* circle-check x thumbs-down† puzzle biceps-flexed† heart-pulse zap banknote store bookmark-check arrow-right message-circle-warning video graduation-cap octagon-alert shield |
| `pro5.js` | 5 A/B | heart-crack heart-off map-pin lightbulb-off battery-low droplets utensils award message-circle-heart arrow-down arrow-up phone lock star arrow-left-right link quote send pen-line printer |
| `pro6.js` | 6 A/B | circle-alert lock-open eye-off flag megaphone trophy hourglass · arrow-down-up chevrons-left-right phone-off pin rewind sliders-horizontal |
| `pro7.js` | 7 A | smile frown |
| `pro8.js` | 8 A/B (ลำดับ 2) | chart-column shield-check angry leaf weight badge-percent building factory medal package-open · headphones message-square box gift palette user-x* key glasses activity droplet |
| `pro9.js` | 9 A/B (ลำดับ 2) | dumbbell salad building-2 clipboard-list gem scale · shopping-cart signature tags calendar-days clock history |
| `pro10.js` | 10 A/B (ลำดับ 3) | arrow-down-right arrow-left arrow-up-right chart-bar chart-line chart-no-axes-combined chart-pie divide equal gauge · minus move-right plus redo-2 refresh-cw rotate-ccw sigma undo-2 at-sign bell-off |
| `pro11.js` | 11 A/B | bell-ring camera clapperboard film messages-square mic mic-off music newspaper pause · play radio tv archive file-question folder folder-open inbox kanban keyboard |
| `pro12.js` | 12 A/B | laptop library list-checks list-ordered list-todo microscope monitor notebook notebook-pen pencil · school brush camera-off dice-5 gamepad-2 key-round lamp paintbrush recycle ruler |
| `pro13.js` | 13 A/B | scissors shirt sofa ticket umbrella accessibility baby contact-round* person-standing user-round* · users-round* ban circle-x shield-alert shield-x siren square-check annoyed laugh meh — **มี `GL.parts.human`** |
| `pro14.js` | 14 A/B | party-popper smile-plus bus car church compass flower globe hospital house · map mountain navigation plane ship sprout tent train-front trees star-off — **globe วาดเส้นเมริเดียนใหม่ทุกเฟรมผ่าน `HOOK` (ห่อ `window.setT`)**; มี `puff()` (ควัน) |
| `pro15.js` | 15 A/B | wand-sparkles apple battery-charging battery-full bed bed-double bike cigarette-off glass-water pill · stethoscope thermometer zap-off banana beef cake candy carrot chef-hat cherry — มี `zee()` (ตัว z ลอย), `STAR4`, `ZAP` |
| `people.js` | — (โหลดท้ายสุด) | **user แบบใหม่** แทนทุกอันที่มี `*` (user users user-plus user-check user-x user-round users-round contact-round) — **มี `GL.parts.bizUser`** |

`*` = ถูก `people.js` ทับแล้ว (โค้ดเก่ายังอยู่ในไฟล์เดิม แต่ทุกชื่อ/alias ชี้ไปตัวใหม่). `†` = อวัยวะที่พักไว้.
ทิศทางที่ลองแล้วผู้ใช้ไม่เลือก (เก็บไว้เฉย ๆ): `detail.js` (-hd/-mn), `sets.js`, วัสดุสีเงิน, `examples/house-style.html`.

## กฎของผู้ใช้ (สะสมมาทั้งหมด — สรุปไว้ใน `references/style.md` §0 ด้วย)

**รูปทรง / รายละเอียด**
1. ทรง = แบบ `-pro` ปัจจุบัน ("เอาแบบเดิม ชอบสุด"). ห้ามเปลี่ยนแนวเองโดยไม่ถาม.
2. **ความละเอียดระดับ `pro.js` ชุด 1** (ผู้ใช้: "ดูอันที่ผมใช้เป็นหลัก pro"): เส้นขอบในสีเทา 1 เส้น, แถบ/ฐาน/ขอบ, ขีดบนแกน, จุดบนข้อมูล,
   ชิ้นเด่นเส้น `C.ink` ชิ้นรองเส้น `C.soft` — แต่ **เฉพาะรายละเอียดที่มีความหมาย**: ไม่ใส่ตะเข็บเส้นประ, หมุด/น็อตเรียงแถว, วงขีดรอบวงกลม,
   เส้นขอบในซ้อน 2 ชั้น, กระดุม, บาร์โค้ด, ตัวหนังสือจิ๋ว, เส้น `C.mute` บาง. เครื่องหมาย/ลูกศรล้วน ๆ ใส่อะไรไม่ได้ก็ปล่อยเรียบ (ความโปรมาจากท่าขยับ).
3. ไม่มีแสงสะท้อน "เส้นโค้ง + จุด" (ดูเหมือน "!") และไม่มีดาวระยิบระยับประดับ (ดาวได้เมื่อเป็นความหมาย หรือเป็นลายบนวัตถุ).
4. ไม่มีสี — ขาว/เทา/ดำ, ข้างในถมดำ "โปร่งแสง" (ผู้ใช้เลือกแบบนี้แทนแบบทึบขาว). ไม่เอาสีเงิน.
5. **ห้ามลอกภาพอ้างอิง** ("อย่า copy ref นะ") — เอาแนวคิดมา แล้วออกแบบรูปทรง/รายละเอียดเอง.
6. **คนทั้งตัว → `GL.parts.human(q, 'line', pose)`** (ผู้ใช้: "อยากให้คนดูเป็นคนมากกว่านี้"): หัวกลมแยกจากตัวมีคอ, ไหล่กว้างสะโพกแคบ,
   แขนขาหนางอที่ศอก/เข่า. **คนครึ่งตัว → `GL.parts.bizUser(q, soft)`** (หน้ารูปไข่ หู ผมแสกปัด สูทปกบาก เนคไท ผ้าเช็ดหน้า).
7. ไอคอนที่มีขีดฆ่า (…-off) ขีดฆ่าต้องอยู่ตลอด — ท่าวนห้ามยกขีดออก ไม่งั้นตอนท่าออกจะกลายเป็นไอคอนปกติ.

**การขยับ**
8. **ทุกไอคอนมีท่าเข้า + ท่าขยับวน + ท่าออก** ("อย่าลืมท่าออกนะครับ"), ท่าออกสะท้อนท่าเข้า.
9. **อนิเมชันแบบมืออาชีพ** (ผู้ใช้สั่งชัด): ย่อก่อนพุ่ง (anticipation), เด้งเกินแล้วค่อยนิ่ง (overshoot+settle), ชิ้นที่ห้อย/ปลายตามช้ากว่า
   (follow-through), มีท่ารอง (เส้นความเร็ว ฝุ่น ขีดคลิก ระลอก), ยืดหดตอนกระทบ (squash & stretch).
10. ห้ามมีชิ้นไหนโผล่ก่อนเวลา — รัน `node scripts/check_icons.js` ทุกครั้ง ต้องได้ `done N` ไม่มีบรรทัด `LEAK`.

**ขั้นตอนการส่งงาน**
11. แก้ทั้งชุดใหญ่ ๆ → **ส่งเป็นภาพก่อน** (ภาพนิ่ง / ภาพเทียบก่อน-หลัง) แล้วค่อยทำวิดีโอ.
12. ส่งทุกรอบแล้ว **รอผู้ใช้ตอบ "ผ่าน"** ก่อนเริ่มรอบใหม่. ผู้ใช้ชอบให้เพิ่มรายละเอียดเล็ก ๆ น้อย ๆ — ใส่ตั้งแต่แรก.

## วิธีเขียนไอคอนใหม่

คัดลอกหัวไฟล์ของ `pro12.js` (`sub on pop drop thud grow show flash shakeKeys at tubes clip slash follow`) แล้วเติมจาก `pro13.js` ที่ต้องใช้
(`rise ring STAR5 DROP SHIELD` + `human`).

```js
rig('flag-pro', .6, 'rise', p => {           // ชื่อ, เวลาท่าเข้า (วิ), ท่าออก, ฟังก์ชันวาด
  const intro = sub(p), oO = sub(intro), part = sub(oO);   // oO = ท่าเข้า, part = ท่าวน (คนละ group เสมอ!)
  part.path('...', { fill: C.fill, sw: 3.2 });             // เส้นหลัก ~3–3.4, ถม C.fill; รายละเอียด sw 1.8–2.4 C.soft
  on(part, p, .7, { loop: 2.4, ox, oy, r: [[0, 0], [.15, -4, 'out'], [.45, 10, 'out'], [.8, 0, 'soft']] });
  drop(p, oO, 0, -100);                                    // ทุกชิ้นต้องอยู่ใต้ group ที่มีท่าเข้า (คีย์แรก o:0) หรือมี o:0 ของตัวเอง
});
```

- กล่องวาด ±200 (400 = ความกว้างใน `GL.art(..., { w })`). ป้ายชื่ออยู่ใต้ไอคอน — อย่าให้ของล้นต่ำกว่า y ≈ 185 หรือเลย ±200 แม้ตอนขยับ.
- คีย์เฟรม: `GL.kf(el, start, { loop, ox, oy, x, y, r, s, sx, sy, ky, o, draw })`, ease `lin in out io back soft`. ก่อนเริ่ม = ค่าคีย์แรก.
- **บั๊กที่ต้องระวังที่สุด: `GL.kf` สองอันบน element เดียวกัน → อันที่ใส่ทีหลังทับ transform ทั้งหมด** (ท่าเข้าที่จบแล้วค้างทับท่าวน — ไอคอนนิ่ง).
  ท่าเข้ากับท่าวนต้องอยู่คนละ group เสมอ. `on(x, p, 0, {})` ว่าง ๆ ก็ทับได้ ห้ามใส่. kf ตั้ง `transform` ทับ attribute เดิม → อย่าใส่ kf บน group ที่มี transform ของตัวเอง (ห่อด้วย group ใหม่).
- ท่าวนต้องต่อเนื่องตอนวนรอบ: หมุนครบรอบ/สมมาตร (90° ของ +, 120° ของ recycle, 36° ของ badge), หรือกลับค่าเดิมก่อนจบ loop.
- ท่าออก (`GL.EXIT`): `pop rise sink slide slideL launch spin squash blink fade` หรือ object (`{ kind:'slide', x:[…], y:[…], dur, o }`).
  จับคู่: หล่นลงมา→`rise`, ลอยขึ้นมา→`sink`, เข้าจากซ้าย→`slide`, เข้าจากขวา→`slideL`, จรวด→`launch`, ไฟ→`blink`, หมุน/วงวน→`spin`, กล่อง/กราฟ/ตึก→`squash`, ที่เหลือ→`pop`.
- เครื่องมือช่วยใน pro10–13: `tubes(q, [d…], w)` = เส้นกลวงแบบรวมเป็นเงาเดียว (เส้นขอบทั้งหมดก่อน แล้วค่อยถม) — ใช้กับลูกศร/เครื่องหมาย;
  `clip(q, d)` = clip-path (ทรายในแก้ว, ฟิล์มเลื่อน, จอทีวี, รูปในกรอบวงกลม); `follow(pathEl, t0, T)` = คีย์ x/y ตาม path จริง (ปากกา/ดินสอ/พู่กันเดินตามเส้น)
  — ระวังด้ามยื่นเลยกรอบตอนเคลื่อน.
- `human()`: กลุ่ม `thigh±1 shin±1 upper±1 fore±1 torso head`, สั่ง `hm.on(name, p, start, spec)` (ใส่ทั้งชั้นเส้นขอบและชั้นถม), pivot ตาม `BODY` ใน pro13.js;
  `pose.armOver` = มุมด้านข้าง แขนข้างใกล้ทับตัวพร้อมเส้นขอบเอง. `bizUser()` คืน `{ head, body, tie }` (pivot คอ (0,6), เนคไท (0,46)); ตัวอย่างการวางใน `people.js` (`person()`, `badge()`, `avatar()`).
- ท้ายไฟล์: `Object.assign(G.icons, R)` + ALIAS (ชื่อ Lucide → `-pro`, ของเดิมเก็บเป็น `-basic`) + `G.PRO14 = names.map(n => n + '-pro')`.
  เพิ่มไฟล์เข้า loader ใน `assets/glowline.js` **ก่อน `'people.js'`** (people.js ต้องโหลดท้ายสุด).

## ขั้นตอนต่อรอบ (ตัวอย่างเขียนเป็นชุด 14 — เปลี่ยนเลขเป็นชุดปัจจุบัน)

1. เขียน `assets/pro14.js` + เพิ่มเข้า loader (ก่อน people.js).
2. แผ่น: `for v in a b; do sed -e "s/GL.PRO13/GL.PRO14/" -e "s/BATCH 13 · /BATCH 14 · /" -e "s/pro13.js/pro14.js/" examples/pro-icons-13$v.html > examples/pro-icons-14$v.html; done`
   (ถ้าแผ่นมีไม่ถึง 10 อัน ใช้แม่แบบตาราง 4 แถวคงที่ของ `pro-icons-6a.html` / `pro-icons-people.html`).
3. `node scripts/check_icons.js` → ไม่มี LEAK.
4. ภาพนิ่ง: `node scripts/render.js examples/pro-icons-14a.html <scratch>/a --still --at 4.2 --scale 2` → เปิดดู แก้ของล้น/ชน/ดูไม่ออก.
5. วิดีโอ (~1 นาที/แผ่น, รัน a กับ b ขนานกันได้): `node scripts/render.js examples/pro-icons-14a.html <scratch>/va --name pro-icons-batch14a`
   ดูท่าวน: `ffmpeg -ss 1.4 -t 4.8 -i x.mp4 -vf "fps=2.5,scale=300:-1,tile=6x2" -frames:v 1 mid.jpg` · ท่าออก: `-ss <ยาว-1.4> … fps=8`.
6. คัดลอก mp4 + still ไป `motion/glow-line-pro-icons/` (`pro-icons-batch14a.mp4`, `pro-icons-batch14a-still.png`), อัปเดต HANDOFF, commit + push.
7. ส่งผู้ใช้ (SendUserFile) + สรุปไทย: ตาราง A/B (ไอคอน · ท่าขยับ), ที่แก้ระหว่างทำ, ความคืบหน้า, รายชื่อรอบถัดไป → รอ "ผ่าน".

## ไฟล์ผลงาน (`motion/glow-line-pro-icons/`)

- วิดีโอ + ภาพนิ่งทุกแผ่น: `pro-icons-grid.mp4` (ชุด 1), `pro-icons-batch2.mp4`, `pro-icons-batch3a/3b … 15a/15b.mp4`, `pro-icons-batch7a.mp4`,
  `pro-icons-people.mp4` (user ใหม่ทั้ง 8 อัน) + `*-still.png`; `pro-icons-tour.mp4` (ชุด 1 ทีละอันเต็มจอ).
- แผ่นที่มีไอคอนคนถูก render ใหม่หลังเปลี่ยน user แล้ว: batch2, 3a, 4a, 8b, 13a, 13b.
- ภาพเทียบ: `detail6/` `detail8/` (ก่อน-หลังเพิ่มรายละเอียด), `cleanup/` (ลดรายละเอียด, `book-ruled-lines.png`, `human-figure.png`),
  `user-redesign/user-business-v1.png` (+ .html ร่าง), `house-style/` (ข้อเสนอแนวที่ไม่ถูกเลือก).

## อื่น ๆ

- push ปกติได้ (fast-forward); `--force-with-lease` เคยถูกปฏิเสธ. Default branch ของ repo คือ `ccr-045810ba-gj4imq`.
- commit message ลงท้ายด้วยบรรทัด attribution ตามที่ระบบกำหนด; ห้ามใส่ชื่อโมเดลในไฟล์/commit.
- ระบบมี stop hook: ถ้ามีไฟล์ไม่ได้ commit จะเตือน — commit + push ก่อนจบทุกครั้ง.
- render ภาพนิ่งเลือกเวลาที่เห็นท่าเด่น (เช่น นาฬิกาทราย 3.2 วิ, ลายเซ็น 2.9 วิ); ภาพนิ่งปกติ 4.2–4.6 วิ.
