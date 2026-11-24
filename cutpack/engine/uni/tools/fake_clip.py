"""A synthetic work dir that runs the whole pipeline from step 6 on (clip_plan.py → build_only.sh → every check) with no clip of
Friend's (2026-11-24, chat ccr-7eb7a684-kfdx3f: the clips are private and not in the repo, LESSONS 30): the 42.5 s "customers"
script with its AI answers (library/uni-test/cats-ai, the old test clip's words), the stand-in speaker (library/styles/
speaker_standin.jpg, LESSONS 65) scaled about the face to play a close / normal / far shot, and a silent voice.
usage: python3 tools/fake_clip.py <work dir> <zoom>      zoom: 2.3 close (no card fits on the speaker) · 1.0 normal · 0.62 far
                                                          · 2.7 a very close shot (no room under the chin nor over the head)
then:  python3 tools/clip_plan.py <work dir> <work dir>/faces.json <style> --seed 4242
       NODE_PATH=$(npm root -g) bash tools/build_only.sh <work dir> <style> <work dir>/bo_<style>
       NODE_PATH=$(npm root -g) node tools/picture_sizes.js <work dir>/bo_<style>      (and card_sizes.js, page_frames.js)
Kept out of the repo: the work dir (put it in a scratch folder). The words are timed evenly over each line (no Typhoon), the face does
not move, and the picture of the speaker is a still: it tests the system's choices and checks, not how a real clip looks."""
import json, os, shutil, subprocess, sys
from PIL import Image

UNI = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
LIB = os.path.join(UNI, '..', '..', 'library')
T = os.path.join(LIB, 'uni-test', 'cats-ai')
W, z = os.path.abspath(sys.argv[1]), float(sys.argv[2])
if os.path.exists(W): shutil.rmtree(W)
os.makedirs(f'{W}/base/src_frames'); os.makedirs(f'{W}/cats')

# the speaker: the stand-in scaled by z about its face (540, 700); a far shot gets black round it
im = Image.open(os.path.join(LIB, 'styles', 'speaker_standin.jpg')).convert('RGB')
big = im.resize((int(1080 * z), int(1920 * z)), Image.LANCZOS); frame = Image.new('RGB', (1080, 1920))
frame.paste(big, (int(540 - 540 * z), int(700 - 700 * z))); frame.save(f'{W}/frame.jpg', quality=90)
L = json.load(open(f'{T}/ask/customers/lines.json')); lines, times, dur = L['lines'], L['times'], L['duration']
for i in range(int(dur * 30) + 2): os.symlink(f'{W}/frame.jpg', f'{W}/base/src_frames/s{i + 1:05d}.jpg')
subprocess.run(['ffmpeg', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=mono', '-t', str(dur), f'{W}/base/voice.wav'], check=True)

# the words (step 4's output): each line's words evenly over the line, one subtitle block per line
words = []
for (t0, t1), text in zip(times, lines):
    ws = text.split(' '); d = (t1 - t0) / len(ws)
    words += [{'w': w, 't0': round(t0 + k * d, 3), 't1': round(t0 + (k + 1) * d, 3)} for k, w in enumerate(ws)]
json.dump({'captions': [{'t0': a, 't1': b, 'text': t} for (a, b), t in zip(times, lines)], 'words': words, 'source': 'synthetic'},
          open(f'{W}/captions.json', 'w'), ensure_ascii=False)
# the pictures (step 5's output, checked): the old test clip's answers · the points end every 2–3 lines
shutil.copy(f'{T}/out/customers/report.json', f'{W}/cats/report.json'); shutil.copy(f'{T}/out/customers/sentences.js', f'{W}/cats/sentences.js')
json.dump({'zoom': [1, 6, 9, 15, 21], 'accent': [], 'ends': [2, 4, 7, 9, 11, 13, 16, 18, 21, 24, 26, 28, len(lines)]}, open(f'{W}/cats/camera.json', 'w'))

# the face (step 2's output): plan/faces.py on the stand-in finds [408, 478, 741, 971]; scaled the same way, every 0.5 s
b = [408, 478, 741, 971]; f = [round(540 + (b[0] - 540) * z), round(700 + (b[1] - 700) * z), round(540 + (b[2] - 540) * z), round(700 + (b[3] - 700) * z)]
layout = {'subtitleTop': 1300, 'widgetPos': {'short': {'x': 240, 'y': 150}, 'narrow': {'x': 36, 'y': 458}}, 'shortFits': True, 'shortPlace': 'top',
          'narrowFits': True, 'narrowSide': 'left', 'subOverFace': False}
json.dump({'found': 'synthetic', 'face': f, 'keepOut': f, 'layout': layout, 'track': [[round(k * .5, 1), f] for k in range(int(dur * 2) + 2)]},
          open(f'{W}/faces.json', 'w'))
print(f'{W}: zoom {z} · face {f} · {len(lines)} lines · {dur} s')
