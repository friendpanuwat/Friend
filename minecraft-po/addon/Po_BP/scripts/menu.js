// Po's menu (big buttons that work well on a phone screen).
import { system } from "@minecraft/server";
import { ActionFormData, ModalFormData, FormCancelationReason } from "@minecraft/server-ui";
import { dataOf, touch, releaseKeep } from "./store.js";
import { getPo, setMode, bring, guide, summon, poSay, poSayText, MODE_TH } from "./po.js";
import { handleTalk, depositHeld } from "./brain.js";
import * as Bag from "./bag.js";
import { itemTh } from "./names.js";
import { posText, dimThai, PO_NAME_DEFAULT } from "./util.js";
import { startTask, cancelTask, taskOf, progressText } from "./tasks.js";
import { WOODS, ORES } from "./blocks.js";
import * as G from "./gear.js";
import { autoGear } from "./equip.js";

/** @typedef {import("@minecraft/server").Player} Player */
/** @typedef {import("./store.js").PoData} PoData */

/** @param {number} ticks */
const sleep = (ticks) => new Promise((r) => system.runTimeout(() => r(undefined), ticks));

/**
 * Show a form, retrying while the player still has another screen open
 * (common right after tapping an entity on a phone).
 * @param {Player} player @param {ActionFormData} form
 * @returns {Promise<import("@minecraft/server-ui").ActionFormResponse | undefined>}
 */
async function showAction(player, form) {
  for (let i = 0; i < 20; i++) {
    const res = await form.show(player);
    if (res.canceled && res.cancelationReason === FormCancelationReason.UserBusy) {
      await sleep(10);
      continue;
    }
    return res;
  }
  return undefined;
}

/**
 * @param {Player} player @param {ModalFormData} form
 * @returns {Promise<import("@minecraft/server-ui").ModalFormResponse | undefined>}
 */
async function showModal(player, form) {
  for (let i = 0; i < 20; i++) {
    const res = await form.show(player);
    if (res.canceled && res.cancelationReason === FormCancelationReason.UserBusy) {
      await sleep(10);
      continue;
    }
    return res;
  }
  return undefined;
}

/** @param {Player} player */
export async function openMenu(player) {
  const data = dataOf(player);
  const po = getPo(data);
  /** @type {{ text: string, icon: string, run: () => void | Promise<void> }[]} */
  const buttons = [];
  let body;
  if (po) {
    const hp = po.getComponent("minecraft:health");
    const cur = Math.round(hp?.currentValue ?? 0);
    const max = Math.round(hp?.effectiveMax ?? 40);
    body =
      `§lเลือด§r ${cur}/${max}   §lโหมด§r ${MODE_TH[data.mode]}\n` +
      `§lเพื่อนกันมา§r ${data.stats.days} วัน   §lกระเป๋า§r ${Bag.slotsUsed(data.bag)}/${Bag.BAG_SLOTS} ช่อง` +
      (taskOf(player.id) ? `\n§6${progressText(player.id)}§r` : "");
    const mark = (/** @type {string} */ m) => (data.mode === m ? " §2(ตอนนี้)" : "");
    buttons.push(
      { text: `คุยกับ ${data.name}`, icon: "textures/items/book_writable", run: () => talkForm(player) },
      { text: `ตามมา${mark("follow")}`, icon: "textures/items/lead", run: () => setMode(player, data, "follow") },
      { text: `คุ้มกัน${mark("guard")}`, icon: "textures/items/iron_sword", run: () => setMode(player, data, "guard") },
      { text: `รอตรงนี้${mark("stay")}`, icon: "textures/items/bed_red", run: () => setMode(player, data, "stay") },
      { text: "เรียกมาหา", icon: "textures/items/ender_pearl", run: () => void (bring(player, data) && poSay(player, data, "come")) },
      { text: "งาน (ตัดไม้ ขุดแร่ คราฟต์ เผา)", icon: "textures/items/iron_pickaxe", run: () => workMenu(player) },
      { text: "กระเป๋า", icon: "textures/blocks/chest_front", run: () => bagMenu(player) },
    );
  } else if (Date.now() < data.deadUntil) {
    const wait = Math.ceil((data.deadUntil - Date.now()) / 1000);
    body = `${data.name} กำลังพักฟื้น อีก ${wait} วินาทีค่อยเรียกได้นะ`;
  } else if (data.poId) {
    body = `${data.name} อยู่ไกลเกินไป (พื้นที่นั้นไม่ได้โหลดอยู่)\nเรียกมาหาได้ ของในกระเป๋ายังอยู่ครบ`;
    buttons.push({ text: `เรียก ${data.name} มาหา`, icon: "textures/items/ender_pearl", run: () => void summon(player, "catch_up") });
  } else {
    body = `ยังไม่ได้เรียก ${data.name} ออกมา`;
    buttons.push({
      text: `เรียก ${data.name}`,
      icon: "textures/items/ender_pearl",
      run: () => void summon(player, data.met ? (data.stats.poDeaths > 0 ? "revive" : "summon") : "first"),
    });
  }
  buttons.push(
    { text: "ความจำ", icon: "textures/items/map_empty", run: () => memoryMenu(player) },
    { text: "ตั้งค่า", icon: "textures/items/redstone_dust", run: () => settingsForm(player) },
  );

  const form = new ActionFormData().title(data.name).body(body);
  for (const b of buttons) form.button(b.text, b.icon);
  const res = await showAction(player, form);
  if (!res || res.canceled || res.selection === undefined) return;
  await buttons[res.selection]?.run();
}

