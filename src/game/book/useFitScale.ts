"use client";

import { useEffect, useState } from "react";

// If a whole-number scale is at most this much smaller than the exact fit, use
// it: integer scales keep every art pixel the same size. Otherwise fall back
// to the exact (fractional) fit so the book keeps its intended size.
const SNAP_TOLERANCE = 1.15;

function computeScale(width: number, height: number, fraction: number) {
  if (typeof window === "undefined") {
    return 1;
  }

  const fit = Math.min(
    (window.innerWidth * fraction) / width,
    (window.innerHeight * fraction) / height,
  );
  const whole = Math.floor(fit);

  return whole >= 1 && fit / whole <= SNAP_TOLERANCE ? whole : fit;
}

// Scale that fits a width x height UI box into `fraction` of the window,
// keeping its aspect ratio. Screen-space UI: it never reads world or camera
// coordinates.
export function useFitScale(width: number, height: number, fraction: number) {
  const [scale, setScale] = useState(() =>
    computeScale(width, height, fraction),
  );

  useEffect(() => {
    const update = () => setScale(computeScale(width, height, fraction));

    update();
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, [width, height, fraction]);

  return scale;
}
