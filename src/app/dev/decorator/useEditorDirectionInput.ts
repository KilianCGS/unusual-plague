"use client";

import { useEffect, useMemo, useRef } from "react";

import type {
  Direction,
  DirectionInputHandle,
} from "../../../game/protagonist/useDirectionInput";

const KEYS: Record<string, Direction> = {
  ArrowUp: "north",
  w: "north",
  ArrowDown: "south",
  s: "south",
  ArrowLeft: "west",
  a: "west",
  ArrowRight: "east",
  d: "east",
};

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT")
  );
}

// Same handle shape as the game's useDirectionInput, but it ignores key events
// aimed at form fields, so the editor's inputs can be typed into. (The game's
// hook swallows w/a/s/d everywhere, which is right for gameplay and wrong for
// a tool with text fields.)
export function useEditorDirectionInput(): DirectionInputHandle {
  const pressedRef = useRef<Record<Direction, boolean>>({
    north: false,
    south: false,
    east: false,
    west: false,
  });
  const priorityRef = useRef<Direction[]>([]);
  const handle = useMemo(() => ({ pressedRef, priorityRef }), []);

  useEffect(() => {
    function release(direction: Direction) {
      pressedRef.current[direction] = false;
      priorityRef.current = priorityRef.current.filter((d) => d !== direction);
    }

    function handleKeyDown(event: KeyboardEvent) {
      const direction = KEYS[event.key];

      if (!direction || isTypingTarget(event.target)) {
        return;
      }

      event.preventDefault();
      pressedRef.current[direction] = true;
      priorityRef.current = [
        ...priorityRef.current.filter((d) => d !== direction),
        direction,
      ];
    }

    function handleKeyUp(event: KeyboardEvent) {
      const direction = KEYS[event.key];

      if (direction) {
        release(direction);
      }
    }

    function releaseAll() {
      (Object.keys(pressedRef.current) as Direction[]).forEach(release);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", releaseAll);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", releaseAll);
    };
  }, []);

  return handle;
}