/** @param {Player} player */
async function talkForm(player) {
  const data = dataOf(player);
  const form = new ModalFormData()
    .title(`คุยกับ ${data.name}`)
    .textField("พิมพ์อะไรก็ได้", "เช่น ตามมา / เพชรอยู่ชั้นไหน / ขอขนมปัง 2")
    .submitButton("ส่ง");
  const res = await showModal(player, form);
  if (!res || res.canceled || !res.formValues) return;
  const text = String(res.formValues[0] ?? "");
  if (text.trim()) handleTalk(player, text);
}

/** @param {Player} player */
async function bagMenu(player) {
  const data = dataOf(player);
  const entries = Object.entries(data.bag).sort((a, b) => b[1] - a[1]);
  const list = entries.length ? entries.map(([id, n]) => `• ${itemTh(id)} x${n}`).join("\n") : "(ว่างเปล่า)";
  /** @type {{ text: string, icon?: string, run: () => void }[]} */
  const buttons = [
    { text: "ฝากของที่ถืออยู่", icon: "textures/blocks/chest_front", run: () => depositHeld(player) },
  ];
  if (entries.length) {
    buttons.push({ text: "เอาของคืนทั้งหมด", icon: "textures/items/totem", run: () => handleTalk(player, "คืนของ") });
    for (const [id, n] of entries.slice(0, 20)) {
      buttons.push({
        text: `เอา${itemTh(id)} x${n} คืน`,
        run: () => {
          const got = Bag.take(data.bag, id, n);
          Bag.giveToPlayer(player, id, got);
          releaseKeep(data, id, got);
          touch(player.id);
          poSayText(player, data, `เอาไป! ${itemTh(id)} ${got} ชิ้น`);
        },
      });
    }
  }
  const form = new ActionFormData()
    .title(`กระเป๋าของ ${data.name}`)
    .body(`ใช้ไป ${Bag.slotsUsed(data.bag)}/${Bag.BAG_SLOTS} ช่อง\n${list}`);
  for (const b of buttons) form.button(b.text, b.icon);
  const res = await showAction(player, form);
  if (!res || res.canceled || res.selection === undefined) return;
  buttons[res.selection]?.run();
}

