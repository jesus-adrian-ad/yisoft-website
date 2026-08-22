"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { site } from "@/lib/site";
import { track } from "@/lib/track";
import { enviarContacto } from "@/app/acciones/enviar-contacto";
import {
  CAMPO_MARCA,
  CAMPO_TRAMPA,
  CAMPOS,
  ESTADO_INICIAL,
  validarCampo,
  type ErroresContacto,
  type NombreCampo,
  type ValoresContacto,
} from "@/lib/validacion";
import Container from "@/components/ui/Container";
import { RevelarAlScroll, RevelarGrupo } from "@/components/ui/RevelarAlScroll";
import Button from "@/components/ui/Button";
import Campo from "@/components/ui/Campo";
import CorreoCopiable from "@/components/ui/CorreoCopiable";

/** Id del h2. Lo usa el `aria-labelledby` de la <section> en page.tsx. */
export const ID_TITULO_CONTACTO = "contacto-titulo";

const { contacto, contact } = site;

/* -------------------------------------------------------------------------
   Botón de WhatsApp

   Sale dos veces: en el bloque de contacto directo y dentro de la
   confirmación de envío. Es un <a> real —no un botón con router— porque abre
   otro sitio, y el `aria-label` avisa de la ventana nueva: abrir pestañas sin
   decirlo desorienta a quien no ve el cambio de contexto.
------------------------------------------------------------------------- */
function IconoWhatsApp() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={20}
      height={20}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className="shrink-0"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
    </svg>
  );
}

function BotonWhatsApp({ fluido = false }: { fluido?: boolean }) {
  const { whatsapp } = contacto.directo;
  return (
    <Button
      href={whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsapp.aria}
      variante="secundaria"
      fluido={fluido}
      onClick={() => track("whatsapp_click", { ubicacion: "contacto" })}
    >
      <IconoWhatsApp />
      {whatsapp.label}
    </Button>
  );
}

