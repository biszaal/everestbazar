"use client";

import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  error?: boolean;
  disabled?: boolean;
}

export function OTPInput({
  value,
  onChange,
  onComplete,
  length = 6,
  error = false,
  disabled = false,
}: OTPInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const setChar = (i: number, char: string) => {
    const next = value.split("");
    next[i] = char;
    const joined = next.join("").slice(0, length);
    onChange(joined);
    return joined;
  };

  const handleChange = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    if (!digit) return;
    const joined = setChar(i, digit);
    if (i < length - 1) refs.current[i + 1]?.focus();
    if (joined.replace(/\D/g, "").length === length) onComplete?.(joined);
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[i]) {
        setChar(i, "");
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
        setChar(i - 1, "");
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    onChange(digits);
    const focusIdx = Math.min(digits.length, length - 1);
    refs.current[focusIdx]?.focus();
    if (digits.length === length) onComplete?.(digits);
  };

  return (
    <div
      className={error ? "eb-shake" : undefined}
      style={{ display: "flex", gap: 8, justifyContent: "center" }}
    >
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          style={{
            flex: "1 1 0",
            minWidth: 0,
            maxWidth: 48,
            height: 54,
            textAlign: "center",
            fontFamily: "var(--display)",
            fontWeight: 700,
            fontSize: 22,
            color: "var(--ink)",
            background: "var(--paper)",
            border: "1.5px solid",
            borderColor: error
              ? "var(--crimson)"
              : value[i]
                ? "var(--ink)"
                : "var(--line-2)",
            borderRadius: 12,
            outline: "none",
            transition: "border-color .15s",
          }}
        />
      ))}
    </div>
  );
}
