"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

// The camera stays where it is for now (camera.ts is not moved yet), so the
// game reuses the tested /dev/scene behaviour as-is.
import {
  computeCamera,
  computeFrame,
  computeZoom,
} from "../../app/dev/scene/camera";
import { getSceneWorld, REFERENCE_VIEWPORT } from "../../app/dev/scene/scenes";
import type { CollectedInstanceIds } from "../collectibles/collectibles";
import { getChapterInteractions, getComposition } from "../compositions";
import { SHOW_COLLISION_DEBUG } from "../debugFlags";
import { AttentionMark } from "../ui/AttentionMark";
import { DecorSprite } from "../decor/DecorSprite";
import { DOCTOR_NARRATIVE_ASSET_ID } from "../decor/decorAssets";
import { resolveDecorInstances } from "../decor/decorRuntime";
import type { DecorAsset, DecorInstance } from "../decor/decorTypes";
import { InteractionPrompt } from "../interactions/InteractionPrompt";
import { getSceneInteractionZones } from "../interactions/sceneInteractions";
import { useInteraction } from "../interactions/useInteraction";
import { getNpcColliders } from "../npcs/sceneNpc";
import { getSceneNpcs } from "../npcs/sceneNpcs";
import { SceneNpcSprite } from "../npcs/SceneNpcSprite";
import { ProtagonistSprite } from "../protagonist/ProtagonistSprite";
import { useReportRunning } from "../protagonist/useReportRunning";
import type { DirectionInputHandle } from "../protagonist/useDirectionInput";
import { usePlayerMoved } from "../protagonist/usePlayerMoved";
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
// Debug overlays sit above every entity (entities are stacked by feet Y).
const DEBUG_OVERLAY_Z_INDEX = 100000;
// Transparent rows above the head in the 96 px character frames (same value
// InteractionPrompt uses). Sprite-art dependent.
const SPEAKER_TOP_PADDING = 14;

// What a screen-space overlay (dialogue bubble...) needs to anchor itself to
// the characters of this scene. Positions are in screen pixels INSIDE the
// camera frame, like InteractionPrompt.
export type SceneOverlayContext = {
  frameWidth: number;
  frameHeight: number;
  // Point just above a speaker's head: "doctor", a decor instanceId or a scene
  // NPC id. Null when that speaker is not in this scene. `placement` says on
  // which side of the point the bubble goes (below = the anchor is the bottom
  // of a lying character's sprite).
  getSpeakerAnchor: (
    speakerId: string,
  ) => { x: number; y: number; placement?: "above" | "below" } | null;
};

