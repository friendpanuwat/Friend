#!/usr/bin/env python3
"""ai-view.html: what the planning AI reads about the four topic packs, with a Thai translation for Friend.

usage: make_ai_view.py [out.html]      (reads engine/plan/catalog.json and the prompt code, so it always matches)
The English text comes from the part code (packs/*.js meta: when, slot notes) via catalog.json; the Thai is in
ai_view_th.json. A text with no Thai yet is shown in English only and listed on stdout.
"""
import html, json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.join(HERE, '..', '..', 'engine', 'plan')
sys.path.insert(0, PLAN)
import prompt

CAT = json.load(open(os.path.join(PLAN, 'catalog.json')))
CATS = {c['id']: c for c in json.load(open(os.path.join(PLAN, 'prompt', 'categories.json')))['categories']}
TH = json.load(open(os.path.join(HERE, 'ai_view_th.json')))
FIXED = {'lead': 'บรรทัดเล็กใต้ภาพ (คำจากบท)', 'key': 'คำใหญ่ที่ขึ้นตรงจังหวะ', 'unit': 'หน่วย', 'pre': 'เครื่องหมายหน้าตัวเลข เช่น ฿'}
TOPIC_ORDER = ['biz', 'fin', 'fit', 'edu']
missing = []
e = html.escape


def th(text, table):
    if text in TH[table]: return TH[table][text]
    missing.append(text); return ''


def topic_th(tid):
    if tid not in TH['topics']: missing.append(tid)
    return TH['topics'].get(tid, '')


def when_th(pid):
    if pid not in TH['when']: missing.append(pid)
    return TH['when'].get(pid, '')


def kind_th(spec):
    t = spec['type']
    if t == 'text': s = 'ข้อความ' + (f" ≤ {spec['max']} ตัว" if spec.get('max') else '')
    elif t == 'number': s = 'ลำดับในรายการ' if spec.get('index') else 'ตัวเลข'
    elif t == 'icon': s = 'ไอคอน'
    elif t == 'choice': s = 'เลือกหนึ่ง: ' + ' / '.join(x for x in spec['of'] if x)
    elif t == 'list':
        it = spec.get('item')
        s = 'รายการ' + (' ของตัวเลข' if it == 'number' else ' ของ ' + ', '.join(it) if isinstance(it, dict) else '')
        if spec.get('min') or spec.get('max'): s += f" {spec.get('min', 1)}–{spec.get('max', '')} ข้อ"
        if spec.get('same'): s += f" (ข้อละหนึ่งตาม {spec['same']})"
    else: s = t
    return s


def slot_rows(p):
    rows = []
    for k, spec in p['slots'].items():
        note = spec.get('note', '')
        thn = th(note, 'notes') if note else FIXED.get(k, '')
        rows.append(f"""<tr><td><code>{e(k)}</code>{'<span class="req">ต้องมี</span>' if spec.get('req') else ''}</td>
<td><span class="kind">{e(kind_th(spec))}</span><span class="th">{e(thn)}</span><span class="en">AI อ่าน: {e(prompt.slot_sig(k, spec))}</span></td></tr>""")
    return '\n'.join(rows)


cards = [p for p in CAT['cards'] if p.get('pack')]
topics_html = []
for tid in TOPIC_ORDER:
    pk = CAT['packs'][tid]
    topics_html.append(f"""<article class="topic"><p class="tid"><code>{tid}</code></p><h3>{e(pk['name'])}</h3>
<p class="th">{e(topic_th(tid))}</p><p class="en">AI อ่าน: {e(pk['when'])}</p></article>""")

