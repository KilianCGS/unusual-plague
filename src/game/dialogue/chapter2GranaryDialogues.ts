import type { Language } from "../i18n/types";
import { countItem } from "../inventory/inventory";
import { FARMER_DAY2_ID } from "../patients/chapter2Patients";
import { getPatientStatus } from "../patients/patientCases";
import { isTreatable } from "../patients/patientCases";
import { FARMER_SAMPLE_ID, FARMER_ANALYSIS_ID, getChapter2PatientDefinitions } from "../patients/farmerInvestigation";
import { localizeConversation, type LocalizedConversation } from "./localizedConversation";
import type { StoryFacts, StoryOutcome } from "./storyInteractions";
import { doctorThought } from "./doctorThought";

const woman = (es: string, en: string) => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string) => ({ speaker: "doctor", text: { es, en } });
const heard = "chapter2.granary.carerMet";

const carerFirst: LocalizedConversation = {
  id: "chapter2.granary.carer.first",
  lines: [
    woman("Pase, Doctor. He apartado los sacos para que pueda acercarse.", "Come in, Doctor. I've moved the sacks so you can get to him."),
    doctor("¿Lleva mucho acompañándolo?", "Have you been with him long?"),
    woman("Desde que lo trajeron. En mi casa tampoco iba a estarme quieta.", "Since they brought him in. I wouldn't have sat still at home either."),
    doctor("¿Ha podido descansar?", "Has he managed to rest?"),
    woman("Cierra los ojos y pregunta si han recogido las herramientas. Luego vuelve a cerrarlos.", "He closes his eyes, asks whether the tools have been put away, then closes them again."),
    doctor("Ahora las herramientas pueden esperar.", "The tools can wait now."),
    woman("Eso le digo. Toda la vida pendiente de que no falte nada, y mire dónde ha venido a parar: entre sacos.", "That's what I tell him. A lifetime making sure everything's in its place, and look where he's ended up: among the sacks."),
    doctor("Se ha quedado a su lado. Eso tampoco es poca cosa.", "You've stayed by his side. That counts for something too."),
    woman("Bueno. Usted mírelo. Yo vigilo las herramientas, si hace falta.", "Well. You see to him. I'll keep an eye on the tools, if I must."),
  ],
};

const carerBefore: LocalizedConversation = {
  id: "chapter2.granary.carer.beforeExam",
  lines: [
    woman("El molino se oye hasta con la puerta cerrada. Hoy me parece más fuerte.", "You can hear the mill even with the door shut. It seems louder today."),
    doctor("Cuando uno espera, oye cosas que otros días no nota.", "When you're waiting, you hear things you'd miss on other days."),
    woman("Pues yo prefería no notar tanto. Acérquese a verlo, Doctor.", "I'd rather miss a few things, then. Go and see him, Doctor."),
  ],
};

const carerAfter: LocalizedConversation = {
  id: "chapter2.granary.carer.afterExam",
  lines: [
    woman("¿Ya sabe qué tiene?", "Do you know what's wrong with him?"),
    doctor("Hay señales que me preocupan. Todavía tengo que comprobar de dónde vienen.", "There are signs that concern me. I still need to establish what's behind them."),
    woman("Mi vecina ya habría dicho tres enfermedades y culpado al tiempo.", "My neighbour would have named three illnesses and blamed the weather by now."),
    doctor("Yo prefiero equivocarme menos veces.", "I'd rather be wrong fewer times."),
    woman("Entonces siga comprobando. Yo me quedo con él.", "Then keep looking into it. I'll stay with him."),
  ],
};

