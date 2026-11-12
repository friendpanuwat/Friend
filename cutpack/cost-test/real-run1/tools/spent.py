"""Real money spent so far in a runs.jsonl: each style line repeats its clip's caption call, so count that call once."""
import json, sys, os
sys.path.insert(0, os.path.join(sys.argv[2], 'cutpack', 'cost-test'))
import cost_model as cm
seen, usd = set(), 0.0
for line in open(sys.argv[1], encoding='utf-8'):
    if not line.strip(): continue
    r = json.loads(line)
    base = r['clip'].rsplit(':', 1)[0]
    for i, c in enumerate(r['calls']):
        if c.get('stage') in ('asr',): continue
        if c.get('stage') == 'group':
            key = (base, r['attempt'], json.dumps(c, sort_keys=True))
            if key in seen: continue
            seen.add(key)
        usd += cm.call_usd(c)
print(f'{usd:.4f}')