props_html, heroes_html = [], []
for tid in TOPIC_ORDER:
    props = sorted([p for p in cards if p['pack'] == tid and re.match(r'B\d\d\.', p['id'])], key=lambda p: p['code'])
    rows = ''.join(f"""<tr><td><b>{e(p['code'])}</b><br><span class="muted">{e(p['id'])}</span></td><td>{e(p['name'])}</td>
<td><code>{p['id'][:3]}</code> {e(CATS[p['id'][:3]]['name'])}{f'<br><span class="only">ใช้เฉพาะ: {e(p["use"])}</span>' if p.get('use') else ''}</td></tr>""" for p in props)
    props_html.append(f"""<section class="block"><h3>{e(CAT['packs'][tid]['name'])} <span class="muted">({len(props)} ชิ้น)</span></h3>
<div class="scroll"><table class="props"><thead><tr><th>รหัส</th><th>ชื่อชิ้น</th><th>AI หาเจอเมื่อประโยคเป็นแบบ</th></tr></thead><tbody>{rows}</tbody></table></div></section>""")
    heroes = sorted([p for p in cards if p['pack'] == tid and not re.match(r'B\d\d\.', p['id'])], key=lambda p: p['code'])
    hs = []
    for p in heroes:
        hs.append(f"""<article class="hero"><header><p class="code">{e(p['code'])} · <code>{e(p['id'])}</code></p><h4>{e(p['name'])}</h4></header>
<p class="for"><span class="lbl">ใช้กับประโยค</span>{e(when_th(p['id']))}</p>
<p class="en">AI อ่าน: for {e(p['when'])}</p>
<div class="scroll"><table class="slots"><tbody>{slot_rows(p)}</tbody></table></div></article>""")
    heroes_html.append(f"""<section class="block"><h3>{e(CAT['packs'][tid]['name'])} <span class="muted">({len(heroes)} ชิ้นเด่น)</span></h3><div class="heroes">{''.join(hs)}</div></section>""")

lib = prompt.library_text('editorial', CAT)
a = lib.index('## B01'); b = lib.index('## B02')
c = lib.index('## topic biz'); d = lib.index('### BIZ.h3')
excerpt = lib[a:b].rstrip() + '\n\n…\n\n' + lib[c:d].rstrip() + '\n…'
sysmd = open(os.path.join(PLAN, 'prompt', 'system.md')).read()
t0 = sysmd.index('# Topic (decide it first)'); t1 = sysmd.index('# What a good plan does')
rule = sysmd[t0:t1].strip()

