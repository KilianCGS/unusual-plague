# Prompts para Codex: grabados del Compendio (3 dolencias + 6 preparados)

Claude no puede hablar con Codex; estos textos están listos para pegar. Las referencias son
imágenes que ya existen en el repositorio (adjuntarlas a cada petición para clavar el estilo).

## Estilo común (pegar siempre al principio)

> Grabado de tinta sepia sobre fondo blanco puro, estilo botánico/médico antiguo del siglo XVII:
> trazo fino a pluma, sombreado con rayado cruzado, sin color, sin marco, sin texto, sin
> sombras proyectadas. Una sola escena centrada con aire alrededor (margen blanco generoso).
> Mismo trazo, grosor de línea y densidad que las imágenes de referencia adjuntas.
> Cuadrado 1254x1254 px (dolencias) o la proporción de la referencia (preparados).

Referencias de estilo (adjuntar 2-3): `public/game/ui/book/ailments/fever-v2.png`,
`scurvy-v2.png`, `chest-cough-v2.png`. Para preparados: `public/game/ui/book/preparations/mint-infusion.png`.

## Dolencias (1254x1254, fondo blanco)

Se guardan como `public/game/ui/book/ailments/<id>.png` (sustituyen a los provisionales):

1. **burn-v2.png: Quemadura.** Una mano y un antebrazo con la piel enrojecida y ampollas
   (rayado denso), sostenidos sobre un cuenco de agua fría; junto a ellos, una llama de vela
   y un hierro de forja al rojo. Sin sangre.
2. **fracture-v2.png: Fractura.** Un antebrazo apoyado sobre un cojín con el hueso marcado
   por transparencia sutil (rayado) y un pequeño bulto de hinchazón; al lado, dos tablillas
   de madera y una tira de venda enrollada.
3. **insomnia-v2.png: Insomnio.** Un rostro de perfil con ojos muy abiertos y ojeras marcadas,
   sobre una almohada; encima, una vela casi consumida y una luna creciente tras una ventana
   pequeña. Ambiente inquieto, no macabro.

## Preparados (misma proporción que `mint-infusion.png`)

Se guardan como `public/game/ui/book/preparations/<id>.png` (sustituyen a los provisionales).
Cada uno es el objeto solo, centrado, con 2-3 ingredientes que lo componen dibujados al lado,
como en las referencias:

1. **bone-broth.png: Caldo de huesos.** Cuenco de barro humeante con un hueso asomando; al lado
   un hueso largo y unas hojas de laurel.
2. **citrus-syrup.png: Jarabe cítrico.** Frasquito de cristal con tapón de corcho, medio lleno
   de líquido espeso; al lado media naranja y un puñado de azúcar.
3. **mushroom-cream.png: Crema de setas.** Cuenco con una crema espesa y una seta pequeña encima;
   al lado un hongo de pino entero y una cucharada de leche.
4. **onion-syrup.png: Jarabe de cebolla.** Frasco panzudo con líquido claro; a su lado una cebolla
   partida por la mitad y un terrón de azúcar.
5. **rehydration-drink.png: Bebida rehidratante.** Vaso o jarrita con agua clara y una pizca de
   sal y azúcar sobre un plato diminuto al lado.
6. **strong-broth.png: Caldo fuerte.** Olla pequeña de hierro con vapor y una cuchara de madera;
   al lado hueso, cebolla y una seta.

## Ingredientes nuevos: una página doble más (5.ª del apartado Ingredientes)

Hoy el apartado Ingredientes tiene 4 páginas dobles pintadas (4 objetos cada una, con el texto
incluido en la imagen, en español y en inglés). Faltan los ingredientes añadidos después:
**Hueso, Seta de pino, Azúcar y Cebolla**. Una quinta página doble con los cuatro.

- Archivos: `public/game/ui/book/ingredients/es/ingredients-05.png` y `.../en/ingredients-05.png`.
- Tamaño: **1678x937**, igual que `ingredients-01.png`..`04.png` (pegar de referencia al menos
  `ingredients-03.png` y `ingredients-04.png`, una en español y otra en inglés).
- Composición: la misma que las otras páginas dobles: libro abierto sobre pergamino, dos objetos por
  página (cuatro en total), cada uno con su dibujo a tinta sepia con toques de color suave, el nombre
  en caligrafía manuscrita grande y debajo una descripción de dos líneas.
- Texto exacto a incluir (revisable, es texto nuevo):

| Objeto | Español | Inglés |
|---|---|---|
| Hueso | **Hueso** · Hueso limpio de carne. Con él se cuecen caldos de verdadera sustancia. | **Bone** · A bone picked clean. Broths of real substance are cooked with it. |
| Seta de pino | **Seta de pino** · Seta carnosa y aromática del pinar. Da cuerpo a sopas y cremas. | **Pine mushroom** · A fleshy, fragrant mushroom of the pinewood. It gives body to soups and creams. |
| Azúcar | **Azúcar** · Cristales dulces que endulzan y conservan. Base de jarabes. | **Sugar** · Sweet crystals that sweeten and preserve. The base of syrups. |
| Cebolla | **Cebolla** · Bulbo de sabor fuerte. Cocida con azúcar da un jarabe para la tos. | **Onion** · A strong-flavoured bulb. Cooked with sugar it makes a cough syrup. |

Después de instalarlas hay que subir el contador de páginas a 5 y añadir los textos alternativos
(lo hace Claude: `INGREDIENT_SPREAD_COUNT` en `src/game/book/bookPages.ts`, `ingredientSpreadAlts` en
`src/game/i18n/book.ts` y los tests). **No es necesario ahora**: hasta que existan, el libro sigue
con 4 páginas.

La **pluma negra** de la bruja queda fuera del libro a propósito (es un objeto de la historia, no de
una receta); si quieres que tenga página, dímelo y la añado como 6.ª.

## Iconos de objetos (por si los quieres hacer también)

Los iconos del inventario son de 48x48 px (arte de píxel); los nuevos ya los tiene el juego
(generados antes con PixelLab). No hace falta nada de Codex para ellos.

## Recordatorio

- Los grabados que entregue Codex hay que revisarlos contra las referencias (misma línea).
- Al sustituir los ficheros no hace falta tocar código: el Compendio ya los usa por nombre.
- Los provisionales actuales los generan `art/book-placeholder-ailments.cjs` y
  `art/book-placeholder-illustrations.cjs`; no volver a ejecutarlos tras instalar los definitivos.
