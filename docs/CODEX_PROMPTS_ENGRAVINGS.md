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

## Recordatorio

- Los grabados que entregue Codex hay que revisarlos contra las referencias (misma línea).
- Al sustituir los ficheros no hace falta tocar código: el Compendio ya los usa por nombre.
- Los provisionales actuales los generan `art/book-placeholder-ailments.cjs` y
  `art/book-placeholder-illustrations.cjs`; no volver a ejecutarlos tras instalar los definitivos.
