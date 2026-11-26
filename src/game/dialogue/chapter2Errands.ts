import type { NpcTrade } from "./npcTrades";
import type { LocalizedConversation, LocalizedLine } from "./localizedConversation";

// THE VOLUNTARY ERRANDS OF DAY 2 (2026-11-15, Kilian approved the direction): three townspeople
// who are already placed ask for a preparation that no case needs, and pay for it. They make the
// recipes that were unused (onion syrup, strong broth, rehydration drink) worth cooking, and they
// are the "collect -> craft -> reward" loop outside the cases. Nothing blocks the day: they are
// optional. The Doctor learns each one by talking to the person (the first conversation is the
// request, afterwards a short reminder), so he investigates which preparation fits.
//
// ALL THE TEXT BELOW IS NEW (ES/EN) and awaits Kilian's review.
const npc = (es: string, en: string): LocalizedLine => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string): LocalizedLine => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedLine[]): LocalizedConversation => ({ id: `chapter2.errand.${id}`, lines });

// ---- the old man with the jug (Tavern Street): onion syrup, 9 coins -------------------------------
export const ELDER_INTERACTION_ID = "chapter2.tavernStreet.elder";
export const ELDER_SYRUP_REWARD_ID = "chapter2.errand.elderSyrup";

const elderAsk = talk("elder.ask", [
  npc("Esta tos me acompaña desde que cambió el tiempo. Dicen que la cebolla con azúcar la espanta.", "This cough has kept me company since the weather turned. They say onion with sugar scares it off."),
  doctor("Un jarabe de cebolla. Puedo prepararlo, y no le pediré que se lo beba con cara de héroe.", "An onion syrup. I can make it, and I won't ask you to drink it with a hero's face."),
  npc("Tráigamelo y le pago nueve monedas. Y no prometo ninguna cara.", "Bring it to me and I'll pay you nine coins. And I promise no faces at all."),
]);
const elderReminder = talk("elder.reminder", [
  npc("¿Ya tiene el jarabe? La tos no espera, pero yo sí: estoy sentado.", "Have you got the syrup yet? The cough won't wait, but I will: I'm sitting down."),
]);
const elderReady = talk("elder.ready", [
  doctor("Aquí tiene el jarabe de cebolla, todavía templado.", "Here's the onion syrup, still warm."),
  npc("Huele a cocina de abuela. Nueve monedas, como quedamos.", "It smells like grandmother's kitchen. Nine coins, as agreed."),
  doctor("Es un precio generoso para un jarabe.", "That's a generous price for a syrup."),
  npc("Es un precio justo por dormir esta noche.", "It's a fair price for sleeping tonight."),
]);

// ---- the woman of the Bakery Street: strong broth, sugar + 2 coins --------------------------------
export const BAKERY_NEIGHBOUR_INTERACTION_ID = "chapter2.bakeryStreet.woman";
export const BAKERY_BROTH_REWARD_ID = "chapter2.errand.bakeryBroth";

const brothAsk = talk("bakery.ask", [
  npc("Mi vecina la panadera dice que su marido sigue flojo. Pan no le falta, pero el pan no es sustancia.", "My neighbour the baker says her husband is still weak. He has no lack of bread, but bread isn't substance."),
  doctor("Un caldo fuerte, de cebolla y hueso. Así se le devuelve cuerpo a un convaleciente.", "A strong broth, with onion and bone. That puts body back into a convalescent."),
  npc("Si lo prepara, le doy un puñado de azúcar y dos monedas. De la panadería, claro: yo solo hago de mensajera.", "If you make it, I'll give you a handful of sugar and two coins. From the bakery, of course: I'm only the messenger."),
]);
const brothReminder = talk("bakery.reminder", [
  npc("¿Y el caldo, doctor? Mi vecina pregunta cada mañana y ya no sé qué contestarle.", "And the broth, doctor? My neighbour asks every morning and I no longer know what to tell her."),
]);
const brothReady = talk("bakery.ready", [
  doctor("Caldo fuerte, de cebolla y hueso. Que se lo tome bien caliente.", "Strong broth, with onion and bone. Have him drink it good and hot."),
  npc("Se lo llevo en cuanto lo tenga. Tome: azúcar y dos monedas, como dije.", "I'll take it to him as soon as I can. Here: sugar and two coins, as I said."),
  doctor("Con esto tengo para un jarabe y para ser feliz.", "With this I have enough for a syrup and to be happy."),
  npc("Lo primero, seguro. Lo segundo, ya veremos.", "The first one, for sure. The second, we'll see."),
]);

