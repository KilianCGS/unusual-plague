import { apothecaryColliders } from "../apothecary/apothecaryColliders";
import {
  apothecaryInteriorSpawns,
  apothecaryInteriorTransitions,
} from "../apothecary/apothecaryInteriorGeometry";
import {
  apothecaryStreetColliders,
  apothecaryStreetSpawns,
  apothecaryStreetTransitions,
} from "../apothecary-street/apothecaryStreetGeometry";
import {
  bakeryInteriorColliders,
  bakeryInteriorSpawns,
  bakeryInteriorTransitions,
} from "../bakery-interior/bakeryInteriorGeometry";
import {
  bakeryStreetColliders,
  bakeryStreetSpawns,
  bakeryStreetTransitions,
} from "../bakery-street/bakeryStreetGeometry";
import type { LogicalRect, SceneCollider } from "../collision";
import {
  forestColliders,
  forestSpawns,
  forestTransitions,
} from "../forest/forestGeometry";
import {
  outskirtsColliders,
  outskirtsSpawns,
  outskirtsTransitions,
} from "../outskirts/outskirtsGeometry";
import {
  plazaColliders,
  plazaSpawns,
  plazaTransitions,
} from "../plaza/plazaGeometry";
import type { Direction } from "../protagonist/useProtagonistController";
import {
  tavernStreetColliders,
  tavernStreetSpawns,
  tavernStreetTransitions,
} from "../tavern-street/tavernStreetGeometry";
// Exterior visuals (background, asset size, zoom) are reused from the
// /dev/scene definitions so the game looks exactly like what was tested
// there. They will move together with camera.ts in the camera refactor.
import { DEV_SCENES, type DevScene } from "../../app/dev/scene/scenes";

// World map (V1). Raw geometry ids stay untouched in the geometry files; the
// semantic names live here: exits are `to-<scene>`, arrivals `from-<scene>`.
//
//   Botica interior <-> Calle Botica <-> Plaza <-> Calle Taberna <-> Afueras <-> Bosque
//                                         Plaza <-> Calle Panaderia <-> Panaderia interior
//
// Geometry zones that are deliberately NOT listed as exits stay inactive (a
// zone that is not an exit does nothing):
//   plaza-transition-2  (left, future Smithy/Mine)
//   tavern-street-transition-3  (Tavern door, future Tavern interior)
// Their reserved spawns are not registered as arrivals either:
//   plaza-spawn-3, tavern-street-spawn-3.

export type SceneId =
  | "apothecary-interior"
  | "apothecary-street"
  | "plaza"
  | "tavern-street"
  | "outskirts"
  | "forest"
  | "bakery-street"
  | "bakery-interior";

export type SpawnPoint = { x: number; y: number; direction: Direction };

export type SceneExit = {
  // Semantic name of the exit, e.g. "to-plaza".
  name: string;
  zone: LogicalRect;
  targetScene: SceneId;
  // Semantic name of an arrival in the target scene, e.g. "from-apothecary-street".
  targetSpawn: string;
};

type WorldSceneBase = {
  id: SceneId;
  colliders: SceneCollider[];
  exits: SceneExit[];
  arrivals: Record<string, SpawnPoint>;
};

export type ExteriorWorldScene = WorldSceneBase & {
  kind: "exterior";
  visual: DevScene;
};
export type InteriorWorldScene = WorldSceneBase & { kind: "interior" };
export type WorldScene = ExteriorWorldScene | InteriorWorldScene;

function pick<T extends { id: string }>(items: T[], id: string): T {
  const item = items.find((candidate) => candidate.id === id);

  if (!item) {
    throw new Error(`Missing geometry id: ${id}`);
  }

  return item;
}

function spawnAt(
  spawns: { id: string; x: number; y: number; direction: Direction }[],
  id: string,
): SpawnPoint {
  const { x, y, direction } = pick(spawns, id);

  return { x, y, direction };
}

function visualOf(devSceneId: string): DevScene {
  return pick(DEV_SCENES, devSceneId);
}

