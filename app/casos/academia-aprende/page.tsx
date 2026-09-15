import type { Metadata } from "next";
import CaseStudyShell, { Eyebrow, Stat, StatRow, Section } from "../CaseStudyShell";

const TITLE = "Academia Aprende: 5,000 prospectos calificados en 3 meses — Caso de éxito | Monkeia";
const DESCRIPTION =
  "Cómo Academia Aprende (Costa Rica) construyó una base de datos segmentada de más de 5,000 contactos en 3 meses, con un presupuesto publicitario de solo $6 USD diarios.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/casos/academia-aprende" },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.monkeia.com/casos/academia-aprende",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function AcademiaAprendeCaseStudy() {
  return (
    <CaseStudyShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Academia Aprende: 5,000 prospectos calificados en 3 meses",
            description: DESCRIPTION,
            about: { "@type": "EducationalOrganization", name: "Academia Aprende", areaServed: "Costa Rica" },
            author: { "@id": "https://www.monkeia.com/#organization" },
            publisher: { "@id": "https://www.monkeia.com/#organization" },
            mainEntityOfPage: "https://www.monkeia.com/casos/academia-aprende",
          }),
        }}
      />

      <Eyebrow>Caso de éxito · Educación</Eyebrow>
      <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
        Cómo Academia Aprende recolectó 5,000 prospectos calificados en 3 meses
      </h1>
      <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 8 }}>
        Una institución educativa de Costa Rica necesitaba mensajes más relevantes para
        convertir prospectos en matrículas — la automatización le dio la información para
        lograrlo.
      </p>

      <StatRow>
        <Stat value="5,000+" label="contactos segmentados en 3 meses" />
        <Stat value="$6 USD/día" label="presupuesto publicitario" />
      </StatRow>

      <Section title="El desafío">
        <p>
          Academia Aprende necesitaba mejorar la personalización y efectividad de sus
          campañas hacia potenciales estudiantes. Sin información detallada sobre los
          intereses específicos de su audiencia, sus mensajes perdían relevancia y
          convertían menos prospectos en matrículas.
        </p>
      </Section>

      <Section title="La estrategia">
        <p>
          Monkeia implementó un bot para recolectar y segmentar información de cada
          prospecto, con informes diarios del desempeño de las campañas y capacitación
          continua para el equipo de Academia Aprende — asegurando una implementación
          efectiva y una optimización constante.
        </p>
      </Section>

      <Section title="Capacitación de la fuerza de ventas">
        <p>
          El equipo de ventas fue entrenado para usar la información recolectada por el bot
          y personalizar cada interacción, alineando la oferta educativa con los intereses
          específicos de cada prospecto — lo que elevó las tasas de conversión.
        </p>
      </Section>

      <Section title="Resultado">
        <p>
          En tres meses, Academia Aprende construyó una base de datos segmentada de más de
          5,000 contactos, con un presupuesto de solo $6 USD diarios en publicidad digital.
          Los mensajes por email y WhatsApp se volvieron más relevantes y personalizados,
          lo que se tradujo en más consultas y matrículas para el programa principal de la
          academia.
        </p>
      </Section>
    </CaseStudyShell>
  );
}
