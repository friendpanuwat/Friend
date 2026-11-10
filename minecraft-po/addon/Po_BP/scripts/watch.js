// Po notices what happens around the owner and reacts on his own.
import { world, system } from "@minecraft/server";
import { PO_TYPE, isNight, relativeDir, hearts, dist, posText, playerById } from "./util.js";
import { dataOf, loadById, touch, remember, rememberFind } from "./store.js";
import { getPo, poSay, poSayText, onPoDied, lastHurt, setEmote, EMOTE, faceTo, bring } from "./po.js";
import { mobTh } from "./names.js";
import { ready } from "./speech.js";
import * as G from "./gear.js";
import { replaceBroken, syncCombat } from "./equip.js";
import { busy } from "./po.js";

/** @typedef {import("@minecraft/server").Player} Player */
/** @typedef {import("./store.js").PoData} PoData */

/** Families that are not worth warning about (neutral or harmless). */
const QUIET = new Set(["minecraft:enderman", "minecraft:zombie_pigman", "minecraft:piglin", "minecraft:spider"]);

/** @type {Map<string, { id: string, until: number }>} owner id -> last mob that hurt them */
const ownerAttacker = new Map();
/** @type {Map<string, boolean>} owner id -> was night at last check */
const wasNight = new Map();
/** @type {Map<string, number>} owner id -> next idle chat time */
const nextIdle = new Map();

/** Talk level: 0 quiet, 1 normal, 2 chatty. @param {PoData} data */
const chatty = (data) => data.settings.talk;

export function subscribe() {
  world.afterEvents.entityHurt.subscribe((ev) => {
    const hurt = ev.hurtEntity;
    const src = ev.damageSource.damagingEntity;
    if (hurt.typeId === PO_TYPE) {
      lastHurt.set(hurt.id, Date.now());
      const ownerId = hurt.getDynamicProperty("po:owner");
      if (typeof ownerId !== "string") return;
      const owner = playerById(ownerId);
      const data = loadById(ownerId);
      if (data && ev.damage > 0 && G.wearArmor(data.gear)) {
        touch(ownerId);
        if (owner) poSayText(owner, data, "ชุดเกราะของผมพังแล้ว!");
      }
      const hp = hurt.getComponent("minecraft:health");
      if (owner && data && hp && hp.currentValue > 0 && hp.currentValue < 12 && ready(`polow:${ownerId}`, 30)) {
        poSay(owner, data, "po_low_hp");
        setEmote(hurt, data, EMOTE.scared, 40);
      }
      return;
    }
    if (hurt.typeId !== "minecraft:player" || !src || src.typeId === "minecraft:player" || src.typeId === PO_TYPE) return;
    const player = /** @type {Player} */ (hurt);
    const data = dataOf(player);
    if (!getPo(data)) return;
    ownerAttacker.set(player.id, { id: src.id, until: Date.now() + 15_000 });
    if (chatty(data) >= 1 && ready(`hurt:${player.id}`, 25)) poSay(player, data, "owner_hurt", { mob: mobTh(src.typeId) });
  });

  world.afterEvents.entityHitEntity.subscribe((ev) => {
    if (ev.damagingEntity.typeId === PO_TYPE) {
      const ownerId = ev.damagingEntity.getDynamicProperty("po:owner");
      const data = typeof ownerId === "string" ? loadById(ownerId) : undefined;
      const owner = typeof ownerId === "string" ? playerById(ownerId) : undefined;
      if (data && data.gear.sword && G.wear(data.gear, "sword")) {
        touch(/** @type {string} */ (ownerId));
        if (owner) {
          replaceBroken(owner, data, "sword");
          syncCombat(owner, data);
        }
      }
      return;
    }
    if (ev.hitEntity.typeId !== PO_TYPE || ev.damagingEntity.typeId !== "minecraft:player") return;
    const player = /** @type {Player} */ (ev.damagingEntity);
    const ownerId = ev.hitEntity.getDynamicProperty("po:owner");
    if (ownerId !== player.id) return;
    const data = dataOf(player);
    if (ready(`hit:${player.id}`, 10)) poSay(player, data, "po_hit_by_owner");
  });

  world.afterEvents.entityDie.subscribe((ev) => {
    const dead = ev.deadEntity;
    if (dead.typeId === PO_TYPE) {
      onPoDied(dead);
      return;
    }
    // owner died
    if (dead.typeId === "minecraft:player") {
      const player = /** @type {Player} */ (dead);
      const data = dataOf(player);
      if (!data.met) return;
      try {
        data.deathSpot = { x: dead.location.x, y: dead.location.y, z: dead.location.z, dim: dead.dimension.id, day: world.getDay() };
      } catch {}
      data.stats.ownerDeaths++;
      remember(data, `${player.name} ตายที่ ${data.deathSpot ? posText(data.deathSpot) : "?"}`);
      touch(player.id);
      if (getPo(data)) poSay(player, data, "owner_died");
      return;
    }
    // Po killed something
    const killer = ev.damageSource.damagingEntity;
    if (!killer || killer.typeId !== PO_TYPE) return;
    const ownerId = killer.getDynamicProperty("po:owner");
    if (typeof ownerId !== "string") return;
    const data = loadById(ownerId);
    const owner = playerById(ownerId);
    if (!data) return;
    data.stats.kills++;
    touch(ownerId);
    if (!owner) return;
    const att = ownerAttacker.get(ownerId);
    if (att && att.id === dead.id && Date.now() < att.until) {
      data.stats.saves++;
      ownerAttacker.delete(ownerId);
      if (ready(`save:${ownerId}`, 30)) {
        poSay(owner, data, "po_save");
        setEmote(killer, data, EMOTE.cheer, 40);
        return;
      }
    }
    if (chatty(data) >= 1 && ready(`kill:${ownerId}`, 12)) poSay(owner, data, "po_kill", { mob: mobTh(dead.typeId) });
  });

  world.afterEvents.playerDimensionChange.subscribe((ev) => {
    const player = ev.player;
    const data = dataOf(player);
    const po = getPo(data);
    if (!po || data.mode === "stay") return;
    // take Po along right away, while his old area is still loaded
    system.runTimeout(() => {
      if (bring(player, data)) {
        const key = ev.toDimension.id === "minecraft:nether" ? "nether" : ev.toDimension.id === "minecraft:the_end" ? "end" : "overworld";
        if (ready(`dim:${player.id}:${key}`, 300)) poSay(player, data, key);
      }
    }, 20);
  });

  world.afterEvents.weatherChange.subscribe((ev) => {
    if (!String(ev.dimension).includes("overworld")) return;
    const key = ev.newWeather === "Thunder" ? "thunder" : ev.newWeather === "Rain" ? "rain" : "clear";
    for (const player of world.getPlayers()) {
      const data = dataOf(player);
      if (!getPo(data) || chatty(data) < 1 || player.dimension.id !== "minecraft:overworld") continue;
      if (ready(`weather:${player.id}`, 180)) poSay(player, data, key);
    }
  });

  world.afterEvents.playerBreakBlock.subscribe((ev) => {
    const id = ev.brokenBlockPermutation.type.id;
    const what =
      id === "minecraft:diamond_ore" || id === "minecraft:deepslate_diamond_ore"
        ? "diamond"
        : id === "minecraft:ancient_debris"
          ? "debris"
          : id === "minecraft:emerald_ore" || id === "minecraft:deepslate_emerald_ore"
            ? "emerald"
            : null;
    if (!what) return;
    const player = ev.player;
    const data = dataOf(player);
    if (!getPo(data)) return;
    const spot = { x: ev.block.location.x, y: ev.block.location.y, z: ev.block.location.z, dim: ev.dimension.id };
    const label = what === "diamond" ? "เพชร" : what === "debris" ? "Ancient Debris" : "มรกต";
    if (ready(`find:${player.id}:${what}`, 60)) {
      rememberFind(data, label, spot);
      remember(data, `${player.name} เจอ${label}ที่ ${posText(spot)}`);
      if (what === "diamond") data.stats.diamonds++;
      touch(player.id);
      poSay(player, data, what);
      const po = getPo(data);
      if (po) setEmote(po, data, EMOTE.cheer, 50);
    }
  });
}

