"use client";

import { useEffect, useRef } from "react";

// Tells the owner (above the scenes) whether the Doctor is running, as the
// movement controller reports it, and that he no longer is when the scene
// goes away. Like usePlayerMoved, it only reports: it never drives anything.
export function useReportRunning(
  isRunning: boolean,
  onRunningChange: ((running: boolean) => void) | undefined,
) {
  const onRunningChangeRef = useRef(onRunningChange);

  useEffect(() => {
    onRunningChangeRef.current = onRunningChange;
  });

  useEffect(() => {
    onRunningChangeRef.current?.(isRunning);
  }, [isRunning]);

  useEffect(() => {
    const report = onRunningChangeRef;

    return () => report.current?.(false);
  }, []);
}
