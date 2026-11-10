// Crafting from Po's bag. Pure functions on a bag object {itemId: count},
// so they can be tested outside the game.
import { isLog } from "./blocks.js";
import { PREFIX, MAX_DUR, ARMOR_DUR, isUpgrade, TIER_TH, KIND_TH, parseToolId } from "./gear.js";

/** @typedef {Record<string, number>} Bag */
/** @typedef {{ id?: string, any?: (id: string) => boolean, n: number, th: string }} Ingredient */
/** @typedef {{ out: string, n: number, table: boolean, ins: Ingredient[], th: string }} Recipe */

export const TABLE = "minecraft:crafting_table";
export const FURNACE = "minecraft:furnace";

/** @param {string} id */
export const isPlanks = (id) => id.endsWith("_planks");
/** @param {string} id */
export const isLogLike = (id) => isLog(id) || id.endsWith("_stem") || /^minecraft:stripped_.*_(log|stem)$/.test(id);
/** @param {string} id */
const isStoneMat = (id) => id === "minecraft:cobblestone" || id === "minecraft:cobbled_deepslate" || id === "minecraft:blackstone";
/** @param {string} id */
export const isCoal = (id) => id === "minecraft:coal" || id === "minecraft:charcoal";

/** Planks made from a log id. @param {string} logId */
export function planksOf(logId) {
  const base = logId.replace("minecraft:stripped_", "minecraft:").replace(/_(log|stem)$/, "");
  return `${base}_planks`;
}

/** @type {Record<string, Ingredient>} */
const ING = {
  planks: { any: isPlanks, n: 1, th: "แผ่นไม้" },
  stick: { id: "minecraft:stick", n: 1, th: "ไม้แท่ง" },
  stone: { any: isStoneMat, n: 1, th: "หินกรวด" },
  iron: { id: "minecraft:iron_ingot", n: 1, th: "แท่งเหล็ก" },
  gold: { id: "minecraft:gold_ingot", n: 1, th: "แท่งทอง" },
  diamond: { id: "minecraft:diamond", n: 1, th: "เพชร" },
  leather: { id: "minecraft:leather", n: 1, th: "หนัง" },
  coal: { any: isCoal, n: 1, th: "ถ่าน" },
  string: { id: "minecraft:string", n: 1, th: "เชือก" },
  flint: { id: "minecraft:flint", n: 1, th: "หินเหล็กไฟ" },
  feather: { id: "minecraft:feather", n: 1, th: "ขนนก" },
  wheat: { id: "minecraft:wheat", n: 1, th: "ข้าวสาลี" },
};
/** @param {keyof typeof ING} k @param {number} n @returns {Ingredient} */
const ing = (k, n) => ({ ...ING[k], n });

const MAT_OF_TIER = { wood: "planks", stone: "stone", iron: "iron", gold: "gold", diamond: "diamond", leather: "leather" };

