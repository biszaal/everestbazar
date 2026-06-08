"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { useAuthStore, useAuthHydrated, useUser } from "@/store/authStore";
import { KycSteps } from "@/components/kyc/KycSteps";
import { Icon } from "@/components/brand/Icon";
import { createClient } from "@/lib/supabase/client";
import { uploadKycDocument } from "@/lib/upload";

export default function KycSelfiePage() {
  const { t } = useT();
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useUser();

  const [selfie, setSelfie] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const objUrlRef = useRef<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const blobRef = useRef<Blob | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace("/login?redirect=/sell");
    else if (user.kycStatus === "VERIFIED") router.replace("/listing/new");
    else if (user.kycStatus === "PENDING") router.replace("/kyc/pending");
  }, [hydrated, user, router]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (objUrlRef.current) URL.revokeObjectURL(objUrlRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOn(true);
      // attach after render
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      });
    } catch {
      // no camera / denied → user can upload instead
      setCameraOn(false);
    }
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setSelfie(canvas.toDataURL("image/jpeg", 0.85));
    canvas.toBlob((b) => (blobRef.current = b), "image/jpeg", 0.85);
    stopCamera();
  };

  const acceptFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (objUrlRef.current) URL.revokeObjectURL(objUrlRef.current);
    const url = URL.createObjectURL(file);
    objUrlRef.current = url;
    blobRef.current = file;
    setSelfie(url);
  };

  const retake = () => {
    if (objUrlRef.current) {
      URL.revokeObjectURL(objUrlRef.current);
      objUrlRef.current = "";
    }
    blobRef.current = null;
    setSelfie("");
  };

  const submit = async () => {
    if (!user || !blobRef.current || submitting) return;
    const front = sessionStorage.getItem("eb-kyc-nid-front");
    const back = sessionStorage.getItem("eb-kyc-nid-back");
    if (!front || !back) {
      router.replace("/kyc/upload");
      return;
    }
    setSubmitting(true);
    setErr("");
    try {
      const selfieFile = new File([blobRef.current], "selfie.jpg", { type: "image/jpeg" });
      const selfiePath = await uploadKycDocument(selfieFile, user.id, "selfie");
      const supabase = createClient();
      const { error } = await supabase.rpc("submit_kyc", {
        p_front: front,
        p_back: back,
        p_selfie: selfiePath,
      });
      if (error) throw error;
      sessionStorage.removeItem("eb-kyc-nid-front");
      sessionStorage.removeItem("eb-kyc-nid-back");
      await useAuthStore.getState().refresh();
      router.push("/kyc/pending");
    } catch (e) {
      setSubmitting(false);
      setErr(e instanceof Error ? e.message : "Submit failed");
    }
  };

  if (!hydrated || !user || (user.kycStatus !== "NONE" && user.kycStatus !== "REJECTED"))
    return null;

  return (
    <div className="card" style={{ padding: "30px 28px", borderRadius: 22 }}>
      <KycSteps current={1} />
      <h1 style={{ fontSize: 25, marginTop: 18 }}>{t("kyc.selfieTitle")}</h1>
      <p style={{ color: "var(--ink-2)", marginTop: 8, fontSize: 15 }}>
        {t("kyc.selfieSub")}
      </p>

      <div
        style={{
          marginTop: 20,
          borderRadius: 16,
          overflow: "hidden",
          background: "var(--ink)",
          aspectRatio: "1 / 1",
          position: "relative",
          display: "grid",
          placeItems: "center",
        }}
      >
        {selfie ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={selfie} alt="Selfie preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : cameraOn ? (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
              <ellipse cx="50" cy="46" rx="27" ry="34" fill="none" stroke="rgba(246,240,230,0.7)" strokeWidth="0.8" strokeDasharray="3 2" />
            </svg>
          </>
        ) : (
          <div style={{ textAlign: "center", color: "rgba(246,240,230,0.7)", padding: 24 }}>
            <Icon name="id" size={40} stroke="rgba(246,240,230,0.7)" />
            <p style={{ marginTop: 10, fontSize: 13.5 }}>{t("kyc.selfieSub")}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 18 }}>
        {selfie ? (
          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" className="btn btn-ghost" onClick={retake}>
              {t("kyc.retake")}
            </button>
            <button type="button" className="btn btn-primary" style={{ flex: 1 }} onClick={submit}>
              {t("kyc.submit")} <Icon name="shield" size={18} sw={2} />
            </button>
          </div>
        ) : cameraOn ? (
          <button type="button" className="btn btn-primary" style={{ width: "100%" }} onClick={capture}>
            {t("kyc.capture")} <Icon name="check" size={18} sw={2.4} />
          </button>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            <button type="button" className="btn btn-dark" style={{ width: "100%" }} onClick={startCamera}>
              {t("kyc.useCamera")}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ width: "100%" }}
              onClick={() => fileRef.current?.click()}
            >
              {t("kyc.orUpload")}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => acceptFile(e.target.files?.[0])}
            />
          </div>
        )}
      </div>
    </div>
  );
}
