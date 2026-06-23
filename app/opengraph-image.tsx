import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
          color: "#fff",
          padding: 80,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 800 }}>Monkeia</div>
        <div style={{ fontSize: 38, marginTop: 24, color: "#9ca3af" }}>
          El sistema que convierte tus leads de Meta en clientes.
        </div>
      </div>
    ),
    { ...size }
  );
}
