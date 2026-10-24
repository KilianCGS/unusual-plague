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
