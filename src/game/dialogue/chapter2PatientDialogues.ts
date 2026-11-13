import type { Language } from "../i18n/types";
import { getItemName } from "../items/items";
import { CHAPTER2_PATIENTS, WOODCUTTER_DAY2_ID, BLACKSMITH_DAY2_ID } from "../patients/chapter2Patients";
import { getPatientStatus, isTreatable } from "../patients/patientCases";
import { chapter2AmbientDialogues } from "./chapter2AmbientDialogues";
import { localizeConversation, type LocalizedConversation } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";

// 2026-11-13: warmth pass on the Doctor's lines (his new voice: cheerful, close, serene). New
// text, awaiting Kilian's review; the conversations keep their ids, items and missions.
const npc = (es: string, en: string) => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string) => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedConversation["lines"]): LocalizedConversation => ({ id, lines });

const woodExam = talk("chapter2.woodcutter.exam", [
  ...chapter2AmbientDialogues["chapter2.forest.woodcutter"].lines,
  doctor("Déjeme tomarle el pulso, con calma. ¿Ha parado a comer y beber?", "Let me take your pulse, nice and easy. Have you stopped to eat and drink?"),
  npc("He bebido un poco esta mañana. La comida sigue envuelta donde la dejé.", "I had a little to drink this morning. My food's still wrapped up where I left it."),
  doctor("Se le nota débil y con sed, pero tiene arreglo. ¿El mareo empezó mientras trabajaba?", "You look weak and thirsty, but it can be fixed. Did the dizziness begin while you were working?"),
  npc("¿Cuánto rato tengo que quedarme aquí sin hacer nada?", "How long do I have to sit here doing nothing?"),
  doctor("Descanse aquí un ratito mientras reviso lo que he observado.", "Rest here a little while I go over what I've observed."),
  doctor("Voy a anotar los síntomas para contrastarlos con el Compendio. Lo averiguamos juntos.", "I'll note down the symptoms to compare them with the Compendium. We'll work it out together."),
  npc("Si pregunta, diga que estoy cuidando el tocón. No que me he rendido.", "If anyone asks, say I'm looking after the stump. Not that I've surrendered."),
]);
const smithExam = talk("chapter2.blacksmith.exam", [
  ...chapter2AmbientDialogues["chapter2.smithy.blacksmith"].lines,
  doctor("Déjeme ver esa mano, con cuidado. ¿Cuándo se hizo la herida?", "Let me see that hand, carefully. When did you get the wound?"),
  npc("Hace unos días. Era poca cosa. Luego cada golpe ha ido recordándomela.", "A few days ago. It was nothing much. Then every blow started reminding me of it."),
  doctor("Está inflamada. Seguir trabajando no le ha dado ocasión de mejorar, pero aún estamos a tiempo.", "It's swollen. Carrying on working hasn't given it a chance to improve, but we're still in time."),
  npc("Ya decía yo que el martillo sonaba distinto.", "I thought the hammer sounded different."),
  doctor("La zona está roja y cada vez duele más. Deje descansar la mano mientras reviso estos signos; no se preocupe.", "The area is red and increasingly painful. Rest your hand while I review these signs; don't worry."),
  doctor("Voy a anotar lo que he visto antes de decidir el mejor tratamiento.", "I'll note down what I've seen before deciding on the best treatment."),
  npc("Toda esa gente va a saber que estoy sentado.", "All those people will know I'm sitting down."),
  doctor("Me conformo con que siga sentado cuando vuelva. Y, si puede, sonriendo.", "I'll settle for you still being seated when I return. And, if you can manage it, smiling."),
]);
// The woodcutter's thank-you: animal fat, once. It is part of the treatment
// conversation, so the slots freed by the two preparations make room for it.
export const WOODCUTTER_FAT_REWARD_ID = "chapter2.woodcutter.fat";
const woodThanks = [
  npc("Tome esto, Doctor. Es grasa animal: me la doy en las manos después de la jornada, para que el hacha no me las agriete.", "Take this, Doctor. It's animal fat: I rub it into my hands after a day's work so the axe doesn't crack them."),
  doctor("¡Se lo agradezco mucho! Seguro que le encuentro un buen uso.", "Thank you so much! I'm sure I'll find a good use for it."),
  npc("Mejor que mis manos no se lo van a encontrar.", "Better than my hands will, that's certain."),
];
const woodCure = talk("chapter2.woodcutter.cure", [
  doctor("Aquí tiene su bebida cítrica y su infusión. Tómese su tiempo; no son una excusa para volver al hacha.", "Here's your citrus drink and your infusion. Take your time; they're no excuse to go back to the axe."),
  npc("Eso iba a preguntarle.", "I was about to ask."),
  doctor("Por eso lo he dicho primero, ja. Hoy toca descansar y comer bien.", "That's why I said it first, ha. Today is for rest and a good meal."),
  npc("Entonces tendré que desenvolver la comida. Lleva esperándome más que usted.", "Then I'll have to unwrap my lunch. It's been waiting for me longer than you have."),
]);
const smithCure = talk("chapter2.blacksmith.cure", [
  doctor("Ya tengo la cataplasma y la compresa. Déjeme atender esa mano; verá qué alivio.", "I have the poultice and the compress. Let me see to that hand; you'll feel the relief."),
  npc("Le prometo que hoy no cojo el martillo.", "I promise I won't pick up the hammer today."),
  doctor("Con la otra mano tampoco, que ya le conozco.", "Not with the other hand either; I know you."),
  npc("Se adelanta usted a todas mis buenas ideas.", "You get ahead of all my good ideas."),
  doctor("Volver a hacerse daño no era de las mejores. Déle tiempo para recuperarse, que la mano se lo agradecerá.", "Hurting yourself again wasn't one of the better ones. Give it time to recover; your hand will thank you."),
]);
const after = {
  [WOODCUTTER_DAY2_ID]: talk("chapter2.woodcutter.after", [
    npc("He contado los anillos del tocón. No pensaba quedarme tanto tiempo conociéndolo.", "I've counted the stump's rings. I didn't expect to spend so long getting to know it."),
    doctor("¿Ha comido ya? Me alegra verlo con mejor cara.", "Have you eaten yet? I'm glad to see you looking better."),
    npc("Sí. Y el hacha sigue donde la dejó. Está siendo un día muy raro.", "Yes. And the axe is still where I left it. It's been a very strange day."),
    doctor("Pues que siga así un poco más. Se lo ha ganado.", "Then let it stay that way a little longer. You've earned it."),
  ]),
  [BLACKSMITH_DAY2_ID]: talk("chapter2.blacksmith.after", [
    npc("He descubierto un ruido nuevo en el taller. El de la calle.", "I've discovered a new sound in the workshop. The street."),
    doctor("Suele oírse mejor sin martillar. La calle tiene su propia música.", "It's easier to hear without hammering. The street has its own music."),
    npc("No sé cómo trabaja la gente con tantas conversaciones alrededor.", "I don't know how people work with all those conversations around them."),
    doctor("Hoy no tiene que averiguarlo. Hoy basta con descansar.", "You don't need to find out today. Today, resting is enough."),
  ]),
};

