"use client";

import { useCallback, useSyncExternalStore } from "react";

type Consent = "accepted" | "rejected" | null;
const STORAGE_KEY = "monkeia_cookie_consent";

let memoryConsent: Consent = null;
const listeners = new Set<() => void>();

function readConsent(): Consent {
  if (memoryConsent) return memoryConsent;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

function readServerConsent(): Consent {
  return null;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function writeConsent(value: "accepted" | "rejected") {
  memoryConsent = value;
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // localStorage no disponible (modo privado, etc.) — el consentimiento
    // solo dura la sesión en memoria.
  }
  listeners.forEach((l) => l());
}

export function useConsent() {
  const consent = useSyncExternalStore(subscribe, readConsent, readServerConsent);
  const setConsent = useCallback((value: "accepted" | "rejected") => writeConsent(value), []);
  return { consent, setConsent };
}

export default function ConsentGate({ children }: { children: React.ReactNode }) {
  const { consent, setConsent } = useConsent();

  return (
    <>
      {consent === "accepted" && children}

      {consent === null && (
        <div
          role="dialog"
          aria-label="Aviso de cookies"
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            right: 16,
            zIndex: 9999,
            maxWidth: 560,
            margin: "0 auto",
            background: "#111",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          }}
        >
          <p style={{ flex: "1 1 260px", fontSize: 13, color: "rgba(255,255,255,0.75)", margin: 0 }}>
            Usamos cookies de analítica (Google Analytics, Meta, Microsoft Clarity) para
            entender cómo se usa el sitio. Puedes leer más en nuestra{" "}
            <a href="/privacidad" style={{ color: "#378ADD", textDecoration: "underline" }}>
              política de privacidad
            </a>
            .
          </p>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => setConsent("rejected")}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Rechazar
            </button>
            <button
              onClick={() => setConsent("accepted")}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                background: "#378ADD",
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
