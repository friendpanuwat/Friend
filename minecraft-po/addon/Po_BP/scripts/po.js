// Po's body: summoning, modes, following across distance and dimensions,
// healing, emotes, death, and cleaning up duplicates.
import { world, system, ItemStack } from "@minecraft/server";
import { PO_TYPE, dist, posText, relativeDir, compassThai, dimThai } from "./util.js";
import { dataOf, loadById, touch, saveNow, remember, allOwnerIds } from "./store.js";
import * as Bag from "./bag.js";
import { say, line, notice } from "./speech.js";
import * as G from "./gear.js";
import { pending as smeltPending } from "./smelt.js";

/** @typedef {import("./store.js").PoData} PoData */
/** @typedef {import("@minecraft/server").Player} Player */
/** @typedef {import("@minecraft/server").Entity} Entity */
/** @typedef {import("@minecraft/server").Vector3} Vector3 */

export const EMOTE = { none: 0, wave: 1, dance: 2, sit: 3, cheer: 4, scared: 5, point: 6, sleep: 7, walk: 8, work: 9 };

/** Owners whose Po is busy with a job (tasks.js); Po is then not pulled back to the owner. */
export const busy = new Set();

/** Set by main.js: runs after Po appears (applies sword/armour). */
/** @type {{ afterSummon: (owner: Player, data: PoData) => void }} */
export const hooks = { afterSummon: () => {} };
export const MODE_TH = { follow: "เดินตาม", guard: "คุ้มกัน", stay: "รออยู่กับที่" };

/** @type {Map<string, number>} Po id -> emote token */
const emoteToken = new Map();
/** @type {Map<string, number>} Po id -> last time (ms) Po was hurt */
export const lastHurt = new Map();
/** @type {Map<string, number>} owner id -> time (ms) Po was first noticed missing */
const missingSince = new Map();

/** @param {PoData} data @returns {Entity | undefined} */
export function getPo(data) {
  if (!data.poId) return undefined;
  try {
    const e = world.getEntity(data.poId);
    if (e && e.isValid && e.typeId === PO_TYPE) return e;
  } catch {}
  return undefined;
}

/** @param {Player} player @param {PoData} data @param {Record<string, string|number>} [extra] */
export function vars(player, data, extra = {}) {
  return { p: player.name, name: data.name, day: world.getDay(), days: data.stats.days, ...extra };
}

/** Po says a random line of a kind. @param {Player} player @param {PoData} data @param {string} key @param {Record<string, string|number>} [extra] */
export function poSay(player, data, key, extra) {
  say(getPo(data), player, data.name, line(key, vars(player, data, extra)));
}

/** Po says exact text. @param {Player} player @param {PoData} data @param {string} text */
export function poSayText(player, data, text) {
  say(getPo(data), player, data.name, text);
}

/** @param {PoData} data */
function baseEmote(data) {
  return data.mode === "stay" ? EMOTE.sit : EMOTE.none;
}

/**
 * Play an emote; with `ticks` it returns to the normal pose afterwards.
 * @param {Entity} po @param {PoData} data @param {number} emote @param {number} [ticks]
 */
export function setEmote(po, data, emote, ticks) {
  const token = (emoteToken.get(po.id) ?? 0) + 1;
  emoteToken.set(po.id, token);
  try {
    po.setProperty("po:emote", emote);
  } catch {
    return;
  }
  if (!ticks) return;
  system.runTimeout(() => {
    if (emoteToken.get(po.id) !== token) return;
    try {
      if (po.isValid) po.setProperty("po:emote", baseEmote(data));
    } catch {}
  }, ticks);
}

/** Turn Po to look at a point. @param {Entity} po @param {Vector3} target */
export function faceTo(po, target) {
  const dx = target.x - po.location.x;
  const dz = target.z - po.location.z;
  try {
    po.setRotation({ x: 0, y: (Math.atan2(-dx, dz) * 180) / Math.PI });
  } catch {}
}

