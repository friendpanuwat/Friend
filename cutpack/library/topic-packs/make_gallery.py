#!/usr/bin/env python3
"""Build the keep / tweak / drop gallery for one content pack, straight from the pack code.

Names and "what happens on the key word" come from each PART(...) meta in engine/styles/editorial/packs/<pack>.js
(via pack_check.items); the two example sentences from samples.json; the look and the save code from the tested
../base-list/base-list.html (controls stay off until the store answers; a choice shows only after the store confirms it).
Clips are <clipdir>/<cat>_<variant>_<0|1>.mp4 + .jpg as make_clips.sh writes them. Choices go to the collection
`variants`, one document per item code (BIZ-P1 …) plus `_general`.

usage: make_gallery.py <pack> <out.html> <clip_dir_as_published>
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import pack_check

PACK_NAMES = {'biz': 'ธุรกิจและการตลาดออนไลน์', 'fin': 'การเงินและการลงทุน', 'fit': 'สุขภาพและฟิตเนส', 'edu': 'ความรู้และพัฒนาตัวเอง'}
BASE_NAMES = {'B01': 'ตัวเลขเด่น', 'B02': 'เพิ่มขึ้น / ลดลง', 'B03': 'เปรียบเทียบ / ก่อนกับหลัง', 'B04': 'ขั้นตอน / เช็กลิสต์',
              'B05': 'ถูกกับผิด', 'B06': 'คำถาม', 'B07': 'ปัญหา / คำเตือน', 'B08': 'เป้าหมาย / สำเร็จ', 'B09': 'เวลา / ไทม์ไลน์',
              'B10': 'คน / กลุ่มเป้าหมาย', 'B11': 'คำพูด / แชต / รีวิว', 'B12': 'เหตุกับผล', 'B13': 'ไอเดีย / เคล็ดลับ',
              'B14': 'ประโยคเด็ด', 'B15': 'ปิดคลิป / ชวนทำต่อ'}
BG_NAMES = {'glow': 'พื้นดำเรืองแสง', 'white': 'พื้นขาว', 'cream': 'พื้นครีม'}


def main():
    pack, out, clipdir = sys.argv[1:4]
    base = open(os.path.join(HERE, '..', 'base-list', 'base-list.html'), encoding='utf-8').read()
    style = re.search(r'<style>(.*?)</style>', base, re.S).group(1)
    save = base[base.index('// Saving:'):base.index('</script>')]
    save = (save.replace("db.collection('base')", "db.collection('variants')").replace('หมวดที่มีกรอบสีบันทึกไว้แล้ว', 'ชิ้นที่มีกรอบสีบันทึกไว้แล้ว')
                .replace('รอให้กรอบของหมวดเปลี่ยนสี', 'รอให้กรอบของชิ้นนั้นเปลี่ยนสี'))
    assert save.count("collection('variants')") == 2
    samples = json.load(open(os.path.join(HERE, 'samples.json'), encoding='utf-8'))
    if pack == 'widgets':   # the overlay widgets of all four packs, one section per pack
        groups = []
        for pk in ('biz', 'fin', 'fit', 'edu'):
            rows = [[code, '_'.join(pid.split('.')), name, hit,
                     [f'ขนาดเตี้ย (เหนือหัว) · {samples[pid][0]["topic"]}: "{samples[pid][0]["say"]}"', f'ขนาดแคบ (ข้างหัว) · {samples[pid][1]["topic"]}: "{samples[pid][1]["say"]}"'], '']
                    for pid, code, name, hit in pack_check.widgets(pk)]
            groups.append([f'ชุด{PACK_NAMES[pk]}', f'{len(rows)} วิดเจ็ต', rows])
        n = sum(len(g[2]) for g in groups)
        title = 'วิดเจ็ตชุดเฉพาะหมวด'
        intro = f'''<p>ทั้ง <b>{n} ชิ้น</b> ของ 4 ชุดที่คุณเก็บไว้ ทำเป็นวิดเจ็ตเล็กของสไตล์ overlay หน้าคนพูดอยู่บนจอตลอด การ์ดขาวเล็กเด้งขึ้นในที่ว่าง แต่ละชิ้นมี <b>2 ขนาด</b>: ขนาดเตี้ยวางเหนือหัว (คลิปซ้าย) และขนาดแคบวางข้างหัว (คลิปขวา) ซับอยู่ระดับอกเหมือนคลิปจริง คลิปไม่มีเสียง</p>
    <p>กด <b>เอา</b> / <b>ปรับ</b> / <b>ตัด</b> ใต้แต่ละชิ้น ถ้ากด "ปรับ" ให้พิมพ์ในหมายเหตุว่าอยากปรับอะไร</p>'''
    else:
        clips = {}
        for line in open(os.path.join(HERE, f'clips_{pack}.txt'), encoding='utf-8'):
            if line.strip() and not line.startswith('#'):
                c, v, i, bg = line.split(); clips[(f'{c}.{v}', int(i))] = bg
        props, heroes = [], []
        for pid, code, name, hit, bgs in pack_check.items(pack):
            cat, v = pid.split('.')
            caps = [f'{BG_NAMES[clips[(pid, i)]]} · {s["topic"]}: "{s["say"]}"' for i, s in enumerate(samples[pid])]
            row = [code, f'{cat}_{v}', name, hit, caps, f'เสียบเข้า {cat} {BASE_NAMES[cat]}' if cat in BASE_NAMES else '']
            (props if cat in BASE_NAMES else heroes).append(row)
        groups = [['ของประกอบ', 'ชิ้นฐานตัวเดิม ช่องเดิม วาดเป็นของในหมวดนี้', props], ['ชิ้นเด่น', 'ชิ้นใหม่เฉพาะหมวดนี้ เก็บไว้ 3–5 ชิ้น', heroes]]
        n = len(props) + len(heroes)
        title = f'ชุด{PACK_NAMES[pack]}'
        intro = f'''<p>ชุดเฉพาะหมวดชุดแรก <b>{n} ชิ้น</b> เป็นการ์ดเต็มจอของสไตล์ editorial เรนเดอร์บนคลิปตัวอย่างของคุณ ทุกชิ้นมี <b>2 คลิป</b> ใส่เนื้อหาคนละเรื่อง คลิปซ้ายพื้นดำเรืองแสง คลิปขวาพื้นสว่าง คลิปไม่มีเสียง</p>
    <ul>
      <li><b>ของประกอบ</b> ({len(props)} ชิ้น) ใช้ช่องที่ AI เติมชุดเดิมของชิ้นฐาน แต่วาดใหม่เป็นของในหมวด{PACK_NAMES[pack]} ใช้เมื่อ AI เห็นว่าคลิปอยู่หมวดนี้</li>
      <li><b>ชิ้นเด่น</b> ({len(heroes)} ชิ้น) เป็นชิ้นใหม่ที่มีเฉพาะหมวดนี้ ที่ตกลงกันไว้คือเก็บไว้ 3–5 ชิ้น</li>
    </ul>
    <p>กด <b>เอา</b> / <b>ปรับ</b> / <b>ตัด</b> ใต้แต่ละชิ้น ถ้ากด "ปรับ" ให้พิมพ์ในหมายเหตุว่าอยากปรับอะไร ชิ้นที่เก็บไว้จะทำเป็นวิดเจ็ตเล็กสำหรับสไตล์ overlay ต่อ</p>'''
    style += """
