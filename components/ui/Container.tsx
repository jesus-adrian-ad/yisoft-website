import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  /** Etiqueta a renderizar. Útil para `section`, `header`, `footer`. */
  as?: ElementType;
  /**
   * Ancho de lectura (800px) para bloques de texto largo: párrafos, biografía.
   * Pasadas las ~75 caracteres por línea la legibilidad se cae.
   */
  narrow?: boolean;
  className?: string;
};

/* Ancho máximo escalonado: sin tope hasta xl, y a partir de ahí crece por
   escalones para aprovechar los monitores grandes sin estirar las líneas. */
const anchos =
  "max-w-none xl:max-w-yi 3xl:max-w-yi-3xl 4xl:max-w-yi-4xl";

export function Container({
  as: Tag = "div",
  narrow = false,
  className,
  children,
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 md:px-8",
        narrow ? "max-w-yi-narrow" : anchos,
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export default Container;
