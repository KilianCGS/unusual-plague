"use client";

import { useEffect, useMemo, useRef } from "react";
import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import { DIAGNOSIS_SYMPTOMS, getDiagnosisOptions } from "./diagnosis";
import styles from "./DiagnosisOverlay.module.css";

export function DiagnosisOverlay({ patientId, language, onChoose, onConsult }: {
  patientId: string;
  language: Language;
  onChoose: (id: string) => void;
  onConsult: () => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const options = useMemo(() => getDiagnosisOptions(language), [language]);
  const es = language === "es";
  useEffect(() => {
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    function keyDown(event: KeyboardEvent) {
      if (event.repeat) return;
      // keys 1-9 pick the first nine options and 0 the tenth
      const index = event.key === "0" ? 9 : Number(event.key) - 1;
      if (/^[0-9]$/.test(event.key) && options[index]) {
        event.preventDefault();
        onChoose(options[index].id);
      }
      if (event.key === "Tab") {
        const buttons = panel.current?.querySelectorAll<HTMLButtonElement>("button");
        if (!buttons?.length) return;
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    window.addEventListener("keydown", keyDown);
    return () => window.removeEventListener("keydown", keyDown);
  }, [onChoose, options]);

  return <div className={styles.backdrop} style={{ fontFamily: PIXEL_FONT_FAMILY }}>
    <div ref={panel} className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="diagnosis-title" aria-describedby="diagnosis-symptoms">
      <h2 id="diagnosis-title">{es ? "¿Qué dolencia sospechas?" : "Which ailment do you suspect?"}</h2>
      <p id="diagnosis-symptoms" className={styles.thought}>({DIAGNOSIS_SYMPTOMS[patientId][language]})</p>
      <div className={styles.options}>
        {options.map((option, index) => <button key={option.id} type="button" onClick={() => onChoose(option.id)}>
          <span aria-hidden="true">{(index + 1) % 10}. </span>{option.label}
        </button>)}
      </div>
      <button className={styles.consult} type="button" onClick={onConsult}>{es ? "Consultar el Compendio [Q]" : "Consult the Compendium [Q]"}</button>
      <p className={styles.hint}>{es ? "Puedes reconsiderarlo sin penalización. Elige con el ratón o las teclas 1–0." : "You can reconsider without penalty. Choose with the mouse or keys 1–0."}</p>
    </div>
  </div>;
}
