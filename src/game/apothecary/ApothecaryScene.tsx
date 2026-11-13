"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { getSharedEnvironmentInstances } from "../compositions/shared-environment";
import { resolveDecorInstances } from "../decor/decorRuntime";
import { DecorSprite } from "../decor/DecorSprite";

import { InteractionPrompt } from "../interactions/InteractionPrompt";
import { getSceneInteractionZones } from "../interactions/sceneInteractions";
import { useInteraction } from "../interactions/useInteraction";
import { apothecaryMainZoneColliders } from "./apothecaryMainZoneGeometry";
import { SHOW_COLLISION_DEBUG } from "../debugFlags";
import { INDOOR_SPEED_FACTOR } from "../world/worldNoRun";
import {
  PROTAGONIST_WALK_FRAME_DURATION,
  PROTAGONIST_WALK_SPEED,
} from "../protagonist/protagonistRun";
import { DOCTOR_SCALE } from "../protagonist/doctorScale";
import { ProtagonistSprite } from "../protagonist/ProtagonistSprite";
import { getMovementBob } from "../protagonist/protagonistRun";
import { useReportRunning } from "../protagonist/useReportRunning";
import { usePlayerMoved } from "../protagonist/usePlayerMoved";
import type { DirectionInputHandle } from "../protagonist/useDirectionInput";
import {
  useProtagonistController,
  type Direction,
} from "../protagonist/useProtagonistController";
import {
  useTransitionTrigger,
  type TransitionExit,
} from "../world/useTransitionTrigger";
import type { SceneOverlayContext } from "../world/ExteriorScene";
import styles from "./ApothecaryScene.module.css";

const SCENE_WIDTH = 480;
const SCENE_HEIGHT = 293;
const SPRITE_SIZE = 96;
// Transparent rows above the head in the 96 px character frames (same value
// ExteriorScene uses for its speaker anchors).
const SPEAKER_TOP_PADDING = 14;
const SCENE_PADDING = 48;
const MAX_SCENE_SCALE = 4;
const DEFAULT_SPAWN: { x: number; y: number; direction: Direction } = {
  x: 240,
  y: 217,
  direction: "south",
};
const NO_EXITS: TransitionExit[] = [];
const SHARED_AMBIENT_SPRITES = resolveDecorInstances(
  getSharedEnvironmentInstances("apothecary-interior"),
).sprites;

function getSceneScale() {
  if (typeof window === "undefined") {
    return 1;
  }

  const availableWidth = Math.max(window.innerWidth - SCENE_PADDING, 320);
  const availableHeight = Math.max(window.innerHeight - SCENE_PADDING, 180);

  return Math.min(
    availableWidth / SCENE_WIDTH,
    availableHeight / SCENE_HEIGHT,
    MAX_SCENE_SCALE,
  );
}

