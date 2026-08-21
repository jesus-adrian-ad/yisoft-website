"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navLinks, ctaLink } from "@/lib/site";
import { cn } from "@/lib/cn";
import {
  useAnimacionesCompletas,
  usePrefiereMenosMovimiento,
} from "@/lib/hooks/useMediaQuery";
import ThemeToggle from "@/components/layout/ThemeToggle";
import Button from "@/components/ui/Button";

type MobileMenuProps = {
  id: string;
  abierto: boolean;
  activo: string | null;
  onCerrar: () => void;
  onNavegar: (href: string) => void;
};

const SELECTOR_FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ id, abierto, activo, onCerrar, onNavegar }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const menosMovimiento = usePrefiereMenosMovimiento();

  /* Foco atrapado + Escape. */
  useEffect(() => {
    if (!abierto) return;

    const panel = panelRef.current;
    if (!panel) return;

    // El foco entra al panel; el primer enlace es el destino natural.
    const primero = panel.querySelector<HTMLElement>(SELECTOR_FOCUSABLE);
    primero?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCerrar();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(SELECTOR_FOCUSABLE),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) return;

      const primeroEl = focusables[0];
      const ultimo = focusables[focusables.length - 1];
      const actual = document.activeElement;

      if (event.shiftKey && (actual === primeroEl || !panel.contains(actual))) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && (actual === ultimo || !panel.contains(actual))) {
        event.preventDefault();
        primeroEl.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [abierto, onCerrar]);

  /* Cortina y lista.
     - Movimiento reducido: sin animación, aparición directa.
     - Pantallas <768px: animación recortada (el menú ocupa toda la pantalla y
       una entrada larga se siente lenta en un teléfono).
     - Resto: entrada escalonada completa. */
  const completas = useAnimacionesCompletas();
  const duracion = menosMovimiento ? 0 : completas ? 0.28 : 0.18;
  const stagger = menosMovimiento ? 0 : completas ? 0.06 : 0.035;
  const desplazamiento = menosMovimiento ? 0 : completas ? 16 : 8;

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          id={id}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duracion, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "fixed inset-0 z-40 lg:hidden",
            "min-h-dvh w-full overflow-y-auto",
            "bg-yi-papel/95 backdrop-blur-xl dark:bg-yi-carbon/95",
            "fijo-seguro-top",
          )}
        >
          <div className="flex min-h-dvh flex-col justify-between px-5 pt-24 pb-[max(2rem,env(safe-area-inset-bottom,0px))]">
            <motion.ul
              initial="oculto"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: stagger, delayChildren: stagger } },
                oculto: {},
              }}
              className="flex flex-col items-center gap-2"
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.id}
                  variants={{
                    oculto: { opacity: 0, y: desplazamiento },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: duracion, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  <a
                    href={link.href}
                    aria-current={activo === link.id ? "true" : undefined}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
                      event.preventDefault();
                      onNavegar(link.href);
                    }}
                    className={cn(
                      "flex min-h-14 w-full items-center justify-center rounded-boton px-4",
                      "font-display text-h2 font-extrabold tracking-tight",
                      "transition-colors duration-200",
                      activo === link.id
                        ? "text-yi-verde"
                        : "text-yi-azul dark:text-yi-oscuro-titulo",
                    )}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: desplazamiento }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: duracion,
                delay: menosMovimiento ? 0 : stagger * (navLinks.length + 1),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-10 flex flex-col items-center gap-6"
            >
              <Button
                href={ctaLink.href}
                tamano="lg"
                fluido
                onClick={(event) => {
                  event.preventDefault();
                  onNavegar(ctaLink.href);
                }}
              >
                {ctaLink.label}
              </Button>

              <div className="flex items-center gap-3">
                <span className="text-small text-yi-gris dark:text-yi-oscuro-secundario">
                  Tema
                </span>
                <ThemeToggle />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
