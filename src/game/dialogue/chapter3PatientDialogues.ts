import type { Language } from "../i18n/types";
import { getItemName } from "../items/items";
import {
  CHAPTER3_PATIENTS,
  PATH_MINER_DAY3_ID,
  STONECUTTER_DAY3_ID,
  DUSTER_DAY3_ID,
} from "../patients/chapter3Patients";
import { getPatientStatus, isTreatable } from "../patients/patientCases";
import { localizeConversation, type LocalizedConversation } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";

// DAY 3 PATIENTS (2026-11-12). ALL THE TEXT BELOW IS NEW and awaits Kilian's review.
// Each person is reached by an interactionId that Kilian gives to his instance in the
// Decorator (chapter 3): the woman with the duster, the path miner and the quarry stonecutter.
export const CHAPTER3_PATIENT_INTERACTIONS: Readonly<Record<string, string>> = {
  "chapter3.apothecaryStreet.duster": DUSTER_DAY3_ID,
  "chapter3.mountainPath.miner": PATH_MINER_DAY3_ID,
  "chapter3.quarry.stonecutter": STONECUTTER_DAY3_ID,
};

// 2026-11-13: warmth pass on the Doctor's lines (his new voice: cheerful, close, serene). New
// text, awaiting Kilian's review; the conversations keep their ids, items and missions.
const npc = (es: string, en: string) => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string) => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedConversation["lines"]): LocalizedConversation => ({ id, lines });

type PatientScript = {
  slug: string;
  exam: LocalizedConversation["lines"];
  cure: LocalizedConversation["lines"];
  after: LocalizedConversation["lines"];
  waiting: LocalizedConversation["lines"];
};

