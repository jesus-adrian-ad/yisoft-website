"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { irASeccion } from "@/lib/navegacion";
import { useLenis } from "@/components/layout/LenisProvider";
import { useScrollListener } from "@/lib/hooks/useScrollListener";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { usePrefiereMenosMovimiento } from "@/lib/hooks/useMediaQuery";
import Container from "@/components/ui/Container";
import Logo from "@/components/ui/Logo";
import MagneticButton from "@/components/ui/MagneticButton";
import ThemeToggle from "@/components/layout/ThemeToggle";
import NavLink from "@/components/layout/NavLink";
import Hamburger from "@/components/layout/Hamburger";
import MobileMenu from "@/components/layout/MobileMenu";

/** Umbrales de comportamiento del header, en px. */
const UMBRAL_SOLIDO = 24;
const UMBRAL_OCULTAR = 400;
const SIEMPRE_VISIBLE = 100;
const DELTA_MINIMO = 8; // evita el temblor con micro-scrolls

const ID_MENU = "menu-movil-yisoft";
const IDS_SECCIONES = site.nav.map((l) => l.id);

export function Header() {
  const lenis = useLenis();
  const menosMovimiento = usePrefiereMenosMovimiento();
  const activo = useScrollSpy(IDS_SECCIONES);

  const [solido, setSolido] = useState(false);
  const [oculto, setOculto] = useState(false);
  const [abierto, setAbierto] = useState(false);

  const hamburguesaRef = useRef<HTMLButtonElement>(null);
  const ultimaYRef = useRef(0);
  // El listener de scroll no debe re-suscribirse cada vez que abre el menú.
  const abiertoRef = useRef(false);
  abiertoRef.current = abierto;

  /* --- Comportamientos 1 y 2: sólido al bajar del tope, ocultar/mostrar --- */
  useScrollListener(lenis, ({ y }) => {
    setSolido(y >= UMBRAL_SOLIDO);

    const anterior = ultimaYRef.current;
    if (Math.abs(y - anterior) < DELTA_MINIMO) return;
    const bajando = y > anterior;
    ultimaYRef.current = y;

    if (abiertoRef.current || y < SIEMPRE_VISIBLE) {
      setOculto(false);
      return;
    }
    if (bajando && y > UMBRAL_OCULTAR) setOculto(true);
    else if (!bajando) setOculto(false);
  });

  /* --- Menú móvil: bloqueo de scroll sin salto y pausa de Lenis --- */
  useEffect(() => {
    if (!abierto) return;

    const de = document.documentElement;
    const anchoBarra = window.innerWidth - de.clientWidth;
    const overflowPrevio = de.style.overflow;
    const paddingPrevio = document.body.style.paddingRight;

    // `overflow: hidden` en <html> congela el scroll SIN tocar scrollTop, así
    // que al restaurar no hay salto de posición.
    de.style.overflow = "hidden";
    if (anchoBarra > 0) document.body.style.paddingRight = `${anchoBarra}px`;
    lenis?.stop();

    return () => {
      de.style.overflow = overflowPrevio;
      document.body.style.paddingRight = paddingPrevio;
      lenis?.start();
    };
  }, [abierto, lenis]);

  /* Cierra el menú si la pantalla crece hasta el nav de escritorio. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setAbierto(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const cerrarMenu = useCallback(() => {
    setAbierto(false);
    // Escape (y el cierre por botón) devuelven el foco a la hamburguesa.
    requestAnimationFrame(() => hamburguesaRef.current?.focus());
  }, []);

  const navegar = useCallback(
    (href: string) => {
      if (abiertoRef.current) {
        setAbierto(false);
        // Se navega en el frame siguiente, ya liberado el bloqueo de scroll
        // y reanudado Lenis: si no, el scrollTo se perdería.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => irASeccion(href, { lenis, menosMovimiento })),
        );
        return;
      }
      irASeccion(href, { lenis, menosMovimiento });
    },
    [lenis, menosMovimiento],
  );

  return (
    <>
      <header
        id="header-yisoft"
        data-nav-propio
        className={cn(
          "fijo-seguro-top fixed inset-x-0 top-0 z-50",
          // OJO: en Tailwind v4 `-translate-y-full` escribe la propiedad
          // `translate`, no `transform`. La lista tiene que nombrarla o el
          // ocultado sería instantáneo en vez de deslizarse.
          "transition-[translate,background-color,border-color,box-shadow,height]",
          "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[translate]",
          oculto ? "-translate-y-full" : "translate-y-0",
          solido
            ? "border-b border-yi-azul/10 bg-yi-papel/80 shadow-[0_1px_2px_rgb(16_24_32/0.06)] backdrop-blur-md dark:border-white/10 dark:bg-yi-carbon/80"
            : "border-b border-transparent bg-transparent shadow-none",
        )}
      >
        <Container
          className={cn(
            "flex items-center justify-between gap-3 transition-[height] duration-300 ease-out lg:gap-6",
            solido ? "h-[var(--header-h-compacto)]" : "h-[var(--header-h)]",
          )}
        >
          {/* Logo: SVG en línea, sin peticiones de red y sin esperar a que
              cargue nada. El ancho sube por breakpoint (96 / 116 / 132px) y
              el alto lo deriva el propio componente de la proporción del
              lockup, así que la caja queda reservada y el CLS es 0.
              A 320px conviven logo (96px) y hamburguesa (44px) de sobra. */}
          <a
            href="#inicio"
            aria-label="YiSoft Development — inicio"
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey) return;
              event.preventDefault();
              navegar("#inicio");
            }}
            className="block shrink-0"
          >
            <Logo
              ancho={96}
              className="w-[96px] sm:w-[116px] lg:w-[132px]"
              // El nombre accesible lo da el aria-label del enlace; si el SVG
              // también se anunciara, el logo se leería dos veces.
              aria-hidden
            />
          </a>

          {/* Nav de escritorio */}
          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-0 xl:gap-2 3xl:gap-4">
              {site.nav.map((link) => (
                <li key={link.id}>
                  <NavLink
                    href={link.href}
                    label={link.label}
                    activo={activo === link.id}
                    onNavegar={navegar}
                  />
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Los controles de escritorio se ocultan desde este contenedor,
                NO con `hidden` en cada componente: sus clases base ya traen
                `inline-flex`, que gana en la hoja de estilos y los dejaría
                visibles en móvil (duplicando el toggle con el del menú). */}
            <div className="hidden items-center gap-2 lg:flex lg:gap-3">
              <ThemeToggle />

              <MagneticButton
                href={site.cta.href}
                tamano="sm"
                className="xl:text-body"
                onClick={(event) => {
                  event.preventDefault();
                  navegar(site.cta.href);
                }}
              >
                {site.cta.label}
              </MagneticButton>
            </div>

            <div className="lg:hidden">
              <Hamburger
                ref={hamburguesaRef}
                abierto={abierto}
                controla={ID_MENU}
                onClick={() => (abierto ? cerrarMenu() : setAbierto(true))}
              />
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu
        id={ID_MENU}
        abierto={abierto}
        activo={activo}
        onCerrar={cerrarMenu}
        onNavegar={navegar}
      />
    </>
  );
}

export default Header;
