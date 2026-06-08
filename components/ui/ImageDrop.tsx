"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { Icon } from "@/components/brand/Icon";

interface ImageDropProps {
  label: string;
  hint: string;
  removeLabel: string;
  value: string; // object URL or ""
  onChange: (url: string) => void;
  onFile?: (file: File) => void;
}

export function ImageDrop({ label, hint, removeLabel, value, onChange, onFile }: ImageDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<string>("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    };
  }, []);

  const accept = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    onChange(url);
    onFile?.(file);
  };

  const clear = () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = "";
    onChange("");
  };

  return (
    <div>
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

      {value ? (
        <div
          style={{
            position: "relative",
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid var(--line-2)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
          />
          <button
            type="button"
            onClick={clear}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(33,27,22,0.82)",
              color: "var(--paper)",
              border: "none",
              borderRadius: 999,
              padding: "6px 12px",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {removeLabel}
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e: DragEvent) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e: DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            accept(e.dataTransfer.files?.[0]);
          }}
          style={{
            border: "1.5px dashed",
            borderColor: dragOver ? "var(--crimson)" : "var(--line-2)",
            background: dragOver
              ? "color-mix(in oklab, var(--crimson) 6%, var(--paper))"
              : "var(--paper-2)",
            borderRadius: 14,
            padding: "26px 18px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all .15s",
          }}
        >
          <div style={{ display: "grid", placeItems: "center", gap: 10 }}>
            <Icon name="upload" size={26} stroke="var(--ink-soft)" />
            <span style={{ fontSize: 13, color: "var(--ink-soft)", maxWidth: 280 }}>
              {hint}
            </span>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => accept(e.target.files?.[0])}
      />
    </div>
  );
}
