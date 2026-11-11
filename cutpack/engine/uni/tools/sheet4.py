"""Sheets of still sketches in the four full-screen styles side by side, 4 drafts per sheet, numbered
(made in chat ccr-e630b241, round 10: Friend 2026-11-11 "อยากเห็นของทุกสไตล์เลยอ่ะทั้ง 4 สไตล์").
usage: python3 tools/sheet4.py <stills_dir> <out_prefix> "<scene@index …>"
  reads <stills_dir>/<style>_<scene>.jpg made by tools/stills.sh (540 × 960) and writes <out_prefix>_1.jpg, _2.jpg, …"""
import os, sys
from PIL import Image, ImageDraw, ImageFont
src, out, scenes = sys.argv[1], sys.argv[2], sys.argv[3].split()
FONT = os.path.join(os.path.dirname(__file__), '..', 'fonts', 'Mitr-SemiBold.ttf')
F, Fs = ImageFont.truetype(FONT, 34), ImageFont.truetype(FONT, 26)
ST, W, H, TOP = ['card', 'glass', 'split', 'gold'], 270, 480, 44
for p in range((len(scenes) + 3) // 4):
    rows = scenes[p * 4:(p + 1) * 4]
    img = Image.new('RGB', (W * 4, TOP + H * len(rows)), (24, 24, 28)); d = ImageDraw.Draw(img)
    for c, st in enumerate(ST): d.text((c * W + 10, 4), st, font=Fs, fill=(200, 200, 200))
    for r, s in enumerate(rows):
        for c, st in enumerate(ST):
            img.paste(Image.open(os.path.join(src, f'{st}_{s.split("@")[0]}.jpg')).convert('RGB').resize((W, H)), (c * W, TOP + r * H))
        d.rectangle((0, TOP + r * H, 58, TOP + r * H + 46), fill=(220, 30, 60)); d.text((8, TOP + r * H), str(p * 4 + r + 1), font=F, fill=(255, 255, 255))
    img.save(f'{out}_{p + 1}.jpg', quality=82)
    print(f'{out}_{p + 1}.jpg')
