import type { Language } from "../i18n/types";
import { canAddItem, countItem } from "../inventory/inventory";
import { FARMER_DAY2_ID } from "../patients/chapter2Patients";
import { getPatientStatus } from "../patients/patientCases";
import { chapter2AmbientDialogues } from "./chapter2AmbientDialogues";
import { localizeConversation, type LocalizedConversation } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";
import { resolveChapter2Patient } from "./chapter2PatientDialogues";
import { BEEKEEPER_INTERACTION_ID, FLOUR_OFFERED_ID, FLOUR_SACK_INTERACTION_ID, resolveBeekeeperHoney, resolveChapter2Supplies, resolveFlourSack } from "./chapter2Supplies";
import { doctorThought } from "./doctorThought";
import { FARMER_SAMPLE_ID } from "../patients/farmerInvestigation";

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
  npc("Estos bichejos se pirran por la sangre ajena.", "These little creatures have quite a taste for other people's blood."),
  doctor("¿La has recogido sin necesitarla?", "You picked it up without needing it?"),
  npc("Tú llevas un libro entero por si acaso. Yo, un frasco.", "You carry a whole book just in case. I carry a jar."),
  doctor("Me la llevaré. Gracias.", "I'll take it. Thank you."),
  npc("Por donde yo vivo no se dan las sanguijuelas, pero hay un arroyo con tanta menta alrededor que se huele desde el camino. Por si te hace falta.", "Leeches don't live where I do, but there's a stream with so much mint around it you can smell it from the path. In case you ever need some."),
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

// The baker tells the Doctor he may help himself to flour from her sack. It is
// said on the first conversation of Day 2 and never again (a narrative flag).
const flourOffer = [
  doctor("¿Podría llevarme algo de harina si la necesito?", "Could I take some flour if I need it?"),
  npc("Sírvase del saco del rincón, Doctor. Con la cantidad que pueda llevar bastará.", "Help yourself from the sack in the corner, Doctor. Whatever you can carry will do."),
];

export function resolveChapter2StoryInteraction(
  interactionId: string, facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome | null {
  if (interactionId === FLOUR_SACK_INTERACTION_ID) return resolveFlourSack(facts, language, subjectId);
  if (interactionId === BEEKEEPER_INTERACTION_ID) return resolveBeekeeperHoney(facts, language, subjectId);
  if (interactionId === "chapter2.bakery.baker" && !facts.claimedRewards?.has(FLOUR_OFFERED_ID)) {
    const honey = resolveChapter2Supplies(interactionId, facts, language, subjectId);
    const offer = localizeConversation(talk("chapter2.bakery.baker.flour", flourOffer), language, subjectId).lines;
    const base = honey?.conversation ?? localizeConversation(chapter2AmbientDialogues[interactionId], language, subjectId);
    return {
      conversation: { ...base, id: `${base.id}.flour`, lines: [...base.lines, ...offer] },
      effects: [...(honey?.effects ?? []), { type: "claim-reward", rewardId: FLOUR_OFFERED_ID }],
    };
  }
  const patient = resolveChapter2Patient(interactionId, facts, language, subjectId);
  if (patient) return patient;
  const supplies = resolveChapter2Supplies(interactionId, facts, language, subjectId);
  if (supplies) return supplies;
  const examined = getPatientStatus(facts.patients, FARMER_DAY2_ID) === "examined";
  const local = (conversation: LocalizedConversation) => localizeConversation(conversation, language, subjectId);
  if (interactionId === "chapter2.mine.recoveringMiner" && examined &&
    !facts.claimedRewards?.has(FARMER_SAMPLE_ID) && countItem(facts.inventory, "leech") === 0) {
    const alreadyGiven = facts.claimedRewards?.has(DAY2_LEECH_REWARD_ID);
    return { conversation: local(talk("chapter2.mine.farmerClue", [
      ...chapter2AmbientDialogues[interactionId].lines,
      ...(alreadyGiven ? [
        doctorThought("Ya conseguí una sanguijuela. Debería revisar el cofre antes de seguir buscando.", "I've already obtained a leech. I should check the chest before looking any further."),
      ] : [
        npc("Si busca a su amiga del farol, está en la cueva del fondo. Dice que allí se oye pensar.", "If you're looking for your friend with the lantern, she's in the cave at the back. Says you can hear yourself think there."),
        doctorThought("Agua tranquila y una visita de la bruja. Merece la pena preguntarle por las sanguijuelas.", "Still water and a visit from the witch. It's worth asking her about leeches."),
      ]),
    ])), effects: [] };
  }
  if (interactionId === "chapter2.farm.woman" && getPatientStatus(facts.patients, FARMER_DAY2_ID) === "treated") {
    return { conversation: local(talk("chapter2.farm.woman.farmerTreated", [
      npc("Me han dicho que ya lo ha atendido. Gracias por ir hasta allí.", "They told me you've attended to him. Thank you for going out there."),
      doctor("Ahora necesita descansar y seguir acompañado.", "Now he needs rest and someone to keep him company."),
      npc("De eso podemos encargarnos. Hasta las gallinas tendrán que esperar un poco.", "We can see to that. Even the hens will have to wait a little."),
    ])), effects: [] };
  }
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
      ...(room ? [examined
        ? doctorThought("Ya tengo cómo obtener la muestra. Debería volver al granero.", "Now I have a way to obtain the sample. I should return to the granary.")
        : doctorThought("La guardaré. Puede resultar útil, aunque todavía no sepa para qué.", "I'll keep it. It may prove useful, even if I don't know what for yet.")
      ] : []),
    ])),
    effects: room ? [
      { type: "give-item", itemId: "leech", quantity: 1 },
      { type: "claim-reward", rewardId: DAY2_LEECH_REWARD_ID },
    ] : [],
  };
}
