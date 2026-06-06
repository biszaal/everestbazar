"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppFrame } from "@/components/layout/AppFrame";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { getListing, type RichListing } from "@/lib/catalog";
import { useChatStore } from "@/store/chatStore";
import { rs } from "@/lib/format";
import { buyerTotal } from "@/lib/types";

export default function CheckoutSuccessPage() {
  const { t, lang } = useT();
  const router = useRouter();
  const openOrCreate = useChatStore((s) => s.openOrCreate);
  const [listing, setListing] = useState<RichListing | null>(null);
  const [deadline, setDeadline] = useState("");

  const chatWithSeller = () => {
    if (!listing) {
      router.push("/browse");
      return;
    }
    const chatId = `l${listing.id}`;
    openOrCreate(
      {
        id: chatId,
        name: listing.seller.name,
        verified: listing.seller.verified,
        listingId: listing.id,
        listingTitleEn: listing.en,
        listingTitleNe: listing.ne,
        hue: listing.hue,
      },
      `Payment received through escrow — thank you! Let's arrange delivery for the ${listing.en}.`
    );
    router.push(`/chat/${chatId}`);
  };

  useEffect(() => {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    setListing(getListing(id) ?? null);
    const d = new Date(Date.now() + 72 * 60 * 60 * 1000);
    setDeadline(
      d.toLocaleString(lang === "ne" ? "ne-NP" : "en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  }, [lang]);

  const total = listing ? buyerTotal(listing.price) : 0;

  return (
    <AppFrame>
      <div className="wrap" style={{ padding: "60px 28px 90px", maxWidth: 560 }}>
        <div className="card" style={{ padding: "44px 32px", textAlign: "center", borderRadius: 22 }}>
          <div
            className="eb-pop"
            style={{
              width: 90,
              height: 90,
              borderRadius: 999,
              margin: "0 auto 24px",
              display: "grid",
              placeItems: "center",
              background: "color-mix(in oklab, var(--green) 16%, var(--paper))",
            }}
          >
            <Icon name="check" size={48} sw={2.4} stroke="var(--green)" />
          </div>
          <h1 style={{ fontSize: 28 }}>{t("cs.title")}</h1>
          <p style={{ color: "var(--ink-2)", marginTop: 12, fontSize: 16, lineHeight: 1.6 }}>
            {t("cs.body")}
            {listing && (
              <>
                {" "}
                <strong style={{ color: "var(--crimson)" }}>{rs(total, lang)}</strong>
              </>
            )}
          </p>

          {deadline && (
            <div
              style={{
                marginTop: 20,
                padding: "12px 16px",
                background: "var(--paper-2)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                fontSize: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              <Icon name="lock" size={16} sw={2} stroke="var(--steel)" />
              <span>
                {t("cs.deadline")}{" "}
                <strong style={{ fontFamily: "var(--mono)" }}>{deadline}</strong>
              </span>
            </div>
          )}

          <div style={{ display: "grid", gap: 10, marginTop: 28 }}>
            <button type="button" className="btn btn-primary" onClick={chatWithSeller}>
              {t("cs.chat")}
            </button>
            <Link href="/browse" className="btn btn-ghost">
              {t("cs.browse")}
            </Link>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}
