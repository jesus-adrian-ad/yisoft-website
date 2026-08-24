"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/track";

/* ---------------------------------------------------------------------------
   Enlace de correo que además copia la dirección.

   POR QUÉ NO ES UN BOTÓN:
   Es un <a href="mailto:"> de verdad. En escritorio, mucha gente no tiene
   cliente de correo configurado y un `mailto:` puro no hace absolutamente
   nada: se quedan mirando la pantalla sin saber que el clic sí funcionó. Al
   copiar SIEMPRE, aunque el `mailto:` no abra nada, en el portapapeles quedó
   algo que sirve.

   Y al revés: si el JavaScript falla o no ha hidratado todavía, el enlace
   sigue siendo un enlace. Por eso no se llama a `preventDefault()` en ningún
   caso — el comportamiento nativo es el suelo sobre el que se construye, no
   algo que haya que reemplazar.
--------------------------------------------------------------------------- */

const MS_AVISO = 2000;

type Props = {
  correo: string;
  /** Para la analítica. Nunca se registra la dirección, solo dónde se hizo clic. */
  ubicacion: string;
  /**
   * `auto` sigue el tema de la página, que es lo normal.
   *
   * `oscuro` fija los colores de superficie oscura pase lo que pase. Lo usa el
   * pie, que va sobre carbón en los DOS temas: ahí el azul del tema claro
   * quedaría en 1.4:1 contra el fondo, es decir, ilegible.
   */
  tono?: "auto" | "oscuro";
  className?: string;
};

/* El color del enlace, por tono. Se declara fuera para que las dos variantes
   se lean juntas y no haya forma de cambiar una y olvidar la otra. */
const TONOS = {
  auto:
    "text-yi-azul hover-fino:text-yi-verde active:text-yi-verde " +
    "dark:text-yi-oscuro-titulo dark:hover-fino:text-yi-verde",
  oscuro:
    "text-yi-oscuro-titulo hover-fino:text-yi-verde active:text-yi-verde",
} as const;

export function CorreoCopiable({
  correo,
  ubicacion,
  tono = "auto",
  className,
}: Props) {
  const [copiado, setCopiado] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Si el componente se desmonta con el aviso puesto, el setState del
     temporizador caería sobre un componente muerto. */
  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);

  async function alHacerClic() {
    track("correo_click", { ubicacion });

    /* `navigator.clipboard` no existe fuera de contextos seguros (http://, un
       WebView viejo) y puede rechazar aunque exista. Nada de esto debe romper
       el enlace: si falla, el `mailto:` sigue su camino y no se muestra un
       aviso que mentiría. */
    try {
      await navigator.clipboard.writeText(correo);
      setCopiado(true);
      if (temporizador.current) clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => setCopiado(false), MS_AVISO);
    } catch {
      // Silencio a propósito: el clic ya hizo lo que podía hacer.
    }
  }

  return (
    /* `inline-flex` con `flex-wrap`: a 320px la dirección es más ancha que la
       columna, así que el aviso baja a su propio renglón en vez de empujar. */
    <span className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-1", className)}>
      <a
        href={`mailto:${correo}`}
        onClick={alHacerClic}
        /* `break-all` y no `break-words`: la dirección es una sola palabra de
           35 caracteres y sin esto desborda el contenedor a 320px. */
        className={cn(
          // `py-2.5` no es decorativo: sube el área tocable del enlace por
          // encima de los 44px sin tocar el tamaño de letra.
          "break-all py-2.5 font-sans text-body font-semibold underline decoration-yi-verde",
          "decoration-2 underline-offset-4 transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yi-verde",
          TONOS[tono],
        )}
      >
        {correo}
      </a>

      {/* La región viva está SIEMPRE en el DOM y solo cambia su contenido: si
          el nodo entero apareciera de golpe, muchos lectores de pantalla no
          lo anunciarían. `aria-live="polite"` espera a que la persona termine
          lo que está diciendo el lector antes de intercalar el aviso. */}
      <span
        aria-live="polite"
        className={cn(
          "font-sans text-small font-semibold text-yi-verde transition-opacity duration-200",
          copiado ? "opacity-100" : "opacity-0",
        )}
      >
        {copiado ? "Correo copiado" : ""}
      </span>
    </span>
  );
}

export default CorreoCopiable;
