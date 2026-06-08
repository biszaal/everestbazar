// EverestBazar — eSewa payment webhook (Supabase Edge Function, Deno).
// Deploy: supabase functions deploy esewa-webhook --no-verify-jwt
// Point eSewa's success callback at this function's URL.
//
// FAIL-CLOSED: the transaction is only moved to ESCROW_HELD after the eSewa
// HMAC-SHA256 signature is verified against ESEWA_SECRET_KEY. Without a valid
// signature the request is rejected 401 and nothing is mutated.
//
// Runs on Deno — excluded from the Next.js tsconfig.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

async function hmacBase64(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

serve(async (req) => {
  const secret = Deno.env.get("ESEWA_SECRET_KEY");
  if (!secret) return new Response("server not configured", { status: 500 });

  // eSewa v2 returns base64 JSON in `data` (or posts the fields directly).
  let payload: Record<string, string>;
  try {
    const raw = await req.json();
    payload = raw.data ? JSON.parse(atob(raw.data)) : raw;
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const { signature, signed_field_names } = payload;
  if (!signature || !signed_field_names) {
    return new Response("unauthorized", { status: 401 });
  }

  // rebuild the signed message exactly as eSewa does, then compare HMACs
  const message = signed_field_names
    .split(",")
    .map((f) => `${f}=${payload[f] ?? ""}`)
    .join(",");
  const expected = await hmacBase64(message, secret);
  if (!timingSafeEqual(expected, signature) || payload.status !== "COMPLETE") {
    return new Response("unauthorized", { status: 401 });
  }

  const txnId = payload.transaction_uuid;
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // amount guard: verify the paid total matches what we expect for this txn
  const { data: txn, error: readErr } = await supabase
    .from("transactions")
    .select("seller_id, total_npr, status")
    .eq("id", txnId)
    .single();
  if (readErr || !txn) return new Response("not found", { status: 404 });
  if (txn.status !== "PENDING_PAYMENT") return new Response("already processed", { status: 409 });
  if (Number(payload.total_amount?.replace(/,/g, "")) < txn.total_npr) {
    return new Response("amount mismatch", { status: 400 });
  }

  const { error } = await supabase
    .from("transactions")
    .update({
      status: "ESCROW_HELD",
      payment_ref: txnId,
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
