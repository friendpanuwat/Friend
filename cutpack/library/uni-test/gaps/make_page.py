#!/usr/bin/env python3
"""Round 17 page (page 19): build ../page19.html from stats.json (run count.py first), so the page and the counts come from one file.
usage: python3 make_page.py"""
import json, os, html

HERE = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(HERE, 'stats.json'), encoding='utf-8'))
E = html.escape
pct = lambda a, b: round(100 * a / b)
gap_n = S['forced'] + S['none']
top = max(g['n'] for g in S['gaps'])
# Claude's suggestion per gap group: a new category, a new draft in an existing one, or wait for more scripts
PLAN = {'list': 'new', 'event': 'new', 'feel': 'new', 'relation': 'new', 'place': 'new',
        'social': 'draft:B11', 'topic': 'later', 'analogy': 'hard', 'level': 'wait', 'equal': 'draft:B03',
        'dream': 'draft:B08', 'opinion': 'wait', 'match': 'wait', 'other': 'wait'}

def plan_chip(g):
    p = PLAN[g['id']]
    if p == 'new': return '<span class="chip new">หมวดใหม่</span>'
    if p.startswith('draft:'):
        c = p.split(':')[1]; return f'<span class="chip draft">ร่างใหม่ใน {c} {E(S["cat_names"][c])}</span>'
    if p == 'later': return '<span class="chip new">หมวดใหม่ รอบถัดไป</span>'
    if p == 'hard': return '<span class="chip wait">ทำเป็นเลโก้ยาก ภาพต่างกันทุกประโยค</span>'
    return '<span class="chip wait">รอดูบทเพิ่ม</span>'

bars = []
for g in S['gaps']:
    bars.append(f'''<a class="bar" href="#{g['id']}"><span class="bname">{E(g['name'])}</span>
<span class="track"><span class="fill" style="width:{100 * g['n'] / top:.0f}%"></span></span>
<span class="bval">{g['n']}</span><span class="nv">{g['clips']} คลิป</span></a>''')

groups = []
for g in S['gaps']:
    lines = ''.join(
        f'''<li><q>{E(x['text'])}</q><span class="meta">{E(S['per_clip'][x['clip']]['name'])}'''
        + (f' · <span class="tag forced">ฝืนเข้า {x['cat']} {E(S['cat_names'][x['cat']])}</span>' if x['r'] == 'forced'
           else ' · <span class="tag none">ไม่มีหมวด</span>') + '</span></li>' for x in g['lines'])
    groups.append(f'''<section class="group" id="{g['id']}">
<div class="ghead"><h3>{E(g['name'])}</h3><span class="count">{g['n']} ช่วง · {g['clips']} คลิป</span></div>
<p><b>ประโยคทำอะไร:</b> {E(g['does'])}</p>
<p class="why"><b>ทำไมหมวดเดิมไม่พอ:</b> {E(g['why'])}</p>
<div>{plan_chip(g)}</div>
<details><summary>ดูทุกช่วง ({g['n']})</summary><ul class="lines">{lines}</ul></details>
</section>''')

catmax = max(S['cat_ok'].values())
cats = ''.join(f'''<div class="cbar"><span class="bname">{c} {E(S['cat_names'][c])}</span>
<span class="track"><span class="fill soft" style="width:{100 * v / catmax:.0f}%"></span></span><span class="bval">{v}</span></div>'''
               for c, v in S['cat_ok'].items())

