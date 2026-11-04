"""Tests for the transcription words, the caption step and the whole-clip runner, with the stand-in API (fake_api.py):
no key, no cost.

python3 -m unittest discover -s cutpack/engine/plan/tests -v      (CUTPACK_SLOW=1 also renders both styles to MP4)
"""
import json, os, shutil, sys, tempfile, unittest

HERE = os.path.dirname(os.path.abspath(__file__))
PLAN = os.path.dirname(HERE)
ENGINE = os.path.dirname(PLAN)
CUTPACK = os.path.dirname(ENGINE)
sys.path[:0] = [PLAN, ENGINE]
import asr, captions as C, fake_api, validate

REAL1 = os.path.join(CUTPACK, 'library', 'real-test', 'real1', 'input.json')
EX = os.path.join(PLAN, 'examples')
CLIP18 = os.path.join(CUTPACK, 'library', 'real-test', 'clip_18s.mp4')


def W(*rows):
    """words from (text, start) pairs, each lasting until the next starts (0.3 s for the last)."""
    out = []
    for i, (w, t) in enumerate(rows):
        out.append({'w': w, 't0': t, 't1': rows[i + 1][1] if i + 1 < len(rows) else t + .3})
    return out


def load(p):
    with open(p) as f: return json.load(f)


class Words(unittest.TestCase):
    """Typhoon's pieces (as the real run gave them) → whole words."""
    PIECES = [('ไอ', 1.0), ('เด', 1.08), ('ีย', 1.16), ('ที่', 1.3), ('อยาก', 1.4), ('เฮ', 1.6), ('้ย', 1.68),
              ('M', 2.0), ('a', 2.04), ('r', 2.08), ('k', 2.12), ('s', 2.16), ('ack', 2.2), ('aber', 2.3), ('ก็', 3.5)]

    def words(self, text):
        return asr.to_words([{'w': w, 't0': t, 't1': t + .08} for w, t in self.PIECES], text)

    def test_syllables_and_english_are_joined_back(self):
        got = self.words('ไอเดียที่อยากเฮ้ย Marks ackaber ก็')
        texts = [w['w'] for w in got]
        self.assertIn('ไอเดีย', texts); self.assertIn('เฮ้ย', texts)
        self.assertIn('Marks', texts); self.assertIn('ackaber', texts)
        self.assertEqual(''.join(texts), ''.join(w for w, _ in self.PIECES))
        self.assertFalse([w for w in texts if w[0] in asr.DEP or w[-1] in asr.LEAD])

    def test_times_go_forward_and_a_pause_ends_a_word(self):
        got = self.words('ไอเดียที่อยากเฮ้ย Marks ackaber ก็')
        self.assertTrue(all(w['t1'] > w['t0'] for w in got), got)
        self.assertTrue(all(a['t0'] <= b['t0'] for a, b in zip(got, got[1:])))
        ack, ko = got[-2], got[-1]
        self.assertLess(ack['t1'], ko['t0'] - 0.3)   # the 1.2 s pause before ก็ stays a pause

    def test_text_that_does_not_match_still_gives_whole_syllables(self):
        got = self.words('something else')
        self.assertFalse([w['w'] for w in got if w['w'][0] in asr.DEP or w['w'][-1] in asr.LEAD])


