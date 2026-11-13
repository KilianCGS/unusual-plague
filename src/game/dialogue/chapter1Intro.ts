import type { LocalizedConversation } from "./localizedConversation";

// What the Doctor says to himself when Chapter 1 begins: an ordinary morning
// in which he only knows that the baker has asked him to visit her husband.
// Played once per game session by GameWorld; the tutorial starts when it ends.
const doctor = (es: string, en: string) => ({
  speaker: "doctor",
  text: { es, en },
});

export const chapter1Intro: LocalizedConversation = {
  id: "chapter1.intro.doctorMorning",
  // Draft B of the Doctor's voice (cheerful, close, serene), chosen by Kilian on 2026-11-13.
  lines: [
    doctor("Otro día más. Y qué suerte tenerlo.", "Another day. And what luck to have it."),
    doctor(
      "Esta ciudad tiene sus rincones: la plaza, la fragua, la taberna, la granja... Casi todos me saludan por mi nombre. Y los que no, por la máscara.",
      "This town has its corners: the square, the forge, the tavern, the farm... Almost everyone greets me by name. And those who don't, by the mask.",
    ),
    doctor(
      "Al principio la máscara asusta un poco. Luego la gente se acostumbra. Con una sonrisa debajo todo es más fácil, aunque no se vea.",
      "At first the mask frightens people a little. Then they get used to it. With a smile underneath everything is easier, even if it can't be seen.",
    ),
    doctor(
      "Dicen que últimamente corren enfermedades extrañas. Yo prefiero mirarlas de frente y con calma: casi todo miedo se encoge con un buen diagnóstico.",
      "They say strange illnesses are going around lately. I prefer to face them calmly: almost every fear shrinks with a good diagnosis.",
    ),
    doctor(
      "Mi trabajo es sencillo: escuchar, mirar y preparar el remedio justo. Lo demás son nervios, y esos se curan con paciencia.",
      "My job is simple: listen, look and prepare the right remedy. The rest is nerves, and those are cured with patience.",
    ),
    doctor(
      "Hoy me espera la panadera. Ha pedido que pase a ver a su marido, que no se encuentra bien.",
      "The baker is expecting me today. She asked me to see her husband, who isn't well.",
    ),
    doctor(
      "Nadie viene a mi puerta por gusto, y aun así siempre me alegra que vengan.",
      "Nobody comes to my door for pleasure, and yet I'm always glad when they do.",
    ),
    doctor(
      "Revisaré mi libro antes de salir. Es mi mejor compañero: nunca se cansa de que le pregunte.",
      "I'll check my book before I leave. It's my best companion: it never tires of my questions.",
    ),
    doctor(
      "Y un frasco vacío, por si hace falta una muestra. Siempre conviene ir preparado.",
      "And an empty flask, in case a sample is needed. It's always wise to be prepared.",
    ),
    doctor(
      "Adelante. Con ánimo, todo se arregla.",
      "Onward. With good spirits, everything gets sorted out.",
    ),
  ],
};
