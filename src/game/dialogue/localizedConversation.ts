import type { Language } from "../i18n/types";
import type { Conversation } from "./dialogueTypes";

// A conversation as authored: every line carries its text in EVERY language
// (the Record type makes a missing translation a compile error). `speaker` is:
//   "doctor"  the Doctor;
//   "subject" whoever started the interaction (the DecorInstance that owns the
//             interaction zone), so the data never names a position or an id.
// An NPC id (SceneNpc.id) is also valid, as in Dialogue V1.
export type LocalizedLine = {
  speaker: string;
  text: Record<Language, string>;
};

export type LocalizedConversation = {
  id: string;
  lines: LocalizedLine[];
};

export const SUBJECT_SPEAKER = "subject";

// Picks one language and binds "subject" to the instance that started the
// conversation, producing the plain Conversation Dialogue V1 plays.
export function localizeConversation(
  conversation: LocalizedConversation,
  language: Language,
  subjectId: string,
): Conversation {
  return {
    id: conversation.id,
    lines: conversation.lines.map((line) => ({
      speaker: line.speaker === SUBJECT_SPEAKER ? subjectId : line.speaker,
      text: line.text[language],
    })),
  };
}
