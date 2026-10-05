import type { Metadata } from "next";
import Link from "next/link";
import { POLITICA_VERSION } from "../lib/privacy";

// "2026-09-30" → "30 de septiembre de 2026"
function formatFecha(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const metadata: Metadata = {
  title: "Política de privacidad — Monkeia",
  description: "Cómo Monkeia recolecta, usa y protege los datos del sitio monkeia.com y de la plataforma app.monkeia.com.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 120px", color: "rgba(255,255,255,0.85)" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Política de privacidad</h1>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 40 }}>
        Última actualización: {formatFecha(POLITICA_VERSION)}
      </p>

      <Section title="Responsable">
        <p>
          El responsable del tratamiento es José Pablo Rojas Camareno, persona física con
          cédula de identidad 2-0620-0589, quien opera bajo el nombre comercial Monkeia, con
          domicilio en Cariari Flats, Heredia, Costa Rica. Para ejercer tus derechos, escribe a{" "}
          <a href="mailto:hi@monkeia.com" style={{ color: "#378ADD" }}>hi@monkeia.com</a>.
        </p>
        <p style={{ marginTop: 12 }}>
          Esta política aplica al sitio web monkeia.com y a la plataforma app.monkeia.com, un
          servicio de bandeja de entrada de WhatsApp con asistente de inteligencia artificial,
          agendamiento de citas y atención humana. Se rige por la Ley N.º 8968 de Protección de
          la Persona frente al Tratamiento de sus Datos Personales de Costa Rica y su reglamento.
        </p>
      </Section>

      <Section title="Nuestro rol: responsable y encargado">
        <p style={{ marginBottom: 8 }}>Monkeia actúa en dos roles distintos según el tipo de dato:</p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>
            <strong>Como responsable:</strong> de los datos del sitio web y de las cuentas de los
            usuarios de la plataforma. Decidimos para qué y cómo se usan.
          </li>
          <li>
            <strong>Como encargado:</strong> de los datos de los clientes finales de cada negocio
            que usa la plataforma (sus contactos de WhatsApp, conversaciones y citas). En ese caso,{" "}
            <strong>el negocio es el responsable</strong> y Monkeia los trata solo para prestarle
            el servicio y según sus instrucciones.
          </li>
        </ul>
        <p style={{ marginTop: 12 }}>
          Si le escribiste por WhatsApp a un negocio que usa Monkeia y quieres ejercer tus
          derechos, puedes dirigirte a ese negocio o escribirnos a{" "}
          <a href="mailto:hi@monkeia.com" style={{ color: "#378ADD" }}>hi@monkeia.com</a> y
          canalizaremos tu solicitud.
        </p>
      </Section>

      <Section title="Qué datos recolectamos">
        <p style={{ marginBottom: 8 }}><strong>En el sitio web (monkeia.com):</strong></p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>
            <strong>Diagnóstico rápido del home:</strong> tus respuestas a las preguntas
            del quiz y el puntaje resultante. Si decides recibir el resultado por
            WhatsApp, también guardamos ese número.
          </li>
          <li>
            <strong>Agendamiento de llamadas:</strong> si reservas una cita, el
            formulario lo procesa TidyCal (tidycal.com), un proveedor externo con su
            propia política de privacidad.
          </li>
          <li>
            <strong>Datos de navegación:</strong> páginas visitadas, dispositivo,
            ubicación aproximada y comportamiento en el sitio, recolectados mediante
            cookies de analítica una vez que aceptas el aviso correspondiente.
          </li>
        </ul>
        <p style={{ margin: "16px 0 8px" }}><strong>En la plataforma (app.monkeia.com):</strong></p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>
            <strong>Cuenta de usuario:</strong> correo electrónico, contraseña (almacenada
            cifrada por nuestro proveedor de autenticación) y datos del espacio de trabajo.
          </li>
          <li>
            <strong>Información del negocio:</strong> la que el negocio configura (horarios,
            servicios, precios, dirección) para que el asistente responda.
          </li>
          <li>
            <strong>Contactos de WhatsApp:</strong> número de teléfono, nombre de perfil, etapa
            en el embudo (prospecto o cliente), notas y preferencia de recibir mensajes.
          </li>
          <li>
            <strong>Conversaciones:</strong> mensajes de texto, imágenes, documentos, notas de
            voz y sus transcripciones, y las respuestas generadas por el asistente o por el
            personal del negocio.
          </li>
          <li>
            <strong>Citas:</strong> fecha, hora, servicio y estado de las citas agendadas.
          </li>
          <li>
            <strong>Integraciones:</strong> credenciales de WhatsApp (YCloud), Google Calendar y
            HighLevel que el negocio conecta, almacenadas cifradas.
          </li>
        </ul>
      </Section>

      <Section title="Con qué herramientas (terceros)">
        <p style={{ marginBottom: 8 }}>Usamos los siguientes servicios, cada uno bajo su propia política de privacidad:</p>
        <p style={{ marginBottom: 6 }}><strong>En el sitio web:</strong></p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>Meta (Pixel de Facebook) — publicidad y medición de campañas.</li>
          <li>Google Analytics — analítica del sitio.</li>
          <li>Microsoft Clarity — mapas de calor y grabación de sesión.</li>
          <li>VisitorTracking — analítica de visitantes.</li>
          <li>Vercel Analytics / Speed Insights — rendimiento del sitio, sin cookies de rastreo.</li>
          <li>Supabase — almacenamiento de las respuestas del diagnóstico rápido.</li>
          <li>TidyCal — agendamiento de llamadas.</li>
        </ul>
        <p style={{ margin: "16px 0 6px" }}><strong>En la plataforma:</strong></p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>Supabase — base de datos y autenticación.</li>
          <li>Vercel — alojamiento de la plataforma.</li>
          <li>YCloud y Meta (WhatsApp Business) — envío y recepción de mensajes de WhatsApp.</li>
          <li>Upstash — cola de tareas programadas (solo identificadores internos, sin contenido de mensajes).</li>
          <li>OpenRouter — modelo de lenguaje del asistente y transcripción de notas de voz (si se activa).</li>
          <li>ElevenLabs — respuestas en audio (si se activa).</li>
          <li>Google — calendario del negocio (si se conecta).</li>
          <li>HighLevel — sincronización con el CRM del negocio (si se conecta).</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          Varios de estos proveedores almacenan o procesan datos fuera de Costa Rica,
          principalmente en Estados Unidos. Al usar el servicio, consientes esa transferencia,
          que se hace con proveedores que aplican medidas de seguridad adecuadas.
        </p>
      </Section>

      <Section title="Finalidad">
        <p>
          Usamos estos datos para responder tu solicitud de contacto o diagnóstico,
          agendar llamadas, y entender cómo se usa el sitio para mejorarlo. No vendemos
          tus datos a terceros.
        </p>
        <p style={{ marginTop: 12 }}>
          En la plataforma, usamos los datos para prestar el servicio al negocio que la
          contrata: responder mensajes, agendar citas y sincronizar su CRM.
        </p>
      </Section>

      <Section title="Datos de Google Calendar">
        <p style={{ marginBottom: 8 }}>
          Cuando un negocio conecta su Google Calendar, Monkeia solicita el permiso{" "}
          <code>calendar.events</code> y lo usa solo para:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>consultar los eventos existentes y saber qué horarios están libres;</li>
          <li>crear, reprogramar y cancelar las citas que los clientes del negocio solicitan por WhatsApp.</li>
        </ul>
        <p style={{ margin: "12px 0 8px" }}>Con respecto a esos datos, Monkeia:</p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>no los usa para publicidad ni los vende;</li>
          <li>
            no los transfiere a terceros, salvo a los proveedores necesarios para prestar el
            servicio, para cumplir la ley o con el consentimiento del negocio;
          </li>
          <li>no los usa para entrenar modelos de inteligencia artificial;</li>
          <li>
            no permite que personas los lean, salvo con consentimiento del negocio, por
            seguridad o por obligación legal.
          </li>
        </ul>
        <p style={{ marginTop: 12 }}>
          El negocio puede desconectar el calendario desde la configuración de la plataforma o
          revocar el acceso en{" "}
          <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" style={{ color: "#378ADD" }}>
            myaccount.google.com/permissions
          </a>
          .
        </p>
        <p style={{ marginTop: 12 }}>
          <strong>Declaración de Uso Limitado:</strong> el uso y la transferencia que Monkeia
          haga a cualquier otra aplicación de la información recibida de las APIs de Google se
          ajustará a la{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#378ADD" }}>
            Política de datos de usuario de los servicios de API de Google
          </a>
          , incluidos los requisitos de Uso Limitado.
        </p>
        <p lang="en" style={{ marginTop: 8, fontStyle: "italic" }}>
          Monkeia&apos;s use and transfer to any other app of information received from Google
          APIs will adhere to the{" "}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#378ADD" }}>
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
      </Section>

      <Section title="Inteligencia artificial y voz">
        <p style={{ marginBottom: 8 }}>
          Para responder automáticamente, la plataforma envía el texto de la conversación y la
          información del negocio a un modelo de lenguaje, a través de OpenRouter. Si el negocio
          activa las funciones de voz:
        </p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>
            las notas de voz recibidas se envían a OpenRouter para convertirlas en texto con un
            modelo de reconocimiento de voz (Whisper);
          </li>
          <li>las respuestas en audio se generan con ElevenLabs a partir del texto de la respuesta.</li>
        </ul>
        <p style={{ marginTop: 12 }}>
          Monkeia no usa las conversaciones para entrenar modelos propios. Los proveedores
          procesan los datos según sus propios términos. El contacto puede pedir en cualquier
          momento hablar con una persona del negocio.
        </p>
      </Section>

      <Section title="Plazo de conservación">
        <p>
          Conservamos tus datos de contacto hasta 12 meses después del último contacto.
          Los datos de analítica se conservan según el plazo estándar de cada proveedor
          listado arriba.
        </p>
        <p style={{ marginTop: 12 }}>
          En la plataforma, los datos se conservan mientras la cuenta del negocio esté activa.
          Al cancelar la cuenta se eliminan en un plazo de 30 días, salvo lo que la ley obligue
          a conservar. El negocio puede borrar un contacto y todas sus conversaciones desde la
          plataforma en cualquier momento; el borrado es definitivo.
        </p>
      </Section>

      <Section title="Seguridad">
        <p>
          Protegemos los datos con conexiones cifradas (HTTPS) en el sitio y la plataforma,
          credenciales de integraciones (WhatsApp, Google, HighLevel) cifradas en la base de
          datos, separación de datos por espacio de trabajo para que cada negocio vea solo su
          información, y acceso restringido a la infraestructura. Ningún sistema es infalible:
          si ocurre un incidente que afecte tus datos, te lo notificaremos y lo informaremos a
          la autoridad según lo exija la ley.
        </p>
      </Section>

      <Section title="Tus derechos">
        <p>
          Puedes solicitar acceso, rectificación o eliminación de tus datos escribiendo
          a{" "}
          <a href="mailto:hi@monkeia.com?subject=Solicitud%20sobre%20mis%20datos" style={{ color: "#378ADD" }}>
            hi@monkeia.com
          </a>
          . Responderemos en un plazo razonable.
        </p>
        <p style={{ marginTop: 12 }}>
          Si eres contacto de un negocio que usa Monkeia, puedes dejar de recibir mensajes en
          cualquier momento respondiendo <strong>STOP</strong> en WhatsApp.
        </p>
        <p style={{ marginTop: 12 }}>
          Si consideras que no atendimos tu solicitud, puedes acudir a la Agencia de
          Protección de Datos de los Habitantes (PRODHAB).
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Al entrar al sitio te preguntamos si aceptas cookies de analítica. Si
          rechazas, no se cargan Meta Pixel, Google Analytics, Microsoft Clarity ni
          VisitorTracking. Puedes cambiar tu decisión borrando las cookies del sitio en
          tu navegador.
        </p>
        <p style={{ marginTop: 12 }}>
          La plataforma app.monkeia.com usa solo las cookies necesarias para mantener tu sesión
          iniciada.
        </p>
      </Section>

      <Section title="Menores de edad">
        <p>
          El sitio y la plataforma están dirigidos a negocios, no a menores de 18 años.
        </p>
      </Section>

      <Link href="/" style={{ color: "#378ADD", fontSize: 14, display: "inline-block", marginTop: 24 }}>
        ← Volver al inicio
      </Link>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10, color: "#fff" }}>{title}</h2>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.7)" }}>{children}</div>
    </section>
  );
}
