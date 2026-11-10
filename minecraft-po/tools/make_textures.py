"""Draw Po's skin, the whistle icon, pack icons and a preview picture.

Run:  python3 minecraft-po/tools/make_textures.py
Writes into minecraft-po/addon/... and minecraft-po/docs/.
Pure Pillow, no assets from the game are copied.
"""
import os
import random
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RP = os.path.join(ROOT, "addon", "Po_RP")
BP = os.path.join(ROOT, "addon", "Po_BP")
DOCS = os.path.join(ROOT, "docs")

rng = random.Random(7)

# ---------------------------------------------------------------- palette
SKIN = (214, 160, 120)
SKIN_D = (192, 138, 100)
HAIR = (28, 24, 26)
HAIR_L = (46, 40, 42)
EYE_W = (245, 245, 245)
EYE = (52, 34, 24)
MOUTH = (150, 76, 64)
BLUSH = (226, 140, 120)
HOOD = (240, 128, 36)
HOOD_D = (212, 104, 24)
HOOD_L = (252, 158, 70)
WHITE = (250, 250, 250)
JEANS = (52, 82, 140)
JEANS_D = (40, 64, 112)
SHOE = (58, 58, 64)
SHOE_L = (220, 220, 220)


def jitter(c, amt=6):
    d = rng.randint(-amt, amt)
    return tuple(max(0, min(255, v + d)) for v in c) + (255,)


class Skin:
    def __init__(self):
        self.img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
        self.px = self.img.load()

    def rect(self, x, y, w, h, color, amt=6):
        for i in range(x, x + w):
            for j in range(y, y + h):
                self.px[i, j] = jitter(color, amt)

    def dot(self, x, y, color):
        self.px[x, y] = color + (255,)

    # A box part laid out the standard way: uv origin (u, v), size w x h x d.
    def box(self, u, v, w, h, d, side, top=None, bottom=None):
        top = top or side
        bottom = bottom or side
        self.rect(u + d, v, w, d, top)            # top
        self.rect(u + d + w, v, w, d, bottom)     # bottom
        self.rect(u, v + d, d, h, side)           # right
        self.rect(u + d, v + d, w, h, side)       # front
        self.rect(u + d + w, v + d, d, h, side)   # left
        self.rect(u + 2 * d + w, v + d, w, h, side)  # back


def draw_skin():
    s = Skin()

    # ---- head 8x8x8 at (0,0)
    s.box(0, 0, 8, 8, 8, SKIN, top=HAIR, bottom=SKIN_D)
    # hair on the sides and back
    s.rect(0, 8, 8, 3, HAIR)          # right side top
    s.rect(0, 11, 2, 2, HAIR)         # sideburn
    s.rect(16, 8, 8, 3, HAIR)         # left side top
    s.rect(22, 11, 2, 2, HAIR)
    s.rect(24, 8, 8, 7, HAIR)         # back
    s.rect(24, 15, 8, 1, SKIN_D)      # neck line
    # face front (8..15, 8..15)
    fx, fy = 8, 8
    s.rect(fx, fy, 8, 2, HAIR)                 # fringe
    for x in (0, 1, 3, 6, 7):
        s.dot(fx + x, fy + 2, HAIR_L)          # fringe tips
    s.dot(fx + 1, fy + 4, EYE_W)
    s.dot(fx + 2, fy + 4, EYE)
    s.dot(fx + 5, fy + 4, EYE)
    s.dot(fx + 6, fy + 4, EYE_W)
    s.dot(fx + 1, fy + 5, BLUSH)
    s.dot(fx + 6, fy + 5, BLUSH)
    s.dot(fx + 2, fy + 5, MOUTH)               # wide smile
    s.dot(fx + 3, fy + 6, MOUTH)
    s.dot(fx + 4, fy + 6, MOUTH)
    s.dot(fx + 5, fy + 5, MOUTH)

    # ---- body 8x12x4 at (16,16): orange hoodie
    s.box(16, 16, 8, 12, 4, HOOD, top=HOOD_D, bottom=JEANS_D)
    s.rect(20, 20, 8, 1, HOOD_D)               # collar shadow
    for y in (21, 22, 23):                     # hoodie strings
        s.dot(21, y, WHITE)
        s.dot(26, y, WHITE)
    s.rect(21, 27, 6, 3, HOOD_D)               # front pocket
    s.rect(22, 27, 4, 1, HOOD_L)
    s.rect(20, 31, 8, 1, HOOD_D)               # hem
    s.rect(32, 20, 8, 3, HOOD_D)               # hood on the back

    # ---- arms 4x12x4: sleeves 9 rows, hands 3 rows
    for u, v in ((40, 16), (32, 48)):
        s.box(u, v, 4, 12, 4, HOOD, top=HOOD_D, bottom=SKIN)
        s.rect(u, v + 4 + 8, 16, 1, HOOD_D)    # cuff
        s.rect(u, v + 4 + 9, 16, 3, SKIN)      # hands

    # ---- legs 4x12x4: jeans 10 rows, shoes 2 rows
    for u, v in ((0, 16), (16, 48)):
        s.box(u, v, 4, 12, 4, JEANS, top=JEANS_D, bottom=SHOE)
        s.rect(u, v + 4 + 10, 16, 2, SHOE)
        s.rect(u + 4, v + 4 + 10, 4, 1, SHOE_L)  # white toe line

    return s.img


