import type {
  LocalizedConversation,
  LocalizedLine,
} from "./localizedConversation";

// Patient 3, the injured miner, and what feeds his case: the alcohol of the
// bartender and the coal of the miner on the Mountain Path. "subject" is
// whoever started the conversation.
// 2026-11-13: enriched pass in the Doctor's new voice (cheerful, close, serene).
// New text, awaiting Kilian's review. Missions, items and effects are unchanged.
const subject = (es: string, en: string): LocalizedLine => ({
  speaker: "subject",
  text: { es, en },
});
const doctor = (es: string, en: string): LocalizedLine => ({
  speaker: "doctor",
  text: { es, en },
});

const conversation = (
  id: string,
  lines: LocalizedLine[],
): LocalizedConversation => ({ id: `chapter1.${id}`, lines });

// ---- the injured miner -----------------------------------------------------

// Not examined yet: the conversation IS the examination.
export const injuredMinerExam = conversation("mine.injuredMiner.exam", [
  subject("Ah... despacio. La pierna.", "Ah... easy. My leg."),
  doctor(
    "Eh, amigo, no deberías estar sentado ahí con esa pierna.",
    "Hey, friend, you shouldn't be sitting there with that leg.",
  ),
  subject(
    "Créame, tumbado era peor. Entre el suelo duro y el dolor, no había quien pegara ojo.",
    "Believe me, lying down was worse. Between the hard floor and the pain, nobody could sleep.",
  ),
  doctor(
    "Déjame echarle un vistazo, ¿sí?",
    "Let me have a look at it, all right?",
  ),
  subject("¿Es médico?", "Are you a doctor?"),
  doctor(
    "Llevo una máscara con pico y un maletín lleno de remedios. Y buenas intenciones.",
    "I wear a beaked mask and carry a case full of remedies. And good intentions.",
  ),
  subject(
    "He visto profesiones peor anunciadas.",
    "I've seen worse-advertised professions.",
  ),
  doctor(
    "Ja, me lo apunto como cumplido. ¿Hace cuánto te heriste?",
    "Ha, I'll take that as a compliment. How long ago did you hurt yourself?",
  ),
  subject("Un par de días.", "A couple of days."),
  doctor("¿Y has seguido trabajando?", "And you kept working?"),
  subject(
    "Solo hasta que dejó de parecer una buena idea.",
    "Only until it stopped seeming like a good idea.",
  ),
  doctor(
    "Imagino que eso fue hace un par de días, entonces.",
    "I imagine that was a couple of days ago, then.",
  ),
  subject(
    "Sí. Bueno. En retrospectiva todo parece más sencillo.",
    "Yes. Well. Everything looks simpler in hindsight.",
  ),
  doctor(
    "Está roja, hinchada y supura, y sigue doliendo. Lo veo, no te preocupes: tiene arreglo.",
    "It's red, swollen and weeping, and it still hurts. I can see that, don't worry: it can be fixed.",
  ),
  subject(
    "Eso suena peor cuando lo dice alguien con máscara.",
    "That sounds worse coming from someone in a mask.",
  ),
  doctor(
    "Voy a valorar estos signos con calma antes de elegir el tratamiento. Mientras tanto, deja la pierna en reposo, por favor.",
    "I'll weigh these signs calmly before choosing the treatment. Meanwhile, please rest the leg.",
  ),
  subject("¿Voy a perder la pierna?", "Am I going to lose the leg?"),
  doctor(
    "Qué va. Si la cuidas, la conservas. Yo te ayudo.",
    "Not at all. Look after it and you'll keep it. I'll help.",
  ),
  subject("Intentaré colaborar.", "I'll try to cooperate."),
]);

// Examined, the treatments are not ready.
export const injuredMinerWaiting = conversation("mine.injuredMiner.waiting", [
  subject("¿Necesita que haga algo?", "Do you need me to do anything?"),
  doctor(
    "Sí: quedarte quietecito. Es lo más difícil, ya lo sé.",
    "Yes: stay nice and still. It's the hardest part, I know.",
  ),
  subject(
    "Eso se me está dando bastante bien.",
    "I'm getting quite good at that.",
  ),
  doctor(
    "Pues sigue así, poco a poco. Vuelvo en cuanto tenga lo que necesito.",
    "Then keep it up, little by little. I'll be back as soon as I have what I need.",
  ),
]);

