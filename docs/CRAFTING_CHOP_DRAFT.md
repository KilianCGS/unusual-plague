# Borrador: "Trocear" en la cocina (2026-11-14)

Estado: **implementado el 2026-11-14** con las decisiones de abajo (la propuesta original queda como referencia).

## Decisiones tomadas (2026-11-14)

- Dos botones en la misma interfaz de la cocina: Trocear y Cocinar.
- Rendimiento 1 a 1: una unidad entera da una unidad troceada.
- Sin paso de tutorial: el botón se descubre al abrir la cocina.
- Se aplica a todas las recetas afectadas (las 7 de abajo).
- Pendiente de decidir por Kilian: qué ingredientes se trocean, nombres de los ítems y el aspecto
  de los iconos (ver las preguntas al final).

## Idea

En la estación de la cocina (`fire`) el jugador tendrá dos acciones, con dos botones en la misma
interfaz (como el mortero dentro de la mesa de trabajo):

- **Trocear**: un solo ingrediente → su versión troceada. Instantáneo (sin espera).
- **Cocinar**: lo de hoy, con la espera de 5 s y la barra "Preparando...".

El mortero (triturar) no cambia: hierba y carbón siguen yendo ahí.

## Qué se trocea

| Ingrediente | Resultado (nuevo ítem) | Se usa en |
|---|---|---|
| Cebolla | Cebolla troceada | Jarabe de cebolla, Caldo fuerte |
| Naranja | Naranja troceada | Bebida cítrica, Jarabe cítrico |
| Seta de pino | Seta de pino troceada | Crema de setas |
| Ajo | Ajo troceado | Jarabe balsámico |
| Menta | Menta troceada | Infusión de menta (y por tanto el balsámico) |

Quedan fuera (de momento): hueso (se usa entero), azúcar, sal, agua, leche, miel, harina.

## Efecto en las recetas

Las recetas que hoy usan el ingrediente entero pasan a pedir el troceado. Cada una gana un
paso, sin pedir ingredientes nuevos:

- Jarabe de cebolla: cebolla troceada + azúcar.
- Caldo fuerte: cebolla troceada + hueso + agua.
- Bebida cítrica: naranja troceada + agua + azúcar.
- Jarabe cítrico: naranja troceada + azúcar.
- Crema de setas: seta de pino troceada + leche + sal.
- Jarabe balsámico: infusión de menta + miel + ajo troceado.
- Infusión de menta: agua + menta troceada.

Receta de troceado (una por ingrediente): `fire.chop-onion`, `fire.chop-orange`, etc.

## Cosas del código que se tocan

- `recipes.ts`: tipo de estación (acción `chop`), recetas de troceado y las 7 modificadas.
- `items.ts`: 5 ítems nuevos y sus nombres ES/EN (texto nuevo, a revisar).
- Iconos: **5 iconos nuevos** (uno por troceado), mismo estilo que los de `resources/`.
  Los puedo generar con PixelLab a partir del icono del ingrediente entero.
- `CraftingOverlay.tsx`: segundo botón en la cocina; la espera de 5 s solo para Cocinar.
- `crafting.ts` y `needs.ts`: que `getCraftingTargets` entienda la cadena (el libro y los
  recados siguen pidiendo la preparación final, no el troceado).
- `recipeDiscovery.ts`: saber una preparación revela también el troceado de sus ingredientes.
- Libro: la página de ingredientes no incluye los troceados (son intermedios, como la hierba
  triturada).
- Tests: hay que actualizar los que fijan las recetas actuales (crafting, economía, libro).

## Preguntas abiertas

1. ¿El tutorial menciona "trocear", o se descubre solo al abrir la cocina?
2. ¿Una unidad entera da una unidad troceada, o el troceado rinde más (por ejemplo 1 naranja = 2
   troceados)? Con 2 por 1 el jugador necesita menos ingredientes y la economía se relaja.
3. ¿El troceado también tiene un pequeño sonido (cuchillo sobre tabla) aunque no haya espera?
4. ¿Se aplican a todas las recetas de una vez o solo a las del día 1-2 para no romper nada?


## Lo que se implementó (resumen)

- Estación `chop` (tabla de cortar) abierta desde un botón en la cocina; vuelve con "← Cocina".
- Se **cortan** cebolla, hongo y seta de pino; se **machaca** (mortero) el ajo. Hierba y carbón ya
  se machacaban. La naranja NO se trocea.
- Recetas cambiadas: sopa de hongos, crema de setas, jarabe de cebolla, caldo fuerte (cebolla
  troceada) y jarabe balsámico (ajo machacado).
- Cuatro ítems nuevos con icono propio (PixelLab) y página de libro provisional; los grabados
  definitivos los pide `docs/CODEX_PROMPTS_ENGRAVINGS.md`.
