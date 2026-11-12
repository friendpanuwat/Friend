"""A stand-in for anthropic.Anthropic() so the whole pipeline can run, API code paths included, without a key or cost.

FakeClient(answers) answers client.beta.messages.create(**req) from saved answers, chosen by what the request asks for:
  "captions"   the caption request (plan/captions.py, Haiku); missing → the rule grouping, sent back in answer form
  "editorial" / "overlay"   the scene-plan request (plan/prompt.py request, told apart by the answer schema)
  "<style>.fix"             the fix round (the request has more than one message); missing → the first answer again
  "<style>.code" / "code"   the scene-code request (plan/prompt.py code_request)
A value may also be the string "refuse" (stop_reason refusal) or "garbage" (text that is not JSON), to test failures.
Token counts are estimates (characters / 3, the system block read from cache after its first use): they only check
that usage is logged and summed; real counts come from the API. Every request is kept in .requests for tests.
"""
import json
from types import SimpleNamespace as NS


class FakeClient:
    def __init__(self, answers=None):
        self.answers, self.requests, self._cached = dict(answers or {}), [], set()
        self.beta = NS(messages=NS(create=self.create))

    def kind(self, req):
        props = req.get('output_config', {}).get('format', {}).get('schema', {}).get('properties', {})
        if 'lines' in props: return 'captions'
        if 'camera' not in props: return 'code'
        style = 'editorial' if 'bg' in props['scenes']['items']['properties'] else 'overlay'
        return style + ('.fix' if len(req['messages']) > 1 else '')

    def answer(self, req, kind):
        if kind == 'captions' and kind not in self.answers:
            import captions
            words = [ln.split(' | ') for ln in req['messages'][0]['content'].split('\n')[1:] if ' | ' in ln and not ln.startswith(' ')]
            fake = [{'w': w[2], 't0': float(w[1]), 't1': float(w[1]) + 0.2} for w in words]
            return captions.answer_form(captions.by_rule(fake))
        if kind.endswith('.fix') and kind not in self.answers: kind = kind[:-4]
        if kind == 'code':
            for k in ('editorial.code', 'overlay.code', 'code'):
                if k in self.answers: return self.answers[k]
            return {'scenes': []}
        return self.answers.get(kind)

    def create(self, **req):
        self.requests.append(req)
        kind = self.kind(req)
        ans = self.answer(req, kind)
        system = req.get('system')
        sys_text = system if isinstance(system, str) else ''.join(b.get('text', '') for b in system or [])
        msgs = ''.join(m['content'] if isinstance(m['content'], str) else json.dumps(m['content'], default=str) for m in req['messages'])
        key = (req['model'], sys_text)
        cached = isinstance(system, list) and key in self._cached
        if isinstance(system, list): self._cached.add(key)
        stop, text = 'end_turn', json.dumps(ans, ensure_ascii=False)
        if ans == 'refuse': stop, text = 'refusal', ''
        elif ans == 'garbage': text = 'Sure! Here is the plan you asked for.'
        elif ans is None: stop, text = 'refusal', ''
        return NS(model=req['model'], stop_reason=stop, stop_details=NS(category='test') if stop == 'refusal' else None,
                  content=[NS(type='text', text=text)],
                  usage=NS(input_tokens=len(msgs) // 3 + (0 if isinstance(system, list) else len(sys_text) // 3),
                           output_tokens=max(1, len(text) // 3),
                           cache_read_input_tokens=len(sys_text) // 3 if cached else 0,
                           cache_creation_input_tokens=len(sys_text) // 3 if isinstance(system, list) and not cached else 0))
