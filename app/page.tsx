"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const WA =
  "https://wa.me/50683225178?text=Hola%2C%20quiero%20solicitar%20el%20diagn%C3%B3stico%20gratuito%20de%20Monkeia";

const TIDYCAL = "https://tidycal.com/monkeia/aseseoria";

/* ─────────────────────────────────────────────
   BOOKING MODAL
───────────────────────────────────────────── */
function BookingModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "90vw",
          maxWidth: "800px",
          height: "85vh",
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "40px",
            height: "40px",
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
        <iframe
          src={TIDYCAL}
          width="100%"
          height="100%"
          style={{ border: "none", display: "block" }}
          title="Agendar sesión"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CURSOR GLOW
───────────────────────────────────────────── */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);

    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      cur.current.x = lerp(cur.current.x, pos.current.x, 0.08);
      cur.current.y = lerp(cur.current.y, pos.current.y, 0.08);
      if (ref.current) {
        ref.current.style.transform = `translate(${cur.current.x - 200}px, ${cur.current.y - 200}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] h-[400px] w-[400px] rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(55,138,221,0.03) 0%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   SCROLL SPRING HOOK
───────────────────────────────────────────── */
function useSpringVisible(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("spring-visible");
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return ref;
}

/* ─────────────────────────────────────────────
   METRIC COUNT-UP
───────────────────────────────────────────── */
function parseMetric(str: string) {
  const clean = str.replace(/,/g, "");
  const m = clean.match(/^([+$]*)(\d+(?:\.\d+)?)([xK%]*)$/);
  if (!m) return { prefix: "", num: 0, suffix: str, hasCommas: false };
  return {
    prefix: m[1],
    num: parseFloat(m[2]),
    suffix: m[3],
    hasCommas: str.includes(","),
  };
}

function MetricItem({ value, label }: { value: string; label: string }) {
  const { prefix, num, suffix, hasCommas } = parseMetric(value);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setVisible(true);
          const dur = 1800;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(eased * num));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [num]);

  const display = hasCommas ? count.toLocaleString("en-US") : String(count);

  return (
    <div ref={ref} className="text-center">
      <div
        className="mb-1 font-extrabold leading-none metric-value"
        style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)" }}
      >
        {prefix}{display}{suffix}
      </div>
      <div
        className={`metric-underline mx-auto mb-2 ${visible ? "underline-visible" : ""}`}
        style={{ maxWidth: "3rem" }}
      />
      <div className="text-xs leading-snug text-white/40">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CANVAS — Circuit board / neural infrastructure
───────────────────────────────────────────── */
function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const RGB = "55,138,221";
    let W = 0, H = 0;

    // Hub positions (0–1 relative) and labels
    const HUB_DEFS = [
      { rx: 0.12, ry: 0.22, label: "Meta" },
      { rx: 0.33, ry: 0.12, label: "Leads" },
      { rx: 0.56, ry: 0.18, label: "Pipeline" },
      { rx: 0.80, ry: 0.28, label: "CRM" },
      { rx: 0.88, ry: 0.62, label: "Dashboard" },
      { rx: 0.68, ry: 0.82, label: "Analytics" },
      { rx: 0.42, ry: 0.88, label: "WhatsApp" },
      { rx: 0.18, ry: 0.75, label: "IA" },
      { rx: 0.08, ry: 0.50, label: "Ads" },
      { rx: 0.50, ry: 0.50, label: "Core" },
    ];

    // PCB backbone traces (relative segment points)
    const TRACES = [
      [[0, 0.28], [0.25, 0.28], [0.25, 0.55], [0.56, 0.55], [0.56, 0.18]],
      [[1, 0.72], [0.70, 0.72], [0.70, 0.50], [0.42, 0.50], [0.42, 0.88]],
      [[0.33, 0], [0.33, 0.28], [0.80, 0.28], [0.80, 0.62]],
      [[0, 0.50], [0.08, 0.50], [0.08, 0.75], [0.50, 0.75], [0.50, 0.50], [0.68, 0.50], [0.68, 0.82]],
    ];

    type Hub = { x: number; y: number; label: string; glowPhase: number; litTimer: number };
    type RegNode = { x: number; y: number; vx: number; vy: number; r: number; ph: number };
    type Edge = { ax: number; ay: number; bx: number; by: number; mx: number; my: number };
    type Packet = { edge: Edge; t: number; speed: number; dir: 1 | -1 };
    type Burst = { hIdx: number; radius: number; hit: Set<number> };

    const hubs: Hub[] = [];
    const regNodes: RegNode[] = [];
    let edges: Edge[] = [];
    const packets: Packet[] = [];
    const bursts: Burst[] = [];
    let burstTimer = 0;

    const buildHubs = () => {
      hubs.length = 0;
      for (const d of HUB_DEFS) {
        hubs.push({ x: d.rx * W, y: d.ry * H, label: d.label, glowPhase: Math.random() * Math.PI * 2, litTimer: 0 });
      }
    };

    const buildRegNodes = () => {
      regNodes.length = 0;
      // 20 small (r=3), 25 medium (r=5), 15 large (r=8) = 60 nodes
      const specs = [{ r: 3, n: 20 }, { r: 5, n: 25 }, { r: 8, n: 15 }];
      for (const { r, n } of specs) {
        for (let i = 0; i < n; i++) {
          regNodes.push({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.13,
            vy: (Math.random() - 0.5) * 0.13,
            r, ph: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const buildEdges = () => {
      edges = [];
      packets.length = 0;
      const maxD = Math.sqrt(W * W + H * H) * 0.62;
      for (let i = 0; i < hubs.length; i++) {
        for (let j = i + 1; j < hubs.length; j++) {
          const a = hubs[i], b = hubs[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          if (Math.sqrt(dx * dx + dy * dy) < maxD) {
            // PCB L-shape elbow — randomly horizontal-first or vertical-first
            const hFirst = Math.random() > 0.5;
            edges.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, mx: hFirst ? b.x : a.x, my: hFirst ? a.y : b.y });
          }
        }
      }
      // 2–4 packets per edge, staggered
      for (const edge of edges) {
        const count = 2 + Math.floor(Math.random() * 3);
        for (let k = 0; k < count; k++) {
          packets.push({ edge, t: Math.random(), speed: 0.0018 + Math.random() * 0.004, dir: Math.random() > 0.5 ? 1 : -1 });
        }
      }
    };

    const ptOnEdge = (e: Edge, t: number): [number, number] => {
      if (t < 0.5) {
        const tt = t * 2;
        return [e.ax + (e.mx - e.ax) * tt, e.ay + (e.my - e.ay) * tt];
      }
      const tt = (t - 0.5) * 2;
      return [e.mx + (e.bx - e.mx) * tt, e.my + (e.by - e.my) * tt];
    };

    const setup = () => {
      const p = canvas.parentElement;
      if (!p) return;
      W = p.offsetWidth; H = p.offsetHeight;
      canvas.width = W; canvas.height = H;
      bursts.length = 0; burstTimer = 0;
      buildHubs(); buildRegNodes(); buildEdges();
    };

    const draw = (ts: number) => {
      ctx.clearRect(0, 0, W, H);

      // 1. Backbone PCB traces
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = `rgba(${RGB},0.04)`;
      for (const trace of TRACES) {
        ctx.beginPath();
        ctx.moveTo(trace[0][0] * W, trace[0][1] * H);
        for (let i = 1; i < trace.length; i++) ctx.lineTo(trace[i][0] * W, trace[i][1] * H);
        ctx.stroke();
      }

      // 2. Move regular nodes
      for (const n of regNodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }

      // 3. Hub-to-hub PCB edges
      ctx.lineWidth = 0.6;
      for (const e of edges) {
        ctx.beginPath();
        ctx.moveTo(e.ax, e.ay);
        ctx.lineTo(e.mx, e.my);
        ctx.lineTo(e.bx, e.by);
        ctx.strokeStyle = `rgba(${RGB},0.06)`;
        ctx.stroke();
      }

      // 4. Dynamic reg-node → nearest hub lines (only medium/large)
      ctx.lineWidth = 0.4;
      for (const n of regNodes) {
        if (n.r < 5) continue;
        let nearD = Infinity, nearH = -1;
        for (let hi = 0; hi < hubs.length; hi++) {
          const dx = n.x - hubs[hi].x, dy = n.y - hubs[hi].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 190 && d < nearD) { nearD = d; nearH = hi; }
        }
        if (nearH >= 0) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(hubs[nearH].x, hubs[nearH].y);
          ctx.strokeStyle = `rgba(${RGB},${0.02 + (1 - nearD / 190) * 0.05})`;
          ctx.stroke();
        }
      }

      // 5. Advance & draw packets
      for (const pk of packets) {
        pk.t += pk.speed * pk.dir;
        if (pk.t >= 1) pk.t = 0;
        else if (pk.t < 0) pk.t = 1;
        const [px, py] = ptOnEdge(pk.edge, pk.t);
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${RGB},1)`;
        ctx.fill();
      }

      // 6. Regular nodes
      for (const n of regNodes) {
        const pulse = (Math.sin(ts * 0.001 + n.ph) + 1) * 0.5;
        if (n.r >= 8) {
          // Slow ripple ring for large nodes
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 5 + pulse * 9, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${RGB},${0.04 + pulse * 0.07})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${RGB},${0.25 + pulse * 0.35})`;
        ctx.fill();
      }

      // 7. Hub nodes (permanent glow ring + core)
      for (let hi = 0; hi < hubs.length; hi++) {
        const hub = hubs[hi];
        const glow = (Math.sin(ts * 0.0006 + hub.glowPhase) + 1) * 0.5;
        const isLit = hub.litTimer > 0;
        if (isLit) hub.litTimer = Math.max(0, hub.litTimer - 1);

        // Permanent soft glow ring
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 18 + glow * 10, 0, Math.PI * 2);
        ctx.strokeStyle = isLit ? `rgba(255,255,255,0.4)` : `rgba(${RGB},${0.07 + glow * 0.14})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Hub circle (12px "size" → 6px radius)
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = isLit ? `rgba(255,255,255,0.9)` : `rgba(${RGB},0.65)`;
        ctx.fill();

        // Bright center dot
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = isLit ? `rgba(255,255,255,1)` : `rgba(${RGB},1)`;
        ctx.fill();
      }

      // 8. Signal bursts every 3s
      burstTimer++;
      if (burstTimer >= 180) {
        burstTimer = 0;
        const hIdx = Math.floor(Math.random() * hubs.length);
        bursts.push({ hIdx, radius: 0, hit: new Set([hIdx]) });
      }

      for (let bi = bursts.length - 1; bi >= 0; bi--) {
        const b = bursts[bi];
        b.radius += 2.5;
        for (let hi = 0; hi < hubs.length; hi++) {
          if (b.hit.has(hi)) continue;
          const dx = hubs[hi].x - hubs[b.hIdx].x;
          const dy = hubs[hi].y - hubs[b.hIdx].y;
          if (b.radius >= Math.sqrt(dx * dx + dy * dy)) {
            b.hit.add(hi);
            hubs[hi].litTimer = 45;
          }
        }
        const maxR = Math.sqrt(W * W + H * H) * 0.7;
        const alpha = Math.max(0, 0.35 * (1 - b.radius / maxR));
        ctx.beginPath();
        ctx.arc(hubs[b.hIdx].x, hubs[b.hIdx].y, b.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${RGB},${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (b.radius > maxR) bursts.splice(bi, 1);
      }

      raf = requestAnimationFrame(draw);
    };

    setup();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); setup(); raf = requestAnimationFrame(draw); });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/* ─────────────────────────────────────────────
   ANIMATED HERO HEADLINE
───────────────────────────────────────────── */
function AnimatedHeadline({ text, accent }: { text: string; accent: string }) {
  // Split full string into words, mark which belong to accent
  const allWords = `${text} ${accent}`.trim().split(" ");
  const textWords = text.trim().split(" ");
  const accentStart = textWords.length;

  return (
    <h1
      className="mb-6 font-extrabold leading-[1.04] tracking-tight text-white"
      style={{
        fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)",
        display: "flex",
        flexWrap: "wrap",
        gap: "0 0.28em",
        justifyContent: "center",
      }}
    >
      {allWords.map((word, i) => (
        <span
          key={i}
          className={`word-animate${i >= accentStart ? " text-[#378ADD]" : ""}`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
}

/* ─────────────────────────────────────────────
   CTA BUTTON (breathing glow + particle burst)
───────────────────────────────────────────── */
function CTAButton({
  children,
  large = false,
}: {
  children: React.ReactNode;
  large?: boolean;
}) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const burstRef = useRef<HTMLSpanElement>(null);

  const onEnter = useCallback(() => {
    const burst = burstRef.current;
    if (!burst) return;
    burst.innerHTML = "";
    for (let i = 0; i < 10; i++) {
      const p = document.createElement("span");
      const angle = (i / 10) * 360;
      const dist = 28 + Math.random() * 20;
      p.style.cssText = `
        position:absolute;left:50%;top:50%;
        width:4px;height:4px;border-radius:50%;
        background:#378ADD;pointer-events:none;
        transform:translate(-50%,-50%);
        transition:transform 0.45s cubic-bezier(0.22,1,0.36,1),opacity 0.45s ease;
        opacity:1;
      `;
      burst.appendChild(p);
      requestAnimationFrame(() => {
        const rad = (angle * Math.PI) / 180;
        p.style.transform = `translate(calc(-50% + ${Math.cos(rad) * dist}px), calc(-50% + ${Math.sin(rad) * dist}px))`;
        p.style.opacity = "0";
      });
    }
  }, []);

  return (
    <a
      ref={btnRef}
      href={TIDYCAL}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onEnter}
      className={`cta-breathe relative inline-flex cursor-pointer items-center justify-center overflow-visible rounded-lg bg-[#378ADD] font-semibold text-white transition-colors duration-200 hover:bg-[#2a6db5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#378ADD] ${large ? "px-10 py-5 text-base" : "px-8 py-4 text-sm"}`}
    >
      <span ref={burstRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      {children}
    </a>
  );
}

/* ─────────────────────────────────────────────
   CRM PIPELINE MOCKUP — Kanban board style
───────────────────────────────────────────── */
interface DealCard {
  company: string;
  contact: string;
  value: string;
  date: string;
}

interface PipelineStage {
  label: string;
  color: string;
  total: string;
  deals: DealCard[];
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    label: "Nuevo Lead",
    color: "#378ADD",
    total: "$7,400",
    deals: [
      { company: "Restaurante El Fogón", contact: "Carlos Mendez", value: "$2,400/mes", date: "Hoy, 9:42am" },
      { company: "Clínica Estética Glow", contact: "Ana Reyes", value: "$3,800", date: "Hoy, 11:15am" },
      { company: "Academia FitPro", contact: "Luis Torres", value: "$1,200/mes", date: "Ayer" },
    ],
  },
  {
    label: "Calificado",
    color: "#10b981",
    total: "$7,300",
    deals: [
      { company: "Ecommerce ModaLatam", contact: "Sofia Herrera", value: "$4,500", date: "Hace 2 días" },
      { company: "Coach Marco Vidal", contact: "Marco Vidal", value: "$2,800", date: "Hace 3 días" },
    ],
  },
  {
    label: "Propuesta",
    color: "#f59e0b",
    total: "$10,000",
    deals: [
      { company: "Universidad TechHub", contact: "Diana Flores", value: "$8,500", date: "Esta semana" },
      { company: "Influencer @nataliav", contact: "Natalia V.", value: "$1,500/mes", date: "Esta semana" },
    ],
  },
  {
    label: "Cerrado",
    color: "#8b5cf6",
    total: "$52,000",
    deals: [
      { company: "Gianpiero Fusco", contact: "Gianpiero F.", value: "$40,000", date: "Este mes" },
      { company: "Jimm Lavin", contact: "Jimm L.", value: "$12,000", date: "Este mes" },
    ],
  },
];

const FEED_EVENTS = [
  "→ Ana Reyes abrió propuesta",
  "→ Sofia Herrera respondió al seguimiento",
  "→ Sistema envió seguimiento automático",
  "→ Carlos Mendez calificado por IA",
  "→ Luis Torres avanzó a Calificado",
  "→ Gianpiero F. firmó contrato",
  "→ Marco Vidal vio demo de producto",
  "→ Diana Flores solicitó más información",
  "→ Natalia V. en fase de negociación",
  "→ Sistema cerró trato con Jimm L.",
];

const NOTIF_NAMES = [
  "Restaurante El Fogón",
  "Clínica Estética Glow",
  "Academia FitPro",
  "Ecommerce ModaLatam",
  "Coach Marco Vidal",
];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function DealCardItem({
  deal,
  color,
  flashNew,
}: {
  deal: DealCard;
  color: string;
  flashNew?: boolean;
}) {
  return (
    <div
      style={{
        background: flashNew ? `rgba(55,138,221,0.10)` : "rgba(255,255,255,0.04)",
        border: `1px solid ${flashNew ? "rgba(55,138,221,0.35)" : "rgba(255,255,255,0.08)"}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: "8px",
        padding: "12px",
        transition: "background 0.4s ease, border-color 0.4s ease",
      }}
    >
      {/* Company */}
      <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "6px", lineHeight: 1.2 }}>
        {deal.company}
      </div>
      {/* Contact */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="4" r="2.5" fill="rgba(255,255,255,0.4)" />
          <path d="M1.5 10.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{deal.contact}</span>
      </div>
      {/* Date */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.1" fill="none" />
          <line x1="1" y1="5" x2="11" y2="5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.1" />
          <line x1="4" y1="1" x2="4" y2="3.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.1" strokeLinecap="round" />
          <line x1="8" y1="1" x2="8" y2="3.5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>{deal.date}</span>
      </div>
      {/* Value */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="5" stroke={color} strokeWidth="1.1" fill="none" />
          <text x="6" y="9" textAnchor="middle" fontSize="6" fill={color} fontWeight="700">$</text>
        </svg>
        <span style={{ fontSize: "12px", fontWeight: 600, color }}>{deal.value}</span>
      </div>
    </div>
  );
}

function CRMMockup() {
  const [notif, setNotif] = useState<{ name: string; visible: boolean } | null>(null);
  const [feed, setFeed] = useState(FEED_EVENTS.slice(0, 3));
  const [flashIdx, setFlashIdx] = useState<number | null>(null);
  const notifIdx = useRef(0);
  const feedIdx = useRef(3);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    // Toast notification cycle every 4s
    const cycle = () => {
      const name = NOTIF_NAMES[notifIdx.current % NOTIF_NAMES.length];
      notifIdx.current++;
      setNotif({ name, visible: true });
      // Flash col-1 card 0 on new lead
      setFlashIdx(0);
      setTimeout(() => setFlashIdx(null), 1200);
      setTimeout(() => setNotif((n) => n ? { ...n, visible: false } : null), 2800);
    };
    const iv1 = setInterval(cycle, 4000);
    // initial fire after short delay
    setTimeout(cycle, 800);

    // Activity feed: rotate a new event every 2s
    const iv2 = setInterval(() => {
      const next = FEED_EVENTS[feedIdx.current % FEED_EVENTS.length];
      feedIdx.current++;
      setFeed((prev) => [...prev.slice(1), next]);
    }, 2000);

    return () => { clearInterval(iv1); clearInterval(iv2); };
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-[#1f1f1f] bg-[#0d0d0d]"
      role="img"
      aria-label="Vista previa del CRM pipeline de Monkeia"
    >
      {/* Mac traffic lights */}
      <div className="flex items-center gap-2 border-b border-[#1f1f1f] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>

      {/* App top bar */}
      <div className="flex items-center gap-3 border-b border-[#1f1f1f] bg-[#111] px-4 py-2">
        {/* Search mockup */}
        <div
          className="flex items-center gap-2 rounded-md px-3 py-1.5"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", minWidth: "110px" }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="5" cy="5" r="3.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            <line x1="8" y1="8" x2="11" y2="11" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className="text-[10px] text-white/25">Buscar deal…</span>
        </div>
        {/* Title */}
        <span className="flex-1 text-center font-mono text-[11px] font-semibold text-white/60">
          Pipeline activo
        </span>
        {/* Live badge */}
        <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold" style={{ background: "rgba(55,138,221,0.12)", color: "#378ADD", border: "1px solid rgba(55,138,221,0.25)" }}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#378ADD]" />
          En vivo
        </span>
      </div>

      {/* Toast notification */}
      {notif && (
        <div
          className={`absolute top-[72px] right-4 z-10 flex items-center gap-3 rounded-xl border bg-[#0a0a0a] px-4 py-3 ${notif.visible ? "crm-notif-enter" : "crm-notif-exit"}`}
          style={{ borderColor: "#378ADD50", boxShadow: "0 4px 24px rgba(55,138,221,0.2)" }}
        >
          <div
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: "#378ADD" }}
          >
            {getInitials(notif.name)}
          </div>
          <div>
            <div className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: "#378ADD" }}>
              Nuevo lead
            </div>
            <div className="text-xs font-semibold text-white">{notif.name}</div>
          </div>
          <span className="ml-1 h-1.5 w-1.5 rounded-full bg-[#378ADD] animate-pulse" />
        </div>
      )}

      {/* Pipeline Kanban board */}
      <div className="grid grid-cols-2 gap-2.5 p-3 md:grid-cols-4">
        {PIPELINE_STAGES.map((stage, si) => (
          <div key={stage.label} className="flex flex-col gap-2">
            {/* Column header */}
            <div style={{ marginBottom: "4px" }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                    {stage.label}
                  </span>
                </div>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                  style={{ backgroundColor: stage.color + "22", color: stage.color }}
                >
                  {stage.deals.length}
                </span>
              </div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", paddingLeft: "14px" }}>
                Total: {stage.total}
              </div>
            </div>

            {/* Deal cards */}
            <div className="flex flex-col gap-2">
              {stage.deals.map((deal, di) => (
                <DealCardItem
                  key={deal.company}
                  deal={deal}
                  color={stage.color}
                  flashNew={si === 0 && di === 0 && flashIdx === 0}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="border-t border-[#1f1f1f] px-4 py-2">
        <div className="flex flex-col gap-0.5 overflow-hidden" style={{ height: "46px" }}>
          {feed.map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="feed-item-enter font-mono text-[10px] text-white/40"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-[#1f1f1f] px-4 py-2">
        <span className="font-mono text-[10px] text-white/30">Último lead: hace 4 min</span>
        <span className="font-mono text-[10px] font-semibold text-[#378ADD]">
          Total pipeline: $76,700
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   CLIENTS CAROUSEL — commented out until proper logo assets are ready
───────────────────────────────────────────── */
// const CLIENT_LOGOS = [
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/06061006.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/93998646.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/45118424.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/38208107.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/83237380.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/84177002.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/92207640.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/09184483.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/39132042.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/61755945.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/23683169.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/27127318.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/46991891.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/14095959.png",
//   "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/04080665.png",
// ];
//
// const LOGOS_DOUBLED = [...CLIENT_LOGOS, ...CLIENT_LOGOS];
//
// function ClientsCarousel() {
//   return (
//     <section className="border-t border-[#1f1f1f] py-16 overflow-hidden">
//       <div className="mb-8 text-center">
//         <span className="terminal-label">&gt;&gt; NEGOCIOS QUE HAN CONFIADO EN NOSOTROS</span>
//       </div>
//       <div
//         style={{
//           WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
//           maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
//         }}
//       >
//         <div
//           style={{
//             display: "flex",
//             width: "max-content",
//             animation: "scrollLeft 30s linear infinite",
//             alignItems: "center",
//           }}
//         >
//           {LOGOS_DOUBLED.map((src, i) => (
//             <img
//               key={i}
//               src={src}
//               alt=""
//               aria-hidden="true"
//               style={{
//                 height: "48px",
//                 width: "auto",
//                 objectFit: "contain",
//                 margin: "0 48px",
//                 mixBlendMode: "screen",
//                 filter: "grayscale(100%) opacity(50%)",
//                 transition: "filter 0.4s ease",
//                 flexShrink: 0,
//               }}
//               onMouseEnter={(e) => {
//                 (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0%) opacity(100%)";
//               }}
//               onMouseLeave={(e) => {
//                 (e.currentTarget as HTMLImageElement).style.filter = "grayscale(100%) opacity(50%)";
//               }}
//             />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1f1f1f] bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <span className="text-xl font-bold tracking-tight">
          Monk<span className="text-[#378ADD]">ei</span>a
        </span>
        <CTAButton>Agendar diagnóstico gratis</CTAButton>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20">
      <NetworkBackground />

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Badge */}
        <div className="badge-float mb-6 inline-flex items-center gap-2 rounded-full border border-[#378ADD]/30 bg-[#378ADD]/[0.07] px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-[#378ADD] animate-pulse" />
          <span className="terminal-label" style={{ letterSpacing: "0.14em" }}>
            &gt;&gt; SISTEMA ACTIVO — PROCESANDO LEADS EN ESTE MOMENTO
          </span>
        </div>

        <AnimatedHeadline
          text="Tus leads llegan. Pero no se convierten."
          accent="Porque no tienes un sistema."
        />

        <div
          className="mx-auto mb-10 max-w-2xl text-white/60"
          style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
        >
          <p>Este sistema responde en segundos.</p>
          <p>Hace seguimiento automático.</p>
          <p>Y convierte leads en clientes. 24/7.</p>
          <p className="mt-4 text-white/40">Resultados en 30 días. O se sigue trabajando hasta lograrlos.</p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <CTAButton large>
            Quiero mi diagnóstico gratuito — Solo 5 cupos
          </CTAButton>
        </div>

        <div className="mx-auto mt-16 max-w-3xl crm-float">
          <CRMMockup />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROBLEM
───────────────────────────────────────────── */
function Problem() {
  const pains = [
    {
      icon: <IconClock />,
      title: "Respondes tarde.",
      body: "El lead se enfría. Compra en otro lado.",
      delay: 0,
    },
    {
      icon: <IconEye />,
      title: "No sabes qué pasó.",
      body: "Si abrió. Si leyó. Si desapareció.",
      delay: 120,
    },
    {
      icon: <IconUsers />,
      title: "Todo depende de alguien.",
      body: "Y eso no escala.",
      delay: 240,
    },
  ];

  return (
    <section className="relative border-t border-[#1f1f1f] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <span className="terminal-label">&gt;&gt; El problema</span>
        </div>
        <h2
          className="mb-4 text-balance text-center font-extrabold tracking-tight text-white"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
        >
          No es falta de leads.
        </h2>
        <p
          className="mb-16 text-center text-white/40"
          style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
        >
          Es lo que pasa después.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {pains.map((pain) => (
            <ProblemCard key={pain.title} pain={pain} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemCard({
  pain,
}: {
  pain: { icon: React.ReactNode; title: string; body: string; delay: number };
}) {
  const ref = useSpringVisible(0.15);

  return (
    <div
      ref={ref}
      className="card-problem rounded-2xl bg-[#0d0d0d] p-8"
      style={{ animationDelay: `${pain.delay}ms` }}
    >
      <div className="card-top-border" />
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#378ADD]/10 text-[#378ADD]">
        {pain.icon}
      </div>
      <h3 className="mb-3 text-lg font-bold leading-snug text-white">
        {pain.title}
      </h3>
      <p className="leading-relaxed text-white/50">{pain.body}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SOLUTION (canvas animation)
───────────────────────────────────────────── */
function Solution() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef  = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let gridOffset  = 0;
    let ring1Angle  = 0;
    let ring2Angle  = 0;
    let ring3Angle  = 0;
    let dashOffset  = 0;
    let centerFlash = 0; // 0-1, decays each frame

    // Active glowing intersection points: {gx, gy (grid indices), life (0→1)}
    const intersections: Array<{ gx: number; gy: number; life: number }> = [];
    let nextIntersection = Date.now() + 1500;

    // Signal bursts
    const signalBursts: Array<{ startTime: number }> = [];
    let nextBurst = Date.now() + 4000;

    const resize = () => {
      canvas.width  = 480;
      canvas.height = 480;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement ?? canvas);

    const B = (a: number) => `rgba(55,138,221,${a})`;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) { animRef.current = requestAnimationFrame(draw); return; }

      const now = Date.now();
      ctx.clearRect(0, 0, W, H);

      const cx = 240;
      const cy = 240;

      // ── Background radial gradient ──
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.6);
      bg.addColorStop(0, B(0.12));
      bg.addColorStop(1, "transparent");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Animated diagonal grid (barely visible: 0.025) ──
      gridOffset = (gridOffset + 0.2) % 40;
      ctx.strokeStyle = B(0.025);
      ctx.lineWidth = 1;
      for (let x = gridOffset - 40; x < W + 40; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = gridOffset - 40; y < H + 40; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ── Pulsing intersection points ──
      if (now > nextIntersection) {
        const cols = Math.floor(W / 40);
        const rows = Math.floor(H / 40);
        intersections.push({
          gx: Math.floor(Math.random() * cols),
          gy: Math.floor(Math.random() * rows),
          life: 0,
        });
        nextIntersection = now + 1500 + Math.random() * 1500;
      }
      for (let k = intersections.length - 1; k >= 0; k--) {
        const pt = intersections[k];
        pt.life += 0.012;
        if (pt.life >= 1) { intersections.splice(k, 1); continue; }
        const pulse = Math.sin(pt.life * Math.PI); // bell curve 0→1→0
        const px = pt.gx * 40 + gridOffset;
        const py = pt.gy * 40 + gridOffset;
        const gr = ctx.createRadialGradient(px, py, 0, px, py, 14 * pulse);
        gr.addColorStop(0, `rgba(55,138,221,${0.7 * pulse})`);
        gr.addColorStop(1, "transparent");
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(px, py, 14 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Card anchor points (canvas edges toward cards in grid) ──
      const anchors = [
        { x: 0,  y: cy }, // left edge  → card 1
        { x: W,  y: cy }, // right edge → card 2
        { x: cx, y: H  }, // bottom edge → card 3
      ];

      // ── Connecting lines + parallel depth line + data packets ──
      dashOffset -= 0.8;
      let flashThisFrame = 0;

      anchors.forEach((a, i) => {
        // Direction perpendicular to line (for parallel offset)
        const dx = cx - a.x;
        const dy = cy - a.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const nx = -dy / len; // perpendicular unit vector
        const ny =  dx / len;
        const OFF = 3; // px offset for parallel line

        // Primary dashed line – brighter
        ctx.strokeStyle = B(0.6);
        ctx.lineWidth = 1;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = dashOffset + i * 10;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // Secondary faint parallel line
        ctx.strokeStyle = B(0.18);
        ctx.lineWidth = 1;
        ctx.lineDashOffset = dashOffset + i * 10 + 3;
        ctx.beginPath();
        ctx.moveTo(a.x + nx * OFF, a.y + ny * OFF);
        ctx.lineTo(cx + nx * OFF, cy + ny * OFF);
        ctx.stroke();

        ctx.setLineDash([]);

        // 5 data packets per line with glow tails
        for (let d = 0; d < 5; d++) {
          const t = (now / 1400 + d / 5 + i * 0.18) % 1;
          if (t > 0.98) flashThisFrame = Math.max(flashThisFrame, (t - 0.98) / 0.02);

          const hx = a.x + (cx - a.x) * t;
          const hy = a.y + (cy - a.y) * t;

          // Glow tail (8 trailing dots, fading)
          for (let tail = 1; tail <= 8; tail++) {
            const tt = Math.max(0, t - tail * 0.016);
            const tx = a.x + (cx - a.x) * tt;
            const ty = a.y + (cy - a.y) * tt;
            const alpha = (1 - tail / 9) * 0.55;
            const r = Math.max(0.5, 4 - tail * 0.4);
            ctx.beginPath();
            ctx.arc(tx, ty, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(55,138,221,${alpha})`;
            ctx.fill();
          }

          // Main packet dot (5px)
          ctx.beginPath();
          ctx.arc(hx, hy, 5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.98)";
          ctx.fill();
          // Blue halo around packet
          const halo = ctx.createRadialGradient(hx, hy, 0, hx, hy, 14);
          halo.addColorStop(0, B(0.65));
          halo.addColorStop(1, "transparent");
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(hx, hy, 14, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Update center flash
      if (flashThisFrame > 0) centerFlash = Math.max(centerFlash, flashThisFrame);
      else centerFlash = Math.max(0, centerFlash - 0.04);

      // ── Signal burst trigger ──
      if (now > nextBurst) {
        signalBursts.push({ startTime: now });
        nextBurst = now + 4000;
      }

      // ── Signal bursts (drawn behind orb, at canvas coords) ──
      for (let k = signalBursts.length - 1; k >= 0; k--) {
        const elapsed = now - signalBursts[k].startTime;
        const burstDuration = 1200;
        if (elapsed > burstDuration) { signalBursts.splice(k, 1); continue; }
        const progress = elapsed / burstDuration;
        const maxRadius = Math.min(W, H) * 0.48;
        const radius = progress * maxRadius;
        const alpha = (1 - progress) * 0.7;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(120,180,255,${alpha})`;
        ctx.lineWidth = 2.5 * (1 - progress);
        ctx.stroke();
        // Second ring slightly behind
        const radius2 = Math.max(0, progress * maxRadius - 30);
        const alpha2 = (1 - progress) * 0.35;
        ctx.beginPath();
        ctx.arc(cx, cy, radius2, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(55,138,221,${alpha2})`;
        ctx.lineWidth = 1.5 * (1 - progress);
        ctx.stroke();
      }

      // ── Orb pulse scale (breathes 0.95→1.05 every 3 s) ──
      const pulsePhase = (now % 3000) / 3000;
      const orbScale   = 0.95 + 0.10 * (0.5 + 0.5 * Math.sin(pulsePhase * Math.PI * 2));

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(orbScale, orbScale);

      // ── 5-layer deep electric blue glow ──
      // Layer 5: 625px – outer halo
      const glow5 = ctx.createRadialGradient(0, 0, 0, 0, 0, 625);
      glow5.addColorStop(0,   "rgba(55,138,221,0.04)");
      glow5.addColorStop(1,   "transparent");
      ctx.fillStyle = glow5;
      ctx.beginPath(); ctx.arc(0, 0, 625, 0, Math.PI * 2); ctx.fill();

      // Layer 4: 375px
      const glow4 = ctx.createRadialGradient(0, 0, 0, 0, 0, 375);
      glow4.addColorStop(0,   "rgba(55,138,221,0.12)");
      glow4.addColorStop(1,   "transparent");
      ctx.fillStyle = glow4;
      ctx.beginPath(); ctx.arc(0, 0, 375, 0, Math.PI * 2); ctx.fill();

      // Layer 3: 250px
      const glow3 = ctx.createRadialGradient(0, 0, 0, 0, 0, 250);
      glow3.addColorStop(0,   "rgba(55,138,221,0.4)");
      glow3.addColorStop(1,   "transparent");
      ctx.fillStyle = glow3;
      ctx.beginPath(); ctx.arc(0, 0, 250, 0, Math.PI * 2); ctx.fill();

      // Layer 2: 134px
      const glow2 = ctx.createRadialGradient(0, 0, 0, 0, 0, 134);
      glow2.addColorStop(0,   "rgba(55,138,221,0.8)");
      glow2.addColorStop(1,   "transparent");
      ctx.fillStyle = glow2;
      ctx.beginPath(); ctx.arc(0, 0, 134, 0, Math.PI * 2); ctx.fill();

      // Layer 1: 66px – white core fading to solid blue
      const flashBoost = 0.0 + centerFlash * 0.3;
      const glow1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 66 + centerFlash * 25);
      glow1.addColorStop(0,   `rgba(255,255,255,${0.95 + flashBoost})`);
      glow1.addColorStop(0.35, "rgba(55,138,221,1)");
      glow1.addColorStop(1,   "transparent");
      ctx.fillStyle = glow1;
      ctx.beginPath(); ctx.arc(0, 0, 66 + centerFlash * 25, 0, Math.PI * 2); ctx.fill();

      // Ring 3 – outer dashed, clockwise (electric)
      ring3Angle += 0.001;
      ctx.save();
      ctx.rotate(ring3Angle);
      ctx.strokeStyle = "rgba(55,138,221,0.3)";
      ctx.lineWidth = 0.5;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, 200, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Ring 2 – counter-clockwise (electric)
      ring2Angle -= 0.002;
      ctx.save();
      ctx.rotate(ring2Angle);
      ctx.strokeStyle = "rgba(55,138,221,0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 150, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Ring 1 – clockwise, 6 bright white dots (electric)
      ring1Angle += 0.003;
      ctx.save();
      ctx.rotate(ring1Angle);
      ctx.strokeStyle = "rgba(120,180,255,0.9)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 100, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a   = (i / 6) * Math.PI * 2;
        const px  = Math.cos(a) * 100;
        const py  = Math.sin(a) * 100;
        // Dot glow halo
        const dgrd = ctx.createRadialGradient(px, py, 0, px, py, 12);
        dgrd.addColorStop(0, "rgba(120,180,255,0.7)");
        dgrd.addColorStop(1, "transparent");
        ctx.fillStyle = dgrd;
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fill();
        // Bright white dot
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fill();
      }
      ctx.restore();

      // Center label
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgba(255,255,255,${0.95 + centerFlash * 0.05})`;
      ctx.fillText("SISTEMA", 0, -7);
      ctx.fillText("MONKEIA", 0,  7);

      ctx.restore(); // end orb scale group

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, []);

  const mobileCards = [
    { dot: "#378ADD", title: "Captura leads al instante", sub: "Responde en segundos" },
    { dot: "#22c55e", title: "Hace seguimiento constante", sub: "Hasta que compran" },
    { dot: "#a855f7", title: "Y tú ves todo", sub: "En tiempo real" },
  ];

  return (
    <section
      className="border-t border-[#1f1f1f] relative"
      style={{
        overflow: "hidden",
        padding: "60px 0 40px",
        background: "#000",
      }}
    >
      {/* Section header */}
      <div className="px-6 pb-0 relative z-10 mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <span className="terminal-label">&gt;&gt; Cómo funciona</span>
        </div>
        <h2
          className="mb-4 text-balance text-center font-extrabold tracking-tight text-white"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
        >
          Esto lo cambia todo.
        </h2>
        <p
          className="text-center text-white/40"
          style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
        >
          No es un chatbot. No es un CRM.<br />
          Es un sistema. Diseñado a medida para tu negocio.
        </p>
      </div>

      {/* Desktop: Flexbox layout — cards + orb always visible */}
      <div className="hidden md:block" style={{ padding: "20px 0 0" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
            width: "100%",
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* Card 1 – left */}
          <div
            className="solution-card solution-float-1"
            style={{ flexShrink: 0, width: 200, minWidth: 200, maxWidth: 240 }}
          >
            {/* Inner radial glow */}
            <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 60, background: "radial-gradient(ellipse, rgba(55,138,221,0.15), transparent)", filter: "blur(20px)", pointerEvents: "none" }} />
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 6, position: "relative", wordWrap: "break-word", overflowWrap: "break-word" }}>
              Captura leads al instante
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, position: "relative", wordWrap: "break-word", overflowWrap: "break-word" }}>Responde en segundos</p>
            {/* Bottom glow line */}
            <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, width: "100%", background: "linear-gradient(90deg, transparent, #378ADD, transparent)", boxShadow: "0 0 20px 4px rgba(55,138,221,0.6), 0 0 40px 8px rgba(55,138,221,0.3)" }} />
          </div>

          {/* Canvas/Orb – center */}
          <div style={{ flexShrink: 0, width: 480, height: 480, position: "relative" }}>
            <canvas
              ref={canvasRef}
              style={{ width: 480, height: 480, display: "block" }}
            />
          </div>

          {/* Card 2 – right */}
          <div
            className="solution-card solution-float-2"
            style={{ flexShrink: 0, width: 200, minWidth: 200, maxWidth: 240 }}
          >
            {/* Inner radial glow */}
            <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 60, background: "radial-gradient(ellipse, rgba(55,138,221,0.15), transparent)", filter: "blur(20px)", pointerEvents: "none" }} />
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 6, position: "relative", wordWrap: "break-word", overflowWrap: "break-word" }}>
              Hace seguimiento constante
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, position: "relative", wordWrap: "break-word", overflowWrap: "break-word" }}>Hasta que compran</p>
            {/* Bottom glow line */}
            <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, width: "100%", background: "linear-gradient(90deg, transparent, #378ADD, transparent)", boxShadow: "0 0 20px 4px rgba(55,138,221,0.6), 0 0 40px 8px rgba(55,138,221,0.3)" }} />
          </div>
        </div>

        {/* Card 3 – centered below */}
        <div
          className="solution-card solution-float-3"
          style={{ width: 200, minWidth: 200, maxWidth: 240, margin: "16px auto 0", position: "relative", zIndex: 1 }}
        >
          {/* Inner radial glow */}
          <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 60, background: "radial-gradient(ellipse, rgba(55,138,221,0.15), transparent)", filter: "blur(20px)", pointerEvents: "none" }} />
          <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 6, textAlign: "center", position: "relative", wordWrap: "break-word", overflowWrap: "break-word" }}>
            Y tú ves todo
          </p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, textAlign: "center", position: "relative", wordWrap: "break-word", overflowWrap: "break-word" }}>En tiempo real</p>
          {/* Bottom glow line */}
          <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, width: "100%", background: "linear-gradient(90deg, transparent, #378ADD, transparent)", boxShadow: "0 0 20px 4px rgba(55,138,221,0.6), 0 0 40px 8px rgba(55,138,221,0.3)" }} />
        </div>
      </div>

      {/* Mobile: simple vertical list */}
      <div className="md:hidden px-6 pt-10 pb-20 flex flex-col gap-4 max-w-sm mx-auto">
        {mobileCards.map((card, i) => (
          <div key={i} className="solution-card">
            {/* Inner radial glow */}
            <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 60, background: "radial-gradient(ellipse, rgba(55,138,221,0.15), transparent)", filter: "blur(20px)", pointerEvents: "none" }} />
            <p style={{ color: "#fff", fontWeight: 600, fontSize: 15, marginBottom: 6, position: "relative" }}>
              {card.title}
            </p>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, position: "relative" }}>{card.sub}</p>
            {/* Bottom glow line */}
            <div style={{ position: "absolute", bottom: 0, left: 0, height: 2, width: "100%", background: "linear-gradient(90deg, transparent, #378ADD, transparent)", boxShadow: "0 0 20px 4px rgba(55,138,221,0.6), 0 0 40px 8px rgba(55,138,221,0.3)" }} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROOF (rotating border cards)
