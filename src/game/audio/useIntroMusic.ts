"use client";

import { useLoopMusic } from "./useLoopMusic";

// The title music: it keeps playing through the intro text and fades out slowly (a long
// decrescendo) when the Doctor writing at his desk appears.
const INTRO_FADE_OUT_MS = 3000;

export function useIntroMusic(active: boolean) {
  useLoopMusic("music.intro", active, INTRO_FADE_OUT_MS);
}
