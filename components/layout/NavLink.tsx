"use client";

import type { MouseEvent } from "react";
import { cn } from "@/lib/cn";

type NavLinkProps = {
  href: string;
  label: string;
  activo: boolean;
  onNavegar: (href: string) => void;
  className?: string;
};

/**
 * Enlace del nav de escritorio con subrayado que crece desde el centro.
 * El subrayado solo reacciona al hover con puntero fino; el estado activo
 * (scroll-spy) lo deja al 100% en cualquier dispositivo.
 */
export function NavLink({ href, label, activo, onNavegar, className }: NavLinkProps) {
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    onNavegar(href);
  }

  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={activo ? "true" : undefined}
      className={cn(
        "group relative inline-flex items-center rounded-sm px-3 py-2 font-semibold",
        "text-body transition-colors duration-200 4xl:text-lead",
        activo
          ? "text-yi-verde"
          : "text-yi-tinta hover-fino:text-yi-verde dark:text-yi-oscuro-texto dark:hover-fino:text-yi-verde",
        className,
      )}
    >
      {label}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-3 bottom-0 h-0.5 origin-center rounded-full bg-yi-verde",
          "transition-transform duration-300 ease-out",
          // Activo: subrayado permanente. Si no, crece desde el centro al
          // pasar el cursor, y solo donde hay hover real.
          activo ? "scale-x-100" : "scale-x-0 hover-fino:group-hover:scale-x-100",
        )}
      />
    </a>
  );
}

export default NavLink;
