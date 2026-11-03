#!/usr/bin/env python3
"""Build a keep / tweak / drop gallery page for base-part variants, straight from the part code.

Names and "what happens on the key word" come from each PART(...) meta in engine/styles/editorial/parts/*.js;
the two example sentences come from samples.json; the save code is the tested one from ../base-list/base-list.html
(controls stay off until the store answers; a choice shows only after the store confirms it).

usage: make_gallery.py [--widgets] <out.html> <clip_dir_as_published> <collection> <title> <cat> [<cat> ...]
  --widgets: list the overlay widgets (WIDGET(...) in widgets/*.js); clip _0 is the short size, _1 the narrow size
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PARTS = os.path.join(HERE, '..', '..', 'engine', 'styles', 'editorial', 'parts')
CAT_NAMES = {'B01': 'ตัวเลขเด่น', 'B02': 'เพิ่มขึ้น / ลดลง', 'B03': 'เปรียบเทียบ / ก่อนกับหลัง', 'B04': 'ขั้นตอน / เช็กลิสต์',
             'B05': 'ถูกกับผิด / "ไม่ใช่ X แต่เป็น Y"', 'B06': 'คำถาม / ความสงสัย', 'B07': 'ปัญหา / คำเตือน', 'B08': 'เป้าหมาย / ผลลัพธ์ / สำเร็จ',
             'B09': 'เวลา / ไทม์ไลน์ / เส้นตาย', 'B10': 'คน / กลุ่มเป้าหมาย', 'B11': 'คำพูด / แชต / รีวิว', 'B12': 'เหตุกับผล',
             'B13': 'ไอเดีย / เคล็ดลับ / ความลับ', 'B14': 'ประโยคเด็ดตัวใหญ่', 'B15': 'ปิดคลิป / ชวนทำต่อ'}


WIDGETS = False


def variants(cat):
    if WIDGETS:
        import glob
        src = '\n'.join(open(f).read() for f in sorted(glob.glob(os.path.join(PARTS, '..', 'widgets', '*.js'))))
    else:
        src = open(os.path.join(PARTS, cat + '.js')).read()
    out = []
    for m in re.finditer(r"%s\('%s',\s*'(v\d+)',\s*\{name:\s*'([^']*)'.*?hit:\s*'([^']*)'" % ('WIDGET' if WIDGETS else 'PART', cat), src, re.S):
        out.append([m.group(1), m.group(2), m.group(3)])
    return out


def main():
    global WIDGETS
    args = sys.argv[1:]
    if args and args[0] == '--widgets': WIDGETS = True; args = args[1:]
    out, clipdir, coll, title, *cats = args
    base = open(os.path.join(HERE, '..', 'base-list', 'base-list.html')).read()
    style = re.search(r'<style>(.*?)</style>', base, re.S).group(1)
    save = base[base.index('// Saving:'):base.index('</script>')]
    save = save.replace("db.collection('base')", f"db.collection('{coll}')").replace('หมวดที่มีกรอบสีบันทึกไว้แล้ว', 'แบบที่มีกรอบสีบันทึกไว้แล้ว').replace('รอให้กรอบของหมวดเปลี่ยนสี', 'รอให้กรอบของแบบนั้นเปลี่ยนสี')
    assert save.count(f"collection('{coll}')") == 2
    samples = json.load(open(os.path.join(HERE, 'samples.json')))
    pre = ['ขนาดเตี้ย (เหนือหัว) · ', 'ขนาดแคบ (ข้างหัว) · '] if WIDGETS else ['', '']
    data = [[c, CAT_NAMES[c], variants(c), [pre[i] + s['topic'] + ': "' + s['say'] + '"' for i, s in enumerate(samples[c])]] for c in cats]
    n = sum(len(d[2]) for d in data)
    style += """
