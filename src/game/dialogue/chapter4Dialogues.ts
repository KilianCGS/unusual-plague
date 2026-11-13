import type { Language } from "../i18n/types";
import { countItem } from "../inventory/inventory";
import { localizeConversation, type LocalizedConversation, type LocalizedLine } from "./localizedConversation";
import { doctorThought } from "./doctorThought";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";

// DAY 4, THE NIGHT (2026-11-12). ALL THE TEXT BELOW IS NEW and awaits Kilian's review (it is the
// draft in docs/DAY4_DRAFT.md). Kilian places the Witch in the night version of her cottage with
// the interactionId chapter4.cottage.witch, and the people absorbed in their artifacts with ids
// that start with chapter4.artifact. (the Decorator chapter "artifacts" is read as Day 4).
// 2026-11-13: voice pass: the Witch is warm with the Doctor and sometimes sarcastic; the Doctor is
// cheerful, close and serene. New text, awaiting Kilian's review. The revelation is unchanged; the
// artifact thoughts (ARTIFACT_THOUGHTS) are untouched on purpose.
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
  witch("Llegas. Con la pluma, espero. Y con cara de haber corrido la noche entera.", "You came. With the feather, I hope. And looking as if you'd run all night."),
  doctor("Aquí está, a salvo. ¿Vas a decirme ya para qué, o seguimos con el misterio?", "Here it is, safe and sound. Are you going to tell me now what it's for, or do we keep the mystery?"),
  witch("Es de cuervo. Los cuervos avisan cuando algo cambia de sitio.", "It's a raven's. Ravens warn you when something changes place."),
  doctor("¿Qué ha cambiado de sitio?", "What has changed place?"),
  witch("La atención. Antes se repartía entre las cosas. Ahora tiene dueño.", "Attention. It used to be shared among things. Now it has an owner."),
  doctor("Los artefactos... los he visto por todas partes.", "The artifacts... I've seen them everywhere."),
  witch("Los llamas así porque no sabes cómo se llaman. Yo tampoco. Funcionan igual.", "You call them that because you don't know their name. Neither do I. They work all the same."),
  doctor("Entonces no son una enfermedad. Ni un castigo.", "Then they aren't a disease. Nor a punishment."),
  witch("Eso depende de quién los mire. Tú los miras como médico, y por eso me fío de ti.", "That depends on who's looking. You look at them as a doctor, and that's why I trust you."),
  doctor("¿Y cómo se trata, entonces?", "And how is it treated, then?"),
  witch("Con lo que llevas haciendo estos días: mirar a la persona, no al síntoma. Lo haces mejor de lo que crees.", "With what you've been doing these days: looking at the person, not the symptom. You do it better than you think."),
  witch("Y con tiempo. Los caldos no curan esto, pero ayudan a que alguien levante la cabeza.", "And with time. Broths don't cure this, but they help someone raise their head."),
  doctor("Siempre dices lo mismo con otras palabras. Y siempre me hace sonreír.", "You always say the same thing in other words. And it always makes me smile."),
  witch("Por eso sigues viniendo. Y yo sigo abriendo la puerta.", "That's why you keep coming. And I keep opening the door."),
];

const NO_FEATHER_LINES: LocalizedLine[] = [
  doctorThought("Me pidió que trajera la pluma. No la llevo encima.", "She asked me to bring the feather. I'm not carrying it."),
  doctorThought("Debería buscarla con calma; quizá la dejé guardada en el cofre.", "I should look for it calmly; perhaps I left it in the chest."),
];

const FAREWELL_LINES: LocalizedLine[] = [
  witch("Ya has oído lo que venías a oír. Vuelve cuando quieras. O no: la puerta no se cansa. Cuídate, Doctor.", "You've heard what you came to hear. Come back whenever you like. Or don't: the door never tires. Take care, Doctor."),
];

// The closing of the game (the Doctor writing at night), his last thoughts.
export const day4Closing: LocalizedConversation = {
  id: "chapter4.day4.closing", lines: [
    doctorThought("Salgo de la casita y la noche ya no está tan negra. Se adivina el día sobre el bosque, y qué bien sienta el aire.", "I step out of the cottage and the night is no longer so black. Day is guessing itself above the forest, and how good the air feels."),
    doctorThought("Esta noche escribiré lo que he visto. Con cuidado: lo que no se anota, se olvida.", "Tonight I'll write down what I've seen. Carefully: what isn't noted is forgotten."),
    doctorThought("Mañana empezaré por preguntar qué miran. Y a quién. Con una sonrisa, que abre más puertas que cualquier remedio.", "Tomorrow I'll begin by asking what they're looking at. And at whom. With a smile, which opens more doors than any remedy."),
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
