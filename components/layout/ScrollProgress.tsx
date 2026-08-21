"use client";

import { useRef } from "react";
import { useLenis } from "@/components/layout/LenisProvider";
import { useScrollListener } from "@/lib/hooks/useScrollListener";
import { usePrefiereMenosMovimiento } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

/**
 * Barra de progreso de lectura.
 *
 * Vive FUERA del header a propósito: el header se oculta al bajar y la barra
 * debe seguir visible, así que es un elemento fijo propio con z-index por
 * encima. Se anima con `scaleX` (compuesto en GPU), nunca con `width`, que
 * forzaría reflow en cada frame.
 */
export function ScrollProgress() {
  const lenis = useLenis();
  const barraRef = useRef<HTMLDivElement>(null);
  const menosMovimiento = usePrefiereMenosMovimiento();

  // Se escribe directo al DOM: la barra no debe provocar renders de React.
  useScrollListener(lenis, ({ progreso }) => {
    const el = barraRef.current;
    if (!el) return;
    el.style.transform = `scaleX(${progreso})`;
    el.style.opacity = progreso <= 0.001 ? "0" : "1";
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      <div
        ref={barraRef}
        className={cn(
          "h-full w-full origin-left bg-yi-verde will-change-transform",
          // Con movimiento reducido la barra sigue funcionando, pero sin
          // suavizado: salta al valor exacto.
          menosMovimiento
            ? "opacity-0"
            : "opacity-0 transition-opacity duration-200 ease-out",
        )}
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

export default ScrollProgress;
