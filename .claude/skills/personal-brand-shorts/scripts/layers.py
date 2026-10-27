#!/usr/bin/env python3
"""Step 1 — copy the clip into two layers and stack them (cut-out layer on top).

usage: layers.py <project_dir> <video>

  bottom  <project>/src_frames/s%05d.jpg   the clip as-is (30 fps, 1080×1920, no colour/denoise/sharpen)
  top     <project>/fg_frames/f%05d.webp   the same frames with the background removed (RGBA)
  check   <project>/layers_check.jpg       per row: bottom · top on a checkerboard · top stacked on bottom

Background removal = two models (both Apache-2.0, fine for commercial use), CPU only:
  MediaPipe selfie-multiclass decides WHAT is the person (hair + skin + clothes; desk/mat/chair stay out),
  MODNet portrait matting gives the fine edge (hair). Light temporal smoothing stops edge flicker.
Models are read from assets/models/, or downloaded there on first use.
"""
import glob, os, subprocess, sys, urllib.request
from concurrent.futures import ProcessPoolExecutor

SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS = os.path.join(SKILL, 'assets', 'models')
URL = {
    'selfie_multiclass_256x256.tflite': 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite',
    'modnet_fp16.onnx': 'https://huggingface.co/Xenova/modnet/resolve/main/onnx/model_fp16.onnx',
}
WORKERS, THREADS = 2, 2
SMOOTH = .25          # weight of the previous frame's matte


def models():
    os.makedirs(MODELS, exist_ok=True)
    for f, u in URL.items():
        p = os.path.join(MODELS, f)
        if not os.path.exists(p):
            print('downloading', f); urllib.request.urlretrieve(u, p + '.part'); os.rename(p + '.part', p)


def matte_range(args):
    import numpy as np, cv2, onnxruntime as ort
    from ai_edge_litert.interpreter import Interpreter
    proj, files = args
    mc = Interpreter(model_path=os.path.join(MODELS, 'selfie_multiclass_256x256.tflite'), num_threads=THREADS); mc.allocate_tensors()
    mi, mo = mc.get_input_details()[0]['index'], mc.get_output_details()[0]['index']
    so = ort.SessionOptions(); so.intra_op_num_threads = THREADS
    mn = ort.InferenceSession(os.path.join(MODELS, 'modnet_fp16.onnx'), so, providers=['CPUExecutionProvider'])
    prev = None
    for f in files:
        bgr = cv2.imread(f); h, w = bgr.shape[:2]; rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
        # what is the person: P(hair) + P(body skin) + P(face skin) + P(clothes)
        x = cv2.resize(rgb, (256, 256), interpolation=cv2.INTER_AREA).astype(np.float32) / 255
        mc.set_tensor(mi, x[None]); mc.invoke(); o = mc.get_tensor(mo)[0]
        e = np.exp(o - o.max(-1, keepdims=True)); person = (e[..., 1:5].sum(-1) / e.sum(-1))
        gate = cv2.GaussianBlur(cv2.resize((person > .5).astype(np.float32), (w, h)), (0, 0), 8)
        # fine edge
        y = cv2.resize(rgb, (512, 896), interpolation=cv2.INTER_AREA).astype(np.float32)
        y = ((y / 255 - .5) / .5).transpose(2, 0, 1)[None]
        mat = cv2.resize(mn.run(None, {'input': y})[0][0, 0], (w, h))
        a = np.clip(np.minimum(mat, np.clip(gate * 1.4, 0, 1)), 0, 1)
        # close small holes inside the body (dark sleeves/shadows can read as background)
        solid = cv2.morphologyEx((a > .5).astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25)))
        a = np.maximum(a, cv2.GaussianBlur(solid.astype(np.float32), (0, 0), 1.5) * (solid > 0))
        if prev is not None: a = (1 - SMOOTH) * a + SMOOTH * prev
        prev = a
        bgra = np.dstack([bgr, (a * 255 + .5).astype(np.uint8)])
        n = os.path.basename(f)[1:-4]
        cv2.imwrite(os.path.join(proj, 'fg_frames', f'f{n}.webp'), bgra, [cv2.IMWRITE_WEBP_QUALITY, 95])
    return len(files)


def check(proj, n):
    import numpy as np, cv2
    rows = []
    for i in np.linspace(0, n - 1, 4).astype(int):
        bg = cv2.imread(os.path.join(proj, 'src_frames', f's{i + 1:05d}.jpg'))
        fg = cv2.imread(os.path.join(proj, 'fg_frames', f'f{i + 1:05d}.webp'), cv2.IMREAD_UNCHANGED)
        a = fg[..., 3:4] / 255.0; h, w = bg.shape[:2]
        chk = ((np.indices((h, w)).sum(0) // 40) % 2 * 80 + 100).astype(np.uint8)[..., None].repeat(3, 2)
        top = (fg[..., :3] * a + chk * (1 - a)).astype(np.uint8)
        stack = (fg[..., :3] * a + bg * (1 - a)).astype(np.uint8)
        rows.append(np.hstack([cv2.resize(im, (270, 480), interpolation=cv2.INTER_AREA) for im in (bg, top, stack)]))
    cv2.imwrite(os.path.join(proj, 'layers_check.jpg'), np.vstack([np.hstack(rows[:2]), np.hstack(rows[2:])]), [cv2.IMWRITE_JPEG_QUALITY, 88])


def main():
    if len(sys.argv) < 3: sys.exit(__doc__)
    proj, video = os.path.abspath(sys.argv[1]), sys.argv[2]
    models()
    # bottom layer: plain copy of the clip
    for d in ('src_frames', 'fg_frames'):
        subprocess.run(['rm', '-rf', os.path.join(proj, d)]); os.makedirs(os.path.join(proj, d))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', video, '-vf',
                    'fps=30,scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920',
                    '-q:v', '2', os.path.join(proj, 'src_frames', 's%05d.jpg')], check=True)
    files = sorted(glob.glob(os.path.join(proj, 'src_frames', 's*.jpg')))
    # top layer: same frames, background removed — contiguous ranges per worker (temporal smoothing needs order)
    k = (len(files) + WORKERS - 1) // WORKERS
    with ProcessPoolExecutor(WORKERS) as ex:
        done = sum(ex.map(matte_range, [(proj, files[i:i + k]) for i in range(0, len(files), k)]))
    check(proj, len(files))
    print(f'layers: bottom {len(files)} frames (src_frames/) · top {done} frames (fg_frames/, background removed)')
    print(f'check sheet: {proj}/layers_check.jpg')


if __name__ == '__main__':
    main()
