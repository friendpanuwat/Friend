import sys, cv2, numpy as np
from PIL import Image, ImageDraw
ids = sys.argv[2:]; tiles = []
for i in ids:
    t = cv2.imread(f'pt_{i}.png'); K = min(560 / t.shape[1], 360 / t.shape[0]); t = cv2.resize(t, None, fx=K, fy=K, interpolation=cv2.INTER_AREA)
    im = Image.fromarray(t[:, :, ::-1]); ImageDraw.Draw(im).text((4, 4), i, fill=(255, 255, 0)); tiles.append(im)
cols = 3; rows = [tiles[k:k + cols] for k in range(0, len(tiles), cols)]
M = Image.new('RGB', (560 * cols, sum(max(t.height for t in r) for r in rows)), (30, 30, 30)); y = 0
for r in rows:
    for k, t in enumerate(r): M.paste(t, (k * 560, y))
    y += max(t.height for t in r)
M.save(sys.argv[1], quality=85); print(M.size)
