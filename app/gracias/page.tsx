"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const WA = "https://wa.me/50683225178";

/* ─────────────────────────────────────────────
   PARTICLE SPHERE — canvas-based, no deps
───────────────────────────────────────────── */
const SPHERE_COLORS = [
  "#ffffff",
  "#3b82f6", "#3b82f6", "#3b82f6",
  "#60a5fa", "#60a5fa",
  "#8b5cf6", "#a78bfa",
];

function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 560;
    const N    = 210;
    const R    = 195;
    const FOCAL = 440;
    const PHI  = Math.PI * (3 - Math.sqrt(5)); // golden angle

    canvas.width  = SIZE;
    canvas.height = SIZE;

    const pts = Array.from({ length: N }, (_, i) => {
      const y  = 1 - (i / (N - 1)) * 2;
      const r  = Math.sqrt(Math.max(0, 1 - y * y));
      const th = PHI * i;
      return {
        ox: Math.cos(th) * r,
        oy: y,
        oz: Math.sin(th) * r,
        color: SPHERE_COLORS[Math.floor(Math.random() * SPHERE_COLORS.length)],
      };
    });

    const cx = SIZE / 2;
    const cy = SIZE / 2;
    let   angle = 0;
    let   raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE);
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const projected = pts
        .map((p) => {
          const x3 = p.ox * cos + p.oz * sin;
          const z3 = -p.ox * sin + p.oz * cos;
          const pers = FOCAL / (FOCAL + z3 * R);
          return {
            sx:    cx + x3 * R * pers,
            sy:    cy + p.oy * R * pers,
            size:  Math.max(0.4, 2.4 * pers - 0.5),
            alpha: 0.06 + 0.78 * ((z3 + 1) / 2),
            color: p.color,
            z:     z3,
          };
        })
        .sort((a, b) => a.z - b.z); // back-to-front

      for (const p of projected) {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      angle += 0.004;
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none select-none"
      style={{
        position:  "absolute",
        top:       "50%",
        left:      "50%",
        transform: "translate(-50%, -50%)",
        opacity:   0.38,
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   ANIMATED CHECK ICON
───────────────────────────────────────────── */
function AnimatedCheck() {
  return (
    <div style={{ opacity: 0, animation: "springFlyIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s forwards" }}>
      <svg
        width="88"
        height="88"
        viewBox="0 0 96 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* Faint fill circle */}
        <circle cx="48" cy="48" r="44" fill="url(#checkGrad)" fillOpacity="0.08" />

        {/* Animated border circle */}
        <circle
          cx="48"
          cy="48"
          r="44"
          stroke="url(#checkGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="277"
          strokeDashoffset="277"
          style={{
            animation:
              "drawCheckCircle 0.85s cubic-bezier(0.22,1,0.36,1) 0.25s forwards",
          }}
        />

        {/* Animated checkmark */}
        <path
          d="M28 50 L42 64 L68 32"
          stroke="url(#checkGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="62"
          strokeDashoffset="62"
          style={{
            animation:
              "drawCheckMark 0.45s cubic-bezier(0.22,1,0.36,1) 1s forwards",
          }}
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   STEP CARD
───────────────────────────────────────────── */
function StepCard({
  num,
  emoji,
  title,
  body,
  delay,
}: {
  num:   string;
  emoji: string;
  title: string;
  body:  string;
  delay: number;
}) {
  return (
    <div
      style={{
        flex:         "1 1 0",
        minWidth:     "220px",
        maxWidth:     "340px",
        background:   "rgba(15,20,40,0.90)",
        border:       "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding:      "28px 24px",
        opacity:      0,
        animation:    `roadmapFlyIn 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}s forwards`,
      }}
    >
      {/* Step number */}
      <span
        style={{
          fontFamily:    "'Courier New', monospace",
          fontSize:      "0.62rem",
          fontWeight:    700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color:         "#378ADD",
          marginBottom:  "16px",
          display:       "block",
        }}
      >
        {num}
      </span>

      {/* Emoji icon */}
      <span
        style={{
          fontSize:     "2rem",
          display:      "block",
          marginBottom: "14px",
          lineHeight:   1,
        }}
        aria-hidden="true"
      >
        {emoji}
      </span>

      {/* Title */}
      <h3
        style={{
          fontSize:     "1rem",
          fontWeight:   700,
          color:        "#fff",
          marginBottom: "8px",
          lineHeight:   1.3,
        }}
      >
        {title}
      </h3>

      {/* Body */}
      <p
        style={{
          fontSize:   "0.875rem",
          color:      "rgba(255,255,255,0.45)",
          lineHeight: 1.6,
          margin:     0,
        }}
      >
        {body}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GRACIAS PAGE
───────────────────────────────────────────── */
export default function GraciasPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Nav ─────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1f1f1f] bg-black/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" aria-label="Volver a inicio">
            <Image
              src="/logo.svg"
              alt="Monkeia"
              width={120}
              height={40}
              style={{ objectFit: "contain" }}
            />
          </a>
          <a
            href="/"
            className="text-sm text-white/40 transition-colors duration-200 hover:text-white"
            style={{ letterSpacing: "0.04em" }}
          >
            ← Inicio
          </a>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────── */}
      <section
        style={{
          position:        "relative",
          overflow:        "hidden",
          minHeight:       "72vh",
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          paddingTop:      "96px",
          paddingBottom:   "72px",
          paddingLeft:     "24px",
          paddingRight:    "24px",
          borderBottom:    "1px solid #1f1f1f",
        }}
      >
        {/* Subtle radial ambient */}
        <div
          aria-hidden="true"
          style={{
            position:   "absolute",
            inset:      0,
            background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Particle sphere background */}
        <ParticleSphere />

        {/* Content */}
        <div
          style={{
            position:  "relative",
            zIndex:    1,
            textAlign: "center",
            maxWidth:  "640px",
          }}
        >
          {/* Animated check */}
          <div
            style={{
              display:        "flex",
              justifyContent: "center",
              marginBottom:   "32px",
            }}
          >
            <AnimatedCheck />
          </div>

          {/* Label */}
          <div
            style={{
              opacity:   0,
              animation: "springFlyIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s forwards",
              marginBottom: "16px",
            }}
          >
            <span className="terminal-label">&gt;&gt; CONFIRMADO</span>
          </div>

          {/* Title */}
          <h1
            className="font-extrabold tracking-tight text-white"
            style={{
              fontSize:     "clamp(2rem, 5vw, 3.5rem)",
              lineHeight:   1.1,
              marginBottom: "20px",
              opacity:      0,
              animation:    "springFlyIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.45s forwards",
            }}
          >
            Tu diagnóstico está{" "}
            <span
              style={{
                background:              "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                WebkitBackgroundClip:    "text",
                WebkitTextFillColor:     "transparent",
                backgroundClip:         "text",
              }}
            >
              agendado.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize:     "clamp(1rem, 2vw, 1.15rem)",
              color:        "rgba(255,255,255,0.55)",
              lineHeight:   1.7,
              maxWidth:     "520px",
              margin:       "0 auto",
              opacity:      0,
              animation:    "springFlyIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.62s forwards",
            }}
          >
            En menos de 24h recibirás la confirmación por email.{" "}
            <span style={{ color: "rgba(255,255,255,0.8)" }}>
              Prepárate — vamos a encontrar exactamente dónde está la fuga en tu negocio.
            </span>
          </p>
        </div>
      </section>

      {/* ── Lo que pasa ahora ───────────────────── */}
      <section
        style={{
          borderBottom: "1px solid #1f1f1f",
          padding:      "80px 24px",
        }}
      >
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <div style={{ marginBottom: "12px" }}>
              <span className="terminal-label">&gt;&gt; LO QUE PASA AHORA</span>
            </div>
            <h2
              className="font-extrabold tracking-tight text-white"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
            >
              Esto es lo que viene después.
            </h2>
          </div>

          {/* Cards row */}
          <div
            style={{
              display:        "flex",
              gap:            "20px",
              flexWrap:       "wrap",
              justifyContent: "center",
            }}
          >
            <StepCard
              num="PASO 01"
              emoji="🔍"
              title="Revisamos tu situación"
              body="Analizamos tu proceso actual antes de la llamada para no perder ni un minuto."
              delay={0.3}
            />
            <StepCard
              num="PASO 02"
              emoji="📞"
              title="La llamada de 30 min"
              body="Sin ventas. Solo diagnóstico honesto de dónde está la fuga en tu operación."
              delay={0.48}
            />
            <StepCard
              num="PASO 03"
              emoji="📄"
              title="Tu hoja de ruta"
              body="Te entregamos exactamente qué sistema necesitas y los resultados esperados."
              delay={0.66}
            />
          </div>
        </div>
      </section>

      {/* ── Mientras tanto ──────────────────────── */}
      <section
        style={{
          borderBottom: "1px solid #1f1f1f",
          padding:      "80px 24px",
          textAlign:    "center",
        }}
      >
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2
            className="font-extrabold tracking-tight text-white"
            style={{
              fontSize:     "clamp(1.4rem, 3vw, 2rem)",
              marginBottom: "10px",
            }}
          >
            Mientras esperas la llamada...
          </h2>
          <p
            style={{
              fontSize:     "0.95rem",
              color:        "rgba(255,255,255,0.4)",
              marginBottom: "36px",
              lineHeight:   1.6,
            }}
          >
            Síguenos para ver cómo los negocios que trabajan con nosotros escalan en tiempo real.
          </p>

          <div
            style={{
              display:        "flex",
              gap:            "14px",
              justifyContent: "center",
              flexWrap:       "wrap",
            }}
          >
            {/* WhatsApp CTA */}
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "8px",
                padding:        "14px 24px",
                background:     "#25D366",
                borderRadius:   "10px",
                color:          "#fff",
                fontWeight:     600,
                fontSize:       "0.9rem",
                textDecoration: "none",
                transition:     "opacity 0.2s",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
            >
              {/* WhatsApp icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Escríbenos por WhatsApp
            </a>

            {/* Instagram CTA */}
            <a
              href="#"
              style={{
                display:        "inline-flex",
                alignItems:     "center",
                gap:            "8px",
                padding:        "14px 24px",
                background:     "rgba(255,255,255,0.06)",
                border:         "1px solid rgba(255,255,255,0.12)",
                borderRadius:   "10px",
                color:          "rgba(255,255,255,0.8)",
                fontWeight:     600,
                fontSize:       "0.9rem",
                textDecoration: "none",
                transition:     "all 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background    = "rgba(255,255,255,0.10)";
                el.style.borderColor   = "rgba(255,255,255,0.22)";
                el.style.color         = "#fff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background    = "rgba(255,255,255,0.06)";
                el.style.borderColor   = "rgba(255,255,255,0.12)";
                el.style.color         = "rgba(255,255,255,0.8)";
              }}
            >
              {/* Instagram icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0" />
              </svg>
              Seguimos en Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────── */}
      <footer className="border-t border-[#1f1f1f] px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <span className="text-lg font-bold tracking-tight">
            Monk<span className="text-[#378ADD]">ei</span>a
          </span>
          <p className="text-sm text-white/30">
            © 2026 Monkeia · Sistemas de ventas autónomos para negocios que crecen.
          </p>
          <div className="flex items-center gap-6">
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-sm text-white/40 transition-colors duration-200 hover:text-[#378ADD]"
            >
              WhatsApp
            </a>
            <a
              href="mailto:hi@monkeia.com"
              className="cursor-pointer text-sm text-white/40 transition-colors duration-200 hover:text-[#378ADD]"
            >
              hi@monkeia.com
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
