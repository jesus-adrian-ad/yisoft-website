"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Button, { type ButtonProps } from "@/components/ui/Button";
import {
  useHoverFino,
  usePrefiereMenosMovimiento,
} from "@/lib/hooks/useMediaQuery";

/* `Omit` sobre una unión la aplana y pierde la discriminación <a> / <button>.
   Este condicional distribuye el Omit por cada miembro y la conserva. */
type SinChildren<T> = T extends unknown ? Omit<T, "children"> : never;

type MagneticButtonProps = SinChildren<ButtonProps> & {
  children: ReactNode;
  /** Radio de atracción alrededor del botón, en px. */
  radio?: number;
  /** Desplazamiento máximo del botón, en px. Sutil a propósito. */
  fuerza?: number;
};

/* Muelle con inercia perceptible pero sin rebote payaso. */
const MUELLE = { stiffness: 220, damping: 18, mass: 0.6 } as const;

/**
 * Botón que se atrae hacia el cursor cuando entra en su radio.
 * El texto interno viaja al 40% del recorrido, lo que da un parallax interno.
 *
 * Se activa SOLO con puntero fino (ratón/trackpad) y queda completamente
 * desactivado con `prefers-reduced-motion: reduce`.
 */
export function MagneticButton({
  children,
  radio = 80,
  fuerza = 8,
  ...botonProps
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const hoverFino = useHoverFino();
  const menosMovimiento = usePrefiereMenosMovimiento();
  const activo = hoverFino && !menosMovimiento;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, MUELLE);
  const sy = useSpring(y, MUELLE);

  // Parallax interno: el contenido se queda un poco atrás del botón.
  const tx = useTransform(sx, (v) => v * 0.4);
  const ty = useTransform(sy, (v) => v * 0.4);

  useEffect(() => {
    if (!activo) {
      x.set(0);
      y.set(0);
      return;
    }

    const onMove = (event: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;

      // Distancia al borde del botón, no al centro: el radio se mide desde
      // la superficie para que botones anchos no se sientan "cortos".
      const distX = Math.max(0, Math.abs(dx) - r.width / 2);
      const distY = Math.max(0, Math.abs(dy) - r.height / 2);
      const distancia = Math.hypot(distX, distY);

      if (distancia > radio) {
        x.set(0);
        y.set(0);
        return;
      }

      // Atracción proporcional: máxima pegado al botón, nula en el borde.
      const intensidad = 1 - distancia / radio;
      x.set(Math.max(-fuerza, Math.min(fuerza, (dx / (r.width / 2)) * fuerza * intensidad)));
      y.set(Math.max(-fuerza, Math.min(fuerza, (dy / (r.height / 2)) * fuerza * intensidad)));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [activo, radio, fuerza, x, y]);

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className="inline-flex will-change-transform">
      <Button {...(botonProps as ButtonProps)}>
        <motion.span style={{ x: tx, y: ty }} className="inline-flex items-center gap-2">
          {children}
        </motion.span>
      </Button>
    </motion.div>
  );
}

export default MagneticButton;
