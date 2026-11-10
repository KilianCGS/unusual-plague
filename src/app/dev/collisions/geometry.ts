// Pure geometry helpers for /dev/collisions. Everything here works in logical
// world units, never in physical screen pixels.

export type Point = { x: number; y: number };
export type Size = { width: number; height: number };
export type Rect = { x: number; y: number; width: number; height: number };

// Rectangles thinner than this on any side are treated as accidental clicks.
export const MIN_COLLIDER_SIZE = 2;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// Any two corners, dragged in any direction, become a rectangle whose x/y is
// its top-left corner and whose width/height are never negative.
export function normalizeRect(start: Point, end: Point): Rect {
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
  };
}

// Converts a pointer position (client pixels) into world units using the real
// rendered box of the world surface, so browser zoom, window size and the
// scene scale never change the stored data. The result is rounded to whole
// units and kept inside the world.
export function clientToWorld(
  client: Point,
  surface: { left: number; top: number; width: number; height: number },
  world: Size,
): Point {
  if (surface.width === 0 || surface.height === 0) {
    return { x: 0, y: 0 };
  }

  const unitsPerPixelX = world.width / surface.width;
  const unitsPerPixelY = world.height / surface.height;

  return {
    x: clamp(
      Math.round((client.x - surface.left) * unitsPerPixelX),
      0,
      world.width,
    ),
    y: clamp(
      Math.round((client.y - surface.top) * unitsPerPixelY),
      0,
      world.height,
    ),
  };
}

// A free-hand shape smaller than this (world units squared) is an accident.
export const MIN_POLYGON_AREA = 16;
// Clicking this close to the first point of a shape being drawn closes it.
export const POLYGON_CLOSE_RADIUS = 8;

export function polygonArea(points: Point[]) {
  let sum = 0;

  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.x * b.y - b.x * a.y;
  }

  return Math.abs(sum) / 2;
}

// Even-odd rule, valid for concave shapes.
export function pointInPolygon(point: Point, points: Point[]) {
  let inside = false;

  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const a = points[i];
    const b = points[j];

    if (
      a.y > point.y !== b.y > point.y &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x
    ) {
      inside = !inside;
    }
  }

  return inside;
}

export type SpawnPoint = Point & { direction: string };

function formatBlock(declaration: string, rows: string[]) {
  return rows.length === 0
    ? `${declaration} = [];\n`
    : `${declaration} = [\n${rows.join("\n")}\n];\n`;
}

// TypeScript source ready to paste into scene files (colliders keep the same
// shape as src/game/collision.ts's SceneCollider). The three data sets are
// separated and commented. Ids are readable and follow the list order:
// `${prefix}-1`, `${prefix}-transition-1`, `${prefix}-spawn-1`, ...
export type InteractionExport = Rect & {
  interactionId: string;
  // null = any facing (the field is left out of the export).
  requiredDirection: string | null;
};

// Interactions are only exported when the scene has some, so scenes without
// them keep exactly the same export as before.
export function formatSceneExport(
  data: {
    colliders: Rect[];
    transitions: Rect[];
    spawns: SpawnPoint[];
    interactions?: InteractionExport[];
    // Free-hand red shapes. Only exported when there are some.
    polygons?: { points: Point[] }[];
    // Violet depth shapes. Only exported when there are some.
    occluders?: { points: Point[]; depthY: number }[];
  },
  prefix: string,
  names: {
    colliders: string;
    transitions: string;
    spawns: string;
    interactions?: string;
    polygons?: string;
    occluders?: string;
  },
) {
  const interactionRows = data.interactions ?? [];
  const polygonRows = data.polygons ?? [];
  const occluderRows = data.occluders ?? [];
  const imports =
    (polygonRows.length > 0
      ? 'import type { LogicalRect, PolygonCollider, SceneCollider } from "../collision";\n'
      : 'import type { LogicalRect, SceneCollider } from "../collision";\n') +
    (occluderRows.length > 0
      ? 'import type { OcclusionShape } from "../occlusion";\n'
      : "") +
    'import type { Direction } from "../protagonist/useProtagonistController";\n' +
    (interactionRows.length > 0
      ? 'import type { InteractionZone } from "../interactions/interactionZone";\n'
      : "") +
    "\n";

  const rect = (id: string, r: Rect) =>
    `  { id: "${id}", x: ${r.x}, y: ${r.y}, width: ${r.width}, height: ${r.height} },`;

  const colliders =
    "// COLLIDERS (red): floor the feet cannot occupy.\n" +
    formatBlock(
      `export const ${names.colliders}: SceneCollider[]`,
      data.colliders.map((c, i) => rect(`${prefix}-${i + 1}`, c)),
    );

  const transitions =
    "// TRANSITIONS (yellow): activation zones. No destination yet.\n" +
    formatBlock(
      `export const ${names.transitions}: (LogicalRect & { id: string })[]`,
      data.transitions.map((t, i) => rect(`${prefix}-transition-${i + 1}`, t)),
    );

  const spawns =
    "// SPAWNS (blue): exact feet position on arrival, plus facing.\n" +
    formatBlock(
      `export const ${names.spawns}: { id: string; x: number; y: number; direction: Direction }[]`,
      data.spawns.map(
        (s, i) =>
          `  { id: "${prefix}-spawn-${i + 1}", x: ${s.x}, y: ${s.y}, direction: "${s.direction}" },`,
      ),
    );

  const interactions =
    interactionRows.length === 0
      ? ""
      : "\n// INTERACTIONS (green): where and from which facing the player can\n" +
        "// interact. interactionId names WHAT is interacted with; resolving it\n" +
        "// lives elsewhere. Several zones may share one interactionId.\n" +
        formatBlock(
          `export const ${names.interactions ?? "interactions"}: InteractionZone[]`,
          interactionRows.map(
            (z, i) =>
              `  { id: "${prefix}-interaction-${i + 1}", x: ${z.x}, y: ${z.y}, width: ${z.width}, height: ${z.height}, interactionId: ${JSON.stringify(z.interactionId)}${z.requiredDirection === null ? "" : `, requiredDirection: "${z.requiredDirection}"`} },`,
          ),
        );

  const polygons =
    polygonRows.length === 0
      ? ""
      : "\n// FREE-HAND COLLIDERS (red shapes): same job as the colliders above,\n" +
        "// drawn point by point. The shape closes itself; it may be concave.\n" +
        formatBlock(
          `export const ${names.polygons ?? "polygonColliders"}: PolygonCollider[]`,
          polygonRows.map(
            (p, i) =>
              `  { id: "${prefix}-poly-${i + 1}", points: [${p.points
                .map((pt) => `{ x: ${pt.x}, y: ${pt.y} }`)
                .join(", ")}] },`,
          ),
        );

  const occluders =
    occluderRows.length === 0
      ? ""
      : "\n// DEPTH SHAPES (violet): part of the background that covers the Doctor\n" +
        "// while his feet are above depthY (a treetop, a roof).\n" +
        formatBlock(
          `export const ${names.occluders ?? "occluders"}: OcclusionShape[]`,
          occluderRows.map(
            (o, i) =>
              `  { id: "${prefix}-depth-${i + 1}", depthY: ${o.depthY}, points: [${o.points
                .map((pt) => `{ x: ${pt.x}, y: ${pt.y} }`)
                .join(", ")}] },`,
          ),
        );

  return `${imports}${colliders}${polygons}${occluders}\n${transitions}\n${spawns}${interactions}`;
}
