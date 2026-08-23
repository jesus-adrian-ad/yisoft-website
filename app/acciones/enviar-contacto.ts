"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { site } from "@/lib/site";
import {
  aBooleano,
  aErrores,
  CAMPO_MARCA,
  CAMPO_TRAMPA,
  esquemaContacto,
  type EstadoContacto,
  type ValoresContacto,
} from "@/lib/validacion";

/** Un humano no llena cinco campos en menos de esto. */
const MINIMO_MS = 3000;

/* ---------------------------------------------------------------------------
   Límite por IP

   Tres envíos por hora. Vive en memoria del proceso a propósito: es la
   solución proporcional al tráfico de una landing.

   LIMITACIONES, y son reales:
   - Se reinicia en cada despliegue, así que un atacante con paciencia espera
     al siguiente deploy.
   - No se comparte entre instancias: con varias regiones o funciones en
     paralelo, cada una lleva su propia cuenta y el límite efectivo se
     multiplica.
   El día que el tráfico lo justifique, esto se muda a almacenamiento
   persistente (Upstash/Redis o la tabla que toque) SIN cambiar la firma de
   `dentroDelLimite`.
--------------------------------------------------------------------------- */
const VENTANA_MS = 60 * 60 * 1000;
const MAXIMO_POR_VENTANA = 3;

const envios = new Map<string, number[]>();

function dentroDelLimite(ip: string): boolean {
  const ahora = Date.now();
  const recientes = (envios.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);

  if (recientes.length >= MAXIMO_POR_VENTANA) {
    envios.set(ip, recientes);
    return false;
  }

  recientes.push(ahora);
  envios.set(ip, recientes);

  /* Limpieza oportunista: sin esto el Map crece sin techo en un proceso de
     larga vida. Se hace aquí y no con un setInterval porque un temporizador
     mantendría vivo el proceso en entornos serverless. */
  if (envios.size > 500) {
    for (const [clave, marcas] of envios) {
      if (marcas.every((t) => ahora - t >= VENTANA_MS)) envios.delete(clave);
    }
  }

  return true;
}

/**
 * Devuelve el cupo consumido por un intento que falló POR NUESTRA CULPA
 * (variables sin configurar, Resend caído). Sin esto, tres reintentos ante una
 * caída nuestra dejarían a la persona sin poder escribir durante una hora,
 * castigándola por un problema que no es suyo. Un envío que sí sale, o un
 * intento que pasa la validación y llega al servicio, sigue contando.
 */
function devolverCupo(ip: string): void {
  const recientes = envios.get(ip);
  if (recientes?.length) recientes.pop();
}

async function obtenerIp(): Promise<string> {
  const h = await headers();
  /* El primero de x-forwarded-for es el cliente; el resto son los proxies. */
  const reenviada = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return reenviada || h.get("x-real-ip") || "desconocida";
}

/* ---------------------------------------------------------------------------
   Correo
--------------------------------------------------------------------------- */

/** Escapa lo que va dentro del HTML del correo. El contenido lo escribe un
    desconocido: sin esto, un mensaje con `<script>` viajaría tal cual al
    cliente de correo. */
function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escapa y convierte saltos de línea en <br>, en ese orden. */
function escaparParrafo(texto: string): string {
  return escapar(texto).replace(/\r?\n/g, "<br>");
}

/** Fecha y hora en la zona en la que se opera, no en UTC del servidor. */
function selloDeTiempo(): string {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Monterrey",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());
}

/** Etiqueta visible del select, para que el asunto se lea en español. */
function etiquetaNecesidad(valor: string): string {
  return (
    site.contacto.formulario.opciones.find((o) => o.valor === valor)?.label ??
    valor
  );
}

/* ---------------------------------------------------------------------------
   Acción
--------------------------------------------------------------------------- */

const MENSAJE_ERROR = site.contacto.error.texto;

const MENSAJE_LIMITE =
  `Ya recibimos varios mensajes desde aquí en la última hora. ` +
  `Si es urgente, escríbenos por WhatsApp al ${site.contacto.error.telefonoVisible}.`;

/**
 * Recibe el formulario de contacto.
 *
 * La firma es la de `useActionState` (estado previo + FormData). Next la
 * conecta igual cuando el formulario se envía sin JavaScript, así que el mismo
 * código sirve para los dos caminos.
 */
