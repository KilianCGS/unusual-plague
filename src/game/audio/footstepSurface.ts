import { NO_RUN_SCENES } from "../world/worldNoRun";
import type { SceneId } from "../world/worldScenes";
import type { SoundId } from "./soundManifest";
import { isInStepMixZone } from "./stepZones";

// Which step sound each scene uses. A first guess by scene (not by floor tile): interiors
// are one sound, the countryside and mountain a "wood and path" one, the town streets the
// "city / rock" one. To be tuned by ear (see /dev/sounds).
const COUNTRY_SCENES: readonly SceneId[] = ["outskirts", "forest", "farm", "mill-farmland", "mountain-path"];

// The mine and its caves are interiors that sound like the field (Kilian, 2026-11-15).
const FIELD_SOUNDING_INTERIORS: readonly SceneId[] = ["mine-interior", "mine-natural-cave"];

export function footstepSoundFor(sceneId: SceneId): SoundId {
  if (FIELD_SOUNDING_INTERIORS.includes(sceneId)) return "steps.woodPath";
  if (NO_RUN_SCENES.includes(sceneId)) return "steps.interior";
  if (COUNTRY_SCENES.includes(sceneId)) return "steps.woodPath";
  return "steps.cityRock";
}

// The sound of ONE step. Inside an orange zone (stone and earth mixed) the steps alternate:
// `alternate` flips on every step taken there.
export function footstepSoundAt(sceneId: SceneId, x: number, y: number, alternate: boolean): SoundId {
  if (isInStepMixZone(sceneId, x, y)) return alternate ? "steps.cityRock" : "steps.woodPath";
  return footstepSoundFor(sceneId);
}
