import type { DecorInstance } from "../decor/decorTypes";

// AMBIENT LIFE OF DAYS 1 TO 3 (2026-11-18, Kilian): the fish shadows of the river, the butterflies, the fireflies of the
// mill fields and the bats of the natural cave are the same on Days 1, 2 and 3 and are NOT on Day 4 (the night, which Kilian decorates himself).
// They are placed once here instead of in each chapter's file; getComposition adds them to chapters 1, 2 and 3 only
// (see compositions/index.ts) and the Decorator shows them as a read-only backdrop in those chapters. (The bee
// swarms and the river currents are in shared-environment.ts: those are in EVERY chapter.)
export const days1To3EnvironmentCompositions: { sceneId: string; instances: DecorInstance[] }[] = [
  {
    "sceneId": "outskirts",
    "instances": [
      {
        "instanceId": "outskirts-fish-shadow-horizontal-01",
        "assetId": "fish-shadow-horizontal",
        "x": 615,
        "y": 165,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "outskirts-fish-shadow-vertical-01",
        "assetId": "fish-shadow-vertical",
        "x": 571,
        "y": 636,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "forest",
    "instances": [
      {
        "instanceId": "forest-butterfly-01",
        "assetId": "butterfly",
        "x": 789,
        "y": 211,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-butterfly-02",
        "assetId": "butterfly",
        "x": 534,
        "y": 1040,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "mine-natural-cave",
    "instances": [
      {
        "instanceId": "mine-natural-cave-bat-01",
        "assetId": "bat",
        "x": 160,
        "y": 50,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mine-natural-cave-bat-02",
        "assetId": "bat",
        "x": 439,
        "y": 89,
        "scale": 1,
        "flipX": true,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "mill-farmland",
    "instances": [
      {
        "instanceId": "mill-farmland-butterfly-01",
        "assetId": "butterfly",
        "x": 2101,
        "y": 439,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-01",
        "assetId": "fireflies",
        "x": 657,
        "y": 886,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-02",
        "assetId": "fireflies",
        "x": 765,
        "y": 709,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-03",
        "assetId": "fireflies",
        "x": 799,
        "y": 838,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-04",
        "assetId": "fireflies",
        "x": 642,
        "y": 706,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-05",
        "assetId": "fireflies",
        "x": 722,
        "y": 757,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-06",
        "assetId": "fireflies",
        "x": 913,
        "y": 691,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-07",
        "assetId": "fireflies",
        "x": 992,
        "y": 814,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-08",
        "assetId": "fireflies",
        "x": 890,
        "y": 772,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-09",
        "assetId": "fireflies",
        "x": 1032,
        "y": 664,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-10",
        "assetId": "fireflies",
        "x": 1165,
        "y": 647,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-11",
        "assetId": "fireflies",
        "x": 1136,
        "y": 746,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "mill-farmland-fireflies-12",
        "assetId": "fireflies",
        "x": 1141,
        "y": 862,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "forest-glade",
    "instances": [
      {
        "instanceId": "forest-glade-butterfly-01",
        "assetId": "butterfly",
        "x": 436,
        "y": 394,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-glade-butterfly-02",
        "assetId": "butterfly",
        "x": 1041,
        "y": 667,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "forest-glade-butterfly-03",
        "assetId": "butterfly",
        "x": 912,
        "y": 353,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
];

export const DAYS_1_TO_3 = ["chapter-1", "chapter-2", "chapter-3"] as const;

export function getDays1To3EnvironmentInstances(sceneId: string, chapterId: string): DecorInstance[] {
  if (!(DAYS_1_TO_3 as readonly string[]).includes(chapterId)) return [];
  return days1To3EnvironmentCompositions.find((composition) => composition.sceneId === sceneId)?.instances ?? [];
}
