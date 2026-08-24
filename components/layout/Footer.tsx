import { site } from "@/lib/site";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import CorreoCopiable from "@/components/ui/CorreoCopiable";
import EnlaceWhatsApp from "@/components/ui/EnlaceWhatsApp";

/* ---------------------------------------------------------------------------
   Pie de página.

   Componente de SERVIDOR. Lo único que se hidrata aquí dentro son las dos
   piezas que de verdad necesitan JavaScript: `CorreoCopiable` (portapapeles) y
   `EnlaceWhatsApp` (analítica). El logo, los enlaces y todos los textos viajan
   como HTML y no cuestan un byte de JS.

   SIN ANIMACIÓN, a propósito. El pie es donde la página se calla: si el
   contenido apareciera con retraso al llegar al final, se sentiría lento, no
   elegante. Por eso no usa `RevelarAlScroll`.

   Los enlaces de navegación son <a href="#..."> normales, sin manejador
   propio. No hace falta: `LenisProvider` intercepta a nivel de documento
   cualquier ancla interna que no esté dentro de `[data-nav-propio]` (que es el
   header) y la lleva con el mismo scroll suave y la misma compensación de
   altura que el nav principal —la compensación vive en el `scroll-padding-top`
   del <html>, no en un offset a mano—. Y si el usuario pide movimiento
   reducido, Lenis ni se inicializa y el ancla cae al salto nativo, que respeta
   ese mismo `scroll-padding-top`.
--------------------------------------------------------------------------- */

/**
 * Año del copyright.
 *
 * LIMITACIÓN CONOCIDA, y es la razón de este comentario: la página es
 * estática, así que esto se evalúa UNA VEZ, durante el build, y queda
 * congelado en el HTML. Si el sitio cruza de diciembre a enero sin que nadie
 * despliegue, el pie seguirá mostrando el año anterior hasta el siguiente
 * despliegue.
 *
 * Se asume a sabiendas. La alternativa era calcularlo en el navegador, y eso
 * obliga a convertir el pie en componente de cliente y a enviar JavaScript
 * para pintar cuatro dígitos: no vale la pena. Si algún día molesta de verdad,
 * la solución correcta es un despliegue programado, no mover esto al cliente.
 */
const ANIO = new Date().getFullYear();

/* Los cinco enlaces salen de `nav` más el CTA, que ya es {label:"Hablemos",
   href:"#contacto"}. Ni un literal duplicado: si mañana cambia una sección,
   el pie cambia solo. */
const ENLACES = [...site.nav, { id: "contacto", ...site.cta }];

/** Encabezado de columna. NO es un <h2> ni un <h3>: ver la nota de abajo. */
function TituloColumna({ children }: { children: string }) {
  /* Va como <p> con estilo de encabezado. Meter encabezados reales aquí
     ensuciaría el esquema del documento, que ya cierra su jerarquía con el h1
     del hero y los seis h2 de las secciones. Un lector de pantalla que navega
     por encabezados no quiere seis entradas más al final de la página. */
  return (
    <p className="mb-4 font-sans text-label font-bold uppercase tracking-[0.18em] text-yi-verde">
      {children}
    </p>
  );
}

/* Enlace de texto del pie. El `min-h-11` y el `py-2` son el área tocable:
   44px de alto es el mínimo para un dedo, y el texto solo mide ~22. */
const enlace =
  "inline-flex min-h-11 items-center py-2 font-sans text-small " +
  "text-yi-oscuro-secundario transition-colors duration-200 " +
  "hover-fino:text-yi-verde active:text-yi-verde " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yi-verde";

