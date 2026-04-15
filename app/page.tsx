"use client";

import { useEffect, useRef, useState, useCallback, createContext, useContext, useMemo } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

// -- SQL to run once in Supabase dashboard --
// create table quiz_results (
//   id uuid default gen_random_uuid() primary key,
//   score int,
//   q1 text, q2 text, q3 text, q4 text, q5 text,
//   whatsapp text,
//   created_at timestamp with time zone default now()
// );

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
    if (url && key) _supabase = createClient(url, key);
  }
  return _supabase;
}

const WA =
  "https://wa.me/50683225178?text=Hola%2C%20quiero%20solicitar%20el%20diagn%C3%B3stico%20gratuito%20de%20Monkeia";

const TIDYCAL = "https://tidycal.com/monkeia/aseseoria?redirect=https://monkeia-landing.vercel.app/gracias";

/* ─────────────────────────────────────────────
   BOOKING MODAL CONTEXT
───────────────────────────────────────────── */
const BookingModalContext = createContext<(() => void) | null>(null);
function useOpenBooking() {
  const open = useContext(BookingModalContext);
  if (!open) throw new Error("useOpenBooking must be used inside BookingModalContext.Provider");
  return open;
}

/* ─────────────────────────────────────────────
   BOOKING MODAL
───────────────────────────────────────────── */
function BookingModal({ onClose }: { onClose: () => void }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Card */}
      <div
        className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a] sm:max-w-2xl"
        style={{ height: "min(90dvh, 680px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          ✕
        </button>

        {/* Loading spinner */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="h-10 w-10 animate-spin text-white/40"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          </div>
        )}

        {/* Mobile: 100dvh full screen; desktop: fixed height */}
        <iframe
          src={TIDYCAL}
          width="100%"
          className="block h-full w-full sm:h-full"
          style={{ border: "none", height: "100%" }}
          title="Agendar sesión"
          onLoad={() => setLoaded(true)}
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

    // Hub positions (0â€“1 relative) and labels
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
      // 2â€“4 packets per edge, staggered
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
        gap: "0 0.3em",
        justifyContent: "center",
      }}
    >
      {allWords.map((word, i) => (
        <span
          key={i}
          className={`word-animate${i >= accentStart ? " text-[#378ADD]" : ""}`}
          style={{ animationDelay: `${i * 80}ms`, display: "inline-block" }}
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
  const openBooking = useOpenBooking();
  const btnRef = useRef<HTMLButtonElement>(null);
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
    <button
      ref={btnRef}
      onClick={openBooking}
      onMouseEnter={onEnter}
      className={`cta-breathe relative inline-flex cursor-pointer items-center justify-center overflow-visible rounded-lg bg-[#378ADD] font-semibold text-white transition-colors duration-200 hover:bg-[#2a6db5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#378ADD] ${large ? "px-10 py-5 text-base" : "px-8 py-4 text-sm"}`}
    >
      <span ref={burstRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────
   CRM PIPELINE MOCKUP — Kanban board style
───────────────────────────────────────────── */
interface DealCard {
  id: string;
  company: string;
  contact: string;
  value: string;
  numericValue: number;
  date: string;
}

interface PipelineStage {
  label: string;
  color: string;
  deals: DealCard[];
}

const INITIAL_STAGES: PipelineStage[] = [
  {
    label: "Nuevo Lead",
    color: "#378ADD",
    deals: [
      { id: "d1", company: "Restaurante El Fogón", contact: "Carlos Mendez", value: "$2,400/mes", numericValue: 2400, date: "Hoy, 9:42am" },
      { id: "d2", company: "Clínica Estética Glow", contact: "Ana Reyes", value: "$3,800", numericValue: 3800, date: "Hoy, 11:15am" },
      { id: "d3", company: "Academia FitPro", contact: "Luis Torres", value: "$1,200/mes", numericValue: 1200, date: "Ayer" },
    ],
  },
  {
    label: "Calificado",
    color: "#10b981",
    deals: [
      { id: "d4", company: "Ecommerce ModaLatam", contact: "Sofia Herrera", value: "$4,500", numericValue: 4500, date: "Hace 2 días" },
      { id: "d5", company: "Coach Marco Vidal", contact: "Marco Vidal", value: "$2,800", numericValue: 2800, date: "Hace 3 días" },
    ],
  },
  {
    label: "Propuesta",
    color: "#f59e0b",
    deals: [
      { id: "d6", company: "Universidad TechHub", contact: "Diana Flores", value: "$8,500", numericValue: 8500, date: "Esta semana" },
      { id: "d7", company: "Influencer @nataliav", contact: "Natalia V.", value: "$1,500/mes", numericValue: 1500, date: "Esta semana" },
    ],
  },
  {
    label: "Cerrado",
    color: "#8b5cf6",
    deals: [
      { id: "d8", company: "Gianpiero Fusco", contact: "Gianpiero F.", value: "$40,000", numericValue: 40000, date: "Este mes" },
      { id: "d9", company: "Jimm Lavin", contact: "Jimm L.", value: "$12,000", numericValue: 12000, date: "Este mes" },
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

const NEW_LEAD_POOL: Omit<DealCard, "id" | "date">[] = [
  { company: "Distribuidora Arias & Hijos", contact: "Roberto Arias", value: "$1,800/mes", numericValue: 1800 },
  { company: "Consultora BizGrow MX", contact: "Fernanda López", value: "$3,200", numericValue: 3200 },
  { company: "Spa Bienestar Total", contact: "Valeria Ruiz", value: "$950/mes", numericValue: 950 },
  { company: "Importadora TechSur", contact: "Andrés Castillo", value: "$5,500", numericValue: 5500 },
  { company: "Agencia Digital Rocket", contact: "Pablo Moreno", value: "$2,100/mes", numericValue: 2100 },
  { company: "Joyería Oro & Arte", contact: "Carmen Delgado", value: "$1,400", numericValue: 1400 },
  { company: "Clínica Dental Sonrisa", contact: "Dr. Héctor Vega", value: "$2,800", numericValue: 2800 },
  { company: "Inmobiliaria Alta Vista", contact: "Marcela Fuentes", value: "$6,000", numericValue: 6000 },
  { company: "Academia de Inglés Oxford", contact: "Sandra Jiménez", value: "$1,100/mes", numericValue: 1100 },
  { company: "Ferretería Los Andes", contact: "Juan Pérez", value: "$2,300", numericValue: 2300 },
];

function sumDeals(deals: DealCard[]): string {
  const total = deals.reduce((acc, d) => acc + d.numericValue, 0);
  return "$" + total.toLocaleString("en-US");
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function DealCardItem({
  deal,
  color,
  isNew,
  onDragStart,
  onDragEnd,
}: {
  deal: DealCard;
  color: string;
  isNew?: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={isNew ? "crm-card-new" : ""}
      style={{
        background: isNew ? `rgba(55,138,221,0.10)` : "rgba(255,255,255,0.04)",
        border: `1px solid ${isNew ? "rgba(55,138,221,0.35)" : "rgba(255,255,255,0.08)"}`,
        borderLeft: `3px solid ${color}`,
        borderRadius: "8px",
        padding: "12px",
        cursor: "grab",
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
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES);
  const [notif, setNotif] = useState<{ name: string; value: string; visible: boolean } | null>(null);
  const [feed, setFeed] = useState(FEED_EVENTS.slice(0, 3));
  const [newDealIds, setNewDealIds] = useState<Set<string>>(new Set());
  const [colsVisible, setColsVisible] = useState(false);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [lastLeadLabel, setLastLeadLabel] = useState("hace 4 min");

  const dragRef = useRef<{ dealId: string; fromCol: number } | null>(null);
  const feedIdx = useRef(3);
  const leadPoolIdx = useRef(0);
  const leadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Trigger staggered column entrance
  useEffect(() => {
    const t = setTimeout(() => setColsVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // Activity feed: rotate a new event every 2s
    const iv2 = setInterval(() => {
      const next = FEED_EVENTS[feedIdx.current % FEED_EVENTS.length];
      feedIdx.current++;
      setFeed((prev) => [...prev.slice(1), next]);
    }, 2000);

    // New lead every 8-12s
    function scheduleNewLead() {
      const delay = 8000 + Math.random() * 4000;
      leadTimerRef.current = setTimeout(() => {
        const pool = NEW_LEAD_POOL[leadPoolIdx.current % NEW_LEAD_POOL.length];
        leadPoolIdx.current++;
        const id = `lead-${Date.now()}`;
        const newDeal: DealCard = { ...pool, id, date: "Ahora mismo" };

        setStages((prev) => {
          const next = prev.map((s) => ({ ...s, deals: [...s.deals] }));
          next[0] = { ...next[0], deals: [newDeal, ...next[0].deals] };
          return next;
        });
        setNewDealIds((prev) => new Set([...prev, id]));
        setNotif({ name: pool.company, value: pool.value, visible: true });
        setLastLeadLabel("ahora mismo");
        setFeed((prev) => {
          const evt = `→ ${pool.contact} ingresó al pipeline`;
          return [...prev.slice(1), evt];
        });

        // Clear new-card highlight after animation
        setTimeout(() => setNewDealIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        }), 1500);

        // Hide toast after 3s
        setTimeout(() => setNotif((n) => n ? { ...n, visible: false } : null), 3000);

        scheduleNewLead();
      }, delay);
    }
    scheduleNewLead();

    return () => {
      clearInterval(iv2);
      if (leadTimerRef.current) clearTimeout(leadTimerRef.current);
    };
  }, []);

  function handleDragStart(e: React.DragEvent, fromCol: number, dealId: string) {
    dragRef.current = { dealId, fromCol };
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, colIdx: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(colIdx);
  }

  function handleDragLeave(e: React.DragEvent) {
    // Only clear if leaving the column container itself
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDragOver(null);
    }
  }

  function handleDrop(e: React.DragEvent, toColIdx: number) {
    e.preventDefault();
    setDragOver(null);
    if (!dragRef.current) return;
    const { dealId, fromCol } = dragRef.current;
    dragRef.current = null;
    if (fromCol === toColIdx) return;

    setStages((prev) => {
      const next = prev.map((s) => ({ ...s, deals: [...s.deals] }));
      const dealIdx = next[fromCol].deals.findIndex((d) => d.id === dealId);
      if (dealIdx === -1) return prev;
      const [deal] = next[fromCol].deals.splice(dealIdx, 1);
      next[toColIdx].deals.unshift(deal);
      return next;
    });
  }

  function handleDragEnd() {
    dragRef.current = null;
    setDragOver(null);
  }

  const pipelineTotal = stages.reduce((acc, s) => acc + s.deals.reduce((a, d) => a + d.numericValue, 0), 0);
  const STAGGER_DELAYS = [0, 90, 180, 270];

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
        <span className="flex-1 text-center font-mono text-[11px] font-semibold text-white/60">
          Pipeline activo
        </span>
        {/* Live badge — ping animation */}
        <span className="flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold" style={{ background: "rgba(55,138,221,0.12)", color: "#378ADD", border: "1px solid rgba(55,138,221,0.25)" }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#378ADD] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#378ADD]" />
          </span>
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
            <div className="text-[10px] font-semibold" style={{ color: "#378ADD" }}>{notif.value}</div>
          </div>
          <span className="ml-1 h-1.5 w-1.5 rounded-full bg-[#378ADD] animate-pulse" />
        </div>
      )}

      {/* Pipeline Kanban board */}
      <div className="grid grid-cols-2 gap-2.5 p-3 md:grid-cols-4">
        {stages.map((stage, si) => (
          <div
            key={stage.label}
            className={`flex flex-col gap-2 ${colsVisible ? "crm-col-enter" : "opacity-0"}`}
            style={colsVisible ? { animationDelay: `${STAGGER_DELAYS[si]}ms` } : {}}
            onDragOver={(e) => handleDragOver(e, si)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, si)}
          >
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
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", paddingLeft: "14px", transition: "all 0.5s ease" }}>
                Total: {sumDeals(stage.deals)}
              </div>
            </div>

            {/* Cards — drop zone highlight when dragging over */}
            <div
              className="flex flex-col gap-2 rounded-lg transition-all duration-200"
              style={{
                minHeight: "60px",
                background: dragOver === si ? `${stage.color}0d` : "transparent",
                border: dragOver === si ? `1px dashed ${stage.color}55` : "1px solid transparent",
                padding: dragOver === si ? "4px" : "0",
              }}
            >
              {stage.deals.map((deal) => (
                <DealCardItem
                  key={deal.id}
                  deal={deal}
                  color={stage.color}
                  isNew={newDealIds.has(deal.id)}
                  onDragStart={(e) => handleDragStart(e, si, deal.id)}
                  onDragEnd={handleDragEnd}
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
        <span className="font-mono text-[10px] text-white/30">Último lead: {lastLeadLabel}</span>
        <span className="font-mono text-[10px] font-semibold text-[#378ADD]">
          Total pipeline: ${pipelineTotal.toLocaleString("en-US")}
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
        <Image src="/logo.svg" alt="Monkeia" width={120} height={40} style={{objectFit: 'contain'}} />
        <CTAButton>Diagnóstico gratis</CTAButton>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden px-6 pt-32 pb-20">
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
          text="El 78% de tus leads le compra al primero que responde."
          accent="¿Ese primero eres tú?"
        />

        <div
          className="mx-auto mb-10 max-w-2xl text-white/60"
          style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)" }}
        >
          <p>Mientras duermes, el sistema trabaja.</p>
          <p>Cada lead respondido. Cada venta perseguida.</p>
          <p>Solo.</p>
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
   WORKFLOW ROADMAP
───────────────────────────────────────────── */
type WFStep = {
  badge: string;
  color: string;
  title: string;
  body: string;
  tag: string;
  side: "left" | "right" | "center";
};

// Layout constants (px) — shared between cards and SVG overlay
const WF_CONTAINER_W = 760;
const WF_CARD_W      = 280;
const WF_CARD_H      = 190; // estimated card height for SVG endpoint calc
const WF_ROW_GAP     = 240; // vertical distance between card tops
const WF_TOP_START   = 0;

const WF_X: Record<"left" | "right" | "center", number> = {
  left:   0,
  right:  WF_CONTAINER_W - WF_CARD_W,          // 480
  center: (WF_CONTAINER_W - WF_CARD_W) / 2,   // 240
};

// Horizontal center of each card
const WF_CX: Record<"left" | "right" | "center", number> = {
  left:   WF_X.left   + WF_CARD_W / 2,   // 140
  right:  WF_X.right  + WF_CARD_W / 2,   // 620
  center: WF_X.center + WF_CARD_W / 2,   // 380
};

function wfCardTop(idx: number): number {
  return WF_TOP_START + idx * WF_ROW_GAP;
}

// Cubic-bezier path: bottom-center of card[from] → top-center of card[to]
function wfPath(steps: WFStep[], from: number, to: number): string {
  const x0 = WF_CX[steps[from].side];
  const y0 = wfCardTop(from) + WF_CARD_H;
  const x1 = WF_CX[steps[to].side];
  const y1 = wfCardTop(to);
  const my = (y0 + y1) / 2;
  return `M${x0},${y0} C${x0},${my} ${x1},${my} ${x1},${y1}`;
}

const WF_STEPS: WFStep[] = [
  { badge: "PASO 01", color: "#378ADD", side: "left",   title: "Agendas el diagnóstico",  body: "30 minutos gratis. Nos cuentas tu situación actual.",                         tag: "● Zoom call"       },
  { badge: "PASO 02", color: "#10b981", side: "right",  title: "Revisamos tu operación",   body: "IA analiza la llamada y detecta exactamente dónde pierdes ventas.",            tag: "● IA activa"       },
  { badge: "PASO 03", color: "#f59e0b", side: "left",   title: "Recibes tu hoja de ruta",  body: "Documento con qué sistema necesitas y resultados esperados.",                  tag: "● Entregable PDF"  },
  { badge: "PASO 04", color: "#8b5cf6", side: "right",  title: "Construimos tu sistema",   body: "Implementamos a medida. Tú ves el avance en tiempo real.",                    tag: "● A tu ritmo"      },
  { badge: "PASO 05", color: "#378ADD", side: "center", title: "Tu negocio en automático", body: "30 días o seguimos trabajando sin costo adicional.",                           tag: "● Garantía incluida" },
];

function WorkflowCard({ step, idx }: { step: WFStep; idx: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${idx * 200}ms`;
          el.classList.add("wf-card-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [idx]);

  return (
    <div
      ref={ref}
      className="wf-card"
      style={{
        position: "absolute",
        left: WF_X[step.side],
        top: wfCardTop(idx),
        width: WF_CARD_W,
        background: "rgba(15,20,40,0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: "20px 24px",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: `0 8px 32px ${step.color}26`,
        transition: "border-color 0.25s ease, transform 0.25s ease",
        zIndex: 2,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${step.color}80`;
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "";
      }}
    >
      {/* Badge + dot */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          color: step.color, background: `${step.color}18`,
          border: `1px solid ${step.color}30`,
          borderRadius: 999, padding: "2px 8px",
        }}>
          {step.badge}
        </span>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: step.color, flexShrink: 0,
          boxShadow: `0 0 6px ${step.color}`,
        }} />
      </div>
      {/* Title */}
      <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.35, margin: "0 0 8px" }}>
        {step.title}
      </h3>
      {/* Body */}
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", lineHeight: 1.6, margin: "0 0 14px" }}>
        {step.body}
      </p>
      {/* Tag */}
      <span style={{
        fontSize: "0.72rem", fontWeight: 600, color: step.color,
        background: `${step.color}12`, borderRadius: 6,
        padding: "4px 10px", display: "inline-block",
      }}>
        {step.tag}
      </span>
    </div>
  );
}

function WorkflowLines({ sectionRef }: { sectionRef: React.RefObject<HTMLDivElement> }) {
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const paths = WF_STEPS.slice(0, -1).map((_, i) => wfPath(WF_STEPS, i, i + 1));
  const svgH = wfCardTop(WF_STEPS.length - 1) + WF_CARD_H + 40;

  useEffect(() => {
    // Measure actual path lengths, set up draw animation start state
    pathRefs.current.forEach((path) => {
      if (!path) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
    });

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        pathRefs.current.forEach((path, i) => {
          if (!path) return;
          setTimeout(() => {
            if (!path) return;
            // Animate the line drawing
            path.style.transition = "stroke-dashoffset 1.5s ease-in-out";
            path.style.strokeDashoffset = "0";
            // After draw completes, switch to dashed style
            setTimeout(() => {
              if (!path) return;
              path.style.transition = "";
              path.style.strokeDasharray = "6 4";
              path.style.strokeDashoffset = "0";
            }, 1560);
          }, i * 300);
        });
        io.disconnect();
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, [sectionRef]);

  return (
    <svg
      width={WF_CONTAINER_W}
      height={svgH}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 1, overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <filter id="wf-dot-glow" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {paths.map((d, i) => {
        const pid = `wf-p${i}`;
        return (
          <g key={i}>
            {/* The path that draws itself in, then switches to dashed */}
            <path
              id={pid}
              ref={(el) => { pathRefs.current[i] = el; }}
              d={d}
              fill="none"
              stroke="rgba(55,138,221,0.3)"
              strokeWidth={1.5}
            />
            {/* Glowing dot that travels along each path */}
            <circle r={3} fill="white" filter="url(#wf-dot-glow)">
              <animateMotion dur={`${2.4 + i * 0.35}s`} repeatCount="indefinite" begin={`${i * 0.55}s`}>
                <mpath href={`#${pid}`} />
              </animateMotion>
            </circle>
          </g>
        );
      })}
    </svg>
  );
}

function Roadmap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerH = wfCardTop(WF_STEPS.length - 1) + WF_CARD_H + 60;

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#000",
        backgroundImage: "radial-gradient(circle, rgba(55,138,221,0.15) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        borderTop: "1px solid #1f1f1f",
        position: "relative",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(55,138,221,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Section header */}
      <div style={{ position: "relative", zIndex: 5, textAlign: "center", padding: "80px 24px 0" }}>
        <div className="mb-4">
          <span className="terminal-label">&gt;&gt; ASÍ TRABAJAMOS CONTIGO</span>
        </div>
        <h2
          className="mb-4 text-balance font-extrabold tracking-tight text-white"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
        >
          Simple. Claro. Sin sorpresas.
        </h2>
        <p
          className="mb-0 text-white/40"
          style={{ fontSize: "clamp(1rem, 2vw, 1.125rem)" }}
        >
          Esto es exactamente lo que pasa desde que nos contactas hasta que tu sistema está funcionando.
        </p>
      </div>

      {/* Desktop: zigzag workflow map */}
      <div
        className="hidden md:block"
        style={{
          position: "relative",
          maxWidth: WF_CONTAINER_W,
          margin: "64px auto 80px",
          height: containerH,
        }}
      >
        <WorkflowLines sectionRef={sectionRef as React.RefObject<HTMLDivElement>} />
        {WF_STEPS.map((step, i) => (
          <WorkflowCard key={i} step={step} idx={i} />
        ))}
      </div>

      {/* Mobile: stacked cards */}
      <div
        className="md:hidden flex flex-col gap-4"
        style={{ maxWidth: 380, margin: "60px auto 80px", padding: "0 16px" }}
      >
        {WF_STEPS.map((step, i) => (
          <div
            key={i}
            style={{
              background: "rgba(15,20,40,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: "20px 24px",
              boxShadow: `0 8px 32px ${step.color}26`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: step.color, background: `${step.color}18`,
                border: `1px solid ${step.color}30`,
                borderRadius: 999, padding: "2px 8px",
              }}>
                {step.badge}
              </span>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: step.color, boxShadow: `0 0 6px ${step.color}` }} />
            </div>
            <h3 style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", lineHeight: 1.35, margin: "0 0 8px" }}>
              {step.title}
            </h3>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.8rem", lineHeight: 1.6, margin: "0 0 14px" }}>
              {step.body}
            </p>
            <span style={{
              fontSize: "0.72rem", fontWeight: 600, color: step.color,
              background: `${step.color}12`, borderRadius: 6,
              padding: "4px 10px", display: "inline-block",
            }}>
              {step.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   AUTOMATION SCORE QUIZ
───────────────────────────────────────────── */
type QuizQuestion = {
  question: string;
  options: { label: string; pts: number }[];
};

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "¿Cuántos leads recibes por mes?",
    options: [
      { label: "Menos de 30", pts: 10 },
      { label: "Entre 30 y 100", pts: 25 },
      { label: "Más de 100", pts: 40 },
    ],
  },
  {
    question: "¿En cuánto tiempo respondes a un lead nuevo?",
    options: [
      { label: "En minutos — tengo sistema", pts: 40 },
      { label: "En horas", pts: 20 },
      { label: "Al día siguiente o más", pts: 0 },
    ],
  },
  {
    question: "¿Tienes seguimiento automático después del primer contacto?",
    options: [
      { label: "Sí, está automatizado", pts: 40 },
      { label: "Lo hago manual", pts: 15 },
      { label: "No tengo seguimiento", pts: 0 },
    ],
  },
  {
    question: "¿Sabes exactamente cuántos leads se convirtieron este mes?",
    options: [
      { label: "Sí, tengo datos claros", pts: 30 },
      { label: "Más o menos", pts: 15 },
      { label: "No tengo idea", pts: 0 },
    ],
  },
  {
    question: "¿Qué pasa cuando tu equipo no está disponible?",
    options: [
      { label: "El sistema responde solo", pts: 30 },
      { label: "Pierdo leads, lo sé", pts: 10 },
      { label: "Depende del día", pts: 5 },
    ],
  },
];

const MAX_RAW_SCORE = 180;
function normalizeScore(raw: number) { return Math.round((raw / MAX_RAW_SCORE) * 100); }
function getScoreColor(n: number) { return n === 0 ? "rgba(255,255,255,0.25)" : n <= 30 ? "#f87171" : n <= 60 ? "#facc15" : "#4ade80"; }
function getScoreLabel(n: number) { return n <= 30 ? "Crítico" : n <= 60 ? "En riesgo" : "Listo para escalar"; }

type QuizTier = {
  label: string;
  color: string;
  title: string;
  body: string;
  cta: string;
};

function getQuizTier(score: number): QuizTier {
  const n = normalizeScore(score);
  if (n <= 30) {
    return {
      label: "CRÍTICO",
      color: "#f87171",
      title: "Tu negocio está perdiendo ventas cada día.",
      body: "Sin un sistema, cada lead que no respondes a tiempo es dinero que se va con tu competencia. Esto tiene solución inmediata.",
      cta: "Quiero solucionar esto ahora",
    };
  }
  if (n <= 60) {
    return {
      label: "EN RIESGO",
      color: "#facc15",
      title: "Estás dejando dinero sobre la mesa.",
      body: "Tu negocio funciona, pero le faltan piezas clave. Un sistema bien conectado puede duplicar tu conversión.",
      cta: "Ver cómo mejorar mi sistema",
    };
  }
  return {
    label: "LISTO PARA ESCALAR",
    color: "#4ade80",
    title: "Estás listo para automatizar — actuemos rápido.",
    body: "Tienes la base. Con el sistema correcto puedes escalar sin contratar más gente.",
    cta: "Quiero escalar mi sistema",
  };
}

function AnimatedScore({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    const duration = 1500;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);

  return <>{display}</>;
}

function LiveScore({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = value;
    if (from === value) return;

    // Pop animation
    const el = spanRef.current;
    if (el && value > 0) {
      el.classList.remove("score-pop");
      void el.offsetWidth; // force reflow to restart animation
      el.classList.add("score-pop");
    }

    let start: number | null = null;
    const duration = 500;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + eased * (value - from)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);

  return <span ref={spanRef} className="inline-block">{display}</span>;
}

function CircularProgress({ score, color }: { score: number; color: string }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOffset(circ - (score / 100) * circ);
    }, 100);
    return () => clearTimeout(timeout);
  }, [score, circ]);

  return (
    <svg width="136" height="136" viewBox="0 0 136 136" style={{ display: "block" }}>
      <circle cx="68" cy="68" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      <circle
        cx="68" cy="68" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 68 68)"
        style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.34,1.56,0.64,1)" }}
      />
    </svg>
  );
}

