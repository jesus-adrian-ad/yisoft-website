import { site, ID_TITULO_PROCESO } from "@/lib/site";
import Container from "@/components/ui/Container";
import { RevelarAlScroll, RevelarGrupo } from "@/components/ui/RevelarAlScroll";
import CarrilPasos from "@/components/sections/CarrilPasos";

/**
 * Color de la línea que separa los pasos de la franja de cierre.
 *
 * Va como literal y no como token porque lo anima Motion (la prop `borde` de
 * RevelarAlScroll escribe `border-color` en línea, donde un `dark:` de
 * Tailwind no llega). Es el mismo gris neutro con alfa que usa "La solución",
 * así que funciona igual sobre el papel claro que sobre el carbón.
 */
const COLOR_LINEA = "rgba(120, 134, 145, 0.28)";

/** Verde a baja opacidad del "apunte al margen". El mismo de la credencial de
 *  "Quiénes somos" y de la nota de "El problema": es un sistema, no un color
 *  suelto. */
const COLOR_ACENTO = "rgba(46, 196, 134, 0.35)";

/**
 * "Proceso". Cinco pasos colgando de un carril vertical, y una franja de
 * cierre con lo que pasa después de entregar.
 *
 * El carril —punto y línea— es CSS puro en `.yi-paso` (globals.css): ni SVG ni
 * canvas, y pintado desde el primer frame. Lo único que aporta JavaScript es
 * marcar el paso que está en el centro de la ventana, y eso solo de 768px en
 * adelante y con movimiento permitido.
 *
 * Componente de servidor: los cinco pasos y la franja viajan completos en el
 * HTML. Lo único cliente son los envoltorios de animación y el <ol>.
 */
