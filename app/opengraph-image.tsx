import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_DOMINIO, site } from "@/lib/site";

export const alt = `${site.name} — ${site.social.ogTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Montserrat vive en /assets: se lee en build, no hay red en producción. */
async function cargarFuente(archivo: string) {
  return readFile(join(process.cwd(), "assets", archivo));
}

export default async function OpengraphImage() {
  const [extraBold, bold] = await Promise.all([
    cargarFuente("Montserrat-ExtraBold.ttf"),
    cargarFuente("Montserrat-Bold.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#101820",
          padding: "72px 80px",
          fontFamily: "Montserrat",
          position: "relative",
        }}
      >
        {/* Halo verde de fondo */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle, #2EC48633 0%, #10182000 70%)",
            display: "flex",
          }}
        />

        {/* Etiqueta superior */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 14,
              backgroundColor: "#2EC486",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 4,
              color: "#9FB3BF",
              textTransform: "uppercase",
            }}
          >
            Desarrollo de software
          </div>
        </div>

        {/* Wordmark + titular social */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 140,
              fontWeight: 800,
              letterSpacing: -6,
              lineHeight: 1,
              color: "#FFFFFF",
            }}
          >
            <span>Yi</span>
            <span style={{ color: "#2EC486" }}>Soft</span>
          </div>

          <div
            style={{
              width: 132,
              height: 8,
              borderRadius: 8,
              backgroundColor: "#2EC486",
              marginTop: 28,
              marginBottom: 28,
              display: "flex",
            }}
          />

          {/* El titular de Open Graph, NO el de SEO. A 46px sobre 900px de
              ancho útil cabe en dos líneas: satori parte por espacios, así
              que nunca corta una palabra a la mitad. */}
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              fontSize: 46,
              fontWeight: 700,
              lineHeight: 1.25,
              color: "#E8EDF0",
              letterSpacing: -1,
            }}
          >
            {site.social.ogTitle}
          </div>
        </div>

        {/* Pie */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            fontWeight: 700,
            color: "#9FB3BF",
          }}
        >
          <div style={{ display: "flex" }}>{SITE_DOMINIO}</div>
          <div style={{ display: "flex" }}>Monterrey, N.L.</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Montserrat", data: extraBold, weight: 800, style: "normal" },
        { name: "Montserrat", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
