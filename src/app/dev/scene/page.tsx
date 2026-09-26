"use client";

import { useEffect, useMemo, useState } from "react";

import { InteractionPrompt } from "../../../game/interactions/InteractionPrompt";
import { getSceneInteractionZones } from "../../../game/interactions/sceneInteractions";
import { useInteraction } from "../../../game/interactions/useInteraction";
import { getNpcColliders } from "../../../game/npcs/sceneNpc";
import { getSceneNpcs } from "../../../game/npcs/sceneNpcs";
import { SceneNpcSprite } from "../../../game/npcs/SceneNpcSprite";
import {
  PROTAGONIST_FEET_HITBOX,
  useProtagonistController,
} from "../../../game/protagonist/useProtagonistController";
import { ProtagonistSprite } from "../../../game/protagonist/ProtagonistSprite";
import { computeCamera, computeFrame, computeZoom } from "./camera";
import styles from "./page.module.css";
import {
  DEV_SCENES,
  getSceneWorld,
  LOGICAL_UNITS_PER_ASSET_PIXEL,
  REFERENCE_VIEWPORT,
  type DevScene,
} from "./scenes";

// EXPERIMENTAL scale/camera test. World sizes come from ./scenes and are NOT
// approved sizes. The protagonist is untouched: same sprite size, controller
// and speed. Player coordinates stay in world units; the camera only shifts
// what is presented on screen.
const SPRITE_SIZE = 96;
// Same value as the controller default; passed explicitly so the HUD can
// report the crossing time.
const PLAYER_SPEED = 160;
const SCENE_PADDING = 48;
const MAX_SCENE_SCALE = 4;
// The sprite is anchored at its feet; aim the camera at the middle of the
// sprite image so the character sits near the center of the frame.
const CAMERA_FOCUS_OFFSET_Y = -SPRITE_SIZE / 2;
const SHOW_FEET_HITBOX_DEBUG = false;
// TEMPORARY while validating hand-painted colliders: red collider overlay and
// cyan feet hitbox, only in scenes that define colliders.
const SHOW_COLLISION_DEBUG = true;
// Overlays sit above every entity (entities are stacked by feet Y).
const DEBUG_OVERLAY_Z_INDEX = 100000;

function getSceneZoom(scene: DevScene) {
  if (typeof window === "undefined") {
    return 1;
  }

  return computeZoom(
    REFERENCE_VIEWPORT,
    {
      width: Math.max(window.innerWidth - SCENE_PADDING, 320),
      height: Math.max(window.innerHeight - SCENE_PADDING, 180),
    },
    scene.zoomMultiplier ?? 1,
    MAX_SCENE_SCALE,
  );
}

