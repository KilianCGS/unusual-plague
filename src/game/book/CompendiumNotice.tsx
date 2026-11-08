"use client";

import { useEffect, useRef, useState } from "react";
import type { BookContext } from "./dynamicPages";
import { getPatientDefinitions } from "../patients/patientRegistry";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import styles from "./CompendiumNotice.module.css";

// Observe recorded knowledge, not bag contents or the currently selected page.
// Mounting a dev fixture establishes a baseline rather than announcing old work.
export function CompendiumNotice({ context }: { context: BookContext }) {
  const definitions = getPatientDefinitions(context.storyFlags);
  const signature = JSON.stringify([
    context.diagnosisPatientId ?? null,
    [...context.knownRecipeIds].sort(),
    Object.entries(context.patients)
      .filter(([, status]) => status !== "hidden")
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, status]) => [id, status, definitions[id]]),
  ]);
  const previous = useRef(signature);
  const [revision, setRevision] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (previous.current === signature) return;
    previous.current = signature;
    // Coalesce synchronous recipe/case changes into one announcement.
    const timer = window.setTimeout(() => {
      setRevision(value => value + 1);
      setVisible(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [signature]);

  useEffect(() => {
    if (!revision) return;
    const timer = window.setTimeout(() => setVisible(false), 4500);
    return () => window.clearTimeout(timer);
  }, [revision]);

  const es = context.language === "es";
  return (
    <div className={styles.region} style={{ fontFamily: PIXEL_FONT_FAMILY }} role="status" aria-live="polite" aria-atomic="true">
      {visible && (
        <div className={styles.notice} key={revision}>
          <span className={styles.symbol} aria-hidden="true">✎</span>
          <div>
            <strong>{es ? "Compendio actualizado" : "Compendium updated"}</strong>
            <span>{es ? "Nuevas anotaciones · Consultar [Q]" : "New notes · Read [Q]"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
