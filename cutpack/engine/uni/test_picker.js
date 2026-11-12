/* Test of the variant picker (cats.js): node test_picker.js
   · one clip with several sentences of one category gets a different variant each time, before any repeats
   · a variant that does not fit is never picked (receipt only for money, review card only for comments/reviews)
   · the same clip always gives the same picks */
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const load = () => {
  const ctx = {SCENE() {}, LAYOUTS: {}, console};
  vm.createContext(ctx);
  for (const f of ['scenes/cats.js', 'scenes/lego_r2.js', 'scenes/lego_r3.js', 'scenes/lego_r4.js', 'scenes/lego_r5.js', 'scenes/lego_r6.js', 'scenes/lego_r6b.js', 'scenes/lego_r7.js', 'scenes/lego_r8.js', 'scenes/lego_r9.js', 'scenes/lego_r9b.js', 'scenes/lego_r9c.js', 'scenes/lego_r9d.js', 'scenes/lego_r9e.js', 'scenes/lego_v2.js', 'scenes/ui.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), ctx);
  vm.runInContext('this.pick = (c, s, prefer) => pickVariant(c, s, s.say.join(" "), prefer).id; this.reset = () => { for (const k in PICKS) delete PICKS[k]; }; this.CATS = CATS;', ctx);
  return ctx;
};
const C = load();
const money = k => ({value: String(1000 * k), unit: 'บาท', say: ['ค่าโฆษณาเดือนละ', `${1000 * k} บาท`]});
const years = k => ({value: String(k), unit: 'ปี', say: ['ผมทำมา', `${k} ปี`]});
const chat = q => ({kind: 'chat', quote: q, say: ['ลูกค้าทักมาว่า', q]});

// 1. three money sentences in one clip → three different looks; the fourth repeats the least used one
C.reset(); const m = [1, 2, 3, 4].map(k => C.pick('B01', money(k)));
assert.strictEqual(new Set(m.slice(0, 3)).size, 3, 'first three picks differ: ' + m);
assert.notStrictEqual(m[3], m[2], 'never the same look twice in a row');
// 2. only base-set variants (Friend 2026-11-12: "เก็บไว้แค่ร่างที่เป็นชุดฐาน", "ลบทั้ง 20 ร่างเลย"): the topic-bound ones never come back
C.reset(); const y = [1, 2, 3, 4, 5, 6].map(k => C.pick('B01', years(k)));
const GONE = ['B01.receipt', 'B01.tag', 'B01.piggy', 'B01.calc', 'B02.stack', 'B17.basket', 'B17.shelf', 'B17.toolbox', 'B21.shop', 'B21.postcard',
  'B04.belt', 'B05.grade', 'B07.wetfloor', 'B07.hook', 'B09.sun', 'B09.candle', 'B10.invite', 'B11.mic', 'B12.plant', 'B20.cheers'];
for (const g of GONE) { const [c, id] = g.split('.'); assert(!C.CATS[c].variants.some(v => v.id === id), 'deleted variant is back: ' + g); }
assert.strictEqual(new Set(y.slice(0, 2)).size, 2, 'big and ring alternate: ' + y);
// 3. a plain chat never gets the review card (stars)
C.reset(); const c = ['ราคาเท่าไร', 'มีสีอื่นไหม', 'ส่งฟรีไหม'].map(q => C.pick('B11', chat(q)));
assert(!c.includes('review'), 'no stars for a plain chat: ' + c);
// 4. same clip → same picks
C.reset(); const again = [1, 2, 3, 4].map(k => C.pick('B01', money(k)));
assert.deepStrictEqual(again, m, 'picks repeat exactly for the same clip');
// 5. versus and change never mix: a "before → after" sentence gets only change pictures
C.reset(); const ch = [1, 2, 3].map(k => C.pick('B03', {mode: 'change', a: {icon: 'user', v: .2}, b: {icon: 'users', v: .8}, switch: true, say: ['จาก', `ตอนนี้ ${k}`]}));
assert(ch.every(v => ['swap', 'meter', 'toggle'].includes(v)) && new Set(ch).size === 3, 'change pictures only: ' + ch);
// 6. every variant of the picker categories has its small form (the overlay widget)
for (const c of Object.values(C.CATS)) for (const v of c.variants) assert(v.small, `no small form: ${c.id}.${v.id}`);
// 7. every category is there and has at least two variants (B14 got its pictures in round 4)
assert.strictEqual(Object.keys(C.CATS).length, 21);   // B17–B21 added in round 6 (2026-11-10)
for (const c of Object.values(C.CATS)) assert(c.variants.length >= 2, `${c.id} has ${c.variants.length} variants`);
// 8. a style that prefers app screens (prefer: 'ui') gets only the 'ui' variants of a category that has them,
//    still taking turns; a category without one is picked as before; a style that prefers nothing may get any variant
const steps = k => ({items: [{icon: 'camera'}, {icon: 'scissors'}, {icon: 'send', label: `โพสต์ ${k}`}], say: ['ถ่าย ตัด', `โพสต์ ${k}`]});
const ui = cat => Object.values(C.CATS).find(c => c.id === cat).variants.filter(v => v.ui).map(v => v.id);
C.reset(); const st = [1, 2, 3, 4].map(k => C.pick('B04', steps(k), 'ui'));
assert(st.every(v => ui('B04').includes(v)), 'only app screens with prefer ui: ' + st);
assert.strictEqual(new Set(st.slice(0, ui('B04').length)).size, ui('B04').length, 'the app screens take turns: ' + st);
C.reset(); const plain = [1, 2, 3, 4].map(k => C.pick('B04', steps(k)));
assert(plain.some(v => !ui('B04').includes(v)), 'without prefer every variant takes part: ' + plain);
C.reset(); const t12 = [1, 2, 3].map(k => C.pick('B12', {items: [{icon: 'user'}, {icon: 'star'}, {icon: 'heart', label: `ข้อ ${k}`}], say: ['ทำดี', `ข้อ ${k}`]}, 'ui'));
assert.strictEqual(new Set(t12).size, 3, 'a category with no app screen picks as before: ' + t12);
for (const [cat, ids] of Object.entries({B03: ['toggle'], B04: ['list', 'sheet'], B05: ['settings'], B06: ['type'], B11: ['phone', 'notify'], B15: ['button', 'compose']}))
  assert.deepStrictEqual([...ui(cat)].sort(), ids.sort(), `app-screen variants of ${cat}`);
console.log('picker ok');
console.log('  ui B04 ×4 :', st.join(' → '));
console.log('  money ×4 :', m.join(' → '));
console.log('  years ×6 :', y.join(' → '));
console.log('  chat ×3  :', c.join(' → '));
console.log('  variants :', Object.values(C.CATS).filter(k => k.variants.length).map(k => `${k.id} ${k.variants.length}`).join(' · '));