page = f'''<title>หมวดที่ยังขาด</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anuphan:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&display=swap">
<style>
/* layout: one reading column like pages 16-18; a bar list of missing groups first, then each group with every line it holds */
:root{{
  --bg:#F3F4F6; --card:#FFFFFF; --fg:#16181D; --muted:#5E6470; --line:#DEE1E7; --accent:#1F6F6A; --accent-soft:#DCEEEC; --warm:#8A5A12; --warm-soft:#F6ECDB;
  --off:#B4441C; --off-soft:#FBE7DE; --track:#E6E8EC;
  --display:"Anuphan","IBM Plex Sans Thai",system-ui,sans-serif; --body:"IBM Plex Sans Thai","Anuphan",system-ui,sans-serif;
}}
@media (prefers-color-scheme: dark){{:root:not([data-theme="light"]){{
  --bg:#0F1114; --card:#171A1F; --fg:#ECEEF2; --muted:#9BA2AE; --line:#262A31; --accent:#62C7BE; --accent-soft:#16302E; --warm:#E3B66A; --warm-soft:#2E2414;
  --off:#F08A62; --off-soft:#3A2016; --track:#23272E; color-scheme:dark}}}}
:root[data-theme="dark"]{{--bg:#0F1114; --card:#171A1F; --fg:#ECEEF2; --muted:#9BA2AE; --line:#262A31; --accent:#62C7BE; --accent-soft:#16302E; --warm:#E3B66A; --warm-soft:#2E2414;
  --off:#F08A62; --off-soft:#3A2016; --track:#23272E; color-scheme:dark}}
*{{box-sizing:border-box}}
body{{background:var(--bg);color:var(--fg);font-family:var(--body);font-size:16px;line-height:1.6;
  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 56px}}
.wrap{{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:32px}}
h1,h2,h3{{font-family:var(--display);text-wrap:balance;margin:0;line-height:1.3}}
h1{{font-size:clamp(26px,6vw,34px);font-weight:700}} h2{{font-size:22px;font-weight:700}} h3{{font-size:18px;font-weight:600}}
p{{margin:0}} b{{font-weight:600}}
.lede{{display:flex;flex-direction:column;gap:12px}} .lede p{{color:var(--muted);max-width:62ch}}
.facts{{display:flex;flex-wrap:wrap;gap:8px}}
.fact{{font-size:14px;background:var(--accent-soft);color:var(--accent);border-radius:999px;padding:4px 12px;font-weight:500}}
.fact.off{{background:var(--off-soft);color:var(--off)}}
.box{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:12px}}
.box ol{{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px}}
section{{display:flex;flex-direction:column;gap:12px}}
.chart{{display:flex;flex-direction:column;gap:4px}}
.bar,.cbar{{display:grid;grid-template-columns:11em minmax(0,1fr) 2em 4em;align-items:center;gap:8px;font-size:14px;border-radius:8px;padding:3px 4px;color:inherit;text-decoration:none}}
.cbar{{grid-template-columns:11em minmax(0,1fr) 2em}}
.bar:hover,.bar:focus-visible{{background:var(--accent-soft);outline:none}}
.bname{{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.track{{height:12px;background:var(--track);border-radius:4px;overflow:hidden}}
.fill{{display:block;height:100%;background:var(--off);border-radius:0 4px 4px 0}} .fill.soft{{background:var(--accent)}}
.bval{{font-variant-numeric:tabular-nums;font-weight:600;text-align:right}}
.nv{{color:var(--muted);font-size:13px;font-variant-numeric:tabular-nums}}
.note{{font-size:13px;color:var(--muted)}}
.group{{border-top:1px solid var(--line);padding-top:20px;gap:8px;scroll-margin-top:16px}}
.ghead{{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:4px 12px}}
.count{{font-size:14px;color:var(--muted);font-variant-numeric:tabular-nums}}
.why{{color:var(--muted)}}
.chip{{display:inline-block;font-size:13px;font-weight:600;border-radius:999px;padding:2px 10px}}
.chip.new{{background:var(--accent-soft);color:var(--accent)}} .chip.draft{{background:var(--warm-soft);color:var(--warm)}}
.chip.wait{{background:var(--track);color:var(--muted)}}
details summary{{cursor:pointer;color:var(--accent);font-weight:500;font-size:15px;width:fit-content}}
details summary:focus-visible{{outline:2px solid var(--accent);outline-offset:2px;border-radius:4px}}
.lines{{margin:8px 0 0;padding-left:18px;display:flex;flex-direction:column;gap:10px}}
.lines li{{display:flex;flex-direction:column;gap:2px;min-width:0}}
.lines q{{quotes:"“" "”"}}
.meta{{font-size:13px;color:var(--muted)}}
.tag{{font-weight:600}} .tag.none{{color:var(--off)}} .tag.forced{{color:var(--warm)}}
@media (max-width:420px){{.bar{{grid-template-columns:8.6em minmax(0,1fr) 1.6em 3.6em;gap:6px}} .cbar{{grid-template-columns:8.6em minmax(0,1fr) 1.6em;gap:6px}}}}
</style>
<div class="wrap">
  <header class="lede">
    <h1>หมวดที่ยังขาด</h1>
    <p>ผมอ่านบทพูดคลิปของคนอื่นที่ Friend ส่งมาเองทั้งหมด แบ่งเป็นช่วงที่มีเนื้อหาพอจะมีภาพ แล้วดูทีละช่วงว่าเข้าหมวดไหน เข้าแบบฝืน หรือไม่มีหมวดเลย</p>
    <div class="facts"><span class="fact">{S['clips']} คลิป</span><span class="fact">{S['lines']} ช่วง</span>
      <span class="fact">เข้าหมวดได้ {pct(S['ok'], S['lines'])}%</span><span class="fact off">ไม่มีหมวดที่ตรง {pct(gap_n, S['lines'])}%</span></div>
    <p class="note">ไม่มีหมวดที่ตรง = ฝืน {S['forced']} ช่วง (ภาพจะผิดความหมาย) กับไม่มีหมวดเลย {S['none']} ช่วง · ผมจัดเองคนเดียว ช่วงที่ก้ำกึ่งอาจตัดสินต่างจาก Friend ได้</p>
  </header>

  <section>
    <h2>ช่วงที่ไม่มีหมวด แบ่งเป็นกลุ่ม</h2>
    <p class="note">ตัวเลขคือจำนวนช่วง ข้างหลังคือเจอในกี่คลิป กลุ่มที่เจอในหลายคลิปใช้ได้กว้างกว่า กดชื่อกลุ่มเพื่อดูประโยค</p>
    <div class="chart">{''.join(bars)}</div>
  </section>

  <section class="box">
    <h2>ผมแนะนำ</h2>
    <ol>
      <li><b>เพิ่ม 5 หมวดใหม่ก่อน:</b> ไล่รายการ · เล่าเหตุการณ์ · ความรู้สึก · ความสัมพันธ์ของคน · สถานที่ (เจอในหลายคลิปที่สุด)</li>
      <li><b>บางกลุ่มไม่ต้องเป็นหมวดใหม่</b> ทำเป็นร่างใหม่ในหมวดเดิมได้ เช่น "ไม่ต่างกัน" เป็นร่างของเปรียบเทียบ "ความฝัน" เป็นร่างของเป้าหมาย "โพสต์ / ค้นหาในโซเชียล" เป็นร่างของแชต</li>
      <li><b>"เปิดหัวข้อ"</b> เป็นหมวดใหม่รอบถัดไป</li>
      <li><b>กลุ่มที่เจอแค่ 2 คลิป</b> รอดูบทพูดเพิ่มก่อน</li>
    </ol>
    <p class="note">ป้ายใต้แต่ละกลุ่มด้านล่างบอกว่าผมแนะนำแบบไหน Friend เป็นคนเลือก</p>
  </section>

  {''.join(groups)}

  <section class="group">
    <h2>หมวดเดิมที่ใช้ได้ตรง</h2>
    <p class="note">นับเฉพาะช่วงที่เข้าหมวดได้ไม่ฝืน ({S['ok']} ช่วง)</p>
    <div class="chart">{cats}</div>
  </section>
</div>
'''
open(os.path.join(HERE, '..', 'page19.html'), 'w', encoding='utf-8').write(page)
print('page19.html', len(page.encode()), 'bytes')
