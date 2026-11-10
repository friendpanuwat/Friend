// Po managing his own equipment: upgrade when he can, replace broken tools,
// ask before using rare materials, and apply sword/armour to his body.
import { system } from "@minecraft/server";
import * as G from "./gear.js";
import { possibleUpgrades, craftForPo, upgradeName, plan, RECIPES } from "./craft.js";
import { getPo, poSayText } from "./po.js";
import { touch, keepMatcher } from "./store.js";
import { ready } from "./speech.js";

/** @typedef {import("./store.js").PoData} PoData */
/** @typedef {import("@minecraft/server").Player} Player */

/** Set by tasks.js: what the running job must not spend. */
export const reserveHook = { get: (/** @type {string} */ ownerId) => /** @type {{ match: (id: string) => boolean, n: number } | undefined} */ (void ownerId, undefined) };

/** Pending questions "may I use the diamonds?" per owner. @type {Map<string, { key: string, name: string, until: number }>} */
const asks = new Map();
/** Last damage level sent to each Po. @type {Map<string, number>} */
const sentDamage = new Map();

/**
 * Craft every non-rare upgrade Po can afford; ask about rare ones.
 * @param {Player} owner @param {PoData} data
 * @param {{ quiet?: boolean, needShovel?: boolean, reserve?: { match: (id: string) => boolean, n: number } }} [opts]
 *   reserve: items Po must not use (what the owner asked him to collect)
 * @returns {string[]} names of what was made
 */
export function autoGear(owner, data, opts = {}) {
  /** @type {string[]} */
  const made = [];
  // work on a copy without the reserved items, then put them back
  const work = { ...data.bag };
  /** @type {Record<string, number>} */
  const held = {};
  const reserves = data.keep.map((e) => ({ match: keepMatcher(e.m), n: e.n }));
  if (opts.reserve) reserves.push(opts.reserve);
  else {
    const running = reserveHook.get(owner.id);
    if (running) reserves.push(running);
  }
  for (const r of reserves) {
    let left = r.n;
    for (const id of Object.keys(work).sort((a, b) => work[b] - work[a])) {
      if (left <= 0) break;
      if (!r.match(id)) continue;
      const take = Math.min(left, work[id]);
      held[id] = (held[id] ?? 0) + take;
      work[id] -= take;
      if (work[id] <= 0) delete work[id];
      left -= take;
    }
  }
  for (let i = 0; i < 6; i++) {
    const ups = possibleUpgrades(work, data.gear, { allowRare: data.settings.rareOk, needShovel: opts.needShovel });
    const pickNow = ups.find((u) => !u.rare || data.settings.rareOk);
    if (!pickNow) {
      const rare = ups.find((u) => u.rare);
      if (rare) askRare(owner, data, rare.key, upgradeName(rare));
      break;
    }
    if (!craftForPo(work, data.gear, pickNow.key)) break;
    made.push(upgradeName(pickNow));
  }
  if (made.length) {
    for (const [id, n] of Object.entries(held)) work[id] = (work[id] ?? 0) + n;
    Object.keys(data.bag).forEach((id) => delete data.bag[id]);
    Object.assign(data.bag, work);
  }
  if (made.length) {
    touch(owner.id);
    syncCombat(owner, data);
    if (!opts.quiet) poSayText(owner, data, `คราฟต์${made.join(", ")}ใส่เองแล้ว!`);
    const po = getPo(data);
    if (po) {
      try {
        po.dimension.playSound("random.anvil_use", po.location, { volume: 0.5 });
      } catch {}
    }
  }
  return made;
}

/**
 * @param {Player} owner @param {PoData} data @param {string} key @param {string} name
 */
function askRare(owner, data, key, name) {
  const cur = asks.get(owner.id);
  if (cur && cur.key === key && Date.now() < cur.until) return;
  if (!ready(`ask:${owner.id}:${key}`, 600)) return;
  asks.set(owner.id, { key, name, until: Date.now() + 120_000 });
  const mat = key.startsWith("diamond") ? "เพชร" : key.startsWith("gold") ? "ทอง" : key.startsWith("iron") ? "เหล็ก" : "วัสดุ";
  poSayText(owner, data, `ผมมี${mat}พอทำ${name}แล้ว ขอใช้ได้ไหม? (ตอบ "ได้" หรือ "ไม่")`);
}

/** @param {string} ownerId */
export function pendingAsk(ownerId) {
  const a = asks.get(ownerId);
  if (!a || Date.now() > a.until) return undefined;
  return a;
}

