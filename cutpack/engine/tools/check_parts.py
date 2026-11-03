#!/usr/bin/env python3
"""Check style-pack parts against the locked-motion rules (DECISIONS 3 and 5).

A part may move things only through mv.* and the kit helpers; it may not invent motion or use randomness:
  forbidden in parts/*.js: A(  .animate(  cubic-bezier  Math.random  Date.now  new Date  performance.now
Every PART(...) must declare meta with bgs, slots, dur and hit.
usage: check_parts.py [style]   (default editorial) — exit 1 on any problem
"""
import os, re, sys

ENGINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BANNED = [(r'(?<![\w.])A\(', 'A( — use mv.*'), (r'\.animate\(', '.animate( — use mv.*'), (r'cubic-bezier', 'cubic-bezier — curves live in motion.js'),
          (r'Math\.random', 'Math.random — parts must be deterministic'), (r'Date\.now|new Date|performance\.now', 'clock — parts must be deterministic')]


def main():
    style = sys.argv[1] if len(sys.argv) > 1 else 'editorial'
    d = os.path.join(ENGINE, 'styles', style, 'parts')
    bad, n = [], 0
    for f in sorted(os.listdir(d)):
        if not f.endswith('.js'): continue
        src = open(os.path.join(d, f)).read()
        code = re.sub(r'/\*.*?\*/|//[^\n]*', '', src, flags=re.S)
        for i, line in enumerate(code.splitlines(), 1):
            for pat, why in BANNED:
                if re.search(pat, line): bad.append(f'{f}:{i}: {why}')
        for m in re.finditer(r"PART\('(\w+)',\s*'(\w+)',\s*\{(.*?)\},\s*\(c,", code, re.S):
            n += 1
            for key in ('name', 'bgs', 'slots', 'dur', 'hit'):
                if not re.search(r'\b%s:' % key, m.group(3)): bad.append(f'{f}: {m.group(1)}.{m.group(2)} meta has no {key}')
    print(f'{n} parts checked')
    for b in bad: print('  ', b)
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
