"use client";

import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";

import { setAudioSettings, useAudioSettings } from "../../../game/audio/audioStore";
import { DEFAULT_STEP_TUNING, resetStepTuning, setStepTuning, useStepTuning } from "../../../game/audio/stepTuning";
import { useIsClient } from "../../../game/ui/useIsClient";
import { createTestDayStart } from "../../../game/world/economyStart";
import { GameWorld } from "../../../game/world/GameWorld";

// DEV-ONLY (2026-11-21): walk with the Doctor and choose, in milliseconds, EVERY how long the step sound repeats while he walks
// (and, apart, while he runs), whether or not it lines up with the sprite. The real GameWorld, started on Day 2 (test data).
// Nothing is saved. The values are the ones to copy into the game once they sound right.
const PLACES = [
  { label: "Plaza (piedra)", sceneId: "plaza", spawnName: "from-tavern-street" },
  { label: "Bosque (tierra)", sceneId: "forest", spawnName: "from-outskirts" },
  { label: "Botica (interior)", sceneId: "apothecary-interior", spawnName: "start" },
] as const;

const panel: CSSProperties = { position: "fixed", top: 8, left: 8, zIndex: 2000, display: "flex", flexDirection: "column", gap: 6, padding: "8px 10px", font: "12px/1.3 monospace", color: "#f4ead5", background: "rgba(9,9,9,0.88)", border: "1px solid #3f3427", maxWidth: 330 };
const btn: CSSProperties = { font: "inherit", color: "inherit", background: "#1c1710", border: "1px solid #3f3427", cursor: "pointer", padding: "2px 6px" };
const row: CSSProperties = { display: "flex", gap: 4, alignItems: "center", flexWrap: "wrap" };

// The buttons keep the game's keyboard focus (no focus steal), so the arrow keys keep walking the Doctor.
const keepFocus = (event: MouseEvent) => event.preventDefault();

function Stepper({ label, value, onChange, unit = "ms", steps }: { label: string; value: number; onChange: (next: number) => void; unit?: string; steps: number[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span>
        <strong>{label}: {value} {unit}</strong>
        {unit === "ms" ? <span style={{ opacity: 0.7 }}> ({(value / 1000).toFixed(2)} s)</span> : null}
      </span>
      <span style={row}>
        {[...steps.map((step) => -step).reverse(), ...steps].map((step) => (
          <button key={step} type="button" style={btn} onMouseDown={keepFocus} onClick={() => onChange(value + step)}>
            {step > 0 ? "+" : ""}{step}
          </button>
        ))}
      </span>
    </div>
  );
}

export default function StepsDevPage() {
  const isClient = useIsClient();
  const tuning = useStepTuning();
  const { volume, muted } = useAudioSettings();
  const [place, setPlace] = useState(0);
  const [run, setRun] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isClient) return null;
  const chosen = PLACES[place];
  const built = createTestDayStart(2, "justo");
  const start = { ...built.start, scene: { sceneId: chosen.sceneId, spawnName: chosen.spawnName } };
  const summary = `walk ${tuning.walkMs} ms, run ${tuning.runMs} ms (rate ${tuning.runRate})`;

  return (
    <>
      <GameWorld key={`${place}-${run}`} language="es" devStart={start} />
      <aside style={panel} onMouseDown={keepFocus}>
        <strong>/dev/steps · pasos cada X ms</strong>
        <span style={row}>
          <button
            type="button"
            style={{ ...btn, background: tuning.enabled ? "#2a4a2a" : "#4a2a2a" }}
            onMouseDown={keepFocus}
            onClick={() => setStepTuning({ enabled: !tuning.enabled })}
          >
            {tuning.enabled ? "Ritmo fijo: ACTIVADO (el del juego)" : "Ritmo fijo: apagado (pasos por fotograma, antiguo)"}
          </button>
        </span>
        <Stepper label="Andar, cada" value={tuning.walkMs} onChange={(walkMs) => setStepTuning({ walkMs })} steps={[10, 50, 100]} />
        <Stepper label="Correr, cada" value={tuning.runMs} onChange={(runMs) => setStepTuning({ runMs })} steps={[10, 50, 100]} />
        <Stepper label="Velocidad del sonido al correr" value={tuning.runRate} unit="x" onChange={(runRate) => setStepTuning({ runRate })} steps={[0.05, 0.1]} />
        <span style={row}>
          Volumen {Math.round(volume * 100)}%
          <button type="button" style={btn} onMouseDown={keepFocus} onClick={() => setAudioSettings({ volume: volume - 0.05 })}>-5</button>
          <button type="button" style={btn} onMouseDown={keepFocus} onClick={() => setAudioSettings({ volume: volume + 0.05 })}>+5</button>
          <button type="button" style={btn} onMouseDown={keepFocus} onClick={() => setAudioSettings({ muted: !muted })}>{muted ? "Activar" : "Silenciar"}</button>
        </span>
        <span style={row}>
          Sitio:
          {PLACES.map((candidate, index) => (
            <button key={candidate.sceneId} type="button" style={{ ...btn, color: index === place ? "#d4af37" : "inherit" }} onMouseDown={keepFocus} onClick={() => setPlace(index)}>
              {candidate.label}
            </button>
          ))}
        </span>
        <span style={row}>
          <button type="button" style={btn} onMouseDown={keepFocus} onClick={() => setRun((current) => current + 1)}>Reiniciar escena</button>
          <button type="button" style={btn} onMouseDown={keepFocus} onClick={() => resetStepTuning()}>
            Valores por defecto ({DEFAULT_STEP_TUNING.walkMs}/{DEFAULT_STEP_TUNING.runMs})
          </button>
          <button
            type="button"
            style={btn}
            onMouseDown={keepFocus}
            onClick={() => {
              void navigator.clipboard?.writeText(summary).then(() => setCopied(true), () => setCopied(false));
            }}
          >
            {copied ? "Copiado" : "Copiar valores"}
          </button>
        </span>
        <span style={{ opacity: 0.8 }}>Ahora: {summary}</span>
        <span style={{ opacity: 0.6 }}>Camina con las flechas (o tu preset). El sonido se repite cada X ms mientras andas, aunque no case con las piernas. Nada se guarda.</span>
      </aside>
    </>
  );
}
