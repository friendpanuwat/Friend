import json
from openpyxl import Workbook
from openpyxl.drawing.image import Image as XImage
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.utils import get_column_letter
rows = json.load(open('rows.json'))
F = 'Tahoma'
hd = Font(name=F, bold=True, color='FFFFFF', size=11); hf = PatternFill('solid', fgColor='1F2937')
body = Font(name=F, size=10); bold = Font(name=F, size=10, bold=True); mono = Font(name='Consolas', size=10)
thin = Side(style='thin', color='E5E7EB'); bd = Border(bottom=thin)
PRF = {1: 'FEE2E2', 2: 'FEF3C7', 3: 'F3F4F6'}
wb = Workbook(); ws = wb.active; ws.title = 'ไอคอนทั้งหมด'
H = ['ลำดับ', 'ภาพปัจจุบัน', 'ชื่อไฟล์ (ชื่อไอคอน)', 'ความหมาย', 'กลุ่ม', 'ใช้ที่ไหน', 'ร่างที่วาดไอคอนนี้เอง (จำนวน)', 'AI เคยเลือก (ครั้ง)', 'ลำดับการวาด', 'สถานะ', 'หมายเหตุ', 'ร่างที่วาดไอคอนนี้เอง (ชื่อ)']
W = [7, 12, 26, 30, 24, 24, 14, 12, 12, 14, 30, 70]
for c, (h, w) in enumerate(zip(H, W), 1):
    x = ws.cell(1, c, h); x.font = hd; x.fill = hf; x.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
    ws.column_dimensions[get_column_letter(c)].width = w
ws.row_dimensions[1].height = 34
dv = DataValidation(type='list', formula1='"ยังไม่เริ่ม,กำลังวาด,วาดแล้ว,ไม่ต้องวาด"', allow_blank=True); ws.add_data_validation(dv)
for i, r in enumerate(rows, 2):
    vals = [i - 1, None, r['name'], r['th'], r['group'], r['where'], r['ndrafts'], r['ai'], r['pr'], 'ยังไม่เริ่ม', '', r['drafts']]
    for c, v in enumerate(vals, 1):
        x = ws.cell(i, c, v); x.font = mono if c == 3 else bold if c == 4 else body; x.border = bd
        x.alignment = Alignment(vertical='center', horizontal='center' if c in (1, 7, 8, 9, 10) else 'left', wrap_text=c in (4, 6, 11, 12))
    ws.cell(i, 9).fill = PatternFill('solid', fgColor=PRF[r['pr']])
    dv.add(ws.cell(i, 10))
    img = XImage(f"png/{r['name']}.png"); img.width = img.height = 40; ws.add_image(img, f'B{i}')
    ws.row_dimensions[i].height = 34
ws.freeze_panes = 'C2'; ws.auto_filter.ref = f'A1:L{len(rows) + 1}'
last = len(rows) + 1
# summary
s = wb.create_sheet('สรุป')
s.column_dimensions['A'].width = 52; s.column_dimensions['B'].width = 14
def put(r, a, b=None, f=body):
    s.cell(r, 1, a).font = f
    if b is not None: c = s.cell(r, 2, b); c.font = f; c.alignment = Alignment(horizontal='center')
put(1, 'สรุปไอคอนที่ CutPack ใช้', None, Font(name=F, size=14, bold=True))
put(2, 'ไอคอนทั้งหมด', f"=COUNTA('ไอคอนทั้งหมด'!C2:C{last})", bold)
put(4, 'ตามลำดับการวาด', 'จำนวน', hd); s.cell(4, 1).fill = hf; s.cell(4, 2).fill = hf
for k, (lab, v) in enumerate([('1 วาดก่อน: ร่างในคลังวาดเอง หรือ AI เลือก 3 ครั้งขึ้นไป', 1), ('2 AI เคยเลือก 1–2 ครั้ง', 2), ('3 AI เลือกได้ แต่ยังไม่เคยถูกเลือกในการทดสอบ', 3)]):
    put(5 + k, lab, f"=COUNTIF('ไอคอนทั้งหมด'!I2:I{last},{v})")
put(9, 'ตามที่ใช้', 'จำนวน', hd); s.cell(9, 1).fill = hf; s.cell(9, 2).fill = hf
for k, lab in enumerate(['ร่างวาดเอง + AI เลือกได้', 'ร่างวาดเองเท่านั้น', 'AI เลือกใส่ในภาพได้']):
    put(10 + k, lab, f"=COUNTIF('ไอคอนทั้งหมด'!F2:F{last},\"{lab}\")")
put(14, 'ความคืบหน้า (เปลี่ยนในคอลัมน์ "สถานะ")', 'จำนวน', hd); s.cell(14, 1).fill = hf; s.cell(14, 2).fill = hf
for k, lab in enumerate(['ยังไม่เริ่ม', 'กำลังวาด', 'วาดแล้ว', 'ไม่ต้องวาด']):
    put(15 + k, lab, f"=COUNTIF('ไอคอนทั้งหมด'!J2:J{last},\"{lab}\")")