.group-h { display: grid; gap: 4px; }
.vgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 16px; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.clip { position: relative; aspect-ratio: 9 / 16; max-width: 100%; border-radius: 10px; overflow: hidden; background: #000 center / cover; }
.clip video { width: 100%; height: 100%; object-fit: cover; display: block; }
.cap { font-size: 12px; line-height: 1.4; color: var(--muted); }
.base { font-size: 13px; border: 1px solid var(--line); border-radius: 6px; padding: 1px 8px; justify-self: start; }
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
    {intro}
  </header>

  <div class="bar" role="status" aria-live="polite">
    <span class="count"><span class="dot keep"></span>เอา <span id="n-keep">0</span></span>
    <span class="count"><span class="dot tweak"></span>ปรับ <span id="n-tweak">0</span></span>
    <span class="count"><span class="dot drop"></span>ตัด <span id="n-drop">0</span></span>
    <span class="count"><span class="dot none"></span>ยังไม่เลือก <span id="n-none">{n}</span></span>
    <p class="banner" id="status" data-state="wait">กำลังเชื่อมต่อที่เก็บข้อมูล… ปุ่มจะกดได้เมื่อแถบนี้เปลี่ยนเป็นสีเขียว</p>
  </div>

  <div id="groups" style="display:grid;gap:36px"></div>

  <section class="general" aria-labelledby="gen-h">
    <h2 id="gen-h">ความเห็นรวม</h2>
    <p class="when">เช่น ชิ้นที่ยังขาด ความแน่น ความเร็ว หรือสี</p>
    <p class="saved" id="saved-_general"></p>
    <textarea id="note-_general" placeholder="ความเห็นรวม (ไม่บังคับ)" aria-label="ความเห็นรวม"></textarea>
  </section>
</div>

<script>
const CLIPS = {json.dumps(clipdir)};
const GROUPS = {json.dumps(groups, ensure_ascii=False)};
const LABEL = {{keep: 'เอา', tweak: 'ปรับ', drop: 'ตัด'}};
const $ = s => document.querySelector(s);
const IDS = [];
GROUPS.forEach(([gname, gnote, items]) => {{
  const sec = document.createElement('section'); sec.style.cssText = 'display:grid;gap:14px';
  sec.innerHTML = `<div class="group-h"><h2></h2><p class="when"></p></div><div class="vgrid"></div>`;
  sec.querySelector('h2').textContent = gname; sec.querySelector('.when').textContent = gnote;
  items.forEach(([id, file, name, hit, caps, base]) => {{
    IDS.push(id);
    const el = document.createElement('article'); el.className = 'cat'; el.dataset.id = id;
    el.innerHTML = `
      <div class="head"><span class="code">${{id}}</span><h3></h3></div>
      ${{base ? '<span class="base"></span>' : ''}}
      <div class="pair">${{[0, 1].map(i => `<div style="display:grid;gap:4px;min-width:0"><div class="clip" style="background-image:url(${{CLIPS}}/${{file}}_${{i}}.jpg)"><video src="${{CLIPS}}/${{file}}_${{i}}.mp4" poster="${{CLIPS}}/${{file}}_${{i}}.jpg" muted loop playsinline preload="metadata" aria-label="คลิปตัวอย่าง ${{id}} เรื่องที่ ${{i + 1}}"></video></div><p class="cap"></p></div>`).join('')}}</div>
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
    el.querySelector('h3').textContent = name;
    if (base) el.querySelector('.base').textContent = base;
    el.querySelector('.hit').textContent = hit;
    el.querySelectorAll('.cap').forEach((p, i) => {{ p.textContent = caps[i]; }});
    el.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', () => choose(id, b.dataset.v)));
    sec.querySelector('.vgrid').appendChild(el);
  }});
  $('#groups').appendChild(sec);
}});
IDS.push('_general');
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {{ const v = e.target; if (e.isIntersecting) v.play().catch(() => {{}}); else v.pause(); }}), {{threshold: .35}}) : null;
document.querySelectorAll('video').forEach(v => io ? io.observe(v) : v.play().catch(() => {{}}));

{save}</script>
"""
    open(out, 'w', encoding='utf-8').write(page)
    print(out, n, 'items')


if __name__ == '__main__':
    main()
