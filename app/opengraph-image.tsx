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

/**
 * El lockup se incrusta como data URI del SVG real, no se redibuja con
 * tipografía: así la vista previa social usa exactamente el mismo vector que
 * el sitio, con las letras ya convertidas a trazos (satori no tendría que
 * resolver ninguna fuente para ellas).
 *
 * Va la variante oscura porque el lienzo de la tarjeta es #101820.
 */
async function cargarLockup() {
  const svg = await readFile(
    join(process.cwd(), "public", "yisoft_dev_logo_oscuro.svg"),
  );
  return `data:image/svg+xml;base64,${svg.toString("base64")}`;
}

/* Ancho de dibujo del lockup en la tarjeta. El alto sale de la proporción
   2.643:1 del viewBox, así que nunca se deforma ni se corta. */
const LOCKUP_ANCHO = 560;
const LOCKUP_ALTO = Math.round((LOCKUP_ANCHO * 1833) / 4845);

export default async function OpengraphImage() {
  const [extraBold, bold, lockup] = await Promise.all([
    cargarFuente("Montserrat-ExtraBold.ttf"),
    cargarFuente("Montserrat-Bold.ttf"),
    cargarLockup(),
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

        {/* Lockup + titular social */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <img
            src={lockup}
            alt={site.name}
            width={LOCKUP_ANCHO}
            height={LOCKUP_ALTO}
            style={{ display: "flex" }}
          />

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
