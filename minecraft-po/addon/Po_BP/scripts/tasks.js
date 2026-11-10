// Po's jobs: chopping trees of a chosen kind, mining a chosen ore (spiral
// staircase down + branch tunnels like a real player), and emptying his bag
// into the home chest. Runs every tick while a job is active.
import { world, system, ItemStack } from "@minecraft/server";
import { makeView } from "./view.js";
import { pathJob, spotsNear, standable } from "./path.js";
import * as B from "./blocks.js";
import * as G from "./gear.js";
import * as Bag from "./bag.js";
import { plan } from "./craft.js";
import * as Smelt from "./smelt.js";
import { dataOf, touch, remember, addKeep, releaseKeep } from "./store.js";
import { getPo, poSayText, setEmote, EMOTE, busy, faceTo, MODE_TH } from "./po.js";
import { autoGear, replaceBroken, reserveHook } from "./equip.js";
import { pickupNear, chestContainer, depositAll } from "./storage.js";
import { playerById, posText } from "./util.js";

/** @typedef {import("@minecraft/server").Player} Player */
/** @typedef {import("@minecraft/server").Entity} Entity */
/** @typedef {import("./store.js").PoData} PoData */
/** @typedef {{ x: number, y: number, z: number }} P */
/** @typedef {import("./view.js").View} View */

/**
 * @typedef {{
 *   kind: "wood" | "mine" | "deposit",
 *   ownerId: string,
 *   phase: string,
 *   wood: string | null,
 *   ore: string | null,
 *   count: number,
 *   got: number,
 *   deliver: boolean,
 *   then: { kind: "mine", ore: string, count: number, deliver: boolean } | null,
 *   internal: boolean,
 *   view: View,
 *   age: number,
 *   path: P[] | null,
 *   pathIdx: number,
 *   routeDone: boolean,
 *   routeResult: P[] | null,
 *   lastRoute: [(p: P) => boolean, P, string, string] | null,
 *   expect: P | null,
 *   digs: P[],
 *   digTicks: number,
 *   afterDig: string,
 *   anchor: P | null,
 *   fight: number,
 *   resume: string,
 *   waitingOwner: boolean,
 *   scanDone: boolean,
 *   found: { x: number, y: number, z: number, key: string }[],
 *   blacklist: Set<string>,
 *   tree: { x: number, y: number, z: number, key: string } | null,
 *   scans: number,
 *   stairs: { cx: number, cz: number, i: number, steps: number } | null,
 *   tun: { dx: number, dz: number, px: number, pz: number, seg: number, len: number, stage: "main" | "cross" } | null,
 *   dug: number,
 *   sinceTorch: number,
 *   targetY: number,
 *   noTier: number,
 *   bonus: Record<string, number>,
 *   stuck: number,
 *   note: string,
 * }} Task
 */

/** @type {Map<string, Task>} */
const tasks = new Map();

const RING = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
];
const QUIET = new Set(["minecraft:enderman", "minecraft:zombie_pigman", "minecraft:piglin", "minecraft:creeper"]);
const PLUGS = ["minecraft:cobblestone", "minecraft:cobbled_deepslate", "minecraft:dirt", "minecraft:netherrack", "minecraft:blackstone"];
const VALUABLE = new Set(["diamond", "emerald", "gold", "iron", "debris", "redstone", "lapis", "copper", "coal", "quartz", "nether_gold"]);

/** @param {string} ownerId */
export const taskOf = (ownerId) => tasks.get(ownerId);

/** Reservation of the job running for this owner (used by the furnace). @param {string} ownerId */
export function activeReserve(ownerId) {
  const t = tasks.get(ownerId);
  return t ? reserveOf(t) : undefined;
}
reserveHook.get = activeReserve;

/** What the owner asked for: Po may not use these for his own tools. @param {Task} t */
function reserveOf(t) {
  if (t.internal) return undefined;
  if (t.kind === "wood") {
    const wood = t.wood;
    return { match: (/** @type {string} */ id) => !!B.woodOfLog(id) && (!wood || B.woodOfLog(id) === wood), n: t.count };
  }
  if (t.kind === "mine" && t.ore) {
    const drop = /** @type {string} */ (B.ORES[/** @type {keyof typeof B.ORES} */ (t.ore)].drop[0]);
    const smelted = Smelt.smeltOutput(drop);
    return { match: (/** @type {string} */ id) => id === drop || id === smelted, n: t.count };
  }
  return undefined;
}

/** @param {Entity} po */
function feet(po) {
  return { x: Math.floor(po.location.x), y: Math.floor(po.location.y + 0.05), z: Math.floor(po.location.z) };
}
/** @param {P} p */
const center = (p) => ({ x: p.x + 0.5, y: p.y, z: p.z + 0.5 });
/** @param {P} p */
const k = (p) => `${p.x},${p.y},${p.z}`;

// ------------------------------------------------------------------ start / stop

/**
 * @param {Player} owner
 * @param {{ kind: "wood" | "mine" | "deposit", wood?: string | null, ore?: string | null, count?: number, deliver?: boolean, internal?: boolean, then?: Task["then"] }} spec
 */
export function startTask(owner, spec) {
  const data = dataOf(owner);
  const po = getPo(data);
  if (!po) return false;
  const old = tasks.get(owner.id);
  if (old) finish(old, "replaced");
  /** @type {Task} */
  const t = {
    kind: spec.kind,
    ownerId: owner.id,
    phase: "start",
    wood: spec.wood ?? null,
    ore: spec.ore ?? null,
    count: spec.count ?? 16,
    got: 0,
    deliver: spec.deliver ?? false,
    then: spec.then ?? null,
    internal: spec.internal ?? false,
    view: makeView(po.dimension),
    age: 0,
    path: null,
    pathIdx: 0,
    routeDone: false,
    routeResult: null,
    lastRoute: null,
    expect: null,
    digs: [],
    digTicks: -1,
    afterDig: "",
    anchor: null,
    fight: 0,
    resume: "",
    waitingOwner: false,
    scanDone: false,
    found: [],
    blacklist: new Set(),
    tree: null,
    scans: 0,
    stairs: null,
    tun: null,
    dug: 0,
    sinceTorch: 0,
    targetY: 0,
    noTier: 0,
    bonus: {},
    stuck: 0,
    note: "",
  };
  tasks.set(owner.id, t);
  busy.add(owner.id);
  try {
    po.triggerEvent("po:mode_work");
  } catch {}
  return true;
}

/** Stop a job on request. @param {string} ownerId @returns {boolean} */
export function cancelTask(ownerId) {
  const t = tasks.get(ownerId);
  if (!t) return false;
  finish(t, "cancel");
  return true;
}

