#!/usr/bin/env python3
"""Assemble <project>/deck.html = engine + deck.js, themed by brand.json.

usage: build_deck.py <project_dir> [--deck deck.js] [--brand brand.json] [--size 1080x1080] [--theme lime]
brand.json: {"theme": "lime|glow|cobalt|ember|crimson|mono", "handle": "@x", "name": "", "logo": "", ...theme overrides}
Width is always 1080; height 1080 (1:1, default), 1350 (4:5) or 1920 (9:16). Positions in deck.js are absolute → a deck is written for one size.
"""
import json, os, shutil, sys

SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(SKILL, 'assets')
FONTS = ['Anuphan-VF.ttf', 'IBMPlexSansThai-Light.ttf', 'IBMPlexSansThai-Regular.ttf', 'IBMPlexSansThai-Medium.ttf', 'IBMPlexSansThai-SemiBold.ttf']


def main():
    args = sys.argv[1:]
    if not args: sys.exit(__doc__)
    proj = os.path.abspath(args[0])
    opt = dict(zip(args[1::2], args[2::2]))
    deck = opt.get('--deck', os.path.join(proj, 'deck.js'))
    bp = opt.get('--brand', os.path.join(proj, 'brand.json'))
    brand = json.load(open(bp if os.path.exists(bp) else os.path.join(ASSETS, 'brand.default.json')))
    name = opt.get('--theme', brand.get('theme', 'lime'))
    tp = os.path.join(ASSETS, 'themes', name + '.json')
    if not os.path.exists(tp): sys.exit(f'unknown theme {name}: choose ' + ', '.join(sorted(f[:-5] for f in os.listdir(os.path.dirname(tp)))))
    theme = json.load(open(tp))
    for k, v in brand.items():                       # brand overrides any theme key (dicts merge one level)
        if k in theme and isinstance(theme[k], dict) and isinstance(v, dict): theme[k] = {**theme[k], **v}
        elif k in theme: theme[k] = v
    w, h = (int(x) for x in opt.get('--size', '1080x1080').lower().split('x'))
    if w != 1080 or h not in (1080, 1350, 1920): sys.exit('size must be 1080x1080, 1080x1350 or 1080x1920')
    head = open(os.path.join(ASSETS, 'engine_head.html')).read()
    head = head.replace('__H__', str(h)).replace('__THEME__', json.dumps(theme, ensure_ascii=False)).replace(
        '__BRAND__', json.dumps({k: brand.get(k, '') for k in ('handle', 'name', 'logo')}, ensure_ascii=False))
    html = head + '\n' + open(deck).read() + '\n' + open(os.path.join(ASSETS, 'engine_tail.html')).read()
    os.makedirs(os.path.join(proj, 'fonts'), exist_ok=True)
    for f in FONTS:
        src, dst = os.path.join(ASSETS, 'fonts', f), os.path.join(proj, 'fonts', f)
        if not os.path.exists(dst): shutil.copy(src, dst)
    open(os.path.join(proj, 'deck.html'), 'w').write(html)
    open(os.path.join(proj, '.size'), 'w').write(f'{w}x{h}')
    json.dump({**brand, 'theme': name}, open(os.path.join(proj, '.brand.used.json'), 'w'), ensure_ascii=False, indent=1)
    print('built', os.path.join(proj, 'deck.html'), f'{w}x{h}', 'theme', name)


if __name__ == '__main__':
    main()
