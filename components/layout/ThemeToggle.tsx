"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/track";
import {
  applyTheme,
  getCurrentTheme,
  hasStoredPreference,
  type Theme,
} from "@/lib/theme";

type ThemeToggleProps = {
  className?: string;
};

/**
 * Botón accesible de tema claro/oscuro.
 * Los iconos se cruzan por CSS (variante `dark:`), así que el icono correcto
 * ya está pintado en el primer frame gracias al script del <head>.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  // `null` hasta montar: así el HTML del servidor y el primer render del
  // cliente coinciden y no hay error de hidratación.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  // Si el usuario nunca eligió, seguimos al sistema en vivo.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      if (hasStoredPreference()) return;
      const next: Theme = e.matches ? "dark" : "light";
      document.documentElement.classList.toggle("dark", e.matches);
      document.documentElement.style.colorScheme = next;
      setTheme(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const isDark = theme === "dark";

  function toggle() {
    const next: Theme = getCurrentTheme() === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
    track("theme_toggle", { theme: next });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        theme === null
          ? "Cambiar tema"
          : isDark
            ? "Activar modo claro"
            : "Activar modo oscuro"
      }
      aria-pressed={theme === null ? undefined : isDark}
      title="Cambiar tema"
      className={cn(
        "relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-boton",
        "border-2 border-yi-azul/15 text-yi-azul transition-colors duration-200",
        "hover:border-yi-verde hover:text-yi-verde",
        "dark:border-white/20 dark:text-yi-oscuro-texto dark:hover:border-yi-verde dark:hover:text-yi-verde",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yi-verde",
        className,
      )}
    >
      {/* Sol: visible en claro */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="absolute h-5 w-5 rotate-0 scale-100 opacity-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 dark:opacity-0"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>

      {/* Luna: visible en oscuro */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute h-5 w-5 rotate-90 scale-0 opacity-0 transition-all duration-300 dark:rotate-0 dark:scale-100 dark:opacity-100"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
      </svg>
    </button>
  );
}

export default ThemeToggle;
