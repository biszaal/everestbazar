"use client";

import Link from "next/link";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { useChatStore, useChatHydrated } from "@/store/chatStore";
import { formatRelative, rs } from "@/lib/format";

export function ChatList() {
  const { t, lang } = useT();
  const hydrated = useChatHydrated();
  const convos = useChatStore((s) => s.convos);
  const messages = useChatStore((s) => s.messages);

  const sorted = [...convos].sort(
    (a, b) => new Date(b.lastTs).getTime() - new Date(a.lastTs).getTime()
  );

  const preview = (chatId: string): string => {
    const list = messages[chatId] ?? [];
    const last = list[list.length - 1];
    if (!last) return "";
    if (last.type === "SYSTEM") {
      if (last.text === "__BLOCKED__") return t("ch.blocked");
      if (last.text === "__OFFER_ACCEPTED__") return t("ch.offerAccepted");
      if (last.text === "__OFFER_DECLINED__") return t("ch.offerDeclined");
      return last.text;
    }
    if (last.type === "OFFER") return `${t("ch.offer")}: ${rs(last.offerNPR ?? 0, lang)}`;
    const body = (last.sender === "me" ? "You: " : "") + last.text;
    return body.length > 60 ? body.slice(0, 58) + "…" : body;
  };

  return (
    <div className="wrap" style={{ padding: "34px 28px 90px", maxWidth: 680 }}>
      <h1 style={{ fontSize: "clamp(26px,3.4vw,38px)" }}>{t("ch.title")}</h1>

      {!hydrated ? (
        <div style={{ display: "grid", gap: 2, marginTop: 24 }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ height: 76, background: "var(--paper-2)", borderRadius: 12 }} />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <p style={{ color: "var(--ink-soft)", fontSize: 16 }}>{t("ch.empty")}</p>
          <Link href="/browse" className="btn btn-ghost" style={{ marginTop: 16 }}>
            {t("dash.startBrowsing")} <Icon name="arrow" size={18} sw={2.2} />
          </Link>
        </div>
      ) : (
        <div style={{ marginTop: 22, display: "flex", flexDirection: "column" }}>
          {sorted.map((c) => (
            <Link
              key={c.id}
              href={`/chat/${c.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 6px",
                borderBottom: "1px solid var(--line)",
              }}
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
                  {preview(c.id)}
                </div>
              </div>
              <span style={{ fontSize: 12, color: "var(--ink-soft)", flex: "0 0 auto" }}>
                {formatRelative(c.lastTs, lang)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
