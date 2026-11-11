"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  apothecaryMainZoneColliders,
  apothecaryMainZoneSpawns,
  apothecaryMainZoneTransitions,
} from "../../../game/apothecary/apothecaryMainZoneGeometry";
import type {
  LogicalRect,
  PolygonCollider,
  SceneCollider,
} from "../../../game/collision";
import type { OcclusionShape } from "../../../game/occlusion";
import { getSceneInteractionZones } from "../../../game/interactions/sceneInteractions";
import { ENVIRONMENT_INTERACTIONS, STORY_ZONE_INTERACTIONS } from "../../../game/interactions/environmentCatalog";
import {
  doctorRoomNewColliders,
  doctorRoomNewSpawns,
  doctorRoomNewTransitions,
} from "../../../game/doctor-room/doctorRoomNewGeometry";
import {
  farmColliders,
  farmSpawns,
  farmTransitions,
} from "../../../game/farm/farmGeometry";
import {
  mineInteriorColliders,
  mineInteriorSpawns,
  mineInteriorTransitions,
} from "../../../game/mine-interior/mineInteriorGeometry";
import {
  millFarmlandColliders,
  millFarmlandSpawns,
  millFarmlandTransitions,
} from "../../../game/mill-farmland/millFarmlandGeometry";
import {
  mineNaturalCaveColliders,
  mineNaturalCaveSpawns,
  mineNaturalCaveTransitions,
} from "../../../game/mine-natural-cave/mineNaturalCaveGeometry";
import {
  mountainPathColliders,
  mountainPathSpawns,
  mountainPathTransitions,
} from "../../../game/mountain-path/mountainPathGeometry";
import {
  outskirtsColliders,
  outskirtsSpawns,
  outskirtsTransitions,
} from "../../../game/outskirts/outskirtsGeometry";
import {
  plazaColliders,
  plazaSpawns,
  plazaTransitions,
} from "../../../game/plaza/plazaGeometry";
import {
  PROTAGONIST_FEET_HITBOX,
  type Direction,
} from "../../../game/protagonist/useProtagonistController";
import {
  tavernInteriorColliders,
  tavernInteriorOccluders,
  tavernInteriorSpawns,
  tavernInteriorTransitions,
} from "../../../game/tavern-interior/tavernInteriorGeometry";
import {
  smithyInteriorColliders,
  smithyInteriorSpawns,
  smithyInteriorTransitions,
} from "../../../game/smithy-interior/smithyInteriorGeometry";
import {
  smithyStreetColliders,
  smithyStreetSpawns,
  smithyStreetTransitions,
} from "../../../game/smithy-street/smithyStreetGeometry";
import {
  apothecaryStreetColliders as nwApothecaryStreetColliders,
  apothecaryStreetOccluders as nwApothecaryStreetOccluders,
  apothecaryStreetSpawns as nwApothecaryStreetSpawns,
  apothecaryStreetTransitions as nwApothecaryStreetTransitions,
} from "../../../game/new-world-map/geometry/apothecaryStreetGeometry";
import {
  bakeryStreetColliders as nwBakeryStreetColliders,
  bakeryStreetOccluders as nwBakeryStreetOccluders,
  bakeryStreetSpawns as nwBakeryStreetSpawns,
  bakeryStreetTransitions as nwBakeryStreetTransitions,
} from "../../../game/new-world-map/geometry/bakeryStreetGeometry";
import {
  farmColliders as nwFarmColliders,
  farmSpawns as nwFarmSpawns,
  farmTransitions as nwFarmTransitions,
} from "../../../game/new-world-map/geometry/farmGeometry";
import {
  forestColliders as nwForestColliders,
  forestOccluders as nwForestOccluders,
  forestPolygonColliders as nwForestPolygonColliders,
  forestSpawns as nwForestSpawns,
  forestTransitions as nwForestTransitions,
} from "../../../game/new-world-map/geometry/forestGeometry";
import {
  forestCottageColliders,
  forestCottageSpawns,
  forestCottageTransitions,
} from "../../../game/new-world-map/geometry/forestCottageGeometry";
import {
  millFarmlandColliders as nwMillFarmlandColliders,
  millFarmlandOccluders as nwMillFarmlandOccluders,
  millFarmlandSpawns as nwMillFarmlandSpawns,
  millFarmlandTransitions as nwMillFarmlandTransitions,
} from "../../../game/new-world-map/geometry/millFarmlandGeometry";
import {
  mountainPathColliders as nwMountainPathColliders,
  mountainPathSpawns as nwMountainPathSpawns,
  mountainPathTransitions as nwMountainPathTransitions,
} from "../../../game/new-world-map/geometry/mountainPathGeometry";
import {
  outskirtsColliders as nwOutskirtsColliders,
  outskirtsOccluders as nwOutskirtsOccluders,
  outskirtsSpawns as nwOutskirtsSpawns,
  outskirtsTransitions as nwOutskirtsTransitions,
} from "../../../game/new-world-map/geometry/outskirtsGeometry";
import {
  plazaColliders as nwPlazaColliders,
  plazaOccluders as nwPlazaOccluders,
  plazaPolygonColliders as nwPlazaPolygonColliders,
  plazaSpawns as nwPlazaSpawns,
  plazaTransitions as nwPlazaTransitions,
} from "../../../game/new-world-map/geometry/plazaGeometry";
import {
  tavernStreetColliders as nwTavernStreetColliders,
  tavernStreetSpawns as nwTavernStreetSpawns,
  tavernStreetTransitions as nwTavernStreetTransitions,
} from "../../../game/new-world-map/geometry/tavernStreetGeometry";
import {
  smithyStreetColliders as nwSmithyStreetColliders,
  smithyStreetSpawns as nwSmithyStreetSpawns,
  smithyStreetTransitions as nwSmithyStreetTransitions,
} from "../../../game/new-world-map/geometry/smithyStreetGeometry";
import { DEV_SCENES, getSceneWorld, type DevScene } from "../scene/scenes";
import { GRANARY_INTERIOR_VISUAL } from "../../../game/new-world-map/newWorldVisuals";
import {
  granaryInteriorColliders,
  granaryInteriorSpawns,
  granaryInteriorTransitions,
} from "../../../game/granary-interior/granaryInteriorGeometry";
import {
  clientToWorld,
  formatSceneExport,
  MIN_COLLIDER_SIZE,
  MIN_POLYGON_AREA,
  normalizeRect,
  pointInPolygon,
  polygonArea,
  POLYGON_CLOSE_RADIUS,
  type Point,
  type Rect,
} from "./geometry";
import {
  NIGHT_DAY_IDS,
  nightIdOf,
} from "../../../game/new-world-map/newWorldNightVisuals";
import styles from "./page.module.css";

