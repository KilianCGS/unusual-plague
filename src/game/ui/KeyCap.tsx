import styles from "./KeyCap.module.css";

// A keyboard key drawn as a small pixel keycap: a pale top face, a lit upper edge, a
// shaded lower edge and a dark base that gives it height. It never moves or animates
// (it sits inside running text, so it must not change the line's height).
export function KeyCap({ label }: { label: string }) {
  return (
    <kbd className={`${styles.cap}${label.length > 1 && /[A-Za-zÁÉÍÓÚÑ]/.test(label) ? ` ${styles.wide}` : ""}`} data-keycap>
      {label}
    </kbd>
  );
}