/** One-line progress for "ทำอะไรอยู่". @param {string} ownerId */
export function progressText(ownerId) {
  const t = tasks.get(ownerId);
  if (!t) return undefined;
  if (t.kind === "wood") return `กำลังตัดไม้${t.wood ? B.WOODS[/** @type {keyof typeof B.WOODS} */ (t.wood)].th : ""} ได้ ${t.got}/${t.count} ท่อนแล้ว`;
  if (t.kind === "mine") {
    const o = B.ORES[/** @type {keyof typeof B.ORES} */ (t.ore)];
    const where = t.stairs && t.phase.startsWith("stairs") ? ` (ขุดบันไดลงไปที่ Y ${t.targetY})` : t.tun ? ` (ขุดอุโมงค์ไปแล้ว ${t.dug} บล็อก)` : "";
    return `กำลังหา${o.th} ได้ ${t.got}/${t.count} แล้ว${where}`;
  }
  return "กำลังเอาของไปเก็บเข้าหีบ";
}

// ------------------------------------------------------------------ main loop

export function tickTasks() {
  for (const t of [...tasks.values()]) {
    try {
      step(t);
    } catch (e) {
      console.warn(`[Po] task ${t.kind}/${t.phase}: ${e}`);
      finish(t, "error");
    }
  }
}

/** @param {Task} t */
function step(t) {
  t.age++;
  const owner = playerById(t.ownerId);
  if (!owner) return finish(t, "silent");
  const data = dataOf(owner);
  const po = getPo(data);
  if (!po) return finish(t, "silent");
  if (po.dimension.id !== owner.dimension.id) return finish(t, "dimension");

  // stay close enough to the owner so Po's area stays loaded
  const hd = Math.hypot(po.location.x - owner.location.x, po.location.z - owner.location.z);
  if (hd > 56) return finish(t, "far");
  if (hd > 40) {
    if (!t.waitingOwner) {
      t.waitingOwner = true;
      setEmote(po, data, EMOTE.none);
      poSayText(owner, data, `รอด้วย ${owner.name}! ผมอยู่${posText(po.location)} มาใกล้ๆ หน่อย ผมจะทำงานต่อ`);
    }
    return;
  }
  t.waitingOwner = false;

  // monsters close by: fight first, then go back to work
  if (t.fight > 0) {
    if (t.age % 10 === 0 && hostileNear(po, 8)) t.fight = 60;
    if (--t.fight <= 0) {
      try {
        po.triggerEvent("po:mode_work");
      } catch {}
      resumeAfterFight(t, po);
    }
    return;
  }
  if (t.age % 10 === 0 && hostileNear(po, 5)) {
    t.fight = 60;
    t.resume = t.phase;
    t.anchor = t.anchor ?? feet(po);
    try {
      po.triggerEvent("po:mode_guard");
    } catch {}
    setEmote(po, data, EMOTE.none);
    return;
  }

  // progress on the action bar
  if (t.age % 40 === 0 && !t.internal) {
    const text = progressText(t.ownerId);
    if (text) {
      try {
        owner.onScreenDisplay.setActionBar(`§6${data.name}:§r ${text}`);
      } catch {}
    }
  }

  switch (t.phase) {
    case "routing":
      if (!t.routeDone) return;
      if (t.routeResult === null) {
        t.phase = t.lastRoute ? t.lastRoute[3] : "done";
        return;
      }
      t.path = t.routeResult;
      t.pathIdx = 0;
      t.phase = "walk";
      return;
    case "walk":
      return walk(t, po, data);
    case "dig":
      return dig(t, po, data, owner);
    case "resume":
      t.phase = t.resume;
      return;
  }
  if (t.kind === "wood") return woodStep(t, po, data, owner);
  if (t.kind === "mine") return mineStep(t, po, data, owner);
  return depositStep(t, po, data, owner);
}

/** @param {Entity} po @param {number} r */
function hostileNear(po, r) {
  try {
    return po.dimension.getEntities({ location: po.location, maxDistance: r, families: ["monster"] }).some((m) => !QUIET.has(m.typeId));
  } catch {
    return false;
  }
}

/** @param {Task} t @param {Entity} po */
function resumeAfterFight(t, po) {
  const resume = t.resume === "walk" || t.resume === "routing" ? null : t.resume;
  if (!resume && t.lastRoute) {
    const [goal, hint, after, fail] = t.lastRoute;
    route(t, po, goal, hint, after, fail);
    return;
  }
  const back = t.anchor;
  if (back && Math.hypot(po.location.x - (back.x + 0.5), po.location.z - (back.z + 0.5)) > 1.2) {
    route(t, po, (p) => p.x === back.x && p.y === back.y && p.z === back.z, back, resume ?? "start", resume ?? "start");
    return;
  }
  t.phase = resume ?? "start";
}

// ------------------------------------------------------------------ moving

/**
 * Find a path in the background, then walk it.
 * @param {Task} t @param {Entity} po @param {(p: P) => boolean} goal @param {P} hint @param {string} after @param {string} fail
 */
function route(t, po, goal, hint, after, fail) {
  t.lastRoute = [goal, hint, after, fail];
  t.phase = "routing";
  t.routeDone = false;
  t.routeResult = null;
  t.view.clear();
  const job = pathJob(t.view.id, feet(po), goal, hint, { maxNodes: 2500, maxRange: 40 });
  system.runJob(
    (function* () {
      for (;;) {
        const r = job.next();
        if (r.done) {
          t.routeResult = r.value;
          break;
        }
        yield;
      }
      t.routeDone = true;
    })(),
  );
}

/** @param {Task} t @param {Entity} po @param {PoData} data */
function walk(t, po, data) {
  const path = t.path;
  if (!path || t.pathIdx >= path.length) {
    t.path = null;
    setEmote(po, data, EMOTE.none);
    t.phase = t.lastRoute ? t.lastRoute[2] : "start";
    return;
  }
  // knocked away from where we put him? find a new path
  if (t.expect && Math.hypot(po.location.x - t.expect.x, po.location.z - t.expect.z) > 1.5) {
    t.expect = null;
    if (t.lastRoute && ++t.stuck < 5) {
      const [goal, hint, after, fail] = t.lastRoute;
      route(t, po, goal, hint, after, fail);
      return;
    }
  }
  const node = path[t.pathIdx];
  const target = center(node);
  const speed = data.settings.fast ? 0.32 : 0.22;
  const dx = target.x - po.location.x;
  const dy = target.y - po.location.y;
  const dz = target.z - po.location.z;
  const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const yaw = Math.abs(dx) + Math.abs(dz) > 0.01 ? (Math.atan2(-dx, dz) * 180) / Math.PI : po.getRotation().y;
  /** @type {P} */
  let to;
  if (d <= speed) {
    to = target;
    t.pathIdx++;
    const next = path[t.pathIdx];
    if (next) {
      t.view.forget(next.x, next.y, next.z);
      t.view.forget(next.x, next.y + 1, next.z);
      t.view.forget(next.x, next.y - 1, next.z);
      if (!standable(t.view.id, next.x, next.y, next.z) && t.lastRoute) {
        const [goal, hint, after, fail] = t.lastRoute;
        tp(po, to, yaw);
        route(t, po, goal, hint, after, fail);
        return;
      }
    }
  } else {
    to = { x: po.location.x + (dx / d) * speed, y: po.location.y + (dy / d) * speed, z: po.location.z + (dz / d) * speed };
  }
  setEmote(po, data, EMOTE.walk);
  tp(po, to, yaw);
  t.expect = to;
}