/** @type {Record<string, Recipe>} */
export const RECIPES = {
  stick: { out: "minecraft:stick", n: 4, table: false, ins: [ing("planks", 2)], th: "ไม้แท่ง" },
  crafting_table: { out: TABLE, n: 1, table: false, ins: [ing("planks", 4)], th: "โต๊ะคราฟต์" },
  torch: { out: "minecraft:torch", n: 4, table: false, ins: [ing("coal", 1), ing("stick", 1)], th: "คบไฟ" },
  furnace: { out: FURNACE, n: 1, table: true, ins: [ing("stone", 8)], th: "เตาเผา" },
  chest: { out: "minecraft:chest", n: 1, table: true, ins: [ing("planks", 8)], th: "หีบ" },
  bow: { out: "minecraft:bow", n: 1, table: true, ins: [ing("stick", 3), ing("string", 3)], th: "ธนู" },
  arrow: { out: "minecraft:arrow", n: 4, table: true, ins: [ing("flint", 1), ing("stick", 1), ing("feather", 1)], th: "ลูกธนู" },
  bread: { out: "minecraft:bread", n: 1, table: true, ins: [ing("wheat", 3)], th: "ขนมปัง" },
  bucket: { out: "minecraft:bucket", n: 1, table: true, ins: [ing("iron", 3)], th: "ถัง" },
  shield: { out: "minecraft:shield", n: 1, table: true, ins: [ing("planks", 6), ing("iron", 1)], th: "โล่" },
  ladder: { out: "minecraft:ladder", n: 3, table: true, ins: [ing("stick", 7)], th: "บันได" },
};
for (const tier of /** @type {const} */ (["wood", "stone", "iron", "gold", "diamond"])) {
  const mat = /** @type {keyof typeof ING} */ (MAT_OF_TIER[tier]);
  const p = PREFIX[tier];
  const t = TIER_TH[tier];
  RECIPES[`${tier}_pickaxe`] = { out: `minecraft:${p}_pickaxe`, n: 1, table: true, ins: [ing(mat, 3), ing("stick", 2)], th: `อีเต้อ${t}` };
  RECIPES[`${tier}_axe`] = { out: `minecraft:${p}_axe`, n: 1, table: true, ins: [ing(mat, 3), ing("stick", 2)], th: `ขวาน${t}` };
  RECIPES[`${tier}_shovel`] = { out: `minecraft:${p}_shovel`, n: 1, table: true, ins: [ing(mat, 1), ing("stick", 2)], th: `พลั่ว${t}` };
  RECIPES[`${tier}_sword`] = { out: `minecraft:${p}_sword`, n: 1, table: true, ins: [ing(mat, 2), ing("stick", 1)], th: `ดาบ${t}` };
  RECIPES[`${tier}_hoe`] = { out: `minecraft:${p}_hoe`, n: 1, table: true, ins: [ing(mat, 2), ing("stick", 2)], th: `จอบ${t}` };
}
for (const tier of /** @type {const} */ (["leather", "iron", "gold", "diamond"])) {
  const mat = /** @type {keyof typeof ING} */ (MAT_OF_TIER[tier]);
  const p = PREFIX[tier];
  const t = TIER_TH[tier];
  RECIPES[`${tier}_helmet`] = { out: `minecraft:${p}_helmet`, n: 1, table: true, ins: [ing(mat, 5)], th: `หมวก${t}` };
  RECIPES[`${tier}_chestplate`] = { out: `minecraft:${p}_chestplate`, n: 1, table: true, ins: [ing(mat, 8)], th: `เสื้อเกราะ${t}` };
  RECIPES[`${tier}_leggings`] = { out: `minecraft:${p}_leggings`, n: 1, table: true, ins: [ing(mat, 7)], th: `กางเกงเกราะ${t}` };
  RECIPES[`${tier}_boots`] = { out: `minecraft:${p}_boots`, n: 1, table: true, ins: [ing(mat, 4)], th: `รองเท้า${t}` };
  // a full set for Po himself (he wears it as one set)
  RECIPES[`${tier}_armor`] = { out: `po:armor_${tier}`, n: 1, table: true, ins: [ing(mat, 24)], th: `ชุดเกราะ${t}` };
}

// ------------------------------------------------------------------ bag helpers

/** @param {Bag} bag @param {(id: string) => boolean} match */
export function countWhere(bag, match) {
  let n = 0;
  for (const [id, c] of Object.entries(bag)) if (match(id)) n += c;
  return n;
}

/** @param {Bag} bag @param {Ingredient} i */
const countIng = (bag, i) => (i.id ? bag[i.id] ?? 0 : countWhere(bag, /** @type {(id: string) => boolean} */ (i.any)));

/** Take n of an ingredient, most plentiful kind first. @param {Bag} bag @param {Ingredient} i @param {number} n */
function takeIng(bag, i, n) {
  const ids = i.id ? [i.id] : Object.keys(bag).filter(/** @type {(id: string) => boolean} */ (i.any)).sort((a, b) => bag[b] - bag[a]);
  let left = n;
  for (const id of ids) {
    const got = Math.min(left, bag[id] ?? 0);
    bag[id] -= got;
    if (bag[id] <= 0) delete bag[id];
    left -= got;
    if (left <= 0) break;
  }
}

/** @param {Bag} bag @param {string} id @param {number} n */
function put(bag, id, n) {
  bag[id] = (bag[id] ?? 0) + n;
}

/**
 * Turn logs into planks until there are `need` planks. Uses the log kind Po has most of.
 * @param {Bag} bag @param {number} need @returns {number} how many planks are still missing
 */
function makePlanks(bag, need) {
  let have = countWhere(bag, isPlanks);
  while (have < need) {
    const logs = Object.keys(bag).filter(isLogLike).sort((a, b) => bag[b] - bag[a]);
    if (logs.length === 0) break;
    bag[logs[0]] -= 1;
    if (bag[logs[0]] <= 0) delete bag[logs[0]];
    put(bag, planksOf(logs[0]), 4);
    have += 4;
  }
  return Math.max(0, need - have);
}

