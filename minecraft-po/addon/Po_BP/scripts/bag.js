// Po's bag. Stored as {itemId: count} inside the owner's saved data, so the
// items are never lost when Po is re-summoned, and drop on the ground when Po dies.
import { ItemStack } from "@minecraft/server";
import { WHISTLE } from "./util.js";

export const BAG_SLOTS = 27;

/** Items whose extra data (potion type, book text, contents...) would be lost. */
const NOT_STORABLE = new Set([
  "minecraft:potion",
  "minecraft:splash_potion",
  "minecraft:lingering_potion",
  "minecraft:tipped_arrow",
  "minecraft:enchanted_book",
  "minecraft:written_book",
  "minecraft:writable_book",
  "minecraft:filled_map",
  "minecraft:firework_rocket",
  "minecraft:firework_star",
  "minecraft:bundle",
  "minecraft:goat_horn",
  "minecraft:suspicious_stew",
  "minecraft:ominous_bottle",
  "minecraft:banner",
  "minecraft:ominous_banner",
  WHISTLE,
]);

/** @type {Map<string, number>} */
const maxStackCache = new Map();

/** @param {string} typeId */
export function maxStack(typeId) {
  let n = maxStackCache.get(typeId);
  if (n === undefined) {
    try {
      n = new ItemStack(typeId, 1).maxAmount;
    } catch {
      n = 64;
    }
    maxStackCache.set(typeId, n);
  }
  return n;
}

/** @param {Record<string, number>} bag */
export function slotsUsed(bag) {
  let used = 0;
  for (const [id, count] of Object.entries(bag)) used += Math.ceil(count / maxStack(id));
  return used;
}

/** How many of this item still fit. @param {Record<string, number>} bag @param {string} typeId */
export function roomFor(bag, typeId) {
  const max = maxStack(typeId);
  const have = bag[typeId] ?? 0;
  const freeSlots = BAG_SLOTS - slotsUsed(bag);
  const partial = have % max === 0 ? 0 : max - (have % max);
  return partial + freeSlots * max;
}

/** @param {Record<string, number>} bag @param {string} typeId @param {number} n @returns {number} how many were added */
export function add(bag, typeId, n) {
  const fit = Math.min(n, roomFor(bag, typeId));
  if (fit > 0) bag[typeId] = (bag[typeId] ?? 0) + fit;
  return fit;
}

/** @param {Record<string, number>} bag @param {string} typeId @param {number} n @returns {number} how many were taken */
export function take(bag, typeId, n) {
  const have = bag[typeId] ?? 0;
  const got = Math.min(have, n);
  if (got <= 0) return 0;
  if (have - got <= 0) delete bag[typeId];
  else bag[typeId] = have - got;
  return got;
}

/** @param {Record<string, number>} bag @param {(id: string) => boolean} match */
export function countMatching(bag, match) {
  let n = 0;
  for (const [id, c] of Object.entries(bag)) if (match(id)) n += c;
  return n;
}

/**
 * Can this exact stack go into the bag without losing anything?
 * @param {ItemStack} item
 * @returns {string | null} reason it cannot, or null if fine
 */
export function whyNotStorable(item) {
  if (NOT_STORABLE.has(item.typeId) || item.typeId.endsWith("shulker_box")) return "special";
  if (item.nameTag) return "named";
  try {
    if (item.getLore().length > 0) return "named";
  } catch {}
  try {
    const ench = item.getComponent("minecraft:enchantable");
    if (ench && ench.getEnchantments().length > 0) return "enchanted";
  } catch {}
  try {
    const dur = item.getComponent("minecraft:durability");
    if (dur && dur.damage > 0) return "damaged";
  } catch {}
  return null;
}

/**
 * Give items to a player; whatever does not fit drops at their feet.
 * @param {import("@minecraft/server").Player} player
 * @param {string} typeId
 * @param {number} n
 */
export function giveToPlayer(player, typeId, n) {
  const container = player.getComponent("minecraft:inventory")?.container;
  const max = maxStack(typeId);
  let left = n;
  while (left > 0) {
    const amount = Math.min(left, max);
    left -= amount;
    let rest;
    try {
      const stack = new ItemStack(typeId, amount);
      rest = container ? container.addItem(stack) : stack;
    } catch {
      return;
    }
    if (rest) player.dimension.spawnItem(rest, player.location);
  }
}

/**
 * Drop the whole bag on the ground (Po died).
 * @param {import("@minecraft/server").Dimension} dimension
 * @param {import("@minecraft/server").Vector3} location
 * @param {Record<string, number>} bag
 */
export function dropAll(dimension, location, bag) {
  for (const [id, count] of Object.entries(bag)) {
    const max = maxStack(id);
    let left = count;
    while (left > 0) {
      const amount = Math.min(left, max);
      left -= amount;
      try {
        dimension.spawnItem(new ItemStack(id, amount), location);
      } catch {}
    }
    delete bag[id];
  }
}
