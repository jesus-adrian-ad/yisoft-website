/**
 * Única fuente de verdad del sitio. Cambiar aquí se propaga a metadatos,
 * sitemap, robots, JSON-LD, la imagen de Open Graph y el nav.
 *
 * Los textos viven separados a propósito:
 *  - `seo`    → lo que lee Google (title/description del SERP).
 *  - `social` → lo que lee la vista previa al compartir (WhatsApp, X, Slack).
 * No se heredan entre sí: el SERP premia precisión y palabras clave, la vista
 * previa premia que se lea humano.
 */

/** Versión canónica: CON www. El apex redirige 301 desde next.config.ts. */
export const SITE_URL = "https://www.yisoft-development.com";

/** Dominio sin protocolo, para mostrarlo como texto (pie de la imagen OG). */
export const SITE_DOMINIO = "www.yisoft-development.com";

type Site = {
  readonly url: string;
  readonly name: string;
  readonly slogan: string;
  readonly locale: string;
  readonly lang: string;
  readonly author: string;
  readonly authorRole: string;
  readonly areaServed: readonly string[];
  readonly serviceType: readonly string[];
  readonly seo: {
    readonly title: string;
    readonly titleTemplate: string;
    readonly description: string;
    readonly keywords: readonly string[];
  };
  readonly social: {
    readonly ogTitle: string;
    readonly ogDescription: string;
  };
  readonly hero: {
    readonly badge: string;
    readonly titulo: readonly [string, string];
    readonly subtitulo: string;
    readonly ctas: readonly {
      readonly label: string;
      readonly href: string;
      readonly variante: "primaria" | "secundaria";
      /** Etiqueta del evento de analítica (snake_case). */
      readonly evento: string;
    }[];
  };
  readonly nosotros: {
    readonly eyebrow: string;
    readonly titulo: readonly [string, string];
    readonly parrafo1: string;
    readonly parrafo2: string;
    /** Fragmento exacto de `parrafo2` que va resaltado. */
    readonly resalte: string;
    readonly credencial: string;
  };
  readonly nav: readonly { readonly id: string; readonly label: string; readonly href: string }[];
  readonly cta: { readonly label: string; readonly href: string };
  readonly contact: {
    readonly email: string;
    readonly whatsapp: string;
  };
  readonly ogImage: string;
  readonly logo: string;
};

export const site = {
  url: SITE_URL,
  name: "YiSoft",
  slogan: "Páginas web y sistemas para tu negocio",
  locale: "es_MX",
  lang: "es-MX",
  author: "Jesús Adrián",
  authorRole: "Desarrollador de software",
  areaServed: ["Monterrey", "Nuevo León", "México"],
  serviceType: [
    "Desarrollo web",
    "Desarrollo de APIs y sistemas",
    "Automatización de procesos",
    "Integración de datos",
  ],

  /* --- Google: title sin sufijo de marca (lo añade solo desde og:site_name) --- */
  seo: {
    title: "Sistemas de inventario, clientes, ventas y landings",
    titleTemplate: "%s | YiSoft",
    description:
      "YiSoft conecta las áreas y sucursales de tu empresa en un solo sistema: inventario, clientes y ventas al día. También landings que sí venden.",
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
  },

  /* --- Vista previa al compartir: tono humano, distinto al del SERP --- */
  social: {
    ogTitle: "Tu inventario, tus clientes y tus ventas, en un solo lugar",
    ogDescription:
      "Sistemas de gestión y landings a la medida para empresas que operan desconectadas.",
  },

  /**
   * Copy del hero. Vive aquí y no en el JSX para que el texto de portada se
   * pueda revisar sin abrir un componente.
   */
  hero: {
    badge: "Disponible para nuevos proyectos",
    // Dos líneas separadas a propósito: cada una se revela por su cuenta y la
    // segunda va en un tono más apagado para crear jerarquía dentro del h1.
    titulo: [
      "Tu inventario, tus clientes y tus ventas.",
      "Al fin en el mismo lugar.",
    ],
    subtitulo:
      "Sistemas a la medida para empresas con varias áreas o sucursales que hoy operan a ciegas.",
    ctas: [
      { label: "Hablemos", href: "#contacto", variante: "primaria", evento: "hablemos" },
      { label: "Ver cómo trabajamos", href: "#proceso", variante: "secundaria", evento: "ver_proceso" },
    ],
  },

  /**
   * Copy de "Quiénes somos".
   *
   * Voz de marca en plural: habla de lo que hacemos y de lo que pensamos,
   * nunca de cuántos somos. Aquí no va ninguna cifra verificable —tamaño de
   * equipo, número de clientes, años concretos— ni nombres de empresas.
   */
  nosotros: {
    eyebrow: "Quiénes somos",
    // Dos líneas: la segunda es la afirmación que carga el peso visual.
    titulo: [
      "Tu negocio ya sabe cómo trabajar.",
      "El software debería adaptarse a eso.",
    ],
    parrafo1:
      "La mayoría de los sistemas del mercado te piden lo contrario: cambia tu forma de operar para que quepa en el programa.",
    parrafo2:
      "En YiSoft lo hacemos al revés. Estudiamos cómo funciona tu negocio y construimos el sistema alrededor — gestión de inventario, clientes, ventas, o la landing que te dé a conocer.",
    // Único resalte de la sección: si se resaltan dos cosas, no se resaltó ninguna.
    resalte: "lo hacemos al revés",
    credencial:
      "Años construyendo sistemas de gestión interna para el sector bancario, y landings para negocios que necesitan darse a conocer.",
  },

  /**
   * Enlaces del nav principal. Los consumen el nav de escritorio, el menú
   * móvil y el scroll-spy.
   */
  nav: [
    { id: "problema", label: "Problema", href: "#problema" },
    { id: "solucion", label: "Solución", href: "#solucion" },
    { id: "servicios", label: "Servicios", href: "#servicios" },
    { id: "proceso", label: "Proceso", href: "#proceso" },
    { id: "casos", label: "Casos", href: "#casos" },
  ],

  /** CTA del header. */
  cta: { label: "Hablemos", href: "#contacto" },

  /** Vacíos hasta tener los datos reales: nada apunta a un contacto inventado. */
  contact: {
    email: "",
    whatsapp: "",
  },

  ogImage: `${SITE_URL}/opengraph-image`,
  logo: `${SITE_URL}/logo.png`,
} as const satisfies Site;

export type NavLink = (typeof site.nav)[number];

/** Secciones de la landing, en orden. Usadas por page.tsx. */
export const sections = [
  { id: "inicio", label: "Inicio" },
  { id: "nosotros", label: "Quiénes somos" },
  { id: "problema", label: "Problema" },
  { id: "solucion", label: "Solución" },
  { id: "servicios", label: "Servicios" },
  { id: "proceso", label: "Proceso" },
  { id: "casos", label: "Casos" },
  { id: "contacto", label: "Contacto" },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/**
 * Logotipo por tema.
 *
 * Se sirve como `background-image` y no como <img> a propósito: el navegador
 * descarga SOLO el fondo que la hoja de estilos acaba aplicando, mientras que
 * dos <img> se bajan siempre los dos aunque uno esté oculto por CSS.
 *
 * Los archivos son de 411px de ancho —3x del tamaño máximo de uso (137px)— en
 * vez del original de 2400px. El header nunca necesitó más.
 */
export const logo = {
  claro: "/yisoft_logo_claro_411.webp",
  oscuro: "/yisoft_logo_oscuro_411.webp",
  /** Tamaño intrínseco del archivo, para reservar la caja sin layout shift. */
  width: 411,
  height: 120,
  alt: "YiSoft",
} as const;