/** @param {Player} player */
async function memoryMenu(player) {
  const data = dataOf(player);
  const s = data.stats;
  const lines = [
    `§lเพื่อนกันมา§r ${s.days} วัน${data.met ? ` (เจอกันครั้งแรกวันที่ ${data.metDay})` : ""}`,
    `§lจัดการมอนสเตอร์§r ${s.kills} ตัว   §lช่วยชีวิต ${player.name}§r ${s.saves} ครั้ง`,
    `§lได้กินของจาก ${player.name}§r ${s.fed} ครั้ง   §lเจอเพชร§r ${s.diamonds} ครั้ง`,
    `§lบ้าน§r ${data.home ? `${posText(data.home)} (${dimThai(data.home.dim)})` : "ยังไม่รู้ (นอนเตียงสักครั้งนะ)"}`,
    `§lจุดที่ตายล่าสุด§r ${data.deathSpot ? `${posText(data.deathSpot)} วันที่ ${data.deathSpot.day}` : "-"}`,
  ];
  if (data.finds.length) {
    lines.push("", "§lของดีที่เคยเจอ§r");
    for (const f of data.finds.slice(-5).reverse()) lines.push(`• ${f.what} ที่ ${posText(f)} (วันที่ ${f.day})`);
  }
  if (data.log.length) {
    lines.push("", "§lเรื่องที่จำได้§r");
    for (const e of data.log.slice(-8).reverse()) lines.push(`• วันที่ ${e.day}: ${e.text}`);
  }
  /** @type {{ text: string, icon: string, run: () => void }[]} */
  const buttons = [];
  if (data.home) buttons.push({ text: "นำทางกลับบ้าน", icon: "textures/items/compass_item", run: () => guide(player, data, /** @type {any} */ (data.home), "บ้าน") });
  if (data.deathSpot)
    buttons.push({ text: "นำทางไปจุดที่ตาย", icon: "textures/items/recovery_compass_item", run: () => guide(player, data, /** @type {any} */ (data.deathSpot), "จุดที่ตาย") });
  buttons.push({ text: "กลับ", icon: "textures/items/paper", run: () => void openMenu(player) });
  const form = new ActionFormData().title(`ความจำของ ${data.name}`).body(lines.join("\n"));
  for (const b of buttons) form.button(b.text, b.icon);
  const res = await showAction(player, form);
  if (!res || res.canceled || res.selection === undefined) return;
  buttons[res.selection]?.run();
}

/** @param {Player} player */
async function settingsForm(player) {
  const data = dataOf(player);
  const form = new ModalFormData()
    .title(`ตั้งค่า ${data.name}`)
    .dropdown("ช่างพูดแค่ไหน", ["เงียบ (พูดเฉพาะตอนอันตราย)", "ปกติ", "ช่างคุย"], { defaultValueIndex: data.settings.talk })
    .textField("ชื่อ", PO_NAME_DEFAULT, { defaultValue: data.name })
    .toggle("ใช้เพชร/ทองทำอุปกรณ์ตัวเองได้เลย ไม่ต้องถาม", { defaultValue: data.settings.rareOk })
    .toggle("ทำงานเร็วขึ้น 2 เท่า (ไม่สมจริง)", { defaultValue: data.settings.fast })
    .toggle("เผาแร่ดิบอัตโนมัติ", { defaultValue: data.settings.autoSmelt })
    .submitButton("บันทึก");
  const res = await showModal(player, form);
  if (!res || res.canceled || !res.formValues) return;
  const [talk, name, rareOk, fast, autoSmelt] = res.formValues;
  if (typeof rareOk === "boolean") data.settings.rareOk = rareOk;
  if (typeof fast === "boolean") data.settings.fast = fast;
  if (typeof autoSmelt === "boolean") data.settings.autoSmelt = autoSmelt;
  if (typeof talk === "number") data.settings.talk = talk;
  if (typeof name === "string") {
    const clean = name.replace(/§./g, "").trim().slice(0, 16);
    if (clean && clean !== data.name) {
      data.name = clean;
      const po = getPo(data);
      if (po) po.nameTag = clean;
    }
  }
  touch(player.id);
  poSayText(player, data, ["โอเค ผมจะเงียบๆ นะ พูดเฉพาะเรื่องสำคัญ", "โอเค ตั้งค่าเรียบร้อย!", "เย้! ผมจะคุยเยอะๆ เลยนะ"][data.settings.talk] ?? "บันทึกแล้ว");
}


// ------------------------------------------------------------------ jobs

const WOOD_KEYS = Object.keys(WOODS);
const ORE_KEYS = ["coal", "iron", "copper", "gold", "redstone", "lapis", "diamond", "emerald", "stone", "deepslate", "dirt", "sand", "gravel", "clay", "quartz", "nether_gold", "debris", "obsidian"];

