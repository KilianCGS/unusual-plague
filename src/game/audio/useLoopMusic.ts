"use client";

import { useEffect } from "react";

import { effectiveVolume, getAudioSettings } from "./audioStore";
import { SOUNDS, type SoundId } from "./soundManifest";

const DEFAULT_FADE_OUT_MS = 900;

// A music loop that plays while `active` and fades out when it stops being active (or the
// component goes away). Browsers do not let sound start before the player has done something, so
// if the first try is refused it starts at the first click or key press. It follows the player's
// volume and mute setting live.
export function useLoopMusic(sound: SoundId, active: boolean, fadeOutMs: number = DEFAULT_FADE_OUT_MS) {
  useEffect(() => {
    if (!active || typeof Audio === "undefined") return;

    const def = SOUNDS[sound];
    const audio = new Audio(def.src);
    audio.loop = true;
    audio.volume = effectiveVolume(def.gain);

    let stopped = false;
    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    function start() {
      if (stopped) return;
      audio.play().then(removeGestureListeners).catch(() => {});
    }
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    start();

    // follow the volume / mute setting while it plays
    let last = getAudioSettings();
    const sync = window.setInterval(() => {
      const now = getAudioSettings();
      if (now !== last) {
        last = now;
        audio.volume = effectiveVolume(def.gain);
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
      }, fadeOutMs / steps);
    };
  }, [sound, active, fadeOutMs]);
}
