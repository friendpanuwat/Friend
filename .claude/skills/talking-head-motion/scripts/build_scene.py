#!/usr/bin/env python3
"""Assemble <project>/scene.html = engine + timeline, themed by brand.json.

usage: build_scene.py <project_dir> [--timeline timeline.js] [--brand brand.json]
Defaults: <project>/timeline.js and <project>/brand.json (falls back to the skill's default brand).
Fonts named in brand.json are resolved relative to the brand file, then to the skill's assets/.
"""
import json, os, re, shutil, sys

SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(SKILL, 'assets')


def hex2rgb(h):
    h = h.lstrip('#')
    if len(h) == 3: h = ''.join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def main():
    args = sys.argv[1:]
    if not args: sys.exit(__doc__)
    proj = os.path.abspath(args[0])
    opt = dict(zip(args[1::2], args[2::2]))
    tl = opt.get('--timeline', os.path.join(proj, 'timeline.js'))
    bp = opt.get('--brand', os.path.join(proj, 'brand.json'))
    if not os.path.exists(bp): bp = os.path.join(ASSETS, 'brand.default.json')
    brand = json.load(open(bp))
    head = open(os.path.join(ASSETS, 'engine_head.html')).read()
    tail = open(os.path.join(ASSETS, 'engine_tail.html')).read()
    timeline = open(tl).read()
    html = head + '\n' + timeline + '\n' + tail

    # --- fonts: copy into <project>/fonts and point @font-face at them
    os.makedirs(os.path.join(proj, 'fonts'), exist_ok=True)
    slots = {'KeyFont': 'key', 'MidFont': 'mid', 'BodyFont': 'body', 'SmallFont': 'small'}
    for fam, slot in slots.items():
        src = brand['fonts'][slot]
        for base in (os.path.dirname(os.path.abspath(bp)), ASSETS):
            cand = os.path.join(base, src)
            if os.path.exists(cand): break
        else:
            sys.exit(f'font not found for {slot}: {src}')
        dst = os.path.join('fonts', os.path.basename(cand))
        shutil.copy(cand, os.path.join(proj, dst))
        html = re.sub(r'(@font-face\{font-family:"%s";src:url\()[^)]*(\))' % fam, r'\g<1>%s\2' % dst, html)

    # --- colours: the engine is authored in the v9 palette; swap every form of each colour
    acc, acc2, ink, txt = (brand[k] for k in ('accent', 'accent2', 'ink', 'text'))
    a, a2, i = hex2rgb(acc), hex2rgb(acc2), hex2rgb(ink)
    tint = tuple(round(c + (255 - c) * .6) for c in a)
    rep = [('#8FD3FF', acc), ('#4E9BFF', acc2), ('#05070D', ink),
           ('143,211,255', '%d,%d,%d' % a), ('78,155,255', '%d,%d,%d' % a2), ('200,235,255', '%d,%d,%d' % tint),
           ('rgba(${170 + d * 85},${215 + d * 40},255,', 'rgba(${%d + d * %d},${%d + d * %d},${%d + d * %d},' % (a[0], 255 - a[0], a[1], 255 - a[1], a[2], 255 - a[2]))]
    for old, new in rep:
        html = re.sub(re.escape(old), new, html, flags=re.I)
    css_end = html.index('</style>')
    html = html[:css_end].replace('color:#fff', 'color:%s' % txt) + html[css_end:]
    html = html.replace("#grain{opacity:.07;", "#grain{opacity:%s;" % brand.get('grain', .07))
    open(os.path.join(proj, 'scene.html'), 'w').write(html)
    json.dump(brand, open(os.path.join(proj, '.brand.used.json'), 'w'), ensure_ascii=False, indent=1)
    print('built', os.path.join(proj, 'scene.html'))


if __name__ == '__main__':
    main()
