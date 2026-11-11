# วิธีถอดเสียงที่ CutPack ใช้ (สรุปส่งต่อให้แชทอื่น)

เขียน 2026-11-11 จากโค้ดและผลทดสอบในสาขา `ccr-ff7bfa83-eld4pq` ของ repo `friendpanuwat/friend`

## สรุปสั้น

- **ถอดเสียงด้วย Typhoon ASR Realtime** (`typhoon-ai/typhoon-asr-realtime` ของ SCB 10X) รันบนเครื่องเราเองด้วย CPU **ไม่เสียค่า API**
- ได้คำพร้อมเวลาเริ่มและเวลาจบของแต่ละคำ เพื่อใช้จัดจังหวะซับ
- **จัดคำเป็นซับด้วย Claude Haiku 5.5** AI เลือกแค่ว่าวลี ท่อน และบรรทัด จบที่คำไหน **ไม่ได้เขียนคำเอง** จึงเปลี่ยนคำที่ถอดมาไม่ได้ ค่าใช้จ่ายราว 0.02–0.05 บาทต่อคลิป
- ถ้าไม่มีคีย์ API หรือ AI ตอบไม่ใช้ได้ โค้ดจะจัดซับตามกฎแทน คลิปจึงไปต่อได้เสมอ
- **คำที่ถอดผิดให้ลูกค้าแก้เอง** ในขั้นตรวจซับของเว็บ ตามที่ Friend ตกลงไว้ตอนเลือก Typhoon

## ขั้นตอนทั้งหมด

| ขั้น | ทำอะไร | เครื่องมือ | ไฟล์ที่ได้ |
|---|---|---|---|
| 1 | ดึงเสียงจากวิดีโอ เป็นเสียงโมโน 16 kHz และปรับระดับเสียง | ffmpeg | (อยู่ในหน่วยความจำ) |
| 2 | ถอดเสียง ได้ "ชิ้นคำย่อย" พร้อมเวลาที่ได้ยิน | Typhoon ASR Realtime ผ่าน NeMo | |
| 3 | รวมชิ้นคำย่อยเป็นคำเต็ม พร้อมเวลาเริ่ม/จบของแต่ละคำ | โค้ดเรา + PyThaiNLP (ตัดคำไทย) | `words.json` |
| 4 | จัดคำเป็นวลี ท่อน และบรรทัดของซับ | Claude Haiku 5.5 (หรือกฎ ถ้าไม่มีคีย์) | `captions.json` |
| 5 | ลูกค้าตรวจและแก้คำผิดในหน้าเว็บ | หน้าเว็บขั้นที่ 4 (ยังเป็น mockup) | `captions.json` ที่แก้แล้ว |

## ทำไมเลือก Typhoon ASR Realtime

Friend ถามว่ามีตัวถอดเสียงที่ไม่ต้องซื้อ API เพิ่มไหม (2026-11-04) จึงเทียบ 3 ตัวด้วยเสียงชุดเดียวกัน ใช้ Google FLEURS ภาษาไทย 40 ประโยค รวม 503 วินาที บน CPU 2 ตัว (เท่าเครื่องเรนเดอร์ CX23)

| ตัว | ผิด ทุกประโยค | ผิด ไทยล้วน | ผิด มีตัวเลข/อังกฤษ | เวลาถอด 503 วินาที |
|---|---|---|---|---|
| Whisper large-v3-turbo (ตัวเดียวกับที่ Groq ให้บริการ) | 13.9% | 10.9% | 20.2% | 488 วินาที |
| Typhoon Whisper Turbo | 74.5% | 51.9% | 121% | 3,190 วินาที |
| **Typhoon ASR Realtime** | 14.5% | **5.9%** | 32.2% | **26 วินาที** |

(ผิด = CER คือจำนวนตัวอักษรที่ต้องแก้ หารด้วยจำนวนตัวอักษรในบทเฉลย ไม่นับช่องว่าง ยิ่งน้อยยิ่งดี)

