#!/usr/bin/env python3
"""Round-15 page for Friend: which categories the AI used on 6 real scripts, where variants are missing, every picture.
usage: make_page.py <page_dir>   (reads stats.json, out/*/report.json, variant_names.json; copies stills/ to <page_dir>/st/)"""
import html, json, os, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]; os.makedirs(os.path.join(OUT, 'st'), exist_ok=True)
S = json.load(open(os.path.join(HERE, 'stats.json')))
VN = json.load(open(os.path.join(HERE, 'variant_names.json')))
SHORT = {'B01': 'ตัวเลขเด่น', 'B02': 'เพิ่มขึ้น / ลดลง', 'B03': 'เปรียบเทียบ', 'B04': 'ขั้นตอน', 'B05': 'ถูกกับผิด', 'B06': 'คำถาม',
         'B07': 'คำเตือน', 'B08': 'เป้าหมาย', 'B09': 'เวลา', 'B10': 'คน', 'B11': 'คำพูด / แชต', 'B12': 'เหตุกับผล',
         'B13': 'เคล็ดลับ', 'B14': 'ประโยคเด็ด', 'B15': 'ปิดคลิป', 'B16': 'นิยาม'}
CLIPS = [('105656', 'สร้างแบรนด์', 'คลิป TikTok ที่ใช้ทดสอบ'), ('114123', 'อดอาหาร', 'คลิป TikTok ที่ใช้ทดสอบ'),
         ('115213', 'รายได้เสริม', 'คลิป TikTok ที่ใช้ทดสอบ'), ('115846', 'เรียนภาษาอังกฤษ', 'คลิป TikTok ที่ใช้ทดสอบ'),
         ('customers', 'ลูกค้าทักแล้วหาย', 'บทพูดของ Friend'), ('retire', 'เกษียณ', 'บทพูดของ Friend')]
OFF = {'115213.04': 'ประโยคนี้ไม่ใช่คำถาม', '115213.11': 'ไม่มีใครพูดหรือแชต', '115846.05': 'คำที่อธิบายผิดคำ ("ง่าย ง่าย")',
       '115846.16': 'ไม่มีใครพูดหรือแชต'}           # Claude's own read of the 72 pictures (not checked by code)
e = html.escape

table = sorted(S['table'], key=lambda t: (-t['used'], t['id']))
most = max(t['used'] for t in table)
bars = []
for t in table:
    rep = f'<span class="rep">ซ้ำ {t["repeats"]}</span>' if t['repeats'] else '<span></span>'
    tip = f'{SHORT[t["id"]]}: {t["used"]} ภาพ · เจอใน {t["clips"]} เรื่อง · มี {t["variants"]} ร่าง' + (f' · ร่างซ้ำในคลิปเดียวกัน {t["repeats"]} ครั้ง' if t['repeats'] else '')
    bars.append(f'<div class="bar" tabindex="0" data-tip="{e(tip)}"><span class="bname">{SHORT[t["id"]]}</span>'
                f'<span class="track"><span class="fill" style="width:{t["used"] / most * 100:.1f}%"></span></span>'
                f'<span class="bval">{t["used"]}</span><span class="nv">{t["variants"]} ร่าง</span>{rep}</div>')

sections = []
pics = {p['id']: p for c in S['perClip'] for p in c['pictures']}
for clip, name, src in CLIPS:
    rep = json.load(open(os.path.join(HERE, 'out', clip, 'report.json')))
    cards = []
    for r in rep:
        if not r['ok'] or r['cat'] == 'none': continue
        p = pics[r['id']]
        shutil.copy(os.path.join(HERE, 'stills', f'card_{r["id"]}.jpg'), os.path.join(OUT, 'st', f'{r["id"]}.jpg'))
        flags = (f'<span class="flag off">ผมว่าไม่ตรง: {e(OFF[r["id"]])}</span>' if r['id'] in OFF else '') + \
                ('<span class="flag rep">ร่างซ้ำในคลิปนี้</span>' if p['repeat'] else '')
        cards.append(f'<figure class="pic{" is-off" if r["id"] in OFF else ""}"><img src="st/{r["id"]}.jpg" alt="{e(SHORT[r["cat"]])}: {e(r["text"])}" loading="lazy" width="360" height="640">'
                     f'<figcaption><span class="cat">{SHORT[r["cat"]]}</span><span class="vn">{e(VN[r["cat"]][p["pick"]])}</span>'
                     f'<q>{e(r["text"])}</q>{flags}</figcaption></figure>')
    sections.append(f'<section class="clip"><h3>{e(name)} <span class="src">{e(src)} · {len(cards)} ภาพ</span></h3><div class="grid">{"".join(cards)}</div></section>')

