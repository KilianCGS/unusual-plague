import type { Language } from "../i18n/types";

// Doors the Doctor cannot walk through yet: touching their transition shows a
// short notice instead of changing scene. A door opens in the chapters listed
// in `openInChapters` (none yet).
export type LockedDoor = {
  fromScene: string;
  targetScene: string;
  openInChapters: readonly string[];
  notice: Record<Language, string>;
};

export const LOCKED_DOORS: readonly LockedDoor[] = [
  {
    // The Witch's house. Kilian's plan: on the last day the Doctor visits her
    // after seeing how strange things have become in the village. Until then
    // the door stays shut.
    fromScene: "forest-cottage",
    targetScene: "forest-cottage-interior",
    // Opens on Day 4 (2026-11-12): the Doctor meets her inside, at night.
    openInChapters: ["chapter-4"],
    notice: {
      es: "No debería colarme aquí sin permiso.",
      en: "I shouldn't sneak in here without permission.",
    },
  },
];

export function getLockedDoorNotice(
  fromScene: string,
  targetScene: string,
  chapterId: string,
  language: Language,
): string | null {
  const door = LOCKED_DOORS.find(
    (candidate) =>
      candidate.fromScene === fromScene &&
      candidate.targetScene === targetScene,
  );

  if (!door || door.openInChapters.includes(chapterId)) {
    return null;
  }

  return door.notice[language];
}
