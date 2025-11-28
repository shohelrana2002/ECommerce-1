import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname:
          "blob:http://localhost:3000/60dc62c4-e2b6-4133-b55a-f26a405d4d87",
      },
    ],
  },
};

export default nextConfig;
