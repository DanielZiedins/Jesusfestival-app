"use client";

import { supabase } from "./supabase";

export const PUSH_PUBLIC_KEY = "BMqoHxNI9foGRVWQVSFAlEzHvnueYS12Bkm_Y_CPtlbZtqSqc-JeLPDeZgMCkmcST_h-NsqBC8bbgDwrFeBbxaI";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vmpkiwfvnlzraabtjkig.supabase.co";
const PUBLISHABLE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_uHfm0bHa-qmm0EJOr2F8tA_iid43Ru-";
const EDGE_URL = `${SUPABASE_URL}/functions/v1/revive-push`;

export function pushSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export async function subscribeToPush(): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!pushSupported()) return { ok: false, error: "This device doesn't support notifications." };
    const perm = await Notification.requestPermission();
    if (perm !== "granted") return { ok: false, error: "Notifications were not allowed." };
    // serviceWorker.ready never settles if registration failed — race a timeout
    // so the button can't hang forever with no feedback.
    const reg = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 6000)),
    ]);
    if (!reg) return { ok: false, error: "Notifications aren't available right now — try reloading the app." };
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUSH_PUBLIC_KEY) as BufferSource,
      });
    }
    const json = sub.toJSON() as { endpoint?: string };
    // Only report success if the subscription actually stored server-side.
    const { error } = await supabase.from("revive_push_subs").upsert({ endpoint: json.endpoint, sub: json }, { onConflict: "endpoint" });
    if (error) return { ok: false, error: "Couldn't save your subscription — check your connection and try again." };
    try {
      localStorage.setItem("jf-push", "1");
    } catch {
      /* ignore */
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong." };
  }
}

export function pushEnabled(): boolean {
  try {
    return typeof Notification !== "undefined" && Notification.permission === "granted" && localStorage.getItem("jf-push") === "1";
  } catch {
    return false;
  }
}

// Fire-and-forget milestone push (server verifies progress + dedupes globally).
export function notifyMilestone(pct: number): void {
  try {
    fetch(EDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: PUBLISHABLE, Authorization: `Bearer ${PUBLISHABLE}` },
      body: JSON.stringify({ mode: "milestone", pct }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

export async function adminSendPush(passcode: string, title: string, body: string): Promise<{ ok: boolean; sent?: number; error?: string }> {
  try {
    const res = await fetch(EDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: PUBLISHABLE, Authorization: `Bearer ${PUBLISHABLE}` },
      body: JSON.stringify({ mode: "admin", passcode, title, body }),
    });
    const data = await res.json();
    if (!data.ok) return { ok: false, error: data.error || "Failed to send." };
    return { ok: true, sent: data.sent };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to send." };
  }
}
