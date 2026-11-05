#!/usr/bin/env python3
"""Tests for the scene-plan tools (step 3.4): good plans pass, every kind of broken plan is caught with the right code
and the right scene, the fallback always gives a renderable plan, and the face finder, prompt and assembler still give
what Friend approved.

run:  python3 -m unittest discover -s cutpack/engine/plan/tests -v          (about a minute; needs Chromium + ffmpeg)
      CUTPACK_SLOW=1 …  also runs tests/library_sweep.py over the whole library (a few minutes more)
"""
import copy, glob, json, os, subprocess, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.dirname(HERE)
CUTPACK = os.path.dirname(os.path.dirname(PLAN))
sys.path.insert(0, PLAN)
import validate as V, render_check, fallback, assemble, prompt, plan2timeline, faces, custom_check, plan_d
import re

EX = os.path.join(PLAN, 'examples')


def load(*path):
    with open(os.path.join(*path)) as f: return json.load(f)


CAT = load(PLAN, 'catalog.json')
GOOD = {s: load(EX, f'test18_{s}.json') for s in ('editorial', 'overlay')}
INPUT = load(EX, 'test18_input.json')
FACES = {'keepOut': [275, 362, 806, 1075], 'layout': {'subtitleTop': 1300, 'widgetPos': {'short': {'x': 240, 'y': 150}, 'narrow': {'x': 36, 'y': 402}},
                                                       'shortFits': True, 'narrowFits': True, 'narrowSide': 'left', 'subOverFace': False}}


def check(plan, faces=None, history=None, render=False):
    R, _ = V.validate(plan, CAT, faces, history, render=render)
    return R


def broken(style, change):
    p = copy.deepcopy(GOOD[style]); change(p); return p


class GoodPlans(unittest.TestCase):
    def test_approved_plans_pass_with_render(self):
        for style, plan in GOOD.items():
            R = check(plan, FACES, render=True)
            self.assertEqual([i for i in R.issues if i['level'] == 'error'], [], style)

    def test_assembler_rebuilds_the_approved_plans(self):
        for style, plan in GOOD.items():
            ans = load(EX, f'test18_{style}.answer.json')
            p = assemble.assemble(INPUT, ans, style)
            self.assertEqual(p['subtitles'], plan['subtitles'], style)
            self.assertEqual([{k: v for k, v in s.items() if k not in ('say', 'shows')} for s in p['scenes']], plan['scenes'], style)
            self.assertEqual(p['camera'], plan['camera'], style)

    def test_converter_output_is_data_only(self):
        """Plan text never becomes code: a quote or script tag in a slot stays inside a JSON string."""
        p = broken('editorial', lambda p: p['scenes'][0]['slots'].update(lead='"); alert(1); ("</script>'))
        js = plan2timeline.convert(p)
        line = next(l for l in js.splitlines() if l.startswith("part(\"B02\""))
        args = json.loads('[' + line[len('part('):-2] + ']')   # the whole call parses back as JSON values
        self.assertEqual(args[4]['lead'], '"); alert(1); ("</script>')


# ---------- every rule: (style, what to break, expected code, scene index or None) ----------
def setp(path, value):
    def f(p):
        o = p
        for k in path[:-1]: o = o[k]
        o[path[-1]] = value
    return f


def extra_cards(p):   # editorial: fill three talking-head gaps with cards → too much card time
    p['scenes'] += [{'t0': 0.9, 't1': 2.4, 'kind': 'card', 'part': 'B06.v1', 'bg': 'white', 'hit': 1.3, 'slots': {'q': 'ทำไมคลิปของคุณ', 'icon': 'eye'}},
                    {'t0': 4.8, 't1': 6.2, 'kind': 'card', 'part': 'B07.v1', 'bg': 'cream', 'hit': 5.2, 'slots': {'text': 'โพสต์น้อย', 'icon': 'eye'}},
                    {'t0': 8.0, 't1': 9.6, 'kind': 'card', 'part': 'B13.v1', 'bg': 'white', 'hit': 8.9, 'slots': {'tip': 'เลื่อนผ่าน'}}]


def to_pack(part, slots, topic):   # scene 0 swapped for a topic-pack part (Friend's 4 packs, wired in 2026-11-05)
    def f(p):
        p['topic'] = topic; p['scenes'][0].update(part=part, slots=slots)
    return f


STAGES = ['เห็นโพสต์', 'ทักมา', 'ซื้อจริง']
PACK_CASES = [
    ('editorial', to_pack('B02.biz1', {'dir': 'down', 'icon': 'eye', 'lead': 'ยอดวิวกลับ', 'key': 'ลดลง'}, 'fin'), 'topic-part', 0),
    ('editorial', to_pack('B02.biz1', {'dir': 'down', 'icon': 'eye', 'lead': 'ยอดวิวกลับ', 'key': 'ลดลง'}, 'none'), 'topic-part', 0),
    ('editorial', setp(['topic'], 'food'), 'topic', None),
    ('editorial', to_pack('BIZ.h2', {'stages': STAGES, 'nums': [1000, 3, 3], 'key': 'ลดลง'}, 'biz'), 'number-not-said', 0),
    ('editorial', to_pack('BIZ.h2', {'stages': STAGES, 'nums': [3], 'key': 'ลดลง'}, 'biz'), 'slot-count', 0),
    ('editorial', to_pack('BIZ.h2', {'stages': STAGES[:2], 'key': 'ลดลง'}, 'biz'), 'slot-count', 0),
    ('editorial', to_pack('FIN.h3', {'rows': [{'t': 'เงินเดือน', 'v': '3', 'in': True}]}, 'fin'), 'slot-type', 0),
    ('editorial', to_pack('FIN.h3', {'rows': [{'t': 'เงินเดือน', 'v': 3, 'in': True, 'x': 1}]}, 'fin'), 'slot-type', 0),
    ('editorial', to_pack('FIN.h2', {'names': ['ใช้', 'เก็บ'], 'shares': [3, 3], 'focus': 2}, 'fin'), 'slot-index', 0),
    ('editorial', to_pack('FIN.h2', {'names': ['ใช้', 'เก็บ'], 'shares': [3, 30]}, 'fin'), 'number-not-said', 0),
]