/** @param {Player} player */
async function workMenu(player) {
  const data = dataOf(player);
  const busyNow = taskOf(player.id);
  /** @type {{ text: string, icon: string, run: () => void | Promise<void> }[]} */
  const buttons = [];
  if (busyNow) buttons.push({ text: "หยุดงานที่ทำอยู่", icon: "textures/blocks/barrier", run: () => void cancelTask(player.id) });
  buttons.push(
    { text: "ตัดไม้", icon: "textures/items/stone_axe", run: () => woodForm(player) },
    { text: "ขุดแร่ / หาของ", icon: "textures/items/iron_pickaxe", run: () => mineForm(player) },
    { text: "คราฟต์ของให้", icon: "textures/blocks/crafting_table_front", run: () => craftMenu(player) },
    { text: "เผา / ย่าง", icon: "textures/items/coal", run: () => smeltMenu(player) },
    { text: "อุปกรณ์ของ Po", icon: "textures/items/iron_sword", run: () => gearMenu(player) },
    { text: "หีบคลังของ", icon: "textures/blocks/chest_front", run: () => chestMenu(player) },
    { text: "กลับ", icon: "textures/items/paper", run: () => openMenu(player) },
  );
  const jobs = data.smelt.jobs.filter((j) => j.done < j.total);
  const body =
    (busyNow ? `§6${progressText(player.id)}§r\n` : "ตอนนี้ว่างอยู่\n") +
    (jobs.length ? `เตาเผา: ${jobs.map((j) => `${itemTh(j.in)} ${j.done}/${j.total}`).join(", ")}` : "เตาเผาว่าง");
  const form = new ActionFormData().title(`งานของ ${data.name}`).body(body);
  for (const b of buttons) form.button(b.text, b.icon);
  const res = await showAction(player, form);
  if (!res || res.canceled || res.selection === undefined) return;
  await buttons[res.selection]?.run();
}

/** @param {Player} player */
async function woodForm(player) {
  const form = new ModalFormData()
    .title("ตัดไม้")
    .dropdown("ไม้ชนิดไหน", ["ชนิดไหนก็ได้", ...WOOD_KEYS.map((k) => WOODS[/** @type {keyof typeof WOODS} */ (k)].th)], { defaultValueIndex: 0 })
    .slider("กี่ท่อน", 1, 64, { valueStep: 1, defaultValue: 16 })
    .submitButton("ไปเลย");
  const res = await showModal(player, form);
  if (!res || res.canceled || !res.formValues) return;
  const [idx, n] = res.formValues;
  const wood = typeof idx === "number" && idx > 0 ? WOOD_KEYS[idx - 1] : null;
  const count = typeof n === "number" ? n : 16;
  const data = dataOf(player);
  if (startTask(player, { kind: "wood", wood, count })) {
    poSayText(player, data, `ได้เลย! ไปตัดไม้${wood ? WOODS[/** @type {keyof typeof WOODS} */ (wood)].th : ""} ${count} ท่อนนะ`);
  }
}

/** @param {Player} player */
async function mineForm(player) {
  const form = new ModalFormData()
    .title("ขุดแร่ / หาของ")
    .dropdown("หาอะไร", ORE_KEYS.map((k) => ORES[/** @type {keyof typeof ORES} */ (k)].th), { defaultValueIndex: 1 })
    .slider("จำนวน", 1, 64, { valueStep: 1, defaultValue: 10 })
    .submitButton("ไปเลย");
  const res = await showModal(player, form);
  if (!res || res.canceled || !res.formValues) return;
  const [idx, n] = res.formValues;
  const ore = ORE_KEYS[typeof idx === "number" ? idx : 1];
  const count = typeof n === "number" ? n : 10;
  const data = dataOf(player);
  if (startTask(player, { kind: "mine", ore, count })) {
    poSayText(player, data, `ได้เลย! ไปหา${ORES[/** @type {keyof typeof ORES} */ (ore)].th} ${count} นะ`);
  }
}

