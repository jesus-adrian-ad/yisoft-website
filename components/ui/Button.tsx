import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Variante = "primaria" | "secundaria";
type Tamano = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-boton font-sans font-semibold " +
  "no-underline transition-colors duration-200 select-none text-center " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yi-verde " +
  "disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

/* Los efectos de hover van con `hover-fino:` (ratón/trackpad). En táctil el
   feedback lo da `active:`, que no se queda pegado tras el tap. */
const variantes: Record<Variante, string> = {
  primaria:
    "bg-yi-verde text-white border-2 border-transparent " +
    "hover-fino:bg-yi-verde-hover active:bg-yi-verde-hover",
  secundaria:
    "bg-transparent border-2 border-yi-azul text-yi-azul " +
    "hover-fino:bg-yi-azul hover-fino:text-white active:bg-yi-azul active:text-white " +
    "dark:border-yi-verde dark:text-yi-verde " +
    "dark:hover-fino:bg-yi-verde dark:hover-fino:text-yi-carbon " +
    "dark:active:bg-yi-verde dark:active:text-yi-carbon",
};

/* Todos los tamaños superan los 44px de alto tocable en pantalla táctil. */
const tamanos: Record<Tamano, string> = {
  sm: "text-small px-4 py-2 min-h-11",
  md: "text-body px-6 py-3 min-h-12",
  lg: "text-lead px-8 py-4 min-h-14",
};

type PropsComunes = {
  children: ReactNode;
  variante?: Variante;
  tamano?: Tamano;
  /** Ocupa todo el ancho disponible (útil en móvil). */
  fluido?: boolean;
  className?: string;
};

type BotonProps = PropsComunes &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof PropsComunes> & {
    as?: "button";
    href?: never;
  };

type EnlaceProps = PropsComunes &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof PropsComunes> & {
    as?: "a";
    href: string;
  };

export type ButtonProps = BotonProps | EnlaceProps;

/**
 * Botón de YiSoft. Renderiza <a> si recibe `href`, si no <button>.
 */
export function Button(props: ButtonProps) {
  const {
    children,
    variante = "primaria",
    tamano = "md",
    fluido = false,
    className,
    ...resto
  } = props;

  const clases = cn(
    base,
    variantes[variante],
    tamanos[tamano],
    fluido && "w-full",
    className,
  );

  if ("href" in resto && typeof resto.href === "string") {
    const { as: _as, ...anchorProps } = resto as EnlaceProps;
    void _as;
    return (
      <a className={clases} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { as: _as, href: _href, ...buttonProps } = resto as BotonProps;
  void _as;
  void _href;
  return (
    <button type="button" className={clases} {...buttonProps}>
      {children}
    </button>
  );
}

export default Button;