CASES = [
    ('editorial', setp(['version'], 2), 'shape', None),
    ('editorial', setp(['scenes', 1, 't1'], 19.5), 'time', 1),
    ('overlay', setp(['scenes', 0, 'kind'], 'card'), 'kind', 0),
    ('editorial', setp(['scenes', 0, 'part'], 'B99.v1'), 'unknown-part', 0),
    ('editorial', setp(['scenes', 3, 'bg'], 'navy'), 'bg', 3),
    ('editorial', setp(['scenes', 0, 't1'], 6.0), 'length', 0),
    ('editorial', setp(['scenes', 0, 'hit'], 2.5), 'hit-early', 0),
    ('editorial', setp(['scenes', 0, 'hit'], 4.7), 'hit-late', 0),
    ('editorial', lambda p: p['scenes'][0]['slots'].pop('icon'), 'slot-missing', 0),
    ('editorial', setp(['scenes', 0, 'slots', 'lead'], 'ยอดวิวกลับลดลงเรื่อย ๆ ทุกวันทุกคืน'), 'slot-long', 0),
    ('editorial', setp(['scenes', 0, 'slots', 'icon'], 'not-an-icon'), 'icon', 0),
    ('editorial', setp(['scenes', 0, 'slots', 'dir'], 'sideways'), 'slot-choice', 0),
    ('editorial', setp(['scenes', 0, 'slots', 'colour'], 'red'), 'slot-unknown', 0),
    ('editorial', setp(['scenes', 3, 'slots', 'items'], ['เปิดด้วยคำถาม']), 'slot-count', 3),
    ('editorial', setp(['scenes', 3, 'slots', 'at'], [13.2, 12.4, 14.0]), 'slot-time', 3),
    ('editorial', setp(['scenes', 3, 'slots', 'rows'], ['bad']), 'slot-unknown', 3),
    ('overlay', setp(['scenes', 1, 'slots', 'wkey'], 'ยอดวิวลดลงเรื่อยๆทุกวัน'), 'slot-long', 1),
    ('editorial', setp(['scenes', 2, 'slots', 'num'], 5), 'number-not-said', 2),
    ('editorial', setp(['scenes', 0, 'slots', 'lead'], 'ลดลง 50%'), 'number-not-said', 0),
    ('editorial', setp(['scenes', 1, 't0'], 4.0), 'scene-overlap', 1),
    ('editorial', lambda p: p['scenes'].__delitem__(slice(1, 4)), 'density-low', None),
    ('editorial', extra_cards, 'density-high', None),
    ('editorial', lambda p: p['scenes'].__delitem__(slice(1, 3)), 'aroll-long', None),
    ('editorial', lambda p: p['scenes'].insert(0, {'t0': 0.2, 't1': 2.4, 'kind': 'card', 'part': 'B06.v1', 'bg': 'white', 'hit': 1.3,
                                                     'slots': {'q': 'ทำไมคลิปของคุณ', 'icon': 'eye'}}), 'open-on-card', 0),
    ('overlay', setp(['scenes', 1, 't0'], 2.5), 'widget-gap', 1),
    ('overlay', lambda p: p['scenes'].__delitem__(slice(2, 4)), 'bare-long', None),
    ('editorial', setp(['scenes', 2, 'part'], 'B05.v1'), 'repeat-next', 2),
    ('overlay', setp(['scenes', 2, 'part'], 'B06.v1'), 'reuse', None),
    ('editorial', setp(['subtitles', 0, 'text'], 'ทำไมคลิปของคุณยอดวิวไม่ขึ้นเลย'), 'sub-chunk', None),
    ('overlay', setp(['subtitles', 6, 'text'], 'ลอง / ทำ / 3 / อย่าง'), 'sub-fast', None),
    ('overlay', setp(['subtitles', 0, 'key'], 'ไม่มีคำนี้'), 'sub-key', None),
    ('overlay', setp(['subtitles', 1, 't0'], 2.0), 'sub-overlap', None),
    ('editorial', setp(['subtitles', 0, 't1'], 3.0), 'sub-under-card', None),
    ('overlay', setp(['layout'], {'subtitleTop': 1200}), 'sub-top', None),
    ('overlay', setp(['layout'], {'widgetPos': {'short': {'x': 240, 'y': 100}}}), 'place-topbar', 0),
    ('overlay', setp(['layout'], {'widgetPos': {'narrow': {'x': 800, 'y': 900}}}), 'place-right', 4),
    ('overlay', setp(['layout'], {'widgetPos': {'narrow': {'x': 36, 'y': 1000}}}), 'place-subtitle', 4),
    ('overlay', setp(['layout'], {'widgetPos': {'short': {'x': 240, 'y': 300}}}), 'place-face', 0),
    ('editorial', setp(['camera', 0, 'z'], 1.2), 'cam-zoom', None),
    ('overlay', lambda p: p['camera'].insert(1, {'push': 2.0}), 'cam-often', None),
    ('editorial', lambda p: p['camera'].__setitem__(slice(None), [{'push': .3}, {'pull': 4.8}, {'push': 5.0}, {'pull': 9.6, 'cut': True},
                                                                  {'push': 9.7}, {'pull': 12.0, 'cut': True}, {'push': 14.6}]), 'cam-often', None),
    ('overlay', setp(['camera', 1], {'pull': 4.8, 'cut': True}), 'cam-cut', None),
    ('editorial', setp(['camera', 1], {'pull': 3.0, 'cut': True}), 'cam-cut', None),
]
CASES += PACK_CASES


