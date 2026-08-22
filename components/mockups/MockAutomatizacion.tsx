import MockupIlustrativo from "@/components/ui/MockupIlustrativo";

/**
 * Los cuatro pasos del flujo. `criterio` marca el único que necesita juicio y
 * no una regla fija: es exactamente donde entra la IA, y por eso ese paso
 * lleva el ícono más saturado. La distinción es el argumento de la maqueta.
 */
const PASOS = [
  { icono: "@", texto: "Llega correo con pedido", etiqueta: "disparador", ia: false },
  { icono: "IA", texto: "Lee el documento y extrae los datos", etiqueta: "criterio", ia: true },
  { icono: "→", texto: "Crea el pedido en el sistema", etiqueta: "regla", ia: false },
  { icono: "✓", texto: "Avisa al almacén", etiqueta: "regla", ia: false },
] as const;

/**
 * Mockup 02 · Automatización.
 *
 * No es una interfaz: es un diagrama de flujo vertical. La línea que une los
 * pasos es un `flex-1` dentro de la columna del ícono, así que se estira sola
 * hasta el siguiente paso sin importar cuántas líneas ocupe el texto.
 */
export function MockAutomatizacion() {
  return (
    <MockupIlustrativo>
      <ol className="flex flex-col">
        {PASOS.map((paso, i) => {
          const ultimo = i === PASOS.length - 1;

          return (
            <li key={paso.texto} className="flex items-stretch gap-2.5">
              <div className="flex shrink-0 flex-col items-center">
                <span
                  className={[
                    "flex size-6 items-center justify-center rounded-md font-yi-mono text-mock-xs font-semibold",
                    paso.ia
                      ? "bg-yi-verde/30 text-yi-verde"
                      : "bg-white/[0.07] text-white/60",
                  ].join(" ")}
                >
                  {paso.icono}
                </span>

                {!ultimo ? (
                  <>
                    <span className="min-h-3 w-px flex-1 bg-yi-verde/45" />
                    {/* Punta de flecha con el truco del borde: cero SVG. */}
                    <span className="size-0 border-x-[3px] border-t-[4px] border-x-transparent border-t-yi-verde/60" />
                  </>
                ) : null}
              </div>

              <div className={`flex min-w-0 flex-1 items-start gap-2 ${ultimo ? "" : "pb-3"}`}>
                <span className="min-w-0 flex-1 break-words pt-0.5 text-mock-sm text-white/75">
                  {paso.texto}
                </span>
                <span className="shrink-0 pt-1 font-yi-mono text-mock-xs text-white/35">
                  {paso.etiqueta}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </MockupIlustrativo>
  );
}

export default MockAutomatizacion;