// Internal scene geometry editor. It shows the whole logical world of each
// scene (no gameplay camera) and stores everything in world units. Every scene
// keeps its own colliders, transitions and spawns; the data lives in the page
// so switching scenes never mixes them.
// The export names of the day scenes the night ones copy (a night block is exported as
// e.g. tavernStreetNightColliders).
const NIGHT_EXPORT_PREFIX: Record<string, string> = {
  "outskirts-brook-provisional": "outskirts",
  "apothecary-street": "apothecaryStreet",
  "bakery-street": "bakeryStreet",
  "calle-taberna": "tavernStreet",
  "smithy-street": "smithyStreet",
  "forest-v1": "forest",
};

const EDITOR_SCENES: {
  sceneId: string;
  idPrefix: string;
  exportPrefix: string;
}[] = [
  {
    sceneId: "granary-interior",
    idPrefix: "granary-interior",
    exportPrefix: "granaryInterior",
  },
  { sceneId: "plaza", idPrefix: "plaza", exportPrefix: "plaza" },
  {
    // The Botica in play (Apothecary Main Zone), the Apothecary's own room, not
    // the street. Its geometry file is apothecaryMainZoneGeometry.ts, which it
    // preloads and whose ids/export names it writes.
    sceneId: "apothecary-main-zone",
    idPrefix: "apothecary-main-zone",
    exportPrefix: "apothecaryMainZone",
  },
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
    idPrefix: "doctor-room-new",
    exportPrefix: "doctorRoomNew",
  },
  {
    sceneId: "tavern-interior",
    idPrefix: "tavern-interior",
    exportPrefix: "tavernInterior",
  },
  {
    sceneId: "bakery-street",
    idPrefix: "bakery-street",
    exportPrefix: "bakeryStreet",
  },
  {
    sceneId: "bakery-interior",
    idPrefix: "bakery-interior",
    exportPrefix: "bakeryInterior",
  },
  {
    sceneId: "smithy-street",
    idPrefix: "smithy-street",
    exportPrefix: "smithyStreet",
  },
  {
    sceneId: "smithy-interior",
    idPrefix: "smithy-interior",
    exportPrefix: "smithyInterior",
  },
  {
    sceneId: "mountain-path",
    idPrefix: "mountain-path",
    exportPrefix: "mountainPath",
  },
  {
    sceneId: "mine-interior",
    idPrefix: "mine-interior",
    exportPrefix: "mineInterior",
  },
  {
    sceneId: "mine-natural-cave",
    idPrefix: "mine-natural-cave",
    exportPrefix: "mineNaturalCave",
  },
  { sceneId: "farm", idPrefix: "farm", exportPrefix: "farm" },
  {
    sceneId: "forest-cottage-interior",
    idPrefix: "forest-cottage-interior",
    exportPrefix: "forestCottageInterior",
  },
  {
    sceneId: "forest-cottage",
    idPrefix: "forest-cottage",
    exportPrefix: "forestCottage",
  },
  {
    sceneId: "mill-farmland",
    idPrefix: "mill-farmland",
    exportPrefix: "millFarmland",
  },
  // New zones: they start empty (nothing is preloaded because nothing is drawn yet).
  { sceneId: "quarry", idPrefix: "quarry", exportPrefix: "quarry" },
  {
    sceneId: "forest-deep",
    idPrefix: "forest-deep",
    exportPrefix: "forestDeep",
  },
  {
    sceneId: "forest-glade",
    idPrefix: "forest-glade",
    exportPrefix: "forestGlade",
  },
  // Night versions (chapter 3): they open with the DAY geometry copied in, so
  // only the extra obstacles of the night have to be drawn. Export names end in Night.
  ...NIGHT_DAY_IDS.map((dayId) => ({
    sceneId: nightIdOf(dayId),
    idPrefix: `${nightIdOf(dayId)}`,
    exportPrefix: `${NIGHT_EXPORT_PREFIX[dayId]}Night`,
  })),
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

// "polygon" is a free-hand RED collider: it has no button of its own (it is
// drawn in the collider mode with the free-hand shape), only a list and a
// selection.
type Kind =
  | "collider"
  | "transition"
  | "spawn"
  | "interaction"
  | "polygon"
  | "occluder";
type Shape = "rect" | "free";
// SELECT draws nothing: it only picks existing items (to delete them).
type Mode = Kind | "select";
const ZOOM_LEVELS = [1, 2, 4];

