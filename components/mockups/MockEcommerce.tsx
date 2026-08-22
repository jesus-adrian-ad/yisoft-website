import MockupIlustrativo from "@/components/ui/MockupIlustrativo";

/** Anchos distintos por tarjeta para que el catálogo no se lea como una rejilla muerta. */
const PRODUCTOS = [
  { titulo: "78%", precio: "46%" },
  { titulo: "64%", precio: "54%" },
  { titulo: "82%", precio: "40%" },
] as const;

/** Mockup 05 · Tiendas y ecommerce. */
export function MockEcommerce() {
  return (
    <MockupIlustrativo titulo="Tienda · pedidos" estado={<span>3 hoy</span>}>
      {/* Catálogo: imagen simulada con gradiente y dos barras de texto */}
      <div className="grid grid-cols-3 gap-1.5">
        {PRODUCTOS.map((p, i) => (
          <div key={i} className="min-w-0 rounded-md bg-white/[0.04] p-1.5">
            <span className="block h-9 rounded bg-gradient-to-br from-yi-verde/55 to-yi-azul/70" />
            <span
              className="mt-1.5 block h-1.5 rounded-full bg-white/25"
              style={{ width: p.titulo }}
            />
            {/* La segunda barra, más corta y en verde: es el precio. */}
            <span
              className="mt-1 block h-1.5 rounded-full bg-yi-verde/70"
              style={{ width: p.precio }}
            />
          </div>
        ))}
      </div>

      {/* Carrito. `flex-wrap`: a 288px el botón baja de línea en vez de apretar. */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-md bg-white/[0.05] px-2 py-2">
        <span className="min-w-0 flex-1 break-words text-mock-sm text-white/75">
          Carrito · 2 artículos
        </span>
        <span className="shrink-0 font-display text-mock-md font-bold tabular-nums text-white">
          $1 240
        </span>
        <span className="shrink-0 rounded bg-yi-verde px-2.5 py-1 text-mock-xs font-semibold text-yi-carbon">
          Pagar
        </span>
      </div>

      {/* Esta línea es lo que lo separa de una tienda de plantilla. */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="min-w-0 flex-1 break-words text-mock-xs text-white/50">
          Descuenta del inventario al confirmar
        </span>
        <span className="shrink-0 rounded-full border border-yi-verde/40 px-2 py-0.5 text-mock-xs text-yi-verde">
          Sincronizado
        </span>
      </div>
    </MockupIlustrativo>
  );
}

export default MockEcommerce;
