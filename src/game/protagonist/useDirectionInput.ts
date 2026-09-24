"use client";

import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";

export type Direction = "north" | "south" | "east" | "west";

// Physical state of the direction keys plus their press order (the most
// recently pressed held key wins). It knows nothing about scenes, fades,
// transitions or collisions.
export type DirectionInputHandle = {
  pressedRef: MutableRefObject<Record<Direction, boolean>>;
  priorityRef: MutableRefObject<Direction[]>;
};

const directionKeys: Record<string, Direction> = {
  ArrowUp: "north",
  w: "north",
  ArrowDown: "south",
  s: "south",
  ArrowLeft: "west",
  a: "west",
  ArrowRight: "east",
  d: "east",
};

function createPressedState(): Record<Direction, boolean> {
  return { north: false, south: false, east: false, west: false };
}

// Registers the keyboard listeners once for as long as the caller stays
// mounted. Whoever owns the handle decides how long the input lives: a scene
// that is remounted keeps the keys that are still physically held as long as
// the handle is owned by a parent that outlives it.
// `listen: false` returns an idle handle (used when an external handle is
// supplied instead).
export function useDirectionInput({ listen = true } = {}): DirectionInputHandle {
  const pressedRef = useRef<Record<Direction, boolean>>(createPressedState());
  const priorityRef = useRef<Direction[]>([]);
  const handle = useMemo(() => ({ pressedRef, priorityRef }), []);

  useEffect(() => {
    if (!listen) {
      return;
    }

    function releaseAll() {
      pressedRef.current = createPressedState();
      priorityRef.current = [];
    }

    function handleKeyDown(event: KeyboardEvent) {
      const direction = directionKeys[event.key];

      if (!direction) {
        return;
      }

      event.preventDefault();
      pressedRef.current[direction] = true;
      priorityRef.current = [
        ...priorityRef.current.filter(
          (activeDirection) => activeDirection !== direction,
        ),
        direction,
      ];
    }

    function handleKeyUp(event: KeyboardEvent) {
      const direction = directionKeys[event.key];

      if (!direction) {
        return;
      }

      event.preventDefault();
      pressedRef.current[direction] = false;
      priorityRef.current = priorityRef.current.filter(
        (activeDirection) => activeDirection !== direction,
      );
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    // A key released while the window is not focused never sends a keyup:
    // drop every key so none stays stuck.
    window.addEventListener("blur", releaseAll);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", releaseAll);
      releaseAll();
    };
  }, [listen]);

  return handle;
}
