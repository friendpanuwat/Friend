// Thai names for mobs and items, and the words players use to ask for items.

/** @type {Record<string, string>} */
export const MOB_TH = {
  "minecraft:zombie": "ซอมบี้",
  "minecraft:husk": "ซอมบี้ทะเลทราย",
  "minecraft:drowned": "ซอมบี้น้ำ",
  "minecraft:zombie_villager_v2": "ซอมบี้ชาวบ้าน",
  "minecraft:zombie_villager": "ซอมบี้ชาวบ้าน",
  "minecraft:skeleton": "โครงกระดูก",
  "minecraft:stray": "โครงกระดูกหิมะ",
  "minecraft:bogged": "โครงกระดูกหนองน้ำ",
  "minecraft:parched": "โครงกระดูกทะเลทราย",
  "minecraft:wither_skeleton": "โครงกระดูกวิทเธอร์",
  "minecraft:creeper": "ครีปเปอร์",
  "minecraft:spider": "แมงมุม",
  "minecraft:cave_spider": "แมงมุมถ้ำ",
  "minecraft:enderman": "เอนเดอร์แมน",
  "minecraft:witch": "แม่มด",
  "minecraft:slime": "สไลม์",
  "minecraft:magma_cube": "แมกมาคิวบ์",
  "minecraft:phantom": "แฟนทอม",
  "minecraft:pillager": "พิลเลเจอร์",
  "minecraft:vindicator": "วินดิเคเตอร์",
  "minecraft:evocation_illager": "อีโวเกอร์",
  "minecraft:ravager": "ราเวเจอร์",
  "minecraft:vex": "เว็กซ์",
  "minecraft:blaze": "เบลซ",
  "minecraft:ghast": "กาสต์",
  "minecraft:piglin": "พิกลิน",
  "minecraft:piglin_brute": "พิกลินร่างยักษ์",
  "minecraft:zombie_pigman": "ซอมบี้พิกลิน",
  "minecraft:hoglin": "ฮอกลิน",
  "minecraft:zoglin": "ซอกลิน",
  "minecraft:silverfish": "ตัวสีเงิน",
  "minecraft:endermite": "เอนเดอร์ไมต์",
  "minecraft:guardian": "การ์เดียน",
  "minecraft:elder_guardian": "เอลเดอร์การ์เดียน",
  "minecraft:shulker": "ชัลเกอร์",
  "minecraft:breeze": "บรีซ",
  "minecraft:warden": "วอร์เดน",
  "minecraft:creaking": "ครีกกิ้ง",
  "minecraft:ender_dragon": "มังกรเอนเดอร์",
  "minecraft:wither": "วิทเธอร์",
  "minecraft:wolf": "หมาป่า",
  "minecraft:cow": "วัว",
  "minecraft:pig": "หมู",
  "minecraft:chicken": "ไก่",
  "minecraft:sheep": "แกะ",
  "minecraft:player": "ผู้เล่น",
  "minecraft:arrow": "ลูกธนู",
};

/** @param {string} typeId */
export function mobTh(typeId) {
  return MOB_TH[typeId] ?? typeId.replace("minecraft:", "").replace(/_/g, " ");
}

