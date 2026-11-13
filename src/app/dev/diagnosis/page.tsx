"use client";

import { DiagnosisOverlay } from "../../../game/patients/DiagnosisOverlay";
import { DIAGNOSIS_SYMPTOMS } from "../../../game/patients/diagnosis";

// Preview of the diagnosis window (the real one is opened from an examination).
export default function DiagnosisPreview() {
  const patientId = Object.keys(DIAGNOSIS_SYMPTOMS)[0];
  return (
    <DiagnosisOverlay
      patientId={patientId}
      language="es"
      onChoose={() => undefined}
      onConsult={() => undefined}
    />
  );
}
