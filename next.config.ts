import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
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
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://pub-be9e0552363545c5a4778d2715805f99.r2.dev https://pbs.twimg.com https://*.twimg.com; media-src 'self' blob: https://videos.pexels.com https://pub-be9e0552363545c5a4778d2715805f99.r2.dev https://*.wavespeed.ai; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.vxtwitter.com https://api.wavespeed.ai; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
