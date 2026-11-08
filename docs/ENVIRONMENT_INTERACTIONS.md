# Interacciones cotidianas

Los textos ya están escritos en ES/EN. Tablón, pozo y estatua de la plaza ya
están activos con las zonas de Kilian. Los demás esperan colocación manual.
No dan objetos ni cambian casos médicos.

1. Abre `/dev/collisions` y selecciona la escena.
2. Selecciona el modo `interaction` y dibuja un rectángulo en suelo accesible
   junto al objeto, donde puedan estar los pies del Doctor. No dentro del collider.
3. Selecciona la zona y elige/escribe su `interactionId`. El campo ofrece las
   opciones de esa escena. Deja `requiredDirection` en `any` para empezar.
4. Usa `Copy export` y entrega el resultado para integrarlo. El runtime no lee
   borradores del editor; no hace falta redibujar ni reemplazar sus colliders.

| Escena | Objeto | interactionId |
| --- | --- | --- |
| plaza | Tablón de anuncios | `world.plaza.noticeboard` |
| plaza | Pozo | `world.plaza.well` |
| plaza | Estatua | `world.plaza.statue` |
| mill-farmland | Herramientas | `world.mill.tools` |
| granary-interior | Sacos | `world.granary.sacks` |
| tavern-interior | Hogar | `world.tavern.hearth` |
| smithy-interior | Yunque | `world.smithy.anvil` |

Varias zonas pueden usar el mismo interactionId (por ejemplo dos tablones).
Cada zona debe conservar un id geométrico único. Las observaciones se muestran
con la voz del Doctor; el objeto no tiene un bocadillo propio.

## Integración

Los exports de interacciones se incorporan a
`src/game/interactions/environmentZones.ts`, agrupados por escena de runtime.
`sceneInteractions.ts` los añade a las zonas existentes, preservando agua,
crafting y cofre. Los textos están en `dialogue/environmentDialogues.ts`.
