"use client";

import { useSyncExternalStore } from "react";

// The player's effects volume (0..1) and mute, remembered in the browser. Same pattern as
// the controls store: the player READS it at play time; the UI subscribes with
// `useAudioSettings`. Storage may be missing or blocked: then it just lives in memory.
const STORAGE_KEY = "unusual-plague.audio.v1";

export type AudioSettings = { volume: number; muted: boolean };

const DEFAULTS: AudioSettings = { volume: 0.7, muted: false };

let current: AudioSettings = DEFAULTS;
let loaded = false;
const listeners = new Set<() => void>();

export function sanitizeAudioSettings(raw: unknown): AudioSettings {
  if (typeof raw !== "object" || raw === null) return DEFAULTS;
  const { volume, muted } = raw as Record<string, unknown>;
  return {
    volume: typeof volume === "number" && Number.isFinite(volume) ? Math.min(1, Math.max(0, volume)) : DEFAULTS.volume,
    muted: muted === true,
  };
}

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) current = sanitizeAudioSettings(JSON.parse(raw));
  } catch {
    current = DEFAULTS;
  }
}

export function getAudioSettings(): AudioSettings {
  if (typeof window !== "undefined") load();
  return current;
}

export function setAudioSettings(next: Partial<AudioSettings>) {
  current = sanitizeAudioSettings({ ...getAudioSettings(), ...next });
  loaded = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // not remembered; still applied for this session
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAudioSettings(): AudioSettings {
  return useSyncExternalStore(subscribe, getAudioSettings, () => DEFAULTS);
}

// Linear 0..1 volume the player should use right now.
export function effectiveVolume(gain = 1): number {
  const { volume, muted } = getAudioSettings();
  return muted ? 0 : Math.min(1, Math.max(0, volume * gain));
}
