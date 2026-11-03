#!/usr/bin/env python3
"""CutPack: cost per clip in THB.

  python3 cost_model.py report runs.jsonl   # real test results → mean / median / max, bucket shares, per-stage cost
  python3 cost_model.py estimate            # pre-test estimate for two scene designs (assumptions printed)
  python3 cost_model.py scenarios           # round 2: plan D per pack (Good / Base / Worst), redo and refunds included
  python3 cost_model.py selftest

runs.jsonl: one line per attempt (first run = attempt 0, every redo of the same clip = 1, 2, ...).
  {"clip": "c01", "duration_s": 45.2, "attempt": 0, "status": "ok" | "fail", "render_s": 412.0,
   "calls": [{"stage": "asr",   "provider": "groq-whisper-large-v3-turbo", "audio_s": 45.2},
             {"stage": "group", "model": "claude-haiku-5-5",  "in": 1800, "out": 900},
             {"stage": "scene", "model": "claude-sonnet-5-5", "in": 900, "out": 2600,
              "cache_read": 6000, "cache_write_5m": 0, "cache_write_1h": 0, "batch": false}]}
  in / out / cache_* are the token counts from the API response `usage` (out includes thinking tokens).
Redo cost always counts toward the clip it belongs to. A clip whose last attempt failed is refunded, so all of it is loss.
"""
import json, os, statistics, sys

HERE = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(os.path.join(HERE, 'prices.json')))
FX = P['thb_per_usd']
B = P['buckets_thb']
PACK = P['pack']


def revenue_thb(dur):
    # 450 THB / 5,000 credits = 0.09 THB per credit → 9 THB for a clip up to 60 s, 12.6 THB for 61–90 s
    cr = PACK['credits_per_clip_upto_60s'] if dur <= 60 else PACK['credits_per_clip_61_to_90s']
    return cr * PACK['thb'] / PACK['credits']


def call_usd(c):
    if c['stage'] == 'asr':
        a = P['asr_usd_per_min'][c['provider']]
        return max(c['audio_s'], a['min_billed_s']) / 60 * a['rate']
    m = P['llm_usd_per_mtok'][c['model']]
    usd = (c.get('in', 0) * m['in'] + c.get('out', 0) * m['out'] + c.get('cache_read', 0) * m['cache_read']
           + c.get('cache_write_5m', 0) * m['cache_write_5m'] + c.get('cache_write_1h', 0) * m['cache_write_1h']) / 1e6
    return usd * (P['batch_discount'] if c.get('batch') else 1)


def bucket(thb, failed):
    if failed: return 'fail'
    if thb <= B['best_max']: return 'best'
    if thb <= B['stop_redo_above']: return 'mid'
    return 'over'


def report(path):
    clips = {}
    for line in open(path, encoding='utf-8'):
        if line.strip():
            r = json.loads(line); clips.setdefault(r['clip'], []).append(r)
    rows, stage_thb = [], {}
    for name, att in clips.items():
        att.sort(key=lambda r: r['attempt'])
        thb = 0.0
        for r in att:
            for c in r['calls']:
                v = call_usd(c) * FX; thb += v; stage_thb[c['stage']] = stage_thb.get(c['stage'], 0) + v
        rows.append({'clip': name, 'dur': att[0]['duration_s'], 'thb': thb, 'redos': len(att) - 1,
                     'cat': bucket(thb, att[-1]['status'] != 'ok'), 'render_s': sum(r.get('render_s', 0) for r in att)})
    n = len(rows); cost = [r['thb'] for r in rows]
    print(f'clips {n} · attempts {sum(len(a) for a in clips.values())}')
    print(f'cost per clip THB  mean {statistics.mean(cost):.2f} · median {statistics.median(cost):.2f} · max {max(cost):.2f}')
    for cat, label in [('best', f'best ≤{B["best_max"]}'), ('mid', f'mid ≤{B["stop_redo_above"]}'), ('over', f'over >{B["stop_redo_above"]}'), ('fail', 'fail (refunded)')]:
        k = sum(r['cat'] == cat for r in rows); print(f'  {label:18s} {k:3d}  {100 * k / n:5.1f}%')
    print(f'team alert (> {B["alert_team_above"]} THB): {sum(r["thb"] > B["alert_team_above"] for r in rows)} clips')
    print('average THB per clip by stage: ' + ' · '.join(f'{s} {v / n:.3f}' for s, v in sorted(stage_thb.items(), key=lambda x: -x[1])))
    rs = [r['render_s'] for r in rows if r['render_s']]
    if rs:
        per_min = sum(rs) / sum(r['dur'] for r in rows if r['render_s']) * 60
        print(f'render: {statistics.mean(rs) / 60:.1f} min per clip on average ({per_min / 60:.1f} min per minute of video)')
    rev = sum(revenue_thb(r['dur']) for r in rows if r['cat'] != 'fail')
    print(f'margin after API cost (credits used by delivered clips; failed clips refunded): '
          f'{100 * (rev - sum(cost)) / rev:.0f}%' if rev else 'no delivered clips')
    return rows


