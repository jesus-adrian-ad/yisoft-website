/**
 * Constantes únicas del sitio. Cambiar aquí se propaga a metadatos,
 * sitemap, robots, JSON-LD y la imagen de Open Graph.
 */
export const SITE_URL = "https://yisoft.mx";

export const siteConfig = {
  url: SITE_URL,
  name: "YiSoft",
  title: "YiSoft — Sistemas de inventario, clientes y ventas para tu negocio",
  slogan: "Páginas web y sistemas para tu negocio",
  description:
    "Conectamos las áreas y sucursales de tu empresa en un solo sistema: inventario, clientes y ventas al día, sin hojas de cálculo sueltas.",
  locale: "es_MX",
  lang: "es-MX",
  author: "Jesús Adrián",
  authorRole: "Desarrollador de software",
  areaServed: ["Monterrey", "Nuevo León", "México"],
  keywords: [
    "desarrollo de software",
    "sistemas de inventario",
    "sistema de ventas",
    "CRM para empresas",
    "desarrollo de APIs",
    "automatización de procesos",
    "integración de datos",
    "páginas web Monterrey",
    "software a la medida",
    "freelance desarrollo web",
  ],
  serviceType: [
    "Desarrollo web",
    "Desarrollo de APIs y sistemas",
    "Automatización de procesos",
    "Integración de datos",
  ],
  contact: {
    email: "contacto@yisoft.mx",
    phone: "+52 81 0000 0000",
    whatsapp: "https://wa.me/528100000000",
  },
  ogImage: `${SITE_URL}/opengraph-image`,
  logo: `${SITE_URL}/logo.png`,
} as const;

/** Secciones de la landing, en orden. Usadas por el nav y por page.tsx. */
export const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "problema", label: "Problema" },
  { id: "solucion", label: "Solución" },
  { id: "servicios", label: "Servicios" },
  { id: "proceso", label: "Proceso" },
  { id: "casos", label: "Casos" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "contacto", label: "Contacto" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/**
 * Enlaces del nav principal. Única fuente de verdad: la consumen el nav de
 * escritorio, el menú móvil y el scroll-spy.
 */
export const navLinks = [
  { id: "problema", label: "Problema", href: "#problema" },
  { id: "solucion", label: "Solución", href: "#solucion" },
  { id: "servicios", label: "Servicios", href: "#servicios" },
  { id: "proceso", label: "Proceso", href: "#proceso" },
  { id: "casos", label: "Casos", href: "#casos" },
] as const;

export type NavLink = (typeof navLinks)[number];

/** CTA del header. */
export const ctaLink = {
  label: "Hablemos",
  href: "#contacto",
} as const;

/** Logotipo por tema. Mismas dimensiones intrínsecas: cero layout shift. */
export const logo = {
  claro: "/yisoft_logo_transparente_claro.png",
  oscuro: "/yisoft_logo_transparente_oscuro.png",
  width: 2400,
  height: 700,
  alt: "YiSoft",
} as const;
