"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Instancia compartida de Lenis. Es `null` cuando el usuario pide movimiento
 * reducido: los consumidores deben tener camino alternativo (scroll nativo).
 */
const LenisContext = createContext<Lenis | null>(null);

export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

/**
 * Inicializa Lenis para el scroll suave del documento.
 *
 * - Si el usuario pide movimiento reducido, Lenis NO se inicializa
 *   (y se destruye si ya estaba activo cuando cambia la preferencia).
 * - En móvil no toca el gesto táctil: `syncTouch` queda desactivado, así que
 *   el scroll táctil sigue siendo el nativo del navegador.
 * - Intercepta los enlaces ancla sueltos del documento (los del nav los
 *   maneja el propio Header, que sabe cuánto mide).
 * - Se limpia por completo en el unmount.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION);

    let instancia: Lenis | null = null;
    let rafId = 0;
    let onAnchorClick: ((e: MouseEvent) => void) | null = null;

    function start() {
      if (instancia) return;

      instancia = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        smoothWheel: true,
        // Sin sincronizar el táctil: el scroll nativo de móvil queda intacto.
        syncTouch: false,
        touchMultiplier: 1,
        autoResize: true,
      });

      const raf = (time: number) => {
        instancia?.raf(time);
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
        // El Header gestiona sus propios enlaces con el offset correcto.
        if (anchor.closest("[data-nav-propio]")) return;

        const href = anchor.getAttribute("href");
        if (!href || !href.startsWith("#") || href === "#") return;
        if (anchor.hasAttribute("download") || anchor.target === "_blank") return;

        const destino = document.querySelector(href);
        if (!destino) return;

        event.preventDefault();
        // Sin offset: Lenis ya resta el `scroll-padding-top` del <html>,
        // que es donde vive la compensación del header.
        instancia?.scrollTo(destino as HTMLElement, { duration: 1.1 });
        history.pushState(null, "", href);
        const destinoEl = destino as HTMLElement;
        if (!destinoEl.hasAttribute("tabindex")) destinoEl.setAttribute("tabindex", "-1");
        destinoEl.focus({ preventScroll: true });
      };

      document.addEventListener("click", onAnchorClick);
      setLenis(instancia);
    }

    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      if (onAnchorClick) document.removeEventListener("click", onAnchorClick);
      onAnchorClick = null;
      instancia?.destroy();
      instancia = null;
      setLenis(null);
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

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export default LenisProvider;
