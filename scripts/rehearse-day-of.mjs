/**
 * Rehearse the compact Day-Of Mode across every festival phase. This catches
 * stale schedule assumptions and the easy-to-miss overnight Friday→Saturday
 * handoff without waiting for the real weekend clock.
 */
import { build } from "esbuild";
import { JSDOM } from "jsdom";

const APP = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
await build({
  entryPoints: [`${APP}/components/FestivalDayMode.tsx`],
  bundle: true,
  format: "esm",
  platform: "browser",
  outfile: `${APP}/node_modules/.cache/jf-rehearse/day-of.bundle.mjs`,
  alias: { "@": APP, "next/link": `${APP}/scripts/stubs/next-link.js` },
  external: ["react", "react-dom"],
  jsx: "automatic",
  logLevel: "error",
});

const CASES = [
  ["2026-09-03T12:00:00-04:00", "before", (text) => text.includes("until Gage Park opens") && !text.includes("Live ·")],
  ["2026-09-04T22:15:00-04:00", "between", (text) => text.includes("until Saturday opens") && text.includes("Saturday activities open at 10 AM")],
  ["2026-09-05T18:35:00-04:00", "sat-live", (text) => text.includes("Friday Night Prayer — Set 2") && text.includes("7:00 PM · Final Prayer — Daniel & Katie")],
  ["2026-09-07T10:00:00-04:00", "after", (text) => text.includes("Thank you, Hamilton") && text.includes("The movement continues")],
];

let failures = 0;
for (const [iso, label, check] of CASES) {
  const dom = new JSDOM("<!doctype html><html><body><div id=\"root\"></div></body></html>", {
    url: `http://localhost/day-of?now=${encodeURIComponent(iso)}`,
    pretendToBeVisual: true,
  });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
  globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
  for (const cls of ["HTMLElement", "Element", "Node", "AbortController", "AbortSignal", "Event", "EventTarget", "CustomEvent", "DOMException"]) {
    if (dom.window[cls] !== undefined) globalThis[cls] = dom.window[cls];
  }

  const React = (await import("react")).default;
  const { createRoot } = await import("react-dom/client");
  const { act } = await import("react");
  const { default: FestivalDayMode } = await import(`${APP}/node_modules/.cache/jf-rehearse/day-of.bundle.mjs?${label}`);
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const root = createRoot(dom.window.document.getElementById("root"));
  let error = null;
  try {
    await act(async () => root.render(React.createElement(FestivalDayMode)));
  } catch (caught) {
    error = caught;
  }
  const text = dom.window.document.body.textContent ?? "";
  const ok = !error && check(text);
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  day-of ${label.padEnd(8)}${error ? ` render error: ${String(error).slice(0, 120)}` : ""}`);
  try { await act(async () => root.unmount()); } catch {}
}

process.exit(failures ? 1 : 0);
