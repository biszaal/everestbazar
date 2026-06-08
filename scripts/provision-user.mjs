// Pre-provisions a test user as VERIFIED, and probes whether migration 005 RPCs exist.
// Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/provision-user.mjs <email>
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2] || "biszaal@yahoo.com";
const sb = createClient(url, key, { auth: { persistSession: false } });

async function findUser(email) {
  for (let page = 1; page <= 10; page++) {
    const { data } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    const u = data.users.find((x) => x.email === email);
    if (u) return u;
    if (data.users.length < 200) break;
  }
  return null;
}

let user = await findUser(email);
if (!user) {
  const { data, error } = await sb.auth.admin.createUser({ email, email_confirm: true });
  if (error) {
    console.error("createUser error:", error.message);
    process.exit(1);
  }
  user = data.user;
  console.log("created user");
} else {
  console.log("user already exists");
}

await sb
  .from("profiles")
  .update({
    name: "Bishal Aryal",
    kyc_status: "VERIFIED",
    trust_score: 88,
    completed_sales: 0,
    avg_rating: 5.0,
    city: "Kathmandu",
  })
  .eq("id", user.id);

console.log("\nuser id:", user.id);
console.log("→ set NEXT_PUBLIC_ADMIN_USER_ID to this in .env.local to access /admin/kyc");

// probe whether 005 RPCs are present (service role → auth.uid() null → 'auth required' if exists)
for (const fn of ["create_transaction", "submit_kyc"]) {
  const args =
    fn === "create_transaction"
      ? { p_listing_id: "00000000-0000-0000-0000-000000000000", p_payment: null }
      : { p_front: "x", p_back: "x", p_selfie: "x" };
  const { error } = await sb.rpc(fn, args);
  const msg = error?.message ?? "";
  const missing = /Could not find the function|does not exist|schema cache/i.test(msg);
  console.log(`rpc ${fn}: ${missing ? "NOT APPLIED (run migration 005)" : "present ✓"}`);
}