/** @param {Entity} po @param {P} to @param {number} yaw */
function tp(po, to, yaw) {
  try {
    po.teleport(to, { rotation: { x: 0, y: yaw }, keepVelocity: false, checkForBlocks: false });
  } catch {}
}

/** Walk onto one neighbouring block (staircase / tunnel). @param {Task} t @param {Entity} po @param {P} to @param {string} after */
function stepTo(t, po, to, after) {
  t.path = [to];
  t.pathIdx = 0;
  t.lastRoute = [(p) => p.x === to.x && p.y === to.y && p.z === to.z, to, after, after];
  t.phase = "walk";
}

// ------------------------------------------------------------------ digging

/** @param {Task} t @param {P[]} list @param {string} after */
function startDig(t, list, after) {
  t.digs = list;
  t.digTicks = -1;
  t.afterDig = after;
  t.phase = "dig";
}

/** @param {Task} t @param {PoData} data @param {string} id @param {P} at */
function mayBreak(t, data, id, at) {
  if (t.kind === "wood") return B.isLog(id) || id.endsWith("_stem");
  if (!(B.isNaturalDiggable(id) || B.isLeaves(id) || id === "minecraft:snow_layer")) return false;
  const home = data.home;
  if (home && home.dim === t.view.dim.id && Math.hypot(at.x - home.x, at.z - home.z) < 12 && at.y > home.y - 8) return false;
  return true;
}

/**
 * Plug lava/water next to a block before opening it.
 * @param {Task} t @param {PoData} data @param {P} b
 * @returns {boolean} false if there is lava and nothing to plug it with
 */
function makeSafe(t, data, b) {
  const sides = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];
  for (const [dx, dy, dz] of sides) {
    const p = { x: b.x + dx, y: b.y + dy, z: b.z + dz };
    t.view.forget(p.x, p.y, p.z);
    const id = t.view.id(p.x, p.y, p.z);
    if (!B.isLava(id) && !B.isWater(id)) continue;
    const plug = PLUGS.find((pid) => (data.bag[pid] ?? 0) > 0);
    if (plug && t.view.set(p.x, p.y, p.z, plug)) {
      Bag.take(data.bag, plug, 1);
      continue;
    }
    if (B.isLava(id)) return false;
  }
  return true;
}

/** @param {Task} t @param {Entity} po @param {PoData} data @param {Player} owner */
function dig(t, po, data, owner) {
  if (t.digs.length === 0) {
    setEmote(po, data, EMOTE.none);
    t.phase = t.afterDig;
    return;
  }
  const b = t.digs[0];
  t.view.forget(b.x, b.y, b.z);
  const id = t.view.id(b.x, b.y, b.z);
  if (B.isPassable(id) || B.isWater(id) || id === "minecraft:unknown") {
    t.digs.shift();
    t.digTicks = -1;
    return;
  }
  if (t.digTicks < 0) {
    if (B.isLava(id) || !mayBreak(t, data, id, b)) {
      t.digs.shift();
      t.note = B.isLava(id) ? "lava" : "blocked";
      return;
    }
    const kind = B.toolFor(id);
    if (kind === "pickaxe" && B.levelNeeded(id) > G.pickLevel(data.gear)) {
      if (B.oreOfBlock(id) === t.ore) t.noTier++;
      t.digs.shift();
      if (!G.pickLevel(data.gear)) t.note = "nopick";
      return;
    }
    if (!makeSafe(t, data, b)) {
      t.digs = [];
      t.note = "lava";
      poSayText(owner, data, "เจอลาวา! ไม่มีหินปิด ขอเลี่ยงทางนี้นะ");
      return;
    }
    const tool = kind === "any" ? null : data.gear[kind];
    const ticks = B.breakTicks(id, tool?.tier ?? "hand", !!tool);
    t.digTicks = Math.max(2, Math.round(data.settings.fast ? ticks / 2 : ticks));
    faceTo(po, center(b));
    setEmote(po, data, EMOTE.work);
  }
  t.digTicks--;
  if (t.digTicks % 8 === 0) t.view.sound(soundOf(id), center(b));
  if (t.digTicks > 0) return;

  // break it
  const kind = B.toolFor(id);
  t.view.set(b.x, b.y, b.z, "minecraft:air");
  t.view.sound(soundOf(id), center(b));
  addDrops(t, po, data, owner, B.dropsOf(id), id);
  if (kind !== "any" && data.gear[kind]) {
    if (G.wear(data.gear, kind)) {
      if (!replaceBroken(owner, data, kind) && kind === "pickaxe" && t.kind === "mine") {
        t.note = "pickbroke";
      }
    }
  }
  touch(owner.id);
  t.digs.shift();
  t.digTicks = -1;
}

/** @param {string} id */
function soundOf(id) {
  if (B.isLog(id) || id.endsWith("_stem")) return "dig.wood";
  if (id.includes("gravel")) return "dig.gravel";
  if (id.includes("sand")) return "dig.sand";
  if (id.includes("dirt") || id.includes("grass") || id.includes("clay") || B.isLeaves(id)) return "dig.grass";
  if (id.includes("deepslate")) return "dig.deepslate";
  if (id.includes("netherrack")) return "dig.netherrack";
  return "dig.stone";
}

/**
 * @param {Task} t @param {Entity} po @param {PoData} data @param {Player} owner
 * @param {[string, number][]} drops @param {string} brokenId
 */
