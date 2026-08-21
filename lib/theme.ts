export const THEME_STORAGE_KEY = "yisoft-theme";

export type Theme = "light" | "dark";

/** Lee el tema efectivo del DOM (la clase la pone el script del <head>). */
export function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Aplica el tema al <html> y lo persiste. */
export function applyTheme(theme: Theme): void {
  const el = document.documentElement;
  el.classList.toggle("dark", theme === "dark");
  el.style.colorScheme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Modo privado o almacenamiento bloqueado: el tema sigue aplicado en memoria.
  }
}

/** ¿El usuario ya eligió tema explícitamente? */
export function hasStoredPreference(): boolean {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "light" || v === "dark";
  } catch {
    return false;
  }
}
