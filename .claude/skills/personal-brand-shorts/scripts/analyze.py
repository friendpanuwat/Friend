#!/usr/bin/env python3
"""Find the dead air, cut it out, and move the captions onto the new timeline.

usage: analyze.py <project_dir> [--srt FILE] [--pace natural|fast|tight|off] [--cut "a-b,c-d"] [--crop-x 0.5] [--db -40]

  <project>/input.*   source clip (from fetch_video.sh)
  --srt               .srt (CapCut export) or plain lines "MM:SS text". Optional — without it there are no captions.
  --pace              how hard to cut silences (default natural). off = keep every pause.
  --cut               extra ranges to remove, in ORIGINAL clip seconds (retakes, mistakes): "12.4-15.0,31-33.2"
  --crop-x            horizontal centre of the 9:16 crop for landscape/square sources (0 = left edge … 1 = right edge)
  --db                silence threshold in dBFS (default: measured loudness − 18 dB)

Writes:
  cut.mp4         1080×1920 · 30 fps · silences removed (also what the user can watch as the "rough cut")
  cut.wav         the same audio as PCM (input for the audio step)
  cuts.json       {"keep": [[a, b], ...] original seconds, "dur_in", "dur_out"}
  captions.json   [[start, end, "text", orig_start], ...] on the NEW timeline
  captions.md     table to plan from
  sheet.jpg       contact sheet of cut.mp4, one frame every 2 s, time-stamped
"""
import json, os, re, subprocess, sys, glob

FPS = 30
PACE = {  # min silence to cut (s), speech padding kept on each side (s)
    'natural': (0.45, 0.14),
    'fast':    (0.32, 0.09),
    'tight':   (0.22, 0.06),
}
SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def ts(s):
    s = s.strip().replace(',', '.')
    p = [float(x) for x in s.split(':')]
    return p[0] * 3600 + p[1] * 60 + p[2] if len(p) == 3 else p[0] * 60 + p[1]


def parse_transcript(path):
    raw = open(path, encoding='utf-8-sig').read()
    rows = []
    if '-->' in raw:
        for blk in re.split(r'\n\s*\n', raw.strip()):
            lines = [l for l in blk.splitlines() if l.strip()]
            for i, l in enumerate(lines):
                if '-->' in l:
                    a, b = l.split('-->')
                    txt = ' '.join(lines[i + 1:]).strip()
                    txt = re.sub(r'<[^>]+>', '', txt)
                    if txt: rows.append([ts(a), ts(b), txt])
                    break
        return rows
    for l in raw.splitlines():
        m = re.match(r'\s*(\d{1,2}:\d{2}(?::\d{2})?(?:[.,]\d+)?)\s+(.+)', l)
        if m: rows.append([ts(m.group(1)), None, m.group(2).strip()])
    for k, r in enumerate(rows):   # plain lines: a line lasts until the next one starts
        if r[1] is None: r[1] = rows[k + 1][0] - .02 if k + 1 < len(rows) else r[0] + 1.5
    return rows


def probe(path):
    r = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:stream_side_data=rotation:format=duration', '-of', 'json', path])
    d = json.loads(r.stdout)
    st = d['streams'][0]
    w, h = st['width'], st['height']
    rot = 0
    for sd in st.get('side_data_list', []) or []:
        if 'rotation' in sd: rot = abs(int(sd['rotation']))
    if rot in (90, 270): w, h = h, w
    return float(d['format']['duration']), w, h


def loudness(path):
    r = run(['ffmpeg', '-i', path, '-vn', '-af', 'highpass=f=100,ebur128', '-f', 'null', '-'])
    m = re.findall(r'I:\s+(-?[0-9.]+) LUFS', r.stderr)
    return float(m[-1]) if m else -23.0


def silences(path, db, min_d):
    r = run(['ffmpeg', '-i', path, '-vn', '-af', f'highpass=f=100,lowpass=f=6000,silencedetect=n={db}dB:d={min_d}', '-f', 'null', '-'])
    starts = [float(x) for x in re.findall(r'silence_start: (-?[0-9.]+)', r.stderr)]
    ends = [float(x) for x in re.findall(r'silence_end: ([0-9.]+)', r.stderr)]
    out = []
    for i, s in enumerate(starts):
        out.append([max(0.0, s), ends[i] if i < len(ends) else None])
    return out


def snap(t):
    return round(round(t * FPS) / FPS, 4)


