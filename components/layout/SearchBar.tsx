"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/components/providers/LanguageProvider";
import { Icon } from "@/components/brand/Icon";

/** Persistent marketplace search — routes to /browse?q=… */
export function SearchBar({ className }: { className?: string }) {
  const { t } = useT();
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = () => {
    const v = q.trim();
    router.push(v ? `/browse?q=${encodeURIComponent(v)}` : "/browse");
  };

  return (
    <form
      role="search"
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      style={{ position: "relative", display: "flex", alignItems: "center", minWidth: 0 }}
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("browse.searchPh")}
        aria-label={t("browse.searchPh")}
        enterKeyHint="search"
        style={{
          width: "100%",
          height: 46,
          padding: "0 58px 0 18px",
          borderRadius: 999,
          border: "1px solid var(--line-2)",
          background: "var(--surface)",
          fontFamily: "var(--body)",
          fontSize: 15,
          color: "var(--ink)",
          outline: "none",
        }}
      />
      <button
        type="submit"
        aria-label="Search"
        style={{
          position: "absolute",
          right: 5,
          top: 5,
          bottom: 5,
          width: 46,
          borderRadius: 999,
          border: "none",
          background: "var(--crimson)",
          color: "#fff",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon name="search" size={18} sw={2.4} stroke="#fff" />
      </button>
    </form>
  );
}