function ScenePlayground({ scene }: { scene: DevScene }) {
  const world = getSceneWorld(scene);
  const frame = computeFrame(
    world,
    REFERENCE_VIEWPORT,
    scene.zoomMultiplier ?? 1,
  );
  const [zoom, setZoom] = useState(1);
  const npcs = getSceneNpcs(scene.id);
  const interactionZones = getSceneInteractionZones(scene.id);
  const npcColliders = useMemo(() => getNpcColliders(npcs), [npcs]);
  const blockingColliders = useMemo(
    () =>
      npcColliders.length === 0
        ? scene.colliders
        : [...(scene.colliders ?? []), ...npcColliders],
    [scene.colliders, npcColliders],
  );
  const { player, playerFeetHitbox, currentSpriteSrc, spriteSize } =
    useProtagonistController({
      sceneWidth: world.width,
      sceneHeight: world.height,
      initialX: world.initialX,
      initialY: world.initialY,
      spriteSize: SPRITE_SIZE,
      playerSpeed: PLAYER_SPEED,
      // Undefined falls back to the controller's empty default.
      sceneColliders: blockingColliders,
    });
  const showCollisionDebug =
    SHOW_COLLISION_DEBUG && scene.colliders !== undefined;
  // Same interaction system as the real game (same hook, same zone registry),
  // so what is seen here matches gameplay. The result is only a provisional
  // readout.
  const [interactionLog, setInteractionLog] = useState<{
    interactionId: string;
    count: number;
  } | null>(null);
  const availableInteraction = useInteraction({
    zones: interactionZones,
    feetHitbox: playerFeetHitbox,
    facing: player.direction,
    enabled: true,
    onInteract: (interactionId) =>
      setInteractionLog((current) => ({
        interactionId,
        count: (current?.count ?? 0) + 1,
      })),
  });

  useEffect(() => {
    const updateZoom = () => {
      setZoom(getSceneZoom(scene));
    };

    updateZoom();
    window.addEventListener("resize", updateZoom);

    return () => {
      window.removeEventListener("resize", updateZoom);
    };
  }, [scene]);

  const camera = computeCamera(
    { x: player.x, y: player.y + CAMERA_FOCUS_OFFSET_Y },
    world,
    frame,
    zoom,
  );
  const crossingSeconds =
    (world.width - PROTAGONIST_FEET_HITBOX.width) / PLAYER_SPEED;

  return (
    <>
      {interactionLog ? (
        <div
          data-interaction-log={interactionLog.interactionId}
          data-interaction-count={interactionLog.count}
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "4px 12px",
            font: "600 14px/1 monospace",
            color: "#f4ead5",
            background: "rgba(9, 9, 9, 0.82)",
            border: "1px solid #3ddc84",
            pointerEvents: "none",
            zIndex: 5,
          }}
        >
          Interaction: {interactionLog.interactionId} (#{interactionLog.count})
        </div>
      ) : null}
      <div className={styles.hud}>
        <div>/dev/scene · {scene.label} · camera test (experimental)</div>
        <div>
          world {world.width}×{world.height} · sprite {SPRITE_SIZE} · speed{" "}
          {PLAYER_SPEED}/s
        </div>
        <div>
          background {scene.assetWidth}×{scene.assetHeight} px ·{" "}
          {(
            scene.logicalUnitsPerAssetPixel ?? LOGICAL_UNITS_PER_ASSET_PIXEL
          ).toFixed(3)}{" "}
          units/px
        </div>
        <div>
          zoom {zoom.toFixed(2)}× (×{scene.zoomMultiplier ?? 1}) · sprite{" "}
          {(SPRITE_SIZE * zoom).toFixed(0)} px · edge to edge ≈{" "}
          {crossingSeconds.toFixed(1)} s
        </div>
        <div>
          frame {Math.round(frame.width)}×{Math.round(frame.height)} of{" "}
          {world.width}×{world.height} (
          {Math.round((frame.width / world.width) * 100)}% ×{" "}
          {Math.round((frame.height / world.height) * 100)}%)
        </div>
        <div>
          camera ({Math.round(camera.x)}, {Math.round(camera.y)}) · x{" "}
          {camera.stateX} · y {camera.stateY}
        </div>
        <div>
          feet ({Math.round(player.x)}, {Math.round(player.y)})
          {scene.colliders ? ` · colliders ${scene.colliders.length}` : ""}
        </div>
      </div>
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
          style={{ backgroundImage: `url("${scene.backgroundSrc}")` }}
        >
          {npcs.map((npc) => (
            <SceneNpcSprite key={npc.id} npc={npc} />
          ))}
          <ProtagonistSprite
            x={player.x}
            y={player.y}
            spriteSrc={currentSpriteSrc}
            spriteSize={spriteSize}
            direction={player.direction}
            isWalking={player.isWalking}
            scale={scene.protagonistScale}
            zIndex={Math.round(player.y)}
          />
          {SHOW_FEET_HITBOX_DEBUG || showCollisionDebug ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: DEBUG_OVERLAY_Z_INDEX,
                pointerEvents: "none",
              }}
            >
              {showCollisionDebug
                ? scene.colliders?.map((collider) => (
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
                  ))
                : null}
              {showCollisionDebug
                ? npcColliders.map((collider) => (
                    <div
                      key={collider.id}
                      style={{
                        position: "absolute",
                        left: collider.x,
                        top: collider.y,
                        width: collider.width,
                        height: collider.height,
                        boxSizing: "border-box",
                        border: "1px solid #ff9f1c",
                        background: "rgba(255, 159, 28, 0.35)",
                        pointerEvents: "none",
                      }}
                    />
                  ))
                : null}
              {showCollisionDebug
                ? interactionZones.map((zone) => (
                    <div
                      key={zone.id}
                      style={{
                        position: "absolute",
                        left: zone.x,
                        top: zone.y,
                        width: zone.width,
                        height: zone.height,
                        boxSizing: "border-box",
                        border: "1px solid #3ddc84",
                        background: "rgba(61, 220, 132, 0.26)",
                        pointerEvents: "none",
                      }}
                    />
                  ))
                : null}
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
            </div>
          ) : null}
        </div>
        {availableInteraction ? (
          <InteractionPrompt
            feetX={player.x}
            feetY={player.y}
            spriteSize={spriteSize}
            spriteScale={scene.protagonistScale ?? 1}
            zoom={zoom}
            cameraOffsetX={camera.offsetX}
            cameraOffsetY={camera.offsetY}
          />
        ) : null}
      </div>
    </>
  );
}

export default function SceneDevPage() {
  const [sceneId, setSceneId] = useState(DEV_SCENES[0].id);
  const scene = DEV_SCENES.find((candidate) => candidate.id === sceneId);

  return (
    <main className={styles.page}>
      <div className={styles.sceneSelector}>
        {DEV_SCENES.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            className={
              candidate.id === sceneId
                ? `${styles.sceneButton} ${styles.sceneButtonActive}`
                : styles.sceneButton
            }
            aria-pressed={candidate.id === sceneId}
            onClick={(event) => {
              // Keep keyboard focus off the button so the arrow keys only
              // drive the protagonist.
              event.currentTarget.blur();
              setSceneId(candidate.id);
            }}
          >
            {candidate.label}
          </button>
        ))}
      </div>
      {/* key remounts the playground so the controller restarts at the new
          scene's initial position. */}
      {scene ? <ScenePlayground key={scene.id} scene={scene} /> : null}
    </main>
  );
}
