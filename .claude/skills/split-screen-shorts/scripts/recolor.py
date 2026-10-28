#!/usr/bin/env python3
"""Paint scene.html in the colour theme, and nothing else.
1. Every stock colour the kit is drawn in maps to its role in the theme (page, surfaces, accent, text).
2. Every other colour literal left in the scene (white, black, greys, shadows, glows) snaps to the nearest theme colour,
   keeping its transparency — so the edit contains ONLY the theme's colours. The footage is never touched.
The theme is <project>/theme.json if there is one, else the skill's assets/theme.json.   usage: recolor.py <project>"""
import json, os, re, sys
proj = os.path.abspath(sys.argv[1]); here = os.path.dirname(os.path.abspath(__file__))
own = os.path.join(proj, 'theme.json')
th = json.load(open(own if os.path.exists(own) else os.path.join(here, '..', 'assets', 'theme.json')))
PAL = [c.upper() for c in th['colors']]
for k, v in th.items():
    if not k.startswith('_') and k not in ('colors', 'subtitle_shadow') and v.upper() not in PAL: sys.exit(f'theme.json: {k} = {v} is not one of "colors"')
role = {'meshD': th['page_deep'], 'meshM': th['page_mid'], 'meshL': th['page_light'], 'dark': th['surface_dark'], 'pale': th['surface_light'],
        'acc': th['accent'], 'deep': th['page_deep'], 'mid': th['page_mid'], 'light': th['page_light'],
        'tV': th['text_on_video'], 'tVk': th['text_accent_on_video'], 'tP': th['text_on_page'], 'tPk': th['text_accent_on_page']}
MAP = {'acc': 'F2481C FF7A1A FF6B2C F2443A FF9A55 FFB81A FFC21A FFD23F FF5C9A FF5CC8 FF4F8B FFE46B C8F24A',   # warm / bright accents
       'deep': '2F5BFF 2F7BFF 3D7BFF 4C7DFF 4C9BFF 1F8FFF 0B1430', 'dark': '7C5CFF 6E4BFF 0A0A0C 0B0B0E',
       'mid': '12B3C6 16B97A 17B37A', 'light': 'DCEBFF', 'pale': 'F4F1EA FFF8E8 F6F8FC',
       'meshD': '4E6E8E', 'meshM': '8FA8C2', 'meshL': 'DDE8F2', 'tV': 'F0F0F1', 'tVk': 'FA5A14', 'tP': '101112', 'tPk': 'C2410C'}
html = open(os.path.join(proj, 'scene.html')).read(); n = 0
for r, hexes in MAP.items():
    for hx in hexes.split():
        html, k = re.subn('#' + hx + r'(?![0-9A-Fa-f])', role[r], html, flags=re.I); n += k
# 2 — snap everything else to the nearest theme colour (CIE Lab distance)
def lab(r, g, b):
    def f(c): c /= 255; return ((c + .055) / 1.055) ** 2.4 if c > .04045 else c / 12.92
    R, G, B = f(r), f(g), f(b); X, Y, Z = (R * .4124 + G * .3576 + B * .1805) / .9505, R * .2126 + G * .7152 + B * .0722, (R * .0193 + G * .1192 + B * .9505) / 1.089
    g_ = lambda t: t ** (1 / 3) if t > .008856 else 7.787 * t + 16 / 116
    return 116 * g_(Y) - 16, 500 * (g_(X) - g_(Y)), 200 * (g_(Y) - g_(Z))
P = [(c, tuple(int(c[i:i + 2], 16) for i in (1, 3, 5))) for c in PAL]; PL = [(c, rgb, lab(*rgb)) for c, rgb in P]
def near(r, g, b):
    L = lab(r, g, b); return min(PL, key=lambda p: sum((a - b) ** 2 for a, b in zip(L, p[2])))
snapped = 0
def hexsub(m):
    global snapped; h = m.group(1)
    if len(h) == 3: h = ''.join(c * 2 for c in h)
    rgb = tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)); c = near(*rgb)[0]
    if c.upper() != '#' + h.upper(): snapped += 1
    return c
html = re.sub(r'(?<![&\w])#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})(?![0-9A-Za-z_])', hexsub, html)
def rgbsub(m):   # rgb(…) / rgba(…) — also the open form 'rgba(255,255,255,' that code finishes with an alpha
    global snapped; r, g, b = (int(float(x)) for x in m.group(2, 3, 4)); rgb = near(r, g, b)[1]; snapped += 1
    return f"{m.group(1)}({rgb[0]},{rgb[1]},{rgb[2]}"
html = re.sub(r'\b(rgba?)\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)', rgbsub, html)
html = re.sub(r'(?<![&\w])#([0-9A-Fa-f]{6})([0-9A-Fa-f]{2})(?![0-9A-Za-z_])', lambda m: hexsub(m) + m.group(2), html)   # #RRGGBBAA
def trip(m):
    global snapped; rgb = near(*(int(x) for x in m.group(2, 3, 4)))[1]; snapped += 1
    return f"{m.group(1)}{rgb[0]},{rgb[1]},{rgb[2]}{m.group(1)}"
html = re.sub(r"(['\"])(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\1", trip, html)   # 'r,g,b' strings handed to canvas drawings
html = html.replace('__SUBSH__', th.get('subtitle_shadow', '#000000'))   # the one colour outside the set: the subtitle shadow (the owner's call)
open(os.path.join(proj, 'scene.html'), 'w').write(html)
print(f'recolor: {n} kit colours set from the theme, {snapped} other colours snapped to it ({"project" if os.path.exists(own) else "default"} theme.json)')