class BrokenPlans(unittest.TestCase):
    def test_each_rule_is_caught(self):
        for style, change, code, scene in CASES:
            with self.subTest(code=code, style=style):
                R = check(broken(style, change), FACES)
                hits = [i for i in R.issues if i['code'] == code and i['level'] == 'error']
                self.assertTrue(hits, f'{code} not reported; got {[(i["code"], i["where"]) for i in R.issues]}')
                if scene is not None: self.assertIn(scene, [i.get('scene') for i in hits], f'{code} not tied to scene {scene}')

    def test_history_and_no_room(self):
        p = GOOD['overlay']
        R = check(p, history={'clips': [{'parts': [s['part'] for s in p['scenes']]}]})
        self.assertIn('history-last', {i['code'] for i in R.issues})
        tight = copy.deepcopy(FACES); tight['layout']['shortFits'] = False
        R = check(p, faces=tight)
        self.assertIn('place-nofit', {i['code'] for i in R.issues})

    def test_engine_refusal_is_caught_by_the_render_check(self):
        p = broken('overlay', setp(['scenes', 5], {'t0': 16.3, 't1': 18.1, 'kind': 'widget', 'part': 'B14.v1', 'size': 'short', 'hit': 16.8,
                                                   'slots': {'words': ['คำที่ยาวมากเกินสิบสี่ตัวอักษรแน่นอน', 'กดติดตาม'], 'key': 1}}))
        R = check(p, render=True)
        self.assertTrue(any(i['code'] == 'engine' and i.get('scene') == 5 for i in R.issues), R.issues)

    def test_render_problems_on_measured_boxes(self):
        txt = lambda i, box, owner='widget', clip=None: {'id': i, 'owner': owner, 'text': f't{i}', 'box': box, 'parts': [box], 'fs': 40, 'clip': clip}
        P = render_check.problems([txt(0, [100, 100, 300, 160]), txt(1, [280, 150, 400, 200]),             # letters touch
                                   txt(2, [500, 300, 700, 360], clip=[480, 280, 690, 380]),                 # cut by its box
                                   txt(3, [-20, 500, 200, 560]),                                            # off the frame
                                   txt(4, [700, 1300, 980, 1380], 'card')])                                 # under the app's buttons
        self.assertEqual(sorted(v[1] for v in P.values()), ['text-cut', 'text-off-frame', 'text-overlap', 'text-right-strip'])


class Fallback(unittest.TestCase):
    def test_every_broken_plan_becomes_renderable(self):
        for style, change, code, _ in CASES:
            with self.subTest(code=code, style=style):
                p, R = fallback.repair(broken(style, change), CAT, FACES, render=False)
                self.assertEqual(R.blocking, [], f'{code}: still blocked by {[(i["code"], i["where"]) for i in R.blocking]}')

    def test_fallback_with_the_engine_in_the_loop(self):
        p = broken('overlay', lambda p: (p['scenes'][0]['slots'].update(icon='not-an-icon'), p['scenes'][3]['slots'].update(num=5)))
        p, R = fallback.repair(p, CAT, FACES, render=True)
        self.assertEqual(R.blocking, [])
        self.assertEqual([s['part'][:3] for s in p['scenes']].count('B14'), 2)   # both scenes became text widgets
        self.assertTrue(all('B14' in line for line in p['fallbackLog']))


class Numbers(unittest.TestCase):
    def test_thai_numbers(self):
        for text, want in [('3 วินาทีแรก', {3}), ('สามสิบห้า', {35}), ('ยี่สิบเอ็ด', {21}), ('สองพันห้าร้อย', {2500}),
                           ('หนึ่งล้านสองแสน', {1_200_000}), ('๑,๒๐๐ บาท', {1200}), ('1.5 เท่า', {1.5}), ('ครึ่งหนึ่ง', {.5, 1})]:
            self.assertEqual(V.numbers(text), {float(x) for x in want}, text)

    def test_icon_names_are_not_numbers_on_screen(self):
        """Found on Friend's first real clip: the icon "share-2" was read as a number nobody said."""
        p = broken('editorial', lambda p: p['scenes'][0]['slots'].update(icon='share-2'))
        self.assertNotIn('number-not-said', {i['code'] for i in check(p).issues})

    def test_letters_count_like_the_engine(self):
        self.assertEqual(V.graphemes('ไม่ขึ้น'), 4)        # ไ ม่ ขึ้ น
        self.assertEqual(V.graphemes('ทำ'), 1)             # SARA AM joins the letter before


