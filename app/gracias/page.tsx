"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import * as THREE from "three";

const WA = "https://wa.me/50683225178";

/* ─────────────────────────────────────────────
   PARTICLE SPHERE — Three.js
───────────────────────────────────────────── */
function ParticleSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(500, 500);
    renderer.setClearColor(0x000000, 0);

    const N = 3000;
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1 + (Math.random() - 0.5) * 0.1;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.012,
      transparent: true,
      opacity: 0.6,
    });

    const mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      mesh.rotation.y += 0.003;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:    "absolute",
        top:         "50%",
        left:        "50%",
        transform:   "translate(-50%, -50%)",
        zIndex:      0,
        pointerEvents: "none",
        width:       "500px",
        height:      "500px",
      }}
    />
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
          minHeight:       "100vh",
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          justifyContent:  "center",
          paddingTop:      "120px",
          paddingBottom:   "72px",
          paddingLeft:     "24px",
          paddingRight:    "24px",
          borderBottom:    "1px solid #1f1f1f",
        }}
      >
        {/* Three.js particle sphere — fullscreen background */}
        <ParticleSphere />

        {/* Content */}
        <div
          style={{
            position:  "relative",
            zIndex:    10,
            textAlign: "center",
            maxWidth:  "640px",
          }}
        >
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
          background:    "#000",
          borderBottom:  "1px solid #1f1f1f",
          paddingTop:    "96px",
          paddingBottom: "80px",
          paddingLeft:   "24px",
          paddingRight:  "24px",
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

          <div style={{ maxWidth: "576px", margin: "0 auto", paddingLeft: "32px", paddingRight: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {(
              [
                {
                  n: "01",
                  title: "Revisamos tu situación",
                  desc: "Analizamos tu proceso antes de la llamada.",
                  transform: "rotate(-2deg)",
                  marginTop: "0",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>
                  ),
                },
                {
                  n: "02",
                  title: "La llamada de 30 min",
                  desc: "Sin ventas. Solo diagnóstico honesto.",
                  transform: "rotate(1.5deg)",
                  marginTop: "-12px",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.07 10.81a19.79 19.79 0 0 1-1.07-8.49A2 2 0 0 1 3.83 2h3.09a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.91 6.91l.61-.62a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                },
                {
                  n: "03",
                  title: "Tu hoja de ruta",
                  desc: "Recibes exactamente qué sistema necesitas.",
                  transform: "rotate(-1deg)",
                  marginTop: "-12px",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                      <line x1="9" y1="3" x2="9" y2="18" />
                      <line x1="15" y1="6" x2="15" y2="21" />
                    </svg>
                  ),
                },
              ] as { n: string; title: string; desc: string; transform: string; marginTop: string; icon: React.ReactNode }[]
            ).map((step) => (
              <div
                key={step.n}
                style={{
                  position:       "relative",
                  overflow:       "hidden",
                  background:     "rgba(15, 20, 40, 0.6)",
                  backdropFilter: "blur(12px)",
                  border:         "1px solid rgba(99, 130, 255, 0.15)",
                  borderRadius:   "16px",
                  padding:        "24px",
                  transform:      step.transform,
                  marginTop:      step.marginTop,
                }}
              >
                {/* Glow halo */}
                <div
                  style={{
                    position:      "absolute",
                    top:           "10%",
                    left:          "10%",
                    width:         "80%",
                    height:        "40%",
                    background:    "radial-gradient(ellipse at center, rgba(80, 80, 255, 0.25) 0%, rgba(120, 60, 255, 0.15) 40%, transparent 70%)",
                    filter:        "blur(15px)",
                    pointerEvents: "none",
                    zIndex:        0,
                  }}
                />
                {/* Glow line */}
                <div
                  style={{
                    position:      "absolute",
                    top:           "25%",
                    left:          "-5%",
                    width:         "110%",
                    height:        "2px",
                    background:    "linear-gradient(90deg, transparent 0%, rgba(120, 80, 255, 0.0) 10%, rgba(100, 120, 255, 0.9) 40%, rgba(180, 100, 255, 0.9) 50%, rgba(100, 120, 255, 0.9) 60%, rgba(120, 80, 255, 0.0) 90%, transparent 100%)",
                    filter:        "blur(1px)",
                    pointerEvents: "none",
                    zIndex:        0,
                  }}
                />
                {/* Content */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "0.7rem", letterSpacing: "0.12em", color: "rgba(100, 130, 255, 0.5)" }}>
                      {step.n}
                    </span>
                    <div
                      style={{
                        background:     "rgba(80, 100, 255, 0.15)",
                        border:         "1px solid rgba(80, 100, 255, 0.3)",
                        borderRadius:   "12px",
                        padding:        "10px",
                        display:        "flex",
                        alignItems:     "center",
                        justifyContent: "center",
                      }}
                    >
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white" style={{ marginTop: "16px" }}>{step.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", marginTop: "8px", lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              </div>
            ))}
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
