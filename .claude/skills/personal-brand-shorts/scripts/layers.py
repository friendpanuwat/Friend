#!/usr/bin/env python3
"""Step 1 — copy the clip into two layers and stack them (cut-out layer on top).

usage: layers.py <project_dir> <video>
       layers.py <project_dir> --plate     (re-make plate.jpg only)

  bottom  <project>/src_frames/s%05d.jpg   the clip as-is (30 fps, 1080×1920, no colour/denoise/sharpen)
  top     <project>/fg_frames/f%05d.webp   the same frames with the background removed (RGBA)
  plate   <project>/plate.jpg              the background with the person removed (median of the visible background,
                                           holes inpainted) — used by effects that move the background on its own (vertigo)
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
        if prev is not None: a = (1 - SMOOTH) * a + SMOOTH * prev
        prev = a
        bgra = np.dstack([bgr, (a * 255 + .5).astype(np.uint8)])
        n = os.path.basename(f)[1:-4]
        cv2.imwrite(os.path.join(proj, 'fg_frames', f'f{n}.webp'), bgra, [cv2.IMWRITE_WEBP_QUALITY, 95])
    return len(files)


def plate(proj, n, samples=40):
    """Clean background plate: per-pixel median of the background where the person is NOT, over the clip.
    Pixels the person always covers are inpainted. Assumes a locked-off camera (talking head on a tripod)."""
    import numpy as np, cv2
    idx = np.linspace(0, n - 1, min(samples, n)).astype(int)
    imgs, masks = [], []
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (61, 61))
    for i in idx:
        imgs.append(cv2.imread(os.path.join(proj, 'src_frames', f's{i + 1:05d}.jpg')))
        a = cv2.imread(os.path.join(proj, 'fg_frames', f'f{i + 1:05d}.webp'), cv2.IMREAD_UNCHANGED)[..., 3]
        masks.append(cv2.dilate((a > 8).astype(np.uint8), k))      # person + 30 px safety margin
    imgs, masks = np.stack(imgs), np.stack(masks).astype(bool)
    h, w = imgs.shape[1:3]
    out = np.zeros((h, w, 3), np.uint8); hole = np.zeros((h, w), np.uint8)
    for y in range(0, h, 64):
        st = imgs[:, y:y + 64].astype(np.float32); m = masks[:, y:y + 64]
        st[m] = np.nan
        with np.errstate(all='ignore'):
            import warnings; warnings.simplefilter('ignore')
            med = np.nanmedian(st, axis=0)
        seen = (~m).sum(0)   # a pixel needs the background visible in ≥ 30% of samples, else it is a hole
        med[seen < .3 * len(idx)] = np.nan
        hole[y:y + 64] = np.isnan(med[..., 0]).astype(np.uint8)
        out[y:y + 64] = np.nan_to_num(med).astype(np.uint8)
    if hole.any():   # holes: inpaint at 1/8 size, upscale, soften — reads as out-of-focus background, never as a person
        q = (w // 8, h // 8)
        sm = cv2.inpaint(cv2.resize(out, q, interpolation=cv2.INTER_AREA), cv2.dilate(cv2.resize(hole, q, interpolation=cv2.INTER_NEAREST), np.ones((3, 3), np.uint8)), 6, cv2.INPAINT_TELEA)
        sm = cv2.GaussianBlur(cv2.resize(sm, (w, h), interpolation=cv2.INTER_CUBIC), (0, 0), 18)
        soft = cv2.GaussianBlur(cv2.dilate(hole, np.ones((41, 41), np.uint8)).astype(np.float32), (0, 0), 14)[..., None]
        out = (sm * soft + out * (1 - soft)).astype(np.uint8)
    cv2.imwrite(os.path.join(proj, 'plate.jpg'), out, [cv2.IMWRITE_JPEG_QUALITY, 92])
    return round(100 * hole.mean(), 1)


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
    if video == '--plate':
        n = len(glob.glob(os.path.join(proj, 'src_frames', 's*.jpg')))
        print(f'plate: {proj}/plate.jpg ({plate(proj, n)}% inpainted)'); return
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
    holes = plate(proj, len(files))
    print(f'layers: bottom {len(files)} frames (src_frames/) · top {done} frames (fg_frames/, background removed)')
    print(f'plate: {proj}/plate.jpg (background without the person, {holes}% inpainted)')
    print(f'check sheet: {proj}/layers_check.jpg')


if __name__ == '__main__':
    main()
