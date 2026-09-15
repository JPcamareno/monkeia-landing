import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      // Marca anterior (chatbots): Google todavía indexa estas URL, hoy 404.
      { source: "/services", destination: "/", permanent: true },
      { source: "/about", destination: "/", permanent: true },
      { source: "/monkeiapp", destination: "/", permanent: true },
      { source: "/test30", destination: "/", permanent: true },
      // Diagnóstico: reemplazado por la reserva directa (TidyCal). Pendiente
      // de rediseño futuro — redirect temporal (307) para no consolidar
      // señales de forma permanente sobre una URL que va a volver a usarse.
      { source: "/diagnostico", destination: "/", permanent: false },
      { source: "/diagnostico-b2c", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
