# Borrador: objetos, cocina medicinal, misiones y noche del capítulo 3

**Estado: BORRADOR.** Solo lo marcado con ✅ lo has aprobado tú. Lo demás son
propuestas mías: precios, líneas de diálogo y cantidades siguen pendientes. Nada
de esto está implementado salvo lo indicado en "Ya hecho".

## 1. Decidido (✅)

- ✅ Cocina medicinal: más comida además de medicinas.
- ✅ **4 objetos nuevos** (en lugar de 8): **hueso, seta, azúcar, cebolla**.
- ✅ Renombrar el de la mina: **Hongo de cueva**; el nuevo del bosque profundo es la **Seta de pino**.
- ✅ **6 recetas nuevas** (sección 3).
- ✅ Origen: **regalos de misión en el día 1** (te enseñan las recetas) y **el mercader los vende desde el día 2** (azúcar caro y cebolla).
- ✅ Inventario de **6 casillas**; se mantiene el límite y se gestiona con el cofre (sin bolsa mejor).
- ✅ Mercader: sal a 1 moneda y empiezas con 4 monedas.
- ✅ Misiones del día 1: una en cada zona nueva y una del pueblo; el leñador vive en el campamento del bosque profundo y un personaje se sienta en el banco de la cantera.
- ✅ Noche del capítulo 3: ChatGPT pinta las versiones nocturnas; **colliders y zonas no cambian**, solo la decoración.
- Tus dibujos de cantera y bosque profundo ya están integrados como fondo. Faltan colliders, salidas, spawns y decoración (tuyos).

## 2. Ya hecho

- Sal en el mercader, 4 monedas iniciales, inventario a 6, fondos de las zonas nuevas, mapa con Cantera y Bosque profundo.
- Pruebas automáticas: alcanzabilidad de todas las escenas y viabilidad del día 1.
- Recorrido real del día 1 de principio a fin: los tres pacientes tratados, cobro exacto (26 monedas) y cierre del día.

## 3. Los 4 objetos y las 6 recetas

| Objeto | Origen | Precio (propuesta, no redondo) |
|---|---|---|
| Hueso | Cocinero del campamento de la cantera (regalo en la misión del día 1) | mercader desde el día 2, por decidir |
| Seta de pino | Bosque profundo (regalo del leñador y recogible) | no se vende |
| Azúcar | Mercader desde el día 2 | caro, por decidir |
| Cebolla | Granja y mercader desde el día 2 | barato, por decidir |

Todas las recetas son **al fuego** (máximo 3 ingredientes); el mortero no cambia.

| Receta | Ingredientes | Sirve para |
|---|---|---|
| Caldo de huesos | hueso + agua + sal | estómago, agotamiento |
| Crema de setas | seta de pino + leche + sal | estómago, agotamiento |
| Jarabe de cebolla | cebolla + azúcar | tos (capítulo 3) |
| Bebida reconstituyente | agua + azúcar + sal | agotamiento |
| Jarabe cítrico | naranja + azúcar | escorbuto (capítulo 3) |
| Caldo fuerte | cebolla + hueso + agua | agotamiento, fuerzas |

El azúcar existía en la época como especia cara y medicinal, así que encaja como
objeto que se compra en vez de recoger.

## 4. Dolencias y tratamientos

El Compendio ya promete variedad: la tos admite infusión de menta o jarabe
balsámico; el escorbuto, bebida cítrica; el agotamiento, bebida cítrica. Los
objetos nuevos se apoyan en eso sin cambiar el libro.

| Dolencia | Hoy | Alternativas nuevas |
|---|---|---|
| Fiebre común | infusión medicinal + paño frío | sin cambios |
| Mal del estómago | sopa de hongo de cueva + leche con miel | caldo de huesos, crema de setas |
| Herida infectada | vendaje + ungüento | sin cambios |
| Tos del pecho (cap. 3) | por definir | jarabe de cebolla, infusión de menta, jarabe balsámico |
| Escorbuto (cap. 3) | por definir | jarabe cítrico, bebida cítrica |
| Agotamiento | bebida cítrica + infusión de menta | bebida reconstituyente, caldo fuerte, caldo de huesos |

Pregunta de diseño abierta: ¿el paciente pide un tratamiento concreto o valen varios?

## 5. Misiones del día 1 (esbozo, sin texto final)

Todas son opcionales y no bloquean a los pacientes.

| Dónde | Quién | Da | Conversación |
|---|---|---|---|
| Bosque profundo | Leñador (campamento) | Seta de pino | El bosque y la bruja |
| Cantera | Cocinero o capataz (banco, hoguera) | Hueso | Los mineros, los derrumbes |
| Pueblo | Costurera de la calle de la botica | Tela (ahorra una moneda) | Noticias de panadera y taberna |

