import { shouldCloseDay1 } from "../patients/day1";
import { shouldCloseDay2 } from "../patients/day2";
import { shouldCloseDay3 } from "../patients/day3";
import type { PatientCasesState } from "../patients/patientCases";
import type { SceneId } from "./worldScenes";

// THE END OF A DAY (2026-11-13, Kilian): the player must KNOW when the day is over. When the
// last patient of a day is treated the Doctor says he has done enough for today and should rest
// (once), a sign at the top right asks him to go to the Botica, the fast travel is off, and when
// he steps into the Botica the screen fades to black and the next day begins (the closing
// interlude of each day, see GameWorld). Day 4 has its own ending (the Witch) and is not here.
//
// Everything is DERIVED from the cases plus one claimed flag per day ("the Doctor has said it"),
// like the rest of the story state: there is no second source of truth.
export const DAY_WIND_DOWN_FLAGS: Readonly<Record<string, string>> = {
  "chapter-1": "chapter1.day1.windDown",
  "chapter-2": "chapter2.day2.windDown",
  "chapter-3": "chapter3.day3.windDown",
};

// The scenes where the day ends once the Doctor is "home": the Botica and the room above it.
export const DAY_END_SCENES: readonly SceneId[] = ["apothecary-interior", "doctor-room"];

function lastCaseTreated(
  chapterId: string,
  patients: PatientCasesState,
  claimed: ReadonlySet<string>,
): boolean {
  if (chapterId === "chapter-1") return shouldCloseDay1(patients, claimed);
  if (chapterId === "chapter-2") return shouldCloseDay2(patients, claimed);
  if (chapterId === "chapter-3") return shouldCloseDay3(patients, claimed);
  return false;
}

// The day's cases are all treated and the day has not been closed yet.
export function isDayWindingDown(
  chapterId: string,
  patients: PatientCasesState,
  claimed: ReadonlySet<string>,
): boolean {
  return lastCaseTreated(chapterId, patients, claimed);
}

// The Doctor still has to say "I should rest" (he says it once per day).
export function shouldAnnounceDayEnd(
  chapterId: string,
  patients: PatientCasesState,
  claimed: ReadonlySet<string>,
): boolean {
  const flag = DAY_WIND_DOWN_FLAGS[chapterId];
  return !!flag && !claimed.has(flag) && lastCaseTreated(chapterId, patients, claimed);
}

// The day closes when he has said it AND he is home.
export function shouldCloseDayNow(
  chapterId: string,
  patients: PatientCasesState,
  claimed: ReadonlySet<string>,
  sceneId: SceneId,
): boolean {
  const flag = DAY_WIND_DOWN_FLAGS[chapterId];
  return (
    !!flag &&
    claimed.has(flag) &&
    lastCaseTreated(chapterId, patients, claimed) &&
    DAY_END_SCENES.includes(sceneId)
  );
}
