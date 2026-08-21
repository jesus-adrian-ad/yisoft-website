/**
 * Une clases condicionales sin dependencias externas.
 *
 * OJO: solo concatena, NO resuelve conflictos entre utilidades de Tailwind.
 * El orden en el atributo `class` no decide nada: gana la que aparezca más
 * tarde en la hoja de estilos. Por ejemplo `.inline-flex` se genera después
 * de `.hidden`, así que pasarle `hidden` por `className` a un componente cuya
 * base ya es `inline-flex` NO lo oculta.
 *
 * Regla práctica: para mostrar/ocultar un componente, envuélvelo en un
 * contenedor propio y pon ahí el `hidden`/`lg:flex`, en vez de intentar
 * sobrescribir su clase base.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
