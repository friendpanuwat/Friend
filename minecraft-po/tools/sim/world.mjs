import * as MC from "@minecraft/server";
export function hash(x, y, z) {
  let h = (x * 374761393 + y * 668265263 + z * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
export const TREES = [
  { x: 6, z: 3, log: "minecraft:oak_log", leaves: "minecraft:oak_leaves", h: 5 },
  { x: -8, z: 10, log: "minecraft:birch_log", leaves: "minecraft:birch_leaves", h: 6 },
  { x: 12, z: -9, log: "minecraft:oak_log", leaves: "minecraft:oak_leaves", h: 5 },
  { x: -5, z: -12, log: "minecraft:birch_log", leaves: "minecraft:birch_leaves", h: 5 },
];
export function terrain(x, y, z) {
  if (y < -60) return "minecraft:bedrock";
  if (y >= 65) {
    for (const t of TREES) {
      const dy = y - 65;
      if (x === t.x && z === t.z && dy < t.h) return t.log;
      const r = dy >= t.h ? 1 : 2;
      if (dy >= t.h - 2 && dy <= t.h && Math.abs(x - t.x) <= r && Math.abs(z - t.z) <= r && !(x === t.x && z === t.z && dy < t.h)) return t.leaves;
    }
    return "minecraft:air";
  }
  if (y === 64) return "minecraft:grass_block";
  if (y >= 60) return "minecraft:dirt";
  const r = hash(x, y, z);
  const deep = y < 0;
  if (y >= -10 && y <= 56 && r < 0.012) return deep ? "minecraft:deepslate_iron_ore" : "minecraft:iron_ore";
  if (y >= 0 && y <= 60 && r >= 0.012 && r < 0.03) return "minecraft:coal_ore";
  if (y < -40 && r >= 0.03 && r < 0.036) return "minecraft:deepslate_diamond_ore";
  if (y <= -50 && r >= 0.04 && r < 0.043) return "minecraft:lava";
  return deep ? "minecraft:deepslate" : "minecraft:stone";
}
MC.setGenerator(terrain);
