import { createBrowserClient } from "@supabase/ssr";

/** Supabase client for Client Components (browser). */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

/** True when Supabase env vars are configured. Used to fall back to mock data
    while the project is being set up. */
export const supabaseConfigured = (): boolean =>
  Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
