/* =====================================================================
   CutPack · uni · the glow-line designs as the categories' drafts (2026-11-17)
   Friend 2026-11-17: "ลบชุดฐานเก่าทิ้งให้หมด เราจะใช้ชุดฐาน glow-line" and, for the two glow-line sets, "ทั้งสองชุด" (DECISIONS 3):
   every design of the category set (GL.cats.B04: B01–B21) and of the template set (GL.cats.B04T: B01T–B12T) is one draft of its
   CutPack category (which one a clip shows: tools/pick.js — the template set first whenever the category has one, Friend
   2026-11-18: "ใช้ template ชุดฐานเป็นหลักเลยนะครับ ไม่ว่าจะสไตล์ไหนก็ตาม"). They take CutPack's slots as they are (the skill's files say "Data = CutPack Bxx"), and every one of them
   fits every slot set (no design has a fits rule), so the program can pick any of them.
   A draft's id is "<set>.<design>" (e.g. "B04T.rail"); the scene of a sentence with a chosen draft is "<sentence>.<set>.<design>".
   In the browser the list comes from GL.cats (the runtime and the skill's files load before scenes/, build.py); without a
   browser (drafts.js, tools/pick.js) from glow/index.json (glow/index.js writes it).
   ===================================================================== */
(function () {
  const live = typeof GL !== 'undefined' && GL.cats;
  const sets = live ? Object.fromEntries(Object.entries(GL.cats).filter(([k]) => /^B\d\dT?$/.test(k)).map(([k, c]) => [k, c.variants.map(v => ({id: v.id, th: v.th}))]))
    : (typeof GLOW_INDEX !== 'undefined' ? GLOW_INDEX : {});
  for (const [set, designs] of Object.entries(sets)) {
    const cat = set.slice(0, 3);
    if (!CATS[cat]) continue;
    designs.forEach((d, i) => VARIANT(cat, `${set}.${d.id}`, {
      name: `${set} ${d.th}`,
      build: (K, c, T) => glowDraw(K.F, T, set, i, c),
    }));
  }
  /* the 7-size set (ชุด 3, 2026-11-26): design i of a category is "<cat>S.<i>" (e.g. "B04S.2"), drawn at the size of the card it lands
     in (glow/bridge.js glowDraw7). Only a plan of a set-3 style names these (tools/clip_plan.py SEVEN_STYLES: lime, window, neon, the default since 2026-11-26); pickVariant never takes them, and the
     tools without a browser (drafts.js, tools/pick.js) do not list them (pick.js reads glow/seven.json for a set-3 plan), so every other
     style and tool sees the library exactly as before. */
  if (live) for (const cat of Object.keys(CATS)) for (let i = 0; i < glowSevenCount(cat); i++)
    VARIANT(cat, `${cat}S.${i}`, {name: `${cat}S ${i + 1}`, seven: true, build: (K, c, T) => glowDraw7(K.F, T, cat, i, c)});
})();
