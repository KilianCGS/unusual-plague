"use client";

import { useEffect } from "react";

// I toggles the Inventory, Esc closes it. Edge-triggered, like the Book's
// hotkeys (key repeat is ignored).
export function useInventoryHotkeys({
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

      if (event.key === "i" || event.key === "I") {
        setOpen(!open);
      } else if (event.key === "Escape" && open) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);
}
