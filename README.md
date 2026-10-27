# Friend — Talking Head skills

- `.claude/skills/talking-head-motion/` — สไตล์ Swishy (ตัวอักษรพลิก 3D, ฉากกระจกฝ้า + แสงออโรร่า, มาตรฐาน v9).
  สั่ง: "ตัดต่อคลิปนี้ตาม skill talking-head-motion"
- `.claude/skills/talking-head-overlay/` — สไตล์ Swishy แบบ overlay: เห็นหน้าคนพูดตลอด ไม่มีฉากเต็มจอ,
  ซับพลิก 3D + วิดเจ็ตการ์ดมืดเล็ก ๆ เด้งเหนือหัว. สั่ง: "ตัดต่อคลิปนี้ตาม skill talking-head-overlay"
- `.claude/skills/talking-head-editorial/` — สไตล์ editorial (ซับทีละคำ + คำสำคัญตัวใหญ่, การ์ดเต็มจอ, ไม่เกรดสี;
  ใช้รูป/คลิป B-roll ที่ส่งมา หรือ motion graphics สไตล์ Jitter × Swishy ถ้าไม่มี B-roll).
  สั่ง: "ตัดต่อคลิปนี้ตาม skill talking-head-editorial" + ลิงก์คลิป + บทพูดพร้อมเวลา (+ รูป/คลิป B-roll ถ้ามี)
- `.claude/skills/talking-head-editorial-overlay/` — สไตล์ editorial แบบ overlay: เห็นหน้าคนพูดตลอด ไม่มีการ์ดเต็มจอ,
  ซับคำใหญ่แบบ editorial + วิดเจ็ต motion graphics เล็ก ๆ สไตล์ Jitter เด้งเหนือหัว.
  สั่ง: "ตัดต่อคลิปนี้ตาม skill talking-head-editorial-overlay" + ลิงก์คลิป + บทพูดพร้อมเวลา
- เปิด Claude Code โดยเลือก repo นี้ แล้ว skill จะโหลดเองอัตโนมัติ — ถ้าไม่ระบุสไตล์ Claude จะถามว่าเอาแบบไหน
- `product/TalkingHeadMotion-v9-product.zip` — แพ็กเกจสำหรับขาย (skill + คู่มือ + หน้าขาย + License + คลิป before/after)
- `product/docs/` — คู่มือ, หน้าขาย, License, before_after.mp4, edit_v9_final.mp4 (คลิปต้นแบบ v9)

## Mono-Bold Carousel

- `.claude/skills/mono-bold-carousel/` — skill ทำ carousel ธีมขาว-ดำ ตัวหนา (เน้นคำด้วยเส้นใต้ ไม่มีกรอบ/ขีดฆ่า/ตัวหนังสือสีเทา).
  สั่งได้เลย: "ทำ carousel ตาม skill mono-bold-carousel" แล้ววางสคริปต์สไลด์
- `carousels/repeat-customers-bw/` — ตัวอย่างงานจาก skill นี้ (ต้นแบบของ `examples/deck_bw.js`)
