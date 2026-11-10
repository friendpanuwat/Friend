// Understanding what the player types to Po (Thai or simple English) and answering.
import { world, system } from "@minecraft/server";
import { dataOf, touch } from "./store.js";
import { getPo, poSay, poSayText, setMode, bring, guide, summon, setEmote, EMOTE, MODE_TH } from "./po.js";
import * as Bag from "./bag.js";
import { findItemWord, findNumber, itemTh, FOOD_HEAL } from "./names.js";
import { answer } from "./knowledge.js";
import { notice } from "./speech.js";
import { clockText, hearts, posText } from "./util.js";

/** @typedef {import("@minecraft/server").Player} Player */
/** @typedef {import("./store.js").PoData} PoData */
/** @typedef {{ player: Player, data: PoData, text: string, raw: string }} Ctx */

const QUESTION = /(ยังไง|อย่างไร|ไง|ที่ไหน|ตรงไหน|ชั้นไหน|อะไร|ไหม|มั้ย|เท่าไร|เท่าไหร่|กี่|\?|how|where|what|ทำไม|วิธี)/;

/** @param {string} raw */
function normalise(raw) {
  return raw
    .toLowerCase()
    .replace(/^\s*(po|โป|โพ|ปอ)\s*[,:!]?\s*/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Intents in priority order. `cmd` intents are skipped when the text is a question
 * (so "ขุดเพชรชั้นไหน" gets an answer instead of an order).
 * @type {{ name: string, re: RegExp, cmd?: boolean, run: (c: Ctx) => void }[]}
 */
const INTENTS = [
  { name: "rescue", re: /(ช่วยด้วย|ช่วยที|ช่วยหน่อย|help me)/, run: rescue },
  { name: "no_fight", re: /(ไม่ต้อง|อย่า|หยุด|เลิก)\s*(สู้|คุ้มกัน|ตี|ฆ่า|ไล่)/, run: (c) => calmDown(c) },
  { name: "no_follow", re: /(ไม่ต้อง|อย่า|เลิก)\s*(ตาม|มา)/, run: (c) => mode(c, "stay") },
  { name: "have", re: /มี.*(ไหม|มั้ย|หรือเปล่า|รึเปล่า|ป่าว|กี่)/, run: have },
  { name: "return_all", re: /(คืนของ|ของคืน|คืนทั้งหมด|ส่งของคืน|เอาของทั้งหมด)/, run: returnAll },
  { name: "deposit", re: /(ฝาก|เก็บไว้|เอาไปเก็บ|รับไว้)/, cmd: true, run: deposit },
  { name: "give", re: /(ขอ(?!บ|โทษ|ให้)|เอา.*มา|ส่ง.*มา|ส่ง.*ให้|give)/, run: give },
  { name: "bag", re: /(กระเป๋า|มีของอะไร|มีอะไรบ้าง|ของในตัว|inventory|bag)/, run: showBag },
  { name: "home", re: /(บ้าน.*(ไหน|ทาง|ไกล)|ทางกลับบ้าน|กลับบ้าน|พาไปบ้าน|นำทาง|home)/, run: home },
  { name: "death", re: /(ตาย.*(ไหน|ตรงไหน)|ของตก|จุดที่ตาย|ศพ)/, run: deathSpot },
  { name: "memory", re: /(เคย.*เจอ|เจอ.*ที่ไหน|จำ.*ได้|ความจำ|จำอะไร)/, run: memory },
  { name: "stats", re: /(กี่วัน|สถิติ|ฆ่าไปกี่|ฆ่ากี่|เล่นด้วยกัน|รู้จักกัน)/, run: stats },
  { name: "chop", re: /(ตัดไม้|ตัดต้นไม้|หาไม้|โค่น)/, cmd: true, run: (c) => later(c, "ตัดไม้ตามชนิดที่สั่ง") },
  { name: "mine", re: /(ขุด|หาแร่|หาเพชร|หาเหล็ก|หาถ่าน|หาทอง)/, cmd: true, run: (c) => later(c, "ขุดแร่ตามชนิดที่สั่ง") },
  { name: "craft", re: /(คราฟ|ทำ.*ให้|ทำดาบ|ทำอีเต้อ|ทำเครื่องมือ)/, cmd: true, run: (c) => later(c, "คราฟต์อุปกรณ์") },
  { name: "smelt", re: /(เผา|ย่าง|หลอม)/, cmd: true, run: (c) => later(c, "เผาแร่และทำอาหาร") },
  { name: "build", re: /(สร้างบ้าน|สร้าง)/, cmd: true, run: (c) => later(c, "สร้างบ้าน") },
  { name: "farm", re: /(ทำฟาร์ม|เก็บเกี่ยว|ปลูก)/, cmd: true, run: (c) => later(c, "ทำฟาร์ม") },
  { name: "come", re: /(มาหา|มานี่|มาตรงนี้|วาร์ป|มาเร็ว|^มา$|come|tp)/, run: come },
  { name: "follow", re: /(ตาม(?!หา)|ไปด้วยกัน|ไปกัน|follow)/, cmd: true, run: (c) => mode(c, "follow") },
  { name: "guard", re: /(คุ้มกัน|ปกป้อง|ป้องกัน|บอดี้การ์ด|การ์ด|สู้|ลุย|ฆ่ามอน|guard|protect|fight)/, cmd: true, run: (c) => mode(c, "guard") },
  { name: "stay", re: /(รอ(?!บ|ด)|อยู่ตรงนี้|อยู่นี่|อยู่ที่นี่|หยุด|นั่ง|เฝ้า|stay|wait|sit)/, cmd: true, run: (c) => mode(c, "stay") },
  { name: "dance", re: /(เต้น|ฉลอง|dance)/, run: dance },
  { name: "hungry", re: /หิว/, run: hungry },
  { name: "status", re: /(เลือด|เป็นไง|สบายดี|เหนื่อย|เจ็บไหม|status)/, run: status },
  { name: "time", re: /(กี่โมง|วันที่เท่า|วันที่กี่|เวลา|ตอนนี้กี่)/, run: time },
];

/** @type {{ re: RegExp, key: string, after?: (c: Ctx) => void }[]} */
const CHAT = [
  { re: /(สวัสดี|หวัดดี|ดีจ้า|^ดี$|hello|^hi\b|^hey|เฮ้|ทัก)/, key: "hello", after: (c) => wave(c) },
  { re: /(ขอบคุณ|ขอบใจ|thank|thx|แต๊งกิ้ว)/, key: "thanks" },
  { re: /(ขอโทษ|โทษที|sorry)/, key: "sorry" },
  { re: /(เก่ง|เจ๋ง|สุดยอด|เทพ|ดีมาก|น่ารัก|เท่|ดีเยี่ยม)/, key: "praise", after: (c) => cheer(c) },
  { re: /(รัก|ชอบ\s*(po|โป|นาย)|เพื่อนรัก|เพื่อนซี้)/, key: "love", after: (c) => cheer(c) },
  { re: /(โง่|กาก|ห่วย|เกลียด|น่ารำคาญ|ไร้ประโยชน์)/, key: "insult" },
  { re: /(เป็นใคร|ชื่ออะไร|มาจากไหน|อายุ|ใครสร้าง)/, key: "who" },
  { re: /(บาย|ลาก่อน|ไปละ|ไปก่อน|ฝันดี|นอนก่อน|bye|เลิกเล่น)/, key: "bye", after: (c) => wave(c) },
  { re: /(มุก|ตลก|ขำ|เล่าเรื่อง|joke)/, key: "jokes" },
  { re: /(เศร้า|เหงา|เบื่อ|เซ็ง|ท้อ|เครียด)/, key: "sad" },
];

const HELP =
  "ผมทำได้แบบนี้นะ: \"ตามมา\" \"คุ้มกัน\" \"รอตรงนี้\" \"มาหา\" \"ช่วยด้วย\" " +
  "\"ฝากของ\" (ของที่ถือ) \"ขอขนมปัง 2\" \"คืนของ\" \"กระเป๋า\" " +
  "\"บ้านอยู่ไหน\" \"ตายที่ไหน\" \"จำอะไรได้บ้าง\" \"เต้น\" \"เล่ามุก\" " +
  "หรือถามเรื่องเกม เช่น \"เพชรอยู่ชั้นไหน\" \"ทำเตียงยังไง\"";

/**
 * Player said something to Po.
 * @param {Player} player @param {string} raw
 */
export function handleTalk(player, raw) {
  raw = raw.trim();
  if (!raw) return;
  const data = dataOf(player);
  const text = normalise(raw);
  try {
    player.sendMessage(`§b<${player.name}>§r ${raw}`);
  } catch {}
  data.stats.talks++;
  touch(player.id);
  // a little pause so it feels like Po is thinking
  system.runTimeout(() => {
    if (!player.isValid) return;
    respond({ player, data, text, raw });
  }, 12);
}

/** @param {Ctx} c */
function respond(c) {
  if (!getPo(c.data)) {
    if (/(มา|เรียก|ออกมา|come)/.test(c.text) && Date.now() >= c.data.deadUntil) {
      summon(c.player, c.data.met ? "summon" : "first");
      return;
    }
    const wait = Math.ceil((c.data.deadUntil - Date.now()) / 1000);
    notice(
      c.player,
      wait > 0
        ? `Po กำลังพักฟื้น อีก ${wait} วินาทีค่อยเรียกนะ`
        : "Po ไม่ได้อยู่ใกล้ๆ — ใช้นกหวีด หรือพิมพ์ \"มา\" เพื่อเรียก Po",
    );
    return;
  }
  const isQuestion = QUESTION.test(c.text);

  if (/(ทำอะไรได้|ช่วยอะไรได้|คำสั่ง|วิธีใช้|^help$)/.test(c.text)) {
    poSayText(c.player, c.data, HELP);
    return;
  }
  for (const intent of INTENTS) {
    if (intent.cmd && isQuestion) continue;
    if (intent.re.test(c.text)) {
      intent.run(c);
      return;
    }
  }
  if (isQuestion) {
    const a = answer(c.text);
    if (a) {
      poSayText(c.player, c.data, a);
      return;
    }
  }
  for (const chat of CHAT) {
    if (chat.re.test(c.text)) {
      poSay(c.player, c.data, chat.key);
      chat.after?.(c);
      return;
    }
  }
  const a = answer(c.text);
  if (a) {
    poSayText(c.player, c.data, a);
    return;
  }
  poSay(c.player, c.data, "unknown");
}

// ------------------------------------------------------------------ actions

/** @param {Ctx} c @param {"follow"|"guard"|"stay"} m */
function mode(c, m) {
  setMode(c.player, c.data, m);
}

/** @param {Ctx} c */
function calmDown(c) {
  setMode(c.player, c.data, "follow", true);
  poSayText(c.player, c.data, "ได้ ผมจะไม่ไล่ตีแล้ว แค่เดินตามเฉยๆ (แต่ถ้ามีใครมาทำร้าย ผมสู้กลับนะ)");
}

/** "มีเหล็กไหม" — look in the bag. @param {Ctx} c */
function have(c) {
  const want = findItemWord(c.text);
  if (!want) {
    if (/(ของ|อะไร)/.test(c.text)) return showBag(c);
    const a = answer(c.text);
    if (a) return poSayText(c.player, c.data, a);
    return poSay(c.player, c.data, "unknown");
  }
  const n = Bag.countMatching(c.data.bag, want.match);
  poSayText(c.player, c.data, n > 0 ? `มีสิ! ผมมี${want.word} ${n} ชิ้น พิมพ์ "ขอ${want.word}" ได้เลย` : `ไม่มี${want.word}เลยอะ`);
}

/** @param {Ctx} c */
function come(c) {
  if (bring(c.player, c.data)) poSay(c.player, c.data, "come");
}

/** @param {Ctx} c */
function rescue(c) {
  bring(c.player, c.data);
  setMode(c.player, c.data, "guard", true);
  poSayText(c.player, c.data, `มาแล้ว! ผมจะคุ้มกัน ${c.player.name} เอง ถอยมาข้างหลังผมเลย`);
}

/** @param {Ctx} c @param {string} what */
function later(c, what) {
  poSay(c.player, c.data, "later_skill", { what });
}

/** @param {Ctx} c */
function wave(c) {
  const po = getPo(c.data);
  if (po) setEmote(po, c.data, EMOTE.wave, 50);
}

/** @param {Ctx} c */
function cheer(c) {
  const po = getPo(c.data);
  if (po) setEmote(po, c.data, EMOTE.cheer, 50);
}

/** @param {Ctx} c */
function dance(c) {
  const po = getPo(c.data);
  if (po) setEmote(po, c.data, EMOTE.dance, 100);
  poSay(c.player, c.data, "dance");
}

/** @param {Ctx} c */
function status(c) {
  const po = getPo(c.data);
  const hp = po?.getComponent("minecraft:health");
  const cur = Math.round(hp?.currentValue ?? 0);
  const max = Math.round(hp?.effectiveMax ?? 40);
  const feel = cur >= max * 0.8 ? "สบายมาก!" : cur >= max * 0.4 ? "พอไหวอยู่" : "เจ็บมากเลย ขอของกินหน่อย";
  poSayText(c.player, c.data, `${feel} เลือดผม ${cur}/${max} (${hearts(cur)} หัวใจ) ตอนนี้ผม${MODE_TH[c.data.mode]}อยู่`);
}

/** @param {Ctx} c */
function time(c) {
  poSayText(c.player, c.data, `ตอนนี้ ${clockText()} ของวันที่ ${world.getDay()} ในโลกนี้`);
}

/** @param {Ctx} c */
function stats(c) {
  const s = c.data.stats;
  poSayText(
    c.player,
    c.data,
    `เราเป็นเพื่อนกันมา ${s.days} วันแล้ว! ผมจัดการมอนสเตอร์ไป ${s.kills} ตัว ช่วยชีวิต ${c.player.name} ${s.saves} ครั้ง ได้กินของจาก ${c.player.name} ${s.fed} ครั้ง`,
  );
}

/** @param {Ctx} c */
function home(c) {
  if (!c.data.home) {
    poSayText(c.player, c.data, `ผมยังไม่รู้ว่าบ้าน ${c.player.name} อยู่ไหนเลย ลองนอนบนเตียงสักครั้งนะ ผมจะจำไว้`);
    return;
  }
  guide(c.player, c.data, c.data.home, "บ้าน");
}

/** @param {Ctx} c */
function deathSpot(c) {
  const d = c.data.deathSpot;
  if (!d) {
    poSayText(c.player, c.data, `${c.player.name} ยังไม่เคยตายตั้งแต่ผมมาเลย เก่งมาก!`);
    return;
  }
  guide(c.player, c.data, d, `จุดที่ ${c.player.name} ตายล่าสุด (วันที่ ${d.day}) `);
}

/** @param {Ctx} c */
function memory(c) {
  const finds = c.data.finds.slice(-3).map((f) => `${f.what}ที่ ${posText(f)} (วันที่ ${f.day})`);
  const events = c.data.log.slice(-3).map((e) => `วันที่ ${e.day}: ${e.text}`);
  const parts = [];
  if (finds.length) parts.push(`ของดีที่เคยเจอ: ${finds.join(", ")}`);
  if (events.length) parts.push(`เรื่องล่าสุด: ${events.join(" / ")}`);
  poSayText(c.player, c.data, parts.length ? parts.join(" — ") : "ยังไม่มีเรื่องพิเศษเลย ไปผจญภัยกันเถอะ!");
}

/** @param {Ctx} c */
function showBag(c) {
  const entries = Object.entries(c.data.bag);
  if (entries.length === 0) {
    poSayText(c.player, c.data, "กระเป๋าผมว่างเปล่าเลย ถือของแล้วพิมพ์ \"ฝากของ\" ได้นะ");
    return;
  }
  const list = entries.map(([id, n]) => `${itemTh(id)} ${n}`).join(", ");
  poSayText(c.player, c.data, `ในกระเป๋าผมมี: ${list} (ใช้ไป ${Bag.slotsUsed(c.data.bag)}/${Bag.BAG_SLOTS} ช่อง)`);
}

/** @param {Ctx} c */
function returnAll(c) {
  const entries = Object.entries(c.data.bag);
  if (entries.length === 0) {
    poSayText(c.player, c.data, "ผมไม่มีของอะไรเลยอะ");
    return;
  }
  let total = 0;
  for (const [id, n] of entries) {
    Bag.giveToPlayer(c.player, id, n);
    total += n;
    delete c.data.bag[id];
  }
  touch(c.player.id);
  poSayText(c.player, c.data, `คืนให้หมดแล้ว ${total} ชิ้น!`);
}

/** @param {Ctx} c */
export function deposit(c) {
  const container = c.player.getComponent("minecraft:inventory")?.container;
  const slot = c.player.selectedSlotIndex;
  const item = container?.getItem(slot);
  if (!container || !item) {
    poSayText(c.player, c.data, "ถือของที่จะฝากไว้ในมือก่อนนะ แล้วค่อยบอกผม");
    return;
  }
  const why = Bag.whyNotStorable(item);
  if (why) {
    const reason = {
      special: "อันนี้มีข้อมูลพิเศษอยู่ข้างใน ผมเก็บแล้วจะหาย เก็บไว้เองดีกว่านะ",
      named: "ของที่ตั้งชื่อไว้ เก็บไว้เองดีกว่านะ",
      enchanted: "ของเอนชานต์มีค่ามาก เก็บไว้เองดีกว่า",
      damaged: "ของที่ใช้ไปแล้ว ผมเก็บแล้วความทนทานจะหาย เก็บไว้เองนะ",
    }[why];
    poSayText(c.player, c.data, reason ?? "อันนี้ผมเก็บไม่ได้อะ");
    return;
  }
  const added = Bag.add(c.data.bag, item.typeId, item.amount);
  if (added <= 0) {
    poSayText(c.player, c.data, "กระเป๋าผมเต็มแล้ว! พิมพ์ \"คืนของ\" ก่อนนะ");
    return;
  }
  if (added >= item.amount) container.setItem(slot, undefined);
  else {
    item.amount = item.amount - added;
    container.setItem(slot, item);
  }
  touch(c.player.id);
  poSayText(c.player, c.data, `เก็บ${itemTh(item.typeId)} ${added} ชิ้นไว้ให้แล้ว!`);
}

/** @param {Ctx} c */
function give(c) {
  const want = findItemWord(c.text);
  if (!want) {
    if (/ของ/.test(c.text)) return returnAll(c);
    poSayText(c.player, c.data, "อยากได้อะไรเหรอ ลองพิมพ์ เช่น \"ขอขนมปัง 2\" หรือ \"ขอไม้ 10\"");
    return;
  }
  const ids = Object.keys(c.data.bag).filter(want.match);
  const have = ids.reduce((s, id) => s + (c.data.bag[id] ?? 0), 0);
  if (have === 0) {
    poSayText(c.player, c.data, `ผมไม่มี${want.word}เลยอะ ฝากผมไว้ก่อนได้นะ`);
    return;
  }
  const asked = findNumber(c.text);
  let left = Math.min(have, asked ?? Math.min(have, 16));
  let given = 0;
  for (const id of ids) {
    if (left <= 0) break;
    const got = Bag.take(c.data.bag, id, left);
    Bag.giveToPlayer(c.player, id, got);
    left -= got;
    given += got;
  }
  touch(c.player.id);
  const note = asked !== undefined && asked !== Infinity && given < asked ? ` (ผมมีแค่ ${given} เอง)` : "";
  poSayText(c.player, c.data, `เอาไป! ${want.word} ${given} ชิ้น${note}`);
}

/** @param {Ctx} c */
function hungry(c) {
  const foods = Object.keys(c.data.bag)
    .filter((id) => FOOD_HEAL[id])
    .sort((a, b) => FOOD_HEAL[b] - FOOD_HEAL[a]);
  if (foods.length === 0) {
    poSayText(c.player, c.data, "ผมไม่มีของกินในกระเป๋าเลย... สเต๊กกับหมูย่างอิ่มสุดนะ ลองหาวัวหรือหมูดู");
    return;
  }
  const id = foods[0];
  const got = Bag.take(c.data.bag, id, 3);
  Bag.giveToPlayer(c.player, id, got);
  touch(c.player.id);
  poSayText(c.player, c.data, `เอา${itemTh(id)} ${got} ชิ้นไปกินเลย ${c.player.name}!`);
}

/** Used by the menu too. @param {Player} player */
export function depositHeld(player) {
  const data = dataOf(player);
  deposit({ player, data, text: "", raw: "" });
}

/** For the welcome message after a first summon. */
export const HELP_TEXT = HELP;

