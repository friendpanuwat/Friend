# measure.py <still.png> <cat>: the real share of each size's box the drawing covers (bright pixels' outer frame ÷ box) — the 30 % rule's check
import sys; from PIL import Image, ImageDraw, ImageFont
im = Image.open(sys.argv[1]).convert('L'); W0 = 1800; k = im.size[0] / W0
SZ = {1: (860, 230), 2: (860, 470), 3: (560, 490), 4: (400, 635), 5: (860, 710), 6: (860, 965), 7: (400, 500)}
AT = {1: (470, 170), 2: (470, 470), 5: (470, 1000), 6: (1340, 170), 3: (1340, 1180), 4: (1130, 1700), 7: (1560, 1700)}
for n in range(1, 8):
    w, h = [round(v * 1000 / 860 * .8) for v in SZ[n]]; x, y = AT[n]; box = (int((x - w / 2 + 4) * k), int((y + 4) * k), int((x + w / 2 - 4) * k), int((y + h - 4) * k))
    bb = im.crop(box).point(lambda v: 255 if v > 90 else 0).getbbox()
    f = 0 if not bb else (bb[2] - bb[0]) * (bb[3] - bb[1]) / ((box[2] - box[0]) * (box[3] - box[1]))
    print(f'size {n}: {f:.0%}' + ('  < 70%' if f < .7 else ''))

# with a 3rd argument: write the still with each size's real fill printed above its box (red under 70 %)
if len(sys.argv) > 3:
    out = Image.open(sys.argv[1]).convert('RGB'); dr = ImageDraw.Draw(out)
    try: fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(22 * k))
    except Exception: fnt = None
    im2 = Image.open(sys.argv[1]).convert('L')
    for n in range(1, 8):
        w, h = [round(v * 1000 / 860 * .8) for v in SZ[n]]; x, y = AT[n]; box = (int((x - w / 2 + 4) * k), int((y + 4) * k), int((x + w / 2 - 4) * k), int((y + h - 4) * k))
        bb = im2.crop(box).point(lambda v: 255 if v > 90 else 0).getbbox(); f = 0 if not bb else (bb[2] - bb[0]) * (bb[3] - bb[1]) / ((box[2] - box[0]) * (box[3] - box[1]))
        dr.text((int((x + w / 2 - 110) * k), int((y - 26) * k)), f'fill {f:.0%}', fill=(255, 90, 90) if f < .7 else (150, 220, 150), font=fnt)
    out.save(sys.argv[3])
