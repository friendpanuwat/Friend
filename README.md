# Friend — Talking Head Motion (มาตรฐาน v9)

- `.claude/skills/talking-head-motion/` — ตัว skill. เปิด Claude Code โดยเลือก repo นี้ แล้ว skill จะโหลดเองอัตโนมัติ
  สั่งได้เลย: "ตัดต่อคลิปนี้ตาม skill talking-head-motion"
- `product/TalkingHeadMotion-v9-product.zip` — แพ็กเกจสำหรับขาย (skill + คู่มือ + หน้าขาย + License + คลิป before/after)
- `product/docs/` — คู่มือ, หน้าขาย, License, before_after.mp4, edit_v9_final.mp4 (คลิปต้นแบบ v9)

## Mono-Bold Carousel

- `.claude/skills/mono-bold-carousel/` — skill ทำ carousel ธีมขาว-ดำ ตัวหนา (เน้นคำด้วยเส้นใต้ ไม่มีกรอบ/ขีดฆ่า/ตัวหนังสือสีเทา).
  สั่งได้เลย: "ทำ carousel ตาม skill mono-bold-carousel" แล้ววางสคริปต์สไลด์
- `carousels/repeat-customers-bw/` — ตัวอย่างงานจาก skill นี้ (ต้นแบบของ `examples/deck_bw.js`)

## Business Lab (Jarua)

- `business-lab/` — MVP ของ Business Lab: เครื่องมือคำนวณและวางแผนธุรกิจ 7 ตัวที่ไม่ใช้ AI และไม่เรียก API
  (จุดคุ้มทุน, ตั้งราคาขาย, ลดราคาคุ้มไหม, เงินสดพอไปกี่เดือน, ดอกเบี้ยแท้จริง, VAT & หัก ณ ที่จ่าย, Business Model Canvas)
- `business-lab/prototype/jarua-business-lab.html` — ต้นแบบไฟล์เดียว เปิดในเบราว์เซอร์ได้ทันที
- วิธีรัน ทดสอบ และย้ายเข้าโปรเจกต์ Jarua: ดู `business-lab/README.md`
