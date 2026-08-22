import { track as vercelTrack } from "@vercel/analytics";

/**
 * Eventos que la landing puede disparar. Centralizados para evitar
 * strings sueltos repartidos por las secciones.
 */
export type TrackEvent =
  | "cta_click"
  | "form_submit"
  | "form_error"
  | "whatsapp_click"
  /* El nombre va en español como el resto de la base de código. `email_click`
     se conserva porque cambiarlo partiría en dos la serie histórica de
     Analytics, pero lo nuevo usa `correo_click`. */
  | "correo_click"
  | "email_click"
  | "section_view"
  | "theme_toggle";

type Properties = Record<string, string | number | boolean | null>;

/**
 * Envoltura sobre track() de Vercel Analytics.
 * - No hace nada fuera del navegador (evita romper el prerender de SSG).
 * - Nunca lanza: la analítica jamás debe tumbar la UI.
 */
export function track(event: TrackEvent, properties?: Properties): void {
  if (typeof window === "undefined") return;

  try {
    vercelTrack(event, properties);
  } catch {
    // Silencioso a propósito: bloqueadores de anuncios o red caída.
  }
}

/** Atajo para el evento más común: clic en un CTA. */
export function trackCta(label: string, location?: string): void {
  track("cta_click", { label, ...(location ? { location } : {}) });
}
