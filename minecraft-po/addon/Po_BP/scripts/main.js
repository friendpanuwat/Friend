// Po – a Thai-speaking companion for Minecraft Bedrock.
// Entry point: wires game events to Po's body (po.js), talk (brain.js),
// awareness (watch.js) and menu (menu.js).
import {
  world,
  system,
  ItemStack,
  CommandPermissionLevel,
  CustomCommandParamType,
  CustomCommandStatus,
} from "@minecraft/server";
import { PO_TYPE, WHISTLE } from "./util.js";
import { dataOf, loadById, touch, startAutosave } from "./store.js";
import { getPo, summon, tick, cleanup, poSay, poSayText, setEmote, EMOTE, hooks } from "./po.js";
import { tickTasks, activeReserve } from "./tasks.js";
import { syncCombat, startArmorRefresh, autoGear } from "./equip.js";
import * as Smelt from "./smelt.js";
import { handleTalk } from "./brain.js";
import { openMenu } from "./menu.js";
import { subscribe, periodic, onSpawn } from "./watch.js";
import { FOOD_HEAL, itemTh } from "./names.js";

hooks.afterSummon = (owner, data) => syncCombat(owner, data);
import { ready, notice } from "./speech.js";

/** @typedef {import("@minecraft/server").Player} Player */

// ---------------------------------------------------------------- /po:po command
system.beforeEvents.startup.subscribe((ev) => {
  try {
    const words = [];
    for (let i = 2; i <= 12; i++) words.push({ name: `word${i}`, type: CustomCommandParamType.String });
    ev.customCommandRegistry.registerCommand(
      {
        name: "po:po",
        description: "คุยหรือสั่ง Po เช่น /po:po ตามมา",
        permissionLevel: CommandPermissionLevel.Any,
        cheatsRequired: false,
        mandatoryParameters: [{ name: "message", type: CustomCommandParamType.String }],
        optionalParameters: words,
      },
      (origin, ...args) => {
        const src = origin.sourceEntity;
        if (!src || src.typeId !== "minecraft:player") {
          return { status: CustomCommandStatus.Failure, message: "ใช้ได้เฉพาะผู้เล่น" };
        }
        const player = /** @type {Player} */ (src);
        const text = args.filter((a) => typeof a === "string").join(" ");
        system.run(() => handleTalk(player, text));
        return { status: CustomCommandStatus.Success };
      },
    );
  } catch (e) {
    console.warn(`[Po] could not register /po:po: ${e}`);
  }
});

// ---------------------------------------------------------------- whistle
/** @param {Player} player */
function useWhistle(player) {
  if (!ready(`whistle:${player.id}`, 1)) return;
  const data = dataOf(player);
  if (!getPo(data) && !data.poId) {
    const wait = Math.ceil((data.deadUntil - Date.now()) / 1000);
    if (wait > 0) {
      notice(player, `${data.name} กำลังพักฟื้น อีก ${wait} วินาทีค่อยเรียกนะ`);
      return;
    }
    const reason = !data.met ? "first" : data.stats.poDeaths > 0 && data.deadUntil > 0 ? "revive" : "summon";
    summon(player, reason);
    if (reason === "first") {
      system.runTimeout(() => {
        notice(player, "กดที่ตัว Po หรือใช้นกหวีดอีกครั้ง เพื่อเปิดเมนูสั่งงาน — พิมพ์คุยได้ที่ปุ่ม \"คุยกับ Po\" หรือพิมพ์ /po:po ตามด้วยข้อความ");
      }, 60);
    }
    return;
  }
  void openMenu(player);
}

world.afterEvents.itemUse.subscribe((ev) => {
  if (ev.itemStack.typeId !== WHISTLE) return;
  useWhistle(ev.source);
});

// ---------------------------------------------------------------- tap on Po
world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
  const po = ev.target;
  if (po.typeId !== PO_TYPE) return;
  const player = ev.player;
  const ownerId = po.getDynamicProperty("po:owner");
  if (ownerId !== player.id) {
    const ownerData = typeof ownerId === "string" ? loadById(ownerId) : undefined;
    try {
      player.sendMessage(`§6<${po.nameTag.split("\n")[0]}>§r ผมเป็นเพื่อนของ ${ownerData?.ownerName ?? "คนอื่น"} นะ แต่ทักทายกันได้!`);
    } catch {}
    return;
  }
  const held = ev.itemStack;
  if (held && FOOD_HEAL[held.typeId]) {
    feed(player, held.typeId);
    return;
  }
  if (held?.typeId === WHISTLE) return; // the whistle already opens the menu
  void openMenu(player);
});

