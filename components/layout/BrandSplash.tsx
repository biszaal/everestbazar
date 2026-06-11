"use client";

import { useEffect, useState } from "react";
import { SummitMark } from "@/components/brand/SummitMark";

/* Module-level flag: the splash is a "first paint" brand moment. It shows on a
   full document load and is dismissed after the app boots — client-side route
   changes (which keep this component mounted) never re-trigger it. */
let dismissed = false;

const MIN_VISIBLE = 550; // ms — long enough to read as intentional, not a flash
const FADE_MS = 500; // must match the CSS transition on .eb-splash

export function BrandSplash() {
  const [mounted, setMounted] = useState(!dismissed);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const start = performance.now();
    let fadeTimer = 0;
    let unmountTimer = 0;

    const finish = () => {
      const wait = Math.max(0, MIN_VISIBLE - (performance.now() - start));
      fadeTimer = window.setTimeout(() => {
        setHide(true);
        unmountTimer = window.setTimeout(() => {
          dismissed = true;
          setMounted(false);
        }, FADE_MS);
      }, wait);
    };

    let safety = 0;
    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      safety = window.setTimeout(finish, 2500); // fallback if 'load' is slow/blocked
    }

    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(safety);
      window.clearTimeout(fadeTimer);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="eb-splash" data-hide={hide} role="status" aria-label="Loading EverestBazar">
      <div className="eb-splash-inner">
        <span className="eb-float">
          <SummitMark size={56} />
        </span>
        <span
          style={{
            fontFamily: "var(--display)",
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "var(--ink)" }}>Everest</span>
          <span style={{ color: "var(--crimson)" }}>Bazar</span>
        </span>
        <span className="eb-splash-bar" />
      </div>
    </div>
  );
}
