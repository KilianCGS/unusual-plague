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
    // Versioned engraving in public/game/ui/book/ailments; old drawings remain.
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
    id: "poisoning",
    name: "Envenenamiento",
    illustration: { file: "poisoning-v2", x: 106, y: 28 },
    symptoms: ["Debilidad repentina, sudor frío, náuseas y falta de apetito. Los síntomas pueden parecerse a otros cuadros; conviene reunir indicios antes de dar el diagnóstico por seguro."],
    treatment: ["Obtener y analizar una muestra antes de elegir el remedio. El tratamiento registrado combina ",
      { emphasis: "suspensión de carbón" }, " e ", { emphasis: "infusión medicinal" }, ". Su origen requiere una investigación aparte."],
  },
  {
    id: "common-fever",
    name: "Fiebre común",
    illustration: { file: "fever-v2", x: 102, y: 39 },
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
    illustration: { file: "stomach-v2", x: 108, y: 30 },
    symptoms: [
      "Dolor de vientre, náuseas, falta de apetito y pesadez. La causa puede variar según el enfermo.",
    ],
    treatment: [
      "Conviene administrar alimentos suaves y observar los síntomas. ",
      { emphasis: "Sopa ligera" },
      ", ",
      { emphasis: "leche con miel" },
      " o un ",
      { emphasis: "preparado de carbón" },
      " pueden ser útiles según el caso.",
    ],
  },
  {
    id: "infected-wound",
    name: "Herida infectada",
    illustration: { file: "infected-wound-v2", x: 100, y: 24 },
    symptoms: [
      "Dolor persistente alrededor de una herida, inflamación, enrojecimiento y posible supuración.",
    ],
    treatment: [
      "Limpiar y proteger la zona con un ",
      { emphasis: "vendaje desinfectado" },
      ". Las infecciones más avanzadas pueden requerir ",
      { emphasis: "ungüento medicinal" },
      " antes de vendar.",
    ],
  },
  {
    id: "chest-cough",
    name: "Tos del pecho",
    illustration: { file: "chest-cough-v2", x: 112, y: 23 },
    symptoms: [
      "Tos persistente, garganta irritada, respiración pesada y molestias en el pecho. Puede empeorar durante la noche.",
    ],
    treatment: [
      "Una ",
      { emphasis: "infusión de menta" },
      " ayuda a despejar la respiración. El ",
      { emphasis: "jarabe balsámico" },
      " puede aliviar la irritación y la tos.",
    ],
  },
  {
    id: "scurvy",
    name: "Escorbuto",
    illustration: { file: "scurvy-v2", x: 107, y: 20 },
    symptoms: [
      "Cansancio, debilidad, encías doloridas y heridas que tardan demasiado en sanar. Puede aparecer tras una alimentación pobre durante largo tiempo.",
    ],
    treatment: [
      "Reforzar la alimentación con fruta y alimentos nutritivos. Administrar ",
      { emphasis: "bebida cítrica" },
      " y acompañarlo con ",
      "alimentos nutritivos",
      ".",
    ],
  },
  {
    id: "exhaustion",
    name: "Agotamiento",
    illustration: { file: "exhaustion-v2", x: 117, y: 15 },
    symptoms: [
      "Debilidad profunda, somnolencia, mareos y dificultad para concentrarse. El enfermo puede carecer de fuerzas incluso después de descansar.",
    ],
    treatment: [
      "Reposo, alimento y observación. Un ",
      { emphasis: "bebida cítrica" },
      " puede devolver fuerzas, aunque conviene investigar la causa cuando el agotamiento persista.",
    ],
  },
];