function addDrops(t, po, data, owner, drops, brokenId) {
  for (const [id, n] of drops) {
    const added = Bag.add(data.bag, id, n);
    if (added < n) {
      try {
        po.dimension.spawnItem(new ItemStack(id, n - added), po.location);
      } catch {}
      t.note = "full";
    }
    const limit = B.JUNK_LIMIT.get(id);
    if (limit !== undefined && (data.bag[id] ?? 0) > limit) {
      if (limit === 0) delete data.bag[id];
      else data.bag[id] = limit;
    }
    if (t.kind === "wood") {
      const wk = B.woodOfLog(id);
      if (wk && (!t.wood || t.wood === wk)) t.got += added;
    } else if (t.kind === "mine") {
      const want = B.ORES[/** @type {keyof typeof B.ORES} */ (t.ore)];
      if (id === want.drop[0]) t.got += added;
      else {
        const ore = B.oreOfBlock(brokenId);
        if (ore && ore !== t.ore && B.BONUS_ORES.has(ore)) t.bonus[ore] = (t.bonus[ore] ?? 0) + added;
      }
    }
  }
  const ore = B.oreOfBlock(brokenId);
  if (ore === "diamond" || ore === "emerald" || ore === "debris") {
    const label = B.ORES[/** @type {keyof typeof B.ORES} */ (ore)].th;
    remember(data, `Po ขุดได้${label}ที่ ${posText(po.location)}`);
    poSayText(owner, data, `เจอ${label}!!! เก็บไว้แล้ว`);
  }
}

/** Place a torch at `at` if Po has (or can make) one. @param {Task} t @param {PoData} data @param {P} at */
function placeTorch(t, data, at) {
  if ((data.bag["minecraft:torch"] ?? 0) <= 0) {
    const p = plan(data.bag, "torch");
    if (!p.ok) return false;
    Object.keys(data.bag).forEach((key) => delete data.bag[key]);
    Object.assign(data.bag, p.bag);
  }
  t.view.forget(at.x, at.y, at.z);
  if (t.view.id(at.x, at.y, at.z) !== "minecraft:air" || !B.isGround(t.view.id(at.x, at.y - 1, at.z))) return false;
  if (!t.view.place(at.x, at.y, at.z, "minecraft:torch")) return false;
  Bag.take(data.bag, "minecraft:torch", 1);
  return true;
}

/**
 * Connected blocks of the same ore within reach of Po.
 * @param {Task} t @param {P} start @param {string} oreKey @param {P} eye
 */
function vein(t, start, oreKey, eye) {
  /** @type {P[]} */
  const out = [];
  const seen = new Set([k(start)]);
  const queue = [start];
  while (queue.length && out.length < 16) {
    const p = /** @type {P} */ (queue.shift());
    out.push(p);
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          const n = { x: p.x + dx, y: p.y + dy, z: p.z + dz };
          const nk = k(n);
          if (seen.has(nk)) continue;
          seen.add(nk);
          if (B.oreOfBlock(t.view.id(n.x, n.y, n.z)) !== oreKey) continue;
          if (Math.hypot(n.x + 0.5 - eye.x, n.y + 0.5 - eye.y, n.z + 0.5 - eye.z) > 4.8) continue;
          queue.push(n);
        }
  }
  return out;
}

/**
 * Ores in the walls around Po that he can and wants to mine.
 * @param {Task} t @param {PoData} data @param {P} f Po's feet
 */
function oresAround(t, data, f) {
  const level = G.pickLevel(data.gear);
  const eye = { x: f.x + 0.5, y: f.y + 1.6, z: f.z + 0.5 };
  /** @type {P[]} */
  const list = [];
  const taken = new Set();
  for (let dx = -2; dx <= 2; dx++)
    for (let dy = -1; dy <= 3; dy++)
      for (let dz = -2; dz <= 2; dz++) {
        const p = { x: f.x + dx, y: f.y + dy, z: f.z + dz };
        if (taken.has(k(p))) continue;
        const ore = B.oreOfBlock(t.view.id(p.x, p.y, p.z));
        if (!ore || !(ore === t.ore || VALUABLE.has(ore))) continue;
        if (ore === "stone" || ore === "deepslate" || ore === "dirt" || ore === "sand" || ore === "gravel") continue;
        if (B.ORES[/** @type {keyof typeof B.ORES} */ (ore)].tier > level) {
          if (ore === t.ore) t.noTier++;
          continue;
        }
        if (!exposed(t.view, p) && Math.max(Math.abs(dx), Math.abs(dz)) > 1) continue;
        for (const v of vein(t, p, ore, eye)) {
          if (!taken.has(k(v))) {
            taken.add(k(v));
            list.push(v);
          }
        }
      }
  return list;
}

/** Is a block next to open space (so a player could see it)? @param {View} view @param {P} p */
function exposed(view, p) {
  return (
    B.isPassable(view.id(p.x + 1, p.y, p.z)) ||
    B.isPassable(view.id(p.x - 1, p.y, p.z)) ||
    B.isPassable(view.id(p.x, p.y + 1, p.z)) ||
    B.isPassable(view.id(p.x, p.y - 1, p.z)) ||
    B.isPassable(view.id(p.x, p.y, p.z + 1)) ||
    B.isPassable(view.id(p.x, p.y, p.z - 1))
  );
}

// ------------------------------------------------------------------ finding things

/**
 * Trees around a point: scans the tops of columns, goes down through leaves to
 * the trunk, and keeps only trees with natural leaves standing on the ground.
 * @param {Task} t @param {P} c @param {number} radius @param {PoData} data
 */
function* scanTrees(t, c, radius, data) {
  const view = t.view;
  let n = 0;
  for (let r = 0; r <= radius; r++) {
    for (let dx = -r; dx <= r; dx++)
      for (let dz = -r; dz <= r; dz++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
        const x = c.x + dx;
        const z = c.z + dz;
        if (++n % 24 === 0) yield;
        const top = view.top(x, z);
        if (!top || !(B.isLeaves(top.id) || B.isLog(top.id))) continue;
        let y = top.y;
        let logY = null;
        for (let i = 0; i < 16; i++, y--) {
          const id = view.id(x, y, z);
          if (B.isLog(id)) {
            logY = y;
            break;
          }
          if (!(B.isLeaves(id) || B.isPassable(id))) break;
        }
        if (logY === null) continue;
        const wk = B.woodOfLog(view.id(x, logY, z));
        if (!wk) continue;
        let by = logY;
        while (B.isLog(view.id(x, by - 1, z)) && by > logY - 40) by--;
        if (!B.isGround(view.id(x, by - 1, z))) continue;
        if (B.isLeaves(top.id) ? !view.naturalLeaves(x, top.y, z) : !naturalLeavesNear(view, { x, y: top.y, z })) continue;
        if (t.found.some((f) => Math.abs(f.x - x) <= 1 && Math.abs(f.z - z) <= 1 && Math.abs(f.y - by) <= 3)) continue;
        t.found.push({ x, y: by, z, key: wk });
        noteSeen(data, wk, B.WOODS[/** @type {keyof typeof B.WOODS} */ (wk)].th, { x, y: by, z }, view.dim.id);
      }
  }
}

/** @param {View} view @param {P} p */
function naturalLeavesNear(view, p) {
  let n = 0;
  for (let dx = -2; dx <= 2; dx++)
    for (let dy = -1; dy <= 2; dy++)
      for (let dz = -2; dz <= 2; dz++) {
        const q = { x: p.x + dx, y: p.y + dy, z: p.z + dz };
        if (B.isLeaves(view.id(q.x, q.y, q.z)) && view.naturalLeaves(q.x, q.y, q.z)) n++;
      }
  return n >= 3;
}