/** @type {Record<string, string>} */
export const ITEM_TH = {
  "minecraft:oak_log": "ไม้โอ๊ก",
  "minecraft:spruce_log": "ไม้สปรูซ",
  "minecraft:birch_log": "ไม้เบิร์ช",
  "minecraft:jungle_log": "ไม้จังเกิล",
  "minecraft:acacia_log": "ไม้อะคาเซีย",
  "minecraft:dark_oak_log": "ไม้ดาร์กโอ๊ก",
  "minecraft:mangrove_log": "ไม้โกงกาง",
  "minecraft:cherry_log": "ไม้เชอร์รี",
  "minecraft:pale_oak_log": "ไม้เพลโอ๊ก",
  "minecraft:crimson_stem": "ลำต้นคริมสัน",
  "minecraft:warped_stem": "ลำต้นวาร์ป",
  "minecraft:oak_planks": "แผ่นไม้โอ๊ก",
  "minecraft:spruce_planks": "แผ่นไม้สปรูซ",
  "minecraft:birch_planks": "แผ่นไม้เบิร์ช",
  "minecraft:stick": "ไม้แท่ง",
  "minecraft:cobblestone": "หินกรวด",
  "minecraft:stone": "หิน",
  "minecraft:cobbled_deepslate": "หินดีปสเลต",
  "minecraft:dirt": "ดิน",
  "minecraft:sand": "ทราย",
  "minecraft:gravel": "กรวด",
  "minecraft:glass": "แก้ว",
  "minecraft:coal": "ถ่านหิน",
  "minecraft:charcoal": "ถ่านไม้",
  "minecraft:raw_iron": "เหล็กดิบ",
  "minecraft:iron_ingot": "แท่งเหล็ก",
  "minecraft:raw_gold": "ทองดิบ",
  "minecraft:gold_ingot": "แท่งทอง",
  "minecraft:raw_copper": "ทองแดงดิบ",
  "minecraft:copper_ingot": "แท่งทองแดง",
  "minecraft:diamond": "เพชร",
  "minecraft:emerald": "มรกต",
  "minecraft:redstone": "เรดสโตน",
  "minecraft:lapis_lazuli": "ลาพิส",
  "minecraft:quartz": "ควอตซ์",
  "minecraft:netherite_scrap": "เศษเนเธอไรต์",
  "minecraft:obsidian": "ออบซิเดียน",
  "minecraft:flint": "หินเหล็กไฟ",
  "minecraft:bread": "ขนมปัง",
  "minecraft:apple": "แอปเปิ้ล",
  "minecraft:golden_apple": "แอปเปิ้ลทอง",
  "minecraft:carrot": "แครอท",
  "minecraft:golden_carrot": "แครอททอง",
  "minecraft:potato": "มันฝรั่ง",
  "minecraft:baked_potato": "มันฝรั่งอบ",
  "minecraft:beef": "เนื้อวัวดิบ",
  "minecraft:cooked_beef": "สเต๊ก",
  "minecraft:porkchop": "หมูดิบ",
  "minecraft:cooked_porkchop": "หมูย่าง",
  "minecraft:chicken": "ไก่ดิบ",
  "minecraft:cooked_chicken": "ไก่ย่าง",
  "minecraft:mutton": "เนื้อแกะดิบ",
  "minecraft:cooked_mutton": "เนื้อแกะย่าง",
  "minecraft:cod": "ปลาค็อดดิบ",
  "minecraft:cooked_cod": "ปลาค็อดย่าง",
  "minecraft:salmon": "ปลาแซลมอนดิบ",
  "minecraft:cooked_salmon": "ปลาแซลมอนย่าง",
  "minecraft:cookie": "คุกกี้",
  "minecraft:melon_slice": "แตงโม",
  "minecraft:sweet_berries": "เบอร์รี",
  "minecraft:pumpkin_pie": "พายฟักทอง",
  "minecraft:wheat": "ข้าวสาลี",
  "minecraft:wheat_seeds": "เมล็ดข้าวสาลี",
  "minecraft:sugar_cane": "อ้อย",
  "minecraft:torch": "คบไฟ",
  "minecraft:rotten_flesh": "เนื้อเน่า",
  "minecraft:bone": "กระดูก",
  "minecraft:string": "เชือก",
  "minecraft:gunpowder": "ดินปืน",
  "minecraft:arrow": "ลูกธนู",
  "minecraft:feather": "ขนนก",
  "minecraft:leather": "หนัง",
  "minecraft:egg": "ไข่",
  "minecraft:ender_pearl": "ไข่มุกเอนเดอร์",
  "minecraft:slime_ball": "ลูกสไลม์",
  "minecraft:white_wool": "ขนแกะขาว",
};

