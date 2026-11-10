import * as MC from "@minecraft/server";
import "./world.mjs";
await import("./scripts/main.js");
MC.fireWorldLoad();
const { summon, getPo } = await import("./scripts/po.js");
const { dataOf } = await import("./scripts/store.js");
const { handleTalk } = await import("./scripts/brain.js");
const { taskOf } = await import("./scripts/tasks.js");
const P = MC.player;
summon(P, "first");
MC.advance(20);
const data = dataOf(P);
const po = getPo(data);
const show = (from) => { for (const l of MC.said.slice(from)) console.log("   " + l); return MC.said.length; };
let mark = show(0);
function run(cmd, maxTicks) {
  console.log(`\n> ${cmd}`);
  handleTalk(P, cmd);
  let t = 0;
  MC.advance(20);
  while (taskOf(P.id) && t < maxTicks) { MC.advance(100); t += 100; const st = taskOf(P.id)?.stairs; if (st && !globalThis.STAIRS) globalThis.STAIRS = { ...st, y: Math.floor(po.location.y + 0.05) }; }
  mark = show(mark);
  console.log(`   [ticks ${t + 20}, task ${taskOf(P.id) ? "STILL RUNNING " + taskOf(P.id).phase : "done"}; Po at ${Object.values(po.location).map((v) => v.toFixed(1)).join(",")}]`);
  console.log("   bag:", JSON.stringify(data.bag));
  console.log("   gear:", JSON.stringify(data.gear));
}
const scenario = process.argv[2] ?? "wood";
if (scenario === "wood") {
  run("ตัดไม้เบิร์ช 5", 4000);
  run("ตัดไม้ 12", 8000);
  run("ขอไม้เบิร์ช 3", 10);
}
if (scenario === "mine") {
  run("หาเหล็ก 3", 60000);
  console.log("   smelt:", JSON.stringify(data.smelt));
  MC.advance(2000);
  mark = show(mark);
  console.log("   bag after furnace:", JSON.stringify(data.bag), "gear", JSON.stringify(data.gear));
  // staircase check: every ring cell walked has 3 air blocks
  const air = MC.changes.filter((c) => c[4] === "minecraft:air").length;
  // walk the spiral like a player: 3 free blocks above each step, solid floor under it
  const RING = [[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];
  let bad = 0, steps = 0;
  for (let i = 1; i < 200; i++) {
    const S = globalThis.STAIRS; if (!S) break;
    const [rx, rz] = RING[(S.i + i) % 8];
    const x = S.cx + rx, z = S.cz + rz, y = S.y - i;
    if (MC.idAt(x, y, z) === "minecraft:air" && MC.idAt(x, y + 1, z) === "minecraft:air") { steps++; if (MC.idAt(x, y + 2, z) !== "minecraft:air" || MC.idAt(x, y - 1, z) === "minecraft:air") bad++; }
    else if (/torch/.test(MC.idAt(x, y, z))) steps++;
    else break;
  }
  console.log(`   spiral steps walkable: ${steps}, bad steps: ${bad}`);
  console.log(`   blocks dug: ${air}, torches: ${MC.changes.filter((c) => c[4] === "minecraft:torch").length}, plugs: ${MC.changes.filter((c) => /cobble|dirt/.test(c[4])).length}`);
}
if (scenario === "diamond") {
  run("ขุดเพชร 2", 120000);
  MC.advance(3000);
  mark = show(mark);
  console.log("   bag:", JSON.stringify(data.bag));
  console.log("   keep:", JSON.stringify(data.keep));
  console.log(`   lava plugs: ${MC.changes.filter((c) => /lava/.test(c[3]) && /cobble|dirt/.test(c[4])).length}, lava left next to tunnel: ?`);
}
if (scenario === "craft") {
  Object.assign(data.bag, { "minecraft:cobblestone": 20, "minecraft:oak_log": 4, "minecraft:coal": 2, "minecraft:raw_iron": 3 });
  for (const c of ["ทำดาบหินให้หน่อย", "ทำคบไฟ 8", "ทำดาบเหล็กให้หน่อย", "เผาเหล็ก", "อุปกรณ์", "อัปเกรด"]) { console.log("> " + c); handleTalk(P, c); MC.advance(30); mark = show(mark); }
  MC.advance(800); mark = show(mark);
  console.log("> ทำดาบเหล็กให้หน่อย"); handleTalk(P, "ทำดาบเหล็กให้หน่อย"); MC.advance(30); mark = show(mark);
  console.log("   bag:", JSON.stringify(data.bag)); console.log("   player inv:", MC.playerContainer.slots.filter(Boolean).map((s) => `${s.typeId.replace("minecraft:", "")}x${s.amount}`).join(" "));
}
if (scenario === "mine" && globalThis.STAIRS) {
  const S = globalThis.STAIRS;
  console.log("   stairs center", S.cx, S.cz, "captured at y", S.y, "i", S.i);
  for (let y = S.y; y > S.y - 6; y--) {
    let row = "";
    for (let dz = -1; dz <= 1; dz++) { for (let dx = -1; dx <= 1; dx++) { const id = MC.idAt(S.cx + dx, y, S.cz + dz); row += id === "minecraft:air" ? "." : /torch/.test(id) ? "t" : /ore/.test(id) ? "o" : "#"; } row += " "; }
    console.log(`   y=${y}: ${row}`);
  }
}
if (scenario === "lava") {
  // lots of lava between y 40 and 56
  const { terrain, hash } = await import("./world.mjs");
  MC.setGenerator((x, y, z) => (y >= 40 && y <= 56 && hash(x + 7, y, z - 3) < 0.12 ? "minecraft:lava" : terrain(x, y, z)));
  Object.assign(data.bag, { "minecraft:cobblestone": 40 });
  data.gear.pickaxe = { tier: "stone", dur: 131 };
  run("ขุดเหล็ก 4", 60000);
  const dug = MC.changes.filter((c) => c[4] === "minecraft:air").map((c) => c.slice(0, 3));
  let exposed = 0;
  for (const [x, y, z] of dug) for (const [dx, dy, dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]) if (/lava/.test(MC.idAt(x + dx, y + dy, z + dz))) exposed++;
  console.log(`   lava plugged: ${MC.changes.filter((c) => /lava/.test(c[3])).length}, lava still touching dug space: ${exposed}, Po standing in: ${MC.idAt(Math.floor(po.location.x), Math.floor(po.location.y), Math.floor(po.location.z))}`);
}
if (scenario === "fight") {
  Object.assign(data.bag, { "minecraft:cobblestone": 20 });
  data.gear.pickaxe = { tier: "stone", dur: 131 };
  handleTalk(P, "ขุดเหล็ก 3");
  MC.advance(400);
  const z = MC.overworld.spawnEntity("minecraft:zombie", { ...po.location, x: po.location.x + 2 });
  z.families = ["monster"];
  const before = taskOf(P.id)?.phase;
  MC.advance(40);
  console.log(`   zombie appears: phase before ${before}, now fight=${taskOf(P.id)?.fight}, last event ${po.events.at(-1)}`);
  z.remove();
  MC.advance(120);
  console.log(`   zombie gone: fight=${taskOf(P.id)?.fight}, phase ${taskOf(P.id)?.phase}, last event ${po.events.at(-1)}`);
  let t = 0; while (taskOf(P.id) && t < 40000) { MC.advance(100); t += 100; }
  mark = show(mark);
  // owner walks far away
  handleTalk(P, "ตัดไม้ 5"); MC.advance(60);
  P.location = { x: 200, y: 65, z: 200 }; MC.advance(40); mark = show(mark);
  console.log(`   owner far: task ${taskOf(P.id) ? "running" : "stopped"}`);
}
if (scenario === "chest") {
  MC.setId(3, 65, 0, "minecraft:chest");
  Object.assign(data.bag, { "minecraft:cobblestone": 90, "minecraft:diamond": 2, "minecraft:coal": 30, "minecraft:torch": 50, "minecraft:crafting_table": 1, "minecraft:oak_log": 20 });
  handleTalk(P, "ตั้งหีบนี้"); MC.advance(30);
  run("เอาของเข้าหีบ", 2000);
  console.log("   chest:", MC.chestContainer.slots.filter(Boolean).map((s) => `${s.typeId.replace("minecraft:", "")}x${s.amount}`).join(" "));
  handleTalk(P, "ทำหีบให้หน่อย"); MC.advance(30); mark = show(mark);
  data.bag = { "minecraft:crafting_table": 1 };
  handleTalk(P, "ทำดาบหินให้หน่อย"); MC.advance(30); mark = show(mark);
  console.log("   bag after pulling from chest:", JSON.stringify(data.bag));
}
if (scenario === "talk") {
  const { cancelTask } = await import("./scripts/tasks.js");
  Object.assign(data.bag, { "minecraft:diamond": 3, "minecraft:stick": 4, "minecraft:crafting_table": 1, "minecraft:raw_iron": 2, "minecraft:cobblestone": 9 });
  const lines = ["หาไม้โอ๊ก 10", "ขุดหิน 32", "ทำอะไรอยู่", "หยุด", "เผาเหล็ก", "ทำคบไฟ 16", "อุปกรณ์", "มีอีเต้อไหม", "ตั้งหีบนี้", "ขอไม้ 4", "หาเพชรที่ไหน", "เพชรอยู่ชั้นไหน", "นำทางไปต้นเชอร์รี", "อัปเกรด", "ได้", "ใช้ได้เลย", "ขุดเพชร", "หยุดก่อน", "ตามมา", "หาทองแดง 5", "พอแล้ว"];
  for (const l of lines) {
    MC.said.length = 0;
    handleTalk(P, l);
    MC.advance(25);
    const t = taskOf(P.id);
    console.log(`> ${l}\n   ${MC.said.slice(1).join(" | ")}${t ? `  [task: ${t.kind} ${t.wood ?? t.ore ?? ""} x${t.count}]` : ""}`);
  }
}
if (scenario === "phase1") {
  MC.playerContainer.slots[0] = new MC.ItemStack("minecraft:bread", 5);
  for (const l of ["สวัสดี Po", "ตามมา", "คุ้มกัน", "รอตรงนี้นะ", "ฝากของ", "ขอขนมปัง 2", "มีขนมปังไหม", "บ้านอยู่ไหน", "เล่ามุกหน่อย", "ช่วยด้วย", "หิว", "เลือดเหลือเท่าไร", "ขอบคุณ", "ขอโทษนะ", "ไม่ต้องตามมา", "หยุดสู้", "ทำเตียงยังไง", "เพชรอยู่ชั้นไหน", "ทำอะไรได้บ้าง", "asdf"]) {
    MC.said.length = 0; handleTalk(P, l); MC.advance(25);
    console.log(`> ${l}\n   ${MC.said.slice(1).join(" | ").slice(0, 160)}`);
  }
}
