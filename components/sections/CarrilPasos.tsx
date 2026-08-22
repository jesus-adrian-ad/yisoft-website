"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMediaQuery, usePrefiereMenosMovimiento } from "@/lib/hooks/useMediaQuery";

/**
 * <ol> de los pasos de "Proceso" con marcado del paso central.
 *
 * Es cliente, pero recibe los pasos ya renderizados como `children` desde el
 * componente de servidor: los cinco pasos viajan completos en el HTML y aquí
 * solo se añade el comportamiento.
 *
 * Lo único que hace este componente es poner `data-activa` en un <li>. El
 * punto, la línea y sus colores viven en `.yi-paso` (globals.css), así que el
 * carril ya se ve terminado antes de hidratar y sin JS. Es decoración pura:
 * NO se escribe `aria-current` ni ningún atributo que un lector de pantalla
 * anuncie — el <ol> ya comunica el orden, que es la información real.
 */
export function CarrilPasos({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLOListElement>(null);

  // Mismo umbral que la media query de `.yi-paso` en globals.css: por debajo
  // de 768px todos los puntos van rellenos y no hay nada que seguir.
  const pantallaGrande = useMediaQuery("(min-width: 768px)");
  const menosMovimiento = usePrefiereMenosMovimiento();
  const marcar = pantallaGrande && !menosMovimiento;

  useEffect(() => {
    const ol = ref.current;
    if (!ol) return;

    const pasos = Array.from(ol.querySelectorAll<HTMLLIElement>(":scope > li"));
    const limpiar = () => {
      for (const li of pasos) delete li.dataset.activa;
    };

    if (!marcar) {
      limpiar();
      return;
    }

    // Banda central de la ventana: recortar 45% arriba y 45% abajo deja un
    // 10% justo en el medio. Es la franja donde el ojo está leyendo, y es
    // angosta a propósito para que solo un paso la ocupe a la vez.
    const dentro = new Set<Element>();

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) dentro.add(entrada.target);
          else dentro.delete(entrada.target);
        }

        // Uno solo activo: si dos caben en la banda gana el primero en orden
        // de documento, que es el que el ojo lee como "el de arriba".
        const elegido = pasos.find((li) => dentro.has(li));

        // Lección ya aprendida en "El problema": si la banda queda vacía NO se
        // apaga nada, se conserva el último marcado. Limpiar aquí dejaba el
        // carril entero apagado al pasar del paso 05 —se leía como si algo se
        // hubiera roto— y, entrando a la sección desde abajo, tampoco marcaba
        // el 05, que es el correcto. El estado solo cambia cuando un paso
        // ENTRA en la banda.
        if (!elegido) return;

        for (const li of pasos) {
          if (li === elegido) li.dataset.activa = "true";
          else delete li.dataset.activa;
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    for (const li of pasos) observador.observe(li);

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

export default CarrilPasos;
