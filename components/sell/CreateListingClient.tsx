"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { useAuthHydrated, useUser } from "@/store/authStore";
import { Icon } from "@/components/brand/Icon";
import { rs } from "@/lib/format";
import { platformFee, sellerPayout, type Condition } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { uploadListingPhoto } from "@/lib/upload";
import type { ListingCategory } from "@/lib/listings";
import type { StringKey } from "@/lib/i18n";

const CATEGORIES: ListingCategory[] = [
  "mobile",
  "electronics",
  "vehicles",
  "furniture",
  "home",
  "fashion",
];
const CONDITIONS: Condition[] = ["LIKE_NEW", "GOOD", "FAIR", "FOR_PARTS"];
const MAX_PHOTOS = 6;

// UI category → DB (category enum + subcategory label)
const CAT_DB: Record<ListingCategory, { category: string; subcategory: string }> = {
  mobile: { category: "ELECTRONICS", subcategory: "Mobiles" },
  electronics: { category: "ELECTRONICS", subcategory: "Electronics" },
  vehicles: { category: "VEHICLES", subcategory: "Vehicles" },
  furniture: { category: "FURNITURE", subcategory: "Furniture" },
  home: { category: "OTHER", subcategory: "Home" },
  fashion: { category: "FASHION", subcategory: "Fashion" },
};

