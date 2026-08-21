import { sections } from "@/lib/site";
import Hero from "@/components/sections/Hero";
import Nosotros, { ID_TITULO_NOSOTROS } from "@/components/sections/Nosotros";

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

        return <section key={id} id={id} aria-label={label} className="py-seccion" />;
      })}
    </main>
  );
}
