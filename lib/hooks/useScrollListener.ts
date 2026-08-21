"use client";

import { useEffect, useRef } from "react";
import type Lenis from "lenis";

export type EstadoScroll = {
  /** Desplazamiento vertical actual en px. */
  y: number;
  /** Diferencia contra la lectura anterior (positiva = bajando). */
  delta: number;
  /** Progreso 0..1 sobre el alto desplazable del documento. */
  progreso: number;
};

/**
 * Suscribe una única fuente de verdad para el scroll.
 *
 * - Si Lenis está activo, escucha SU evento: así el header y la barra de
 *   progreso van sincronizados con la interpolación, sin desfase.
 * - Si no lo está (movimiento reducido), cae a un listener de window
 *   `passive` y limitado a un frame con requestAnimationFrame.
 *
 * El callback se guarda en un ref para no re-suscribir en cada render.
 */
export function useScrollListener(
  lenis: Lenis | null,
  callback: (estado: EstadoScroll) => void,
) {
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    let ultimaY = typeof window === "undefined" ? 0 : window.scrollY;

    const emitir = (y: number, limite: number) => {
      const delta = y - ultimaY;
      ultimaY = y;
      cbRef.current({
        y,
        delta,
        progreso: limite > 0 ? Math.min(1, Math.max(0, y / limite)) : 0,
      });
    };

    if (lenis) {
      const onScroll = () => {
        emitir(lenis.scroll, lenis.limit || 0);
      };
      lenis.on("scroll", onScroll);
      onScroll(); // estado inicial
      return () => {
        lenis.off("scroll", onScroll);
      };
    }

    let frame = 0;
    const limiteDoc = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    const onScroll = () => {
      if (frame) return; // throttle: como mucho una lectura por frame
      frame = requestAnimationFrame(() => {
        frame = 0;
        emitir(window.scrollY, limiteDoc());
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    emitir(window.scrollY, limiteDoc());

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [lenis]);
}
