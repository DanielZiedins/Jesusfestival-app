/**
 * The Light Hunt tokens are printed on physical posters and taped around Gage
 * Park. The service worker has to precache every station page, because a scan
 * is the one navigation guaranteed to happen on a dead network to a URL the
 * phone has never visited.
 *
 * sw.js is a static file and cannot import lib/hunt.ts, so the list is
 * duplicated. This fails the build if the two ever disagree.
 */
import { readFileSync } from "node:fs";

const huntSrc = readFileSync(new URL("../lib/hunt.ts", import.meta.url), "utf8");
const swSrc = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");

const stationsBlock = huntSrc.slice(
  huntSrc.indexOf("export const STATIONS"),
  huntSrc.indexOf("export const RETIRED_TOKENS")
);
const tokens = [...stationsBlock.matchAll(/token:\s*"([a-z0-9]+)"/g)].map((m) => m[1]);

if (tokens.length === 0) {
  console.error("check-sw-hunt: parsed no tokens out of lib/hunt.ts — the parser is stale.");
  process.exit(1);
}

const shell = swSrc.slice(swSrc.indexOf("const APP_SHELL"), swSrc.indexOf("self.addEventListener"));
const cached = new Set([...shell.matchAll(/"\/hunt\/([a-z0-9]+)"/g)].map((m) => m[1]));

const missing = tokens.filter((t) => !cached.has(t));
const extra = [...cached].filter((t) => !tokens.includes(t));

if (missing.length || extra.length) {
  console.error("\ncheck-sw-hunt: public/sw.js APP_SHELL is out of step with lib/hunt.ts\n");
  if (missing.length) {
    console.error(`  missing from the service worker (these scans would fail offline):`);
    for (const t of missing) console.error(`    /hunt/${t}`);
  }
  if (extra.length) {
    console.error(`  no longer a station (remove from the service worker):`);
    for (const t of extra) console.error(`    /hunt/${t}`);
  }
  console.error("");
  process.exit(1);
}

console.log(`check-sw-hunt: all ${tokens.length} Light Hunt stations are precached.`);
