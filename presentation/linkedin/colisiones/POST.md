# Carrusel "Colisiones, profundidad y transiciones" · borrador para revisar

Estado: **sin publicar ni programar**. Pendiente de tu aprobación.
Imágenes (1080 × 1350, PNG) en `presentation/linkedin/colisiones/out/`:

1. `1-colliders.png`
2. `2-profundidad.png`
3. `3-transiciones.png`

## Frase inicial (la que se ve antes del "ver más")

Un rectángulo no basta para una fuente redonda. Así dibujo las colisiones de mi juego.

## Texto del post

Que el Doctor choque bien con el mundo es de lo menos vistoso de *Unusual Plague*, y de lo que más se nota cuando falla.

Así lo resuelvo con herramientas propias, dentro del proyecto:

1. **Colliders dibujados a mano.** La plaza tenía un rectángulo de 185 × 230 para la fuente. Ahora es una forma libre de 23 puntos que sigue su contorno, con el mismo editor y los mismos colores de siempre (rojo = suelo que no se pisa).
2. **Profundidad.** Una forma violeta recorta el fondo y lo dibuja por encima del Doctor mientras sus pies estén por encima de una línea de profundidad. Así pasa por detrás de la estatua y por delante cuando la cruza.
3. **Transiciones.** Pisar la zona amarilla de la herrería lleva a su interior: fundido a negro de 450 ms y llegada a un punto concreto, mirando al norte.

Todo son datos en archivos del juego: la geometría se dibuja en el editor y se exporta a código.

¿Cómo montáis vosotros las colisiones en vuestros proyectos?

#gamedev #indiedev #pixelart #typescript #nextjs

## Textos alternativos

**Imagen 1 · Colliders.** Dos capturas de la fuente de la plaza de *Unusual Plague*, en pixel art, con la zona de colisión en rojo. A la izquierda, "Antes": un rectángulo de 185 × 230 que cubre la estatua y parte del suelo. A la derecha, "Ahora": una forma libre de 23 puntos que sigue el contorno redondo de la fuente. Debajo, el inicio del código de la forma: `{ id: "plaza-poly-1", points: [ { x: 691, y: 478 }, … ] }`.

**Imagen 2 · Profundidad.** Dos capturas del juego con la estatua de la plaza. En "Detrás", el Doctor está al otro lado de la estatua y solo se ve el ala de su sombrero asomando. En "Delante", el Doctor está frente a la base de la estatua y se ve entero. Abajo, una captura del editor con la forma violeta sobre la estatua y el valor `depthY: 442`.

**Imagen 3 · Transiciones.** Tres paneles en secuencia. Primero, el editor mostrando la zona amarilla de salida frente a la puerta de la herrería (215 × 40). Segundo, el juego a mitad de un fundido a negro de 450 ms con el Doctor en la puerta. Tercero, el interior de la herrería con el Doctor en el punto de llegada (289, 285) mirando al norte. Debajo, la llamada `exit("to-smithy-interior", …)` que une las dos escenas.

## Qué es captura real y qué es esquema

| Imagen | Elemento | Tipo |
|---|---|---|
| 1 | Paneles "Antes" y "Ahora" | **Esquema**: contornos dibujados sobre el arte real de la plaza con las coordenadas de `plazaGeometry.ts` (el rectángulo "antes" es el de la versión del commit `9c93f24`) |
| 1 | Código | **Real**, primeros puntos de `plaza-poly-1` |
| 2 | "Detrás" y "Delante" | **Capturas reales** del juego en la plaza (`/dev/day2`) |
| 2 | "En el editor" | **Captura real** de `/dev/collisions` |
| 3 | ① Zona | **Captura real** de `/dev/collisions` (calle de la herrería) |
| 3 | ② Fundido | **Captura real** del juego a mitad del fundido (opacidad ≈ 0,35 al capturarla) |
| 3 | ③ Llegada | **Captura real** del juego |
| 3 | Flechas | **Esquema** |
| 3 | Código | **Real**, de `newWorldScenes.ts` (acortado: se omite el nombre de la variable) |

## Datos verificados en el repo

- Fuente antes: `plaza-12`, `x: 685, y: 375, width: 185, height: 230` (commit `9c93f24`). Ahora: `plaza-poly-1`, 23 puntos (`src/game/new-world-map/geometry/plazaGeometry.ts`).
- Profundidad: `plaza-depth-1`, `depthY: 442` (mismo archivo). Las formas violeta usan `PROTAGONIST_FEET_HITBOX` para comparar contra la planta de la caja de pies.
- Transición: `smithy-street-transition-1`, 215 × 40 en (470, 405); salida `to-smithy-interior` → escena `smithy-interior`, llegada `from-smithy-street` (`smithy-interior-spawn-1`, x 289, y 285, mirando al norte). Fundido: `SCENE_FADE_MS = 450` (`src/game/world/GameWorld.tsx`).

## Cosas que quizá quieras revisar

- Las formas libres y la profundidad violeta **aún no están en un commit** (siguen en tu árbol de trabajo). El post habla de ellas en presente; conviene publicar cuando estén subidas.
- La captura de la herrería muestra al herrero herido (estado de la jornada 2 en `/dev/day2`). Es parte del juego; dime si prefieres un estado sin spoiler.
- El estado de la plaza que se ve es el de tu export actual; si redibujas colliders o profundidades, regenero las imágenes con `node presentation/linkedin/colisiones/build.cjs`.

## Cómo regenerar

1. Servidor en marcha (`npm run dev`).
2. `node presentation/linkedin/colisiones/capture.cjs` (capturas reales a `raw/`).
3. `node presentation/linkedin/colisiones/build.cjs` (imágenes a `out/`).
