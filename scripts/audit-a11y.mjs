/**
 * Accessibility audit: axe-core WCAG 2.2 AA, then pixel-sampled contrast for
 * everything axe can't judge.
 *
 *   npm run audit:a11y                      # core pages on production
 *   npm run audit:a11y -- /hunt /prayer     # specific pages
 *   BASE=http://localhost:3210 npm run audit:a11y
 *
 * Why two passes: axe files text over photos and gradients under
 * "incomplete", and every score counts that as a pass. Here that was 166
 * nodes, hiding real failures. Each one is re-measured against the actual
 * pixels behind it.
 *
 * The pixel pass removes these traps that each produced fake ratios:
 *   - overlays (splash, install banner, first-visit game intro) sampled
 *     instead of the page
 *   - screenshot clips are document-relative: viewport coordinates without
 *     the scroll offset sample the wrong place for anything below the fold
 *   - scroll-linked effects (the hero fades as you scroll) sampled mid-fade:
 *     anything already on screen is measured without scrolling
 *   - gradient-clipped text, which keeps painting through color:transparent
 *   - rounded boxes, whose corners show the page behind a badge
 *   - fixed chrome (the tab bar) passing over footer links mid-capture
 *   - captureBeyondViewport, which resizes 100vh heroes and shifts coordinates
 * Colours are resolved by painting them on a canvas, so oklch/color-mix can't
 * be misread. Still eyeball every pixel failure before acting on it.
 *
 * Exits 1 if anything fails, so it can gate a deploy.
 */
import puppeteer from "puppeteer-core";
import { PNG } from "pngjs";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axeSrc = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const BASE = process.env.BASE || "https://www.jesusfestival.app";
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["/", "/schedule", "/hunt", "/prayer", "/news", "/photos", "/map", "/i-said-yes", "/revive-the-city", "/jesus-festival-2027", "/blog", "/partner",
     "/bring-a-group", "/day-of", "/festival-weekend", "/find-your-moments", "/getting-to-gage-park", "/before-you-go", "/what-to-bring",
     "/blog/hamilton-evangelism-impact-partner-with-e3-canada"];

