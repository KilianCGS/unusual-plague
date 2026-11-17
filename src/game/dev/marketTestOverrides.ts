import { useSyncExternalStore } from "react";

// DEV-ONLY live overrides for the market street (the /dev/market-test tool, 2026-11-16, Kilian): the camera
// zoom, the Doctor's size and the size of the inventory and coins, changed while playing. The real game never
// sets them (the value stays null), so it reads the scene's own numbers as always.
export type MarketTestValues = {
  zoomMultiplier: number;
  protagonistScale: number;
  hudScale: number;
};

let current: MarketTestValues | null = null;
const listeners = new Set<() => void>();

export function setMarketTestOverrides(values: MarketTestValues | null) {
  current = values;
  listeners.forEach((listener) => listener());
}

export function useMarketTestOverrides(): MarketTestValues | null {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
    () => null,
  );
}
