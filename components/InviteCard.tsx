"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { haptic } from "@/lib/game";
import { Share, Check } from "@/components/icons";

// Draws a gorgeous on-brand 1080×1350 "I'll be there" card on a canvas and hands it
// to the native share sheet (falls back to downloading the PNG on desktop).
const W = 1080;
const H = 1350;

async function drawCard(name: string | null): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Older Safari lacks roundRect — fall back to plain rects so the card still draws.
  if (typeof (ctx as CanvasRenderingContext2D & { roundRect?: unknown }).roundRect !== "function") {
    (ctx as unknown as { roundRect: (x: number, y: number, w: number, h: number, r?: number) => void }).roundRect = function (x: number, y: number, w: number, h: number) {
      (this as unknown as CanvasRenderingContext2D).rect(x, y, w, h);
    };
  }

  // --- Night-sky base ---
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#150a2e");
  bg.addColorStop(0.55, "#0b0616");
  bg.addColorStop(1, "#07040f");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Purple + gold aurora blobs
  const blob = (x: number, y: number, r: number, color: string) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  blob(140, 220, 420, "rgba(147,51,234,0.45)");
  blob(960, 380, 380, "rgba(245,166,35,0.28)");
  blob(540, 1240, 500, "rgba(147,51,234,0.25)");

  // Scattered stars
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  const seeds = [83, 211, 349, 467, 599, 733, 877, 941, 1013, 127, 263, 397, 521, 653, 787];
  seeds.forEach((s, i) => {
    const x = (s * 7919) % W;
    const y = ((s * 104729) % 520) + 40;
    const r = (i % 3) + 1;
    ctx.globalAlpha = 0.35 + (i % 5) * 0.13;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // --- Glowing cross ---
  const cx = W / 2;
  const cy = 300;
  blob(cx, cy, 230, "rgba(255,233,168,0.5)");
  ctx.fillStyle = "#FFE9A8";
  ctx.shadowColor = "rgba(245,166,35,0.9)";
  ctx.shadowBlur = 40;
  const bar = 26;
  ctx.beginPath();
  // vertical
  ctx.roundRect(cx - bar / 2, cy - 120, bar, 240, 12);
  // horizontal
  ctx.roundRect(cx - 80, cy - 50, 160, bar, 12);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Rays
  ctx.strokeStyle = "rgba(255,233,168,0.55)";
  ctx.lineWidth = 7;
  ctx.lineCap = "round";
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const r1 = 165;
    const r2 = 195 + (i % 2) * 22;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
    ctx.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2);
    ctx.stroke();
  }

  const center = (text: string, y: number, font: string, color: string, spacing = 0) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    if (spacing > 0) {
      // manual letter-spacing
      const chars = text.split("");
      const widths = chars.map((c) => ctx.measureText(c).width);
      const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
      let x = cx - total / 2;
      ctx.textAlign = "left";
      chars.forEach((c, i) => {
        ctx.fillText(c, x, y);
        x += widths[i] + spacing;
      });
      ctx.textAlign = "center";
    } else {
      ctx.fillText(text, cx, y);
    }
  };

  // --- Headline ---
  center("I'LL BE THERE", 560, "900 44px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", "#c9b8ef", 14);

  // JESUS gradient
  const grad = ctx.createLinearGradient(cx - 300, 0, cx + 300, 0);
  grad.addColorStop(0, "#FFC24D");
  grad.addColorStop(0.5, "#FFE9A8");
  grad.addColorStop(1, "#F5A623");
  ctx.font = "900 170px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.fillStyle = grad;
  ctx.fillText("JESUS", cx, 720);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 118px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  ctx.fillText("FESTIVAL", cx, 838);

  // Divider
  ctx.strokeStyle = "rgba(245,166,35,0.7)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 130, 896);
  ctx.lineTo(cx + 130, 896);
  ctx.stroke();

  center("SEPT 4–5, 2026 · GAGE PARK · HAMILTON", 956, "700 34px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", "#e7e0f5", 4);
  center("Pure Worship Night · Family Festival Day · Free", 1014, "500 30px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", "rgba(231,224,245,0.65)");

  // Personal line
  const first = name && name.trim() ? name.trim().split(/\s+/)[0] : null;
  if (first) {
    // pill
    ctx.font = "700 36px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
    const label = `${first} is going 🎉`;
    const tw = ctx.measureText(label).width;
    ctx.fillStyle = "rgba(245,166,35,0.16)";
    ctx.strokeStyle = "rgba(245,166,35,0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(cx - tw / 2 - 44, 1080, tw + 88, 84, 42);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#FFD173";
    ctx.fillText(label, cx, 1136);
  }

  center("Join me — get the free app", first ? 1234 : 1150, "600 30px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", "rgba(231,224,245,0.75)");
  center("jesusfestival.app", first ? 1288 : 1204, "800 40px -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif", "#F5A623");

  return await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
}

// Generate + share the card. Returns how it went so callers can reward the action.
export async function shareInviteCard(): Promise<"shared" | "downloaded" | null> {
  let name: string | null = null;
  try {
    name = localStorage.getItem("jf-name");
  } catch {
    /* ignore */
  }
  const blob = await drawCard(name);
  if (!blob) return null;
  const file = new File([blob], "jesus-festival-invite.png", { type: "image/png" });
  const text = "I'll be at Jesus Festival — Sept 4–5 at Gage Park, Hamilton! Join me 🙌 https://www.jesusfestival.app";
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({ files: [file], text, title: "Jesus Festival 2026" });
    return "shared";
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jesus-festival-invite.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* ignore */
  }
  return "downloaded";
}

export default function InviteCard() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | "shared" | "downloaded">(null);

  async function makeAndShare() {
    if (busy) return;
    setBusy(true);
    haptic(14);
    try {
      const res = await shareInviteCard();
      if (res) {
        setDone(res);
        haptic(20);
        setTimeout(() => setDone(null), 3500);
      }
    } catch {
      /* user cancelled the share sheet */
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.button
      onClick={makeAndShare}
      whileTap={{ scale: 0.985 }}
      className="group relative block w-full overflow-hidden rounded-3xl border border-gold/35 bg-gradient-to-br from-purple-800/40 via-ink/60 to-ember/20 p-6 text-center"
    >
      <span className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-gold/15 blur-3xl" />
      <span className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-purple-500/20 blur-3xl" />
      <p className="relative text-[11px] font-bold uppercase tracking-[0.26em] text-gold-400">📸 Spread the word</p>
      <h3 className="relative mt-2 font-display text-2xl font-extrabold text-white">Create your invite card</h3>
      <p className="relative mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-white/65">
        One tap makes a beautiful &ldquo;I&apos;ll be there&rdquo; picture with your name — perfect for your story, group chats & feeds.
      </p>
      <span className="relative mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-400 to-gold-600 px-6 py-3 font-display text-sm font-bold text-navy-950 shadow-glow transition group-active:scale-95">
        {done ? <Check width={16} height={16} /> : <Share width={16} height={16} />}
        {busy ? "Creating…" : done === "shared" ? "Shared! 🎉" : done === "downloaded" ? "Saved! Caption copied 📋" : "Make my card"}
      </span>
    </motion.button>
  );
}