/**
 * Exposed ores in a box around Po.
 * @param {Task} t @param {P} c @param {number} r @param {number} dy @param {PoData} data
 */
function* scanOres(t, c, r, dy, data) {
  const view = t.view;
  let n = 0;
  for (let x = c.x - r; x <= c.x + r; x++)
    for (let z = c.z - r; z <= c.z + r; z++)
      for (let y = c.y - dy; y <= c.y + dy; y++) {
        if (++n % 400 === 0) yield;
        const ore = B.oreOfBlock(view.id(x, y, z));
        if (!ore) continue;
        if (ore !== t.ore && !(ore === "diamond" || ore === "emerald" || ore === "debris" || ore === "gold" || ore === "iron")) continue;
        const p = { x, y, z };
        if (!exposed(view, p)) continue;
        if (ore === t.ore) t.found.push({ ...p, key: ore });
        if (ore !== "stone" && ore !== "dirt" && ore !== "sand" && ore !== "gravel" && ore !== "deepslate")
          noteSeen(data, ore, B.ORES[/** @type {keyof typeof B.ORES} */ (ore)].th, p, view.dim.id);
      }
}

/**
 * Remember where a resource was seen (one note per kind per area).
 * @param {PoData} data @param {string} key @param {string} th @param {P} p @param {string} dim
 */
function noteSeen(data, key, th, p, dim) {
  if (data.seen.some((s) => s.key === key && s.dim === dim && Math.hypot(s.x - p.x, s.z - p.z) < 32)) return;
  data.seen.push({ key, th, x: p.x, y: p.y, z: p.z, dim, day: world.getDay() });
  if (data.seen.length > 40) data.seen.splice(0, data.seen.length - 40);
}

/** @param {Task} t @param {Generator<void, void, void>} gen @param {string} after */
function runScan(t, gen, after) {
  t.scanDone = false;
  t.phase = "scanning";
  void after;
  system.runJob(
    (function* () {
      yield* gen;
      t.scanDone = true;
    })(),
  );
}

// ------------------------------------------------------------------ wood

/** @param {Task} t @param {Entity} po @param {PoData} data @param {Player} owner */
function woodStep(t, po, data, owner) {
  switch (t.phase) {
    case "start": {
      t.found = [];
      t.scans++;
      runScan(t, scanTrees(t, feet(po), t.scans > 1 ? 28 : 18, data), "pick");
      return;
    }
    case "scanning":
      if (t.scanDone) t.phase = "pick";
      return;
    case "pick": {
      const f = feet(po);
      const tree = t.found
        .filter((tr) => !t.blacklist.has(k(tr)) && (!t.wood || tr.key === t.wood))
        .sort((a, b) => Math.hypot(a.x - f.x, a.z - f.z) - Math.hypot(b.x - f.x, b.z - f.z))[0];
      if (!tree) {
        if (t.scans < 2) {
          t.phase = "start";
          return;
        }
        return finish(t, t.got > 0 ? "done_partial" : "notrees");
      }
      t.tree = tree;
      const spots = new Set(spotsNear(t.view.id, tree, 3.2).map(k));
      if (spots.size === 0) {
        t.blacklist.add(k(tree));
        return;
      }
      route(t, po, (p) => spots.has(k(p)), tree, "chop", "unreachable");
      return;
    }
    case "unreachable":
      if (t.tree) t.blacklist.add(k(t.tree));
      t.phase = "pick";
      return;
    case "chop": {
      const tree = /** @type {NonNullable<Task["tree"]>} */ (t.tree);
      t.anchor = feet(po);
      const logs = treeLogs(t, tree);
      startDig(t, logs, "after_tree");
      return;
    }
    case "after_tree": {
      const tree = /** @type {NonNullable<Task["tree"]>} */ (t.tree);
      t.blacklist.add(k(tree));
      t.found = t.found.filter((f) => k(f) !== k(tree));
      replant(t, data, tree);
      pickupNear(po, data, owner.location, 6);
      autoGear(owner, data, { quiet: false, reserve: reserveOf(t) });
      if (t.got >= t.count) return finish(t, "done");
      if (t.note === "full" || Bag.slotsUsed(data.bag) >= Bag.BAG_SLOTS) return finish(t, "full");
      t.phase = "pick";
      return;
    }
    default:
      t.phase = "start";
  }
}

/** All logs of one tree, bottom first. @param {Task} t @param {{ x: number, y: number, z: number, key: string }} tree */
function treeLogs(t, tree) {
  const logId = B.WOODS[/** @type {keyof typeof B.WOODS} */ (tree.key)].log;
  /** @type {P[]} */
  const out = [];
  const seen = new Set([k(tree)]);
  const queue = [{ x: tree.x, y: tree.y, z: tree.z }];
  while (queue.length && out.length < 90) {
    const p = /** @type {P} */ (queue.shift());
    out.push(p);
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = 0; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          const n = { x: p.x + dx, y: p.y + dy, z: p.z + dz };
          if (seen.has(k(n)) || Math.hypot(n.x - tree.x, n.z - tree.z) > 7) continue;
          seen.add(k(n));
          if (t.view.id(n.x, n.y, n.z) === logId) queue.push(n);
        }
  }
  return out.sort((a, b) => a.y - b.y);
}

/** @param {Task} t @param {PoData} data @param {{ x: number, y: number, z: number, key: string }} tree */
function replant(t, data, tree) {
  const sapling = B.WOODS[/** @type {keyof typeof B.WOODS} */ (tree.key)].sapling;
  if ((data.bag[sapling] ?? 0) <= 0) return;
  t.view.forget(tree.x, tree.y, tree.z);
  const ground = t.view.id(tree.x, tree.y - 1, tree.z);
  if (t.view.id(tree.x, tree.y, tree.z) !== "minecraft:air") return;
  if (!/(dirt|grass_block|podzol|moss_block|mud|dirt_with_roots|mycelium)/.test(ground)) return;
  if (t.view.place(tree.x, tree.y, tree.z, sapling)) Bag.take(data.bag, sapling, 1);
}

// ------------------------------------------------------------------ mining

