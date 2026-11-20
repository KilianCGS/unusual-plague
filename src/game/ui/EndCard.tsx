"use client";

import type { CSSProperties } from "react";

import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "./pixelFont";

// THE END (2026-11-12): shown after the closing of Day 4. NEW text, awaiting Kilian's review.
// It covers the game, so nothing can be done behind it; the button starts again from the
// title screen (a full reload: nothing is saved).
// 2026-11-19 (Kilian): the closing goes to black and an EPILOGUE about the harm of the artifacts: a plague nobody wants
// to be cured of. NEW TEXT (ES/EN), awaiting his review. Each paragraph fades in after the one before.
const COPY: Record<Language, { end: string; thanks: string; again: string; epilogue: string[] }> = {
  es: {
    end: "FIN",
    thanks: "Gracias por jugar.",
    again: "Volver al inicio",
    epilogue: [
      "Esta peste no da fiebre ni deja marcas. No se huele, no se contagia por el aire: se contagia por los ojos.",
      "Se llevó primero las conversaciones, luego los oficios, y al final las miradas. Nadie la sufre como un mal.",
      "Y por eso es la más difícil de tratar: nadie quiere curarse de lo que cree que le hace compañía.",
      "El remedio no se bebe ni se unta. Se ofrece, de persona a persona, y cada cual decide si levanta la cabeza.",
    ],
  },
  en: {
    end: "The end",
    thanks: "Thank you for playing.",
    again: "Back to the start",
    epilogue: [
      "This plague brings no fever and leaves no marks. It has no smell and does not travel on the air: it spreads through the eyes.",
      "It took the conversations first, then the trades, and at last the glances. Nobody suffers it as an illness.",
      "That is why it is the hardest to treat: nobody wants to be cured of what they believe keeps them company.",
      "The remedy is not drunk or rubbed on. It is offered, from person to person, and each one decides whether to look up.",
    ],
  },
};

const EPILOGUE_STEP_S = 3.2;

export function EndCard({ language, onLeave }: { language: Language; onLeave?: () => void }) {
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

  const lateStart = copy.epilogue.length * EPILOGUE_STEP_S + 1;
  const fadeIn = (delayS: number): CSSProperties => ({
    opacity: 0,
    animation: `endCardFadeIn 2.2s ease forwards`,
    animationDelay: `${delayS}s`,
  });

  return (
    <div style={style} role="dialog" aria-modal="true" data-end-card>
      <style>{"@keyframes endCardFadeIn { to { opacity: 1; } }"}</style>
      <div style={{ maxWidth: 640, padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {copy.epilogue.map((paragraph, index) => (
          <p key={index} style={{ margin: 0, fontSize: 17, lineHeight: 1.6, ...fadeIn(index * EPILOGUE_STEP_S) }}>
            {paragraph}
          </p>
        ))}
      </div>
      <p style={{ margin: "18px 0 0", fontSize: 44, letterSpacing: "0.3em", ...fadeIn(lateStart) }}>{copy.end}</p>
      <p style={{ margin: 0, fontSize: 16, ...fadeIn(lateStart + 1) }}>{copy.thanks}</p>
      <button
        type="button"
        onClick={() => (onLeave ? onLeave() : window.location.reload())}
        style={{
          ...fadeIn(lateStart + 2),
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
