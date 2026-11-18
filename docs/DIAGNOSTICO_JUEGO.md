# Diagnóstico del juego, 18 de noviembre (faltan 1 día)

Hecho leyendo el código y pasando los 68 tests (66 en verde; los 2 rojos son la salida del claro,
que mueves tú). **Nada de esto está probado en el navegador con una partida entera.**

## Estado por día

| Día | Estado | Qué falta |
|---|---|---|
| 1 | Jugable de principio a fin (test de recorrido). | Nada conocido. |
| 2 | Jugable (3 casos, 4 recados). Cobertura de test del recorrido. | Revisar líneas; tu QA. |
| 3 | Jugable en datos: 4 casos (dos con la mina cerrada), 2 recados, bruja, renovar herramientas. | Pistas del mundo, síntomas menos obvios, apertura, objetivos guiados (ver abajo). |
| 4 | Noche, bruja, final, pensamientos de la gente; arte hecho. | Salida del claro movida por ti; comprobar colliders; no hay test de recorrido entero del día 4. |

## Riesgos, de más a menos

1. **No hay guardado.** Si el navegador se recarga o se cierra, se pierde todo (la propia pausa lo
   avisa). Para una partida de 4 días con QA es el mayor riesgo práctico.
2. **Nadie ha jugado los 4 días seguidos en navegador.** Los tests recorren datos, no pantallas:
   no ven colisiones raras, cosas tapadas, ni sonido.
3. **Música sin escuchar.** Los tres archivos nuevos están enlazados, con fundido de entrada de
   2,5 s. Volumen 0,6 igual que el día 1; falta que lo oigas.
4. **Textos nuevos sin revisar** (recados, anciano, voces de los 19 del día 3...). Están en ES/EN
   pero son míos. Lista en `docs/TEXTOS_NUEVOS_ES_EN.md`.
5. **Dos tests rojos por diseño** (mapa y alcanzabilidad): el pasillo del claro queda fuera del
   mundo al estrechar el bosque a 1362. Se arregla al mover tú la salida.
6. **Cabos sueltos menores:** icono/grabado del jarabe es copia del balsámico; 9 plantas viejas
   del claro; palomas en días 2-3 sin decidir.

## Qué está bien

- Economía sin callejones sin salida demostrada por búsqueda de estados (714.365 estados).
- Herencia de días 1→2→3 comprobada, con lo que no se recoge en un día disponible en el siguiente.
- ES/EN: los textos nuevos llegan siempre en pares.

## Guardado: cómo podría funcionar

Hoy el estado vive en memoria dentro de `GameWorld`: capítulo, inventario, cofre, monedas, casos,
recompensas reclamadas (flags), recetas conocidas, objetos recogidos, escena y posición. Casi todo
ya es **datos simples** (conjuntos y objetos), así que se puede serializar.

| Opción | Cómo | Pros | Contras | Esfuerzo |
|---|---|---|---|---|
| A. Autoguardado al amanecer | Al empezar cada día se guarda en `localStorage`; el título ofrece «Continuar» | Muy poco código, sin casos raros a mitad de escena, reanuda en un punto limpio | Pierdes lo hecho en el día si cierras | ~1 sesión corta |
| B. Autoguardado continuo | Guarda tras cada cambio relevante (receta, trato, caso, cambio de escena) | No se pierde nada | Hay que cubrir todo el estado, y reanudar a mitad de conversación o crafteo es delicado | ~1-2 sesiones |
| C. Ranuras manuales (menú de pausa) | «Guardar» y «Cargar» con 3 ranuras | El jugador decide | Más interfaz y más pruebas | ~2 sesiones |
| D. Código/archivo exportable | Botón «Copiar partida» (texto) y «Pegar» | Útil para tu QA entre ordenadores | No es lo que espera un jugador | ~media sesión |

**Recomendación para el 19:** A (al amanecer de cada día) y, si da tiempo, D para que tu pareja y
tú podáis pasaros una partida. B y C quedan para después de la entrega.

Decisiones que necesito de ti: dónde reanuda (dormitorio del Doctor al inicio del día, que ya
existe), si «Continuar» pregunta antes de borrar una partida, y si se guarda también el idioma y
el volumen (ya se guardan aparte).
