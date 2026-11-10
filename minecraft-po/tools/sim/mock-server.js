// A small fake of the Minecraft Script API: a voxel world, one player, entities, a tick scheduler.
export const log = [];
const blocks = new Map(); // "x,y,z" -> id (overrides the generator)
const states = new Map(); // "x,y,z" -> {persistent_bit}
export let gen = () => "minecraft:air";
export function setGenerator(fn) { gen = fn; }
export const key = (x, y, z) => `${x},${y},${z}`;
export function idAt(x, y, z) { const k = key(x, y, z); return blocks.has(k) ? blocks.get(k) : gen(x, y, z); }
export function setId(x, y, z, id) { blocks.set(key(x, y, z), id); }
export function setState(x, y, z, s) { states.set(key(x, y, z), s); }
export const changes = [];

class Block {
  constructor(dim, x, y, z) { this.dimension = dim; this.location = { x, y, z }; this.x = x; this.y = y; this.z = z; }
  get typeId() { return idAt(this.x, this.y, this.z); }
  get isAir() { return this.typeId === "minecraft:air"; }
  get isLiquid() { return /water|lava/.test(this.typeId); }
  setType(id) { changes.push([this.x, this.y, this.z, idAt(this.x, this.y, this.z), id]); setId(this.x, this.y, this.z, id); states.delete(key(this.x, this.y, this.z)); }
  setPermutation(p) { this.setType(p.id); }
  get permutation() { const s = states.get(key(this.x, this.y, this.z)) ?? {}; return { getState: (n) => s[n] }; }
  getComponent(c) { if (c === "minecraft:inventory" && this.typeId === "minecraft:chest") return { container: chestContainer }; return undefined; }
}
export const BlockPermutation = { resolve: (id) => ({ id }) };

export class ItemStack {
  constructor(typeId, amount = 1) {
    if (!typeId.includes(":")) throw new Error("bad id " + typeId);
    this.typeId = typeId; this.amount = amount;
    this.maxAmount = /(pickaxe|_axe|shovel|sword|hoe|helmet|chestplate|leggings|boots|bow$|bucket|shield|furnace|crafting_table|chest$)/.test(typeId) ? (/(furnace|crafting_table|chest$|bucket)/.test(typeId) ? (typeId.endsWith("bucket") ? 16 : 64) : 1) : 64;
    this.nameTag = undefined; this._dmg = 0;
  }
  getLore() { return []; }
  getComponent(c) {
    if (c === "minecraft:durability" && /(pickaxe|_axe|shovel|sword|helmet|chestplate|leggings|boots|bow$)/.test(this.typeId)) { const self = this; return { maxDurability: 250, get damage() { return self._dmg; }, set damage(v) { self._dmg = v; } }; }
    return undefined;
  }
}
function makeContainer(size) {
  const slots = new Array(size).fill(undefined);
  return {
    size, slots,
    getItem: (i) => slots[i],
    setItem: (i, it) => { slots[i] = it; },
    addItem(it) {
      let left = it.amount;
      for (let i = 0; i < size && left > 0; i++) {
        const s = slots[i];
        if (s && s.typeId === it.typeId && s.amount < s.maxAmount) { const add = Math.min(left, s.maxAmount - s.amount); s.amount += add; left -= add; }
      }
      for (let i = 0; i < size && left > 0; i++) if (!slots[i]) { const add = Math.min(left, it.maxAmount); slots[i] = new ItemStack(it.typeId, add); left -= add; }
      return left > 0 ? new ItemStack(it.typeId, left) : undefined;
    },
  };
}
export const chestContainer = makeContainer(27);
export const playerContainer = makeContainer(36);

const entities = [];
export const items = []; // dropped items
let nextId = 100;
class Entity {
  constructor(typeId, loc, dim) {
    this.typeId = typeId; this.id = String(nextId++); this.location = { ...loc }; this.dimension = dim; this.isValid = true;
    this.props = {}; this.dyn = {}; this.nameTag = ""; this.rot = { x: 0, y: 0 }; this.events = [];
    this.health = { currentValue: 40, effectiveMax: 40, setCurrentValue(v) { this.currentValue = v; } };
  }
  getDynamicProperty(k) { return this.dyn[k]; }
  setDynamicProperty(k, v) { this.dyn[k] = v; }
  setProperty(k, v) { this.props[k] = v; }
  triggerEvent(e) { this.events.push(e); }
  teleport(to, opts = {}) { this.location = { ...to }; if (opts.rotation) this.rot = opts.rotation; if (opts.dimension) this.dimension = opts.dimension; }
  setRotation(r) { this.rot = r; }
  getRotation() { return this.rot; }
  getViewDirection() { const y = this.rot.y * Math.PI / 180; return { x: -Math.sin(y), y: 0, z: Math.cos(y) }; }
  addEffect() {}
  remove() { this.isValid = false; const i = entities.indexOf(this); if (i >= 0) entities.splice(i, 1); }
  getComponent(c) {
    if (c === "minecraft:health") return this.health;
    if (c === "minecraft:tameable") return { tame: () => true };
    if (c === "minecraft:projectile") return { owner: null, shoot: () => {} };
    return undefined;
  }
}
class Dimension {
  constructor(id) { this.id = id; this.heightRange = { min: -64, max: 320 }; }
  getBlock(p) { return new Block(this, Math.floor(p.x), Math.floor(p.y), Math.floor(p.z)); }
  getTopmostBlock({ x, z }) { for (let y = 200; y > -64; y--) { if (idAt(x, y, z) !== "minecraft:air") return new Block(this, x, y, z); } return undefined; }
  playSound() {}
  spawnParticle() {}
  spawnItem(stack, at) { items.push({ id: stack.typeId, n: stack.amount, at: { ...at } }); }
  spawnEntity(typeId, at) { const e = new Entity(typeId, at, this); entities.push(e); return e; }
  getEntities(opts = {}) {
    return entities.filter((e) => e.dimension === this && (!opts.type || e.typeId === opts.type) && (!opts.families || (e.families ?? []).some((f) => opts.families.includes(f))) && (!opts.location || Math.hypot(e.location.x - opts.location.x, e.location.y - opts.location.y, e.location.z - opts.location.z) <= (opts.maxDistance ?? 1e9)));
  }
  getPlayers() { return [player]; }
}
export const overworld = new Dimension("minecraft:overworld");
const dims = { overworld, "minecraft:overworld": overworld, nether: new Dimension("minecraft:nether"), the_end: new Dimension("minecraft:the_end") };
dims["minecraft:nether"] = dims.nether; dims["minecraft:the_end"] = dims.the_end;

