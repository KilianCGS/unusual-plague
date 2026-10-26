import type { LogicalRect } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";
import type {
  ExteriorWorldScene,
  SceneExit,
  SpawnPoint,
} from "../world/worldScenes";
import {
  apothecaryStreetColliders,
  apothecaryStreetSpawns,
  apothecaryStreetTransitions,
} from "./geometry/apothecaryStreetGeometry";
import {
  bakeryStreetColliders,
  bakeryStreetSpawns,
  bakeryStreetTransitions,
} from "./geometry/bakeryStreetGeometry";
import {
  farmColliders,
  farmSpawns,
  farmTransitions,
} from "./geometry/farmGeometry";
import {
  forestColliders,
  forestSpawns,
  forestTransitions,
} from "./geometry/forestGeometry";
import {
  forestCottageColliders,
  forestCottageSpawns,
  forestCottageTransitions,
} from "./geometry/forestCottageGeometry";
import {
  millFarmlandColliders,
  millFarmlandSpawns,
  millFarmlandTransitions,
} from "./geometry/millFarmlandGeometry";
import {
  mountainPathColliders,
  mountainPathSpawns,
  mountainPathTransitions,
} from "./geometry/mountainPathGeometry";
import {
  outskirtsColliders,
  outskirtsSpawns,
  outskirtsTransitions,
} from "./geometry/outskirtsGeometry";
import {
  plazaColliders,
  plazaSpawns,
  plazaTransitions,
} from "./geometry/plazaGeometry";
import {
  smithyStreetColliders,
  smithyStreetSpawns,
  smithyStreetTransitions,
} from "./geometry/smithyStreetGeometry";
import {
  tavernStreetColliders,
  tavernStreetSpawns,
  tavernStreetTransitions,
} from "./geometry/tavernStreetGeometry";
import {
  forestCottageInteriorColliders,
  forestCottageInteriorSpawns,
  forestCottageInteriorTransitions,
} from "../forest-cottage-interior/forestCottageInteriorGeometry";
import {
  FOREST_COTTAGE_INTERIOR_VISUAL,
  FOREST_COTTAGE_VISUAL,
  NEW_WORLD_VISUALS,
} from "./newWorldVisuals";

// The exterior scenes of the NEW world, with the SAME scene ids, exit names and
// arrival names as the old ones (so every neighbour that was not redrawn, the
// interiors and Calle Taberna, keeps working), plus `forest-cottage`:
//
//   Forest <-> Casita del bosque (south of the Forest)
//
// Only geometry changes (colliders, exit rectangles, spawns). The topology is
// the old one.

