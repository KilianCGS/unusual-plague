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

export type SpawnPoint = Point & { direction: string };

function formatBlock(declaration: string, rows: string[]) {
  return rows.length === 0
    ? `${declaration} = [];\n`
    : `${declaration} = [\n${rows.join("\n")}\n];\n`;
}

// TypeScript source ready to paste into scene files (colliders keep the same
// shape as src/game/apothecary/apothecaryColliders.ts). The three data sets are
// separated and commented. Ids are readable and follow the list order:
// `${prefix}-1`, `${prefix}-transition-1`, `${prefix}-spawn-1`, ...
export function formatSceneExport(
  data: {
    colliders: Rect[];
    transitions: Rect[];
    spawns: SpawnPoint[];
  },
  prefix: string,
  names: { colliders: string; transitions: string; spawns: string },
) {
  const imports =
    'import type { LogicalRect, SceneCollider } from "../collision";\n' +
    'import type { Direction } from "../protagonist/useProtagonistController";\n\n';

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

  return `${imports}${colliders}\n${transitions}\n${spawns}`;
}