/** Every second: time of day, danger, the owner's health, idle chat. */
export function periodic() {
  for (const player of world.getPlayers()) {
    const data = dataOf(player);
    const po = getPo(data);
    if (!po) continue;
    const talk = chatty(data);

    // remember home (bed)
    try {
      const sp = player.getSpawnPoint();
      if (sp) {
        const h = data.home;
        if (!h || h.dim !== sp.dimension.id || Math.abs(h.x - sp.x) > 1 || Math.abs(h.z - sp.z) > 1 || Math.abs(h.y - sp.y) > 2) {
          data.home = { x: sp.x, y: sp.y, z: sp.z, dim: sp.dimension.id };
          remember(data, `จำบ้าน ${player.name} ไว้ที่ ${posText(sp)}`);
          touch(player.id);
          if (h && talk >= 1) poSayText(player, data, "ย้ายบ้านใหม่เหรอ! ผมจำที่ใหม่ไว้แล้วนะ");
        }
      }
    } catch {}

    // night and morning
    if (player.dimension.id === "minecraft:overworld") {
      const night = isNight();
      const before = wasNight.get(player.id);
      wasNight.set(player.id, night);
      if (before !== undefined && before !== night && talk >= 1) {
        if (night && ready(`night:${player.id}`, 300)) poSay(player, data, "night");
        if (!night && ready(`morning:${player.id}`, 300)) poSay(player, data, "morning");
      }
    }

    // creeper close by: always warn, with direction
    try {
      const creepers = player.dimension.getEntities({ type: "minecraft:creeper", location: player.location, maxDistance: 9 });
      if (creepers.length > 0 && ready(`creeper:${player.id}`, 12)) {
        const c = creepers.sort((a, b) => dist(a.location, player.location) - dist(b.location, player.location))[0];
        poSay(player, data, "creeper", { dir: relativeDir(player, c.location) });
        faceTo(po, c.location);
        setEmote(po, data, EMOTE.point, 40);
      }
      if (creepers.length > 0 && data.mode !== "stay" && !busy.has(player.id)) shootAt(po, player, data, creepers[0]);
    } catch {}

    // a group of monsters
    if (talk >= 1) {
      try {
        const mobs = player.dimension
          .getEntities({ location: player.location, maxDistance: 14, families: ["monster"] })
          .filter((m) => !QUIET.has(m.typeId) && m.typeId !== "minecraft:creeper");
        if (mobs.length >= (isNight() ? 2 : 3) && ready(`danger:${player.id}`, 60)) {
          /** @type {Record<string, number>} */
          const counts = {};
          for (const m of mobs) counts[m.typeId] = (counts[m.typeId] ?? 0) + 1;
          const text = Object.entries(counts)
            .map(([id, n]) => `${mobTh(id)} ${n} ตัว`)
            .join(" ");
          poSay(player, data, "danger", { mobs: text });
        }
      } catch {}
    }

    // owner low on health
    const hp = player.getComponent("minecraft:health");
    if (hp && hp.currentValue > 0 && hp.currentValue <= 6 && ready(`low:${player.id}`, 45)) {
      poSay(player, data, "owner_low_hp", { hearts: hearts(hp.currentValue) });
    }

    if (talk < 1) continue;

    // deep underground
    if (player.dimension.id === "minecraft:overworld" && player.location.y < 0 && ready(`deep:${player.id}`, 600)) {
      poSay(player, data, "deep");
    }

    // owner went to sleep
    if (player.isSleeping && ready(`sleep:${player.id}`, 600)) {
      poSay(player, data, "sleep");
      setEmote(po, data, EMOTE.sleep, 200);
    }

    // idle chatter
    const every = talk >= 2 ? 180_000 : 360_000;
    const next = nextIdle.get(player.id);
    if (next === undefined) nextIdle.set(player.id, Date.now() + every);
    else if (Date.now() >= next) {
      nextIdle.set(player.id, Date.now() + every * (0.7 + Math.random() * 0.6));
      poSay(player, data, "idle");
    }
  }
}