/** @param {string} typeId */
export function itemTh(typeId) {
  if (ITEM_TH[typeId]) return ITEM_TH[typeId];
  const short = typeId.replace("minecraft:", "");
  if (short.endsWith("_log")) return "ไม้" + short.replace("_log", "").replace(/_/g, " ");
  if (short.endsWith("_planks")) return "แผ่นไม้" + short.replace("_planks", "").replace(/_/g, " ");
  if (short.endsWith("_wool")) return "ขนแกะ" + short.replace("_wool", "").replace(/_/g, " ");
  return short.replace(/_/g, " ");
}

/**
 * Words a player may use to ask for something, longest first so that
 * "หินเหล็กไฟ" wins over "หิน" and "เหล็ก".
 * Each entry: [word, matcher(typeId) -> boolean]
 * @type {[string, (id: string) => boolean][]}
 */
const REQUEST_WORDS = [
  ["หินเหล็กไฟ", (id) => id === "minecraft:flint"],
  ["ไข่มุกเอนเดอร์", (id) => id === "minecraft:ender_pearl"],
  ["แผ่นไม้", (id) => id.endsWith("_planks")],
  ["ไม้แท่ง", (id) => id === "minecraft:stick"],
  ["ไม้โอ๊ก", (id) => id === "minecraft:oak_log"],
  ["ไม้สปรูซ", (id) => id === "minecraft:spruce_log"],
  ["ไม้เบิร์ช", (id) => id === "minecraft:birch_log"],
  ["ไม้จังเกิล", (id) => id === "minecraft:jungle_log"],
  ["ไม้อะคาเซีย", (id) => id === "minecraft:acacia_log"],
  ["ไม้ดาร์กโอ๊ก", (id) => id === "minecraft:dark_oak_log"],
  ["ไม้โกงกาง", (id) => id === "minecraft:mangrove_log"],
  ["ไม้เชอร์รี", (id) => id === "minecraft:cherry_log"],
  ["ไม้", (id) => id.endsWith("_log") || id.endsWith("_stem")],
  ["ถ่านหิน", (id) => id === "minecraft:coal"],
  ["ถ่านไม้", (id) => id === "minecraft:charcoal"],
  ["ถ่าน", (id) => id === "minecraft:coal" || id === "minecraft:charcoal"],
  ["ทองแดง", (id) => id === "minecraft:copper_ingot" || id === "minecraft:raw_copper"],
  ["เหล็ก", (id) => id === "minecraft:iron_ingot" || id === "minecraft:raw_iron"],
  ["ทอง", (id) => id === "minecraft:gold_ingot" || id === "minecraft:raw_gold"],
  ["เพชร", (id) => id === "minecraft:diamond"],
  ["มรกต", (id) => id === "minecraft:emerald"],
  ["เรดสโตน", (id) => id === "minecraft:redstone"],
  ["ลาพิส", (id) => id === "minecraft:lapis_lazuli"],
  ["ออบซิเดียน", (id) => id === "minecraft:obsidian"],
  ["หินกรวด", (id) => id === "minecraft:cobblestone"],
  ["หิน", (id) => id === "minecraft:cobblestone" || id === "minecraft:stone" || id === "minecraft:cobbled_deepslate"],
  ["ดิน", (id) => id === "minecraft:dirt"],
  ["ทราย", (id) => id === "minecraft:sand"],
  ["กรวด", (id) => id === "minecraft:gravel"],
  ["แก้ว", (id) => id === "minecraft:glass"],
  ["คบไฟ", (id) => id === "minecraft:torch"],
  ["ขนมปัง", (id) => id === "minecraft:bread"],
  ["แอปเปิ้ล", (id) => id === "minecraft:apple"],
  ["แครอท", (id) => id === "minecraft:carrot" || id === "minecraft:golden_carrot"],
  ["มันฝรั่ง", (id) => id === "minecraft:potato" || id === "minecraft:baked_potato"],
  ["สเต๊ก", (id) => id === "minecraft:cooked_beef"],
  ["เนื้อ", (id) => /cooked_|beef|porkchop|mutton|chicken$/.test(id)],
  ["อาหาร", (id) => FOOD_IDS.has(id)],
  ["ของกิน", (id) => FOOD_IDS.has(id)],
  ["ข้าวสาลี", (id) => id === "minecraft:wheat"],
  ["เมล็ด", (id) => id.endsWith("_seeds")],
  ["กระดูก", (id) => id === "minecraft:bone"],
  ["เชือก", (id) => id === "minecraft:string"],
  ["ดินปืน", (id) => id === "minecraft:gunpowder"],
  ["ลูกธนู", (id) => id === "minecraft:arrow"],
  ["ขนนก", (id) => id === "minecraft:feather"],
  ["หนัง", (id) => id === "minecraft:leather"],
  ["ขนแกะ", (id) => id.endsWith("_wool")],
  ["อ้อย", (id) => id === "minecraft:sugar_cane"],
  ["ไข่", (id) => id === "minecraft:egg"],
];