// The point just above a placed character's head: the top of the asset's body
// collider (its sprite frame has unknown padding), scaled with the instance.
// Speech bubbles and the "!" both hang from it, so they follow the instance.
function getInstanceHeadTop(asset: DecorAsset, instance: DecorInstance) {
  const bodyHeight =
    asset.headHeight ??
    (asset.defaultCollider
      ? -asset.defaultCollider.offsetY
      : asset.sprite.frameHeight * asset.anchor.y);

  return instance.y - bodyHeight * instance.scale;
}

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
  chapterId,
  spawn,
  input,
  isPlaying,
  onExit,
  onInteract,
  renderOverlay,
  onPlayerMoved,
  onRunningChange,
  onInteractionAvailable,
  collectedInstanceIds,
  attentionInstanceIds,
}: {
  scene: ExteriorWorldScene;
  // Selects which versioned composition (src/game/compositions) populates the
  // scene. Without it (dev pages) the scene has no decor instances.
  chapterId?: string;
  // Where the controllable Doctor starts. Absent in narrative scenes.
  spawn?: SpawnPoint;
  input: DirectionInputHandle;
  isPlaying: boolean;
  onExit: (exitName: string) => void;
  // `instanceId` is set when the interaction belongs to a decor instance, and
  // `itemId` when that instance is a collectible.
  onInteract: (
    interactionId: string,
    source: { instanceId?: string; itemId?: string },
  ) => void;
  // Optional screen-space layer drawn above the camera frame content.
  renderOverlay?: (context: SceneOverlayContext) => ReactNode;
  // Reports (never drives): the Doctor really changed position / an
  // interaction became available or stopped being available.
  onPlayerMoved?: () => void;
  // Reports (never drives): whether the Doctor is running right now.
  onRunningChange?: (running: boolean) => void;
  // The interactionId available right now (null = none).
  onInteractionAvailable?: (interactionId: string | null) => void;
  // Collectibles already picked up this session; they are not drawn, do not
  // block and give no prompt.
  collectedInstanceIds?: CollectedInstanceIds;
  // Placed characters that show the "!" (they have news for the Doctor).
  attentionInstanceIds?: ReadonlySet<string>;
}) {
  const zoomMultiplier = scene.visual.zoomMultiplier ?? 1;
  const world = getSceneWorld(scene.visual);
  const frame = computeFrame(world, REFERENCE_VIEWPORT, zoomMultiplier);
  const [zoom, setZoom] = useState(() => getZoom(zoomMultiplier));
  // Static geometry plus the colliders of the NPCs currently in this scene.
  // The static array is never mutated.
  const npcs = getSceneNpcs(scene.id);
  const npcColliders = useMemo(() => getNpcColliders(npcs), [npcs]);
  // Decor instances placed in the Decorator and versioned for this chapter:
  // sprites, colliders (colliderEnabled) and interaction zones.
  const decor = useMemo(
    () =>
      resolveDecorInstances(
        (chapterId && getComposition(scene.id, chapterId)?.instances) || [],
        chapterId ? getChapterInteractions(chapterId) : {},
        collectedInstanceIds,
      ),
    [scene.id, chapterId, collectedInstanceIds],
  );
  const blockingColliders = useMemo(
    () => [...scene.colliders, ...npcColliders, ...decor.colliders],
    [scene.colliders, npcColliders, decor.colliders],
  );
  // A narrative scene has no spawn: the controller (disabled, invisible) only
  // needs a neutral seed inside the world.
  const narrative = scene.narrative === true;
  const start = spawn ?? {
    x: world.width / 2,
    y: world.height / 2,
    direction: "south" as const,
  };
  const {
    player,
    playerFeetHitbox,
    currentSpriteSrc,
    spriteMirrored,
    spriteSize,
  } = useProtagonistController({
    sceneWidth: world.width,
    sceneHeight: world.height,
    initialX: start.x,
    initialY: start.y,
    initialDirection: start.direction,
    spriteSize: SPRITE_SIZE,
    sceneColliders: blockingColliders,
    input,
    inputEnabled: isPlaying,
  });

  const sceneZones = getSceneInteractionZones(scene.id);
  const interactionZones = useMemo(
    () => [...sceneZones, ...decor.zones],
    [sceneZones, decor.zones],
  );
  const availableInteraction = useInteraction({
    zones: interactionZones,
    feetHitbox: playerFeetHitbox,
    facing: player.direction,
    enabled: isPlaying,
    onInteract: (interactionId, zone) =>
      onInteract(interactionId, {
        instanceId: decor.zoneInstanceIds.get(zone.id),
        itemId: decor.zoneItemIds.get(zone.id),
      }),
  });

  usePlayerMoved(player.x, player.y, onPlayerMoved);
  useReportRunning(player.isRunning, onRunningChange);

  // Tell the owner which interaction the [E] prompt is for (and clear it when
  // this scene goes away).
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

  const getSpeakerAnchor = (speakerId: string) => {
    const decorSpeaker = decor.sprites.find(
      ({ instance }) => instance.instanceId === speakerId,
    );
    let feetX: number;
    let headTopY: number;
    let placement: "above" | "below" = "above";

    // In a narrative scene the Doctor is the picture placed in its composition.
    const narrativeDoctor = narrative
      ? decor.sprites.find(
          ({ asset }) => asset.id === DOCTOR_NARRATIVE_ASSET_ID,
        )
      : undefined;

    if (speakerId === "doctor" && narrativeDoctor) {
      feetX = narrativeDoctor.instance.x;
      headTopY = getInstanceHeadTop(
        narrativeDoctor.asset,
        narrativeDoctor.instance,
      );
    } else if (speakerId === "doctor") {
      feetX = player.x;
      headTopY =
        player.y -
        (spriteSize - SPEAKER_TOP_PADDING) *
          (scene.visual.protagonistScale ?? 1);
    } else if (decorSpeaker) {
      // A decor instance: its anchor is where it stands, so a moved or
      // rescaled instance carries its bubble with it. The head is the top of
      // the asset's body collider (its sprite frame has unknown padding).
      const { asset, instance } = decorSpeaker;

      feetX = instance.x;

      if (asset.dialoguePlacement === "below") {
        // Lying characters: the anchor is the bottom of the sprite, which is
        // the instance anchor itself (the silhouette's lowest point).
        placement = "below";
        headTopY = instance.y;
      } else {
        headTopY = getInstanceHeadTop(asset, instance);
      }
    } else {
      const npc = npcs.find((candidate) => candidate.id === speakerId);

      if (!npc) {
        return null;
      }

      feetX = npc.position.x;
      headTopY =
        npc.position.y -
        (npc.visual.frameSize - SPEAKER_TOP_PADDING) * (npc.visual.scale ?? 1);
    }

    return {
      x: Math.round(feetX * zoom - camera.offsetX),
      y: Math.round(headTopY * zoom - camera.offsetY),
      placement,
    };
  };

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
          {decor.sprites.map(({ asset, instance }) => (
            <DecorSprite
              key={instance.instanceId}
              asset={asset}
              instance={instance}
            />
          ))}
          {decor.sprites.map(({ asset, instance }) =>
            attentionInstanceIds?.has(instance.instanceId) ? (
              <AttentionMark
                key={`${instance.instanceId}-attention`}
                x={instance.x}
                y={getInstanceHeadTop(asset, instance) - 4}
                zIndex={Math.round(instance.y) + instance.zOffset + 1000}
              />
            ) : null,
          )}
          {npcs.map((npc) => (
            <SceneNpcSprite key={npc.id} npc={npc} />
          ))}
          {narrative ? null : (
            <ProtagonistSprite
              x={player.x}
              y={player.y}
              spriteSrc={currentSpriteSrc}
              spriteSize={spriteSize}
              direction={player.direction}
              isWalking={player.isWalking}
              mirrored={spriteMirrored}
              scale={scene.visual.protagonistScale}
              zIndex={Math.round(player.y)}
            />
          )}
          {SHOW_COLLISION_DEBUG ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: DEBUG_OVERLAY_Z_INDEX,
                pointerEvents: "none",
              }}
            >
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
              {npcColliders.map((collider) => (
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
              ))}
              {decor.colliders.map((collider) => (
                <div
                  key={collider.id}
                  style={{
                    position: "absolute",
                    left: collider.x,
                    top: collider.y,
                    width: collider.width,
                    height: collider.height,
                    boxSizing: "border-box",
                    border: "1px solid #c77dff",
                    background: "rgba(199, 125, 255, 0.35)",
                    pointerEvents: "none",
                  }}
                />
              ))}
              {interactionZones.map((zone) => (
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
            </div>
          ) : null}
        </div>
        {availableInteraction ? (
          <InteractionPrompt
            feetX={player.x}
            feetY={player.y}
            spriteSize={spriteSize}
            spriteScale={scene.visual.protagonistScale ?? 1}
            zoom={zoom}
            cameraOffsetX={camera.offsetX}
            cameraOffsetY={camera.offsetY}
          />
        ) : null}
        {renderOverlay?.({
          frameWidth: frame.width * zoom,
          frameHeight: frame.height * zoom,
          getSpeakerAnchor,
        })}
      </div>
    </main>
  );
}
