"use client";

import { useEffect } from "react";
import Lenis from "lenis";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Inicializa Lenis para el scroll suave del documento.
 *
 * - Si el usuario pide movimiento reducido, Lenis NO se inicializa
 *   (y se destruye si ya estaba activo cuando cambia la preferencia).
 * - En móvil no toca el gesto táctil: `syncTouch` queda desactivado, así que
 *   el scroll táctil sigue siendo el nativo del navegador.
 * - Intercepta los enlaces ancla del nav (#inicio, #problema, ...) para que
 *   el salto sea suave y actualiza el hash sin recargar.
 * - Se limpia por completo en el unmount.
 */
export function LenisProvider() {
  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION);

    let lenis: Lenis | null = null;
    let rafId = 0;
    let onAnchorClick: ((e: MouseEvent) => void) | null = null;

    function start() {
      if (lenis) return;

      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        // Sin sincronizar el táctil: el scroll nativo de móvil queda intacto.
        syncTouch: false,
        touchMultiplier: 1,
        autoResize: true,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      onAnchorClick = (event: MouseEvent) => {
        if (event.defaultPrevented) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        const target = event.target as HTMLElement | null;
        const anchor = target?.closest?.("a");
        if (!anchor) return;

        const href = anchor.getAttribute("href");
        if (!href || !href.startsWith("#") || href === "#") return;
        if (anchor.hasAttribute("download") || anchor.target === "_blank") return;

        const destino = document.querySelector(href);
        if (!destino) return;

        event.preventDefault();
        lenis?.scrollTo(destino as HTMLElement, {
          offset: -80, // deja aire para un header fijo
          duration: 1.1,
        });
        history.pushState(null, "", href);
        // El foco debe seguir al scroll para no romper la navegación por teclado.
        const destinoEl = destino as HTMLElement;
        if (!destinoEl.hasAttribute("tabindex")) destinoEl.setAttribute("tabindex", "-1");
        destinoEl.focus({ preventScroll: true });
      };

      document.addEventListener("click", onAnchorClick);
    }

    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      if (onAnchorClick) document.removeEventListener("click", onAnchorClick);
      onAnchorClick = null;
      lenis?.destroy();
      lenis = null;
    }

    if (!mq.matches) start();

    const onPreferenceChange = (e: MediaQueryListEvent) => {
      if (e.matches) stop();
      else start();
    };
    mq.addEventListener("change", onPreferenceChange);

    return () => {
      mq.removeEventListener("change", onPreferenceChange);
      stop();
    };
  }, []);

  return null;
}

export default LenisProvider;
