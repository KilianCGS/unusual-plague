"use client";

import { useEffect, useState } from "react";

// The camera stays where it is for now (camera.ts is not moved yet), so the
// game reuses the tested /dev/scene behaviour as-is.
import {
  computeCamera,
  computeFrame,
  computeZoom,
} from "../../app/dev/scene/camera";
import { getSceneWorld, REFERENCE_VIEWPORT } from "../../app/dev/scene/scenes";
import { SHOW_COLLISION_DEBUG } from "../debugFlags";
import { ProtagonistSprite } from "../protagonist/ProtagonistSprite";
import type { DirectionInputHandle } from "../protagonist/useDirectionInput";
import { useProtagonistController } from "../protagonist/useProtagonistController";
import styles from "./ExteriorScene.module.css";
import { useTransitionTrigger } from "./useTransitionTrigger";
import type { ExteriorWorldScene, SpawnPoint } from "./worldScenes";

const SPRITE_SIZE = 96;
const SCENE_PADDING = 48;
const MAX_SCENE_SCALE = 4;
// The sprite is anchored at its feet; aim the camera at the middle of the
// sprite image so the character sits near the center of the frame.
const CAMERA_FOCUS_OFFSET_Y = -SPRITE_SIZE / 2;

function getZoom(zoomMultiplier: number) {
  if (typeof window === "undefined") {
    return 1;
  }

  return computeZoom(
    REFERENCE_VIEWPORT,
    {
      width: Math.max(window.innerWidth - SCENE_PADDING, 320),
      height: Math.max(window.innerHeight - SCENE_PADDING, 180),
    },
    zoomMultiplier,
    MAX_SCENE_SCALE,
  );
}

export function ExteriorScene({
  scene,
  spawn,
  input,
  isPlaying,
  onExit,
}: {
  scene: ExteriorWorldScene;
  spawn: SpawnPoint;
  input: DirectionInputHandle;
  isPlaying: boolean;
  onExit: (exitName: string) => void;
}) {
  const zoomMultiplier = scene.visual.zoomMultiplier ?? 1;
  const world = getSceneWorld(scene.visual);
  const frame = computeFrame(world, REFERENCE_VIEWPORT, zoomMultiplier);
  const [zoom, setZoom] = useState(() => getZoom(zoomMultiplier));
  const { player, playerFeetHitbox, currentSpriteSrc, spriteSize } =
    useProtagonistController({
      sceneWidth: world.width,
      sceneHeight: world.height,
      initialX: spawn.x,
      initialY: spawn.y,
      initialDirection: spawn.direction,
      spriteSize: SPRITE_SIZE,
      sceneColliders: scene.colliders,
      input,
      inputEnabled: isPlaying,
    });

  useTransitionTrigger({
    feetHitbox: playerFeetHitbox,
    exits: scene.exits,
    enabled: isPlaying,
    onExit,
  });

  useEffect(() => {
    const updateZoom = () => {
      setZoom(getZoom(zoomMultiplier));
    };

    window.addEventListener("resize", updateZoom);

    return () => {
      window.removeEventListener("resize", updateZoom);
    };
  }, [zoomMultiplier]);

  const camera = computeCamera(
    { x: player.x, y: player.y + CAMERA_FOCUS_OFFSET_Y },
    world,
    frame,
    zoom,
  );

  return (
    <main className={styles.page}>
      <div
        className={styles.viewport}
        style={{
          ["--frame-width" as string]: `${frame.width}px`,
          ["--frame-height" as string]: `${frame.height}px`,
          ["--world-width" as string]: `${world.width}px`,
          ["--world-height" as string]: `${world.height}px`,
          ["--scene-scale" as string]: zoom,
          ["--camera-x" as string]: camera.offsetX,
          ["--camera-y" as string]: camera.offsetY,
        }}
      >
        <div
          className={styles.logicalScene}
          style={{ backgroundImage: `url("${scene.visual.backgroundSrc}")` }}
        >
          <ProtagonistSprite
            x={player.x}
            y={player.y}
            spriteSrc={currentSpriteSrc}
            spriteSize={spriteSize}
            direction={player.direction}
            isWalking={player.isWalking}
            scale={scene.visual.protagonistScale}
          />
          {SHOW_COLLISION_DEBUG ? (
            <>
              {scene.colliders.map((collider) => (
                <div
                  key={collider.id}
                  style={{
                    position: "absolute",
                    left: collider.x,
                    top: collider.y,
                    width: collider.width,
                    height: collider.height,
                    boxSizing: "border-box",
                    border: "1px solid #ff5c5c",
                    background: "rgba(255, 92, 92, 0.28)",
                    pointerEvents: "none",
                  }}
                />
              ))}
              {scene.exits.map((exit) => (
                <div
                  key={exit.name}
                  style={{
                    position: "absolute",
                    left: exit.zone.x,
                    top: exit.zone.y,
                    width: exit.zone.width,
                    height: exit.zone.height,
                    boxSizing: "border-box",
                    border: "1px solid #ffd60a",
                    background: "rgba(255, 214, 10, 0.26)",
                    pointerEvents: "none",
                  }}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  left: playerFeetHitbox.x,
                  top: playerFeetHitbox.y,
                  width: playerFeetHitbox.width,
                  height: playerFeetHitbox.height,
                  boxSizing: "border-box",
                  border: "1px solid #4de7ff",
                  background: "rgba(77, 231, 255, 0.3)",
                  pointerEvents: "none",
                }}
              />
            </>
          ) : null}
        </div>
      </div>
    </main>
  );
}