def main():
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    proj = os.path.abspath(a[0])
    opt = dict(zip(a[1::2], a[2::2]))
    src = sorted(glob.glob(os.path.join(proj, 'input.*')))
    if not src: sys.exit(f'no input.* in {proj} — run fetch_video.sh first')
    src = src[0]
    dur, w, h = probe(src)
    pace = opt.get('--pace', 'natural')
    crop_x = float(opt.get('--crop-x', 0.5))
    lufs = loudness(src)
    db = float(opt.get('--db', max(-55, min(-28, lufs - 18))))

    # 1) speech = complement of silence; keep it with a little padding
    if pace == 'off':
        keep = [[0.0, dur]]
        sil = []
    else:
        min_d, pad = PACE[pace]
        sil = silences(src, db, min_d)
        keep, cur = [], 0.0
        for s, e in sil:
            e = dur if e is None else e
            if s > cur: keep.append([cur, s])
            cur = e
        if cur < dur: keep.append([cur, dur])
        keep = [[max(0, x - pad), min(dur, y + pad)] for x, y in keep]
        # leading/trailing air: keep only a breath
        if keep: keep[0][0] = max(keep[0][0], 0.0)
    # 2) user cuts (original seconds)
    for rng in filter(None, opt.get('--cut', '').split(',')):
        c0, c1 = (float(x) for x in rng.split('-'))
        nk = []
        for x, y in keep:
            if y <= c0 or x >= c1: nk.append([x, y])
            else:
                if x < c0: nk.append([x, c0])
                if y > c1: nk.append([c1, y])
        keep = nk
    # 3) merge overlaps, snap to the 30 fps grid (audio and video then cut at identical times → no drift), drop crumbs
    keep.sort()
    merged = []
    for x, y in keep:
        x, y = snap(x), snap(y)
        if merged and x <= merged[-1][1] + 1 / FPS: merged[-1][1] = max(merged[-1][1], y)
        else: merged.append([x, y])
    keep = [[x, y] for x, y in merged if y - x >= 0.2]
    if not keep: sys.exit('nothing left after cutting — try --pace off or a lower --db')
    dur_out = round(sum(y - x for x, y in keep), 3)

    def remap(t):
        n = 0.0
        for x, y in keep:
            if t <= x: break
            n += min(t, y) - x
        return round(n, 3)

    # 4) render the rough cut: CFR 30 fps, 1080×1920, per-segment 10 ms audio fades (no clicks at joins)
    if w / h > 1080 / 1920 + .01:     # wider than 9:16 → crop horizontally around crop_x
        vf = f"scale=-2:1920:flags=lanczos,crop=1080:1920:'max(0,min(iw-1080,iw*{crop_x}-540))':0"
    else:
        vf = 'scale=1080:-2:flags=lanczos,crop=1080:1920'
    n = len(keep)
    fc = f'[0:v]fps={FPS},{vf},setsar=1,split={n}' + ''.join(f'[vs{i}]' for i in range(n)) + ';'
    fc += f'[0:a]aresample=48000,asplit={n}' + ''.join(f'[as{i}]' for i in range(n)) + ';'
    for i, (x, y) in enumerate(keep):
        L = y - x
        fc += f'[vs{i}]trim=start={x}:end={y},setpts=PTS-STARTPTS[v{i}];'
        fc += f'[as{i}]atrim=start={x}:end={y},asetpts=PTS-STARTPTS,afade=t=in:d=0.01,afade=t=out:st={max(0, L - 0.012):.3f}:d=0.012[a{i}];'
    fc += ''.join(f'[v{i}][a{i}]' for i in range(n)) + f'concat=n={n}:v=1:a=1[v][a]'
    open(os.path.join(proj, 'cut_filter.txt'), 'w').write(fc)
    r = run(['ffmpeg', '-y', '-loglevel', 'error', '-i', src, '-filter_complex_script', os.path.join(proj, 'cut_filter.txt'),
             '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '15', '-pix_fmt', 'yuv420p',
             '-c:a', 'pcm_s16le', os.path.join(proj, 'cut.mov')])
    if r.returncode: sys.exit('ffmpeg cut failed:\n' + r.stderr[-2000:])
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', os.path.join(proj, 'cut.mov'), '-vn', '-c:a', 'pcm_s16le', os.path.join(proj, 'cut.wav')])
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', os.path.join(proj, 'cut.mov'), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', os.path.join(proj, 'cut.mp4')])
    os.remove(os.path.join(proj, 'cut.mov'))

    # 5) captions on the new timeline
    caps, dropped = [], []
    if opt.get('--srt'):
        for s, e, txt in parse_transcript(opt['--srt']):
            ns, ne = remap(s), remap(e)
            if ne - ns < 0.12: dropped.append((s, e, txt)); continue
            caps.append([ns, ne, txt, round(s, 2)])
        caps.sort()
        for k in range(len(caps) - 1):   # no overlaps
            caps[k][1] = min(caps[k][1], caps[k + 1][0])
    json.dump(caps, open(os.path.join(proj, 'captions.json'), 'w'), ensure_ascii=False, indent=0)
    json.dump({'keep': keep, 'dur_in': round(dur, 3), 'dur_out': dur_out, 'pace': pace, 'db': db,
               'cuts_new': [remap(x) for x, _ in keep[1:]]}, open(os.path.join(proj, 'cuts.json'), 'w'), indent=0)
    with open(os.path.join(proj, 'captions.md'), 'w') as f:
        f.write('| # | start | end | text | (orig) |\n|---|---|---|---|---|\n')
        for i, (s, e, t, o) in enumerate(caps): f.write(f'| {i} | {s:.2f} | {e:.2f} | {t} | {o:.2f} |\n')
        if dropped:
            f.write('\n**ตัดออกทั้งประโยค (อยู่ในช่วงที่ถูกตัด):**\n\n')
            for s, e, t in dropped: f.write(f'- {s:.2f}–{e:.2f} {t}\n')

    # 6) contact sheet with timestamps
    font = os.path.join(SKILL, 'assets', 'fonts', 'Anuphan-VF.ttf')
    cols = 8
    rows = max(1, int((dur_out / 2 + cols - 1) // cols))
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', os.path.join(proj, 'cut.mp4'), '-vf',
         f"fps=1/2,scale=180:320,drawtext=fontfile={font}:text='%{{pts\\:hms}}':x=6:y=6:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6,tile={cols}x{rows}",
         '-frames:v', '1', os.path.join(proj, 'sheet.jpg')])

    print(f'input {dur:.1f}s ({w}x{h}) → cut {dur_out:.1f}s  ·  removed {dur - dur_out:.1f}s ({100 * (dur - dur_out) / dur:.0f}%) in {len(keep) - 1} jump cuts  ·  pace={pace} threshold={db:.0f} dB')
    print(f'captions: {len(caps)} lines' + (f' ({len(dropped)} dropped inside cuts)' if dropped else '') + (' — NO TRANSCRIPT, captions off' if not opt.get('--srt') else ''))
    print(f'→ {proj}/cut.mp4  captions.md  sheet.jpg')


if __name__ == '__main__':
    main()
