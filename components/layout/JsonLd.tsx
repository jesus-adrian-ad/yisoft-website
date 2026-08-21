import { site } from "@/lib/site";

/** Escapa `<` para que el JSON nunca pueda cerrar la etiqueta <script>. */
function serializar(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const professionalService = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organizacion`,
  name: site.name,
  description: site.seo.description,
  url: site.url,
  logo: site.logo,
  image: site.ogImage,
  slogan: site.slogan,
  areaServed: site.areaServed.map((name) => ({
    "@type": "Place",
    name,
  })),
  founder: {
    "@type": "Person",
    name: site.author,
    jobTitle: site.authorRole,
  },
  serviceType: [...site.serviceType],
  // Solo se publica el contacto cuando existe: un `email: ""` es dato inválido.
  ...(site.contact.email ? { email: site.contact.email } : {}),
  inLanguage: site.lang,
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializar(professionalService) }}
    />
  );
}

export default JsonLd;
