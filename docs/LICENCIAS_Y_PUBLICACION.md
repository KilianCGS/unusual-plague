# Publicar Unusual Plague: licencias, permisos y dónde alojarlo gratis (20-nov-2026)

**No soy abogado y esto no es asesoría legal.** Es un repaso de lo que hay en el repositorio y de lo que dicen las páginas
oficiales consultadas hoy; los términos de cada servicio cambian, así que cada punto marcado con ⚠ conviene confirmarlo en la
fuente antes de publicar.

## 1. Estado del guardado (lo que hay hoy)

| Qué | Estado |
|---|---|
| Autoguardado | Al empezar el día 2, el 3 y el 4, en el navegador del jugador (`localStorage`). Siempre en la habitación del Doctor |
| Continuar | Botón en el título cuando hay partida; retoma al amanecer del último día guardado |
| Copiar/pegar partida | Botón «Partida»: texto que empieza por `UP1:`; se puede llevar a otro navegador |
| Comprobado | Tests de `save-game` (ida y vuelta del texto, rechazo de textos rotos); «Continuar» probado con un guardado inyectado en un navegador sin ventana |
| **No comprobado** | Que se escriba solo al amanecer en una partida real, y el portapapeles del botón «Copiar» |
| Límites | Solo 3 puntos de guardado (no a mitad de día); se pierde si se borran los datos del sitio; es por navegador y por dirección (si cambia el dominio, no se traslada); no hay guardado manual |
| Futuro | Si cambia el formato de los datos habrá que migrar o la partida vieja se rechaza (hoy versión 1) |

## 2. Cómo jugarlo por un enlace (gratis)

**Comprobado hoy:** `next build` termina bien (24 páginas, todas estáticas). El juego no necesita servidor, así que se puede
publicar como web estática. Todas las rutas internas del juego son absolutas (`/game/...`), por lo que **necesita un dominio
raíz** (no una subcarpeta tipo `usuario.github.io/unusual-plague`). `public/` pesa 242 MB en 1.033 archivos; el mayor es de 4,2 MB.

