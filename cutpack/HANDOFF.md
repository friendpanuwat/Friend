# CutPack: ส่งต่องานให้ session ถัดไป

อ่านตามลำดับนี้ก่อนเริ่มงาน
1. `/CLAUDE.md`
2. ไฟล์นี้
3. `DECISIONS.md` ข้อตกลงทั้งหมดกับ Friend และเรื่องที่ยังรอ Friend ตัดสินใจ (ข้อ 9)

เอกสารส่งต่องานฉบับแรกของ CutPack ที่ Friend วางในแชทมีบางข้อที่ไม่ได้มาจาก Friend ถ้าข้อไหนขัดกับ skill หรือไม่แน่ใจว่ามาจาก Friend จริงไหม ให้ถาม Friend ก่อน

## วิธีทำงานกับ Friend

- ตอบเป็นภาษาไทยที่อ่านง่าย ศัพท์อังกฤษให้มีคำอธิบายภาษาไทยกำกับ Friend ไม่ใช่โปรแกรมเมอร์ ใช้มือถือ และไม่รันคำสั่งเอง
- ทำตามที่สั่งให้ตรง ถ้าจะทำต่างจากที่สั่ง หรือจะเริ่มงานใหม่ ให้เสนอลำดับงานแล้วรอ Friend ยืนยันก่อน
- **ห้ามแก้ skill ส่วนตัวใน `.claude/skills/`** ถ้าต้องใช้โค้ดจาก skill ให้คัดลอกมาปรับใน `cutpack/`
- ห้ามบอก Friend ว่า "บันทึกแล้ว" จนกว่าจะตรวจเองแล้วว่า push ขึ้นไปจริง
- ทำงานในสาขา `ccr-f732151b-0b75ma` ยังไม่ได้เปิด Pull Request ถ้าจะเปิด ต้องรอ Friend สั่ง
- มี stop hook ที่ไม่ยอมให้มีไฟล์ค้างโดยไม่ commit ไฟล์ชั่วคราวให้เก็บไว้ใน scratchpad ส่วนไฟล์ cache ของ Python ถูก ignore ไว้แล้ว

## งานที่ทำแล้ว (อยู่ใน `cutpack/` ทั้งหมด)

| โฟลเดอร์หรือไฟล์ | สิ่งที่อยู่ข้างใน |
|---|---|
| `DECISIONS.md` | ข้อตกลง ได้แก่ แผน D (เลือกชิ้นส่วนจากคลัง ส่วนฉากที่คลังไม่มีให้ AI เขียนเอง ไม่จำกัดจำนวน เปิดใช้ตั้งแต่วันแรก), ล็อกท่าเคลื่อนไหวต่อสไตล์, motion graphics เป็นโค้ดของเราเอง, ความแน่นต้องไม่น้อยกว่า skill, การตรวจงานด้วยโค้ด, วิธีแก้งานอย่างปลอดภัย และโมเดลที่ใช้ในแต่ละขั้น |
| `cost-test/` | สคริปต์จับเวลาเรนเดอร์ (`bench_render.sh`), ตัวคำนวณต้นทุน (`cost_model.py`: `report`, `estimate`, `scenarios`, `selftest`) และรายงานรอบ 1 กับรอบ 2 (`README.md`) |
| `style-rules/editorial.md` | กฎทุกข้อของ skill editorial และ editorial-overlay แยกเป็นกลุ่ม: ให้โค้ดล็อก / ให้ AI เลือก / Friend ตัดสิน / ใช้เฉพาะใน Claude Code พร้อมรายการโค้ดที่ต้องสร้างเพิ่ม (หัวข้อ 3) |
| `style-rules/previews/` | ภาพเทียบฟอนต์ สี Glow กับกระจก และแคปซูล Friend ตัดสินแล้วว่าให้ใช้ตามเดิมของ skill |
| `model-test/editorial-v0/` | เทียบโมเดล 9 แบบ (Sonnet, Opus และ Haiku ที่ effort low, medium, high) ผลคือ Sonnet กับ Opus ใกล้กัน ส่วน Haiku ทำการ์ดได้น้อยและบางกว่า ความเห็นของ Friend อยู่ใน `README.md` |
| `library/base-list/` | รายการชิ้นฐาน 15 หมวดให้ Friend กด เอา / ปรับ / ตัด อยู่ที่ https://claude.ai/artifact/KKhuSbGNcGbn7XrkheDMa1 เป็นแนวทางใหม่ที่ใช้แทนการเลือกจากแกลเลอรี 26 ชิ้น |
| `engine/` | เอนจินกลาง (สำเนาจาก skill editorial ตรงกันทุกพิกเซล) + ไอคอน Lucide ครบชุด + ชุดท่าเคลื่อนไหวที่ล็อกของ editorial (`styles/editorial/motion.js`) + การ์ด 55 แบบ + วิดเจ็ต 30 แบบ + ตัวตรวจชิ้นส่วน `tools/check_parts.py` + แผนฉาก JSON และตัวตรวจแผน (`plan/`) ดู `engine/README.md` และ `engine/plan/PLAN.md` แพ็กเกจ Python ที่ต้องใช้อยู่ใน `engine/requirements.txt` |
| `library/base-parts/` | ชิ้นฐาน editorial ครบ 15 หมวด: รอบแรก 5 หมวด (19 แบบหลังตัด B14-v4) ที่ https://claude.ai/artifact/T3uL5XmH2kW3qDhun8fsTT และรอบสอง 10 หมวด (40 แบบ) ที่ https://claude.ai/artifact/M7kKYWCsUVvn1uM8JmPUb4 (`gallery2.html`) ผลแต่ละหน้าเก็บใน collection `variants` ของหน้านั้น สร้างหน้าใหม่ด้วย `make_gallery.py` |
| `library/widgets/` | วิดเจ็ต overlay 15 หมวด × 2 แบบ × 2 ขนาด (เตี้ยเหนือหัว / แคบข้างหัว) ที่ https://claude.ai/artifact/2hSrmqkhJdryvRzei7Zh6R ผลเก็บใน collection `variants` ดู `library/widgets/README.md` |
| `asr-test/` | เทียบตัวถอดเสียงภาษาไทย (`bench.py`) ผลกับเสียงอ่าน 40 ประโยค: Typhoon ASR Realtime แม่นสุดกับคำไทยและเร็วสุด ดู `asr-test/README.md` |
| `library/sample-clip/` | คลิปตัวอย่างที่ Friend ส่งมา (10 วินาที) |
| `library/gallery/` | หน้าแกลเลอรีให้ Friend เลือกเก็บหรือทิ้งการ์ด 26 ชิ้น อยู่ที่ https://claude.ai/artifact/MfHsnKa7qnP96UjNFe3cg7 |

