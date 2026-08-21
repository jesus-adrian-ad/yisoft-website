"use client";

import { useEffect, useState } from "react";

/**
 * Media query reactiva. Devuelve `false` en el primer render (servidor y
 * cliente coinciden) y el valor real tras montar: cero errores de hidratación.
 */
export function useMediaQuery(query: string): boolean {
  const [coincide, setCoincide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setCoincide(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCoincide(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return coincide;
}

/** El usuario pidió movimiento reducido. */
export function usePrefiereMenosMovimiento(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Puntero fino con hover real: ratón o trackpad. */
export function useHoverFino(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/**
 * Animaciones "completas" permitidas: la pantalla no es chica (<768px) y el
 * usuario no pidió movimiento reducido.
 */
export function useAnimacionesCompletas(): boolean {
  const menosMovimiento = usePrefiereMenosMovimiento();
  const pantallaGrande = useMediaQuery("(min-width: 768px)");
  return !menosMovimiento && pantallaGrande;
}