/** @param {Task} t @param {Entity} po @param {PoData} data @param {Player} owner */
function mineStep(t, po, data, owner) {
  const ore = B.ORES[/** @type {keyof typeof B.ORES} */ (t.ore)];
  if (t.note === "pickbroke") return finish(t, "pickbroke");
  if (t.note === "full") return finish(t, "full");
  if (t.got >= t.count && t.phase !== "start") return finish(t, "done");
  switch (t.phase) {
    case "start": {
      autoGear(owner, data, { quiet: false, needShovel: ore.tier === 0, reserve: reserveOf(t) });
      if (ore.tier >= 1 && G.pickLevel(data.gear) === 0) {
        // no pickaxe and nothing to make one: chop a little wood first
        finish(t, "chain", { kind: "wood", wood: null, count: 3, internal: true, then: { kind: "mine", ore: /** @type {string} */ (t.ore), count: t.count, deliver: false } });
        return;
      }
      if (ore.tier > G.pickLevel(data.gear)) {
        poSayText(owner, data, `${ore.th}ต้องใช้อีเต้อ${ore.tier >= 4 ? "เพชร" : ore.tier === 3 ? "เหล็ก" : "หิน"} แต่ผมยังไม่มี ระหว่างทางผมจะเก็บแร่มาทำอีเต้อใหม่ก่อนนะ`);
      }
      const f = feet(po);
      t.targetY = targetYFor(t, ore, f);
      t.found = [];
      t.scans++;
      runScan(t, scanOres(t, f, 10, 6, data), "pick");
      return;
    }
    case "scanning":
      if (t.scanDone) t.phase = "pick";
      return;
    case "pick": {
      const f = feet(po);
      const level = G.pickLevel(data.gear);
      const target = t.found
        .filter((o) => !t.blacklist.has(k(o)) && (ore.tier <= level || ore.tier === 0))
        .sort((a, b) => Math.hypot(a.x - f.x, a.y - f.y, a.z - f.z) - Math.hypot(b.x - f.x, b.y - f.y, b.z - f.z))[0];
      if (target) {
        t.tree = target;
        const spots = new Set(spotsNear(t.view.id, target, 4.2).map(k));
        if (spots.size === 0) {
          t.blacklist.add(k(target));
          return;
        }
        route(t, po, (p) => spots.has(k(p)), target, "ore_vein", "ore_unreachable");
        return;
      }
      return decideDigging(t, po, data, owner, ore);
    }
    case "ore_unreachable":
      if (t.tree) t.blacklist.add(k(t.tree));
      t.phase = "pick";
      return;
    case "ore_vein": {
      const target = /** @type {NonNullable<Task["tree"]>} */ (t.tree);
      t.blacklist.add(k(target));
      const f = feet(po);
      t.anchor = f;
      const list = vein(t, target, target.key, { x: f.x + 0.5, y: f.y + 1.6, z: f.z + 0.5 });
      startDig(t, list, "after_vein");
      return;
    }
    case "after_vein":
      pickupNear(po, data, owner.location, 4);
      autoGear(owner, data, { quiet: false, reserve: reserveOf(t) });
      t.phase = "pick";
      return;
    case "stairs":
      return stairsStep(t, po, data, owner);
    case "stairs_moved": {
      const st = /** @type {NonNullable<Task["stairs"]>} */ (t.stairs);
      st.i = (st.i + 1) % 8;
      st.steps++;
      t.stuck = 0;
      const f = feet(po);
      t.anchor = f;
      if (++t.sinceTorch >= 7 && placeTorch(t, data, prevRing(st, f))) t.sinceTorch = 0;
      autoGear(owner, data, { quiet: false, reserve: reserveOf(t) });
      autoSmeltOres(data);
      const ores = oresAround(t, data, f);
      startDig(t, ores, "stairs");
      return;
    }
    case "tunnel":
      return tunnelStep(t, po, data, owner);
    case "tunnel_moved": {
      const tun = /** @type {NonNullable<Task["tun"]>} */ (t.tun);
      tun.seg++;
      t.dug++;
      const f = feet(po);
      t.anchor = f;
      if (++t.sinceTorch >= 8 && placeTorch(t, data, { x: f.x - tun.dx, y: f.y, z: f.z - tun.dz })) t.sinceTorch = 0;
      autoGear(owner, data, { quiet: false, reserve: reserveOf(t) });
      autoSmeltOres(data);
      const ores = oresAround(t, data, f);
      startDig(t, ores, "tunnel");
      return;
    }
    default:
      t.phase = "start";
  }
}

/** @param {Task} t @param {(typeof B.ORES)[keyof typeof B.ORES]} ore @param {P} f */
function targetYFor(t, ore, f) {
  const minY = t.view.dim.heightRange.min + 6;
  if (typeof ore.y === "number") return Math.max(minY, ore.y);
  if (ore.y === "shallow") {
    const top = t.view.top(f.x, f.z);
    return Math.max(minY, Math.min(f.y - 4, (top?.y ?? f.y) - 6));
  }
  return f.y;
}

/**
 * No ore in sight: dig down to the right layer, then tunnel.
 * @param {Task} t @param {Entity} po @param {PoData} data @param {Player} owner @param {(typeof B.ORES)[keyof typeof B.ORES]} ore
 */
function decideDigging(t, po, data, owner, ore) {
  const f = feet(po);
  const dimId = t.view.dim.id;
  const inNether = dimId === "minecraft:nether";
  if ((ore.dim === "nether" && !inNether) || (ore.dim === "overworld" && inNether)) {
    poSayText(owner, data, `${ore.th}อยู่ใน${ore.dim === "nether" ? " Nether" : "โลกปกติ"} นะ ต้องไปที่นั่นก่อน`);
    return finish(t, "silent_done");
  }
  if (ore.tier === 0 || ore.y === null) {
    if (ore.dim === "nether" && inNether && t.dug < 200) return startTunnel(t, po, owner);
    if (t.scans < 2) {
      t.phase = "start";
      return;
    }
    return finish(t, "notfound");
  }
  if (t.dug >= 200) return finish(t, "long");
  if (f.y > t.targetY + 2) {
    if (!t.stairs) {
      t.stairs = { cx: f.x + 1, cz: f.z, i: 7, steps: 0 };
      poSayText(owner, data, `${ore.th}อยู่แถว Y ${t.targetY} ผมจะขุดบันไดวนลงไปนะ ตามลงมาได้เลย`);
    }
    t.phase = "stairs";
    return;
  }
  return startTunnel(t, po, owner);
}

/** @param {Task} t @param {Entity} po @param {Player} owner */
function startTunnel(t, po, owner) {
  if (!t.tun) {
    const v = owner.getViewDirection();
    const horiz = Math.abs(v.x) > Math.abs(v.z) ? { dx: Math.sign(v.x) || 1, dz: 0 } : { dx: 0, dz: Math.sign(v.z) || 1 };
    t.tun = { dx: horiz.dx, dz: horiz.dz, px: -horiz.dz, pz: horiz.dx, seg: 0, len: 20, stage: "main" };
  }
  t.phase = "tunnel";
}

