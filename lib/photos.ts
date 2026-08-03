import { supabase } from "@/lib/supabase";
import { hasProfanity } from "@/lib/clean";

export type Photo = {
  id: string;
  path: string;
  name: string | null;
  caption: string | null;
  created_at: string;
};

const BUCKET = "jf-photos";

export function photoUrl(path: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Downscale on-device before upload: a phone camera shot is 3–12 MB, but a
 * 1600px JPEG is plenty for the wall and uploads fast even on park Wi-Fi.
 */
async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  return blob ?? file;
}

/** Upload + queue for moderation. Nothing shows publicly until approved. */
export async function submitPhoto(file: File, caption: string): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!file.type.startsWith("image/")) return { ok: false, error: "Please choose a photo." };
    if (caption && hasProfanity(caption)) return { ok: false, error: "Let's keep the caption kid-friendly. 💛" };

    let name: string | null = null;
    try {
      name = localStorage.getItem("jf-name");
    } catch {
      /* ignore */
    }
    if (name && hasProfanity(name)) name = null;

    const blob = await compress(file);
    if (blob.size > 4 * 1024 * 1024) return { ok: false, error: "That photo is too large — try another." };

    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    const up = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg" });
    if (up.error) return { ok: false, error: "Upload failed — check your connection." };

    const ins = await supabase.from("jf_photos").insert({ path, name, caption: caption.trim() || null });
    if (ins.error) return { ok: false, error: "Couldn't submit — try again." };
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong — try again." };
  }
}

/** Approved photos, newest first. Null on failure so the UI can show a retry. */
export async function fetchPhotos(): Promise<Photo[] | null> {
  try {
    const { data, error } = await supabase
      .from("jf_photos")
      .select("id, path, name, caption, created_at")
      .order("created_at", { ascending: false })
      .limit(80);
    if (error) return null;
    return (data as Photo[]) ?? [];
  } catch {
    return null;
  }
}

export async function adminPendingPhotos(passcode: string): Promise<Photo[]> {
  try {
    const { data } = await supabase.rpc("admin_photos_pending", { p_passcode: passcode });
    return (data as Photo[]) ?? [];
  } catch {
    return [];
  }
}

export async function adminReviewPhoto(passcode: string, id: string, approve: boolean): Promise<boolean> {
  try {
    const { error } = await supabase.rpc("admin_photo_review", { p_passcode: passcode, p_id: id, p_approve: approve });
    return !error;
  } catch {
    return false;
  }
}
