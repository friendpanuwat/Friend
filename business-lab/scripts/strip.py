import sys
from PIL import Image
out, *files = sys.argv[1:]
ims = [Image.open(f) for f in files]
w = sum(i.width for i in ims); h = max(i.height for i in ims)
o = Image.new("RGB", (w, h))
x = 0
for i in ims:
    o.paste(i, (x, 0)); x += i.width
o = o.resize((w // 2, h // 2))
o.save(out)