export function resolveChapter2Patient(
  interactionId: string, facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome | null {
  const id = interactionId === "chapter2.forest.woodcutter" ? WOODCUTTER_DAY2_ID
    : interactionId === "chapter2.smithy.blacksmith" ? BLACKSMITH_DAY2_ID : null;
  if (!id) return null;
  const status = getPatientStatus(facts.patients, id);
  const local = (conversation: LocalizedConversation) => localizeConversation(conversation, language, subjectId);
  const wood = id === WOODCUTTER_DAY2_ID;
  if (status === "hidden" || status === "discovered") {
    return { conversation: local(wood ? woodExam : smithExam), effects: [], after: "examine-in-place", patientId: id };
  }
  if (status === "examined" && isTreatable(facts.patients, CHAPTER2_PATIENTS[id], facts.inventory)) {
    if (wood && !facts.claimedRewards?.has(WOODCUTTER_FAT_REWARD_ID)) {
      return {
        conversation: local(talk("chapter2.woodcutter.cure.fat", [...woodCure.lines, ...woodThanks])),
        effects: [
          { type: "treat", patientId: id },
          { type: "give-item", itemId: "animal-fat", quantity: 1 },
          { type: "claim-reward", rewardId: WOODCUTTER_FAT_REWARD_ID },
        ],
      };
    }
    return { conversation: local(wood ? woodCure : smithCure), effects: [{ type: "treat", patientId: id }] };
  }
  if (status === "treated") return { conversation: local(after[id]), effects: [] };
  const preparations = (lang: Language) => CHAPTER2_PATIENTS[id].requiredTreatments.map(t => getItemName(t.itemId, lang)).join(lang === "es" ? " y " : " and ");
  return {
    conversation: local(talk(`chapter2.${wood ? "woodcutter" : "blacksmith"}.waiting`, [
      npc(wood ? "El hacha sigue ahí. Yo también." : "Estoy dejando la mano quieta. El resto de mí no lleva tan bien la espera.", wood ? "The axe is still there. So am I." : "I'm keeping my hand still. The rest of me isn't quite as good at waiting."),
      doctor(`Ya estoy preparando lo que necesita: ${preparations("es")}.`, `I'm already preparing what you need: ${preparations("en")}.`),
      doctor("Los pasos están en el Compendio, y no tardo. No vuelva al trabajo mientras tanto.", "The steps are in the Compendium, and I won't be long. Don't return to work in the meantime."),
    ])), effects: [],
  };
}
