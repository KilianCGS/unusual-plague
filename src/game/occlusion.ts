import type { PolygonPoint } from "./collision";

// A "depth" shape drawn in /dev/collisions (violet): a part of the painted
// background (a treetop, a roof) that must cover whoever stands north of
// `depthY`. The game paints a copy of the background clipped to the shape and
// sorts it like a sprite. The line is read against the SOLES of the Doctor's
// feet hitbox (its bottom edge, the very edge the red colliders stop), not
// against his sprite anchor, which hangs a few units lower: a depth line drawn
// on the edge of a collider therefore holds right up to the collider.
export type OcclusionShape = {
  id: string;
  depthY: number;
  points: PolygonPoint[];
};

// A hand-drawn line is rarely exact to the unit: a line drawn on the edge of a
// collider may sit a hair above the collider's real edge (a diagonal edge
// especially), and the Doctor stops against that edge. This margin keeps him
// behind right up to the collider instead of flipping in front at the limit.
export const DEPTH_TOLERANCE = 2;

// z-index of the layer: the Doctor sorts by his anchor y, and his feet box ends
// a few units above it, so the line is moved down by that gap (plus the margin).
export function occlusionZIndex(
  depthY: number,
  feetHitbox: { offsetY: number; height: number },
) {
  return Math.round(
    depthY - (feetHitbox.offsetY + feetHitbox.height) + DEPTH_TOLERANCE,
  );
}

// CSS clip-path for a shape, in world units (the layer is world-sized).
export function occlusionClipPath(points: PolygonPoint[]) {
  return `polygon(${points.map((p) => `${p.x}px ${p.y}px`).join(", ")})`;
}
