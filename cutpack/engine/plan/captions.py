#!/usr/bin/env python3
"""Caption step (DECISIONS 2, step 3): group the transcript into subtitle lines and short chunks.

usage: captions.py <words.json> <captions.json> [--answer answer.json] [--rules] [--dry]
  words.json   [{"w", "t0", "t1"}] from the transcription step (asr.py), or an input.json that holds "words"
  --answer     use this answer instead of calling the API (tests, replays)
  --rules      skip the AI and group by rule (what happens anyway when there is no key or no usable answer)
  --dry        print the request that would be sent and stop
writes captions.json: {"captions": [{"t0", "t1", "text"}], "source": "ai" | "rules", "log": [...], "calls": [...]}

Claude Haiku 5.5 only chooses where each chunk and each line ends, by word number. It never writes the words, so
it cannot change, drop or reorder anything the speaker said: the customer corrects wording in step 4 of the web app.
The rules (Friend 2026-11-04, DECISIONS 3): chunks of about 12 letters split by "/", the last word of a chunk is the
big word, a number keeps its unit, Thai words are never cut (each transcript word is kept whole). The checker's
limits are the same numbers (validate.RULES: chunkMax 12, chunkHard 16, chunkMin 0.35 s).
If the API is down, refuses, or answers something that does not fit the words, the rule grouping is used, so the
clip always goes on. No server-side fallback here: Claude Haiku 5.5 has none for refusals.
"""
import json, os, re, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from validate import RULES, graphemes

MODEL = 'claude-haiku-5-5'
EFFORT = 'low'        # a short, rule-bound task; thinking off (allowed on Haiku 5.5 at effort high or below)
PAUSE = 0.35          # a gap this long between words ends a line in the rule grouping, and is shown to the AI
LINE_MAX_S = 3.6      # rule grouping: start a new line after about this long
LINE_CHUNKS = 4
UNITS = ('%', 'บาท', 'คน', 'วัน', 'ปี', 'เดือน', 'ชิ้น', 'ก้าว', 'กิโล', 'กิโลกรัม', 'กรัม', 'นาที', 'ชั่วโมง', 'วินาที',
         'เท่า', 'ครั้ง', 'รายการ', 'ข้อ', 'ล้าน', 'แสน', 'หมื่น', 'พัน', 'ร้อย', 'สัปดาห์', 'อาทิตย์', 'แก้ว', 'ขั้น', 'ออเดอร์', 'วิว')
DIGIT = re.compile(r'[0-9๐-๙]')

SYSTEM = f"""You split a Thai talking-head transcript into on-screen subtitles for a vertical video (TikTok, Reels).
The transcript comes as numbered words, each with its start time and its letter count. You never write, change, add,
drop or reorder words. You only choose where chunks and lines end, by word number.

Rules
- A chunk is what shows on screen at one time: about {RULES['chunkMax']} letters, never more than {RULES['chunkHard']} (the letter counts are given; add them up). A chunk may be one word.
- The last word of each chunk is shown big. End a chunk on the word that carries the meaning (a noun, a number with its unit, a key verb or adjective). Avoid ending a chunk on a particle such as ครับ ค่ะ นะ อ่ะ เนี่ย when another break works.
- A number stays in the same chunk as its unit, and the unit comes right after it (3 เท่า, 30%, 1,000 บาท).
- A line is one phrase or short sentence: usually 2 to 4 chunks over about 1.5 to 4 seconds. End a line at a pause, at the end of a sentence, or before a new idea. A long sentence becomes several lines.
- Within a line, give each chunk at least {RULES['chunkMin']} seconds on average.

Answer with JSON only: {{"lines": [{{"chunk_ends": [...]}}]}}. chunk_ends lists the number of the last word of each chunk in that line, in order. The first line starts at word 0, each line starts right after the previous line ends, and the last chunk of the last line ends at the last word."""


def schema():
    return {'type': 'object', 'additionalProperties': False, 'required': ['lines'],
            'properties': {'lines': {'type': 'array', 'items': {
                'type': 'object', 'additionalProperties': False, 'required': ['chunk_ends'],
                'properties': {'chunk_ends': {'type': 'array', 'items': {'type': 'integer'}}}}}}}


