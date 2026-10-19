import type { NarrativeIllustrationId } from "../narrative/illustrations";
import type { SceneId } from "./worldScenes";

// Where and how a chapter (a day) BEGINS. Data only, so another day can start
// the same way: through its own narrative interlude, then in the Doctor's Room.
// Only Chapter 1 is defined today.
export type ChapterStart = {
  // The first controllable scene and the arrival the Doctor stands on.
  sceneId: SceneId;
  spawnName: string;
  // An illustration + monologue shown from black before the first scene. The
  // monologue itself is the chapter intro (see resolveChapterIntro).
  opening?: { illustration: NarrativeIllustrationId };
};

const CHAPTER_STARTS: Record<string, ChapterStart> = {
  "chapter-1": {
    sceneId: "doctor-room",
    spawnName: "chapter-start",
    opening: { illustration: "doctor-writing" },
  },
};

export function getChapterStart(chapterId: string): ChapterStart {
  const start = CHAPTER_STARTS[chapterId];

  if (!start) {
    throw new Error(`Chapter has no start: ${chapterId}`);
  }

  return start;
}
