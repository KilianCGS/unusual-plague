"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import type { InteractionZone } from "../../../game/interactions/interactionZone";
import { findAvailableInteraction } from "../../../game/interactions/interactionZone";
import { getNpcColliders } from "../../../game/npcs/sceneNpc";
import { getSceneNpcs } from "../../../game/npcs/sceneNpcs";
import { SceneNpcSprite } from "../../../game/npcs/SceneNpcSprite";
import { ProtagonistSprite } from "../../../game/protagonist/ProtagonistSprite";
import {
  useProtagonistController,
  type Direction,
} from "../../../game/protagonist/useProtagonistController";
import {
  WORLD_SCENES,
  type ExteriorWorldScene,
  type SceneId,
} from "../../../game/world/worldScenes";
import { clientToWorld } from "../collisions/geometry";
import { getSceneWorld } from "../scene/scenes";
import {
  CHAPTER_IDS,
  clearStoredInstances,
  cloneInstances,
  compositionKey,
  formatComposition,
  loadInstances,
  nextInstanceId,
  saveInstances,
} from "./composition";
import {
  DECOR_ASSETS,
  DECOR_CATEGORY_ORDER,
  getDecorAsset,
  getInstanceCollider,
} from "./decorAssets";
import type { DecorInstance } from "./decorTypes";
import { DecorSprite, getSpriteBox } from "./DecorSprite";
import styles from "./page.module.css";
import { useEditorDirectionInput } from "./useEditorDirectionInput";

// DEV-ONLY scene composition tool. Everything is in world logical units. The
// runtime is only read (scene visuals / static colliders / real NPCs); nothing
// here is imported by the game.

const PANEL_WIDTH = 340;
const CHROME_HEIGHT = 120;
const MAX_SCALE = 4;
const SPRITE_SIZE = 96;
const OVERLAY_Z_INDEX = 100000;
const DIRECTIONS: Direction[] = ["north", "south", "east", "west"];
const DEFAULT_ZONE_MARGIN = 18;

// Only scenes drawn by the asset-driven renderer (kind "exterior") can be
// composed here. Botica's interior uses its own hardwired renderer.
const SCENES = Object.values(WORLD_SCENES).filter(
  (scene): scene is ExteriorWorldScene => scene.kind === "exterior",
);

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT")
  );
}

// Number input that can be typed into freely: it shows the raw text while
// focused and only commits values that are valid.
function NumberField({
  label,
  value,
  onCommit,
  min,
  step = 1,
}: {
  label: string;
  value: number;
  onCommit: (value: number) => void;
  min?: number;
  step?: number;
}) {
  const [text, setText] = useState<string | null>(null);

  return (
    <label className={styles.field}>
      {label}
      <input
        type="number"
        step={step}
        min={min}
        value={text ?? String(value)}
        onFocus={() => setText(String(value))}
        onBlur={() => setText(null)}
        onChange={(event) => {
          setText(event.target.value);

          const next = Number(event.target.value);

          if (
            event.target.value !== "" &&
            Number.isFinite(next) &&
            (min === undefined || next >= min)
          ) {
            onCommit(next);
          }
        }}
      />
    </label>
  );
}

type WorkspaceProps = {
  scene: ExteriorWorldScene;
  chapterId: string;
  instances: DecorInstance[];
  setInstances: (update: (previous: DecorInstance[]) => DecorInstance[]) => void;
  onSceneChange: (sceneId: string) => void;
  onChapterChange: (chapterId: string) => void;
  onDuplicate: (targetChapterId: string) => void;
  onClear: () => void;
};