/**
 * Plan crafting `times` batches of a recipe on a copy of the bag.
 * @param {Bag} bag @param {string} key @param {number} [times]
 * @returns {{ ok: boolean, bag: Bag, missing: Record<string, number> }}
 */
export function plan(bag, key, times = 1) {
  const copy = { ...bag };
  /** @type {Record<string, number>} */
  const missing = {};
  const ok = craftInto(copy, key, times, missing, 0);
  return { ok, bag: ok ? copy : bag, missing };
}

/** @param {Bag} bag @param {string} key @param {number} times @param {Record<string, number>} missing @param {number} depth */
function craftInto(bag, key, times, missing, depth) {
  const r = RECIPES[key];
  if (!r || depth > 4) return false;
  if (r.table && !(bag[TABLE] > 0) && !craftInto(bag, "crafting_table", 1, missing, depth + 1)) return false;
  let ok = true;
  // Each ingredient is reserved (taken) as soon as it is available, so a later
  // ingredient (e.g. sticks made from planks) cannot reuse the same items.
  for (const i of r.ins) {
    const need = i.n * times;
    const have = countIng(bag, i);
    if (have < need) {
      if (i.any === isPlanks) {
        const still = makePlanks(bag, need);
        if (still > 0) {
          missing["ไม้ (ท่อน)"] = (missing["ไม้ (ท่อน)"] ?? 0) + Math.ceil(still / 4);
          ok = false;
          continue;
        }
      } else if (i.id === "minecraft:stick") {
        if (!craftInto(bag, "stick", Math.ceil((need - have) / 4), missing, depth + 1)) {
          ok = false;
          continue;
        }
      } else {
        missing[i.th] = (missing[i.th] ?? 0) + (need - have);
        ok = false;
        continue;
      }
    }
    takeIng(bag, i, need);
  }
  if (!ok) return false;
  put(bag, r.out, r.n * times);
  return true;
}

/** "แท่งเหล็ก 2, ไม้แท่ง 1" @param {Record<string, number>} missing */
export function missingText(missing) {
  return Object.entries(missing)
    .map(([k, n]) => `${k} ${n}`)
    .join(", ");
}

// ------------------------------------------------------------------ what the player can ask for

/** Thai words for things to craft -> recipe key prefix. Longest first. */
const CRAFT_WORDS = [
  ["โต๊ะคราฟต์", "crafting_table"],
  ["โต๊ะคราฟ", "crafting_table"],
  ["เตาเผา", "furnace"],
  ["เตา", "furnace"],
  ["ลูกธนู", "arrow"],
  ["ธนู", "bow"],
  ["คบไฟ", "torch"],
  ["ไม้แท่ง", "stick"],
  ["หีบ", "chest"],
  ["ขนมปัง", "bread"],
  ["ถัง", "bucket"],
  ["โล่", "shield"],
  ["บันได", "ladder"],
  ["อีเต้อ", "pickaxe"],
  ["pickaxe", "pickaxe"],
  ["ขวาน", "axe"],
  ["พลั่ว", "shovel"],
  ["ดาบ", "sword"],
  ["จอบ", "hoe"],
  ["หมวก", "helmet"],
  ["เสื้อเกราะ", "chestplate"],
  ["เสื้อ", "chestplate"],
  ["กางเกง", "leggings"],
  ["รองเท้า", "boots"],
  ["ชุดเกราะ", "armor"],
  ["เกราะ", "armor"],
];
const TIER_WORDS = [
  ["เพชร", "diamond"],
  ["diamond", "diamond"],
  ["เหล็ก", "iron"],
  ["iron", "iron"],
  ["ทอง", "gold"],
  ["หนัง", "leather"],
  ["หิน", "stone"],
  ["stone", "stone"],
  ["ไม้", "wood"],
  ["wood", "wood"],
];

/**
 * Work out what to craft from a sentence.
 * @param {string} text
 * @returns {{ thing: string, tier?: string } | undefined}
 */
export function parseCraft(text) {
  let thing;
  let rest = text;
  for (const [w, k] of CRAFT_WORDS) {
    if (text.includes(w)) {
      thing = k;
      rest = text.replace(w, " ");
      break;
    }
  }
  if (!thing) return undefined;
  let tier;
  for (const [w, k] of TIER_WORDS) {
    if (rest.includes(w)) {
      tier = k;
      break;
    }
  }
  return { thing, tier };
}

const TOOLISH = new Set(["pickaxe", "axe", "shovel", "sword", "hoe"]);
const ARMORISH = new Set(["helmet", "chestplate", "leggings", "boots", "armor"]);

