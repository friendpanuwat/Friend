# Friend — Talking Head Motion (มาตรฐาน v9)

- `.claude/skills/talking-head-motion/` — ตัว skill. เปิด Claude Code โดยเลือก repo นี้ แล้ว skill จะโหลดเองอัตโนมัติ
  สั่งได้เลย: "ตัดต่อคลิปนี้ตาม skill talking-head-motion"
- `product/TalkingHeadMotion-v9-product.zip` — แพ็กเกจสำหรับขาย (skill + คู่มือ + หน้าขาย + License + คลิป before/after)
- `product/docs/` — คู่มือ, หน้าขาย, License, before_after.mp4, edit_v9_final.mp4 (คลิปต้นแบบ v9)

## Mono-Bold Carousel

- `.claude/skills/mono-bold-carousel/` — skill ทำ carousel ธีมขาว-ดำ ตัวหนา (เน้นคำด้วยเส้นใต้ ไม่มีกรอบ/ขีดฆ่า/ตัวหนังสือสีเทา).
  สั่งได้เลย: "ทำ carousel ตาม skill mono-bold-carousel" แล้ววางสคริปต์สไลด์
- `carousels/repeat-customers-bw/` — ตัวอย่างงานจาก skill นี้ (ต้นแบบของ `examples/deck_bw.js`)

## Split-Screen Shorts (ชุดขาย)

- `.claude/skills/split-screen-shorts/` — แบ่งจอ: กราฟิก "จอจริง" ด้านบน ซับตรงกลาง คนพูดในกรอบล่างที่หัวทะลุกรอบ ตัดชนไปเต็มจอเฉพาะคำเน้น.
- `.claude/skills/split-screen-shorts-overlay/` — เห็นหน้าเต็มจอตลอด กราฟิกแนวนอนลอยเหนือหัว (ส่วนล่างอยู่หลังหัว) ซับแถวมือ.
  สั่งได้เลย: "ตัดต่อคลิปนี้ตาม skill split-screen-shorts" (หรือ `-overlay`) แล้ววางลิงก์คลิป + บทพูดพร้อมเวลา.
- ชุดสีทั้งหมดอยู่ที่ `assets/theme.json` ของแต่ละ skill (ค่าเริ่มต้น 6 สี; ใช้เฉพาะสีในชุด).
- `product/split-screen-shorts/` — README (คู่มือลูกค้า), CLAUDE.md และ .gitignore สำหรับ repo ที่ขาย.
