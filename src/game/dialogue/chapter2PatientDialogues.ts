import type { Language } from "../i18n/types";
import { getItemName } from "../items/items";
import { CHAPTER2_PATIENTS, WOODCUTTER_DAY2_ID, BLACKSMITH_DAY2_ID } from "../patients/chapter2Patients";
import { getPatientStatus, isTreatable } from "../patients/patientCases";
import { chapter2AmbientDialogues } from "./chapter2AmbientDialogues";
import { localizeConversation, type LocalizedConversation } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";

const npc = (es: string, en: string) => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string) => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedConversation["lines"]): LocalizedConversation => ({ id, lines });

const woodExam = talk("chapter2.woodcutter.exam", [
  ...chapter2AmbientDialogues["chapter2.forest.woodcutter"].lines,
  doctor("Déjeme tomarle el pulso. ¿Ha parado a comer y beber?", "Let me take your pulse. Have you stopped to eat and drink?"),
  npc("He bebido un poco esta mañana. La comida sigue envuelta donde la dejé.", "I had a little to drink this morning. My food's still wrapped up where I left it."),
  doctor("Está débil y tiene sed. ¿El mareo empezó mientras trabajaba?", "You're weak and thirsty. Did the dizziness begin while you were working?"),
  npc("¿Cuánto rato tengo que quedarme aquí sin hacer nada?", "How long do I have to sit here doing nothing?"),
  doctor("Descanse aquí mientras reviso lo que he observado.", "Rest here while I review what I have observed."),
  doctor("Anotaré los síntomas para poder contrastarlos con el Compendio.", "I'll record the symptoms so I can compare them with the Compendium."),
  npc("Si pregunta, diga que estoy cuidando el tocón. No que me he rendido.", "If anyone asks, say I'm looking after the stump. Not that I've surrendered."),
]);
const smithExam = talk("chapter2.blacksmith.exam", [
  ...chapter2AmbientDialogues["chapter2.smithy.blacksmith"].lines,
  doctor("Déjeme ver la mano. ¿Cuándo se hizo esta herida?", "Let me see your hand. When did you get this wound?"),
  npc("Hace unos días. Era poca cosa. Luego cada golpe ha ido recordándomela.", "A few days ago. It was nothing much. Then every blow started reminding me of it."),
  doctor("Está inflamada. Seguir trabajando no le ha dado ocasión de mejorar.", "It's swollen. Continuing to work hasn't given it a chance to improve."),
  npc("Ya decía yo que el martillo sonaba distinto.", "I thought the hammer sounded different."),
  doctor("La zona está roja y cada vez duele más. Deje descansar la mano mientras reviso estos signos.", "The area is red and increasingly painful. Rest your hand while I review these signs."),
  doctor("Voy a anotar lo que he visto antes de decidir el tratamiento.", "I'll record what I have seen before deciding on treatment."),
  npc("Toda esa gente va a saber que estoy sentado.", "All those people will know I'm sitting down."),
  doctor("Me conformo con que siga sentado cuando vuelva.", "I'll settle for you still being seated when I return."),
]);
const woodCure = talk("chapter2.woodcutter.cure", [
  doctor("La bebida cítrica y la infusión. Tómese su tiempo; no son una excusa para volver al hacha.", "Your citrus drink and infusion. Take your time; they aren't an excuse to pick up the axe again."),
  npc("Eso iba a preguntarle.", "I was about to ask."),
  doctor("Por eso lo he dicho primero. Hoy toca descansar y comer.", "That's why I said it first. Today is for rest and food."),
  npc("Entonces tendré que desenvolver la comida. Lleva esperándome más que usted.", "Then I'll have to unwrap my lunch. It's been waiting for me longer than you have."),
]);
const smithCure = talk("chapter2.blacksmith.cure", [
  doctor("Ya tengo la cataplasma y la compresa. Déjeme atender esa mano.", "I have the poultice and compress. Let me attend to that hand."),
  npc("Le prometo que hoy no cojo el martillo.", "I promise I won't pick up the hammer today."),
  doctor("Con la otra mano tampoco.", "Not with the other hand either."),
  npc("Se adelanta usted a todas mis buenas ideas.", "You get ahead of all my good ideas."),
  doctor("Volver a hacerse daño no era de las mejores. Déle tiempo para recuperarse.", "Hurting yourself again wasn't one of the better ones. Give it time to recover."),
]);
const after = {
  [WOODCUTTER_DAY2_ID]: talk("chapter2.woodcutter.after", [
    npc("He contado los anillos del tocón. No pensaba quedarme tanto tiempo conociéndolo.", "I've counted the stump's rings. I didn't expect to spend so long getting to know it."),
    doctor("¿Ha comido ya?", "Have you eaten yet?"),
    npc("Sí. Y el hacha sigue donde la dejó. Está siendo un día muy raro.", "Yes. And the axe is still where I left it. It's been a very strange day."),
    doctor("Pues que siga así un poco más.", "Then let it stay that way a little longer."),
  ]),
  [BLACKSMITH_DAY2_ID]: talk("chapter2.blacksmith.after", [
    npc("He descubierto un ruido nuevo en el taller. El de la calle.", "I've discovered a new sound in the workshop. The street."),
    doctor("Suele oírse mejor sin martillar.", "It's easier to hear when you aren't hammering."),
    npc("No sé cómo trabaja la gente con tantas conversaciones alrededor.", "I don't know how people work with all those conversations around them."),
    doctor("Hoy no tiene que averiguarlo.", "You don't need to find out today."),
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
    return { conversation: local(wood ? woodCure : smithCure), effects: [{ type: "treat", patientId: id }] };
  }
  if (status === "treated") return { conversation: local(after[id]), effects: [] };
  const preparations = (lang: Language) => CHAPTER2_PATIENTS[id].requiredTreatments.map(t => getItemName(t.itemId, lang)).join(lang === "es" ? " y " : " and ");
  return {
    conversation: local(talk(`chapter2.${wood ? "woodcutter" : "blacksmith"}.waiting`, [
      npc(wood ? "El hacha sigue ahí. Yo también." : "Estoy dejando la mano quieta. El resto de mí no lleva tan bien la espera.", wood ? "The axe is still there. So am I." : "I'm keeping my hand still. The rest of me isn't quite as good at waiting."),
      doctor(`Estoy preparando lo que necesita: ${preparations("es")}.`, `I'm preparing what you need: ${preparations("en")}.`),
      doctor("Los pasos están en el Compendio. No vuelva al trabajo mientras tanto.", "The steps are in the Compendium. Don't return to work in the meantime."),
    ])), effects: [],
  };
}
