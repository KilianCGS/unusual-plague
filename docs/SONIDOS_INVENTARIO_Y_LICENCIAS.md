# Los 18 efectos de sonido: inventario, origen y licencias (20-nov-2026)

**No soy abogado.** Documento de trabajo. No se ha modificado ni sustituido ningún sonido. Distingue tres niveles:
**verificado** (leído en la fuente oficial o en el propio archivo), **inferencia** (deducido de indicios) y **sin verificar**.

## 1. Resumen

- **La licencia de Pixabay sí está verificada como documento** (términos del 20-oct-2026): permite uso comercial y no comercial,
  modificar, sin atribución obligatoria. **Pero ningún archivo está verificado individualmente**: ninguno de los 18 lleva dentro un
  rastro que lo ate a Pixabay, y los nombres del README no son nombres de biblioteca (ver 3).
- **3 archivos** llevan autor y título en sus metadatos (`GFX Sounds` y `betacut`). Los títulos coinciden con listados de **Uppbeat**
  según búsquedas web, **no con Pixabay**. No he podido leer ninguna página de Uppbeat (error 429), así que su licencia está **sin
  verificar**.
- **15 archivos no tienen metadatos de origen.** Tu indicación («los descargué de Pixabay, sobre todo») es la única pista, y no
  puedo contrastarla con el archivo.
- Con lo que consta, **no puedo declarar verificado ningún sonido**. Pero tampoco hay motivo para sustituirlos: lo que falta es
  **prueba de origen**, que solo tú puedes recuperar (historial de descargas, páginas guardadas). Sección 7.

## 2. Qué he comprobado y qué no

| Comprobación | Resultado |
|---|---|
| Metadatos (ID3) y cadenas dentro de los 18 archivos | Solo 3 llevan título y autor. Ninguno menciona Pixabay, Uppbeat, Freesound, Kenney, Mixkit, Zapsplat ni licencia. (`blacksmith.mp3` contiene la secuencia «CC0» en el byte 1326, **en medio de los datos de audio: coincidencia, no una licencia**) |
| README de `public/game/audio/` | Guarda «nombres originales» como `WalkingInInterior` o `cambioDePagina`. Varios están en español (`mortero`, `dineroCompraVenta`), así que parecen nombres que pusiste tú, **no títulos de una biblioteca** |
| Búsqueda de los 3 títulos con autor | «Dart hit - thud & impact» (GFX Sounds) y la familia «Computer mouse click» de betacut aparecen en **Uppbeat**. «Digital data animation - bar chart growth» no apareció en ninguna parte. **Ninguno apareció en Pixabay** |
| Licencia oficial de Pixabay | Leída y citada (sección 4) |
| Licencia oficial de Uppbeat | **No leída**: todas las páginas devolvieron «429 Too Many Requests» |
| Coincidencia de los 15 sin metadatos | **Imposible por nombre**: no hay título de biblioteca que buscar |

## 3. Inventario (18 archivos)

El uso viene de `src/game/audio/soundManifest.ts` y los nombres originales del README.

