"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  plazaColliders,
  plazaSpawns,
  plazaTransitions,
} from "../../../game/plaza/plazaGeometry";
import {
  PROTAGONIST_FEET_HITBOX,
  type Direction,
} from "../../../game/protagonist/useProtagonistController";
import { DEV_SCENES, getSceneWorld, type DevScene } from "../scene/scenes";
import {
  clientToWorld,
  formatSceneExport,
  MIN_COLLIDER_SIZE,
  normalizeRect,
  type Point,
  type Rect,
} from "./geometry";
import styles from "./page.module.css";

// Internal scene geometry editor. It shows the whole logical world of each
// scene (no gameplay camera) and stores everything in world units. Every scene
// keeps its own colliders, transitions and spawns; the data lives in the page
// so switching scenes never mixes them.
const EDITOR_SCENES: {
  sceneId: string;
  idPrefix: string;
  exportPrefix: string;
}[] = [
  { sceneId: "plaza", idPrefix: "plaza", exportPrefix: "plaza" },
  {
    sceneId: "apothecary-street",
    idPrefix: "apothecary-street",
    exportPrefix: "apothecaryStreet",
  },
  {
    sceneId: "calle-taberna",
    idPrefix: "tavern-street",
    exportPrefix: "tavernStreet",
  },
  {
    sceneId: "outskirts-brook-provisional",
    idPrefix: "outskirts",
    exportPrefix: "outskirts",
  },
  { sceneId: "forest-v1", idPrefix: "forest", exportPrefix: "forest" },
  {
    sceneId: "doctor-room",
    idPrefix: "doctor-room",
    exportPrefix: "doctorRoom",
  },
  {
    sceneId: "tavern-interior",
    idPrefix: "tavern-interior",
    exportPrefix: "tavernInterior",
  },
];
type EditorSceneConfig = (typeof EDITOR_SCENES)[number];
const PANEL_WIDTH = 380;
const SCENE_PADDING = 48;
const MAX_SCALE = 4;
// A spawn is placed with a single click; a press-release farther apart than
// this (world units) is treated as an accidental drag and ignored.
const SPAWN_CLICK_TOLERANCE = 6;
const DIRECTIONS: Direction[] = ["north", "south", "east", "west"];
// Degrees of the facing tick drawn on a spawn marker (0 = pointing east).
const DIRECTION_ANGLE: Record<Direction, number> = {
  east: 0,
  south: 90,
  west: 180,
  north: 270,
};

type Kind = "collider" | "transition" | "spawn";

const KINDS: { kind: Kind; label: string; color: string }[] = [
  { kind: "collider", label: "🔴 COLLIDER", color: "#ff5c5c" },
  { kind: "transition", label: "🟡 TRANSITION", color: "#ffd60a" },
  { kind: "spawn", label: "🔵 SPAWN", color: "#4da3ff" },
];

// `editorId` is stable while editing and never reused (one counter for all
// scenes); the exported ids are derived from each list's order at export time.
type EditorRect = Rect & { editorId: string };
type EditorSpawn = Point & { editorId: string; direction: Direction };
type SceneData = {
  colliders: EditorRect[];
  transitions: EditorRect[];
  spawns: EditorSpawn[];
};
type Drag = { start: Point; current: Point };
type Selection = { kind: Kind; editorId: string };

let editorIdCounter = 0;

function newEditorId(kind: Kind) {
  editorIdCounter += 1;

  return `${kind}-${editorIdCounter}`;
}

// Plaza starts loaded from its source of truth in code (src/game/plaza); the
// other scenes start empty.
function createInitialData(sceneId: string): SceneData {
  if (sceneId === "plaza") {
    return {
      colliders: plazaColliders.map((item) => ({
        editorId: newEditorId("collider"),
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
      })),
      transitions: plazaTransitions.map((item) => ({
        editorId: newEditorId("transition"),
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
      })),
      spawns: plazaSpawns.map((item) => ({
        editorId: newEditorId("spawn"),
        x: item.x,
        y: item.y,
        direction: item.direction,
      })),
    };
  }

  return { colliders: [], transitions: [], spawns: [] };
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "TEXTAREA" ||
      target.tagName === "INPUT" ||
      target.tagName === "SELECT")
  );
}

type ListRow = { editorId: string; label: string };