const KINDS: { kind: Mode; label: string; color: string }[] = [
  { kind: "select", label: "⌖ SELECT", color: "#d8cdb8" },
  { kind: "collider", label: "🔴 COLLIDER", color: "#ff5c5c" },
  { kind: "transition", label: "🟡 TRANSITION", color: "#ffd60a" },
  { kind: "spawn", label: "🔵 SPAWN", color: "#4da3ff" },
  { kind: "interaction", label: "🟢 INTERACTION", color: "#3ddc84" },
  { kind: "occluder", label: "🟣 DEPTH", color: "#a855f7" },
];

// `editorId` is stable while editing and never reused (one counter for all
// scenes); the exported ids are derived from each list's order at export time.
type EditorRect = Rect & { editorId: string };
type EditorSpawn = Point & { editorId: string; direction: Direction };
// interactionId names WHAT is interacted with; null facing = any facing.
type EditorInteraction = EditorRect & {
  interactionId: string;
  requiredDirection: Direction | null;
};
type EditorPolygon = { editorId: string; points: Point[] };
// A violet depth shape: the Doctor is drawn behind it while his feet are
// above depthY.
type EditorOccluder = EditorPolygon & { depthY: number };
type SceneData = {
  occluders: EditorOccluder[];
  polygons: EditorPolygon[];
  colliders: EditorRect[];
  transitions: EditorRect[];
  spawns: EditorSpawn[];
  interactions: EditorInteraction[];
};
type Drag = { start: Point; current: Point };
type Selection = { kind: Kind; editorId: string };

let editorIdCounter = 0;

function newEditorId(kind: Kind) {
  editorIdCounter += 1;

  return `${kind}-${editorIdCounter}`;
}

// Scenes whose geometry is already painted and persisted to a *Geometry.ts
// file: the editor preloads it instead of starting empty. Other scenes still
// start empty until their geometry is painted and handed over for a file.
const PERSISTED_GEOMETRY: Record<
  string,
  {
    colliders: SceneCollider[];
    transitions: (LogicalRect & { id: string })[];
    spawns: { id: string; x: number; y: number; direction: Direction }[];
    polygons?: PolygonCollider[];
    occluders?: OcclusionShape[];
  }
> = {
  "granary-interior": {
    colliders: granaryInteriorColliders,
    transitions: granaryInteriorTransitions,
    spawns: granaryInteriorSpawns,
  },
  plaza: {
    colliders: plazaColliders,
    transitions: plazaTransitions,
    spawns: plazaSpawns,
  },
  "apothecary-main-zone": {
    colliders: apothecaryMainZoneColliders,
    transitions: apothecaryMainZoneTransitions,
    spawns: apothecaryMainZoneSpawns,
  },
  "doctor-room": {
    colliders: doctorRoomNewColliders,
    transitions: doctorRoomNewTransitions,
    spawns: doctorRoomNewSpawns,
  },
  "tavern-interior": {
    colliders: tavernInteriorColliders,
    occluders: tavernInteriorOccluders,
    transitions: tavernInteriorTransitions,
    spawns: tavernInteriorSpawns,
  },
  "smithy-street": {
    colliders: smithyStreetColliders,
    transitions: smithyStreetTransitions,
    spawns: smithyStreetSpawns,
  },
  "smithy-interior": {
    colliders: smithyInteriorColliders,
    transitions: smithyInteriorTransitions,
    spawns: smithyInteriorSpawns,
  },
  "mountain-path": {
    colliders: mountainPathColliders,
    transitions: mountainPathTransitions,
    spawns: mountainPathSpawns,
  },
  "mine-interior": {
    colliders: mineInteriorColliders,
    transitions: mineInteriorTransitions,
    spawns: mineInteriorSpawns,
  },
  "mine-natural-cave": {
    colliders: mineNaturalCaveColliders,
    transitions: mineNaturalCaveTransitions,
    spawns: mineNaturalCaveSpawns,
  },
  "outskirts-brook-provisional": {
    colliders: outskirtsColliders,
    transitions: outskirtsTransitions,
    spawns: outskirtsSpawns,
  },
  farm: {
    colliders: farmColliders,
    transitions: farmTransitions,
    spawns: farmSpawns,
  },
  "mill-farmland": {
    colliders: millFarmlandColliders,
    transitions: millFarmlandTransitions,
    spawns: millFarmlandSpawns,
  },
};

// The geometry of the new world map: the scenes it redraws load it instead of
// the old files, so /dev/collisions shows the new backgrounds with their own
// colliders, transitions and spawns.
const NEW_WORLD_GEOMETRY: typeof PERSISTED_GEOMETRY = {
  plaza: {
    colliders: nwPlazaColliders,
    polygons: nwPlazaPolygonColliders,
    occluders: nwPlazaOccluders,
    transitions: nwPlazaTransitions,
    spawns: nwPlazaSpawns,
  },
  "apothecary-street": {
    colliders: nwApothecaryStreetColliders,
    occluders: nwApothecaryStreetOccluders,
    transitions: nwApothecaryStreetTransitions,
    spawns: nwApothecaryStreetSpawns,
  },
  "bakery-street": {
    colliders: nwBakeryStreetColliders,
    occluders: nwBakeryStreetOccluders,
    transitions: nwBakeryStreetTransitions,
    spawns: nwBakeryStreetSpawns,
  },
  "smithy-street": {
    colliders: nwSmithyStreetColliders,
    transitions: nwSmithyStreetTransitions,
    spawns: nwSmithyStreetSpawns,
  },
  "calle-taberna": {
    colliders: nwTavernStreetColliders,
    transitions: nwTavernStreetTransitions,
    spawns: nwTavernStreetSpawns,
  },
  "outskirts-brook-provisional": {
    colliders: nwOutskirtsColliders,
    occluders: nwOutskirtsOccluders,
    transitions: nwOutskirtsTransitions,
    spawns: nwOutskirtsSpawns,
  },
  "forest-v1": {
    colliders: nwForestColliders,
    polygons: nwForestPolygonColliders,
    occluders: nwForestOccluders,
    transitions: nwForestTransitions,
    spawns: nwForestSpawns,
  },
  "forest-cottage": {
    colliders: forestCottageColliders,
    transitions: forestCottageTransitions,
    spawns: forestCottageSpawns,
  },
  farm: {
    colliders: nwFarmColliders,
    transitions: nwFarmTransitions,
    spawns: nwFarmSpawns,
  },
  "mill-farmland": {
    colliders: nwMillFarmlandColliders,
    occluders: nwMillFarmlandOccluders,
    transitions: nwMillFarmlandTransitions,
    spawns: nwMillFarmlandSpawns,
  },
  "mountain-path": {
    colliders: nwMountainPathColliders,
    transitions: nwMountainPathTransitions,
    spawns: nwMountainPathSpawns,
  },
};

