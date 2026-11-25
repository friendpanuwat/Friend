"""motion_grid.py — check the motion of a seven-size sheet video: one row per design, one column per moment.

    python3 scripts/motion_grid.py <video.mp4> <size> <page> <col> <out.jpg> [times]

<size> 1–7 · <page> 1–2 · <col> 0–2 = which data column of the sheet · times default "0.5,0.8,1.1,1.4,1.7,2.0,2.4".
The crop boxes follow the layout of examples/<cat>/sheet-S1…S7.html (size 1 = one box per design with the three data stacked in it;
sizes 2, 3, 7 = 5 designs a page; 4–6 = 3 a page). Look for: things that show up early or late, a cause after its effect (A1),
overlaps, anything leaving its box mid-move (A5), floating parts with nothing under them."""
import os, subprocess, sys, tempfile
from PIL import Image

SZ = {1: (860, 230, .56), 2: (860, 470, .4), 3: (560, 490, .5), 4: (400, 635, .6), 5: (860, 710, .4), 6: (860, 965, .4), 7: (400, 500, .5)}
PER = {2: 5, 3: 5, 7: 5, 4: 3, 5: 3, 6: 3}


def boxes(k, page, col):
    W, H, s = SZ[k]; w, h = W * s, H * s; out = []
    if k == 1:
        block = 44 + 3 * (h + 30)
        for i in range(5):
            x = 540 if i == 4 else [272, 808][i % 2]; y0 = 140 + (i // 2) * (block + 14); ty = y0 + 44 + col * (h + 30); cy = ty + 26 + h / 2
            out.append((x - w / 2 - 6, cy - h / 2 - 6, x + w / 2 + 6, cy + h / 2 + 6))
        return out
    i0 = (page - 1) * PER[k]; X = [180, 540, 900][col]
    for i in range(i0, min(5, i0 + PER[k])):
        y0 = 172 + (i - i0) * (h + 94); out.append((X - w / 2 - 6, y0 - 6, X + w / 2 + 6, y0 + h + 6))
    return out


def main():
    vid, k, page, col, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
    T = (sys.argv[6] if len(sys.argv) > 6 else '0.5,0.8,1.1,1.4,1.7,2.0,2.4').split(',')
    tmp = tempfile.mkdtemp(); frames = []
    for t in T:
        f = os.path.join(tmp, t + '.png')
        subprocess.run(['ffmpeg', '-nostdin', '-v', 'error', '-y', '-ss', t, '-i', vid, '-frames:v', '1', f], check=True)
        frames.append(Image.open(f))
    bx = boxes(k, page, col); cw, ch = int(bx[0][2] - bx[0][0]), int(bx[0][3] - bx[0][1]); sc = min(1, 300 / cw)
    cw2, ch2 = int(cw * sc), int(ch * sc); G = Image.new('RGB', ((cw2 + 4) * len(T), (ch2 + 4) * len(bx)), (40, 40, 40))
    for r, b in enumerate(bx):
        for c, fr in enumerate(frames):
            G.paste(fr.crop(tuple(map(int, b))).resize((cw2, ch2)), (c * (cw2 + 4), r * (ch2 + 4)))
    G.save(out, quality=88); print(out, G.size)


if __name__ == '__main__':
    main()
