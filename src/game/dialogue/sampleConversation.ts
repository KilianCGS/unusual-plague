import type { Conversation } from "./dialogueTypes";

// Preview conversation for /dev/dialogue only. "villager-pilot" is the NPC id
// that already exists in the Plaza (src/game/npcs/sceneNpcs.ts). The `actions`
// entry shows where a gesture would live; V1 does not execute it.
export const SAMPLE_CONVERSATION: Conversation = {
  id: "dev-sample",
  lines: [
    {
      speaker: "villager-pilot",
      text: "Buenos días, Doctor. ¿Tiene un momento?",
    },
    { speaker: "doctor", text: "Buenos días. Dígame, ¿qué ocurre?" },
    {
      speaker: "villager-pilot",
      text: "Mi marido lleva dos noches con fiebre… y no deja de tiritar.",
      actions: [{ type: "gesture", name: "look-at-door" }],
    },
    { speaker: "doctor", text: "Entiendo. Iré a verle." },
    { speaker: "villager-pilot", text: "¡Gracias! Venga conmigo, por favor." },
  ],
};
