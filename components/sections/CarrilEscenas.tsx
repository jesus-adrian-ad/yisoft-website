"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMediaQuery, usePrefiereMenosMovimiento } from "@/lib/hooks/useMediaQuery";

/**
 * <ol> de las escenas de "El problema" con marcado de la escena central.
 *
 * Es cliente, pero recibe las escenas ya renderizadas como `children` desde el
 * componente de servidor: el texto viaja completo en el HTML y aquí solo se
 * añade el comportamiento.
 *
 * Lo único que hace este componente es poner `data-activa` en un <li>. Los
 * colores viven en `.yi-escena` (globals.css), así que el carril ya se ve
 * terminado antes de hidratar y sin JS. Es decoración pura: NO se escribe
 * `aria-current` ni ningún atributo que un lector de pantalla anuncie.
 */
export function CarrilEscenas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);

  // Mismo umbral que el layout de dos columnas: por debajo no hay sticky, así
  // que tampoco hay "escena central" que marcar.
  const dosColumnas = useMediaQuery("(min-width: 900px)");
  const menosMovimiento = usePrefiereMenosMovimiento();
  const marcar = dosColumnas && !menosMovimiento;

  useEffect(() => {
    const ol = ref.current;
    if (!ol) return;

    const escenas = Array.from(ol.querySelectorAll<HTMLLIElement>(":scope > li"));
    const limpiar = () => {
      for (const li of escenas) delete li.dataset.activa;
    };

    if (!marcar) {
      limpiar();
      return;
    }

    // Banda del 20% central de la ventana. Recortar 40% arriba y 40% abajo es
    // lo que evita que se marque la escena que apenas asoma por el borde.
    const dentro = new Set<Element>();

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) dentro.add(entrada.target);
          else dentro.delete(entrada.target);
        }

        // Una sola activa: si dos caben en la banda gana la primera en orden
        // de documento, que es la que el ojo lee como "la de arriba".
        const elegida = escenas.find((li) => dentro.has(li));
        for (const li of escenas) {
          if (li === elegida) li.dataset.activa = "true";
          else delete li.dataset.activa;
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    for (const li of escenas) observador.observe(li);

    return () => {
      observador.disconnect();
      limpiar();
    };
  }, [marcar]);

  return (
    <ol ref={ref} className={className}>
      {children}
    </ol>
  );
}

export default CarrilEscenas;