/** Owner answered yes/no. @param {Player} owner @param {PoData} data @param {boolean} yes */
export function answerAsk(owner, data, yes) {
  const a = pendingAsk(owner.id);
  asks.delete(owner.id);
  if (!a) return false;
  if (!yes) {
    poSayText(owner, data, "โอเค ผมเก็บไว้ให้ ไม่แตะเลย");
    return true;
  }
  if (craftForPo(data.bag, data.gear, a.key)) {
    touch(owner.id);
    syncCombat(owner, data);
    poSayText(owner, data, `ขอบใจนะ! ได้${a.name}แล้ว เท่สุดๆ`);
  } else {
    poSayText(owner, data, "เอ๊ะ วัสดุไม่พอแล้ว สงสัยใช้ไปทำอย่างอื่น");
  }
  return true;
}

/**
 * Replace a broken tool right away if possible.
 * @param {Player} owner @param {PoData} data @param {G.ToolKind | "bow"} kind
 * @returns {boolean} true if Po has that tool again
 */
export function replaceBroken(owner, data, kind) {
  poSayText(owner, data, `${G.KIND_TH[kind]}ของผมพังแล้ว!`);
  if (kind === "bow") {
    const p = plan(data.bag, "bow");
    if (p.ok) {
      Object.keys(data.bag).forEach((k) => delete data.bag[k]);
      Object.assign(data.bag, p.bag);
      data.bag["minecraft:bow"] -= 1;
      if (data.bag["minecraft:bow"] <= 0) delete data.bag["minecraft:bow"];
      data.gear.bow = { dur: G.BOW_DUR };
      poSayText(owner, data, "ทำธนูอันใหม่แล้ว");
      return true;
    }
    return false;
  }
  for (const tier of ["iron", "stone", "wood"]) {
    const key = `${tier}_${kind}`;
    if (!RECIPES[key]) continue;
    if (craftForPo(data.bag, data.gear, key)) {
      touch(owner.id);
      syncCombat(owner, data);
      poSayText(owner, data, `ทำ${G.KIND_TH[kind]}${G.TIER_TH[/** @type {G.Tier} */ (tier)]}อันใหม่แล้ว ลุยต่อ!`);
      return true;
    }
  }
  return false;
}

/**
 * Put Po's sword damage and armour protection on his body.
 * @param {Player} owner @param {PoData} data
 */
export function syncCombat(owner, data) {
  const po = getPo(data);
  if (!po) return;
  const dmg = G.damageOf(data.gear);
  if (sentDamage.get(po.id) !== dmg) {
    try {
      po.triggerEvent(`po:dmg_${dmg}`);
      sentDamage.set(po.id, dmg);
    } catch {}
  }
  if (data.gear.armor) {
    try {
      po.addEffect("resistance", 30 * 20, { amplifier: G.ARMOR_RESIST[data.gear.armor.tier], showParticles: false });
    } catch {}
  }
}

/** Refresh armour effects every 20 s for everyone. */
export function startArmorRefresh(/** @type {() => { owner: Player, data: PoData }[]} */ list) {
  system.runInterval(() => {
    for (const { owner, data } of list()) syncCombat(owner, data);
  }, 400);
}

/**
 * Equip a tool or bow the player hands over (instead of storing it).
 * @param {Player} owner @param {PoData} data @param {import("@minecraft/server").ItemStack} item
 * @returns {"equipped" | "worse" | "enchanted" | "not_tool"}
 */
export function equipGiven(owner, data, item) {
  const parsed = G.parseToolId(item.typeId);
  if (!parsed) return "not_tool";
  try {
    const ench = item.getComponent("minecraft:enchantable");
    if (ench && ench.getEnchantments().length > 0) return "enchanted";
  } catch {}
  let dur;
  try {
    const d = item.getComponent("minecraft:durability");
    if (d) dur = d.maxDurability - d.damage;
  } catch {}
  if (parsed.kind === "bow") {
    if (data.gear.bow && data.gear.bow.dur >= (dur ?? G.BOW_DUR)) return "worse";
    data.gear.bow = { dur: dur ?? G.BOW_DUR };
  } else {
    const tier = /** @type {G.Tier} */ (parsed.tier);
    const cur = data.gear[parsed.kind];
    if (cur && G.RANK[cur.tier] >= G.RANK[tier] && cur.dur >= (dur ?? 0)) return "worse";
    data.gear[parsed.kind] = { tier, dur: dur ?? G.MAX_DUR[tier] };
  }
  touch(owner.id);
  syncCombat(owner, data);
  return "equipped";
}
