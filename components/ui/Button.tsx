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
  "no-underline transition-colors duration-200 select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yi-verde " +
  "disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

const variantes: Record<Variante, string> = {
  primaria:
    "bg-yi-verde text-white border-2 border-transparent hover:bg-yi-verde-hover active:bg-yi-verde-hover",
  secundaria:
    "bg-transparent border-2 border-yi-azul text-yi-azul hover:bg-yi-azul hover:text-white " +
    "dark:border-yi-verde dark:text-yi-verde dark:hover:bg-yi-verde dark:hover:text-yi-carbon",
};

const tamanos: Record<Tamano, string> = {
  sm: "text-small px-4 py-2",
  md: "text-body px-6 py-3",
  lg: "text-lead px-8 py-4",
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
