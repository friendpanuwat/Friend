#!/usr/bin/env python3
"""Build the sentence-function guide (B01–B33) as HTML, then PDF via print_pdf.js.

    python3 build.py OUT_DIR        → OUT_DIR/guide.html + OUT_DIR/<name>.pdf
"""
import html, os, re, subprocess, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from guide_data import PRINCIPLES, CATS, NEAR, CHANGES_NEW, CHANGES_OLD

HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.abspath(os.path.join(HERE, '..', '..', 'fonts', 'Anuphan-VF.ttf'))
NAME = 'sentence-function-guide_B01-B33_v2'
TITLE = {c[0]: c[1] for c in CATS}


def t(s):  # escape + `code`
    return re.sub(r'`([^`]+)`', r'<code>\1</code>', html.escape(s))


def cat_block(c):
    cid, th, en, func, use, notuse, slots, note = c
    rows = ''.join(
        f'<tr><td class="k">{html.escape(k)}</td><td>{t(d)}</td><td class="o">{"ไม่บังคับ" if o else ""}</td></tr>'
        for k, d, o in slots)
    if note:
        rows += f'<tr class="note"><td></td><td colspan="2">{t(note)}</td></tr>'
    return f'''<section class="cat">
<h3><span class="id">{cid}</span> {html.escape(th)} <span class="en">({html.escape(en)})</span></h3>
<p><b>หน้าที่:</b> {t(func)}</p>
<p><b>ใช้เมื่อ:</b> {t(use)}</p>
<p><b>ไม่ใช้เมื่อ:</b> {t(notuse)}</p>
<table class="slots"><tr><th colspan="3">ช่องข้อมูล</th></tr>{rows}</table>
</section>'''


def near_table():
    out = []
    for row in NEAR:
        cells = ''.join(f'<td><span class="id">{a}</span> <b>{html.escape(TITLE[a])}</b><br>{html.escape(d)}</td>' for a, d in row)
        cells += '<td></td>' * (3 - len(row))
        out.append(f'<tr>{cells}</tr>')
    return '<table class="near">' + ''.join(out) + '</table>'


