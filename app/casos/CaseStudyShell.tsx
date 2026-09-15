import Image from "next/image";
import Link from "next/link";

const TIDYCAL =
  "https://tidycal.com/monkeia/transforma-la-forma-en-que-opera-tu-empresa?redirect=https://www.monkeia.com/gracias";
const WA = "https://wa.me/50683225178";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, fontWeight: 600, color: "#378ADD", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
      {children}
    </p>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, color: "#fff" }}>{value}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export function StatRow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "32px",
        padding: "28px 20px",
        margin: "32px 0 40px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
      }}
    >
      {children}
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, color: "#fff" }}>{title}</h2>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.7)", display: "flex", flexDirection: "column", gap: 12 }}>
        {children}
      </div>
    </section>
  );
}

export function Quote({ children, cite }: { children: React.ReactNode; cite?: string }) {
  return (
    <blockquote
      style={{
        borderLeft: "3px solid #378ADD",
        paddingLeft: 20,
        margin: "32px 0",
        fontSize: 17,
        fontStyle: "italic",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      <p>{children}</p>
      {cite && <footer style={{ marginTop: 8, fontSize: 13, fontStyle: "normal", color: "rgba(255,255,255,0.45)" }}>— {cite}</footer>}
    </blockquote>
  );
}

export default function CaseStudyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1f1f1f] bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Image src="/logo.svg" alt="Monkeia" width={120} height={40} style={{ objectFit: "contain" }} />
          </Link>
          <a
            href={TIDYCAL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "10px 22px",
              borderRadius: 999,
              background: "#378ADD",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Analizar mi empresa
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-32 pb-20">{children}</main>

      <section className="border-t border-[#1f1f1f] px-6 py-16 text-center">
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 12 }}>
          Tú podrías ser el próximo caso de éxito.
        </p>
        <a
          href={TIDYCAL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "14px 32px",
            borderRadius: 999,
            background: "#378ADD",
            color: "#fff",
            fontWeight: 600,
            fontSize: 15,
            textDecoration: "none",
          }}
        >
          Reserva tu llamada
        </a>
      </section>

      <footer className="border-t border-[#1f1f1f] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <span className="text-lg font-bold tracking-tight">
            Monk<span className="text-[#378ADD]">ei</span>a
          </span>
          <p className="text-sm text-white/30">© 2026 Monkeia · Sistemas de IA y automatización para empresas.</p>
          <div className="flex items-center gap-6">
            <a href={WA} target="_blank" rel="noopener noreferrer" className="text-sm text-white/40 hover:text-[#378ADD]">
              WhatsApp
            </a>
            <a href="mailto:hi@monkeia.com?subject=Consulta%20desde%20el%20sitio" className="text-sm text-white/40 hover:text-[#378ADD]">
              hi@monkeia.com
            </a>
            <Link href="/privacidad" className="text-sm text-white/40 hover:text-[#378ADD]">
              Privacidad
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
