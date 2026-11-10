// Everything Po remembers, saved in the world so it survives closing the game
// and survives Po dying or being re-summoned. One record per owner.
import { world, system } from "@minecraft/server";
import { PO_NAME_DEFAULT } from "./util.js";

const KEY = "po:d:";
const MAX_LOG = 30;
const MAX_FINDS = 10;

/**
 * @typedef {{ x: number, y: number, z: number, dim: string }} Spot
 * @typedef {{
 *   v: number,
 *   ownerName: string,
 *   poId: string | null,
 *   name: string,
 *   mode: "follow" | "guard" | "stay",
 *   bag: Record<string, number>,
 *   deadUntil: number,
 *   met: boolean,
 *   metDay: number,
 *   lastDay: number,
 *   stats: { days: number, kills: number, fed: number, saves: number, poDeaths: number, ownerDeaths: number, talks: number, diamonds: number },
 *   home: Spot | null,
 *   deathSpot: (Spot & { day: number }) | null,
 *   finds: (Spot & { what: string, day: number })[],
 *   log: { day: number, text: string }[],
 *   settings: { talk: number },
 *   gotWhistle: boolean,
 *   lastPos: Spot | null,
 *   stayAt: Spot | null,
 * }} PoData
 */

/** @type {Map<string, PoData>} */
const cache = new Map();
/** @type {Set<string>} */
const dirty = new Set();

/** @param {string} ownerName @returns {PoData} */
function fresh(ownerName) {
  return {
    v: 1,
    ownerName,
    poId: null,
    name: PO_NAME_DEFAULT,
    mode: "follow",
    bag: {},
    deadUntil: 0,
    met: false,
    metDay: 0,
    lastDay: -1,
    stats: { days: 0, kills: 0, fed: 0, saves: 0, poDeaths: 0, ownerDeaths: 0, talks: 0, diamonds: 0 },
    home: null,
    deathSpot: null,
    finds: [],
    log: [],
    settings: { talk: 1 },
    gotWhistle: false,
    lastPos: null,
    stayAt: null,
  };
}

/**
 * Data for an owner id. Works for players who are offline too.
 * @param {string} ownerId
 * @param {string} [ownerName]
 * @returns {PoData | undefined} undefined when nothing was ever saved and no name was given
 */
export function loadById(ownerId, ownerName) {
  const hit = cache.get(ownerId);
  if (hit) return hit;
  const raw = world.getDynamicProperty(KEY + ownerId);
  /** @type {PoData | undefined} */
  let data;
  if (typeof raw === "string") {
    try {
      /** @type {PoData} */
      const loaded = Object.assign(fresh(ownerName ?? "?"), JSON.parse(raw));
      // fill fields added in later versions
      loaded.stats = Object.assign(fresh("").stats, loaded.stats);
      loaded.settings = Object.assign(fresh("").settings, loaded.settings);
      data = loaded;
    } catch {
      data = undefined;
    }
  }
  if (!data) {
    if (ownerName === undefined) return undefined;
    data = fresh(ownerName);
  }
  if (ownerName) data.ownerName = ownerName;
  cache.set(ownerId, data);
  return data;
}

/** @param {import("@minecraft/server").Player} player @returns {PoData} */
export function dataOf(player) {
  return /** @type {PoData} */ (loadById(player.id, player.name));
}

/** Mark for saving (written within a few seconds). @param {string} ownerId */
export function touch(ownerId) {
  dirty.add(ownerId);
}

/** Save now. @param {string} ownerId */
export function saveNow(ownerId) {
  const data = cache.get(ownerId);
  if (!data) return;
  try {
    world.setDynamicProperty(KEY + ownerId, JSON.stringify(data));
    dirty.delete(ownerId);
  } catch (e) {
    console.warn(`[Po] save failed: ${e}`);
  }
}

/** @param {PoData} data @param {string} text */
export function remember(data, text) {
  data.log.push({ day: world.getDay(), text });
  if (data.log.length > MAX_LOG) data.log.splice(0, data.log.length - MAX_LOG);
}

/** @param {PoData} data @param {string} what @param {Spot} spot */
export function rememberFind(data, what, spot) {
  data.finds.push({ ...spot, what, day: world.getDay() });
  if (data.finds.length > MAX_FINDS) data.finds.splice(0, data.finds.length - MAX_FINDS);
}

/** All owner ids that have ever had a Po in this world. */
export function allOwnerIds() {
  return world
    .getDynamicPropertyIds()
    .filter((k) => k.startsWith(KEY))
    .map((k) => k.slice(KEY.length));
}

export function startAutosave() {
  system.runInterval(() => {
    for (const id of [...dirty]) saveNow(id);
  }, 100);
}
