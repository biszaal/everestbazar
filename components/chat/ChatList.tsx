"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { useUser, useAuthHydrated } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";
import { getConversations, type ChatConvo } from "@/lib/data";
import { formatRelative } from "@/lib/format";

export function ChatList() {
  const { t, lang } = useT();
  const hydrated = useAuthHydrated();
  const user = useUser();
  const [convos, setConvos] = useState<ChatConvo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      setLoading(false);
      return;
    }
    getConversations(createClient(), user.id)
      .then(setConvos)
      .catch(() => setConvos([]))
      .finally(() => setLoading(false));
  }, [hydrated, user]);

  if (hydrated && !user) {
    return (
      <div className="wrap" style={{ padding: "70px 28px", maxWidth: 440, textAlign: "center" }}>
        <div className="card" style={{ padding: "36px 30px", borderRadius: 22 }}>
          <Icon name="lock" size={36} stroke="var(--crimson)" />
          <h1 style={{ fontSize: 22, marginTop: 14 }}>{t("pf.loginNeeded")}</h1>
          <Link href="/login?redirect=/chat" className="btn btn-primary" style={{ marginTop: 18 }}>
            {t("nav.login")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ padding: "34px 28px 90px", maxWidth: 680 }}>
      <h1 style={{ fontSize: "clamp(26px,3.4vw,38px)" }}>{t("ch.title")}</h1>

      {loading ? (
        <div style={{ display: "grid", gap: 2, marginTop: 24 }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ height: 76, background: "var(--paper-2)", borderRadius: 12 }} />
          ))}
        </div>
      ) : convos.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "var(--ink-soft)", fontSize: 16 }}>{t("ch.empty")}</p>
          <Link href="/browse" className="btn btn-ghost" style={{ marginTop: 16 }}>
            {t("dash.startBrowsing")} <Icon name="arrow" size={18} sw={2.2} />
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column" }}>
          {convos.map((c) => (
            <Link
              key={c.id}
              href={`/chat/${c.id}`}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 6px", borderBottom: "1px solid var(--line)" }}
            >
              <span
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 999,
                  background: "var(--paper-3)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--display)",
                  fontWeight: 800,
                  fontSize: 18,
                  flex: "0 0 auto",
                }}
              >
                {c.name[0]}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <strong style={{ fontFamily: "var(--display)", fontSize: 15.5 }}>{c.name}</strong>
                  {c.verified && <Icon name="check" size={13} sw={2.8} stroke="var(--green)" />}
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    color: "var(--ink-soft)",
                    marginTop: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.lastMessage ?? c.listingTitle ?? ""}
                </div>
              </div>
              {c.lastMessageAt && (
                <span style={{ fontSize: 12, color: "var(--ink-soft)", flex: "0 0 auto" }}>
                  {formatRelative(c.lastMessageAt, lang)}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
