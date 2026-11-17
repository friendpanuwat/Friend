/* Test of the draft picker (scenes/cats.js): node test_picker.js
   2026-11-17 Friend deleted every old draft ("ลบชุดฐานเก่าทิ้งให้หมด เราจะใช้ชุดฐาน glow-line", DECISIONS 3). The picker's
   rules stay, so they are tested on made-up drafts that live in this test only; the glow-line drafts come in next.
   The library (scenes/*.js, loaded as build.py does):
   · the 21 categories are there · every draft has its small form (the overlay widget)
   · the 20 topic-bound drafts Friend deleted on 2026-11-12 ("ลบทั้ง 20 ร่างเลย") never come back
   The picker:
   · several sentences of one category in one clip get a different draft each time before any repeats, never the same twice in a row
   · a draft that does not fit is never picked · the same clip always gives the same picks
   · a style that prefers app screens (prefer 'ui') gets only those of a category that has them, still taking turns
   · a category with no draft makes no scene: the clip shows only subtitles there */
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert'), drafts = require('./drafts');

// 1. the library
const lib = drafts.load(), have = drafts.counts(lib), CATS = vm.runInContext('CATS', lib);
assert.strictEqual(Object.keys(have).length, 21, '21 categories: ' + Object.keys(have));
for (const c of Object.values(CATS)) for (const v of c.variants) assert(v.small, `no small form: ${c.id}.${v.id}`);
const GONE = ['B01.receipt', 'B01.tag', 'B01.piggy', 'B01.calc', 'B02.stack', 'B17.basket', 'B17.shelf', 'B17.toolbox', 'B21.shop', 'B21.postcard',
  'B04.belt', 'B05.grade', 'B07.wetfloor', 'B07.hook', 'B09.sun', 'B09.candle', 'B10.invite', 'B11.mic', 'B12.plant', 'B20.cheers'];
for (const g of GONE) { const [c, id] = g.split('.'); assert(!CATS[c].variants.some(v => v.id === id), 'deleted draft is back: ' + g); }

// 2. the picker on made-up drafts (cats.js alone + the drafts below)
const made = [], ctx = {SCENE: id => made.push(id), console};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname, 'scenes', 'cats.js'), 'utf8'), ctx);
vm.runInContext(`
  const draw = () => {};
  for (const id of ['a', 'b', 'c']) VARIANT('B01', id, {name: id, build: draw, small: draw});
  VARIANT('B01', 'money', {name: 'money only', fits: s => s.unit === 'บาท', build: draw, small: draw});
  VARIANT('B04', 'app1', {name: 'app screen 1', ui: true, build: draw, small: draw});
  VARIANT('B04', 'app2', {name: 'app screen 2', ui: true, build: draw, small: draw});
  VARIANT('B04', 'plain', {name: 'plain', build: draw, small: draw});
  this.pick = (c, s, prefer) => pickVariant(c, s, s.say.join(' '), prefer).id;
  this.reset = () => { for (const k in PICKS) delete PICKS[k]; };`, ctx);
const years = k => ({value: String(k), unit: 'ปี', say: ['ผมทำมา', `${k} ปี`]});
const money = k => ({value: String(1000 * k), unit: 'บาท', say: ['ค่าโฆษณาเดือนละ', `${1000 * k} บาท`]});

ctx.reset(); const y = [1, 2, 3, 4, 5, 6].map(k => ctx.pick('B01', years(k)));
assert(!y.includes('money'), 'a draft that does not fit is never picked: ' + y);
assert.strictEqual(new Set(y.slice(0, 3)).size, 3, 'the first three picks differ: ' + y);
y.slice(1).forEach((v, i) => assert.notStrictEqual(v, y[i], 'never the same draft twice in a row: ' + y));
ctx.reset(); const m = [1, 2, 3, 4].map(k => ctx.pick('B01', money(k)));
assert.strictEqual(new Set(m).size, 4, 'every draft that fits before any repeats: ' + m);
ctx.reset(); assert.deepStrictEqual([1, 2, 3, 4].map(k => ctx.pick('B01', money(k))), m, 'the same clip gives the same picks');

const steps = k => ({items: [{icon: 'camera'}, {icon: 'send', label: `โพสต์ ${k}`}], say: ['ถ่าย', `โพสต์ ${k}`]});
ctx.reset(); const st = [1, 2, 3, 4].map(k => ctx.pick('B04', steps(k), 'ui'));
assert(st.every(v => v.startsWith('app')) && new Set(st.slice(0, 2)).size === 2, 'prefer ui: only app screens, taking turns: ' + st);
ctx.reset(); const plain = [1, 2, 3].map(k => ctx.pick('B04', steps(k)));
assert(plain.includes('plain'), 'without prefer every draft takes part: ' + plain);

made.length = 0; vm.runInContext(`SENTENCE('t.none', {cat: 'B09', name: 'no draft', say: ['อีก', '3 วัน']});`, ctx);
assert.deepStrictEqual(made, [], 'a category with no draft makes no scene');
vm.runInContext(`SENTENCE('t.one', {cat: 'B01', name: 'years', value: '3', unit: 'ปี', say: ['ทำมา', '3 ปี']});`, ctx);
assert.deepStrictEqual(made, ['t.one', 't.one.a', 't.one.b', 't.one.c'], 'a sentence makes its scene + one per draft that fits: ' + made);

console.log('picker ok');
console.log('  years ×6 :', y.join(' → '));
console.log('  money ×4 :', m.join(' → '));
console.log('  ui B04 ×4:', st.join(' → '));
console.log('  drafts   :', Object.entries(have).map(([c, k]) => `${c} ${k}`).join(' · '), `(total ${Object.values(have).reduce((a, b) => a + b, 0)})`);
