"""Tests for the caption step and the whole-clip runner, with the stand-in API (fake_api.py): no key, no cost.

python3 -m unittest discover -s cutpack/engine/plan/tests -v      (CUTPACK_SLOW=1 also renders both styles to MP4)
"""
import json, os, shutil, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.dirname(HERE)
ENGINE = os.path.dirname(PLAN)
CUTPACK = os.path.dirname(ENGINE)
sys.path[:0] = [PLAN, ENGINE]
import captions as C, fake_api, validate

REAL1 = os.path.join(CUTPACK, 'library', 'real-test', 'real1', 'input.json')
EX = os.path.join(PLAN, 'examples')
CLIP18 = os.path.join(CUTPACK, 'library', 'real-test', 'clip_18s.mp4')


def W(*rows):
    """words from (text, start) pairs, each lasting until the next starts (0.3 s for the last)."""
    out = []
    for i, (w, t) in enumerate(rows):
        out.append({'w': w, 't0': t, 't1': rows[i + 1][1] if i + 1 < len(rows) else t + .3})
    return out


class Captions(unittest.TestCase):
    def test_hand_captions_round_trip(self):
        """The real clip's checked captions, written as word numbers, come back word for word with matching times."""
        import prompt
        d = json.load(open(REAL1))
        k, lines = 0, []
        for c in d['captions']:
            ends = []
            for ch in c['text'].split('/'):
                k += len(ch.split()); ends.append(k - 1)
            lines.append({'chunk_ends': ends})
        got, why = C.check(d['words'], {'lines': lines})
        self.assertIsNone(why)
        caps = C.build(d['words'], got, d['clip']['duration'])
        self.assertEqual([c['text'] for c in caps], [c['text'] for c in d['captions']])
        starts = {w['t0'] for w in d['words']}
        for c, toks in prompt.token_times(dict(d, captions=caps)):
            self.assertTrue(all(t is None or t in starts for _, t in toks), c['text'])

    def test_bad_answers_are_refused(self):
        words = W(('a', 0), ('b', .5), ('c', 1), ('d', 1.5))
        for ans, why in [({'lines': [{'chunk_ends': [2, 1]}, {'chunk_ends': [3]}]}, 'go up'),
                         ({'lines': [{'chunk_ends': [1]}]}, 'last chunk'),
                         ({'lines': [{'chunk_ends': []}]}, 'empty'),
                         ({'nope': 1}, 'no lines')]:
            got, msg = C.check(words, ans)
            self.assertIsNone(got); self.assertIn(why, msg)

    def test_rules(self):
        words = W(('ขายได้', 0), ('1,200', .5), ('ชิ้น', .9), ('ในเดือนเดียว', 1.2), ('ทั้งที่', 2.6), ('โพสต์ทุกวัน', 3.0))
        words[3]['t1'] = 2.0   # a 0.6 s pause before ทั้งที่ → a new line
        caps = C.build(words, C.by_rule(words), 4)
        self.assertEqual(len(caps), 2, caps)
        self.assertIn('1,200 ชิ้น', caps[0]['text'])   # a number keeps its unit
        for c in caps:
            for ch in c['text'].split('/'):
                if len(ch.split()) > 1: self.assertLessEqual(validate.graphemes(ch.replace(' ', '')), validate.RULES['chunkMax'])

    def test_rules_on_the_real_clip_pass_the_checker_limits(self):
        d = json.load(open(REAL1))
        caps = C.build(d['words'], C.by_rule(d['words']), d['clip']['duration'])
        self.assertEqual(' '.join(c['text'].replace(' / ', ' ') for c in caps).split(), [C.token(w) for w in d['words']])
        for c in caps:
            for ch in c['text'].split('/'):
                self.assertLessEqual(validate.graphemes(ch.replace(' ', '')), validate.RULES['chunkHard'], ch)

    def test_api_path_and_failures(self):
        d = json.load(open(REAL1))
        fake = fake_api.FakeClient()
        caps, info = C.run(d['words'], d['clip']['duration'], client=fake)
        self.assertEqual(info['source'], 'ai')
        self.assertEqual([c['stage'] for c in info['calls']], ['group'])
        self.assertEqual(fake.requests[0]['model'], 'claude-haiku-5-5')
        self.assertEqual(fake.requests[0]['thinking'], {'type': 'disabled'})
        for bad in ('refuse', 'garbage', {'lines': [{'chunk_ends': [0]}]}):
            caps, info = C.run(d['words'], d['clip']['duration'], client=fake_api.FakeClient({'captions': bad}))
            self.assertEqual(info['source'], 'rules', bad); self.assertTrue(caps)
        fake = fake_api.FakeClient()
        caps, info = C.run(d['words'], client=False)
        self.assertEqual((info['source'], fake.requests), ('rules', []))


