import type { Ailment } from "./ailments";

// The English reference is needed while the player compares diagnostic clues.
export const AILMENTS_EN: Record<string, Pick<Ailment, "name" | "symptoms" | "treatment">> = {
  poisoning: {
    name: "Poisoning",
    symptoms: ["Sudden weakness, cold sweats, nausea and loss of appetite. These signs can resemble other ailments; gather evidence before settling on a diagnosis."],
    treatment: ["Obtain and analyze a sample before choosing a remedy. The recorded treatment combines ", { emphasis: "charcoal suspension" }, " and ", { emphasis: "medicinal infusion" }, ". The source requires a separate investigation."],
  },
  "common-fever": {
    name: "Common fever",
    symptoms: ["High body temperature, chills, headache and weakness. The patient may alternate between sweating and feeling cold."],
    treatment: ["Rest and fluids. A ", { emphasis: "medicinal infusion" }, " helps ease discomfort. Apply a ", { emphasis: "cold cloth" }, " when the temperature is high."],
  },
  "stomach-ailment": {
    name: "Stomach ailment",
    symptoms: ["Abdominal pain, nausea, loss of appetite and heaviness. The cause can vary from one patient to another."],
    treatment: ["Offer gentle food and observe the symptoms. ", { emphasis: "Light soup" }, ", ", { emphasis: "milk with honey" }, " or a ", { emphasis: "charcoal preparation" }, " may help, depending on the case."],
  },
  "infected-wound": {
    name: "Infected wound",
    symptoms: ["Persistent pain around a wound, swelling, redness and possible discharge."],
    treatment: ["Clean and protect the area with a ", { emphasis: "disinfected bandage" }, ". A more advanced infection may need ", { emphasis: "medicinal ointment" }, " before dressing."],
  },
  "chest-cough": {
    name: "Chest cough",
    symptoms: ["Persistent cough, an irritated throat, heavy breathing and chest discomfort. It may worsen at night."],
    treatment: ["A ", { emphasis: "mint infusion" }, " may ease breathing. ", { emphasis: "Balsamic syrup" }, " can soothe irritation and coughing."],
  },
  scurvy: {
    name: "Scurvy",
    symptoms: ["Tiredness, weakness, sore gums and wounds that heal slowly. It may develop after a long period of poor diet."],
    treatment: ["Improve the diet with fruit and nourishing food. A citrus drink can accompany regular meals."],
  },
  exhaustion: {
    name: "Exhaustion",
    symptoms: ["Profound weakness, sleepiness, dizziness and trouble concentrating. The patient may lack strength even after resting."],
    treatment: ["Rest, food and observation. A ", { emphasis: "citrus drink" }, " may help restore strength, but persistent exhaustion calls for further investigation."],
  },
};