- ถอด**คำไทยแม่นที่สุด** ผิดราวครึ่งหนึ่งของ Whisper
- **เร็วกว่าเสียงจริงราว 20 เท่า** รันบนเครื่องเรนเดอร์ได้
- ให้**เวลาจริงของคำ** ละเอียดพอสำหรับจังหวะคำสำคัญ
- คะแนนรวมดูแย่ เพราะเขียนตัวเลขเป็นคำ เช่น "หนึ่งพัน" แทน "1,000" ซึ่งความหมายยังถูก
- **จุดอ่อนจริงคือชื่อภาษาอังกฤษ** เช่น "Portfolio" ถอดเป็น "Pod Folio" ส่วน Whisper สะกดชื่ออังกฤษถูก แต่คำไทยพลาดมากกว่า
- Typhoon Whisper Turbo ใช้ไม่ได้ในแบบที่ลอง 12 จาก 40 ประโยคถอดซ้ำวนเป็นวง และช้ามาก

Friend ดูคลิปจริงแล้วเห็นว่าคำผิดมีบ้างแต่น้อย ไม่ร้ายแรง จึงตกลงใช้ตัวนี้ (DECISIONS 2026-11-04) รายละเอียดการวัดอยู่ที่ `cutpack/asr-test/README.md` และสคริปต์วัดอยู่ที่ `cutpack/asr-test/bench.py`

## ติดตั้ง

ต้องมี Python 3 กับ ffmpeg ส่วนแพ็กเกจถอดเสียงมีขนาดใหญ่ (NeMo + torch หลาย GB ใช้หน่วยความจำราว 1 GB ตอนรัน) บนเครื่อง Debian แบบที่ใช้ในแชทนี้ ต้องติดตั้งตามลำดับนี้ (2026-11-04)

```bash
pip install --ignore-installed wheel setuptools      # ของ Debian อัปเกรดทับไม่ได้
pip install antlr4-python3-runtime==4.9.3             # แพ็กเกจเก่าที่ NeMo ต้องใช้ ล้มถ้า setuptools เก่า
pip install typhoon-asr soundfile                     # ดึง NeMo กับ torch มาด้วย
pip install pythainlp                                 # ตัดคำไทย ใช้รวมชิ้นคำย่อยเป็นคำ
pip install --force-reinstall --no-deps packaging     # ทำเฉพาะเมื่อ transformers บอกว่าเทียบเวอร์ชัน packaging ไม่ได้
```

ครั้งแรกที่รัน โมเดลจะดาวน์โหลดจาก Hugging Face เอง ไม่ต้องมีคีย์อะไร

## วิธีเรียก

ถอดเสียงอย่างเดียว:

```bash
python3 cutpack/engine/plan/asr.py <คลิปหรือไฟล์เสียง> words.json --threads 2
```

ได้ไฟล์หน้าตาแบบนี้ (ตัวเลขในตัวอย่างเป็นตัวเลขสมมติ `pieces` คือชิ้นคำย่อยดิบจากโมเดล):

```json
{"words": [{"w": "ทำไม", "t0": 0.32, "t1": 0.61}, {"w": "คลิป", "t0": 0.61, "t1": 0.95}],
 "pieces": [...], "text": "ทำไมคลิป...", "model": "typhoon-ai/typhoon-asr-realtime",
 "audio_s": 52.1, "seconds": 8.3}
```

จัดซับจากคำที่ถอดได้ (ต้องมี `ANTHROPIC_API_KEY` ถ้าไม่มีจะจัดตามกฎ):

```bash
python3 cutpack/engine/plan/captions.py words.json captions.json          # ใช้ Haiku
python3 cutpack/engine/plan/captions.py words.json captions.json --rules  # ไม่ใช้ AI
```

ในระบบจริง `cutpack/engine/run_clip.py` เรียกทั้งสองขั้นต่อกันให้เอง

## จุดสำคัญในโค้ดถอดเสียง (`cutpack/engine/plan/asr.py`)

