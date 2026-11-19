#!/usr/bin/env python3
"""Assemble <project>/deck.html = engine + deck.js, themed by brand.json.

usage: build_deck.py <project_dir> [--deck deck.js] [--brand brand.json] [--size 1080x1080]
Defaults: <project>/deck.js, <project>/brand.json (falls back to the skill's default brand), 1080x1080.
Only the width 1080 is supported; height may be 1080 (1:1), 1350 (4:5) or 1920 (9:16) — positions in deck.js are absolute,
so a deck is written for one size. Fonts named in brand.json resolve relative to the brand file, then to the skill's assets/.
"""
import json, os, re, shutil, sys

SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(SKILL, 'assets')
# engine is authored in the default palette; every occurrence is swapped for the brand value
PALETTE = {'accent': '#DDFF45', 'navy': '#14213D', 'cream': '#F2EDE2', 'ink': '#050505', 'pill': '#1B2A52'}
SLOTS = {'KeySans': 'key_sans', 'KeySerif': 'key_serif', 'Lead': 'lead', 'CardSans': 'card_sans'}


def main():
    args = sys.argv[1:]
    if not args: sys.exit(__doc__)
    proj = os.path.abspath(args[0])
    opt = dict(zip(args[1::2], args[2::2]))
    deck = opt.get('--deck', os.path.join(proj, 'deck.js'))
    bp = opt.get('--brand', os.path.join(proj, 'brand.json'))
    if not os.path.exists(bp): bp = os.path.join(ASSETS, 'brand.default.json')
    w, h = (int(x) for x in opt.get('--size', '1080x1080').lower().split('x'))
    if w != 1080 or h not in (1080, 1350, 1920): sys.exit('size must be 1080x1080, 1080x1350 or 1080x1920')
    brand = json.load(open(bp))
    html = open(os.path.join(ASSETS, 'engine_head.html')).read() + '\n' + open(deck).read() + '\n' + open(os.path.join(ASSETS, 'engine_tail.html')).read()
    html = html.replace('__H__', str(h)).replace('__HANDLE__', json.dumps(brand.get('handle', ''), ensure_ascii=False))

    os.makedirs(os.path.join(proj, 'fonts'), exist_ok=True)
    for fam, slot in SLOTS.items():
        src = brand['fonts'][slot]
        for base in (os.path.dirname(os.path.abspath(bp)), ASSETS):
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
    open(os.path.join(proj, 'deck.html'), 'w').write(html)
    open(os.path.join(proj, '.size'), 'w').write(f'{w}x{h}')
    json.dump(brand, open(os.path.join(proj, '.brand.used.json'), 'w'), ensure_ascii=False, indent=1)
    print('built', os.path.join(proj, 'deck.html'), f'{w}x{h}')


if __name__ == '__main__':
    main()