export function CreateListingClient() {
  const { t, lang } = useT();
  const router = useRouter();
  const hydrated = useAuthHydrated();
  const user = useUser();

  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState<ListingCategory>("mobile");
  const [cond, setCond] = useState<Condition>("GOOD");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);
  const filesRef = useRef<Map<string, File>>(new Map());

  // guard: must be logged in + verified
  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace("/login?redirect=/listing/new");
    else if (user.kycStatus === "PENDING") router.replace("/kyc/pending");
    else if (user.kycStatus !== "VERIFIED") router.replace("/kyc/upload");
  }, [hydrated, user, router]);

  useEffect(() => {
    return () => urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  if (!hydrated || !user || user.kycStatus !== "VERIFIED") return null;

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_PHOTOS - photos.length)
      .map((f) => {
        const url = URL.createObjectURL(f);
        urlsRef.current.push(url);
        filesRef.current.set(url, f);
        return url;
      });
    setPhotos((p) => [...p, ...incoming]);
  };

  const removePhoto = (url: string) => {
    URL.revokeObjectURL(url);
    urlsRef.current = urlsRef.current.filter((u) => u !== url);
    filesRef.current.delete(url);
    setPhotos((p) => p.filter((u) => u !== url));
  };

  const priceNum = Number(price) || 0;

  const publish = async () => {
    const errs: string[] = [];
    if (photos.length < 3) errs.push(t("new.minPhotos"));
    if (!title.trim()) errs.push(t("new.needTitle"));
    if (!priceNum) errs.push(t("new.needPrice"));
    setErrors(errs);
    if (errs.length || !user) return;

    setPublishing(true);
    try {
      const supabase = createClient();
      const paths: string[] = [];
      for (const url of photos) {
        const file = filesRef.current.get(url);
        if (file) paths.push(await uploadListingPhoto(file));
      }
      const meta = CAT_DB[cat];
      const { data, error } = await supabase
        .from("listings")
        .insert({
          seller_id: user.id,
          title: title.trim(),
          description: desc.trim(),
          category: meta.category,
          subcategory: meta.subcategory,
          condition: cond,
          price_npr: priceNum,
          photo_paths: paths,
          city: "Kathmandu",
          status: "ACTIVE",
        })
        .select("id")
        .single();
      if (error) throw error;
      router.push(`/listing/${data.id}`);
    } catch (e) {
      setPublishing(false);
      setErrors([e instanceof Error ? e.message : "Publish failed"]);
    }
  };

  return (
    <div className="wrap" style={{ padding: "34px 28px 90px", maxWidth: 720 }}>
      <span className="eyebrow">{t("sell.eyebrow")}</span>
      <h1 style={{ fontSize: "clamp(26px,3.4vw,38px)", marginTop: 14 }}>
        {t("new.title")}
      </h1>
      <p style={{ color: "var(--ink-2)", marginTop: 10, fontSize: 16 }}>{t("new.sub")}</p>

      {/* photos */}
      <section style={{ marginTop: 30 }}>
        <h2 style={{ fontSize: 18 }}>{t("new.photos")}</h2>
        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 6 }}>
          {t("new.photosHint")}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 12,
            marginTop: 14,
          }}
        >
          {photos.map((url, i) => (
            <div
              key={url}
              style={{
                position: "relative",
                aspectRatio: "1 / 1",
                borderRadius: 12,
                overflow: "hidden",
                border: i === 0 ? "2px solid var(--crimson)" : "1px solid var(--line-2)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {i === 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    background: "var(--crimson)",
                    color: "var(--paper)",
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 999,
                  }}
                >
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(url)}
                aria-label={t("kyc.remove")}
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  border: "none",
                  background: "rgba(33,27,22,0.82)",
                  color: "var(--paper)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 14,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 12,
                border: `1.5px dashed ${photos.length < 3 ? "var(--crimson)" : "var(--line-2)"}`,
                background: "var(--paper-2)",
                display: "grid",
                placeItems: "center",
                color: "var(--ink-soft)",
                gap: 6,
              }}
            >
              <Icon name="upload" size={22} stroke="var(--ink-soft)" />
              <span style={{ fontSize: 12 }}>
                {photos.length}/{MAX_PHOTOS}
              </span>
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => {
            addPhotos(e.target.files);
            e.target.value = "";
          }}
        />
      </section>

      {/* fields */}
      <div style={{ marginTop: 28, display: "grid", gap: 18 }}>
        <FieldLabel label={t("new.titleField")}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("new.titlePh")}
            className="eb-input"
          />
        </FieldLabel>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FieldLabel label={t("new.category")}>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value as ListingCategory)}
              className="eb-input"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {t(`cat.${c}` as StringKey)}
                </option>
              ))}
            </select>
          </FieldLabel>
          <FieldLabel label={t("new.cond")}>
            <select
              value={cond}
              onChange={(e) => setCond(e.target.value as Condition)}
              className="eb-input"
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {t(`cond.${c}` as StringKey)}
                </option>
              ))}
            </select>
          </FieldLabel>
        </div>

        <FieldLabel label={t("new.price")}>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/\D/g, "").slice(0, 9))}
            inputMode="numeric"
            placeholder="0"
            className="eb-input"
          />
        </FieldLabel>

        {priceNum > 0 && (
          <div
            style={{
              background: "var(--paper-2)",
              border: "1px solid var(--line)",
              borderRadius: 14,
              padding: "14px 16px",
              fontSize: 14.5,
            }}
          >
            <Row label={t("co.itemPrice")} value={rs(priceNum, lang)} />
            <Row
              label={`${t("sell.eyebrow")} · 5%`}
              value={`− ${rs(platformFee(priceNum), lang)}`}
              muted
            />
            <div style={{ height: 1, background: "var(--line)", margin: "8px 0" }} />
            <Row label={t("new.youReceive")} value={rs(sellerPayout(priceNum), lang)} strong />
          </div>
        )}

        <FieldLabel label={t("new.desc")}>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value.slice(0, 500))}
            placeholder={t("new.descPh")}
            rows={4}
            className="eb-input"
            style={{ resize: "vertical", lineHeight: 1.5 }}
          />
          <div
            style={{
              textAlign: "right",
              fontSize: 12,
              color: "var(--ink-soft)",
              marginTop: 4,
              fontFamily: "var(--mono)",
            }}
          >
            {desc.length}/500
          </div>
        </FieldLabel>
      </div>

      {errors.length > 0 && (
        <div
          role="alert"
          style={{
            marginTop: 18,
            background: "color-mix(in oklab, var(--crimson) 8%, var(--paper))",
            border: "1px solid color-mix(in oklab, var(--crimson) 30%, var(--paper))",
            borderRadius: 12,
            padding: "12px 14px",
          }}
        >
          {errors.map((e, i) => (
            <p key={i} style={{ color: "var(--crimson)", fontSize: 13.5, margin: "2px 0" }}>
              {e}
            </p>
          ))}
        </div>
      )}

      <button
        type="button"
        className="btn btn-primary"
        onClick={publish}
        disabled={publishing}
        style={{ width: "100%", marginTop: 22, opacity: publishing ? 0.7 : 1 }}
      >
        {publishing ? t("new.publishing") : t("new.publish")}
        {!publishing && <Icon name="check" size={18} sw={2.4} />}
      </button>
    </div>
  );
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block" }}>
      <span
        style={{
          display: "block",
          fontSize: 13.5,
          fontWeight: 600,
          marginBottom: 7,
          color: "var(--ink-2)",
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function Row({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        padding: "3px 0",
        color: muted ? "var(--ink-soft)" : "var(--ink)",
      }}
    >
      <span>{label}</span>
      <span style={{ fontWeight: strong ? 800 : 600, fontFamily: strong ? "var(--display)" : "inherit" }}>
        {value}
      </span>
    </div>
  );
}
