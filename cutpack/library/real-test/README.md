# ทดลองกับคลิปจริงของ Friend (18 วินาที)

- `clip_18s.mp4` คลิปที่ Friend ส่งมาเมื่อ 2026-11-04 คลิปนี้ไม่มีคำพูด Friend ให้ Claude เขียนบทเอง (`script.md`)
- `timeline_editorial.js` ใช้การ์ดเต็มจอจากคลังชิ้นฐาน 5 ใบ รวม 55% ของคลิป และมีซับเป็นท่อนบนหน้าคนพูด
- `timeline_overlay.js` ใช้ซับทั้งคลิปกับวิดเจ็ต 6 ชิ้น (ขนาดเตี้ย 5 ชิ้น ขนาดแคบ 1 ชิ้น)
- ผลลัพธ์: `cutpack_editorial_18s.mp4` และ `cutpack_overlay_18s.mp4` เรนเดอร์ด้วย `engine/core/pipeline.sh` (ขั้น frames, build, render, audio และ encode) เสียง -14 LUFS
- timeline ทั้งสองไฟล์ผมเขียนเองในบทบาทของขั้นวางแผนฉาก ในระบบจริง AI จะเป็นคนสร้างแผนฉาก
