import { createClient } from "@/lib/supabase/client";

/** Upload a listing photo to the public `listing-photos` bucket. Returns the
 *  storage path (store this in listings.photo_paths). */
export async function uploadListingPhoto(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from("listing-photos")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return data.path;
}

/** Public CDN URL for a listing photo path. */
export function getListingPhotoUrl(path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
  return data.publicUrl;
}

/** Upload a KYC document to the private `kyc-documents` bucket, namespaced by
 *  the user's id (required by the storage RLS policy). */
export async function uploadKycDocument(
  file: File,
  userId: string,
  purpose: "nid-front" | "nid-back" | "selfie"
): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${purpose}.${ext}`;
  const { data, error } = await supabase.storage
    .from("kyc-documents")
    .upload(path, file, { upsert: true });
  if (error) throw error;
  return data.path;
}
