"use client";

import { useEffect, useState } from "react";

/**
 * Marca como activa la sección que ocupa la franja central del viewport.
 * Usa IntersectionObserver: cero cálculos de offset por evento de scroll.
 */
export function useScrollSpy(ids: readonly string[]): string | null {
  const [activo, setActivo] = useState<string | null>(null);

  useEffect(() => {
    const elementos = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elementos.length === 0) return;

    // Qué secciones cruzan la banda central, en orden de documento.
    const visibles = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibles.add(entry.target.id);
          else visibles.delete(entry.target.id);
        }
        const primera = ids.find((id) => visibles.has(id)) ?? null;
        setActivo(primera);
      },
      // Banda central del viewport (del 40% al 60% de la altura): la sección
      // se marca solo cuando de verdad ocupa el centro de la pantalla.
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activo;
}