/** The ring cell Po stood on before the last step (good spot for a torch). @param {NonNullable<Task["stairs"]>} st @param {P} f */
function prevRing(st, f) {
  const [rx, rz] = RING[(st.i + 7) % 8];
  return { x: st.cx + rx, y: f.y + 1, z: st.cz + rz };
}

/** One step of the spiral staircase. @param {Task} t @param {Entity} po @param {PoData} data @param {Player} owner */
function stairsStep(t, po, data, owner) {
  const st = /** @type {NonNullable<Task["stairs"]>} */ (t.stairs);
  const f = feet(po);
  if (f.y <= t.targetY || st.steps > 150) {
    poSayText(owner, data, `ถึง Y ${f.y} แล้ว เริ่มขุดอุโมงค์หา${B.ORES[/** @type {keyof typeof B.ORES} */ (t.ore)].th}นะ`);
    return startTunnel(t, po, owner);
  }
  if (t.note === "lava" || t.note === "blocked") {
    t.note = "";
    poSayText(owner, data, "ทางลงตรงนี้อันตราย ขอขุดอุโมงค์ตรงระดับนี้แทนนะ");
    return startTunnel(t, po, owner);
  }
  const [rx, rz] = RING[(st.i + 1) % 8];
  const cell = { x: st.cx + rx, y: f.y - 1, z: st.cz + rz };
  // the step below the new cell must hold Po
  const floor = { x: cell.x, y: cell.y - 1, z: cell.z };
  t.view.forget(floor.x, floor.y, floor.z);
  const floorId = t.view.id(floor.x, floor.y, floor.z);
  if (!B.isGround(floorId)) {
    const plug = PLUGS.find((pid) => (data.bag[pid] ?? 0) > 0);
    if (!plug || !t.view.set(floor.x, floor.y, floor.z, plug)) {
      // a cave below: look around here instead
      t.found = [];
      runScan(t, scanOres(t, f, 10, 8, data), "pick");
      t.targetY = f.y;
      return;
    }
    Bag.take(data.bag, plug, 1);
  }
  const need = [
    { x: cell.x, y: cell.y + 2, z: cell.z },
    { x: cell.x, y: cell.y + 1, z: cell.z },
    cell,
  ];
  const blocking = need.filter((p) => !B.isPassable(t.view.id(p.x, p.y, p.z)));
  if (blocking.length === 0 && standable(t.view.id, cell.x, cell.y, cell.z)) {
    stepTo(t, po, cell, "stairs_moved");
    return;
  }
  if (++t.stuck > 30) {
    t.stuck = 0;
    return startTunnel(t, po, owner);
  }
  startDig(t, blocking, "stairs");
}

/** One block of tunnel. @param {Task} t @param {Entity} po @param {PoData} data @param {Player} owner */
function tunnelStep(t, po, data, owner) {
  const tun = /** @type {NonNullable<Task["tun"]>} */ (t.tun);
  if (t.dug >= 200) return finish(t, "long");
  const f = feet(po);
  if (tun.seg >= tun.len || t.note === "lava" || t.note === "blocked") {
    t.note = "";
    turn(t, owner);
  }
  // keep within reach of the owner (so the area stays loaded)
  const next = { x: f.x + tun.dx, y: f.y, z: f.z + tun.dz };
  if (Math.hypot(next.x - owner.location.x, next.z - owner.location.z) > 36) {
    tun.dx = -tun.dx;
    tun.dz = -tun.dz;
    tun.seg = 0;
    tun.stage = "main";
    tun.len = 20;
    return;
  }
  const floor = { x: next.x, y: next.y - 1, z: next.z };
  t.view.forget(floor.x, floor.y, floor.z);
  if (!B.isGround(t.view.id(floor.x, floor.y, floor.z))) {
    const plug = PLUGS.find((pid) => (data.bag[pid] ?? 0) > 0);
    if (plug && t.view.set(floor.x, floor.y, floor.z, plug)) Bag.take(data.bag, plug, 1);
    else {
      t.note = "blocked";
      return;
    }
  }
  const head = { x: next.x, y: next.y + 1, z: next.z };
  t.view.forget(next.x, next.y, next.z);
  t.view.forget(head.x, head.y, head.z);
  const blocking = [head, next].filter((p) => !B.isPassable(t.view.id(p.x, p.y, p.z)));
  if (blocking.length === 0) {
    t.stuck = 0;
    stepTo(t, po, next, "tunnel_moved");
    return;
  }
  if (++t.stuck > 6) {
    t.stuck = 0;
    t.note = "blocked";
    return;
  }
  startDig(t, blocking, "tunnel");
}

/** Branch mining: long tunnel, 3 blocks sideways, long tunnel back. @param {Task} t @param {Player} owner */
function turn(t, owner) {
  const tun = /** @type {NonNullable<Task["tun"]>} */ (t.tun);
  if (tun.stage === "main") {
    tun.stage = "cross";
    tun.len = 3;
    const back = { dx: -tun.dx, dz: -tun.dz };
    tun.dx = tun.px;
    tun.dz = tun.pz;
    tun.px = back.dx; // remember which way the next long tunnel goes
    tun.pz = back.dz;
  } else {
    tun.stage = "main";
    tun.len = 20;
    const side = { dx: tun.dx, dz: tun.dz };
    tun.dx = tun.px;
    tun.dz = tun.pz;
    tun.px = side.dx;
    tun.pz = side.dz;
  }
  tun.seg = 0;
  void owner;
}

/** Start smelting raw ores right away if Po has a furnace and fuel. @param {PoData} data */
function autoSmeltOres(data) {
  if (!data.settings.autoSmelt) return;
  for (const id of Smelt.RAW_ORES) {
    if ((data.bag[id] ?? 0) > 0 && Smelt.ensureFurnace(data.bag)) Smelt.enqueue(data.smelt, data.bag, id, data.bag[id]);
  }
}

// ------------------------------------------------------------------ chest

/** @param {Task} t @param {Entity} po @param {PoData} data @param {Player} owner */
function depositStep(t, po, data, owner) {
  const chest = data.chest;
  if (!chest || chest.dim !== po.dimension.id) {
    poSayText(owner, data, "ยังไม่มีหีบเก็บของเลย มองที่หีบแล้วพิมพ์ \"ตั้งหีบนี้\" ก่อนนะ");
    return finish(t, "silent_done");
  }
  switch (t.phase) {
    case "start": {
      const spots = new Set(spotsNear(t.view.id, chest, 3).map(k));
      if (spots.size === 0) return finish(t, "nochest");
      route(t, po, (p) => spots.has(k(p)), chest, "put", "nochest");
      return;
    }
    case "put": {
      const c = chestContainer(data, po.dimension);
      if (!c) return finish(t, "nochest");
      faceTo(po, center(chest));
      const moved = depositAll(data, c);
      touch(owner.id);
      poSayText(owner, data, moved > 0 ? `เอาของเข้าหีบแล้ว ${moved} ชิ้น!` : "หีบเต็มแล้ว หรือไม่มีอะไรต้องเก็บ");
      return finish(t, "silent_done");
    }
    case "nochest":
      return finish(t, "nochest");
    default:
      t.phase = "start";
  }
}

