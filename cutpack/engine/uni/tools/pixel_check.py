"""pixel_check.py <before dir> <after dir> — every still in <after> against the same file in <before>, pixel by pixel (LESSONS 63:
after a change to shared code, the finished styles must come out the same). Prints how many were compared and which differ, with
the box of the difference. Known: window_w12_11 differs by a small spot run to run (the "+" label), even with no change; render
it twice before blaming a change."""
import glob, os, sys
from PIL import Image, ImageChops
before, after = sys.argv[1], sys.argv[2]
bad, n = [], 0
for f in sorted(glob.glob(os.path.join(after, '*.jpg'))):
    g = os.path.join(before, os.path.basename(f))
    if not os.path.exists(g): continue
    n += 1; d = ImageChops.difference(Image.open(f).convert('RGB'), Image.open(g).convert('RGB')).getbbox()
    if d: bad.append((os.path.basename(f), d))
print(f'compared {n} stills · different: {len(bad)}'); [print('  ', b, box) for b, box in bad]