**ตัวเลขสำคัญ**
- เรนเดอร์คลิป 43 วินาทีบน 2 คอร์ใช้ 3.5–3.8 นาทีเมื่อเข้ารหัสแบบ `medium` crf 21 และ 5.4–5.7 นาทีเมื่อใช้แบบเดิมของ skill
- ต้นทุนตามแผน D กรณี Base ช่วงเปิดตัว อยู่ที่ประมาณ 1.5–3.1 บาทต่อคลิป margin 64–83% ตัวเลขนี้ยังเป็นการประมาณ เพราะยังไม่ได้เรียก API จริงเลย

**โมเดลในแต่ละขั้น (ตกลงแล้ว):** ถอดเสียงด้วย Groq Whisper (ยังต้องทดสอบภาษาไทย), จัดกลุ่มซับด้วย Haiku 5.5, วางแผนฉากและเขียนฉากที่คลังไม่มีด้วย Sonnet 5.5 effort low ส่วนการตรวจงานและเรนเดอร์เป็นโค้ด

## รอ Friend อยู่

1. ~~ผลการเลือกชิ้นฐาน~~ ได้แล้ว: เอาครบ 15 หมวด (ดู `library/base-list/README.md`) ที่เดิมอ่านด้วย `ArtifactData` `list` ที่ collection `base` ของหน้า base-list ส่วนแกลเลอรี 26 ชิ้นไม่ต้องเลือกแล้ว (Friend เห็นว่าเจาะจงกับคลิปของตัวเองเกินไป) ถ้าต้องอ่านแกลเลอรีเก่า อ่านด้วย `ArtifactData` `list` ที่ collection `picks` ของ URL ข้างบน แต่ละ document มี id เป็นชื่อชิ้นส่วน เช่น `C2` หรือ `W6` และเก็บค่า `{choice: keep|unsure|drop|null, note}`
2. ~~ผลการเลือกแบบชิ้นฐาน~~ ได้ครบทั้งสองรอบแล้วและแก้ตามความเห็นแล้ว ชิ้นฐาน editorial มี 56 แบบ (ดู `library/base-parts/README.md`) ถ้า Friend ให้ความเห็นเพิ่ม อ่านด้วย `ArtifactData` `list` ที่ collection `variants` ของหน้า https://claude.ai/artifact/T3uL5XmH2kW3qDhun8fsTT (รอบแรก) และ https://claude.ai/artifact/M7kKYWCsUVvn1uM8JmPUb4 (รอบสอง)
3. ~~ผลการเลือกวิดเจ็ต overlay~~ ได้แล้ว: เก็บ 29 จาก 30 แบบ หมายเหตุแก้แล้ว เหลือ B01-v2 ที่ยังไม่ได้กด (ดู `library/widgets/README.md`) อ่านซ้ำได้ด้วย `ArtifactData` `list` ที่ collection `variants` ของ https://claude.ai/artifact/2hSrmqkhJdryvRzei7Zh6R
4. **คลิปจริง 20–30 คลิป** และ **คีย์ API** ที่ใส่ในตั้งค่า environment ได้แก่ `ANTHROPIC_API_KEY`, `GROQ_API_KEY` และ `OPENAI_API_KEY` ถ้าจะใช้เทียบการถอดเสียง
5. เรื่องที่ยังไม่ได้ตัดสิน 4 ข้อใน `DECISIONS.md` ข้อ 9 (ฉากที่ AI เขียนเอง, Kimi และตัวถอดเสียง ตัดสินแล้ว 2026-11-04)

