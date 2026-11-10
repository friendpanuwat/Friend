// Small helpers shared by every Po script.
import { world } from "@minecraft/server";

export const PO_TYPE = "po:friend";
export const WHISTLE = "po:whistle";
export const PO_NAME_DEFAULT = "Po";

/** @param {import("@minecraft/server").Vector3} a @param {import("@minecraft/server").Vector3} b */
export function dist(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** @template T @param {T[]} arr @returns {T} */
export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Fill {key} placeholders. @param {string} text @param {Record<string, string|number>} vars */
export function fill(text, vars) {
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** @param {import("@minecraft/server").Vector3} v */
export function posText(v) {
  return `${Math.floor(v.x)}, ${Math.floor(v.y)}, ${Math.floor(v.z)}`;
}

/** @param {import("@minecraft/server").Vector3} v */
export function plainPos(v) {
  return { x: Math.floor(v.x) + 0.5, y: Math.floor(v.y), z: Math.floor(v.z) + 0.5 };
}

export const DIM_THAI = {
  "minecraft:overworld": "โลกปกติ",
  "minecraft:nether": "Nether",
  "minecraft:the_end": "The End",
};

/** @param {string} id */
export function dimThai(id) {
  return /** @type {Record<string,string>} */ (DIM_THAI)[id] ?? id;
}

/** Hearts shown in game: 2 HP = 1 heart. @param {number} hp */
export function hearts(hp) {
  return Math.max(0, Math.ceil(hp / 2));
}

/**
 * Direction of `target` as seen by `player`: in front / left / right / behind,
 * so it works without knowing north on a phone.
 * @param {import("@minecraft/server").Player} player
 * @param {import("@minecraft/server").Vector3} target
 */
export function relativeDir(player, target) {
  const dx = target.x - player.location.x;
  const dz = target.z - player.location.z;
  if (Math.abs(dx) < 1.5 && Math.abs(dz) < 1.5) return "ตรงนี้เลย";
  // Minecraft yaw: 0 = south (+z), 90 = west (-x). Increasing yaw turns right.
  const targetYaw = (Math.atan2(-dx, dz) * 180) / Math.PI;
  let diff = targetYaw - player.getRotation().y;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  if (Math.abs(diff) <= 35) return "ข้างหน้า";
  if (Math.abs(diff) >= 145) return "ข้างหลัง";
  if (diff > 0) return Math.abs(diff) < 90 ? "ข้างหน้าทางขวา" : "ทางขวา";
  return Math.abs(diff) < 90 ? "ข้างหน้าทางซ้าย" : "ทางซ้าย";
}

/** Compass direction in Thai. */
export function compassThai(from, to) {
  const dx = to.x - from.x;
  const dz = to.z - from.z;
  const deg = ((Math.atan2(dx, -dz) * 180) / Math.PI + 360) % 360; // 0 = north
  const names = [
    "ทิศเหนือ",
    "ทิศตะวันออกเฉียงเหนือ",
    "ทิศตะวันออก",
    "ทิศตะวันออกเฉียงใต้",
    "ทิศใต้",
    "ทิศตะวันตกเฉียงใต้",
    "ทิศตะวันตก",
    "ทิศตะวันตกเฉียงเหนือ",
  ];
  return names[Math.round(deg / 45) % 8];
}

/** In-game clock as HH:MM. */
export function clockText() {
  const t = world.getTimeOfDay();
  const hour = (Math.floor(t / 1000) + 6) % 24;
  const minute = Math.floor(((t % 1000) * 60) / 1000);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function isNight() {
  const t = world.getTimeOfDay();
  return t >= 12800 && t < 23200;
}

/** Online player by entity id. @param {string} id */
export function playerById(id) {
  return world.getPlayers().find((p) => p.id === id);
}
