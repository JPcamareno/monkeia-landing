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
    ];
  },
};

export default nextConfig;