export const said = [];
export const actionbar = [];
export const player = {
  typeId: "minecraft:player", id: "P1", name: "Ton", isValid: true, location: { x: 0.5, y: 65, z: 0.5 }, dimension: overworld,
  selectedSlotIndex: 0, isSleeping: false, rot: { x: 0, y: 0 },
  sendMessage(m) { said.push(String(m).replace(/§./g, "")); },
  onScreenDisplay: { setActionBar(t) { actionbar.push(String(t).replace(/§./g, "")); } },
  getComponent(c) { if (c === "minecraft:inventory") return { container: playerContainer }; if (c === "minecraft:health") return { currentValue: 20, effectiveMax: 20 }; return undefined; },
  getRotation() { return this.rot; }, getViewDirection() { return { x: 0, y: 0, z: 1 }; }, getSpawnPoint() { return undefined; },
  getGameMode() { return "Survival"; }, getBlockFromViewDirection() { return { block: new Block(overworld, 3, 65, 0) }; },
  playSound() {},
};

const props = new Map();
const sub = () => ({ subscribe() {}, unsubscribe() {} });
const afterNames = ["entityHurt", "entityHitEntity", "entityDie", "playerDimensionChange", "weatherChange", "playerBreakBlock", "itemUse", "playerInteractWithEntity", "playerSpawn"];
export const world = {
  getDynamicProperty: (k) => props.get(k), setDynamicProperty: (k, v) => props.set(k, v), getDynamicPropertyIds: () => [...props.keys()],
  getDay: () => 3, getTimeOfDay: () => 6000, getAbsoluteTime: () => tick,
  getEntity: (id) => entities.find((e) => e.id === id && e.isValid),
  getPlayers: () => [player], getDimension: (n) => dims[n],
  sendMessage(m) { said.push(String(m)); },
  afterEvents: Object.fromEntries([...afterNames, "worldLoad"].map((n) => [n, n === "worldLoad" ? { subscribe(cb) { loadCbs.push(cb); } } : sub()])),
  beforeEvents: { chatSend: sub() },
};
const loadCbs = [];
export function fireWorldLoad() { for (const cb of loadCbs) cb(); }

// ---------------- scheduler
let tick = 0;
const timers = []; let tid = 1;
const jobs = [];
export const system = {
  get currentTick() { return tick; },
  runTimeout(fn, t = 0) { timers.push({ id: tid, fn, at: tick + Math.max(1, t), every: 0 }); return tid++; },
  runInterval(fn, t = 1) { timers.push({ id: tid, fn, at: tick + t, every: t }); return tid++; },
  run(fn) { return this.runTimeout(fn, 1); },
  clearRun(id) { const i = timers.findIndex((x) => x.id === id); if (i >= 0) timers.splice(i, 1); },
  runJob(g) { jobs.push(g); return tid++; },
  sendScriptEvent() {},
  afterEvents: { scriptEventReceive: sub() },
  beforeEvents: { startup: sub() },
};
export function advance(n) {
  for (let i = 0; i < n; i++) {
    tick++;
    for (const t of [...timers]) {
      if (t.at > tick) continue;
      if (t.every) t.at = tick + t.every; else timers.splice(timers.indexOf(t), 1);
      t.fn();
    }
    for (let j = 0; j < jobs.length; j++) {
      for (let s = 0; s < 3; s++) { const r = jobs[j].next(); if (r.done) { jobs.splice(j, 1); j--; break; } }
    }
  }
}
export const CommandPermissionLevel = { Any: 0 };
export const CustomCommandParamType = { String: "String" };
export const CustomCommandStatus = { Success: 0, Failure: 1 };
export const GameMode = { Creative: "Creative", Survival: "Survival" };
export { entities };
