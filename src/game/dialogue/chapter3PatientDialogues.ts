import type { Language } from "../i18n/types";
import { getItemName } from "../items/items";
import {
  CHAPTER3_PATIENTS,
  PATH_MINER_DAY3_ID,
  STONECUTTER_DAY3_ID,
  DUSTER_DAY3_ID,
  INSOMNIAC_DAY3_ID,
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
  "chapter3.tavernStreet.elder": INSOMNIAC_DAY3_ID,
};

// 2026-11-20: richer exams (a clue about what the body is saying), cures that explain why, and a subtle seed of what
// comes on Day 4 in the 'after' lines (silence, a light, a hum): none of it names the artifact. New text, awaiting review.
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
      npc("Subí al piso de arriba, que llevaba años cerrado. Mi tía lo dejó así cuando se fue, con las sábanas sobre los muebles como fantasmas. Cof, cof.", "I went up to the top floor, closed for years. My aunt left it that way when she went, with sheets over the furniture like ghosts. Cough, cough."),
      doctor("Respire hondo y suelte el aire despacio. Muy bien, así.", "Breathe in deeply and let it out slowly. Very good, like that."),
      npc("Me silba el pecho como el hervidor de mi madre. Lo oigo yo y lo oye el gato, que se ha mudado a la azotea.", "My chest whistles like my mother's kettle. I hear it, and so does the cat, who has moved to the roof."),
      doctor("¿Tose por la noche?", "Do you cough at night?"),
      npc("Por la noche, por el día y mientras hablo. Y se me corta el aire al subir la escalera: ayer paré tres veces en doce peldaños.", "At night, by day and while I talk. And I run out of breath on the stairs: yesterday I stopped three times in twelve steps."),
      doctor("Eso es una pista buena. Cuando falta el aire al esfuerzo y silba al respirar, el pecho está cerrado por dentro, como una puerta hinchada por la humedad.", "That's a good clue. When breath runs short with effort and whistles on the way, the chest is closed from the inside, like a door swollen by damp."),
      npc("Qué cosas dice usted. ¿Y se arregla una puerta hinchada?", "The things you say. And can a swollen door be fixed?"),
      doctor("Con paciencia y algo que la abra. Voy a anotar lo que oigo para contrastarlo con el Compendio.", "With patience and something to open it. I'll note what I hear to compare it with the Compendium."),
    ],
    cure: [
      doctor("Infusión de menta y jarabe balsámico, recién preparados. La menta abre el pecho y el jarabe lo suaviza. Una cucharada antes de dormir y verá qué descanso.", "Mint infusion and balsamic syrup, freshly made. The mint opens the chest and the syrup soothes it. One spoonful before bed and you'll see how well you rest."),
      npc("Con tal de que pare esto, me lo tomo hasta con el polvo.", "If it makes this stop, I'll take it with the dust and all."),
      doctor("El polvo se queda fuera, se lo prometo. Y abra la ventana del piso de arriba un rato cada mañana: las casas también tosen.", "The dust stays outside, I promise. And open the top floor's window a while each morning: houses cough too."),
      npc("Qué exigente. Y qué razón tiene.", "How demanding. And how right you are."),
    ],
    after: [
      npc("He dejado el plumero apoyado en la pared. Es la primera vez que lo veo descansar.", "I've left the duster leaning on the wall. It's the first time I've seen it rest."),
      doctor("¡Que dure mucho!", "May it last!"),
      npc("Lo que me inquieta ahora es el silencio: desde que respiro mejor oigo lo callada que está la calle. Antes la gente charlaba en las puertas.", "What bothers me now is the quiet: since I breathe better I notice how silent the street is. People used to chat in the doorways."),
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
      npc("Y las heridas no cierran. Me hice un rasguño en primavera y ahí sigue, como un huésped que no se quiere ir.", "And wounds won't close. I scratched myself in spring and it's still there, like a guest who won't leave."),
      npc("Mi mujer me dice que coma otra cosa. Pero en el filón se come lo que se carga, y se carga lo que no se estropea.", "My wife tells me to eat something else. But in the seam you eat what you carry, and you carry what doesn't spoil."),
      doctor("Entonces el problema no es lo que come, sino lo que le falta: algo fresco, algo que ha crecido al sol. El cuerpo lo pide con las encías y con las heridas que no cierran.", "Then the problem isn't what you eat but what you lack: something fresh, something that grew in the sun. The body asks for it with the gums and with the wounds that won't close."),
      npc("¿Y eso lo dice el libro?", "And does the book say that?"),
      doctor("El libro me ayudará a confirmarlo. Cansancio, encías doloridas y una herida lenta: voy a anotarlo todo, y lo arreglamos.", "The book will help me confirm it. Tiredness, sore gums and a slow wound: I'll note it all down, and we'll sort it out."),
    ],
    cure: [
      doctor("Bebida cítrica y un caldo de huesos, con sustancia de verdad. La fruta le devuelve lo que le falta y el caldo le pone fuerza. Le van a sentar de maravilla.", "A citrus drink and a bone broth, with real substance. The fruit gives back what you lack and the broth puts strength in you. They'll do you the world of good."),
      npc("Eso ya suena a comida.", "Now that sounds like food."),
      doctor("Cómalo despacito, que las encías lo agradecerán. Y a la próxima bajada, lleve una naranja en el zurrón.", "Eat it slowly; your gums will thank you. And next time you go down, take an orange in your satchel."),
      npc("Una naranja entre la cecina. Mi mujer se va a reír.", "An orange among the jerky. My wife will laugh."),
    ],
    after: [
      npc("Me he reído esta mañana. Con dientes y todo.", "I laughed this morning. Teeth and all."),
      npc("Los de la cantera dicen que han oído un zumbido hondo, de noche. No es el filón. Yo no oigo nada, pero tampoco duermo muy bien.", "The quarry men say they've heard a deep hum at night. It isn't the seam. I hear nothing, but I don't sleep very well either."),
    ],
    waiting: [
      npc("Sigo con el pan duro, Doctor. No me lo recuerde.", "Still on the hard bread, Doctor. Don't remind me."),
    ],
  },
  [STONECUTTER_DAY3_ID]: {
    slug: "stonecutter",
    exam: [
      npc("No me haga levantarme, Doctor. Ya lo intenté y el suelo ganó.", "Don't make me stand, Doctor. I tried and the ground won."),
      npc("Un bloque se soltó en el cantil y me rozó el brazo. Rozó, dice el capataz. Yo digo que me besó con ganas.", "A block came loose on the ledge and grazed my arm. Grazed, says the foreman. I say it kissed me with feeling."),
      doctor("Déjeme verlo, con cuidado. No lo mueva. ¿Duele al girar la muñeca?", "Let me see it, carefully. Don't move it. Does it hurt to turn your wrist?"),
      npc("Al girar, al apoyar y al pensar en girar.", "To turn, to lean, and to think about turning."),
      doctor("Está hinchado, de otro color y con la forma cambiada. Eso no es un roce: el hueso se ha movido.", "It's swollen, discoloured and the wrong shape. That's not a graze: the bone has moved."),
      npc("¿Se puede arreglar? Mañana tengo que picar, que el bloque no se parte solo.", "Can it be fixed? Tomorrow I have to cut; the block won't split itself."),
      doctor("Tiene arreglo, pero no mañana. Primero hay que inmovilizarlo, y después dejar que el hueso vuelva a unirse. A la fuerza no se suelda.", "It can be fixed, but not tomorrow. First it has to be immobilised, and then the bone must be left to knit. It won't mend by force."),
      doctor("Voy a anotar los síntomas para contrastarlos con el Compendio.", "I'll note the symptoms to compare them with the Compendium."),
    ],
    cure: [
      doctor("Vendaje para inmovilizarlo y cataplasma para la hinchazón. El vendaje hace de hueso mientras el hueso se cura. Nada de picar piedra, ¿eh? Hoy toca mimarse.", "A bandage to immobilise it and a poultice for the swelling. The bandage acts as the bone while the bone heals. No stone-cutting, all right? Today is for looking after yourself."),
      npc("¿Y mirarla?", "And looking at it?"),
      doctor("Mirar se puede, y se lo recomiendo.", "Looking is allowed, and I recommend it."),
      npc("Entonces miraré mucho. Desde aquí se ve toda la cantera.", "Then I'll look a lot. From here you can see the whole quarry."),
    ],
    after: [
      npc("El capataz dice que me guardan el sitio. Yo creo que lo guardan para otro.", "The foreman says they're keeping my spot. I think they're keeping it for someone else."),
      npc("Anoche, mirando, vi una luz rara pasar por encima del cantil. Pensé que era una estrella que se caía. No hizo ruido hasta mucho después.", "Last night, looking, I saw a strange light pass over the ledge. I thought it was a falling star. It made no sound until much later."),
    ],
    waiting: [
      npc("Tengo el brazo quieto. El resto de mí protesta.", "My arm is still. The rest of me objects."),
    ],
  },
  // 2026-11-18 (Kilian chose this case): the old man with the jug, who does not sleep. NEW text, awaiting review.
  [INSOMNIAC_DAY3_ID]: {
    slug: "insomniac",
    exam: [
      npc("Buenas, doctor. Perdone si bostezo en su cara: llevo cuatro noches mirando el techo.", "Good day, doctor. Forgive me if I yawn in your face: four nights now I've been staring at the ceiling."),
      doctor("¿Y de día? ¿Se queda dormido en cualquier sitio?", "And by day? Do you fall asleep anywhere?"),
      npc("Peor: de día estoy despierto y de mal humor. Ayer le grité a una gallina.", "Worse: by day I'm awake and in a bad mood. Yesterday I shouted at a hen."),
      doctor("Ojeras, irritabilidad, cansancio que no se quita... ¿Le duele la cabeza?", "Dark circles, irritability, a tiredness that won't go... Does your head hurt?"),
      npc("Como si llevara el sombrero de otro. Y me paso la noche dando vueltas: me acuesto cansado y en cuanto cierro los ojos, se me enciende la cabeza.", "As if I were wearing somebody else's hat. And I spend the night turning over: I lie down tired and the moment I close my eyes, my head lights up."),
      npc("Antes me dormía en la silla. Ahora hasta el jarro me parece ruidoso.", "I used to doze off in my chair. Now even the jug seems noisy."),
      doctor("Un cuerpo cansado que no duerme suele tener la cabeza ocupada. ¿Hay algo que le dé vueltas por dentro, o algo fuera que le robe la quietud?", "A tired body that doesn't sleep usually has a busy head. Is there something turning inside you, or something outside that steals your stillness?"),
      npc("Dentro, nada. Fuera... mi vecino de enfrente deja su ventana encendida toda la noche con una luz azulada. Yo no le pregunto: bastante tengo con lo mío.", "Inside, nothing. Outside... my neighbour across the way leaves his window lit all night with a bluish glow. I don't ask him: I have enough of my own."),
      doctor("Lo anoto todo para contrastarlo con el Compendio. Lo que no se pregunta, a veces es lo que más se necesita saber.", "I'll note it all to compare with the Compendium. What isn't asked is sometimes what most needs knowing."),
    ],
    cure: [
      doctor("Infusión de menta y leche con miel, tibias, antes de acostarse. La menta serena y la leche con miel arrulla. Y nada de contar gallinas.", "Mint infusion and milk with honey, warm, before bed. The mint calms and the milk with honey lulls. And no counting hens."),
      npc("¿Contar ovejas no vale?", "Doesn't counting sheep count?"),
      doctor("Las ovejas sí. Las gallinas despiertan.", "Sheep do. Hens wake you up."),
      npc("Y su receta tiene otro truco, ¿no? Dormir también es soltar lo que uno agarra.", "And your recipe has another trick, hasn't it? Sleeping is also letting go of what you hold."),
      doctor("Veo que me adivina el pensamiento, y eso ya es descansar un poco.", "I see you guess my thoughts, and that's already a little rest."),
    ],
    after: [
      npc("Anoche dormí de un tirón. Hasta soñé con la gallina, y me disculpé.", "Last night I slept straight through. I even dreamed of the hen, and apologised."),
      npc("Lo raro es que, al despertar, la luz azul de enfrente seguía encendida. Y mi vecino, en la ventana, igual de quieto.", "The odd thing is that when I woke, the blue light across the way was still on. And my neighbour, in the window, just as still."),
    ],
    waiting: [
      npc("Sigo sin pegar ojo, doctor. El techo y yo ya nos conocemos demasiado.", "Still not a wink, doctor. The ceiling and I know each other far too well by now."),
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
