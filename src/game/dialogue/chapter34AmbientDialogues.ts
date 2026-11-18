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

// THE SPEAR KNIGHT IN FRONT OF THE MINE, DAY 3 (2026-11-17, Kilian: "hay desprendimientos"). NEW TEXT, awaiting
// Kilian's review. The mine entrance is shut on Day 3 (see world/lockedDoors.ts); he explains why.
export const CHAPTER3_MINE_GUARD_ID = "chapter3.mountainPath.guard";
export const chapter3MineGuardDialogue: Record<string, LocalizedConversation> = Object.fromEntries([
  talk(CHAPTER3_MINE_GUARD_ID, [
    npc("Alto, Doctor. La mina está cerrada hasta nuevo aviso.", "Halt, Doctor. The mine is closed until further notice."),
    doctor("¿Ha pasado algo?", "Has something happened?"),
    npc("Desprendimientos. El techo del primer túnel ha cedido, y nadie sabe qué más está suelto ahí dentro.", "Rockfalls. The roof of the first tunnel has given way, and nobody knows what else is loose in there."),
    doctor("Quizá pueda echar una mano.", "Perhaps I can lend a hand."),
    npc("Hoy no. No dejo pasar a nadie, ni siquiera a usted. Fuera de la mina hay trabajo de sobra.", "Not today. I let nobody through, not even you. There's plenty of work outside the mine."),
  ]),
]);

