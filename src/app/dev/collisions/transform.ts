import type { Point, Rect } from "./geometry";

// MOVE THE DRAWN SHAPES (2026-11-18, Kilian): when a background is repainted or resized, everything drawn on it
// (colliders, free shapes, depth shapes, step zones, transitions, spawns, interactions) has to shift with it. This
// moves/scales a whole scene's geometry at once, optionally only what lies inside a box, and only the kinds asked.
// Pure functions: the page keeps the previous data to undo.
export type ShapeKind = "collider" | "polygon" | "occluder" | "stepzone" | "transition" | "spawn" | "interaction";
export const SHAPE_KINDS: readonly ShapeKind[] = ["collider", "polygon", "occluder", "stepzone", "transition", "spawn", "interaction"];

export type MoveOptions = {
  dx: number;
  dy: number;
  // scale about the origin (0,0) of the scene, applied BEFORE the shift (1 = keep the size)
  sx: number;
  sy: number;
  kinds: ReadonlySet<ShapeKind>;
  // only the shapes whose centre lies inside this box (null = all)
  region: { x1: number; y1: number; x2: number; y2: number } | null;
};

type WithRects = { colliders: (Rect & { editorId: string })[]; transitions: (Rect & { editorId: string })[]; interactions: (Rect & { editorId: string })[] };
type WithPoints = { points: Point[]; depthY?: number };
type SceneLike = WithRects & {
  polygons: (WithPoints & { editorId: string })[];
  occluders: (WithPoints & { editorId: string; depthY: number })[];
  stepZones: (WithPoints & { editorId: string })[];
  spawns: (Point & { editorId: string })[];
};

const inside = (o: MoveOptions, x: number, y: number) =>
  !o.region || (x >= o.region.x1 && x <= o.region.x2 && y >= o.region.y1 && y <= o.region.y2);

const moveRect = <T extends Rect>(item: T, o: MoveOptions): T =>
  inside(o, item.x + item.width / 2, item.y + item.height / 2)
    ? { ...item, x: Math.round(item.x * o.sx + o.dx), y: Math.round(item.y * o.sy + o.dy), width: Math.max(1, Math.round(item.width * o.sx)), height: Math.max(1, Math.round(item.height * o.sy)) }
    : item;

function movePoly<T extends WithPoints>(item: T, o: MoveOptions): T {
  const n = item.points.length || 1;
  const cx = item.points.reduce((sum, p) => sum + p.x, 0) / n;
  const cy = item.points.reduce((sum, p) => sum + p.y, 0) / n;
  if (!inside(o, cx, cy)) return item;
  const next = { ...item, points: item.points.map((p) => ({ x: Math.round(p.x * o.sx + o.dx), y: Math.round(p.y * o.sy + o.dy) })) };
  if (typeof item.depthY === "number") next.depthY = Math.round(item.depthY * o.sy + o.dy);
  return next;
}

export function transformScene<T extends SceneLike>(data: T, o: MoveOptions): T {
  const has = (k: ShapeKind) => o.kinds.has(k);
  return {
    ...data,
    colliders: has("collider") ? data.colliders.map((r) => moveRect(r, o)) : data.colliders,
    transitions: has("transition") ? data.transitions.map((r) => moveRect(r, o)) : data.transitions,
    interactions: has("interaction") ? data.interactions.map((r) => moveRect(r, o)) : data.interactions,
    polygons: has("polygon") ? data.polygons.map((p) => movePoly(p, o)) : data.polygons,
    occluders: has("occluder") ? data.occluders.map((p) => movePoly(p, o)) : data.occluders,
    stepZones: has("stepzone") ? data.stepZones.map((p) => movePoly(p, o)) : data.stepZones,
    spawns: has("spawn")
      ? data.spawns.map((s) => (inside(o, s.x, s.y) ? { ...s, x: Math.round(s.x * o.sx + o.dx), y: Math.round(s.y * o.sy + o.dy) } : s))
      : data.spawns,
  };
}
