"""Count the glow-line library by shape against the 6 motion-graphic sizes (Friend 2026-11-19: "นับภาพในคลังแต่ละทรงได้เลย").
usage (from engine/uni): python3 tools/shape_count.py
Shapes (width / height) come from glow/shapes.json, measured with each design's sample words: a design can draw another shape
with a clip's own words (LESSONS 67), so these counts are a guide for planning, not what a given clip gets.
A design "fits" a size when it fills at least 85% of that size's box at the same shape (min(r/R, R/r)); 70–85% = loose fit.
The six sizes' shapes are from Friend's pictures (DECISIONS "ขนาดของ motion graphic"); the numbers are not fixed yet."""
import json, math, os
HERE = os.path.dirname(os.path.abspath(__file__))
sh = json.load(open(os.path.join(HERE, '..', 'glow', 'shapes.json')))
SIZES = {1: 3.75, 2: 1.82, 3: 1.14, 4: 0.63, 5: 1.21, 6: 0.89}
fill = lambda r, R: min(r / R, R / r)
print(f'{len(sh)} designs')
for k, R in SIZES.items():
    print(f'size {k} (w/h {R}): fits {sum(fill(r, R) >= .85 for r in sh.values())} · loose {sum(.7 <= fill(r, R) < .85 for r in sh.values())}')
print(f'between size 1 and 2 (w/h 2.2–3.0): {sum(2.2 <= r < 3.0 for r in sh.values())}')
print('per category, designs that fit each size: cat designs | 1 2 3 4 5 6')
for c in sorted({k.split(".")[0] for k in sh}):
    rs = [r for k, r in sh.items() if k.split('.')[0] == c]
    print(c, len(rs), '|', ' '.join(str(sum(fill(r, SIZES[k]) >= .85 for r in rs)) for k in SIZES))
