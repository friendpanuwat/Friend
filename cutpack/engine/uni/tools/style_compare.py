"""style_compare.py <Friend's shots dir> <our stills dir> <style> <out.jpg> <label> <shot> [shot …]
Friend's shot (left, <ref>/<NN>.jpg) next to ours (right, <ours>/<style>_<x><NN>_<i>.jpg from style_stills.sh), TikTok's zones in
red on both (top bar y 0–195, buttons x 936– y 754–1680, name y 1690–). Three shots per sheet is a good size to send.
Friend's shots and our stills on the test clip stay out of the repo (LESSONS 30)."""
import glob, os, sys
from PIL import Image, ImageDraw, ImageFont
ref, ours, style, out, label, shots = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6:]
W, H, pad = 540, 960, 16
try: F = ImageFont.truetype(os.path.join(os.path.dirname(__file__), '..', 'fonts', 'Anuphan-VF.ttf'), 26)
except OSError: F = None
def zones(im):
    im = im.convert('RGBA'); o = Image.new('RGBA', im.size, (0, 0, 0, 0)); g = ImageDraw.Draw(o)
    for b in [(0, 0, 1080, 195), (936, 754, 1080, 1680), (0, 1690, 1080, 1920)]: g.rectangle(b, fill=(255, 40, 40, 70), outline=(255, 60, 60, 200), width=4)
    return Image.alpha_composite(im, o).convert('RGB')
c = Image.new('RGB', (len(shots) * (2 * W + 8 + pad), H + 44), (40, 40, 40)); d = ImageDraw.Draw(c)
for k, s in enumerate(shots):
    mine = sorted(glob.glob(f'{ours}/{style}_*{s}_{int(s) - 1}.jpg'))
    a = zones(Image.open(f'{ref}/{s}.jpg')).resize((W, H)); b = zones(Image.open(mine[0])).resize((W, H))
    x = k * (2 * W + 8 + pad); c.paste(a, (x, 44)); c.paste(b, (x + W + 8, 44))
    d.text((x + 8, 8), f'ช็อต {s}  รูปของ Friend', fill='white', font=F); d.text((x + W + 16, 8), label, fill=(255, 214, 0), font=F)
c.save(out, quality=88)
