"use client";

import { useEffect, useRef } from "react";

import { rectsIntersect, type LogicalRect } from "../collision";

export type TransitionExit = { name: string; zone: LogicalRect };

// Reports when the feet hitbox enters an exit zone. It knows only rectangles:
// nothing about scenes, fades or input.
//
// Arming: a freshly mounted scene starts DISARMED. It arms itself the first
// time the feet are outside every zone, so arriving on top of a zone can never
// trigger it. Triggering needs armed + enabled. After a trigger it disarms
// again, so a zone fires once per entry.
export function useTransitionTrigger({
  feetHitbox,
  exits,
  enabled,
  onExit,
}: {
  feetHitbox: LogicalRect;
  exits: TransitionExit[];
  enabled: boolean;
  onExit: (exitName: string) => void;
}) {
  const armedRef = useRef(false);

  useEffect(() => {
    const hit = exits.find((exit) => rectsIntersect(feetHitbox, exit.zone));

    if (!hit) {
      armedRef.current = true;
      return;
    }

    if (armedRef.current && enabled) {
      armedRef.current = false;
      onExit(hit.name);
    }
  }, [feetHitbox, exits, enabled, onExit]);
}
