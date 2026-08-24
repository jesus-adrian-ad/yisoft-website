import type { ReactNode } from "react";
import { site, ID_TITULO_SERVICIOS } from "@/lib/site";
import Container from "@/components/ui/Container";
import { RevelarAlScroll, RevelarGrupo } from "@/components/ui/RevelarAlScroll";
import MockSistema from "@/components/mockups/MockSistema";
import MockAutomatizacion from "@/components/mockups/MockAutomatizacion";
import MockLanding from "@/components/mockups/MockLanding";
import MockIntegraciones from "@/components/mockups/MockIntegraciones";
import MockEcommerce from "@/components/mockups/MockEcommerce";

/**
 * La maqueta de cada servicio, en el orden de `site.servicios.items`. Vive
 * aquí y no en site.ts porque un componente no es copy: site.ts se revisa por
 * el texto y no debería cargar con imports de React.
 */
const MOCKUPS = [
  MockSistema,
  MockAutomatizacion,
  MockLanding,
  MockIntegraciones,
  MockEcommerce,
] as const;

/**
 * Envuelve el fragmento a resaltar en un <span>.
 *
 * <span> y no <strong>: el énfasis es visual, no semántico. Un lector de
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
 * "Servicios". Cinco filas alternadas: texto y maqueta cambiando de lado.
 *
 * La alternancia se hace con `order` dentro de la rejilla y NUNCA con
 * `direction: rtl`, que además de invertir las columnas invierte la
 * puntuación y el orden de lectura del texto. Con `order` el DOM mantiene el
 * orden natural —texto y luego maqueta— así que quien navega con lector de
 * pantalla o con teclado recorre los cinco servicios igual en las dos
 * disposiciones, y el texto se alinea a la izquierda en ambas.
 *
 * Componente de servidor, y las cinco maquetas también: no hay un solo
 * `useState` en toda la sección.
 */
export function Servicios() {
  const { eyebrow, titulo, subtitulo, nota, resalte, items } = site.servicios;

  return (
    <div
      className={[
        // Alterna respecto a "La solución" (papel / velo blanco): aquí blanco
        // puro y, en oscuro, el carbón desnudo.
        "bg-white dark:bg-transparent",
        // El contrato topa el padding vertical en 3rem a 320px.
        "py-12 xs:py-seccion",
      ].join(" ")}
    >
      <Container>
        {/* --- Encabezado de la sección --- */}
        <RevelarGrupo className="mb-10 alterna:mb-14">
          {/* El eyebrow NO es un encabezado: como <p> no rompe el esquema del
              documento (h1 → h2 de aquí → h3 de cada servicio). */}
          <RevelarAlScroll delay={0}>
            <p className="mb-4 font-sans text-label font-semibold uppercase tracking-[0.18em] text-yi-verde">
              {eyebrow}
            </p>
          </RevelarAlScroll>

          <RevelarAlScroll delay={0.08} variante="principal">
            <h2
              id={ID_TITULO_SERVICIOS}
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

        {/* --- Los cinco servicios ---
            <ol> de verdad: el orden es información, y con la lista semántica
            los ordinales pueden ser decorativos. Sin líneas ni tarjetas: el
            ritmo lo da la alternancia. */}
        <ol className="space-y-12 alterna:space-y-14">
          {items.map((servicio, i) => {
            const Mockup = MOCKUPS[i];
            // Pares (02, 04) invierten: maqueta a la izquierda.
            const invertido = i % 2 === 1;
            const ultimoEntregable = servicio.entregables.length - 1;

            return (
              <li key={servicio.n}>
                {/* Un grupo por servicio: cada uno se revela cuando entra él,
                    no los cinco de golpe al entrar la sección. */}
                <RevelarGrupo
                  className={[
                    "alterna:grid alterna:grid-cols-2 yi-centrado-seguro",
                    // De 1280px hacia arriba crece el hueco ENTRE columnas,
                    // nunca la medida del texto (topada en 54 caracteres).
                    "alterna:gap-x-10 xl:gap-x-16 3xl:gap-x-24",
                  ].join(" ")}
                >
                  {/* --- Texto --- */}
                  <div className={invertido ? "alterna:order-2" : undefined}>
                    <RevelarAlScroll delay={0}>
                      <span
                        aria-hidden="true"
                        className="block font-yi-mono text-[clamp(0.6875rem,0.66rem+0.09vw,0.75rem)] font-semibold tabular-nums tracking-[0.08em] text-yi-verde"
                      >
                        {servicio.n}
                      </span>

                      <h3 className="mt-2 hyphens-auto break-words font-display text-[clamp(1.125rem,1.02rem+0.5vw,1.5rem)] font-bold leading-[1.2] tracking-[-0.02em] text-yi-azul dark:text-yi-oscuro-titulo">
                        {servicio.titulo}
                      </h3>

                      <p className="mt-3 max-w-[54ch] text-body text-yi-gris dark:text-yi-oscuro-parrafo">
                        {/* Único resalte en color de toda la sección. */}
                        {servicio.n === "02"
                          ? resaltar(servicio.texto, resalte)
                          : servicio.texto}
                      </p>

                      {/* <ul> real aunque se vean como píldoras: son una lista
                          de entregables, no una fila de adornos. No son
                          enlaces ni botones, así que no llevan hover, ni
                          cursor de mano, ni foco. */}
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {servicio.entregables.map((entregable, j) => (
                          <li
                            key={entregable}
                            className={
                              j === ultimoEntregable
                                ? "yi-entregable-abierto"
                                : "yi-entregable"
                            }
                          >
                            {entregable}
                          </li>
                        ))}
                      </ul>
                    </RevelarAlScroll>
                  </div>

                  {/* --- Maqueta ---
                      Entra 120ms después del texto: primero se entiende qué
                      es, luego aparece cómo se ve. */}
                  <div
                    className={[
                      "mt-8 alterna:mt-0",
                      invertido ? "alterna:order-1" : "",
                    ].join(" ")}
                  >
                    <RevelarAlScroll delay={0.12}>
                      <Mockup />
                    </RevelarAlScroll>
                  </div>
                </RevelarGrupo>
              </li>
            );
          })}
        </ol>

        {/* --- Aviso de alcance. Una sola vez, al pie: repetirlo por servicio
            lo convertiría en ruido y en una letra chica de cinco líneas. --- */}
        <RevelarAlScroll delay={0}>
          <p className="mt-12 max-w-[58ch] text-small italic text-yi-gris/80 dark:text-yi-oscuro-secundario">
            {nota}
          </p>
        </RevelarAlScroll>
      </Container>
    </div>
  );
}

export default Servicios;
