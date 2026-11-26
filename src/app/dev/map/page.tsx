"use client";

import { useState } from "react";

import { MapOverlay } from "../../../game/map/MapOverlay";
import { SCENE_TO_MAP_LOCATION } from "../../../game/map/mapLocations";
import type { MapMarkers } from "../../../game/map/mapMarkers";
import { useMapHold } from "../../../game/map/useMapHold";
import { useDirectionInput } from "../../../game/protagonist/useDirectionInput";
import { useIsClient } from "../../../game/ui/useIsClient";
import { ExteriorScene } from "../../../game/world/ExteriorScene";
import { WORLD_SCENES } from "../../../game/world/worldScenes";
import type {
  ExteriorWorldScene,
  SceneId,
  SpawnPoint,
} from "../../../game/world/worldScenes";
import styles from "./page.module.css";

// Map V1 preview. A real scene (the Plaza) with the real Doctor. Hold TAB to
// show the map, release to hide it; the Doctor cannot walk while it is up.
// The scene the map believes you are in is simulated with the selector below
// (dev only), so the "you are here" marker can be checked on every place.
const PLAZA = WORLD_SCENES.plaza as ExteriorWorldScene;
const SPAWN: SpawnPoint = { x: 640, y: 352, direction: "east" };
const SCENE_IDS = Object.keys(SCENE_TO_MAP_LOCATION) as SceneId[];
// TEST DATA (2026-11-26): symbols to look at the aura of the accepted ones: a patient examined at the mine (aura), one
// only discovered at the bakery (no aura), an errand asked at the tavern (aura) and both kinds together at the quarry.
const SAMPLE_MARKERS: MapMarkers = {
  mine: { patients: 1, acceptedPatients: 1, errands: 0 },
  bakery: { patients: 1, acceptedPatients: 0, errands: 0 },
  tavern: { patients: 0, acceptedPatients: 0, errands: 1 },
  quarry: { patients: 2, acceptedPatients: 1, errands: 1 },
};

export default function MapPreviewPage() {
  const input = useDirectionInput();
  const isClient = useIsClient();
  const held = useMapHold();
  const [simulatedScene, setSimulatedScene] = useState<SceneId>("plaza");
  const [sample, setSample] = useState(true);

  return (
    <>
      {isClient ? (
        <ExteriorScene
          scene={PLAZA}
          spawn={SPAWN}
          input={input}
          isPlaying={!held}
          onExit={() => undefined}
          onInteract={() => undefined}
        />
      ) : null}
      {held ? (
        <MapOverlay currentLocationId={SCENE_TO_MAP_LOCATION[simulatedScene]} markers={sample ? SAMPLE_MARKERS : {}} />
      ) : null}
      <aside className={styles.panel}>
        <strong>/dev/map</strong>
        <span>WASD / flechas: mover al Doctor (bloqueado con el mapa)</span>
        <span>Mantén M: ver el mapa · suéltala: cerrarlo</span>
        <button type="button" onClick={(event) => { setSample((value) => !value); event.currentTarget.blur(); }}>
          Símbolos de prueba: {sample ? "sí (mina y taberna con aura, panadería sin ella, cantera mezclada)" : "no"}
        </button>
        <label className={styles.field}>
          Escena simulada (DEV):
          <select
            value={simulatedScene}
            onChange={(event) => {
              setSimulatedScene(event.target.value as SceneId);
              // Keep focus off the select so keys keep driving the Doctor.
              event.currentTarget.blur();
            }}
          >
            {SCENE_IDS.map((sceneId) => (
              <option key={sceneId} value={sceneId}>
                {sceneId} → {SCENE_TO_MAP_LOCATION[sceneId]}
              </option>
            ))}
          </select>
        </label>
      </aside>
    </>
  );
}
