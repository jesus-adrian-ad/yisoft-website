"use client";

import { useState, type ReactNode } from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/cn";
import { useMediaQuery, usePrefiereMenosMovimiento } from "@/lib/hooks/useMediaQuery";

/**
 * Revelado al entrar en el viewport. Es LA técnica de la página de aquí en
 * adelante: las secciones nuevas consumen estos dos componentes en vez de
 * reimplementar la animación.
 *
 *   <RevelarGrupo>                     ← dispara cuando el 25% está a la vista
 *     <RevelarAlScroll delay={0}>…     ← cada pieza, con su retraso
 *     <RevelarAlScroll delay={0.42}>…
 *   </RevelarGrupo>
 *
 * El disparo vive en el grupo y no en cada pieza a propósito: si cada bloque
 * observara su propia entrada, el escalonado se rompería —los de abajo
 * entrarían al viewport mucho después— y el umbral del 25% sería de cada
 * elemento, no de la sección. Motion propaga la etiqueta de variante por
 * contexto, así que los divs de layout intermedios no estorban.
 */

const SALIDA = [0.22, 1, 0.36, 1] as const;

/** Qué técnica toca, según ancho y preferencias de movimiento. */
type Estrategia = "desenfoque" | "simple" | "ninguna";

function useEstrategia(): Estrategia {
  const menosMovimiento = usePrefiereMenosMovimiento();
  // `filter: blur()` no se acelera por GPU en todas partes y tironea en
  // Android de gama media, así que solo se usa de 1024px hacia arriba.
  const escritorio = useMediaQuery("(min-width: 1024px)");

  if (menosMovimiento) return "ninguna";
  return escritorio ? "desenfoque" : "simple";
}

/* -------------------------------------------------------------------------
   Grupo: dueño del disparo
------------------------------------------------------------------------- */

export function RevelarGrupo({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="oculto"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------
   Pieza revelada
------------------------------------------------------------------------- */

type Variante = "principal" | "suave";

type RevelarProps = {
  children: ReactNode;
  /** Retraso en segundos dentro del escalonado del grupo. */
  delay?: number;
  /**
   * `principal` es el tratamiento del título: más desenfoque y un escalado
   * mínimo. Sin ese escalado el desenfoque se lee como un fallo de render en
   * vez de como una cámara enfocando.
   */
  variante?: Variante;
  /**
   * Color final del borde, para bloques con borde de acento. Se anima como
   * color —no como opacidad del bloque— y entra 0.1s después del contenido.
   */
  borde?: string;
  className?: string;
};

function construirVariantes(
  estrategia: Estrategia,
  variante: Variante,
  delay: number,
  borde?: string,
): Variants {
  const principal = variante === "principal";

  // Movimiento reducido: aparece y ya. Ni desenfoque ni desplazamiento.
  if (estrategia === "ninguna") {
    return {
      oculto: { opacity: 0, ...(borde ? { borderColor: "rgba(0,0,0,0)" } : {}) },
      visible: {
        opacity: 1,
        ...(borde ? { borderColor: borde } : {}),
        transition: { duration: 0.2 },
      },
    };
  }

  if (estrategia === "desenfoque") {
    return {
      oculto: {
        opacity: 0,
        filter: `blur(${principal ? 14 : 6}px)`,
        scale: principal ? 1.015 : 1,
        ...(borde ? { borderColor: "rgba(0,0,0,0)" } : {}),
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        ...(borde ? { borderColor: borde } : {}),
        transition: {
          duration: principal ? 0.9 : 0.8,
          delay,
          ease: SALIDA,
          ...(borde ? { borderColor: { duration: 0.5, delay: delay + 0.1 } } : {}),
        },
      },
    };
  }

  // Por debajo de 1024px: mismo escalonado, cero desenfoque.
  // El título se revela con máscara; el resto sube 12px con fundido.
  if (principal) {
    return {
      oculto: { y: "100%" },
      visible: { y: 0, transition: { duration: 0.8, delay, ease: SALIDA } },
    };
  }

  return {
    oculto: { opacity: 0, y: 12, ...(borde ? { borderColor: "rgba(0,0,0,0)" } : {}) },
    visible: {
      opacity: 1,
      y: 0,
      ...(borde ? { borderColor: borde } : {}),
      transition: {
        duration: 0.7,
        delay,
        ease: SALIDA,
        ...(borde ? { borderColor: { duration: 0.5, delay: delay + 0.1 } } : {}),
      },
    },
  };
}

export function RevelarAlScroll({
  children,
  delay = 0,
  variante = "suave",
  borde,
  className,
}: RevelarProps) {
  const estrategia = useEstrategia();

  // `will-change` solo mientras dura la animación. Dejarlo fijo mantiene viva
  // una capa de composición por elemento y se nota en la memoria de un móvil.
  const [animando, setAnimando] = useState(false);
  const willChange =
    animando
      ? estrategia === "desenfoque"
        ? "filter, opacity, transform"
        : "opacity, transform"
      : undefined;

  const variants = construirVariantes(estrategia, variante, delay, borde);

  const comun = {
    variants,
    onAnimationStart: () => setAnimando(true),
    onAnimationComplete: () => setAnimando(false),
    style: { willChange },
  };

  // En móvil el título se revela deslizándose dentro de una ventana recortada,
  // igual que el h1 del hero. `.yi-mascara` compensa el recorte para que la
  // ventana no decapite los descendentes.
  if (estrategia === "simple" && variante === "principal") {
    return (
      <div className={cn("yi-mascara", className)}>
        <motion.div {...comun}>{children}</motion.div>
      </div>
    );
  }

  return (
    <motion.div {...comun} className={className}>
      {children}
    </motion.div>
  );
}

export default RevelarAlScroll;
