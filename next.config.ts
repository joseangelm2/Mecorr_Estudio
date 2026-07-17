import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {
    root: __dirname,
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
