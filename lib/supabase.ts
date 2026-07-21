import { createClient } from "@supabase/supabase-js";

// The URL and publishable key are safe for the browser (client-side, RLS-protected).
// Env vars take precedence; the public fallbacks keep sign-ups working everywhere.
const FALLBACK_URL = "https://vmpkiwfvnlzraabtjkig.supabase.co";
const FALLBACK_KEY = "sb_publishable_uHfm0bHa-qmm0EJOr2F8tA_iid43Ru-";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

export const supabaseReady = Boolean(url && key);

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

// ---------- Onboarding sign-up ----------
export type MemberInput = {
  full_name: string;
  email: string;
  phone?: string;
  church?: string;
  country?: string;
  city?: string;
  lat?: number;
  lng?: number;
};

export async function joinFestival(input: MemberInput): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("jesus_festival_app_members").insert({
      full_name: input.full_name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || null,
      church: input.church?.trim() || null,
      country: input.country || null,
      city: input.city?.trim() || null,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      source: "app",
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Something went wrong" };
  }
}

export type SignupLocation = { label: string; lat: number; lng: number; n: number };

export async function fetchSignupLocations(): Promise<SignupLocation[]> {
  try {
    const { data } = await supabase.rpc("revive_signup_locations");
    return (data ?? []).map((r: { label: string; lat: number; lng: number; n: number }) => ({
      label: r.label,
      lat: Number(r.lat),
      lng: Number(r.lng),
      n: Number(r.n),
    }));
  } catch {
    return [];
  }
}

// ---------- Newsfeed ----------
export type NewsPost = {
  id: string;
  title: string;
  body: string;
  category: string;
  pinned: boolean;
  created_at: string;
};

// Returns null on failure so the UI can show a retry state instead of a
// misleading "no updates yet".
export async function fetchNews(): Promise<NewsPost[] | null> {
  try {
    const { data, error } = await supabase
      .from("jesus_festival_app_news")
      .select("id, title, body, category, pinned, created_at")
      .eq("published", true)
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return null;
    return (data as NewsPost[]) ?? [];
  } catch {
    return null;
  }
}

// ---------- Admin (passcode-gated server-side RPCs) ----------
export async function adminCreateNews(
  passcode: string,
  post: { title: string; body: string; category?: string; pinned?: boolean }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc("admin_create_news", {
      p_passcode: passcode,
      p_title: post.title,
      p_body: post.body,
      p_category: post.category ?? "update",
      p_pinned: post.pinned ?? false,
    });
    if (error) return { ok: false, error: "Incorrect passcode or server error." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong." };
  }
}

export async function adminResetCity(passcode: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await supabase.rpc("admin_reset_city", { p_passcode: passcode });
    if (error) return { ok: false, error: "Incorrect passcode or server error." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong." };
  }
}
