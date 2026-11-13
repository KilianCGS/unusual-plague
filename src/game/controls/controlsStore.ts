"use client";

import { useSyncExternalStore } from "react";

import {
  cloneBindings,
  defaultBindings,
  sanitizeBindings,
  type Bindings,
} from "./keybindings";

// The player's key bindings for the whole session, remembered in the browser. Key
// handlers READ them at the moment of the key press (`getBindings`), so they never keep
// an old copy; the UI subscribes with `useBindings`. Storage may be missing or blocked
// (private window...): then the bindings simply live in memory.
const STORAGE_KEY = "unusual-plague.controls.v1";

let current: Bindings = defaultBindings();
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) current = sanitizeBindings(JSON.parse(raw));
  } catch {
    current = defaultBindings();
  }
}

export function getBindings(): Bindings {
  if (typeof window !== "undefined") load();
  return current;
}

export function setBindings(next: Bindings) {
  current = cloneBindings(next);
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

const SERVER_SNAPSHOT = defaultBindings();

export function useBindings(): Bindings {
  return useSyncExternalStore(subscribe, getBindings, () => SERVER_SNAPSHOT);
}
