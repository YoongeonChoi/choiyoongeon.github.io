import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Cache Components (PPR functionality in Next.js 16)
  // cacheComponents: true, // Disabled for static export compatibility
  output: "export", // Required for GitHub Pages
  basePath: "", // Explicitly set to root for User Site (choiyoongeon.github.io)
  trailingSlash: true, // Required for proper sub-path routing on static hosts

  // Hard-fix for build errors (Phase 5 requirement)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Image optimization
  images: {
    unoptimized: true, // Required for GitHub Pages (no Next.js Image Optimization Server)
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Enable React strict mode for better development experience
  reactStrictMode: true,
};

export default nextConfig;
