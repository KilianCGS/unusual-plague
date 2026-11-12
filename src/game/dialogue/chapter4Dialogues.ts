import type { Language } from "../i18n/types";
import { countItem } from "../inventory/inventory";
import { localizeConversation, type LocalizedConversation, type LocalizedLine } from "./localizedConversation";
import { doctorThought } from "./doctorThought";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";

// DAY 4, THE NIGHT (2026-11-12). ALL THE TEXT BELOW IS NEW and awaits Kilian's review (it is the
// draft in docs/DAY4_DRAFT.md). Kilian places the Witch in the night version of her cottage with
// the interactionId chapter4.cottage.witch, and the people absorbed in their artifacts with ids
// that start with chapter4.artifact. (the Decorator chapter "artifacts" is read as Day 4).
export const WITCH_FINAL_INTERACTION_ID = "chapter4.cottage.witch";
export const WITCH_FINAL_ID = "chapter4.witch.final";
export const DAY4_COMPLETED_ID = "chapter4.day4.completed";
export const ARTIFACT_PERSON_PREFIX = "chapter4.artifact.";

const witch = (es: string, en: string): LocalizedLine => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string): LocalizedLine => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedLine[]): LocalizedConversation => ({ id: `chapter4.${id}`, lines });

// What the Doctor thinks when someone absorbed in an artifact does not look up.
export const ARTIFACT_THOUGHTS: LocalizedLine[] = [
  doctorThought("No ha levantado la vista. Ni siquiera para saludar.", "She hasn't looked up. Not even to say hello."),
  doctorThought("Sonríe a una luz que no es para mí.", "Smiling at a light that isn't meant for me."),
  doctorThought("Le hablo y responde a otra cosa.", "I speak to him and he answers something else."),
  doctorThought("Está aquí, pero no está.", "He's here, but he isn't."),
];

const FINAL_LINES: LocalizedLine[] = [
  witch("Llegas. Con la pluma, espero.", "You came. With the feather, I hope."),
  doctor("Aquí está. ¿Vas a decirme ya para qué?", "Here it is. Are you going to tell me now what it's for?"),
  witch("Es de cuervo. Los cuervos avisan cuando algo cambia de sitio.", "It's a raven's. Ravens warn you when something changes place."),
  doctor("¿Qué ha cambiado de sitio?", "What has changed place?"),
  witch("La atención. Antes se repartía entre las cosas. Ahora tiene dueño.", "Attention. It used to be shared among things. Now it has an owner."),
  doctor("Los artefactos.", "The artifacts."),
  witch("Los llamas así porque no sabes cómo se llaman. Yo tampoco. Funcionan igual.", "You call them that because you don't know their name. Neither do I. They work all the same."),
  doctor("Entonces no son una enfermedad.", "Then they aren't a disease."),
  witch("Eso depende de quién los mire. Tú los miras como médico.", "That depends on who's looking. You look at them as a doctor."),
  doctor("¿Y cómo se trata?", "And how is it treated?"),
  witch("Con lo que llevas haciendo estos días. Mirar a la persona, no al síntoma.", "With what you've been doing these days. Looking at the person, not the symptom."),
  witch("Y con tiempo. Los caldos no curan esto, pero ayudan a que alguien levante la cabeza.", "And with time. Broths don't cure this, but they help someone raise their head."),
  doctor("Siempre dices lo mismo con otras palabras.", "You always say the same thing in other words."),
  witch("Por eso sigues viniendo.", "That's why you keep coming."),
];

const NO_FEATHER_LINES: LocalizedLine[] = [
  doctorThought("Me pidió que trajera la pluma. No la llevo encima.", "She asked me to bring the feather. I'm not carrying it."),
  doctorThought("Debería buscarla; quizá la dejé guardada en el cofre.", "I should look for it; perhaps I left it in the chest."),
];

const FAREWELL_LINES: LocalizedLine[] = [
  witch("Ya has oído lo que venías a oír. Vuelve cuando quieras. O no.", "You've heard what you came to hear. Come back whenever you like. Or don't."),
];

// The closing of the game (the Doctor writing at night), his last thoughts.
export const day4Closing: LocalizedConversation = {
  id: "chapter4.day4.closing", lines: [
    doctorThought("Salgo de la casita y la noche ya no está tan negra. Se adivina el día sobre el bosque.", "I step out of the cottage and the night is no longer so black. Day is guessing itself above the forest."),
    doctorThought("Esta noche escribiré lo que he visto. Con cuidado: lo que no se anota, se olvida.", "Tonight I'll write down what I've seen. Carefully: what isn't noted is forgotten."),
    doctorThought("Mañana empezaré por preguntar qué miran. Y a quién.", "Tomorrow I'll begin by asking what they're looking at. And at whom."),
  ],
};

export function resolveChapter4(
  interactionId: string, facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome | null {
  const local = (conversation: LocalizedConversation) => localizeConversation(conversation, language, subjectId);

  if (interactionId === WITCH_FINAL_INTERACTION_ID) {
    if (facts.claimedRewards?.has(WITCH_FINAL_ID)) {
      return { conversation: local(talk("witch.farewell", FAREWELL_LINES)), effects: [] };
    }
    if (countItem(facts.inventory, "black-feather") < 1) {
      return { conversation: local(talk("witch.noFeather", NO_FEATHER_LINES)), effects: [] };
    }
    // The feather is not spent: she only asked him to carry it.
    return {
      conversation: local(talk("witch.final", FINAL_LINES)),
      effects: [{ type: "claim-reward", rewardId: WITCH_FINAL_ID }],
    };
  }

  if (interactionId.startsWith(ARTIFACT_PERSON_PREFIX)) {
    // A fixed thought per person (the same person always gets the same one).
    let hash = 0;
    for (const char of interactionId) hash = (hash * 31 + char.charCodeAt(0)) % 997;
    const index = hash % ARTIFACT_THOUGHTS.length;
    return { conversation: local(talk(`artifact.${index}`, [ARTIFACT_THOUGHTS[index]])), effects: [] };
  }

  return null;
}
