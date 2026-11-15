"use client";

import { useLoopMusic } from "./useLoopMusic";

// The title screen's music: a loop while `active`, faded out when the game begins.
export function useIntroMusic(active: boolean) {
  useLoopMusic("music.intro", active);
}