/**
 * Player joined or respawned.
 * @param {Player} player @param {boolean} initial
 */
export function onSpawn(player, initial) {
  const data = dataOf(player);
  if (initial) {
    system.runTimeout(() => {
      if (!player.isValid) return;
      if (getPo(data) && data.settings.talk >= 1) poSay(player, data, "greet_join");
    }, 80);
    return;
  }
  // respawned after dying: tell where the items are
  const d = data.deathSpot;
  if (!d || (!getPo(data) && !data.poId)) return;
  system.runTimeout(() => {
    if (!player.isValid || d.dim !== player.dimension.id) return;
    poSay(player, data, "owner_respawn", {
      dir: relativeDir(player, d),
      dist: Math.round(dist(player.location, d)),
      pos: posText(d),
    });
  }, 60);
}


/**
 * Po shoots an arrow at a creeper (needs a bow and arrows).
 * @param {import("@minecraft/server").Entity} po @param {Player} owner @param {PoData} data
 * @param {import("@minecraft/server").Entity} target
 */
function shootAt(po, owner, data, target) {
  if (!data.gear.bow || (data.bag["minecraft:arrow"] ?? 0) <= 0) return;
  if (!ready(`bow:${po.id}`, 1.5)) return;
  const from = { x: po.location.x, y: po.location.y + 1.5, z: po.location.z };
  const to = { x: target.location.x, y: target.location.y + 0.9, z: target.location.z };
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const d = Math.hypot(dx, dz);
  if (d > 16 || d < 2) return;
  const dy = to.y - from.y + d * 0.04; // aim a little high for the drop
  const len = Math.hypot(dx, dy, dz);
  const speed = 2.4;
  const start = { x: from.x + (dx / len) * 0.8, y: from.y + (dy / len) * 0.8, z: from.z + (dz / len) * 0.8 };
  try {
    const arrow = po.dimension.spawnEntity("minecraft:arrow", start);
    const proj = arrow.getComponent("minecraft:projectile");
    if (!proj) {
      arrow.remove();
      return;
    }
    proj.owner = po;
    proj.shoot({ x: (dx / len) * speed, y: (dy / len) * speed, z: (dz / len) * speed });
  } catch {
    return;
  }
  faceTo(po, to);
  setEmote(po, data, EMOTE.point, 20);
  try {
    po.dimension.playSound("random.bow", po.location);
  } catch {}
  data.bag["minecraft:arrow"] -= 1;
  if (data.bag["minecraft:arrow"] <= 0) delete data.bag["minecraft:arrow"];
  if (G.wear(data.gear, "bow")) replaceBroken(owner, data, "bow");
  touch(owner.id);
  if (ready(`bowsay:${owner.id}`, 30)) poSayText(owner, data, "ยิงครีปเปอร์! อย่าเข้าใกล้มันนะ");
}