export function Proceso() {
  const { eyebrow, titulo, subtitulo, pasos, cierre } = site.proceso;

  return (
    <div
      className={[
        // Alterna respecto a "Servicios" (blanco puro / carbón desnudo): aquí
        // vuelve el papel base y, en oscuro, el velo blanco al 2.5%. Es un
        // escalón, no un bloque de color.
        "bg-yi-papel dark:bg-white/[0.025]",
        // El contrato topa el padding vertical en 3rem a 320px.
        "py-12 xs:py-seccion",
      ].join(" ")}
    >
      <Container>
        {/* --- Encabezado de la sección --- */}
        <RevelarGrupo className="mb-10 tablet:mb-14">
          {/* El eyebrow NO es un encabezado: como <p> no rompe el esquema del
              documento (h1 → h2 de aquí → h3 de cada paso). */}
          <RevelarAlScroll delay={0}>
            <p className="mb-4 font-sans text-label font-semibold uppercase tracking-[0.18em] text-yi-verde">
              {eyebrow}
            </p>
          </RevelarAlScroll>

          <RevelarAlScroll delay={0.08} variante="principal">
            <h2
              id={ID_TITULO_PROCESO}
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

        {/* --- Los cinco pasos ---
            <ol> de verdad: el orden es LA información de esta sección, y con
            la lista semántica los ordinales visibles pueden ser decorativos.
            El carril se dibuja estático y no con un `scaleY` animado: el punto
            de cada paso tendría que esperar a que la línea lo alcanzara, y
            cuadrar eso con el escalonado del revelado producía saltos. El
            contrato lo permitía "solo si no complica", y complicaba. */}
        <CarrilPasos>
          {pasos.map((paso, i) => (
            // El punto y la línea son `::before`/`::after` de este <li>, así
            // que viven fuera de la animación: el carril está completo desde
            // el primer pintado y ninguna pieza empuja el layout al revelarse.
            <li key={paso.n} className="yi-paso">
              {/* Un grupo por paso: cada uno se revela cuando entra él, no los
                  cinco de golpe al entrar la sección. */}
              <RevelarGrupo
                className={[
                  // Dos columnas desde 820px. La izquierda es FIJA en 15rem:
                  // es lo que deja los cinco títulos alineados entre sí, y esa
                  // alineación es lo que hace que se lea como una secuencia y
                  // no como una lista de párrafos.
                  "tablet:grid tablet:grid-cols-[15rem_1fr] tablet:items-start",
                  // De 1280px hacia arriba crece el hueco ENTRE columnas,
                  // nunca la medida del texto (topada en 56 caracteres).
                  "tablet:gap-x-8 xl:gap-x-12 3xl:gap-x-20",
                ].join(" ")}
              >
                <RevelarAlScroll delay={i * 0.06}>
                  {/* Ordinal y título SIEMPRE en la misma línea, también en la
                      columna de 15rem: con el ordinal de ancho fijo y cifras
                      tabulares, los títulos arrancan en la misma x en los
                      cinco pasos. Ponerlo encima a partir de 820px rompía esa
                      alineación y descolgaba el punto del carril. */}
                  <div className="flex items-baseline gap-2 xs:gap-3">
                    <span
                      aria-hidden="true"
                      className="w-6 shrink-0 font-yi-mono text-[clamp(0.6875rem,0.66rem+0.09vw,0.75rem)] font-normal tabular-nums tracking-[0.08em] text-yi-verde xs:w-7"
                    >
                      {paso.n}
                    </span>

                    {/* `text-wrap: pretty` en vez del `balance` que la regla
                        base pone a todo encabezado: en la columna de 15rem,
                        balance repartía "Construcción con avances visibles" en
                        tres líneas iguales partiendo "avan-ces" con guion.
                        `hyphens-auto` se queda —el contrato lo pide— y con
                        `hyphenate-limit-chars: 8 4 4` solo entra en palabras de
                        8+ letras: "Construcción" (la única que puede no caber
                        a 320px) sí, "avances" ya no. Donde no se soporte, cae
                        al guionado normal, que es el comportamiento anterior. */}
                    <h3 className="min-w-0 hyphens-auto [hyphenate-limit-chars:8_4_4] break-words font-display text-[clamp(1.125rem,1.02rem+0.5vw,1.5rem)] font-bold leading-[1.2] tracking-[-0.02em] text-pretty text-yi-azul dark:text-yi-oscuro-titulo">
                      {paso.titulo}
                    </h3>
                  </div>
                </RevelarAlScroll>

                {/* ~100ms después del título: el párrafo entra detrás de su
                    encabezado, no a la par. */}
                <RevelarAlScroll delay={i * 0.06 + 0.1}>
                  {/* El `pl` iguala el canal del ordinal (ancho + hueco) para
                      que el párrafo arranque en la misma x que el título y no
                      cuelgue bajo el número. Desde 820px el ordinal ya vive en
                      la otra columna y el padding sobra. */}
                  <p className="mt-2 max-w-[56ch] pl-8 text-body text-yi-gris dark:text-yi-oscuro-parrafo xs:pl-10 tablet:mt-0 tablet:pl-0">
                    {paso.texto}
                  </p>
                </RevelarAlScroll>
              </RevelarGrupo>
            </li>
          ))}
        </CarrilPasos>

        {/* --- Franja de cierre ---
            No es una tarjeta y no lleva fondo propio: una línea de 1px, aire y
            tipografía, como el resto de la página. Se revela como un bloque
            único, al final, porque es una sola idea. */}
        <RevelarGrupo className="mt-4 tablet:mt-6">
          <RevelarAlScroll
            delay={0}
            borde={COLOR_LINEA}
            className="border-t border-transparent pt-7 md:pt-10"
          >
            {/* h3, igual que los títulos de paso: la franja cuelga del mismo
                h2 y no del último paso. Mismo tamaño que ellos a propósito —
                es un hermano, no un nivel más. */}
            <h3 className="hyphens-auto break-words font-display text-[clamp(1.125rem,1.02rem+0.5vw,1.5rem)] font-bold leading-[1.2] tracking-[-0.02em] text-yi-azul dark:text-yi-oscuro-titulo">
              {cierre.titulo}
            </h3>

            {/* Una columna en móvil, dos desde 768px. El 768 es de la franja y
                el 820 de los pasos: son rejillas distintas y no tienen por qué
                cambiar juntas — dos bloques cortos caben antes que un carril
                partido en dos. */}
            <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2 md:gap-8 lg:gap-12">
              {cierre.bloques.map((bloque) => (
                // El borde verde va estático y no animado por Motion: el
                // bloque ya está dentro del revelado de la franja, y anidar
                // otra animación de `border-color` solo añadía una capa más
                // sin que se notara. El color es el mismo del sistema.
                <div
                  key={bloque.titulo}
                  className="border-l-2 pl-4 md:pl-5"
                  style={{ borderColor: COLOR_ACENTO }}
                >
                  {/* <strong> y NO un h4: dos encabezados sueltos aquí
                      ensuciarían el esquema del documento sin aportar nada a
                      la navegación por encabezados. */}
                  <p className="text-body text-yi-azul dark:text-yi-oscuro-titulo">
                    <strong>{bloque.titulo}</strong>
                  </p>
                  <p className="mt-2 max-w-[52ch] text-small text-yi-gris/85 dark:text-yi-oscuro-secundario">
                    {bloque.texto}
                  </p>
                </div>
              ))}
            </div>

            {/* Nota al pie. Se cita literal: es la línea que define qué se
                cobra aparte, y suavizarla o endurecerla cambia el trato. */}
            <p className="mt-8 max-w-[68ch] text-small italic text-yi-gris/75 dark:text-yi-oscuro-secundario/85 md:mt-10">
              {cierre.nota}
            </p>
          </RevelarAlScroll>
        </RevelarGrupo>
      </Container>
    </div>
  );
}

export default Proceso;