/** @param {Player} player @param {string} foodId */
function feed(player, foodId) {
  const data = dataOf(player);
  const po = getPo(data);
  if (!po) return;
  const hp = po.getComponent("minecraft:health");
  if (!hp) return;
  if (hp.currentValue >= hp.effectiveMax) {
    poSay(player, data, "full");
    return;
  }
  hp.setCurrentValue(Math.min(hp.effectiveMax, hp.currentValue + (FOOD_HEAL[foodId] ?? 4)));
  if (player.getGameMode() !== "Creative") {
    const container = player.getComponent("minecraft:inventory")?.container;
    const slot = player.selectedSlotIndex;
    const item = container?.getItem(slot);
    if (container && item && item.typeId === foodId) {
      if (item.amount <= 1) container.setItem(slot, undefined);
      else {
        item.amount -= 1;
        container.setItem(slot, item);
      }
    }
  }
  data.stats.fed++;
  touch(player.id);
  try {
    po.dimension.spawnParticle("minecraft:heart_particle", { x: po.location.x, y: po.location.y + 2, z: po.location.z });
  } catch {}
  setEmote(po, data, EMOTE.cheer, 40);
  poSay(player, data, "fed", { food: itemTh(foodId) });
}

// ---------------------------------------------------------------- join / respawn
world.afterEvents.playerSpawn.subscribe((ev) => {
  const player = ev.player;
  if (ev.initialSpawn) {
    system.runTimeout(() => {
      if (!player.isValid) return;
      const data = dataOf(player);
      if (!data.gotWhistle) {
        const inv = player.getComponent("minecraft:inventory")?.container;
        const rest = inv?.addItem(new ItemStack(WHISTLE, 1));
        if (rest) player.dimension.spawnItem(rest, player.location);
        data.gotWhistle = true;
        touch(player.id);
        player.sendMessage(
          "§e[Po] §fคุณได้รับ §6นกหวีดเรียก Po§f! ถือนกหวีดแล้วกดใช้ (แตะค้างที่จอ) เพื่อเรียก Po ออกมา\n" +
            "§7นกหวีดหาย? คราฟต์ใหม่ได้จากขนมปัง 1 + ไม้แท่ง 1",
        );
      }
    }, 60);
  }
  onSpawn(player, ev.initialSpawn);
});

// ---------------------------------------------------------------- loops
world.afterEvents.worldLoad.subscribe(() => {
  startAutosave();
  system.runInterval(() => {
    try {
      tick();
    } catch (e) {
      console.warn(`[Po] tick: ${e}`);
    }
  }, 10);
  system.runInterval(() => {
    try {
      periodic();
    } catch (e) {
      console.warn(`[Po] periodic: ${e}`);
    }
  }, 20);
  system.runInterval(() => {
    try {
      cleanup();
    } catch (e) {
      console.warn(`[Po] cleanup: ${e}`);
    }
  }, 40);
  system.runInterval(() => {
    try {
      tickTasks();
    } catch (e) {
      console.warn(`[Po] tasks: ${e}`);
    }
  }, 1);
  system.runInterval(() => {
    try {
      furnaces();
    } catch (e) {
      console.warn(`[Po] furnace: ${e}`);
    }
  }, 20);
  startArmorRefresh(() =>
    world
      .getPlayers()
      .map((owner) => ({ owner, data: dataOf(owner) }))
      .filter(({ data }) => !!getPo(data)),
  );
});

/** Po's furnace keeps working while Po is around. */
function furnaces() {
  for (const owner of world.getPlayers()) {
    const data = dataOf(owner);
    if (!getPo(data) || data.smelt.jobs.length === 0) continue;
    const events = Smelt.step(data.smelt, data.bag, data.settings.fast ? 40 : 20);
    if (events.length === 0) continue;
    touch(owner.id);
    for (const ev of events) {
      const job = ev.job;
      if (!job) continue;
      if (ev.type === "item") {
        try {
          owner.onScreenDisplay.setActionBar(`§6${data.name}:§r เผา${itemTh(job.in)} ${job.done}/${job.total}`);
        } catch {}
      } else if (ev.type === "finished") {
        poSayText(owner, data, `เผาเสร็จแล้ว! ได้${itemTh(job.out)} ${job.total}`);
        autoGear(owner, data, { quiet: false, reserve: activeReserve(owner.id) });
      } else if (ev.type === "nofuel" && ready(`nofuel:${owner.id}`, 120)) {
        poSayText(owner, data, "เตาผมเชื้อเพลิงหมดแล้ว ขอถ่านหรือไม้หน่อย (ฝากของได้เลย)");
      } else if (ev.type === "nofurnace" && ready(`nofurnace:${owner.id}`, 120)) {
        poSayText(owner, data, "ผมไม่มีเตาเผา ขอหินกรวด 8 ก้อนหน่อยนะ");
      }
    }
  }
}

subscribe();
