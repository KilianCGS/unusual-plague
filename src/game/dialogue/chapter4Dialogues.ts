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
// 2026-11-19 (Kilian): first she waits OUTSIDE the cottage (facing us, conjuring), says the feather and her spell have
// kept the Doctor from the artifacts, asks him to come in, and disappears (a fade). The last conversation is inside.
export const WITCH_OUTSIDE_INTERACTION_ID = "chapter4.cottage.witchOutside";
export const WITCH_OUTSIDE_ID = "chapter4.witch.outside";
export const WITCH_OUTSIDE_INSTANCE_ID = "forest-cottage-witch-conjuring-front-01";
export const DAY4_COMPLETED_ID = "chapter4.day4.completed";
export const ARTIFACT_PERSON_PREFIX = "chapter4.artifact.";

const witch = (es: string, en: string): LocalizedLine => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string): LocalizedLine => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedLine[]): LocalizedConversation => ({ id: `chapter4.${id}`, lines });

// 2026-11-19 (Kilian): Day 4 begins with the Doctor waking up puzzled by a light and a noise, and every talk with a
// villager goes the same way: he greets them, gets NO answer, sees them absorbed in the artifact and "diagnoses" them,
// strangely and surprised. NEW TEXT (ES/EN), awaiting Kilian's review.
export const DAY4_WAKE_ID = "chapter4.day4.wake";
export const day4Wake: LocalizedConversation = talk("day4.wake", [
  doctorThought("Me despierto sin saber por qué. Hay una luz azulada en la ventana y un zumbido que no sé de dónde viene.", "I wake without knowing why. There's a bluish light at the window and a hum I can't place."),
  doctorThought("No es el viento, ni la luna, ni las velas. Es otra cosa. Y la noche está demasiado callada para tener un ruido así.", "It isn't the wind, the moon or the candles. It's something else. And the night is too quiet to have a sound like that."),
  doctorThought("Cojo la bolsa y salgo a ver qué ocurre ahí fuera.", "I take my bag and go out to see what's happening."),
]);

// The greeting he tries and the silence he gets back, picked by who it is (always the same for the same person).
const GREETINGS: LocalizedLine[] = [
  doctor("Buenas noches. ¿Se encuentra bien?", "Good evening. Are you all right?"),
  doctor("Perdone la hora. ¿Puedo ayudarle en algo?", "Forgive the hour. Can I help you with anything?"),
  doctor("¿Me oye? Soy el Doctor.", "Can you hear me? It's the Doctor."),
  doctor("Disculpe... ¿qué ha pasado aquí?", "Excuse me... what has happened here?"),
];
const SILENCES: LocalizedLine[] = [
  doctorThought("No responde. Ni siquiera parpadea.", "No answer. Not even a blink."),
  doctorThought("Nada. Es como si yo no estuviera.", "Nothing. As if I weren't here."),
  doctorThought("Ni una palabra, ni un gesto. Solo esa luz en sus ojos.", "Not a word, not a gesture. Only that light in their eyes."),
  doctorThought("Me mira sin verme. Está en otra parte.", "They look at me without seeing me. They're somewhere else."),
];

function absorbed(interactionId: string, own: LocalizedLine[]): LocalizedLine[] {
  let hash = 0;
  for (const char of interactionId) hash = (hash * 31 + char.charCodeAt(0)) % 997;
  return [GREETINGS[hash % GREETINGS.length], SILENCES[(hash >> 1) % SILENCES.length], ...own];
}

// What the Doctor thinks when someone absorbed in an artifact does not look up.
export const ARTIFACT_THOUGHTS: LocalizedLine[] = [
  doctorThought("No ha levantado la vista. Ni siquiera para saludar.", "She hasn't looked up. Not even to say hello."),
  doctorThought("Sonríe a una luz que no es para mí.", "Smiling at a light that isn't meant for me."),
  doctorThought("Le hablo y responde a otra cosa.", "I speak to him and he answers something else."),
  doctorThought("Está aquí, pero no está.", "He's here, but he isn't."),
];

