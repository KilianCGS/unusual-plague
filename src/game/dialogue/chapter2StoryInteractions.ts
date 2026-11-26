import type { Language } from "../i18n/types";
import { addItem, canAddItem, countItem } from "../inventory/inventory";
import { FARMER_DAY2_ID } from "../patients/chapter2Patients";
import { getPatientStatus } from "../patients/patientCases";
import { chapter2AmbientDialogues } from "./chapter2AmbientDialogues";
import { localizeConversation, type LocalizedConversation } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";
import { resolveChapter2Patient } from "./chapter2PatientDialogues";
import { BEEKEEPER_INTERACTION_ID, FLOUR_OFFERED_ID, FLOUR_SACK_INTERACTION_ID, resolveBeekeeperHoney, resolveChapter2Supplies, resolveFlourSack } from "./chapter2Supplies";
import { doctorThought } from "./doctorThought";
import { FARMER_SAMPLE_ID } from "../patients/farmerInvestigation";

// 2026-11-13: voice pass: the Witch is warm with the Doctor and sometimes sarcastic; the Doctor is
// cheerful, close and serene. New text, awaiting Kilian's review; the story beats are unchanged.
export const DAY2_LEECH_REWARD_ID = "chapter2.witch.leech";
const npc = (es: string, en: string) => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string) => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedConversation["lines"]): LocalizedConversation => ({ id, lines });

const witchInvestigation = talk("chapter2.cave.witch.investigation", [
  doctor("Me alegra encontrarte. El agricultor del molino está enfermo. Sospecho un envenenamiento, pero necesito una muestra para comprobarlo.", "Good to find you. The mill farmer is ill. I suspect poisoning, but I need a sample to investigate it."),
  npc("¿Ya sabes de dónde viene?", "Do you know where it came from?"),
  doctor("No. Y prefiero no darles una sospecha a los vecinos para que la conviertan en un culpable.", "No. And I'd rather not give the neighbours a suspicion they can turn into a culprit."),
  npc("Entonces aún estamos de acuerdo en algo. Menos mal.", "Then there's still something we agree on. Thank goodness."),
]);

const leechGift = [
  npc("He encontrado una sanguijuela junto al agua. La he guardado en un frasco; quizá te sirva más a ti.", "I found a leech by the water. I've kept it in a jar; perhaps it'll be more useful to you."),
  npc("Estos bichejos se pirran por la sangre ajena.", "These little creatures have quite a taste for other people's blood."),
  doctor("¿La has recogido sin necesitarla? Qué detalle.", "You picked it up without needing it? How thoughtful."),
  npc("Tú llevas un libro entero por si acaso. Yo, un frasco.", "You carry a whole book just in case. I carry a jar."),
  doctor("¡Me la llevo, con mucho gusto! Gracias.", "I'll take her, gladly! Thank you."),
  npc("Por donde yo vivo no se dan las sanguijuelas, pero hay un arroyo con tanta menta alrededor que se huele desde el camino. Por si te hace falta.", "Leeches don't live where I do, but there's a stream with so much mint around it you can smell it from the path. In case you ever need some."),
];

const leechNoRoom = [
  npc("Tengo una sanguijuela guardada, pero veo que no puedes llevar más cosas.", "I've kept a leech, but I can see you can't carry anything else."),
  doctor("Hago sitio y vuelvo a por ella enseguida.", "I'll make room and come right back for her."),
  npc("No tiene mucha prisa. Yo tampoco.", "She's in no particular hurry. Neither am I."),
];

