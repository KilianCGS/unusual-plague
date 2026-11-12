// Single place to swap the UI font. MedievalSharp (SIL OFL, loaded in globals.css):
// medieval but legible, with the Spanish characters (á é í ó ú ñ ü ¿ ¡) and clear
// numerals for coins and prices. Candidates for a swap are on /dev/fonts. UI components
// read it through the `--ui-font` CSS variable. The monospace stack is only the fallback.
export const PIXEL_FONT_FAMILY =
  '"MedievalSharp", "IM Fell DW Pica", Georgia, "Courier New", serif';