/* -------------------------------------------------------------------------
   Bloque de contacto directo
------------------------------------------------------------------------- */
function ContactoDirecto({ conLinea = false }: { conLinea?: boolean }) {
  return (
    <div
      className={
        conLinea
          ? "border-t border-yi-azul/12 pt-8 dark:border-white/10"
          : undefined
      }
    >
      {/* <p> y no un encabezado: colgar un h3 aquí metería un nivel en el
          esquema del documento por una línea de dos palabras. */}
      <p className="font-display text-h4 font-bold text-yi-azul dark:text-yi-oscuro-titulo">
        {contacto.directo.titulo}
      </p>

      {/* A ancho completo hasta 620px, y desde ahí solo lo que mide su texto:
          un botón de borde a borde en escritorio se lee como un banner. */}
      <div className="mt-5 flex">
        <div className="w-full min-[620px]:w-auto">
          <BotonWhatsApp fluido />
        </div>
      </div>

      <p className="mt-5 font-sans text-small text-yi-gris dark:text-yi-oscuro-secundario">
        {contacto.directo.correoPrefijo}
      </p>
      <CorreoCopiable
        correo={contact.email}
        ubicacion="contacto"
        className="mt-1"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------
   Estado ENVIANDO

   `useFormStatus` solo funciona en un componente HIJO del <form>, no en el
   que lo renderiza. Por eso los campos y el botón viven aquí dentro: así el
   mismo `pending` bloquea los controles y cambia el botón, sin que el padre
   tenga que llevar una bandera propia que podría desincronizarse.

   Bloquear el <fieldset> es lo que impide el envío duplicado por doble clic.
------------------------------------------------------------------------- */
function CuerpoFormulario({
  errores,
  valores,
  alSalirDelCampo,
}: {
  errores: ErroresContacto;
  valores: Partial<ValoresContacto>;
  alSalirDelCampo: (campo: NombreCampo) => void;
}) {
  const { pending } = useFormStatus();
  const { campos, opciones, boton, botonEnviando } = contacto.formulario;

  return (
    <fieldset disabled={pending} className="m-0 min-w-0 border-0 p-0">
      {/* Nombre y correo comparten renglón desde 620px. Por debajo, cada uno
          a lo ancho: dos columnas en un teléfono dejan campos de 130px. */}
      <div className="grid gap-x-5 min-[620px]:grid-cols-2">
        <Campo
          tipo="texto"
          nombre="nombre"
          label={campos.nombre.label}
          error={errores.nombre}
          defaultValue={valores.nombre}
          onBlur={() => alSalirDelCampo("nombre")}
          maxLength={80}
          requerido
        />
        <Campo
          tipo="email"
          nombre="correo"
          label={campos.correo.label}
          ayuda={campos.correo.ayuda}
          error={errores.correo}
          defaultValue={valores.correo}
          onBlur={() => alSalirDelCampo("correo")}
          maxLength={254}
          requerido
        />
      </div>

      <Campo
        tipo="select"
        nombre="necesidad"
        label={campos.necesidad.label}
        vacia={campos.necesidad.vacia}
        opciones={opciones}
        error={errores.necesidad}
        defaultValue={valores.necesidad}
        /* En un <select> el cambio ES la interacción: esperar al blur dejaría
           el error puesto después de que ya eligieron. */
        onChange={() => alSalirDelCampo("necesidad")}
        onBlur={() => alSalirDelCampo("necesidad")}
        requerido
      />

      <Campo
        tipo="textarea"
        nombre="mensaje"
        label={campos.mensaje.label}
        ayuda={campos.mensaje.ayuda}
        error={errores.mensaje}
        defaultValue={valores.mensaje}
        onBlur={() => alSalirDelCampo("mensaje")}
        maxLength={2000}
        requerido
      />

      {/* --- Consentimiento ---
          Separado por una línea y con más aire que entre campos: es una
          decisión que se toma, no un dato que se teclea, y el espacio es lo
          que lo dice sin necesidad de escribirlo. */}
      <div className="mt-2 border-t border-yi-azul/12 pt-8 dark:border-white/10">
        <div className="flex items-start gap-3">
          {/* Checkbox nativo. Un <div> con onClick no se marca con la barra
              espaciadora, no lo anuncia el lector como casilla y no lo envía
              el formulario sin JavaScript. */}
          <input
            type="checkbox"
            id="contacto-aceptacion"
            name="aceptacion"
            aria-describedby={
              errores.aceptacion
                ? "contacto-aceptacion-error contacto-aceptacion-apoyo"
                : "contacto-aceptacion-apoyo"
            }
            aria-invalid={errores.aceptacion ? true : undefined}
            /* Obligatoria, y hay que decirlo: sin esto el lector la anuncia
               como una casilla opcional más. Va en aria y no en `required`
               por el mismo motivo que los demás campos (ver Campo.tsx). */
            aria-required="true"
            onChange={() => alSalirDelCampo("aceptacion")}
            className={
              "mt-3 size-5 shrink-0 cursor-pointer accent-yi-verde " +
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yi-verde"
            }
          />
          <div className="min-w-0">
            {/* `min-h-11` + padding: la etiqueta ES el área tocable, y al
                hacer clic en el texto se marca la casilla. */}
            <label
              htmlFor="contacto-aceptacion"
              className="flex min-h-11 cursor-pointer items-center py-2 font-sans text-body text-yi-tinta dark:text-yi-oscuro-texto"
            >
              {contacto.privacidad.aceptacion}
            </label>

            {/* Este párrafo NO es adorno: es lo que hace informado —y por
                tanto válido— el consentimiento de arriba. Va completo, a la
                vista, sin acordeón y sin enlace a una página que no existe. */}
            <p
              id="contacto-aceptacion-apoyo"
              className="mt-1 max-w-[62ch] font-sans text-small text-yi-gris dark:text-yi-oscuro-secundario"
            >
              {contacto.privacidad.apoyo}
            </p>
          </div>
        </div>

        {/* Misma ranura reservada que los demás campos: dos renglones de
            `text-small` en `em`, para que el error no empuje el botón. */}
        <div className="mt-2 min-h-[3.2em] text-small" aria-live="polite">
          {errores.aceptacion ? (
            <p
              id="contacto-aceptacion-error"
              className="font-sans text-small text-yi-error dark:text-yi-error-oscuro"
            >
              {errores.aceptacion}
            </p>
          ) : null}
        </div>
      </div>

      {/* A ancho completo en móvil; desde 620px, lo que mida su texto. */}
      <div className="flex">
        <div className="w-full min-[620px]:w-auto">
          <Button type="submit" tamano="lg" fluido disabled={pending}>
            {pending ? (
              <>
                <span
                  aria-hidden="true"
                  className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
                {botonEnviando}
              </>
            ) : (
              boton
            )}
          </Button>
        </div>
      </div>
    </fieldset>
  );
}

/* -------------------------------------------------------------------------
   Sección
------------------------------------------------------------------------- */
export function Contacto() {
  const [estado, accion] = useActionState(enviarContacto, ESTADO_INICIAL);

  /* Los errores se inicializan DESDE el estado de la acción, y no en vacío,
     por el camino sin JavaScript: ahí no corre ningún efecto, así que si el
     primer render no los pinta, no los pinta nadie. */
  const [errores, setErrores] = useState<ErroresContacto>(
    estado.estado === "error" ? estado.errores : {},
  );
  const [estadoVisto, setEstadoVisto] = useState(estado);

  const formRef = useRef<HTMLFormElement>(null);
  const exitoRef = useRef<HTMLDivElement>(null);

  /* Capa 2 del antispam: el momento en que se montó el formulario.
     Va en estado y NO escribiendo `.value` sobre un input con `defaultValue`.
     Medido: con `defaultValue`, el primer re-render que provoca el <select>
     borra el valor del DOM —mismo nodo, sin remontaje— porque React reafirma
     el `defaultValue` vacío. Controlado, React lo reescribe en cada render y
     no hay forma de que se pierda a mitad del llenado. */
  const [marca, setMarca] = useState("");

  /* Ajuste durante el render, no en un efecto: cuando vuelve la acción, los
     errores del servidor pasan a ser los que manda la UI, y a partir de ahí
     cada validación en onBlur los va limpiando conforme se corrigen. */
  if (estado !== estadoVisto) {
    setEstadoVisto(estado);
    setErrores(estado.estado === "error" ? estado.errores : {});
  }

  /* Se sella al montar, en el cliente, y no en el servidor: la página es
     estática, así que un valor renderizado allí sería la hora de la
     compilación y la comprobación no mediría nada. En SSR sale vacío, que es
     justo lo que el servidor interpreta como "sin JavaScript" y no descarta. */
  useEffect(() => {
    setMarca(String(Date.now()));
  }, []);

  useEffect(() => {
    if (estado.estado === "ok") {
      /* Solo el tipo de proyecto. Ni nombre, ni correo, ni una palabra del
         mensaje: la analítica no es sitio para datos de nadie. */
      track("form_submit", { seccion: "contacto", tipo: estado.tipo });
      exitoRef.current?.focus();
      return;
    }

    if (estado.estado === "error") {
      /* El foco va al primer campo con error, en el orden en que se ven. Si
         el fallo fue general (correo caído, límite por IP), no hay campo al
         que ir: lo anuncia el role="alert" del mensaje. */
      const primero = CAMPOS.find((campo) => estado.errores[campo]);
      if (!primero) return;
      const control = formRef.current?.elements.namedItem(primero);
      if (control instanceof HTMLElement) control.focus();
    }
  }, [estado]);

  /** Lee el valor vivo del formulario y revalida ese campo con el mismo esquema. */
  function alSalirDelCampo(campo: NombreCampo) {
    const form = formRef.current;
    if (!form) return;

    const leer = (nombre: string) => {
      const el = form.elements.namedItem(nombre);
      return el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement
        ? el.value
        : "";
    };
    const casilla = form.elements.namedItem("aceptacion");

    const mensaje = validarCampo(campo, {
      nombre: leer("nombre"),
      correo: leer("correo"),
      necesidad: leer("necesidad"),
      mensaje: leer("mensaje"),
      aceptacion: casilla instanceof HTMLInputElement ? casilla.checked : false,
    });

    setErrores((previos) => ({ ...previos, [campo]: mensaje }));
  }

  const valores = estado.estado === "error" ? (estado.valores ?? {}) : {};
  const mensajeGeneral =
    estado.estado === "error" ? estado.mensajeGeneral : undefined;

  return (
    <div
      className={[
        // Alterna respecto a "Proceso" (papel / velo blanco): aquí toca el
        // blanco puro y, en oscuro, el carbón desnudo del body.
        "bg-white dark:bg-transparent",
        // El contrato topa el padding vertical en 3rem a 320px.
        "py-12 xs:py-seccion",
      ].join(" ")}
    >
      <Container>
        {/* Dos columnas desde 900px: 40% para el discurso y 60% para el
            formulario, que necesita el ancho para que nombre y correo quepan
            de lado a lado sin apretarse.

            OJO con el orden del DOM: es el de móvil (encabezado → formulario
            → contacto directo), porque es el que manda para el lector de
            pantalla y el teclado. En escritorio, el bloque de contacto
            directo se coloca con `row-start` en la columna izquierda, debajo
            del encabezado. La consecuencia, asumida: tabulando en escritorio
            el enlace de WhatsApp llega DESPUÉS del formulario, aunque se vea
            a su izquierda. La alternativa era romper el orden de lectura en
            móvil, que es de donde entra casi todo el tráfico. */}
        <div className="grid gap-y-10 mdx:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] mdx:items-start mdx:gap-x-16 mdx:gap-y-12">
          {/* --- Encabezado --- */}
          <RevelarGrupo className="mdx:col-start-1 mdx:row-start-1">
            <RevelarAlScroll delay={0}>
              <p className="mb-4 font-sans text-label font-semibold uppercase tracking-[0.18em] text-yi-verde">
                {contacto.eyebrow}
              </p>
            </RevelarAlScroll>

            <RevelarAlScroll delay={0.08} variante="principal">
              <h2
                id={ID_TITULO_CONTACTO}
                className="hyphens-auto break-words font-display text-h2 font-bold text-yi-azul dark:text-yi-oscuro-titulo"
              >
                {contacto.titulo}
              </h2>
            </RevelarAlScroll>

            <RevelarAlScroll delay={0.2}>
              <p className="mt-4 max-w-[52ch] text-lead text-yi-gris dark:text-yi-oscuro-parrafo">
                {contacto.subtitulo}
              </p>
            </RevelarAlScroll>

            {/* La promesa concreta de la sección, con peso propio: punto
                verde, verde y semibold. Es lo que la gente busca al llegar
                aquí — cuándo le van a contestar. */}
            <RevelarAlScroll delay={0.3}>
              <p className="mt-6 flex items-start gap-2.5 font-sans text-body font-semibold text-yi-verde">
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] size-2 shrink-0 rounded-full bg-yi-verde"
                />
                <span>{contacto.expectativa}</span>
              </p>
            </RevelarAlScroll>
          </RevelarGrupo>

          {/* --- Formulario, o la confirmación cuando ya se envió --- */}
          <div className="min-w-0 mdx:col-start-2 mdx:row-start-1 mdx:row-span-2">
            {estado.estado === "ok" ? (
              /* `tabIndex={-1}` para poder mover el foco aquí sin meter el
                 bloque en el orden de tabulación. `role="status"` lo anuncia
                 aunque el foco no llegara. */
              <div
                ref={exitoRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="rounded-boton border border-yi-verde/35 bg-yi-verde/[0.07] p-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yi-verde md:p-8"
              >
                <h3 className="font-display text-h3 font-bold text-yi-azul dark:text-yi-oscuro-titulo">
                  {contacto.exito.titulo}
                </h3>
                <p className="mt-3 max-w-[52ch] text-body text-yi-gris dark:text-yi-oscuro-parrafo">
                  {contacto.exito.texto.replace("{nombre}", estado.nombre)}
                </p>
                <div className="mt-6 flex">
                  <div className="w-full min-[620px]:w-auto">
                    <BotonWhatsApp fluido />
                  </div>
                </div>
              </div>
            ) : (
              /* El formulario NO va en tarjeta: sigue el lenguaje sobrio del
                 resto de la página. Los campos sí llevan borde y fondo, que
                 es donde de verdad hace falta la distinción. */
              <form ref={formRef} action={accion} noValidate>
                {/* Capa 1 del antispam. Fuera de pantalla por CSS (nunca con
                    display:none), sin tabulación y oculto al lector. */}
                <div className="yi-trampa" aria-hidden="true">
                  <label htmlFor="sitio-web">Sitio web</label>
                  <input
                    id="sitio-web"
                    type="text"
                    name={CAMPO_TRAMPA}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Capa 2: lo sella el efecto al montar. Sin JavaScript va
                    vacío y el servidor entonces no descarta nada. */}
                <input type="hidden" name={CAMPO_MARCA} value={marca} readOnly />

                <CuerpoFormulario
                  errores={errores}
                  valores={valores}
                  alSalirDelCampo={alSalirDelCampo}
                />

                {/* Fallo general: siempre con salida alternativa a la vista.
                    Un "algo salió mal" sin a dónde ir deja a la persona sin
                    manera de contactarnos, que era justo lo que venía a hacer. */}
                {mensajeGeneral ? (
                  <div
                    role="alert"
                    className="mt-6 rounded-boton border border-yi-error/40 bg-yi-error/[0.06] p-4 dark:border-yi-error-oscuro/40 dark:bg-yi-error-oscuro/[0.08]"
                  >
                    <p className="font-sans text-small text-yi-error dark:text-yi-error-oscuro">
                      {mensajeGeneral}
                    </p>
                  </div>
                ) : null}
              </form>
            )}
          </div>

          {/* --- Contacto directo ---
              En escritorio va en la columna izquierda, bajo el encabezado, y
              separado por una línea fina. En móvil cierra la sección. */}
          <RevelarGrupo className="mdx:col-start-1 mdx:row-start-2">
            <RevelarAlScroll delay={0}>
              <ContactoDirecto conLinea />
            </RevelarAlScroll>
          </RevelarGrupo>
        </div>
      </Container>
    </div>
  );
}

export default Contacto;
