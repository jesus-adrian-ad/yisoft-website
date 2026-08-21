import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  children: ReactNode;
  /** Etiqueta a renderizar. Útil para `section`, `header`, `footer`. */
  as?: ElementType;
  className?: string;
};

/** Ancho máximo 1200px, centrado, con padding lateral responsivo. */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-yi px-5 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
}

export default Container;