function pick<T extends { id: string }>(items: T[], id: string): T {
  const item = items.find((candidate) => candidate.id === id);

  if (!item) {
    throw new Error(`Missing new-world geometry id: ${id}`);
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

function visual(devSceneId: string) {
  return pick(NEW_WORLD_VISUALS, devSceneId);
}

function exit(
  name: string,
  transitions: (LogicalRect & { id: string })[],
  transitionId: string,
  targetScene: SceneExit["targetScene"],
  targetSpawn: string,
): SceneExit {
  return {
    name,
    zone: pick(transitions, transitionId),
    targetScene,
    targetSpawn,
  };
}

export const NEW_WORLD_SCENES: Record<
  | "plaza"
  | "apothecary-street"
  | "bakery-street"
  | "smithy-street"
  | "tavern-street"
  | "outskirts"
  | "forest"
  | "forest-cottage"
  | "forest-cottage-interior"
  | "farm"
  | "mill-farmland"
  | "mountain-path",
  ExteriorWorldScene
> = {
  plaza: {
    id: "plaza",
    kind: "exterior",
    visual: visual("plaza"),
    colliders: plazaColliders,
    exits: [
      exit(
        "to-apothecary-street",
        plazaTransitions,
        "plaza-transition-1",
        "apothecary-street",
        "from-plaza",
      ),
      exit(
        "to-tavern-street",
        plazaTransitions,
        "plaza-transition-3",
        "tavern-street",
        "from-plaza",
      ),
      exit(
        "to-bakery-street",
        plazaTransitions,
        "plaza-transition-4",
        "bakery-street",
        "from-plaza",
      ),
      exit(
        "to-smithy-street",
        plazaTransitions,
        "plaza-transition-2",
        "smithy-street",
        "from-plaza",
      ),
    ],
    arrivals: {
      "from-tavern-street": spawnAt(plazaSpawns, "plaza-spawn-1"),
      "from-apothecary-street": spawnAt(plazaSpawns, "plaza-spawn-2"),
      "from-smithy-street": spawnAt(plazaSpawns, "plaza-spawn-3"),
      "from-bakery-street": spawnAt(plazaSpawns, "plaza-spawn-4"),
    },
  },
  "apothecary-street": {
    id: "apothecary-street",
    kind: "exterior",
    visual: visual("apothecary-street"),
    colliders: apothecaryStreetColliders,
    exits: [
      exit(
        "to-plaza",
        apothecaryStreetTransitions,
        "apothecary-street-transition-1",
        "plaza",
        "from-apothecary-street",
      ),
      exit(
        "to-apothecary-interior",
        apothecaryStreetTransitions,
        "apothecary-street-transition-2",
        "apothecary-interior",
        "from-apothecary-street",
      ),
    ],
    arrivals: {
      "from-apothecary-interior": spawnAt(
        apothecaryStreetSpawns,
        "apothecary-street-spawn-1",
      ),
      "from-plaza": spawnAt(
        apothecaryStreetSpawns,
        "apothecary-street-spawn-2",
      ),
    },
  },
  "bakery-street": {
    id: "bakery-street",
    kind: "exterior",
    visual: visual("bakery-street"),
    colliders: bakeryStreetColliders,
    exits: [
      exit(
        "to-plaza",
        bakeryStreetTransitions,
        "bakery-street-transition-2",
        "plaza",
        "from-bakery-street",
      ),
      exit(
        "to-bakery-interior",
        bakeryStreetTransitions,
        "bakery-street-transition-1",
        "bakery-interior",
        "from-bakery-street",
      ),
    ],
    arrivals: {
      "from-plaza": spawnAt(bakeryStreetSpawns, "bakery-street-spawn-1"),
      "from-bakery-interior": spawnAt(
        bakeryStreetSpawns,
        "bakery-street-spawn-2",
      ),
    },
  },
  "smithy-street": {
    id: "smithy-street",
    kind: "exterior",
    visual: visual("smithy-street"),
    colliders: smithyStreetColliders,
    exits: [
      exit(
        "to-smithy-interior",
        smithyStreetTransitions,
        "smithy-street-transition-1",
        "smithy-interior",
        "from-smithy-street",
      ),
      exit(
        "to-plaza",
        smithyStreetTransitions,
        "smithy-street-transition-2",
        "plaza",
        "from-smithy-street",
      ),
      exit(
        "to-mountain-path",
        smithyStreetTransitions,
        "smithy-street-transition-3",
        "mountain-path",
        "from-smithy-street",
      ),
    ],
    arrivals: {
      "from-plaza": spawnAt(smithyStreetSpawns, "smithy-street-spawn-1"),
      "from-mountain-path": spawnAt(
        smithyStreetSpawns,
        "smithy-street-spawn-2",
      ),
      "from-smithy-interior": spawnAt(
        smithyStreetSpawns,
        "smithy-street-spawn-3",
      ),
    },
  },
  "tavern-street": {
    id: "tavern-street",
    kind: "exterior",
    visual: visual("calle-taberna"),
    colliders: tavernStreetColliders,
    exits: [
      exit(
        "to-plaza",
        tavernStreetTransitions,
        "tavern-street-transition-1",
        "plaza",
        "from-tavern-street",
      ),
      exit(
        "to-outskirts",
        tavernStreetTransitions,
        "tavern-street-transition-2",
        "outskirts",
        "from-tavern-street",
      ),
      exit(
        "to-tavern-interior",
        tavernStreetTransitions,
        "tavern-street-transition-3",
        "tavern-interior",
        "from-tavern-street",
      ),
    ],
    arrivals: {
      "from-outskirts": spawnAt(tavernStreetSpawns, "tavern-street-spawn-1"),
      "from-plaza": spawnAt(tavernStreetSpawns, "tavern-street-spawn-2"),
      "from-tavern-interior": spawnAt(
        tavernStreetSpawns,
        "tavern-street-spawn-3",
      ),
    },
  },
  outskirts: {
    id: "outskirts",
    kind: "exterior",
    visual: visual("outskirts-brook-provisional"),
    colliders: outskirtsColliders,
    exits: [
      exit(
        "to-forest",
        outskirtsTransitions,
        "outskirts-transition-1",
        "forest",
        "from-outskirts",
      ),
      exit(
        "to-farm",
        outskirtsTransitions,
        "outskirts-transition-2",
        "farm",
        "from-outskirts",
      ),
      exit(
        "to-tavern-street",
        outskirtsTransitions,
        "outskirts-transition-3",
        "tavern-street",
        "from-outskirts",
      ),
    ],
    arrivals: {
      "from-farm": spawnAt(outskirtsSpawns, "outskirts-spawn-1"),
      "from-tavern-street": spawnAt(outskirtsSpawns, "outskirts-spawn-2"),
      "from-forest": spawnAt(outskirtsSpawns, "outskirts-spawn-3"),
    },
  },
  forest: {
    id: "forest",
    kind: "exterior",
    visual: visual("forest-v1"),
    colliders: forestColliders,
    exits: [
      exit(
        "to-outskirts",
        forestTransitions,
        "forest-transition-1",
        "outskirts",
        "from-forest",
      ),
      // NEW: the south path leads to the Casita del bosque.
      exit(
        "to-forest-cottage",
        forestTransitions,
        "forest-transition-2",
        "forest-cottage",
        "from-forest",
      ),
    ],
    arrivals: {
      "from-outskirts": spawnAt(forestSpawns, "forest-spawn-1"),
      "from-forest-cottage": spawnAt(forestSpawns, "forest-spawn-2"),
    },
  },
  "forest-cottage": {
    id: "forest-cottage",
    kind: "exterior",
    visual: FOREST_COTTAGE_VISUAL,
    colliders: forestCottageColliders,
    exits: [
      // North path: back to the Forest.
      exit(
        "to-forest",
        forestCottageTransitions,
        "forest-cottage-transition-1",
        "forest",
        "from-forest-cottage",
      ),
      // The door of the house.
      exit(
        "to-forest-cottage-interior",
        forestCottageTransitions,
        "forest-cottage-transition-2",
        "forest-cottage-interior",
        "from-forest-cottage",
      ),
    ],
    arrivals: {
      "from-forest": spawnAt(forestCottageSpawns, "forest-cottage-spawn-1"),
      "from-forest-cottage-interior": spawnAt(
        forestCottageSpawns,
        "forest-cottage-spawn-2",
      ),
    },
  },
  // The inside of the house: its only exit is the door back to the cottage.
  "forest-cottage-interior": {
    id: "forest-cottage-interior",
    kind: "exterior",
    visual: FOREST_COTTAGE_INTERIOR_VISUAL,
    colliders: forestCottageInteriorColliders,
    exits: [
      exit(
        "to-forest-cottage",
        forestCottageInteriorTransitions,
        "forest-cottage-interior-transition-1",
        "forest-cottage",
        "from-forest-cottage-interior",
      ),
    ],
    arrivals: {
      "from-forest-cottage": spawnAt(
        forestCottageInteriorSpawns,
        "forest-cottage-interior-spawn-1",
      ),
    },
  },
  farm: {
    id: "farm",
    kind: "exterior",
    visual: visual("farm"),
    colliders: farmColliders,
    exits: [
      exit(
        "to-mill-farmland",
        farmTransitions,
        "farm-transition-1",
        "mill-farmland",
        "from-farm",
      ),
      exit(
        "to-outskirts",
        farmTransitions,
        "farm-transition-2",
        "outskirts",
        "from-farm",
      ),
    ],
    arrivals: {
      "from-mill-farmland": spawnAt(farmSpawns, "farm-spawn-1"),
      "from-outskirts": spawnAt(farmSpawns, "farm-spawn-2"),
    },
  },
  "mill-farmland": {
    id: "mill-farmland",
    kind: "exterior",
    visual: visual("mill-farmland"),
    colliders: millFarmlandColliders,
    exits: [
      exit(
        "to-farm",
        millFarmlandTransitions,
        "mill-farmland-transition-1",
        "farm",
        "from-mill-farmland",
      ),
    ],
    arrivals: {
      "from-farm": spawnAt(millFarmlandSpawns, "mill-farmland-spawn-1"),
    },
  },
  "mountain-path": {
    id: "mountain-path",
    kind: "exterior",
    visual: visual("mountain-path"),
    colliders: mountainPathColliders,
    exits: [
      exit(
        "to-smithy-street",
        mountainPathTransitions,
        "mountain-path-transition-1",
        "smithy-street",
        "from-mountain-path",
      ),
      exit(
        "to-mine-interior",
        mountainPathTransitions,
        "mountain-path-transition-2",
        "mine-interior",
        "from-mountain-path",
      ),
    ],
    arrivals: {
      "from-smithy-street": spawnAt(
        mountainPathSpawns,
        "mountain-path-spawn-1",
      ),
      "from-mine-interior": spawnAt(
        mountainPathSpawns,
        "mountain-path-spawn-2",
      ),
    },
  },
};
