"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";
import { Skeleton } from "@/components/ui/Skeleton";
import { rs } from "@/lib/format";
import { useUser, useAuthHydrated } from "@/store/authStore";
import { createClient } from "@/lib/supabase/client";
import {
  getConversation,
  getMessages,
  sendMessage,
  sendOffer,
  adaptMessage,
  type ChatConvo,
  type ChatMessage,
} from "@/lib/data";
import type { StringKey } from "@/lib/i18n";

export function ChatThread({ chatId }: { chatId: string }) {
  const { t, lang } = useT();
  const hydrated = useAuthHydrated();
  const user = useUser();

  const [convo, setConvo] = useState<ChatConvo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [text, setText] = useState("");
  const [blockedFlash, setBlockedFlash] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmt, setOfferAmt] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // load + subscribe to realtime inserts
  useEffect(() => {
    if (!hydrated || !user) {
      if (hydrated) setLoaded(true);
      return;
    }
    const supabase = createClient();
    const uid = user.id;
    let alive = true;
    Promise.all([
      getConversation(supabase, chatId, uid),
      getMessages(supabase, chatId, uid),
    ]).then(([c, m]) => {
      if (!alive) return;
      setConvo(c);
      setMessages(m);
      setLoaded(true);
    });

    const channel = supabase
      .channel(`messages:${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${chatId}` },
        (payload) => {
          const msg = adaptMessage(payload.new as never, uid);
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
        }
      )
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [hydrated, user, chatId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  if (hydrated && !user) {
    return (
      <div className="wrap" style={{ padding: "70px 28px", maxWidth: 440, textAlign: "center" }}>
        <div className="card" style={{ padding: "36px 30px", borderRadius: 22 }}>
          <Icon name="lock" size={36} stroke="var(--crimson)" />
          <h1 style={{ fontSize: 22, marginTop: 14 }}>{t("pf.loginNeeded")}</h1>
          <Link href={`/login?redirect=/chat/${chatId}`} className="btn btn-primary" style={{ marginTop: 18 }}>
            {t("nav.login")}
          </Link>
        </div>
      </div>
    );
  }

  if (!loaded || !user) return <ThreadSkeleton />;

  if (!convo) {
    return (
      <div className="wrap" style={{ padding: "60px 28px", textAlign: "center" }}>
        <p style={{ color: "var(--ink-soft)" }}>{t("ch.empty")}</p>
        <Link href="/chat" className="btn btn-ghost" style={{ marginTop: 16 }}>
          {t("ch.title")}
        </Link>
      </div>
    );
  }

  const submit = async () => {
    const value = text.trim();
    if (!value) return;
    setText("");
    const { blocked } = await sendMessage(createClient(), chatId, value, user.id);
    if (blocked) {
      setBlockedFlash(true);
      setTimeout(() => setBlockedFlash(false), 2200);
    }
  };

  const submitOffer = async () => {
    const amt = Number(offerAmt);
    if (!amt) return;
    setOfferAmt("");
    setOfferOpen(false);
    await sendOffer(createClient(), chatId, amt, user.id);
  };

  const respondOffer = async (accept: boolean) => {
    await createClient().from("messages").insert({
      conversation_id: chatId,
      sender_id: user.id,
      content: accept ? "__OFFER_ACCEPTED__" : "__OFFER_DECLINED__",
      type: "SYSTEM",
    });
  };

  return (
    <div className="wrap" style={{ padding: "18px 28px 28px", maxWidth: 760 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14 }}>
        <Link href="/chat" aria-label={t("ch.title")} style={{ color: "var(--ink-soft)" }}>
          <span style={{ display: "inline-block", transform: "rotate(180deg)" }}>
            <Icon name="arrow" size={20} sw={2} />
          </span>
        </Link>
        <span
          style={{
            width: 40,
            height: 40,
            borderRadius: 999,
            background: "var(--paper-3)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--display)",
            fontWeight: 800,
            flex: "0 0 auto",
          }}
        >
          {convo.name[0]}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <strong style={{ fontFamily: "var(--display)", fontSize: 16 }}>{convo.name}</strong>
            {convo.verified && (
              <span className="badge badge-verified">
                <Icon name="check" size={11} sw={2.8} /> {t("browse.verified")}
              </span>
            )}
          </div>
          {convo.listingId && (
            <Link href={`/listing/${convo.listingId}`} style={{ fontSize: 13, color: "var(--crimson)", fontWeight: 600 }}>
              {t("ch.viewListing")}
            </Link>
          )}
        </div>
      </div>

      {/* messages */}
      <div
        ref={scrollRef}
        className="card"
        style={{
          height: "min(58vh, 520px)",
          overflowY: "auto",
          padding: "18px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          background: "var(--paper-2)",
        }}
      >
        {messages.map((m) => (
          <Bubble key={m.id} msg={m} lang={lang} t={t} listingId={convo.listingId} onRespond={respondOffer} />
        ))}
      </div>

      {blockedFlash && (
        <p style={{ color: "var(--crimson)", fontSize: 13, marginTop: 8, textAlign: "center" }}>{t("ch.blocked")}</p>
      )}

      {/* input */}
      <div style={{ display: "flex", gap: 10, marginTop: 14, alignItems: "flex-end" }}>
        <button
          type="button"
          className="btn btn-sm"
          onClick={() => setOfferOpen(true)}
          style={{ background: "color-mix(in oklab, var(--gold) 18%, var(--paper))", color: "var(--terracotta)", flex: "0 0 auto", fontWeight: 600 }}
        >
          {t("ch.makeOffer")}
        </button>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void submit();
            }
          }}
          rows={1}
          placeholder={t("ch.inputPh")}
          className="eb-input"
          style={{ resize: "none", flex: 1, maxHeight: 100 }}
        />
        <button type="button" onClick={submit} aria-label="Send" className="btn btn-primary" style={{ flex: "0 0 auto", padding: "13px 16px" }}>
          <Icon name="arrow" size={18} sw={2.4} />
        </button>
      </div>

      {/* offer sheet */}
      {offerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOfferOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(33,27,22,0.4)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 80 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "var(--paper)", borderRadius: "22px 22px 0 0", padding: "24px 22px calc(28px + env(safe-area-inset-bottom, 0px))", width: "100%", maxWidth: 480, boxShadow: "var(--shadow-lg)" }}
          >
            <h3 style={{ fontSize: 19 }}>{t("ch.makeOffer")}</h3>
            <label style={{ display: "block", marginTop: 14 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-2)" }}>{t("ch.yourOffer")} (NPR)</span>
              <input
                autoFocus
                value={offerAmt}
                onChange={(e) => setOfferAmt(e.target.value.replace(/\D/g, "").slice(0, 9))}
                inputMode="numeric"
                placeholder="0"
                className="eb-input"
                style={{ marginTop: 7 }}
              />
            </label>
            <button type="button" className="btn btn-primary" onClick={submitOffer} style={{ width: "100%", marginTop: 16 }}>
              {t("ch.sendOffer")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ThreadSkeleton() {
  const bubbles: { me: boolean; w: string }[] = [
    { me: false, w: "58%" },
    { me: true, w: "44%" },
    { me: false, w: "70%" },
    { me: true, w: "36%" },
    { me: false, w: "52%" },
  ];
  return (
    <div className="wrap" style={{ padding: "18px 28px 28px", maxWidth: 760 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 14 }}>
        <Skeleton w={20} h={20} r={6} style={{ flex: "0 0 auto" }} />
        <Skeleton w={40} h={40} r={999} style={{ flex: "0 0 auto" }} />
        <div style={{ flex: 1, display: "grid", gap: 8 }}>
          <Skeleton w="38%" h={15} />
          <Skeleton w="22%" h={12} />
        </div>
      </div>
      <div
        className="card"
        style={{
          height: "min(58vh, 520px)",
          padding: "18px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "var(--paper-2)",
        }}
      >
        {bubbles.map((b, i) => (
          <Skeleton
            key={i}
            w={b.w}
            h={42}
            r={16}
            style={{ alignSelf: b.me ? "flex-end" : "flex-start", background: "var(--paper-3)" }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <Skeleton w={96} h={42} r={999} style={{ flex: "0 0 auto" }} />
        <Skeleton h={42} r={12} />
        <Skeleton w={52} h={42} r={12} style={{ flex: "0 0 auto" }} />
      </div>
    </div>
  );
}

function Bubble({
  msg,
  lang,
  t: tt,
  listingId,
  onRespond,
}: {
  msg: ChatMessage;
  lang: "en" | "ne";
  t: (k: StringKey) => string;
  listingId: string | null;
  onRespond: (accept: boolean) => void;
}) {
  if (msg.type === "SYSTEM") {
    const text =
      msg.text === "__BLOCKED__"
        ? tt("ch.blocked")
        : msg.text === "__OFFER_ACCEPTED__"
          ? tt("ch.offerAccepted")
          : msg.text === "__OFFER_DECLINED__"
            ? tt("ch.offerDeclined")
            : msg.text;
    return (
      <div style={{ textAlign: "center", padding: "4px 0" }}>
        <span
          style={{
            fontSize: 12.5,
            color: "var(--ink-soft)",
            fontStyle: "italic",
            background: "var(--paper-3)",
            padding: "5px 12px",
            borderRadius: 999,
            display: "inline-block",
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  const mine = msg.sender === "me";

  if (msg.type === "OFFER") {
    return (
      <div style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "82%" }}>
        <div
          style={{
            background: "color-mix(in oklab, var(--gold) 14%, var(--paper))",
            border: "1px solid color-mix(in oklab, var(--gold) 40%, var(--paper))",
            borderRadius: 14,
            padding: "12px 14px",
          }}
        >
          <div style={{ fontSize: 12, color: "var(--ink-soft)", fontFamily: "var(--mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {tt("ch.offer")}
          </div>
          <div style={{ fontFamily: "var(--display)", fontWeight: 800, fontSize: 20, color: "var(--ink)", marginTop: 2 }}>
            {rs(msg.offerNPR ?? 0, lang)}
          </div>
          {!mine && (
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button type="button" className="btn btn-sm" onClick={() => onRespond(true)} style={{ background: "var(--green)", color: "var(--paper)" }}>
                {tt("ch.accept")}
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => onRespond(false)}
                style={{ background: "transparent", color: "var(--crimson)", boxShadow: "inset 0 0 0 1.5px var(--crimson)" }}
              >
                {tt("ch.decline")}
              </button>
            </div>
          )}
          {mine && listingId && (
            <div style={{ marginTop: 10 }}>
              <Link href={`/checkout/${listingId}`} className="btn btn-sm btn-primary">
                {tt("ch.proceed")}
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        alignSelf: mine ? "flex-end" : "flex-start",
        maxWidth: "82%",
        background: mine ? "var(--crimson)" : "var(--paper)",
        color: mine ? "var(--paper)" : "var(--ink)",
        border: mine ? "none" : "1px solid var(--line)",
        borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        padding: "10px 14px",
        fontSize: 14.5,
        lineHeight: 1.5,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {msg.text}
    </div>
  );
}
