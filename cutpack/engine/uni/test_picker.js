/* Test of the variant picker (cats.js): node test_picker.js
   · one clip with several sentences of one category gets a different variant each time, before any repeats
   · a variant that does not fit is never picked (receipt only for money, review card only for comments/reviews)
   · the same clip always gives the same picks */
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const load = () => {
  const ctx = {SCENE() {}, LAYOUTS: {}, console};
  vm.createContext(ctx);
  for (const f of ['scenes/cats.js', 'scenes/lego_r2.js', 'scenes/lego_r3.js', 'scenes/lego_r4.js', 'scenes/lego_r5.js', 'scenes/lego_v2.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), ctx);
  vm.runInContext('this.pick = (c, s) => pickVariant(c, s, s.say.join(" ")).id; this.reset = () => { for (const k in PICKS) delete PICKS[k]; }; this.CATS = CATS;', ctx);
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
// 2. a number that is not money never gets the receipt
C.reset(); const y = [1, 2, 3, 4, 5, 6].map(k => C.pick('B01', years(k)));
assert(!y.includes('receipt'), 'receipt is only for money: ' + y);
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
assert.strictEqual(Object.keys(C.CATS).length, 16);
for (const c of Object.values(C.CATS)) assert(c.variants.length >= 2, `${c.id} has ${c.variants.length} variants`);
console.log('picker ok');
console.log('  money ×4 :', m.join(' → '));
console.log('  years ×6 :', y.join(' → '));
console.log('  chat ×3  :', c.join(' → '));
console.log('  variants :', Object.values(C.CATS).filter(k => k.variants.length).map(k => `${k.id} ${k.variants.length}`).join(' · '));
