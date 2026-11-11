# Sonido: de dónde sacarlo, gratis y con licencia

Investigación del 2026-11-11. **Es una guía de opciones, no una decisión.** La lista
de sonidos que necesita el juego está en `docs/SOUND_SHEET.md` (aprobada). Aquí solo
se responde a "cómo conseguirlos sin pagar y sin problemas de licencia".

Regla para cualquier archivo: **si no tiene licencia que permita uso comercial, no
entra**. Cada sonido que entre se apunta en un registro (ver el final).

## Opciones

| Opción | Coste | Licencia | Para qué sirve mejor | Cuidado |
|---|---|---|---|---|
| **Síntesis propia en código** (Web Audio) | 0 | Nuestra: sin dependencias de terceros | Interfaz (clics, monedas, avisos), ambientes simples (viento, murmullo con ruido filtrado), pasos aproximados | No suena a grabación real: fuego, puertas y pasos realistas cuestan |
| **Kenney** (RPG Audio, UI Audio, Music Jingles) | 0 | CC0 1.0: uso comercial, sin atribución | Interfaz, golpes, pasos y objetos de rol, jingles cortos | Cada descarga trae `license.txt`; guardarlo |
| **Freesound filtrando CC0** | 0 | CC0: libre. CC BY: hay que dar crédito en el juego. CC BY-NC: **no vale** si el juego se vende | Ambientes y foley reales (fuego, viento, puertas, agua, bosque) | Mirar la licencia de cada sonido, no de la web entera |
| **OpenGameArt** | 0 | Varía por archivo (CC0, CC BY, GPL...) | Complemento | Descartar GPL y NC; revisar cada uno |
| **Pixabay (sonidos y música)** | 0 | Licencia propia de Pixabay: comercial permitido, atribución no exigida | Ambientes y música | No se pueden redistribuir los archivos sueltos; sus condiciones tienen puntos ambiguos: leer el texto legal |
| **Sonniss GDC (paquetes anuales)** | 0 | Libres de derechos; 2024 prohíbe entrenar IA; 2026: no encontré resumen | Gran volumen de foley profesional | Leer el archivo de licencia de **cada** edición |
| **IA generativa** (por ejemplo PixelLab `create_sound_effect`) | Créditos | No verificado: comprobar sus términos de uso comercial | Efectos concretos a medida | Calidad variable; sin confirmar términos no lo usaría |
| **Grabar foley propio** | 0 + tiempo | Tuya | Pasos, puertas, telas, tazas: sonido único | Requiere micrófono y tiempo |

## Recomendación (para que la discutas)

Un reparto híbrido, de menos a más riesgo legal:

1. **Interfaz, monedas, libro, mapa, recados: síntesis propia o Kenney (CC0).** Cero
   dudas de licencia y se integra ya.
2. **Ambientes y foley (pueblo, bosque, taberna, fuego, agua): Freesound solo CC0.**
   Se escogen pocos y buenos, con una pasada de volumen y bucle.
3. **Música: solo título, cierres de jornada y momentos finales,** como ya decidiste.
   Pedir una licencia clara antes de usar ninguna pista.
4. **IA o grabación propia:** solo para huecos que lo anterior no cubra.

## Lo que haría el gestor de sonido

- Un único módulo que reproduce por nombre (`play("coin")`) y **no falla si falta el
  archivo**: queda en silencio hasta que lo haya.
- Ambiente por escena (suave, sin música continua al explorar), pasos según el suelo,
  volumen separado de efectos, ambiente y música, y silenciar con una tecla.
- Respeta que el navegador no deja sonar hasta el primer gesto del usuario.
- Los archivos se cargan bajo demanda para no engordar la carga inicial.

## Registro de licencias (formato propuesto)

`docs/SOUND_CREDITS.md`, una fila por archivo:
`archivo del juego | origen (URL) | autor | licencia | fecha | ¿exige crédito?`
Si algún sonido exige crédito (CC BY), saldrá en una pantalla de créditos del juego.

## Fuentes

- [Kenney, RPG Audio (CC0)](https://www.kenney.nl/assets/rpg-audio)
- [Kenney, UI Audio (CC0)](https://kenney.nl/assets/ui-audio)
- [Kenney, Music Jingles (CC0)](https://kenney.nl/assets/music-jingles)
- [Guía de sonidos y música gratis para juegos (resumen de licencias)](https://app.cinevva.com/guides/free-sound-effects-music)
- [Freesound, preguntas frecuentes y licencias](https://www.freesound.org/help/faq)
- [Pixabay, resumen de la licencia de contenido](https://pixabay.com/da/service/license)
- [Pixabay, términos de servicio](https://pixabay.com/service/terms/)
- [Sonniss, paquete GDC 2026](https://rekkerd.org/sonniss-releases-gdc-2026-game-audio-bundle/)
- [Sonniss, GDC 2024](https://gamefromscratch.com/sonniss-27-5gb-sound-effect-giveaway-at-gdc-2024/)

Las licencias cambian: antes de integrar cualquier archivo, léela en su página de
descarga, no en este resumen.
