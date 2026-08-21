"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { usePrefiereMenosMovimiento } from "@/lib/hooks/useMediaQuery";

/* --------------------------------------------------------------------------
   Datos ficticios. Viven aquí y no en lib/site.ts a propósito: no son copy
   del sitio, son el relleno de una ilustración. La etiqueta "Ejemplo
   ilustrativo" del panel lo declara en pantalla.
-------------------------------------------------------------------------- */

const PRODUCTOS = [
  { nombre: "Teclado mecánico K2", cantidad: 48, estado: "sincronizado" },
  { nombre: 'Monitor 27" IPS', cantidad: 6, estado: "bajo" },
  { nombre: "Hub USB-C 7 en 1", cantidad: 130, estado: "sincronizado" },
  { nombre: "Silla ergonómica", cantidad: 21, estado: "sincronizado" },
] as const;

const VENTAS_INICIAL = 184;
const STOCK_INICIAL = 1240;
const CLIENTES = 92;

/** Cada cuánto respira el panel. */
const INTERVALO_MS = 2600;

/** Separador de millares fino y sin salto de línea: "1 240". */
function formatear(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/* --------------------------------------------------------------------------
   Contador con transición suave
-------------------------------------------------------------------------- */

type ContadorProps = {
  valor: number;
  /** Con movimiento reducido el número salta al valor final sin animar. */
  animar: boolean;
  className?: string;
};

/**
 * El valor se interpola en un MotionValue y se formatea en cada frame, así
 * que el número sube contando en vez de saltar. El valor inicial se renderiza
 * en el servidor: el panel nunca aparece vacío ni provoca layout shift.
 */
function Contador({ valor, animar, className }: ContadorProps) {
  const mv = useMotionValue(valor);
  const texto = useTransform(mv, (v) => formatear(Math.round(v)));

  useEffect(() => {
    if (!animar) {
      mv.set(valor);
      return;
    }
    const control = animate(mv, valor, {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => control.stop();
  }, [valor, animar, mv]);

  // `tabular-nums` fija el ancho de cada dígito: sin esto el número tiembla
  // horizontalmente mientras cuenta.
  return (
    <motion.span className={cn("tabular-nums", className)}>{texto}</motion.span>
  );
}

/* --------------------------------------------------------------------------
   Panel
-------------------------------------------------------------------------- */

const CHIP = {
  sincronizado:
    "bg-yi-verde/15 text-yi-verde ring-1 ring-inset ring-yi-verde/25",
  bajo: "bg-amber-400/15 text-amber-300 ring-1 ring-inset ring-amber-400/25",
} as const;

const ETIQUETA_CHIP = {
  sincronizado: "Sincronizado",
  bajo: "Stock bajo",
} as const;

/**
 * El panel entra como un todo y las filas heredan la etiqueta "visible" de
 * este padre: Motion propaga variantes por nombre a los hijos motion, así que
 * basta con declarar el estado aquí arriba una sola vez.
 */
const panelVariants = {
  oculto: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/** Entrada escalonada de las filas: ~50ms entre una y la siguiente. */
const filaVariants = {
  oculto: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.7 + i * 0.05,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function HeroDashboard({ className }: { className?: string }) {
  const menosMovimiento = usePrefiereMenosMovimiento();
  const ref = useRef<HTMLDivElement>(null);

  const [ventas, setVentas] = useState(VENTAS_INICIAL);
  const [stock, setStock] = useState(STOCK_INICIAL);
  const [destello, setDestello] = useState<number | null>(null);

  /**
   * Latido del panel. Se arranca y se para según dos condiciones:
   *  - IntersectionObserver: el hero está en pantalla.
   *  - visibilitychange: la pestaña está al frente.
   * Un setInterval eterno en segundo plano no se ve, pero sí gasta batería.
   */
  useEffect(() => {
    if (menosMovimiento) return;

    const el = ref.current;
    if (!el) return;

    let visible = false;
    let intervalo = 0;
    let limpiarDestello = 0;

    const latido = () => {
      setVentas((v) => v + 1 + Math.floor(Math.random() * 3));
      setStock((s) => Math.max(0, s - (1 + Math.floor(Math.random() * 4))));

      const fila = Math.floor(Math.random() * PRODUCTOS.length);
      setDestello(fila);
      window.clearTimeout(limpiarDestello);
      limpiarDestello = window.setTimeout(() => setDestello(null), 900);
    };

    const arrancar = () => {
      if (intervalo || !visible || document.hidden) return;
      intervalo = window.setInterval(latido, INTERVALO_MS);
    };

    const parar = () => {
      window.clearInterval(intervalo);
      intervalo = 0;
    };

    const io = new IntersectionObserver(
      ([entrada]) => {
        visible = entrada.isIntersecting;
        if (visible) arrancar();
        else parar();
      },
      { threshold: 0.15 },
    );
    io.observe(el);

    const onVisibilidad = () => (document.hidden ? parar() : arrancar());
    document.addEventListener("visibilitychange", onVisibilidad);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilidad);
      parar();
      window.clearTimeout(limpiarDestello);
    };
  }, [menosMovimiento]);

  const animarNumeros = !menosMovimiento;

  return (
    <motion.div
      ref={ref}
      variants={panelVariants}
      initial="oculto"
      animate="visible"
      data-yi-anim
      className={cn("w-full will-change-transform", className)}
    >
      {/*
        La inclinación 3D va en un envoltorio propio: el elemento de fuera lo
        anima Motion (opacidad + escala) y pelearse por la misma propiedad
        `transform` haría que una sobrescribiera a la otra.
      */}
      <div className="yi-inclinado will-change-transform">
        {/*
          Todo el panel es aria-hidden salvo la etiqueta de honestidad: para un
          lector de pantalla son 15 cifras inventadas sin ningún valor, y el
          mensaje real ya está en el h1 y el subtítulo.
        */}
        <div
          aria-hidden="true"
          className={cn(
            "relative overflow-hidden rounded-xl",
            // Pieza de contraste: mantiene fondo oscuro en ambos temas. En
            // claro se le añade un anillo claro alrededor para que se lea como
            // un objeto sobre el papel y no como un parche pegado.
            "bg-yi-carbon ring-1 ring-white/10",
            "shadow-[0_24px_60px_-20px_rgb(16_24_32/0.45)]",
            "ring-offset-0 dark:shadow-[0_24px_60px_-20px_rgb(0_0_0/0.7)]",
          )}
        >
          {/* Barra superior */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 px-3 py-2.5 xs:px-4">
            <span className="min-w-0 truncate text-[0.8125rem] font-semibold text-yi-oscuro-texto">
              Sucursal Centro · hoy
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-yi-oscuro-secundario">
              <span className="relative flex h-1.5 w-1.5">
                <span className="yi-aro-pulso absolute inset-0 rounded-full bg-yi-verde" />
                <span className="yi-punto-pulso relative h-1.5 w-1.5 rounded-full bg-yi-verde" />
              </span>
              en vivo
            </span>
          </div>

          {/* KPIs. A 320px caben los tres en una fila reduciendo la cifra;
              el `min-w-0` evita que un número largo fuerce scroll lateral. */}
          <div className="grid grid-cols-3 gap-px bg-white/10">
            {[
              { etiqueta: "Ventas", nodo: <Contador valor={ventas} animar={animarNumeros} /> },
              {
                etiqueta: "En stock",
                nodo: (
                  <Contador
                    valor={stock}
                    animar={animarNumeros}
                    className="text-amber-300"
                  />
                ),
              },
              { etiqueta: "Clientes", nodo: <span className="tabular-nums">{CLIENTES}</span> },
            ].map(({ etiqueta, nodo }) => (
              <div key={etiqueta} className="min-w-0 bg-yi-carbon px-2 py-3 xs:px-3">
                <div className="truncate text-[0.625rem] font-semibold uppercase tracking-wide text-yi-oscuro-secundario">
                  {etiqueta}
                </div>
                <div className="mt-0.5 font-display text-[clamp(1.125rem,1rem+1.1vw,1.5rem)] font-extrabold leading-none text-white">
                  {nodo}
                </div>
              </div>
            ))}
          </div>

          {/* Lista de productos */}
          <ul className="divide-y divide-white/5 px-1.5 py-1.5 xs:px-2">
            {PRODUCTOS.map((p, i) => (
              <motion.li
                key={p.nombre}
                custom={i}
                variants={filaVariants}
                data-yi-anim
                className="relative flex items-center gap-2 rounded-lg px-1.5 py-2 xs:gap-3 xs:px-2"
              >
                {/* Destello de sincronización: una capa aparte, para no animar
                    el color de fondo de la fila (que dispara repaints). */}
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-lg bg-yi-verde/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: destello === i ? 1 : 0 }}
                  transition={{ duration: destello === i ? 0.18 : 0.6 }}
                />
                <span className="relative min-w-0 flex-1 truncate text-[0.75rem] text-yi-oscuro-texto xs:text-[0.8125rem]">
                  {p.nombre}
                </span>
                <span className="relative shrink-0 tabular-nums text-[0.75rem] font-semibold text-yi-oscuro-secundario">
                  {p.cantidad} pz
                </span>
                <span
                  className={cn(
                    "relative shrink-0 rounded-full px-1.5 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wide xs:px-2 xs:text-[0.625rem]",
                    CHIP[p.estado],
                  )}
                >
                  {ETIQUETA_CHIP[p.estado]}
                </span>
              </motion.li>
            ))}
          </ul>

          {/* Etiqueta de honestidad: dentro del panel, en una esquina, con
              contraste suficiente para leerse si alguien la busca. */}
          <p className="border-t border-white/10 px-3 py-1.5 text-right text-[0.625rem] leading-none text-yi-oscuro-secundario/80 xs:px-4">
            Ejemplo ilustrativo
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default HeroDashboard;
