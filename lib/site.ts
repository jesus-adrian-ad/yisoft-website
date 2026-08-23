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
  /** Marca en prosa. Ver la nota junto al valor. */
  readonly nameCorto: string;
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
  readonly problema: {
    readonly eyebrow: string;
    readonly titulo: string;
    /** Apunte de cierre. Va bajo el título, en la columna fija. */
    readonly nota: string;
    readonly escenas: readonly {
      /** Ordinal visible ("01"…"05"). Decorativo: el orden real lo da el <ol>. */
      readonly n: string;
      readonly titulo: string;
      readonly texto: string;
    }[];
  };
  readonly solucion: {
    readonly eyebrow: string;
    readonly titulo: string;
    readonly subtitulo: string;
    /** Fragmento exacto del pilar 02 que va resaltado. Único de la sección. */
    readonly resalte: string;
    readonly pilares: readonly {
      /** Ordinal visible ("01"…"03"). Decorativo: el orden lo da el <ol>. */
      readonly n: string;
      readonly titulo: string;
      readonly texto: string;
      /**
       * Ordinales de `problema.escenas` que este pilar resuelve. Cada uno se
       * convierte en un enlace a `#problema-<n>`; el texto accesible sale del
       * título real de la escena, así que no hay copy duplicado.
       */
      readonly resuelve: readonly string[];
    }[];
  };
  readonly servicios: {
    readonly eyebrow: string;
    readonly titulo: string;
    readonly subtitulo: string;
    /** Aviso de alcance. Va una sola vez, al pie de la sección. */
    readonly nota: string;
    /** Fragmento exacto del servicio 02 que va resaltado. Único de la sección. */
    readonly resalte: string;
    readonly items: readonly {
      /** Ordinal visible ("01"…"05"). Decorativo: el orden lo da el <ol>. */
      readonly n: string;
      readonly titulo: string;
      readonly texto: string;
      /**
       * Lo que se entrega. El ÚLTIMO siempre es el cierre abierto ("Y más,
       * según tu operación") y se pinta distinto por su posición, no por una
       * bandera: si deja de ir al final, deja de ser el cierre.
       */
      readonly entregables: readonly string[];
    }[];
  };
  readonly proceso: {
    readonly eyebrow: string;
    readonly titulo: string;
    readonly subtitulo: string;
    readonly pasos: readonly {
      /** Ordinal visible ("01"…"05"). Decorativo: el orden lo da el <ol>. */
      readonly n: string;
      readonly titulo: string;
      readonly texto: string;
    }[];
    /** Franja de cierre: lo que pasa DESPUÉS de entregar. */
    readonly cierre: {
      readonly titulo: string;
      /**
       * Los dos compromisos posteriores a la entrega. Sus títulos NO son
       * encabezados en el DOM: irían como h4 sueltos y ensuciarían el esquema.
       */
      readonly bloques: readonly {
        readonly titulo: string;
        readonly texto: string;
      }[];
      /** Nota al pie de la franja. Una línea, y se cita literal. */
      readonly nota: string;
    };
  };
  readonly contacto: {
    readonly eyebrow: string;
    readonly titulo: string;
    readonly subtitulo: string;
    /** Va con peso visual propio: es la promesa concreta de la sección. */
    readonly expectativa: string;
    /** Salida alternativa al formulario. Nunca se esconde tras el envío. */
    readonly directo: {
      readonly titulo: string;
      readonly whatsapp: {
        readonly label: string;
        readonly href: string;
        /** Advierte que abre en ventana nueva. */
        readonly aria: string;
      };
      readonly correoPrefijo: string;
    };
    readonly formulario: {
      readonly campos: {
        readonly nombre: { readonly label: string; readonly ayuda?: string };
        readonly correo: { readonly label: string; readonly ayuda: string };
        readonly necesidad: {
          readonly label: string;
          readonly vacia: string;
        };
        readonly mensaje: { readonly label: string; readonly ayuda: string };
      };
      /**
       * Opciones del select. `valor` es lo que viaja al servidor y alimenta el
       * enum de validación; `label` es lo que se ve. No se derivan uno del
       * otro para que cambiar el texto visible no invalide envíos anteriores.
       */
      readonly opciones: readonly {
        readonly valor: string;
        readonly label: string;
      }[];
      readonly boton: string;
      readonly botonEnviando: string;
    };
    /**
     * El consentimiento. El texto de apoyo NO es decorativo: es lo que hace
     * válida la casilla, así que se cita completo y a la vista.
     */
    readonly privacidad: {
      readonly aceptacion: string;
      readonly apoyo: string;
    };
    readonly exito: {
      readonly titulo: string;
      /** `{nombre}` se sustituye por lo que la persona escribió. */
      readonly texto: string;
    };
    /** Siempre lleva salida alternativa: correo y teléfono a la vista. */
    readonly error: {
      readonly texto: string;
      readonly telefonoVisible: string;
    };
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
  name: "YiSoft Development",
  /** Para la prosa: en el texto corrido la marca se sigue diciendo "YiSoft".
      El nombre completo queda para la identidad (og:site_name, JSON-LD,
      application-name, publisher y la etiqueta del logo). */
  nameCorto: "YiSoft",
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
   * Copy de "El problema".
   *
   * REGLA DE CONTENIDO: aquí se describe la vida del cliente, NO el catálogo
   * de YiSoft. Ninguna escena puede nombrar un producto, una tecnología ni una
   * solución —CRM, dashboard, sistema de inventario, IA, automatización,
   * landing page—: esas palabras son de Solución y Servicios. Tampoco hay
   * cifras ni porcentajes, porque no hay de dónde sacarlos.
   */
  problema: {
    eyebrow: "El problema",
    titulo: "¿Algo de esto te suena?",
    nota:
      "Si reconociste dos o más, no es que tu negocio funcione mal. Es que está creciendo sin las herramientas para sostenerlo.",
    escenas: [
      {
        n: "01",
        titulo: "El inventario vive en un cuaderno",
        texto:
          "Las entradas y salidas se anotan a mano, y el número real solo existe en la cabeza de quien las anotó. Cuando quieres saber qué se movió este mes, hay que volver a contarlo.",
      },
      {
        n: "02",
        titulo: "Los números del mes se arman a mano",
        texto:
          "Cada corte, cada factura y cada reporte para el contador sale de juntar papeles y sumar en una hoja. Es trabajo que tu negocio ya hizo una vez, repetido.",
      },
      {
        n: "03",
        titulo: "Hay trabajo que nadie debería estar haciendo",
        texto:
          "Alguien pasa media mañana copiando datos de un correo a una hoja, respondiendo las mismas cinco preguntas por WhatsApp, o clasificando pedidos uno por uno. Es trabajo que se repite idéntico todos los días.",
      },
      {
        n: "04",
        titulo: "Todos pueden ver todo",
        texto:
          "El sistema que usas no distingue entre quien vende y quien administra. Cualquiera consulta costos, edita precios o borra un registro — y no queda rastro de quién fue.",
      },
      {
        n: "05",
        titulo: "Tu negocio existe, pero en internet no",
        texto:
          "Tienes producto, tienes clientes y tienes Instagram. Pero cuando alguien pregunta '¿dónde veo lo que venden?', no hay a dónde mandarlo. Un perfil con fotos sueltas no es un catálogo, y no aparece cuando te buscan en Google.",
      },
    ],
  },

  /**
   * Copy de "La solución".
   *
   * REGLA DE CONTENIDO: cada afirmación de aquí es un compromiso comercial.
   * No se agregan pilares, viñetas, features, tecnologías ni herramientas que
   * no estén en este objeto, y no hay cifras, porcentajes ni tiempos de
   * entrega. Si no está escrito aquí, no se ofrece.
   *
   * `resuelve` amarra esta sección con "El problema": son los ordinales de
   * las escenas que cada pilar resuelve, y viajan como enlaces reales.
   */
  solucion: {
    eyebrow: "La solución",
    titulo: "Tres formas de quitarle peso a tu operación",
    subtitulo:
      "No hace falta cambiar cómo trabajas. Hace falta que el software lo sostenga.",
    // Único resalte de la sección: si se resaltan dos cosas, no se resaltó ninguna.
    resalte: "inteligencia artificial",
    pilares: [
      {
        n: "01",
        titulo: "Un solo lugar donde vive tu operación",
        texto:
          "Inventario, clientes y ventas en un sistema hecho para cómo trabaja tu negocio. Cada movimiento queda registrado al momento, los reportes del mes se descargan en vez de armarse, y cada persona ve solo lo que le toca ver — con rastro de quién hizo qué.",
        resuelve: ["01", "02", "04"],
      },
      {
        n: "02",
        titulo: "El trabajo repetitivo, hecho por software",
        texto:
          "Automatizamos las tareas que se repiten idénticas todos los días: capturar datos que llegan por correo, clasificar pedidos, responder las preguntas de siempre. Donde hace falta criterio y no solo reglas, usamos inteligencia artificial — para leer documentos, ordenar información o redactar respuestas. No para reemplazar a tu equipo, sino para devolverle las horas que hoy se van en copiar y pegar.",
        resuelve: ["03"],
      },
      {
        n: "03",
        titulo: "Un lugar a donde mandar a tus clientes",
        texto:
          "Una página que muestra lo que vendes, aparece cuando te buscan en Google y convierte al visitante en una conversación. Rápida, hecha a la medida, y tuya — no una plantilla alquilada.",
        resuelve: ["05"],
      },
    ],
  },

  /**
   * Copy de "Servicios".
   *
   * REGLA DE CONTENIDO: cada línea es un compromiso comercial. No se agregan
   * servicios, entregables, tecnologías, plazos ni precios que no estén aquí.
   *
   * Y una regla más, que es la que se rompe sola: este copy describe QUÉ se
   * construye, nunca cuántas veces se ha construido. Nada de "con experiencia
   * en", "hemos entregado", "años haciendo", contadores de proyectos, logos ni
   * nombres de clientes — tampoco para la inteligencia artificial.
   */
  servicios: {
    eyebrow: "Servicios",
    titulo: "Qué construimos",
    subtitulo:
      "Cada proyecto se arma a la medida. Esto es lo que normalmente incluye.",
    nota: "El alcance final de cada proyecto se define en la propuesta.",
    // Único resalte de la sección: si se resaltan dos cosas, no se resaltó ninguna.
    resalte: "inteligencia artificial",
    items: [
      {
        n: "01",
        titulo: "Sistema de gestión a la medida",
        texto:
          "Inventario, clientes y ventas en un solo sistema. Control de accesos por persona, historial de cada movimiento, y reportes que se descargan listos para tu contador.",
        entregables: [
          "Sistema web",
          "Panel de administración",
          "Roles y permisos",
          "Exportación a Excel y PDF",
          "Capacitación a tu equipo",
          "Y más, según tu operación",
        ],
      },
      {
        n: "02",
        titulo: "Automatización de procesos",
        texto:
          "Conectamos lo que ya usas y quitamos del camino el trabajo repetitivo. Donde hace falta criterio y no solo reglas, entra la inteligencia artificial: leer documentos, clasificar, redactar.",
        entregables: [
          "Flujos funcionando en tu operación",
          "Documentación de qué hace cada uno",
          "Monitoreo de fallas",
          "Y más, según tu operación",
        ],
      },
      {
        n: "03",
        titulo: "Landing pages y sitios web",
        texto:
          "Una página rápida, hecha a la medida, que aparece en Google y convierte visitas en conversaciones. No una plantilla alquilada.",
        entregables: [
          "Diseño propio",
          "Optimización para buscadores",
          "Formulario de contacto",
          "Analítica",
          "Despliegue y dominio",
          "Y más, según tu operación",
        ],
      },
      {
        n: "04",
        titulo: "Integraciones y APIs",
        texto:
          "Que tus sistemas se hablen entre ellos. Facturación, punto de venta, tienda en línea, o lo que ya tengas funcionando.",
        entregables: [
          "Integración construida y probada",
          "Documentación técnica",
          "Manejo de errores para que nada se pierda en silencio",
          "Y más, según tu operación",
        ],
      },
      {
        n: "05",
        titulo: "Tiendas y ecommerce",
        texto:
          "Vender en línea sin entregarle una comisión a una plataforma por cada venta. Catálogo, carrito y pedidos conectados a tu inventario real.",
        entregables: [
          "Tienda en línea",
          "Pasarela de pagos",
          "Panel de pedidos",
          "Conexión con tu sistema de inventario",
          "Y más, según tu operación",
        ],
      },
    ],
  },

  /**
   * Copy de "Proceso".
   *
   * REGLA DE CONTENIDO, la más estricta de la página: cada línea de aquí es un
   * compromiso CONTRACTUAL. No se agregan pasos, plazos, precios, tiempos de
   * respuesta, SLAs ni promesas de disponibilidad que no estén en este objeto.
   * Los "90 días" de garantía son 90 días: ni otro número, ni suavizados con
   * un "hasta". Y la nota de cierre está redactada así a propósito —ni más
   * agresiva ni más vaga—, así que se cita literal.
   *
   * Tampoco hay testimonios, casos ni cifras de proyectos entregados: eso no
   * se inventa, y aquí no hay de dónde sacarlo.
   */
  proceso: {
    eyebrow: "Cómo trabajamos",
    titulo: "De la primera plática al sistema funcionando",
    subtitulo: "Sin sorpresas en el camino y sin sorpresas en la factura.",
    pasos: [
      {
        n: "01",
        titulo: "Conversación",
        texto:
          "Nos cuentas cómo opera tu negocio y qué te está costando trabajo. Las sesiones para entender el problema son sin costo y sin compromiso. Si no somos lo que necesitas, te lo decimos ahí mismo.",
      },
      {
        n: "02",
        titulo: "Propuesta y acuerdo",
        texto:
          "Con el problema claro, te entregamos un documento con el alcance, las tareas desglosadas, el tiempo estimado y el precio. Nada empieza hasta que ambos estemos de acuerdo por escrito.",
      },
      {
        n: "03",
        titulo: "Análisis a detalle",
        texto:
          "Ya con el proyecto en marcha, trabajamos contigo para aterrizar cada requerimiento: cómo funciona hoy ese proceso, quién lo usa, qué casos raros existen. Esta parte es acompañada — no te dejamos llenar un formato solo.",
      },
      {
        n: "04",
        titulo: "Construcción con avances visibles",
        texto:
          "No desaparecemos un mes para reaparecer con una sorpresa. Ves el sistema funcionando por partes, opinas sobre lo real y corregimos el rumbo temprano, cuando todavía es barato.",
      },
      {
        n: "05",
        titulo: "Entrega y capacitación",
        texto:
          "El sistema queda funcionando en tu operación, tu equipo sabe usarlo, y te entregamos la documentación de lo que se construyó.",
      },
    ],
    cierre: {
      titulo: "Y después de entregar",
      bloques: [
        {
          titulo: "90 días de garantía",
          texto:
            "Si algo no funciona como lo acordamos, lo arreglamos sin costo. Los errores son nuestros, no tuyos.",
        },
        {
          titulo: "Soporte y mantenimiento",
          texto:
            "Para sistemas que viven y crecen, un plan mensual con soporte, mantenimiento y mejoras. Se contrata por un año y se renueva si te sirve.",
        },
      ],
      nota: "Lo que cambia el alcance acordado se cotiza como un requerimiento nuevo — y lo sabrás antes de que empecemos a trabajarlo, nunca en la factura.",
    },
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
  ],

  /* -------------------------------------------------------------------------
     "Hablemos": última sección de contenido.

     Los cinco campos del formulario son una decisión, no un descuido. No hay
     presupuesto, teléfono, empresa ni "cómo nos encontraste": cada campo de
     más es gente que abandona, y ninguno de esos cambia con qué se responde.
  ------------------------------------------------------------------------- */
  contacto: {
    eyebrow: "Contacto",
    titulo: "Hablemos",
    subtitulo:
      "Cuéntanos qué está pasando en tu operación. La primera plática es sin costo y sin compromiso.",
    expectativa: "Te respondemos a la brevedad.",

    directo: {
      titulo: "¿Prefieres escribir directo?",
      whatsapp: {
        label: "Escríbenos por WhatsApp",
        href: "https://wa.me/528186580644?text=Hola%2C%20me%20interesa%20trabajar%20con%20YiSoft",
        aria: "Escríbenos por WhatsApp (abre en una ventana nueva)",
      },
      correoPrefijo: "O al correo",
    },

    formulario: {
      campos: {
        nombre: { label: "Nombre" },
        correo: {
          label: "Correo",
          ayuda: "Ahí te respondemos.",
        },
        necesidad: {
          label: "Qué necesitas",
          vacia: "Elige una opción",
        },
        mensaje: {
          label: "Mensaje",
          ayuda: "Qué hace tu negocio hoy y qué te gustaría que hiciera.",
        },
      },
      opciones: [
        { valor: "sistema-gestion", label: "Sistema de gestión" },
        { valor: "automatizacion", label: "Automatización de procesos" },
        { valor: "landing", label: "Landing page o sitio web" },
        { valor: "integracion", label: "Integración con otro sistema" },
        { valor: "tienda", label: "Tienda en línea" },
        { valor: "no-lo-se", label: "Aún no lo sé" },
      ],
      boton: "Enviar mensaje",
      botonEnviando: "Enviando…",
    },

    privacidad: {
      aceptacion: "Acepto que YiSoft use mis datos para responder a este mensaje.",
      apoyo:
        "Solo recabamos tu nombre, correo y mensaje, y los usamos únicamente para contestarte. No los compartimos con terceros ni los usamos para publicidad. Si quieres que los borremos, escríbenos y lo hacemos.",
    },

    exito: {
      titulo: "Mensaje recibido",
      texto:
        "Gracias, {nombre}. Te respondemos a la brevedad. Si es urgente, escríbenos por WhatsApp.",
    },

    error: {
      texto:
        "No pudimos enviar tu mensaje. Escríbenos directo a jesus-adrian@yisoft-development.com o por WhatsApp al 81 8658 0644.",
      telefonoVisible: "81 8658 0644",
    },
  },

  /** CTA del header. */
  cta: { label: "Hablemos", href: "#contacto" },

  contact: {
    email: "jesus-adrian@yisoft-development.com",
    /** E.164, como lo pide schema.org. Para mostrarlo: `contacto.error.telefonoVisible`. */
    whatsapp: "+528186580644",
  },

  ogImage: `${SITE_URL}/opengraph-image`,
  /* Logo raster para datos estructurados: los consumidores de JSON-LD no
     rasterizan SVG. Apuntaba a /logo.png, un archivo que nunca existió en el
     proyecto. */
  logo: `${SITE_URL}/yisoft_dev_logo.png`,
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
  { id: "contacto", label: "Contacto" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
