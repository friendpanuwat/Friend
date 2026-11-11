# ทดลอง skill motion-broll (2026-11-11)

Friend: "ไปค้นหา skill บน GitHub ที่ช่วยให้ claude สามารถสร้าง motion graphics ให้ออกมาดีหน่อย" แล้ว "ลองสร้างตัวอย่างมาให้ผมดูสัก 1 คลิปได้ไหม" (เลือก motion-broll)

- skill: https://github.com/Barty-Bart/motion-graphics `skills/motion-broll` (ใบอนุญาต MIT) แนว "รูปทรงเดียวที่เปลี่ยนรูปต่อเนื่อง ไม่ตัดฉาก" มีเคอร์เซอร์กด และขยับด้วยสปริง
- คลิปคนพูด: `library/sample-clip/character_talking.mp4` (10 วินาที) บทพูดเป็นบทสมมติ 4 ประโยค วางตามช่วงที่มีเสียงพูด (เครื่องฟังเสียงไม่ได้ จึงไม่ตรงกับคำพูดจริง)
- ฉากเดียวยาว 6.6 วินาที (2.40–9.00): ปุ่ม LIVE คนดู 10+ → แชต ตอบกลับ 3 ครั้ง → กราฟออเดอร์ แท่งสุดท้ายสูงเกือบเท่าตัว
- ไฟล์นี้: `01-live-orders.html` (ชิ้นฉากตามรูปแบบของ skill, เพิ่มฟอนต์ไทย Anuphan) และ `plan.json` วิธีสร้างใหม่: clone skill แล้ว `build.py` → `render.js … 24/1` → `composite.py plan.json preview.mp4`
- คลิปผลลัพธ์ส่งให้ Friend ในแชท (ไม่ได้ commit ไฟล์วิดีโอ)