const farmerExam: LocalizedConversation = {
  id: "chapter2.granary.farmer.exam",
  lines: [
    doctor("Soy el Doctor. No hace falta que se incorpore.", "I'm the Doctor. You don't need to sit up."),
    woman("No pensaba hacerlo. Por una vez, la paja me ha ganado.", "I wasn't planning to. For once, the straw has got the better of me."),
    doctor("Voy a tomarle el pulso. ¿Qué es lo que más le molesta?", "I'll take your pulse. What's troubling you most?"),
    woman("El estómago. Y las piernas... como si hubiera trabajado tres días sin parar.", "My stomach. And my legs... as though I'd worked three days without stopping."),
    doctor("Tiene sudor frío. ¿Recuerda cuándo empezó a encontrarse mal?", "You're in a cold sweat. Do you remember when you started feeling unwell?"),
    woman("Ayer aún podía trabajar. Luego ya no podía ni con la cena.", "I could still work yesterday. Later, I couldn't even face my supper."),
    doctor("¿Comió o bebió algo que no acostumbre?", "Did you eat or drink anything out of the ordinary?"),
    woman("Aquí uno come lo que hay. No llevo la cuenta de cada bocado.", "You eat what's there in this place. I don't keep a tally of every mouthful."),
    doctor("¿Y en el trabajo? ¿Algo distinto entre el grano o las herramientas?", "And at work? Anything unusual among the grain or the tools?"),
    woman("No me pida que se lo ordene ahora. Tengo la cabeza como el molino.", "Don't ask me to put it all in order now. My head's turning like the mill."),
    doctor("No se fuerce. La debilidad ha aparecido deprisa y viene acompañada de sudor frío y náuseas.", "Don't strain yourself. The weakness came on quickly, together with cold sweats and nausea."),
    woman("¿Y puede saber qué me pasa?", "Can you tell what is wrong with me?"),
    doctor("Primero voy a contrastar estos signos. No quiero sacar conclusiones antes de tiempo.", "First I will compare these signs. I don't want to jump to conclusions."),
    woman("No quiero que empiecen a señalar a nadie por mi culpa.", "I don't want people pointing fingers on my account."),
    doctor("Ni yo. Necesito una muestra de sangre para continuar el análisis en la botica.", "Neither do I. I need a blood sample to continue the investigation at the apothecary."),
    woman("Haga lo que tenga que hacer. Pero no me deje a medias.", "Do what you need to do. Just see it through."),
    doctor("Volveré a verlo. Ahora descanse; el molino puede seguir sin usted un rato.", "I'll come back to see you. Rest now; the mill can manage without you for a while."),
  ],
};

const farmerWaiting: LocalizedConversation = {
  id: "chapter2.granary.farmer.waiting",
  lines: [
    woman("¿Sigue ahí el molino?", "Is the mill still there?"),
    doctor("No se ha movido.", "It hasn't gone anywhere."),
    woman("Entonces soy yo el que da vueltas.", "Then it must be me that's spinning."),
    doctor("He anotado lo que he observado. Necesito obtener una muestra antes de elegir un remedio.", "I've written down what I've observed. I need to obtain a sample before choosing a remedy."),
    woman("Por mí, anote también que esta cama pincha.", "You can also write down that this bed is prickly."),
    doctor("Eso parece menos misterioso.", "That seems rather less mysterious."),
  ],
};

const farmerWithLeech: LocalizedConversation = {
  id: "chapter2.granary.farmer.leechKnown",
  lines: [
    doctor("Llevo una sanguijuela. Podría servirme para obtener la muestra.", "I have a leech. It could help me obtain the sample."),
    woman("¿Eso también trabaja para usted?", "Does that work for you too?"),
    doctor("Por ahora, viaja conmigo.", "For now, it's travelling with me."),
    woman("Pues vigile que no se acostumbre a la buena vida.", "Then mind it doesn't get used to the easy life."),
    doctor("Ya está. La guardaré con la muestra y continuaré el análisis en la mesa de la botica.", "There. I'll keep it with the sample and continue the analysis at the apothecary's work table."),
  ],
};

