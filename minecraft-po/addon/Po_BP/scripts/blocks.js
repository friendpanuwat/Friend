// What Po knows about blocks: trees, ores, which tool, how hard, where to find them.
// Pure data + small helpers (no Minecraft API), so it can be tested outside the game.

/** Wood types Po can chop. key -> log id, leaves ids, sapling id, Thai name. */
export const WOODS = {
  oak: { log: "minecraft:oak_log", leaves: ["minecraft:oak_leaves", "minecraft:azalea_leaves", "minecraft:azalea_leaves_flowered"], sapling: "minecraft:oak_sapling", th: "โอ๊ก", where: "ป่าทั่วไปและทุ่งหญ้า" },
  spruce: { log: "minecraft:spruce_log", leaves: ["minecraft:spruce_leaves"], sapling: "minecraft:spruce_sapling", th: "สปรูซ", where: "ป่าสนและที่หนาว (Taiga)" },
  birch: { log: "minecraft:birch_log", leaves: ["minecraft:birch_leaves"], sapling: "minecraft:birch_sapling", th: "เบิร์ช", where: "ป่าเบิร์ช (ต้นสีขาว)" },
  jungle: { log: "minecraft:jungle_log", leaves: ["minecraft:jungle_leaves"], sapling: "minecraft:jungle_sapling", th: "จังเกิล", where: "ป่าดงดิบ (Jungle)" },
  acacia: { log: "minecraft:acacia_log", leaves: ["minecraft:acacia_leaves"], sapling: "minecraft:acacia_sapling", th: "อะคาเซีย", where: "ทุ่งสะวันนา" },
  dark_oak: { log: "minecraft:dark_oak_log", leaves: ["minecraft:dark_oak_leaves"], sapling: "minecraft:dark_oak_sapling", th: "ดาร์กโอ๊ก", where: "ป่าทึบ (Dark Forest)" },
  mangrove: { log: "minecraft:mangrove_log", leaves: ["minecraft:mangrove_leaves"], sapling: "minecraft:mangrove_propagule", th: "โกงกาง", where: "ป่าชายเลน (Mangrove Swamp)" },
  cherry: { log: "minecraft:cherry_log", leaves: ["minecraft:cherry_leaves"], sapling: "minecraft:cherry_sapling", th: "เชอร์รี", where: "ป่าซากุระบนเขา (Cherry Grove)" },
  pale_oak: { log: "minecraft:pale_oak_log", leaves: ["minecraft:pale_oak_leaves"], sapling: "minecraft:pale_oak_sapling", th: "เพลโอ๊ก", where: "ป่าซีด (Pale Garden)" },
};

/** Thai/English words -> wood key, longest first. */
export const WOOD_WORDS = [
  ["ดาร์กโอ๊ก", "dark_oak"],
  ["dark oak", "dark_oak"],
  ["เพลโอ๊ก", "pale_oak"],
  ["pale oak", "pale_oak"],
  ["โอ๊ก", "oak"],
  ["oak", "oak"],
  ["สปรูซ", "spruce"],
  ["สน", "spruce"],
  ["spruce", "spruce"],
  ["เบิร์ช", "birch"],
  ["เบิช", "birch"],
  ["birch", "birch"],
  ["จังเกิ้ล", "jungle"],
  ["จังเกิล", "jungle"],
  ["jungle", "jungle"],
  ["อะคาเซีย", "acacia"],
  ["อาคาเซีย", "acacia"],
  ["acacia", "acacia"],
  ["โกงกาง", "mangrove"],
  ["แมงโกรฟ", "mangrove"],
  ["mangrove", "mangrove"],
  ["เชอร์รี่", "cherry"],
  ["เชอร์รี", "cherry"],
  ["เชอรี่", "cherry"],
  ["ซากุระ", "cherry"],
  ["cherry", "cherry"],
];

/** @param {string} text */
export function findWood(text) {
  for (const [w, key] of WOOD_WORDS) if (text.includes(w)) return /** @type {keyof typeof WOODS} */ (key);
  return undefined;
}