def draw_whistle():
    img = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    p = img.load()
    GOLD = (250, 196, 40, 255)
    GOLD_D = (196, 140, 20, 255)
    GOLD_L = (255, 232, 140, 255)
    HOLE = (60, 40, 20, 255)
    CORD = (230, 60, 60, 255)
    CORD_D = (170, 40, 40, 255)
    # cord loop
    for x, y in ((2, 2), (3, 1), (4, 1), (5, 1), (6, 2), (6, 3), (6, 4), (2, 3), (2, 4), (3, 5)):
        p[x, y] = CORD
    p[4, 5] = CORD_D
    # whistle body (round chamber)
    body = [
        "..XXXX..",
        ".XLLGGX.",
        "XLGGGGGX",
        "XGGHGGGX",
        "XGGGGGGX",
        ".XGGGGX.",
        "..XXXX..",
    ]
    ox, oy = 2, 6
    for j, row in enumerate(body):
        for i, ch in enumerate(row):
            c = {"X": GOLD_D, "G": GOLD, "L": GOLD_L, "H": HOLE}.get(ch)
            if c:
                p[ox + i, oy + j] = c
    # mouthpiece
    for x in range(10, 15):
        p[x, 7] = GOLD_D
        p[x, 8] = GOLD_L if x < 14 else GOLD_D
        p[x, 9] = GOLD
        p[x, 10] = GOLD_D
    p[14, 8] = GOLD_D
    p[14, 9] = GOLD_D
    return img


def draw_pack_icon(skin):
    size = 128
    img = Image.new("RGBA", (size, size), (255, 214, 150, 255))
    p = img.load()
    for x in range(size):
        for y in range(size):
            if (x // 16 + y // 16) % 2 == 0:
                p[x, y] = (255, 200, 128, 255)
    face = skin.crop((8, 8, 16, 16)).resize((96, 96), Image.NEAREST)
    img.alpha_composite(face, (16, 16))
    return img


def draw_preview(skin):
    """Front view of the whole body, for the README and the chat."""
    f = skin
    parts = [
        (f.crop((8, 8, 16, 16)), (4, 0)),     # head front
        (f.crop((20, 20, 28, 32)), (4, 8)),   # body front
        (f.crop((44, 20, 48, 32)), (0, 8)),   # right arm front (viewer's left)
        (f.crop((36, 52, 40, 64)), (12, 8)),  # left arm front
        (f.crop((4, 20, 8, 32)), (4, 20)),    # right leg front
        (f.crop((20, 52, 24, 64)), (8, 20)),  # left leg front
    ]
    fig = Image.new("RGBA", (16, 32), (0, 0, 0, 0))
    for part, pos in parts:
        fig.alpha_composite(part, pos)
    scale = 12
    fig = fig.resize((16 * scale, 32 * scale), Image.NEAREST)
    canvas = Image.new("RGBA", (16 * scale + 96, 32 * scale + 64), (250, 236, 214, 255))
    canvas.alpha_composite(fig, (48, 32))
    return canvas


def main():
    os.makedirs(os.path.join(RP, "textures", "entity"), exist_ok=True)
    os.makedirs(os.path.join(RP, "textures", "items"), exist_ok=True)
    os.makedirs(DOCS, exist_ok=True)
    skin = draw_skin()
    skin.save(os.path.join(RP, "textures", "entity", "po.png"))
    draw_whistle().save(os.path.join(RP, "textures", "items", "po_whistle.png"))
    icon = draw_pack_icon(skin)
    icon.save(os.path.join(RP, "pack_icon.png"))
    icon.save(os.path.join(BP, "pack_icon.png"))
    draw_preview(skin).save(os.path.join(DOCS, "po_preview.png"))
    print("textures written")


if __name__ == "__main__":
    main()