/** A free spot next to the player (prefers right behind them). @param {Player} player */
export function spotNear(player) {
  const dim = player.dimension;
  const base = player.location;
  const v = player.getViewDirection();
  /** @type {[number, number][]} */
  const offsets = [
    [-Math.round(v.x * 2), -Math.round(v.z * 2)],
    [-2, 0],
    [2, 0],
    [0, -2],
    [0, 2],
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];
  for (const [ox, oz] of offsets) {
    for (const oy of [0, 1, -1]) {
      const p = { x: Math.floor(base.x) + ox + 0.5, y: Math.floor(base.y) + oy, z: Math.floor(base.z) + oz + 0.5 };
      try {
        const feet = dim.getBlock(p);
        const head = dim.getBlock({ x: p.x, y: p.y + 1, z: p.z });
        const below = dim.getBlock({ x: p.x, y: p.y - 1, z: p.z });
        if (feet?.isAir && head?.isAir && below && !below.isAir && !below.isLiquid) return p;
      } catch {}
    }
  }
  return { x: base.x, y: base.y, z: base.z };
}

/**
 * Create Po next to the player.
 * @param {Player} player
 * @param {"first" | "summon" | "revive" | "catch_up"} reason
 */
export function summon(player, reason) {
  const data = dataOf(player);
  /** @type {Entity} */
  let po;
  try {
    po = player.dimension.spawnEntity(PO_TYPE, spotNear(player));
  } catch (e) {
    notice(player, "เรียก Po ไม่สำเร็จ ลองไปยืนที่โล่งๆ แล้วใช้นกหวีดอีกครั้งนะ");
    return undefined;
  }
  try {
    po.setDynamicProperty("po:owner", player.id);
    po.nameTag = data.name;
    po.getComponent("minecraft:tameable")?.tame(player);
  } catch (e) {
    console.warn(`[Po] setup failed: ${e}`);
  }
  data.poId = po.id;
  data.deadUntil = 0;
  if (!data.met) {
    data.met = true;
    data.metDay = world.getDay();
    remember(data, `เจอ ${player.name} ครั้งแรก`);
  }
  if (data.mode === "stay") data.mode = "follow";
  applyMode(po, data);
  saveNow(player.id);
  faceTo(po, player.location);
  setEmote(po, data, EMOTE.wave, 50);
  const key = reason === "first" ? "first_meet" : reason;
  system.runTimeout(() => poSay(player, data, key), 10);
  system.runTimeout(() => hooks.afterSummon(player, data), 2);
  return po;
}

/** @param {Entity} po @param {PoData} data */
function applyMode(po, data) {
  try {
    po.triggerEvent(`po:mode_${data.mode}`);
  } catch (e) {
    console.warn(`[Po] mode event failed: ${e}`);
  }
  setEmote(po, data, baseEmote(data));
}

/**
 * @param {Player} player @param {PoData} data
 * @param {"follow" | "guard" | "stay"} mode
 * @param {boolean} [silent]
 */
export function setMode(player, data, mode, silent) {
  data.mode = mode;
  const po = getPo(data);
  if (po) {
    applyMode(po, data);
    data.stayAt = mode === "stay" ? { x: po.location.x, y: po.location.y, z: po.location.z, dim: po.dimension.id } : null;
  }
  touch(player.id);
  if (!silent) poSay(player, data, `mode_${mode}`);
}

/** Teleport Po to the player (and make him follow). @param {Player} player @param {PoData} data */
export function bring(player, data) {
  const po = getPo(data);
  if (!po) return false;
  try {
    po.teleport(spotNear(player), { dimension: player.dimension });
  } catch {
    return false;
  }
  if (data.mode === "stay") setMode(player, data, "follow", true);
  return true;
}

/**
 * Show the way: chat line + a trail of sparkles on the ground + Po points.
 * @param {Player} player @param {PoData} data
 * @param {import("./store.js").Spot} target @param {string} label
 */
