import type { LocalizedConversation } from "./localizedConversation";

// Chapter 1 AMBIENT conversations (no narrative state, no patients, no
// rewards): what an NPC says when the Doctor presses E. Keyed by the stable
// interactionId that the chapter's interaction zones name. Every line has ES
// and EN; "subject" is whoever started the conversation.
// 2026-11-13: enriched pass in the Doctor's new voice (cheerful, close, serene). New text,
// awaiting Kilian's review; the conversations keep their ids and their missions.
const subject = (es: string, en: string) => ({
  speaker: "subject",
  text: { es, en },
});
const doctor = (es: string, en: string) => ({
  speaker: "doctor",
  text: { es, en },
});

function conversation(
  id: string,
  lines: LocalizedConversation["lines"],
): [string, LocalizedConversation] {
  return [id, { id, lines }];
}

export const chapter1AmbientDialogues: Record<string, LocalizedConversation> =
  Object.fromEntries([
    conversation("chapter1.apothecaryStreet.sweepingWoman", [
      subject(
        "Barro por la mañana y por la tarde vuelve todo el polvo.",
        "I sweep in the morning, and by afternoon all the dust is back.",
      ),
      doctor("¿Y si se toma un respiro? Se lo ha ganado.", "Why not take a breather? You've earned it."),
      subject(
        "¿Y darle la victoria? Ni hablar.",
        "And let it win? Not a chance.",
      ),
    ]),
    conversation("chapter1.bakeryStreet.villager", [
      subject(
        "Dicen que el pan recién hecho arregla cualquier mañana.",
        "They say fresh bread can fix any morning.",
      ),
      doctor("¿Cualquier mañana? ¡Pues habrá que probarlo!", "Any morning? Well, we'll have to try it!"),
      subject(
        "Las realmente malas necesitan dos panes.",
        "The really bad ones need two loaves.",
      ),
    ]),
    conversation("chapter1.farm.woman", [
      subject(
        "Este año la tierra está dando guerra.",
        "The soil's putting up a fight this year.",
      ),
      doctor("¡Qué ánimo! ¿Y quién va ganando?", "What spirit! And who's winning?"),
      subject("Pregúnteme cuando haya comido.", "Ask me once I've eaten."),
    ]),
    conversation("chapter1.farm.dog", [subject("¡Guau!", "Woof!")]),
    conversation("chapter1.farm.sheep.01", [subject("Beeeh.", "Baaah.")]),
    conversation("chapter1.farm.sheep.02", [subject("Beeeh.", "Baaah.")]),
    conversation("chapter1.farm.sheep.03", [subject("Beeeh.", "Baaah.")]),
    conversation("chapter1.forest.woodcutter", [
      subject(
        "Si oye un árbol caer, procure que no sea hacia usted.",
        "If you hear a tree falling, make sure it isn't falling toward you.",
      ),
      doctor("¡Buen consejo! Lo tendré muy presente, gracias.", "Good advice! I'll keep it well in mind, thank you."),
    ]),
    conversation("chapter1.forest.sittingVillager", [
      subject(
        "Hay quien dice que sentarse a mirar pasar el día es perder el tiempo.",
        "Some say sitting around watching the day go by is a waste of time.",
      ),
      doctor("Yo creo que mirar también es una forma de aprender. ¿Y usted qué dice?", "I think looking is a way of learning too. What do you say?"),
      subject(
        "Que pueden decírmelo de pie.",
        "They're welcome to tell me while standing.",
      ),
    ]),
    conversation("chapter1.mill.oldFarmer", [
      subject(
        "Las gallinas comen mejor que yo.",
        "The chickens eat better than I do.",
      ),
      doctor(
        "¿Y si prueba a quitarles un poquito, con cariño?",
        "What if you took a little of it away, kindly?",
      ),
      subject(
        "¿Y despertar mañana? Ni hablar.",
        "And wake up tomorrow? No, thank you.",
      ),
    ]),
    // Ambient until the tavern case is examined; then the beekeeper trades
    // (npcTrades.ts) and this is what he says the rest of the time.
    conversation("chapter1.mill.beekeeper", [
      subject(
        "Las abejas y yo tenemos un acuerdo: yo no las molesto.",
        "The bees and I have an arrangement: I don't bother them.",
      ),
      doctor("¿Y ellas lo respetan?", "And do they respect it?"),
      subject("Ellas deciden si se cumple.", "They decide whether it holds."),
    ]),
    conversation("chapter1.mill.youngVillager", [
      subject(
        "El viejo dice que el molino escucha.",
        "The old man says the mill listens.",
      ),
      doctor("¿Y usted lo cree?", "And do you believe it?"),
      subject(
        "Trabajo aquí todos los días. Prefiero no arriesgarme.",
        "I work here every day. I'd rather not risk it.",
      ),
    ]),
    conversation("chapter1.mine.injuredMiner", [
      subject("Ah... despacio. La pierna.", "Ah... easy. My leg."),
      doctor("Tranquilo, déjeme verla.", "Easy now, let me see it."),
      // Shadowed by his case (storyInteractions.ts), which starts the first
      // time the Doctor talks to him; kept as the ambient fallback.
      doctor(
        "Aguante un poquito. Vuelvo enseguida con algo para tratarla.",
        "Hang in there. I'll be right back with something to treat it.",
      ),
    ]),
    // A miner at work: no quest of his own. He has a piece of coal for the
    // injured miner's case (storyInteractions.ts) once that case is examined.
    conversation("chapter1.mountainPath.miner", [
      subject(
        "Si viene buscando trabajo, ha elegido mal la ropa.",
        "If you're here looking for work, you picked the wrong clothes.",
      ),
      doctor("No vengo buscando trabajo, solo a saludar.", "I'm not looking for work, just saying hello."),
      subject(
        "Entonces ha elegido muy bien la ropa.",
        "Then you picked exactly the right clothes.",
      ),
      // A hint (2026-11-15): where the clean coal is. Said as small talk, nobody is sent anywhere.
      doctor(
        "Por casualidad, ¿sabe dónde conseguir un poco de carbón limpio?",
        "By any chance, do you know where I could get a little clean coal?",
      ),
      subject(
        "Pregunte en el campamento de la cantera, al que descansa sentado en el suelo. Siempre guarda un poco para su hoguera.",
        "Ask at the quarry camp, the one resting on the ground. He always keeps a little for his fire.",
      ),
    ]),
    // Witch at the bar: her real conversations live in storyInteractions.ts.
    conversation("chapter1.tavern.witch", [
      subject("Vaya. Tú otra vez.", "Well. You again."),
    ]),
    conversation("chapter1.outskirts.fisherman", [
      subject("Hoy no pican.", "They're not biting today."),
      doctor("Quizá hoy no tengan hambre. ¡Más suerte la próxima!", "Maybe they're not hungry today. Better luck next time!"),
      subject(
        "Doctor, no empiece a diagnosticarme los peces.",
        "Doctor, please don't start diagnosing my fish.",
      ),
    ]),
    conversation("chapter1.outskirts.washingWoman", [
      subject(
        "Doctor, con esa ropa negra debe de ser imposible saber cuándo está sucia.",
        "Doctor, with all those black clothes, it must be impossible to tell when they're dirty.",
      ),
      doctor("Tiene sus ventajas. ¡Y mucho estilo, ¿no cree?!", "It has its advantages. And plenty of style, don't you think?"),
      subject(
        "Eso explica más cosas de las que debería.",
        "That explains more than it should.",
      ),
    ]),
    conversation("chapter1.plaza.sittingVillager", [
      subject(
        "Hay días en los que uno debería hacer absolutamente nada.",
        "Some days a man should do absolutely nothing.",
      ),
      doctor("¿Hoy es uno de esos días? Pues disfrútelo.", "Is today one of those days? Then enjoy it."),
      subject(
        "Estoy realizando una investigación exhaustiva.",
        "I'm conducting extensive research.",
      ),
    ]),
    conversation("chapter1.plaza.cat", [subject("Mrrr...", "Mrrr...")]),
    conversation("chapter1.plaza.merchant", [
      subject(
        "Amuletos contra la mala suerte. Garantía de tres días.",
        "Charms against bad luck. Three-day guarantee.",
      ),
      doctor("¿Y al cuarto día?", "And on the fourth day?"),
      subject("Ya sería mala suerte.", "That would be bad luck."),
    ]),
    conversation("chapter1.plaza.merchantCustomer", [
      subject(
        "Llevo diez minutos intentando decidir si ese hombre es un estafador.",
        "I've spent ten minutes trying to decide whether that man is a fraud.",
      ),
      doctor("¿Y? ¿Qué tal ha ido?", "And? How did it go?"),
      subject("He comprado dos amuletos.", "I bought two charms."),
    ]),
    conversation("chapter1.smithy.blacksmith", [
      subject(
        "Si viene a decirme que el ruido es malo para los oídos, llega tarde.",
        "If you're here to tell me the noise is bad for my ears, you're too late.",
      ),
      doctor("Venía a saludar, nada más.", "I only came to say hello."),
      subject("Ah. Eso sí puedo oírlo.", "Ah. That I can still hear."),
    ]),
    conversation("chapter1.smithyStreet.child", [
      subject(
        "Cuando sea mayor voy a tener una espada de verdad.",
        "When I'm older, I'm going to have a real sword.",
      ),
      doctor(
        "Pues cuide mucho esos dedos hasta entonces.",
        "Then take good care of those fingers until then.",
      ),
      subject("Lo intentaré.", "I'll try."),
    ]),
    conversation("chapter1.smithyStreet.sittingVillager", [
      subject(
        "El herrero lleva golpeando metal desde que salió el sol.",
        "The blacksmith's been hammering metal since sunrise.",
      ),
      doctor("Eso hacen los herreros: ¡con muchas ganas!", "That's what blacksmiths do: and with gusto!"),
      subject(
        "Sí, pero podría hacerlo más bajo.",
        "Yes, but he could do it more quietly.",
      ),
    ]),
    conversation("chapter1.tavern.bartender", [
      subject(
        "Doctor, échele un vistazo al hombre del suelo. Antes estaba bebiendo. Ahora solo se queja.",
        "Doctor, take a look at the man on the floor. He was drinking earlier. Now he just groans.",
      ),
      doctor("¿Cuánto ha bebido, más o menos?", "How much has he had, roughly?"),
      subject(
        "Menos de lo necesario para explicar eso.",
        "Not enough to explain that.",
      ),
    ]),
    conversation("chapter1.tavern.sickPatient", [
      subject("Ughh...", "Ughh..."),
      subject("Mi vientre...", "My stomach..."),
      subject("Ouch...", "Ouch..."),
    ]),
    conversation("chapter1.tavernStreet.woman", [
      subject(
        "Anoche juré que no volvería a entrar en esa taberna.",
        "Last night I swore I'd never set foot in that tavern again.",
      ),
      doctor("¿Y hoy? ¿Cómo lleva la promesa?", "And today? How's the promise holding?"),
      subject("Hoy todavía es pronto.", "It's still early."),
    ]),
    // (unused since 2026-11-15: the fruit seller was removed from the scene)
    conversation("chapter1.tavernStreet.seller", [
      subject(
        "Fruta fresca, doctor. Hoy la manzana está más tranquila que la gente de la taberna.",
        "Fresh fruit, doctor. Today the apples are calmer than the folk at the tavern.",
      ),
      doctor("¿Algo para el estómago?", "Anything for the stomach?"),
      subject(
        "Una manzana al día. Lo demás, hágaselo mirar a usted.",
        "An apple a day. For the rest, you're the doctor.",
      ),
    ]),
    // The stonecutter resting on the ground (2026-11-16: he replaced the man seen from behind). New
    // text, awaiting Kilian's review.
    conversation("chapter1.quarry.backMan", [
      subject(
        "Perdone que no me levante, doctor. Hoy la piedra ha ganado.",
        "Forgive me for not getting up, doctor. The stone won today.",
      ),
      doctor("¿Tan duro ha sido el día?", "Has the day been that hard?"),
      subject(
        "Duro, no. Largo. Por eso me siento, a ver si se acorta.",
        "Not hard: long. That's why I sit down, to see if it gets shorter.",
      ),
    ]),
    // The quarry camp (2026-11-15). New text, awaiting Kilian's review.
    conversation("chapter1.quarry.woman", [
      subject(
        "Les traigo el almuerzo a estos. Si no, la piedra les sabe a pan, y el pan, a piedra.",
        "I bring these lads their lunch. Otherwise the stone tastes like bread, and the bread like stone.",
      ),
      doctor("¿Alguno anda con tos o con dolores?", "Is anyone coughing or aching?"),
      subject(
        "Todos, un poco. Pero hoy ninguno se ha quejado, y eso por aquí ya es salud.",
        "All of them, a little. But today nobody has complained, and around here that counts as health.",
      ),
    ]),
    conversation("chapter1.quarry.stonecutterShovel", [
      subject(
        "Apoyado en la pala se lleva mejor la mañana. La pala no se queja.",
        "Leaning on the shovel the morning goes easier. The shovel doesn't complain.",
      ),
      doctor("¿Y la espalda?", "And your back?"),
      subject(
        "La espalda sí. Pero a ella no le pregunta nadie.",
        "My back does. But nobody asks it anything.",
      ),
    ]),
    conversation("chapter1.quarry.stonecutterStool", [
      subject(
        "Me siento un momento y el taburete ya me da la razón.",
        "I sit for a moment and the stool already agrees with me.",
      ),
      doctor("¿Tanto cansa partir piedra?", "Does splitting stone tire you that much?"),
      subject(
        "Cansa no partirla. Cuando uno para, es cuando se entera de todo.",
        "What tires is not splitting it. It's when you stop that you notice everything.",
      ),
    ]),
    // The woman at the left of the Tavern Street (2026-11-15): she says the lines already written for the
    // retired placement (the Tavern Street woman 02), under an id of her own.
    conversation("chapter1.tavernStreet.womanLeft", [
      subject(
        "Anoche juré que no volvería a entrar en esa taberna.",
        "Last night I swore I'd never set foot in that tavern again.",
      ),
      doctor("¿Y hoy? ¿Cómo lleva la promesa?", "And today? How's the promise holding?"),
      subject("Hoy todavía es pronto.", "It's still early."),
    ]),
    // The farmer hoeing in the mill farmland (2026-11-15, Kilian): the old farmer's lines, under an id of his own.
    conversation("chapter1.mill.farmerHoeing", [
      subject(
        "Las gallinas comen mejor que yo.",
        "The chickens eat better than I do.",
      ),
      doctor(
        "¿Y si prueba a quitarles un poquito, con cariño?",
        "What if you took a little of it away, kindly?",
      ),
      subject(
        "¿Y despertar mañana? Ni hablar.",
        "And wake up tomorrow? No, thank you.",
      ),
    ]),
    conversation("chapter1.tavernStreet.man", [
      subject(
        "Dicen que beber solo trae problemas.",
        "They say drinking only brings trouble.",
      ),
      doctor("¿Y?", "And?"),
      subject(
        "Por eso procuro beber acompañado.",
        "That's why I make sure I never drink alone.",
      ),
    ]),
  ]);
