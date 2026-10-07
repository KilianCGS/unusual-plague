import type { Conversation } from "./dialogueTypes";

// Preview conversation for /dev/dialogue only. "plaza-merchant-01" is the
// instanceId of the merchant in Chapter 1's Plaza composition (any decor
// instanceId or SceneNpc id works as a speaker). The `actions` entry shows
// where a gesture would live; V1 does not execute it.
export const SAMPLE_CONVERSATION: Conversation = {
  id: "dev-sample",
  lines: [
    {
      speaker: "plaza-merchant-01",
      text: "Buenos días, Doctor. ¿Tiene un momento?",
    },
    { speaker: "doctor", text: "Buenos días. Dígame, ¿qué ocurre?" },
    {
      speaker: "plaza-merchant-01",
      text: "Mi marido lleva dos noches con fiebre… y no deja de tiritar.",
      actions: [{ type: "gesture", name: "look-at-door" }],
    },
    { speaker: "doctor", text: "Entiendo. Iré a verle." },
    {
      speaker: "plaza-merchant-01",
      text: "¡Gracias! Venga conmigo, por favor.",
    },
  ],
};
