import { sections } from "@/lib/site";

/**
 * Esqueleto de la landing. Cada <section id> queda lista para recibir su
 * componente desde components/sections/.
 */
export default function Home() {
  return (
    <main id="contenido" tabIndex={-1}>
      {sections.map(({ id, label }) => (
        <section
          key={id}
          id={id}
          aria-label={label}
          className="py-seccion"
        />
      ))}
    </main>
  );
}