function Workspace({
  scene,
  chapterId,
  instances,
  setInstances,
  onSceneChange,
  onChapterChange,
  onDuplicate,
  onClear,
}: WorkspaceProps) {
  const world = getSceneWorld(scene.visual);
  const layerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [armedAssetId, setArmedAssetId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showColliders, setShowColliders] = useState(true);
  const [doctorOn, setDoctorOn] = useState(true);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [duplicateTarget, setDuplicateTarget] = useState(
    CHAPTER_IDS.find((id) => id !== chapterId) ?? CHAPTER_IDS[0],
  );
  const input = useEditorDirectionInput();

  // Static geometry + the real NPCs of the scene (read-only reference) + the
  // colliders of the enabled instances. Nothing is mutated.
  const realNpcs = getSceneNpcs(scene.id);
  const realNpcColliders = useMemo(() => getNpcColliders(realNpcs), [realNpcs]);
  const instanceColliders = useMemo(
    () =>
      instances.flatMap((instance) => {
        const asset = getDecorAsset(instance.assetId);
        const collider = asset && getInstanceCollider(instance, asset);

        return collider ? [collider] : [];
      }),
    [instances],
  );
  const blockingColliders = useMemo(
    () => [...scene.colliders, ...realNpcColliders, ...instanceColliders],
    [scene.colliders, realNpcColliders, instanceColliders],
  );

  const { player, playerFeetHitbox, currentSpriteSrc, spriteSize } =
    useProtagonistController({
      sceneWidth: world.width,
      sceneHeight: world.height,
      initialX: world.initialX,
      initialY: world.initialY,
      spriteSize: SPRITE_SIZE,
      sceneColliders: blockingColliders,
      input,
      inputEnabled: doctorOn,
    });

  // Interaction zones of the instances in world coordinates (they follow the
  // instance), only to preview WHERE the Doctor could interact.
  const worldZones = useMemo<InteractionZone[]>(
    () =>
      instances.flatMap((instance) =>
        instance.interaction
          ? [
              {
                id: `${instance.instanceId}-zone`,
                x: instance.x + instance.interaction.zone.offsetX,
                y: instance.y + instance.interaction.zone.offsetY,
                width: instance.interaction.zone.width,
                height: instance.interaction.zone.height,
                interactionId: instance.interaction.interactionId,
                requiredDirection: instance.interaction.requiredDirection,
              },
            ]
          : [],
      ),
    [instances],
  );
  const available = doctorOn
    ? findAvailableInteraction(worldZones, playerFeetHitbox, player.direction)
    : null;

  useEffect(() => {
    const updateScale = () => {
      setScale(
        Math.min(
          Math.max(window.innerWidth - PANEL_WIDTH - 24, 320) / world.width,
          Math.max(window.innerHeight - CHROME_HEIGHT, 180) / world.height,
          MAX_SCALE,
        ),
      );
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, [world.width, world.height]);

  const selected = instances.find((item) => item.instanceId === selectedId);
  const selectedAsset = selected && getDecorAsset(selected.assetId);

  const updateInstance = useCallback(
    (instanceId: string, patch: Partial<DecorInstance>) =>
      setInstances((previous) =>
        previous.map((item) =>
          item.instanceId === instanceId ? { ...item, ...patch } : item,
        ),
      ),
    [setInstances],
  );

  const deleteSelected = useCallback(() => {
    if (!selectedId) {
      return;
    }

    setInstances((previous) =>
      previous.filter((item) => item.instanceId !== selectedId),
    );
    setSelectedId(null);
  }, [selectedId, setInstances]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setArmedAssetId(null);
        setSelectedId(null);
        dragRef.current = null;
        return;
      }

      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        selectedId &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        deleteSelected();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, deleteSelected]);

  // Pointer position in WORLD logical units, from the real rendered box of the
  // layer (so zoom / window size never change the stored data).
  function toWorld(event: ReactPointerEvent<HTMLDivElement>) {
    const layer = layerRef.current;

    if (!layer) {
      return { x: 0, y: 0 };
    }

    return clientToWorld(
      { x: event.clientX, y: event.clientY },
      layer.getBoundingClientRect(),
      world,
    );
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    const point = toWorld(event);

    if (armedAssetId) {
      const asset = getDecorAsset(armedAssetId);

      if (!asset) {
        return;
      }

      const instance: DecorInstance = {
        instanceId: nextInstanceId(scene.id, asset.id, instances),
        assetId: asset.id,
        x: point.x,
        y: point.y,
        scale: asset.defaultScale ?? 1,
        flipX: false,
        colliderEnabled: asset.defaultCollider !== undefined,
        zOffset: 0,
      };

      setInstances((previous) => [...previous, instance]);
      setSelectedId(instance.instanceId);

      if (!event.shiftKey) {
        setArmedAssetId(null);
      }

      return;
    }

    const target = (event.target as HTMLElement).closest("[data-instance-id]");
    const instanceId = target?.getAttribute("data-instance-id") ?? null;
    const instance = instances.find((item) => item.instanceId === instanceId);

    if (!instance) {
      setSelectedId(null);
      return;
    }

    setSelectedId(instance.instanceId);
    dragRef.current = {
      id: instance.instanceId,
      dx: point.x - instance.x,
      dy: point.y - instance.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const point = toWorld(event);

    setCursor(point);

    const drag = dragRef.current;

    if (drag) {
      updateInstance(drag.id, {
        x: Math.min(Math.max(point.x - drag.dx, 0), world.width),
        y: Math.min(Math.max(point.y - drag.dy, 0), world.height),
      });
    }
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    dragRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const exportText = formatComposition({
    sceneId: scene.id,
    chapterId,
    instances,
  });

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Copy failed: select the text manually");
    }
  }

  function setInteractionEnabled(instance: DecorInstance, enabled: boolean) {
    if (!enabled) {
      updateInstance(instance.instanceId, { interaction: undefined });
      return;
    }

    const collider = getDecorAsset(instance.assetId)?.defaultCollider;

    updateInstance(instance.instanceId, {
      interaction: {
        interactionId: "",
        // Around the body collider when there is one, else a generic box.
        zone: collider
          ? {
              offsetX: collider.offsetX - DEFAULT_ZONE_MARGIN,
              offsetY: collider.offsetY - DEFAULT_ZONE_MARGIN,
              width: collider.width + DEFAULT_ZONE_MARGIN * 2,
              height: collider.height + DEFAULT_ZONE_MARGIN * 2,
            }
          : { offsetX: -30, offsetY: -60, width: 60, height: 60 },
      },
    });
  }

  function updateInteraction(
    instance: DecorInstance,
    patch: Partial<NonNullable<DecorInstance["interaction"]>>,
  ) {
    if (!instance.interaction) {
      return;
    }

    updateInstance(instance.instanceId, {
      interaction: { ...instance.interaction, ...patch },
    });
  }

  const overlayBox = (
    key: string,
    rect: { x: number; y: number; width: number; height: number },
    color: string,
    dashed = false,
  ) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        boxSizing: "border-box",
        border: `1px ${dashed ? "dashed" : "solid"} ${color}`,
        background: dashed ? "transparent" : `${color}40`,
        pointerEvents: "none",
      }}
    />
  );

  return (
    <div className={styles.page}>
      <aside className={styles.panel} style={{ width: PANEL_WIDTH }}>
        <h1 className={styles.title}>/dev/decorator</h1>
        <p className={styles.hint}>
          DEV-ONLY. Pick an asset, click the map to place it, drag to move.
          Esc cancels. Delete removes the selected instance.
        </p>

        <h2 className={styles.sectionTitle}>Library</h2>
        {DECOR_CATEGORY_ORDER.map((category) => {
          const assets = DECOR_ASSETS.filter((a) => a.category === category);

          if (assets.length === 0) {
            return null;
          }

          return (
            <div key={category}>
              <div className={styles.hint}>{category.toUpperCase()}</div>
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  className={`${styles.assetButton} ${
                    armedAssetId === asset.id ? styles.assetActive : ""
                  }`}
                  aria-pressed={armedAssetId === asset.id}
                  onClick={(event) => {
                    event.currentTarget.blur();
                    setArmedAssetId((current) =>
                      current === asset.id ? null : asset.id,
                    );
                  }}
                >
                  <span>{asset.label}</span>
                  <span className={styles.hint}>
                    {asset.sprite.frames.length > 1
                      ? `${asset.sprite.frames.length}f @${asset.sprite.fps}fps`
                      : "static"}
                  </span>
                </button>
              ))}
            </div>
          );
        })}
        <p className={styles.hint}>
          {armedAssetId
            ? `Placing "${armedAssetId}": click the map (Shift keeps placing).`
            : "No asset armed."}
        </p>

        <h2 className={styles.sectionTitle}>
          Selected {selected ? "" : "(none)"}
        </h2>
        {selected && selectedAsset ? (
          <>
            <div className={styles.field}>
              instanceId <b data-testid="sel-instance-id">{selected.instanceId}</b>
            </div>
            <div className={styles.field}>
              assetId <b>{selected.assetId}</b>
            </div>
            <NumberField
              label="x"
              value={selected.x}
              onCommit={(value) => updateInstance(selected.instanceId, { x: value })}
            />
            <NumberField
              label="y"
              value={selected.y}
              onCommit={(value) => updateInstance(selected.instanceId, { y: value })}
            />
            <NumberField
              label="scale"
              value={selected.scale}
              min={0.1}
              step={0.05}
              onCommit={(value) =>
                updateInstance(selected.instanceId, { scale: value })
              }
            />
            <NumberField
              label="zOffset"
              value={selected.zOffset}
              onCommit={(value) =>
                updateInstance(selected.instanceId, { zOffset: value })
              }
            />
            <label className={styles.field}>
              flipX
              <input
                type="checkbox"
                checked={selected.flipX}
                onChange={(event) =>
                  updateInstance(selected.instanceId, {
                    flipX: event.target.checked,
                  })
                }
              />
            </label>
            <label className={styles.field}>
              collider{" "}
              {selectedAsset.defaultCollider ? "" : "(asset has none)"}
              <input
                type="checkbox"
                checked={selected.colliderEnabled}
                disabled={!selectedAsset.defaultCollider}
                onChange={(event) =>
                  updateInstance(selected.instanceId, {
                    colliderEnabled: event.target.checked,
                  })
                }
              />
            </label>
            <label className={styles.field}>
              interaction
              <input
                type="checkbox"
                checked={selected.interaction !== undefined}
                onChange={(event) =>
                  setInteractionEnabled(selected, event.target.checked)
                }
              />
            </label>
            {selected.interaction ? (
              <>
                <label className={styles.field}>
                  interactionId
                  <input
                    type="text"
                    value={selected.interaction.interactionId}
                    spellCheck={false}
                    placeholder="what is interacted with"
                    onChange={(event) =>
                      updateInteraction(selected, {
                        interactionId: event.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.field}>
                  requiredDirection
                  <select
                    value={selected.interaction.requiredDirection ?? ""}
                    onChange={(event) =>
                      updateInteraction(selected, {
                        requiredDirection:
                          event.target.value === ""
                            ? undefined
                            : (event.target.value as Direction),
                      })
                    }
                  >
                    <option value="">any</option>
                    {DIRECTIONS.map((direction) => (
                      <option key={direction} value={direction}>
                        {direction}
                      </option>
                    ))}
                  </select>
                </label>
                {(
                  [
                    ["zone offsetX", "offsetX"],
                    ["zone offsetY", "offsetY"],
                    ["zone width", "width"],
                    ["zone height", "height"],
                  ] as const
                ).map(([label, key]) => (
                  <NumberField
                    key={key}
                    label={label}
                    value={selected.interaction!.zone[key]}
                    min={key === "width" || key === "height" ? 1 : undefined}
                    onCommit={(value) =>
                      updateInteraction(selected, {
                        zone: { ...selected.interaction!.zone, [key]: value },
                      })
                    }
                  />
                ))}
                {selected.interaction.interactionId === "" ? (
                  <p className={`${styles.hint} ${styles.warn}`}>
                    interactionId is empty.
                  </p>
                ) : null}
              </>
            ) : null}
            <button
              type="button"
              className={`${styles.button} ${styles.danger}`}
              onClick={deleteSelected}
            >
              DELETE
            </button>
          </>
        ) : (
          <p className={styles.hint}>Click an instance on the map.</p>
        )}

        <h2 className={styles.sectionTitle}>
          Export · {scene.id} / {chapterId} ({instances.length})
        </h2>
        <button type="button" className={styles.button} onClick={copyExport}>
          COPY COMPOSITION
        </button>
        <textarea
          className={styles.exportText}
          readOnly
          value={exportText}
          spellCheck={false}
        />
        <div className={styles.hint}>{copyStatus}</div>
      </aside>

      <div className={styles.main}>
        <div className={styles.toolbar}>
          <label>
            Scene
            <select
              value={scene.id}
              onChange={(event) => onSceneChange(event.target.value)}
            >
              {SCENES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.visual.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Chapter
            <select
              value={chapterId}
              onChange={(event) => onChapterChange(event.target.value)}
            >
              {CHAPTER_IDS.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={showColliders}
              onChange={(event) => setShowColliders(event.target.checked)}
            />
            SHOW COLLIDERS
          </label>
          <label>
            <input
              type="checkbox"
              checked={doctorOn}
              onChange={(event) => setDoctorOn(event.target.checked)}
            />
            Doctor (arrows / WASD)
          </label>
          <span className={styles.row}>
            <select
              value={duplicateTarget}
              onChange={(event) => setDuplicateTarget(event.target.value)}
            >
              {CHAPTER_IDS.filter((id) => id !== chapterId).map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={styles.button}
              onClick={() => onDuplicate(duplicateTarget)}
            >
              DUPLICATE COMPOSITION →
            </button>
            <button
              type="button"
              className={`${styles.button} ${styles.danger}`}
              onClick={onClear}
            >
              CLEAR CURRENT COMPOSITION
            </button>
          </span>
          <span className={styles.hint} data-testid="hud">
            world {world.width}×{world.height} · scale {scale.toFixed(2)}× ·
            cursor {cursor ? `(${cursor.x}, ${cursor.y})` : "—"} · Doctor (
            {Math.round(player.x)}, {Math.round(player.y)}) {player.direction} ·
            interaction:{" "}
            <b data-testid="doctor-interaction">
              {available ? available.interactionId || "(no id)" : "none"}
            </b>
          </span>
        </div>
        <div className={styles.canvasArea}>
          <div
            className={styles.viewport}
            style={{
              ["--world-width" as string]: `${world.width}px`,
              ["--world-height" as string]: `${world.height}px`,
              ["--scale" as string]: scale,
            }}
          >
            <div
              ref={layerRef}
              data-testid="layer"
              className={`${styles.layer} ${armedAssetId ? styles.placing : ""}`}
              style={{ backgroundImage: `url("${scene.visual.backgroundSrc}")` }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={() => setCursor(null)}
            >
              {/* Reference sprites never take clicks: instances under them stay
                  selectable. (Wrapper is not positioned: children still stack
                  in the layer.) */}
              <div style={{ pointerEvents: "none" }}>
                {realNpcs.map((npc) => (
                  <SceneNpcSprite key={npc.id} npc={npc} />
                ))}
              </div>
              {instances.map((instance) => {
                const asset = getDecorAsset(instance.assetId);

                return asset ? (
                  <DecorSprite
                    key={instance.instanceId}
                    asset={asset}
                    instance={instance}
                  />
                ) : null;
              })}
              {doctorOn ? (
                <div style={{ pointerEvents: "none" }}>
                  <ProtagonistSprite
                    x={player.x}
                    y={player.y}
                    spriteSrc={currentSpriteSrc}
                    spriteSize={spriteSize}
                    direction={player.direction}
                    isWalking={player.isWalking}
                    scale={scene.visual.protagonistScale}
                    zIndex={Math.round(player.y)}
                  />
                </div>
              ) : null}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: OVERLAY_Z_INDEX,
                  pointerEvents: "none",
                }}
              >
                {selected && selectedAsset
                  ? (() => {
                      const box = getSpriteBox(selectedAsset, selected);

                      return (
                        <div
                          key="selection"
                          data-testid="selection-box"
                          style={{
                            position: "absolute",
                            left: box.x,
                            top: box.y,
                            width: box.width,
                            height: box.height,
                            boxSizing: "border-box",
                            border: "1px solid #ffffff",
                            outline: "1px dashed #000000",
                            pointerEvents: "none",
                          }}
                        />
                      );
                    })()
                  : null}
                {showColliders ? (
                  <>
                    {scene.colliders.map((collider) =>
                      overlayBox(collider.id, collider, "#ff5c5c"),
                    )}
                    {scene.exits.map((exit) =>
                      overlayBox(`exit-${exit.name}`, exit.zone, "#ffd60a"),
                    )}
                    {realNpcColliders.map((collider) =>
                      overlayBox(collider.id, collider, "#ff9f1c"),
                    )}
                    {instances.map((instance) => {
                      const asset = getDecorAsset(instance.assetId);
                      const active = asset && getInstanceCollider(instance, asset);
                      const inactive =
                        asset && !active
                          ? getInstanceCollider(instance, asset, true)
                          : null;

                      return active
                        ? overlayBox(`ic-${instance.instanceId}`, active, "#ff9f1c")
                        : inactive
                          ? overlayBox(
                              `ic-${instance.instanceId}`,
                              inactive,
                              "#9a9a9a",
                              true,
                            )
                          : null;
                    })}
                    {worldZones.map((zone) =>
                      overlayBox(zone.id, zone, "#3ddc84"),
                    )}
                    {overlayBox(
                      "doctor-hitbox",
                      playerFeetHitbox,
                      "#4de7ff",
                    )}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const INITIAL_SCENE_ID = "plaza";

export default function DecoratorApp() {
  const [sceneId, setSceneId] = useState<string>(INITIAL_SCENE_ID);
  const [chapterId, setChapterId] = useState(CHAPTER_IDS[0]);
  // Every composition opened so far, by scene + chapter. Kept apart: changing
  // one never touches another. Loaded from the DEV-ONLY localStorage the first
  // time each one is opened (this component is client-only).
  const [store, setStore] = useState<Record<string, DecorInstance[]>>(() => ({
    [compositionKey(INITIAL_SCENE_ID, CHAPTER_IDS[0])]: loadInstances(
      INITIAL_SCENE_ID,
      CHAPTER_IDS[0],
    ),
  }));
  const key = compositionKey(sceneId, chapterId);
  const instances = store[key];
  const scene =
    SCENES.find((candidate) => candidate.id === sceneId) ?? SCENES[0];

  const openComposition = useCallback(
    (nextSceneId: string, nextChapterId: string) => {
      const nextKey = compositionKey(nextSceneId, nextChapterId);

      setStore((previous) =>
        nextKey in previous
          ? previous
          : {
              ...previous,
              [nextKey]: loadInstances(nextSceneId, nextChapterId),
            },
      );
      setSceneId(nextSceneId);
      setChapterId(nextChapterId);
    },
    [],
  );

  // Persist only the composition being edited.
  useEffect(() => {
    if (instances !== undefined) {
      saveInstances(sceneId, chapterId, instances);
    }
  }, [instances, sceneId, chapterId]);

  const setInstances = useCallback(
    (update: (previous: DecorInstance[]) => DecorInstance[]) =>
      setStore((previous) => ({
        ...previous,
        [key]: update(previous[key] ?? []),
      })),
    [key],
  );

  const duplicateTo = useCallback(
    (targetChapterId: string) => {
      const targetKey = compositionKey(sceneId, targetChapterId);
      const existing =
        store[targetKey] ?? loadInstances(sceneId, targetChapterId);

      if (
        existing.length > 0 &&
        !window.confirm(
          `"${targetChapterId}" already has ${existing.length} instances. Replace them with a copy of "${chapterId}"?`,
        )
      ) {
        return;
      }

      // Deep copy: from now on the two compositions are independent.
      const copy = cloneInstances(store[key] ?? []);

      saveInstances(sceneId, targetChapterId, copy);
      setStore((previous) => ({ ...previous, [targetKey]: copy }));
    },
    [sceneId, chapterId, key, store],
  );

  const clearCurrent = useCallback(() => {
    if (
      !window.confirm(
        `Clear ${sceneId} / ${chapterId}? Other compositions are not affected.`,
      )
    ) {
      return;
    }

    clearStoredInstances(sceneId, chapterId);
    setStore((previous) => ({ ...previous, [key]: [] }));
  }, [sceneId, chapterId, key]);

  if (!scene || instances === undefined) {
    return null;
  }

  return (
    // key remounts the workspace per scene + chapter: selection, drag and the
    // Doctor's position reset while every composition stays in `store`.
    <Workspace
      key={key}
      scene={scene}
      chapterId={chapterId}
      instances={instances}
      setInstances={setInstances}
      onSceneChange={(next) => openComposition(next as SceneId, chapterId)}
      onChapterChange={(next) => openComposition(sceneId, next)}
      onDuplicate={duplicateTo}
      onClear={clearCurrent}
    />
  );
}
