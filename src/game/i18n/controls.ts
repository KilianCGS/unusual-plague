import type { ControlAction, PresetId } from "../controls/keybindings";
import type { Language } from "./types";

// Texts of the controls screen and the pause menu. New text, awaiting Kilian's review.
type ControlsCopy = {
  title: string;
  presets: string;
  presetNames: Record<PresetId, string>;
  custom: string;
  movement: string;
  actions: string;
  actionNames: Record<ControlAction, string>;
  main: string;
  alternative: string;
  waiting: string;
  hint: string;
  reset: string;
  close: string;
  openButton: string;
  pause: {
    title: string;
    resume: string;
    controls: string;
    quit: string;
    quitWarning: string;
    quitConfirm: string;
    quitCancel: string;
  };
};

export const controlsCopy: Record<Language, ControlsCopy> = {
  es: {
    title: "Controles",
    presets: "Combinaciones",
    presetNames: { wasd: "WASD", zqsd: "ZQSD (AZERTY)", ijkl: "IJKL (mano derecha)" },
    custom: "Personalizado",
    movement: "Movimiento",
    actions: "Acciones",
    actionNames: {
      up: "Arriba",
      down: "Abajo",
      left: "Izquierda",
      right: "Derecha",
      interact: "Interactuar",
      run: "Correr",
      book: "Libro",
      map: "Mapa (mantener)",
      objectives: "Recados",
    },
    main: "Principal",
    alternative: "Alternativa",
    waiting: "Pulsa una tecla...",
    hint: "Haz clic en una tecla y pulsa la nueva. Esc cancela. Si la tecla ya se usa en otra acción, se intercambian.",
    reset: "Restablecer",
    close: "Cerrar",
    openButton: "Controles",
    pause: {
      title: "Pausa",
      resume: "Continuar",
      controls: "Controles",
      quit: "Volver al título",
      quitWarning: "Se perderá el progreso de esta partida (todavía no se guarda).",
      quitConfirm: "Sí, salir",
      quitCancel: "No, seguir",
    },
  },
  en: {
    title: "Controls",
    presets: "Layouts",
    presetNames: { wasd: "WASD", zqsd: "ZQSD (AZERTY)", ijkl: "IJKL (right hand)" },
    custom: "Custom",
    movement: "Movement",
    actions: "Actions",
    actionNames: {
      up: "Up",
      down: "Down",
      left: "Left",
      right: "Right",
      interact: "Interact",
      run: "Run",
      book: "Book",
      map: "Map (hold)",
      objectives: "Errands",
    },
    main: "Main",
    alternative: "Alternative",
    waiting: "Press a key...",
    hint: "Click a key and press the new one. Esc cancels. If the key is already used by another action, they swap.",
    reset: "Reset",
    close: "Close",
    openButton: "Controls",
    pause: {
      title: "Paused",
      resume: "Resume",
      controls: "Controls",
      quit: "Back to title",
      quitWarning: "This game's progress will be lost (saving does not exist yet).",
      quitConfirm: "Yes, quit",
      quitCancel: "No, keep playing",
    },
  },
};
