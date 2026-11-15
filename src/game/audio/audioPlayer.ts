"use client";

import { effectiveVolume } from "./audioStore";
import { SOUNDS, type SoundId } from "./soundManifest";

// Plays a sound by id. Each call makes a fresh element so quick repeats (steps, chopping)
// overlap instead of cutting each other. Browsers refuse to play before the first user
// gesture: that rejection is swallowed on purpose (the game always starts with a click).
export function playSound(id: SoundId, options: { rate?: number; volume?: number } = {}): HTMLAudioElement | null {
  if (typeof window === "undefined" || typeof Audio === "undefined") return null;
  const def = SOUNDS[id];
  const volume = effectiveVolume(def.gain * (options.volume ?? 1));
  if (volume <= 0) return null;
  const audio = new Audio(def.src);
  audio.volume = volume;
  audio.playbackRate = options.rate ?? 1;
  audio.play().catch(() => {});
  return audio;
}
