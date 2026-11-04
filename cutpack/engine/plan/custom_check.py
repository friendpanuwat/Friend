#!/usr/bin/env python3
"""Check the code of an AI-written scene before it ever reaches the engine (Friend 2026-11-04: AI-written scenes are on
from day one, with no fixed cap). The code is the body of `(c, T) => { … }` for a card or `(vis, S, T) => { … }` for a
widget. It may only use the locked kit — the same rules as library parts (tools/check_parts.py) and more:

  * every bare name must be a kit helper, a JS keyword/global on the allow list, a parameter, or a name the code
    declares itself (const/let/for/arrow parameters) — so it cannot reach the camera, other scenes, the page or the
    network (no window, document, fetch, ZOOM, cards(), sfx() …)
  * no raw animation (A(, .animate, cubic-bezier), no randomness or clocks, no while/do loops, no `new`
  * properties that climb out of the scene or load things are refused (parentNode, ownerDocument, innerHTML, src …)
  * strings may hold CSS and simple SVG shapes only: no script, iframe, image, link, url(), file:, http, event handlers
  * brackets must balance, so the code cannot close its own function and write outside it
The render browser also has the network switched off (render.js, render_check.js): this is the first of two walls.

usage: custom_check.py <file.js>    → prints the problems, exit 1 if any
"""
import re, sys