/** @param {Player} player */
async function craftMenu(player) {
  const items = [
    ["คบไฟ 8 อัน", "ทำคบไฟ 8 ให้หน่อย", "textures/blocks/torch_on"],
    ["อีเต้อ (ดีที่สุดที่ทำได้)", "ทำอีเต้อให้หน่อย", "textures/items/iron_pickaxe"],
    ["ดาบ (ดีที่สุดที่ทำได้)", "ทำดาบให้หน่อย", "textures/items/iron_sword"],
    ["ขวาน", "ทำขวานให้หน่อย", "textures/items/iron_axe"],
    ["พลั่ว", "ทำพลั่วให้หน่อย", "textures/items/iron_shovel"],
    ["โต๊ะคราฟต์", "ทำโต๊ะคราฟต์ให้หน่อย", "textures/blocks/crafting_table_front"],
    ["เตาเผา", "ทำเตาเผาให้หน่อย", "textures/blocks/furnace_front_off"],
    ["หีบ", "ทำหีบให้หน่อย", "textures/blocks/chest_front"],
    ["ไม้แท่ง 8", "ทำไม้แท่ง 8 ให้หน่อย", "textures/items/stick"],
    ["หมวกเหล็ก", "ทำหมวกเหล็กให้หน่อย", "textures/items/iron_helmet"],
    ["เสื้อเกราะเหล็ก", "ทำเสื้อเหล็กให้หน่อย", "textures/items/iron_chestplate"],
    ["กางเกงเหล็ก", "ทำกางเกงเหล็กให้หน่อย", "textures/items/iron_leggings"],
    ["รองเท้าเหล็ก", "ทำรองเท้าเหล็กให้หน่อย", "textures/items/iron_boots"],
    ["ธนู", "ทำธนูให้หน่อย", "textures/items/bow_standby"],
    ["ลูกธนู 8", "ทำลูกธนู 8 ให้หน่อย", "textures/items/arrow"],
    ["ถัง", "ทำถังให้หน่อย", "textures/items/bucket_empty"],
    ["โล่", "ทำโล่ให้หน่อย", "textures/items/iron_ingot"],
  ];
  const form = new ActionFormData().title("คราฟต์ของให้").body("Po ใช้วัตถุดิบในกระเป๋าของ Po (และในหีบคลังถ้าอยู่ใกล้)");
  for (const [label, , icon] of items) form.button(label, icon);
  const res = await showAction(player, form);
  if (!res || res.canceled || res.selection === undefined) return;
  const pickd = items[res.selection];
  if (pickd) handleTalk(player, pickd[1]);
}

/** @param {Player} player */
async function smeltMenu(player) {
  const items = [
    ["เผาแร่ดิบทั้งหมด (เหล็ก ทอง ทองแดง)", "เผาแร่"],
    ["ย่างเนื้อดิบทั้งหมด", "ย่างเนื้อ"],
    ["ทำถ่านไม้ 8 ก้อน", "ทำถ่าน 8"],
    ["เผาทรายเป็นแก้ว", "เผาทราย"],
    ["เผาหินกรวดเป็นหินเรียบ", "เผาหิน"],
  ];
  const form = new ActionFormData().title("เผา / ย่าง").body("ต้องมีเตาเผาและเชื้อเพลิง (ถ่าน ไม้ หรือแผ่นไม้) ชิ้นละ 10 วินาที");
  for (const [label] of items) form.button(label, "textures/blocks/furnace_front_on");
  const res = await showAction(player, form);
  if (!res || res.canceled || res.selection === undefined) return;
  const pickd = items[res.selection];
  if (pickd) handleTalk(player, pickd[1]);
}

/** @param {Player} player */
async function gearMenu(player) {
  const data = dataOf(player);
  const form = new ActionFormData()
    .title(`อุปกรณ์ของ ${data.name}`)
    .body(G.describe(data.gear).map((l) => `• ${l}`).join("\n") + "\n\nให้อุปกรณ์ Po: ถืออุปกรณ์แล้วกด \"ฝากของที่ถืออยู่\" ในกระเป๋า")
    .button("อัปเกรดด้วยของที่มี", "textures/items/diamond_pickaxe")
    .button("กลับ", "textures/items/paper");
  const res = await showAction(player, form);
  if (!res || res.canceled || res.selection === undefined) return;
  if (res.selection === 0) {
    const made = autoGear(player, data, { quiet: false });
    if (!made.length) handleTalk(player, "อัปเกรด");
  } else void workMenu(player);
}

/** @param {Player} player */
async function chestMenu(player) {
  const data = dataOf(player);
  const where = data.chest ? `${posText(data.chest)} (${dimThai(data.chest.dim)})` : "ยังไม่ได้ตั้ง";
  const form = new ActionFormData()
    .title("หีบคลังของ")
    .body(`หีบคลังของ Po: ${where}\nPo จะเก็บอุปกรณ์จำเป็นไว้กับตัว (โต๊ะคราฟต์ เตา คบไฟ ถ่าน อาหาร) ที่เหลือเอาเข้าหีบ`)
    .button("ตั้งหีบที่ฉันมองอยู่", "textures/blocks/chest_front")
    .button("เอาของเข้าหีบตอนนี้", "textures/items/totem")
    .button("กลับ", "textures/items/paper");
  const res = await showAction(player, form);
  if (!res || res.canceled || res.selection === undefined) return;
  if (res.selection === 0) handleTalk(player, "ตั้งหีบนี้");
  else if (res.selection === 1) startTask(player, { kind: "deposit" });
  else void workMenu(player);
}
