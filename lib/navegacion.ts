import type Lenis from "lenis";

type OpcionesIr = {
  lenis: Lenis | null;
  /** Si el usuario pidió movimiento reducido, se salta sin animación. */
  menosMovimiento: boolean;
};

/**
 * Navega a un ancla del nav compensando la altura del header.
 *
 * La compensación NO se calcula aquí: vive en `scroll-padding-top` del <html>
 * (`--header-h` + safe-area). Lenis resta ese scroll-padding por su cuenta
 * cuando el destino es un elemento, y `scrollIntoView` lo respeta de forma
 * nativa. Sumar además un offset propio compensaba dos veces y dejaba la
 * sección demasiado abajo.
 *
 * En ambos caminos el foco se mueve al destino para no romper el teclado.
 */
export function irASeccion(href: string, { lenis, menosMovimiento }: OpcionesIr): void {
  const destino = document.querySelector<HTMLElement>(href);
  if (!destino) return;

  if (lenis && !menosMovimiento) {
    lenis.scrollTo(destino, { duration: 1.1 });
  } else {
    destino.scrollIntoView({ behavior: "auto", block: "start" });
  }

  history.pushState(null, "", href);
  if (!destino.hasAttribute("tabindex")) destino.setAttribute("tabindex", "-1");
  destino.focus({ preventScroll: true });
}
