"use client";

import { useState } from "react";

import { MapOverlay } from "../../../game/map/MapOverlay";
import { SCENE_TO_MAP_LOCATION } from "../../../game/map/mapLocations";
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

export default function MapPreviewPage() {
  const input = useDirectionInput();
  const isClient = useIsClient();
  const held = useMapHold();
  const [simulatedScene, setSimulatedScene] = useState<SceneId>("plaza");

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
        <MapOverlay currentLocationId={SCENE_TO_MAP_LOCATION[simulatedScene]} />
      ) : null}
      <aside className={styles.panel}>
        <strong>/dev/map</strong>
        <span>WASD / flechas: mover al Doctor (bloqueado con el mapa)</span>
        <span>Mantén TAB: ver el mapa · suelta TAB: cerrarlo</span>
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