# ---------- pre-test estimate ----------
# Measured from the skill files (chars counted, tokens = range because Thai tokenizes unevenly):
#   design A system prompt = SKILL.md + 3 references + examples/timeline_mg.js → 12.4K–20.7K tokens
#   design A output: examples/timeline_mg.js is 3.3K–4.7K tokens of code for a 41.9 s clip → 78–112 tokens per second
#   spoken Thai ≈ 17 characters per second (captions in the same example)
# Everything marked ASSUMED has no measurement yet; the real test replaces it.
DESIGNS = {
    'A: Sonnet writes timeline.js (skill as it is)': dict(model='claude-sonnet-5-5', sys=(12400, 20700), out_ps=(78, 112), think=(0.5, 2.0)),
    'B: Sonnet fills scene templates (JSON)':       dict(model='claude-sonnet-5-5', sys=(4000, 8000), out_ps=(15, 30), think=(0.3, 1.0)),
    'C: Haiku fills scene templates (JSON)':        dict(model='claude-haiku-5-5', sys=(4000, 8000), out_ps=(15, 30), think=(0.3, 1.0)),
}
ASSUMED = ['design B/C system prompt 4K–8K tokens (template catalogue)', 'design B/C output 15–30 tokens per second of clip',
           'thinking tokens = 0.5–2× the code (A) or 0.3–1× the JSON (B/C)',
           'caption grouping on Haiku: 1.5K prompt + 25–45 tokens/s in, 12–25 tokens/s out, no thinking',
           'design D custom scene: second Sonnet call with the kit manual (6.2K–10.4K tokens), 200–463 tokens of code per scene '
           '(card size in examples/timeline_mg.js), thinking 0.5–2×, high case +30% for one fix']

# Plan D = design B, plus a second Sonnet call that writes code only for scenes the library has no part for.
CUSTOM = dict(model='claude-sonnet-5-5', sys=(6200, 10400), out_per_scene=(200, 463), think=(0.5, 2.0), fix=(1.0, 1.3))


def estimate_custom(n, hi, warm):
    if n == 0: return 0.0
    k = 1 if hi else 0
    out = n * CUSTOM['out_per_scene'][k] * (1 + CUSTOM['think'][k]) * CUSTOM['fix'][k]
    call = {'stage': 'custom_scene', 'model': CUSTOM['model'], 'in': 400 + 150 * n, 'out': out,
            ('cache_read' if warm else 'cache_write_5m'): CUSTOM['sys'][k]}
    return call_usd(call) * FX


def estimate_clip(d, dur, hi, warm):
    k = 1 if hi else 0
    th = 17 * dur / (1.0 if hi else 2.0) + 400                       # transcript + per-clip instructions, uncached
    sys_t = d['sys'][k]; out = d['out_ps'][k] * dur; out *= 1 + d['think'][k]
    scene = {'stage': 'scene', 'model': d['model'], 'in': th, 'out': out,
             ('cache_read' if warm else 'cache_write_5m'): sys_t}
    group = {'stage': 'group', 'model': 'claude-haiku-5-5', 'in': 1500 + (45 if hi else 25) * dur, 'out': (25 if hi else 12) * dur}
    asr = {'stage': 'asr', 'provider': 'groq-whisper-large-v3-turbo', 'audio_s': dur}
    return sum(call_usd(c) for c in (asr, group, scene)) * FX


