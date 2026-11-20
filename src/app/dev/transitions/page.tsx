"use client";

import { useState } from "react";
import type { CSSProperties } from "react";

import { DOCTOR_SPEAKER } from "../../../game/dialogue/dialogueTypes";
import { day1Closing } from "../../../game/dialogue/chapter1Day1Dialogues";
import { day2Closing } from "../../../game/dialogue/chapter2ClosingDialogues";
import { day3Closing } from "../../../game/dialogue/chapter3ClosingDialogues";
import { day4Closing } from "../../../game/dialogue/chapter4Dialogues";
import { chapter1Intro } from "../../../game/dialogue/chapter1Intro";
import { localizeConversation, type LocalizedConversation } from "../../../game/dialogue/localizedConversation";
import { introScreenCopy } from "../../../game/i18n/introScreen";
import type { Language } from "../../../game/i18n/types";
import { IntroScreen } from "../../../game/intro/IntroScreen";
import { NARRATIVE_ILLUSTRATIONS, type NarrativeIllustrationId } from "../../../game/narrative/illustrations";
import { NarrativeInterlude } from "../../../game/narrative/NarrativeInterlude";
import { useLoopMusic } from "../../../game/audio/useLoopMusic";
import { EndCard } from "../../../game/ui/EndCard";
import { useIsClient } from "../../../game/ui/useIsClient";

// DEV-ONLY (2026-11-20): plays the game's transitions on their own, to look at them: the intro text, the opening of
// Day 1, the three day closings and the end of the game. They are the very components the game uses, with the same
// texts and pictures; nothing here changes the game or saves anything. Esc skips an interlude, as in the game.
type Which = "intro" | "opening" | "close1" | "close2" | "close3" | "end" | "endcard";

const INTERLUDES: Record<"opening" | "close1" | "close2" | "close3" | "end", { picture: NarrativeIllustrationId; conversation: LocalizedConversation }> = {
  opening: { picture: "doctor-writing", conversation: chapter1Intro },
  close1: { picture: "doctor-eating", conversation: day1Closing },
  close2: { picture: "doctor-cooking", conversation: day2Closing },
  close3: { picture: "doctor-in-bed", conversation: day3Closing },
  end: { picture: "doctor-writing-night", conversation: day4Closing },
};

const ITEMS: { id: Which; label: string; note: string }[] = [
  { id: "intro", label: "1. Intro del juego", note: "Los textos sobre negro, antes de empezar" },
  { id: "opening", label: "1b. Apertura del día 1", note: "El Doctor escribiendo (al empezar a jugar)" },
  { id: "close1", label: "2. Final del día 1 → día 2", note: "El Doctor cenando" },
  { id: "close2", label: "3. Final del día 2 → día 3", note: "El Doctor cocinando de noche" },
  { id: "close3", label: "4. Final del día 3 → día 4", note: "El Doctor en la cama, la luna, el ruido y la luz" },
  { id: "end", label: "5. Final del juego", note: "Cierre del día 4 + epílogo + FIN" },
];

const panel: CSSProperties = { position: "fixed", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: "#0b0907", color: "#f4ead5", font: "15px monospace" };
const button: CSSProperties = { width: 440, padding: "10px 14px", textAlign: "left", font: "inherit", color: "#f4ead5", background: "#2a1d14", border: "2px solid #8a6a47", cursor: "pointer" };

export default function TransitionsDevPage() {
  const isClient = useIsClient();
  const [language, setLanguage] = useState<Language>("es");
  const [which, setWhich] = useState<Which | null>(null);
  const back = () => setWhich(null);
  // the music of the end of the game plays over its closing and the end card, as in the game
  useLoopMusic("music.end", which === "end" || which === "endcard", 1800);

  if (!isClient) return null;

  if (which === "intro") {
    return <IntroScreen key={language} lines={introScreenCopy[language].blocks} onComplete={back} />;
  }
  if (which === "endcard") return <EndCard language={language} />;
  if (which) {
    const { picture, conversation } = INTERLUDES[which];
    return (
      <NarrativeInterlude
        key={`${which}-${language}`}
        illustration={NARRATIVE_ILLUSTRATIONS[picture]}
        conversation={localizeConversation(conversation, language, DOCTOR_SPEAKER)}
        language={language}
        // the end of the game goes on to its epilogue card, like the game
        onFinished={which === "end" ? () => setWhich("endcard") : back}
      />
    );
  }

  return (
    <main style={panel}>
      <strong style={{ fontSize: 18 }}>/dev/transitions</strong>
      <span style={{ opacity: 0.75, marginBottom: 6 }}>Las transiciones del juego, sueltas. Esc salta una. Nada se guarda.</span>
      <span>
        {(["es", "en"] as Language[]).map((l) => (
          <button key={l} type="button" onClick={() => setLanguage(l)} disabled={l === language} style={{ ...button, width: 60, textAlign: "center", marginRight: 6 }}>
            {l.toUpperCase()}
          </button>
        ))}
      </span>
      {ITEMS.map((item) => (
        <button key={item.id} type="button" style={button} onClick={() => setWhich(item.id)}>
          <strong>{item.label}</strong>
          <br />
          <span style={{ opacity: 0.7 }}>{item.note}</span>
        </button>
      ))}
      <button type="button" style={{ ...button, background: "#1b2a1d" }} onClick={() => setWhich("endcard")}>
        <strong>Solo la pantalla final (epílogo + FIN)</strong>
      </button>
    </main>
  );
}
