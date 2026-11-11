import type { DevScene } from "../../app/dev/scene/scenes";
import { apothecaryStreetColliders } from "./geometry/apothecaryStreetGeometry";
import { bakeryStreetColliders } from "./geometry/bakeryStreetGeometry";
import { farmColliders } from "./geometry/farmGeometry";
import { forestColliders } from "./geometry/forestGeometry";
import { forestCottageColliders } from "./geometry/forestCottageGeometry";
import { millFarmlandColliders } from "./geometry/millFarmlandGeometry";
import { mountainPathColliders } from "./geometry/mountainPathGeometry";
import { outskirtsColliders } from "./geometry/outskirtsGeometry";
import { plazaColliders } from "./geometry/plazaGeometry";
import { quarryColliders } from "./geometry/quarryGeometry";
import { forestGladeColliders } from "./geometry/forestGladeGeometry";
import { smithyStreetColliders } from "./geometry/smithyStreetGeometry";
import { tavernStreetColliders } from "./geometry/tavernStreetGeometry";

// Backgrounds of the new world: unmodified copies of the approved images in
// public/game/new-world-map. Each scene has its own units-per-pixel, chosen so
// the doors and furniture of THAT image are about as tall as the Doctor
// expects (the images were generated at different zoom levels). The whole
// logical world is assetSize * unitsPerPixel; the camera works as everywhere.
// Keyed by the DEV scene id (the ids of the old world, kept on purpose).
const DIR = "/game/new-world-map";

export const NEW_WORLD_VISUALS: DevScene[] = [
  {
    id: "plaza",
    label: "Plaza (nuevo mundo)",
    backgroundSrc: `${DIR}/plaza-background.png`,
    assetWidth: 1536,
    assetHeight: 1024,
    initialAssetX: 770,
    initialAssetY: 110,
    logicalUnitsPerAssetPixel: 1,
    colliders: plazaColliders,
  },
  {
    id: "apothecary-street",
    label: "Calle Botica (nuevo mundo)",
    backgroundSrc: `${DIR}/apothecary-street-background.png`,
    assetWidth: 1120,
    assetHeight: 1405,
    initialAssetX: 555,
    initialAssetY: 1260,
    logicalUnitsPerAssetPixel: 0.65,
    colliders: apothecaryStreetColliders,
  },
  {
    id: "bakery-street",
    label: "Calle Panadería (nuevo mundo)",
    backgroundSrc: `${DIR}/bakery-street-background.png`,
    assetWidth: 1168,
    assetHeight: 1346,
    initialAssetX: 600,
    initialAssetY: 120,
    logicalUnitsPerAssetPixel: 0.7,
    colliders: bakeryStreetColliders,
  },
  {
    id: "smithy-street",
    label: "Calle Herrería (nuevo mundo)",
    backgroundSrc: `${DIR}/smithy-street-background.png`,
    assetWidth: 1619,
    assetHeight: 971,
    initialAssetX: 1520,
    initialAssetY: 545,
    logicalUnitsPerAssetPixel: 1,
    colliders: smithyStreetColliders,
  },
  {
    id: "calle-taberna",
    label: "Calle Taberna (nuevo mundo)",
    backgroundSrc: `${DIR}/tavern-street-background.png`,
    assetWidth: 1730,
    assetHeight: 909,
    initialAssetX: 130,
    initialAssetY: 540,
    logicalUnitsPerAssetPixel: 0.9,
    colliders: tavernStreetColliders,
  },
  {
    id: "outskirts-brook-provisional",
    label: "Río de la ciudad (nuevo mundo)",
    backgroundSrc: `${DIR}/outskirts-background.png`,
    assetWidth: 1546,
    assetHeight: 1017,
    initialAssetX: 100,
    initialAssetY: 515,
    logicalUnitsPerAssetPixel: 0.85,
    colliders: outskirtsColliders,
  },
  {
    id: "forest-v1",
    label: "Bosque (nuevo mundo)",
    backgroundSrc: `${DIR}/forest-background.png`,
    assetWidth: 1426,
    assetHeight: 1103,
    initialAssetX: 110,
    initialAssetY: 550,
    logicalUnitsPerAssetPixel: 1,
    colliders: forestColliders,
  },
  {
    id: "farm",
    label: "Granja (nuevo mundo)",
    backgroundSrc: `${DIR}/farm-background.png`,
    assetWidth: 1581,
    assetHeight: 945,
    initialAssetX: 90,
    initialAssetY: 850,
    logicalUnitsPerAssetPixel: 1.2,
    colliders: farmColliders,
  },
  {
    id: "mill-farmland",
    label: "Tierras de cultivo (nuevo mundo)",
    backgroundSrc: `${DIR}/mill-farmland-background.png`,
    assetWidth: 1774,
    assetHeight: 887,
    initialAssetX: 110,
    initialAssetY: 775,
    logicalUnitsPerAssetPixel: 1.4,
    colliders: millFarmlandColliders,
  },
  {
    id: "mountain-path",
    label: "Paseo de la mina (nuevo mundo)",
    backgroundSrc: `${DIR}/mountain-path-background.png`,
    assetWidth: 1665,
    assetHeight: 944,
    initialAssetX: 1560,
    initialAssetY: 595,
    logicalUnitsPerAssetPixel: 0.8,
    colliders: mountainPathColliders,
  },
  // NEW ZONES (background only until Kilian paints their colliders, exits and
  // spawns in /dev/collisions). The quarry is the same 1665x944 size as the mine
  // path and is reached from its new south exit; the deep forest is the same
  // size as the forest and is reached from the forest's new east exit. They use
  // their neighbour's units per pixel so the Doctor has the same size.
  // initialAsset* is only the preview start of the dev tools, not a spawn.
  {
    id: "quarry",
    label: "Cantera (nuevo mundo)",
    backgroundSrc: `${DIR}/quarry-background.png`,
    assetWidth: 1665,
    assetHeight: 944,
    initialAssetX: 860,
    initialAssetY: 140,
    logicalUnitsPerAssetPixel: 0.8,
    colliders: quarryColliders,
  },
  {
    id: "forest-deep",
    label: "Bosque profundo (nuevo mundo)",
    backgroundSrc: `${DIR}/forest-deep-background.png`,
    assetWidth: 1427,
    assetHeight: 1102,
    initialAssetX: 110,
    initialAssetY: 590,
    logicalUnitsPerAssetPixel: 1,
    colliders: [],
  },
  // The mushroom glade (2026-11-11): a second place to find the Witch, picking
  // mushrooms, and to gather them. Same size as the deep forest and the same
  // units per pixel. Background only until Kilian paints its colliders, exits
  // and spawns; initialAsset* is the preview start of the dev tools only (the
  // west end of the path).
  {
    id: "forest-glade",
    label: "Claro de las setas (nuevo mundo)",
    backgroundSrc: `${DIR}/forest-glade-background.png`,
    assetWidth: 1427,
    assetHeight: 1102,
    initialAssetX: 110,
    initialAssetY: 590,
    logicalUnitsPerAssetPixel: 1,
    colliders: forestGladeColliders,
  },
];

