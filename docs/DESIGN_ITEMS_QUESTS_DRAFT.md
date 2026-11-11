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