1. **เรียก NeMo ตรง ไม่ใช้ฟังก์ชันของแพ็กเกจ `typhoon-asr`** เพราะฟังก์ชันของแพ็กเกจแค่เกลี่ยเวลาเท่า ๆ กันทั้งคลิป ใช้จับจังหวะซับไม่ได้ ต้องเรียก `model.transcribe(..., return_hypotheses=True, timestamps=True)` แล้วอ่านเวลาจาก `hyp.timestamp['char']`
2. **เตรียมเสียงแบบเดียวกับแพ็กเกจ** ใช้ ffmpeg แปลงเป็นโมโน 16 kHz แล้วหารด้วยค่าสูงสุดให้ระดับเสียงเต็ม
3. **แก้ตัวอักษร** ทำ NFC และรวม "ํ" + "า" ที่โมเดลเขียนแยกกัน กลับเป็น "ำ"
4. **รวมชิ้นคำย่อยเป็นคำเต็ม** (`to_words`) เพราะโมเดลอาจตัดกลางพยางค์ (ไอ|เด|ีย) และภาษาอังกฤษมาทีละตัวอักษร (M|a|r|k|s)
   - ต่อทุกชิ้นเป็นข้อความเดียว ให้แต่ละตัวอักษรมีเวลาเกลี่ยระหว่างชิ้นนั้นกับชิ้นถัดไป
   - ตัดคำใหม่ตามช่องว่างในข้อความเต็มที่โมเดลให้มา และตรงที่เงียบเกิน 0.6 วินาที
   - ตัดคำไทยที่ติดกันด้วยพจนานุกรม PyThaiNLP (newmm)
   - ถ้าไม่มีข้อความเต็มที่ใช้ได้ ใช้ขอบชิ้นแทน แต่ไม่ตัดหน้าสระหลัง (ะ า ิ ี ...) และไม่ตัดหลังสระหน้า (เ แ โ ใ ไ)
   - เครื่องหมายที่อยู่เดี่ยว ๆ ติดไปกับคำก่อนหน้า
   - คำหนึ่งยาวจนคำถัดไปเริ่ม ถ้าเว้นเกิน 0.3 วินาทีให้จบหลังเสียงสุดท้าย 0.25 วินาที
5. **โหลดโมเดลครั้งเดียวแล้วเก็บไว้** การโหลดใช้ราว 12 วินาที (หลังเครื่องรีสตาร์ตครั้งแรกนานถึง 3 นาที) ถ้าเปิดเซิร์ฟเวอร์ค้างไว้จะเหลือแค่เวลาถอดจริง

## จุดสำคัญในขั้นจัดซับ (`cutpack/engine/plan/captions.py`)

- **ซับมี 3 ระดับ**
  - วลี: คำที่เขียนติดกันไม่เว้นวรรค แบบที่ซับไทยเขียนกัน เช่น "ทำไมคลิป"
  - ท่อน: สิ่งที่ขึ้นบนจอพร้อมกัน ราว 12 ตัวอักษร ไม่เกิน 16 และวลีสุดท้ายของท่อนจะขึ้นตัวใหญ่
  - บรรทัด: ช่วงพูดหนึ่งประโยค จบที่ช่วงเงียบหรือขึ้นเรื่องใหม่
- **ส่งให้ Haiku เป็นรายการคำมีเลขกำกับ** พร้อมเวลาเริ่ม จำนวนตัวอักษร และช่วงเงียบ แล้ว AI ตอบเลขคำสุดท้ายของแต่ละวลีกลับมาในรูป JSON (`{"lines":[{"chunks":[{"phrase_ends":[...]}]}]}`) บังคับรูปแบบด้วย structured output และปิดการคิด (`thinking: disabled`, effort low)
- **ตรวจคำตอบด้วยโค้ด** เลขคำต้องเรียงขึ้น ครบทุกคำ ไม่มีคำที่ไม่มีจริง ถ้าไม่ผ่านใช้กฎแทน
- **ถ้า AI ตอบหยุดกลางทาง** (เจอ 2 ใน 4 คลิปจริง) ถามต่อจากคำที่ค้างได้สูงสุด 4 รอบ ที่ยังเหลือจัดตามกฎ
- **โค้ดบังคับเพิ่มหลังจาก AI ตอบ**
  - คำอังกฤษและตัวเลขแยกเป็นวลีของตัวเองเสมอ
  - ตัวเลขอยู่ท่อนเดียวกับหน่วย (3 เท่า, 30%, 1,000 บาท)
  - ท่อนที่ยาวเกิน 16 ตัวอักษรถูกตัดตามกฎ
  - คำลงท้ายสั้น ๆ (ครับ นะ เลย ...) ไม่ปล่อยให้เป็นคำตัวใหญ่ตัวเดียว
