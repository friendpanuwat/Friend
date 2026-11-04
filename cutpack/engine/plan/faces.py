#!/usr/bin/env python3
"""Find the speaker's face in a clip and work out where subtitles and widgets may go (writes faces.json).

usage: faces.py <src_frames_dir> <out.json> [--every 15]
src_frames_dir = the 1080×1920 frames from `pipeline.sh … frames` (s00001.jpg …).

Face finder: OpenCV YuNet (engine/models/face_detection_yunet_2023mar.onnx, MIT) at 540×960, score ≥ 0.3 — the normal
0.6 missed the blurred face of Friend's sample clip. Frames are sampled every `--every` frames (default 15 = 0.5 s);
the face box used is the union of the 5th–95th percentile edges over all samples (the speaker moves), plus a margin.
No face found at all → a wide safe box in the middle of the frame, and `found` says so.

Layout (1080×1920, decisions in DECISIONS.md). The keep-out box is the face box grown by the biggest zoom the camera may
reach (CAM.max 1.08 × breathing 1.014, around the video's transform-origin 50% 45%), so nothing covers the face even
mid-push (the overlay skill: "ไม่บังหน้าแม้ตอนซูม"). Hair may sit under a widget; the face may not.
  subtitleTop  = max(1300, zoomed chin + 40), at most 1380 so it ends above the app's bottom bar; a lower chin → `subOverFace`
  short widget = 600×190, centred on the face, in the first place that has room (Friend 2026-11-04):
                 1. above the head: y 150 (under the app's top bar), if it ends 20 px above the face
                 2. at chest level, when the head is at the top edge: centred between the chin (+40, zoomed) and the
                    subtitles (−20); it may cover the hands, never the face. `shortPlace` says which (top | chest | none)
                    If the chest is a little too short, the subtitles move down (at most to 1380) to make the room.
  narrow widget= 210×380 beside the face (left if there is room, else right), level with the brow; never in the app's
                 right-hand button strip (x > 940 from y 860 to 1620)
"""
import glob, json, os, sys
import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = os.path.join(HERE, '..', 'models', 'face_detection_yunet_2023mar.onnx')
W, H = 1080, 1920
TOPBAR, RIGHT_UI, RIGHT_Y, BOTTOM_UI = 150, 940, (860, 1620), 1620
SHORT, NARROW = (600, 190), (210, 380)
SUB_TOP_MIN, SUB_TOP_MAX = 1300, 1380
ZMAX, ORIGIN = 1.08 * 1.014, (540, 864)   # CAM.max × (1 + CAM.breath) in motion.js; transform-origin 50% 45% in engine_head.html

def detect(frames_dir, every=15):
    files = sorted(glob.glob(os.path.join(frames_dir, 's*.jpg')))[::every]
    det = cv2.FaceDetectorYN.create(MODEL, '', (540, 960), 0.3, 0.3, 5000)
    boxes = []
    for f in files:
        im = cv2.resize(cv2.imread(f), (540, 960))
        _, faces = det.detect(im)
        if faces is None or not len(faces): continue
        x, y, w, h = (faces[np.argmax(faces[:, -1])][:4] * 2).tolist()   # the most confident face, back to 1080×1920
        boxes.append([x, y, x + w, y + h])
    return files, boxes


def zoomed(box, z=ZMAX):
    ox, oy = ORIGIN
    return [ox + (box[0] - ox) * z, oy + (box[1] - oy) * z, ox + (box[2] - ox) * z, oy + (box[3] - oy) * z]


def layout(boxes, n_samples):
    if boxes:
        b = np.array(boxes)
        x0, y0 = np.percentile(b[:, 0], 5), np.percentile(b[:, 1], 5)
        x1, y1 = np.percentile(b[:, 2], 95), np.percentile(b[:, 3], 95)
        m = .06 * (x1 - x0)
        face = [max(0, x0 - m), max(0, y0 - m), min(W, x1 + m), min(H, y1 + m)]
    else:
        face = [300, 420, 780, 1000]   # no face found: a safe box in the middle that still leaves both widget places free
    keep = zoomed(face)
    kx0, ky0, kx1, ky1 = keep
    sub_top = min(SUB_TOP_MAX, max(SUB_TOP_MIN, ky1 + 40))
    sx = int(min(max(40, (kx0 + kx1) / 2 - SHORT[0] / 2), RIGHT_UI - SHORT[0]))
    band0, band1 = ky1 + 40, sub_top - 20   # chest: below the (zoomed) chin, above the subtitles
    if TOPBAR + SHORT[1] + 20 > ky0 and band1 - band0 < SHORT[1] and band0 + SHORT[1] + 20 <= SUB_TOP_MAX:
        sub_top = band0 + SHORT[1] + 20; band1 = sub_top - 20   # no room above the head: let the subtitles down (≤ 1380) to open the chest
    if TOPBAR + SHORT[1] + 20 <= ky0: short, place = {'x': sx, 'y': TOPBAR}, 'top'
    elif band1 - band0 >= SHORT[1]: short, place = {'x': sx, 'y': round(band0 + (band1 - band0 - SHORT[1]) / 2)}, 'chest'
    else: short, place = {'x': sx, 'y': TOPBAR}, 'none'
    ny = int(max(TOPBAR + 10, min(ky0 + 40, sub_top - 20 - NARROW[1])))
    right_max = RIGHT_UI if ny + NARROW[1] > RIGHT_Y[0] else W - 36   # the button strip only matters at its own height
    if kx0 - 20 >= 36 + NARROW[0]: narrow, side = {'x': 36, 'y': ny}, 'left'
    elif kx1 + 20 + NARROW[0] <= right_max: narrow, side = {'x': int(kx1 + 20), 'y': ny}, 'right'
    else: narrow, side = {'x': 36, 'y': ny}, 'none'
    return {
        'found': f'{len(boxes)}/{n_samples}',
        'face': [round(v) for v in face], 'keepOut': [round(v) for v in keep],
        'layout': {'subtitleTop': round(sub_top), 'widgetPos': {'short': short, 'narrow': narrow},
                   'shortFits': place != 'none', 'shortPlace': place, 'narrowFits': side != 'none', 'narrowSide': side, 'subOverFace': bool(ky1 + 20 > sub_top)},
        'zones': {'topBar': [0, 0, W, TOPBAR], 'rightUI': [RIGHT_UI, RIGHT_Y[0], W, RIGHT_Y[1]], 'bottomUI': [0, BOTTOM_UI, W, H]},
    }

if __name__ == '__main__':
    args = sys.argv[1:]
    every = int(args[args.index('--every') + 1]) if '--every' in args else 15
    files, boxes = detect(args[0], every)
    out = layout(boxes, len(files))
    json.dump(out, open(args[1], 'w'), indent=1)
    print(json.dumps(out))
