// Po's portable furnace: needs a furnace in the bag and real fuel.
// One item every 10 seconds, like a real furnace. Pure data logic.
import { isLogLike, isPlanks, FURNACE, plan } from "./craft.js";

/** @typedef {Record<string, number>} Bag */
/** @typedef {{ in: string, out: string, total: number, done: number }} Job */
/** @typedef {{ jobs: Job[], fuel: number, ticks: number }} SmeltState */

export const TICKS_PER_ITEM = 200;

/** @type {Record<string, string>} */
const OUT = {
  "minecraft:raw_iron": "minecraft:iron_ingot",
  "minecraft:raw_gold": "minecraft:gold_ingot",
  "minecraft:raw_copper": "minecraft:copper_ingot",
  "minecraft:ancient_debris": "minecraft:netherite_scrap",
  "minecraft:sand": "minecraft:glass",
  "minecraft:red_sand": "minecraft:glass",
  "minecraft:cobblestone": "minecraft:stone",
  "minecraft:cobbled_deepslate": "minecraft:deepslate",
  "minecraft:clay_ball": "minecraft:brick",
  "minecraft:netherrack": "minecraft:netherbrick",
  "minecraft:beef": "minecraft:cooked_beef",
  "minecraft:porkchop": "minecraft:cooked_porkchop",
  "minecraft:chicken": "minecraft:cooked_chicken",
  "minecraft:mutton": "minecraft:cooked_mutton",
  "minecraft:cod": "minecraft:cooked_cod",
  "minecraft:salmon": "minecraft:cooked_salmon",
  "minecraft:rabbit": "minecraft:cooked_rabbit",
  "minecraft:potato": "minecraft:baked_potato",
  "minecraft:kelp": "minecraft:dried_kelp",
  "minecraft:cactus": "minecraft:green_dye",
};

/** @param {string} id */
export function smeltOutput(id) {
  if (OUT[id]) return OUT[id];
  if (isLogLike(id)) return "minecraft:charcoal";
  return undefined;
}

export const RAW_ORES = ["minecraft:raw_iron", "minecraft:raw_gold", "minecraft:raw_copper", "minecraft:ancient_debris"];
export const RAW_FOOD = ["minecraft:beef", "minecraft:porkchop", "minecraft:chicken", "minecraft:mutton", "minecraft:cod", "minecraft:salmon", "minecraft:rabbit", "minecraft:potato"];

/** How many items one of these smelts. @type {[ (id: string) => boolean, number ][]} */
const FUELS = [
  [(id) => id === "minecraft:charcoal", 8],
  [(id) => id === "minecraft:coal", 8],
  [(id) => id === "minecraft:coal_block", 80],
  [(id) => id === "minecraft:blaze_rod", 12],
  [isPlanks, 1.5],
  [isLogLike, 1.5],
  [(id) => id === "minecraft:stick", 0.5],
];

/** @returns {SmeltState} */
export function emptySmelt() {
  return { jobs: [], fuel: 0, ticks: 0 };
}

/** @param {SmeltState} s @param {Bag} bag */
export function hasFurnace(s, bag) {
  return (bag[FURNACE] ?? 0) > 0;
}

/**
 * Make sure there is a furnace (crafts one from 8 cobblestone if possible).
 * @param {Bag} bag @returns {boolean}
 */
export function ensureFurnace(bag) {
  if ((bag[FURNACE] ?? 0) > 0) return true;
  const p = plan(bag, "furnace");
  if (!p.ok) return false;
  Object.keys(bag).forEach((k) => delete bag[k]);
  Object.assign(bag, p.bag);
  return true;
}

/**
 * Put items in the furnace queue (they leave the bag right away).
 * @param {SmeltState} s @param {Bag} bag @param {string} id @param {number} n
 * @returns {number} how many were queued
 */
export function enqueue(s, bag, id, n) {
  const out = smeltOutput(id);
  const have = bag[id] ?? 0;
  const count = Math.min(have, n);
  if (!out || count <= 0) return 0;
  bag[id] = have - count;
  if (bag[id] <= 0) delete bag[id];
  const same = s.jobs.find((j) => j.in === id && j.done < j.total);
  if (same) same.total += count;
  else s.jobs.push({ in: id, out, total: count, done: 0 });
  return count;
}

/**
 * Pick fuel from the bag (never the things being smelted) and burn one.
 * @param {SmeltState} s @param {Bag} bag @returns {boolean}
 */
function refuel(s, bag) {
  const busy = new Set(s.jobs.map((j) => j.in));
  for (const [match, value] of FUELS) {
    const id = Object.keys(bag).find((k) => match(k) && !busy.has(k) && k !== FURNACE);
    if (!id) continue;
    // keep a couple of coal for torches if there is anything else to burn
    bag[id] -= 1;
    if (bag[id] <= 0) delete bag[id];
    s.fuel += value;
    return true;
  }
  return false;
}

/**
 * Advance the furnace.
 * @param {SmeltState} s @param {Bag} bag @param {number} ticks
 * @returns {{ type: "item" | "finished" | "nofuel" | "nofurnace", job?: Job }[]}
 */
export function step(s, bag, ticks) {
  /** @type {{ type: "item" | "finished" | "nofuel" | "nofurnace", job?: Job }[]} */
  const events = [];
  const job = s.jobs.find((j) => j.done < j.total);
  if (!job) {
    s.ticks = 0;
    return events;
  }
  if (!hasFurnace(s, bag) && !ensureFurnace(bag)) {
    events.push({ type: "nofurnace", job });
    return events;
  }
  s.ticks += ticks;
  while (s.ticks >= TICKS_PER_ITEM) {
    if (s.fuel < 1 && !refuel(s, bag)) {
      s.ticks = TICKS_PER_ITEM; // wait at "almost done" until fuel arrives
      events.push({ type: "nofuel", job });
      return events;
    }
    s.ticks -= TICKS_PER_ITEM;
    s.fuel -= 1;
    job.done += 1;
    bag[job.out] = (bag[job.out] ?? 0) + 1;
    events.push({ type: "item", job });
    if (job.done >= job.total) {
      events.push({ type: "finished", job });
      s.jobs = s.jobs.filter((j) => j.done < j.total);
      break;
    }
  }
  return events;
}

/** Items still waiting in the furnace (to drop them if Po dies). @param {SmeltState} s */
export function pending(s) {
  /** @type {Record<string, number>} */
  const left = {};
  for (const j of s.jobs) if (j.total > j.done) left[j.in] = (left[j.in] ?? 0) + (j.total - j.done);
  return left;
}
