import type { LocalizedConversation } from "./localizedConversation";

// 2026-11-13: enriched pass in the Doctor's new voice (cheerful, close, serene). New text,
// awaiting Kilian's review; missions, items and effects are unchanged.
// Conversations of the tavern case (the man on the floor and the bartender who
// points him out) and of the trades that feed it. "subject" is whoever started
// the conversation.
const subject = (es: string, en: string) => ({
  speaker: "subject",
  text: { es, en },
});
const doctor = (es: string, en: string) => ({
  speaker: "doctor",
  text: { es, en },
});
// ---- the bartender --------------------------------------------------------

// Before the case is noticed: he asks the Doctor to look at the man.
export const bartenderIntro: LocalizedConversation = {
  id: "chapter1.tavern.bartender.intro",
  lines: [
    subject(
      "Doctor, échele un vistazo al hombre del suelo. Antes estaba bebiendo y cantando. Ahora solo se queja, y las canciones eran mejores.",
      "Doctor, take a look at the man on the floor. He was drinking and singing earlier. Now he just groans, and the songs were better.",
    ),
    doctor("¿Cuánto ha bebido, más o menos?", "How much has he had, roughly?"),
    subject(
      "Menos de lo necesario para explicar eso. Por eso me preocupa.",
      "Not enough to explain that. That's why I'm worried.",
    ),
    doctor("Ahora mismo lo veo. Gracias por avisarme.", "I'll see him right now. Thank you for letting me know."),
  ],
};

// Noticed, not examined yet.
export const bartenderWaiting: LocalizedConversation = {
  id: "chapter1.tavern.bartender.waiting",
  lines: [
    subject(
      "Sigue donde lo dejó, Doctor. Y sigue quejándose, pero ahora con más sentimiento.",
      "He's right where you left him, Doctor. Still groaning, but now with more feeling.",
    ),
    doctor("Voy enseguida.", "On my way."),
  ],
};

// Examined, not treated yet.
export const bartenderDuring: LocalizedConversation = {
  id: "chapter1.tavern.bartender.during",
  lines: [
    subject("¿Sabe ya qué le pasa?", "Do you know what's wrong with him yet?"),
    doctor(
      "Seguro que se le pasa. Déjeme prepararle algo que lo alivie.",
      "I'm sure it will pass. Let me prepare something to ease it.",
    ),
    subject(
      "Tiempo es lo que le sobra. De aquí no se mueve, y yo tampoco: puede contar conmigo.",
      "Time is all he has. He isn't going anywhere, and neither am I: you can count on me.",
    ),
  ],
};

// Examined, and the bartender hands over the jar for the milk (once).
export const bartenderJarReady: LocalizedConversation = {
  id: "chapter1.tavern.bartender.jar",
  lines: [
    doctor("Necesitaré un poco de leche, si es tan amable.", "I'll need a little milk, if you'd be so kind."),
    subject(
      "Llévese esta jarra. En la granja podrán llenársela, y la leche allí es de la buena.",
      "Take this jar. They can fill it at the farm, and the milk there is the good kind.",
    ),
  ],
};

// The same moment with a full pocket: the jar stays with him until there is room.
export const bartenderJarNoRoom: LocalizedConversation = {
  id: "chapter1.tavern.bartender.jarNoRoom",
  lines: [
    subject(
      "Tome una jarra para la leche, Doctor.",
      "Take a jar for the milk, Doctor.",
    ),
    doctor(
      "Gracias, pero llevo las manos llenas. Hago sitio y vuelvo.",
      "Thanks, but my hands are full. I'll make room and come back.",
    ),
  ],
};

// The man was treated.
export const bartenderAfter: LocalizedConversation = {
  id: "chapter1.tavern.bartender.after",
  lines: [
    subject(
      "Hasta ha pedido agua. Eso sí que es nuevo en esta casa.",
      "He even asked for water. That's a first in this house.",
    ),
    doctor("Todo llegará. Dele tiempo.", "It will all come. Give it time."),
  ],
};

// ---- the man on the floor -------------------------------------------------

// The examination, in place.
export const tavernPatientExam: LocalizedConversation = {
  id: "chapter1.tavern.sickPatient.exam",
  lines: [
    subject("Mi vientre...", "My stomach..."),
    doctor(
      "Dolor de estómago. Y la bebida no ayuda, la verdad. Pero tiene arreglo.",
      "A stomach ache. And the drink doesn't help, truth be told. But it can be fixed.",
    ),
    doctor(
      "Necesita algo ligero para el estómago... y algo que lo calme. Vamos a cuidarlo.",
      "He needs something light for the stomach... and something to calm him. Let's take care of him.",
    ),
    subject("Ughh... Haga lo que sea...", "Ughh... Do whatever you must..."),
  ],
};

// Examined but the Doctor does not carry both treatments yet: what is missing.
const waitingFor = (
  id: string,
  es: string,
  en: string,
): LocalizedConversation => ({
  id: `chapter1.tavern.sickPatient.waiting.${id}`,
  lines: [
    subject("Ughh... mi vientre...", "Ughh... my stomach..."),
    doctor(es, en),
  ],
});

export const tavernPatientWaiting = {
  all: waitingFor(
    "all",
    "Todavía no tengo nada preparado, pero ya voy de camino. Aguante un poco.",
    "I don't have anything ready yet, but I'm on my way. Hold on a little.",
  ),
  "mushroom-soup": waitingFor(
    "soup",
    "Me falta la sopa ligera, pero ya casi la tengo. Aguante un poco.",
    "I'm missing the light soup, but I almost have it. Hold on a little.",
  ),
  "milk-with-honey": waitingFor(
    "milk",
    "Me falta la leche con miel, pero ya casi la tengo. Aguante un poco.",
    "I'm missing the milk with honey, but I almost have it. Hold on a little.",
  ),
};