// ---- the seated man of the Tavern Street: rehydration drink, 9 coins ------------------------------
export const SEATED_MAN_INTERACTION_ID = "chapter2.tavernStreet.sitting";
export const SEATED_MAN_DRINK_REWARD_ID = "chapter2.errand.seatedDrink";

const drinkAsk = talk("seated.ask", [
  npc("Desde aquí veo salir a los de la taberna con la boca seca y la cabeza hecha un tambor.", "From here I watch the tavern folk come out with dry mouths and heads like drums."),
  doctor("Agua con un poco de azúcar y sal repone lo que se pierde. Es un remedio humilde.", "Water with a little sugar and salt puts back what's lost. A humble remedy."),
  npc("Los humildes son los que funcionan. Tráigame una bebida de esas y le pago nueve monedas.", "The humble ones are the ones that work. Bring me one of those drinks and I'll pay nine coins."),
]);
const drinkReminder = talk("seated.reminder", [
  npc("¿La bebida? Aquí me tiene, sentado, esperando con paciencia y con sed.", "The drink? Here I am, sitting, waiting with patience and with thirst."),
]);
const drinkReady = talk("seated.ready", [
  doctor("Bebida hidratante: agua, azúcar y sal. Sabe a poco y hace mucho.", "Hydrating drink: water, sugar and salt. It tastes of little and does a lot."),
  npc("Como todo lo bueno de esta calle. Aquí tiene sus nueve monedas.", "Like everything good on this street. Here are your nine coins."),
  doctor("¿Se la bebe usted?", "Will you drink it yourself?"),
  npc("Yo no. La guardo para el próximo que salga de la taberna arrepentido.", "Not me. I'm keeping it for the next one who walks out of the tavern full of regret."),
]);

// What each errand IS, as trades (the generic mechanism of npcTrades.ts, plus `ask`).
export const CHAPTER2_ERRAND_TRADES: Record<string, NpcTrade> = {
  [ELDER_INTERACTION_ID]: {
    interactionId: ELDER_INTERACTION_ID,
    rewardId: ELDER_SYRUP_REWARD_ID,
    consumes: [{ itemId: "onion-syrup", quantity: 1 }],
    grants: [],
    payCoins: 9,
    ask: elderAsk,
    ready: elderReady,
    missing: { all: elderReminder },
    objective: { es: "Llevar jarabe de cebolla al anciano del cántaro", en: "Bring onion syrup to the old man with the jug" },
  },
  [BAKERY_NEIGHBOUR_INTERACTION_ID]: {
    interactionId: BAKERY_NEIGHBOUR_INTERACTION_ID,
    rewardId: BAKERY_BROTH_REWARD_ID,
    consumes: [{ itemId: "strong-broth", quantity: 1 }],
    grants: [{ itemId: "sugar", quantity: 1 }],
    payCoins: 2,
    ask: brothAsk,
    ready: brothReady,
    missing: { all: brothReminder },
    objective: { es: "Llevar caldo fuerte a la vecina de la panadería", en: "Bring strong broth to the bakery's neighbour" },
  },
  [SEATED_MAN_INTERACTION_ID]: {
    interactionId: SEATED_MAN_INTERACTION_ID,
    rewardId: SEATED_MAN_DRINK_REWARD_ID,
    consumes: [{ itemId: "rehydration-drink", quantity: 1 }],
    grants: [],
    payCoins: 9,
    ask: drinkAsk,
    ready: drinkReady,
    missing: { all: drinkReminder },
    objective: { es: "Llevar una bebida hidratante al hombre sentado de la calle de la taberna", en: "Bring a hydrating drink to the seated man on the tavern street" },
  },
};
