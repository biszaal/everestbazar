/* EverestBazar — display formatting helpers. */

import type { Lang } from "@/lib/i18n";

/** Format an integer NPR amount, localized. e.g. 78000 → "Rs 78,000" / "रु ७८,०००". */
export function rs(n: number, lang: Lang = "en"): string {
  const formatted = n.toLocaleString("en-IN");
  return (lang === "ne" ? "रु " : "Rs ") + formatted;
}

/** Western digits → Devanagari digits (for the Nepali UI). */
export function toDevanagariDigits(input: string | number): string {
  const map = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  return String(input).replace(/\d/g, (d) => map[Number(d)]);
}

/** "2h ago" / "३ दिन अघि" style relative time. */
export function formatRelative(iso: string, lang: Lang = "en"): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  const n = (v: number) => (lang === "ne" ? toDevanagariDigits(v) : String(v));
  if (m < 1) return lang === "ne" ? "अहिले" : "Just now";
  if (h < 1) return lang === "ne" ? `${n(m)} मिनेट अघि` : `${m}m ago`;
  if (d < 1) return lang === "ne" ? `${n(h)} घण्टा अघि` : `${h}h ago`;
  return lang === "ne" ? `${n(d)} दिन अघि` : `${d}d ago`;
}

/** "Jun 2026" style month-year. */
export function formatMonthYear(iso: string, lang: Lang = "en"): string {
  return new Date(iso).toLocaleDateString(lang === "ne" ? "ne-NP" : "en-GB", {
    month: "short",
    year: "numeric",
  });
}
