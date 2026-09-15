import type { Metadata } from "next";
import Link from "next/link";
import CaseStudyShell from "./CaseStudyShell";

const TITLE = "Casos de éxito — Monkeia";
const DESCRIPTION = "Resultados reales de empresas que automatizaron ventas, atención y operación con Monkeia.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/casos" },
};

const CASES = [
  {
    href: "/casos/latina-pizza",
    title: "Latina Pizza: $40,000 USD adicionales en 6 meses sin pautar",
    industry: "Restaurantes",
  },
  {
    href: "/casos/thoro-650",
    title: "Thoro 650: $50,000 MXN en 7 horas con una historia de Instagram",
    industry: "E-commerce",
  },
  {
    href: "/casos/academia-aprende",
    title: "Academia Aprende: 5,000 prospectos calificados en 3 meses",
    industry: "Educación",
  },
];

export default function CasosIndex() {
  return (
    <CaseStudyShell>
      <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, marginBottom: 32 }}>
        Casos de éxito
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {CASES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            style={{
              display: "block",
              padding: "20px 24px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
              textDecoration: "none",
              color: "#fff",
            }}
          >
            <span style={{ fontSize: 12, color: "#378ADD", fontWeight: 600, textTransform: "uppercase" }}>
              {c.industry}
            </span>
            <p style={{ fontSize: 18, fontWeight: 600, marginTop: 6 }}>{c.title}</p>
          </Link>
        ))}
      </div>
    </CaseStudyShell>
  );
}