class Captions(unittest.TestCase):
    def test_hand_captions_round_trip(self):
        """The real clip's checked captions, written as word numbers, come back word for word with matching times."""
        import prompt
        d = load(REAL1)
        k, lines = 0, []
        for c in d['captions']:
            line = []
            for ch in c['text'].split('/'):
                n = len(ch.split()); line.append(list(range(k, k + n))); k += n
            lines.append(line)
        got, why = C.check(d['words'], C.answer_form(lines))
        self.assertIsNone(why)
        caps, phrases = C.build(d['words'], got, d['clip']['duration'])
        self.assertEqual([c['text'] for c in caps], [c['text'] for c in d['captions']])
        self.assertEqual([p['w'] for p in phrases], [C.token(w) for w in d['words']])
        starts = {w['t0'] for w in phrases}
        for c, toks in prompt.token_times(dict(d, words=phrases, captions=caps)):
            self.assertTrue(all(t is None or t in starts for _, t in toks), c['text'])

    def test_bad_answers_are_refused(self):
        words = W(('a', 0), ('b', .5), ('c', 1), ('d', 1.5))
        for lines, why in [([[[2, 1]], [[3]]], 'go up'), ([[[1]]], 'last phrase'), ([[[]]], 'empty')]:
            got, msg = C.check(words, C.answer_form(lines))
            self.assertIsNone(got); self.assertIn(why, msg)
        self.assertIn('no lines', C.check(words, {'nope': 1})[1])

    def test_phrases_and_numbers(self):
        words = W(('ขาย', 0), ('ได้', .3), ('1,200', .5), ('ชิ้น', .9), ('ใน', 1.2), ('เดือน', 1.4), ('เดียว', 1.7),
                  ('CK', 2.6), ('Fastwork', 2.9), ('ธุรกิจ', 3.5), ('อะ', 3.9))
        words[6]['t1'] = 2.0   # a 0.6 s pause before CK → a new line
        caps, phrases = C.build(words, C.by_rule(words), 5)
        text = ' / '.join(c['text'] for c in caps)
        self.assertIn('1,200 ชิ้น', text)                          # a number keeps its unit, apart from the Thai
        self.assertIn('CK Fastwork', text)                         # English words never glued together
        self.assertIn('ธุรกิจอะ', text)                             # a particle joins the word before it
        self.assertIn('ขายได้', [p['w'] for p in phrases])         # Thai words written together inside a phrase
        for c in caps:
            for ch in c['text'].split('/'):
                big = ch.split()[-1]
                self.assertNotIn(big, C.PARTICLES)

    def test_rules_on_the_real_clip_keep_every_word_within_the_checker_limits(self):
        d = load(REAL1)
        caps, phrases = C.build(d['words'], C.by_rule(d['words']), d['clip']['duration'])
        self.assertEqual(''.join(c['text'].replace(' / ', '').replace(' ', '') for c in caps), ''.join(C.token(w) for w in d['words']))
        self.assertEqual(sum(len(c['text'].replace(' / ', ' ').split()) for c in caps), len(phrases))
        for c in caps:
            for ch in c['text'].split('/'):
                self.assertLessEqual(validate.graphemes(ch.replace(' ', '')), validate.RULES['chunkHard'], ch)

    def test_api_path_and_failures(self):
        d = load(REAL1)
        fake = fake_api.FakeClient()
        caps, info = C.run(d['words'], d['clip']['duration'], client=fake)
        self.assertEqual(info['source'], 'ai')
        self.assertEqual([c['stage'] for c in info['calls']], ['group'])
        self.assertEqual(fake.requests[0]['model'], 'claude-haiku-5-5')
        self.assertEqual(fake.requests[0]['thinking'], {'type': 'disabled'})
        for bad in ('refuse', 'garbage', C.answer_form([[[0]]])):
            caps, info = C.run(d['words'], d['clip']['duration'], client=fake_api.FakeClient({'captions': bad}))
            self.assertEqual(info['source'], 'rules', bad); self.assertTrue(caps)
        caps, info = C.run(d['words'], client=False)
        self.assertEqual(info['source'], 'rules')


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
        inp = load(os.path.join(EX, 'test18_input.json'))
        cls.words = os.path.join(cls.tmp, 'words.json')
        with open(cls.words, 'w') as f: json.dump({'words': inp['words']}, f)
        cls.caps = os.path.join(cls.tmp, 'captions.json')
        with open(cls.caps, 'w') as f: json.dump({'captions': inp['captions']}, f)
        ans = {s: load(os.path.join(EX, f'test18_{s}.answer.json')) for s in ('editorial', 'overlay')}
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
            got = load(os.path.join(self.tmp, 'work', style, 'plan.json'))
            want = load(os.path.join(EX, f'test18_{style}.json'))
            self.assertEqual([(s['part'], s['t0'], s['t1']) for s in got['scenes']], [(s['part'], s['t0'], s['t1']) for s in want['scenes']])
            self.assertEqual(got['subtitles'], want['subtitles'])
            if self.slow: self.assertTrue(os.path.getsize(r['mp4']) > 100000)

    def test_log_lines_feed_the_cost_report(self):
        with open(self.log) as f: rows = [json.loads(l) for l in f]
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
        inp = load(os.path.join(self.tmp, 'work', 'input.json'))
        self.assertEqual(inp['layout']['subtitleTop'], 1300)
        self.assertEqual(inp['layout']['widgetPos']['short'], {'x': 240, 'y': 150})


if __name__ == '__main__':
    unittest.main()
