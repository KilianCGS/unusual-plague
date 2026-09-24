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

export function collidesWithScene(
  rect: LogicalRect,
  colliders: SceneCollider[],
) {
  return colliders.some((collider) => rectsIntersect(rect, collider));
}