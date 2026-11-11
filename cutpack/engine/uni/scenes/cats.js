/* =====================================================================
   CutPack · uni · CATEGORIES and VARIANTS (Friend 2026-11-07)
   Friend's words: a หมวด (category) is what kind of sentence it is; a ร่าง (variant) is one look of the picture.
   "ร่างแยก = motion graphics หน้าตาแบบไหนก็ได้ที่สื่อความหมายเดียวกัน", target 20 variants per category.
   The AI only says: the category + the things + the words (the category's slots, the same for every variant).
   The PROGRAM picks the variant, so the AI's instructions do not grow with the number of variants:
     · only variants whose fits(slots) is true (a variant made for money numbers is skipped for "4 ปี")
     · the least used one in this clip first, never the same one twice in a row
     · ties broken by the sentence itself, so the same input always gives the same clip
   21 categories: the 15 Friend kept on 2026-11-03 (B01–B15) + B16 นิยาม / อธิบายว่าคืออะไร (2026-11-07)
   + B17–B21 (2026-11-10): ไล่รายการ, เล่าเหตุการณ์, ความรู้สึก, ความสัมพันธ์ของคน, สถานที่.
   ===================================================================== */
const CATS = {};
function CATEGORY(id, name, {text = false} = {}) { CATS[id] = {id, name, text, variants: []}; }
function VARIANT(cat, id, v) {
  if (!CATS[cat]) throw new Error('unknown category ' + cat);
  CATS[cat].variants.push({id, name: v.name, fits: v.fits ?? (() => true), build: v.build, small: v.small, ui: !!v.ui});
}
[['B01', 'ตัวเลขเด่น'], ['B02', 'เพิ่มขึ้น / ลดลง'], ['B03', 'เปรียบเทียบ / ก่อนกับหลัง'], ['B04', 'ขั้นตอน / เช็กลิสต์'],
 ['B05', 'ถูกกับผิด / ไม่ใช่ X แต่เป็น Y'], ['B06', 'คำถาม / ความสงสัย'], ['B07', 'ปัญหา / คำเตือน'], ['B08', 'เป้าหมาย / ผลลัพธ์ / สำเร็จ'],
 ['B09', 'เวลา / ไทม์ไลน์ / เส้นตาย'], ['B10', 'คน / กลุ่มเป้าหมาย'], ['B11', 'คำพูด / แชต / รีวิว'], ['B12', 'เหตุกับผล'],
 ['B13', 'ไอเดีย / เคล็ดลับ / ความลับ'], ['B14', 'ประโยคเด็ดตัวใหญ่'], ['B15', 'ปิดคลิป / ชวนทำต่อ'], ['B16', 'นิยาม / อธิบายว่าคืออะไร'],
 /* round 6 (Friend 2026-11-10: "เพิ่ม 5 หมวดนี้เลย", from Claude's reading of 26 other people's scripts, page 19) */
 ['B17', 'ไล่รายการหลายอย่าง'], ['B18', 'เล่าเหตุการณ์'], ['B19', 'ความรู้สึก'], ['B20', 'ความสัมพันธ์ของคน'], ['B21', 'สถานที่'],
].forEach(([id, name]) => CATEGORY(id, name));          // B14 was words only until round 4 (2026-11-08)

/* give a variant its small form (the overlay widget), designed for it, using the same slots */
function SMALLV(cat, id, small) {
  const v = CATS[cat]?.variants.find(v => v.id === id); if (!v) throw new Error(`no variant ${cat}.${id}`);
  v.small = small;
}
/* what this clip has used so far (category → variant ids in order); a later step can preload a customer's past clips */
const PICKS = {};
const hashOf = s => { let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0; return h; };
/* prefer: a style may want one kind of variant first (ios: 'ui' = the ones that look like an app screen, Friend 2026-11-11
   "OK ครับ", style-rules/ios.md 8): when the category has such variants that fit, only those take turns; else every variant does */
function pickVariant(cat, slots, seed = '', prefer = typeof ST !== 'undefined' && ST ? ST.prefer : undefined) {
  const C = CATS[cat]; if (!C) throw new Error('unknown category ' + cat);
  let ok = C.variants.filter(v => v.fits(slots));
  if (!ok.length) throw new Error(`no variant of ${cat} fits ${JSON.stringify(slots)}`);
  if (prefer && ok.some(v => v[prefer])) ok = ok.filter(v => v[prefer]);
  const used = PICKS[cat] ?? (PICKS[cat] = []), n = id => used.filter(u => u === id).length;
  const least = Math.min(...ok.map(v => n(v.id)));
  let pool = ok.filter(v => n(v.id) === least);
  if (pool.length > 1) pool = pool.filter(v => v.id !== used[used.length - 1]);
  const v = pool[hashOf(seed) % pool.length]; used.push(v.id); return v;
}

/* a red sign never sits on a red thing (Friend 2026-11-08: the warning stamp on a red icon, "สัญลักษณ์มันเป็นสีเดียวกับไอคอน
   ซึ่งมันจะทำให้ไม่สวย"): in the categories whose variants put a red mark (stamp, warning sign, cross) on their things,
   a "neg" tone the AI gave a thing becomes the plain "main" tone (not dropped: some variants' own default is the
   highlight, which would light up a loser), so the mark alone is red */
const CALM = {B03: ['a', 'b'], B04: ['items'], B07: ['thing']};
function calm(r) {
  const keys = CALM[r.cat]; if (!keys) return r;
  const out = {...r}, off = t => t && t.tone === 'neg' ? {...t, tone: 'main'} : t;
  for (const k of keys) out[k] = Array.isArray(r[k]) ? r[k].map(off) : off(r[k]);
  return out;
}
/* one sentence of a category = one scene; it also gets one scene per variant that fits (<id>.<variant>) for tests */
function SENTENCE(id, r) {
  const meta = v => ({meaning: r.cat, name: r.name + (v ? ' · ' + v.name : ''), story: CATS[r.cat].name, beats: 4, cat: r.cat, variant: v?.id,
    slots: {lead: {type: 'text', max: 22, sample: r.say[0]}, key: {type: 'text', max: 12, sample: r.say[1]}}});
  const c = calm(r), draw = (v, K, T) => ((ST.overlay || ST.useSmall) && v.small ? v.small : v.build)(K, c, T);   // an overlay widget (and ios) uses the variant's small form
  const fit = CATS[r.cat].variants.filter(v => v.fits(r));
  SCENE(id, {...meta(null), small: fit.every(v => v.small)}, (K, s, T) => { draw(pickVariant(r.cat, r, r.say.join(' ')), K, T); K.say(s.lead, s.key); });
  fit.forEach(v => SCENE(`${id}.${v.id}`, {...meta(v), small: !!v.small}, (K, s, T) => { draw(v, K, T); K.say(s.lead, s.key); }));
}
