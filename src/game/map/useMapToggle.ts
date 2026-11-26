"use client";

import { useEffect } from "react";

import { getBindings } from "../controls/controlsStore";
import { matchesAction } from "../controls/keybindings";

// The map key (M by default) opens and closes the map; Esc closes it too. Edge-triggered (key repeat is ignored) and the
// browser's own handling of the key is suppressed. `canOpen` is the owner's rule for "plain play": closing is always allowed.
// (2026-11-26, Kilian: the map used to be shown only while a key was held.)
export function useMapToggle({
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
      if (matchesAction(getBindings(), "map", event.key)) {
        event.preventDefault();
        if (event.repeat) return;
        if (open) setOpen(false);
        else if (canOpen) setOpen(true);
      } else if (event.key === "Escape" && open && !event.repeat) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, canOpen, setOpen]);
}
