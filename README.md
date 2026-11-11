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

- `.claude/skills/glow-line-motion/` — skill ทำ motion graphics ลายเส้นขาวเรืองแสงบนพื้นดำ (เส้นวาดตัวเอง, ก่อน→หลัง แบบ "20 WAYS TO SIMPLIFY").
  สั่งได้เลย: "ทำ motion graphic ตาม skill glow-line-motion เรื่อง 5 วิธี…" — มีคู่ภาพสำเร็จ 12 คู่ (ดู `references/catalog.jpg`) และวาดคู่ใหม่ได้
- เลย์เอาต์: rows (1–4 ข้อ), หลายหน้า, grid (โปสเตอร์ 6–20 ข้อ), hero (ข้อเดียวเต็มจอ / B-roll), steps (ไอคอน + ข้อความ)
- ส่งออก MP4 1080×1920 (+ 1:1 / 16:9), PNG, storyboard และ MOV พื้นใส (`--alpha`)
- `motion-samples/glow-line-simplify/` — ตัวอย่างแรกที่เป็นต้นแบบของสไตล์
