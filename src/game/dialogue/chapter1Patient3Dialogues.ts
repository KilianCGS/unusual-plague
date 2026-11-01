import type {
  LocalizedConversation,
  LocalizedLine,
} from "./localizedConversation";

// Patient 3, the injured miner, and what feeds his case: the alcohol of the
// bartender and the coal of the miner on the Mountain Path. "subject" is
// whoever started the conversation.
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
  doctor("No deberías estar aquí sentado.", "You shouldn't be sitting here."),
  subject("Créame, tumbado era peor.", "Believe me, lying down was worse."),
  doctor("Déjame verla.", "Let me see it."),
  subject("¿Es médico?", "Are you a doctor?"),
  doctor(
    "Llevo una máscara con un pico y un maletín lleno de remedios.",
    "I wear a mask with a beak and carry a case full of remedies.",
  ),
  subject(
    "He visto profesiones peor anunciadas.",
    "I've seen worse-advertised professions.",
  ),
  doctor("¿Cuánto hace que te heriste?", "How long ago did you hurt yourself?"),
  subject("Un par de días.", "A couple of days."),
  doctor("¿Y has seguido trabajando?", "And you kept working?"),
  subject(
    "Solo hasta que dejó de parecer una buena idea.",
    "Only until it stopped seeming like a good idea.",
  ),
  doctor(
    "Eso debió ocurrir hace un par de días.",
    "That must have been a couple of days ago.",
  ),
  subject(
    "Sí. Bueno. En retrospectiva todo parece más sencillo.",
    "Yes. Well. Everything looks simpler in hindsight.",
  ),
  doctor("La herida está infectada.", "The wound is infected."),
  subject(
    "Eso suena peor cuando lo dice alguien con máscara.",
    "That sounds worse coming from someone in a mask.",
  ),
  doctor(
    "Necesito limpiarla y cubrirla correctamente. Y preparar algo para la infección.",
    "I need to clean it and dress it properly. And prepare something for the infection.",
  ),
  subject("¿Voy a perder la pierna?", "Am I going to lose the leg?"),
  doctor(
    "No si dejas de intentar perderla tú solo.",
    "Not if you stop trying to lose it all by yourself.",
  ),
  subject("Intentaré colaborar.", "I'll try to cooperate."),
]);

// Examined, the treatments are not ready.
export const injuredMinerWaiting = conversation("mine.injuredMiner.waiting", [
  subject("¿Necesita que haga algo?", "Do you need me to do anything?"),
  doctor("Sí. No moverte.", "Yes. Don't move."),
  subject(
    "Eso se me está dando bastante bien.",
    "I'm getting quite good at that.",
  ),
  doctor("Intenta mejorar.", "Try to improve."),
]);

// Both preparations in hand.
export const injuredMinerCure = conversation("mine.injuredMiner.cure", [
  doctor(
    "Voy a limpiar la herida primero. Esto va a escocer.",
    "I'll clean the wound first. This is going to sting.",
  ),
  subject("¿Cuánto?", "How much?"),
  doctor(
    "Lo suficiente para que recuerdes no trabajar dos días con una herida abierta.",
    "Enough for you to remember not to work two days on an open wound.",
  ),
  subject("Ah.", "Ah."),
  subject("¿Puede mentirme un poco?", "Can you lie to me a little?"),
  doctor("No.", "No."),
  subject("...", "..."),
  doctor("Ya está.", "Done."),
  subject(
    "Eso ha sido bastante peor de lo que esperaba.",
    "That was a lot worse than I expected.",
  ),
  doctor(
    "Entonces mi explicación fue precisa.",
    "Then my explanation was accurate.",
  ),
  subject("¿Puedo volver a trabajar?", "Can I go back to work?"),
  doctor("No.", "No."),
  subject("¿Mañana?", "Tomorrow?"),
  doctor("No.", "No."),
  subject("¿Pasado?", "The day after?"),
  doctor(
    "Voy a fingir que no has preguntado.",
    "I'm going to pretend you didn't ask.",
  ),
]);

export const injuredMinerAfter = conversation("mine.injuredMiner.after", [
  subject("La pierna está bastante mejor.", "The leg is a lot better."),
  doctor(
    "Eso ocurre cuando uno deja de empeorarla activamente.",
    "That happens when one stops actively making it worse.",
  ),
  subject("Estoy aprendiendo mucho hoy.", "I'm learning a lot today."),
]);

// ---- the bartender: alcohol -------------------------------------------------

export const bartenderAlcoholReady = conversation("tavern.bartender.alcohol", [
  doctor(
    "Necesito algo de alcohol. Cuanto más fuerte, mejor.",
    "I need some alcohol. The stronger, the better.",
  ),
  subject(
    "Normalmente cuando alguien empieza así una conversación, termino echándolo del local.",
    "Whenever someone opens a conversation like that, I usually end up throwing them out.",
  ),
  doctor("Es para una herida.", "It's for a wound."),
  subject("Eso también lo dicen bastante.", "They say that quite a lot too."),
  doctor("Una herida de verdad. En la mina.", "A real wound. In the mine."),
  subject("Ah.", "Ah."),
  subject("Entonces llévate esto.", "Then take this."),
  doctor("¿Cuánto te debo?", "What do I owe you?"),
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
    "Tu compañero de la mina se ha hecho una herida bastante fea.",
    "Your partner in the mine has hurt himself quite badly.",
  ),
  subject("¿Otra vez?", "Again?"),
  doctor("¿Otra vez?", "Again?"),
  subject(
    "No es bueno sabiendo cuándo parar.",
    "He's no good at knowing when to stop.",
  ),
  doctor("Eso ya lo había deducido.", "I had already worked that out."),
  doctor(
    "Necesito carbón limpio. Una pieza pequeña.",
    "I need clean coal. A small piece.",
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