- **จัดตามกฎเมื่อไม่ใช้ AI**: ขึ้นบรรทัดใหม่ที่ช่วงเงียบ 0.35 วินาที หรือเมื่อบรรทัดยาวราว 3.6 วินาที / 4 ท่อน ขึ้นท่อนใหม่เมื่อเกิน 12 ตัวอักษร

## ผลกับคลิปจริงของ Friend (4 คลิป 2026-11-05)

- **ถอดเสียง ราว 20 วินาทีต่อคลิป** รวมโหลดโมเดล ค่าใช้จ่าย 0 บาท
- **จัดซับด้วย Haiku ราว 5 วินาที** ค่าใช้จ่าย 0.02–0.05 บาทต่อคลิป (ตัวอย่างหนึ่งคลิป: ส่ง 4,832 โทเคน ได้กลับ 1,330 โทเคน)
- **คำที่ถอดผิดที่เจอ** ส่วนใหญ่เป็นคำหรือชื่อภาษาอังกฤษ เช่น "ยูไซเนส" และ "Conprentblenport" (comprehensible input) ลูกค้าแก้ได้ในขั้นตรวจซับ

## ข้อจำกัดและสิ่งที่ยังค้าง

- **ชื่อและคำภาษาอังกฤษถอดเพี้ยนบ่อย** ทางแก้ที่คิดไว้แต่ยังไม่ทำ คือช่อง "คำเฉพาะของคุณ" ให้ลูกค้ากรอกชื่อแบรนด์ไว้แก้คำถอดเพี้ยนอัตโนมัติ ถ้าคลิปพูดอังกฤษเยอะแล้วผิดมาก ทางสำรองคือ Whisper ผ่าน Groq
- **ต้องอ่านข้อตกลงของ OpenTyphoon เรื่องใช้เชิงพาณิชย์ก่อนเปิดขาย** (โมเดลเป็น CC-BY-4.0)
- **ต้องลองบนเครื่อง CX23 จริง** หน่วยความจำ 4 GB ต้องใช้ร่วมกับ Chromium ที่เรนเดอร์
- ผลวัดความแม่นใช้เสียงอ่าน (FLEURS) ไม่ใช่เสียงพูดสดแบบคลิป TikTok คลิปจริงยังไม่มีบทเฉลยจึงยังไม่มีตัวเลขความแม่น

## ไฟล์ใน repo

| ไฟล์ | คืออะไร |
|---|---|
| `cutpack/engine/plan/asr.py` | ขั้นถอดเสียง (โค้ดเต็มอยู่ท้ายไฟล์นี้) |
| `cutpack/engine/plan/captions.py` | ขั้นจัดซับด้วย Haiku หรือกฎ |
| `cutpack/engine/run_clip.py` | เรียกทุกขั้นต่อกัน ตั้งแต่ถอดเสียงจนเรนเดอร์ |
| `cutpack/engine/requirements.txt` | รายการแพ็กเกจและลำดับการติดตั้ง |
| `cutpack/asr-test/` | ผลเทียบตัวถอดเสียง 3 ตัว และสคริปต์วัด |
| `cutpack/DECISIONS.md` | สิ่งที่ตกลงกันแล้ว (หัวข้อถอดเสียงอยู่ช่วงต้นไฟล์) |

## ภาคผนวก: system prompt ที่ส่งให้ Haiku จัดซับ

(ค่า 12, 16 และ 0.35 มาจาก `RULES` ใน `cutpack/engine/plan/validate.py`)

