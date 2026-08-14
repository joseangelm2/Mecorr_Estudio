import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // El proxy /api/_supabase/* pasa por este límite antes de llegar a Supabase Storage;
    // sin esto, videos >10MB se cortan a medio subir ("socket hang up").
    proxyClientMaxBodySize: '100mb',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  allowedDevOrigins: ['rake-ducktail-compactor.ngrok-free.dev'],
  async rewrites() {
    return [
      {
        source: '/api/_supabase/:path*',
        destination: 'http://127.0.0.1:54321/:path*',
      },
    ]
  },
};

export default nextConfig;
