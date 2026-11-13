import type { LocalizedConversation } from "./localizedConversation";

// What the people of the town say on DAY 3 and DAY 4 (2026-11-13), in place of the Day 2 lines
// they inherit. They only replace what a person says when nothing story-related is pending with
// them (the story resolvers go first). The draft is docs/AMBIENT_DAY3_4_DRAFT.md; ALL THE TEXT IS
// NEW and awaits Kilian's review. On Day 3 people begin to be "somewhere else" (something small
// in their hands, answering late) without ever saying what it is; on Day 4 (at night) only the
// few who are awake and clear-headed are left.
const npc = (es: string, en: string) => ({ speaker: "subject", text: { es, en } });
const doctor = (es: string, en: string) => ({ speaker: "doctor", text: { es, en } });
const talk = (id: string, lines: LocalizedConversation["lines"]): [string, LocalizedConversation] => [id, { id, lines }];

export const chapter3AmbientDialogues: Record<string, LocalizedConversation> = Object.fromEntries([
  talk("chapter3.bakery.baker", [
    npc("Mi marido ya amasa sentado. Dice que es \"supervisar\".", "My husband kneads sitting down now. He says it's \"supervising\"."),
    doctor("Pues con eso se recupera mejor.", "All the better for his recovery."),
    npc("Ayer, un cliente se pasó diez minutos mirando algo que llevaba en la mano y se fue sin el pan.", "Yesterday a customer spent ten minutes looking at something in his hand and left without his bread."),
  ]),
  talk("chapter3.bakeryStreet.man", [
    npc("Dejé el turno del pan a medias. Estaba a punto de acordarme de algo.", "I left my turn for the bread half-done. I was just about to remember something."),
    doctor("¿De qué?", "What was it?"),
    npc("Pues no sé. Ya se me ha ido.", "I don't know. It's gone now."),
  ]),
  talk("chapter3.bakeryStreet.woman", [
    npc("Hoy la campana ha sonado dos veces y nadie ha levantado la cabeza.", "Today the bell rang twice and nobody looked up."),
    doctor("Quizá estaban concentrados.", "Perhaps they were concentrating."),
    npc("Concentrados, sí. Pero no en nada que se vea.", "Concentrating, yes. But on nothing you can see."),
  ]),
  talk("chapter3.farm.woman", [
    npc("Las gallinas siguen como siempre. Es lo único que sigue como siempre.", "The hens are the same as ever. They're the only thing that is."),
    doctor("Eso también es un consuelo.", "That's a comfort too."),
    npc("Un consuelo con plumas, sí.", "A feathery comfort, yes."),
  ]),
  talk("chapter3.forest.woodcutter", [
    npc("El tocón y yo seguimos amigos. Esta mañana hasta me ha dado las gracias.", "The stump and I are still friends. This morning it even thanked me."),
    doctor("Me alegra verlo tan bien.", "I'm glad to see you so well."),
    npc("Mejor que los que pasan por el camino: pasan con la cabeza baja y casi me pisan el hacha.", "Better than those on the path: they walk past with their heads down and nearly tread on my axe."),
  ]),
  talk("chapter3.mine.recoveringMiner", [
    npc("La pierna va bien. Lo que no va bien es el eco.", "The leg's fine. What isn't fine is the echo."),
    doctor("¿El eco?", "The echo?"),
    npc("Antes la mina estaba llena de charla. Ahora se oye el pico y poco más.", "The mine used to be full of chatter. Now you hear the pick and not much else."),
  ]),
  talk("chapter3.outskirts.fisherman", [
    npc("Hoy sí han picado. Tres.", "They bit today. Three."),
    doctor("¡Enhorabuena!", "Congratulations!"),
    npc("Pero nadie ha venido a verlos. Antes me hacían corro.", "But nobody came to see them. People used to gather round."),
  ]),
  talk("chapter3.smithy.blacksmith", [
    npc("Mano buena, martillo contento.", "Good hand, happy hammer."),
    doctor("Me alegra oírlo. ¿Y el taller?", "Glad to hear it. And the workshop?"),
    npc("Más tranquilo de lo que me gusta. Entra gente y se va sin mirarme.", "Quieter than I like. People come in and leave without looking at me."),
  ]),
  talk("chapter3.tavern.bartender", [
    npc("Hoy hay más gente en la taberna que ayer, y se oye menos.", "More people in the tavern today than yesterday, and it's quieter."),
    doctor("¿Menos?", "Quieter?"),
    npc("Beben callados. Cada uno con lo suyo en la mano, que no es la jarra.", "They drink in silence. Each with their own thing in hand, and it isn't the tankard."),
  ]),
  talk("chapter3.tavernStreet.elder", [
    npc("Se me han acabado los vecinos con quien discutir.", "I've run out of neighbours to argue with."),
    doctor("¿Se han ido?", "Have they gone?"),
    npc("Están aquí. Pero ya no discuten.", "They're here. But they don't argue any more."),
  ]),
]);

export const chapter4AmbientDialogues: Record<string, LocalizedConversation> = Object.fromEntries([
  talk("chapter4.outskirts.fisherman", [
    npc("Con luna así no pican, pero se está bien.", "With a moon like this they don't bite, but it's pleasant."),
    doctor("Se está muy bien. ¿Puedo sentarme un momento?", "Very pleasant. May I sit a moment?"),
    npc("Siéntese. Aquí nadie tiene prisa por mirar nada.", "Sit. Nobody here is in a hurry to look at anything."),
  ]),
  talk("chapter4.tavernStreet.elder", [
    npc("Hoy ha venido alguien a sentarse a mi lado. Sin decir nada.", "Somebody came to sit beside me today. Saying nothing."),
    doctor("Eso también es compañía.", "That's company too."),
    npc("Ya lo creo. Se lo agradecí con la cabeza.", "I should say so. I thanked them with a nod."),
  ]),
  talk("chapter4.tavern.bartender", [
    npc("Cierro pronto. Nadie pide ya la segunda jarra.", "I'm closing early. Nobody orders a second tankard any more."),
    doctor("Descansará usted también.", "You'll get some rest too."),
    npc("Descansar, sí. Lo que echo en falta es el ruido.", "Rest, yes. What I miss is the noise."),
  ]),
  talk("chapter4.farm.woman", [
    npc("Las gallinas ya duermen. Yo me quedo un rato con la luz de la luna.", "The hens are asleep. I'll stay a while in the moonlight."),
    doctor("Es una buena luz.", "It's a good light."),
    npc("La única que no pide nada.", "The only one that asks for nothing."),
  ]),
]);

// The lines a person says on a given day, keyed by the Day 2 interactionId they inherit
// ("chapter2.bakery.baker" -> the Day 3 version, ...).
export function ambientForChapter(
  chapterId: string,
  interactionId: string,
): LocalizedConversation | undefined {
  if (!interactionId.startsWith("chapter2.")) return undefined;
  const rest = interactionId.slice("chapter2.".length);
  if (chapterId === "chapter-3") return chapter3AmbientDialogues[`chapter3.${rest}`];
  if (chapterId === "chapter-4") return chapter4AmbientDialogues[`chapter4.${rest}`];
  return undefined;
}