def build(out_dir):
    principles = ''.join(f'<li><b>{html.escape(a)}</b> — {t(b)}</li>' for a, b in PRINCIPLES)
    cats = ''.join(cat_block(c) for c in CATS)
    new_rows = ''.join(f'<tr><td><span class="id">{a}</span> {html.escape(TITLE[a])}</td><td class="k">{html.escape(b)}</td><td>{t(c)}</td></tr>' for a, b, c in CHANGES_NEW)
    old_rows = ''.join(f'<tr><td><span class="id">{a}</span> {html.escape(TITLE[a])}</td><td colspan="2">{t(b)}</td></tr>' for a, b in CHANGES_OLD)
    doc = f'''<!doctype html><html lang="th"><head><meta charset="utf-8"><title>คู่มือหมวดหน้าที่ของประโยค</title>
<style>
@font-face {{ font-family: 'Anuphan'; src: url('file://{FONT}'); font-weight: 100 900; }}
@page {{ size: A4; margin: 22mm 20mm 20mm 20mm; }}
:root {{ --ink: #1f2d3d; --navy: #1f3a5f; --teal: #1d6a86; --pill: #e4eff5; --rule: #dfe6ec; --head: #eef3f7; --grey: #8a96a3; }}
body {{ font-family: 'Anuphan', 'Loma', sans-serif; color: var(--ink); font-size: 10.5pt; line-height: 1.6; margin: 0; background: #fff; }}
code, .k {{ font-family: 'DejaVu Sans Mono', monospace; font-size: 9pt; color: var(--teal); }}
h1 {{ color: var(--navy); font-size: 27pt; font-weight: 700; margin: 0 0 14px; letter-spacing: .5px; }}
h2 {{ color: var(--navy); font-size: 18pt; font-weight: 700; margin: 0 0 4px; padding-bottom: 8px; border-bottom: 1px solid var(--rule); }}
h2.sub {{ font-size: 13.5pt; color: var(--teal); border: 0; margin-top: 18px; }}
.cover {{ height: 245mm; display: flex; flex-direction: column; justify-content: center; text-align: center; page-break-after: always; }}
.cover p {{ margin: 4px 0; color: #3c4b5b; }}
.cover .ver {{ margin-top: 70px; color: var(--grey); font-size: 10pt; }}
.page {{ page-break-before: always; }}
.lead {{ color: #5b6876; font-size: 9.5pt; margin: 6px 0 14px; }}
ol li {{ margin-bottom: 5px; }}
.cat {{ page-break-inside: avoid; margin: 0 0 18px; }}
.cat h3 {{ color: var(--teal); font-size: 13pt; margin: 0 0 4px; font-weight: 700; }}
.cat h3 .en {{ font-weight: 400; font-size: 10pt; color: #5b6876; }}
.cat p {{ margin: 1px 0; }}
.id {{ font-family: 'DejaVu Sans Mono', monospace; font-size: 8.5pt; font-weight: 700; background: var(--pill); color: var(--navy); padding: 1px 5px; border-radius: 3px; }}
table {{ border-collapse: collapse; width: 100%; }}
table.slots {{ margin-top: 7px; }}
table.slots th {{ text-align: left; background: var(--head); font-size: 9pt; padding: 3px 7px; }}
table.slots td {{ border-bottom: 1px solid var(--rule); padding: 3px 7px; vertical-align: top; font-size: 9.5pt; }}
table.slots td.k {{ width: 26%; }}
table.slots td.o {{ width: 11%; text-align: right; color: var(--grey); font-size: 8.5pt; white-space: nowrap; }}
table.slots tr.note td {{ color: #4d5b69; font-size: 9pt; background: #f8fafb; }}
table.near td {{ border: 1px solid var(--rule); padding: 6px 8px; width: 33.3%; vertical-align: top; font-size: 9pt; page-break-inside: avoid; }}
table.near b {{ font-size: 9pt; }}
table.chg td {{ border-bottom: 1px solid var(--rule); padding: 4px 7px; vertical-align: top; font-size: 9.2pt; }}
table.chg th {{ text-align: left; background: var(--head); font-size: 9pt; padding: 3px 7px; }}
table.chg td:first-child {{ width: 30%; }}
table.chg td.k {{ width: 30%; }}
.box {{ border-left: 3px solid var(--teal); background: #f4f8fa; padding: 8px 12px; font-size: 9.5pt; margin-top: 10px; }}
</style></head><body>

<div class="cover">
<h1>คู่มือหมวดหน้าที่ของประโยค</h1>
<p>ระบบจัดหมวดสำหรับวิเคราะห์บทพูดและเตรียมข้อมูลไปใช้สร้างภาพกราฟิก</p>
<p>รวมหมวด B01–B33 พร้อมคำอธิบาย เกณฑ์การเลือกใช้ และช่องข้อมูล</p>
<p class="ver">ฉบับแก้ 2026-11-13 · ช่องข้อมูลเหลือเฉพาะช่องที่ภาพวาดจริง · B01–B21 ตรงกับคำสั่งที่ระบบใช้</p>
</div>

<h2>สารบัญ</h2>
<h2 class="sub">หลักการกลางสำหรับทุกหมวด</h2>
<ol>{principles}</ol>
<h2 class="sub">วิธีอ่านรายละเอียด</h2>
<p>แต่ละหมวดมี 4 ส่วน ได้แก่ <b>หน้าที่</b> บทบาทของประโยค, <b>ใช้เมื่อ</b> เงื่อนไขที่ควรเลือกหมวด, <b>ไม่ใช้เมื่อ</b> กรณีที่ควรเลือกหมวดอื่น และ <b>ช่องข้อมูล</b> ฟิลด์สำหรับเก็บสาระจากประโยค ชื่อฟิลด์ภาษาอังกฤษคงไว้เพื่อให้เชื่อมกับระบบได้ง่าย</p>
<p>ช่องที่ไม่มีคำว่า "ไม่บังคับ" ต้องมีทุกครั้ง ช่องไม่บังคับใส่เฉพาะเมื่อประโยคให้ข้อมูลนั้นมา ของหนึ่งชิ้นในช่องคือ ไอคอน + ป้ายคำสั้นจากประโยค (ไม่เกิน 12 ตัวอักษร) + โทน + รูปทรง</p>
<p>ส่วนที่ 3 ท้ายเล่มบอกว่าฉบับนี้แก้อะไรจากฉบับก่อน</p>

<div class="page"></div>
<h2>ส่วนที่ 1 — หมวด B01–B33</h2>
<p class="lead">คำอธิบายหมวด B01–B33 โดยคงชื่อหมวดและชื่อช่องข้อมูลเดิมเป็นหลัก</p>
{cats}

<div class="page"></div>
<h2>ส่วนที่ 2 — หมวดสำรองและเกณฑ์แยกหมวดใกล้กัน</h2>
<h2 class="sub">หมวดสำรอง — ประโยคที่ควรมีภาพ แต่ไม่เข้าหมวดใด</h2>
<p>ใช้เมื่อประโยคมีสาระที่ควรนำเสนอเป็นภาพ แต่หน้าที่ไม่ตรงกับ B01–B33 ไม่ควรฝืนเลือกหมวดที่ใกล้เคียงเพียงเพราะมีคำหรือหัวข้อคล้ายกัน ควรบันทึกสั้น ๆ ว่าประโยคกำลังทำหน้าที่อะไร เพื่อนำไปทบทวนว่าระบบยังขาดหมวดใด ในระบบเขียนเป็น <code>cat: "none"</code> และ <code>need</code> (หน้าที่ของประโยค เป็นคำสั้น ๆ)</p>
<h2 class="sub">เกณฑ์แยกหมวดที่ใกล้กัน</h2>
{near_table()}
<h2 class="sub">หมายเหตุการใช้กับระบบ</h2>
<p>ช่องข้อมูลของแต่ละหมวดต้องตรงกับคำสั่งที่ระบบใช้งานจริง (<code>cutpack/engine/uni/cat_ai.py</code>) หากแก้หมวดหรือช่องข้อมูล ต้องแก้ทั้งคู่มือและคำสั่งระบบให้สอดคล้องกันก่อนใช้งานจริง</p>
<p>ณ ฉบับนี้ B01–B21 ตรงกับคำสั่งระบบแล้ว ส่วน B22–B33 ยังไม่อยู่ในคำสั่งระบบ ต้องเพิ่มเข้าไปพร้อมกับชุดร่างของหมวดนั้น</p>
<h2 class="sub">กฎการจัดหมวดเพิ่มเติม (ข้อเสนอ)</h2>
<ol><li>พิจารณาหน้าที่หลักของประโยค ไม่ตัดสินจากคำศัพท์เพียงคำเดียว</li>
<li>ไม่สร้างข้อมูลที่ผู้พูดไม่ได้ระบุ ช่องที่ไม่มีข้อมูลให้เว้นว่าง</li>
<li>หากมีหลายหน้าที่ ให้เลือกหน้าที่หลัก หากไม่มั่นใจให้ใช้หมวดสำรอง และบันทึกเหตุผลไว้ทบทวน</li></ol>
<div class="box">หมายเหตุ: กฎสามข้อนี้เป็นข้อเสนอเพื่อช่วยให้การใช้งานสม่ำเสมอ ไม่ใช่ข้อความที่ระบุไว้ตรง ๆ ในต้นฉบับ</div>

<div class="page"></div>
<h2>ส่วนที่ 3 — สิ่งที่แก้ในฉบับนี้</h2>
<p class="lead">เหตุผล: ภาพอยู่บนจอ 2–3 วินาที · ประโยคเดียวแทบไม่มีข้อมูลครบทุกช่อง · ช่องเยอะทำให้ AI แต่งข้อมูลง่าย · ช่องไม่บังคับทุกช่องเพิ่มแบบผสมที่ร่างต้องรองรับ</p>
<h2 class="sub">หมวดใหม่ B22–B33: เหลือเฉพาะช่องที่ภาพวาดจริง</h2>
<table class="chg"><tr><th>หมวด</th><th>ช่องที่เหลือ</th><th>สิ่งที่ตัดหรือเปลี่ยน</th></tr>{new_rows}</table>
<h2 class="sub">หมวด B01–B21: แก้ให้ตรงกับคำสั่งที่ระบบใช้</h2>
<table class="chg"><tr><th>หมวด</th><th colspan="2">สิ่งที่แก้</th></tr>{old_rows}</table>
<h2 class="sub">อื่น ๆ</h2>
<ul><li>เพิ่มหลักการกลางข้อ 12 "มีเฉพาะช่องที่ภาพวาดจริง"</li>
<li>หมวดสำรอง: เพิ่มว่าในระบบเขียนเป็น <code>cat: "none"</code> และ <code>need</code></li>
<li>หมายเหตุการใช้กับระบบ: เพิ่มชื่อไฟล์คำสั่งระบบ และสถานะของ B22–B33</li></ul>
</body></html>'''
    os.makedirs(out_dir, exist_ok=True)
    h = os.path.join(out_dir, 'guide.html')
    open(h, 'w').write(doc)
    pdf = os.path.join(out_dir, NAME + '.pdf')
    subprocess.run(['node', os.path.join(HERE, 'print_pdf.js'), h, pdf], check=True)
    print(pdf)


if __name__ == '__main__':
    build(sys.argv[1])
