import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad — Monkeia",
  description: "Cómo Monkeia recolecta, usa y protege los datos de quienes visitan y contactan el sitio.",
  alternates: { canonical: "/privacidad" },
  robots: { index: true, follow: true },
};

export default function PrivacidadPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px 120px", color: "rgba(255,255,255,0.85)" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Política de privacidad</h1>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 40 }}>
        Última actualización: septiembre de 2026
      </p>

      <Section title="Responsable">
        <p>
          Monkeia es responsable del tratamiento de los datos que se describen en esta
          política. Puedes contactarnos en{" "}
          <a href="mailto:hi@monkeia.com" style={{ color: "#378ADD" }}>hi@monkeia.com</a>{" "}
          o por WhatsApp al{" "}
          <a href="https://wa.me/50683225178" style={{ color: "#378ADD" }}>+506 8322 5178</a>.
        </p>
      </Section>

      <Section title="Qué datos recolectamos">
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
      </Section>

      <Section title="Con qué herramientas (terceros)">
        <p style={{ marginBottom: 8 }}>Usamos los siguientes servicios, cada uno bajo su propia política de privacidad:</p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li>Meta (Pixel de Facebook) — publicidad y medición de campañas.</li>
          <li>Google Analytics — analítica del sitio.</li>
          <li>Microsoft Clarity — mapas de calor y grabación de sesión.</li>
          <li>VisitorTracking — analítica de visitantes.</li>
          <li>Vercel Analytics / Speed Insights — rendimiento del sitio, sin cookies de rastreo.</li>
          <li>Supabase — almacenamiento de las respuestas del diagnóstico rápido.</li>
          <li>TidyCal — agendamiento de llamadas.</li>
        </ul>
      </Section>

      <Section title="Finalidad">
        <p>
          Usamos estos datos para responder tu solicitud de contacto o diagnóstico,
          agendar llamadas, y entender cómo se usa el sitio para mejorarlo. No vendemos
          tus datos a terceros.
        </p>
      </Section>

      <Section title="Plazo de conservación">
        <p style={{ color: "rgba(255,255,255,0.5)" }}>
          Pendiente de definir con precisión (ver nota legal arriba). Por defecto,
          conservamos los datos de contacto mientras exista una relación comercial
          activa o potencial, y los datos de analítica según el plazo estándar de cada
          proveedor listado arriba.
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
      </Section>

      <Section title="Cookies">
        <p>
          Al entrar al sitio te preguntamos si aceptas cookies de analítica. Si
          rechazas, no se cargan Meta Pixel, Google Analytics, Microsoft Clarity ni
          VisitorTracking. Puedes cambiar tu decisión borrando las cookies del sitio en
          tu navegador.
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