// The treatment, with the thank-you inside it.
export const tavernPatientCure: LocalizedConversation = {
  id: "chapter1.tavern.sickPatient.cure",
  lines: [
    doctor(
      "Despacito. Primero la sopa, después la leche. Así, muy bien.",
      "Slowly now. Soup first, then the milk. That's it, very good.",
    ),
    subject(
      "Creo que... puedo respirar sin quejarme.",
      "I think... I can breathe without complaining.",
    ),
    doctor("Ya que está mejor, quizá beba un poquito menos. Solo un consejo de amigo.", "Now that you're better, perhaps drink a little less. Just a friend's advice."),
  ],
};

// Treated.
export const tavernPatientAfter: LocalizedConversation = {
  id: "chapter1.tavern.sickPatient.after",
  lines: [
    subject(
      "Sigo vivo. No sé si me lo merezco.",
      "I'm still alive. I'm not sure I deserve it.",
    ),
    doctor(
      "Claro que se lo merece. Y su próxima noche puede ser mejor.",
      "Of course you do. And your next night can be a better one.",
    ),
  ],
};

// ---- the farm woman: milk for one orange and a jar ----------------------

const farmMissing = (
  id: string,
  lines: LocalizedConversation["lines"],
): LocalizedConversation => ({ id: `chapter1.farm.woman.${id}`, lines });

// The first conversation about the milk (after the sick man was examined): the
// Doctor asks, she PRESENTS the deal. Told once; what she says about the
// container depends on whether he already carries the jar.
const farmIntro = (withJar: boolean): LocalizedConversation => ({
  id: `chapter1.farm.woman.intro${withJar ? "WithJar" : ""}`,
  lines: [
    doctor(
      "Necesito un poco de leche para un enfermo, si puede ser.",
      "I need a little milk for a sick man, if possible.",
    ),
    subject(
      "Puedo darle un poco, claro. Si va hacia los frutales, tráigame una naranja: llevo todo el día soñando con una.",
      "I can spare a little, of course. If you're heading to the orchards, bring me an orange: I've been dreaming of one all day.",
    ),
    withJar
      ? subject(
          "Esa jarra servirá para llevársela.",
          "That jar will do to carry it.",
        )
      : subject(
          "Y necesitará algo donde llevársela.",
          "And you'll need something to carry it in.",
        ),
  ],
});

export const farmWomanIntro = farmIntro(false);
export const farmWomanIntroWithJar = farmIntro(true);

export const farmWomanMissing = {
  // After the introduction she does not explain it again, only reminds him.
  all: farmMissing("missing", [
    subject(
      "Una naranja y una jarra vacía, Doctor. Con eso, la leche es suya.",
      "An orange and an empty jar, Doctor. Bring those and the milk is yours.",
    ),
  ]),
  orange: farmMissing("missingOranges", [
    subject(
      "La jarra ya la tiene. Ahora falta la naranja.",
      "You have the jar. Now I need the orange.",
    ),
  ]),
  "empty-jar": farmMissing("missingJar", [
    subject(
      "La naranja está bien, pero ¿dónde se la pongo? Tráigame una jarra vacía.",
      "The orange is fine, but where do I put it? Bring me an empty jar.",
    ),
  ]),
};

export const farmWomanReady: LocalizedConversation = {
  id: "chapter1.farm.woman.ready",
  lines: [
    subject(
      "Una naranja y una jarra. Trato hecho.",
      "An orange and a jar. Deal.",
    ),
    doctor("Muchas gracias.", "Thank you very much."),
    subject("Tome. Recién ordeñada.", "Here. Fresh from the cow."),
  ],
};

export const farmWomanNoRoom: LocalizedConversation = {
  id: "chapter1.farm.woman.noRoom",
  lines: [
    subject(
      "Lleva las manos llenas, Doctor. Haga sitio y vuelva.",
      "Your hands are full, Doctor. Make some room and come back.",
    ),
  ],
};

export const farmWomanDone: LocalizedConversation = {
  id: "chapter1.farm.woman.done",
  lines: [
    subject(
      "Cuide a ese enfermo. Y no me pida más leche hoy, que la vaca tiene su carácter y su horario.",
      "Look after that sick man. And no more milk today; the cow has her moods and her schedule.",
    ),
  ],
};

// ---- the beekeeper: honey -------------------------------------------------

export const beekeeperReady: LocalizedConversation = {
  id: "chapter1.mill.beekeeper.ready",
  lines: [
    subject(
      "¿Miel? Claro. Para un enfermo no voy a ponerme a regatear.",
      "Honey? Of course. I won't haggle over a sick man.",
    ),
    doctor("¡Muchas gracias!", "Thank you so much!"),
  ],
};

export const beekeeperNoRoom: LocalizedConversation = {
  id: "chapter1.mill.beekeeper.noRoom",
  lines: [
    subject(
      "Lleva las manos llenas, Doctor. Haga sitio y la miel es suya.",
      "Your hands are full, Doctor. Make some room and the honey is yours.",
    ),
  ],
};

export const beekeeperDone: LocalizedConversation = {
  id: "chapter1.mill.beekeeper.done",
  lines: [
    subject(
      "Ya se llevó lo mejor del panal. El resto es de ellas.",
      "You've taken the best of the comb. The rest belongs to them.",
    ),
  ],
};
