import type { ReactNode } from "react";
import { site } from "@/lib/site";
import Container from "@/components/ui/Container";
import { RevelarAlScroll, RevelarGrupo } from "@/components/ui/RevelarAlScroll";

/** Id del h2. Lo usa el `aria-labelledby` de la <section> en page.tsx. */
export const ID_TITULO_SOLUCION = "solucion-titulo";

/**
 * Color de las líneas divisorias entre pilares.
 *
 * Va como literal y no como token porque lo anima Motion (la prop `borde` de
 * RevelarAlScroll escribe `border-color` en línea, donde un `dark:` de
 * Tailwind no llega). Es un gris neutro con alfa, así que funciona igual
 * sobre el papel claro que sobre el carbón.
 */
const COLOR_LINEA = "rgba(120, 134, 145, 0.28)";

/**
 * Envuelve el fragmento a resaltar en un <span>.
 *
 * <span> y no <strong>: el énfasis aquí es visual, no semántico. Un lector de
 * pantalla no debe anunciar "inteligencia artificial" con más peso que el
 * resto de la frase.
 */
function resaltar(texto: string, fragmento: string): ReactNode {
  const i = texto.indexOf(fragmento);
  if (i === -1) return texto;

  return (
    <>
      {texto.slice(0, i)}
      <span className="font-semibold text-yi-verde">{fragmento}</span>
      {texto.slice(i + fragmento.length)}
    </>
  );
}

/**
 * "La solución". Tres pilares, cada uno una fila partida en dos columnas de
 * 900px en adelante. Sin tarjetas ni fondos por pilar: el ritmo lo dan las
 * líneas de 1px y el aire.
 *
 * Cada pilar cierra con las escenas de "El problema" que resuelve, y esas
 * referencias son enlaces de verdad a `#problema-01`…`#problema-05`. Son
 * anclas normales a propósito: LenisProvider ya intercepta los enlaces sueltos
 * del documento y hace el scroll suave restando el `scroll-padding-top` del
 * <html>, que es el mismo offset de header que usa el nav. Sin JS —o con
 * movimiento reducido, donde Lenis ni se inicializa— siguen funcionando como
 * anclas nativas, con el mismo offset.
 *
 * Componente de servidor: los tres pilares viajan completos en el HTML.
 */
