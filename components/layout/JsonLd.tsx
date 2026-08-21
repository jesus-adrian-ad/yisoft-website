import { siteConfig } from "@/lib/site";

/** Escapa `<` para que el JSON nunca pueda cerrar la etiqueta <script>. */
function serializar(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

const professionalService = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteConfig.url}/#organizacion`,
  name: siteConfig.name,
  description:
    "Desarrollo de sistemas de gestión, APIs, automatización e integración de datos.",
  url: siteConfig.url,
  logo: siteConfig.logo,
  image: siteConfig.ogImage,
  slogan: siteConfig.slogan,
  areaServed: siteConfig.areaServed.map((name) => ({
    "@type": "Place",
    name,
  })),
  founder: {
    "@type": "Person",
    name: siteConfig.author,
    jobTitle: siteConfig.authorRole,
  },
  serviceType: [...siteConfig.serviceType],
  email: siteConfig.contact.email,
  inLanguage: "es-MX",
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
