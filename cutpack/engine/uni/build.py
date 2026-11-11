#!/usr/bin/env python3
"""Build one test scene page for the uni system: <project>/scene.html (+ fonts/), ready for core/render.js.

usage: build.py <project_dir> <style> <scene> [--index N] [--t0 0.5] [--t1 4.5] [--slots '{"key": "…"}']
The page = base.css + core.js + kit.js + styles/<style>.js + scenes/*.js + one play() call.
"""
import argparse, glob, json, os, shutil

UNI = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.path.dirname(UNI)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('proj'); ap.add_argument('style'); ap.add_argument('scene')
    ap.add_argument('--index', type=int, default=0)
    ap.add_argument('--t0', type=float, default=.5); ap.add_argument('--t1', type=float, default=4.5)
    ap.add_argument('--slots', default='{}')
    ap.add_argument('--speaker', type=float, default=1, help='scale the speaker from the bottom middle (test headroom like Friend\'s clips)')
    ap.add_argument('--extra', action='append', default=[], help='more scene files (e.g. recipes written by the AI), loaded after scenes/')
    ap.add_argument('--then', action='append', default=[], help='one more scene after the first: id,t0,t1[,index] (several scenes in one clip, e.g. to see the ios video card move)')
    a = ap.parse_args()
    proj = os.path.abspath(a.proj); os.makedirs(os.path.join(proj, 'fonts'), exist_ok=True)
    for f in glob.glob(os.path.join(UNI, 'fonts', '*.ttf')):
        dst = os.path.join(proj, 'fonts', os.path.basename(f))
        if not os.path.exists(dst): shutil.copy(f, dst)
    rd = lambda p: open(os.path.join(UNI, p)).read()
    # an overlay style ("card-overlay", "card-overlay-big") is its full-screen style + its overlay file (overlay.js holds the frame)
    base = a.style.split('-overlay')[0]
    styles = [f'styles/{base}.js', f'styles/{base}-overlay.js'] if '-overlay' in a.style else [f'styles/{a.style}.js']
    js = [f'const ICONS = {open(os.path.join(ENGINE, "icons", "lucide.json")).read()};', rd('core.js'), rd('kit.js'), rd('overlay.js')] + [rd(f) for f in styles] + [open(f).read() for f in sorted(glob.glob(os.path.join(UNI, 'scenes', '*.js')))] + [open(f).read() for f in a.extra]
    more = ''.join(f"play({json.dumps(m.split(',')[0])}, {float(m.split(',')[1])}, {float(m.split(',')[2])}, {{}}, {{index: {int(m.split(',')[3]) if len(m.split(',')) > 3 else k + 1}}});\n"
                   for k, m in enumerate(a.then))     # --then id,t0,t1[,index]: more scenes in the same clip
    js.append(f"""
['Lead', 'CardSans', 'KeySans', 'Hand', 'Anu'].forEach(f => div(`left:-9999px;top:0;font-family:${{f}}`, document.body, 'กขคฅ ึ่้ 0123'));
if ({a.speaker} !== 1) [V, VB].forEach(e => {{ e.style.scale = {a.speaker}; e.style.translate = `${{540 * (1 - {a.speaker})}}px ${{1920 * (1 - {a.speaker})}}px`; }});
useStyle({json.dumps(a.style)});
play({json.dumps(a.scene)}, {a.t0}, {a.t1}, {a.slots}, {{index: {a.index}}});
{more}
window.SFX = SFX;""")
    html = ('<!doctype html><html><head><meta charset="utf-8"><style>' + rd('base.css') + '</style></head><body>'
            '<div class="layer" id="BG"></div><img id="v"><img id="vb"><div class="layer" id="SC"></div><div class="layer" id="TX"></div>'
            + ''.join(f'<script>\n{s}\n</script>' for s in js) + '</body></html>')
    open(os.path.join(proj, 'scene.html'), 'w').write(html)
    print('built', os.path.join(proj, 'scene.html'))


if __name__ == '__main__':
    main()