def estimate():
    print('pre-test estimate, THB per clip, one attempt, no redo (ASR Groq + caption grouping Haiku + scene step)')
    print('warm = system prompt read from cache (another clip started < 5 min earlier); cold = written to cache again\n')
    print(f'{"design":48s} ' + ' '.join(f'{d:>21s}' for d in ('30 s', '45 s', '60 s', '90 s')))
    for name, d in DESIGNS.items():
        for warm in (True, False):
            cells = [f'{estimate_clip(d, s, False, warm):5.2f}–{estimate_clip(d, s, True, warm):5.2f}' for s in (30, 45, 60, 90)]
            print(f'{name if warm else "":48s} {"warm" if warm else "cold":>4s} ' + ' '.join(f'{c:>16s}' for c in cells))
    b = DESIGNS['B: Sonnet fills scene templates (JSON)']
    for n in (1, 2, 3):
        for warm in (True, False):
            cells = [f'{estimate_clip(b, s, False, warm) + estimate_custom(n, False, warm):5.2f}–'
                     f'{estimate_clip(b, s, True, warm) + estimate_custom(n, True, warm):5.2f}' for s in (30, 45, 60, 90)]
            print(f'{("D: B + AI writes " + str(n) + " scene(s) the library lacks") if warm else "":48s} {"warm" if warm else "cold":>4s} '
                  + ' '.join(f'{c:>16s}' for c in cells))
    print('\nASSUMED (not measured yet):'); [print('  - ' + a) for a in ASSUMED]


# ---------- round 2: plan D as agreed, per pack, with redo and refunds ----------
# Token sizes measured from the 9 model runs in cutpack/model-test/editorial-v0 (final timeline.js, chars → token range):
#   code per card: Sonnet low 130–185, Sonnet medium/high 170–280, Opus 210–425, Haiku 130–235 tokens.
# Still ASSUMED: plan-D prompt size, JSON length, thinking tokens at each effort, redo / fail / custom-scene rates.
THINK = {'low': (0.2, 0.6), 'medium': (0.3, 1.0), 'high': (0.5, 2.0)}
CONFIGS = {   # name: (scene-plan model, effort, custom-scene model, code tokens per custom scene)
    'Sonnet 5.5 low (recommended)': ('claude-sonnet-5-5', 'low', 'claude-sonnet-5-5', (130, 280)),
    'Haiku 5.5 low + Sonnet low for custom scenes': ('claude-haiku-5-5', 'low', 'claude-sonnet-5-5', (130, 280)),
    'Opus 5.5 low': ('claude-opus-5-5', 'low', 'claude-opus-5-5', (210, 425)),
}
# avg clip length, redo share (first redo is free, so it costs a full attempt), fail share (refunded),
# share of clips that need AI-written scenes and how many scenes those clips need — scenarios follow section 4.1 of the handoff
SCENARIOS = {
    'Good':  dict(dur=30, redo=0.10, fail=0.02, p_custom=0.3, n_custom=1),
    'Base':  dict(dur=50, redo=0.20, fail=0.05, p_custom=0.5, n_custom=1.5),
    'Worst': dict(dur=85, redo=0.40, fail=0.10, p_custom=0.8, n_custom=2),
}
PLAN_SYS = (6000, 12000)    # ASSUMED: parts catalogue with meaning tags + rules + good/bad examples
PLAN_OUT_PS = (15, 30)      # ASSUMED: JSON tokens per second of clip
CUSTOM_SYS = (6200, 10400)  # kit manual sent only with the second call


def attempt_thb(cfg, dur, hi, warm, p_custom, n_custom):
    model, effort, cmodel, per_scene = CONFIGS[cfg]
    k = 1 if hi else 0
    cache = 'cache_read' if warm else 'cache_write_5m'
    calls = [{'stage': 'asr', 'provider': 'groq-whisper-large-v3-turbo', 'audio_s': dur},
             {'stage': 'group', 'model': 'claude-haiku-5-5', 'in': 1500 + (45 if hi else 25) * dur, 'out': (25 if hi else 12) * dur},
             {'stage': 'scene', 'model': model, 'in': 17 * dur / (1.0 if hi else 2.0) + 400,
              'out': PLAN_OUT_PS[k] * dur * (1 + THINK[effort][k]), cache: PLAN_SYS[k]}]
    base = sum(call_usd(c) for c in calls)
    custom = call_usd({'stage': 'custom', 'model': cmodel, 'in': 400 + 150 * n_custom, cache: CUSTOM_SYS[k],
                       'out': n_custom * per_scene[k] * (1 + THINK[effort][k]) * (1.3 if hi else 1.0)})
    return (base + p_custom * custom) * FX


