"use client";

import { useEffect } from "react";

import { effectiveVolume, getAudioSettings } from "./audioStore";
import { SOUNDS } from "./soundManifest";

const FADE_OUT_MS = 900;

// The title screen's music: a loop while `active`, faded out when it stops being active. Browsers
// do not let sound start before the player has done something, so if the first try is refused it
// starts at the first click or key press. It follows the player's volume and mute setting live.
export function useIntroMusic(active: boolean) {
  useEffect(() => {
    if (!active || typeof Audio === "undefined") return;

    const audio = new Audio(SOUNDS["music.intro"].src);
    audio.loop = true;
    audio.volume = effectiveVolume(SOUNDS["music.intro"].gain);

    let stopped = false;
    const start = () => {
      if (stopped) return;
      audio.play().then(removeGestureListeners).catch(() => {});
    };
    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    start();

    // follow the volume / mute setting while the screen is up
    let last = getAudioSettings();
    const sync = window.setInterval(() => {
      const now = getAudioSettings();
      if (now !== last) {
        last = now;
        audio.volume = effectiveVolume(SOUNDS["music.intro"].gain);
      }
    }, 150);

    return () => {
      stopped = true;
      removeGestureListeners();
      window.clearInterval(sync);
      // fade out instead of cutting
      const from = audio.volume;
      const steps = 12;
      let step = 0;
      const fade = window.setInterval(() => {
        step += 1;
        audio.volume = Math.max(0, from * (1 - step / steps));
        if (step >= steps) {
          window.clearInterval(fade);
          audio.pause();
        }
      }, FADE_OUT_MS / steps);
    };
  }, [active]);
}