const LOG_TO_WOOD = new Map(Object.entries(WOODS).map(([k, w]) => [w.log, k]));
const LEAF_TO_WOOD = new Map();
for (const [k, w] of Object.entries(WOODS)) for (const l of w.leaves) if (!LEAF_TO_WOOD.has(l)) LEAF_TO_WOOD.set(l, k);

/** @param {string} id */
export const isLog = (id) => LOG_TO_WOOD.has(id);
/** @param {string} id */
export const woodOfLog = (id) => LOG_TO_WOOD.get(id);
/** @param {string} id */
export const isLeaves = (id) => id.endsWith("_leaves") || id === "minecraft:azalea_leaves_flowered";

/** Ores and other things Po can dig for. */
export const ORES = {
  coal: { th: "ถ่านหิน", blocks: ["minecraft:coal_ore", "minecraft:deepslate_coal_ore"], drop: ["minecraft:coal", 1, 1], tier: 1, y: 48, dim: "overworld", def: 16 },
  copper: { th: "ทองแดง", blocks: ["minecraft:copper_ore", "minecraft:deepslate_copper_ore"], drop: ["minecraft:raw_copper", 2, 5], tier: 2, y: 48, dim: "overworld", def: 10 },
  iron: { th: "เหล็ก", blocks: ["minecraft:iron_ore", "minecraft:deepslate_iron_ore"], drop: ["minecraft:raw_iron", 1, 1], tier: 2, y: 16, dim: "overworld", def: 10 },
  lapis: { th: "ลาพิส", blocks: ["minecraft:lapis_ore", "minecraft:deepslate_lapis_ore"], drop: ["minecraft:lapis_lazuli", 4, 9], tier: 2, y: 0, dim: "overworld", def: 16 },
  gold: { th: "ทอง", blocks: ["minecraft:gold_ore", "minecraft:deepslate_gold_ore"], drop: ["minecraft:raw_gold", 1, 1], tier: 3, y: -16, dim: "overworld", def: 6 },
  redstone: { th: "เรดสโตน", blocks: ["minecraft:redstone_ore", "minecraft:deepslate_redstone_ore", "minecraft:lit_redstone_ore", "minecraft:lit_deepslate_redstone_ore"], drop: ["minecraft:redstone", 4, 5], tier: 3, y: -54, dim: "overworld", def: 16 },
  diamond: { th: "เพชร", blocks: ["minecraft:diamond_ore", "minecraft:deepslate_diamond_ore"], drop: ["minecraft:diamond", 1, 1], tier: 3, y: -54, dim: "overworld", def: 3 },
  emerald: { th: "มรกต", blocks: ["minecraft:emerald_ore", "minecraft:deepslate_emerald_ore"], drop: ["minecraft:emerald", 1, 1], tier: 3, y: null, dim: "overworld", def: 3 },
  quartz: { th: "ควอตซ์", blocks: ["minecraft:quartz_ore"], drop: ["minecraft:quartz", 1, 1], tier: 1, y: null, dim: "nether", def: 16 },
  nether_gold: { th: "ทองเนเธอร์", blocks: ["minecraft:nether_gold_ore"], drop: ["minecraft:gold_nugget", 2, 6], tier: 1, y: null, dim: "nether", def: 18 },
  debris: { th: "Ancient Debris", blocks: ["minecraft:ancient_debris"], drop: ["minecraft:ancient_debris", 1, 1], tier: 4, y: 15, dim: "nether", def: 4 },
  stone: { th: "หิน", blocks: ["minecraft:stone"], drop: ["minecraft:cobblestone", 1, 1], tier: 1, y: "shallow", dim: "overworld", def: 32 },
  deepslate: { th: "หินดีปสเลต", blocks: ["minecraft:deepslate"], drop: ["minecraft:cobbled_deepslate", 1, 1], tier: 1, y: -8, dim: "overworld", def: 32 },
  dirt: { th: "ดิน", blocks: ["minecraft:dirt", "minecraft:grass_block", "minecraft:coarse_dirt"], drop: ["minecraft:dirt", 1, 1], tier: 0, y: null, dim: "overworld", def: 32 },
  sand: { th: "ทราย", blocks: ["minecraft:sand"], drop: ["minecraft:sand", 1, 1], tier: 0, y: null, dim: "overworld", def: 32 },
  gravel: { th: "กรวด", blocks: ["minecraft:gravel"], drop: ["minecraft:gravel", 1, 1], tier: 0, y: null, dim: "overworld", def: 16 },
  clay: { th: "ดินเหนียว", blocks: ["minecraft:clay"], drop: ["minecraft:clay_ball", 4, 4], tier: 0, y: null, dim: "overworld", def: 16 },
  obsidian: { th: "ออบซิเดียน", blocks: ["minecraft:obsidian"], drop: ["minecraft:obsidian", 1, 1], tier: 4, y: null, dim: "any", def: 10 },
};

