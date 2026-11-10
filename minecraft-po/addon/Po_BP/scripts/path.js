// A* path finding on the block grid. Pure: it only needs a function that
// returns the block id at a position, so it can be tested outside the game.
import { isPassable, isGround } from "./blocks.js";

/** @typedef {{ x: number, y: number, z: number }} P */
/** @typedef {(x: number, y: number, z: number) => string} IdAt */

/** @param {IdAt} id @param {number} x @param {number} y @param {number} z */
export const passable = (id, x, y, z) => isPassable(id(x, y, z));

/** Po can stand with feet in (x,y,z). @param {IdAt} id @param {number} x @param {number} y @param {number} z */
export function standable(id, x, y, z) {
  return isPassable(id(x, y, z)) && isPassable(id(x, y + 1, z)) && isGround(id(x, y - 1, z));
}

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

/** @param {P} p */
const key = (p) => `${p.x},${p.y},${p.z}`;

/**
 * @param {IdAt} id @param {P} n
 * @returns {{ p: P, cost: number }[]}
 */
function neighbours(id, n) {
  /** @type {{ p: P, cost: number }[]} */
  const out = [];
  for (const [dx, dz] of DIRS) {
    const nx = n.x + dx;
    const nz = n.z + dz;
    const diag = dx !== 0 && dz !== 0;
    if (diag) {
      // no corner cutting: both side cells must be open at feet and head
      if (!passable(id, n.x + dx, n.y, n.z) || !passable(id, n.x + dx, n.y + 1, n.z)) continue;
      if (!passable(id, n.x, n.y, n.z + dz) || !passable(id, n.x, n.y + 1, n.z + dz)) continue;
      if (standable(id, nx, n.y, nz)) out.push({ p: { x: nx, y: n.y, z: nz }, cost: 1.414 });
      continue;
    }
    if (standable(id, nx, n.y, nz)) {
      out.push({ p: { x: nx, y: n.y, z: nz }, cost: 1 });
      continue;
    }
    // step up one block (needs head room above where we stand)
    if (passable(id, n.x, n.y + 2, n.z) && standable(id, nx, n.y + 1, nz)) {
      out.push({ p: { x: nx, y: n.y + 1, z: nz }, cost: 1.6 });
      continue;
    }
    // drop down up to 3 blocks
    if (passable(id, nx, n.y, nz) && passable(id, nx, n.y + 1, nz)) {
      for (let d = 1; d <= 3; d++) {
        if (standable(id, nx, n.y - d, nz)) {
          out.push({ p: { x: nx, y: n.y - d, z: nz }, cost: 1 + d * 0.3 });
          break;
        }
        if (!passable(id, nx, n.y - d, nz)) break;
      }
    }
  }
  return out;
}

/** Small binary heap keyed by f. */
class Heap {
  constructor() {
    /** @type {{ f: number, k: string }[]} */
    this.a = [];
  }
  get size() {
    return this.a.length;
  }
  /** @param {{ f: number, k: string }} v */
  push(v) {
    const a = this.a;
    a.push(v);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p].f <= a[i].f) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = /** @type {{ f: number, k: string }} */ (a.pop());
    if (a.length > 0) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && a[l].f < a[m].f) m = l;
        if (r < a.length && a[r].f < a[m].f) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

/**
 * A* as a generator so the game can spread the work over several ticks.
 * The final `return` value is the path (start excluded, goal included) or null.
 * @param {IdAt} id
 * @param {P} start feet block of Po
 * @param {(p: P) => boolean} isGoal
 * @param {P} hint a point near the goal for the heuristic
 * @param {{ maxNodes?: number, maxRange?: number, perYield?: number }} [opts]
 * @returns {Generator<void, P[] | null, void>}
 */
export function* pathJob(id, start, isGoal, hint, opts = {}) {
  const maxNodes = opts.maxNodes ?? 2500;
  const maxRange = opts.maxRange ?? 48;
  const perYield = opts.perYield ?? 150;
  const h = (/** @type {P} */ p) => {
    const dx = Math.abs(p.x - hint.x);
    const dz = Math.abs(p.z - hint.z);
    return Math.max(dx, dz) + 0.414 * Math.min(dx, dz) + Math.abs(p.y - hint.y) * 0.5;
  };
  /** @type {Map<string, { p: P, g: number, from: string | null }>} */
  const seen = new Map();
  const open = new Heap();
  const sk = key(start);
  seen.set(sk, { p: start, g: 0, from: null });
  open.push({ f: h(start), k: sk });
  /** @type {Set<string>} */
  const closed = new Set();
  let expanded = 0;
  while (open.size > 0) {
    const { k } = open.pop();
    if (closed.has(k)) continue;
    closed.add(k);
    const node = /** @type {{ p: P, g: number, from: string | null }} */ (seen.get(k));
    if (isGoal(node.p)) {
      /** @type {P[]} */
      const path = [];
      let cur = /** @type {string | null} */ (k);
      while (cur && cur !== sk) {
        const n = /** @type {{ p: P, g: number, from: string | null }} */ (seen.get(cur));
        path.push(n.p);
        cur = n.from;
      }
      return path.reverse();
    }
    if (++expanded > maxNodes) return null;
    if (expanded % perYield === 0) yield;
    for (const { p, cost } of neighbours(id, node.p)) {
      if (Math.abs(p.x - start.x) > maxRange || Math.abs(p.z - start.z) > maxRange) continue;
      const pk = key(p);
      if (closed.has(pk)) continue;
      const g = node.g + cost;
      const prev = seen.get(pk);
      if (prev && prev.g <= g) continue;
      seen.set(pk, { p, g, from: k });
      open.push({ f: g + h(p) * 1.05, k: pk });
    }
  }
  return null;
}

/** Run a path job to the end right away (for tests and short searches). @param {Generator<void, P[] | null, void>} job */
export function runNow(job) {
  for (;;) {
    const r = job.next();
    if (r.done) return r.value;
  }
}

/**
 * Standable spots within `reach` blocks of a target block, nearest to `from` first.
 * @param {IdAt} id @param {P} target @param {number} reach
 */
export function spotsNear(id, target, reach) {
  /** @type {P[]} */
  const out = [];
  const r = Math.ceil(reach);
  for (let dx = -r; dx <= r; dx++)
    for (let dz = -r; dz <= r; dz++)
      for (let dy = -3; dy <= 1; dy++) {
        if (dx === 0 && dz === 0 && dy >= -1) continue;
        const p = { x: target.x + dx, y: target.y + dy, z: target.z + dz };
        const eye = { x: p.x, y: p.y + 1.6, z: p.z };
        const d = Math.hypot(eye.x - target.x, eye.y - (target.y + 0.5), eye.z - target.z);
        if (d <= reach && standable(id, p.x, p.y, p.z)) out.push(p);
      }
  return out;
}