// All props are optional: rendered alone it behaves exactly as before. Inside
// GameWorld it receives its spawn, a shared keyboard input, whether the game is
// playable, and its exits.
export function ApothecaryScene({
  spawn = DEFAULT_SPAWN,
  input,
  isPlaying = true,
  exits = NO_EXITS,
  onExit,
  renderOverlay,
  onPlayerMoved,
  onRunningChange,
  onInteract,
  onInteractionAvailable,
  promptLabelFor,
  onRunBlocked,
  highlightInteractionIds,
}: {
  spawn?: { x: number; y: number; direction: Direction };
  input?: DirectionInputHandle;
  isPlaying?: boolean;
  exits?: TransitionExit[];
  onExit?: (exitName: string) => void;
  // Optional screen-space layer (dialogue bubble) above the scene.
  renderOverlay?: (context: SceneOverlayContext) => ReactNode;
  // Reports (never drives) that the Doctor really changed position.
  onPlayerMoved?: () => void;
  // Reports (never drives): whether the Doctor is running right now.
  onRunningChange?: (running: boolean) => void;
  // The room has interaction zones (the crafting table); the owner decides
  // what an interactionId does.
  onInteract?: (interactionId: string, source: { instanceId?: string }) => void;
  // The interactionId available right now (null = none).
  onInteractionAvailable?: (interactionId: string | null) => void;
  // Optional word shown after the E ("Preparar", "Cocinar") for an interaction.
  promptLabelFor?: (interactionId: string) => string | undefined;
  // Space was pressed: running is never allowed in here (see worldNoRun.ts).
  onRunBlocked?: () => void;
  // Interactions to point at with a bobbing arrow (the tutorial's crafting tour).
  // The arrow sits above the middle of each interaction zone; it never takes input.
  highlightInteractionIds?: readonly string[];
}) {
  const [sceneScale, setSceneScale] = useState(1);
  const {
    player,
    playerFeetHitbox,
    currentSpriteSrc,
    spriteMirrored,
    spriteSize,
  } = useProtagonistController({
    sceneWidth: SCENE_WIDTH,
    sceneHeight: SCENE_HEIGHT,
    initialX: spawn.x,
    initialY: spawn.y,
    initialDirection: spawn.direction,
    spriteSize: SPRITE_SIZE,
    sceneColliders: apothecaryMainZoneColliders,
    input,
    inputEnabled: isPlaying,
    // The Botica is slow and quiet: the Doctor walks ~30% slower, with his steps
    // slowed to match, and never runs.
    playerSpeed: PROTAGONIST_WALK_SPEED * INDOOR_SPEED_FACTOR,
    walkFrameDuration: PROTAGONIST_WALK_FRAME_DURATION / INDOOR_SPEED_FACTOR,
    runDisabled: true,
    onRunBlocked,
  });

  usePlayerMoved(player.x, player.y, onPlayerMoved);
  useReportRunning(player.isRunning, onRunningChange);

  const availableInteraction = useInteraction({
    zones: getSceneInteractionZones("apothecary-interior"),
    feetHitbox: playerFeetHitbox,
    facing: player.direction,
    enabled: isPlaying,
    onInteract: (interactionId) => onInteract?.(interactionId, {}),
  });
  const availableInteractionId = availableInteraction?.interactionId ?? null;
  const onInteractionAvailableRef = useRef(onInteractionAvailable);

  useEffect(() => {
    onInteractionAvailableRef.current = onInteractionAvailable;
  });

  useEffect(() => {
    onInteractionAvailableRef.current?.(availableInteractionId);

    return () => onInteractionAvailableRef.current?.(null);
  }, [availableInteractionId]);

  useTransitionTrigger({
    feetHitbox: playerFeetHitbox,
    exits,
    enabled: isPlaying && onExit !== undefined,
    onExit: (exitName) => onExit?.(exitName),
  });

  useEffect(() => {
    const updateSceneScale = () => {
      setSceneScale(getSceneScale());
    };

    updateSceneScale();
    window.addEventListener("resize", updateSceneScale);

    return () => {
      window.removeEventListener("resize", updateSceneScale);
    };
  }, []);

  // Only the Doctor lives in this room; the scene is not scrolled, so his
  // anchor is just his head point scaled to screen pixels.
  const getSpeakerAnchor = (speakerId: string) =>
    speakerId === "doctor"
      ? {
          x: Math.round(player.x * sceneScale),
          y: Math.round(
            (player.y - (spriteSize - SPEAKER_TOP_PADDING) * DOCTOR_SCALE) *
              sceneScale,
          ),
        }
      : null;

  return (
    <main className={styles.page}>
      <section>
        <div
          className={styles.viewport}
          style={{
            ["--scene-scale" as string]: sceneScale,
          }}
        >
          <div className={styles.logicalScene}>
            {SHARED_AMBIENT_SPRITES.map(({ asset, instance }) => (
              <DecorSprite key={instance.instanceId} asset={asset} instance={instance} />
            ))}
            <ProtagonistSprite
              x={player.x}
              y={player.y}
              spriteSrc={currentSpriteSrc}
              spriteSize={spriteSize}
              direction={player.direction}
              isWalking={player.isWalking}
              mirrored={spriteMirrored}
              bob={getMovementBob(player.direction, player.isWalking, player.isRunning, player.frame)}
              // sorted by his feet like every other scene: decor with a smaller
              // Y (candle flames on shelves) is drawn behind him
              zIndex={Math.round(player.y)}
            />
            {(highlightInteractionIds ?? []).flatMap((interactionId) =>
              getSceneInteractionZones("apothecary-interior")
                .filter((zone) => zone.interactionId === interactionId)
                .map((zone) => (
                  <span
                    key={zone.id}
                    className={styles.pointer}
                    data-tutorial-pointer={interactionId}
                    aria-hidden
                    style={{
                      left: zone.x + zone.width / 2,
                      top: zone.y,
                    }}
                  />
                )),
            )}
            {SHOW_COLLISION_DEBUG ? (
              <>
                {apothecaryMainZoneColliders.map((collider) => (
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
                {exits.map((exit) => (
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
          {availableInteraction ? (
            <InteractionPrompt
              feetX={player.x}
              feetY={player.y}
              spriteSize={spriteSize}
              spriteScale={1}
              label={promptLabelFor?.(availableInteraction.interactionId)}
              zoom={sceneScale}
              cameraOffsetX={0}
              cameraOffsetY={0}
            />
          ) : null}
          {renderOverlay?.({
            frameWidth: SCENE_WIDTH * sceneScale,
            frameHeight: SCENE_HEIGHT * sceneScale,
            getSpeakerAnchor,
          })}
        </div>
      </section>
    </main>
  );
}
