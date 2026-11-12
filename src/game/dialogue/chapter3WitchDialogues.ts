import type { Language } from "../i18n/types";
import { addItem, countItem } from "../inventory/inventory";
import { localizeConversation, type LocalizedConversation, type LocalizedLine } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";

// THE WITCH IN THE GLADE, DAY 3 (2026-11-12): she gives a bone (once) and sells a bad
// omen for a pine mushroom (once). The text is the draft in docs/WITCH_DAY3_DRAFT.md and
// AWAITS KILIAN'S REVIEW. She is reached through the interactionId Kilian gives to her
// instance in the glade in the Decorator (chapter 3).
export const WITCH_GLADE_INTERACTION_ID = "chapter3.glade.witch";
export const WITCH_BONE_REWARD_ID = "chapter3.witch.bone";
export const WITCH_OMEN_REWARD_ID = "chapter3.witch.omen";

const witch = (es: string, en: string): LocalizedLine => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string): LocalizedLine => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedLine[]): LocalizedConversation => ({ id: `chapter3.glade.witch.${id}`, lines });

const BONE_LINES: LocalizedLine[] = [
  witch("Llegas tarde para las setas y pronto para lo demás.", "You're late for the mushrooms and early for the rest."),
  doctor("¿Qué es lo demás?", "What's the rest?"),
  witch("Depende de cuánto te guste preguntar.", "It depends on how much you like asking."),
  doctor("Estás recogiendo setas.", "You're picking mushrooms."),
  witch("Qué ojo clínico. ¿Por eso eres médico?", "Such a clinical eye. Is that why you're a doctor?"),
  witch("Toma.", "Here."),
  doctor("Un hueso.", "A bone."),
  witch("Para caldo. Alguien va a tener frío y te lo va a pedir.", "For broth. Someone is going to be cold and ask you for it."),
  doctor("¿Quién?", "Who?"),
  witch("Alguien con frío.", "Someone cold."),
  doctor("Sigues sin responder.", "You still don't answer."),
  witch("Te he dado un hueso. Es más que una respuesta.", "I gave you a bone. That's more than an answer."),
];

const NO_ROOM_LINES: LocalizedLine[] = [
  witch("Tienes las manos llenas. Haz sitio; el hueso y yo no vamos a ninguna parte.", "Your hands are full. Make some room; the bone and I aren't going anywhere."),
];

const OMEN_LINES: LocalizedLine[] = [
  witch("Tengo algo más para ti. Un mal presagio.", "I have something else for you. A bad omen."),
  doctor("¿Cuánto cuesta?", "How much is it?"),
  witch("Una seta de pino. De las de aquí. Las buenas no las vendo.", "A pine mushroom. One from here. I don't sell the good ones."),
  doctor("Aquí tienes.", "Here you go."),
  witch("Mañana anochecerá antes de que acabe el día.", "Tomorrow night will fall before the day is over."),
  witch("La gente llevará una luz pequeña en las manos y no te mirará.", "People will carry a small light in their hands and won't look at you."),
  witch("El bosque, la granja y la mina se cerrarán a tu paso.", "The forest, the farm and the mine will close to you."),
  doctor("¿Eso es un presagio o un parte del tiempo?", "Is that an omen or a weather report?"),
  witch("Es un mal presagio. Los buenos no hacen falta.", "It's a bad omen. The good ones aren't needed."),
  witch("Ven a verme cuando todo se haya apagado. Y trae la pluma.", "Come and see me when everything has gone dark. And bring the feather."),
  doctor("¿Para qué?", "What for?"),
  witch("Te lo dije: cuando importe.", "I told you: when it matters."),
];

const NO_MUSHROOM_LINES: LocalizedLine[] = [
  witch("El presagio tiene precio. Una seta de pino; el claro está lleno.", "The omen has a price. One pine mushroom; the clearing is full of them."),
];

const FAREWELL_LINES: LocalizedLine[] = [
  witch("Ya sabes lo que tenías que saber. Lo demás, mañana.", "Now you know what you needed to. The rest, tomorrow."),
];

export function resolveChapter3Witch(
  interactionId: string, facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome | null {
  if (interactionId !== WITCH_GLADE_INTERACTION_ID) return null;
  const claimed = facts.claimedRewards ?? new Set<string>();
  const local = (conversation: LocalizedConversation) => localizeConversation(conversation, language, subjectId);

  if (!claimed.has(WITCH_BONE_REWARD_ID)) {
    if (!addItem(facts.inventory, "bone", 1)) {
      return { conversation: local(talk("boneNoRoom", NO_ROOM_LINES)), effects: [] };
    }
    return {
      conversation: local(talk("bone", BONE_LINES)),
      effects: [
        { type: "give-item", itemId: "bone", quantity: 1 },
        { type: "claim-reward", rewardId: WITCH_BONE_REWARD_ID },
      ],
    };
  }

  if (!claimed.has(WITCH_OMEN_REWARD_ID)) {
    if (countItem(facts.inventory, "pine-mushroom") < 1) {
      return { conversation: local(talk("noMushroom", NO_MUSHROOM_LINES)), effects: [] };
    }
    return {
      conversation: local(talk("omen", OMEN_LINES)),
      effects: [
        { type: "take-item", itemId: "pine-mushroom", quantity: 1 },
        { type: "claim-reward", rewardId: WITCH_OMEN_REWARD_ID },
      ],
    };
  }

  return { conversation: local(talk("farewell", FAREWELL_LINES)), effects: [] };
}
