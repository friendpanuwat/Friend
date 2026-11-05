#!/usr/bin/env python3
"""Caption step (DECISIONS 2, step 3): group the transcript into subtitle lines, short chunks and phrases.

usage: captions.py <words.json> <captions.json> [--answer answer.json] [--rules] [--dry]
  words.json   {"words": [{"w", "t0", "t1"}]} from the transcription step (asr.py), or an input.json that holds them
  --answer     use this answer instead of calling the API (tests, replays)
  --rules      skip the AI and group by rule (what happens anyway when there is no key or no usable answer)
  --dry        print the request that would be sent and stop
writes captions.json: {"captions": [{"t0", "t1", "text"}], "words": [phrases with times], "source": "ai" | "ai+rules" | "rules",
                       "log": [...], "calls": [...]}

Three levels, as the engine shows them (motion.js subtitle()):
  phrase  words written together with no space, as Thai captions are written (ทำไมคลิป · ของคุณ). The engine prints a
          space between phrases, and the last phrase of a chunk is the big word, so a phrase must not be a lone particle.
  chunk   what is on screen at one time, split by "/": about 12 letters (Friend 2026-11-04, DECISIONS 3)
  line    one caption row of the plan, from a pause or sentence to the next
The phrases become the words of input.json (each with the time of its first and last word), so caption text and
word times always match (prompt.token_times).
Claude Haiku 5.5 only chooses where phrases, chunks and lines end, by word number. It never writes the words, so it
cannot change, drop or reorder anything the speaker said: the customer corrects wording in step 4 of the web app.
English words and numbers are always phrases of their own (the code splits them off if the AI does not).
If the API is down, refuses, or answers something that does not fit the words, the rule grouping is used, so the
clip always goes on. No server-side fallback here: Claude Haiku 5.5 has none for refusals.
When the answer stops before the last word (2 of 4 real clips, 2026-11-05) the AI is asked again for the words still
left, up to MAX_ASKS times; whatever is still left after that is grouped by rule (source "ai+rules").
"""
import json, os, re, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from validate import RULES, graphemes

MODEL = 'claude-haiku-5-5'
EFFORT = 'low'        # a short, rule-bound task; thinking off (allowed on Haiku 5.5 at effort high or below)
MAX_ASKS = 4          # asks per clip when the AI stops early (each one carries on from where the last stopped)
PAUSE = 0.35          # a gap this long between words ends a line in the rule grouping, and is shown to the AI
LINE_MAX_S = 3.6      # rule grouping: start a new line after about this long
LINE_CHUNKS = 4
BIG_MIN = 3           # rule grouping: the big phrase has at least this many letters
UNITS = ('%', 'บาท', 'คน', 'วัน', 'ปี', 'เดือน', 'ชิ้น', 'ก้าว', 'กิโล', 'กิโลกรัม', 'กรัม', 'นาที', 'ชั่วโมง', 'วินาที',
         'เท่า', 'ครั้ง', 'รายการ', 'ข้อ', 'ล้าน', 'แสน', 'หมื่น', 'พัน', 'ร้อย', 'สัปดาห์', 'อาทิตย์', 'แก้ว', 'ขั้น', 'ออเดอร์', 'วิว')
PARTICLES = {'ครับ', 'ค่ะ', 'คะ', 'นะ', 'อะ', 'อ่ะ', 'เนี่ย', 'เลย', 'ด้วย', 'ไหม', 'มั้ย', 'ป่ะ', 'จ้า', 'หรอ', 'ว่า', 'กัน', 'แล้ว', 'ๆ'}
DIGIT = re.compile(r'[0-9๐-๙]')

SYSTEM = f"""You turn a Thai talking-head transcript into on-screen subtitles for a vertical video (TikTok, Reels).
The transcript comes as numbered words, each with its start time and its letter count. You never write, change, add,
drop or reorder words. You only choose where phrases, chunks and lines end, by word number.

Rules
- Phrase: words written together with no space between them, the way Thai captions are written (ทำไมคลิป, ของคุณ). Usually 1 to 3 words, about 3 to 8 letters. A particle such as ครับ ค่ะ นะ อ่ะ เนี่ย เลย joins the word before it. An English word or a number is a phrase on its own.
- Chunk: what shows on screen at one time, 1 to 3 phrases, about {RULES['chunkMax']} letters and never more than {RULES['chunkHard']} (the letter counts are given; add them up). The last phrase of a chunk is shown big under the others, so make it the phrase that carries the meaning (a noun, a number with its unit, a key verb or adjective), never a particle alone.
- A number stays in the same chunk as its unit, and the unit comes right after it (3 เท่า, 30%, 1,000 บาท).
- Line: one phrase or short sentence, usually 2 to 4 chunks over about 1.5 to 4 seconds. End a line at a pause, at the end of a sentence, or before a new idea. A long sentence becomes several lines.
- Within a line, give each chunk at least {RULES['chunkMin']} seconds on average.

Answer with JSON only: {{"lines": [{{"chunks": [{{"phrase_ends": [...]}}]}}]}}. phrase_ends lists the number of the last word of each phrase in that chunk, in order; the last one ends the chunk. The first line starts at word 0, everything continues in order with no gap, and the last phrase of the last line ends at the last word."""


