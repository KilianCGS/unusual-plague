import type {
  LocalizedConversation,
  LocalizedLine,
} from "./localizedConversation";

// Witch, sitting at the bar of the tavern. The Doctor has known her for years:
// they disagree about everything and neither tries to win. "subject" is Witch.
// Her cat does not speak.
// 2026-11-13: voice pass: the Witch is warm with the Doctor and sometimes sarcastic; the Doctor is
// cheerful, close and serene. New text, awaiting Kilian's review; the story beats are unchanged.
const witch = (es: string, en: string): LocalizedLine => ({
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
): LocalizedConversation => ({ id: `chapter1.tavern.witch.${id}`, lines });

// ---- the first conversation ------------------------------------------------

// Everything up to the favour. The ending depends on what he carries.
const FIRST_MEETING: LocalizedLine[] = [
  witch(
    "Tienes peor cara que la última vez. Pasa, siéntate, que me alegra verte.",
    "You look worse than last time. Come in, sit down, I'm glad to see you.",
  ),
  doctor("Llevo una máscara, y aun así me lo notas. Qué ojo.", "I'm wearing a mask, and you still notice. Sharp eye."),
  witch("Precisamente.", "Exactly."),
  doctor("¡Qué alegría verte! Y qué alegría que sigas igual.", "How good to see you! And how good that you haven't changed."),
  witch("¿Eso era un cumplido?", "Was that a compliment?"),
  doctor("Con todo cariño.", "With all affection."),
  witch("Entonces sí que sigues igual.", "Then you really haven't changed."),
  doctor("¿Llevas mucho aquí?", "Have you been here long?"),
  witch("Voy por la segunda jarra.", "I'm on my second mug."),
  doctor("Eso no responde a mi pregunta, pero me encanta.", "That doesn't answer my question, but I love it."),
  witch("Entonces probablemente sí.", "Then probably yes."),
  doctor("¿Y el gato?", "And the cat?"),
  witch("También va por la segunda.", "He's on his second too."),
  doctor("...", "..."),
  witch("Es broma.", "I'm joking."),
  doctor(
    "Contigo nunca estoy completamente seguro, y me encanta no estarlo.",
    "With you I'm never completely sure, and I love not being.",
  ),
  witch("Eso mantiene despierta la mente.", "It keeps the mind awake."),
  witch(
    "Ya que estás aquí, podrías hacerme un favor.",
    "Since you're here, you could do me a favour.",
  ),
  doctor("Ah, así que había un motivo para tanta amabilidad.", "Ah, so there was a reason for all that kindness."),
  witch(
    "Si acabas pasando por la mina, tráeme uno de esos hongos que crecen dentro.",
    "If you happen to pass by the mine, bring me one of those mushrooms that grow inside.",
  ),
];

const ASK_WHAT_FOR: LocalizedLine[] = [
  doctor("¿Para qué?", "What for?"),
  witch("Quiero un hongo.", "I want a mushroom."),
  doctor("Eso no responde a la pregunta, y lo sabes.", "That doesn't answer the question, and you know it."),
  witch(
    "Empiezas a entender cómo funcionan nuestras conversaciones. Me siento orgullosa.",
    "You're starting to understand how our conversations work. I feel proud.",
  ),
];

// He already carries one: it spoils her mystery.
const ASK_ALREADY_CARRYING: LocalizedLine[] = [
  doctor("¿Uno de estos?", "One of these?"),
  witch("...", "..."),
  doctor("¿Qué?", "What?"),
  witch(
    "Me molesta un poco cuando haces eso, aunque te lo perdono.",
    "It bothers me a little when you do that, though I forgive you.",
  ),
  doctor("¿Estar preparado?", "Being prepared?"),
  witch("Arruinarme el misterio.", "Ruining the mystery."),
];

const TRADE_LINES: LocalizedLine[] = [
  doctor("¡Aquí está tu hongo!", "Here's your mushroom!"),
  witch("Sabía que podía confiar en ti.", "I knew I could count on you."),
  doctor(
    "Me pediste que recogiera un hongo. Misión cumplida.",
    "You asked me to pick a mushroom. Mission accomplished.",
  ),
  witch(
    "Y lo hiciste extraordinariamente bien.",
    "And you did it extraordinarily well.",
  ),
  doctor(
    "¿Vas a decirme ya para qué lo quieres?",
    "Are you going to tell me now what you want it for?",
  ),
  witch("No.", "No."),
  witch("Toma, anda.", "Here, go on."),
  doctor("¡Hierbas medicinales! Qué detalle.", "Medicinal herbs! How thoughtful."),
  witch(
    "Veo que tantos años estudiando han dado resultado.",
    "I see all those years of study paid off.",
  ),
  doctor(
    "Empiezo a arrepentirme del hongo, ja.",
    "I'm starting to regret the mushroom, ha.",
  ),
  witch("Demasiado tarde.", "Too late."),
  // NEW (2026-11-11), awaiting Kilian's review: the black feather.
  witch("Y esto.", "And this."),
  doctor("Una pluma.", "A feather."),
  witch("Negra.", "Black."),
  doctor(
    "¿Y qué se supone que hago con una pluma negra?",
    "And what am I supposed to do with a black feather?",
  ),
  witch("Guardarla.", "Keep it."),
  doctor("¿Para qué?", "What for?"),
  witch(
    "Te lo diré cuando importe. Confía en mí.",
    "I'll tell you when it matters. Trust me.",
  ),
  doctor("Cuando te convenga, sin prisa.", "When it suits you, no hurry."),
  witch("Es lo mismo.", "It's the same thing."),
];

const NO_ROOM_LINES: LocalizedLine[] = [
  witch(
    "Tienes las manos demasiado llenas, Doctor. Haz sitio y vuelve; el hongo no se va a ir a ninguna parte, y yo tampoco.",
    "Your hands are too full, Doctor. Make some room and come back; the mushroom isn't going anywhere, and neither am I.",
  ),
];

// The favour is asked and he carries nothing yet.
export const witchFirst = conversation("first", [
  ...FIRST_MEETING,
  ...ASK_WHAT_FOR,
]);

// First meeting, and the Doctor already carries the mushroom: it goes straight
// into the trade, in the same conversation.
export const witchFirstWithMushroom = conversation("firstWithMushroom", [
  ...FIRST_MEETING,
  ...ASK_ALREADY_CARRYING,
  ...TRADE_LINES,
]);

// ... but his hands are too full to take the herb back.
export const witchFirstWithMushroomNoRoom = conversation(
  "firstWithMushroomNoRoom",
  [...FIRST_MEETING, ...ASK_ALREADY_CARRYING, ...NO_ROOM_LINES],
);

// ---- waiting for the mushroom ----------------------------------------------

export const witchWaiting = conversation("waiting", [
  witch("¿Mi hongo?", "My mushroom?"),
  doctor("Todavía no, pero voy en ello.", "Not yet, but I'm on it."),
  witch("Qué decepción tan manejable.", "What a manageable disappointment."),
]);

// ---- the trade -------------------------------------------------------------

export const witchTrade = conversation("trade", TRADE_LINES);
export const witchTradeNoRoom = conversation("tradeNoRoom", NO_ROOM_LINES);

// ---- after the trade: small talk -------------------------------------------

export const WITCH_QUOTES: LocalizedConversation[] = [
  conversation("quote.a", [
    doctor(
      "¿Siempre apareces donde menos te espero? Me alegra, la verdad.",
      "Do you always turn up where I least expect you? I'm glad, truth be told.",
    ),
    witch(
      "Eso dice más de tus expectativas que de mí.",
      "That says more about your expectations than about me.",
    ),
  ]),
  conversation("quote.b", [
    doctor("¿Cuánto llevas aquí?", "How long have you been here?"),
    witch("Lo suficiente.", "Long enough."),
    doctor(
      "Eso tampoco es una unidad de tiempo, ¡pero me gusta!",
      "That isn't a unit of time either, but I like it!",
    ),
  ]),
  conversation("quote.c", [
    doctor("¿Eso es vino?", "Is that wine?"),
    witch(
      "Eso depende de cuánto confíes en el tabernero.",
      "That depends on how much you trust the bartender.",
    ),
  ]),
  conversation("quote.d", [
    doctor("Tu gato me está mirando.", "Your cat is staring at me."),
    witch("Tiene esa costumbre.", "He has that habit."),
    doctor("Parece que algo no le gusta.", "Something doesn't seem to please him."),
    witch("Probablemente tú. Pero te irá cogiendo cariño.", "Probably you. But he'll grow fond of you."),
  ]),
  conversation("quote.e", [
    doctor(
      "¿Alguna vez respondes directamente?",
      "Do you ever answer directly?",
    ),
    witch("Sí.", "Yes."),
    doctor("...", "..."),
    witch("¿Ves?", "See?"),
  ]),
  conversation("quote.f", [
    witch("Pareces cansado. Descansa un poco, anda.", "You look tired. Rest a little, go on."),
    doctor("Estoy trabajando. Pero estoy contento.", "I'm working. But I'm happy."),
    witch(
      "No son conceptos incompatibles.",
      "Those aren't incompatible concepts.",
    ),
  ]),
  conversation("quote.g", [
    doctor(
      "Algún día voy a entenderte.",
      "One day I'm going to understand you.",
    ),
    witch("Espero que no.", "I hope not."),
    doctor("¿Por qué?", "Why?"),
    witch(
      "Perderíamos conversaciones excelentes.",
      "We'd lose excellent conversations.",
    ),
  ]),
  conversation("quote.h", [
    doctor(
      "¿No tienes ningún sitio al que ir?",
      "Don't you have anywhere to be?",
    ),
    witch("Sí.", "Yes."),
    doctor("¿Y?", "And?"),
    witch("Estoy aquí. Contigo, por ejemplo.", "I'm here. With you, for one."),
  ]),
];

// The index of a quote that is not the one just told (any when there is none
// yet). Pure: the random source is a parameter.
export function pickWitchQuote(
  last: number,
  random: () => number = Math.random,
): number {
  const count = WITCH_QUOTES.length;
  const candidates = Array.from({ length: count }, (_, index) => index).filter(
    (index) => index !== last,
  );

  return candidates[
    Math.min(candidates.length - 1, Math.floor(random() * candidates.length))
  ];
}
