"""pixel_check.py <before dir> <after dir> — every still in <after> against the same file in <before>, pixel by pixel (LESSONS 63:
after a change to shared code, the finished styles must come out the same). Prints how many were compared and which differ, with
the box of the difference. Known: window_w12_10 (w12_11 before the recap shot went) differs by a small spot run to run (the "+" label), even with no
change; render it twice before blaming a change.
--noise N (2026-11-24): a pixel counts only when it differs by more than N (0–255, grey); frames taken from a page twice differ by a
few levels here and there (JPEG), 20 is above that: page_frames.js before/after a change that must leave a clip alone."""
import glob, os, sys
from PIL import Image, ImageChops
args = sys.argv[1:]; NOISE = int(args.pop(args.index('--noise') + 1)) if '--noise' in args else 0
if '--noise' in args: args.remove('--noise')
before, after = args[0], args[1]
bad, n = [], 0
for f in sorted(glob.glob(os.path.join(after, '*.jpg'))):
    g = os.path.join(before, os.path.basename(f))
    if not os.path.exists(g): continue
    n += 1; x = ImageChops.difference(Image.open(f).convert('RGB'), Image.open(g).convert('RGB'))
    d = (x.convert('L').point(lambda v: 255 if v > NOISE else 0) if NOISE else x).getbbox()
    if d: bad.append((os.path.basename(f), d))
print(f'compared {n} stills · different: {len(bad)}'); [print('  ', b, box) for b, box in bad]
