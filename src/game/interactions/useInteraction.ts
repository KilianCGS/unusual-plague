"use client";

import { useEffect, useRef } from "react";

import type { LogicalRect } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";
import {
  findAvailableInteraction,
  type InteractionZone,
} from "./interactionZone";

// Reports the interaction currently available to the player and fires
// `onInteract(interactionId)` when E is pressed. It knows only rectangles,
// facing and one key: nothing about scenes, fades, NPCs or what an
// interaction does.
//
// Entering a zone only makes the interaction available; it never fires by
// itself. E is edge-triggered: one press = at most one call. Holding it
// (keyboard auto-repeat) does nothing until it is released and pressed again.
export function useInteraction({
  zones,
  feetHitbox,
  facing,
  enabled,
  onInteract,
}: {
  zones: readonly InteractionZone[];
  feetHitbox: LogicalRect;
  facing: Direction;
  // False while a fade / scene change is running: nothing is available.
  enabled: boolean;
  onInteract: (interactionId: string) => void;
}) {
  const available = enabled
    ? findAvailableInteraction(zones, feetHitbox, facing)
    : null;
  const availableRef = useRef(available);
  const onInteractRef = useRef(onInteract);
  const eHeldRef = useRef(false);

  useEffect(() => {
    availableRef.current = available;
    onInteractRef.current = onInteract;
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "e" && event.key !== "E") {
        return;
      }

      if (event.repeat || eHeldRef.current) {
        return;
      }

      eHeldRef.current = true;

      const current = availableRef.current;

      if (current) {
        onInteractRef.current(current.interactionId);
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === "e" || event.key === "E") {
        eHeldRef.current = false;
      }
    }

    function releaseE() {
      eHeldRef.current = false;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", releaseE);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", releaseE);
    };
  }, []);

  return available;
}
