"use client";

import { useEffect } from "react";

import { getBindings } from "../controls/controlsStore";
import { matchesAction } from "../controls/keybindings";

// The case key (I by default) opens and closes the Doctor's case; Esc closing is the overlay's own.
// Edge-triggered (key repeat is ignored). `canOpen` is the owner's rule for "plain play": closing is always allowed.
export function useInventoryHotkey({
  open,
  canOpen,
  setOpen,
}: {
  open: boolean;
  canOpen: boolean;
  setOpen: (open: boolean) => void;
}) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) return;

      if (matchesAction(getBindings(), "inventory", event.key)) {
        if (open) setOpen(false);
        else if (canOpen) setOpen(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, canOpen, setOpen]);
}
