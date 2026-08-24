"use client";

import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { track } from "@/lib/track";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   Enlace a WhatsApp con registro de analítica.

   Existe como archivo aparte por una razón concreta: el pie es un componente
   de SERVIDOR, y `track()` solo puede correr en el navegador. En vez de pasar
   el pie entero a "use client" por un solo clic, se aísla aquí lo único que
   necesita JavaScript. El resto del pie —logo, enlaces, textos— sigue
   viajando como HTML sin hidratar nada.

   El destino y el texto prellenado salen de `site.contacto`: es el mismo
   enlace que ofrece la sección de contacto, y tenerlo escrito dos veces
   garantizaba que un día dejaran de coincidir.
--------------------------------------------------------------------------- */

type Props = {
  /** De dónde salió el clic. Es lo único que se registra. */
  ubicacion: string;
  /** Sustituye al `aria-label` por defecto, que ya avisa de la ventana nueva. */
  aria: string;
  children: ReactNode;
  className?: string;
};

export function EnlaceWhatsApp({ ubicacion, aria, children, className }: Props) {
  return (
    <a
      href={site.contacto.directo.whatsapp.href}
      target="_blank"
      /* `noopener` corta el acceso de la pestaña nueva a `window.opener`;
         `noreferrer` evita además filtrar de dónde viene. */
      rel="noopener noreferrer"
      aria-label={aria}
      onClick={() => track("whatsapp_click", { ubicacion })}
      className={cn(
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yi-verde",
        className,
      )}
    >
      {children}
    </a>
  );
}

export default EnlaceWhatsApp;