class Prompt(unittest.TestCase):
    def test_system_block_is_the_same_for_every_clip(self):
        """The cached part may not depend on the clip, or the prompt cache never hits."""
        other = copy.deepcopy(INPUT); other['clip']['duration'] = 42.0; other['history'] = {'clips': [{'parts': ['B01.v1']}]}
        for style in ('editorial', 'overlay'):
            a, b = prompt.request(INPUT, style, CAT), prompt.request(other, style, CAT)
            self.assertEqual(a['system'], b['system'])
            self.assertNotEqual(a['messages'], b['messages'])
            self.assertEqual(a['model'], 'claude-sonnet-5-5'); self.assertEqual(a['output_config']['effort'], 'low')

    def test_library_lists_every_part_and_icon(self):
        for style, key in (('editorial', 'cards'), ('overlay', 'widgets')):
            text = prompt.library_text(style, CAT)
            for p in CAT[key]: self.assertIn(f"- {p['id']} ·", text)
            self.assertIn(' arrow-up-right ', text)

    def test_example_answers_fit_the_schema(self):
        import jsonschema
        for style in ('editorial', 'overlay'):
            ans = load(EX, f'test18_{style}.answer.json')
            jsonschema.validate(prompt.slots_to_list(ans), prompt.answer_schema(style, CAT))
            self.assertEqual(prompt.slots_to_dict(prompt.slots_to_list(ans)), ans)   # back to the form the engine reads
            self.assertIn('"slots":[{"name":', prompt.example_text(style))           # the example shows the asked form

    def test_core_icons_by_theme(self):
        """Friend 2026-11-05: about 300 icons by theme instead of all 1,539 (40% of the cached prompt)."""
        rows = prompt.core_icons(CAT)
        names = [n for _, ns in rows for n in ns]
        self.assertTrue(250 <= len(names) <= 330, len(names)); self.assertEqual(len(names), len(set(names)))
        self.assertTrue(set(names) <= set(CAT['icons']))
        for style in ('editorial', 'overlay'):
            text = prompt.system_text(style, CAT)
            self.assertIn('money & business: banknote', text); self.assertNotIn('a-arrow-down', text)

    def test_targets_as_numbers(self):
        """Friend 2026-11-05 ("ข้อเสนอบอกตัวเลข"): the clip message gives this clip's density rules as numbers."""
        text = prompt.clip_text(INPUT, 'editorial')
        self.assertIn('Targets for this clip', text); self.assertIn('at least 4 cards, together 7–11 s', text)
        self.assertIn('at least 5 widgets, spread over the whole clip', prompt.clip_text(INPUT, 'overlay'))
        low, full = [300, 600, 780, 1150], [20, 100, 1060, 1700]
        inp = copy.deepcopy(INPUT); inp['faceBox'] = low
        inp['track'] = [[k * .5, low if k * .5 < 16.5 else full] for k in range(37)]
        self.assertIn('spread inside the times with room', prompt.clip_text(inp, 'overlay'))
        inp['track'] = [[k * .5, low if k * .5 < 9 else full] for k in range(37)]   # tight: the speaker shrinks, whole clip
        self.assertIn('spread over the whole clip', prompt.clip_text(inp, 'overlay'))

    def test_cache_lifetime_and_model(self):
        """Friend 2026-11-05: an hour's cache only after 2 plans of the style in the last hour; Haiku has no fallback."""
        with tempfile.TemporaryDirectory() as d:
            st = os.path.join(d, 'state.json')
            self.assertEqual(plan_d.cache_ttl(st, 'overlay', now=10000), '5m')
            plan_d.note_plan(st, 'overlay', now=10000 - 4000)   # older than an hour: forgotten
            plan_d.note_plan(st, 'overlay', now=10000 - 1200)
            self.assertEqual(plan_d.cache_ttl(st, 'overlay', now=10000), '5m')
            plan_d.note_plan(st, 'overlay', now=10000 - 300)
            self.assertEqual(plan_d.cache_ttl(st, 'overlay', now=10000), '1h')
            self.assertEqual(plan_d.cache_ttl(st, 'editorial', now=10000), '5m')
            self.assertEqual(len(plan_d.load_state(st)['overlay']), 2)
        req = prompt.request(INPUT, 'overlay', CAT, ttl='1h')
        self.assertEqual(req['system'][0]['cache_control'], {'type': 'ephemeral', 'ttl': '1h'}); self.assertEqual(req['fallbacks'], 'default')
        h = prompt.request(INPUT, 'overlay', CAT, model='claude-haiku-5-5')
        self.assertEqual(h['model'], 'claude-haiku-5-5'); self.assertNotIn('fallbacks', h); self.assertNotIn('betas', h)
        from types import SimpleNamespace as NS
        u = NS(input_tokens=10, output_tokens=5, cache_read_input_tokens=0, cache_creation_input_tokens=100,
               cache_creation=NS(ephemeral_1h_input_tokens=100, ephemeral_5m_input_tokens=0))
        rec = plan_d.call_record(NS(usage=u, model='m', stop_reason='end_turn'), 'claude-sonnet-5-5')
        self.assertEqual((rec['cache_write_5m'], rec['cache_write_1h']), (0, 100))

    def test_schema_fits_the_api_limits(self):
        """Real-key test 2026-11-05: the API compiles at most 24 optional properties; the slot object had 78–80."""
        for style in ('editorial', 'overlay'):
            n = 0
            def walk(x):
                nonlocal n
                if isinstance(x, dict):
                    if 'properties' in x: n += sum(k not in x.get('required', []) for k in x['properties'])
                    for v in x.values(): walk(v)
                elif isinstance(x, list):
                    for v in x: walk(v)
            walk(prompt.answer_schema(style, CAT))
            self.assertLessEqual(n, 24, style)

    def test_caption_errors_do_not_start_a_fix_round(self):
        """The plan cannot change subtitle chunks; sending them back only paid for a fix it could not make."""
        import fake_api
        inp = copy.deepcopy(INPUT)
        for c in inp['captions']:   # join one caption's chunks into a single chunk over the hard limit
            if '/' in c['text'] and V.graphemes(c['text'].replace('/', '').replace(' ', '')) > V.RULES['chunkHard']:
                c['text'] = ' '.join(c['text'].replace('/', ' ').split()); break
        else: self.fail('no caption long enough to join')
        for style in ('editorial', 'overlay'):
            fake = fake_api.FakeClient({style: load(EX, f'test18_{style}.answer.json')})
            with tempfile.TemporaryDirectory() as d:
                plan, R, log = plan_d.run(inp, style, d, faces=FACES, render=False, client=fake)
                if style == 'overlay': self.assertIn('sub-chunk', [i['code'] for i in R.issues if i['level'] == 'error'])
                self.assertEqual(len(fake.requests), 1, log); self.assertFalse(any('fix round' in m for m in log))
        self.assertFalse(plan_d.plan_can_fix({'code': 'sub-chunk'}, 'editorial'))
        self.assertTrue(plan_d.plan_can_fix({'code': 'density-low'}, 'overlay'))

    def test_an_empty_first_plan_never_beats_the_fixed_one(self):
        """Real-key test 2026-11-05: the first answer had no scenes, the fixed one did; the empty one was kept."""
        import fake_api
        for style in ('editorial', 'overlay'):
            ans = load(EX, f'test18_{style}.answer.json')
            empty = dict(ans, scenes=[])
            with tempfile.TemporaryDirectory() as d:
                plan, R, log = plan_d.run(INPUT, style, d, faces=FACES, render=False,
                                          client=fake_api.FakeClient({style: empty, style + '.fix': ans}))
                self.assertTrue(plan['scenes'], style); self.assertIn('the first plan was empty; kept the fixed one', log)

    def test_fix_message_names_each_issue(self):
        R = check(broken('editorial', setp(['scenes', 2, 'slots', 'num'], 5)))
        msg = prompt.fix_message([i for i in R.issues if i['level'] == 'error'])
        self.assertIn('number-not-said', msg); self.assertIn('scenes[2]', msg)