function ListSection({
  title,
  kind,
  color,
  rows,
  selection,
  onSelect,
  onDelete,
}: {
  title: string;
  kind: Kind;
  color: string;
  rows: ListRow[];
  selection: Selection | null;
  onSelect: (kind: Kind, editorId: string) => void;
  onDelete: (kind: Kind, editorId: string) => void;
}) {
  return (
    <section className={styles.listSection}>
      <h2 className={styles.listTitle} style={{ borderColor: color }}>
        {title} ({rows.length})
      </h2>
      <ul className={styles.list}>
        {rows.map((row) => {
          const isSelected =
            selection?.kind === kind && selection.editorId === row.editorId;

          return (
            <li
              key={row.editorId}
              className={
                isSelected ? `${styles.row} ${styles.rowSelected}` : styles.row
              }
            >
              <button
                type="button"
                className={styles.rowSelect}
                onClick={() => onSelect(kind, row.editorId)}
              >
                {row.label}
              </button>
              <button
                type="button"
                className={styles.rowDelete}
                aria-label={`Delete ${row.label}`}
                onClick={() => onDelete(kind, row.editorId)}
              >
                ×
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SceneGeometryEditor({
  scene,
  config,
  data,
  onDataChange,
  sceneOptions,
  onSelectScene,
}: {
  scene: DevScene;
  config: EditorSceneConfig;
  data: SceneData;
  onDataChange: (update: (previous: SceneData) => SceneData) => void;
  sceneOptions: { sceneId: string; label: string }[];
  onSelectScene: (sceneId: string) => void;
}) {
  const world = getSceneWorld(scene);
  const layerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [mode, setMode] = useState<Kind>("collider");
  const [spawnDirection, setSpawnDirection] = useState<Direction>("south");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [cursor, setCursor] = useState<Point | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const { colliders, transitions, spawns } = data;

  // Functional updaters over this scene's data (immutable: spread / filter).
  const setColliders = (update: (previous: EditorRect[]) => EditorRect[]) =>
    onDataChange((previous) => ({
      ...previous,
      colliders: update(previous.colliders),
    }));
  const setTransitions = (update: (previous: EditorRect[]) => EditorRect[]) =>
    onDataChange((previous) => ({
      ...previous,
      transitions: update(previous.transitions),
    }));
  const setSpawns = (update: (previous: EditorSpawn[]) => EditorSpawn[]) =>
    onDataChange((previous) => ({
      ...previous,
      spawns: update(previous.spawns),
    }));

  useEffect(() => {
    const updateScale = () => {
      const availableWidth = Math.max(
        window.innerWidth - PANEL_WIDTH - SCENE_PADDING,
        320,
      );
      const availableHeight = Math.max(window.innerHeight - SCENE_PADDING, 180);

      setScale(
        Math.min(
          availableWidth / world.width,
          availableHeight / world.height,
          MAX_SCALE,
        ),
      );
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, [world.width, world.height]);

  // Immutable removal (filter) from the list that matches the kind.
  const removeItem = useCallback(
    (kind: Kind, editorId: string) => {
      const keep = (item: { editorId: string }) => item.editorId !== editorId;

      onDataChange((previous) => ({
        colliders:
          kind === "collider"
            ? previous.colliders.filter(keep)
            : previous.colliders,
        transitions:
          kind === "transition"
            ? previous.transitions.filter(keep)
            : previous.transitions,
        spawns:
          kind === "spawn" ? previous.spawns.filter(keep) : previous.spawns,
      }));
      setSelection((current) =>
        current?.kind === kind && current.editorId === editorId
          ? null
          : current,
      );
    },
    [onDataChange],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrag(null);
        return;
      }

      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        selection !== null &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        removeItem(selection.kind, selection.editorId);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selection, removeItem]);

  // Pointer position in world units, from the real rendered box of the layer.
  function toWorld(event: ReactPointerEvent<HTMLDivElement>): Point {
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

    event.currentTarget.setPointerCapture(event.pointerId);
    const point = toWorld(event);
    setDrag({ start: point, current: point });
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const point = toWorld(event);

    setCursor(point);
    setDrag((current) => (current ? { ...current, current: point } : current));
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!drag) {
      return;
    }

    const end = toWorld(event);

    setDrag(null);

    if (mode === "spawn") {
      // Single click: the spawn goes exactly where the button was pressed.
      const moved = Math.hypot(end.x - drag.start.x, end.y - drag.start.y);

      if (moved > SPAWN_CLICK_TOLERANCE) {
        return;
      }

      // Build the item (and consume its id) here, not inside the updater.
      const newSpawn: EditorSpawn = {
        editorId: newEditorId("spawn"),
        x: drag.start.x,
        y: drag.start.y,
        direction: spawnDirection,
      };

      setSpawns((previous) => [...previous, newSpawn]);
      setSelection({ kind: "spawn", editorId: newSpawn.editorId });
      return;
    }

    const rect = normalizeRect(drag.start, end);

    if (rect.width < MIN_COLLIDER_SIZE || rect.height < MIN_COLLIDER_SIZE) {
      return;
    }

    const newRect: EditorRect = { editorId: newEditorId(mode), ...rect };

    if (mode === "collider") {
      setColliders((previous) => [...previous, newRect]);
    } else {
      setTransitions((previous) => [...previous, newRect]);
    }

    setSelection({ kind: mode, editorId: newRect.editorId });
  }

  function selectMode(nextMode: Kind) {
    setDrag(null);
    setMode(nextMode);
  }

  const previewRect =
    drag && mode !== "spawn" ? normalizeRect(drag.start, drag.current) : null;
  const modeColor = KINDS.find((entry) => entry.kind === mode)?.color;
  const exportText = formatSceneExport(
    { colliders, transitions, spawns },
    config.idPrefix,
    {
      colliders: `${config.exportPrefix}Colliders`,
      transitions: `${config.exportPrefix}Transitions`,
      spawns: `${config.exportPrefix}Spawns`,
    },
  );

  async function copyExport() {
    try {
      await navigator.clipboard.writeText(exportText);
      setCopyStatus("Copied");
    } catch {
      setCopyStatus("Copy failed: select the text manually");
    }
  }

  const isSelected = (kind: Kind, editorId: string) =>
    selection?.kind === kind && selection.editorId === editorId;

  const rectLabel = (prefix: string, index: number, item: EditorRect) =>
    `${prefix}-${index + 1} · (${item.x}, ${item.y}) ${item.width}×${item.height}`;

  return (
    <>
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
            className={styles.layer}
            style={{ backgroundImage: `url("${scene.backgroundSrc}")` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={() => setCursor(null)}
          >
            {colliders.map((item) => (
              <div
                key={item.editorId}
                className={
                  isSelected("collider", item.editorId)
                    ? `${styles.collider} ${styles.itemSelected}`
                    : styles.collider
                }
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.height,
                }}
              />
            ))}
            {transitions.map((item) => (
              <div
                key={item.editorId}
                className={
                  isSelected("transition", item.editorId)
                    ? `${styles.transition} ${styles.itemSelected}`
                    : styles.transition
                }
                style={{
                  left: item.x,
                  top: item.y,
                  width: item.width,
                  height: item.height,
                }}
              />
            ))}
            {spawns.map((item) => (
              <div
                key={item.editorId}
                className={
                  isSelected("spawn", item.editorId)
                    ? `${styles.spawn} ${styles.spawnSelected}`
                    : styles.spawn
                }
                style={{ left: item.x, top: item.y }}
              >
                {/* Feet hitbox the protagonist will have at this point. */}
                <div
                  className={styles.spawnFeet}
                  style={{
                    left: PROTAGONIST_FEET_HITBOX.offsetX,
                    top: PROTAGONIST_FEET_HITBOX.offsetY,
                    width: PROTAGONIST_FEET_HITBOX.width,
                    height: PROTAGONIST_FEET_HITBOX.height,
                  }}
                />
                <div className={styles.spawnDot} />
                <div
                  className={styles.spawnDirection}
                  style={{
                    transform: `rotate(${DIRECTION_ANGLE[item.direction]}deg)`,
                  }}
                />
              </div>
            ))}
            {previewRect ? (
              <div
                className={styles.preview}
                style={{
                  left: previewRect.x,
                  top: previewRect.y,
                  width: previewRect.width,
                  height: previewRect.height,
                  borderColor: modeColor,
                }}
              />
            ) : null}
          </div>
        </div>
      </div>
      <aside className={styles.panel} style={{ width: PANEL_WIDTH }}>
        <h1 className={styles.title}>/dev/collisions · {scene.label}</h1>
        <div className={styles.scenes} role="group" aria-label="Scene">
          {sceneOptions.map((option) => (
            <button
              key={option.sceneId}
              type="button"
              className={
                option.sceneId === scene.id
                  ? `${styles.sceneButton} ${styles.sceneButtonActive}`
                  : styles.sceneButton
              }
              aria-pressed={option.sceneId === scene.id}
              onClick={(event) => {
                event.currentTarget.blur();
                onSelectScene(option.sceneId);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className={styles.modes} role="group" aria-label="Drawing mode">
          {KINDS.map((entry) => (
            <button
              key={entry.kind}
              type="button"
              className={
                entry.kind === mode
                  ? `${styles.modeButton} ${styles.modeButtonActive}`
                  : styles.modeButton
              }
              style={{ borderColor: entry.color }}
              aria-pressed={entry.kind === mode}
              onClick={() => selectMode(entry.kind)}
            >
              {entry.label}
            </button>
          ))}
        </div>
        {mode === "spawn" ? (
          <label className={styles.directionPicker}>
            Facing of new spawns
            <select
              value={spawnDirection}
              onChange={(event) =>
                setSpawnDirection(event.target.value as Direction)
              }
            >
              {DIRECTIONS.map((direction) => (
                <option key={direction} value={direction}>
                  {direction}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <p className={styles.hint}>
          {mode === "spawn"
            ? "Click once to place the exact point where the feet will appear. The facing is the initial idle direction: arriving from the left → east, right → west, top → south, bottom → north."
            : `Drag on the map to draw a ${mode}.`}{" "}
          Esc cancels a drawing. Click a row to select it; Delete / Backspace or
          × removes it.
        </p>
        <div className={styles.hud}>
          <div>
            world {world.width}×{world.height} units · scale{" "}
            {scale.toFixed(2)}×
          </div>
          <div>
            cursor {cursor ? `(${cursor.x}, ${cursor.y})` : "—"} · mode {mode}
          </div>
          <div>
            drawing{" "}
            {previewRect
              ? `(${previewRect.x}, ${previewRect.y}) ${previewRect.width}×${previewRect.height}`
              : "—"}
          </div>
          <div>
            colliders {colliders.length} · transitions {transitions.length} ·
            spawns {spawns.length}
          </div>
        </div>
        <ListSection
          title="Colliders"
          kind="collider"
          color="#ff5c5c"
          rows={colliders.map((item, index) => ({
            editorId: item.editorId,
            label: rectLabel(config.idPrefix, index, item),
          }))}
          selection={selection}
          onSelect={(kind, editorId) => setSelection({ kind, editorId })}
          onDelete={removeItem}
        />
        <ListSection
          title="Transitions"
          kind="transition"
          color="#ffd60a"
          rows={transitions.map((item, index) => ({
            editorId: item.editorId,
            label: rectLabel(`${config.idPrefix}-transition`, index, item),
          }))}
          selection={selection}
          onSelect={(kind, editorId) => setSelection({ kind, editorId })}
          onDelete={removeItem}
        />
        <ListSection
          title="Spawns"
          kind="spawn"
          color="#4da3ff"
          rows={spawns.map((item, index) => ({
            editorId: item.editorId,
            label: `${config.idPrefix}-spawn-${index + 1} · (${item.x}, ${item.y}) ${item.direction}`,
          }))}
          selection={selection}
          onSelect={(kind, editorId) => setSelection({ kind, editorId })}
          onDelete={removeItem}
        />
        <div className={styles.exportBox}>
          <div className={styles.exportHeader}>
            <span>Export (TypeScript)</span>
            <button
              type="button"
              className={styles.copyButton}
              onClick={copyExport}
            >
              Copy
            </button>
          </div>
          <textarea
            className={styles.exportText}
            readOnly
            value={exportText}
            spellCheck={false}
          />
          <div className={styles.copyStatus}>{copyStatus}</div>
        </div>
      </aside>
    </>
  );
}

export default function CollisionsDevPage() {
  const [sceneId, setSceneId] = useState(EDITOR_SCENES[0].sceneId);
  // Each scene's data, kept apart so switching scenes never mixes them.
  const [store, setStore] = useState<Record<string, SceneData>>(() =>
    Object.fromEntries(
      EDITOR_SCENES.map((entry) => [
        entry.sceneId,
        createInitialData(entry.sceneId),
      ]),
    ),
  );
  const config = EDITOR_SCENES.find((entry) => entry.sceneId === sceneId);
  const scene = DEV_SCENES.find((candidate) => candidate.id === sceneId);
  const data = store[sceneId];

  const updateSceneData = useCallback(
    (update: (previous: SceneData) => SceneData) => {
      setStore((previous) => ({
        ...previous,
        [sceneId]: update(previous[sceneId]),
      }));
    },
    [sceneId],
  );

  const sceneOptions = EDITOR_SCENES.map((entry) => ({
    sceneId: entry.sceneId,
    label:
      DEV_SCENES.find((candidate) => candidate.id === entry.sceneId)?.label ??
      entry.sceneId,
  }));

  return (
    <main className={styles.page}>
      {scene && config && data ? (
        // key remounts the editor per scene: the selection and any drawing in
        // progress are reset, while the data stays in `store`.
        <SceneGeometryEditor
          key={sceneId}
          scene={scene}
          config={config}
          data={data}
          onDataChange={updateSceneData}
          sceneOptions={sceneOptions}
          onSelectScene={setSceneId}
        />
      ) : (
        <p className={styles.hint}>Scene &quot;{sceneId}&quot; not found.</p>
      )}
    </main>
  );
}
