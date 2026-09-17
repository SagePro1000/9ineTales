import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `npm run export` produces a static copy; normal dev/build/start stay standard Next.js.
  output: process.env.NEXT_STATIC_EXPORT === "true" ? "export" : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: process.cwd() },
};

export default nextConfig;
