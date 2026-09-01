import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      { source: "/diagnostico", destination: "/", permanent: true },
      { source: "/diagnostico-b2c", destination: "/", permanent: true },
      { source: "/services", destination: "/", permanent: true },
      { source: "/about", destination: "/", permanent: true },
      { source: "/monkeiapp", destination: "/", permanent: true },
      { source: "/test30", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
