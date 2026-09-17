import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // `npm run export` produces a static copy; normal dev/build/start stay standard Next.js.
  output: process.env.NEXT_STATIC_EXPORT === "true" ? "export" : undefined,
  // Static snapshots include TSX pages only, omitting the server-only route.ts API.
  pageExtensions:
    process.env.NEXT_STATIC_EXPORT === "true"
      ? ["tsx"]
      : ["tsx", "ts", "jsx", "js"],
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: process.cwd() },
};

export default nextConfig;
