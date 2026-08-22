import MockupIlustrativo, { PuntoEstado } from "@/components/ui/MockupIlustrativo";

/** KPIs del día. El de "Bajo mínimo" va en ámbar: es el que pide acción. */
const KPIS = [
  { etiqueta: "Entradas", valor: "36", tono: "text-white" },
  { etiqueta: "Salidas", valor: "128", tono: "text-white" },
  { etiqueta: "Bajo mínimo", valor: "4", tono: "text-amber-400" },
] as const;

/**
 * La columna de ROL es el punto de esta maqueta: enseña el control de permisos
 * sin tener que explicarlo en el párrafo de al lado.
 */
const ACTIVIDAD = [
  { quien: "Ana · alta de producto", hora: "10:24", rol: "Almacén" },
  { quien: "Luis · ajuste de precio", hora: "11:02", rol: "Admin" },
  { quien: "Mari · venta mostrador", hora: "11:47", rol: "Registrado" },
] as const;

/** Mockup 01 · Sistema de gestión. Componente de servidor, estático. */
export function MockSistema() {
  return (
    <MockupIlustrativo
      titulo="Almacén · movimientos de hoy"
      estado={
        <>
          <PuntoEstado />
          en vivo
        </>
      }
    >
      <div className="grid grid-cols-3 gap-1.5">
        {KPIS.map((k) => (
          <div key={k.etiqueta} className="min-w-0 rounded-md bg-white/[0.045] px-2 py-1.5">
            {/* El label puede partirse ("Bajo mínimo") en vez de desbordar. */}
            <span className="block break-words text-mock-xs text-white/45">{k.etiqueta}</span>
            <span
              className={`mt-0.5 block font-display text-mock-lg font-bold tabular-nums ${k.tono}`}
            >
              {k.valor}
            </span>
          </div>
        ))}
      </div>

      <ul className="mt-2.5 space-y-1.5">
        {ACTIVIDAD.map((a) => (
          <li
            key={a.quien}
            className="flex items-center gap-2 rounded-md bg-white/[0.03] px-2 py-1.5"
          >
            {/* `min-w-0` + `break-words`: si aprieta, el nombre pasa a dos
                líneas. Nunca se recorta ni empuja la fila fuera de la caja. */}
            <span className="min-w-0 flex-1 break-words text-mock-sm text-white/75">
              {a.quien}
            </span>
            <span className="shrink-0 font-yi-mono text-mock-xs tabular-nums text-white/40">
              {a.hora}
            </span>
            <span className="shrink-0 rounded border border-white/15 px-1.5 py-px text-mock-xs text-white/60">
              {a.rol}
            </span>
          </li>
        ))}
      </ul>
    </MockupIlustrativo>
  );
}

export default MockSistema;