/** Heal amount (HP) when Po eats this. */
/** @type {Record<string, number>} */
export const FOOD_HEAL = {
  "minecraft:bread": 10,
  "minecraft:cooked_beef": 16,
  "minecraft:cooked_porkchop": 16,
  "minecraft:cooked_mutton": 12,
  "minecraft:cooked_chicken": 12,
  "minecraft:cooked_cod": 10,
  "minecraft:cooked_salmon": 12,
  "minecraft:cooked_rabbit": 10,
  "minecraft:baked_potato": 10,
  "minecraft:apple": 8,
  "minecraft:golden_apple": 40,
  "minecraft:enchanted_golden_apple": 40,
  "minecraft:golden_carrot": 12,
  "minecraft:carrot": 6,
  "minecraft:potato": 2,
  "minecraft:beetroot": 2,
  "minecraft:melon_slice": 4,
  "minecraft:sweet_berries": 4,
  "minecraft:glow_berries": 4,
  "minecraft:cookie": 4,
  "minecraft:pumpkin_pie": 16,
  "minecraft:mushroom_stew": 12,
  "minecraft:rabbit_stew": 20,
  "minecraft:beetroot_soup": 12,
  "minecraft:beef": 6,
  "minecraft:porkchop": 6,
  "minecraft:mutton": 4,
  "minecraft:chicken": 4,
  "minecraft:cod": 4,
  "minecraft:salmon": 4,
  "minecraft:dried_kelp": 2,
  "minecraft:honey_bottle": 12,
};

export const FOOD_IDS = new Set(Object.keys(FOOD_HEAL));

/**
 * Find what item the text asks for.
 * @param {string} text normalised text
 * @returns {{ word: string, match: (id: string) => boolean } | undefined}
 */
export function findItemWord(text) {
  for (const [word, match] of REQUEST_WORDS) {
    if (text.includes(word)) return { word, match };
  }
  return undefined;
}

/** First whole number in the text, Thai digits included. @param {string} text */
export function findNumber(text) {
  const arabic = text.replace(/[๐-๙]/g, (d) => String("๐๑๒๓๔๕๖๗๘๙".indexOf(d)));
  const m = arabic.match(/\d+/);
  if (m) return Math.min(parseInt(m[0], 10), 64 * 27);
  if (/หมด|ทั้งหมด|ทุก/.test(text)) return Infinity;
  /** @type {[string, number][]} */
  const words = [
    ["สิบ", 10],
    ["เก้า", 9],
    ["แปด", 8],
    ["เจ็ด", 7],
    ["หก", 6],
    ["ห้า", 5],
    ["สี่", 4],
    ["สาม", 3],
    ["สอง", 2],
    ["หนึ่ง", 1],
  ];
  for (const [w, n] of words) if (text.includes(w)) return n;
  return undefined;
}
