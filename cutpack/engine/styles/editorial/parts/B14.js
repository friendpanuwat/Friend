/* B14 ประโยคเด็ดตัวใหญ่ — a line worth remembering, type only. Also the fallback card when another part fails the checks.
   words = the confirmed subtitle split into phrases (joined they must equal the subtitle); key = index of the one word to stress. */
const B14_SLOTS = {
  words: {type: 'list', min: 2, max: 7, req: true},   // phrases, ≤ 14 graphemes each
  key:   {type: 'number', req: true},                 // index into words
  at:    {type: 'list'},                              // when each phrase is said; default: spread from t0 to hit
  icon:  {type: 'icon'},                              // widgets only: the topic of the line (Friend 2026-11-04: a text-only widget looked empty)
};
const phraseTimes = (s, T) => s.at ?? s.words.map((_, i) => i === s.key ? T.hit : T.t0 + .15 + (T.hit - T.t0 - .15) * Math.min(i, s.key) / Math.max(1, s.key) + (i > s.key ? (i - s.key) * .18 : 0));
const checkWords = s => { if (!(s.key >= 0 && s.key < s.words.length)) throw new Error('B14 key out of range'); s.words.forEach(w => { if (graphemes(w).length > 14) throw new Error(`B14 phrase longer than 14: ${w}`); }); };
/* centre a flow block on y = cy; only if it then reaches the app's buttons (y > 860) is it narrowed to SAFE_W (ends at x 940)
   and any single phrase still wider than that shrinks (Friend 2026-11-04) — blocks that stay above keep their width */
const centreClear = (b, cy) => FITS.push(() => {
  b.style.top = `${cy - b.offsetHeight / 2}px`;
  if (cy + b.offsetHeight / 2 <= STRIP.y0) return;
  b.style.left = `${540 - SAFE_W / 2}px`; b.style.width = `${SAFE_W}px`;
  for (const el of b.children) { const w = el.scrollWidth; if (w > SAFE_W) el.style.fontSize = `${parseFloat(getComputedStyle(el).fontSize) * SAFE_W / w}px`; }
  b.style.top = `${cy - b.offsetHeight / 2}px`;
});
const flow = (c, top, W = 960, gap = 18) => { const b = div(`left:${(1080 - W) / 2}px;width:${W}px;top:${top}px;display:flex;flex-wrap:wrap;justify-content:center;align-items:baseline;column-gap:${gap}px;row-gap:6px`, c); return b; };

/* v1: white card, phrases appear one by one in navy; the key word turns into an accent box (skill C5) */
PART('B14', 'v1', {name: 'คำขึ้นทีละคำ แล้วไฮไลต์คำสำคัญ', bgs: ['white', 'cream'], slots: B14_SLOTS, dur: [1.2, 3.5],
  hit: 'คำสำคัญเด้งเป็นกล่องสีเน้น'}, (c, s, T) => {
  checkWords(s); const at = phraseTimes(s, T), b = flow(c, 640);
  s.words.forEach((w, i) => fitW(chunk(b, w, i === s.key ? 'hl' : 'm', at[i], i === s.key ? {} : {color: NAVY, size: 96}), 960));   // one long word shrinks instead of running off the card
  centreClear(b, 760);
  snd('key', T.hit - .04);
});

/* v2: navy card, small lead line, then the key word huge, its letters turning accent one by one (skill C6) */
PART('B14', 'v2', {name: 'คำใหญ่เต็มจอ เปลี่ยนสีทีละตัว', bgs: ['glow'],   /* navy out: Friend prefers glow */ slots: B14_SLOTS, dur: [1.2, 3.5],
  hit: 'คำใหญ่ขึ้นแล้วไล่สีทีละตัว'}, (c, s, T) => {
  checkWords(s); const at = phraseTimes(s, T);
  const before = s.words.slice(0, s.key), after = s.words.slice(s.key + 1);
  if (before.length) { const b = flow(c, 560, 900, 14); before.forEach((w, i) => chunk(b, w, 'l', at[i], {size: 66})); }
  const k = flow(c, 700, SAFE_W); const kw = chunk(k, s.words[s.key], 'kw', T.hit, {wipe: true, size: 190});
  FITS.push(() => { if (kw.scrollWidth > SAFE_W) kw.style.fontSize = `${190 * SAFE_W / kw.scrollWidth}px`; });
  if (after.length) { const a = flow(c, 960, SAFE_W, 14); after.forEach((w, i) => chunk(a, w, 'l', at[s.key + 1 + i], {size: 66})); }
  snd('key', T.hit - .04);
});

/* v3: cream poster — the line in Mitr, the key word in Sriracha handwriting with an accent underline drawn at the hit */
PART('B14', 'v3', {name: 'ลายมือ Sriracha คู่กับ Mitr', bgs: ['cream', 'white'], slots: B14_SLOTS, dur: [1.2, 3.5],
  hit: 'คำสำคัญเป็นลายมือ มีเส้นใต้สีเน้นวาดตรงคำ'}, (c, s, T) => {
  checkWords(s); const at = phraseTimes(s, T), b = flow(c, 640, 940, 20);
  s.words.forEach((w, i) => {
    const el = chunk(b, w, i === s.key ? 'iw' : 'm', at[i], i === s.key ? {color: NAVY, size: 150} : {color: NAVY, size: 92});
    fitW(el, 940);
    if (i === s.key) {
      const u = svg(400, 60, `<path d="M6 40 Q 100 8 200 30 T 394 22" stroke="${ACC}" stroke-width="22" stroke-linecap="round" fill="none"/>`, 'left:0;bottom:-26px;width:100%;z-index:-1', el);
      u.firstChild.setAttribute('preserveAspectRatio', 'none'); u.firstChild.setAttribute('viewBox', '0 0 400 60'); u.firstChild.style.width = '100%';
      mv.draw(u.querySelector('path'), T.hit + .12, .35);
    }
  });
  centreClear(b, 760);
  snd('key', T.hit - .04);
});

/* v4 'บรรทัดเลื่อนขึ้นทีละบรรทัด' was dropped by Friend on 2026-11-03 (see library/base-parts/README.md); the code is in git history. */
