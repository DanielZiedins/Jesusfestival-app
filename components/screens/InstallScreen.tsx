"use client";

import { useEffect, useState } from "react";
import ScreenHeader from "@/components/ScreenHeader";
import Reveal from "@/components/Reveal";
import { Download, Share, Check } from "@/components/icons";

type Platform = "ios" | "android" | "desktop";

export default function InstallScreen() {
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (/iphone|ipad|ipod/i.test(ua)) setPlatform("ios");
    else if (/android/i.test(ua)) setPlatform("android");
    else setPlatform("desktop");
    setInstalled(window.matchMedia?.("(display-mode: standalone)")?.matches || (navigator as { standalone?: boolean }).standalone === true);
  }, []);

  const steps: Record<Platform, { icon: string; text: string }[]> = {
    ios: [
      { icon: "1", text: "Open JesusFestival.App in Safari" },
      { icon: "2", text: "Tap the Share button (the square with an arrow) at the bottom" },
      { icon: "3", text: "Scroll down and tap “Add to Home Screen”" },
      { icon: "4", text: "Tap “Add” — the Jesus Festival icon appears on your home screen! 🎉" },
    ],
    android: [
      { icon: "1", text: "Open JesusFestival.App in Chrome" },
      { icon: "2", text: "Tap the ⋮ menu (top right)" },
      { icon: "3", text: "Tap “Install app” or “Add to Home screen”" },
      { icon: "4", text: "Confirm — it installs like a real app! 🎉" },
    ],
    desktop: [
      { icon: "1", text: "Open JesusFestival.App in Chrome or Edge" },
      { icon: "2", text: "Click the install icon (⤓) in the address bar" },
      { icon: "3", text: "Click “Install” — it opens in its own window! 🎉" },
    ],
  };

  return (
    <div className="px-4 pb-6">
      <ScreenHeader
        eyebrow="Take it with you"
        title="Add to Home Screen"
        subtitle="Install Jesus Festival like a real app — full-screen, fast, and ready for notifications."
        icon={<Download width={22} height={22} />}
      />

      {installed ? (
        <Reveal>
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/20 text-emerald-200">
              <Check width={20} height={20} />
            </span>
            <p className="text-sm font-semibold text-white">You&apos;re all set — the app is installed! 🙌</p>
          </div>
        </Reveal>
      ) : (
        <>
          {/* platform switch */}
          <Reveal className="mb-4">
            <div className="glass grid grid-cols-3 gap-1 rounded-2xl p-1">
              {(["ios", "android", "desktop"] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`rounded-xl py-2 text-center text-sm font-bold capitalize transition ${platform === p ? "bg-gradient-to-b from-gold-400 to-gold-600 text-navy-950" : "text-white/60"}`}
                >
                  {p === "ios" ? "iPhone" : p}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gold-400">
                {platform === "ios" ? <Share width={18} height={18} /> : <Download width={18} height={18} />}
                {platform === "ios" ? "On iPhone / iPad (Safari)" : platform === "android" ? "On Android (Chrome)" : "On desktop"}
              </div>
              <div className="space-y-2.5">
                {steps[platform].map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-purple-600/30 text-xs font-bold text-purple-200">{s.icon}</span>
                    <p className="pt-0.5 text-sm leading-snug text-white/80">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </>
      )}

      <Reveal className="mt-4">
        <div className="rounded-2xl border border-purple-400/25 bg-purple-500/10 p-4">
          <p className="text-sm font-semibold text-white">🔔 Why install?</p>
          <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-white/70">
            <li>• Get important notifications — artist reveals, schedule drops & surprises</li>
            <li>• Milestone moments as the community revives the city</li>
            <li>• Opens full-screen &amp; loads instantly, even offline</li>
            <li>• One tap from your home screen — no app store needed</li>
          </ul>
          <p className="mt-3 text-[11px] leading-relaxed text-white/45">
            On iPhone, notifications work once the app is added to your Home Screen.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
