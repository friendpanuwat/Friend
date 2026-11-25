# jerk.py <video> <size> <page> — per design box, per data column: frame-to-frame change over time; reports spikes (a jump far above its neighbours)
import sys, subprocess, numpy as np
sys.path.insert(0, __import__('os').path.dirname(__import__('os').path.abspath(__file__)))
from motion_grid import boxes
vid, k, pg = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
W, H = 540, 960
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', vid, '-t', '4.8', '-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
F = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
names = ['01', '02', '03', '04', '05']
for col in range(3):
    for r, b in enumerate(boxes(k, pg, col)):
        x0, y0, x1, y1 = [int(v / 2) for v in b]
        D = np.abs(np.diff(F[:, y0:y1, x0:x1], axis=0)).mean(axis=(1, 2))
        for i in range(2, len(D) - 2):
            nb = np.median(np.r_[D[i-2:i], D[i+1:i+3]])
            if D[i] > 0.6 and D[i] > 3.0 * max(nb, 0.08):
                i0 = (pg - 1) * (3 if k in (4, 5, 6) else 5) + r
                print(f'size{k} p{pg} design {names[i0] if i0 < 5 else i0} col{col} t={(i+1)/30:.2f}s d={D[i]:.2f} nb={nb:.2f}')
