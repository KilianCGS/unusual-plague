import type { Language } from "../i18n/types";
import { canAddItem, countItem } from "../inventory/inventory";
import { FARMER_DAY2_ID } from "../patients/chapter2Patients";
import { getPatientStatus } from "../patients/patientCases";
import { chapter2AmbientDialogues } from "./chapter2AmbientDialogues";
import { localizeConversation, type LocalizedConversation } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";

export const DAY2_LEECH_REWARD_ID = "chapter2.witch.leech";
const npc = (es: string, en: string) => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string) => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedConversation["lines"]): LocalizedConversation => ({ id, lines });

const witchInvestigation = talk("chapter2.cave.witch.investigation", [
  doctor("El agricultor del molino está enfermo. Sospecho un envenenamiento, pero necesito una muestra para comprobarlo.", "The mill farmer is ill. I suspect poisoning, but I need a sample to investigate it."),
  npc("¿Ya sabes de dónde viene?", "Do you know where it came from?"),
  doctor("No. Y prefiero no darles una sospecha a los vecinos para que la conviertan en un culpable.", "No. And I'd rather not give the neighbours a suspicion they can turn into a culprit."),
  npc("Entonces aún estamos de acuerdo en algo.", "Then there's still something we agree on."),
]);

const leechGift = [
  npc("He encontrado una sanguijuela junto al agua. La he guardado en un frasco; quizá te sirva más a ti.", "I found a leech by the water. I've kept it in a jar; perhaps it'll be more useful to you."),
  doctor("¿La has recogido sin necesitarla?", "You picked it up without needing it?"),
  npc("Tú llevas un libro entero por si acaso. Yo, un frasco.", "You carry a whole book just in case. I carry a jar."),
  doctor("Me la llevaré. Gracias.", "I'll take it. Thank you."),
];

const leechNoRoom = [
  npc("Tengo una sanguijuela guardada, pero veo que no puedes llevar más cosas.", "I've kept a leech, but I can see you can't carry anything else."),
  doctor("Haré sitio y volveré a buscarla.", "I'll make room and come back for it."),
  npc("No tiene mucha prisa. Yo tampoco.", "She's in no particular hurry. Neither am I."),
];

const witchAfter = talk("chapter2.cave.witch.afterGift", [
  npc("¿Tu nueva compañera sigue en el frasco?", "Is your new companion still in her jar?"),
  doctor("Sigo buscando respuestas sobre el agricultor.", "I'm still looking for answers about the farmer."),
  npc("Busca despacio donde haga falta. Las respuestas rápidas suelen parecerse mucho a lo que uno ya pensaba.", "Take your time where you need to. Quick answers tend to look rather like what you already thought."),
  doctor("En eso también estamos de acuerdo.", "We agree on that too."),
]);

const farmAfterExam = talk("chapter2.farm.woman.afterExam", [
  npc("¿Ha podido verlo?", "Have you been able to see him?"),
  doctor("Sí. Necesito seguir investigando antes de elegir un remedio.", "Yes. I need to investigate further before choosing a remedy."),
  npc("Llevo un rato pensando si habría debido ir antes a buscarle.", "I've been wondering whether I should have fetched you sooner."),
  doctor("Fue a buscar ayuda. No tiene que resolver usted lo que le toca averiguar a un médico.", "You went for help. You don't have to work out what a doctor needs to investigate."),
  npc("Ya. Eso se lo diría yo a otra persona sin pensarlo.", "Aye. I'd say that to someone else without a second thought."),
  doctor("Hoy puede decírselo a usted misma.", "You can say it to yourself today."),
]);

export function resolveChapter2StoryInteraction(
  interactionId: string, facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome | null {
  const examined = getPatientStatus(facts.patients, FARMER_DAY2_ID) === "examined";
  const local = (conversation: LocalizedConversation) => localizeConversation(conversation, language, subjectId);
  if (interactionId === "chapter2.farm.woman" && examined) {
    return { conversation: local(farmAfterExam), effects: [] };
  }
  if (interactionId !== "chapter2.cave.witch") return null;
  if (facts.claimedRewards?.has(DAY2_LEECH_REWARD_ID) || countItem(facts.inventory, "leech") > 0) {
    return {
      conversation: local(examined ? witchAfter : chapter2AmbientDialogues[interactionId]),
      effects: [],
    };
  }
  const room = canAddItem(facts.inventory, "leech");
  const intro = examined ? witchInvestigation : chapter2AmbientDialogues[interactionId];
  return {
    conversation: local(talk(`${intro.id}.${room ? "leech" : "noRoom"}`, [
      ...intro.lines, ...(room ? leechGift : leechNoRoom),
    ])),
    effects: room ? [
      { type: "give-item", itemId: "leech", quantity: 1 },
      { type: "claim-reward", rewardId: DAY2_LEECH_REWARD_ID },
    ] : [],
  };
}