const witchAfter = talk("chapter2.cave.witch.afterGift", [
  npc("¿Tu nueva compañera sigue en el frasco?", "Is your new companion still in her jar?"),
  doctor("Sigo buscando respuestas sobre el agricultor, con calma.", "I'm still looking for answers about the farmer, calmly."),
  npc("Busca despacio donde haga falta. Las respuestas rápidas suelen parecerse mucho a lo que uno ya pensaba.", "Take your time where you need to. Quick answers tend to look rather like what you already thought."),
  doctor("En eso también estamos de acuerdo, ¡qué casualidad!", "We agree on that too, what a coincidence!"),
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

// 2026-11-27 (Kilian): in that same first conversation she puts a flour and a sugar in his hands (the sugar was a
// second visit before); the sack stays there for more flour. Only if both fit; otherwise the old offer and the sugar
// later. New text, awaiting Kilian's review.
const flourAndSugarGift = [
  doctor("¿Podría llevarme algo de harina si la necesito?", "Could I take some flour if I need it?"),
  npc("Tome, Doctor: harina y un puñado de azúcar del obrador. Con lo de ayer le debo algo más que palabras.", "Here, Doctor: some flour and a handful of sugar from the bakery. After yesterday I owe you more than words."),
  npc("Si le hace falta más harina, sírvase del saco del rincón.", "If you need more flour, help yourself from the sack in the corner."),
  doctor("No hacía falta, pero se lo agradezco de verdad.", "You didn't have to, but I truly thank you."),
];

// 2026-11-16 (Kilian): the seamstress of the apothecary street is the wife of the tavern man the Doctor
// helped on Day 1. She thanks him just for talking and gives him a piece of clean cloth (2026-11-25, Kilian: the
// backpack's extra slot is gone, the Doctor's case has a fixed 15 places). It waits if the cloth does not fit.
// The reward id keeps its old name so saves and tests that know it still work. New text, awaiting Kilian's review.
export const SEAMSTRESS_INTERACTION_ID = "chapter2.apothecaryStreet.seamstress";
export const SEAMSTRESS_BACKPACK_ID = "chapter2.seamstress.backpack";
const backpackGift = talk("chapter2.apothecaryStreet.seamstress.backpack", [
  npc("¡Doctor! Usted es el que ayudó a mi marido en la taberna. Dice que ya no le duele la barriga, y que el sermón le dolió más.", "Doctor! You're the one who helped my husband at the tavern. He says his stomach doesn't hurt any more, and that the scolding hurt worse."),
  doctor("Entonces se curó del todo. Con el sermón no pude hacer nada.", "Then he's fully cured. I couldn't do anything about the scolding."),
  npc("Gracias de verdad, Doctor. Tome, un trozo de tela limpia de mis retales. A usted seguro que le hace más falta que a mí.", "Thank you truly, Doctor. Here, a piece of clean cloth from my scraps. I'm sure you need it more than I do."),
  doctor("Es justo lo que andaba buscando. Se lo agradezco mucho.", "It's just what I was looking for. Thank you very much."),
  npc("Agradézcaselo a mi marido: sin su barriga no habría tela de sobra.", "Thank my husband: without his stomach there'd be no spare cloth."),
]);

// 2026-11-16 (Kilian): the baker gives ONE sugar, as a thank-you, in the first conversation of Day 2
// after the flour offer (it is her own flag, separate from the Day 1 salt). It waits if it does not fit.
// New text, awaiting Kilian's review.
export const BAKER_SUGAR_ID = "chapter2.bakery.baker.sugar";
const BAKER_INTERACTION_ID = "chapter2.bakery.baker";
const sugarGift = talk("chapter2.bakery.baker.sugar", [
  npc("Espere, Doctor. Con lo de ayer le debo algo más que palabras: un puñado de azúcar del obrador.", "Wait, Doctor. After yesterday I owe you more than words: a handful of sugar from the bakery."),
  doctor("No hacía falta. Pero la acepto, que el azúcar nunca estorba.", "You didn't have to. But I'll take it, sugar never gets in the way."),
  npc("Es poca. Lo bueno, si es poco, se aprovecha mejor.", "It's not much. What's good, when there's little of it, gets better use."),
]);

export function resolveChapter2StoryInteraction(
  interactionId: string, facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome | null {
  if (interactionId === FLOUR_SACK_INTERACTION_ID) return resolveFlourSack(facts, language, subjectId);
  if (interactionId === BEEKEEPER_INTERACTION_ID) return resolveBeekeeperHoney(facts, language, subjectId);
  if (interactionId === "chapter2.bakery.baker" && !facts.claimedRewards?.has(FLOUR_OFFERED_ID)) {
    const honey = resolveChapter2Supplies(interactionId, facts, language, subjectId);
    // room for both, after what the honey of the same conversation brings (the effects apply all or nothing)
    let afterHoney = facts.inventory;
    for (const effect of honey?.effects ?? []) {
      if (effect.type === "give-item") afterHoney = addItem(afterHoney, effect.itemId, effect.quantity) ?? afterHoney;
    }
    const withFlour = addItem(afterHoney, "flour", 1);
    const bothFit = !facts.claimedRewards?.has(BAKER_SUGAR_ID) && withFlour !== null && addItem(withFlour, "sugar", 1) !== null;
    const offer = localizeConversation(
      talk(bothFit ? "chapter2.bakery.baker.flourAndSugar" : "chapter2.bakery.baker.flour", bothFit ? flourAndSugarGift : flourOffer),
      language,
      subjectId,
    ).lines;
    const base = honey?.conversation ?? localizeConversation(chapter2AmbientDialogues[interactionId], language, subjectId);
    return {
      conversation: { ...base, id: `${base.id}.flour`, lines: [...base.lines, ...offer] },
      effects: [
        ...(honey?.effects ?? []),
        ...(bothFit
          ? [
              { type: "give-item" as const, itemId: "flour", quantity: 1 },
              { type: "give-item" as const, itemId: "sugar", quantity: 1 },
              { type: "claim-reward" as const, rewardId: BAKER_SUGAR_ID },
            ]
          : []),
        { type: "claim-reward", rewardId: FLOUR_OFFERED_ID },
      ],
    };
  }
  if (
    interactionId === SEAMSTRESS_INTERACTION_ID &&
    !facts.claimedRewards?.has(SEAMSTRESS_BACKPACK_ID) &&
    canAddItem(facts.inventory, "cloth")
  ) {
    return {
      conversation: localizeConversation(backpackGift, language, subjectId),
      effects: [{ type: "give-item", itemId: "cloth", quantity: 1 }, { type: "claim-reward", rewardId: SEAMSTRESS_BACKPACK_ID }],
    };
  }
  if (
    interactionId === BAKER_INTERACTION_ID &&
    facts.claimedRewards?.has(FLOUR_OFFERED_ID) &&
    !facts.claimedRewards.has(BAKER_SUGAR_ID) &&
    canAddItem(facts.inventory, "sugar")
  ) {
    return {
      conversation: localizeConversation(sugarGift, language, subjectId),
      effects: [{ type: "give-item", itemId: "sugar", quantity: 1 }, { type: "claim-reward", rewardId: BAKER_SUGAR_ID }],
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
    // 2026-11-27 (Kilian): the leech is handed over when she has finished talking
    effectsAtEnd: room,
  };
}
