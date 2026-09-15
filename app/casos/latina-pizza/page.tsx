import type { Metadata } from "next";
import CaseStudyShell, { Eyebrow, Stat, StatRow, Section, Quote } from "../CaseStudyShell";

const TITLE = "Latina Pizza: $40,000 USD adicionales en 6 meses sin pautar — Caso de éxito | Monkeia";
const DESCRIPTION =
  "Cómo Latina Pizza (Costa Rica) reemplazó las comisiones de apps de delivery por un chatbot y una plataforma de pedidos propia, y generó $40,000 USD adicionales en 6 meses.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/casos/latina-pizza" },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.monkeia.com/casos/latina-pizza",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function LatinaPizzaCaseStudy() {
  return (
    <CaseStudyShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Latina Pizza: $40,000 USD adicionales en 6 meses sin pautar",
            description: DESCRIPTION,
            about: { "@type": "Restaurant", name: "Latina Pizza", areaServed: "Costa Rica" },
            author: { "@id": "https://www.monkeia.com/#organization" },
            publisher: { "@id": "https://www.monkeia.com/#organization" },
            mainEntityOfPage: "https://www.monkeia.com/casos/latina-pizza",
          }),
        }}
      />

      <Eyebrow>Caso de éxito · Restaurantes</Eyebrow>
      <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
        Cómo Latina Pizza generó $40,000 USD adicionales en 6 meses sin gastar en publicidad
      </h1>
      <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 8 }}>
        Un restaurante de Costa Rica reemplazó las comisiones de las apps de delivery por
        un chatbot y una plataforma de pedidos propia — y terminó con una base de datos de
        clientes que las apps nunca le hubieran dado.
      </p>

      <StatRow>
        <Stat value="$40,000 USD" label="ingreso adicional en 6 meses" />
        <Stat value="$400,000 USD" label="en ventas totales al cerrar 2023 (omnicanal)" />
      </StatRow>

      <Section title="El desafío">
        <p>
          Latina Pizza necesitaba generar más ventas y tráfico sin depender de publicidad
          costosa ni de las comisiones que cobran las plataformas de delivery por tener
          presencia online.
        </p>
      </Section>

      <Section title="La estrategia">
        <p>
          Monkeia construyó un chatbot y una plataforma de pedidos 100% digital y propia
          para tomar los pedidos de delivery directamente, con promociones especiales para
          los clientes. Publicaciones en Instagram y Facebook llevaban tráfico hacia esa
          automatización, creando una relación más cercana con cada cliente.
        </p>
      </Section>

      <Section title="Información de alto valor">
        <p>
          El seguimiento de una base de datos propia y actualizada le dio a Latina Pizza
          algo que las apps de delivery de terceros no ofrecen: conocimiento real de sus
          clientes para armar estrategias personalizadas que los hicieran volver.
        </p>
        <p>
          Al no depender de esas plataformas, el restaurante ahorró en comisiones y además
          mejoró su tiempo de respuesta y atención — algo que los propios comensales
          valoraron.
        </p>
        <p>
          La plataforma también reveló qué productos se vendían más y desde qué zonas
          pedían los clientes más frecuentes. Monkeia entregó una base de datos segmentada
          — correo, teléfono, fecha de cumpleaños y pizza favorita — para que el
          restaurante pudiera automatizar campañas de marketing futuras.
        </p>
      </Section>

      <Section title="Resultado">
        <p>
          Con capacitación del equipo de servicio al cliente para manejar la alta demanda
          de pedidos, Latina Pizza cerró el año 2023 con más de $400,000 USD en ventas
          usando un enfoque omnicanal — de los cuales $40,000 USD fueron ingreso adicional
          directamente atribuible al nuevo sistema de pedidos en los primeros 6 meses.
        </p>
      </Section>

      <Quote cite="JP Camareno, fundador de Monkeia">
        Lideramos la implementación de punta a punta: capacitación del equipo de servicio
        al cliente y preparación para la demanda que venía.
      </Quote>
    </CaseStudyShell>
  );
}
