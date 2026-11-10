export type LogicalRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SceneCollider = LogicalRect & {
  id: string;
};

export type AnchorHitbox = {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export function getHitboxRect(
  anchorX: number,
  anchorY: number,
  hitbox: AnchorHitbox,
): LogicalRect {
  return {
    x: anchorX + hitbox.offsetX,
    y: anchorY + hitbox.offsetY,
    width: hitbox.width,
    height: hitbox.height,
  };
}

export function isRectWithinWorld(
  rect: LogicalRect,
  worldWidth: number,
  worldHeight: number,
) {
  return (
    rect.x >= 0 &&
    rect.y >= 0 &&
    rect.x + rect.width <= worldWidth &&
    rect.y + rect.height <= worldHeight
  );
}

export function rectsIntersect(a: LogicalRect, b: LogicalRect) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export type PolygonPoint = { x: number; y: number };

// A free-hand collider drawn in /dev/collisions (red lines). Same job as a
// SceneCollider: floor the feet cannot occupy. Vertices in logical units, in
// drawing order, at least 3, the shape closes itself (it may be concave).
export type PolygonCollider = {
  id: string;
  points: PolygonPoint[];
};

type Edge = "left" | "right" | "top" | "bottom";

function isInside(p: PolygonPoint, edge: Edge, rect: LogicalRect) {
  switch (edge) {
    case "left":
      return p.x >= rect.x;
    case "right":
      return p.x <= rect.x + rect.width;
    case "top":
      return p.y >= rect.y;
    case "bottom":
      return p.y <= rect.y + rect.height;
  }
}

function crossing(
  a: PolygonPoint,
  b: PolygonPoint,
  edge: Edge,
  rect: LogicalRect,
): PolygonPoint {
  if (edge === "left" || edge === "right") {
    const x = edge === "left" ? rect.x : rect.x + rect.width;
    const t = (x - a.x) / (b.x - a.x);
    return { x, y: a.y + t * (b.y - a.y) };
  }

  const y = edge === "top" ? rect.y : rect.y + rect.height;
  const t = (y - a.y) / (b.y - a.y);
  return { x: a.x + t * (b.x - a.x), y };
}

function polygonArea(points: PolygonPoint[]) {
  let sum = 0;

  for (let i = 0; i < points.length; i += 1) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.x * b.y - b.x * a.y;
  }

  return Math.abs(sum) / 2;
}

// True when the rectangle and the polygon share some AREA. Touching along an
// edge or at a corner is not a collision, the same rule as rectsIntersect.
// The polygon is clipped by the rectangle (Sutherland-Hodgman, valid for
// concave polygons because the clip shape is convex) and the leftover area is
// measured.
export function rectIntersectsPolygon(
  rect: LogicalRect,
  polygon: PolygonCollider,
) {
  if (polygon.points.length < 3 || rect.width <= 0 || rect.height <= 0) {
    return false;
  }

  let output: PolygonPoint[] = polygon.points;

  for (const edge of ["left", "right", "top", "bottom"] as const) {
    const input = output;
    output = [];

    for (let i = 0; i < input.length; i += 1) {
      const current = input[i];
      const previous = input[(i + input.length - 1) % input.length];
      const currentIn = isInside(current, edge, rect);
      const previousIn = isInside(previous, edge, rect);

      if (currentIn) {
        if (!previousIn) {
          output.push(crossing(previous, current, edge, rect));
        }
        output.push(current);
      } else if (previousIn) {
        output.push(crossing(previous, current, edge, rect));
      }
    }

    if (output.length < 3) {
      return false;
    }
  }

  return polygonArea(output) > 1e-6;
}

export function collidesWithScene(
  rect: LogicalRect,
  colliders: SceneCollider[],
  polygons: PolygonCollider[] = [],
) {
  return (
    colliders.some((collider) => rectsIntersect(rect, collider)) ||
    polygons.some((polygon) => rectIntersectsPolygon(rect, polygon))
  );
}