/**
 * Recipe key for a parsed request, choosing the best tier the bag allows when none was said.
 * @param {Bag} bag @param {{ thing: string, tier?: string }} req
 * @returns {string | undefined}
 */
export function recipeKeyFor(bag, req) {
  if (!TOOLISH.has(req.thing) && !ARMORISH.has(req.thing)) return RECIPES[req.thing] ? req.thing : undefined;
  const tiers = ARMORISH.has(req.thing) ? ["diamond", "iron", "gold", "leather"] : ["diamond", "iron", "stone", "gold", "wood"];
  if (req.tier) {
    const key = `${req.tier}_${req.thing}`;
    return RECIPES[key] ? key : undefined;
  }
  for (const t of tiers) {
    const key = `${t}_${req.thing}`;
    if (RECIPES[key] && plan(bag, key).ok) return key;
  }
  return `${ARMORISH.has(req.thing) ? "iron" : "stone"}_${req.thing}`;
}

// ------------------------------------------------------------------ Po upgrading his own gear

const RARE = new Set(["gold", "diamond", "netherite"]);

/**
 * Upgrades Po can make right now, best first.
 * @param {Bag} bag @param {import("./gear.js").Gear} gear
 * @param {{ allowRare: boolean, needShovel?: boolean }} opts
 * @returns {{ key: string, kind: string, tier: string, rare: boolean }[]}
 */
export function possibleUpgrades(bag, gear, opts) {
  /** @type {{ key: string, kind: string, tier: string, rare: boolean }[]} */
  const out = [];
  /** @type {[import("./gear.js").ToolKind, string[]][]} */
  const wants = [
    ["pickaxe", ["diamond", "iron", "stone", "wood"]],
    ["sword", ["diamond", "iron", "stone", "wood"]],
    ["axe", ["diamond", "stone", "wood"]],
  ];
  if (opts.needShovel || gear.shovel) wants.push(["shovel", ["diamond", "iron", "stone"]]);
  for (const [kind, tiers] of wants) {
    for (const tier of tiers) {
      if (!isUpgrade(gear, kind, /** @type {any} */ (tier))) break;
      const key = `${tier}_${kind}`;
      if (!plan(bag, key).ok) continue;
      out.push({ key, kind, tier, rare: RARE.has(tier) });
      break;
    }
  }
  // armour: always a big decision (24 pieces), so it is offered, never automatic
  for (const tier of ["diamond", "iron", "leather"]) {
    const cur = gear.armor?.tier;
    const order = { leather: 1, gold: 1.5, iron: 2, diamond: 3, netherite: 4 };
    if (cur && order[/** @type {keyof typeof order} */ (cur)] >= order[/** @type {keyof typeof order} */ (tier)]) break;
    if (plan(bag, `${tier}_armor`).ok) {
      out.push({ key: `${tier}_armor`, kind: "armor", tier, rare: tier !== "leather" });
      break;
    }
  }
  return out;
}

/**
 * Craft a recipe for Po himself and put the result on him.
 * @param {Bag} bag @param {import("./gear.js").Gear} gear @param {string} key
 * @returns {boolean}
 */
export function craftForPo(bag, gear, key) {
  const p = plan(bag, key);
  if (!p.ok) return false;
  const r = RECIPES[key];
  Object.keys(bag).forEach((k) => delete bag[k]);
  Object.assign(bag, p.bag);
  // take the result out of the bag and wear it
  bag[r.out] -= 1;
  if (bag[r.out] <= 0) delete bag[r.out];
  if (r.out.startsWith("po:armor_")) {
    const tier = /** @type {import("./gear.js").ArmorTier} */ (r.out.slice("po:armor_".length));
    gear.armor = { tier, dur: ARMOR_DUR[tier] };
    return true;
  }
  const parsed = parseToolId(r.out);
  if (parsed && parsed.kind !== "bow" && parsed.tier) gear[parsed.kind] = { tier: parsed.tier, dur: MAX_DUR[parsed.tier] };
  else if (parsed && parsed.kind === "bow") gear.bow = { dur: 384 };
  return true;
}

/** "อีเต้อเหล็ก" etc. for an upgrade entry. @param {{ kind: string, tier: string }} u */
export function upgradeName(u) {
  return `${KIND_TH[/** @type {keyof typeof KIND_TH} */ (u.kind)]}${TIER_TH[/** @type {keyof typeof TIER_TH} */ (u.tier)]}`;
}
