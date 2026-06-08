import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// server-side admin check: the signed-in user must be the configured admin
async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const adminId = process.env.NEXT_PUBLIC_ADMIN_USER_ID;
  if (!user || !adminId || user.id !== adminId) return null;
  return user;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, name, email, updated_at, nid_front_path, nid_back_path, selfie_path")
    .eq("kyc_status", "PENDING")
    .order("updated_at", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sign = async (path: string | null) => {
    if (!path) return null;
    const { data: signed } = await admin.storage
      .from("kyc-documents")
      .createSignedUrl(path, 3600);
    return signed?.signedUrl ?? null;
  };

  const applications = await Promise.all(
    (data ?? []).map(async (p) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      submittedAt: p.updated_at,
      front: await sign(p.nid_front_path),
      back: await sign(p.nid_back_path),
      selfie: await sign(p.selfie_path),
    }))
  );
  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { userId, action, reason } = await request.json();
  if (!userId || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const admin = createAdminClient();
  if (action === "approve") {
    await admin
      .from("profiles")
      .update({ kyc_status: "VERIFIED", kyc_rejected_reason: null })
      .eq("id", userId);
    await admin.rpc("recalculate_trust_score", { user_id: userId });
  } else {
    await admin
      .from("profiles")
      .update({ kyc_status: "REJECTED", kyc_rejected_reason: reason ?? "" })
      .eq("id", userId);
  }
  return NextResponse.json({ ok: true });
}