class FaceFinder(unittest.TestCase):
    def test_layout_of_the_approved_clip(self):
        clip = os.path.join(CUTPACK, 'library', 'real-test', 'clip_18s.mp4')
        with tempfile.TemporaryDirectory() as d:
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', clip, '-vf', 'fps=2,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920',
                            '-q:v', '2', os.path.join(d, 's%05d.jpg')], check=True)
            files, boxes = faces.detect(d, every=1)
        out = faces.layout(boxes, len(files))
        self.assertGreater(len(boxes), .7 * len(files))
        L = out['layout']
        self.assertEqual(L['subtitleTop'], 1300)
        self.assertTrue(L['shortFits'] and L['narrowFits'])
        self.assertLessEqual(abs(L['widgetPos']['short']['x'] - 240), 15)      # Friend approved short at 240,150
        self.assertEqual(L['widgetPos']['short']['y'], 150)
        self.assertEqual(L['widgetPos']['narrow']['x'], 36)                     # and narrow at 36,400
        self.assertLessEqual(abs(L['widgetPos']['narrow']['y'] - 400), 15)

    def test_head_at_the_top_edge_moves_the_short_widget_to_the_chest(self):
        cases = {'normal face': [345, 70, 735, 590], 'big face': [205, 55, 875, 855], 'face fills the frame': [110, 55, 970, 1240]}
        want = {'normal face': ('chest', 'left'), 'big face': ('chest', 'none'), 'face fills the frame': ('none', 'none')}
        for name, box in cases.items():
            with self.subTest(name):
                out = faces.layout([box] * 5, 5); L = out['layout']
                self.assertEqual((L['shortPlace'], L['narrowSide']), want[name])
                if L['shortPlace'] == 'chest':   # between the zoomed chin and the subtitles, and the checker agrees
                    y = L['widgetPos']['short']['y']
                    self.assertGreaterEqual(y, out['keepOut'][3] + 40); self.assertLessEqual(y + 190, L['subtitleTop'] - 20)
                    p = copy.deepcopy(GOOD['overlay']); p['layout'] = {k: L[k] for k in ('subtitleTop', 'widgetPos')}
                    for s in p['scenes']: s['size'] = 'short'
                    R = check(p, faces=out)
                    self.assertEqual([i for i in R.issues if i['code'].startswith('place')], [])

    def test_no_face_still_leaves_room(self):
        L = faces.layout([], 10)['layout']
        self.assertTrue(L['shortFits'] and L['narrowFits'])


# ---------- AI-written scenes (Friend 2026-11-04: on from day one, no cap) ----------
KIT_EXAMPLES = re.findall(r'```js\n(.*?)```', open(os.path.join(PLAN, 'prompt', 'kit.md')).read(), re.S)
HOSTILE = {
    'climb out of its function': "}); ZOOM.push({t: 1, z: 2}); (() => {",
    'reach the window': "window.fetch('https://x')",
    'reach the page': "document.body.innerHTML = 'x'",
    'randomness': "const x = Math.random();",
    'raw animation': "c.animate([{opacity: 0}], 1000)",
    'load a local file': "div('left:0', c, '<iframe src=\"file:///etc/passwd\"></iframe>')",
    'css url': "div('background:url(file:///etc/passwd)', c)",
    'climb the DOM': "c.parentNode.appendChild(div('', c))",
    'move the camera': "push(1.0)",
    'endless loop': "while (true) {}",
    'make code': "const f = new Function('return 1')",
    'event handler': "div('', c, '<svg onload=\"x()\"></svg>')",
    'tag put together': "div('', c, '<' + 'iframe>')",
    'char codes': "const lt = String.fromCharCode(60);",
    'escape codes': "div('', c, '\\x3ciframe\\x3e')",
}


