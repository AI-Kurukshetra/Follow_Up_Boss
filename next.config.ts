import type { NextConfig } from "next";
import path from "path";

const projectRoot = path.resolve(process.cwd());
const tailwindAlias = path.join(projectRoot, "node_modules", "tailwindcss");

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      tailwindcss: tailwindAlias,
    },
  },
  // Production build (e.g. on Vercel) may use webpack for CSS; ensure Tailwind resolves
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      tailwindcss: tailwindAlias,
    };
    return config;
  },
};

export default nextConfig;
