// Po's own equipment: one pickaxe, axe, shovel, sword, bow and armour set,
// each with a tier and real durability. Po starts with nothing.

/** @typedef {"wood" | "stone" | "iron" | "gold" | "diamond" | "netherite"} Tier */
/** @typedef {"leather" | "gold" | "iron" | "diamond" | "netherite"} ArmorTier */
/** @typedef {"pickaxe" | "axe" | "shovel" | "sword"} ToolKind */
/** @typedef {{ tier: Tier, dur: number }} Tool */
/** @typedef {{ pickaxe: Tool | null, axe: Tool | null, shovel: Tool | null, sword: Tool | null, bow: { dur: number } | null, armor: { tier: ArmorTier, dur: number } | null }} Gear */

export const TOOL_KINDS = /** @type {ToolKind[]} */ (["pickaxe", "axe", "shovel", "sword"]);
export const TIERS = /** @type {Tier[]} */ (["wood", "gold", "stone", "iron", "diamond", "netherite"]);
export const MAX_DUR = { wood: 59, stone: 131, iron: 250, gold: 32, diamond: 1561, netherite: 2031 };
export const ARMOR_DUR = { leather: 55, gold: 77, iron: 165, diamond: 363, netherite: 407 };
export const BOW_DUR = 384;
/** Rank used to compare tiers (gold mines like wood but is ranked by speed for swords). */
export const RANK = { wood: 1, gold: 1.5, stone: 2, iron: 3, diamond: 4, netherite: 5 };
/** Po's attack damage per sword tier (no sword = 3). */
export const SWORD_DAMAGE = { none: 3, wood: 4, gold: 4, stone: 5, iron: 6, diamond: 7, netherite: 8 };
/** Resistance effect level per armour tier (amplifier 0 = 20% less damage). */
export const ARMOR_RESIST = { leather: 0, gold: 0, iron: 1, diamond: 2, netherite: 3 };

export const TIER_TH = { wood: "ไม้", stone: "หิน", iron: "เหล็ก", gold: "ทอง", diamond: "เพชร", netherite: "เนเธอไรต์", leather: "หนัง" };
export const KIND_TH = { pickaxe: "อีเต้อ", axe: "ขวาน", shovel: "พลั่ว", sword: "ดาบ", bow: "ธนู", armor: "ชุดเกราะ" };

/** Item id prefix of each tier. */
export const PREFIX = { wood: "wooden", stone: "stone", iron: "iron", gold: "golden", diamond: "diamond", netherite: "netherite", leather: "leather" };

/** @returns {Gear} */
export function emptyGear() {
  return { pickaxe: null, axe: null, shovel: null, sword: null, bow: null, armor: null };
}

/** @param {Tier} tier @param {ToolKind} kind */
export const toolItemId = (tier, kind) => `minecraft:${PREFIX[tier]}_${kind}`;

/** Parse a tool item id. @param {string} id @returns {{ kind: ToolKind | "bow", tier: Tier | null } | null} */
export function parseToolId(id) {
  if (id === "minecraft:bow") return { kind: "bow", tier: null };
  const m = id.match(/^minecraft:(wooden|stone|iron|golden|diamond|netherite)_(pickaxe|axe|shovel|sword)$/);
  if (!m) return null;
  const tier = /** @type {Tier} */ ({ wooden: "wood", golden: "gold" }[m[1]] ?? m[1]);
  return { kind: /** @type {ToolKind} */ (m[2]), tier };
}

/**
 * @param {Gear} gear @param {ToolKind} kind
 * @returns {string} "hand" or the tier
 */
export function tierOf(gear, kind) {
  return gear[kind]?.tier ?? "hand";
}

/** Harvest level of Po's pickaxe (0 = none). @param {Gear} gear */
export function pickLevel(gear) {
  const t = gear.pickaxe?.tier;
  if (!t) return 0;
  return { wood: 1, gold: 1, stone: 2, iron: 3, diamond: 4, netherite: 5 }[t];
}

/**
 * Wear a tool by one use.
 * @param {Gear} gear @param {ToolKind | "bow"} kind
 * @returns {boolean} true if it just broke
 */
export function wear(gear, kind) {
  const t = gear[kind];
  if (!t) return false;
  t.dur -= 1;
  if (t.dur <= 0) {
    gear[kind] = null;
    return true;
  }
  return false;
}

/** @param {Gear} gear @returns {boolean} true if the armour just broke */
export function wearArmor(gear) {
  if (!gear.armor) return false;
  gear.armor.dur -= 1;
  if (gear.armor.dur <= 0) {
    gear.armor = null;
    return true;
  }
  return false;
}

/** Sword damage key for the entity event. @param {Gear} gear */
export function damageOf(gear) {
  return SWORD_DAMAGE[gear.sword?.tier ?? "none"];
}

/** Short Thai description, e.g. "อีเต้อหิน (98/131)". @param {Gear} gear */
export function describe(gear) {
  /** @type {string[]} */
  const parts = [];
  for (const k of TOOL_KINDS) {
    const t = gear[k];
    parts.push(t ? `${KIND_TH[k]}${TIER_TH[t.tier]} (${t.dur}/${MAX_DUR[t.tier]})` : `${KIND_TH[k]}: ไม่มี`);
  }
  parts.push(gear.bow ? `ธนู (${gear.bow.dur}/${BOW_DUR})` : "ธนู: ไม่มี");
  parts.push(gear.armor ? `ชุดเกราะ${TIER_TH[gear.armor.tier]} (${gear.armor.dur}/${ARMOR_DUR[gear.armor.tier]})` : "ชุดเกราะ: ไม่มี");
  return parts;
}

/** Is `tier` better than what Po has for `kind`? @param {Gear} gear @param {ToolKind} kind @param {Tier} tier */
export function isUpgrade(gear, kind, tier) {
  const cur = gear[kind];
  if (!cur) return true;
  return RANK[tier] > RANK[cur.tier];
}