page = f"""<title>คลังที่ AI อ่าน</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mitr:wght@500;600&family=IBM+Plex+Sans+Thai:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: one reading column — how the AI decides, then the 4 topics, the 24 props, the 20 heroes, and the raw text it reads. Same palette as Friend's galleries. */
:root {{
  --bg: #F3F4F0; --surface: #FFFFFF; --ink: #14213D; --muted: #5C6579; --line: #DADDE4; --accent: #DDFF45; --accent-ink: #14213D; --code-bg: #EEF0F4; --warn: #B42318;
  --display: "Mitr", "IBM Plex Sans Thai", system-ui, sans-serif; --body: "IBM Plex Sans Thai", system-ui, sans-serif; --mono: "IBM Plex Mono", ui-monospace, monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg: #0D1220; --surface: #161D2F; --ink: #E7EBF3; --muted: #9AA3B6; --line: #29324A; --accent: #DDFF45; --accent-ink: #10172A; --code-bg: #1E2740; --warn: #FF7A70; color-scheme: dark }} }}
:root[data-theme="dark"] {{
  --bg: #0D1220; --surface: #161D2F; --ink: #E7EBF3; --muted: #9AA3B6; --line: #29324A; --accent: #DDFF45; --accent-ink: #10172A; --code-bg: #1E2740; --warn: #FF7A70; color-scheme: dark }}
body {{ background: var(--bg); color: var(--ink); font-family: var(--body); font-size: 15px; line-height: 1.6;
  padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); padding-block: 24px 56px; }}
.wrap {{ max-width: 780px; margin: 0 auto; display: grid; gap: 36px; }}
h1, h2, h3, h4 {{ font-family: var(--display); font-weight: 500; margin: 0; text-wrap: balance; line-height: 1.3; }}
h1 {{ font-size: 28px; font-weight: 600; }} h2 {{ font-size: 22px; }} h3 {{ font-size: 18px; }} h4 {{ font-size: 17px; }}
p {{ margin: 0; }}
code, pre {{ font-family: var(--mono); font-size: 13px; }}
code {{ background: var(--code-bg); border-radius: 5px; padding: 0 .3em; }}
.lead {{ display: grid; gap: 10px; max-width: 62ch; color: var(--muted); }}
.lead b {{ color: var(--ink); font-weight: 600; }}
.muted {{ color: var(--muted); font-weight: 400; font-size: .9em; }}
section {{ display: grid; gap: 14px; min-width: 0; }}
.steps {{ list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; counter-reset: s; }}
.steps li {{ counter-increment: s; display: grid; grid-template-columns: 2.2em minmax(0, 1fr); gap: 10px; align-items: start;
  background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }}
.steps li::before {{ content: counter(s); font-family: var(--display); font-weight: 600; width: 1.8em; height: 1.8em; border-radius: 50%;
  background: var(--accent); color: var(--accent-ink); display: grid; place-items: center; }}
.steps li.guard {{ grid-template-columns: minmax(0, 1fr); border-style: dashed; }}
.steps li.guard::before {{ content: none; }}
.topics {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr)); gap: 12px; }}
.topic {{ background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 14px; display: grid; gap: 6px; min-width: 0; }}
.tid code {{ background: var(--accent); color: var(--accent-ink); font-weight: 500; }}
.th {{ display: block; }}
.en {{ display: block; color: var(--muted); font-family: var(--mono); font-size: 12px; line-height: 1.5; overflow-wrap: anywhere; }}
.block {{ gap: 10px; }}
.scroll {{ overflow-x: auto; }}
table {{ border-collapse: collapse; width: 100%; }}
th, td {{ text-align: left; vertical-align: top; padding: 8px 10px; border-bottom: 1px solid var(--line); }}
th {{ font-size: 12px; letter-spacing: .04em; color: var(--muted); font-weight: 600; }}
.props {{ background: var(--surface); border: 1px solid var(--line); border-radius: 10px; min-width: 520px; }}
.props td:first-child {{ white-space: nowrap; }}
.only {{ color: var(--warn); font-size: 13px; }}
.heroes {{ display: grid; gap: 12px; }}
.hero {{ background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 14px; display: grid; gap: 8px; min-width: 0; }}
.hero .code {{ font-size: 13px; color: var(--muted); font-weight: 600; letter-spacing: .03em; }}
.for {{ display: grid; gap: 2px; }}
.lbl {{ font-size: 12px; letter-spacing: .04em; color: var(--muted); font-weight: 600; }}
.slots td:first-child {{ width: 1%; white-space: nowrap; padding-left: 0; }}
.slots td:last-child {{ padding-right: 0; }}
.slots td {{ padding: 7px 8px; }}
.slots tr:last-child td {{ border-bottom: 0; }}
.kind {{ display: inline-block; font-size: 12px; color: var(--muted); margin-right: .5em; }}
.req {{ display: inline-block; margin-left: 6px; font-size: 11px; font-weight: 600; background: var(--accent); color: var(--accent-ink); border-radius: 4px; padding: 0 .35em; }}
pre {{ background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 14px; overflow-x: auto; line-height: 1.55; white-space: pre; margin: 0; }}
.note {{ background: var(--surface); border-left: 4px solid var(--accent); padding: 12px 14px; border-radius: 0 10px 10px 0; max-width: 62ch; }}
</style>

<div class="wrap">
  <header class="lead">
    <h1>คลังที่ AI อ่าน</h1>
    <p>หน้านี้คือคำอธิบายชุดเฉพาะหมวดที่ส่งให้ AI ตอนวางแผนฉาก ข้อความที่ AI อ่านจริงเป็น<b>ภาษาอังกฤษ</b> (AI ทำตามได้แม่นกว่าและเปลืองน้อยกว่า) ส่วนชื่อชิ้นและคำตัวอย่างยังเป็นภาษาไทย ทุกข้อมีคำแปลไทยกำกับ</p>
    <p>คำอธิบายทั้งหมดเขียนไว้ในโค้ดชิ้นส่วนที่เดียว หน้านี้สร้างจากโค้ดนั้น จึงตรงกับของที่ AI เห็นเสมอ</p>
  </header>

  <section>
    <h2>AI ตัดสินใจทีละขั้น</h2>
    <ol class="steps">
      <li><div><b>อ่านบททั้งคลิป แล้วเลือกหมวดของคลิป</b> เป็นธุรกิจ (<code>biz</code>) การเงิน (<code>fin</code>) ฟิตเนส (<code>fit</code>) ความรู้ (<code>edu</code>) หรือไม่เข้าหมวดไหน (<code>none</code>) โดยเทียบกับคำอธิบายหมวดด้านล่าง</div></li>
      <li><div><b>ทีละประโยค ดูว่าประโยคนั้นทำหน้าที่อะไร</b> เช่น มีตัวเลข บอกขึ้นลง เปรียบเทียบ บอกขั้นตอน เตือน แล้วไปที่หมวดชิ้นฐาน B01–B15 ที่ตรงกับหน้าที่นั้น</div></li>
      <li><div><b>เลือกแบบในหมวดนั้น</b> ในแต่ละหมวดมีชิ้นฐาน และชิ้นของชุดเฉพาะหมวดที่มีป้ายบอกหมวดของคลิป ถ้าชิ้นของหมวดเล่าประโยคได้ดีพอ ๆ กันหรือดีกว่า ให้ใช้ชิ้นของหมวด</div></li>
      <li><div><b>ถ้าประโยคเป็นเรื่องเฉพาะของหมวด ใช้ชิ้นเด่น</b> เช่น กรวยลูกค้า ดอกเบี้ยทบต้น จานแบ่งสัดส่วน AI รู้ว่าชิ้นเด่นใช้กับประโยคแบบไหนจากบรรทัด "ใช้กับประโยค" และรู้ว่าต้องเติมคำอะไรจากคำอธิบายแต่ละช่อง</div></li>
      <li class="guard"><div><b>ถ้าหยิบผิดหมวด ตัวตรวจจับได้</b> เช่น ใช้ชิ้นฟิตเนสในคลิปการเงิน ระบบส่งกลับให้ AI แก้หนึ่งครั้ง ถ้ายังผิด ฉากนั้นกลายเป็นการ์ดตัวอักษร ตัวเลขทุกตัวบนจอต้องเป็นตัวที่พูดในคลิป ยกเว้นตัวที่เป็นแค่ลำดับหรือขนาด</div></li>
    </ol>
  </section>

  <section>
    <h2>คำอธิบาย 4 หมวดของคลิป</h2>
    <p class="muted">AI ใช้ข้อความนี้เลือกหมวดในขั้นที่ 1</p>
    <div class="topics">{''.join(topics_html)}</div>
  </section>

  <section>
    <h2>ชิ้นประกอบ 24 ชิ้น</h2>
    <p class="lead">ชิ้นประกอบคือชิ้นฐานที่วาดใหม่ให้เข้ากับหมวด ใช้ช่องเดียวกับชิ้นฐาน AI จึงไม่ต้องรู้อะไรเพิ่ม มันอยู่ในหมวดชิ้นฐานเดียวกับต้นแบบ เช่น ป้ายราคาห้อยเชือกอยู่ใน B01 ตัวเลขเด่น AI จะเห็นมันเมื่อประโยคมีตัวเลขในคลิปธุรกิจ ชิ้นที่มีข้อจำกัดจะมีบรรทัด "ใช้เฉพาะ" กำกับ</p>
    {''.join(props_html)}
  </section>

  <section>
    <h2>ชิ้นเด่น 20 ชิ้น</h2>
    <p class="lead">ชิ้นเด่นเป็นหมวดใหม่ของแต่ละหมวด แต่ละชิ้นมีบรรทัด "ใช้กับประโยค" ที่บอก AI ว่าเล่าประโยคแบบไหน และตารางช่องที่ต้องเติม ป้าย <span class="req">ต้องมี</span> คือช่องที่ห้ามว่าง บรรทัดสีเทาคือข้อความที่ AI อ่านจริง</p>
    {''.join(heroes_html)}
  </section>

  <section>
    <h2>ตัวอย่างข้อความที่ส่งให้ AI จริง</h2>
    <p class="muted">ช่วงหนึ่งของคลังสไตล์ editorial: หมวด B01 ที่มีชิ้นฐานกับชิ้นของ 3 หมวดอยู่ด้วยกัน และต้นหัวข้อหมวดธุรกิจ</p>
    <pre>{e(excerpt)}</pre>
    <p class="muted">คำสั่งเรื่องหมวดที่ AI ได้รับ:</p>
    <pre>{e(rule)}</pre>
  </section>

  <p class="note">ถ้าคำอธิบายชิ้นไหนไม่ตรงกับที่คุณคิดไว้ บอกรหัสชิ้นมาได้เลย เช่น "BIZ-H2 ควรใช้กับ…" ผมแก้ในโค้ดที่เดียว แล้วหน้านี้กับข้อความที่ AI อ่านจะเปลี่ยนตาม</p>
</div>
"""
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'ai-view.html')
open(out, 'w').write(page)
print(out, len(page), 'chars;', 'no Thai yet for:' if missing else 'every text has its Thai', *missing)
