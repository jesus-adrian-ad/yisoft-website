import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { site } from "@/lib/site";
import Header from "@/components/layout/Header";
import JsonLd from "@/components/layout/JsonLd";
import LenisProvider from "@/components/layout/LenisProvider";
import ScrollProgress from "@/components/layout/ScrollProgress";
import ThemeScript from "@/components/layout/ThemeScript";

/* Tipografías auto-hospedadas por next/font: ni un request a Google en producción. */
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),

  /* SEO: lo que ve Google. El title NO lleva sufijo de marca — Google lo
     añade solo a partir de openGraph.siteName. */
  title: {
    default: site.seo.title,
    template: site.seo.titleTemplate,
  },
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  authors: [{ name: site.author, url: site.url }],
  creator: site.author,
  publisher: site.name,
  applicationName: site.name,
  alternates: {
    canonical: "/",
  },

  /* Open Graph: textos propios, deliberadamente distintos a los de SEO.
     Heredarlos hacía que la vista previa se leyera como una ficha técnica. */
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: site.url,
    title: site.social.ogTitle,
    description: site.social.ogDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: site.social.ogTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.social.ogTitle,
    description: site.social.ogDescription,
    creator: site.author,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /* Sin `icons` a mano. Los íconos ahora son archivos estáticos
     (app/icon.png y app/apple-icon.png) y Next inyecta sus <link> solo, con
     la ruta versionada correcta. Declararlos aquí como "/icon" apuntaba a una
     ruta que ya no existe: los estáticos se sirven en /icon.png. */
  category: "technology",
};

export const viewport: Viewport = {
  // `cover` deja que el fondo llegue bajo el notch; el padding de safe-area
  // en globals.css evita que el contenido quede tapado.
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F9FA" },
    { media: "(prefers-color-scheme: dark)", color: "#101820" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={site.lang}
      className={`${montserrat.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <JsonLd />
      </head>
      <body className="antialiased">
        <a href="#contenido" className="skip-link">
          Saltar al contenido
        </a>
        {/* LenisProvider es cliente, pero `children` sigue renderizándose en
            el servidor: solo se comparte la instancia por contexto. */}
        <LenisProvider>
          <ScrollProgress />
          <Header />
          {children}
        </LenisProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
