# Friend — Talking Head Motion (มาตรฐาน v9)

- `.claude/skills/talking-head-motion/` — ตัว skill. เปิด Claude Code โดยเลือก repo นี้ แล้ว skill จะโหลดเองอัตโนมัติ
  สั่งได้เลย: "ตัดต่อคลิปนี้ตาม skill talking-head-motion"
- `product/TalkingHeadMotion-v9-product.zip` — แพ็กเกจสำหรับขาย (skill + คู่มือ + หน้าขาย + License + คลิป before/after)
- `product/docs/` — คู่มือ, หน้าขาย, License, before_after.mp4, edit_v9_final.mp4 (คลิปต้นแบบ v9)

## Mono-Bold Carousel

- `.claude/skills/mono-bold-carousel/` — skill ทำ carousel ธีมขาว-ดำ ตัวหนา (เน้นคำด้วยเส้นใต้ ไม่มีกรอบ/ขีดฆ่า/ตัวหนังสือสีเทา).
  สั่งได้เลย: "ทำ carousel ตาม skill mono-bold-carousel" แล้ววางสคริปต์สไลด์
- `carousels/repeat-customers-bw/` — ตัวอย่างงานจาก skill นี้ (ต้นแบบของ `examples/deck_bw.js`)

## Glow Line Motion

- `.claude/skills/glow-line-motion/` — skill ทำ motion graphics ทุกแนวในลายเส้นขาวเรืองแสงบนพื้นดำ (ไอคอนเส้นที่วาดตัวเอง)
  สั่งได้เลย: "ทำ motion graphic ตาม skill glow-line-motion เรื่อง …" — แค่หัวข้อก็ได้
- คู่มือสไตล์ลายเส้น: `references/style.md` (แสง สี รูปทรง น้ำหนักเส้น ตัวอักษร การเคลื่อนไหว สิ่งที่ห้าม อุปมา)
- รูปแบบ: ก่อน→หลัง (rows / grid / hero), ขั้นตอน (flow), เปรียบเทียบ (versus), ตัวเลขนับขึ้น (stat), ทิป (steps),
  ฉากเดี่ยว (spot), ฉากอิสระมีของเคลื่อนที่ — ภาพสำเร็จดูที่ `references/icons.jpg` + `catalog.jpg`
- ส่งออก MP4 9:16 / 1:1 / 16:9, PNG, storyboard และ MOV พื้นใส (`--alpha`)
- ฉากสำเร็จรูป 21 หมวด B01–B21 (หนึ่งประโยค = หนึ่งฉาก, ใช้ได้กับทุกเรื่อง): `references/beats.md` · ภาพรวม `references/beats.jpg`
- `motion/glow-line-demo/` — คลิปตัวอย่างจาก skill · `motion-samples/glow-line-simplify/` — ต้นแบบแรกของสไตล์