put(19, 'วาดแล้ว คิดเป็น', f'=IFERROR(B17/B2,0)', bold); s.cell(19, 2).number_format = '0%'
put(21, 'ตามกลุ่ม', 'จำนวน', hd); s.cell(21, 1).fill = hf; s.cell(21, 2).fill = hf
groups = []
for r in rows:
    if r['group'] not in groups: groups.append(r['group'])
for k, g in enumerate(sorted(groups)):
    put(22 + k, g, f"=COUNTIF('ไอคอนทั้งหมด'!E2:E{last},\"{g}\")")
# how to draw and send
h = wb.create_sheet('วิธีวาดและส่ง'); h.column_dimensions['A'].width = 110
lines = [('วิธีใช้ไฟล์นี้', True),
 ('• ช่องที่แก้ได้: คอลัมน์ "สถานะ" (เลือกจากรายการ: ยังไม่เริ่ม · กำลังวาด · วาดแล้ว · ไม่ต้องวาด) และคอลัมน์ "หมายเหตุ" ช่องอื่นอย่าแก้ ตัวอย่าง: วาดแล้ว ให้เปลี่ยนสถานะเป็น "วาดแล้ว" หน้า "สรุป" จะนับให้เอง', False),
 ('• เรียงตาม "ลำดับการวาด": 1 วาดก่อน (ร่างในคลังวาดเอง หรือ AI เลือกบ่อย) → 2 → 3 · กรองได้จากลูกศรที่หัวตาราง', False),
 ('• "ร่างวาดเอง" = ร่างในคลังใช้ไอคอนนี้เป็นส่วนหนึ่งของภาพเสมอ · "AI เลือกใส่ในภาพได้" = AI เลือกตามประโยค (ใส่บนป้าย บนการ์ด ในวงกลม)', False),
 ('• "AI เคยเลือก" นับจากคำตอบของ AI ในการทดสอบที่ผ่านมา 19 ชุด ใช้ดูว่าไอคอนไหนถูกใช้บ่อย ยังไม่ใช่สถิติจากคลิปจริงจำนวนมาก', False),
 ('', False),
 ('ไอคอนที่วาดใหม่ ควรเป็นแบบนี้ ระบบจะสลับเข้าไปแทนได้ทันทีโดยไม่ต้องแก้ร่าง', True),
 ('• ไฟล์ SVG หนึ่งไอคอนต่อหนึ่งไฟล์ ตั้งชื่อตามคอลัมน์ "ชื่อไฟล์" เช่น heart.svg', False),
 ('• ขนาดกรอบ 24 × 24 (viewBox="0 0 24 24") เว้นขอบประมาณ 1–2 หน่วย ไม่มีพื้นหลัง', False),
 ('• สีเดียว: ใช้ currentColor หรือสีดำ ระบบจะเปลี่ยนสีให้ตามสไตล์ (ดำ ขาว สีเน้น) · ถ้าอยากให้มีส่วนที่ระบายสี ทำเป็นอีกชั้นแยกไว้ เดี๋ยว Claude ต่อให้ใช้สีเน้นของสไตล์', False),
 ('• ถ้าวาดเป็นเส้น ให้ความหนาเส้นเท่ากันทุกไอคอน (ไอคอนเดิมหนา 2 หน่วย ปลายเส้นมน)', False),
 ('• ไอคอนที่ร่างขยับบางส่วนแยกกัน (เช่น แม่กุญแจกับห่วง ปฏิทินกับหน้ากระดาษ) แยกชิ้นเป็นคนละกลุ่มใน SVG จะช่วยให้ขยับได้สวยขึ้น', False),
 ('• ส่งทั้งโฟลเดอร์เป็นไฟล์ zip ก็ได้ หรือส่งทีละชุดก็ได้', False),
 ('', False),
 ('ที่มาของรายการ', True),
 ('• ไอคอนที่ร่างวาดเอง: Claude เรนเดอร์ทุกร่างในคลัง 150 ร่าง ครบ 8 สไตล์ แล้วจดว่าร่างไหนอ่านไอคอนไหน (2026-11-12)', False),
 ('• ไอคอนที่ AI เลือกได้: รายการที่ส่งให้ AI ในระบบ (cutpack/engine/plan/prompt/icons_core.txt) ไม่รวมไอคอนที่ห้ามใช้ เช่น หัวกะโหลก บุหรี่ ไวน์ เปลวไฟ', False)]
for k, (t, b) in enumerate(lines, 1):
    c = h.cell(k, 1, t); c.font = Font(name=F, size=12 if b else 10, bold=b); c.alignment = Alignment(wrap_text=True, vertical='top')
wb.save('/home/user/Friend/cutpack/library/icons_list.xlsx'); print('saved')