MAX_CHARS = 5000
KIT = {   # helpers a scene may call (engine_head.html, motion.js, parts/*.js)
    'mv', 'snd', 'div', 'svg', 'ico', 'tile', 'pill', 'chunk', 'trend', 'ripple', 'cursor', 'fitW', 'mt', 'graphemes',
    'ON', 'NAVY', 'ACC', 'INK', 'CREAM', 'RED', 'MOTION', 'SAFE_W', 'STRIP', 'ACT', 'STAR', 'FITS',
}
PARAMS = {'c', 'T', 'vis', 'S'}
JS = {   # keywords and harmless globals
    'const', 'let', 'for', 'of', 'in', 'if', 'else', 'return', 'true', 'false', 'null', 'undefined', 'typeof',
    'Math', 'Array', 'Object', 'String', 'Number', 'parseFloat', 'parseInt', 'isNaN', 'Infinity', 'NaN', 'break', 'continue',
}
BANNED_TEXT = [   # anywhere in the code (outside strings)
    (r'\bA\(', 'raw animation A( — use mv.*'), (r'\.animate\s*\(', 'raw .animate — use mv.*'), (r'cubic-bezier', 'own easing curve — use mv.*'),
    (r'Math\s*\.\s*random', 'randomness (the render must be the same every time)'), (r'\bDate\b|\bperformance\b', 'clock'),
    (r'\bwhile\b|\bdo\s*\{', 'while/do loop (use a for loop over a fixed range)'), (r'\bnew\b', '`new`'),
    (r'\beval\b|\bFunction\b|\bimport\b|\brequire\b', 'running other code'),
]
BANNED_PROPS = {
    'parentNode', 'parentElement', 'ownerDocument', 'defaultView', 'contentWindow', 'contentDocument', 'constructor', 'prototype',
    '__proto__', 'innerHTML', 'outerHTML', 'insertAdjacentHTML', 'src', 'href', 'srcdoc', 'cookie', 'location', 'opener',
    'frames', 'animate', 'getAnimations', 'closest', 'getElementById', 'body', 'head', 'documentElement', 'shadowRoot',
    'fromCharCode', 'fromCodePoint', 'raw', 'ownerSVGElement', 'nextSibling', 'previousSibling', 'nextElementSibling', 'previousElementSibling', 'random', 'fetch',
}
BANNED_IN_STRINGS = [
    (r'<\s*script|<\s*iframe|<\s*object|<\s*embed|<\s*image|<\s*img|<\s*use|<\s*a\b|<\s*foreignobject|<\s*link|<\s*style|<\s*video|<\s*audio',
     'an element that runs or loads something'),
    (r'\bon[a-z]+\s*=', 'an event handler'), (r'url\s*\(', 'url( — nothing is loaded'), (r'file:|https?:|data:|javascript:', 'a link or file'),
    (r'@import|expression\s*\(', 'CSS that loads or runs'),
    (r'\\[xu0-7]', 'an escape code (write the character itself)'),
]
SVG_TAGS = {'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'ellipse', 'span', 'b', 'div', 'svg'}


def split(code):
    """→ (code text with strings blanked, [string contents]); raises ValueError on an unclosed string/comment.
    Template literals: the text parts are strings, the ${…} parts are code (checked like the rest)."""
    out, strings, i, n = [], [], 0, len(code)
    stack = []   # template nesting: brace depth when each ${ opened
    depth = 0
    while i < n:
        ch = code[i]
        if code.startswith('//', i):
            j = code.find('\n', i); i = n if j < 0 else j; continue
        if code.startswith('/*', i):
            j = code.find('*/', i + 2)
            if j < 0: raise ValueError('unclosed comment')
            i = j + 2; continue
        if ch in '\'"':
            j, buf = i + 1, []
            while j < n and code[j] != ch:
                if code[j] == '\\': buf.append(code[j:j + 2]); j += 2; continue
                if code[j] == '\n': raise ValueError('unclosed string')
                buf.append(code[j]); j += 1
            if j >= n: raise ValueError('unclosed string')
            strings.append(''.join(buf)); out.append('""'); i = j + 1; continue
        if ch == '`' or (ch == '}' and stack and depth == stack[-1]):
            if ch == '}': stack.pop()
            j, buf = i + 1, []
            while j < n and code[j] != '`' and not code.startswith('${', j):
                if code[j] == '\\': buf.append(code[j:j + 2]); j += 2; continue
                buf.append(code[j]); j += 1
            if j >= n: raise ValueError('unclosed template string')
            strings.append(''.join(buf)); out.append('""')
            if code.startswith('${', j): stack.append(depth); out.append(' '); i = j + 2
            else: i = j + 1
            continue
        if ch == '{': depth += 1
        elif ch == '}': depth -= 1
        out.append(ch); i += 1
    if stack: raise ValueError('unclosed ${ in a template string')
    return ''.join(out), strings


def declared(code):
    names = set()
    for m in re.finditer(r'\b(?:const|let)\b', code):   # every name in `const a = …, b = …;` (depth 0 of that statement)
        depth, i, expect = 0, m.end(), True
        while i < len(code):
            ch = code[i]
            if ch in '([{': depth += 1
            elif ch in ')]}':
                depth -= 1
                if depth < 0: break
            elif depth == 0 and ch in ';\n': break
            elif depth == 0 and ch == ',': expect = True
            elif expect and (ch.isalpha() or ch in '_$'):
                n = re.match(r'[A-Za-z_$][\w$]*', code[i:]).group(); names.add(n); i += len(n); expect = False; continue
            elif not ch.isspace(): expect = False
            i += 1
    for grp in re.findall(r'\b(?:const|let)\s*[\[{]([^\]}=]*)[\]}]', code):          # const [a, b] = … / const {x, y} = …
        names |= set(re.findall(r'([A-Za-z_$][\w$]*)\s*(?:,|$|:)', grp + ',')) | set(re.findall(r':\s*([A-Za-z_$][\w$]*)', grp))
    for grp in re.findall(r'\(([^()]*)\)\s*=>', code):                                  # (a, b) => …
        names |= set(re.findall(r'[A-Za-z_$][\w$]*', grp))
    names |= set(re.findall(r'([A-Za-z_$][\w$]*)\s*=>', code))                         # a => …
    names |= set(re.findall(r'\bfor\s*\(\s*(?:const|let)\s+([A-Za-z_$][\w$]*)', code))
    return names


def check(code):
    """→ list of problems (empty = the code may be used)."""
    if not isinstance(code, str) or not code.strip(): return ['no code']
    if len(code) > MAX_CHARS: return [f'code is {len(code)} characters, max {MAX_CHARS}']
    try: plain, strings = split(code)
    except ValueError as e: return [str(e)]
    probs = []
    pairs = {')': '(', ']': '[', '}': '{'}; st = []
    for ch in plain:
        if ch in '([{': st.append(ch)
        elif ch in ')]}':
            if not st or st.pop() != pairs[ch]: probs.append('brackets do not balance (the code may not close its own function)'); break
    else:
        if st: probs.append('brackets do not balance (the code may not close its own function)')
    for pat, why in BANNED_TEXT:
        if re.search(pat, plain): probs.append(f'not allowed: {why}')
    allowed = KIT | PARAMS | JS | declared(plain)
    for m in re.finditer(r'(\.\s*)?([A-Za-z_$][\w$]*)', plain):
        prop, name = m.group(1), m.group(2)
        if prop:
            if name in BANNED_PROPS: probs.append(f'property .{name} is not allowed')
        elif name not in allowed and not re.match(r'^\d', name):
            if re.match(r'\s*:', plain[m.end():]) and re.search(r'[{,]\s*$', plain[:m.start()]): continue   # object key {size: …}
            probs.append(f'unknown name {name} (only the kit may be used)')
    for s in strings:
        for pat, why in BANNED_IN_STRINGS:
            if re.search(pat, s, re.I): probs.append(f'string holds {why}: {s[:40]!r}')
        for m in re.finditer(r'<', s):   # every < must open (or close) an allowed tag, so no tag can be put together
            tag = re.match(r'\s*/?\s*([A-Za-z][\w-]*)', s[m.end():])
            if not tag: probs.append(f'string holds a lone < (tags must be written whole): {s[:40]!r}')
            elif tag.group(1).lower() not in SVG_TAGS: probs.append(f'string holds the tag <{tag.group(1)}>')
    return sorted(set(probs))


if __name__ == '__main__':
    probs = check(open(sys.argv[1]).read())
    for p in probs: print('-', p)
    print('OK' if not probs else f'{len(probs)} problems')
    sys.exit(1 if probs else 0)