// Both preparations in hand.
export const injuredMinerCure = conversation("mine.injuredMiner.cure", [
  doctor(
    "Voy a limpiar primero la herida. Te aviso: va a escocer un poco.",
    "I'll clean the wound first. Fair warning: it will sting a little.",
  ),
  subject("¿Cuánto?", "How much?"),
  doctor(
    "Lo justo para que te acuerdes de no trabajar con una herida abierta. Pero pasa rápido, te lo prometo.",
    "Just enough to remember not to work with an open wound. But it passes quickly, I promise.",
  ),
  subject("Ah.", "Ah."),
  subject("¿Puede mentirme un poco?", "Can you lie to me a little?"),
  doctor(
    "No, amigo, contigo prefiero ser sincero. Aquí viene.",
    "No, friend, I'd rather be honest with you. Here it comes.",
  ),
  subject("...", "..."),
  doctor("¡Ya está! Lo has hecho muy bien.", "There! You did very well."),
  subject(
    "Eso ha sido bastante peor de lo que esperaba.",
    "That was a lot worse than I expected.",
  ),
  doctor("Pues te lo expliqué bien. Perdona.", "Then I explained it well. Sorry."),
  subject("¿Puedo volver a trabajar?", "Can I go back to work?"),
  doctor("Todavía no. Paciencia.", "Not yet. Patience."),
  subject("¿Mañana?", "Tomorrow?"),
  doctor("Mañana tampoco, lo siento.", "Not tomorrow either, I'm afraid."),
  subject("¿Pasado?", "The day after?"),
  doctor(
    "Voy a hacer como que no he oído esa pregunta, con todo cariño.",
    "I'll pretend I didn't hear that question, with all affection.",
  ),
]);

export const injuredMinerAfter = conversation("mine.injuredMiner.after", [
  subject("La pierna está bastante mejor.", "The leg is a lot better."),
  doctor(
    "Eso pasa cuando uno la cuida en vez de maltratarla. ¡Enhorabuena!",
    "That happens when you look after it instead of mistreating it. Congratulations!",
  ),
  subject("Estoy aprendiendo mucho hoy.", "I'm learning a lot today."),
]);

// ---- the bartender: alcohol -------------------------------------------------

export const bartenderAlcoholReady = conversation("tavern.bartender.alcohol", [
  doctor(
    "Hola de nuevo. Necesito algo de alcohol, cuanto más fuerte, mejor.",
    "Hello again. I need some alcohol, the stronger the better.",
  ),
  subject(
    "Normalmente cuando alguien empieza así una conversación, termino echándolo del local.",
    "Whenever someone opens a conversation like that, I usually end up throwing them out.",
  ),
  doctor(
    "Es para una herida, te lo aseguro.",
    "It's for a wound, I assure you.",
  ),
  subject("Eso también lo dicen bastante.", "They say that quite a lot too."),
  doctor(
    "Una herida de verdad: un minero, en la mina.",
    "A real wound: a miner, down the mine.",
  ),
  subject("Ah.", "Ah."),
  subject(
    "Entonces llévate esto. Que se cure pronto, que ese hombre bebe poco y trabaja demasiado.",
    "Then take this. May he heal soon; that man drinks too little and works too much.",
  ),
  doctor(
    "¡Muchas gracias! ¿Cuánto te debo?",
    "Thank you so much! How much do I owe you?",
  ),
  subject(
    "Nada. Pero si el minero pregunta, era del barato.",
    "Nothing. But if the miner asks, it was the cheap stuff.",
  ),
]);

export const bartenderAlcoholNoRoom = conversation(
  "tavern.bartender.alcoholNoRoom",
  [
    subject(
      "Llevas las manos llenas, Doctor. Haz sitio y vuelve; la botella no se mueve de aquí.",
      "Your hands are full, Doctor. Make some room and come back; the bottle isn't going anywhere.",
    ),
  ],
);

// ---- the miner of the Mountain Path: coal -----------------------------------

export const mountainMinerCoalReady = conversation("mountainPath.miner.coal", [
  doctor(
    "Tu compañero de la mina se ha hecho una herida bastante fea, pero tiene arreglo.",
    "Your fellow miner has a rather nasty wound, but it can be fixed.",
  ),
  subject("¿Otra vez?", "Again?"),
  doctor("¿Otra vez? ¡Vaya!", "Again? Oh dear!"),
  subject(
    "No es bueno sabiendo cuándo parar.",
    "He's no good at knowing when to stop.",
  ),
  doctor(
    "Eso ya me lo había parecido. Y por eso mismo necesito tu ayuda.",
    "That's what I'd gathered. And that's exactly why I need your help.",
  ),
  doctor(
    "Necesito un poco de carbón limpio. Una pieza pequeña bastará.",
    "I need a little clean coal. A small piece will do.",
  ),
  subject("Eso sí puedo conseguirlo.", "That I can get you."),
  subject(
    "Por una vez tengo exactamente lo que busca.",
    "For once I have exactly what you're looking for.",
  ),
]);

export const mountainMinerCoalNoRoom = conversation(
  "mountainPath.miner.coalNoRoom",
  [
    subject(
      "Lleva las manos llenas, Doctor. Haga sitio y el carbón es suyo.",
      "Your hands are full, Doctor. Make some room and the coal is yours.",
    ),
  ],
);

export const mountainMinerCoalDone = conversation(
  "mountainPath.miner.coalDone",
  [
    subject(
      "Cuide de mi compañero. Y dígale que la próxima vez mire dónde pisa.",
      "Look after my partner. And tell him to watch where he steps next time.",
    ),
  ],
);
