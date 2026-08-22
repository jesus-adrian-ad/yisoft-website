import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   Campo de formulario: etiqueta visible, control, y una ranura de mensaje.

   DECISIONES QUE NO SON NEGOCIABLES AQUÍ:

   - La <label> es real y visible. Un placeholder como etiqueta desaparece en
     cuanto se escribe, y quien vuelve al campo ya no sabe qué iba ahí.
   - El texto de ayuda y el de error COMPARTEN ranura, y esa ranura tiene alto
     reservado para dos renglones. Es lo que mantiene el CLS en cero: el error
     aparece dentro de un hueco que ya existía, sin empujar nada.
   - `aria-describedby` apunta siempre al nodo que de verdad está en el DOM
     (ayuda o error, nunca a un id fantasma), y `aria-invalid` marca el campo
     cuando hay error.
   - El control mide 44px de alto como mínimo y su tipografía arranca en 16px:
     por debajo de eso, Safari en iOS hace zoom al enfocar y descuadra la
     página. `text-body` tiene ese 16px como piso del clamp.
--------------------------------------------------------------------------- */

type PropsBase = {
  /** Va al atributo `name` y compone los ids. */
  nombre: string;
  label: string;
  /** Texto de apoyo. Cede su lugar al error mientras lo haya. */
  ayuda?: string;
  error?: string;
  /**
   * Marca el campo como obligatorio con `aria-required`, NO con el `required`
   * nativo. Medido en Chrome: un `<select required>` sin elegir se expone en el
   * árbol de accesibilidad como `invalid=true` desde la primera carga, así que
   * un lector de pantalla anuncia "entrada no válida" en un campo que nadie ha
   * tocado todavía. Como el <form> va con `noValidate` —la validación es la
   * nuestra—, el atributo nativo no aportaba comportamiento, solo ese ruido.
   * Con `aria-required` se anuncia "obligatorio" y el estado de error queda
   * bajo nuestro control, diciendo siempre lo mismo que se ve en pantalla.
   */
  requerido?: boolean;
  className?: string;
};

type PropsTexto = PropsBase & {
  tipo: "texto" | "email";
} & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "type" | "className">;

type PropsArea = PropsBase & {
  tipo: "textarea";
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "className">;

type PropsSelect = PropsBase & {
  tipo: "select";
  opciones: readonly { readonly valor: string; readonly label: string }[];
  /** Texto de la opción vacía inicial. */
  vacia: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "name" | "className">;

export type CampoProps = PropsTexto | PropsArea | PropsSelect;

/* Borde y fondo propios: el formulario no va en tarjeta, pero los campos sí
   necesitan leerse como zonas donde se escribe. */
const control =
  "w-full min-h-11 rounded-boton border px-3.5 py-2.5 " +
  "font-sans text-body text-yi-tinta dark:text-yi-oscuro-texto " +
  "border-yi-azul/25 bg-white dark:border-white/15 dark:bg-white/[0.04] " +
  "placeholder:text-yi-gris/60 dark:placeholder:text-yi-oscuro-secundario/60 " +
  "transition-colors duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yi-verde " +
  // El borde de error se declara con el selector de atributo para que dependa
  // del mismo `aria-invalid` que leen los lectores de pantalla, y no de una
  // clase paralela que pudiera decir otra cosa.
  "aria-invalid:border-yi-error dark:aria-invalid:border-yi-error-oscuro " +
  // Deshabilitado SIN opacidad: bajarla arrastra el texto por debajo del
  // contraste AA. Se distingue por el fondo, no por desvanecerlo.
  "disabled:cursor-not-allowed disabled:bg-yi-azul/[0.06] dark:disabled:bg-white/[0.07]";

export function Campo(props: CampoProps) {
  const { nombre, label, ayuda, error, requerido, className, ...resto } = props;

  const id = `contacto-${nombre}`;
  const idAyuda = `${id}-ayuda`;
  const idError = `${id}-error`;

  /* Solo se apunta al nodo que existe: si hay error, la ayuda no está en el
     DOM, y describedby hacia un id inexistente no describe nada. */
  const describedBy = error ? idError : ayuda ? idAyuda : undefined;

  const comunes = {
    id,
    name: nombre,
    "aria-describedby": describedBy,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-required": requerido ? (true as const) : undefined,
    className: control,
  };

  /* Se resuelve el control ANTES del JSX. `tipo` es una prop nuestra, no un
     atributo del DOM, así que hay que sacarla del resto antes de esparcirlo
     sobre el elemento; hacerlo aquí, con un if por rama, se lee mejor que
     encadenar ternarios dentro del árbol. */
  let control_jsx: ReactNode;

  if (resto.tipo === "textarea") {
    const { tipo, ...atributos } = resto;
    void tipo;
    control_jsx = (
      // Cinco renglones también a 320px, y solo se estira a lo alto:
      // `resize` libre desborda la columna en pantallas angostas.
      <textarea
        rows={5}
        {...atributos}
        {...comunes}
        className={cn(control, "resize-y")}
      />
    );
  } else if (resto.tipo === "select") {
    const { tipo, opciones, vacia, ...atributos } = resto;
    void tipo;
    control_jsx = (
      <select {...atributos} {...comunes}>
        {/* Valor vacío a propósito: es lo que deja el campo "sin elegir" para
            la validación, en vez de traer una opción preseleccionada que
            nadie decidió. */}
        <option value="">{vacia}</option>
        {opciones.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.label}
          </option>
        ))}
      </select>
    );
  } else {
    const { tipo, ...atributos } = resto;
    control_jsx = (
      <input
        type={tipo === "email" ? "email" : "text"}
        // `inputMode` y `autoComplete` le ahorran teclear a quien entra desde
        // el teléfono, que es de donde entra la mayoría.
        {...(tipo === "email"
          ? { inputMode: "email" as const, autoComplete: "email" }
          : { autoComplete: "name" })}
        {...atributos}
        {...comunes}
      />
    );
  }

  return (
    <div className={cn("min-w-0", className)}>
      <label
        htmlFor={id}
        className="mb-1.5 block font-sans text-small font-semibold text-yi-azul dark:text-yi-oscuro-titulo"
      >
        {label}
      </label>

      {control_jsx}

      {/* Ranura de mensaje. El alto reservado son DOS renglones exactos, que
          es lo que ocupa el más largo de los errores en la columna más
          estrecha. Se expresa en `em` sobre el propio `text-small` —3.2em =
          2 × 1.6 de interlineado— y no en `rem`: la escala es fluida, así que
          un valor fijo se queda corto en las pantallas grandes, donde la
          fuente crece. Medido: con 2.8rem el botón saltaba 2.8px a 1280px.
          Así el error aparece dentro de un hueco que ya existía y no mueve
          nada.
          `aria-live` anuncia el error al validar en onBlur, cuando el foco ya
          salió del campo y `aria-describedby` por sí solo no lo diría. */}
      <div className="mt-1.5 min-h-[3.2em] text-small" aria-live="polite">
        {error ? (
          <p
            id={idError}
            className="font-sans text-small text-yi-error dark:text-yi-error-oscuro"
          >
            {error}
          </p>
        ) : ayuda ? (
          <p
            id={idAyuda}
            className="font-sans text-small text-yi-gris dark:text-yi-oscuro-secundario"
          >
            {ayuda}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default Campo;
