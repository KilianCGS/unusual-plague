import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";
import type { InteractionZone } from "../interactions/interactionZone";

// The Botica (Apothecary Main Zone) on its 1606x979 background, drawn BY HAND
// in /dev/collisions (apothecary-main-zone): the export is the source of truth.
// World 480x293. Do not regenerate, scale, merge or normalise it.

// COLLIDERS (red): floor the feet cannot occupy.
export const apothecaryMainZoneColliders: SceneCollider[] = [
  { id: "apothecary-main-zone-1", x: 281, y: 235, width: 189, height: 43 },
  { id: "apothecary-main-zone-2", x: 381, y: 212, width: 83, height: 19 },
  { id: "apothecary-main-zone-3", x: 416, y: 0, width: 64, height: 203 },
  { id: "apothecary-main-zone-4", x: 323, y: 1, width: 117, height: 84 },
  { id: "apothecary-main-zone-5", x: 265, y: 0, width: 83, height: 93 },
  { id: "apothecary-main-zone-6", x: 6, y: 0, width: 208, height: 91 },
  { id: "apothecary-main-zone-7", x: 17, y: 72, width: 97, height: 102 },
  { id: "apothecary-main-zone-8", x: 79, y: 198, width: 53, height: 49 },
  { id: "apothecary-main-zone-9", x: 11, y: 236, width: 189, height: 36 },
  { id: "apothecary-main-zone-10", x: 48, y: 172, width: 32, height: 48 },
  { id: "apothecary-main-zone-11", x: 394, y: 136, width: 25, height: 25 },
  { id: "apothecary-main-zone-12", x: 408, y: 155, width: 11, height: 21 },
  { id: "apothecary-main-zone-13", x: 410, y: 122, width: 15, height: 14 },
  { id: "apothecary-main-zone-14", x: 319, y: 92, width: 5, height: 18 },
  { id: "apothecary-main-zone-15", x: 325, y: 89, width: 91, height: 16 },
];

// TRANSITIONS (yellow): activation zones.
// 1: the bottom exit (to the street); 2: the arch at the top (to the Doctor's
// Room). The destinations are wired in worldScenes.ts.
export const apothecaryMainZoneTransitions: (LogicalRect & { id: string })[] = [
  {
    id: "apothecary-main-zone-transition-1",
    x: 201,
    y: 245,
    width: 80,
    height: 20,
  },
  {
    id: "apothecary-main-zone-transition-2",
    x: 214,
    y: 71,
    width: 51,
    height: 15,
  },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
// 1: in front of the bottom exit (arriving from the street); 2: below the arch
// (arriving from the Doctor's Room).
export const apothecaryMainZoneSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "apothecary-main-zone-spawn-1", x: 240, y: 217, direction: "south" },
  { id: "apothecary-main-zone-spawn-2", x: 240, y: 109, direction: "south" },
];

// INTERACTIONS (green). The zones are the hand-drawn ones; the hand export left
// their interactionId empty, they are the Botica's two crafting stations:
// 1 = the stove / cooking counter at the top right (craft.fire),
// 2 = the long alchemy table on the left (craft.manual).
export const apothecaryMainZoneInteractions: InteractionZone[] = [
  {
    id: "apothecary-main-zone-interaction-1",
    x: 325,
    y: 106,
    width: 90,
    height: 17,
    interactionId: "craft.fire",
  },
  {
    id: "apothecary-main-zone-interaction-2",
    x: 116,
    y: 93,
    width: 16,
    height: 78,
    interactionId: "craft.manual",
  },
];