.cat-h { display: grid; gap: 4px; }
.vgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 16px; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.clip { position: relative; aspect-ratio: 9 / 16; max-width: 100%; border-radius: 10px; overflow: hidden; background: #000 center / cover; }
.clip video { width: 100%; height: 100%; object-fit: cover; display: block; }
.cap { font-size: 12px; line-height: 1.4; color: var(--muted); }
@media (prefers-reduced-motion: reduce) { .clip video { display: none; } }
"""
    page = f"""<title>{title}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mitr:wght@500;600&family=IBM+Plex+Sans+Thai:wght@400;500;600&display=swap">
<style>{style}</style>

<div class="wrap">
  <header class="lead">
    <h1>{title}</h1>
    <p>{{INTRO}}</p>
    <p>กด <b>เอา</b> / <b>ปรับ</b> / <b>ตัด</b> ใต้แต่ละแบบ ถ้ากด "ปรับ" ให้พิมพ์ในหมายเหตุว่าอยากปรับอะไร คลิปไม่มีเสียง</p>
  </header>

  <div class="bar" role="status" aria-live="polite">
    <span class="count"><span class="dot keep"></span>เอา <span id="n-keep">0</span></span>
    <span class="count"><span class="dot tweak"></span>ปรับ <span id="n-tweak">0</span></span>
    <span class="count"><span class="dot drop"></span>ตัด <span id="n-drop">0</span></span>
    <span class="count"><span class="dot none"></span>ยังไม่เลือก <span id="n-none">{n}</span></span>
    <p class="banner" id="status" data-state="wait">กำลังเชื่อมต่อที่เก็บข้อมูล… ปุ่มจะกดได้เมื่อแถบนี้เปลี่ยนเป็นสีเขียว</p>
  </div>

  <div id="cats" style="display:grid;gap:32px"></div>

  <section class="general" aria-labelledby="gen-h">
    <h2 id="gen-h">ความเห็นรวม</h2>
    <p class="when">เช่น ภาพรวมแน่นไปหรือโล่งไป ความเร็ว สี หรือหมวดที่อยากให้มีแบบเพิ่ม</p>
    <p class="saved" id="saved-_general"></p>
    <textarea id="note-_general" placeholder="ความเห็นรวม (ไม่บังคับ)" aria-label="ความเห็นรวม"></textarea>
  </section>
</div>

<script>
const CLIPS = {json.dumps(clipdir)};
const CATS = {json.dumps(data, ensure_ascii=False)};
const LABEL = {{keep: 'เอา', tweak: 'ปรับ', drop: 'ตัด'}};
const $ = s => document.querySelector(s);
const IDS = [];
CATS.forEach(([cat, name, vars, topics]) => {{
  const sec = document.createElement('section'); sec.style.cssText = 'display:grid;gap:14px';
  sec.innerHTML = `<div class="cat-h"><span class="code">${{cat}}</span><h2></h2></div><div class="vgrid"></div>`;
  sec.querySelector('h2').textContent = name;
  vars.forEach(([v, vname, hit]) => {{
    const id = `${{cat}}-${{v}}`; IDS.push(id);
    const el = document.createElement('article'); el.className = 'cat'; el.dataset.id = id;
    el.innerHTML = `
      <div class="head"><span class="code">${{v}}</span><h3></h3></div>
      <div class="pair">${{[0, 1].map(i => `<div style="display:grid;gap:4px;min-width:0"><div class="clip" style="background-image:url(${{CLIPS}}/${{cat}}_${{v}}_${{i}}.jpg)"><video src="${{CLIPS}}/${{cat}}_${{v}}_${{i}}.mp4" poster="${{CLIPS}}/${{cat}}_${{v}}_${{i}}.jpg" muted loop playsinline preload="metadata" aria-label="คลิปตัวอย่าง ${{id}} เรื่องที่ ${{i + 1}}"></video></div><p class="cap"></p></div>`).join('')}}</div>
      <p class="when"><b>ตรงคำสำคัญ:</b> <span class="hit"></span></p>
      <div class="act">
        <div class="seg" role="group" aria-label="เลือกสำหรับ ${{id}}">
          <button type="button" data-v="keep" aria-pressed="false">เอา</button>
          <button type="button" data-v="tweak" aria-pressed="false">ปรับ</button>
          <button type="button" data-v="drop" aria-pressed="false">ตัด</button>
        </div>
        <p class="saved" id="saved-${{id}}"></p>
        <textarea id="note-${{id}}" rows="1" placeholder="หมายเหตุ (ไม่บังคับ)" aria-label="หมายเหตุสำหรับ ${{id}}"></textarea>
      </div>`;
    el.querySelector('h3').textContent = vname;
    el.querySelector('.hit').textContent = hit;
    el.querySelectorAll('.cap').forEach((p, i) => {{ p.textContent = topics[i]; }});
    el.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => choose(id, b.dataset.v)));
    sec.querySelector('.vgrid').appendChild(el);
  }});
  $('#cats').appendChild(sec);
}});
IDS.push('_general');
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {{ const v = e.target; if (e.isIntersecting) v.play().catch(() => {{}}); else v.pause(); }}), {{threshold: .35}}) : null;
document.querySelectorAll('video').forEach(v => io ? io.observe(v) : v.play().catch(() => {{}}));

{save}</script>
"""
    intro = (f'{len(cats)} หมวด รวม <b>{n} วิดเจ็ต</b> แบบ overlay หน้าคนพูดอยู่บนจอตลอด การ์ดขาวเล็กเด้งขึ้นในที่ว่าง แต่ละวิดเจ็ตมี <b>2 ขนาด</b>: ขนาดเตี้ยวางเหนือหัว (คลิปซ้าย) และขนาดแคบวางข้างหัว (คลิปขวา) ซับอยู่ระดับอกเหมือนคลิปจริง' if WIDGETS else
             f'{len(cats)} หมวด รวม <b>{n} แบบ</b> เป็นการ์ดเต็มจอของสไตล์ editorial เรนเดอร์บนคลิปตัวอย่างของคุณ ทำตามกฎที่จดไว้จากรอบแรก: พื้นเข้มใช้ดำเรืองแสงเสมอ ตัวอักษรไม่ทับกัน กราฟไม่สั่น และภาพขยับไปทางเดียวกับความหมาย แต่ละแบบมี <b>2 คลิป</b> ใส่เนื้อหาคนละเรื่องและคนละสีพื้น')
    page = page.replace('{INTRO}', intro)
    open(out, 'w').write(page)
    print(out, n, 'variants')


if __name__ == '__main__':
    main()
