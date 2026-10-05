// Text that goes on a page. Content says WHAT is emphasised, the component
// decides HOW it looks (no regex over strings): a fragment is either plain
// text or an `{ emphasis }` fragment (used for the names of preparations).
export type RichTextFragment = string | { emphasis: string };
export type RichText = readonly RichTextFragment[];

// Visual role of a block of page text; the stylesheet maps each to a size and
// weight. "name" = the title under an illustration, "heading" = a section
// title on a page, "body" = running text, "note" = small placeholder text.
export type BookTextRole = "name" | "heading" | "body" | "note";

// A block of text placed on a spread, in BOOK pixels (688x384 art space).
export type BookTextBlock = {
  id: string;
  role: BookTextRole;
  x: number;
  y: number;
  width: number;
  align?: "left" | "center";
  content: RichText;
};
