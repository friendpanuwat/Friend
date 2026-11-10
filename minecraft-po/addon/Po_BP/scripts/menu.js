// Po's menu (big buttons that work well on a phone screen).
import { system } from "@minecraft/server";
import { ActionFormData, ModalFormData, FormCancelationReason } from "@minecraft/server-ui";
import { dataOf, touch } from "./store.js";
import { getPo, setMode, bring, guide, summon, poSay, poSayText, MODE_TH } from "./po.js";
import { handleTalk, depositHeld } from "./brain.js";
import * as Bag from "./bag.js";
import { itemTh } from "./names.js";
import { posText, dimThai, PO_NAME_DEFAULT } from "./util.js";

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
      `§lเพื่อนกันมา§r ${data.stats.days} วัน   §lกระเป๋า§r ${Bag.slotsUsed(data.bag)}/${Bag.BAG_SLOTS} ช่อง`;
    const mark = (/** @type {string} */ m) => (data.mode === m ? " §2(ตอนนี้)" : "");
    buttons.push(
      { text: `คุยกับ ${data.name}`, icon: "textures/items/book_writable", run: () => talkForm(player) },
      { text: `ตามมา${mark("follow")}`, icon: "textures/items/lead", run: () => setMode(player, data, "follow") },
      { text: `คุ้มกัน${mark("guard")}`, icon: "textures/items/iron_sword", run: () => setMode(player, data, "guard") },
      { text: `รอตรงนี้${mark("stay")}`, icon: "textures/items/bed_red", run: () => setMode(player, data, "stay") },
      { text: "เรียกมาหา", icon: "textures/items/ender_pearl", run: () => void (bring(player, data) && poSay(player, data, "come")) },
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
    .submitButton("บันทึก");
  const res = await showModal(player, form);
  if (!res || res.canceled || !res.formValues) return;
  const [talk, name] = res.formValues;
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

