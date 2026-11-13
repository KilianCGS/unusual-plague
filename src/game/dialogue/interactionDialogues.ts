import type { Language } from "../i18n/types";
import { chapter1AmbientDialogues } from "./chapter1Dialogues";
import { chapter2AmbientDialogues } from "./chapter2AmbientDialogues";
import { ambientForChapter } from "./chapter34AmbientDialogues";
import { environmentDialogues } from "./environmentDialogues";
import { chapter1Intro } from "./chapter1Intro";
import { DOCTOR_SPEAKER, type Conversation } from "./dialogueTypes";
import {
  localizeConversation,
  type LocalizedConversation,
} from "./localizedConversation";

// interactionId -> conversation. Ids are globally unique ("chapter1.…"), so
// every chapter's table is simply spread in here. An interaction without an
// entry does nothing (that is how an interactable stays "pending").
const CONVERSATIONS: Record<string, LocalizedConversation> = {
  ...chapter1AmbientDialogues,
  ...chapter2AmbientDialogues,
  ...environmentDialogues,
};

// The Doctor's opening lines of each chapter, by chapterId.
const CHAPTER_INTROS: Record<string, LocalizedConversation> = {
  "chapter-1": chapter1Intro,
};

export function resolveChapterIntro(
  chapterId: string,
  language: Language,
): Conversation | null {
  const intro = CHAPTER_INTROS[chapterId];

  return intro ? localizeConversation(intro, language, DOCTOR_SPEAKER) : null;
}

export function resolveInteractionConversation(
  interactionId: string,
  language: Language,
  subjectId: string,
  chapterId?: string,
): Conversation | null {
  // Days 3 and 4: the people say their own lines instead of the Day 2 ones they inherit.
  const conversation =
    (chapterId ? ambientForChapter(chapterId, interactionId) : undefined) ??
    CONVERSATIONS[interactionId];

  return conversation
    ? localizeConversation(conversation, language, subjectId)
    : null;
}
