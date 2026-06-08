// Proves the email-OTP login works: mint an OTP (service role) then verify it (anon client).
import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.argv[2] || "biszaal@yahoo.com";

const admin = createClient(url, svc, { auth: { persistSession: false } });
const { data: link, error: linkErr } = await admin.auth.admin.generateLink({ type: "magiclink", email });
if (linkErr) { console.error("generateLink:", linkErr.message); process.exit(1); }
const otp = link.properties?.email_otp;
console.log("otp length:", otp?.length);

const anon = createClient(url, anonKey, { auth: { persistSession: false } });
const { data, error } = await anon.auth.verifyOtp({ email, token: otp, type: "email" });
console.log("verify error:", error?.message ?? "none");
console.log("session established:", !!data?.session);
console.log("user:", data?.user?.email);
