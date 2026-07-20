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
