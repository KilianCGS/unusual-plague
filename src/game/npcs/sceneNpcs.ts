import type { SceneNpc } from "./sceneNpc";

// Pilot villager, used only to validate scale, rendering and the physical
// collider. Its position is PROVISIONAL: on the open floor right of the well,
// clear of the market props, the east-west lane and every transition.
const VILLAGER_PILOT: SceneNpc = {
  id: "villager-pilot",
  position: { x: 700, y: 350 },
  visual: {
    src: "/game/npcs/villager-pilot/idle-south.png",
    frameSize: 96,
  },
  // Body occupancy, not a feet hitbox: the visible silhouette is 33x66 px
  // (x -17..+16, y -80..-14 from the feet anchor). Width is the silhouette
  // plus 8 px per side, the gap between the protagonist's 28 px sprite and his
  // 12 px feet hitbox, so his body cannot visibly enter the villager from the
  // sides. Height is the full silhouette, head to soles.
  collider: { offsetX: -24, offsetY: -80, width: 48, height: 66 },
};

// Keyed by the same scene ids as DEV_SCENES / WORLD_SCENES, so the runtime and
// /dev/scene read the very same definitions.
const SCENE_NPCS: Record<string, SceneNpc[]> = {
  plaza: [VILLAGER_PILOT],
};

const NO_NPCS: SceneNpc[] = [];

export function getSceneNpcs(sceneId: string): SceneNpc[] {
  return SCENE_NPCS[sceneId] ?? NO_NPCS;
}