| Opción | Gratis | Encaje con el proyecto | Cuidado |
|---|---|---|---|
| **Cloudflare Pages** | Sí; peticiones a estáticos ilimitadas; límite de 20.000 archivos por sitio ([límites](https://developers.cloudflare.com/pages/platform/limits)) | Muy bueno: 1.033 archivos, sin problema de ancho de banda | ⚠ Confirmar el límite por archivo (25 MiB según un blog, no lo vi en la página oficial); el mayor archivo pesa 4,2 MB |
| **Vercel (Hobby)** | Sí, pero **solo uso personal y no comercial** ([planes](https://vercel.com/docs/plans/hobby)); unos 100 GB/mes de transferencia según resúmenes de terceros | Bueno y el más fácil (es de Next.js) | ⚠ Una partida completa puede descargar cientos de MB: con 100 GB/mes serían unas cuantas centenas de partidas completas al mes |
| **GitHub Pages** | Sí; sitio de hasta 1 GB y unos 100 GB/mes de ancho de banda blando ([límites](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)) | Regular: exige subcarpeta salvo dominio propio | Las rutas absolutas `/game/...` se romperían en un sitio de proyecto sin dominio propio |
| Netlify, etc. | Planes gratuitos con límites similares | No mirado | ⚠ Comprobar límites actuales |

**Recomendación para ti:** Cloudflare Pages (sin tope práctico de visitas) o Vercel Hobby si prefieres lo más simple y es solo
un proyecto personal. Pasos generales: activar la exportación estática de Next (`output: "export"`, y sin optimización de
imágenes si se usara `next/image`, que hoy no se usa), subir el repositorio al servicio o arrastrar la carpeta `out/`. Puedo
prepararlo cuando quieras.

**Antes de publicar, a decidir:**
- Las páginas `/dev/*` (Decorator, colisiones, etc.) saldrían también públicas. No rompen nada (guardan solo en el
  navegador de quien las usa), pero conviene ocultarlas en la versión pública.
- Peso: comprimir los fondos grandes (hay 89 PNG de más de 1 MB) acelera la primera carga.

## 3. Licencias: qué hay en el repositorio

| Parte | Qué sé | Falta / riesgo |
|---|---|---|
| **Tu código** | Sin archivo `LICENSE`: por defecto es «todos los derechos reservados» | Decidir: MIT (otros pueden reutilizarlo) o dejarlo reservado. Para un portfolio, MIT para el código y «todos los derechos reservados» para el arte es una combinación habitual |
| **Dependencias** (Next, React...) | Licencias de producción: MIT, Apache-2.0, ISC, BSD-3-Clause, 0BSD; `sharp` (LGPL-3.0, opcional, solo si se usara optimización de imágenes en servidor); `caniuse-lite` (CC BY 4.0, solo en tiempo de compilación) | Una web estática no incluye `sharp`. No hay problema práctico |
| **Fuentes** | Almendra, MedievalSharp, Metamorphous, IM Fell DW Pica, Grenze Gotisch y Patrick Hand son fuentes de Google Fonts, por lo general con licencia SIL OFL (permite uso y redistribución en un juego) | ⚠ Solo Patrick Hand lleva su `OFL.txt` en el repositorio; conviene añadir las licencias de las demás y mencionarlas en créditos. «UP Gothic» la creaste con PixelLab (ver abajo) |
| **Arte generado con PixelLab** | Sus [términos](https://www.pixellab.ai/termsofservice) dicen que conservas los derechos de lo que creas, y prohíben usar lo generado para entrenar tus propios modelos | ⚠ No pude ver el texto completo de uso comercial. Léelo tú. La suscripción ya caducó: confirma que lo generado con ella sigue siendo tuyo |
| **Arte generado con ChatGPT** (fondos, ilustraciones) | Según resúmenes de los [términos de OpenAI](https://terms.law/ai-output-rights/chatgpt/), te asignan los derechos de lo que generas y permiten uso comercial | ⚠ Son resúmenes de terceros, no el texto de OpenAI. Y el derecho de autor de lo generado por IA es incierto: otros podrían generar algo igual y tú no podrías impedirlo con facilidad. Para un proyecto gratuito de portfolio es un riesgo bajo |
| **Sonidos y música** | `public/game/audio/README.md` apunta nombres de archivo originales (p. ej. `WalkingInInterior`), pero **no su origen ni su licencia**. Tampoco consta con qué herramienta hiciste la música de los días | ⚠ **Es el punto más abierto.** Hay que apuntar, archivo a archivo, de dónde salió y bajo qué licencia/plan. Si la música viene de un generador de IA, mira si tu plan permite publicarla (los planes gratuitos suelen restringir el uso comercial o exigir atribución) |
| **Nombre** | «Unusual Plague» y el médico de la peste son genéricos | Sin problema visible; no he buscado marcas registradas |

## 4. ¿Puedo poner el enlace en LinkedIn y que la gente juegue?

Sí, en lo técnico y en lo habitual: un enlace a una web estática se comparte igual que cualquier página; LinkedIn no aloja el
juego. Con un juego **gratuito, sin anuncios, sin ventas y sin recoger datos**, el riesgo legal es bajo. Lo que haría antes:

1. **Cerrar el origen de sonidos y música** (el único hueco real) y decidir si publicas con la música actual.
2. **Añadir una pantalla de créditos y licencias** (fuentes, herramientas de IA usadas, aviso de que es un proyecto personal)
   y un archivo `LICENSE` en el repositorio.
3. **Privacidad:** el juego no usa cookies ni analíticas y solo guarda la partida en el navegador del jugador, así que no
   necesita aviso de cookies. El proveedor de alojamiento sí registra direcciones IP en sus registros: no actives analíticas
   sin avisar.
4. **Si cobras o añades anuncios algún día**, vuelve a revisar: Vercel Hobby no permite uso comercial y los términos de IA
   cambian entre uso gratuito y comercial.
5. **Contrato de trabajo:** si tienes uno que reclame lo que haces en tu tiempo, mira esa cláusula; no la conozco.

## Fuentes consultadas hoy

- [Límites de Cloudflare Pages](https://developers.cloudflare.com/pages/platform/limits)
- [Vercel Hobby](https://vercel.com/docs/plans/hobby)
- [Límites de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
- [Términos de PixelLab](https://www.pixellab.ai/termsofservice)
- [Resumen de los términos de OpenAI sobre resultados](https://terms.law/ai-output-rights/chatgpt/)