```text
You turn a Thai talking-head transcript into on-screen subtitles for a vertical video (TikTok, Reels).
The transcript comes as numbered words, each with its start time and its letter count. You never write, change, add,
drop or reorder words. You only choose where phrases, chunks and lines end, by word number.

Rules
- Phrase: words written together with no space between them, the way Thai captions are written (ทำไมคลิป, ของคุณ). Usually 1 to 3 words, about 3 to 8 letters. A particle such as ครับ ค่ะ นะ อ่ะ เนี่ย เลย joins the word before it. An English word or a number is a phrase on its own.
- Chunk: what shows on screen at one time, 1 to 3 phrases, about 12 letters and never more than 16 (the letter counts are given; add them up). The last phrase of a chunk is shown big under the others, so make it the phrase that carries the meaning (a noun, a number with its unit, a key verb or adjective), never a particle alone.
- A number stays in the same chunk as its unit, and the unit comes right after it (3 เท่า, 30%, 1,000 บาท).
- Line: one phrase or short sentence, usually 2 to 4 chunks over about 1.5 to 4 seconds. End a line at a pause, at the end of a sentence, or before a new idea. A long sentence becomes several lines.
- Within a line, give each chunk at least 0.35 seconds on average.

Answer with JSON only: {"lines": [{"chunks": [{"phrase_ends": [...]}]}]}. phrase_ends lists the number of the last word of each phrase in that chunk, in order; the last one ends the chunk. The first line starts at word 0, everything continues in order with no gap, and the last phrase of the last line ends at the last word.
```

## ภาคผนวก: โค้ดถอดเสียงทั้งไฟล์ (`cutpack/engine/plan/asr.py`)

