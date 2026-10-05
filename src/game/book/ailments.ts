import type { RichText } from "./bookText";

// DOLENCIAS: the Doctor's GENERAL medical knowledge about each ailment, as
// data. This is NOT a recipe and NOT gameplay logic: what a given patient
// needs will live in that patient's case (two patients can share an ailment
// and need different preparations). The names of preparations inside
// `treatment` are marked with `{ emphasis }` so the page can show them
// differently; nothing reads those fragments to decide a cure.

export type Ailment = {
  id: string;
  name: string;
  illustration: {
    // File in public/game/ui/book/ailments (copy of the original drawing).
    file: string;
    // Where the 176x176 illustration canvas sits on the 688x384 book image.
    x: number;
    y: number;
  };
  symptoms: RichText;
  treatment: RichText;
};

export const AILMENTS: Ailment[] = [
  {
    id: "common-fever",
    name: "Fiebre común",
    illustration: { file: "fever", x: 102, y: 39 },
    symptoms: [
      "Calor corporal, escalofríos, dolor de cabeza y debilidad. El enfermo puede alternar entre sudor y sensación de frío.",
    ],
    treatment: [
      "Reposo y líquidos. Una ",
      { emphasis: "infusión medicinal" },
      " ayuda a aliviar el malestar. Aplicar un ",
      { emphasis: "paño frío" },
      " cuando la fiebre sea elevada.",
    ],
  },
  {
    id: "stomach-ailment",
    name: "Mal del estómago",
    illustration: { file: "stomach", x: 108, y: 30 },
    symptoms: [
      "Dolor de vientre, náuseas, falta de apetito y pesadez. La causa puede variar según el enfermo.",
    ],
    treatment: [
      "Conviene administrar alimentos suaves y observar los síntomas. ",
      { emphasis: "Sopa ligera" },
      ", ",
      { emphasis: "leche con miel" },
      ", ",
      { emphasis: "papilla nutritiva" },
      " o un ",
      { emphasis: "preparado de carbón" },
      " pueden ser útiles según el caso.",
    ],
  },
  {
    id: "infected-wound",
    name: "Herida infectada",
    illustration: { file: "infected-wound", x: 100, y: 24 },
    symptoms: [
      "Dolor persistente alrededor de una herida, inflamación, enrojecimiento y posible supuración.",
    ],
    treatment: [
      "Limpiar y proteger la zona con un ",
      { emphasis: "vendaje desinfectado" },
      ". Las infecciones más avanzadas pueden requerir ",
      { emphasis: "ungüento antiséptico" },
      " antes de vendar.",
    ],
  },
  {
    id: "chest-cough",
    name: "Tos del pecho",
    illustration: { file: "chest-cough", x: 112, y: 23 },
    symptoms: [
      "Tos persistente, garganta irritada, respiración pesada y molestias en el pecho. Puede empeorar durante la noche.",
    ],
    treatment: [
      "Una ",
      { emphasis: "infusión balsámica" },
      " ayuda a despejar la respiración. El ",
      { emphasis: "jarabe de miel" },
      " puede aliviar la irritación y la tos.",
    ],
  },
  {
    id: "scurvy",
    name: "Escorbuto",
    illustration: { file: "scurvy", x: 107, y: 20 },
    symptoms: [
      "Cansancio, debilidad, encías doloridas y heridas que tardan demasiado en sanar. Puede aparecer tras una alimentación pobre durante largo tiempo.",
    ],
    treatment: [
      "Reforzar la alimentación con fruta y alimentos nutritivos. Administrar ",
      { emphasis: "tónico cítrico" },
      " y acompañarlo con ",
      { emphasis: "papilla nutritiva" },
      ".",
    ],
  },
  {
    id: "exhaustion",
    name: "Agotamiento",
    illustration: { file: "exhaustion", x: 117, y: 15 },
    symptoms: [
      "Debilidad profunda, somnolencia, mareos y dificultad para concentrarse. El enfermo puede carecer de fuerzas incluso después de descansar.",
    ],
    treatment: [
      "Reposo, alimento y observación. Un ",
      { emphasis: "tónico reconstituyente" },
      " puede devolver fuerzas, aunque conviene investigar la causa cuando el agotamiento persista.",
    ],
  },
];