export const WORLD_SCENES: Record<SceneId, WorldScene> = {
  "apothecary-interior": {
    id: "apothecary-interior",
    kind: "interior",
    colliders: apothecaryColliders,
    exits: [
      {
        name: "to-apothecary-street",
        zone: pick(
          apothecaryInteriorTransitions,
          "apothecary-interior-transition-1",
        ),
        targetScene: "apothecary-street",
        targetSpawn: "from-apothecary-interior",
      },
    ],
    arrivals: {
      start: spawnAt(apothecaryInteriorSpawns, "apothecary-interior-start"),
      "from-apothecary-street": spawnAt(
        apothecaryInteriorSpawns,
        "apothecary-interior-spawn-1",
      ),
    },
  },
  "apothecary-street": {
    id: "apothecary-street",
    kind: "exterior",
    visual: visualOf("apothecary-street"),
    colliders: apothecaryStreetColliders,
    exits: [
      {
        // South end: to Plaza.
        name: "to-plaza",
        zone: pick(apothecaryStreetTransitions, "apothecary-street-transition-1"),
        targetScene: "plaza",
        targetSpawn: "from-apothecary-street",
      },
      {
        // North end: the Apothecary door.
        name: "to-apothecary-interior",
        zone: pick(apothecaryStreetTransitions, "apothecary-street-transition-2"),
        targetScene: "apothecary-interior",
        targetSpawn: "from-apothecary-street",
      },
    ],
    arrivals: {
      "from-apothecary-interior": spawnAt(
        apothecaryStreetSpawns,
        "apothecary-street-spawn-1",
      ),
      "from-plaza": spawnAt(apothecaryStreetSpawns, "apothecary-street-spawn-2"),
    },
  },
  plaza: {
    id: "plaza",
    kind: "exterior",
    visual: visualOf("plaza"),
    colliders: plazaColliders,
    exits: [
      {
        // North.
        name: "to-apothecary-street",
        zone: pick(plazaTransitions, "plaza-transition-1"),
        targetScene: "apothecary-street",
        targetSpawn: "from-plaza",
      },
      {
        // East.
        name: "to-tavern-street",
        zone: pick(plazaTransitions, "plaza-transition-3"),
        targetScene: "tavern-street",
        targetSpawn: "from-plaza",
      },
      {
        // South: to Calle Panaderia.
        name: "to-bakery-street",
        zone: pick(plazaTransitions, "plaza-transition-4"),
        targetScene: "bakery-street",
        targetSpawn: "from-plaza",
      },
    ],
    arrivals: {
      "from-tavern-street": spawnAt(plazaSpawns, "plaza-spawn-1"),
      "from-apothecary-street": spawnAt(plazaSpawns, "plaza-spawn-2"),
      "from-bakery-street": spawnAt(plazaSpawns, "plaza-spawn-4"),
    },
  },
  "tavern-street": {
    id: "tavern-street",
    kind: "exterior",
    visual: visualOf("calle-taberna"),
    colliders: tavernStreetColliders,
    exits: [
      {
        // Left end: to Plaza.
        name: "to-plaza",
        zone: pick(tavernStreetTransitions, "tavern-street-transition-1"),
        targetScene: "plaza",
        targetSpawn: "from-tavern-street",
      },
      {
        // Right end: to Afueras.
        name: "to-outskirts",
        zone: pick(tavernStreetTransitions, "tavern-street-transition-2"),
        targetScene: "outskirts",
        targetSpawn: "from-tavern-street",
      },
    ],
    arrivals: {
      "from-outskirts": spawnAt(tavernStreetSpawns, "tavern-street-spawn-1"),
      "from-plaza": spawnAt(tavernStreetSpawns, "tavern-street-spawn-2"),
    },
  },
  outskirts: {
    id: "outskirts",
    kind: "exterior",
    visual: visualOf("outskirts-brook-provisional"),
    colliders: outskirtsColliders,
    exits: [
      {
        // Right end: to the Forest.
        name: "to-forest",
        zone: pick(outskirtsTransitions, "outskirts-transition-1"),
        targetScene: "forest",
        targetSpawn: "from-outskirts",
      },
      {
        // Left end: back to Calle Taberna.
        name: "to-tavern-street",
        zone: pick(outskirtsTransitions, "outskirts-transition-2"),
        targetScene: "tavern-street",
        targetSpawn: "from-outskirts",
      },
    ],
    arrivals: {
      "from-tavern-street": spawnAt(outskirtsSpawns, "outskirts-spawn-1"),
      "from-forest": spawnAt(outskirtsSpawns, "outskirts-spawn-2"),
    },
  },
  forest: {
    id: "forest",
    kind: "exterior",
    visual: visualOf("forest-v1"),
    colliders: forestColliders,
    exits: [
      {
        name: "to-outskirts",
        zone: pick(forestTransitions, "forest-transition-1"),
        targetScene: "outskirts",
        targetSpawn: "from-forest",
      },
    ],
    arrivals: {
      "from-outskirts": spawnAt(forestSpawns, "forest-spawn-1"),
    },
  },
  "bakery-street": {
    id: "bakery-street",
    kind: "exterior",
    visual: visualOf("bakery-street"),
    colliders: bakeryStreetColliders,
    exits: [
      {
        // North end: back to Plaza.
        name: "to-plaza",
        zone: pick(bakeryStreetTransitions, "bakery-street-transition-2"),
        targetScene: "plaza",
        targetSpawn: "from-bakery-street",
      },
      {
        // The Bakery door.
        name: "to-bakery-interior",
        zone: pick(bakeryStreetTransitions, "bakery-street-transition-1"),
        targetScene: "bakery-interior",
        targetSpawn: "from-bakery-street",
      },
    ],
    arrivals: {
      "from-plaza": spawnAt(bakeryStreetSpawns, "bakery-street-spawn-1"),
      "from-bakery-interior": spawnAt(
        bakeryStreetSpawns,
        "bakery-street-spawn-2",
      ),
    },
  },
  // The Bakery interior is a 389x242 asset-backed scene, so it uses the same
  // asset-driven renderer as the exteriors (`kind: "exterior"`); the Botica
  // interior scene is hard-wired to its own 480x270 room.
  "bakery-interior": {
    id: "bakery-interior",
    kind: "exterior",
    visual: visualOf("bakery-interior"),
    colliders: bakeryInteriorColliders,
    exits: [
      {
        name: "to-bakery-street",
        zone: pick(bakeryInteriorTransitions, "bakery-interior-transition-1"),
        targetScene: "bakery-street",
        targetSpawn: "from-bakery-interior",
      },
    ],
    arrivals: {
      "from-bakery-street": spawnAt(
        bakeryInteriorSpawns,
        "bakery-interior-spawn-1",
      ),
    },
  },
};

// The game starts in the Apothecary interior, at its existing start spawn.
export const START_SCENE: SceneId = "apothecary-interior";
export const START_SPAWN = "start";
