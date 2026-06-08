// EverestBazar — Khalti payment webhook (Supabase Edge Function, Deno).
// Deploy: supabase functions deploy khalti-webhook --no-verify-jwt
//
// FAIL-CLOSED: confirms the payment server-to-server via Khalti's lookup API
// (status === "Completed" AND amount matches) before moving the transaction to
// ESCROW_HELD. Runs on Deno — excluded from the Next.js tsconfig.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const khaltiKey = Deno.env.get("KHALTI_SECRET_KEY");
  if (!khaltiKey) return new Response("server not configured", { status: 500 });

  let body: { txnId?: string; pidx?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }
  const { txnId, pidx } = body;
  if (!txnId || !pidx) return new Response("bad request", { status: 400 });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: txn, error: readErr } = await supabase
    .from("transactions")
    .select("seller_id, total_npr, status")
    .eq("id", txnId)
    .single();
  if (readErr || !txn) return new Response("not found", { status: 404 });
  if (txn.status !== "PENDING_PAYMENT") return new Response("already processed", { status: 409 });

  // server-to-server verification
  const lookup = await fetch("https://khalti.com/api/v2/epayment/lookup/", {
    method: "POST",
    headers: { Authorization: `Key ${khaltiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ pidx }),
  });
  const result = await lookup.json().catch(() => null);
  if (!lookup.ok || !result) return new Response("verification failed", { status: 401 });
  if (result.status !== "Completed" || Number(result.total_amount) < txn.total_npr * 100) {
    return new Response("payment not verified", { status: 401 });
  }

  const { error } = await supabase
    .from("transactions")
    .update({
      status: "ESCROW_HELD",
      payment_ref: pidx,
      escrow_deadline: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    })
    .eq("id", txnId)
    .eq("status", "PENDING_PAYMENT");
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const { data: seller } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", txn.seller_id)
    .single();
  if (seller?.phone) {
    await fetch(
      `https://graph.facebook.com/v18.0/${Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("WHATSAPP_TOKEN")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: seller.phone,
          type: "text",
          text: { body: "Your item has been sold on EverestBazar! Please deliver it to the buyer. Your payment is held safely until they confirm receipt." },
        }),
      },
    );
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
