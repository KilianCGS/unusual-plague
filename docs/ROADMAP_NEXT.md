# Hoja de ruta hasta el 19 de noviembre (actualizada el 12-nov)

Actualiza `ROADMAP_GAME_STATUS.md`. Avance estimado hoy: **~72 / 100** sin música (antes 58).
Ya está construido lo que faltaba de estructura: días 1-4 encadenados, 10 dolencias, día 3
(tres pacientes, bruja del claro), día 4 de noche con final y pantalla de fin, 22 recetas, tienda
por días, estilo de interfaz unificado. Lo que queda es sobre todo **contenido tuyo, pulido y QA**.

## A. Día 1: cerrarlo del todo (tú juegas, yo corrijo)

- Tú: jugar el día 1 completo y anotar cualquier cosa (estética, ritmo, textos, fallos).
- Yo: arreglar lo que salga, en bloque, con tests. Candidatos que ya veo:
  - Pantalla de diagnóstico con el estilo madera y pergamino (hoy es marrón oscuro y plana).
  - Animación de «preparando» y fondo por estación en el crafteo.
  - Libro con 22 recetas y 10 dolencias: comprobar que se lee bien (páginas, índices).
  - La bruja ahora exige dos huecos libres (pluma): ver si se entiende o conviene avisar.

## B. Tu parte (Decorator, arte y textos) — lo que más pesa en la fecha

| Qué | Dónde | Cuándo |
|---|---|---|
| Colocar picapedrero del taburete (`chapter3.quarry.stonecutter`), los otros dos de decorado | Cantera, capítulo 3 | 13 nov |
| Colocar mujer del plumero (`chapter3.apothecaryStreet.duster`) y minero del camino (`chapter3.mountainPath.miner`) | Calle botica y paso de la mina, cap. 3 | 13 nov |
| Colocar bruja del claro (`chapter3.glade.witch`) y las setas de pino | Claro, cap. 3 | 13 nov |
| Colocar cura, oyentes y gente con artefacto (`chapter4.artifact.*`) | Plaza y calles, «artifacts» | 14-15 nov |
| Colocar a la bruja de la noche (`chapter4.cottage.witch`) | Casita nocturna | 15 nov |
| Obstáculos nocturnos (bosque ancho, granja, paso de la mina) | `/dev/collisions`, escenas «(noche)» | 15-16 nov |
| Pintar los 6 grabados de recetas, los 3 de dolencias y el dibujo final nocturno | ChatGPT | 16-17 nov |
| Revisar textos ES/EN de los días 2, 3 y 4 | Documentos y código | 13-16 nov |

## C. Mi parte (código y contenido)

| Qué | Esfuerzo | Notas |
|---|---|---|
| Conectar ids de las instancias que coloques (día 3 y 4) | Bajo | En cuanto me des los nombres |
| Zonas cerradas del día 4 con tus obstáculos (+ avisos del Doctor) | Medio | Necesito tus exportaciones |
| Revisar el día 2 de punta a punta y equilibrar la economía de los 4 días | Medio | Simulación de monedas y objetos |
| Textos ambientales del día 3 y 4 (gente del pueblo) | Medio | Hoy el día 3 hereda los del día 2 |
| Más recorridos automáticos (día 2, 3 y 4 completos) | Medio | Evitar regresiones |
| Diagnóstico estilizado, crafteo animado, ajustes del libro | Bajo-medio | Pulido |
| Pantalla de ajustes: idioma y volumen (para cuando haya sonido) | Bajo | Opcional |
| Gestor de sonido silencioso + monedas, fuego y mortero | Medio | Sin música, según lo acordado |
| Build de producción y despliegue (`next build`, comprobar peso de imágenes) | Bajo | 17-18 nov |

## D. Calendario propuesto

- **12 nov (hoy):** tú juegas el día 1; yo reviso el día 2, la economía y el libro.
- **13 nov:** colocaciones del día 3 y conexión de ids; textos del día 3 revisados; pulido del día 1.
- **14-15 nov:** día 4 (gente, cura, bruja nocturna), zonas cerradas, ambientales.
- **16-17 nov:** grabados y dibujo final; recorridos automáticos de los 4 días; sonido básico.
- **18 nov:** QA de tu pareja con el juego entero; correcciones.
- **19 nov:** margen y entrega.

## E. Riesgos

1. **Tus colocaciones** son el cuello de botella: cualquier retraso en el Decorator se come el margen.
2. **Textos sin revisar** (hay muchos nuevos): conviene revisarlos por tandas, no al final.
3. **Los grabados** del libro son provisionales; si no llegan, el juego funciona igual.
4. **Pesos de imagen:** las pinturas nocturnas son de 3-4 MB; probar la carga en un equipo normal.
