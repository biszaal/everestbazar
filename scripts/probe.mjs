// Reports which RPCs exist (i.e. which migrations are applied).
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const probes = [
  ["create_transaction (005)", "create_transaction", { p_listing_id: "00000000-0000-0000-0000-000000000000", p_payment: null }],
  ["submit_kyc (005)", "submit_kyc", { p_front: "x", p_back: "x", p_selfie: "x" }],
  ["open_conversation (006)", "open_conversation", { p_listing_id: "00000000-0000-0000-0000-000000000000" }],
];
for (const [label, fn, args] of probes) {
  const { error } = await sb.rpc(fn, args);
  const msg = error?.message ?? "";
  const missing = /could not find the function|does not exist|schema cache/i.test(msg);
  console.log(`${label}: ${missing ? "NOT applied" : "present ✓"}`);
}