def custom_plan(style='editorial', code=None):
    if style == 'editorial':
        p = copy.deepcopy(GOOD['editorial'])
        p['scenes'][1] = {'t0': 6.2, 't1': 8.0, 'kind': 'card', 'part': 'custom', 'bg': 'glow', 'hit': 7.0, 'need': 'a ring that closes on 3',
                          'code': KIT_EXAMPLES[0] if code is None else code, 'slots': {'lead': 'แต่คือ', 'key': '3 วินาทีแรก'}}
    else:
        p = copy.deepcopy(GOOD['overlay'])
        p['scenes'][3] = {'t0': 9.6, 't1': 11.0, 'kind': 'widget', 'part': 'custom', 'size': 'short', 'hit': 10.4, 'need': 'a stopwatch',
                          'code': KIT_EXAMPLES[1] if code is None else code, 'slots': {'wlead': 'ภายใน', 'wkey': '3 วินาที'}}
    return p


class PerMoment(unittest.TestCase):
    """Friend 2026-11-05: each widget goes where there is room during its own time — above the head, at chest level,
    beside the head — or is left out; never over the face."""
    LOW, FULL = [300, 600, 780, 1150], [20, 100, 1060, 1700]   # head low in the frame / face filling the frame

    def track(self, split=9.0, dur=18.0):
        return [[round(k * .5, 2), self.LOW if k * .5 < split else self.FULL] for k in range(int(dur * 2) + 1)]

    def test_zoom_follows_the_camera(self):
        import room
        cam = [{'push': 2.0, 'z': 1.06}, {'pull': 6.0}]
        self.assertAlmostEqual(room.zoom_at(cam, 0.5, 1.5), room.BREATH)
        self.assertAlmostEqual(room.zoom_at(cam, 3.0, 4.0), 1.06 * room.BREATH)
        self.assertAlmostEqual(room.zoom_at(cam, 1.0, 3.0), 1.06 * room.BREATH)       # a push inside the widget's time
        self.assertAlmostEqual(room.zoom_at(cam, 6.5, 7.0), 1.06 * room.BREATH)       # the pull is still on its way back
        self.assertAlmostEqual(room.zoom_at(cam, 7.5, 8.0), room.BREATH)

    def test_order_top_then_chest_then_side_then_nothing(self):
        import room
        tr = self.track()
        size, pos, where = room.place(tr, 1.0, 3.0, 'short', [], 1300, self.LOW)
        self.assertEqual((size, where, pos['y']), ('short', 'top', 150))
        self.assertIsNone(room.place(tr, 12.0, 14.0, 'short', [], 1300, self.LOW))   # face fills the frame: left out
        high = [[t, [300, 200, 780, 760]] for t, _ in tr]                             # head high: no room above, chest free
        size, pos, where = room.place(high, 1.0, 3.0, 'short', [], 1300, self.LOW)
        self.assertEqual((size, where), ('short', 'chest')); self.assertGreater(pos['y'], 760)
        wide = [[t, [300, 200, 780, 1200]] for t, _ in tr]                            # head high and long: only beside it
        self.assertEqual(room.place(wide, 1.0, 3.0, 'short', [], 1300, self.LOW)[2], 'left')
        self.assertEqual(room.place(tr, 1.0, 3.0, 'narrow', [], 1300, self.LOW)[2], 'left')   # the AI's size first

    def test_plan_places_each_widget_and_leaves_out_the_ones_with_no_room(self):
        # room for about 16 of 18 s: not a tight clip, so a widget with no room is left out
        inp = copy.deepcopy(INPUT); inp['track'] = self.track(split=16.5); inp['faceBox'] = self.LOW
        faces = dict(FACES, track=inp['track'], face=self.LOW)
        ans = load(EX, 'test18_overlay.answer.json')
        plan = assemble.assemble(inp, ans, 'overlay')
        early = [s for s in plan['scenes'] if s['t1'] <= 15.0]
        late = [s for s in plan['scenes'] if s['t0'] >= 16.0]
        self.assertTrue(early and late)
        self.assertTrue(all(s.get('pos') for s in early)); self.assertTrue(all(not s.get('pos') for s in late))
        R, _ = V.validate(plan, CAT, faces, render=False)
        self.assertIn('place-nofit', [i['code'] for i in R.blocking])
        self.assertNotIn('place-face', [i['code'] for i in R.issues])
        fixed, R2 = fallback.repair(plan, CAT, faces, render=False)
        self.assertEqual(R2.blocking, [])
        self.assertTrue(all(s['t1'] <= 16.0 for s in fixed['scenes']))   # the no-room widgets were left out, not swapped
        # density counts only the time with room: the widgets that fit are enough for it
        self.assertNotIn('density-low', [i['code'] for i in R2.issues])
        self.assertNotIn('bare-long', [i['code'] for i in R2.issues])

    def test_tight_clip_shrinks_the_speaker_for_widgets_with_no_room(self):
        """Friend approved the demo 2026-11-05: room for 9 of 18 s → the widgets after 9 s get the speaker shrink."""
        import room
        inp = copy.deepcopy(INPUT); inp['track'] = self.track(split=9.0); inp['faceBox'] = self.LOW
        faces = dict(FACES, track=inp['track'], face=self.LOW)
        plan = assemble.assemble(inp, load(EX, 'test18_overlay.answer.json'), 'overlay')
        late = [s for s in plan['scenes'] if s['t0'] >= 9.5]
        self.assertTrue(late and all(s.get('shrink') and s['pos'] == room.SHRINK['pos'] for s in late))
        R, _ = V.validate(plan, CAT, faces, render=False)
        self.assertEqual([i for i in R.blocking if i['code'].startswith('place')], [])
        js = plan2timeline.convert(plan)
        self.assertEqual(js.count("frame("), len(room.shrink_windows(plan['scenes'], 18.0)))
        self.assertIn("bg: 'glow', s: 0.8", js)
        R, _ = V.validate(plan, CAT, faces, render=True)   # the engine renders the shrink with the widgets on top
        self.assertEqual([i for i in R.blocking], [])

    def test_prompt_lists_the_times_with_room(self):
        inp = copy.deepcopy(INPUT); inp['track'] = self.track(split=16.5); inp['faceBox'] = self.LOW
        text = prompt.clip_text(inp, 'overlay')
        self.assertIn('Times with room for a widget', text); self.assertIn('0.0–', text)
        inp['track'] = self.track(split=9.0)
        self.assertIn('the speaker shrinks', prompt.clip_text(inp, 'overlay'))
        inp['track'] = [[t, self.FULL] for t, _ in inp['track']]
        self.assertIn('the speaker shrinks', prompt.clip_text(inp, 'overlay'))
        self.assertNotIn('Times with room', prompt.clip_text(INPUT, 'overlay'))   # no track: the old whole-clip line