page = f'''<title>AI เขียนใบประกอบ</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anuphan:wght@500;600;700&family=IBM+Plex+Sans+Thai:wght@400;500;600&display=swap">
<style>
/* layout: one reading column like the earlier review pages; a bar list of categories, then every picture clip by clip */
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
p{{margin:0}}
.lede{{display:flex;flex-direction:column;gap:12px}} .lede p{{color:var(--muted);max-width:62ch}}
.facts{{display:flex;flex-wrap:wrap;gap:8px}}
.fact{{font-size:14px;background:var(--accent-soft);color:var(--accent);border-radius:999px;padding:4px 12px;font-weight:500}}
.box{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:12px}}
.box ol,.box ul{{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px}}
.box li b{{font-weight:600}}
.chart{{display:flex;flex-direction:column;gap:6px}}
.bar{{display:grid;grid-template-columns:7.5em minmax(0,1fr) 2em 3.6em 3.4em;align-items:center;gap:8px;font-size:14px;position:relative;border-radius:8px;padding:2px 4px}}
.bar:hover,.bar:focus-visible{{background:var(--accent-soft);outline:none}}
.bname{{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.track{{height:12px;background:var(--track);border-radius:4px;overflow:hidden}}
.fill{{display:block;height:100%;background:var(--accent);border-radius:0 4px 4px 0}}
.bval{{font-variant-numeric:tabular-nums;font-weight:600;text-align:right}}
.nv{{color:var(--muted);font-size:13px}}
.bar .rep{{font-size:12px;background:var(--warm-soft);color:var(--warm);border-radius:999px;padding:0 8px;font-weight:600;white-space:nowrap;justify-self:start}}
.bar[data-tip]:hover::after,.bar[data-tip]:focus-visible::after{{content:attr(data-tip);position:absolute;left:8em;top:100%;z-index:5;margin-top:4px;background:var(--fg);color:var(--bg);
  font-size:13px;padding:6px 10px;border-radius:8px;white-space:normal;max-width:min(320px,70vw)}}
.note{{font-size:13px;color:var(--muted)}}
.clip{{display:flex;flex-direction:column;gap:12px;border-top:1px solid var(--line);padding-top:20px}}
.src{{font-family:var(--body);font-weight:400;font-size:14px;color:var(--muted)}}
.grid{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}}
.pic{{margin:0;display:flex;flex-direction:column;gap:6px;min-width:0}}
.pic img{{width:100%;height:auto;aspect-ratio:9/16;object-fit:cover;border-radius:10px;background:#000;display:block;border:2px solid transparent}}
.pic.is-off img{{border-color:var(--off)}}
.pic figcaption{{display:flex;flex-direction:column;gap:2px;font-size:12px;line-height:1.45}}
.cat{{font-weight:600;color:var(--accent);font-size:13px}}
.vn{{color:var(--muted)}}
.pic q{{quotes:"“" "”";color:var(--fg)}}
.flag{{font-size:11px;font-weight:600;border-radius:6px;padding:1px 6px;width:fit-content}}
.flag.off{{background:var(--off-soft);color:var(--off)}} .flag.rep{{background:var(--warm-soft);color:var(--warm)}}
@media (max-width:420px){{.grid{{grid-template-columns:repeat(2,minmax(0,1fr))}} .bar{{grid-template-columns:6.4em minmax(0,1fr) 1.6em 3.2em 3.2em;gap:6px}}}}
</style>
<div class="wrap">
  <header class="lede">
    <h1>ลองให้ AI เขียนใบประกอบตามหมวด</h1>
    <p>ให้ AI อ่านบทพูดจริง 6 เรื่อง แล้วเลือกหมวดกับเขียนใบประกอบทีละประโยค เหมือนตอนเว็บทำงานจริง โปรแกรมเลือกร่างเองตามเดิม</p>
    <p>AI ที่ใช้เป็นรุ่นเดียวกับเว็บ (Sonnet) รอบแก้ใช้ Haiku ตามที่ตกลงไว้ ทำผ่านผู้ช่วยในแชท เพราะยังไม่มีคีย์ API</p>
    <p><b>อัปเดต (หลัง Friend ติ):</b> คำตอบของหมวดคำถามวางตรงฟองคำถามพอดีแล้ว ไม่ทิ้งขอบขาว · ตราห้ามกับป้ายเตือนสีแดงไม่อยู่บนไอคอนสีแดงแล้ว (ไอคอนเป็นสีปกติ) · ภาพทุกภาพทำใหม่ให้เป็นร่างเดียวกับที่คลิปจริงจะเลือก (รอบแรกมี 11 ภาพที่เป็นคนละร่างกับชื่อใต้ภาพ)</p>
    <div class="facts"><span class="fact">6 เรื่อง</span><span class="fact">{S["pictures"]} ภาพ</span><span class="fact">ผ่านตัวตรวจครบหลังรอบแก้</span></div>
  </header>

  <section class="box">
    <h2>หมวดไหนใช้บ่อย</h2>
    <div class="chart" role="list">{"".join(bars)}</div>
    <p class="note">ตัวเลขคือจำนวนภาพที่ AI เลือกหมวดนั้น · "ซ้ำ" = ครั้งที่ในคลิปเดียวกันมีภาพหน้าตาเหมือนกันเพราะร่างไม่พอ</p>
  </section>

  <section class="box">
    <h2>สิ่งที่เจอ</h2>
    <ol>
      <li><b>คำเตือนใช้บ่อยที่สุด</b> ถูกกับผิดกับคำถามตามมา หมวดคำถามเจอในทุกเรื่องที่ลอง</li>
      <li><b>หมวดคำถามขาดร่างมากที่สุด</b> AI บอกแค่ว่าใครสงสัย ไม่ได้ให้สองทางเลือก จึงใช้ได้แค่ร่าง "คนกับฟองคำถาม" ทุกภาพของหมวดนี้หน้าตาเหมือนกันหมด</li>
      <li><b>คำเตือน ถูกกับผิด และเหตุกับผล</b> ร่างไม่พอในบางคลิป เลยมีร่างซ้ำ</li>
      <li><b>ตัวเลขเด่นไม่ได้ใช้เลย</b> ครั้งที่ AI จะใช้ ซับเขียนตัวเลขเป็นคำ เช่น "สี่ ปี" ระบบตอนนี้รับแค่ตัวเลขที่เป็นเลข เลยไม่ผ่านตัวตรวจ</li>
      <li><b>AI ไม่ได้บอกเลยว่าประโยคไหนไม่เข้าหมวด</b> แต่ผมดูเองแล้วเห็น 4 ภาพที่ใส่หมวดไม่ตรง (กรอบสีส้มด้านล่าง)</li>
      <li><b>ร่างเป้าหมาย</b> แบบถ้วยมีเลข 100% ติดมาในภาพ ทั้งที่คนพูดไม่ได้พูด และแบบลูกศรเข้าเป้าไม่ได้ใช้ไอคอนที่ AI เลือก</li>
      <li><b>6 เรื่องยังน้อย</b> ใช้เป็นแนวทางได้ แต่ยังไม่แน่นอน ถ้ามีบทพูดเพิ่มจะนับได้แม่นขึ้น</li>
    </ol>
  </section>

  <section class="box">
    <h2>ต่อไปที่เสนอ</h2>
    <ol>
      <li>เพิ่มร่างรอบแรก 5 หมวดที่ขาดที่สุด: คำถาม คำเตือน ถูกกับผิด เหตุกับผล เป้าหมาย</li>
      <li>แก้เล็ก ๆ 2 เรื่อง: ให้โปรแกรมแปลงตัวเลขที่เป็นคำ ("สี่ ร้อย") เป็นเลขเอง และแก้ร่างเป้าหมายให้ใช้ไอคอนของประโยค ไม่มีเลข 100%</li>
      <li>ถ้า Friend มีบทพูดเพิ่ม ส่งมาได้ จะได้นับใหม่ให้แม่นขึ้น</li>
    </ol>
  </section>

  <h2>ทุกภาพที่ AI เลือก</h2>
  <p class="note">ภาพนิ่งหลังคำสำคัญ สไตล์การ์ด · ชื่อหมวด · ร่างที่โปรแกรมเลือก · ประโยคจริงจากบทพูด</p>
  {"".join(sections)}
</div>
'''
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(page)
print('pictures', sum(1 for _ in os.listdir(os.path.join(OUT, 'st'))))
