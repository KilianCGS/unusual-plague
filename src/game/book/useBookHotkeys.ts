"use client";

import { useEffect } from "react";

// Q toggles the Compendium, Esc closes it. Edge-triggered (key repeat is
// ignored). TAB is deliberately NOT handled: it is reserved for the future map.
export function useBookHotkeys({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return;
      }

      if (event.key === "q" || event.key === "Q") {
        setOpen(!open);
      } else if (event.key === "Escape" && open) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);
}
