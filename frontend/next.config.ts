import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '4404' },
      { protocol: 'http', hostname: '127.0.0.1', port: '4404' },
      { protocol: 'http', hostname: '[::1]', port: '4404' },
    ],
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: 'http://localhost:4404/api/:path*' },
    ];
  },
};

export default nextConfig;
