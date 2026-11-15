import { countItem } from "../inventory/inventory";
import type { Language } from "../i18n/types";
import { localizeConversation, type LocalizedConversation } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";

// An optional, narrative use for the money that is left over: the merchant sells a candle
// (1 coin, from Day 2) and the Doctor can leave it at the foot of the plaza statue, once.
// Nothing is charged by surprise: the player chooses by buying the candle and carrying it.
// The text is NEW (2026-11-15), awaiting Kilian's review.
export const STATUE_INTERACTION_ID = "world.plaza.statue";
export const STATUE_CANDLE_REWARD_ID = "chapter2.statue.candle";

const doctor = (es: string, en: string) => ({ speaker: "doctor", text: { es, en } });

const statueCandle: LocalizedConversation = {
  id: "world.plaza.statue.candle",
  lines: [
    doctor(
      "Enciendo la vela al pie de la estatua. No sé a quién se la dedico: a todos, supongo.",
      "I light the candle at the foot of the statue. I don't know who it's for: everyone, I suppose.",
    ),
    doctor(
      "La llama se queda quieta, sin prisa. Hoy tampoco la tengo yo.",
      "The flame stays still, in no hurry. Neither am I today.",
    ),
    doctor(
      "Las plagas se llevan nombres. Una vela, al menos, recuerda dónde estaban.",
      "Plagues take names away. A candle, at least, remembers where they were.",
    ),
  ],
};

// Pure: decides only; GameWorld applies the effects (take the candle, mark it as left).
export function resolveStatueCandle(
  interactionId: string,
  facts: StoryFacts,
  language: Language,
  subjectId: string,
): StoryOutcome | null {
  if (interactionId !== STATUE_INTERACTION_ID) return null;
  if (facts.claimedRewards?.has(STATUE_CANDLE_REWARD_ID)) return null;
  if (countItem(facts.inventory, "candle") < 1) return null;
  return {
    conversation: localizeConversation(statueCandle, language, subjectId),
    effects: [
      { type: "take-item", itemId: "candle", quantity: 1 },
      { type: "claim-reward", rewardId: STATUE_CANDLE_REWARD_ID },
    ],
  };
}
