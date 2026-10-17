import { BAKER_BEDROOM_INSTANCE_ID } from "../patients/chapter1Patients";
import type { LocalizedConversation } from "./localizedConversation";

// Conversations of the Chapter 1 patient case (the baker's husband) and of the
// contextual deliveries (cloth from the merchant, water from the river). "subject"
// is whoever started the conversation (the baker, the merchant, the husband).
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
      "Doctor, gracias por venir tan pronto.",
      "Doctor, thank you for coming so quickly.",
    ),
    subject(
      "Es mi marido. Lleva dos noches con fiebre y no deja de tiritar.",
      "It's my husband. He's had a fever for two nights and he won't stop shivering.",
    ),
    doctor("Lléveme con él.", "Take me to him."),
    subject(
      "Por aquí. Está en nuestro dormitorio.",
      "This way. He's in our bedroom.",
    ),
  ],
};

export const bakerWaiting: LocalizedConversation = {
  id: "chapter1.bakery.baker.waiting",
  lines: [
    subject(
      "¿Ha podido preparar algo para él?",
      "Have you managed to prepare something for him?",
    ),
    doctor(
      "Todavía no. Volveré en cuanto lo tenga.",
      "Not yet. I'll be back as soon as I have it.",
    ),
    subject(
      "Aquí estaré. No me muevo de su lado.",
      "I'll be here. I won't leave his side.",
    ),
  ],
};

export const bakerDelivery: LocalizedConversation = {
  id: "chapter1.bakery.baker.delivery",
  lines: [
    doctor(
      "Aquí tiene: una infusión medicinal y un paño frío.",
      "Here you are: a medicinal infusion and a cold compress.",
    ),
    subject(
      "Gracias a Dios. Se lo llevo ahora mismo.",
      "Thank God. I'll take them to him right now.",
    ),
    doctor(
      "Que beba la infusión mientras esté caliente, y que repose.",
      "Have him drink the infusion while it's hot, and let him rest.",
    ),
  ],
};

export const bakerAfter: LocalizedConversation = {
  id: "chapter1.bakery.baker.after",
  lines: [
    subject(
      "Ya tiene mejor color. No sé cómo agradecérselo, Doctor.",
      "He already has better colour. I don't know how to thank you, Doctor.",
    ),
    doctor(
      "Con que descanse me doy por pagado.",
      "If he rests, I consider myself paid.",
    ),
  ],
};

export const husbandExam: LocalizedConversation = {
  id: "chapter1.bakery.husband.exam",
  lines: [
    subject(
      "Doctor... perdone el desorden. No me tengo en pie.",
      "Doctor... forgive the mess. I can hardly stand.",
    ),
    doctor(
      "Tranquilo. Déjeme verle. ¿Desde cuándo tiene escalofríos?",
      "Easy now. Let me have a look. How long have you had the chills?",
    ),
    subject(
      "Desde anteanoche. Y la cabeza me va a reventar.",
      "Since the night before last. And my head is about to split.",
    ),
    doctor(
      "Frente ardiendo, pulso rápido, sudor frío... Fiebre común.",
      "Burning forehead, quick pulse, cold sweat... A common fever.",
    ),
    bedroomBaker("¿Es grave, Doctor?", "Is it serious, Doctor?"),
    doctor(
      "Nada grave si se trata a tiempo. Necesita una infusión medicinal y un paño frío.",
      "Nothing serious if it's treated in time. He needs a medicinal infusion and a cold compress.",
    ),
    subject("Lo que usted diga, Doctor.", "Whatever you say, Doctor."),
  ],
};

export const merchantCloth: LocalizedConversation = {
  id: "chapter1.plaza.merchant.cloth",
  lines: [
    doctor(
      "¿Tendría un poco de tela limpia?",
      "Would you have a bit of clean cloth?",
    ),
    subject(
      "Justo me queda un retal decente. Tómelo.",
      "I happen to have a decent scrap left. Take it.",
    ),
    doctor("Se lo agradezco.", "I appreciate it."),
  ],
};
