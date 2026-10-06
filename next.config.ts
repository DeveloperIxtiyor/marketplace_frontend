import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["simple-gown-justify.ngrok-free.dev"],


  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://apple.com', // Apple rasmlari uchun ruxsat
      },
      {
        protocol: 'https',
        hostname: '*.ngrok-free.dev', // Agar ngrok orqali keladigan rasmlar bo'lsa, wildcard ishlatsa bo'ladi
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/backend/:path*", destination: "http://127.0.0.1:8000/:path*" },
    ];
  },
};

export default nextConfig;