// EverestBazar — escrow auto-release cron (Supabase Edge Function, Deno).
// Schedule hourly with pg_cron / Supabase scheduled functions:
//   select cron.schedule('escrow-auto-release', '0 * * * *',
//     $$ select net.http_post(url := '<function-url>', headers := '{}'::jsonb) $$);
//
// Runs on Deno — excluded from the Next.js tsconfig.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // privileged endpoint — require the shared cron secret (pass it in the
  // pg_cron http_post `headers` JSON as x-cron-secret).
  const expected = Deno.env.get("CRON_SECRET");
  if (!expected || req.headers.get("x-cron-secret") !== expected) {
    return new Response("unauthorized", { status: 401 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // ESCROW_HELD transactions whose 72h window has elapsed → auto-complete
  const { data: due, error } = await supabase
    .from("transactions")
    .select("id, seller_id")
    .eq("status", "ESCROW_HELD")
    .lt("escrow_deadline", new Date().toISOString());

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  for (const txn of due ?? []) {
    await supabase
      .from("transactions")
      .update({ status: "COMPLETED" })
      .eq("id", txn.id)
      .eq("status", "ESCROW_HELD");

    // bump seller stats + trust score
    await supabase.rpc("recalculate_trust_score", { user_id: txn.seller_id });
    // TODO: notify both parties (WhatsApp)
  }

  return new Response(
    JSON.stringify({ released: due?.length ?? 0 }),
    { status: 200 },
  );
});
