import MockupIlustrativo, { PuntoEstado } from "@/components/ui/MockupIlustrativo";

/**
 * El JSON va troceado en fichas en vez de como una sola cadena: a 288px una
 * línea de 68 caracteres en monoespaciada no cabe, y partirla por la mitad de
 * una clave se lee como un error. Así envuelve por pares clave-valor, que es
 * donde un ojo la partiría de todos modos.
 */
const JSON_FICHAS = [
  { clave: '"venta"', valor: "4821," },
  { clave: '"sku"', valor: '"K2-BLK",' },
  { clave: '"cantidad"', valor: "2," },
  { clave: '"estado"', valor: '"aplicado"' },
] as const;

/** Mockup 04 · Integraciones y APIs. */
export function MockIntegraciones() {
  return (
    <MockupIlustrativo
      titulo="Integración · punto de venta ↔ inventario"
      estado={
        <>
          <PuntoEstado />
          ok
        </>
      }
    >
      {/* Dos cajas y la flecha. Las cajas son `flex-1 min-w-0`, así que se
          encogen juntas y la flecha nunca se sale. */}
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 break-words rounded-md border border-white/15 bg-white/[0.04] px-2 py-2 text-center text-mock-sm text-white/75">
          Punto de venta
        </span>
        <span aria-hidden className="shrink-0 text-mock-md text-yi-verde">
          →
        </span>
        <span className="min-w-0 flex-1 break-words rounded-md border border-white/15 bg-white/[0.04] px-2 py-2 text-center text-mock-sm text-white/75">
          Inventario YiSoft
        </span>
      </div>

      <div className="mt-2.5 rounded-md bg-black/40 px-2 py-2 font-yi-mono text-mock-xs">
        <span className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-white/40">{"{"}</span>
          {JSON_FICHAS.map((f) => (
            // Cada par no se parte por dentro; el salto ocurre entre pares.
            <span key={f.clave} className="whitespace-nowrap">
              <span className="text-yi-verde">{f.clave}</span>
              <span className="text-white/40">: </span>
              <span className="text-white/70">{f.valor}</span>
            </span>
          ))}
          <span className="text-white/40">{"}"}</span>
        </span>
      </div>

      {/* El chip de reintento es lo que aterriza "nada se pierde en silencio". */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        <span className="rounded-full border border-white/15 px-2 py-0.5 text-mock-xs text-white/60">
          Reintento automático
        </span>
        <span className="rounded-full border border-amber-400/40 px-2 py-0.5 text-mock-xs text-amber-400">
          1 en cola
        </span>
      </div>
    </MockupIlustrativo>
  );
}

export default MockIntegraciones;
