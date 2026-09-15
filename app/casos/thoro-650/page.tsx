import type { Metadata } from "next";
import CaseStudyShell, { Eyebrow, Stat, StatRow, Section } from "../CaseStudyShell";

const TITLE = "Thoro 650: $50,000 MXN en 7 horas con una historia de Instagram — Caso de éxito | Monkeia";
const DESCRIPTION =
  "Cómo Thoro 650 (México) generó $50,000 pesos mexicanos en 7 horas de forma 100% orgánica, combinando Instagram Stories, un live automatizado y un bot de ventas.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/casos/thoro-650" },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.monkeia.com/casos/thoro-650",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function Thoro650CaseStudy() {
  return (
    <CaseStudyShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Thoro 650: $50,000 MXN en 7 horas con una historia de Instagram",
            description: DESCRIPTION,
            about: { "@type": "Organization", name: "Thoro 650", areaServed: "México" },
            author: { "@id": "https://www.monkeia.com/#organization" },
            publisher: { "@id": "https://www.monkeia.com/#organization" },
            mainEntityOfPage: "https://www.monkeia.com/casos/thoro-650",
          }),
        }}
      />

      <Eyebrow>Caso de éxito · E-commerce</Eyebrow>
      <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
        Cómo Thoro 650 generó $50,000 pesos mexicanos en 7 horas con una sola historia de Instagram
      </h1>
      <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 8 }}>
        Thoro 650, un ecommerce de zapatos en México, se propuso una meta de ventas
        mensual — y la alcanzó en 7 horas, de forma orgánica, sin pautar un solo peso.
      </p>

      <StatRow>
        <Stat value="$50,000 MXN" label="en ventas en 7 horas" />
        <Stat value="100% orgánico" label="sin inversión en pauta" />
      </StatRow>

      <Section title="El desafío">
        <p>
          Thoro 650 se propuso alcanzar una meta de ventas de $50,000 pesos mexicanos en
          solo 7 horas, apalancándose en la estrategia de Monkeia para lograrlo sin gastar
          en publicidad paga.
        </p>
      </Section>

      <Section title="La estrategia">
        <p>
          Monkeia diseñó un guion y una campaña de Instagram Stories con imágenes y videos
          de alta calidad, textos persuasivos y descuentos exclusivos por tiempo limitado.
          La campaña incluyó un live en Instagram automatizado para maximizar el alcance,
          seguido de una historia adicional para mantener el impulso.
        </p>
      </Section>

      <Section title="El rol del bot">
        <p>Cada historia invitaba a los seguidores a escribir por mensaje directo. Ahí es donde entraba el bot:</p>
        <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          <li><strong>Entrega de descuentos:</strong> respondía automáticamente con el cupón.</li>
          <li><strong>Redirección a WhatsApp:</strong> pasaba la conversación a un canal más personal.</li>
          <li><strong>Cierre de ventas:</strong> el equipo de Thoro 650 cerraba la venta en WhatsApp.</li>
          <li><strong>Seguimiento automático:</strong> recordaba la oferta a quien no había canjeado su cupón.</li>
          <li><strong>Notificaciones a vendedores:</strong> avisaba al equipo para hacer seguimiento manual cuando hacía falta.</li>
        </ul>
      </Section>

      <Section title="Automatización del proceso">
        <p>
          El flujo automatizado agradecía la participación en el live y entregaba el enlace
          para canjear la oferta — envío gratis y descuento exclusivo incluidos. Tras una
          pausa inteligente de 6 horas, se enviaban recordatorios automáticos a quienes aún
          no habían comprado, junto con una notificación al equipo de ventas.
        </p>
      </Section>

      <Section title="Resultado">
        <p>
          La combinación de contenido visual atractivo, ofertas por tiempo limitado y un
          bot que sostuvo el seguimiento y las notificaciones al equipo llevó a Thoro 650 a
          superar su meta: $50,000 MXN en 7 horas, con una sola historia de Instagram y un
          live automatizado. La campaña también le dejó al negocio información clara sobre
          qué productos resonaron más con su audiencia, para futuras decisiones de
          inventario y campañas.
        </p>
      </Section>
    </CaseStudyShell>
  );
}
