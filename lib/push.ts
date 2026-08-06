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
    // Registers through a SECURITY DEFINER RPC rather than writing the table
    // directly: a plain .upsert() is INSERT ... ON CONFLICT DO UPDATE, which
    // Postgres also requires a SELECT policy for — and adding one would expose
    // every subscriber's push endpoint. This route stores the subscription
    // without granting anyone read access.
    const { error } = await supabase.rpc("push_subscribe", { p_endpoint: json.endpoint, p_sub: json });
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

/**
 * Silently repair subscriptions broken by the RLS bug that rejected every
 * registration (see migration fix_push_subscribe_rls).
 *
 * Anyone who tapped "turn on notifications" before the fix granted browser
 * permission but never got stored server-side — so they believe alerts are on
 * and would receive nothing. Because permission is already granted,
 * re-subscribing raises no prompt and is invisible to them.
 *
 * Also covers the ordinary case of a browser rotating its push endpoint.
 */
export async function resubscribeIfPermitted(): Promise<void> {
  try {
    if (!pushSupported()) return;
    if (Notification.permission !== "granted") return;

    const reg = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 6000)),
    ]);
    if (!reg) return;

    const sub = await reg.pushManager.getSubscription();
    if (!sub) return; // nothing to repair — they never completed a subscribe
    const json = sub.toJSON() as { endpoint?: string };
    if (!json.endpoint) return;

    const { error } = await supabase.rpc("push_subscribe", { p_endpoint: json.endpoint, p_sub: json });
    if (!error) {
      try {
        localStorage.setItem("jf-push", "1");
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* best-effort repair — never surface anything to the user */
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

// Fire-and-forget weekly-victory push (server verifies the goal + dedupes per week).
export function notifyBossVictory(): void {
  try {
    fetch(EDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: PUBLISHABLE, Authorization: `Bearer ${PUBLISHABLE}` },
      body: JSON.stringify({ mode: "boss" }),
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
