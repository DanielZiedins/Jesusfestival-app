"use client";

import { STATIONS, type Badge } from "@/lib/hunt";

/**
 * Draws a shareable badge image. Every badge produces a real picture someone
 * can post — that's the whole reward, so it has to look like something worth
 * putting on a story.
 */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function hexToRgba(hex: string, a: number) {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

async function draw(badge: Badge, name: string | null, found: number): Promise<Blob | null> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#12081F");
  bg.addColorStop(0.55, "#1B0F2E");
  bg.addColorStop(1, "#2A1206");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = (x: number, y: number, r: number, colour: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, colour);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  glow(150, 210, 430, "rgba(147,51,234,0.40)");
  glow(940, 1130, 470, hexToRgba(badge.accent, 0.32));

  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (let i = 0; i < 80; i++) {
    const x = (i * 977) % W;
    const y = (i * 613) % (H * 0.7);
    ctx.globalAlpha = 0.14 + ((i * 37) % 60) / 170;
    ctx.beginPath();
    ctx.arc(x, y, ((i * 13) % 3) + 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = "center";

  // Medallion
  const cx = W / 2;
  const cy = 330;
  // A soft ring of light OUTSIDE the disc, then a dark disc on top. Glowing
  // behind a pale emoji washed it out — pale-on-bright has no contrast.
  glow(cx, cy, 235, hexToRgba(badge.accent, 0.34));
  ctx.beginPath();
  ctx.arc(cx, cy, 150, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(9,4,16,0.82)";
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = hexToRgba(badge.accent, 0.85);
  ctx.stroke();

  ctx.font = "140px system-ui, 'Apple Color Emoji', sans-serif";
  ctx.fillText(badge.emoji, cx, cy + 52);

  // Eyebrow
  ctx.fillStyle = badge.accent;
  ctx.font = "800 28px 'Space Grotesk', system-ui, sans-serif";
  ctx.letterSpacing = "8px";
  ctx.fillText("BADGE UNLOCKED", cx, 560);
  ctx.letterSpacing = "0px";

  // Name
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 88px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText(badge.name, cx, 660);

  // Blurb, wrapped
  ctx.fillStyle = "rgba(255,255,255,0.78)";
  ctx.font = "400 38px Inter, system-ui, sans-serif";
  const words = badge.blurb.split(" ");
  let line = "";
  let y = 730;
  for (const w of words) {
    const trial = `${line} ${w}`.trim();
    if (ctx.measureText(trial).width > W - 200) {
      ctx.fillText(line, cx, y);
      y += 52;
      line = w;
    } else line = trial;
  }
  if (line) ctx.fillText(line, cx, y);

  // Name pill
  if (name) {
    const label = `${name} · ${found}/${STATIONS.length} lights`;
    ctx.font = "700 34px Inter, system-ui, sans-serif";
    const w = ctx.measureText(label).width + 68;
    ctx.fillStyle = hexToRgba(badge.accent, 0.18);
    roundRect(ctx, (W - w) / 2, y + 42, w, 74, 37);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(badge.accent, 0.55);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = badge.accent;
    ctx.fillText(label, cx, y + 91);
    y += 116;
  }

  // Lamp row — a visual progress strip
  const lampY = Math.max(y + 96, 1020);
  // Sized from the station count so the strip always fits the card.
  const gap = 12;
  const size = Math.min(74, (W - 120 - (STATIONS.length - 1) * gap) / STATIONS.length);
  const totalW = STATIONS.length * size + (STATIONS.length - 1) * gap;
  let lx = (W - totalW) / 2;
  for (let i = 0; i < STATIONS.length; i++) {
    const on = i < found;
    ctx.fillStyle = on ? hexToRgba(badge.accent, 0.9) : "rgba(255,255,255,0.12)";
    roundRect(ctx, lx, lampY, size, size, size * 0.3);
    ctx.fill();
    lx += size + gap;
  }

  // Footer
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 42px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("THE LIGHT HUNT", cx, H - 132);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "600 29px Inter, system-ui, sans-serif";
  ctx.fillText("Jesus Festival · Gage Park · jesusfestival.app", cx, H - 82);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

export async function shareBadge(badge: Badge, found: number): Promise<"shared" | "downloaded" | null> {
  let name: string | null = null;
  try {
    const raw = localStorage.getItem("jf-name");
    if (raw && raw.trim()) name = raw.trim().split(/\s+/)[0];
  } catch {
    /* ignore */
  }

  const blob = await draw(badge, name, found);
  if (!blob) return null;

  const file = new File([blob], `jesus-festival-${badge.id}.png`, { type: "image/png" });
  const text = `${badge.emoji} ${badge.name} unlocked at Jesus Festival! ${found}/${STATIONS.length} lights found on the Light Hunt. https://www.jesusfestival.app/hunt`;

  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text, title: `${badge.name} — Jesus Festival` });
      return "shared";
    }
  } catch {
    // Cancelled or unsupported — fall through to download.
  }

  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jesus-festival-${badge.id}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    return "downloaded";
  } catch {
    return null;
  }
}