def token(w):
    """A word as it appears in a caption: no spaces inside (prompt.token_times matches caption tokens to words)."""
    return unicodedata.normalize('NFC', w['w']).replace(' ', '').replace('/', '')


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
    return {'model': MODEL, 'max_tokens': 4000, 'thinking': {'type': 'disabled'},
            'output_config': {'effort': EFFORT, 'format': {'type': 'json_schema', 'schema': schema()}},
            'system': SYSTEM, 'messages': [{'role': 'user', 'content': user_text(words, duration)}]}


def build(words, lines, duration=None):
    """lines = [[last word index of each chunk], ...] → caption rows. Each line runs from its first word to the next
    line's first word (or its own last word plus a short tail at the end of the clip)."""
    caps, start = [], 0
    for ends in lines:
        chunks, a = [], start
        for e in ends:
            chunks.append(' '.join(token(w) for w in words[a:e + 1])); a = e + 1
        caps.append({'first': start, 'last': ends[-1], 'text': ' / '.join(chunks)}); start = ends[-1] + 1
    out = []
    for i, c in enumerate(caps):
        t0 = words[c['first']]['t0']
        if i + 1 < len(caps): t1 = words[caps[i + 1]['first']]['t0']
        else: t1 = words[c['last']]['t1'] + 0.3
        if duration: t1 = min(t1, duration)
        out.append({'t0': round(t0, 3), 't1': round(max(t1, t0 + 0.1), 3), 'text': c['text']})
    return out


def check(words, answer):
    """The AI's answer → [[chunk ends] per line], or (None, why) when it does not fit the words."""
    try: lines = [list(l['chunk_ends']) for l in answer['lines']]
    except (KeyError, TypeError): return None, 'answer has no lines'
    flat = [e for l in lines for e in l]
    if not lines or any(not l for l in lines): return None, 'empty line'
    if any(not isinstance(e, int) for e in flat): return None, 'word numbers must be integers'
    if flat != sorted(set(flat)) or flat[0] < 0: return None, 'word numbers must go up'
    if flat[-1] != len(words) - 1: return None, f'the last chunk ends at word {flat[-1]}, not {len(words) - 1}'
    return lines, None


def is_number(w): return bool(DIGIT.search(token(w)))
def is_unit(w): return token(w) in UNITS or token(w).startswith(UNITS)


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
            lines.append(line + [chunk[-1]]); line, chunk, n = [], [], 0
        elif chunk and not keep and n + graphemes(token(w)) > RULES['chunkMax']:
            line.append(chunk[-1]); chunk, n = [], 0
        if not line and not chunk: t_line = w['t0']
        chunk.append(i); n += graphemes(token(w))
    if chunk: lines.append(line + [chunk[-1]])
    return lines


def run(words, duration=None, client=None, answer=None, use_ai=True):
    """→ (captions, info) where info = {"source", "log", "calls"}. client: an anthropic.Anthropic() (or a stand-in with
    the same beta.messages.create); created here when needed and ANTHROPIC_API_KEY is set."""
    import plan_d
    log, calls, lines = [], [], None
    if not words: return [], {'source': 'rules', 'log': ['no words: nothing was said'], 'calls': []}
    if client is False: client, use_ai = None, False   # the caller forbids API calls (replays)
    if use_ai and answer is None:
        if client is None and os.environ.get('ANTHROPIC_API_KEY'):
            import anthropic
            client = anthropic.Anthropic()
        if client is None: log.append('no API key: grouped by rule')
        else:
            req = request(words, duration)
            answer, resp, why = plan_d.ask(client, req)
            if resp is not None: calls.append(plan_d.call_record(resp, MODEL, 'group'))
            if why: log.append(f'caption request failed: {why}')
    if answer is not None:
        lines, why = check(words, answer)
        if why: log.append(f'AI answer not used ({why}): grouped by rule')
    source = 'ai' if lines else 'rules'
    caps = build(words, lines or by_rule(words), duration)
    return caps, {'source': source, 'log': log, 'calls': calls}


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
    print(f"{len(caps)} lines ({info['source']}) → {a[1]}")