// 2026-11-17 (Kilian: Day 4 is ambient, people and words only): each pose with an artifact has its OWN two thoughts of
// the Doctor, built on what that person used to do (the contrast with their routine), never naming the object.
// NEW text, awaiting Kilian's review. The key is the part after "chapter4.artifact." (see ARTIFACT_SLUGS in
// compositions/artifacts.interactions.ts); a person without an entry here gets one of the generic thoughts above.
export const ARTIFACT_PERSON_THOUGHTS: Readonly<Record<string, LocalizedLine[]>> = {
  sweeper: [
    doctorThought("La escoba le cuelga de la mano como si se le hubiera olvidado que existe.", "The broom hangs from her hand as if she had forgotten it exists."),
    doctorThought("Hasta hace poco barría hasta las esquinas. Esta noche el polvo puede descansar en paz.", "Until recently she swept right into the corners. Tonight the dust can rest in peace."),
  ],
  fisherman: [
    doctorThought("El hilo flota solo. No mira el agua: mira algo más pequeño y más quieto.", "The line floats on its own. He isn't watching the water: he's watching something smaller and stiller."),
    doctorThought("Los peces deben de estar encantados.", "The fish must be delighted."),
  ],
  bartender: [
    doctorThought("La jarra rebosa sobre la barra y nadie lo ha notado. Ni siquiera quien la sirvió.", "The tankard overflows on the bar and nobody has noticed. Not even the one who poured it."),
    doctorThought("Es la primera vez que oigo callar esta taberna.", "It's the first time I've heard this tavern fall silent."),
  ],
  baker: [
    doctorThought("Tiene harina en las manos y no amasa. Con el pulgar repite siempre el mismo gesto.", "There's flour on her hands and she isn't kneading. Her thumb repeats the same small gesture, over and over."),
    doctorThought("Cuando se queme el pan, quizá levante la vista.", "When the bread burns, perhaps she'll look up."),
  ],
  sitting: [
    doctorThought("Está sentado donde siempre, pero ya no mira pasar a nadie.", "He's sitting where he always does, but he no longer watches anyone pass."),
    doctorThought("Antes me habría contado quién salía de la taberna, y en qué estado.", "He would once have told me who came out of the tavern, and in what state."),
  ],
  woodcutter: [
    doctorThought("El hacha descansa clavada en el tocón. Él, apoyado, no descansa: mira.", "The axe rests in the stump. He, leaning, isn't resting: he's watching."),
    doctorThought("Tan cansado hace unos días, y ahora tan despierto... para otra cosa.", "So tired a few days ago, and now so wide awake... for something else."),
  ],
  blacksmith: [
    doctorThought("La mano se curó del todo. Es el oficio el que se ha quedado parado.", "The hand healed completely. It's the trade that has stopped."),
    doctorThought("La forja se apaga sola y él no se da cuenta.", "The forge is dying down by itself and he doesn't notice."),
  ],
  // 2026-11-18: the new poses of Day 4 (a child on the ground, someone fainted, an old man facing left)
  child: [
    doctorThought("Un niño sentado en el suelo, y ni corre ni pregunta. Es lo que más me inquieta.", "A child sitting on the ground, not running, not asking questions. That's what unsettles me most."),
    doctorThought("Los niños siempre me preguntan qué llevo en la bolsa. Este ni me ha mirado.", "Children always ask me what I carry in my bag. This one hasn't even looked at me."),
  ],
  fainted: [
    doctorThought("Respira y el pulso es firme. Se habrá chocado con algo sin levantar la vista a tiempo.", "Breathing, steady pulse. They must have walked into something without looking up in time."),
    doctorThought("La luz sigue encendida a su lado, como esperando a que despierte.", "The light is still on beside them, as if waiting for them to wake."),
  ],
  patron: [
    doctorThought("Una mano para la jarra y otra para la luz. Y la jarra va ganando poco.", "One hand for the tankard and the other for the light. And the tankard is hardly winning."),
    doctorThought("Se le inclina la bebida y no lo nota: está donde esté la luz.", "The drink is tipping over and they don't notice: they are wherever the light is."),
  ],
  oldMan: [
    doctorThought("Ya no mira pasar el pueblo: mira lo que sostiene en las manos.", "He no longer watches the village go by: he watches what he holds in his hands."),
    doctorThought("Con cuánto cuidado la sujeta, con lo que le tiemblan los dedos.", "How carefully he holds it, with how much his fingers shake."),
  ],
  washer: [
    doctorThought("La ropa se va con la corriente, prenda tras prenda. Ella ni parpadea.", "The washing drifts away with the current, garment after garment. She doesn't even blink."),
    doctorThought("Cuando se dé cuenta, el río se habrá quedado con toda la colada.", "By the time she notices, the river will have kept all the washing."),
  ],
};

// 2026-11-19: if he walks to the door before speaking to her, the way is shut and she calls him over.
export const witchDoorCall: LocalizedConversation = talk("witch.doorCall", [
  witch("Aquí, Doctor. Primero tú y yo; la puerta no se abre sola.", "Here, Doctor. You and I first; the door won't open by itself."),
]);

// The door of her house (Day 4, from the night scene of the cottage) stays shut until she has asked him in.
export const DAY4_COTTAGE_SCENE = "forest-cottage";
export const DAY4_COTTAGE_DOOR_TARGET = "forest-cottage-interior";

const OUTSIDE_LINES: LocalizedLine[] = [
  witch("Has llegado. ¿Llevas la pluma? Bien. Toda la noche te ha rozado y no te ha prendido.", "You've arrived. Do you have the feather? Good. The whole night has brushed against you and hasn't caught you."),
  doctor("Todo el pueblo mirando una luz, y yo aquí, mirándote a ti. No entiendo por qué a mí no me llama.", "The whole village staring at a light, and here I am, looking at you. I don't understand why it doesn't call me."),
  witch("La pluma es de cuervo y mi hechizo la acompaña: mientras las lleves encima, esa luz no sabrá hablarte. Entra en casa, que fuera la noche escucha.", "The feather is a raven's and my spell goes with it: as long as you carry them, that light won't know how to speak to you. Come inside; out here the night is listening."),
  witch("Te espero dentro.", "I'll be waiting inside."),
];

