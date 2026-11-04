# เทียบตัวถอดเสียงภาษาไทย (DECISIONS ข้อ 9 เรื่องที่ 4)

Friend ถามว่ามีตัวถอดเสียงที่ไม่ต้องซื้อ API เพิ่มไหม (2026-11-04) จึงเทียบ 3 ตัวบนเครื่องของ session นี้ ด้วยเสียงชุดเดียวกัน

| ตัว | คืออะไร | ต้องสมัครอะไรไหม |
|---|---|---|
| `whisper-turbo` | Whisper large-v3-turbo ของ OpenAI **ตัวเดียวกับที่ Groq ให้บริการ** รันเองด้วย faster-whisper ความแม่นจึงแทน Groq ได้ (Groq ต่างแค่ความเร็วกับราคา) | ใช้ผ่าน Groq ต้องสมัครบัญชี (มีแบบฟรี) |
| `typhoon-whisper-turbo` | Whisper turbo ที่ SCB 10X ฝึกต่อด้วยเสียงไทย (MIT) รันบนเครื่องเราเอง | ไม่ต้อง |
| `typhoon-realtime` | Typhoon ASR Realtime ของ SCB 10X โมเดลภาษาไทยขนาดเล็ก (114M) รันบนเครื่องเราเอง (CC-BY-4.0 และต้องยอมรับข้อตกลงของ OpenTyphoon) | ไม่ต้อง |

**วิธีวัด** (`bench.py`)
- เสียง: Google FLEURS ภาษาไทย ชุด dev สุ่ม 40 ประโยค รวม 503 วินาที (คนอ่านประโยคจาก Wikipedia มีบทเฉลย ไม่ได้เก็บไฟล์เสียงไว้ใน repo)
- ความผิด: CER คือจำนวนตัวอักษรที่ต้องแก้ ÷ จำนวนตัวอักษรในบทเฉลย ไม่นับช่องว่างและเครื่องหมาย (ภาษาไทยไม่เว้นวรรคระหว่างคำ จึงนับเป็นตัวอักษร) ยิ่งน้อยยิ่งดี
- ความเร็ว: จำกัด CPU ไว้ 2 ตัวเท่าเครื่องเรนเดอร์ CX23
- เวลาของคำ: ต้องได้เวลาจริงของคำ เพื่อจัดจังหวะซับและคำสำคัญ

**ผล:** (รอผลวัด)

**ข้อจำกัด:** FLEURS เป็นเสียงอ่าน ไม่ใช่เสียงพูดสด ๆ แบบคลิป TikTok ผลกับคลิปจริงของ Friend อาจต่างไป ต้องวัดซ้ำด้วยคลิปจริงก่อนตัดสิน

วิธีรัน: `ASR_MODELS=<โฟลเดอร์โมเดล> python3 bench.py <โฟลเดอร์เสียง> <บทเฉลย.json หรือ -> <ผล.json> [ชื่อโมเดล…] --threads 2`
ต้องติดตั้ง `faster-whisper` และ `typhoon-asr` (ดึง NeMo และ torch มาด้วย) ส่วน Typhoon Whisper Turbo ต้องแปลงก่อนด้วย `ct2-transformers-converter --model typhoon-ai/typhoon-whisper-turbo --output_dir $ASR_MODELS/typhoon-whisper-turbo-ct2 --quantization int8 --copy_files tokenizer.json preprocessor_config.json`