| # | Archivo | Nombre en el README | Dónde suena | Técnica | Metadatos / evidencia | Estado de licencia |
|---|---|---|---|---|---|---|
| 1 | `steps/interior.mp3` | WalkingInInterior | Pasos en interiores | 24 kHz, mono, ~5,9 s | Ninguno | **Sin verificar** |
| 2 | `steps/city-rock.mp3` | stepsOnCityorRockPath | Pasos en piedra | 24 kHz, estéreo, ~1,1 s | Codificado con ffmpeg (Lavf58.20.100) | **Sin verificar** |
| 3 | `steps/wood-path.mp3` | stepsonWoodAndPath | Pasos en tierra/madera | 24 kHz, estéreo, ~1,2 s | Lavf58.20.100 | **Sin verificar** |
| 4 | `loops/blacksmith.mp3` | BlacksmithSound | Herrero | 44,1 kHz, mono, ~0,5 s | Lavf58.20.100 | **Sin verificar** |
| 5 | `loops/wood-chop.mp3` | woodChop | Leñador | 44,1 kHz, mono, ~0,6 s | Lavf58.20.100 | **Sin verificar** |
| 6 | `crafting/cooking-5s.mp3` | cooking(5secondsSound) | Cocinar | 24 kHz, estéreo, 5,0 s | Lavf58.20.100 | **Sin verificar** |
| 7 | `crafting/chop.mp3` | cuttingVegetables | Trocear | 44,1 kHz, estéreo, ~1,6 s | Lavf58.20.100 | **Sin verificar** |
| 8 | `crafting/mortar.mp3` | mortero | Mortero | 24 kHz, estéreo, ~2,9 s | Lavf58.20.100 | **Sin verificar** |
| 9 | `crafting/recipe-crafted.mp3` | CraftedRecipe | Preparado terminado | 44,1 kHz, estéreo, ~0,7 s | Ninguno | **Sin verificar** |
| 10 | `ui/page-turn.mp3` | cambioDePagina | Pasar página, abrir el libro | 44,1 kHz, mono, ~3,9 s | Ninguno | **Sin verificar** |
| 11 | `ui/item-click-drop.mp3` | vClickOrDropItem… | Coger y soltar | 48 kHz, estéreo, ~0,5 s | Lavf58.20.100 | **Sin verificar** |
| 12 | `ui/coins.mp3` | dineroCompraVenta | Compra y venta | 32 kHz, mono, ~16,8 s | Ninguno | **Sin verificar** |
| 13 | `ui/item-obtained.mp3` | ItemObtainingFromNpcorFarming | Objeto recibido | 44,1 kHz, mono, ~1,5 s | Ninguno | **Sin verificar** |
| 14 | `ui/chest-open.mp3` | OPeningRoomChest | Cofre | 24 kHz, estéreo, ~1,1 s | Ninguno | **Sin verificar** |
| 15 | `ui/map-open.mp3` | (no figura) | Abrir el mapa | 48 kHz, estéreo, ~0,6 s | Ninguno | **Sin verificar** |
| 16 | `ui/book-tab.mp3` | (no figura) | Cambiar de pestaña del libro | 44,1 kHz, estéreo, ~0,7 s | Autor **«GFX Sounds»**, título «Dart hit - thud & impact» | **Sin verificar** (indicio: Uppbeat) |
| 17 | `ui/dialogue-bubble.mp3` | (no figura) | Letra a letra de los diálogos | 44,1 kHz, estéreo, ~0,6 s | Autor **«GFX Sounds»**, título «Digital data animation - bar chart growth», fecha 2026-09-03, codificado con REAPER | **Sin verificar** (título no localizado) |
| 18 | `ui/intro-button-click.mp3` | (no figura) | Botones del título | 44,1 kHz, estéreo, ~2,2 s | Autor **«betacut»**, título «Computer mouse click (Single)» | **Sin verificar** (indicio: Uppbeat) |

**Observaciones técnicas (inferencias):**
- Los archivos 1, 2, 3, 6, 8 y 14 comparten un perfil poco común (24 kHz con 160 kbps). Pueden venir de un mismo origen o de una misma herramienta de exportación. No es una prueba de nada.
- Ocho archivos fueron recodificados con la misma versión de ffmpeg (la del 2018), probablemente al recortarlos o convertirlos tú. Eso borró las etiquetas que habrían servido para rastrearlos.
- El n.º 12 dura casi 17 segundos, mucho para una moneda: puede ser un archivo largo con varios sonidos; no he comprobado cómo se recorta en el juego.
- El n.º 17 lleva la fecha 3-sep-2026 y se grabó con un programa de producción (REAPER): es un sonido reciente subido por su autor, lo que encaja con una biblioteca moderna, pero no la identifica.

## 4. Licencias oficiales

### Pixabay (verificado el 20-nov-2026; Términos «Last updated: 20 October, 2026»)

- **Qué permite** (§5): «derecho irrevocable, mundial, perpetuo (o mientras la ley lo permita), no exclusivo y libre de royalties»
  a «descargar, usar, copiar, modificar o adaptar el Contenido» para fines comerciales o no comerciales. Cubre explícitamente audio
  («música, sonidos, efectos de sonido», §2).
- **Atribución** (§6): «No necesitas dar crédito a Pixabay ni al contribuyente»; se agradece, con el formato «by [Contributor] via
  Pixabay». El contenido publicado **antes del 9-ene-2019 es CC0** (§4).
- **Lo prohibido** (§5): vender o distribuir el contenido «de forma independiente» (*standalone*, incluido como archivo de audio
  y a través de plataformas de stock), usar contenido con marcas para bienes y servicios, uso inmoral o ilegal, uso engañoso
  (sugerir respaldo de terceros o que eres titular exclusivo), usarlo como parte de una marca registrada. La licencia «está
  condicionada a no incurrir en ninguno de estos usos».
