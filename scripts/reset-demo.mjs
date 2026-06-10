import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
// remove test transactions (frees the FK) then restore listings to ACTIVE
await sb.from("transactions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
const { count } = await sb.from("listings").update({ status: "ACTIVE" }).neq("status", "DELETED").select("id", { count: "exact", head: true });
console.log("reset: transactions cleared, listings set ACTIVE:", count ?? "ok");