const lum = ([r, g, b]) => {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox"] });
let failures = 0;

for (const path of PAGES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => {
    try {
      sessionStorage.setItem("jf-splash-seen", "yes");
      sessionStorage.setItem("jf-install-dismissed", "1");
      // First-visit intros cover the whole page and would be sampled instead.
      localStorage.setItem("jf-game-intro", "done");
    } catch {
      /* ignore */
    }
  });
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 120)));
  try {
    await page.goto(BASE + path, { waitUntil: "networkidle0", timeout: 90000 });
  } catch (e) {
    // One unreachable page shouldn't abort the whole audit.
    failures += 1;
    console.log(`\n✗ ${path}  — could not load: ${String(e).slice(0, 100)}`);
    await page.close();
    continue;
  }
  // Walk the page so viewport-gated content mounts, then return to the top.
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.scrollBy(0, 700));
    await new Promise((r) => setTimeout(r, 120));
  }
  await new Promise((r) => setTimeout(r, 1200));
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.addScriptTag({ content: axeSrc });

  const axeResult = await page.evaluate(async () => {
    const res = await axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] },
    });
    return {
      checked: res.passes.reduce((n, p) => n + p.nodes.length, 0),
      violations: res.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes[0]?.target?.[0] })),
      undecided: [...new Set(res.incomplete.filter((v) => v.id === "color-contrast").flatMap((v) => v.nodes.map((n) => n.target[0])))],
    };
  });

  const pixelFails = [];
  for (const sel of axeResult.undecided) {
    const info = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      window.scrollTo(0, 0);
      if (el.getBoundingClientRect().bottom > innerHeight) el.scrollIntoView({ block: "center", behavior: "instant" });
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > innerHeight) return null;
      const cs = getComputedStyle(el);
      if (cs.webkitBackgroundClip === "text" || cs.backgroundClip === "text") return null;
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      const x = c.getContext("2d");
      // SVG text paints with fill/fill-opacity, not color.
      const svg = el instanceof SVGElement;
      x.fillStyle = svg ? cs.fill : cs.color;
      x.fillRect(0, 0, 1, 1);
      const [R, G, B, A] = x.getImageData(0, 0, 1, 1).data;
      let op = svg ? parseFloat(cs.fillOpacity || "1") : 1;
      for (let n = el; n; n = n.parentElement) op *= parseFloat(getComputedStyle(n).opacity || "1");
      const size = parseFloat(cs.fontSize);
      // A rounded box's corners show whatever is behind it (a circular badge on
      // a dark page "failed" at 1.01 from its corners alone). Inset past the
      // curve: 1 - 1/sqrt(2) of the radius clears it.
      const rad = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, r.width / 2, r.height / 2);
      const inset = Math.ceil(rad * 0.3);
      return {
        // Puppeteer's screenshot clip is measured from the top of the
        // DOCUMENT, not the viewport — without the scroll offset, every element
        // below the fold was sampled from the wrong place (caught when a card
        // "failed" while the capture showed the card above it).
        box: { x: Math.max(0, r.left) + scrollX + inset, y: Math.max(0, r.top) + scrollY + inset, w: Math.min(r.width, innerWidth - r.left) - 2 * inset, h: Math.min(r.height, innerHeight - r.top) - 2 * inset },
        rgba: [R, G, B, (A / 255) * op],
        large: size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700),
        text: el.textContent.trim().slice(0, 50),
      };
    }, sel);
    if (!info || info.box.w < 2 || info.box.h < 2) continue;
    // Fully transparent glyphs are hidden on purpose (an unticked checklist ✓),
    // not faint — they'd "fail" at 1.00.
    if (info.rgba[3] < 0.05) continue;

    // Hide the text (and any gradient-clipped descendants), sample what's behind.
    await page.evaluate((sel) => {
      const hide = (n) => {
        n.style.setProperty("color", "transparent", "important");
        n.style.setProperty("-webkit-text-fill-color", "transparent", "important");
        n.style.setProperty("text-shadow", "none", "important");
        if (n instanceof SVGElement) n.style.setProperty("fill-opacity", "0", "important");
        const c = getComputedStyle(n);
        if (c.webkitBackgroundClip === "text" || c.backgroundClip === "text") n.style.setProperty("background-image", "none", "important");
      };
      const el = document.querySelector(sel);
      // Fixed chrome (tab bar, floating buttons) passing over the element would
      // be sampled instead of its real background. Sticky stays: it's content.
      document.querySelectorAll("body *").forEach((n) => {
        if (!n.contains(el) && getComputedStyle(n).position === "fixed") {
          n.dataset.auditFixed = n.style.visibility || "-";
          n.style.visibility = "hidden";
        }
      });
      el.dataset.auditStyle = el.getAttribute("style") || "";
      el.querySelectorAll("*").forEach((k) => (k.dataset.auditStyle = k.getAttribute("style") || ""));
      hide(el);
      el.querySelectorAll("*").forEach(hide);
    }, sel);
    await new Promise((r) => setTimeout(r, 250));
    let buf = null;
    try {
      buf = await page.screenshot({ clip: { x: info.box.x, y: info.box.y, width: info.box.w, height: info.box.h }, captureBeyondViewport: false });
    } catch {
      buf = null;
    }
    await page.evaluate((sel) => {
      const restore = (n) => n.setAttribute("style", n.dataset.auditStyle || "");
      const el = document.querySelector(sel);
      restore(el);
      el.querySelectorAll("*").forEach(restore);
      document.querySelectorAll("[data-audit-fixed]").forEach((n) => {
        n.style.visibility = n.dataset.auditFixed === "-" ? "" : n.dataset.auditFixed;
        delete n.dataset.auditFixed;
      });
    }, sel);
    if (!buf) continue;

    const png = PNG.sync.read(buf);
    const [r, g, b, a] = info.rgba;
    const ratios = [];
    for (let i = 0; i < png.data.length; i += 12) {
      const bg = [png.data[i], png.data[i + 1], png.data[i + 2]];
      ratios.push(ratio([r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a)], bg));
    }
    ratios.sort((p, q) => p - q);
    const worstDecile = ratios[Math.floor(ratios.length * 0.1)] || 0;
    const need = info.large ? 3 : 4.5;
    if (worstDecile < need) pixelFails.push({ ratio: worstDecile, need, text: info.text, sel });
  }

  const bad = axeResult.violations.length + pixelFails.length + pageErrors.length;
  failures += bad;
  console.log(`\n${bad ? "✗" : "✓"} ${path}  — axe checked ${axeResult.checked} nodes; ${axeResult.undecided.length} pixel-sampled`);
  for (const v of axeResult.violations) console.log(`    axe ${v.id} [${v.impact}] ×${v.n}  ${v.ex}`);
  for (const f of pixelFails) console.log(`    pixel ${f.ratio.toFixed(2)} < ${f.need}  "${f.text}"  ${f.sel.slice(0, 80)}`);
  for (const e of pageErrors) console.log(`    page error: ${e}`);
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} issue(s). Eyeball pixel findings before acting — see the header comment.` : "\nAll clean.");
process.exit(failures ? 1 : 0);
