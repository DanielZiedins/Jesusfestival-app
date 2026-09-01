/**
 * Festival-day rehearsal, runnable any day of the year: renders the REAL
 * HomeScreen under jsdom at four clock overrides and asserts what each moment
 * of the weekend must show — countdown before, the live Now/Next card during,
 * and the harvest card after (never the stale "It's festival weekend!").
 *
 *   npm run rehearse
 *
 * This exists because the UI layer around festivalPhase() broke twice in ways
 * a type-check can't see. Needs devDependencies: jsdom, esbuild.
 */
import { build } from "esbuild";
import { JSDOM } from "jsdom";

const APP = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
await build({
  entryPoints: [`${APP}/components/screens/HomeScreen.tsx`],
  bundle: true, format: "esm", platform: "browser",
  outfile: `${APP}/node_modules/.cache/jf-rehearse/homescreen.bundle.mjs`,
  alias: { "@": APP, "next/image": `${APP}/scripts/stubs/next-image.js`, "next/link": `${APP}/scripts/stubs/next-link.js`, "next/dynamic": `${APP}/scripts/stubs/next-dynamic.js` },
  external: ["react", "react-dom", "framer-motion"],
  jsx: "automatic",
  logLevel: "error",
});

const CASES = [
  ["2026-08-30T12:00:00-04:00", "before",  t => t.includes("The countdown is on") && !t.includes("Thank you, Hamilton") && !t.includes("Live now")],
  ["2026-09-05T18:35:00-04:00", "sat-live", t => t.includes("Live now") && t.includes("Friday Night Prayer — Set 2") && t.includes("Final Prayer — Daniel & Katie") && !t.includes("Thank you, Hamilton")],
  ["2026-09-07T10:00:00-04:00", "after",   t => t.includes("Thank you, Hamilton") && t.includes("What a weekend. Now it begins.") && t.includes("I said yes — what now?") && t.includes("Relive it") && t.includes("Get connected") && !t.includes("Live now") && !t.includes("It's festival weekend")],
];

let failures = 0;
for (const [iso, label, check] of CASES) {
  const dom = new JSDOM(`<!doctype html><html><body><div id="root"></div></body></html>`, {
    url: `http://localhost/?now=${encodeURIComponent(iso)}`, pretendToBeVisual: true,
  });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
  globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  globalThis.IntersectionObserver = dom.window.IntersectionObserver || class { observe(){} unobserve(){} disconnect(){} };
  // jsdom's matchMedia lacks the legacy addListener API framer still calls.
  const mm = () => ({ matches: false, media: "", addEventListener(){}, removeEventListener(){}, addListener(){}, removeListener(){}, onchange: null, dispatchEvent: () => false });
  globalThis.matchMedia = mm;
  dom.window.matchMedia = mm;
  for (const cls of ["SVGElement", "HTMLElement", "Element", "Node", "getComputedStyle", "AbortController", "AbortSignal", "Event", "EventTarget", "CustomEvent"]) {
    if (dom.window[cls] !== undefined) globalThis[cls] = dom.window[cls];
  }
  globalThis.fetch = () => new Promise(() => {}); // network never answers in rehearsal
  dom.window.fetch = globalThis.fetch;

  const React = (await import("react")).default;
  const { createRoot } = await import("react-dom/client");
  const { act } = await import("react");
  const mod = await import(`${APP}/node_modules/.cache/jf-rehearse/homescreen.bundle.mjs?` + label);
  const HomeScreen = mod.default;

  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(dom.window.document.getElementById("root"));
  let err = null;
  try {
    await act(async () => { root.render(React.createElement(HomeScreen, { go: () => {} })); });
  } catch (e) { err = e; }
  const text = dom.window.document.body.textContent;
  const ok = !err && check(text);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label.padEnd(9)}${err ? " render error: " + String(err).slice(0, 120) : ""}`);
  if (!ok && !err) {
    console.log("   countdown:", text.includes("The countdown is on"), "| live:", text.includes("Live now"), "| after:", text.includes("Thank you, Hamilton"), "| celebration:", text.includes("It's festival weekend"));
  }
  try { await act(async () => root.unmount()); } catch {}
}
process.exit(failures ? 1 : 0);