export function Footer() {
  const { footer, slogan } = site;

  return (
    <footer
      /* `yi-pie` fija los colores del logo a su variante oscura: el pie va
         sobre carbón en los DOS temas, así que el lockup no puede seguir al
         tema de la página. Ver globals.css.

         El borde superior no es decorativo: en tema oscuro el carbón del pie y
         el del <body> son el mismo color, y sin esa línea el pie se fundiría
         con la sección de contacto en vez de leerse como otro plano.

         `role="contentinfo"` NO se escribe: el elemento <footer> a nivel de
         documento ya lo aporta, y repetirlo es ruido. */
      className={[
        "yi-pie border-t border-white/[0.08] bg-yi-carbon",
        // Arriba generoso, abajo comedido. A 320px el contrato topa en 3rem y
        // 1.5rem; de 360 en adelante se relaja.
        "pt-12 xs:pt-16",
        // El `env()` evita que la barra de gestos del iPhone se coma la última
        // línea. Sin safe-area en el navegador, el fallback es 0px.
        "pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]",
        "xs:pb-[calc(2rem+env(safe-area-inset-bottom,0px))]",
      ].join(" ")}
    >
      <Container>
        {/* Una columna hasta 768px. Desde ahí, tres: la de marca al doble de
            ancho que las otras dos, que van iguales. De 1280 en adelante crece
            el hueco ENTRE columnas, nunca la medida del texto. */}
        <div className="grid gap-y-10 md:grid-cols-[2fr_1fr_1fr] md:gap-x-12 xl:gap-x-20 3xl:gap-x-28">
          {/* --- Columna 1: marca --- */}
          <div className="min-w-0">
            {/* `aria-hidden` no: aquí el logo SÍ es contenido, no la etiqueta
                de un enlace, así que conserva su `aria-label` propio. */}
            <Logo ancho={132} className="w-[132px] lg:w-[148px]" />

            <p className="mt-5 max-w-[34ch] font-sans text-small text-yi-oscuro-secundario">
              {slogan}
            </p>

            {/* Dos líneas y no una con separador: son dos ideas distintas —la
                plaza y el alcance— y a 320px un separador las partiría feo. */}
            <p className="mt-4 font-sans text-small text-yi-oscuro-secundario">
              {footer.ubicacion[0]}
              <br />
              {footer.ubicacion[1]}
            </p>
          </div>

          {/* --- Columna 2: navegación --- */}
          <nav aria-label="Enlaces del pie" className="min-w-0">
            <TituloColumna>{footer.navTitulo}</TituloColumna>
            {/* <ul> de verdad: el lector anuncia cuántos enlaces hay antes de
                entrar, que es justo lo que se quiere saber en un pie. */}
            <ul className="flex flex-col">
              {ENLACES.map((item) => (
                <li key={item.id}>
                  <a href={item.href} className={enlace}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* --- Columna 3: contacto --- */}
          <div className="min-w-0">
            <TituloColumna>{footer.contactoTitulo}</TituloColumna>

            {/* `tono="oscuro"`: el pie es carbón en los dos temas, así que el
                enlace no puede seguir al tema de la página. */}
            <CorreoCopiable
              correo={site.contact.email}
              ubicacion="footer"
              tono="oscuro"
              className="mb-1"
            />

            <div>
              <EnlaceWhatsApp
                ubicacion="footer"
                aria={footer.whatsapp.aria}
                className={enlace}
              >
                {footer.whatsapp.label}
              </EnlaceWhatsApp>
            </div>
          </div>
        </div>

        {/* --- Barra inferior ---
            Se apila hasta 768px y se reparte a los lados desde ahí. El texto
            es el más apagado de la página, pero no por debajo de AA: son 12px,
            así que necesita 4.5:1 y se queda en el token secundario al 90%. */}
        <div className="mt-12 border-t border-white/10 pt-6 xs:mt-14">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="font-sans text-[clamp(0.75rem,0.73rem+0.08vw,0.8125rem)] leading-relaxed text-yi-oscuro-secundario/90">
              {footer.copyright.replace("{anio}", String(ANIO))}
            </p>
            <p className="font-sans text-[clamp(0.75rem,0.73rem+0.08vw,0.8125rem)] leading-relaxed text-yi-oscuro-secundario/90">
              {footer.aviso}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
