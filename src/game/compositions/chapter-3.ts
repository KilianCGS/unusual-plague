// Exported from /dev/decorator (COPY CHAPTER): chapter "chapter-3".
// Save as src/game/compositions/chapter-3.ts. x / y are WORLD logical
// units of the instance anchor; interaction.zone is relative to it.
//
// DAY 3 (2026-11-12): it INHERITS the population of Day 2 (see compositions/index.ts):
// what Kilian places here is ADDED on top of it, so he only has to place what is new in
// Day 3 (the sweeper, the path miner, the quarry stonecutter, the glade...).
import type { DecorComposition } from "../decor/decorTypes";

export const chapter3Compositions: DecorComposition[] = [
  {
    "sceneId": "plaza",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "plaza-priest-praying-01",
        "assetId": "priest-praying",
        "x": 781,
        "y": 650,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "plaza-elderly-man-seated-01",
        "assetId": "elderly-man-seated",
        "x": 466,
        "y": 250,
        "scale": 0.79,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "plaza-elderly-woman-seated-01",
        "assetId": "elderly-woman-seated",
        "x": 511,
        "y": 248,
        "scale": 0.78,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "plaza-praying-man-side-01",
        "assetId": "praying-man-side",
        "x": 830,
        "y": 691,
        "scale": 0.81,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "plaza-praying-young-woman-01",
        "assetId": "praying-young-woman",
        "x": 721,
        "y": 693,
        "scale": 0.85,
        "flipX": true,
        "colliderEnabled": false,
        "zOffset": 0
      },
      {
        "instanceId": "plaza-praying-old-woman-back-01",
        "assetId": "praying-old-woman-back",
        "x": 777,
        "y": 723,
        "scale": 0.8,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  },
  {
    "sceneId": "tavern-street",
    "chapterId": "chapter-3",
    "instances": [
      {
        "instanceId": "tavern-street-villager-woman-02-01",
        "assetId": "villager-woman-02",
        "x": 409,
        "y": 440,
        "scale": 1,
        "flipX": false,
        "colliderEnabled": true,
        "zOffset": 0
      },
      {
        "instanceId": "tavern-street-boy-spinning-top-01",
        "assetId": "boy-spinning-top",
        "x": 451,
        "y": 439,
        "scale": 0.78,
        "flipX": false,
        "colliderEnabled": false,
        "zOffset": 0
      }
    ]
  }
];
