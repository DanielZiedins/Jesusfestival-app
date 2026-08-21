"use client";

import { STATIONS } from "@/lib/hunt";

/**
 * Draws the Light Bearer badge on a canvas and hands it to the native share
 * sheet — so finishing the hunt produces something a person actually keeps.
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

async function draw(name: string | null): Promise<Blob | null> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Night sky
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#12081F");
  bg.addColorStop(0.55, "#1B0F2E");
  bg.addColorStop(1, "#2A1206");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Ambient glows
  const glow = (x: number, y: number, r: number, colour: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, colour);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  glow(140, 200, 420, "rgba(147,51,234,0.38)");
  glow(950, 1120, 460, "rgba(245,166,35,0.30)");

  // Stars
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (let i = 0; i < 90; i++) {
    const x = (i * 977) % W;
    const y = (i * 613) % (H * 0.72);
    ctx.globalAlpha = 0.15 + ((i * 37) % 60) / 160;
    ctx.beginPath();
    ctx.arc(x, y, ((i * 13) % 3) + 1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  ctx.textAlign = "center";

  // Trophy
  ctx.font = "150px system-ui, 'Apple Color Emoji', sans-serif";
  ctx.fillText("🏆", W / 2, 300);

  // Eyebrow
  ctx.fillStyle = "#F5A623";
  ctx.font = "800 30px 'Space Grotesk', system-ui, sans-serif";
  ctx.letterSpacing = "8px";
  ctx.fillText("LIGHT BEARER", W / 2, 380);
  ctx.letterSpacing = "0px";

  // Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 92px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("All nine lights", W / 2, 500);
  ctx.fillText("found ✨", W / 2, 600);

  // Name pill
  if (name) {
    const label = `${name} carried the light`;
    ctx.font = "700 36px Inter, system-ui, sans-serif";
    const w = ctx.measureText(label).width + 72;
    const x = (W - w) / 2;
    ctx.fillStyle = "rgba(245,166,35,0.16)";
    roundRect(ctx, x, 650, w, 78, 39);
    ctx.fill();
    ctx.strokeStyle = "rgba(245,166,35,0.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#F7C948";
    ctx.fillText(label, W / 2, 702);
  }

  // The nine emoji in a 3×3 grid
  const startY = name ? 810 : 760;
  ctx.font = "76px system-ui, 'Apple Color Emoji', sans-serif";
  STATIONS.forEach((s, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    ctx.fillText(s.emoji, W / 2 - 200 + col * 200, startY + row * 130);
  });

  // Scripture
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "italic 40px Georgia, serif";
  ctx.fillText("“Let your light shine before others.”", W / 2, startY + 460);
  ctx.fillStyle = "#F5A623";
  ctx.font = "800 27px 'Space Grotesk', system-ui, sans-serif";
  ctx.letterSpacing = "5px";
  ctx.fillText("MATTHEW 5:16", W / 2, startY + 512);
  ctx.letterSpacing = "0px";

  // Footer
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 44px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillText("JESUS FESTIVAL", W / 2, H - 118);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = "600 30px Inter, system-ui, sans-serif";
  ctx.fillText("Gage Park · Hamilton · jesusfestival.app", W / 2, H - 66);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

export async function shareLightBearerCard(): Promise<"shared" | "downloaded" | null> {
  let name: string | null = null;
  try {
    const raw = localStorage.getItem("jf-name");
    if (raw && raw.trim()) name = raw.trim().split(/\s+/)[0];
  } catch {
    /* ignore */
  }

  const blob = await draw(name);
  if (!blob) return null;

  const file = new File([blob], "jesus-festival-light-bearer.png", { type: "image/png" });
  const text =
    "I found all nine lights at Jesus Festival 🏆✨ Let your light shine before others. — Matthew 5:16  https://www.jesusfestival.app/hunt";

  try {
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text, title: "Light Bearer — Jesus Festival" });
      return "shared";
    }
  } catch {
    // Cancelled or unsupported — fall through to the download path.
  }

  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jesus-festival-light-bearer.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    return "downloaded";
  } catch {
    return null;
  }
}