class CustomScenes(unittest.TestCase):
    def test_kit_examples_pass_the_check(self):
        self.assertEqual(len(KIT_EXAMPLES), 2)
        for code in KIT_EXAMPLES: self.assertEqual(custom_check.check(code), [])

    def test_hostile_code_is_refused(self):
        for why, code in HOSTILE.items():
            with self.subTest(why): self.assertTrue(custom_check.check(code), why)

    def test_good_custom_scenes_pass_with_render(self):
        for style in ('editorial', 'overlay'):
            R = check(custom_plan(style), FACES, render=True)
            self.assertEqual([i for i in R.issues if i['level'] == 'error'], [], style)

    def test_converter_never_writes_refused_code(self):
        with self.assertRaises(ValueError): plan2timeline.convert(custom_plan(code=HOSTILE['reach the window']))

    def test_bad_code_is_caught_and_falls_back_to_text(self):
        p = custom_plan(code=HOSTILE['move the camera'])
        R = check(p)
        self.assertIn(('custom-code', 1), [(i['code'], i.get('scene')) for i in R.issues])
        p, R = fallback.repair(p, CAT, render=False)
        self.assertEqual(R.blocking, []); self.assertEqual(p['scenes'][1]['part'][:3], 'B14')

    def test_numbers_drawn_by_custom_code_must_be_said(self):
        code = KIT_EXAMPLES[0] + "\nconst n = div('left:300px;top:1000px;width:400px;font-size:90px;color:#fff', c, '75%');\n"
        R = check(custom_plan(code=code), render=True)
        self.assertIn(('number-not-said', 1), [(i['code'], i.get('scene')) for i in R.issues])

    def test_runtime_cleaner_is_a_second_wall(self):
        """Even if a string slipped past the check, nothing that loads or runs survives in the built scene."""
        sneaky = ("const d = div('left:100px;top:300px;width:600px;height:400px', c, '<' + 'iframe srcdoc=x></iframe><svg on' + 'load=1></svg>');"
                  "const e = div('left:0;top:0;width:9px;height:9px', c); e.setAttribute('style', 'background:ur' + 'l(fi' + 'le:///etc/hostname)');")
        real = custom_check.check
        try:
            custom_check.check = lambda code: []          # pretend the first wall missed it
            js = plan2timeline.convert(custom_plan(code=sneaky), guard=True)
        finally:
            custom_check.check = real
        with tempfile.TemporaryDirectory() as d:
            with open(os.path.join(d, 'timeline.js'), 'w') as f: f.write(js)
            subprocess.run([sys.executable, os.path.join(PLAN, '..', 'core', 'build_scene.py'), d], check=True, capture_output=True)
            r = subprocess.run(['node', os.path.join(HERE, 'dom_probe.js'), d, '7.0', 'iframe', '[onload]', '[style*="url("]'], capture_output=True, text=True, check=True)
        out = json.loads(r.stdout)
        self.assertEqual((out['iframe'], out['[onload]'], out['[style*="url("]']), (0, 0, 0))

    def test_runner_paths(self):
        ans = load(EX, 'test18_editorial.answer.json')
        ans['scenes'][1].update(part='custom', bg='glow', hit=7.0, need='a ring that closes on 3', slots={'lead': 'แต่คือ', 'key': '3 วินาทีแรก'})
        good, bad = {'scenes': [{'i': 1, 'code': KIT_EXAMPLES[0]}]}, {'scenes': [{'i': 1, 'code': HOSTILE['reach the window']}]}
        with tempfile.TemporaryDirectory() as d:
            for codes, fix, want in ((good, None, 'custom'), (bad, good, 'custom'), (bad, None, 'B14')):
                plan, R, log = plan_d.run(INPUT, 'editorial', d, render=False, answer=copy.deepcopy(ans), code_answer=codes, fix_code_answer=fix)
                self.assertEqual(R.blocking, []); self.assertEqual(plan['scenes'][1]['part'][:len(want)], want)
                self.assertEqual(load(d, 'report.json')['library_missing'], ['a ring that closes on 3'])

    def test_code_request_only_for_custom_scenes(self):
        ans = load(EX, 'test18_editorial.answer.json')
        self.assertIn('custom', prompt.answer_schema('editorial', CAT)['properties']['scenes']['items']['properties']['part']['enum'])
        self.assertEqual(plan_d.write_codes(None, INPUT, 'editorial', copy.deepcopy(ans), CAT, [], []), (None, None))
        ans['scenes'][1].update(part='custom', need='a ring')
        req = prompt.code_request(INPUT, 'editorial', ans, CAT)
        self.assertIn('## scene 1 · card', req['messages'][0]['content']); self.assertNotIn('## scene 0', req['messages'][0]['content'])
        other = prompt.code_request(dict(INPUT, clip=dict(INPUT['clip'], duration=40)), 'editorial', ans, CAT)
        self.assertEqual(req['system'], other['system'])   # the kit block is cached: the same for every clip


