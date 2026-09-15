import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: 24,
        textAlign: "center",
      }}
    >
      <Image src="/logo.svg" alt="Monkeia" width={120} height={40} style={{ objectFit: "contain" }} />
      <div>
        <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 8 }}>404</h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 420 }}>
          Esta página no existe o se movió. Volvamos al sitio.
        </p>
      </div>
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 28px",
          borderRadius: 999,
          background: "#378ADD",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
        }}
      >
        Ir al inicio
      </Link>
    </main>
  );
}
