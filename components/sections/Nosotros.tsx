import type { ReactNode } from "react";
import { site, ID_TITULO_NOSOTROS } from "@/lib/site";
import Container from "@/components/ui/Container";
import { RevelarAlScroll, RevelarGrupo } from "@/components/ui/RevelarAlScroll";

/**
 * Parte el párrafo en el fragmento a resaltar. Se hace aquí y no guardando el
 * texto troceado en site.ts para que el copy siga leyéndose de corrido cuando
 * alguien lo revise.
 */
function resaltar(texto: string, fragmento: string): ReactNode {
  const i = texto.indexOf(fragmento);
  if (i === -1) return texto;

  return (
    <>
      {texto.slice(0, i)}
      <strong className="font-semibold text-yi-verde">{fragmento}</strong>
      {texto.slice(i + fragmento.length)}
    </>
  );
}

/**
 * "Quiénes somos". Contraste deliberado con el hero: allá densidad y
 * movimiento, aquí tipografía y aire. Sin ilustración ni mockups.
 *
 * Es componente de servidor: el texto viaja completo en el HTML y solo el
 * envoltorio de animación es "use client".
 */
export function Nosotros() {
  const { eyebrow, titulo, parrafo1, parrafo2, resalte, credencial } = site.nosotros;

  return (
    <div
      className={[
        // Corte de sección sutil: en claro el papel base, en oscuro un carbón
        // un punto más claro (un velo blanco al 2.5%, no un bloque de color).
        "bg-yi-papel dark:bg-white/[0.025]",
        // `py-seccion` da 4rem a 320px y el contrato pide un máximo de 3rem
        // ahí, así que los 320-359px llevan py-12 y el resto el ritmo normal.
        "py-12 xs:py-seccion",
      ].join(" ")}
    >
      <Container>
        <RevelarGrupo
          className={[
            // Rejilla asimétrica desde 768px: 45% de título, 55% de texto.
            // El desbalance es el punto; no se centra ni se reparte 50/50.
            "md:grid md:grid-cols-[45fr_55fr] md:items-start",
            // De 1280px hacia arriba crece el hueco ENTRE columnas, no el
            // ancho del texto: los párrafos siguen topados en ~65 caracteres.
            "md:gap-x-10 lg:gap-x-16 xl:gap-x-24 3xl:gap-x-32",
          ].join(" ")}
        >
          {/* --- Columna izquierda: eyebrow + título --- */}
          <div>
            {/* El eyebrow NO es un encabezado: como <p> no rompe el esquema
                del documento (h1 del hero → h2 de aquí). */}
            <RevelarAlScroll delay={0}>
              <p className="mb-4 font-sans text-label font-semibold uppercase tracking-[0.18em] text-yi-verde">
                {eyebrow}
              </p>
            </RevelarAlScroll>

            <RevelarAlScroll delay={0.05} variante="principal">
              <h2
                id={ID_TITULO_NOSOTROS}
                className="hyphens-auto break-words font-display text-h2 font-bold"
              >
                {/* Línea 1: el planteamiento, en tono secundario. */}
                <span className="block text-yi-gris dark:text-yi-oscuro-secundario">
                  {titulo[0]}
                </span>
                {/* Línea 2: la afirmación que carga el peso visual. */}
                <span className="block text-yi-azul dark:text-yi-oscuro-titulo">
                  {titulo[1]}
                </span>
              </h2>
            </RevelarAlScroll>
          </div>

          {/* --- Columna derecha: párrafos + credencial ---
              El tope en 3xl es lo que hace que, de 1280px en adelante, lo que
              crezca sea el hueco entre columnas y no el ancho del texto: sin
              él la columna seguía a la del contenedor y pasaba de 572px a
              818px a 2560. */}
          <div className="mt-8 md:mt-0 3xl:max-w-[36rem]">
            <RevelarAlScroll delay={0.42}>
              <p className="max-w-[65ch] text-lead text-yi-gris dark:text-yi-oscuro-parrafo">
                {parrafo1}
              </p>
            </RevelarAlScroll>

            <RevelarAlScroll delay={0.54}>
              <p className="mt-5 max-w-[65ch] text-lead text-yi-gris dark:text-yi-oscuro-parrafo">
                {resaltar(parrafo2, resalte)}
              </p>
            </RevelarAlScroll>

            {/* Lo único de la sección que es una prueba y no una opinión, así
                que va separado: más chico, más apagado, con mucho aire encima
                y un borde de acento. Se lee como apunte al margen. */}
            <RevelarAlScroll
              delay={0.7}
              borde="rgba(46, 196, 134, 0.35)"
              className="mt-10 border-l-2 border-transparent pl-4 md:mt-14 md:pl-5"
            >
              <p className="max-w-[62ch] text-small text-yi-gris/85 dark:text-yi-oscuro-secundario">
                {credencial}
              </p>
            </RevelarAlScroll>
          </div>
        </RevelarGrupo>
      </Container>
    </div>
  );
}

export default Nosotros;
