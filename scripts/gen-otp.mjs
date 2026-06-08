// Mints a login OTP for an email via the service role (no email sent) — for testing.
// Usage: NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/gen-otp.mjs <email>
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});
const email = process.argv[2] || "biszaal@yahoo.com";
const { data, error } = await sb.auth.admin.generateLink({ type: "magiclink", email });
if (error) {
  console.error("error:", error.message);
  process.exit(1);
}
console.log("OTP:", data.properties?.email_otp);
