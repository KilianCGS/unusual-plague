import type { Language } from "./types";

// Texts of the volume control (pause menu and controls screen). New text, awaiting review.
export const audioCopy: Record<Language, { volume: string; mute: string; unmute: string }> = {
  es: { volume: "Sonido", mute: "Silenciar", unmute: "Activar" },
  en: { volume: "Sound", mute: "Mute", unmute: "Unmute" },
};
