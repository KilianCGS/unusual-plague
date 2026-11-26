import type { NpcTrade } from "./npcTrades";
import type { LocalizedConversation, LocalizedLine } from "./localizedConversation";

// THE VOLUNTARY ERRANDS OF DAY 3 (2026-11-18, Kilian chose them): the carpenter of the Smithy Street asks for a
// cold cloth and the elderly couple of the plaza for a hydrating drink. Same mechanism as the errands of
// Days 1-2 (chapter1Errands.ts, chapter2Errands.ts): the first talk is the request, then a reminder, then the
// delivery. Optional; they pay a little in coins.
//
// ALL THE TEXT BELOW IS NEW (ES/EN) and awaits Kilian's review.
const npc = (es: string, en: string): LocalizedLine => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string): LocalizedLine => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedLine[]): LocalizedConversation => ({ id: `chapter3.errand.${id}`, lines });

// ---- the carpenter (Smithy Street): cold cloth, 3 coins --------------------------------------------
export const CARPENTER_INTERACTION_ID = "chapter3.smithyStreet.carpenter";
export const CARPENTER_CLOTH_REWARD_ID = "chapter3.errand.carpenterCloth";

const carpenterAsk = talk("carpenter.ask", [
  npc("Corto recto, mido dos veces, y esta tabla me ha salido torcida. Y ahora, además, me martillea la cabeza.", "I cut straight, I measure twice, and this board still came out crooked. And now my head is hammering too."),
  doctor("Un paño frío en la frente le vendrá bien: agua fresca y un trapo limpio.", "A cold cloth on your forehead will do you good: cool water and a clean rag."),
  npc("Tráigamelo y le doy cuatro monedas. Pagaría más, pero la tabla torcida no se vende.", "Bring me one and I'll give you four coins. I'd pay more, but a crooked board won't sell."),
]);
const carpenterReminder = talk("carpenter.reminder", [
  npc("¿El paño, doctor? Sigo aquí, con la cabeza dando golpes como mi mazo.", "The cloth, doctor? Still here, my head knocking like my mallet."),
]);
const carpenterReady = talk("carpenter.ready", [
  doctor("Paño frío, recién mojado. Sobre la frente y unos minutos con los ojos cerrados.", "A cold cloth, freshly wetted. On your forehead, and a few minutes with your eyes closed."),
  npc("Ahhh... Esto sí que es una buena herramienta. Tome sus cuatro monedas.", "Ahhh... Now that is a good tool. Here are your four coins."),
  doctor("Y mida con la cabeza fresca, que la tabla se lo agradecerá.", "And measure with a cool head; the board will thank you."),
]);

// ---- the elderly couple of the plaza: rehydration drink, 4 coins -----------------------------------
export const ELDERLY_COUPLE_INTERACTION_ID = "chapter3.plaza.elderMan";
export const ELDERLY_COUPLE_DRINK_REWARD_ID = "chapter3.errand.elderlyDrink";

const coupleAsk = talk("couple.ask", [
  npc("Con tanto rezar y tanto sol, mi mujer y yo salimos de misa secos como una pasa.", "With so much praying and so much sun, my wife and I come out of Mass dry as raisins."),
  doctor("Agua con un poco de azúcar y sal repone lo que se pierde. Es un remedio humilde.", "Water with a little sugar and salt puts back what's lost. A humble remedy."),
  npc("Prepárenos una bebida de esas y le damos seis monedas. Lo que sobre lo pagamos en pasteles.", "Make us one of those drinks and we'll give you six coins. Whatever's left over, we'll pay in pastries."),
]);
const coupleReminder = talk("couple.reminder", [
  npc("¿La bebida, doctor? Seguimos aquí sentados, con paciencia y con sed.", "The drink, doctor? We're still sitting here, with patience and with thirst."),
]);
const coupleReady = talk("couple.ready", [
  doctor("Bebida hidratante: agua, azúcar y sal. Sabe a poco y hace mucho.", "Hydrating drink: water, sugar and salt. It tastes of little and does a lot."),
  npc("Los dos a medias, como siempre. Aquí tiene sus seis monedas.", "Half each, as always. Here are your six coins."),
  doctor("Beban despacio, a sorbitos.", "Drink slowly, in little sips."),
]);

export const CHAPTER3_ERRAND_TRADES: Record<string, NpcTrade> = {
  [CARPENTER_INTERACTION_ID]: {
    interactionId: CARPENTER_INTERACTION_ID,
    rewardId: CARPENTER_CLOTH_REWARD_ID,
    chapters: ["chapter-3"],
    consumes: [{ itemId: "cold-cloth", quantity: 1 }],
    grants: [],
    payCoins: 4,
    ask: carpenterAsk,
    ready: carpenterReady,
    missing: { all: carpenterReminder },
    objective: { es: "Llevar un paño frío al carpintero de la calle de la herrería", en: "Bring a cold cloth to the carpenter on the smithy street" },
  },
  [ELDERLY_COUPLE_INTERACTION_ID]: {
    interactionId: ELDERLY_COUPLE_INTERACTION_ID,
    rewardId: ELDERLY_COUPLE_DRINK_REWARD_ID,
    chapters: ["chapter-3"],
    consumes: [{ itemId: "rehydration-drink", quantity: 1 }],
    grants: [],
    payCoins: 6,
    ask: coupleAsk,
    ready: coupleReady,
    missing: { all: coupleReminder },
    objective: { es: "Llevar una bebida hidratante a los ancianos de la plaza", en: "Bring a hydrating drink to the elderly couple in the plaza" },
  },
};
