// How Po talks: chat line to the owner + a short speech bubble over his head.
import { system } from "@minecraft/server";
import { LINES } from "./lines.js";
import { fill, pick } from "./util.js";

/** @type {Map<string, number>} cooldown key -> time (ms) when allowed again */
const cooldowns = new Map();
/** @type {Map<string, number>} entity id -> bubble token */
const bubbleToken = new Map();

/**
 * True (and starts the cooldown) if this key has not been used recently.
 * @param {string} key @param {number} seconds
 */
export function ready(key, seconds) {
  const now = Date.now();
  const until = cooldowns.get(key) ?? 0;
  if (now < until) return false;
  cooldowns.set(key, now + seconds * 1000);
  return true;
}

/**
 * A random line from the bank with placeholders filled.
 * @param {string} key @param {Record<string, string|number>} vars
 */
export function line(key, vars) {
  const options = LINES[key];
  if (!options || options.length === 0) return "";
  return fill(pick(options), vars);
}

/**
 * Po says something to one player.
 * @param {import("@minecraft/server").Entity | undefined} po
 * @param {import("@minecraft/server").Player} player
 * @param {string} name Po's name
 * @param {string} text
 */
export function say(po, player, name, text) {
  if (!text) return;
  try {
    player.sendMessage(`§6<${name}>§r ${text}`);
  } catch {}
  if (po) bubble(po, name, text);
}

/**
 * Show a short line above Po's head for a few seconds.
 * @param {import("@minecraft/server").Entity} po @param {string} name @param {string} text
 */
export function bubble(po, name, text) {
  const short = text.length > 26 ? text.slice(0, 25) + "…" : text;
  const token = (bubbleToken.get(po.id) ?? 0) + 1;
  bubbleToken.set(po.id, token);
  try {
    po.nameTag = `${name}\n§e${short}`;
  } catch {
    return;
  }
  system.runTimeout(() => {
    if (bubbleToken.get(po.id) !== token) return;
    try {
      if (po.isValid) po.nameTag = name;
    } catch {}
  }, 80);
}

/** System-style notice (not Po speaking). @param {import("@minecraft/server").Player} player @param {string} text */
export function notice(player, text) {
  try {
    player.sendMessage(`§7${text}`);
  } catch {}
}