// The inside of the cottage: unmodified copy of the approved 1426x1103 image.
// Same approach as the other new interiors: 0.36 unit per asset pixel gives a
// 513x397 world and zoomMultiplier 1.5 shows all of it (fixed camera), with the
// Doctor at the size he has in the mine. Shared by both worlds, like the
// cottage itself. Its geometry is still to be painted in /dev/collisions.
export const FOREST_COTTAGE_INTERIOR_VISUAL: DevScene = {
  id: "forest-cottage-interior",
  label: "Casita del bosque (interior)",
  backgroundSrc:
    "/game/areas/forest-cottage-interior/forest-cottage-interior-background.png",
  assetWidth: 1426,
  assetHeight: 1103,
  // On the floor just inside the south doorway.
  initialAssetX: 715,
  initialAssetY: 850,
  logicalUnitsPerAssetPixel: 0.36,
  zoomMultiplier: 1.5,
};

// The inside of the granary: unmodified copy of the approved 1254x1254 image
// (dark border included). AUTHORING ONLY for now: the Decorator opens it to
// place the Day 2 population; it is not a runtime scene (no exits, arrivals or
// colliders, and it is not in WORLD_SCENES). 0.36 unit per asset pixel and
// zoomMultiplier 1.5 follow the cottage interior as STARTING values: compare
// the Doctor with the bed, the door and the sacks in /dev/decorator and adjust.
export const GRANARY_INTERIOR_VISUAL: DevScene = {
  id: "granary-interior",
  label: "Granero (interior)",
  backgroundSrc: "/game/areas/granary-interior/granary-interior-background.png",
  assetWidth: 1254,
  assetHeight: 1254,
  // Preview start only: centred on the opening of the south wall.
  initialAssetX: 627,
  initialAssetY: 1050,
  logicalUnitsPerAssetPixel: 0.36,
  zoomMultiplier: 1.5,
};

// The one scene that did not exist before. Also listed in the old world's
// scene table (nothing links to it there), so the type of the table stays
// complete and the Decorator can open it.
export const FOREST_COTTAGE_VISUAL: DevScene = {
  id: "forest-cottage",
  label: "Casita del bosque",
  backgroundSrc: `${DIR}/forest-cottage-background.png`,
  assetWidth: 1426,
  assetHeight: 1103,
  initialAssetX: 690,
  initialAssetY: 100,
  logicalUnitsPerAssetPixel: 1,
  colliders: forestCottageColliders,
};
