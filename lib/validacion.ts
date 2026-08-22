import * as z from "zod/mini";
import { site } from "@/lib/site";

/**
 * Validación del formulario de contacto.
 *
 * UN SOLO esquema para cliente y servidor. El cliente lo corre al salir de
 * cada campo (onBlur) para avisar temprano; el servidor lo vuelve a correr
 * sobre el FormData, porque la validación de cliente es una cortesía, nunca
 * una defensa: cualquiera puede mandar un POST a mano.
 *
 * Se importa `zod/mini` y no `zod` a secas: es la MISMA librería y las mismas
 * reglas, pero con la API tree-shakeable. Como este módulo lo carga también el
 * navegador —ahí corre el mismo esquema—, el zod completo metía ~70 kB de
 * JavaScript en la página por cinco comprobaciones. Con `mini` solo viaja lo
 * que de verdad se usa.
 *
 * Los mensajes de error explican CÓMO arreglarlo. Nunca "campo inválido":
 * quien lo lee ya sabe que algo está mal, lo que no sabe es qué se espera.
 */

/* ---------------------------------------------------------------------------
   Campos de defensa antispam

   Viven aquí, y no en la Server Action, por una razón del framework: un módulo
   "use server" solo puede exportar funciones asíncronas. Como el nombre lo
   necesitan la acción Y el formulario, este módulo neutral es el sitio donde
   los dos pueden leerlo sin duplicar el literal.
--------------------------------------------------------------------------- */

/** Campo trampa. Nombre plausible a propósito: los bots rellenan lo que suena
    a formulario de verdad, y "sitio-web" lo es. */
export const CAMPO_TRAMPA = "sitio-web";

/** Momento del render. Lo escribe el cliente al montar. */
export const CAMPO_MARCA = "marca-tiempo";

/* Los valores del select salen del copy: una sola lista, sin duplicar. El
   `as [string, ...string[]]` le promete a zod que la tupla no está vacía. */
const VALORES_NECESIDAD = site.contacto.formulario.opciones.map(
  (o) => o.valor,
) as [string, ...string[]];

/* El mismo texto para "no elegiste nada" y para "elegiste algo que no está en
   la lista": desde fuera son el mismo problema. */
const ELIGE_OPCION = "Elige una opción para saber con qué llegamos preparados.";

export const esquemaContacto = z.object({
  nombre: z
    .string()
    .check(
      z.trim(),
      z.minLength(2, "Escribe tu nombre, aunque sea solo el de pila."),
      z.maxLength(80, "El nombre no puede pasar de 80 caracteres."),
    ),

  correo: z.pipe(
    z
      .string()
      .check(z.trim(), z.minLength(1, "Escribe tu correo para poder contestarte.")),
    /* `z.email()` valida la forma real de la dirección, no un "tiene arroba".
       Aun así, el correo solo se comprueba de verdad cuando llega la
       respuesta: por eso la confirmación dice a dónde se contestará. */
    z
      .email("Escribe un correo válido, por ejemplo nombre@empresa.com")
      .check(
        z.maxLength(254, "Ese correo es más largo de lo que permite el estándar."),
      ),
  ),

  necesidad: z.pipe(
    z.string().check(z.minLength(1, ELIGE_OPCION)),
    z.enum(VALORES_NECESIDAD, ELIGE_OPCION),
  ),

  mensaje: z
    .string()
    .check(
      z.trim(),
      z.minLength(
        10,
        "Cuéntanos un poco más: con diez caracteres no alcanza para entenderte.",
      ),
      z.maxLength(2000, "El mensaje no puede pasar de 2000 caracteres."),
    ),

  /* La casilla llega como "on" cuando está marcada y NO llega cuando no lo
     está. El formulario la normaliza a booleano con `aBooleano` antes de
     validar, así que aquí basta con exigir el `true`. */
  aceptacion: z.literal(
    true,
    "Necesitamos tu autorización para poder responderte.",
  ),
});

export type CamposContacto = z.infer<typeof esquemaContacto>;

/** Nombres de los campos, en el orden en que aparecen en pantalla. */
export const CAMPOS = [
  "nombre",
  "correo",
  "necesidad",
  "mensaje",
  "aceptacion",
] as const;

export type NombreCampo = (typeof CAMPOS)[number];

export type ErroresContacto = Partial<Record<NombreCampo, string>>;

/** Lo que la persona escribió, para devolvérselo si el envío falla. */
export type ValoresContacto = {
  nombre: string;
  correo: string;
  necesidad: string;
  mensaje: string;
  aceptacion: boolean;
};

/**
 * Estado que devuelve la Server Action. Nunca lleva el error crudo del
 * servicio de correo: eso se registra en el servidor y al navegador solo llega
 * un mensaje que sirva para algo.
 */
export type EstadoContacto =
  | { readonly estado: "inactivo" }
  | {
      readonly estado: "ok";
      /** Para saludar por su nombre en la confirmación. */
      readonly nombre: string;
      /** Valor del select. Se usa en analítica; no es dato personal. */
      readonly tipo: string;
    }
  | {
      readonly estado: "error";
      readonly errores: ErroresContacto;
      readonly mensajeGeneral?: string;
      /** Para repintar el formulario sin perder lo escrito (camino sin JS). */
      readonly valores?: ValoresContacto;
    };

export const ESTADO_INICIAL: EstadoContacto = { estado: "inactivo" };

/** La casilla marcada llega como "on"; sin marcar no llega nada. */
export function aBooleano(valor: FormDataEntryValue | null): boolean {
  return valor === "on" || valor === "true";
}

/**
 * Convierte los issues de zod en un mapa `campo → primer mensaje`. Se queda
 * con el primero de cada campo: mostrar tres reglas incumplidas a la vez no
 * ayuda a nadie a corregir la primera.
 */
export function aErrores(issues: readonly z.core.$ZodIssue[]): ErroresContacto {
  const errores: ErroresContacto = {};
  for (const issue of issues) {
    const campo = issue.path[0];
    if (typeof campo === "string" && !(campo in errores)) {
      errores[campo as NombreCampo] = issue.message;
    }
  }
  return errores;
}

/**
 * Valida UN campo. Lo usa el cliente al salir de cada uno.
 *
 * Corre el esquema completo y se queda solo con los errores del campo pedido,
 * en vez de mantener cinco esquemas sueltos que se desincronizarían.
 */
export function validarCampo(
  campo: NombreCampo,
  valores: Partial<ValoresContacto>,
): string | undefined {
  const resultado = esquemaContacto.safeParse({
    nombre: valores.nombre ?? "",
    correo: valores.correo ?? "",
    necesidad: valores.necesidad ?? "",
    mensaje: valores.mensaje ?? "",
    aceptacion: valores.aceptacion ?? false,
  });
  if (resultado.success) return undefined;
  return aErrores(resultado.error.issues)[campo];
}
