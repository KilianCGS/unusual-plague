import type { LocalizedConversation } from "./localizedConversation";

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
      "Doctor, échele un vistazo al hombre del suelo. Antes estaba bebiendo. Ahora solo se queja.",
      "Doctor, take a look at the man on the floor. He was drinking earlier. Now he just groans.",
    ),
    doctor("¿Cuánto ha bebido?", "How much did he drink?"),
    subject(
      "Menos de lo necesario para explicar eso.",
      "Not enough to explain that.",
    ),
    doctor("Lo miraré.", "I'll take a look."),
  ],
};

// Noticed, not examined yet.
export const bartenderWaiting: LocalizedConversation = {
  id: "chapter1.tavern.bartender.waiting",
  lines: [
    subject(
      "Sigue donde lo dejó, Doctor. Y sigue quejándose.",
      "He's right where you left him, Doctor. Still groaning.",
    ),
    doctor("Voy.", "On my way."),
  ],
};

// Examined, not treated yet.
export const bartenderDuring: LocalizedConversation = {
  id: "chapter1.tavern.bartender.during",
  lines: [
    subject("¿Sabe ya qué le pasa?", "Do you know what's wrong with him yet?"),
    doctor(
      "Se le pasará. Déjeme prepararle algo.",
      "He'll get over it. Let me prepare him something.",
    ),
    subject(
      "Tiempo es lo que le sobra. De aquí no se mueve.",
      "Time is all he has. He isn't going anywhere.",
    ),
  ],
};

// Examined, and the bartender hands over the jar for the milk (once).
export const bartenderJarReady: LocalizedConversation = {
  id: "chapter1.tavern.bartender.jar",
  lines: [
    doctor("Necesitaré algo de leche.", "I'll need some milk."),
    subject(
      "Llévese esta jarra. En la granja podrán llenársela.",
      "Take this jar. They can fill it at the farm.",
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
      "Ahora mismo no puedo cargar nada más. Haré sitio y vuelvo.",
      "I can't carry anything else right now. I'll make room and be back.",
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
    doctor("Dele tiempo.", "Give it time."),
  ],
};

// ---- the man on the floor -------------------------------------------------

// The examination, in place.
export const tavernPatientExam: LocalizedConversation = {
  id: "chapter1.tavern.sickPatient.exam",
  lines: [
    subject("Mi vientre...", "My stomach..."),
    doctor(
      "Dolor de estómago. El exceso de bebida tampoco parece haber ayudado.",
      "Stomach pain. The drink doesn't seem to have helped either.",
    ),
    doctor(
      "Necesita algo ligero para recuperar el estómago... y algo que lo calme.",
      "He needs something light to settle the stomach... and something to soothe it.",
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
    "Todavía no tengo nada preparado. Aguante un poco.",
    "I don't have anything ready yet. Hold on a little.",
  ),
  "mushroom-soup": waitingFor(
    "soup",
    "Me falta la sopa ligera. Aguante un poco.",
    "I'm missing the light soup. Hold on a little.",
  ),
  "milk-with-honey": waitingFor(
    "milk",
    "Me falta la leche con miel. Aguante un poco.",
    "I'm missing the milk with honey. Hold on a little.",
  ),
};

// The treatment, with the thank-you inside it.
export const tavernPatientCure: LocalizedConversation = {
  id: "chapter1.tavern.sickPatient.cure",
  lines: [
    doctor(
      "Beba despacio. Primero la sopa, después la leche.",
      "Drink slowly. The soup first, then the milk.",
    ),
    subject(
      "Creo que... puedo respirar sin quejarme.",
      "I think... I can breathe without complaining.",
    ),
    doctor("Empiece por beber menos.", "Start by drinking less."),
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
      "Eso lo decidirá su próxima noche.",
      "Your next night out will settle that.",
    ),
  ],
};

// ---- the farm woman: milk for three oranges and a jar ----------------------

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
      "Necesito algo de leche para un enfermo.",
      "I need some milk for a sick man.",
    ),
    subject(
      "Puedo darle un poco. Si va hacia los frutales, tráigame tres naranjas.",
      "I can spare a little. If you're heading to the orchards, bring me three oranges.",
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
      "Tres naranjas y una jarra vacía, Doctor. Con eso, la leche es suya.",
      "Three oranges and an empty jar, Doctor. Bring those and the milk is yours.",
    ),
  ]),
  orange: farmMissing("missingOranges", [
    subject(
      "La jarra ya la tiene. Ahora faltan las tres naranjas.",
      "You have the jar. Now I need the three oranges.",
    ),
  ]),
  "empty-jar": farmMissing("missingJar", [
    subject(
      "Las naranjas están bien, pero ¿dónde se la pongo? Tráigame una jarra vacía.",
      "The oranges are fine, but where do I put it? Bring me an empty jar.",
    ),
  ]),
};

export const farmWomanReady: LocalizedConversation = {
  id: "chapter1.farm.woman.ready",
  lines: [
    subject(
      "Tres naranjas y una jarra. Trato hecho.",
      "Three oranges and a jar. Deal.",
    ),
    doctor("Se lo agradezco.", "I appreciate it."),
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
      "Cuide a ese enfermo. Y no me pida más leche hoy, que la vaca tiene su carácter.",
      "Look after that sick man. And no more milk today; the cow has her moods.",
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
    doctor("Gracias.", "Thank you."),
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
