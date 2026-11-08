# Preparados existentes: recetas y cadenas

Las 15 salidas usan objetos que ya estaban en el catálogo. No se han añadido
ingredientes, preparados ni iconos. Las siete recetas previas se conservan.
Las ocho recetas pendientes quedan implementadas como reglas de juego.

| Preparado | Ingredientes (una unidad de cada uno) | Estación |
| --- | --- | --- |
| Vendaje desinfectado | Tela + alcohol | Mesa |
| Pasta medicinal | Hierba medicinal + miel | Mesa |
| Ungüento medicinal | Hierba medicinal + carbón | Mesa |
| Sopa ligera | Agua + sal + hongo | Fuego |
| Leche con miel | Leche + miel | Fuego |
| Infusión medicinal | Agua + hierba medicinal | Fuego |
| Paño frío | Agua + tela | Mesa |
| Infusión de menta | Agua + menta | Fuego |
| Jarabe balsámico | Infusión de menta + miel + ajo | Fuego |
| Base de ungüento | Grasa animal + resina | Fuego |
| Cataplasma | Pasta medicinal + harina | Mesa |
| Compresa medicinal | Base de ungüento + tela | Mesa |
| Carbón triturado | Carbón | Mesa |
| Suspensión de carbón | Carbón triturado + agua | Mesa |
| Bebida cítrica | Naranja + agua | Fuego |

## Cadenas de dos operaciones

- Agua + menta → infusión de menta → jarabe con miel y ajo.
- Hierba + miel → pasta → cataplasma con harina.
- Grasa + resina → base → compresa con tela.
- Carbón → carbón triturado → suspensión con agua.

Una receta produce una unidad. La mesa mantiene sus dos huecos y el fuego sus
tres. Solo la receta de triturar carbón permite procesar una única unidad.
Los recipientes de agua siguen la transacción existente: se devuelve el frasco
al consumir su última unidad, si hay espacio; si no lo hay, no se consume nada.

## Libro y materiales

Conocer una receta final hace visibles también las recetas intermedias necesarias.
Los preparados encadenados indican «Preparar antes» en ES/EN. El cálculo de
materiales recorre la cadena, suma necesidades compartidas, descuenta preparados
ya llevados y redondea por lotes después de sumar. No cuenta dos veces un mismo
intermedio. Se conserva el orden de las pistas del Día 1.

## Límites actuales

- Aprender recetas al obtener ingredientes ya está activo: hierba, tela,
  alcohol, hongo, leche, miel, carbón, menta, ajo, resina, grasa, harina y naranja
  revelan preparaciones relacionadas. Agua, recipientes y sanguijuela no revelan
  recetas. Recibir/fabricar un preparado enseña también su receta.
- El conocimiento se conserva durante la sesión aunque se gasten o guarden los
  objetos. Las operaciones fallidas no enseñan recetas. Examinar pacientes
  sigue siendo otra vía de aprendizaje. Una notificación ES/EN indica cuándo
  consultar Preparados, y las páginas muestran disponibilidad en la bolsa.
- Las nuevas fuentes de materiales en el Día 2 siguen pendientes; estar en el
  catálogo no implica poder conseguir el ingrediente durante una partida.
- No se han fijado nuevos tratamientos ni casos del Día 3 con esta entrega.
- La extracción/análisis de sangre y el tratamiento del agricultor siguen pendientes.
- No se han añadido antídotos, tónicos ni papillas que no existieran en el catálogo.

## Prueba rápida

`/dev/crafting` incluye presets para cataplasma (`chain set`), jarabe
(`syrup chain`), compresa (`compress chain`), suspensión (`charcoal chain`)
y bebida cítrica (`citrus drink`). Son inventarios desechables de prueba.