def schema():
    chunk = {'type': 'object', 'additionalProperties': False, 'required': ['phrase_ends'],
             'properties': {'phrase_ends': {'type': 'array', 'items': {'type': 'integer'}}}}
    line = {'type': 'object', 'additionalProperties': False, 'required': ['chunks'],
            'properties': {'chunks': {'type': 'array', 'items': chunk}}}
    return {'type': 'object', 'additionalProperties': False, 'required': ['lines'],
            'properties': {'lines': {'type': 'array', 'items': line}}}


def token(w):
    """A word as it appears in a caption: no spaces or slashes inside (prompt.token_times matches by token)."""
    return unicodedata.normalize('NFC', w['w']).replace(' ', '').replace('/', '')


def thai(s): return any('฀' <= c <= '๿' for c in s)


def user_text(words, duration=None):
    rows = [f'{len(words)} words' + (f', clip {duration:.1f} s' if duration else '') + '. number | start s | word | letters']
    prev = None
    for i, w in enumerate(words):
        if prev is not None and w['t0'] - prev['t1'] >= PAUSE: rows.append(f'  (pause {w["t0"] - prev["t1"]:.2f} s)')
        rows.append(f'{i} | {w["t0"]:.2f} | {token(w)} | {graphemes(token(w))}')
        prev = w
    return '\n'.join(rows)


def request(words, duration=None):
    """kwargs for client.beta.messages.create (the same call path as plan_d.ask)."""
    return {'model': MODEL, 'max_tokens': 8000, 'thinking': {'type': 'disabled'},
            'output_config': {'effort': EFFORT, 'format': {'type': 'json_schema', 'schema': schema()}},
            'system': SYSTEM, 'messages': [{'role': 'user', 'content': user_text(words, duration)}]}


def answer_form(lines):
    """[[[phrase ends] per chunk] per line] → the AI's answer format (for the stand-in API and tests)."""
    return {'lines': [{'chunks': [{'phrase_ends': ch} for ch in line]} for line in lines]}


def build(words, lines, duration=None):
    """lines = [[[last word of each phrase] per chunk] per line] → (caption rows, phrase words).
    A phrase is cut again wherever Thai meets English or a number, so those always stand apart."""
    caps, phrases, start = [], [], 0
    for line in lines:
        texts, first = [], len(phrases)
        for chunk in line:
            parts = []
            for e in chunk:
                group, a = [], start
                for k in range(start, e + 1):
                    if group and (not thai(token(words[k])) or not thai(token(words[k - 1]))):
                        parts.append(group); group = []
                    group.append(k)
                parts.append(group); start = e + 1
            for g in parts:
                phrases.append({'w': ''.join(token(words[k]) for k in g), 't0': words[g[0]]['t0'], 't1': words[g[-1]]['t1']})
            texts.append(' '.join(p['w'] for p in phrases[len(phrases) - len(parts):]))
        caps.append({'first': first, 'last': len(phrases) - 1, 'text': ' / '.join(texts)})
    out = []
    for i, c in enumerate(caps):
        t0 = phrases[c['first']]['t0']
        t1 = phrases[caps[i + 1]['first']]['t0'] if i + 1 < len(caps) else phrases[c['last']]['t1'] + 0.3
        if duration: t1 = min(t1, duration)
        out.append({'t0': round(t0, 3), 't1': round(max(t1, t0 + 0.1), 3), 'text': c['text']})
    return out, phrases


def check(words, answer, partial=False):
    """The AI's answer → nested phrase ends, or (None, why) when it does not fit the words.
    partial: the answer may stop before the last word (run() then asks for the rest)."""
    try: lines = [[list(c['phrase_ends']) for c in l['chunks']] for l in answer['lines']]
    except (KeyError, TypeError): return None, 'answer has no lines, chunks and phrase_ends'
    if not lines or any(not l or any(not c for c in l) for l in lines): return None, 'empty line or chunk'
    flat = [e for l in lines for c in l for e in c]
    if any(not isinstance(e, int) for e in flat): return None, 'word numbers must be integers'
    if flat != sorted(set(flat)) or flat[0] < 0: return None, 'word numbers must go up'
    if flat[-1] >= len(words): return None, f'word {flat[-1]} does not exist'
    if not partial and flat[-1] != len(words) - 1: return None, f'the last phrase ends at word {flat[-1]}, not {len(words) - 1}'
    return lines, None


def is_number(w): return bool(DIGIT.search(token(w)))
def is_unit(w): return token(w) in UNITS or token(w).startswith(UNITS)


