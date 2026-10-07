import type { LocalizedConversation } from "./localizedConversation";

// Chapter 1 AMBIENT conversations (no narrative state, no patients, no
// rewards): what an NPC says when the Doctor presses E. Keyed by the stable
// interactionId that the chapter's interaction zones name. Every line has ES
// and EN; "subject" is whoever started the conversation.
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
      doctor("Podría dejar de barrer.", "You could stop sweeping."),
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
      doctor("¿Cualquier mañana?", "Any morning?"),
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
      doctor("¿Quién gana?", "Who's winning?"),
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
      doctor("Consejo médico impecable.", "Impeccable medical advice."),
    ]),
    conversation("chapter1.forest.sittingVillager", [
      subject(
        "Hay quien dice que sentarse a mirar pasar el día es perder el tiempo.",
        "Some say sitting around watching the day go by is a waste of time.",
      ),
      doctor("¿Y usted qué dice?", "And what do you say?"),
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
        "¿Ha probado a quitarles la comida?",
        "Have you tried taking their food?",
      ),
      subject(
        "¿Y despertar mañana? Ni hablar.",
        "And wake up tomorrow? No, thank you.",
      ),
    ]),
    conversation("chapter1.mill.youngVillager", [
      subject(
        "El viejo dice que el molino escucha.",
        "The old man says the mill listens.",
      ),
      doctor("¿Y usted le cree?", "Do you believe him?"),
      subject(
        "Trabajo aquí todos los días. Prefiero no arriesgarme.",
        "I work here every day. I'd rather not risk it.",
      ),
    ]),
    conversation("chapter1.mine.injuredMiner", [
      subject("Ah... despacio. La pierna.", "Ah... easy. My leg."),
      doctor("Déjeme verla.", "Let me see it."),
      // Where the miner's case will formally begin later; for now it is only
      // the conversation (no patient state, mission or item is created).
      doctor(
        "Aguante. Volveré enseguida con algo para tratarla.",
        "Hold on. I'll be back soon with something to treat it.",
      ),
    ]),
    conversation("chapter1.mountainPath.miner", [
      subject(
        "¡Doctor! Mi compañero está dentro. Se hizo daño en la pierna y apenas puede moverse.",
        "Doctor! My partner's inside. He hurt his leg and can barely move.",
      ),
      doctor("¿Dónde?", "Where?"),
      subject(
        "Siga el túnel. Lo verá enseguida.",
        "Follow the tunnel. You'll see him soon enough.",
      ),
    ]),
    conversation("chapter1.outskirts.fisherman", [
      subject("Hoy no pican.", "They're not biting today."),
      doctor("Quizá no tengan hambre.", "Perhaps they're not hungry."),
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
      doctor("Tiene sus ventajas.", "It has its advantages."),
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
      doctor("¿Hoy es uno de esos días?", "Is today one of those days?"),
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
      doctor("¿Y al cuarto?", "And on the fourth?"),
      subject("Ya sería mala suerte.", "That would be bad luck."),
    ]),
    conversation("chapter1.plaza.merchantCustomer", [
      subject(
        "Llevo diez minutos intentando decidir si ese hombre es un estafador.",
        "I've spent ten minutes trying to decide whether that man is a fraud.",
      ),
      doctor("¿Y?", "And?"),
      subject("He comprado dos amuletos.", "I bought two charms."),
    ]),
    conversation("chapter1.smithy.blacksmith", [
      subject(
        "Si viene a decirme que el ruido es malo para los oídos, llega tarde.",
        "If you're here to tell me the noise is bad for my ears, you're too late.",
      ),
      doctor("Venía a saludar.", "I came to say hello."),
      subject("Ah. Eso sí puedo oírlo.", "Ah. That I can still hear."),
    ]),
    conversation("chapter1.smithyStreet.child", [
      subject(
        "Cuando sea mayor voy a tener una espada de verdad.",
        "When I'm older, I'm going to have a real sword.",
      ),
      doctor(
        "Procure conservar todos los dedos hasta entonces.",
        "Try to keep all your fingers until then.",
      ),
      subject("Lo intentaré.", "I'll try."),
    ]),
    conversation("chapter1.smithyStreet.sittingVillager", [
      subject(
        "El herrero lleva golpeando metal desde que salió el sol.",
        "The blacksmith's been hammering metal since sunrise.",
      ),
      doctor("Eso hacen los herreros.", "That's what blacksmiths do."),
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
      doctor("¿Cuánto ha bebido?", "How much did he drink?"),
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
      doctor("¿Y hoy?", "And today?"),
      subject("Hoy todavía es pronto.", "It's still early."),
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
