# เอนจินของ CutPack

ส่วนกลางที่ทุกสไตล์ใช้ร่วมกัน คัดลอกมาจากเอนจินของ skill `talking-head-editorial` เพื่อให้การแก้ฝั่ง CutPack ไม่กระทบ skill ส่วนตัวของ Friend และการแก้ skill ก็ไม่กระทบ CutPack

## มีอะไรอยู่ที่ไหน

| โฟลเดอร์ | สิ่งที่อยู่ข้างใน |
|---|---|
| `core/` | คัดลอกจาก `.claude/skills/talking-head-editorial` เมื่อ 2026-11-03: `engine_head.html`, `engine_tail.html`, `render.js`, `sfx.py`, `pipeline.sh`, `brand.default.json`, ฟอนต์ Mitr กับ Sriracha และ `licenses/` ทุกไฟล์เหมือนต้นฉบับทุกไบต์ ยกเว้น `build_scene.py`, `engine_tail.html` (เพิ่มการซูมแบบเข้า-ออกนุ่มและกล้องหายใจแบบ talking-head-motion เมื่อ 2026-11-04) และ `engine_head.html` (`cap()` รับความกว้าง `W` ได้ เพื่อให้ซับไม่เข้าแถบปุ่มขวา เมื่อ 2026-11-04) |
| `core/build_scene.py` | เขียนใหม่จากของ skill: ใส่ไอคอนครบชุดลงใน `ICONS` (ถ้าชื่อซ้ำ ใช้ของ skill จึงหน้าตาเหมือนเดิม) และแทรกแพ็กของสไตล์ก่อน `timeline.js` |
| `icons/` | `lucide.json` ไอคอน Lucide ทั้งหมด 1,539 แบบ จาก `lucide-static` 0.460.0 บน npm ดึงมาเมื่อ 2026-11-03 พร้อม `LICENSE-lucide.txt` (ISC) |
| `styles/<สไตล์>/motion.js` | ชุดท่าเคลื่อนไหวที่ล็อกของสไตล์นั้น (`MOTION`, `SOUND`, `mv.*`) ทะเบียนชิ้นส่วน (`PART`, `part`) และสีที่อ่านออกบนพื้นแต่ละสี (`ON`) |
| `styles/<สไตล์>/parts/*.js` | ชิ้นส่วนในคลัง ไฟล์ละหมวด เช่น `B01.js` มีแบบ v1–v4 |
| `styles/<สไตล์>/widgets/*.js` | วิดเจ็ต overlay (`WIDGET`, `widgetAt`) หมวดละ 2 แบบ แต่ละแบบมี 2 ขนาด |
| `plan/` | แผนฉาก JSON และการตรวจแผน: `catalog.js` (สร้าง `catalog.json` จากโค้ด), `plan2timeline.py`, `faces.py`, `validate.py`, `render_check.py`, `fallback.py`, คำขอให้ AI วางแผน (`prompt.py`, `prompt/`), `assemble.py`, ตัวรัน `plan_d.py` และชุดทดสอบ `tests/` ดู `plan/PLAN.md` |
| `models/` | โมเดลหาหน้า YuNet (MIT) สำหรับ `plan/faces.py` |
| `plan/custom_check.py` | ตรวจโค้ดฉากที่ AI เขียนเอง ใช้ได้เฉพาะชุดเครื่องมือ (ด่านแรกจาก 3 ด่าน ดู `plan/PLAN.md`) เบราว์เซอร์ที่เรนเดอร์ (`core/render.js`) ปิดอินเทอร์เน็ตไว้ |
| `requirements.txt` | แพ็กเกจ Python ที่ต้องติดตั้ง (`opencv-python-headless`, `numpy`) |
| `tools/check_parts.py` | ตรวจว่าชิ้นส่วนไม่สร้างท่าเคลื่อนไหวเอง (ห้าม `A(`, `.animate(`, `cubic-bezier`) ไม่สุ่ม (ห้าม `Math.random` และเวลาเครื่อง) และทุกชิ้นประกาศ `name`, `bgs`, `slots`, `dur`, `hit` |

## กฎของชิ้นส่วน
- ขยับของได้ผ่าน `mv.*` และฟังก์ชันใน kit ของ skill เท่านั้น ทุกท่าใช้ค่าความเร็วและเส้นโค้งเดียวกับ skill ท่าที่เพิ่มใหม่ 4 ท่า (`count`, `slide`, `dim`, `ring`) มีป้าย NEW ใน `motion.js` และใช้เส้นโค้งของ skill
- ทุกชิ้นระบุพื้นการ์ดที่ใช้ได้ (`glow` ดำเรืองแสง, `navy` กรมท่า, `white` ขาว, `cream` ครีม) ช่องที่ AI เติมพร้อมความยาวสูงสุด และสิ่งที่เกิดตรงคำสำคัญ ถ้าใส่ค่าผิด เช่น พื้นที่ไม่อนุญาต ข้อความยาวเกิน หรือชื่อไอคอนที่ไม่มี `part()` จะหยุดทันทีพร้อมบอกสาเหตุ
- ตัวเลขบนจอต้องมาจากบทพูด เช่น B01 แบบ v3 ต้องมีทั้งค่าและตัวหาร ("3 ใน 10") หรือหน่วยเป็น %

## วิธีใช้
`bash core/pipeline.sh <โฟลเดอร์งาน> <คลิป.mp4> frames|build|preview|render|audio|encode` เหมือนของ skill ขั้น build เรียก `core/build_scene.py` ซึ่งใช้สไตล์ `editorial` เป็นค่าเริ่มต้น

ขั้น `encode` ต่างจาก skill: บีบอัดรอบเดียวแบบ `medium` crf 21 (เพดาน 4.6 Mbps เท่าเดิม) แทน `slower` 2 รอบ เร็วขึ้นราว 3.4 เท่า และตาแยกไม่ออก (Friend ตกลง 2026-11-04 ดู `../cost-test/encode-compare/`) ขั้น `hq` ยังเป็นแบบเดิม

## ตรวจแล้ว (2026-11-03)
- เรนเดอร์ timeline ตัวอย่างของ skill (`examples/timeline_mg.js`) บนคลิปตัวอย่างของ Friend ด้วยเอนจินของ skill และของ CutPack ได้ภาพตรงกันทุกพิกเซลทั้ง 3 เฟรมที่ทดสอบ (PSNR = inf)
- ไอคอนที่มีเฉพาะในชุดเต็มเรนเดอร์ได้ถูกต้อง เช่น utensils, dumbbell, graduation-cap, heart-pulse, plane และ house
- `tools/check_parts.py` ผ่านทั้ง 20 ชิ้นของรอบแรก
