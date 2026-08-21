"use client";

import { useRef } from "react";
import { MotionConfig, motion, useScroll, useTransform } from "motion/react";
import { site } from "@/lib/site";
import { track } from "@/lib/track";
import { useAnimacionesCompletas } from "@/lib/hooks/useMediaQuery";
import Container from "@/components/ui/Container";
import MagneticButton from "@/components/ui/MagneticButton";
import HeroDashboard from "@/components/sections/HeroDashboard";

const SALIDA = [0.16, 1, 0.3, 1] as const;

/** Entrada estándar: fade + subida corta. El delay lo pone cada consumidor. */
const subir = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: SALIDA },
});

/**
 * Si Motion nunca llega a correr (JS deshabilitado), sus elementos se
 * quedarían clavados en `opacity: 0`. Esta hoja los devuelve a la vista.
 * El h1 no la necesita: su revelado es CSS puro y siempre termina visible.
 */
const ESTILO_SIN_JS = `[data-yi-anim]{opacity:1!important;transform:none!important}`;

export function Hero() {
  const seccionRef = useRef<HTMLDivElement>(null);
  const animaciones = useAnimacionesCompletas();

  /* --- Parallax ligado al avance de la sección --- */
  const { scrollYProgress } = useScroll({
    target: seccionRef,
    offset: ["start start", "end start"],
  });
  // El copy corre más que el panel: esa diferencia de velocidad es el efecto.
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const yPanel = useTransform(scrollYProgress, [0, 1], [0, -26]);
  const opacidad = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  /* --- Indicador de scroll: se apaga en los primeros 120px --- */
  const { scrollY } = useScroll();
  const opacidadIndicador = useTransform(scrollY, [0, 120], [1, 0]);

  const estiloCopy = animaciones ? { y: yCopy, opacity: opacidad } : undefined;
  const estiloPanel = animaciones ? { y: yPanel, opacity: opacidad } : undefined;

  return (
    // `reducedMotion="user"` desactiva en Motion todo lo que sea desplazamiento
    // o escala cuando el sistema pide movimiento reducido, y deja pasar solo la
    // opacidad. Evita tener que ramificar cada animación a mano.
    <MotionConfig reducedMotion="user">
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: ESTILO_SIN_JS }} />
      </noscript>

      <div
        ref={seccionRef}
        className={[
          "relative isolate w-full",
          // Deja hueco al header fijo. `min-h` (no `h`) desde 360px: a 320px
          // el hero mide lo que pida el contenido antes que apretarlo.
          "pt-[var(--header-h)]",
          "xs:min-h-[calc(100dvh-var(--header-h))]",
          "flex items-center",
          "py-8 xs:py-12 md:py-16",
        ].join(" ")}
      >
        {/* --- Fondo decorativo --- */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {/* Halo verde arriba a la izquierda y azul abajo a la derecha. En
              tema claro van mucho más tenues: sobre papel, el mismo valor se
              lee como una mancha sucia. */}
          <div className="absolute inset-0 bg-[radial-gradient(60rem_40rem_at_10%_0%,rgb(46_196_134/0.10),transparent_60%)] dark:bg-[radial-gradient(60rem_40rem_at_10%_0%,rgb(46_196_134/0.18),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(55rem_38rem_at_92%_100%,rgb(27_73_101/0.08),transparent_62%)] dark:bg-[radial-gradient(55rem_38rem_at_92%_100%,rgb(27_73_101/0.30),transparent_62%)]" />
          <div className="yi-grano absolute inset-0 opacity-[0.035] dark:opacity-[0.05]" />
        </div>

        {/* --- Contenido --- */}
        <Container className="relative z-10">
          <div className="flex flex-col items-start gap-10 min-[860px]:flex-row min-[860px]:items-center min-[860px]:gap-8 lg:gap-12">
            {/* Columna de copy (~52%) */}
            <motion.div
              style={estiloCopy}
              className="w-full min-w-0 min-[860px]:basis-[52%]"
            >
              {/* 1 · Badge */}
              <motion.p
                {...subir(0)}
                data-yi-anim
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-yi-verde/25 bg-yi-verde/10 px-3 py-1.5 text-label font-semibold text-yi-azul dark:border-yi-verde/30 dark:text-yi-oscuro-texto"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="yi-aro-pulso absolute inset-0 rounded-full bg-yi-verde" />
                  <span className="yi-punto-pulso relative h-2 w-2 rounded-full bg-yi-verde" />
                </span>
                {site.hero.badge}
              </motion.p>

              {/*
                2 y 3 · Titular. Único h1 del documento y elemento LCP: el texto
                va completo en el HTML servido y solo lo revela una animación
                CSS de `translate`. Ver el bloque "Hero" de globals.css.
              */}
              <h1 className="text-h1 hyphens-auto break-words text-yi-azul min-[860px]:text-display dark:text-yi-oscuro-titulo">
                <span className="yi-mascara">
                  <span className="yi-linea" style={{ animationDelay: "0.1s" }}>
                    {site.hero.titulo[0]}
                  </span>
                </span>
                <span className="yi-mascara">
                  <span
                    className="yi-linea block text-yi-gris dark:text-yi-oscuro-secundario"
                    style={{ animationDelay: "0.22s" }}
                  >
                    {site.hero.titulo[1]}
                  </span>
                </span>
              </h1>

              {/* 4 · Subtítulo */}
              <motion.p
                {...subir(0.38)}
                data-yi-anim
                className="mt-5 max-w-[46ch] text-lead text-yi-gris dark:text-yi-oscuro-parrafo"
              >
                {site.hero.subtitulo}
              </motion.p>

              {/* 5 · CTAs. Apilados y a ancho completo hasta 420px. */}
              <div className="mt-8 flex w-full flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center">
                {site.hero.ctas.map((cta, i) => (
                  <motion.div
                    key={cta.href}
                    {...subir(0.48 + i * 0.08)}
                    data-yi-anim
                    className="w-full min-[420px]:w-auto"
                  >
                    <MagneticButton
                      href={cta.href}
                      variante={cta.variante}
                      tamano="lg"
                      claseEnvoltorio="w-full min-[420px]:w-auto"
                      className="w-full min-[420px]:w-auto"
                      onClick={() =>
                        track("cta_click", { location: "hero", label: cta.evento })
                      }
                    >
                      {cta.label}
                    </MagneticButton>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Columna del visual (~48%) */}
            {/* En una sola columna el panel se topa a 560px y se centra: a
                820px estirado a todo el ancho las filas quedaban con un hueco
                enorme entre el nombre y la cantidad, y dejaba de leerse como
                un panel para parecer una barra. */}
            <motion.div
              style={estiloPanel}
              className="mx-auto w-full min-w-0 max-w-[560px] min-[860px]:mx-0 min-[860px]:max-w-none min-[860px]:basis-[48%]"
            >
              <HeroDashboard />
            </motion.div>
          </div>
        </Container>

        {/* --- Indicador de scroll --- */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: opacidadIndicador }}
          className="pointer-events-none absolute inset-x-0 bottom-5 z-10 hidden justify-center [@media(min-width:860px)_and_(min-height:700px)]:flex"
        >
          <span className="relative block h-10 w-px overflow-hidden bg-gradient-to-b from-transparent via-yi-gris/40 to-transparent dark:via-yi-oscuro-secundario/40">
            <span className="yi-scroll-punto absolute left-1/2 top-2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-yi-verde" />
          </span>
        </motion.div>
      </div>
    </MotionConfig>
  );
}

export default Hero;
