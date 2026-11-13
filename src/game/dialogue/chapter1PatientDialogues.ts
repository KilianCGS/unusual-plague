import { BAKER_BEDROOM_INSTANCE_ID } from "../patients/chapter1Patients";
import type { LocalizedConversation } from "./localizedConversation";

// Conversations of the Chapter 1 patient case (the baker's husband) and of the
// contextual deliveries (cloth from the merchant, water from the river). "subject"
// is whoever started the conversation (the baker, the merchant, the husband).
// 2026-11-13: enriched pass in the Doctor's new voice (cheerful, close, serene).
// New text, awaiting Kilian's review. Missions, items and effects are unchanged.
const subject = (es: string, en: string) => ({
  speaker: "subject",
  text: { es, en },
});
// The baker as she stands in the bedroom (her own placed instance).
const bedroomBaker = (es: string, en: string) => ({
  speaker: BAKER_BEDROOM_INSTANCE_ID,
  text: { es, en },
});
const doctor = (es: string, en: string) => ({
  speaker: "doctor",
  text: { es, en },
});

export const bakerIntro: LocalizedConversation = {
  id: "chapter1.bakery.baker.intro",
  lines: [
    subject(
      "Doctor, gracias por venir tan pronto. Estoy tan preocupada que hoy ni se me ha pegado el pan.",
      "Doctor, thank you for coming so quickly. I'm so worried that, for once, I haven't even burnt the bread.",
    ),
    subject(
      "Es mi marido. Lleva dos noches con fiebre y no deja de tiritar. Le he echado todas las mantas y ni así entra en calor.",
      "It's my husband. He's had a fever for two nights and he won't stop shivering. I've piled every blanket on him and he still can't get warm.",
    ),
    doctor(
      "Tranquila, ya estoy aquí. Lléveme con él y lo vemos con calma.",
      "Don't worry, I'm here now. Take me to him and we'll look into it calmly.",
    ),
    subject(
      "Por aquí. Está en nuestro dormitorio. Cuidado con la harina del suelo, que resbala.",
      "This way. He's in our bedroom. Mind the flour on the floor, it's slippery.",
    ),
  ],
};

export const bakerWaiting: LocalizedConversation = {
  id: "chapter1.bakery.baker.waiting",
  lines: [
    subject(
      "¿Ha podido preparar algo para él? Cada vez que lo miro me parece más pálido.",
      "Have you managed to prepare something for him? Every time I look at him he seems paler.",
    ),
    doctor(
      "Todavía no, pero ya sé por dónde empezar. Vuelvo en cuanto lo tenga listo.",
      "Not yet, but I know where to start. I'll be back as soon as it's ready.",
    ),
    subject(
      "Aquí estaré. No me muevo de su lado ni aunque se queme el horno.",
      "I'll be here. I won't leave his side, not even if the oven burns.",
    ),
  ],
};

export const bakerDelivery: LocalizedConversation = {
  id: "chapter1.bakery.baker.delivery",
  lines: [
    doctor(
      "¡Aquí está! Una infusión medicinal y un paño frío, recién preparados. El paño, para la frente; la infusión, para dentro.",
      "Here it is! A medicinal infusion and a cold compress, freshly made. The compress for his forehead; the infusion for the inside.",
    ),
    subject(
      "Gracias a Dios. Se lo llevo ahora mismo.",
      "Thank God. I'll take them to him right now.",
    ),
    doctor(
      "Que se tome la infusión mientras esté calentita y que descanse mucho. Ya verá cómo mejora.",
      "Have him drink the infusion while it's warm, and let him rest plenty. You'll see how he improves.",
    ),
  ],
};

// The delivery with the thank-you inside it: the same handing-over, then her
// gift (Salt x1) in the same scene. No second visit is needed to collect it.
export const bakerDeliveryWithReward: LocalizedConversation = {
  id: "chapter1.bakery.baker.deliveryWithReward",
  lines: [
    ...bakerDelivery.lines,
    subject(
      "Gracias, Doctor. No es mucho, pero llévese esto: es lo que había en la despensa.",
      "Thank you, Doctor. It isn't much, but please take this: it's what I had in the pantry.",
    ),
    doctor(
      "¿Sal? ¡Qué detalle! Siempre viene bien.",
      "Salt? What a kind thought! It always comes in handy.",
    ),
    subject(
      "Siempre hace falta. Y a usted, que anda de casa en casa, más.",
      "One always needs some. And you, going from house to house, more than most.",
    ),
  ],
};