// ------------------------------------------------------------------ finishing

/**
 * @param {Task} t
 * @param {string} reason
 * @param {Parameters<typeof startTask>[1]} [next]
 */
function finish(t, reason, next) {
  tasks.delete(t.ownerId);
  busy.delete(t.ownerId);
  const owner = playerById(t.ownerId);
  if (!owner) return;
  const data = dataOf(owner);
  const po = getPo(data);
  if (po) {
    try {
      po.triggerEvent(`po:mode_${data.mode}`);
    } catch {}
    setEmote(po, data, data.mode === "stay" ? EMOTE.sit : EMOTE.none);
  }
  touch(owner.id);
  if (reason === "replaced" || reason === "silent") return;
  if (reason === "chain" && next) {
    poSayText(owner, data, "ผมยังไม่มีอีเต้อ ขอไปตัดไม้มาทำก่อนนะ");
    system.runTimeout(() => startTask(owner, next), 5);
    return;
  }
  const say = (/** @type {string} */ s) => poSayText(owner, data, s);
  const what =
    t.kind === "wood"
      ? `ไม้${t.wood ? B.WOODS[/** @type {keyof typeof B.WOODS} */ (t.wood)].th : ""} ${t.got} ท่อน`
      : t.kind === "mine"
        ? `${B.ORES[/** @type {keyof typeof B.ORES} */ (t.ore)].th} ${t.got}`
        : "";
  const bonus = Object.entries(t.bonus)
    .map(([o, n]) => `${B.ORES[/** @type {keyof typeof B.ORES} */ (o)].th} ${n}`)
    .join(", ");
  const extra = bonus ? ` แถมได้${bonus} ด้วย` : "";
  switch (reason) {
    case "done":
      if (!t.internal) say(`เสร็จแล้ว! ได้${what}${extra}`);
      break;
    case "done_partial":
      say(`ต้นไม้แถวนี้หมดแล้ว ได้${what}`);
      break;
    case "notrees": {
      if (t.internal) {
        say("ไม่มีต้นไม้แถวนี้เลย เลยทำอีเต้อไม่ได้ พาผมไปที่มีต้นไม้หน่อยนะ");
        return;
      }
      const w = t.wood ? B.WOODS[/** @type {keyof typeof B.WOODS} */ (t.wood)] : null;
      const seen = data.seen.find((s) => s.key === t.wood && s.dim === po?.dimension.id);
      if (w && seen && po) say(`แถวนี้ไม่มีต้น${w.th} แต่ผมเคยเห็นที่ ${posText(seen)} (ห่างไป ${Math.round(Math.hypot(seen.x - po.location.x, seen.z - po.location.z))} บล็อก) พิมพ์ "นำทางไปต้น${w.th}" ได้นะ`);
      else if (w) say(`แถวนี้ไม่มีต้น${w.th}เลย ต้น${w.th}ขึ้นใน${w.where}`);
      else say("แถวนี้ไม่มีต้นไม้ที่ตัดได้เลย");
      break;
    }
    case "notfound":
      say(`หา${what.replace(/ \d+$/, "")}แถวนี้ไม่เจอเลย${t.got ? ` (ได้มา ${t.got})` : ""}`);
      break;
    case "full":
      say(`กระเป๋าผมเต็มแล้ว! ได้${what}${extra}${data.chest ? " พิมพ์ \"เอาของเข้าหีบ\" ได้นะ" : ""}`);
      break;
    case "long":
      say(`ขุดไปไกลมากแล้ว ได้${what}${extra}${t.noTier ? ` (เจอ${what.replace(/ \d+$/, "")}อีก แต่อีเต้อผมยังขุดไม่ได้)` : ""}`);
      break;
    case "pickbroke":
      say(`อีเต้อพังและวัสดุไม่พอทำใหม่ ได้${what}${extra} ช่วยหาหินหรือไม้ให้หน่อยนะ`);
      break;
    case "far":
      say(`${owner.name} ไปไกลเกินไป ผมหยุดงานแล้วตามไปนะ${t.got ? ` (ได้${what})` : ""}`);
      break;
    case "dimension":
      say("ข้ามมิติแล้ว ขอหยุดงานไว้ก่อนนะ");
      break;
    case "cancel":
      say(`โอเค หยุดแล้ว${t.got ? ` ได้${what}` : ""} ${MODE_TH[data.mode]}ต่อนะ`);
      break;
    case "nochest":
      say("ไปที่หีบไม่ได้ หรือหีบหายไป ลองตั้งหีบใหม่นะ");
      break;
    case "error":
      say("งานมีปัญหานิดหน่อย ขอหยุดก่อนนะ ลองสั่งใหม่ได้");
      break;
  }
  // what Po collected is the owner's: never used for Po's own gear
  if (!t.internal && t.got > 0) {
    if (t.kind === "wood") addKeep(data, `wood:${t.wood ?? "any"}`, t.got);
    else if (t.kind === "mine" && t.ore) addKeep(data, /** @type {string} */ (B.ORES[/** @type {keyof typeof B.ORES} */ (t.ore)].drop[0]), t.got);
  }
  if (data.settings.autoSmelt) autoSmeltOres(data);
  if (t.deliver && t.kind === "wood" && t.got > 0) {
    deliverLogs(owner, data, t);
  }
  // bag full and the home chest is close: go and empty it
  if (reason === "full" && data.chest && po && data.chest.dim === po.dimension.id && Math.hypot(po.location.x - data.chest.x, po.location.z - data.chest.z) < 40) {
    system.runTimeout(() => startTask(owner, { kind: "deposit" }), 20);
  }
  if (t.then && (reason === "done" || reason === "done_partial")) {
    const nextTask = t.then;
    autoGear(owner, data, { quiet: false });
    system.runTimeout(() => startTask(owner, nextTask), 10);
  }
}

/** Give the chopped logs to the owner. @param {Player} owner @param {PoData} data @param {Task} t */
function deliverLogs(owner, data, t) {
  let left = t.count;
  for (const id of Object.keys(data.bag)) {
    const wk = B.woodOfLog(id);
    if (!wk || (t.wood && wk !== t.wood)) continue;
    const got = Bag.take(data.bag, id, Math.min(left, data.bag[id]));
    Bag.giveToPlayer(owner, id, got);
    releaseKeep(data, id, got);
    left -= got;
    if (left <= 0) break;
  }
  poSayText(owner, data, `เอาไม้ไปเลย ${t.count - left} ท่อน!`);
}

