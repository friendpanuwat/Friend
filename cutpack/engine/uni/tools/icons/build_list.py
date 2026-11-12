import json, collections, sys
sys.path.insert(0, '.')
from th import TH, GROUP_TH
ICONS = json.load(open('/home/user/Friend/cutpack/engine/icons/lucide.json'))
HARSH = {'skull','bomb','sword','swords','axe','biohazard','radiation','ghost','syringe','cigarette','wine','beer','flame'}
core = {}
for l in open('/home/user/Friend/cutpack/engine/plan/prompt/icons_core.txt'):
    if l.startswith('#') or ':' not in l: continue
    g, names = l.split(':', 1)
    for n in names.split():
        if n not in HARSH: core.setdefault(n, g.strip())
fixed = json.load(open('fixed.json')); ai = json.load(open('ai_counts.json')); vn = json.load(open('vnames.json'))
rows = []
for n in list(core) + [n for n in fixed if n not in core]:
    assert n in TH, n
    drafts = fixed.get(n, [])
    where = 'ร่างวาดเอง + AI เลือกได้' if drafts and n in core else 'ร่างวาดเองเท่านั้น' if drafts else 'AI เลือกใส่ในภาพได้'
    a = ai.get(n, 0)
    pr = 1 if drafts or a >= 3 else 2 if a >= 1 else 3
    rows.append({'name': n, 'th': TH[n], 'group': GROUP_TH[core.get(n, 'drafts')], 'where': where, 'ndrafts': len(drafts),
                 'drafts': ' · '.join(f"{vn[d]['cat']}: {vn[d]['name']}" for d in drafts), 'ai': a, 'pr': pr})
rows.sort(key=lambda r: (r['pr'], -(r['ndrafts'] + r['ai']), r['group'], r['name']))
json.dump(rows, open('rows.json', 'w'), ensure_ascii=False)
print(len(rows), collections.Counter(r['pr'] for r in rows), collections.Counter(r['where'] for r in rows))
