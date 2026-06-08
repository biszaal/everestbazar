// Verifies the public read path works with the anon key under RLS.
import { createClient } from "@supabase/supabase-js";
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const { data, error } = await sb
  .from("listings")
  .select("id, title, price_npr, condition, category, profiles:seller_id (name, trust_score, kyc_status)")
  .eq("status", "ACTIVE")
  .order("created_at", { ascending: false })
  .limit(20);
if (error) {
  console.error("ANON_READ_ERROR:", error.message);
  process.exit(1);
}
console.log("listings readable via anon key:", data.length);
for (const d of data.slice(0, 4)) {
  console.log(`  • ${d.title} — Rs ${d.price_npr} (${d.condition}) — ${d.profiles?.name} [${d.profiles?.kyc_status}]`);
}