- **Qué es «independiente»** (§5): contenido «sin esfuerzo creativo» que sigue «sustancialmente en la misma forma». Combinarlo con
  otros audios, imágenes, texto y edición para hacer una obra nueva **no** es uso independiente.
- **Juegos y repositorios:** los términos **no mencionan videojuegos, webs ni repositorios**. Mi lectura, no la de Pixabay: un sonido
  mezclado dentro de un juego es una obra combinada y encaja; **el mismo archivo suelto y sin cambios en un repositorio público**
  puede interpretarse como distribución independiente, y la copia masiva de contenido está vedada en §8.
- **Content ID:** no se menciona. No hay prohibición ni permiso.
- **Cambios:** Pixabay se reserva modificar los términos y «cancelar o cambiar las licencias concedidas» (§1), aunque llama a la
  licencia «irrevocable». Las páginas no aclaran si lo ya descargado conserva los términos anteriores.
- **Garantías:** no garantiza que los contenidos tengan todos los consentimientos; avisa de posibles derechos adicionales
  (marcas, «muestras de audio»), y recomienda comprobar si hace falta permiso (§5, resumen).

### Uppbeat: **sin verificar**

Todas las páginas devolvieron un error 429 y no he podido leer sus condiciones. **No afirmo nada sobre su licencia, su crédito ni su
uso en juegos.** Lo que consta es solo que existen listados con esos títulos o familias (búsqueda web, sin leer las páginas).

### Otras bibliotecas

No hay indicios en los archivos de ninguna otra (Freesound, Kenney, Mixkit, etc.).

## 5. ¿Puedo usarlos en un juego gratuito, en el navegador y compartido en LinkedIn?

**Con lo que está verificado, no puedo responder «sí» para ningún archivo concreto.** Lo que sí está claro:

| Caso | Respuesta |
|---|---|
| Un sonido **de Pixabay con su listado a mano** (página de descarga guardada) | **Sí**, para un juego gratuito (y también comercial), sin atribución obligatoria |
| El mismo sonido, pero **sin poder probar que viene de Pixabay** | **No verificado**: puede que lo esté, pero hoy no puedes demostrarlo |
| Los 3 con autor (GFX Sounds, betacut) | **No verificado**: los títulos apuntan a Uppbeat y su licencia no se ha leído. Si en realidad vienen de Pixabay, valdría lo anterior |
| Juego alojado en la web, con los sonidos mezclados en la obra | Es el uso normal de un juego y encaja con la licencia de Pixabay (mi lectura, sin mención expresa de juegos) |
| **Repositorio público de GitHub con los mp3 sueltos** | **Zona gris** según Pixabay (distribución independiente). Se evita no subiendo los audios o dejando el repositorio privado, o aceptando un riesgo bajo |
| Vídeo del juego en LinkedIn | Los términos de Pixabay no dicen nada sobre Content ID; conserva la prueba de licencia por si hay un reclamo automático |

## 6. Atribución y avisos

- **Pixabay:** **no es obligatoria**. Si quieres darla (opcional): «Sonidos: [autor] vía Pixabay».
- **Uppbeat:** **no sé** si exige crédito; **hay que leerlo en cada listado** antes de decidir. Mientras tanto, nombrar a «GFX Sounds»
  y «betacut» en los créditos no tiene coste y no equivale a una licencia.
- **Avisos que conservar** (recomendación, no obligación de Pixabay): una captura con fecha de cada página de descarga y de la
  licencia vigente ese día, porque Pixabay puede cambiar los términos.
- En el panel «Sobre el juego» de la versión sin subir hay una línea de créditos con «Música y sonidos: pendiente de completar».
  Se rellenará cuando haya origen verificado.

## 7. Cómo dejar los 18 verificados sin cambiar ningún sonido

Solo tú puedes recuperarlo, y en la mayoría de los casos basta con encontrar la página de descarga. Pasos, por orden de menos a
más esfuerzo:

1. **Historial del navegador** (chrome://history, buscando «pixabay» o «uppbeat» del día de la descarga).
2. **Carpeta de descargas** o copias de seguridad: los archivos originales conservan su nombre y a veces el autor.
3. **Tu cuenta de Pixabay y de Uppbeat**, por si guardan historial o favoritos (no he verificado que lo hagan).
4. **Búsqueda inversa por nombre de autor** si recuerdas alguno.
5. Los sonidos que no consigas rastrear se pueden **dejar como están** si aceptas el riesgo (bajo: son clics y pasos), o
   **reemplazar solo esos**, sin tocar los demás.

Registro para rellenar (uno por archivo):

| Archivo | URL de la página | Autor | Fecha de publicación | Licencia mostrada (captura) | Fecha de descarga |
|---|---|---|---|---|---|
| `steps/interior.mp3` |  |  |  |  |  |
| `steps/city-rock.mp3` |  |  |  |  |  |
| `steps/wood-path.mp3` |  |  |  |  |  |
| `loops/blacksmith.mp3` |  |  |  |  |  |
| `loops/wood-chop.mp3` |  |  |  |  |  |
| `crafting/cooking-5s.mp3` |  |  |  |  |  |
| `crafting/chop.mp3` |  |  |  |  |  |
| `crafting/mortar.mp3` |  |  |  |  |  |
| `crafting/recipe-crafted.mp3` |  |  |  |  |  |
| `ui/page-turn.mp3` |  |  |  |  |  |
| `ui/item-click-drop.mp3` |  |  |  |  |  |
| `ui/coins.mp3` |  |  |  |  |  |
| `ui/item-obtained.mp3` |  |  |  |  |  |
| `ui/chest-open.mp3` |  |  |  |  |  |
| `ui/map-open.mp3` |  |  |  |  |  |
| `ui/book-tab.mp3` |  |  |  |  |  |
| `ui/dialogue-bubble.mp3` |  |  |  |  |  |
| `ui/intro-button-click.mp3` |  |  |  |  |  |

Cuando tengas las URL de alguno, pásamelas y las contrasto con la licencia oficial correspondiente y actualizo este documento.

## 8. Fuentes (consultadas el 20-nov-2026)

- [Pixabay, resumen de la licencia de contenido](https://pixabay.com/service/license-summary/)
- [Pixabay, términos de servicio](https://pixabay.com/service/terms/) (última actualización 20-oct-2026)
- Uppbeat (no accesible, error 429): [https://uppbeat.io](https://uppbeat.io)
- Metadatos leídos en los propios archivos de `public/game/audio` y `public/game/audio/README.md`
- `src/game/audio/soundManifest.ts` (uso de cada sonido)

---

## 9. Actualización: música final (20-nov-2026)

`endgame.mp3` (una grabación ajena de «Claro de luna», sin licencia conocida) se ha **sustituido** por una versión de dominio público;
el original está fuera del repositorio, en `../retirados/` (no se ha borrado).

| | |
|---|---|
| Archivo nuevo | `public/game/audio/music/endgame.ogg` (Ogg Vorbis, 5 min 36 s, 10,9 MB, estéreo 44,1 kHz) |
| Obra | Sonata n.º 14 «Claro de luna», Op. 27 n.º 2, 1.er movimiento (Adagio sostenuto), Beethoven (1770–1827): dominio público |
| Interpretación | Paul Pitman para Musopen |
| Fuente | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ludwig_van_Beethoven_-_sonata_no._14_in_c_sharp_minor_%27moonlight%27,_op._27_no._2_-_i._adagio_sostenuto.ogg); Musopen ([página de la obra](https://musopen.org/music/278/ludwig-van-beethoven/sonata-no-14-in-c-sharp-minor-moonlight-op-27-no-2/)) |
| Licencia (leída en la página de Commons) | Grabación: «This work has been released into the public domain by its author, musopen.com. This applies worldwide.» Composición: dominio público. Hay un permiso VRT (ticket #2008012110017088) |
| Atribución | La página dice que **se permite cualquier uso «siempre que se atribuya adecuadamente»** y que Musopen **pide crédito en línea con su URL**; su FAQ lo presenta como cortesía. **Ya está en los créditos del juego** |
| Ambigüedades que debes conocer | La licencia mezcla «dominio público» con una petición de atribución; no se indica la fecha original de subida (el historial muestra una versión de enero de 2010); la página advierte que los materiales propios de Musopen están protegidos, y no queda claro si eso afecta a este archivo |
| Formato | Ogg Vorbis se reproduce en Chrome, Firefox y Edge. **Safari antiguo puede quedarse sin música final** (no verificado): si te importa, conviértelo a MP3 con una herramienta que yo no tengo aquí |

Se trata de la grabación que obtuve de los servidores de Wikimedia; su integridad la comprueba la duración y el formato (coinciden con la página).