class NoKey(unittest.TestCase):
    def test_missing_credentials_become_a_logged_failure(self):
        """With no key, token or profile the SDK raises TypeError before sending: plan D must fall back, not crash."""
        import plan_d
        from types import SimpleNamespace as NS
        def create(**req): raise TypeError('"Could not resolve authentication method. Expected one of api_key, auth_token, or credentials to be set."')
        ans, resp, why = plan_d.ask(NS(beta=NS(messages=NS(create=create))), {})
        self.assertEqual((ans, resp, why), (None, None, 'no API key in the environment'))
        def broken(**req): raise TypeError('create() got an unexpected keyword argument')
        with self.assertRaises(TypeError): plan_d.ask(NS(beta=NS(messages=NS(create=broken))), {})


class Runner(unittest.TestCase):
    """The 18 s clip through every step with the approved plans as the stand-in API's answers."""
    @classmethod
    def setUpClass(cls):
        import run_clip
        cls.tmp = tempfile.mkdtemp(prefix='cutpack-run-')
        inp = json.load(open(os.path.join(EX, 'test18_input.json')))
        cls.words = os.path.join(cls.tmp, 'words.json'); json.dump({'words': inp['words']}, open(cls.words, 'w'))
        cls.caps = os.path.join(cls.tmp, 'captions.json'); json.dump({'captions': inp['captions']}, open(cls.caps, 'w'))
        ans = {s: json.load(open(os.path.join(EX, f'test18_{s}.answer.json'))) for s in ('editorial', 'overlay')}
        cls.fake = fake_api.FakeClient(ans)
        cls.log = os.path.join(cls.tmp, 'runs.jsonl')
        slow = bool(os.environ.get('CUTPACK_SLOW'))
        cls.res = run_clip.run(CLIP18, os.path.join(cls.tmp, 'work'), customer='friend-test', words_file=cls.words,
                               captions_file=cls.caps, stop_after=None if slow else 'plan', log_path=cls.log, client=cls.fake)
        cls.slow = slow

    @classmethod
    def tearDownClass(cls):
        shutil.rmtree(cls.tmp, ignore_errors=True)

    def test_plans_match_the_approved_ones(self):
        for style in ('editorial', 'overlay'):
            r = self.res['results'][style]
            self.assertEqual(r['status'], 'ok' if self.slow else 'planned', r['log'])
            got = json.load(open(os.path.join(self.tmp, 'work', style, 'plan.json')))
            want = json.load(open(os.path.join(EX, f'test18_{style}.json')))
            self.assertEqual([(s['part'], s['t0'], s['t1']) for s in got['scenes']], [(s['part'], s['t0'], s['t1']) for s in want['scenes']])
            if self.slow: self.assertTrue(os.path.getsize(r['mp4']) > 100000)

    def test_log_lines_feed_the_cost_report(self):
        rows = [json.loads(l) for l in open(self.log)]
        self.assertEqual([r['clip'] for r in rows], ['clip_18s:editorial', 'clip_18s:overlay'])
        for r in rows:
            self.assertEqual(r['status'], 'ok'); self.assertEqual(r['captions'], 'customer')
            self.assertEqual([c['stage'] for c in r['calls']], ['scene'])
            self.assertTrue({'frames', 'faces', 'plan'} <= set(r['stages']))
        sys.path.insert(0, os.path.join(CUTPACK, 'cost-test'))
        import cost_model, io, contextlib
        with contextlib.redirect_stdout(io.StringIO()): out = cost_model.report(self.log)
        self.assertEqual(len(out), 2)

    def test_layout_comes_from_the_face_finder(self):
        inp = json.load(open(os.path.join(self.tmp, 'work', 'input.json')))
        self.assertEqual(inp['layout']['subtitleTop'], 1300)
        self.assertEqual(inp['layout']['widgetPos']['short'], {'x': 240, 'y': 150})


if __name__ == '__main__':
    unittest.main()