def biz_answer(style):
    """The approved 18 s answer as a biz clip would plan it: the views drop on the business pack's view counter."""
    ans = load(EX, f'test18_{style}.answer.json')
    k = next(i for i, x in enumerate(ans['scenes']) if x['part'] == 'B02.v1')
    ans['scenes'][k]['part'] = 'B02.biz1'
    return ans, k


class TopicPacks(unittest.TestCase):
    """Friend's four topic packs in plan D (2026-11-05): catalog, prompt, checker and the whole planning step."""
    def test_catalog_has_every_kept_piece(self):
        for key in ('cards', 'widgets'):
            ps = [p for p in CAT[key] if p.get('pack')]
            self.assertEqual(len(ps), 44, key)
            self.assertEqual({p['pack'] for p in ps}, set(CAT['packs']))
            for p in ps:
                self.assertRegex(p['code'], r'^(BIZ|FIN|FIT|EDU)-[PH]\d$')
                if '.h' in p['id']:   # hero parts: the sentence they are for, and a note on every slot but lead/key
                    self.assertTrue(p.get('when'), p['id'])
                    for k, spec in p['slots'].items():
                        if k not in ('lead', 'key', 'unit', 'pre'): self.assertTrue(spec.get('note') or spec['type'] == 'text' and spec.get('req'), f"{p['id']} {k}")
        self.assertEqual(sorted(CAT['packs']), ['biz', 'edu', 'fin', 'fit'])

    def test_prompt_lists_topics_and_asks_for_one(self):
        for style in ('editorial', 'overlay'):
            text = prompt.system_text(style, CAT)
            self.assertIn('# Topic (decide it first)', text)
            for pid in CAT['packs']: self.assertIn(f'## topic {pid} (', text)
            self.assertIn('### BIZ.h1 — for ', text); self.assertIn('· topic fit · only for: ', text)
            sch = prompt.answer_schema(style, CAT)
            self.assertEqual(sch['required'][0], 'topic')
            self.assertEqual(sch['properties']['topic']['enum'], ['biz', 'edu', 'fin', 'fit', 'none'])
            import jsonschema
            jsonschema.validate(prompt.slots_to_list(biz_answer(style)[0]), sch)
            slot = sch['properties']['scenes']['items']['properties']['slots']['items']['properties']
            self.assertIn('rows', slot['name']['enum'])
            self.assertIn({'type': 'array', 'items': {'type': 'object', 'properties': {'t': {'type': 'string'}, 'v': {'type': 'number'}, 'in': {'type': 'boolean'}},
                                                      'required': ['t', 'v', 'in'], 'additionalProperties': False}}, slot['value']['anyOf'])

    def test_pack_plan_passes_with_render(self):
        for style in ('editorial', 'overlay'):
            ans, k = biz_answer(style)
            p = assemble.assemble(INPUT, ans, style)
            self.assertEqual(p['topic'], 'biz')
            R = check(p, FACES, render=True)
            self.assertEqual([i for i in R.issues if i['level'] == 'error'], [], style)

    def test_undrawn_sizes_and_positions_are_not_facts(self):
        p = broken('editorial', to_pack('FIT.h1', {'names': ['ผัก', 'โปรตีน', 'แป้ง'], 'shares': [2, 1, 1], 'focus': 0}, 'fit'))
        self.assertNotIn('number-not-said', {i['code'] for i in check(p).issues})
        p = broken('editorial', to_pack('FIN.h2', {'names': ['ใช้', 'เก็บ'], 'shares': [3, 3], 'focus': 1}, 'fin'))
        self.assertEqual([i for i in check(p).issues if i['level'] == 'error'], [])

    def test_planning_step_with_a_pack_answer(self):
        """plan_d end to end with the stand-in API: the topic and the pack part survive the checks; a wrong topic falls back."""
        import fake_api
        for style in ('editorial', 'overlay'):
            ans, k = biz_answer(style)
            with tempfile.TemporaryDirectory() as d:
                plan, R, log = plan_d.run(INPUT, style, d, faces=FACES, render=True, client=fake_api.FakeClient({style: ans}))
                self.assertEqual(R.blocking, [], style); self.assertEqual(plan['topic'], 'biz')
                self.assertIn('B02.biz1', [x['part'] for x in plan['scenes']])
                self.assertEqual((load(d, 'report.json')['topic'], load(d, 'run.json')['topic']), ('biz', 'biz'))
            wrong = dict(ans, topic='fit')
            with tempfile.TemporaryDirectory() as d:   # asked to fix once (the stand-in answers the same), then the B14 fallback
                plan, R, log = plan_d.run(INPUT, style, d, faces=FACES, render=False, client=fake_api.FakeClient({style: wrong}))
                self.assertEqual(R.blocking, []); self.assertNotIn('B02.biz1', [x['part'] for x in plan['scenes']])
                self.assertTrue(any('topic-part' in line for line in plan['fallbackLog']), plan['fallbackLog'])


@unittest.skipUnless(os.environ.get('CUTPACK_SLOW'), 'set CUTPACK_SLOW=1 to sweep the whole library')
class Library(unittest.TestCase):
    def test_whole_library_renders_clean(self):
        r = subprocess.run([sys.executable, os.path.join(HERE, 'library_sweep.py')], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stdout[-3000:])


if __name__ == '__main__':
    unittest.main()
