"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "./pixelFont";

// 2026-11-20: the game is played with a KEYBOARD (walking, interacting, the book). On a phone or a tablet it cannot be
// played, so whoever opens the link there is told so, once, and can still go on (a tablet with a keyboard exists).
// NEW TEXT (ES/EN), awaiting Kilian's review.
const COPY: Record<Language, { title: string; body: string; go: string }> = {
  es: {
    title: "Mejor en un ordenador",
    body: "Unusual Plague se juega con teclado. En un móvil o una tableta sin teclado no se puede jugar. Ábrelo desde un ordenador.",
    go: "Entrar de todos modos",
  },
  en: {
    title: "Best on a computer",
    body: "Unusual Plague is played with a keyboard. It cannot be played on a phone or a tablet without one. Open it on a computer.",
    go: "Enter anyway",
  },
};

// A touch-first device (no mouse hover, a coarse pointer) or a very narrow window.
export function isLikelyWithoutKeyboard(coarsePointer: boolean, noHover: boolean, width: number): boolean {
  return (coarsePointer && noHover) || width < 600;
}

export function DeviceNotice({ language }: { language: Language }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const noHover = window.matchMedia("(hover: none)").matches;
      setShow(isLikelyWithoutKeyboard(coarse, noHover, window.innerWidth));
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  if (!show) return null;
  const copy = COPY[language];
  const style: CSSProperties = {
    position: "fixed", inset: 0, zIndex: 2500, display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 16, padding: 28, textAlign: "center", background: "rgba(8,6,4,0.94)", color: "#f4ead5",
    fontFamily: PIXEL_FONT_FAMILY,
  };
  return (
    <div style={style} role="dialog" aria-modal="true" data-device-notice>
      <p style={{ margin: 0, fontSize: 24 }}>{copy.title}</p>
      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5, maxWidth: 420 }}>{copy.body}</p>
      <button type="button" onClick={() => setShow(false)} style={{ padding: "10px 22px", font: "700 15px monospace", color: "#f4ead5", background: "#4a3524", border: "3px solid #1c110c", cursor: "pointer" }}>
        {copy.go}
      </button>
    </div>
  );
}
