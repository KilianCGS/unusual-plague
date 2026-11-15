# Audio (sin conectar todavía)

Archivos organizados por nombre; aún no los usa ningún código. Rutas públicas: `/game/audio/<carpeta>/<archivo>`.

| Carpeta | Archivo | Origen (nombre original) | Uso previsto |
|---|---|---|---|
| steps | interior.mp3 | WalkingInInterior | Paso del Doctor en interiores |
| steps | city-rock.mp3 | stepsOnCityorRockPath | Paso en ciudad / camino de piedra |
| steps | wood-path.mp3 | stepsonWoodAndPath | Paso en madera / camino |
| loops | blacksmith.mp3 | BlacksmithSound | Bucle del herrero, sincronizado con su animación |
| loops | wood-chop.mp3 | woodChop | Bucle del leñador, sincronizado con su animación |
| crafting | cooking-5s.mp3 | cooking(5secondsSound) | Cocinar (dura 5 s, igual que la barra) |
| crafting | chop.mp3 | cuttingVegetables | Trocear |
| crafting | mortar.mp3 | mortero | Machacar en el mortero |
| crafting | recipe-crafted.mp3 | CraftedRecipe | Preparado terminado |
| ui | page-turn.mp3 | cambioDePagina | Pasar página del libro |
| ui | item-click-drop.mp3 | vClickOrDropItem... | Coger/soltar en inventario, cofre o estación |
| ui | coins.mp3 | dineroCompraVenta | Compra y venta |
| ui | item-obtained.mp3 | ItemObtainingFromNpcorFarming | Objeto recibido de un NPC o recolectado |
| ui | chest-open.mp3 | OPeningRoomChest | Abrir el cofre de la habitación |

## Sonidos que faltan (lista de Kilian, 2026-11-15)

Conectados con sonido existente:
- Abrir el libro: usa `ui/page-turn.mp3` (el mismo que pasar página).

Conectados (2026-11-15): `music/game-intro.mp3` (música de la pantalla de título, en bucle, con fundido al empezar) y
`ui/intro-button-click.mp3` (Empezar, Sobre el juego, Controles y banderas de idioma del título).

Conectados también (2026-11-15): `ui/book-tab.mp3` (cambiar de pestaña del libro), `ui/dialogue-bubble.mp3` (un
"blip" mientras se escribe cada diálogo, como en otros juegos: no en espacios y como mucho cada 90 ms, con un tono
algo distinto cada vez; se ajusta con BLIP_GAP_MS en `DialogueBubble.tsx`) y `music/day1-ambient.mp3` (empieza
cuando el Doctor sale por primera vez de la botica el día 1 y se repite en bucle hasta que el día se cierra).

Pendientes de recibir (el archivo y el nombre los pone Kilian; aquí van los usos):
- Abrir el mapa.
- Cerrar el mapa.