def chunk_phrases(words, ids):
    """Rule grouping inside one chunk: the closing Thai words form the big phrase (at least BIG_MIN letters, a particle
    never alone), the Thai words before it one small phrase, and English words and numbers stand apart (build())."""
    ends, k = [], len(ids)
    big = [ids[-1]]
    while k > 1 and thai(token(words[big[0]])) and thai(token(words[ids[k - 2]])) and \
            (graphemes(''.join(token(words[i]) for i in big)) < BIG_MIN or token(words[big[0]]) in PARTICLES):
        k -= 1; big.insert(0, ids[k - 1])
    lead = ids[:len(ids) - len(big)]
    if lead: ends.append(lead[-1])
    ends.append(big[-1])
    return ends


def by_rule(words):
    """Grouping without the AI: a new line at a pause, after about LINE_MAX_S or LINE_CHUNKS chunks; a new chunk when
    the next word would pass chunkMax letters, except that a unit stays with its number. Words are never split."""
    lines, line, chunk, n, t_line = [], [], [], 0, None
    for i, w in enumerate(words):
        gap = w['t0'] - words[i - 1]['t1'] if i else 0
        keep = i and is_unit(w) and is_number(words[i - 1])
        new_line = chunk and not keep and (gap >= PAUSE or w['t0'] - t_line >= LINE_MAX_S
                                           or (len(line) + 1 >= LINE_CHUNKS and n + graphemes(token(w)) > RULES['chunkMax']))
        if new_line:
            lines.append(line + [chunk_phrases(words, chunk)]); line, chunk, n = [], [], 0
        elif chunk and not keep and n + graphemes(token(w)) > RULES['chunkMax']:
            line.append(chunk_phrases(words, chunk)); chunk, n = [], 0
        if not line and not chunk: t_line = w['t0']
        chunk.append(i); n += graphemes(token(w))
    if chunk: lines.append(line + [chunk_phrases(words, chunk)])
    return lines


def run(words, duration=None, client=None, answer=None, use_ai=True):
    """→ (captions, info) where info = {"words" (the phrases), "source", "log", "calls"}. client: an anthropic.Anthropic()
    (or a stand-in with the same beta.messages.create); made here when needed and ANTHROPIC_API_KEY is set; False = never
    call the API."""
    import plan_d
    log, calls, lines, source = [], [], None, None
    if not words: return [], {'words': [], 'source': 'rules', 'log': ['no words: nothing was said'], 'calls': []}
    if client is False: client, use_ai = None, False
    if use_ai and answer is None:
        if client is None and os.environ.get('ANTHROPIC_API_KEY'):
            import anthropic
            client = anthropic.Anthropic()
        if client is None: log.append('no API key: grouped by rule')
        else:
            lines, start = [], 0
            for ask_no in range(MAX_ASKS):
                # the words not grouped yet, numbered from 0 again (same system block, so the cache still holds)
                rest = words[start:]
                answer, resp, why = plan_d.ask(client, request(rest, duration))
                if resp is not None: calls.append(plan_d.call_record(resp, MODEL, 'group'))
                if why: log.append(f'caption request failed: {why}'); break
                got, why = check(rest, answer, partial=True)
                if why: log.append(f'AI answer not used ({why})'); break
                lines += [[[e + start for e in c] for c in l] for l in got]
                end = start + got[-1][-1][-1]
                if end == len(words) - 1: break
                start = end + 1   # the answer stopped early (2 of 4 real clips, 2026-11-05): ask for the rest
                log.append(f'AI answer stopped at word {end} of {len(words) - 1}: asked for the rest')
            if lines and lines[-1][-1][-1] != len(words) - 1:   # still short: the rule groups only what is left
                start = lines[-1][-1][-1] + 1
                lines += [[[e + start for e in c] for c in l] for l in by_rule(words[start:])]
                log.append(f'words {start}–{len(words) - 1} grouped by rule')
                source = 'ai+rules'
            if not lines: lines = None; log.append('grouped by rule')
            answer = None
    if answer is not None:
        lines, why = check(words, answer)
        if why: log.append(f'AI answer not used ({why}): grouped by rule')
    source = source or ('ai' if lines else 'rules')
    caps, phrases = build(words, lines or by_rule(words), duration)
    return caps, {'words': phrases, 'source': source, 'log': log, 'calls': calls}


if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) < 2: sys.exit(__doc__)
    src = json.load(open(a[0]))
    words = src['words'] if isinstance(src, dict) else src
    dur = src.get('clip', {}).get('duration') if isinstance(src, dict) else None
    if '--dry' in a: print(json.dumps(request(words, dur), ensure_ascii=False, indent=1)); sys.exit(0)
    ans = json.load(open(a[a.index('--answer') + 1])) if '--answer' in a else None
    caps, info = run(words, dur, answer=ans, use_ai='--rules' not in a)
    with open(a[1], 'w') as f: json.dump(dict(captions=caps, **info), f, ensure_ascii=False, indent=1)
    for line in info['log']: print(line)
    for c in caps: print(f"{c['t0']:6.2f}–{c['t1']:6.2f}  {c['text']}")
    print(f"{len(caps)} lines, {len(info['words'])} phrases ({info['source']}) → {a[1]}")