const CONFETTI_COLORS = ["#3b82f6", "#8b5cf6", "#a78bfa", "#60a5fa", "#c4b5fd", "#818cf8"];
function QuizConfetti() {
  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        delay: Math.random() * 0.7,
        duration: 1.1 + Math.random() * 0.9,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.round(4 + Math.random() * 4),
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
      })),
    []
  );
  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 5 }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.borderRadius,
            animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}

function AutomationQuiz({ onOpenBooking }: { onOpenBooking: () => void }) {
  const [step, setStep] = useState<"quiz" | "result">("quiz");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedPts, setSelectedPts] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [liveScore, setLiveScore] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [waSent, setWaSent] = useState(false);
  const [saved, setSaved] = useState(false);

  const totalQuestions = QUIZ_QUESTIONS.length;

  function handleOption(label: string, pts: number) {
    setSelectedOption(label);
    setLiveScore((prev) => prev + pts);
    setVisible(false);
    setTimeout(() => {
      setSelectedOption(null);
      setLastAnswer(label);
      const newAnswers = [...answers, label];
      const newPts = [...selectedPts, pts];
      if (current + 1 < totalQuestions) {
        setAnswers(newAnswers);
        setSelectedPts(newPts);
        setCurrent(current + 1);
        setVisible(true);
      } else {
        const total = newPts.reduce((a, b) => a + b, 0);
        setAnswers(newAnswers);
        setSelectedPts(newPts);
        setScore(total);
        setStep("result");
        setVisible(true);
        // save to supabase
        if (!saved) {
          setSaved(true);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (getSupabase()?.from("quiz_results") as any)?.insert({
            score: total,
            q1: newAnswers[0] ?? null,
            q2: newAnswers[1] ?? null,
            q3: newAnswers[2] ?? null,
            q4: newAnswers[3] ?? null,
            q5: newAnswers[4] ?? null,
          });
        }
      }
    }, 300);
  }

  function handleWhatsApp() {
    const tier = getQuizTier(score);
    const summary = answers.map((a, i) => `P${i + 1}: ${a}`).join(" | ");
    const msg = encodeURIComponent(
      `Hola, hice el diagnóstico de Monkeia.\nMi puntaje: ${normalizeScore(score)}/100 (${tier.label})\n${summary}`
    );
    if (phone) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (getSupabase()?.from("quiz_results") as any)?.update({ whatsapp: phone }).eq("score", score);
    }
    window.open(`https://wa.me/50683225178?text=${msg}`, "_blank");
    setWaSent(true);
  }

  const tier = step === "result" ? getQuizTier(score) : null;
  const q = QUIZ_QUESTIONS[current];
  const normalizedLiveScore = normalizeScore(liveScore);
  const scoreColor = getScoreColor(normalizedLiveScore);
  const scoreLabel = getScoreLabel(normalizedLiveScore);

  return (
    <section className="relative border-t border-[#1f1f1f] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-4 text-center">
          <span className="terminal-label">&gt;&gt; DIAGNÓSTICO GRATUITO</span>
        </div>
        <h2
          className="mb-4 text-balance text-center font-extrabold tracking-tight text-white"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
        >
          En 2 minutos sabes exactamente por qué no estás cerrando más.
        </h2>
        <p
          className="mb-12 text-center text-white/40"
          style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)" }}
        >
          5 preguntas. Sin rodeos. Con tu resultado al final.
        </p>

        {/* Card */}
        <div
          className="quiz-card"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <div
            style={{
              borderRadius: "16px",
              padding: "clamp(24px, 5vw, 40px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
          {/* Top progress bar — 3px gradient */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background: "rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                width: `${step === "result" ? 100 : ((current + 1) / totalQuestions) * 100}%`,
                transition: "width 0.5s ease",
              }}
            />
          </div>

          {/* Quiz step */}
          {step === "quiz" && (
            <div
              key={current}
              className="quiz-question-enter"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-32px)",
                transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
              }}
            >
              {/* Header row: counter + live score */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginTop: "12px",
                  marginBottom: "22px",
                  gap: "16px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(255,255,255,0.35)",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    Pregunta {current + 1} de {totalQuestions}
                  </p>
                  {/* Progress bar */}
                  <div
                    style={{
                      height: "3px",
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: "999px",
                      overflow: "hidden",
                      maxWidth: "160px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                        borderRadius: "999px",
                        width: `${((current + 1) / totalQuestions) * 100}%`,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </div>

                {/* Live score */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: "48px",
                      fontWeight: 800,
                      color: scoreColor,
                      lineHeight: 1,
                      transition: "color 0.5s ease",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    <LiveScore value={normalizedLiveScore} />
                  </div>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: scoreColor,
                      textTransform: "uppercase",
                      transition: "color 0.5s ease",
                      marginTop: "2px",
                    }}
                  >
                    {scoreLabel}
                  </div>
                </div>
              </div>

              {/* Question */}
              <h3
                style={{
                  fontSize: "clamp(1.05rem, 2.5vw, 1.3rem)",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "16px",
                  lineHeight: 1.35,
                }}
              >
                {q.question}
              </h3>

              {/* Previous answer (locked) */}
              {lastAnswer && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "9px 14px 9px 16px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderLeft: "3px solid rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    opacity: 0.45,
                    cursor: "default",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
                    {lastAnswer}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
                    ✓
                  </span>
                </div>
              )}

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {q.options.map((opt) => {
                  const isSelected = selectedOption === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleOption(opt.label, opt.pts)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "13px 16px",
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(59,130,246,0.20), rgba(139,92,246,0.20))"
                          : "rgba(255,255,255,0.03)",
                        border: isSelected
                          ? "1px solid rgba(139,92,246,0.45)"
                          : "1px solid rgba(255,255,255,0.07)",
                        borderLeft: isSelected
                          ? "3px solid #8b5cf6"
                          : "3px solid transparent",
                        borderRadius: "10px",
                        color: isSelected ? "#fff" : "rgba(255,255,255,0.78)",
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        opacity: selectedOption !== null && !isSelected ? 0.4 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (isSelected) return;
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "linear-gradient(135deg, rgba(59,130,246,0.10), rgba(139,92,246,0.10))";
                        el.style.borderColor = "rgba(59,130,246,0.25)";
                        el.style.borderLeftColor = "#3b82f6";
                        const span = el.querySelector<HTMLSpanElement>("span.opt-label");
                        if (span) span.style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        if (isSelected) return;
                        const el = e.currentTarget as HTMLButtonElement;
                        el.style.background = "rgba(255,255,255,0.03)";
                        el.style.borderColor = "rgba(255,255,255,0.07)";
                        el.style.borderLeftColor = "transparent";
                        const span = el.querySelector<HTMLSpanElement>("span.opt-label");
                        if (span) span.style.transform = "translateX(0)";
                      }}
                    >
                      <span
                        className="opt-label"
                        style={{ transition: "transform 0.15s ease", display: "inline-block" }}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span
                          className="quiz-check-appear"
                          style={{ color: "#a78bfa", fontWeight: 700, flexShrink: 0, marginLeft: "8px" }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Result step */}
          {step === "result" && tier && (
            <div className="result-reveal">
              <QuizConfetti />
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#378ADD",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  marginBottom: "24px",
                  marginTop: "8px",
                }}
              >
                Tu resultado
              </p>

              {/* Score ring */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "24px",
                  gap: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ position: "relative", width: 136, height: 136, flexShrink: 0 }}>
                  <CircularProgress score={normalizeScore(score)} color={tier.color} />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: tier.color,
                        lineHeight: 1,
                      }}
                    >
                      <AnimatedScore target={normalizeScore(score)} />
                    </span>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)" }}>
                      / 100
                    </span>
                  </div>
                </div>
                <div>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: "100px",
                      background: `${tier.color}22`,
                      color: tier.color,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      marginBottom: "10px",
                    }}
                  >
                    {tier.label}
                  </span>
                  <h3
                    style={{
                      fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "8px",
                      lineHeight: 1.3,
                    }}
                  >
                    {tier.title}
                  </h3>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                    {tier.body}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={onOpenBooking}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  background: tier.color,
                  border: "none",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  marginBottom: "24px",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              >
                {tier.cta}
              </button>

              {/* WhatsApp capture */}
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "20px",
                }}
              >
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: "14px",
                    fontWeight: 600,
                  }}
                >
                  Recibe tu plan de acción personalizado por WhatsApp
                </p>
                {waSent ? (
                  <p style={{ fontSize: "0.85rem", color: "#10b981" }}>
                    ¡Listo! Te enviamos tu plan.
                  </p>
                ) : (
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+506 8322 5178"
                      style={{
                        flex: 1,
                        minWidth: "140px",
                        padding: "12px 14px",
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                    <button
                      onClick={handleWhatsApp}
                      style={{
                        padding: "12px 18px",
                        background: "#25D366",
                        border: "none",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Enviar mi plan por WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
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
      body: "El lead ya compró en otro lado.",
      delay: 0,
    },
    {
      icon: <IconEye />,
      title: "No sabes qué pasó.",
      body: "Solo sabes que no cerró.",
      delay: 120,
    },
    {
      icon: <IconUsers />,
      title: "Todo depende de ti.",
      body: "Y tú no puedes estar en todas partes.",
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
   PROOF (rotating border cards + testimonials)
───────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Gerardo",
    initials: "GE",
    color: "#378ADD",
    business: "Toro 650 — E-commerce",
    stars: 5,
    quote:
      "Facturamos más de $2,500 en un solo mes gracias a una estrategia en Instagram Stories. Monkeia transformó cómo vendemos online.",
    date: "Verificado",
  },
  {
    name: "Maribel Agüero",
    initials: "MA",
    color: "#10b981",
    business: "Latina Pizza",
    stars: 5,
    quote:
      "Incrementamos las ventas un 45% en los primeros 2 meses. No esperábamos resultados tan rápidos. Totalmente recomendado.",
    date: "Verificado",
  },
  {
    name: "Juan Cáceres",
    initials: "JC",
    color: "#f59e0b",
    business: "Multinivel",
    stars: 5,
    quote:
      "Llevamos más de 10,000 leads a un webinar gracias a la automatización que implementó Monkeia. Un sistema que trabaja solo.",
    date: "Verificado",
  },
  {
    name: "Eliana",
    initials: "EL",
    color: "#8b5cf6",
    business: "Flowback — Soporte",
    stars: 5,
    quote:
      "El soporte de Monkeia es excepcional. Siempre disponibles, siempre resolviendo. Nos dieron tranquilidad total en el proceso.",
    date: "Verificado",
  },
  {
    name: "Gianpiero Fusco",
    initials: "GF",
    color: "#378ADD",
    business: "@sw_gianpiero",
    stars: 5,
    photoUrl: "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/03137106.jpg",
    quote:
      "Antes perdía leads todos los días. Ahora el sistema los trabaja solo y yo solo cierro los que ya están listos.",
    date: "Verificado",
  },
  {
    name: "Jimmy Labin",
    initials: "JL",
    color: "#378ADD",
    business: "Dueño de Flowback",
    stars: 5,
    photoUrl: "https://cdn.ln-cdn.com/c/recQV0G1EGj5iilpD/images/56048203.png",
    quote:
      "Dejé de depender de mi equipo para el seguimiento. El pipeline trabaja 24/7. Nunca pensé que sería tan simple de instalar.",
    date: "Verificado",
  },
  {
    name: "Rubén Ocampo Licea",
    initials: "RO",
    color: "#10b981",
    business: "Mi Ranking — Tennis",
    stars: 5,
    quote:
      "Pasamos de atender 300 jugadores mensuales a más de 7 mil. El sistema revolucionó nuestra atención al cliente con respuestas instantáneas 24/7.",
    date: "Sep 2023",
  },
  {
    name: "Alejandro Restrepo",
    initials: "AR",
    color: "#f59e0b",
    business: "Agencia de Marketing",
    stars: 5,
    quote:
      "Nunca fui partidario de los chatbots pero wow, totalmente satisfecho. El tiempo y lo que me ahorro no tiene precio.",
    date: "Sep 2023",
  },
  {
    name: "SERcuidados",
    initials: "SC",
    color: "#8b5cf6",
    business: "Servicio de Enfermería",
    stars: 5,
    quote:
      "El enfoque orientado a resultados me da la confianza para recomendar Monkeia en el orden más alto. Profesionalismo y valor real.",
    date: "Sep 2023",
  },
  {
    name: "Gonzalo Ollarzún",
    initials: "GO",
    color: "#378ADD",
    business: "Cliente Monkeia",
    stars: 5,
    quote:
      "Monkeia superó mis expectativas en soporte técnico. Siempre disponibles para responder y resolver cualquier problema al instante.",
    date: "Verificado",
  },
  {
    name: "Alan Solís",
    initials: "AS",
    color: "#10b981",
    business: "Cliente Monkeia",
    stars: 5,
    quote:
      "La atención es excelente y el servicio muy innovador. Me gustó mucho la explicación y la resolución de dudas desde el primer día.",
    date: "Verificado",
  },
  {
    name: "Graciela Arredondo",
    initials: "GA",
    color: "#f59e0b",
    business: "Cliente Monkeia",
    stars: 5,
    quote:
      "Gran soporte al cliente. Me solucionaron todas mis dudas. Monkeia es super eficiente y el equipo siempre está dispuesto a ayudar.",
    date: "Verificado",
  },
  {
    name: "Cliente verificado",
    initials: "CV",
    color: "#8b5cf6",
    business: "E-commerce",
    stars: 5,
    quote:
      "¡Monkeia es simplemente fenomenal! Nos ayudaron a personalizar nuestras soluciones y siempre estuvieron ahí para asegurarse de que estuviéramos satisfechos.",
    date: "Verificado",
  },
  {
    name: "Cliente verificado",
    initials: "CV",
    color: "#378ADD",
    business: "Negocio digital",
    stars: 5,
    quote:
      "Han demostrado profesionalismo al resolver nuestros problemas y ofrecer valiosas mentorías. Sus capacitaciones nos ayudaron a maximizar nuestro impacto en línea.",
    date: "Verificado",
  },
  {
    name: "Cliente verificado",
    initials: "CV",
    color: "#10b981",
    business: "Empresa",
    stars: 5,
    quote:
      "No podríamos estar más satisfechos. Su chatbot IA ha superado todas nuestras expectativas y ha elevado nuestra empresa al siguiente nivel.",
    date: "Verificado",
  },
  {
    name: "Cliente verificado",
    initials: "CV",
    color: "#f59e0b",
    business: "Cliente Monkeia",
    stars: 5,
    quote:
      "Desarrollaron un chatbot IA personalizado para nuestra empresa que superó todas nuestras expectativas. Definitivamente los recomendaría.",
    date: "Verificado",
  },
];

function MarqueeCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div
      style={{
        width: 320,
        flexShrink: 0,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {/* Header: avatar + name + stars */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {t.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.photoUrl}
            alt={t.name}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${t.color}`,
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: t.color + "33",
              border: `1px solid ${t.color}66`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
              flexShrink: 0,
            }}
          >
            {t.initials}
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#fff",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {t.name}
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            {t.business}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#f59e0b", flexShrink: 0 }}>
          {"★".repeat(t.stars)}
        </div>
      </div>

      {/* Quote */}
      <p
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.6,
          fontStyle: "italic",
          margin: 0,
        }}
      >
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Date */}
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
        {t.date}
      </div>
    </div>
  );
}

function MarqueeRow({
  cards,
  direction,
  duration,
}: {
  cards: (typeof TESTIMONIALS)[number][];
  direction: "left" | "right";
  duration: number;
}) {
  const [paused, setPaused] = useState(false);
  const allCards = [...cards, ...cards];

  return (
    <div
      style={{
        overflow: "hidden",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          width: "max-content",
          animation: `${direction === "left" ? "marqueeLeft" : "marqueeRight"} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {allCards.map((card, i) => (
          <MarqueeCard key={i} t={card} />
        ))}
      </div>
    </div>
  );
}

function Proof() {
  return (
    <section className="border-t border-[#1f1f1f] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 text-center">
          <span className="terminal-label">&gt;&gt; RESULTADOS DE CLIENTES</span>
        </div>
        <h2
          className="mb-16 text-balance text-center font-extrabold tracking-tight text-white"
          style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}
        >
          Funciona.
        </h2>

        {/* Testimonials marquee */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <MarqueeRow
            cards={TESTIMONIALS.slice(0, 8)}
            direction="left"
            duration={35}
          />
          <MarqueeRow
            cards={TESTIMONIALS.slice(7, 15)}
            direction="right"
            duration={40}
          />
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
    badge: "Quiero entender primero",
    badgeColor: "gray" as const,
    title: "Diagnóstico Profundo",
    description:
      "Analizamos tu proceso actual de ventas y leads. Te entregamos un documento con exactamente dónde se rompe tu embudo y qué sistema necesitas.",
    features: [
      "Análisis de tu proceso actual",
      "Identificación de puntos de fuga",
      "Hoja de ruta de implementación",
      "Se descuenta si contratas el sistema",
    ],
    cta: "Quiero la auditoría",
    featured: false,
  },
  {
    badge: "Quiero arrancar ya",
    badgeColor: "blue" as const,
    title: "Instalamos tu sistema",
    description:
      "Implementamos la pieza exacta que tu negocio necesita. Desde un bot de WhatsApp hasta un dashboard conectado a Meta Ads.",
    features: [
      "Diagnóstico gratuito incluido",
      "Timeline definido según tu proyecto",
      "IA + supervisión humana",
      "30 días de soporte incluido",
    ],
    cta: "Quiero mi diagnóstico",
    featured: true,
  },
  {
    badge: "Lo quiero todo",
    badgeColor: "purple" as const,
    title: "Sistema Completo — De cero a automático",
    description:
      "Para negocios que necesitan un sistema completo: captura, calificación, nurturing, cierre y dashboard. Todo conectado. Todo automatizado.",
    features: [
      "Auditoría incluida",
      "Diseño e implementación completa",
      "IA + equipo humano de supervisión",
      "Soporte y optimización continua",
    ],
    cta: "Hablar con nosotros",
    featured: false,
  },
];

function PricingCTA({ featured, children }: { featured: boolean; children: React.ReactNode }) {
  const openBooking = useOpenBooking();
  return (
    <button
      onClick={openBooking}
      className="flex w-full items-center justify-center font-semibold transition-opacity duration-200 hover:opacity-80"
      style={{
        height: "44px",
        borderRadius: "8px",
        fontSize: "14px",
        background: featured ? "#10b981" : "rgba(255,255,255,0.07)",
        color: featured ? "#fff" : "rgba(255,255,255,0.8)",
        border: featured ? "none" : "1px solid rgba(255,255,255,0.1)",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

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
                <PricingCTA featured={card.featured}>{card.cta}</PricingCTA>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CLOSING CTA
───────────────────────────────────────────── */
function ClosingCTA() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden border-t border-[#1f1f1f] px-6"
      style={{ background: "#000", paddingTop: "100px", paddingBottom: "100px" }}
    >
      {/* Giant decorative "5" — absolute background, does not affect flow */}
      <div
        className="scanline-5 pointer-events-none select-none absolute top-0 left-0 right-0 w-full text-center z-0"
        aria-hidden="true"
      >
        <span
          className="glitch-5 font-black leading-none block text-[120px] md:text-[300px]"
          style={{ color: "rgba(55,138,221,0.1)" }}
        >
          5
        </span>
      </div>

      <div className="relative mx-auto max-w-3xl text-center" style={{ zIndex: 10 }}>
        {/* Badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-2">
            <span
              className="h-2 w-2 rounded-full bg-red-500 animate-pulse"
              style={{ boxShadow: "0 0 6px rgba(239,68,68,0.8)" }}
            />
            <span
              className="font-mono text-xs font-semibold tracking-widest text-red-400"
              style={{ letterSpacing: "0.16em" }}
            >
              QUEDAN 3 CUPOS ESTE MES
            </span>
          </div>
        </div>

        {/* Main headline */}
        <h2
          className="mb-8 font-extrabold tracking-tight text-white"
          style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)", lineHeight: 1.1 }}
        >
          No trabajamos con todos.
          <br />
          Elegimos los negocios que queremos ver crecer.
        </h2>

        {/* Subtext — three lines */}
        <p
          className="mb-10 leading-loose"
          style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "rgba(255,255,255,0.45)" }}
        >
          Cada sistema se diseña e implementa a medida.
          <br />
          Si no ves resultados en 30 días — seguimos sin costo.
          <br />
          30 minutos es todo lo que necesitas para saber si hay fit.
        </p>

        {/* CTA */}
        <CTAButton large>
          Quiero mi diagnóstico
        </CTAButton>

        {/* Trust signals */}
        <p
          className="mt-6"
          style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}
        >
          Sin compromiso · Respuesta en menos de 24h · Diagnóstico 100% gratuito
        </p>
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
  );
}

/* ─────────────────────────────────────────────
   HOME
───────────────────────────────────────────── */
export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const openBooking = useCallback(() => setBookingOpen(true), []);

  return (
    <BookingModalContext.Provider value={openBooking}>
      <div className="min-h-screen bg-black text-white">
        <CursorGlow />
        <Nav />
        <main>
          <Hero />
          {/* <ClientsCarousel /> */}
          <Problem />
          <AutomationQuiz onOpenBooking={openBooking} />
          {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
          <Roadmap />
          <Proof />
          <Services />
          <ClosingCTA />
        </main>
        <Footer />
      </div>
    </BookingModalContext.Provider>
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
