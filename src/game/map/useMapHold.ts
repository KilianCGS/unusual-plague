"use client";

import { useEffect, useState } from "react";

// True while TAB is physically held. Press = show the map, release = hide it
// at once. The browser's own TAB (focus change) is suppressed. If the window
// loses focus while TAB is down, the keyup would never arrive, so the map is
// closed on blur. It knows nothing about what the map looks like.
export function useMapHold() {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") {
        return;
      }

      event.preventDefault();
      setHeld(true);
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === "Tab") {
        event.preventDefault();
        setHeld(false);
      }
    }

    const release = () => setHeld(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", release);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", release);
    };
  }, []);

  return held;
}
