import sys, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, '/home/user/Friend/cutpack/engine/plan'); import faces
S, M = sys.argv[1], sys.argv[2]
FONT = '/home/user/Friend/cutpack/engine/core/fonts/'
files, boxes = faces.detect(f'{S}/run2/VID_20261105115846/base/src_frames')
y0 = np.array([b[1] for b in boxes])
lo_i = int(np.argsort(y0)[int(len(y0) * .85)])     # head low: room above it
hi_i = int(np.argsort(y0)[int(len(y0) * .10)])     # head high: no room
lo, hi = Image.open(files[lo_i]).convert('RGB'), Image.open(files[hi_i]).convert('RGB')
print('low', files[lo_i], y0[lo_i], 'high', files[hi_i], y0[hi_i])

src = Image.open(f'{M}/c2_17.4.png').convert('RGB').crop((228, 150, 598, 341))   # a real widget card from clip 2
def rounded(im, r):
    m = Image.new('L', im.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, im.size[0] - 1, im.size[1] - 1), r, fill=255); return m
def paste_card(base, card, xy, r=32):
    sh = Image.new('RGBA', base.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((xy[0], xy[1] + 10, xy[0] + card.size[0], xy[1] + card.size[1] + 10), r, fill=(0, 0, 0, 70))
    base = Image.alpha_composite(base.convert('RGBA'), sh.filter(ImageFilter.GaussianBlur(14))).convert('RGB')
    base.paste(card, xy, rounded(card, r)); return base

# A: the same widget above the head, at a moment the head is low enough
A = paste_card(lo.copy(), src, (228, 150))

# B: the speaker shrinks for the widget's time; the space it opens is the style's dark glow
def glow():
    g = Image.new('RGB', (1080, 1920), (8, 8, 16)); d = np.array(g).astype(float)
    yy, xx = np.mgrid[0:1920, 0:1080]
    for cx, cy, rad, col in ((300, 260, 700, (40, 60, 160)), (820, 420, 650, (90, 40, 150))):
        w = np.clip(1 - np.hypot(xx - cx, yy - cy) / rad, 0, 1)[..., None] ** 2
        d = d * (1 - w * .9) + np.array(col) * w * .9
    return Image.fromarray(d.clip(0, 255).astype('uint8'))
B = glow(); sc = .82; vw, vh = int(1080 * sc), int(1920 * sc)
vid = hi.resize((vw, vh), Image.LANCZOS); vx, vy = (1080 - vw) // 2, 1920 - vh - 40
B.paste(vid, (vx, vy), rounded(vid, 44))
B = paste_card(B, src, (355, 150))

# C: a mini pill in the thin band above the head (one line: lead + key word)
C = hi.copy(); d = ImageDraw.Draw(C)
f1, f2 = ImageFont.truetype(FONT + 'Mitr-Medium.ttf', 34), ImageFont.truetype(FONT + 'Mitr-Bold.ttf', 40)
x, y, h = 250, 168, 92
w = 600
C = paste_card(C, Image.new('RGB', (w, h), 'white'), (x, y), r=46); d = ImageDraw.Draw(C)
d.rounded_rectangle((x + 16, y + 16, x + 76, y + 76), 18, fill=(222, 255, 60))
d.ellipse((x + 33, y + 33, x + 59, y + 59), outline=(20, 24, 50), width=5)
d.text((x + 96, y + 46), 'ไม่ใช่แค่', font=f1, fill=(20, 24, 50), anchor='lm')
kx = x + 96 + d.textlength('ไม่ใช่แค่ ', font=f1)
kw = d.textlength('ไขมัน', font=f2)
d.rounded_rectangle((kx - 8, y + 18, kx + kw + 8, y + h - 14), 12, fill=(222, 255, 60))
d.text((kx, y + 46), 'ไขมัน', font=f2, fill=(20, 24, 50), anchor='lm')

# sheet: three phones side by side with a Thai label each
lab = ImageFont.truetype(FONT + 'Mitr-Medium.ttf', 30)
sheet = Image.new('RGB', (3 * 540 + 4 * 30, 960 + 150), 'white'); sd = ImageDraw.Draw(sheet)
for k, (im, t1, t2) in enumerate(((A, 'ก. เช็กทีละช่วง', 'วางเหนือหัวเฉพาะตอนที่หัวต่ำพอ'),
                                  (B, 'ข. ย่อภาพคนพูดชั่วคราว', 'ภาพเล็กลงตอนวิดเจ็ตขึ้น แล้วขยายกลับ'),
                                  (C, 'ค. แคปซูลจิ๋วเหนือหัว', 'วิดเจ็ตบรรทัดเดียว สูงครึ่งเดียว'))):
    x0 = 30 + k * 570
    sd.text((x0, 22), t1, font=ImageFont.truetype(FONT + 'Mitr-SemiBold.ttf', 34), fill=(20, 24, 50))
    sd.text((x0, 72), t2, font=lab, fill=(90, 90, 110))
    sheet.paste(im.resize((540, 960), Image.LANCZOS), (x0, 130))
sheet.save(f'{M}/no_room_options.png'); print('ok')
