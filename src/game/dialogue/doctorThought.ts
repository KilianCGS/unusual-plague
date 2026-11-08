import type { LocalizedLine } from "./localizedConversation";

// Internal speech uses the Doctor's own bubble and explicit parentheses.
export function doctorThought(es: string, en: string): LocalizedLine {
  return { speaker: "doctor", text: { es: `(${es})`, en: `(${en})` } };
}
