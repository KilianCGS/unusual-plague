"use client";

import { useEffect, useRef } from "react";

// Calls `onMoved` whenever the Doctor's position really changes, as reported
// by the movement controller (not by key presses). A freshly mounted scene
// starts at its spawn, so arriving never counts as moving.
export function usePlayerMoved(
  x: number,
  y: number,
  onMoved: (() => void) | undefined,
) {
  const lastRef = useRef({ x, y });
  const onMovedRef = useRef(onMoved);

  useEffect(() => {
    onMovedRef.current = onMoved;
  });

  useEffect(() => {
    if (lastRef.current.x !== x || lastRef.current.y !== y) {
      lastRef.current = { x, y };
      onMovedRef.current?.();
    }
  }, [x, y]);
}