const FINAL_LINES: LocalizedLine[] = [
  witch("Llegas. Con la pluma, espero. Y con cara de haber corrido la noche entera.", "You came. With the feather, I hope. And looking as if you'd run all night."),
  doctor("Aquí está, a salvo. ¿Vas a decirme ya para qué, o seguimos con el misterio?", "Here it is, safe and sound. Are you going to tell me now what it's for, or do we keep the mystery?"),
  witch("Es de cuervo. Los cuervos avisan cuando algo cambia de sitio.", "It's a raven's. Ravens warn you when something changes place."),
  doctor("¿Qué ha cambiado de sitio?", "What has changed place?"),
  witch("La atención. Antes se repartía entre las cosas. Ahora tiene dueño.", "Attention. It used to be shared among things. Now it has an owner."),
  doctor("Los artefactos... los he visto por todas partes. Y a mí no me han atrapado.", "The artifacts... I've seen them everywhere. And they haven't caught me."),
  witch("Te cubren la pluma y el hechizo. Pero no estás hecho de otra pasta, Doctor: ellos tampoco querían caer.", "The feather and the spell cover you. But you're not made of different stuff, Doctor: they didn't want to fall either."),
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
// 2026-11-20 (Kilian): the last thoughts must be WORRIED and HARSH, something that terrifies; the epilogue (EndCard) follows.
// NEW TEXT (ES/EN), awaiting Kilian's review.
export const day4Closing: LocalizedConversation = {
  id: "chapter4.day4.closing", lines: [
    doctorThought("Salgo de la casita y el bosque está en silencio. No es calma: es que nadie habla. Ni un grillo, ni una voz en el camino.", "I step out of the cottage and the forest is silent. It isn't calm: it's that nobody speaks. Not a cricket, not a voice on the road."),
    doctorThought("Esta noche escribiré lo que he visto, y la mano me tiembla. Tantas caras bañadas en esa luz, tantos ojos vacíos. Y ninguno ha pedido ayuda.", "Tonight I'll write down what I've seen, and my hand trembles. So many faces bathed in that light, so many empty eyes. And not one asked for help."),
    doctorThought("No hay fiebre, ni herida, ni nada que mi libro sepa nombrar. Y se extiende más deprisa que cualquier peste que haya visto. Nadie huye de ella: la buscan.", "There's no fever, no wound, nothing my book knows how to name. And it spreads faster than any plague I've seen. Nobody flees from it: they seek it out."),
    doctorThought("Si esa luz me llamara a mí, ¿lo notaría? ¿O ya la estaría mirando sin saberlo?", "If that light called to me, would I notice? Or would I already be staring at it without knowing?"),
    doctorThought("Lo que no se anota, se olvida. Y tengo miedo de olvidar cómo era este pueblo cuando hablaba.", "What isn't written down is forgotten. And I'm afraid of forgetting what this village was like when it talked."),
  ],
};

// The instances Day 4 keeps out of the world: the Witch outside, once she has asked him in and the screen faded.
export function getDay4HiddenInstanceIds(gone: boolean): ReadonlySet<string> {
  return gone ? new Set([WITCH_OUTSIDE_INSTANCE_ID]) : new Set();
}

export function resolveChapter4(
  interactionId: string, facts: StoryFacts, language: Language, subjectId: string,
): StoryOutcome | null {
  const local = (conversation: LocalizedConversation) => localizeConversation(conversation, language, subjectId);

  if (interactionId === WITCH_OUTSIDE_INTERACTION_ID) {
    if (countItem(facts.inventory, "black-feather") < 1) {
      return { conversation: local(talk("witch.outsideNoFeather", NO_FEATHER_LINES)), effects: [] };
    }
    return {
      conversation: local(talk("witch.outside", OUTSIDE_LINES)),
      effects: facts.claimedRewards?.has(WITCH_OUTSIDE_ID) ? [] : [{ type: "claim-reward", rewardId: WITCH_OUTSIDE_ID }],
    };
  }

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
    // Their own two thoughts when the pose has them (the same person always gets the same ones).
    const slug = interactionId.slice(ARTIFACT_PERSON_PREFIX.length);
    const own = ARTIFACT_PERSON_THOUGHTS[slug];
    if (own) return { conversation: local(talk(`artifact.${slug}`, absorbed(interactionId, own))), effects: [] };
    // Otherwise a fixed generic thought per person.
    let hash = 0;
    for (const char of interactionId) hash = (hash * 31 + char.charCodeAt(0)) % 997;
    const index = hash % ARTIFACT_THOUGHTS.length;
    return { conversation: local(talk(`artifact.${index}`, absorbed(interactionId, [ARTIFACT_THOUGHTS[index]]))), effects: [] };
  }

  return null;
}
