# Día 4: checklist de colocación (19-nov)

Estado hoy: en la composición "artifacts" (que el juego lee como capítulo 4) hay **3 instancias**: el leñador con
artefacto, el montón de troncos y el círculo mágico (en `forest` y `forest-cottage`). Todo lo demás del día 4 son las
escenas del día 3 sin personas. **El día 4 no se puede terminar hasta que esté colocada la Bruja** (punto 1).

Las interacciones se generan solas a partir de lo que colocas (`artifacts.interactions.ts`); no hay que escribir ids.

## 1. Imprescindible para poder terminar el día (sin esto no hay final)

- [ ] **Bruja en su casita**, en `forest-cottage-interior`: asset `witch-conjuring-front` (de frente, conjurando).
  Cualquier asset que empiece por «witch» dentro de `forest-cottage` o `forest-cottage-interior` (salvo gato y cuervos) se
  convierte en la conversación final (`chapter4.cottage.witch`). Poner solo UNA.
- [ ] Opcional: el gato (`witch-cat-sitting`) a su lado. No cambia nada del juego.
- [ ] La puerta de la casita ya se abre en el día 4 (`world/lockedDoors.ts`): no hay que tocarla.
- [ ] La **pluma negra** debe llevarla el Doctor. Sale del trueque con la Bruja de la taberna del día 1 (seta por hierba).
  Si no la lleva, la Bruja no empieza y el Doctor piensa que se la dejó en el cofre. El juego no la gasta.

## 2. Vecinos absortos (cada uno da 2 pensamientos propios del Doctor)

Assets disponibles (todos con su `-smartphone`): `woman-sweeping`, `fisherman`, `bartender`, `baker`,
`villager-sitting`, `woodcutter` (ya colocado), `blacksmith`, `woman-washing-clothes`, `child-sitting`,
`child-sitting-legs`, `fainted-man`, `fainted-woman`, `old-man-stool`, `old-man-bench`, `man-tankard-bust`,
`woman-jug-bust`.

Sugerencia de reparto por escena (las pinturas nocturnas existen para todas estas):

| Escena | Qué colocar | Nota |
|---|---|---|
| `plaza` | 3–4: `villager-sitting`, `old-man-bench`, `child-sitting`, `fainted-woman` | La más poblada; era donde rezaba la gente |
| `bakery-street` | `woman-sweeping`, `baker` | Hay noche pintada |
| `apothecary-street` | `child-sitting-legs`, `man-tankard-bust` | Al salir de la botica: lo primero que ve |
| `smithy-street` | `blacksmith`, `fainted-man` | |
| `tavern-street` | `woman-jug-bust`, `old-man-stool` | |
| `outskirts` | `woman-washing-clothes` | Junto al río |
| `forest` | `woodcutter` (ya) | |

No hace falta rellenar todas: con 8–10 personas repartidas el pueblo se siente tomado, y cada pose tiene su propio texto.

## 3. Despiertos de noche (ya existen en código, opcional colocarlos)

Se colocan como su asset **normal** (sin `-smartphone`) y hablan con una versión nocturna:
`fisherman` (outskirts), `elderly-man-with-jug` (tavern-street), `bartender` (tavern-interior),
`villager-woman-01` (farm). Son los cuatro que no están enganchados: sirven de contraste.

## 4. Bloqueos del paso (ya hechos como assets, falta decidir dónde)

- `ch4-barrier-horizontal` / `ch4-barrier-vertical`: círculo mágico violeta con collider.
- `ch4-log-pile`, `ch4-fallen-tree`, `ch4-stone-blocks`: troncos, árbol caído y bloques.
- `ch4-burning-cart`: carreta con paja ardiendo (la que no te convence; sin caballos). Si no la quieres, no se coloca.
- Cuervos `witch-crow-*`: avisos en el camino a la casita.
- Zonas cerradas pensadas (borrador): bosque ancho, granja y paso de la mina; el camino a la casita queda abierto.

## 5. Decoración opcional (sin código)

Aves, luciérnagas, murciélagos y corrientes de río ya están registradas y las ves en el Decorator (capas de
`ambient`); en el día 4 no se añaden solas, las colocas tú.

## 6. Comprobación cuando termines

1. Exporta la composición «artifacts» como siempre y dime que está lista.
2. Yo conecto lo que falte y escribo el test de recorrido del día 4 (despertar, llegar a la casita, hablar con la Bruja con
   la pluma, cierre y pantalla de fin).
3. Pruébalo en `/dev/day4` (tiene la pluma y la partida del día 3 ya hechas).
