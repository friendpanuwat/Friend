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
import validate as V, render_check, fallback, assemble, prompt, plan2timeline, faces

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
            self.assertEqual([{k: v for k, v in s.items() if k != 'say'} for s in p['scenes']], plan['scenes'], style)
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
            jsonschema.validate(load(EX, f'test18_{style}.answer.json'), prompt.answer_schema(style, CAT))

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

    def test_no_face_still_leaves_room(self):
        L = faces.layout([], 10)['layout']
        self.assertTrue(L['shortFits'] and L['narrowFits'])


@unittest.skipUnless(os.environ.get('CUTPACK_SLOW'), 'set CUTPACK_SLOW=1 to sweep the whole library')
class Library(unittest.TestCase):
    def test_whole_library_renders_clean(self):
        r = subprocess.run([sys.executable, os.path.join(HERE, 'library_sweep.py')], capture_output=True, text=True)
        self.assertEqual(r.returncode, 0, r.stdout[-3000:])


if __name__ == '__main__':
    unittest.main()