// The night scenes start with a copy of their day scene's geometry.
for (const dayId of NIGHT_DAY_IDS) {
  const dayGeometry = NEW_WORLD_GEOMETRY[dayId];

  if (dayGeometry) {
    NEW_WORLD_GEOMETRY[nightIdOf(dayId)] = dayGeometry;
  }
}

function createInitialData(sceneId: string): SceneData {
  const persisted = NEW_WORLD_GEOMETRY[sceneId] ?? PERSISTED_GEOMETRY[sceneId];
  // Persisted interaction zones come from the same registry the game reads.
  const interactions: EditorInteraction[] = getSceneInteractionZones(
    sceneId,
  ).map((item) => ({
    editorId: newEditorId("interaction"),
    x: item.x,
    y: item.y,
    width: item.width,
    height: item.height,
    interactionId: item.interactionId,
    requiredDirection: item.requiredDirection ?? null,
  }));

  if (persisted) {
    return {
      occluders: (persisted.occluders ?? []).map((item) => ({
        editorId: newEditorId("occluder"),
        depthY: item.depthY,
        points: item.points.map((p) => ({ x: p.x, y: p.y })),
      })),
      polygons: (persisted.polygons ?? []).map((item) => ({
        editorId: newEditorId("polygon"),
        points: item.points.map((p) => ({ x: p.x, y: p.y })),
      })),
      colliders: persisted.colliders.map((item) => ({
        editorId: newEditorId("collider"),
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
      })),
      transitions: persisted.transitions.map((item) => ({
        editorId: newEditorId("transition"),
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
      })),
      spawns: persisted.spawns.map((item) => ({
        editorId: newEditorId("spawn"),
        x: item.x,
        y: item.y,
        direction: item.direction,
      })),
      interactions,
    };
  }

  return {
    occluders: [],
    polygons: [],
    colliders: [],
    transitions: [],
    spawns: [],
    interactions,
  };
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
  const [mode, setMode] = useState<Mode>("collider");
  // Zoom of the canvas on top of the fit-to-window scale; the canvas area
  // scrolls when it is bigger than the window.
  const [zoom, setZoom] = useState(1);
  const areaRef = useRef<HTMLDivElement>(null);
  const zoomCenter = useRef<Point | null>(null);
  const [spawnDirection, setSpawnDirection] = useState<Direction>("south");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  // Free-hand shape: the points placed so far (not yet a collider), and the
  // vertex of the selected shape being dragged.
  const [shape, setShape] = useState<Shape>("rect");
  const [draftPoints, setDraftPoints] = useState<Point[]>([]);
  // index -1 on a depth shape is its depth line.
  const [vertexDrag, setVertexDrag] = useState<{
    kind: "polygon" | "occluder";
    editorId: string;
    index: number;
  } | null>(null);
  // Everything created in this session, oldest first, for Undo.
  const [history, setHistory] = useState<Selection[]>([]);
  const [cursor, setCursor] = useState<Point | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const { colliders, transitions, spawns, interactions, polygons, occluders } =
    data;

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

  const setInteractions = (
    update: (previous: EditorInteraction[]) => EditorInteraction[],
  ) =>
    onDataChange((previous) => ({
      ...previous,
      interactions: update(previous.interactions),
    }));
  const updateInteraction = (
    editorId: string,
    patch: Partial<Omit<EditorInteraction, "editorId">>,
  ) =>
    setInteractions((previous) =>
      previous.map((item) =>
        item.editorId === editorId ? { ...item, ...patch } : item,
      ),
    );

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
        interactions:
          kind === "interaction"
            ? previous.interactions.filter(keep)
            : previous.interactions,
        polygons:
          kind === "polygon" ? previous.polygons.filter(keep) : previous.polygons,
        occluders:
          kind === "occluder"
            ? previous.occluders.filter(keep)
            : previous.occluders,
      }));
      setSelection((current) =>
        current?.kind === kind && current.editorId === editorId
          ? null
          : current,
      );
    },
    [onDataChange],
  );

  // Closes the free-hand shape being drawn: a red collider, or in the depth
  // mode a violet shape whose depth line starts at its lowest point.
  const closeDraft = useCallback(() => {
    if (draftPoints.length < 3 || polygonArea(draftPoints) < MIN_POLYGON_AREA) {
      return;
    }

    if (mode === "occluder") {
      const created: EditorOccluder = {
        editorId: newEditorId("occluder"),
        points: draftPoints,
        depthY: Math.max(...draftPoints.map((p) => p.y)),
      };

      onDataChange((previous) => ({
        ...previous,
        occluders: [...previous.occluders, created],
      }));
      setHistory((current) => [
        ...current,
        { kind: "occluder", editorId: created.editorId },
      ]);
      setDraftPoints([]);
      setSelection({ kind: "occluder", editorId: created.editorId });
      return;
    }

    const created: EditorPolygon = {
      editorId: newEditorId("polygon"),
      points: draftPoints,
    };

    onDataChange((previous) => ({
      ...previous,
      polygons: [...previous.polygons, created],
    }));
    setHistory((current) => [
      ...current,
      { kind: "polygon", editorId: created.editorId },
    ]);
    setDraftPoints([]);
    setSelection({ kind: "polygon", editorId: created.editorId });
  }, [draftPoints, mode, onDataChange]);

  // Undo: while drawing it takes back the last point; otherwise it deletes
  // the most recent shape created in this session (of any kind).
  const undo = useCallback(() => {
    if (draftPoints.length > 0) {
      setDraftPoints((current) => current.slice(0, -1));
      return;
    }

    const lists: Record<Kind, { editorId: string }[]> = {
      collider: colliders,
      transition: transitions,
      spawn: spawns,
      interaction: interactions,
      polygon: polygons,
      occluder: occluders,
    };
    const live = history.filter((entry) =>
      lists[entry.kind].some((item) => item.editorId === entry.editorId),
    );
    const last = live[live.length - 1];

    setHistory(live.slice(0, -1));

    if (last) {
      removeItem(last.kind, last.editorId);
    }
  }, [
    draftPoints.length,
    colliders,
    transitions,
    spawns,
    interactions,
    polygons,
    occluders,
    history,
    removeItem,
  ]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrag(null);
        setDraftPoints([]);
        return;
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "z" &&
        !isTypingTarget(event.target)
      ) {
        event.preventDefault();
        undo();
        return;
      }

      if (draftPoints.length > 0 && !isTypingTarget(event.target)) {
        if (event.key === "Enter") {
          event.preventDefault();
          closeDraft();
          return;
        }

        if (event.key === "Backspace" || event.key === "Delete") {
          event.preventDefault();
          setDraftPoints((current) => current.slice(0, -1));
          return;
        }
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
  }, [selection, removeItem, draftPoints.length, closeDraft, undo]);

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

  // Every item under a point, smallest first (any kind).
  function pickAll(point: Point): Selection[] {
    const found: { entry: Selection; area: number }[] = [];
    const inRect = (r: Rect) =>
      point.x >= r.x &&
      point.x <= r.x + r.width &&
      point.y >= r.y &&
      point.y <= r.y + r.height;

    colliders.forEach((item) => {
      if (inRect(item)) {
        found.push({
          entry: { kind: "collider", editorId: item.editorId },
          area: item.width * item.height,
        });
      }
    });
    transitions.forEach((item) => {
      if (inRect(item)) {
        found.push({
          entry: { kind: "transition", editorId: item.editorId },
          area: item.width * item.height,
        });
      }
    });
    interactions.forEach((item) => {
      if (inRect(item)) {
        found.push({
          entry: { kind: "interaction", editorId: item.editorId },
          area: item.width * item.height,
        });
      }
    });
    spawns.forEach((item) => {
      if (Math.hypot(point.x - item.x, point.y - item.y) <= 8) {
        found.push({
          entry: { kind: "spawn", editorId: item.editorId },
          area: 0,
        });
      }
    });
    polygons.forEach((item) => {
      if (pointInPolygon(point, item.points)) {
        found.push({
          entry: { kind: "polygon", editorId: item.editorId },
          area: polygonArea(item.points),
        });
      }
    });
    occluders.forEach((item) => {
      if (pointInPolygon(point, item.points)) {
        found.push({
          entry: { kind: "occluder", editorId: item.editorId },
          area: polygonArea(item.points),
        });
      }
    });

    return found.sort((a, b) => a.area - b.area).map((hit) => hit.entry);
  }

  // Zoom keeps the point at the centre of the visible area where it was.
  function changeZoom(next: number) {
    const area = areaRef.current;
    const layer = layerRef.current;

    if (area && layer) {
      const a = area.getBoundingClientRect();
      const l = layer.getBoundingClientRect();

      zoomCenter.current = {
        x: (a.left + area.clientWidth / 2 - l.left) / l.width,
        y: (a.top + area.clientHeight / 2 - l.top) / l.height,
      };
    }

    setZoom(next);
  }

  useLayoutEffect(() => {
    const center = zoomCenter.current;
    const area = areaRef.current;
    const layer = layerRef.current;

    if (!center || !area || !layer) {
      return;
    }

    zoomCenter.current = null;
    const a = area.getBoundingClientRect();
    const l = layer.getBoundingClientRect();

    area.scrollLeft += l.left + l.width * center.x - (a.left + area.clientWidth / 2);
    area.scrollTop += l.top + l.height * center.y - (a.top + area.clientHeight / 2);
  }, [zoom]);

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

    if (vertexDrag) {
      const moveVertex = <T extends EditorPolygon>(item: T): T =>
        item.editorId !== vertexDrag.editorId
          ? item
          : "depthY" in item && vertexDrag.index === -1
            ? { ...item, depthY: point.y }
            : {
                ...item,
                points: item.points.map((p, i) =>
                  i === vertexDrag.index ? point : p,
                ),
              };

      onDataChange((previous) =>
        vertexDrag.kind === "occluder"
          ? { ...previous, occluders: previous.occluders.map(moveVertex) }
          : { ...previous, polygons: previous.polygons.map(moveVertex) },
      );
      return;
    }

    setDrag((current) => (current ? { ...current, current: point } : current));
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (vertexDrag) {
      setVertexDrag(null);
      return;
    }

    if (!drag) {
      return;
    }

    const end = toWorld(event);

    setDrag(null);

    if (mode === "select") {
      if (Math.hypot(end.x - drag.start.x, end.y - drag.start.y) > SPAWN_CLICK_TOLERANCE) {
        return;
      }

      // Smallest items first; clicking the same spot again moves on to the
      // next stacked item, and empty floor deselects.
      const hits = pickAll(end);
      const current = hits.findIndex(
        (hit) =>
          selection?.kind === hit.kind && selection.editorId === hit.editorId,
      );

      setSelection(hits.length === 0 ? null : hits[(current + 1) % hits.length]);
      return;
    }

    if ((mode === "collider" && shape === "free") || mode === "occluder") {
      // Free-hand: every click adds a point; a click on the first point (or
      // Enter) closes the shape.
      if (Math.hypot(end.x - drag.start.x, end.y - drag.start.y) > SPAWN_CLICK_TOLERANCE) {
        return;
      }

      const first = draftPoints[0];

      if (
        first &&
        draftPoints.length >= 3 &&
        Math.hypot(drag.start.x - first.x, drag.start.y - first.y) <=
          POLYGON_CLOSE_RADIUS
      ) {
        closeDraft();
      } else {
        setDraftPoints((current) => [...current, drag.start]);
      }

      return;
    }

    if (mode === "collider") {
      // A click (no drag) on the map SELECTS instead of drawing: the topmost
      // collider under the cursor, or nothing (clears the selection) on empty
      // floor. A real drag still draws a new collider as before.
      const moved = Math.hypot(end.x - drag.start.x, end.y - drag.start.y);

      if (moved <= SPAWN_CLICK_TOLERANCE) {
        const hit = [...colliders]
          .reverse()
          .find(
            (item) =>
              end.x >= item.x &&
              end.x <= item.x + item.width &&
              end.y >= item.y &&
              end.y <= item.y + item.height,
          );

        const polygonHit = hit
          ? undefined
          : [...polygons]
              .reverse()
              .find((item) => pointInPolygon(end, item.points));

        setSelection(
          hit
            ? { kind: "collider", editorId: hit.editorId }
            : polygonHit
              ? { kind: "polygon", editorId: polygonHit.editorId }
              : null,
        );
        return;
      }
    }

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
      setHistory((current) => [
        ...current,
        { kind: "spawn", editorId: newSpawn.editorId },
      ]);
      setSelection({ kind: "spawn", editorId: newSpawn.editorId });
      return;
    }

    const rect = normalizeRect(drag.start, end);

    if (rect.width < MIN_COLLIDER_SIZE || rect.height < MIN_COLLIDER_SIZE) {
      return;
    }

    if (mode === "interaction") {
      const newInteraction: EditorInteraction = {
        editorId: newEditorId("interaction"),
        ...rect,
        interactionId: "",
        requiredDirection: null,
      };

      setInteractions((previous) => [...previous, newInteraction]);
      setHistory((current) => [
        ...current,
        { kind: "interaction", editorId: newInteraction.editorId },
      ]);
      setSelection({ kind: "interaction", editorId: newInteraction.editorId });
      return;
    }

    const newRect: EditorRect = { editorId: newEditorId(mode), ...rect };

    if (mode === "collider") {
      setColliders((previous) => [...previous, newRect]);
    } else {
      setTransitions((previous) => [...previous, newRect]);
    }

    setHistory((current) => [
      ...current,
      { kind: mode, editorId: newRect.editorId },
    ]);
    setSelection({ kind: mode, editorId: newRect.editorId });
  }

  function selectMode(nextMode: Mode) {
    setDrag(null);
    setDraftPoints([]);
    setMode(nextMode);
  }

  const freeHand = (mode === "collider" && shape === "free") || mode === "occluder";
  const draftColor = mode === "occluder" ? "#a855f7" : "#ff5c5c";
  const previewRect =
    drag && mode !== "spawn" && mode !== "select" && !freeHand
      ? normalizeRect(drag.start, drag.current)
      : null;
  const selectedOccluder =
    selection?.kind === "occluder"
      ? occluders.find((item) => item.editorId === selection.editorId)
      : undefined;
  const selectedPolygon =
    selection?.kind === "polygon"
      ? polygons.find((item) => item.editorId === selection.editorId)
      : undefined;
  const modeColor = KINDS.find((entry) => entry.kind === mode)?.color;
  const effScale = scale * zoom;
  const exportText = formatSceneExport(
    { colliders, transitions, spawns, interactions, polygons, occluders },
    config.idPrefix,
    {
      colliders: `${config.exportPrefix}Colliders`,
      transitions: `${config.exportPrefix}Transitions`,
      spawns: `${config.exportPrefix}Spawns`,
      interactions: `${config.exportPrefix}Interactions`,
      polygons: `${config.exportPrefix}PolygonColliders`,
      occluders: `${config.exportPrefix}Occluders`,
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

  const selectedInteraction =
    selection?.kind === "interaction"
      ? interactions.find((item) => item.editorId === selection.editorId)
      : undefined;

  const isSelected = (kind: Kind, editorId: string) =>
    selection?.kind === kind && selection.editorId === editorId;

  const rectLabel = (prefix: string, index: number, item: EditorRect) =>
    `${prefix}-${index + 1} · (${item.x}, ${item.y}) ${item.width}×${item.height}`;

  return (
    <>
      <div ref={areaRef} className={styles.canvasArea}>
        <div
          className={styles.viewport}
          style={{
            ["--world-width" as string]: `${world.width}px`,
            ["--world-height" as string]: `${world.height}px`,
            ["--scale" as string]: effScale,
            // vertex handles keep a constant size on screen at any zoom
            ["--handle" as string]: `${10 / effScale}px`,
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
            <svg
              className={styles.polygonLayer}
              width={world.width}
              height={world.height}
            >
              {polygons.map((item) => (
                <polygon
                  key={item.editorId}
                  points={item.points.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="rgba(255, 92, 92, 0.28)"
                  vectorEffect="non-scaling-stroke"
                  stroke={isSelected("polygon", item.editorId) ? "#ffffff" : "#ff5c5c"}
                  strokeWidth={isSelected("polygon", item.editorId) ? 2 : 1}
                />
              ))}
              {occluders.map((item) => {
                const xs = item.points.map((p) => p.x);
                const selected = isSelected("occluder", item.editorId);

                return (
                  <g key={item.editorId}>
                    <polygon
                      points={item.points.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill="rgba(168, 85, 247, 0.28)"
                      vectorEffect="non-scaling-stroke"
                      stroke={selected ? "#ffffff" : "#a855f7"}
                      strokeWidth={selected ? 2 : 1}
                    />
                    <line
                      x1={Math.min(...xs)}
                      x2={Math.max(...xs)}
                      y1={item.depthY}
                      y2={item.depthY}
                      vectorEffect="non-scaling-stroke"
                      stroke="#a855f7"
                      strokeWidth={1.5}
                      strokeDasharray="5 3"
                    />
                  </g>
                );
              })}
              {draftPoints.length > 0 ? (
                <>
                  <polyline
                    points={[...draftPoints, ...(cursor ? [cursor] : [])]
                      .map((p) => `${p.x},${p.y}`)
                      .join(" ")}
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    stroke={draftColor}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                  />
                  {draftPoints.map((p, i) => (
                    <circle
                      key={`${p.x}-${p.y}-${i}`}
                      cx={p.x}
                      cy={p.y}
                      r={(i === 0 && draftPoints.length >= 3 ? 8 : 5) / effScale}
                      fill={i === 0 ? "#ffffff" : draftColor}
                      stroke={draftColor}
                    />
                  ))}
                </>
              ) : null}
            </svg>
            {selectedOccluder?.points.map((p, index) => (
              <div
                key={index}
                className={styles.vertexHandle}
                style={{ left: p.x, top: p.y, borderColor: "#a855f7" }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  layerRef.current?.setPointerCapture(event.pointerId);
                  setVertexDrag({
                    kind: "occluder",
                    editorId: selectedOccluder.editorId,
                    index,
                  });
                }}
              />
            ))}
            {selectedOccluder ? (
              <div
                className={styles.vertexHandle}
                title="Depth line: drag up or down"
                style={{
                  left: Math.max(...selectedOccluder.points.map((p) => p.x)),
                  top: selectedOccluder.depthY,
                  borderColor: "#a855f7",
                  background: "#a855f7",
                  borderRadius: 2,
                  cursor: "ns-resize",
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  layerRef.current?.setPointerCapture(event.pointerId);
                  setVertexDrag({
                    kind: "occluder",
                    editorId: selectedOccluder.editorId,
                    index: -1,
                  });
                }}
              />
            ) : null}
            {selectedPolygon?.points.map((p, index) => (
              <div
                key={index}
                className={styles.vertexHandle}
                style={{ left: p.x, top: p.y }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  layerRef.current?.setPointerCapture(event.pointerId);
                  setVertexDrag({
                    kind: "polygon",
                    editorId: selectedPolygon.editorId,
                    index,
                  });
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
            {interactions.map((item) => (
              <div
                key={item.editorId}
                className={
                  isSelected("interaction", item.editorId)
                    ? `${styles.interaction} ${styles.itemSelected}`
                    : styles.interaction
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
        <div className={styles.modes} role="group" aria-label="Zoom">
          {ZOOM_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              className={
                level === zoom
                  ? `${styles.modeButton} ${styles.modeButtonActive}`
                  : styles.modeButton
              }
              aria-pressed={level === zoom}
              onClick={(event) => {
                event.currentTarget.blur();
                changeZoom(level);
              }}
            >
              🔍 ×{level}
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
        <button
          type="button"
          className={styles.modeButton}
          onClick={(event) => {
            event.currentTarget.blur();
            undo();
          }}
          title="Takes back the last point while drawing; otherwise deletes the last shape created (Ctrl+Z)"
        >
          ↶ Undo (Ctrl+Z)
        </button>
        {mode === "collider" ? (
          <div className={styles.modes} role="group" aria-label="Collider shape">
            <button
              type="button"
              className={
                shape === "rect"
                  ? `${styles.modeButton} ${styles.modeButtonActive}`
                  : styles.modeButton
              }
              style={{ borderColor: "#ff5c5c" }}
              aria-pressed={shape === "rect"}
              onClick={() => {
                setDraftPoints([]);
                setShape("rect");
              }}
            >
              ▭ Rectangle
            </button>
            <button
              type="button"
              className={
                shape === "free"
                  ? `${styles.modeButton} ${styles.modeButtonActive}`
                  : styles.modeButton
              }
              style={{ borderColor: "#ff5c5c" }}
              aria-pressed={shape === "free"}
              onClick={() => {
                setDrag(null);
                setShape("free");
              }}
            >
              ✎ Free shape
            </button>
          </div>
        ) : null}
        {freeHand ? (
          <p className={styles.hint}>
            Click to place points. Click the first point (white) or press Enter
            to close the shape (3 points minimum). Backspace removes the last
            point, Esc cancels. Select a finished shape (row or click in
            rectangle mode) to drag its vertices.{" "}
            {draftPoints.length > 0 ? `${draftPoints.length} points placed.` : ""}
            {draftPoints.length >= 3 ? (
              <button
                type="button"
                className={styles.copyButton}
                onClick={closeDraft}
              >
                Close shape
              </button>
            ) : null}
          </p>
        ) : null}
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
            : mode === "select"
              ? "Nothing is drawn in this mode: click an item on the map to select it (click the same spot again to cycle through stacked items, click empty floor to deselect), then press Delete or use the delete button. Colliders, free shapes, depth shapes, transitions, interactions and spawns can all be picked."
              : mode === "occluder"
              ? "Click points to outline the part of the picture that must cover the Doctor (a treetop, a roof). The dashed line is the depth line: the Doctor is behind the shape while the soles of his feet (the bottom edge of his collision box, where the red colliders stop him) are above it. It starts at the lowest point; drag its square handle or type depthY."
              : `Drag on the map to draw a ${mode}.`}{" "}
          Esc cancels a drawing. Click a row to select it; Delete / Backspace or
          × removes it. In collider mode, click a collider on the map to select
          it (click empty floor to deselect).
        </p>
        {selection ? (
          <button
            type="button"
            className={styles.deleteSelected}
            onClick={() => removeItem(selection.kind, selection.editorId)}
          >
            Delete collision / Eliminar colisión
          </button>
        ) : null}
        <div className={styles.hud}>
          <div>
            world {world.width}×{world.height} units · scale {effScale.toFixed(2)}×
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
            colliders {colliders.length} · free shapes {polygons.length} · depth{" "}
            {occluders.length} ·
            transitions {transitions.length} ·
            spawns {spawns.length} · interactions {interactions.length}
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
          title="Free shapes"
          kind="polygon"
          color="#ff5c5c"
          rows={polygons.map((item, index) => ({
            editorId: item.editorId,
            label: `${config.idPrefix}-poly-${index + 1} · ${item.points.length} points`,
          }))}
          selection={selection}
          onSelect={(kind, editorId) => setSelection({ kind, editorId })}
          onDelete={removeItem}
        />
        <ListSection
          title="Depth shapes"
          kind="occluder"
          color="#a855f7"
          rows={occluders.map((item, index) => ({
            editorId: item.editorId,
            label: `${config.idPrefix}-depth-${index + 1} · ${item.points.length} points · depth y ${item.depthY}`,
          }))}
          selection={selection}
          onSelect={(kind, editorId) => setSelection({ kind, editorId })}
          onDelete={removeItem}
        />
        {selectedOccluder ? (
          <div className={styles.form}>
            <div className={styles.formTitle}>Selected depth shape</div>
            <label className={styles.formRow}>
              depthY
              <input
                type="number"
                value={selectedOccluder.depthY}
                onChange={(event) => {
                  const value = Math.round(Number(event.target.value));

                  if (Number.isFinite(value)) {
                    onDataChange((previous) => ({
                      ...previous,
                      occluders: previous.occluders.map((item) =>
                        item.editorId === selectedOccluder.editorId
                          ? { ...item, depthY: value }
                          : item,
                      ),
                    }));
                  }
                }}
              />
            </label>
          </div>
        ) : null}
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
        <ListSection
          title="Interactions"
          kind="interaction"
          color="#3ddc84"
          rows={interactions.map((item, index) => ({
            editorId: item.editorId,
            label: `${config.idPrefix}-interaction-${index + 1} · (${item.x}, ${item.y}) ${item.width}×${item.height} · ${item.interactionId || "(no interactionId)"} · ${item.requiredDirection ?? "any"}`,
          }))}
          selection={selection}
          onSelect={(kind, editorId) => setSelection({ kind, editorId })}
          onDelete={removeItem}
        />
        {selectedInteraction ? (
          <div className={styles.form}>
            <div className={styles.formTitle}>Selected interaction</div>
            {(["x", "y", "width", "height"] as const).map((key) => (
              <label key={key} className={styles.formRow}>
                {key}
                <input
                  type="number"
                  value={selectedInteraction[key]}
                  onChange={(event) => {
                    const value = Math.round(Number(event.target.value));

                    if (Number.isFinite(value)) {
                      updateInteraction(selectedInteraction.editorId, {
                        [key]: value,
                      });
                    }
                  }}
                />
              </label>
            ))}
            <label className={styles.formRow}>
              interactionId
              <input
                type="text"
                list="environment-interaction-ids"
                value={selectedInteraction.interactionId}
                spellCheck={false}
                onChange={(event) =>
                  updateInteraction(selectedInteraction.editorId, {
                    interactionId: event.target.value,
                  })
                }
              />
            </label>
            <datalist id="environment-interaction-ids">
              {[...ENVIRONMENT_INTERACTIONS, ...STORY_ZONE_INTERACTIONS].filter((entry) => entry.sceneId === scene.id).map((entry) => (
                <option key={entry.interactionId} value={entry.interactionId}>{entry.label}</option>
              ))}
            </datalist>
            <p>Dibuja la zona en suelo accesible junto al objeto. Elige su interactionId y usa Copy export. El juego lee la exportación integrada, no este borrador.</p>
            <label className={styles.formRow}>
              requiredDirection
              <select
                value={selectedInteraction.requiredDirection ?? ""}
                onChange={(event) =>
                  updateInteraction(selectedInteraction.editorId, {
                    requiredDirection:
                      event.target.value === ""
                        ? null
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
          </div>
        ) : null}
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
  const scene = [GRANARY_INTERIOR_VISUAL, ...DEV_SCENES].find(
    (candidate) => candidate.id === sceneId,
  );
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
      [GRANARY_INTERIOR_VISUAL, ...DEV_SCENES].find(
        (candidate) => candidate.id === entry.sceneId,
      )?.label ??
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