/** Words -> ore key, longest first ("ทองแดง" before "ทอง", "หินดีปสเลต" before "หิน"). */
export const ORE_WORDS = [
  ["ทองแดง", "copper"],
  ["copper", "copper"],
  ["ทองเนเธอร์", "nether_gold"],
  ["ทอง", "gold"],
  ["gold", "gold"],
  ["เหล็ก", "iron"],
  ["iron", "iron"],
  ["เพชร", "diamond"],
  ["diamond", "diamond"],
  ["ถ่าน", "coal"],
  ["coal", "coal"],
  ["เรดสโตน", "redstone"],
  ["redstone", "redstone"],
  ["ลาพิส", "lapis"],
  ["ลาพิซ", "lapis"],
  ["lapis", "lapis"],
  ["มรกต", "emerald"],
  ["emerald", "emerald"],
  ["ควอตซ์", "quartz"],
  ["quartz", "quartz"],
  ["เดบริส", "debris"],
  ["debris", "debris"],
  ["เนเธอไรต์", "debris"],
  ["netherite", "debris"],
  ["ออบซิเดียน", "obsidian"],
  ["obsidian", "obsidian"],
  ["ดีปสเลต", "deepslate"],
  ["deepslate", "deepslate"],
  ["หินกรวด", "stone"],
  ["หิน", "stone"],
  ["stone", "stone"],
  ["ดินเหนียว", "clay"],
  ["ทราย", "sand"],
  ["sand", "sand"],
  ["กรวด", "gravel"],
  ["gravel", "gravel"],
  ["ดิน", "dirt"],
  ["dirt", "dirt"],
];

/** @param {string} text @returns {keyof typeof ORES | undefined} */
export function findOre(text) {
  for (const [w, key] of ORE_WORDS) if (text.includes(w)) return /** @type {keyof typeof ORES} */ (key);
  return undefined;
}

/** block id -> ore key */
const ORE_OF_BLOCK = new Map();
for (const [k, o] of Object.entries(ORES)) for (const b of o.blocks) if (!ORE_OF_BLOCK.has(b)) ORE_OF_BLOCK.set(b, k);
/** @param {string} id */
export const oreOfBlock = (id) => ORE_OF_BLOCK.get(id);

/** Ores worth mining as a bonus while tunnelling. */
export const BONUS_ORES = new Set(["coal", "copper", "iron", "lapis", "gold", "redstone", "diamond", "emerald", "quartz", "nether_gold", "debris"]);

// ------------------------------------------------------------------ tools and hardness

/** Harvest level of each tier. Gold harvests like wood. */
export const TIER_LEVEL = { wood: 1, gold: 1, stone: 2, iron: 3, diamond: 4, netherite: 5 };
/** Mining speed multiplier of each tier (vanilla values). */
export const TIER_SPEED = { hand: 1, wood: 2, stone: 4, iron: 6, diamond: 8, netherite: 9, gold: 12 };