export function Solucion() {
  const { eyebrow, titulo, subtitulo, resalte, pilares } = site.solucion;

  // Título real de cada escena, para el texto accesible de las píldoras: "01"
  // a secas no le dice nada a nadie. Se lee de site.ts en vez de duplicarlo.
  const tituloEscena = new Map(site.problema.escenas.map((e) => [e.n, e.titulo]));

  return (
    <div
      className={[
        // Alterna respecto a "El problema" (blanco / carbón desnudo) para
        // marcar el corte: aquí vuelve el papel base y, en oscuro, el velo
        // blanco al 2.5%. Es un escalón, no un bloque de color.
        "bg-yi-papel dark:bg-white/[0.025]",
        // El contrato topa el padding vertical en 3rem a 320px.
        "py-12 xs:py-seccion",
      ].join(" ")}
    >
      <Container>
        {/* --- Encabezado de la sección --- */}
        <RevelarGrupo className="mb-10 mdx:mb-14">
          {/* El eyebrow NO es un encabezado: como <p> no rompe el esquema del
              documento (h1 → h2 de aquí → h3 de cada pilar). */}
          <RevelarAlScroll delay={0}>
            <p className="mb-4 font-sans text-label font-semibold uppercase tracking-[0.18em] text-yi-verde">
              {eyebrow}
            </p>
          </RevelarAlScroll>

          <RevelarAlScroll delay={0.08} variante="principal">
            <h2
              id={ID_TITULO_SOLUCION}
              className="hyphens-auto break-words font-display text-h2 font-bold text-yi-azul dark:text-yi-oscuro-titulo"
            >
              {titulo}
            </h2>
          </RevelarAlScroll>

          <RevelarAlScroll delay={0.2}>
            <p className="mt-4 max-w-[58ch] text-lead text-yi-gris dark:text-yi-oscuro-parrafo">
              {subtitulo}
            </p>
          </RevelarAlScroll>
        </RevelarGrupo>

        {/* --- Los tres pilares ---
            <ol> de verdad: el orden es información, y con la lista semántica
            los ordinales grandes pueden ser decorativos. */}
        <ol>
          {pilares.map((pilar, i) => (
            <li key={pilar.n}>
              {/* Un grupo por pilar: cada uno se revela cuando entra él, no
                  todos de golpe al entrar la sección. */}
              <RevelarGrupo>
                {/* La línea divisoria es el `border-top` de esta misma caja, y
                    la dibuja la prop `borde` animando su color: entra con el
                    pilar sin que haya que escribir una animación nueva.
                    Va en cada fila, así que también hay línea encima de la
                    primera y ninguna suelta debajo de la última. */}
                <RevelarAlScroll
                  delay={i * 0.11}
                  borde={COLOR_LINEA}
                  className={[
                    "border-t border-transparent py-8 mdx:py-10",
                    // Dos columnas al 50% desde 900px, alineadas ARRIBA.
                    "mdx:grid mdx:grid-cols-2 mdx:items-start",
                    // De 1280px hacia arriba crece el hueco ENTRE columnas,
                    // nunca la medida del texto (topada en 56 caracteres).
                    "mdx:gap-x-8 lg:gap-x-12 xl:gap-x-16 3xl:gap-x-24",
                  ].join(" ")}
                >
                  {/* --- Izquierda: ordinal + título --- */}
                  <div>
                    <span
                      aria-hidden="true"
                      className="block font-display text-[clamp(1.25rem,1.15rem+0.5vw,1.5rem)] font-extrabold leading-none tabular-nums text-yi-verde/55"
                    >
                      {pilar.n}
                    </span>
                    <h3 className="mt-3 hyphens-auto break-words font-display text-[clamp(1.125rem,1.02rem+0.5vw,1.5rem)] font-bold leading-[1.2] tracking-[-0.02em] text-yi-azul dark:text-yi-oscuro-titulo">
                      {pilar.titulo}
                    </h3>
                  </div>

                  {/* --- Derecha: párrafo + "Resuelve" --- */}
                  <div className="mt-4 mdx:mt-0">
                    <p className="max-w-[56ch] text-body text-yi-gris dark:text-yi-oscuro-parrafo">
                      {/* Único resalte en color de toda la sección. */}
                      {pilar.n === "02" ? resaltar(pilar.texto, resalte) : pilar.texto}
                    </p>

                    {/* `gap-x-4` no es decorativo: con la píldora en ~31px y
                        un área tocable de 44px, un hueco de 12px dejaba los
                        centros a 43px y las dos zonas de tap se solapaban.
                        Con 16px quedan a 47px y cada píldora es suya. */}
                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="font-yi-mono text-[clamp(0.625rem,0.61rem+0.05vw,0.6875rem)] uppercase tracking-[0.16em] text-yi-gris/70 dark:text-yi-oscuro-secundario/70">
                        Resuelve
                      </span>

                      {pilar.resuelve.map((n) => {
                        const escena = tituloEscena.get(n);

                        // Sin escena que apuntar no se pinta un enlace roto:
                        // degrada a la misma píldora, pero como texto.
                        if (!escena) {
                          return (
                            <span key={n} className="yi-pildora">
                              {n}
                            </span>
                          );
                        }

                        return (
                          <a
                            key={n}
                            href={`#problema-${n}`}
                            aria-label={`Ir al problema ${Number(n)}: ${escena}`}
                            className="yi-pildora area-tactil hover-fino:border-yi-verde hover-fino:text-yi-verde"
                          >
                            {/* El texto visible es decorativo: el nombre del
                                enlace lo da el aria-label completo. */}
                            <span aria-hidden="true">{n}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </RevelarAlScroll>
              </RevelarGrupo>
            </li>
          ))}
        </ol>
      </Container>
    </div>
  );
}

export default Solucion;
