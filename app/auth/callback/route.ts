import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Only allow same-origin relative paths — never an absolute/protocol-relative
 *  URL (open-redirect guard). */
function safeNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/browse";
  return next;
}

/**
 * Magic-link landing. Supabase redirects the email link here with a one-time
 * `code`; we exchange it for a session (cookies) and send the user back to the
 * page they came from (`next`). Same-device only — the PKCE verifier lives in
 * the cookie set when the link was requested.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // expired/used link, or opened in a different browser (no PKCE verifier)
  return NextResponse.redirect(`${origin}/login?error=link`);
}
