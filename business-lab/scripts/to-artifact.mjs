// Turns dist-single/index.html into an artifact page body: the publish step adds
// its own <!doctype>/<html>/<head>/<body>, so keep only the contents.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const html = readFileSync("dist-single/index.html", "utf8");
const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] ?? "";
const body = html.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ?? "";
const cleanedHead = head
  .replace(/<meta charset="UTF-8"\s*\/?>/i, "")
  .replace(/<meta name="viewport"[^>]*>/i, "");
const titleMatch = cleanedHead.match(/<title>[\s\S]*?<\/title>/i)?.[0] ?? "";
const restHead = cleanedHead.replace(titleMatch, "");
const out = `${titleMatch}\n${restHead.trim()}\n${body.trim()}\n`;
mkdirSync("dist-artifact", { recursive: true });
writeFileSync("dist-artifact/business-lab.html", out);
console.log(`artifact page: ${(out.length / 1024).toFixed(0)} KB`);