export function guide(player, data, target, label) {
  if (target.dim !== player.dimension.id) {
    poSayText(player, data, `${label}อยู่ใน${dimThai(target.dim)} ต้องกลับไปมิตินั้นก่อนนะ`);
    return;
  }
  const d = Math.round(dist(player.location, target));
  const rel = relativeDir(player, target);
  poSayText(player, data, `${label}อยู่${rel} (${compassThai(player.location, target)}) ห่างไป ${d} บล็อก ที่ ${posText(target)} ตามประกายสีเขียวไปเลย!`);
  const po = getPo(data);
  if (po) {
    faceTo(po, target);
    setEmote(po, data, EMOTE.point, 60);
  }
  let round = 0;
  const id = system.runInterval(() => {
    round++;
    if (round > 5 || !player.isValid) {
      system.clearRun(id);
      return;
    }
    const from = player.location;
    const dx = target.x - from.x;
    const dz = target.z - from.z;
    const len = Math.max(1, Math.sqrt(dx * dx + dz * dz));
    for (let i = 2; i <= Math.min(20, len); i += 1.5) {
      try {
        player.dimension.spawnParticle("minecraft:villager_happy", {
          x: from.x + (dx / len) * i,
          y: from.y + 0.3,
          z: from.z + (dz / len) * i,
        });
      } catch {}
    }
  }, 20);
}

/** Po died. @param {Entity} dead */
export function onPoDied(dead) {
  /** @type {string | undefined} */
  let ownerId;
  try {
    const v = dead.getDynamicProperty("po:owner");
    if (typeof v === "string") ownerId = v;
  } catch {}
  if (!ownerId) {
    // the entity may already be gone; find whose Po had this id
    try {
      const deadId = dead.id;
      ownerId = allOwnerIds().find((id) => loadById(id)?.poId === deadId);
    } catch {}
  }
  if (!ownerId) return;
  const data = loadById(ownerId);
  if (!data || data.poId !== dead.id) return;
  /** @type {Vector3 | undefined} */
  let where;
  /** @type {import("@minecraft/server").Dimension | undefined} */
  let dim;
  try {
    where = dead.location;
    dim = dead.dimension;
  } catch {
    if (data.lastPos) {
      where = data.lastPos;
      dim = world.getDimension(data.lastPos.dim);
    }
  }
  // like a player: everything Po carries falls on the ground
  for (const [id, n] of Object.entries(smeltPending(data.smelt))) data.bag[id] = (data.bag[id] ?? 0) + n;
  data.smelt.jobs = [];
  const hadItems = Object.keys(data.bag).length > 0 || G.TOOL_KINDS.some((kd) => data.gear[kd]) || !!data.gear.armor || !!data.gear.bow;
  if (where && dim) {
    Bag.dropAll(dim, where, data.bag);
    dropGear(dim, where, data.gear);
  }
  data.gear = G.emptyGear();
  data.poId = null;
  data.deadUntil = Date.now() + 60_000;
  data.stats.poDeaths++;
  remember(data, where ? `Po หมดแรงที่ ${posText(where)}` : "Po หมดแรง");
  saveNow(ownerId);
  const owner = world.getPlayers().find((p) => p.id === ownerId);
  if (owner) {
    const itemsText = hadItems && where ? ` ของในกระเป๋า Po ตกอยู่ที่ ${posText(where)}` : "";
    notice(owner, `Po หมดแรงแล้ว!${itemsText} — อีก 1 นาทีใช้นกหวีดเรียก Po กลับมาได้`);
  }
}

/** Every half second: follow across distance/dimensions, regen, day counter. */
let tickCount = 0;
export function tick() {
  tickCount++;
  for (const player of world.getPlayers()) {
    const data = dataOf(player);
    if (!data.poId) continue;
    const po = getPo(data);
    if (!po) {
      handleMissing(player, data);
      continue;
    }
    missingSince.delete(player.id);
    try {
      data.lastPos = { x: po.location.x, y: po.location.y, z: po.location.z, dim: po.dimension.id };
    } catch {}

    const day = world.getDay();
    if (data.lastDay !== day) {
      data.lastDay = day;
      data.stats.days++;
      touch(player.id);
    }

    if (data.mode !== "stay" && !busy.has(player.id)) {
      let far = false;
      try {
        far = po.dimension.id !== player.dimension.id || dist(po.location, player.location) > 20;
      } catch {}
      if (far && isAlive(player)) {
        try {
          po.teleport(spotNear(player), { dimension: player.dimension });
        } catch {}
      }
    }

    // slow regeneration: 1 HP every 4 s when not hurt for 6 s
    if (tickCount % 8 === 0 && Date.now() - (lastHurt.get(po.id) ?? 0) > 6000) {
      const hp = po.getComponent("minecraft:health");
      if (hp && hp.currentValue < hp.effectiveMax) {
        try {
          hp.setCurrentValue(Math.min(hp.effectiveMax, hp.currentValue + 1));
        } catch {}
      }
    }
  }
}

