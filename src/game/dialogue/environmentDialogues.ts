import type { LocalizedConversation } from "./localizedConversation";

// Observations belong to the Doctor, never to an empty subject or a speaking
// object. Shared everyday details; no items, rewards or patient prerequisites.
const doctor = (es: string, en: string) => ({ speaker: "doctor", text: { es, en } });
const observe = (id: string, lines: LocalizedConversation["lines"]): [string, LocalizedConversation] => [id, { id, lines }];

export const environmentDialogues: Record<string, LocalizedConversation> = Object.fromEntries([
  observe("world.plaza.statue", [
    doctor("Alguien ha dejado flores frescas al pie de la estatua.", "Someone has left fresh flowers at the foot of the statue."),
    doctor("La lluvia ha desgastado la piedra. Aun así, hay quien sigue cuidando este rincón.", "The rain has worn the stone away. Even so, someone still tends this corner."),
  ]),
  observe("world.plaza.noticeboard", [
    doctor("Un aviso pide devolver un cubo. Debajo, otra mano ha escrito: «Primero devuelva usted la escalera».", "A notice asks for a bucket to be returned. Below it, another hand has written: 'Return my ladder first.'"),
    doctor("Los asuntos del pueblo, ordenados por clavo y por rencor.", "Village affairs, arranged by nail and by grudge."),
    doctor("Hay un anuncio de hace meses. La lluvia se ha llevado la fecha, pero no las ganas de vender una cabra.", "One notice is months old. The rain has washed away the date, but not the wish to sell a goat."),
  ]),
  observe("world.plaza.well", [
    doctor("La cuerda ha dejado un surco en la piedra. Cada mañana lo hace un poco más profundo.", "The rope has worn a groove into the stone. Every morning it makes it a little deeper."),
    doctor("El cubo lleva más remiendos que madera sana. Alguien se ha tomado muchas molestias para que siga sirviendo.", "The bucket has more patches than sound wood. Someone has gone to a great deal of trouble to keep it useful."),
    doctor("Desde el fondo vuelve el ruido de la plaza, más pequeño.", "The noise of the square echoes back from below, smaller somehow."),
  ]),
  observe("world.mill.tools", [
    doctor("Mangos oscuros de tanto usarlos. Una mano acaba dejando su forma incluso en la madera.", "Handles darkened by use. A hand eventually leaves its shape even in wood."),
    doctor("Cada herramienta tiene su sitio. Se nota más cuando falta la persona que las guarda.", "Every tool has its place. You notice it more when the person who puts them away is absent."),
  ]),
  observe("world.granary.sacks", [
    doctor("Grano seco, polvo y cuerda de cáñamo. El olor de una cosecha que todavía tiene que durar.", "Dry grain, dust and hemp rope. The smell of a harvest that still has to last."),
    doctor("Las marcas de los sacos no coinciden. Han reutilizado todo lo que aguantaba otra carga.", "The markings on the sacks don't match. They've reused anything that could carry another load."),
    doctor("Mirarlos no basta para saber qué enfermó al agricultor.", "Looking at them isn't enough to tell what made the farmer ill."),
  ]),
  observe("world.tavern.hearth", [
    doctor("Huele a humo viejo. La taberna debe de conservar un poco de cada invierno.", "It smells of old smoke. The tavern must keep a little of every winter."),
    doctor("La ceniza está apartada con cuidado. Aquí alguien limpia antes de que lleguen los que no se fijan.", "The ash has been carefully swept aside. Someone cleans here before the people who never notice arrive."),
  ]),
  observe("world.smithy.anvil", [
    doctor("El borde está lleno de pequeñas muescas. Ninguna parece importante hasta que se miran todas juntas.", "The edge is covered in little nicks. None seems significant until you look at them all together."),
    doctor("A su alrededor, el suelo ha aprendido dónde caen las chispas.", "Around it, the floor has learned where the sparks fall."),
    doctor("Nunca había reparado en cuánto se oye este taller cuando no suena el martillo.", "I'd never noticed how much you can hear in this workshop when the hammer is silent."),
  ]),
]);
