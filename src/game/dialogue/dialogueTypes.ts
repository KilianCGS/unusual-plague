// A conversation is plain data. `speaker` is "doctor" or an NPC id (the same
// ids as SceneNpc.id). Gestures / events ("[Asiente.]", "[Mira a la puerta.]")
// are NOT text: they belong in `actions`, which V1 only carries along (nothing
// reads it yet), so they can be wired later without changing the data shape.
export type DialogueAction = {
  type: string;
  [key: string]: unknown;
};

export type DialogueLine = {
  speaker: string;
  text: string;
  // Reserved for future use (gestures, camera, sounds...). Ignored by V1.
  actions?: DialogueAction[];
};

export type Conversation = {
  id: string;
  lines: DialogueLine[];
};