const SCRIPTS: Record<string, PatientScript> = {
  [DUSTER_DAY3_ID]: {
    slug: "duster",
    exam: [
      npc("Perdone, Doctor. Llevo toda la mañana sacudiendo el polvo y me ha pasado factura.", "Pardon me, Doctor. I've been dusting all morning and it has taken its toll."),
      npc("Subí al piso de arriba, que llevaba años cerrado. Se me quedó todo dentro. Cof, cof.", "I went up to the top floor, closed for years. It all stayed inside me. Cough, cough."),
      doctor("Respire hondo y suelte el aire despacio. Muy bien, así.", "Breathe in deeply and let it out slowly. Very good, like that."),
      npc("Me silba el pecho como el hervidor de mi madre.", "My chest whistles like my mother's kettle."),
      doctor("¿Tose por la noche?", "Do you cough at night?"),
      npc("Por la noche, por el día y mientras hablo. Perdone.", "At night, by day and while I talk. Sorry."),
      doctor("No se disculpe, no hace falta. Voy a anotar lo que oigo para contrastarlo con el Compendio.", "Don't apologise, there's no need. I'll note what I hear to compare it with the Compendium."),
    ],
    cure: [
      doctor("Infusión de menta y jarabe balsámico, recién preparados. Una cucharada antes de dormir y verá qué descanso.", "Mint infusion and balsamic syrup, freshly made. One spoonful before bed and you'll see how well you rest."),
      npc("Con tal de que pare esto, me lo tomo hasta con el polvo.", "If it makes this stop, I'll take it with the dust and all."),
      doctor("El polvo se queda fuera, se lo prometo.", "The dust stays outside, I promise."),
      npc("Qué exigente.", "How demanding."),
    ],
    after: [
      npc("He dejado el plumero apoyado en la pared. Es la primera vez que lo veo descansar.", "I've left the duster leaning on the wall. It's the first time I've seen it rest."),
      doctor("¡Que dure mucho!", "May it last!"),
    ],
    waiting: [
      npc("Cof... Sigo aquí, Doctor. Y la tos también.", "Cough... Still here, Doctor. So is the cough."),
    ],
  },
  [PATH_MINER_DAY3_ID]: {
    slug: "pathMiner",
    exam: [
      npc("Llevo semanas a base de pan duro y cecina. No me quejo, pero las encías sí.", "Weeks on hard bread and jerky. I don't complain, but my gums do."),
      doctor("Abra la boca. ¿Le sangran las encías?", "Open your mouth. Do your gums bleed?"),
      npc("Cuando muerdo. Y cuando sonrío, así que ya no sonrío.", "When I bite. And when I smile, so I've stopped smiling."),
      doctor("Esto último es una lástima. Seguro que tiene buena sonrisa.", "That last part is a pity. I'm sure you have a good smile."),
      npc("Y las heridas no cierran. Me hice un rasguño en primavera y ahí sigue.", "And wounds won't close. I scratched myself in spring and it's still there."),
      doctor("Cansancio, encías doloridas y una herida lenta. Voy a anotarlo todo, y lo arreglamos.", "Tiredness, sore gums and a slow wound. I'll note it all down, and we'll sort it out."),
    ],
    cure: [
      doctor("Bebida cítrica y un caldo de huesos, con sustancia de verdad. Le van a sentar de maravilla.", "A citrus drink and a bone broth, with real substance. They'll do you the world of good."),
      npc("Eso ya suena a comida.", "Now that sounds like food."),
      doctor("Cómalo despacito, que las encías lo agradecerán.", "Eat it slowly; your gums will thank you."),
    ],
    after: [
      npc("Me he reído esta mañana. Con dientes y todo.", "I laughed this morning. Teeth and all."),
    ],
    waiting: [
      npc("Sigo con el pan duro, Doctor. No me lo recuerde.", "Still on the hard bread, Doctor. Don't remind me."),
    ],
  },
  [STONECUTTER_DAY3_ID]: {
    slug: "stonecutter",
    exam: [
      npc("No me haga levantarme, Doctor. Ya lo intenté y el suelo ganó.", "Don't make me stand, Doctor. I tried and the ground won."),
      npc("Un bloque se soltó en el cantil y me rozó el brazo. Rozó, dice el capataz.", "A block came loose on the ledge and grazed my arm. Grazed, says the foreman."),
      doctor("Déjeme verlo, con cuidado. No lo mueva. ¿Duele al girar la muñeca?", "Let me see it, carefully. Don't move it. Does it hurt to turn your wrist?"),
      npc("Al girar, al apoyar y al pensar en girar.", "To turn, to lean, and to think about turning."),
      doctor("Está hinchado y desviado. Hay que inmovilizarlo, pero tiene arreglo.", "It's swollen and crooked. It has to be immobilised, but it can be fixed."),
      doctor("Voy a anotar los síntomas para contrastarlos con el Compendio.", "I'll note the symptoms to compare them with the Compendium."),
    ],
    cure: [
      doctor("Vendaje para inmovilizarlo y cataplasma para la hinchazón. Nada de picar piedra, ¿eh? Hoy toca mimarse.", "A bandage to immobilise it and a poultice for the swelling. No stone-cutting, all right? Today is for looking after yourself."),
      npc("¿Y mirarla?", "And looking at it?"),
      doctor("Mirar se puede, y se lo recomiendo.", "Looking is allowed, and I recommend it."),
    ],
    after: [
      npc("El capataz dice que me guardan el sitio. Yo creo que lo guardan para otro.", "The foreman says they're keeping my spot. I think they're keeping it for someone else."),
    ],
    waiting: [
      npc("Tengo el brazo quieto. El resto de mí protesta.", "My arm is still. The rest of me objects."),
    ],
  },
};

export function resolveChapter3Patient(
  interactionId: string, facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome | null {
  const id = CHAPTER3_PATIENT_INTERACTIONS[interactionId];
  if (!id) return null;
  const script = SCRIPTS[id];
  const status = getPatientStatus(facts.patients, id);
  const local = (conversation: LocalizedConversation) => localizeConversation(conversation, language, subjectId);

  if (status === "hidden" || status === "discovered") {
    return { conversation: local(talk(`chapter3.${script.slug}.exam`, script.exam)), effects: [], after: "examine-in-place", patientId: id };
  }
  if (status === "examined" && isTreatable(facts.patients, CHAPTER3_PATIENTS[id], facts.inventory)) {
    return { conversation: local(talk(`chapter3.${script.slug}.cure`, script.cure)), effects: [{ type: "treat", patientId: id }] };
  }
  if (status === "treated") return { conversation: local(talk(`chapter3.${script.slug}.after`, script.after)), effects: [] };
  const preparations = (lang: Language) => CHAPTER3_PATIENTS[id].requiredTreatments.map(t => getItemName(t.itemId, lang)).join(lang === "es" ? " y " : " and ");
  return {
    conversation: local(talk(`chapter3.${script.slug}.waiting`, [
      ...script.waiting,
      doctor(`Ya estoy preparando lo que necesita: ${preparations("es")}.`, `I'm already preparing what you need: ${preparations("en")}.`),
      doctor("Los pasos están en el Compendio.", "The steps are in the Compendium."),
    ])),
    effects: [],
  };
}
