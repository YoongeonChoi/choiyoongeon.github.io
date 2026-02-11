import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Trailing slashes ensure each route gets its own directory with index.html
  trailingSlash: true,
};

export default nextConfig;
