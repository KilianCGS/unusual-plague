import type { SceneId } from "../world/worldScenes";

// GEOGRAPHY of the Doctor's old map, as DATA. This file knows nothing about how
// the map is drawn (CSS/SVG today, a painted PNG later): it only says which
// places exist, how they connect, and which game scenes belong to which place.
// The map is player-facing geography, not a 1:1 diagram of the scene graph.

export type MapLocationId =
  | "pharmacy"
  | "plaza"
  | "tavern"
  | "river"
  | "forest"
  | "farm"
  | "mill"
  | "bakery"
  | "smithy"
  | "mountain"
  | "mine";

export type MapLocation = {
  id: MapLocationId;
  // Short name written on the map.
  label: string;
  // Position on the schematic, in map units (see MAP_SIZE). Layout only: the
  // sketch Kilian drew is the reference (plaza in the middle, the river path
  // to the east, the smithy / mountain / mine chain to the west...).
  x: number;
  y: number;
};

export const MAP_SIZE = { width: 560, height: 270 };

const COLUMN = (index: number) => 44 + 94 * index;
const ROW = (index: number) => [52, 135, 218][index];

export const MAP_LOCATIONS: MapLocation[] = [
  { id: "pharmacy", label: "BOTICA", x: COLUMN(2), y: ROW(0) },
  { id: "plaza", label: "PLAZA", x: COLUMN(2), y: ROW(1) },
  { id: "bakery", label: "PANADERÍA", x: COLUMN(2), y: ROW(2) },
  { id: "smithy", label: "HERRERÍA", x: COLUMN(1), y: ROW(1) },
  { id: "mountain", label: "MONTAÑA", x: COLUMN(0), y: ROW(1) },
  { id: "mine", label: "MINA", x: COLUMN(0), y: ROW(0) },
  { id: "tavern", label: "TABERNA", x: COLUMN(3), y: ROW(1) },
  { id: "river", label: "RÍO", x: COLUMN(4), y: ROW(1) },
  { id: "forest", label: "BOSQUE", x: COLUMN(5), y: ROW(1) },
  { id: "farm", label: "GRANJA", x: COLUMN(4), y: ROW(0) },
  { id: "mill", label: "MOLINO", x: COLUMN(5), y: ROW(0) },
];

// Paths between places (undirected), following the real connections.
export const MAP_LINKS: [MapLocationId, MapLocationId][] = [
  ["pharmacy", "plaza"],
  ["plaza", "bakery"],
  ["plaza", "smithy"],
  ["smithy", "mountain"],
  ["mountain", "mine"],
  ["plaza", "tavern"],
  ["tavern", "river"],
  ["river", "forest"],
  ["river", "farm"],
  ["farm", "mill"],
];

// Every technical scene belongs to exactly one place (the Record type makes
// the compiler enforce it when a new SceneId appears). The Doctor's room is
// not a place of its own: it belongs to the pharmacy.
export const SCENE_TO_MAP_LOCATION: Record<SceneId, MapLocationId> = {
  "apothecary-interior": "pharmacy",
  "doctor-room": "pharmacy",
  "apothecary-street": "pharmacy",
  plaza: "plaza",
  "tavern-street": "tavern",
  "tavern-interior": "tavern",
  outskirts: "river",
  forest: "forest",
  farm: "farm",
  "mill-farmland": "mill",
  "bakery-street": "bakery",
  "bakery-interior": "bakery",
  "smithy-street": "smithy",
  "smithy-interior": "smithy",
  "mountain-path": "mountain",
  "mine-interior": "mine",
  "mine-natural-cave": "mine",
};