def scenarios():
    print('round 2: THB, plan D, every member uses the whole pack (5,000 credits = 450 THB)')
    print('cost per clip = one attempt × (1 + redo share); refunded clips are paid again from the returned credits\n')
    for cfg in CONFIGS:
        print(cfg)
        print(f'  {"":6s} {"clip":>5s} {"clips/pack":>10s} {"cost per clip":>15s} {"cost per pack":>15s} {"left per pack":>15s} {"margin":>10s}   cache')
        for name, sc in SCENARIOS.items():
            clips = PACK['credits'] // (PACK['credits_per_clip_upto_60s'] if sc['dur'] <= 60 else PACK['credits_per_clip_61_to_90s'])
            jobs = clips / (1 - sc['fail'])
            for warm in (False, True):
                lo, hi = (attempt_thb(cfg, sc['dur'], h, warm, sc['p_custom'], sc['n_custom']) * (1 + sc['redo']) for h in (False, True))
                plo, phi = lo * jobs, hi * jobs
                print(f'  {name if not warm else "":6s} {str(sc["dur"]) + " s" if not warm else "":>5s} {clips if not warm else "":>10} '
                      f'{lo:6.2f}–{hi:5.2f} {plo:8.0f}–{phi:4.0f} {PACK["thb"] - phi:8.0f}–{PACK["thb"] - plo:4.0f} '
                      f'{100 * (PACK["thb"] - phi) / PACK["thb"]:5.0f}–{100 * (PACK["thb"] - plo) / PACK["thb"]:.0f}%   {"warm" if warm else "cold"}')
        print()
    print('not included: payment fees, VAT, ads, email, the VPS (fixed per month, about 75–110 members per CX23 — see README)')


def selftest():
    import tempfile
    lines = [
        {'clip': 'a', 'duration_s': 30, 'attempt': 0, 'status': 'ok', 'render_s': 300,
         'calls': [{'stage': 'scene', 'model': 'claude-sonnet-5-5', 'in': 1000, 'out': 2000, 'cache_read': 6000}]},
        {'clip': 'b', 'duration_s': 60, 'attempt': 0, 'status': 'ok', 'render_s': 600,
         'calls': [{'stage': 'scene', 'model': 'claude-sonnet-5-5', 'in': 0, 'out': 20000}]},
        {'clip': 'b', 'duration_s': 60, 'attempt': 1, 'status': 'ok', 'render_s': 600,
         'calls': [{'stage': 'scene', 'model': 'claude-sonnet-5-5', 'in': 0, 'out': 20000}]},
        {'clip': 'c', 'duration_s': 90, 'attempt': 0, 'status': 'fail',
         'calls': [{'stage': 'asr', 'provider': 'groq-whisper-large-v3-turbo', 'audio_s': 5}]},
    ]
    with tempfile.NamedTemporaryFile('w', suffix='.jsonl', delete=False) as f:
        f.write('\n'.join(json.dumps(x) for x in lines))
    rows = {r['clip']: r for r in report(f.name)}
    os.unlink(f.name)
    # a: (1000*2 + 2000*10 + 6000*0.2)/1e6 USD = 0.0232 USD = 0.784 THB
    assert abs(rows['a']['thb'] - 0.0232 * FX) < 1e-9 and rows['a']['cat'] == 'best'
    # b: redo counted in the same clip: 2 × 0.2 USD = 13.52 THB → over the 7 THB stop line
    assert abs(rows['b']['thb'] - 0.4 * FX) < 1e-9 and rows['b']['cat'] == 'over' and rows['b']['redos'] == 1
    # c: failed → refunded, 10 s minimum billing
    assert rows['c']['cat'] == 'fail' and abs(rows['c']['thb'] - 10 / 60 * 0.000667 * FX) < 1e-9
    assert estimate_custom(0, True, False) == 0 and estimate_custom(2, False, True) < estimate_custom(2, True, False)
    assert attempt_thb('Sonnet 5.5 low (recommended)', 45, False, True, 0, 0) < attempt_thb('Opus 5.5 low', 45, False, True, 0, 0)
    assert revenue_thb(60) == 9.0 and abs(revenue_thb(61) - 12.6) < 1e-9
    assert estimate_clip(DESIGNS['C: Haiku fills scene templates (JSON)'], 45, True, False) < estimate_clip(DESIGNS['A: Sonnet writes timeline.js (skill as it is)'], 45, False, True)
    print('selftest OK')


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'estimate'
    {'report': lambda: report(sys.argv[2]), 'estimate': estimate, 'scenarios': scenarios, 'selftest': selftest}[cmd]()