export async function enviarContacto(
  _estadoPrevio: EstadoContacto,
  formData: FormData,
): Promise<EstadoContacto> {
  const valores: ValoresContacto = {
    nombre: String(formData.get("nombre") ?? "").trim(),
    correo: String(formData.get("correo") ?? "").trim(),
    necesidad: String(formData.get("necesidad") ?? ""),
    mensaje: String(formData.get("mensaje") ?? "").trim(),
    aceptacion: aBooleano(formData.get("aceptacion")),
  };

  /* --- Capa 1: el campo trampa ---
     Está fuera de pantalla y con tabindex -1, así que una persona no puede
     llenarlo ni con teclado. Se responde `ok` en vez de un error: al bot no se
     le avisa que lo cacharon, y así no aprende a evitar la trampa. */
  if (String(formData.get(CAMPO_TRAMPA) ?? "").length > 0) {
    return { estado: "ok", nombre: valores.nombre, tipo: valores.necesidad };
  }

  /* --- Capa 2: velocidad ---
     La marca la escribe el cliente al montar. Si NO viene (JavaScript
     apagado), no se descarta nada: preferimos dejar pasar un bot antes que
     rechazar a una persona real que navega sin JS. */
  const marca = Number(formData.get(CAMPO_MARCA));
  if (Number.isFinite(marca) && marca > 0 && Date.now() - marca < MINIMO_MS) {
    return { estado: "ok", nombre: valores.nombre, tipo: valores.necesidad };
  }

  /* --- Validación, la misma que corrió el cliente --- */
  const resultado = esquemaContacto.safeParse(valores);
  if (!resultado.success) {
    return {
      estado: "error",
      errores: aErrores(resultado.error.issues),
      valores,
    };
  }
  const datos = resultado.data;

  /* --- Capa 3: límite por IP --- */
  const ip = await obtenerIp();
  if (!dentroDelLimite(ip)) {
    return { estado: "error", errores: {}, mensajeGeneral: MENSAJE_LIMITE, valores };
  }

  /* --- Configuración ---
     Se lee DENTRO de la acción, no en el módulo: si se leyera arriba, un
     despliegue sin las variables reventaría el build en vez de fallar aquí,
     donde al menos se puede mostrar la salida alternativa. */
  const apiKey = process.env.RESEND_API_KEY;
  const destino = process.env.CONTACTO_CORREO_DESTINO;
  const remitente = process.env.CONTACTO_CORREO_REMITENTE;

  if (!apiKey || !destino || !remitente) {
    console.error(
      "[contacto] Faltan variables de entorno:",
      [
        !apiKey && "RESEND_API_KEY",
        !destino && "CONTACTO_CORREO_DESTINO",
        !remitente && "CONTACTO_CORREO_REMITENTE",
      ]
        .filter(Boolean)
        .join(", "),
    );
    devolverCupo(ip);
    return { estado: "error", errores: {}, mensajeGeneral: MENSAJE_ERROR, valores };
  }

  const etiqueta = etiquetaNecesidad(datos.necesidad);
  const sello = selloDeTiempo();
  const constancia = `Consentimiento aceptado el ${sello}`;

  const texto = [
    `Nombre: ${datos.nombre}`,
    `Correo: ${datos.correo}`,
    `Qué necesita: ${etiqueta}`,
    "",
    "Mensaje:",
    datos.mensaje,
    "",
    "—",
    constancia,
    `Recibido el ${sello}`,
  ].join("\n");

  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#222831">
  <h2 style="font-size:18px;margin:0 0 16px">Nuevo contacto desde la landing</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse">
    <tr><td style="padding:4px 16px 4px 0;color:#5b6770">Nombre</td><td style="padding:4px 0"><strong>${escapar(datos.nombre)}</strong></td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#5b6770">Correo</td><td style="padding:4px 0"><a href="mailto:${escapar(datos.correo)}">${escapar(datos.correo)}</a></td></tr>
    <tr><td style="padding:4px 16px 4px 0;color:#5b6770">Qué necesita</td><td style="padding:4px 0">${escapar(etiqueta)}</td></tr>
  </table>
  <p style="margin:20px 0 4px;color:#5b6770">Mensaje</p>
  <div style="border-left:3px solid #2ec486;padding:4px 0 4px 12px;white-space:pre-wrap">${escaparParrafo(datos.mensaje)}</div>
  <hr style="border:0;border-top:1px solid #e3e8eb;margin:24px 0">
  <p style="font-size:13px;color:#5b6770;margin:0">${escapar(constancia)}</p>
  <p style="font-size:13px;color:#5b6770;margin:4px 0 0">Recibido el ${escapar(sello)}</p>
</div>`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: `Formulario ${site.nameCorto} <${remitente}>`,
      to: [destino],
      /* Responder en el cliente de correo contesta a quien escribió, no al
         remitente técnico del formulario. */
      replyTo: datos.correo,
      subject: `Nuevo contacto ${site.nameCorto} — ${etiqueta} — ${datos.nombre}`,
      text: texto,
      html,
    });

    if (error) {
      /* El error del servicio se queda en los registros del servidor. Al
         navegador va un mensaje con salida alternativa, nunca el crudo. */
      console.error("[contacto] Resend devolvió error:", error);
      devolverCupo(ip);
      return { estado: "error", errores: {}, mensajeGeneral: MENSAJE_ERROR, valores };
    }

    /* Solo el id de Resend: sirve para rastrear un envío concreto en su panel
       si alguien reclama que no llegó. Ni nombre, ni correo, ni mensaje. */
    console.log("[contacto] Enviado. id:", data?.id);
  } catch (fallo) {
    console.error("[contacto] Fallo al enviar:", fallo);
    devolverCupo(ip);
    return { estado: "error", errores: {}, mensajeGeneral: MENSAJE_ERROR, valores };
  }

  return { estado: "ok", nombre: datos.nombre, tipo: datos.necesidad };
}
