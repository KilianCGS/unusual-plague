import {
  getHitboxRect,
  type AnchorHitbox,
  type SceneCollider,
} from "../collision";

// Dynamic scene content. Deliberately separate from the painted geometry
// files: an NPC's collider belongs to the NPC (it can later appear, move or
// vanish), never to the permanent map colliders.
export type SceneNpc = {
  id: string;
  // Feet anchor in world units, same meaning as the protagonist's x/y.
  position: { x: number; y: number };
  visual: {
    src: string;
    // Side of the square sprite frame. The frame's bottom-center sits on the
    // feet anchor.
    frameSize: number;
    // Purely visual (default 1); scales around the feet anchor.
    scale?: number;
  };
  // Blocking area, relative to the feet anchor (like the protagonist's feet
  // hitbox). Independent from the sprite image size.
  collider: AnchorHitbox;
};

export function getNpcColliders(npcs: readonly SceneNpc[]): SceneCollider[] {
  return npcs.map((npc) => ({
    id: `${npc.id}-collider`,
    ...getHitboxRect(npc.position.x, npc.position.y, npc.collider),
  }));
}
