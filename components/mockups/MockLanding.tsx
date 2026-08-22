import MockupIlustrativo from "@/components/ui/MockupIlustrativo";

/**
 * Mockup 03 · Landing page.
 *
 * Esqueleto de bloques arriba y, separado por una línea, un resultado de
 * búsqueda simulado. Ese remate es el argumento entero del servicio: lo que
 * se vende no es tener página, es aparecer cuando te buscan.
 */
export function MockLanding() {
  return (
    <MockupIlustrativo>
      <div className="rounded-lg bg-white/[0.04] p-2.5">
        {/* Barra superior: logo, tres enlaces y un botón */}
        <div className="flex items-center gap-2">
          <span className="size-2.5 shrink-0 rounded-sm bg-yi-verde/70" />
          <span className="flex min-w-0 flex-1 items-center gap-1.5">
            <span className="h-1 w-6 rounded-full bg-white/20" />
            <span className="h-1 w-5 rounded-full bg-white/20" />
            <span className="h-1 w-7 rounded-full bg-white/20" />
          </span>
          <span className="h-3 w-9 shrink-0 rounded-sm bg-yi-verde/80" />
        </div>

        {/* Hero: tres barras de anchos decrecientes */}
        <div className="mt-3 space-y-1.5">
          <span className="block h-2 w-[82%] rounded-full bg-white/30" />
          <span className="block h-2 w-[64%] rounded-full bg-white/20" />
          <span className="block h-2 w-[44%] rounded-full bg-white/15" />
        </div>

        {/* Dos botones: uno sólido, uno con borde */}
        <div className="mt-3 flex gap-2">
          <span className="h-4 w-14 rounded bg-yi-verde/80" />
          <span className="h-4 w-14 rounded border border-white/25" />
        </div>

        {/* Tres tarjetas vacías */}
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <span className="h-7 rounded bg-white/[0.06]" />
          <span className="h-7 rounded bg-white/[0.06]" />
          <span className="h-7 rounded bg-white/[0.06]" />
        </div>
      </div>

      {/* El remate: cómo se ve en Google */}
      <div className="mt-3 border-t border-white/10 pt-2.5">
        <span className="block break-words font-yi-mono text-mock-sm text-yi-verde">
          tu-negocio.com
        </span>
        <span className="mt-1.5 block h-1.5 w-[88%] rounded-full bg-white/20" />
        <span className="mt-1 block h-1.5 w-[70%] rounded-full bg-white/15" />
      </div>
    </MockupIlustrativo>
  );
}

export default MockLanding;
