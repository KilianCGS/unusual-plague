"use client";

import type { CSSProperties } from "react";

import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "./pixelFont";

// THE END (2026-11-12): shown after the closing of Day 4. NEW text, awaiting Kilian's review.
// It covers the game, so nothing can be done behind it; the button starts again from the
// title screen (a full reload: nothing is saved).
const COPY: Record<Language, { end: string; thanks: string; again: string }> = {
  es: { end: "FIN", thanks: "Gracias por jugar.", again: "Volver al inicio" },
  en: { end: "THE END", thanks: "Thank you for playing.", again: "Back to the start" },
};

export function EndCard({ language }: { language: Language }) {
  const copy = COPY[language];
  const style: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 1500,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    background: "#05060d",
    color: "#f4ead5",
    fontFamily: PIXEL_FONT_FAMILY,
    textAlign: "center",
  };

  return (
    <div style={style} role="dialog" aria-modal="true" data-end-card>
      <p style={{ margin: 0, fontSize: 44, letterSpacing: "0.3em" }}>{copy.end}</p>
      <p style={{ margin: 0, fontSize: 16, opacity: 0.8 }}>{copy.thanks}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        style={{
          marginTop: 12,
          padding: "10px 26px",
          font: "700 15px monospace",
          color: "#f4ead5",
          background: "#4a3524",
          border: "3px solid #1c110c",
          boxShadow: "inset 0 0 0 2px #8a6a47",
          cursor: "pointer",
        }}
        autoFocus
      >
        {copy.again}
      </button>
    </div>
  );
}