───────────────────────────────────────────── */
function Proof() {
  const cases = [
    {
      name: "Gianpiero Fusco",
      role: "Fundador, sector inmobiliario",
      metrics: [
        { value: "$40,000", label: "en ventas" },
        { value: "3x",      label: "retorno" },
        { value: "897K",    label: "impresiones" },
      ],
      quote:
        "Antes perdía leads todos los días. Ahora el sistema los trabaja solo.",
    },
    {
      name: "Jimm Lavin",
      role: "Director comercial, servicios B2B",
      metrics: [
        { value: "+250%",  label: "leads calificados" },
        { value: "3x",     label: "ROI" },
        { value: "+500K",  label: "alcance" },
      ],
      quote:
        "Dejé de depender de mi equipo para el seguimiento. El sistema lo hace todo.",
    },
  ];

  return (
    <section className="border-t border-[#1f1f1f] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <span className="terminal-label">&gt;&gt; Resultados de clientes</span>
        </div>
        <h2
          className="mb-16 text-balance text-center font-extrabold tracking-tight text-white"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
        >
          Funciona.
        </h2>

        <div className="grid gap-8 lg:grid-cols-2">
          {cases.map((c) => (
            <div
              key={c.name}
              className="proof-card border border-[#1f1f1f] bg-[#0d0d0d] p-8"
            >
              <div className="relative z-10">
                <div className="mb-8 grid grid-cols-3 gap-4 border-b border-[#1f1f1f] pb-8">
                  {c.metrics.map((m) => (
                    <MetricItem key={m.label} value={m.value} label={m.label} />
                  ))}
                </div>
                <blockquote className="mb-6 border-l-2 border-[#378ADD] pl-4 text-base leading-relaxed text-white/70 italic">
                  &ldquo;{c.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#378ADD]/10 font-bold text-[#378ADD]">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-sm text-white/40">{c.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
const SERVICE_CARDS = [
  {
    badge: "Para empezar",
    badgeColor: "gray" as const,
    title: "Auditoría + Hoja de Ruta",
    description:
      "Analizamos tu proceso actual de ventas y leads. Te entregamos un documento con exactamente dónde se rompe tu embudo y qué sistema necesitas.",
    features: [
      "Análisis de tu proceso actual",
      "Identificación de puntos de fuga",
      "Hoja de ruta de implementación",
      "Se descuenta si contratas el sistema",
    ],
    cta: "Solicitar auditoría",
    featured: false,
  },
  {
    badge: "Más solicitado",
    badgeColor: "blue" as const,
    title: "Solución Específica",
    description:
      "Implementamos la pieza exacta que tu negocio necesita. Desde un bot de WhatsApp hasta un dashboard conectado a Meta Ads.",
    features: [
      "Diagnóstico gratuito incluido",
      "Implementación en menos de 2 semanas",
      "IA + supervisión humana",
      "30 días de soporte incluido",
    ],
    cta: "Agendar diagnóstico gratis",
    featured: true,
  },
  {
    badge: "Proyectos grandes",
    badgeColor: "purple" as const,
    title: "Sistema Completo a Medida",
    description:
      "Para negocios que necesitan un sistema completo: captura, calificación, nurturing, cierre y dashboard. Todo conectado. Todo automatizado.",
    features: [
      "Auditoría incluida",
      "Diseño e implementación completa",
      "IA + equipo humano de supervisión",
      "Soporte y optimización continua",
    ],
    cta: "Hablar con el equipo",
    featured: false,
  },
];

function Services() {
  const ref = useSpringVisible();
  return (
    <section
      className="px-6 py-28"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div ref={ref} className="spring-hidden mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-5">
            <span className="terminal-label">&gt;&gt; LO QUE HACEMOS</span>
          </div>
          <h2
            className="mb-4 font-extrabold tracking-tight text-white"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
          >
            Elige por dónde empezar.
          </h2>
          <p
            className="mx-auto max-w-xl text-balance leading-relaxed text-white/50"
            style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)" }}
          >
            Cada negocio es diferente. Por eso cada sistema se diseña a medida.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-3">
          {SERVICE_CARDS.map((card) => (
            <div
              key={card.title}
              className="relative flex flex-col overflow-hidden"
              style={
                card.featured
                  ? {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(16,185,129,0.4)",
                      borderRadius: "16px",
                      padding: "28px",
                      transform: "scale(1.03)",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      padding: "28px",
                    }
              }
            >
              {/* Green glow from top for featured card */}
              {card.featured && (
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "200px",
                    background:
                      "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(16,185,129,0.3) 0%, transparent 60%)",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Top row: label + badge */}
              <div className="mb-5 flex items-center justify-between">
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.07em",
                    color: card.badgeColor === "purple" ? "#a78bfa" : "rgba(255,255,255,0.45)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                  }}
                >
                  {card.badge}
                </span>
                {card.featured && (
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#10b981",
                      border: "1px solid rgba(16,185,129,0.4)",
                      borderRadius: "999px",
                      padding: "3px 10px",
                    }}
                  >
                    MÁS SOLICITADO
                  </span>
                )}
              </div>

              {/* Divider */}
              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "20px" }} />

              {/* Title */}
              <h3
                className="mb-3 font-bold leading-snug text-white"
                style={{ fontSize: card.featured ? "1.2rem" : "1.05rem" }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p className="mb-6 text-sm leading-relaxed text-white/50">
                {card.description}
              </p>

              {/* Features */}
              <ul className="mb-8 flex flex-col gap-2.5">
                {card.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5"
                    style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)" }}
                  >
                    {/* Checkmark circle */}
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: card.featured
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(255,255,255,0.06)",
                        border: card.featured
                          ? "1px solid rgba(16,185,129,0.4)"
                          : "1px solid rgba(255,255,255,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "1px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke={card.featured ? "#10b981" : "rgba(255,255,255,0.5)"}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ width: "8px", height: "8px" }}
                        aria-hidden="true"
                      >
                        <polyline points="2 6 5 9 10 3" />
                      </svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-auto">
                <a
                  href={TIDYCAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center font-semibold transition-opacity duration-200 hover:opacity-80"
                  style={{
                    width: "100%",
                    height: "44px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    background: card.featured
                      ? "#10b981"
                      : "rgba(255,255,255,0.07)",
                    color: card.featured ? "#fff" : "rgba(255,255,255,0.8)",
                    border: card.featured
                      ? "none"
                      : "1px solid rgba(255,255,255,0.1)",
                    textDecoration: "none",
                  }}
                >
                  {card.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   EXCLUSIVITY
───────────────────────────────────────────── */
function Exclusivity() {
  return (
    <section className="border-t border-[#1f1f1f] px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="scanline-5 mb-4 select-none" aria-hidden="true">
          <span
            className="glitch-5 font-black leading-none"
            style={{
              fontSize: "clamp(6rem, 20vw, 14rem)",
              color: "rgba(55,138,221,0.15)",
              display: "inline-block",
            }}
          >
            5
          </span>
        </div>

        <h2
          className="relative -mt-6 mb-6 font-extrabold tracking-tight text-white"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
        >
          No es para todos.
        </h2>

        <p
          className="mx-auto max-w-xl text-balance leading-relaxed text-white/50"
          style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
        >
          Solo 5 negocios por mes.
          <br />
          Porque cada sistema se diseña e implementa a medida para tu negocio.
          <br />
          Y se optimiza hasta que funcione.
        </p>

        <p
          className="mx-auto mt-6 max-w-xl text-balance text-white/30"
          style={{ fontSize: "clamp(0.875rem, 1.5vw, 1rem)" }}
        >
          No ves resultados en 30 días — se sigue trabajando. Sin costo.
        </p>

        <div className="mt-10 flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-[#378ADD]/20 bg-[#378ADD]/5 px-6 py-3">
            <span className="h-2 w-2 rounded-full bg-[#378ADD] animate-pulse" />
            <span className="terminal-label" style={{ letterSpacing: "0.14em" }}>
              Quedan 3 cupos
            </span>
          </div>
          <CTAButton large>
            Asegurar mi cupo ahora
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section id="cta" className="border-t border-[#1f1f1f] px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 text-center">
          <span className="terminal-label">&gt;&gt; Arrancá hoy</span>
        </div>
        <h2
          className="mb-6 text-balance font-extrabold tracking-tight text-white"
          style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}
        >
          30 minutos. Eso es todo lo que necesitas.
        </h2>
        <p
          className="mb-10 text-balance leading-relaxed text-white/50"
          style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
        >
          Para ver cuántos leads pierdes, dónde se rompen tus ventas, y qué sistema necesitas.
        </p>
        <CTAButton large>
          Solicitar diagnóstico gratuito
        </CTAButton>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-[#1f1f1f] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <span className="text-lg font-bold tracking-tight">
          Monk<span className="text-[#378ADD]">ei</span>a
        </span>
        <p className="text-sm text-white/30">© 2026 Monkeia · Sistemas de ventas autónomos para negocios que crecen.</p>
        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/monkeia"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-sm text-white/40 transition-colors duration-200 hover:text-[#378ADD]"
          >
            Instagram
          </a>
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-sm text-white/40 transition-colors duration-200 hover:text-[#378ADD]"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   HOME
───────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        {/* <ClientsCarousel /> */}
        <Problem />
        <Solution />
        <Proof />
        <Services />
        <Exclusivity />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────
   ICONS
───────────────────────────────────────────── */
function IconClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
      className="h-6 w-6" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
      className="h-6 w-6" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
      className="h-6 w-6" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