/** Block hardness (vanilla). Unknown natural stone-like blocks default to 1.5. */
const HARDNESS = {
  "minecraft:stone": 1.5,
  "minecraft:deepslate": 3,
  "minecraft:cobbled_deepslate": 3.5,
  "minecraft:granite": 1.5,
  "minecraft:diorite": 1.5,
  "minecraft:andesite": 1.5,
  "minecraft:tuff": 1.5,
  "minecraft:calcite": 0.75,
  "minecraft:dripstone_block": 1.5,
  "minecraft:smooth_basalt": 1.25,
  "minecraft:basalt": 1.25,
  "minecraft:blackstone": 1.5,
  "minecraft:netherrack": 0.4,
  "minecraft:obsidian": 50,
  "minecraft:ancient_debris": 30,
  "minecraft:dirt": 0.5,
  "minecraft:coarse_dirt": 0.5,
  "minecraft:grass_block": 0.6,
  "minecraft:podzol": 0.5,
  "minecraft:mycelium": 0.6,
  "minecraft:dirt_with_roots": 0.5,
  "minecraft:mud": 0.5,
  "minecraft:clay": 0.6,
  "minecraft:gravel": 0.6,
  "minecraft:sand": 0.5,
  "minecraft:red_sand": 0.5,
  "minecraft:soul_sand": 0.5,
  "minecraft:soul_soil": 0.5,
  "minecraft:sandstone": 0.8,
  "minecraft:red_sandstone": 0.8,
  "minecraft:snow": 0.2,
  "minecraft:snow_layer": 0.1,
  "minecraft:moss_block": 0.1,
  "minecraft:magma": 0.5,
  "minecraft:quartz_ore": 3,
  "minecraft:nether_gold_ore": 3,
};

/** @param {string} id */
export function hardness(id) {
  if (id in HARDNESS) return HARDNESS[/** @type {keyof typeof HARDNESS} */ (id)];
  if (id.startsWith("minecraft:deepslate_") && id.endsWith("_ore")) return 4.5;
  if (id.endsWith("_ore")) return 3;
  if (isLog(id) || id.endsWith("_stem") || id.endsWith("_wood")) return 2;
  if (isLeaves(id)) return 0.2;
  if (id.endsWith("terracotta")) return 1.25;
  return 1.5;
}

/** Which tool breaks this block properly: "pickaxe" | "axe" | "shovel" | "any". @param {string} id */
export function toolFor(id) {
  if (isLog(id) || id.endsWith("_stem")) return "axe";
  if (SHOVEL_BLOCKS.has(id)) return "shovel";
  if (isLeaves(id) || id === "minecraft:snow_layer") return "any";
  return "pickaxe";
}

const SHOVEL_BLOCKS = new Set([
  "minecraft:dirt",
  "minecraft:coarse_dirt",
  "minecraft:grass_block",
  "minecraft:podzol",
  "minecraft:mycelium",
  "minecraft:dirt_with_roots",
  "minecraft:mud",
  "minecraft:clay",
  "minecraft:gravel",
  "minecraft:sand",
  "minecraft:red_sand",
  "minecraft:soul_sand",
  "minecraft:soul_soil",
  "minecraft:snow",
  "minecraft:snow_layer",
  "minecraft:farmland",
]);

/** Pickaxe level needed to get a drop from this block (0 = none needed). @param {string} id */
export function levelNeeded(id) {
  const ore = oreOfBlock(id);
  if (ore) return ORES[/** @type {keyof typeof ORES} */ (ore)].tier;
  if (toolFor(id) === "pickaxe") return 1;
  return 0;
}

/**
 * Ticks to break a block (vanilla formula: hardness × 1.5 s, ×5 without the right tool, ÷ tool speed).
 * @param {string} id @param {string} toolTier "hand" or a tier key @param {boolean} rightTool
 */
export function breakTicks(id, toolTier, rightTool) {
  const h = hardness(id);
  const speed = rightTool ? TIER_SPEED[/** @type {keyof typeof TIER_SPEED} */ (toolTier)] ?? 1 : 1;
  const canHarvest = rightTool || levelNeeded(id) === 0;
  const seconds = (h * (canHarvest ? 1.5 : 5)) / speed;
  return Math.max(2, Math.round(seconds * 20));
}

/**
 * Items dropped when Po breaks this block (no Fortune / Silk Touch).
 * @param {string} id @param {() => number} rand
 * @returns {[string, number][]}
 */