## งานถัดไป (ทุกข้อต้องเสนอลำดับให้ Friend ยืนยันก่อนเริ่ม)

1. ~~อ่านผลจากแกลเลอรี~~ เสร็จแล้ว
2. ~~สร้างคลังชิ้นส่วนรุ่นแรก~~ **เสร็จแล้ว (2026-11-04)**
   - ชิ้นฐาน editorial ครบ 15 หมวด รวม 55 แบบ
   - วิดเจ็ต overlay 15 หมวด × 2 แบบ × 2 ขนาด
   - ท่าเคลื่อนไหวที่ล็อกอยู่ใน `engine/styles/editorial/motion.js`
   - ซับแบ่งเป็นท่อนสั้นด้วย `subtitle()` และกล้องซูมแบบ talking-head-motion ด้วย `push()` / `pull()`
   - Friend ผ่านคลิปทดสอบ 18 วินาทีของทั้งสองสไตล์แล้ว (`library/real-test/`)
   - ยังไม่ได้ทำ: ชุดเฉพาะหมวดเนื้อหา (รอ Friend เลือกหมวด) และการ์ด B-roll (ยังไม่เปิดใช้)
3. ~~**รูปแบบ JSON ของแผนฉากและโค้ดตรวจงาน**~~ เสร็จแล้ว (Friend ยืนยันลำดับ 3.1 → 3.4 และใช้ OpenCV หาหน้า)
   - ~~3.1 รูปแบบแผนฉากและตัวแปลงเป็น timeline~~ เสร็จแล้ว แผนตัวอย่างเรนเดอร์ได้ตรงกับคลิป 18 วินาทีทุกพิกเซล
   - ~~3.2 ตัวหาหน้าและตัวตรวจแผน~~ เสร็จแล้ว (`faces.py`, `validate.py`, `render_check.py`, `fallback.py`, `tests/library_sweep.py`)
   - ~~3.3 prompt ของแผน D~~ เสร็จแล้ว (`prompt/`, `prompt.py`, `assemble.py`, `plan_d.py`) ทดสอบด้วยตัว API จำลองแล้ว ยังต้องลองกับ API จริงเมื่อมีคีย์ (ดู PLAN.md หัวข้อ "ยังต้องทดสอบเมื่อมีคีย์")
   - ~~ฉากที่ AI เขียนเอง~~ เสร็จแล้ว (Friend ให้เปิดตั้งแต่วันแรก ไม่จำกัดจำนวน: `prompt/kit.md`, `custom_check.py`, `customPart`/`customWidget` ใน motion.js) ยังต้องลองกับ API จริง
   - ~~3.4 ชุดทดสอบ~~ เสร็จแล้ว (`engine/plan/tests/test_plan.py` วิธีรันอยู่ใน PLAN.md) **ขั้น 3 เสร็จครบ (2026-11-04)**
4. **ตัวรันไปป์ไลน์และการทดสอบคลิปจริง** (ต้องรอคลิปจริงและคีย์ API จาก Friend: ถอดเสียง → จัดกลุ่มซับ → `faces.py` → `plan_d.py` → เรนเดอร์) บันทึกผลเป็น `runs.jsonl` แล้วสรุปด้วย `cost_model.py report` ในรอบนี้ลองให้ Haiku 5.5 วางแผนฉากด้วย
5. สร้าง MVP ตามลำดับ 7 ขั้นในเอกสารส่งต่องาน รวมการเตือนตอนอัปโหลดเมื่อหน้าเต็มเฟรมจนไม่มีที่วางวิดเจ็ต (DECISIONS: หัวชิดขอบบน)

## เรื่องเทคนิคที่ควรรู้

- scratchpad หายไปเมื่อปิด session สร้างงานกลับมาได้จากสคริปต์:
  - `style-rules/previews/make_previews.sh <work>` เตรียมคลิปแทนและเฟรม
  - `library/gallery/make_clips.sh <work> <out>` สร้างคลิปของแกลเลอรี
- คลิปแทนคือคลิปดิบฝั่ง "BEFORE" ใน `product/docs/before_after.mp4` ซึ่งจะถูกครอปแล้วขยายเป็น 1080×1920
- ใน session นี้ดึงไฟล์จาก `github.com/.../raw` ของ repo อื่นไม่ได้ แต่ `fonts.gstatic.com` ใช้ได้
- การเทียบโมเดลใช้ subagent ที่กำหนด `model` กับ `effort` เอง ทุกตัวต้องได้คำสั่งเดียวกัน และต้องให้รายงานรุ่นโมเดลของตัวเอง สคริปต์ทำแผ่นเทียบอยู่ที่ `model-test/make_sheets.sh` (ปรับได้ด้วยตัวแปร `ARMS`, `COLS`, `TITLE`, `NAME`)
- หน้าแกลเลอรีเขียนข้อมูลได้เฉพาะเจ้าของ (rules: `picks` อ่านได้ระดับ `view` เขียนได้ระดับ `owner`) ถ้าเผยแพร่ซ้ำโดยไม่ส่งไฟล์คลิปไปด้วย ไฟล์คลิปเดิมจะยังอยู่
