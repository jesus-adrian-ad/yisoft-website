import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MockupProps = {
  /** El dibujo. Va marcado como decorativo: no aporta nada a un lector. */
  children: ReactNode;
  /** Título de la barra superior. Si falta, no se pinta la barra. */
  titulo?: string;
  /** Contenido a la derecha de la barra: un estado, un contador. */
  estado?: ReactNode;
  className?: string;
};

/**
 * Marco compartido de los cinco mockups de "Servicios".
 *
 * Fondo carbón en los DOS temas a propósito: son piezas de contraste contra el
 * papel de la sección, no superficies que sigan al tema. En oscuro dejan de
 * destacar por color y pasan a hacerlo por el borde y la sombra.
 *
 * Todo es HTML y CSS: ni una imagen, ni un SVG externo, ni una captura. Eso
 * mantiene la sección en cero peticiones y hace que las maquetas escalen con
 * la tipografía en vez de pixelarse.
 *
 * El contenido gráfico va en un contenedor `aria-hidden`: para un lector de
 * pantalla no dice nada que el h3 y el párrafo no digan mejor. La etiqueta
 * "Ejemplo ilustrativo" queda FUERA de ese contenedor y sí se anuncia — es
 * una advertencia sobre la veracidad de lo que se ve, no decoración.
 */
export function MockupIlustrativo({ children, titulo, estado, className }: MockupProps) {
  return (
    <div
      className={cn(
        // `min-h` reserva la caja desde el primer pintado: cero layout shift
        // aunque el contenido interno termine midiendo un poco menos.
        "relative flex min-h-[200px] flex-col rounded-xl border border-white/10 bg-yi-carbon p-[0.9rem]",
        "shadow-[0_18px_44px_-20px_rgba(0,0,0,0.65)]",
        className,
      )}
    >
      <div aria-hidden="true" className="flex min-w-0 flex-1 flex-col">
        {titulo ? (
          <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-white/10 pb-2">
            <span className="min-w-0 break-words text-mock-sm text-white/60">{titulo}</span>
            {estado ? (
              <span className="flex shrink-0 items-center gap-1.5 text-mock-xs text-white/50">
                {estado}
              </span>
            ) : null}
          </div>
        ) : null}

        <div className="min-w-0 flex-1">{children}</div>
      </div>

      {/* Legible si alguien la busca, discreta si no. Nada de opacidad casi
          nula: la advertencia tiene que poder leerse. */}
      <p className="mt-3 text-right text-mock-xs text-white/55">Ejemplo ilustrativo</p>
    </div>
  );
}

/** Punto de estado. Estático: ningún mockup late ni parpadea. */
export function PuntoEstado({ clase = "bg-yi-verde" }: { clase?: string }) {
  return <span className={cn("inline-block size-1.5 shrink-0 rounded-full", clase)} />;
}

export default MockupIlustrativo;