export function dropsOf(id, rand = Math.random) {
  const ore = oreOfBlock(id);
  if (ore) {
    const [item, lo, hi] = ORES[/** @type {keyof typeof ORES} */ (ore)].drop;
    return [[/** @type {string} */ (item), /** @type {number} */ (lo) + Math.floor(rand() * (/** @type {number} */ (hi) - /** @type {number} */ (lo) + 1))]];
  }
  if (isLog(id) || id.endsWith("_stem")) return [[id, 1]];
  if (id === "minecraft:stone") return [["minecraft:cobblestone", 1]];
  if (id === "minecraft:deepslate") return [["minecraft:cobbled_deepslate", 1]];
  if (id === "minecraft:grass_block" || id === "minecraft:podzol" || id === "minecraft:mycelium" || id === "minecraft:dirt_with_roots") return [["minecraft:dirt", 1]];
  if (id === "minecraft:gravel") return rand() < 0.1 ? [["minecraft:flint", 1]] : [["minecraft:gravel", 1]];
  if (id === "minecraft:clay") return [["minecraft:clay_ball", 4]];
  if (id === "minecraft:snow_layer" || id === "minecraft:snow") return [["minecraft:snowball", 1]];
  if (isLeaves(id)) return rand() < 0.05 ? [[saplingOfLeaves(id) ?? "minecraft:stick", 1]] : [];
  if (KEEP_AS_IS.has(id)) return [[id, 1]];
  return [];
}

const KEEP_AS_IS = new Set([
  "minecraft:granite",
  "minecraft:diorite",
  "minecraft:andesite",
  "minecraft:tuff",
  "minecraft:calcite",
  "minecraft:dirt",
  "minecraft:coarse_dirt",
  "minecraft:sand",
  "minecraft:red_sand",
  "minecraft:sandstone",
  "minecraft:red_sandstone",
  "minecraft:netherrack",
  "minecraft:blackstone",
  "minecraft:basalt",
  "minecraft:smooth_basalt",
  "minecraft:obsidian",
  "minecraft:soul_sand",
  "minecraft:soul_soil",
  "minecraft:dripstone_block",
  "minecraft:mud",
  "minecraft:moss_block",
]);

/** @param {string} leavesId */
function saplingOfLeaves(leavesId) {
  const w = LEAF_TO_WOOD.get(leavesId);
  return w ? WOODS[/** @type {keyof typeof WOODS} */ (w)].sapling : undefined;
}

// ------------------------------------------------------------------ what Po may break / walk on

/**
 * Natural blocks Po is allowed to dig through. Anything else (planks, bricks,
 * glass, chests...) is treated as someone's build and left alone.
 * @param {string} id
 */
export function isNaturalDiggable(id) {
  if (oreOfBlock(id)) return true;
  if (KEEP_AS_IS.has(id) || HARDNESS_NATURAL.has(id)) return true;
  if (id.endsWith("terracotta") && !id.includes("glazed")) return true;
  return false;
}
const HARDNESS_NATURAL = new Set([
  "minecraft:stone",
  "minecraft:deepslate",
  "minecraft:grass_block",
  "minecraft:podzol",
  "minecraft:mycelium",
  "minecraft:dirt_with_roots",
  "minecraft:gravel",
  "minecraft:clay",
  "minecraft:snow",
  "minecraft:snow_layer",
  "minecraft:magma",
]);

