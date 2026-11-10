// Reading and changing blocks in the real world, with a small cache so path
// finding does not ask the game for the same block twice.
import { BlockPermutation } from "@minecraft/server";

/** @typedef {{ x: number, y: number, z: number }} P */

/**
 * @param {import("@minecraft/server").Dimension} dim
 */
export function makeView(dim) {
  /** @type {Map<string, string>} */
  const cache = new Map();
  const range = dim.heightRange;
  const view = {
    dim,
    /** @param {number} x @param {number} y @param {number} z */
    id(x, y, z) {
      if (y < range.min || y >= range.max) return "minecraft:unknown";
      const k = `${x},${y},${z}`;
      const hit = cache.get(k);
      if (hit !== undefined) return hit;
      let id = "minecraft:unknown";
      try {
        const b = dim.getBlock({ x, y, z });
        if (b) id = b.typeId;
      } catch {}
      cache.set(k, id);
      return id;
    },
    /** @param {number} x @param {number} y @param {number} z */
    block(x, y, z) {
      try {
        return dim.getBlock({ x, y, z });
      } catch {
        return undefined;
      }
    },
    /** @param {number} x @param {number} y @param {number} z @param {string} id */
    set(x, y, z, id) {
      const b = view.block(x, y, z);
      if (!b) return false;
      try {
        b.setType(id);
        cache.set(`${x},${y},${z}`, id);
        return true;
      } catch {
        return false;
      }
    },
    /** Leaves placed by players have persistent_bit = true. @param {number} x @param {number} y @param {number} z */
    naturalLeaves(x, y, z) {
      const b = view.block(x, y, z);
      if (!b) return false;
      try {
        return b.permutation.getState("persistent_bit") !== true;
      } catch {
        return true;
      }
    },
    /** @param {number} x @param {number} y @param {number} z */
    forget(x, y, z) {
      cache.delete(`${x},${y},${z}`);
    },
    clear() {
      cache.clear();
    },
    /** Highest non-air block of a column. @param {number} x @param {number} z */
    top(x, z) {
      try {
        const b = dim.getTopmostBlock({ x, z });
        return b ? { id: b.typeId, y: b.location.y } : undefined;
      } catch {
        return undefined;
      }
    },
    /** Place a sapling/torch etc. with its default state. @param {number} x @param {number} y @param {number} z @param {string} id */
    place(x, y, z, id) {
      const b = view.block(x, y, z);
      if (!b) return false;
      try {
        b.setPermutation(BlockPermutation.resolve(id));
        cache.set(`${x},${y},${z}`, id);
        return true;
      } catch {
        return false;
      }
    },
    /** @param {string} sound @param {P} at */
    sound(sound, at) {
      try {
        dim.playSound(sound, at);
      } catch {}
    },
  };
  return view;
}

/** @typedef {ReturnType<typeof makeView>} View */
