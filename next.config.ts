import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",          // für GitHub Pages/Netlify: statischer Export
  reactStrictMode: true,     // Dev-Sicherheit
  poweredByHeader: false,    // "X-Powered-By: Next.js" weg
  images: {                  // sharp/optional deps umgehen
    unoptimized: true,
  },
};

export default nextConfig;
