import dynamic from "next/dynamic";
import {
  sections,
  ID_TITULO_NOSOTROS,
  ID_TITULO_PROBLEMA,
  ID_TITULO_SOLUCION,
  ID_TITULO_SERVICIOS,
  ID_TITULO_PROCESO,
  ID_TITULO_CONTACTO,
} from "@/lib/site";
import Hero from "@/components/sections/Hero";

/**
 * Todo lo de abajo del Hero entra con `next/dynamic` (SSR sigue encendido:
 * el HTML/texto de cada sección viaja igual en la respuesta del servidor,
 * solo cambia que su JS —incluyendo el código de Motion que usan a través de
 * RevelarAlScroll— vive en un chunk aparte del bundle inicial en vez de ir
 * mezclado con el de Hero. Hero se queda con import estático a propósito: es
 * la única sección crítica para el primer render.
 */
const Nosotros = dynamic(() => import("@/components/sections/Nosotros"));
const Problema = dynamic(() => import("@/components/sections/Problema"));
const Solucion = dynamic(() => import("@/components/sections/Solucion"));
const Servicios = dynamic(() => import("@/components/sections/Servicios"));
const Proceso = dynamic(() => import("@/components/sections/Proceso"));
const Contacto = dynamic(() => import("@/components/sections/Contacto"));

/**
 * Esqueleto de la landing. Cada <section id> queda lista para recibir su
 * componente desde components/sections/.
 *
 * Sigue siendo componente de servidor: solo los envoltorios de animación son
 * "use client", así que el texto de todas las secciones viaja en el HTML.
 */
export default function Home() {
  return (
    <main id="contenido" tabIndex={-1}>
      {sections.map(({ id, label }) => {
        if (id === "inicio") {
          // El hero pone su propio ritmo vertical (alto de viewport menos
          // header), así que aquí no lleva `py-seccion`.
          return (
            <section key={id} id={id} aria-label={label}>
              <Hero />
            </section>
          );
        }

        if (id === "nosotros") {
          // Se nombra con su propio h2 en vez de con `aria-label`: no duplica
          // el nombre de la sección para quien navega con lector de pantalla.
          return (
            <section key={id} id={id} aria-labelledby={ID_TITULO_NOSOTROS}>
              <Nosotros />
            </section>
          );
        }

        if (id === "problema") {
          // Igual que "nosotros": la nombra su propio h2, no un `aria-label`.
          return (
            <section key={id} id={id} aria-labelledby={ID_TITULO_PROBLEMA}>
              <Problema />
            </section>
          );
        }

        if (id === "solucion") {
          // Igual que las anteriores: la nombra su propio h2.
          return (
            <section key={id} id={id} aria-labelledby={ID_TITULO_SOLUCION}>
              <Solucion />
            </section>
          );
        }

        if (id === "servicios") {
          // Igual que las anteriores: la nombra su propio h2.
          return (
            <section key={id} id={id} aria-labelledby={ID_TITULO_SERVICIOS}>
              <Servicios />
            </section>
          );
        }

        if (id === "proceso") {
          // Igual que las anteriores: la nombra su propio h2.
          return (
            <section key={id} id={id} aria-labelledby={ID_TITULO_PROCESO}>
              <Proceso />
            </section>
          );
        }

        if (id === "contacto") {
          // Última sección de contenido. Igual que las anteriores, la nombra
          // su propio h2 (el sexto del documento).
          return (
            <section key={id} id={id} aria-labelledby={ID_TITULO_CONTACTO}>
              <Contacto />
            </section>
          );
        }

        return <section key={id} id={id} aria-label={label} className="py-seccion" />;
      })}
    </main>
  );
}