/** Blocks you can walk through (feet/head space). */
const PASSABLE = new Set([
  "minecraft:air",
  "minecraft:cave_air",
  "minecraft:void_air",
  "minecraft:short_grass",
  "minecraft:tall_grass",
  "minecraft:fern",
  "minecraft:large_fern",
  "minecraft:deadbush",
  "minecraft:dead_bush",
  "minecraft:short_dry_grass",
  "minecraft:tall_dry_grass",
  "minecraft:bush",
  "minecraft:firefly_bush",
  "minecraft:leaf_litter",
  "minecraft:pink_petals",
  "minecraft:wildflowers",
  "minecraft:dandelion",
  "minecraft:poppy",
  "minecraft:blue_orchid",
  "minecraft:allium",
  "minecraft:azure_bluet",
  "minecraft:red_tulip",
  "minecraft:orange_tulip",
  "minecraft:white_tulip",
  "minecraft:pink_tulip",
  "minecraft:oxeye_daisy",
  "minecraft:cornflower",
  "minecraft:lily_of_the_valley",
  "minecraft:torchflower",
  "minecraft:closed_eyeblossom",
  "minecraft:open_eyeblossom",
  "minecraft:sunflower",
  "minecraft:lilac",
  "minecraft:rose_bush",
  "minecraft:peony",
  "minecraft:brown_mushroom",
  "minecraft:red_mushroom",
  "minecraft:torch",
  "minecraft:soul_torch",
  "minecraft:copper_torch",
  "minecraft:redstone_torch",
  "minecraft:snow_layer",
  "minecraft:vine",
  "minecraft:glow_lichen",
  "minecraft:sculk_vein",
  "minecraft:redstone_wire",
  "minecraft:rail",
  "minecraft:golden_rail",
  "minecraft:detector_rail",
  "minecraft:activator_rail",
  "minecraft:trip_wire",
  "minecraft:lever",
  "minecraft:wheat",
  "minecraft:carrots",
  "minecraft:potatoes",
  "minecraft:beetroot",
  "minecraft:sugar_cane",
  "minecraft:light_block",
  "minecraft:hanging_roots",
  "minecraft:cave_vines",
  "minecraft:cave_vines_body_with_berries",
  "minecraft:cave_vines_head_with_berries",
  "minecraft:pointed_dripstone",
  "minecraft:small_dripleaf_block",
  "minecraft:spore_blossom",
  "minecraft:nether_sprouts",
  "minecraft:crimson_roots",
  "minecraft:warped_roots",
  "minecraft:crimson_fungus",
  "minecraft:warped_fungus",
]);

/** @param {string} id */
export function isPassable(id) {
  if (PASSABLE.has(id)) return true;
  return (
    id.endsWith("_sapling") ||
    id.endsWith("_button") ||
    id.endsWith("_pressure_plate") ||
    id.endsWith("_carpet") ||
    id.endsWith("standing_sign") ||
    id.endsWith("wall_sign") ||
    id.endsWith("_torch") ||
    id.startsWith("minecraft:light_block")
  );
}

/** Never stand on or walk into these. */
const DANGER = new Set([
  "minecraft:lava",
  "minecraft:flowing_lava",
  "minecraft:fire",
  "minecraft:soul_fire",
  "minecraft:magma",
  "minecraft:campfire",
  "minecraft:soul_campfire",
  "minecraft:cactus",
  "minecraft:sweet_berry_bush",
  "minecraft:powder_snow",
  "minecraft:web",
  "minecraft:wither_rose",
]);

/** @param {string} id */
export const isLava = (id) => id === "minecraft:lava" || id === "minecraft:flowing_lava";
/** @param {string} id */
export const isWater = (id) => id === "minecraft:water" || id === "minecraft:flowing_water";
/** @param {string} id */
export const isDanger = (id) => DANGER.has(id);

/** Solid enough to stand on. @param {string} id */
export function isGround(id) {
  if (!id || id === "minecraft:unknown") return false;
  if (isPassable(id) || isWater(id) || isDanger(id)) return false;
  if (id.endsWith("_fence") || id.endsWith("_wall") || id.endsWith("fence_gate")) return false;
  return true;
}

/** Falls when unsupported: dig these out before standing under them. @param {string} id */
export const isFalling = (id) => id === "minecraft:gravel" || id === "minecraft:sand" || id === "minecraft:red_sand" || id.endsWith("concrete_powder");

/** "Junk" blocks Po only keeps a stack of; the rest he drops while digging. */
export const JUNK_LIMIT = new Map([
  ["minecraft:cobblestone", 128],
  ["minecraft:cobbled_deepslate", 64],
  ["minecraft:dirt", 64],
  ["minecraft:gravel", 32],
  ["minecraft:granite", 0],
  ["minecraft:diorite", 0],
  ["minecraft:andesite", 0],
  ["minecraft:tuff", 0],
  ["minecraft:calcite", 0],
  ["minecraft:netherrack", 64],
  ["minecraft:dripstone_block", 0],
  ["minecraft:smooth_basalt", 0],
  ["minecraft:basalt", 0],
  ["minecraft:blackstone", 32],
]);