// THE PEOPLE OF DAY 3 WHO HAD NO WORDS (2026-11-18, Kilian: "dar voz a los mudos"). Everybody Kilian placed in
// Day 3 now talks: 3 lines each, with the day's small oddness (something small in their hands, a late answer)
// and never saying what it is. NEW TEXT, awaiting Kilian's review. Their ids are in compositions/chapter-3.interactions.ts.
export const chapter3PeopleDialogues: Record<string, LocalizedConversation> = Object.fromEntries([
  talk("chapter3.plaza.priest", [
    npc("Rezo por todos. Hoy cuesta: la mitad de la plaza mira al suelo y la otra mitad, a su mano.", "I pray for everyone. It's hard today: half the plaza looks at the ground and the other half at their hand."),
    doctor("¿A su mano?", "At their hand?"),
    npc("A algo pequeño que llevan. No he conseguido ver qué, y mira que tengo buena vista para lo que no se debe mirar.", "At something small they carry. I haven't managed to see what, and I do have a good eye for what one shouldn't look at."),
  ]),
  talk("chapter3.plaza.prayingMan", [
    npc("Chis. Estoy a mitad de una oración y a mitad de un pensamiento.", "Shh. I'm halfway through a prayer and halfway through a thought."),
    doctor("¿Y cuál va ganando?", "Which one is winning?"),
    npc("El pensamiento. Qué vergüenza.", "The thought. How embarrassing."),
  ]),
  talk("chapter3.plaza.prayingYoungWoman", [
    npc("Pido que se me pase la prisa.", "I'm asking for my hurry to pass."),
    doctor("¿Prisa por qué?", "Hurry for what?"),
    npc("Por llegar. A todo. Sin saber adónde.", "To arrive. Everywhere. Without knowing where."),
  ]),
  talk("chapter3.plaza.prayingOldWoman", [
    npc("No me hable ahora, hijo, que se me va el rezo.", "Don't speak to me now, son, I'll lose my place."),
    doctor("Perdone, vuelvo luego.", "Forgive me, I'll come back later."),
    npc("Ya se me ha ido. Dígame, ¿qué quería?", "It's gone already. Tell me, what did you want?"),
  ]),
  talk("chapter3.plaza.elderMan", [
    npc("Aquí sentado se ve pasar todo. Antes también se oía.", "Sitting here you see everything pass. It used to be heard, too."),
    doctor("¿Qué se oía?", "What was there to hear?"),
    npc("Gente. Ahora pasan en silencio, con la cabeza gacha. Mi mujer y yo apostamos a ver quién levanta la vista primero.", "People. Now they walk by in silence, heads down. My wife and I bet on who will look up first."),
  ]),
  talk("chapter3.plaza.elderWoman", [
    npc("Mi marido dice que usted levantará la vista al pasar. Yo, que no.", "My husband says you'll look up as you pass. I say you won't."),
    doctor("Pues ha perdido usted: la estoy mirando.", "Then you've lost: I'm looking right at you."),
    npc("Ay, qué vergüenza. Dos pasteles, entonces.", "Oh, how embarrassing. Two pastries, then."),
  ]),
  talk("chapter3.tavernStreet.neighbour", [
    npc("Mi vecino lleva tres días sin darme los buenos días. Hoy le ha dicho \"perdón\" a la pared.", "My neighbour hasn't said good morning in three days. Today he said \"sorry\" to the wall."),
    doctor("¿A la pared?", "To the wall?"),
    npc("Iba mirando algo que llevaba en la mano y chocó con ella. Qué cosas.", "He was looking at something he held and walked into it. Honestly."),
  ]),
  talk("chapter3.tavernStreet.topBoy", [
    npc("¡Mire, doctor! ¡Ya aguanta una vuelta entera!", "Look, doctor! It can last a whole spin now!"),
    doctor("¡Enhorabuena, qué puntería!", "Congratulations, what a feat!"),
    npc("Nadie ha visto la vuelta entera. Todos miraban otra cosa.", "Nobody saw the whole spin. Everyone was looking at something else."),
  ]),
  talk("chapter3.tavernInterior.drinker", [
    npc("Pedí otra jarra y no sé si me la han servido. Estaba mirando algo.", "I ordered another tankard and I don't know whether it was served. I was looking at something."),
    doctor("¿Mirando qué?", "Looking at what?"),
    npc("Pues eso: que no lo recuerdo.", "That's the thing: I can't remember."),
  ]),
  talk("chapter3.outskirts.washer", [
    npc("El río trae hoy menos charla. Antes las lavanderas hablábamos más que el agua.", "The river brings less chatter today. We washerwomen used to talk more than the water."),
    doctor("¿Y hoy?", "And today?"),
    npc("Hoy solo se oye el agua. Y un zumbido pequeñito, que viene y va.", "Today you only hear the water. And a tiny hum that comes and goes."),
  ]),
  talk("chapter3.mill.woman", [
    npc("Salí a por huevos y volví a casa con la cesta vacía. Me entretuve.", "I went out for eggs and came home with an empty basket. I got held up."),
    doctor("¿Con qué?", "With what?"),
    npc("Con nada. Y no me di cuenta de cuánto rato.", "With nothing. And I didn't notice how long it took."),
  ]),
  talk("chapter3.mill.stonecutter", [
    npc("Me han mandado a cavar una zanja. Llevo la pala más tiempo en la mano que en la tierra.", "They sent me to dig a ditch. I've held the shovel longer than I've put it in the ground."),
    doctor("¿Descansando?", "Resting?"),
    npc("Pensando. Creo. Ya no distingo.", "Thinking. I believe. I can't tell any more."),
  ]),
  talk("chapter3.bakeryStreet.basketWoman", [
    npc("Llevo los huevos de la panadera y el pan de mi casa, y se me ha mezclado todo.", "I'm carrying the baker's eggs and the bread for my house, and it's all got mixed up."),
    doctor("Bueno, un huevo con pan es una comida.", "Well, an egg with bread is a meal."),
    npc("Eso mismo ha dicho mi marido, sin levantar la vista.", "That's just what my husband said, without looking up."),
  ]),
  talk("chapter3.smithyStreet.ropeGirl", [
    npc("¡Treinta y dos sin fallar!", "Thirty-two without a miss!"),
    doctor("¡Qué barbaridad! ¿Quién lleva la cuenta?", "Goodness! Who's counting?"),
    npc("Yo sola. Antes mi hermano contaba en voz alta.", "Me, alone. My brother used to count out loud."),
  ]),
  talk("chapter3.smithyStreet.carpenter", [
    npc("Corto recto, mido dos veces, y esta tabla me ha salido torcida.", "I cut straight, I measure twice, and this board still came out crooked."),
    doctor("Le pasa a los mejores.", "It happens to the best."),
    npc("Es que miré un segundo hacia otro lado. Con eso basta.", "I looked away for just a second. That's all it takes."),
  ]),
  talk("chapter3.mountainPath.archerBoy", [
    npc("Les aviso \"¡cuidado, flecha!\" y ni se apartan.", "I warn them \"watch out, arrow!\" and they don't even step aside."),
    doctor("Qué descuido. ¿Sueles apuntar a alguien?", "How careless. Do you ever aim at anyone?"),
    npc("¡Qué va! Menos mal: ni me ven.", "No way! Lucky for them: they don't even see me."),
  ]),
  talk("chapter3.mountainPath.swordBoy", [
    npc("¡Defiendo el camino! Nadie pasa sin mi permiso.", "I'm defending the path! Nobody passes without my permission."),
    doctor("¿Puedo pasar yo?", "May I pass?"),
    npc("Usted sí, que es el médico. Los demás ni me ven: van mirando algo.", "You may, you're the doctor. The rest don't even see me: they're looking at something."),
  ]),
  talk("chapter3.quarry.visitor", [
    npc("Vine a cobrar una deuda y me he quedado mirando las piedras.", "I came to collect a debt and ended up looking at the stones."),
    doctor("Son muy mirables.", "They're very lookable."),
    npc("Antes no lo eran. Hoy me parecen más interesantes que mi dinero, y eso es mal síntoma.", "They weren't before. Today they seem more interesting than my money, and that's a bad sign."),
  ]),
  talk("chapter3.quarry.minersWife", [
    npc("Es mi marido. Se queja de las encías, no de lo que come: pan duro, siempre.", "He's my husband. He complains about his gums, not about what he eats: hard bread, always."),
    doctor("Eso me dice mucho. Gracias.", "That tells me a lot. Thank you."),
    npc("Le llevo caldo y ni lo prueba. Está distraído.", "I bring him broth and he doesn't even taste it. He's distracted."),
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
