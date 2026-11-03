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
    bad, n = [], 0
    files = [os.path.join(ENGINE, 'styles', style, sub, f) for sub in ('parts', 'widgets') if os.path.isdir(os.path.join(ENGINE, 'styles', style, sub))
             for f in sorted(os.listdir(os.path.join(ENGINE, 'styles', style, sub))) if f.endswith('.js')]
    for path in files:
        f = os.path.relpath(path, os.path.join(ENGINE, 'styles', style))
        src = open(path).read()
        code = re.sub(r'/\*.*?\*/|//[^\n]*', '', src, flags=re.S)
        # a line comment that swallowed code: `//` followed by something like `; name(` or `; x.y = ` (it silently drops that code)
        for i, line in enumerate(src.splitlines(), 1):
            if '//' in line and re.search(r'//[^\n]*;\s*[A-Za-z_][\w.]*\s*(\(|=[^=])', line): bad.append(f'{f}:{i}: code after a // comment is commented out')
        for i, line in enumerate(code.splitlines(), 1):
            for pat, why in BANNED:
                if re.search(pat, line): bad.append(f'{f}:{i}: {why}')
        for m in re.finditer(r"(?:PART|WIDGET)\('(\w+)',\s*'(\w+)',\s*\{(.*?)\},\s*\(c,", code, re.S):
            n += 1
            for key in ('name', 'bgs', 'slots', 'dur', 'hit'):
                if not re.search(r'\b%s:' % key, m.group(3)): bad.append(f'{f}: {m.group(1)}.{m.group(2)} meta has no {key}')
    print(f'{n} parts and widgets checked')
    for b in bad: print('  ', b)
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
