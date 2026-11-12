"""build_r12g.py: sketches/r12g.js = head + traced parts (traced.json) + the mic (glt.json) + css + motion code + sentences"""
import json
SP = '/tmp/claude-0/-home-user-Friend/773bbf06-4202-5e86-934e-28b559808177/scratchpad/g3/'
OUT = '/home/user/Friend/cutpack/engine/uni/scenes/lego_r9e.js'
d = json.load(open(SP + 'traced.json'))
data = {k: {'w': v['w'], 'h': v['h'], **({'fade': v['fade']} if v.get('fade') else {}), **({'fw': v['fw']} if v.get('fw') else {}),
            'parts': [{kk: q[kk] for kk in ('n', 'bb', 'pv', 'ab', 'lines', 'body', 'acc', 'accl', 'hl', 'hole') if q.get(kk) not in (None, '')} for q in v['parts']]}
        for k, v in d.items()}
head = '''/* =====================================================================
   CutPack · uni · ROUND 12 (new): 26 base-set drafts drawn the idea sheets' way, with motion. Friend 2026-11-12: "ทำรวดเดียว 37
   เลยครับ" · "แค่ลายเส้นแบบนี้ แต่สีเป็นของแต่ละสไตล์เดิม" · "ไม่ต้องใช้ชุด kit นะ ให้ลอกจากรูปที่ผมส่งให้ไปเลย" · "ลบอันที่เป็นพลุออก" ·
   "เก็บไว้แค่ร่างที่เป็นชุดฐาน (ใช้ได้กับทุกเนื้อหาทุกอย่างในโลกนี้) เท่านั้น" · "ใส่การเคลื่อนไหวให้ 26 ร่างลายเส้น แล้วย้ายเข้าคลัง".
   Every picture is TRACED off Friend's idea sheets (tools/trace: bright line cores → even-odd paths; the body = the lines and what
   they enclose; the key part → the style's accent, the thin lines in it in the accent's own ink) and cut into PARTS that move
   on their own (o place · m turn/scale · c clip). Only the colours are the style's own (--lp-*). Units: px of the sheet crop.
   In the library since 2026-11-12 (round 12). Re-made by tools/trace (trace2.py → traced.json) + the motion code here.
   ===================================================================== */
'''
css = '''(() => {
  if (typeof document === 'undefined' || document.getElementById('lp-css')) return;
  const st = document.createElement('style'); st.id = 'lp-css';
  st.textContent = `
.c-light{--lp-hole:rgba(20,33,61,.13);--lp-hl:rgba(255,255,255,.92);--lp-acc-ink:#14213D;--lp-ink:#14213D;--lp-fill:#FFFFFF;--lp-acc:#DDFF45;--lp-soft:rgba(20,33,61,.45)}
.c-dark{--lp-hole:rgba(0,0,0,.45);--lp-hl:rgba(255,255,255,.92);--lp-acc-ink:#0A0A0A;--lp-ink:#FFFFFF;--lp-fill:#141924;--lp-acc:#DDFF45;--lp-soft:rgba(255,255,255,.45)}
.g-root{--lp-hole:rgba(0,0,0,.4);--lp-hl:rgba(255,255,255,.9);--lp-acc-ink:#FFFFFF;--lp-ink:rgba(235,246,255,.95);--lp-fill:rgba(10,18,34,.85);--lp-acc:rgba(143,211,255,.5);--lp-soft:rgba(235,246,255,.45)}
.g-root .lpg svg,.g-root svg.lpg{filter:drop-shadow(0 0 6px rgba(143,211,255,.55))}
.p-light{--lp-hole:rgba(75,61,110,.14);--lp-hl:rgba(255,255,255,.92);--lp-acc-ink:#2E2448;--lp-ink:#4B3D6E;--lp-fill:#FFFFFF;--lp-acc:#9C84D6;--lp-soft:rgba(75,61,110,.45)}
.p-dark{--lp-hole:rgba(20,12,40,.4);--lp-hl:rgba(255,255,255,.9);--lp-acc-ink:#3A2E5C;--lp-ink:#F1ECFB;--lp-fill:#6F5F97;--lp-acc:#D9CCF6;--lp-soft:rgba(241,236,251,.5)}
.gd{--lp-hole:rgba(0,0,0,.55);--lp-hl:rgba(255,255,255,.9);--lp-acc-ink:#1A0E00;--lp-ink:#F2F2F4;--lp-fill:#141417;--lp-acc:#FF9A2E;--lp-soft:rgba(242,242,244,.45)}
.gd .lp-acc{filter:drop-shadow(0 0 8px rgba(255,140,40,.85))}`;
  document.head.appendChild(st);
})();
'''
glt = json.load(open(SP + 'glt.json'))
out = head + 'const G12D = ' + json.dumps(data, separators=(',', ':')) + ';\n' + \
      '/* the mic of the drop (traced in the trial, sketches/glow1.js): the mic, the impact streaks, the ring lines */\nconst G12MIC = ' + json.dumps(glt, separators=(',', ':')) + ';\n' + \
      css + open(SP + 'r12g_code.js').read() + '\n' + open(SP + 'r12g_sent.js').read()
open(OUT, 'w').write(out); print(len(out) // 1024, 'KiB')
