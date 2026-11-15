import type { NpcTrade } from "./npcTrades";
import type { LocalizedConversation, LocalizedLine } from "./localizedConversation";

// THE VOLUNTARY ERRAND OF DAY 1 (2026-11-15, Kilian): the fisherman by the river asks for a cold cloth
// and pays three coins, so the first day also has "craft something for someone" outside the cases.
// Same mechanism as the Day 2 errands (see chapter2Errands.ts): the first talk is the request, then a
// reminder, then the delivery, then he goes back to his ordinary lines. Optional.
//
// ALL THE TEXT BELOW IS NEW (ES/EN) and awaits Kilian's review.
const npc = (es: string, en: string): LocalizedLine => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string): LocalizedLine => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedLine[]): LocalizedConversation => ({ id: `chapter1.errand.${id}`, lines });

export const FISHERMAN_INTERACTION_ID = "chapter1.outskirts.fisherman";
export const FISHERMAN_CLOTH_REWARD_ID = "chapter1.errand.fishermanCloth";

const ask = talk("fisherman.ask", [
  npc("Llevo toda la mañana al sol y ya no distingo si pica el pez o pica la cabeza.", "I've been in the sun all morning and I can't tell whether it's the fish or my head that's biting."),
  doctor("Un paño frío en la nuca le sentará bien: agua fresca y un trapo limpio.", "A cold cloth on the back of your neck will do you good: cool water and a clean rag."),
  npc("Tráigamelo y le doy tres monedas. Es lo que he pescado hoy, que ya es decir.", "Bring me one and I'll give you three coins. It's what I've caught today, which says it all."),
]);
const reminder = talk("fisherman.reminder", [
  npc("¿El paño? Sigo aquí, al sol, con la nuca ardiendo y la caña quieta.", "The cloth? Still here, in the sun, my neck on fire and the rod still."),
]);
const ready = talk("fisherman.ready", [
  doctor("Paño frío, recién mojado. Póngaselo en la nuca.", "A cold cloth, freshly wetted. Put it on the back of your neck."),
  npc("Qué alivio... Tome, tres monedas. Y no le cuente a los peces que me he sentado.", "What a relief... Here, three coins. And don't tell the fish I sat down."),
  doctor("Su secreto está a salvo conmigo.", "Your secret is safe with me."),
]);

export const CHAPTER1_ERRAND_TRADES: Record<string, NpcTrade> = {
  [FISHERMAN_INTERACTION_ID]: {
    interactionId: FISHERMAN_INTERACTION_ID,
    rewardId: FISHERMAN_CLOTH_REWARD_ID,
    chapters: ["chapter-1"],
    consumes: [{ itemId: "cold-cloth", quantity: 1 }],
    grants: [],
    payCoins: 3,
    ask,
    ready,
    missing: { all: reminder },
    objective: { es: "Llevar un paño frío al pescador del río", en: "Bring a cold cloth to the fisherman by the river" },
  },
};
