// Single place to swap the UI font. The project has no pixel font yet (only
// Geist via next/font), and none is downloaded arbitrarily: this stack is a
// monospace FALLBACK. All of it covers the Spanish characters
// (á é í ó ú ñ ü ¿ ¡). UI components read it through the `--ui-font` CSS
// variable, so replacing it later means editing only this constant.
export const PIXEL_FONT_FAMILY =
  '"Courier New", Courier, ui-monospace, Menlo, Consolas, monospace';
