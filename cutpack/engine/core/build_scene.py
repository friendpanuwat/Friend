#!/usr/bin/env python3
"""Assemble <project>/scene.html = engine + style pack + timeline, themed by brand.json.

CutPack copy of the talking-head-editorial build step. Differences from the skill:
  * ICONS holds the whole Lucide set (engine/icons/lucide.json); the skill's own icon paths win where names overlap,
    so every icon the skill used looks exactly the same.
  * the style pack (engine/styles/<style>/motion.js, then parts/*.js, then widgets/*.js, in name order) is inserted before the timeline.

usage: build_scene.py <project_dir> [--style editorial] [--timeline timeline.js] [--brand brand.json]
"""
import glob, json, os, re, shutil, sys

CORE = os.path.dirname(os.path.abspath(__file__))
ENGINE = os.path.dirname(CORE)
PALETTE = {'accent': '#DDFF45', 'navy': '#14213D', 'cream': '#F2EDE2', 'ink': '#050505', 'pill': '#1B2A52'}
SLOTS = {'KeySans': 'key_sans', 'KeySerif': 'key_serif', 'Lead': 'lead', 'CardSans': 'card_sans'}


def style_pack(style):
    d = os.path.join(ENGINE, 'styles', style)
    if not os.path.isdir(d): sys.exit(f'unknown style: {style}')
    # packs/ = content-category packs (business, finance …): props that redraw a base part and hero parts of their own
    files = [os.path.join(d, 'motion.js')] + sorted(glob.glob(os.path.join(d, 'parts', '*.js'))) + sorted(glob.glob(os.path.join(d, 'packs', '*.js'))) \
        + sorted(glob.glob(os.path.join(d, 'widgets', '*.js')))
    return '\n'.join(f'/* ---- {os.path.relpath(f, ENGINE)} ---- */\n' + open(f).read() for f in files if os.path.exists(f))


def main():
    args = sys.argv[1:]
    if not args: sys.exit(__doc__)
    proj = os.path.abspath(args[0])
    opt = dict(zip(args[1::2], args[2::2]))
    tl = opt.get('--timeline', os.path.join(proj, 'timeline.js'))
    bp = opt.get('--brand', os.path.join(proj, 'brand.json'))
    if not os.path.exists(bp): bp = os.path.join(CORE, 'brand.default.json')
    brand = json.load(open(bp))

    head = open(os.path.join(CORE, 'engine_head.html')).read()
    lucide = open(os.path.join(ENGINE, 'icons', 'lucide.json')).read()
    head, n = re.subn(r'const ICONS = (\{.*?\});\n', lambda m: 'const ICONS = Object.assign(%s, %s);\n' % (lucide, m.group(1)), head, count=1, flags=re.S)
    if n != 1: sys.exit('ICONS line not found in engine_head.html')
    html = head + '\n' + style_pack(opt.get('--style', 'editorial')) + '\n' + open(tl).read() + '\n' + open(os.path.join(CORE, 'engine_tail.html')).read()

    os.makedirs(os.path.join(proj, 'fonts'), exist_ok=True)
    for fam, slot in SLOTS.items():
        src = brand['fonts'][slot]
        for base in (os.path.dirname(os.path.abspath(bp)), CORE):
            cand = os.path.join(base, src)
            if os.path.exists(cand): break
        else:
            sys.exit(f'font not found for {slot}: {src}')
        dst = os.path.join('fonts', os.path.basename(cand))
        out = os.path.join(proj, dst)
        if not (os.path.exists(out) and os.path.samefile(cand, out)): shutil.copy(cand, out)
        html = re.sub(r'(@font-face\{font-family:"%s";src:url\()[^)]*(\))' % fam, r'\g<1>%s\2' % dst, html)

    for key, default in PALETTE.items():
        html = re.sub(re.escape(default), brand.get(key, default), html, flags=re.I)
    open(os.path.join(proj, 'scene.html'), 'w').write(html)
    json.dump(brand, open(os.path.join(proj, '.brand.used.json'), 'w'), ensure_ascii=False, indent=1)
    print('built', os.path.join(proj, 'scene.html'))


if __name__ == '__main__':
    main()
