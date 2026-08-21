"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

type HamburgerProps = {
  abierto: boolean;
  onClick: () => void;
  /** id del overlay que controla, para aria-controls. */
  controla: string;
  className?: string;
};

/**
 * Botón hamburguesa. Las tres líneas se transforman en X animándose ellas
 * mismas (rotación + desvanecido de la central), sin cambiar de icono.
 */
export const Hamburger = forwardRef<HTMLButtonElement, HamburgerProps>(
  function Hamburger({ abierto, onClick, controla, className }, ref) {
    const linea =
      "absolute left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-current " +
      // `translate` y `rotate` son propiedades propias en Tailwind v4: si no
      // se nombran, las líneas saltarían a la X sin animación.
      "transition-[translate,rotate,opacity] duration-300 ease-out";

    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-expanded={abierto}
        aria-controls={controla}
        aria-label={abierto ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
        className={cn(
          "area-tactil relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-boton",
          "text-yi-azul transition-colors duration-200 dark:text-yi-oscuro-texto",
          "hover-fino:text-yi-verde dark:hover-fino:text-yi-verde",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yi-verde",
          className,
        )}
      >
        <span aria-hidden="true" className="relative block h-4 w-6">
          <span className={cn(linea, "top-0", abierto && "translate-y-[7px] rotate-45")} />
          <span className={cn(linea, "top-1/2 -translate-y-1/2", abierto && "opacity-0")} />
          <span className={cn(linea, "bottom-0", abierto && "-translate-y-[7px] -rotate-45")} />
        </span>
      </button>
    );
  },
);

export default Hamburger;
