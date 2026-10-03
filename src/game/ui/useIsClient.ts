"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => undefined;

// False during SSR and hydration, true afterwards. ExteriorScene derives its
// zoom from window.innerWidth/Height, so a server-rendered copy would not match
// the client and React would keep the stale server style. The dev preview
// pages (which are server-rendered, unlike the game that mounts after the
// title screen) render the scene only once this is true.
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