## 6. Noche del capítulo 3

ChatGPT pinta una versión nocturna de cada escena. Lo que hay que cuidar:

- **Misma composición, mismo tamaño y mismo encuadre que el fondo de día.** Así los
  colliders, las formas de profundidad, las transiciones y los spawns siguen valiendo
  sin tocarlos. Un desfase de unos píxeles ya se notaría en las colisiones.
- Antes de integrar cada imagen, una **comprobación automática de alineación** contra
  el fondo de día (comparación de contornos) para detectar desvíos.
- La capa de profundidad recorta el fondo de la escena: en capítulo 3 debe leer la
  versión nocturna. Se resuelve en el juego, no a mano.
- La decoración (llamas, luces, personajes) se coloca en el Decorator en una
  composición propia del capítulo 3, que ya es el mecanismo del juego.
- Peso: unas 13 escenas exteriores a 3 o 4 MB cada una. Se cargan solo en el capítulo 3.

## 7. Preguntas abiertas

- Precios del mercader (azúcar, cebolla, hueso, sal): invento valores no redondos para tu revisión.
- ¿Un tratamiento concreto por paciente o varios válidos?
- ¿El leñador sigue siendo paciente el día 2 en el fondo del bosque?
- ¿Quién es el personaje del banco de la cantera y qué da?
- El agradecimiento de la panadera ahora da una sal sobrante (el mercader ya la vende): ¿lo cambiamos por otra cosa?
- Detalle de interfaz que he visto: con la pantalla de diagnóstico abierta, pulsar Espacio activa la primera opción (Envenenamiento) sin querer. ¿Lo dejamos o lo evitamos?

## 8. Decisiones del 2026-11-11 (tarde) y lo que ya está en el código

Decidido por Kilian:
- **Los pacientes mantienen sus recetas.** Las recetas nuevas se usan en **encargos de PNJ en la cantera y el claro** ("craftear para conseguir oro"): cada PNJ pide una receta y paga monedas.
- **Precios del mercader (suyos):** azúcar 3, hueso 1, cebolla 1; el mercader los vende **desde el día 2**.
- **El hueso lo da la bruja en el día 3, en el claro.** Las setas de pino se **recogen en el claro en cualquier momento** (cuántas, ya se verá).
- **La bruja:** capítulo 1, a cambio del hongo, nos da "algo" (por decidir); capítulo 2, nos da la sanguijuela sin más; capítulo 3, está en el claro y puede pedir algo a cambio de **un mal presagio** que da una pista del día 4.
- **Capítulo 4:** de noche; la gente está con los artefactos; se bloquean zonas (bosque, granja y paso de la mina); el jugador se reúne con la bruja.

Ya implementado (sin commit hasta que lo apruebe):
- 4 objetos nuevos con iconos (hueso, seta de pino, azúcar, cebolla) y el hongo de la mina renombrado "Hongo de cueva".
- 6 recetas al fuego (caldo de huesos, crema de setas, jarabe de cebolla, bebida reconstituyente, jarabe cítrico, caldo fuerte), con iconos, descubrimiento por ingredientes y entrada en el libro.
- El mercader vende azúcar, cebolla y hueso desde el día 2 (existencias 3 de cada una: propuesta).
- Asset de decorador `pine-mushroom-world` para colocar las setas en el claro.
- Las 6 ilustraciones del libro son **provisionales** (el icono ampliado en tinta sepia). Pendiente: pintarlas como las demás (grabado a tinta sepia, 1678x937, fondo blanco). Prompt sugerido para ChatGPT: "grabado a tinta sepia de [objeto], estilo de libro de botánica medieval, tramado fino, fondo blanco, formato 16:9".

Todos los textos nuevos (nombres de objetos y descripciones de las recetas) están en ES/EN y esperan tu revisión.

Decidido después (2026-11-11, noche) e implementado:
- **El claro se abre desde el día 1.** Los encargos de recetas los da el **minero de la cantera** (reutilizado, sentado en el banco); la bruja del claro **no** tiene encargos de recetas, solo el mal presagio del día 3.
- **Encargo 1 (cantera):** caldo de huesos por 5 monedas, una vez. Se activa cuando Kilian coloca al minero en el Decorator con el `interactionId` `chapter2.quarry.miner`. Los pagos "a veces con un objeto" quedan para los siguientes encargos.
- **Capítulo 1, la bruja:** además de la hierba, entrega una **pluma negra de cuervo** sin explicar nada ("te lo diré cuando importe"). La pluma no sirve para recetas y cuenta en el día 4. Ocupa una casilla de la bolsa hasta que se guarde en el cofre, así que el trueque ahora necesita dos huecos libres.