export const bakerAfter: LocalizedConversation = {
  id: "chapter1.bakery.baker.after",
  lines: [
    subject(
      "Ya tiene mejor color, y hasta me ha pedido un trozo de pan. No sé cómo agradecérselo, Doctor.",
      "He already has better colour, and he even asked me for a piece of bread. I don't know how to thank you, Doctor.",
    ),
    doctor(
      "Con verlo mejor me doy por más que pagado. Que siga descansando unos días.",
      "Seeing him better is payment enough. Let him keep resting for a few days.",
    ),
  ],
};

// The first time the baker is spoken to after her husband was treated: she
// thanks the Doctor with a practical gift. Nothing about what it is for.
export const bakerReward: LocalizedConversation = {
  id: "chapter1.bakery.baker.reward",
  lines: [
    subject(
      "Ya tiene mejor color, Doctor, y hasta pide pan. No es mucho, pero llévese esto.",
      "He already looks better, Doctor, and he's even asking for bread. It isn't much, but please take this.",
    ),
    doctor(
      "¿Sal? ¡Qué detalle! Siempre viene bien.",
      "Salt? What a kind thought! It always comes in handy.",
    ),
    subject(
      "Siempre hace falta. Y a usted, que anda de casa en casa, más.",
      "One always needs some. And you, going from house to house, more than most.",
    ),
  ],
};

// The same moment when the Doctor has nowhere to put it: the gift stays hers
// until he comes back with room.
export const bakerRewardNoRoom: LocalizedConversation = {
  id: "chapter1.bakery.baker.rewardNoRoom",
  lines: [
    subject(
      "Doctor, espere un momento. Quería darle algo por las molestias.",
      "Doctor, wait a moment. I wanted to give you something for your trouble.",
    ),
    doctor(
      "Se lo agradezco de corazón, pero ahora llevo las manos llenas. Hago sitio y vuelvo enseguida.",
      "I'm grateful from the heart, but my hands are full right now. I'll make room and be right back.",
    ),
  ],
};

export const husbandExam: LocalizedConversation = {
  id: "chapter1.bakery.husband.exam",
  lines: [
    subject(
      "Doctor... perdone el desorden. No me tengo en pie, y la cama está hecha un revoltijo de tanto dar vueltas.",
      "Doctor... forgive the mess. I can hardly stand, and the bed is in a heap from all my tossing.",
    ),
    doctor(
      "Tranquilo, está en buenas manos. Déjeme verle. ¿Desde cuándo tiene escalofríos?",
      "Easy now, you're in good hands. Let me have a look. How long have you had the chills?",
    ),
    subject(
      "Desde anteanoche. Y la cabeza me va a reventar, como si tuviera dentro el martillo del herrero.",
      "Since the night before last. And my head is about to split, as if I had the blacksmith's hammer inside it.",
    ),
    doctor(
      "Frente muy caliente, pulso rápido y sudor frío. Vale, voy a contrastarlo con el Compendio; con calma lo averiguamos.",
      "A very hot forehead, a quick pulse and a cold sweat. Right, I'll check it against the Compendium; calmly, we'll work it out.",
    ),
    bedroomBaker("¿Es grave, Doctor?", "Is it serious, Doctor?"),
    doctor(
      "Me ocupo de él, se lo prometo. Primero quiero estar seguro del diagnóstico, y para eso necesito mirar mis notas.",
      "I'll look after him, I promise. First I want to be sure of the diagnosis, and for that I need to check my notes.",
    ),
    subject(
      "Lo que usted diga, Doctor. Confío en usted.",
      "Whatever you say, Doctor. I trust you.",
    ),
  ],
};

export const merchantCloth: LocalizedConversation = {
  id: "chapter1.plaza.merchant.cloth",
  lines: [
    doctor(
      "Buenos días. ¿Tendría un poco de tela limpia? Me vendría muy bien.",
      "Good morning. Would you have a bit of clean cloth? It would help me a lot.",
    ),
    subject(
      "Justo me quedan un par de retales decentes. Tómelos, que para un enfermo no se regatea.",
      "I happen to have a couple of decent scraps left. Take them; you don't haggle over a sick man.",
    ),
    doctor("¡Muchísimas gracias!", "Thank you so much!"),
  ],
};