/** @param {Player} player */
export function isAlive(player) {
  const hp = player.getComponent("minecraft:health");
  return !hp || hp.currentValue > 0;
}

/**
 * Po is not loaded. If he should be following, after 10 s make a new Po next
 * to the player (the old one removes itself when its area loads again).
 * @param {Player} player @param {PoData} data
 */
function handleMissing(player, data) {
  if (data.mode === "stay" || busy.has(player.id) || !isAlive(player)) return;
  const since = missingSince.get(player.id);
  if (since === undefined) {
    missingSince.set(player.id, Date.now());
    return;
  }
  if (Date.now() - since < 10_000) return;
  missingSince.delete(player.id);
  summon(player, "catch_up");
}

/** Every 2 s: remove stale duplicates, adopt Po spawned with /summon. */
export function cleanup() {
  for (const dimId of ["overworld", "nether", "the_end"]) {
    /** @type {Entity[]} */
    let list = [];
    try {
      list = world.getDimension(dimId).getEntities({ type: PO_TYPE });
    } catch {
      continue;
    }
    for (const po of list) {
      const owner = po.getDynamicProperty("po:owner");
      if (typeof owner !== "string") {
        adopt(po);
        continue;
      }
      const data = loadById(owner);
      if (!data) {
        po.remove();
        continue;
      }
      if (data.poId === po.id) continue;
      if (getPo(data)) {
        po.remove(); // an older copy; the real Po is elsewhere
      } else if (Date.now() >= data.deadUntil) {
        data.poId = po.id; // ids can change between sessions: this is our Po
        touch(owner);
      } else {
        po.remove();
      }
    }
  }
}

/** A Po made with /summon: give him to the nearest player who has none. @param {Entity} po */
function adopt(po) {
  let best;
  let bestD = 16;
  for (const p of po.dimension.getPlayers()) {
    const d = dist(p.location, po.location);
    const data = dataOf(p);
    if (d < bestD && !getPo(data)) {
      best = p;
      bestD = d;
    }
  }
  if (!best) {
    po.remove();
    return;
  }
  const data = dataOf(best);
  po.setDynamicProperty("po:owner", best.id);
  po.nameTag = data.name;
  try {
    po.getComponent("minecraft:tameable")?.tame(best);
  } catch {}
  data.poId = po.id;
  if (!data.met) {
    data.met = true;
    data.metDay = world.getDay();
  }
  applyMode(po, data);
  saveNow(best.id);
  const who = best;
  system.runTimeout(() => poSay(who, data, data.stats.days > 0 ? "summon" : "first_meet"), 10);
  system.runTimeout(() => hooks.afterSummon(who, data), 2);
}

/**
 * Drop Po's tools and armour as real items with their wear.
 * @param {import("@minecraft/server").Dimension} dim @param {Vector3} at @param {G.Gear} gear
 */
function dropGear(dim, at, gear) {
  /** @type {[string, number, number][]} id, durability left, max */
  const items = [];
  for (const kd of G.TOOL_KINDS) {
    const t = gear[kd];
    if (t) items.push([G.toolItemId(t.tier, kd), t.dur, G.MAX_DUR[t.tier]]);
  }
  if (gear.bow) items.push(["minecraft:bow", gear.bow.dur, G.BOW_DUR]);
  if (gear.armor) {
    const p = G.PREFIX[gear.armor.tier];
    const share = gear.armor.dur / G.ARMOR_DUR[gear.armor.tier];
    for (const piece of ["helmet", "chestplate", "leggings", "boots"]) items.push([`minecraft:${p}_${piece}`, share, 1]);
  }
  for (const [id, left, max] of items) {
    try {
      const stack = new ItemStack(id, 1);
      const d = stack.getComponent("minecraft:durability");
      if (d) d.damage = Math.max(0, Math.min(d.maxDurability - 1, Math.round(d.maxDurability * (1 - left / max))));
      dim.spawnItem(stack, at);
    } catch {}
  }
}
