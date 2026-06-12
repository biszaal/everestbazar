import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Hosts we are willing to redirect back to. The redirect base is NEVER taken
 * from an unvalidated request header (open-redirect guard): x-forwarded-host is
 * only honored when it's one of ours, otherwise we fall back to the request's
 * own origin. The protocol is derived locally, never trusted from a header.
 */
const ALLOWED_HOSTS = new Set([
  "everestbazar.com",
  "www.everestbazar.com",
  "localhost:3000",
  "localhost:3100",
]);

/** Only allow same-origin relative paths — never an absolute/protocol-relative
 *  URL (open-redirect guard on the destination path). */
function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/browse";
  return next;
}

/**
 * Behind Netlify's proxy, request.url carries an internal host, so the public
 * host arrives in x-forwarded-host. We honor it only if it's allow-listed —
 * a forged header falls through to the request's own (already-ours) origin.
 */
function redirectBase(request: Request): string {
  const { origin } = new URL(request.url);
  const fwdHost = request.headers.get("x-forwarded-host")?.toLowerCase();
  if (fwdHost && ALLOWED_HOSTS.has(fwdHost)) {
    const proto = fwdHost.startsWith("localhost") ? "http" : "https";
    return `${proto}://${fwdHost}`;
  }
  return origin;
}

/**
 * Magic-link landing. Supabase redirects the email link here with a one-time
 * `code`; we exchange it for a session (cookies) and send the user back to the
 * page they came from (`next`). Same-device only — the PKCE verifier lives in
 * the cookie set when the link was requested.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));
  const base = redirectBase(request);

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${base}${next}`);
    }
  }

  // expired/used link, or opened in a different browser (no PKCE verifier)
  return NextResponse.redirect(`${base}/login?error=link`);
}
