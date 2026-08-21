import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * El apex redirige 301 al www, que es la versión canónica. Sin esto el
   * mismo contenido vive en dos hosts y la autoridad de dominio se parte
   * entre ambos.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "yisoft-development.com" }],
        destination: "https://www.yisoft-development.com/:path*",
        // 301 explícito: `permanent: true` emitiría 308. Google los trata
        // igual, pero varios crawlers y auditorías SEO solo esperan 301.
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
