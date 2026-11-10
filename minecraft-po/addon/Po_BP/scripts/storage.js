// Po's storage chest at home, and picking up items lying around.
import { ItemStack } from "@minecraft/server";
import * as Bag from "./bag.js";
import { TABLE, FURNACE, isCoal, isPlanks } from "./craft.js";
import { FOOD_IDS } from "./names.js";

/** @typedef {import("./store.js").PoData} PoData */

/** What Po keeps on him when emptying the bag into the chest. */
const KEEP = [
  [(/** @type {string} */ id) => id === TABLE, 1],
  [(/** @type {string} */ id) => id === FURNACE, 1],
  [(/** @type {string} */ id) => id === "minecraft:torch", 32],
  [isCoal, 16],
  [(/** @type {string} */ id) => id === "minecraft:stick", 16],
  [isPlanks, 16],
  [(/** @type {string} */ id) => id === "minecraft:cobblestone", 32],
  [(/** @type {string} */ id) => id === "minecraft:arrow", 64],
  [(/** @type {string} */ id) => FOOD_IDS.has(id), 16],
];

/**
 * The chest the player is looking at.
 * @param {import("@minecraft/server").Player} player
 */
export function chestInView(player) {
  try {
    const hit = player.getBlockFromViewDirection({ maxDistance: 7 });
    const b = hit?.block;
    if (!b) return undefined;
    const inv = b.getComponent("minecraft:inventory");
    if (!inv?.container) return undefined;
    return b;
  } catch {
    return undefined;
  }
}

/** @param {PoData} data @param {import("@minecraft/server").Dimension} dim */
export function chestContainer(data, dim) {
  if (!data.chest || data.chest.dim !== dim.id) return undefined;
  try {
    const b = dim.getBlock(data.chest);
    return b?.getComponent("minecraft:inventory")?.container;
  } catch {
    return undefined;
  }
}

/**
 * Move everything except the essentials into the chest.
 * @param {PoData} data @param {import("@minecraft/server").Container} container
 * @returns {number} items moved
 */
export function depositAll(data, container) {
  /** @type {Map<(id: string) => boolean, number>} */
  const kept = new Map();
  let moved = 0;
  for (const [id, count] of Object.entries(data.bag)) {
    let keep = 0;
    for (const [match, limit] of KEEP) {
      const fn = /** @type {(id: string) => boolean} */ (match);
      if (fn(id)) {
        const used = kept.get(fn) ?? 0;
        keep = Math.min(count, Math.max(0, /** @type {number} */ (limit) - used));
        kept.set(fn, used + keep);
        break;
      }
    }
    let give = count - keep;
    const max = Bag.maxStack(id);
    while (give > 0) {
      const amount = Math.min(give, max);
      let rest;
      try {
        rest = container.addItem(new ItemStack(id, amount));
      } catch {
        rest = new ItemStack(id, amount);
      }
      const placed = amount - (rest?.amount ?? 0);
      moved += placed;
      give -= amount;
      Bag.take(data.bag, id, placed);
      if (rest) {
        give = 0; // chest full
      }
    }
  }
  return moved;
}

/**
 * Take up to n items matching from the chest into the bag.
 * @param {PoData} data @param {import("@minecraft/server").Container} container
 * @param {(id: string) => boolean} match @param {number} n
 */
export function takeFromChest(data, container, match, n) {
  let left = n;
  for (let i = 0; i < container.size && left > 0; i++) {
    const it = container.getItem(i);
    if (!it || !match(it.typeId) || Bag.whyNotStorable(it)) continue;
    const got = Math.min(left, it.amount, Bag.roomFor(data.bag, it.typeId));
    if (got <= 0) break;
    Bag.add(data.bag, it.typeId, got);
    left -= got;
    if (got >= it.amount) container.setItem(i, undefined);
    else {
      it.amount -= got;
      container.setItem(i, it);
    }
  }
  return n - left;
}

/**
 * Pick up plain items lying near Po (not right next to the owner).
 * @param {import("@minecraft/server").Entity} po @param {PoData} data
 * @param {import("@minecraft/server").Vector3 | undefined} ownerAt
 * @param {number} radius
 */
export function pickupNear(po, data, ownerAt, radius) {
  let n = 0;
  let items = [];
  try {
    items = po.dimension.getEntities({ type: "minecraft:item", location: po.location, maxDistance: radius });
  } catch {
    return 0;
  }
  for (const e of items) {
    try {
      if (ownerAt && Math.hypot(e.location.x - ownerAt.x, e.location.z - ownerAt.z) < 3) continue;
      const stack = e.getComponent("minecraft:item")?.itemStack;
      if (!stack || Bag.whyNotStorable(stack)) continue;
      // only take whole stacks: the item on the ground cannot be split from here
      if (Bag.roomFor(data.bag, stack.typeId) < stack.amount) continue;
      Bag.add(data.bag, stack.typeId, stack.amount);
      n += stack.amount;
      e.remove();
    } catch {}
  }
  return n;
}