const farmerSampleWaiting: LocalizedConversation = {
  id: "chapter2.granary.farmer.sampleWaiting", lines: [
    woman("¿Se ha llevado ya lo que necesitaba?", "Have you taken what you needed?"),
    doctor("La muestra está recogida. Ahora necesito examinarla en la mesa de la botica.", "The sample is collected. Now I need to examine it at the apothecary's work table."),
    woman("Vuelva cuando sepa algo. Aquí las horas se hacen largas.", "Come back when you know something. The hours feel long in here."),
  ],
};
const farmerRemedyWaiting: LocalizedConversation = {
  id: "chapter2.granary.farmer.remedyWaiting", lines: [
    doctor("El análisis está hecho. Prepararé una suspensión de carbón y una infusión medicinal.", "The analysis is done. I'll prepare a charcoal suspension and a medicinal infusion."),
    woman("Me basta con que ahora sepa por dónde seguir.", "It's enough to know you have a way forward now."),
    doctor("El minero puede ayudarme con el carbón y la granjera con las hierbas. He anotado los pasos en el Compendio.", "The miner can help with charcoal and the farm woman with herbs. I've noted the steps in the Compendium."),
  ],
};
const farmerCure: LocalizedConversation = {
  id: "chapter2.granary.farmer.cure", lines: [
    doctor("La suspensión y la infusión están listas. Vamos a atenderle.", "The suspension and infusion are ready. Let's attend to you."),
    woman("¿Y después podré volver al molino?", "And then can I go back to the mill?"),
    doctor("Después seguirá descansando. Que tengamos un tratamiento no significa que haya recuperado las fuerzas.", "Then you'll keep resting. Having a treatment doesn't mean you've regained your strength."),
    woman("Ya me imaginaba que no iba a salir ganando esa discusión.", "I thought I wasn't going to win that argument."),
    doctor("No tiene que ganar nada hoy. Deje que lo cuiden.", "You don't have to win anything today. Let people look after you."),
  ],
};
const farmerAfter: LocalizedConversation = {
  id: "chapter2.granary.farmer.after", lines: [
    woman("Han recogido las herramientas. Me lo han dicho tres veces.", "They've put away the tools. They've told me three times."),
    doctor("Entonces puede dejar de contarlas por hoy.", "Then you can stop counting them for today."),
    woman("Voy a probar. Pero no prometo dormirme sin repasarlas una vez más.", "I'll try. But I can't promise to fall asleep without going over them once more."),
  ],
};

export function resolveGranaryInteraction(
  interactionId: string, facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome | null {
  const status = getPatientStatus(facts.patients, FARMER_DAY2_ID);
  const flags = facts.claimedRewards ?? new Set<string>();
  const conversation = (text: LocalizedConversation) => localizeConversation(text, language, subjectId);
  if (interactionId === "chapter2.granary.carer") {
    const first = !facts.claimedRewards?.has(heard);
    return {
      conversation: conversation(status === "treated" ? {
        id: "chapter2.granary.carer.treated", lines: [
          woman("Se ha quedado más tranquilo. Todavía pregunta por el trabajo, pero ya no intenta levantarse.", "He's settled down. He still asks about work, but he isn't trying to get up anymore."),
          doctor("Siga acompañándolo. Necesita tiempo para recuperarse.", "Keep him company. He needs time to recover."),
          woman("Tiempo tengo. Y si hace falta le vuelvo a contar lo de las herramientas.", "I have time. And if I must, I'll tell him about the tools again."),
        ],
      } : first ? carerFirst : status === "examined" ? carerAfter : carerBefore),
      effects: [
        ...(first ? [{ type: "claim-reward" as const, rewardId: heard }] : []),
        ...(status === "hidden" ? [{ type: "advance-patient" as const, patientId: FARMER_DAY2_ID, to: "discovered" as const }] : []),
      ],
    };
  }
  if (interactionId !== "chapter2.granary.farmer") return null;
  if (status === "hidden" || status === "discovered") {
    const thought = countItem(facts.inventory, "leech") > 0
      ? doctorThought("La sanguijuela que llevo puede servirme para obtener una muestra de sangre. Después podré analizarla en la botica.", "The leech I'm carrying could help me obtain a blood sample. Then I can analyze it at the apothecary.")
      : doctorThought("Debería obtener una muestra de sangre antes de elegir un remedio. Una sanguijuela podría servirme.", "I should obtain a blood sample before choosing a remedy. A leech could help.");
    return { conversation: conversation({ ...farmerExam, lines: [...farmerExam.lines, thought] }), effects: [], after: "examine-in-place", patientId: FARMER_DAY2_ID };
  }
  if (status === "treated") return { conversation: conversation(farmerAfter), effects: [] };
  if (flags.has(FARMER_ANALYSIS_ID)) {
    const ready = isTreatable(facts.patients, getChapter2PatientDefinitions(flags)[FARMER_DAY2_ID], facts.inventory);
    return { conversation: conversation(ready ? farmerCure : farmerRemedyWaiting), effects: ready ? [{ type: "treat", patientId: FARMER_DAY2_ID }] : [] };
  }
  if (flags.has(FARMER_SAMPLE_ID)) return { conversation: conversation(farmerSampleWaiting), effects: [] };
  if (countItem(facts.inventory, "leech") > 0) {
    return { conversation: conversation(farmerWithLeech), effects: [
      { type: "take-item", itemId: "leech", quantity: 1 },
      { type: "claim-reward", rewardId: FARMER_SAMPLE_ID },
    ] };
  }
  return {
    conversation: conversation(farmerWaiting),
    effects: [],
  };
}
