import { getDecorAsset } from "../decor/decorAssets";
import type { DecorComposition, DecorInteraction } from "../decor/decorTypes";
import { ARTIFACT_PERSON_PREFIX, WITCH_FINAL_INTERACTION_ID, WITCH_OUTSIDE_INTERACTION_ID } from "../dialogue/chapter4Dialogues";
import { artifactsCompositions } from "./artifacts";
import { chapter1Interactions } from "./chapter-1.interactions";

// DAY 4 INTERACTIONS (2026-11-17). Day 4 is only AMBIENT (Kilian: place the people and give them words; no
// errands, no treatments), so nobody types ids by hand: they come from WHAT is placed in the Decorator chapter
// "artifacts" (which the game reads as chapter-4):
//   * a person drawn with an artifact (asset "<base>-smartphone")  -> chapter4.artifact.<slug>  (thoughts of the Doctor)
//   * the Witch OUTSIDE her cottage (forest-cottage)               -> chapter4.cottage.witchOutside (asks him in, then leaves)
//   * the Witch INSIDE her cottage (forest-cottage-interior)       -> chapter4.cottage.witch    (the last scene)
//   * the four people who are awake at night (fisherman, old man with the jug, bartender, farm woman), drawn as
//     their normal asset in their scene -> their Day 2 id, which has a night version (chapter34AmbientDialogues.ts).
// Reach follows the scaled sprite bounds plus 16 units, like the other days.

// The part after "chapter4.artifact." for each pose with an artifact (see chapter4Dialogues.ts).
export const ARTIFACT_SLUGS: Readonly<Record<string, string>> = {
  "woman-sweeping": "sweeper",
  fisherman: "fisherman",
  bartender: "bartender",
  baker: "baker",
  "villager-sitting": "sitting",
  woodcutter: "woodcutter",
  blacksmith: "blacksmith",
  "woman-washing-clothes": "washer",
  // 2026-11-18: the new poses of Day 4
  "child-sitting": "child",
  "child-sitting-legs": "child",
  "fainted-man": "fainted",
  "fainted-woman": "fainted",
  "old-man-stool": "oldMan",
  "old-man-bench": "oldMan",
  // someone with a phone in one hand and a tankard / jug in the other, waist up from the front
  "man-tankard-bust": "patron",
  "woman-jug-bust": "patron",
};

// [scene|asset] -> the Day 2 interaction that has a Day 4 version.
const AWAKE: Readonly<Record<string, string>> = {
  "outskirts|fisherman": "chapter2.outskirts.fisherman",
  "tavern-street|elderly-man-with-jug": "chapter2.tavernStreet.elder",
  "tavern-interior|bartender": "chapter2.tavern.bartender",
  "farm|villager-woman-01": "chapter2.farm.woman",
};

const WITCH_SCENES = ["forest-cottage", "forest-cottage-interior"];

function interactionIdFor(sceneId: string, assetId: string): string | undefined {
  if (assetId.endsWith("-smartphone")) {
    const base = assetId.slice(0, -"-smartphone".length);
    return `${ARTIFACT_PERSON_PREFIX}${ARTIFACT_SLUGS[base] ?? base}`;
  }
  if (WITCH_SCENES.includes(sceneId) && assetId.startsWith("witch") && !/cat|crow/.test(assetId)) {
    // 2026-11-19: OUTSIDE (forest-cottage) she welcomes him and asks him in; INSIDE she has the last conversation.
    return sceneId === "forest-cottage" ? WITCH_OUTSIDE_INTERACTION_ID : WITCH_FINAL_INTERACTION_ID;
  }
  return AWAKE[`${sceneId}|${assetId}`];
}

export function buildChapter4Interactions(compositions: readonly DecorComposition[]): Record<string, DecorInteraction> {
  const result: Record<string, DecorInteraction> = {};
  for (const composition of compositions) {
    for (const instance of composition.instances) {
      const interactionId = interactionIdFor(composition.sceneId, instance.assetId);
      const asset = getDecorAsset(instance.assetId);
      if (!interactionId || !asset) continue;
      const width = asset.sprite.frameWidth * instance.scale;
      const height = asset.sprite.frameHeight * instance.scale;
      result[instance.instanceId] = {
        interactionId,
        zone: {
          offsetX: -asset.anchor.x * width - 16,
          offsetY: -asset.anchor.y * height - 16,
          width: width + 32,
          height: height + 32,
        },
      };
      // The bartender is behind the counter: the authored cross-counter reach, as on Days 1 and 2.
      if (instance.assetId.startsWith("bartender")) {
        result[instance.instanceId].zone = { ...chapter1Interactions["tavern-interior-bartender-01"].zone };
      }
    }
  }
  return result;
}

export const chapter4Interactions: Record<string, DecorInteraction> = buildChapter4Interactions(artifactsCompositions);
