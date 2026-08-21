import { sections } from "@/lib/site";
import Hero from "@/components/sections/Hero";

/**
 * Esqueleto de la landing. Cada <section id> queda lista para recibir su
 * componente desde components/sections/.
 *
 * Sigue siendo componente de servidor: solo las secciones que lo necesitan
 * (el Hero) son "use client", así que el HTML de portada se sirve completo.
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

        return <section key={id} id={id} aria-label={label} className="py-seccion" />;
      })}
    </main>
  );
}
