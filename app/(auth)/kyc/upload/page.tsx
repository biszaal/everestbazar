"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { useAuthHydrated, useUser } from "@/store/authStore";
import { ImageDrop } from "@/components/ui/ImageDrop";
import { KycSteps } from "@/components/kyc/KycSteps";
import { Icon } from "@/components/brand/Icon";
import { uploadKycDocument } from "@/lib/upload";

export default function KycUploadPage() {
  const { t } = useT();
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useUser();
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [frontPath, setFrontPath] = useState("");
  const [backPath, setBackPath] = useState("");
  const [err, setErr] = useState("");

  const upload = async (file: File, purpose: "nid-front" | "nid-back") => {
    if (!user) return;
    try {
      const path = await uploadKycDocument(file, user.id, purpose);
      sessionStorage.setItem(`eb-kyc-${purpose}`, path);
      if (purpose === "nid-front") setFrontPath(path);
      else setBackPath(path);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    }
  };

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login?redirect=/sell");
    } else if (user.kycStatus === "VERIFIED") {
      router.replace("/listing/new");
    } else if (user.kycStatus === "PENDING") {
      router.replace("/kyc/pending");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user || (user.kycStatus !== "NONE" && user.kycStatus !== "REJECTED"))
    return null;

  const ready = Boolean(frontPath && backPath);

  return (
    <div className="card" style={{ padding: "30px 28px", borderRadius: 22 }}>
      <KycSteps current={0} />
      <h1 style={{ fontSize: 25, marginTop: 18 }}>{t("kyc.uploadTitle")}</h1>
      <p style={{ color: "var(--ink-2)", marginTop: 8, fontSize: 15 }}>
        {t("kyc.uploadSub")}
      </p>

      <div style={{ display: "grid", gap: 18, marginTop: 22 }}>
        <ImageDrop
          label={t("kyc.front")}
          hint={t("kyc.dropHint")}
          removeLabel={t("kyc.remove")}
          value={front}
          onChange={(u) => {
            setFront(u);
            if (!u) setFrontPath("");
          }}
          onFile={(f) => upload(f, "nid-front")}
        />
        <ImageDrop
          label={t("kyc.back")}
          hint={t("kyc.dropHint")}
          removeLabel={t("kyc.remove")}
          value={back}
          onChange={(u) => {
            setBack(u);
            if (!u) setBackPath("");
          }}
          onFile={(f) => upload(f, "nid-back")}
        />
      </div>
      {err && (
        <p role="alert" style={{ color: "var(--crimson)", fontSize: 13, marginTop: 12 }}>
          {err}
        </p>
      )}

      <details style={{ marginTop: 18 }}>
        <summary
          style={{
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            color: "var(--crimson)",
            listStyle: "none",
          }}
        >
          {t("kyc.why")}
        </summary>
        <p style={{ color: "var(--ink-2)", marginTop: 8, fontSize: 14, lineHeight: 1.6 }}>
          {t("kyc.whyBody")}
        </p>
      </details>

      <button
        type="button"
        className="btn btn-primary"
        disabled={!ready}
        onClick={() => router.push("/kyc/selfie")}
        style={{ width: "100%", marginTop: 22, opacity: ready ? 1 : 0.5 }}
      >
        {t("kyc.continue")} <Icon name="arrow" size={18} sw={2.2} />
      </button>
    </div>
  );
}