```python
#!/usr/bin/env python3
"""Transcription step (DECISIONS 2, step 2): Typhoon ASR Realtime on our own machine → words with their times.

usage: asr.py <audio or video> <words.json> [--threads 2]
writes {"words": [{"w", "t0", "t1"}], "text", "model", "audio_s", "seconds"}

Friend agreed (2026-11-04) to Typhoon ASR Realtime: most accurate on Thai words and fastest of the three tested
(asr-test/README.md). The model is called through NeMo directly, as asr-test/bench.py does, because the typhoon-asr
package only spreads word times evenly over the clip, which is no use for timing subtitles. Its timestamps are
sub-word pieces, fine enough for the key word of each chunk.
Needs: pip install typhoon-asr soundfile (pulls NeMo and torch, several GB; about 1 GB of memory while running).
The model downloads from Hugging Face on first use. Before selling: read OpenTyphoon's terms for commercial use.
"""
import json, os, subprocess, sys, tempfile, time, unicodedata

MODEL = 'typhoon-ai/typhoon-asr-realtime'
_model = None
DEP = 'ะัาำิีึืฺุู็่้๊๋์ํ๎'   # Thai vowels and marks written after their consonant: never start a word
LEAD = 'เแโใไ'               # vowels written before their consonant: never end a word
PAUSE = 0.6                  # pieces carry the moment they were heard, not a span: a jump this big is a pause


def thai(s): return any('฀' <= c <= '๿' for c in s)


def split_thai(group):
    """A run of Thai with no space → words, with a Thai dictionary (PyThaiNLP newmm, Apache-2.0) when installed."""
    if not thai(group): return [group]
    try:
        from pythainlp.tokenize import word_tokenize
        toks = [t for t in word_tokenize(group, engine='newmm', keep_whitespace=False) if t]
        if ''.join(toks) == group: return toks
    except ImportError:
        pass
    return [group]


def to_words(pieces, text):
    """Typhoon's sub-word pieces → whole words with times, for subtitles.

    The pieces can split a syllable (ไอ|เด|ีย) and English comes letter by letter (M|a|r|k|s), so the pieces are
    joined and cut again: at the spaces of the full text, at pauses, and by a Thai dictionary inside each group.
    Each letter gets a time spread between its piece and the next one; a word lasts until the next word starts,
    unless a pause follows."""
    pieces = [p for p in pieces if p['w']]
    if not pieces: return []
    s = ''.join(p['w'] for p in pieces)
    ct = []   # time of each letter of s
    for i, p in enumerate(pieces):
        nxt = pieces[i + 1]['t0'] if i + 1 < len(pieces) else p['t1']
        span = min(max(nxt - p['t0'], 0.0), PAUSE / 2) or max(p['t1'] - p['t0'], 0.05)
        ct += [p['t0'] + span * k / len(p['w']) for k in range(len(p['w']))]
    spaced = text.split()
    cuts = set()   # letter positions where a new word must start
    if ''.join(spaced) == s:
        k = 0
        for g in spaced: cuts.add(k); k += len(g)
    else:
        k = 0
        for p in pieces:   # no usable text: piece edges are the only hint, kept where a piece can start a word
            if k and p['w'][0] not in DEP and s[k - 1] not in LEAD: cuts.add(k)
            k += len(p['w'])
    cuts |= {i for i in range(1, len(s)) if ct[i] - ct[i - 1] >= PAUSE}
    cuts.add(len(s))
    spans, a = [], 0
    for b in sorted(cuts - {0}):
        for tok in split_thai(s[a:b]):
            spans.append((a, a + len(tok))); a += len(tok)
    words = []
    for a, b in spans:
        w = s[a:b]
        if words and not any(ch.isalnum() for ch in w):   # punctuation alone joins the word before it
            words[-1]['w'] += w; words[-1]['_end'] = ct[b - 1]; continue
        words.append({'w': w, 't0': round(ct[a], 2), '_end': ct[b - 1]})
    for i, w in enumerate(words):
        end = w.pop('_end')
        nxt = words[i + 1]['t0'] if i + 1 < len(words) else None
        w['t1'] = round(nxt if nxt is not None and nxt - end < PAUSE / 2 else end + 0.25, 2)
    return words


def audio16k(path):
    """Mono 16 kHz float32 samples via ffmpeg, level normalised the way the typhoon-asr package does it."""
    import numpy as np
    raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', path, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    y = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    return y / (np.abs(y).max() + 1e-8) if len(y) else y


def clean(s):
    """NFC, and ํ + า written apart joined into ำ (Typhoon writes SARA AM in two pieces)."""
    return unicodedata.normalize('NFC', s or '').replace('ํา', 'ำ').strip()


def load(threads=2):
    global _model
    if _model is None:
        import torch
        torch.set_num_threads(threads)
        import nemo.collections.asr as nemo_asr
        _model = nemo_asr.models.ASRModel.from_pretrained(MODEL, map_location='cpu'); _model.eval()
    return _model


def transcribe(path, threads=2):
    import soundfile as sf
    t = time.time()
    y = audio16k(path)
    if len(y) < 1600: return {'words': [], 'text': '', 'model': MODEL, 'audio_s': len(y) / 16000, 'seconds': 0.0}
    model = load(threads)
    with tempfile.NamedTemporaryFile(suffix='.wav') as f:
        sf.write(f.name, y, 16000)
        try: out = model.transcribe(audio=[f.name], return_hypotheses=True, timestamps=True, verbose=False)
        except TypeError: out = model.transcribe(audio=[f.name], return_hypotheses=True)
    if isinstance(out, tuple): out = out[0]
    hyp = out[0]
    ts = getattr(hyp, 'timestamp', None) or {}
    toks = ts.get('char') or ts.get('word') or []   # 'char' = each sub-word piece with the moment it was heard
    pieces = []
    for w in toks:
        text = ''.join(w['char']) if isinstance(w.get('char'), list) else (w.get('char') or w.get('word'))
        text = clean(text)
        if text: pieces.append({'w': text, 't0': round(float(w.get('start', 0)), 2), 't1': round(float(w.get('end', 0)), 2)})
    text = clean(hyp.text if hasattr(hyp, 'text') else str(hyp))
    return {'words': to_words(pieces, text), 'pieces': pieces, 'text': text, 'model': MODEL,
            'audio_s': round(len(y) / 16000, 2), 'seconds': round(time.time() - t, 1)}


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 2: sys.exit(__doc__)
    res = transcribe(a[0], int(a[a.index('--threads') + 1]) if '--threads' in a else 2)
    with open(a[1], 'w') as f: json.dump(res, f, ensure_ascii=False, indent=1)
    print(f"{len(res['words'])} words in {res['seconds']} s → {a[1]}\n{res['text']}")
```
