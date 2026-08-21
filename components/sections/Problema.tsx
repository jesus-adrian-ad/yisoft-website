import { site } from "@/lib/site";
import Container from "@/components/ui/Container";
import { RevelarAlScroll, RevelarGrupo } from "@/components/ui/RevelarAlScroll";
import CarrilEscenas from "@/components/sections/CarrilEscenas";

/** Id del h2. Lo usa el `aria-labelledby` de la <section> en page.tsx. */
export const ID_TITULO_PROBLEMA = "problema-titulo";

/**
 * "El problema". Título fijo a la izquierda, escenas desfilando a la derecha.
 *
 * El sticky es `position: sticky` a secas —CSS puro, sin un solo listener de
 * scroll— y solo existe de 900px en adelante, que es donde el carril tiene
 * ancho suficiente para que el desfile se lea. Debajo, una columna y ya.
 *
 * Componente de servidor: las cinco escenas viajan en el HTML. Lo único
 * cliente es el envoltorio de animación y el <ol> que marca la escena central.
 */
export function Problema() {
  const { eyebrow, titulo, nota, escenas } = site.problema;

  return (
    <div
      className={[
        // Alterna respecto a "Quiénes somos" para marcar el corte: allá el
        // papel base, aquí blanco puro; en oscuro allá un velo blanco al 2.5%
        // y aquí el carbón desnudo. Es un escalón, no un bloque de color.
        "bg-white dark:bg-transparent",
        // El contrato tope el padding vertical en 3rem a 320px, así que los
        // 320-359px llevan py-12 y desde 360 entra el ritmo normal.
        "py-12 xs:py-seccion",
      ].join(" ")}
    >
      <Container>
        <div
          className={[
            // Dos columnas desde 820px: 38% de título, 62% de carril. El
            // sticky entra después, a 900px; aquí la rejilla ya está puesta.
            "tablet:grid tablet:grid-cols-[38fr_62fr] tablet:items-start",
            // De 1280px hacia arriba crece el hueco ENTRE columnas, nunca el
            // ancho del texto: los párrafos siguen topados en 62 caracteres.
            "tablet:gap-x-8 mdx:gap-x-10 lg:gap-x-14 xl:gap-x-20 3xl:gap-x-28",
          ].join(" ")}
        >
          {/* --- Columna izquierda ---
              De 820 a 899px es una columna normal que hace scroll con todo lo
              demás; el sticky solo entra desde 900px.
              `items-start` en la rejilla es lo que deja al elemento con altura
              de contenido; el área de rejilla sigue midiendo toda la fila, y
              es esa área la que suelta el sticky al acabar la sección.
              El `top` sale del alto real del header más 2rem de respiro: sin
              ese margen el título queda lamiendo la barra. */}
          <RevelarGrupo className="mdx:sticky mdx:top-[calc(var(--header-h)+2rem)]">
            {/* El eyebrow NO es un encabezado: como <p> no rompe el esquema
                del documento (h1 del hero → h2 de aquí → h3 de cada escena). */}
            <RevelarAlScroll delay={0}>
              <p className="mb-4 font-sans text-label font-semibold uppercase tracking-[0.18em] text-yi-verde">
                {eyebrow}
              </p>
            </RevelarAlScroll>

            <RevelarAlScroll delay={0.08} variante="principal">
              <h2
                id={ID_TITULO_PROBLEMA}
                className="hyphens-auto break-words font-display text-h2 font-bold text-yi-azul dark:text-yi-oscuro-titulo"
              >
                {titulo}
              </h2>
            </RevelarAlScroll>

            {/* Mismo tratamiento que la credencial de "Quiénes somos" —small,
                apagado, borde verde a baja opacidad— para que las dos se lean
                como el mismo tipo de apunte al margen. */}
            <RevelarAlScroll
              delay={0.22}
              borde="rgba(46, 196, 134, 0.35)"
              className="mt-8 border-l-2 border-transparent pl-4 mdx:mt-10 mdx:pl-5"
            >
              <p className="max-w-[62ch] text-small text-yi-gris/85 dark:text-yi-oscuro-secundario">
                {nota}
              </p>
            </RevelarAlScroll>
          </RevelarGrupo>

          {/* --- Columna derecha: el carril ---
              <ol> de verdad: el orden es información, y con la lista semántica
              los ordinales de la izquierda pueden ser decorativos.
              El tope en 3xl hace que de 1920px en adelante crezca el hueco
              entre columnas y no la medida de las líneas. */}
          <CarrilEscenas
            className={[
              "mt-10 tablet:mt-0 3xl:max-w-[40rem]",
              // Separación generosa entre escenas: es lo que le da altura a la
              // sección para que el sticky se note, sin un gramo de relleno.
              "space-y-10 tablet:space-y-12 mdx:space-y-14 xl:space-y-16",
            ].join(" ")}
          >
            {escenas.map((escena, i) => (
              // El borde vive aquí y lo pinta `.yi-escena` desde CSS: Motion
              // escribiría `border-color` en línea y le ganaría a la regla del
              // estado activo. Por eso la animación envuelve solo el contenido.
              // El id es el destino de las píldoras "Resuelve" de La solución.
              // Es estable y sale del ordinal, no del índice del array.
              <li
                key={escena.n}
                id={`problema-${escena.n}`}
                // El `scroll-mt` es solo un respiro: la compensación del
                // header ya la pone el `scroll-padding-top` del <html>, que es
                // lo que leen tanto Lenis como el salto nativo. Sumar aquí el
                // alto del header otra vez dejaba la escena 100px más abajo
                // de donde el nav deja a sus secciones.
                className="yi-escena scroll-mt-4 pl-4 xs:pl-5"
              >
                {/* Un grupo por escena: cada una se revela cuando ENTRA ella,
                    no todas de golpe al entrar la sección. */}
                <RevelarGrupo>
                  <RevelarAlScroll delay={i * 0.09}>
                    {/* A 320px el ordinal va encima del título: a un lado se
                        comía el ancho útil del texto. Desde 360px, al margen. */}
                    <div className="flex flex-col gap-1 xs:flex-row xs:gap-4">
                      <span
                        aria-hidden="true"
                        className="w-7 shrink-0 pt-px font-yi-mono text-[clamp(0.6875rem,0.66rem+0.09vw,0.75rem)] font-normal tabular-nums tracking-[0.08em] text-yi-verde xs:pt-[0.5em]"
                      >
                        {escena.n}
                      </span>

                      <div className="min-w-0">
                        <h3 className="hyphens-auto break-words font-display text-[clamp(1.125rem,1.02rem+0.5vw,1.5rem)] font-bold leading-[1.2] tracking-[-0.02em] text-yi-azul dark:text-yi-oscuro-titulo">
                          {escena.titulo}
                        </h3>
                        {/* Sin resaltes en verde aquí dentro: el único acento
                            de color del carril son el ordinal y el borde. */}
                        <p className="mt-2 max-w-[62ch] text-body text-yi-gris dark:text-yi-oscuro-parrafo">
                          {escena.texto}
                        </p>
                      </div>
                    </div>
                  </RevelarAlScroll>
                </RevelarGrupo>
              </li>
            ))}
          </CarrilEscenas>
        </div>
      </Container>
    </div>
  );
}

export default Problema;
